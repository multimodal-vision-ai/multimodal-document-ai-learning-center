"""Publication regressions: fail before writes, preserve history, verify the exact snapshot."""
import copy
import importlib.util
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts/radar"))
import render
from core import save
from publication_gate import assess_report, LEGACY_NOTE
from screening import build_queue, collect_screened, validate_storage
from verify_publication import verify, HOME_MARKERS, DETAIL_MARKERS
from test_screening import NOW, RESEARCH, report


class PublicationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.docs, self.data = self.root / "docs", self.root / "data"
        (self.docs / "radar").mkdir(parents=True)
        (self.docs / "index.md").write_text(
            "# 多模态视觉AI学习中心\n\n从当前主线走向未来\n\n[进入前沿动态](radar/index.md)\n", encoding="utf-8"
        )
        sections = "# 前沿动态\n\n## 重点推荐\n\n"
        for marker, heading in (("STAGE_TWO", ""), ("CHATGPT_WEEKLY", "本周精选"),
                                ("CHATGPT_MONTHLY", "本月研究机会"),
                                ("WEEKLY_ARCHIVE", "历史档案检索"), ("MONTHLY_ARCHIVE", "历史月报"),
                                ("CANDIDATES", "补充发现：待评估线索")):
            if heading:
                sections += f"\n## {heading}\n\n"
            sections += f"<!-- RADAR:{marker}-START -->\n<!-- RADAR:{marker}-END -->\n\n"
        (self.docs / "radar/index.md").write_text(sections, encoding="utf-8")
        for name, marker in (("projects", "PROJECTS"), ("tasks", "TASKS")):
            (self.docs / f"radar/{name}.md").write_text(
                f"# {name}\n\n<!-- RADAR:{marker}-START -->\n<!-- RADAR:{marker}-END -->\n", encoding="utf-8"
            )
        self.queue = build_queue([RESEARCH], NOW)
        self.good = report(self.queue, kind="weekly")
        self.good["scoring_source"] = "Research assessment <fixture>"
        for name, value in (("projects", []), ("tasks", []), ("candidates", []),
                            ("screening-queue", self.queue)):
            save(self.data / f"{name}.json", value)
        self.write(self.good)
        self.addCleanup(patch.stopall)
        patch.object(render, "DATA", self.data).start()
        patch.object(render, "DOCS", self.docs).start()

    def write(self, value, kind="weekly"):
        save(self.data / f"chatgpt-reviewed/latest-{kind}.json", value)

    def contents(self):
        return {p.relative_to(self.docs).as_posix(): p.read_bytes() for p in self.docs.rglob("*.md")}

    def test_invalid_scores_fail_every_surface_before_any_writes(self):
        for value in (1, -1, 11, True, "8", None, float("nan"), float("inf")):
            with self.subTest(score=value):
                bad = copy.deepcopy(self.good)
                bad["items"][0]["evaluation_dimensions"]["open_source"]["score"] = value
                self.write(bad)
                before = self.contents()
                with self.assertRaises(ValueError):
                    render.render(NOW)
                with self.assertRaises(ValueError):
                    render.chatgpt_report_listing(bad, "weekly", queue=self.queue)
                with self.assertRaises(ValueError):
                    render.archive_latest_reports({"weekly": bad}, self.queue)
                self.assertEqual(before, self.contents())
                self.assertFalse((self.data / "chatgpt-reviewed/archive").exists())
                self.assertTrue(validate_storage(self.data))
                self.assertNotIn(RESEARCH["title"], render.stage_two_detail_listing({"weekly": bad}, self.queue))

    def test_bad_envelopes_and_new_legacy_reports_fail_closed(self):
        mutations = [[], "invalid", {"items": []},
                     {**self.good, "status": "broken"},
                     {**self.good, "status": "pending"},
                     {**self.good, "items": None}, {**self.good, "items": {}},
                     {**self.good, "items": [None]},
                     {**self.good, "status": "completed", "items": []},
                     {**self.good, "status": "no_high_value"},
                     {**self.good, "generated_at": "yesterday"},
                     {**self.good, "screening_schema_version": None},
                     {**self.good, "screening_schema_version": 99},
                     {**self.good, "report_type": "monthly"}]
        for bad in mutations:
            with self.subTest(report=bad):
                with self.assertRaises(ValueError):
                    assess_report(bad, "weekly", self.queue)

    def test_invalid_monthly_blocks_valid_weekly_archive_atomically(self):
        monthly = copy.deepcopy(self.good)
        monthly["report_type"] = "monthly"
        monthly["items"][0]["confidence"] = "low"
        self.write(monthly, "monthly")
        with self.assertRaises(ValueError):
            render.render(NOW)
        self.assertFalse((self.data / "chatgpt-reviewed/archive").exists())

    def test_legacy_cards_remain_visible_with_date_and_without_stage_two_promotion(self):
        legacy = {"status": "completed", "generated_at": "2026-10-19T12:00:00Z",
                  "items": [{"title": "Legacy work", "selection_status": "selected"}]}
        self.write(legacy)
        self.assertEqual(render.archive_latest_reports({"weekly": legacy}, self.queue), 0)
        save(self.data / "chatgpt-reviewed/archive/weekly/legacy.json", legacy)
        render.render(NOW)
        page = (self.docs / "radar/index.md").read_text(encoding="utf-8")
        current = page.split("RADAR:CHATGPT_WEEKLY-START -->")[1].split("<!-- RADAR:CHATGPT_WEEKLY-END")[0]
        self.assertIn(LEGACY_NOTE, current)
        self.assertIn("Legacy work", current)
        self.assertIn("历史周报回顾", current)
        self.assertIn("2026-10-19", current)
        self.assertNotIn("完成复评后再进入", current)
        featured = page.split("RADAR:STAGE_TWO-START -->")[1].split("<!-- RADAR:STAGE_TWO-END")[0]
        self.assertNotIn("Legacy work", featured)
        history = render.archive_cards("weekly", self.queue)
        self.assertIn(LEGACY_NOTE, history)
        self.assertIn("Legacy work", history)
        for label in ("评分来源", "评价时间", "置信度"):
            self.assertIn(f"{label}：未提供", history)
        self.assertEqual(collect_screened({"weekly": legacy}, self.queue), ([], []))

    def test_archive_keeps_frozen_source_queue_and_rejects_bad_existing_v2(self):
        render.archive_latest_reports({"weekly": self.good}, self.queue)
        save(self.data / "screening-queue.json", {"candidates": []})
        self.assertIn(RESEARCH["title"], render.archive_cards("weekly"))
        bad = copy.deepcopy(self.good)
        bad["items"][0]["evaluation_dimensions"]["open_source"]["score"] = 1
        save(self.data / "chatgpt-reviewed/archive/weekly/bad.json", bad)
        with self.assertRaises(ValueError):
            render.archive_cards("weekly", self.queue)

    def test_not_recommended_items_never_become_cards(self):
        rejected = copy.deepcopy(self.good["items"][0])
        rejected.update(selection_status="not_recommended", title=RESEARCH["title"])
        rejected["evaluation_dimensions"]["open_source"]["score"] = 1
        mixed = copy.deepcopy(self.good)
        mixed["items"].append(rejected)
        html = render.chatgpt_report_listing(mixed, "weekly", queue=self.queue)
        self.assertEqual(html.count('class="radar-brief-card'), 1)

    @unittest.skipUnless(importlib.util.find_spec("mkdocs"), "MkDocs integration runs after docs dependencies are installed")
    def test_report_write_strict_build_preview_verification_and_stale_detection(self):
        config = self.root / "mkdocs.yml"
        config.write_text("site_name: Publication regression\n", encoding="utf-8")
        render.render(NOW)
        before = self.contents()
        render.render(NOW)
        self.assertEqual(before, self.contents())
        built = subprocess.run([sys.executable, "-m", "mkdocs", "build", "--strict",
                                "--no-directory-urls", "--config-file", str(config)],
                               capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(built.returncode, 0, built.stdout + built.stderr)
        home, detail = self.root / "site/index.html", self.root / "site/radar/index.html"
        errors, count = verify(home, detail, self.data)
        self.assertEqual(errors, [])
        self.assertEqual(count, 1)
        body = detail.read_text(encoding="utf-8")
        self.assertIn("Research assessment &lt;fixture&gt;", body)
        self.assertIn("评价时间：2026-10-22 12:00 UTC", body)
        self.assertIn("置信度：中", body)
        self.good["summary"] = "Updated report with identical recommended title"
        self.write(self.good)
        self.assertTrue(any("snapshot" in x for x in verify(home, detail, self.data)[0]))
        self.write({**self.good, "status": "no_high_value", "items": []})
        render.render(NOW)
        built = subprocess.run([sys.executable, "-m", "mkdocs", "build", "--strict",
                                "--no-directory-urls", "--config-file", str(config)], capture_output=True)
        self.assertEqual(built.returncode, 0, built.stderr)
        self.assertEqual(verify(home, detail, self.data), ([], 0))


if __name__ == "__main__":
    unittest.main()

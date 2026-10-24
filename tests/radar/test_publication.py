"""Regression tests for public-page markers and the fail-closed publication contract."""
import copy
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "radar"))

from core import save
from publication_gate import assess_report, validate_snapshot, snapshot_digest, LEGACY_NOTE
from verify_publication import verify
from test_archive import QUEUE, report


class PublicationVerificationTests(unittest.TestCase):
    def _verify(self, weekly=None, screened=None, old_home=False):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            home = root / "index.html"
            detail = root / "radar" / "index.html"
            detail.parent.mkdir(parents=True, exist_ok=True)
            reports = {kind: {} for kind in ("screened", "daily", "weekly", "monthly")}
            reports["weekly"], reports["screened"] = weekly or {}, screened or {}
            home.write_text(
                "ChatGPT 科研价值精选 周期任务运行验收" if old_home
                else "从当前主线走向未来 进入前沿动态",
                encoding="utf-8"
            )
            detail.write_text(
                "前沿动态 重点推荐 本周精选 本月研究机会 历史档案检索 "
                "补充发现：待评估线索 当前没有项目同时达到推荐标准 "
                + f'<div data-radar-snapshot="{snapshot_digest(reports, QUEUE)}"></div>'
                + "<!-- RADAR:STAGE_TWO-START -->"
                + "当前没有项目同时达到推荐标准 Compact multimodal evaluation"
                + "<!-- RADAR:STAGE_TWO-END -->"
                + "<!-- RADAR:CHATGPT_WEEKLY-START -->"
                + LEGACY_NOTE + " Compact multimodal evaluation"
                + "<!-- RADAR:CHATGPT_WEEKLY-END -->"
                + "<!-- RADAR:CHATGPT_MONTHLY-START --><!-- RADAR:CHATGPT_MONTHLY-END -->",
                encoding="utf-8"
            )
            save(root / "screening-queue.json", QUEUE)
            if weekly:
                save(root / "chatgpt-reviewed/latest-weekly.json", weekly)
            if screened:
                save(root / "chatgpt-reviewed/latest-screened.json", screened)
            return verify(home, detail, root)

    def test_current_page_markers_pass_old_markers_rejected(self):
        errors, count = self._verify()
        self.assertEqual(errors, [])
        self.assertEqual(count, 0)
        errors, _ = self._verify(old_home=True)
        self.assertTrue(any("navigation marker" in e for e in errors))

    def test_low_open_source_is_rejected_by_publication_verifier(self):
        data = report()
        data["items"][0]["evaluation_dimensions"]["open_source"]["score"] = 1
        errors, _ = self._verify(weekly=data)
        self.assertTrue(any("below 5" in e for e in errors))

    def test_valid_four_dimension_weekly_report_is_accepted(self):
        errors, count = self._verify(weekly=report())
        self.assertEqual(errors, [])
        self.assertEqual(count, 1)

    def test_legacy_report_is_only_historical(self):
        legacy = report()
        legacy.pop("screening_schema_version")
        legacy["generated_at"] = "2026-10-19T09:00:00Z"
        errors, count = self._verify(weekly=legacy)
        self.assertEqual(errors, [])
        self.assertEqual(count, 0)
        state, selected = assess_report(legacy, "weekly", QUEUE)
        self.assertEqual((state, selected), ("legacy", []))


if __name__ == "__main__":
    unittest.main()

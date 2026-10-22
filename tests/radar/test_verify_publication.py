"""Smoke-test the HTML publication gate without making network requests."""
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts" / "radar"))
from verify_publication import verify

class PublicationSmokeTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.data = self.root / "data"
        (self.data / "chatgpt-reviewed").mkdir(parents=True)
        self.home = self.root / "index.html"
        self.detail = self.root / "radar.html"

    def tearDown(self):
        self.tmp.cleanup()

    def write(self, path, value):
        path.write_text(json.dumps(value, ensure_ascii=False), encoding="utf-8")

    def test_empty_or_legacy_archives_require_explicit_no_recommendation_placeholder(self):
        self.write(self.data / "screening-queue.json", {"candidates": []})
        for kind in ("daily", "weekly", "monthly"):
            self.write(self.data / "chatgpt-reviewed" / f"latest-{kind}.json", {"schema_version": 1, "items": []})
        self.home.write_text("ChatGPT 科研价值精选 周期任务无人值守验收 尚无通过四维科研价值核验的第二轮推荐", encoding="utf-8")
        self.detail.write_text("ChatGPT 科研价值精选 目前没有符合四维科研价值评分标准的 ChatGPT 二次评价结果", encoding="utf-8")
        errors, count = verify(self.home, self.detail, self.data)
        self.assertEqual(errors, [])
        self.assertEqual(count, 0)

    def test_validated_recommendation_must_appear_in_rendered_page(self):
        queue = {"candidates": [{
            "id": "arxiv-2610-99999",
            "title": "A & B: Efficient Video Understanding",
            "source_url": "https://arxiv.org/abs/2610.99999",
            "paper_url": "https://arxiv.org/abs/2610.99999",
            "match_score": 8.5
        }]}
        self.write(self.data / "screening-queue.json", queue)
        dims = {
            "innovation": {"score": 8, "rationale": "The paper explains a distinct method and compares it with baselines."},
            "open_source": {"score": 8, "rationale": "The paper and repository provide enough detail to inspect the method."},
            "reproducibility": {"score": 8, "rationale": "The described setup supports a bounded controlled replication."},
            "research_potential": {"score": 8, "rationale": "The method creates a clear hypothesis for a follow-up study."}
        }
        item = {
            "candidate_id": "arxiv-2610-99999", "title": queue["candidates"][0]["title"],
            "selection_status": "recommended", "summary": "A reproducible test of video compression efficiency.",
            "why_selected": "It provides a distinct method and a clear comparison against previous approaches.",
            "research_opportunity": "Compare temporal accuracy and cost on a fixed compute budget.",
            "evaluation_dimensions": dims, "confidence": "medium",
            "evidence_urls": ["https://arxiv.org/abs/2610.99999"],
            "parameters": None, "gpu_requirement": None,
            "weights_open": None, "training_code_open": None, "data_open": None
        }
        self.write(self.data / "chatgpt-reviewed" / "latest-daily.json", {
            "schema_version": 1, "screening_schema_version": 2, "report_type": "daily",
            "first_stage_threshold": 8.0, "status": "completed", "generated_at": "2026-10-22T05:00:00Z",
            "items": [item]
        })
        for kind in ("weekly", "monthly"):
            self.write(self.data / "chatgpt-reviewed" / f"latest-{kind}.json", {"schema_version": 1, "items": []})
        self.home.write_text("ChatGPT 科研价值精选 周期任务无人值守验收", encoding="utf-8")
        self.detail.write_text("ChatGPT 科研价值精选 A &amp; B: Efficient Video Understanding", encoding="utf-8")
        errors, count = verify(self.home, self.detail, self.data)
        self.assertEqual(errors, [])
        self.assertEqual(count, 1)

        self.detail.write_text("ChatGPT 科研价值精选 missing item", encoding="utf-8")
        errors, count = verify(self.home, self.detail, self.data)
        self.assertTrue(any("absent" in e for e in errors))

if __name__ == "__main__":
    unittest.main()

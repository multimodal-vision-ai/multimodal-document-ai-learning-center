"""Tests for transparent topic relevance ranking and time-window labels."""
import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "radar"))
from ranking import rank_candidates, summarize_candidates, candidate_event

NOW = datetime(2026, 10, 22, 12, tzinfo=timezone.utc)
WEEK = NOW - timedelta(days=7)

def item(uid, title, provider, published, updated=None, category="document", url="https://example.org/item"):
    return {
        "id": uid, "title": title, "discovered_from": provider,
        "published_at": published, "updated_at": updated or published,
        "category": category, "source_url": url, "review": "pending",
    }

class RankingTests(unittest.TestCase):
    def test_recent_paper_is_labelled_new_and_ranked(self):
        record = item("arxiv-document-ocr", "Efficient Document OCR and Layout Understanding",
                      "arxiv", "2026-10-22T11:00:00Z", category="document",
                      url="https://arxiv.org/abs/2610.12345")
        ranked = rank_candidates([record], NOW - timedelta(hours=24), NOW, limit=3)
        self.assertEqual(len(ranked), 1)
        self.assertEqual(ranked[0]["event_label"], "新论文 / 新投稿")
        self.assertTrue(ranked[0]["is_new_paper"])
        self.assertGreaterEqual(ranked[0]["match_score"], 3.5)
        self.assertIn("文档理解", " ".join(ranked[0]["match_reasons"]))

    def test_old_paper_updated_recently_is_not_mislabelled_new(self):
        record = item("openreview-old-video", "Long Video Understanding with Temporal Grounding",
                      "openreview", "2025-01-01T00:00:00Z", "2026-10-21T10:00:00Z",
                      category="video", url="https://openreview.net/forum?id=example")
        event = candidate_event(record, WEEK, NOW)
        self.assertEqual(event["event_label"], "论文记录近期更新")
        self.assertFalse(event["is_new_paper"])
        ranked = rank_candidates([record], WEEK, NOW, limit=3)
        self.assertEqual(len(ranked), 1)
        self.assertFalse(ranked[0]["is_new_paper"])

    def test_generated_noise_and_unrelated_items_are_excluded(self):
        noise = item("hf-generated-noise", "gianmaTest/generatedDigitalExps_video_2",
                     "huggingface", "2026-10-22T10:00:00Z", category="video",
                     url="https://huggingface.co/gianmaTest/generatedDigitalExps_video_2")
        unrelated = item("github-cafe", "coffee-shop-menu", "github",
                         "2026-10-22T10:00:00Z", category="small-vlm",
                         url="https://github.com/example/coffee-shop-menu")
        ranked = rank_candidates([noise, unrelated], WEEK, NOW, limit=None)
        self.assertEqual(ranked, [])

    def test_summary_counts_relevant_categories_and_new_papers(self):
        paper = item("arxiv-video", "Efficient Long Video Question Answering",
                     "arxiv", "2026-10-22T11:00:00Z", category="video",
                     url="https://arxiv.org/abs/2610.12346")
        repo = item("github-doc", "document-ocr-layout-parser", "github",
                    "2026-10-20T11:00:00Z", "2026-10-21T11:00:00Z",
                    category="document", url="https://github.com/example/document-ocr-layout-parser")
        summary = summarize_candidates([paper, repo], WEEK, NOW)
        self.assertEqual(summary["relevant_count"], 2)
        self.assertEqual(summary["new_papers_count"], 1)
        self.assertEqual(summary["category_counts"]["video"], 1)
        self.assertEqual(summary["category_counts"]["document"], 1)

if __name__ == "__main__":
    unittest.main()

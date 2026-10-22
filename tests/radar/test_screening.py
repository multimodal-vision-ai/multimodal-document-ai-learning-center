"""Stage-two AI decision gate regression tests (no live model calls required)."""
import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts" / "radar"))
from screening import build_queue, evaluate_item, collect_screened, report_items

NOW = datetime(2026, 10, 22, 12, tzinfo=timezone.utc)
SRC = "https://arxiv.org/abs/2610.99999"
RESEARCH = {
    "id": "arxiv-2610-99999",
    "title": "Efficient Long Video Understanding with Token Compression",
    "category": "video",
    "source_url": SRC,
    "paper_url": SRC,
    "published_at": "2026-10-22T10:00:00Z",
    "updated_at": "2026-10-22T10:00:00Z",
    "discovered_from": "arxiv",
    "review": "pending",
}
DIM = {
    name: {"score": score, "rationale": "Evidence-linked research judgment based on the original paper."}
    for name, score in (
        ("innovation", 8.5), ("open_source", 7.5),
        ("reproducibility", 8.0), ("research_potential", 9.0)
    )
}

def screened(queue):
    record = queue["candidates"][0]
    return {
        "candidate_id": record["id"], "title": record["title"],
        "selection_status": "recommended", "screened_at": "2026-10-22T12:00:00Z",
        "summary": "Promising video token compression method under fixed compute budget.",
        "why_selected": "Novel video-token tradeoff and testable performance hypotheses.",
        "research_opportunity": "Replicate efficiency and temporal accuracy under same GPU budget.",
        "evaluation_dimensions": DIM,
        "confidence": "medium",
        "evidence_urls": [record["source_url"]],
        "parameters": None, "gpu_requirement": None,
        "weights_open": None, "training_code_open": None, "data_open": None,
    }

def report(queue, items=None):
    return {
        "screening_schema_version": 2,
        "first_stage_threshold": 8.0,
        "status": "completed",
        "generated_at": "2026-10-22T12:00:00Z",
        "items": [screened(queue)] if items is None else items,
    }

class SecondStageTests(unittest.TestCase):
    def test_queue_contains_only_eight_plus_candidates(self):
        queue = build_queue([RESEARCH], NOW)
        self.assertEqual(queue["total"], 1)
        self.assertGreaterEqual(queue["candidates"][0]["match_score"], 8)
        self.assertEqual(queue["first_stage_threshold"], 8.0)

    def test_ai_review_validates_all_four_dimensions(self):
        q = build_queue([RESEARCH], NOW)
        results, errors = report_items(report(q), q)
        self.assertEqual(errors, [])
        self.assertEqual(len(results), 1)
        self.assertGreaterEqual(results[0]["value_score"], 7.5)

    def test_low_dimension_never_becomes_recommendation(self):
        q = build_queue([RESEARCH], NOW)
        x = screened(q)
        x["evaluation_dimensions"] = {**DIM, "open_source": {
            "score": 3, "rationale": "No weights, open code, or training data confirmed."}}
        _, problems = report_items(report(q, [x]), q)
        self.assertTrue(any("below 5" in p for p in problems))

    def test_missing_source_or_false_candidate_is_rejected(self):
        q = build_queue([RESEARCH], NOW)
        bad = screened(q)
        bad["candidate_id"] = "invented-paper"
        _, problems = report_items(report(q, [bad]), q)
        self.assertTrue(any("candidate_id" in p for p in problems))
        bad2 = screened(q)
        bad2["evidence_urls"] = ["https://unrelated.example.org/something"]
        _, problems = report_items(report(q, [bad2]), q)
        self.assertTrue(any("original source" in p for p in problems))

    def test_old_chatgpt_archives_not_promoted_to_evaluated_items(self):
        q = build_queue([RESEARCH], NOW)
        old = {"status":"completed", "generated_at":"2026-10-20T09:08:45Z",
               "items":[{"title":"Legacy recommendation", "selection_status":"selected"}]}
        results, errors = collect_screened({"daily":old, "weekly":report(q)}, q)
        self.assertEqual(errors, [])
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["candidate_id"], q["candidates"][0]["id"])

    def test_no_high_value_with_empty_results_is_valid(self):
        q = build_queue([RESEARCH], NOW)
        x = report(q, [])
        x["status"] = "no_high_value"
        items, errors = report_items(x, q)
        self.assertEqual(items, [])
        self.assertEqual(errors, [])

    def test_score_not_enough_without_substantive_rationale(self):
        q = build_queue([RESEARCH], NOW)
        x = screened(q)
        x["evaluation_dimensions"] = {**DIM, "innovation": {"score":10, "rationale":"nice"}}
        _, errors = report_items(report(q, [x]), q)
        self.assertTrue(any("innovation" in e for e in errors))

if __name__ == "__main__":
    unittest.main()

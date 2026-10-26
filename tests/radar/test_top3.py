"""Regression tests for persistent rolling Top 3 selection (no network calls)."""
import copy
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts" / "radar"))

from core import load, save
from top3 import bootstrap_top3, update_top3_state, state_path

NOW = datetime(2026, 10, 26, 12, tzinfo=timezone.utc)


def make_queue(count=6):
    candidates = []
    for index in range(1, count + 1):
        candidates.append({
            "id": f"arxiv-2610-{99990 + index}",
            "title": f"Efficient Long Video Understanding with Token Compression {index}",
            "category": "video",
            "source_url": f"https://arxiv.org/abs/2610.{99990 + index}",
            "paper_url": f"https://arxiv.org/abs/2610.{99990 + index}",
            "match_score": 9.0,
            "match_reasons": ["video understanding", "efficient inference"],
            "published_at": "2026-10-26T10:00:00Z",
        })
    return {"schema_version": 2, "first_stage_threshold": 8.0, "candidates": candidates}


def make_item(candidate, score):
    return {
        "candidate_id": candidate["id"],
        "title": candidate["title"],
        "selection_status": "recommended",
        "summary": "A testable video understanding method with reproducible evaluation.",
        "why_selected": "The source provides a clear research question and evidence-backed method.",
        "research_opportunity": "Compare accuracy and compute under a fixed GPU budget.",
        "evaluation_dimensions": {
            key: {
                "score": score,
                "rationale": "Evidence-linked rationale supported by the source paper and experiments.",
            }
            for key in ("innovation", "open_source", "reproducibility", "research_potential")
        },
        "confidence": "medium",
        "evidence_urls": [candidate["source_url"]],
        "parameters": None,
        "gpu_requirement": None,
        "weights_open": None,
        "training_code_open": None,
        "data_open": None,
    }


def make_report(queue, candidate_scores, generated_at):
    by_id = {item["id"]: item for item in queue["candidates"]}
    return {
        "schema_version": 1,
        "report_type": "weekly",
        "screening_schema_version": 2,
        "first_stage_threshold": 8.0,
        "status": "completed" if candidate_scores else "no_high_value",
        "generated_at": generated_at,
        "items": [
            make_item(by_id[candidate_id], score)
            for candidate_id, score in candidate_scores
        ],
    }


class PersistentTop3Tests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.data = Path(self.temp.name)
        self.queue = make_queue()
        save(self.data / "screening-queue.json", self.queue)

    def update(self, report):
        return update_top3_state({"weekly": report}, self.queue, data_dir=self.data, now=NOW)

    def test_bootstrap_uses_current_weekly_report_once(self):
        report = make_report(
            self.queue,
            [(self.queue["candidates"][0]["id"], 9.0),
             (self.queue["candidates"][1]["id"], 8.5),
             (self.queue["candidates"][2]["id"], 8.0)],
            "2026-10-19T10:00:00Z",
        )
        state = self.update(report)
        self.assertEqual([item["value_score"] for item in state["items"]], [9.0, 8.5, 8.0])
        self.assertTrue(state_path(self.data).exists())
        self.assertEqual(bootstrap_top3(self.data)["items"], state["items"])

    def test_equal_or_lower_score_never_replaces_an_incumbent(self):
        initial = make_report(
            self.queue,
            [(self.queue["candidates"][0]["id"], 9.0),
             (self.queue["candidates"][1]["id"], 8.5),
             (self.queue["candidates"][2]["id"], 8.0)],
            "2026-10-19T10:00:00Z",
        )
        first = self.update(initial)
        old_ids = [item["candidate_id"] for item in first["items"]]
        old_updated_at = first["updated_at"]

        equal_report = make_report(
            self.queue, [(self.queue["candidates"][3]["id"], 8.0)],
            "2026-10-26T10:00:00Z",
        )
        equal = self.update(equal_report)
        self.assertEqual([item["candidate_id"] for item in equal["items"]], old_ids)
        self.assertEqual(equal["updated_at"], old_updated_at)

        lower_report = make_report(
            self.queue, [(self.queue["candidates"][4]["id"], 7.9)],
            "2026-10-26T10:30:00Z",
        )
        lower = self.update(lower_report)
        self.assertEqual([item["candidate_id"] for item in lower["items"]], old_ids)
        self.assertEqual(lower["updated_at"], old_updated_at)

    def test_strictly_higher_score_replaces_only_the_lowest_item(self):
        initial = make_report(
            self.queue,
            [(self.queue["candidates"][0]["id"], 9.0),
             (self.queue["candidates"][1]["id"], 8.5),
             (self.queue["candidates"][2]["id"], 8.0)],
            "2026-10-19T10:00:00Z",
        )
        self.update(initial)
        incoming = make_report(
            self.queue, [(self.queue["candidates"][3]["id"], 8.01)],
            "2026-10-26T10:00:00Z",
        )
        updated = self.update(incoming)
        ids = [item["candidate_id"] for item in updated["items"]]
        self.assertEqual(len(ids), 3)
        self.assertIn(self.queue["candidates"][3]["id"], ids)
        self.assertNotIn(self.queue["candidates"][2]["id"], ids)
        self.assertEqual([item["value_score"] for item in updated["items"]], [9.0, 8.5, 8.01])
        self.assertNotEqual(updated["updated_at"], initial["generated_at"])

    def test_empty_week_keeps_the_existing_top3(self):
        initial = make_report(
            self.queue,
            [(self.queue["candidates"][0]["id"], 9.0),
             (self.queue["candidates"][1]["id"], 8.5),
             (self.queue["candidates"][2]["id"], 8.0)],
            "2026-10-19T10:00:00Z",
        )
        before = self.update(initial)
        empty_week = make_report(self.queue, [], "2026-10-26T10:00:00Z")
        after = self.update(empty_week)
        self.assertEqual([x["candidate_id"] for x in after["items"]],
                         [x["candidate_id"] for x in before["items"]])
        self.assertEqual([x["value_score"] for x in after["items"]],
                         [x["value_score"] for x in before["items"]])
        self.assertEqual(after["updated_at"], before["updated_at"])

    def test_higher_revision_of_same_candidate_does_not_duplicate(self):
        initial = make_report(
            self.queue,
            [(self.queue["candidates"][0]["id"], 8.0),
             (self.queue["candidates"][1]["id"], 8.5),
             (self.queue["candidates"][2]["id"], 9.0)],
            "2026-10-19T10:00:00Z",
        )
        self.update(initial)
        revised = make_report(
            self.queue, [(self.queue["candidates"][0]["id"], 8.7)],
            "2026-10-26T10:00:00Z",
        )
        state = self.update(revised)
        ids = [item["candidate_id"] for item in state["items"]]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual(state["items"][0]["value_score"], 9.0)
        self.assertEqual(state["items"][1]["value_score"], 8.7)
        self.assertEqual(state["items"][2]["value_score"], 8.5)


if __name__ == "__main__":
    unittest.main()

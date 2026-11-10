"""Fail-closed tests for the Pages-only historical candidate provenance repair."""
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts" / "radar"))
from restore_historical_review_provenance import restore


class RestoreHistoryTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.data = Path(self.tmp.name)
        self.archive = self.data / "chatgpt-reviewed" / "archive" / "monthly"
        self.archive.mkdir(parents=True)
        self.reviews = self.data / "chatgpt-reviewed"
        self.candidate = {
            "id": "paper-old", "title": "Archived paper",
            "source_url": "https://arxiv.org/abs/2601.00001", "match_score": 8.4,
        }
        self.item = {
            "candidate_id": "paper-old", "title": "Archived paper",
            "selection_status": "recommended",
            "evidence_urls": ["https://arxiv.org/abs/2601.00001"],
        }
        self.write("screening-queue.json", {
            "schema_version": 2, "first_stage_threshold": 8.0,
            "candidates": [], "total": 0,
        })
        self.write("chatgpt-reviewed/latest-monthly.json", {
            "screening_schema_version": 2, "status": "completed",
            "items": [self.item],
        })
        self.write("chatgpt-reviewed/archive/monthly/2026-01.json", {
            "status": "completed", "items": [self.item],
            "_screening_queue": {"candidates": [self.candidate]},
        })

    def write(self, path, data):
        target = self.data / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(data), encoding="utf-8")

    def test_recovers_verified_evidence(self):
        self.assertEqual(restore(self.data), ["paper-old"])
        data = json.loads((self.data / "screening-queue.json").read_text())
        self.assertEqual(data["candidates"], [self.candidate])
        self.assertEqual(data["publication_historical_evidence_ids"], ["paper-old"])
        self.assertEqual(restore(self.data), [])

    def test_missing_evidence_fails_without_mutation(self):
        (self.archive / "2026-01.json").unlink()
        before = (self.data / "screening-queue.json").read_bytes()
        with self.assertRaisesRegex(ValueError, "Missing archived"):
            restore(self.data)
        self.assertEqual((self.data / "screening-queue.json").read_bytes(), before)

    def test_title_or_url_mismatch_cannot_bypass_gate(self):
        altered = dict(self.item, title="Unrelated work")
        self.write("chatgpt-reviewed/latest-monthly.json", {
            "screening_schema_version": 2, "status": "completed",
            "items": [altered],
        })
        with self.assertRaisesRegex(ValueError, "Missing archived"):
            restore(self.data)


if __name__ == "__main__":
    unittest.main()

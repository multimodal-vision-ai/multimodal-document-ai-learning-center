"""Offline tests of the live DEV data collection step (HTTP mocked)."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts" / "radar"))
import collect
from core import load, save

SAMPLE = {
    "id": "arxiv-2610-12345",
    "title": "Multimodal Document Understanding Study",
    "category": "document",
    "source_url": "https://arxiv.org/abs/2610.12345",
    "published_at": "2026-10-20T00:00:00+00:00",
    "first_seen_at": "2026-10-21T00:00:00+00:00",
    "review": "pending",
    "discovered_from": "arxiv",
}

class CollectionIntegrationTests(unittest.TestCase):
    def test_live_dev_snapshot_preserves_pending_and_has_health_status(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder = Path(tmp)
            config = {"arxiv": {"enabled": True}}
            with patch.object(collect, "DATA", folder), patch.object(collect, "CONFIG", config):
                with patch.object(collect, "arxiv", return_value=[SAMPLE]):
                    self.assertEqual(collect.main(), 0)
            projects = load(folder / "candidates.json")
            health = load(folder / "collection-status.json")
            self.assertEqual(len(projects), 1)
            self.assertEqual(projects[0]["review"], "pending")
            self.assertEqual(health["source_counts"]["arxiv"], 1)
            self.assertEqual(health["candidate_records"], 1)
            self.assertEqual(health["review_policy"], "all automated leads pending")

    def test_all_network_sources_fail_preserves_last_snapshot(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder = Path(tmp)
            save(folder / "candidates.json", [SAMPLE])
            with patch.object(collect, "DATA", folder), patch.object(collect, "CONFIG", {"arxiv": {"enabled": True}}):
                with patch.object(collect, "arxiv", side_effect=TimeoutError("source timed out")):
                    self.assertEqual(collect.main(), 1)
            self.assertEqual(load(folder / "candidates.json"), [SAMPLE])
            self.assertFalse((folder / "collection-status.json").exists())

    def test_one_source_partial_failure_is_explicit(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder = Path(tmp)
            config = {"arxiv": {"enabled": True}, "openreview": {"enabled": True}}
            with patch.object(collect, "DATA", folder), patch.object(collect, "CONFIG", config):
                with patch.object(collect, "arxiv", return_value=[SAMPLE]):
                    with patch.object(collect, "openreview", side_effect=TimeoutError("blocked")):
                        self.assertEqual(collect.main(), 0)
            health = load(folder / "collection-status.json")
            self.assertEqual(len(health["source_failures"]), 1)
            self.assertEqual(health["source_counts"]["arxiv"], 1)

if __name__ == "__main__":
    unittest.main()

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


class SourcePriorityTests(unittest.TestCase):
    def test_research_papers_first_and_source_limits(self):
        import render
        items = []
        for source, count in (("github", 12), ("huggingface", 8), ("openreview", 8)):
            for i in range(count):
                items.append({
                    "id": f"{source}-{i}",
                    "review": "pending",
                    "discovered_from": source,
                    "title": f"Candidate {source} {i}",
                    "source_url": "https://example.org/" + source + str(i),
                    "published_at": "2026-10-21T00:00:00Z"
                })
        chosen = render.select_candidate_leads(items)
        self.assertEqual(len(chosen), 10)
        self.assertEqual(chosen[0]["discovered_from"], "openreview")
        self.assertEqual(sum(x["discovered_from"] == "openreview" for x in chosen), 6)
        self.assertEqual(sum(x["discovered_from"] == "huggingface" for x in chosen), 2)
        self.assertEqual(sum(x["discovered_from"] == "github" for x in chosen), 2)

    def test_arxiv_falls_back_to_second_official_host(self):
        from datetime import datetime, timezone
        today = datetime.now(timezone.utc).isoformat()
        atom = ('<feed xmlns="http://www.w3.org/2005/Atom">'
                '<entry><title>Multimodal Document Parsing</title>'
                '<id>https://arxiv.org/abs/2610.12345v2</id>'
                f'<published>{today}</published><updated>{today}</updated>'
                '</entry></feed>').encode("utf-8")
        with patch.object(collect, "CONFIG", {"arxiv": {"enabled": True}}):
            with patch.object(collect, "fetch", side_effect=[
                    TimeoutError("export host timed out"), atom
            ]) as called:
                entries = collect.arxiv()
        self.assertEqual(called.call_count, 2)
        self.assertEqual(len(entries), 1)
        self.assertEqual(entries[0]["id"], "arxiv-2610-12345")
        self.assertEqual(entries[0]["review"], "pending")

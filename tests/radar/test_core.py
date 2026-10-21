"""Offline tests; remote services are mocked so CI does not need external credentials."""
import json
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts" / "radar"))
from core import merge_candidates, score, upsert, verify
from reports import build
import collect

NOW = datetime(2026, 10, 21, 12, 0, tzinfo=timezone.utc)
SCORES = {
    "innovation": 9, "openness": 8, "compute": 8,
    "reproducibility": 8, "extension": 9, "commercialization": 8,
}

def approved(**changes):
    item = {
        "id": "example-paper-1", "title": "Verified Document Research",
        "category": "document", "source_url": "https://arxiv.org/abs/1234.56789",
        "paper_url": "https://arxiv.org/abs/1234.56789",
        "published_at": "2026-10-21T05:00:00+00:00",
        "first_seen_at": "2026-10-21T06:00:00+00:00",
        "reviewed_at": "2026-10-21T07:00:00+00:00", "reviewed_by": "research-team",
        "review": "approved", "evidence_urls": ["https://arxiv.org/abs/1234.56789"],
        "innovation": "Spatially aware document reasoning",
        "research_opportunity": "Low-cost evidence verification",
        "parameters": "2B", "score_dimensions": SCORES, "score": score(SCORES)
    }
    item.update(changes)
    return item

class RadarCoreTests(unittest.TestCase):
    def test_score(self):
        self.assertEqual(score({key: 10 for key in SCORES}), 10.0)
        with self.assertRaises(ValueError):
            score({"innovation": 9})

    def test_approval_requires_reviewer_evidence_and_scores(self):
        verify(approved())
        for modification in ({"reviewed_by": None}, {"evidence_urls": []},
                             {"score": 9.99}, {"score_dimensions": None}):
            with self.subTest(modification=modification), self.assertRaises(ValueError):
                verify(approved(**modification))

    def test_cannot_downgrade_review(self):
        original = approved()
        candidate = {**original, "review": "pending", "title": "Not verified"}
        self.assertEqual(upsert([original], [candidate])[0]["title"], original["title"])

    def test_first_seen_stable_when_repeated(self):
        first = {"id": "paper-test", "title": "A Research Topic",
                 "category": "small-vlm", "source_url": "https://example.org/paper",
                 "published_at": "2026-10-20T05:00:00+00:00",
                 "first_seen_at": "2026-10-20T07:00:00+00:00",
                 "review": "pending"}
        second = {**first, "first_seen_at": "2026-10-21T07:00:00+00:00"}
        self.assertEqual(upsert([first], [second])[0]["first_seen_at"], first["first_seen_at"])

    def test_same_paper_title_merges_sources_without_losing_urls(self):
        first = {"id": "arxiv-2610-12345", "title": "A Unified Method for Document Understanding",
                 "category": "document", "source_url": "https://arxiv.org/abs/2610.12345",
                 "published_at": "2026-10-19T00:00:00Z",
                 "first_seen_at": "2026-10-20T00:00:00Z",
                 "review": "pending", "discovered_from": "arxiv",
                 "paper_url": "https://arxiv.org/abs/2610.12345"}
        second = {**first, "id": "openreview-example-1",
                  "source_url": "https://openreview.net/forum?id=example",
                  "paper_url": "https://openreview.net/forum?id=example",
                  "discovered_from": "openreview"}
        found = merge_candidates([], [first, second])
        self.assertEqual(len(found), 1)
        self.assertIn("https://openreview.net/forum?id=example",
                      [found[0]["source_url"]] + found[0].get("related_urls", []))

    def test_datetime_windows_and_no_forced_recommendations(self):
        fresh = approved()
        stale = approved(
            id="old-project", title="Older result",
            published_at="2026-08-01T00:00:00Z",
            reviewed_at="2026-08-02T00:00:00Z"
        )
        reports = build([fresh, stale], NOW)
        self.assertEqual(len(reports["daily"]["projects"]), 1)
        self.assertEqual(len(reports["weekly"]["projects"]), 1)
        self.assertEqual(len(reports["monthly"]["projects"]), 1)
        empty = build([stale], NOW)
        self.assertTrue(empty["daily"]["empty"])
        self.assertEqual(empty["daily"]["projects"], [])

    def test_important_updated_project_reappears_when_reviewed(self):
        earlier = approved(published_at="2026-07-01T00:00:00Z",
                           reviewed_at="2026-07-02T00:00:00Z",
                           significant_update_at="2026-10-21T09:00:00Z")
        self.assertEqual(len(build([earlier], NOW)["daily"]["projects"]), 1)

class PublicCollectorTests(unittest.TestCase):
    def test_openreview_public_api_parsing(self):
        created = int(datetime.now(timezone.utc).timestamp() * 1000)
        record = {"notes": [{
            "id": "paperabc", "tcdate": created, "tmdate": created,
            "content": {"title": {"value": "Document Understanding with Vision Models"}}
        }]}
        with patch.object(collect, "CONFIG", {"openreview": {"enabled": True, "queries": ["document"], "limit": 5}}):
            with patch.object(collect, "fetch", return_value=json.dumps(record).encode()):
                found = collect.openreview()
        self.assertEqual(len(found), 1)
        self.assertEqual(found[0]["review"], "pending")
        self.assertEqual(found[0]["category"], "document")

    def test_atom_official_feed(self):
        today = datetime.now(timezone.utc).isoformat()
        atom = ('<feed xmlns="http://www.w3.org/2005/Atom">'
                '<entry><title>Video Understanding Research</title>'
                '<link rel="alternate" href="https://example.edu/research/1"/>'
                f'<published>{today}</published></entry></feed>').encode()
        with patch.object(collect, "CONFIG", {"institution_feeds": [
            {"name": "Example University", "url": "https://example.edu/feed.xml"}]}):
            with patch.object(collect, "fetch", return_value=atom):
                found = collect.official_feeds()
        self.assertEqual(len(found), 1)
        self.assertEqual(found[0]["discovered_from"], "institution")

if __name__ == "__main__":
    unittest.main()

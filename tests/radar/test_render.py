"""Test site rendering with a reviewed item and an unreviewed lead."""
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "radar"))
import render
from core import score, save

DIMENSIONS = {"innovation": 10, "openness": 9, "compute": 8,
              "reproducibility": 9, "extension": 9, "commercialization": 8}

class RadarRenderTests(unittest.TestCase):
    def test_approved_project_and_pending_leads_are_separated(self):
        with tempfile.TemporaryDirectory() as temp:
            tempdir = Path(temp)
            docs = tempdir / "docs"
            data = tempdir / "data"
            for name in ("index.md", "radar/index.md", "radar/projects.md", "radar/tasks.md"):
                src = ROOT / "docs" / name
                dest = docs / name
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_text(src.read_text(encoding="utf-8-sig"), encoding="utf-8")
            record = {
                "id": "verified-sample", "title": "Safe <script> Title",
                "category": "document", "source_url": "https://example.org/research",
                "published_at": "2026-10-21T03:00:00+00:00",
                "first_seen_at": "2026-10-21T04:00:00+00:00",
                "review": "approved", "reviewed_by": "reviewer",
                "reviewed_at": "2026-10-21T05:00:00+00:00",
                "evidence_urls": ["https://example.org/research"],
                "innovation": "Layout modeling", "research_opportunity": "Token pruning",
                "score_dimensions": DIMENSIONS, "score": score(DIMENSIONS),
                "parameters": "2B", "gpu": "24GB", "gpu_tier": "24gb"
            }
            candidate = {
                "id": "unverified-sample", "title": "Unreviewed <img> Title",
                "category": "video", "source_url": "https://example.org/lead",
                "published_at": "2026-10-21T05:00:00+00:00",
                "first_seen_at": "2026-10-21T06:00:00+00:00",
                "review": "pending", "discovered_from": "arxiv"
            }
            save(data / "projects.json", [record])
            save(data / "candidates.json", [candidate])
            save(data / "tasks.json", [])
            now = datetime(2026, 10, 21, 12, tzinfo=timezone.utc)
            with patch.object(render, "DOCS", docs), patch.object(render, "DATA", data):
                render.render(now)
                first = {str(p.relative_to(docs)): p.read_text(encoding="utf-8")
                         for p in docs.rglob("*.md")}
                render.render(now)
                second = {str(p.relative_to(docs)): p.read_text(encoding="utf-8")
                          for p in docs.rglob("*.md")}
            self.assertEqual(first, second)
            self.assertIn("radar-project-table", first["radar/projects.md"])
            self.assertIn("&lt;script&gt;", first["radar/projects.md"])
            self.assertNotIn("<script>", first["radar/projects.md"])
            self.assertIn("Unreviewed", first["radar/index.md"])
            self.assertNotIn("Unreviewed", first["radar/projects.md"])
            self.assertIn("已审核项目", first["index.md"])
            self.assertIn("data-size=\"2\"", first["radar/projects.md"])

if __name__ == "__main__":
    unittest.main()

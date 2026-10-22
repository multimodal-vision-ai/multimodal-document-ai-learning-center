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



class SourcePriorityTests(unittest.TestCase):
    def test_research_relevance_prioritizes_papers_and_excludes_generated_noise(self):
        import render
        from datetime import datetime, timezone
        now = datetime(2026, 10, 22, 12, tzinfo=timezone.utc)
        items = [
            {
                "id": "arxiv-video-token-reduction", "review": "pending",
                "discovered_from": "arxiv",
                "title": "GazeLens for Efficient Egocentric Video Question Answering with Token Reduction",
                "category": "video", "source_url": "https://arxiv.org/abs/2610.28502",
                "published_at": "2026-10-22T11:00:00Z", "updated_at": "2026-10-22T11:00:00Z"
            },
            {
                "id": "openreview-document-dataset", "review": "pending",
                "discovered_from": "openreview",
                "title": "Document Understanding Dataset and Evaluation",
                "category": "document", "source_url": "https://openreview.net/forum?id=example",
                "published_at": "2026-10-20T08:00:00Z", "updated_at": "2026-10-20T08:01:00Z"
            },
            {
                "id": "github-video-rag", "review": "pending",
                "discovered_from": "github",
                "title": "video-search-and-summarization",
                "category": "video", "source_url": "https://github.com/example/video-search-and-summarization",
                "published_at": "2024-10-22T06:00:00Z", "updated_at": "2026-10-21T10:00:00Z"
            },
            {
                "id": "hf-generated-noise", "review": "pending",
                "discovered_from": "huggingface",
                "title": "gianmaTest/generatedDigitalExps_1xJTmg_rnn_cnn1d_video_2",
                "category": "video", "source_url": "https://huggingface.co/gianmaTest/generatedDigitalExps_1xJTmg_rnn_cnn1d_video_2",
                "published_at": "2026-10-22T10:00:00Z", "updated_at": "2026-10-22T10:00:00Z"
            },
            {
                "id": "unrelated-test", "review": "pending",
                "discovered_from": "github", "title": "my-test-repo",
                "category": "small-vlm", "source_url": "https://github.com/example/my-test-repo",
                "published_at": "2026-10-22T10:00:00Z", "updated_at": "2026-10-22T10:00:00Z"
            },
        ]
        chosen = render.select_candidate_leads(items, now=now, limit=15)
        self.assertGreaterEqual(len(chosen), 3)
        self.assertEqual(chosen[0]["id"], "arxiv-video-token-reduction")
        self.assertTrue(any(x["id"] == "openreview-document-dataset" for x in chosen))
        self.assertFalse(any("generatedDigitalExps" in x["title"] for x in chosen))
        self.assertTrue(all(x["review"] == "pending" for x in chosen))

    def test_huggingface_metadata_is_saved_for_quality_screening(self):
        record = {
            "id": "Lab/document-vlm-small",
            "createdAt": "2026-10-22T00:00:00Z",
            "lastModified": "2026-10-22T00:10:00Z",
            "downloads": 25, "likes": 2,
            "tags": ["transformers", "document", "vision-language"],
            "pipeline_tag": "image-text-to-text",
            "library_name": "transformers",
            "cardData": {"license": "apache-2.0"}
        }
        config = {"huggingface": {"enabled": True, "queries": ["document"], "limit": 1}}
        with patch.object(collect, "CONFIG", config):
            with patch.object(collect, "fetch", return_value=json.dumps([record]).encode("utf-8")):
                entries = collect.huggingface()
        self.assertEqual(len(entries), 1)
        self.assertEqual(entries[0]["hf_downloads"], 25)
        self.assertEqual(entries[0]["hf_likes"], 2)
        self.assertTrue(entries[0]["hf_has_model_card"])
        self.assertIn("document", entries[0]["hf_tags"])

    def test_github_metadata_is_saved_for_quality_screening(self):
        record = {
            "id": 42, "full_name": "lab/document-vlm",
            "html_url": "https://github.com/lab/document-vlm",
            "created_at": "2026-10-21T00:00:00Z",
            "pushed_at": "2026-10-22T00:00:00Z",
            "description": "Document VLM parsing and evaluation",
            "stargazers_count": 25, "forks_count": 4,
            "license": {"spdx_id": "Apache-2.0"},
            "language": "Python", "topics": ["document-ai", "vlm"]
        }
        config = {"github": {"enabled": True, "queries": ["document-vlm"], "per_page": 1}}
        with patch.object(collect, "CONFIG", config):
            with patch.object(collect, "fetch", return_value=json.dumps({"items": [record]}).encode("utf-8")):
                entries = collect.github()
        self.assertEqual(len(entries), 1)
        self.assertEqual(entries[0]["github_stars"], 25)
        self.assertEqual(entries[0]["github_license"], "Apache-2.0")
        self.assertIn("document-ai", entries[0]["github_topics"])

    def test_candidate_category_uses_abstract_when_title_is_ambiguous(self):
        record = collect.candidate(
            "arxiv-gazehoi", "Gaze2HOI: Gaze-Aware Intention Disambiguation",
            "https://arxiv.org/abs/2610.27877v1", "2026-10-20T08:59:54Z", "arxiv",
            abstract="A vision-language model for egocentric hand-object interaction forecasting."
        )
        self.assertEqual(record["category"], "video")

    def test_openreview_captures_abstract_authors_and_pdf(self):
        from datetime import datetime, timezone
        now_ms = int(datetime.now(timezone.utc).timestamp() * 1000)
        note = {
            "id": "document-note-123",
            "tcdate": now_ms,
            "tmdate": now_ms,
            "content": {
                "title": {"value": "Document Understanding Dataset and Evaluation"},
                "abstract": {"value": "We introduce a dataset for document VLM evaluation."},
                "authors": {"value": ["Alice Example", "Bob Example"]},
                "venue": {"value": "ICLR 2027"}
            }
        }
        config = {"openreview": {"enabled": True, "queries": ["document understanding"], "limit": 1}}
        with patch.object(collect, "CONFIG", config):
            with patch.object(collect, "fetch", return_value=json.dumps({"notes": [note]}).encode("utf-8")):
                entries = collect.openreview()
        self.assertEqual(len(entries), 1)
        self.assertIn("dataset for document VLM", entries[0]["abstract"])
        self.assertEqual(entries[0]["authors"], ["Alice Example", "Bob Example"])
        self.assertEqual(entries[0]["venue"], "ICLR 2027")
        self.assertEqual(entries[0]["pdf_url"], "https://openreview.net/pdf?id=document-note-123")

    def test_arxiv_falls_back_to_second_official_host(self):
        from datetime import datetime, timezone
        today = datetime.now(timezone.utc).isoformat()
        atom = ('<feed xmlns="http://www.w3.org/2005/Atom">'
                '<entry><title>Multimodal Document Parsing</title>'
                '<id>https://arxiv.org/abs/2610.12345v2</id>'
                f'<published>{today}</published><updated>{today}</updated>'
                '<summary>Efficient document parsing and layout analysis.</summary>'
                '<author><name>Alice Example</name></author>'
                '<link title="pdf" href="https://arxiv.org/pdf/2610.12345" rel="related" type="application/pdf"/>'
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
        self.assertIn("document parsing", entries[0]["abstract"])
        self.assertEqual(entries[0]["authors"], ["Alice Example"])
        self.assertEqual(entries[0]["pdf_url"], "https://arxiv.org/pdf/2610.12345")

if __name__ == "__main__":
    unittest.main()

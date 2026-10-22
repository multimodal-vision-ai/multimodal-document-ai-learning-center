"""Unit tests for unattended ChatGPT report watchdog and strict update gate."""
import json
import os
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts" / "radar"))
from automation_health import build_health, validate_report_for_publish, validate_changed_reports, record_publication

NOW = datetime(2026, 10, 22, 6, tzinfo=timezone.utc)
QUEUE = {
    "schema_version": 2,
    "generated_at": "2026-10-22T05:00:00Z",
    "first_stage_threshold": 8.0,
    "candidates": [{
        "id": "arxiv-2610-99999",
        "title": "Efficient Long Video Understanding with Token Compression",
        "source_url": "https://arxiv.org/abs/2610.99999",
        "paper_url": "https://arxiv.org/abs/2610.99999",
        "github_url": None,
        "huggingface_url": None,
        "pdf_url": None,
        "match_score": 8.6
    }]
}
DIMS = {
    "innovation": {"score": 8.5, "rationale": "The paper provides a distinct method and compares it against relevant prior approaches."},
    "open_source": {"score": 7.5, "rationale": "The available source materials clarify the current public code and model artifact status."},
    "reproducibility": {"score": 8.0, "rationale": "The evaluation describes a testable baseline and bounded compute requirements."},
    "research_potential": {"score": 9.0, "rationale": "The method exposes a concrete hypothesis for controlled long-video experiments."}
}

def recommendation():
    return {
        "candidate_id": "arxiv-2610-99999",
        "title": QUEUE["candidates"][0]["title"],
        "selection_status": "recommended",
        "screened_at": "2026-10-22T05:30:00Z",
        "summary": "Video token compression offers a measurable efficiency and accuracy tradeoff.",
        "why_selected": "It proposes a distinct method and a concrete comparison against relevant baselines.",
        "research_opportunity": "Test long-video accuracy and inference cost under the same fixed GPU budget.",
        "evaluation_dimensions": DIMS,
        "confidence": "medium",
        "evidence_urls": ["https://arxiv.org/abs/2610.99999"],
        "parameters": None,
        "gpu_requirement": None,
        "weights_open": None,
        "training_code_open": None,
        "data_open": None
    }

def v2_report(kind, generated_at=None, status="completed", items=None):
    if items is None:
        items = [recommendation()] if status == "completed" else []
    return {
        "schema_version": 1,
        "screening_schema_version": 2,
        "report_type": kind,
        "report_title": kind,
        "first_stage_threshold": 8.0,
        "status": status,
        "generated_at": generated_at or NOW.isoformat(),
        "summary": "The task inspected the current high-match queue and recorded an evidence-linked decision.",
        "items": items
    }

def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value), encoding="utf-8")

class WatchdogTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.data = Path(self.tmp.name)
        write_json(self.data / "screening-queue.json", QUEUE)
        (self.data / "chatgpt-reviewed").mkdir()

    def tearDown(self):
        self.tmp.cleanup()

    def put_report(self, kind, report):
        write_json(self.data / "chatgpt-reviewed" / f"latest-{kind}.json", report)

    def test_legacy_reports_and_missing_monthly_are_not_misreported_healthy(self):
        self.put_report("daily", {"schema_version": 1, "report_type": "daily", "status": "completed", "generated_at": "2026-10-22T05:00:00Z", "items": []})
        self.put_report("weekly", {"schema_version": 1, "report_type": "weekly", "status": "completed", "generated_at": "2026-10-20T05:00:00Z", "items": []})
        self.put_report("monthly", {"schema_version": 1, "report_type": "monthly", "status": "not_published", "generated_at": None, "items": []})
        health = build_health(self.data, NOW)
        self.assertEqual(health["overall_status"], "degraded")
        self.assertEqual(health["task_statuses"]["daily"]["status"], "legacy_schema")
        self.assertEqual(health["task_statuses"]["weekly"]["status"], "legacy_schema")
        self.assertEqual(health["task_statuses"]["monthly"]["status"], "not_published")

    def test_fresh_v2_reports_are_healthy(self):
        for kind in ("daily", "weekly", "monthly"):
            status = "completed" if kind == "daily" else "no_high_value"
            items = [recommendation()] if status == "completed" else []
            self.put_report(kind, v2_report(kind, status=status, items=items))
        health = build_health(self.data, NOW)
        self.assertEqual(health["overall_status"], "healthy")
        self.assertTrue(all(x["status"] == "healthy" for x in health["task_statuses"].values()))

    def test_daily_report_outside_30_hours_is_stale(self):
        old = (NOW - timedelta(hours=31)).isoformat()
        self.put_report("daily", v2_report("daily", generated_at=old))
        health = build_health(self.data, NOW)
        self.assertEqual(health["task_statuses"]["daily"]["status"], "stale")

    def test_bad_score_and_evidence_rejected(self):
        bad = recommendation()
        bad["evaluation_dimensions"] = {**DIMS, "open_source": {"score": 2, "rationale": "This explanation is long enough to pass text checks."}}
        self.assertTrue(validate_report_for_publish("daily", v2_report("daily", items=[bad]), QUEUE, NOW))
        bad = recommendation()
        bad["evidence_urls"] = ["https://example.org/not-the-source"]
        self.assertTrue(validate_report_for_publish("daily", v2_report("daily", items=[bad]), QUEUE, NOW))

    def test_legacy_update_is_rejected_but_legacy_archive_is_readable(self):
        legacy = {"schema_version": 1, "report_type": "daily", "status": "completed", "generated_at": "2026-10-22T05:00:00Z", "items": []}
        errors = validate_report_for_publish("daily", legacy, QUEUE, NOW)
        self.assertTrue(any("screening_schema_version=2" in e for e in errors))
        self.put_report("daily", legacy)
        self.put_report("weekly", v2_report("weekly", status="no_high_value", items=[]))
        self.put_report("monthly", v2_report("monthly", status="no_high_value", items=[]))
        event = self.data / "event.json"
        write_json(event, {"commits": [{"modified": ["research-radar/data/chatgpt-reviewed/latest-daily.json"], "added": [], "removed": []}]})
        self.assertTrue(validate_changed_reports(self.data, str(event), NOW))

    def test_valid_v2_update_passes_strict_gate(self):
        self.put_report("daily", v2_report("daily"))
        event = self.data / "event.json"
        write_json(event, {"commits": [{"modified": ["research-radar/data/chatgpt-reviewed/latest-daily.json"], "added": [], "removed": []}]})
        self.assertEqual(validate_changed_reports(self.data, str(event), NOW), [])

    def test_publish_evidence_is_recorded(self):
        with patch.dict(os.environ, {"GITHUB_RUN_ID": "12345", "GITHUB_SHA": "abc123", "GITHUB_REPOSITORY": "owner/repo", "GITHUB_SERVER_URL": "https://github.com"}):
            path = self.data / "automation-health.json"
            write_json(path, {"schema_version": 1, "publication": {"status": "unknown"}})
            health = record_publication(self.data)
        self.assertEqual(health["publication"]["status"], "success")
        self.assertTrue(health["publication"]["home_verified"])
        self.assertEqual(health["publication"]["source_commit"], "abc123")

if __name__ == "__main__":
    unittest.main()

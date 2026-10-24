"""Publication gate and immutable archive regressions (no external API calls)."""
import copy
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "radar"))

import render
from publication_gate import assess_report, validate_snapshot, LEGACY_NOTE

SOURCE = "https://arxiv.org/abs/2601.00001"
QUEUE = {"generated_at": "2026-10-23T09:00:00Z", "candidates": [{
    "id": "archive-test", "title": "Compact multimodal evaluation",
    "source_url": SOURCE, "paper_url": SOURCE, "match_score": 8.5
}]}


def report(kind="weekly", summary="Saved reproducible report."):
    return {
        "schema_version": 1,
        "screening_schema_version": 2,
        "first_stage_threshold": 8.0,
        "report_type": kind,
        "report_title": "Verified scientific review",
        "status": "completed",
        "generated_at": "2026-10-23T10:00:00Z",
        "window_start": "2026-10-19" if kind == "weekly" else "2026-10-01",
        "window_end": "2026-10-23",
        "summary": summary,
        "items": [{
            "candidate_id": "archive-test",
            "title": "Compact multimodal evaluation",
            "category": "video",
            "selection_status": "recommended",
            "screened_at": "2026-10-23T10:00:00Z",
            "summary": "A substantive, testable summary of the video evaluation method.",
            "why_selected": "A clear research contribution and testable evaluation plan.",
            "research_opportunity": "Compare accuracy and speed with controlled compute.",
            "evaluation_dimensions": {
                k: {"score": 8.0, "rationale": "Evidence from publication and reproducible tests."}
                for k in ("innovation", "open_source", "reproducibility", "research_potential")
            },
            "confidence": "medium",
            "evidence_urls": [SOURCE],
            "parameters": None, "gpu_requirement": None,
            "weights_open": None, "training_code_open": None, "data_open": None,
            "paper_url": SOURCE,
        }],
    }


class ReportArchiveTests(unittest.TestCase):
    def test_week_labels_never_exceed_52(self):
        self.assertEqual(render.weekly_period_label("2026-10-22"), "2026年第43周")
        self.assertEqual(render.weekly_period_label("2026-12-31"), "2026年第52周")
        self.assertEqual(render.monthly_period_label("2026-10-01"), "2026年10月")

    def test_valid_weekly_and_monthly_reports_are_saved_without_duplicates(self):
        weekly, monthly = report(), report("monthly")
        with tempfile.TemporaryDirectory() as temp, patch.object(render, "DATA", Path(temp)):
            self.assertEqual(render.archive_latest_reports(
                {"weekly": weekly, "monthly": monthly}, QUEUE), 2)
            self.assertEqual(render.archive_latest_reports(
                {"weekly": weekly, "monthly": monthly}, QUEUE), 0)
            self.assertIn("2026年第43周", render.archive_cards("weekly", QUEUE))
            self.assertIn("2026年10月", render.archive_cards("monthly", QUEUE))
            self.assertIn("Compact multimodal evaluation", render.archive_cards("weekly", QUEUE))

    def test_revised_valid_report_does_not_overwrite_original(self):
        original, updated = report(), report(summary="Corrected valid summary.")
        with tempfile.TemporaryDirectory() as temp, patch.object(render, "DATA", Path(temp)):
            self.assertEqual(render.archive_latest_reports({"weekly": original}, QUEUE), 1)
            self.assertEqual(render.archive_latest_reports({"weekly": updated}, QUEUE), 1)
            files = list((Path(temp) / "chatgpt-reviewed/archive/weekly").glob("*.json"))
            self.assertEqual(len(files), 2)
            self.assertEqual(render.archive_latest_reports({"weekly": updated}, QUEUE), 0)

    def test_low_open_source_never_enters_new_archive_or_current_recommendations(self):
        invalid = report()
        invalid["items"][0]["evaluation_dimensions"]["open_source"]["score"] = 1
        with self.assertRaisesRegex(ValueError, "below 5"):
            assess_report(invalid, "weekly", QUEUE)
        with tempfile.TemporaryDirectory() as temp, patch.object(render, "DATA", Path(temp)):
            with self.assertRaisesRegex(ValueError, "below 5"):
                render.archive_latest_reports({"weekly": invalid}, QUEUE)
            self.assertFalse((Path(temp) / "chatgpt-reviewed/archive").exists())
            with self.assertRaises(ValueError):
                render.chatgpt_report_listing(invalid, "weekly", queue=QUEUE)

    def test_legacy_is_retained_as_clearly_labeled_history_not_live_recommendation(self):
        legacy = report()
        legacy.pop("screening_schema_version")
        legacy["generated_at"] = "2026-10-19T09:00:00Z"
        legacy["items"][0]["selection_status"] = "selected"
        state, selected = assess_report(legacy, "weekly", QUEUE)
        self.assertEqual((state, selected), ("legacy", []))
        with tempfile.TemporaryDirectory() as temp, patch.object(render, "DATA", Path(temp)):
            self.assertEqual(render.archive_latest_reports({"weekly": legacy}, QUEUE), 0)
            save_path = Path(temp) / "chatgpt-reviewed/archive/weekly/2026-W42.json"
            render.save(save_path, legacy)  # Previously stored record may remain on disk.
            text = render.archive_cards("weekly", QUEUE)
            self.assertIn(LEGACY_NOTE, text)
            self.assertIn("Compact multimodal evaluation", text)
            current = render.chatgpt_report_listing(legacy, "weekly", queue=QUEUE)
            self.assertIn(LEGACY_NOTE, current)
            self.assertNotIn("Compact multimodal evaluation", current)

    def test_new_legacy_and_missing_schema_are_rejected(self):
        r = report()
        r.pop("screening_schema_version")
        with self.assertRaisesRegex(ValueError, "screening_schema_version"):
            validate_snapshot({"weekly": r}, QUEUE)
        bad = report()
        del bad["items"][0]["evaluation_dimensions"]
        with self.assertRaisesRegex(ValueError, "four"):
            validate_snapshot({"weekly": bad}, QUEUE)


if __name__ == "__main__":
    unittest.main()

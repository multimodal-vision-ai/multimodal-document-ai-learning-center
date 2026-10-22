"""Tests for annual week labels and immutable ChatGPT report archives."""
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "radar"))
import render


def report(report_type, window_start, generated_at, title, summary):
    return {
        "schema_version": 1,
        "report_type": report_type,
        "report_title": title,
        "status": "completed",
        "generated_at": generated_at,
        "window_start": window_start,
        "window_end": generated_at,
        "summary": summary,
        "items": [{
            "id": "archive-test-item",
            "title": "Compact multimodal evaluation",
            "category": "video",
            "selection_status": "selected",
            "summary": "A testable research summary.",
            "why_selected": "The source and evaluation setup can be checked.",
            "research_opportunity": "Compare accuracy and inference cost.",
            "paper_url": "https://arxiv.org/abs/2601.00001",
            "screened_at": generated_at,
        }],
    }


class ReportArchiveTests(unittest.TestCase):
    def test_week_labels_never_exceed_52(self):
        self.assertEqual(render.weekly_period_label("2026-10-22"), "2026年第43周")
        # ISO week 53 is folded into the displayed week 52.
        self.assertEqual(render.weekly_period_label("2026-12-31"), "2026年第52周")
        self.assertEqual(render.monthly_period_label("2026-10-01"), "2026年10月")

    def test_weekly_and_monthly_reports_are_saved_and_searchable(self):
        weekly = report(
            "weekly", "2026-10-12", "2026-10-19T09:22:26Z",
            "Multimodal Vision Research Weekly", "Weekly report summary."
        )
        monthly = report(
            "monthly", "2026-10-01", "2026-11-01T09:00:00Z",
            "Multimodal Vision Research Monthly", "Monthly report summary."
        )
        with tempfile.TemporaryDirectory() as temp:
            data = Path(temp)
            with patch.object(render, "DATA", data):
                self.assertEqual(render.archive_latest_reports({
                    "weekly": weekly, "monthly": monthly
                }), 2)
                # Re-rendering identical latest reports must not create duplicates.
                self.assertEqual(render.archive_latest_reports({
                    "weekly": weekly, "monthly": monthly
                }), 0)

                weekly_files = list((data / "chatgpt-reviewed" / "archive" / "weekly").glob("*.json"))
                monthly_files = list((data / "chatgpt-reviewed" / "archive" / "monthly").glob("*.json"))
                self.assertEqual([p.name for p in weekly_files], ["2026-W42.json"])
                self.assertEqual([p.name for p in monthly_files], ["2026-10.json"])

                weekly_html = render.archive_cards("weekly")
                monthly_html = render.archive_cards("monthly")
                self.assertIn("2026年第42周", weekly_html)
                self.assertIn("Multimodal Vision Research Weekly", weekly_html)
                self.assertIn("radar-archive-item", weekly_html)
                self.assertIn("data-archive-type=\"weekly\"", weekly_html)
                self.assertIn("Compact multimodal evaluation", weekly_html)
                self.assertIn("2026年10月", monthly_html)
                self.assertIn("Multimodal Vision Research Monthly", monthly_html)
                self.assertIn("data-archive-type=\"monthly\"", monthly_html)

    def test_changed_report_creates_revision_instead_of_overwriting_history(self):
        first = report(
            "weekly", "2026-10-12", "2026-10-19T09:22:26Z",
            "Weekly report", "Original saved summary."
        )
        revised = dict(first)
        revised["summary"] = "Corrected summary with a verified update."
        with tempfile.TemporaryDirectory() as temp:
            data = Path(temp)
            with patch.object(render, "DATA", data):
                render.archive_latest_reports({"weekly": first})
                render.archive_latest_reports({"weekly": revised})
                files = list((data / "chatgpt-reviewed" / "archive" / "weekly").glob("*.json"))
                self.assertEqual(len(files), 2)
                base = data / "chatgpt-reviewed" / "archive" / "weekly" / "2026-W42.json"
                self.assertEqual(render.load(base)["summary"], "Original saved summary.")
                self.assertEqual(render.archive_latest_reports({"weekly": revised}), 0)
                self.assertEqual(len(list(base.parent.glob("*.json"))), 2)


if __name__ == "__main__":
    unittest.main()

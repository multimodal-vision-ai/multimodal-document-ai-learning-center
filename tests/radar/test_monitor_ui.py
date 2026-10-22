"""The homepage must distinguish an actual publish check from a report-only status."""
import json
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts" / "radar"))
from monitor_ui import widget

NOW = datetime(2026, 10, 22, 12, tzinfo=timezone.utc)

class MonitorUITests(unittest.TestCase):
    def write(self, path, value):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(value, ensure_ascii=False), encoding="utf-8")

    def test_publish_evidence_and_run_links_are_visible(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            self.write(root / "automation-health.json", {
                "schema_version": 1,
                "watchdog": {"last_run_at": "2026-10-22T11:30:00Z", "status": "completed"},
                "publication": {
                    "status": "success",
                    "checked_at": "2026-10-22T11:25:00Z",
                    "refresh_workflow_run_url": "https://github.com/example/repo/actions/runs/123",
                    "dev_preview_workflow_run_url": "https://github.com/example/repo/actions/runs/456",
                    "home_content_verified": True,
                    "detail_content_verified": True,
                    "message": "Public HTML contains the expected page headings."
                }
            })
            body = widget(root, NOW)
            self.assertIn("最近一次报告发布与页面核验通过", body)
            self.assertIn("查看报告发布工作流", body)
            self.assertIn("查看 DEV 预览工作流", body)
            self.assertIn("2026-10-22T11:30:00Z", body)

    def test_missing_publish_evidence_is_never_reported_as_success(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            self.write(root / "automation-health.json", {
                "schema_version": 1,
                "watchdog": {"last_run_at": "2026-10-22T11:30:00Z", "status": "completed"},
                "publication": {"status": "unknown", "message": "No successful run found."}
            })
            body = widget(root, NOW)
            self.assertIn("尚无可核验的发布记录", body)
            self.assertNotIn("最近一次报告发布与页面核验通过", body)

    def test_success_label_requires_both_page_content_checks(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            self.write(root / "automation-health.json", {
                "schema_version": 1,
                "watchdog": {"last_run_at": "2026-10-22T11:30:00Z", "status": "completed"},
                "publication": {
                    "status": "success",
                    "home_content_verified": True,
                    "detail_content_verified": False,
                    "message": "Detail page was not verified."
                }
            })
            body = widget(root, NOW)
            self.assertIn("尚无可核验的发布记录", body)
            self.assertNotIn("最近一次报告发布与页面核验通过", body)

if __name__ == "__main__":
    unittest.main()

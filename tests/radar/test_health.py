"""Operational monitoring tests: green, degraded, overdue, schema and cadence.
Tests do not claim actual automation tasks ran.
"""
import sys
import tempfile
import unittest
from pathlib import Path
from datetime import datetime, timezone, timedelta
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/"scripts"/"radar"))
from core import save
from health import inspect, FIRST_DEADLINES
from screening import build_queue
from test_screening import RESEARCH, screened, report as make_report

NOW=datetime(2026,10,22,12,tzinfo=timezone.utc)
def snapshot(root,now=NOW,failures=None):
    q=build_queue([RESEARCH],now)
    save(root/"screening-queue.json",q)
    save(root/"collection-status.json",{
        "last_successful_run_utc":now.isoformat(),
        "source_failures":failures or [],
    })
    return q

class HealthTests(unittest.TestCase):
    def test_initial_rollout_shows_missing_v2_reports_not_success(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            snapshot(root)
            actual=inspect(root,NOW)
            self.assertEqual(actual["overall"],"watching")
            self.assertEqual(actual["tasks"]["daily"]["status"],"awaiting_first_v2_run")
            self.assertEqual(actual["tasks"]["weekly"]["status"],"awaiting_first_v2_run")
            self.assertEqual(actual["tasks"]["monthly"]["status"],"awaiting_first_v2_run")
    def test_future_missed_first_deadlines_become_overdue(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            when=FIRST_DEADLINES["monthly"]+timedelta(hours=2)
            snapshot(root,when)
            actual=inspect(root,when)
            self.assertEqual(set(x["status"] for x in actual["tasks"].values()),{"overdue"})
            self.assertEqual(actual["overall"],"needs_attention")
    def test_three_v2_reports_are_valid_data_outputs(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            q=snapshot(root)
            for kind in ("daily","weekly","monthly"):
                r=make_report(q)
                r["generated_at"]=NOW.isoformat()
                save(root/"chatgpt-reviewed"/f"latest-{kind}.json",r)
            actual=inspect(root,NOW)
            self.assertEqual(actual["overall"],"reports_verified")
            self.assertTrue(all(x["status"]=="verified_report" for x in actual["tasks"].values()))
            self.assertEqual(actual["tasks"]["daily"]["recommended_count"],1)
    def test_no_high_value_is_successful_run_without_padded_recommendations(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            q=snapshot(root)
            r=make_report(q,[])
            r["generated_at"]=NOW.isoformat()
            r["status"]="no_high_value"
            save(root/"chatgpt-reviewed"/"latest-daily.json",r)
            actual=inspect(root,NOW)
            self.assertEqual(actual["tasks"]["daily"]["status"],"verified_report")
            self.assertEqual(actual["tasks"]["daily"]["recommended_count"],0)
    def test_invalid_second_stage_is_alerted(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            q=snapshot(root)
            r=make_report(q)
            r["generated_at"]=NOW.isoformat()
            r["items"][0]["evidence_urls"]=["https://unrelated.example.org/fake"]
            save(root/"chatgpt-reviewed"/"latest-weekly.json",r)
            actual=inspect(root,NOW)
            self.assertEqual(actual["tasks"]["weekly"]["status"],"invalid")
            self.assertEqual(actual["overall"],"needs_attention")
    def test_source_429_is_degraded_but_no_fake_collection_success(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            snapshot(root,failures=["arxiv: HTTP 429"])
            actual=inspect(root,NOW)
            self.assertEqual(actual["acquisition"]["status"],"degraded")
            self.assertIn("429",actual["acquisition"]["source_failures"][0])
    def test_stale_queue_is_alerted(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            snapshot(root,now=NOW-timedelta(days=3))
            actual=inspect(root,NOW)
            self.assertEqual(actual["acquisition"]["status"],"stale")
            self.assertEqual(actual["overall"],"needs_attention")
if __name__=="__main__":
    unittest.main()

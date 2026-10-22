"""Auditable, clock-aware status of the unattended ChatGPT research-radar pipeline.

No API calls. Status is calculated from committed GitHub data; a successful
unit-test or manually inserted stage-two item is NOT evidence that a daily,
weekly or monthly ChatGPT automation executed.
"""
import argparse
import json
import os
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

from core import DATA, load, parse_dt
from screening import report_items

ROLLOUT_UTC = datetime(2026, 10, 22, 3, 54, tzinfo=timezone.utc)
# First expected reports AFTER v2 rollout, including conservative delivery grace.
FIRST_DEADLINES = {
    "daily": datetime(2026, 10, 23, 10, 0, tzinfo=timezone.utc),
    "weekly": datetime(2026, 10, 27, 1, 0, tzinfo=timezone.utc),
    "monthly": datetime(2026, 11, 2, 1, 0, tzinfo=timezone.utc),
}
MAX_AGE = {
    "daily": timedelta(hours=40),
    "weekly": timedelta(days=9),
    "monthly": timedelta(days=35),
}
LABELS = {"daily": "每日预警", "weekly": "每周科研周报", "monthly": "每月选题分析"}


def as_utc(value):
    if not value:
        return None
    try:
        dt = parse_dt(value)
        return dt.astimezone(timezone.utc) if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
    except (ValueError, TypeError, OverflowError):
        return None


def inspect(data_path=DATA, now=None):
    now = now or datetime.now(timezone.utc)
    if now.tzinfo is None:
        now = now.replace(tzinfo=timezone.utc)
    queue = load(data_path / "screening-queue.json", {})
    collection = load(data_path / "collection-status.json", {})
    queue_time = as_utc(queue.get("generated_at"))
    source_time = as_utc(collection.get("last_successful_run_utc"))
    source_failures = collection.get("source_failures") or []
    if not isinstance(source_failures, list):
        source_failures = ["Malformed source_failures field"]
    collector_age = (now - source_time) if source_time else None
    queue_age = (now - queue_time) if queue_time else None
    if collector_age is None or queue_age is None or collector_age > timedelta(hours=36) or queue_age > timedelta(hours=36):
        acquisition = "stale"
    elif source_failures:
        acquisition = "degraded"
    else:
        acquisition = "healthy"
    result = {
        "schema_version": 1,
        "checked_at": now.isoformat(timespec="seconds"),
        "scope": "DEV status derived from stored data, not proof of scheduler execution",
        "acquisition": {
            "status": acquisition,
            "queue_generated_at": queue.get("generated_at"),
            "collector_last_success": collection.get("last_successful_run_utc"),
            "high_match_queue_count": queue.get("total", 0),
            "source_failures": source_failures,
        },
        "tasks": {},
    }
    for kind in ("daily", "weekly", "monthly"):
        report = load(data_path / "chatgpt-reviewed" / f"latest-{kind}.json", {})
        generated = as_utc(report.get("generated_at"))
        is_new = report.get("screening_schema_version") == 2
        status = "awaiting_first_v2_run"
        errors = []
        recommended = 0
        if is_new:
            if generated is None:
                status = "invalid"
                errors.append("v2 report missing a valid generated_at")
            else:
                selected, errors = report_items(report, queue)
                recommended = len(selected)
                if errors:
                    status = "invalid"
                elif generated < ROLLOUT_UTC:
                    status = "legacy_before_rollout"
                elif now - generated > MAX_AGE[kind]:
                    status = "overdue"
                else:
                    status = "verified_report"
        elif now >= FIRST_DEADLINES[kind]:
            status = "overdue"
        result["tasks"][kind] = {
            "label": LABELS[kind],
            "status": status,
            "generated_at": report.get("generated_at"),
            "first_due_by_utc": FIRST_DEADLINES[kind].isoformat(timespec="seconds"),
            "report_status": report.get("status"),
            "second_stage_schema": report.get("screening_schema_version"),
            "recommended_count": recommended,
            "issues": errors[:8],
            "note": (
                "A valid saved v2 report verifies data output, not the external scheduler trigger. "
                "Verify automation run history and the GitHub preview rebuild separately."
            ),
        }
    result["overall"] = (
        "needs_attention" if acquisition == "stale" or
        any(item["status"] in ("invalid", "overdue") for item in result["tasks"].values())
        else "watching"
        if any(item["status"] != "verified_report" for item in result["tasks"].values())
        else "reports_verified"
    )
    return result


REPORT_PATH = re.compile(r"^research-radar/data/chatgpt-reviewed/latest-(daily|weekly|monthly)\\.json$")


def validate_updated_reports(data_path=DATA, event_path=None, now=None):
    """Require every newly written latest report to use the v2 screening contract."""
    event_path = event_path or os.environ.get("GITHUB_EVENT_PATH")
    if not event_path or not Path(event_path).exists():
        return ["GITHUB_EVENT_PATH is unavailable; cannot verify changed report files"]
    event = json.loads(Path(event_path).read_text(encoding="utf-8"))
    changed = set()
    for commit in event.get("commits", []):
        if isinstance(commit, dict):
            for key in ("added", "modified", "removed"):
                changed.update(commit.get(key, []))
    head = event.get("head_commit")
    if isinstance(head, dict):
        for key in ("added", "modified", "removed"):
            changed.update(head.get(key, []))
    changed_reports = {}
    for path in changed:
        match = REPORT_PATH.fullmatch(path)
        if match:
            changed_reports[match.group(1)] = path
    if not changed_reports:
        print("No latest daily/weekly/monthly report changed in this push; existing archives remain readable.")
        return []

    queue = load(data_path / "screening-queue.json", {})
    now = now or datetime.now(timezone.utc)
    if now.tzinfo is None:
        now = now.replace(tzinfo=timezone.utc)
    errors = []
    for kind, relpath in changed_reports.items():
        report = load(data_path / "chatgpt-reviewed" / f"latest-{kind}.json", {})
        prefix = f"{relpath}: "
        if report.get("schema_version") != 1:
            errors.append(prefix + "schema_version must be 1")
        if report.get("report_type") != kind:
            errors.append(prefix + f"report_type must be {kind}")
        if report.get("screening_schema_version") != 2:
            errors.append(prefix + "new report writes must use screening_schema_version=2")
        if report.get("first_stage_threshold") != 8.0:
            errors.append(prefix + "first_stage_threshold must equal 8.0")
        if report.get("status") not in ("completed", "no_high_value"):
            errors.append(prefix + "status must be completed or no_high_value")
        generated = as_utc(report.get("generated_at"))
        if generated is None:
            errors.append(prefix + "generated_at must be a valid UTC/ISO timestamp")
        elif generated < ROLLOUT_UTC:
            errors.append(prefix + "generated_at predates the v2 rollout")
        elif generated > now + timedelta(minutes=5):
            errors.append(prefix + "generated_at is in the future")
        elif now - generated > MAX_AGE[kind]:
            errors.append(prefix + "generated_at is outside the task freshness window")
        items = report.get("items")
        if not isinstance(items, list):
            errors.append(prefix + "items must be an array")
            items = []
        recommended_in_report = [
            item for item in items
            if isinstance(item, dict) and item.get("selection_status") == "recommended"
        ]
        if report.get("status") == "no_high_value" and items:
            errors.append(prefix + "no_high_value requires items=[]")
        if report.get("status") == "completed" and not recommended_in_report:
            errors.append(prefix + "completed requires at least one recommended item; otherwise use no_high_value with items=[]")
        _, item_errors = report_items(report, queue)
        errors.extend(prefix + item_error for item_error in item_errors)
    return errors


def main():
    parser = argparse.ArgumentParser(description="Check unattended research-radar report health.")
    parser.add_argument("--validate-updated", action="store_true",
                        help="reject newly committed latest reports that do not meet the v2 contract")
    parser.add_argument("--event-path", type=Path, default=None)
    args = parser.parse_args()
    if args.validate_updated:
        problems = validate_updated_reports(event_path=str(args.event_path) if args.event_path else None)
        if problems:
            print("New ChatGPT report commit rejected:", file=__import__("sys").stderr)
            for problem in problems:
                print(" - " + problem, file=__import__("sys").stderr)
            return 1
    print(json.dumps(inspect(), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    main()

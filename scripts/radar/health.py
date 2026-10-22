"""Auditable, clock-aware status of the unattended ChatGPT research-radar pipeline.

No API calls. Status is calculated from committed GitHub data; a successful
unit-test or manually inserted stage-two item is NOT evidence that a daily,
weekly or monthly ChatGPT automation executed.
"""
import json
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


def main():
    print(json.dumps(inspect(), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

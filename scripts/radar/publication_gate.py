"""One publication gate for current recommendations, reports and new archives.

Legacy reports are historical data only; they are never current recommendations.
New v2 reports fail closed if any recommended item fails the four-dimension rubric.
"""
from datetime import datetime, timezone
import hashlib
import json
from core import parse_dt
from screening import SCHEMA_VERSION, DISPLAY_MATCH_THRESHOLD, report_items

ROLLOUT_UTC = datetime(2026, 10, 22, 3, 54, tzinfo=timezone.utc)
LEGACY_NOTE = "尚未按当前四维标准复评"
ACTIVE = {"completed", "no_high_value"}


def snapshot_digest(reports, queue):
    payload = json.dumps({"reports": reports, "queue": queue}, sort_keys=True,
                         ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def assess_report(report, kind, queue):
    """Return (state, selected items), or raise ValueError on an invalid current report.

    state is absent, legacy, or validated. This function does not silently convert
    a failing new report to an empty report or to a historical recommendation.
    """
    if report is None or report == {}:
        return "absent", []
    if not isinstance(report, dict):
        raise ValueError(f"{kind}: report must be a JSON object")
    if report.get("status") in ("not_published", "pending"):
        if report.get("items") not in (None, []):
            raise ValueError(f"{kind}: unpublished report must not contain items")
        return "absent", []
    if report.get("status") not in ACTIVE:
        raise ValueError(f"{kind}: invalid report status")
    if not isinstance(report.get("items"), list) or any(not isinstance(item, dict) for item in report["items"]):
        raise ValueError(f"{kind}: items must be an array of objects")
    try:
        generated = parse_dt(report["generated_at"])
    except (ValueError, TypeError, KeyError, OverflowError) as exc:
        raise ValueError(f"{kind}: missing or invalid generated_at") from exc
    if report.get("screening_schema_version") != SCHEMA_VERSION:
        if report.get("screening_schema_version") is not None:
            raise ValueError(f"{kind}: unsupported screening_schema_version")
        if generated >= ROLLOUT_UTC:
            raise ValueError(f"{kind}: new reports require screening_schema_version={SCHEMA_VERSION}")
        return "legacy", []
    errors = []
    if not isinstance(queue, dict) or not isinstance(queue.get("candidates"), list):
        errors.append("screening queue must contain a candidates array")
    if report.get("schema_version") != 1:
        errors.append("schema_version must be 1")
    if report.get("report_type") != kind:
        errors.append(f"report_type must be {kind}")
    if report.get("first_stage_threshold") != DISPLAY_MATCH_THRESHOLD:
        errors.append("first_stage_threshold must match the current first-stage threshold")
    if errors:
        raise ValueError(f"{kind}: " + "; ".join(errors))
    selected, item_errors = report_items(report, queue)
    errors.extend(item_errors)
    if report.get("status") == "completed" and not selected:
        errors.append("completed report requires at least one validated recommended item")
    if errors:
        raise ValueError(f"{kind}: " + "; ".join(errors))
    return "validated", selected


def validate_snapshot(reports, queue):
    """Fail the build on any invalid current report before rendering or writing archives."""
    states = {}
    for kind in ("screened", "daily", "weekly", "monthly"):
        states[kind] = assess_report(reports.get(kind, {}), kind, queue)
    return states

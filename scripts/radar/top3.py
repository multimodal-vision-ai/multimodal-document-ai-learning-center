"""Persistent rolling Top 3 research recommendations.

A newly validated weekly recommendation replaces an incumbent only when its
weighted four-dimension score is strictly greater than the current minimum.
Weekly report archives remain independent and immutable.
"""
import argparse
import copy
import hashlib
import json
import math
from datetime import datetime, timezone
from pathlib import Path

from core import DATA, iso_now, load, parse_dt, save, valid_url
from screening import DIMENSIONS, VALUE_THRESHOLD, WEIGHTS, collect_screened

SCHEMA_VERSION = 1
POLICY = "replace-only-if-strictly-higher"
STATE_RELATIVE_PATH = Path("chatgpt-reviewed") / "top3.json"


def state_path(data_dir=DATA):
    return Path(data_dir) / STATE_RELATIVE_PATH


def _timestamp(now=None):
    if now is None:
        return iso_now()
    if now.tzinfo is None:
        now = now.replace(tzinfo=timezone.utc)
    return now.astimezone(timezone.utc).isoformat(timespec="seconds")


def _score(item):
    value = item.get("value_score")
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError("Top 3 item requires a finite numeric value_score")
    if not 0 <= value <= 10:
        raise ValueError("Top 3 value_score must be between 0 and 10")
    return float(value)


def _validate_item(item):
    if not isinstance(item, dict):
        raise ValueError("Top 3 item must be an object")
    for key in ("candidate_id", "title", "summary", "why_selected", "research_opportunity"):
        if not isinstance(item.get(key), str) or not item[key].strip():
            raise ValueError(f"Top 3 item requires {key}")
    if item.get("selection_status") != "recommended":
        raise ValueError("Only validated recommended items may enter the Top 3")
    if item.get("confidence") not in ("high", "medium"):
        raise ValueError("Top 3 item confidence must be high or medium")

    dimensions = item.get("evaluation_dimensions")
    if not isinstance(dimensions, dict) or set(dimensions) != set(DIMENSIONS):
        raise ValueError("Top 3 item requires all four scientific assessment dimensions")
    scores = {}
    for name in DIMENSIONS:
        record = dimensions.get(name)
        if not isinstance(record, dict):
            raise ValueError(f"Top 3 item dimension {name} must be an object")
        value = record.get("score")
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
            raise ValueError(f"Top 3 item dimension {name} requires a finite score")
        if not 0 <= value <= 10:
            raise ValueError(f"Top 3 item dimension {name} score must be between 0 and 10")
        if value < 5:
            raise ValueError(f"Top 3 item dimension {name} score is below 5")
        scores[name] = float(value)

    expected = round(sum(scores[name] * WEIGHTS[name] for name in DIMENSIONS), 2)
    actual = _score(item)
    if abs(actual - expected) > 0.01:
        raise ValueError(f"Top 3 score mismatch: expected {expected}, found {actual}")
    if actual < VALUE_THRESHOLD:
        raise ValueError(f"Top 3 score is below the recommendation threshold {VALUE_THRESHOLD}")

    urls = item.get("evidence_urls")
    if not isinstance(urls, list) or not urls or any(not valid_url(url) for url in urls):
        raise ValueError("Top 3 item requires valid HTTPS evidence URLs")
    if item.get("top3_selected_at"):
        parse_dt(item["top3_selected_at"])
    if item.get("_report_generated"):
        parse_dt(item["_report_generated"])
    return item


def validate_top3_state(state):
    if not isinstance(state, dict) or state.get("schema_version") != SCHEMA_VERSION:
        raise ValueError("Persistent Top 3 state has an unsupported schema")
    if state.get("policy") != POLICY:
        raise ValueError("Persistent Top 3 replacement policy is not recognized")
    items = state.get("items")
    if not isinstance(items, list) or len(items) > 3:
        raise ValueError("Persistent Top 3 state must contain at most three items")
    seen = set()
    scores = []
    for item in items:
        _validate_item(item)
        candidate_id = item["candidate_id"]
        if candidate_id in seen:
            raise ValueError(f"Duplicate Top 3 candidate_id: {candidate_id}")
        seen.add(candidate_id)
        scores.append(_score(item))
    if scores != sorted(scores, reverse=True):
        raise ValueError("Persistent Top 3 items must be sorted by descending score")
    for field in ("updated_at", "last_evaluated_report_at"):
        if state.get(field):
            parse_dt(state[field])
    return state


def load_top3_state(data_dir=DATA):
    """Load and validate persisted state, returning None when it has not been seeded."""
    path = state_path(data_dir)
    if not path.exists():
        return None
    return validate_top3_state(load(path))


def _weekly_candidates(report, queue):
    selected, problems = collect_screened({"weekly": report or {}}, queue or {})
    if problems:
        raise ValueError("Invalid weekly report for Top 3 update: " + "; ".join(problems))
    return sorted(selected, key=lambda item: float(item["value_score"]), reverse=True)


def _prepare_item(item, generated_at, selected_at=None):
    result = copy.deepcopy(item)
    result["_report_type"] = "weekly"
    result["_report_generated"] = result.get("_report_generated") or generated_at
    result["_scoring_source"] = (
        result.get("_scoring_source") or "ChatGPT 四维科研价值评价"
    )
    result["top3_selected_at"] = (
        selected_at or result.get("top3_selected_at") or generated_at or iso_now()
    )
    return result


def bootstrap_top3(data_dir=DATA, reports=None, queue=None, now=None):
    """Seed the persistent list from the currently published weekly report, once only."""
    path = state_path(data_dir)
    if path.exists():
        return validate_top3_state(load(path))

    if queue is None:
        queue = load(Path(data_dir) / "screening-queue.json", {})
    if reports is None:
        reports = {
            "weekly": load(Path(data_dir) / "chatgpt-reviewed" / "latest-weekly.json", {})
        }
    report = reports.get("weekly", {}) if isinstance(reports, dict) else {}
    generated_at = report.get("generated_at") if isinstance(report, dict) else None
    candidates = _weekly_candidates(report, queue)
    items = [
        _prepare_item(item, generated_at, generated_at or _timestamp(now))
        for item in candidates[:3]
    ]
    state = {
        "schema_version": SCHEMA_VERSION,
        "policy": POLICY,
        "updated_at": generated_at or _timestamp(now),
        "last_evaluated_report_at": generated_at,
        "items": items,
    }
    validate_top3_state(state)
    save(path, state)
    return state


def update_top3_state(reports, queue, data_dir=DATA, now=None):
    """Compare this week's validated recommendations with the persistent Top 3."""
    path = state_path(data_dir)
    state = load_top3_state(data_dir)
    if state is None:
        state = bootstrap_top3(data_dir, reports=reports, queue=queue, now=now)

    before = json.dumps(state, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    items = copy.deepcopy(state["items"])
    report = reports.get("weekly", {}) if isinstance(reports, dict) else {}
    generated_at = report.get("generated_at") if isinstance(report, dict) else None
    candidates = _weekly_candidates(report, queue)

    for candidate in candidates:
        candidate_id = candidate["candidate_id"]
        candidate_score = float(candidate["value_score"])
        existing_index = next(
            (index for index, item in enumerate(items) if item["candidate_id"] == candidate_id),
            None,
        )
        if existing_index is not None:
            incumbent = items[existing_index]
            if candidate_score > float(incumbent["value_score"]):
                items[existing_index] = _prepare_item(
                    candidate, generated_at,
                    incumbent.get("top3_selected_at") or incumbent.get("_report_generated"),
                )
            continue

        prepared = _prepare_item(candidate, generated_at, generated_at or _timestamp(now))
        if len(items) < 3:
            items.append(prepared)
        else:
            lowest_index = min(range(len(items)), key=lambda index: float(items[index]["value_score"]))
            lowest_score = float(items[lowest_index]["value_score"])
            # Strict comparison is intentional: an equal score never displaces an incumbent.
            if candidate_score > lowest_score:
                items[lowest_index] = prepared
        items.sort(key=lambda item: float(item["value_score"]), reverse=True)

    items.sort(key=lambda item: float(item["value_score"]), reverse=True)
    state["items"] = items
    if generated_at:
        state["last_evaluated_report_at"] = generated_at
    after_items = json.dumps(state, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    if before != after_items:
        # The list's change time only moves when the stored list or evaluation marker changes.
        if items != load_top3_state(data_dir)["items"] if path.exists() else True:
            state["updated_at"] = _timestamp(now)
        validate_top3_state(state)
        save(path, state)
    return state


def top3_digest(state):
    canonical = json.dumps(state, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def main():
    parser = argparse.ArgumentParser(description="Initialize the persistent Top 3 before a weekly report refresh.")
    parser.add_argument("--bootstrap", action="store_true", help="Seed Top 3 from the currently published weekly report only if missing.")
    args = parser.parse_args()
    if not args.bootstrap:
        parser.error("Use --bootstrap to seed the persistent Top 3.")
    state = bootstrap_top3()
    print(f"Persistent Top 3 ready: {len(state['items'])} item(s); state file: {state_path()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

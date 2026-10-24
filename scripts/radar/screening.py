"""Two-stage research screening: transparent rule shortlist -> evidence-linked AI assessment.

A topic score is NOT a scientific-value score. Existing ChatGPT report entries with
no stage-two assessment remain historical archives; never promote automatically.
"""
from datetime import datetime, timedelta, timezone
from pathlib import Path
import json
import sys

from core import DATA, load, parse_dt, save, valid_url
from ranking import rank_candidates, DISPLAY_MATCH_THRESHOLD

SCHEMA_VERSION = 2
VALUE_THRESHOLD = 7.5
DIMENSIONS = ("innovation", "open_source", "reproducibility", "research_potential")
WEIGHTS = {"innovation": 0.30, "open_source": 0.25,
           "reproducibility": 0.25, "research_potential": 0.20}


def build_queue(candidates, now=None):
    now = now or datetime.now(timezone.utc)
    shortlisted = rank_candidates(
        candidates, now - timedelta(days=7), now, limit=30,
        threshold=DISPLAY_MATCH_THRESHOLD
    )
    return {
        "schema_version": SCHEMA_VERSION,
        "generated_at": now.isoformat(timespec="seconds"),
        "first_stage_threshold": DISPLAY_MATCH_THRESHOLD,
        "total": len(shortlisted),
        "candidates": [{
            k: item.get(k) for k in (
                "id", "title", "category", "source_url", "paper_url", "github_url",
                "huggingface_url", "pdf_url", "description", "abstract",
                "published_at", "event_at", "event_label", "discovered_from",
                "match_score", "match_reasons", "priority_tier",
                "github_stars", "github_license", "hf_downloads",
            )
        } for item in shortlisted],
        "note": "Queue only. No item is a recommendation until independently assessed and saved with stage-two evidence.",
    }


def _date(value):
    try:
        return parse_dt(value)
    except (ValueError, TypeError, OverflowError, KeyError):
        return None


def _score(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and 0 <= value <= 10


def _candidate_lookup(queue):
    return {
        item.get("id"): item
        for item in queue.get("candidates", [])
        if isinstance(item, dict) and item.get("id")
    }


def evaluate_item(item, queue):
    """Return (valid, issues, weighted score); evidence validity is structural, not truth checking."""
    issues = []
    if not isinstance(item, dict):
        return False, ["item is not an object"], None
    cid = item.get("candidate_id")
    original = _candidate_lookup(queue).get(cid) if isinstance(cid, str) else None
    if original is None:
        issues.append("candidate_id is absent from the >=8 first-stage queue")
    elif not _score(original.get("match_score")) or original["match_score"] < DISPLAY_MATCH_THRESHOLD:
        issues.append("first-stage score is below 8.0")

    if item.get("selection_status") not in ("recommended", "not_recommended"):
        issues.append("selection_status must be recommended or not_recommended")
    if not item.get("summary") or len(str(item.get("summary")).strip()) < 15:
        issues.append("a substantive summary is required")
    if not item.get("why_selected") or len(str(item.get("why_selected")).strip()) < 15:
        issues.append("a substantive decision rationale is required")
    if not item.get("research_opportunity") or len(str(item.get("research_opportunity")).strip()) < 12:
        issues.append("research opportunity or limitation must be explained")

    dims = item.get("evaluation_dimensions")
    value_score = None
    if not isinstance(dims, dict) or set(dims) != set(DIMENSIONS):
        issues.append("all four scientific assessment dimensions are required")
    else:
        scores = {}
        for dimension in DIMENSIONS:
            record = dims.get(dimension)
            if not isinstance(record, dict) or not _score(record.get("score")):
                issues.append(f"{dimension} requires numeric 0-10 score")
                continue
            if len(str(record.get("rationale") or "").strip()) < 12:
                issues.append(f"{dimension} requires a substantive evidence-based rationale")
            scores[dimension] = float(record["score"])
        if len(scores) == len(DIMENSIONS):
            value_score = round(sum(scores[k] * WEIGHTS[k] for k in DIMENSIONS), 2)

    evidence = item.get("evidence_urls")
    if not isinstance(evidence, list) or not evidence or any(not valid_url(x) for x in evidence):
        issues.append("at least one valid original evidence URL is required")
    if original and isinstance(evidence, list):
        source = original.get("source_url")
        accepted = {original.get(k) for k in ("source_url", "paper_url", "github_url", "huggingface_url", "pdf_url")}
        if not any(url in accepted for url in evidence):
            issues.append("evidence must include the candidate's original source or paper/repo URL")
        if item.get("title") != original.get("title"):
            issues.append("title must match stage-one candidate; no invented names")

    if item.get("confidence") not in ("high", "medium", "low"):
        issues.append("confidence must be high, medium, or low")
    for key in ("parameters", "gpu_requirement", "weights_open", "training_code_open", "data_open"):
        if key not in item:
            issues.append(f"unknown facts must be explicit null: {key}")
    for key in ("weights_open", "training_code_open", "data_open"):
        if key in item and item[key] is not None and not isinstance(item[key], bool):
            issues.append(f"{key} must be boolean or null")

    if item.get("selection_status") == "recommended":
        if value_score is not None and value_score < VALUE_THRESHOLD:
            issues.append(f"scientific-value score below {VALUE_THRESHOLD}")
        if item.get("confidence") == "low":
            issues.append("low-confidence item cannot be recommended")
        if isinstance(dims, dict) and any(
            isinstance(dims.get(k), dict) and _score(dims[k].get("score"))
            and dims[k]["score"] < 5 for k in DIMENSIONS
        ):
            issues.append("recommended item has a dimension below 5")
    return not issues, issues, value_score


def report_items(report, queue):
    """Only stage-two schema v2 outputs count as AI-curated recommendations."""
    if not isinstance(report, dict) or report.get("screening_schema_version") != SCHEMA_VERSION:
        return [], []
    problems = []
    if report.get("status") not in ("completed", "no_high_value"):
        problems.append("invalid report status")
    if report.get("status") == "no_high_value" and report.get("items"):
        problems.append("no_high_value report must have empty items")
    if _date(report.get("generated_at")) is None:
        problems.append("missing generated_at")
    if report.get("first_stage_threshold") != DISPLAY_MATCH_THRESHOLD:
        problems.append("first-stage threshold must be 8.0")
    results = []
    for number, item in enumerate(report.get("items", [])):
        valid, errors, score = evaluate_item(item, queue)
        if not valid:
            problems.extend(f"items[{number}]: {error}" for error in errors)
        elif item.get("selection_status") == "recommended":
            selected = dict(item)
            selected["value_score"] = score
            results.append(selected)
    if problems:
        return [], problems
    return results, []


def collect_screened(reports, queue):
    """Separate strictly validated AI results from legacy summaries."""
    from publication_gate import assess_report
    entries, problems = [], []
    for kind in ("screened", "daily", "weekly", "monthly"):
        report = reports.get(kind, {})
        try:
            _, approved = assess_report(report, kind, queue)
        except ValueError as exc:
            problems.append(str(exc))
            continue
        for item in approved:
            item = dict(item)
            item["_report_type"] = kind
            item["_report_generated"] = report.get("generated_at")
            item["_scoring_source"] = report.get("scoring_source")
            entries.append(item)
    entries.sort(key=lambda x: (x.get("_report_generated") or "", x.get("value_score") or 0), reverse=True)
    seen, unique = set(), []
    for item in entries:
        if item["candidate_id"] in seen:
            continue
        seen.add(item["candidate_id"])
        unique.append(item)
    return unique, problems


def validate_storage(data_path=DATA):
    queue = load(data_path / "screening-queue.json", {})
    reports = {
        kind: load(data_path / "chatgpt-reviewed" / f"latest-{kind}.json", {})
        for kind in ("screened", "daily", "weekly", "monthly")
    }
    _, issues = collect_screened(reports, queue)
    return issues


def main():
    problems = validate_storage()
    if problems:
        print("Invalid second-stage assessment. Refusing publication:", file=sys.stderr)
        for problem in problems:
            print(" - " + problem, file=sys.stderr)
        return 1
    print("Second-stage assessments structurally validated (legacy archives stay unpromoted).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""Observe the scheduled ChatGPT report artifacts and publication evidence.

This script verifies report freshness and structure. It cannot prove a scheduled task ran
unless its output file changed; the separate watchdog task records the GitHub run and
public endpoint evidence it can actually observe.
"""
import argparse
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from core import DATA, load, parse_dt, save, iso_now
from screening import report_items, _candidate_lookup

REPORTS = {
    "daily": {"max_age_hours": 30, "label": "每日科研预警"},
    "weekly": {"max_age_hours": 24 * 8, "label": "每周科研周报"},
    "monthly": {"max_age_hours": 24 * 35, "label": "每月科研选题"},
}
SCHEMA_VERSION = 2
REPORT_PATH = re.compile(r"^research-radar/data/chatgpt-reviewed/latest-(daily|weekly|monthly)\.json$")


def _age_hours(value, now):
    try:
        dt = parse_dt(value)
    except (ValueError, TypeError, OverflowError):
        return None, "invalid_timestamp"
    delta = (now - dt).total_seconds() / 3600
    if delta < -0.0833:
        return round(delta, 2), "future_timestamp"
    return round(max(delta, 0), 2), None


def inspect_report(kind, report, queue, now):
    spec = REPORTS[kind]
    base = {
        "label": spec["label"],
        "max_age_hours": spec["max_age_hours"],
        "generated_at": report.get("generated_at") if isinstance(report, dict) else None,
        "schema_version": report.get("schema_version") if isinstance(report, dict) else None,
        "screening_schema_version": report.get("screening_schema_version") if isinstance(report, dict) else None,
        "item_count": len(report.get("items", [])) if isinstance(report, dict) and isinstance(report.get("items"), list) else 0,
        "recommended_count": 0,
        "age_hours": None,
        "status": "missing",
        "message": "",
        "errors": [],
    }
    if not isinstance(report, dict) or not report:
        base["message"] = "报告文件缺失或不是有效 JSON。"
        return base

    age, time_error = _age_hours(report.get("generated_at"), now)
    base["age_hours"] = age
    if report.get("status") == "not_published" or not report.get("generated_at"):
        base["status"] = "not_published"
        base["message"] = "计划任务尚未发布有效报告。"
        return base

    if report.get("schema_version") != 1 or report.get("report_type") != kind:
        base["status"] = "invalid"
        base["message"] = "报告的 schema_version 或 report_type 不正确。"
        base["errors"].append("schema_version must be 1 and report_type must match the scheduled task")
        return base

    if time_error:
        base["status"] = time_error
        base["message"] = "报告时间戳无法解析或位于未来。"
        return base

    if report.get("screening_schema_version") != SCHEMA_VERSION:
        if age is not None and age > spec["max_age_hours"]:
            base["status"] = "legacy_schema_and_stale"
            base["message"] = "报告仍是旧版格式，且已超过该任务的时效窗口。"
        else:
            base["status"] = "legacy_schema"
            base["message"] = "报告尚未采用四维科研价值评价 schema v2。"
        return base

    if report.get("first_stage_threshold") != 8.0:
        base["errors"].append("first_stage_threshold must equal 8.0")
    if report.get("status") not in ("completed", "no_high_value"):
        base["errors"].append("status must be completed or no_high_value")
    items = report.get("items")
    if not isinstance(items, list):
        base["errors"].append("items must be an array")
        items = []
    if report.get("status") == "no_high_value" and items:
        base["errors"].append("no_high_value reports must have an empty items array")
    if report.get("status") == "completed" and not any(
        isinstance(item, dict) and item.get("selection_status") == "recommended"
        for item in items
    ):
        base["errors"].append("completed reports must contain at least one recommended item; otherwise use no_high_value")

    approved, validation_errors = report_items(report, queue)
    base["recommended_count"] = len(approved)
    base["errors"].extend(validation_errors)

    if base["errors"]:
        base["status"] = "invalid"
        base["message"] = "报告未通过第二轮结构、评分或来源校验。"
        return base

    if age is not None and age > spec["max_age_hours"]:
        base["status"] = "stale"
        base["message"] = "报告格式有效，但已超过该任务的时效窗口。"
        return base

    base["status"] = "healthy"
    base["message"] = "报告新鲜，且通过第二轮结构、评分和来源关联校验。"
    return base


def build_health(data_dir=DATA, now=None, previous=None):
    now = now or datetime.now(timezone.utc)
    previous = previous if isinstance(previous, dict) else {}
    queue = load(Path(data_dir) / "screening-queue.json", {})
    reports = {
        kind: load(Path(data_dir) / "chatgpt-reviewed" / f"latest-{kind}.json", {})
        for kind in REPORTS
    }
    tasks = {kind: inspect_report(kind, report, queue, now) for kind, report in reports.items()}
    overall = "healthy" if all(item["status"] == "healthy" for item in tasks.values()) else "degraded"
    publication = previous.get("publication", {
        "status": "unknown",
        "checked_at": None,
        "run_url": None,
        "source_commit": None,
        "home_verified": None,
        "detail_verified": None,
        "message": "尚无可验证的最近一次报告更新发布记录。",
    })
    watchdog = previous.get("watchdog", {})
    return {
        "schema_version": 1,
        "checked_at": now.astimezone(timezone.utc).isoformat(timespec="seconds"),
        "overall_status": overall,
        "task_statuses": tasks,
        "publication": publication,
        "watchdog": watchdog,
        "verification_scope": [
            "report freshness against daily/weekly/monthly service windows",
            "stage-two schema and score thresholds",
            "candidate IDs and source URL association against the current >=8.0 queue",
            "last observed DEV publish run and public endpoint checks, if recorded",
        ],
        "limitation": "A healthy file validates the report artifact and recorded publish evidence; it cannot prove scientific claims or future task execution. Scheduled-task continuity requires subsequent dated runs.",
    }


def validate_report_for_publish(kind, report, queue, now=None):
    now = now or datetime.now(timezone.utc)
    errors = []
    if not isinstance(report, dict):
        return ["report is not an object"]
    if report.get("schema_version") != 1:
        errors.append("schema_version must be 1")
    if report.get("report_type") != kind:
        errors.append(f"report_type must be {kind}")
    if report.get("screening_schema_version") != SCHEMA_VERSION:
        errors.append("new report commits must use screening_schema_version=2")
    if report.get("first_stage_threshold") != 8.0:
        errors.append("first_stage_threshold must equal 8.0")
    if report.get("status") not in ("completed", "no_high_value"):
        errors.append("status must be completed or no_high_value")
    age, time_error = _age_hours(report.get("generated_at"), now)
    if time_error:
        errors.append(f"generated_at is invalid: {time_error}")
    if age is not None and age > REPORTS[kind]["max_age_hours"]:
        errors.append("newly committed report is already outside its freshness window")
    items = report.get("items")
    if not isinstance(items, list):
        errors.append("items must be an array")
        items = []
    if report.get("status") == "no_high_value" and items:
        errors.append("no_high_value reports must have empty items")
    if report.get("status") == "completed" and not any(
        isinstance(item, dict) and item.get("selection_status") == "recommended"
        for item in items
    ):
        errors.append("completed reports need at least one recommended item")
    _, item_errors = report_items(report, queue)
    errors.extend(item_errors)
    return errors


def validate_changed_reports(data_dir=DATA, event_path=None, now=None):
    event_path = event_path or os.environ.get("GITHUB_EVENT_PATH")
    if not event_path or not Path(event_path).exists():
        return ["GITHUB_EVENT_PATH is unavailable; cannot identify changed report files"]
    event = json.loads(Path(event_path).read_text(encoding="utf-8"))
    paths = set()
    for commit in event.get("commits", []):
        if isinstance(commit, dict):
            paths.update(commit.get("added", []))
            paths.update(commit.get("modified", []))
            paths.update(commit.get("removed", []))
    head = event.get("head_commit")
    if isinstance(head, dict):
        paths.update(head.get("added", []))
        paths.update(head.get("modified", []))
        paths.update(head.get("removed", []))
    changed = {}
    for path in paths:
        match = REPORT_PATH.fullmatch(path)
        if match:
            changed[match.group(1)] = path
    if not changed:
        print("No latest ChatGPT report files changed in this push; legacy archives remain readable.")
        return []
    queue = load(Path(data_dir) / "screening-queue.json", {})
    errors = []
    for kind, path in changed.items():
        report = load(Path(data_dir) / "chatgpt-reviewed" / f"latest-{kind}.json", {})
        for error in validate_report_for_publish(kind, report, queue, now):
            errors.append(f"{path}: {error}")
    return errors


def record_publication(data_dir=DATA, home_verified=True, detail_verified=True):
    path = Path(data_dir) / "automation-health.json"
    health = load(path, {})
    health["publication"] = {
        "status": "success" if home_verified and detail_verified else "failed",
        "checked_at": iso_now(),
        "run_url": (
            f'{os.getenv("GITHUB_SERVER_URL", "https://github.com")}/'
            f'{os.getenv("GITHUB_REPOSITORY", "multimodal-vision-ai/multimodal-document-ai-learning-center")}/actions/runs/'
            f'{os.getenv("GITHUB_RUN_ID", "")}'
        ),
        "source_commit": os.getenv("GITHUB_SHA"),
        "home_verified": bool(home_verified),
        "detail_verified": bool(detail_verified),
        "message": "DEV 首页与科研雷达详情页均已返回非空页面；新报告标题与二次评价展示由发布烟测验证。",
    }
    save(path, health)
    return health


def write_summary(health):
    path = os.getenv("GITHUB_STEP_SUMMARY")
    if not path:
        return
    rows = [
        "| 任务 | 状态 | 最近报告时间 | 年龄 | 说明 |",
        "|---|---|---|---:|---|",
    ]
    for kind, task in health["task_statuses"].items():
        age = "—" if task.get("age_hours") is None else f'{task["age_hours"]:.1f} h'
        rows.append(f'| {task["label"]} | {task["status"]} | {task.get("generated_at") or "—"} | {age} | {task["message"]} |')
    rows += [
        "",
        f'**总体状态：{health["overall_status"]}**',
        "",
        health["limitation"],
    ]
    with open(path, "a", encoding="utf-8") as f:
        f.write("\n".join(rows) + "\n")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, default=DATA)
    parser.add_argument("--write", action="store_true", help="write automation-health.json")
    parser.add_argument("--validate-changed", action="store_true", help="strictly validate report files changed by this GitHub push")
    parser.add_argument("--event-path", type=Path, default=None)
    parser.add_argument("--record-publication", action="store_true")
    args = parser.parse_args()

    if args.validate_changed:
        errors = validate_changed_reports(args.data_dir, str(args.event_path) if args.event_path else None)
        if errors:
            print("New report commit rejected:", file=sys.stderr)
            for error in errors:
                print(" - " + error, file=sys.stderr)
            return 1

    if args.record_publication:
        record_publication(args.data_dir)
    previous = load(args.data_dir / "automation-health.json", {})
    health = build_health(args.data_dir, previous=previous)
    if args.write:
        save(args.data_dir / "automation-health.json", health)
    write_summary(health)
    print(json.dumps({
        "overall_status": health["overall_status"],
        "task_statuses": {k: v["status"] for k, v in health["task_statuses"].items()},
        "publication": health.get("publication", {}).get("status"),
        "checked_at": health["checked_at"],
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

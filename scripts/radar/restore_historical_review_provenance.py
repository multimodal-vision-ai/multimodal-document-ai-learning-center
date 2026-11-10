#!/usr/bin/env python3
"""Restore evidence for old *reviewed* radar reports during the Pages build.

The rolling 7-day first-stage queue must not invalidate an earlier completed
four-dimensional review. Only candidates with matching, archived first-stage
evidence may be restored. This modifies the CI checkout, never radar-data.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path


KINDS = ("screened", "daily", "weekly", "monthly")
SOURCE_FIELDS = ("source_url", "paper_url", "github_url", "huggingface_url", "pdf_url")


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def source_matches(candidate: dict, item: dict) -> bool:
    accepted = {candidate.get(k) for k in SOURCE_FIELDS}
    return any(url in accepted for url in item.get("evidence_urls", []) if isinstance(url, str))


def restore(data_dir: Path) -> list[str]:
    queue_path = data_dir / "screening-queue.json"
    queue = read_json(queue_path)
    candidates = queue.get("candidates")
    threshold = queue.get("first_stage_threshold")
    if not isinstance(candidates, list) or threshold != 8.0:
        raise ValueError("Current screening queue is missing or malformed")
    existing = {c["id"]: c for c in candidates if isinstance(c, dict) and c.get("id")}
    required: dict[str, list[dict]] = {}
    for kind in KINDS:
        path = data_dir / "chatgpt-reviewed" / f"latest-{kind}.json"
        if not path.exists():
            continue
        report = read_json(path)
        if report.get("screening_schema_version") != 2 or report.get("status") != "completed":
            continue
        for item in report.get("items", []):
            cid = item.get("candidate_id")
            if cid and cid not in existing:
                required.setdefault(cid, []).append(item)
    if not required:
        print("No historical first-stage evidence needs restoration")
        return []

    recovered: dict[str, dict] = {}
    archive_root = data_dir / "chatgpt-reviewed" / "archive"
    for kind in ("weekly", "monthly"):
        for path in sorted((archive_root / kind).glob("*.json")):
            archive = read_json(path)
            archive_items = archive.get("items", [])
            saved_queue = archive.get("_screening_queue", {})
            for candidate in saved_queue.get("candidates", []):
                cid = candidate.get("id")
                if cid not in required:
                    continue
                score = candidate.get("match_score")
                if (isinstance(score, bool) or not isinstance(score, (int, float))
                        or score < threshold or score > 10):
                    continue
                if not all(
                    candidate.get("title") == item.get("title") and source_matches(candidate, item)
                    for item in required[cid]
                ):
                    continue
                if not any(
                    archived_item.get("candidate_id") == cid
                    and archived_item.get("title") == candidate.get("title")
                    and archived_item.get("selection_status") == "recommended"
                    for archived_item in archive_items
                ):
                    continue
                earlier = recovered.get(cid)
                if earlier and (earlier.get("title"), earlier.get("source_url")) != (
                    candidate.get("title"), candidate.get("source_url")
                ):
                    raise ValueError(f"Conflicting historical evidence for {cid}")
                recovered[cid] = candidate

    unresolved = sorted(set(required) - set(recovered))
    if unresolved:
        raise ValueError("Missing archived first-stage provenance for: " + ", ".join(unresolved))
    for cid in sorted(recovered):
        candidates.append(recovered[cid])
    queue["total"] = len(candidates)
    queue["publication_historical_evidence_ids"] = sorted(recovered)
    queue_path.write_text(json.dumps(queue, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Restored {len(recovered)} archived first-stage candidates for publication validation")
    return sorted(recovered)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, default=Path(__file__).resolve().parents[2] / "research-radar" / "data")
    args = parser.parse_args()
    try:
        restore(args.data_dir)
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        parser.exit(1, f"Historical review provenance validation failed: {exc}\n")

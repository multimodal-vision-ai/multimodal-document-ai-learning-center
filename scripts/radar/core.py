"""Reviewed research record validation, scoring, de-duplication and persistence."""
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "research-radar" / "data"
CATEGORIES = {"document", "video", "small-vlm", "agent"}
WEIGHTS = {
    "innovation": 0.20, "openness": 0.20, "compute": 0.15,
    "reproducibility": 0.15, "extension": 0.20, "commercialization": 0.10,
}
STATUS = {"pending", "approved", "rejected"}

def load(path, default=None):
    path = Path(path)
    return json.loads(path.read_text(encoding="utf-8-sig")) if path.exists() else default

def save(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")

def valid_url(value):
    if not isinstance(value, str):
        return False
    parsed = urlparse(value)
    return parsed.scheme == "https" and bool(parsed.hostname) and not parsed.username

def parse_dt(value):
    if not isinstance(value, str) or not value.strip():
        raise ValueError("Timestamp must be an ISO8601 string")
    dt = datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)

def iso_now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")

def verify(item):
    if not isinstance(item, dict):
        raise ValueError("Project must be an object")
    for key in ("id", "title", "category", "source_url", "published_at", "first_seen_at", "review"):
        if not str(item.get(key) or "").strip():
            raise ValueError(f"Missing {key}")
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{2,100}", item["id"]):
        raise ValueError("Invalid stable project ID")
    if item["category"] not in CATEGORIES or item["review"] not in STATUS:
        raise ValueError("Invalid category or review status")
    for key in ("source_url", "paper_url", "github_url", "huggingface_url"):
        if item.get(key) and not valid_url(item[key]):
            raise ValueError(f"{key} must be HTTPS")
    for key in ("published_at", "first_seen_at", "updated_at", "reviewed_at", "significant_update_at"):
        if item.get(key):
            parse_dt(item[key])
    for key in ("weights_open", "training_code_open", "data_open", "lora", "qlora"):
        if item.get(key) is not None and not isinstance(item[key], bool):
            raise ValueError(f"{key} must be true, false or null")
    if item["review"] == "approved":
        if not item.get("reviewed_by") or not item.get("reviewed_at"):
            raise ValueError("Approval requires reviewer and review timestamp")
        if not item.get("evidence_urls") or not all(valid_url(x) for x in item["evidence_urls"]):
            raise ValueError("Approval requires source evidence URLs")
        for field in ("innovation", "research_opportunity"):
            if not str(item.get(field) or "").strip():
                raise ValueError(f"Approved project missing {field}")
        dimensions = item.get("score_dimensions")
        if not isinstance(dimensions, dict):
            raise ValueError("Approval requires explicit score_dimensions")
        expected = score(dimensions)
        if item.get("score") != expected:
            raise ValueError(f"Score mismatch: expected {expected}")
    return item

def score(dimensions):
    if (not isinstance(dimensions, dict) or set(dimensions) != set(WEIGHTS)
        or any(isinstance(v, bool) or not isinstance(v, (float, int)) or not 0 <= v <= 10
               for v in dimensions.values())):
        raise ValueError("Six independently evaluated 0-10 scores required")
    return round(sum(dimensions[k] * weight for k, weight in WEIGHTS.items()), 2)

def normalize_title(title):
    """High-confidence exact title key only; not semantic similarity."""
    return re.sub(r"[^a-z0-9\u4e00-\u9fff]", "", str(title).lower())

def upsert(items, incoming):
    """Preserve the first discovery time and never demote approved reviews."""
    by_id = {item["id"]: dict(item) for item in items}
    for item in incoming:
        verify(item)
        old = by_id.get(item["id"])
        if old and old.get("review") == "approved" and item["review"] != "approved":
            continue
        new = {**(old or {}), **item}
        if old:
            new["first_seen_at"] = min(old["first_seen_at"], item["first_seen_at"], key=parse_dt)
            new["published_at"] = min(old["published_at"], item["published_at"], key=parse_dt)
            if old.get("updated_at") and item.get("updated_at"):
                new["updated_at"] = max(old["updated_at"], item["updated_at"], key=parse_dt)
            new["evidence_urls"] = sorted(set(old.get("evidence_urls", []) + item.get("evidence_urls", [])))
            new["related_urls"] = sorted(set(old.get("related_urls", []) + item.get("related_urls", [])))
        verify(new)
        by_id[item["id"]] = new
    return sorted(by_id.values(), key=lambda x: (x.get("updated_at") or x["published_at"], x["id"]), reverse=True)

def merge_candidates(previous, incoming, max_records=2500):
    """Merge identical paper titles from arXiv/OpenReview, preserving both links.

    GitHub/HF repo names are not assumed equivalent to paper titles.
    """
    combined = upsert(previous, incoming)
    merged, by_title = [], {}
    for item in combined:
        source = item.get("discovered_from")
        key = normalize_title(item["title"]) if source in ("arxiv", "openreview") else ""
        if len(key) >= 20 and key in by_title:
            prior = by_title[key]
            prior["related_urls"] = sorted(set(
                prior.get("related_urls", []) + [item["source_url"]] + item.get("related_urls", [])
            ))
            prior["first_seen_at"] = min(prior["first_seen_at"], item["first_seen_at"], key=parse_dt)
            prior["published_at"] = min(prior["published_at"], item["published_at"], key=parse_dt)
            if item.get("paper_url") and "arxiv.org" in item["paper_url"]:
                prior["paper_url"] = item["paper_url"]
            continue
        if key:
            by_title[key] = item
        merged.append(item)
    return merged[:max_records]

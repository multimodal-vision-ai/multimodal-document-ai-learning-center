"""Research Radar data validation, scoring, and persistence (stdlib only)."""
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "research-radar" / "data"
CATEGORIES = {"document", "video", "small-vlm", "agent"}
WEIGHTS = {"innovation": .20, "openness": .20, "compute": .15, "reproducibility": .15, "extension": .20, "commercialization": .10}

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
    u = urlparse(value)
    return u.scheme == "https" and bool(u.hostname)

def verify(item):
    if not isinstance(item, dict): raise ValueError("Project must be a JSON object")
    for key in ("id", "title", "source_url", "published_at", "first_seen_at", "category", "review"):
        if not str(item.get(key) or "").strip(): raise ValueError(f"Missing {key}")
    if item["category"] not in CATEGORIES: raise ValueError("Unknown category")
    if item["review"] not in ("pending", "approved", "rejected"): raise ValueError("Unknown review status")
    if not valid_url(item["source_url"]): raise ValueError("Source must use HTTPS")
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{2,100}", item["id"]): raise ValueError("Invalid stable ID")
    for key in ("paper_url", "github_url", "huggingface_url"):
        if item.get(key) and not valid_url(item[key]): raise ValueError(f"Invalid {key}")
    if item["review"] == "approved":
        if not item.get("evidence_urls") or not all(valid_url(u) for u in item["evidence_urls"]):
            raise ValueError("Approved projects require evidence URLs")
        for key in ("innovation", "research_opportunity"):
            if not str(item.get(key) or "").strip(): raise ValueError(f"Approved project missing {key}")
    for key in ("weights_open", "training_code_open", "data_open", "lora", "qlora"):
        if item.get(key) is not None and not isinstance(item[key], bool):
            raise ValueError(f"{key} must be true/false/null")
    return item

def score(values):
    if set(values) != set(WEIGHTS) or any(not isinstance(v, (int, float)) or isinstance(v, bool) or not 0 <= v <= 10 for v in values.values()):
        raise ValueError("Expected six 0-10 dimension scores")
    return round(sum(values[k] * weight for k, weight in WEIGHTS.items()), 2)

def upsert(items, incoming):
    by_id = {x["id"]: x for x in items}
    for item in incoming:
        verify(item)
        existing = by_id.get(item["id"])
        if existing and existing.get("review") == "approved" and item["review"] != "approved":
            continue
        by_id[item["id"]] = {**(existing or {}), **item}
    return sorted(by_id.values(), key=lambda x: (x.get("published_at",""), x["id"]), reverse=True)

def iso_now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")

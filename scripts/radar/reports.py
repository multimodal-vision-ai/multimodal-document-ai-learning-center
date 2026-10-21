"""Create dated summaries from manually approved and scored research records.

These are source-linked structured summaries, not LLM-written peer-reviewed research reports.
"""
from datetime import datetime, timedelta, timezone
from core import DATA, load, parse_dt, save, verify

def event_time(item):
    candidates = [parse_dt(item["published_at"]), parse_dt(item["reviewed_at"])]
    if item.get("significant_update_at"):
        candidates.append(parse_dt(item["significant_update_at"]))
    return max(candidates)

def select(projects, since, until, limit, threshold=0):
    results = []
    for item in projects:
        verify(item)
        if item["review"] != "approved":
            continue
        when = event_time(item)
        if since <= when <= until and item["score"] >= threshold:
            results.append(item)
    return sorted(results, key=lambda x: (-x["score"], -event_time(x).timestamp(), x["id"]))[:limit]

def build(projects, now=None):
    now = now or datetime.now(timezone.utc)
    if now.tzinfo is None:
        now = now.replace(tzinfo=timezone.utc)
    iso = now.isocalendar()
    intervals = {
        "daily": (now - timedelta(hours=24), 3, 8.5),
        "weekly": (now - timedelta(days=7), 10, 0),
        "monthly": (now - timedelta(days=30), 10, 0),
    }
    out = {}
    for name, (start, cap, threshold) in intervals.items():
        picked = select(projects, start, now, cap, threshold)
        out[name] = {
            "period": name,
            "window_start": start.isoformat(timespec="seconds"),
            "window_end": now.isoformat(timespec="seconds"),
            "projects": [
                {key: p.get(key) for key in (
                    "id", "title", "category", "score", "published_at", "reviewed_at",
                    "significant_update_at", "paper_url", "source_url", "parameters",
                    "innovation", "research_opportunity"
                )} for p in picked
            ],
            "research_topics": [
                {"project_id": p["id"], "title": p["title"],
                 "opportunity": p.get("research_opportunity", "")}
                for p in picked[:3]
            ] if name == "monthly" else [],
            "empty": not bool(picked),
        }
    return out

def snapshot():
    projects = load(DATA / "projects.json", [])
    now = datetime.now(timezone.utc)
    reports = build(projects, now)
    stamp = now.strftime("%Y-%m-%d")
    iso = now.isocalendar()
    paths = {
        "daily": DATA / "daily" / (stamp + ".json"),
        "weekly": DATA / "weekly" / (f"{iso.year}-W{iso.week:02}.json"),
        "monthly": DATA / "monthly" / (now.strftime("%Y-%m") + ".json"),
    }
    for name, path in paths.items():
        save(path, reports[name])
        print(f"Saved {name}: {len(reports[name]['projects'])} verified entries")
    return reports

if __name__ == "__main__":
    snapshot()

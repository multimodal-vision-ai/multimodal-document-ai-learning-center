"""Public-source candidate discovery. No automatic acceptance or scientific claims.

Sources: arXiv Atom, GitHub public repository search, Hugging Face Hub, OpenReview
public API2 search, and explicitly configured official Atom/RSS feeds.
"""
import hashlib
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import xml.etree.ElementTree as ET
from core import DATA, ROOT, iso_now, load, save, merge_candidates, parse_dt, valid_url

CONFIG = load(ROOT / "research-radar/config/sources.json", {})
UA = "MultimodalVisionResearchRadar/1.1 (GitHub: multimodal-vision-ai/multimodal-document-ai-learning-center)"
WINDOW = timedelta(days=8)

def fetch(url, headers=None):
    request = Request(url, headers={
        "User-Agent": UA, "Accept": "application/json", **(headers or {})
    })
    with urlopen(request, timeout=25) as response:
        return response.read()

def recent(created, updated=None):
    dates = []
    for value in (created, updated):
        try:
            if value:
                dates.append(parse_dt(value))
        except (ValueError, TypeError):
            pass
    return bool(dates) and max(dates) >= datetime.now(timezone.utc) - WINDOW

def cat(title):
    text = title.lower()
    if any(s in text for s in ("video", "temporal", "streaming", "frame", "videolm")):
        return "video"
    if any(s in text for s in ("document", "ocr", "pdf", "layout", "table", "chart")):
        return "document"
    if any(s in text for s in ("agent", "decision", "reinforcement", "grpo")):
        return "agent"
    return "small-vlm"

def candidate(uid, title, url, published, provider, **extra):
    return {
        "id": uid, "title": " ".join(title.split())[:300], "source_url": url,
        "published_at": published, "first_seen_at": iso_now(),
        "category": cat(title), "review": "pending",
        "discovered_from": provider, **extra
    }

def arxiv():
    config = CONFIG.get("arxiv", {})
    if not config.get("enabled"):
        return []
    params = urlencode({
        "search_query": config.get("query", 'all:"vision language model"'),
        "start": 0, "max_results": min(int(config.get("max_results", 50)), 100),
        "sortBy": "lastUpdatedDate", "sortOrder": "descending"
    })
    root = ET.fromstring(fetch("https://export.arxiv.org/api/query?" + params,
                               {"Accept": "application/atom+xml"}))
    ns = {"a": "http://www.w3.org/2005/Atom"}
    results = []
    for entry in root.findall("a:entry", ns):
        url = entry.findtext("a:id", "", ns).replace("http://", "https://")
        published = entry.findtext("a:published", "", ns)
        updated = entry.findtext("a:updated", published, ns)
        title = entry.findtext("a:title", "", ns)
        if not valid_url(url) or not title or not recent(published, updated):
            continue
        ident = url.rstrip("/").split("/")[-1].split("v")[0]
        results.append(candidate("arxiv-" + ident.replace(".", "-"), title, url,
                                 published, "arxiv", paper_url=url, updated_at=updated))
    return results

def github():
    config = CONFIG.get("github", {})
    if not config.get("enabled"):
        return []
    headers = {"Accept": "application/vnd.github+json"}
    if os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = "Bearer " + os.environ["GITHUB_TOKEN"]
    items = []
    since = (datetime.now(timezone.utc) - WINDOW).strftime("%Y-%m-%d")
    for query in config.get("queries", [])[:5]:
        params = urlencode({
            "q": query + " in:name,description pushed:>=" + since,
            "sort": "updated", "order": "desc",
            "per_page": min(int(config.get("per_page", 20)), 50)
        })
        payload = json.loads(fetch("https://api.github.com/search/repositories?" + params, headers))
        for record in payload.get("items", []):
            url, title = record.get("html_url"), record.get("full_name")
            created, modified = record.get("created_at"), record.get("pushed_at")
            if not title or not valid_url(url) or not created or not recent(created, modified):
                continue
            items.append(candidate("github-" + str(record["id"]), title, url, created,
                                   "github", github_url=url, updated_at=modified))
    return items

def huggingface():
    config = CONFIG.get("huggingface", {})
    if not config.get("enabled"):
        return []
    found = []
    for search in config.get("queries", [])[:5]:
        params = urlencode({
            "search": search, "limit": min(int(config.get("limit", 20)), 50),
            "sort": "lastModified", "direction": -1
        })
        response = json.loads(fetch("https://huggingface.co/api/models?" + params))
        for record in response:
            name = record.get("id")
            created = record.get("createdAt") or record.get("lastModified")
            modified = record.get("lastModified") or created
            if not name or not created or not recent(created, modified):
                continue
            url = "https://huggingface.co/" + name
            key = hashlib.sha256(name.lower().encode()).hexdigest()[:20]
            found.append(candidate("hf-" + key, name, url, created, "huggingface",
                                   huggingface_url=url, updated_at=modified))
    return found

def openreview():
    """Public API2 search; failures are isolated from other sources."""
    config = CONFIG.get("openreview", {})
    if not config.get("enabled"):
        return []
    found = []
    for term in config.get("queries", [])[:5]:
        params = urlencode({
            "term": term, "content": "title", "source": "forum",
            "limit": min(int(config.get("limit", 25)), 50),
            "sort": "tmdate:desc"
        })
        response = json.loads(fetch("https://api2.openreview.net/notes/search?" + params))
        for note in response.get("notes", []):
            content = note.get("content") or {}
            title = content.get("title", "")
            if isinstance(title, dict):
                title = title.get("value", "")
            if not isinstance(title, str) or not title.strip():
                continue
            note_id = note.get("id")
            created_ms = note.get("tcdate") or note.get("cdate")
            updated_ms = note.get("tmdate") or note.get("mdate") or created_ms
            if not note_id or not created_ms:
                continue
            created = datetime.fromtimestamp(created_ms / 1000, timezone.utc).isoformat()
            modified = datetime.fromtimestamp(updated_ms / 1000, timezone.utc).isoformat()
            if not recent(created, modified):
                continue
            url = "https://openreview.net/forum?id=" + str(note_id)
            key = hashlib.sha256(str(note_id).encode()).hexdigest()[:20]
            found.append(candidate("openreview-" + key, title, url, created, "openreview",
                                   paper_url=url, updated_at=modified))
    return found

def official_feeds():
    """Only approved feed URLs entered into config; RSS/Atom are not crawled blindly."""
    feeds = CONFIG.get("institution_feeds", [])
    found, errors = [], []
    ns = {"a": "http://www.w3.org/2005/Atom"}
    for feed in feeds[:15]:
        name, url = feed.get("name", ""), feed.get("url", "")
        if not name or not valid_url(url):
            errors.append(f"invalid configured official feed: {name}")
            continue
        try:
            root = ET.fromstring(fetch(url, {"Accept": "application/atom+xml,application/rss+xml"}))
            is_atom = root.tag.endswith("feed")
            entries = root.findall("a:entry", ns) if is_atom else root.findall("./channel/item")
            for entry in entries[:50]:
                if is_atom:
                    title = entry.findtext("a:title", "", ns)
                    published = entry.findtext("a:published", "", ns) or entry.findtext("a:updated", "", ns)
                    updated = entry.findtext("a:updated", published, ns)
                    links = entry.findall("a:link", ns)
                    link = next((x.attrib.get("href") for x in links if x.attrib.get("rel", "alternate") == "alternate"), "")
                else:
                    title = entry.findtext("title", "")
                    link = entry.findtext("link", "")
                    published = entry.findtext("pubDate", "")
                    updated = published
                try:
                    from email.utils import parsedate_to_datetime
                    if published and not is_atom:
                        published = parsedate_to_datetime(published).astimezone(timezone.utc).isoformat()
                        updated = published
                except (ValueError, TypeError):
                    continue
                if not title or not valid_url(link) or not recent(published, updated):
                    continue
                key = hashlib.sha256(link.encode()).hexdigest()[:20]
                found.append(candidate("feed-" + key, title, link, published, "institution",
                                       organization=name, updated_at=updated))
        except (OSError, ET.ParseError, HTTPError, URLError, ValueError) as exc:
            errors.append(f"{name}: {type(exc).__name__}: {exc}")
    if errors:
        for error in errors:
            print("WARNING feed " + error, file=sys.stderr)
    return found

def main():
    previous = load(DATA / "candidates.json", [])
    findings, failed, success, counts = [], [], 0, {}
    providers = [
        ("arxiv", arxiv, CONFIG.get("arxiv", {}).get("enabled", False)),
        ("github", github, CONFIG.get("github", {}).get("enabled", False)),
        ("huggingface", huggingface, CONFIG.get("huggingface", {}).get("enabled", False)),
        ("openreview", openreview, CONFIG.get("openreview", {}).get("enabled", False)),
        ("official-feeds", official_feeds, bool(CONFIG.get("institution_feeds")))
    ]
    for name, fn, enabled in providers:
        if not enabled:
            continue
        try:
            items = fn()
            findings.extend(items)
            success += 1
            counts[name] = len(items)
            print(f"{name}: {len(items)} leads")
        except Exception as exc:
            failed.append(f"{name}: {type(exc).__name__}: {exc}")
    if not success:
        print("ERROR: no enabled discovery sources succeeded; old database preserved", file=sys.stderr)
        for message in failed:
            print(message, file=sys.stderr)
        return 1
    merged = merge_candidates(previous, findings)
    save(DATA / "candidates.json", merged)
    save(DATA / "collection-status.json", {
        "last_successful_run_utc": iso_now(),
        "source_counts": counts,
        "source_failures": failed,
        "candidate_records": len(merged),
        "current_run_discovered": len(findings),
        "review_policy": "all automated leads pending"
    })
    for message in failed:
        print("WARNING " + message, file=sys.stderr)
    print(f"Updated candidate index: {len(merged)} records; {len(findings)} observed leads. No automatic approvals.")
    return 0

if __name__ == "__main__":
    sys.exit(main())

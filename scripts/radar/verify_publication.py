"""Verify rendered DEV HTML against the current validated second-stage recommendation."""
import argparse
import html
import re
import sys
from pathlib import Path

from core import DATA, load
from publication_gate import snapshot_digest, validate_snapshot, LEGACY_NOTE
from top3 import load_top3_state, top3_digest

HOME_MARKERS = ("从当前主线走向未来", "进入前沿动态")
DETAIL_MARKERS = ("前沿动态", "重点推荐", "本月研究机会", "历史科研档案", "待复核研究线索")


def verify(home_path, detail_path, data_dir=DATA):
    errors = []
    home = Path(home_path).read_text(encoding="utf-8")
    detail = Path(detail_path).read_text(encoding="utf-8")
    for label, body, markers in (("homepage", home, HOME_MARKERS), ("research updates", detail, DETAIL_MARKERS)):
        for marker in markers:
            if marker not in body:
                errors.append(f"{label} is missing current navigation marker or section: {marker}")

    queue = load(Path(data_dir) / "screening-queue.json", {})
    reports = {
        kind: load(Path(data_dir) / "chatgpt-reviewed" / f"latest-{kind}.json", {})
        for kind in ("screened", "daily", "weekly", "monthly")
    }
    try:
        states = validate_snapshot(reports, queue)
        top3_state = load_top3_state(data_dir)
    except ValueError as exc:
        errors.append("invalid current report or Top 3 state: " + str(exc))
        return errors, 0
    if top3_state is None:
        errors.append("persistent Top 3 state is missing")
        top3_items = []
    else:
        top3_items = top3_state["items"]
    if re.search(r"<h[23][^>]*>\s*本周精选\s*</h[23]>", detail):
        errors.append("obsolete duplicate weekly recommendation section is still published")
    if detail.count('class="radar-review-card"') > 3:
        errors.append("current recommendations exceed the three-item display cap")
    if "radar-archive-pagination" not in detail:
        errors.append("archive pagination control is missing")
    if f'data-radar-snapshot="{snapshot_digest(reports, queue)}"' not in detail:
        errors.append("rendered research updates do not match the report/queue snapshot")
    if top3_state is not None and f'data-radar-top3-snapshot="{top3_digest(top3_state)}"' not in detail:
        errors.append("rendered Top 3 does not match the persistent Top 3 state")
    def section(marker):
        start, end = f"<!-- RADAR:{marker}-START -->", f"<!-- RADAR:{marker}-END -->"
        return detail.split(start, 1)[1].split(end, 1)[0] if start in detail and end in detail else ""

    recommendation_section = section("STAGE_TWO")
    rendered_count = recommendation_section.count('class="radar-review-card"')
    if rendered_count != len(top3_items):
        errors.append("rendered recommendation count does not match persistent Top 3")
    if top3_items:
        for item in top3_items:
            title = html.escape(str(item.get("title") or ""), quote=True)
            if not title or title not in recommendation_section:
                errors.append("persistent Top 3 item is absent from the recommendation section")
    elif "目前尚无重点推荐项目" not in recommendation_section:
        errors.append("explicit empty Top 3 placeholder is missing")
    for kind, marker in (("monthly", "CHATGPT_MONTHLY"),):
        state, items = states[kind]
        body = section(marker)
        if state == "legacy" and LEGACY_NOTE not in body:
            errors.append(f"{kind} legacy content lacks explicit four-dimension warning")
        if state == "validated":
            for item in items[:3]:
                if html.escape(str(item["title"]), quote=True) not in body:
                    errors.append(f"{kind} validated item not rendered in its current section")
    return errors, len(top3_items)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, default=DATA)
    parser.add_argument("--site-dir", type=Path)
    parser.add_argument("--home-html", type=Path)
    parser.add_argument("--detail-html", type=Path)
    args = parser.parse_args()
    if args.site_dir:
        home_path = args.site_dir / "index.html"
        detail_path = args.site_dir / "radar" / "index.html"
    else:
        home_path, detail_path = args.home_html, args.detail_html
    if not home_path or not detail_path or not home_path.exists() or not detail_path.exists():
        print("Homepage and research-radar detail HTML files are required.", file=sys.stderr)
        return 2
    errors, count = verify(home_path, detail_path, args.data_dir)
    if errors:
        print("DEV publication smoke test failed:", file=sys.stderr)
        for error in errors:
            print(" - " + error, file=sys.stderr)
        return 1
    print(f"DEV publication smoke test passed: {count} validated ChatGPT recommendation(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

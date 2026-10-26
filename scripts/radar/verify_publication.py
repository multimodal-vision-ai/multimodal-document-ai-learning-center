"""Verify rendered DEV HTML against the current validated second-stage recommendation."""
import argparse
import html
import sys
from pathlib import Path

from core import DATA, load
from screening import collect_screened
from publication_gate import snapshot_digest, validate_snapshot, LEGACY_NOTE

HOME_MARKERS = ("从当前主线走向未来", "进入前沿动态")
DETAIL_MARKERS = ("前沿动态", "本期重点推荐", "本月研究机会", "历史科研档案", "待复核研究线索")


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
    except ValueError as exc:
        errors.append("invalid current report: " + str(exc))
        return errors, 0
    selected, _ = collect_screened({"weekly": reports.get("weekly", {})}, queue)
    if "## 本周精选" in detail or "RADAR:CHATGPT_WEEKLY-START" in detail:
        errors.append("obsolete duplicate weekly recommendation section is still published")
    if detail.count('class="radar-review-card"') > 3:
        errors.append("current recommendations exceed the three-item display cap")
    if "radar-archive-pagination" not in detail:
        errors.append("archive pagination control is missing")
    if f'data-radar-snapshot="{snapshot_digest(reports, queue)}"' not in detail:
        errors.append("rendered research updates do not match the report/queue snapshot")
    def section(marker):
        start, end = f"<!-- RADAR:{marker}-START -->", f"<!-- RADAR:{marker}-END -->"
        return detail.split(start, 1)[1].split(end, 1)[0] if start in detail and end in detail else ""

    recommendation_section = section("STAGE_TWO")
    if selected:
        for item in selected[:3]:
            title = html.escape(str(item.get("title") or ""), quote=True)
            if not title or title not in recommendation_section:
                errors.append("validated recommendation is absent from the current recommendation section")
    else:
        placeholders = (
            "本期暂无通过四维科研评价的推荐项目",
        )
        if not any(marker in recommendation_section for marker in placeholders):
            errors.append("explicit no-recommendation placeholder is missing")
    for kind, marker in (("monthly", "CHATGPT_MONTHLY"),):
        state, items = states[kind]
        body = section(marker)
        if state == "legacy" and LEGACY_NOTE not in body:
            errors.append(f"{kind} legacy content lacks explicit four-dimension warning")
        if state == "validated":
            for item in items[:3]:
                if html.escape(str(item["title"]), quote=True) not in body:
                    errors.append(f"{kind} validated item not rendered in its current section")
    return errors, len(selected)


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

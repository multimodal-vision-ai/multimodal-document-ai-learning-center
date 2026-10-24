"""Verify the current Frontier Updates publication layout and reviewed report content."""
import argparse
import html
import sys
from pathlib import Path

from core import DATA, load
from publication_gate import validate_snapshot


def verify(home_path, detail_path, data_dir=DATA):
    errors = []
    home = Path(home_path).read_text(encoding="utf-8")
    detail = Path(detail_path).read_text(encoding="utf-8")

    for marker in ("从当前主线走向未来", "进入前沿动态"):
        if marker not in home:
            errors.append(f"homepage is missing current navigation marker: {marker}")
    for marker in ("前沿动态", "重点推荐", "本周精选",
                   "历史档案检索", "补充发现：待评估线索"):
        if marker not in detail:
            errors.append(f"Frontier Updates page is missing current section: {marker}")

    base = Path(data_dir)
    queue = load(base / "screening-queue.json", {})
    reports = {
        kind: load(base / "chatgpt-reviewed" / f"latest-{kind}.json", {})
        for kind in ("screened", "daily", "weekly", "monthly")
    }
    try:
        states = validate_snapshot(reports, queue)
    except ValueError as exc:
        errors.append("invalid current report: " + str(exc))
        return errors, 0

    screened_items = states["screened"][1]
    if screened_items:
        first_title = html.escape(str(screened_items[0].get("title") or ""), quote=True)
        if not first_title or first_title not in detail:
            errors.append("validated recommendation missing from current featured section")
    else:
        if not any(x in detail for x in (
            "当前没有项目同时达到推荐标准", "推荐内容暂不可展示"
        )):
            errors.append("no-recommendation state is not visible")

    for kind, marker in (("weekly", "本周精选"), ("monthly", "本月研究机会")):
        state, items = states[kind]
        if state == "legacy":
            if "尚未按当前四维标准复评" not in detail:
                errors.append(f"{kind} legacy content lacks explicit four-dimension warning")
            # Never allow the old report's names as unqualified current recommendations.
        elif state == "validated" and items:
            for item in items:
                title = html.escape(str(item.get("title") or ""), quote=True)
                if title and title not in detail:
                    errors.append(f"{kind} validated item not rendered: {title}")
        if marker not in detail:
            errors.append(f"{kind} section missing")

    return errors, len(screened_items)


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
        print("Homepage and Frontier Updates HTML files are required.", file=sys.stderr)
        return 2
    errors, count = verify(home_path, detail_path, args.data_dir)
    if errors:
        print("Frontier Updates publication validation failed:", file=sys.stderr)
        for error in errors:
            print(" - " + error, file=sys.stderr)
        return 1
    print(f"Publication validation passed: {count} strictly validated recommendation(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

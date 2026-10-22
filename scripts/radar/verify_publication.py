"""Verify rendered DEV HTML against the current validated second-stage recommendation."""
import argparse
import html
import sys
from pathlib import Path

from core import DATA, load
from screening import collect_screened


def verify(home_path, detail_path, data_dir=DATA):
    errors = []
    home = Path(home_path).read_text(encoding="utf-8")
    detail = Path(detail_path).read_text(encoding="utf-8")
    if "ChatGPT 科研价值精选" not in home:
        errors.append("homepage is missing the second-stage scientific-curation section")
    if "周期任务运行验收" not in home:
        errors.append("homepage is missing the periodic-task monitor")
    if "ChatGPT 科研价值精选" not in detail:
        errors.append("research-radar detail page is missing the second-stage section")

    queue = load(Path(data_dir) / "screening-queue.json", {})
    reports = {
        kind: load(Path(data_dir) / "chatgpt-reviewed" / f"latest-{kind}.json", {})
        for kind in ("screened", "daily", "weekly", "monthly")
    }
    selected, validation_errors = collect_screened(reports, queue)
    if validation_errors:
        errors.extend("invalid report: " + error for error in validation_errors)
    if selected:
        title = html.escape(str(selected[0].get("title") or ""), quote=True)
        if not title or (title not in home and title not in detail):
            errors.append("highest-ranked validated ChatGPT recommendation is absent from rendered pages")
    else:
        placeholders = (
            "尚无通过四维科研价值核验的第二轮推荐",
            "目前没有符合四维科研价值评分标准的 ChatGPT 二次评价结果",
        )
        if not any(marker in home or marker in detail for marker in placeholders):
            errors.append("explicit no-recommendation placeholder is missing")
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

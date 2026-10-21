"""Render three MkDocs pages and homepage without touching course materials."""
import html
import re
from datetime import datetime, timezone
from pathlib import Path
from core import DATA, ROOT, load, valid_url
from reports import build

DOCS = ROOT / "docs"

def escape(value):
    return html.escape("未核实" if value is None or value == "" else str(value), quote=True)

def link(url, label):
    return (f'<a href="{escape(url)}" target="_blank" rel="noopener noreferrer">'
            f'{escape(label)}</a>') if valid_url(url) else escape(label)

def replace(text, marker, body):
    pattern = r"(<!-- RADAR:" + marker + r"-START -->).*?(<!-- RADAR:" + marker + r"-END -->)"
    replaced, n = re.subn(pattern, lambda match:
                         match.group(1) + "\n" + body + "\n" + match.group(2),
                         text, flags=re.S)
    if n != 1:
        raise ValueError(f"Expected exactly one {marker} marker pair")
    return replaced

def save_page(relative, text):
    target = DOCS / relative
    if target.read_text(encoding="utf-8-sig") != text:
        target.write_text(text, encoding="utf-8")

def params_min(text):
    match = re.search(r"(\d+(?:\.\d+)?)\s*[Bb]\b", str(text or ""))
    return float(match.group(1)) if match else None

def research_listing(items, empty):
    if not items:
        return empty
    lines = []
    for item in items:
        url = item.get("paper_url") or item["source_url"]
        when = escape(str(item["published_at"])[:10])
        score = escape(item["score"])
        topic = escape(item.get("research_opportunity", ""))
        lines.append(
            f"- **{link(url, item['title'])}** — {when}，评分 {score}/10；"
            f"{escape(item.get('parameters'))}；{escape(item.get('category'))}\n"
            f"    - 创新：{escape(item.get('innovation'))}\n"
            f"    - 后续研究：{topic}"
        )
    return "\n\n".join(lines)

def indent(text):
    return "\n".join("    " + row if row else "" for row in text.splitlines())

def select_candidate_leads(items):
    """Show a small, source-balanced *unreviewed* sample, not a quality ranking.

    Papers get more space than model uploads and GitHub repositories. All
    raw leads remain in candidates.json for independent human inspection.
    """
    caps = (("arxiv", 5), ("openreview", 6), ("institution", 2),
            ("huggingface", 2), ("github", 2))
    result = []
    for provider, count in caps:
        group = [
            item for item in items
            if item.get("review") == "pending"
            and item.get("discovered_from") == provider
            and valid_url(item.get("source_url"))
        ]
        group.sort(key=lambda item: (
            item.get("updated_at") or item.get("published_at") or "",
            item.get("id", "")
        ), reverse=True)
        result.extend(group[:count])
    return result[:15]


def render(now=None):
    now = now or datetime.now(timezone.utc)
    projects = load(DATA / "projects.json", [])
    reports = build(projects, now)
    approved = sorted((p for p in projects if p.get("review") == "approved"),
                      key=lambda p: (p.get("score") or 0, p.get("reviewed_at") or ""), reverse=True)
    tasks = load(DATA / "tasks.json", [])
    candidates = load(DATA / "candidates.json", [])
    collection_status = load(DATA / "collection-status.json", {})
    rows = []
    for p in approved:
        paper = p.get("paper_url") or p["source_url"]
        links = " · ".join(link(p.get(k), label) for k, label in
                           (("paper_url", "论文"), ("github_url", "GitHub"), ("huggingface_url", "HF"))
                           if p.get(k)) or link(paper, "原始来源")
        minimum = params_min(p.get("parameters"))
        size = f'{minimum:g}' if minimum is not None else ""
        tier = escape(p.get("gpu_tier") or "")
        rows.append(
            f'<tr data-category="{escape(p["category"])}" data-size="{size}" data-gpu="{tier}">'
            f'<td><strong>{escape(p["title"])}</strong><br><small>{escape(p.get("organization"))}</small>'
            f'<details><summary>研究详情</summary><p>{escape(p.get("innovation"))}</p>'
            f'<p>后续研究：{escape(p.get("research_opportunity"))}</p></details></td>'
            f'<td>{escape(p["category"])}</td><td>{escape(p.get("parameters"))}</td>'
            f'<td>{escape(p.get("gpu"))}</td><td>{escape(p.get("score"))}</td>'
            f'<td>{links}</td></tr>'
        )
    if rows:
        project_html = (
            f'<p id="radar-filter-count">{len(rows)} 条记录</p>'
            '<div class="radar-table-wrap"><table id="radar-project-table">'
            '<thead><tr><th>项目</th><th>领域</th><th>规模</th><th>GPU</th><th>评分</th><th>链接</th></tr></thead>'
            '<tbody>' + "".join(rows) + '</tbody></table></div>'
        )
    else:
        project_html = "**暂无通过人工审核的科研项目。**"
    page = DOCS / "radar/projects.md"
    save_page("radar/projects.md", replace(page.read_text(encoding="utf-8"), "PROJECTS", project_html))

    page = DOCS / "radar/index.md"
    content = page.read_text(encoding="utf-8")
    blocks = {
        "DAILY": research_listing(reports["daily"]["projects"], "最近24小时暂无达到预警门槛的已审核项目。"),
        "WEEKLY": research_listing(reports["weekly"]["projects"], "最近7天暂无已审核的重点进展。"),
        "MONTHLY": research_listing(reports["monthly"]["projects"], "最近30天暂无已审核的研究机会。"),
    }
    for marker, body in blocks.items():
        content = replace(content, marker, indent(body))
    leads = []
    for item in select_candidate_leads(candidates):
        title = escape(item.get("title", "Untitled"))
        provider = escape(item.get("discovered_from", "source"))
        date = escape(str(item.get("updated_at") or item.get("published_at") or "")[:10])
        leads.append(f"- {link(item['source_url'], title)} — {provider} · {date}（未经审核）")
        if len(leads) >= 15:
            break
    run_time = escape(collection_status.get("last_successful_run_utc", "尚未运行"))
    failures = len(collection_status.get("source_failures", []))
    sources = len(collection_status.get("source_counts", {}))
    status_line = (f"**最近一次公开源采集（UTC）：{run_time}**；"
                   f"成功来源 {sources}；异常来源 {failures}；"
                   f"数据库候选总数 {len(candidates)}。"
                   " 下方按来源限额展示部分线索，非质量排名。")
    content = replace(content, "CANDIDATES", status_line + "\n\n" +
                      ("\n".join(leads) if leads else "暂无自动采集到的公开线索。"))
    save_page("radar/index.md", content)

    page = DOCS / "radar/tasks.md"
    items = [
        f'- {link(p.get("url"), p.get("title", "Issue"))} — {escape(p.get("state", "open"))}'
        for p in tasks if isinstance(p, dict) and valid_url(p.get("url"))
    ]
    content = replace(page.read_text(encoding="utf-8"), "TASKS",
                      "\n".join(items) or "暂无研究任务快照。请通过上方 GitHub Issues 入口查看。")
    save_page("radar/tasks.md", content)

    home = DOCS / "index.md"
    content = home.read_text(encoding="utf-8-sig")
    top = "".join(
        "<li>" + link(p.get("paper_url") or p["source_url"], p["title"]) +
        " · " + escape(p.get("parameters")) + "</li>" for p in approved[:3]
    )
    state = ("<p>已审核重点项目：</p><ul>" + top + "</ul>" if top else
             "<p>目前暂无经过人工核实的高价值推荐；候选资料不会自动发布。</p>")
    home_block = f"""## 科研雷达 · Research Radar

<div class="radar-home-card" markdown>
<div class="radar-stats">
<div class="radar-stat"><strong>{len(approved)}</strong> 已审核项目</div>
<div class="radar-stat"><strong>{len(candidates)}</strong> 待审核线索</div>
<div class="radar-stat"><strong>{len(reports["daily"]["projects"])}</strong> 近24小时重点</div>
<div class="radar-stat"><strong>{len(tasks)}</strong> 研究任务</div>
</div>
{state}

[科研动态](radar/index.md) · [科研项目库](radar/projects.md) · [研究任务](radar/tasks.md)

<small>数据时间窗口以UTC为准；预警须经过人工审阅。</small>
</div>"""
    content = replace(content, "", home_block) if False else replace_home(content, home_block)
    save_page("index.md", content)
    print(f"Radar render complete: {len(approved)} approved, {len(tasks)} tasks")

def replace_home(text, body):
    result, n = re.subn(r"<!-- RADAR:START -->.*?<!-- RADAR:END -->",
                        lambda match: "<!-- RADAR:START -->\n" + body + "\n<!-- RADAR:END -->",
                        text, flags=re.S)
    if n != 1:
        raise ValueError("Missing home Radar markers")
    return result

if __name__ == "__main__":
    render()

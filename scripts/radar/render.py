"""Render three MkDocs pages and homepage without touching course materials."""
import html
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from core import DATA, ROOT, load, valid_url, parse_dt
from reports import build
from ranking import rank_candidates, CATEGORY_LABELS, SOURCE_LABELS

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

def select_candidate_leads(items, now=None, limit=15):
    """Return relevant recent candidates, ranked by transparent topic matching."""
    now = now or datetime.now(timezone.utc)
    return rank_candidates(items, now - timedelta(days=7), now, limit=limit, threshold=3.5)


def pretty_time(value):
    if not value:
        return "尚未记录"
    try:
        return parse_dt(value).strftime("%Y-%m-%d %H:%M UTC")
    except (ValueError, TypeError):
        return "时间未核实"


def category_label(value):
    return CATEGORY_LABELS.get(value, "多模态视觉智能")


def source_label(value):
    return SOURCE_LABELS.get(value, value or "未知来源")


def candidate_card(item):
    title = link(item.get("source_url"), item.get("title", "未命名线索"))
    category = escape(category_label(item.get("category")))
    event_label = escape(item.get("event_label", "近期研究线索"))
    event_date = escape(str(item.get("event_at") or "")[:10] or "日期未核实")
    score = escape(item.get("match_score", "—"))
    reasons = "；".join(item.get("match_reasons", [])[:4])
    links = []
    seen = set()
    for key, label in (
        ("source_url", "原始来源"),
        ("paper_url", "论文"),
        ("github_url", "GitHub"),
        ("huggingface_url", "模型仓库"),
    ):
        url = item.get(key)
        if url and url not in seen and valid_url(url):
            seen.add(url)
            links.append(link(url, label))
    link_html = " <span aria-hidden=\"true\">·</span> ".join(links)
    return (
        '<article class="radar-feature-card radar-candidate-card">'
        '<div class="radar-feature-meta">'
        f'<span class="radar-tag">{category}</span>'
        f'<span class="radar-event-label">{event_label}</span>'
        '</div>'
        f'<h4>{title}</h4>'
        f'<p class="radar-feature-reasons">筛选依据：{escape(reasons)}</p>'
        '<div class="radar-feature-footer">'
        f'<span class="radar-match-score">主题匹配度 {score}/10</span>'
        f'<time datetime="{escape(item.get("event_at", ""))}">{event_date}</time>'
        '</div>'
        f'<div class="radar-feature-links">{link_html}</div>'
        '<p class="radar-feature-disclaimer">自动初筛 · 未人工审核；权重、代码可运行性与实验结论未必已核实。</p>'
        '</article>'
    )


def approved_card(item):
    title = link(item.get("paper_url") or item.get("source_url"), item.get("title", "未命名项目"))
    links = []
    for key, label in (("paper_url", "论文"), ("github_url", "GitHub"), ("huggingface_url", "模型仓库")):
        if item.get(key) and valid_url(item[key]) and item[key] not in [x[0] for x in links]:
            links.append((item[key], link(item[key], label)))
    link_html = " <span aria-hidden=\"true\">·</span> ".join(x[1] for x in links)
    return (
        '<article class="radar-feature-card radar-approved-card">'
        '<div class="radar-feature-meta"><span class="radar-tag radar-tag-approved">已核验</span>'
        f'<span class="radar-event-label">{escape(category_label(item.get("category")))}</span></div>'
        f'<h4>{title}</h4>'
        f'<p>{escape(item.get("innovation", ""))}</p>'
        f'<p class="radar-feature-reasons">研究机会：{escape(item.get("research_opportunity", ""))}</p>'
        f'<div class="radar-feature-footer"><span class="radar-match-score">审核评分 {escape(item.get("score", "—"))}/10</span>'
        f'<time datetime="{escape(item.get("reviewed_at", ""))}">审核：{escape(str(item.get("reviewed_at") or "")[:10])}</time></div>'
        f'<div class="radar-feature-links">{link_html}</div>'
        '</article>'
    )


def homepage_block(approved, candidates, tasks, reports, collection_status, now):
    daily = reports.get("daily", {}).get("candidate_summary", {})
    weekly = reports.get("weekly", {}).get("candidate_summary", {})
    weekly_leads = reports.get("weekly", {}).get("candidate_leads", [])[:3]
    approved_top = approved[:3]
    featured_html = "".join(candidate_card(item) for item in weekly_leads)
    if not featured_html:
        featured_html = (
            '<div class="radar-empty-state"><strong>当前没有达到主题相关度门槛的近期线索。</strong>'
            '<p>系统不会为了填满首页而推荐无关项目。可查看完整科研动态与历史记录。</p></div>'
        )
    approved_html = ""
    if approved_top:
        approved_html = (
            '<div class="radar-home-section-heading"><h3>已核验重点项目</h3>'
            '<span>经过研究人员审核的记录</span></div>'
            '<div class="radar-feature-grid radar-approved-grid">'
            + "".join(approved_card(item) for item in approved_top) + '</div>'
        )

    category_counts = weekly.get("category_counts", {})
    trend_cards = []
    for category in ("document", "video", "small-vlm"):
        count = category_counts.get(category, 0)
        sample = next((item for item in weekly_leads if item.get("category") == category), None)
        sample_html = (
            f'<p class="radar-trend-sample">{link(sample["source_url"], sample["title"])}</p>'
            if sample else '<p class="radar-trend-sample radar-muted">暂无达到门槛的代表线索</p>'
        )
        trend_cards.append(
            '<article class="radar-trend-card">'
            f'<span class="radar-trend-count">{count}</span>'
            f'<strong>{escape(category_label(category))}</strong>'
            f'{sample_html}</article>'
        )

    last_run = pretty_time(collection_status.get("last_successful_run_utc"))
    source_counts = collection_status.get("source_counts", {})
    source_text = " · ".join(
        f'{escape(source_label(key))} {escape(value)}'
        for key, value in sorted(source_counts.items())
    ) or "来源统计尚未记录"
    failures = collection_status.get("source_failures", [])
    if failures:
        health_html = (
            f'<div class="radar-home-warning" role="status">本次采集有 {len(failures)} 个来源异常；'
            '首页保留已成功采集的数据，不把失败来源视为零结果。</div>'
        )
    elif collection_status.get("last_successful_run_utc"):
        health_html = '<div class="radar-home-health" role="status">采集状态：最近一次成功运行未报告来源异常</div>'
    else:
        health_html = '<div class="radar-home-warning" role="status">尚未记录成功采集时间；请查看运行日志确认数据新鲜度。</div>'

    stat_html = (
        '<div class="radar-stats">'
        f'<div class="radar-stat"><strong>{len(candidates)}</strong><span>累计候选线索</span></div>'
        f'<div class="radar-stat"><strong>{daily.get("relevant_count", 0)}</strong><span>近24小时相关线索</span></div>'
        f'<div class="radar-stat"><strong>{weekly.get("new_papers_count", 0)}</strong><span>近7天新论文 / 投稿</span></div>'
        f'<div class="radar-stat"><strong>{len(approved)}</strong><span>已审核项目</span></div>'
        '</div>'
    )
    return f"""<section class="radar-home-card" aria-labelledby="radar-home-title">
<div class="radar-home-heading">
<div><p class="radar-kicker">LIVE RESEARCH MONITOR</p>
<h2 id="radar-home-title">科研雷达 · Research Radar</h2>
<p class="radar-home-intro">文档理解、视频理解与多模态小模型的持续追踪。首页自动展示近期相关线索，完整证据与历史报告可继续查阅。</p></div>
<span class="radar-live-pill">自动采集</span>
</div>
<div class="radar-home-meta"><span>最近成功采集：<time>{escape(last_run)}</time></span><span>本次来源命中：{source_text}</span></div>
{health_html}
{stat_html}
{approved_html}
<div class="radar-home-section-heading"><h3>本周自动精选</h3><span>最多展示 3 项 · 依据主题相关度与时间窗口排序</span></div>
<div class="radar-feature-grid">{featured_html}</div>
<div class="radar-home-section-heading"><h3>本周监测线索分布</h3><span>自动分类统计，不代表整个领域的发文量或质量排名</span></div>
<div class="radar-trend-grid">{"".join(trend_cards)}</div>
<div class="radar-home-actions">
<a class="radar-home-action-primary" href="radar/index.html">查看最新动态与日报周报 →</a>
<a href="radar/projects.html">已审核项目库</a>
<a href="radar/tasks.html">研究任务</a>
</div>
<p class="radar-home-footnote">自动初筛的“主题匹配度”是可解释的关键词与来源规则分，不是科研质量评分或专家结论。项目权重、代码、许可证、GPU 需求与复现结果只有在有证据时才会标为已核实。当前数据范围：{escape(str(reports.get("weekly", {}).get("window_start", ""))[:10])} 至 {escape(str(reports.get("weekly", {}).get("window_end", ""))[:10])}（UTC）。研究任务数：{len(tasks)}。</p>
</section>"""


def render(now=None):
    now = now or datetime.now(timezone.utc)
    projects = load(DATA / "projects.json", [])
    tasks = load(DATA / "tasks.json", [])
    candidates = load(DATA / "candidates.json", [])
    collection_status = load(DATA / "collection-status.json", {})
    reports = build(projects, now, candidates)
    approved = sorted((p for p in projects if p.get("review") == "approved"),
                      key=lambda p: (p.get("score") or 0, p.get("reviewed_at") or ""), reverse=True)
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
    for item in select_candidate_leads(candidates, now):
        title = escape(item.get("title", "Untitled"))
        event_label = escape(item.get("event_label", "近期研究线索"))
        date = escape(str(item.get("event_at") or "")[:10])
        reasons = escape("；".join(item.get("match_reasons", [])[:4]))
        match_score = escape(item.get("match_score", "—"))
        leads.append(
            f"- {link(item['source_url'], title)} — {event_label} · {date}；"
            f"主题匹配度 {match_score}/10（规则初筛，未审核）；{reasons}"
        )
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
    home_block = homepage_block(approved, candidates, tasks, reports, collection_status, now)
    content = replace_home(content, home_block)
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

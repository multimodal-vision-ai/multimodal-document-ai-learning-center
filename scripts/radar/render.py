"""Render the consolidated Research Updates page and legacy internal snapshots."""
import hashlib
import html
import json
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from core import DATA, ROOT, load, save, valid_url, parse_dt
from reports import build
from ranking import rank_candidates, CATEGORY_LABELS, SOURCE_LABELS, DISPLAY_MATCH_THRESHOLD
from screening import collect_screened, build_queue

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
    return rank_candidates(items, now - timedelta(days=7), now,
                           limit=limit, threshold=DISPLAY_MATCH_THRESHOLD)


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



def _period_datetime(value):
    if not value:
        return None
    try:
        return parse_dt(str(value))
    except (ValueError, TypeError, OverflowError):
        return None


def week_year_number(value):
    """Return an ISO Monday-start week number constrained to 1..52.

    ISO week 53 is folded into week 52 so the UI never displays a 53rd week.
    """
    dt = _period_datetime(value)
    if dt is None:
        return None
    iso = dt.isocalendar()
    return iso.year, min(52, iso.week)


def weekly_period_label(value):
    period = week_year_number(value)
    return f"{period[0]}年第{period[1]}周" if period else "周次待核实"


def monthly_period_label(value):
    dt = _period_datetime(value)
    return dt.strftime("%Y年%m月") if dt else "月份待核实"


def report_period_label(report_type, report):
    report = report if isinstance(report, dict) else {}
    anchor = report.get("window_start") or report.get("generated_at")
    if report_type == "weekly":
        return weekly_period_label(anchor)
    if report_type == "monthly":
        return monthly_period_label(anchor)
    return str(anchor or "时间待核实")[:10]


def _archive_key(report_type, report):
    anchor = report.get("window_start") or report.get("generated_at")
    dt = _period_datetime(anchor)
    if dt is None:
        return None
    if report_type == "weekly":
        year, week = week_year_number(dt)
        return f"{year}-W{week:02d}"
    if report_type == "monthly":
        return dt.strftime("%Y-%m")
    return None


def archive_latest_reports(reports):
    """Persist completed weekly/monthly ChatGPT reports without overwriting history."""
    archived = 0
    archive_root = DATA / "chatgpt-reviewed" / "archive"
    for kind in ("weekly", "monthly"):
        report = reports.get(kind, {}) if isinstance(reports, dict) else {}
        if not isinstance(report, dict) or report.get("status") not in ("completed", "no_high_value"):
            continue
        if not report.get("generated_at"):
            continue
        key = _archive_key(kind, report)
        if not key:
            continue
        folder = archive_root / kind
        target = folder / f"{key}.json"
        existing = load(target, None)
        if existing == report:
            continue
        if existing is not None:
            canonical = json.dumps(report, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
            digest = hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:10]
            generated = _period_datetime(report.get("generated_at"))
            stamp = generated.strftime("%Y%m%d") if generated else "revision"
            target = folder / f"{key}-{stamp}-{digest}.json"
            if load(target, None) == report:
                continue
        save(target, report)
        archived += 1
    return archived


def _archive_records(report_type):
    folder = DATA / "chatgpt-reviewed" / "archive" / report_type
    records = []
    if not folder.exists():
        return records
    for path in folder.glob("*.json"):
        report = load(path, None)
        if not isinstance(report, dict) or report.get("status") not in ("completed", "no_high_value"):
            continue
        anchor = report.get("window_start") or report.get("generated_at")
        dt = _period_datetime(anchor)
        if report_type == "weekly":
            week_info = week_year_number(anchor)
            year = str(week_info[0]) if week_info else ""
            sort_key = dt.timestamp() if dt else 0
        else:
            year = str(dt.year) if dt else ""
            sort_key = dt.timestamp() if dt else 0
        items = [
            item for item in report.get("items", [])
            if isinstance(item, dict)
            and item.get("selection_status", "selected") in ("selected", "chatgpt_selected", "recommended")
        ]
        search_parts = [report.get("report_title", ""), report.get("summary", "")]
        for item in items:
            for key in ("title", "summary", "why_selected", "research_opportunity", "next_steps"):
                value = item.get(key)
                if value:
                    search_parts.append(str(value)[:240])
        records.append({
            "kind": report_type,
            "path": path,
            "report": report,
            "period_label": report_period_label(report_type, report),
            "window_label": (
                f'{str(report.get("window_start") or "")[:10]} — {str(report.get("window_end") or report.get("generated_at") or "")[:10]}'
                if report.get("window_start") and (report.get("window_end") or report.get("generated_at"))
                else str(report.get("generated_at") or "日期未记录")[:10]
            ),
            "year": year,
            "sort_key": sort_key,
            "title": report.get("report_title") or ("每周科研周报" if report_type == "weekly" else "月度研究机会"),
            "summary": report.get("summary") or (
                "本期未发现达到筛选门槛的高价值项目。"
                if report.get("status") == "no_high_value" else "本期报告未提供摘要。"
            ),
            "items": items,
            "search_text": " ".join(str(part) for part in search_parts).lower(),
        })
    return sorted(records, key=lambda item: (item["sort_key"], item["path"].name), reverse=True)


def archive_card(record):
    kind = record["kind"]
    report = record["report"]
    count = len(record["items"])
    count_label = "项精选" if kind == "weekly" else "项选题"
    detail_html = chatgpt_report_listing(report, kind, limit=None, include_note=False)
    return (
        f'<article class="radar-archive-item" data-archive-type="{escape(kind)}" '
        f'data-archive-year="{escape(record["year"])}" '
        f'data-archive-text="{escape(record["search_text"])}">'
        '<header class="radar-archive-head">'
        f'<span class="radar-period-badge">{escape(record["period_label"])}</span>'
        f'<span class="radar-archive-date">{escape(record["window_label"])}</span>'
        f'<span class="radar-archive-kind">{ "周报" if kind == "weekly" else "月报" }</span>'
        f'<span class="radar-archive-count">{count} {count_label}</span>'
        '</header>'
        f'<h4 class="radar-archive-title">{escape(record["title"])}</h4>'
        f'<p class="radar-archive-summary">{escape(str(record["summary"])[:260])}</p>'
        '<details class="radar-archive-details">'
        '<summary>展开查看本期内容</summary>'
        f'{detail_html}'
        '</details>'
        '</article>'
    )


def archive_cards(report_type):
    records = _archive_records(report_type)
    if not records:
        label = "周报" if report_type == "weekly" else "月报"
        return (
            '<div class="radar-empty-state radar-archive-empty">'
            f'暂未形成历史{label}档案。每期报告生成并通过校验后，会自动保存到历史记录。'
            '</div>'
        )
    return '<div class="radar-archive-list">' + "".join(archive_card(record) for record in records) + '</div>'


def candidate_card(item):
    title = link(item.get("source_url"), item.get("title", "未命名线索"))
    category = escape(category_label(item.get("category")))
    event_label = escape(item.get("event_label", "近期研究线索"))
    event_date = escape(str(item.get("event_at") or "")[:10] or "日期未核实")
    score = escape(item.get("match_score", "—"))
    reasons = "；".join(item.get("match_reasons", [])[:4])
    description = str(item.get("description") or item.get("abstract") or "").strip()
    description_html = (
        f'<p class="radar-feature-description">{escape(description[:360])}</p>'
        if description else ""
    )
    author_values = item.get("authors") if isinstance(item.get("authors"), list) else []
    author_text = ", ".join(str(value) for value in author_values[:4] if value)
    if len(author_values) > 4:
        author_text += " 等"
    author_html = (
        f'<p class="radar-feature-authors">作者：{escape(author_text)}</p>'
        if author_text else ""
    )
    venue_html = (
        f'<p class="radar-feature-venue">来源 / 会议：{escape(item.get("venue"))}</p>'
        if item.get("venue") else ""
    )
    signals = []
    if item.get("github_stars") is not None:
        signals.append(f'{escape(item.get("github_stars"))} GitHub stars')
        if item.get("github_license"):
            signals.append("许可证：" + escape(item.get("github_license")))
    if item.get("hf_downloads") is not None:
        signals.append(f'下载 {escape(item.get("hf_downloads"))} · 点赞 {escape(item.get("hf_likes", 0))}')
    signal_html = (
        f'<p class="radar-repo-signals">{" · ".join(signals)}</p>'
        if signals else ""
    )
    links = []
    seen = set()
    for key, label in (
        ("source_url", "原始来源"),
        ("paper_url", "论文"),
        ("pdf_url", "PDF"),
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
        f'{description_html}'
        f'{author_html}'
        f'{venue_html}'
        f'{signal_html}'
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



def open_state(value):
    if value is True:
        return "已标记开放"
    if value is False:
        return "未开放"
    return "状态待核实"


def chatgpt_item_card(item, report_type, report_generated):
    report_label = {"daily": "每日预警", "weekly": "每周周报", "monthly": "月度选题"}.get(report_type, "研究报告")
    title_text = item.get("title", "未命名研究成果")
    title_url = item.get("paper_url") or item.get("source_url") or item.get("github_url")
    title = link(title_url, title_text)
    summary = item.get("summary") or item.get("abstract") or item.get("description") or ""
    why = clean_value_point(item.get("why_selected") or item.get("selection_rationale") or "")
    opportunity = item.get("research_opportunity") or item.get("next_steps") or ""
    params = item.get("parameters") or item.get("parameter_scale") or "未报告"
    gpu = item.get("gpu") or item.get("gpu_requirement") or "未核实"
    screened_at = item.get("screened_at") or report_generated
    details = []
    if params != "未报告":
        details.append("参数规模：" + escape(params))
    else:
        details.append("参数规模：未报告")
    details.append("GPU：" + escape(gpu))
    if item.get("weights_open") is not None:
        details.append("权重：" + escape(open_state(item.get("weights_open"))))
    if item.get("training_code_open") is not None:
        details.append("训练代码：" + escape(open_state(item.get("training_code_open"))))
    if item.get("data_open") is not None:
        details.append("数据：" + escape(open_state(item.get("data_open"))))
    meta_links = []
    seen = set()
    for key, label in (("paper_url", "论文"), ("github_url", "GitHub"), ("huggingface_url", "Hugging Face")):
        url = item.get(key)
        if url and url not in seen and valid_url(url):
            seen.add(url)
            meta_links.append(link(url, label))
    links_html = " <span aria-hidden=\"true\">·</span> ".join(meta_links)
    return (
        '<article class="radar-feature-card radar-chatgpt-card">'
        '<div class="radar-feature-meta">'
        '<span class="radar-tag radar-tag-chatgpt">ChatGPT 已筛选</span>'
        f'<span class="radar-event-label">{escape(report_label)}</span>'
        f'<span class="radar-event-label">{escape(category_label(item.get("category")))}</span>'
        '</div>'
        f'<h4>{title}</h4>'
        f'<p class="radar-feature-description">{escape(summary[:460])}</p>'
        + (f'<p class="radar-feature-reasons"><strong>入选理由：</strong>{escape(why)}</p>' if why else "")
        + (f'<p class="radar-feature-reasons"><strong>研究切入点：</strong>{escape(opportunity)}</p>' if opportunity else "")
        + f'<p class="radar-chatgpt-compute">{" · ".join(details)}</p>'
        + f'<div class="radar-feature-footer"><span class="radar-match-score">科研筛选结果</span><time datetime="{escape(screened_at or "")}">报告时间：{escape(str(screened_at or "未记录")[:10])}</time></div>'
        + (f'<div class="radar-feature-links">{links_html}</div>' if links_html else "")
        + '</article>'
    )


def chatgpt_home_section(chatgpt_reports, now, limit=3):
    report_labels = {"daily": "每日预警", "weekly": "每周周报", "monthly": "月度选题"}
    entries = []
    latest_report_time = None
    for kind in ("daily", "weekly", "monthly"):
        report = chatgpt_reports.get(kind) or {}
        generated = report.get("generated_at")
        if generated:
            try:
                dt = parse_dt(generated)
                if latest_report_time is None or dt > latest_report_time:
                    latest_report_time = dt
            except (ValueError, TypeError):
                pass
        if report.get("status") not in ("completed", "no_high_value"):
            continue
        for item in report.get("items", []):
            if not isinstance(item, dict) or item.get("selection_status", "selected") not in ("selected", "chatgpt_selected", "recommended"):
                continue
            entry = dict(item)
            entry["_report_type"] = kind
            entry["_report_generated"] = generated
            entries.append(entry)
    entries.sort(key=lambda x: str(x.get("screened_at") or x.get("_report_generated") or ""), reverse=True)
    deduped = []
    seen = set()
    for item in entries:
        key = str(item.get("id") or item.get("paper_url") or item.get("source_url") or item.get("title", "")).lower()
        if key in seen:
            continue
        seen.add(key)
        deduped.append(item)
    cards = "".join(
        chatgpt_item_card(item, item["_report_type"], item["_report_generated"])
        for item in deduped[:limit]
    )
    if not cards:
        cards = (
            '<div class="radar-empty-state"><strong>尚无 ChatGPT 任务筛选结果写入共享档案。</strong>'
            '<p>本区域只展示每日预警、周报和选题任务实际生成并保存的结果，不会把爬虫候选冒充为 ChatGPT 推荐。</p></div>'
        )
    if latest_report_time:
        age = now.astimezone(timezone.utc) - latest_report_time
        time_text = latest_report_time.strftime("%Y-%m-%d %H:%M UTC")
        if age > timedelta(hours=36):
            status = (
                f'<div class="radar-home-warning" role="status">最近一次 ChatGPT 结果存档：{escape(time_text)}。'
                '该快照已超过 36 小时；下次计划任务成功写入后，此处才会更新为新结果。</div>'
            )
        else:
            status = f'<div class="radar-home-health" role="status">最近一次 ChatGPT 结果存档：{escape(time_text)}</div>'
    else:
        status = (
            '<div class="radar-home-warning" role="status">尚未记录 ChatGPT 任务结果的生成时间；'
            '自动采集候选不会替代 ChatGPT 的科研判断。</div>'
        )
    return f"""
<section class="radar-home-card radar-chatgpt-section" aria-labelledby="radar-chatgpt-title">
<div class="radar-home-section-heading"><h3 id="radar-chatgpt-title">历史 ChatGPT 筛选档案（待四维复评）</h3>
<span>每日预警 · 周报 · 月度选题</span></div>
<p>此处保存过去 ChatGPT 研究任务曾筛选的成果；这些条目未必具有按当前四维标准计算的科研价值评分，不能直接算作第二轮通过的推荐。</p>
{status}
<div class="radar-feature-grid radar-chatgpt-grid">{cards}</div>
<div class="radar-home-actions"><a class="radar-home-action-primary" href="radar/index.html#chatgpt-reviewed">查看全部 ChatGPT 筛选结果与理由 →</a></div>
<p class="radar-home-footnote">ChatGPT 筛选是研究辅助判断，不等同于同行评审；所有项目仍应保留原始来源与可核验证据。未知的参数规模、权重、训练代码、数据和 GPU 需求会明确标为未核实。</p>
</section>
"""


def weekly_heading_label(report):
    """Return compact weekly metadata for its own line below the section heading."""
    if not isinstance(report, dict) or report.get("status") not in ("completed", "no_high_value"):
        return "暂无已发布周报"
    period = report_period_label("weekly", report)
    anchor = report.get("generated_at") or report.get("window_end") or report.get("window_start")
    dt = _period_datetime(anchor)
    screened_date = dt.strftime("%Y-%m-%d") if dt else "日期待核实"
    return f"{period}，筛选日期：{screened_date}"


def clean_resource_note(value):
    """Avoid repeating archive/verification caveats on each individual card."""
    text = str(value or "").strip()
    for phrase in (
        "（按已存档周报记录，需实测复核）",
        "(按已存档周报记录，需实测复核)",
        "（按已存档周报记录）",
        "(按已存档周报记录)",
    ):
        text = text.replace(phrase, "")
    text = text.replace("据已存档周报记录", "")
    text = text.replace("已存档周报记录", "")
    text = text.replace("，需按原设置复核", "")
    text = text.replace("，需实测复核", "")
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[（(]\s*[）)]", "", text)
    return text.strip(" ；;，,")

def clean_value_point(value):
    """Use direct, student-facing language instead of internal report provenance."""
    text = str(value or "").strip()
    rewrites = {
        "原周报列为 A 优先级；模型权重和数据被记录为开放，且提供了 GitHub 与 Hugging Face 入口，适合作为文档解析的复现基线。":
            "提供 GitHub 与 Hugging Face 资源入口，可用于核查模型权重、数据和复现流程；适合作为文档解析任务的基线候选。",
        "已存档周报记录了 T4 16GB 环境测试，并报告 FP32 约 46 edits/s；完整蒸馏流程尚未确认，适合开展可复现实验和评测方法研究。":
            "参考性能数据为：T4 16GB 环境下 FP32 约 46 edits/s；该结果与完整蒸馏流程仍待独立核实，可从性能复现和评测方法入手。",
        "已存档周报记录训练代码开放，并覆盖多个参数规模，适合在统一任务和资源预算下比较模型规模、结构约束与泛化能力。":
            "项目涉及多个参数规模的模型，可在统一任务和资源预算下比较模型规模、结构约束与泛化能力；实验前应确认训练代码是否可获取。",
        "覆盖较小模型规模，适合研究长视频记忆、参数效率和视频 token 预算之间的关系；已存档周报指出训练代码与数据开放状态仍需核验。":
            "该方法面向较小模型规模，适合研究长视频记忆、参数效率与视频 token 预算之间的权衡；开展实验前应先确认训练代码和数据是否可获取。",
        "提供了论文和 GitHub 项目入口，适合评估直接视频决策与候选缓存的计算收益；T4 可运行性尚未确认。":
            "论文和 GitHub 项目提供了可追溯的研究入口，适合评估直接视频决策与候选缓存的计算收益；T4 可运行性仍需实测确认。",
    }
    if text in rewrites:
        return rewrites[text]
    text = re.sub(r"(?:原周报|报告)列为\s*[A-D]\s*优先级[；;，,]?\s*", "", text)
    text = re.sub(r"已存档周报(?:中)?记录了?\s*", "", text)
    text = re.sub(r"已存档周报(?:中)?指出\s*", "", text)
    text = re.sub(r"原周报(?:中)?(?:提到|指出|记录|列为)\s*", "", text)
    text = re.sub(r"周报(?:中)?(?:记录了?|指出|提到|报告了?)\s*", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip(" ；;，,。")


def chatgpt_report_listing(report, report_type, limit=3, include_note=True):
    """Render compact report cards; weekly period metadata lives in the section heading."""
    labels = {"weekly": "周报", "monthly": "月度总结"}
    label = labels.get(report_type, "研究报告")
    if not isinstance(report, dict) or not report:
        return f'<div class="radar-empty-state">尚无已存档的 ChatGPT{label}结果。</div>'
    status = report.get("status")
    generated_raw = report.get("generated_at")
    generated = escape(str(generated_raw or "时间未记录")[:10])
    period = escape(report_period_label(report_type, report))
    if status == "no_high_value":
        message = (
            '<strong>本期未发现达到门槛的高价值项目。</strong>'
            '<p>系统不会为了填满页面而推荐普通线索。</p>'
            if report_type == "weekly"
            else '<strong>本期未发现达到门槛的高价值项目。</strong>'
            f'<p>{period} · 任务于 {generated} 完成；系统不会为了填满页面而推荐普通线索。</p>'
        )
        return f'<div class="radar-empty-state">{message}</div>'
    if status != "completed":
        return f'<div class="radar-empty-state">最近一次{label}尚无可展示结果。</div>'
    items = [
        item for item in report.get("items", [])
        if isinstance(item, dict)
        and item.get("selection_status", "selected") in ("selected", "chatgpt_selected", "recommended")
    ]
    if not items:
        if report_type == "weekly":
            return (
                '<div class="radar-empty-state"><strong>本期没有保存可展示的精选条目。</strong>'
                '<p>通过评估的研究成果出现后，将在此处展示。</p></div>'
            )
        return (
            '<div class="radar-empty-state"><strong>本期没有保存可展示的精选条目。</strong>'
            f'<p>报告周期：{period}；任务记录时间：{generated}。</p></div>'
        )
    shown_items = items if limit is None else items[:limit]
    cards = []
    for item in shown_items:
        title_text = item.get("title", "未命名研究成果")
        title_url = item.get("paper_url") or item.get("source_url") or item.get("github_url")
        title = link(title_url, title_text)
        summary = item.get("summary") or item.get("abstract") or item.get("description") or ""
        why = clean_value_point(item.get("why_selected") or item.get("selection_rationale") or "")
        opportunity = item.get("research_opportunity") or item.get("next_steps") or ""
        screened_raw = item.get("screened_at") or generated_raw
        screened_at = escape(str(screened_raw or "日期未记录")[:10])
        category = f'<span class="radar-brief-label">{escape(category_label(item.get("category")))}</span>'
        meta = (
            category if report_type == "weekly"
            else (
                f'<span class="radar-period-badge">{period}</span>'
                + category
                + f'<span class="radar-brief-date">筛选日期：{screened_at}</span>'
            )
        )
        resource_meta = []
        params = item.get("parameters") or item.get("parameter_scale")
        gpu = item.get("gpu") or item.get("gpu_requirement")
        if params:
            resource_meta.append(
                f'<div class="radar-resource-row"><strong>参数量：</strong><span>{escape(params)}</span></div>'
            )
        if gpu:
            gpu_display = clean_resource_note(gpu)
            resource_meta.append(
                f'<div class="radar-resource-row"><strong>GPU需求：</strong><span>{escape(gpu_display)}</span></div>'
            )
        links = []
        seen = set()
        for key, link_label in (("paper_url", "论文"), ("github_url", "GitHub"), ("huggingface_url", "Hugging Face")):
            url = item.get(key)
            if url and url not in seen and valid_url(url):
                seen.add(url)
                links.append(link(url, link_label))
        cards.append(
            '<article class="radar-brief-card radar-weekly-card">'
            '<div class="radar-brief-heading">'
            f'<div class="radar-brief-meta">{meta}</div>'
            f'<h3>{title}</h3>'
            '</div>'
            + (f'<p class="radar-brief-summary">{escape(summary[:220])}</p>' if summary else "")
            + (f'<p class="radar-brief-value"><strong>价值点</strong>{escape(why[:220])}</p>' if why else "")
            + (f'<p class="radar-brief-student"><strong>学生切入</strong>{escape(opportunity[:240])}</p>' if opportunity else "")
            + (f'<div class="radar-chatgpt-compute">{"".join(resource_meta)}</div>' if resource_meta else "")
            + (f'<div class="radar-brief-links">{"".join(links)}</div>' if links else "")
            + '</article>'
        )
    if not include_note:
        extra = ""
    elif report_type == "weekly":
        extra = (
            f'<p class="radar-page-note">当前展示前 {len(shown_items)} 项；'
            '更多已评估内容可在历史周报中查看。</p>'
            if limit is not None and len(items) > len(shown_items) else ""
        )
    else:
        extra = (
            f'<p class="radar-page-note">报告周期：{period} · 更新于 {generated}。'
            + (f' 当前页面展示前 {len(shown_items)} 项；' if limit is not None and len(items) > len(shown_items) else "")
            + '</p>'
        )
    return '<div class="radar-brief-list">' + "".join(cards) + '</div>' + extra


def stage_two_detail_listing(reports, queue):
    """Render evidence-validated research picks in a scannable student-first card."""
    selected, errors = collect_screened(reports, queue)
    if errors:
        return (
            '<div class="radar-empty-state"><strong>本次科研价值复核未通过数据校验。</strong>'
            '<p>相关记录暂不展示为推荐，请检查自动检查日志。</p></div>'
        )
    if not selected:
        return (
            '<div class="radar-empty-state"><strong>暂时没有项目通过科研价值复核。</strong>'
            '<p>入选条件：主题匹配度 ≥8.0、综合评分 ≥7.5/10，且原始证据可核验。'
            '自动发现的线索不会直接成为推荐。</p></div>'
        )
    fields = (
        ("创新性", "innovation"), ("开源完整度", "open_source"),
        ("复现可行性", "reproducibility"), ("科研潜力", "research_potential")
    )
    cards = []
    for item in selected[:3]:
        dimensions = item["evaluation_dimensions"]
        scores = "".join(
            '<div class="radar-review-score-item">'
            f'<span class="radar-review-score-label">{label}</span>'
            f'<div class="radar-review-score-value"><strong>{escape(dimensions[key]["score"])}</strong>'
            '<span>/10</span></div></div>'
            for label, key in fields
        )
        urls = [url for url in item["evidence_urls"][:3] if valid_url(url)]
        evidence_links = []
        for index, url in enumerate(urls):
            label = "主要来源" if index == 0 else f"补充来源 {index + 1}"
            evidence_links.append(link(url, label))
        evidence = " <span aria-hidden=\"true\">·</span> ".join(evidence_links)
        title = link(urls[0] if urls else None, item["title"])
        summary = escape(str(item["summary"])[:220])
        reason = escape(clean_value_point(item["why_selected"])[:240])
        opportunity = escape(str(item["research_opportunity"])[:240])
        score = escape(item["value_score"])
        cards.append(
            '<article class="radar-review-card">'
            '<header class="radar-review-card-head">'
            '<div class="radar-review-card-labels">'
            f'<span class="radar-period-badge">{escape(weekly_period_label(item.get("screened_at") or reports.get("screened", {}).get("generated_at")))}</span>'
            '<span class="radar-review-pill radar-review-pill-approved">通过复核</span>'
            '<span class="radar-review-pill">主题匹配度 ≥8.0</span>'
            '</div>'
            f'<div class="radar-review-overall"><span>综合评分</span>'
            f'<strong>{score}</strong><small>/10</small></div>'
            '</header>'
            f'<h3 class="radar-review-title">{title}</h3>'
            f'<p class="radar-review-summary">{summary}</p>'
            '<div class="radar-review-score-grid" aria-label="四项评分">'
            f'{scores}</div>'
            '<div class="radar-review-detail-grid">'
            '<section class="radar-review-detail radar-review-value">'
            '<h4>研究价值</h4>'
            f'<p>{reason}</p></section>'
            '<section class="radar-review-detail radar-review-student">'
            '<h4>学生切入点</h4>'
            f'<p>{opportunity}</p></section>'
            '</div>'
            f'<footer class="radar-review-sources"><strong>原始证据</strong>{evidence}</footer>'
            '</article>'
        )
    return '<div class="radar-brief-list radar-review-list">' + "".join(cards) + '</div>'



def stage_two_home_section(chatgpt_reports, queue):
    reviewed, validation_errors = collect_screened(chatgpt_reports, queue)
    if validation_errors:
        body = ('<div class="radar-home-warning">部分二次评价记录不符合证据与评分规范，'
                '已阻止作为科研精选发布。请检查 CI 审核日志。</div>')
    elif not reviewed:
        body = ('<div class="radar-empty-state"><strong>尚无通过四维科研价值核验的第二轮推荐。</strong>'
                '<p>第一轮匹配度 ≥8.0 的候选不会自动晋升为推荐。'
                '待 ChatGPT 计划任务提交带证据、逐项评分的报告后，本区域自动更新。</p></div>')
    else:
        cards = []
        for item in reviewed[:3]:
            dimensions = item["evaluation_dimensions"]
            fields = [
                ("创新性", "innovation"), ("开源完整度", "open_source"),
                ("复现可行性", "reproducibility"), ("科研潜力", "research_potential")
            ]
            scores = " · ".join(
                f'{label} {escape(dimensions[key]["score"])}/10' for label, key in fields
            )
            links = " · ".join(link(url, "来源证据") for url in item["evidence_urls"][:3])
            title_url = item["evidence_urls"][0]
            reason = escape(item["why_selected"])
            opportunity = escape(item["research_opportunity"])
            cards.append(
                '<article class="radar-feature-card radar-chatgpt-card">'
                '<div class="radar-feature-meta"><span class="radar-tag radar-tag-chatgpt">'
                'ChatGPT 二次评价</span>'
                f'<span class="radar-match-score">综合 {escape(item["value_score"])}/10</span></div>'
                f'<h4>{link(title_url, item["title"])}</h4>'
                f'<p>{escape(item["summary"])}</p>'
                f'<p class="radar-feature-reasons">入选原因：{reason}</p>'
                f'<p class="radar-feature-reasons">后续研究：{opportunity}</p>'
                f'<p class="radar-feature-reasons">{scores}</p>'
                f'<p class="radar-feature-reasons">证据状态：自动结构校验通过；'
                f'可信度 {escape(item["confidence"])}，实验结论仍须复核</p>'
                f'<div class="radar-feature-links">{links}</div>'
                '</article>'
            )
        body = '<div class="radar-feature-grid radar-chatgpt-grid">' + "".join(cards) + '</div>'
    return (
        '<section class="radar-chatgpt-priority" aria-label="ChatGPT 二次筛选科研精选">'
        '<div class="radar-home-section-heading"><h3>ChatGPT 科研价值精选 · 第二轮</h3>'
        '<span>先按主题 ≥8 分初筛，再按科研价值四维评分（推荐 ≥7.5）</span></div>'
        + body
        + '<p class="radar-home-footnote">创新性30%、开源完整度25%、复现可行性25%、'
        '科研潜力20%；所有结论附原始来源。分数是 ChatGPT 辅助研究评价，不是同行评审。</p>'
        '</section>'
    )


def render(now=None):
    now = now or datetime.now(timezone.utc)
    projects = load(DATA / "projects.json", [])
    tasks = load(DATA / "tasks.json", [])
    candidates = load(DATA / "candidates.json", [])
    collection_status = load(DATA / "collection-status.json", {})
    chatgpt_reports = {
        kind: load(DATA / "chatgpt-reviewed" / f"latest-{kind}.json", {})
        for kind in ("screened", "daily", "weekly", "monthly")
    }
    archive_latest_reports(chatgpt_reports)
    reports = build(projects, now, candidates)
    screening_queue = load(DATA / "screening-queue.json", None) or build_queue(candidates, now)
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
    content = replace(content, "STAGE_TWO", stage_two_detail_listing(chatgpt_reports, screening_queue))
    content = content.replace("WEEKLY_PERIOD_LABEL", escape(weekly_heading_label(chatgpt_reports.get("weekly", {}))))
    for marker, report_type in (
        ("CHATGPT_WEEKLY", "weekly"),
        ("CHATGPT_MONTHLY", "monthly"),
    ):
        content = replace(content, marker, chatgpt_report_listing(chatgpt_reports.get(report_type, {}), report_type))
    content = replace(content, "WEEKLY_ARCHIVE", archive_cards("weekly"))
    content = replace(content, "MONTHLY_ARCHIVE", archive_cards("monthly"))
    leads = []
    for item in select_candidate_leads(candidates, now):
        title = item.get("title", "Untitled")
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
                   f"近7天主题匹配度 ≥8.0 的候选 {reports['weekly']['candidate_summary'].get('relevant_count', 0)} 条。"
                   " 下方仅展示近7天≥8.0分的自动候选（最多15条）；其余原始线索保留在后台。匹配度不是科研质量评分。")
    content = replace(content, "CANDIDATES", status_line + "\n\n" +
                      ("\n".join(leads) if leads else "近7天暂无主题匹配度达到 8.0 的自动候选。"))
    save_page("radar/index.md", content)

    page = DOCS / "radar/tasks.md"
    items = [
        f'- {link(p.get("url"), p.get("title", "Issue"))} — {escape(p.get("state", "open"))}'
        for p in tasks if isinstance(p, dict) and valid_url(p.get("url"))
    ]
    content = replace(page.read_text(encoding="utf-8"), "TASKS",
                      "\n".join(items) or "暂无研究任务快照。请通过上方 GitHub Issues 入口查看。")
    save_page("radar/tasks.md", content)

    print(f"Radar render complete: {len(approved)} approved records; research updates refreshed")

if __name__ == "__main__":
    render()

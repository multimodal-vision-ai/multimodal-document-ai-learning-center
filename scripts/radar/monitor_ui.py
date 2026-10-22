"""Render unattended radar status without claiming a simulated run was scheduled."""
import html
from core import load, valid_url
from health import inspect


def _e(value):
    return html.escape(str(value), quote=True)


def widget(data_path, now):
    status = inspect(data_path, now)
    translated = {
        "verified_report": "已保存新规范报告",
        "awaiting_first_v2_run": "待首次运行",
        "overdue": "运行过期 / 未写回",
        "invalid": "报告校验失败",
        "legacy_before_rollout": "仅有旧版报告"
    }
    tasks = "".join(
        '<div class="radar-stat"><strong>' + _e(item["label"]) + '</strong>'
        '<span>' + _e(translated.get(item["status"], item["status"])) + '</span>'
        '<span>数据时间：' + _e(item["generated_at"] or "未记录") + '</span></div>'
        for item in (status["tasks"][x] for x in ("daily", "weekly", "monthly"))
    )
    source = status["acquisition"]
    failures = source.get("source_failures", [])
    warning = (
        '<p class="radar-home-warning">采集降级：'
        + _e("; ".join(str(x)[:190] for x in failures[:2]))
        + '</p>'
    ) if failures else ""
    evidence = load(data_path / "automation-health.json", {})
    watchdog = evidence.get("watchdog", {}) if isinstance(evidence, dict) else {}
    publication = evidence.get("publication", {}) if isinstance(evidence, dict) else {}
    watchdog_time = watchdog.get("last_run_at") or "尚无独立巡检记录"
    watchdog_result = watchdog.get("status") or "unknown"
    pub_status = publication.get("status") or "unknown"
    pub_labels = {
        "success": "最近一次报告发布与页面核验通过",
        "failed": "最近一次报告发布或页面核验失败",
        "pending": "等待 GitHub Actions 发布核验",
        "unknown": "尚无可核验的发布记录",
    }
    pub_label = pub_labels.get(pub_status, pub_status)
    pub_message = publication.get("message") or "尚无详细发布核验说明。"
    links = []
    for key, label in (
        ("refresh_workflow_run_url", "查看报告发布工作流"),
        ("dev_preview_workflow_run_url", "查看 DEV 预览工作流"),
    ):
        if valid_url(publication.get(key)):
            links.append('<a href="' + _e(publication[key]) + '" target="_blank" rel="noopener noreferrer">' + label + '</a>')
    evidence_html = (
        '<div class="radar-publish-evidence"><strong>自动发布证据</strong>'
        '<p>最近独立巡检：' + _e(watchdog_time) + '（' + _e(watchdog_result) + '）</p>'
        '<p>最近报告写回与网页核验：<strong>' + _e(pub_label) + '</strong></p>'
        '<p>' + _e(pub_message) + '</p>'
        + ('<p>' + ' · '.join(links) + '</p>' if links else '')
        + '</div>'
    )
    return (
        '<section class="radar-monitoring" aria-label="周期任务运行验收">'
        '<div class="radar-home-section-heading"><h3>周期任务运行验收</h3>'
        '<span>每日 / 每周 / 每月独立核对</span></div>'
        '<p>来源状态：' + _e(source["status"]) + '；≥8分候选队列 '
        + _e(source["high_match_queue_count"]) + ' 项。</p>'
        '<div class="radar-stats">' + tasks + '</div>' + warning + evidence_html
        + '<p class="radar-home-footnote">状态来自已存档任务报告和最后一次独立巡检证据。'
        'GitHub 自动构建通过和手动科研演示不等于 ChatGPT 三种周期任务已按时运行；'
        '需分别核对实际任务执行、报告写回、工作流成功与公开页面内容。</p></section>'
    )

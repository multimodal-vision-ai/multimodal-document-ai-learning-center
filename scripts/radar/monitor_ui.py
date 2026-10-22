"""Render unattended radar status without claiming a simulated run was scheduled."""
import html
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
    return (
        '<section class="radar-monitoring" aria-label="周期任务运行验收">'
        '<div class="radar-home-section-heading"><h3>周期任务运行验收</h3>'
        '<span>每日 / 每周 / 每月独立核对</span></div>'
        '<p>来源状态：' + _e(source["status"]) + '；≥8分候选队列 '
        + _e(source["high_match_queue_count"]) + ' 项。</p>'
        '<div class="radar-stats">' + tasks + '</div>' + warning
        + '<p class="radar-home-footnote">状态来自已存档任务报告。'
        'GitHub 自动构建通过和手动科研演示不等于 ChatGPT 三种周期任务已按时运行；'
        '还需核对实际任务执行日志和网页发布记录。</p></section>'
    )

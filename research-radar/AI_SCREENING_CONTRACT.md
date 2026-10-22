# Research Radar: ChatGPT 二次科研评价与首页发布契约

## 两阶段筛选（DEV）

**第一阶段，GitHub 自动发现**：每天采集公开 arXiv/GitHub/HF/OpenReview 数据，去重并计算主题匹配度；`scripts/radar/reports.py` 从最近7天**≥8.0分**候选生成 `research-radar/data/screening-queue.json`，写入 `radar-data`。这不是科研质量评价。

**第二阶段，ChatGPT 研究任务**：现有每日预警、每周周报、月度选题任务读取 `radar-data` 中的 `screening-queue.json`，逐项阅读相关官方论文、README、权重页及许可证，判断创新性、开源完整度、复现可行性、科研潜力，并记录原始证据。不能只读仓库标题就宣布“已核实”。

将结果按照下列 JSON **schema v2** 写回 `radar-data/research-radar/data/chatgpt-reviewed/latest-{daily,weekly,monthly}.json`。已有 schema v1 历史报告继续显示为历史档案，**不会自动晋升为“通过第二轮评价”**。

```json
{
  "schema_version": 1,
  "screening_schema_version": 2,
  "report_type": "daily",
  "report_title": "ChatGPT 每日科研预警",
  "first_stage_threshold": 8.0,
  "status": "completed",
  "generated_at": "2026-10-22T12:00:00Z",
  "summary": "本次研究评价摘要",
  "items": [
    {
      "candidate_id": "arxiv-XXXX-YYYY",
      "title": "必须与screening-queue中条目名称一致",
      "selection_status": "recommended",
      "screened_at": "2026-10-22T12:00:00Z",
      "summary": "至少15字的事实性研究概述",
      "why_selected": "至少15字的有证据的研究价值判断",
      "research_opportunity": "至少12字的后续可验证问题",
      "evaluation_dimensions": {
        "innovation": {"score": 8, "rationale": "基于论文方法对比的充分解释"},
        "open_source": {"score": 8, "rationale": "基于代码权重数据及许可的解释"},
        "reproducibility": {"score": 8, "rationale": "基于计算资源实验配置与依赖的解释"},
        "research_potential": {"score": 8, "rationale": "基于后续科学问题的可验证解释"}
      },
      "confidence": "medium",
      "evidence_urls": ["https://arxiv.org/abs/XXXX.YYYYY"],
      "parameters": null,
      "gpu_requirement": null,
      "weights_open": null,
      "training_code_open": null,
      "data_open": null
    }
  ]
}
```

- 评分权重：创新性30%、开源完整度25%、复现可行性25%、科研潜力20%。只有总分≥7.5、四个单项都≥5、置信度非low、有正文解释且包含候选原始来源证据的 `recommended` 项可上首页科研精选。
- `not_recommended` 可以保留在报告里以说明舍弃原因，但不占用首页推荐名额。
- 不能依靠评分系统证明事实真实性；`scripts/radar/screening.py` 检查的是**数据结构、证据 URL 的关联、分数门槛与关联 ID**，不是模型结论的科学真伪。
- 若没有高价值项目，请写入 `status: "no_high_value"` 与 `items: []`；不得填充低质量项目。若没有在第一阶段队列中找到该论文，须先进入正常候选采集流程再考虑推荐，不能手动跳过8分门槛。
- 若无法验证参数量、模型权重、训练代码、数据与 GPU 需求，一律设置 `null`，不得猜测。自动运行能否在 ChatGPT 中写入 GitHub，需以下一次计划任务实际运行日志为准。
- `radar-data` 的 `.github/workflows/refresh-dev-preview-from-chatgpt-results.yml` 监听上述三个报告文件变动，先进行二次评价结构校验，再自动重建 DEV。正式 main 需要单独发布，当前不部署。

## 持续无人值守验收（监控不能代替真实运行）

`scripts/radar/health.py` 从 `radar-data` 已保存的数据计算每日、每周、每月三种任务的独立健康状态，并且在 DEV 首页显示「周期任务运行验收」。CI 运行 `python scripts/radar/health.py` 输出当前 JSON 诊断，不需要连接 OpenAI API，也不会直接篡改研究报告。模拟单元测试覆盖三周期通过、首次等待、超期、证据无效、数据源429降级、队列过期；**模拟结果不算 ChatGPT 真实计划任务通过**。

新 v2 规范从 2026-10-22T03:54Z 开始：首个宽限截止点分别为日 2026-10-23T10:00Z、周 2026-10-27T01:00Z、月 2026-11-02T01:00Z。宽限时间用于认定无人值守故障，不改动各任务真实执行计划。第一份新规范报告必须携带 `screening_schema_version=2`、实际 `generated_at`、合法评价结果，`no_high_value` 且空列表也可视为完成输出。之后当日报告超过40小时、周报超过9天、月报超过35天未更新时展示超期。公开候选队列或采集数据超过36小时未更新显示 stale；arXiv等来源受限显示 degraded。

ChatGPT 另有「科研雷达无人值守验收」每日条件检查任务：读取以上档案并核对 GitHub Actions 的自动触发/部署状态，仅当延误、同步失败或来源持续异常时通知。需进一步核验 ChatGPT 自动任务的真实执行历史，不能凭 GitHub 文件时间推断自动触发。跨日/周/月的真实运行结果只有在各自周期结束后才可完成最终验收。

**架构边界**：只在 `dev` 和 `radar-data` 维护；默认分支 `main` 未变动。GitHub Actions 的 cron 不会因非默认分支上的 workflow 而定时运行；当前开发环境依赖已启用的 ChatGPT 计划任务写回及 `radar-data` 的 push 事件触发 DEV 页面重建。若将来要求不依赖 ChatGPT 任务执行环境的独立定时部署，需要明确批准生产分支的 GitHub Actions 或另配有凭证的外部调度系统。

## 发布证据文件

独立的「科研雷达无人值守验收」任务每日检查三份报告和 GitHub Actions。它应把结果写入 `radar-data/research-radar/data/automation-health.json`，不要修改三个报告文件。这个文件会触发 DEV 页面重建，首页据此展示最后一次检查和发布证据。

最低结构如下（所有时间必须是实际 UTC ISO 8601 时间，不得用预计时间冒充执行时间）：

```json
{
  "schema_version": 1,
  "checked_at": "2026-10-22T12:00:00Z",
  "overall_status": "watching",
  "watchdog": {
    "last_run_at": "2026-10-22T12:00:00Z",
    "status": "completed",
    "message": "本次检查覆盖了三份报告、Actions 记录和公开预览页面"
  },
  "publication": {
    "status": "success",
    "checked_at": "2026-10-22T11:55:00Z",
    "refresh_workflow_run_url": "https://github.com/owner/repo/actions/runs/123",
    "dev_preview_workflow_run_url": "https://github.com/owner/repo/actions/runs/456",
    "home_content_verified": true,
    "detail_content_verified": true,
    "message": "确认报告写回后对应的工作流成功，首页和详情页包含当前二次评价内容"
  }
}
```

`publication.status=success` 只有在能把报告提交与成功的刷新工作流关联起来，且公开首页和详情页均返回预期内容时才可写入。只返回 HTTP 200 或 HTML 非空不算内容验证。若无法确认，使用 `unknown` 或 `failed`，并说明证据缺口。

共享档案的刷新工作流对新提交的 `latest-daily.json`、`latest-weekly.json`、`latest-monthly.json` 执行严格校验：新写入必须为 schema v2、时间戳有效、candidate ID 仍与当前 ≥8 分队列关联、四维评分与证据门槛通过；旧版历史档案可保留，但不算通过。

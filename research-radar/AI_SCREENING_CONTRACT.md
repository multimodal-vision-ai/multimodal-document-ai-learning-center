# Research Radar: ChatGPT 二次科研评价与首页发布契约

## 两阶段筛选（DEV）

**第一阶段，GitHub 自动发现**：每周一次集中采集公开 arXiv/GitHub/HF/OpenReview 数据，去重并计算主题匹配度；`scripts/radar/reports.py` 从最近7天**≥8.0分**候选生成 `research-radar/data/screening-queue.json`，写入 `radar-data`。这不是科研质量评价。

**第二阶段，ChatGPT 研究任务**：现有每周周报、月度选题任务（每日预警已停用）读取 `radar-data` 中的 `screening-queue.json`，逐项阅读相关官方论文、README、权重页及许可证，判断创新性、开源完整度、复现可行性、科研潜力，并记录原始证据。不能只读仓库标题就宣布“已核实”。

将结果按照下列 JSON **schema v2** 写回 `radar-data/research-radar/data/chatgpt-reviewed/latest-{weekly,monthly}.json`。已有 schema v1 历史报告继续显示为历史档案，**不会自动晋升为“通过第二轮评价”**。

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

## 低频运行与无人值守验收（2026-10-22 调整）

- **每周一北京时间 09:00**：ChatGPT 科研周报任务在 `dev` 分支创建或更新 `research-radar/weekly-run.json`，提交信息固定包含 `[radar-weekly-scan]`；该单次变更触发 DEV 构建中的网络采集、Issue 同步、≥8分候选队列更新，并存入 `radar-data`。普通 `dev` 代码推送只构建网站，**不再调用公开源采集**。
- 随后同一次 ChatGPT 周报任务读取更新后的 `screening-queue.json`，对高匹配候选按四维科研价值判断写入 `latest-weekly.json`。该文件变更由 `radar-data` 的 push 工作流更新 DEV 页面。只有 GitHub 实际写入/构建成功才能称已同步，异步完成可能延迟；不得猜测。
- **每月 1 日北京时间 09:00**：ChatGPT 月度任务基于近一个月的周报、历史已评价成果及必要的少量验证，生成 `latest-monthly.json` 与科研选题总结；**不再重复全网采集或重新扫描全部模型仓库**。
- 每日预警与每日巡检均已停用。人工维护、代码变更和手动点击工作流依然可能构建 DEV，但不能算作周期性网络采集。
- `scripts/radar/health.py` 和 DEV 首页只评估**周报和月报**是否按计划写入；周报超过9天、月报超过35天视为超期。队列/采集记录超过9天才算 stale，避免旧版36小时门槛造成频繁误报。原始日报仅作为历史档案保留。
- cron 在非默认分支上不会被 GitHub Actions 自动执行；周报由 ChatGPT 计划任务主动写入触发标记。该步骤在下一次实际周报运行前不能宣称已自动成功。
- 二次评价的科学判断仍要求原始证据、四维评分和来源匹配；单纯8分关键词候选不能成为首页科研精选。

## 发布证据文件

日常独立巡检已经停用。周报任务完成后检查周报与 GitHub Actions，月度任务完成后检查月报与页面；除非有明确异常，不另设每日扫描。它应把结果写入 `radar-data/research-radar/data/automation-health.json`，不要修改三个报告文件。这个文件会触发 DEV 页面重建，首页据此展示最后一次检查和发布证据。

最低结构如下（所有时间必须是实际 UTC ISO 8601 时间，不得用预计时间冒充执行时间）：

```json
{
  "schema_version": 1,
  "checked_at": "2026-10-22T12:00:00Z",
  "overall_status": "watching",
  "watchdog": {
    "last_run_at": "2026-10-22T12:00:00Z",
    "status": "completed",
    "message": "本次检查覆盖了周报与月报、Actions 记录和公开预览页面"
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

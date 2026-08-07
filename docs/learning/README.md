# 12 周多模态文档智能入门课程

这是一条面向高年级本科生与研究生新手的必修学习路径。课程以中文讲解为主，保留必要的 English terminology；正文只保留路线、任务与检查点，技术细节优先链接到持续更新的官方文档。

[从 Week 1 开始](00_12_Week_Bootcamp.md#week-1){ .md-button .md-button--primary }
[查看完整 12 周路线](00_12_Week_Bootcamp.md){ .md-button }
[查看评分标准](10_Assessment_and_Submission.md){ .md-button }

## 12 周进度导航

| 阶段 | 直接进入 | 核心能力 | 阶段里程碑 |
| --- | --- | --- | --- |
| 1. Reproducible Builder | [Week 1](00_12_Week_Bootcamp.md#week-1) · [Week 2](00_12_Week_Bootcamp.md#week-2) · [Week 3](00_12_Week_Bootcamp.md#week-3) | Git、模型调用、AI 辅助编程与验证 | 可复现脚本、首次 PR、测试与 AI 使用记录 |
| 2. Document AI Explorer | [Week 4](00_12_Week_Bootcamp.md#week-4) · [Week 5](00_12_Week_Bootcamp.md#week-5) · [Week 6](00_12_Week_Bootcamp.md#week-6) · [Week 7](00_12_Week_Bootcamp.md#week-7) | VLM、文档解析、Dataset 与 Benchmark | 可运行 pipeline、固定测试集与 baseline |
| 3. Model Experimenter | [Week 8](00_12_Week_Bootcamp.md#week-8) · [Week 9](00_12_Week_Bootcamp.md#week-9) · [Week 10](00_12_Week_Bootcamp.md#week-10) | LoRA/SFT、W&B、统一评测与消融 | 可比较 runs、Report 与错误分析 |
| 4. Research Communicator | [Week 11](00_12_Week_Bootcamp.md#week-11) · [Week 12](00_12_Week_Bootcamp.md#week-12) | 论文复现、项目表达与答辩 | Reproduction report 与 Capstone |

!!! tip "已经开始课程？"
    直接点击当前周次，先阅读“本周问题”和“提交与验收”；需要技术细节时再进入对应专题页，不必从头浏览全部文档。

## 你将获得什么

完成课程后，你应能：

- 用 GitHub 管理一个可复现的 AI 实验项目；
- 安全、透明地使用 AI-assisted coding，并验证 AI 生成代码；
- 调用开源 Vision-Language Model（VLM）处理真实文档；
- 构建 PDF → 结构化数据的 Document AI pipeline；
- 用 LoRA/PEFT 进行一次小规模微调；
- 用 Weights & Biases（W&B）记录、比较微调实验；
- 设计 baseline、指标与 error analysis；
- 完成并答辩一个可复现的小型研究项目。

## 每周节奏

建议每周投入 **6–8 小时**：官方材料 1–2 小时、动手实验 3–4 小时、记录与复盘 1–2 小时。所有周次都遵循同一闭环：

> Learn → Run → Measure → Improve → Explain

## 开始前

1. 打开[课程总览与每周计划](00_12_Week_Bootcamp.md)，先阅读“通关规则”。
2. 按[提交规范与评分量表](10_Assessment_and_Submission.md)创建个人学习仓库。
3. 复制[学习记录模板](11_Learning_Log_Template.md)，每周留下证据。
4. 从 Week 1 开始；不要跳过环境、复现和 AI 使用披露。

!!! tip "设备不足也能完成"
    Week 1–7 可在普通电脑上完成。Week 8–10 推荐使用 Kaggle/Colab GPU，并选择小模型或小数据集；评分看实验设计与证据，不看参数规模。

## 快速入口

| 我想做什么 | 入口 |
| --- | --- |
| 查看 12 周路线 | [课程总览](00_12_Week_Bootcamp.md) |
| 确认本周交什么 | [提交规范](10_Assessment_and_Submission.md) |
| 记录实验与 AI 协作过程 | [学习记录模板](11_Learning_Log_Template.md) |
| 解决环境与常见问题 | [FAQ](09_FAQ.md) |
| 深入阅读专题 | [论文导读](../reading/README.md) |
| 跟做一个短时可运行案例 | [动手教程](../tutorials/README.md) |
| 完成一个端到端研究作品 | [项目实战](../experiments/README.md) |

最后更新：2026-08-07

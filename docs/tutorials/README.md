---
shanshui_scene: 3
---

# 动手教程：从示例到可验证结果

这里提供可以跟着运行的 **hands-on tutorials**。每篇教程聚焦一个明确任务，帮助你在较短时间内完成一次运行、观察结果并做出有依据的修改。

[运行文档评测教程](Qwen2.5-OmniDocBench-kaggle-tutorial.md){ .md-button .md-button--primary }
[查看模型后训练路线](Qwen3.5-VL-SFT-GRPO-tutorial.md){ .md-button }

!!! info "它与 12 周课程、项目实战有什么区别？"
    - **12 周课程**提供学习顺序、每周主线、自主探索方向与证据清单。
    - **动手教程**解决一个具体问题，适合边运行边理解。
    - **项目实战**串联数据、模型、评测与报告，形成完整作品。

!!! note "关于页面中的时间"
    教程和项目页标注的是单个活动或最小路线所需时间，不是每周总投入。完整课程仍按每周约 24 小时规划，其余时间用于主线建设、评测、探索和复盘。

## 如何选择

| 入口 | 类型 | 适合周次 | 建议投入 | 你会带走什么 |
| --- | --- | --- | ---: | --- |
| [OmniDocBench Markdown 文档评测](Qwen2.5-OmniDocBench-kaggle-tutorial.md) | 可运行案例 / Runnable lab | Week 6–7 | 1–2 小时 | 一次 Benchmark 运行、结果文件与误差观察 |
| [Qwen3.5-VL：SFT 与 GRPO](Qwen3.5-VL-SFT-GRPO-tutorial.md) | 进阶路线 / Guided path | Week 8–10 以后 | 1 小时规划 + 后续实验 | 框架选择、训练路线与实践项目清单 |

!!! tip "第一次进入建议"
    如果还没有跑通过 Document AI pipeline，先完成文档评测教程；如果已经有 baseline、固定数据划分和评测脚本，再进入 SFT/GRPO 路线。

## 教程 01｜OmniDocBench Markdown 文档评测

这个教程以 Kaggle Notebook 为入口，适合第一次接触 Document AI Benchmark 的学生。

你将完成：

- 打开并复现一个可运行 Notebook；
- 理解 prediction、ground truth 与 evaluation 的关系；
- 保存评测输出，而不只保留截图；
- 修改一个变量并解释结果变化。

**最低产出**：Notebook 链接、运行配置、结果文件、一个失败案例和 200 字结论。

[开始教程 →](Qwen2.5-OmniDocBench-kaggle-tutorial.md){ .md-button .md-button--primary }

## 教程 02｜模型后训练：Qwen3.5-VL SFT/GRPO 路线

这是一份进阶学习路线，帮助你判断何时选择 SFT、何时继续探索 GRPO，以及应该使用哪些官方框架。它不是“一键得到更好模型”的脚本。

你将完成：

- 区分 SFT 与 GRPO 的目标、数据和评测要求；
- 比较 LLaMA-Factory、TRL 与 OpenRLHF 的适用场景；
- 为一个小规模后训练实验定义 baseline、资源上限和停止条件；
- 把实验接入 [W&B 记录与比较流程](../learning/08_Post_Training.md)。

**最低产出**：一页实验计划，包含研究问题、数据、baseline、唯一变量、指标、预算与风险。

[查看进阶路线 →](Qwen3.5-VL-SFT-GRPO-tutorial.md){ .md-button }

## 每篇教程的完成标准

- [ ] 从头运行，不依赖隐藏的 Notebook 状态；
- [ ] 记录模型、数据、代码 revision 和关键参数；
- [ ] 保存原始结果，并至少分析一个失败案例；
- [ ] 明确哪些内容来自 AI 建议，以及如何人工核验；
- [ ] 能用自己的话解释“改了什么、结果怎样、为什么可信”。

## 下一步

完成单个教程后，可以返回[12 周课程](../learning/00_12_Week_Bootcamp.md)整理对应周次证据，或进入[项目实战](../experiments/README.md)把多个步骤串成完整项目。

最后更新：2026-08-07

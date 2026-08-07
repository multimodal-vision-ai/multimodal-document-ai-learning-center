# Qwen3.5-VL 后训练路线｜SFT → Evaluation → GRPO

> **类型**：进阶学习路线 · **对应课程**：Week 8–10 以后 · **建议投入**：先用 1 小时完成实验设计，再决定训练预算

[查看课程中的后训练与 W&B](../learning/08_Post_Training.md){ .md-button .md-button--primary }
[查看 Qwen 官方模型](https://huggingface.co/Qwen){ .md-button }

本页帮助你决定怎样开始 Qwen3.5-VL 后训练。推荐顺序是 **baseline → LoRA/SFT → 统一评测 → 可选 GRPO**。没有稳定 baseline 和评测脚本时，不应直接进入强化学习训练。

## 先做决策

| 你的目标 | 优先选择 | 暂时不要做什么 |
| --- | --- | --- |
| 让模型学习固定输出格式或领域示例 | LoRA/QLoRA + SFT | 不要先设计复杂 reward |
| 验证数据与 pipeline 是否有效 | 小规模 SFT + frozen evaluation | 不要扩大模型和数据规模 |
| 已有可靠 SFT baseline，希望优化可计算目标 | GRPO（进阶） | 不要把 test set 当 reward 数据 |
| 没有固定数据划分或指标 | 先回到 Week 7 | 不要开始任何后训练 |

!!! warning "GRPO 不是必修起点"
    对入门课程而言，一次设计清楚、可复现并公平评测的 LoRA/SFT，比资源昂贵但无法解释的 GRPO 更有价值。GRPO 是 Week 10 之后的可选探索。

## 路线总览

| 阶段 | 核心问题 | 最低产出 |
| --- | --- | --- |
| 0. Baseline | 当前模型在固定 test set 上表现怎样？ | baseline 结果与错误样例 |
| 1. LoRA/SFT | 一个小规模 adapter 能否改善目标任务？ | 配置、adapter metadata、训练记录 |
| 2. Evaluation | 改进是否公平、稳定且值得成本？ | 指标、切片结果、资源成本与错误分析 |
| 3. GRPO（可选） | 可计算 reward 能否进一步优化目标？ | reward 定义、对照实验与风险说明 |

## Stage 0｜冻结 baseline

开始训练前必须固定：

- 模型 ID 与 revision；
- train/validation/test 划分；
- prompt/chat template 与 generation 参数；
- 主指标、辅助指标和失败案例格式；
- 资源预算与停止条件。

如果这些信息还不存在，请先完成[Document AI Benchmark](../learning/07_Doc_AI.md)和[Week 7](../learning/00_12_Week_Bootcamp.md#week-7)。

## Stage 1｜LoRA/QLoRA + SFT

### 需要理解的配置

- `target_modules`：哪些权重参与 adapter 训练；
- `r` 与 `lora_alpha`：adapter 容量与缩放；
- learning rate、effective batch size、epochs/steps；
- 数据格式、processor/chat template 与 label masking；
- precision、quantization 与 checkpoint 策略。

### 框架入口

| 框架 | 适合场景 | 官方入口 |
| --- | --- | --- |
| PEFT + TRL | 希望直接理解 Python 训练流程 | [PEFT](https://huggingface.co/docs/peft/) · [TRL SFTTrainer](https://huggingface.co/docs/trl/sft_trainer) |
| LLaMA-Factory | 希望用配置快速建立 SFT baseline | [GitHub](https://github.com/hiyouga/LlamaFactory) · [SFT 文档](https://llamafactory.readthedocs.io/zh-cn/latest/getting_started/sft.html) |

第一次实验只选择一种框架、一个小模型和一个小数据切片。先确认训练、保存和评测链路完整，再增加预算。

## Stage 2｜Evaluation + W&B

至少运行 baseline 与两个可比较 runs，每次只改变一个因素。使用 W&B 记录 config、loss、任务指标、运行时间、显存和 artifact metadata。

报告必须同时包含：

- 主指标与按文档类型切片的结果；
- 最少 5 个代表性错误案例；
- 训练成本和推理成本；
- 负面结果、限制与下一步假设；
- 从 W&B Report 回到具体 run、config 和 artifact 的入口。

具体提交格式见[模型后训练与 W&B 实验管理](../learning/08_Post_Training.md)。

## Stage 3｜GRPO（可选进阶）

只有满足以下条件后再进入：

- SFT baseline 已稳定复现；
- reward 可以用代码明确计算，并已单独测试；
- reward 数据与最终 test set 隔离；
- 有 SFT-only 对照组和资源上限；
- 能识别 reward hacking、长度偏置和格式投机。

推荐先阅读 [TRL GRPOTrainer](https://huggingface.co/docs/trl/grpo_trainer)。需要多机或大规模训练时，再评估 [OpenRLHF 官方文档](https://openrlhf.readthedocs.io/en/latest/)；不要仅因为框架支持就扩大实验范围。

## 一页实验计划模板

```markdown
# Post-training Plan

- 研究问题：
- 非目标：
- 模型与 revision：
- 数据来源、license 与划分：
- baseline：
- 训练方法：SFT / GRPO（说明理由）
- 本轮唯一变量：
- 主指标与失败案例：
- W&B project / run naming：
- 时间、显存与成本上限：
- 停止条件：
- 风险与人工检查：
```

## 官方学习入口

- [Qwen GitHub organization](https://github.com/QwenLM)（EN）
- [Qwen models on Hugging Face](https://huggingface.co/Qwen)（EN）
- [Qwen3.5-0.8B Model Card](https://huggingface.co/Qwen/Qwen3.5-0.8B)（EN）
- [Qwen documentation](https://qwen.readthedocs.io/)（EN）
- [Hugging Face PEFT](https://huggingface.co/docs/peft/)（EN）
- [Hugging Face TRL](https://huggingface.co/docs/trl/)（EN）
- [LLaMA-Factory documentation](https://llamafactory.readthedocs.io/zh-cn/latest/)（中文）
- [OpenRLHF documentation](https://openrlhf.readthedocs.io/en/latest/)（EN）

## 完成判定

- [ ] 能解释为什么本项目先选 SFT 或继续到 GRPO；
- [ ] baseline、数据划分、指标和预算已在训练前固定；
- [ ] 至少两个 runs 可公平比较，并由 W&B 记录；
- [ ] 结论包含错误案例、资源成本与限制；
- [ ] test set 未用于训练、调参或 reward 设计。

## 下一步

把一页实验计划带入 [Week 8–10](../learning/08_Post_Training.md)执行；如果 baseline 和评测尚未准备好，先返回[项目实战 01](../experiments/Experiment_01/README.md)。

最后更新：2026-08-07

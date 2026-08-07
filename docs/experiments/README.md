# 项目实战：从模型推理到研究报告

这里不是零散代码示例，而是需要连续完成的 **project labs**。你会把项目组织、数据准备、模型推理、对照实验、Benchmark 和总结报告串成一个可检查的作品。

[开始项目 01](Experiment_01/README.md){ .md-button .md-button--primary }
[先查看 12 周课程](../learning/00_12_Week_Bootcamp.md){ .md-button }

!!! info "先选对入口"
    只想快速跑通一个案例，请进入[动手教程](../tutorials/README.md)；希望形成可以提交、复现和答辩的完整作品，再从本页开始项目实战。

## 当前可做的项目

| 项目 | 状态 | 适合周次 | 建议投入 | 核心成果 |
| --- | --- | --- | ---: | --- |
| [项目 01｜Qwen3.5-VL 文档理解与评测](Experiment_01/README.md) | 可开始 | Week 4–7 | 12–18 小时 | 推理 pipeline、Prompt 对照、Benchmark 与项目报告 |

目前只有项目 01 达到可学习状态。未完成的方向不会显示为“可用实验”，避免学生点进空入口。

## 项目 01｜Qwen3.5-VL 文档理解与评测

### 你要回答的问题

> 同一个文档理解模型，在不同输入与 Prompt 设置下表现如何？这些观察能否被固定样例、原始输出和评测结果支持？

### 七个阶段

| 阶段 | 你要完成什么 | 主要产出 |
| --- | --- | --- |
| [Part 01](Experiment_01/Part01-实验准备.md) | 理解项目目标与完成标准 | 实验计划与检查清单 |
| [Part 02](Experiment_01/Part02-创建Github科研项目仓库.md) | 建立可协作的研究仓库 | GitHub repository 与提交记录 |
| [Part 03](Experiment_01/Part03-构建项目目录.md) | 组织代码、配置与结果 | 标准项目目录与 README |
| [Part 04](Experiment_01/Part04-数据集准备.md) | 准备可追溯的公开样例 | 数据说明与 sample set |
| [Part 05](Experiment_01/Part05-模型准备与推理.md) | 完成第一次模型推理 | 推理代码、配置与原始输出 |
| [Part 06](Experiment_01/Part06-提示词管理与对比分析.md) | 设计 Prompt 对照实验 | Prompt 表、结果对比与分析 |
| [Part 07](Experiment_01/Part07-Bechmark评测与总结.md) | 评测并形成结论 | Benchmark、错误分析与总结报告 |

### 最终作品

- 一个结构清楚、可从 README 启动的 GitHub 项目；
- 可追溯的数据来源、模型 revision、配置与运行命令；
- 至少两组可比较的 Prompt 或参数实验；
- 原始输出、指标表和代表性失败案例；
- 一份区分事实、结果、解释和限制的项目报告。

!!! success "完成判定 / Definition of Done"
    陌生同学能够按 README 复现至少一组结果；报告中的关键结论能回到具体输入、配置和原始输出；仓库中没有密钥、私人文档或未授权数据。

## 建议学习顺序

```text
12 周课程 Week 1–3
        ↓
动手教程：先跑通一个案例
        ↓
项目实战 01：完成七个阶段
        ↓
Week 7 Benchmark 与错误分析
        ↓
Week 8–10 后训练与 W&B
        ↓
Week 12 Capstone
```

项目 01 可以作为 Week 4–7 的主线成果，也可以继续扩展为 Week 12 Capstone。评分与提交格式以[提交规范与评分量表](../learning/10_Assessment_and_Submission.md)为准。

## 后续建设方向

后续项目将围绕 Document AI pipeline、VLM evaluation 和模型后训练展开。只有在指导书、代码入口、预期产出和验收标准齐全后，才加入“当前可做的项目”。

最后更新：2026-08-07

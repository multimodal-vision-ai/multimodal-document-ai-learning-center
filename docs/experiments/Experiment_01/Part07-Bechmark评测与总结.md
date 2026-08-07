# Part 7：小规模评测与项目总结（Evaluation and Project Summary）

[上一关：完成受控对比](Part06-提示词管理与对比分析.md){ .md-button }
[返回项目控制台](README.md){ .md-button }
[返回项目列表](../README.md){ .md-button .md-button--primary }

> **本关核心产出**：一项有效指标、错误分类、结论与可复现 README · **预计时间**：2–3 小时

[OmniDocBench 官方评测仓库](https://github.com/opendatalab/OmniDocBench){ .md-button }
[Document AI 与评测](../../learning/07_Doc_AI.md){ .md-button }

!!! success "本关通过条件"
    每个分数都能回到 sample、reference、prediction 和 metric 实现；至少展示 3 个代表性失败案例；结论明确区分观察、解释、限制与下一步；陌生同学可以按 README 复现至少一个 run。

!!! warning "不要把完成数量当作性能"
    “生成了多少文件、成功运行多少图片”只能说明流程覆盖率，不能说明模型质量。3–5 页结果应称为“小规模课程评测”；只有严格使用官方数据、prediction 格式、配置和 evaluation suite 时，才可以报告 OmniDocBench Benchmark 结果。

## 最低有效评测

### 1. 只选择一个任务

建议第一次选择文字或 Markdown 转写。为同一批 `sample_id` 准备独立 reference，不能把模型自己的输出当作 ground truth。

### 2. 选择能回答问题的指标

| 任务 | 最低可用证据 | 扩展方式 |
| --- | --- | --- |
| 文字 / Markdown 转写 | Normalized Edit Distance + 原始差异 | 按官方 OmniDocBench `Edit_dist` 配置评测 |
| 表格结构 | 人工核对行列与合并单元格 | 输出为官方要求格式后使用 TEDS |
| 无依据回答 | 对每个陈述标记 supported / unsupported | 增加盲审或第二位标注者 |

指标名称相同不代表实现相同。报告中必须写清来源、版本、输入预处理和“越高越好/越低越好”。

### 3. 建立结果表

```markdown
| run_id | sample_id | prompt_version | metric | score | main_error | evidence |
| --- | --- | --- | --- | ---: | --- | --- |
| p1_sample_text_01 | sample_text_01 | P1 | NED |  |  | outputs/raw/... |
```

### 4. 做错误分析

至少从漏字/错字、阅读顺序、表格结构、格式遵循、无依据内容中选择三类。每个错误保留输入区域、reference、原始 prediction 和你的解释。

### 5. 回答最初问题

回到 `docs/project_plan.md`：哪些结果支持原假设，哪些反驳它，哪些由于样例太少或变量未控制而仍无法判断？这部分比“哪个 Prompt 最好”更重要。

---

## 一、本部分学习目标（Learning Objectives）

完成本部分后，你应该能够：

* 理解 Benchmark 在科研中的作用；
* 完成第一次模型性能评测；
* 整理实验数据与实验结果；
* 编写规范的实验总结；
* 完成 Experiment 01 全部归档；
* 独立完成一个完整的科研实验流程。

---

## 二、实验任务

本部分需要完成以下任务：

1. 整理实验数据；
2. 整理模型输出；
3. 建立 Benchmark 目录；
4. 统计实验结果；
5. 编写实验总结；
6. 完成项目归档；
7. 提交 GitHub。

---

## 三、整理实验输出（Operations）

进入项目目录：

```text
outputs/
```

检查以下目录是否存在：

```text
outputs/

├── raw/

├── metadata/

├── figures/

└── logs/
```

确认每个目录均包含对应实验结果。

原始输出建议按 `run_id` 命名，例如：

```text
outputs/raw/p1_sample_text_01.txt

outputs/raw/p2_sample_text_01.txt

outputs/raw/p3_sample_text_01.txt
```

对应 metadata：

```text
outputs/metadata/p1_sample_text_01.json

outputs/metadata/p2_sample_text_01.json
```

日志建议：

```text
run_20260710.log
```

---

## 四、建立 Benchmark 目录（Operations）

进入：

```text
docs/
```

创建：

```text
benchmark/
```

目录如下：

```text
docs/

└── benchmark/

    ├── benchmark_report.md

    ├── benchmark_summary.md

    └── benchmark_statistics.md
```

---

## 五、建立 Benchmark 记录（Operations）

编辑：

```text
benchmark_report.md
```

填写：

```markdown
# Benchmark Report

## Experiment

Experiment 01

## Model

Qwen/Qwen3.5-0.8B

## Dataset

OmniDocBench Sample

## Test Date

YYYY-MM-DD

## Number of Samples

......

## Tester

Your Name
```

---

## 六、统计覆盖率与质量指标（Operations）

编辑：

```text
benchmark_statistics.md
```

填写：

```markdown
# Benchmark Statistics

| Item | Result |
|------|--------|
| Number of Images | |
| OCR Completed | |
| Markdown Generated | |
| JSON Generated | |
| Failed Images | |
| Metric Name / Version | |
| P1 Score | |
| P2 Score | |
| P3 Score | |
```

先统计流程覆盖率，再填写 P1/P2/P3 在同一 reference 上的质量指标。两类数字不要混为一个“总体性能”。

填写完成。

---

## 七、建立实验评价（Operations）

编辑：

```text
benchmark_summary.md
```

填写：

```markdown
# Benchmark Summary

## Overall Performance

......

## Advantages

......

## Problems

......

## Future Improvements

......
```

要求：

每一部分不少于三条内容。

---

## 八、建立项目总结（Operations）

进入：

```text
docs/
```

创建：

```text
project_summary.md
```

填写：

```markdown
# Project Summary

## Project Name

Qwen3.5 Document Understanding Project

## Objective

......

## Development Process

......

## Experimental Results

......

## Problems

......

## Lessons Learned

......

## Future Work

......
```

---

## 九、更新 README（Operations）

打开：

```text
README.md
```

更新为：

```markdown
# Qwen3.5 Document Understanding Project

## Introduction

The first research project of the Multimodal Document AI Laboratory.

## Project Structure

......

## Environment

......

## Dataset

OmniDocBench

## Model

Qwen/Qwen3.5-0.8B

## Experiments

Experiment 01

## Outputs

Raw predictions

Run metadata

Figures and logs

## Author

Your Name
```

---

## 十、整理项目目录（Operations）

最终项目目录建议如下：

```text
qwen3vl-first-project/

├── README.md
├── LICENSE
├── requirements.in
├── requirements-lock.txt
├── environment.yml
│
├── data/
│
├── docs/
│   ├── benchmark/
│   ├── model_information.md
│   └── project_summary.md
│
├── experiments/
│
├── outputs/
│   ├── raw/
│   ├── metadata/
│   ├── figures/
│   └── logs/
│
└── scripts/
```

确认目录完整。

---

## 十一、项目自检（Operations）

请逐项检查。

| 检查内容         | 是否完成 |
| ------------ | ---- |
| README 完成    | □    |
| 数据目录完成       | □    |
| 模型来源与 revision 已记录 | □    |
| 推理完成         | □    |
| Prompt 实验完成  | □    |
| 小规模评测完成 | □    |
| 实验总结完成       | □    |
| GitHub 已同步   | □    |

全部完成后进入下一步。

---

## 十二、项目归档（Operations）

进入：

```text
experiments/
```

确认：

```text
Experiment01/
```

至少包含：

```text
Experiment01/

├── experiment.md

├── prompts/

├── results/

├── analysis/
```

所有实验文档均保留。

不得删除。

---

## 十三、Git 提交（Operations）

执行：

```bash
git status
```

检查所有新增文件。

执行：

```bash
git add .
```

执行：

```bash
git commit -m "docs: complete experiment 01"
```

执行：

```bash
git push
```

刷新 GitHub 页面。

确认所有文件均已同步。

---

## 十四、常见问题（Common Errors）

### 问题一

README 内容过于简单。

建议：

至少包括：

* 项目介绍；
* 环境；
* 数据集；
* 模型；
* 实验；
* 使用方法。

---

### 问题二

实验结果没有保存。

所有输出必须保留。

不得只保留最终结果。

---

### 问题三

Benchmark 未记录。

所有实验均必须建立 Benchmark 文档。

---

### 问题四

项目目录混乱。

严格按照实验室统一目录管理。

不要自行修改目录结构。

---

## 十五、本部分成果（Deliverables）

完成本部分后，应提交：

```text
README.md

project_summary.md

benchmark_report.md

benchmark_statistics.md

benchmark_summary.md
```

以及：

* Experiment01 全部实验记录；
* 全部输出结果；
* Git Commit 历史。

---

## 十六、自我检查列表（Checklist）

| 检查项                | 状态 |
| ------------------ | -- |
| README 完整          | □  |
| 项目目录规范             | □  |
| Benchmark 文档完成     | □  |
| Project Summary 完成 | □  |
| 实验结果完整             | □  |
| Git Commit 完整      | □  |
| GitHub 已同步         | □  |

全部完成后，本实验达到自主完成标准。

---

## 十七、Experiment 01 最终成果

完成本实验后，你已经具备以下能力：

* 创建标准科研项目；
* 管理 GitHub 项目；
* 下载公开数据集；
* 下载开源模型；
* 运行官方推理程序；
* 完成 Prompt Engineering；
* 整理实验结果；
* 编写实验报告；
* 建立 Benchmark 文档；
* 规范管理科研资料。

---

## 十八、Experiment 01 总结

Experiment 01 是实验室所有成员的第一个标准科研实验。

后续所有科研项目都将在此基础上继续开展。

请保留本项目，后续 Experiment 02、Experiment 03 等实验将在此基础上持续扩展。

---

## 下一实验

**Experiment 02：Qwen3.5 Document Benchmark Evaluation**

主要内容包括：

* 完整 OmniDocBench 数据集推理；
* 官方评测工具使用；
* OCR 指标分析；
* Layout 指标分析；
* Reading Order 指标分析；
* Markdown 质量分析；
* Benchmark 可视化；
* 实验报告撰写；
* GitHub Release 发布。

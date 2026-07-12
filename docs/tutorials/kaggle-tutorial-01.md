# Kaggle Examples

> **Multimodal Document AI Learning Center**
>
> **Module:** Kaggle Tutorials
>
> **Version:** v1.0
>
> **Last Updated:** July 2026

本目录整理课程配套的 **Kaggle Notebook**。

所有 Notebook 均可直接在线运行，无需本地配置复杂环境，适合作为课程实验、论文复现和科研入门案例。

---

# Why Kaggle?

对于初学者而言，Kaggle 提供了完整的大模型实验环境：

* 免费 GPU（T4 / P100 / L4 等）
* 预装 Python 与主流 AI 框架
* 在线 Notebook
* 可直接发布与分享
* 可一键 Fork 修改
* 与 GitHub 配合进行版本管理

因此，本课程所有实验均优先提供 Kaggle Notebook 版本。

---

# Example 01

## OmniDocBench Evaluation from Markdown

**Author**

Guoping Tan

**Difficulty**

⭐⭐⭐☆☆

**Category**

Document AI / Benchmark

**Notebook**

https://www.kaggle.com/code/guopingtan/omnidocbench-evaluation-md

---

# Introduction

本案例演示如何使用 **OmniDocBench 官方评测工具**，对文档解析模型输出的 Markdown 结果进行标准化评测。

实验重点不是模型推理，而是帮助学生掌握：

* Benchmark 的基本使用流程
* 官方评测脚本的运行方式
* Markdown 结果组织格式
* OmniDocBench 指标计算方法
* Benchmark 实验复现流程

该案例适合作为 **Document AI Benchmark** 的第一个实践实验。

OmniDocBench 是目前国际上最具代表性的文档解析评测基准之一，支持文本、表格、公式、阅读顺序等多维度评测。

---

# Learning Objectives

完成本案例后，应能够：

* 理解 OmniDocBench 数据组织方式
* 理解 Markdown Prediction 格式
* 运行官方 Evaluation Pipeline
* 阅读 Evaluation Report
* 理解 Edit Distance、TEDS、Reading Order 等指标
* 为自己的模型生成标准 Benchmark 结果

---

# Skills You Will Learn

* Benchmark Reproduction
* Markdown Evaluation
* Document Parsing Evaluation
* Result Analysis
* Research Reproducibility

---

# Workflow

```text
Model Prediction (.md)
          │
          ▼
Prediction Folder
          │
          ▼
OmniDocBench Evaluation
          │
          ▼
Metric Calculation
          │
          ▼
Evaluation Report
          │
          ▼
Performance Analysis
```

---

# Related Learning Modules

建议按照以下顺序学习：

| Step | Module                          |
| ---- | ------------------------------- |
| 1    | Foundation Models               |
| 2    | Vision-Language Models          |
| 3    | Document AI                     |
| 4    | Benchmarks                      |
| 5    | **Kaggle Example 01（当前案例）**     |
| 6    | Experiment 01：Qwen3.5-VL 文档理解实验 |

---

# Related Resources

## Official Benchmark

OmniDocBench Official Repository

https://github.com/opendatalab/OmniDocBench

官方提供：

* Benchmark Dataset
* Evaluation Scripts
* Leaderboard
* Model Baselines
* Official Documentation

---

## Official Paper

**OmniDocBench: Benchmarking Diverse PDF Document Parsing with Comprehensive Annotations**

https://arxiv.org/abs/2412.07626

建议结合论文阅读 Benchmark 的整体设计思想和评价指标。

---

# Suggested Exercises

完成 Notebook 后，建议继续尝试：

* 修改 Markdown 输出并重新评测；
* 对比不同模型（如 Qwen3-VL、PaddleOCR-VL、MinerU、Docling）的评测结果；
* 分析 Text、Table、Formula、Reading Order 等不同指标；
* 绘制 Benchmark 对比图（Radar Chart、Bar Chart、Heatmap）；
* 将实验结果整理为论文中的 Benchmark 实验章节。

---

# Citation

如果本 Notebook 对你的学习或科研有所帮助，请同时引用：

* OmniDocBench 官方论文；
* OmniDocBench 官方 GitHub；
* 本课程对应实验文档与代码仓库。

---

# Future Examples

后续课程将持续补充更多 Kaggle Notebook：

| Example    | Topic                          |
| ---------- | ------------------------------ |
| Example 01 | OmniDocBench Evaluation        |
| Example 02 | Qwen3.5-VL Document Parsing    |
| Example 03 | Docling Pipeline               |
| Example 04 | PaddleOCR-VL Evaluation        |
| Example 05 | MinerU Benchmark               |
| Example 06 | OCRBench Evaluation            |
| Example 07 | MMDocBench Evaluation          |
| Example 08 | DocVQA Baseline                |
| Example 09 | Table Recognition (PubTabNet)  |
| Example 10 | End-to-End Document AI Project |

---

> **Notebook Link**
>
> https://www.kaggle.com/code/guopingtan/omnidocbench-evaluation-md
>
> 建议先 **Fork** Notebook，再按照实验指导书逐步完成所有实践内容。


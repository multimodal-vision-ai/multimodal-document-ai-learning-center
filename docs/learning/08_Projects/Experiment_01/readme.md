# Experiment 01：Qwen3.5-VL Document Understanding

> **Multimodal Document AI Laboratory - Lab Manual**

---

## Introduction

欢迎来到 **Experiment 01**。

这是 **Multimodal Document AI Laboratory** 的第一个正式实验，也是所有新成员进入实验室后必须完成的基础实验。

本实验将带领你完成一个完整的 Document AI 科研项目，从项目创建、环境配置、数据集准备，到模型推理、Prompt Engineering、实验记录和 Benchmark 初步评测，帮助你建立规范的科研开发流程。

完成本实验后，你将具备独立开展后续科研项目的基础能力。

---

## Learning Objectives

完成本实验后，你应该能够：

* 创建标准 GitHub 科研项目；
* 建立统一的科研项目目录；
* 配置 Python 与开发环境；
* 下载并管理公开数据集；
* 下载并运行 Qwen3.5-VL-0.8B 模型；
* 完成第一次模型推理；
* 设计并测试不同 Prompt；
* 保存实验结果与实验日志；
* 完成 Benchmark 初步评测；
* 编写规范的实验总结。

---

## Prerequisites

开始本实验前，请确保已经完成以下学习内容。

* Chapter 01：Git & GitHub Basics
* Chapter 02：Python Development Environment
* Chapter 03：Hugging Face Fundamentals
* Chapter 04：Kaggle Basics
* Chapter 05：Transformers Quick Start
* Chapter 06：Qwen3.5-VL-0.8B Introduction
* Chapter 07：SmolDocling Introduction
* Chapter 08：Document AI Fundamentals

---

## Experiment Structure

本实验共包含 **7 个 Part**。

| Part   | Title                                          | Status |
| ------ | ---------------------------------------------- | ------ |
| Part 1 | Experiment Preparation                         | ☐      |
| Part 2 | Create Your First Research Repository          | ☐      |
| Part 3 | Build a Standard Research Project Structure    | ☐      |
| Part 4 | Dataset Preparation                            | ☐      |
| Part 5 | Model Preparation and First Inference          | ☐      |
| Part 6 | Prompt Engineering and Comparative Experiments | ☐      |
| Part 7 | Benchmark Evaluation and Project Summary       | ☐      |

建议严格按照顺序完成，不要跳过任何章节。

---

## Expected Project Structure

完成本实验后，你的项目目录应如下所示：

```text
qwen3vl-first-project/

├── README.md
├── LICENSE
├── requirements.txt
├── environment.yml
│
├── assets/
├── data/
├── docs/
├── experiments/
├── models/
├── notebooks/
├── outputs/
└── scripts/
```

所有后续实验均将在此基础上继续开展。

---

## Experiment Workflow

```text
Experiment Preparation
          │
          ▼
Create GitHub Repository
          │
          ▼
Build Project Structure
          │
          ▼
Prepare Dataset
          │
          ▼
Download Model
          │
          ▼
Run First Inference
          │
          ▼
Prompt Engineering
          │
          ▼
Benchmark Evaluation
          │
          ▼
Experiment Summary
```

---

## Deliverables

完成本实验后，应提交以下成果。

### Project

* GitHub Repository
* 标准科研项目目录
* README.md

### Environment

* requirements.txt
* environment.yml

### Dataset

* 数据目录
* Dataset Description

### Model

* Model Information
* 第一次推理程序

### Experiments

* Experiment Log
* Prompt Records
* Experiment Analysis

### Outputs

* Markdown Results
* JSON Results
* Log Files

### Documents

* Benchmark Report
* Benchmark Summary
* Project Summary

---

## Checklist

实验完成验收时，应重点检查以下内容。

| Item                          | Status |
| ----------------------------- | ------ |
| GitHub Repository Created     | □      |
| Standard Project Structure    | □      |
| Development Environment Ready | □      |
| Dataset Prepared              | □      |
| Model Downloaded              | □      |
| First Inference Completed     | □      |
| Prompt Experiments Completed  | □      |
| Benchmark Completed           | □      |
| Experiment Report Completed   | □      |
| Git Commit History Complete   | □      |

全部完成后，Experiment 01 验收通过。

---

## Learning Outcomes

完成本实验后，你将掌握以下能力。

* 科研项目规范管理
* Git 与 GitHub 使用
* Python 开发环境配置
* Hugging Face 模型管理
* Document AI 数据管理
* Vision Language Model 基本使用
* Prompt Engineering
* 实验记录与实验复现
* Benchmark 初步评测
* 科研文档撰写

这些能力将作为后续所有实验的基础。

---

## Next Experiment

完成本实验后，请继续学习：

> **Experiment 02：Qwen3.5-VL Document Benchmark Evaluation**

主要内容包括：

* 完整数据集推理
* OmniDocBench 官方评测
* OCR 指标分析
* Layout 指标分析
* Reading Order 分析
* Markdown 质量分析
* Benchmark 可视化
* 实验报告撰写
* GitHub Release 发布

---

## Laboratory Rules

实验室统一规定：

1. 所有项目必须使用 GitHub 管理。
2. 所有实验必须保留完整实验记录。
3. 所有代码必须进行版本管理。
4. 所有实验结果必须可复现。
5. 不得修改实验室统一项目目录结构。
6. 每完成一个 Part，必须提交一次 Git Commit。
7. 所有实验文档统一采用 Markdown 编写。
8. 所有大型模型和数据集统一存放于 Hugging Face，不提交至 GitHub。

---

## License

This Lab Manual is maintained by the **Multimodal Document AI Laboratory** for research and educational purposes.


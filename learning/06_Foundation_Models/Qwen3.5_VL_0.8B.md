# Chapter 6：Qwen3.5-VL-0.8B

# Qwen3.5-VL-0.8B for Multimodal Document AI

---

# 1. 学习目标（Learning Objectives）

完成本章学习后，你应该能够：

* 了解 Qwen 模型家族的发展历程
* 理解 Qwen3.5-VL-0.8B 的基本能力
* 成功下载并运行官方模型
* 使用模型完成图片理解任务
* 使用模型完成文档理解任务
* 理解 Prompt 对模型输出的影响
* 熟悉实验室基于 Qwen3.5-VL 的开发流程

---

# 2. Qwen3.5-VL 简介（Introduction）

Qwen 是阿里巴巴通义千问团队推出的大模型系列，包括文本模型（LLM）、代码模型（Code）、数学模型（Math）以及视觉语言模型（Vision Language Model，VLM）。

Qwen3.5-VL-0.8B 是 Qwen 多模态模型中的轻量级版本，具有参数规模小、推理速度快、部署成本低等特点，非常适合作为科研学习和实验验证模型。

对于实验室而言，Qwen3.5-VL-0.8B 主要用于：

* 多模态文档理解（Document Understanding）
* OCR 与文字识别
* 版面分析（Layout Analysis）
* 表格理解（Table Understanding）
* 图片内容理解
* Prompt Engineering
* Benchmark 测试
* 微调实验（LoRA）

建议所有新成员首先学习 Qwen3.5-VL-0.8B，再逐步学习更大规模模型。

---

# 3. 官方资源（Official Resources）

## GitHub

QwenLM

https://github.com/QwenLM

---

## Hugging Face

Qwen 官方主页

https://huggingface.co/Qwen

---

## Model Hub

浏览全部 Qwen 模型

https://huggingface.co/models?search=Qwen

---

## 官方文档

https://qwen.readthedocs.io/

---

## 技术报告

建议阅读最新发布的 Qwen-VL 技术报告，了解模型设计思想、训练数据、评测结果及应用场景。

---

# 4. 快速开始（Quick Start）

本章建议使用以下开发环境：

| 软件           | 推荐版本         |
| ------------ | ------------ |
| Python       | 3.11         |
| Transformers | 最新稳定版        |
| PyTorch      | 最新稳定版        |
| CUDA         | 与 PyTorch 匹配 |
| Git          | 最新版          |

建议在前面课程创建的 `mdai` Conda 环境中完成实验。

---

## 第一步：下载模型

进入 Hugging Face，选择需要使用的 Qwen3.5-VL-0.8B 模型。

建议阅读 Model Card，了解模型功能、输入格式及使用限制。

---

## 第二步：阅读官方示例

进入官方 GitHub 仓库。

优先阅读：

* README
* examples
* Quick Start

不要急于阅读全部源码。

---

## 第三步：运行官方 Demo

按照官方说明完成第一次推理。

建议先使用一张普通图片进行测试，确认模型能够正常输出结果。

---

## 第四步：尝试文档图片

选择一张包含文字、表格或版面的图片。

观察模型对文档内容的理解能力。

---

# 5. 模型推理（Inference）

Qwen3.5-VL 的基本推理流程如下：

```text
输入图片
    │
    ▼
AutoProcessor
    │
    ▼
构建 Prompt
    │
    ▼
Qwen3.5-VL
    │
    ▼
Generate
    │
    ▼
输出结果
```

整个推理过程中，需要重点理解以下几个步骤：

* 图片读取
* Processor 处理输入
* Prompt 编写
* 模型生成
* 输出解析

实验过程中，可以尝试修改 Prompt，观察模型输出的变化。

---

# 6. Document AI 应用（Applications）

在实验室中，Qwen3.5-VL 主要用于以下任务：

## OCR

识别文档中的文字内容。

---

## Layout Analysis

识别标题、正文、图片、表格等版面结构。

---

## Table Understanding

理解复杂表格内容，并转换为结构化结果。

---

## Reading Order

分析页面阅读顺序。

---

## Markdown Generation

将文档转换为 Markdown。

---

## 文档问答（Document QA）

根据文档内容回答问题。

---

## 信息抽取（Information Extraction）

提取指定字段，如姓名、日期、金额、编号等。

---

# 7. 项目源码（Project Structure）

阅读 GitHub 项目时，建议按照以下顺序：

```text
README
    │
    ▼
examples
    │
    ▼
推理脚本
    │
    ▼
Processor
    │
    ▼
模型接口
```

重点关注：

* 官方 Demo
* 推理流程
* Prompt 示例
* 输入输出格式

暂时不必深入研究底层网络结构。

---

# 8. 本章实践（Hands-on Practice）

完成以下实践任务。

## 任务一

下载 Qwen3.5-VL-0.8B 模型。

---

## 任务二

成功运行官方 Demo。

---

## 任务三

准备三张不同类型图片：

* 自然场景图片
* 普通文档图片
* 包含表格的文档图片

观察模型输出结果。

---

## 任务四

修改 Prompt。

例如：

* 描述图片内容
* 提取文字
* 提取表格
* 总结文档内容

比较不同 Prompt 的输出差异。

---

## 任务五

保存实验结果。

建议建立如下目录：

```text
experiments/

└── qwen3.5-vl/

    ├── images/
    ├── prompts/
    ├── outputs/
    └── notes.md
```

记录：

* 图片
* Prompt
* 输出结果
* 实验结论

---

# 9. 本章总结（Summary）

本章介绍了 Qwen3.5-VL-0.8B 的基本能力及实验室中的主要应用。

完成本章后，你应该能够：

* 独立下载模型
* 独立运行官方 Demo
* 使用模型完成图片理解任务
* 使用模型完成文档理解任务
* 修改 Prompt 并分析模型输出
* 建立规范的实验记录

这些能力将作为后续科研工作的基础。

---

# 10. 下一章（Next Chapter）

下一章学习：

> **Chapter 7：SmolDocling**

主要内容包括：

* SmolDocling 简介
* 官方资源
* 模型部署
* 文档解析流程
* Markdown 生成
* 与 Qwen3.5-VL 的能力对比
* 实验室应用场景
* 实践任务

完成后，你将掌握另一种主流的 Document AI 模型，并能够比较不同模型在文档理解任务中的特点与适用场景。


# Chapter 7：SmolDocling

# SmolDocling for Multimodal Document AI

---

# 1. 学习目标（Learning Objectives）

完成本章学习后，你应该能够：

* 了解 SmolDocling 的定位与特点
* 熟悉 SmolDocling 官方资源
* 成功运行官方 Demo
* 理解文档解析流程
* 掌握 Markdown 文档生成
* 理解 SmolDocling 与 Qwen3.5-VL 的区别
* 熟悉实验室中 SmolDocling 的应用场景

---

# 2. SmolDocling 简介（Introduction）

SmolDocling 是 Docling 项目推出的轻量级文档理解模型，专注于 Document AI 场景。

相比通用视觉语言模型，SmolDocling 更关注：

* PDF 文档解析
* OCR
* 页面版面理解
* Markdown 转换
* 文档结构恢复

其目标是将复杂文档转换为适合大模型处理的结构化文本，为后续问答、检索和 Agent 应用提供高质量输入。

对于实验室而言，SmolDocling 是文档预处理的重要工具，可与 Qwen3.5-VL 等模型协同使用。

---

# 3. 官方资源（Official Resources）

## GitHub

Docling Project

https://github.com/docling-project/docling

---

## Hugging Face

Docling 官方主页

https://huggingface.co/docling-project

---

## 官方文档

https://docling-project.github.io/docling/

---

## Model Hub

浏览 Docling 相关模型

https://huggingface.co/docling-project

---

# 4. 快速开始（Quick Start）

建议继续使用实验室统一开发环境。

推荐流程：

1. 阅读官方 README。
2. 按照官方说明安装依赖。
3. 下载 SmolDocling 模型。
4. 运行官方 Demo。
5. 使用一份 PDF 文档进行测试。

建议优先验证官方示例，再开展自己的实验。

---

# 5. 模型推理（Inference）

SmolDocling 的基本处理流程如下：

```text
PDF / 图片
      │
      ▼
文档读取
      │
      ▼
页面解析
      │
      ▼
版面分析
      │
      ▼
OCR
      │
      ▼
结构恢复
      │
      ▼
Markdown 输出
```

重点理解：

* 文档输入
* 页面解析
* 结构恢复
* Markdown 输出

这些步骤构成了现代 Document AI 系统的重要基础。

---

# 6. Document AI 应用（Applications）

SmolDocling 适用于以下任务：

## PDF 转 Markdown

将 PDF 转换为结构清晰的 Markdown 文档。

---

## OCR

识别文档中的文字内容。

---

## Layout Analysis

识别标题、正文、图片、表格等版面结构。

---

## Table Extraction

提取表格内容。

---

## Reading Order

恢复页面阅读顺序。

---

## Document Parsing

将复杂文档转换为结构化表示。

---

## RAG 文档预处理

作为知识库构建前的数据清洗与转换工具。

---

# 7. 项目源码（Project Structure）

阅读项目时建议按照以下顺序：

```text
README
    │
    ▼
examples
    │
    ▼
CLI
    │
    ▼
Pipeline
    │
    ▼
Models
```

重点关注：

* 官方示例
* 文档解析流程
* Markdown 输出
* Pipeline 设计

理解整体流程即可，不必深入每个实现细节。

---

# 8. Qwen3.5-VL 与 SmolDocling 对比

| 项目   | Qwen3.5-VL            | SmolDocling            |
| ---- | --------------------- | ---------------------- |
| 模型类型 | Vision Language Model | Document Parsing Model |
| 主要能力 | 图像理解、多模态推理            | 文档解析、Markdown 生成       |
| 输入   | 图片、文档                 | PDF、图片                 |
| 输出   | 文本回答                  | 结构化 Markdown           |
| 适用场景 | 多模态理解                 | 文档预处理                  |

实验室通常将两者结合使用，而不是相互替代。

---

# 9. 本章实践（Hands-on Practice）

完成以下任务。

## 任务一

安装 SmolDocling。

---

## 任务二

运行官方 Demo。

---

## 任务三

准备三份 PDF：

* 学术论文
* 技术报告
* 包含表格的文档

观察输出效果。

---

## 任务四

比较原始 PDF 与生成的 Markdown。

分析：

* 标题恢复情况
* 表格恢复情况
* 图片处理情况
* 阅读顺序是否正确

---

## 任务五

建立实验记录：

```text
experiments/

└── smoldocling/

    ├── pdf/
    ├── markdown/
    ├── outputs/
    └── notes.md
```

记录实验过程与分析结果。

---

# 10. 本章总结（Summary）

本章介绍了 SmolDocling 的定位及实验室中的主要应用。

完成本章后，你应该能够：

* 独立运行 SmolDocling
* 使用模型解析 PDF
* 生成 Markdown 文档
* 理解文档解析流程
* 比较 SmolDocling 与 Qwen3.5-VL 的特点
* 将其应用于实验室 Document AI 项目

---

# 11. 下一章（Next Chapter）

下一章学习：

> **Chapter 8：Document AI**

主要内容包括：

* Document AI 基本概念
* 文档处理流程
* OCR、版面分析、表格识别等核心任务
* 主流数据集与 Benchmark
* 实验室整体技术路线

完成后，你将建立完整的 Document AI 知识体系，为后续科研和项目开发奠定基础。


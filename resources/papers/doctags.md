# DocTags

> **Multimodal Document AI Learning Center**
>
> **Module:** DocTags
>
> **Version:** v3.0
>
> **Part:** 1 / 4
>
> **Last Updated:** July 2026

---

# Overview

DocTags 是近年来提出的一种面向 **Document AI** 的新型结构化文档表示格式（Structured Document Representation）。

它的目标不是简单保存文本，而是：

> **完整描述文档中的内容、结构、空间位置和语义信息。**

DocTags 已成为 Docling、SmolDocling 等新一代 Document AI 系统的重要组成部分，也是未来 AI Agent 和 RAG 系统的重要中间表示。

---

# Learning Objectives

完成本章节后，应能够：

* 理解为什么需要 DocTags
* 理解 DocTags 与 Markdown、HTML、JSON 的区别
* 理解结构化文档表示（Structured Representation）
* 理解 DocTags 在现代 Document AI 中的作用

---

# Learning Roadmap

```text
PDF
 │
 ▼
Vision-Language Model
 │
 ▼
Structured Document
 │
 ▼
DocTags
 │
 ▼
Knowledge Representation
 │
 ▼
AI Agent
```

---

# Part 1. Why Do We Need DocTags?

传统 OCR 的输出通常只有文本：

```text
This is a document.

Table 1 ...

Figure 2 ...
```

虽然文本能够保存内容，

但是会丢失：

* 页面布局
* 阅读顺序
* 图片位置
* 表格结构
* 标题层级
* 数学公式
* 图表关系

对于 AI 来说：

这些信息同样重要。

---

# Limitations of Plain Text

例如：

```text
Introduction

Figure 1

Table 1

Conclusion
```

无法回答：

* Figure 位于哪里？
* Table 属于哪一章节？
* Caption 对应哪个图片？
* 阅读顺序是什么？
* 这是标题还是正文？

因此：

> **Plain Text 无法表达 Document Structure。**

---

# Part 2. Evolution of Document Representation

文档表示的发展过程如下：

```text
Plain Text
      │
      ▼
Markdown
      │
      ▼
HTML
      │
      ▼
JSON
      │
      ▼
Structured Document
      │
      ▼
DocTags
```

DocTags 的目标不是替代 Markdown，

而是在 Markdown 基础上增加：

* Layout
* Structure
* Location
* Semantic Information

形成统一的文档语义表示。

---

# What is DocTags?

DocTags 可以理解为：

> **一种面向大型语言模型的文档描述语言（Document Markup Language）。**

它能够统一表示：

* 标题
* 正文
* 图片
* 表格
* 数学公式
* 代码
* 列表
* Caption
* Reading Order
* 页面位置

相比 Markdown：

信息更加完整。

---

# Part 3. Why Markdown is Not Enough?

Markdown 适合：

* 文档写作
* 博客
* GitHub
* README

例如：

```markdown
# Title

This is a paragraph.

| A | B |
```

但是：

Markdown 无法准确表达：

* Bounding Box
* Reading Order
* Page Coordinates
* Semantic Regions
* Multi-column Layout

因此：

现代 Document AI 更需要一种：

> **Layout-aware Structured Representation**

---

# DocTags vs Markdown

| Feature        | Markdown | DocTags |
| -------------- | :------: | :-----: |
| Text           |     ✓    |    ✓    |
| Heading        |     ✓    |    ✓    |
| Table          |     ✓    |    ✓    |
| Formula        |     ✓    |    ✓    |
| Figure         |     △    |    ✓    |
| Layout         |     ✗    |    ✓    |
| Reading Order  |     ✗    |    ✓    |
| Bounding Box   |     ✗    |    ✓    |
| Semantic Block |     ✗    |    ✓    |
| AI-ready       |     △    |    ✓    |

---

# Part 4. DocTags Design Philosophy

DocTags 的设计目标包括：

## 1. Unified Representation

统一表示：

* PDF
* DOCX
* PPT
* HTML
* Image

所有文档类型。

---

## 2. Layout-aware

保留：

* 页面布局
* 空间位置
* 阅读顺序

而不仅仅是文本。

---

## 3. Semantic-aware

保留：

* Heading
* Caption
* Table
* Formula
* Code
* Figure

等语义信息。

---

## 4. LLM-friendly

DocTags 的设计目标之一就是：

> **让大型语言模型更容易理解文档。**

相比传统 OCR，

模型无需重新推断文档结构，

可以直接利用结构化表示进行推理。

---

# Typical Workflow

现代 Document AI 的处理流程：

```text
PDF
 │
 ▼
Document Parser
 │
 ▼
Vision-Language Model
 │
 ▼
DocTags
 │
 ▼
Markdown / JSON
 │
 ▼
LLM
 │
 ▼
RAG
 │
 ▼
AI Agent
```

---

# Laboratory Relevance

实验室未来建议统一采用：

```text
PDF
 │
 ▼
Qwen3-VL
 │
 ▼
DocTags
 │
 ▼
OmniDocBench
 │
 ▼
Research Agent
```

DocTags 将作为：

* 统一数据格式
* Benchmark 数据格式
* Agent 输入格式
* Long-context Document Memory

的重要基础。

---

# Knowledge Checklist

完成本部分后，应能够回答：

## Structured Representation

* 为什么纯文本不能表达复杂文档？
* Markdown 有哪些局限？
* 为什么需要结构化文档表示？

---

## DocTags

* DocTags 的设计目标是什么？
* DocTags 与 Markdown 有什么区别？
* DocTags 为什么更适合大型语言模型？

---

# Summary

Document Representation 的发展路线如下：

```text
Plain Text
      │
      ▼
Markdown
      │
      ▼
HTML
      │
      ▼
JSON
      │
      ▼
DocTags
      │
      ▼
AI-ready Structured Document
```

DocTags 代表了现代 **Document AI** 从"文本提取"向"语义理解"发展的重要方向，也是构建 **Document AI Agent**、**RAG** 和 **AI Research Agent** 的关键基础表示。


# DocTags

> **Multimodal Document AI Learning Center**
>
> **Module:** DocTags
>
> **Version:** v3.0
>
> **Part:** 2 / 4
>
> **Last Updated:** July 2026

---

# Part 5. DocTags Architecture

DocTags 的设计目标不是简单记录文本，而是完整描述：

* 文档内容（Content）
* 文档结构（Structure）
* 页面布局（Layout）
* 空间位置（Location）
* 阅读顺序（Reading Order）
* 语义关系（Semantic Relation）

因此，一个 DocTags 文档可以理解为：

```text
Document
    │
    ├── Metadata
    ├── Pages
    ├── Blocks
    ├── Layout
    ├── Reading Order
    ├── Semantic Structure
    └── Spatial Information
```

相比传统 Markdown：

DocTags 增加了：

> **Document Structure + Semantic Layout**

这是现代 Document AI 最重要的变化之一。

---

# Relationship with DoclingDocument

目前 Docling 的统一内部数据结构是：

> **DoclingDocument**

DocTags 是其一种重要导出格式。

整体流程如下：

```text
PDF
 │
 ▼
Docling Parser
 │
 ▼
DoclingDocument
 │
 ├── Markdown
 ├── HTML
 ├── JSON
 ├── DocTags
 └── DocLang
```

DoclingDocument 保留了完整的文档层级、布局、来源信息（Provenance）和页面坐标，再根据需求导出不同格式。

---

# Core Structure

一个完整的 DocTags 通常包含以下几类信息。

```text
Document
 │
 ├── Metadata
 ├── Pages
 ├── Sections
 ├── Paragraphs
 ├── Tables
 ├── Figures
 ├── Equations
 ├── Lists
 ├── Code Blocks
 └── References
```

其中每个对象不仅包含文本，

还保存：

* Bounding Box
* Page Index
* Reading Order
* Parent Node
* Child Node

---

# Part 6. Core Semantic Elements

现代 Document AI 最关注的是：

> **Semantic Blocks**

典型语义元素包括：

| Element   | Description |
| --------- | ----------- |
| Title     | 文档标题        |
| Heading   | 各级章节标题      |
| Paragraph | 正文段落        |
| List      | 列表          |
| Table     | 表格          |
| Figure    | 图片          |
| Caption   | 图题、表题       |
| Formula   | 数学公式        |
| Code      | 代码块         |
| Footnote  | 脚注          |
| Reference | 参考文献        |

相比 OCR，

这些元素具有明确的语义边界。

---

# Hierarchical Representation

DocTags 采用层次化表示方式。

例如：

```text
Document
    │
    ├── Chapter
    │      │
    │      ├── Section
    │      │      │
    │      │      ├── Paragraph
    │      │      ├── Figure
    │      │      └── Table
    │      │
    │      └── Section
    │
    └── References
```

这种结构能够完整恢复论文、教材、技术文档等复杂层级。

---

# Spatial Information

DocTags 不仅保存文本，

还保存页面中的空间信息。

例如：

```text
Heading

Page: 3

Bounding Box:
(x1,y1,x2,y2)
```

空间信息可用于：

* 页面重建
* Visual Grounding
* Region Retrieval
* Reading Order
* GUI Agent

这是 Markdown 无法提供的能力。

---

# Reading Order

对于复杂文档，

阅读顺序通常不是：

```text
Left → Right
```

而是：

```text
Column 1
      │
      ▼
Column 2
      │
      ▼
Figure
      │
      ▼
Caption
```

DocTags 将阅读顺序作为独立信息保存，

避免多栏论文、杂志和报告出现阅读错误。

---

# Provenance

现代 DocTags 还记录：

> **Provenance（来源信息）**

包括：

* 来源页面
* 坐标位置
* 原始区域
* OCR 来源
* Parser 来源

例如：

```text
Paragraph

Page: 12

Source:
PDF

Bounding Box:
(...)
```

这对于：

* 可追溯 AI
* Citation
* Document QA

具有重要意义。

---

# Metadata

DocTags 一般保存：

| Field         | Description |
| ------------- | ----------- |
| Title         | 文档标题        |
| Author        | 作者          |
| Language      | 语言          |
| Pages         | 页数          |
| Creation Time | 创建时间        |
| Source        | 文档来源        |
| Version       | 文档版本        |

Metadata 是 RAG 和知识库管理的重要基础。

---

# Comparison

| Feature       | Markdown | HTML | JSON | DocTags |
| ------------- | :------: | :--: | :--: | :-----: |
| Text          |     ✓    |   ✓  |   ✓  |    ✓    |
| Heading       |     ✓    |   ✓  |   ✓  |    ✓    |
| Table         |     ✓    |   ✓  |   ✓  |    ✓    |
| Formula       |     ✓    |   ✓  |   ✓  |    ✓    |
| Layout        |     ✗    |   △  |   ✓  |    ✓    |
| Reading Order |     ✗    |   ✗  |   △  |    ✓    |
| Bounding Box  |     ✗    |   ✗  |   ✓  |    ✓    |
| Hierarchy     |     △    |   ✓  |   ✓  |    ✓    |
| Provenance    |     ✗    |   ✗  |   △  |    ✓    |
| Agent-ready   |     △    |   △  |   ✓  |    ✓    |

---

# Laboratory Relevance

建议实验室统一采用如下流程：

```text
PDF
 │
 ▼
Qwen3-VL
 │
 ▼
DoclingDocument
 │
 ▼
DocTags
 │
 ▼
Markdown / JSON
 │
 ▼
Knowledge Base
 │
 ▼
AI Agent
```

这一流程兼顾：

* 数据保存
* 模型训练
* Benchmark
* RAG
* Agent

也是当前国际开源生态的发展方向。

---

# Knowledge Checklist

完成本部分后，应能够回答：

## Document Structure

* 什么是层次化文档表示？
* 为什么需要 Document Tree？

---

## Spatial Information

* 为什么 Bounding Box 很重要？
* Reading Order 为什么必须单独保存？

---

## Provenance

* 什么是 Provenance？
* 为什么 AI Agent 需要来源信息？

---

## DocTags

* DocTags 与 DoclingDocument 的关系是什么？
* 为什么 DocTags 比 Markdown 更适合作为 Document AI 的中间表示？

---

# Summary

DocTags 的核心设计思想如下：

```text
PDF
 │
 ▼
DoclingDocument
 │
 ▼
Document Tree
 │
 ├── Metadata
 ├── Layout
 ├── Reading Order
 ├── Semantic Blocks
 ├── Bounding Boxes
 └── Provenance
 │
 ▼
DocTags
 │
 ▼
AI-ready Structured Document
```

DocTags 不只是新的文档格式，更代表了 **Document AI 从文本提取（Text Extraction）向语义表达（Semantic Representation）** 的演进方向，为后续 **RAG、Document Agent、AI Research Agent** 提供统一的数据基础。


# DocTags

> **Multimodal Document AI Learning Center**
>
> **Module:** DocTags
>
> **Version:** v3.0
>
> **Part:** 3 / 4
>
> **Last Updated:** July 2026

---

# Part 7. How Are DocTags Generated?

现代 Document AI 已逐渐从传统 OCR Pipeline 演进为：

> **Vision-Language Model → Structured Representation → DocTags**

典型流程如下：

```text
PDF / Image
      │
      ▼
Vision-Language Model
      │
      ▼
Layout Understanding
      │
      ▼
Semantic Understanding
      │
      ▼
Document Tree
      │
      ▼
DoclingDocument
      │
      ▼
DocTags
```

Docling 将不同来源的文档统一转换为 **DoclingDocument**，随后可以导出 Markdown、HTML、JSON、DocTags 等格式。

---

# Traditional Pipeline vs Modern Pipeline

## Traditional OCR Pipeline

```text
PDF
 │
 ▼
OCR
 │
 ▼
Layout Analysis
 │
 ▼
Table Recognition
 │
 ▼
Formula Recognition
 │
 ▼
Markdown
```

特点：

* 多模块串联
* 误差容易累积
* 难以统一优化

---

## Modern VLM Pipeline

```text
PDF
 │
 ▼
Vision Encoder
 │
 ▼
Large Language Model
 │
 ▼
Unified Document Understanding
 │
 ▼
DoclingDocument
 │
 ▼
DocTags
```

特点：

* End-to-End
* 统一推理
* 更强泛化能力
* 更适合 AI Agent

---

# Part 8. DocTags Generation Pipeline

完整生成流程通常包括：

```text
Document
    │
    ▼
Page Detection
    │
    ▼
Layout Detection
    │
    ▼
Reading Order
    │
    ▼
Text Recognition
    │
    ▼
Table Recognition
    │
    ▼
Formula Recognition
    │
    ▼
Semantic Classification
    │
    ▼
Document Tree
    │
    ▼
DocTags
```

现代 Docling 已将版面分析、阅读顺序、表格结构、公式、图片、代码等信息统一组织到 `DoclingDocument` 中，并支持直接导出 DocTags。

---

# What Does a Vision-Language Model Learn?

现代 VLM 并不是直接学习：

```text
Image
    │
    ▼
Text
```

而是学习：

```text
Image
   │
   ▼
Layout
   │
   ▼
Structure
   │
   ▼
Semantics
   │
   ▼
Reasoning
```

因此，

DocTags 更像是：

> **Vision-Language Model 对文档理解结果的结构化表达。**

---

# Key Information Preserved in DocTags

DocTags 通常保存以下信息：

| Information        | Example                       |
| ------------------ | ----------------------------- |
| Document Hierarchy | Chapter → Section → Paragraph |
| Reading Order      | 多栏阅读顺序                        |
| Page Number        | 第几页                           |
| Bounding Box       | 页面坐标                          |
| Figure Association | 图片与 Caption 对应关系              |
| Table Structure    | 行、列、表头                        |
| Formula            | LaTeX 表示                      |
| Code Block         | 编程语言与内容                       |
| Metadata           | 标题、作者、语言等                     |

相比 Markdown，

DocTags 能够完整保留：

> **Document Semantics + Layout + Provenance**

---

# Relationship Between Docling and DocTags

```text
PDF
 │
 ▼
Docling
 │
 ▼
DoclingDocument
 │
 ├── Markdown
 ├── HTML
 ├── JSON
 ├── DocTags
 └── DocLang
```

DocTags 并不是独立解析器，

而是：

> **DoclingDocument 的一种高语义导出格式。**

Docling 官方将 DocTags 定义为一种能够高效表达文档内容和布局特征的标记格式。

---

# Why Is Reading Order Critical?

复杂文档通常包含：

* 双栏论文
* 跨页表格
* 图片
* Caption
* 页眉页脚

如果阅读顺序错误：

```text
Column 1
Column 2
```

可能变成：

```text
Column 1
Figure
Column 2
Caption
```

导致：

* LLM 理解错误
* RAG 检索失败
* Agent 推理错误

因此，

Reading Order 是现代 Document AI 的核心能力之一，也是 DocTags 保存的重要属性。

---

# Why Structured Representation Matters for LLMs?

传统输入：

```text
Plain Text
```

现代输入：

```text
DocTags
```

优势包括：

* 保留章节层级
* 保留图片与标题关系
* 保留表格结构
* 保留来源信息
* 保留页面坐标
* 保留语义标签

LLM 无需再次推断文档结构，

即可直接进行：

* 问答（QA）
* 摘要（Summarization）
* 检索（Retrieval）
* 推理（Reasoning）

---

# Laboratory Research Pipeline

建议实验室统一采用如下流程：

```text
PDF
 │
 ▼
Qwen3-VL
 │
 ▼
Docling
 │
 ▼
DoclingDocument
 │
 ▼
DocTags
 │
 ▼
Knowledge Base
 │
 ▼
RAG
 │
 ▼
Research Agent
```

该流程能够兼顾：

* 文档解析
* 数据集构建
* 模型训练
* Benchmark
* Agent 应用

也是当前国际开源生态推荐的发展方向。

---

# Future Research Directions

DocTags 未来值得重点研究的方向包括：

| Research Topic                   | Importance |
| -------------------------------- | ---------- |
| DocTags Generation               | ⭐⭐⭐⭐⭐      |
| DocTags Schema Optimization      | ⭐⭐⭐⭐⭐      |
| Reading Order Prediction         | ⭐⭐⭐⭐⭐      |
| Table Semantic Representation    | ⭐⭐⭐⭐       |
| Formula Semantic Representation  | ⭐⭐⭐⭐       |
| DocTags-aware Fine-tuning        | ⭐⭐⭐⭐⭐      |
| DocTags Benchmark                | ⭐⭐⭐⭐⭐      |
| Agent-ready Structured Documents | ⭐⭐⭐⭐⭐      |

---

# Knowledge Checklist

完成本部分后，应能够回答：

## Generation Pipeline

* DocTags 是如何生成的？
* DoclingDocument 与 DocTags 有什么关系？
* 为什么现代 VLM 更容易生成结构化文档？

---

## Reading Order

* Reading Order 为什么重要？
* 阅读顺序错误会导致哪些问题？

---

## Structured Representation

* 为什么 LLM 更适合处理结构化文档？
* DocTags 相比 Markdown 增加了哪些关键能力？

---

# Summary

现代 DocTags 的生成流程如下：

```text
PDF
 │
 ▼
Vision-Language Model
 │
 ▼
Layout Understanding
 │
 ▼
Semantic Understanding
 │
 ▼
DoclingDocument
 │
 ▼
DocTags
 │
 ▼
RAG
 │
 ▼
AI Agent
```

DocTags 不仅是文档解析的输出格式，更是连接 **Vision-Language Models、Document AI、RAG 和 AI Agent** 的统一中间表示，为未来构建高质量 Document Intelligence 系统提供了坚实的数据基础。

# DocTags

> **Multimodal Document AI Learning Center**
>
> **Module:** DocTags
>
> **Version:** v3.1
>
> **Part:** 4 / 4
>
> **Last Updated:** July 2026

---

# Part 9. DocTags Ecosystem

截至 2026 年，DocTags 已逐渐成为现代 **Document AI** 开源生态的重要组成部分。

其核心生态如下：

```text
                PDF / Image / Office
                        │
                        ▼
                 Vision-Language Model
                        │
                        ▼
                 DoclingDocument
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
    Markdown          HTML            DocTags
        │               │                │
        └───────────────┼────────────────┘
                        ▼
               RAG / Knowledge Base
                        │
                        ▼
                 AI Agent / LLM
```

DocTags 的定位不是新的文档格式，而是 **AI Native Document Representation（AI 原生文档表示）**，能够作为大型语言模型、RAG 系统和 Agent 的统一输入。

---

# Part 10. Practical Applications

目前 DocTags 已广泛应用于以下场景。

| Application               | Description        |
| ------------------------- | ------------------ |
| Document Parsing          | PDF、DOCX、PPT 等统一解析 |
| Enterprise Knowledge Base | 企业知识库构建            |
| RAG                       | 结构化文档检索            |
| Scientific Literature     | 科研论文解析             |
| Technical Documents       | 技术文档转换             |
| Patent Analysis           | 专利解析               |
| Financial Reports         | 财报分析               |
| AI Agent                  | Agent 的结构化输入       |

相比传统 Markdown，DocTags 能够保留：

* 文档层级
* 页面坐标
* Reading Order
* Provenance
* Element Relationship

因此更适合复杂文档处理。

---

# Part 11. Recommended Technical Resources

## Official Documentation

| Resource                  | URL                                                    |
| ------------------------- | ------------------------------------------------------ |
| Docling Documentation     | https://docling-project.github.io/docling/             |
| Docling 中文文档              | https://docling.cn/docling/                            |
| Docling API Reference     | https://docling-project.github.io/docling/reference/   |
| DoclingDocument Reference | https://docling.cn/docling/reference/docling_document/ |

---

## Official GitHub

| Project          | URL                                                                |
| ---------------- | ------------------------------------------------------------------ |
| Docling          | https://github.com/docling-project/docling                         |
| Docling Examples | https://github.com/docling-project/docling/tree/main/docs/examples |
| Docling Recipes  | https://github.com/docling-project/docling/tree/main/docs/recipes  |

---

## Recommended Papers

### 1. Docling Technical Report (★★★★★)

> Christoph Auer et al.

2024

https://arxiv.org/abs/2408.09869

介绍：

* Docling 架构
* DoclingDocument
* Layout Analysis
* TableFormer
* Export Pipeline

推荐指数：

⭐⭐⭐⭐⭐

---

### 2. Docling: An Efficient Open-Source Toolkit for AI-driven Document Conversion (★★★★★)

2025

https://arxiv.org/abs/2501.17887

重点阅读：

* Unified Representation
* Modular Pipeline
* AI-ready Document Conversion
* LangChain / LlamaIndex Integration

推荐指数：

⭐⭐⭐⭐⭐

---

### 3. SmolDocling (★★★★★)

2025

https://arxiv.org/abs/2503.11576

重点阅读：

* End-to-End Document Conversion
* DocTags Generation
* Compact Vision-Language Model
* Universal Document Markup

推荐指数：

⭐⭐⭐⭐⭐

---

### 4. Advanced Layout Analysis Models for Docling（推荐）

2025

https://arxiv.org/abs/2509.11720

重点阅读：

* 新一代版面分析模型（Heron）
* 布局检测训练方法
* Docling 布局模型演进

推荐指数：

⭐⭐⭐⭐

---

# Part 12. Suggested Laboratory Research

实验室围绕 DocTags 开展以下研究。

## Direction 1

### DocTags Generation

研究目标：

> Vision-Language Model → DocTags

重点内容：

* Prompt Engineering
* Instruction Tuning
* LoRA Fine-tuning
* Structured Generation

---

## Direction 2

### DocTags Quality Evaluation

评价内容：

* Structure Accuracy
* Reading Order
* Hierarchy Recovery
* Semantic Completeness
* Layout Preservation

建议建立：

> **DocTagsBench**

作为统一评测基准。

---

## Direction 3

### DocTags-aware RAG

重点研究：

* Hierarchical Chunking
* Structure-aware Retrieval
* Citation-aware Retrieval
* Figure/Table Retrieval
* Multi-page Retrieval

目标：

提高复杂文档问答质量。

---

## Direction 4

### Agent-ready Documents

研究：

如何利用 DocTags 构建：

* Document Agent
* Research Agent
* Enterprise Knowledge Agent
* Scientific Assistant

重点探索：

* Tool Calling
* Planning
* Memory
* Multi-step Reasoning

---

# Part 13. Recommended Open-source Stack

实验室统一采用如下技术栈。

| Layer                     | Recommended Project       |
| ------------------------- | ------------------------- |
| Vision-Language Model     | Qwen3-VL                  |
| Document Conversion       | Docling                   |
| Structured Representation | DocTags                   |
| Benchmark                 | OmniDocBench              |
| Knowledge Index           | LlamaIndex / LangChain    |
| Vector Database           | Milvus / Qdrant / FAISS   |
| AI Framework              | Hugging Face Transformers |

该技术栈覆盖了文档解析、知识库构建、模型评测和智能体开发的完整流程。

---

# Laboratory Learning Path

建议按照以下路线学习：

```text
Foundation Models
        │
        ▼
Vision-Language Models
        │
        ▼
Document AI
        │
        ▼
Docling
        │
        ▼
DoclingDocument
        │
        ▼
DocTags
        │
        ▼
OmniDocBench
        │
        ▼
RAG
        │
        ▼
Document Agent
        │
        ▼
AI Research Agent
```

---

# Knowledge Checklist

完成本模块后，应能够回答以下问题。

## DocTags Ecosystem

* 为什么 DocTags 能够作为 AI 原生文档表示？
* DoclingDocument 与 DocTags 分别承担什么角色？
* 为什么越来越多 Document AI 系统采用统一文档表示？

---

## Research

* 如何设计 DocTags Generation Pipeline？
* 如何构建 DocTags Benchmark？
* 如何利用 DocTags 构建高质量 RAG？
* DocTags 在 AI Agent 中有哪些应用价值？

---

# Chapter Summary

DocTags 是现代 **Document AI** 从"文档解析工具"走向"统一知识表示"的重要一步。

对于实验室未来研究，建议以：

```text
Qwen3-VL
      │
      ▼
Docling
      │
      ▼
DocTags
      │
      ▼
OmniDocBench
      │
      ▼
RAG
      │
      ▼
AI Agent
```

作为统一技术路线。

---

# Recommended Next Reading

继续学习：

> **benchmarks.md**

重点学习：

* OmniDocBench
* DocLayNet
* PubTabNet
* DocVQA
* OCRBench
* ChartQA
* Document Parsing Evaluation
* Reading Order Evaluation
* Structure-aware Benchmark

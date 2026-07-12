# Document AI

> **Multimodal Document AI Learning Center**
>
> **Module:** Document AI
>
> **Version:** v3.0
>
> **Part:** 1 / 4
>
> **Last Updated:** July 2026

---

# Overview

Document AI（文档智能）是近年来人工智能发展最快的方向之一。

它融合了：

* Computer Vision
* Natural Language Processing
* Multimodal Learning
* Large Language Models
* Vision-Language Models

目标是让计算机能够像人一样：

* 阅读文档
* 理解版面
* 理解表格
* 理解公式
* 理解图像
* 理解文档语义
* 自动完成复杂文档任务

现代 Document AI 已逐渐从 **OCR Pipeline** 演进为 **Foundation Model + VLM + Structured Representation**。

---

# Learning Objectives

完成本章节后，应能够：

* 理解 Document AI 的发展历程
* 理解 LayoutLM 系列模型的设计思想
* 掌握现代 Document Foundation Model
* 为后续学习 DocTags、OmniDocBench、Qwen-VL 打下理论基础

---

# Learning Roadmap

```text
OCR
 │
 ▼
Layout Analysis
 │
 ▼
LayoutLM
 │
 ▼
LayoutLMv2
 │
 ▼
LayoutLMv3
 │
 ▼
DocFormer
 │
 ▼
DiT
 │
 ▼
Modern Document Foundation Models
 │
 ▼
Vision-Language Document AI
```

---

# Reading Strategy

| Priority | Description |
| -------- | ----------- |
| ⭐⭐⭐⭐⭐    | 必须精读        |
| ⭐⭐⭐⭐     | 建议精读        |
| ⭐⭐⭐      | 拓展阅读        |

---

# Part 1. What is Document AI?

传统 OCR 的目标是：

```text
Image
   │
   ▼
Text
```

现代 Document AI 的目标则是：

```text
Document
      │
      ▼
Text
Layout
Tables
Figures
Equations
Reading Order
Structure
Semantics
      │
      ▼
Knowledge
```

因此：

> **Document AI ≠ OCR**

Document AI 更关注：

* 文档结构理解（Layout Understanding）
* 多模态信息融合
* 语义理解
* 下游任务推理

---

# Part 2. Evolution of Document AI

```text
OCR
 │
 ▼
Layout Analysis
 │
 ▼
Layout-aware NLP
 │
 ▼
Document Foundation Models
 │
 ▼
Vision-Language Models
 │
 ▼
Structured Document Representation
 │
 ▼
Document Agent
```

---

# Paper 1

# LayoutLM

**Priority**

⭐⭐⭐⭐⭐

**Authors**

Yiheng Xu et al.

**Conference**

KDD 2020

---

## Official Paper

https://arxiv.org/abs/1912.13318

---

## Official GitHub

Microsoft UniLM

https://github.com/microsoft/unilm/tree/master/layoutlm

---

## Main Contributions

LayoutLM 首次提出：

> **Text + Layout** 联合建模。

除文本 Token 外，还引入：

* Bounding Box
* 2D Position Embedding

使模型能够理解：

文本内容 + 页面布局。

---

## Why Read in 2026

LayoutLM 开创了 **Document Foundation Model** 的研究方向。

后续模型：

* LayoutLMv2
* LayoutLMv3
* LayoutXLM
* DocFormer

均直接继承其设计思想。

---

## Students Should Learn

重点掌握：

* 2D Position Embedding
* Layout-aware Encoding
* Token + Layout Fusion

---

# Paper 2

# LayoutLMv2

**Priority**

⭐⭐⭐⭐⭐

**Conference**

ACL 2021

---

## Official Paper

https://arxiv.org/abs/2012.14740

---

## Official GitHub

https://github.com/microsoft/unilm/tree/master/layoutlmv2

---

## Main Contributions

LayoutLMv2 在 LayoutLM 基础上增加：

* Visual Features
* Cross-modal Attention
* Text–Image Alignment

实现：

> **Text + Layout + Vision**

三模态联合建模。

---

## Why Read

首次真正将视觉特征纳入 Document AI 预训练。

这一思想深刻影响了：

* LayoutLMv3
* DocFormer
* 后续多模态文档模型

---

## Students Should Learn

重点掌握：

* Cross-modal Transformer
* Visual Embedding
* Multi-modal Fusion

---

# Paper 3

# LayoutLMv3

**Priority**

⭐⭐⭐⭐⭐

**Conference**

ACM Multimedia 2022

---

## Official Paper

https://arxiv.org/abs/2204.08387

---

## Official GitHub

Microsoft UniLM

https://github.com/microsoft/unilm/tree/master/layoutlmv3

---

## Main Contributions

LayoutLMv3 使用 **ViT Patch Embedding** 替代 CNN，并统一采用：

* Masked Language Modeling（MLM）
* Masked Image Modeling（MIM）
* Word-Patch Alignment（WPA）

三种预训练目标，实现统一的文本与图像掩码学习。

---

## Why Read in 2026

LayoutLMv3 被广泛认为是经典的 **Document Foundation Model**：

* 不依赖 CNN
* 与 ViT 架构统一
* 同时适用于文本中心和图像中心任务
* 成为现代 Document AI 的重要基线。

---

## Students Should Learn

重点掌握：

* Patch Embedding
* Unified Masking
* Word-Patch Alignment
* Document Pre-training

---

# Knowledge Checklist

完成本部分后，应能够回答：

* OCR 与 Document AI 有什么本质区别？
* 为什么需要 Layout Information？
* LayoutLM 为什么引入二维位置编码？
* LayoutLMv2 为什么加入视觉特征？
* LayoutLMv3 为什么改用 ViT Patch？

---

# Summary

Document AI 第一阶段的发展路线如下：

```text
OCR
 │
 ▼
LayoutLM
 │
 ▼
LayoutLMv2
 │
 ▼
LayoutLMv3
```

LayoutLM 系列建立了现代 **Document Foundation Model** 的基础框架，也为后续 **DocFormer、DiT、Docling、MinerU、Qwen2.5-VL** 等模型的发展奠定了理论基础。


# Document AI

> **Multimodal Document AI Learning Center**
>
> **Module:** Document AI
>
> **Version:** v3.0
>
> **Part:** 2 / 4
>
> **Last Updated:** July 2026

---

# Part 3. Document Foundation Models

随着 Transformer 在 NLP 和计算机视觉中的成功，研究者开始探索：

> **能否构建专门面向文档的 Foundation Model？**

这一阶段诞生了一系列具有代表性的模型：

* DocFormer
* DiT
* LayoutXLM
* 后续的 Vision-Language Document Models

这些模型逐渐将研究重点从 **OCR** 转向 **Document Understanding**。

---

# Paper 4

# DocFormer

**Priority**

⭐⭐⭐⭐⭐

**Conference**

ICCV 2021

**Authors**

Srikar Appalaraju et al.

---

## Official Paper

ICCV Open Access

https://openaccess.thecvf.com/content/ICCV2021/html/Appalaraju_DocFormer_End-to-End_Transformer_for_Document_Understanding_ICCV_2021_paper.html

arXiv

https://arxiv.org/abs/2106.11539

---

## Official GitHub

https://github.com/shabie/docformer

---

## Main Contributions

DocFormer 提出了真正意义上的：

> **End-to-End Multi-modal Transformer**

统一建模三种信息：

* Text
* Vision
* Spatial Layout

核心创新包括：

* Multi-modal Self-Attention
* Shared Spatial Embedding
* Unified Document Representation

相比 LayoutLM 系列，DocFormer 更加强调多模态特征之间的深度融合。

---

## Why Read in 2026

DocFormer 是现代 **Visual Document Understanding（VDU）** 的经典工作。

其设计思想直接影响了后续大量文档基础模型，并推动了 Document AI 从 OCR 向统一 Transformer 架构演进。

---

## Students Should Learn

重点掌握：

* Multi-modal Self-Attention
* Spatial Embedding
* Vision + Text Fusion
* End-to-End Document Understanding

---

## Laboratory Relevance

★★★★★

理解 DocFormer 有助于后续学习：

* Qwen-VL
* OmniDocBench
* DocTags

尤其是：

> Layout + Vision + Text 的统一表示。

---

# Paper 5

# DiT (Document Image Transformer)

**Priority**

⭐⭐⭐⭐⭐

**Conference**

ECCV 2022

**Authors**

Junlong Li et al.

---

## Official Paper

https://arxiv.org/abs/2203.02378

Official Project

https://aka.ms/msdit

---

## Main Contributions

DiT 首次提出：

> **Document Image Transformer**

核心思想：

将文档图像作为视觉对象进行自监督预训练，而不是依赖 OCR 文本。

采用：

* Vision Transformer
* Self-supervised Learning
* Masked Image Modeling

实现统一的视觉文档预训练。

---

## Why Read in 2026

DiT 证明：

对于大量任务，

> **仅使用文档图像即可学习优秀的文档表示。**

特别适用于：

* Document Classification
* Layout Analysis
* Table Detection
* OCR Pre-processing

---

## Students Should Learn

重点掌握：

* Self-supervised Learning
* Document Image Representation
* Vision-only Pre-training
* MAE 思想在文档中的应用

---

## Laboratory Relevance

★★★★★

DiT 为：

* Document Vision Encoder
* OCR-free Parsing
* VLM Vision Backbone

提供了重要参考。

---

# Paper 6

# LayoutXLM

**Priority**

⭐⭐⭐⭐

**Organization**

Microsoft

---

## Official Paper

https://arxiv.org/abs/2104.08836

---

## Official GitHub

https://github.com/microsoft/unilm

---

## Main Contributions

LayoutXLM 将 LayoutLM 扩展到：

> **多语言 Document AI**

支持：

* 中文
* 英文
* 日文
* 韩文
* 多种欧洲语言

统一文档预训练。

---

## Why Read

Document AI 正快速向全球化发展。

LayoutXLM 是：

多语言 Document Foundation Model

的重要代表。

---

## Students Should Learn

重点掌握：

* Multilingual Pre-training
* Cross-language Document Understanding

---

# Part 4. Evolution of Document Foundation Models

```text id="2wfh2p"
LayoutLM
      │
      ▼
LayoutLMv2
      │
      ▼
LayoutLMv3
      │
      ▼
DocFormer
      │
      ▼
DiT
      │
      ▼
Vision-Language Models
      │
      ▼
Modern Document AI
```

---

# Model Comparison

| Model      | Text | Vision | Layout | Self-Supervised | Multi-modal |
| ---------- | :--: | :----: | :----: | :-------------: | :---------: |
| LayoutLM   |   ✓  |    ✗   |    ✓   |        ✗        |      ✗      |
| LayoutLMv2 |   ✓  |    ✓   |    ✓   |        ✓        |      ✓      |
| LayoutLMv3 |   ✓  |    ✓   |    ✓   |        ✓        |      ✓      |
| DocFormer  |   ✓  |    ✓   |    ✓   |        ✓        |      ✓      |
| DiT        |   ✗  |    ✓   |    ✗   |        ✓        |      ✗      |

---

# Knowledge Checklist

完成本部分后，应能够回答：

### DocFormer

* 为什么需要 Multi-modal Self-Attention？
* Shared Spatial Embedding 有什么作用？

---

### DiT

* 为什么 DiT 不依赖 OCR？
* Vision-only Pre-training 有哪些优势？

---

### Document Foundation Models

* LayoutLM 与 DocFormer 的区别？
* DocFormer 与 DiT 的研究目标有什么不同？
* 哪类模型更适合作为现代 VLM 的视觉基础？

---

# Summary

Document Foundation Models 的发展路线如下：

```text id="qv0eop"
Layout-aware Models
        │
        ▼
Multi-modal Models
        │
        ▼
Document Foundation Models
        │
        ▼
Vision-Language Models
```

完成本部分后，应理解：

现代 **Document AI** 已不再局限于 OCR，而是逐步发展为融合 **视觉、文本、布局和语义** 的统一 Foundation Model，为后续 **Docling、MinerU、OmniDocBench、Qwen2.5-VL、Qwen3-VL** 等系统奠定了理论基础。


# Document AI

> **Multimodal Document AI Learning Center**
>
> **Module:** Document AI
>
> **Version:** v3.0
>
> **Part:** 3 / 4
>
> **Last Updated:** July 2026

---

# Part 5. Modern Open-source Document AI Ecosystem

近年来，Document AI 的研究重点已经逐渐从单一模型转向完整的开源生态。

目前国际上影响力最大的三个项目分别是：

* Docling（IBM）
* MinerU（OpenDataLab）
* OmniDocBench（OpenDataLab）

它们分别代表：

```text
PDF
 │
 ▼
Docling / MinerU
 │
 ▼
Markdown / JSON
 │
 ▼
OmniDocBench Evaluation
 │
 ▼
Large Language Models
 │
 ▼
RAG / AI Agent
```

---

# Project 1

# Docling

**Priority**

⭐⭐⭐⭐⭐

**Organization**

IBM Research

---

## Official Website

https://docling-project.github.io/docling/

---

## Official GitHub

https://github.com/docling-project/docling

---

## Main Features

Docling 是 IBM 推出的现代文档解析框架，支持：

* PDF
* Word
* PowerPoint
* HTML
* Excel
* Markdown

统一转换为：

* Markdown
* JSON
* Structured Document

---

## Core Advantages

* 多格式统一解析
* 高质量 Markdown 输出
* 保留文档层级结构
* 支持表格、图片、公式
* 与 RAG 框架深度集成

---

## Why Read in 2026

Docling 已成为当前最受欢迎的开源文档转换框架之一。

广泛应用于：

* RAG
* Knowledge Base
* Enterprise AI
* Document QA

也是大量 AI Agent 项目的文档预处理工具。

---

## Students Should Learn

重点掌握：

* PDF → Markdown
* Structured Document
* Hierarchical Document Parsing
* Document Chunking

---

## Laboratory Relevance

★★★★★

Docling 可作为：

实验室所有 PDF 数据预处理工具。

---

# Project 2

# MinerU

**Priority**

⭐⭐⭐⭐⭐

**Organization**

OpenDataLab

---

## Official Paper

https://arxiv.org/abs/2409.18839

---

## Official GitHub

https://github.com/opendatalab/MinerU

---

## Main Contributions

MinerU 是目前最具影响力的开源 Document Parsing 系统之一。

目标：

> **高精度 PDF 内容提取。**

支持：

* OCR
* Layout Analysis
* Formula Recognition
* Table Parsing
* Reading Order
* Markdown Export

采用：

* PDF-Extract-Kit
* Vision-Language Models
* 精细化后处理

形成完整解析流程。

---

## Why Read in 2026

MinerU 已成为 Document AI 的重要开源基线。

最新版本持续刷新 OmniDocBench 排行榜，并不断优化复杂表格、公式和多栏文档解析能力。

---

## Students Should Learn

重点掌握：

* PDF Parsing Pipeline
* OCR-free Parsing
* Reading Order
* Markdown Generation
* Structured Output

---

## Laboratory Relevance

★★★★★

建议每位研究生：

至少完整实践一次 MinerU。

后续：

Qwen-VL

↓

DocTags

↓

OmniDocBench

均可直接建立在 MinerU 输出基础上。

---

# Benchmark

# OmniDocBench

**Priority**

⭐⭐⭐⭐⭐

**Conference**

CVPR 2025

---

## Official Paper

https://arxiv.org/abs/2412.07626

---

## Official GitHub

https://github.com/opendatalab/OmniDocBench

---

## Main Contributions

OmniDocBench 是目前国际上最全面的文档解析评测基准之一。

特点：

* 多类型文档
* 多语言
* 阅读顺序
* 公式
* 表格
* 版面分析
* End-to-End Evaluation

支持：

* Markdown
* JSON
* OCR
* Layout Detection

等多层次评测。

---

## Supported Metrics

主要指标包括：

* Edit Distance
* TEDS（Table）
* CDM（Formula）
* Reading Order
* Layout mAP
* BLEU
* METEOR

能够全面评价 Document Parsing 系统性能。

---

## Why Read in 2026

OmniDocBench 已成为 Document Parsing 领域的重要公开基准。

主流模型（如 MinerU、GLM-OCR、PaddleOCR-VL、Qwen3-VL 等）均在该基准上进行公开评测和比较。

---

## Students Should Learn

重点掌握：

* 数据集结构
* Annotation Format
* Markdown Evaluation
* End-to-End Evaluation
* Benchmark Reproducibility

---

## Laboratory Relevance

★★★★★

建议实验室所有模型统一采用：

> **OmniDocBench**

作为标准评测平台。

---

# Project Comparison

| Project      | Type                | Primary Function               | Recommended Use |
| ------------ | ------------------- | ------------------------------ | --------------- |
| Docling      | Document Conversion | PDF → Markdown / JSON          | 数据预处理           |
| MinerU       | Document Parsing    | OCR + Layout + Table + Formula | 文档解析            |
| OmniDocBench | Benchmark           | 模型评测                           | 实验评估            |

---

# Knowledge Checklist

完成本部分后，应能够回答：

## Docling

* 为什么 Docling 更适合作为 RAG 数据预处理？
* Markdown 与 JSON 输出各有什么优势？

---

## MinerU

* MinerU 的整体解析流程包含哪些模块？
* 为什么 Reading Order 很重要？

---

## OmniDocBench

* 为什么需要统一 Benchmark？
* TEDS、CDM、Edit Distance 分别评价什么？
* 如何利用 OmniDocBench 比较不同模型？

---

# Summary

现代 Document AI 开源生态已经形成如下技术路线：

```text
PDF
 │
 ▼
Docling
 │
 ▼
MinerU
 │
 ▼
Structured Markdown / JSON
 │
 ▼
OmniDocBench
 │
 ▼
Qwen-VL
 │
 ▼
DocTags
 │
 ▼
Document Agent
```

完成本部分后，学生应能够熟悉当前国际主流的 Document AI 开源工具链，并具备开展文档解析、模型评测和科研实验的基础能力。


# Document AI

> **Multimodal Document AI Learning Center**
>
> **Module:** Document AI
>
> **Version:** v3.0
>
> **Part:** 4 / 4
>
> **Last Updated:** July 2026

---

# Part 6. Vision-Language Document AI

近年来，Document AI 正在经历一次重要变革：

> **从 Pipeline-based OCR 向 End-to-End Vision-Language Model（VLM）演进。**

传统流程：

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

现代流程：

```text
PDF / Image
       │
       ▼
Vision-Language Model
       │
       ▼
Markdown
JSON
DocTags
Structured Document
```

现代模型不再将 OCR、版面分析、表格识别等作为独立模块，而是利用统一的多模态模型直接完成整个文档理解任务。

---

# Modern Vision-Language Document Models

近年来具有代表性的模型包括：

| Model        | Organization | Characteristics                     |
| ------------ | ------------ | ----------------------------------- |
| Qwen2.5-VL   | Alibaba      | 通用 Vision-Language Foundation Model |
| Qwen3-VL     | Alibaba      | 更强文档理解与推理能力                         |
| InternVL 3.x | OpenGVLab    | 高性能开源 VLM                           |
| PaddleOCR-VL | PaddlePaddle | OCR 与 VLM 深度融合                      |
| GLM-OCR      | Zhipu AI     | 端到端文档解析                             |
| MinerU2-VLM  | OpenDataLab  | 文档解析专用 VLM                          |

这些模型均已在 OmniDocBench 上进行了公开评测，并持续刷新 Document AI 的性能基线。

---

# Why Vision-Language Models Matter

现代 VLM 具有以下优势：

* OCR-free Parsing
* Unified Understanding
* Better Reading Order
* Complex Table Understanding
* Formula Recognition
* Chart Understanding
* Multi-page Reasoning

相比传统 Pipeline：

> **结构更简单、泛化能力更强、维护成本更低。**

---

# Part 7. Structured Document Representation

Document AI 的最终目标不是：

```text
PDF
    │
    ▼
Plain Text
```

而是：

```text
PDF
   │
   ▼
Structured Document
   │
   ▼
Semantic Representation
   │
   ▼
Knowledge Graph
   │
   ▼
AI Agent
```

因此，现代研究越来越关注：

* Document Schema
* Structured Markdown
* JSON Document
* XML
* DoclingDocument
* **DocTags**

其中，Docling 已支持将文档导出为 **DocTags**、Markdown、JSON 等统一格式，为后续 AI Agent 和 RAG 提供标准化输入。

---

# Focus Topic

# DocTags

**Research Status**

⭐⭐⭐⭐⭐

---

## Why DocTags?

传统 Markdown：

```markdown
# Title

This is a table.

| A | B |
```

只能描述文本。

但是：

无法表达：

* 页面结构
* Reading Order
* Figure
* Caption
* Formula
* Region
* Semantic Block

因此：

越来越多研究开始关注：

> **Document Semantic Representation**

DocTags 正是这一方向的重要实践之一，可作为文档解析后的统一语义表示。

---

## Laboratory Research

实验室未来建议重点研究：

```text
PDF
 │
 ▼
Vision-Language Model
 │
 ▼
DocTags
 │
 ▼
Reasoning
 │
 ▼
Document Agent
 │
 ▼
Research Agent
```

建议博士研究围绕：

* DocTags Schema
* DocTags Generation
* DocTags Benchmark
* DocTags Agent

展开系统研究。

---

# Part 8. Future Trends

未来 3～5 年，Document AI 将重点发展：

| Direction                           | Importance |
| ----------------------------------- | ---------- |
| Vision-Language Models              | ⭐⭐⭐⭐⭐      |
| OCR-free Parsing                    | ⭐⭐⭐⭐⭐      |
| Structured Representation           | ⭐⭐⭐⭐⭐      |
| Long-context Document Understanding | ⭐⭐⭐⭐⭐      |
| RAG-ready Documents                 | ⭐⭐⭐⭐⭐      |
| Document Agent                      | ⭐⭐⭐⭐⭐      |
| AI Research Agent                   | ⭐⭐⭐⭐⭐      |

未来 Document AI 将不仅负责：

> **解析文档（Parsing）**

更重要的是：

> **理解文档（Understanding）**

以及：

> **利用文档（Reasoning & Acting）**

---

# Laboratory Roadmap

建议实验室整体技术路线如下：

```text
Foundation Models
          │
          ▼
Vision Foundation Models
          │
          ▼
Vision-Language Models
          │
          ▼
Document AI
          │
          ▼
Docling / MinerU
          │
          ▼
OmniDocBench
          │
          ▼
DocTags
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

这一技术路线与当前国际开源生态的发展趋势保持一致，也便于逐步演进到科研 Agent 系统。

---

# Knowledge Checklist

完成本模块后，应能够回答：

## Vision-Language Models

* 为什么 VLM 能够替代传统 OCR Pipeline？
* OCR-free Parsing 的优势是什么？
* End-to-End Parsing 与模块化 Pipeline 有什么区别？

---

## Structured Representation

* 为什么需要结构化文档表示？
* Markdown、JSON、DocTags 分别适用于哪些场景？
* 为什么 AI Agent 更适合处理结构化文档？

---

## Laboratory Research

思考以下问题：

1. 如何利用 Qwen3-VL 自动生成高质量 DocTags？
2. 如何设计适用于学术论文、法律文书、教材等不同场景的 DocTags Schema？
3. 如何基于 OmniDocBench 构建 DocTags Benchmark？
4. 如何利用 DocTags 构建面向科研的 AI Agent？

---

# Chapter Summary

Document AI 的整体发展路线如下：

```text
OCR
 │
 ▼
Layout Analysis
 │
 ▼
LayoutLM Series
 │
 ▼
Document Foundation Models
 │
 ▼
Vision-Language Models
 │
 ▼
Docling / MinerU
 │
 ▼
OmniDocBench
 │
 ▼
DocTags
 │
 ▼
Document Agent
 │
 ▼
AI Research Agent
```

至此，**Document AI** 学习模块结束。

---

# Recommended Next Reading

继续学习：

> **vlm.md**

重点阅读：

* LLaVA
* Florence-2
* Qwen2.5-VL
* Qwen3-VL
* InternVL
* SmolDocling

进一步理解现代 **Vision-Language Model** 如何成为 Document AI 的核心基础模型。



# Vision-Language Models (VLM)

> **Multimodal Document AI Learning Center**
>
> **Module:** Vision-Language Models (VLM)
>
> **Version:** v3.0
>
> **Part:** 1 / 4
>
> **Last Updated:** July 2026

---

# Overview

Vision-Language Model（VLM）是当前多模态人工智能最重要的发展方向之一。

VLM 的目标是：

> **让大型语言模型真正理解图像，并能够基于视觉信息进行推理、分析和交互。**

近年来，随着 CLIP、BLIP、LLaVA、Qwen-VL、InternVL、Florence 等模型的发展，VLM 已成为现代 AI Agent 和 Document AI 的核心基础模型。

---

# Learning Objectives

完成本章节后，应能够：

* 理解 Vision-Language Model 的基本原理
* 理解 VLM 与传统 OCR、CNN 模型的区别
* 掌握现代 VLM 的基本架构
* 为后续学习 Qwen2.5-VL、Qwen3-VL、SmolDocling 打下理论基础

---

# Learning Roadmap

```text
CLIP
 │
 ▼
BLIP
 │
 ▼
BLIP-2
 │
 ▼
LLaVA
 │
 ▼
Florence-2
 │
 ▼
Qwen2-VL
 │
 ▼
Qwen2.5-VL
 │
 ▼
Modern Vision-Language Models
```

---

# Part 1. What is a Vision-Language Model?

传统计算机视觉模型：

```text
Image
  │
  ▼
Classification
Detection
Segmentation
```

现代 Vision-Language Model：

```text
Image
     │
     ▼
Vision Encoder
     │
     ▼
Large Language Model
     │
     ▼
Reasoning
Conversation
Grounding
Generation
```

VLM 不仅能够识别图像内容，还能够：

* 回答问题（VQA）
* 理解复杂文档
* 理解图表
* 阅读网页
* 分析界面
* 调用工具（Tool Use）

---

# Why Vision-Language Models Matter

现代 VLM 已成为：

* Multimodal AI
* Document AI
* AI Agent
* Robotics
* Autonomous Driving
* Medical AI

等领域的重要基础模型。

尤其在：

* Document Parsing
* OCR-free Parsing
* Chart Understanding
* Scientific Figure Understanding

方面表现突出。

---

# Paper 1

# LLaVA

**Priority**

⭐⭐⭐⭐⭐

**Conference**

NeurIPS 2023

**Organization**

University of Wisconsin-Madison / Microsoft Research

---

## Official Paper

https://arxiv.org/abs/2304.08485

---

## Official GitHub

https://github.com/haotian-liu/LLaVA

---

## Main Contributions

LLaVA（Large Language and Vision Assistant）首次证明：

> **利用轻量级视觉投影层，即可连接 Vision Encoder 与 LLM。**

典型架构：

```text
Image
   │
   ▼
CLIP Vision Encoder
   │
   ▼
Projection Layer
   │
   ▼
Vicuna / LLM
```

这种设计大幅降低了训练成本，并推动了开源 VLM 的快速发展。

---

## Why Read in 2026

LLaVA 是现代开源 VLM 的重要起点。

大量后续模型都借鉴了其设计思想，包括：

* LLaVA-NeXT
* MiniGPT-4
* InternVL（部分设计）
* Qwen-VL（训练流程具有相似思想）

---

## Students Should Learn

重点掌握：

* Vision Encoder
* Projection Layer
* Instruction Tuning
* Visual Conversation

---

## Laboratory Relevance

★★★★★

理解 LLaVA，有助于理解：

* 多模态对话
* 图像问答
* 文档问答

---

# Paper 2

# Florence-2

**Priority**

⭐⭐⭐⭐⭐

**Organization**

Microsoft Research

**Year**

2024

---

## Official Paper

https://arxiv.org/abs/2311.06242

---

## Official GitHub

https://github.com/microsoft/Florence-2

---

## Main Contributions

Florence-2 提出了：

> **Unified Prompt-based Vision Model**

通过统一 Prompt，将不同视觉任务统一到同一个模型中。

支持：

* Captioning
* OCR
* Object Detection
* Grounding
* Segmentation
* Dense Region Captioning

---

## Why Read in 2026

Florence-2 是目前最重要的轻量级 Vision Foundation Model 之一。

具有：

* 模型小
* 推理速度快
* 支持任务丰富
* 易于部署

等特点，非常适合作为科研实验和教学平台。

---

## Students Should Learn

重点掌握：

* Prompt-based Vision Tasks
* Unified Vision Modeling
* Dense Caption
* Visual Grounding

---

## Laboratory Relevance

★★★★★

Florence-2 非常适合作为：

* Document AI Baseline
* OCR Baseline
* VLM 入门实验模型

---

# Knowledge Checklist

完成本部分后，应能够回答：

### Vision-Language Models

* 为什么 VLM 能够理解图像？
* Vision Encoder 的作用是什么？
* Projection Layer 为什么重要？

---

### LLaVA

* 为什么只需要训练 Projection Layer？
* LLaVA 为什么推动了开源 VLM 的发展？

---

### Florence-2

* 什么是 Unified Prompt？
* 为什么 Florence-2 可以完成多种视觉任务？

---

# Summary

现代 Vision-Language Model 的发展路线如下：

```text
CLIP
 │
 ▼
BLIP
 │
 ▼
BLIP-2
 │
 ▼
LLaVA
 │
 ▼
Florence-2
 │
 ▼
Modern Open-source VLM
```

完成本部分后，应理解现代 VLM 的基本架构，并为下一部分 **InternVL、Qwen2-VL、Qwen2.5-VL** 的学习做好准备。

# Vision-Language Models (VLM)

> **Multimodal Document AI Learning Center**
>
> **Module:** Vision-Language Models (VLM)
>
> **Version:** v3.0
>
> **Part:** 2 / 4
>
> **Last Updated:** July 2026

---

# Part 2. Modern Open-source Vision-Language Models

自 2024 年以来，开源 VLM 进入快速发展阶段。

代表性模型包括：

* InternVL
* Qwen2-VL
* Qwen2.5-VL

这些模型不仅具备图像理解能力，还支持：

* Document Parsing
* OCR-free Understanding
* Chart Reasoning
* GUI Understanding
* Video Understanding
* Agent Tool Use

---

# Paper 3

# InternVL

**Priority**

⭐⭐⭐⭐⭐

**Organization**

OpenGVLab

**Conference**

CVPR 2024（InternVL 1.0）

---

## Official Paper

https://arxiv.org/abs/2312.14238

CVPR 2024

https://openaccess.thecvf.com/content/CVPR2024/html/Chen_InternVL_Scaling_up_Vision_Foundation_Models_and_Aligning_for_Generic_CVPR_2024_paper.html

---

## Official Website

https://internvl.github.io/

---

## Official GitHub

https://github.com/OpenGVLab/InternVL

---

## Main Contributions

InternVL 提出了：

> **大规模 Vision Foundation Model + LLM Alignment**

核心特点：

* 大规模 Vision Encoder
* Progressive Scaling
* 高质量多模态数据
* 多任务统一训练

形成完整的 InternVL 系列模型。

---

## Why Read in 2026

InternVL 已成为最具代表性的开源 VLM 之一。

InternVL 2.5 在：

* Document Understanding
* OCR
* MMMU
* MathVista
* ChartQA

等多个基准上达到国际领先水平，并强调 **Vision Encoder、数据质量和 Test-time Scaling** 对性能的重要影响。

---

## Students Should Learn

重点掌握：

* Progressive Scaling
* Vision Encoder
* Multimodal Alignment
* Instruction Tuning
* Test-time Scaling

---

## Laboratory Relevance

★★★★★

InternVL 是研究：

* 多模态理解
* 文档理解
* 高性能 Vision Encoder

的重要参考模型。

---

# Paper 4

# Qwen2-VL

**Priority**

⭐⭐⭐⭐⭐

**Organization**

Alibaba Qwen Team

**Year**

2024

---

## Official Paper

https://arxiv.org/abs/2409.12191

---

## Official GitHub

https://github.com/QwenLM/Qwen2-VL

---

## Main Contributions

Qwen2-VL 提出了两项关键创新：

* **Naive Dynamic Resolution**
* **Multimodal Rotary Position Embedding（M-RoPE）**

实现：

* 任意分辨率图像输入
* 图片与视频统一建模
* 更好的 OCR
* 更好的文档理解

---

## Why Read

Qwen2-VL 首次证明：

> **动态分辨率 Vision Encoder**

能够显著提升：

* Document AI
* OCR
* Chart Understanding

尤其适合复杂 PDF 与高分辨率文档解析。

---

## Students Should Learn

重点掌握：

* Dynamic Resolution
* M-RoPE
* Image Tokenization
* Vision Encoder Scaling

---

## Laboratory Relevance

★★★★★

Qwen2-VL 是：

实验室开展

* OmniDocBench
* DocTags
* PDF Parsing

研究的重要基线模型。

---

# Paper 5

# Qwen2.5-VL

**Priority**

⭐⭐⭐⭐⭐

**Organization**

Alibaba Qwen Team

**Year**

2025

---

## Official Technical Report

https://arxiv.org/abs/2502.13923

---

## Official Blog

https://qwenlm.github.io/blog/qwen2.5-vl/

---

## Official GitHub

https://github.com/QwenLM/Qwen2.5-VL

---

## Main Contributions

Qwen2.5-VL 在 Qwen2-VL 基础上进一步增强：

* Dynamic Resolution ViT
* Window Attention
* 更强文档解析能力
* 更精准目标定位
* 更长视频理解
* GUI Agent 能力

同时支持：

* Bounding Box
* Point Grounding
* Structured Document Parsing
* Tool Use

---

## Why Read in 2026

Qwen2.5-VL 是目前最优秀的开源通用 VLM 之一。

尤其在：

* PDF
* Table
* Formula
* Layout
* Chart
* Scientific Figure

等任务表现突出，并在官方技术报告中重点展示了文档解析、图表理解和 GUI Agent 能力。

---

## Students Should Learn

重点掌握：

* Dynamic Resolution ViT
* Window Attention
* Structured Parsing
* Visual Grounding
* Tool Use
* GUI Agent

---

## Laboratory Relevance

★★★★★

实验室建议：

> **所有新入学研究生应首先熟悉 Qwen2.5-VL。**

建议完成：

* 图片理解
* PDF 理解
* OmniDocBench Evaluation
* DocTags Generation

四个基础实验。

---

# Model Comparison

| Model      |         Vision Encoder         | Dynamic Resolution | Document AI | Video | Agent |
| ---------- | :----------------------------: | :----------------: | :---------: | :---: | :---: |
| LLaVA      |              CLIP              |          ✗         |     ★★★     |   ✗   |   ★★  |
| Florence-2 |            Florence            |          ✗         |     ★★★★    |   ✗   |  ★★★  |
| InternVL   |            InternViT           |          ✓         |    ★★★★★    |   ✓   |  ★★★★ |
| Qwen2-VL   |           Dynamic ViT          |          ✓         |    ★★★★★    |   ✓   |  ★★★★ |
| Qwen2.5-VL | Dynamic ViT + Window Attention |          ✓         |    ★★★★★    | ★★★★★ | ★★★★★ |

---

# Knowledge Checklist

完成本部分后，应能够回答：

### InternVL

* Progressive Scaling 是什么？
* 为什么 Vision Encoder 越大效果越好？

---

### Qwen2-VL

* 什么是 Dynamic Resolution？
* M-RoPE 为什么适合图文混合输入？

---

### Qwen2.5-VL

* Window Attention 如何降低计算开销？
* 为什么 Qwen2.5-VL 特别适合复杂文档解析？
* GUI Agent 与传统 VLM 有什么区别？

---

# Summary

现代开源 Vision-Language Models 的发展路线如下：

```text
LLaVA
   │
   ▼
Florence-2
   │
   ▼
InternVL
   │
   ▼
Qwen2-VL
   │
   ▼
Qwen2.5-VL
   │
   ▼
Modern Multimodal Agent
```

完成本部分后，应能够理解当前国际主流开源 VLM 的核心架构，并能够为后续 **Qwen3-VL、SmolDocling、Document Agent** 等研究做好准备。

# Vision-Language Models (VLM)

> **Multimodal Document AI Learning Center**
>
> **Module:** Vision-Language Models (VLM)
>
> **Version:** v3.0
>
> **Part:** 3 / 4
>
> **Last Updated:** July 2026

---

# Part 3. Next-generation Vision-Language Models

2025 年以后，Vision-Language Models 已进入新的发展阶段。

研究重点由：

> **Image Understanding**

逐渐发展为：

> **Reasoning + Agent + Long Context + Tool Use**

这一阶段的代表模型包括：

* Qwen3-VL
* Kimi-VL
* Agent-oriented VLM

---

# Paper 6

# Qwen3-VL

**Priority**

⭐⭐⭐⭐⭐

**Organization**

Alibaba Qwen Team

**Year**

2025

---

## Official Paper

https://arxiv.org/abs/2511.21631

---

## Official GitHub

https://github.com/QwenLM/Qwen3-VL

---

## Main Contributions

Qwen3-VL 是目前 Qwen 系列最新一代 Vision-Language Foundation Model。

相比 Qwen2.5-VL，进一步引入：

* Interleaved-MRoPE
* DeepStack Vision Fusion
* Text-based Time Alignment
* Native 256K Multimodal Context
* Dense + MoE 双架构

支持：

* Image
* Document
* Video
* GUI
* Agent

统一理解。

---

## Core Innovations

### Interleaved-MRoPE

增强空间与时间位置编码。

提高：

* 长文档理解
* 视频理解
* 多图片推理

---

### DeepStack

融合多层 Vision Transformer 特征。

优势：

* 更好的细粒度视觉表示
* 更精准 OCR
* 更好的 Document Parsing

---

### Long Context

原生支持：

**256K Context**

能够完成：

* 长论文阅读
* 多页 PDF 理解
* 长视频分析

无需复杂切片。

---

## Why Read in 2026

Qwen3-VL 已成为目前最强大的开源 Vision-Language Models 之一。

重点强化：

* Document AI
* GUI Agent
* Visual Coding
* Tool Use
* Long-context Reasoning

也是未来多模态 Agent 的重要基础模型。

---

## Students Should Learn

重点掌握：

* DeepStack
* Interleaved-MRoPE
* Long Context
* MoE Architecture
* Visual Agent

---

## Laboratory Relevance

★★★★★

建议作为实验室：

> **第一推荐 VLM。**

重点研究：

* DocTags Generation
* OmniDocBench
* Scientific Paper Parsing
* AI Research Agent

---

# Paper 7

# Kimi-VL

**Priority**

⭐⭐⭐⭐⭐

**Organization**

Moonshot AI

**Year**

2025

---

## Official Paper

https://arxiv.org/abs/2504.07491

---

## Official GitHub

https://github.com/MoonshotAI/Kimi-VL

---

## Main Contributions

Kimi-VL 提出了：

> **高效 MoE Vision-Language Model**

主要特点：

* MoonViT Vision Encoder
* Mixture of Experts (MoE)
* Long Context（128K）
* Long Chain-of-Thought
* Visual Agent

激活参数仅约 2.8B，即可达到高水平多模态性能。

---

## Why Read

Kimi-VL 展示了：

> **小计算量 + 高性能**

的发展方向。

在：

* OCR
* Document QA
* GUI
* Math Reasoning
* Long Video

等任务均表现优秀。

---

## Students Should Learn

重点掌握：

* MoE
* Long CoT
* MoonViT
* Efficient VLM

---

## Laboratory Relevance

★★★★★

对于：

实验室小规模 GPU

具有重要参考价值。

---

# Modern Vision-Language Trends

目前 VLM 正快速向以下方向发展：

| Direction         | Importance |
| ----------------- | ---------- |
| Long Context      | ⭐⭐⭐⭐⭐      |
| Vision Agent      | ⭐⭐⭐⭐⭐      |
| Tool Use          | ⭐⭐⭐⭐⭐      |
| GUI Understanding | ⭐⭐⭐⭐⭐      |
| OCR-free Parsing  | ⭐⭐⭐⭐⭐      |
| Visual Coding     | ⭐⭐⭐⭐       |
| MoE               | ⭐⭐⭐⭐⭐      |

---

# From VLM to Agent

现代 VLM 已不再只是：

```text id="a17d2m"
Image
 │
 ▼
Caption
```

而是：

```text id="x38vfp"
Image
 │
 ▼
Understanding
 │
 ▼
Reasoning
 │
 ▼
Planning
 │
 ▼
Tool Use
 │
 ▼
AI Agent
```

这也是当前国际多模态大模型的重要发展方向。

---

# Model Comparison

| Model      | Long Context | Document AI | GUI Agent | Tool Use | MoE |
| ---------- | :----------: | :---------: | :-------: | :------: | :-: |
| LLaVA      |       ✗      |     ★★★     |     ★     |     ★    |  ✗  |
| Florence-2 |       ✗      |     ★★★★    |     ★★    |    ★★    |  ✗  |
| InternVL   |       ✓      |    ★★★★★    |    ★★★    |    ★★★   |  ✗  |
| Qwen2.5-VL |       ✓      |    ★★★★★    |   ★★★★★   |   ★★★★★  |  ✗  |
| Qwen3-VL   |     ★★★★★    |    ★★★★★    |   ★★★★★   |   ★★★★★  |  ✓  |
| Kimi-VL    |     ★★★★★    |    ★★★★★    |   ★★★★★   |   ★★★★★  |  ✓  |

---

# Knowledge Checklist

完成本部分后，应能够回答：

## Qwen3-VL

* DeepStack 为什么能够提升视觉理解？
* Interleaved-MRoPE 与 M-RoPE 有什么区别？
* 为什么 256K Context 对 Document AI 很重要？

---

## Kimi-VL

* 为什么采用 MoE？
* Long Chain-of-Thought 如何增强视觉推理？
* MoonViT 有哪些优势？

---

## Modern VLM

* 为什么现代 VLM 正向 Agent 演进？
* Tool Use 与传统 VQA 有什么区别？
* GUI Agent 为什么成为新的研究热点？

---

# Summary

新一代 Vision-Language Models 的发展路线如下：

```text
CLIP
 │
 ▼
BLIP
 │
 ▼
LLaVA
 │
 ▼
InternVL
 │
 ▼
Qwen2.5-VL
 │
 ▼
Qwen3-VL
 │
 ▼
Kimi-VL
 │
 ▼
Vision Agent
 │
 ▼
Multimodal AI Agent
```

完成本部分后，应理解现代 VLM 已从单纯的视觉理解模型，发展为集 **视觉感知、语言理解、推理、工具调用和自主决策** 于一体的多模态智能系统，为构建 **Document AI Agent** 和 **AI Research Agent** 奠定基础。

# Vision-Language Models (VLM)

> **Multimodal Document AI Learning Center**
>
> **Module:** Vision-Language Models (VLM)
>
> **Version:** v3.0
>
> **Part:** 4 / 4
>
> **Last Updated:** July 2026

---

# Part 4. Modern Vision-Language AI Ecosystem

经过近三年的快速发展，Vision-Language Models（VLM）已经从单一模型演进为完整的开源生态。

目前国际主流技术路线如下：

```text
Foundation Models
        │
        ▼
Vision Encoder
        │
        ▼
Vision-Language Models
        │
        ▼
Document AI
        │
        ▼
GUI Agent
        │
        ▼
Research Agent
        │
        ▼
General AI Agent
```

当前代表性的开源生态主要包括：

* Qwen 系列
* InternVL 系列
* Florence 系列
* SmolDocling
* Docling
* OmniDocBench

这些项目共同推动了现代多模态 AI 的快速发展。

---

# Open-source VLM Ecosystem

## Model Family Comparison

| Model      | Organization   | Main Focus        | Open Source |
| ---------- | -------------- | ----------------- | :---------: |
| LLaVA      | Microsoft / UW | 通用多模态对话           |      ✓      |
| Florence-2 | Microsoft      | 通用视觉基础模型          |      ✓      |
| InternVL   | OpenGVLab      | 高性能 VLM           |      ✓      |
| Qwen2-VL   | Alibaba        | 多模态理解             |      ✓      |
| Qwen2.5-VL | Alibaba        | 文档理解 + Agent      |      ✓      |
| Qwen3-VL   | Alibaba        | 长上下文 + Agent + 推理 |      ✓      |

---

# Current Research Trends

目前 VLM 的研究热点主要集中在以下几个方向：

| Direction                 | Importance |
| ------------------------- | ---------- |
| Long-context Vision       | ⭐⭐⭐⭐⭐      |
| OCR-free Document Parsing | ⭐⭐⭐⭐⭐      |
| Visual Grounding          | ⭐⭐⭐⭐⭐      |
| GUI Agent                 | ⭐⭐⭐⭐⭐      |
| Tool Use                  | ⭐⭐⭐⭐⭐      |
| Long Video Understanding  | ⭐⭐⭐⭐       |
| Vision Reasoning          | ⭐⭐⭐⭐⭐      |
| Multimodal Agent          | ⭐⭐⭐⭐⭐      |

相比早期 VLM，当前模型更加关注：

* 推理（Reasoning）
* 决策（Planning）
* 工具调用（Tool Use）
* 自主执行（Agent）

而不仅仅是图像描述或问答。

---

# VLM Capability Evolution

```text
Image Caption
      │
      ▼
Visual Question Answering
      │
      ▼
Grounding
      │
      ▼
Document Understanding
      │
      ▼
Reasoning
      │
      ▼
Tool Use
      │
      ▼
Visual Agent
      │
      ▼
Autonomous AI Agent
```

现代 VLM 已逐渐成为 AI Agent 的视觉感知核心。

---

# VLM for Document AI

对于 Document AI 而言，VLM 已成为新的统一框架。

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
PDF
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

Qwen2.5-VL 与 Qwen3-VL 已支持：

* OCR
* Reading Order
* Layout Parsing
* Table Understanding
* Formula Understanding
* Key Information Extraction
* HTML / Structured Output

并提供官方 Cookbook 覆盖文档解析、OCR、定位、GUI Agent 等典型应用。

---

# Recommended Learning Path

建议研究生按照下面路线学习。

```text
Foundation Models
        │
        ▼
Transformer
        │
        ▼
CLIP
        │
        ▼
BLIP-2
        │
        ▼
LLaVA
        │
        ▼
InternVL
        │
        ▼
Qwen2.5-VL
        │
        ▼
Qwen3-VL
        │
        ▼
Document AI
        │
        ▼
DocTags
        │
        ▼
AI Agent
```

---

# Recommended Laboratory Experiments

建议完成以下实验。

## Experiment 1

Image Caption

目标：

理解 Vision Encoder 的基本工作方式。

---

## Experiment 2

Visual Question Answering

模型：

* LLaVA
* Florence-2

学习 Prompt 设计与视觉问答。

---

## Experiment 3

Document Understanding

模型：

* Qwen2.5-VL
* Qwen3-VL

数据：

* OmniDocBench

输出：

* Markdown
* HTML
* JSON

---

## Experiment 4

Structured Document Generation

模型：

* Qwen3-VL

输出：

* DocTags
* Markdown
* JSON

重点关注结构化文档表示。

---

## Experiment 5

OmniDocBench Evaluation

完成：

* 推理
* 官方评测
* 指标分析

建议掌握：

* Edit Distance
* TEDS
* Reading Order
* CDM

---

## Experiment 6

Mini Document Agent

基于：

* Qwen3-VL
* Docling
* OmniDocBench

完成一个能够：

* 阅读 PDF
* 回答问题
* 输出 Markdown
* 提取关键信息

的小型 Document Agent。

---

# Laboratory Research Roadmap

实验室研究路线如下：

```text
Vision-Language Models
          │
          ▼
Document AI
          │
          ▼
Docling
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
Research Agent
```

该路线与当前国际开源生态的发展方向保持一致，同时能够平滑衔接实验室的长期研究规划。

---

# Knowledge Checklist

完成本模块后，应能够回答以下问题。

## Vision-Language Models

* 为什么 VLM 能够统一视觉与语言？
* Vision Encoder 与 LLM 如何连接？
* Projection Layer、Q-Former 分别解决什么问题？

---

## Modern VLM

* 为什么 Dynamic Resolution 很重要？
* Long Context 对文档理解有什么意义？
* 为什么越来越多模型采用 Agent 架构？

---

## Document AI

* 为什么 VLM 能替代传统 OCR Pipeline？
* 为什么结构化输出（Markdown、JSON、DocTags）比纯文本更重要？

---

## Research

* 如何利用 Qwen3-VL 构建 Document AI？
* 如何基于 OmniDocBench 评测模型？
* 如何自动生成高质量 DocTags？
* 如何构建面向科研的 AI Research Agent？

---

# Chapter Summary

现代 Vision-Language Models 的发展路线如下：

```text
CLIP
 │
 ▼
BLIP-2
 │
 ▼
LLaVA
 │
 ▼
InternVL
 │
 ▼
Qwen2-VL
 │
 ▼
Qwen2.5-VL
 │
 ▼
Qwen3-VL
 │
 ▼
Document AI
 │
 ▼
DocTags
 │
 ▼
Document Agent
 │
 ▼
Research Agent
```

Vision-Language Model 已从传统的图像理解模型发展为新一代多模态基础模型，在文档理解、智能体、科研助手和复杂推理等场景中发挥核心作用。对于实验室而言，将以 **Qwen3-VL + Docling + OmniDocBench + DocTags** 作为统一技术栈，逐步构建完整的 **Multimodal Document AI** 与 **AI Research Agent** 研究体系。

---

# Recommended Next Reading

继续学习：

> **doctags.md**

重点掌握：

* DocTags Schema
* Structured Document Representation
* Semantic Layout
* Markdown → DocTags
* DocTags Generation
* DocTags Benchmark
* AI Agent-ready Documents

完成该模块后，将具备开展 **Document AI、RAG、AI Agent 和科研智能体** 相关研究的完整理论基础。



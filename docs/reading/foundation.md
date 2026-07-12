# Foundation Models

> **Multimodal Document AI Learning Center**
>
> **Module:** Foundation Models
>
> **Version:** v3.0
>
> **Part:** 1 / 4
>
> **Last Updated:** July 2026

---

# Overview

Foundation Model 是现代人工智能发展的基础。

几乎所有当前主流的大模型：

* ChatGPT
* Gemini
* Claude
* Qwen
* Llama
* DeepSeek
* InternVL
* Florence
* SmolDocling

都建立在 Foundation Models 的理论体系之上。

本章节将帮助学生建立整个课程体系的理论基础。

---

# Learning Objectives

完成本章节后，应能够：

* 理解 Transformer 为什么改变了 AI
* 理解 Foundation Model 的发展路线
* 掌握现代大模型的基本组成
* 为后续学习 Qwen、Document AI、DocTags 做准备

---

# Learning Roadmap

```text
Transformer
      │
      ▼
BERT
      │
      ▼
Vision Transformer
      │
      ▼
CLIP
      │
      ▼
BLIP
      │
      ▼
BLIP-2
      │
      ▼
Modern Vision-Language Models
```

---

# Reading Strategy

| Priority | Description |
| -------- | ----------- |
| ⭐⭐⭐⭐⭐    | 必须精读        |
| ⭐⭐⭐⭐     | 建议精读        |
| ⭐⭐⭐      | 了解即可        |

---

# Part 1. Transformer Era

---

# Paper 1

# Attention Is All You Need

**Priority**

⭐⭐⭐⭐⭐

**Authors**

Ashish Vaswani et al.

**Conference**

NeurIPS 2017

**Research Area**

Natural Language Processing

Sequence Modeling

Transformer

---

## Official Paper

Google Research

https://research.google/pubs/attention-is-all-you-need/

arXiv

https://arxiv.org/abs/1706.03762

---

## Official Code

无官方 GitHub（Google 未公开官方实现）。

推荐参考：

Harvard NLP Annotated Transformer

https://github.com/harvardnlp/annotated-transformer

---

## Background

2017 年以前，

主流 NLP 模型主要包括：

* RNN
* LSTM
* GRU

这些模型存在：

* 无法充分并行
* 长距离依赖困难
* 训练速度慢

Transformer 首次完全放弃循环神经网络。

---

## Main Contributions

首次提出：

* Self-Attention
* Multi-Head Attention
* Positional Encoding
* Encoder-Decoder Transformer

建立了现代 Foundation Model 的统一架构。

---

## Why It Matters

几乎所有现代模型均建立在 Transformer 之上：

* GPT 系列
* BERT 系列
* Vision Transformer
* CLIP
* BLIP
* Qwen
* Llama
* DeepSeek
* InternVL

可以认为：

> Transformer 是现代 Generative AI 的起点。

---

## Students Should Learn

必须掌握：

* Self-Attention
* Query / Key / Value
* Multi-Head Attention
* Positional Encoding
* Residual Connection
* Layer Normalization

---

## Laboratory Relevance

★★★★★

实验室所有研究方向均建立在 Transformer 基础上：

```text
Transformer
      │
      ▼
Qwen
      │
      ▼
Document AI
      │
      ▼
DocTags
```

---

# Paper 2

# BERT

**Priority**

⭐⭐⭐⭐⭐

**Authors**

Jacob Devlin et al.

**Conference**

NAACL 2019

**Research Area**

Natural Language Processing

Pre-training

---

## Official Paper

https://aclanthology.org/N19-1423/

arXiv

https://arxiv.org/abs/1810.04805

---

## Official Code

Google Research

https://github.com/google-research/bert

---

## Background

Transformer 已经证明：

Attention 可以替代 RNN。

BERT 则进一步提出：

> 可以首先训练一个通用语言模型，

再进行 Fine-tuning。

这一思想彻底改变了 NLP。

---

## Main Contributions

提出：

* Masked Language Modeling (MLM)
* Next Sentence Prediction (NSP)
* Bidirectional Transformer

首次实现真正意义上的：

Language Pre-training。

---

## Why Read in 2026

虽然 GPT 已成为主流，

但是：

Document AI

Information Extraction

Biomedical AI

Legal AI

等方向，

仍然大量采用：

Encoder-only Architecture。

LayoutLM 系列、

DocFormer、

大量 Document Foundation Models

都直接继承了 BERT 的思想。

---

## Students Should Learn

重点掌握：

* MLM
* Token Embedding
* Segment Embedding
* Position Embedding
* Fine-tuning
* Pre-training

---

## Laboratory Relevance

★★★★★

Document AI 中最重要的：

LayoutLM

直接建立在 BERT 基础上。

理解 LayoutLM，

必须先理解 BERT。

---

# Paper 3

# RoBERTa

**Priority**

⭐⭐⭐⭐

**Conference**

ICLR 2020

---

## Official Paper

https://arxiv.org/abs/1907.11692

---

## Official Code

https://github.com/facebookresearch/fairseq

---

## Main Contributions

RoBERTa 并没有重新设计模型。

它证明：

很多性能提升来自：

* 更大的数据
* 更长训练时间
* 更大的 Batch Size
* 更合理的数据处理

---

## Why Read

它告诉我们一个重要科研思想：

> **训练策略同样可以带来重大突破。**

对于后续：

* Llama
* Qwen
* DeepSeek

等大模型，

Scaling Law 思想具有重要影响。

---

# Summary

完成 Part 1 后，应理解：

```text
Transformer
      │
      ▼
Self-Attention
      │
      ▼
Pre-training
      │
      ▼
Foundation Models
```

这是现代人工智能的第一阶段，也是后续 Vision Foundation Models 和 Vision-Language Models 的理论起点。


# Foundation Models

> **Multimodal Document AI Learning Center**
>
> **Module:** Foundation Models
>
> **Version:** v3.0
>
> **Part:** 2 / 4
>
> **Last Updated:** July 2026

---

# Part 2. Vision Foundation Models

这一阶段标志着 **Transformer 从自然语言扩展到计算机视觉**，也是现代 Vision-Language Model（VLM）的理论基础。

学习目标：

* 理解 Vision Transformer 的设计思想
* 理解为什么 Transformer 可以替代 CNN
* 建立后续学习 CLIP、Qwen-VL、InternVL、Florence 等模型的基础

---

# Paper 4

# An Image is Worth 16×16 Words (Vision Transformer, ViT)

**Priority**

⭐⭐⭐⭐⭐

**Conference**

ICLR 2021

**Authors**

Alexey Dosovitskiy et al.

---

## Official Paper

ICLR (OpenReview)

https://openreview.net/forum?id=YicbFdNTTy

arXiv

https://arxiv.org/abs/2010.11929

---

## Official GitHub

Google Research

https://github.com/google-research/vision_transformer

---

## Main Contributions

首次证明：

> **Transformer 可以完全替代 CNN 用于图像分类。**

提出三个核心思想：

* Image Patch Embedding
* Vision Transformer Encoder
* Classification Token（CLS Token）

ViT 将图像切分为固定大小的 Patch，并将每个 Patch 看作一个 Token 输入 Transformer。

---

## Why Read in 2026

今天几乎所有主流视觉大模型都采用 ViT 或其变体作为视觉编码器，包括：

* Qwen-VL
* Qwen2.5-VL
* InternVL
* Florence-2
* CLIP
* BLIP
* SmolDocling

可以认为：

> **ViT 是现代 Vision Foundation Model 的起点。**

---

## Students Should Learn

重点掌握：

* Patch Embedding
* CLS Token
* Position Embedding
* Vision Encoder
* Global Attention

---

## Laboratory Relevance

★★★★★

实验室所有 Vision-Language Model 研究都建立在 ViT 基础之上。

---

# Paper 5

# CLIP (Contrastive Language–Image Pre-training)

**Priority**

⭐⭐⭐⭐⭐

**Organization**

OpenAI

**Year**

2021

---

## Official Paper

https://arxiv.org/abs/2103.00020

---

## Official GitHub

https://github.com/openai/CLIP

---

## Main Contributions

CLIP 首次提出：

> **利用海量 Image-Text Pair 进行对比学习（Contrastive Learning）。**

建立统一的：

* Image Embedding Space
* Text Embedding Space

实现真正意义上的：

**Zero-shot Image Recognition**。

---

## Why Read in 2026

CLIP 是现代多模态模型最具影响力的工作之一。

它影响了：

* Retrieval
* Image Search
* Vision-Language Models
* OCR-free Document AI
* Visual Agent

今天大量模型仍采用 CLIP 的训练思想。

---

## Students Should Learn

重点掌握：

* Contrastive Learning
* Image Encoder
* Text Encoder
* Shared Embedding Space
* Zero-shot Learning

---

## Laboratory Relevance

★★★★★

理解 CLIP 是学习：

* Qwen-VL
* InternVL
* Florence
* DocTags

的重要基础。

---

# Paper 6

# BLIP

**Priority**

⭐⭐⭐⭐⭐

**Conference**

ICML 2022（论文发表于 2022）

**Organization**

Salesforce Research

---

## Official Paper

https://arxiv.org/abs/2201.12086

---

## Official GitHub

https://github.com/salesforce/BLIP

---

## Main Contributions

BLIP（Bootstrapping Language-Image Pre-training）提出统一的视觉语言预训练框架，同时支持：

* Image Captioning
* Image Retrieval
* VQA
* Visual Grounding

并提出：

> Caption Bootstrapping

利用模型自动生成高质量训练数据，提高预训练效果。

---

## Why Read in 2026

BLIP 是连接：

CLIP

↓

BLIP-2

↓

Qwen-VL

的重要桥梁。

也是现代 Vision-Language Pre-training 的代表工作。

---

## Students Should Learn

重点理解：

* Vision-Language Pre-training
* Image Captioning
* Multi-task Learning
* Bootstrapping Strategy

---

## Laboratory Relevance

★★★★★

BLIP 的统一训练思想，对：

* 多模态文档理解
* 文档描述生成
* Document Caption

具有重要参考价值。

---

# Knowledge Checklist

完成本部分后，应能够回答：

## Vision Transformer

* 为什么图片可以划分为 Patch？
* Patch 与 NLP Token 有什么关系？
* ViT 为什么能够替代 CNN？

---

## CLIP

* 什么是 Contrastive Learning？
* 为什么图像和文本可以映射到同一向量空间？
* 什么是 Zero-shot Learning？

---

## BLIP

* BLIP 与 CLIP 有什么区别？
* 什么是 Bootstrapping？
* 为什么统一预训练框架更加适合多任务学习？

---

# Summary

本部分建立了现代视觉基础模型的发展路线：

```text
CNN
 │
 ▼
Vision Transformer (ViT)
 │
 ▼
CLIP
 │
 ▼
BLIP
 │
 ▼
Modern Vision-Language Models
```

完成本部分后，应能够理解现代视觉编码器的基本原理，并为下一部分 **BLIP-2、SigLIP、FlashAttention** 等关键基础模型做好准备。


# Foundation Models

> **Multimodal Document AI Learning Center**
>
> **Module:** Foundation Models
>
> **Version:** v3.0
>
> **Part:** 3 / 4
>
> **Last Updated:** July 2026

---

# Part 3. Modern Vision-Language Foundation Models

本部分介绍现代 Vision-Language Foundation Models（VLM）的关键技术突破。

学习目标：

* 理解 BLIP-2 为什么成为现代 VLM 的经典架构
* 理解 SigLIP 与 SigLIP 2 的设计思想
* 理解 FlashAttention 如何支撑大模型训练与推理
* 为后续学习 Qwen2.5-VL、Qwen3-VL、InternVL、Florence-2 奠定基础

---

# Paper 7

# BLIP-2

**Priority**

⭐⭐⭐⭐⭐

**Conference**

ICML 2023

**Authors**

Junnan Li, Dongxu Li, Silvio Savarese, Steven Hoi

---

## Official Paper

PMLR (ICML 2023)

https://proceedings.mlr.press/v202/li23q.html

arXiv

https://arxiv.org/abs/2301.12597

---

## Official GitHub

LAVIS Project

https://github.com/salesforce/LAVIS

---

## Main Contributions

BLIP-2 提出了现代 VLM 最具影响力的架构之一：

> **Frozen Vision Encoder + Q-Former + Frozen LLM**

其中：

* Vision Encoder 保持冻结
* LLM 保持冻结
* 仅训练轻量级 **Q-Former**

大幅降低训练成本，同时保持优秀性能。

---

## Why Read in 2026

BLIP-2 深刻影响了后续大量开源模型：

* MiniGPT-4
* InstructBLIP
* LLaVA
* Qwen-VL（部分设计思想）
* 多种 Document VLM

"冻结大模型，仅训练桥接模块" 已成为现代多模态模型的重要范式。

---

## Students Should Learn

重点掌握：

* Q-Former
* Frozen Vision Encoder
* Frozen LLM
* Vision-Language Alignment
* Parameter-efficient Training

---

## Laboratory Relevance

★★★★★

理解 BLIP-2，有助于理解：

```text
Vision Encoder
        │
        ▼
Feature Alignment
        │
        ▼
Large Language Model
```

也是理解 Qwen-VL 系列模型的重要基础。

---

# Paper 8

# SigLIP

**Priority**

⭐⭐⭐⭐

**Organization**

Google Research

---

## Official Paper

https://arxiv.org/abs/2303.15343

---

## Official GitHub

Google Big Vision

https://github.com/google-research/big_vision

---

## Main Contributions

SigLIP（Sigmoid Loss for Language Image Pre-training）提出：

> 使用 **Sigmoid Loss** 替代传统 CLIP 的 Softmax Contrastive Loss。

优势：

* 更稳定的训练
* 更好的 Image-Text Alignment
* 更容易扩展到超大规模数据集

---

## Why Read

SigLIP 已成为 Google 新一代 Vision Encoder 的基础。

许多后续模型都采用了其训练思想。

---

## Students Should Learn

重点理解：

* Contrastive Learning
* Pairwise Sigmoid Loss
* Vision Encoder Pre-training

---

# Paper 9

# SigLIP 2

**Priority**

⭐⭐⭐⭐⭐

**Year**

2025

**Organization**

Google DeepMind

---

## Official Paper

https://arxiv.org/abs/2502.14786

---

## Official GitHub

Google Big Vision

https://github.com/google-research/big_vision

---

## Main Contributions

SigLIP 2 在 SigLIP 基础上进一步融合：

* Caption-based Pretraining
* Self-distillation
* Masked Prediction
* Multilingual Training
* Native Aspect Ratio（NaFlex）

显著提升：

* Zero-shot Classification
* Image-Text Retrieval
* Localization
* Dense Feature Learning

同时更加适合作为现代 VLM 的视觉编码器。

---

## Why Read in 2026

SigLIP 2 已成为 Google 新一代视觉编码器的重要方向。

其 NaFlex（Native Flexible Resolution）设计，对于：

* OCR
* Document Parsing
* 多页 PDF
* 长宽比保持

具有重要意义。

---

## Students Should Learn

重点掌握：

* Sigmoid Loss
* Dense Features
* Native Resolution
* Multilingual Vision Encoder
* NaFlex

---

## Laboratory Relevance

★★★★★

实验室开展：

* Qwen-VL
* DocTags
* OmniDocBench
* SmolDocling

研究时，可重点关注：

> **视觉编码器（Vision Encoder）的设计与选择。**

---

# Paper 10

# FlashAttention

**Priority**

⭐⭐⭐⭐⭐

**Conference**

NeurIPS 2022

---

## Official Paper

https://arxiv.org/abs/2205.14135

---

## Official GitHub

https://github.com/Dao-AILab/flash-attention

---

## Main Contributions

FlashAttention 并没有改变 Transformer 结构。

它优化的是：

> **Attention 的计算过程。**

核心思想：

* IO-aware Algorithm
* Tile-based Computation
* 减少 GPU 显存访问
* 保持 Exact Attention

显著降低显存占用，同时提升训练与推理速度。

---

## Why Read

FlashAttention 已成为现代 LLM 推理框架的基础组件。

目前广泛应用于：

* PyTorch
* Hugging Face Transformers
* vLLM
* TensorRT-LLM
* SGLang

---

## Students Should Learn

重点理解：

* Memory Bottleneck
* IO-aware Computing
* Exact Attention
* GPU Optimization

---

# Paper 11

# FlashAttention-2

**Priority**

⭐⭐⭐⭐⭐

**Year**

2023

---

## Official Paper

https://arxiv.org/abs/2307.08691

---

## Official GitHub

https://github.com/Dao-AILab/flash-attention

---

## Main Contributions

FlashAttention-2 在第一代基础上进一步优化：

* 更好的 Work Partitioning
* 更高 GPU Occupancy
* 更少共享内存通信
* 更高训练吞吐率

在 A100 等 GPU 上可实现约 2 倍速度提升，并接近 GEMM 的计算效率。

---

## Why Read

如果未来需要：

* 微调 Qwen
* 微调 InternVL
* 微调 Qwen-VL

理解 FlashAttention 十分重要。

---

# Knowledge Checklist

完成本部分后，应能够回答：

## BLIP-2

* 为什么需要 Q-Former？
* 为什么冻结 Vision Encoder？
* 为什么冻结 LLM？

---

## SigLIP

* Sigmoid Loss 与 CLIP Loss 有什么区别？
* SigLIP 为什么更容易扩展？

---

## SigLIP 2

* 什么是 NaFlex？
* 为什么保持原始图像比例有利于 Document AI？
* 为什么 Dense Feature 很重要？

---

## FlashAttention

* 为什么传统 Attention 很耗显存？
* FlashAttention 如何减少显存访问？
* FlashAttention 为什么成为现代推理框架的标准组件？

---

# Summary

现代 Foundation Models 的关键技术演进如下：

```text
Transformer
      │
      ▼
Vision Transformer
      │
      ▼
CLIP
      │
      ▼
BLIP
      │
      ▼
BLIP-2
      │
      ▼
SigLIP
      │
      ▼
SigLIP 2
      │
      ▼
FlashAttention
      │
      ▼
Modern Vision-Language Models
```

完成本部分后，已经具备理解 **Qwen2.5-VL、Qwen3-VL、InternVL、Florence-2、SmolDocling** 等现代视觉语言基础模型的核心理论基础。

下一部分 **`foundation.md (Part 4)`** 将总结 Foundation Models 的发展趋势，并介绍 **Scaling Law、Mixture of Experts（MoE）、长上下文（Long Context）** 等现代基础模型的重要方向，以及它们与实验室 **Document AI → DocTags → AI Agent** 研究路线之间的联系。



# Foundation Models

> **Multimodal Document AI Learning Center**
>
> **Module:** Foundation Models
>
> **Version:** v3.0
>
> **Part:** 4 / 4
>
> **Last Updated:** July 2026

---

# Part 4. Modern Foundation Models

进入 2024–2026 年，Foundation Models 的研究重点已经从：

> **"如何训练 Transformer"**

逐渐转向：

> **"如何构建更大、更高效、更智能的 Foundation Models"**

目前国际主流研究主要集中在以下几个方向：

* Scaling Laws
* Mixture of Experts (MoE)
* Long Context
* Efficient Attention
* Multimodal Foundation Models
* AI Agent

---

# Paper 12

# Scaling Laws for Neural Language Models

**Priority**

⭐⭐⭐⭐⭐

**Authors**

Jared Kaplan et al.

**Organization**

OpenAI

**Year**

2020

---

## Official Paper

https://arxiv.org/abs/2001.08361

---

## Main Contributions

首次系统提出：

> **Scaling Law**

即：

模型性能与以下三个因素之间存在稳定的幂律关系：

* Model Size
* Dataset Size
* Training Compute

这一工作成为后续 GPT-3、PaLM、Llama、Qwen 等大模型设计的重要理论基础。

---

## Why Read in 2026

今天几乎所有 Foundation Models 的训练，都遵循：

* 更大的模型
* 更高质量的数据
* 更合理的计算预算

理解 Scaling Law，有助于理解为什么现代模型不断扩大规模。

---

## Students Should Learn

重点掌握：

* Scaling Law
* Compute Budget
* Data Scaling
* Model Scaling

---

# Paper 13

# Mixture of Experts (MoE)

**Priority**

⭐⭐⭐⭐⭐

---

## Background

随着模型规模不断扩大，

Dense Transformer 的训练成本迅速增加。

MoE（Mixture of Experts）提出：

> **每个 Token 仅激活少量 Expert。**

这样可以：

* 提高模型容量
* 降低推理计算量
* 保持训练效率

---

## Recommended Reading

建议阅读近年来关于 MoE Scaling 的代表工作：

**Scaling Laws Across Model Architectures**

EMNLP 2024

https://aclanthology.org/2024.emnlp-main.319/

该工作证明：

Scaling Law 同样适用于 MoE 架构，并分析了 Dense Model 与 MoE Model 的扩展规律。

---

## Why Read

目前大量领先模型已经采用：

* Qwen MoE
* DeepSeek MoE
* Mixtral
* 其他大型开源 LLM

MoE 已成为现代 Foundation Model 的重要方向。

---

## Students Should Learn

重点掌握：

* Expert Routing
* Sparse Activation
* Active Parameters
* Dense vs MoE

---

# Paper 14

# Effective Long-Context Scaling of Foundation Models

**Priority**

⭐⭐⭐⭐⭐

**Conference**

NAACL 2024

---

## Official Paper

https://aclanthology.org/2024.naacl-long.260/

Meta Research

https://ai.meta.com/research/publications/effective-long-context-scaling-of-foundation-models/

---

## Main Contributions

提出一种高效训练长上下文模型的方法：

* Continual Pre-training
* Curriculum Learning
* Long-context Instruction Tuning

支持最高约 **32K Tokens** 的有效上下文，并在长文本任务上显著优于基础模型。

---

## Why Read

Document AI 的对象通常是：

* PDF
* 法律文书
* 学术论文
* 技术手册

这些任务天然需要：

> **Long Context Understanding**

因此，长上下文能力已经成为现代 Document AI 的核心基础能力。

---

## Students Should Learn

重点掌握：

* Context Window
* Long-context Training
* Continual Pre-training
* Position Encoding

---

# Part 5. Modern Research Trends

目前 Foundation Models 正在向以下方向发展：

| Direction                    | Importance |
| ---------------------------- | ---------- |
| Scaling Laws                 | ⭐⭐⭐⭐⭐      |
| MoE                          | ⭐⭐⭐⭐⭐      |
| Long Context                 | ⭐⭐⭐⭐⭐      |
| Native Resolution            | ⭐⭐⭐⭐⭐      |
| Multimodal Foundation Models | ⭐⭐⭐⭐⭐      |
| AI Agent                     | ⭐⭐⭐⭐⭐      |

未来 Foundation Models 不再只是：

> Text Generation

而是发展为：

* Image Understanding
* Video Understanding
* Document Understanding
* Tool Use
* Autonomous Agent

---

# Part 6. Foundation Models and Document AI

实验室的整体技术路线如下：

```text
Transformer
      │
      ▼
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
Structured Document Representation
      │
      ▼
DocTags
      │
      ▼
OmniDocBench
      │
      ▼
Document Agent
      │
      ▼
AI Research Agent
```

可以看到：

Foundation Models 是整个实验室研究体系的理论起点。

---

# Recommended Reading Order

| Week   | Topic                         |
| ------ | ----------------------------- |
| Week 1 | Transformer、BERT              |
| Week 2 | Vision Transformer、CLIP       |
| Week 3 | BLIP、BLIP-2                   |
| Week 4 | SigLIP、FlashAttention         |
| Week 5 | Scaling Laws、MoE、Long Context |

---

# Knowledge Checklist

完成本章节后，应能够回答：

## Foundation Models

* 什么是 Foundation Model？
* 为什么 Transformer 成为统一架构？

---

## Scaling Laws

* 为什么更大的模型通常效果更好？
* 数据规模、模型规模和计算预算之间有什么关系？

---

## MoE

* Dense Model 与 MoE 的区别？
* 为什么 MoE 能降低计算成本？

---

## Long Context

* 为什么 Document AI 需要长上下文？
* 长上下文训练有哪些关键技术？

---

## Laboratory Research

思考以下问题：

1. 为什么 Qwen2.5-VL 在文档理解中表现优秀？
2. 为什么现代 Document AI 越来越依赖 Vision-Language Foundation Models？
3. DocTags 如何利用 Foundation Models 提供更高层次的语义表示？
4. 如何基于 Foundation Models 构建具备自主科研能力的 AI Agent？

---

# Chapter Summary

本章节完成后，应建立如下知识体系：

```text
Transformer
      │
      ▼
Language Foundation Models
      │
      ▼
Vision Foundation Models
      │
      ▼
Vision-Language Foundation Models
      │
      ▼
Scaling Laws
      │
      ▼
MoE
      │
      ▼
Long Context
      │
      ▼
Modern Foundation Models
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

至此，**Foundation Models** 学习模块结束。

---

# Recommended Next Reading

继续阅读：

> **document_ai.md**

重点学习：

* LayoutLM / LayoutLMv2 / LayoutLMv3
* DiT
* DocFormer
* MinerU
* Docling
* Document Foundation Models

进一步理解 Foundation Models 如何演进为现代 **Document AI** 技术体系。





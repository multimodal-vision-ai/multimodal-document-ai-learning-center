# Benchmarks

> **Multimodal Document AI Learning Center**
>
> **Module:** Benchmarks
>
> **Version:** v3.1
>
> **Part:** 1 / 4
>
> **Last Updated:** July 2026

---

# Overview

Benchmark 是 Document AI 研究中不可缺少的一部分。

对于科研而言，一个优秀的模型不仅需要能够生成结果，更需要在**公开数据集**和**统一评价体系**下进行客观比较。

本章节重点介绍目前国际上最具代表性的 **Document AI Benchmark**，帮助学生建立完整的评测体系认知。

---

# Learning Objectives

完成本章节后，应能够：

* 理解 Benchmark 在科研中的作用
* 熟悉主流 Document AI Benchmark
* 理解不同 Benchmark 的设计目标
* 根据研究任务选择合适的数据集与评价指标

---

# Benchmark Evolution

Document AI Benchmark 的发展经历了以下几个阶段：

```text
OCR Accuracy
      │
      ▼
Layout Analysis
      │
      ▼
Table Recognition
      │
      ▼
Document Parsing
      │
      ▼
Vision-Language Understanding
      │
      ▼
End-to-End Document Intelligence
```

现代 Benchmark 已从单一 OCR 精度评测，发展为覆盖版面、阅读顺序、公式、表格和结构化输出的综合评测体系。

---

# Benchmark Taxonomy

建议按照研究目标理解不同 Benchmark。

| Research Task        | Representative Benchmark |
| -------------------- | ------------------------ |
| OCR                  | OCRBench、OCRBench v2     |
| Layout Analysis      | DocLayNet、PubLayNet      |
| Table Recognition    | PubTabNet                |
| Document Parsing     | OmniDocBench             |
| Document VQA         | DocVQA、InfographicVQA    |
| Chart Understanding  | ChartQA                  |
| Scientific Documents | DocBank                  |

不同 Benchmark 关注的能力不同，不存在一个 Benchmark 可以覆盖全部 Document AI 任务。

---

# Part 1. OmniDocBench

## Position

★★★★★

**Current Recommendation**

目前国际上最完整的 **Document Parsing Benchmark** 之一。

CVPR 2025 收录。

---

## Official Resources

### Paper

https://arxiv.org/abs/2412.07626

### GitHub

https://github.com/opendatalab/OmniDocBench

### Dataset

https://huggingface.co/datasets/opendatalab/OmniDocBench

---

## Why It Matters

OmniDocBench 的目标不是评测某一个模块，而是评价：

> **End-to-End Document Parsing**

覆盖：

* Academic Papers
* Books
* Financial Reports
* Newspapers
* Slides
* Forms
* Handwritten Documents

等多种真实文档场景。

---

## Main Evaluation Tasks

| Task                 | Supported |
| -------------------- | :-------: |
| Text OCR             |     ✓     |
| Layout Detection     |     ✓     |
| Reading Order        |     ✓     |
| Table Recognition    |     ✓     |
| Formula Recognition  |     ✓     |
| End-to-End Parsing   |     ✓     |
| Attribute Evaluation |     ✓     |

相比传统 Benchmark，

OmniDocBench 更强调：

> **Document Intelligence**

而不是单独 OCR 精度。

---

## Key Metrics

| Metric        | Purpose |
| ------------- | ------- |
| Edit Distance | 文本识别    |
| BLEU          | 文本相似度   |
| TEDS          | 表格结构    |
| CDM           | 数学公式    |
| mAP           | 布局检测    |
| Reading Order | 阅读顺序    |

这些指标已经成为当前 Document AI 论文中最常见的评价标准。

---

# Part 2. DocLayNet

## Position

★★★★★

**Focus**

Document Layout Analysis

---

## Official Resources

### Paper

https://arxiv.org/abs/2206.01062

### GitHub

https://github.com/DS4SD/DocLayNet

### Dataset

https://huggingface.co/datasets/ds4sd/DocLayNet

---

## Why Read

DocLayNet 是目前最重要的公开版面分析数据集之一。

特点：

* 人工标注
* 多来源文档
* COCO 格式
* 11 类布局元素
* 大规模真实页面

相比早期 PubLayNet，DocLayNet 在文档类型和布局复杂度方面更加丰富，更适合训练通用版面分析模型。

---

## Typical Tasks

支持：

* Layout Detection
* Region Classification
* Page Segmentation
* Reading Region Detection

典型模型包括：

* DiT
* DocLayout-YOLO
* RT-DETR
* LayoutLM 系列

---

# Part 3. OCRBench

## Position

★★★★★

**Focus**

OCR Capability Evaluation for Large Multimodal Models

---

## Official Resources

### Paper

https://arxiv.org/abs/2305.07895

### OCRBench v2

https://arxiv.org/abs/2501.00321

### GitHub

https://github.com/Yuliang-Liu/MultimodalOCR

---

## Why Read

OCRBench 是目前评价大型多模态模型 OCR 能力的重要 Benchmark。

覆盖：

* Scene Text
* Document OCR
* Formula
* Handwriting
* Key Information Extraction
* Document VQA

OCRBench v2 在此基础上进一步增加了：

* Text Localization
* Layout Perception
* Visual Reasoning
* Bilingual Evaluation

使其更加符合现代 Vision-Language Model 的能力评测需求。

---

# Reading Suggestions

建议阅读顺序如下：

| Priority | Benchmark              | Purpose                     |
| -------- | ---------------------- | --------------------------- |
| ⭐⭐⭐⭐⭐    | OmniDocBench           | End-to-End Document Parsing |
| ⭐⭐⭐⭐⭐    | DocLayNet              | Layout Analysis             |
| ⭐⭐⭐⭐⭐    | OCRBench / OCRBench v2 | OCR 与 VLM 能力评测              |

---

# Knowledge Checklist

完成本部分后，应能够回答：

* 为什么现代 Benchmark 更强调 End-to-End Evaluation？
* OmniDocBench 与 DocLayNet 的定位有何不同？
* OCRBench 为什么专门针对大型多模态模型设计？
* 不同研究任务应如何选择 Benchmark？

---

# Recommended Next Reading

继续学习：

> **benchmarks.md（Part 2）**

重点内容：

* PubTabNet
* DocVQA
* InfographicVQA
* ChartQA
* DocBank
* RVL-CDIP
* Benchmark Selection Strategy

# Benchmarks

> **Multimodal Document AI Learning Center**
>
> **Module:** Benchmarks
>
> **Version:** v3.1
>
> **Part:** 2 / 4
>
> **Last Updated:** July 2026

---

# Overview

本章节继续介绍 **Document AI** 中最具代表性的公开 Benchmark，重点覆盖：

* Table Understanding
* Document Visual Question Answering (DocVQA)
* Chart Understanding
* Scientific Document Understanding
* Document Classification

这些 Benchmark 已成为近几年 CVPR、ICCV、ECCV、ICML、ACL、EMNLP 等顶级会议论文的标准评测平台。

---

# Benchmark Coverage

```text
Document AI
      │
      ├── Table Recognition
      ├── Document VQA
      ├── Chart Understanding
      ├── Scientific Documents
      └── Document Classification
```

---

# Part 4. PubTabNet

## Position

★★★★★

**Focus**

Table Structure Recognition (TSR)

---

## Official Resources

### Paper (ECCV 2020)

https://arxiv.org/abs/1911.10683

### GitHub

https://github.com/ibm-aur-nlp/PubTabNet

### Dataset

https://huggingface.co/datasets/ajimeno/PubTabNet

---

## Why It Matters

PubTabNet 是目前最经典、应用最广泛的表格识别数据集之一。

特点：

* 56 万+ 科学论文表格
* HTML 结构标注
* 支持复杂跨行、跨列表格
* 提出并推广 **TEDS（Tree Edit Distance Similarity）** 评价指标

目前几乎所有 Table Recognition 模型都会在 PubTabNet 上进行评测。

---

## Main Evaluation Tasks

| Task                        | Supported |
| --------------------------- | :-------: |
| Table Detection             |     ✓     |
| Table Structure Recognition |     ✓     |
| HTML Generation             |     ✓     |
| Cell Recognition            |     ✓     |

---

## Typical Metrics

| Metric             | Description  |
| ------------------ | ------------ |
| TEDS               | 表格结构相似度（最重要） |
| Exact Match        | 完整结构匹配       |
| Precision / Recall | 单元格识别        |

---

## Representative Models

* TableFormer
* UniTable
* LGPMA
* TableMaster
* Qwen3-VL
* MinerU
* Docling

---

# Part 5. DocVQA

## Position

★★★★★

**Focus**

Document Visual Question Answering

---

## Official Resources

### Paper

https://arxiv.org/abs/2007.00398

### Official Website

https://www.docvqa.org/

### Challenge

https://rrc.cvc.uab.es/?ch=17

---

## Why It Matters

DocVQA 是目前最具影响力的 **Document Question Answering** Benchmark。

其目标是：

> 给定文档页面和自然语言问题，自动生成正确答案。

与传统 OCR 不同，

DocVQA 要求模型同时理解：

* 文本内容
* 页面布局
* 图表
* 表格
* 视觉关系

因此，它已成为评价 Vision-Language Model 文档理解能力的重要标准。

---

## Representative Tasks

| Task               | Description |
| ------------------ | ----------- |
| Single-page DocVQA | 单页文档问答      |
| Multi-page DocVQA  | 多页文档问答      |
| InfographicVQA     | 信息图问答       |
| Text-based QA      | OCR 文本问答    |

近年来，多页 DocVQA 已成为新的研究热点。

---

## Common Metrics

* ANLS
* Exact Match (EM)
* F1 Score

---

# Part 6. ChartQA

## Position

★★★★☆

**Focus**

Chart Understanding

---

## Official Resources

### Paper

https://arxiv.org/abs/2203.10244

### GitHub

https://github.com/vis-nlp/ChartQA

### Dataset

https://huggingface.co/datasets/HuggingFaceM4/ChartQA

---

## Why Read

真实文档中大量信息来自：

* 柱状图
* 折线图
* 饼图
* 散点图

ChartQA 旨在评测模型是否能够：

* 理解图表内容
* 结合图例进行推理
* 回答数值和趋势相关问题

它是 Document AI 与多模态推理结合的重要 Benchmark。

---

## Representative Tasks

* Numerical Reasoning
* Trend Analysis
* Legend Understanding
* Multi-hop Reasoning

---

# Part 7. DocBank

## Position

★★★★★

**Focus**

Scientific Document Layout Understanding

---

## Official Resources

### Paper

https://arxiv.org/abs/2006.01038

### GitHub

https://github.com/doc-analysis/DocBank

---

## Why It Matters

DocBank 是最早的大规模科学文档布局数据集之一。

特点：

* 50 万+ 页面
* Token-level Annotation
* 基于 arXiv 论文自动标注
* 同时包含文本与版面信息

它为 LayoutLM、DiT 等模型的发展提供了重要的数据基础。

---

## Supported Tasks

| Task                 | Supported |
| -------------------- | :-------: |
| Layout Analysis      |     ✓     |
| Token Classification |     ✓     |
| Reading Structure    |     ✓     |
| Scientific Documents |     ✓     |

---

# Part 8. RVL-CDIP

## Position

★★★★☆

**Focus**

Document Classification

---

## Official Resources

### Paper

https://www.cs.cmu.edu/~aharley/rvl-cdip/

### Dataset

https://www.cs.cmu.edu/~aharley/rvl-cdip/

---

## Why Read

RVL-CDIP 是文档分类领域最经典的数据集之一。

包含：

* Letter
* Memo
* Email
* Form
* Invoice
* Resume
* Scientific Report
* Advertisement

共 16 类文档。

虽然发布时间较早，但仍广泛用于文档分类模型的基准评测。

---

# Benchmark Selection Guide

| Research Topic          | Recommended Benchmark |
| ----------------------- | --------------------- |
| Table Recognition       | PubTabNet             |
| Layout Analysis         | DocLayNet、DocBank     |
| Document Parsing        | OmniDocBench          |
| OCR Evaluation          | OCRBench v2           |
| Document VQA            | DocVQA                |
| Chart Reasoning         | ChartQA               |
| Document Classification | RVL-CDIP              |

建议不要只使用单一 Benchmark，而应根据研究目标组合多个数据集进行综合评测。

---

# Knowledge Checklist

完成本部分后，应能够回答：

* 为什么 TEDS 是表格识别的重要评价指标？
* DocVQA 与传统 OCR Benchmark 有何区别？
* ChartQA 主要评测哪些能力？
* DocBank 与 DocLayNet 分别适用于哪些研究任务？
* 如何根据研究方向选择合适的 Benchmark？

---

# Recommended Next Reading

继续学习：

> **benchmarks.md（Part 3）**

重点内容：

* FUNSD
* CORD
* Kleister
* SROIE
* XFUND
* 信息抽取（KIE）Benchmark
* 多语言 Document AI Benchmark

# Benchmarks

> **Multimodal Document AI Learning Center**
>
> **Module:** Benchmarks
>
> **Version:** v3.1
>
> **Part:** 3 / 4
>
> **Last Updated:** July 2026

---

# Overview

本章节重点介绍 **Key Information Extraction (KIE)** 与 **Form Understanding** 方向最重要的国际 Benchmark。

相比 OCR 或 Document Parsing，KIE 更关注：

> **从真实业务文档中自动提取具有业务语义的关键信息。**

典型应用包括：

* 发票信息提取
* 收据解析
* 表单理解
* 合同解析
* 企业单据自动化
* 多语言票据处理

这些 Benchmark 已成为 **LayoutLM、LayoutLMv3、BROS、GeoLayoutLM、UDOP、Qwen2-VL、Qwen3-VL** 等模型的重要评测数据集。

---

# Benchmark Landscape

```text
Key Information Extraction
          │
          ├── Form Understanding
          │      ├── FUNSD
          │      ├── XFUND
          │      └── SRFUND
          │
          ├── Receipt Understanding
          │      ├── CORD
          │      └── SROIE
          │
          └── Document IE
                 ├── KIE
                 └── Entity Linking
```

---

# Part 9. FUNSD

## Position

★★★★★

**Focus**

Form Understanding

---

## Official Resources

### Paper (ICDAR Workshop 2019)

https://arxiv.org/abs/1905.13538

### Official Dataset

https://guillaumejaume.github.io/FUNSD/

### GitHub

https://github.com/guillaumejaume/FUNSD

---

## Why It Matters

FUNSD（Form Understanding in Noisy Scanned Documents）是现代 **Form Understanding** 研究的起点。

首次公开提供：

* 文本内容
* OCR 框
* 实体类别
* Key-Value 关系

统一标注，为 LayoutLM 系列模型的发展奠定了基础。

---

## Supported Tasks

| Task                 | Supported |
| -------------------- | :-------: |
| OCR                  |     ✓     |
| Entity Recognition   |     ✓     |
| Entity Linking       |     ✓     |
| Form Understanding   |     ✓     |
| Key-Value Extraction |     ✓     |

---

## Typical Labels

FUNSD 共定义四类语义实体：

* Question
* Answer
* Header
* Other

并标注实体之间的关联关系。

---

# Part 10. XFUND

## Position

★★★★★

**Focus**

Multilingual Form Understanding

---

## Official Resources

### Paper

https://arxiv.org/abs/2104.08836

### GitHub

https://github.com/doc-analysis/XFUND

### Dataset

https://huggingface.co/datasets/xfund/xfund

---

## Why It Matters

XFUND 可以理解为：

> **FUNSD 的多语言版本。**

覆盖：

* Chinese
* Japanese
* French
* German
* Spanish
* Portuguese
* Italian

共七种语言，成为跨语言 Document AI 的标准 Benchmark。

---

## Typical Tasks

支持：

* Key Information Extraction
* Entity Linking
* Multilingual Layout Understanding
* Cross-language Transfer

---

## Representative Models

* LayoutXLM
* LayoutLMv3
* BROS
* UDOP
* Qwen2-VL
* Qwen3-VL

---

# Part 11. CORD

## Position

★★★★★

**Focus**

Receipt Understanding

---

## Official Resources

### Paper

https://arxiv.org/abs/2011.08844

### GitHub

https://github.com/clovaai/cord

### Dataset

https://huggingface.co/datasets/naver-clova-ix/cord-v2

---

## Why It Matters

CORD（Consolidated Receipt Dataset）是收据解析领域最经典的数据集。

特点：

* 真实商业收据
* OCR 标注
* 商品级实体
* 层次化标签

广泛用于：

* Receipt Parsing
* KIE
* Entity Recognition

并长期作为 KIE 论文的重要 Benchmark。

---

## Typical Entity Types

包括：

* Store
* Menu
* Quantity
* Price
* Total
* Tax
* Date
* Payment

---

# Part 12. SROIE

## Position

★★★★★

**Focus**

Scanned Receipt OCR and Information Extraction

---

## Official Resources

### Competition

https://rrc.cvc.uab.es/?ch=13

### ICDAR Competition

https://rrc.cvc.uab.es/

---

## Why It Matters

SROIE 是 ICDAR 官方举办的国际竞赛数据集。

重点关注：

* Receipt OCR
* Key Information Extraction

标准字段包括：

* Company
* Date
* Address
* Total

由于任务定义明确，SROIE 仍然是工业界票据识别的重要评测基准。

---

# Part 13. SRFUND

## Position

★★★★☆

**Focus**

Hierarchical Form Understanding

---

## Official Resources

### Paper (NeurIPS 2024 Datasets & Benchmarks)

https://arxiv.org/abs/2406.08757

### Project Page

https://sprateam-ustc.github.io/SRFUND

---

## Why Read

SRFUND 是近年来提出的新一代表单理解 Benchmark。

相比 FUNSD 和 XFUND，

新增：

* Text Line Recovery
* Entity Hierarchy
* Item Table Localization
* Global Structure Recovery

能够评价模型恢复完整文档结构的能力。

---

## New Evaluation Tasks

| Task                      | FUNSD | XFUND | SRFUND |
| ------------------------- | :---: | :---: | :----: |
| Entity Classification     |   ✓   |   ✓   |    ✓   |
| Entity Linking            |   ✓   |   ✓   |    ✓   |
| Hierarchical Structure    |   ✗   |   ✗   |    ✓   |
| Table Localization        |   ✗   |   ✗   |    ✓   |
| Global Structure Recovery |   ✗   |   ✗   |    ✓   |

---

# Recommended Reading Order

| Priority | Benchmark | Research Focus                  |
| -------- | --------- | ------------------------------- |
| ⭐⭐⭐⭐⭐    | FUNSD     | Form Understanding              |
| ⭐⭐⭐⭐⭐    | XFUND     | Multilingual KIE                |
| ⭐⭐⭐⭐⭐    | CORD      | Receipt Understanding           |
| ⭐⭐⭐⭐⭐    | SROIE     | Industrial Receipt OCR          |
| ⭐⭐⭐⭐     | SRFUND    | Hierarchical Form Understanding |

---

# Recommended Survey Papers

## BROS

https://arxiv.org/abs/2108.04539

重点：

* Text + Layout Pre-training
* KIE Benchmark
* FUNSD、CORD、SROIE 综合实验

---

## LayoutXLM

https://arxiv.org/abs/2104.08836

重点：

* Multilingual Document Understanding
* XFUND 基准
* Cross-lingual Pre-training

---

## HGALayoutLM

https://arxiv.org/abs/2407.06904

重点：

* Hypergraph Layout Modeling
* FUNSD
* XFUND
* CORD
* SROIE 最新 SOTA 对比

---

# Knowledge Checklist

完成本部分后，应能够回答：

* FUNSD 为什么成为 Form Understanding 的经典 Benchmark？
* XFUND 相比 FUNSD 增加了哪些能力？
* CORD 与 SROIE 的应用场景有何区别？
* SRFUND 为什么代表下一代 Form Understanding Benchmark？
* 多语言 KIE 应优先选择哪些公开数据集？

---

# Recommended Next Reading

继续学习：

> **benchmarks.md（Part 4）**

重点内容：

* 最新 OCRBench v2
* MMDocBench
* 综合 Benchmark 对比
* Benchmark Selection Strategy
* 实验室 Benchmark 建设

# Benchmarks

> **Multimodal Document AI Learning Center**
>
> **Module:** Benchmarks
>
> **Version:** v3.2
>
> **Part:** 4 / 4
>
> **Last Updated:** July 2026

---

# Overview

近年来，Document AI Benchmark 正在发生新的变化。

传统 Benchmark 主要关注：

* OCR Accuracy
* Layout Detection
* Table Recognition

而新一代 Benchmark 更关注：

* End-to-End Document Parsing
* OCR-free Document Understanding
* Fine-grained Visual Grounding
* Vision-Language Reasoning
* AI Agent Readiness

Benchmark 的目标已经从**单模块评测**转向**完整文档智能能力评测**。

---

# Benchmark Evolution (2020–2026)

```text
OCR
 │
 ▼
Layout Analysis
 │
 ▼
Document Parsing
 │
 ▼
Vision-Language Understanding
 │
 ▼
Fine-grained Grounding
 │
 ▼
AI Agent Evaluation
```

---

# Part 14. MMDocBench

## Position

⭐⭐⭐⭐⭐

**Focus**

Fine-grained Vision-Language Document Understanding

---

## Official Resources

### Project

https://mmdocbench.github.io/

### Paper

https://arxiv.org/abs/2410.21311

### GitHub

https://github.com/fb-zhu/MMDocBench

### Dataset

https://huggingface.co/datasets/next-tat/MMDocBench

---

## Why It Matters

MMDocBench 是近年来最具代表性的 **Vision-Language Document Benchmark** 之一。

不同于传统 OCR Benchmark，

它强调：

> **OCR-Free Document Understanding**

重点评测：

* Fine-grained Perception
* Visual Grounding
* Document Reasoning
* Multi-step QA

覆盖：

* Research Papers
* Financial Reports
* Tables
* Receipts
* Charts
* Infographics

共定义 **15 个主任务、48 个子任务**，并提供支持区域（Supporting Regions）标注，用于评估模型是否真正理解了文档内容，而不仅仅是生成正确答案。

---

## Main Evaluation Dimensions

| Capability              | Supported |
| ----------------------- | :-------: |
| OCR-free QA             |     ✓     |
| Fine-grained Perception |     ✓     |
| Grounding               |     ✓     |
| Visual Reasoning        |     ✓     |
| Multi-document Types    |     ✓     |

---

# Part 15. OCRBench v2

## Position

⭐⭐⭐⭐⭐

**Focus**

Large Multimodal Model OCR Evaluation

---

## Official Resources

### Paper

https://arxiv.org/abs/2501.00321

### GitHub

https://github.com/Yuliang-Liu/MultimodalOCR

### NeurIPS 2025

https://papers.nips.cc/paper/2025

---

## Why It Matters

OCRBench v2 是 OCRBench 的全面升级版本。

相比第一版：

新增：

* Layout Perception
* Text Localization
* Handwritten Documents
* Diagram Understanding
* Logical Reasoning

覆盖 **31 个真实场景**、**10000 组人工验证 QA**，目前已成为评价大型多模态模型 OCR 能力的重要基准。

---

## Representative Tasks

| Task                 | Included |
| -------------------- | :------: |
| Text Recognition     |     ✓    |
| Layout Understanding |     ✓    |
| Document Parsing     |     ✓    |
| Formula              |     ✓    |
| Handwriting          |     ✓    |
| OCR Reasoning        |     ✓    |
| Visual Grounding     |     ✓    |

---

# Part 16. Emerging Benchmark Trends

当前国际 Benchmark 呈现以下发展趋势：

| Trend                      | Description         |
| -------------------------- | ------------------- |
| OCR-free Evaluation        | 不依赖传统 OCR 中间结果      |
| End-to-End Parsing         | 从文档直接生成结构化表示        |
| Vision-Language Evaluation | 综合视觉与语言理解能力         |
| Grounding-aware Evaluation | 关注答案与文档区域对应关系       |
| Agent-oriented Benchmark   | 面向 AI Agent 的文档理解能力 |

这些趋势正逐渐成为顶级会议 Document AI 论文的主流评测方向。

---

# Part 17. Benchmark Selection Strategy

建议根据研究方向选择 Benchmark。

| Research Direction            | Recommended Benchmark |
| ----------------------------- | --------------------- |
| OCR                           | OCRBench v2           |
| Layout Analysis               | DocLayNet             |
| Document Parsing              | OmniDocBench          |
| Scientific Documents          | DocBank               |
| Table Understanding           | PubTabNet             |
| Form Understanding            | FUNSD                 |
| Multilingual KIE              | XFUND                 |
| Receipt Parsing               | CORD、SROIE            |
| Document QA                   | DocVQA                |
| Chart Reasoning               | ChartQA               |
| Vision-Language Understanding | MMDocBench            |

推荐组合：

```text
OmniDocBench
        +
OCRBench v2
        +
MMDocBench
```

能够覆盖目前主流 Vision-Language Document AI 的核心能力。

---

# Part 18. Laboratory Benchmark Pipeline

建议实验室建立统一 Benchmark 流程。

```text
Dataset
     │
     ▼
Inference
     │
     ▼
Prediction
     │
     ▼
Official Evaluation
     │
     ▼
Metrics
     │
     ▼
Visualization
     │
     ▼
Leaderboard
```

建议统一保存：

* Prediction Results
* Evaluation Scripts
* Configuration Files
* Experiment Logs
* Visualization Reports

以保证实验可复现。

---

# Recommended Technical Resources

## Benchmark Collections

| Resource                                   | URL                                                           |
| ------------------------------------------ | ------------------------------------------------------------- |
| Papers With Code（OCR）                      | https://paperswithcode.com/task/optical-character-recognition |
| Papers With Code（Document Layout Analysis） | https://paperswithcode.com/task/document-layout-analysis      |
| Hugging Face Datasets                      | https://huggingface.co/datasets                               |
| OpenDataLab                                | https://opendatalab.com                                       |

---

## Official Evaluation Frameworks

| Project      | URL                                          |
| ------------ | -------------------------------------------- |
| OmniDocBench | https://github.com/opendatalab/OmniDocBench  |
| OCRBench     | https://github.com/Yuliang-Liu/MultimodalOCR |
| MMDocBench   | https://mmdocbench.github.io/                |
| Docling      | https://github.com/docling-project/docling   |

---

## Recommended Survey Papers

### OCRBench

https://arxiv.org/abs/2305.07895

介绍大型多模态模型 OCR 能力评测体系。

---

### OCRBench v2

https://arxiv.org/abs/2501.00321

介绍最新 OCR Benchmark 与视觉文本定位、推理能力评测。

---

### MMDocBench

https://arxiv.org/abs/2410.21311

介绍 OCR-free Document Understanding Benchmark 设计。

---

### OmniDocBench

https://arxiv.org/abs/2412.07626

介绍统一文档解析 Benchmark 与 End-to-End Evaluation。

---

# Laboratory Practice

建议所有研究生完成以下实验。

| Experiment             | Objective                               |
| ---------------------- | --------------------------------------- |
| Benchmark Reproduction | 复现官方 Baseline                           |
| Cross-model Comparison | 对比 Qwen3-VL、InternVL、MinerU 等模型         |
| Metric Analysis        | 分析 Edit Distance、TEDS、Reading Order 等指标 |
| Error Analysis         | 建立典型错误案例库                               |
| Visualization          | 绘制 Benchmark 对比图、雷达图、热力图                |

---

# Knowledge Checklist

完成本模块后，应能够回答：

* 为什么现代 Benchmark 越来越强调 End-to-End Evaluation？
* MMDocBench 与 OmniDocBench 的定位有何区别？
* OCRBench v2 相比 OCRBench 增加了哪些关键能力？
* 如何根据研究目标选择合适的 Benchmark？
* 如何构建可复现的 Benchmark 实验流程？

---

# Chapter Summary

建议实验室采用如下 Benchmark 体系：

```text
OCRBench v2
      │
      ▼
DocLayNet
      │
      ▼
PubTabNet
      │
      ▼
OmniDocBench
      │
      ▼
MMDocBench
      │
      ▼
Laboratory Benchmark
      │
      ▼
Research Papers
```

该体系覆盖 OCR、版面分析、表格识别、文档解析、视觉语言理解和智能体应用等核心研究方向，可作为实验室开展 **Qwen3-VL、Docling、DocTags、OmniDocBench** 等相关科研工作的统一评测框架。




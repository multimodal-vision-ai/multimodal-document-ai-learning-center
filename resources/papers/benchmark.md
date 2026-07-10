# Benchmarks for Document AI

> **Multimodal Document AI Learning Center**
>
> **Module:** Benchmarks
>
> **Version:** v2.0
>
> **Last Updated:** July 2026
>
> 本文档介绍现代 **Document AI** 领域最重要的公开 Benchmark，帮助研究生建立规范的实验评测体系，并指导后续论文实验设计。

---

# Learning Objectives

完成本章节后，应能够：

* 理解 Benchmark 在科研中的作用
* 熟悉主流 Document AI Benchmark
* 能够选择适合自己研究的测试集
* 理解不同 Benchmark 的评价指标
* 能够独立设计论文实验

---

# Evolution of Document Benchmarks

```text
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
Document Understanding
 │
 ▼
End-to-End Parsing
 │
 ▼
Semantic Document Evaluation
```

---

# Reading Priority

| Priority | Benchmark    | 推荐指数          |
| -------- | ------------ | ------------- |
| ⭐⭐⭐⭐⭐    | OmniDocBench | 必读            |
| ⭐⭐⭐⭐⭐    | DocLayNet    | 必读            |
| ⭐⭐⭐⭐⭐    | DocVQA       | 必读            |
| ⭐⭐⭐⭐⭐    | PubTabNet    | 必读            |
| ⭐⭐⭐⭐     | FUNSD        | 建议            |
| ⭐⭐⭐⭐     | PubLayNet    | 建议            |
| ⭐⭐⭐⭐     | DocBank      | 建议            |
| ⭐⭐⭐⭐     | OCRBench     | 建议            |
| ⭐⭐⭐⭐     | CC-OCR V2    | 新一代 Benchmark |

---

# Part 1. OmniDocBench ⭐⭐⭐⭐⭐

## Paper

**OmniDocBench: Benchmarking Diverse PDF Document Parsing with Comprehensive Annotations**

CVPR 2025

Official Paper

https://openaccess.thecvf.com/content/CVPR2025/html/Ouyang_OmniDocBench_Benchmarking_Diverse_PDF_Document_Parsing_with_Comprehensive_Annotations_CVPR_2025_paper.html

Official GitHub

https://github.com/opendatalab/OmniDocBench

---

## Why It Matters

目前国际上最完整的 PDF Document Parsing Benchmark。

支持：

* OCR
* Layout Detection
* Reading Order
* Formula Recognition
* Table Recognition
* End-to-End Evaluation
* Markdown Evaluation

---

## Main Contributions

首次统一评测：

* Text
* Layout
* Table
* Formula
* Reading Order
* End-to-End Parsing

支持真实 PDF 场景，并提供统一评测框架。

---

## Recommended Models

建议用于比较：

* Qwen2.5-VL
* Qwen3-VL
* PaddleOCR-VL
* InternVL
* MinerU
* Docling

---

## Suitable Research

★★★★★

适合：

* Document AI
* OCR
* DocTags
* Semantic Rendering
* Reading Order
* PDF Parsing

---

# Part 2. DocLayNet ⭐⭐⭐⭐⭐

## Paper

**DocLayNet: A Large Human-Annotated Dataset for Document Layout Analysis**

Official Paper

https://arxiv.org/abs/2206.01062

---

## Why Read

目前最具代表性的 Layout Analysis Dataset。

特点：

* 80K+ 页面
* 11 类布局元素
* 全人工标注
* COCO 格式

---

## Main Contributions

相比 PubLayNet：

更加真实；

更加复杂；

更适合现代 Layout Detection。

---

## Recommended Tasks

* Layout Detection
* Region Detection
* Bounding Box Prediction

---

# Part 3. DocVQA ⭐⭐⭐⭐⭐

## Why Read

Document Question Answering 标准 Benchmark。

评测：

Document

↓

Question

↓

Answer

能力。

---

## Suitable Tasks

* VQA
* Retrieval
* OCR
* Reasoning

---

## Recommended Models

* Qwen-VL
* InternVL
* Florence
* DeepSeek-VL

---

# Part 4. PubTabNet ⭐⭐⭐⭐⭐

## Why Read

Table Recognition 最经典 Benchmark。

几乎所有：

Table Parsing

论文都会引用。

---

## Evaluation Metric

TEDS

这是论文中最常见：

Table Metric。

---

## Suitable Tasks

* Table Structure Recognition
* HTML Generation
* Markdown Table

---

# Part 5. FUNSD ⭐⭐⭐⭐

## Why Read

Key Information Extraction

经典数据集。

包括：

* Form
* Invoice
* Entity
* Relation

---

## Suitable Tasks

* KIE
* Document Understanding
* Information Extraction

---

# Part 6. PubLayNet ⭐⭐⭐⭐

## Why Read

Document Layout Detection

最经典 Benchmark。

虽然较老，

但仍然大量引用。

---

## Suitable Tasks

* Layout Detection
* Object Detection

---

# Part 7. DocBank ⭐⭐⭐⭐

## Why Read

Document Token Classification

经典 Benchmark。

特点：

Token 级标注。

适合理解：

LayoutLM

训练方式。

---

# Part 8. OCRBench ⭐⭐⭐⭐

## Why Read

近年来提出的重要 OCR 综合 Benchmark。

相比传统 OCR 数据集：

更加关注：

* OCR
* Reasoning
* Multi-modal Understanding

适合评估现代 VLM 的 OCR 能力。

---

# Part 9. CC-OCR V2 ⭐⭐⭐⭐

## Paper

**CC-OCR V2: Benchmarking Large Multimodal Models for Literacy in Real-world Document Processing**

Official Paper

https://arxiv.org/abs/2605.03903

---

## Why Read

2026 最新 Benchmark。

特点：

* 企业真实文档
* Document Parsing
* OCR
* Grounding
* KIE
* Document QA

强调真实场景，而不仅仅是公开测试集。

---

# Part 10. Benchmark Comparison

| Benchmark    | OCR | Layout | Table | Formula | Reading Order | End-to-End |
| ------------ | :-: | :----: | :---: | :-----: | :-----------: | :--------: |
| OmniDocBench |  ✓  |    ✓   |   ✓   |    ✓    |       ✓       |      ✓     |
| DocLayNet    |  ✗  |    ✓   |   ✗   |    ✗    |       ✗       |      ✗     |
| PubLayNet    |  ✗  |    ✓   |   ✗   |    ✗    |       ✗       |      ✗     |
| DocBank      |  ✓  |    ✓   |   ✗   |    ✗    |       ✗       |      ✗     |
| PubTabNet    |  ✗  |    ✗   |   ✓   |    ✗    |       ✗       |      ✗     |
| FUNSD        |  ✓  |    ✓   |   ✗   |    ✗    |       ✗       |      ✗     |
| DocVQA       |  ✓  |    ✓   |   ✓   |    ✗    |       ✗       |      ✓     |
| OCRBench     |  ✓  |    ✓   |   ✓   |    ✓    |       部分      |      ✓     |
| CC-OCR V2    |  ✓  |    ✓   |   ✓   |    ✓    |       ✓       |      ✓     |

---

# Recommended Reading Order

| Week   | Benchmark    |
| ------ | ------------ |
| Week 1 | DocLayNet    |
| Week 1 | PubLayNet    |
| Week 2 | PubTabNet    |
| Week 2 | FUNSD        |
| Week 3 | DocBank      |
| Week 3 | DocVQA       |
| Week 4 | OCRBench     |
| Week 5 | OmniDocBench |
| Week 5 | CC-OCR V2    |

---

# Knowledge Checklist

完成本章节后，应能够回答：

## Benchmark Design

* 为什么需要公开 Benchmark？
* Benchmark 与 Dataset 有什么区别？
* 如何选择 Baseline？

---

## Evaluation Metrics

应掌握：

* Edit Distance
* BLEU
* METEOR
* TEDS
* mAP
* F1 Score
* Reading Order Accuracy

---

## Experiment Design

能够独立设计：

* Baseline
* Ablation Study
* SOTA Comparison
* Error Analysis

---

# Connection to Our Laboratory

实验室建议所有论文实验统一采用以下评测体系：

```text
Training
    │
    ▼
Inference
    │
    ▼
OmniDocBench
    │
    ├── OCR
    ├── Layout
    ├── Table
    ├── Formula
    ├── Reading Order
    └── End-to-End
    │
    ▼
Error Analysis
    │
    ▼
Visualization
    │
    ▼
Paper
```

未来实验室所有 **Qwen3-VL、SmolDocling、DocTags、Document Agent** 等研究工作，建议优先采用 **OmniDocBench** 作为统一评测基准，并辅以 **DocLayNet、PubTabNet、DocVQA、CC-OCR V2** 等数据集进行专项能力验证。

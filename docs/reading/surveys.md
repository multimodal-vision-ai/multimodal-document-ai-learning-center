# Survey Papers

> **Multimodal Document AI Learning Center**
>
> **Module:** Survey Papers
>
> **Version:** v4.0
>
> **Last Updated:** July 2026

本目录整理 **Multimodal Document AI** 方向最值得阅读的综述论文（Survey Papers）。

建议所有研究生**优先阅读综述，再阅读经典论文和最新论文**，建立完整的知识体系。

---

# Learning Roadmap

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
Document Parsing
        │
        ▼
DocTags / Docling
        │
        ▼
Benchmarks
        │
        ▼
AI Agent
```

---

# Reading Strategy

| Priority | Description |
| -------- | ----------- |
| ⭐⭐⭐⭐⭐    | 必读（建议精读）    |
| ⭐⭐⭐⭐     | 建议阅读        |
| ⭐⭐⭐      | 作为扩展阅读      |

---

# Part 1. Vision-Language Models

## 1. A Comprehensive Survey of Vision-Language Models

**Priority**

⭐⭐⭐⭐⭐

**Year**

2026

**Journal**

Information Fusion

### Official Paper

https://www.sciencedirect.com/science/article/pii/S1566253525006955

### Why Read

目前最系统的 VLM 综述之一，覆盖：

* Vision Encoder
* LLM Backbone
* Instruction Tuning
* Prompt Engineering
* Adapter / LoRA
* Benchmark
* Efficient VLM

非常适合作为实验室学习 VLM 的第一篇综述。

---

## 2. Benchmark Evaluations, Applications, and Challenges of Large Vision Language Models

**Priority**

⭐⭐⭐⭐⭐

**Year**

2025

### Paper

https://arxiv.org/abs/2501.02189

### GitHub

https://github.com/zli12321/Awesome-VLM-Papers-And-Models

### Why Read

重点介绍：

* 主流 VLM
* Benchmark
* Evaluation
* Applications
* Challenges

推荐作为 VLM Benchmark 的参考文献。

---

## 3. A Survey on Efficient Vision-Language Models

**Priority**

⭐⭐⭐⭐

**Year**

2025

### Paper

https://arxiv.org/abs/2504.09724

### GitHub

https://github.com/MPSCUMBC/Efficient-Vision-Language-Models-A-Survey

### Why Read

重点关注：

* Mobile VLM
* Edge AI
* Efficient Inference
* Parameter-efficient Fine-tuning

适合关注轻量化 VLM 的学生。

---

# Part 2. Document AI

## 4. Document Intelligence in the Era of Large Language Models

**Priority**

⭐⭐⭐⭐⭐

**Year**

2025

### Paper

https://arxiv.org/abs/2510.13366

### Why Read

近年来 Document AI 最值得阅读的综述之一。

重点讨论：

* LLM for Document AI
* Multimodal Document Understanding
* Document Parsing
* Retrieval-Augmented Document AI
* Agent-based Document Intelligence

非常契合未来实验室研究方向。

---

## 5. Deep Learning based Visually Rich Document Content Understanding

**Priority**

⭐⭐⭐⭐⭐

**Year**

2026

**Journal**

Artificial Intelligence Review

### Paper

https://link.springer.com/article/10.1007/s10462-025-11477-3

### Why Read

系统总结：

* Layout Analysis
* OCR
* KIE
* Table Recognition
* Document Parsing
* Vision-Language Methods

是目前最新的 VRD（Visually Rich Documents）综述之一。

---

# Part 3. Docling & Structured Documents

## 6. Docling: An Efficient Open-Source Toolkit for AI-driven Document Conversion

**Priority**

⭐⭐⭐⭐⭐

**Year**

2025

### Paper

https://arxiv.org/abs/2501.17887

### IBM Research

https://research.ibm.com/publications/docling-an-efficient-open-source-toolkit-for-ai-driven-document-conversion

### Official Documentation

https://docling-project.github.io/docling/

### GitHub

https://github.com/docling-project/docling

### Why Read

Docling 是当前最重要的开源文档转换框架。

建议重点理解：

* Unified Document Representation
* DoclingDocument
* DocTags
* Modular Pipeline
* RAG Integration

---

## 7. SmolDocling

**Priority**

⭐⭐⭐⭐⭐

**Year**

2025

### Paper

https://arxiv.org/abs/2503.11576

### Official Papers

https://www.docling.ai/papers/

### Why Read

SmolDocling 首次提出：

* End-to-End Document Conversion
* DocTags Generation
* Ultra-compact Document VLM

代表新一代 Document Foundation Model。

---

# Part 4. Benchmark Surveys

## 8. OCRBench v2

**Priority**

⭐⭐⭐⭐⭐

### Paper

https://arxiv.org/abs/2501.00321

### GitHub

https://github.com/Yuliang-Liu/MultimodalOCR

### Why Read

了解：

* OCR Evaluation
* Visual Grounding
* OCR Reasoning
* LMM Evaluation

是当前 OCR Benchmark 的代表工作。

---

## 9. MMDocBench

**Priority**

⭐⭐⭐⭐⭐

### Paper

https://arxiv.org/abs/2410.21311

### Project

https://mmdocbench.github.io/

### Why Read

重点理解：

* OCR-free Evaluation
* Fine-grained Grounding
* Multi-task Evaluation
* Vision-Language Benchmark

适合研究 Qwen3-VL、InternVL 等模型。

---

# Part 5. Recommended Resource Collections

## Awesome Lists

| Resource                       | URL                                                       |
| ------------------------------ | --------------------------------------------------------- |
| Awesome Vision-Language Models | https://github.com/zli12321/Awesome-VLM-Papers-And-Models |
| Docling Papers                 | https://www.docling.ai/papers/                            |
| Papers with Code               | https://paperswithcode.com                                |
| Hugging Face Papers            | https://huggingface.co/papers                             |

---

## Conference Proceedings

| Conference          | URL                           |
| ------------------- | ----------------------------- |
| CVPR Open Access    | https://openaccess.thecvf.com |
| ICCV Open Access    | https://openaccess.thecvf.com |
| ECCV Proceedings    | https://eccv.ecva.net         |
| ACL Anthology       | https://aclanthology.org      |
| NeurIPS Proceedings | https://papers.nips.cc        |
| ICML Proceedings    | https://proceedings.mlr.press |

---

# Recommended Reading Plan

| Week   | Reading                       |
| ------ | ----------------------------- |
| Week 1 | VLM Survey（Paper 1）           |
| Week 2 | Efficient VLM Survey（Paper 3） |
| Week 3 | Document AI Survey（Paper 4）   |
| Week 4 | VRD Survey（Paper 5）           |
| Week 5 | Docling（Paper 6）              |
| Week 6 | SmolDocling（Paper 7）          |
| Week 7 | OCRBench v2（Paper 8）          |
| Week 8 | MMDocBench（Paper 9）           |

---

# Laboratory Recommended Reading Order

建议实验室统一采用如下阅读路线：

```text
Survey Papers
      │
      ▼
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
DocTags
      │
      ▼
Benchmarks
      │
      ▼
Research Projects
```

---

# Learning Objectives

完成本章节后，应能够：

* 系统理解 Vision-Language Model 的发展脉络；
* 掌握 Document AI 的主要研究方向与关键挑战；
* 理解 Docling、DocTags 等新一代结构化文档技术；
* 熟悉主流 Benchmark 与评价体系；
* 能够快速定位高质量论文，并独立阅读 CVPR、ICCV、ECCV、ACL、EMNLP、ICML、NeurIPS 等顶级会议的最新研究成果。

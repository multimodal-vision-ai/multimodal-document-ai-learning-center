> **Multimodal Document AI Learning Center**
>
> **Version:** v3.2
>
> **Last Updated:** July 2026

本目录收录 **Multimodal Document AI** 方向最值得阅读的论文、官方项目和开源资源。

所有论文均按照学习路线组织，建议按照顺序阅读。

---

# Reading Roadmap

```text
Survey Papers
        │
        ▼
Foundation Models
        │
        ▼
Document AI
        │
        ▼
Vision-Language Models
        │
        ▼
DocTags & Docling
        │
        ▼
Benchmark
```

---

# Directory Structure

```text
readings/
├── README.md          ← 当前文档（论文导航）
├── foundation.md      ← Foundation Models
├── document_ai.md     ← Document AI
├── vlm.md             ← Vision-Language Models
├── doctags.md         ← DocTags / Docling
├── benchmarks.md      ← Benchmarks
└── surveys.md         ← Survey Papers
```

---

# Reading Guide

| Module                 | Difficulty | Priority |
| ---------------------- | :--------: | :------: |
| Survey Papers          |     ⭐⭐     |   ⭐⭐⭐⭐⭐  |
| Foundation Models      |     ⭐⭐⭐    |   ⭐⭐⭐  |
| Vision-Language Models |    ⭐⭐⭐⭐    |   ⭐⭐⭐  |
| Document AI            |    ⭐⭐⭐⭐    |   ⭐⭐⭐⭐⭐  |
| DocTags / Docling      |    ⭐⭐⭐⭐    |   ⭐⭐⭐⭐  |
| Benchmarks             |     ⭐⭐⭐    |   ⭐⭐⭐⭐⭐  |


---
# 1. Recommended Survey Papers

建议首先阅读综述，再阅读代表性论文。

| Topic                  | Recommended                |
| ---------------------- | -------------------------- |
| Vision-Language Models | Recent VLM Surveys         |
| Document AI            | Recent Document AI Surveys |
| OCR                    | OCR Survey                 |
| Layout Analysis        | Layout Analysis Survey     |
| Document Parsing       | Docling Technical Report   |

📖 阅读入口：[综述论文](00_surveys.md)

---

# 2. Foundation Models

现代多模态模型的理论基础。

| Paper                     | Venue   | Year |
| ------------------------- | ------- | ---- |
| Attention Is All You Need | NeurIPS | 2017 |
| BERT                      | NAACL   | 2019 |
| RoBERTa                   | arXiv   | 2019 |
| Vision Transformer (ViT)  | ICLR    | 2021 |
| CLIP                      | ICML    | 2021 |
| BLIP-2                    | ICML    | 2023 |
| SigLIP                    | ICCV    | 2023 |
| SigLIP 2                  | arXiv   | 2025 |
| FlashAttention            | NeurIPS | 2022 |
| FlashAttention-2          | ICLR    | 2024 |

📖 阅读入口：[Foundation Models 基础知识](01_foundation.md)

---

# 3. Document AI

重点学习文档理解领域经典工作。

| Paper                    | Venue  | Year |
| ------------------------ | ------ | ---- |
| LayoutLM                 | KDD    | 2020 |
| LayoutLMv2               | ACL    | 2021 |
| LayoutLMv3               | ACM MM | 2022 |
| DocFormer                | ICCV   | 2021 |
| DiT                      | ACM MM | 2022 |
| MinerU                   | arXiv  | 2024 |
| Docling Technical Report | arXiv  | 2024 |
| Docling                  | arXiv  | 2025 |

📖 阅读入口：[Document-AI 基础知识](02_document-ai.md)

---

# 4. Vision-Language Models

重点学习现代多模态基础模型。

| Model        | Organization | Year |
| ------------ | ------------ | ---- |
| BLIP-2       | Salesforce   | 2023 |
| LLaVA        | Wisconsin    | 2023 |
| Florence-2   | Microsoft    | 2024 |
| Molmo        | Allen AI     | 2024 |
| Qwen2-VL     | Alibaba      | 2024 |
| InternVL2    | OpenGVLab    | 2024 |
| PaddleOCR-VL | Baidu        | 2025 |
| Qwen3-VL     | Alibaba      | 2025 |
| SmolDocling  | IBM Research | 2025 |

📖 阅读入口：[Vision-Language Models 基础知识](03_vlm.md)


---

# 5. DocTags & Structured Documents

建议重点阅读。

| Resource                 | Type                   |
| ------------------------ | ---------------------- |
| Docling Technical Report | Technical Report       |
| Docling                  | Research Paper         |
| SmolDocling              | Foundation Model       |
| Docling Documentation    | Official Documentation |
| Docling GitHub           | Official Code          |

官方资源：

* Docling 官方主页：https://docling.ai
* Docling 官方文档：https://docling-project.github.io/docling/
* Docling GitHub：https://github.com/docling-project/docling
* Docling Papers：https://www.docling.ai/papers/

📖 阅读入口：[Doctags 基础知识](04_doctags.md)


---

# 6. Benchmarks

建议全部阅读。

| Benchmark              | Focus                           |
| ---------------------- | ------------------------------- |
| OmniDocBench           | End-to-End Document Parsing     |
| DocLayNet              | Layout Analysis                 |
| OCRBench / OCRBench v2 | OCR & VLM Evaluation            |
| PubTabNet              | Table Recognition               |
| DocVQA                 | Document Question Answering     |
| ChartQA                | Chart Understanding             |
| FUNSD                  | Form Understanding              |
| XFUND                  | Multilingual KIE                |
| CORD                   | Receipt Understanding           |
| SROIE                  | Receipt OCR                     |
| MMDocBench             | OCR-free Document Understanding |

官方资源：

* OmniDocBench：https://github.com/opendatalab/OmniDocBench
* MMDocBench：https://mmdocbench.github.io/

📖 阅读入口：[2026-Benchmarks](05_benchmark-2026.md)

---



# Official Resources

| Resource            | Link                          |
| ------------------- | ----------------------------- |
| Papers With Code    | https://paperswithcode.com    |
| Hugging Face Papers | https://huggingface.co/papers |
| arXiv               | https://arxiv.org             |
| CVF Open Access     | https://openaccess.thecvf.com |
| ACL Anthology       | https://aclanthology.org      |
| OpenReview          | https://openreview.net        |

---

# Recommended Reading Order

| Week    | Content                              |
| ------- | ------------------------------------ |
| Week 1  | Survey Papers                    |
| Week 2  | Foundation Models                    |
| Week 3  | Vision-Language Models               |
| Week 4  | Document AI                          |
| Week 5  | DocTags & Docling                    |
| Week 6  | Benchmarks                           |
| Week 7+ | Reproduce Baselines & Start Research |

---

# Learning Objectives

完成全部内容后，应能够：

* 理解现代 Foundation Models 的发展路线；
* 掌握主流 Vision-Language Models 的模型设计思想；
* 熟悉 Document AI 的核心任务与技术路线；
* 掌握 Docling、DocTags 等结构化文档表示方法；
* 能够独立完成 OmniDocBench、OCRBench、DocVQA 等主流 Benchmark 的实验与评测；
* 具备阅读 CVPR、ICCV、ECCV、ACL、EMNLP、ICML 等顶级会议 Document AI 论文的能力，并能够开展相关科研工作。



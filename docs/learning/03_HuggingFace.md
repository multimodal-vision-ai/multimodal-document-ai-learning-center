# Chapter 3：Hugging Face

# Hugging Face for AI Research

---

# 1. 学习目标

完成本章学习后，你应该能够：

* 理解 Hugging Face 平台的作用
* 熟悉 Hugging Face 生态系统
* 下载和使用开源模型
* 下载和管理数据集
* 阅读 Model Card 与 Dataset Card
* 使用 Transformers 加载模型
* 掌握实验室模型管理方式

---

# 2. 什么是 Hugging Face？

Hugging Face 是目前全球最大的 AI 开源模型社区。

主要提供：

* 大模型（LLM）
* 多模态模型（VLM）
* 数据集（Datasets）
* 模型演示（Spaces）
* Transformers 开发框架

目前绝大多数 AI 模型都会首先发布到 Hugging Face。

官方网站：

https://huggingface.co/

---

# 3. Hugging Face 生态

Hugging Face 主要由以下几个部分组成。

| 模块           | 功能     |
| ------------ | ------ |
| Models       | 模型中心   |
| Datasets     | 数据集中心  |
| Spaces       | 在线演示   |
| Transformers | 模型开发框架 |
| PEFT         | 参数高效微调 |
| Diffusers    | 图像生成模型 |

对于本课程，重点关注前三项。

---

# 4. Model Hub

Model Hub 是 Hugging Face 最重要的功能。

官方网站：

https://huggingface.co/models

主要内容包括：

* 大语言模型（LLM）
* 多模态模型（VLM）
* OCR 模型
* Embedding 模型
* Reranker 模型

建议优先阅读官方发布的模型。

---

# 5. Dataset Hub

Dataset Hub 提供大量公开数据集。

官方网站：

https://huggingface.co/datasets

主要包括：

* OCR 数据集
* 文档理解数据集
* 图像数据集
* NLP 数据集
* 多模态数据集

建议下载数据集时优先阅读 Dataset Card。

---

# 6. Spaces

Spaces 提供在线模型演示。

官方网站：

https://huggingface.co/spaces

很多模型都可以直接在线体验，无需本地部署。

建议先体验模型，再下载代码。

---

# 7. Model Card

每个模型都有对应的 Model Card。

阅读顺序建议如下：

1. 模型简介
2. 模型能力
3. 使用方法
4. 推理示例
5. 模型限制
6. License

阅读 Model Card 是学习新模型的第一步。

---

# 8. Dataset Card

每个数据集都有对应的 Dataset Card。

重点关注：

* 数据来源
* 数据规模
* 数据格式
* License
* 使用示例

不要直接下载数据集而不阅读说明。

---

# 9. 实验室重点关注模型

建议重点关注以下组织。

## Qwen

https://huggingface.co/Qwen

主要学习：

* Qwen3
* Qwen3-VL
* Qwen 系列模型

---

## docling-project

https://huggingface.co/docling-project

主要学习：

* SmolDocling
* Docling Models

---

## Microsoft

https://huggingface.co/microsoft

重点关注：

* Florence
* Phi
* Document Intelligence

---

## Hugging Face

https://huggingface.co/huggingface

学习官方示例和工具。

---

# 10. 实验室重点关注数据集

建议重点学习：

* DocLayNet
* PubLayNet
* OmniDocBench
* DocVQA
* OCRBench

了解：

* 数据格式
* 标注方式
* 下载方法

---

# 11. Transformers

官方文档：

https://huggingface.co/docs/transformers

主要学习：

* AutoTokenizer
* AutoProcessor
* AutoModel
* Pipeline

后续课程将详细介绍。

---

# 12. 推荐学习顺序

建议按照以下顺序学习。

```text
Hugging Face 官网
        │
        ▼
Model Hub
        │
        ▼
Dataset Hub
        │
        ▼
Model Card
        │
        ▼
Transformers
        │
        ▼
官方 Demo
```

---

# 13. 实验室使用规范

实验室统一规定：

GitHub：

* 保存源码
* 保存文档

Hugging Face：

* 下载模型
* 下载数据集
* 管理模型版本（后续课程）

不要将大型模型文件上传至 GitHub。

---

# 14. 推荐学习资源

## Hugging Face 官网

https://huggingface.co/

---

## Models

https://huggingface.co/models

---

## Datasets

https://huggingface.co/datasets

---

## Spaces

https://huggingface.co/spaces

---

## Transformers

https://huggingface.co/docs/transformers

---

## PEFT

https://huggingface.co/docs/peft

---

# 15. 本章实践

请完成以下任务。

## 任务一

注册 Hugging Face 账号。

---

## 任务二

浏览 Qwen 官方主页。

---

## 任务三

浏览 Docling 官方主页。

---

## 任务四

阅读一个 Model Card。

---

## 任务五

阅读一个 Dataset Card。

---

## 任务六

体验一个 Hugging Face Space。

---

# 16. 本章总结

完成本章后，你应该能够：

* 熟悉 Hugging Face 平台
* 查找并下载模型
* 查找并下载数据集
* 阅读官方模型说明
* 理解实验室模型管理方式

---

# 下一章

下一章学习：

> **Chapter 4：Kaggle**

主要内容：

* Kaggle 平台介绍
* Notebook 使用
* GPU 使用
* Dataset 管理
* AI 模型快速验证
* 实验室 Kaggle 开发规范

完成后，你将能够利用 Kaggle 快速完成模型验证和实验开发，为后续学习 Qwen3.5-VL 和 SmolDocling 做好准备。


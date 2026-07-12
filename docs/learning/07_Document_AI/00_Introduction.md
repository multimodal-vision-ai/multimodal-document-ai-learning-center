# Chapter 8：Document AI

# Introduction to Document AI

---

# 1. 学习目标（Learning Objectives）

完成本章学习后，你应该能够：

* 理解 Document AI 的基本概念
* 了解现代 Document AI 系统组成
* 掌握文档智能处理流程
* 熟悉主要研究任务
* 了解主流公开数据集
* 理解实验室技术路线
* 为后续科研做好知识准备

---

# 2. 什么是 Document AI？

Document AI（文档智能）是利用人工智能技术自动理解、分析和处理文档内容的研究领域。

处理对象包括：

* PDF
* 扫描文档
* 图片
* 表格
* 表单
* 学术论文
* 合同
* 发票
* 证件
* 手写文档

Document AI 的目标不仅是识别文字，更重要的是**理解文档的结构与语义**。

---

# 3. 为什么研究 Document AI？

传统 OCR 只能识别文字。

现代 Document AI 更关注：

* 文档结构
* 页面布局
* 阅读顺序
* 表格关系
* 图文关系
* 文档语义

随着 Vision Language Model 的发展，Document AI 已成为多模态人工智能的重要研究方向。

---

# 4. Document AI 技术流程

一个典型的 Document AI 系统通常包含以下流程：

```text id="jlblqx"
文档输入
      │
      ▼
图像预处理
      │
      ▼
OCR
      │
      ▼
版面分析
      │
      ▼
文档结构恢复
      │
      ▼
内容理解
      │
      ▼
结构化输出
```

实验室后续所有项目都围绕这一流程展开。

---

# 5. 核心研究任务

## OCR（Optical Character Recognition）

识别文档中的文字内容。

---

## Layout Analysis

识别标题、正文、图片、页眉、页脚、公式等版面元素。

---

## Reading Order

恢复正确的阅读顺序。

---

## Table Recognition

识别并恢复表格结构。

---

## Formula Recognition

识别数学公式并转换为可编辑格式。

---

## Chart Understanding

理解图表中的信息。

---

## Document Parsing

将复杂文档转换为结构化表示。

---

## Information Extraction

提取指定信息，如姓名、日期、金额、编号等。

---

# 6. 主流技术路线

目前主要有三类技术路线：

| 技术路线                  | 特点               |
| --------------------- | ---------------- |
| OCR + Rules           | 传统方法，依赖规则，泛化能力有限 |
| OCR + Deep Learning   | 使用深度学习提升识别效果     |
| Vision Language Model | 端到端、多模态理解，当前主流方向 |

实验室重点关注第三种技术路线。

---

# 7. 主流模型

建议重点关注以下模型。

| 模型           | 主要特点      |
| ------------ | --------- |
| Qwen3.5-VL   | 通用视觉语言模型  |
| SmolDocling  | 文档解析      |
| InternVL     | 多模态理解     |
| Florence     | 图像理解      |
| PaddleOCR-VL | OCR 与文档理解 |
| MinerU       | PDF 解析    |

后续课程将逐步学习这些模型。

---

# 8. 主流公开数据集

建议熟悉以下数据集。

| 数据集          | 应用方向             |
| ------------ | ---------------- |
| OmniDocBench | 综合文档理解 Benchmark |
| DocLayNet    | 版面分析             |
| PubLayNet    | 学术文档版面分析         |
| DocVQA       | 文档问答             |
| OCRBench     | OCR Benchmark    |

阅读数据集说明，了解数据格式和评测方式。

---

# 9. 实验室技术路线

实验室主要采用以下技术路线：

```text id="xq1p3q"
公开数据集
      │
      ▼
基础模型
      │
      ▼
Prompt Engineering
      │
      ▼
Benchmark
      │
      ▼
模型优化
      │
      ▼
微调（LoRA）
      │
      ▼
科研论文
```

坚持"先复现，再优化，最后创新"的研究思路。

---

# 10. 本章实践（Hands-on Practice）

完成以下任务。

## 任务一

阅读一个 Document AI 模型的官方介绍。

---

## 任务二

下载一个公开文档数据集。

---

## 任务三

使用任意模型完成一次文档解析实验。

---

## 任务四

分析模型在以下任务中的表现：

* OCR
* 版面分析
* 表格识别
* 阅读顺序

记录实验结果。

---

## 任务五

绘制你理解的 Document AI 技术流程图。

---

# 11. 本章总结（Summary）

本章建立了 Document AI 的整体知识体系。

完成本章后，你应该能够：

* 理解 Document AI 的研究目标
* 掌握典型技术流程
* 了解核心研究任务
* 熟悉主流模型与数据集
* 理解实验室整体研究路线

这将为后续科研工作提供理论基础。

---

# 12. 下一章（Next Chapter）

下一章学习：

> **Chapter 9：First Research Project**

主要内容包括：

* 实验室第一个完整项目
* 数据准备
* 模型运行
* 实验记录
* Benchmark 测试
* 结果分析
* GitHub 项目管理

完成后，你将独立完成第一个 Multimodal Document AI 科研实践项目，并掌握实验室标准的项目开发流程。

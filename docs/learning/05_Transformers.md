# Chapter 5：Transformers

# Hugging Face Transformers

---

# 1. 学习目标

完成本章学习后，你应该能够：

* 理解 Transformers 框架的作用
* 熟悉 Hugging Face Transformers 生态
* 掌握模型加载与推理流程
* 理解 Tokenizer 与 Processor 的区别
* 独立运行主流开源模型
* 为后续学习 Qwen3.5-VL 和 SmolDocling 做好准备

---

# 2. 什么是 Transformers？

Transformers 是 Hugging Face 开源的深度学习框架，是目前 AI 模型开发和推理的事实标准。

官方网站：

https://huggingface.co/docs/transformers

支持：

* 大语言模型（LLM）
* 多模态模型（VLM）
* 图像模型（Vision）
* 语音模型（Speech）
* 文档理解模型（Document AI）

---

# 3. 为什么学习 Transformers？

目前绝大多数开源 AI 模型均基于 Transformers 开发。

例如：

* Qwen
* Llama
* InternVL
* Florence
* SmolVLM
* Molmo
* Phi

掌握 Transformers 后，可以快速上手大多数模型。

---

# 4. Transformers 生态

主要组件如下：

| 组件                     | 功能      |
| ---------------------- | ------- |
| AutoTokenizer          | 文本编码    |
| AutoProcessor          | 多模态输入处理 |
| AutoModel              | 加载基础模型  |
| AutoModelForCausalLM   | 文本生成模型  |
| AutoModelForVision2Seq | 多模态模型   |
| Pipeline               | 快速推理接口  |

---

# 5. 模型加载流程

典型流程如下：

```text
下载模型
    │
    ▼
加载 Processor
    │
    ▼
加载 Model
    │
    ▼
准备输入
    │
    ▼
模型推理
    │
    ▼
结果解码
```

理解这一流程，是学习所有模型的基础。

---

# 6. Tokenizer 与 Processor

## Tokenizer

主要用于文本模型。

负责：

* 文本切分
* Token 编码
* Token 解码

适用于：

* GPT
* Qwen（文本）
* Llama

---

## Processor

主要用于多模态模型。

负责：

* 图像处理
* 文本处理
* 多模态输入组织

适用于：

* Qwen-VL
* SmolDocling
* Florence
* InternVL

对于 Document AI，Processor 是重点。

---

# 7. 常见模型加载方式

文本模型：

* AutoTokenizer
* AutoModelForCausalLM

多模态模型：

* AutoProcessor
* AutoModelForVision2Seq（或模型官方推荐接口）

学习时应优先参考模型官方文档。

---

# 8. Pipeline

Transformers 提供 Pipeline 用于快速体验模型。

常见任务包括：

* 文本生成
* 图像分类
* OCR
* 图像描述
* 文档理解

科研开发中，更推荐直接使用官方示例代码，以便灵活控制推理流程。

---

# 9. 实验室统一推理流程

实验室建议采用统一的模型推理流程。

```text
下载模型
        │
        ▼
加载 Processor
        │
        ▼
加载 Model
        │
        ▼
读取图片
        │
        ▼
构建 Prompt
        │
        ▼
模型推理
        │
        ▼
保存结果
        │
        ▼
结果分析
```

后续所有实验均遵循这一流程。

---

# 10. 推荐学习模型

建议按以下顺序学习。

1. Qwen3.5-VL
2. SmolDocling
3. Florence
4. InternVL
5. Molmo

完成后，可进一步学习其他多模态模型。

---

# 11. 推荐学习资源

## Transformers 官方文档

https://huggingface.co/docs/transformers

---

## Transformers GitHub

https://github.com/huggingface/transformers

---

## Hugging Face Model Hub

https://huggingface.co/models

---

## Hugging Face Documentation

https://huggingface.co/docs

---

# 12. 本章实践

请完成以下任务。

## 任务一

安装最新版 Transformers。

---

## 任务二

阅读 Transformers 官方文档首页。

---

## 任务三

阅读 AutoProcessor 文档。

---

## 任务四

阅读 AutoModel 文档。

---

## 任务五

运行一个官方示例模型。

---

## 任务六

总结模型加载流程，并绘制自己的流程图。

---

# 13. 实验室规范

实验室统一要求：

* 优先阅读官方文档
* 优先使用官方示例代码
* 保持依赖版本一致
* 记录模型版本
* 记录实验环境

保证实验具有良好的可复现性。

---

# 14. 本章总结

完成本章后，你应该能够：

* 理解 Transformers 的整体架构
* 区分 Tokenizer 与 Processor
* 掌握模型加载流程
* 熟悉多模态模型推理过程
* 为学习 Qwen3.5-VL 做好准备

---

# 下一章

下一章学习：

> **Chapter 6：Qwen3.5-VL-0.8B**

主要内容：

* Qwen 模型家族
* Qwen3.5-VL 架构
* 模型下载
* 官方 Demo
* 图像理解
* OCR 能力
* 文档理解
* Prompt 编写
* 源码阅读
* 实验室实践规范

完成后，你将能够独立运行 Qwen3.5-VL-0.8B，并开展 Document AI 相关实验。


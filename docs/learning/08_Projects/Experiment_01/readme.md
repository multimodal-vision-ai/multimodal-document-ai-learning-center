# 🧪 Experiment 01：Multimodal Vision AI 基础实验

本实验是 **Multimodal Vision AI Learning Center** 第一个科研实践项目。

通过本实验，学生将完成一次完整的人工智能实验流程：

> 项目创建 → 环境配置 → 数据准备 → 模型推理 → 实验分析 → Benchmark评测

---

# 🎯 实验目标

完成本实验后，学生能够：

* 掌握 AI 科研项目基本流程
* 熟悉 GitHub 项目管理方法
* 学习 Vision Language Model 使用方法
* 完成一次完整模型实验
* 掌握实验结果分析方法

---

# 🗺️ 实验流程

本实验包含 7 个阶段：

| 阶段      | 内容             | 学习目标         |
| ------- | -------------- | ------------ |
| Part 01 | 实验准备           | 完成人工智能实验环境配置 |
| Part 02 | 创建 GitHub 科研项目 | 掌握科研项目管理方法   |
| Part 03 | 构建项目目录结构       | 学习 AI 工程组织方式 |
| Part 04 | 数据集准备          | 掌握数据管理流程     |
| Part 05 | 模型准备与推理        | 完成大模型运行实验    |
| Part 06 | Prompt设计与实验分析  | 学习实验设计方法     |
| Part 07 | Benchmark评测与总结 | 掌握模型评价方法     |

---

# 📚 实验步骤

## [Part 01：实验准备](Part01-实验准备.md)

### 学习目标

完成人工智能实验基础环境配置。

### 主要内容

* GitHub账号配置
* Git基础操作
* Python开发环境
* GPU实验环境
* AI开发工具安装

---

## [Part 02：创建 GitHub 科研项目](Part02-创建Github科研项目仓库.md)

### 学习目标

建立规范的 AI 科研项目仓库。

### 主要内容

* 创建 GitHub Repository
* README 文件设计
* License 配置
* Git 版本管理
* 项目协作流程

---

## [Part 03：构建项目目录结构](Part03-构建项目目录.md)

### 学习目标

掌握 AI 项目的标准工程组织方式。

### 推荐项目结构

```text
project/

├── README.md

├── configs/

├── data/

├── models/

├── notebooks/

├── scripts/

├── src/

├── results/

└── docs/
```

### 主要内容

* 代码组织
* 配置文件管理
* 实验结果保存
* 文档管理

---

## [Part 04：数据集准备](Part04-数据集准备.md)

### 学习目标

掌握人工智能实验的数据管理流程。

### 主要内容

* 数据集选择
* 数据下载
* 数据格式分析
* 数据预处理
* 数据划分

### 典型数据结构

```text
dataset/

├── images/

├── annotations/

├── train.json

└── test.json
```

---

## [Part 05：模型准备与推理](Part05-模型准备与推理.md)

### 学习目标

完成第一个 Vision Language Model 推理实验。

### 主要内容

* Hugging Face模型加载
* 模型推理
* GPU运行
* 输出结果保存

### 示例模型

| 模型          | 类型                    |
| ----------- | --------------------- |
| Qwen-VL     | Vision Language Model |
| Qwen2.5-VL  | Vision Language Model |
| Docling     | Document AI           |
| SmolDocling | Document Parsing      |

---

## [Part 06：Prompt设计与实验分析](Part06-提示词管理与对比分析.md)

### 学习目标

掌握大模型实验中的 Prompt 设计方法。

### 主要内容

* Prompt模板设计
* Zero-shot Prompt
* Few-shot Prompt
* 输出格式控制
* 实验结果比较

### 实验流程

```text
设计Prompt

↓

运行模型

↓

保存结果

↓

分析结果

↓

优化Prompt
```

---

## [Part 07：Benchmark评测与总结](Part07-Bechmark评测与总结.md)

### 学习目标

学习标准化模型评价方法。

### 主要内容

* Benchmark选择
* Evaluation Metric
* 实验结果分析
* 实验报告撰写

### 常用评价指标

| 任务                        | 指标            |
| ------------------------- | ------------- |
| OCR                       | Edit Distance |
| 表格理解                      | TEDS          |
| 文档解析                      | CDM           |
| Visual Question Answering | ANLS          |

---

# 📂 实验最终成果

完成实验后，应形成完整实验项目：

```text
Experiment_Result/

├── README.md

├── code/

├── data/

├── models/

├── results/

├── figures/

└── report.md
```

---

# ✅ 实验完成标准

完成 Experiment 01 后，应达到：

* 能够独立创建 AI 实验项目
* 能够运行开源模型
* 能够完成基础实验设计
* 能够分析实验结果
* 能够形成实验总结

---

# 🚀 后续实验方向

完成 Experiment 01 后，可以继续开展：

* Vision Language Model 微调实验
* Document AI 实验
* OCR Benchmark评测实验
* 多模态 Agent 实验
* 垂直领域 AI 应用实验

---

Last Updated: 2026-07-12

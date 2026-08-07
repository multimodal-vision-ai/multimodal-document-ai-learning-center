# 项目实战 01｜Qwen3.5-0.8B 文档理解与评测

> **难度**：入门到进阶 · **对应课程**：Week 4–7 · **建议投入**：12–18 小时 · **最终产出**：可复现项目与小规模评测报告

[从 Part 01 开始](Part01-实验准备.md){ .md-button .md-button--primary }
[返回项目列表](../README.md){ .md-button }

这是学习中心第一个端到端项目。你不会只运行一次模型，而是要留下可复现、可比较、可解释的完整证据。

!!! info "名称与范围"
    本项目使用官方模型 ID `Qwen/Qwen3.5-0.8B`。它是统一视觉—语言模型；“Qwen3.5-VL-0.8B”只是早期课程中的教学名称，不应出现在下载命令或实验记录里。本项目完成的是小规模课程评测，不等同于复现官方完整 Benchmark。

## 先写下项目问题

开始操作前，把下面这句话补完整并写入项目的 `docs/project_plan.md`：

> 在固定模型与样例的前提下，改变 __________，会怎样影响 __________？我将用 __________ 和失败案例来判断。

第一次完成项目时，建议填写为：

> 在固定 `Qwen/Qwen3.5-0.8B`、3–5 个公开文档样例和 generation config 的前提下，改变 **Prompt 约束**，会怎样影响 **文字完整度、结构保持和无依据回答**？我将用 **一个适合任务的指标**和失败案例来判断。

## 项目控制台

| 关卡 | 开始前要有 | 本关只做一件核心事 | 通过证据 | 建议时间 |
| --- | --- | --- | --- | ---: |
| [Part 01](Part01-实验准备.md) | Week 1–4 基础或等价能力 | 写清研究问题、范围与成功标准 | `docs/project_plan.md` | 45 分钟 |
| [Part 02](Part02-创建Github科研项目仓库.md) | GitHub 账号与 Git | 建立研究仓库并完成首次提交 | 可访问仓库与 commit | 45 分钟 |
| [Part 03](Part03-构建项目目录.md) | 已 clone 的空仓库 | 建立最小可复现目录 | README、目录与实验日志 | 60 分钟 |
| [Part 04](Part04-数据集准备.md) | 数据目录与 `.gitignore` | 选择 3–5 个有差异的公开样例 | 数据卡、样例清单与来源 | 90 分钟 |
| [Part 05](Part05-模型准备与推理.md) | 1 个可打开的样例 | 使用官方模型 ID 跑通一次推理 | 代码、metadata 与原始输出 | 2–3 小时 |
| [Part 06](Part06-提示词管理与对比分析.md) | 已固定的模型与样例 | 只改变 Prompt 约束做三组对照 | run 表、原始输出与观察 | 2–3 小时 |
| [Part 07](Part07-Bechmark评测与总结.md) | 完整的对照结果 | 计算一个有效指标并解释失败 | 指标表、错误分析与报告 | 2–3 小时 |

每完成一关，在自己的 README 中更新一次：当前进度、最新运行命令、已知问题和下一步。不要等到最后才补实验记录。

## 官方材料只用这四个入口

1. [Qwen/Qwen3.5-0.8B Model Card](https://huggingface.co/Qwen/Qwen3.5-0.8B)：模型 ID、当前用法、license 与能力边界；
2. [Transformers 多模态消息格式](https://huggingface.co/docs/transformers/chat_templating_multimodal)：图像与文本输入格式；
3. [OmniDocBench 官方数据集](https://huggingface.co/datasets/opendatalab/OmniDocBench)：数据卡、文件与使用限制；
4. [OmniDocBench 官方评测仓库](https://github.com/opendatalab/OmniDocBench)：数据格式、配置和正式指标实现。

!!! warning "先完成最小路线"
    第一次只选 3–5 个样例、一个模型和一个研究变量。跑通并解释小实验后，再扩展完整数据集、更多模型或正式 OmniDocBench evaluation suite。

## 独立完成时的三条规则

1. **没有证据，不进入下一关**：每关至少留下一个文件、一次原始输出或一个 commit。
2. **一次只改一个变量**：模型、样例、Prompt 和 generation config 不要同时改变。
3. **失败也是结果**：保留错误输出和未解决问题；不要把人工修订后的内容当成模型原始输出。

通过本实验，学生将完成一次完整的人工智能实验流程：

> 项目创建 → 环境配置 → 数据准备 → 模型推理 → 受控实验 → 小规模评测

---

## 实验目标

完成本实验后，学生能够：

* 掌握 AI 科研项目基本流程
* 熟悉 GitHub 项目管理方法
* 学习 Vision Language Model 使用方法
* 完成一次完整模型实验
* 掌握实验结果分析方法

---

## 实验流程

本实验包含 7 个阶段：

| 阶段      | 内容             | 学习目标         |
| ------- | -------------- | ------------ |
| Part 01 | 实验准备           | 完成人工智能实验环境配置 |
| Part 02 | 创建 GitHub 科研项目 | 掌握科研项目管理方法   |
| Part 03 | 构建项目目录结构       | 学习 AI 工程组织方式 |
| Part 04 | 数据集准备          | 掌握数据管理流程     |
| Part 05 | 模型准备与推理        | 完成大模型运行实验    |
| Part 06 | Prompt设计与实验分析  | 学习实验设计方法     |
| Part 07 | 小规模评测与总结 | 掌握模型评价方法     |

---

## 实验步骤

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
├── requirements.in
├── requirements-lock.txt
├── data/
├── scripts/
├── outputs/
├── experiments/
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
data/

├── README.md
├── raw/
└── samples/
    └── manifest.csv
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

### 本项目固定模型

| 官方模型 ID | 类型 | 为什么选择 |
| --- | --- | --- |
| [`Qwen/Qwen3.5-0.8B`](https://huggingface.co/Qwen/Qwen3.5-0.8B) | Unified Vision-Language Model | 规模较小，适合完成课程原型与受控实验 |

第一次完成项目时不要中途更换模型；跨模型比较属于完成七关后的扩展实验。

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

## [Part 07：小规模评测与总结](Part07-Bechmark评测与总结.md)

### 学习目标

学习标准化模型评价方法。

### 主要内容

* 评测问题与指标选择
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

## 实验最终成果

完成实验后，应形成完整实验项目：

```text
Experiment_Result/

├── README.md
├── requirements.in
├── requirements-lock.txt
├── data/
├── scripts/
├── outputs/
│   ├── raw/
│   ├── metadata/
│   ├── figures/
│   └── logs/
├── experiments/
└── docs/
    └── project_summary.md
```

---

## 实验完成标准

完成 Experiment 01 后，应达到：

* 能够独立创建 AI 实验项目
* 能够运行开源模型
* 能够完成基础实验设计
* 能够分析实验结果
* 能够形成实验总结

---

## 后续实验方向

完成 Experiment 01 后，可以继续开展：

* Vision Language Model 微调实验
* Document AI 实验
* OCR Benchmark评测实验
* 多模态 Agent 实验
* 垂直领域 AI 应用实验

---

Last Updated: 2026-08-07

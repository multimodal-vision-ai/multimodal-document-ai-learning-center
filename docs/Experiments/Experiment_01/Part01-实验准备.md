# Experiment 01：Qwen3.5-VL 文档理解实验指导书

> Lab Manual for Multimodal Document AI Laboratory

---

# Part 1：实验准备（Experiment Preparation）

---

# 一、实验简介（Experiment Overview）

欢迎来到实验室的第一个正式科研实验。

本实验的目标不是简单运行一个开源模型，而是按照实验室统一规范，独立完成一个可复现、可管理、可持续迭代的科研项目。

完成本实验后，你将掌握实验室最基本的科研开发流程，包括：

* 创建科研项目
* 管理 GitHub 仓库
* 配置开发环境
* 下载开源模型
* 完成第一次模型推理
* 规范记录实验过程
* 提交实验成果

> **重要说明：**
>
> 本实验要求严格按照实验指导书完成，不建议自行修改目录结构或跳过任何步骤。

---

# 二、实验目标（Learning Objectives）

完成本实验后，你应该能够：

* 建立符合实验室规范的 GitHub 项目；
* 理解项目目录结构及各目录作用；
* 独立完成开发环境检查；
* 为后续实验做好准备；
* 养成规范记录科研实验的习惯。

---

# 三、实验要求（Prerequisites）

开始实验前，请确认已经完成以下课程。

| 已完成 | 学习内容                      |
| --- | ------------------------- |
| □   | Chapter 1：Git 与 GitHub    |
| □   | Chapter 2：Python 开发环境     |
| □   | Chapter 3：Hugging Face    |
| □   | Chapter 4：Kaggle          |
| □   | Chapter 5：Transformers    |
| □   | Chapter 6：Qwen3.5-VL-0.8B |
| □   | Chapter 8：Document AI     |

如果上述课程尚未完成，请先完成学习，再继续本实验。

---

# 四、实验成果（Deliverables）

本实验最终需要提交以下成果。

```text
first-document-ai-project/

├── README.md
├── requirements.txt
├── environment.yml
├── data/
├── models/
├── scripts/
├── outputs/
├── experiments/
├── docs/
└── notebooks/
```

所有文件均需提交至 GitHub 仓库。

---

# 五、实验规范（Laboratory Rules）

为了保证实验结果具有可复现性，实验室统一规定：

1. 所有代码必须使用 GitHub 管理；
2. 每次实验必须记录实验日志；
3. 不得直接修改官方源码，建议在自己的项目中调用官方接口；
4. 每完成一个阶段，及时提交 Git（Commit）；
5. 每次实验均应保留输入数据、Prompt、输出结果和分析结论。

---

# 六、开始实验前的检查（Environment Checklist）

请逐项确认以下内容。

## 1. GitHub

* □ 已注册 GitHub 账号；
* □ 已安装 Git；
* □ 已配置 SSH Key 或 Personal Access Token；
* □ 能够正常 Push 与 Pull。

---

## 2. Python

* □ 已安装 Python；
* □ 已安装 Conda（推荐）；
* □ 已创建实验环境（如 `mdai`）；
* □ 能正常运行 Python 程序。

---

## 3. Hugging Face

* □ 已注册 Hugging Face 账号；
* □ 已完成登录；
* □ 能访问模型页面；
* □ 能下载公开模型。

---

## 4. GPU

请选择以下任意一种实验环境。

* □ 本地 GPU；
* □ Kaggle Notebook；
* □ 实验室服务器。

确保后续能够正常运行 Qwen3.5-VL。

---

# 七、自我检查列表（Checklist）

在进入下一部分之前，请导师确认以下内容。

| 检查项              | 状态 |
| ---------------- | -- |
| GitHub 配置完成      | □  |
| Python 环境正常      | □  |
| Hugging Face 可访问 | □  |
| GPU 环境可用         | □  |
| 已完成前置课程学习        | □  |

所有项目均完成后，方可进入 **Part 2：创建 GitHub 科研项目**。

---

# 本部分小结

至此，你已经完成了实验前的所有准备工作。

下一部分将正式开始创建实验项目，并按照实验室统一规范搭建科研项目目录。这将成为你今后所有科研工作的基础模板。

➡️ [进入 Part 02：创建 GitHub 科研项目](Part02-创建Github科研项目仓库.md)
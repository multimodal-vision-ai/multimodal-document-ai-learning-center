# Part 01｜确定目标与实验准备

> Lab Manual for Multimodal Document AI Laboratory

---

> **阶段主题**：Experiment Preparation

[返回项目控制台](README.md){ .md-button }
[下一关：创建 GitHub 项目](Part02-创建Github科研项目仓库.md){ .md-button .md-button--primary }

> **本关核心产出**：`docs/project_plan.md` · **预计时间**：45 分钟

!!! success "本关通过条件"
    你已经写清研究问题、固定变量、唯一自变量、样例范围、成功标准与数据风险；即使暂时没有 GPU，也知道将使用本地、Kaggle 还是实验室服务器完成首次推理。

---

## 一、实验简介（Experiment Overview）

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
> 本实验要求保留每一关的自主检查证据。已经具备某项能力时可以跳过重复操作，但必须留下等价证据，例如可访问的仓库、环境版本记录或一次成功运行。

---

## 二、实验目标（Learning Objectives）

完成本实验后，你应该能够：

* 建立符合实验室规范的 GitHub 项目；
* 理解项目目录结构及各目录作用；
* 独立完成开发环境检查；
* 为后续实验做好准备；
* 养成规范记录科研实验的习惯。

---

## 三、实验要求（Prerequisites）

开始实验前，请确认已经完成以下课程。

| 状态 | 最低前置能力 | 对应入口 |
| --- | --- | --- |
| □ | 能 clone、commit 和 push | [Git 与 GitHub](../../learning/01_Git_and_GitHub.md) |
| □ | 能创建隔离 Python 环境并记录版本 | [Python 与可复现环境](../../learning/02_Python_Environment.md) |
| □ | 能阅读 Model Card 与 Dataset Card | [Hugging Face Hub](../../learning/03_HuggingFace.md) |
| □ | 能运行一个 Transformers 推理示例 | [Transformers 推理](../../learning/05_Transformers.md) |
| 推荐 | 已完成 Qwen3.5 多模态最小实验 | [Qwen3.5-0.8B 多模态推理](../../learning/06-1_Qwen3.5-VL-0.8B.md) |
| 后续补充 | 理解 Document AI 任务与指标 | [Document AI 与评测](../../learning/07_Doc_AI.md) |

如果最低前置能力中有一项无法完成，先进入对应页面补齐；Kaggle 和完整 Document AI 评测不是开始 Part 01 的硬性条件。

### 写出项目计划

创建 `docs/project_plan.md`，至少回答：

```markdown
# Project Plan
- 研究问题：
- 固定内容：模型、样例、generation config
- 唯一自变量：
- 观察指标：
- 最小样例范围：
- 完成标准：
- 数据许可与隐私风险：
- 计算平台与备选方案：
```

这份计划不是形式材料。Part 06 的实验变量和 Part 07 的结论都必须回到这里。

---

## 四、实验成果（Deliverables）

本实验最终需要提交以下成果。

```text
first-document-ai-project/

├── README.md
├── requirements.in
├── requirements-lock.txt
├── environment.yml
├── data/
├── scripts/
├── outputs/
├── experiments/
└── docs/
```

代码、说明、配置和允许公开的小样例提交至 GitHub；模型权重、完整数据、密钥和私人文档不得提交。`models/`、`notebooks/`、`assets/` 等目录只在项目实际需要时创建。

---

## 五、实验规范（Laboratory Rules）

为了保证实验结果具有可复现性，实验室统一规定：

1. 所有代码必须使用 GitHub 管理；
2. 每次实验必须记录实验日志；
3. 不得直接修改官方源码，建议在自己的项目中调用官方接口；
4. 每完成一个阶段，及时提交 Git（Commit）；
5. 每次实验均应保留输入数据、Prompt、输出结果和分析结论。

---

## 六、开始实验前的检查（Environment Checklist）

请逐项确认以下内容。公开模型和数据通常可以先浏览；只有实际下载或平台访问需要认证时，再完成对应登录。

### 1. GitHub

* □ 已注册 GitHub 账号；
* □ 已安装 Git；
* □ 已配置 SSH Key 或 Personal Access Token；
* □ 能够正常 Push 与 Pull。

---

### 2. Python

* □ 已安装 Python；
* □ 已安装 Conda（推荐）；
* □ 已创建实验环境（如 `mdai`）；
* □ 能正常运行 Python 程序。

---

### 3. Hugging Face

* □ 已注册 Hugging Face 账号；
* □ 已完成登录；
* □ 能访问模型页面；
* □ 能下载公开模型。

---

### 4. GPU

请选择以下任意一种实验环境。

* □ 本地 GPU；
* □ Kaggle Notebook；
* □ 实验室服务器。

确保后续能够正常运行官方模型 `Qwen/Qwen3.5-0.8B`，或已经记录可使用的替代计算平台。

---

## 七、自我检查列表（Checklist）

在进入下一部分之前，请根据实际证据完成自检。

| 检查项              | 状态 |
| ---------------- | -- |
| GitHub 配置完成      | □  |
| Python 环境正常      | □  |
| Hugging Face 可访问 | □  |
| GPU 环境可用         | □  |
| 已完成前置课程学习        | □  |
| project_plan.md 已完成 | □  |

最低前置能力、研究问题和计算方案均明确后，即可进入 **Part 2：创建 GitHub 科研项目**。

---

## 本部分小结

至此，你已经完成了实验前的所有准备工作。

下一部分将正式开始创建实验项目，并按照实验室统一规范搭建科研项目目录。这将成为你今后所有科研工作的基础模板。

➡️ [进入 Part 02：创建 GitHub 科研项目](Part02-创建Github科研项目仓库.md)

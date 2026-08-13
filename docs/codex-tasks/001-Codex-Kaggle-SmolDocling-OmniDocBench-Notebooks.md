# Codex Task — Kaggle + SmolDocling + OmniDocBench

- Status: In Progress — Phase 1 完成；Phase 2 完成并通过 Kaggle 实测（smoke v6 全步骤通过，实测记录见 docs/notebook-design.md §13.4）；Phase 3 完成（Notebook 02/03/05/06 + src/training.py，本地验证通过，待 Kaggle 实测）；下一步 Phase 4
- Created: 2026-08-13
- Owner: Guoping Tan
- Research Direction: Document AI
- Target Platform: Kaggle Free NVIDIA GPU
- Model: SmolDocling-256M
- Benchmark: OmniDocBench
- Target Repository: multimodal-document-ai-learning-center
- Purpose: Build a complete student-oriented Document AI research notebook track

---

## Codex Prompt

[下面开始放完整提示词]

你现在作为 **MV-AI Lab 的高级 AI Research Engineer、Document AI 研究员和科研课程设计专家**，请在当前仓库中设计并实现一套完整、可运行、面向本科高年级和研究生的 **Document AI Research Notebooks**。

这不是简单的模型 Demo，而是一套“从第一次运行模型到形成论文问题”的完整科研训练路径。

---

# 一、总体目标

基于：

* **Kaggle 免费 NVIDIA GPU**
* **SmolDocling-256M**
* **最新公开版 OmniDocBench**
* Python
* PyTorch
* Hugging Face Transformers
* Docling / DocTags
* 官方 OmniDocBench Evaluation

建立一套循序渐进、可以在 Kaggle 上逐个运行的 Jupyter Notebooks。

学生完成全部 Notebooks 后，应真正理解并亲手完成：

1. 数据如何组织
2. Prompt 如何设计
3. Baseline 如何建立
4. SFT 怎么做
5. LoRA 怎么做
6. Benchmark 怎么设计
7. 如何分析错误
8. 如何设计消融实验
9. 如何比较模型与方法
10. 如何从实验结果形成真正的科研问题和论文假设

最终目标不是“学会调用 SmolDocling”，而是：

> 从 AI 使用者成长为能够独立设计 Document AI 实验的初级研究者。

---

# 二、重要原则：先核实最新官方版本

在写任何代码之前，首先检查最新官方资料，不允许根据旧教程或记忆直接写代码。

必须核实：

## SmolDocling

优先使用官方模型：

`docling-project/SmolDocling-256M-preview`

检查：

* 官方 Hugging Face Model Card
* Docling 官方仓库
* 官方推荐 inference API
* 当前 Transformers 兼容方式
* 当前 processor / model class
* DocTags 输出格式
* DocTags → DoclingDocument → Markdown/JSON 的转换方式

如果官方模型名称、接口或推荐加载方式已经发生变化，以当前官方版本为准。

---

## OmniDocBench

只使用：

**OpenDataLab 官方 OmniDocBench 仓库和官方公开数据。**

必须先检查：

* 当前最新 release/tag
* `main` 分支最新稳定状态
* 当前 README
* dataset 下载方式
* annotation schema
* evaluation scripts
* end2end evaluation
* md2md evaluation
* text metric
* formula metric
* table metric
* reading order metric
* layout metric

不要默认使用早期 OmniDocBench v1.0 / v1.5。

当前官方仓库已经更新过数据规模和评测方式，因此：

**程序必须自动记录：**

* OmniDocBench version/tag
* Git commit hash
* 下载日期
* dataset size
* page count
* evaluation config

写入：

`experiment_metadata.json`

确保未来论文实验能够复现。

如果最新 `main` 与 release 版存在差异：

优先选择：

> 最新官方稳定 release

如果没有清晰 release：

锁定一个明确 commit hash，并在 README 中说明。

---

# 三、Kaggle 是默认运行平台

所有 Notebook 首先保证：

> 在 Kaggle 免费 NVIDIA GPU 环境能够独立运行。

禁止默认假设：

* 本地 RTX 4090
* A100 80GB
* H100
* 多机多卡
* 商业云 GPU

Notebook 必须自动检测 GPU：

```python
!nvidia-smi
```

并输出：

* GPU 型号
* CUDA version
* VRAM
* PyTorch version
* transformers version
* docling version

每个 Notebook 都应尽可能控制在 Kaggle 免费资源可以完成的范围。

优先：

* FP16 / BF16（按 GPU 能力自动选择）
* batch size = 1–2
* gradient accumulation
* gradient checkpointing
* LoRA
* 小规模训练 subset
* 可恢复 checkpoint
* 推理缓存

不要为了演示 SFT 而设计需要几十小时 GPU 的训练。

---

# 四、Notebook 总体结构

请创建如下目录：

```text
notebooks/
│
├── 00_Environment_and_First_Run.ipynb
├── 01_Understanding_OmniDocBench.ipynb
├── 02_Dataset_Engineering.ipynb
├── 03_Prompt_Engineering.ipynb
├── 04_Baseline_Inference.ipynb
├── 05_SFT_Fundamentals.ipynb
├── 06_LoRA_Fine_Tuning.ipynb
├── 07_Benchmark_and_Evaluation.ipynb
├── 08_Error_Analysis.ipynb
├── 09_Ablation_Study.ipynb
├── 10_From_Experiments_to_Research_Questions.ipynb
│
└── README.md
```

同时创建：

```text
src/
configs/
scripts/
results/
reports/
assets/
```

不要把所有代码重复写在 Notebook 中。

可以复用的代码应逐渐抽离到：

```text
src/
```

例如：

```text
src/
├── data.py
├── model.py
├── inference.py
├── prompts.py
├── training.py
├── evaluation.py
├── visualization.py
└── error_analysis.py
```

目标是让学生逐渐理解：

> Notebook 用于实验，
> Python module 用于可复现研究工程。

---

# 五、Notebook 00：Environment and First Run

目标：

让一个第一次接触 Document AI 的学生在 Kaggle 上成功运行 SmolDocling。

必须包括：

### Step 1

检查 Kaggle GPU。

### Step 2

安装依赖。

要求：

尽量固定经过测试的版本。

不要简单：

```bash
pip install -U everything
```

应生成：

```text
requirements-kaggle.txt
```

并记录版本。

### Step 3

加载 SmolDocling-256M。

### Step 4

输入一张简单文档图片。

### Step 5

运行 inference。

### Step 6

展示：

* raw generation
* DocTags
* Markdown
* JSON / DoclingDocument

### Step 7

解释：

SmolDocling 到底在做什么？

必须解释：

```text
Document Image
      ↓
Vision Encoder
      ↓
Multimodal Model
      ↓
Structured Generation
      ↓
DocTags
      ↓
Document Structure
```

Notebook 最后设置：

### Research Checkpoint

让学生回答：

> SmolDocling 与传统 OCR 最大区别是什么？

---

# 六、Notebook 01：Understanding OmniDocBench

不要立即训练。

首先教学生理解 Benchmark。

必须完成：

### 数据下载

采用官方最新公开方式。

如果数据需要 Hugging Face / OpenDataLab / Git LFS：

写出 Kaggle 可执行下载流程。

### 数据结构分析

展示：

```text
image
annotation
document_type
language
layout
text
formula
table
reading_order
bbox
attributes
```

根据最新官方 schema 实际调整。

禁止凭空假设字段。

### 可视化

随机选择至少：

* academic paper
* textbook
* newspaper
* PPT/slides
* financial report
* handwritten / notes（若最新版包含）

展示页面和 annotations。

### 统计分析

生成：

* document type distribution
* language distribution
* layout distribution
* page complexity
* text/table/formula数量
* annotation类别

让学生理解：

> Benchmark 不是一个数字，而是一组具有不同难度属性的数据。

---

# 七、Notebook 02：Dataset Engineering

核心目标：

教学生：

> 数据不是“下载下来就训练”。

建立训练数据工程。

完成：

```text
Raw OmniDocBench
      ↓
Inspect
      ↓
Clean
      ↓
Normalize
      ↓
Split
      ↓
Training Samples
```

必须设计：

### train / validation / test

注意：

OmniDocBench 本质上首先是 Benchmark 数据。

必须讨论：

**是否应该直接拿 Benchmark test set 训练？**

要求明确讲解：

> Benchmark contamination / data leakage

因此：

默认不得把正式 benchmark test pages 全部作为训练数据后再在同一集合报告成绩。

设计两种模式：

### Teaching Mode

为了学习训练流程：

只取一个明确标记的 teaching subset。

### Research Mode

严格保持：

```text
train
validation
official benchmark test
```

隔离。

如果 OmniDocBench 官方并未提供适合 SFT 的训练 split：

必须在 Notebook 中明确说明这一事实。

不得伪造官方 training set。

可建立：

```text
OmniDocBench-derived teaching subset
```

但必须明确：

> NOT for official benchmark claims.

---

# 八、Notebook 03：Prompt Engineering

这是重点 Notebook。

不要只给一个 prompt。

建立：

## Prompt v0

最简单：

```text
Convert this page to DocTags.
```

## Prompt v1

强调 OCR。

## Prompt v2

强调：

* reading order
* tables
* formulas
* layout structure

## Prompt v3

针对 Document AI structured parsing。

要求学生比较不同 Prompt 对：

* text
* table
* formula
* reading order
* hallucination

的影响。

建立：

```text
prompts/
```

或者：

```python
PROMPT_V0
PROMPT_V1
PROMPT_V2
PROMPT_V3
```

每次 inference 必须记录：

```text
prompt_id
model_version
image_id
generation_config
output
latency
```

最终形成：

### Prompt Benchmark Table

至少比较：

```text
Prompt
Text
Table
Formula
Reading Order
Latency
```

让学生理解：

> Prompt 本身就是实验变量。

---

# 九、Notebook 04：Baseline Inference

建立真正的：

> Zero-shot Baseline

至少随机抽取一个适合 Kaggle 的 subset：

例如：

```text
50–200 pages
```

具体大小根据 GPU 和运行时间自动调整。

必须支持：

```python
FAST_MODE = True
```

FAST_MODE：

10–20 pages

FULL_TEACHING_MODE：

50–200 pages

RESEARCH_MODE：

完整 benchmark

必须：

* batch inference
* progress bar
* checkpoint
* resume
* skip existing outputs
* output cache

所有结果保存：

```text
results/baseline/
```

禁止 notebook 重启后全部丢失。

---

# 十、Notebook 05：SFT Fundamentals

重点不是追求最好分数。

而是让学生理解：

> Supervised Fine-Tuning 到底改变了什么。

首先解释训练样本：

```text
Image
+
Instruction
+
Target DocTags
```

建立：

```text
Dataset
↓
Processor
↓
Collator
↓
Forward
↓
Loss
↓
Backward
↓
Optimizer
```

建议先用：

20–100 个 samples

进行教学型 SFT。

Kaggle资源优先。

记录：

* training loss
* validation loss
* GPU memory
* training time
* learning rate

要求学生比较：

```text
Before SFT
vs
After SFT
```

并回答：

> Loss 下降是否意味着 Document Parsing 一定变好？

---

# 十一、Notebook 06：LoRA Fine-Tuning

单独教学 LoRA，不要与 SFT Notebook 混在一起。

解释：

```text
Full Fine-Tuning
vs
LoRA
```

包括：

* trainable parameters
* frozen parameters
* LoRA rank
* alpha
* dropout
* target modules
* VRAM
* training speed

打印：

```text
Total parameters
Trainable parameters
Trainable %
```

至少比较：

```text
LoRA r=4
LoRA r=8
LoRA r=16
```

如果 Kaggle 时间不足：

使用 FAST_MODE。

必须记录：

```text
VRAM
training time
validation metric
```

让学生真正看到：

> LoRA 是资源—性能权衡方法，而不是一个神奇开关。

---

# 十二、Notebook 07：Benchmark and Evaluation

这一章必须尽量直接调用：

**OmniDocBench 官方 Evaluation Framework**

不要自己重新发明指标代替官方指标。

按照最新版支持情况评测：

* Text
* Formula
* Table
* Reading Order
* Layout
* Overall / End-to-End

如果官方 metric 包括：

* Edit Distance
* TEDS
* CDM
* Reading Order Edit Distance
* 其它最新版指标

严格按照当前官方定义。

生成：

```text
results/
├── baseline/
├── sft/
└── lora/
```

比较：

```text
Baseline
SFT
LoRA
```

生成 summary：

| Model | Text | Table | Formula | Reading Order | Overall |
| ----- | ---: | ----: | ------: | ------------: | ------: |

同时按：

* language
* document type
* layout
* page difficulty

进行 breakdown。

让学生看到：

> 一个 Overall Score 会隐藏大量问题。

---

# 十三、Notebook 08：Error Analysis

这是整套课程的核心之一。

不要只展示 bad cases。

建立真正的：

## Error Taxonomy

至少包括：

```text
OCR Error
Layout Error
Reading Order Error
Table Error
Formula Error
Missing Content
Hallucination
Repetition
Structure Error
```

如果 OmniDocBench 最新 annotation 支持更细粒度属性：

进一步利用官方属性。

建立：

```text
error_cases.json
```

每个 case 包括：

```text
image
ground_truth
prediction
error_type
document_type
language
metric
notes
```

自动选择：

### Worst Cases

Top 20 worst pages

### Best Improvement Cases

SFT/LoRA 相比 baseline 改善最大的页面。

### Regression Cases

训练后反而变差的页面。

可视化：

```text
Image
Ground Truth
Baseline
Fine-tuned Output
Error
```

学生最终回答：

> 模型到底不会什么？

而不是：

> 模型分数是多少？

---

# 十四、Notebook 09：Ablation Study

教学生第一次设计：

> Controlled Experiment

至少设计四组消融。

### Ablation A：Prompt

```text
simple
vs
structured
```

### Ablation B：Training Data Size

```text
25
50
100
200
```

根据 Kaggle能力调整。

### Ablation C：LoRA Rank

```text
4
8
16
```

### Ablation D：Image Resolution

例如：

```text
low
medium
high
```

但具体尺寸必须根据 SmolDocling 官方 processor 和当前模型能力确定。

所有实验遵循：

> 一次只改变一个主要变量。

生成：

```text
ablation_results.csv
```

以及图表。

要求学生回答：

1. 哪个变量最影响 Text？
2. 哪个最影响 Table？
3. 哪个最影响 Formula？
4. 哪个增加算力但几乎没有提升？
5. 是否存在 diminishing returns？

---

# 十五、Notebook 10：From Experiments to Research Questions

这是最重要的收尾 Notebook。

目标：

从实验结果中生成：

> Scientific Question

而不是让 AI 凭空编论文题目。

首先自动汇总：

```text
Benchmark
+
Error Analysis
+
Ablation
```

寻找：

* systematic weakness
* subgroup performance gap
* robustness gap
* efficiency bottleneck
* structure failure
* prompt sensitivity
* data efficiency issue

然后教学生使用：

```text
Observation
↓
Pattern
↓
Possible Cause
↓
Hypothesis
↓
Research Question
↓
Experiment
```

例如：

不要直接写：

> Improve SmolDocling.

而应形成：

```text
Observation:
Tables degrade much more than text on complex layouts.

Possible Cause:
Spatial structure is insufficiently represented.

Hypothesis:
Structure-aware supervision may improve complex-table parsing.

Research Question:
Can structure-aware supervision improve table parsing
without degrading text recognition in compact VLMs?
```

要求自动生成：

## Research Question Canvas

包含：

```text
Observation
Research Gap
Hypothesis
Independent Variable
Dependent Variable
Baseline
Dataset
Metric
Expected Result
Risk
```

最后让学生形成：

### Mini Research Proposal

控制在约 1 页：

```text
Title
Research Question
Motivation
Hypothesis
Method
Dataset
Benchmark
Ablation
Expected Contribution
Risks
```

---

# 十六、教学设计要求

每个 Notebook 采用统一结构：

```text
# Learning Objectives

# Why This Matters

# Concepts

# Step-by-Step Experiment

# What You Should Observe

# Research Checkpoint

# Exercises

# Takeaways
```

不要写成纯代码 Notebook。

比例建议：

```text
Explanation 30%
Code 50%
Analysis 20%
```

---

# 十七、学生必须亲自完成部分

不要所有答案直接给学生。

每个 Notebook 保留：

```text
TODO
```

以及：

```text
Student Exercise
```

例如：

```python
# TODO:
# Change the prompt and rerun the experiment.
```

但教师版代码必须确保完整答案存在。

建议建立：

```text
solutions/
```

或使用：

```python
SHOW_SOLUTION = False
```

---

# 十八、实验工程规范

所有实验统一记录：

```text
experiment_id
timestamp
model
model_revision
dataset
dataset_version
dataset_commit
prompt
seed
GPU
CUDA
PyTorch
Transformers
Docling
hyperparameters
metrics
runtime
```

固定：

```python
SEED = 42
```

所有结果写入：

```text
results/
```

生成：

```text
experiment_manifest.json
```

---

# 十九、Kaggle资源控制

每个 Notebook README 标记预计：

```text
GPU VRAM:
GPU Time:
Disk:
Internet:
```

例如：

```text
Estimated GPU time: 10–20 minutes
```

但不要猜。

第一次实际运行后更新真实时间。

整个 Teaching Path 的设计目标：

**免费 Kaggle GPU 可以完成主要训练流程。**

完整 OmniDocBench benchmark 如果超过免费额度：

拆成：

```text
Teaching Benchmark
vs
Full Research Benchmark
```

---

# 二十、必须避免的问题

禁止：

1. 把 OmniDocBench test 数据直接训练后又当 official benchmark 报成绩。
2. 使用过时 OmniDocBench schema。
3. 自己发明指标替代官方 Evaluation。
4. Notebook 中硬编码绝对路径。
5. 把 Kaggle `/kaggle/working` 和 `/kaggle/input` 混淆。
6. 重启 Notebook 后必须全部重新 inference。
7. 只有模型调用，没有科研解释。
8. 只有 loss curve，没有真正 benchmark。
9. 把训练提升直接解释为科研贡献。
10. 最后让 LLM 凭空“生成一个论文题目”。

---

# 二十一、README

创建：

`notebooks/README.md`

内容包括：

## Document AI Research Track

### Stage 1 — Use

```text
00 Environment
01 OmniDocBench
```

### Stage 2 — Experiment

```text
02 Dataset
03 Prompt
04 Baseline
```

### Stage 3 — Train

```text
05 SFT
06 LoRA
```

### Stage 4 — Evaluate

```text
07 Benchmark
08 Error Analysis
```

### Stage 5 — Research

```text
09 Ablation
10 Research Questions
```

形成明确学习路线：

```text
Run a Model
     ↓
Understand Data
     ↓
Design Prompt
     ↓
Build Baseline
     ↓
Fine-tune
     ↓
Benchmark
     ↓
Analyze Errors
     ↓
Ablation
     ↓
Hypothesis
     ↓
Research Question
```

---

# 二十二、质量标准

最终不是为了“创建 11 个 ipynb 文件”。

而要做到：

### Reproducible

别人能够重新运行。

### Educational

学生知道为什么这样做。

### Research-oriented

每一步最终指向科研问题。

### Kaggle-friendly

免费 NVIDIA GPU 可以完成核心路径。

### Modular

未来可以把 SmolDocling 替换为：

* Qwen 0.8B VLM
* Qwen 2B VLM
* PaddleOCR-VL
* 其它 Document VLM

而不需要重写整个 Benchmark 框架。

因此：

**Model adapter 与 Benchmark framework 必须解耦。**

---

# 二十三、未来扩展接口

设计：

```python
DocumentModelAdapter
```

例如：

```python
class DocumentModelAdapter:
    def load(self):
        ...

    def predict(self, image, prompt):
        ...

    def save_prediction(self):
        ...
```

SmolDocling 实现：

```text
SmolDoclingAdapter
```

以后可以扩展：

```text
QwenVLAdapter
PaddleOCRVLAdapter
OtherVLMAdapter
```

这样这套 Notebook 最终可以成长为：

> MV-AI Lab Document Intelligence Experimental Framework

而不是一次性教学代码。

---

# 二十四、执行方式

不要一次性盲目生成所有 Notebook。

按照以下流程工作：

## Phase 1 — Repository & Official Source Audit

先检查：

* 当前仓库结构
* OmniDocBench 最新官方状态
* SmolDocling 最新官方状态
* Kaggle 环境要求

输出：

```text
docs/notebook-design.md
```

其中记录：

* 数据版本
* 模型版本
* Notebook 架构
* 技术依赖
* 风险
* Kaggle限制

## Phase 2 — Build Core Infrastructure

先实现：

```text
src/
configs/
```

以及：

```text
00
01
04
07
```

形成：

> Environment → Dataset → Baseline → Benchmark

最小科研闭环。

确保真实运行。

## Phase 3 — Training

再实现：

```text
02
03
05
06
```

## Phase 4 — Research Methodology

最后实现：

```text
08
09
10
```

---

# 二十五、验收标准

完成后必须实际验证：

### Smoke Test

使用 3–5 页 OmniDocBench。

### Teaching Test

使用 10–20 页。

### Training Test

小 subset 完成一次：

```text
LoRA training
↓
save adapter
↓
reload
↓
inference
↓
evaluation
```

### Reproducibility Test

从全新 Kaggle Notebook：

```text
git clone
↓
install
↓
download dataset
↓
load model
↓
run
```

能够成功。

---

# 二十六、最终交付

完成后向我输出：

1. 新建/修改文件清单
2. Notebook 学习路线
3. OmniDocBench 实际使用版本
4. SmolDocling 实际模型 revision
5. Kaggle 测试 GPU
6. 每个 Notebook 是否已 Smoke Test
7. 已知问题
8. 尚未完成项
9. 推荐学生使用顺序
10. 下一步可扩展研究方向

如果某项因为 Kaggle、网络、数据授权或 GPU 限制无法真实验证：

**明确标记，不要假装已经运行成功。**

整个项目优先级始终是：

> 可运行 > 可复现 > 教学清晰 > 科研严谨 > 页面数量。

现在从 **Phase 1 — Repository & Official Source Audit** 开始执行。

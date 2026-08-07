# 项目 01：文档理解与评测

> 使用 `Qwen/Qwen3.5-0.8B` · 对应 Week 4–7 · 项目最小路线 12–18 小时 · 产出可复现项目与小规模评测报告

[从 Part 01 开始](Part01-实验准备.md){ .md-button .md-button--primary }
[返回项目列表](../README.md){ .md-button }

这是学习中心第一个端到端项目。你的目标不只是运行一次模型，而是留下**可复现、可比较、可解释**的完整证据。

!!! info "名称与范围"
    本项目使用官方模型 ID `Qwen/Qwen3.5-0.8B`。它是统一视觉—语言模型；“Qwen3.5-VL-0.8B”只是早期教学名称，不应出现在下载命令或实验记录里。本项目完成小规模课程评测，不等同于复现官方完整 Benchmark。

## 先写项目问题

开始操作前，把下面这句话补完整并写入 `docs/project_plan.md`：

> 在固定模型与样例的前提下，改变 __________，会怎样影响 __________？我将用 __________ 和失败案例来判断。

第一次完成项目时，可以这样填写：

> 在固定 `Qwen/Qwen3.5-0.8B`、3–5 个公开文档样例和 generation config 的前提下，改变 **Prompt 约束**，会怎样影响 **文字完整度、结构保持和无依据回答**？我将用 **一个适合任务的指标**和失败案例来判断。

## 七关控制台

### 1. [确定目标](Part01-实验准备.md) · 45 分钟

写清研究问题、范围与成功标准。通过证据：`docs/project_plan.md` 和自检清单。

### 2. [创建仓库](Part02-创建Github科研项目仓库.md) · 45 分钟

建立研究仓库并完成首次提交。通过证据：可访问的 repository 与 commit 记录。

### 3. [组织目录](Part03-构建项目目录.md) · 60 分钟

分开代码、配置、数据、输出与文档。通过证据：项目 README、标准目录和实验日志。

### 4. [准备数据](Part04-数据集准备.md) · 90 分钟

选择 3–5 个有差异的公开样例。通过证据：数据卡、样例清单、来源与 license 说明。

### 5. [完成推理](Part05-模型准备与推理.md) · 2–3 小时

使用官方模型 ID 跑通一次推理。通过证据：代码、metadata、运行命令与原始输出。

### 6. [受控对比](Part06-提示词管理与对比分析.md) · 2–3 小时

固定模型和样例，只改变 Prompt 约束。通过证据：run 表、三组输出和差异分析。

### 7. [评测总结](Part07-Bechmark评测与总结.md) · 2–3 小时

计算一个有效指标并解释失败。通过证据：指标表、错误案例与 `project_summary.md`。

每完成一关，在自己的 README 更新当前进度、最新运行命令、已知问题和下一步，并提交一次 Git。不要等到最后补实验记录。

## 官方材料只用四个入口

1. [Qwen/Qwen3.5-0.8B Model Card](https://huggingface.co/Qwen/Qwen3.5-0.8B)：模型 ID、当前用法、license 与能力边界；
2. [Transformers 多模态消息格式](https://huggingface.co/docs/transformers/chat_templating_multimodal)：图像与文本输入格式；
3. [OmniDocBench 官方数据集](https://huggingface.co/datasets/opendatalab/OmniDocBench)：数据卡、文件与使用限制；
4. [OmniDocBench 官方评测仓库](https://github.com/opendatalab/OmniDocBench)：数据格式、配置和正式指标实现。

!!! warning "先完成最小路线"
    第一次只选 3–5 个样例、一个模型和一个研究变量。跑通并解释小实验后，再扩展完整数据集、更多模型或正式 OmniDocBench evaluation suite。

## 独立完成的三条规则

1. **没有证据，不进入下一关**：每关至少留下一个文件、一次原始输出或一个 commit。
2. **一次只改一个变量**：模型、样例、Prompt 和 generation config 不要同时改变。
3. **失败也是结果**：保留错误输出和未解决问题；不要把人工修订内容当作模型原始输出。

## 最终作品

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

作品必须包含：可复现入口、数据与模型来源、至少两组受控实验、原始结果、合适指标、失败案例以及有边界的结论。

## 完成标准

- [ ] 陌生同学能按 README 复现至少一组结果。
- [ ] 每项关键结论都能定位到输入、配置和原始输出。
- [ ] 报告能解释指标为何适合当前问题，并分析至少一个失败案例。
- [ ] 仓库不包含密钥、私人文档、未授权数据或被手工美化的模型结果。

完成后，可以继续探索 VLM 微调、完整 Document AI Benchmark、多模态 Agent 或视频理解项目。

最后更新：2026-08-07

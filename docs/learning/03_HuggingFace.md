# Hugging Face Hub：选择并记录模型与数据

> **对应课程**：[Week 2](00_12_Week_Bootcamp.md#week-2)<br>
> **目标**：不依赖“模型名称印象”，从官方页面判断一个模型或数据集是否适用于实验。

Hugging Face Hub 承载模型、数据集、Spaces 和版本历史。课程重点不是浏览排行榜，而是阅读 card、确认来源、锁定 revision，并保存可复现实验元数据。

## 模块学习卡与完成路径

| 字段 | 本页约定 |
| --- | --- |
| 对应周次 | Week 2 |
| 适合谁 | 准备选择模型或数据，并能阅读基础 Python 的学生 |
| 预计时间 | 最小 1–2 小时；标准任务 2–3 小时 |
| 学什么 | Model/Dataset Card、revision、license、输入输出和限制 |
| 官方来源 | Hugging Face Hub、Transformers 与 Datasets 官方文档 |
| 最小动作 | 完成一个模型选择记录，并用固定 revision 运行一次最小推理 |
| 提交证据 | Model Card 摘要、模型 ID/revision、元数据与原始输出 |
| 完成自查 | 能说明模型为何适合任务、有什么限制，以及结果如何追溯 |
| 下一步 | [Transformers 推理](05_Transformers.md) |

| 路径 | 完成范围 |
| --- | --- |
| **最小** | 阅读一个 Model Card，锁定 revision 并完成一次最小推理 |
| **标准** | 增加模型比较、失败样例、license 与 Dataset Card 检查 |
| **进阶** | 比较两个 revision/模型，或验证缓存与离线复现行为 |

## 运行契约

| 项目 | 约定 |
| --- | --- |
| 前置条件 | Python 隔离环境；已阅读目标模型 Model Card；需要受限资源时具备相应访问权限 |
| 唯一入口 | 从目标模型或数据集的官方 Hub 页面进入，先完成 Card 清单，再采用其官方示例 |
| 版本 | 固定 repository ID 与 commit hash/tag；记录 `huggingface_hub`、Transformers/Datasets 及实际依赖版本 |
| 预计耗时 | 30–60 分钟完成选择，30–60 分钟完成最小加载或推理 |
| 算力与成本 | Card 阅读不需要 GPU；最小模型可用 CPU，较大模型按 Card 评估资源；不默认产生付费成本 |
| 输入 | 模型/数据官方页面、固定样例与实验问题 |
| 预期输出 | `run-metadata.md`、模型选择说明、原始输出；数据任务另附 Dataset Card 检查 |
| 成功判定 | 模型或数据来源、revision、许可、输入输出与限制均可追溯 |
| 常见失败与恢复 | 示例失效时先核对 revision、依赖和页面更新；需要登录时只用官方认证方式，不把 token 写入仓库 |

## 学习目标

- 区分 model repository、dataset repository、Space 与 library documentation；
- 阅读 Model Card 和 Dataset Card；
- 检查模型 ID、revision、license、intended use 与 limitations；
- 记录下载来源与缓存，而不是把大型权重提交到 Git。

## 官方学习入口

- [Hugging Face Hub documentation](https://huggingface.co/docs/hub/)（Hub 总览）
- [Model Cards](https://huggingface.co/docs/hub/model-cards)（用途、限制、训练与评测信息）
- [Dataset Cards](https://huggingface.co/docs/hub/datasets-cards)（来源、许可、偏差与结构）
- [Downloading files](https://huggingface.co/docs/huggingface_hub/guides/download)（下载与 revision）
- [Transformers quick tour](https://huggingface.co/docs/transformers/quicktour)（调用模型）
- [Datasets quickstart](https://huggingface.co/docs/datasets/quickstart)（加载数据）

## Model Card 阅读清单

打开一个模型页面，不运行代码，先回答：

| 字段 | 必须记录的内容 |
| --- | --- |
| Model ID | `organization/model-name` 的准确形式 |
| Revision | commit hash 或明确 tag |
| Task | 模型实际支持的 pipeline/task |
| License | 是否允许课程、研究与再分发 |
| Inputs/Outputs | 输入格式、prompt/template、输出形式 |
| Requirements | library、版本、硬件与内存 |
| Intended use | 推荐使用场景 |
| Limitations | 偏差、语言、输入长度、失败风险 |
| Evaluation | 数据集、指标和比较条件 |

没有 Model Card、来源不明或许可不清的模型，不作为课程默认模型。

## Dataset Card 阅读清单

- 数据是谁创建的、来自哪里？
- license 和使用限制是什么？
- train/validation/test 如何划分？
- 字段、语言、模态和样本数量是什么？
- 是否包含个人信息或敏感内容？
- 已知偏差和质量问题是什么？
- 数据版本如何锁定？

!!! warning "Viewer 不是完整数据审计"
    Dataset Viewer 适合快速理解字段和样例，但不能替代 license、数据生成过程、隐私和划分检查。

## Week 2 必做任务

### 任务 A：模型选择

选择一个能在现有资源上运行的小模型，再选择一个视觉/多模态候选模型，分别填写 Model Card 阅读清单。只要求运行第一个模型；第二个模型用于比较输入形式、资源需求、license 与限制。

### 任务 B：最小推理

按照模型官方页面的当前示例完成推理。保存：

- model ID 与 revision；
- library 与版本；
- 输入与原始输出；
- generation config；
- 运行时间和设备；
- 一项失败或限制。

### 选做任务：数据集检查

如果本周仍有时间，选择一个公开 Document AI 数据集，只读取小规模 split/sample，填写 Dataset Card 阅读清单。不要下载不必要的完整大型数据集。

## 实验元数据模板

```yaml
model:
  id: organization/model-name
  revision: <commit hash>
  license: <license>
dataset:
  id: organization/dataset-name
  revision: <commit hash>
  split: validation
runtime:
  python: <version>
  library: <name and version>
  device: <CPU/GPU>
  seed: 42
```

## 提交物

```text
week02/
├── model-comparison.md
├── model-demo.ipynb
├── dataset-review.md
├── run-metadata.yaml
└── result.md
```

Notebook 必须 Restart & Run All，并避免把 token、缓存路径或私人文件写入输出。

## 自主检查

- [ ] 模型和数据使用准确的 `organization/name`；
- [ ] revision、license 和限制均被记录；
- [ ] 至少比较两个候选模型，而非只选择热门模型；
- [ ] 推理输入和原始输出可对应；
- [ ] Notebook 不依赖隐藏状态；
- [ ] 大型权重和数据未进入 Git；
- [ ] 学生能够说明 Model Card 与 Dataset Card 的作用。

## 常见问题

### 模型页面代码无法运行

检查是否读取了当前 revision 的 Model Card、安装版本是否匹配、模型是否 gated，以及输入格式是否使用对应 processor/chat template。记录原始错误再排查。

### 是否必须登录？

公开资源通常可匿名访问；gated 或私有资源需要授权。Token 使用环境变量、CLI 登录或平台 Secret，不写入代码。

### 为什么一定记录 revision？

同一个模型 ID 的默认分支可能更新。Revision 将实验绑定到明确文件状态，便于复现和解释后续差异。

## 下一步

进入[Transformers 基础](05_Transformers.md)，再完成[Qwen3.5-0.8B 多模态推理](06-1_Qwen3.5-VL-0.8B.md)。

最后更新：2026-08-07

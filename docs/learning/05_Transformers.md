# Transformers：从 Model Card 到可复现推理

> **对应课程**：[Week 2](00_12_Week_Bootcamp.md#week-2) 与 [Week 4](00_12_Week_Bootcamp.md#week-4)<br>
> **目标**：理解 processor/tokenizer、model、generation 与 pipeline 的职责，并保存完整推理证据。

Transformers 提供统一模型 API，但不同模型仍可能需要不同的加载类、chat template、输入格式和版本。代码应从目标模型的官方 Model Card 出发，而不是从随机博客复制。

## 模块学习卡与完成路径

| 字段 | 本页约定 |
| --- | --- |
| 对应周次 | Week 2 与 Week 4 |
| 适合谁 | 已建立 Python 环境并选定官方模型的学生 |
| 预计时间 | 最小 1–2 小时；标准任务 2–3 小时 |
| 学什么 | processor/tokenizer、model、generation config 与 pipeline 的职责 |
| 官方来源 | Transformers 官方文档与目标模型 Model Card |
| 最小动作 | 固定模型和输入完成一次推理，保存配置、原始输出和一个失败样例 |
| 提交证据 | 推理脚本/Notebook、环境、模型 revision、generation config 与输出 |
| 完成自查 | 从头运行成功，且能解释输入预处理、生成参数和输出限制 |
| 下一步 | [Qwen3.5-0.8B 多模态推理](06-1_Qwen3.5-VL-0.8B.md) |

| 路径 | 完成范围 |
| --- | --- |
| **最小** | 使用官方示例完成一个固定输入的推理并保存证据 |
| **标准** | 完成 pipeline/Auto classes 理解、失败样例与提交物 |
| **进阶** | 只改变一个 generation 或输入参数，完成受控对照 |

## 运行契约

| 项目 | 约定 |
| --- | --- |
| 前置条件 | 可重建 Python 环境；已阅读目标 Model Card；准备一个公开或自制固定样例 |
| 唯一入口 | 从目标 Model Card 的当前官方示例开始；先跑通 pipeline/smoke test，再按需使用 Auto classes |
| 版本 | 记录模型 ID/revision、Transformers、PyTorch、processor 相关 package、Python 与 CUDA/设备 |
| 预计耗时 | 30–60 分钟跑通，30–60 分钟保存失败样例与配置 |
| 算力与成本 | 小模型可用 CPU；VLM/较大模型按 Model Card 选择本地或免费 Kaggle，不默认付费 |
| 输入 | 固定文本/图像、prompt/chat template 与 generation config |
| 预期输出 | `run-metadata.md`、推理脚本/Notebook、原始 prediction 和失败样例 |
| 成功判定 | 从空状态运行成功，模型、输入模板和生成参数均可追溯 |
| 常见失败与恢复 | 加载类或输入报错时回到 Model Card；OOM 时缩小模型/输入或调整 dtype/device；输出异常时先检查 template 与 prompt 回显 |

## 官方学习入口

- [Transformers installation](https://huggingface.co/docs/transformers/installation)（当前安装方式）
- [Transformers quick tour](https://huggingface.co/docs/transformers/quicktour)（Auto classes、pipeline 与 Trainer）
- [Pipeline tutorial](https://huggingface.co/docs/transformers/pipeline_tutorial)（快速推理）
- [Auto Classes](https://huggingface.co/docs/transformers/model_doc/auto)（按 config 选择实现）
- [Generation](https://huggingface.co/docs/transformers/main_classes/text_generation)（生成参数）
- [Multimodal chat templates](https://huggingface.co/docs/transformers/chat_templating_multimodal)（视觉语言输入）

## 核心组件

| 组件 | 作用 | 常见错误 |
| --- | --- | --- |
| Tokenizer | 文本与 token 转换 | prompt/template 不匹配 |
| Image Processor | 图像缩放、归一化等 | 输入格式或分辨率错误 |
| Processor | 组合文本与多模态预处理 | 把别的模型示例直接套用 |
| Model | 前向计算与生成 | 加载类、dtype、device 不匹配 |
| Generation Config | 控制输出过程 | 多个参数同时变化导致不可解释 |
| Pipeline | 高层任务接口 | 忽略底层输入和默认参数 |

## 两种推理路径

### Pipeline：先验证任务是否能跑通

适合最小 smoke test。使用目标 Model Card 当前给出的 pipeline task 和示例，保存输入、输出及默认配置。

### Auto classes：理解并控制流程

```text
model ID + revision
        ↓
AutoProcessor / AutoTokenizer
        ↓
AutoModel* + device/dtype
        ↓
prepare inputs
        ↓
generate / forward
        ↓
decode + save raw output
```

加载类必须来自目标模型官方示例。不要凭名称猜测 `AutoModelFor...`。

## 推理实验规范

每次运行记录：

```yaml
model_id: organization/model-name
revision: <commit hash>
task: <pipeline task>
python: <version>
transformers: <version>
torch: <version>
device: <device>
dtype: <dtype>
seed: 42
generation:
  max_new_tokens: <value>
  do_sample: <true/false>
```

对于生成式模型，只解码新生成部分，并保存未经人工修饰的原始输出。

## 必做任务

1. 选择一个小型官方模型，并从 Model Card 的当前示例开始；
2. 使用 `pipeline` 或官方推荐的 Auto classes 路径完成一次推理，不要求两种都做；
3. 保存 3 个正常输入和 1 个无效输入的原始结果；
4. 如果是生成式模型，固定其他条件，只修改一个 generation 参数；
5. 保存运行时间、设备、模型 revision 与关键配置。

## 提交物

```text
week02/
├── transformers-demo.ipynb
├── run-metadata.yaml
├── predictions.jsonl
├── comparison.md
└── failure-case.md
```

## 自主检查

- [ ] 加载类与输入格式来自目标模型官方 Model Card；
- [ ] 模型 ID 和 revision 准确；
- [ ] pipeline 与 Auto classes 都能从头运行；
- [ ] processor、model、generation 和 decode 的职责解释正确；
- [ ] 对照实验只改变一个因素；
- [ ] 保存原始 prediction 与异常案例；
- [ ] 不使用未解释的 `trust_remote_code=True`；必须使用时记录来源和风险。

## 常见问题

### 模型加载成功但输入时报错

检查 processor/chat template 是否属于同一模型，消息中的字段类型是否符合 Model Card，而不是只检查 tensor shape。

### 输出包含输入 prompt

生成式模型常返回完整序列。根据官方示例用输入 token 长度切出新生成部分，再 decode。

### dtype 或 device 设置导致报错

从官方最小配置开始，根据实际硬件逐项修改。记录每次唯一改动，避免同时改变量化、dtype、device map 和 attention backend。

## 下一步

进入[Qwen3.5-0.8B 多模态推理](06-1_Qwen3.5-VL-0.8B.md)，将相同记录规范应用到文档图像。



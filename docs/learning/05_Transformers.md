# Transformers：从 Model Card 到可复现推理

> **对应课程**：[Week 2](00_12_Week_Bootcamp.md#week-2) 与 [Week 4](00_12_Week_Bootcamp.md#week-4)<br>
> **目标**：理解 processor/tokenizer、model、generation 与 pipeline 的职责，并保存完整推理证据。

Transformers 提供统一模型 API，但不同模型仍可能需要不同的加载类、chat template、输入格式和版本。代码应从目标模型的官方 Model Card 出发，而不是从随机博客复制。

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

1. 选择一个小型官方模型；
2. 先使用 pipeline 完成一次推理；
3. 再使用官方 Auto classes 示例完成相同输入；
4. 比较两种路径的输出和默认参数；
5. 固定其他条件，只修改一个 generation 参数；
6. 加入一个无效输入，记录错误处理；
7. 保存环境、运行时间和模型 revision。

## 提交物

```text
week02/
├── transformers-demo.ipynb
├── run-metadata.yaml
├── predictions.jsonl
├── comparison.md
└── failure-case.md
```

## 验收清单

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

最后更新：2026-08-07

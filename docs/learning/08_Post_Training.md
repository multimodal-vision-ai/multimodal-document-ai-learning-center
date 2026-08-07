# 模型后训练与 W&B 实验管理

> **对应课程**：[Week 8–10](00_12_Week_Bootcamp.md)<br>
> **目标**：完成一次小规模 LoRA/SFT，并用 W&B 形成可审计的实验对比。<br>
> **建议顺序**：baseline → LoRA/SFT → W&B tracking → evaluation/ablation

本页是学习入口与实验规范，不复制框架官网中的长篇命令。具体 API 以官方文档为准，学生成果以配置、run、artifact 和评测证据为准。

## 先判断是否应该微调

微调不是默认答案。开始前先写一页实验提案，回答：

1. Prompt 或 pipeline 调整为何不能解决问题？
2. 训练数据是否合法、足够代表目标任务吗？
3. 使用什么固定 test set 判断效果？
4. 最小可行模型和算力预算是什么？
5. 微调失败时，哪些结果仍有研究价值？

只有问题、数据、baseline 和指标明确后，才进入训练。

## Stage 1｜建立 baseline

在训练前冻结：

- `model_id` 与 model revision；
- train/validation/test 划分与数据版本；
- prompt/template；
- 主指标和通过阈值；
- 随机种子；
- 资源预算。

用未微调模型运行 test set，并保存逐样例 prediction。训练完成后必须使用同一评测协议比较。

## Stage 2｜LoRA/PEFT 与 SFT

### 必须理解的参数

| 参数 | 学生需要回答的问题 |
| --- | --- |
| `r` | adapter 的秩为什么适合当前资源和任务？ |
| `lora_alpha` | 与 `r` 的比例如何影响更新？ |
| `target_modules` | 哪些层被训练，依据是什么？ |
| learning rate | 为什么选择该值，如何比较？ |
| effective batch size | gradient accumulation 后的实际值是多少？ |
| epochs / max steps | 是否出现过拟合？ |
| precision / quantization | 带来什么资源收益与数值风险？ |

### 官方学习链接

- [Hugging Face PEFT quicktour](https://huggingface.co/docs/peft/quicktour)（LoRA/adapter 基础）
- [PEFT LoRA reference](https://huggingface.co/docs/peft/package_reference/lora)（参数与 QLoRA-style 配置）
- [TRL SFT Trainer](https://huggingface.co/docs/trl/sft_trainer)（SFT 数据与训练接口）
- [MS-SWIFT Qwen3.5 Best Practices](https://swift.readthedocs.io/en/latest/BestPractices/Qwen3_5-Best-Practice.html)（Qwen3.5 当前环境、推理和训练方案）
- [PyTorch reproducibility](https://docs.pytorch.org/docs/stable/notes/randomness.html)（随机性与确定性限制）

!!! warning "框架选择"
    课程默认只要求掌握一条训练路径。优先选择与目标模型明确兼容、文档当前有效的框架；不要同时学习多个训练框架，也不要把其他模型的配置直接套到 Qwen3.5。

### 最小训练交付

```text
week08/
├── train.py                  # 或可从头运行的 notebook
├── training-config.yaml
├── dataset-card.md
├── environment.txt
├── logs/
└── training-report.md
```

`training-config.yaml` 至少记录模型 revision、数据版本、seed、LoRA 参数、优化器、学习率、batch size、最大步数、精度和输出目录。

## Stage 3｜接入 Weights & Biases

W&B 的作用不是“画一条 loss 曲线”，而是把 config、metrics、运行环境、数据版本和模型产物连接起来。

### 安全登录

- 使用 `wandb login`、环境变量或平台 Secret；
- 不把 API key 写入 notebook、YAML、截图或 Git 历史；
- 使用私有项目时，向导师授权或提交脱敏 report 导出。

### 每个 Run 必须记录

| 类别 | 最低字段 |
| --- | --- |
| Identity | run name、group、tags、Git commit |
| Config | model/data revision、seed、LoRA 与训练参数 |
| Training | train/eval loss、learning rate、global step |
| Task metrics | 与 baseline 相同的主指标 |
| System | duration、GPU、peak memory（能获取时） |
| Notes | 假设、唯一改动、异常与中止原因 |

### A/B 对比任务

运行至少两个可比较 runs，只改变一个因素。例如：

```text
Run A: learning_rate = 1e-4
Run B: learning_rate = 2e-4

保持不变：model revision、dataset split、seed、LoRA config、steps、evaluation
```

若无法完全固定随机性，应明确记录并谨慎解释小幅差异。

### Artifacts 与 Reports

使用 Artifact 保存或引用：

- dataset manifest/version；
- training config；
- adapter metadata 或小型 adapter；
- evaluation results。

最终 W&B Report 至少包含：研究问题、runs 表、训练曲线、主指标、资源成本、失败案例、结论和下一步。

### W&B 官方链接

- [W&B Quickstart](https://docs.wandb.ai/quickstart/)（首次记录 run）
- [Track experiments](https://docs.wandb.ai/guides/track/)（config、metrics 与 runs）
- [Hugging Face integration](https://docs.wandb.ai/guides/integrations/huggingface/)（Transformers/Trainer 集成）
- [W&B Artifacts](https://docs.wandb.ai/guides/artifacts/)（数据与模型版本）
- [W&B Reports](https://docs.wandb.ai/guides/reports/)（可分享实验报告）
- [W&B Sweeps](https://docs.wandb.ai/guides/sweeps/)（扩展学习，不是入门必做）

## Stage 4｜统一评测与消融

训练完成后：

1. 用冻结的 test set 重跑 baseline 与所有候选 adapters；
2. 导出逐样例结果，而非只保存均值；
3. 报告总体指标和按文档类型切片指标；
4. 对最差案例做人工复核；
5. 做一个只改变单个因素的 ablation；
6. 同时报告准确性、训练时间和显存成本。

不要使用 W&B 页面中“最好看”的单次 run 直接作为结论。

## Week 8–10 验收清单

- [ ] 有训练前 baseline 和固定 test set；
- [ ] 数据来源、许可、划分和版本清楚；
- [ ] LoRA/SFT 配置可机器读取；
- [ ] 至少两个 W&B runs 只改变一个因素；
- [ ] 每个 run 可追溯到 Git commit、config 与结果；
- [ ] API key 未进入仓库；
- [ ] W&B Report 包含负面结果、限制与资源成本；
- [ ] 评测脚本能从原始 prediction 重算指标。

## 推荐提交结构

```text
post-training-project/
├── README.md
├── configs/
│   ├── baseline.yaml
│   ├── run-a.yaml
│   └── run-b.yaml
├── src/
│   ├── train.py
│   └── evaluate.py
├── results/
│   ├── predictions.jsonl
│   └── metrics.csv
├── dataset-card.md
├── wandb-report.md
└── MODEL_CARD.md
```

## 进一步探索

完成 SFT、W&B 和统一评测后，再考虑 GRPO、sweeps、分布式训练或更大模型。扩展实验仍需遵循相同原则：一次只提出一个明确问题，保留可复现证据，并如实报告成本与失败。

最后更新：2026-08-07

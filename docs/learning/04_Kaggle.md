# Kaggle Notebook：受限算力下的可复现实验

> **对应课程**：[Week 2](00_12_Week_Bootcamp.md#week-2)、[Week 4](00_12_Week_Bootcamp.md#week-4)、[Week 8–10](00_12_Week_Bootcamp.md#week-8) 的云端实验<br>
> **目标**：创建一个可从头运行、无密钥泄漏、能导出结果的 GPU Notebook。

Kaggle 提供托管 Notebook、数据挂载和有限 GPU 配额。它解决的是环境与算力入口，不会自动保证实验可复现。

## 模块学习卡与完成路径

| 字段 | 本页约定 |
| --- | --- |
| 对应周次 | Week 2、Week 4、Week 8–10 |
| 适合谁 | 需要免费云端环境或有限 GPU，并能操作 Notebook 的学生 |
| 预计时间 | 最小约 1 小时；迁移完整实验通常 2–3 小时 |
| 学什么 | Notebook 状态、环境记录、数据挂载、Secret、配额与结果导出 |
| 官方来源 | Kaggle Notebooks、GPU usage、API 与 Models 官方文档 |
| 最小动作 | Fork/新建一个 Notebook，Restart Session & Run All，并导出一次结果 |
| 提交证据 | Notebook 链接、version、环境、配置、原始结果和导出文件 |
| 完成自查 | Notebook 不依赖隐藏状态，不泄漏密钥，配额和实际设备有记录 |
| 下一步 | 返回对应周次，或进入[动手教程](../tutorials/README.md) |

| 路径 | 完成范围 |
| --- | --- |
| **最小** | 运行环境检查和一个固定样例，保存 Notebook version 与结果 |
| **标准** | 按最小结构完成数据、运行、评测、导出和限制说明 |
| **进阶** | 增加可重复参数配置、CLI 同步或资源/耗时比较 |

## 运行契约

| 项目 | 约定 |
| --- | --- |
| 前置条件 | Kaggle 账号；明确公开或已授权的数据来源；了解目标实验的最小命令 |
| 唯一入口 | 从课程或教程给出的目标 Notebook Fork；没有指定 Notebook 时新建一个并按“Notebook 最小结构”组织 |
| 版本 | 记录 Notebook URL/version、Python、关键 package、数据版本、模型 revision、实际 accelerator |
| 预计耗时 | 约 1 小时完成最小运行；完整迁移按实验另设上限 |
| 算力与成本 | 优先 CPU/免费额度；只在代码确实需要时开启 GPU；课程不要求购买额外算力 |
| 输入 | 已授权数据、固定配置、模型或代码 revision |
| 预期输出 | `run-metadata`、prediction、metrics、日志与导出的结果文件 |
| 成功判定 | Restart Session & Run All 成功，结果可下载，并能回到明确版本与配置 |
| 常见失败与恢复 | 配额不足时改用 CPU/小模型/小切片；重启导致状态丢失时从头运行；依赖变更后记录并重启 Session |

## 官方学习入口

- [Kaggle Notebooks](https://www.kaggle.com/docs/notebooks)（Notebook 基础）
- [Efficient GPU usage](https://www.kaggle.com/docs/efficient-gpu-usage)（配额与资源管理）
- [Kaggle API documentation](https://github.com/Kaggle/kaggle-api)（数据和 notebook CLI）
- [Kaggle Models documentation](https://www.kaggle.com/docs/models)（模型资源）

Kaggle 的 GPU 型号和配额可能随供给变化。课程只要求记录实际分配到的设备，不假定一定获得某个型号。

## Notebook 最小结构

建议每个课程 Notebook 固定为以下段落：

1. **Objective**：本次只验证什么；
2. **Environment**：Python、关键包、GPU 与 Git commit；
3. **Configuration**：模型、数据 revision、seed 和参数；
4. **Data check**：字段、样例、许可与 split；
5. **Run**：最小推理或训练；
6. **Evaluation**：指标和失败案例；
7. **Export**：保存 prediction、metrics 与 metadata；
8. **Limitations**：本次不能证明什么。

## 开始实验

### 1. 选择 Accelerator

仅在代码真正使用 GPU 时启用 accelerator。运行：

```python
import platform
import sys

import torch

print("python:", sys.version)
print("platform:", platform.platform())
print("torch:", torch.__version__)
print("cuda:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("gpu:", torch.cuda.get_device_name(0))
```

将输出保留在最终版本中，避免只写“T4/P100 等”。

### 2. 安装最少依赖

把安装集中在一个 cell，并固定关键直接依赖。记录 Kaggle 镜像日期或 notebook version。不要反复升级整个环境。

### 3. 管理数据

- 公开数据优先使用 Kaggle Dataset 或官方 Hub；
- 记录 dataset ID、version、split 和 license；
- 输入目录视为只读；
- 输出写入工作目录并只保存必要结果；
- 不上传私人文档或未授权材料。

### 4. 管理 Secret

Hugging Face、W&B 等 token 使用 Kaggle Secrets。代码只读取环境变量，不打印 token，不将 token 写入输出或 notebook metadata。

### 5. 固定随机性

至少设置并记录 Python、NumPy 和 PyTorch seed。即使设置 seed，GPU 运算也可能不是完全确定的，应在报告中说明。

## 按需任务：迁移到 Kaggle

本页不要求所有学生在 Week 2 重复本地实验。只有本地缺少合适算力、需要分享可运行 Notebook，或希望提前熟悉 Week 8–10 云端训练时，再完成迁移。

将 Week 2 的模型 demo 迁移到 Kaggle：

1. Restart Session；
2. Run All；
3. 保存模型 ID/revision 与实际环境；
4. 运行 3 个正常样例和 1 个失败样例；
5. 导出 `predictions.jsonl`、`run-metadata.yaml` 和简短报告；
6. 生成只读分享链接，并确认未暴露 Secret。

## 提交物

```text
week02/
├── kaggle-notebook.ipynb
├── kaggle-link.md
├── run-metadata.yaml
├── predictions.jsonl
└── result.md
```

外部 Kaggle 链接不能替代仓库中的 notebook、配置和结果证据。

## 自主检查

- [ ] Restart & Run All 成功；
- [ ] 实际 GPU、环境和 notebook version 可追溯；
- [ ] 模型与数据 revision 明确；
- [ ] Secret 未出现在代码、输出或 Git；
- [ ] 输出文件可下载并由报告引用；
- [ ] GPU 会话使用完毕后及时停止；
- [ ] 失败案例和配额限制被记录。

## 常见问题

### GPU 配额不足

先确认是否可以用 CPU、小模型或更小样本完成学习目标。自主检查关注方法与证据，不比较 GPU 小时和模型规模。

### 安装包后必须重启 Session

记录实际解决步骤，并在最终 Notebook 中把环境准备放在最前面；再次 Run All 验证不存在隐藏状态。

### Notebook 链接可访问但无法复现

通常缺少外部数据、Secret、固定 revision 或输出保存步骤。使用自主检查逐项补齐。

## 下一步

完成[Transformers 基础](05_Transformers.md)，再运行[Qwen3.5 多模态推理](06-1_Qwen3.5-VL-0.8B.md)。

最后更新：2026-08-07

# 文档评测实战｜OmniDocBench Markdown Evaluation（Kaggle）

> **类型**：可运行案例 · **对应课程**：Week 6–7 · **难度**：入门 · **建议投入**：1–2 小时 · **平台**：Kaggle Notebook

[打开 Kaggle Notebook](https://www.kaggle.com/code/guopingtan/omnidocbench-evaluation-md){ .md-button .md-button--primary }
[查看 OmniDocBench 官方仓库](https://github.com/opendatalab/OmniDocBench){ .md-button }

本教程演示如何使用 OmniDocBench 的评测流程，对文档解析得到的 Markdown prediction 进行检查。重点不是“跑出一个分数”，而是理解 prediction、ground truth、metric 和 error case 之间的关系。

## 运行契约

| 项目 | 本教程约定 |
| --- | --- |
| 前置条件 | Kaggle 账号；能阅读基础 Python/Notebook；了解 Markdown；已阅读 Week 7 任务 |
| 唯一入口 | [OmniDocBench Markdown Evaluation Kaggle Notebook](https://www.kaggle.com/code/guopingtan/omnidocbench-evaluation-md) |
| 版本 | Fork 后记录 Notebook URL、运行日期、Notebook version、数据版本和 OmniDocBench revision；实际 package 版本以运行环境输出为准 |
| 预计耗时 | 60–120 分钟，包括 baseline、一次受控对照和结果保存 |
| 算力与成本 | Kaggle CPU/免费额度即可完成评测；不要求 GPU，不应开启付费资源 |
| 预期文件 | `run-metadata.md`、baseline/compare-01 原始结果、`error-analysis.md` 和 `conclusion.md`；可放入个人仓库的 `week07/omnidocbench/` |
| 最小完成动作 | Restart Session & Run All，保存一次 baseline 原始结果，并解释一个指标和一个失败案例 |

!!! warning "常见失败与恢复"
    - **prediction 或 ground truth 路径错误**：先列出输入文件并抽查 3 组对应样例，再运行评测。
    - **Notebook 依赖隐藏状态**：Restart Session & Run All，不通过手工补跑跳过失败 cell。
    - **结果为空或异常低**：先检查文件命名、内容是否为空、Markdown 格式和样例对齐，再讨论模型能力。
    - **Kaggle Session 中断**：保留已运行版本和输出文件，从唯一入口重新 Fork；不要把临时 Session 当作提交物。

!!! info "模块学习卡"
    **学什么**：prediction、ground truth、metric 与 error case 的关系。<br>
    **官方来源**：[OmniDocBench 官方仓库](https://github.com/opendatalab/OmniDocBench)与官方论文。<br>
    **做什么**：运行 baseline，再做一次只改变一个变量的对照。<br>
    **提交什么**：运行 metadata、原始结果、错误分析和结论。<br>
    **如何自查**：从头运行成功，且每个结论都能回到具体输入和原始输出。

## 完成后你能做什么

- 说明 OmniDocBench 评测的输入、输出与数据组织方式；
- 从头运行 Notebook，并保存配置与结果文件；
- 阅读文本、表格、公式和阅读顺序相关结果；
- 只修改一个变量，完成一次公平对照；
- 从低分样例中提出可验证的改进假设。

## 开始前

你需要：

- 一个 Kaggle 账号；
- 能阅读基础 Python 和 Notebook cell；
- 已了解 Markdown 文档结构；
- 读过 [Week 7｜Dataset 与 Benchmark](../learning/00_12_Week_Bootcamp.md#week-7) 的任务要求。

!!! warning "不要上传私人文档"
    仅使用教程自带数据、公开授权数据或自制样例。Notebook、输出文件和截图中都不应出现 API key、个人信息或未授权材料。

## 评测流程

```text
Markdown prediction
        ↓
与 ground truth 对齐
        ↓
运行 OmniDocBench evaluation
        ↓
得到分项与总体结果
        ↓
检查低分样例并解释误差
```

## Step 1｜Fork 并建立实验记录

1. 打开 Notebook，选择 **Copy & Edit / Fork**；
2. 在顶部记录 Notebook URL、运行日期、数据版本和代码 revision；
3. 保留默认参数，第一次运行不要同时修改代码和数据；
4. 执行 **Restart Session & Run All**，确认没有依赖隐藏状态。

建议先建立结果表：

| Run | 唯一改动 | 数据/代码版本 | 关键结果 | 运行状态 |
| --- | --- | --- | --- | --- |
| baseline | 无 | 待填写 | 待填写 | 待填写 |
| compare-01 | 待填写 | 与 baseline 一致 | 待填写 | 待填写 |

## Step 2｜完成 baseline

运行默认流程并保存：

- 实际使用的 prediction 和 ground truth 路径；
- 完整配置或命令；
- 原始评测输出，不只保留截图；
- 总体结果和至少两个分项结果；
- 运行时间以及失败/警告信息。

!!! tip "先验证输入，再解释指标"
    如果 prediction 文件缺失、命名不匹配或内容为空，分数没有分析价值。先抽样打开 3 个输入和对应输出，再阅读评测结果。

## Step 3｜读懂结果

至少回答下面四个问题：

1. 文本内容、表格结构、公式和 reading order 分别由什么结果反映？
2. 总体结果是否掩盖了某一类文档的明显退化？
3. 最差的 3 个样例有什么共同错误？
4. 错误主要来自模型输出、格式转换、文件对齐，还是评测输入不合法？

指标定义与脚本行为应以[OmniDocBench 官方仓库](https://github.com/opendatalab/OmniDocBench)和[官方论文](https://arxiv.org/abs/2412.07626)为准，不根据指标名称自行猜测。

## Step 4｜做一次受控对照

从下面选择一个变量：

- 修正一类 Markdown 格式问题；
- 替换一小组 prediction；
- 改变一个解析或后处理设置；
- 只评测一个固定文档切片。

保持数据划分、评测代码和其余配置不变，重新运行并填写结果表。结论需要同时报告“改善了什么”“没有改善什么”和“当前证据不能说明什么”。

## Step 5｜形成错误分析

为至少 5 个失败样例记录：

| 样例 | 文档类型 | 错误类别 | 证据 | 可能原因 | 下一步验证 |
| --- | --- | --- | --- | --- | --- |
| sample-01 | 待填写 | 待填写 | 输入/输出链接 | 待填写 | 待填写 |

不要把“模型能力不足”当作最终原因。继续区分 OCR、layout、table structure、formula、reading order、format conversion 和 evaluation alignment。

## 提交物

- [ ] 可访问的 Kaggle Notebook 链接；
- [ ] baseline 与 compare-01 的配置和原始结果；
- [ ] 至少 5 条错误分析；
- [ ] 一张可由原始结果重建的对比表或图；
- [ ] 200–400 字结论，包含限制和下一步；
- [ ] AI-assisted coding 使用与人工核验记录。

!!! success "完成判定 / Definition of Done"
    Notebook 可以从头运行；两次运行只改变一个明确变量；结论能回到原始结果；学生能解释一个指标和一个失败案例。

## 下一步

把本教程结果提交到 Week 7，或进入[项目实战 01](../experiments/Experiment_01/README.md)继续完成模型推理、Prompt 对照和项目报告。



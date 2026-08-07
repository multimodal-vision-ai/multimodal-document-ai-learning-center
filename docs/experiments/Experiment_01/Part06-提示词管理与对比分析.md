# Part 6：Prompt Engineering 与多组实验（Prompt Design and Comparative Experiments）

[上一关：完成首次推理](Part05-模型准备与推理.md){ .md-button }
[返回项目控制台](README.md){ .md-button }
[下一关：评测与总结](Part07-Bechmark评测与总结.md){ .md-button .md-button--primary }

> **本关核心产出**：三组受控运行、run manifest 与证据支持的观察 · **预计时间**：2–3 小时

!!! success "本关通过条件"
    三组实验使用相同模型 revision、相同样例和相同 generation config，只改变 Prompt 约束；每个 run 都能从 manifest 找到 Prompt、输入、metadata 和未经修改的原始输出。

!!! warning "不同任务不等于受控对比"
    “OCR、转 Markdown、找表格、总结”回答的是不同问题，不能直接比较哪个 Prompt 更好。本关的核心实验必须保持任务相同，只改变一个 Prompt 因素；后文五类 Prompt 可以作为完成核心实验后的任务覆盖扩展。

---

## 一、本部分学习目标（Learning Objectives）

完成本部分后，你应该能够：

* 理解 Prompt Engineering 的基本思想；
* 为同一张文档设计不同 Prompt；
* 比较不同 Prompt 的输出结果；
* 学会记录实验过程；
* 建立 Prompt 管理规范；
* 完成第一份实验分析报告。

---

## 二、实验任务

本部分需要完成以下任务：

1. 准备测试图片；
2. 设计多组 Prompt；
3. 运行多次推理；
4. 保存每次实验结果；
5. 比较模型输出；
6. 编写实验分析报告；
7. 提交 GitHub。

---

## 三、实验数据准备（Operations）

进入：

```text id="p6s001"
data/samples/
```

确认至少准备以下三类图片：

```text id="p6s002"
sample_01.jpg    普通文档

sample_02.jpg    包含表格

sample_03.jpg    包含图片和文字
```

建议图片命名统一采用：

```text id="p6s003"
sample_01.jpg

sample_02.jpg

sample_03.jpg
```

不要使用中文文件名。

---

## 四、先完成三组受控实验（Required Experiment）

选择同一个任务，例如“将文档转写为 Markdown”，固定模型、3–5 个样例与 generation config，只改变 Prompt 约束：

| Prompt version | 唯一变化 | 需要观察什么 |
| --- | --- | --- |
| P1｜基础指令 | 只说明任务 | 内容完整度与幻觉 |
| P2｜结构约束 | 明确标题、段落、表格的输出格式 | 结构保持与格式遵循 |
| P3｜证据约束 | 在 P2 基础上要求不确定时标记 `[UNCERTAIN]` | 无依据回答与漏项 |

为每个样例运行 P1、P2、P3，并创建 `experiments/2026-Experiment01/run_manifest.csv`：

```text
run_id,sample_id,model_id,model_revision,prompt_version,generation_config_path,raw_output,status
```

推荐命名：`p1_sample_text_01`、`p2_sample_text_01`。这样 Part 07 可以直接按 `sample_id` 对齐三组结果。

!!! tip "最小成功"
    资源不足时，先用 1 个样例完成 P1/P2/P3，确认结果文件不会覆盖；再扩展到其余样例。

---

## 五、建立 Prompt 管理目录（Operations）

进入：

```text id="p6s004"
experiments/

2026-Experiment01/
```

创建：

```text id="p6s005"
prompts/

results/

analysis/
```

最终目录如下：

```text id="p6s006"
2026-Experiment01/

├── prompts/

├── results/

├── analysis/

├── experiment.md

├── prompts.md

└── results.md
```

---

## 六、任务覆盖扩展：文档描述（Optional）

创建文件：

```text id="p6s007"
prompts/

prompt_01.md
```

填写：

```text id="p6s008"
Describe this document.
```

运行程序。

保存输出。

输出文件：

```text id="p6s009"
results/

result_prompt01.md
```

---

## 七、任务覆盖扩展：文字提取（Optional）

创建：

```text id="p6s010"
prompts/

prompt_02.md
```

填写：

```text id="p6s011"
Extract all text from this document.
```

运行程序。

保存：

```text id="p6s012"
results/

result_prompt02.md
```

---

## 八、任务覆盖扩展：Markdown 转写（Optional）

创建：

```text id="p6s013"
prompts/

prompt_03.md
```

填写：

```text id="p6s014"
Convert this document into Markdown.
```

运行程序。

保存：

```text id="p6s015"
results/

result_prompt03.md
```

---

## 九、任务覆盖扩展：表格识别（Optional）

创建：

```text id="p6s016"
prompts/

prompt_04.md
```

填写：

```text id="p6s017"
Identify all tables in this document.
```

运行程序。

保存：

```text id="p6s018"
results/

result_prompt04.md
```

---

## 十、任务覆盖扩展：内容总结（Optional）

创建：

```text id="p6s019"
prompts/

prompt_05.md
```

填写：

```text id="p6s020"
Summarize the content of this document.
```

运行程序。

保存：

```text id="p6s021"
results/

result_prompt05.md
```

---

## 十一、建立 Prompt 对照表（Operations）

进入：

```text id="p6s022"
analysis/
```

创建：

```text id="p6s023"
prompt_comparison.md
```

填写：

```markdown id="p6s024"
# Prompt Comparison

| Prompt | Objective | Output Quality | Notes |
|----------|-----------|----------------|------|
| P1 | 基础指令 | | |
| P2 | 增加结构约束 | | |
| P3 | 增加不确定性标记 | | |
```

实验完成后补充内容。

---

## 十二、比较实验结果（Operations）

先按相同 `sample_id` 横向阅读 P1、P2、P3 的结果，再跨样例检查同一现象是否重复出现。

重点比较以下内容。任务覆盖扩展的五类输出单独分析，不与受控实验混在同一结论中。

### 输出长度

观察：

* 是否输出完整；
* 是否遗漏内容。

---

### OCR 效果

观察：

* 是否识别所有文字；
* 是否存在乱码。

---

### Markdown 效果

观察：

* 标题是否正确；
* 列表是否正确；
* 表格是否正确。

---

### 表格识别

观察：

* 是否找到表格；
* 是否恢复表格结构。

---

### 内容理解

观察：

* 是否能够理解文档主题；
* 是否能够完成总结。

---

## 十三、建立实验分析报告（Operations）

进入：

```text id="p6s025"
analysis/
```

创建：

```text id="p6s026"
experiment_analysis.md
```

填写：

```markdown id="p6s027"
# Experiment Analysis

## Objective

Compare different prompts.

## Dataset

OmniDocBench Sample

## Model

Qwen/Qwen3.5-0.8B

## Prompt Comparison

### P1 — 基础指令

...

### P2 — 结构约束

...

### P3 — 证据约束

...

## Conclusion

- 哪个变化在多数样例上重复出现？
- 哪些观察只有个例证据？
- 结果支持或反驳了 project_plan.md 中的哪项预期？
- 还不能得出什么结论？
```

---

## 十四、更新实验日志（Operations）

编辑：

```text id="p6s028"
experiment.md
```

新增内容：

```markdown id="p6s029"
## Experiment 02

Prompt Comparison

Completed.
```

编辑：

```text id="p6s030"
results.md
```

补充：

```markdown id="p6s031"
P1/P2/P3 controlled runs have been completed.

All outputs have been saved.
```

---

## 十五、检查实验目录（Expected Results）

实验目录应如下：

```text id="p6s032"
2026-Experiment01/

├── prompts/

│   ├── prompt_01.md

│   ├── prompt_02.md

│   └── prompt_03.md

├── results/

│   ├── p1_sample_text_01.txt

│   ├── p2_sample_text_01.txt

│   └── p3_sample_text_01.txt

├── analysis/

│   ├── prompt_comparison.md

│   └── experiment_analysis.md

└── run_manifest.csv
```

---

## 十六、Git 提交（Operations）

执行：

```bash id="p6s033"
git status
```

确认新增文件。

执行：

```bash id="p6s034"
git add .
```

执行：

```bash id="p6s035"
git commit -m "feat: complete prompt engineering experiments"
```

执行：

```bash id="p6s036"
git push
```

确认 GitHub 已同步。

---

## 十七、常见问题（Common Errors）

### 问题一

Prompt 修改后输出没有变化。

检查：

是否重新运行程序。

---

### 问题二

Prompt 文件编码错误。

建议：

统一采用 UTF-8 编码。

---

### 问题三

实验结果覆盖。

建议：

每个 Prompt 保存独立输出文件。

不要覆盖已有结果。

---

### 问题四

分析报告内容过少。

至少完成：

* Prompt；
* 输出结果；
* 优点；
* 不足；
* 改进建议。

---

## 十八、本部分成果（Deliverables）

完成本部分后，应提交：

* 三组同任务、单变量 Prompt；
* 每组 Prompt 在相同样例上的原始结果；
* run_manifest.csv；
* Prompt 对照表；
* 实验分析报告；
* 更新后的实验日志；
* Git Commit 记录。

---

## 十九、自我检查列表（Checklist）

| 检查项          | 状态 |
| ------------ | -- |
| P1/P2/P3 Prompt 完成 | □  |
| 同样例受控运行完成   | □  |
| run_manifest.csv 完成 | □  |
| 输出结果保存       | □  |
| Prompt 对照表完成 | □  |
| 实验分析报告完成     | □  |
| GitHub 已同步   | □  |

全部完成后，进入下一部分。

---

## 二十、本部分小结

本部分完成了第一次 Prompt Engineering 实验，并建立了 Prompt 管理、实验分析和结果对比的基本流程。

---

## 下一部分

**Part 7：小规模评测与实验总结（Evaluation and Project Summary）**

下一部分将完成：

* Benchmark 数据准备；
* 模型推理结果整理；
* 初步性能评测；
* 项目总结；
* 实验验收；
* Experiment 01 完整归档。

➡️ [进入 Part 07：Benchmark评测与总结](Part07-Bechmark评测与总结.md)

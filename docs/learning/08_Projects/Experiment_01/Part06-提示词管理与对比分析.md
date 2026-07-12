# Part 6：Prompt Engineering 与多组实验（Prompt Design and Comparative Experiments）

---

# 一、本部分学习目标（Learning Objectives）

完成本部分后，你应该能够：

* 理解 Prompt Engineering 的基本思想；
* 为同一张文档设计不同 Prompt；
* 比较不同 Prompt 的输出结果；
* 学会记录实验过程；
* 建立 Prompt 管理规范；
* 完成第一份实验分析报告。

---

# 二、实验任务

本部分需要完成以下任务：

1. 准备测试图片；
2. 设计多组 Prompt；
3. 运行多次推理；
4. 保存每次实验结果；
5. 比较模型输出；
6. 编写实验分析报告；
7. 提交 GitHub。

---

# 三、实验数据准备（Operations）

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

# 四、建立 Prompt 管理目录（Operations）

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

# 五、设计第一组 Prompt（Operations）

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

# 六、设计第二组 Prompt（Operations）

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

# 七、设计第三组 Prompt（Operations）

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

# 八、设计第四组 Prompt（Operations）

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

# 九、设计第五组 Prompt（Operations）

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

# 十、建立 Prompt 对照表（Operations）

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
| Prompt 01 | Document Description | | |
| Prompt 02 | OCR | | |
| Prompt 03 | Markdown | | |
| Prompt 04 | Table | | |
| Prompt 05 | Summary | | |
```

实验完成后补充内容。

---

# 十一、比较实验结果（Operations）

阅读五组实验结果。

重点比较以下内容。

## 输出长度

观察：

* 是否输出完整；
* 是否遗漏内容。

---

## OCR 效果

观察：

* 是否识别所有文字；
* 是否存在乱码。

---

## Markdown 效果

观察：

* 标题是否正确；
* 列表是否正确；
* 表格是否正确。

---

## 表格识别

观察：

* 是否找到表格；
* 是否恢复表格结构。

---

## 内容理解

观察：

* 是否能够理解文档主题；
* 是否能够完成总结。

---

# 十二、建立实验分析报告（Operations）

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

Qwen3.5-VL-0.8B

## Prompt Comparison

### Prompt 01

...

### Prompt 02

...

### Prompt 03

...

### Prompt 04

...

### Prompt 05

...

## Conclusion

Which prompt performs best?

Why?
```

---

# 十三、更新实验日志（Operations）

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
Five prompts have been tested.

All outputs have been saved.
```

---

# 十四、检查实验目录（Expected Results）

实验目录应如下：

```text id="p6s032"
2026-Experiment01/

├── prompts/

│   ├── prompt_01.md

│   ├── prompt_02.md

│   ├── prompt_03.md

│   ├── prompt_04.md

│   └── prompt_05.md

├── results/

│   ├── result_prompt01.md

│   ├── result_prompt02.md

│   ├── result_prompt03.md

│   ├── result_prompt04.md

│   └── result_prompt05.md

├── analysis/

│   ├── prompt_comparison.md

│   └── experiment_analysis.md
```

---

# 十五、Git 提交（Operations）

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

# 十六、常见问题（Common Errors）

## 问题一

Prompt 修改后输出没有变化。

检查：

是否重新运行程序。

---

## 问题二

Prompt 文件编码错误。

建议：

统一采用 UTF-8 编码。

---

## 问题三

实验结果覆盖。

建议：

每个 Prompt 保存独立输出文件。

不要覆盖已有结果。

---

## 问题四

分析报告内容过少。

至少完成：

* Prompt；
* 输出结果；
* 优点；
* 不足；
* 改进建议。

---

# 十七、本部分成果（Deliverables）

完成本部分后，应提交：

* 五组 Prompt；
* 五组实验结果；
* Prompt 对照表；
* 实验分析报告；
* 更新后的实验日志；
* Git Commit 记录。

---

# 十八、自我检查列表（Checklist）

| 检查项          | 状态 |
| ------------ | -- |
| 五组 Prompt 完成 | □  |
| 五组实验完成       | □  |
| 输出结果保存       | □  |
| Prompt 对照表完成 | □  |
| 实验分析报告完成     | □  |
| GitHub 已同步   | □  |

全部完成后，进入下一部分。

---

# 十九、本部分小结

本部分完成了第一次 Prompt Engineering 实验，并建立了 Prompt 管理、实验分析和结果对比的基本流程。

---

# 下一部分

**Part 7：Benchmark 初步评测与实验总结（Benchmark Evaluation and Project Summary）**

下一部分将完成：

* Benchmark 数据准备；
* 模型推理结果整理；
* 初步性能评测；
* 项目总结；
* 实验验收；
* Experiment 01 完整归档。

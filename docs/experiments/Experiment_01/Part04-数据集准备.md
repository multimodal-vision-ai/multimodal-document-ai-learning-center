# Part 4：准备可追溯的文档样例（Dataset Preparation）

[上一关：构建项目目录](Part03-构建项目目录.md){ .md-button }
[返回项目控制台](README.md){ .md-button }
[下一关：完成首次推理](Part05-模型准备与推理.md){ .md-button .md-button--primary }

> **本关核心产出**：3–5 个样例、`data/README.md` 与样例清单 · **预计时间**：90 分钟

[OmniDocBench 官方数据集](https://huggingface.co/datasets/opendatalab/OmniDocBench){ .md-button .md-button--primary }
[官方评测仓库](https://github.com/opendatalab/OmniDocBench){ .md-button }

!!! success "本关通过条件"
    每个样例都能打开，有稳定的 `sample_id`、来源和使用许可；至少覆盖纯文本、表格、图文混排中的两类；完整数据和标注没有误提交到 GitHub。

## 先选择一条数据路线

| 路线 | 适合谁 | 本项目最低要求 |
| --- | --- | --- |
| A｜最小课程实验 | 第一次完成、存储或网络受限 | 3–5 页自制或可公开使用的文档，并为至少一个文本区域人工核对 reference |
| B｜OmniDocBench 扩展 | 希望继续正式评测 | 从官方数据页获取当前版本，记录 dataset revision，并按官方仓库格式准备 prediction |

路线 A 可以完成本项目全部学习目标，但结论必须写成“小规模课程评测”。路线 B 才能进一步使用官方 evaluation suite；不要把 3–5 页结果宣称为完整 OmniDocBench 成绩。

---

## 一、本部分学习目标（Learning Objectives）

完成本部分后，你应该能够：

* 选择并记录一组可追溯的公开文档样例；
* 理解数据集目录结构；
* 检查数据是否完整；
* 建立实验数据目录；
* 编写数据集说明文档；
* 为后续模型推理做好准备。

---

## 二、实验任务

本部分的任务如下：

1. 选择数据路线并阅读对应的官方数据说明；
2. 将数据集放入项目目录；
3. 检查数据完整性；
4. 阅读数据集说明；
5. 建立数据管理规范；
6. 提交 GitHub。

---

## 三、项目目录

进入项目目录。

```text
qwen3vl-first-project/

├── data/
│
├── docs/
│
├── outputs/
│
└── scripts/
```

本实验所有数据均保存在：

```text
data/
```

目录中。

---

## 四、建立数据目录（Operations）

进入：

```text
data/
```

创建如下目录。

```text
data/

├── raw/
│
├── processed/
│
├── samples/
│
└── README.md
```

目录说明：

| 目录        | 用途      |
| --------- | ------- |
| raw       | 原始数据    |
| processed | 处理后的数据  |
| samples   | 小规模测试数据 |

---

## 五、获取课程样例或 OmniDocBench（Operations）

### Step 1

打开浏览器。

进入 [OmniDocBench 官方数据页](https://huggingface.co/datasets/opendatalab/OmniDocBench)，先阅读 Dataset Card、Copyright Statement、文件列表和最新更新记录。

- 路线 A：把 3–5 页自制或允许公开使用的文档复制到 `data/samples/`，不要下载完整数据集；
- 路线 B：根据官方数据页当前提供的下载方式取得数据，将数据版本或 commit hash 写入 `data/README.md`。

下载完成后，不要直接修改数据内容。

---

### Step 2

将下载的数据放入：

```text
data/raw/
```

例如：

```text
data/raw/OmniDocBench/

├── images/
├── OmniDocBench.json
├── README.md
└── README_ZH.md
```

以上是当前官方发布的核心文件示意；以 Dataset Card 的最新文件列表为准，不要自行把标注文件改名为 `labels.json`。

说明：

所有原始数据均放在 raw 目录。

禁止修改。

---

## 六、检查数据目录（Operations）

请确认目录如下：

```text
data/raw/OmniDocBench/

├── images/
├── OmniDocBench.json
└── README.md
```

其中：

images

保存所有图片。

OmniDocBench.json

保存官方页面级与区域级标注信息。

README.md

保存官方说明。

---

## 七、阅读数据集说明（Operations）

阅读官方 README。

重点了解以下内容。

### 数据来源

了解数据来自哪些场景。

例如：

* 学术论文
* 书籍
* 表格
* 杂志
* 技术文档

---

### 数据规模

记录：

* 图片数量
* 页面数量
* 标注数量

填写到实验记录中。

---

### 数据格式

重点了解：

图片格式。

例如：

```text
jpg

png

pdf
```

标注格式。

例如：

```text
JSON
```

---

## 八、完成唯一的数据说明文件（Operations）

进入：

```text
data/
```

编辑已经创建的：

```text
README.md
```

填写以下内容。

```markdown
# OmniDocBench Dataset

## Dataset Name

OmniDocBench

## Dataset Source

https://huggingface.co/datasets/opendatalab/OmniDocBench

## Dataset Revision

<commit hash or release version>

## License / Usage Restriction

<根据当前 Dataset Card 填写>

## Dataset Type

Document Understanding Benchmark

## Data Format

Images + JSON

## Application

- OCR

- Layout Analysis

- Table Recognition

- Reading Order

## Notes

This dataset will be used in Experiment 01.
```

保存文件。

---

## 九、建立 Sample 数据（Operations）

为了方便调试程序。

建议建立小规模测试集。

进入：

```text
data/samples/
```

选择 3–5 张差异明显的图片。至少覆盖纯文本、表格、图文混排中的两类；资源允许时再增加公式、手写或多语言页面。

例如：

```text
data/samples/

sample_text_01.jpg

sample_table_01.jpg

sample_mixed_01.jpg

...
```

同时建立 `data/samples/manifest.csv`，至少包含：

```text
sample_id,file_name,document_type,source_url,license_or_permission,expected_feature
```

不要直接使用完整数据集进行首次调试，也不要提交不能重新分发的样例文件；必要时只记录来源和准备方法。

---

## 十、数据完整性检查（Operations）

请逐项检查。

| 检查内容           | 是否完成 |
| -------------- | ---- |
| 数据路线与 revision 已记录 | □    |
| 图片可以打开         | □    |
| 官方路线下 OmniDocBench.json 存在 | □    |
| data/README.md 存在 | □    |
| sample 数据建立    | □    |
| manifest.csv 完成 | □    |

全部完成后进入下一步。

---

## 十一、建立数据管理规范（Laboratory Rules）

实验室统一规定：

### 原始数据

放入：

```text
data/raw/
```

禁止修改。

---

### 处理后的数据

放入：

```text
data/processed/
```

允许重新生成。

---

### Sample 数据

放入：

```text
data/samples/
```

用于程序调试。

---

### 大型数据

原则：

不上传 GitHub。

可放：

* Hugging Face Dataset
* 实验室服务器
* NAS

GitHub 仅保存数据说明文档。

---

## 十二、Git 管理（Operations）

进入项目目录。

执行：

```bash
git status
```

确认新增文件。

然后执行：

```bash
git add .
```

```bash
git commit -m "docs: add dataset structure and description"
```

```bash
git push
```

同步到 GitHub。

---

## 十三、常见问题（Common Errors）

### 问题一

数据目录放错。

正确目录：

```text
data/raw/
```

---

### 问题二

修改了原始图片。

解决方法：

重新下载数据。

原始数据不得修改。

---

### 问题三

Sample 数据过多。

建议：

第一次只用 3–5 张；完成全流程后再扩展。

方便快速调试。

---

### 问题四

数据上传到 GitHub。

大型数据不要上传。

GitHub 仅保存：

* README
* 数据说明
* 下载方法

---

## 十四、本部分成果（Deliverables）

完成本部分后，应提交：

```text
data/

├── raw/

├── processed/

├── samples/

└── README.md
```

GitHub 中应新增：

* 数据目录；
* 数据说明；
* Commit 记录。

---

## 十五、自我检查列表（Checklist）

| 检查项                       | 状态 |
| ------------------------- | -- |
| 数据路线、来源和 revision 已记录 | □  |
| raw 目录正确                  | □  |
| sample 数据建立               | □  |
| manifest.csv 完成             | □  |
| data/README.md 完成         | □  |
| GitHub 已同步                | □  |

全部完成后，进入下一部分。

---

## 十六、本部分小结

至此，你已经完成了实验数据准备工作。

实验所需数据已按照实验室规范进行管理，为后续模型下载和推理实验做好了准备。

---

## 下一部分

**Part 5：使用 Qwen/Qwen3.5-0.8B 完成第一次官方推理（Model Preparation and First Inference）**

下一部分将完成：

* 下载模型；
* 配置 Hugging Face；
* 运行官方示例程序；
* 完成第一次推理；
* 保存推理结果；
* 建立模型管理规范。

➡️ [进入 Part 05：模型准备与推理](Part05-模型准备与推理.md)

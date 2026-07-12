# Part 4：下载 OmniDocBench 数据集并完成数据集检查（Dataset Preparation）

---

# 一、本部分学习目标（Learning Objectives）

完成本部分后，你应该能够：

* 下载 OmniDocBench 数据集；
* 理解数据集目录结构；
* 检查数据是否完整；
* 建立实验数据目录；
* 编写数据集说明文档；
* 为后续模型推理做好准备。

---

# 二、实验任务

本部分的任务如下：

1. 下载 OmniDocBench 数据集；
2. 将数据集放入项目目录；
3. 检查数据完整性；
4. 阅读数据集说明；
5. 建立数据管理规范；
6. 提交 GitHub。

---

# 三、项目目录

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

# 四、建立数据目录（Operations）

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

# 五、下载 OmniDocBench 数据集（Operations）

## Step 1

打开浏览器。

进入 OmniDocBench 官方页面。

下载完整数据集。

下载完成后，不要直接修改数据内容。

---

## Step 2

将下载的数据放入：

```text
data/raw/
```

例如：

```text
data/raw/

├── images/

├── labels.json

└── README.md
```

说明：

所有原始数据均放在 raw 目录。

禁止修改。

---

# 六、检查数据目录（Operations）

请确认目录如下：

```text
data/raw/

├── images/

├── labels.json

└── README.md
```

其中：

images

保存所有图片。

labels.json

保存全部标注信息。

README.md

保存官方说明。

---

# 七、阅读数据集说明（Operations）

阅读官方 README。

重点了解以下内容。

## 数据来源

了解数据来自哪些场景。

例如：

* 学术论文
* 书籍
* 表格
* 杂志
* 技术文档

---

## 数据规模

记录：

* 图片数量
* 页面数量
* 标注数量

填写到实验记录中。

---

## 数据格式

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

# 八、创建数据集说明文件（Operations）

进入：

```text
docs/
```

创建：

```text
dataset_description.md
```

填写以下内容。

```markdown
# OmniDocBench Dataset

## Dataset Name

OmniDocBench

## Dataset Source

Official Release

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

# 九、建立 Sample 数据（Operations）

为了方便调试程序。

建议建立小规模测试集。

进入：

```text
data/samples/
```

复制：

10～20 张图片。

例如：

```text
data/samples/

0001.jpg

0002.jpg

0003.jpg

...
```

不要直接使用完整数据集进行调试。

---

# 十、数据完整性检查（Operations）

请逐项检查。

| 检查内容           | 是否完成 |
| -------------- | ---- |
| 数据下载完成         | □    |
| 图片可以打开         | □    |
| labels.json 存在 | □    |
| README 存在      | □    |
| sample 数据建立    | □    |

全部完成后进入下一步。

---

# 十一、建立数据管理规范（Laboratory Rules）

实验室统一规定：

## 原始数据

放入：

```text
data/raw/
```

禁止修改。

---

## 处理后的数据

放入：

```text
data/processed/
```

允许重新生成。

---

## Sample 数据

放入：

```text
data/samples/
```

用于程序调试。

---

## 大型数据

原则：

不上传 GitHub。

可放：

* Hugging Face Dataset
* 实验室服务器
* NAS

GitHub 仅保存数据说明文档。

---

# 十二、Git 管理（Operations）

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

# 十三、常见问题（Common Errors）

## 问题一

数据目录放错。

正确目录：

```text
data/raw/
```

---

## 问题二

修改了原始图片。

解决方法：

重新下载数据。

原始数据不得修改。

---

## 问题三

Sample 数据过多。

建议：

10～20 张即可。

方便快速调试。

---

## 问题四

数据上传到 GitHub。

大型数据不要上传。

GitHub 仅保存：

* README
* 数据说明
* 下载方法

---

# 十四、本部分成果（Deliverables）

完成本部分后，应提交：

```text
data/

├── raw/

├── processed/

├── samples/

└── README.md
```

以及：

```text
docs/

└── dataset_description.md
```

GitHub 中应新增：

* 数据目录；
* 数据说明；
* Commit 记录。

---

# 十五、自我检查列表（Checklist）

| 检查项                       | 状态 |
| ------------------------- | -- |
| 数据下载完成                    | □  |
| raw 目录正确                  | □  |
| sample 数据建立               | □  |
| dataset_description.md 完成 | □  |
| GitHub 已同步                | □  |

全部完成后，进入下一部分。

---

# 十六、本部分小结

至此，你已经完成了实验数据准备工作。

实验所需数据已按照实验室规范进行管理，为后续模型下载和推理实验做好了准备。

---

# 下一部分

**Part 5：下载 Qwen3.5-VL-0.8B 模型并完成第一次官方推理（Model Preparation and First Inference）**

下一部分将完成：

* 下载模型；
* 配置 Hugging Face；
* 运行官方示例程序；
* 完成第一次推理；
* 保存推理结果；
* 建立模型管理规范。

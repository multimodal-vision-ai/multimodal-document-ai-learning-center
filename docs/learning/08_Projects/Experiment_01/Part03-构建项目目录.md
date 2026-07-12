# Part 3：构建标准科研项目目录（Build a Standard Research Project Structure）

---

# 一、本部分学习目标（Learning Objectives）

完成本部分后，你应该能够：

* 建立实验室统一的科研项目目录；
* 理解每个目录的作用；
* 创建实验记录文件；
* 创建项目说明文档；
* 为后续模型开发做好准备。

完成本部分后，你将拥有一个标准化的科研项目框架。

---

# 二、为什么要统一项目目录？（Background）

在实验室中，一个科研项目通常需要持续数月甚至数年。

项目中会不断增加：

* 源代码
* 数据集
* 模型
* 实验记录
* 图片
* 推理结果
* 技术文档
* Notebook

如果没有统一的目录规范，项目会越来越混乱，影响团队协作和科研复现。

因此，实验室规定所有项目均采用统一目录结构。

---

# 三、项目目录结构（Project Structure）

请按照以下结构创建项目目录。

```text
qwen3vl-first-project/

├── README.md
├── LICENSE
├── .gitignore
├── requirements.txt
├── environment.yml
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── samples/
│
├── models/
│
├── scripts/
│
├── notebooks/
│
├── outputs/
│   ├── images/
│   ├── markdown/
│   ├── json/
│   └── logs/
│
├── experiments/
│
├── docs/
│
└── assets/
```

完成后，请确保目录名称与上述保持一致。

---

# 四、创建项目目录（Operations）

## Step 1：打开项目目录

进入已经 Clone 到本地的项目目录。

例如：

```text
D:\Research\qwen3vl-first-project\
```

---

## Step 2：创建一级目录

依次创建以下目录：

```text
data

models

scripts

notebooks

outputs

experiments

docs

assets
```

---

## Step 3：创建二级目录

进入 data 目录，继续创建：

```text
raw

processed

samples
```

---

进入 outputs 目录，继续创建：

```text
images

markdown

json

logs
```

---

## Step 4：检查目录

最终目录应如下所示：

```text
qwen3vl-first-project/

├── data/
│   ├── raw/
│   ├── processed/
│   └── samples/
│
├── outputs/
│   ├── images/
│   ├── markdown/
│   ├── json/
│   └── logs/
```

---

# 五、理解每个目录（Directory Description）

## README.md

项目说明文件。

用于介绍：

* 项目目标
* 开发环境
* 使用方法
* 项目结构

GitHub 首页默认显示该文件。

---

## data/

用于保存数据集。

### raw/

保存原始数据。

例如：

* PDF
* 图片
* 原始标注

禁止修改此目录中的数据。

---

### processed/

保存预处理后的数据。

例如：

* 图片裁剪
* 格式转换
* 数据增强

所有预处理结果均放入此目录。

---

### samples/

保存用于快速测试的小规模数据。

建议控制在：

10～20 张图片。

方便调试程序。

---

## models/

保存模型相关内容。

例如：

* 配置文件
* LoRA 权重
* Adapter

原则上，不提交大型模型文件到 GitHub。

---

## scripts/

保存 Python 程序。

例如：

```text
download_model.py

inference.py

evaluate.py
```

每个脚本只完成一个功能。

---

## notebooks/

保存 Notebook。

例如：

```text
demo.ipynb

benchmark.ipynb

visualization.ipynb
```

Notebook 用于实验验证。

正式代码应放入 scripts。

---

## outputs/

保存模型输出。

包括：

### images/

保存可视化图片。

---

### markdown/

保存 Markdown。

---

### json/

保存结构化结果。

---

### logs/

保存日志文件。

---

## experiments/

保存实验记录。

每一次实验建议建立一个独立目录。

例如：

```text
2026-07-09-first-run/

2026-07-12-prompt-test/

2026-07-15-benchmark/
```

便于后续查找。

---

## docs/

保存项目文档。

例如：

* 技术方案
* 设计说明
* Benchmark 分析
* 实验总结

---

## assets/

保存 README 使用的图片。

例如：

* 流程图
* 项目截图
* 示例图片

避免 README 中引用外部图片链接。

---

# 六、创建第一个 README（Operations）

在 README.md 中填写以下内容。

```markdown
# Qwen3.5-VL First Project

## Project Description

This project is the first research project of the Multimodal Document AI Laboratory.

## Objectives

- Learn Qwen3.5-VL
- Run the official demo
- Complete Document AI experiments

## Project Structure

See the directory structure below.

## Author

Your Name

## Last Update

2026-07-09
```

保存文件。

---

# 七、创建实验记录文件（Operations）

进入 experiments 目录。

创建：

```text
experiment_log.md
```

填写：

```markdown
# Experiment Log

## Experiment Information

Date:

Researcher:

Model:

Dataset:

## Objective

## Environment

## Procedure

## Results

## Problems

## Improvements
```

今后所有实验均以此模板记录。

---

# 八、检查项目结构（Expected Results）

完成后，项目目录应如下：

```text
qwen3vl-first-project/

├── README.md
├── requirements.txt
├── environment.yml
├── data/
├── models/
├── scripts/
├── notebooks/
├── outputs/
├── experiments/
├── docs/
└── assets/
```

目录创建完成后，不再随意修改。

---

# 九、提交至 GitHub（Operations）

打开终端。

进入项目目录。

执行：

```bash
git status
```

确认新增目录。

然后依次执行：

```bash
git add .
```

```bash
git commit -m "build: initialize project structure"
```

```bash
git push
```

Push 完成后，刷新 GitHub 页面。

确认所有目录已同步。

---

# 十、常见问题（Common Errors）

## 问题一

目录名称大小写不一致。

解决方法：

严格按照实验指导书命名。

---

## 问题二

README 未显示。

解决方法：

确认文件名称为：

```text
README.md
```

全部使用大写。

---

## 问题三

空目录未上传。

原因：

Git 默认不会跟踪空目录。

解决方法：

每个空目录创建：

```text
.gitkeep
```

例如：

```text
data/raw/.gitkeep

models/.gitkeep

outputs/json/.gitkeep
```

然后重新提交。

---

# 十一、本部分成果（Deliverables）

完成本部分后，应提交以下成果：

* GitHub 项目目录；
* README.md；
* experiment_log.md；
* 标准科研项目结构；
* Git Commit 记录。

---

# 十二、自我检查列表（Checklist）

| 检查项             | 状态 |
| --------------- | -- |
| 项目目录创建完成        | □  |
| README 已完善      | □  |
| experiments 已建立 | □  |
| outputs 已建立     | □  |
| scripts 已建立     | □  |
| GitHub 已同步      | □  |

全部通过后，进入下一部分。

---

# 十三、本部分小结

至此，你已经完成实验室标准科研项目框架的搭建。

后续所有代码开发、模型推理、实验记录和结果分析，都将在此项目中完成。

---

# 下一部分

**Part 4：下载 OmniDocBench 数据集并完成数据集检查（Dataset Preparation）**

下一部分将完成：

* 下载公开数据集；
* 理解数据集目录结构；
* 查看标注文件；
* 编写数据集说明；
* 完成数据完整性检查；
* 建立实验数据管理规范。

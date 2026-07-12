# Chapter 2：Python 开发环境

# Python Development Environment

---

# 1. 学习目标

完成本章学习后，你应该能够：

* 理解 Python 开发环境组成
* 安装 Miniconda
* 创建 Conda 虚拟环境
* 使用 VS Code 开发 Python 项目
* 安装 PyTorch
* 配置 CUDA（可选）
* 独立搭建实验室统一开发环境

---

# 2. 为什么需要统一开发环境？

统一开发环境能够：

* 减少环境配置问题
* 保证代码可复现
* 方便团队协作
* 提高开发效率

实验室所有项目均建议使用统一的软件版本。

---

# 3. 推荐开发环境

| 软件                        | 推荐版本         | 是否必须   |
| ------------------------- | ------------ | ------ |
| Windows 11 / Ubuntu 22.04 | 最新稳定版        | ✓      |
| Python                    | 3.11         | ✓      |
| Miniconda                 | 最新版          | ✓      |
| Git                       | 最新版          | ✓      |
| VS Code                   | 最新版          | ✓      |
| CUDA Toolkit              | 与 PyTorch 对应 | GPU 用户 |
| PyTorch                   | 官方稳定版        | ✓      |

---

# 4. 软件安装顺序

建议严格按照以下顺序安装：

```text id="y7m7nr"
Git

↓

Miniconda

↓

Python Environment

↓

VS Code

↓

PyTorch

↓

CUDA（GPU 用户）
```

---

# 5. 必装软件

## Git

官方网站：

https://git-scm.com/

作用：

* 管理源码
* 下载 GitHub 项目
* 版本控制

---

## Miniconda

官方网站：

https://docs.conda.io/

作用：

* Python 环境管理
* 包管理
* 虚拟环境管理

建议优先使用 Miniconda，而不是 Anaconda。

---

## VS Code

官方网站：

https://code.visualstudio.com/

推荐安装插件：

* Python
* Pylance
* Jupyter
* GitHub Copilot（可选）
* Markdown All in One

---

# 6. 创建实验室统一环境

建议环境名称：

```text id="s9rjvd"
mdai
```

创建环境：

```bash
conda create -n mdai python=3.11
```

激活环境：

```bash
conda activate mdai
```

查看环境：

```bash
conda env list
```

---

# 7. 安装 PyTorch

请访问官方安装页面：

https://pytorch.org/get-started/locally/

根据自己的操作系统和 CUDA 版本生成安装命令。

安装完成后验证：

```python
import torch

print(torch.__version__)
print(torch.cuda.is_available())
```

---

# 8. 推荐目录结构

建议在本地建立统一开发目录。

```text id="qv3frx"
AI_Workspace/

├── Projects/
├── Datasets/
├── Models/
├── Learning/
├── Papers/
└── Tools/
```

其中：

* Projects：GitHub 项目
* Datasets：数据集
* Models：模型文件
* Learning：学习资料
* Papers：论文
* Tools：工具软件

---

# 9. Python 包管理

建议优先使用：

```bash
conda install
```

其次使用：

```bash
pip install
```

避免混合安装导致依赖冲突。

安装新包前，建议先查看官方文档。

---

# 10. 常用开发工具

建议熟悉以下工具：

| 工具                 | 用途       |
| ------------------ | -------- |
| VS Code            | 代码开发     |
| Jupyter Notebook   | 实验验证     |
| GitHub Desktop（可选） | Git 图形界面 |
| Terminal           | 命令行操作    |

---

# 11. 环境导出与共享

导出当前环境：

```bash
conda env export > environment.yml
```

恢复环境：

```bash
conda env create -f environment.yml
```

建议所有科研项目均提供 `environment.yml` 文件。

---

# 12. 推荐学习资源

## Python 官方

https://www.python.org/

---

## Miniconda

https://docs.conda.io/

---

## PyTorch

https://pytorch.org/

---

## VS Code

https://code.visualstudio.com/

---

# 13. 本章实践

请完成以下任务：

## 任务一

安装 Git。

---

## 任务二

安装 Miniconda。

---

## 任务三

创建 `mdai` 虚拟环境。

---

## 任务四

安装 VS Code，并安装推荐插件。

---

## 任务五

安装 PyTorch，并验证 GPU 是否可用。

---

## 任务六

建立本地 `AI_Workspace` 工作目录。

---

# 14. 本章总结

完成本章后，你应该已经能够：

* 独立搭建 AI 开发环境
* 管理 Python 虚拟环境
* 使用 VS Code 编写 Python 程序
* 安装和使用 PyTorch
* 为后续课程做好准备

---

# 下一章

下一章学习：

> **Chapter 3：Hugging Face**

主要内容：

* Hugging Face 平台介绍
* Model Hub
* Dataset Hub
* Spaces
* Transformers
* 模型下载与使用
* 实验室模型管理规范

完成后，你将能够熟练使用 Hugging Face 平台获取和管理 AI 模型与数据集。

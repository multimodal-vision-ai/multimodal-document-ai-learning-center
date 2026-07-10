# Part 5：下载 Qwen3.5-VL-0.8B 模型并完成第一次官方推理（Model Preparation and First Inference）

---

# 一、本部分学习目标（Learning Objectives）

完成本部分后，你应该能够：

* 配置 Hugging Face 模型下载环境；
* 下载 Qwen3.5-VL-0.8B 模型；
* 运行官方推理程序；
* 理解一次完整的模型推理流程；
* 保存推理结果；
* 建立模型管理规范。

---

# 二、实验任务

本部分需要完成以下任务：

1. 检查 Python 环境；
2. 安装项目依赖；
3. 登录 Hugging Face；
4. 下载模型；
5. 编写第一个推理程序；
6. 运行官方示例；
7. 保存推理结果；
8. 提交 GitHub。

---

# 三、检查开发环境（Operations）

进入项目目录：

```text
qwen3vl-first-project/
```

打开终端。

检查 Python 版本：

```bash
python --version
```

建议输出：

```text
Python 3.11.x
```

检查 pip：

```bash
pip --version
```

检查 Git：

```bash
git --version
```

确认以上命令均可正常执行。

---

# 四、安装项目依赖（Operations）

创建项目依赖文件：

```text
requirements.txt
```

填写内容：

```text
torch
torchvision
transformers
accelerate
pillow
huggingface_hub
qwen-vl-utils
```

保存文件。

安装依赖：

```bash
pip install -r requirements.txt
```

等待安装完成。

---

# 五、导出环境配置（Operations）

安装完成后，导出当前环境。

如果使用 Conda：

```bash
conda env export > environment.yml
```

如果使用 venv，可保留：

```text
requirements.txt
```

即可。

将环境文件保存到项目根目录。

---

# 六、登录 Hugging Face（Operations）

打开终端。

输入：

```bash
huggingface-cli login
```

根据提示输入 Access Token。

登录成功后，执行：

```bash
huggingface-cli whoami
```

能够显示当前用户名即可。

---

# 七、下载模型（Operations）

推荐使用 Hugging Face 下载模型。

在浏览器中打开模型主页。

确认模型名称。

记录：

* 模型名称；
* 发布时间；
* License；
* Model Card。

将以上信息记录到：

```text
docs/model_information.md
```

建议内容如下：

```markdown
# Model Information

## Model

Qwen3.5-VL-0.8B

## Source

Hugging Face

## Version

Official Release

## Application

Vision Language Model

## Download Date

YYYY-MM-DD
```

---

# 八、创建模型目录（Operations）

进入：

```text
models/
```

创建：

```text
models/

README.md
```

填写：

```markdown
# Models

本目录用于管理项目所使用的模型。

原则：

- 不上传大型模型文件；
- 仅保存配置文件、说明文档和微调权重；
- 模型统一通过 Hugging Face 下载。
```

---

# 九、编写第一次推理程序（Operations）

进入：

```text
scripts/
```

创建：

```text
first_inference.py
```

本实验建议直接参考官方示例程序完成，不建议修改模型核心代码。

程序完成后，应能够：

* 加载模型；
* 加载图片；
* 输入 Prompt；
* 输出结果。

---

# 十、准备测试图片（Operations）

进入：

```text
data/samples/
```

确认至少存在一张图片。

例如：

```text
0001.jpg
```

该图片作为第一次推理测试使用。

---

# 十一、运行第一次推理（Operations）

打开终端。

进入项目目录。

执行：

```bash
python scripts/first_inference.py
```

程序正常运行后，应输出模型回答。

如果输出正常，说明模型已能够完成推理。

---

# 十二、保存推理结果（Operations）

进入：

```text
outputs/
```

创建目录：

```text
outputs/

├── markdown/

├── json/

└── images/
```

保存：

模型输出文本。

例如：

```text
outputs/markdown/

result_0001.md
```

如果输出 JSON。

保存：

```text
outputs/json/

result_0001.json
```

---

# 十三、建立第一次实验记录（Operations）

进入：

```text
experiments/
```

创建：

```text
2026-Experiment01/
```

目录如下：

```text
experiments/

└── 2026-Experiment01/

    ├── experiment.md

    ├── prompts.md

    └── results.md
```

---

编辑：

```text
experiment.md
```

填写：

```markdown
# Experiment 01

## Date

YYYY-MM-DD

## Model

Qwen3.5-VL-0.8B

## Dataset

OmniDocBench Sample

## Objective

Run the first inference.

## Status

Completed
```

---

编辑：

```text
prompts.md
```

填写：

```markdown
# Prompt

Describe this document.
```

---

编辑：

```text
results.md
```

填写：

```markdown
# Result

The model successfully completed the first inference.

More detailed analysis will be added in the next experiment.
```

---

# 十四、检查项目结构（Expected Results）

完成本部分后，项目应新增：

```text
models/

README.md

scripts/

first_inference.py

outputs/

markdown/

json/

experiments/

2026-Experiment01/
```

---

# 十五、Git 提交（Operations）

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
git commit -m "feat: complete first qwen inference"
```

```bash
git push
```

Push 成功后，刷新 GitHub 页面。

确认所有新增文件均已同步。

---

# 十六、常见问题（Common Errors）

## 问题一

模型下载失败。

检查：

* 网络连接；
* Hugging Face 登录状态；
* 模型名称是否正确。

---

## 问题二

CUDA 不可用。

检查：

```bash
nvidia-smi
```

确认 GPU 是否正常。

如果没有 GPU，可先使用 CPU 完成测试。

---

## 问题三

依赖安装失败。

建议升级：

```bash
pip install --upgrade pip
```

然后重新安装依赖。

---

## 问题四

程序无法找到图片。

检查：

```text
data/samples/
```

图片路径是否正确。

---

# 十七、本部分成果（Deliverables）

完成本部分后，应提交：

* requirements.txt；
* environment.yml；
* model_information.md；
* first_inference.py；
* Experiment 01 实验记录；
* 第一次推理结果；
* Git Commit 记录。

---

# 十八、自我检查列表（Checklist）

| 检查项        | 状态 |
| ---------- | -- |
| 开发环境正常     | □  |
| 模型下载完成     | □  |
| 官方程序运行成功   | □  |
| 成功完成第一次推理  | □  |
| 推理结果已保存    | □  |
| 实验记录完整     | □  |
| GitHub 已同步 | □  |

全部完成后，进入下一部分。

---

# 十九、本部分小结

至此，你已经完成了实验室第一个模型推理实验，并建立了模型管理、实验记录和结果保存的基本规范。

---

# 下一部分

**Part 6：Prompt Engineering 与多组实验（Prompt Design and Comparative Experiments）**

下一部分将完成：

* 设计不同 Prompt；
* 比较模型输出结果；
* 分析 Prompt 对推理效果的影响；
* 建立 Prompt 管理规范；
* 完成第一份实验分析报告。

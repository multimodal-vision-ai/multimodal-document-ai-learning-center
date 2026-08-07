# Part 5：使用 Qwen/Qwen3.5-0.8B 完成第一次推理（Model Preparation and First Inference）

[上一关：准备实验数据](Part04-数据集准备.md){ .md-button }
[返回项目控制台](README.md){ .md-button }
[下一关：完成受控对比](Part06-提示词管理与对比分析.md){ .md-button .md-button--primary }

> **本关核心产出**：可运行代码、run metadata 与未经修改的原始输出 · **预计时间**：2–3 小时

[官方 Model Card](https://huggingface.co/Qwen/Qwen3.5-0.8B){ .md-button .md-button--primary }
[课程最小实验](../../learning/06-1_Qwen3.5-VL-0.8B.md){ .md-button }

!!! success "本关通过条件"
    从 README 中的一条命令可以处理一个 `sample_id`；代码使用官方模型 ID `Qwen/Qwen3.5-0.8B`；输入、完整 Prompt、模型 revision、generation config、环境版本和原始输出能够一一对应。

!!! warning "先以 Model Card 为准"
    模型加载类与依赖会更新。本页规定要保存什么证据，但安装命令和推理 API 应从当前官方 Model Card 复制。不要通过猜测类名或下载同名非官方仓库来绕过错误。

---

## 一、本部分学习目标（Learning Objectives）

完成本部分后，你应该能够：

* 配置 Hugging Face 模型下载环境；
* 使用官方模型 ID `Qwen/Qwen3.5-0.8B`；
* 运行官方推理程序；
* 理解一次完整的模型推理流程；
* 保存推理结果；
* 建立模型管理规范。

---

## 二、实验任务

本部分需要完成以下任务：

1. 检查 Python 环境；
2. 安装项目依赖；
3. 登录 Hugging Face；
4. 通过官方模型 ID 加载模型；
5. 编写第一个推理程序；
6. 运行官方示例；
7. 保存推理结果；
8. 提交 GitHub。

---

## 三、检查开发环境（Operations）

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

## 四、安装项目依赖（Operations）

先阅读官方 Model Card 的当前安装要求，在隔离环境中完成安装。不要在运行前凭经验固定一组可能过期的版本。

创建直接依赖说明文件：

```text
requirements.in
```

可以先记录本项目直接使用的包：

```text
torch
torchvision
accelerate
pillow
huggingface_hub
# transformers 的安装来源或版本按当前 Model Card 记录
```

按照 Model Card 完成安装并成功运行后，再导出实际环境：

```bash
python -m pip freeze > requirements-lock.txt
```

`requirements.in` 用于解释直接依赖，`requirements-lock.txt` 用于复现实验；两者职责不同。

---

## 五、导出环境配置（Operations）

安装完成后，导出当前环境。

如果使用 Conda：

```bash
conda env export > environment.yml
```

如果使用 venv，应保留：

```text
requirements.in
requirements-lock.txt
```

即可。

将环境文件保存到项目根目录。

---

## 六、按需登录 Hugging Face（Operations）

先直接访问公开 Model Card。只有平台提示需要认证时，才在终端登录：

```bash
hf auth login
```

验证当前账号：

```bash
hf auth whoami
```

不要把 token 写进脚本、notebook、`.env` 示例输出或 Git 历史。公开模型通常不需要为了“完成步骤”而强制登录。

命令用法以 [Hugging Face Hub CLI 官方文档](https://huggingface.co/docs/huggingface_hub/package_reference/cli)为准。

---

## 七、确认并加载官方模型（Operations）

在浏览器中打开 [Qwen/Qwen3.5-0.8B Model Card](https://huggingface.co/Qwen/Qwen3.5-0.8B)，确认仓库位于官方 `Qwen` 组织。首次运行 `from_pretrained` 或官方 pipeline 时会按 Hugging Face 缓存机制取得模型，无需把权重复制进项目仓库。

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

Qwen/Qwen3.5-0.8B

## Source

https://huggingface.co/Qwen/Qwen3.5-0.8B

## Revision

<commit hash>

## License

<从当前 Model Card 填写>

## Application

Vision Language Model

## Download Date

YYYY-MM-DD

## Runtime

- Python:
- PyTorch:
- Transformers:
- Device / dtype:
```

---

## 八、创建模型目录（Operations）

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

## 九、编写第一次推理程序（Operations）

进入：

```text
scripts/
```

创建：

```text
first_inference.py
```

从官方 Model Card 复制当前的 Transformers `image-text-to-text` 最小示例，先保持官方图片与 Prompt 不变运行一次。确认成功后：

1. 将模型 ID 保持为 `Qwen/Qwen3.5-0.8B`；
2. 把图像替换为 `data/samples/manifest.csv` 中的一个本地样例；
3. 把 `sample_id`、Prompt 和 generation config 作为显式输入；
4. 将模型原始回答原样写入 `outputs/raw/<run_id>.txt`；
5. 把同一 run 的 metadata 写入 `outputs/metadata/<run_id>.json`。

不建议修改模型核心代码，也不要在保存前人工整理输出。

程序完成后，应能够：

* 加载模型；
* 加载图片；
* 输入 Prompt；
* 输出结果。

---

## 十、准备测试图片（Operations）

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

## 十一、运行第一次推理（Operations）

打开终端。

进入项目目录。

执行：

```bash
python scripts/first_inference.py
```

程序正常运行后，应输出模型回答。

如果输出正常，说明模型已能够完成推理。

---

## 十二、保存推理结果（Operations）

进入：

```text
outputs/
```

创建目录：

```text
outputs/

├── raw/
├── metadata/
└── figures/
```

保存：

模型输出文本。

例如：

```text
outputs/raw/

run_001.txt
```

如果输出 JSON。

保存：

```text
outputs/metadata/

run_001.json
```

---

## 十三、建立第一次实验记录（Operations）

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

Qwen/Qwen3.5-0.8B

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

## 十四、检查项目结构（Expected Results）

完成本部分后，项目应新增：

```text
models/

README.md

scripts/

first_inference.py

outputs/

raw/

metadata/

figures/

experiments/

2026-Experiment01/
```

---

## 十五、Git 提交（Operations）

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

## 十六、常见问题（Common Errors）

### 问题一

模型下载失败。

检查：

* 网络连接；
* Hugging Face 登录状态；
* 模型名称是否正确。

---

### 问题二

CUDA 不可用。

检查：

```bash
nvidia-smi
```

确认 GPU 是否正常。

如果没有合适的 GPU，优先使用课程允许的 Kaggle 或实验室服务器；只有确认内存与耗时可接受时才使用 CPU。

---

### 问题三

依赖安装失败。

回到 Model Card 核对当前安装来源、Python/PyTorch/Transformers 组合和完整错误信息。不要先无条件升级所有包；把实际解决方法与最终版本写入实验日志。

---

### 问题四

程序无法找到图片。

检查：

```text
data/samples/
```

图片路径是否正确。

---

## 十七、本部分成果（Deliverables）

完成本部分后，应提交：

* requirements.in 与 requirements-lock.txt；
* environment.yml；
* model_information.md；
* first_inference.py；
* Experiment 01 实验记录；
* 第一次推理结果；
* Git Commit 记录。

---

## 十八、自我检查列表（Checklist）

| 检查项        | 状态 |
| ---------- | -- |
| 开发环境正常     | □  |
| 官方模型可以加载   | □  |
| 官方程序运行成功   | □  |
| 成功完成第一次推理  | □  |
| 推理结果已保存    | □  |
| 实验记录完整     | □  |
| GitHub 已同步 | □  |

全部完成后，进入下一部分。

---

## 十九、本部分小结

至此，你已经完成了实验室第一个模型推理实验，并建立了模型管理、实验记录和结果保存的基本规范。

---

## 下一部分

**Part 6：Prompt Engineering 与多组实验（Prompt Design and Comparative Experiments）**

下一部分将完成：

* 设计不同 Prompt；
* 比较模型输出结果；
* 分析 Prompt 对推理效果的影响；
* 建立 Prompt 管理规范；
* 完成第一份实验分析报告。

➡️ [进入 Part 06：Prompt设计与实验分析](Part06-提示词管理与对比分析.md)

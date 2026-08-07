# Python 环境：让实验能够重建

> **对应课程**：[Week 1](00_12_Week_Bootcamp.md)<br>
> **目标**：从空环境执行一条安装命令和一条运行命令，得到与 README 一致的结果。

“在我的电脑上能运行”不是可复现。每个实验都应使用独立环境，记录解释器、依赖、硬件和关键配置。

## 学习目标

- 创建并激活隔离环境；
- 区分 Python 版本、包版本与 CUDA/PyTorch 兼容性；
- 使用依赖文件声明项目所需包；
- 从空环境复现并记录结果。

## 官方学习入口

- [Python virtual environments and packages](https://docs.python.org/3/tutorial/venv.html)（`venv` 与 `pip`）
- [Installing Python modules](https://docs.python.org/3/installing/index.html)（官方安装说明）
- [pip user guide](https://pip.pypa.io/en/stable/user_guide/)（requirements 与依赖管理）
- [Conda managing environments](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html)（使用 Conda 时）
- [PyTorch Start Locally](https://pytorch.org/get-started/locally/)（按系统和 CUDA 选择安装方式）

## 选择一种环境方式

### Python `venv`

适合 CPU 工具、小型脚本和依赖简单的项目：

```bash
python -m venv .venv
```

激活命令因系统而异，以 Python 官方文档为准。激活后确认：

```bash
python --version
python -m pip --version
```

### Conda

适合需要特定 Python、CUDA 或原生依赖的 AI 实验：

```bash
conda create -n mdai python=3.11
conda activate mdai
```

课程不要求同时使用两套工具。选择一种并在 README 写清楚即可。

## 声明依赖

对于简单项目，可以使用：

```text
requirements.txt
```

对于 Conda 项目，可以使用：

```text
environment.yml
```

依赖文件应表达“项目运行所需内容”，不是把整个个人环境无限制导出。模型课程还需要记录：

- Python；
- PyTorch；
- Transformers；
- CUDA runtime/driver（如适用）；
- 模型 revision；
- 数据版本。

!!! warning "版本策略"
    “全部使用最新版”不可复现；“永远锁死所有间接依赖”又难以维护。课程至少固定 Python 与关键直接依赖，并在每次成功运行后保存完整环境快照作为证据。

## 环境自检脚本

创建 `check_environment.py`：

```python
import platform
import sys

print("python:", sys.version)
print("platform:", platform.platform())

try:
    import torch

    print("torch:", torch.__version__)
    print("cuda_available:", torch.cuda.is_available())
    if torch.cuda.is_available():
        print("gpu:", torch.cuda.get_device_name(0))
except ImportError:
    print("torch: not installed (acceptable for Week 1 CPU task)")
```

该脚本只负责报告环境，不应自动安装或修改系统。

## Week 1 必做任务

1. 创建一个独立环境；
2. 安装 Week 1 工具所需的最少依赖；
3. 保存 `requirements.txt` 或 `environment.yml`；
4. 运行环境自检脚本并保存输出；
5. 删除并重建环境，按 README 从头复现；
6. 请同学在另一台电脑或独立环境复现一次。

## 提交物

```text
week01/
├── README.md
├── requirements.txt          # 或 environment.yml
├── check_environment.py
├── environment-output.txt
└── reproduction-notes.md
```

`reproduction-notes.md` 应记录复现日期、平台、成功命令、失败信息、解决方法和仍存在的限制。

## 验收清单

- [ ] 项目没有依赖系统全局 Python 的隐式状态；
- [ ] README 写明支持的 Python 版本；
- [ ] 一条安装命令可建立依赖；
- [ ] 一条运行命令可得到结果；
- [ ] PyTorch/CUDA 安装来自官方兼容选择页；
- [ ] 环境快照不含用户名、token 或私人路径；
- [ ] 至少完成一次从空环境复现。

## 常见问题

### `pip` 安装到了错误的 Python

优先使用 `python -m pip`，并同时检查 `python --version` 与 `python -m pip --version` 指向的环境。

### CUDA available 为 False

先确认课程任务是否真的需要 GPU。需要时按 PyTorch 官方选择页检查驱动、PyTorch build 和硬件，不要反复随机安装 CUDA 包。

### Notebook 使用了不同 kernel

在 Notebook 中打印 `sys.executable`，确认它与预期环境一致，并在提交前 Restart & Run All。

## 下一步

进入[Hugging Face Hub](03_HuggingFace.md)，学习如何记录模型和数据的准确版本。

最后更新：2026-08-07

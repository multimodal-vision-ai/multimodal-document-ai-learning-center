"""配置加载与路径解析。

Kaggle 环境规则（见 docs/notebook-design.md §6）：
- 代码不硬编码绝对路径；
- /kaggle/input 只读，/kaggle/working 是工作目录；
- 所有实验产物写在工作目录下的 results/，便于会话结束后导出；
- 环境变量 ODB_PROJECT_ROOT 可覆盖工作目录。
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Dict, Optional

import yaml

_DEFAULT_CONFIG = Path(__file__).resolve().parents[1] / "configs" / "default.yaml"


def load_config(path: Optional[os.PathLike] = None) -> Dict[str, Any]:
    """加载 YAML 配置；默认使用仓库内 configs/default.yaml。"""
    cfg_path = Path(path) if path is not None else _DEFAULT_CONFIG
    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)
    return cfg if isinstance(cfg, dict) else {}


def project_root() -> Path:
    """实验工作目录（Kaggle 上为 /kaggle/working，本地为当前目录）。"""
    root = os.environ.get("ODB_PROJECT_ROOT")
    return Path(root).resolve() if root else Path.cwd().resolve()


def repo_root() -> Path:
    """本仓库根目录（定位 src/、configs/、prompts/）。"""
    return Path(__file__).resolve().parents[1]


def results_dir(config: Optional[Dict[str, Any]] = None) -> Path:
    """实验结果根目录（默认 <project_root>/results）。"""
    cfg = config if config is not None else load_config()
    rel = cfg.get("paths", {}).get("results_dir", "results")
    return project_root() / rel


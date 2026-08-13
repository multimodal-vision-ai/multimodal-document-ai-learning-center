"""消融实验记录与可视化（Phase 4，Notebook 09）。

红线：一次只改变一个主要变量；每个实验必须记录固定量与变量
（模型 revision、数据划分、prompt、评测 commit、唯一变量）。
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Sequence

from . import data


def ablation_record(
    ablation: str,
    variable: str,
    value: str,
    metrics: Dict[str, Any],
    fixed: Dict[str, Any],
) -> Dict[str, Any]:
    """构造一行消融记录（写入 ablation_results.csv）。"""
    record = {
        "ablation": ablation,
        "variable": variable,
        "value": value,
        **metrics,
        "fixed": fixed,
    }
    return record


def write_ablation_csv(rows: Sequence[Dict[str, Any]], path: Path) -> Path:
    import csv

    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    keys: List[str] = []
    for row in rows:
        for k in row:
            if k not in keys:
                keys.append(k)
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in keys})
    return path


def plot_ablation(rows: Sequence[Dict[str, Any]], x_key: str, y_keys: Sequence[str], title: str):
    """折线图：x 为变量取值，y 为若干指标。返回 matplotlib Figure。"""
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(8, 5))
    for y_key in y_keys:
        xs = [r["value"] for r in rows]
        ys = [r.get(y_key) for r in rows]
        ax.plot(xs, ys, marker="o", label=y_key)
    ax.set_xlabel(x_key)
    ax.set_ylabel("metric")
    ax.set_title(title)
    ax.legend()
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    return fig

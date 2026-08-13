"""标注与输出可视化（Notebook 01/08 共用）。"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Optional

CATEGORY_COLORS: Dict[str, str] = {
    "title": "#1f77b4",
    "text_block": "#2ca02c",
    "list_group": "#98df8a",
    "reference": "#c5b0d5",
    "figure": "#ff7f0e",
    "figure_caption": "#ffbb78",
    "table": "#d62728",
    "table_caption": "#ff9896",
    "equation_isolated": "#9467bd",
    "equation_caption": "#c49c94",
    "header": "#8c564b",
    "footer": "#8c564b",
    "page_number": "#e377c2",
    "abandon": "#d9d9d9",
}
DEFAULT_COLOR = "#7f7f7f"


def draw_annotations(
    image: Any,
    page: Dict[str, Any],
    max_regions: int = 40,
    title: Optional[str] = None,
) -> Any:
    """绘制页面标注：按 category 着色 + 阅读顺序编号。返回 matplotlib Figure。"""
    import matplotlib.pyplot as plt
    from matplotlib.patches import Polygon

    fig, ax = plt.subplots(figsize=(12, 12))
    ax.imshow(image)
    ax.set_axis_off()

    layout_dets = [d for d in page.get("layout_dets", []) or [] if not d.get("ignore")]
    for det in layout_dets[:max_regions]:
        poly = det.get("poly")
        if not poly or len(poly) < 8:
            continue
        points = [(poly[i], poly[i + 1]) for i in range(0, 8, 2)]
        cat = det.get("category_type", "unknown")
        color = CATEGORY_COLORS.get(cat, DEFAULT_COLOR)
        ax.add_patch(
            Polygon(points, closed=True, fill=False, edgecolor=color, linewidth=1.5)
        )
        order = det.get("order")
        if order is not None:
            ax.text(points[0][0] + 2, points[0][1] - 4, str(order), fontsize=7, color=color)
    if title:
        ax.set_title(title, fontsize=12)
    handles = [
        plt.Line2D([0], [0], color=color, lw=2, label=cat)
        for cat, color in CATEGORY_COLORS.items()
    ]
    ax.legend(handles=handles, loc="lower left", bbox_to_anchor=(1.01, 0), fontsize=8)
    plt.tight_layout()
    return fig


def save_figure(fig: Any, path: Path) -> Path:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(path, dpi=110, bbox_inches="tight")
    return path

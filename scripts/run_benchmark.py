"""命令行入口：与 Notebook 07 等价的评测准备与 smoke 自检。

用法（在仓库根目录）：
    python scripts/run_benchmark.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src import data, evaluation  # noqa: E402
from src.config import load_config, project_root  # noqa: E402


def main() -> None:
    cfg = load_config()
    data_root = data.find_dataset_root()
    annotations = data.load_annotations(data_root)

    base = project_root() / cfg["paths"]["baseline_dir"]
    bench = project_root() / cfg["paths"]["benchmark_dir"]

    md_dir = bench / "md2md"
    written = evaluation.export_markdown_predictions(
        base / "predictions", data_root, md_dir
    )
    print(f"[md2md] 导出 {len(written)} 个 Markdown 预测 -> {md_dir}")

    repo = evaluation.ensure_eval_repo(project_root() / "third_party")
    print("[official eval repo]", repo)

    log = evaluation.run_official_eval(
        cfg, repo, gt_dir=data_root, pred_dir=md_dir, output_dir=bench, eval_kind="md2md"
    )
    if log is None:
        print(
            "⚠️ configs/default.yaml 尚未填写官方 CLI 模板，跳过官方评测；"
            "运行非官方 smoke 自检（仅供 pipeline 检查）。"
        )
    rows = evaluation.sanity_check(base / "predictions", annotations, data_root)
    summary = evaluation.build_summary_table(rows)
    data.write_json(summary, bench / "sanity_summary.json")
    print("[sanity summary]", summary["overall"])


if __name__ == "__main__":
    main()


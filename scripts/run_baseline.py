"""命令行入口：与 Notebook 04 等价的 Baseline 批量推理。

用法（在仓库根目录）：
    python scripts/run_baseline.py --mode fast
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src import data  # noqa: E402
from src.config import load_config, project_root  # noqa: E402
from src.inference import environment_snapshot, run_baseline  # noqa: E402
from src.model import SmolDoclingAdapter, model_summary  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="SmolDocling baseline inference")
    parser.add_argument("--mode", default="fast", choices=["fast", "teaching", "research"])
    parser.add_argument("--prompt-id", default="v0")
    args = parser.parse_args()

    cfg = load_config()
    print("[environment]", environment_snapshot())
    data_root = data.find_dataset_root()
    print("[dataset]", data_root)
    annotations = data.load_annotations(data_root)

    adapter = SmolDoclingAdapter().load()
    print("[model]", model_summary(adapter))

    output_dir = project_root() / cfg["paths"]["baseline_dir"]
    manifest = run_baseline(
        annotations,
        data_root,
        adapter,
        output_dir=output_dir,
        mode=args.mode,
        config=cfg,
        prompt_id=args.prompt_id,
    )
    print("[done]", manifest)


if __name__ == "__main__":
    main()


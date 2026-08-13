"""批量推理、缓存与断点恢复。

设计原则（任务文件 §九、docs/notebook-design.md §8.5/8.6）：
- 三种模式：fast / teaching / research（页数在 configs/default.yaml 定义）；
- 每个样本写入独立 JSON 缓存，重启后自动跳过已有输出；
- 记录 prompt_id、model revision、image_id、generation_config、latency；
- 产物写入 results/baseline/。
"""

from __future__ import annotations

import json
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

from . import data
from .model import DocumentModelAdapter
from .prompts import get_prompt


def environment_snapshot() -> Dict[str, Any]:
    """GPU / CUDA / PyTorch / transformers / docling 版本快照。

    任务文件 §三要求每个 Notebook 自动输出这些信息；
    结果同时写入 experiment_metadata.json。
    """
    import platform

    import torch

    snap: Dict[str, Any] = {
        "python": sys.version.split()[0],
        "platform": platform.platform(),
        "torch": torch.__version__,
        "cuda_available": torch.cuda.is_available(),
        "gpu": [],
    }
    if torch.cuda.is_available():
        snap["cuda_version"] = torch.version.cuda
        snap["gpu"] = [
            {
                "name": torch.cuda.get_device_name(i),
                "vram_gb": round(
                    torch.cuda.get_device_properties(i).total_memory / 1024**3, 1
                ),
            }
            for i in range(torch.cuda.device_count())
        ]
    for lib in ("transformers", "docling_core", "pillow", "numpy", "pandas"):
        try:
            mod = __import__(lib)
            snap[lib] = getattr(mod, "__version__", "unknown")
        except ImportError:
            snap[lib] = None
    try:
        out = subprocess.run(
            ["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader"],
            capture_output=True,
            text=True,
            timeout=30,
        )
        if out.returncode == 0:
            snap["nvidia_smi"] = out.stdout.strip()
    except Exception:  # noqa: BLE001
        snap["nvidia_smi"] = None
    return snap


def run_baseline(
    annotations: Sequence[Dict[str, Any]],
    data_root: Path,
    adapter: DocumentModelAdapter,
    output_dir: Path,
    mode: str = "fast",
    config: Optional[Dict[str, Any]] = None,
    seed: int = 42,
    prompt_id: str = "v0",
    skip_existing: bool = True,
    n_pages: Optional[int] = None,
) -> Path:
    """运行 Baseline 批量推理。

    返回 manifest 路径：<output_dir>/manifest.jsonl
    """
    cfg = config or {}
    if n_pages is None:
        n_pages = int(cfg.get("modes", {}).get(mode, {"fast": 12}.get(mode, 12)))
    out = Path(output_dir)
    pred_dir = out / "predictions"
    doctags_dir = out / "doctags"
    pred_dir.mkdir(parents=True, exist_ok=True)
    doctags_dir.mkdir(parents=True, exist_ok=True)

    try:
        from tqdm.auto import tqdm
    except ImportError:
        def tqdm(it: Any, **_: Any) -> Any:  # type: ignore[misc]
            return it

    pages = data.select_pages(annotations, n=n_pages, seed=seed)
    rows: List[Dict[str, Any]] = []
    skipped = 0
    t_start = time.perf_counter()
    for page in tqdm(pages, desc=f"baseline [{mode}]"):
        image_id = data.sample_id(page)
        pred_path = pred_dir / f"{image_id}.json"
        if skip_existing and pred_path.is_file():
            try:
                rows.append(data.read_json(pred_path))
            except Exception:  # noqa: BLE001
                pred_path.unlink(missing_ok=True)
            else:
                skipped += 1
                continue
        image = data.load_page_image(data_root, page)
        prediction = adapter.predict(image, prompt=get_prompt(prompt_id))
        prediction["image_id"] = image_id
        prediction["prompt_id"] = prompt_id
        prediction["document_type"] = data.page_attribute(page).get(
            "data_source", "unknown"
        )
        prediction["language"] = data.page_attribute(page).get("language", "unknown")
        prediction["layout"] = data.page_attribute(page).get("layout", "unknown")
        prediction["subset"] = data.subset_of(page)
        adapter.save_prediction(prediction, pred_path)
        (doctags_dir / f"{image_id}.dt").write_text(
            prediction["doctags"], encoding="utf-8"
        )
        rows.append(prediction)

    manifest_path = out / "manifest.jsonl"
    with open(manifest_path, "w", encoding="utf-8") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    latencies = [float(r["latency_sec"]) for r in rows if "latency_sec" in r]
    summary = {
        "mode": mode,
        "requested_pages": n_pages,
        "completed": len(rows),
        "skipped_from_cache": skipped,
        "prompt_id": prompt_id,
        "seed": seed,
        "total_latency_sec": round(sum(latencies), 2),
        "mean_latency_sec": round(sum(latencies) / len(latencies), 3) if latencies else None,
        "wall_sec": round(time.perf_counter() - t_start, 2),
        "model_id": rows[0]["model_id"] if rows else None,
        "model_revision": rows[0]["model_revision"] if rows else None,
    }
    data.write_json(summary, out / "summary.json")
    return manifest_path

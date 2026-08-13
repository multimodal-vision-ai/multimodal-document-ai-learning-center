"""生成 Kaggle 冒烟测试 Notebook（scripts/kaggle/smoke_phase2.ipynb）。

自包含设计：把 src/、configs/、prompts/ 的代码快照以 JSON 字符串内嵌进
Notebook，第一格在 /kaggle/working 落盘后导入——不依赖 `kaggle kernels push`
的附带文件 staging（该机制在本次实测中不可用，见 notebooks/README.md 注意事项）。

容错设计：每一步用 step() 包裹，失败不中断；最终单元格始终写出
results/run_report.txt 与 results/experiment_metadata.json。
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "scripts" / "kaggle" / "smoke_phase2.ipynb"

EMBED_REL = [
    "src/__init__.py",
    "src/config.py",
    "src/data.py",
    "src/model.py",
    "src/prompts.py",
    "src/inference.py",
    "src/evaluation.py",
    "src/visualization.py",
    "configs/default.yaml",
    "prompts/v0.txt",
    "prompts/v1.txt",
    "prompts/v2.txt",
    "prompts/v3.txt",
]


def md(source: str) -> Dict:
    return {"cell_type": "markdown", "metadata": {}, "source": [source]}


def code(source: str) -> Dict:
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [source],
    }


def embed_files() -> str:
    files = {rel: (ROOT / rel).read_text(encoding="utf-8") for rel in EMBED_REL}
    return json.dumps(files, ensure_ascii=False)


CELLS: List[Dict] = [
    md(
        "# Phase 2 Smoke — Kaggle GPU 闭环测试（自包含容错版 v3）\n"
        "\n"
        "第一格把仓库代码快照落盘到 /kaggle/working，随后完成：环境快照 → 依赖安装 → "
        "OmniDocBench 下载/统计 → SmolDocling 加载 → 首次推理 → fast 基线（12 页）→ "
        "md2md 导出 + smoke 自检。任何失败都写入 results/run_report.txt。\n"
    ),
    code(
        "# 自包含引导：把内嵌的仓库代码快照写入 /kaggle/working\n"
        "import json, os, sys\n"
        "from pathlib import Path\n"
        "\n"
        "FILES = " + embed_files() + "\n"
        "\n"
        "for rel, content in FILES.items():\n"
        "    p = Path('/kaggle/working') / rel\n"
        "    p.parent.mkdir(parents=True, exist_ok=True)\n"
        "    p.write_text(content, encoding='utf-8')\n"
        "print('staged files:', sorted(FILES))\n"
        "print('working dir:', sorted(os.listdir('/kaggle/working')))\n"
        "\n"
        "sys.path.insert(0, '/kaggle/working')\n"
    ),
    code(
        "import json, sys, time, traceback\n"
        "from pathlib import Path\n"
        "\n"
        "from src.config import load_config\n"
        "from src.inference import environment_snapshot\n"
        "\n"
        "cfg = load_config()\n"
        "T0 = time.time()\n"
        "TIMERS = {}\n"
        "ERRORS = {}\n"
        "\n"
        "def step(name, fn):\n"
        "    t = time.time()\n"
        "    try:\n"
        "        out = fn()\n"
        "        TIMERS[name + '_sec'] = round(time.time() - t, 1)\n"
        "        print('[OK] %s (%.1fs)' % (name, TIMERS[name + '_sec']))\n"
        "        return out\n"
        "    except Exception:\n"
        "        ERRORS[name] = traceback.format_exc()\n"
        "        print('[FAIL] %s' % name)\n"
        "        traceback.print_exc()\n"
        "        return None\n"
        "\n"
        "Path('/kaggle/working/results').mkdir(parents=True, exist_ok=True)\n"
        "Path('/kaggle/working/results/heartbeat.txt').write_text('started', encoding='utf-8')\n"
        "\n"
        "try:\n"
        "    ENV = environment_snapshot()\n"
        "    print(json.dumps(ENV, ensure_ascii=False, indent=2))\n"
        "except Exception:\n"
        "    ENV = None\n"
        "    ERRORS['env'] = traceback.format_exc()\n"
        "    traceback.print_exc()\n"
    ),
    code(
        "# 依赖安装（torch/transformers 用镜像版本；transformers 过旧则升级；缺的补装）\n"
        "import subprocess, sys, importlib.metadata\n"
        "\n"
        "def _install():\n"
        "    try:\n"
        "        tf = importlib.metadata.version('transformers')\n"
        "        parts = tf.split('.')[:2]\n"
        "        if tuple(int(x) for x in parts) < (4, 45):\n"
        "            subprocess.run([sys.executable, '-m', 'pip', 'install', '-U', 'transformers', '--quiet'], check=True)\n"
        "    except Exception:\n"
        "        subprocess.run([sys.executable, '-m', 'pip', 'install', '-U', 'transformers', '--quiet'], check=True)\n"
        "    subprocess.run([sys.executable, '-m', 'pip', 'install', 'docling-core', 'huggingface_hub', '--quiet'], check=True)\n"
        "    versions = {}\n"
        "    for name in ('torch', 'transformers', 'docling-core', 'huggingface_hub', 'pillow', 'numpy', 'pandas', 'matplotlib', 'tqdm', 'PyYAML'):\n"
        "        try:\n"
        "            versions[name] = importlib.metadata.version(name)\n"
        "        except Exception:\n"
        "            versions[name] = None\n"
        "    print(json.dumps(versions, ensure_ascii=False, indent=2))\n"
        "    return versions\n"
        "\n"
        "VERSIONS = step('install', _install)\n"
    ),
    code(
        "# 数据集下载与统计\n"
        "from src import data\n"
        "\n"
        "def _dataset():\n"
        "    root = data.download_dataset()\n"
        "    ann = data.load_annotations(root)\n"
        "    stats = data.build_stats(ann)\n"
        "    assert stats['pages']['total'] == 1651, stats['pages']\n"
        "    size_mb = sum(f.stat().st_size for f in (Path(root) / 'images').glob('*') if f.is_file()) / 1048576\n"
        "    print('pages:', stats['pages'], '| subset:', stats['subset'])\n"
        "    print('images_mb:', round(size_mb, 1))\n"
        "    return {'root': str(root), 'stats': stats, 'images_mb': round(size_mb, 1)}\n"
        "\n"
        "DATASET = step('dataset_download', _dataset)\n"
    ),
    code(
        "# 模型加载（首次含权重下载；类名/注意力实现自动回退并记录）\n"
        "from src.model import SmolDoclingAdapter, model_summary\n"
        "\n"
        "def _model():\n"
        "    adapter = SmolDoclingAdapter().load()\n"
        "    return adapter\n"
        "\n"
        "ADAPTER = step('model_load', _model)\n"
        "if ADAPTER is not None:\n"
        "    print(json.dumps(model_summary(ADAPTER), ensure_ascii=False, indent=2))\n"
    ),
    code(
        "# Notebook 00 等价物：合成页面首次推理 + DocTags -> DoclingDocument\n"
        "from PIL import Image, ImageDraw, ImageFont\n"
        "from src.model import doctags_to_docling\n"
        "\n"
        "def _first_run():\n"
        "    img = Image.new('RGB', (900, 700), 'white')\n"
        "    d = ImageDraw.Draw(img)\n"
        "    try:\n"
        "        ft = ImageFont.truetype('DejaVuSans-Bold.ttf', 42)\n"
        "        fb = ImageFont.truetype('DejaVuSans.ttf', 24)\n"
        "    except OSError:\n"
        "        ft = fb = ImageFont.load_default()\n"
        "    d.text((60, 50), 'SmolDocling Test Document', fill='black', font=ft)\n"
        "    d.text((60, 130), 'This page is a synthetic sample for the Phase 2 smoke test.', fill='black', font=fb)\n"
        "    rows = [('Item', 'Quantity', 'Price'), ('Pen', '2', '1.50'), ('Paper', '1', '4.00')]\n"
        "    for r, row in enumerate(rows):\n"
        "        for c, cell in enumerate(row):\n"
        "            x, y = 60 + c * 240, 220 + r * 48\n"
        "            d.rectangle([x, y, x + 230, y + 40], outline='black', width=2)\n"
        "            d.text((x + 8, y + 8), cell, fill='black', font=fb)\n"
        "    pred = ADAPTER.predict(img)\n"
        "    doc, api_path = doctags_to_docling(pred['doctags'], img)\n"
        "    md_text = doc.export_to_markdown()\n"
        "    print('first-run latency_sec:', pred['latency_sec'])\n"
        "    print('docling api path:', api_path)\n"
        "    print(md_text[:500])\n"
        "    return {'latency_sec': pred['latency_sec'], 'api_path': api_path, 'markdown_len': len(md_text)}\n"
        "\n"
        "FIRST_RUN = step('first_run', _first_run) if ADAPTER is not None else None\n"
    ),
    code(
        "# Notebook 04 等价物：fast 模式基线（12 页，分层抽样）\n"
        "from src.inference import run_baseline\n"
        "\n"
        "def _baseline():\n"
        "    ann = data.load_annotations(DATASET['root'])\n"
        "    manifest = run_baseline(\n"
        "        ann, Path(DATASET['root']), ADAPTER,\n"
        "        output_dir=Path('/kaggle/working/results/baseline'),\n"
        "        mode='fast', config=cfg, prompt_id='v0', skip_existing=True,\n"
        "    )\n"
        "    summary = data.read_json(manifest.parent / 'summary.json')\n"
        "    print(json.dumps(summary, ensure_ascii=False, indent=2))\n"
        "    return summary\n"
        "\n"
        "BASELINE = step('baseline_fast', _baseline) if (DATASET is not None and ADAPTER is not None) else None\n"
    ),
    code(
        "# Notebook 07 等价物：md2md 导出 + 非官方 smoke 自检（官方 CLI 模板留空，自动跳过）\n"
        "from src import evaluation\n"
        "\n"
        "def _benchmark():\n"
        "    base = Path('/kaggle/working/results/baseline')\n"
        "    bench = Path('/kaggle/working/results/benchmark')\n"
        "    files = evaluation.export_markdown_predictions(base / 'predictions', Path(DATASET['root']), bench / 'md2md')\n"
        "    ann = data.load_annotations(DATASET['root'])\n"
        "    rows = evaluation.sanity_check(base / 'predictions', ann, Path(DATASET['root']))\n"
        "    summary = evaluation.build_summary_table(rows)\n"
        "    data.write_json(summary, bench / 'sanity_summary.json')\n"
        "    print(json.dumps(summary, ensure_ascii=False, indent=2))\n"
        "    return {'md_files': len(files), 'rows': len(rows), 'summary': summary}\n"
        "\n"
        "BENCHMARK = step('benchmark_smoke', _benchmark) if DATASET is not None else None\n"
    ),
    code(
        "# 汇总：无论前面是否失败，始终写出报告与元数据\n"
        "import shutil as _shutil\n"
        "from src import data\n"
        "\n"
        "G = globals()\n"
        "meta = {\n"
        "    'experiment_id': 'phase2-smoke',\n"
        "    'timestamp_utc': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),\n"
        "    'total_wall_sec': round(time.time() - T0, 1),\n"
        "    'config': {\n"
        "        'model_id': cfg['model']['id'],\n"
        "        'model_revision': cfg['model']['revision'],\n"
        "        'dataset_id': cfg['dataset']['id'],\n"
        "        'dataset_revision': cfg['dataset']['revision'],\n"
        "        'omnidocbench_commit': cfg['omnidocbench_eval']['commit'],\n"
        "    },\n"
        "    'environment': G.get('ENV'),\n"
        "    'versions': G.get('VERSIONS'),\n"
        "    'dataset_stats': (G.get('DATASET') or {}).get('stats') if G.get('DATASET') else None,\n"
        "    'dataset_images_mb': G.get('DATASET', {}).get('images_mb') if G.get('DATASET') else None,\n"
        "    'first_run': G.get('FIRST_RUN'),\n"
        "    'baseline_fast': G.get('BASELINE'),\n"
        "    'benchmark': G.get('BENCHMARK'),\n"
        "    'errors': ERRORS,\n"
        "    'timers': TIMERS,\n"
        "}\n"
        "data.write_json(meta, Path('/kaggle/working/results/experiment_metadata.json'))\n"
        "\n"
        "lines = ['PHASE2 SMOKE REPORT']\n"
        "lines.append('timestamp_utc=%s' % meta['timestamp_utc'])\n"
        "lines.append('total_wall_sec=%s' % meta['total_wall_sec'])\n"
        "lines.append('timers=' + json.dumps(TIMERS, ensure_ascii=False))\n"
        "for name, err in ERRORS.items():\n"
        "    lines.append('ERROR[%s]:\\n%s' % (name, err))\n"
        "Path('/kaggle/working/results/run_report.txt').write_text('\\n'.join(lines), encoding='utf-8')\n"
        "print('REPORT SAVED')\n"
        "\n"
        "# 删除大体积数据目录，让 Kaggle 输出包只剩小文件（否则下载需 2GB+ 且易断连）\n"
        "for _big in ('/kaggle/working/data',):\n"
        "    _shutil.rmtree(_big, ignore_errors=True)\n"
        "print('--- report content ---')\n"
        "print('\\n'.join(lines))\n"
        "if ERRORS:\n"
        "    print('FAILED STEPS:', list(ERRORS))\n"
        "else:\n"
        "    print('ALL STEPS OK')\n"
    ),
]


def main() -> None:
    notebook = {
        "cells": CELLS,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3",
            },
            "language_info": {"name": "python"},
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(notebook, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print("wrote", OUT)


if __name__ == "__main__":
    main()

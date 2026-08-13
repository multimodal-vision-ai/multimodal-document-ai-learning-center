"""生成 Kaggle 官方评测冒烟 Notebook（scripts/kaggle/official_eval_smoke.ipynb）。

目标：在 Kaggle 上用锁定 commit 193627ae… 的官方入口
（python pdf_validation.py --config <yaml>）跑出第一次官方 end2end 分数。
- 3 页固定子集（seed 42）基线推理（CPU，max_new_tokens=4096）；
- GT 子集 JSON + 官方配置（CDM 默认关闭，记录 metric 集合）；
- 任何失败都写入 run_report.txt，便于诊断。
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "scripts" / "kaggle" / "official_eval_smoke.ipynb"

EMBED_REL = [
    "src/__init__.py",
    "src/config.py",
    "src/data.py",
    "src/model.py",
    "src/prompts.py",
    "src/inference.py",
    "src/evaluation.py",
    "src/visualization.py",
    "src/ablation.py",
    "src/error_analysis.py",
    "configs/default.yaml",
    "prompts/v0.txt",
    "prompts/v1.txt",
    "prompts/v2.txt",
    "prompts/v3.txt",
]

COMMIT = "193627ae9e97d89188468ed1ee3b7a856ff76044"
EXPECTED_IDS = [
    "scihub_s12237-014-9873-7.pdf_4",
    "PPT_PresentationSpecification_page_025",
    "book_en_搬书匠-3473-Reactive Programming with RxJS-2015-英文版_page_021",
]
EXPECTED_FILES = [
    "scihub_s12237-014-9873-7.pdf_4.jpg",
    "PPT_PresentationSpecification_page_025.png",
    "book_en_搬书匠-3473-Reactive Programming with RxJS-2015-英文版_page_021.png",
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
        "# 官方 OmniDocBench end2end 评测冒烟（锁定 commit）\n"
        "\n"
        "3 页固定子集（seed 42）→ 基线推理（CPU）→ 官方 `pdf_validation.py --config` 出分。\n"
    ),
    code(
        "# 自包含引导：把仓库代码快照写入 /kaggle/working\n"
        "import json, os, sys\n"
        "from pathlib import Path\n"
        "\n"
        "FILES = " + embed_files() + "\n"
        "\n"
        "for rel, content in FILES.items():\n"
        "    p = Path('/kaggle/working') / rel\n"
        "    p.parent.mkdir(parents=True, exist_ok=True)\n"
        "    p.write_text(content, encoding='utf-8')\n"
        "sys.path.insert(0, '/kaggle/working')\n"
        "print('staged:', sorted(FILES))\n"
    ),
    code(
        "import time, traceback\n"
        "\n"
        "COMMIT = '193627ae9e97d89188468ed1ee3b7a856ff76044'\n"
        "EXPECTED_FILES = " + json.dumps(EXPECTED_FILES) + "\n"
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
    ),
    code(
        "# 依赖 + 官方评测仓库（锁定 commit 的 tarball）\n"
        "import subprocess, sys, io, tarfile, urllib.request\n"
        "\n"
        "def _setup():\n"
        "    deps = ['docling-core', 'huggingface_hub', 'apted', 'beautifulsoup4', 'evaluate',\n"
        "            'func-timeout', 'Levenshtein', 'loguru', 'lxml', 'nltk', 'pylatexenc',\n"
        "            'scipy', 'tabulate', 'pyyaml']\n"
        "    subprocess.run([sys.executable, '-m', 'pip', 'install'] + deps + ['--quiet'], check=True)\n"
        "    url = 'https://codeload.github.com/opendatalab/OmniDocBench/tar.gz/' + COMMIT\n"
        "    req = urllib.request.Request(url, headers={'User-Agent': 'codex-audit'})\n"
        "    raw = urllib.request.urlopen(req, timeout=300).read()\n"
        "    base = Path('/kaggle/working/odbrepo')\n"
        "    base.mkdir(parents=True, exist_ok=True)\n"
        "    with tarfile.open(fileobj=io.BytesIO(raw), mode='r:gz') as tf:\n"
        "        tf.extractall(base)\n"
        "    repo = next(base.glob('OmniDocBench-*'))\n"
        "    assert (repo / 'pdf_validation.py').is_file(), repo\n"
        "    # 官方 requires-python 为 >=3.10,<3.12 且锁定旧版依赖（lxml==4.9.1 等无\n"
        "    # Python 3.12 轮子）。Kaggle 为 3.12，故不执行 pip install -e .，\n"
        "    # 改为上面已安装的不锁版本依赖，并直接从仓库根目录运行 pdf_validation.py\n"
        "    # （cwd 即 src/ 的包路径）。pip 明细写入日志备查。\n"
        "    r = subprocess.run([sys.executable, '-m', 'pip', 'check'], capture_output=True, text=True, timeout=600)\n"
        "    pip_log = Path('/kaggle/working/results/benchmark/pip_install.log')\n"
        "    pip_log.parent.mkdir(parents=True, exist_ok=True)\n"
        "    pip_log.write_text('pip check rc=' + str(r.returncode) + '\\n' + (r.stdout or '')[-2000:] + '\\n--- STDERR ---\\n' + (r.stderr or '')[-2000:], encoding='utf-8')\n"
        "    return {'repo': str(repo)}\n"
        "\n"
        "SETUP = step('setup_repo', _setup)\n"
        "REPO = Path(SETUP['repo']) if SETUP else None\n"
    ),
    code(
        "# 数据集：标注 JSON + 3 张页面图\n"
        "from src import data\n"
        "\n"
        "def _dataset():\n"
        "    root = data.download_dataset(\n"
        "        allow_patterns=['OmniDocBench.json', 'images/' + EXPECTED_FILES[0],\n"
        "                        'images/' + EXPECTED_FILES[1], 'images/' + EXPECTED_FILES[2]],\n"
        "    )\n"
        "    ann = data.load_annotations(root)\n"
        "    sel = data.select_pages(ann, n=3, seed=42)\n"
        "    ids = [data.sample_id(p) for p in sel]\n"
        "    print('selected:', ids)\n"
        "    return {'root': str(root), 'ids': ids}\n"
        "\n"
        "DATASET = step('dataset', _dataset)\n"
    ),
    code(
        "# 基线推理（3 页，CPU，max_new_tokens=4096）\n"
        "from src.model import SmolDoclingAdapter, model_summary\n"
        "from src.inference import run_baseline\n"
        "from src.config import load_config\n"
        "\n"
        "cfg = load_config()\n"
        "\n"
        "def _baseline():\n"
        "    adapter = SmolDoclingAdapter().load()\n"
        "    print(model_summary(adapter))\n"
        "    ann = data.load_annotations(DATASET['root'])\n"
        "    sel = data.select_pages(ann, n=3, seed=42)\n"
        "    manifest = run_baseline(\n"
        "        sel, Path(DATASET['root']), adapter,\n"
        "        output_dir=Path('/kaggle/working/results/baseline'),\n"
        "        mode='fast', config=cfg, prompt_id='v0',\n"
        "        n_pages=3, predict_kwargs={'max_new_tokens': 4096},\n"
        "    )\n"
        "    return data.read_json(manifest.parent / 'summary.json')\n"
        "\n"
        "BASELINE = step('baseline_3pages', _baseline) if DATASET else None\n"
        "print(BASELINE)\n"
    ),
    code(
        "# 官方评测：GT 子集 + 官方配置 + pdf_validation.py\n"
        "from src import data, evaluation\n"
        "\n"
        "def _official():\n"
        "    ann = data.load_annotations(DATASET['root'])\n"
        "    base = Path('/kaggle/working/results/baseline')\n"
        "    bench = Path('/kaggle/working/results/benchmark')\n"
        "    md_dir = bench / 'pred_md'\n"
        "    evaluation.export_markdown_predictions(base / 'predictions', Path(DATASET['root']), md_dir)\n"
        "    gt_json = evaluation.gt_subset_for_predictions(md_dir, ann, bench / 'gt_subset.json')\n"
        "    yaml_path = evaluation.write_end2end_config(REPO, gt_json, md_dir, bench, include_cdm=False)\n"
        "    template = cfg['omnidocbench_eval']['end2end_cmd_template']\n"
        "    cmd = template.replace('{repo}', str(REPO)).replace('{config}', str(yaml_path))\n"
        "    print('CMD:', cmd)\n"
        "    log = bench / 'official_end2end.log'\n"
        "    with open(log, 'w', encoding='utf-8') as f:\n"
        "        r = subprocess.run(cmd, shell=True, cwd=str(REPO), stdout=f, stderr=subprocess.STDOUT, timeout=3600)\n"
        "    print('rc =', r.returncode)\n"
        "    if r.returncode != 0:\n"
        "        raise RuntimeError('official eval failed, see ' + str(log))\n"
        "    result_src = REPO / 'result'\n"
        "    result_dst = Path('/kaggle/working/official_result')\n"
        "    if result_src.is_dir():\n"
        "        import shutil as _sh\n"
        "        if result_dst.exists():\n"
        "            _sh.rmtree(result_dst)\n"
        "        _sh.copytree(result_src, result_dst)\n"
        "    files = sorted(str(p.relative_to(result_dst)) for p in result_dst.rglob('*') if p.is_file())\n"
        "    print('official result files:', files)\n"
        "    return {'rc': r.returncode, 'result_files': files}\n"
        "\n"
        "OFFICIAL = step('official_eval', _official) if (DATASET and REPO and BASELINE) else None\n"
    ),
    code(
        "# 汇总报告（任何失败也写出）\n"
        "from src import data\n"
        "import shutil as _sh\n"
        "\n"
        "G = globals()\n"
        "meta = {\n"
        "    'experiment_id': 'official-eval-smoke',\n"
        "    'timestamp_utc': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),\n"
        "    'omnidocbench_commit': COMMIT,\n"
        "    'dataset_revision': cfg['dataset']['revision'],\n"
        "    'model_revision': cfg['model']['revision'],\n"
        "    'pages': G.get('DATASET', {}).get('ids') if G.get('DATASET') else None,\n"
        "    'baseline': G.get('BASELINE'),\n"
        "    'official': G.get('OFFICIAL'),\n"
        "    'errors': ERRORS,\n"
        "    'timers': TIMERS,\n"
        "}\n"
        "data.write_json(meta, Path('/kaggle/working/results/official_eval_metadata.json'))\n"
        "lines = ['OFFICIAL EVAL SMOKE REPORT']\n"
        "lines.append('timers=' + json.dumps(TIMERS, ensure_ascii=False))\n"
        "lines.append('baseline=' + json.dumps(G.get('BASELINE'), ensure_ascii=False))\n"
        "lines.append('official=' + json.dumps(G.get('OFFICIAL'), ensure_ascii=False))\n"
        "for name, err in ERRORS.items():\n"
        "    lines.append('ERROR[%s]:\\n%s' % (name, err))\n"
        "Path('/kaggle/working/results/run_report.txt').write_text('\\n'.join(lines), encoding='utf-8')\n"
        "for _big in ('/kaggle/working/data',):\n"
        "    _sh.rmtree(_big, ignore_errors=True)\n"
        "print('\\n'.join(lines))\n"
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

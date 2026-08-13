"""生成 Kaggle 官方评测审核 Notebook（scripts/kaggle/audit_odbeval.ipynb）。

用途：在 Kaggle（有网络）抓取 OmniDocBench 锁定 commit
193627ae9e97d89188468ed1ee3b7a856ff76044 的 README、evaluation/ 与 configs/
目录与文件内容，输出到 /kaggle/working/audit_eval/，用于如实填写
configs/default.yaml 的官方评测命令模板（不凭记忆编造 CLI）。
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "scripts" / "kaggle" / "audit_odbeval.ipynb"


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


CELLS: List[Dict] = [
    md(
        "# OmniDocBench 官方评测审核（锁定 commit）\n"
        "\n"
        "抓取 commit `193627ae…` 的 README、evaluation/、configs/，"
        "用于填写 configs/default.yaml 的官方评测命令模板。\n"
    ),
    code(
        "import json, urllib.request\n"
        "from pathlib import Path\n"
        "\n"
        "COMMIT = '193627ae9e97d89188468ed1ee3b7a856ff76044'\n"
        "API = 'https://api.github.com/repos/opendatalab/OmniDocBench'\n"
        "RAW = 'https://raw.githubusercontent.com/opendatalab/OmniDocBench/' + COMMIT + '/'\n"
        "out = Path('/kaggle/working/audit_eval')\n"
        "out.mkdir(parents=True, exist_ok=True)\n"
        "\n"
        "def gh_json(url):\n"
        "    req = urllib.request.Request(url, headers={'User-Agent': 'codex-audit'})\n"
        "    with urllib.request.urlopen(req, timeout=60) as r:\n"
        "        return json.loads(r.read().decode('utf-8'))\n"
        "\n"
        "def fetch_raw(rel, name=None):\n"
        "    req = urllib.request.Request(RAW + rel, headers={'User-Agent': 'codex-audit'})\n"
        "    with urllib.request.urlopen(req, timeout=60) as r:\n"
        "        content = r.read().decode('utf-8')\n"
        "    target = out / (name or rel)\n"
        "    target.parent.mkdir(parents=True, exist_ok=True)\n"
        "    target.write_text(content, encoding='utf-8')\n"
        "    return content\n"
        "\n"
        "print('helpers ready')\n"
    ),
    code(
        "# 目录列表\n"
        "for d in ('evaluation', 'configs', ''):\n"
        "    url = API + '/contents/' + d + '?ref=' + COMMIT\n"
        "    try:\n"
        "        listing = gh_json(url)\n"
        "        names = [(x.get('name'), x.get('type')) for x in listing]\n"
        "        (out / ('dir_' + (d or 'root') + '.json')).write_text(\n"
        "            json.dumps(names, ensure_ascii=False, indent=2), encoding='utf-8')\n"
        "        print(d or 'root', '->', names)\n"
        "    except Exception as e:\n"
        "        print(d, 'ERROR', e)\n"
    ),
    code(
        "# 抓取 README 与 evaluation/configs 下全部小文件\n"
        "import json as _json\n"
        "\n"
        "files_to_fetch = ['README.md']\n"
        "for d in ('evaluation', 'configs'):\n"
        "    p = out / ('dir_' + d + '.json')\n"
        "    if p.is_file():\n"
        "        for name, typ in _json.loads(p.read_text(encoding='utf-8')):\n"
        "            if typ == 'file' and name.endswith(('.py', '.yaml', '.yml', '.md', '.json', '.txt', '.sh')):\n"
        "                files_to_fetch.append(d + '/' + name)\n"
        "\n"
        "ok, failed = [], []\n"
        "for rel in files_to_fetch:\n"
        "    try:\n"
        "        fetch_raw(rel)\n"
        "        ok.append(rel)\n"
        "    except Exception as e:\n"
        "        failed.append((rel, str(e)))\n"
        "print('fetched:', len(ok), '| failed:', failed)\n"
    ),
    code(
        "# 打印 README 中与运行评测相关的行（不凭记忆推断 CLI）\n"
        "readme = (out / 'README.md').read_text(encoding='utf-8')\n"
        "lines = readme.splitlines()\n"
        "keep = []\n"
        "for i, line in enumerate(lines):\n"
        "    low = line.lower()\n"
        "    if any(k in low for k in ('python ', 'pip install', 'bash ', 'eval', 'config', 'md2md', 'end2end', 'usage')):\n"
        "        keep.append(f'{i+1}: {line}')\n"
        "(out / 'readme_eval_lines.txt').write_text('\\n'.join(keep), encoding='utf-8')\n"
        "print('\\n'.join(keep[:120]))\n"
    ),
    code(
        "# 打印各 eval 脚本的前 60 行（argparse 与入口）\n"
        "from pathlib import Path\n"
        "for p in sorted((out / 'evaluation').glob('*.py')):\n"
        "    print('=' * 30, p.name, '=' * 30)\n"
        "    lines = p.read_text(encoding='utf-8').splitlines()\n"
        "    print('\\n'.join(lines[:60]))\n"
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

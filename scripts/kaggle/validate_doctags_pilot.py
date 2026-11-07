#!/usr/bin/env python3
"""Static QA for MVAI Kaggle DocTags pilot. Does not require Kaggle or a GPU."""
from __future__ import annotations
import ast
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
NOTEBOOK = ROOT / "docs/assets/notebooks/mvai_doctags_kaggle_pilot.ipynb"
GUIDE = ROOT / "docs/projects/doctags-kaggle/README.md"
HOME = ROOT / "docs/projects/README.md"

notebook = json.loads(NOTEBOOK.read_text(encoding="utf-8"))
assert notebook["nbformat"] == 4, "Notebook format must be v4"
code = []
for index, cell in enumerate(notebook["cells"]):
    assert cell["cell_type"] in ("markdown", "code"), (index, "unexpected cell type")
    if cell["cell_type"] == "code":
        source = "".join(cell["source"])
        ast.parse(source, filename=f"{NOTEBOOK.name}:cell_{index}")
        code.append(source)

joined = "\n".join(code)
assert "ibm-granite/granite-docling-258M" in joined, "Baseline model identity missing"
assert "model.generate(" in joined, "No real inference invocation"
assert "result.dt" in joined, "DocTags result export missing"
assert "run_metadata.json" in joined, "Run metadata output missing"
assert "synthetic_document()" in joined, "Synthetic privacy-safe input missing"
assert "torch.cuda.is_available()" in joined, "Missing explicit GPU check"
assert "model_role" in joined and "public_baseline_not_lab_checkpoint" in joined
guide = GUIDE.read_text(encoding="utf-8")
home = HOME.read_text(encoding="utf-8")
assert "mvai_doctags_kaggle_pilot.ipynb" in guide
assert "doctags-kaggle/README.md" in home
assert "interactive-demo/index.html" in home
assert "shanshui_scene: 7" in home
assert "视频行为识别模型" in home, "Video card accidentally removed"
print(f"Kaggle pilot static QA passed: {len(code)} syntax-checked code cells")

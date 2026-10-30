#!/usr/bin/env python3
"""Static contract and JavaScript syntax QA for MVAI WebGPU inference pilot."""
import json
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HTML = ROOT / "docs/assets/projects/doctags/browser-inference/index.html"
SPACE = ROOT / "hf-spaces/mvai-doctags-webgpu/index.html"
SPACE_README = ROOT / "hf-spaces/mvai-doctags-webgpu/README.md"
HOME = ROOT / "docs/projects/README.md"
GUIDE = ROOT / "docs/projects/doctags-browser/README.md"

data = HTML.read_text(encoding="utf-8")
assert data == SPACE.read_text(encoding="utf-8"), "HF Space and Learning Center must use the same inference code"
assert "sdk: static" in SPACE_README.read_text(encoding="utf-8")
assert 'id="load"' in data and 'id="run"' in data
assert "onnx-community/granite-docling-258M-ONNX" in data
assert "AutoModelForVision2Seq.from_pretrained" in data
assert "await model.generate" in data
assert "RawImage.fromCanvas" in data
assert 'id="file"' in data and 'id="sample"' in data
assert "Kaggle" in data and "公开基线" in data
assert "doctags-browser/README.md" in HOME.read_text(encoding="utf-8")
assert "shanshui_scene: 7" in HOME.read_text(encoding="utf-8")
assert "视频行为识别模型" in HOME.read_text(encoding="utf-8")
assert "尚未在真实 WebGPU 设备" in GUIDE.read_text(encoding="utf-8")
matches = re.findall(r'<script type="module">([\s\S]*?)</script>', data)
assert len(matches) == 1, "Exactly one JS module script expected"
js = matches[0]
with tempfile.TemporaryDirectory() as tmp:
    file = Path(tmp) / "browser-inference.mjs"
    file.write_text(js, encoding="utf-8")
    subprocess.run(["node", "--check", str(file)], check=True)
print("Browser inference Static Space: content contract + Node JS syntax PASS")

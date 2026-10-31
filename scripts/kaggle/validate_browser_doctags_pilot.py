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
PARSER = ROOT / "docs/assets/projects/doctags/browser-inference/doctags-renderer.js"
HF_PARSER = ROOT / "hf-spaces/mvai-doctags-webgpu/doctags-renderer.js"
assert PARSER.read_bytes() == HF_PARSER.read_bytes(), "DocTags parsers diverged"
REGISTRY = ROOT / "docs/assets/projects/doctags/browser-inference/model-registry.js"
HF_REGISTRY = ROOT / "hf-spaces/mvai-doctags-webgpu/model-registry.js"
assert REGISTRY.read_bytes() == HF_REGISTRY.read_bytes(), "Model registries diverged"
assert 'src="./model-registry.js"' in data, "Model registry must be loaded"
for control in ('modelSelect','newModelRepo','addModel','cacheCheck','cachePersist','compareA','compareB','compareBodyA','compareBodyB'):
    assert 'id="'+control+'"' in data, f"Missing V1.7 control {control}"
assert "env.useBrowserCache = true" in data, "Browser cache not enabled"
assert "await model.dispose?.()" in data, "Old WebGPU model not released on switch"
assert "activeKey!==selectedKey()" in data, "Running unselected GPU model must be prevented"
assert "recordResult(runHistory,record)" in data, "Same-input history must be recorded"
assert "inputRevision++;resetHistory()" in data, "Image change must invalidate old run history"
assert "renderComparison(result)" in data, "V1.6 live reconstruction must remain"

# V1.7.1: balanced top workspace, collapsed advanced features, accessible help.
assert '<div class="cols workspace">' in data, "Workspace layout not present"
assert ".cols.workspace{grid-template-columns:repeat(2,minmax(0,1fr));align-items:stretch" in data, "Two-panel balanced layout is missing"
assert ".workspace>.card{display:flex;flex-direction:column" in data, "Workspace cards must fill matching rows"
assert 'class="card input-panel"' in data and 'class="card inference-panel"' in data
assert '<div class="panel-heading">' in data and 'class="info-tip"' in data
assert ".info-tip:focus-within>.tip-pop" in data, "Keyboard tooltip support missing"
assert ".info-tip:hover>.tip-pop" in data, "Mouse hover tooltip support missing"
assert 'id="modelHelp"' in data, "Dynamic model selection help lost"
assert 'id="cacheManager"' in data, "Cache controls must be collapsible"
assert 'id="modelManage"' in data, "Model registration must be collapsible"
assert 'id="compareDetails"' in data, "Multi-model comparisons must default to collapsed"
assert 'id="rawDetails"' in data, "Raw DocTags must default to collapsed"
for detail_id in ("modelManage", "cacheManager", "rawDetails", "compareDetails"):
    assert not re.search(r'<details[^>]*\bid="'+detail_id+r'"[^>]*\bopen\b', data), f"{detail_id} must be closed by default"
ids = re.findall(r'\bid="([^"]+)"', data)
assert len(ids) == len(set(ids)), f"Duplicated HTML IDs: {[x for x in set(ids) if ids.count(x)>1]}"
assert "首次加载模型可能下载 1 GB 以上文件" in data, "Important traffic warning not visible"
assert "模型加载失败：" in data and "推理失败：" in data, "Critical errors must remain visible"
assert 'id="compareCanvas"' in data and 'id="rendered"' in data, "Original/result rendering must remain"
assert "updateHistory({" in data and "refreshHistorySelectors()" in data, "Multi-model result history lost"
# V1.7.2: model parameter count/time on success and proportional A/B scroll.
assert 'id="runMetrics"' in data and 'id="runModelSize"' in data and 'id="runDuration"' in data
assert 'showRunMetrics(selectedModel().id,seconds)' in data
assert 'clearRunMetrics();resetComparison()' in data, "Metrics must reset between documents"
assert 'id="historySync"' in data, "A/B proportional scroll toggle missing"
assert 'historyPaneA.addEventListener("scroll"' in data and 'historyPaneB.addEventListener("scroll"' in data
assert 'registry.proportionalPosition(' in data, "Percentage mapping missing"
assert "expectedMirrorTop" in data, "Mirror recursion prevention missing"
assert 'id="sync"' in data, "V1.6 original/result scroll option must remain"
assert "模型大小（参数量）" in data, "Do not conflate parameters with disk size"

assert "浏览器 Cache Storage" in data, "Cache explanation lost"

assert 'src="./doctags-renderer.js"' in data, "Parser module not loaded"
assert 'id="compareCanvas"' in data and 'id="rendered"' in data, "Missing comparison panes"
assert 'id="rawDetails"' in data, "Raw DocTags should be collapsible"
assert "renderComparison(result)" in data, "Real model output must drive rendering"
assert "rendered.addEventListener" in data, "Source-to-result hover mapping missing"
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
subprocess.run(["node", "--check", str(PARSER)], check=True)
subprocess.run(["node", "--check", str(REGISTRY)], check=True)
subprocess.run(["node", str(ROOT / "scripts/kaggle/test_doctags_model_registry.cjs")], check=True)
subprocess.run(["node", str(ROOT / "scripts/kaggle/test_doctags_render_parser.cjs")], check=True)
print("Browser inference Static Space: content contract + parser fixture + Node JS syntax PASS")

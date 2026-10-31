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
# V1.9: Nine original official IBM demo images hosted locally and mirrored in Space.
sample_files = {
    "doc": "new_arxiv.png", "table": "image-2.jpg", "code": "code.jpg",
    "image": "lake-zurich-switzerland-view-nature-landscapes-7bbda4-1024.jpg",
    "formula": "87664.png", "chart": "06236926002285.png",
    "arabic": "ar_page_0.png", "japanese": "japanse_4_ibm.png",
    "chinese": "zh_page_0.png",
}
for kind, filename in sample_files.items():
    assert 'data-sample="'+kind+'"' in data, f"Missing IBM example: {kind}"
    paths = [HTML.parent / "samples" / filename, SPACE.parent / "samples" / filename]
    for asset in paths:
        assert asset.is_file() and asset.stat().st_size > 1000, f"Missing image: {asset}"
        signature = asset.read_bytes()[:8]
        assert (signature.startswith(b"\x89PNG\r\n\x1a\n") if filename.endswith(".png") else signature.startswith(b"\xff\xd8\xff")), f"Invalid file type: {asset}"
    assert paths[0].read_bytes() == paths[1].read_bytes(), f"Mirrored file differs: {kind}"
assert data.count('class="sample-tile"') == 9, "Nine IBM examples required"
assert 'sampleBase="./samples/"' in data, "Examples must be served from same origin"
assert "granite-docling-258m-demo/resolve/main/data/images/" not in data, "No external image fetch from UI"
assert 'await image.decode()' in data and 'c.drawImage(image,0,0,src.width,src.height)' in data, "Image must enter original model input Canvas"
assert 'id="syntheticFallback"' in data and 'makeSample("summary")' in data, "Synthetic fallback missing"
assert "sampleSelectionSerial" in data and "if(ticket!==sampleSelectionSerial)" in data, "Stale-response protection missing"
assert 'inputRevision++;resetHistory();imageReady=true;name="ibm-demo-"' in data, "Switch must invalidate old results"
assert "IBM Granite Docling 官方 DEMO" in data, "Example source credit missing"
assert "await model.generate" in data, "WebGPU model inference must remain real"
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
# V1.7.3: only the platform name is visible by default. Model information remains accurate,
# accessible via click, hover and keyboard, and future models are not claimed as deployed.
assert '<h1>实时文档结构化解析-DocTags</h1>' in data
header_match = re.search(r'<header>([\s\S]*?)</header>', data)
assert header_match, "Missing platform header"
header_html = header_match.group(1)
assert '<p>' not in header_html, "Do not show long header explanation by default"
assert 'class="info-tip hero-help"' in header_html and 'aria-label="查看平台功能及多模型扩展说明"' in header_html
assert "多模型能力对比" in header_html and "后续可以接入经过适配和验证的自研模型" in header_html
assert "当前内置 IBM Granite Docling 258M 公开基线" in header_html
assert ".hero-heading .hero-help .tip-pop" in data and ".info-tip:focus-within>.tip-pop" in data
assert "DocTags 浏览器端实时推理</h1>" not in header_html, "Old product header remains"

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

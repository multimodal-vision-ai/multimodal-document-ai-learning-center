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
R3_DOC_ADAPTER = ROOT / "docs/assets/projects/doctags/browser-inference/adapters/r3-ovisocr3/adapter.mjs"
R3_HF_ADAPTER = ROOT / "hf-spaces/mvai-doctags-webgpu/adapters/r3-ovisocr3/adapter.mjs"
R3_DOC_CONTRACT = ROOT / "docs/assets/projects/doctags/browser-inference/adapters/r3-ovisocr3/contract.mjs"
R3_HF_CONTRACT = ROOT / "hf-spaces/mvai-doctags-webgpu/adapters/r3-ovisocr3/contract.mjs"
R3_DOC_DOWNLOAD = ROOT / "docs/assets/projects/doctags/browser-inference/adapters/r3-ovisocr3/download-metrics.mjs"
R3_HF_DOWNLOAD = ROOT / "hf-spaces/mvai-doctags-webgpu/adapters/r3-ovisocr3/download-metrics.mjs"
WANG_DOC_ADAPTER = ROOT / "docs/assets/projects/doctags/browser-inference/adapters/wang-qwen35-2b/adapter.mjs"
WANG_HF_ADAPTER = ROOT / "hf-spaces/mvai-doctags-webgpu/adapters/wang-qwen35-2b/adapter.mjs"
WANG_DOC_CONTRACT = ROOT / "docs/assets/projects/doctags/browser-inference/adapters/wang-qwen35-2b/contract.mjs"
WANG_HF_CONTRACT = ROOT / "hf-spaces/mvai-doctags-webgpu/adapters/wang-qwen35-2b/contract.mjs"
WANG_DOC_RANGE = ROOT / "docs/assets/projects/doctags/browser-inference/adapters/wang-qwen35-2b/range-download.mjs"
WANG_HF_RANGE = ROOT / "hf-spaces/mvai-doctags-webgpu/adapters/wang-qwen35-2b/range-download.mjs"
WANG_ADAPTER_DIR = ROOT / "hf-spaces/mvai-doctags-webgpu/adapters/wang-qwen35-2b"
WANG_EXPORT = WANG_ADAPTER_DIR / "export_onnx.py"
WANG_SHARDER = WANG_ADAPTER_DIR / "external_data_sharding.py"
WANG_REPACK = WANG_ADAPTER_DIR / "repack_decoder_shards.py"
WANG_BUNDLE_VALIDATOR = WANG_ADAPTER_DIR / "validate_bundle.py"
WANG_SHARD_TEST = WANG_ADAPTER_DIR / "test_external_data_sharding.py"
assert R3_DOC_ADAPTER.read_bytes() == R3_HF_ADAPTER.read_bytes(), "R3 adapters diverged"
assert R3_DOC_CONTRACT.read_bytes() == R3_HF_CONTRACT.read_bytes(), "R3 contracts diverged"
assert R3_DOC_DOWNLOAD.read_bytes() == R3_HF_DOWNLOAD.read_bytes(), "R3 download helpers diverged"
assert WANG_DOC_ADAPTER.read_bytes() == WANG_HF_ADAPTER.read_bytes(), "WC-2B adapters diverged"
assert WANG_DOC_CONTRACT.read_bytes() == WANG_HF_CONTRACT.read_bytes(), "WC-2B contracts diverged"
assert WANG_DOC_RANGE.read_bytes() == WANG_HF_RANGE.read_bytes(), "WC-2B range download helpers diverged"
R3_ADAPTER_TEXT = R3_DOC_ADAPTER.read_text(encoding="utf-8")
WANG_ADAPTER_TEXT = WANG_DOC_ADAPTER.read_text(encoding="utf-8")
assert "createRangeFetch" in WANG_ADAPTER_TEXT, "WC-2B must use the Range download helper"
assert "lib.env.fetch = rangeFetch" in WANG_ADAPTER_TEXT, "WC-2B Range fetch override is missing"
assert "cleanupIfCached" in WANG_ADAPTER_TEXT, "WC-2B range cache cleanup hook is missing"
assert "RANGE_CACHE_NAME" in data and "clearRangeCache" in data, "WC-2B partial cache must be visible and clearable in the exhibit"
assert "useBrowserCache = typeof globalThis.caches" in WANG_ADAPTER_TEXT, "WC-2B browser cache must be explicitly enabled"
assert "useWasmCache = typeof globalThis.caches" in WANG_ADAPTER_TEXT, "WC-2B WASM cache must be explicitly enabled"
assert "MODEL_REVISION" in WANG_ADAPTER_TEXT, "WC-2B must pin the exact 3-shard HF model revision"
assert "use_external_data_format: true" not in WANG_ADAPTER_TEXT, "WC-2B must honor per-file external-data chunk counts from config.json"
assert "per-file counts" in WANG_ADAPTER_TEXT, "WC-2B multi-shard loading contract must be documented in adapter"
assert 'stage: "processor"' in WANG_ADAPTER_TEXT and 'stage: "model"' in WANG_ADAPTER_TEXT, "WC-2B download stages must be distinguished"
assert "useBrowserCache = typeof globalThis.caches" in R3_ADAPTER_TEXT, "R3 browser cache must be explicitly enabled"
assert "useWasmCache = typeof globalThis.caches" in R3_ADAPTER_TEXT, "ONNX runtime WASM cache must be enabled"
assert "lib.env.useBrowserCache = false" not in R3_ADAPTER_TEXT, "Mirror mode must not disable browser caching"
assert "stage: 'processor'" in R3_ADAPTER_TEXT and "stage: 'model'" in R3_ADAPTER_TEXT, "Download stages must be distinguished"
REGISTRY_TEXT = REGISTRY.read_text(encoding="utf-8")
assert "multimodal-vision-ai/R3-OvisOCR3-DocTags-0.8B-ONNX" in REGISTRY_TEXT
assert 'adapter:"r3-ovisocr3"' in REGISTRY_TEXT
assert "0.8B 参数" in REGISTRY_TEXT
assert "multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags-ONNX" in REGISTRY_TEXT
assert 'adapter:"wang-qwen35-2b"' in REGISTRY_TEXT
assert "MVAI-DocTags-DJX-0.8B-v1.0 · 自研" in REGISTRY_TEXT
assert "MVAI-DocTags-WC-2B-v1.0 · 自研" in REGISTRY_TEXT
assert "2.2B 参数" in REGISTRY_TEXT
assert 'src="./model-registry.js"' in data, "Model registry must be loaded"
for control in ('modelSelect','newModelRepo','addModel','cacheCheck','cacheClear','cachePersist','compareA','compareB','compareBodyA','compareBodyB'):
    assert 'id="'+control+'"' in data, f"Missing V1.7 control {control}"
assert "env.useBrowserCache = true" in data, "Granite browser cache not enabled"
assert "createDownloadMeter" in data and "progress_total" in data, "Aggregate model progress missing"
assert "formatRate(m.bytesPerSecond)" in data and "formatEta(m.etaSeconds)" in data, "Download speed and ETA display missing"
assert "await model.dispose?.()" in data, "Old WebGPU model not released on switch"
assert "activeKey!==selectedKey()" in data, "Running unselected GPU model must be prevented"
assert "registry.recordResult(runHistory,normalized)" in data, "Same-input history must be recorded"
assert "function maybeAutoLoadSelectedModel()" in data and "if(hasLoadedSuccessfully)maybeAutoLoadSelectedModel()" in data, "Model switching must auto-load after the first successful load"
assert "fixedOption.hidden=!fixed" in data and "fixedOption.disabled=!fixed" in data, "R3 precision option must be hidden for other models"
assert '<option value="r3-fixed" hidden disabled>固定混合精度' in data, "R3 precision label must omit the R3 prefix"
assert "R3 固定混合精度" not in data, "R3 prefix must not appear in the precision label"
assert "acceptedCurrent" in data and "runHistory.filter(item=>item.documentRevision===revision" in data, "Every completed model result must be retained for the same input"
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
assert 'async function fetchSampleBlob(filename)' in data, "Robust sample Blob loader missing"
assert '{mode:"cors",credentials:"omit",cache:"force-cache"}' in data, "Sample requests must permit CORS redirects"
assert 'fallback.hostname="raw.githubusercontent.com"' in data, "GitHub raw fallback missing"
assert 'await fetchSampleBlob(sample.file)' in data and 'createImageBitmap(blob)' in data, "Built-in samples must be fetched as Blobs"
assert 'sourceBlob=blob' in data and 'sourceBlob=file' in data, "Original image Blob must be retained for R3 inference"
assert 'adapter.recognize(sourceBlob' in data, "Self-built adapters must consume original Blob without Canvas export"
assert "Array buffer allocation failed" in data and "不超过 1.5 GB" in data, "Large ONNX allocation error must explain browser-safe sharding"
assert "MAX_EXTERNAL_DATA_SHARD_BYTES = 1_500_000_000" in WANG_SHARDER.read_text(encoding="utf-8"), "WC-2B shard size limit missing"
assert "check_model_with_ort_compatibility" in WANG_SHARDER.read_text(encoding="utf-8"), "WC-2B checker must tolerate only the known ORT SimplifiedLayerNormalization schema gap"
assert "mvai.validation_only" in WANG_SHARDER.read_text(encoding="utf-8"), "Checker compatibility must use a temporary validation domain"
assert 'onnx.checker.check_model(\n            str(checker_path)' in WANG_SHARDER.read_text(encoding="utf-8"), "Checker must validate a temporary file beside external-data shards"
assert "tempfile.mkstemp(" in WANG_SHARDER.read_text(encoding="utf-8"), "Checker copy must be created beside the model's external-data shards"
assert "model_file_modified" in WANG_SHARDER.read_text(encoding="utf-8"), "Checker fallback must explicitly preserve the saved ONNX model"
assert "shard_external_data" in WANG_EXPORT.read_text(encoding="utf-8"), "WC-2B export must re-shard decoder external data"
assert "decoder_model_merged_fp16.onnx" in WANG_EXPORT.read_text(encoding="utf-8"), "WC-2B config must declare decoder chunk count"
assert "--push" in WANG_REPACK.read_text(encoding="utf-8"), "WC-2B repack script must support a narrow HF model-repo update"
assert "decoder_count == len(report['external_data_shards']['decoder_model_merged_fp16.onnx'])" in WANG_BUNDLE_VALIDATOR.read_text(encoding="utf-8"), "Bundle validator must check external-data chunk count"
for script in (WANG_EXPORT, WANG_SHARDER, WANG_REPACK, WANG_BUNDLE_VALIDATOR, WANG_SHARD_TEST):
    compile(script.read_text(encoding="utf-8"), str(script), "exec")
assert 'src.toBlob' not in data, "R3 inference must not export a potentially tainted Canvas"
assert 'RawImage.read(image)' in R3_ADAPTER_TEXT, "R3 adapter must decode Blob/File input directly"
assert 'syntheticFallback' not in data and 'makeSample(' not in data, "Synthetic summary should be removed"
assert data.count('class="sample-source"') == 1, "Show source attribution exactly once"
assert ' · 本项目本地托管</small>' not in data, "Source caption must remain concise"
assert "样例来源：" in data, "Source caption is required"
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
assert "首次加载 DJX-0.8B 约下载 2.52 GB，WC-2B 约下载 6.2 GB" in data, "Self-built model download warning not visible"
assert "模型加载失败：" in data and "推理失败：" in data, "Critical errors must remain visible"
assert 'id="compareCanvas"' in data and 'id="rendered"' in data, "Original/result rendering must remain"
assert "updateHistory({" in data and "refreshHistorySelectors()" in data, "Multi-model result history lost"
# V1.7.2: model parameter count/time on success and proportional A/B scroll.
assert 'id="runMetrics"' in data and 'id="runModelSize"' in data and 'id="runDuration"' in data
assert 'showRunMetrics(entry.id,seconds)' in data
assert 'clearRunMetrics();resetComparison()' in data, "Metrics must reset between documents"
assert 'id="historySync"' in data, "A/B proportional scroll toggle missing"
assert 'historyPaneA.addEventListener("scroll"' in data and 'historyPaneB.addEventListener("scroll"' in data
assert 'registry.proportionalPosition(' in data, "Percentage mapping missing"
assert "expectedMirrorTop" in data, "Mirror recursion prevention missing"
assert 'id="sync"' in data, "V1.6 original/result scroll option must remain"
assert "模型大小（参数量）" in data, "Do not conflate parameters with disk size"

assert "浏览器 Cache Storage" in data, "Cache explanation lost"
assert 'id="cacheClear"' in data and 'cache.delete(request)' in data, "Selected-model cache cleanup is required after replacing large model files"
# V1.7.3: only the platform name is visible by default. Model information remains accurate,
# accessible via click, hover and keyboard, and future models are not claimed as deployed.
assert '<h1>实时文档结构化解析-DocTags</h1>' in data
header_match = re.search(r'<header>([\s\S]*?)</header>', data)
assert header_match, "Missing platform header"
header_html = header_match.group(1)
assert '<p>' not in header_html, "Do not show long header explanation by default"
assert 'class="info-tip hero-help"' in header_html and 'aria-label="查看平台功能及多模型扩展说明"' in header_html
assert "多模型能力对比" in header_html and "MVAI-DocTags-DJX-0.8B-v1.0 · 自研" in header_html and "MVAI-DocTags-WC-2B-v1.0 · 自研" in header_html
assert "当前内置 IBM Granite Docling 258M 公开基线" in header_html
assert ".hero-heading .hero-help .tip-pop" in data and ".info-tip:focus-within>.tip-pop" in data
assert "DocTags 浏览器端实时推理</h1>" not in header_html, "Old product header remains"

assert 'src="./doctags-renderer.js"' in data, "Parser module not loaded"
assert 'id="compareCanvas"' in data and 'id="rendered"' in data, "Missing comparison panes"
assert 'id="rawDetails"' in data, "Raw DocTags should be collapsible"
assert "renderComparison(result)" in data, "Real model output must drive rendering"
assert 'id="stop"' in data and "终止推理" in data, "Manual inference stop control missing"
assert "InterruptableStoppingCriteria" in data and "const graniteStopping=new InterruptableStoppingCriteria()" in data, "Granite interrupt criterion missing"
assert "stopping_criteria:graniteStopping" in data and "graniteStopping.interrupt()" in data, "Granite stop signal is not wired to generation"
assert "function refreshInferenceControls()" in data and "activeStop?.()" in data, "Stop button state/action wiring missing"
assert "const completedNormally=ended&&!stopRequested" in data and "本次推理已由用户终止" in data, "Interrupted output must be marked incomplete and excluded from A/B history"
assert "stop() { stopping.interrupt(); }" in R3_ADAPTER_TEXT and "stop() { stopping.interrupt(); }" in WANG_ADAPTER_TEXT, "Self-built adapters must expose cooperative stop"
assert "终止推理" in GUIDE.read_text(encoding="utf-8"), "User guide must document manual stop"
assert "终止推理" in SPACE_README.read_text(encoding="utf-8"), "HF Space README must document manual stop"
assert "rendered.addEventListener" in data, "Source-to-result hover mapping missing"
assert 'id="load"' in data and 'id="run"' in data
assert "onnx-community/granite-docling-258M-ONNX" in data
assert "MVAI-DocTags-DJX-0.8B-v1.0" in data
assert "MVAI-DocTags-WC-2B-v1.0" in data
assert 'import("./adapters/r3-ovisocr3/adapter.mjs")' in data
assert 'import("./adapters/wang-qwen35-2b/adapter.mjs")' in data
assert "wangAdapter=await createAdapter" in data
assert "adapter.recognize(sourceBlob" in data
assert "RawImage.read(image)" in WANG_ADAPTER_TEXT
assert 'value="r3-fixed"' in data
assert "shader-f16" in data
assert "registry.BUILTINS" in data
assert "AutoModelForVision2Seq.from_pretrained" in data
assert "await model.generate" in data
assert "RawImage.fromCanvas" in data
assert 'id="file"' in data and 'id="sample"' in data
assert "Kaggle" in data and "公开基线" in data
assert "doctags-browser/README.md" in HOME.read_text(encoding="utf-8")
assert "shanshui_scene: 7" in HOME.read_text(encoding="utf-8")
assert "视频行为识别模型" in HOME.read_text(encoding="utf-8")
assert "Chrome 157" in GUIDE.read_text(encoding="utf-8")
assert "NVIDIA A800 80GB" in GUIDE.read_text(encoding="utf-8")
assert "MVAI-DocTags-DJX-0.8B-v1.0" in GUIDE.read_text(encoding="utf-8")
assert "MVAI-DocTags-WC-2B-v1.0" in GUIDE.read_text(encoding="utf-8")
matches = re.findall(r'<script type="module">([\s\S]*?)</script>', data)
assert len(matches) == 1, "Exactly one JS module script expected"
js = matches[0]
with tempfile.TemporaryDirectory() as tmp:
    file = Path(tmp) / "browser-inference.mjs"
    file.write_text(js, encoding="utf-8")
    subprocess.run(["node", "--check", str(file)], check=True)
subprocess.run(["node", "--check", str(PARSER)], check=True)
subprocess.run(["node", "--check", str(REGISTRY)], check=True)
subprocess.run(["node", "--check", str(R3_DOC_ADAPTER)], check=True)
subprocess.run(["node", "--check", str(R3_DOC_CONTRACT)], check=True)
subprocess.run(["node", "--check", str(R3_DOC_DOWNLOAD)], check=True)
subprocess.run(["node", "--check", str(WANG_DOC_ADAPTER)], check=True)
subprocess.run(["node", "--check", str(WANG_DOC_RANGE)], check=True)
subprocess.run(["node", "--check", str(WANG_DOC_CONTRACT)], check=True)
subprocess.run(["node", str(ROOT / "scripts/kaggle/test_doctags_download_metrics.cjs")], check=True)
subprocess.run(["node", str(ROOT / "hf-spaces/mvai-doctags-webgpu/adapters/r3-ovisocr3/test_contract.mjs")], check=True)
subprocess.run(["node", str(ROOT / "scripts/kaggle/test_doctags_model_registry.cjs")], check=True)
subprocess.run(["node", str(ROOT / "scripts/kaggle/test_doctags_wang_qwen35_2b_contract.cjs")], check=True)
subprocess.run(["node", str(ROOT / "scripts/kaggle/test_doctags_inference_stop.cjs")], check=True)
subprocess.run(["node", str(ROOT / "scripts/kaggle/test_doctags_wang_qwen35_2b_range_download.mjs")], check=True)
subprocess.run(["node", str(ROOT / "scripts/kaggle/test_doctags_render_parser.cjs")], check=True)
print("Browser inference Static Space: content contract + parser fixture + Node JS syntax PASS")

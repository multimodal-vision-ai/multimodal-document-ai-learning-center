"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
const docs = path.join(root, "docs/assets/projects/doctags/browser-inference");
const hf = path.join(root, "hf-spaces/mvai-doctags-webgpu");
const html = fs.readFileSync(path.join(docs, "index.html"), "utf8");
assert.equal(html, fs.readFileSync(path.join(hf, "index.html"), "utf8"), "Learning Center and HF Space HTML must match");
assert.match(html, /async function loadSampleThumbnail\(btn,item\)/);
assert.match(html, /const blob=await fetchSampleBlob\(item\.file\)/);
assert.match(html, /img\.src=objectUrl/);
assert.match(html, /void loadSampleThumbnail\(btn,item\)/);
assert.doesNotMatch(html, /btn\.querySelector\("img"\)\.src=sampleBase\+item\.file/);
assert.match(html, /img\.hidden=true/);
assert.match(html, /const runtimeNetworkFailure=\/CDN 加载失败\//);
for (const folder of ["adapters/r3-ovisocr3", "adapters/wang-qwen35-2b"]) {
  const docAdapter = fs.readFileSync(path.join(docs, folder, "adapter.mjs"), "utf8");
  const hfAdapter = fs.readFileSync(path.join(hf, folder, "adapter.mjs"), "utf8");
  assert.equal(docAdapter, hfAdapter, folder + " mirror mismatch");
  for (const host of ["https://cdn.jsdelivr.net/npm/", "https://gcore.jsdelivr.net/npm/", "https://fastly.jsdelivr.net/npm/", "https://testingcf.jsdelivr.net/npm/"]) {
    assert.ok(docAdapter.includes(host), folder + " missing " + host);
  }
  assert.match(docAdapter, /async function importFirstAvailable\(urls, label\)/);
  assert.match(docAdapter, /await import\(url\)/);
  assert.match(docAdapter, /const \{module: ort, url: ortUrl\} = await importFirstAvailable\(ortCandidates, 'ONNX Runtime WebGPU'\)/);
  assert.match(docAdapter, /const \{module: lib\} = await importFirstAvailable\(transformersCandidates, 'Transformers\.js'\)/);
  assert.match(docAdapter, /new URL\('\.\/', ortUrl\)\.href/);
  assert.match(docAdapter, /const scopes = Object\.fromEntries\(transformersCandidates\.map/);
}
assert.match(html, /id="runAvailability"/, "Visible run readiness explanation missing");
assert.match(html, /let loadingModel=false,loadPhase="idle"/, "Model loading lifecycle state missing");
assert.match(html, /loadPhase==="initializing"\?"正在初始化 WebGPU…":"正在加载模型…"/, "Load button must show the current phase");
assert.match(html, /const runReason=busy/, "Run disabled reason must be derived from readiness state");
assert.match(html, /当前选择的模型尚未在本次页面会话中完成加载/, "Run disabled state must explain missing model session");
assert.match(html, /模型已就绪；请先选择示例文档或上传本地图片/, "Run disabled state must explain missing document");
assert.match(html, /loadWatchdog=setInterval/, "Stalled model loading must be diagnosed");
assert.match(html, /连续 "\+silent\+" 秒没有新的下载进度/, "No-progress timeout diagnosis missing");
assert.match(html, /loadPhase="ready"/, "Model must enter ready only after adapter creation succeeds");
assert.match(html, /模型已在当前 GPU 会话中就绪/, "Successful load must report current-session readiness");
assert.match(html, /历史加载记录仅表示曾经成功加载/, "Historical cache marker must not imply current-session readiness");

console.log("Runtime recovery contract: CORS-safe thumbnails, CDN failover for ORT/Transformers.js, adapter mirrors and error diagnosis PASS");

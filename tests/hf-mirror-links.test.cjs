"use strict";
const assert = require("node:assert/strict");
const { toMirrorUrl } = require("../docs/js/hf-mirror-links.js");

const positive = new Map([
  ["https://huggingface.co/Qwen/Qwen3.5-0.8B", "https://hf-mirror.com/Qwen/Qwen3.5-0.8B"],
  ["https://huggingface.co/multimodal-vision-ai/R3-OvisOCR3-DocTags-0.8B-ONNX", "https://hf-mirror.com/multimodal-vision-ai/R3-OvisOCR3-DocTags-0.8B-ONNX"],
  ["https://huggingface.co/datasets/opendatalab/OmniDocBench", "https://hf-mirror.com/datasets/opendatalab/OmniDocBench"],
  ["https://huggingface.co/datasets/owner/data/?a=1#files", "https://hf-mirror.com/datasets/owner/data/?a=1#files"]
]);
for (const [input, expected] of positive) assert.equal(toMirrorUrl(input), expected, input);

const excluded = [
  "https://huggingface.co/", "https://huggingface.co/Qwen",
  "https://huggingface.co/spaces/Ultralytics/YOLO26",
  "https://huggingface.co/docs/transformers/index",
  "https://huggingface.co/learn", "https://huggingface.co/papers",
  "https://huggingface.co/datasets", "https://huggingface.co/login",
  "https://huggingface.co/Qwen/Qwen3.5-0.8B/resolve/main/config.json",
  "https://huggingface.co/datasets/org/repo/tree/main",
  "https://hf-mirror.com/Qwen/Qwen3.5-0.8B",
  "https://example.com/Qwen/Qwen3.5-0.8B",
  "http://huggingface.co/Qwen/Qwen3.5-0.8B",
  "https://user:pass@huggingface.co/Qwen/Qwen3.5-0.8B",
  "https://huggingface.co:8443/Qwen/Qwen3.5-0.8B",
  "not-a-url"
];
for (const input of excluded) assert.equal(toMirrorUrl(input), null, input);
console.log("HF-Mirror URL contract: " + (positive.size + excluded.length) + " cases passed.");


const fs = require("node:fs");
const path = require("node:path");
const visionScript = fs.readFileSync(path.join(__dirname, "../docs/js/vision-demo-v1.js"), "utf8");
const visionPage = fs.readFileSync(path.join(__dirname, "../docs/model-demos/vision.md"), "utf8");
const visionCases = [
  ["https://huggingface.co/spaces/Ultralytics/YOLO26", "https://hf-mirror.com/Ultralytics/YOLO26"],
  ["https://huggingface.co/spaces/ustc-community/d-fine-object-detection", "https://aifasthub.com/ustc-community"],
  ["https://huggingface.co/spaces/yonigozlan/Segment-Anything-2-video-tracking", "https://www.modelscope.cn/models/AI-ModelScope/sam2-hiera-small-hf"]
];
for (const [original, mirror] of visionCases) {
  assert.ok(visionScript.includes('url: "' + original + '"'), original + " must remain unchanged");
  assert.ok(visionScript.includes('mirror: "' + mirror + '"'), mirror + " must use a model resource, not Space proxy");
}
assert.ok(visionPage.includes('data-vis="mirror"'));
assert.ok(visionPage.includes('data-vis="external"'));
assert.ok(visionScript.includes('get("external").href = model.url'));
assert.ok(visionScript.includes('frame.src = model.embed'));
assert.ok(visionScript.includes("进入后选择 dfine-nano-coco"));
assert.ok(visionScript.includes("非 SAM 2.1 权重"));
console.log("Vision demo contracts: original Space links and iframe unchanged; 3 model resource mirrors registered.");


const playgroundScript = fs.readFileSync(path.join(__dirname, "../docs/js/model-playground.js"), "utf8");
const documentPage = fs.readFileSync(path.join(__dirname, "../docs/model-demos/document.md"), "utf8");
const videoPage = fs.readFileSync(path.join(__dirname, "../docs/model-demos/video.md"), "utf8");
const docVideoCases = [
  ["https://huggingface.co/spaces/ibm-granite/granite-docling-258m-demo",
   "https://ibm-granite-granite-docling-258m-demo.hf.space",
   "https://aifasthub.com/ibm-granite/granite-docling-258M"],
  ["https://huggingface.co/spaces/PaddlePaddle/PaddleOCR-VL-1.6_Online_Demo",
   "https://paddlepaddle-paddleocr-vl-1-6-online-demo.hf.space",
   "https://www.modelscope.cn/models/PaddlePaddle/PaddleOCR-VL-1.6"],
  ["https://huggingface.co/spaces/echarlaix/vision-langage-openvino",
   "https://echarlaix-vision-langage-openvino.hf.space",
   "https://www.modelscope.cn/models/HuggingFaceTB/SmolVLM2-256M-Video-Instruct"]
];
for (const [official, embed, mirror] of docVideoCases) {
  assert.ok(playgroundScript.includes('url: "' + official + '"'), official + " must remain unchanged");
  assert.ok(playgroundScript.includes('embed: "' + embed + '"'), embed + " must remain unchanged");
  assert.ok(playgroundScript.includes('mirror: "' + mirror + '"'), mirror + " must be explicitly registered");
}
for (const page of [documentPage, videoPage]) {
  assert.equal((page.match(/data-mpg="mirror"/g) || []).length, 1, "one mirror link per workspace");
  assert.equal((page.match(/data-mpg="external"/g) || []).length, 1, "original external Space link retained");
  assert.ok(page.indexOf('data-mpg="mirror"') > page.indexOf('data-mpg="external"'), "link order unchanged");
}
assert.ok(playgroundScript.includes('find("external").href = m.url;'));
assert.ok(playgroundScript.includes('mirror.href = m.mirror;'));
assert.ok(playgroundScript.includes('frame.src = m.embed;'));
assert.ok(playgroundScript.includes("原始权重，非 OpenVINO 转换格式"));
console.log("Document / video contracts: 3 mirror resources; official Spaces and iframe remain unchanged.");

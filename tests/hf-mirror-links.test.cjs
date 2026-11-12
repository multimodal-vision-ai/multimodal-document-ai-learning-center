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

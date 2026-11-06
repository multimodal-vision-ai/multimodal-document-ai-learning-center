import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {
  BUNDLE_FORMAT_VERSION, DEFAULTS, ONNX_MODEL_ID, SOURCE_MODEL_ID, SOURCE_REVISION,
  directPrompt, fetchBundleContract, modelFileUrl, requireNativeOnnxBundle, validateSettings
} from "../adapters/ovisocr3-native/contract.mjs";

const commit = "a".repeat(40);
const metadata = {
  format_version: BUNDLE_FORMAT_VERSION,
  source_model_id: SOURCE_MODEL_ID,
  source_revision: SOURCE_REVISION,
  model_type: "qwen3_5",
  source_weights_sha256: "b".repeat(64),
  prompt_sha256: ""
};
const validation = {
  success: true,
  source_model_id: SOURCE_MODEL_ID,
  source_revision: SOURCE_REVISION,
  source_weights_sha256: metadata.source_weights_sha256,
  structured_prompt_sha256: "",
  artifacts: {
    "onnx/embed_tokens_fp16.onnx": {sha256:"1".repeat(64)},
    "onnx/vision_encoder.onnx": {sha256:"2".repeat(64)},
    "onnx/decoder_model_merged_fp16.onnx": {sha256:"3".repeat(64)}
  }
};
const prompt = `Analyze the document structure and extract text content. Return a single JSON array in natural reading order.
Each element follows this schema: {"bbox": [x_min, y_min, x_max, y_max], "category": "string", "content": "string"}.
The bbox coordinates are integers scaled to [0, 1000).`;
const promptHash = createHash("sha256").update(prompt).digest("hex");
metadata.prompt_sha256 = promptHash;
metadata.eos_token_id = [248044, 248046];
validation.structured_prompt_sha256 = promptHash;

assert.equal(requireNativeOnnxBundle(ONNX_MODEL_ID), ONNX_MODEL_ID);
assert.throws(() => requireNativeOnnxBundle(SOURCE_MODEL_ID), /专用 ONNX/);
assert.equal(modelFileUrl(ONNX_MODEL_ID, commit, "prompts/document_structured.txt"),
  "https://huggingface.co/" + ONNX_MODEL_ID + "/resolve/" + commit + "/prompts/document_structured.txt");

const calls = [];
const fakeFetch = async url => {
  calls.push(url);
  if (url.endsWith("source-model.json")) return {
    ok: true, json: async () => metadata
  };
  if (url.endsWith("validation/component_validation.json")) return {
    ok: true, json: async () => validation
  };
  if (url.endsWith("prompts/document_structured.txt")) return {
    ok: true, text: async () => prompt
  };
  throw new Error("unexpected URL: " + url);
};
const bundle = await fetchBundleContract({
  modelId: ONNX_MODEL_ID, revision: commit, fetcher: fakeFetch
});
assert.equal(bundle.metadata.source_revision, SOURCE_REVISION);
assert.equal(bundle.prompt, prompt);
assert.equal(calls.length, 3);
assert.equal(bundle.validation.success, true);
const tamperedFetch = async url => {
  const response = await fakeFetch(url);
  if (url.endsWith("prompts/document_structured.txt")) {
    return {ok:true,text:async()=>prompt+" altered"};
  }
  return response;
};
await assert.rejects(fetchBundleContract({
  modelId: ONNX_MODEL_ID, revision: commit, fetcher: tamperedFetch
}), /提示词哈希/);
await assert.rejects(fetchBundleContract({
  modelId: ONNX_MODEL_ID, revision: "main", fetcher: fakeFetch
}), /40 位 commit SHA/);

const tokenizer = {apply_chat_template(messages, options) {
  assert.equal(messages[0].content[1].text, prompt);
  assert.equal(options.enable_thinking, false);
  return "<|im_start|>user\n<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n";
}};
const direct = directPrompt(tokenizer, prompt);
assert.ok(direct.endsWith("<|im_start|>assistant\n"));
assert.ok(!direct.includes("<think>"));

assert.deepEqual(validateSettings(), DEFAULTS);
assert.equal(validateSettings({maxPixels: 2880 ** 2}).maxPixels, 2880 ** 2);
assert.throws(() => validateSettings({minPixels: 2880 ** 2, maxPixels: 448 ** 2}));
assert.throws(() => validateSettings({maxNewTokens: 0}));
assert.throws(() => validateSettings({maxNewTokens: 16385}));
assert.throws(() => directPrompt({apply_chat_template: () => "bad"}, prompt));
console.log("OvisOCR3 native contract checks passed");

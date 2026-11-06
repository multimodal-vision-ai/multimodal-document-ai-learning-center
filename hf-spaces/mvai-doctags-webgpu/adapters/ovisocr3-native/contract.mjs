/* Pinned source/output contract for official ATH-MaaS OvisOCR3. */
export const SOURCE_MODEL_ID = "ATH-MaaS/OvisOCR3";
export const SOURCE_REVISION = "17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90";
export const ONNX_MODEL_ID = "multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX";
export const BUNDLE_FORMAT_VERSION = 1;
export const DEFAULTS = Object.freeze({
  minPixels: 448 * 448,
  maxPixels: 1440 * 1440,
  maxNewTokens: 16384
});

export function modelFileUrl(modelId, revision, file, modelHost) {
  const host = String(modelHost || "https://huggingface.co/").replace(/\/?$/, "/");
  return host + modelId + "/resolve/" + encodeURIComponent(revision) + "/" +
    file.split("/").map(encodeURIComponent).join("/");
}

export function requireNativeOnnxBundle(modelId) {
  if (modelId !== ONNX_MODEL_ID) {
    throw new Error("OvisOCR3 必须使用经过官方权重转换和验证的专用 ONNX 仓库；禁止直接加载 BF16 原始仓库或其他模型。");
  }
  return modelId;
}

export async function fetchBundleContract({
  modelId,
  revision,
  modelHost,
  fetcher = fetch
} = {}) {
  requireNativeOnnxBundle(modelId);
  if (typeof revision !== "string" || !/^[0-9a-f]{40}$/i.test(revision)) {
    throw new Error("必须指定 ONNX 模型仓库的完整 40 位 commit SHA，不能使用 main 或浮动标签。");
  }
  const metadataResponse = await fetcher(modelFileUrl(modelId, revision, "source-model.json", modelHost));
  if (!metadataResponse.ok) throw new Error("无法读取 OvisOCR3 来源校验文件：" + metadataResponse.status);
  const metadata = await metadataResponse.json();
  if (metadata.format_version !== BUNDLE_FORMAT_VERSION ||
      metadata.source_model_id !== SOURCE_MODEL_ID ||
      metadata.source_revision !== SOURCE_REVISION ||
      metadata.model_type !== "qwen3_5") {
    throw new Error("ONNX 模型包与批准的 OvisOCR3 官方来源不一致。");
  }
  const promptResponse = await fetcher(modelFileUrl(modelId, revision, "prompts/document_structured.txt", modelHost));
  if (!promptResponse.ok) throw new Error("无法读取随模型固定的 Structured 提示词：" + promptResponse.status);
  const prompt = await promptResponse.text();
  if (!prompt.includes("single JSON array") ||
      !prompt.includes('"bbox"') ||
      !prompt.includes('"category"') ||
      !prompt.includes('"content"') ||
      !prompt.includes("[0, 1000)")) {
    throw new Error("OvisOCR3 Structured 提示词缺少官方 JSON/坐标契约。");
  }
  return Object.freeze({metadata, prompt});
}

export function directPrompt(tokenizer, structuredPrompt) {
  if (typeof structuredPrompt !== "string" || !structuredPrompt.trim()) {
    throw new TypeError("Structured 提示词不能为空。");
  }
  const rendered = tokenizer.apply_chat_template([
    {role: "user", content: [{type: "image"}, {type: "text", text: structuredPrompt}]}
  ], {tokenize: false, add_generation_prompt: true, enable_thinking: false});
  const marker = "<|im_start|>assistant\n";
  const end = rendered.lastIndexOf(marker);
  if (end < 0) throw new Error("模型原始对话模板缺少 assistant 标记。");
  return rendered.slice(0, end + marker.length);
}

export function validateSettings(settings = {}) {
  const value = {...DEFAULTS, ...settings};
  for (const field of ["minPixels", "maxPixels", "maxNewTokens"]) {
    if (!Number.isSafeInteger(value[field]) || value[field] <= 0) {
      throw new Error(field + " 必须为正整数。");
    }
  }
  if (value.minPixels > value.maxPixels ||
      value.maxPixels > 2880 * 2880 ||
      value.maxNewTokens > 16384) {
    throw new Error("原生 OvisOCR3 推理参数超过安全范围。");
  }
  return value;
}

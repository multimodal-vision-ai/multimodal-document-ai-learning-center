/* DEV only: isolate HF model download origin from the WebGPU inference implementation.
 * A model-card mirror is NOT evidence that weight downloads work in a browser. */
import {MODEL_REVISION as WC_REVISION} from "./adapters/wang-qwen35-2b/contract.mjs";

export const OFFICIAL = "official";
export const MIRROR = "mirror";
export const OFFICIAL_HOST = "https://huggingface.co/";
export const MIRROR_HOST = "https://hf-mirror.com/";
export const REMOTE_PATH = "{model}/resolve/{revision}/";

export function mirrorPolicy(entry) {
  if (!entry?.builtIn) return {allowed: false, reason: "自定义模型暂不启用国内镜像，请继续使用官方源。"};
  if (entry.adapter === "paddleocr-vl-1.6") return {
    allowed: false,
    reason: "PaddleOCR-VL-1.6 使用独立的 WebGPU 模型包及版面检测 SDK；尚未验证可替换的国内权重源，保持原下载方式。"
  };
  if (entry.adapter === "r3-ovisocr3" || entry.adapter === "wang-qwen35-2b" ||
      entry.adapter === "ovisocr3-native" ||
      entry.id === "onnx-community/granite-docling-258M-ONNX") {
    return {allowed: true, reason: "仅供 DEV 试验；需预检跨域与文件路径，下载后仍须人工验证推理一致性。"};
  }
  return {allowed: false, reason: "尚未验证该模型的国内 WebGPU ONNX 文件，默认使用官方源。"};
}

export function modelRevision(entry) {
  if (entry?.adapter === "wang-qwen35-2b") return WC_REVISION;
  return entry?.revision || "main";
}

export function runtimeSource(source, entry) {
  if (source === OFFICIAL) return {modelSource: OFFICIAL};
  if (source !== MIRROR || !mirrorPolicy(entry).allowed) {
    throw new Error("当前模型尚不支持国内镜像下载，请选择官方源。");
  }
  return {
    modelSource: MIRROR,
    modelHost: MIRROR_HOST,
    modelPathTemplate: REMOTE_PATH
  };
}

function modelFileUrl(entry, filename) {
  const id = entry.id;
  if (typeof id !== "string" || !/^[\w.-]+\/[\w.-]+$/.test(id) || id.includes("..")) {
    throw new Error("非法模型仓库 ID。");
  }
  return MIRROR_HOST + id + "/resolve/" + encodeURIComponent(modelRevision(entry)) + "/" + filename;
}

async function readJsonProbe(fetcher, entry, signal) {
  const url = modelFileUrl(entry, "config.json");
  const response = await fetcher(url, {
    method: "GET", mode: "cors", credentials: "omit", cache: "no-store",
    redirect: "follow", signal
  });
  if (!response || !response.ok || response.status !== 200) {
    throw new Error("镜像配置文件请求失败（HTTP " + (response?.status ?? "network") + "）。");
  }
  // Disallow an apparent success that silently redirects back to blocked HF.
  if (response.url && new URL(response.url).hostname !== "hf-mirror.com") {
    throw new Error("镜像配置文件跳转到其他域名，未确认国内下载源。");
  }
  const size = Number(response.headers?.get?.("content-length") || 0);
  if (size > 2 * 1024 * 1024) {
    await response.body?.cancel?.();
    throw new Error("配置文件异常过大，终止镜像预检。");
  }
  let config;
  try { config = await response.json(); }
  catch { throw new Error("镜像未返回有效的模型配置 JSON（可能是错误页）。"); }
  if (!config || typeof config !== "object" || Array.isArray(config) ||
      (!config.model_type && !config.architectures && !config.is_encoder_decoder)) {
    throw new Error("镜像配置文件缺少模型架构信息。");
  }
  return url;
}

async function readRangeProbe(fetcher, entry, signal) {
  // WC-2B requires a real readable Content-Range header for segmented loading.
  const url = modelFileUrl(entry, "onnx/embed_tokens_fp16.onnx_data");
  const response = await fetcher(url, {
    method: "GET", mode: "cors", credentials: "omit", cache: "no-store",
    redirect: "follow", headers: {"Range": "bytes=0-0"}, signal
  });
  const range = response?.headers?.get?.("content-range") || "";
  // Stop receiving data even when an unsuitable mirror ignores the Range header.
  try { await response?.body?.cancel?.(); } catch {}
  if (response?.status !== 206 || !/^bytes 0-0\/[1-9]\d*$/.test(range)) {
    throw new Error("镜像未提供可读取的 HTTP 206 Content-Range；WC-2B 不能使用该源分段下载。");
  }
  return url;
}

export async function probeMirror(entry, {fetcher = globalThis.fetch, timeoutMs = 15000} = {}) {
  if (!mirrorPolicy(entry).allowed) throw new Error(mirrorPolicy(entry).reason);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const configUrl = await readJsonProbe(fetcher, entry, controller.signal);
    const rangeUrl = entry.adapter === "wang-qwen35-2b"
      ? await readRangeProbe(fetcher, entry, controller.signal) : null;
    return {configUrl, rangeUrl, modelHost: MIRROR_HOST, revision: modelRevision(entry)};
  } catch (error) {
    if (controller.signal.aborted) throw new Error("镜像预检超时或网络中断；未开始下载模型。");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

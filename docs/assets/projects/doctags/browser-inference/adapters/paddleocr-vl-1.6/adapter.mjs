/* Full browser-local PaddleOCR-VL-1.6 pipeline: PP-DocLayoutV3 + 0.9B VLM.
   No server inference, no CPU/WASM fallback, no DocTags conversion. */
import {orderedRegions, assemblePaddleResult} from "./pipeline-contract.mjs";

export const SOURCE_MODEL = "PaddlePaddle/PaddleOCR-VL-1.6";
export const BROWSER_MODEL = "glebkudr/PaddleOCR-VL-1.6-WebGPU";
export const BROWSER_MODEL_REVISION = "5219606297d00bbd23b2ec193271af0c0b427dfc";
export const LAYOUT_MODEL = "PP-DocLayoutV3";
export const LAYOUT_SDK_VERSION = "1.2.0";
export const LAYOUT_SDK_COMMIT = "3aedb7b35af49a1c207fd4f846211366a9d09973";
export const VLM_ENGINE_COMMIT = "f7d2f8aa40639497e1dbd95f2f8793e664b90758";
export const MODEL_DOWNLOAD_BYTES = 2_038_286_862;
export const LAYOUT_DOWNLOAD_BYTES = 74_279_796;

const CDN_BASES = Object.freeze([
  "https://cdn.jsdelivr.net/",
  "https://gcore.jsdelivr.net/",
  "https://fastly.jsdelivr.net/",
  "https://testingcf.jsdelivr.net/"
]);
const LAYOUT_SCRIPT_URLS = CDN_BASES.map(base =>
  base + "npm/web-sdk-pp-doclayoutv3@" + LAYOUT_SDK_VERSION + "/dist/browser-global.js"
);
const LAYOUT_MANIFEST_URL =
  "https://chenmohan123.github.io/web-sdk-PP-DocLayoutV3/models/pp-doclayoutv3/manifest.json";
const VLM_ENGINE_URLS = CDN_BASES.map(base =>
  base + "gh/glebkudr/paddleocr-vl-webgpu@" + VLM_ENGINE_COMMIT +
  "/web/engine/browser_ocr_runtime.mjs"
);

let layoutScriptPromise;
let vlmModulePromise;

function loadLayoutSdk(onProgress = () => {}) {
  const existing = globalThis.PPDocLayout;
  if (existing?.createDocLayout) {
    if (existing.CURRENT_SDK_VERSION !== LAYOUT_SDK_VERSION) {
      throw new Error("页面中已存在不同版本的 PP-DocLayoutV3 SDK。");
    }
    return Promise.resolve(existing);
  }
  if (!layoutScriptPromise) {
    layoutScriptPromise = (async () => {
      const failures = [];
      for (const url of LAYOUT_SCRIPT_URLS) {
        try {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = url;
            script.async = true;
            script.crossOrigin = "anonymous";
            script.onload = resolve;
            script.onerror = () => {
              script.remove();
              reject(new Error("script load failed"));
            };
            document.head.appendChild(script);
          });
          const api = globalThis.PPDocLayout;
          if (!api?.createDocLayout || api.CURRENT_SDK_VERSION !== LAYOUT_SDK_VERSION) {
            throw new Error("SDK export/version mismatch");
          }
          onProgress({stage:"layout-sdk",status:"loaded",url});
          return api;
        } catch (error) {
          failures.push(url + " — " + (error?.message || String(error)));
        }
      }
      throw new Error("PP-DocLayoutV3 SDK 所有固定镜像均加载失败：" + failures.join("；"));
    })().catch(error => {
      layoutScriptPromise = null;
      throw error;
    });
  }
  return layoutScriptPromise;
}

function loadVlmModule(onProgress = () => {}) {
  if (!vlmModulePromise) {
    vlmModulePromise = (async () => {
      const failures = [];
      for (const url of VLM_ENGINE_URLS) {
        try {
          const module = await import(url);
          if (typeof module.PaddleOcrVlEngine !== "function") {
            throw new Error("PaddleOcrVlEngine class export missing");
          }
          onProgress({stage:"vlm-engine",status:"loaded",url});
          return {module,url};
        } catch (error) {
          failures.push(url + " — " + (error?.message || String(error)));
        }
      }
      throw new Error("PaddleOCR-VL-1.6 WebGPU 引擎所有固定镜像均加载失败：" + failures.join("；"));
    })().catch(error => {
      vlmModulePromise = null;
      throw error;
    });
  }
  return vlmModulePromise;
}

async function createDefaultLayout(onProgress) {
  const api = await loadLayoutSdk(onProgress);
  const detector = await api.createDocLayout({
    model: LAYOUT_MANIFEST_URL,
    backend: "webgpu",
    precision: "fp16",
    allowFallback: false,
    cache: true,
    onProgress: event => onProgress({stage: "layout-load", ...event})
  });
  if (detector.runtime?.backend !== "webgpu" || detector.runtime?.precision !== "fp16") {
    await detector.dispose();
    throw new Error("PP-DocLayoutV3 未以 WebGPU FP16 运行；禁止回退到 WASM/CPU。");
  }
  return detector;
}

/* Construct exactly one upstream WebRuntime.
   The upstream convenience factory creates 2–3 runtime handles on an RTX 3080;
   our single-document workflow is sequential and must not reserve extra GPU contexts. */
export async function createSingleRuntimeVlm({engineModule,runtimeModule}={}) {
  if(typeof engineModule?.PaddleOcrVlEngine!=="function"
    ||typeof runtimeModule?.default!=="function"
    ||typeof runtimeModule?.WebRuntime?.create!=="function")
    throw new Error("Paddle WebGPU runtime exports are incomplete.");
  await runtimeModule.default();
  const runtime=await runtimeModule.WebRuntime.create();
  try{
    const capabilities=JSON.parse(runtime.capabilities_json());
    const adapter=String(capabilities.adapter_name||"").toLowerCase();
    if(/swiftshader|llvmpipe|software|cpu/.test(adapter))
      throw new Error("PaddleOCR-VL detected a software adapter; real WebGPU is required.");
    const singleConcurrency=Object.freeze({
      current:remaining=>Math.max(0,Math.min(1,Number.isFinite(remaining)?remaining:1)),
      recordWave:()=>null
    });
    return new engineModule.PaddleOcrVlEngine([runtime],singleConcurrency);
  }catch(error){
    try{runtime.free();}catch{}
    throw error;
  }
}

async function createDefaultVlm(onProgress = () => {}) {
  const loaded = await loadVlmModule(onProgress);
  const runtimeUrl = new URL("./pkg/pvlc_runtime_web.js",loaded.url).href;
  const runtimeModule = await import(runtimeUrl);
  return createSingleRuntimeVlm({engineModule:loaded.module,runtimeModule});
}

async function warmupVlm(vlm, onProgress) {
  const canvas = document.createElement("canvas");
  canvas.width = 448;
  canvas.height = 448;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("无法创建 PaddleOCR WebGPU 模型预热画布。");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  // The upstream engine downloads and uploads model weights lazily on the
  // first recognition call. One deterministic token warms the real engine
  // before the UI reports the model as loaded.
  return vlm.recognizeCanvas(canvas, {
    task: "ocr",
    maxGeneratedTokens: 1,
    onProgress: event => onProgress({stage: "vlm-warmup", ...event})
  });
}

function regionContent(text, task) {
  const prefix = ({
    ocr: "OCR:",
    table: "Table Recognition:",
    formula: "Formula Recognition:",
    chart: "Chart Recognition:"
  })[task];
  if (prefix && text.startsWith(prefix)) {
    return text.slice(prefix.length).replace(/^\s+/, "");
  }
  return text;
}

function emptyNative(width,height) {
  return {
    input_path:null,width,height,page_index:null,page_count:1,
    model_settings:{
      pipeline_model:"PaddleOCR-VL-1.6",
      use_doc_preprocessor:false,
      use_layout_detection:true,
      use_chart_recognition:true,
      format_block_content:false,
      layout_model:"PP-DocLayoutV3"
    },
    parsing_res_list:[]
  };
}

function stoppedBeforeLayout(started, reason, width, height) {
  const native = emptyNative(width,height);
  return {
    text: JSON.stringify(native),
    native,
    ended: false,
    incomplete: true,
    stopped: true,
    stopStage: reason,
    totalSeconds: (performance.now() - started) / 1000,
    completedRegions: 0,
    totalRegions: 0,
    rawOutputs: []
  };
}

export async function createAdapter({
  onProgress = () => {},
  dependencies = {}
} = {}) {
  if (typeof navigator === "undefined" || !navigator.gpu) {
    throw new Error("浏览器没有提供 WebGPU，请使用支持 WebGPU 的 Chrome 或 Edge。");
  }
  const gpu = await navigator.gpu.requestAdapter();
  if (!gpu) throw new Error("浏览器无法获取可用的 WebGPU 适配器。");
  if (!gpu.features.has("shader-f16")) {
    throw new Error("当前设备缺少 shader-f16；PaddleOCR-VL-1.6 不能启动。");
  }

  let layout = null;
  let vlm = null;
  let disposed = false;
  let busy = false;
  let stopRequested = false;
  let activeController = null;

  try {
    layout = await (dependencies.createLayout ?? createDefaultLayout)(onProgress);
    if (layout.runtime?.backend !== "webgpu" || layout.runtime?.precision !== "fp16") {
      throw new Error("版面检测必须运行在 WebGPU FP16，不能使用 CPU/WASM。");
    }
    vlm = await (dependencies.createVlm ?? createDefaultVlm)(onProgress);
    if (!vlm || typeof vlm.recognizeCanvas !== "function" || typeof vlm.dispose !== "function") {
      throw new Error("PaddleOCR-VL-1.6 WebGPU 引擎接口不完整。");
    }
    await (dependencies.warmup ?? warmupVlm)(vlm, onProgress);
  } catch (error) {
    try { await vlm?.dispose?.(); } catch {}
    try { await layout?.dispose?.(); } catch {}
    throw error;
  }

  return {
    model: Object.freeze({
      sourceModel: SOURCE_MODEL,
      browserModel: BROWSER_MODEL,
      parameterCount: "0.9B",
      downloadBytes: MODEL_DOWNLOAD_BYTES + LAYOUT_DOWNLOAD_BYTES,
      layoutModel: LAYOUT_MODEL,
      layoutBytes: LAYOUT_DOWNLOAD_BYTES,
      backend: "WebGPU FP16"
    }),
    stop() {
      if (!busy) return;
      stopRequested = true;
      // Layout detection supports AbortSignal. The VLM runtime does not expose
      // a token-level abort API; if already decoding a crop, finish that crop,
      // preserve its output, then stop before starting the next region.
      activeController?.abort("user-stop");
    },
    async dispose() {
      if (busy) throw new Error("请先停止当前推理并等待当前区域完成，再释放 PaddleOCR 模型。");
      if (disposed) return;
      disposed = true;
      try {
        await vlm.dispose();
      } finally {
        await layout.dispose();
      }
    },
    async recognize(blob, {
      onRegion = () => {},
      onProgress: progress = () => {}
    } = {}) {
      if (disposed) throw new Error("PaddleOCR 推理实例已经释放。");
      if (busy) throw new Error("PaddleOCR 已有推理任务正在运行。");
      if (!(blob instanceof Blob)) throw new TypeError("需要浏览器原始图片 File/Blob。");

      busy = true;
      stopRequested = false;
      activeController = new AbortController();
      const started = performance.now();
      let bitmap = null;
      let detection = null;
      const rawOutputs = [];
      const recognitions = [];
      try {
        bitmap = await createImageBitmap(blob);
        const width = bitmap.width;
        const height = bitmap.height;
        progress({stage: "layout", status: "start"});
        try {
          detection = await layout.detect(blob, {signal: activeController.signal});
        } catch (error) {
          if (stopRequested && (error?.code === "ABORTED" || error?.name === "AbortError")) {
            return stoppedBeforeLayout(started, "layout", width, height);
          }
          throw error;
        } finally {
          activeController = null;
        }
        if (stopRequested) return stoppedBeforeLayout(started, "layout", width, height);
        if (layout.runtime?.backend !== "webgpu" || layout.runtime?.precision !== "fp16") {
          throw new Error("版面检测运行时发生变化，已终止推理。");
        }
        if (detection.image?.original?.width !== width ||
            detection.image?.original?.height !== height) {
          throw new Error("版面检测坐标系与原图分辨率不一致，拒绝错误定位。");
        }

        const regions = orderedRegions(detection.detections, {width, height});
        progress({
          stage: "layout",
          status: "complete",
          regions: regions.length,
          seconds: detection.timings?.totalMs / 1000
        });
        const recognitionStarted = performance.now();

        for (const [index, region] of regions.entries()) {
          if (stopRequested) break;
          if (region.task === null) {
            recognitions.push({text: "", rawText: "", skipped: true});
            onRegion({index, region, skipped: true});
            continue;
          }
          const [x1, y1, x2, y2] = region.box;
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.ceil(x2 - x1));
          canvas.height = Math.max(1, Math.ceil(y2 - y1));
          const context = canvas.getContext("2d");
          if (!context) throw new Error("浏览器无法创建区域裁剪 Canvas。");
          context.drawImage(bitmap, x1, y1, x2 - x1, y2 - y1, 0, 0, canvas.width, canvas.height);

          const reply = await vlm.recognizeCanvas(canvas, {
            task: region.task,
            maxGeneratedTokens: region.task === "table" ? 2048 : 1024,
            onProgress: event => progress({
              ...event,
              stage: "recognition",
              substage: event.stage ?? event.kind ?? "inference",
              region: index + 1,
              totalRegions: regions.length
            })
          });
          if (typeof reply?.text !== "string") {
            throw new Error("PaddleOCR-VL 没有返回原始识别文本。");
          }
          const content = regionContent(reply.text, region.task);
          const recognition = {
            text: content,
            rawText: reply.text,
            task: region.task,
            generationMs: Number(reply.generationMs) || 0,
            tokensPerSecond: Number(reply.tokensPerSecond) || 0
          };
          recognitions.push(recognition);
          rawOutputs.push({index, label: region.label, task: region.task, text: reply.text});
          onRegion({index, region, ...recognition});
        }

        const completedRegions = regions.slice(0, recognitions.length);
        const native = assemblePaddleResult(completedRegions, recognitions, {width, height});
        const ended = completedRegions.length === regions.length;
        const recognitionMs = performance.now() - recognitionStarted;
        const result = {
          text: JSON.stringify(native, null, 2),
          native,
          ended,
          incomplete: !ended,
          stopped: stopRequested,
          totalSeconds: (performance.now() - started) / 1000,
          layoutSeconds: (Number(detection.timings?.totalMs) || 0) / 1000,
          recognitionSeconds: recognitionMs / 1000,
          completedRegions: completedRegions.length,
          totalRegions: regions.length,
          model: this.model,
          rawOutputs
        };
        progress({
          stage: "recognition",
          status: ended ? "complete" : "stopped",
          completedRegions: completedRegions.length,
          totalRegions: regions.length
        });
        return result;
      } finally {
        bitmap?.close();
        activeController = null;
        busy = false;
      }
    }
  };
}

import {MODEL_ID, MODEL_REVISION, trainedPrompt, RESPONSE_PREFIX, STOP_IDS, validateSettings} from './contract.mjs';
import {createRangeFetch} from './range-download.mjs';

export const VERSIONS = Object.freeze({transformers: '4.4.0-next.0', ort: '1.31.1'});
const CDN = 'https://cdn.jsdelivr.net/npm/';

/** Only this adapter uses the newer runtime. The exhibit's other models are unchanged. */
export async function createAdapter({modelId = MODEL_ID, revision = MODEL_REVISION, onProgress = () => {}, runtime = {}} = {}) {
  if (!navigator.gpu) throw new Error('浏览器没有提供 WebGPU，请使用支持 WebGPU 的 Chrome 或 Edge。');
  const gpu = await navigator.gpu.requestAdapter();
  if (!gpu) throw new Error('浏览器无法访问可用的 WebGPU 设备。');
  if (!gpu.features.has('shader-f16')) throw new Error('当前设备缺少半精度计算支持（shader-f16）。');
  const ortUrl = runtime.ortUrl ?? `${CDN}onnxruntime-web@${VERSIONS.ort}/dist/ort.webgpu.bundle.min.mjs`;
  const transformersUrl = runtime.transformersUrl ?? `${CDN}@huggingface/transformers@${VERSIONS.transformers}/dist/transformers.web.min.js`;
  const imports = document.createElement('script');
  imports.type = 'importmap';
  imports.textContent = JSON.stringify({scopes: {[transformersUrl]: {
    'onnxruntime-web/webgpu': ortUrl, 'onnxruntime-common': ortUrl,
  }}});
  document.head.append(imports);
  const ort = await import(ortUrl);
  ort.env.wasm.wasmPaths = runtime.wasmPaths ?? `${CDN}onnxruntime-web@${VERSIONS.ort}/dist/`;
  ort.env.wasm.numThreads = 1;
  const lib = await import(transformersUrl);
  lib.env.useBrowserCache = typeof globalThis.caches !== "undefined";
  lib.env.useWasmCache = typeof globalThis.caches !== "undefined";
  try { await navigator.storage?.persist?.(); } catch { /* Cache still works without persistent-storage permission. */ }
  if (runtime.modelHost) {
    lib.env.allowRemoteModels = true;
    lib.env.allowLocalModels = false;
    lib.env.remoteHost = runtime.modelHost;
    lib.env.remotePathTemplate = '{model}/';
    // Keep the browser cache enabled when a model mirror is configured.
  }
  // The embedding tensor is a single ~971 MiB ONNX external-data file.
  // Fetch it through verified HTTP Range requests; all other model files use
  // the original Transformers.js fetch/cache path unchanged.
  const originalFetch = lib.env.fetch;
  const rangeFetch = createRangeFetch({
    modelId,
    revision,
    onEvent(event) {
      if (event.type === "range-retry") {
        onProgress({
          status: "range-retry",
          stage: "model",
          file: "embed_tokens_fp16.onnx_data",
          index: event.index,
          attempt: event.attempt,
          message: event.message
        });
      }
    }
  });
  lib.env.fetch = rangeFetch;
  let processor;
  let model;
  let prompt;
  try {
    processor = await lib.AutoProcessor.from_pretrained(modelId, {
      revision, progress_callback: info => onProgress({...info, stage: "processor"}),
    });
    const templateUrl = runtime.modelHost
      ? `${runtime.modelHost}${modelId}/chat_template.jinja`
      : `https://huggingface.co/${modelId}/resolve/${encodeURIComponent(revision)}/chat_template.jinja`;
    const template = await fetch(templateUrl);
    if (!template.ok) throw new Error(`加载对话模板失败：HTTP ${template.status}`);
    processor.tokenizer.chat_template = await template.text();
    prompt = trainedPrompt(processor.tokenizer);
    // config.json declares the three Decoder shards; do not override it with true.
    model = await lib.AutoModelForImageTextToText.from_pretrained(modelId, {
      revision, device: 'webgpu', dtype: {vision_encoder:'fp32',embed_tokens:'fp16',decoder_model_merged:'fp16'},
      progress_callback: info => onProgress({...info, stage: "model"}),
    });
  } finally {
    lib.env.fetch = originalFetch;
    // Also clean up after a later ONNX session error if the embedding file itself
    // was already committed to the normal Transformers.js full-file cache.
    await rangeFetch.cleanupIfCached({
      remoteHost: lib.env.remoteHost,
      remotePathTemplate: lib.env.remotePathTemplate
    });
  }
  const stopping = new lib.InterruptableStoppingCriteria();
  let busy = false;
  return {
    modelId, revision, versions: VERSIONS, gpu: gpu.info,
    stop() { stopping.interrupt(); },
    async dispose() {
      if (busy) throw new Error('请先停止当前识别。');
      await model.dispose();
    },
    async recognize(image, {onText = () => {}, onTokens = () => {}, ...settings} = {}) {
      if (busy) throw new Error('当前图片仍在识别中。');
      const config = validateSettings(settings);
      busy = true;
      stopping.reset();
      const start = performance.now();
      let count = 0;
      let firstTokenAt = null;
      try {
        processor.image_processor.min_pixels = config.minPixels;
        processor.image_processor.max_pixels = config.maxPixels;
        processor.image_processor.size = {shortest_edge: config.minPixels, longest_edge: config.maxPixels};
        const raw = image instanceof lib.RawImage ? image : await lib.RawImage.read(image);
        const inputs = await processor(prompt, raw);
        const promptLength = inputs.input_ids.dims.at(-1);
        const promptIds = inputs.input_ids.tolist()[0].map(Number);
        const prefill = performance.now();
        const streamer = new lib.TextStreamer(processor.tokenizer, {
          skip_prompt: true, skip_special_tokens: true,
          callback_function: onText,
          token_callback_function(tokens) {
            if (tokens.length && firstTokenAt === null) firstTokenAt = performance.now();
            count += tokens.length; onTokens(count);
          },
        });
        const generated = await model.generate({
          ...inputs, max_new_tokens: config.maxNewTokens, do_sample: false,
          repetition_penalty: 1.02, eos_token_id: [...STOP_IDS],
          streamer, stopping_criteria: stopping,
        });
        const ids = generated.tolist()[0].slice(promptLength);
        const generatedText = processor.tokenizer.decode(ids, {skip_special_tokens: true});
        const text = RESPONSE_PREFIX + generatedText;
        const seconds = (performance.now() - prefill) / 1000;
        return {
          text, generatedText, responsePrefix: RESPONSE_PREFIX, tokenIds: ids.map(Number), prompt, promptTokens: promptLength,
          promptIds,
          imageGrid: inputs.image_grid_thw.tolist().map(row => row.map(Number)),
          generatedTokens: ids.length, seconds, tokensPerSecond: ids.length / seconds,
          firstTokenSeconds: firstTokenAt === null ? null : (firstTokenAt-prefill)/1000,
          decodeTokensPerSecond: firstTokenAt === null || ids.length < 2 ? null : (ids.length-1)/((performance.now()-firstTokenAt)/1000),
          totalSeconds: (performance.now() - start) / 1000,
          ended: ids.length > 0 && STOP_IDS.includes(Number(ids.at(-1))),
          settings: config, postprocess: false, prefixIncluded: true,
        };
      } finally { busy = false; }
    },
  };
}

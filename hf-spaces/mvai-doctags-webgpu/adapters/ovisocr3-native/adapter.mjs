import {fetchStructuredPrompt, directPrompt, requireNativeOnnxBundle, validateSettings} from './contract.mjs';

export const VERSIONS = Object.freeze({transformers: '4.4.0-next.0', ort: '1.31.1'});
const CDN_BASES = Object.freeze([
  'https://cdn.jsdelivr.net/npm/',
  'https://gcore.jsdelivr.net/npm/',
  'https://fastly.jsdelivr.net/npm/',
  'https://testingcf.jsdelivr.net/npm/',
]);
function uniqueUrls(values) { return [...new Set(values.filter(Boolean))]; }
async function importFirstAvailable(urls, label) {
  const failures = [];
  for (const [index, url] of urls.entries()) {
    try {
      const module = await import(url);
      if (index > 0) console.warn(label + ' CDN fallback selected:', url);
      return {module, url};
    } catch (error) {
      let host = url;
      try { host = new URL(url).host; } catch {}
      failures.push(host + ': ' + (error?.message || String(error)));
    }
  }
  throw new Error(label + ' CDN 加载失败，已尝试多个镜像节点：' + failures.join('；') + '。请检查网络或代理后重试。');
}

/** Official OvisOCR3 native-JSON adapter. This is NOT the DJX/DocTags model.
 * Requires real separately exported official OvisOCR3 ONNX weights and verification. */
export async function createAdapter({modelId, revision = 'main', onProgress = () => {}, runtime = {}} = {}) {
  requireNativeOnnxBundle(modelId);
  if (!navigator.gpu) throw new Error('浏览器没有提供 WebGPU，请使用支持 WebGPU 的 Chrome 或 Edge。');
  const gpu = await navigator.gpu.requestAdapter();
  if (!gpu) throw new Error('浏览器无法访问可用的 WebGPU 设备。');
  if (!gpu.features.has('shader-f16')) throw new Error('当前设备缺少半精度计算支持（shader-f16）。');
  const ortFile = 'onnxruntime-web@' + VERSIONS.ort + '/dist/ort.webgpu.bundle.min.mjs';
  const transformersFile = '@huggingface/transformers@' + VERSIONS.transformers + '/dist/transformers.web.min.js';
  const ortCandidates = uniqueUrls([runtime.ortUrl, ...CDN_BASES.map(base => base + ortFile)]);
  const {module: ort, url: ortUrl} = await importFirstAvailable(ortCandidates, 'ONNX Runtime WebGPU');
  ort.env.wasm.wasmPaths = runtime.wasmPaths ?? new URL('./', ortUrl).href;
  ort.env.wasm.numThreads = 1;

  const preferredBase = CDN_BASES.find(base => ortUrl.startsWith(base)) || CDN_BASES[0];
  const transformersCandidates = uniqueUrls([
    runtime.transformersUrl,
    ...[preferredBase, ...CDN_BASES].map(base => base + transformersFile),
  ]);
  const scopes = Object.fromEntries(transformersCandidates.map(url => [url, {
    'onnxruntime-web/webgpu': ortUrl, 'onnxruntime-common': ortUrl,
  }]));
  const imports = document.createElement('script');
  imports.type = 'importmap';
  imports.textContent = JSON.stringify({scopes});
  document.head.append(imports);
  const {module: lib} = await importFirstAvailable(transformersCandidates, 'Transformers.js');
  // Cache model and runtime assets across page reloads; retain the default cache key.
  lib.env.useBrowserCache = typeof globalThis.caches !== 'undefined';
  lib.env.useWasmCache = typeof globalThis.caches !== 'undefined';
  try { await navigator.storage?.persist?.(); } catch { /* Cache still works without persistent-storage permission. */ }
  if (runtime.modelHost) {
    lib.env.allowRemoteModels = true;
    lib.env.allowLocalModels = false;
    lib.env.remoteHost = runtime.modelHost;
    lib.env.remotePathTemplate = '{model}/';
    // A configured mirror must use the same browser cache.
  }
  const processor = await lib.AutoProcessor.from_pretrained(modelId, {
    revision, progress_callback: info => onProgress({...info, stage: 'processor'}),
  });
  const templateUrl = runtime.modelHost
    ? `${runtime.modelHost}${modelId}/chat_template.jinja`
    : `https://huggingface.co/${modelId}/resolve/${encodeURIComponent(revision)}/chat_template.jinja`;
  const template = await fetch(templateUrl);
  if (!template.ok) throw new Error(`加载对话模板失败：HTTP ${template.status}`);
  processor.tokenizer.chat_template = await template.text();
  const structuredPrompt = await fetchStructuredPrompt();
  const prompt = directPrompt(processor.tokenizer, structuredPrompt);
  const model = await lib.AutoModelForImageTextToText.from_pretrained(modelId, {
    revision, device: 'webgpu', dtype: {vision_encoder:'fp32',embed_tokens:'fp16',decoder_model_merged:'fp16'}, use_external_data_format: true,
    progress_callback: info => onProgress({...info, stage: 'model'}),
  });
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
        // RawImage.read accepts Blob/File directly; avoid exporting a potentially tainted Canvas.
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
          repetition_penalty: 1.0, eos_token_id: [248044, 248046],
          streamer, stopping_criteria: stopping,
        });
        const ids = generated.tolist()[0].slice(promptLength);
        const text = processor.tokenizer.decode(ids, {skip_special_tokens: true});
        const seconds = (performance.now() - prefill) / 1000;
        return {
          text, tokenIds: ids.map(Number), prompt, promptTokens: promptLength,
          promptIds,
          imageGrid: inputs.image_grid_thw.tolist().map(row => row.map(Number)),
          generatedTokens: ids.length, seconds, tokensPerSecond: ids.length / seconds,
          firstTokenSeconds: firstTokenAt === null ? null : (firstTokenAt-prefill)/1000,
          decodeTokensPerSecond: firstTokenAt === null || ids.length < 2 ? null : (ids.length-1)/((performance.now()-firstTokenAt)/1000),
          totalSeconds: (performance.now() - start) / 1000,
          ended: ids.length > 0 && [248044, 248046].includes(Number(ids.at(-1))),
          settings: config, postprocess: false,
        };
      } finally { busy = false; }
    },
  };
}

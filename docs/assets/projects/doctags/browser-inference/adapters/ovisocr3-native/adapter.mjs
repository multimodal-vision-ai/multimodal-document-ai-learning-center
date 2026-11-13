import {fetchBundleContract, directPrompt, modelFileUrl, ONNX_MODEL_ID, requireNativeOnnxBundle, validateSettings} from './contract.mjs';

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

/**
 * Stream generated token IDs without decoding the growing prefix on every step.
 * Transformers.js TextStreamer repeatedly decodes/copies its token cache; this
 * page only needs the final text, so a token-only streamer avoids that O(n²) work.
 */
export function createTokenOnlyStreamer(onTokens = () => {}) {
  let promptSeen = false;
  let ended = false;
  const tokenIds = [];
  return {
    put(value) {
      // Transformers.js calls put(prompt_ids) once before generation.
      if (!promptSeen) {
        promptSeen = true;
        return;
      }
      if (!Array.isArray(value) || value.length !== 1 || !Array.isArray(value[0])) {
        throw new TypeError("OvisOCR3 token streamer expects a single generated sequence.");
      }
      const next = value[0];
      for (const token of next) tokenIds.push(typeof token === "bigint" ? token : BigInt(token));
      if (next.length) onTokens(tokenIds.length, next);
    },
    end() { ended = true; },
    get tokenIds() { return tokenIds.slice(); },
    get tokenCount() { return tokenIds.length; },
    get ended() { return ended; },
  };
}

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a,b)=>a-b);
  return sorted[Math.min(sorted.length-1, Math.max(0, Math.ceil(p*sorted.length)-1))];
}

/**
 * Measure wall time spent inside each Transformers.js ONNX session.run call.
 * The wrapper does not inspect or modify tensors and is restored on dispose().
 */
export function createSessionProfiler(sessions, now = () => performance.now()) {
  const records = new Map();
  for (const [name, session] of Object.entries(sessions || {})) {
    const ownDescriptor = Object.getOwnPropertyDescriptor(session, "run");
    const originalRun = session?.run;
    const samples = [];
    let instrumented = false;
    if (typeof originalRun === "function") {
      const wrapped = async function(...args) {
        const started = now();
        try {
          return await originalRun.apply(this, args);
        } finally {
          if (samples.length < 20000) samples.push(Math.max(0, now()-started));
        }
      };
      try {
        Object.defineProperty(session, "run", {
          configurable: true, enumerable: false, writable: true, value: wrapped
        });
        instrumented = true;
      } catch { /* Keep inference working if a runtime seals its session object. */ }
    }
    records.set(name, {session, ownDescriptor, originalRun, samples, instrumented});
  }

  function summarize(record) {
    const values = record.samples;
    const totalMs = values.reduce((sum,x)=>sum+x,0);
    const subsequent = values.slice(1);
    const subsequentTotalMs = subsequent.reduce((sum,x)=>sum+x,0);
    const session = record.session;
    return {
      instrumented: record.instrumented,
      device: session?.config?.device ?? null,
      dtype: session?.config?.dtype ?? null,
      calls: values.length,
      totalMs,
      averageMs: values.length ? totalMs/values.length : null,
      minMs: values.length ? Math.min(...values) : null,
      maxMs: values.length ? Math.max(...values) : null,
      p50Ms: percentile(values,0.50),
      p95Ms: percentile(values,0.95),
      firstCallMs: values[0] ?? null,
      subsequentCalls: subsequent.length,
      subsequentTotalMs,
      subsequentAverageMs: subsequent.length ? subsequentTotalMs/subsequent.length : null,
      inputNames: Array.from(session?.inputNames ?? []),
      outputNames: Array.from(session?.outputNames ?? []),
    };
  }

  return {
    reset() {
      for (const record of records.values()) record.samples.length = 0;
    },
    snapshot() {
      const sessions = Object.fromEntries([...records].map(([name,record])=>[name,summarize(record)]));
      const vision = sessions.vision_encoder;
      const embedding = sessions.embed_tokens;
      const decoder = sessions.decoder_model_merged;
      return {
        sessions,
        phases: {
          visionEncoderMs: vision?.totalMs ?? null,
          embeddingFirstCallMs: embedding?.firstCallMs ?? null,
          embeddingSubsequentTotalMs: embedding?.subsequentTotalMs ?? null,
          decoderPrefillMs: decoder?.firstCallMs ?? null,
          decoderDecodeTotalMs: decoder?.subsequentTotalMs ?? null,
          decoderDecodeAverageMs: decoder?.subsequentAverageMs ?? null,
          decoderCalls: decoder?.calls ?? 0,
          totalSessionMs: Object.values(sessions).reduce((sum,item)=>sum+(item.totalMs||0),0),
        }
      };
    },
    restore() {
      for (const record of records.values()) {
        if (!record.instrumented) continue;
        try {
          if (record.ownDescriptor) Object.defineProperty(record.session,"run",record.ownDescriptor);
          else delete record.session.run;
        } catch { /* Disposal must not fail because profiling could not be restored. */ }
      }
    }
  };
}


/** Official OvisOCR3 native-JSON adapter. This is NOT the DJX/DocTags model.
 * Requires real separately exported official OvisOCR3 ONNX weights and verification. */
export async function createAdapter({modelId = ONNX_MODEL_ID, revision, onProgress = () => {}, runtime = {}} = {}) {
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
  const sharedMemoryAvailable = globalThis.crossOriginIsolated === true &&
    typeof globalThis.SharedArrayBuffer !== 'undefined';
  // ORT uses 0 for automatic thread selection. It is only effective when the
  // page is cross-origin isolated; otherwise stay at the portable single thread.
  ort.env.wasm.numThreads = sharedMemoryAvailable ? 0 : 1;
  if (runtime.diagnostics) {
    ort.env.logLevel = 'verbose';
    ort.env.debug = true;
    try { if (ort.env.webgpu) ort.env.webgpu.profiling = {mode:'default'}; } catch {}
  }

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
  if (runtime.diagnostics && lib.LogLevel?.DEBUG !== undefined) {
    lib.env.logLevel = lib.LogLevel.DEBUG;
  }
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
  // Validate the immutable ONNX commit and its provenance before any model
  // asset download; "main" and the official BF16 source repo are not accepted.
  const bundle = await fetchBundleContract({
    modelId, revision, modelHost: runtime.modelHost,
    fetcher: runtime.fetcher ?? fetch
  });
  const processor = await lib.AutoProcessor.from_pretrained(modelId, {
    revision, progress_callback: info => onProgress({...info, stage: 'processor'}),
  });
  const template = await (runtime.fetcher ?? fetch)(
    modelFileUrl(modelId, revision, "chat_template.jinja", runtime.modelHost)
  );
  if (!template.ok) throw new Error(`加载模型原始对话模板失败：HTTP ${template.status}`);
  processor.tokenizer.chat_template = await template.text();
  const prompt = directPrompt(processor.tokenizer, bundle.prompt);
  const generationResponse = await (runtime.fetcher ?? fetch)(
    modelFileUrl(modelId, revision, "generation_config.json", runtime.modelHost)
  );
  if (!generationResponse.ok) throw new Error(`加载官方生成配置失败：HTTP ${generationResponse.status}`);
  const generationConfig = await generationResponse.json();
  const eosTokenIds = Array.isArray(generationConfig.eos_token_id)
    ? generationConfig.eos_token_id.map(Number)
    : [Number(generationConfig.eos_token_id)];
  if (![248044, 248046].every(id => eosTokenIds.includes(id))) {
    throw new Error("ONNX 包的 EOS 配置与官方 OvisOCR3 不一致。");
  }
  const model = await lib.AutoModelForImageTextToText.from_pretrained(modelId, {
    revision, device: 'webgpu', dtype: {vision_encoder:'fp32',embed_tokens:'fp16',decoder_model_merged:'fp16'}, use_external_data_format: true,
    session_options: runtime.diagnostics ? {enableProfiling:true, logSeverityLevel:0} : {},
    progress_callback: info => onProgress({...info, stage: 'model'}),
  });
  const profiler = createSessionProfiler(model.sessions);
  const stopping = new lib.InterruptableStoppingCriteria();
  const textConfig = model.config?.text_config ?? model.config ?? {};
  const layerTypes = Array.isArray(textConfig.layer_types) ? textConfig.layer_types : [];
  const layerTypeCounts = layerTypes.reduce((out,type)=>{out[type]=(out[type]||0)+1;return out;},{});
  const runtimeDiagnostics = {
    diagnosticsMode: runtime.diagnostics === true,
    crossOriginIsolated: globalThis.crossOriginIsolated === true,
    sharedArrayBufferAvailable: typeof globalThis.SharedArrayBuffer !== 'undefined',
    hardwareConcurrency: Number(globalThis.navigator?.hardwareConcurrency)||null,
    wasmNumThreads: ort.env.wasm.numThreads,
    ortVersion: ort.env.versions?.web ?? VERSIONS.ort,
    transformersVersion: VERSIONS.transformers,
    sessions: Object.fromEntries(Object.entries(model.sessions).map(([name,session])=>[
      name,{device:session.config?.device??null,dtype:session.config?.dtype??null,
        inputNames:Array.from(session.inputNames??[]),outputNames:Array.from(session.outputNames??[])}
    ])),
    modelConfig: {
      modelType:model.config?.model_type??null,
      hiddenSize:textConfig.hidden_size??null,
      numHiddenLayers:textConfig.num_hidden_layers??layerTypes.length??null,
      layerTypeCounts
    }
  };
  let busy = false;
  let profilingEnded = false;
  return {
    modelId, revision, sourceModelId: bundle.metadata.source_model_id, sourceRevision: bundle.metadata.source_revision,
    versions: VERSIONS, gpu: gpu.info, runtimeDiagnostics,
    stop() { stopping.interrupt(); },
    async dispose() {
      if (busy) throw new Error('请先停止当前识别。');
      profiler.restore();
      await model.dispose();
    },
    async recognize(image, {onTokens = () => {}, ...settings} = {}) {
      if (busy) throw new Error('当前图片仍在识别中。');
      const config = validateSettings(settings);
      busy = true;
      stopping.reset();
      profiler.reset();
      const start = performance.now();
      let firstTokenAt = null;
      let lastTokenAt = null;
      const tokenIntervalPerTokenMs = [];
      let partialStreamer = null;
      try {
        processor.image_processor.min_pixels = config.minPixels;
        processor.image_processor.max_pixels = config.maxPixels;
        const rawReadStart = performance.now();
        // RawImage.read accepts Blob/File directly; avoid exporting a potentially tainted Canvas.
        const raw = image instanceof lib.RawImage ? image : await lib.RawImage.read(image);
        const rawImageReadMs = performance.now()-rawReadStart;
        const processorStart = performance.now();
        const inputs = await processor(prompt, raw);
        const processorMs = performance.now()-processorStart;
        const promptLength = inputs.input_ids.dims.at(-1);
        const promptIds = inputs.input_ids.tolist()[0].map(Number);
        const generationStart = performance.now();
        partialStreamer = createTokenOnlyStreamer((total,tokens)=>{
          const now = performance.now();
          if (firstTokenAt === null) firstTokenAt = now;
          else if (lastTokenAt !== null && tokens.length) {
            const interval = now-lastTokenAt;
            tokenIntervalPerTokenMs.push(...Array(tokens.length).fill(interval/tokens.length));
          }
          lastTokenAt = now;
          onTokens(total);
        });
        let generated;
        try {
          generated = await model.generate({
            ...inputs, max_new_tokens: config.maxNewTokens, do_sample: false,
            use_cache: true, repetition_penalty: 1.0, eos_token_id: eosTokenIds,
            streamer: partialStreamer, stopping_criteria: stopping,
          });
        } catch (error) {
          try {
            error.partialText = processor.tokenizer.decode(partialStreamer.tokenIds,{skip_special_tokens:true});
            error.partialTokenCount = partialStreamer.tokenCount;
          } catch {}
          throw error;
        }
        const generationMs = performance.now()-generationStart;
        const ids = generated.tolist()[0].slice(promptLength);
        const decodeStart = performance.now();
        const text = processor.tokenizer.decode(ids, {skip_special_tokens: true});
        const decodeTextMs = performance.now()-decodeStart;
        const totalMs = performance.now()-start;
        const sessionMetrics = profiler.snapshot();
        const sessionMs = sessionMetrics.phases.totalSessionMs;
        const tokenIntervalTotalMs = tokenIntervalPerTokenMs.reduce((sum,x)=>sum+x,0);
        const decodeTokensPerSecond = tokenIntervalTotalMs>0
          ? tokenIntervalPerTokenMs.length/(tokenIntervalTotalMs/1000) : null;
        if (runtime.diagnostics && !profilingEnded) {
          for (const session of Object.values(model.sessions)) {
            try { session.endProfiling?.(); } catch {}
          }
          profilingEnded = true;
        }
        const seconds = generationMs/1000;
        return {
          text, tokenIds: ids.map(Number), prompt, promptTokens: promptLength, promptIds,
          imageGrid: inputs.image_grid_thw.tolist().map(row=>row.map(Number)),
          inputSummary: {
            imageWidth:raw.width??null,imageHeight:raw.height??null,
            pixelValuesDims:inputs.pixel_values?.dims??null,
            inputIdsDims:inputs.input_ids?.dims??null
          },
          generatedTokens: ids.length, seconds, tokensPerSecond: ids.length/seconds,
          firstTokenSeconds: firstTokenAt===null?null:(firstTokenAt-generationStart)/1000,
          decodeTokensPerSecond,
          tokenIntervalMsP50:percentile(tokenIntervalPerTokenMs,0.50),
          tokenIntervalMsP95:percentile(tokenIntervalPerTokenMs,0.95),
          totalSeconds:totalMs/1000,
          timings: {
            rawImageReadMs,processorMs,generationMs,decodeTextMs,totalMs,
            sessionMs,generationNonSessionMs:Math.max(0,generationMs-sessionMs)
          },
          sessionMetrics,
          runtimeDiagnostics,
          streamerType:"token-only-no-incremental-decode",
          streamerTokenCount:partialStreamer.tokenCount,
          streamerEnded:partialStreamer.ended,
          ended: ids.length>0 && eosTokenIds.includes(Number(ids.at(-1))),
          settings:config,postprocess:false,
        };
      } finally { busy = false; }
    },
  };
}

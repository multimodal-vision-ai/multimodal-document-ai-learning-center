const DEFAULT_REVISION = "09f034d04e5a26620124e4b80923ffc2ec5899c7";
const DEFAULT_FILE = "embed_tokens_fp16.onnx_data";
const DEFAULT_CHUNK_BYTES = 32 * 1024 * 1024;
const DEFAULT_CONCURRENCY = 3;
const DEFAULT_STREAM_BYTES = 1024 * 1024;

function getRequestUrl(input) {
  if (typeof input === "string" || input instanceof URL) return String(input);
  if (input && typeof input.url === "string") return input.url;
  return String(input);
}

function getRequestHeaders(input, init) {
  const headers = new Headers();
  if (typeof Request !== "undefined" && input instanceof Request) {
    new Headers(input.headers).forEach((value, key) => headers.set(key, value));
  }
  if (init && init.headers) {
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  }
  return headers;
}

function parseContentRange(value) {
  const match = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(value || "");
  if (!match) return null;
  return {start: Number(match[1]), end: Number(match[2]), total: Number(match[3])};
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      reject(signal.reason || new Error("下载已取消。"));
      return;
    }
    const timer = setTimeout(done, ms);
    function done() {
      if (signal) signal.removeEventListener("abort", abort);
      resolve();
    }
    function abort() {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      reject(signal.reason || new Error("下载已取消。"));
    }
    if (signal) signal.addEventListener("abort", abort, {once: true});
  });
}

function emit(onEvent, event) {
  try { onEvent(event); } catch { /* Diagnostics must not interrupt model loading. */ }
}

export const RANGE_CACHE_NAME = "mvai-wc2b-range-v1-" + DEFAULT_REVISION;

/**
 * Wrap Transformers.js env.fetch for the WC-2B embedding file only.
 * The wrapper returns a normal 200 Response whose body streams ordered bytes
 * from verified HTTP 206 ranges. Transformers.js therefore keeps its standard
 * ONNX loading and full-file Cache Storage behavior.
 */
export function createRangeFetch(options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch.bind(globalThis);
  const cacheStorage = options.cacheStorage === undefined ? globalThis.caches : options.cacheStorage;
  const modelId = options.modelId || "multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags-ONNX";
  const revision = options.revision || DEFAULT_REVISION;
  const fileName = options.fileName || DEFAULT_FILE;
  const chunkBytes = options.chunkBytes || DEFAULT_CHUNK_BYTES;
  const concurrency = options.concurrency || DEFAULT_CONCURRENCY;
  const streamBytes = options.streamBytes || DEFAULT_STREAM_BYTES;
  const retries = options.retries === undefined ? 3 : options.retries;
  const retryDelayMs = options.retryDelayMs === undefined ? 600 : options.retryDelayMs;
  const onEvent = options.onEvent || (() => {});
  const origin = options.origin || (globalThis.location && globalThis.location.origin) || "https://localhost";
  const cacheName = options.cacheName || ("mvai-wc2b-range-v1-" + revision);
  const knownSizes = new Map();
  let cachePromise = null;
  let lastFullRequestUrl = null;

  if (!Number.isSafeInteger(chunkBytes) || chunkBytes <= 0) throw new Error("chunkBytes 必须为正整数。");
  if (!Number.isSafeInteger(concurrency) || concurrency <= 0) throw new Error("concurrency 必须为正整数。");
  if (!Number.isSafeInteger(streamBytes) || streamBytes <= 0) throw new Error("streamBytes 必须为正整数。");

  function isTarget(url) {
    try {
      const parsed = new URL(url);
      return parsed.pathname.endsWith("/onnx/" + fileName);
    } catch {
      return false;
    }
  }

  function urlKey(url) {
    const parsed = new URL(url);
    return parsed.origin + parsed.pathname;
  }

  async function getSegmentCache() {
    if (!cacheStorage || typeof cacheStorage.open !== "function") return null;
    if (!cachePromise) cachePromise = cacheStorage.open(cacheName).catch(() => null);
    return cachePromise;
  }

  function segmentRequest(index) {
    const path = "/__mvai_range_cache__/" + encodeURIComponent(modelId) + "/" +
      encodeURIComponent(revision) + "/" + encodeURIComponent(fileName) + "/" + index;
    return new Request(new URL(path, origin).href);
  }

  async function probeSize(input, init, url) {
    const headers = getRequestHeaders(input, init);
    headers.set("Range", "bytes=0-0");
    const response = await fetchImpl(url, {...init, method: "GET", headers, cache: "no-store"});
    const range = parseContentRange(response.headers.get("content-range"));
    try { await response.body?.cancel(); } catch { /* Ignore an already-closed probe body. */ }
    if (response.status !== 206 || !range || range.start !== 0 || range.end !== 0 || range.total <= 0) {
      throw new Error("WC-2B 文件大小探测失败：服务器未返回有效的 HTTP 206 Content-Range。");
    }
    knownSizes.set(urlKey(url), range.total);
    return range.total;
  }

  async function readCachedChunk(cache, index, expectedLength) {
    if (!cache) return null;
    const key = segmentRequest(index);
    try {
      const response = await cache.match(key);
      if (!response) return null;
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength === expectedLength) {
        emit(onEvent, {type: "cache-hit", index, bytes: bytes.byteLength});
        return bytes;
      }
      await cache.delete(key);
    } catch {
      /* A cache read failure is treated as a miss; the CDN copy is still available. */
    }
    return null;
  }

  async function writeCachedChunk(cache, index, bytes) {
    if (!cache) return;
    try {
      await cache.put(segmentRequest(index), new Response(bytes.slice(), {
        headers: {"Content-Type": "application/octet-stream", "Content-Length": String(bytes.byteLength)}
      }));
    } catch (error) {
      emit(onEvent, {type: "cache-write-skipped", index, message: String(error && error.message || error)});
    }
  }

  async function fetchChunk(url, init, signal, cache, total, index, totalChunks) {
    const start = index * chunkBytes;
    const end = Math.min(total - 1, start + chunkBytes - 1);
    const expectedLength = end - start + 1;
    const cached = await readCachedChunk(cache, index, expectedLength);
    if (cached) return cached;

    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (signal.aborted) throw signal.reason || new Error("下载已取消。");
      try {
        const headers = getRequestHeaders(url, init);
        headers.set("Range", "bytes=" + start + "-" + end);
        const response = await fetchImpl(url, {
          ...init,
          method: "GET",
          headers,
          cache: "no-store",
          signal
        });

        if (response.status !== 206) {
          try { await response.body?.cancel(); } catch { /* Ignore response cleanup errors. */ }
          const error = new Error("HTTP " + response.status + "，请求范围 bytes=" + start + "-" + end);
          error.retryable = response.status === 403 || response.status === 408 ||
            response.status === 425 || response.status === 429 || response.status >= 500;
          throw error;
        }

        const range = parseContentRange(response.headers.get("content-range"));
        if (!range || range.start !== start || range.end !== end || range.total !== total) {
          try { await response.body?.cancel(); } catch { /* Ignore response cleanup errors. */ }
          const error = new Error("Content-Range 不匹配，请求 bytes=" + start + "-" + end);
          error.retryable = false;
          throw error;
        }

        const declaredLength = Number(response.headers.get("content-length"));
        if (Number.isFinite(declaredLength) && declaredLength > 0 && declaredLength !== expectedLength) {
          try { await response.body?.cancel(); } catch { /* Ignore response cleanup errors. */ }
          throw new Error("分片 Content-Length 不匹配，请求 bytes=" + start + "-" + end);
        }

        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.byteLength !== expectedLength) {
          throw new Error("分片字节数不完整：收到 " + bytes.byteLength + "，预期 " + expectedLength);
        }

        await writeCachedChunk(cache, index, bytes);
        emit(onEvent, {type: "range-done", index, totalChunks, start, end, bytes: bytes.byteLength, attempt});
        return bytes;
      } catch (error) {
        if (signal.aborted) throw signal.reason || error;
        lastError = error;
        if (error && error.retryable === false) break;
        if (attempt < retries) {
          emit(onEvent, {type: "range-retry", index, totalChunks, start, end, attempt: attempt + 1,
            message: String(error && error.message || error)});
          await sleep(retryDelayMs * Math.pow(2, attempt), signal);
        }
      }
    }

    throw new Error("WC-2B 分段下载失败：bytes " + start + "-" + end +
      "；已尝试 " + (retries + 1) + " 次。原因：" + String(lastError && lastError.message || lastError));
  }

  async function createSegmentedResponse(url, init, total) {
    const cache = await getSegmentCache();
    const totalChunks = Math.ceil(total / chunkBytes);
    const controller = new AbortController();
    const externalSignal = init && init.signal;
    let externalAbort = null;
    if (externalSignal) {
      externalAbort = () => controller.abort(externalSignal.reason || new Error("下载已取消。"));
      if (externalSignal.aborted) externalAbort();
      else externalSignal.addEventListener("abort", externalAbort, {once: true});
    }

    const inFlight = new Map();
    let nextSchedule = 0;
    let nextEmit = 0;
    let currentBytes = null;
    let currentOffset = 0;
    let closed = false;

    function cleanupSignal() {
      if (externalSignal && externalAbort) externalSignal.removeEventListener("abort", externalAbort);
    }

    function schedule() {
      while (!controller.signal.aborted && inFlight.size < concurrency && nextSchedule < totalChunks) {
        const index = nextSchedule++;
        const task = fetchChunk(url, init || {}, controller.signal, cache, total, index, totalChunks)
          .then(value => ({value}), error => ({error}));
        inFlight.set(index, task);
      }
    }

    const body = new ReadableStream({
      async pull(streamController) {
        if (closed) return;
        try {
          if (controller.signal.aborted) throw controller.signal.reason || new Error("下载已取消。");
          if (currentBytes === null) {
            if (nextEmit >= totalChunks) {
              closed = true;
              streamController.close();
              cleanupSignal();
              return;
            }
            schedule();
            const pending = inFlight.get(nextEmit);
            if (!pending) throw new Error("分段下载任务队列异常，缺少分片 " + nextEmit);
            const outcome = await pending;
            inFlight.delete(nextEmit);
            if (outcome.error) throw outcome.error;
            currentBytes = outcome.value;
            currentOffset = 0;
          }

          const stop = Math.min(currentOffset + streamBytes, currentBytes.byteLength);
          streamController.enqueue(currentBytes.subarray(currentOffset, stop));
          currentOffset = stop;

          if (currentOffset >= currentBytes.byteLength) {
            currentBytes = null;
            currentOffset = 0;
            nextEmit++;
            schedule();
            if (nextEmit >= totalChunks) {
              closed = true;
              streamController.close();
              cleanupSignal();
            }
          }
        } catch (error) {
          closed = true;
          controller.abort(error);
          cleanupSignal();
          streamController.error(error);
        }
      },
      cancel(reason) {
        closed = true;
        controller.abort(reason || new Error("下载已取消。"));
        cleanupSignal();
      }
    });

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(total),
        "X-MVAI-Download-Mode": "http-range"
      }
    });
  }

  const wrappedFetch = async function(input, init = {}) {
    const url = getRequestUrl(input);
    if (!isTarget(url)) return fetchImpl(input, init);

    const headers = getRequestHeaders(input, init);
    const rangeHeader = headers.get("range");
    if (rangeHeader) {
      const response = await fetchImpl(input, init);
      if (rangeHeader.trim() === "bytes=0-0" && response.status === 206) {
        const range = parseContentRange(response.headers.get("content-range"));
        if (range && range.total > 0) knownSizes.set(urlKey(url), range.total);
      }
      return response;
    }

    lastFullRequestUrl = url;
    const key = urlKey(url);
    const total = knownSizes.get(key) || await probeSize(input, init, url);
    emit(onEvent, {type: "range-start", file: fileName, totalBytes: total,
      chunkBytes, concurrency, totalChunks: Math.ceil(total / chunkBytes)});
    return createSegmentedResponse(url, init, total);
  };

  wrappedFetch.clearCache = async () => {
    if (!cacheStorage || typeof cacheStorage.delete !== "function") return false;
    return cacheStorage.delete(cacheName);
  };

  wrappedFetch.cleanupIfCached = async (remote = {}) => {
    if (!cacheStorage || typeof cacheStorage.match !== "function") return false;
    try {
      let fullUrl = lastFullRequestUrl;
      if (!fullUrl) {
        const host = remote.remoteHost || "https://huggingface.co/";
        const template = remote.remotePathTemplate || "{model}/resolve/{revision}/";
        const modelPath = template.replaceAll("{model}", modelId)
          .replaceAll("{revision}", encodeURIComponent(revision));
        const base = host.endsWith("/") ? host : host + "/";
        fullUrl = new URL(modelPath.replace(/^\/+/, "").replace(/\/*$/, "/") +
          "onnx/" + fileName, base).href;
      }
      const full = await cacheStorage.match(fullUrl);
      if (!full) return false;
      const size = Number(full.headers.get("content-length"));
      const expected = knownSizes.get(urlKey(fullUrl));
      if (!Number.isFinite(size) || size <= 0 || (expected && size !== expected)) return false;
      return await cacheStorage.delete(cacheName);
    } catch {
      return false;
    }
  };

  wrappedFetch.cacheName = cacheName;
  return wrappedFetch;
}

export async function clearRangeCache(options = {}) {
  const cacheStorage = options.cacheStorage === undefined ? globalThis.caches : options.cacheStorage;
  const revision = options.revision || DEFAULT_REVISION;
  if (!cacheStorage || typeof cacheStorage.delete !== "function") return false;
  return cacheStorage.delete(options.cacheName || ("mvai-wc2b-range-v1-" + revision));
}

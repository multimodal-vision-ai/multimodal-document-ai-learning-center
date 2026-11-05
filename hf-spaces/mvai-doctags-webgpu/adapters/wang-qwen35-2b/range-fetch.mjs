/** Optional transport for this adapter's loopback preview; never changes model bytes. */
export function createRangeFetcher({baseUrl, fetchImpl = globalThis.fetch.bind(globalThis),
  cacheStorage = globalThis.caches, chunkSize = 16 * 1024 * 1024,
  attempts = 4, retryDelay = 500, timeoutMs = 45000, onNotice = () => {}}) {
  const root = new AbortController();
  let queue = Promise.resolve(), cachePromise;
  const serial = task => {
    const result = queue.then(task);
    queue = result.catch(() => {});
    return result;
  };
  const notice = message => onNotice({status: 'notice', message});
  const fail = message => Object.assign(new Error(message), {retryable: false});
  async function retry(task, signal, label) {
    for (let attempt = 1; ; attempt++) {
      signal.throwIfAborted();
      try { return await task(AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])); }
      catch (error) {
        signal.throwIfAborted();
        if (error.retryable === false || attempt >= attempts) {
          const failure = new Error(`${label} 失败（尝试 ${attempt} 次）：${error.message}`, {cause: error});
          notice(failure.message);
          throw failure;
        }
        notice(`${label} 连接中断，重试 ${attempt}/${attempts - 1}`);
        await new Promise((resolve, reject) => {
          const done = () => { signal.removeEventListener('abort', abort); resolve(); };
          const timer = setTimeout(done, Math.min(retryDelay * 2 ** (attempt - 1), 3000));
          const abort = () => { clearTimeout(timer); reject(signal.reason); };
          signal.addEventListener('abort', abort, {once: true});
        });
      }
    }
  }
  function checkStatus(response, expected) {
    if (response.status === expected) return;
    response.body?.cancel().catch(() => {});
    const error = new Error(`HTTP ${response.status}，预期 ${expected}`);
    error.retryable = [408, 429].includes(response.status) || response.status >= 500;
    throw error;
  }
  async function getCache() {
    if (!cachePromise) cachePromise = cacheStorage
      ? cacheStorage.open('wang-onnx-ranges-v1').catch(() => {
        notice('浏览器分段缓存不可用，将继续下载。'); return null;
      }) : Promise.resolve(null);
    return cachePromise;
  }
  async function rangeFetch(input, init) {
    const request = new Request(input, init);
    const url = new URL(request.url);
    if (request.method !== 'GET' || request.headers.has('Range') ||
        !url.href.startsWith(baseUrl) || !url.pathname.endsWith('.onnx_data')) {
      return fetchImpl(input, init);
    }
    const local = new AbortController();
    const signal = AbortSignal.any([root.signal, request.signal, local.signal]);
    const name = decodeURIComponent(url.pathname.split('/').at(-1));
    const head = await retry(async signal => {
      const response = await fetchImpl(request, {method: 'HEAD', signal, cache: 'no-store'});
      checkStatus(response, 200);
      return response;
    }, signal, `${name} 文件信息`);
    const total = Number(head.headers.get('Content-Length'));
    const version = head.headers.get('ETag');
    if (!Number.isSafeInteger(total) || total <= 0 || !version ||
        head.headers.get('Accept-Ranges') !== 'bytes') {
      throw fail(`${name} 服务端缺少文件大小、ETag 或 Range 支持，请重启预览服务。`);
    }
    let offset = 0;
    const body = new ReadableStream({
      async pull(controller) {
        try {
          signal.throwIfAborted();
          const start = offset, end = Math.min(start + chunkSize, total) - 1;
          const key = new URL(url);
          key.searchParams.set('wang-range', `${version}:${start}-${end}`);
          let data;
          const cache = await getCache();
          if (cache) {
            try {
              const cached = await cache.match(key.href);
              if (cached) {
                const bytes = await cached.arrayBuffer();
                if (bytes.byteLength === end - start + 1) data = bytes;
                else await cache.delete(key.href);
              }
            } catch { /* Cache failures must not prevent network loading. */ }
          }
          if (!data) {
            data = await serial(() => retry(async signal => {
              const headers = new Headers(request.headers);
              headers.set('Range', `bytes=${start}-${end}`);
              headers.set('If-Range', version);
              const response = await fetchImpl(request, {headers, signal, cache: 'no-store'});
              checkStatus(response, 206);
              if (response.headers.get('Content-Range') !== `bytes ${start}-${end}/${total}` ||
                  response.headers.get('ETag') !== version) {
                await response.body?.cancel();
                throw fail('文件版本或分段范围变化，请刷新页面重新加载。');
              }
              const bytes = await response.arrayBuffer();
              if (bytes.byteLength !== end - start + 1) throw new Error('分段传输不完整');
              return bytes;
            }, signal, `${name} 字节 ${start}-${end}`));
            if (cache) {
              try {
                // CacheStorage rejects HTTP 206; store the completed chunk as 200.
                await cache.put(key.href, new Response(data, {headers: {'Content-Length': String(data.byteLength)}}));
              } catch {
                cachePromise = Promise.resolve(null);
                notice('浏览器缓存空间不足或写入失败；继续下载，本次未缓存的分段下次需重传。');
              }
            }
          }
          signal.throwIfAborted();
          controller.enqueue(new Uint8Array(data));
          offset = end + 1;
          if (offset === total) controller.close();
        } catch (error) { controller.error(error); }
      },
      cancel(reason) { local.abort(reason); },
    }, {highWaterMark: 0});
    notice(`${name}：16 MiB 分段下载，已完成分段可在重试时复用。`);
    const headers = new Headers(head.headers);
    headers.delete('Content-Encoding');
    return new Response(body, {status: 200, headers});
  }
  return {fetch: rangeFetch, close() { root.abort(); }};
}

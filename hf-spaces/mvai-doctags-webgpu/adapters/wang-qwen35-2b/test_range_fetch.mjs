import test from 'node:test';
import assert from 'node:assert/strict';
import {createRangeFetcher} from './range-fetch.mjs';

const baseUrl = 'http://localhost/local-model/checkpoint/';
const url = baseUrl + 'onnx/fixture.onnx_data';
const bytes = Uint8Array.from({length: 53}, (_, i) => i * 3);
class MemoryCache {
  entries = new Map();
  async match(key) { return this.entries.get(key)?.clone(); }
  async put(key, response) { this.entries.set(key, response.clone()); }
  async delete(key) { this.entries.delete(key); }
}
function fixture({failOnce = false, alwaysFail = false, wrongRange = false,
  version = '"fixture-v1"', cache = new MemoryCache()} = {}) {
  const ranges = [], notices = [];
  let active = 0, maxActive = 0;
  const fetchImpl = async (input, init) => {
    const request = new Request(input, init);
    const headers = {'Content-Length': String(bytes.length), 'ETag': version, 'Accept-Ranges': 'bytes'};
    if (request.method === 'HEAD') return new Response(null, {headers});
    if (!request.headers.has('Range')) return new Response('passthrough');
    const range = request.headers.get('Range'); ranges.push(range);
    const [, start, end] = range.match(/bytes=(\d+)-(\d+)/).map(Number);
    active++; maxActive = Math.max(maxActive, active);
    await new Promise(resolve => setTimeout(resolve, 2)); active--;
    if (alwaysFail || (failOnce && ranges.length === 2)) {
      // A response can start successfully and fail while reading its body.
      return new Response(new ReadableStream({start(controller) {controller.error(new TypeError('network error'));}}), {
        status: 206, headers: {...headers, 'Content-Range': `bytes ${start}-${end}/${bytes.length}`},
      });
    }
    const data = bytes.slice(start, end + 1);
    return new Response(data, {status: 206, headers: {...headers, 'Content-Length': String(data.length),
      'Content-Range': wrongRange ? 'bytes 9-10/53' : `bytes ${start}-${end}/${bytes.length}`}});
  };
  const loader = createRangeFetcher({baseUrl, chunkSize: 16, retryDelay: 0, attempts: 3,
    fetchImpl, cacheStorage: {open: async () => cache}, onNotice: n => notices.push(n.message)});
  return {loader, ranges, notices, cache, get maxActive() {return maxActive;}};
}

test('retries a broken response body at the same offset, preserving every byte', async () => {
  const f = fixture({failOnce: true});
  assert.deepEqual(new Uint8Array(await (await f.loader.fetch(url)).arrayBuffer()), bytes);
  assert.deepEqual(f.ranges, ['bytes=0-15', 'bytes=16-31', 'bytes=16-31', 'bytes=32-47', 'bytes=48-52']);
  assert.ok(f.notices.some(n => n.includes('重试')));
  f.loader.close();
});

test('completed chunks survive cancellation and a fresh loader resumes from cache', async () => {
  const first = fixture();
  const reader = (await first.loader.fetch(url)).body.getReader();
  assert.deepEqual((await reader.read()).value, bytes.slice(0, 16));
  await reader.cancel(); first.loader.close();
  const second = fixture({cache: first.cache});
  assert.deepEqual(new Uint8Array(await (await second.loader.fetch(url)).arrayBuffer()), bytes);
  assert.deepEqual(second.ranges, ['bytes=16-31', 'bytes=32-47', 'bytes=48-52']);
  second.loader.close();
});

test('parallel files use one range connection at a time', async () => {
  const f = fixture();
  const responses = await Promise.all([f.loader.fetch(url), f.loader.fetch(url.replace('fixture', 'other'))]);
  const outputs = await Promise.all(responses.map(r => r.arrayBuffer()));
  for (const output of outputs) assert.deepEqual(new Uint8Array(output), bytes);
  assert.equal(f.maxActive, 1); f.loader.close();
});

test('a changed ETag invalidates chunks from the previous model version', async () => {
  const first = fixture();
  await (await first.loader.fetch(url)).arrayBuffer(); first.loader.close();
  const changed = fixture({cache: first.cache, version: '"fixture-v2"'});
  assert.deepEqual(new Uint8Array(await (await changed.loader.fetch(url)).arrayBuffer()), bytes);
  assert.equal(changed.ranges.length, 4); changed.loader.close();
});

test('persistent network failure stops after bounded attempts with file and range', async () => {
  const f = fixture({alwaysFail: true});
  await assert.rejects(async () => (await f.loader.fetch(url)).arrayBuffer(), /fixture.onnx_data 字节 0-15 失败（尝试 3 次）/);
  assert.equal(f.ranges.length, 3); f.loader.close();
});

test('rejects changed range metadata without feeding corrupt bytes to the model', async () => {
  const f = fixture({wrongRange: true});
  await assert.rejects(async () => (await f.loader.fetch(url)).arrayBuffer(), /文件版本或分段范围变化/);
  assert.equal(f.ranges.length, 1); f.loader.close();
});

test('closing a load aborts pending reads; unrelated requests pass through', async () => {
  const f = fixture();
  assert.equal(await (await f.loader.fetch(baseUrl + 'config.json')).text(), 'passthrough');
  const response = await f.loader.fetch(url);
  f.loader.close();
  await assert.rejects(() => response.arrayBuffer(), {name: 'AbortError'});
});

test('quota failures disable chunk writes without breaking the download', async () => {
  const cache = new MemoryCache(); cache.put = async () => {throw new Error('quota');};
  const f = fixture({cache});
  assert.deepEqual(new Uint8Array(await (await f.loader.fetch(url)).arrayBuffer()), bytes);
  assert.ok(f.notices.some(n => n.includes('缓存空间不足'))); f.loader.close();
});

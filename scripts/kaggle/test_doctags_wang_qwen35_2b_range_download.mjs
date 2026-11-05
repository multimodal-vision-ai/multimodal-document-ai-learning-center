"use strict";
import assert from "node:assert/strict";
import {createRangeFetch, RANGE_CACHE_NAME} from "../../docs/assets/projects/doctags/browser-inference/adapters/wang-qwen35-2b/range-download.mjs";

const total = 100;
const original = Uint8Array.from({length: total}, (_, index) => index);
const cacheMap = new Map();
const cacheStorage = {
  async open(name) {
    if (!cacheMap.has(name)) {
      const entries = new Map();
      cacheMap.set(name, {
        async match(key) {
          const response = entries.get(String(key.url || key));
          return response ? response.clone() : undefined;
        },
        async put(key, response) {
          entries.set(String(key.url || key), response.clone());
        },
        async delete(key) {
          return entries.delete(String(key.url || key));
        },
        async keys() {
          return [...entries.keys()].map(url => new Request(url));
        }
      });
    }
    return cacheMap.get(name);
  },
  async match(key) {
    const url = String(key.url || key);
    for (const cache of cacheMap.values()) {
      const response = await cache.match(url);
      if (response) return response;
    }
    return undefined;
  },
  async delete(name) {
    return cacheMap.delete(name);
  }
};

const calls = new Map();
async function fakeFetch(input, init = {}) {
  const headers = new Headers(init.headers);
  const value = headers.get("range");
  assert.ok(value, "all test requests must use HTTP Range");
  const match = /^bytes=(\d+)-(\d+)$/.exec(value);
  assert.ok(match, "Range header must be a single byte range");
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (start === 0 && end === 0) {
    return new Response(original.slice(0, 1), {
      status: 206,
      headers: {"Content-Range": "bytes 0-0/" + total, "Content-Length": "1"}
    });
  }

  const key = start + "-" + end;
  calls.set(key, (calls.get(key) || 0) + 1);
  if (start === 32 && calls.get(key) === 1) throw new TypeError("simulated connection closed");

  return new Response(original.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Content-Length": String(end - start + 1)
    }
  });
}

const url = "https://huggingface.co/multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags-ONNX/resolve/" +
  "09f034d04e5a26620124e4b80923ffc2ec5899c7/onnx/embed_tokens_fp16.onnx_data";
const rangeFetch = createRangeFetch({
  fetchImpl: fakeFetch,
  cacheStorage,
  origin: "https://learning-center.example",
  chunkBytes: 32,
  concurrency: 2,
  streamBytes: 7,
  retries: 2,
  retryDelayMs: 0
});

const metadata = await rangeFetch(url, {headers: {Range: "bytes=0-0"}});
assert.equal(metadata.status, 206);
await metadata.arrayBuffer();

const response = await rangeFetch(url);
assert.equal(response.status, 200);
assert.equal(Number(response.headers.get("content-length")), total);
const actual = new Uint8Array(await response.arrayBuffer());
assert.deepEqual(actual, original);
assert.equal(calls.get("32-63"), 2, "a failed range must be retried once");
assert.equal(calls.size, 4, "all four ranges must be fetched");

const secondCalls = new Map();
async function secondFetch(input, init = {}) {
  const range = new Headers(init.headers).get("range");
  const match = /^bytes=(\d+)-(\d+)$/.exec(range || "");
  if (match && match[1] !== "0") {
    const key = match[1] + "-" + match[2];
    secondCalls.set(key, (secondCalls.get(key) || 0) + 1);
  }
  return fakeFetch(input, init);
}
const resumed = createRangeFetch({
  fetchImpl: secondFetch,
  cacheStorage,
  origin: "https://learning-center.example",
  chunkBytes: 32,
  concurrency: 2,
  streamBytes: 11,
  retries: 1,
  retryDelayMs: 0
});
const secondMetadata = await resumed(url, {headers: {Range: "bytes=0-0"}});
await secondMetadata.arrayBuffer();
const resumedResponse = await resumed(url);
assert.deepEqual(new Uint8Array(await resumedResponse.arrayBuffer()), original);
assert.equal(secondCalls.size, 0, "a second load must reuse all persisted range chunks");

assert.equal(await rangeFetch.clearCache(), true);
assert.equal(cacheMap.has(RANGE_CACHE_NAME), false);
console.log("WC-2B Range download tests: 206 validation, ordered streaming, retry and persistent chunk reuse PASS");

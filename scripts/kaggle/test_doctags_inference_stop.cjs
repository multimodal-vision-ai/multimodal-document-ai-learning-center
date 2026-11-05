"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
const docs = path.join(root, "docs/assets/projects/doctags/browser-inference");
const html = fs.readFileSync(path.join(docs, "index.html"), "utf8");
const spaceHtml = fs.readFileSync(path.join(root, "hf-spaces/mvai-doctags-webgpu/index.html"), "utf8");
assert.equal(html, spaceHtml, "Learning Center and HF Space inference pages must stay byte-identical");
assert.match(html, /<button class="stop-action" id="stop" type="button" hidden disabled>终止推理<\/button>/);
const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, "inference module script must exist");
assert.match(scriptMatch[1], /InterruptableStoppingCriteria/);
assert.match(scriptMatch[1], /stopping_criteria:graniteStopping/);
assert.match(scriptMatch[1], /activeStop=adapter\?\(\)=>adapter\.stop\(\):\(\)=>graniteStopping\.interrupt\(\)/);
assert.match(scriptMatch[1], /const completedNormally=ended&&!stopRequested/);
assert.match(scriptMatch[1], /if\(completedNormally\)\{/);
assert.match(scriptMatch[1], /已终止推理 · 当前输出不完整/);
for (const relative of [
  "adapters/r3-ovisocr3/adapter.mjs",
  "adapters/wang-qwen35-2b/adapter.mjs"
]) {
  const source = fs.readFileSync(path.join(docs, relative), "utf8");
  assert.match(source, /stop\(\)\s*\{\s*stopping\.interrupt\(\);\s*\}/, relative + " must expose stop()");
}
console.log("Manual inference stop contract: UI visibility, Granite criteria, both self-built adapters, partial-output handling and HF mirror PASS");

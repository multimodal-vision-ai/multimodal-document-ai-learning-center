import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createRequire} from "node:module";

const require=createRequire(import.meta.url);
const registry=require("../model-registry.js");
const read=relative=>readFile(new URL(relative,import.meta.url),"utf8");

test("both accepted native models are registered with immutable model revisions",()=>{
  assert.equal(registry.getAll({getItem:()=>null}).length,5);
  assert.equal(registry.OVIS_NATIVE.id,"multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX");
  assert.equal(registry.OVIS_NATIVE.adapter,"ovisocr3-native");
  assert.equal(registry.OVIS_NATIVE.revision,"de391cb93aa2ee1b67692bdba1b143bf8e4a9f98");
  assert.equal(registry.OVIS_NATIVE.parameterCount,"0.8B 参数");
  assert.equal(registry.PADDLE_NATIVE.id,"glebkudr/PaddleOCR-VL-1.6-WebGPU");
  assert.equal(registry.PADDLE_NATIVE.adapter,"paddleocr-vl-1.6");
  assert.equal(registry.PADDLE_NATIVE.revision,"5219606297d00bbd23b2ec193271af0c0b427dfc");
  assert.equal(registry.PADDLE_NATIVE.parameterCount,"0.9B 参数");
});

test("HF Space and Learning Center production pages and model registries are byte-identical",async()=>{
  const [spaceIndex,docsIndex,spaceRegistry,docsRegistry,spaceNative,docsNative,spaceRenderer,docsRenderer]=await Promise.all([
    read("../index.html"),
    read("../../../docs/assets/projects/doctags/browser-inference/index.html"),
    read("../model-registry.js"),
    read("../../../docs/assets/projects/doctags/browser-inference/model-registry.js"),
    read("../native-document-output.js"),
    read("../../../docs/assets/projects/doctags/browser-inference/native-document-output.js"),
    read("../native-result-renderer.js"),
    read("../../../docs/assets/projects/doctags/browser-inference/native-result-renderer.js")
  ]);
  assert.equal(spaceIndex,docsIndex);
  assert.equal(spaceRegistry,docsRegistry);
  assert.equal(spaceNative,docsNative);
  assert.equal(spaceRenderer,docsRenderer);
});

test("production UI loads native parsers and routes each model through its dedicated adapter",async()=>{
  const html=await read("../index.html");
  assert.match(html,/native-document-output\.js\?v=native-ocr-/);
  assert.match(html,/native-result-renderer\.js\?v=native-ocr-/);
  assert.match(html,/import\("\.\/adapters\/ovisocr3-native\/adapter\.mjs"\)/);
  assert.match(html,/import\("\.\/adapters\/paddleocr-vl-1\.6\/adapter\.mjs"\)/);
  assert.match(html,/maxPixels:1024\*1024/);
  assert.match(html,/nativeCore\.parseOvis/);
  assert.match(html,/nativeCore\.parsePaddle/);
  assert.match(html,/nativeRenderer\.renderBlocks/);
  assert.match(html,/nativeRenderer\.renderBoxes/);
  assert.match(html,/outputFormat:nativeOutputFormat\|\|"doctags"/);
  assert.match(html,/value\.outputFormat==="ovisocr3-native"/);
  assert.match(html,/下载原生 JSON/);
  assert.match(html,/sourceImageWidth=bitmap\.width/);
  assert.match(html,/sourceImageHeight=bitmap\.height/);
});

test("native adapter, contract and Paddle worker resources are mirrored to the public Space",async()=>{
  const files=[
    ["../adapters/ovisocr3-native/adapter.mjs","../../../docs/assets/projects/doctags/browser-inference/adapters/ovisocr3-native/adapter.mjs"],
    ["../adapters/ovisocr3-native/contract.mjs","../../../docs/assets/projects/doctags/browser-inference/adapters/ovisocr3-native/contract.mjs"],
    ["../adapters/paddleocr-vl-1.6/adapter.mjs","../../../docs/assets/projects/doctags/browser-inference/adapters/paddleocr-vl-1.6/adapter.mjs"],
    ["../adapters/paddleocr-vl-1.6/pipeline-contract.mjs","../../../docs/assets/projects/doctags/browser-inference/adapters/paddleocr-vl-1.6/pipeline-contract.mjs"],
    ["../vendor/ppdoclayoutv3/worker-base.js","../../../docs/assets/projects/doctags/browser-inference/vendor/ppdoclayoutv3/worker-base.js"],
    ["../vendor/ppdoclayoutv3/inference.worker.js","../../../docs/assets/projects/doctags/browser-inference/vendor/ppdoclayoutv3/inference.worker.js"]
  ];
  for(const [space,docs] of files){
    const [a,b]=await Promise.all([read(space),read(docs)]);
    assert.equal(a,b,space+" mirror mismatch");
    assert.ok(a.length>0,space+" missing");
  }
});

test("native model outputs remain separate from the DocTags output contract",async()=>{
  const html=await read("../index.html");
  assert.match(html,/OvisOCR3 保留 Structured JSON/);
  assert.match(html,/PaddleOCR-VL-1\.6 保留 parsing_res_list 与 OTSL/);
  assert.match(html,/nativeOutputFormat\|\|"doctags"/);
  assert.match(html,/native\?"application\/json;charset=utf-8":"text\/plain;charset=utf-8"/);
});

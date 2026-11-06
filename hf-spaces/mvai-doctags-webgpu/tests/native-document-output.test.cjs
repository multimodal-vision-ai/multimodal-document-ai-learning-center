"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../native-document-output.js");

test("OvisOCR3 uses original structured JSON and normalized coordinates",()=>{
  const raw = JSON.stringify([{bbox:[68,63,458,140],category:"text",content:"中文 OCR"},{
    bbox:[100,150,900,420],category:"table",content:"<table><tr><td>1</td></tr></table>"
  }]);
  const parsed=core.parseOvis(raw);
  assert.equal(parsed.raw,raw);
  assert.equal(parsed.blocks.length,2);
  assert.deepEqual(core.toPixelBox(parsed.blocks[0],2000,1000),[136,63,916,140]);
  assert.equal(parsed.blocks[1].content,"<table><tr><td>1</td></tr></table>");
});

test("OvisOCR3 does not fabricate boxes for unstructured or malformed output",()=>{
  assert.throws(()=>core.parseOvis("not JSON"),/有效 JSON/);
  assert.throws(()=>core.parseOvis(JSON.stringify({markdown:"a"})),/JSON 数组/);
  const result=core.parseOvis(JSON.stringify([
    {bbox:[0,0,999,999],category:"doc_title",content:"标题"},
    {bbox:[10,12,1000,999],category:"text",content:"不合法"},
    {bbox:[0,0,4,5],category:"unknown",content:"不合法"}
  ]));
  assert.equal(result.blocks.length,1);
  assert.equal(result.warnings.length,2);
});

test("PaddleOCR-VL requires layout pipeline positions in source pixels",()=>{
  const original = {parsing_res_list:[
    {block_bbox:[40,50,100,120],block_label:"table",block_content:"<table><tr><td>中文</td></tr></table>",block_id:2,block_order:2},
    {block_bbox:[10,10,90,30],block_label:"text",block_content:"摘要",block_id:1,block_order:1}
  ]};
  const parsed=core.parsePaddle(JSON.stringify(original),{width:200,height:150});
  assert.equal(parsed.blocks.length,2);
  assert.equal(parsed.blocks[0].content,"摘要");
  assert.deepEqual(core.toPixelBox(parsed.blocks[1],200,150),[40,50,100,120]);
  assert.equal(parsed.blocks[1].source,"pp-doclayoutv3+paddleocr-vl-1.6");
});

test("PaddleOCR-VL refuses to treat plain OCR text as a located document",()=>{
  assert.throws(()=>core.parsePaddle(JSON.stringify({text:"123"}),{width:200,height:200}),/parsing_res_list/);
  assert.throws(()=>core.parsePaddle(JSON.stringify({parsing_res_list:[]}),{}),/原图像素宽高/);
  const parsed=core.parsePaddle(JSON.stringify({parsing_res_list:[
    {block_bbox:[0,0,300,100],block_label:"text",block_content:"越界"},
    {block_bbox:[1,2,40,35],block_label:"text",block_content:"有效"}
  ]}),{width:200,height:200});
  assert.equal(parsed.blocks.length,1);
  assert.equal(parsed.warnings.length,1);
});

test("Unknown coordinate systems are rejected instead of guessed",()=>{
  assert.throws(()=>core.toPixelBox({bbox:[0,0,10,10],coordinateSystem:"unknown"},100,100),/未知坐标/);
});

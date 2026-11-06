"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
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

test("PaddleOCR-VL OTSL restores rows, cells and empty cells without changing source text",()=>{
  const source="<fcel>年份<fcel>地区<nl><fcel>2025<ecel><nl>";
  const parsed=core.parseOTSL(source);
  assert.equal(parsed.format,"paddleocr-vl-otsl");
  assert.equal(parsed.rows.length,2);
  assert.equal(parsed.cellCount,4);
  assert.equal(parsed.rows[0][0].text,"年份");
  assert.equal(parsed.rows[0][1].text,"地区");
  assert.equal(parsed.rows[1][0].text,"2025");
  assert.equal(parsed.rows[1][1].empty,true);
  assert.equal(parsed.rows[1][1].text,"");
  assert.equal(parsed.maxColumns,2);
});

test("PaddleOCR-VL OTSL restores horizontal and vertical merged cells",()=>{
  const horizontal=core.parseOTSL("<fcel>合并标题<lcel><nl><fcel>A<fcel>B<nl>");
  assert.equal(horizontal.rows[0][0].colspan,2);
  assert.equal(horizontal.rows[0][0].rowspan,1);
  assert.equal(horizontal.rows[1].length,2);
  const vertical=core.parseOTSL("<fcel>跨行<fcel>表头<nl><ucel><fcel>数据<nl>");
  assert.equal(vertical.rows[0][0].rowspan,2);
  assert.equal(vertical.rows[1].length,1);
  assert.equal(vertical.rows[1][0].text,"数据");
});

test("PaddleOCR-VL OTSL restores a cell merged both horizontally and vertically",()=>{
  const parsed=core.parseOTSL("<fcel>跨行跨列<lcel><nl><ucel><xcel><fcel>右下角<nl>");
  const merged=parsed.rows[0][0];
  assert.equal(merged.colspan,2);
  assert.equal(merged.rowspan,2);
  assert.equal(parsed.rows[1].length,1);
  assert.equal(parsed.rows[1][0].text,"右下角");
});

test("PaddleOCR-VL OTSL rejects malformed merges and keeps non-OTSL content untouched",()=>{
  assert.equal(core.parseOTSL("<table><tr><td>HTML</td></tr></table>"),null);
  assert.throws(()=>core.parseOTSL("<lcel><nl>"),/左侧单元格/);
  assert.throws(()=>core.parseOTSL("<ucel><nl>"),/上方单元格/);
  assert.throws(()=>core.parseOTSL("<fcel>A<nl><xcel><nl>"),/左侧及上方/);
  assert.throws(()=>core.parseOTSL("<fcel>A<ecel>unexpected<nl>"),/无法归属/);
});

test("Unknown coordinate systems are rejected instead of guessed",()=>{
  assert.throws(()=>core.toPixelBox({bbox:[0,0,10,10],coordinateSystem:"unknown"},100,100),/未知坐标/);
});


test("Native Ovis HTML tags are recognized without unsafe HTML injection",()=>{
  const renderer=fs.readFileSync(require.resolve("../native-result-renderer.js"),"utf8");
  assert.ok(renderer.includes(String.raw`/^<table\b/i`));
  assert.ok(renderer.includes(String.raw`/^<img\b/i`));
  assert.ok(!renderer.includes(String.raw`/^<table\\b/i`));
  assert.ok(!renderer.includes(String.raw`/^<img\\b/i`));
  assert.ok(renderer.includes("parseOTSL(block.content)"));
  assert.ok(renderer.includes("查看原始 OTSL"));
  assert.equal(renderer.includes(".innerHTML ="),false);
  assert.equal(renderer.includes(".innerHTML="),false);
});

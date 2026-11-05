"use strict";
const assert=require("node:assert/strict");
const parser=require("../../docs/assets/projects/doctags/browser-inference/doctags-renderer.js");
const sample="<doctag>"+
"<section_header_level_1><loc_30><loc_20><loc_430><loc_48>Research Summary</section_header_level_1>"+
"<text><loc_30><loc_59><loc_410><loc_88>Compare methods.</text>"+
"<otsl><loc_30><loc_99><loc_455><loc_350><ched>Metric<ched>Baseline<ched>Proposed<nl>"+
"<fcel>Pages<fcel>20<fcel>20<nl><fcel>Score<fcel>0.71<fcel>0.76<nl></otsl>"+
"<text><loc_30><loc_370><loc_445><loc_390>Conclusion</text></doctag>";
const result=parser.parse(sample);
assert.equal(result.blocks.length,4);
assert.equal(result.blocks[0].type,"section_header_level_1");
assert.deepEqual(result.blocks[0].loc,[30,20,430,48]);
assert.equal(result.blocks[2].table.rows.length,3);
assert.equal(result.blocks[2].table.rows[0][0].type,"ched");
assert.equal(result.blocks[2].table.rows[1][2].text,"20");
assert.equal(result.blocks[3].text,"Conclusion");
assert.equal(parser.rects(sample).length,4);
const merges=parser.parseOtsl("<ched>A<ched>B<nl><fcel>Both<lcel><nl>");
assert.equal(merges.rows.length,2);
assert.equal(merges.hasMerges,true);
const list=parser.parse("<unordered_list><loc_10><loc_10><loc_120><loc_110><list_item>A</list_item><list_item>B</list_item></unordered_list>");
assert.equal(list.blocks[0].type,"unordered_list");
assert.match(list.blocks[0].raw,/<list_item>A<\/list_item>/);
const unsafe=parser.parse("<text><loc_1><loc_2><loc_50><loc_90>&lt;img src=x onerror=alert(1)&gt;</text>");
assert.equal(unsafe.blocks[0].text,"<img src=x onerror=alert(1)>");
assert.equal(unsafe.blocks[0].loc[0],1);
assert.equal(parser.parse("This is unstructured garbage").blocks.length,0);

// Regression fixture: handwritten notes and page numbers must not be silently dropped.
const handwritingSample="<doctag>"+
  "<text><loc_379><loc_36><loc_394><loc_43>NO.</text>"+
  "<text><loc_379><loc_50><loc_398><loc_56>Date</text>"+
  "<handwritten><loc_68><loc_63><loc_360><loc_80>for a moment,片刻,一会儿; for the moment 暂时,一时;</handwritten>"+
  "<handwritten><loc_70><loc_80><loc_258><loc_96>Thinking for a moment, he agreed.</handwritten>"+
  "<handwritten><loc_46><loc_95><loc_220><loc_111>37. next year, the next year</handwritten>"+
  "<page_number><loc_234><loc_477><loc_246><loc_487>18</page_number>"+
  "</doctag>";
const handwriting=parser.parse(handwritingSample);
assert.equal(handwriting.blocks.length,6,"Both handwritten blocks and page number must be parsed");
assert.deepEqual(handwriting.blocks.map(block=>block.type),["text","text","handwritten","handwritten","handwritten","page_number"]);
assert.equal(handwriting.blocks[2].text,"for a moment,片刻,一会儿; for the moment 暂时,一时;");
assert.equal(handwriting.blocks[3].text,"Thinking for a moment, he agreed.");
assert.equal(handwriting.blocks[5].text,"18");
assert.deepEqual(handwriting.blocks[2].loc,[68,63,360,80]);
assert.equal(parser.rects(handwritingSample).length,6);
console.log("DocTags parser fixtures passed: headings, text, handwritten notes, page numbers, OTSL rows, merged cells, and safe text extraction.");

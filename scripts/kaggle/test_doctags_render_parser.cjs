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

// Full regression fixture copied from the user-provided model output.
// Expected: 2 text + 26 handwritten + 1 page_number = 29 renderable blocks.
const handwritingSample="<doctag>\n<text><loc_379><loc_36><loc_394><loc_43>NO.</text>\n<text><loc_379><loc_50><loc_398><loc_56>Date</text>\n<handwritten><loc_68><loc_63><loc_360><loc_80>for a moment,片刻,一会儿; for the moment 暂时,一时;</handwritten>\n<handwritten><loc_70><loc_80><loc_258><loc_96>Thinking for a moment, he agreed.</handwritten>\n<handwritten><loc_46><loc_95><loc_220><loc_111>37. next year, the next year</handwritten>\n<handwritten><loc_70><loc_111><loc_458><loc_140>next year 明年,将来时间状语; the next year 第二年,过去将来时间状语.</handwritten>\n<handwritten><loc_70><loc_126><loc_326><loc_140>He said he would go abroad the next year.</handwritten>\n<handwritten><loc_46><loc_141><loc_298><loc_158>38. more than a year, more than one year</handwritten>\n<handwritten><loc_70><loc_157><loc_452><loc_172>more than a year 一年多; more than one year 超过一年(两年或三年等)</handwritten>\n<handwritten><loc_46><loc_172><loc_279><loc_186>39. take advice, take the (one's) advice</handwritten>\n<handwritten><loc_70><loc_188><loc_354><loc_202>take advice 征求意见; take the advice 接受忠告.</handwritten>\n<handwritten><loc_70><loc_204><loc_374><loc_220>He refused to take the advice and failed again.</handwritten>\n<handwritten><loc_46><loc_219><loc_209><loc_231>40. take air, take the air</handwritten>\n<handwritten><loc_70><loc_234><loc_348><loc_249>take air 传播, 遗漏; take the air 到户外去, 散步.</handwritten>\n<handwritten><loc_70><loc_251><loc_224><loc_266>We take the air every day.</handwritten>\n<handwritten><loc_46><loc_266><loc_198><loc_278>41. in a word, in words</handwritten>\n<handwritten><loc_70><loc_280><loc_423><loc_300>in a word 总之,一句话; in words 口头上. In a word, you are right.</handwritten>\n<handwritten><loc_46><loc_297><loc_236><loc_314>42. in place of, in the place of</handwritten>\n<handwritten><loc_70><loc_312><loc_328><loc_328>in place of 代替; in the place of 在…地方.</handwritten>\n<handwritten><loc_70><loc_327><loc_376><loc_345>A new building is built in the place of the old one.</handwritten>\n<handwritten><loc_46><loc_344><loc_218><loc_356>43. in secret, in the secret</handwritten>\n<handwritten><loc_70><loc_358><loc_356><loc_374>in secret 秘密地, 暗自地, 偷偷地, 一般用作状语;</handwritten>\n<handwritten><loc_70><loc_375><loc_338><loc_388>in the secret 知道内情, 知道秘密, 一般用作表语.</handwritten>\n<handwritten><loc_70><loc_390><loc_354><loc_408>My mother was in the secret from the beginning.</handwritten>\n<handwritten><loc_46><loc_406><loc_166><loc_422>44. a girl, one girl</handwritten>\n<handwritten><loc_70><loc_421><loc_285><loc_438>a girl 可泛指所有女孩, one girl 一个女孩.</handwritten>\n<handwritten><loc_70><loc_437><loc_279><loc_453>Can one girl carry such a big box?</handwritten>\n<handwritten><loc_46><loc_453><loc_245><loc_467>45. take a chair, take the chair.</handwritten>\n<page_number><loc_234><loc_477><loc_246><loc_487>18</page_number>\n</doctag>";
const handwriting=parser.parse(handwritingSample);
assert.equal(handwriting.blocks.length,29,"The complete handwritten page must produce 29 renderable blocks");
assert.deepEqual(handwriting.blocks.reduce((counts,block)=>(counts[block.type]=(counts[block.type]||0)+1,counts),{}),{text:2,handwritten:26,page_number:1});
assert.equal(handwriting.blocks[2].text,"for a moment,片刻,一会儿; for the moment 暂时,一时;");
assert.deepEqual(handwriting.blocks[2].loc,[68,63,360,80]);
assert.equal(handwriting.blocks[27].text,"45. take a chair, take the chair.");
assert.equal(handwriting.blocks[28].type,"page_number");
assert.equal(handwriting.blocks[28].text,"18");
assert.deepEqual(handwriting.blocks[28].loc,[234,477,246,487]);
assert.equal(parser.rects(handwritingSample).length,29);
console.log("DocTags parser fixtures passed: OTSL, list, safe text, and complete 29-block handwritten-page regression.");

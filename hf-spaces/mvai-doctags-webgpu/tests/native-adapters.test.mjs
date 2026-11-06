import test from "node:test";
import assert from "node:assert/strict";
import {orderedRegions,taskForLabel,assemblePaddleResult} from "../adapters/paddleocr-vl-1.6/pipeline-contract.mjs";
import {directPrompt,ONNX_MODEL_ID,requireNativeOnnxBundle} from "../adapters/ovisocr3-native/contract.mjs";

test("Layout SDK box is page pixel box, with reading order preserved",()=>{
  const regions=orderedRegions([
    {box:{xMin:60,yMin:100,xMax:450,yMax:250},label:"table",readingOrder:2,score:0.99},
    {box:{xMin:10,yMin:10,xMax:800,yMax:50},label:"doc_title",readingOrder:1,score:0.98}
  ],{width:1000,height:600});
  assert.equal(regions[0].label,"doc_title");
  assert.equal(regions[1].task,"table");
  const results=assemblePaddleResult(regions,[{text:"标题"},{text:"<table><tr><td>数值</td></tr></table>"}],{width:1000,height:600});
  assert.equal(results.width,1000);
  assert.equal(results.height,600);
  assert.equal(results.model_settings.pipeline_model,"PaddleOCR-VL-1.6");
  assert.equal(results.model_settings.use_layout_detection,true);
  assert.deepEqual(results.parsing_res_list[1].block_bbox,[60,100,450,250]);
  assert.equal(results.parsing_res_list[1].block_content,"<table><tr><td>数值</td></tr></table>");
});

test("Never generate artificial boxes, reading order or unsupported formats",()=>{
  assert.throws(()=>orderedRegions([{box:{xMin:0,yMin:0,xMax:12,yMax:4},label:"text"}],{width:10,height:10}),/坐标越界/);
  assert.throws(()=>orderedRegions([{box:{xMin:0,yMin:0,xMax:12,yMax:4},label:"text"}],{width:20,height:10}),/readingOrder/);
  assert.throws(()=>assemblePaddleResult([{}],[]),/数量不匹配/);
  assert.equal(taskForLabel("image"),null);
  assert.equal(taskForLabel("formula"),"formula");
  assert.equal(taskForLabel("display_formula"),"formula");
  assert.equal(taskForLabel("chart"),"chart");
});

test("Ovis native contract cannot reuse official BF16 checkpoint as ONNX",()=>{
  assert.throws(()=>requireNativeOnnxBundle("ATH-MaaS/OvisOCR3"),/专用 ONNX/);
  assert.throws(()=>requireNativeOnnxBundle(""),/专用 ONNX/);
  assert.equal(requireNativeOnnxBundle(ONNX_MODEL_ID),ONNX_MODEL_ID);
  const tokenizer={apply_chat_template(msg){assert.equal(msg[0].content[1].text,"STRUCTURED PROMPT");return "x<|im_start|>assistant\n";}};
  assert.equal(directPrompt(tokenizer,"STRUCTURED PROMPT"),"x<|im_start|>assistant\n");
});

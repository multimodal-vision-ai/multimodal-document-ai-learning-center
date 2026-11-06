import test from "node:test";
import assert from "node:assert/strict";
import {orderedRegions,taskForLabel,assemblePaddleResult} from "../adapters/paddleocr-vl-1.6/pipeline-contract.mjs";
import {createSingleRuntimeVlm} from "../adapters/paddleocr-vl-1.6/adapter.mjs";
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
  assert.equal(results.input_path,null);
  assert.equal(results.page_index,null);
  assert.equal(results.page_count,1);
  assert.equal(results.model_settings.pipeline_model,"PaddleOCR-VL-1.6");
  assert.equal(results.model_settings.use_layout_detection,true);
  assert.deepEqual(results.parsing_res_list[1].block_bbox,[60,100,450,250]);
  assert.equal(results.parsing_res_list[1].block_content,"<table><tr><td>数值</td></tr></table>");
  assert.throws(()=>assemblePaddleResult(regions,[{text:"标题"},undefined],{width:1000,height:600}),/禁止用空字符串补齐/);
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


test("Paddle browser engine creates one WebGPU runtime, not the upstream multi-runtime pool",async()=>{
  let runtimeCreates=0,freed=0,initialized=0;
  let captured=null;
  class FakeEngine{
    constructor(runtimes,concurrency){captured={runtimes,concurrency};}
  }
  const runtime={
    capabilities_json:()=>JSON.stringify({adapter_name:"NVIDIA GeForce RTX 3080",adapter_device_type:"DiscreteGpu"}),
    free:()=>{freed++;}
  };
  const engine=await createSingleRuntimeVlm({
    engineModule:{PaddleOcrVlEngine:FakeEngine},
    runtimeModule:{
      default:async()=>{initialized++;},
      WebRuntime:{create:async()=>{runtimeCreates++;return runtime;}}
    }
  });
  assert.ok(engine instanceof FakeEngine);
  assert.equal(initialized,1);
  assert.equal(runtimeCreates,1);
  assert.equal(captured.runtimes.length,1);
  assert.equal(captured.runtimes[0],runtime);
  assert.equal(captured.concurrency.current(8),1);
  assert.equal(captured.concurrency.current(0),0);
  assert.equal(engine.runtimeInfo.adapter_name,"NVIDIA GeForce RTX 3080");
  assert.equal(engine.runtimeInfo.runtimeCount,1);
  assert.equal(engine.runtimeInfo.parallelism,1);
  assert.equal(freed,0);
});

test("Paddle browser engine rejects software rendering and frees the runtime",async()=>{
  let freed=0;
  const runtime={capabilities_json:()=>JSON.stringify({adapter_name:"SwiftShader"}),
    free:()=>{freed++;}};
  await assert.rejects(createSingleRuntimeVlm({
    engineModule:{PaddleOcrVlEngine:class{}},
    runtimeModule:{default:async()=>{},WebRuntime:{create:async()=>runtime}}
  }),/software adapter/);
  assert.equal(freed,1);
});

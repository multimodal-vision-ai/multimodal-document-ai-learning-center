import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,join} from "node:path";
import {
  OFFICIAL,MIRROR,OFFICIAL_HOST,MIRROR_HOST,REMOTE_PATH,
  mirrorPolicy,modelRevision,runtimeSource,probeMirror,probeMirrorTransport
} from "../docs/assets/projects/doctags/browser-inference/model-download-source.mjs";
import {MODEL_REVISION as WC_REVISION} from "../docs/assets/projects/doctags/browser-inference/adapters/wang-qwen35-2b/contract.mjs";

const dir=dirname(fileURLToPath(import.meta.url));
const root=join(dir,"../docs/assets/projects/doctags/browser-inference");
const models=[
 {builtIn:true,id:"multimodal-vision-ai/R3-OvisOCR3-DocTags-0.8B-ONNX",adapter:"r3-ovisocr3"},
 {builtIn:true,id:"multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags-ONNX",adapter:"wang-qwen35-2b"},
 {builtIn:true,id:"onnx-community/granite-docling-258M-ONNX"},
 {builtIn:true,id:"multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX",adapter:"ovisocr3-native",revision:"de391cb93aa2ee1b67692bdba1b143bf8e4a9f98"},
 {builtIn:true,id:"glebkudr/PaddleOCR-VL-1.6-WebGPU",adapter:"paddleocr-vl-1.6",revision:"5219606297d00bbd23b2ec193271af0c0b427dfc"}
];

test("five models appear in the selector policy; Paddle stays on the approved WebGPU pack",()=>{
 assert.deepEqual(models.map(model=>mirrorPolicy(model).allowed),[false,false,false,false,false]);
 assert.equal(mirrorPolicy({id:"another/org",builtIn:false}).allowed,false);
 assert.deepEqual(runtimeSource(OFFICIAL,models[4]),{modelSource:OFFICIAL});
 assert.throws(()=>runtimeSource(MIRROR,models[4]),/不支持/);
 assert.throws(()=>runtimeSource("untrusted",models[0]),/不支持/);
 assert.throws(()=>runtimeSource(MIRROR,models[0]),/不支持/);
 assert.match(mirrorPolicy(models[0]).reason,/HF-Mirror.*跨域/);
 assert.equal(OFFICIAL_HOST,"https://huggingface.co/");
 assert.equal(modelRevision(models[1]),WC_REVISION);
 assert.equal(modelRevision(models[0]),"main");
});

test("valid mirror CORS config preflight reads only a small JSON file",async()=>{
 const seen=[];
 const report=await probeMirrorTransport(models[0],{
  fetcher:async (url,init)=>{
   seen.push([url,init]);
   return new Response(JSON.stringify({model_type:"qwen3_5"}),{
    status:200,headers:{"content-type":"application/json"}
   });
  }
 });
 assert.equal(seen.length,1);
 assert.match(seen[0][0],/^https:\/\/hf-mirror\.com\/multimodal-vision-ai\/R3-OvisOCR3-DocTags-0\.8B-ONNX\/resolve\/main\/config\.json$/);
 assert.equal(seen[0][1].mode,"cors");
 assert.equal(seen[0][1].credentials,"omit");
 assert.equal(report.modelHost,MIRROR_HOST);
 assert.equal(report.rangeUrl,null);
});

test("WC-2B must expose real HTTP 206 Content-Range, not a 200 full weight",async()=>{
 const paths=[];
 const ok=await probeMirrorTransport(models[1],{
   fetcher:async(url,init)=>{
     paths.push(url);
     if(url.endsWith("/config.json"))return new Response(JSON.stringify({model_type:"qwen3_5"}));
     assert.equal(init.headers.Range,"bytes=0-0");
     return new Response(new Uint8Array([1]),{
       status:206,headers:{"content-range":"bytes 0-0/1018486784"}
     });
   }
 });
 assert.equal(paths.length,2);
 assert.ok(paths[0].includes("/resolve/"+WC_REVISION+"/config.json"));
 assert.ok(paths[1].endsWith("/onnx/embed_tokens_fp16.onnx_data"));
 assert.ok(ok.rangeUrl);
 await assert.rejects(
  ()=>probeMirrorTransport(models[1],{fetcher:async(url)=>
    url.endsWith("config.json")
      ?new Response(JSON.stringify({model_type:"qwen3_5"}))
      :new Response("unsafe full response",{status:200})
  }),
  /HTTP 206/
 );
});

test("fail closed on HTML, missing model config and redirected official origin",async()=>{
 await assert.rejects(()=>probeMirrorTransport(models[0],{
  fetcher:async()=>new Response("<html>mirror down</html>")
 }),/JSON/);
 await assert.rejects(()=>probeMirrorTransport(models[0],{
  fetcher:async()=>new Response(JSON.stringify({unrelated:true}))
 }),/架构/);
 await assert.rejects(()=>probeMirrorTransport(models[0],{
  fetcher:async()=>({
    status:200,ok:true,
    url:"https://huggingface.co/org/model/resolve/main/config.json",
    headers:new Headers(),
    json:async()=>({model_type:"x"})
  })
 }),/跳转/);
 await assert.rejects(()=>probeMirror(models[4],{fetcher:async()=>new Response("{}")}),/WebGPU/);
 let attempted=false;
 await assert.rejects(()=>probeMirror(models[0],{fetcher:async()=>{attempted=true;return new Response("{}");}}),/限制第三方网页跨域下载/);
 assert.equal(attempted,false,"Disabled mirror must never issue a network request");
});

test("DEV page adds a selector without rewriting the five model inference branches",()=>{
 const html=readFileSync(join(root,"index.html"),"utf8");
 const required=[
  'id="modelSourceOfficial"','id="modelSourceMirror"',
  'import {OFFICIAL,MIRROR,OFFICIAL_HOST,MIRROR_HOST,REMOTE_PATH,mirrorPolicy,modelRevision,runtimeSource,probeMirror}',
  'await probeMirror(entry);','runtime:sourceRuntime',
  'paddleNativeAdapter=await createAdapter({onProgress});',
  'AutoModelForVision2Seq.from_pretrained(entry.id',
  'activeKey!==selectedKey()',
  'modelSourceMirror").disabled=busy||!policy.allowed'
 ];
 for(const key of required)assert.ok(html.includes(key),"Missing DEV source contract "+key);
 assert.equal((html.match(/id="modelSourceMirror"/g)||[]).length,1);
 const dirs=[
  "adapters/r3-ovisocr3/adapter.mjs",
  "adapters/wang-qwen35-2b/adapter.mjs",
  "adapters/ovisocr3-native/adapter.mjs"
 ];
 for(const path of dirs){
  const text=readFileSync(join(root,path),"utf8");
  assert.ok(text.includes("runtime.modelPathTemplate || '{model}/'"),path);
  assert.ok(text.includes('runtime.modelSource === "official"'),path);
  assert.ok(text.includes("https://huggingface.co/"),path);
 }
 const wang=readFileSync(join(root,dirs[1]),"utf8");
 assert.ok(wang.includes('"-mirror"'),"WC-2B mirror chunks must have isolated cache");
 assert.ok(wang.includes("createRangeFetch"),"WC-2B Range downloader must remain");
});

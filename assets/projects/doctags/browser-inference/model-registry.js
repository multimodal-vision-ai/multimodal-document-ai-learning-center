/* MVAI V1.8: built-in model adapters, user-added compatible ONNX repositories and session results.
   Only repository references/settings are persisted. Document data stays in RAM. */
(function (root) {
  "use strict";
  const KEY="mvai-doctags-compatible-models-v1";
  const BUILTIN=Object.freeze({id:"onnx-community/granite-docling-258M-ONNX",name:"Granite Docling 258M · 公开基线",origin:"IBM / ONNX Community",builtIn:true,checked:true,parameterCount:"258M 参数"});
  const R3=Object.freeze({id:"multimodal-vision-ai/R3-OvisOCR3-DocTags-0.8B-ONNX",name:"DocTags OvisOCR3 0.8B v1.0 · 自研",origin:"河海大学 · MVAI Lab",builtIn:true,checked:true,parameterCount:"0.8B 参数",adapter:"r3-ovisocr3",precision:"r3-fixed",runtime:"Transformers.js 4.4.0-next.0 / ONNX Runtime Web 1.31.1",downloadSize:"约 2.52 GB",validatedDevice:"Chrome 157 / NVIDIA A800 80GB"});
  const BUILTINS=Object.freeze([BUILTIN,R3]);
  const BUILTIN_IDS=new Set(BUILTINS.map(model=>model.id));
  const MAX_CUSTOM=8;
  function validRepoId(id){return typeof id==="string"&&id.length<=120&&/^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(id)&&!id.includes("..")&&!id.includes("--/")&&!id.startsWith("http");}
  function normalise(input){if(!input||!validRepoId(input.id))throw Error("只接受 Hugging Face 公开模型仓库 ID，如 org/model-ONNX；不接受 URL。");const name=String(input.name||"").trim().slice(0,70);if(!name)throw Error("请填写模型显示名称。");if(BUILTIN_IDS.has(input.id))throw Error("该模型已内置。");return {id:input.id,name,origin:"用户添加 · 待兼容性验证",builtIn:false,checked:false};}
  function restore(storage){try{const saved=JSON.parse(storage?.getItem(KEY)||"[]");if(!Array.isArray(saved))return [];const seen=new Set(BUILTIN_IDS),items=[];for(const raw of saved){try{const value=normalise(raw);if(!seen.has(value.id)&&items.length<MAX_CUSTOM){items.push(value);seen.add(value.id);}}catch{}}return items;}catch{return [];}}
  function save(storage,items){const clean=[];const known=new Set(BUILTIN_IDS);for(const item of items){const normalized=normalise(item);if(known.has(normalized.id))continue;if(clean.length>=MAX_CUSTOM)throw Error("最多登记 8 个外部模型。");known.add(normalized.id);clean.push(normalized);}storage?.setItem(KEY,JSON.stringify(clean.map(({id,name})=>({id,name}))));return clean;}
  function getAll(storage){return [...BUILTINS,...restore(storage)];}
  function key(id,precision){return id+"::"+precision;}
  function modelSizeLabel(id){const builtin=BUILTINS.find(model=>model.id===id);return builtin?.parameterCount||"未提供（自定义模型）";}
  function proportionalPosition(fromTop,fromHeight,fromViewport,toHeight,toViewport){const sourceMax=Math.max(0,Number(fromHeight)-Number(fromViewport));const targetMax=Math.max(0,Number(toHeight)-Number(toViewport));if(!Number.isFinite(sourceMax)||!Number.isFinite(targetMax)||!targetMax||!sourceMax)return 0;const ratio=Math.min(1,Math.max(0,Number(fromTop)/sourceMax));return Number.isFinite(ratio)?ratio*targetMax:0;}
  function recordResult(history,record){if(!record||!validRepoId(record.modelId)||!record.documentRevision||!record.tags)return history;const filtered=history.filter(item=>item.documentRevision===record.documentRevision&&item.key!==record.key);return [...filtered,record].slice(-12);}
  root.MVAIModelRegistry={BUILTIN,R3,BUILTINS,KEY,validRepoId,normalise,restore,save,getAll,key,modelSizeLabel,proportionalPosition,recordResult};
  if(typeof module!=="undefined"&&module.exports)module.exports=root.MVAIModelRegistry;
})(typeof globalThis==="object"?globalThis:this);

import * as ort from 'onnxruntime-web';
import {decodeRaw,suppress} from './e04-core.mjs';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import assert from 'node:assert/strict';
ort.env.wasm.numThreads=1;
for(const model of ['yolo26n','yolo26s'])for(const size of [320,640,960]){
 const bytes=await readFile(join(process.argv[2],model+'-'+size+'-raw.onnx'));
 const s=await ort.InferenceSession.create(bytes,{executionProviders:['wasm']});
 try{
 const input=new ort.Tensor('float32',new Float32Array(3*size*size).fill(114/255),[1,3,size,size]);
 const result=await s.run({[s.inputNames[0]]:input}), raw=result[s.outputNames[0]];
 assert.equal(raw.dims[1],84); assert.ok(raw.data.every(Number.isFinite));
 const c=decodeRaw(raw);const filtered=suppress(c);
 console.log(model,size,'WASM actual forward',raw.dims.join('x'),'candidates',c.length,'kept',filtered.after.length);
 }finally{await s.release()}
}

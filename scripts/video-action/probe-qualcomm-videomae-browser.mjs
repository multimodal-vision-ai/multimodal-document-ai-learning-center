import fs from 'node:fs';
import {chromium} from 'playwright';
fs.mkdirSync('artifacts/video-action/nonmovinet-probe',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--js-flags=--max-old-space-size=4096']});
const page=await browser.newPage({viewport:{width:1180,height:800}});
const report={testedAt:new Date().toISOString(),model:'Qualcomm VideoMAE K400 TFLite (original work MCG-NJU)',success:false};
page.on('pageerror',e=>{(report.errors??=[]).push(String(e))});
try{
 await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:30000});
 const result=await page.evaluate(async()=>{
   const details={};
   const api=await import('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/+esm');
   await api.loadLiteRt('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/wasm/');
   const response=await fetch('./third-party-probe/Video-MAE.tflite');
   details.http=response.status;if(!response.ok)throw Error('Model HTTP '+response.status);
   const b=await response.arrayBuffer();
   details.bytes=b.byteLength;
   details.sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b))).map(x=>x.toString(16).padStart(2,'0')).join('');
   const start=performance.now();
   const model=await api.loadAndCompile(new Uint8Array(b),{accelerator:'wasm'});
   details.compileMs=Math.round(performance.now()-start);
   const shape=d=>Array.from(d.shape??d.dims??d.dimensions??[],Number);
   const inputs=model.getInputDetails(),outputs=model.getOutputDetails();
   details.inputs=inputs.map(d=>({name:d.name,type:d.dataType??d.type,shape:shape(d)}));
   details.outputs=outputs.map(d=>({name:d.name,type:d.dataType??d.type,shape:shape(d)}));
   const tensors=inputs.map(d=>{
     const sizes=shape(d);const n=sizes.reduce((a,b)=>a*b,1);
     if(!Number.isFinite(n)||n>5000000)throw Error('Invalid tensor shape '+d.name+' '+sizes);
     const type=d.dataType??d.type;
     return new api.Tensor(type==='int32'?new Int32Array(n):new Float32Array(n).fill(.3),sizes);
   });
   try{
     const began=performance.now(),result=await model.run(tensors);
     details.inferenceMs=Math.round(performance.now()-began);
     const out=await Promise.all(result.map(x=>x.data()));
     details.outputLengths=out.map(x=>x.length);
     details.allFinite=out.every(x=>Array.from(x).every(Number.isFinite));
     details.nonzero=out.some(x=>Array.from(x).some(n=>n!==0&&Number.isFinite(n)));
     if(typeof result.delete==='function')result.delete();else result.forEach(x=>x.delete?.());
   }finally{tensors.forEach(t=>t.delete?.())}
   return details;
 });
 Object.assign(report,result);
 report.success=!!result.allFinite&&!!result.nonzero&&result.outputs?.some(x=>x.shape.some(y=>y===400));
 if(!report.success)process.exitCode=1;
}catch(e){report.error=String(e);process.exitCode=1}
finally{
 fs.writeFileSync('artifacts/video-action/nonmovinet-probe/qualcomm-videomae.json',JSON.stringify(report,null,2));
 console.log('NONMOVINET_VIDEOMAE_RESULT',JSON.stringify({success:report.success,inputs:report.inputs,outputs:report.outputs,compileMs:report.compileMs,inferenceMs:report.inferenceMs,error:report.error}).slice(0,3500));
 await browser.close();
}

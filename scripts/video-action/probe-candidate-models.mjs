import {chromium} from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('artifacts/video-action/models',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1200,height:850}});
const report={type:'real_browser_official_model_compatibility',testedAt:new Date().toISOString(),success:false,models:[]};
page.on('pageerror',e=>{(report.pageErrors??=[]).push(String(e))});
try{
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:30000});
  // Real browser WASM model compile and execute, no manufactured action results.
  const out=await page.evaluate(async()=>{
    const names=['a1','a2'];
    const evidence=[];
    const api=await import('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/+esm');
    await api.loadLiteRt('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/wasm/');
    const shapeOf=d=>{let r=d?.shape??d?.dims??d?.dimensions??d?.shapeSignature;return r?Array.from(r,Number):null};
    for(const variant of names){
      const modelUrl='https://storage.googleapis.com/tf_model_garden/vision/movinet/movinet_'+variant+'_stream.tflite';
      const item={variant,modelUrl};
      const start=performance.now();
      let model=null;
      try{
        const response=await fetch(modelUrl,{cache:'no-store'});
        item.http=response.status;
        item.corsFetchOk=response.ok;
        if(!response.ok)throw Error('HTTP '+response.status);
        const bytes=await response.arrayBuffer();
        item.bytes=bytes.byteLength;
        item.sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');
        item.downloadMs=Math.round(performance.now()-start);
        model=await api.loadAndCompile(new Uint8Array(bytes),{accelerator:'wasm'});
        const ins=model.getInputDetails?.()||[],outs=model.getOutputDetails?.()||[];
        item.inputCount=ins.length;item.outputCount=outs.length;
        item.inputs=ins.map((d,i)=>({i,name:d.name,type:d.dataType??d.dtype??d.type,shape:shapeOf(d)}));
        item.outputs=outs.map((d,i)=>({i,name:d.name,type:d.dataType??d.dtype??d.type,shape:shapeOf(d)}));
        item.compileMs=Math.round(performance.now()-start-item.downloadMs);
        item.firstInput=item.inputs[0];item.firstOutput=item.outputs[0];
        const frameFirst=item.inputs[0]?.shape;
        if(!frameFirst)throw Error('Missing input metadata');
        const tensors=[];
        try{
          for(const i of item.inputs){
            const shape=i.shape;
            if(!shape||shape.some(n=>!Number.isInteger(n)||n<1))throw Error('Dynamic/invalid tensor shape at input '+i.i);
            const size=shape.reduce((x,y)=>x*y,1);
            if(size>4000000)throw Error('Tensor size exceeds safety limit at '+i.i);
            // Official float model expects float32; use identical shapes/dtypes as returned by LiteRT.
            tensors.push(new api.Tensor(new Float32Array(size),shape));
          }
          const tm=performance.now();
          const ys=await model.run(tensors);
          item.singleFrameMs=Math.round(performance.now()-tm);
          const values=await Promise.all(ys.map(x=>x.data()));
          item.outputShapes=values.map(v=>v.length);
          item.nonZeroLogits=values.some(v=>v.length===600&&v.some(x=>Number.isFinite(x)&&x!==0));
          item.ran=true;
          if(typeof ys.delete==='function')ys.delete();else ys.forEach(x=>x.delete?.());
        }finally{for(const x of tensors)x.delete?.()}
      }catch(e){item.error=String(e);item.stack=String(e.stack||'').slice(0,1700);item.ran=false}
      evidence.push(item);
      model?.delete?.();model=null;
    }
    return evidence;
  },{timeout:240000});
  report.models=out;
  report.success=out.length===2&&out.every(x=>x.ran&&x.outputShapes?.includes(600));
  console.log('MODEL_PROBE_SUMMARY',JSON.stringify(out.map(x=>({variant:x.variant,http:x.http,bytes:x.bytes,inputCount:x.inputCount,outputCount:x.outputCount,firstInput:x.firstInput,firstOutput:x.firstOutput,singleFrameMs:x.singleFrameMs,ran:x.ran,error:x.error}))));
  if(!report.success)process.exitCode=1;
}catch(e){report.error=String(e);process.exitCode=1}
finally{fs.writeFileSync('artifacts/video-action/models/model-probe.json',JSON.stringify(report,null,2));await page.screenshot({path:'artifacts/video-action/models/browser.png',fullPage:true}).catch(()=>{});await browser.close()}

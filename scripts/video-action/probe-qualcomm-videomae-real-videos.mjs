import fs from 'node:fs';
import {chromium} from 'playwright';
const out='artifacts/video-action/nonmovinet-real';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--js-flags=--max-old-space-size=4096']});
const page=await browser.newPage({viewport:{width:1280,height:850}});
const report={type:'Qualcomm-VideoMAE-live-real-video-Kinetics400-pilot',time:new Date().toISOString(),success:false,results:[],errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
try{
 await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>document.querySelectorAll('#sample-list button[data-clip-id]').length===6,null,{timeout:35000});
 const result=await page.evaluate(async()=>{
   const api=await import('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/+esm');
   await api.loadLiteRt('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/wasm/');
   const data=await (await fetch('./third-party-probe/Video-MAE.tflite')).arrayBuffer();
   const model=await api.loadAndCompile(new Uint8Array(data),{accelerator:'wasm'});
   const inputs=model.getInputDetails(),outputs=model.getOutputDetails();
   const id2label=(await (await fetch('./third-party-probe/mcg-config.json')).json()).id2label;
   if(Object.keys(id2label).length!==400)throw Error('Reference label count is not 400');
   if(JSON.stringify(Array.from(inputs[0].shape))!=='[1,16,224,224,3]')throw Error('Unexpected TFLite shape');
   const actions=['wave','phone_use','falling','eating','sleep_posture'];
   const runs=[];
   const video=document.querySelector('#video'),canvas=document.createElement('canvas');
   canvas.width=canvas.height=224;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});
   for(const action of actions){
     const button=document.querySelector('#sample-list button[data-action="'+action+'"]');
     button.click();
     await new Promise((resolve,reject)=>{
       const timer=setTimeout(()=>reject(Error('video metadata timeout')),25000);
       const check=()=>{if(video.readyState>=2&&video.videoWidth>0){clearTimeout(timer);resolve()}};
       video.addEventListener('loadeddata',check,{once:true});check()
     });
     const duration=Math.min(8,video.duration);
     const arr=new Float32Array(16*224*224*3);
     const tm=performance.now();
     for(let k=0;k<16;k++){
       const sec=Math.min(duration*(k+.5)/16,Math.max(0,video.duration-.02));
       if(Math.abs(video.currentTime-sec)>.009||video.readyState<2){
         await new Promise((resolve,reject)=>{
           const timeout=setTimeout(()=>reject(Error('seek timeout')),16000);
           video.addEventListener('seeked',()=>{clearTimeout(timeout);resolve()},{once:true});
           video.currentTime=sec
         });
       }
       ctx.drawImage(video,0,0,224,224);
       const img=ctx.getImageData(0,0,224,224).data;
       for(let p=0;p<224*224;p++){
         const base=(k*224*224+p)*3;
         arr[base]=img[p*4]/255;arr[base+1]=img[p*4+1]/255;arr[base+2]=img[p*4+2]/255;
       }
     }
     const decodeMs=Math.round(performance.now()-tm);
     const input=new api.Tensor(arr,[1,16,224,224,3]);
     const started=performance.now(),raw=await model.run([input]);
     const inferenceMs=Math.round(performance.now()-started);
     const values=Array.from(await raw[0].data());
     input.delete?.();if(typeof raw.delete==='function')raw.delete();else raw.forEach(x=>x.delete?.());
     if(values.length!==400||values.some(v=>!Number.isFinite(v)))throw Error('Invalid 400 score output');
     const ranked=values.map((score,i)=>({i,label:id2label[String(i)],score})).sort((a,b)=>b.score-a.score);
     const sum=values.reduce((a,b)=>a+b,0);
     runs.push({action,decodeMs,inferenceMs,top5:ranked.slice(0,5),scoreSum:sum,
       valid:Math.abs(sum-1)<.005&&ranked[0].score>0});
   }
   return {runs,weightsBytes:data.byteLength,models:{inputs:inputs.length,outputs:outputs.length}};
 });
 Object.assign(report,result);
 report.success=report.results?.length===5||report.runs?.length===5&&report.runs.every(r=>r.valid)&&report.errors.length===0;
 if(!report.success)process.exitCode=1;
}catch(e){report.error=String(e);process.exitCode=1}
finally{
 fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));
 console.log('QUALCOMM_VIDEOMAE_REAL_RESULTS',JSON.stringify({success:report.success,runs:report.runs?.map(x=>({action:x.action,top1:x.top5?.[0],inferenceMs:x.inferenceMs,scoreSum:x.scoreSum})),error:report.error,errors:report.errors}).slice(0,12500));
 await browser.close()
}

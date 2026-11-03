import fs from 'node:fs';
import {chromium} from 'playwright';
const out='artifacts/video-action/v112-actor';
fs.mkdirSync(out,{recursive:true});
const model=process.env.MVAI_MODEL||'a0';
const report={model,date:new Date().toISOString(),checks:{},errors:[],success:false};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--js-flags=--max-old-space-size=4096']});
const page=await browser.newPage({viewport:{width:1420,height:960}});
page.on('pageerror',e=>report.errors.push(String(e)));
try{
 await page.goto(process.env.MVAI_BASE_URL||'http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:50000});
 await page.waitForFunction(()=>document.querySelectorAll('#sample-list-a button[data-clip-id]').length===6&&document.querySelectorAll('#sample-list-b button[data-clip-id]').length===6,null,{timeout:90000});
 await page.locator('#sample-list-a button[data-action="wave"]').click();
 await page.waitForFunction(()=>document.querySelector('#video')?.readyState>=2&&document.querySelector('#video')?.videoWidth>0,null,{timeout:40000});
 await page.locator('#model').selectOption(model);
 await page.locator('#run').click();
 await page.waitForFunction(()=>{
  const e=document.querySelector('#run'),status=document.querySelector('#status')?.textContent||'';
  return !e?.disabled&&(status.includes('真实推理已返回')||status.includes('真实推理未完成'));
 },null,{timeout:660000});
 report.status=await page.locator('#status').innerText();
 const diag=JSON.parse(await page.locator('#diagnostics').textContent()||'{}');
 report.diagnostics=diag.inference?.actorMode?{
  variant:diag.inference.variant,actorMode:diag.inference.actorMode,
  trackPoints:diag.inference.trackPoints,frames:diag.inference.frames,
  analyzedSeconds:diag.inference.analyzedSeconds,
  framePoints:diag.inference.frameTop1?.length,
  actualBoxes:diag.inference.frameTop1?.filter(x=>!!x.personBox).length,
  timeline:diag.inference.actionSegments?.length,
  top1:diag.inference.top5?.[0]
 }:null;
 report.error=diag.inference_error?.message||null;
 report.checks.actorMode=diag.inference?.actorMode==='tracked-person-crop';
 report.checks.trackExists=diag.inference?.trackPoints>=8;
 report.checks.realModel=model===diag.inference?.variant&&
   diag.inference?.top5?.length===5&&report.status.includes('真实推理已返回');
 report.checks.modelSource=model==='mobileclip_s2'?
   diag.model_compiled?.source==='Xenova/mobileclip_s2':true;
 report.checks.modelIdentity=model==='mobileclip_s2'?
   diag.model_compiled?.modelName==='Apple MobileCLIP-S2':true;
 report.checks.videoCoverage=diag.inference?.analyzedSeconds>0&&diag.inference?.frames>0;
 report.checks.timeline=await page.locator('#action-timeline').isVisible();
 report.checks.boxesUsedForInference=model.startsWith('a')?
   diag.inference?.frameTop1?.some(x=>!!x.personBox):
   diag.inference?.frameTop1?.length>=1&&diag.inference?.classificationMode?.startsWith('windowed');
 report.checks.stored06=await page.locator('#compare-choices input[value="'+model+'"]').isEnabled();
 await page.locator('#annotated-video').evaluate(v=>{v.pause();v.currentTime=1});
 await page.waitForTimeout(500);
 report.checks.boxPlayback=await page.locator('#person-detector-status').innerText().then(x=>!x.includes('加载失败'));
 // Assert real pixel-level overlay, not just a detector-ready status or a CSS element.
 const canvasHasActorStroke=()=>page.locator('#person-box-layer').evaluate(canvas=>{
   if(!canvas.width||!canvas.height)return false;
   const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
   let stroke=0;
   for(let k=0;k<pixels.length;k+=4){
     if(pixels[k]>=35&&pixels[k]<110&&pixels[k+1]>175&&
        pixels[k+2]>110&&pixels[k+2]<220&&pixels[k+3]>160)stroke++;
     if(stroke>=20)return true;
   }
   return false;
 });
 report.checks.actualBoxPixels=await canvasHasActorStroke();
 report.checks.boxLabelReplacesCorner=await page.locator('#top1-overlay').evaluate(el=>el.hidden);
 // A user may hide boxes. Classification must remain visible, never disappear.
 await page.locator('#person-box-toggle').uncheck();
 report.checks.boxOffKeepsResult=await page.locator('#top1-overlay').isVisible();
 report.checks.boxOffClearsCanvas=!(await canvasHasActorStroke());
 await page.locator('#person-box-toggle').check();
 report.checks.boxOnRestoresPixels=await canvasHasActorStroke();

 if(process.env.MVAI_LONG_VIDEO){
   await page.locator('#upload').setInputFiles(process.env.MVAI_LONG_VIDEO);
   await page.waitForFunction(()=>document.querySelector('#video')?.readyState>=2&&document.querySelector('#video')?.videoWidth>0,null,{timeout:35000});
   const duration=await page.locator('#video').evaluate(v=>v.duration);
   if(!(duration>=12))throw Error('Extended actor video must have >=12s, got '+duration);
   await page.locator('#run').click();
   await page.waitForFunction(()=>{
    const run=document.querySelector('#run'),status=document.querySelector('#status')?.textContent||'';
    return !run?.disabled&&(/真实推理已返回|真实推理未完成/.test(status));
   },null,{timeout:720000});
   const diag2=JSON.parse(await page.locator('#diagnostics').textContent()||'{}');
   const inf=diag2.inference;
   report.long={
    duration:inf?.analyzedSeconds,frames:inf?.frames,
    actorMode:inf?.actorMode,windows:inf?.frameTop1?.length,
    lastTime:inf?.frameTop1?.at(-1)?.t,
    lastValidTime:inf?.frameTop1?.filter(x=>!x.missing)?.at(-1)?.t,
    personBoxes:inf?.frameTop1?.filter(x=>!!x.personBox)?.length
   };
   report.checks.longModelGenuine=inf?.actorMode==='tracked-person-crop'&&inf?.variant===model&&inf?.frames>0;
   report.checks.longFullyTraversed=inf?.analyzedSeconds>=12&&inf?.frameTop1?.at(-1)?.t>8;
   report.checks.longPersonInferenceBeyond8=inf?.frameTop1?.some(x=>!x.missing&&x.t>8);
   report.checks.longTimeline=await page.locator('#action-timeline').isVisible();
   await page.screenshot({path:out+'/'+model+'-long-actor.png',fullPage:true});
 }
 report.success=Object.values(report.checks).every(Boolean)&&report.errors.length===0;
 if(!report.success)process.exitCode=1;
 await page.screenshot({path:out+'/'+model+'-tracked-person.png',fullPage:true});
}catch(e){report.error=String(e);process.exitCode=1;try{report.status=await page.locator('#status').innerText()}catch{}try{await page.screenshot({path:out+'/'+model+'-failure.png',fullPage:true})}catch{}}
finally{fs.writeFileSync(out+'/'+model+'.json',JSON.stringify(report,null,2));console.log('V112_ACTOR_REAL',JSON.stringify(report).slice(0,8500));await browser.close();}

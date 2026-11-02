import fs from 'node:fs';
import {chromium} from 'playwright';
const out='artifacts/video-action/v111-full-duration';
fs.mkdirSync(out,{recursive:true});
const report={checkedAt:new Date().toISOString(),checks:{},errors:[],success:false};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--js-flags=--max-old-space-size=4096']});
const page=await browser.newPage({viewport:{width:1430,height:950}});
page.on('pageerror',e=>report.errors.push(String(e)));
const source=process.env.MVAI_BASE_URL||'http://127.0.0.1:8765/';
async function runAndValidate(seconds,modelId='a0'){
 await page.locator('#model').selectOption(modelId);
 await page.locator('#person-box-toggle').evaluate(el=>{el.checked=false;el.dispatchEvent(new Event('change',{bubbles:true}))});
 await page.locator('#run').click();
 await page.waitForFunction(()=>{
  const status=document.querySelector('#status')?.textContent||'';
  return !document.querySelector('#run').disabled&&(/真实推理已返回|真实推理未完成/.test(status));
 },null,{timeout:300000});
 const status=await page.locator('#status').innerText();
 if(!status.includes('真实推理已返回'))throw Error('Continuous inference failed: '+status);
 const details=JSON.parse(await page.locator('#diagnostics').textContent()||'{}');
 const inf=details.inference;
 if(!inf||inf.variant!==modelId)throw Error('Unexpected inference result for '+modelId);
 if(Math.abs(inf.analyzedSeconds-seconds)>.25)throw Error('Truncated duration: '+inf.analyzedSeconds+' != '+seconds);
 if(inf.frames!==Math.ceil(inf.analyzedSeconds*5-1e-8))throw Error('Incorrect full frame count '+inf.frames);
 if(inf.frameTop1.length!==inf.frames)throw Error('Missing time-indexed frame logits');
 if(seconds>8.2&&inf.frameTop1.at(-1).t<=8)throw Error('No real prediction after 8 seconds');
 if(!await page.locator('#action-timeline').isVisible())throw Error('Timeline not visible');
 if(!await page.locator('#timeline-track button').count())throw Error('No segments from actual model');
 const time=inf.analyzedSeconds-.7;
 await page.locator('#annotated-video').evaluate((v,t)=>{v.pause();v.currentTime=t},time);
 await page.waitForFunction(t=>document.querySelector('#annotated-video')?.currentTime>=t-.2,time,{timeout:12000});
 await page.waitForTimeout(350);
 const overlay=await page.locator('#top1-overlay').innerText();
 if(overlay.includes('超出已分析范围'))throw Error('Overlay was still truncated at 8 seconds');
 const cursor=await page.locator('#timeline-cursor').evaluate(el=>Number.parseFloat(el.style.left));
 if(cursor<80)throw Error('Timeline cursor did not follow playback '+cursor);
 return {model:modelId,frames:inf.frames,duration:inf.analyzedSeconds,lastTime:inf.frameTop1.at(-1).t,
   segments:inf.actionSegments?.length,cursor,top5:inf.top5.slice(0,2)};
}
try{
 await page.goto(source,{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForFunction(()=>document.querySelectorAll('#sample-list button[data-clip-id]').length===6,null,{timeout:45000});
 await page.locator('#sample-list button[data-action="sleep_posture"]').click();
 await page.waitForFunction(()=>document.querySelector('#video')?.readyState>=2&&document.querySelector('#video')?.videoWidth>0,null,{timeout:35000});
 const sampleLength=await page.locator('#video').evaluate(v=>v.duration);
 if(sampleLength<=0)throw Error('No valid real HF demo duration');
 report.realHFSample=await runAndValidate(sampleLength);
 report.checks.realHFFullDuration=true;
 report.checks.oneModelOnly=await page.locator('#compare-run').count()===0&&
   await page.locator('#compare-choices input[value="a0"]').isEnabled();
 await page.screenshot({path:out+'/hf-10-second-full-timeline.png',fullPage:true});
 const file=process.env.MVAI_LONG_VIDEO;
 if(file){
   await page.locator('#upload').setInputFiles(file);
   await page.waitForFunction(()=>document.querySelector('#video')?.readyState>=2&&document.querySelector('#video')?.videoWidth>0,null,{timeout:30000});
   const duration=await page.locator('#video').evaluate(v=>v.duration);
   if(duration<20)throw Error('Extended upload test must be >=20 seconds: '+duration);
   report.longUpload=await runAndValidate(duration);
   report.checks.longVideo20Plus=true;
   report.checks.timelineEndsAtRealVideoLength=report.longUpload.duration>=20&&
     report.longUpload.lastTime>19;
   await page.screenshot({path:out+'/uploaded-full-length-timeline.png',fullPage:true});
   if(process.env.MVAI_VERIFY_ALL_MOVINET==='1'){
     report.longA1=await runAndValidate(duration,'a1');
     report.longA2=await runAndValidate(duration,'a2');
     report.checks.allThreeStreamingModelsFullVideo=[report.longUpload,report.longA1,report.longA2]
       .every(x=>x.frames>=100&&x.lastTime>19&&x.duration>=20);
     await page.screenshot({path:out+'/a2-24sec-timeline.png',fullPage:true});
   }
 }
 report.success=Object.values(report.checks).every(Boolean)&&report.errors.length===0;
 if(!report.success)process.exitCode=1;
}catch(e){
 report.error=String(e);process.exitCode=1;
 try{report.status=await page.locator('#status').innerText()}catch{}
 try{await page.screenshot({path:out+'/failure.png',fullPage:true})}catch{}
}finally{
 fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));
 console.log('V111_FULL_VIDEO',JSON.stringify(report).slice(0,10500));
 await browser.close();
}

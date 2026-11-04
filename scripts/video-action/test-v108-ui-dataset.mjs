import {chromium} from 'playwright';
import fs from 'node:fs';
const root=process.env.MVAI_BASE_URL||'http://127.0.0.1:8765/';
const dir='artifacts/video-action/v108-ui-catalog';
fs.mkdirSync(dir,{recursive:true});
const report={baseUrl:root,checkedAt:new Date().toISOString(),checks:{},samples:{},pageErrors:[],success:false};
const expected={
 A:[['wave','挥手','Waving Hand'],['using_phone','用手机','Using Phone'],['falling','摔倒','Falling Down'],['eating','吃东西','Eating Food'],['sleep_posture','睡觉','Sleeping'],['smoking','抽烟','Smoking']],
 B:[['jogging','慢跑','Jogging'],['yoga','瑜伽','Yoga'],['push_up','俯卧撑','Push Up'],['sit_up','仰卧起坐','Situp'],['ballet','芭蕾舞','Dancing Ballet'],['hula_hooping','呼啦圈','Hula Hooping']]
};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1390,height:950}});
page.on('pageerror',error=>report.pageErrors.push(String(error)));
try{
 const response=await page.goto(root,{waitUntil:'domcontentloaded',timeout:60000});
 report.checks.pageHttp200=response?.status()===200;
 const load=await page.waitForFunction(()=>{
   const a=[...document.querySelectorAll('#sample-list-a button[data-clip-id]')];
   const b=[...document.querySelectorAll('#sample-list-b button[data-clip-id]')];
   const err=document.querySelector('#sample-status')?.textContent||'';
   if(/目录加载失败|暂无可用|样例目录加载失败/.test(err))return 'error';
   return a.length===6&&b.length===6?'ready':null;
 },null,{timeout:90000});
 if(await load.jsonValue()!=='ready')throw Error('A/B HF Dataset sample catalog incomplete: '+await page.locator('#sample-status').innerText());
 report.checks.AHasSixSamples=await page.locator('#sample-list-a button[data-clip-id]').count()===6;
 report.checks.BHasSixSamples=await page.locator('#sample-list-b button[data-clip-id]').count()===6;
 report.checks.ABHeadings=await page.locator('.sample-group').innerText().then(t=>t.includes('A类')&&t.includes('B类'));
 for(const [group,items] of Object.entries(expected)){
   const list=group==='A'?'#sample-list-a':'#sample-list-b';
   for(const [id,zh,en] of items){
     const btn=page.locator(list+' button[data-action="'+id+'"]');
     const text=(await btn.innerText()).replace(/\s+/g,' ').trim();
     report.checks[group+'_'+id+'_bilingual']=text.includes(zh)&&text.includes(en);
     report.checks[group+'_'+id+'_enabled']=await btn.getAttribute('data-clip-id')!==null;
   }
 }
 report.checks.singleModel02=await page.locator('#model').evaluate(el=>
   !el.closest('section.panel').querySelector('#compare-choices')&&
   !el.closest('section.panel').querySelector('#compare-run'));
 report.checks.choicesIn06=await page.locator('#compare-choices').evaluate(el=>
   el.closest('section.panel')?.textContent.includes('06 · 模型结果对比'));
 report.checks.helpHiddenInitially=await page.locator('#compare-help').isHidden();
 await page.locator('#compare-info').click();
 report.checks.helpOpens=await page.locator('#compare-help').isVisible()&&
   await page.locator('#compare-info').getAttribute('aria-expanded')==='true';
 await page.locator('#compare-info').click();
 report.checks.helpCloses=await page.locator('#compare-help').isHidden();
 report.checks.sixModels=await page.locator('#compare-choices input[type="checkbox"]').count()===6;
 report.checks.initialNoneSelected=await page.locator('#compare-choices input:checked').count()===0;
 report.checks.initiallyUnavailable=await page.locator('#compare-choices input:not(:disabled)').count()===0;
 report.checks.noUnrunResults=await page.locator('#comparison-results table').count()===0;

 // Playback QA for all twelve curated samples: duration, source, resolution and
 // canvas readability are checked without running or changing any inference model.
 for(const [group,items] of Object.entries(expected)){
  const list=group==='A'?'#sample-list-a':'#sample-list-b';
  for(const [id,zh,en] of items){
   const key=group+'_'+id;
   await page.locator(list+' button[data-action="'+id+'"]').click();
   await page.waitForFunction(()=>{
     const v=document.querySelector('#video');
     return !!(v&&(v.error||v.readyState>=2&&v.videoWidth>0&&v.duration>0));
   },null,{timeout:60000});
   const media=await page.locator('#video').evaluate(v=>{
     let canvasReadable=false,canvasError=null;
     try{
       const c=document.createElement('canvas');c.width=2;c.height=2;
       const ctx=c.getContext('2d');ctx.drawImage(v,0,0,2,2);
       ctx.getImageData(0,0,1,1);canvasReadable=true;
     }catch(e){canvasError=String(e)}
     return {width:v.videoWidth,height:v.videoHeight,duration:v.duration,
       error:v.error?{code:v.error.code,message:v.error.message}:null,
       src:v.currentSrc,canvasReadable,canvasError};
   });
   report.samples[key]=media;
   report.checks[key+'_decodes']=!media.error&&media.width>0&&media.height>0;
   const minDuration=id==='smoking'?5:8;
   report.checks[key+'_duration']=Math.round(media.duration)>=minDuration&&Math.round(media.duration)<=12;
   report.checks[key+'_720p']=media.width>=1280&&media.height>=720;
   report.checks[key+'_canvasReadable']=media.canvasReadable;
   report.checks[key+'_hasExpectedSource']=media.src.includes('/datasets/multimodal-vision-ai/mvai-daily-action-demo/')||media.src.startsWith('https://videos.pexels.com/video-files/');
  }
 }
 report.success=Object.values(report.checks).every(Boolean)&&report.pageErrors.length===0;
 await page.screenshot({path:dir+'/review-layout.png',fullPage:true});
 if(!report.success)process.exitCode=1;
}catch(e){
 report.failure=String(e);
 try{report.sampleStatus=await page.locator('#sample-status').innerText()}catch{}
 try{report.catalogStatus=await page.locator('#provenance').innerText()}catch{}
 try{await page.screenshot({path:dir+'/failure.png',fullPage:true})}catch{}
 process.exitCode=1;
}finally{
 fs.writeFileSync(dir+'/report.json',JSON.stringify(report,null,2));
 console.log('V113_UI_DATASET',JSON.stringify(report).slice(0,18000));
 await browser.close();
}

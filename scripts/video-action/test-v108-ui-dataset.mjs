import {chromium} from 'playwright';
import fs from 'node:fs';
const root=process.env.MVAI_BASE_URL||'http://127.0.0.1:8765/';
const dir='artifacts/video-action/v108-ui-catalog';
fs.mkdirSync(dir,{recursive:true});
const report={baseUrl:root,checkedAt:new Date().toISOString(),checks:{},pageErrors:[],success:false};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1390,height:950}});
page.on('pageerror',error=>report.pageErrors.push(String(error)));
try{
 const response=await page.goto(root,{waitUntil:'domcontentloaded',timeout:60000});
 report.checks.pageHttp200=response?.status()===200;
 const load=await page.waitForFunction(()=>{
   const bs=[...document.querySelectorAll('#sample-list button[data-clip-id]')];
   const err=document.querySelector('#sample-status')?.textContent||'';
   if(/目录加载失败|暂无可用|样例目录加载失败/.test(err))return 'error';
   return bs.length===6?'ready':null;
 },null,{timeout:70000});
 if(await load.jsonValue()!=='ready')throw Error('HF Dataset sample catalog failed: '+await page.locator('#sample-status').innerText());
 report.checks.allSixDatasetSamples=await page.locator('#sample-list button[data-clip-id]').count()===6;
 report.checks.sampleNames=(await page.locator('#sample-list button').allTextContents()).join('、')==='挥手、看手机、打电话、摔倒、吃东西、睡觉';
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
 report.checks.fiveModels=await page.locator('#compare-choices input[type="checkbox"]').count()===5;
 report.checks.initialNoneSelected=await page.locator('#compare-choices input:checked').count()===0;
 report.checks.initiallyUnavailable=await page.locator('#compare-choices input:not(:disabled)').count()===0;
 report.checks.noUnrunResults=await page.locator('#comparison-results table').count()===0;
 await page.locator('#sample-list button[data-action="phone_use"]').click();
 await page.waitForFunction(()=>{
   const v=document.querySelector('#video');
   return v?.error||v?.readyState>=2&&v.videoWidth>0&&v.duration>0;
 },null,{timeout:55000});
 report.media=await page.locator('#video').evaluate(v=>({
   width:v.videoWidth,height:v.videoHeight,duration:v.duration,
   error:v.error?.message??null,src:v.currentSrc
 }));
 report.checks.realSampleDecodes=!report.media.error&&report.media.width>0&&
   report.media.height>0&&report.media.duration>0;
 report.checks.datasetSource=report.media.src.includes('/datasets/multimodal-vision-ai/mvai-daily-action-demo/');
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
 console.log('V108_UI_DATASET',JSON.stringify(report).slice(0,8500));
 await browser.close();
}

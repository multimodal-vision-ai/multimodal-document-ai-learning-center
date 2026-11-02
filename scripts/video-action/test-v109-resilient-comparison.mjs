import {chromium} from 'playwright';
import fs from 'node:fs';
const dir='artifacts/video-action/v109-resilient-comparison';
fs.mkdirSync(dir,{recursive:true});
const pageErrors=[];
const report={checkedAt:new Date().toISOString(),success:false,checks:{},failures:[],pageErrors};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1400,height:950}});
page.on('pageerror',e=>pageErrors.push(String(e)));
try{
  await page.route(url=>String(url).includes('/qualcomm/Video-MAE/resolve/')&&String(url).includes('/Video-MAE.tflite'),route=>{
    report.failures.push('VideoMAE model download intercepted as HTTP 503');
    return route.fulfill({status:503,contentType:'text/plain',body:'Simulated model-source outage'});
  });
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelectorAll('#sample-list button[data-clip-id]').length===6,null,{timeout:50000});
  await page.locator('#sample-list button[data-action="sleep_posture"]').click();
  await page.waitForFunction(()=>{
    const v=document.querySelector('#video');
    return v?.readyState>=2&&v.videoWidth>0;
  },null,{timeout:40000});
  await page.locator('#compare-choices input[value="a0"]').uncheck();
  await page.locator('#compare-choices input[value="mobileclip_s0"]').check();
  await page.locator('#compare-choices input[value="videomae"]').check();
  report.checks.threeSelected=JSON.stringify(await page.locator('#compare-choices input:checked').evaluateAll(es=>es.map(e=>e.value)))
    ===JSON.stringify(['a2','videomae','mobileclip_s0']);
  report.checks.largeModelNotice=await page.locator('#model option[value="videomae"]').count()===1;
  await page.locator('#person-box-toggle').evaluate(el=>{el.checked=false;el.dispatchEvent(new Event('change',{bubbles:true}))});
  await page.locator('#compare-run').click();
  await page.waitForFunction(()=>{
    const s=document.querySelector('#status')?.textContent||'';
    return s.includes('对比已结束：')||s.includes('所选模型对比未完成')||s.includes('已取消对比');
  },null,{timeout:360000});
  report.finalStatus=await page.locator('#status').innerText();
  const rows=await page.locator('#comparison-results table tr').evaluateAll(
    es=>es.slice(1).map(row=>Array.from(row.querySelectorAll('td'),cell=>cell.textContent))
  );
  report.rows=rows;
  report.checks.failedButContinued=report.finalStatus.includes('2 个成功，1 个失败');
  report.checks.threeRows=rows.length===3;
  report.checks.a2Success=rows[0]?.[0]==='MoViNet-A2'&&rows[0]?.[1]!=='尚未运行'&&rows[0]?.[2]!=='—';
  report.checks.videoMAEFailure=rows[1]?.[0]==='Qualcomm VideoMAE'&&rows[1]?.[1]?.includes('失败：');
  report.checks.mobileclipSuccess=rows[2]?.[0]==='Apple MobileCLIP-S0'&&rows[2]?.[2]!=='—';
  report.checks.mainSelectorRestored=await page.locator('#model').inputValue()==='a0';
  report.checks.mainDescriptionRestored=(await page.locator('#model-description').innerText()).includes('MoViNet')||
    (await page.locator('#model-description').innerText()).includes('Kinetics-600');
  report.checks.buttonReenabled=await page.locator('#compare-run').isEnabled();
  report.checks.noUnexpectedExceptions=pageErrors.length===0;
  report.success=Object.values(report.checks).every(Boolean);
  if(!report.success)process.exitCode=1;
  await page.screenshot({path:dir+'/three-models-one-source-failed.png',fullPage:true});
}catch(e){
  report.error=String(e);
  try{report.lastStatus=await page.locator('#status').innerText()}catch{}
  try{await page.screenshot({path:dir+'/failure.png',fullPage:true})}catch{}
  process.exitCode=1;
}finally{
 fs.writeFileSync(dir+'/report.json',JSON.stringify(report,null,2));
 console.log('V109_RESILIENT_COMPARE',JSON.stringify(report).slice(0,8000));
 await browser.close();
}

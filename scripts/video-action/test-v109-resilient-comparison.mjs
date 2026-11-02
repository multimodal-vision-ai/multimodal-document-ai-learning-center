import {chromium} from 'playwright';
import fs from 'node:fs';
const dir='artifacts/video-action/v109-resilient-comparison';
fs.mkdirSync(dir,{recursive:true});
const report={checkedAt:new Date().toISOString(),checks:{},failures:[],pageErrors:[],success:false};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1400,height:950}});
page.on('pageerror',error=>report.pageErrors.push(String(error)));
async function run(variant){
 await page.locator('#model').selectOption(variant);
 await page.locator('#run').click();
 await page.waitForFunction(()=>{
   const status=document.querySelector('#status')?.textContent||'';
   return !document.querySelector('#run').disabled&&(/真实推理已返回|真实推理未完成/.test(status));
 },null,{timeout:320000});
 return page.locator('#status').innerText();
}
try{
 await page.route(url=>String(url).includes('/qualcomm/Video-MAE/resolve/')&&String(url).includes('/Video-MAE.tflite'),route=>{
   report.failures.push('Simulated VideoMAE model HTTP 503');
   return route.fulfill({status:503,contentType:'text/plain',body:'Simulated model-source outage'});
 });
 await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelectorAll('#sample-list button[data-clip-id]').length===6,null,{timeout:50000});
 await page.locator('#sample-list button[data-action="sleep_posture"]').click();
 await page.waitForFunction(()=>document.querySelector('#video')?.readyState>=2&&document.querySelector('#video')?.videoWidth>0,null,{timeout:40000});
 await page.locator('#person-box-toggle').evaluate(el=>{el.checked=false;el.dispatchEvent(new Event('change',{bubbles:true}))});
 const a2=await run('a2');
 report.checks.a2Completed=a2.includes('真实推理已返回');
 const mae=await run('videomae');
 report.checks.maeFailed=mae.includes('真实推理未完成')&&mae.includes('HTTP 503');
 report.checks.failedNotSelectable=await page.locator('#compare-choices input[value="videomae"]').isDisabled();
 report.checks.a2Retained=await page.locator('#compare-choices input[value="a2"]').isEnabled();
 const mobile=await run('mobileclip_s0');
 report.checks.mobileclipCompleted=mobile.includes('真实推理已返回');
 await page.locator('#compare-choices input[value="a2"]').check();
 await page.locator('#compare-choices input[value="mobileclip_s0"]').check();
 report.rows=await page.locator('#comparison-results table tr').evaluateAll(rows=>rows.slice(1).map(row=>[...row.querySelectorAll('td')].map(td=>td.textContent)));
 report.checks.successfulRowsOnly=report.rows.length===2&&
    report.rows[0][0]==='MoViNet-A2'&&report.rows[1][0]==='Apple MobileCLIP-S0'&&
    report.rows.every(row=>row[2]!=='—');
 report.checks.noRerunButton=await page.locator('#compare-run').count()===0;
 report.checks.singleModelSelectorUnchanged=await page.locator('#model').inputValue()==='mobileclip_s0';
 report.checks.canRunNext=await page.locator('#run').isEnabled();
 report.checks.noUnexpectedExceptions=report.pageErrors.length===0;
 report.success=Object.values(report.checks).every(Boolean);
 if(!report.success)process.exitCode=1;
 await page.screenshot({path:dir+'/failed-model-excluded-from-stored-results.png',fullPage:true});
}catch(e){report.error=String(e);process.exitCode=1;try{await page.screenshot({path:dir+'/failure.png',fullPage:true})}catch{}}
finally{
 fs.writeFileSync(dir+'/report.json',JSON.stringify(report,null,2));
 console.log('V109_RESILIENT_COMPARE',JSON.stringify(report).slice(0,8500));
 await browser.close();
}

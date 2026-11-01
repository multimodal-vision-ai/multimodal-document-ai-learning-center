import {chromium} from 'playwright';
import fs from 'node:fs';
const dir='artifacts/video-action/v106-selective';
fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1400,height:950}});
const report={testedAt:new Date().toISOString(),type:'selectable-1-to-3-real-model-comparison',success:false,checks:{},errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
const get=async()=>page.locator('#compare-choices input:checked').evaluateAll(es=>es.map(e=>e.value));
const rows=async()=>page.locator('#comparison-results table tr').evaluateAll(es=>es.slice(1).map(e=>e.querySelector('td')?.textContent));
async function waitRun(n){
  await page.locator('#compare-run').click();
  await page.waitForFunction((number)=>{
    const s=document.querySelector('#status')?.textContent||'';
    return s.includes('已完成 '+number+' 个所选模型')||s.includes('所选模型对比未完成');
  },n,{timeout:240000});
  const status=await page.locator('#status').innerText();
  if(!status.includes('已完成 '+n+' 个所选模型'))throw Error(status);
}
try{
 await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelectorAll('#sample-list button[data-clip-id]').length===6,null,{timeout:35000});
 report.checks.defaults=JSON.stringify(await get())===JSON.stringify(['a0','a2']);
 await page.locator('#compare-choices input[value="a0"]').uncheck();
 report.checks.singleSelection=JSON.stringify(await get())===JSON.stringify(['a2']);
 await page.locator('#compare-choices input[value="a2"]').uncheck();
 report.checks.emptyDisablesRun=!(await page.locator('#compare-run').isEnabled())&&
   (await page.locator('#compare-selection-status').innerText()).includes('至少选择');
 await page.locator('#compare-choices input[value="a0"]').check();
 await page.locator('#compare-choices input[value="a1"]').check();
 await page.locator('#compare-choices input[value="a2"]').check();
 report.checks.threeSelected=(await get()).length===3;
 report.checks.fourthModelBlocked=await page.locator('#compare-choices input[value="videomae"]').isDisabled();
 await page.locator('#compare-choices input[value="a1"]').uncheck();
 report.checks.fourthBecomesAvailable=await page.locator('#compare-choices input[value="videomae"]').isEnabled();
 report.checks.twoSelected=JSON.stringify(await get())===JSON.stringify(['a0','a2']);
 await page.locator('#sample-list button[data-action="falling"]').click();
 await page.waitForFunction(()=>{const v=document.querySelector('#video');return v.readyState>=2&&v.videoWidth>0},null,{timeout:30000});
 await waitRun(2);
 report.checks.twoModelsActuallyRun=JSON.stringify(await rows())===JSON.stringify(['MoViNet-A0','MoViNet-A2']);
 report.rowsAfterTwo=await rows();
 await page.screenshot({path:dir+'/two-model-comparison.png',fullPage:true});
 // New selection should display only chosen A1 and A2; A0 result may be cached but must not appear.
 await page.locator('#compare-choices input[value="a0"]').uncheck();
 await page.locator('#compare-choices input[value="a1"]').check();
 report.checks.changedView=JSON.stringify(await rows())===JSON.stringify(['MoViNet-A1','MoViNet-A2']);
 await waitRun(2);
 report.checks.a1A2ActuallyRun=JSON.stringify(await rows())===JSON.stringify(['MoViNet-A1','MoViNet-A2']);
 report.rowsAfterSwap=await rows();
 await page.screenshot({path:dir+'/changed-selection.png',fullPage:true});
 report.checks.restoredModel=await page.locator('#model').inputValue()==='a0';
 report.success=Object.values(report.checks).every(Boolean)&&report.errors.length===0;
 if(!report.success)process.exitCode=1;
}catch(e){report.error=String(e);process.exitCode=1}
finally{
 fs.writeFileSync(dir+'/report.json',JSON.stringify(report,null,2));
 console.log('SELECTIVE_COMPARE_SUMMARY',JSON.stringify({success:report.success,checks:report.checks,error:report.error,errors:report.errors}));
 await browser.close();
}

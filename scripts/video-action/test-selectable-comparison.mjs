import {chromium} from 'playwright';
import fs from 'node:fs';
const dir='artifacts/video-action/v106-selective';
fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1400,height:950}});
const report={testedAt:new Date().toISOString(),success:false,checks:{},errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
const selected=()=>page.locator('#compare-choices input:checked').evaluateAll(es=>es.map(e=>e.value));
const rows=()=>page.locator('#comparison-results table tr').evaluateAll(es=>es.slice(1).map(e=>e.querySelector('td')?.textContent));
async function run(id){
 await page.locator('#model').selectOption(id);
 await page.locator('#run').click();
 await page.waitForFunction(()=>{
   const s=document.querySelector('#status')?.textContent||'';
   return !document.querySelector('#run').disabled&&(s.includes('真实推理已返回')||s.includes('真实推理未完成'));
 },null,{timeout:190000});
 if(!(await page.locator('#status').innerText()).includes('真实推理已返回'))throw Error(id+' inference failed');
}
try{
 await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelectorAll('#sample-list button[data-clip-id]').length===6,null,{timeout:35000});
 report.checks.noneInitiallySelected=(await selected()).length===0;
 report.checks.allDisabledInitially=await page.locator('#compare-choices input:not(:disabled)').count()===0;
 await page.locator('#sample-list button[data-action="falling"]').click();
 await page.waitForFunction(()=>document.querySelector('#video')?.readyState>=2&&document.querySelector('#video')?.videoWidth>0,null,{timeout:30000});
 await run('a0');
 report.checks.onlyA0Available=await page.locator('#compare-choices input[value="a0"]').isEnabled()&&
    await page.locator('#compare-choices input[value="a1"]').isDisabled();
 await run('a2');
 report.checks.a0A2Available=await page.locator('#compare-choices input[value="a0"]').isEnabled()&&
    await page.locator('#compare-choices input[value="a2"]').isEnabled();
 await page.locator('#compare-choices input[value="a2"]').check();
 report.checks.singleSelection=JSON.stringify(await selected())===JSON.stringify(['a2'])&&
    JSON.stringify(await rows())===JSON.stringify(['MoViNet-A2']);
 await page.locator('#compare-choices input[value="a0"]').check();
 report.checks.twoSelected=(await selected()).length===2&&
    JSON.stringify(await rows())===JSON.stringify(['MoViNet-A0','MoViNet-A2']);
 await page.locator('#compare-choices input[value="a0"]').uncheck();
 report.checks.reselection=JSON.stringify(await selected())===JSON.stringify(['a2'])&&
    JSON.stringify(await rows())===JSON.stringify(['MoViNet-A2']);
 report.checks.noRunIn06=await page.locator('#compare-run').count()===0;
 await page.screenshot({path:dir+'/two-stored-models.png',fullPage:true});
 report.success=Object.values(report.checks).every(Boolean)&&report.errors.length===0;
 if(!report.success)process.exitCode=1;
}catch(e){report.error=String(e);process.exitCode=1}
finally{fs.writeFileSync(dir+'/report.json',JSON.stringify(report,null,2));
 console.log('SELECTIVE_COMPARE_SUMMARY',JSON.stringify(report).slice(0,8500));
 await browser.close();}

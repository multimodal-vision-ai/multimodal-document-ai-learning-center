import fs from 'node:fs';
import {chromium} from 'playwright';
const dir='artifacts/video-action/v106-video-mae-hf';
fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--js-flags=--max-old-space-size=4096']});
const page=await browser.newPage({viewport:{width:1440,height:950}});
const report={time:new Date().toISOString(),type:'real-HF-Qualcomm-VideoMAE-browser-integration',passed:false,checks:{},errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
try{
 await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>document.querySelectorAll('#sample-list button[data-clip-id]').length===6,null,{timeout:35000});
 report.options=await page.locator('#model option').allTextContents();
 report.checks.hasFourthModel=report.options.length===4&&report.options[3].includes('VideoMAE');
 await page.locator('#sample-list button[data-action="eating"]').click();
 await page.waitForFunction(()=>{const v=document.querySelector('#video');return v.readyState>=2&&v.videoWidth>0},null,{timeout:35000});
 await page.locator('#model').selectOption('videomae');
 await page.locator('#run').click();
 await page.waitForFunction(()=>!document.querySelector('#run').disabled,null,{timeout:240000});
 const st=await page.locator('#status').innerText();
 const inference=JSON.parse(await page.locator('#diagnostics').innerText()||'{}').inference;
 report.checks.hfVideoMAERealInference=st.includes('VideoMAE 已完成 16 帧')&&inference?.variant==='videomae'&&
   inference?.classificationMode==='clip'&&inference?.labelSet==='K400'&&inference?.frames===1&&
   inference?.frameTop1?.length===1&&inference?.top5?.length===5&&inference?.modelSha256==='f484347d2d11bc132f40781615731730c5c8519a1ba9684e55114e889714a343';
 report.qualcomm={status:st,inference};
 report.checks.clipModeVisible=(await page.locator('#annotation-summary').innerText()).includes('16 帧做一次整段动作分类');
 await page.screenshot({path:dir+'/videomae-clip-eating.png',fullPage:true});
 // Mixed K600/K400 on the SAME clip, no attempt to align nonexistent class IDs.
 await page.locator('#compare-choices input[value="a0"]').uncheck();
 await page.locator('#compare-choices input[value="a2"]').uncheck();
 await page.locator('#compare-choices input[value="videomae"]').check();
 await page.locator('#compare-choices input[value="a0"]').check();
 await page.locator('#compare-run').click();
 await page.waitForFunction(()=>{
   const s=document.querySelector('#status')?.textContent||'';
   return s.includes('已完成 2 个所选模型')||s.includes('所选模型对比未完成');
 },null,{timeout:260000});
 report.compareStatus=await page.locator('#status').innerText();
 report.table=await page.locator('#comparison-results table tr').evaluateAll(es=>es.slice(1).map(r=>Array.from(r.querySelectorAll('td'),x=>x.textContent)));
 report.checks.mixedCompareDone=report.compareStatus.includes('已完成 2 个所选模型')&&
    report.table.length===2&&report.table[0][0]==='MoViNet-A0'&&report.table[1][0]==='Qualcomm VideoMAE';
 report.checks.noUnexpectedBrowserErrors=report.errors.length===0;
 await page.screenshot({path:dir+'/mixed-k400-k600-real-compare.png',fullPage:true});
 report.passed=Object.values(report.checks).every(Boolean);
 if(!report.passed)process.exitCode=1;
}catch(e){report.error=String(e);process.exitCode=1}
finally{
 fs.writeFileSync(dir+'/report.json',JSON.stringify(report,null,2));
 console.log('VIDEOMAE_HF_BROWSER_SUMMARY',JSON.stringify({passed:report.passed,checks:report.checks,top1:report.qualcomm?.inference?.top5?.[0],compare:report.table,error:report.error,errors:report.errors}).slice(0,9000));
 await browser.close()
}

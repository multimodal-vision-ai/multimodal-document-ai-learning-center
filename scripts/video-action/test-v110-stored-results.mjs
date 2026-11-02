import fs from 'node:fs';
import {chromium} from 'playwright';
const out='artifacts/video-action/v110-results-only';
fs.mkdirSync(out,{recursive:true});
const report={checkedAt:new Date().toISOString(),checks:{},errors:[],success:false};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1450,height:950}});
page.on('pageerror',e=>report.errors.push(String(e)));
async function runModel(id){
 await page.locator('#model').selectOption(id);
 await page.locator('#run').click();
 await page.waitForFunction(()=>{
  const s=document.querySelector('#status')?.textContent||'';
  return !document.querySelector('#run').disabled&&(s.includes('真实推理已返回')||s.includes('真实推理未完成'));
 },null,{timeout:260000});
 const status=await page.locator('#status').innerText();
 if(!status.includes('真实推理已返回'))throw Error(id+': '+status);
 const detail=JSON.parse(await page.locator('#diagnostics').textContent()||'{}');
 if(detail.inference?.variant!==id)throw Error('wrong inference variant '+id);
 return detail.inference;
}
const rows=()=>page.locator('#comparison-results table tr').evaluateAll(trs=>
 trs.slice(1).map(row=>[...row.querySelectorAll('td')].map(cell=>cell.textContent)));
try{
 await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelectorAll('#sample-list button[data-clip-id]').length===6,null,{timeout:40000});
 report.checks.singleModelOnly02=await page.locator('#model').evaluate(el=>!el.closest('section.panel').querySelector('#compare-choices')&&
   !el.closest('section.panel').querySelector('#compare-run'));
 report.checks.selectorOnly06=await page.locator('#compare-choices').evaluate(el=>
   el.closest('section.panel')?.textContent.includes('06 · 模型结果对比'));
 report.checks.startEmpty=(await page.locator('#compare-choices input:checked').count())===0&&
   await page.locator('#compare-choices input:not(:disabled)').count()===0;
 await page.locator('#sample-list button[data-action="sleep_posture"]').click();
 await page.waitForFunction(()=>document.querySelector('#video')?.readyState>=2&&document.querySelector('#video')?.videoWidth>0,null,{timeout:35000});
 await page.locator('#person-box-toggle').evaluate(el=>{el.checked=false;el.dispatchEvent(new Event('change',{bubbles:true}))});
 const first=await runModel('a0');
 report.checks.firstSaved=await page.locator('#compare-choices input[value="a0"]').isEnabled();
 report.checks.otherModelsUnavailable=await page.locator('#compare-choices input[value="a2"]').isDisabled()&&
   await page.locator('#compare-choices input[value="videomae"]').isDisabled();
 report.checks.noAutoCompare=await page.locator('#compare-choices input:checked').count()===0;
 await page.locator('#compare-choices input[value="a0"]').check();
 report.rowsAfterFirst=await rows();
 report.checks.firstTable=report.rowsAfterFirst.length===1&&report.rowsAfterFirst[0][0]==='MoViNet-A0';
 const second=await runModel('a2');
 report.checks.firstRetained=await page.locator('#compare-choices input[value="a0"]').isChecked()&&
   (await rows()).length===1;
 report.checks.secondAvailable=await page.locator('#compare-choices input[value="a2"]').isEnabled();
 await page.locator('#compare-choices input[value="a2"]').check();
 report.rowsAfterSecond=await rows();
 report.checks.twoPreviouslyComputed=report.rowsAfterSecond.length===2&&
   report.rowsAfterSecond[0][0]==='MoViNet-A0'&&report.rowsAfterSecond[1][0]==='MoViNet-A2';
 report.checks.sameVideoResult=first.clipId===second.clipId&&first.clipId!==null;
 report.checks.noSecondRunTriggered=await page.locator('#model').inputValue()==='a2';
 await page.screenshot({path:out+'/two-stored-results.png',fullPage:true});
 await page.locator('#sample-list button[data-action="waving"]').click().catch(async()=>{
   await page.locator('#sample-list button[data-action="wave"]').click();
 });
 report.checks.switchClearsSelection=await page.locator('#compare-choices input:checked').count()===0;
 report.checks.switchDisablesOld=await page.locator('#compare-choices input:not(:disabled)').count()===0;
 report.checks.switchClearsTable=await page.locator('#comparison-results table').count()===0;
 report.success=Object.values(report.checks).every(Boolean)&&report.errors.length===0;
 if(!report.success)process.exitCode=1;
 await page.screenshot({path:out+'/cleared-next-video.png',fullPage:true});
}catch(e){report.error=String(e);process.exitCode=1;try{await page.screenshot({path:out+'/failure.png',fullPage:true})}catch{}}
finally{fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));
 console.log('V110_RESULTS_ONLY',JSON.stringify(report).slice(0,9200));
 await browser.close();}

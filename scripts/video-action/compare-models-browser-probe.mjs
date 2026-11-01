import {chromium} from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('artifacts/video-action/v105-compare',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:960}});
const report={type:'official-MoViNet-A0-A1-A2-real-video-compare',time:new Date().toISOString(),success:false,models:[],errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
try{
 await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>document.querySelectorAll('#sample-list button').length===6,null,{timeout:35000});
 await page.locator('#sample-list button[data-action="falling"]').click();
 await page.waitForFunction(()=>document.querySelector('#video').readyState>=2,null,{timeout:35000});
 const sample=await page.locator('#video').evaluate(v=>({duration:v.duration,width:v.videoWidth,src:v.currentSrc}));
 report.sample=sample;
 report.modelOptions=await page.locator('#model option').allTextContents();
 if(report.modelOptions.length!==3)throw Error('Model selector has no A1/A2 options');
 for(const variant of ['a1','a2']){
   await page.locator('#model').selectOption(variant);
   await page.locator('#run').click();
   await page.waitForFunction(()=>!document.querySelector('#run').disabled,null,{timeout:180000});
   const status=await page.locator('#status').innerText();
   const details=JSON.parse(await page.locator('#diagnostics').textContent()||'{}');
   const inference=details.inference;
   const valid=!!inference&&inference.variant===variant&&inference.frames>5&&
      inference.top5?.length===5&&inference.top5.every(x=>x.score>0&&Number.isFinite(x.score))&&
      inference.frameTop1?.length===inference.frames&&status.includes('真实推理已返回');
   report.models.push({variant,passed:valid,status,top5:inference?.top5,frames:inference?.frames,timings:inference?.timings,modelSha256:inference?.modelSha256});
   await page.screenshot({path:'artifacts/video-action/v105-compare/'+variant+'-real-video.png',fullPage:true});
   if(!valid)throw Error('A1/A2 real video inference did not return valid logits: '+variant+' '+status);
 }
 const before=await page.locator('#comparison-results').innerText();
 report.comparisonRowsBefore=before;
 if(!before.includes('MoViNet-A1')||!before.includes('MoViNet-A2'))throw Error('Comparison not populated after two actual runs');
 await page.locator('#compare-choices input[value="a1"]').check();
 await page.locator('#compare-run').click();
 await page.waitForFunction(()=>{
   const el=document.querySelector('#compare-run'),status=document.querySelector('#status')?.textContent||'';
   return !!el&&!el.disabled&&status.includes('已完成 3 个所选模型');
 },null,{timeout:240000});
 const table=await page.locator('#comparison-results').innerText();
 report.allThreeComparison=table;
 report.comparisonActual=table.includes('MoViNet-A0')&&table.includes('MoViNet-A1')&&table.includes('MoViNet-A2')&&!table.includes('尚未运行');
 report.weightsVerified=report.models.every(x=>/^[a-f0-9]{64}$/.test(x.modelSha256));
 report.success=report.models.every(x=>x.passed)&&report.comparisonActual&&report.weightsVerified&&report.errors.length===0;
 await page.screenshot({path:'artifacts/video-action/v105-compare/three-models-comparison.png',fullPage:true});
 if(!report.success)process.exitCode=1;
}catch(e){report.error=String(e);process.exitCode=1}
finally{
 fs.writeFileSync('artifacts/video-action/v105-compare/report.json',JSON.stringify(report,null,2));
 console.log('MODEL_COMPARE_SUMMARY',JSON.stringify({success:report.success,models:report.models.map(x=>({variant:x.variant,passed:x.passed,frames:x.frames,timings:x.timings,top1:x.top5?.[0]?.label})),error:report.error,errors:report.errors}));
 await browser.close()
}

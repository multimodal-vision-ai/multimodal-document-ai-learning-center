import {chromium} from 'playwright';
import fs from 'node:fs';
const out='artifacts/video-action/mobileclip';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--enable-unsafe-webgpu']});
const page=await browser.newPage({viewport:{width:1400,height:930},acceptDownloads:true});
const report={test:'MVAI V1.0.7 MobileCLIP-S0 real Chrome inference',checked_at:new Date().toISOString(),success:false,results:[],errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
try{
 await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForFunction(()=>document.querySelectorAll('#sample-list button').length===6,null,{timeout:60000});
 const controls=await page.locator('#model option').evaluateAll(els=>els.map(e=>e.value));
 if(!controls.includes('mobileclip_s0')||controls.length!==5)throw Error('MobileCLIP or original models missing from dropdown');
 const checkboxes=page.locator('#compare-choices input[type="checkbox"]');
 if(await checkboxes.count()!==5)throw Error('Five comparison candidates required');
 if(await page.locator('#compare-choices input:checked').count()!==0)throw Error('Results-only comparison must start empty');
 // A separate Chrome suite verifies the 1–3 selector; this suite must
 // prioritize actual MobileCLIP loading and six real-video inferences.
 await page.locator('#model').selectOption('mobileclip_s0');
 await page.locator('#probe').click();
 await page.waitForFunction(()=>!document.querySelector('#probe').disabled,null,{timeout:240000});
 report.load_status=await page.locator('#status').innerText();
 report.backend=JSON.parse((await page.locator('#diagnostics').textContent())||'{}').model_compiled?.backend;
 report.webgpu_fallback=JSON.parse((await page.locator('#diagnostics').textContent())||'{}').model_compiled?.webgpuFallbackReason||null;
 if(!report.load_status.includes('模型已加载'))throw Error('Model did not load: '+report.load_status);
 for(const label of ['挥手','看手机','打电话','摔倒','吃东西','睡觉']){
   await page.locator('#sample-list button').filter({hasText:label}).click();
   await page.waitForFunction(()=>{const v=document.querySelector('#video');return !!v?.error||(v?.readyState>=2&&v.videoWidth>0)},null,{timeout:45000});
   await page.locator('#run').click();
   await page.waitForFunction(()=>!document.querySelector('#run').disabled,null,{timeout:240000});
   const status=await page.locator('#status').innerText();
   const result=JSON.parse((await page.locator('#diagnostics').textContent())||'{}').inference;
   const valid=!!result&&result.variant==='mobileclip_s0'&&result.frames===6&&result.top5?.length===5&&
      result.backend===report.backend&&result.classificationMode==='keyframe-semantic'&&
      result.top5.every(x=>Number.isFinite(x.score)&&x.score>=0&&x.score<=1)&&
      status.includes('真实推理已返回');
   const item={label,valid,status,top5:result?.top5?.map(x=>({label:x.label,score:x.score}))||[],
      reference_rank:result?.comparison?.target_rank??null,
      inference_ms:result?.timings?.inferenceMs??null};
   report.results.push(item);
   if(!valid)throw Error('Invalid genuine inference for '+label+': '+status);
   if(label==='看手机')await page.screenshot({path:out+'/phone-use.png',fullPage:true});
 }
 await page.screenshot({path:out+'/six-actions.png',fullPage:true});
 report.success=report.results.length===6&&report.results.every(x=>x.valid);
 if(report.errors.length)report.warning_page_errors=report.errors;
}catch(e){report.failure=String(e);await page.screenshot({path:out+'/failure.png',fullPage:true}).catch(()=>{});}
finally{
 fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));
 await browser.close();
 console.log(JSON.stringify(report,null,2));
 if(!report.success)process.exitCode=1;
}

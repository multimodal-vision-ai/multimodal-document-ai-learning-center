import {chromium} from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('artifacts/video-action',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:960},acceptDownloads:true});
const report={checked_at:new Date().toISOString(),type:'actual_chromium_wasm_probe',success:false};
try{
  const errors=[];
  try { const hf=await page.request.get('https://huggingface.co/api/datasets/multimodal-vision-ai/mvai-daily-action-demo',{timeout:25000}); report.hf_dataset_http=hf.status(); if(hf.ok()){const info=await hf.json();report.hf_dataset_sha=info.sha;report.hf_dataset_private=info.private;report.hf_dataset_files=info.siblings?.map(x=>x.rfilename);} } catch(e){report.hf_dataset_error=String(e)}
  page.on('pageerror',e=>errors.push(String(e)));
  report.media_responses=[];report.media_failures=[];
  page.on('response',response=>{if(/real_(waving|jumping)|synthetic_wave/.test(response.url()))report.media_responses.push({status:response.status(),url:response.url().split('?')[0].slice(0,260),contentType:response.headers()['content-type']??null})});
  page.on('requestfailed',request=>{if(/real_(waving|jumping)|synthetic_wave/.test(request.url()))report.media_failures.push({url:request.url().split('?')[0].slice(0,260),failure:request.failure()})});
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:30000});
  await page.screenshot({path:'artifacts/video-action/initial.png',fullPage:true});
  report.real_samples=[];
  try {
    await page.waitForFunction(()=>document.querySelectorAll('#sample-list button').length>=5,null,{timeout:35000});
    report.sample_buttons=await page.locator('#sample-list button').allTextContents();
    for(const label of ['挥手 · 真人实拍','开合跳 · 真人实拍','看/使用手机 · 真人实拍','吃东西 · 真人实拍','打电话（有线电话） · 真人实拍']){
      try {
        await page.locator('#sample-list button').filter({hasText:label}).click();
        await page.waitForFunction(()=>{const v=document.querySelector('#video');return !!v.error||(v.readyState>=2&&v.videoWidth>0&&Number.isFinite(v.duration))},null,{timeout:20000});
        const data=await page.locator('#video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,src:v.currentSrc,readyState:v.readyState,errorCode:v.error?.code??null,errorMessage:v.error?.message??null,mp4Support:v.canPlayType('video/mp4; codecs="avc1.42E01E"'),webmSupport:v.canPlayType('video/webm; codecs="vp8"')}));
        report.real_samples.push({label,...data,playable:!data.errorCode&&data.width>0});
      }catch(e){report.real_samples.push({label,playable:false,error:String(e)})}
    }
    await page.screenshot({path:'artifacts/video-action/real-samples.png',fullPage:true});
  }catch(e){report.real_catalog_error=String(e);report.catalog_diagnostic=await page.locator('#provenance').innerText()}

  await page.locator('#probe').click();
  await page.waitForFunction(()=>!document.querySelector('#probe').disabled,{timeout:180000});
  report.status=await page.locator('#status').innerText();
  report.diagnostics=await page.locator('#diagnostics').textContent();
  report.errors=errors;
  await page.screenshot({path:'artifacts/video-action/after-probe.png',fullPage:true});
  report.model_load_success=report.status.includes('47 输入 / 28 输出元数据通过')&&errors.length===0;
  if(report.model_load_success) {
    await page.locator('#upload').setInputFiles('hf-dataset-staging/demo/videos/synthetic_wave_001.mp4');
    await page.locator('#run').click();
    await page.waitForFunction(()=>!document.querySelector('#run').disabled,{timeout:180000});
    report.first_inference_status=await page.locator('#status').innerText();
    report.first_inference=JSON.parse(await page.locator('#diagnostics').textContent()||'{}').inference??null;
    report.real_inference_success=!!report.first_inference&&report.first_inference_status.includes('真实推理已返回');
    await page.screenshot({path:'artifacts/video-action/after-inference.png',fullPage:true});
    if(report.real_inference_success){
      await page.locator('#run').click();
      await page.waitForFunction(()=>!document.querySelector('#run').disabled,{timeout:180000});
      report.repeat_inference_status=await page.locator('#status').innerText();
      report.repeat_inference=JSON.parse(await page.locator('#diagnostics').textContent()||'{}').inference??null;
      const a=report.first_inference.top5,b=report.repeat_inference?.top5||[];
      report.reset_deterministic=a.length===b.length&&a.every((x,i)=>x.id===b[i].id&&Math.abs(x.score-b[i].score)<1e-5);
    }
  }
  report.real_samples_playable=report.real_samples.length===5&&report.real_samples.every(x=>x.playable);
  if(report.model_load_success&&report.real_samples_playable){
    for(const label of ['挥手 · 真人实拍','开合跳 · 真人实拍','看/使用手机 · 真人实拍','吃东西 · 真人实拍','打电话（有线电话） · 真人实拍']){
      try{
        await page.locator('#sample-list button').filter({hasText:label}).click();
        await page.locator('#run').click();
        await page.waitForFunction(()=>!document.querySelector('#run').disabled,null,{timeout:180000});
        const status=await page.locator('#status').innerText();
        const inference=JSON.parse(await page.locator('#diagnostics').textContent()||'{}').inference??null;
        const entry=report.real_samples.find(x=>x.label===label);
        entry.inference_success=!!inference&&status.includes('真实推理已返回');
        entry.status=status;
        entry.top5=inference?.top5;
        entry.comparison=inference?.comparison;
      }catch(e){const entry=report.real_samples.find(x=>x.label===label);entry.inference_error=String(e)}
    }
    await page.screenshot({path:'artifacts/video-action/real-inference.png',fullPage:true});
  }
  report.success=report.model_load_success&&report.real_samples_playable&&report.real_samples.every(x=>x.inference_success)&&report.reset_deterministic&&errors.length===0;
  if(!report.success)process.exitCode=1;
}catch(e){report.error=String(e);process.exitCode=1}finally{fs.writeFileSync('artifacts/video-action/report.json',JSON.stringify(report,null,2));await browser.close()}

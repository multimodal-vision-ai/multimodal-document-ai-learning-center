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
    await page.waitForFunction(()=>document.querySelectorAll('#sample-list button').length===6,null,{timeout:35000});
    report.sample_buttons=await page.locator('#sample-list button').allTextContents();
    report.compact_six_labels=report.sample_buttons.join('、')==='挥手、看手机、打电话、摔倒、吃东西、睡觉';
    report.fall_explicit_missing=await page.locator('#sample-list button[data-action="falling"]').evaluate(btn=>btn.classList.contains('unavailable')&&!btn.dataset.clipId);
    if(!report.compact_six_labels)throw Error('Six compact labels mismatch: '+report.sample_buttons.join('、'));
    await page.locator('#sample-list button[data-action="falling"]').click();
    report.fall_message=await page.locator('#sample-status').innerText();
    report.fall_missing_honest=report.fall_message.includes('暂无已审核');
    for(const label of ['挥手','看手机','打电话','吃东西','睡觉']){
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
  await page.locator('#probe').click();
  report.repeat_probe_status=await page.locator('#status').innerText();
  report.no_duplicate_litert_init=report.repeat_probe_status.includes('无需重复初始化');
  report.diagnostics=await page.locator('#diagnostics').textContent();
  report.errors=errors;
  await page.screenshot({path:'artifacts/video-action/after-probe.png',fullPage:true});
  report.model_load_success=report.status.includes('47 输入 / 28 输出元数据通过')&&report.no_duplicate_litert_init&&errors.length===0;
  if(report.model_load_success) {
    await page.locator('#upload').setInputFiles('hf-dataset-staging/demo/videos/synthetic_wave_001.mp4');
    await page.locator('#run').click();
    await page.waitForFunction(()=>!document.querySelector('#run').disabled,{timeout:180000});
    report.first_inference_status=await page.locator('#status').innerText();
    report.first_inference=JSON.parse(await page.locator('#diagnostics').textContent()||'{}').inference??null;
    report.real_inference_success=!!report.first_inference&&report.first_inference_status.includes('真实推理已返回')&&report.first_inference?.frameTop1?.length===report.first_inference.frames;
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
    for(const label of ['挥手','看手机','打电话','吃东西','睡觉']){
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
        entry.timeline_length=inference?.frameTop1?.length??0;
        entry.timeline_valid=Array.isArray(inference?.frameTop1)&&entry.timeline_length===inference.frames&&inference.frameTop1.every((p,i)=>Number.isFinite(p.t)&&p.t>=0&&p.t<=8&&Number.isFinite(p.score)&&p.score>0&&p.score<=1&&(i===0||p.t>=inference.frameTop1[i-1].t));
        entry.annotated_visible=await page.locator('#annotated-section').isVisible();
        if(entry.timeline_valid&&entry.annotated_visible){await page.locator('#annotated-video').evaluate(v=>{v.pause();v.currentTime=.6});await page.locator('#annotated-video').evaluate(v=>new Promise(resolve=>{if(Math.abs(v.currentTime-.6)<.04)return resolve();v.addEventListener('seeked',resolve,{once:true})}));const overlay=await page.locator('#top1-overlay').innerText();entry.seek_overlay_matches=inference.frameTop1.some(p=>overlay.includes(p.label));}

        if(label==='吃东西')await page.screenshot({path:'artifacts/video-action/eating-interpretation.png',fullPage:true});
      }catch(e){const entry=report.real_samples.find(x=>x.label===label);entry.inference_error=String(e)}
    }
    await page.screenshot({path:'artifacts/video-action/real-inference.png',fullPage:true});
  }
  // Independent fresh-page verification: one click on Run must load WASM itself.
  const autoPage=await browser.newPage({viewport:{width:1360,height:900}});
  const autoErrors=[];
  autoPage.on('pageerror',e=>autoErrors.push(String(e)));
  try{
    await autoPage.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:30000});
    await autoPage.waitForFunction(()=>document.querySelectorAll('#sample-list button').length===6,null,{timeout:35000});
    await autoPage.locator('#sample-list button').filter({hasText:'挥手'}).click();
    report.auto_load_button_enabled=await autoPage.locator('#run').isEnabled();
    if(!report.auto_load_button_enabled)throw Error('Run button disabled before model initialization');
    await autoPage.locator('#run').click();
    await autoPage.waitForFunction(()=>!document.querySelector('#run').disabled,null,{timeout:180000});
    const autoStatus=await autoPage.locator('#status').innerText();
    const autoInfo=JSON.parse(await autoPage.locator('#diagnostics').textContent()||'{}');
    report.auto_load_status=autoStatus;
    report.auto_load_success=autoStatus.includes('真实推理已返回')&&!!autoInfo.inference&&autoErrors.length===0;
    await autoPage.screenshot({path:'artifacts/video-action/one-click-auto-load.png',fullPage:true});
  }catch(e){report.auto_load_error=String(e);report.auto_load_success=false}
  finally{report.auto_load_page_errors=autoErrors;await autoPage.close()}
  report.success=report.compact_six_labels&&report.fall_explicit_missing&&report.fall_missing_honest&&report.model_load_success&&report.no_duplicate_litert_init&&report.auto_load_success&&report.real_samples_playable&&report.real_samples.every(x=>x.inference_success&&x.timeline_valid&&x.annotated_visible&&x.seek_overlay_matches)&&report.reset_deterministic&&errors.length===0;
  if(!report.success)process.exitCode=1;
}catch(e){report.error=String(e);process.exitCode=1}finally{fs.writeFileSync('artifacts/video-action/report.json',JSON.stringify(report,null,2));await browser.close()}

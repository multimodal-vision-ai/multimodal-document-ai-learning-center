/**
 * V1.0.7 MobileCLIP real-browser smoke test.
 * Runs actual HF model inference on decoded real footage; no mocked results.
 */
import fs from 'node:fs';
import {chromium} from 'playwright';

const dir='artifacts/video-action/v107-mobileclip';
fs.mkdirSync(dir,{recursive:true});
const report={checkedAt:new Date().toISOString(),type:'mobileclip-s0-real-browser',success:false,checks:{},errors:[]};
const browser=await chromium.launch({
  channel:'chrome',headless:true,
  args:['--no-sandbox','--disable-dev-shm-usage','--js-flags=--max-old-space-size=4096']
});
const page=await browser.newPage({viewport:{width:1360,height:900}});
page.on('pageerror',error=>report.errors.push('pageerror: '+String(error)));
page.on('console',message=>{if(message.type()==='error')report.errors.push('console: '+message.text().slice(0,500))});
let timeout=0;
try{
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>{
    const buttons=document.querySelectorAll('#sample-list button[data-clip-id]');
    return buttons.length===6;
  },null,{timeout:45000});
  await page.locator('#sample-list button[data-action="phone_use"]').click();
  await page.waitForFunction(()=>{
    const v=document.querySelector('#video');
    return v?.readyState>=2&&v.videoWidth>0&&Number.isFinite(v.duration)&&v.duration>0;
  },null,{timeout:35000});
  report.checks.realVideoDecoded=true;
  // Optional person detector is intentionally disabled: this probe isolates action-model correctness.
  await page.locator('#person-box-toggle').uncheck();
  await page.locator('#model').selectOption('mobileclip_s0');
  report.checks.modelSelectable=await page.locator('#model').inputValue()==='mobileclip_s0';
  await page.locator('#run').click();
  await page.waitForFunction(()=>{
    const run=document.querySelector('#run');
    const status=document.querySelector('#status')?.textContent||'';
    return !run?.disabled&&(/真实推理已返回|真实推理未完成/.test(status));
  },null,{timeout:720000});
  const status=await page.locator('#status').innerText();
  const details=JSON.parse(await page.locator('#diagnostics').textContent()||'{}');
  report.status=status;
  report.model=details.model_compiled??null;
  report.inference=details.inference??null;
  report.inferenceError=details.inference_error??null;
  report.checks.modelReallyLoaded=report.model?.variant==='mobileclip_s0'&&
    ['webgpu','wasm'].includes(report.model?.backend);
  report.checks.trueInferenceCompleted=!!report.inference&&
    status.includes('真实推理已返回')&&report.inference?.variant==='mobileclip_s0';
  report.checks.sixFrames=report.inference?.frames===6&&report.inference?.classificationMode==='keyframe-semantic';
  report.checks.sixClassDistribution=report.inference?.top5?.length===5&&
    report.inference.top5.every(x=>Number.isFinite(x.score)&&x.score>0&&x.score<=1&&typeof x.label==='string');
  report.checks.semanticNotStreaming=report.inference?.frameTop1?.length===1&&
    (await page.locator('#annotation-summary').textContent()).includes('不是逐帧视频动作分类');
  report.checks.resultVideoDecoded=await page.locator('#annotated-video').evaluate(v=>
    v.readyState>=2&&v.videoWidth>0&&v.currentSrc===document.querySelector('#video').currentSrc);
  report.checks.comparisonRow=await page.locator('#comparison-results').evaluate(e=>
    e.textContent.includes('Apple MobileCLIP-S0'));
  await page.screenshot({path:dir+'/mobileclip-real-inference.png',fullPage:true});

  // The model must remain available to the optional 1-3 model comparison selector.
  for(const id of ['a0','a2'])await page.locator('#compare-choices input[value="'+id+'"]').uncheck();
  await page.locator('#compare-choices input[value="mobileclip_s0"]').check();
  report.checks.singleModelCompareSelected=await page.locator('#compare-choices input:checked').evaluateAll(
    xs=>xs.length===1&&xs[0].value==='mobileclip_s0'
  );
  report.checks.noAccidentalModelSubstitution=await page.locator('#comparison-results table tr').evaluateAll(
    rows=>rows.length===2&&rows[1].textContent.includes('Apple MobileCLIP-S0')&&
      !rows[1].textContent.includes('MoViNet')
  );
  report.success=Object.values(report.checks).every(Boolean);
  if(!report.success)process.exitCode=1;
}catch(error){
  report.error=String(error);
  try{report.status=await page.locator('#status').innerText()}catch{}
  try{report.diagnostics=await page.locator('#diagnostics').textContent()}catch{}
  try{await page.screenshot({path:dir+'/mobileclip-failure.png',fullPage:true})}catch{}
  process.exitCode=1;
}finally{
  fs.writeFileSync(dir+'/report.json',JSON.stringify(report,null,2));
  console.log('MOBILECLIP_REAL_BROWSER',JSON.stringify({
    success:report.success,checks:report.checks,backend:report.model?.backend,
    error:report.error,inferenceError:report.inferenceError,status:report.status,errors:report.errors
  }).slice(0,4500));
  await page.close();
  await browser.close();
}

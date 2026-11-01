import {chromium} from 'playwright';
import fs from 'node:fs';
const root='artifacts/video-action/v105-six-samples';
fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:940}});
const report={type:'six-action-three-model-actual-Chrome-compare',timestamp:new Date().toISOString(),success:false,data:[],errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
const slots=[
  ['wave','挥手'],
  ['phone_use','看手机'],
  ['phone_call','打电话'],
  ['falling','摔倒'],
  ['eating','吃东西'],
  ['sleep_posture','睡觉']
];
try{
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:35000});
  await page.waitForFunction(()=>document.querySelectorAll('#sample-list button[data-clip-id]').length===6,null,{timeout:45000});
  for(const [id,label] of slots){
    const result={action:id,label};
    try{
      await page.locator('#sample-list button[data-action="'+id+'"]').click();
      await page.waitForFunction(()=>{const v=document.querySelector('#video');return v.readyState>=2&&v.videoWidth>0},null,{timeout:35000});
      result.media=await page.locator('#video').evaluate(v=>({duration:v.duration,src:v.currentSrc,width:v.videoWidth}));
      await page.locator('#compare-choices input[value="a1"]').check();
      await page.locator('#compare-run').click();
      await page.waitForFunction(()=>{
        const b=document.querySelector('#compare-run'),txt=document.querySelector('#status')?.textContent||'';
        return !!b&&!b.disabled&&(/已完成 3 个所选模型|所选模型对比未完成/.test(txt));
      },null,{timeout:240000});
      const status=await page.locator('#status').innerText();
      result.status=status;
      result.rows=await page.locator('#comparison-results table tr').evaluateAll(rows=>rows.slice(1).map(r=>Array.from(r.querySelectorAll('td'),c=>c.textContent)));
      result.passed=status.includes('已完成 3 个所选模型')&&result.rows.length===3&&
        result.rows.every(r=>r.length===6&&!r.includes('尚未运行')&&/[0-9]+ ms/.test(r[4]));
      console.log('SIX_CLASS_COMPARE',id,JSON.stringify(result.rows));
      await page.screenshot({path:root+'/'+id+'.png',fullPage:true});
    }catch(e){result.passed=false;result.error=String(e);console.log('SIX_CLASS_ERROR',id,String(e))}
    report.data.push(result);
  }
  report.success=report.data.length===6&&report.data.every(r=>r.passed)&&report.errors.length===0;
  if(!report.success)process.exitCode=1;
}catch(e){report.error=String(e);process.exitCode=1}
finally{
  fs.writeFileSync(root+'/report.json',JSON.stringify(report,null,2));
  console.log('SIX_CLASS_SUMMARY',JSON.stringify({success:report.success,passed:report.data.filter(x=>x.passed).length,errors:report.errors,error:report.error}));
  await browser.close();
}

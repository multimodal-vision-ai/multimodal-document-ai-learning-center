import {chromium} from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('artifacts/video-action',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:960},acceptDownloads:true});
const report={checked_at:new Date().toISOString(),type:'actual_chromium_wasm_probe',success:false};
try{
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded',timeout:30000});
  await page.screenshot({path:'artifacts/video-action/initial.png',fullPage:true});
  await page.locator('#probe').click();
  await page.waitForFunction(()=>!document.querySelector('#probe').disabled,{timeout:180000});
  report.status=await page.locator('#status').innerText();
  report.diagnostics=await page.locator('#diagnostics').innerText();
  report.errors=errors;
  await page.screenshot({path:'artifacts/video-action/after-probe.png',fullPage:true});
  report.success=report.status.includes('47 输入元数据通过')&&errors.length===0;
  if(!report.success)process.exitCode=1;
}catch(e){report.error=String(e);process.exitCode=1}finally{fs.writeFileSync('artifacts/video-action/report.json',JSON.stringify(report,null,2));await browser.close()}

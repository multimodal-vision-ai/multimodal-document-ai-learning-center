#!/usr/bin/env python3
"""Headless browser verification for approved student learning layouts.

Runs against the generated MkDocs site, with its real image/video/notebook
assets, not mocked placeholders. A blank canvas is a test failure.
"""
from __future__ import annotations
import os
import sys
import subprocess
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

site=Path(os.environ.get("RUNNER_TEMP","/tmp"))/"dev-site"
if not (site/"resources/course-labs/intelligent-perception/interactive/index.html").exists():
 raise SystemExit("Missing built interactive page")
port=18794
server=subprocess.Popen([sys.executable,"-m","http.server",str(port),"--bind","127.0.0.1","--directory",str(site)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
base=f"http://127.0.0.1:{port}/resources/course-labs/intelligent-perception"
try:
 time.sleep(1)
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
  page=browser.new_page(viewport={"width":1440,"height":1000})
  errors=[]
  page.on("pageerror",lambda exc:errors.append(str(exc)))
  for lab in ("e01","e02"):
   page.goto(f"{base}/interactive/index.html?lab={lab}",wait_until="domcontentloaded",timeout=30000)
   page.wait_for_function('document.getElementById("title1").textContent!=="中间结果 A"',timeout=40000)
   page.wait_for_function(
      """() => {
       const c=document.getElementById("original");
       const a=c.getContext("2d").getImageData(0,0,c.width,c.height).data;
       let n=0;
       for(let i=0;i<a.length;i+=160)if(a[i]!==0||a[i+1]!==0||a[i+2]!==0)n++;
       return n>500;
      }""",
      timeout=40000
   )
   page.screenshot(path=str(Path(os.environ.get("RUNNER_TEMP","/tmp"))/f"student-{lab}.png"))
   for exp in (["color","threshold","filter","morph","perspective"] if lab=="e01" else ["canny","roi","hough","fit","generalization"]):
    page.select_option("#experiment",exp)
    page.wait_for_function('document.getElementById("title1").textContent!=="中间结果 A"',timeout=50000)
    page.wait_for_timeout(450)
    metric=page.locator("#metrics").inner_text()
    if "失败" in metric or "错误" in metric or "加载" in metric:
     raise AssertionError((lab,exp,metric))
   print("Browser exercises passed:",lab)
   if errors:raise AssertionError("JavaScript runtime errors: "+repr(errors))
  for lab in ("e01","e02"):
   page.goto(f"{base}/{lab}-notebook.html",wait_until="domcontentloaded",timeout=30000)
   page.wait_for_function('document.querySelectorAll(".nb-figure img").length>=9',timeout=65000)
   page.wait_for_function(
     'Array.from(document.querySelectorAll(".nb-figure img")).every(i=>i.complete&&i.naturalWidth>100)',
     timeout=65000
   )
   count=page.locator(".nb-figure img").count()
   assert page.locator(".chapter").count()>=6, "Missing exploration chapters"
   task_count=sum(x.count("探索任务") for x in page.locator(".chapter").all_inner_texts())
   assert task_count>=5,(lab,"missing exploratory Cells",task_count)
   collapsed=page.locator("details.code-cell")
   assert collapsed.count()>=10,"Missing exploration Python code Cells"
   assert page.locator("details.code-cell[open]").count()==0,"Python must be collapsed by default"
   assert page.locator(".hero-img").is_visible(),"Course cover image missing"
   page.locator("details.code-cell summary").first.click()
   assert page.locator("details.code-cell[open]").count()==1,"Source expand failed"
   page.locator("details.code-cell summary").first.click()
   assert page.locator("details.code-cell[open]").count()==0,"Source collapse failed"
   page.locator("#toggle-codes").click()
   assert page.locator("details.code-cell[open]").count()==collapsed.count(),"Expand all failed"
   page.locator("#toggle-codes").click()
   assert page.locator("details.code-cell[open]").count()==0,"Collapse all failed"
   assert page.locator("#meta-toggle").is_visible(),"Notebook information icon missing"
   assert not page.locator("#meta-pop").is_visible(),"Run statistics are exposed by default"
   assert page.locator(".intro").count()==0,"Technical explanation still displayed"
   page.locator("#meta-toggle").hover()
   assert page.locator("#meta-pop").is_visible(),"Information popover does not open on hover"
   assert page.locator("#status").is_visible(),"Run counts are missing from information popover"
   page.locator("#meta-toggle").click()
   page.mouse.move(800,350)
   assert page.locator("#meta-pop").is_visible(),"Information popover pin/click failed"
   page.locator("#meta-toggle").click()
   assert not page.locator("#meta-pop").is_visible(),"Information popover does not close"
   if lab=="e02":
    assert page.locator("#video-processed").count()==1,"E02 chapter 06 lacks processed video"
    assert page.locator("#video-processed").is_visible(),"E02 video player is hidden"
    assert page.locator(".video-result").count()==1,"E02 video output section is missing"
    assert page.locator("#video-processed").get_attribute("src")=="downloads/E02_lane_video_processed.mp4"
    video_file=page.locator("#video-processed").evaluate("""async (v) => {
      const response=await fetch(v.src,{cache:"no-store"});
      if(!response.ok)return {ok:false,status:response.status};
      const bytes=new Uint8Array(await response.arrayBuffer());
      const signature=String.fromCharCode(...bytes.slice(4,8));
      return {ok:true,size:bytes.length,signature};
    }""")
    assert video_file.get("ok") and video_file.get("size",0)>10000 and video_file.get("signature")=="ftyp",("Video URL or MP4 content invalid",video_file)
    # Chromium Headless Shell may lack the proprietary H264 decoder.
    # FFmpeg already decodes every frame during the asset-build stage.
    print("E02 browser MP4 source verified:",video_file.get("size"),"bytes")
   else:
    assert page.locator("#video-processed").count()==0,"E01 incorrectly includes E02 video"
   print("Metadata info hidden and E02 video verified:",lab)
   assert page.locator("#mode-study").is_visible(),"Notebook mode must be default"
   page.locator("#downloadTab").click()
   assert page.locator("#mode-practice").is_visible(),"03 local/Kaggle mode missing"
   assert page.get_by_text("方式 A · 本地 Python / VS Code").is_visible()
   assert page.get_by_text("方式 B · 在 Kaggle 运行").is_visible()
   assert page.locator(f'#mode-practice a[href="downloads/MVAI_{lab.upper()}_Lab.zip"]').count()==2
   assert page.locator(f'#mode-practice a[href="downloads/{"E01_Image_Processing_V2.0.ipynb" if lab=="e01" else "E02_Lane_Detection_V2.0.ipynb"}"]').count()==1
   page.locator("#interactTab").click()
   assert page.locator("#mode-interactive").is_visible(),"Embedded interactive mode missing"
   assert page.locator("#lab-frame").get_attribute("data-lab")==lab,"Mixed E01/E02 resources"
   # The nested teaching app must not repeat a full site header, another
   # E01/E02 switcher, a duplicate experiment selector or the DEV banner.
   frame=page.frame_locator("#lab-frame")
   frame.locator("#original").wait_for(state="visible",timeout=40000)
   frame.locator("#sceneThumb").wait_for(state="visible",timeout=40000)
   assert frame.locator("#tab-e01").count()==0 and frame.locator("#tab-e02").count()==0, "Cross-lesson navigation still embedded"
   assert not frame.locator("header").is_visible(), "Repeated site header inside course page"
   assert not frame.locator(".hero").is_visible(), "Repeated course hero inside course page"
   assert not frame.locator(".experiment-select-duplicate").is_visible(), "Duplicate experiment selector still visible"
   assert frame.locator("#lessonButtons .lesson").count()==5, "Wrong lesson catalog inside iframe"
   assert frame.locator(".lesson.active").count()==1, "No active experiment"
   selected=frame.locator("#experiment").input_value()
   expected=("color" if lab=="e01" else "canny")
   assert selected==expected,(lab,"Wrong experiment loaded",selected)
   assert frame.locator("#sceneThumb").evaluate("(im)=>im.complete && im.naturalWidth>100"), "Road image missing"
   assert frame.locator("#original").evaluate(
      "(c)=>{const a=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<a.length;i+=160)if(a[i]||a[i+1]||a[i+2])n++;return n>500}"
   ), "Embedded road image canvas is empty"
   other=("E02 · 车道线检测" if lab=="e01" else "E01 · 图像处理")
   assert other not in frame.locator("body").inner_text(), "Other Notebook's experiment appeared inside this page"
   assert page.locator('#mode-interactive a[href*="single=1"]').count()==1, "Standalone single-lesson link missing"
   print("Single-lesson embedded lab passed:",lab,"no mixed E01/E02 controls")

   page.screenshot(path=str(Path(os.environ.get("RUNNER_TEMP","/tmp"))/f"{lab}-three-modes.png"))
   print("Independent approved notebook:",lab,"real plots",count,"exploratory Cells",task_count,"03 local/Kaggle OK")
  # E03 V2.0: verify the real teaching page, all image/video assets and downloads.
  page.goto(f"{base}/e03-notebook.html",wait_until="domcontentloaded",timeout=30000)
  page.wait_for_selector("#video-lab",timeout=30000)
  imgs=page.locator(".figure img")
  assert imgs.count()>=8,("E03 teaching images missing",imgs.count())
  page.wait_for_function('Array.from(document.querySelectorAll(".figure img")).every(i=>i.complete&&i.naturalWidth>100)',timeout=60000)
  assert page.locator(".chapter").count()>=7,"E03 needs five experiments, video lab and limits"
  assert "课后思考" in page.locator("#limits").inner_text(),"Complex-road after-class reflection missing"
  for scene in ("straight","curve","complex"):
   btn=page.locator(f'.scene-btn[data-scene="{scene}"]')
   btn.click()
   expected=f"e03-media/videos/{scene}-compare.mp4"
   assert page.locator("#compare").get_attribute("src")==expected,(scene,"wrong comparison video")
   assert page.locator("#processed").get_attribute("src")==f"e03-media/videos/{scene}-processed.mp4"
   video=page.locator("#compare").evaluate("""async (v)=>{
    const r=await fetch(v.src,{cache:"no-store"});if(!r.ok)return {ok:false,status:r.status};
    const b=new Uint8Array(await r.arrayBuffer());return {ok:true,size:b.length,signature:String.fromCharCode(...b.slice(4,8))};
   }""")
   assert video.get("ok") and video.get("size",0)>10000 and video.get("signature")=="ftyp",(scene,"invalid MP4",video)
  for href in ("downloads/E03_Advanced_Lane_Finding_V2.0.ipynb","downloads/MVAI_E03_Advanced_Lane_Finding_V2.0.zip"):
   result=page.evaluate("""async (url)=>{const r=await fetch(url);if(!r.ok)return {ok:false,status:r.status};const b=await r.arrayBuffer();return {ok:true,size:b.byteLength};}""",href)
   assert result.get("ok") and result.get("size",0)>10000,(href,result)
  # E03 follows the same three-mode learning structure as E01/E02.
  assert page.locator(".learning-tabs a").count()==3,"E03 must use the shared three-mode tabs"
  assert page.locator("#mode-study").is_visible(),"E03 Notebook mode should be default"
  assert page.locator("#notebook-status").inner_text().startswith("E03 标准 Notebook"),"E03 Notebook metadata missing"
  page.locator('.learning-tabs a[data-mode="interactive"]').click()
  assert page.locator("#mode-interactive").is_visible(),"E03 browser interaction mode missing"
  frame=page.frame_locator("#e03-lab-frame")
  frame.locator("#scene").wait_for(state="visible",timeout=30000)
  frame.locator("#loadStats").wait_for(state="visible",timeout=30000)
  page.wait_for_function("""() => {
   const f=document.querySelector("#e03-lab-frame");if(!f||!f.contentDocument)return false;
   const d=f.contentDocument,s=d.querySelector("#loadStats"),cs=Array.from(d.querySelectorAll("canvas"));
   return !!s&&s.textContent.includes("8 个图像区域已完成渲染")&&cs.length===8&&cs.every(c=>c.dataset.ready==="true");
  }""",timeout=45000)
  initial_canvases=frame.locator("canvas").evaluate_all("""cs=>cs.map(c=>{
   const a=c.getContext("2d").getImageData(0,0,c.width,c.height).data;let visible=0;
   for(let i=3;i<a.length;i+=4)if(a[i]>0)visible++;
   return {id:c.id,visible};
  })""")
  assert all(x["visible"]>1000 for x in initial_canvases),("One or more E03 image canvases are blank",initial_canvases)
  page.wait_for_function("""() => { const f=document.querySelector("#e03-lab-frame"); if(!f||!f.contentDocument)return false; const c=f.contentDocument.querySelector("#source"); if(!c)return false; const a=c.getContext("2d").getImageData(0,0,c.width,c.height).data; let n=0; for(let i=0;i<a.length;i+=160)if(a[i]||a[i+1]||a[i+2])n++; return n>500; }""",timeout=40000)
  assert not frame.locator("header").is_visible(),"Repeated E03 interactive header inside iframe"
  frame.locator('[data-tab="threshold"]').click()
  frame.locator("#light").wait_for(state="visible")
  before=frame.locator("#binary").evaluate("(c)=>c.toDataURL()")
  frame.locator("#light").evaluate("(el)=>{el.value=\"220\";el.dispatchEvent(new Event(\"input\",{bubbles:true}))}")
  after=frame.locator("#binary").evaluate("(c)=>c.toDataURL()")
  assert before!=after,"E03 threshold slider did not change browser output"
  frame.locator('[data-tab="perspective"]').click()
  before=frame.locator("#quad").evaluate("(c)=>c.toDataURL()")
  frame.locator("#top").evaluate("(el)=>{el.value=\"68\";el.dispatchEvent(new Event(\"input\",{bubbles:true}))}")
  after=frame.locator("#quad").evaluate("(c)=>c.toDataURL()")
  assert before!=after,"E03 perspective source-region control did not change overlay"
  warped_before=frame.locator("#bird").evaluate("(c)=>c.toDataURL()")
  frame.locator("#topwidth").evaluate("(el)=>{el.value=\"34\";el.dispatchEvent(new Event(\"input\",{bubbles:true}))}")
  warped_after=frame.locator("#bird").evaluate("(c)=>c.toDataURL()")
  assert warped_before!=warped_after,"E03 homography output did not respond to perspective controls"
  frame.locator('[data-tab="windows"]').click()
  before=frame.locator("#windowCanvas").evaluate("(c)=>c.toDataURL()")
  frame.locator("#nwin").evaluate("(el)=>{el.value=\"14\";el.dispatchEvent(new Event(\"input\",{bubbles:true}))}")
  after=frame.locator("#windowCanvas").evaluate("(c)=>c.toDataURL()")
  assert before!=after,"E03 sliding-window control did not change visualization"
  frame.locator("#scene").select_option("complex")
  frame.locator('#loadStats[data-state="ready"][data-scene="complex"]').wait_for(timeout=45000)
  frame.locator('[data-tab="video"]').click()
  assert frame.locator("#compare").get_attribute("src").split("?")[0].endswith("complex-original.mp4")
  dims=frame.locator(".video-grid video").evaluate_all("vs=>vs.map(v=>({w:v.getBoundingClientRect().width,h:v.getBoundingClientRect().height}))")
  assert len(dims)==2 and abs(dims[0]["h"]-dims[1]["h"])<2 and abs(dims[0]["w"]-dims[1]["w"])<2,("E03 video panes must be aligned",dims)
  # Stronger E03 visual checks: reject blank canvases and static-looking outputs.
  frame.locator('[data-tab="calibration"]').click()
  c0=frame.locator("#calibOut").evaluate("(c)=>c.toDataURL()")
  frame.locator("#k1").evaluate('(e)=>{e.value="29";e.dispatchEvent(new Event("input",{bubbles:true}))}')
  c1=frame.locator("#calibOut").evaluate("(c)=>c.toDataURL()")
  assert c0!=c1,"Calibration distortion slider did not alter the image"
  frame.locator('[data-tab="threshold"]').click()
  stats0=frame.locator("#binary").evaluate("""c=>{const a=c.getContext("2d").getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<a.length;i+=4)if(a[i]>240)n++;return n}""")
  assert stats0>100,"Threshold output canvas is blank"
  frame.locator("#light").evaluate('(e)=>{e.value="235";e.dispatchEvent(new Event("input",{bubbles:true}))}')
  stats1=frame.locator("#binary").evaluate("""c=>{const a=c.getContext("2d").getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<a.length;i+=4)if(a[i]>240)n++;return n}""")
  assert abs(stats0-stats1)>100,"Threshold slider changed no meaningful candidate pixels"
  frame.locator('[data-tab="perspective"]').click()
  assert frame.locator("#bird").evaluate("""c=>{const a=c.getContext("2d").getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<a.length;i+=4)if(a[i]||a[i+1]||a[i+2])n++;return n>30000}"""),"Perspective output is blank"
  frame.locator('[data-tab="windows"]').click()
  assert frame.locator("#fitCanvas").evaluate("""c=>{const a=c.getContext("2d").getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<a.length;i+=4)if(a[i]||a[i+1]||a[i+2])n++;return n>30000}"""),"Pixel search / curve fit output is blank"
  frame.locator("#margin").evaluate('(e)=>{e.value="115";e.dispatchEvent(new Event("input",{bubbles:true}))}')
  assert "窗口选中像素" in frame.locator("#windowStats").inner_text(),"Pixel-search feedback missing"
  frame.locator('[data-tab="video"]').click()
  frame.locator("#seek").evaluate('(e)=>{e.value="250";e.dispatchEvent(new Event("input",{bubbles:true}))}')
  assert frame.locator("#seek").input_value()=="250","Video seek slider did not update"
  assert "2.5 s" in frame.locator("#seekval").inner_text(),"Video seek time feedback missing"
  frame.locator("#speed").evaluate('(e)=>{e.value="75";e.dispatchEvent(new Event("input",{bubbles:true}))}')
  assert abs(frame.locator("#compare").evaluate("(v)=>v.playbackRate")-.75)<.01,"Video playback-speed control failed"
  page.locator('.learning-tabs a[data-mode="practice"]').click()
  assert page.locator("#mode-practice").is_visible(),"E03 local/Kaggle mode missing"
  assert page.locator('#mode-practice a[href="downloads/E03_Advanced_Lane_Finding_V2.0.ipynb"]').count()==1
  assert page.locator('#mode-practice a[href="downloads/MVAI_E03_Advanced_Lane_Finding_V2.0.zip"]').count()==1
  page.locator('.learning-tabs a[data-mode="study"]').click()
  assert page.locator("#mode-study").is_visible(),"E03 return to Notebook mode failed"
  page.screenshot(path=str(Path(os.environ.get("RUNNER_TEMP","/tmp"))/"e03-v2-three-scenes.png"))
  print("E03 browser QA passed: all 8 canvases rendered, parameter controls respond, three scene MP4s and downloads verified")
  if errors: raise AssertionError("Page errors: "+repr(errors))
  browser.close()
finally:
 server.terminate()
 server.wait(timeout=15)
print("REAL BROWSER STUDENT QA PASS")

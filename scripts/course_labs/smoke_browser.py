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
   page.screenshot(path=str(Path(os.environ.get("RUNNER_TEMP","/tmp"))/f"{lab}-three-modes.png"))
   print("Independent approved notebook:",lab,"real plots",count,"exploratory Cells",task_count,"03 local/Kaggle OK")
  if errors: raise AssertionError("Page errors: "+repr(errors))
  browser.close()
finally:
 server.terminate()
 server.wait(timeout=15)
print("REAL BROWSER STUDENT QA PASS")

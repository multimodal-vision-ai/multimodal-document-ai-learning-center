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
   page.goto(f"{base}/notebook-student-v2.html?lab={lab}",wait_until="domcontentloaded",timeout=30000)
   page.wait_for_function(
     'document.querySelectorAll(".nb-figure img").length>=4',
     timeout=35000
   )
   page.wait_for_function(
     'Array.from(document.querySelectorAll(".nb-figure img")).every(i=>i.complete&&i.naturalWidth>100)',
     timeout=35000
   )
   count=page.locator(".nb-figure img").count()
   assert page.locator(".chapter").count()>=5, "Expected original-style notebook chapters"
   collapsed=page.locator("details.code-cell")
   assert collapsed.count()>=5, "Python code units should exist"
   assert page.locator("details.code-cell[open]").count()==0, "Python source must be collapsed by default"
   assert page.locator(".hero-img").is_visible(), "Missing approved Notebook hero photo"
   page.locator("details.code-cell summary").first.click()
   assert page.locator("details.code-cell[open]").count()==1, "Click did not expand source"
   page.locator("details.code-cell summary").first.click()
   assert page.locator("details.code-cell[open]").count()==0, "Click did not re-collapse source"
   page.locator("#toggle-codes").click()
   assert page.locator("details.code-cell[open]").count()==collapsed.count(), "Expand all did not expand all code"
   page.locator("#toggle-codes").click()
   assert page.locator("details.code-cell[open]").count()==0, "Collapse all did not collapse code"
   page.screenshot(path=str(Path(os.environ.get("RUNNER_TEMP","/tmp"))/f"notebook-student-v2-{lab}.png"),full_page=True)
   print("Approved-layout Notebook: ",lab,count,"rendered images; all code collapsed by default")
  if errors: raise AssertionError("Page errors: "+repr(errors))
  browser.close()
finally:
 server.terminate()
 server.wait(timeout=15)
print("REAL BROWSER STUDENT QA PASS")

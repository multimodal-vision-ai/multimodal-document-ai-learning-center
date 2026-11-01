#!/usr/bin/env python3
"""Read-only licensed-source review. Generates contact sheets, not public HF clips.
No claims about action timing or labels until human review.
"""
import json, os, subprocess, sys, tempfile, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT=Path("artifacts/video-action/source-review")
ROOT.mkdir(parents=True,exist_ok=True)
SOURCES=[
 ("phone_use_phubbing","Phubbing...webm","phone_use","CC BY-SA 4.0","Jaqueline Romero"),
 ("phone_use_education","1 Me and my phone.webm","phone_use","CC BY 4.0","Derek J Moore"),
 ("eating_military","Eating with Bryan - Col Kosalka (962712).webm","eating","US government work","US Army"),
 ("falling_commons","Falling man.webm","falling","CC0 1.0","Salmanamjad053")
]
FONT=ImageFont.load_default()
def fetch(name,path):
    url="https://commons.wikimedia.org/wiki/Special:Redirect/file/"+urllib.parse.quote(name,safe="")
    req=urllib.request.Request(url,headers={"User-Agent":"MVAI-VideoResearchPilot/1.0 (noncommercial review; sources Wikimedia Commons)"})
    with urllib.request.urlopen(req,timeout=100) as stream,path.open("wb") as out:
        total=0
        while True:
            chunk=stream.read(256*1024)
            if not chunk:break
            total+=len(chunk)
            if total>95000000:raise RuntimeError("max 95MB exceeded for "+name)
            out.write(chunk)
    return total
def probe(path):
    p=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","json",str(path)],
     capture_output=True,text=True,check=True,timeout=30)
    return float(json.loads(p.stdout)["format"]["duration"])
def frame(path,second,out):
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss",str(second),"-i",str(path),
    "-frames:v","1","-vf","scale=352:198:force_original_aspect_ratio=decrease,pad=352:198:(ow-iw)/2:(oh-ih)/2:color=black",
    str(out)],check=True,timeout=45)
report=[]
with tempfile.TemporaryDirectory() as td:
  for sample_id,name,category,license,author in SOURCES:
    row={"id":sample_id,"filename":name,"category_candidate":category,"license":license,"author":author,
      "source_url":"https://commons.wikimedia.org/wiki/File:"+urllib.parse.quote(name.replace(" ","_"),safe="._()-"),
      "status":"candidate_pending_frame_level_review"}
    try:
      source=Path(td)/(sample_id+".webm")
      row["source_bytes"]=fetch(name,source)
      duration=probe(source);row["duration_s"]=round(duration,2)
      imgs=[]
      for i in range(6):
        t=max(.05,min(duration-.2,(i+.5)*duration/6))
        fn=Path(td)/(sample_id+f"_{i}.png")
        frame(source,round(t,2),fn)
        im=Image.open(fn).convert("RGB").resize((352,198))
        c=Image.new("RGB",(352,225),"white")
        c.paste(im,(0,0))
        ImageDraw.Draw(c).text((10,202),f"{sample_id} t={t:.1f}s",fill="black",font=FONT)
        imgs.append(c)
      sheet=Image.new("RGB",(1056,450),"#eeeeee")
      for i,im in enumerate(imgs):sheet.paste(im,((i%3)*352,(i//3)*225))
      sheet.save(ROOT/(sample_id+".jpg"),quality=85)
      print("REVIEW_READY",sample_id,row["source_bytes"],row["duration_s"],flush=True)
    except Exception as error:
      row["error"]=type(error).__name__+": "+str(error)[:200]
      print("REVIEW_FAILED",sample_id,row["error"],flush=True)
    report.append(row)
(ROOT/"review_index.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf8")
if not any("error" not in r for r in report):sys.exit("No source preview could be generated")

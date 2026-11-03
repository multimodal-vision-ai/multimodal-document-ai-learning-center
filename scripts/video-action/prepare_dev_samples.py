#!/usr/bin/env python3
"""Prepare short, reproducible B-set clips for the isolated V1.0.13 DEV dataset branch.

Only public, explicitly licensed Wikimedia Commons sources are mirrored here.
The two Pexels samples remain external embeds under the Pexels Free License.
"""
import hashlib
import json
import shutil
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT=Path("docs/assets/projects/video-action/browser-inference")
config=json.loads((ROOT/"config.json").read_text(encoding="utf8"))
if config.get("dataset_branch")=="v103-dev-samples":
 print("SAMPLE_ASSETS_ALREADY_PUBLISHED",config.get("dataset_revision"))
 raise SystemExit(0)

OUT=Path("artifacts/video-action/dev-samples")
RAW=OUT/"source"
OUT.mkdir(parents=True,exist_ok=True)
RAW.mkdir(parents=True,exist_ok=True)

SOURCES={
 "jogging":{
  "url":"https://upload.wikimedia.org/wikipedia/commons/1/1b/Jogging_-_near_arakawa_river_-_tokyo_japan_-_2022_may_3.webm",
  "start":0,"duration":10,
  "source":"https://commons.wikimedia.org/wiki/File:Jogging_-_near_arakawa_river_-_tokyo_japan_-_2022_may_3.webm",
  "license":"CC BY 4.0","author":"Nesnad"
 },
 "yoga":{
  "url":"https://upload.wikimedia.org/wikipedia/commons/8/88/Yoga_Series.webm",
  "start":0,"duration":10,
  "source":"https://commons.wikimedia.org/wiki/File:Yoga_Series.webm",
  "license":"CC BY-SA 3.0","author":"Susanagu"
 },
 "push_up":{
  "url":"https://upload.wikimedia.org/wikipedia/commons/0/0c/Army_Combat_Fitness_Test-_Hand-Release_Push-Up_%28HRP%29_%28Event_3%29.webm",
  "start":0,"duration":10,
  "source":"https://commons.wikimedia.org/wiki/File:Army_Combat_Fitness_Test-_Hand-Release_Push-Up_(HRP)_(Event_3).webm",
  "license":"Public Domain (U.S. federal government work)","author":"U.S. Army Combat Fitness Test"
 },
 "sit_up":{
  "url":"https://upload.wikimedia.org/wikipedia/commons/c/c7/Demonstration_of_A_Sit-up.webm",
  "start":0,"duration":10,
  "source":"https://commons.wikimedia.org/wiki/File:Demonstration_of_A_Sit-up.webm",
  "license":"CC BY-SA 3.0","author":"Wxhsyhzz"
 },
 "hula_hooping":{
  "url":"https://upload.wikimedia.org/wikipedia/commons/e/ee/Berlin_girl_turning_a_hula_hoop%2C_Berlin_2013_%282013-08-23_by_Thomas_Quine%29.webm",
  "start":0,"duration":10,
  "source":"https://commons.wikimedia.org/wiki/File:Berlin_girl_turning_a_hula_hoop,_Berlin_2013_(2013-08-23_by_Thomas_Quine).webm",
  "license":"CC BY 2.0","author":"Thomas Quine"
 }
}

def run(args):
 subprocess.run(args,check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)

def sha256(path):
 h=hashlib.sha256()
 with path.open("rb") as f:
  for block in iter(lambda:f.read(1024*1024),b""):h.update(block)
 return h.hexdigest()

def probe(path):
 raw=subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration:stream=width,height","-of","json",str(path)],text=True)
 data=json.loads(raw);v=next(x for x in data["streams"] if "width" in x)
 return {"duration_seconds":float(data["format"]["duration"]),"width":int(v["width"]),"height":int(v["height"])}

manifest={}
for key,spec in SOURCES.items():
 source=RAW/(key+".webm")
 if not source.exists() or source.stat().st_size<100_000:
  last_error=None
  for attempt in range(6):
   try:
    req=urllib.request.Request(spec["url"],headers={
     "User-Agent":"Mozilla/5.0 (compatible; MVAI-Learning-Center/1.0; educational video sample with attribution)",
     "Referer":"https://commons.wikimedia.org/","Accept":"*/*"})
    with urllib.request.urlopen(req,timeout=120) as response,source.open("wb") as target:
     shutil.copyfileobj(response,target)
    last_error=None
    break
   except urllib.error.HTTPError as error:
    last_error=error
    if error.code not in (429,500,502,503,504):raise
    delay=min(60,8*(2**attempt))
    print("SOURCE_RETRY",key,"HTTP",error.code,"sleep",delay)
    time.sleep(delay)
  if last_error:raise last_error
 if source.stat().st_size<100_000:raise RuntimeError("Source download unexpectedly small: "+key)
 time.sleep(4)
 output=OUT/(key+".mp4")
 run(["ffmpeg","-y","-ss",str(spec["start"]),"-i",str(source),"-t",str(spec["duration"]),
      "-an","-c:v","libx264","-preset","veryfast","-crf","24","-pix_fmt","yuv420p",
      "-movflags","+faststart",str(output)])
 meta=probe(output)
 if not 8<=meta["duration_seconds"]<=12:raise RuntimeError(f"{key} duration outside V1.0: {meta}")
 if meta["width"]<1280 or meta["height"]<720:raise RuntimeError(f"{key} resolution below 720p: {meta}")
 manifest[key]={**spec,**meta,"file":output.name,"sha256":sha256(output),
                "modification":f"Trimmed from {spec['start']}s for {spec['duration']}s; re-encoded H.264 MP4; audio removed"}
 print("SAMPLE_READY",key,json.dumps(manifest[key],ensure_ascii=False))
(OUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf8")
print("PREPARED_B_SAMPLES="+str(len(manifest)))

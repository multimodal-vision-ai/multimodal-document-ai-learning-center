#!/usr/bin/env python3
"""Inspect public-domain 1950 adult sleep education film for actual sleep posture scenes; NO upload."""
import json,os,subprocess,urllib.request,tempfile
from pathlib import Path
from PIL import Image,ImageDraw
OUT=Path("artifacts/video-action/sleep-review");OUT.mkdir(parents=True,exist_ok=True)
URL="https://archive.org/download/Sleepfor1950/Sleepfor1950.ogv"
with tempfile.TemporaryDirectory() as td:
    path=Path(td)/"sleep.ogv"
    req=urllib.request.Request(URL,headers={"User-Agent":"MVAI-Learning-Center-Open-Media-Research/1.0"})
    with urllib.request.urlopen(req,timeout=100) as response,path.open("wb") as dest:
        while True:
            chunk=response.read(524288)
            if not chunk:break
            dest.write(chunk)
            if dest.tell()>58000000:raise RuntimeError("source too large")
    frames=Path(td)/"thumbs";frames.mkdir()
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-i",str(path),
      "-vf","fps=1/20,scale=320:200:force_original_aspect_ratio=decrease,pad=320:200:(ow-iw)/2:(oh-ih)/2","-q:v","6",str(frames/"frame_%03d.jpg")],check=True,timeout=220)
    shots=sorted(frames.glob("*.jpg"))
    print("SLEEP_FILM_SIZE_BYTES",path.stat().st_size)
    print("SLEEP_SAMPLE_COUNT",len(shots))
    if len(shots)<12:raise RuntimeError("too few film frames")
    for start in range(0,len(shots),36):
        sub=shots[start:start+36]
        sheet=Image.new("RGB",(6*320,6*225),"white")
        for i,p in enumerate(sub):
            im=Image.open(p).convert("RGB");x=(i%6)*320;y=(i//6)*225
            sheet.paste(im,(x,y))
            ImageDraw.Draw(sheet).text((x+7,y+202),f"t~{(start+i)*20:03d}s",fill="black")
        sheet.save(OUT/f"sleep_1950_overview_{start//36:02d}.jpg",quality=88)
    (OUT/"source.json").write_text(json.dumps({"source":URL,"source_page":"https://commons.wikimedia.org/wiki/File:Sleepfor1950.ogv",
       "author":"Encyclopaedia Britannica (1950), public-domain marked archival education film",
       "sampled_every_seconds":20,"frames":len(shots),"status":"frame_review_not_yet_approved"},indent=2))

#!/usr/bin/env python3
"""Validate a 10-second phone-use candidate visually; never auto-publish."""
import subprocess, tempfile, urllib.request, hashlib, os, json
from pathlib import Path
from PIL import Image, ImageDraw
ROOT=Path("artifacts/video-action/phone-use-candidate")
ROOT.mkdir(parents=True,exist_ok=True)
URL="https://upload.wikimedia.org/wikipedia/commons/5/52/Phubbing...webm"
SOURCE="https://commons.wikimedia.org/wiki/File:Phubbing...webm"
with tempfile.TemporaryDirectory() as td:
    src=Path(td)/"source.webm"
    req=urllib.request.Request(URL,headers={"User-Agent":"MVAI-Research-EducationalReview/1.0"})
    with urllib.request.urlopen(req,timeout=75) as r,src.open("wb") as out:
        while True:
            part=r.read(262144)
            if not part:break
            out.write(part)
            if out.tell()>6500000:raise RuntimeError("Oversized source")
    output=ROOT/"phone_use_42s_10s.mp4"
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss","42","-i",str(src),"-t","10","-vf","fps=5,scale=480:-2","-an","-c:v","libx264","-pix_fmt","yuv420p","-movflags","+faststart",str(output)],check=True,timeout=90)
    sheet=Image.new("RGB",(352*4,225*3),"white")
    for j in range(12):
        t=(j+.5)*10/12
        frame=Path(td)/f"{j}.jpg"
        subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-ss",str(t),"-i",str(output),"-frames:v","1","-vf","scale=352:198:force_original_aspect_ratio=decrease,pad=352:198:(ow-iw)/2:(oh-ih)/2","-y",str(frame)],check=True,timeout=30)
        img=Image.open(frame).convert("RGB")
        sheet.paste(img,((j%4)*352,(j//4)*225))
        ImageDraw.Draw(sheet).text(((j%4)*352+10,(j//4)*225+199),f"source t={42+t:.1f}s",fill="black")
    sheet.save(ROOT/"contact-sheet.jpg",quality=87)
    digest=hashlib.sha256(output.read_bytes()).hexdigest()
    (ROOT/"metadata.json").write_text(json.dumps({"id":"phone_use_phubbing_review","status":"awaiting_manual_visual_and_rights_review","source_url":SOURCE,"license":"CC BY-SA 4.0","attribution":"Jaqueline Romero","source_start_s":42,"source_end_s":52,"sha256":digest,"size":output.stat().st_size},indent=2),encoding="utf8")
    print("PHONE_USE_REVIEW_SHEET_READY",digest,output.stat().st_size)

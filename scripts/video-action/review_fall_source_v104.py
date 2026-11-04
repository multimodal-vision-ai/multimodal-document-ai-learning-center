#!/usr/bin/env python3
"""Review a REAL standing-to-fall clip from the authors' CC BY-NC 4.0 dataset; no upload."""
import hashlib,json,subprocess,urllib.request,tempfile
from pathlib import Path
from PIL import Image,ImageDraw
SOURCE="https://github.com/samruddhi-2308/FallDetectionDataset"
LICENSE=SOURCE+"/blob/main/LICENSE"
CLIP="data/standing_to_fall/video_20260216_152357.mp4"
URL="https://raw.githubusercontent.com/samruddhi-2308/FallDetectionDataset/main/"+CLIP
OUT=Path("artifacts/video-action/fall-source-audit")
OUT.mkdir(parents=True,exist_ok=True)
req=urllib.request.Request(URL,headers={"User-Agent":"MVAI-Fall-Pilot-Source-Audit/1.0"})
with tempfile.TemporaryDirectory() as td:
  f=Path(td)/"candidate.mp4"
  with urllib.request.urlopen(req,timeout=80) as inp,f.open("wb") as dst:
    while True:
      data=inp.read(256*1024)
      if not data:break
      dst.write(data)
      if dst.tell()>35000000:raise RuntimeError("Fall source exceeds 35MB safety cap")
  if f.stat().st_size<10000:raise RuntimeError("Source not video or Git LFS pointer")
  raw=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","json",str(f)],capture_output=True,text=True,check=True,timeout=30)
  duration=float(json.loads(raw.stdout)["format"]["duration"])
  if not (.5<duration<180):raise RuntimeError("Unexpected video duration")
  sheet=Image.new("RGB",(320*4,225*3),"white")
  for i in range(12):
    second=(i+.5)*duration/12
    shot=Path(td)/f"frame_{i}.png"
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss",str(second),"-i",str(f),
        "-frames:v","1","-vf","scale=320:200:force_original_aspect_ratio=decrease,pad=320:200:(ow-iw)/2:(oh-ih)/2",str(shot)],check=True,timeout=30)
    pic=Image.open(shot).convert("RGB")
    x=i%4*320;y=i//4*225
    sheet.paste(pic,(x,y));ImageDraw.Draw(sheet).text((x+10,y+204),f"t={second:.1f}s",fill="black")
  sheet.save(OUT/"standing-fall-12frames.jpg",quality=88)
  (OUT/"source.json").write_text(json.dumps({"dataset":SOURCE,"source_video":URL,"license_url":LICENSE,"declared_license":"CC BY-NC 4.0","original_sha256":hashlib.sha256(f.read_bytes()).hexdigest(),"duration_s":duration,"bytes":f.stat().st_size,"status":"visual_review_pending","notes":"This source clip has an indicated standing_to_fall class in its CSV; visual evidence and rights must be verified before reuse."},indent=2))
  print("FALL_AUDIT_SOURCE_READ",duration,f.stat().st_size)

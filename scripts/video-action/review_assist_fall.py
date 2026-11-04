#!/usr/bin/env python3
"""Fallback read-only review of CC BY 4.0 ASSIST-IoT controlled fall videos; no public uploads."""
import hashlib,json,os,subprocess,sys,urllib.request,zipfile
from pathlib import Path
from PIL import Image,ImageDraw
OUT=Path("artifacts/video-action/assist-fall-review");OUT.mkdir(parents=True,exist_ok=True)
REQ={"User-Agent":"MVAI-Research-Open-Data-Validation/1.0"}
def read_json(u):
  with urllib.request.urlopen(urllib.request.Request(u,headers=REQ),timeout=65) as f:return json.load(f)
metadata=read_json("https://zenodo.org/api/records/8340379")
files=metadata.get("files",[])
target=next((f for f in files if "multimodal-fall-detection-dataset" in f.get("key","").lower() and f["key"].lower().endswith(".zip")),None)
if not target:raise RuntimeError("ASSIST-IoT ZIP not found in Zenodo API")
url=target.get("links",{}).get("self") or target.get("links",{}).get("content")
if not url:raise RuntimeError("Zenodo did not provide download URL")
path=Path("/tmp/mvai_assist_fall.zip")
try:
  with urllib.request.urlopen(urllib.request.Request(url,headers=REQ),timeout=85) as stream,path.open("wb") as dest:
    while True:
      chunk=stream.read(1024*1024)
      if not chunk:break
      dest.write(chunk)
      if dest.tell()>210000000:raise RuntimeError("archive larger than expected")
  checksum=hashlib.md5(path.read_bytes()).hexdigest()
  if checksum!="27b5ac0cd29da1797175222af7774933":raise RuntimeError("Archive MD5 differs: "+checksum)
  with zipfile.ZipFile(path) as archive:
    members=[x for x in archive.infolist() if not x.is_dir() and x.filename.lower().endswith((".mp4",".avi",".mov",".webm"))]
    print("ASSIST_VIDEO_COUNT",len(members))
    print("ASSIST_NAMES_FIRST_60",[x.filename for x in members[:60]])
    if not members:raise RuntimeError("No action video found in ZIP")
    ranked=sorted(members,key=lambda m:(0 if any(s in m.filename.lower() for s in ("fall","trip","slip")) else 1,m.file_size))
    reviewed=[]
    for j,m in enumerate(ranked[:3]):
      if m.file_size<10000 or m.file_size>35000000:continue
      source=Path("/tmp")/(f"mvai_assist_review_{j}"+Path(m.filename).suffix)
      with archive.open(m) as inp,source.open("wb") as dest:
        while True:
          block=inp.read(524288)
          if not block:break
          dest.write(block)
      raw=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","json",str(source)],
        check=True,capture_output=True,text=True,timeout=35).stdout
      duration=float(json.loads(raw)["format"]["duration"])
      if not (1<=duration<=180):continue
      sheet=Image.new("RGB",(1280,675),"white")
      for i in range(12):
        sec=(i+.5)*min(duration,20)/12
        tile=Path("/tmp")/f"mvai_assist_{j}_{i}.jpg"
        subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss",str(sec),"-i",str(source),
          "-frames:v","1","-vf","scale=320:200:force_original_aspect_ratio=decrease,pad=320:200:(ow-iw)/2:(oh-ih)/2",str(tile)],check=True,timeout=30)
        im=Image.open(tile).convert("RGB");x=(i%4)*320;y=(i//4)*225
        sheet.paste(im,(x,y));ImageDraw.Draw(sheet).text((x+8,y+203),f"t={sec:.1f}s",fill="black")
      sheet.save(OUT/f"assist_fall_candidate_{j}.jpg",quality=87)
      reviewed.append({"member_name":m.filename,"duration_s":duration,"sha256":hashlib.sha256(source.read_bytes()).hexdigest(),"source_archive_md5":checksum,"license":"CC BY 4.0"})
    (OUT/"review_index.json").write_text(json.dumps({"archive_url":url,"dataset":"https://zenodo.org/records/8340379","reviewed":reviewed},indent=2))
    if not reviewed:sys.exit("No video decoded for contact sheets")
    print("ASSIST_FALL_REVIEW_READY",len(reviewed))
finally:
  if path.exists():path.unlink()

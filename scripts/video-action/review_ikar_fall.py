#!/usr/bin/env python3
"""Read-only CC-BY-4.0 IKAR (AGH University) fall-video review. Never reuploads raw archive."""
import hashlib,json,os,subprocess,sys,tarfile,urllib.parse,urllib.request
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path("artifacts/video-action/ikar-review");ROOT.mkdir(parents=True,exist_ok=True)
BASE="https://agh.rodbuk.pl"
PID="doi:10.58032/AGH/A1NZPE"
HEADERS={"User-Agent":"MVAI-Learning-Center-Research-Safe-Fall-Pilot/1.0"}
def getjson(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers=HEADERS),timeout=50) as f:
        return json.load(f)
result=getjson(BASE+"/api/datasets/:persistentId/?"+urllib.parse.urlencode({"persistentId":PID}))
if result.get("status")!="OK":raise RuntimeError("Dataverse dataset API not accessible")
files=result["data"]["latestVersion"]["files"]
entry=next((x["dataFile"] for x in files if x["dataFile"].get("filename","")=="IKAR_dataset.tar.gz"),None)
if not entry:raise RuntimeError("Cannot locate IKAR tar.gz file ID")
fileid=entry["id"];url=BASE+"/api/access/datafile/"+str(fileid)
archive=Path("/tmp/mvai_ikar_data.tar.gz")
try:
    req=urllib.request.Request(url,headers=HEADERS)
    with urllib.request.urlopen(req,timeout=90) as resp,archive.open("wb") as dest:
        while True:
            block=resp.read(1024*1024)
            if not block:break
            dest.write(block)
            if dest.tell()>155000000:raise RuntimeError("Archive larger than expected")
    md5=hashlib.md5(archive.read_bytes()).hexdigest()
    if md5!="2667661c258610c0c0aa4bc58a7fc7c2":raise RuntimeError("Archive MD5 mismatch: "+md5)
    with tarfile.open(archive,"r:gz") as tar:
        names=[m for m in tar.getmembers() if m.isfile() and m.name.lower().endswith((".mp4",".mov",".avi",".webm"))]
        print("IKAR_ARCHIVE_MEMBER_VIDEOS",len(names))
        if not names:raise RuntimeError("No recognizable videos in archive")
        print("IKAR_FIRST_NAMES",[m.name for m in names[:80]])
        prefers=[m for m in names if any(w in m.name.lower() for w in ("trip","slip","fall","faint","blackout"))]
        candidates=sorted(prefers or names,key=lambda m:m.size)
        reviewed=[]
        for i,m in enumerate(candidates[:3]):
            if m.size<10000 or m.size>35000000:continue
            raw=Path("/tmp")/f"mvai_ikar_review_{i}"+Path(m.name).suffix
            with tar.extractfile(m) as f,raw.open("wb") as o:
                while True:
                    data=f.read(512*1024)
                    if not data:break
                    o.write(data)
            info=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration:stream=codec_name",
               "-of","json",str(raw)],capture_output=True,text=True,timeout=35,check=True)
            meta=json.loads(info.stdout)
            duration=float(meta["format"]["duration"])
            if duration<1 or duration>180:continue
            images=[]
            for k in range(12):
                t=(k+.4)*min(duration,20)/12
                out=Path("/tmp")/f"mvai_ikar_{i}_{k}.png"
                subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss",str(t),"-i",str(raw),
                    "-frames:v","1","-vf",
                    "scale=320:200:force_original_aspect_ratio=decrease,pad=320:200:(ow-iw)/2:(oh-ih)/2",str(out)],check=True,timeout=25)
                im=Image.open(out).convert("RGB")
                tile=Image.new("RGB",(320,225),"white");tile.paste(im,(0,0))
                ImageDraw.Draw(tile).text((8,203),f"t={t:.1f}s",fill="black")
                images.append(tile)
            sheet=Image.new("RGB",(320*4,225*3),"white")
            for j,im in enumerate(images):sheet.paste(im,((j%4)*320,(j//4)*225))
            sheet.save(ROOT/f"ikar_candidate_{i:02d}.jpg",quality=87)
            reviewed.append({"member_name":m.name,"original_sha256":hashlib.sha256(raw.read_bytes()).hexdigest(),
               "duration":duration,"bytes":m.size,"license":"CC BY 4.0",
               "source":"https://doi.org/10.58032/AGH/A1NZPE","dataset_archive_file_id":fileid})
    (ROOT/"review_index.json").write_text(json.dumps({"dataset_id":PID,"md5":md5,"candidates":reviewed},indent=2))
    if not reviewed:sys.exit("No decoded candidates; no upload")
    print("IKAR_FALL_REVIEW_READY",len(reviewed))
finally:
    if archive.exists():archive.unlink()

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

    # Explicitly inspect the adult bed posture sequence at t=236..244 seconds.
    clip=Path(td)/"sleep_posture_candidate.mp4"
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss","248","-i",str(path),
      "-t","8","-vf","fps=5,scale=480:-2","-an","-c:v","libx264",
      "-pix_fmt","yuv420p","-movflags","+faststart",str(clip)],check=True,timeout=90)
    tiles=Image.new("RGB",(4*320,4*225),"white")
    for j in range(16):
      still=Path(td)/f"clipshot{j}.png"
      subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss",str(j/2),
        "-i",str(clip),"-frames:v","1","-vf",
        "scale=320:200:force_original_aspect_ratio=decrease,pad=320:200:(ow-iw)/2:(oh-ih)/2",
        str(still)],check=True,timeout=50)
      im=Image.open(still).convert("RGB")
      x=(j%4)*320;y=(j//4)*225
      tiles.paste(im,(x,y))
      ImageDraw.Draw(tiles).text((x+7,y+203),f"t={248+j/2:.1f}s",fill="black")
    tiles.save(OUT/"sleep_1950_details_248_256.jpg",quality=90)
    import hashlib
    (OUT/"clip_review_sha.json").write_text(json.dumps({"source_start_s":248,"source_end_s":256,
       "sha256":hashlib.sha256(clip.read_bytes()).hexdigest(),"bytes":clip.stat().st_size,
       "status":"pending_manual_frame_confirmation"},indent=2))

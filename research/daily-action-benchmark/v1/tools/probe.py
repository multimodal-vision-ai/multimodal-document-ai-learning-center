#!/usr/bin/env python3
"""Source-video verification: hashes and ffprobe only, with no redistribution.
Choose 2 clips each from call/use/sleep/eat/fall/walk pilot candidates.
Raw downloaded media are immediately discarded.
"""
import csv, json, hashlib, subprocess, tempfile, urllib.request, time, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(name):
    with (ROOT/"manifests"/name).open(encoding="utf-8") as f:return list(csv.DictReader(f))
clips={x["clip_id"]:x for x in read("clips.csv")}
candidates=read("pilot_candidates.csv")
selected=[];counts={}
for row in candidates:
    label=row["requested_label"]
    if counts.get(label,0)<2:
        selected.append(row);counts[label]=counts.get(label,0)+1
results=[]
for row in selected:
    c=clips[row["clip_id"]]
    rec={"clip_id":row["clip_id"],"reference":row["requested_label"],"source_label_evidence":row["evidence"],
      "source_file_url":c["media_ref_url"],"upstream_size_bytes":c["media_bytes_github_listing"],
      "status":"not_checked","license_review":"required_before_public_redistribution"}
    try:
        with tempfile.TemporaryDirectory() as temp:
            media=Path(temp)/"sample.mp4"
            req=urllib.request.Request(c["media_download_url"],headers={"User-Agent":"MVAI-DailyAction-Benchmark/1.0"})
            sha=hashlib.sha256();n=0
            with urllib.request.urlopen(req,timeout=55) as inp,media.open("wb") as dst:
                while True:
                    chunk=inp.read(1024*1024)
                    if not chunk:break
                    n+=len(chunk)
                    if n>60_000_000:raise RuntimeError("file exceeds controlled size limit")
                    sha.update(chunk);dst.write(chunk)
            rec["downloaded_bytes"]=n;rec["sha256"]=sha.hexdigest()
            if int(c["media_bytes_github_listing"])!=n:
                rec["listing_size_mismatch"]=True
            p=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration,size:stream=codec_type,codec_name,width,height,avg_frame_rate","-of","json",str(media)],capture_output=True,text=True,timeout=25,check=True)
            meta=json.loads(p.stdout)
            rec["duration_s"]=round(float(meta["format"]["duration"]),3)
            streams=meta.get("streams",[])
            video=next((s for s in streams if s.get("codec_type")=="video"),None)
            if not video:raise RuntimeError("no video track")
            rec.update({"video_codec":video.get("codec_name"),"width":video.get("width"),"height":video.get("height"),"avg_frame_rate":video.get("avg_frame_rate")})
            check=subprocess.run(["ffmpeg","-v","error","-ss","0.4","-i",str(media),"-frames:v","1","-f","null","-"],capture_output=True,text=True,timeout=25)
            if check.returncode:raise RuntimeError("frame decode failed: "+check.stderr[:150])
            rec["frame_decodable"]=True
            rec["duration_delta_s"]=round(rec["duration_s"]-float(c["duration_claim_s"]),3)
            rec["status"]="downloaded_hashed_decoded"
    except Exception as e:
        rec["status"]="failed";rec["error"]=str(e)
    print("PROBE",json.dumps(rec,ensure_ascii=False),flush=True)
    results.append(rec)
out={"probe_scope":"source-video file accessibility and technical decodability, NOT label visual confirmation",
     "count":len(results),"passed":sum(x["status"]=="downloaded_hashed_decoded" for x in results),
     "failed":sum(x["status"]=="failed" for x in results),"records":results}
(ROOT/"reports"/"media_probe_latest.json").write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
if not out["passed"]:sys.exit(1)

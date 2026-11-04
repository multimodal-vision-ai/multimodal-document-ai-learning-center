#!/usr/bin/env python3
"""Publish one visually audited REAL adult fall, CC BY-NC 4.0 research demonstration only.
The original standing-to-fall video is captured from the source creators' public data.
"""
import hashlib,json,os,subprocess,sys,tempfile,urllib.request
from pathlib import Path
from huggingface_hub import HfApi,hf_hub_download,CommitOperationAdd
REPO="multimodal-vision-ai/mvai-daily-action-demo"
ID="real_falling_007";PATH="demo/videos/real_falling_007.mp4"
SOURCE_REPO="https://github.com/samruddhi-2308/FallDetectionDataset"
SRC="https://raw.githubusercontent.com/samruddhi-2308/FallDetectionDataset/main/data/standing_to_fall/video_20260216_152357.mp4"
PAGE=SOURCE_REPO+"/blob/main/data/standing_to_fall/video_20260216_152357.mp4"
SOURCE_SHA="2eba79be0011035ff2c77cb926cd2c66edd8c8e13f6178ec550243ab25c2f0f8"
token=os.getenv("HF_TOKEN")
if not token:sys.exit("Server-side HF_TOKEN not configured: no public upload")
api=HfApi(token=token)
info=api.repo_info(repo_id=REPO,repo_type="dataset")
if info.private:sys.exit("Expected public research Dataset")
existing={x.rfilename for x in info.siblings}
if PATH in existing:
    print("FALL_ALREADY_PRESENT_SHA="+info.sha);sys.exit(0)
old=json.loads(Path(hf_hub_download(repo_id=REPO,filename="catalog/v1.json",repo_type="dataset",revision=info.sha)).read_text(encoding="utf-8"))
if old.get("schema_version")!="1.0" or old.get("dataset_id")!=REPO:sys.exit("Catalog version invalid")
if any(x.get("id")==ID for x in old["items"]):sys.exit("Refusing partially existing fall sample")
oldmeta=Path(hf_hub_download(repo_id=REPO,filename="demo/metadata.jsonl",repo_type="dataset",revision=info.sha)).read_text(encoding="utf-8")
card=Path(hf_hub_download(repo_id=REPO,filename="README.md",repo_type="dataset",revision=info.sha)).read_text(encoding="utf-8")
with tempfile.TemporaryDirectory() as td:
    root=Path(td);source=root/"source.mp4"
    req=urllib.request.Request(SRC,headers={"User-Agent":"MVAI-NonCommercial-Research-Action-Demo/1.0"})
    with urllib.request.urlopen(req,timeout=90) as stream,source.open("wb") as dest:
        while True:
            block=stream.read(256*1024)
            if not block:break
            dest.write(block)
            if dest.tell()>35000000:sys.exit("Source exceeds maximum video size")
    original_sha=hashlib.sha256(source.read_bytes()).hexdigest()
    if original_sha!=SOURCE_SHA:sys.exit("Original video SHA differs from manually reviewed clip: "+original_sha)
    output=root/"fall.mp4"
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss","6.2","-i",str(source),
      "-t","3.4","-vf","fps=5,scale=480:-2:flags=bicubic","-an","-c:v","libx264",
      "-preset","veryfast","-crf","25","-pix_fmt","yuv420p","-movflags","+faststart",str(output)],
      check=True,timeout=100)
    media=json.loads(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration:stream=codec_name",
      "-of","json",str(output)],check=True,text=True,capture_output=True,timeout=25).stdout)
    duration=float(media["format"]["duration"])
    if not (2.5<=duration<=3.5):sys.exit("Unexpected fall excerpt length: "+str(duration))
    digest=hashlib.sha256(output.read_bytes()).hexdigest()
    clip={"id":ID,"relative_file":PATH,"standard_action_id":"falling","label_zh":"摔倒",
      "label_en":"falling down","source_url":PAGE,"license":"CC BY-NC 4.0",
      "license_url":"https://creativecommons.org/licenses/by-nc/4.0/",
      "attribution":"Samruddhi Lakare; Shreeya Tapaswi; Vedant Karne; Yash Vidhate",
      "redistribution_approved":True,"portrait_release_verified":False,
      "synthetic":False,"status":"approved_demo","verified_label":False,
      "evaluation_tier":"pilot_reference_not_benchmark",
      "reference_evidence":"original_dataset_label_and_12_frame_manual_visual_review",
      "start_s":0,"end_s":round(duration,3),"source_start_s":6.2,"source_end_s":9.6,
      "sha256":digest,"source_sha256":original_sha,
      "notice":"Real staged standing-to-fall event, CC BY-NC 4.0 non-commercial only; face visible, separate portrait consent not independently confirmed; not formal accuracy."}
    meta={"file_name":"videos/"+ID+".mp4","sample_id":ID,
      "standard_action_id":"falling","label_zh":"摔倒","label_en":"falling down",
      "source_url":PAGE,"source_dataset":SOURCE_REPO,"author":clip["attribution"],
      "license":clip["license"],"license_url":clip["license_url"],
      "attribution":clip["attribution"],"redistribution_approved":True,
      "portrait_release_verified":False,"verified_label":False,
      "evaluation_tier":clip["evaluation_tier"],"reference_evidence":clip["reference_evidence"],
      "duration_s":duration,"source_start_s":6.2,"source_end_s":9.6,
      "transform":"Trim original 6.2-9.6 seconds; H264 MP4 5fps at 480px, no audio",
      "sha256":digest,"source_sha256":original_sha}
    old["items"].append(clip)
    (root/"catalog.json").write_text(json.dumps(old,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    (root/"metadata.jsonl").write_text(oldmeta.rstrip()+"\n"+json.dumps(meta,ensure_ascii=False)+"\n",encoding="utf-8")
    disclaimer="""
## Real fall video, NON-COMMERCIAL use only (CC BY-NC 4.0)

Sample real_falling_007 is a 3.4-second adapted excerpt from
[FallDetectionDataset](https://github.com/samruddhi-2308/FallDetectionDataset),
real source: https://github.com/samruddhi-2308/FallDetectionDataset/blob/main/data/standing_to_fall/video_20260216_152357.mp4

Authors: Samruddhi Lakare, Shreeya Tapaswi, Vedant Karne and Yash Vidhate.
License: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
The original 9.65s source was reviewed as a 12-frame contact sheet.
Changes: trimmed source time 6.2–9.6 seconds, downscaled to 480px, 5fps,
transcoded to H.264 MP4, removed audio. Only educational and
non-commercial research presentation/reuse is permitted under this license.
The visible person's separate portrait release has **not** been independently
verified. The source creators' own ethics/privacy notice is at
https://github.com/samruddhi-2308/FallDetectionDataset/blob/main/docs/ethics_and_privacy.md.
Do not identify subjects or use for surveillance, discrimination, medical
or safety-critical automation. This is a pilot source label, not benchmark
ground truth and not a validated fall-detection system.
"""
    (root/"README.md").write_text(card.rstrip()+"\n"+disclaimer,encoding="utf-8")
    operations=[
      CommitOperationAdd(path_in_repo=PATH,path_or_fileobj=str(output)),
      CommitOperationAdd(path_in_repo="catalog/v1.json",path_or_fileobj=str(root/"catalog.json")),
      CommitOperationAdd(path_in_repo="demo/metadata.jsonl",path_or_fileobj=str(root/"metadata.jsonl")),
      CommitOperationAdd(path_in_repo="README.md",path_or_fileobj=str(root/"README.md"))]
    commit=api.create_commit(repo_id=REPO,repo_type="dataset",operations=operations,parent_commit=info.sha,
      commit_message="dataset: add audited non-commercial CC BY-NC real fall action pilot")
    post=api.repo_info(repo_id=REPO,repo_type="dataset")
    print("FALL_REAL_SAMPLE_PUBLISHED_SHA="+post.sha)
    print("FALL_REAL_SAMPLE_SHA256="+digest)
    print("FALL_REAL_SAMPLE_DURATION_S="+str(duration))
    print("FALL_REAL_SAMPLE_URL="+getattr(commit,"commit_url",""))

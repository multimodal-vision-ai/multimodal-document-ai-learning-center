#!/usr/bin/env python3
"""Publish one manually inspected, open-license real phone-use clip as pilot."""
import os,sys,json,hashlib,subprocess,tempfile,urllib.request
from pathlib import Path
from huggingface_hub import HfApi, hf_hub_download, CommitOperationAdd
REPO="multimodal-vision-ai/mvai-daily-action-demo"
ID="real_phone_use_003";TARGET="demo/videos/real_phone_use_003.mp4"
SRC="https://upload.wikimedia.org/wikipedia/commons/5/52/Phubbing...webm"
PAGE="https://commons.wikimedia.org/wiki/File:Phubbing...webm"
EXPECTED="d06bc912a89c0ce23f8bd7232427a904ee46a498fb888b79ceeb90fa0c75c990"
token=os.environ.get("HF_TOKEN")
if not token:sys.exit("No server-side HF_TOKEN; no upload")
api=HfApi(token=token)
info=api.repo_info(repo_id=REPO,repo_type="dataset")
if info.private:sys.exit("Expected public pilot repo")
existing={x.rfilename for x in info.siblings}
if TARGET in existing:
  print("PHONE_USE_ALREADY_PRESENT_SHA="+info.sha);sys.exit(0)
catalog=json.loads(Path(hf_hub_download(repo_id=REPO,filename="catalog/v1.json",revision=info.sha,repo_type="dataset")).read_text())
if catalog.get("schema_version")!="1.0" or catalog.get("dataset_id")!=REPO:sys.exit("Catalog mismatch")
if any(x["id"]==ID for x in catalog["items"]):sys.exit("Partial clip upload; refusing mutation")
metadata_old=Path(hf_hub_download(repo_id=REPO,filename="demo/metadata.jsonl",revision=info.sha,repo_type="dataset")).read_text(encoding="utf8")
card_old=Path(hf_hub_download(repo_id=REPO,filename="README.md",revision=info.sha,repo_type="dataset")).read_text(encoding="utf8")
with tempfile.TemporaryDirectory() as td:
  d=Path(td);raw=d/"Phubbing.webm"
  request=urllib.request.Request(SRC,headers={"User-Agent":"MVAI-Learning-Center-Open-Video-Research/1.0"})
  with urllib.request.urlopen(request,timeout=90) as response,raw.open("wb") as f:
    while True:
      chunk=response.read(262144)
      if not chunk:break
      f.write(chunk)
      if f.tell()>6500000:sys.exit("Oversized source")
  clip=d/"clip.mp4"
  subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss","42","-i",str(raw),"-t","10",
    "-vf","fps=5,scale=480:-2","-an","-c:v","libx264","-pix_fmt","yuv420p",
    "-movflags","+faststart",str(clip)],check=True,timeout=120)
  digest=hashlib.sha256(clip.read_bytes()).hexdigest()
  if digest!=EXPECTED:sys.exit("Video no longer matches inspected candidate: "+digest)
  record={"id":ID,"relative_file":TARGET,"standard_action_id":"phone_use","label_zh":"看/使用手机",
    "label_en":"looking at phone","source_url":PAGE,"license":"CC BY-SA 4.0",
    "license_url":"https://creativecommons.org/licenses/by-sa/4.0/",
    "attribution":"Jaqueline Romero","redistribution_approved":True,
    "portrait_release_verified":False,"synthetic":False,"status":"approved_demo",
    "evaluation_tier":"pilot_reference_not_benchmark","reference_evidence":"visual_reviewed_contact_sheet",
    "start_s":0,"end_s":10,"source_start_s":42,"source_end_s":52,"sha256":digest,
    "notice":"Phone use visible; Top-K is exploratory, not benchmark accuracy"}
  meta={"file_name":"videos/"+ID+".mp4","sample_id":ID,"standard_action_id":"phone_use",
    "label_en":record["label_en"],"label_zh":record["label_zh"],"source_url":PAGE,
    "author":"Jaqueline Romero","attribution":record["attribution"],"license":record["license"],
    "license_url":record["license_url"],"redistribution_approved":True,
    "portrait_release_verified":False,"verified_label":False,
    "evaluation_tier":record["evaluation_tier"],"reference_evidence":record["reference_evidence"],
    "transform":"Source seconds 42-52, silent MP4 resized to 480px, 5 fps",
    "source_start_s":42,"source_end_s":52,"duration_s":10.0,"sha256":digest}
  catalog["items"].append(record)
  (d/"catalog.json").write_text(json.dumps(catalog,indent=2,ensure_ascii=False)+"\n",encoding="utf8")
  (d/"metadata.jsonl").write_text(metadata_old.rstrip()+"\n"+json.dumps(meta,ensure_ascii=False)+"\n",encoding="utf8")
  disclaimer="\n## Real phone-use pilot, per-file CC BY-SA 4.0\n\n" \
   "Sample real_phone_use_003 is a silent 10-second adaptation of " \
   "[Phubbing...](https://commons.wikimedia.org/wiki/File:Phubbing...webm) " \
   "by Jaqueline Romero ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)). " \
   "Changes: seconds 42-52, resized to 480px, transcoded to H.264 at 5fps, audio removed. " \
   "Phone use was visible on reviewed frames, but gaze/action ground truth is not independently confirmed, " \
   "and separate portrait consent is not documented. " \
   "**Exploratory Top-K only; not for formal benchmark scoring.**\n"
  (d/"README.md").write_text(card_old+disclaimer,encoding="utf8")
  ops=[CommitOperationAdd(path_in_repo=TARGET,path_or_fileobj=str(clip)),
    CommitOperationAdd(path_in_repo="catalog/v1.json",path_or_fileobj=str(d/"catalog.json")),
    CommitOperationAdd(path_in_repo="demo/metadata.jsonl",path_or_fileobj=str(d/"metadata.jsonl")),
    CommitOperationAdd(path_in_repo="README.md",path_or_fileobj=str(d/"README.md"))]
  c=api.create_commit(repo_id=REPO,repo_type="dataset",operations=ops,parent_commit=info.sha,
    commit_message="dataset: add CC BY-SA real phone-use pilot (not benchmark)")
  post=api.repo_info(repo_id=REPO,repo_type="dataset")
  print("PHONE_USE_PUBLISHED_SHA="+post.sha)
  print("PHONE_USE_VIDEO_SHA256="+digest)
  print("PHONE_USE_COMMIT="+str(getattr(c,"commit_url","")))

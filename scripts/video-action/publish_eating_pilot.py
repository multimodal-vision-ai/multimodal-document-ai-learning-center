#!/usr/bin/env python3
"""Publish a reviewed actual eating action from an official US Army public-domain clip."""
import os,sys,json,hashlib,subprocess,tempfile,urllib.request
from pathlib import Path
from huggingface_hub import HfApi,hf_hub_download,CommitOperationAdd

REPO="multimodal-vision-ai/mvai-daily-action-demo"
ID="real_eating_004";TARGET="demo/videos/real_eating_004.mp4"
ORIGIN="https://d34w7g4gy10iej.cloudfront.net/video/2505/DOD_110999070/DOD_110999070.mp4"
PAGE="https://commons.wikimedia.org/wiki/File:Eating_with_Bryan_-_Col_Kosalka_(962712).webm"
TOKEN=os.environ.get("HF_TOKEN")
if not TOKEN:sys.exit("HF_TOKEN missing")
api=HfApi(token=TOKEN)
info=api.repo_info(repo_id=REPO,repo_type="dataset")
existing={x.rfilename for x in info.siblings}
if TARGET in existing:
  print("EATING_ALREADY_PRESENT_SHA="+info.sha);sys.exit(0)
catalog=json.loads(Path(hf_hub_download(repo_id=REPO,filename="catalog/v1.json",repo_type="dataset",revision=info.sha)).read_text())
if catalog.get("schema_version")!="1.0" or catalog.get("dataset_id")!=REPO:sys.exit("Catalog mismatch")
if any(x["id"]==ID for x in catalog["items"]):sys.exit("Partial import already exists")
oldmeta=Path(hf_hub_download(repo_id=REPO,filename="demo/metadata.jsonl",repo_type="dataset",revision=info.sha)).read_text(encoding="utf8")
oldcard=Path(hf_hub_download(repo_id=REPO,filename="README.md",repo_type="dataset",revision=info.sha)).read_text(encoding="utf8")
with tempfile.TemporaryDirectory() as td:
  root=Path(td)
  src=root/"source.mp4"
  req=urllib.request.Request(ORIGIN,headers={"User-Agent":"MVAI-Learning-Center-Research-Review/1.0"})
  with urllib.request.urlopen(req,timeout=120) as response,src.open("wb") as dest:
    while True:
      chunk=response.read(524288)
      if not chunk:break
      dest.write(chunk)
      if dest.tell()>85000000:sys.exit("Unexpectedly oversized video")
  if src.stat().st_size!=73319444:sys.exit("Source size changed, refusing upload: "+str(src.stat().st_size))
  clip=root/"clip.mp4"
  subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss","51","-i",str(src),"-t","7",
    "-vf","fps=5,scale=480:-2:flags=bicubic","-an","-c:v","libx264","-crf","25",
    "-pix_fmt","yuv420p","-movflags","+faststart",str(clip)],check=True,timeout=100)
  digest=hashlib.sha256(clip.read_bytes()).hexdigest()
  source_sha=hashlib.sha256(src.read_bytes()).hexdigest()
  record={"id":ID,"relative_file":TARGET,"standard_action_id":"eating",
    "label_zh":"吃东西","label_en":"eating","source_url":PAGE,
    "license":"Public domain (US government work)","license_url":PAGE,
    "attribution":"U.S. Army USARASGP / Bryan Araujo",
    "redistribution_approved":True,"portrait_release_verified":False,
    "synthetic":False,"status":"approved_demo",
    "evaluation_tier":"pilot_reference_not_benchmark",
    "reference_evidence":"visual_reviewed_contact_sheet",
    "start_s":0,"end_s":7,"source_start_s":51,"source_end_s":58,
    "sha256":digest,"source_sha256":source_sha,
    "notice":"Visible utensil-to-mouth eating at source 53-57s; no formal dataset-level accuracy"}
  meta={"file_name":"videos/"+ID+".mp4","sample_id":ID,"standard_action_id":"eating",
    "label_zh":"吃东西","label_en":"eating","source_url":PAGE,
    "license":record["license"],"license_url":PAGE,"author":record["attribution"],
    "attribution":record["attribution"],"redistribution_approved":True,
    "portrait_release_verified":False,"verified_label":False,
    "reference_evidence":"visual_reviewed_contact_sheet",
    "evaluation_tier":"pilot_reference_not_benchmark",
    "duration_s":7.0,"source_start_s":51,"source_end_s":58,
    "sha256":digest,"source_sha256":source_sha,
    "transform":"Trim 51-58s, resize to 480px, 5 fps, remove audio"}
  catalog["items"].append(record)
  (root/"catalog.json").write_text(json.dumps(catalog,indent=2,ensure_ascii=False)+"\n",encoding="utf8")
  (root/"metadata.jsonl").write_text(oldmeta.rstrip()+"\n"+json.dumps(meta,ensure_ascii=False)+"\n",encoding="utf8")
  card="\n## Real eating pilot (public domain, US federal government)\n\n" \
    "Sample real_eating_004 is an adapted excerpt from [Eating with Bryan - Col Kosalka](https://commons.wikimedia.org/wiki/File:Eating_with_Bryan_-_Col_Kosalka_(962712).webm), " \
    "by U.S. Army USARASGP / Bryan Araujo. License status: public domain in the United States as a US government work; " \
    "separate portrait/personality rights and applicability outside the US are not independently established. " \
    "Changes: source seconds 51-58, audio removed, 480px H.264, 5 fps. " \
    "Frames at approximately source 53-57s show food being brought to the mouth. " \
    "This is a teaching/demo sample, not an independently annotated benchmark. " \
    "No US Army endorsement is implied.\n"
  (root/"README.md").write_text(oldcard+card,encoding="utf8")
  ops=[CommitOperationAdd(path_in_repo=TARGET,path_or_fileobj=str(clip)),
    CommitOperationAdd(path_in_repo="catalog/v1.json",path_or_fileobj=str(root/"catalog.json")),
    CommitOperationAdd(path_in_repo="demo/metadata.jsonl",path_or_fileobj=str(root/"metadata.jsonl")),
    CommitOperationAdd(path_in_repo="README.md",path_or_fileobj=str(root/"README.md"))]
  c=api.create_commit(repo_id=REPO,repo_type="dataset",operations=ops,parent_commit=info.sha,
    commit_message="dataset: add public-domain real eating pilot (non-benchmark)")
  updated=api.repo_info(repo_id=REPO,repo_type="dataset")
  print("EATING_PUBLISHED_SHA="+updated.sha)
  print("EATING_SHA256="+digest)
  print("EATING_COMMIT="+str(getattr(c,"commit_url","")))

#!/usr/bin/env python3
"""Publish a visually reviewed REAL adult bed-rest/sleep posture pilot from a public-domain film.
The clip does not prove physiological sleep. No fabricated ground-truth or medical claim.
"""
import hashlib,json,os,subprocess,sys,tempfile,urllib.request
from pathlib import Path
from huggingface_hub import HfApi,hf_hub_download,CommitOperationAdd
REPO="multimodal-vision-ai/mvai-daily-action-demo";ID="real_sleep_posture_006"
TARGET="demo/videos/real_sleep_posture_006.mp4"
SRC="https://archive.org/download/Sleepfor1950/Sleepfor1950.ogv"
PAGE="https://commons.wikimedia.org/wiki/File:Sleepfor1950.ogv"
EXPECTED_SHA="8748ed31b09be494d4c06fbff2adec0e2c7f6e60584b95096f0702a225a0b9ec"
TOKEN=os.getenv("HF_TOKEN")
if not TOKEN:sys.exit("Missing HF_TOKEN; do not upload")
api=HfApi(token=TOKEN);info=api.repo_info(repo_id=REPO,repo_type="dataset")
if info.private:sys.exit("Expected public pilot repo")
existing={f.rfilename for f in info.siblings}
if TARGET in existing:
 print("SLEEP_ALREADY_PRESENT_SHA="+info.sha);sys.exit(0)
catalog=json.loads(Path(hf_hub_download(REPO,filename="catalog/v1.json",revision=info.sha,repo_type="dataset")).read_text())
if catalog.get("schema_version")!="1.0" or catalog.get("dataset_id")!=REPO:sys.exit("Unexpected catalog contract")
if any(x.get("id")==ID for x in catalog.get("items",[])):sys.exit("Partial target collision")
old_meta=Path(hf_hub_download(REPO,filename="demo/metadata.jsonl",revision=info.sha,repo_type="dataset")).read_text(encoding="utf8")
old_card=Path(hf_hub_download(REPO,filename="README.md",revision=info.sha,repo_type="dataset")).read_text(encoding="utf8")
with tempfile.TemporaryDirectory() as td:
  root=Path(td);original=root/"sleep.ogv"
  req=urllib.request.Request(SRC,headers={"User-Agent":"MVAI-Learning-Center-EducationalPublicDomainReview/1.0"})
  with urllib.request.urlopen(req,timeout=100) as resp,original.open("wb") as dest:
    while True:
      block=resp.read(524288)
      if not block:break
      dest.write(block)
      if dest.tell()>58000000:sys.exit("Oversize source")
  output=root/"sleep_posture.mp4"
  subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss","248","-i",str(original),"-t","8",
    "-vf","fps=5,scale=480:-2","-an","-c:v","libx264","-pix_fmt","yuv420p","-movflags","+faststart",str(output)],
    check=True,timeout=130)
  digest=hashlib.sha256(output.read_bytes()).hexdigest()
  if digest!=EXPECTED_SHA:sys.exit("Video hash does not match approved contact-sheet candidate: "+digest)
  record={"id":ID,"relative_file":TARGET,"standard_action_id":"sleep_posture",
    "label_zh":"睡眠姿态（躺卧）","label_en":"sleeping",
    "source_url":PAGE,"license":"Public Domain Mark 1.0 (Commons PDM-owner)",
    "license_url":"https://creativecommons.org/publicdomain/mark/1.0/",
    "attribution":"Encyclopaedia Britannica, Sleep for Health (1950)",
    "redistribution_approved":True,"portrait_release_verified":False,
    "synthetic":False,"status":"approved_demo","verified_label":False,
    "evaluation_tier":"pilot_reference_not_benchmark",
    "reference_evidence":"visual_reviewed_contact_sheet",
    "start_s":0,"end_s":8,"source_start_s":248,"source_end_s":256,
    "sha256":digest,"source_sha256":hashlib.sha256(original.read_bytes()).hexdigest(),
    "notice":"Archival actor lying in bed; visual sleep-like posture only, physiological sleep unconfirmed"}
  meta={"file_name":"videos/"+ID+".mp4","sample_id":ID,"standard_action_id":"sleep_posture",
    "label_zh":record["label_zh"],"label_en":record["label_en"],"source_url":PAGE,
    "author":record["attribution"],"attribution":record["attribution"],
    "license":record["license"],"license_url":record["license_url"],
    "redistribution_approved":True,"portrait_release_verified":False,"verified_label":False,
    "evaluation_tier":record["evaluation_tier"],"reference_evidence":record["reference_evidence"],
    "duration_s":8.0,"source_start_s":248,"source_end_s":256,
    "transform":"Trim 248-256 seconds, resize to 480px H264 5fps, remove audio",
    "sha256":digest,"source_sha256":record["source_sha256"]}
  catalog["items"].append(record)
  (root/"catalog.json").write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
  (root/"metadata.jsonl").write_text(old_meta.rstrip()+"\n"+json.dumps(meta,ensure_ascii=False)+"\n",encoding="utf8")
  disclaimer="\n## Public domain marked archive sleep-posture pilot\n\n" \
    "Sample real_sleep_posture_006 is an excerpt from " \
    "[Sleep for Health (1950)](https://commons.wikimedia.org/wiki/File:Sleepfor1950.ogv), " \
    "attributed to Encyclopaedia Britannica. Commons file page carries Public Domain Mark 1.0 (PDM-owner). " \
    "Changes: original seconds 248-256, silent H264 MP4, resized 480px at 5 fps. " \
    "The video portrays an adult lying under bedding; **visible posture only**, not physiological verification of sleep. " \
    "Separate performer consent and applicability of public-domain claims in all countries have not been independently established. " \
    "Not a benchmark accuracy label.\n"
  (root/"README.md").write_text(old_card+disclaimer,encoding="utf8")
  ops=[CommitOperationAdd(path_in_repo=TARGET,path_or_fileobj=str(output)),
    CommitOperationAdd(path_in_repo="catalog/v1.json",path_or_fileobj=str(root/"catalog.json")),
    CommitOperationAdd(path_in_repo="demo/metadata.jsonl",path_or_fileobj=str(root/"metadata.jsonl")),
    CommitOperationAdd(path_in_repo="README.md",path_or_fileobj=str(root/"README.md"))]
  commit=api.create_commit(repo_id=REPO,repo_type="dataset",operations=ops,parent_commit=info.sha,
    commit_message="dataset: add public-domain-marked adult sleep-posture pilot (not verified actual sleep)")
  after=api.repo_info(repo_id=REPO,repo_type="dataset")
  print("SLEEP_POSTURE_PUBLISHED_SHA="+after.sha)
  print("SLEEP_POSTURE_SHA256="+digest)
  print("SLEEP_POSTURE_COMMIT="+str(getattr(commit,"commit_url","")))

#!/usr/bin/env python3
"""Publish licensed, visually reviewed LANDLINE phone call only as exploratory human-action pilot."""
import os,sys,json,hashlib,subprocess,tempfile,urllib.request
from pathlib import Path
from huggingface_hub import HfApi,hf_hub_download,CommitOperationAdd
REPO="multimodal-vision-ai/mvai-daily-action-demo"
ID="real_landline_call_005";TARGET="demo/videos/real_landline_call_005.mp4"
ORIGIN="https://commons.wikimedia.org/wiki/Special:Redirect/file/Takkarist_McKinley_Draft_Room_Phone_Call.webm"
PAGE="https://commons.wikimedia.org/wiki/File:Takkarist_McKinley_Draft_Room_Phone_Call.webm"
TOKEN=os.environ.get("HF_TOKEN")
if not TOKEN:sys.exit("HF_TOKEN missing; no changes made")
api=HfApi(token=TOKEN);info=api.repo_info(repo_id=REPO,repo_type="dataset")
if info.private:sys.exit("Expected public dataset")
files={x.rfilename for x in info.siblings}
if TARGET in files:
 print("LANDLINE_ALREADY_PRESENT_SHA="+info.sha);sys.exit(0)
catalog=json.loads(Path(hf_hub_download(repo_id=REPO,filename="catalog/v1.json",revision=info.sha,repo_type="dataset")).read_text())
if catalog.get("schema_version")!="1.0" or catalog.get("dataset_id")!=REPO:sys.exit("Unexpected catalog")
if any(x.get("id")==ID for x in catalog.get("items",[])):sys.exit("Partial ID exists: refusing mutation")
metadata=Path(hf_hub_download(repo_id=REPO,filename="demo/metadata.jsonl",revision=info.sha,repo_type="dataset")).read_text("utf8")
card=Path(hf_hub_download(repo_id=REPO,filename="README.md",revision=info.sha,repo_type="dataset")).read_text("utf8")
with tempfile.TemporaryDirectory() as td:
 root=Path(td);original=root/"original.webm"
 request=urllib.request.Request(ORIGIN,headers={"User-Agent":"MVAI-Learning-Center-Research-Video-Source-Audit/1.0"})
 with urllib.request.urlopen(request,timeout=110) as source,original.open("wb") as dest:
  while True:
   chunk=source.read(524288)
   if not chunk:break
   dest.write(chunk)
   if dest.tell()>24000000:sys.exit("Unexpectedly large source; abort")
 if original.stat().st_size<1000000:sys.exit("Unexpected tiny video; abort")
 clip=root/"real_landline_call_005.mp4"
 subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss","1","-i",str(original),"-t","8",
  "-vf","fps=5,scale=480:-2","-an","-c:v","libx264","-pix_fmt","yuv420p",
  "-movflags","+faststart",str(clip)],check=True,timeout=100)
 digest=hashlib.sha256(clip.read_bytes()).hexdigest()
 row={"id":ID,"relative_file":TARGET,"standard_action_id":"phone_call",
   "label_zh":"打电话（有线电话）","label_en":"talking on phone",
   "source_url":PAGE,"license":"CC BY 3.0","license_url":"https://creativecommons.org/licenses/by/3.0/",
   "attribution":"Atlanta Falcons","redistribution_approved":True,"portrait_release_verified":False,
   "synthetic":False,"status":"approved_demo","verified_label":False,
   "evaluation_tier":"pilot_reference_not_benchmark","reference_evidence":"visual_reviewed_contact_sheet",
   "start_s":0,"end_s":8,"source_start_s":1,"source_end_s":9,"sha256":digest,
   "notice":"Clearly visible corded landline call; NOT an instance of Kinetics talking on cell phone; exploratory demo only."}
 meta={"file_name":"videos/"+ID+".mp4","sample_id":ID,"standard_action_id":"phone_call",
  "label_zh":row["label_zh"],"label_en":row["label_en"],"source_url":PAGE,
  "license":row["license"],"license_url":row["license_url"],"author":row["attribution"],
  "attribution":row["attribution"],"redistribution_approved":True,"portrait_release_verified":False,
  "verified_label":False,"reference_evidence":row["reference_evidence"],"evaluation_tier":row["evaluation_tier"],
  "duration_s":8,"source_start_s":1,"source_end_s":9,
  "transform":"Excerpt 1-9 seconds, video resized to 480px H264 at 5fps, audio removed",
  "sha256":digest}
 catalog["items"].append(row)
 (root/"catalog.json").write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+"\n","utf8")
 (root/"metadata.jsonl").write_text(metadata.rstrip()+"\n"+json.dumps(meta,ensure_ascii=False)+"\n","utf8")
 extra="\n## Third-party landline phone-call pilot (CC BY 3.0)\n\n" \
  "Sample real_landline_call_005 comes from [Takkarist McKinley Draft Room Phone Call](https://commons.wikimedia.org/wiki/File:Takkarist_McKinley_Draft_Room_Phone_Call.webm), " \
  "copyright Atlanta Falcons, licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). " \
  "Adaptation: excerpt original seconds 1-9, 480px H264 5fps, audio removed. " \
  "**This is a corded landline phone call, NOT talking on a cell phone.** " \
  "It is categorized as a general phone_call demonstration. There is no matching exact native Kinetics-600 cell-phone label ground truth. " \
  "No independent participant portrait releases documented. Exploratory Top-K only; not benchmark accuracy.\n"
 (root/"README.md").write_text(card+extra,"utf8")
 operations=[
  CommitOperationAdd(path_in_repo=TARGET,path_or_fileobj=str(clip)),
  CommitOperationAdd(path_in_repo="catalog/v1.json",path_or_fileobj=str(root/"catalog.json")),
  CommitOperationAdd(path_in_repo="demo/metadata.jsonl",path_or_fileobj=str(root/"metadata.jsonl")),
  CommitOperationAdd(path_in_repo="README.md",path_or_fileobj=str(root/"README.md"))]
 result=api.create_commit(repo_id=REPO,repo_type="dataset",operations=operations,parent_commit=info.sha,
     commit_message="dataset: add attributed real corded phone call pilot (non-benchmark)")
 after=api.repo_info(repo_id=REPO,repo_type="dataset")
 print("LANDLINE_PHONE_PUBLISHED_SHA="+after.sha)
 print("LANDLINE_PHONE_SHA256="+digest)
 print("LANDLINE_PHONE_COMMIT="+str(getattr(result,"commit_url","")))

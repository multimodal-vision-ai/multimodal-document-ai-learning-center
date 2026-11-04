#!/usr/bin/env python3
"""V1.0.3 real-person pilot clips: source-attributed, rights-gated, not a benchmark.
Only executed on the isolated development branch with GitHub Actions HF_TOKEN.
No video is uploaded without its corresponding metadata and source attribution.
"""
import hashlib, json, os, subprocess, sys, tempfile, urllib.request
from pathlib import Path

from huggingface_hub import HfApi, hf_hub_download, CommitOperationAdd

REPO="multimodal-vision-ai/mvai-daily-action-demo"
ROOT=Path("hf-real-pilot-staging")
MODEL_REFERENCE="source-level descriptive reference; not a validated benchmark annotation"
SOURCES=[
 dict(id="real_waving_hand_001", filename="real_waving_hand_001.mp4",
      origin="https://commons.wikimedia.org/wiki/Special:Redirect/file/HandWaveExample.webm",
      source_url="https://commons.wikimedia.org/wiki/File:HandWaveExample.webm",
      label_en="waving hand", label_zh="挥手", author="NMu11er",
      license="CC BY-SA 4.0", license_url="https://creativecommons.org/licenses/by-sa/4.0/",
      license_evidence_url="https://commons.wikimedia.org/wiki/File:HandWaveExample.webm",
      source_description="A group of young men waving at you",
      source_type="webm", source_sha1="39dd25d9f15a1fe391106dd569eac8d86e5ad91b"),
 dict(id="real_jumping_jacks_002", filename="real_jumping_jacks_002.mp4",
      origin="https://raw.githubusercontent.com/tensorflow/models/f8af2291cced43fc9f1d9b41ddbf772ae7b0d7d2/official/projects/movinet/files/jumpingjack.gif",
      source_url="https://www.tensorflow.org/hub/tutorials/movinet",
      label_en="jumping jacks", label_zh="开合跳", author="Coach Bobby Bluford",
      license="CC BY (as stated by TensorFlow tutorial)",license_url="https://creativecommons.org/licenses/by/4.0/",
      license_evidence_url="https://www.tensorflow.org/hub/tutorials/movinet",
      source_description="Jumping jacks being performed",source_type="gif", source_sha1=None)
]
HEADERS={"User-Agent":"MVAI-Learning-Center-V103-Research/1.0 (open licensed educational demo)"}
def get(url,target,maxbytes=20000000):
    request=urllib.request.Request(url,headers=HEADERS)
    with urllib.request.urlopen(request,timeout=80) as response, target.open("wb") as out:
        total=0
        while True:
            data=response.read(256*1024)
            if not data:break
            total+=len(data)
            if total>maxbytes:raise RuntimeError("download size guard")
            out.write(data)
    if target.stat().st_size<1000:raise RuntimeError("invalid tiny media from "+url)

def ffprobe(path):
    result=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration:stream=codec_name,width,height",
       "-select_streams","v:0","-of","json",str(path)],capture_output=True,text=True,check=True,timeout=30)
    info=json.loads(result.stdout)
    stream=info["streams"][0]
    if stream.get("codec_name")!="h264":raise RuntimeError("non-h264 output")
    duration=float(info["format"]["duration"])
    if not (0.5<=duration<=10):raise RuntimeError("unexpected demo duration "+str(duration))
    return round(duration,3),stream["width"],stream["height"]

def prepare():
    (ROOT/"demo/videos").mkdir(parents=True,exist_ok=True)
    processed=[]
    with tempfile.TemporaryDirectory() as tmp:
        for src in SOURCES:
            original=Path(tmp)/("source."+src["source_type"])
            get(src["origin"],original)
            original_sha1=hashlib.sha1(original.read_bytes()).hexdigest()
            if src["source_sha1"] and src["source_sha1"]!=original_sha1:
                raise RuntimeError("Commons original SHA1 changed: "+src["id"]+" "+original_sha1)
            output=ROOT/"demo/videos"/src["filename"]
            args=["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(original),
                  "-vf","fps=5,scale=480:-2:flags=bicubic","-t","8","-an",
                  "-c:v","libx264","-preset","veryfast","-crf","25",
                  "-pix_fmt","yuv420p","-movflags","+faststart",str(output)]
            subprocess.run(args,check=True,timeout=120)
            duration,width,height=ffprobe(output)
            if output.stat().st_size>4000000:raise RuntimeError("pilot file too big")
            processed.append({**src,"duration":duration,"width":width,"height":height,
                "sha256":hashlib.sha256(output.read_bytes()).hexdigest(),
                "original_sha1":original_sha1,"bytes":output.stat().st_size})
            print("VERIFIED_REAL_CLIP",json.dumps({k:v for k,v in processed[-1].items() if k in ("id","sha256","duration","bytes","original_sha1")}))
    return processed

def metadata(src):
    return {
      "file_name":"videos/"+src["filename"],"sample_id":src["id"],
      "label_zh":src["label_zh"],"label_en":src["label_en"],
      "source_url":src["source_url"],"license":src["license"],
      "license_url":src["license_url"],"license_evidence_url":src["license_evidence_url"],
      "attribution":src["author"]+"; "+src["source_url"],
      "duration_s":src["duration"],"verified_label":False,
      "reference_evidence":"source_description",
      "evaluation_tier":"pilot_reference_not_benchmark",
      "redistribution_approved":True,
      "rights_review":"Commons uploader CC BY-SA / Google TensorFlow explicit CC BY; independent portrait-release not established",
      "portrait_release_verified":False,
      "transform":"Transcoded and resized to H.264 480px, 5 fps; audio removed, max 8 seconds",
      "sha256":src["sha256"],"original_sha1":src["original_sha1"],
      "synthetic":False
    }
def catalog_item(src):
    return {
      "id":src["id"],"relative_file":"demo/videos/"+src["filename"],
      "label_zh":src["label_zh"],"label_en":src["label_en"],
      "source_url":src["source_url"],"license":src["license"],"license_url":src["license_url"],
      "license_evidence_url":src["license_evidence_url"],
      "attribution":src["author"],"redistribution_approved":True,
      "status":"approved_demo","synthetic":False,"reference_evidence":"source_description",
      "evaluation_tier":"pilot_reference_not_benchmark",
      "portrait_release_verified":False,"start_s":0,"end_s":src["duration"],
      "sha256":src["sha256"],"duration_s":src["duration"],
      "notice":"Uncalibrated Top-K exploratory comparison only; not reviewed accuracy data"
    }
def upload(processed):
    token=os.getenv("HF_TOKEN")
    if not token:raise RuntimeError("HF_TOKEN secret missing; generated files not published")
    api=HfApi(token=token)
    info=api.repo_info(repo_id=REPO,repo_type="dataset")
    if info.private:raise RuntimeError("Expected public HF Dataset")
    existing={entry.rfilename for entry in info.siblings}
    for path in ("catalog/v1.json","demo/metadata.jsonl","demo/videos/synthetic_wave_001.mp4"):
        if path not in existing:raise RuntimeError("Unexpected existing Dataset layout; stop")
    ids={p["id"] for p in processed}
    old_catalog=Path(hf_hub_download(REPO,"catalog/v1.json",repo_type="dataset",revision=info.sha))
    old_metadata=Path(hf_hub_download(REPO,"demo/metadata.jsonl",repo_type="dataset",revision=info.sha))
    catalog=json.loads(old_catalog.read_text(encoding="utf8"))
    if catalog.get("schema_version")!="1.0" or catalog.get("dataset_id")!=REPO:
        raise RuntimeError("Catalog schema mismatch")
    existing_ids={item["id"] for item in catalog["items"]}
    if ids&existing_ids:
        if ids<=existing_ids and all("demo/videos/"+p["filename"] in existing for p in processed):
            print("REAL_PILOT_ALREADY_PRESENT_SHA="+info.sha)
            return
        raise RuntimeError("Partial pilot preexists; refusing mutation")
    known={row["sample_id"] for row in (json.loads(l) for l in old_metadata.read_text(encoding="utf8").splitlines() if l.strip())}
    if ids&known:raise RuntimeError("Metadata conflicting sample IDs")
    catalog["items"].extend(catalog_item(p) for p in processed)
    new_meta=old_metadata.read_text(encoding="utf8").rstrip()+"\n"
    new_meta+="\n".join(json.dumps(metadata(p),ensure_ascii=False) for p in processed)+"\n"
    (ROOT/"catalog").mkdir(exist_ok=True)
    (ROOT/"catalog/v1.json").write_text(json.dumps(catalog,indent=2,ensure_ascii=False)+"\n",encoding="utf8")
    (ROOT/"demo/metadata.jsonl").write_text(new_meta,encoding="utf8")
    card="""---
language: [en, zh]
pretty_name: MVAI Daily Action Demo - Pilot Clips
task_categories: [video-classification]
tags: [video, action-recognition, educational-pilot]
---
# MVAI Daily Action Demo - Public Pilot (NOT a benchmark)
This mixed-license Dataset contains synthetic engineering footage and real licensed
human-action videos used to **demonstrate playback and exploratory per-clip Top-5**.
It does not establish model accuracy for phone use, eating, sleeping or falling.

## Original synthetic demo
- \`synthetic_wave_001\`: procedural stick figure, CC0 1.0 (MVAI).
## Real-person pilot examples
- \`real_waving_hand_001\`: "HandWaveExample.webm", author NMu11er,
  Creative Commons Attribution-ShareAlike 4.0 International.
  Source: https://commons.wikimedia.org/wiki/File:HandWaveExample.webm
- \`real_jumping_jacks_002\`: Coach Bobby Bluford, original image sequence
  from the official Google TensorFlow MoViNet tutorial, attributed CC BY.
  Source: https://www.tensorflow.org/hub/tutorials/movinet
  Original: https://github.com/tensorflow/models/blob/f8af2291cced43fc9f1d9b41ddbf772ae7b0d7d2/official/projects/movinet/files/jumpingjack.gif

Both real items are **adapted** for web playback (H.264 conversion, resize,
5 fps, audio removed); do not remove author attribution or corresponding
original license requirements. Source-video and adapted-video hashes are in metadata.
Licenses apply **per-file**: the original synthetic video's CC0 license must not be
applied to third-party footage. We have not independently established separate
portrait/model releases for all persons depicted.

Reference labels come from publishers' video descriptions and are suitable for
**exploratory Top-1/Top-5 ranking**, not a reviewed ground-truth benchmark.
\`verified_label=false\` and \`evaluation_tier=pilot_reference_not_benchmark\`
must not be treated as confirmed human annotations or aggregated accuracy.
"""
    (ROOT/"README.md").write_text(card,encoding="utf8")
    operations=[
      CommitOperationAdd(path_in_repo="README.md",path_or_fileobj=str(ROOT/"README.md")),
      CommitOperationAdd(path_in_repo="catalog/v1.json",path_or_fileobj=str(ROOT/"catalog/v1.json")),
      CommitOperationAdd(path_in_repo="demo/metadata.jsonl",path_or_fileobj=str(ROOT/"demo/metadata.jsonl"))
    ]
    for src in processed:
        p="demo/videos/"+src["filename"]
        if p in existing:raise RuntimeError("Refusing to overwrite existing video "+p)
        operations.append(CommitOperationAdd(path_in_repo=p,path_or_fileobj=str(ROOT/p)))
    commit=api.create_commit(repo_id=REPO,repo_type="dataset",
      operations=operations,parent_commit=info.sha,
      commit_message="dataset: add attributed real-person pilot actions (not benchmark)")
    new_info=api.repo_info(repo_id=REPO,repo_type="dataset")
    print("REAL_PILOT_PUBLISHED_SHA="+new_info.sha)
    print("REAL_PILOT_COMMIT="+str(getattr(commit,"commit_url","")))
    print("REAL_PILOT_IDS="+",".join(sorted(ids)))
if __name__=="__main__":
    try:
        clips=prepare()
        if os.getenv("MVAI_DRY_RUN")=="1":
            print("DRY_RUN_OK",len(clips))
        else:upload(clips)
    except Exception as e:
        print("PILOT_UPLOAD_BLOCKED",type(e).__name__,str(e),file=sys.stderr)
        sys.exit(1)

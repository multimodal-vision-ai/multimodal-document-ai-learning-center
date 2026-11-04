#!/usr/bin/env python3
"""Publish verified Google Model Garden MoViNet A1/A2 float32 TFLite binaries.
Only to the dedicated MVAI public model repo; never touches GitHub dev/main.
"""
import hashlib,json,os,sys,tempfile,urllib.request
from pathlib import Path
from huggingface_hub import HfApi,CommitOperationAdd
REPO="multimodal-vision-ai/mvai-video-action-compare-models"
OFFICIAL={
 "a1":{"file":"movinet_a1_stream.tflite","size":44470672,"sha256":"14986eb3380635b9b86c1a32cb87d1fde7dfd134153c68cef69eb3bce34f8810","top1":76.45,"resolution":172},
 "a2":{"file":"movinet_a2_stream.tflite","size":52326436,"sha256":"f0bc1fd78b4546a3d6b1fd2ad4b89e9658ad86a2c1a7020efedb3a10205bc707","top1":78.40,"resolution":224}
}
TOKEN=os.environ.get("HF_TOKEN")
if not TOKEN:sys.exit("HF_TOKEN missing")
api=HfApi(token=TOKEN)
with tempfile.TemporaryDirectory() as td:
 root=Path(td)
 operations=[]
 for variant,item in OFFICIAL.items():
    url="https://storage.googleapis.com/tf_model_garden/vision/movinet/"+item["file"]
    out=root/item["file"]
    req=urllib.request.Request(url,headers={"User-Agent":"MVAI-Research-Learning-Center-Google-Official-Model-Verification/1.0"})
    with urllib.request.urlopen(req,timeout=120) as response,out.open("wb") as handle:
       while True:
         chunk=response.read(1024*1024)
         if not chunk:break
         handle.write(chunk)
         if handle.tell()>65000000:raise RuntimeError("Model too large")
    data=out.read_bytes()
    digest=hashlib.sha256(data).hexdigest()
    if len(data)!=item["size"] or digest!=item["sha256"] or data[4:8]!=b"TFL3":
       raise RuntimeError("Upstream model does not match verified checksum "+variant)
    item["source_url"]=url
    print("VERIFIED_MODEL",variant,len(data),digest,flush=True)
    operations.append(CommitOperationAdd(path_in_repo=item["file"],path_or_fileobj=str(out)))
 manifest={"schema_version":"1.0","source":"TensorFlow Model Garden official preconverted float32 MoViNet streaming TFLite","runtime":"LiteRT.js@2.5.3 CPU/WASM","models":OFFICIAL}
 (root/"model-manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
 card="""---
license: apache-2.0
pipeline_tag: video-classification
tags: [video, streaming, movinet, litert, kinetics-600, education]
---
# Official MoViNet-A1 and A2 TFLite (Float32), mirrored for MVAI research

Original project: https://github.com/tensorflow/models/tree/master/official/projects/movinet

Original files:
- https://storage.googleapis.com/tf_model_garden/vision/movinet/movinet_a1_stream.tflite
- https://storage.googleapis.com/tf_model_garden/vision/movinet/movinet_a2_stream.tflite

These are **unmodified** official TensorFlow Model Garden float32 TFLite binaries,
mirrored for browser CORS compatibility. SHA256 checksums and expected bytes are
recorded in model-manifest.json. TensorFlow Model Garden uses the Apache 2.0 license;
see the official repository for the license and model documentation.

Official Kinetics-600 Stream evaluation: A1 Top-1 76.45% and A2 Top-1 78.40%;
these are published benchmark results, **not** MVAI sample accuracy, and cannot
be directly compared to a differently quantized or sampling-trained model
without a consistent validation protocol.

A1 shape: [1,1,172,172,3], 68 inputs and 68 outputs.
A2 shape: [1,1,224,224,3], 74 inputs and 74 outputs.
Both contain named Float32 and Int32 streaming states and [1,600] logits.
The browser only performs video-level action classification, not actor-specific
spatio-temporal action detection.

A separate, clearly attributed MediaPipe person detector in the MVAI UI
provides visual boxes. This does not make the action label actor-specific.
"""
 (root/"README.md").write_text(card,encoding="utf8")
 operations.append(CommitOperationAdd(path_in_repo="model-manifest.json",path_or_fileobj=str(root/"model-manifest.json")))
 operations.append(CommitOperationAdd(path_in_repo="README.md",path_or_fileobj=str(root/"README.md")))
 api.create_repo(repo_id=REPO,repo_type="model",private=False,exist_ok=True)
 before=api.repo_info(repo_id=REPO,repo_type="model")
 if before.private:raise RuntimeError("Unexpected private model repository")
 existing={s.rfilename for s in before.siblings}
 if all(item["file"] in existing for item in OFFICIAL.values()) and "model-manifest.json" in existing:
    print("MODEL_MIRROR_ALREADY_PRESENT_SHA="+before.sha)
    sys.exit(0)
 if any(item["file"] in existing for item in OFFICIAL.values()):
    raise RuntimeError("Partially published weights, do not overwrite without further inspection")
 result=api.create_commit(repo_id=REPO,repo_type="model",operations=operations,parent_commit=before.sha,
                        commit_message="models: mirror SHA-verified Google MoViNet-A1/A2 float32 for browser-only MVAI comparison")
 after=api.repo_info(repo_id=REPO,repo_type="model")
 print("MODEL_MIRROR_PUBLISHED_SHA="+after.sha)
 print("MODEL_MIRROR_COMMIT="+str(getattr(result,"commit_url","")))

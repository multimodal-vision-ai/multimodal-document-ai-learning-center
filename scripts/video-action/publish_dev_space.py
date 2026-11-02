#!/usr/bin/env python3
"""Publish an isolated, browser-only DEV preview to a NEW Hugging Face static Space.
Does not touch the existing DocTags Space, GitHub Pages, dev, or main.
No inference service, model weights, HF credentials or raw user videos are copied.
"""
import json
import os
import sys
import time
import urllib.request
from pathlib import Path
from huggingface_hub import HfApi, CommitOperationAdd

REPO="multimodal-vision-ai/mvai-video-action-v103-dev"
ROOT=Path("docs/assets/projects/video-action/browser-inference")
HOST="https://multimodal-vision-ai-mvai-video-action-v103-dev.static.hf.space/"
TOKEN=os.environ.get("HF_TOKEN")
if not TOKEN: sys.exit("HF_TOKEN is absent; preview not deployed")
FRONTEND_FILES=("index.html","app.js","semantic.js","person-overlay.js",
                "official-movinet.js","video-mae.js","mobileclip.js",
                "continuous-movinet.js","config.json")
for file in FRONTEND_FILES:
    if not (ROOT/file).is_file():sys.exit("Missing frontend file: "+file)
# Guard against silently omitting any future local ES module import.
import re
for source in ("app.js","mobileclip.js","official-movinet.js","video-mae.js","continuous-movinet.js","semantic.js","person-overlay.js"):
    content=(ROOT/source).read_text(encoding="utf8")
    local_imports=re.findall(r"""(?:from\s*|import\s*\(|import\s*)['"]\./([^'"]+)['"]""",content)
    for imported in local_imports:
        if imported not in FRONTEND_FILES:
            sys.exit("Local module referenced but not included in Space: "+source+" -> "+imported)
config=json.loads((ROOT/"config.json").read_text(encoding="utf8"))
if config["dataset_id"]!="multimodal-vision-ai/mvai-daily-action-demo":
    sys.exit("Unrecognized dataset ID")
if not (isinstance(config.get("dataset_revision"),str) and len(config["dataset_revision"])==40):
    sys.exit("Dataset revision is not pinned")
api=HfApi(token=TOKEN)
try:
    api.create_repo(repo_id=REPO,repo_type="space",space_sdk="static",private=False,exist_ok=True)
except Exception as error:
    sys.exit("Space creation failed: "+type(error).__name__+": "+str(error)[:250])
info=api.repo_info(repo_id=REPO,repo_type="space")
if info.private:sys.exit("Isolated DEV Space unexpectedly private")
card=f"""---
title: MVAI Video Action V1.0.5 DEV
emoji: 🎬
colorFrom: blue
colorTo: indigo
sdk: static
app_file: index.html
pinned: false
---
# MVAI Video Action V1.0.5 — ISOLATED DEV PREVIEW

**NOT OFFICIAL. DO NOT REFERENCE AS RELEASED.**

A static browser-only implementation of the MVAI video action recognition
research prototype from isolated GitHub PR #63.
Source: https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/pull/63

The browser independently downloads public MoViNet weights, and approved
demonstration videos from a version-pinned Hugging Face Dataset. This Space
does not run server inference and does not receive uploaded local videos.

GitHub revision: `{os.getenv("GITHUB_SHA","unknown")}`
HF Dataset revision: `{config["dataset_revision"]}`
"""
operations=[CommitOperationAdd(path_in_repo="README.md",path_or_fileobj=__import__("io").BytesIO(card.encode("utf8")))]
for name in FRONTEND_FILES:
    operations.append(CommitOperationAdd(path_in_repo=name,path_or_fileobj=str(ROOT/name)))
commit=api.create_commit(repo_id=REPO,repo_type="space",operations=operations,
    commit_message="dev: update isolated browser-only action demo from PR #63")
post=api.repo_info(repo_id=REPO,repo_type="space")
print("DEV_SPACE_PAGE=https://huggingface.co/spaces/"+REPO)
print("DEV_SPACE_STATIC="+HOST)
print("DEV_SPACE_SHA="+post.sha)
print("DEV_DATASET_SHA="+config["dataset_revision"])
# Response validation: report failures rather than claiming accessibility.
for i in range(12):
    try:
        with urllib.request.urlopen(urllib.request.Request(HOST,headers={"User-Agent":"MVAI-DEV-Preview-Verification/1.0"}),timeout=15) as response:
            data=response.read(100000).decode("utf-8","replace")
            if response.status==200 and "视频行为识别与分析" in data:
                # The HTML can return 200 even when an imported module was omitted.
                # Verify the exact local modules the page will actually load.
                for module in ("app.js","mobileclip.js","semantic.js","person-overlay.js",
                               "official-movinet.js","video-mae.js","config.json"):
                    with urllib.request.urlopen(
                        urllib.request.Request(HOST+module,headers={"User-Agent":"MVAI-DEV-Preview-Verification/1.0"}),
                        timeout=18) as module_response:
                        data_bytes=module_response.read(4000)
                        if module_response.status!=200 or len(data_bytes)<10:
                            raise RuntimeError("DEV module missing: "+module)
                print("DEV_SPACE_HTTP_VERIFIED=200")
                print("DEV_MODULES_HTTP_VERIFIED=8")
                break
    except Exception as e:
        if i==11:raise RuntimeError("DEV preview not accessible after static Space update: "+type(e).__name__) from e
    time.sleep(5)
else:raise RuntimeError("DEV Space HTTP 200 returned unexpected content")

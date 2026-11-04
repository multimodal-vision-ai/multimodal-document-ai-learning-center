#!/usr/bin/env python3
"""Guarded publishing of first original synthetic engineering clip to existing HF Org Dataset."""
import os,sys
from pathlib import Path
from huggingface_hub import HfApi
repo="multimodal-vision-ai/mvai-daily-action-demo"
token=os.getenv("HF_TOKEN")
if not token:
    sys.exit("BLOCKED: HF_TOKEN GitHub Actions secret not configured; no changes made")
api=HfApi(token=token)
try: info=api.repo_info(repo_id=repo,repo_type="dataset",files_metadata=False)
except Exception as e: sys.exit("BLOCKED: Dataset inaccessible for the configured token: "+type(e).__name__)
if info.private: sys.exit("BLOCKED: HF Dataset is private, not the agreed public demo")
existing={f.rfilename for f in info.siblings}
if any(name in existing for name in ["demo/videos/synthetic_wave_001.mp4","catalog/v1.json","demo/metadata.jsonl"]):
    print("SKIPPED: dataset already contains demo assets; protect existing HF data; repository_sha="+info.sha)
    sys.exit(0)
root=Path("hf-dataset-staging")
for p in ["README.md","demo/metadata.jsonl","demo/videos/synthetic_wave_001.mp4","catalog/v1.json","schemas/action_labels.json"]:
    if not (root/p).is_file():sys.exit("BLOCKED: missing staged asset "+p)
result=api.upload_folder(repo_id=repo,repo_type="dataset",folder_path=str(root),
 commit_message="dataset: bootstrap original synthetic action demo with verified source")
post=api.repo_info(repo_id=repo,repo_type="dataset")
print("DATASET_PUBLISHED_REPO_SHA="+post.sha)
print("DATASET_COMMIT_URL="+str(getattr(result,"commit_url","")))

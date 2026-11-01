#!/usr/bin/env python3
"""Build one original, non-person, explicitly synthetic video for HF pipeline validation."""
import hashlib, json, math, os, subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw

root=Path(os.environ.get("MVAI_HF_STAGING","hf-dataset-staging"))
(root/"demo/videos").mkdir(parents=True,exist_ok=True)
(root/"catalog").mkdir(exist_ok=True)
(root/"schemas").mkdir(exist_ok=True)
with tempfile.TemporaryDirectory() as temp:
    for i in range(24):
        im=Image.new("RGB",(360,240),"#f5f8ff")
        d=ImageDraw.Draw(im)
        d.line((20,215,340,215),fill="#c2cee0",width=2)
        d.ellipse((157,42,202,87),fill="#fff3d5",outline="#193c66",width=4)
        d.line((179,88,179,160),fill="#193c66",width=8)
        d.line((179,155,150,203),fill="#193c66",width=7)
        d.line((179,155,208,203),fill="#193c66",width=7)
        d.line((179,104,146,141),fill="#193c66",width=7)
        phase=math.sin(i*math.pi*2/8)
        x,y=215+17*phase,56-9*phase
        d.line((179,104,200,77,x,y),fill="#193c66",width=7,joint="curve")
        d.ellipse((x-7,y-7,x+7,y+7),fill="#f7c673",outline="#193c66",width=2)
        d.text((18,12),"SYNTHETIC ACTION DEMO",fill="#4b6589")
        d.text((18,29),"WAVING HAND / NON-HUMAN",fill="#4b6589")
        im.save(f"{temp}/frame_{i:03d}.png")
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-framerate","6",
      "-i",temp+"/frame_%03d.png","-c:v","libx264","-pix_fmt","yuv420p",
      "-movflags","+faststart",str(root/"demo/videos/synthetic_wave_001.mp4")],check=True)
video=root/"demo/videos/synthetic_wave_001.mp4"
sha=hashlib.sha256(video.read_bytes()).hexdigest()
source="https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/blob/feat/video-action-v103/scripts/video-action/generate_demo.py"
metadata={"file_name":"videos/synthetic_wave_001.mp4","sample_id":"synthetic_wave_001","label_zh":"挥手",
  "label_en":"waving hand","source_url":source,"license":"CC0-1.0",
  "license_url":"https://creativecommons.org/publicdomain/zero/1.0/",
  "attribution":"MVAI Learning Center · original procedural animation (no real person)",
  "duration_s":4.0,"verified_label":True,"redistribution_approved":True,"synthetic":True,"sha256":sha}
(root/"demo/metadata.jsonl").write_text(json.dumps(metadata,ensure_ascii=False)+"\n",encoding="utf8")
item={"id":"synthetic_wave_001","relative_file":"demo/videos/synthetic_wave_001.mp4",
 "label_en":"waving hand","label_zh":"挥手","evidence":"synthetic_controlled",
 "source_url":source,"license":"CC0-1.0","license_url":metadata["license_url"],
 "attribution":metadata["attribution"],"synthetic":True,"redistribution_approved":True,
 "start_s":0,"end_s":4,"status":"approved_demo","sha256":sha}
(root/"catalog/v1.json").write_text(json.dumps({"schema_version":"1.0",
 "dataset_id":"multimodal-vision-ai/mvai-daily-action-demo","items":[item]},indent=2,ensure_ascii=False)+"\n",encoding="utf8")
(root/"schemas/action_labels.json").write_text(json.dumps({"schema_version":"1.0","labels":[
 {"id":"waving_hand","label_en":"waving hand","label_zh":"挥手",
  "kinetics_600_label":"waving hand"}]},indent=2,ensure_ascii=False)+"\n",encoding="utf8")
(root/"README.md").write_text("""---
license: cc0-1.0
language:
- en
- zh
pretty_name: MVAI Daily Action Demo (Engineering Pilot)
task_categories:
- video-classification
tags:
- video
- action-recognition
- synthetic-engineering-test
---
# MVAI Daily Action Demo · engineering pilot

This dataset manages video examples and reference labels for the MVAI Learning Center.
The initial example is an **original procedurally generated stick-figure animation**,
**not real-person footage** and **not an accuracy benchmark**.

- First video: `demo/videos/synthetic_wave_001.mp4`; 4 s, H.264, 360×240, 6 fps.
- Controlled reference label: `waving hand` / 挥手.
- Metadata: `demo/metadata.jsonl` with relative `file_name`.
- Browser catalog: `catalog/v1.json` (schema 1.0), and original generation script:
  https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/blob/feat/video-action-v103/scripts/video-action/generate_demo.py

The generated animation is offered under CC0-1.0; no third-party audio/video/person
depictions were incorporated. Results from this artificial example do not establish
accuracy on real daily activities or Kinetics-600.

Real-person videos require separate verification of redistribution rights,
attribution, original label evidence, privacy/portrait permission and recorded hashes.
Pin the HF repository revision in the GitHub frontend config after approved uploads.
""",encoding="utf8")
print(json.dumps({"video_bytes":video.stat().st_size,"video_sha256":sha,"samples":1}))

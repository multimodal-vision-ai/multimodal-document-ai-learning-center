#!/usr/bin/env python3
"""Validate the staged E03 V2.0 notebook, page, videos and student ZIP."""
import ast,json
from pathlib import Path
from zipfile import ZipFile
ROOT=Path(__file__).resolve().parents[3]
BASE=ROOT/"docs/resources/course-labs/intelligent-perception"
nbpath=BASE/"downloads/E03_Advanced_Lane_Finding_V2.0.ipynb"
zip_path=BASE/"downloads/MVAI_E03_Advanced_Lane_Finding_V2.0.zip"
nb=json.loads(nbpath.read_text(encoding="utf-8"))
assert nb["nbformat"]==4
cells=nb["cells"]
assert sum(c["cell_type"]=="code" for c in cells)>=20
for c in cells:
 if c["cell_type"]=="code":ast.parse("".join(c["source"]))
prompts=[c for c in cells if c["cell_type"]=="markdown" and "探索任务" in "".join(c["source"])]
assert len(prompts)>=18,(len(prompts),"expected 18 exploration tasks")
assert any("课后思考探索" in "".join(c["source"]) for c in cells)
html=(BASE/"e03-notebook.html").read_text(encoding="utf-8")
for rel in ["e03-media/calibration-corners.jpg","e03-media/final-single-image.jpg","e03-media/threshold-binary.png","e03-media/perspective-bird-eye.png","e03-media/sliding-window-fit.png"]:
 assert rel in html,("page missing image reference",rel)
for scene in ("straight","curve","complex"):
 for kind in ("compare","processed","original"):
  f=BASE/f"e03-media/videos/{scene}-{kind}.mp4"
  assert f.is_file() and f.stat().st_size>10000,("missing video",str(f))
assert (BASE/"e03-media/scene-complex-result.jpg").is_file()
with ZipFile(zip_path) as z:
 assert z.testzip() is None
 names=set(z.namelist())
 assert any(x.endswith("E03_Advanced_Lane_Finding_V2.0.ipynb") for x in names)
 assert sum("/camera_cal/" in x and x.endswith(".jpg") for x in names)==20
 assert sum("/test_images/" in x and x.endswith(".jpg") for x in names)>=8
 assert sum("/videos/" in x and x.endswith(".mp4") for x in names)==3
 assert any(x.endswith("e03_lane_finding.py") for x in names)
print("E03 QA PASS:",len(cells),"cells;",len(prompts),"exploration tasks; 3 source videos; page media and ZIP verified")

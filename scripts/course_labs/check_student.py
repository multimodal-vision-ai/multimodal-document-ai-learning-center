#!/usr/bin/env python3
"""Verify student-only course assets and JavaScript syntax after staging."""
import ast
import json
from pathlib import Path
import re
import subprocess
import tempfile
from zipfile import ZipFile

ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/"docs/resources/course-labs/intelligent-perception"
FILES=[
 BASE/"index.md",BASE/"e01.md",BASE/"e02.md",
 BASE/"interactive/index.html",BASE/"notebook.html",BASE/"notebook-student-v2.html",
 BASE/"e01-notebook.html",BASE/"e02-notebook.html",
 BASE/"downloads/E01_Image_Processing_V2.0.ipynb",
 BASE/"downloads/E02_Lane_Detection_V2.0.ipynb",
 BASE/"downloads/MVAI_E01_E02_Labs.zip",
 BASE/"downloads/MVAI_E01_Lab.zip",BASE/"downloads/MVAI_E02_Lab.zip",
 BASE/"downloads/solidWhiteRight_8s.mp4"
]
FILES += sorted((BASE/"images").glob("*.jpg"))
if len(FILES)!=23: raise SystemExit("Expected 9 images and 14 main files, got "+str(len(FILES)))
for path in FILES:
 if not path.is_file() or not path.stat().st_size:
  raise SystemExit("Missing / empty student asset: "+str(path))
for name in ("E01_Image_Processing_V2.0.ipynb","E02_Lane_Detection_V2.0.ipynb"):
 nb=json.loads((BASE/"downloads"/name).read_text(encoding="utf-8"))
 assert nb["nbformat"]==4 and len(nb["cells"])>=8,name
 for cell in nb["cells"]:
  if cell["cell_type"]=="code":ast.parse("".join(cell["source"]))
 plots=sum(sum("image/png" in output.get("data",{}) for output in cell.get("outputs",[])) for cell in nb["cells"] if cell["cell_type"]=="code")
 assert plots>=9,(name,"missing exploration plot figures",plots)
 prompts=sum("探索任务" in "".join(c["source"]) for c in nb["cells"] if c["cell_type"]=="markdown")
 assert prompts>=5,(name,"missing five exploration prompt Cells",prompts)
 assert sum(c["cell_type"]=="code" for c in nb["cells"])>=10,(name,"missing executable experimental Cells")
with ZipFile(BASE/"downloads/MVAI_E01_E02_Labs.zip") as z:
 names=set(z.namelist())
 assert len([x for x in names if x.startswith("images/") and x.endswith(".jpg")])==9
 assert "E01_Image_Processing_V2.0.ipynb" in names
 assert "E02_Lane_Detection_V2.0.ipynb" in names
 assert "videos/solidWhiteRight_8s.mp4" in names
for code,filename in (("E01","E01_Image_Processing_V2.0.ipynb"),("E02","E02_Lane_Detection_V2.0.ipynb")):
 with ZipFile(BASE/"downloads"/f"MVAI_{code}_Lab.zip") as archive:
  names=set(archive.namelist())
  assert filename in names,(code,"missing matching notebook")
  assert len([n for n in names if n.endswith(".ipynb")])==1,(code,"contains another notebook")
  assert len([n for n in names if n.startswith("images/") and n.endswith(".jpg")])==9
  assert ("videos/solidWhiteRight_8s.mp4" in names)==(code=="E02")
for html_path in (BASE/"interactive/index.html",BASE/"notebook.html",BASE/"notebook-student-v2.html",BASE/"e01-notebook.html",BASE/"e02-notebook.html"):
 content=html_path.read_text(encoding="utf-8")
 for marker in ("TEACHER QUICK START","教师授课安排","教师教学引导手册","教师备课参考"):
  assert marker not in content,(str(html_path),marker)
 scripts=re.findall(r"<script\b[^>]*>([\s\S]*?)</script>",content)
 if not scripts:raise SystemExit("No inline JavaScript in "+str(html_path))
 with tempfile.TemporaryDirectory() as td:
  for i,js in enumerate(scripts):
   p=Path(td)/f"inline-{i}.js"
   p.write_text(js,encoding="utf-8")
   subprocess.run(["node","--check",str(p)],check=True)
print("Student course assets OK: 5 exploration Cells per lesson, 9+ plot groups per notebook, separate E01/E02 ZIPs, independent three-mode pages")

#!/usr/bin/env python3
"""Validate isolated E03 student assets without changing E01/E02 checks."""
from pathlib import Path
import ast,json,re,subprocess,tempfile
from zipfile import ZipFile
import nbformat
ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'docs/resources/course-labs/intelligent-perception'
DOWN=BASE/'downloads'
files=[BASE/'e03-notebook.html',BASE/'e03.md',BASE/'interactive/e03.html',
       DOWN/'E03_Complex_Lane_Detection_V1.0.ipynb',DOWN/'MVAI_E03_Lab.zip',DOWN/'E03_diagnostics.json',
       *(DOWN/f'E03_{s}_compare.mp4' for s in ('straight','curve','complex'))]
for path in files:
    if not path.is_file() or path.stat().st_size<300:raise AssertionError(f'E03 asset missing/empty: {path}')
nb=nbformat.read(DOWN/'E03_Complex_Lane_Detection_V1.0.ipynb',as_version=4)
cell_sources=[''.join(c.source) for c in nb.cells]
assert len([s for s in cell_sources if s.startswith('## ') and '探索' in s])>=4
count=0
for cell in nb.cells:
    if cell.cell_type!='code':continue
    ast.parse(cell.source)
    count+=sum('image/png' in out.get('data',{}) for out in cell.outputs)
assert count>=8, 'E03 must retain genuinely executed PNG output figures'
assert any('E03_' in source and 'compare.mp4' in source for source in cell_sources)
with ZipFile(DOWN/'MVAI_E03_Lab.zip') as z:
    names=set(z.namelist())
    assert 'E03_Complex_Lane_Detection_V1.0.ipynb' in names
    assert len([n for n in names if n.startswith('images/') and n.endswith('.jpg')])==5
    assert len([n for n in names if n.startswith('videos/') and n.endswith('input.mp4')])==3
    assert len([n for n in names if n.startswith('outputs/') and n.endswith('_compare.mp4')])==3
for p in (BASE/'e03-notebook.html',BASE/'interactive/e03.html'):
    src=p.read_text(encoding='utf-8')
    script=re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',src,flags=re.S)
    assert script, 'no JavaScript in '+p.name
    for code in script:
        with tempfile.NamedTemporaryFile(mode='w',suffix='.js',encoding='utf-8') as tmp:
            tmp.write(code);tmp.flush()
            subprocess.run(['node','--check',tmp.name],check=True)
data=json.loads((DOWN/'E03_diagnostics.json').read_text(encoding='utf-8'))
for scene in ('straight','curve','complex'):
    assert len(data[scene])>=50
    assert all('status' in v and 'valid' in v for v in data[scene])
print(f'E03 student assets OK: 4 experiments, {count} real PNG outputs, 3 scene videos, independent ZIP')
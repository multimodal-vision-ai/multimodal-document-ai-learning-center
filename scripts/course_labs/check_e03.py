#!/usr/bin/env python3
"""Validate isolated E03 student assets without changing E01/E02 checks."""
from pathlib import Path
import ast,json,re,subprocess,tempfile,base64
from zipfile import ZipFile
import nbformat
ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'docs/resources/course-labs/intelligent-perception'
DOWN=BASE/'downloads'
files=[BASE/'e03-notebook.html',BASE/'e03.md',BASE/'interactive/e03.html',BASE/'interactive/e03-image-assets.js',
       DOWN/'E03_Complex_Lane_Detection_V1.0.ipynb',DOWN/'MVAI_E03_Lab.zip',DOWN/'E03_diagnostics.json',DOWN/'E03_tracks.json',
       *(DOWN/f'E03_{s}_compare.mp4' for s in ('straight','curve','complex')),
       *(DOWN/f'E03_{s}_e02.mp4' for s in ('straight','curve','complex')),
       *(BASE/'videos'/f'E03_{s}_input.webm' for s in ('straight','curve','complex')),
       *(DOWN/f'E03_{s}_e02.webm' for s in ('straight','curve','complex'))]
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
# A generated student Notebook should not contain missing Chinese glyph warnings.
for cell in nb.cells:
    if cell.cell_type!='code':continue
    for output in cell.outputs:
        raw=output.get('text','')
        if isinstance(raw,list):raw=''.join(raw)
        assert 'UserWarning: Glyph ' not in raw, 'Missing CJK font in saved Notebook output'

assert any('E03_' in source and 'compare.mp4' in source for source in cell_sources)
with ZipFile(DOWN/'MVAI_E03_Lab.zip') as z:
    names=set(z.namelist())
    assert 'E03_Complex_Lane_Detection_V1.0.ipynb' in names
    assert len([n for n in names if n.startswith('images/') and n.endswith('.jpg')])==5
    assert len([n for n in names if n.startswith('videos/') and n.endswith('input.mp4')])==3
    assert len([n for n in names if n.startswith('outputs/') and n.endswith('_compare.mp4')])==3
    assert len([n for n in names if n.startswith('outputs/') and n.endswith('_e02.mp4')])==3
    assert len([n for n in names if n.startswith('videos/') and n.endswith('input.webm')])==3
    assert len([n for n in names if n.startswith('outputs/') and n.endswith('_e02.webm')])==3
    assert 'outputs/E03_tracks.json' in names
# The interactive page must use embedded JPEG data, not cross-origin image pixels.
interactive=(BASE/'interactive/e03.html').read_text(encoding='utf-8')
assert '<script src="e03-image-assets.js"></script>' in interactive
bundle=(BASE/'interactive/e03-image-assets.js').read_text(encoding='utf-8')
match=re.fullmatch(r'window\\.E03_IMAGE_DATA = Object\\.freeze\\((.*)\\);\\s*',bundle,re.S)
assert match, 'E03 embedded image bundle has an invalid wrapper'
image_assets=json.loads(match.group(1))
expected_images={
    '01_solidWhiteRight_straight_white.jpg',
    '03_project_curve_intro.jpg',
    '07_harder_curve_motorcycle.jpg',
    '08_harder_shadow_glare.jpg',
    '09_harder_curve_shadow.jpg',
}
assert set(image_assets)==expected_images, 'E03 embedded image bundle is incomplete'
for filename,data_url in image_assets.items():
    assert data_url.startswith('data:image/jpeg;base64,'), f'Unexpected image data URL: {filename}'
    decoded=base64.b64decode(data_url.split(',',1)[1],validate=True)
    assert decoded==(BASE/'images'/filename).read_bytes(), f'Embedded image differs from staged JPEG: {filename}'
subprocess.run(['node','--check',str(BASE/'interactive/e03-image-assets.js')],check=True)
for p in (BASE/'e03-notebook.html',BASE/'interactive/e03.html'):
    src=p.read_text(encoding='utf-8')
    script=re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',src,flags=re.S)
    assert script, 'no JavaScript in '+p.name
    for code in script:
        with tempfile.NamedTemporaryFile(mode='w',suffix='.js',encoding='utf-8') as tmp:
            tmp.write(code);tmp.flush()
            subprocess.run(['node','--check',tmp.name],check=True)
data=json.loads((DOWN/'E03_diagnostics.json').read_text(encoding='utf-8'))
tracks=json.loads((DOWN/'E03_tracks.json').read_text(encoding='utf-8'))
for scene in ('straight','curve','complex'):
    assert len(data[scene])>=50
    assert all('status' in v and 'valid' in v for v in data[scene])
    record=tracks['scenes'][scene]
    assert record['fps']>0 and len(record['Minv'])==3 and len(record['frames'])==len(data[scene])
    assert any(f['valid'] and len(f['left_x'])==3 and len(f['right_x'])==3 for f in record['frames'])
print(f'E03 student assets OK: 4 experiments, {count} real PNG outputs, 3 scene videos, independent ZIP')
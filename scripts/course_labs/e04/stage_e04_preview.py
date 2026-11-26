"""Build the independent, open-source E04 application in a static site. Media must match the approved archive exactly.
Run in an isolated env: python stage_e04_preview.py OUTPUT WORK SOURCE_REF
"""
import hashlib, json, os, shutil, subprocess, sys, zipfile
from pathlib import Path
from importlib.metadata import distribution
from stage_media import stage, embed_frames
from export_raw_onnx import export, EXPECTED

HERE=Path(__file__).resolve().parent
REPO=HERE.parents[2]
COURSE=REPO/'docs/resources/course-labs/intelligent-perception'
def run(*args,cwd=None):
    subprocess.run([str(x) for x in args],cwd=cwd,check=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main(out,work,ref):
    out,work=Path(out).resolve(),Path(work).resolve()
    out.mkdir(parents=True,exist_ok=True);work.mkdir(parents=True,exist_ok=True)
    media=out/'e04-media';models=out/'e04-models';runtime=out/'e04-runtime';downloads=out/'downloads'
    for d in (models,runtime,downloads,out/'interactive',out/'source'):d.mkdir(parents=True,exist_ok=True)
    approved=HERE/'E04-material-review.zip'
    stage(approved,media)
    with zipfile.ZipFile(approved) as z:
        checks=json.loads(z.read('dist/data/file-checksums.json'))
        for name in checks:
            if name.startswith('comparisons/') and name.endswith('.jpg'):
                data=z.read('dist/'+name);p=media/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
    weights=work/'weights';weights.mkdir(exist_ok=True)
    run(sys.executable,'-c','from ultralytics import YOLO; YOLO("yolo26n.pt"); YOLO("yolo26s.pt")',cwd=weights)
    export(weights,models)
    for name in EXPECTED:
        p=weights/(name+'.pt');assert sha(p)==EXPECTED[name]
        shutil.copy2(p,models/p.name)
    npm=work/'web';npm.mkdir(exist_ok=True)
    run('npm','install','--no-audit','--no-fund','--save-exact','onnxruntime-web@1.31.1',cwd=npm)
    pkg=npm/'node_modules/onnxruntime-web'
    # Ship the exact installed dist, not cross-origin scripts. No maps/debug builds.
    for p in (pkg/'dist').iterdir():
        if p.is_file() and (p.name.startswith('ort.webgpu') or p.name.startswith('ort-wasm')) and not p.name.endswith('.map'):
            assert p.stat().st_size<95*1024*1024, p
            shutil.copy2(p,runtime/p.name)
    assert (runtime/'ort.webgpu.min.mjs').is_file()
    for p in pkg.iterdir():
        if p.is_file() and ('license' in p.name.lower() or 'notice' in p.name.lower()):
            shutil.copy2(p,runtime/p.name)
    shutil.copy2(npm/'package-lock.json',out/'source/onnxruntime-package-lock.json')
    for name in ('e04.html','e04-core.mjs','e04-lab.mjs'):
        shutil.copy2(COURSE/'interactive'/name,out/'interactive'/name)
    embed_frames(media,out/'interactive/e04.html')
    shutil.copy2(HERE/'e04-app.html',out/'index.html')
    # Teacher guide is delivered separately, never staged into the public student site.
    nb=HERE/'E04_YOLO_Object_Detection_V1.0.ipynb'
    shutil.copy2(nb,downloads/nb.name)
    # Preserve the upstream license from the installed exact version.
    dist=distribution('ultralytics')
    candidates=[dist.locate_file(p) for p in (dist.files or []) if Path(str(p)).name.lower() in ('license','license.txt','copying')]
    license_text=next((p.read_text(encoding='utf-8') for p in candidates if p.is_file() and 'GNU AFFERO GENERAL PUBLIC LICENSE' in p.read_text(encoding='utf-8')),None)
    if license_text is None:
        from urllib.request import urlopen
        license_text=urlopen('https://raw.githubusercontent.com/ultralytics/ultralytics/v8.4.219/LICENSE',timeout=30).read().decode()
    assert 'GNU AFFERO GENERAL PUBLIC LICENSE' in license_text
    (out/'LICENSE').write_text(license_text,encoding='utf-8')
    (out/'NOTICE.txt').write_text(
        'E04 standalone educational application: AGPL-3.0. Other Learning Center projects retain their own licenses.\n'
        'YOLO26n/s pretrained checkpoints and ONNX exports: Ultralytics, AGPL-3.0.\n'
        'Upstream exact source: https://github.com/ultralytics/ultralytics/tree/v8.4.219\n'
        'Original checkpoints: e04-models/yolo26n.pt and yolo26s.pt; conversion source in source/E04-source.zip.\n'
        'E04 corresponding source revision: https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/tree/'+ref+'\n'
        'ONNX Runtime Web: MIT; runtime license/notice and exact dependency lock included.\n'
        'Reviewed media retains its separate MIT / CC BY 3.0 terms; attribution and changes in e04-media/data/sources.json.\n'
        'No training or fine-tuning performed.\n',encoding='utf-8')
    manifest={str(p.relative_to(out)): {'sha256':sha(p),'bytes':p.stat().st_size} for p in sorted(models.glob('*')) if p.is_file()}
    (models/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    with zipfile.ZipFile(out/'source/E04-source.zip','w',zipfile.ZIP_DEFLATED) as z:
        for p in HERE.iterdir():
            if p.is_file() and p.suffix in ('.py','.mjs','.html','.ipynb','.md','.txt') and p.name not in ('E04-material-review.zip','e04-teacher.html'):
                z.write(p,'scripts/course_labs/e04/'+p.name)
        for name in ('e04.html','e04-core.mjs','e04-lab.mjs'):
            z.write(COURSE/'interactive'/name,'docs/resources/course-labs/intelligent-perception/interactive/'+name)
        for name in ('LICENSE','NOTICE.txt'):
            z.write(out/name,name)
        z.write(out/'source/onnxruntime-package-lock.json','onnxruntime-package-lock.json')
        z.write(REPO/'.github/workflows/e04-feasibility.yml','.github/workflows/e04-feasibility.yml')
        z.write(REPO/'.github/workflows/dev-preview.yml','.github/workflows/dev-preview.yml')
    with zipfile.ZipFile(downloads/'MVAI_E04_V1.0_student.zip','w',zipfile.ZIP_DEFLATED) as z:
        z.write(nb,nb.name)
        z.write(out/'LICENSE','LICENSE');z.write(out/'NOTICE.txt','NOTICE.txt')
        z.write(HERE/'requirements.txt','requirements.txt')
        for d in ('frames','videos','data','licenses'):
            for p in (media/d).rglob('*'):
                if p.is_file():z.write(p,'dist/'+str(p.relative_to(media)))
        for name in EXPECTED:z.write(models/(name+'.pt'),'models/'+name+'.pt')
    print('E04 preview staged:',out, 'runtime',json.loads((pkg/'package.json').read_text())['version'])
    for p in sorted(models.glob('*.onnx')):print(p.name,round(p.stat().st_size/1024**2,2),'MiB')
    assert all(p.stat().st_size<95*1024*1024 for p in out.rglob('*') if p.is_file()),'GitHub file size gate'
if __name__=='__main__':main(*sys.argv[1:])

"""Independent frozen X3D-S clip probe. Predictions are not human labels."""
import hashlib
import json
import math
import os
from pathlib import Path
import subprocess
import sys
import time
import zipfile

import cv2
import numpy as np
import requests

REVISION='2ac6ed361309cb25144636ad82dd8bd6a4970e0c'
WEIGHT_URL='https://dl.fbaipublicfiles.com/pytorchvideo/model_zoo/kinetics/X3D_S.pyth'
LABEL_URL='https://dl.fbaipublicfiles.com/pyslowfast/dataset/class_names/kinetics_classnames.json'
CONFIG=dict(model='x3d_s',revision=REVISION,clip_seconds=2.6,frames=13,
    short_side=182,crop_size=182,mean=[.45]*3,std=[.225]*3,
    temporal_sampling='uniform floor indices over native frames in half-open interval',
    views=['official_center_crop','full_frame_letterbox_control'],
    output_activation='source logits followed by one external softmax',
    classification_status='RAW_MODEL_PREDICTIONS_ONLY',metrics='NOT_EVALUATED',training=False)


def fetch(url,path):
    path=Path(path)
    with requests.get(url,stream=True,timeout=(20,120)) as r:
        r.raise_for_status()
        with path.with_suffix('.part').open('wb') as f:
            for chunk in r.iter_content(1048576):f.write(chunk)
    path.with_suffix('.part').replace(path)
    return dict(url=url,bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
                expected_hash_verified=False)


def load_model(out):
    # Preserve the existing torch installation; only install model helper dependencies.
    subprocess.run([sys.executable,'-m','pip','install','-q','fvcore==0.1.5.post20221221',
                    'iopath==0.1.10','yacs==0.1.8','portalocker==3.2.0'],check=True)
    archive=Path('/tmp/p123_pytorchvideo.zip')
    source=fetch('https://codeload.github.com/facebookresearch/pytorchvideo/zip/'+REVISION,archive)
    target=Path('/tmp/p123_pytorchvideo');target.mkdir(exist_ok=True)
    with zipfile.ZipFile(archive) as z:
        for info in z.infolist():
            dest=(target/info.filename).resolve()
            if not dest.is_relative_to(target.resolve()):raise ValueError('Unsafe source archive path')
        z.extractall(target)
    repo=target/('pytorchvideo-'+REVISION);sys.path.insert(0,str(repo))
    (out/'source_LICENSE.txt').write_text((repo/'LICENSE').read_text())
    import torch
    from pytorchvideo.models.hub.x3d import x3d_s
    weights=Path('/tmp/X3D_S.pyth');manifest=fetch(WEIGHT_URL,weights)
    labels_path=Path('/tmp/kinetics_classnames.json');label_manifest=fetch(LABEL_URL,labels_path)
    labels={int(v):k.replace('"','') for k,v in json.loads(labels_path.read_text()).items()}
    if len(labels)!=400 or set(labels)!=set(range(400)):raise ValueError('Unexpected label mapping')
    model=x3d_s(pretrained=False)
    if model.blocks[-1].activation is not None:raise ValueError('Pinned source head should return logits')
    model.load_state_dict(torch.load(weights,map_location='cpu',weights_only=True)['model_state'],strict=True)
    model.eval().requires_grad_(False).cuda()
    if any(p.requires_grad for p in model.parameters()) or model.training:raise ValueError('Not inference only')
    (out/'model_manifest.json').write_text(json.dumps(dict(source=source,weights=manifest,labels=label_manifest,
        code_license='Apache-2.0',weights_license='No separately verified checkpoint license; no redistribution',
        parameters=sum(p.numel() for p in model.parameters()),training=False),indent=2))
    (out/'class_names.json').write_text(json.dumps(labels,indent=2))
    (out/'environment.json').write_text(json.dumps(dict(python=sys.version,torch=torch.__version__,
        cuda=torch.version.cuda,device=torch.cuda.get_device_name(0),opencv=cv2.__version__),indent=2))
    return model,labels,torch


def transform(frame,view,torch,roi=None):
    # Official floating-point bilinear short-side resize/center crop, avoiding old transforms imports.
    if view=='landmark_upper_body_roi_control':
        if not roi:raise ValueError('Missing declared landmark ROI')
        x1,y1,x2,y2=roi;frame=frame[y1:y2,x1:x2]
        if frame.size==0:raise ValueError('Empty landmark ROI')
    x=torch.from_numpy(cv2.cvtColor(frame,cv2.COLOR_BGR2RGB).copy()).permute(2,0,1).float()/255
    h,w=frame.shape[:2]
    scale=182/(min(h,w) if view=='official_center_crop' else max(h,w))
    nh,nw=int(math.floor(h*scale)),int(math.floor(w*scale))
    # Pin the selected dimension despite floating point multiplication at the boundary.
    if view=='official_center_crop':
        if h<=w:nh=182
        else:nw=182
    else:
        if h>=w:nh=182
        else:nw=182
    x=torch.nn.functional.interpolate(x[None],size=(nh,nw),mode='bilinear',align_corners=False)[0]
    if view=='official_center_crop':
        top,left=int(round((nh-182)/2)),int(round((nw-182)/2));x=x[:,top:top+182,left:left+182]
    else:
        canvas=torch.full((3,182,182),.45);top,left=(182-nh)//2,(182-nw)//2
        canvas[:,top:top+nh,left:left+nw]=x;x=canvas
    if x.shape!=(3,182,182):raise ValueError('Unexpected transformed shape')
    return (x-.45)/.225


def run_temporal(samples,prepare):
    out=Path('/kaggle/working/p123_temporal');out.mkdir(parents=True,exist_ok=True)
    os.chdir('/tmp')
    (out/'run_config.json').write_text(json.dumps(CONFIG,indent=2))
    records=[];errors=[]
    def checkpoint():
        tmp=out/'clip_predictions.tmp';tmp.write_text(json.dumps(records,indent=2,allow_nan=False))
        tmp.replace(out/'clip_predictions.json')
        (out/'errors.json').write_text(json.dumps(errors,indent=2))
    checkpoint()
    model,labels,torch=load_model(out);torch.set_num_threads(2)
    with torch.inference_mode():model(torch.zeros(1,3,13,182,182,device='cuda'))
    torch.cuda.synchronize()
    rows=prepare(samples,out,Path('/tmp/p123_temporal_media'))
    for s in rows:
        if s['download_status']!='ok':
            errors.append(dict(sample_id=s['id'],error=s.get('error','Download failed')));checkpoint();continue
        cap=cv2.VideoCapture('/tmp/p123_temporal_media/'+s['id']+'.mp4')
        try:
            start=float(s.get('analysis_start_sec',0))
            for t in s.get('analysis_window_starts',[start,start+2.6,start+5.2]):
                end=min(t+2.6,s['duration_sec'])
                if end-t<2.5:continue
                began=time.perf_counter()
                lo=math.ceil(t*s['fps']);hi=min(math.ceil(end*s['fps']),s['frame_count'])
                indices=np.linspace(lo,hi-1,13).astype(int).tolist()
                frames=[];actual=[]
                for index in indices:
                    cap.set(cv2.CAP_PROP_POS_FRAMES,index);ok,f=cap.read()
                    if not ok:raise RuntimeError('Decode failure at frame '+str(index))
                    frames.append(f);actual.append(float(cap.get(cv2.CAP_PROP_POS_MSEC)/1000))
                decode_sec=time.perf_counter()-began
                for view in s.get('analysis_views',CONFIG['views']):
                    transform_start=time.perf_counter()
                    clip=torch.stack([transform(f,view,torch,s.get('landmark_upper_body_roi')) for f in frames],dim=1)
                    from PIL import Image,ImageDraw
                    sheet=Image.new('RGB',(182*4,212),'#eeeeee');draw=ImageDraw.Draw(sheet)
                    for col,k in enumerate([0,4,8,12]):
                        rgb=((clip[:,k]*.225+.45).clamp(0,1)*255).byte().permute(1,2,0).numpy()
                        sheet.paste(Image.fromarray(rgb),(182*col,30));draw.text((182*col+2,8),f'{indices[k]/s["fps"]:.2f}s',fill='black')
                    sheet.save(out/f'{s["id"]}_{t:.2f}_{view}.jpg')
                    x=clip[None].cuda();torch.cuda.synchronize()
                    transform_sec=time.perf_counter()-transform_start
                    began=time.perf_counter()
                    with torch.inference_mode():raw=model(x)[0]
                    torch.cuda.synchronize();forward_sec=time.perf_counter()-began
                    # Pinned create_x3d passes head_activation=None, overriding create_x3d_head's default.
                    if raw.shape!=(400,) or not torch.isfinite(raw).all():raise ValueError('Invalid predictions')
                    scores=raw.softmax(dim=0);activation='one_external_softmax_on_source_logits'
                    if abs(float(scores.sum())-1)>.001:raise ValueError('Invalid softmax normalization')
                    values,inds=scores.topk(10)
                    records.append(dict(sample_id=s['id'],start_sec=t,end_sec=end,view=view,
                        source_roi=s.get('landmark_upper_body_roi') if view=='landmark_upper_body_roi_control' else None,
                        input_indices=indices,decoded_timestamps_sec=actual,decode_sec=decode_sec,
                        transform_transfer_preview_sec=transform_sec,forward_sec=forward_sec,activation=activation,
                        logits=raw.cpu().tolist(),scores=scores.cpu().tolist(),
                        top10=[dict(id=int(i),label=labels[int(i)],score=float(v)) for v,i in zip(values,inds)],
                        behavior='NOT_INFERRED',ground_truth='UNCONFIRMED',metrics='NOT_EVALUATED'))
                    checkpoint()
                del frames
        except Exception as e:
            import traceback
            errors.append(dict(sample_id=s['id'],error=repr(e),traceback=traceback.format_exc()));checkpoint()
        finally:cap.release()
    (out/'completion.json').write_text(json.dumps(dict(complete=not errors,clips=len(records),errors=errors),indent=2))
    print('Completed clip probe',len(records),'errors',len(errors),flush=True)

if __name__=='__main__':
    import shutil
    out=Path('/kaggle/working/our_solution_export');out.mkdir(exist_ok=True)
    os.chdir('/tmp')
    subprocess.run([sys.executable,'-m','pip','install','-q','onnx','onnxruntime','ultralytics==8.4.202'],check=True)
    model,labels,torch=load_model(out)
    model=model.cpu();torch.set_num_threads(2)
    import onnx,onnxruntime as ort
    x=torch.randn(1,3,13,182,182,generator=torch.Generator().manual_seed(17))
    target=out/'x3d_s.onnx'
    torch.onnx.export(model,x,str(target),opset_version=17,input_names=['video'],output_names=['logits'],dynamo=False)
    onnx.checker.check_model(onnx.load(str(target)))
    session=ort.InferenceSession(str(target),providers=['CPUExecutionProvider'])
    with torch.inference_mode():expected=model(x).numpy()
    actual=session.run(None,{'video':x.numpy()})[0]
    error=float(np.max(np.abs(expected-actual)))
    assert np.allclose(expected,actual,atol=1e-4,rtol=1e-4),error
    x.numpy().tofile(out/'golden_input.f32');expected.tofile(out/'golden_output.f32')
    from ultralytics import YOLO
    weight=Path('/tmp/yolo26s.pt')
    meta=fetch('https://github.com/ultralytics/assets/releases/download/v8.4.0/yolo26s.pt',weight)
    assert meta['sha256']=='646f8bc3fe0a656803d95c294f7852321748cb29d13466a1af8862e2db384a1b'
    yolo=YOLO(str(weight));exported=yolo.export(format='onnx',imgsz=960,opset=17,simplify=False,dynamic=False)
    shutil.copy2(exported,out/'yolo26s.onnx')
    files={p.name:dict(sha256=hashlib.sha256(p.read_bytes()).hexdigest(),bytes=p.stat().st_size) for p in out.iterdir() if p.is_file()}
    (out/'export_manifest.json').write_text(json.dumps(dict(complete=True,training=False,x3d_max_abs_error=error,files=files),indent=2))

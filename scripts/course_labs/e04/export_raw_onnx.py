"""Local model export spike. No weight or generated ONNX publication until licensing review.
Run in an isolated environment with ultralytics==8.4.219, onnx, onnxruntime.
"""
import hashlib, shutil, argparse
from pathlib import Path
import numpy as np
from ultralytics import YOLO
import onnxruntime as ort
EXPECTED={'yolo26n':'9b09cc8bf347f0fc8a5f7657480587f25db09b34bf33b0652110fb03a8ad4fef','yolo26s':'646f8bc3fe0a656803d95c294f7852321748cb29d13466a1af8862e2db384a1b'}
def export(weights,out):
    weights,out=Path(weights),Path(out);out.mkdir(parents=True,exist_ok=True)
    for model,expected in EXPECTED.items():
        src=weights/(model+'.pt')
        assert hashlib.sha256(src.read_bytes()).hexdigest()==expected, f'Unreviewed weights: {src}'
        for size in (320,640,960):
            # None is the raw one-to-many export in current YOLO26 docs; runtime output shape is the gate.
            p=Path(YOLO(str(src)).export(format='onnx',imgsz=size,dynamic=False,nms=None,opset=17,simplify=False,device='cpu'))
            target=out/f'{model}-{size}-raw.onnx';shutil.copy2(p,target)
            sess=ort.InferenceSession(str(target),providers=['CPUExecutionProvider'])
            x=np.zeros((1,3,size,size),dtype=np.float32)
            y=sess.run(None,{sess.get_inputs()[0].name:x})[0]
            assert y.ndim==3 and y.shape[0]==1 and y.shape[1]==84, f'Not raw 80-class COCO output: {y.shape}'
            assert np.isfinite(y).all(), 'Non-finite model output'
            print(target.name,y.shape,hashlib.sha256(target.read_bytes()).hexdigest())
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('weights');p.add_argument('out');a=p.parse_args();export(a.weights,a.out)

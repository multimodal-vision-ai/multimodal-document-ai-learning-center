#!/usr/bin/env python3
"""Isolated feasibility test: export genuine Meta MViT-v2-S and Microsoft Video Swin3D-T
pretrained Kinetics400 weights to ONNX. No deployment without browser verification.
"""
from pathlib import Path
import json,sys,traceback,time,hashlib,subprocess
import torch,torchvision,onnx
from torchvision.models.video import mvit_v2_s,MViT_V2_S_Weights,swin3d_t,Swin3D_T_Weights
out=Path("artifacts/video-action/nonmovinet-onnx-feasibility");out.mkdir(parents=True,exist_ok=True)
results=[]
for key,ctor,weights,shape in [
 ("meta-mvit-v2-s",mvit_v2_s,MViT_V2_S_Weights.KINETICS400_V1,(1,16,3,224,224)),
 ("microsoft-swin3d-t",swin3d_t,Swin3D_T_Weights.KINETICS400_V1,(1,16,3,112,112))
]:
 record={"name":key,"input":shape,"exportSuccess":False}
 try:
   print("ONNX_CANDIDATE_START",key,flush=True)
   m=ctor(weights=weights).eval().cpu()
   x=torch.zeros(shape,dtype=torch.float32)
   with torch.inference_mode():
     z=m(x)
   record["torchOutput"]=list(z.shape)
   if tuple(z.shape)!=(1,400):raise RuntimeError('Not 400 classes')
   start=time.monotonic()
   dest=out/(key+".onnx")
   torch.onnx.export(m,x,str(dest),opset_version=18,input_names=["video"],output_names=["logits"],
     dynamic_axes=None,do_constant_folding=True,dynamo=False)
   record["exportSeconds"]=round(time.monotonic()-start,2)
   record["onnxBytes"]=dest.stat().st_size
   record["onnxSha"]=hashlib.sha256(dest.read_bytes()).hexdigest()
   m2=onnx.load(str(dest));onnx.checker.check_model(m2)
   record["exportSuccess"]=True
   # Binary is test-only; remove before artifact upload.
   dest.unlink()
 except Exception as e:
   record["error"]=str(e)[:2500];record["stack"]=traceback.format_exc()[-1800:]
   print("ONNX_CANDIDATE_ERROR",key,str(e)[:1000],flush=True)
 finally:
   results.append(record);print("ONNX_CANDIDATE_RESULT",json.dumps(record),flush=True)
(out/"report.json").write_text(json.dumps({"candidates":results,"torch":torch.__version__,"torchvision":torchvision.__version__},indent=2))
if not any(x["exportSuccess"] for x in results):sys.exit(1)

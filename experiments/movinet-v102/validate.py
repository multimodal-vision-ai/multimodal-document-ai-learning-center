#!/usr/bin/env python3
"""Independent MVAI MoViNet-A0 streaming validation; no production deployment.
Model: litert-community/MoViNet-A0-Stream-LiteRT, not Google NHWC original.
Ground-truth labels refer to human-readable source descriptions only and do not
constitute a fully annotated benchmark dataset.
"""
import hashlib, json, os, subprocess, sys, time, traceback, urllib.request
from pathlib import Path
import cv2
import numpy as np

BASE=Path("movinet_validation_output")
BASE.mkdir(exist_ok=True)
DIMS=[2,2,2,4,2,2,4,2,2,2,4]
EXPECTED="0565d6e2173caf3e144e6a0a6461edfef9dc5cccacf9a093f311f8a8f05434c8"
MODEL="https://huggingface.co/litert-community/MoViNet-A0-Stream-LiteRT/resolve/main/movinet_a0_stream.tflite"
LABELS="https://raw.githubusercontent.com/tensorflow/models/f8af2291cced43fc9f1d9b41ddbf772ae7b0d7d2/official/projects/movinet/files/kinetics_600_labels.txt"
JUMP="https://raw.githubusercontent.com/tensorflow/models/f8af2291cced43fc9f1d9b41ddbf772ae7b0d7d2/official/projects/movinet/files/jumpingjack.gif"
WAVE="https://commons.wikimedia.org/wiki/Special:Redirect/file/HandWaveExample.webm"
PHONE_CALL="https://www.pexels.com/video/a-man-using-a-smartphone-6898107/"
PHONE_LOOK="https://www.pexels.com/video/person-using-a-smartphone-7933941/"
report={"purpose":"MVAI V1.0.2 independently reproduced action recognition","validated_model_inference":False,
        "sources":[],"clips":[],"errors":[],"runtime":{},"thresholds_note":
        "clip-label matches are pilot observations, not statistically valid accuracy estimates"}
def log(msg): print(msg,flush=True)
def save():
    (BASE/"results.json").write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding="utf-8")
def download(url,path,max_bytes=120_000_000):
    req=urllib.request.Request(url,headers={"User-Agent":"MVAI-Learning-Center-Research-Validation/1.0"})
    with urllib.request.urlopen(req,timeout=90) as r,open(path,"wb") as f:
        n=0
        while True:
            b=r.read(1<<20)
            if not b:break
            n+=len(b)
            if n>max_bytes:raise RuntimeError("asset too large")
            f.write(b)
    if Path(path).stat().st_size<100:raise RuntimeError("unexpectedly tiny asset")
    log("DOWNLOADED "+str(path)+" "+str(Path(path).stat().st_size)+" bytes")
def ffmpeg_convert(path,output):
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(path),
        "-vf","fps=5,scale='min(640,iw)':-2","-t","8","-an","-c:v","libx264",
        "-pix_fmt","yuv420p",str(output)],check=True,timeout=150)

def read_frames(path,max_frames=40):
    cap=cv2.VideoCapture(str(path))
    if not cap.isOpened():raise RuntimeError("OpenCV cannot decode "+str(path))
    fps=cap.get(cv2.CAP_PROP_FPS); n=cap.get(cv2.CAP_PROP_FRAME_COUNT)
    if fps<=0 or n<=0: raise RuntimeError(f"invalid fps/framecount {fps} {n}")
    frames=[]
    for i in range(min(max_frames,int(np.ceil(n/fps*5)))):
        pos=i/5
        cap.set(cv2.CAP_PROP_POS_MSEC, pos*1000)
        ok,bgr=cap.read()
        if not ok:break
        rgb=cv2.cvtColor(cv2.resize(bgr,(172,172),interpolation=cv2.INTER_LINEAR),cv2.COLOR_BGR2RGB)
        frames.append((rgb.astype(np.float32)/255).transpose(2,0,1)[None].copy())
    cap.release()
    if not frames:raise RuntimeError("No frames")
    return frames,{"duration_s":round(n/fps,3),"source_fps":fps,"frames_decoded":len(frames)}

def run_sequence(it,frames):
    inp=it.get_input_details();out=it.get_output_details()
    if len(inp)!=47 or len(out)!=28:raise RuntimeError(f"model interface mismatch: {len(inp)} inputs {len(out)} outputs")
    if tuple(inp[0]["shape"])!=(1,3,172,172) or tuple(out[0]["shape"])!=(1,600):
        raise RuntimeError("This is not the expected NCHW community model")
    history=[]; off=0
    for depth in DIMS:
        history.append([np.zeros(inp[1+off+j]["shape"],dtype=np.float32) for j in range(depth)])
        off+=depth
    pool=[np.zeros(inp[29+i]["shape"],dtype=np.float32) for i in range(16)]
    elapsed=[]; last=None
    for count,frame in enumerate(frames,1):
        it.set_tensor(inp[0]["index"],frame)
        off=0
        for c,depth in enumerate(DIMS):
            for j in range(depth):it.set_tensor(inp[1+off+j]["index"],history[c][j])
            off+=depth
        for j in range(16):it.set_tensor(inp[29+j]["index"],pool[j])
        it.set_tensor(inp[45]["index"],np.full((1,1,1,1),1/count,np.float32))
        it.set_tensor(inp[46]["index"],np.ones((1,1,1,1),np.float32))
        a=time.perf_counter();it.invoke();elapsed.append((time.perf_counter()-a)*1000)
        last=it.get_tensor(out[0]["index"])[0].copy()
        if not np.isfinite(last).all():raise RuntimeError("nonfinite logits")
        for c,depth in enumerate(DIMS):
            history[c]=history[c][1:]+[it.get_tensor(out[1+c]["index"]).copy()]
        for j in range(16):
            pool[j]+=it.get_tensor(out[12+j]["index"]).copy()
    return last,elapsed

def infer(it,frames,labels,source,expected):
    a,lat=run_sequence(it,frames);b,lat2=run_sequence(it,frames)
    matches=bool(np.allclose(a,b,rtol=1e-5,atol=1e-5))
    if not matches:raise RuntimeError("state-reset determinism failed")
    p=np.exp(a-a.max());p=p/p.sum()
    top=np.argsort(p)[::-1][:5]
    items=[{"index":int(x),"label":labels[x],"score":round(float(p[x]),6)} for x in top]
    target=[{"label":x,"rank":int(np.where(np.argsort(p)[::-1]==labels.index(x))[0][0])+1,
       "score":round(float(p[labels.index(x)]),6)} for x in expected if x in labels]
    r={"source":source,"expected_labels":expected,"top5":items,"target_details":target,
       "top1_expected":bool(items[0]["label"] in expected),"top5_expected":bool(any(q["label"] in expected for q in items)),
       "state_reset_deterministic":matches,"frames":len(frames),
       "inference_ms_per_frame_p50":round(float(np.median(lat)),3),
       "inference_ms_per_frame_p95":round(float(np.percentile(lat,95)),3),
       "inference_ms_total":round(sum(lat),3),"repeat_ms_total":round(sum(lat2),3)}
    report["clips"].append(r);save();log("RESULT "+json.dumps(r,ensure_ascii=False))
    return r

def optional_phone(url,key):
    # Only attempt to download the two explicitly selected clips, not a bulk crawl.
    # youtube-dl extractors might not support Pexels; log and skip rather than guess media URLs.
    target=BASE/(key+".mp4")
    try:
        subprocess.run(["yt-dlp","--no-playlist","--max-filesize","100M","-f",
          "b[height<=720]/b","-o",str(target),url],check=True,timeout=100)
        matches=list(BASE.glob(key+"*"))
        files=[f for f in matches if f.is_file() and f.stat().st_size>10000]
        if not files:raise RuntimeError("No downloaded video")
        output=BASE/(key+"_5fps.mp4")
        ffmpeg_convert(files[0],output)
        return output
    except Exception as e:
        report["errors"].append({"stage":"optional_phone_download","clip":key,"error":str(e)})
        save();log("PHONE DOWNLOAD UNAVAILABLE: "+key+" "+str(e))
        return None

try:
    from ai_edge_litert.interpreter import Interpreter
    import importlib.metadata
    report["runtime"]={"litert":importlib.metadata.version("ai-edge-litert"),"numpy":np.__version__}
    log("DOWNLOADING MODEL")
    path=BASE/"movinet_a0_stream.tflite";download(MODEL,path,25_000_000)
    sha=hashlib.sha256(path.read_bytes()).hexdigest()
    report["model_sha256"]=sha
    if sha!=EXPECTED:raise RuntimeError("MODEL SHA256 MISMATCH: "+sha)
    lab=BASE/"kinetics_600_labels.txt";download(LABELS,lab,100_000)
    labels=[x.strip() for x in lab.read_text().splitlines()]
    if len(labels)!=600:raise RuntimeError("LABEL COUNT NOT 600")
    report["target_label_presence"]={x:x in labels for x in
      ["jumping jacks","waving hand","talking on cell phone","looking at phone","texting"]}
    report["sources"].append({"model":MODEL,"labels":LABELS})
    start=time.perf_counter()
    it=Interpreter(model_path=str(path),num_threads=4)
    it.allocate_tensors()
    report["model_load_ms"]=round((time.perf_counter()-start)*1000,3)
    report["model_io"]={"inputs":len(it.get_input_details()),"outputs":len(it.get_output_details())}
    report["validated_model_inference"]=True
    save()
    log("MODEL ALLOCATED WITH VERIFIED SHA, 47-INPUT/28-OUTPUT CONTRACT")
    jp=BASE/"jumpingjack.gif"; download(JUMP,jp,15_000_000)
    jmp=BASE/"jumpingjack_5fps.mp4"; ffmpeg_convert(jp,jmp)
    frames,meta=read_frames(jmp); report["sources"].append({"url":JUMP,"reference":"jumping jacks","license":"CC-BY per Google official tutorial"})
    infer(it,frames,labels,"official_google_jumping_jacks",["jumping jacks"])
    try:
        wave=BASE/"HandWaveExample.webm"; download(WAVE,wave,20_000_000)
        wave_mp4=BASE/"waving_5fps.mp4";ffmpeg_convert(wave,wave_mp4)
        frames,meta=read_frames(wave_mp4)
        report["sources"].append({"url":WAVE,"reference":"waving hand","license":"CC BY-SA 4.0; confirm exact clip visually"})
        infer(it,frames,labels,"wikimedia_handwave",["waving hand"])
    except Exception as e:
        report["errors"].append({"stage":"waving_video","error":str(e)});save();log("WAVING VIDEO UNAVAILABLE: "+str(e))
    for key,url,expected in [
        ("phone_call",PHONE_CALL,["talking on cell phone"]),
        ("phone_look",PHONE_LOOK,["looking at phone","texting"])]:
        path=optional_phone(url,key)
        if path is None:continue
        frames,_=read_frames(path)
        report["sources"].append({"url":url,"reference":expected,
          "limitation":"Reference inferred from source description; requires human frame-level confirmation"})
        infer(it,frames,labels,key,expected)
except Exception as e:
    log("FATAL "+traceback.format_exc())
    report["errors"].append({"stage":"fatal","error":str(e),"traceback":traceback.format_exc()})
    save()
    sys.exit(1)
save()
log("FINAL_REPORT "+json.dumps({"model_loaded":report["validated_model_inference"],
       "clips":[(r["source"],r["top5"][0]["label"]) for r in report["clips"]],"errors":report["errors"]}))

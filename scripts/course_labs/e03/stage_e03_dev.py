#!/usr/bin/env python3
"""Build the E03 V2.0 teaching assets for an isolated DEV preview."""
from pathlib import Path
import argparse, hashlib, json, shutil, subprocess, sys, urllib.request, zipfile
import cv2, numpy as np

COMMIT="91b080357290da37f533e2d0832f601c3e770d51"
ARCHIVE=f"https://codeload.github.com/udacity/CarND-Advanced-Lane-Lines/zip/{COMMIT}"
STRAIGHT="https://raw.githubusercontent.com/ncondo/CarND-LaneLines-P1/32ee95fcf045d7a92cf44f5ae92d32c4db3788db/solidWhiteRight.mp4"
HASHES={
 "solidWhiteRight.mp4":"2d8e14b46fe89afbc8ad1f718685cf09b83e85a324095031c38186a9f0535417",
 "project_video.mp4":"651949922042c223375d40bf8929def97dbb62c6ade651d1f5b08eea47127d5f",
 "harder_challenge_video.mp4":"45879f48cdc43e40771317a7d03c973cb4c45db47f145e28837d9610d121732c",
}
def digest(p):
 h=hashlib.sha256()
 with open(p,"rb") as f:
  for b in iter(lambda:f.read(1024*1024),b""):h.update(b)
 return h.hexdigest()
def get(url,path):
 path.parent.mkdir(parents=True,exist_ok=True)
 req=urllib.request.Request(url,headers={"User-Agent":"MVAI-E03-DEV"})
 with urllib.request.urlopen(req,timeout=180) as r,open(path,"wb") as f:shutil.copyfileobj(r,f)
def save(path,img):
 path.parent.mkdir(parents=True,exist_ok=True)
 if img is None or not cv2.imwrite(str(path),img):raise RuntimeError(f"Cannot write {path}")
def main():
 p=argparse.ArgumentParser();p.add_argument("--repo-root",type=Path,default=Path.cwd());a=p.parse_args()
 root=a.repo_root.resolve();base=root/"scripts/course_labs/e03";work=root/".e03-build";work.mkdir(exist_ok=True)
 archive=work/"source.zip";get(ARCHIVE,archive)
 with zipfile.ZipFile(archive) as z:
  names=z.namelist();marker=next((x for x in names if x.endswith("/camera_cal/calibration1.jpg")),None)
  if not marker:raise RuntimeError("Pinned source archive lacks camera_cal")
  prefix=marker.split("camera_cal/")[0]
  extract=work/"source";z.extractall(extract)
 source=extract/prefix
 data=root/"data/e03";cal=data/"camera_cal";test=data/"test_images";videos=data/"videos"
 for d in (cal,test,videos):d.mkdir(parents=True,exist_ok=True)
 for pth in (source/"camera_cal").glob("*.jpg"):shutil.copy2(pth,cal/pth.name)
 for pth in (source/"test_images").glob("*.jpg"):shutil.copy2(pth,test/pth.name)
 shutil.copy2(source/"project_video.mp4",videos/"project_video.mp4")
 shutil.copy2(source/"harder_challenge_video.mp4",videos/"harder_challenge_video.mp4")
 get(STRAIGHT,videos/"solidWhiteRight.mp4")
 for name,expected in HASHES.items():
  actual=digest(videos/name)
  if actual!=expected:raise RuntimeError(f"SHA256 mismatch {name}: {actual}")
 if len(list(cal.glob("calibration*.jpg")))!=20 or len(list(test.glob("*.jpg")))<8:raise RuntimeError("Missing expected teaching images")
 sys.path.insert(0,str(base))
 from e03_lane_finding import calibrate_camera,undistort,threshold_lane_pixels,perspective_matrices,sliding_window_search,fit_lane_pixels,LaneTracker
 calibration=calibrate_camera(sorted(cal.glob("calibration*.jpg")))
 out=root/"outputs"
 for name in ("calibration","threshold","perspective","lane_fitting","images","videos"):(out/name).mkdir(parents=True,exist_ok=True)
 np.savez_compressed(out/"calibration/calibration_params.npz",mtx=calibration["mtx"],dist=calibration["dist"],rms=calibration["rms"],views=calibration["views"],image_size=np.array(calibration["image_size"]))
 media=root/"docs/resources/course-labs/intelligent-perception/e03-media";(media/"videos").mkdir(parents=True,exist_ok=True)
 corner=cv2.imread(str(cal/calibration["detected"][0]));corner=corner[:720,:1280] if corner.shape[:2]==(721,1281) else corner
 ok,corners=cv2.findChessboardCornersSB(cv2.cvtColor(corner,cv2.COLOR_BGR2GRAY),(9,6))
 if ok:cv2.drawChessboardCorners(corner,(9,6),corners,ok)
 save(media/"calibration-corners.jpg",corner)
 image=cv2.imread(str(test/"test3.jpg"));und=undistort(image,calibration);st=threshold_lane_pixels(und);M,Minv,src,dst=perspective_matrices(und.shape)
 bird=cv2.warpPerspective(st["binary"],M,(image.shape[1],image.shape[0]),flags=cv2.INTER_NEAREST)
 save(media/"threshold-binary.png",st["binary"]);save(media/"perspective-bird-eye.png",bird)
 search=sliding_window_search(bird);fit=fit_lane_pixels(search,bird.shape);vis=cv2.cvtColor(bird,cv2.COLOR_GRAY2BGR)
 for x0,y0,x1,y1,x2,x3 in search["windows"]:
  cv2.rectangle(vis,(max(0,x0),y0),(min(vis.shape[1]-1,x1),min(vis.shape[0]-1,y0+vis.shape[0]//9)),(0,255,0),2)
  cv2.rectangle(vis,(max(0,x2),y0),(min(vis.shape[1]-1,x3),min(vis.shape[0]-1,y0+vis.shape[0]//9)),(255,0,0),2)
 if fit["valid"]:
  cv2.polylines(vis,[np.column_stack((fit["left_fitx"],fit["ploty"])).astype(np.int32)],False,(0,255,255),4)
  cv2.polylines(vis,[np.column_stack((fit["right_fitx"],fit["ploty"])).astype(np.int32)],False,(0,255,255),4)
 save(media/"sliding-window-fit.png",vis);save(media/"final-single-image.jpg",LaneTracker(use_ema=False).process(image,calibration)["output"])
 scenes=[("straight","solidWhiteRight.mp4",2),("curve","project_video.mp4",2),("complex","harder_challenge_video.mp4",15)]
 for key,name,sec in scenes:
  cap=cv2.VideoCapture(str(videos/name));cap.set(cv2.CAP_PROP_POS_MSEC,sec*1000);ok,frame=cap.read();cap.release()
  if not ok:raise RuntimeError(f"Cannot read {name} at {sec}s")
  u=undistort(frame,calibration);ss=threshold_lane_pixels(u);mm,_,_,_=perspective_matrices(u.shape);bw=cv2.warpPerspective(ss["binary"],mm,(frame.shape[1],frame.shape[0]),flags=cv2.INTER_NEAREST)
  sf=fit_lane_pixels(sliding_window_search(bw),bw.shape);fv=cv2.cvtColor(bw,cv2.COLOR_GRAY2BGR)
  if sf["valid"]:
   cv2.polylines(fv,[np.column_stack((sf["left_fitx"],sf["ploty"])).astype(np.int32)],False,(0,255,255),4);cv2.polylines(fv,[np.column_stack((sf["right_fitx"],sf["ploty"])).astype(np.int32)],False,(0,255,255),4)
  save(media/f"scene-{key}-original.jpg",frame)
  save(media/f"scene-{key}-binary.png",ss["binary"]);save(media/f"scene-{key}-bird-eye.png",bw);save(media/f"scene-{key}-sliding-fit.png",fv)
  save(media/f"scene-{key}-result.jpg",LaneTracker().process(frame,calibration)["output"])
  subprocess.run([sys.executable,str(base/"process_e03_video.py"),"--video",str(videos/name),"--output-dir",str(out/"videos"),"--calibration",str(out/"calibration/calibration_params.npz"),"--max-seconds","8","--process-fps","10"],check=True,cwd=root)
  stem=Path(name).stem
  shutil.copy2(out/"videos"/f"{stem}_compare.mp4",media/"videos"/f"{key}-compare.mp4")
  shutil.copy2(out/"videos"/f"{stem}_processed.mp4",media/"videos"/f"{key}-processed.mp4")
 downloads=root/"docs/resources/course-labs/intelligent-perception/downloads";downloads.mkdir(parents=True,exist_ok=True)
 shutil.copy2(base/"E03_Advanced_Lane_Finding_V2.0.ipynb",downloads/"E03_Advanced_Lane_Finding_V2.0.ipynb")
 zip_path=downloads/"MVAI_E03_Advanced_Lane_Finding_V2.0.zip"
 with zipfile.ZipFile(zip_path,"w",zipfile.ZIP_DEFLATED,compresslevel=4) as z:
  for f in base.rglob("*"):
   if f.is_file() and "__pycache__" not in f.parts:z.write(f,"MVAI_E03_Advanced_Lane_Finding_V2.0/"+str(f.relative_to(base)))
  for folder,arc in ((cal,"data/e03/camera_cal"),(test,"data/e03/test_images"),(videos,"data/e03/videos")):
   for f in folder.glob("*"):
    if f.is_file():z.write(f,"MVAI_E03_Advanced_Lane_Finding_V2.0/"+arc+"/"+f.name)
 report={"status":"staged","source_commit":COMMIT,"calibration_views":calibration["views"],"calibration_failed":[x[0] for x in calibration["failed"]],"calibration_rms_px":calibration["rms"],"manual_video_review":"Teacher approved all three videos; harder-challenge drift/false lane selection is intentionally retained for after-class exploration.","video_hashes":{n:digest(videos/n) for n in HASHES}}
 (downloads/"DEV_STAGING_REPORT.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
 print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=="__main__":main()

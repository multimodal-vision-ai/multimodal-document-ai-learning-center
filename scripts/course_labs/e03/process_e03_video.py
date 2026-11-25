#!/usr/bin/env python3
"""Process one E03 video in an isolated process and write H.264 MP4 outputs."""
import argparse,json,subprocess,sys,gc
from pathlib import Path
import cv2,numpy as np
from e03_lane_finding import process_video

def main():
 p=argparse.ArgumentParser();p.add_argument("--video",required=True,type=Path);p.add_argument("--output-dir",required=True,type=Path);p.add_argument("--calibration",required=True,type=Path);p.add_argument("--max-seconds",type=float,default=8);p.add_argument("--process-fps",type=float,default=10);a=p.parse_args()
 with np.load(a.calibration,allow_pickle=False) as d:
  cal={"mtx":d["mtx"],"dist":d["dist"],"rms":float(d["rms"]),"views":int(d["views"]),"image_size":tuple(int(x) for x in d["image_size"])}
 result=process_video(a.video,a.output_dir,cal,max_seconds=None if a.max_seconds<=0 else a.max_seconds,process_fps=a.process_fps)
 print(json.dumps(result,ensure_ascii=False,indent=2))
if __name__=="__main__":main()

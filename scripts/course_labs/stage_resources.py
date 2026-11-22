#!/usr/bin/env python3
"""Build the public E01/E02 teaching assets before MkDocs renders pages.

Videos originate from Udacity MIT-licensed repositories and match the five
teacher-approved source files by SHA256. Only nine JPEG frames and an eight-
second classroom clip are published. No teacher guidance is included.
"""
from pathlib import Path
import hashlib, json, shutil, subprocess, tempfile
from urllib.request import Request, urlopen
from zipfile import ZipFile, ZIP_DEFLATED

ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/"docs/resources/course-labs/intelligent-perception"
IMAGES=BASE/"images"
DOWNLOADS=BASE/"downloads"
VIDEOS={
 "solidWhiteRight":("CarND-LaneLines-P1","test_videos/solidWhiteRight.mp4","2d8e14b46fe89afbc8ad1f718685cf09b83e85a324095031c38186a9f0535417"),
 "solidYellowLeft":("CarND-LaneLines-P1","test_videos/solidYellowLeft.mp4","75a63e3b2ae2fe04ec57beace9b680daa417a905d9e9656f445e510b1b70c17d"),
 "project_video":("CarND-Advanced-Lane-Lines","project_video.mp4","651949922042c223375d40bf8929def97dbb62c6ade651d1f5b08eea47127d5f"),
 "challenge":("CarND-LaneLines-P1","test_videos/challenge.mp4","e91ddd5dcae65c2570bb2ee72d9b268c296f6893bf3eb68e7976b843e0e53a47"),
 "harder_challenge_video":("CarND-Advanced-Lane-Lines","harder_challenge_video.mp4","45879f48cdc43e40771317a7d03c973cb4c45db47f145e28837d9610d121732c")
}
FRAMES=[
 ("01_solidWhiteRight_straight_white.jpg","solidWhiteRight",4.4),
 ("02_solidYellowLeft_yellow_white.jpg","solidYellowLeft",2.72),
 ("03_project_curve_intro.jpg","project_video",5.04),
 ("04_project_curve_traffic.jpg","project_video",35.28),
 ("05_challenge_shadow_traffic.jpg","challenge",1.0),
 ("06_challenge_bright_pavement.jpg","challenge",5.0),
 ("07_harder_curve_motorcycle.jpg","harder_challenge_video",4.76),
 ("08_harder_shadow_glare.jpg","harder_challenge_video",14.36),
 ("09_harder_curve_shadow.jpg","harder_challenge_video",43.16)
]
def command(*args):
 if args and args[0]=="ffmpeg": args=(FFMPEG,*args[1:])
 subprocess.run(args,check=True,stdout=subprocess.DEVNULL)

def download(name,tmp):
 repo,path,expected=VIDEOS[name]
 url="https://raw.githubusercontent.com/udacity/"+repo+"/master/"+path
 out=tmp/(name+".mp4")
 with urlopen(Request(url,headers={"User-Agent":"MVAI-Labs-Builder"}),timeout=120) as response,out.open("wb") as f:
  shutil.copyfileobj(response,f)
 sha=hashlib.sha256(out.read_bytes()).hexdigest()
 if sha!=expected: raise RuntimeError("Video SHA256 mismatch: "+name)
 print("Verified:",name,out.stat().st_size)
 return out

ENV="""
from pathlib import Path
import cv2
import numpy as np
import matplotlib.pyplot as plt
def locate_images():
    here=Path.cwd().resolve()
    for root in [here,*here.parents]:
        p=root/'images'
        if (p/'01_solidWhiteRight_straight_white.jpg').exists(): return p
    kaggle=Path('/kaggle/input')
    if kaggle.exists():
        for p in kaggle.glob('**/images/01_solidWhiteRight_straight_white.jpg'): return p.parent
    raise FileNotFoundError('请解压完整教学包，确保 images/ 与 Notebook 一同提供')
IMAGES=locate_images()
def read(name):
    x=cv2.imread(str(IMAGES/name))
    if x is None: raise FileNotFoundError(name)
    return x
def view(items):
    fig,axs=plt.subplots(1,len(items),figsize=(5*len(items),4))
    if len(items)==1: axs=[axs]
    for ax,(name,img) in zip(axs,items):
        ax.imshow(img if img.ndim==2 else cv2.cvtColor(img,cv2.COLOR_BGR2RGB),cmap='gray' if img.ndim==2 else None)
        ax.set_title(name);ax.axis('off')
    plt.tight_layout();plt.show()
print('Image path:',IMAGES,'OpenCV:',cv2.__version__)
"""
E01=[
("md","## 00 · 环境与素材\n同一张真实道路图片只修改一个参数，比较处理前后差异。"),
("code",ENV),
("md","## 01 · RGB / HSV 颜色空间\n探索黄线和白线为什么需要不同的阈值。"),
("code","""img=read('02_solidYellowLeft_yellow_white.jpg')
hsv=cv2.cvtColor(img,cv2.COLOR_BGR2HSV)
yellow=cv2.inRange(hsv,(15,70,70),(40,255,255))
white=cv2.inRange(hsv,(0,0,175),(179,85,255))
view([('Original',img),('Yellow',yellow),('White',white),('Combined',cv2.bitwise_or(yellow,white))])"""),
("md","## 02 · 全局 / Otsu / 自适应阈值\n同一阈值为什么无法适应所有亮度？"),
("code","""img=read('06_challenge_bright_pavement.jpg')
g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
_,a=cv2.threshold(g,150,255,cv2.THRESH_BINARY)
_,b=cv2.threshold(g,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
c=cv2.adaptiveThreshold(g,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,31,7)
view([('Original',img),('Global',a),('Otsu',b),('Adaptive',c)])"""),
("md","## 03 · 图像滤波与 CLAHE\n对比高斯、中值和双边滤波。"),
("code","""img=read('08_harder_shadow_glare.jpg')
g=cv2.GaussianBlur(img,(5,5),1.2);m=cv2.medianBlur(img,5)
b=cv2.bilateralFilter(img,9,60,60)
c=cv2.createCLAHE(clipLimit=2.0,tileGridSize=(8,8)).apply(cv2.cvtColor(img,cv2.COLOR_BGR2GRAY))
view([('Original',img),('Gaussian',g),('Median',m),('Bilateral',b),('CLAHE',c)])"""),
("md","## 04 · 形态学\n腐蚀、膨胀、开运算、闭运算有什么不同？"),
("code","""img=read('02_solidYellowLeft_yellow_white.jpg')
mask=cv2.inRange(cv2.cvtColor(img,cv2.COLOR_BGR2HSV),(15,70,70),(40,255,255))
k=cv2.getStructuringElement(cv2.MORPH_RECT,(5,5))
view([('Mask',mask),('Erosion',cv2.erode(mask,k)),('Dilation',cv2.dilate(mask,k)),
('Opening',cv2.morphologyEx(mask,cv2.MORPH_OPEN,k)),('Closing',cv2.morphologyEx(mask,cv2.MORPH_CLOSE,k))])"""),
("md","## 05 · 透视变换\n没有相机标定时只能得到近似鸟瞰图，不能报告米制距离。"),
("code","""img=read('01_solidWhiteRight_straight_white.jpg')
h,w=img.shape[:2]
src=np.float32([[.39*w,.56*h],[.61*w,.56*h],[.96*w,.97*h],[.04*w,.97*h]])
dst=np.float32([[.25*w,0],[.75*w,0],[.75*w,h-1],[.25*w,h-1]])
bird=cv2.warpPerspective(img,cv2.getPerspectiveTransform(src,dst),(w,h))
view([('Original',img),('Approximate bird-eye',bird)])""")
]
E02=[
("md","## 00 · 环境与素材\nHough 候选线段不是人工 Ground Truth，候选数不能当作准确率。"),
("code",ENV),
("md","## 01 · Canny 阈值\n边缘越多越好吗？"),
("code","""img=read('01_solidWhiteRight_straight_white.jpg')
blur=cv2.GaussianBlur(cv2.cvtColor(img,cv2.COLOR_BGR2GRAY),(5,5),1.2)
view([('Original',img),('30 / 90',cv2.Canny(blur,30,90)),
('50 / 150',cv2.Canny(blur,50,150)),('100 / 200',cv2.Canny(blur,100,200))])"""),
("md","## 02 · ROI + Hough\n修改 ROI 梯形顶部比例与 Hough 参数。"),
("code","""def pipeline(img,top=.55,lo=50,hi=150,votes=25,length=35,gap=70):
    h,w=img.shape[:2]
    gray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    edges=cv2.Canny(cv2.GaussianBlur(gray,(5,5),1.2),lo,hi)
    mask=np.zeros((h,w),np.uint8)
    poly=np.array([[(int(.05*w),int(.97*h)),(int(.42*w),int(top*h)),
                    (int(.58*w),int(top*h)),(int(.98*w),int(.97*h))]],np.int32)
    cv2.fillPoly(mask,poly,255)
    roi=cv2.bitwise_and(edges,mask)
    result=img.copy()
    lines=cv2.HoughLinesP(roi,1,np.pi/180,threshold=votes,minLineLength=length,maxLineGap=gap)
    found=[] if lines is None else np.asarray(lines).reshape(-1,4).tolist()
    for x1,y1,x2,y2 in found:
        cv2.line(result,(x1,y1),(x2,y2),(30,220,30),2)
    return edges,roi,result,found
img=read('01_solidWhiteRight_straight_white.jpg')
edge,roi,overlay,lines=pipeline(img)
view([('Original',img),('Canny',edge),('ROI',roi),('Hough',overlay)])
print('Hough candidates:',len(lines))"""),
("md","## 03 · 左右候选线筛选\n根据斜率区分左右候选线，但没有语义识别能力。"),
("code","""img=read('01_solidWhiteRight_straight_white.jpg')
_,_,all_lines,lines=pipeline(img)
h,w=img.shape[:2]
left_right=img.copy()
for x1,y1,x2,y2 in lines:
    if abs(y2-y1)<5: continue
    slope=(x2-x1)/(y2-y1)
    if abs(slope)<.45: continue
    xb=x1+slope*(.97*h-y1)
    if slope<0 and .03*w<xb<.5*w: color=(255,80,30)
    elif slope>0 and .5*w<xb<.97*w: color=(20,170,255)
    else: continue
    cv2.line(left_right,(x1,y1),(x2,y2),color,4)
view([('Hough candidates',all_lines),('Left/right candidate classification',left_right)])"""),
("md","## 04 · 固定参数九图泛化\n不针对每张图片单独调参，寻找误检和漏检的原因。"),
("code","""files=sorted(IMAGES.glob('*.jpg'))
fig,ax=plt.subplots(3,3,figsize=(15,9))
for a,p in zip(ax.flat,files):
    _,_,result,lines=pipeline(read(p.name))
    a.imshow(cv2.cvtColor(result,cv2.COLOR_BGR2RGB))
    a.set_title(p.stem[3:25]+f' ({len(lines)})',fontsize=9);a.axis('off')
plt.tight_layout();plt.show()"""),
("md","## 05 · 视频延伸\nZIP 内视频 videos/solidWhiteRight_8s.mp4 可作为逐帧独立检测案例；本基线尚未实现时序跟踪。")
]

def build_notebook(title,parts):
 cells=[{"cell_type":"markdown","metadata":{},"source":[title]}]
 for kind,source in parts:
  d={"cell_type":"markdown","metadata":{},"source":source.splitlines(keepends=True)} if kind=="md" else {"cell_type":"code","metadata":{},"execution_count":None,"outputs":[],"source":source.splitlines(keepends=True)}
  cells.append(d)
 return {"nbformat":4,"nbformat_minor":5,"metadata":{"kernelspec":{"display_name":"Python 3","language":"python","name":"python3"},"language_info":{"name":"python"}},"cells":cells}

def execute_notebook(path):
 """Execute the same student Python cells and retain real output figures."""
 import nbformat
 from nbclient import NotebookClient
 nb=nbformat.read(str(path),as_version=4)
 client=NotebookClient(nb,timeout=240,kernel_name="python3",resources={"metadata":{"path":str(DOWNLOADS)}})
 client.execute()
 figures=sum(sum("image/png" in output.get("data",{}) for output in c.get("outputs",[])) for c in nb.cells if c.cell_type=="code")
 if figures<4:raise RuntimeError(f"Expected at least four rendered plots in {path}: {figures}")
 nbformat.write(nb,str(path))
 print("Executed",path.name,"image outputs:",figures)


def embed_student_images():
 """Use inline images to avoid browser cache/origin restrictions in preview."""
 import base64
 page=BASE/"interactive/index.html"
 if not page.exists():raise RuntimeError("Interactive HTML missing")
 text=page.read_text(encoding="utf-8")
 images={p.name:"data:image/jpeg;base64,"+base64.b64encode(p.read_bytes()).decode("ascii") for p in sorted(IMAGES.glob("*.jpg"))}
 if len(images)!=9:raise RuntimeError("Need exactly nine embedded images")
 tag="<script>window.MVAI_INLINE_IMAGES="+json.dumps(images,separators=(",",":"))+";</script>"
 text=text.replace("</head>",tag+"</head>",1)
 page.write_text(text,encoding="utf-8")
 print("Embedded nine self-contained preview images")


def main():
 global FFMPEG
 FFMPEG=shutil.which("ffmpeg")
 if not FFMPEG:
  import imageio_ffmpeg
  FFMPEG=imageio_ffmpeg.get_ffmpeg_exe()
 print("Using FFmpeg:",FFMPEG)
 IMAGES.mkdir(parents=True,exist_ok=True);DOWNLOADS.mkdir(parents=True,exist_ok=True)
 with tempfile.TemporaryDirectory() as td:
  tmp=Path(td)
  sources={name:download(name,tmp) for name in VIDEOS}
  for filename,video,second in FRAMES:
   output=IMAGES/filename
   command("ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(sources[video]),"-ss",str(second),"-frames:v","1","-q:v","3",str(output))
   if not output.exists() or output.stat().st_size<5000:raise RuntimeError("Frame not created: "+filename)
  clip=DOWNLOADS/"solidWhiteRight_8s.mp4"
  command("ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(sources["solidWhiteRight"]),"-t","8","-an","-c:v","libx264","-preset","veryfast","-crf","26","-pix_fmt","yuv420p","-movflags","+faststart",str(clip))
 for title,units,name in [
  ("# E01 · 道路图像处理 V2.0",E01,"E01_Image_Processing_V2.0.ipynb"),
  ("# E02 · 车道线检测 V2.0",E02,"E02_Lane_Detection_V2.0.ipynb")
 ]:
  (DOWNLOADS/name).write_text(json.dumps(build_notebook(title,units),ensure_ascii=False,indent=2),encoding="utf-8")
 # Notebook outputs are computed with the same Python/OpenCV code students download.
 execute_notebook(DOWNLOADS/"E01_Image_Processing_V2.0.ipynb")
 execute_notebook(DOWNLOADS/"E02_Lane_Detection_V2.0.ipynb")
 embed_student_images()
 (DOWNLOADS/"README.md").write_text(
  "E01/E02 探索式教学素材\n\n将完整 ZIP 解压。使用 Python+OpenCV+NumPy+Matplotlib 的 Jupyter/VS Code 打开 Notebook。Kaggle 请将 ZIP 解压后添加为 Dataset。\n"
  "视频为可选素材，不需要下载完整五段源视频。网页版 JavaScript 计算与 OpenCV 不保证逐像素一致。\n",encoding="utf-8")
 (DOWNLOADS/"ASSET_LICENSE.txt").write_text(
  "Teaching images from Udacity CarND-LaneLines-P1 and CarND-Advanced-Lane-Lines (MIT License, copyright Udacity Inc.).\n"
  "https://github.com/udacity/CarND-LaneLines-P1\nhttps://github.com/udacity/CarND-Advanced-Lane-Lines\n",encoding="utf-8")
 with ZipFile(DOWNLOADS/"MVAI_E01_E02_Labs.zip","w",ZIP_DEFLATED,compresslevel=6) as z:
  for p in [DOWNLOADS/"E01_Image_Processing_V2.0.ipynb",DOWNLOADS/"E02_Lane_Detection_V2.0.ipynb",DOWNLOADS/"README.md",DOWNLOADS/"ASSET_LICENSE.txt"]:
   z.write(p,p.name)
  for p in sorted(IMAGES.glob("*.jpg")):z.write(p,"images/"+p.name)
  z.write(clip,"videos/"+clip.name)
 print("Verified",len(list(IMAGES.glob("*.jpg"))),"frames and created two student notebooks and ZIP")

if __name__=="__main__":main()

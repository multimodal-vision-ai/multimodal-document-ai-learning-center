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


# Each core experiment includes an explicit exploratory markdown Cell and
# a runnable parameter comparison Cell, with plots retained after execution.
def add_student_exploration_cells():
    e01={
    "## 01":("""
### 探索任务 1 · HSV 阈值实验 Cell
先预测：调整黄色 H 范围时，车道线与背景会怎样变化？
1. 仅修改黄色色调下限 5、15、25。
2. 对比误检、漏检，记录颜色阈值的适用条件。
3. 思考白色天空为何可能被当成白线。""","""img=read('02_solidYellowLeft_yellow_white.jpg')
hsv=cv2.cvtColor(img,cv2.COLOR_BGR2HSV)
view([('Original',img)]+[(f'Yellow H from {lo}',cv2.inRange(hsv,(lo,70,70),(40,255,255))) for lo in (5,15,25)])"""),
    "## 02":("""
### 探索任务 2 · 阈值实验 Cell
先预测：全局阈值增大，车道标线是否一定更准确？
1. 固定素材，比较阈值 100、150、200。
2. 找到误检增加和细节丢失的位置。
3. 讨论阴影图像为何适用不同设置。""","""img=read('06_challenge_bright_pavement.jpg')
g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
view([('Original',img)]+[(f'Global {t}',cv2.threshold(g,t,255,cv2.THRESH_BINARY)[1]) for t in (100,150,200)])"""),
    "## 03":("""
### 探索任务 3 · 滤波实验 Cell
先预测：核越大，噪声减少的同时会发生什么？
1. 比较 Gaussian 核 3、5、9。
2. 观察标线边缘、道路纹理。
3. 解释过度平滑与边缘保留的矛盾。""","""img=read('08_harder_shadow_glare.jpg')
view([('Original',img)]+[(f'Gaussian {k}',cv2.GaussianBlur(img,(k,k),0)) for k in (3,5,9)])"""),
    "## 04":("""
### 探索任务 4 · 形态学实验 Cell
先预测：闭运算的核是否越大越好？
1. 比较 3×3、5×5、9×9。
2. 观察断裂是否连接、不同标线是否误合并。
3. 区分开运算和闭运算。""","""img=read('02_solidYellowLeft_yellow_white.jpg')
m=cv2.inRange(cv2.cvtColor(img,cv2.COLOR_BGR2HSV),(15,70,70),(40,255,255))
view([('Mask',m)]+[(f'Closing {k}',cv2.morphologyEx(m,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_RECT,(k,k)))) for k in (3,5,9)])"""),
    "## 05":("""
### 探索任务 5 · 透视变换实验 Cell
先预测：梯形顶边上移或下移，鸟瞰结果会怎样改变？
1. 修改顶部位置 0.50、0.56、0.62。
2. 比较畸变程度与视觉车道宽度。
3. 说明相机标定为何必要。""","""img=read('01_solidWhiteRight_straight_white.jpg')
h,w=img.shape[:2]
results=[('Original',img)]
for top in (.50,.56,.62):
    src=np.float32([[.39*w,top*h],[.61*w,top*h],[.96*w,.97*h],[.04*w,.97*h]])
    dst=np.float32([[.25*w,0],[.75*w,0],[.75*w,h-1],[.25*w,h-1]])
    results.append((f'Top {top}',cv2.warpPerspective(img,cv2.getPerspectiveTransform(src,dst),(w,h))))
view(results)""")
    }
    e02={
    "## 01":("""
### 探索任务 1 · Canny 参数实验 Cell
先预测：低阈值是不是越低越好？
1. 只改变阈值，比较道路内外边缘。
2. 观察标线断裂与车辆边缘。
3. 判断为何不能用边缘总数评价准确率。""","""img=read('01_solidWhiteRight_straight_white.jpg')
g=cv2.GaussianBlur(cv2.cvtColor(img,cv2.COLOR_BGR2GRAY),(5,5),1.2)
view([('Original',img)]+[(f'Canny {lo}/{hi}',cv2.Canny(g,lo,hi)) for lo,hi in ((30,90),(50,150),(100,200))])"""),
    "## 02":("""
### 探索任务 2 · ROI 感兴趣区域实验 Cell
先预测：ROI 变小会不会删除真正的远处标线？
1. 比较顶部比例 0.45、0.55、0.65。
2. 在弯道场景重复参数比较。
3. 解释固定 ROI 的视角限制。""","""img=read('01_solidWhiteRight_straight_white.jpg')
panels=[('Original',img)]
for top in (.45,.55,.65):
    _,roi,_,_=pipeline(img,top=top)
    panels.append((f'ROI {top}',roi))
view(panels)"""),
    "## 03":("""
### 探索任务 4 · 左右线段筛选实验 Cell
先预测：车辆干扰时，几何筛选是否可靠？
1. 比较直道和车辆干扰场景。
2. 记录错误候选与缺失边界。
3. 解释几何证据与真实道路标注的区别。""","""for title,name in [('Straight','01_solidWhiteRight_straight_white.jpg'),('Traffic','04_project_curve_traffic.jpg')]:
    img=read(name)
    _,_,overlay,lines=pipeline(img)
    print(title,'candidate segments:',len(lines))
    view([('Original',img),('Candidates',overlay)])"""),
    "## 04":("""
### 探索任务 5 · 九图参数泛化实验 Cell
先预测：固定参数能否同时适应直道、弯道和阴影？
1. 不改参数，找出两种失败场景。
2. 只修改 ROI 位置，观察一处改善、一处变差。
3. 讨论光照、曲率、遮挡对传统检测的影响。""","""for name in ('01_solidWhiteRight_straight_white.jpg','03_project_curve_intro.jpg','05_challenge_shadow_traffic.jpg'):
    img=read(name)
    panels=[('Original',img)]
    for top in (.45,.55,.65):
        _,_,overlay,lines=pipeline(img,top=top)
        panels.append((f'ROI {top}: {len(lines)}',overlay))
    view(panels)""")
    }
    names1={"## 01":"## 01 · 探索实验一：RGB / HSV 颜色空间",
            "## 02":"## 02 · 探索实验二：阈值方法",
            "## 03":"## 03 · 探索实验三：滤波与 CLAHE",
            "## 04":"## 04 · 探索实验四：形态学",
            "## 05":"## 05 · 探索实验五：透视变换"}
    names2={"## 01":"## 01 · 探索实验一：Canny 阈值",
            "## 02":"## 02 · 探索实验二：ROI 感兴趣区域",
            "## 03":"## 04 · 探索实验四：左右候选线筛选",
            "## 04":"## 05 · 探索实验五：固定参数九图泛化",
            "## 05":"## 06 · 连续视频（拓展）"}
    def augment(parts, tasks, rename, roi=False):
        result=[]
        pending=None
        for kind,body in parts:
            if kind=="md":
                key=next((k for k in rename if body.startswith(k)),None)
                if key:
                    body=rename[key]+(body[body.find("\n"):] if "\n" in body else "")
                pending=key if key in tasks else None
            result.append((kind,body))
            if kind=="code" and pending:
                prompt,code=tasks[pending]
                result.extend([("md",prompt),("code",code)])
                if roi and pending=="## 02":
                    result.extend([
                       ("md","## 03 · 探索实验三：Hough 变换\n先预测：线段候选数量越多，检测结果是否更好？"),
                       ("code","""img=read('01_solidWhiteRight_straight_white.jpg')
panels=[('Original',img)]
for votes in (15,25,45):
    _,_,overlay,lines=pipeline(img,votes=votes)
    panels.append((f'Hough votes {votes}: {len(lines)}',overlay))
view(panels)"""),
                       ("md","### 探索任务 3 · Hough 参数实验 Cell\n1. 比较投票阈值 15、25、45。\n2. 再修改最小线段长度和最大间隙。\n3. 找一个非车道线的候选，并解释原因。"),
                       ("code","""img=read('03_project_curve_intro.jpg')
panels=[('Original',img)]
for length,gap in ((20,30),(35,70),(70,100)):
    _,_,overlay,_=pipeline(img,length=length,gap=gap)
    panels.append((f'Length={length}, gap={gap}',overlay))
view(panels)""")
                    ])
                pending=None
        result.append(("md","## 总结与进一步探索\n1. 哪种参数变化产生了你未预期的输出？\n2. 哪些结论只在当前素材成立？\n3. 选择一个失败案例并说明可能的算法改进方向。"))
        return result
    E01[:]=augment(E01,e01,names1)
    E02[:]=augment(E02,e02,names2,roi=True)

add_student_exploration_cells()

# E02 video extension: execute the same per-frame classical pipeline.
VIDEO_CELL = r"""
from pathlib import Path
def find_video():
    options=[IMAGES.parent/"videos"/"solidWhiteRight_8s.mp4",
             IMAGES.parent/"downloads"/"solidWhiteRight_8s.mp4",
             Path.cwd()/"videos"/"solidWhiteRight_8s.mp4"]
    for p in options:
        if p.is_file(): return p
    kaggle=Path("/kaggle/input")
    if kaggle.exists():
        for p in kaggle.glob("**/solidWhiteRight_8s.mp4"): return p
    raise FileNotFoundError("未找到 E02 的 8 秒视频：请使用完整实验包")
cap=cv2.VideoCapture(str(find_video()))
if not cap.isOpened(): raise RuntimeError("无法读取教学视频")
fps=cap.get(cv2.CAP_PROP_FPS)
fps=fps if fps>1 else 25.0
path=Path.cwd()/"E02_lane_video_cv2.mp4"
w,h=640,360
out=cv2.VideoWriter(str(path),cv2.VideoWriter_fourcc(*"mp4v"),fps,(2*w,h))
if not out.isOpened():
    cap.release()
    raise RuntimeError("OpenCV 当前环境不支持 mp4v 编码")
examples=[]
count=0
while True:
    ok,frame=cap.read()
    if not ok:break
    original=cv2.resize(frame,(w,h))
    _,_,overlay,lines=pipeline(original)
    cv2.putText(overlay,f"Hough candidates: {len(lines)}",(12,26),
                cv2.FONT_HERSHEY_SIMPLEX,.65,(255,255,255),2)
    out.write(np.hstack((original,overlay)))
    if count%max(1,round(fps*2))==0 and len(examples)<4:
        examples.append((f"{count/fps:.1f} seconds",overlay.copy()))
    count+=1
cap.release()
out.release()
if count<2 or not path.is_file() or path.stat().st_size<10000:
    raise RuntimeError("没有生成有效的连续视频结果")
print(f"逐帧处理 {count} 帧，时长 {count/fps:.1f} 秒，视频文件：{path.name}")
view(examples)
"""
for idx,(kind,body) in enumerate(E02):
    if kind=="md" and body.startswith("## 06 · 连续视频"):
        E02[idx]=("md","## 06 · 连续视频（拓展）\n"
                 "将相同的 Canny、ROI、Hough 参数应用于整段视频，观察候选线变化与抖动。"
                 "本方法不包含时序跟踪。\n"
                 "**探索：** 哪些时间点的检测突然变化？可以怎样减少跨帧抖动？")
        E02.insert(idx+1,("code",VIDEO_CELL))
        break
else:
    raise RuntimeError("E02 06 章节缺失")

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
 for label,filename in (
  ("E01","E01_Image_Processing_V2.0.ipynb"),
  ("E02","E02_Lane_Detection_V2.0.ipynb")
 ):
  archive=DOWNLOADS/f"MVAI_{label}_Lab.zip"
  with ZipFile(archive,"w",ZIP_DEFLATED,compresslevel=6) as z:
   z.write(DOWNLOADS/filename,filename)
   for doc in ("README.md","ASSET_LICENSE.txt"):z.write(DOWNLOADS/doc,doc)
   for frame in sorted(IMAGES.glob("*.jpg")):z.write(frame,"images/"+frame.name)
   if label=="E02":z.write(clip,"videos/"+clip.name)
  print("Standalone",label,archive.stat().st_size)
 print("Verified",len(list(IMAGES.glob("*.jpg"))),"frames, explicit exploration cells and individual E01/E02 ZIPs")

if __name__=="__main__":main()

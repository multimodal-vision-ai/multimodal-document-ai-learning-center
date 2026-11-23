#!/usr/bin/env python3
"""Build the E03 student Notebook, verified video clips, figures and standalone ZIP.
Public Udacity source files are SHA256 checked; when available, local user
uploads can be supplied with MVAI_E03_VIDEO_SOURCE_DIR (same source hashes).
Run AFTER the existing E01/E02 resource stage in CI; does not touch their assets.
"""
from pathlib import Path
import os,hashlib,subprocess,tempfile,shutil,json,sys,base64
from urllib.request import urlopen,Request
from zipfile import ZipFile,ZIP_DEFLATED
import cv2
import nbformat
from nbclient import NotebookClient

ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'docs/resources/course-labs/intelligent-perception'
IMAGES=BASE/'images';VIDEOS=BASE/'videos';DOWN=BASE/'downloads'
ORIGINS={
 'straight':('CarND-LaneLines-P1','test_videos/solidWhiteRight.mp4','2d8e14b46fe89afbc8ad1f718685cf09b83e85a324095031c38186a9f0535417','solidWhiteRight.mp4'),
 'curve':('CarND-Advanced-Lane-Lines','project_video.mp4','651949922042c223375d40bf8929def97dbb62c6ade651d1f5b08eea47127d5f','project_video.mp4'),
 'complex':('CarND-Advanced-Lane-Lines','harder_challenge_video.mp4','45879f48cdc43e40771317a7d03c973cb4c45db47f145e28837d9610d121732c','harder_challenge_video.mp4'),
}
CLIPS={'straight':(0.,8.5),'curve':(25.,13.),'complex':(0.,15.)}
FRAME_NAMES={'straight':[(4.4,'01_solidWhiteRight_straight_white.jpg')],
             'curve':[(5.04,'03_project_curve_intro.jpg')],
             'complex':[(4.76,'07_harder_curve_motorcycle.jpg'),(14.36,'08_harder_shadow_glare.jpg'),(43.16,'09_harder_curve_shadow.jpg')]}

def ffmpeg_bin():
    executable=shutil.which('ffmpeg')
    if executable:return executable
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()
FFMPEG=ffmpeg_bin()

def execute(cmd):
    subprocess.run([str(x) for x in cmd],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)

def find_source(scene,temp):
    repo,path,sha,fn=ORIGINS[scene]
    local=Path(os.environ.get('MVAI_E03_VIDEO_SOURCE_DIR',''))
    candidates=[local/fn,local/fn.replace('.mp4','(1).mp4')]
    found=next((p for p in candidates if p.is_file()),None)
    if not found:
        found=temp/fn
        url=f'https://raw.githubusercontent.com/udacity/{repo}/master/{path}'
        with urlopen(Request(url,headers={'User-Agent':'MVAI-E03-Staging'}),timeout=180) as r,found.open('wb') as f:
            shutil.copyfileobj(r,f)
    digest=hashlib.sha256(found.read_bytes()).hexdigest()
    if digest!=sha:raise RuntimeError(f'E03 {scene} original SHA256 mismatch: {digest}')
    print(f'Verified E03 original {scene}: {found.stat().st_size} bytes')
    return found

def extract_frame(source,second,target):
    target.parent.mkdir(parents=True,exist_ok=True)
    execute([FFMPEG,'-hide_banner','-loglevel','error','-y','-ss',str(second),'-i',source,'-frames:v','1','-q:v','3',target])
    if target.stat().st_size<3000:raise RuntimeError(f'Invalid E03 frame {target}')

def capture_clips():
    for dest in (IMAGES,VIDEOS,DOWN):dest.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='mvai-e03-') as td:
        temp=Path(td)
        for scene in CLIPS:
            src=find_source(scene,temp)
            for sec,fn in FRAME_NAMES[scene]:
                out=IMAGES/fn
                if not out.is_file():extract_frame(src,sec,out)
            start,duration=CLIPS[scene]
            output=VIDEOS/f'E03_{scene}_input.mp4'
            execute([FFMPEG,'-hide_banner','-loglevel','error','-y','-ss',str(start),'-i',src,'-t',str(duration),
                     '-vf','fps=12,scale=640:360:flags=lanczos','-an','-c:v','libx264','-pix_fmt','yuv420p',
                     '-preset','veryfast','-crf','26','-movflags','+faststart',output])
            cap=cv2.VideoCapture(str(output))
            frames=int(cap.get(cv2.CAP_PROP_FRAME_COUNT));cap.release()
            if frames<30:raise RuntimeError('E03 clip too short: '+scene)
            print(f'E03 {scene}: {frames} frames at 640x360')
            # Chromium's bundled test build may not include H.264 codecs.
            # Keep MP4 for Notebook/offline use; publish VP8/WebM for browser playback.
            browser_video=VIDEOS/f'E03_{scene}_input.webm'
            execute([FFMPEG,'-hide_banner','-loglevel','error','-y','-i',output,'-an',
                     '-c:v','libvpx','-pix_fmt','yuv420p','-b:v','450k',
                     '-deadline','realtime','-cpu-used','5','-auto-alt-ref','0',browser_video])
            if browser_video.stat().st_size<5000:raise RuntimeError('E03 browser WebM is empty: '+scene)

def build_browser_image_bundle():
    """Embed the five teaching JPEGs as data URLs so Canvas can read pixels
    even when raw.githack redirects image requests across origins."""
    assets={}
    for frames in FRAME_NAMES.values():
        for _,filename in frames:
            source=IMAGES/filename
            if not source.is_file() or source.stat().st_size<3000:
                raise RuntimeError(f'Missing E03 browser image asset: {source}')
            encoded=base64.b64encode(source.read_bytes()).decode('ascii')
            assets[filename]='data:image/jpeg;base64,'+encoded
    target=BASE/'interactive'/'e03-image-assets.js'
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(
        'window.E03_IMAGE_DATA = Object.freeze('+json.dumps(assets,separators=(',',':'))+');\\n',
        encoding='utf-8'
    )
    print(f'E03 browser image bundle: {len(assets)} origin-clean JPEGs, {target.stat().st_size} bytes')

def m(txt):return nbformat.v4.new_markdown_cell(txt)
def c(code):return nbformat.v4.new_code_cell(code)

def build_notebook():
    core=(ROOT/'scripts/course_labs/e03_core.py').read_text(encoding='utf-8')
    env='''from pathlib import Path
import cv2, numpy as np, matplotlib.pyplot as plt
from matplotlib import font_manager
from IPython.display import display, Video
from zipfile import ZipFile
# Local WSL/Jupyter/VS Code and Kaggle dataset layout.
def locate_e03():
    base=Path.cwd()
    for root in (base,base.parent,Path('/kaggle/input')):
        if not root.exists(): continue
        if (root/'images/01_solidWhiteRight_straight_white.jpg').is_file() and (root/'videos/E03_straight_input.mp4').is_file():return root
        if root == Path('/kaggle/input'):
            for file in root.glob('**/videos/E03_straight_input.mp4'):
                maybe=file.parent.parent
                if (maybe/'images/01_solidWhiteRight_straight_white.jpg').exists():return maybe
    raise FileNotFoundError('请完整解压 MVAI_E03_Lab.zip，确保 images/ 与 videos/ 位于 Notebook 同级')
DATA=locate_e03()
OUTPUT=Path.cwd()/'e03_outputs';OUTPUT.mkdir(exist_ok=True)
# Prefer actual installed CJK glyph fonts. Never suppress missing-glyph warnings:
# if no suitable font is installed (for example on Kaggle), use readable
# English captions while keeping the Notebook instructions in Chinese.
_candidates=('Noto Sans CJK SC','Source Han Sans SC','Microsoft YaHei',
             'SimHei','PingFang SC','WenQuanYi Micro Hei','Noto Sans CJK JP',
             'Noto Serif CJK JP')
_found={f.name for f in font_manager.fontManager.ttflist}
PLOT_CJK_FONT=next((f for f in _candidates if f in _found),None)
if PLOT_CJK_FONT:
    plt.rcParams['font.sans-serif']=[PLOT_CJK_FONT,'DejaVu Sans']
    plt.rcParams['axes.unicode_minus']=False
else:
    print('No CJK Matplotlib font: using readable English chart captions.')
def safe_caption(text):
    if PLOT_CJK_FONT:return text
    captions={
        '复杂连续弯道':'Complex curves','复杂弯道原图':'Complex curve input',
        '普通弯道':'Curved road','直道':'Straight road',
        '真实道路':'Original road','顶边宽度倍率':'Top-width scale',
        '顶边':'Top edge','鸟瞰掩膜':'Bird-eye mask','鸟瞰':'Bird-eye view',
        '原图':'Original','滑动窗口':'Sliding windows','候选':'candidates',
        '曲线':'curve','窗口数':'Windows',
        '强光/树影原图':'Glare/shadow input','组合掩膜':'Combined mask',
        '白线':'White line','黄线':'Yellow line','梯度':'gradient',
        '树影复杂场景':'Tree shadows','未增强':'Original mask',
        '拟合有效':'Fit valid', '无效':'Invalid',
    }
    for zh,en in captions.items():text=text.replace(zh,en)
    import re
    return re.sub(r'[\u3400-\u9fff]+','',text).strip() or 'Road scene'
def read_image(name):
    img=cv2.imread(str(DATA/'images'/name))
    if img is None:raise FileNotFoundError(name)
    return cv2.resize(img,(640,360))
def panels(items,cols=3,size=(5.0,3.6)):
    # Four panels work better as a 2x2 grid on the student reading page.
    cols=2 if len(items)==4 else min(cols,3)
    rows=(len(items)+cols-1)//cols
    fig,axes=plt.subplots(rows,cols,figsize=(cols*size[0],rows*size[1]))
    for ax in np.atleast_1d(axes).ravel():ax.axis('off')
    for ax,(title,img) in zip(np.atleast_1d(axes).ravel(),items):
        ax.imshow(img if img.ndim==2 else cv2.cvtColor(img,cv2.COLOR_BGR2RGB))
        ax.set_title(safe_caption(title),fontsize=12,pad=9)
        ax.axis('off')
    plt.tight_layout(pad=1.5);plt.show()
print('E03 DATA:',DATA,'OpenCV',cv2.__version__)'''
    cells=[m('''# E03 · 复杂道路车道检测（探索式 Notebook V1.0）
**学生实验：四项核心探索 + 三段真实道路视频。** 先预测、每次只改变一个变量、观察真实图像、解释失败。  
本 Notebook 不依赖 GPU 或模型训练。所有拟合都是未标注的几何候选，不是人工 Ground Truth。'''),
           m('## 00 · 环境和真实视频素材\n直道、普通弯道、复杂连续弯道素材均来自 Udacity CarND 项目；原始文件有 SHA256 校验。'),c(env),c(core),
           m('''## 01 · 探索一：道路透视与鸟瞰变换
**先预测：** 改变透视梯形顶部高度，会保留更多道路还是引入更多非车道区域？
1. 固定顶边宽度，仅比较顶边高度比例 0.50 / 0.56 / 0.62。
2. 固定高度，再比较顶边宽度；换到急弯观察裁剪失效。
3. 思考：鸟瞰图是否等于经过相机标定的真实地面几何？'''),
           c('''img=read_image('03_project_curve_intro.jpg')
results=[('真实道路',img)]
for shift in (-.11,-.05,.01):
    bird,M,Minv,src=perspective(img,'curve',top_shift=shift)
    draw=img.copy();cv2.polylines(draw,[np.int32(src)],True,(50,120,255),3)
    results.extend([(f'顶边 y={.61+shift:.2f}',draw),(f'鸟瞰 y={.61+shift:.2f}',bird)])
panels(results,cols=4)'''),
           c('''img=read_image('07_harder_curve_motorcycle.jpg')
panels([('复杂弯道原图',img)]+[(f'顶边宽度倍率 {1+x:.1f}',perspective(img,'complex',width_shift=x)[0]) for x in (-.3,0,.3)],cols=4)'''),
           m('''## 02 · 探索二：从 Hough 直线到曲线拟合
**先预测：** 将滑动窗口加宽，能否避免急弯漏检？会不会同时抓到护栏和阴影？
1. 对比 E02 Hough、鸟瞰掩膜、滑动窗口与二次曲线。
2. 只修改窗口数量 6 / 9 / 12，比较候选像素和有效性。
3. 解释二次曲线、分段曲线与连续 S 形转向的关系；拟合平滑不代表检测正确。'''),
           c('''img=read_image('03_project_curve_intro.jpg')
e02,n,roi=e02_hough(img)
e03,fit,steps=e03_detect(img,'curve')
search=steps['bird'].copy()
for x1,y1,x2,y2,side in fit['boxes']:
    cv2.rectangle(search,(x1,y1),(x2,y2),(0,180,255) if side=='left' else (255,200,0),1)
panels([('原图',img),(f'E02 Hough 候选 {n}',e02),('鸟瞰掩膜',steps['mask']),('滑动窗口',search),(f'E03 曲线: {fit["status"]}',e03)],cols=3)
print('候选像素 (左/右):',fit['left_pixels'],fit['right_pixels'],'拟合有效:',fit['valid'])'''),
           c('''img=read_image('07_harder_curve_motorcycle.jpg')
results=[('复杂弯道原图',img)]
for nw in (6,9,12):
    out,fit,_=e03_detect(img,'complex',nwindows=nw)
    results.append((f'窗口数 {nw} / {fit["status"]}',out))
panels(results,cols=4)'''),
           m('''## 03 · 探索三：阴影、强光与标线提取
**先预测：** 降低亮度阈值一定能找回阴影里的白线吗？
1. 在同一图上仅修改 HLS 白线亮度阈值 170 / 200 / 230。
2. 比较黄色掩膜、Sobel 梯度和组合掩膜；观察树影和路面反光。
3. 尝试 CLAHE，讨论增加纹理噪声的副作用。'''),
           c('''img=read_image('08_harder_shadow_glare.jpg')
results=[('强光/树影原图',img)]
for lum in (170,200,230):
    wm,ym,gm,combo=lane_masks(img,l_min=lum)
    results.append((f'组合掩膜 L_min={lum}',combo))
wm,ym,gm,combo=lane_masks(img,l_min=200)
results.extend([('白线候选',wm),('黄线候选',ym),('Sobel 梯度',gm),('组合掩膜',combo)])
panels(results,cols=4)'''),
           c('''img=read_image('09_harder_curve_shadow.jpg')
base=lane_masks(img,clahe=False)[-1]
strong=lane_masks(img,clahe=True)[-1]
panels([('树影复杂场景',img),('未增强',base),('CLAHE',strong)],cols=3)'''),
           m('''## 04 · 探索四：连续帧、时序稳定性与延迟
**先预测：** EMA 系数越小，车道曲线是否总是更准确？
1. 比较 α=1.00、0.60、0.25 对同一帧序列的位置变化。
2. 分析拟合失效时，为什么不能永远沿用上一帧。
3. 区分“位置变化波动”与“有 Ground Truth 的准确率”。'''),
           c('''# 从真实输入视频提取连续帧，用三种 EMA 系数重跑同一算法。
cap=cv2.VideoCapture(str(DATA/'videos/E03_complex_input.mp4'))
frames=[]
while len(frames)<45:
    ok,f=cap.read()
    if not ok:break
    frames.append(f)
cap.release()
series={}
for alpha in (1.,.6,.25):
    track=LaneTracker(alpha=alpha,max_missing=3)
    scores=[]
    for f in frames:
        _,fit,_=e03_detect(f,'complex',tracker=track)
        scores.append(float(fit['bottom_x']) if fit['bottom_x'] is not None else np.nan)
    series[alpha]=scores
plt.figure(figsize=(11,3.3))
for alpha,values in series.items():plt.plot(np.arange(len(values))/12,values,label=f'alpha={alpha}')
plt.xlabel('Video time (s)');plt.ylabel('Uncalibrated x-coordinate (pixel)');plt.legend();plt.grid(alpha=.25);plt.show()
print('仅为检测输出的连续性对照；不是检测准确率。')'''),
           m('''## 05 · 三场景综合展示：真实视频 × E02 × E03
三路画面使用相同源帧：**原始视频 / E02 原始 Canny-Hough 候选 / E03 鸟瞰曲线拟合与 EMA**。
直道检测应尽量保持原有能力；弯道关注实际拟合误差；复杂弯道保留检测失败及恢复，不修饰结果。视频会在当前工作目录 `e03_outputs/` 中产生，可用于课堂播放。'''),
           c('''from pathlib import Path
from IPython.display import Video,display
import shutil,subprocess
ffmpeg=shutil.which('ffmpeg')
if not ffmpeg:
    import imageio_ffmpeg
    ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
summary={}
tracks={'scenes':{}}
for scene,label in [('straight','直道'),('curve','普通弯道'),('complex','复杂连续弯道')]:
    cap=cv2.VideoCapture(str(DATA/'videos'/f'E03_{scene}_input.mp4'))
    if not cap.isOpened():raise RuntimeError(f'无法读取 {scene}')
    fps=cap.get(cv2.CAP_PROP_FPS) or 12.
    ok,first=cap.read()
    if not ok:raise RuntimeError('视频为空: '+scene)
    h,w=first.shape[:2]
    rawpath=OUTPUT/f'raw_{scene}.mp4'
    writer=cv2.VideoWriter(str(rawpath),cv2.VideoWriter_fourcc(*'mp4v'),fps,(3*480,270))
    if not writer.isOpened():raise RuntimeError('OpenCV mp4v encoder unavailable')
    cap.set(cv2.CAP_PROP_POS_FRAMES,0)
    track=LaneTracker(alpha=.6,max_missing=3)
    stats=[];saved=[]
    track_scene={'fps':float(fps),'width':int(w),'height':int(h),'Minv':None,'probes':[.38,.62,.91],'frames':[]}
    while True:
        ok,frame=cap.read()
        if not ok:break
        raw=resized(frame); old,n,_=e02_hough(raw); new,info,steps=e03_detect(raw,scene,tracker=track)
        track_scene['Minv']=steps['Minv'];track_scene['probes']=steps['probes']
        pieces=[]
        for picture,name in [(raw,'Raw input'),(old,'E02 Canny + Hough'),(new,'E03 curve + EMA')]:
            panel=cv2.resize(picture,(480,270),interpolation=cv2.INTER_AREA)
            cv2.rectangle(panel,(0,0),(480,26),(18,34,48),-1)
            cv2.putText(panel,name,(10,19),cv2.FONT_HERSHEY_SIMPLEX,.55,(255,255,255),1,cv2.LINE_AA)
            pieces.append(panel)
        writer.write(np.hstack(pieces))
        frame_time=round(len(stats)/fps,3)
        stats.append({'time':frame_time,'e02_candidates':n,'valid':bool(info['valid']),
                     'status':info['status'],'x':info['bottom_x']})
        track_scene['frames'].append({'time':frame_time,'valid':bool(info['valid']),'status':info['status'],
            'left_x':np.asarray(info['left_x'],dtype=float).tolist() if info['valid'] else None,
            'right_x':np.asarray(info['right_x'],dtype=float).tolist() if info['valid'] else None,
            'bottom_x':info['bottom_x']})
        if len(stats) in (1,round(fps*3),round(fps*7)):
            saved.append((f'{label} t={len(stats)/fps:.1f}s {info["status"]}',new.copy()))
    cap.release();writer.release()
    filename=OUTPUT/f'E03_{scene}_compare.mp4'
    subprocess.run([ffmpeg,'-y','-hide_banner','-loglevel','error','-i',str(rawpath),'-an','-c:v','libx264',
                    '-pix_fmt','yuv420p','-preset','veryfast','-crf','27','-movflags','+faststart',str(filename)],check=True)
    rawpath.unlink()
    summary[scene]=stats;tracks['scenes'][scene]=track_scene
    print(f'{label}: {len(stats)} frames; valid {sum(s["valid"] for s in stats)}/{len(stats)}; video {filename.name}')
    panels(saved,cols=3)
    display(Video(filename=str(filename),embed=False,width=720))
(OUTPUT/'E03_diagnostics.json').write_text(__import__('json').dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
(OUTPUT/'E03_tracks.json').write_text(__import__('json').dumps(tracks,ensure_ascii=False,separators=(',',':')),encoding='utf-8')'''),
           m('''## 06 · 综合观察与思考
- 哪个场景中 E02 与 E03 的区别最明显？有没有 E03 比 E02 更差的帧？
- 有效帧比例和时序平滑程度，为什么不等于人工 Ground Truth 准确率？
- 有车辆遮挡、标线缺失或道路边线误选时，应继续绘制还是明确报告失效？
- 小结四项探索的适用条件与失败原因。''')]
    nb=nbformat.v4.new_notebook(cells=cells,metadata={'kernelspec':{'name':'python3','display_name':'Python 3','language':'python'},'language_info':{'name':'python'},'mvai_course':'E03'})
    return nb

def execute_notebook():
    path=DOWN/'E03_Complex_Lane_Detection_V1.0.ipynb'
    nb=build_notebook()
    with tempfile.TemporaryDirectory(prefix='mvai-e03-run-') as td:
        # execute in downloads directory to match student ZIP folder layout.
        client=NotebookClient(nb,timeout=900,kernel_name='python3',resources={'metadata':{'path':str(DOWN)}})
        nb=client.execute()
    nbformat.write(nb,path)
    images=sum(sum('image/png' in (out.get('data') or {}) for out in c.get('outputs',[])) for c in nb.cells if c.cell_type=='code')
    if images<8:raise RuntimeError(f'E03 only generated {images} image outputs')
    out_dir=DOWN/'e03_outputs'
    data=json.loads((out_dir/'E03_diagnostics.json').read_text(encoding='utf-8'))
    track_data=json.loads((out_dir/'E03_tracks.json').read_text(encoding='utf-8'))
    if set(track_data.get('scenes',{}))!=set(CLIPS):raise RuntimeError('E03 per-frame geometry is incomplete')
    shutil.copy2(out_dir/'E03_tracks.json',DOWN/'E03_tracks.json')
    for scene in CLIPS:
        source=out_dir/f'E03_{scene}_compare.mp4'
        target=DOWN/f'E03_{scene}_compare.mp4'
        if not source.is_file() or source.stat().st_size<15000:raise RuntimeError(f'No video {source}')
        shutil.copy2(source,target)
        execute([FFMPEG,'-hide_banner','-loglevel','error','-i',target,'-f','null','-'])
        print('Verified E03 video',target.name,target.stat().st_size)
        e02_target=DOWN/f'E03_{scene}_e02.mp4'
        execute([FFMPEG,'-hide_banner','-loglevel','error','-y','-i',target,'-vf','crop=480:270:480:0',
                 '-an','-c:v','libx264','-pix_fmt','yuv420p','-preset','veryfast','-crf','27',
                 '-movflags','+faststart',e02_target])
        execute([FFMPEG,'-hide_banner','-loglevel','error','-i',e02_target,'-f','null','-'])
        print('Verified E02 reference clip',e02_target.name,e02_target.stat().st_size)
        e02_webm=DOWN/f'E03_{scene}_e02.webm'
        execute([FFMPEG,'-hide_banner','-loglevel','error','-y','-i',e02_target,'-an',
                 '-c:v','libvpx','-pix_fmt','yuv420p','-b:v','450k',
                 '-deadline','realtime','-cpu-used','5','-auto-alt-ref','0',e02_webm])
        if e02_webm.stat().st_size<5000:raise RuntimeError('E03 E02 browser WebM is empty: '+scene)
        execute([FFMPEG,'-hide_banner','-loglevel','error','-i',e02_webm,'-f','null','-'])
    (DOWN/'E03_diagnostics.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    print('Notebook real PNG outputs:',images)

def package():
    (DOWN/'E03_README.md').write_text(
        '# E03 复杂道路车道检测\n\n将 ZIP 解压后使用 Jupyter/VS Code 打开唯一标准 Notebook，按顺序运行 Cell。'
        'Kaggle: 上传解压后的整个目录为 Dataset，并把 Notebook 同时放入工作区。'
        '依赖：opencv-python、numpy、matplotlib、IPython、nbclient（仅站点构建）。'
        '\n视频采用 12 FPS、640×360 的真实 Udacity 原视频切片，无需下载完整数据集。'
        '浏览器交互是教学近似实现，不保证逐像素等于 OpenCV。\n',encoding='utf-8')
    (DOWN/'E03_ASSET_LICENSE.txt').write_text('Udacity CarND-LaneLines-P1 and CarND-Advanced-Lane-Lines, MIT license; source SHA256 in stage_e03.py.\nhttps://github.com/udacity/CarND-LaneLines-P1\nhttps://github.com/udacity/CarND-Advanced-Lane-Lines\n',encoding='utf-8')
    target=DOWN/'MVAI_E03_Lab.zip'
    with ZipFile(target,'w',ZIP_DEFLATED,compresslevel=6) as z:
        for fn in ('E03_Complex_Lane_Detection_V1.0.ipynb','E03_README.md','E03_ASSET_LICENSE.txt'):
            z.write(DOWN/fn,fn)
        for frames in FRAME_NAMES.values():
            for _,fn in frames:z.write(IMAGES/fn,'images/'+fn)
        for scene in CLIPS:
            z.write(VIDEOS/f'E03_{scene}_input.mp4',f'videos/E03_{scene}_input.mp4')
            z.write(VIDEOS/f'E03_{scene}_input.webm',f'videos/E03_{scene}_input.webm')
            z.write(DOWN/f'E03_{scene}_compare.mp4',f'outputs/E03_{scene}_compare.mp4')
        z.write(DOWN/'E03_diagnostics.json','outputs/E03_diagnostics.json')
        z.write(DOWN/'E03_tracks.json','outputs/E03_tracks.json')
        for scene in CLIPS:z.write(DOWN/f'E03_{scene}_e02.mp4',f'outputs/E03_{scene}_e02.mp4')
        for scene in CLIPS:z.write(DOWN/f'E03_{scene}_e02.webm',f'outputs/E03_{scene}_e02.webm')
    print('E03 ZIP:',target.stat().st_size)

if __name__=='__main__':
    capture_clips();build_browser_image_bundle();execute_notebook();package()
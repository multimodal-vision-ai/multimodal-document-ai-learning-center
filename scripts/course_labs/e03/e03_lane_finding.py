"""MVAI E03 V2.0: traditional OpenCV lane-finding teaching pipeline."""
from pathlib import Path
import cv2
cv2.setNumThreads(2)
import numpy as np

BOARD_SIZE=(9,6)
DEFAULT_SRC=np.float32([[585,460],[203,719],[1127,719],[695,460]])
DEFAULT_DST=np.float32([[320,0],[320,719],[960,719],[960,0]])

def calibrate_camera(image_paths,board_size=BOARD_SIZE):
    obj=np.zeros((board_size[0]*board_size[1],3),np.float32)
    obj[:,:2]=np.mgrid[0:board_size[0],0:board_size[1]].T.reshape(-1,2)
    objects,images,detected,failed=[],[],[],[]
    for path in sorted(map(Path,image_paths)):
        im=cv2.imread(str(path))
        if im is None: failed.append((path.name,"read_failed")); continue
        h,w=im.shape[:2]
        if (w,h)==(1281,721): im=im[:720,:1280]
        elif (w,h)!=(1280,720): im=cv2.resize(im,(1280,720),interpolation=cv2.INTER_AREA)
        gray=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
        found,corners=cv2.findChessboardCornersSB(gray,board_size) if hasattr(cv2,"findChessboardCornersSB") else (False,None)
        if not found:
            found,corners=cv2.findChessboardCorners(gray,board_size,cv2.CALIB_CB_ADAPTIVE_THRESH|cv2.CALIB_CB_NORMALIZE_IMAGE)
            if found: corners=cv2.cornerSubPix(gray,corners,(11,11),(-1,-1),(cv2.TERM_CRITERIA_EPS+cv2.TERM_CRITERIA_MAX_ITER,30,.001))
        if found: objects.append(obj.copy()); images.append(corners.astype(np.float32)); detected.append(path.name)
        else: failed.append((path.name,"corners_not_found"))
    if len(objects)<8: raise RuntimeError(f"Insufficient calibration views: {len(objects)}")
    rms,mtx,dist,_,_=cv2.calibrateCamera(objects,images,(1280,720),None,None)
    return {"rms":float(rms),"mtx":mtx,"dist":dist,"detected":detected,"failed":failed,"image_size":(1280,720),"views":len(detected)}

def undistort(image,calibration,alpha=0.0):
    h,w=image.shape[:2]; m=np.asarray(calibration["mtx"],dtype=np.float64).copy()
    bw,bh=calibration.get("image_size",(1280,720)); m[0,:]*=w/bw; m[1,:]*=h/bh
    new,roi=cv2.getOptimalNewCameraMatrix(m,calibration["dist"],(w,h),float(alpha),(w,h))
    out=cv2.undistort(image,m,calibration["dist"],None,new)
    x,y,rw,rh=roi
    if alpha<=0 and rw>0 and rh>0: out=cv2.resize(out[y:y+rh,x:x+rw],(w,h))
    return out

def threshold_lane_pixels(image,params=None):
    p={"yellow_h":(12,38),"yellow_s":(70,255),"yellow_l":(65,255),"white_l":175,"white_s_max":120,"sobel_kernel":3,"grad_thresh":(18,120)}
    if params:p.update(params)
    hls=cv2.cvtColor(image,cv2.COLOR_BGR2HLS); h,l,s=cv2.split(hls)
    yellow=(h>=p["yellow_h"][0])&(h<=p["yellow_h"][1])&(s>=p["yellow_s"][0])&(s<=p["yellow_s"][1])&(l>=p["yellow_l"][0])&(l<=p["yellow_l"][1])
    white=(l>=p["white_l"])&(s<=p["white_s_max"])
    gray=cv2.cvtColor(image,cv2.COLOR_BGR2GRAY); sobel=np.abs(cv2.Sobel(gray,cv2.CV_64F,1,0,ksize=int(p["sobel_kernel"])))
    scale=np.uint8(np.clip(sobel*255/max(float(sobel.max()),1),0,255))
    grad=(scale>=p["grad_thresh"][0])&(scale<=p["grad_thresh"][1])
    binary=((yellow|white)|(grad&(l>=70))).astype(np.uint8)*255
    binary=cv2.morphologyEx(binary,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_RECT,(3,3)))
    return {"hls":hls,"h":h,"l":l,"s":s,"sobel_x":scale,"yellow_mask":yellow.astype(np.uint8)*255,"white_mask":white.astype(np.uint8)*255,"gradient_mask":grad.astype(np.uint8)*255,"binary":binary}

def perspective_matrices(shape,src=None,dst=None):
    h,w=shape[:2]; src=DEFAULT_SRC.copy() if src is None else np.asarray(src,np.float32).copy(); dst=DEFAULT_DST.copy() if dst is None else np.asarray(dst,np.float32).copy()
    src[:,0]*=w/1280; src[:,1]*=h/720; dst[:,0]*=w/1280; dst[:,1]*=h/720
    return cv2.getPerspectiveTransform(src,dst),cv2.getPerspectiveTransform(dst,src),src,dst

def sliding_window_search(binary,nwindows=9,margin=100,minpix=50):
    h,w=binary.shape; hist=np.sum(binary[h//2:,:]>0,axis=0); mid=w//2
    lx0=int(np.argmax(hist[:mid])); rx0=int(np.argmax(hist[mid:])+mid)
    yy,xx=binary.nonzero(); wh=max(1,h//nwindows); li=[];ri=[];windows=[];lc,rc=lx0,rx0
    for win in range(nwindows):
        y0=h-(win+1)*wh;y1=h-win*wh; a,b=lc-margin,lc+margin;c,d=rc-margin,rc+margin
        il=((yy>=y0)&(yy<y1)&(xx>=a)&(xx<b)).nonzero()[0]; ir=((yy>=y0)&(yy<y1)&(xx>=c)&(xx<d)).nonzero()[0]
        li.append(il);ri.append(ir);windows.append((a,y0,b,y1,c,d))
        if len(il)>minpix:lc=int(np.mean(xx[il]))
        if len(ir)>minpix:rc=int(np.mean(xx[ir]))
    li=np.concatenate(li) if li else np.array([],int);ri=np.concatenate(ri) if ri else np.array([],int)
    return {"leftx":xx[li],"lefty":yy[li],"rightx":xx[ri],"righty":yy[ri],"windows":windows,"histogram":hist,"nonzerox":xx,"nonzeroy":yy}

def search_around_poly(binary,left_fit,right_fit,margin=90):
    yy,xx=binary.nonzero(); li=np.abs(xx-np.polyval(left_fit,yy))<=margin;ri=np.abs(xx-np.polyval(right_fit,yy))<=margin
    return {"leftx":xx[li],"lefty":yy[li],"rightx":xx[ri],"righty":yy[ri],"windows":[],"histogram":np.sum(binary[binary.shape[0]//2:]>0,axis=0),"nonzerox":xx,"nonzeroy":yy}

def fit_lane_pixels(search,shape,expected_width=640):
    h,w=shape[:2];lx,ly=search["leftx"],search["lefty"];rx,ry=search["rightx"],search["righty"]
    if len(lx)<120 or len(rx)<120:return {"valid":False,"reason":"候选像素不足","left_count":len(lx),"right_count":len(rx)}
    lf=np.polyfit(ly,lx,2);rf=np.polyfit(ry,rx,2);py=np.linspace(0,h-1,h);lpx=np.polyval(lf,py);rpx=np.polyval(rf,py);width=rpx-lpx
    med=float(np.median(width[int(h*.55):]));std=float(np.std(width[int(h*.55):]));ok=bool(np.all(width[int(h*.55):]>0)) and .48*expected_width*w/1280<=med<=1.55*expected_width*w/1280 and std<=150
    return {"valid":ok,"reason":"通过几何检查" if ok else "左右边界几何关系异常","left_fit":lf,"right_fit":rf,"left_fitx":lpx,"right_fitx":rpx,"ploty":py,"left_count":len(lx),"right_count":len(rx),"lane_width_median_px":med,"lane_width_std_px":std,"left_residual_px":float(np.sqrt(np.mean((lx-np.polyval(lf,ly))**2))),"right_residual_px":float(np.sqrt(np.mean((rx-np.polyval(rf,ry))**2))),"search":search}

def curvature_and_offset(fit,shape,lane_width_m=3.7,road_length_m=30.0):
    h,w=shape[:2]; ym=road_length_m/h; xm=lane_width_m/(640*w/1280)
    y=np.max(fit["ploty"])*ym; lf=np.polyfit(fit["ploty"]*ym,fit["left_fitx"]*xm,2);rf=np.polyfit(fit["ploty"]*ym,fit["right_fitx"]*xm,2)
    def radius(a,b): return ((1+(2*a*y+b)**2)**1.5/abs(2*a)) if abs(a)>1e-9 else float("inf")
    center=(np.polyval(lf,y)+np.polyval(rf,y))/2; offset=(w/2*xm)-center
    return {"left_curvature_m":radius(*lf[:2]),"right_curvature_m":radius(*rf[:2]),"mean_curvature_m":float(np.mean([radius(*lf[:2]),radius(*rf[:2])])),"vehicle_offset_m":float(offset),"scale_assumption":{"lane_width_m":lane_width_m,"road_length_m":road_length_m}}

class LaneTracker:
    def __init__(self,use_ema=True,ema_alpha=.25,nwindows=9,margin=100,minpix=50,search_margin=90):
        self.use_ema=use_ema;self.ema_alpha=ema_alpha;self.nwindows=nwindows;self.margin=margin;self.minpix=minpix;self.search_margin=search_margin;self.previous_left=None;self.previous_right=None;self.failed_frames=0;self._maps_key=None;self._perspective_key=None
    def _undistort_frame(self,frame,cal):
        h,w=frame.shape[:2];base=cal.get("image_size",(1280,720));m=np.asarray(cal["mtx"],np.float64).copy();m[0,:]*=w/base[0];m[1,:]*=h/base[1]
        key=(h,w,tuple(m.ravel()),tuple(np.asarray(cal["dist"]).ravel()))
        if key!=self._maps_key:
            new,_=cv2.getOptimalNewCameraMatrix(m,cal["dist"],(w,h),0,(w,h));self._map_x,self._map_y=cv2.initUndistortRectifyMap(m,cal["dist"],None,new,(w,h),cv2.CV_32FC1);self._maps_key=key
        return cv2.remap(frame,self._map_x,self._map_y,cv2.INTER_LINEAR)
    def process(self,frame,cal,threshold_params=None,src=None,dst=None):
        und=self._undistort_frame(frame,cal);st=threshold_lane_pixels(und,threshold_params);key=(und.shape[:2],None if src is None else tuple(np.asarray(src).ravel()),None if dst is None else tuple(np.asarray(dst).ravel()))
        if key!=self._perspective_key:self._perspective_matrix,self._perspective_inverse,_,_=perspective_matrices(und.shape,src,dst);self._perspective_key=key
        warped=cv2.warpPerspective(st["binary"],self._perspective_matrix,(und.shape[1],und.shape[0]),flags=cv2.INTER_NEAREST);mode="sliding_window";search=None
        if self.previous_left is not None and self.failed_frames==0:
            search=search_around_poly(warped,self.previous_left,self.previous_right,self.search_margin)
            if len(search["leftx"])>=120 and len(search["rightx"])>=120:mode="previous_curve"
            else:search=None
        if search is None:search=sliding_window_search(warped,self.nwindows,self.margin,self.minpix)
        fit=fit_lane_pixels(search,warped.shape)
        if not fit["valid"] and mode=="previous_curve":search=sliding_window_search(warped,self.nwindows,self.margin,self.minpix);fit=fit_lane_pixels(search,warped.shape);mode="sliding_fallback"
        if fit["valid"]:
            lf,rf=fit["left_fit"],fit["right_fit"]
            if self.use_ema and self.previous_left is not None and self.failed_frames==0:
                a=self.ema_alpha;lf=a*lf+(1-a)*self.previous_left;rf=a*rf+(1-a)*self.previous_right;fit["left_fit"],fit["right_fit"]=lf,rf;fit["left_fitx"]=np.polyval(lf,fit["ploty"]);fit["right_fitx"]=np.polyval(rf,fit["ploty"])
            self.previous_left,self.previous_right=lf.copy(),rf.copy();self.failed_frames=0;metrics=curvature_and_offset(fit,warped.shape);output=self.render(und,fit,self._perspective_inverse,metrics)
        else:
            self.failed_frames+=1;metrics=None;output=und.copy();cv2.putText(output,"Lane detection: NOT RELIABLE",(28,44),cv2.FONT_HERSHEY_SIMPLEX,.8,(0,0,255),2,cv2.LINE_AA);cv2.putText(output,fit["reason"],(28,76),cv2.FONT_HERSHEY_SIMPLEX,.55,(0,0,255),1,cv2.LINE_AA)
        fit.update({"search_mode":mode,"stages":st,"warped":warped,"undistorted":und,"output":output,"metrics":metrics});return fit
    @staticmethod
    def render(und,fit,inverse,metrics):
        h,w=und.shape[:2];py=fit["ploty"];left=np.column_stack((fit["left_fitx"],py)).astype(np.int32);right=np.column_stack((fit["right_fitx"],py)).astype(np.int32)[::-1];poly=np.vstack((left,right));overlay=np.zeros_like(und);cv2.fillPoly(overlay,[poly],(30,190,80));lane=cv2.warpPerspective(overlay,inverse,(w,h));out=cv2.addWeighted(und,1,lane,.28,0)
        lo=cv2.perspectiveTransform(left.astype(np.float32).reshape(-1,1,2),inverse).astype(np.int32);ro=cv2.perspectiveTransform(right[::-1].astype(np.float32).reshape(-1,1,2),inverse).astype(np.int32)
        cv2.polylines(out,[lo],False,(255,210,30),7,cv2.LINE_AA);cv2.polylines(out,[ro],False,(255,210,30),7,cv2.LINE_AA)
        cv2.putText(out,f"Radius: {metrics['mean_curvature_m']:,.0f} m",(28,42),cv2.FONT_HERSHEY_SIMPLEX,.72,(20,60,30),2,cv2.LINE_AA);cv2.putText(out,f"Offset: {metrics['vehicle_offset_m']:+.2f} m",(28,74),cv2.FONT_HERSHEY_SIMPLEX,.62,(20,60,30),2,cv2.LINE_AA)
        return out


def encode_h264(input_path,output_path):
    import subprocess
    import imageio_ffmpeg
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),"-y","-i",str(input_path),"-an","-c:v","libx264","-preset","ultrafast","-crf","27","-pix_fmt","yuv420p","-movflags","+faststart",str(output_path)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    Path(input_path).unlink(missing_ok=True)

def process_video(video_path,output_dir,calibration,max_seconds=8,process_fps=10):
    import subprocess,gc,json
    video_path=Path(video_path);out=Path(output_dir);out.mkdir(parents=True,exist_ok=True)
    cap=cv2.VideoCapture(str(video_path))
    if not cap.isOpened():raise FileNotFoundError(video_path)
    source_fps=cap.get(cv2.CAP_PROP_FPS) or 25.;total=int(cap.get(cv2.CAP_PROP_FRAME_COUNT));w=int(cap.get(cv2.CAP_PROP_FRAME_WIDTH));h=int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    limit=total if max_seconds is None else min(total,int(max_seconds*source_fps));fps=float(process_fps or source_fps);next_t=0.;stem=video_path.stem
    raw=out/f"{stem}_processed_raw.mp4";rawc=out/f"{stem}_compare_raw.mp4";processed=out/f"{stem}_processed.mp4";compare=out/f"{stem}_compare.mp4"
    writer=cv2.VideoWriter(str(raw),cv2.VideoWriter_fourcc(*"mp4v"),fps,(w,h));cmp=cv2.VideoWriter(str(rawc),cv2.VideoWriter_fourcc(*"mp4v"),fps,(1920,580))
    tracker=LaneTracker(use_ema=True,ema_alpha=.25);valid=count=idx=0;modes={}
    try:
        while idx<limit:
            ok,frame=cap.read()
            if not ok:break
            t=idx/source_fps
            if t+1e-9>=next_t:
                result=tracker.process(frame,calibration);writer.write(result["output"]);valid+=int(result["valid"]);count+=1
                modes[result["search_mode"]]=modes.get(result["search_mode"],0)+1
                canvas=np.zeros((580,1920,3),np.uint8);canvas[40:580,:960]=cv2.resize(frame,(960,540));canvas[40:580,960:]=cv2.resize(result["output"],(960,540))
                cv2.putText(canvas,"ORIGINAL VIDEO",(20,27),cv2.FONT_HERSHEY_SIMPLEX,.65,(235,235,235),2);cv2.putText(canvas,"ADVANCED LANE FINDING",(980,27),cv2.FONT_HERSHEY_SIMPLEX,.65,(235,235,235),2);cmp.write(canvas);next_t+=1/fps
            idx+=1
    finally:
        cap.release();writer.release();cmp.release();cv2.destroyAllWindows();del tracker;gc.collect()
    if count==0:raise RuntimeError(f"No frames processed: {video_path}")
    encode_h264(raw,processed);encode_h264(rawc,compare)
    summary={"video":video_path.name,"source_duration_s":round(total/source_fps,2),"processed_frames":count,"processed_duration_s":round(count/fps,2),"valid_frames":valid,"valid_frame_coverage_percent":round(100*valid/max(count,1),1),"search_modes":modes,"processed_path":str(processed),"compare_path":str(compare),"fps":fps}
    (out/f"{stem}_summary.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding="utf-8")
    return summary

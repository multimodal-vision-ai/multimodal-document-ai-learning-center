"""E03 classroom-only classical lane-finding kernel, CPU/OpenCV; no learned model.
Returned lane curves are unlabelled geometry hypotheses, not ground truth.
"""
import cv2
import numpy as np
from dataclasses import dataclass

# Camera-dependent approximate road quadrilaterals; not physical calibration.
SCENE_QUADS = {
    'straight': (.43, .59, .09, .94, .60),
    'curve': (.42, .63, .06, .96, .61),
    'complex': (.40, .63, .03, .95, .61),
}

def resized(frame, size=(640, 360)):
    return cv2.resize(frame, size, interpolation=cv2.INTER_AREA)

def perspective(frame, scene='curve', top_shift=0., width_shift=0.):
    h,w=frame.shape[:2]
    left_top,right_top,left_bottom,right_bottom,y_top=SCENE_QUADS.get(scene,SCENE_QUADS['curve'])
    y_top=float(np.clip(y_top+top_shift,.42,.72))
    span=(right_top-left_top)*float(np.clip(1.+width_shift,.6,1.5))
    cx=(left_top+right_top)/2
    src=np.float32([[(cx-span/2)*w,y_top*h],[(cx+span/2)*w,y_top*h],
                    [right_bottom*w,.98*h],[left_bottom*w,.98*h]])
    dst=np.float32([[.23*w,0],[.77*w,0],[.77*w,h-1],[.23*w,h-1]])
    M=cv2.getPerspectiveTransform(src,dst)
    Minv=cv2.getPerspectiveTransform(dst,src)
    warped=cv2.warpPerspective(frame,M,(w,h))
    return warped,M,Minv,src

def e02_hough(frame, lo=50,hi=150,votes=25,length=35,gap=70,top=.55):
    """Reference to the approved E02 per-frame Canny→ROI→HoughLinesP route."""
    h,w=frame.shape[:2]
    gray=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    edges=cv2.Canny(cv2.GaussianBlur(gray,(5,5),1.2),lo,hi)
    mask=np.zeros_like(edges)
    poly=np.array([[(int(.05*w),int(.97*h)),(int(.42*w),int(top*h)),
                    (int(.58*w),int(top*h)),(int(.98*w),int(.97*h))]],np.int32)
    cv2.fillPoly(mask,poly,255)
    roi=cv2.bitwise_and(edges,mask)
    lines=cv2.HoughLinesP(roi,1,np.pi/180,threshold=votes,minLineLength=length,maxLineGap=gap)
    out=frame.copy()
    found=[] if lines is None else np.asarray(lines).reshape(-1,4).tolist()
    for x1,y1,x2,y2 in found:
        cv2.line(out,(x1,y1),(x2,y2),(30,220,30),2)
    return out,len(found),roi

def lane_masks(bgr,l_min=200,s_min=130,grad_min=45,clahe=False):
    if clahe:
        lab=cv2.cvtColor(bgr,cv2.COLOR_BGR2LAB)
        lab[:,:,0]=cv2.createCLAHE(clipLimit=2.0,tileGridSize=(8,8)).apply(lab[:,:,0])
        bgr=cv2.cvtColor(lab,cv2.COLOR_LAB2BGR)
    hls=cv2.cvtColor(bgr,cv2.COLOR_BGR2HLS)
    h,l,s=cv2.split(hls)
    white=(l>=l_min)&(s<=175)
    yellow=(h>=12)&(h<=45)&(s>=s_min)&(l>=60)
    gx=cv2.Sobel(l,cv2.CV_32F,1,0,ksize=3)
    gx=cv2.convertScaleAbs(gx)
    gradient=(gx>=grad_min)&(l>=90)
    combo=((white|yellow)|(gradient & (l>115))).astype(np.uint8)*255
    k=cv2.getStructuringElement(cv2.MORPH_RECT,(3,3))
    combo=cv2.morphologyEx(combo,cv2.MORPH_CLOSE,k)
    return (white.astype(np.uint8)*255,yellow.astype(np.uint8)*255,
            gradient.astype(np.uint8)*255,combo)

def sliding_window(binary,nwindows=9,margin_frac=.10,minpix=35):
    h,w=binary.shape
    hist=np.sum((binary[h//2:]>0).astype(np.int32),axis=0)
    mid=w//2
    # Localize left and right within their respective halves; no semantic promise.
    left=int(np.argmax(hist[int(.05*w):mid])+int(.05*w))
    right=int(np.argmax(hist[mid:int(.95*w)])+mid)
    nony,nonx=np.nonzero(binary)
    width=max(1,h//int(nwindows))
    margin=max(8,int(margin_frac*w))
    left_ids=[];right_ids=[];boxes=[]
    for k in range(int(nwindows)):
        yhi=h-k*width; ylo=max(0,yhi-width)
        for side,center,collect in [('left',left,left_ids),('right',right,right_ids)]:
            xlo=max(0,center-margin);xhi=min(w,center+margin)
            ids=np.where((nony>=ylo)&(nony<yhi)&(nonx>=xlo)&(nonx<xhi))[0]
            collect.extend(ids.tolist())
            boxes.append((xlo,ylo,xhi,yhi,side))
            if len(ids)>minpix:
                if side=='left':left=int(np.mean(nonx[ids]))
                else:right=int(np.mean(nonx[ids]))
    return nonx,nony,np.asarray(left_ids,dtype=int),np.asarray(right_ids,dtype=int),boxes

def fit_lanes(binary,nwindows=9,margin_frac=.10,minpix=35):
    h,w=binary.shape
    xs,ys,left_ids,right_ids,boxes=sliding_window(binary,nwindows,margin_frac,minpix)
    result={'valid':False,'boxes':boxes,'left_pixels':len(left_ids),'right_pixels':len(right_ids)}
    if min(len(left_ids),len(right_ids))<max(60,2*minpix):return result
    if np.ptp(ys[left_ids])<.20*h or np.ptp(ys[right_ids])<.20*h:return result
    # Normalize y to improve polynomial stability.
    try:
        yl=ys[left_ids]/h; yr=ys[right_ids]/h
        lf=np.polyfit(yl,xs[left_ids],2);rf=np.polyfit(yr,xs[right_ids],2)
    except (np.linalg.LinAlgError,ValueError):return result
    probes=np.array([.38,.62,.91])
    lx=np.polyval(lf,probes);rx=np.polyval(rf,probes)
    widths=rx-lx
    # Soft guards are diagnostic: do not fabricate a line from insufficient data.
    if not np.all(np.isfinite(widths)) or not np.all((widths>.12*w)&(widths<.86*w)):
        return result
    result.update(valid=True,left=lf,right=rf,probes=probes,left_x=lx,right_x=rx)
    return result

@dataclass
class LaneTracker:
    alpha:float=.6
    max_missing:int=3
    last:object=None
    missing:int=0

    def update(self,d):
        if d.get('valid'):
            xy=np.stack([d['left_x'],d['right_x']])
            if self.last is not None and self.missing<=self.max_missing:
                # Accept real changes but suppress small instantaneous oscillations.
                xy=self.alpha*xy+(1-self.alpha)*self.last
            self.last=xy;self.missing=0
            return xy,'DETECTED'
        self.missing+=1
        if self.last is not None and self.missing<=self.max_missing:
            return self.last,'HISTORY (unverified)'
        self.last=None
        return None,'NO RELIABLE LANE'

def draw_curve(frame,Minv,fit,tracker=None,alpha=.6):
    out=frame.copy();h,w=frame.shape[:2]
    if tracker is None:tracker=LaneTracker(alpha=alpha,max_missing=0)
    xy,status=tracker.update(fit)
    if xy is None:
        cv2.putText(out,status,(12,30),cv2.FONT_HERSHEY_SIMPLEX,.65,(25,25,235),2)
        return out,status,None
    # Reconstruct a quadratic from 3 normalized-y probe positions per boundary.
    y=fit.get('probes',np.array([.38,.62,.91]))
    lc=np.polyfit(y,xy[0],2);rc=np.polyfit(y,xy[1],2)
    yt=np.linspace(.32,.98,50)
    left=np.column_stack([np.polyval(lc,yt),yt*h]).astype(np.float32)
    right=np.column_stack([np.polyval(rc,yt),yt*h]).astype(np.float32)
    polygon=np.concatenate([left,right[::-1]])
    warped_poly=cv2.perspectiveTransform(polygon.reshape(-1,1,2),Minv).reshape(-1,2)
    pts=np.round(warped_poly).astype(np.int32)
    mask=np.zeros_like(out);cv2.fillPoly(mask,[pts],(55,180,35))
    out=cv2.addWeighted(out,1.,mask,.23,0)
    borders=cv2.perspectiveTransform(np.stack([left,right]).reshape(-1,1,2),Minv).reshape(2,-1,2)
    for line,color in zip(borders,[(255,170,20),(20,220,255)]):
        cv2.polylines(out,[np.round(line).astype(np.int32)],False,color,4,cv2.LINE_AA)
    cv2.putText(out,status,(12,30),cv2.FONT_HERSHEY_SIMPLEX,.54,(255,255,255),2)
    return out,status,float(np.mean(xy[:,2]))

def e03_detect(frame,scene='curve',tracker=None,top_shift=0.,width_shift=0.,
               nwindows=9,margin_frac=.10,l_min=200,s_min=130,clahe=False):
    bird,M,Minv,src=perspective(frame,scene,top_shift,width_shift)
    wm,ym,gm,binary=lane_masks(bird,l_min,s_min,clahe=clahe)
    h,w=binary.shape
    binary[:int(.08*h)]=0
    fit=fit_lanes(binary,nwindows,margin_frac)
    overlay,status,bottom=draw_curve(frame,Minv,fit,tracker)
    fit['status']=status;fit['bottom_x']=bottom
    return overlay,fit,{'bird':bird,'mask':binary,'white':wm,'yellow':ym,'grad':gm,'src':src}
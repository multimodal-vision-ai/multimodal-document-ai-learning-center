// Real EfficientDet-Lite0 cell-phone detections in two hand-guided contexts.
// Landmarks and returned boxes use source pixels, never sample reference labels.
export function phoneRegions(hands,pose,width,height){
 const valid=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=width&&p.y>=0&&p.y<=height;
 const points=(hands||[]).flat().filter(valid);
 const wrists=[pose?.[15],pose?.[16]].filter(p=>valid(p)&&(p.visibility??1)>=.3);
 const shoulder=pose?.[11]&&pose?.[12]?Math.hypot(pose[11].x-pose[12].x,pose[11].y-pose[12].y):0;
 const unit=width/1280;
 const make=(name,landmarks,minMargin,spanFraction,shoulderFraction)=>{
  if(!landmarks.length)return null;
  const xs=landmarks.map(p=>p.x),ys=landmarks.map(p=>p.y);
  const margin=Math.max(minMargin*unit,spanFraction*Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)),shoulderFraction*shoulder);
  const left=name==='broad'?x=>Math.floor(x/unit)*unit:x=>x;
  const right=name==='broad'?x=>Math.ceil(x/unit)*unit:x=>x;
  const x=Math.max(0,left(Math.min(...xs)-margin)),y=Math.max(0,left(Math.min(...ys)-margin));
  const w=Math.min(width,right(Math.max(...xs)+margin))-x,h=Math.min(height,right(Math.max(...ys)+margin))-y;
  return w>1&&h>1?{name,x,y,width:w,height:h}:null;
 };
 return [make('broad',[...points,...wrists],40,.35,.2),make('compact',points,30,.3,.15)].filter(Boolean);
}

export function detectPhoneROIs(detector,source,hands,pose,width=source.width||source.videoWidth,height=source.height||source.videoHeight,{canvas,scoreThreshold=.2}={}){
 if(!(width>0&&height>0))return {phones:[],passes:0,elapsedMs:0,checked:[]};
 canvas=canvas||(typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(640,640):document.createElement('canvas'));
 canvas.width=canvas.height=640;
 const ctx=canvas.getContext('2d');let passes=0,elapsedMs=0;const checked=[];
 for(const roi of phoneRegions(hands,pose,width,height)){
  const scale=640/Math.max(roi.width,roi.height),dw=roi.width*scale,dh=roi.height*scale,px=(640-dw)/2,py=(640-dh)/2;
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,640,640);
  ctx.drawImage(source,roi.x,roi.y,roi.width,roi.height,px,py,dw,dh);
  const started=performance.now(),detections=detector.detect(canvas).detections||[];
  elapsedMs+=performance.now()-started;passes++;
  const phones=detections.filter(d=>d.categories?.some(c=>c.categoryName==='cell phone'&&c.score>=scoreThreshold)).map(d=>{
   const b=d.boundingBox,score=d.categories.find(c=>c.categoryName==='cell phone').score;
   const x=Math.max(0,roi.x+(b.originX-px)/scale),y=Math.max(0,roi.y+(b.originY-py)/scale);
   return {x,y,width:Math.min(width-x,b.width/scale),height:Math.min(height-y,b.height/scale),score,roiKind:roi.name};
  }).filter(b=>b.width>0&&b.height>0);
  checked.push({roi,detections});
  if(phones.length)return {phones,passes,elapsedMs,checked};
 }
 return {phones:[],passes,elapsedMs,checked};
}

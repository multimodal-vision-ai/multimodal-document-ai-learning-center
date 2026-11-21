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

function detailRegion(pose,width,height){
 const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 const visible=(p,min)=>p&&(p.visibility??1)>=min;
 const [left,right]=[pose?.[11],pose?.[12]];
 const [leftHip,rightHip]=[pose?.[23],pose?.[24]];
 if(!left||!right||!leftHip||!rightHip)return null;
 const torso=Math.hypot((left.x+right.x-leftHip.x-rightHip.x)/2,(left.y+right.y-leftHip.y-rightHip.y)/2);
 const size=Math.max(torso,distance(left,right));
 if(size<10)return null;
 const arms=[];
 for(const side of [0,1]){
  const wrist=pose[15+side],elbow=pose[13+side],ear=pose[7+side];
  if(!visible(wrist,.5)||!visible(elbow,.45)||wrist.x<0||wrist.x>width||wrist.y<0||wrist.y>height)continue;
  const nearEar=visible(ear,.6)&&distance(wrist,ear)<=.66*torso;
  const raised=wrist.y<=pose[11+side].y+.18*torso;
  if(!nearEar&&!raised)continue;
  arms.push({wrist,elbow,ear,nearEar});
 }
 const arm=arms.find(a=>a.nearEar)||arms.sort((a,b)=>b.wrist.visibility-a.wrist.visibility)[0];
 if(!arm)return null;
 const {wrist,elbow,ear,nearEar}=arm;
 const tip={x:wrist.x+.3*(wrist.x-elbow.x),y:wrist.y+.3*(wrist.y-elbow.y)};
 const center=nearEar?{x:(wrist.x+ear.x)/2,y:(wrist.y+ear.y)/2}:tip;
 const radius=Math.max(22,(nearEar ? .58 : .6)*size);
 const x=Math.max(0,center.x-radius),y=Math.max(0,center.y-radius);
 const w=Math.min(width,center.x+radius)-x,h=Math.min(height,center.y+radius)-y;
 return w>1&&h>1?{name:nearEar?'ear':'hand-detail',x,y,width:w,height:h,wrist,tip,maxDistance:Math.max(7,.23*torso)}:null;
}

export function detectPhoneROIs(detector,source,hands,pose,width=source.width||source.videoWidth,height=source.height||source.videoHeight,{canvas,scoreThreshold=.2,personBox,detail=false}={}){
 if(!(width>0&&height>0))return {phones:[],passes:0,elapsedMs:0,checked:[]};
 canvas=canvas||(typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(640,640):document.createElement('canvas'));
 if(canvas.width!==640||canvas.height!==640)canvas.width=canvas.height=640;
 const ctx=canvas.getContext('2d');let passes=0,elapsedMs=0;const checked=[],weak=[];
 const regions=phoneRegions(hands,pose,width,height);
 const extra=detail?detailRegion(pose,width,height):null;
 if(extra)regions.push(extra);
 if(personBox){
  const margin=personBox.width*.35;
  const x=Math.max(0,personBox.originX-margin),y=Math.max(0,personBox.originY-margin);
  const w=Math.min(width,personBox.originX+personBox.width+margin)-x;
  const h=Math.min(height,personBox.originY+.75*personBox.height+margin)-y;
  if(w>1&&h>1)regions.push({name:'person',x,y,width:w,height:h});
 }
 for(const roi of regions){
  const scale=640/Math.max(roi.width,roi.height),dw=roi.width*scale,dh=roi.height*scale,px=(640-dw)/2,py=(640-dh)/2;
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,640,640);
  ctx.drawImage(source,roi.x,roi.y,roi.width,roi.height,px,py,dw,dh);
  const started=performance.now(),detections=detector.detect(canvas).detections||[];
  elapsedMs+=performance.now()-started;passes++;
  const phones=detections.filter(d=>d.categories?.some(c=>c.categoryName==='cell phone'&&c.score>=scoreThreshold)).map(d=>{
   const b=d.boundingBox,score=d.categories.find(c=>c.categoryName==='cell phone').score;
   const x=Math.max(0,roi.x+(b.originX-px)/scale),y=Math.max(0,roi.y+(b.originY-py)/scale);
   return {x,y,width:Math.min(width-x,b.width/scale),height:Math.min(height-y,b.height/scale),score,roiKind:roi.name};
  }).filter(b=>b.width>0&&b.height>0&&(!roi.wrist||[roi.wrist,roi.tip].some(point=>
   Math.hypot(Math.max(b.x-point.x,0,point.x-b.x-b.width),Math.max(b.y-point.y,0,point.y-b.y-b.height))<=roi.maxDistance
  )));
  checked.push({roi,detections});
  if(phones.some(phone=>phone.score>=.2))return {phones:[...phones,...weak],passes,elapsedMs,checked};
  weak.push(...phones);
 }
 return {phones:weak,passes,elapsedMs,checked};
}

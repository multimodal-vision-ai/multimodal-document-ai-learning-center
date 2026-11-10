// Classic Worker: MediaPipe's WASM loader needs importScripts (module workers do not work here).
const fetchAsset=self.fetch.bind(self);
self.fetch=(request,options)=>{
 const method=(options?.method||request?.method||'GET').toUpperCase();
 if(method!=='GET'&&method!=='HEAD')return Promise.reject(new TypeError('实时检测仅允许读取模型资源'));
 return fetchAsset(request,options);
};
const VISION='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/vision_bundle.mjs';
const WASM='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/wasm';
const POSE='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const HAND='https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const OBJECT='https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/int8/1/efficientdet_lite0.tflite';
let poseTask,handTask,objectTask,spatialDecision,detectPhoneROIs,boxIoU,clampPersonBox,generation=0,lastTimestamp=0;
let history=[],lastPerson=null,lastPersonAt=-Infinity,lastPhoneAt=-Infinity,phoneBoxes=[],phoneConfirmed=false,lastPhoneHit=-Infinity;
let lastPersonSource=null;
let fallAt=null,uprightSince=null,lastUprightAt=-Infinity;
const FALL_MIN_DISPLAY_SECONDS=2;
const phoneCanvas=new OffscreenCanvas(640,640);
const personCrop=new OffscreenCanvas(1,1);
function reset(value){
 generation=value;history=[];lastPerson=lastPersonSource=null;phoneBoxes=[];phoneConfirmed=false;
 lastPersonAt=lastPhoneAt=lastPhoneHit=-Infinity;
 fallAt=uprightSince=null;lastUprightAt=-Infinity;
}
function poseBounds(p,width,height){
 const visible=p.filter(q=>(q.visibility??1)>=.5&&q.x>=0&&q.x<=width&&q.y>=0&&q.y<=height);
 if(visible.length<8)return null;
 const xs=visible.map(q=>q.x),ys=visible.map(q=>q.y);
 const left=Math.max(0,Math.min(...xs)-width*.015),top=Math.max(0,Math.min(...ys)-height*.015);
 return {originX:left,originY:top,width:Math.min(width,Math.max(...xs)+width*.015)-left,height:Math.min(height,Math.max(...ys)+height*.015)-top};
}
function detectPeople(input){
 return (objectTask.detect(input).detections||[]).flatMap(d=>{
  const person=d.categories?.find(c=>c.categoryName==='person');
  return person?[{box:d.boundingBox,score:person.score}]:[];
 });
}
function recoverPersonBox(bitmap,wholeFramePeople){
 const {width,height}=bitmap;
 const w=Math.round(width*.7),h=Math.round(height*.7);
 const x=Math.round((width-w)/2),y=Math.round((height-h)/2);
 if(personCrop.width!==w||personCrop.height!==h){personCrop.width=w;personCrop.height=h}
 personCrop.getContext('2d').drawImage(bitmap,x,y,w,h,0,0,w,h);
 // Recover a partial upright figure when full-frame evidence is weak. The
 // two views must agree before accepting a low-score box for the display.
 for(const {box,score} of detectPeople(personCrop)){
  const candidate=clampPersonBox({...box,originX:box.originX+x,originY:box.originY+y},width,height);
  if(candidate&&candidate.height>=height*.15&&candidate.width<=candidate.height&&
    (score>=.18||score>=.12&&wholeFramePeople.some(p=>boxIoU(p.box,candidate)>=.3)))return candidate;
 }
 return null;
}
function nearPhone(phones,hands,p){
 if(!p[11]||!p[12])return false;
 const shoulder=Math.hypot(p[11].x-p[12].x,p[11].y-p[12].y);
 const points=[...hands.flat(),...[p[15],p[16]].filter(q=>q&&(q.visibility??1)>=.3)];
 return shoulder>5&&phones.some(b=>b.score>=.2&&points.some(q=>Math.hypot(Math.max(b.x-q.x,0,q.x-b.x-b.width),Math.max(b.y-q.y,0,q.y-b.y-b.height))<=.15*shoulder));
}
function visibleWave(p,recent){
 const nose=p[0],left=p[11],right=p[12];
 if(!nose||!left||!right)return false;
 const span=Math.hypot(left.x-right.x,left.y-right.y);
 const armIsRaised=[p[15],p[16]].some(w=>w&&w.visibility>=.3&&w.y<nose.y+.06*span&&Math.abs(w.x-nose.x)>.45*span);
 if(!armIsRaised||span<5)return false;
 const earlier=recent.find(r=>recent.at(-1).t-r.t<.9&&r.pose[11]&&r.pose[12]);
 if(!earlier)return false;
 return Math.hypot(left.x+right.x-earlier.pose[11].x-earlier.pose[12].x,left.y+right.y-earlier.pose[11].y-earlier.pose[12].y)<.8*span;
}
function torsoAxis(p){
 const shoulders=[p[11],p[12]],hips=[p[23],p[24]];
 if(![...shoulders,...hips].every(q=>q&&q.visibility>=.3))return null;
 return {x:hips[0].x+hips[1].x-shoulders[0].x-shoulders[1].x,
  y:hips[0].y+hips[1].y-shoulders[0].y-shoulders[1].y};
}
function corroboratesFall(p,box,height){
 const axis=torsoAxis(p);
 return axis?Math.abs(axis.x)>1.05*Math.abs(axis.y):!!box&&box.originY<height*.025;
}
function applyFallContext(action,pose,time){
 if(action==='Falling Down'){
  fallAt=time;uprightSince=null;return action;
 }
 if(fallAt===null)return action;
 const axis=torsoAxis(pose);
 const upright=axis&&axis.y>0&&Math.abs(axis.x)<.58*axis.y;
 // A missing pose or a single upright estimate cannot clear a confirmed fall.
 if(upright){
  if(uprightSince===null||time-lastUprightAt>.6)uprightSince=time;
  lastUprightAt=time;
  if(time-fallAt>=FALL_MIN_DISPLAY_SECONDS&&time-uprightSince>=.7)fallAt=null;
 }else uprightSince=null;
 if(fallAt===null)return action;
 const stillDown=axis&&Math.abs(axis.x)>1.43*Math.abs(axis.y);
 if(time-fallAt<FALL_MIN_DISPLAY_SECONDS||stillDown)return 'Falling Down';
 return fallAt!==null&&action==='Sleeping Posture'?null:action;
}
async function initialize(){
 const model = async url => {
  const response = await fetch(url);
  if (!response.ok) throw Error('模型读取失败 · HTTP ' + response.status);
  return new Uint8Array(await response.arrayBuffer());
 };
 const [vision,rules,phone,target,poseModel,handModel,objectModel]=await Promise.all([
  import(VISION),import('./our-solution-rules.js'),import('./our-solution-phone-fast.js'),import('./person-target.js'),
  model(POSE),model(HAND),model(OBJECT)
 ]);
 spatialDecision=rules.spatialDecision;detectPhoneROIs=phone.detectPhoneROIs;
 ({boxIoU,clampPersonBox}=target);
 const fileset=await vision.FilesetResolver.forVisionTasks(WASM);
 poseTask=await vision.PoseLandmarker.createFromOptions(fileset,{canvas:new OffscreenCanvas(640,640),baseOptions:{modelAssetBuffer:poseModel,delegate:'CPU'},runningMode:'VIDEO',numPoses:1});
 handTask=await vision.HandLandmarker.createFromOptions(fileset,{canvas:new OffscreenCanvas(640,640),baseOptions:{modelAssetBuffer:handModel,delegate:'CPU'},runningMode:'VIDEO',numHands:2});
 objectTask=await vision.ObjectDetector.createFromOptions(fileset,{canvas:new OffscreenCanvas(640,640),baseOptions:{modelAssetBuffer:objectModel,delegate:'CPU'},runningMode:'IMAGE',categoryAllowlist:['person','cell phone'],scoreThreshold:.08,maxResults:8});
 postMessage({type:'ready'});
}
self.onmessage=async({data})=>{
 if(data.type==='init'){
  try{await initialize()}catch(e){postMessage({type:'error',generation,message:e.message,stack:e.stack})}return;
 }
 if(data.type==='reset'){reset(data.generation);return}
 if(data.type!=='frame')return;
 const bitmap=data.bitmap,frameGeneration=data.generation,t=data.t,began=performance.now();
 try{
  if(frameGeneration!==generation||!poseTask)return;
  const width=bitmap.width,height=bitmap.height;
  const ts=Math.max(lastTimestamp+1,Math.round(performance.now()));lastTimestamp=ts;
  const pose=poseTask.detectForVideo(bitmap,ts),hands=handTask.detectForVideo(bitmap,ts);
  const map=q=>({x:q.x*width,y:q.y*height,visibility:q.visibility??1});
  const p=(pose.landmarks?.[0]||[]).map(map),h=(hands.landmarks||[]).map(a=>a.map(map));
  const poseBox=poseBounds(p,width,height);
  let freshPerson=null;
  if(t-lastPersonAt>=1/3&&(!phoneConfirmed||!poseBox)){
   const people=detectPeople(bitmap);
   const person=people.filter(p=>p.score>=.18).sort((a,b)=>b.box.width*b.box.height-a.box.width*a.box.height)[0];
   freshPerson=person?.box||null;
   const recovered=!poseBox&&(!freshPerson||freshPerson.height<height*.15)?recoverPersonBox(bitmap,people):null;
   // Recovery is for tracking display; fall decisions still use the original detections.
   lastPerson=recovered||freshPerson;lastPersonAt=t;
   lastPersonSource=recovered?'person_crop_detection':'person_detection';
  }
  let phoneChecked=false,phonePasses=0;
  if(p[11]&&p[12]&&t-lastPhoneAt>=(phoneConfirmed?1:1/3)){
   const found=detectPhoneROIs(objectTask,bitmap,h,p,width,height,{canvas:phoneCanvas,scoreThreshold:.2});
   phoneBoxes=found.phones;phonePasses=found.passes;lastPhoneAt=t;phoneChecked=true;
  }
  const row={t,pose:p,hands:h,phones:phoneChecked?phoneBoxes:[],personBox:freshPerson};
  history.push(row);history=history.filter(r=>t-r.t<=3.2);
  const decision=spatialDecision(history);
  let action=decision.action&&decision.times.some(s=>Math.abs(s-t)<.01)?decision.action:null,assumed=false,observedAt=t;
  if(action==='Waving Hand'&&!visibleWave(p,history))action=null;
  if(action==='Falling Down'&&!corroboratesFall(p,freshPerson,height))action=null;
  // The batch spatial rule uses .25; real Lite0 phone boxes are accepted at the probed .2 threshold.
  const actualPhoneHits=history.filter(r=>r.phones.length&&nearPhone(r.phones,r.hands,r.pose));
  if(phoneChecked&&actualPhoneHits.length>=2&&nearPhone(phoneBoxes,h,p)){
   action='Using Phone';phoneConfirmed=true;lastPhoneHit=t;
  }else if(phoneChecked){phoneConfirmed=false}
  if(!action&&phoneConfirmed&&!phoneChecked&&t-lastPhoneHit<=1.25&&nearPhone(phoneBoxes,h,p)){
   action='Using Phone';assumed=true;observedAt=lastPhoneHit;
  }
  const candidateAction=action;
  action=applyFallContext(candidateAction,p,t);
  const sleepSuppressedAfterFall=candidateAction==='Sleeping Posture'&&action!=='Sleeping Posture';
  if(action==='Falling Down'){
   assumed=candidateAction!=='Falling Down';
   observedAt=fallAt;
  }
  const fallDisplayUntil=action==='Falling Down'?fallAt+FALL_MIN_DISPLAY_SECONDS:null;
  const box=poseBox||(t-lastPersonAt<=.7?lastPerson:null),sx=(data.width||width)/width,sy=(data.height||height)/height;
  const personBox=box?{originX:box.originX*sx,originY:box.originY*sy,width:box.width*sx,height:box.height*sy}:null;
  postMessage({type:'frame',generation:frameGeneration,t,inferenceMs:performance.now()-began,action,assumed,observedAt,fallDisplayUntil,
   personBox,boxSource:poseBox?'pose_landmarks':personBox?lastPersonSource:null,phoneChecked,phonePasses,sleepSuppressedAfterFall,
   phoneBoxes:(phoneChecked?phoneBoxes:[]).map(b=>({...b,x:b.x*sx,y:b.y*sy,width:b.width*sx,height:b.height*sy})),poseLandmarks:p.length,handCount:h.length});
 }catch(e){postMessage({type:'error',generation:frameGeneration,message:e.message,stack:e.stack})}
 finally{bitmap?.close();postMessage({type:'done',generation:frameGeneration})}
};

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
let poseTask,handTask,objectTask,spatialDecision,detectPhoneROIs,boxIoU,clampPersonBox,createSurveillancePersonGate,generation=0,lastTimestamp=0;
let personGate=null;
let history=[],lastPerson=null,lastPersonAt=-Infinity,lastPhoneAt=-Infinity,phoneBoxes=[],phoneConfirmed=false,lastPhoneHit=-Infinity;
let lastPhoneCropAt=-Infinity;
let lastPersonSource=null;
let fallAt=null,uprightSince=null,lastUprightAt=-Infinity;
let surveillance=false,surveillanceObservation,surveillanceDecision,supportsPhoneBox,surveillanceHistory=[],surveillanceFallAt=-Infinity;
let surveillancePhone=null;
let lastWaveCandidate=-Infinity;
let lastPoseTrack=null,edgeCrop=null,edgePushUp=null;
let poseMissed=false;
const FALL_MIN_DISPLAY_SECONDS=2;
const phoneCanvas=new OffscreenCanvas(640,640);
const personCrop=new OffscreenCanvas(1,1);
const edgePoseCanvas=new OffscreenCanvas(256,256);
function reset(value,enhanced){
 generation=value;history=[];lastPerson=lastPersonSource=null;phoneBoxes=[];phoneConfirmed=false;
 surveillance=!!enhanced;surveillanceHistory=[];surveillanceFallAt=-Infinity;surveillancePhone=null;
 lastWaveCandidate=-Infinity;
 lastPoseTrack=edgeCrop=edgePushUp=null;
 poseMissed=false;
 personGate=surveillance?createSurveillancePersonGate():null;
 lastPersonAt=lastPhoneAt=lastPhoneHit=lastPhoneCropAt=-Infinity;
 fallAt=uprightSince=null;lastUprightAt=-Infinity;
}
function poseBounds(p,width,height){
 const visible=p.filter(q=>(q.visibility??1)>=.5&&q.x>=0&&q.x<=width&&q.y>=0&&q.y<=height);
 if(visible.length<8)return null;
 const xs=visible.map(q=>q.x),ys=visible.map(q=>q.y);
 const left=Math.max(0,Math.min(...xs)-width*.015),top=Math.max(0,Math.min(...ys)-height*.015);
 return {originX:left,originY:top,width:Math.min(width,Math.max(...xs)+width*.015)-left,height:Math.min(height,Math.max(...ys)+height*.015)-top};
}
function nearLowerEdge(box,height){
 return !!box&&box.originY>height*.62&&box.originY+box.height>height*.94;
}
function edgePoseInput(bitmap,t){
 const {width,height}=bitmap;
 if(edgeCrop&&t-edgeCrop.t>(edgeCrop.inverted?10:1.8))edgeCrop=null;
 const last=lastPoseTrack;
 if(!edgeCrop&&poseMissed&&last&&t-last.t>=.32&&t-last.t<=1.4&&nearLowerEdge(last.box,height)){
  const side=Math.min(width,height,Math.max(height*.6,last.box.width*2.8));
  edgeCrop={x:Math.max(0,Math.min(width-side,last.box.originX+(last.box.width-side)/2)),
   y:height-side,side,t,lastFull:t};
 }
 if(!edgeCrop)return bitmap;
 if(edgeCrop.inverted&&t-edgeCrop.lastFull>=1.2){edgeCrop.lastFull=t;return bitmap}
 // Replace this frame's normal pose input, keeping the same worker cadence.
 const {x,y,side,inverted}=edgeCrop,ctx=edgePoseCanvas.getContext('2d');
 // Leave space below the shoulders when the upper body reaches the image edge.
 const inputY=y+(inverted?side*.08:0),sourceHeight=Math.min(side,height-inputY);
 const imageHeight=256*sourceHeight/side;
 if(imageHeight<256){ctx.fillStyle='#333';ctx.fillRect(0,Math.floor(imageHeight),256,256)}
 ctx.drawImage(bitmap,x,inputY,side,sourceHeight,0,0,256,imageHeight);
 edgeCrop.inputY=inputY;
 return edgePoseCanvas;
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
function stillHoldingPhone(current,previous,pose,hands){
 if(!previous?.phone||current.sleepPose||current.supportingArm||current.t-previous.t>1.35||!current.shoulder||!previous.shoulder||
  current.scale<10||previous.scale<10||current.axis<.48)return false;
 const shift=Math.hypot(current.shoulder.x-previous.shoulder.x,current.shoulder.y-previous.shoulder.y);
 if(shift>1.25*previous.scale)return false;
 const scale=current.scale/previous.scale;
 if(scale<.65||scale>1.5)return false;
 const box={x:current.shoulder.x+(previous.phone.x-previous.shoulder.x)*scale,
  y:current.shoulder.y+(previous.phone.y-previous.shoulder.y)*scale,
  width:previous.phone.width*scale,height:previous.phone.height*scale};
 return supportsPhoneBox(box,current.shoulder,current.scale,hands,[pose[15],pose[16]].filter(Boolean));
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
 const [vision,rules,phone,target,enhanced]=await Promise.all([import(VISION),import('./our-solution-rules.js'),import('./our-solution-phone-fast.js'),import('./person-target.js'),import('./our-solution-surveillance.js')]);
 spatialDecision=rules.spatialDecision;detectPhoneROIs=phone.detectPhoneROIs;
 ({surveillanceObservation,surveillanceDecision,supportsPhoneBox}=enhanced);
 ({boxIoU,clampPersonBox,createSurveillancePersonGate}=target);
 const fileset=await vision.FilesetResolver.forVisionTasks(WASM);
 poseTask=await vision.PoseLandmarker.createFromOptions(fileset,{canvas:new OffscreenCanvas(640,640),baseOptions:{modelAssetPath:POSE,delegate:'CPU'},runningMode:'VIDEO',numPoses:1});
 handTask=await vision.HandLandmarker.createFromOptions(fileset,{canvas:new OffscreenCanvas(640,640),baseOptions:{modelAssetPath:HAND,delegate:'CPU'},runningMode:'VIDEO',numHands:2});
 objectTask=await vision.ObjectDetector.createFromOptions(fileset,{canvas:new OffscreenCanvas(640,640),baseOptions:{modelAssetPath:OBJECT,delegate:'CPU'},runningMode:'IMAGE',categoryAllowlist:['person','cell phone'],scoreThreshold:.08,maxResults:8});
 postMessage({type:'ready'});
}
self.onmessage=async({data})=>{
 if(data.type==='init'){
  try{await initialize()}catch(e){postMessage({type:'error',generation,message:e.message,stack:e.stack})}return;
 }
 if(data.type==='reset'){reset(data.generation,data.surveillance);return}
 if(data.type!=='frame')return;
 const bitmap=data.bitmap,frameGeneration=data.generation,t=data.t,began=performance.now();
 try{
  if(frameGeneration!==generation||!poseTask)return;
  const width=bitmap.width,height=bitmap.height;
  const ts=Math.max(lastTimestamp+1,Math.round(performance.now()));lastTimestamp=ts;
  const poseInput=surveillance?edgePoseInput(bitmap,t):bitmap;
  const cropBounds=poseInput===edgePoseCanvas?edgeCrop:null;
  const pose=poseTask.detectForVideo(poseInput,ts),hands=handTask.detectForVideo(bitmap,ts);
  const map=q=>({x:q.x*width,y:q.y*height,visibility:q.visibility??1});
  const mapPose=cropBounds?q=>{
   const x=cropBounds.x+q.x*cropBounds.side,y=cropBounds.inputY+q.y*cropBounds.side;
   return {x,y,visibility:x>=0&&x<=width&&y>=0&&y<=height?(q.visibility??1):0};
  }:map;
  let p=(pose.landmarks?.[0]||[]).map(mapPose),h=(hands.landmarks||[]).map(a=>a.map(map));
  const rawPoseLandmarks=p.length;
  let poseBox=poseBounds(p,width,height),freshPerson=null,people=[];
  const stablePose=surveillance&&boxIoU(lastPoseTrack?.box,poseBox)>.55;
  const personInterval=stablePose ? .55 : 1/3;
  if(t-lastPersonAt>=personInterval&&(!phoneConfirmed||!poseBox)){
   people=detectPeople(bitmap);
   const person=people.filter(p=>p.score>=.18).sort((a,b)=>b.box.width*b.box.height-a.box.width*a.box.height)[0];
   freshPerson=person?.box||null;
   const recovered=!poseBox&&(!freshPerson||freshPerson.height<height*.15)?recoverPersonBox(bitmap,people):null;
   // Recovery is for tracking display; fall decisions still use the original detections.
   lastPerson=recovered||freshPerson;lastPersonAt=t;
   lastPersonSource=recovered?'person_crop_detection':'person_detection';
  }
  let phoneChecked=false,phonePasses=0;
  let phonePerson=poseBox||(t-lastPersonAt<=.7?lastPerson:null);
  if(personGate&&!personGate(bitmap,phonePerson,{t,poseBox,people})){
   p=[];h=[];poseBox=freshPerson=phonePerson=null;
  }
  if(surveillance&&poseBox){
   lastPoseTrack={t,box:poseBox};
   if(edgeCrop&&poseBox.originY+poseBox.height<=height*.94)edgeCrop=null;
   else if(cropBounds&&edgeCrop){
    const axis=torsoAxis(p);
    if(axis&&axis.y<-.8*Math.abs(axis.x)&&p[11].y+p[12].y>1.8*height)edgeCrop.inverted=true;
   }
  }
  poseMissed=!poseBox;
  const visibleHands=h.length||[p[15],p[16]].some(wrist=>wrist&&wrist.visibility>=.3);
  const crop=surveillance&&phonePerson&&visibleHands&&t-lastPhoneCropAt>=.8?phonePerson:null;
  if((p[11]&&p[12]||surveillance&&visibleHands)&&t-lastPhoneAt>=(phoneConfirmed?1:1/3)){
   const found=detectPhoneROIs(objectTask,bitmap,h,p,width,height,{canvas:phoneCanvas,
    scoreThreshold:surveillance ? .15 : .2,personBox:crop,detail:!!crop});
   if(found.checked.some(({roi})=>['person','ear','hand-detail'].includes(roi.name)))lastPhoneCropAt=t;
   phoneBoxes=found.phones;phonePasses=found.passes;lastPhoneAt=t;phoneChecked=true;
  }
  const originalPhones=surveillance?[]:phoneBoxes;
  const observation=surveillance?surveillanceObservation(t,p,h,phoneChecked?phoneBoxes:[],phonePerson,
   cropBounds?height:null):null;
  const row={t,pose:p,hands:h,phones:phoneChecked?originalPhones:[],personBox:freshPerson};
  history.push(row);history=history.filter(r=>t-r.t<=3.2);
  const decision=spatialDecision(history);
  let action=decision.action&&decision.times.some(s=>Math.abs(s-t)<.01)?decision.action:null,assumed=false,observedAt=t;
  if(action==='Waving Hand'&&!visibleWave(p,history))action=null;
  if(action==='Waving Hand'&&observation&&(cropBounds||observation.supportingArm||observation.edgeProne||
   observation.sleepPose||observation.axis!==null&&observation.axis<.82))action=null;
  if(surveillance&&action==='Waving Hand'){
   if(t-lastWaveCandidate>.75)action=null;
   lastWaveCandidate=t;
  }
  // A cropped fall can lose its joints at the upper edge. Retain the
  // upright-to-wide detector transition there when pose corroboration is unavailable.
  const edgeFall=!!observation&&!cropBounds&&action==='Falling Down'&&observation.axis===null&&
   freshPerson&&freshPerson.originY<height*.025&&freshPerson.width>1.2*freshPerson.height;
  if(action==='Falling Down'&&(surveillance?!edgeFall:!corroboratesFall(p,freshPerson,height)))action=null;
  // The batch spatial rule uses .25; real Lite0 phone boxes are accepted at the probed .2 threshold.
  const actualPhoneHits=history.filter(r=>r.phones.length&&nearPhone(r.phones,r.hands,r.pose));
  if(phoneChecked&&actualPhoneHits.length>=2&&nearPhone(originalPhones,h,p)){
   action='Using Phone';phoneConfirmed=true;lastPhoneHit=t;
  }else if(phoneChecked){phoneConfirmed=false}
  if(!action&&phoneConfirmed&&!phoneChecked&&t-lastPhoneHit<=1.25&&nearPhone(originalPhones,h,p)){
   action='Using Phone';assumed=true;observedAt=lastPhoneHit;
  }
  const candidateAction=action;
  action=applyFallContext(candidateAction,p,t);
  const sleepSuppressedAfterFall=candidateAction==='Sleeping Posture'&&action!=='Sleeping Posture';
  if(action==='Falling Down'){
   assumed=candidateAction!=='Falling Down';
   observedAt=fallAt;
  }
  let enhancedAction=null;
  if(observation){
   surveillanceHistory=surveillanceHistory.filter(row=>t-row.t<=7);
   enhancedAction=surveillanceDecision(observation,surveillanceHistory);
   surveillanceHistory.push(observation);
   // A lower-edge crop may lose landmarks as the person stands up.
   // A newly inferred fall needs full-frame context.
   if(cropBounds&&enhancedAction==='Falling Down')enhancedAction=null;
   if(enhancedAction==='Push Up'&&observation.edgeProne)edgePushUp=observation;
   const heldPushUp=!enhancedAction&&observation.edgeProne&&edgePushUp&&
    t-edgePushUp.t<=.85&&Math.hypot(observation.ankle.x-edgePushUp.ankle.x,
     observation.ankle.y-edgePushUp.ankle.y)<.32*observation.scale;
   if(heldPushUp)enhancedAction='Push Up';
   if(edgeFall&&!enhancedAction)enhancedAction='Falling Down';
   if(enhancedAction==='Falling Down')surveillanceFallAt=t;
   if(!observation.supportingArm&&!observation.edgeProne&&(t-surveillanceFallAt<FALL_MIN_DISPLAY_SECONDS||
    t-surveillanceFallAt<15&&observation.axis!==null&&observation.axis<.48))enhancedAction='Falling Down';
   const heldPhone=!enhancedAction&&stillHoldingPhone(observation,surveillancePhone,p,h);
   if(enhancedAction==='Using Phone'&&observation.phone)surveillancePhone=observation;
   else if(enhancedAction)surveillancePhone=null;
   if(heldPhone)enhancedAction='Using Phone';
   const sleepAgainstWave=enhancedAction==='Sleeping Posture'&&action==='Waving Hand';
   if(enhancedAction&&(!action||enhancedAction==='Push Up'||sleepAgainstWave||action==='Sleeping Posture')){
    assumed=!!(heldPhone||heldPushUp);
    action=enhancedAction;observedAt=heldPhone?surveillancePhone.t:heldPushUp?edgePushUp.t:t;
   }
  }
  const fallDisplayUntil=action==='Falling Down'?Math.max(fallAt??-Infinity,surveillanceFallAt)+FALL_MIN_DISPLAY_SECONDS:null;
  const box=phonePerson,sx=(data.width||width)/width,sy=(data.height||height)/height;
  const personBox=box?{originX:box.originX*sx,originY:box.originY*sy,width:box.width*sx,height:box.height*sy}:null;
  const edgeRecovery=!!edgeCrop||!!lastPoseTrack&&t-lastPoseTrack.t<=1.4&&nearLowerEdge(lastPoseTrack.box,height);
  postMessage({type:'frame',generation:frameGeneration,t,inferenceMs:performance.now()-began,action,assumed,observedAt,fallDisplayUntil,enhancedAction,
   armSupported:!!(observation?.supportingArm||observation?.edgeProne),edgePoseCrop:!!cropBounds,edgeRecovery,rawPoseLandmarks,
   personBox,boxSource:poseBox?'pose_landmarks':personBox?lastPersonSource:null,phoneChecked,phonePasses,sleepSuppressedAfterFall,
   phoneBoxes:(phoneChecked?phoneBoxes:[]).map(b=>({...b,x:b.x*sx,y:b.y*sy,width:b.width*sx,height:b.height*sy})),poseLandmarks:p.length,handCount:h.length});
 }catch(e){postMessage({type:'error',generation:frameGeneration,message:e.message,stack:e.stack})}
 finally{bitmap?.close();postMessage({type:'done',generation:frameGeneration})}
};

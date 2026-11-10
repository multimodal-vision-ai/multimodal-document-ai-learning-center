import {seekVideo} from './continuous-movinet.js';
import {ACTION_LABELS,CLASS_MAP,softmax,clipDecision,spatialDecision} from './our-solution-rules.js';
import {recheckSeconds,heldPoint,createSceneProbe} from './our-solution-cadence.js';
const ORT='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/ort.wasm.min.mjs';
const VISION='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/vision_bundle.mjs';
const WASM='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/wasm';
const POSE='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task';
const HAND='https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const ASSETS=new URL('./our-solution-assets/',import.meta.url);
export const OUR_SOLUTION_BUILD=new URL(import.meta.url).pathname.match(/\/build\/([a-f0-9]+)\//)?.[1]||'working-copy';
let loaded=null,pending=null,geometry=null;
const abort=signal=>{if(signal?.aborted)throw Error('用户取消')};
const pause=()=>new Promise(r=>setTimeout(r,0));
async function checked(name,spec,signal){
 const response=await fetch(new URL(name,ASSETS),{signal});if(!response.ok)throw Error(name+' HTTP '+response.status);
 const bytes=await response.arrayBuffer();abort(signal);
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
 if(hash!==spec.sha256||bytes.byteLength!==spec.bytes)throw Error(name+' 模型校验失败');return bytes;
}
export const ourSolutionReady=()=>!!loaded;
export async function loadOurSolution({signal,onProgress=()=>{}}={}){
 if(loaded)return loaded;if(pending)return pending;
 pending=(async()=>{
  onProgress('正在加载 Our Solution…');
  const r=await fetch(new URL('export_manifest.json',ASSETS),{signal});if(!r.ok)throw Error('Our Solution 模型清单 HTTP '+r.status);
  const manifest=await r.json();
  const ort=await import(ORT);ort.env.wasm.numThreads=1;
  ort.env.wasm.wasmPaths='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/';
  const bytes=await checked('x3d_s.onnx',manifest.files['x3d_s.onnx'],signal);
  onProgress('正在初始化 Our Solution 浏览器推理…');
  const session=await ort.InferenceSession.create(bytes,{executionProviders:['wasm']});abort(signal);
  const labelBytes=await checked('class_names.json',manifest.files['class_names.json'],signal);
  const labels=JSON.parse(new TextDecoder().decode(labelBytes));
  loaded={ort,session,labels,manifest};return loaded;
 })();
 try{return await pending}finally{pending=null}
}
async function loadGeometry(entry,signal,onProgress){
 if(geometry)return geometry;
 onProgress('正在加载空间与姿态分析组件…');
 const bytes=await checked('yolo26s.onnx',entry.manifest.files['yolo26s.onnx'],signal);
 const yolo=await entry.ort.InferenceSession.create(bytes,{executionProviders:['wasm']});
 const {FilesetResolver,PoseLandmarker,HandLandmarker}=await import(VISION);
 const fileset=await FilesetResolver.forVisionTasks(WASM);abort(signal);
 geometry={yolo,fileset,PoseLandmarker,HandLandmarker};return geometry;
}
// Matches the validated full-frame short-side resize + centre crop.
export function sampleClipRGB(ctx,video){
 const s=Math.min(video.videoWidth,video.videoHeight),x=(video.videoWidth-s)/2,y=(video.videoHeight-s)/2;
 ctx.drawImage(video,x,y,s,s,0,0,182,182);return ctx.getImageData(0,0,182,182).data;
}
export function writeClipFrame(target,rgba,frame){
 const plane=182*182;
 for(let i=0;i<plane;i++)for(let c=0;c<3;c++)target[(c*13+frame)*plane+i]=(rgba[i*4+c]/255-.45)/.225;
}
function decodeDetections(data,dims,scale,ox,oy,width,height){
 if(dims.length!==3||dims[1]!==84)throw Error('人物检测输出格式发生变化');
 const n=dims[2],candidates=[];
 for(let i=0;i<n;i++){
  const person=data[4*n+i],phone=data[(4+67)*n+i];
  if(Math.max(person,phone)<.1)continue;
  const cx=data[i],cy=data[n+i],w=data[2*n+i],h=data[3*n+i];
  const x=Math.max(0,(cx-w/2-ox)/scale),y=Math.max(0,(cy-h/2-oy)/scale);
  const right=Math.min(width,(cx+w/2-ox)/scale),bottom=Math.min(height,(cy+h/2-oy)/scale);
  if(right<=x||bottom<=y)continue;
  if(person>=.1)candidates.push({x,y,width:right-x,height:bottom-y,score:person,kind:'person'});
  if(phone>=.25)candidates.push({x,y,width:right-x,height:bottom-y,score:phone,kind:'phone'});
 }
 const people=candidates.filter(x=>x.kind==='person').sort((a,b)=>b.width*b.height-a.width*a.height);
 const p=people[0];
 return {personBox:p?{originX:p.x,originY:p.y,width:p.width,height:p.height}:null,phones:candidates.filter(x=>x.kind==='phone')};
}
async function analyzeGeometry(video,entry,signal,onProgress,adaptive,stats){
 const setupStarted=performance.now();
 const g=await loadGeometry(entry,signal,onProgress),canvas=document.createElement('canvas');canvas.width=canvas.height=960;
 const poseTask=await g.PoseLandmarker.createFromOptions(g.fileset,{baseOptions:{modelAssetPath:POSE,delegate:'CPU'},runningMode:'VIDEO',numPoses:1});
 let handTask=null;
 try{
 handTask=await g.HandLandmarker.createFromOptions(g.fileset,{baseOptions:{modelAssetPath:HAND,delegate:'CPU'},runningMode:'VIDEO',numHands:2});
 stats.geometrySetupMs=Math.round(performance.now()-setupStarted);
 const ctx=canvas.getContext('2d',{willReadFrequently:true}),rows=[],holds=[],w=video.videoWidth,h=video.videoHeight;
 const probe=createSceneProbe(video,seekVideo,signal,stats);let skipObjectsUntil=-Infinity;
 const scale=960/Math.max(w,h),nw=Math.round(w*scale),nh=Math.round(h*scale),ox=Math.floor((960-nw)/2),oy=Math.floor((960-nh)/2);
 const map=p=>({x:(p.x*960-ox)/scale,y:(p.y*960-oy)/scale,visibility:p.visibility??1});
 for(let t=0;t<video.duration-.025;){
  abort(signal);onProgress('空间与姿态分析：'+t.toFixed(1)+'/'+video.duration.toFixed(1)+'秒',{current:t,total:video.duration});
  await seekVideo(video,t,()=>signal?.aborted);ctx.fillStyle='#000';ctx.fillRect(0,0,960,960);ctx.drawImage(video,0,0,w,h,ox,oy,nw,nh);
  const ts=Math.round(t*1000),pose=poseTask.detectForVideo(canvas,ts),hands=handTask.detectForVideo(canvas,ts);
  stats.poseRuns++;stats.handRuns++;
  const mappedPose=pose.landmarks?.[0]?.map(map)||[],mappedHands=(hands.landmarks||[]).map(a=>a.map(map));
  let det={personBox:null,phones:[]},phoneDetectionSource='skipped';
  const skipObjects=adaptive&&t<skipObjectsUntil;
  if(!skipObjects){
   const rgba=ctx.getImageData(0,0,960,960).data,input=new Float32Array(3*960*960);
   for(let i=0;i<960*960;i++)for(let c=0;c<3;c++)input[c*960*960+i]=rgba[i*4+c]/255;
   const output=await g.yolo.run({[g.yolo.inputNames[0]]:new entry.ort.Tensor('float32',input,[1,3,960,960])});abort(signal);stats.objectRuns++;
   const tensor=output[g.yolo.outputNames[0]];det=decodeDetections(tensor.data,tensor.dims,scale,ox,oy,w,h);
   phoneDetectionSource=det.phones.length?'full_frame':'missing';
   if(!det.phones.length){
    // Run the SAME detector on a hand-sized view: small/thin phones are lost at full-frame scale.
    const points=[...mappedHands.flat(),...[mappedPose[15],mappedPose[16]].filter(p=>p&&p.visibility>=.3)]
     .filter(p=>p.x>=0&&p.x<=w&&p.y>=0&&p.y<=h);
    if(points.length){
     const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
     const sw=mappedPose[11]&&mappedPose[12]?Math.hypot(mappedPose[11].x-mappedPose[12].x,mappedPose[11].y-mappedPose[12].y):0;
     const margin=Math.max(40,.35*Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)),.2*sw);
     const rx=Math.max(0,Math.floor(Math.min(...xs)-margin)),ry=Math.max(0,Math.floor(Math.min(...ys)-margin));
     const rw=Math.min(w,Math.ceil(Math.max(...xs)+margin))-rx,rh=Math.min(h,Math.ceil(Math.max(...ys)+margin))-ry;
     const rs=960/Math.max(rw,rh),cw=Math.round(rw*rs),ch=Math.round(rh*rs),px=Math.floor((960-cw)/2),py=Math.floor((960-ch)/2);
     ctx.fillRect(0,0,960,960);ctx.drawImage(video,rx,ry,rw,rh,px,py,cw,ch);
     const crop=ctx.getImageData(0,0,960,960).data,cropInput=new Float32Array(3*960*960);
     for(let i=0;i<960*960;i++)for(let c=0;c<3;c++)cropInput[c*960*960+i]=crop[i*4+c]/255;
     const extra=await g.yolo.run({[g.yolo.inputNames[0]]:new entry.ort.Tensor('float32',cropInput,[1,3,960,960])});abort(signal);stats.objectRuns++;stats.phoneRoiRuns++;
     const data=extra[g.yolo.outputNames[0]],found=decodeDetections(data.data,data.dims,rs,px,py,rw,rh);
     det.phones=found.phones.map(p=>({...p,x:p.x+rx,y:p.y+ry}));
     if(det.phones.length)phoneDetectionSource='hand_roi';
    }
   }
  }
  rows.push({t,pose:mappedPose,hands:mappedHands,...det,phoneDetectionSource,objectsSkipped:skipObjects});
  if(!adaptive){t+=.5;await pause();continue}
  const current=spatialDecision(rows.filter(o=>t-o.t<=4.01));
  const hit=current.action&&current.times.some(s=>Math.abs(s-t)<.01);
  // Keep checking short gestures with pose/hands; expensive object checks can rest briefly.
  if(hit&&['Waving Hand','Sleeping Posture'].includes(current.action)&&t>=skipObjectsUntil)skipObjectsUntil=t+3;
  const last=Math.max(0,video.duration-.05);
  if(t>=last)break;
  let next=Math.min(last,t+(hit?recheckSeconds(current.action):.5));
  if(next-t>.5){
   next=await probe(t,next);
   if(next>t+.5)holds.push(heldPoint(current.action,t+.5,next,t));
   if(next<t+recheckSeconds(current.action)-.01)skipObjectsUntil=-Infinity;
  }
  stats.geometrySchedule.push({t,next,action:hit?current.action:null,objectsSkipped:skipObjects});
  t=next;
  await pause();
 }
 return {rows,holds};
 }finally{poseTask.close();handTask?.close()}
}
export async function analyzeOurSolution({video,signal,onProgress=()=>{},adaptive=true}){
 if(!(video.duration>0&&video.videoWidth>0))throw Error('请先加载可解码视频');
 const began=performance.now(),entry=await loadOurSolution({signal,onProgress}),modelSetupMs=Math.round(performance.now()-began);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=182;const ctx=canvas.getContext('2d',{willReadFrequently:true});
 video.pause();
 const stats={adaptive,modelSetupMs,geometrySetupMs:0,clipRuns:0,objectRuns:0,phoneRoiRuns:0,poseRuns:0,handRuns:0,sceneProbes:0,sceneInterruptions:0,geometrySchedule:[]};
 const probe=createSceneProbe(video,seekVideo,signal,stats),windows=[],clipHolds=[];let inferenceMs=0,stable=0,previous=null;
 for(let start=0;start<video.duration-.05;){
  const end=Math.min(start+2.6,video.duration);onProgress('动作识别：'+start.toFixed(1)+'/'+video.duration.toFixed(1)+'秒',{current:start,total:video.duration});
  const input=new Float32Array(3*13*182*182);
  for(let k=0;k<13;k++){
   abort(signal);await seekVideo(video,Math.min(video.duration-.035,start+(end-start-.035)*k/12),()=>signal?.aborted);
   writeClipFrame(input,sampleClipRGB(ctx,video),k);await pause();
  }
  const t=performance.now(),out=await entry.session.run({video:new entry.ort.Tensor('float32',input,[1,3,13,182,182])});abort(signal);
  inferenceMs+=performance.now()-t;stats.clipRuns++;const logits=out.logits.data;
  if(logits.length!==400||!logits.every(Number.isFinite))throw Error('动作模型输出无效');
  const scores=softmax(logits),ranked=scores.map((score,id)=>({score,id,label:entry.labels[id]})).sort((a,b)=>b.score-a.score),top=ranked[0];
  const action=top.score>=.25?CLASS_MAP[top.label]||null:null;
  windows.push({t:start,start_sec:start,windowEnd:end,end_sec:end,rawLabel:top.label,action,score:top.score,top5:ranked.slice(0,5)});
  stable=action&&action===previous?stable+1:action?1:0;previous=action;
  let next=end;
  if(adaptive&&stable>=2&&recheckSeconds(action)>.5&&end<video.duration-.05){
   next=await probe(end,Math.min(video.duration,end+recheckSeconds(action)));
   if(next>end)clipHolds.push(heldPoint(action,end,next,end-.035));
  }
  start=next;
 }
 let action=clipDecision(windows),decision={action,method:'x3d_clip_vote'},observations=[],holds=clipHolds;
 if(!action){const scan=await analyzeGeometry(video,entry,signal,onProgress,adaptive,stats);observations=scan.rows;holds=scan.holds;decision=spatialDecision(observations);action=decision.action}
 abort(signal);
 const points=decision.method==='x3d_clip_vote'?windows.map(w=>({t:w.t,windowEnd:w.windowEnd,label:w.action||'未识别',score:w.action?w.score:null,rule:false})):
 observations.map(o=>({t:o.t,windowEnd:Math.min(o.t+.5,video.duration),label:decision.times.some(t=>Math.abs(t-o.t)<.01)?action:'未识别',score:null,rule:!!action,personBox:o.personBox}));
 points.push(...holds);points.sort((a,b)=>a.t-b.t);
 return {action,label:ACTION_LABELS[action]||'未识别',method:decision.method,evidence:decision.evidence||windows,
  frameTop1:points,duration:video.duration,windows,observations,
  actorTrack:observations.map(o=>({t:o.t,box:o.personBox})),needsPlaybackTracking:holds.length>0||observations.some(o=>o.objectsSkipped),
  holds,performance:stats,
  buildId:OUR_SOLUTION_BUILD,modelSha256:entry.manifest.files['x3d_s.onnx'].sha256,framesProcessed:windows.length*13+observations.length,
  clipInferenceMs:Math.round(inferenceMs),totalMs:Math.round(performance.now()-began),runtime:'browser-wasm',sampleAnswerLookup:false};
}

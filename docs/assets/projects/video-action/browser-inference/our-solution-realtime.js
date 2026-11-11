// Latest-frame scheduling: no decoded-video scan, seek loop, or inference backlog.
let engine=null,loading=null;
const CLIP_WINDOW_SECONDS=2.6;
const SLEEP_DISPLAY_SECONDS=1.05;
const percentile=(a,p)=>a.length?[...a].sort((x,y)=>x-y)[Math.min(a.length-1,Math.floor(a.length*p))]:0;

export function resolveLivePoint(observation,windows,lastWaveAt,duration){
 const {t,assumed,observedAt,fallDisplayUntil}=observation;
 const native=windows.at(-1),previous=windows.at(-2);
 const spatial=observation.action==='Sleeping Posture'&&!native?null:observation.action;
 // A single ballet prediction can mistake raised arms for dance. Overlapping wave
 // evidence requires corroboration from the preceding dance window.
 const repeatedBallet=previous?.action==='Dancing Ballet'&&previous.score>=.65&&
   native?.score>=.65&&native.t-previous.t<=CLIP_WINDOW_SECONDS;
 const ambiguousBallet=native?.action==='Dancing Ballet'&&!repeatedBallet&&
   (native.score<.8||lastWaveAt>=native.t-CLIP_WINDOW_SECONDS);
 const temporal=spatial!=='Falling Down'&&native?.action&&!ambiguousBallet&&
   t>=native.t&&t-native.t<=CLIP_WINDOW_SECONDS&&(native.score>=.65||spatial!=='Using Phone')?native:null;
 const action=temporal?.action||spatial||null;
 // A stable posture may remain visible while waiting for the next observation.
 // A newer observation always supersedes this window, including an unknown label.
 const displaySeconds=action==='Sleeping Posture'?SLEEP_DISPLAY_SECONDS:temporal?1:.45;
 const windowEnd=Math.min(duration,Math.max(t+displaySeconds,fallDisplayUntil??0));
 const heldDetail=action==='Falling Down'?'摔倒后持续观察':'短时沿用 · 上次手机检测 '+observedAt.toFixed(1)+'秒';
 return {t,windowEnd,label:action||'未识别',score:temporal?.score??null,
   rule:!temporal&&!!spatial&&!assumed,assumed:!temporal&&!!spatial&&!!assumed,observedAt,
   liveDetail:temporal?'近2.6秒片段 · 模型分数 '+(temporal.score*100).toFixed(1)+'%':assumed?heldDetail:'当前画面 · 轻量空间/姿态检测'};
}
export const realtimeReady=()=>!!engine;
export async function prepareRealtime(signal,onProgress){
 if(signal.aborted)throw Error('用户取消');
 let cancel;
 const cancelled=new Promise((_,reject)=>{cancel=()=>reject(Error('用户取消'));signal.addEventListener('abort',cancel,{once:true})});
 try{await Promise.race([loadRealtime({onProgress:message=>{if(!signal.aborted)onProgress(message)}}),cancelled])}
 finally{signal.removeEventListener('abort',cancel)}
}
export async function loadRealtime({onProgress=()=>{}}={}){
 if(engine?.clipError){engine.perception.terminate();engine.clip.terminate();engine=null}
 if(engine)return engine;if(loading)return loading;
 loading=(async()=>{
  const perception=new Worker(new URL('./our-solution-live-worker.js',import.meta.url));
  const clip=new Worker(new URL('./our-solution-clip-worker.js',import.meta.url),{type:'module'});
  const value={perception,clip,clipReady:false,listener:null,generation:0};
  const clipError=m=>{value.clipError=m.message;value.listener?.('clip',m)};
  clip.onmessage=({data:m})=>{if(m.type==='ready')value.clipReady=true;else if(m.type==='progress')onProgress(m.message);else if(m.type==='error')clipError(m);else value.listener?.('clip',m)};
  clip.onerror=e=>clipError({type:'error',message:e.message});
  clip.postMessage({type:'init'});
  await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(Error('实时模型加载超时')),60000);
   const finish=(callback,value)=>{clearTimeout(timer);callback(value)};
   perception.onmessage=({data:m})=>{
    if(m.type==='ready')finish(resolve);else if(m.type==='progress')onProgress(m.message);else if(m.type==='error')finish(reject,Error(m.message));
   };
   perception.onerror=e=>finish(reject,Error(e.message));perception.postMessage({type:'init'});
  }).catch(e=>{perception.terminate();clip.terminate();throw e});
  perception.onmessage=({data:m})=>value.listener?.('perception',m);
  perception.onerror=e=>value.listener?.('perception',{type:'error',message:e.message});
  engine=value;return value;
 })();
 try{return await loading}finally{loading=null}
}

export async function playRealtime({video,signal,onFrame=()=>{},onProgress=()=>{}}){
 const setup=performance.now(),e=await loadRealtime({onProgress});
 if(signal?.aborted)throw Error('用户取消');
 if(e.clipError)throw Error(e.clipError);
 const startupMs=performance.now()-setup,observations=[],nativeWindows=[],track=[],points=[];
 const latencies=[],taskTimes=[],clipTimes=[];let busy=false,clipBusy=false,stopped=false,generation=++e.generation;
 let lastFrame=-1,lastClip=-1,lastRequest=-Infinity,lastWaveAt=-Infinity,frames=[],token=0,requested=0,skipped=0,firstHitMs=null;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=182;const ctx=canvas.getContext('2d',{willReadFrequently:true});
 const capture=document.createElement('canvas');const factor=Math.min(1,640/video.videoWidth);capture.width=Math.round(video.videoWidth*factor);capture.height=Math.round(video.videoHeight*factor);const captureCtx=capture.getContext('2d');
 const started=performance.now(),source=video.currentSrc;
 let resolveEnd,rejectEnd;const done=new Promise((resolve,reject)=>{resolveEnd=resolve;rejectEnd=reject});
 const reset=()=>{generation=++e.generation;frames=[];busy=false;clipBusy=false;firstHitMs=null;lastFrame=-1;lastClip=-1;lastRequest=lastWaveAt=-Infinity;
  observations.length=0;nativeWindows.length=0;track.length=0;points.length=0;e.perception.postMessage({type:'reset',generation});onFrame({reset:true});};
 e.perception.postMessage({type:'reset',generation});
 e.listener=(kind,m)=>{
  if(stopped)return;
  if(m.type==='error'){if(m.generation===undefined||m.generation===generation)rejectEnd(Error(m.message));return}
  if(kind==='clip'&&m.type==='clip'){
   if(m.generation!==generation)return;clipBusy=false;
   nativeWindows.push(m);clipTimes.push(m.inferenceMs);return;
  }
  if(kind!=='perception')return;
  if(m.type==='done'){if(m.generation===generation)busy=false;return}
  if(m.type!=='frame'||m.generation!==generation)return;
  const age=(video.currentTime-m.t)*1000;latencies.push(Math.max(0,age));taskTimes.push(m.inferenceMs);
  observations.push(m);if(age>900)return; // An old answer must not be painted onto a new scene.
  if(m.action==='Waving Hand')lastWaveAt=m.t;
  const point=resolveLivePoint(m,nativeWindows,lastWaveAt,video.duration);
  const action=point.label==='未识别'?null:point.label;
  points.push(point);track.push({t:m.t,box:m.personBox,source:m.boxSource});
  if(action&&firstHitMs===null)firstHitMs=performance.now()-started;
  onFrame({point,track,observations:observations.length,action,perceptionMs:m.inferenceMs,
   latencyMs:Math.max(0,age),elapsedMs:performance.now()-started});
 };
 const tick=(_,metadata)=>{
  if(stopped)return;
  if(signal?.aborted){rejectEnd(Error('用户取消'));return}
  if(video.ended){resolveEnd();return}
  const t=metadata?.mediaTime??video.currentTime;
  try{
  if(!video.paused&&!video.seeking&&video.readyState>=2){
   if(t-lastFrame>=.095){
    if(!busy){
     busy=true;lastFrame=t;requested++;
     const frameGeneration=generation;
     captureCtx.drawImage(video,0,0,capture.width,capture.height);
     createImageBitmap(capture).then(bitmap=>{
      if(stopped||frameGeneration!==generation){bitmap.close();return}
      e.perception.postMessage({type:'frame',generation:frameGeneration,t,bitmap,width:video.videoWidth,height:video.videoHeight},[bitmap]);
     }).catch(err=>{if(!stopped&&frameGeneration===generation)rejectEnd(err)});
    }else skipped++;
   }
   if(t-lastClip>=.195){
    const s=Math.min(video.videoWidth,video.videoHeight);ctx.drawImage(video,(video.videoWidth-s)/2,(video.videoHeight-s)/2,s,s,0,0,182,182);
    frames.push(ctx.getImageData(0,0,182,182).data);if(frames.length>13)frames.shift();lastClip=t;
    if(e.clipReady&&!clipBusy&&frames.length===13&&t-lastRequest>=1.3){
     const copies=frames.map(f=>f.slice());clipBusy=true;lastRequest=t;
     e.clip.postMessage({type:'clip',generation,t,frames:copies},copies.map(f=>f.buffer));
    }
   }
  }
  }catch(err){rejectEnd(err);return}
  if(video.requestVideoFrameCallback)token=video.requestVideoFrameCallback(tick);else token=requestAnimationFrame(tick);
 };
 const ended=()=>resolveEnd(),abort=()=>rejectEnd(Error('用户取消'));
 video.addEventListener('ended',ended);video.addEventListener('seeking',reset);signal?.addEventListener('abort',abort,{once:true});
 try{
  video.playbackRate=1;await Promise.all([video.play().then(()=>tick()),done]);
  const counts=new Map();for(const p of points)if(p.label!=='未识别')counts.set(p.label,(counts.get(p.label)||0)+1);
  return {mode:'realtime',action:[...counts].sort((a,b)=>b[1]-a[1])[0]?.[0]||null,frameTop1:points,actorTrack:track,
   observations,nativeWindows,duration:video.duration,source,framesProcessed:observations.length,sampleAnswerLookup:false,
   performance:{startupMs,playbackWallMs:performance.now()-started,firstHitMs,requested,skipped,queueLimit:1,
    processedFps:observations.length/Math.max(.001,(performance.now()-started)/1000),frameLatencyP95Ms:percentile(latencies,.95),
    perceptionP50Ms:percentile(taskTimes,.5),perceptionP95Ms:percentile(taskTimes,.95),clipP95Ms:percentile(clipTimes,.95),
    heavyYoloRuns:0,playbackRate:video.playbackRate}};
 }finally{
  stopped=true;e.listener=null;video.pause();
  if(video.cancelVideoFrameCallback)video.cancelVideoFrameCallback(token);else cancelAnimationFrame(token);
  video.removeEventListener('ended',ended);video.removeEventListener('seeking',reset);signal?.removeEventListener('abort',abort);
 }
}

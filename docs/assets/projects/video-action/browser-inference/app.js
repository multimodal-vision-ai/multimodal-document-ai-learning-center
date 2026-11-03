import {interpretAction,labelDisplay} from './semantic.js';
import {createPersonDetector,choosePrimaryPerson,mapBoxToContainedVideo,top1At} from './person-overlay.js';
import {OFFICIAL_MODELS,MODEL_REPO,validateStreamingContract,makeRGBFrameFromRGBA,runStreamingBatch} from './official-movinet.js';
import {VIDEOMAE,compileVideoMAE,sampleVideoMAEFrames,inferVideoMAE} from './video-mae.js';
import {MOBILECLIP,MOBILECLIP_LABELS,loadMobileCLIP,sampleMobileCLIPFrames,inferMobileCLIP,mobileCLIPReferenceRank,mobileCLIPModelName} from './mobileclip.js';
import {MOVINET_FPS,seekVideo,analyzeCompleteMoViNet,buildActionSegments} from './continuous-movinet.js';
import {scanPrimaryActor,actorBoxAt} from './person-target.js';
import {analyzeWindowedActor} from './continuous-segments.js';
// MVAI V1.0.3 experimental browser adapter. No fake outputs or sample fallback.
const $ = id => document.getElementById(id);
const OFFICIAL_MODEL_REVISION='d1ed47ef93682fbceda5c388277e34ed717dd4ab';
const MODEL_URL='https://huggingface.co/litert-community/MoViNet-A0-Stream-LiteRT/resolve/main/movinet_a0_stream.tflite';
const MODEL_SHA='0565d6e2173caf3e144e6a0a6461edfef9dc5cccacf9a093f311f8a8f05434c8';
const LABELS_URL='https://raw.githubusercontent.com/tensorflow/models/f8af2291cced43fc9f1d9b41ddbf772ae7b0d7d2/official/projects/movinet/files/kinetics_600_labels.txt';
const DATASET='multimodal-vision-ai/mvai-daily-action-demo';
const DIMS=[2,2,2,4,2,2,4,2,2,2,4];
const state={objectUrl:null,clip:null,catalog:null,model:null,api:null,labels:null,meta:null,busy:false,cancelled:false,last:null,runtimePromise:null,modelPromise:null,weightsPromise:null,labelsPromise:null,top1Timeline:[],annotatedLimit:0,selectedModel:'a0',officialModels:{},officialPromises:{},comparisonRows:{},videoKey:0,activeController:null,videomaeModel:null,videomaePromise:null,mobileclipModel:null,mobileclipPromise:null,k600Labels:null,outputMode:'stream',actorTrack:null,actorGrounded:false};
let config=null;
async function loadConfig(){const response=await fetch('./config.json',{cache:'no-store'});if(!response.ok)throw Error('本地配置 HTTP '+response.status);config=await response.json();if(config.dataset_id!==DATASET)throw Error('数据源配置错误');return config;}
const say=s=>{$('status').textContent=s;$('status').classList.toggle('error',/失败|未完成|错误|无效/.test(s));};
const record=(event,data)=>{state.last={...(state.last||{}),[event]:data, timestamp:new Date().toISOString()};$('diagnostics').textContent=JSON.stringify(state.last,null,2)};
$('info').onclick=()=>{$('intro').hidden=!$('intro').hidden};
$('compare-info').onclick=()=>{
 const panel=$('compare-help'),control=$('compare-info');
 panel.hidden=!panel.hidden;
 control.setAttribute('aria-expanded',String(!panel.hidden));
};
function activeModelReady(){return state.selectedModel==='mobileclip_s0'?!!state.mobileclipModel:state.selectedModel==='videomae'?!!state.videomaeModel:state.selectedModel==='a0'?!!state.model:!!state.officialModels[state.selectedModel]}
function setBusy(b){state.busy=b;$('probe').disabled=b;$('run').disabled=b||!$('video').getAttribute('src');$('upload').disabled=b;$('model').disabled=b;document.querySelectorAll('.sample-list button').forEach(btn=>btn.disabled=b);$('model-state').textContent=b?'正在处理…':activeModelReady()?'模型已就绪':'尚未加载';updateComparisonSelection();}
// Person detector runs entirely in browser, independently from the MoViNet action model.
const personState={model:null,loadPromise:null,lastSampleMs:0,lastTime:-1,box:null,count:0,generation:0,error:null};
const personStatus=msg=>{$('person-detector-status').textContent=msg};
function clearPersonOverlay(){
 const canvas=$('person-box-layer');
 if(!canvas)return;
 const ctx=canvas.getContext('2d');if(ctx)ctx.clearRect(0,0,canvas.width,canvas.height);
 // When the tracked actor is missing (or the box is disabled), retain the
 // truthful Top-1 / 'no person' text instead of leaving the replay blank.
 $('top1-overlay').hidden=false;
}
function drawPersonOverlay(){
 const video=$('annotated-video'),canvas=$('person-box-layer'),enabled=$('person-box-toggle').checked;
 const currentBox=state.actorGrounded?actorBoxAt(state.actorTrack,video.currentTime):personState.box;
 if(!canvas||!enabled||!currentBox||!state.top1Timeline.length||video.currentTime>state.annotatedLimit+.005){
   clearPersonOverlay();return;
 }
 const width=video.clientWidth,height=video.clientHeight;
 if(width<=0||height<=0)return;
 const pixelRatio=Math.min(window.devicePixelRatio||1,2);
 const W=Math.round(width*pixelRatio),H=Math.round(height*pixelRatio);
 if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}
 const ctx=canvas.getContext('2d');
 ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);ctx.clearRect(0,0,width,height);
 const coords=mapBoxToContainedVideo(currentBox,video.videoWidth,video.videoHeight,width,height);
 if(!coords){clearPersonOverlay();return}
 const action=top1At(state.top1Timeline,video.currentTime,state.annotatedLimit);
 if(!action||action.missing){clearPersonOverlay();return}
 // The label belongs to the same tracked-person crop fed to the selected model.
 // Streaming logits and 4-second clip/semantic scores remain distinct modalities.
 ctx.lineWidth=3;ctx.strokeStyle='#39e5ad';ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=3;
 ctx.strokeRect(coords.x+1.5,coords.y+1.5,Math.max(0,coords.w-3),Math.max(0,coords.h-3));ctx.shadowBlur=0;
 const title=action.label+' · '+(action.score*100).toFixed(1)+'%';
 const disclaimer=state.actorGrounded?(state.outputMode==='stream'?'框内人物 · 流式分类':state.outputMode==='clip'?'框内人物 · 片段分类':'框内人物 · 图文匹配'):'画面 Top-1（非人物独立分类）';
 ctx.font='bold 14px system-ui,sans-serif';
 const tw=ctx.measureText(title).width;
 ctx.font='11px system-ui,sans-serif';
 const dw=ctx.measureText(disclaimer).width;
 const boxWidth=Math.min(width-8,Math.max(tw,dw)+18);
 const tagX=Math.max(4,Math.min(coords.x,width-boxWidth-4));
 const tagY=coords.y>55?coords.y-48:Math.min(height-47,coords.y+4);
 ctx.fillStyle='rgba(8,31,49,.91)';ctx.fillRect(tagX,tagY,boxWidth,42);
 ctx.fillStyle='#fff';ctx.font='bold 14px system-ui,sans-serif';ctx.fillText(title,tagX+9,tagY+17,boxWidth-16);
 ctx.fillStyle='#c1e7df';ctx.font='11px system-ui,sans-serif';ctx.fillText(disclaimer,tagX+9,tagY+33,boxWidth-16);
 $('top1-overlay').hidden=true;
}
function detectPersonFrame(force=false){
 const video=$('annotated-video');
 if(!personState.model||!$('person-box-toggle').checked||$('annotated-section').hidden||video.readyState<2||!video.videoWidth)return;
 if(video.currentTime>state.annotatedLimit+.005){personState.box=null;drawPersonOverlay();return}
 if(state.actorGrounded){drawPersonOverlay();return}
 const ms=performance.now();
 if(!force&&(ms-personState.lastSampleMs<400||Math.abs(video.currentTime-personState.lastTime)<.1))return;
 personState.lastSampleMs=ms;personState.lastTime=video.currentTime;
 try{
   const result=personState.model.detect(video);
   const selected=choosePrimaryPerson(result.detections,video.videoWidth,video.videoHeight);
   personState.box=selected.person?.boundingBox||null;
   personState.count=selected.candidateCount;
   personStatus(selected.person?(selected.candidateCount>1?'检测到 '+selected.candidateCount+' 人，仅显示画面最大主人物':'已定位主人物'):'当前画面未检测到可信人物；不生成该时刻人物动作结论');
   drawPersonOverlay();
 }catch(e){personState.box=null;personState.error=String(e);personStatus('人物检测失败：'+e.message+'；已保留文本结果，不伪造人物框');drawPersonOverlay()}
}
async function ensurePersonDetector(){
 if(!$('person-box-toggle').checked||$('annotated-section').hidden)return;
 if(state.actorGrounded){drawPersonOverlay();return}
 if(personState.model){detectPersonFrame(true);return}
 if(personState.loadPromise)return personState.loadPromise;
 const generation=personState.generation;
 personStatus('正在下载 MediaPipe EfficientDet-Lite0 人物检测器（仅首次）…');
 personState.loadPromise=createPersonDetector().then(detector=>{
   personState.model=detector;
   if(generation===personState.generation&&!$('annotated-section').hidden){personStatus('人物检测器就绪，正在定位主人物…');detectPersonFrame(true)}
   return detector;
 }).catch(e=>{
   personState.error=String(e);
   personStatus('人物检测模型加载失败：'+e.message+'；保留文本结果，不伪造人物框');
   clearPersonOverlay();
   return null;
 }).finally(()=>{personState.loadPromise=null});
 return personState.loadPromise;
}
$('person-box-toggle').addEventListener('change',()=>{
 if(!$('person-box-toggle').checked){
   personState.box=null;clearPersonOverlay();personStatus('人物框已关闭；分类结果仍在画面角落显示');
 }else{
   ensurePersonDetector();
 }
});
async function getActorDetector(){
 if(personState.model)return personState.model;
 if(personState.loadPromise){
   const model=await personState.loadPromise;
   if(!model)throw Error('主要人物检测器未能加载');
   return model;
 }
 personStatus('正在加载主要人物检测模型…');
 const promise=createPersonDetector();
 personState.loadPromise=promise;
 try{
   const detector=await promise;
   personState.model=detector;
   personStatus('人物检测模型已就绪');
   return detector;
 }finally{personState.loadPromise=null}
}
function syncModelDescription(){
  if(state.selectedModel==='a0')$('model-description').textContent='MoViNet-A0 · WASM CPU · K600 · 15.1 MB · 5 FPS · 完整视频连续推理';
  else if(state.selectedModel==='videomae')$('model-description').textContent='Qualcomm VideoMAE · 351 MB · Kinetics-400 · 对完整视频逐 4 秒片段采样 16 帧分类；非流式，研究实验模型';
   else if(state.selectedModel==='mobileclip_s0')$('model-description').textContent='Apple MobileCLIP-S0 · WebGPU/fp16，失败尝试 WASM/q8 · 对完整视频每 4 秒采样 6 张人物关键帧 · 六类文本语义匹配，非时序动作分类';
  else $('model-description').textContent='Google MoViNet-'+state.selectedModel.toUpperCase()+' · K600 · '+(OFFICIAL_MODELS[state.selectedModel].bytes/1e6).toFixed(1)+' MB · '+OFFICIAL_MODELS[state.selectedModel].size+'×'+OFFICIAL_MODELS[state.selectedModel].size+' · 5 FPS · 完整视频连续推理';
}
$('model').addEventListener('change',()=>{
  if(state.busy)return;
  state.selectedModel=$('model').value;
  hideAnnotated();
  $('results').textContent='请选择模型并运行真实推理。';
  $('evaluation').textContent='Top-5 只展示原始英文类别，具体动作语义解释将在推理后出现。';
  $('metrics').replaceChildren();
  $('model-state').textContent=activeModelReady()?'模型已就绪':'尚未加载';
  syncModelDescription();
  say('已切换到 '+$('model').selectedOptions[0].textContent+'；模型将按需加载，原视频保持不变。');
});
async function ensureVideoMAEModel(signal){
 if(state.videomaeModel){state.labels=state.videomaeModel.labels;return state.videomaeModel}
 if(state.videomaePromise)return state.videomaePromise;
 const promise=(async()=>{
   const api=state.api||await import('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/+esm');
   state.api=api;
   const result=await compileVideoMAE({
     api,
     loadRuntime:()=>{
       if(!state.runtimePromise)state.runtimePromise=api.loadLiteRt('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/wasm/')
         .catch(e=>{state.runtimePromise=null;throw e});
       return state.runtimePromise;
     },
     onProgress:say,
     signal
   });
   state.videomaeModel=result;state.labels=result.labels;
   record('model_compiled',{variant:'videomae',bytes:result.bytes,sha256:result.sha256,
      inputs:1,outputs:1,classes:400,source:VIDEOMAE.url});
   return result;
 })();
 state.videomaePromise=promise;
 try{return await promise}finally{state.videomaePromise=null}
}
async function ensureOfficialModel(variant){
  const spec=OFFICIAL_MODELS[variant];
  if(!spec)throw Error('Unknown selected model variant');
  if(state.officialModels[variant]){state.labels=state.k600Labels||await state.labelsPromise;return state.officialModels[variant]}
  if(state.officialPromises[variant])return state.officialPromises[variant];
  const loading=(async()=>{
    say('正在下载 '+spec.label+'（'+(spec.bytes/1e6).toFixed(1)+' MB），首次使用需校验 SHA256…');
    const filename='movinet_'+variant+'_stream.tflite';
    const remote='https://huggingface.co/'+MODEL_REPO+'/resolve/'+OFFICIAL_MODEL_REVISION+'/'+filename;
    const response=await fetch(remote);
    if(!response.ok)throw Error('HF 模型权重 HTTP '+response.status);
    const bytes=await response.arrayBuffer();
    if(bytes.byteLength!==spec.bytes)throw Error('模型大小与验证记录不符');
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('');
    if(hash!==spec.sha256)throw Error('模型 SHA256 校验失败');
    const api=state.api||await import('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/+esm');
    state.api=api;
    if(!state.runtimePromise)state.runtimePromise=api.loadLiteRt('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/wasm/').catch(e=>{state.runtimePromise=null;throw e});
    await state.runtimePromise;
    say('正在编译 '+spec.label+'（WASM CPU）…');
    const model=await api.loadAndCompile(new Uint8Array(bytes),{accelerator:'wasm'});
    const contract=validateStreamingContract(model.getInputDetails(),model.getOutputDetails(),variant);
    if(!state.labelsPromise)state.labelsPromise=fetch(LABELS_URL).then(async r=>{if(!r.ok)throw Error('类别表下载失败');return (await r.text()).trim().split(/\r?\n/)}).catch(e=>{state.labelsPromise=null;throw e});
    const labels=await state.labelsPromise;
    if(labels.length!==600)throw Error('动作标签不是 600 类');
    state.k600Labels=labels;state.labels=labels;
    const result={model,contract,bytes:spec.bytes,sha256:hash};
    state.officialModels[variant]=result;
    record('model_compiled',{variant,sha256:hash,bytes:bytes.byteLength,inputs:contract.inputs.length,outputs:contract.outputs.length,inputName:contract.image.name,outputName:contract.logits.name});
    return result;
  })();
  state.officialPromises[variant]=loading;
  try{return await loading}finally{delete state.officialPromises[variant]}
}
async function readOfficialFrames(video,size){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 if(!Number.isFinite(video.duration)||video.duration<=0)throw Error('视频没有有效时长');
 const frames=[],times=[];
 const start=performance.now(),duration=Math.min(8,video.duration);
 for(let t=0;t<duration&&frames.length<40;t+=.2){
   if(state.cancelled)throw Error('用户取消');
   const target=Math.min(t,Math.max(0,video.duration-.001));
   if(Math.abs(video.currentTime-target)>=.005||video.readyState<2)
     await new Promise((resolve,reject)=>{
       const tm=setTimeout(()=>reject(Error('视频解码超时')),10000);
       video.addEventListener('seeked',()=>{clearTimeout(tm);resolve()},{once:true});
       video.currentTime=target;
     });
   ctx.drawImage(video,0,0,size,size);
   frames.push(makeRGBFrameFromRGBA(ctx.getImageData(0,0,size,size).data,size));
   times.push(target);
 }
 return {frames,times,decodeMs:performance.now()-start};
}
function hideAnnotated(){
  personState.generation++;personState.box=null;personState.count=0;personState.lastTime=-1;state.actorTrack=null;state.actorGrounded=false;clearPersonOverlay();
  const video=$('annotated-video');
  video.pause();video.removeAttribute('src');video.load();
  $('annotated-section').hidden=true;
  $('top1-overlay').textContent='等待推理';
  $('annotation-summary').textContent='';
  state.top1Timeline=[];state.annotatedLimit=0;state.outputMode='stream';
  $('action-timeline').hidden=true;$('timeline-track').replaceChildren();$('timeline-segments').replaceChildren();
}

function timeLabel(t){
 const sec=Math.max(0,Math.floor(t));
 return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');
}
function updateTimelineCursor(){
 if($('action-timeline').hidden||!state.annotatedLimit)return;
 $('timeline-cursor').style.left=Math.max(0,Math.min(100,
  100*$('annotated-video').currentTime/state.annotatedLimit))+'%';
}
function renderActionTimeline(points,duration,windowed=false){
 const panel=$('action-timeline'),track=$('timeline-track'),details=$('timeline-segments');
 track.replaceChildren();details.replaceChildren();
 const segments=buildActionSegments(points,duration,{windowSize:windowed?1:5});
 if(!segments.length){panel.hidden=true;return}
 $('timeline-duration').textContent=points.length+(windowed?' 个实际片段结果':' 个逐帧采样点')+' · '+timeLabel(duration);
 $('timeline-scale-end').textContent=timeLabel(duration);
 const palette=['#bdddf5','#bfe5d4','#f9dfb3','#ddcef8','#f6cdd7','#c5e6ec','#f4ddb5'];
 const seek=t=>{
   const replay=$('annotated-video');
   if(replay.getAttribute('src')){replay.currentTime=Math.min(t,Math.max(0,duration-.001));updateTimelineCursor();updateTop1Overlay()}
 };
 for(const part of segments){
   const percent=Math.max(0,100*(part.end-part.start)/duration);
   const label=timeLabel(part.start)+'–'+timeLabel(part.end)+' · '+part.label;
   let hash=0;for(const ch of part.label)hash=(hash*31+ch.codePointAt(0))>>>0;
   const segment=document.createElement('button');segment.type='button';
   segment.style.width=percent+'%';segment.style.backgroundColor=palette[hash%palette.length];
   segment.textContent=percent>=12?part.label:'';
   segment.title=label;segment.setAttribute('aria-label',label);
   segment.onclick=()=>seek(part.start);track.append(segment);
   const detail=document.createElement('button');detail.type='button';
   detail.textContent=label;detail.onclick=()=>seek(part.start);details.append(detail);
 }
 panel.hidden=false;updateTimelineCursor();
}
function updateTop1Overlay(){
  const video=$('annotated-video'),overlay=$('top1-overlay');
  const timeline=state.top1Timeline;
  if(!timeline.length||!Number.isFinite(video.currentTime))return;
  overlay.replaceChildren();
  const title=document.createElement('small');title.textContent=state.outputMode==='semantic'?'MobileCLIP · 4 秒片段匹配':state.outputMode==='clip'?'VideoMAE · 4 秒片段 Top-1':'MoViNet 人物流式 Top-1 · 每 0.2 秒';
  const name=document.createElement('strong');const score=document.createElement('small');
  if(video.currentTime>state.annotatedLimit+0.005){
    name.textContent='超出已分析范围';
    score.textContent='已分析时长 '+state.annotatedLimit.toFixed(1)+' 秒';
  }else{
    // Streaming scores are cumulative as of the sampled time; no interpolation or fabricated predictions.
    const time=video.currentTime;
    let idx=0;for(let i=1;i<timeline.length;i++){if(timeline[i].t<=time+0.001)idx=i;else break}
    const point=timeline[idx];
    name.textContent=point.missing?'未检测到可信人物':labelDisplay(point.label);
    score.textContent=point.missing?'该区间没有执行人物动作推理':(point.score*100).toFixed(1)+'% · '+(state.outputMode==='semantic'?'片段 6 帧语义匹配':state.outputMode==='clip'?'片段 16 帧分类':'t='+point.t.toFixed(1)+'s')+'（未校准分数）';
  }
  overlay.append(title,name,score);
  updateTimelineCursor();drawPersonOverlay();
}
async function showAnnotated(timeline,limit,isClipLevel=false,isSemantic=false){
  if(!timeline.length)throw Error('逐帧 Top-1 记录为空');
  const src=$('video').currentSrc||$('video').src;
  if(!src)throw Error('原视频资源为空');
  const dest=$('annotated-video');
  if(src.startsWith('blob:'))dest.removeAttribute('crossorigin');else dest.crossOrigin='anonymous';
  state.top1Timeline=timeline;state.annotatedLimit=limit;state.outputMode=isSemantic?'semantic':isClipLevel?'clip':'stream';
  state.actorGrounded=!!state.actorTrack?.length;
  dest.muted=true;dest.src=src;dest.load();
  $('annotation-summary').textContent=isSemantic?'MobileCLIP 对主要人物裁剪后的关键帧分段图文匹配；不是视频动作时序分类。':isClipLevel?'VideoMAE 以主要人物裁剪区域为输入，逐段采样 16 帧分类；每段预测不等于逐帧识别。':'已记录 '+timeline.length+' 个流式预测点（5 FPS，分析 '+limit.toFixed(1)+' 秒）；实际输入为主要人物跟踪裁剪区域，显示逐采样时刻的模型预测。';
  $('annotated-section').hidden=false;
  $('annotated-section').querySelector('h2').textContent=isSemantic?'04 · 推理结果视频（MobileCLIP 语义匹配 + 人物框）':isClipLevel?'04 · 推理结果视频（整段 VideoMAE Top-1 + 人物框）':'04 · 推理结果视频（人物框 + 逐帧 Top-1）';
  // Showing the overlay without a decoded video frame would be misleading.
  await new Promise((resolve,reject)=>{
    if(dest.readyState>=2&&dest.videoWidth>0){resolve();return}
    let timer;
    const clean=()=>{clearTimeout(timer);dest.removeEventListener('loadeddata',ready);dest.removeEventListener('error',failed)};
    const ready=()=>{if(dest.videoWidth>0){clean();resolve()}};
    const failed=()=>{clean();reject(Error('结果视频无法解码或媒体请求失败'))};
    timer=setTimeout(()=>{clean();reject(Error('结果视频画面加载超时'))},25000);
    dest.addEventListener('loadeddata',ready);dest.addEventListener('error',failed);
  });
  dest.currentTime=0;
  updateTop1Overlay();
  if($('person-box-toggle').checked)void ensurePersonDetector();
  dest.play().catch(()=>{}); // optional muted autoplay; manual playback always available
}
const replayVideo=$('annotated-video');
replayVideo.addEventListener('timeupdate',updateTop1Overlay);
replayVideo.addEventListener('seeked',()=>{updateTop1Overlay();detectPersonFrame(true)});
replayVideo.addEventListener('loadedmetadata',()=>{updateTop1Overlay();detectPersonFrame(true)});
let overlayRaf=0;
const renderPlayback=()=>{updateTop1Overlay();detectPersonFrame();if(!replayVideo.paused&&!replayVideo.ended)overlayRaf=requestAnimationFrame(renderPlayback)};
replayVideo.addEventListener('play',()=>{cancelAnimationFrame(overlayRaf);overlayRaf=requestAnimationFrame(renderPlayback)});
replayVideo.addEventListener('pause',()=>{cancelAnimationFrame(overlayRaf);updateTop1Overlay();detectPersonFrame(true)});
replayVideo.addEventListener('ended',()=>{cancelAnimationFrame(overlayRaf);updateTop1Overlay()});
function pick(url,clip=null){if(state.busy)return;state.videoKey++;state.comparisonRows={};for(const el of compareInputs())el.checked=false;updateComparisonSelection();hideAnnotated();if(state.objectUrl){URL.revokeObjectURL(state.objectUrl);state.objectUrl=null}state.clip=clip;if(url.startsWith('blob:'))$('video').removeAttribute('crossorigin');else{$('video').crossOrigin='anonymous';$('upload').value=''}$('video').src=url;$('results').textContent='等待真实推理。';$('evaluation').textContent='点击「开始识别」后，将按参考标签及语义关联解释结果。';$('metrics').replaceChildren();$('reference').textContent=clip?'参考动作：'+clip.label_zh+' / '+clip.label_en:'参考动作：本地文件，无标注';$('provenance').replaceChildren();if(clip){const desc=document.createElement('span');desc.textContent='类型：'+(clip.synthetic?'合成测试':'真实来源视频')+' · 参考标签：'+(clip.reference_evidence||clip.evidence||'来源描述')+' · 作者：'+(clip.attribution||'见来源页')+' · 许可：'+clip.license+' · ';const link=document.createElement('a');link.href=clip.source_url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='查看原始视频及授权';$('provenance').append(desc,link)}else $('provenance').textContent='本地上传 · 仅在此浏览器读取';$('run').disabled=state.busy||!$('video').getAttribute('src');updateComparisonSelection();if(!state.busy)say('已选择'+(clip?.label_zh?'「'+clip.label_zh+'」':'本地视频')+'；点击「开始识别」后将在浏览器执行真实推理。')}
$('upload').onchange=e=>{const f=e.target.files?.[0];if(!f)return;if(!['video/mp4','video/webm'].includes(f.type)){say('仅支持 MP4/WebM');return}if(f.size>120*1024*1024){say('文件超过 120 MB 的预览安全上限');return}const url=URL.createObjectURL(f);pick(url);state.objectUrl=url;};
$('reset').onclick=()=>{if(state.busy){say('请先取消正在运行的推理，再清除视频。');return}state.cancelled=true;state.videoKey++;state.comparisonRows={};for(const el of compareInputs())el.checked=false;updateComparisonSelection();hideAnnotated();$('video').removeAttribute('src');$('video').load();$('results').textContent='已清除结果';$('evaluation').textContent='请选择视频并运行识别';$('metrics').replaceChildren();state.clip=null;if(state.objectUrl){URL.revokeObjectURL(state.objectUrl);state.objectUrl=null;}$('reference').textContent='参考动作：未选择样例';$('run').disabled=true;updateComparisonSelection();say('已清除当前视频')};
$('cancel').onclick=()=>{state.cancelled=true;state.activeController?.abort();say('已请求取消；下载立即中断，WASM 调用结束后停止。')};
$('export').onclick=()=>{const b=new Blob([JSON.stringify(state.last||{},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='mvai-v103-diagnostics.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
// V1.0.13: two independent bilingual sample sets. Only section 01 is changed.
const SAMPLE_GROUPS=[
 {id:'daily',listId:'sample-list-a',slots:[
  {id:'wave',zh:'挥手',en:'Waving Hand',match:c=>c.label_en==='waving hand'||c.id==='real_waving_hand_001'||c.standard_action_id==='wave'},
  {id:'phone_use',zh:'看手机',en:'Using Mobile Phone',match:c=>c.standard_action_id==='phone_use'},
  {id:'phone_call',zh:'打电话',en:'Talking on Cell Phone',match:c=>c.standard_action_id==='phone_call'&&c.id!=='real_landline_call_005'&&c.phone_type!=='landline'},
  {id:'falling',zh:'摔倒',en:'Falling Down',match:c=>c.standard_action_id==='falling'},
  {id:'eating',zh:'吃东西',en:'Eating Food',match:c=>c.standard_action_id==='eating'},
  {id:'sleep_posture',zh:'睡觉',en:'Sleeping',match:c=>c.standard_action_id==='sleep_posture'}
 ]},
 {id:'common',listId:'sample-list-b',slots:[
  {id:'jogging',zh:'慢跑',en:'Jogging',match:c=>c.standard_action_id==='jogging'},
  {id:'yoga',zh:'瑜伽',en:'Yoga',match:c=>c.standard_action_id==='yoga'},
  {id:'push_up',zh:'俯卧撑',en:'Push-up',match:c=>c.standard_action_id==='push_up'},
  {id:'sit_up',zh:'仰卧起坐',en:'Sit-up',match:c=>c.standard_action_id==='sit_up'},
  {id:'ballet',zh:'芭蕾舞',en:'Ballet',match:c=>c.standard_action_id==='ballet'},
  {id:'hula_hooping',zh:'呼啦圈',en:'Hula Hooping',match:c=>c.standard_action_id==='hula_hooping'}
 ]}
];
const goodSample=c=>{
 const relative=String(c?.relative_file||'');
 const file=relative.startsWith('demo/videos/')?relative.slice(12):'';
 const safeFile=!!(file&&[...file].every(ch=>'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-'.includes(ch))&&(file.endsWith('.mp4')||file.endsWith('.webm')));
 let safeExternal=false;
 try{
  const u=new URL(c?.video_url||'');
  safeExternal=u.protocol==='https:'&&['videos.pexels.com','upload.wikimedia.org'].includes(u.hostname);
 }catch{}
 const approvedDelivery=safeFile?c?.redistribution_approved===true:safeExternal&&c?.external_use_approved===true;
 return !!(c&&c.synthetic!==true&&c.status==='approved_demo'&&approvedDelivery&&c.license&&c.source_url&&(safeFile||safeExternal));
};
async function addDevFixture(reason){
 for(const group of SAMPLE_GROUPS){
  const box=$(group.listId);box.replaceChildren();
  for(const slot of group.slots){
   const btn=document.createElement('button');btn.type='button';btn.className='unavailable';btn.dataset.action=slot.id;btn.dataset.group=group.id;
   const zh=document.createElement('span');zh.className='sample-zh';zh.textContent=slot.zh;
   const en=document.createElement('span');en.className='sample-en';en.textContent=slot.en;
   btn.append(zh,en);btn.title='样例目录暂不可用';
   btn.onclick=()=>say('HF 真人视频目录暂不可用：'+reason+'。可上传本地视频。');
   box.append(btn);
  }
 }
 $('sample-status').textContent='样例目录加载失败：'+reason+'。可上传本地视频。';
 record('catalog_error',{reason});
}
async function catalog(){
 const cfg=await loadConfig();
 let revision=cfg.dataset_revision;
 let provisional=false;
 if(!/^[a-f0-9]{40}$/.test(revision||'')){
  const response=await fetch('https://huggingface.co/api/datasets/'+DATASET,{cache:'no-store'});
  if(!response.ok)throw Error('HF Dataset API HTTP '+response.status);
  const info=await response.json();
  revision=info.sha;
  if(!/^[a-f0-9]{40}$/.test(revision||''))throw Error('HF API 未返回有效的 commit SHA');
  provisional=true;
 }
 const r=await fetch('https://huggingface.co/datasets/'+DATASET+'/resolve/'+revision+'/catalog/v1.json',{cache:'no-store'});
 if(!r.ok)throw Error('HF catalog HTTP '+r.status+'（数据仓库可能尚未上传 catalog/v1.json）');
 const c=await r.json();
 if(c.schema_version!=='1.0'||c.dataset_id!==DATASET||!Array.isArray(c.items))throw Error('HF catalog schema 无效');
 state.catalog=c;
 const available=c.items.filter(goodSample);
 let enabledCount=0;
 const slotStatus=[];
 for(const group of SAMPLE_GROUPS){
  const box=$(group.listId);box.replaceChildren();
  let groupCount=0;
  for(const slot of group.slots){
   const clip=available.find(slot.match);
   const btn=document.createElement('button');btn.type='button';btn.dataset.action=slot.id;btn.dataset.group=group.id;
   const zh=document.createElement('span');zh.className='sample-zh';zh.textContent=slot.zh;
   const en=document.createElement('span');en.className='sample-en';en.textContent=slot.en;
   btn.append(zh,en);
   if(clip){
    enabledCount++;groupCount++;btn.dataset.clipId=clip.id;
    btn.setAttribute('aria-label','播放'+slot.zh+'（'+slot.en+'）实拍视频');
    btn.onclick=()=>{
     const videoUrl=clip.video_url||('https://huggingface.co/datasets/'+DATASET+'/resolve/'+revision+'/'+clip.relative_file);
     pick(videoUrl,clip);
     document.querySelectorAll('.sample-list button').forEach(item=>item.classList.toggle('active',item===btn));
     $('sample-status').textContent=slot.id==='phone_call'?'手机通话样例：手机需清晰可见，并与有线电话区分。':
      slot.id==='sleep_posture'?'睡觉样例展示可观察的卧床姿态，不证明人物生理上已经入睡。':
      slot.id==='falling'?'摔倒样例展示完整的失衡与倒地过程。':'';
    };
   }else{
    btn.className='unavailable';btn.title='尚无符合标准且已核验授权的实拍视频';
    btn.setAttribute('aria-label',slot.zh+'（'+slot.en+'）样例待入库');
    btn.onclick=()=>{
     document.querySelectorAll('.sample-list button').forEach(item=>item.classList.remove('active'));
     $('sample-status').textContent='「'+slot.zh+' / '+slot.en+'」暂无通过审核的视频样例，请勿用其他动作替代。';
     say('「'+slot.zh+' / '+slot.en+'」暂无已审核样例；可上传已授权本地视频。');
    };
   }
   box.append(btn);
  }
  slotStatus.push({group:group.id,available:groupCount,total:group.slots.length});
 }
 record('catalog',{revision,count:enabledCount,groups:slotStatus,provisional});
 if(!enabledCount)throw Error('HF catalog 尚无可用实拍演示样例');
 if(!state.clip){
  const first=document.querySelector('#sample-list-a button[data-action="wave"][data-clip-id]')||
   document.querySelector('.sample-list button[data-clip-id]');
  first?.click();
 }
}

catalog().catch(e=>{addDevFixture(e.message)});

function hex(bytes){return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')}
async function fetchChecked(){const t=performance.now();const r=await fetch(MODEL_URL);if(!r.ok)throw Error('模型下载 HTTP '+r.status);const buffer=await r.arrayBuffer();if(buffer.byteLength!==15131688)throw Error('模型文件大小不符：'+buffer.byteLength);if(!crypto.subtle)throw Error('浏览器不支持 SHA256 校验');const h=hex(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer)));if(h!==MODEL_SHA)throw Error('模型 SHA256 不符，拒绝运行');record('model_download',{bytes:buffer.byteLength,sha256:h,ms:Math.round(performance.now()-t)});return buffer}
function inputMetadata(model){const data= typeof model.getInputDetails==='function'?model.getInputDetails():model.inputDetails??model.inputs;return Array.isArray(data)?data:null}
async function ensureMobileCLIPModel(){
 if(state.mobileclipModel){state.labels=MOBILECLIP_LABELS;return state.mobileclipModel}
 if(state.mobileclipPromise)return state.mobileclipPromise;
 const task=(async()=>{
   const entry=await loadMobileCLIP({onProgress:say});
   state.mobileclipModel=entry;state.labels=MOBILECLIP_LABELS;
   record('model_compiled',{variant:MOBILECLIP.id,source:MOBILECLIP.modelId,backend:entry.backend,dtype:entry.dtype,weightSizeApproxMB:entry.weightsMB,webgpuFallbackReason:entry.webgpuError||null});
   return entry;
 })();
 state.mobileclipPromise=task;
 try{return await task}finally{state.mobileclipPromise=null}
}
async function ensureModelReady(signal){
  if(state.selectedModel==='mobileclip_s0')return ensureMobileCLIPModel();
  if(state.selectedModel==='videomae')return ensureVideoMAEModel(signal);
  if(state.selectedModel!=='a0')return ensureOfficialModel(state.selectedModel);
  if(state.model&&state.meta?.length===47&&state.k600Labels?.length===600){state.labels=state.k600Labels;return state.model}
  if(state.modelPromise)return state.modelPromise;
  const loading=(async()=>{
    say('正在检查模型文件与 SHA256…');
    if(!state.weightsPromise)state.weightsPromise=fetchChecked().catch(e=>{state.weightsPromise=null;throw e});
    const bytes=await state.weightsPromise;
    const api=await import('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/+esm');
    state.api=api;
    if(!state.runtimePromise){
      say('正在初始化 LiteRT.js CPU/WASM…');
      state.runtimePromise=api.loadLiteRt('https://cdn.jsdelivr.net/npm/@litertjs/core@2.5.3/wasm/').catch(e=>{state.runtimePromise=null;throw e});
    }
    await state.runtimePromise; // Reuse initialized LiteRT; it must never be loaded twice.
    say('正在编译 MoViNet-A0 Streaming 模型…');
    const model=await api.loadAndCompile(new Uint8Array(bytes),{accelerator:'wasm'});
    if(!state.labelsPromise)state.labelsPromise=fetch(LABELS_URL).then(async response=>{
      if(!response.ok)throw Error('Kinetics 标签下载失败 HTTP '+response.status);
      const labels=(await response.text()).trim().split(/\r?\n/);
      if(labels.length!==600)throw Error('Kinetics 标签数量错误：'+labels.length);
      return labels;
    }).catch(e=>{state.labelsPromise=null;throw e});
    const labels=await state.labelsPromise;
    const inputs=inputMetadata(model),outputs=model.getOutputDetails?.();
    if(!Array.isArray(inputs)||inputs.length!==47||!Array.isArray(outputs)||outputs.length!==28)
      throw Error('模型 I/O 检查失败：'+(inputs?.length??'?')+' 输入 / '+(outputs?.length??'?')+' 输出');
    state.model=model;state.meta=inputs;state.k600Labels=labels;state.labels=labels;
    record('browser_probe',{runtime:'@litertjs/core@2.5.3',accelerator:'wasm',modelSha256:MODEL_SHA,metadataInputs:47,metadataOutputs:28,compiled:true,userAgent:navigator.userAgent});
    record('model_io',{inputs:47,outputs:28,firstInput:inputs[0],firstOutput:outputs[0]});
    return model;
  })();
  state.modelPromise=loading;
  try{return await loading}finally{state.modelPromise=null}
}
async function probe(){
  if(state.busy)return;
  const variant=state.selectedModel;
  if(activeModelReady()){
    $('model-state').textContent='模型已就绪';
    const io=variant==='mobileclip_s0'?'6 帧文本匹配（'+state.mobileclipModel.backend+'）':variant==='videomae'?'1 输入 / 1 输出（16 帧 K400）':variant==='a0'?'47 输入 / 28 输出':'已验证 '+OFFICIAL_MODELS[variant].expectedInputs+' 输入 / '+OFFICIAL_MODELS[variant].expectedOutputs+' 输出';
    say(variant.toUpperCase()+' 浏览器模型已就绪；'+io+'。无需重复初始化。');
    return;
  }
  state.cancelled=false;
  state.activeController=new AbortController();
  setBusy(true);
  try{
    await ensureModelReady(state.activeController.signal);
    if(state.cancelled)throw Error('用户取消');
    const io=variant==='mobileclip_s0'?'六类关键帧匹配加载完成（'+state.mobileclipModel.backend+'）':variant==='videomae'?'16 帧 Kinetics400 单输入、400 类输出验证通过':variant==='a0'?'47 输入 / 28 输出元数据通过':OFFICIAL_MODELS[variant].expectedInputs+' 输入 / '+OFFICIAL_MODELS[variant].expectedOutputs+' 输出状态元数据通过';
    say(variant.toUpperCase()+' 模型已加载，'+io+'；可以开始识别。');
  }catch(e){say('WASM 加载失败：'+e.message);record('probe_error',{variant,message:e.message,stack:e.stack})}
  finally{state.activeController=null;setBusy(false)}
}
$('probe').onclick=probe;
function shapeOf(d){const raw=d?.shape??d?.dims??d?.dimensions??d?.shapeSignature;if(Array.isArray(raw))return raw.map(Number);if(raw&&typeof raw.length==='number')return Array.from(raw,Number);if(raw&&typeof raw[Symbol.iterator]==='function')return Array.from(raw,Number);return null}
function tensorFor(data,shape){return new state.api.Tensor(data,shape)}
const sizeOf=shape=>shape.reduce((a,b)=>a*b,1);
async function readFrames(video){if(!Number.isFinite(video.duration)||video.duration<=0){await new Promise((resolve,reject)=>{const fail=()=>{clearTimeout(timer);reject(Error('视频格式不支持或无法读取时长'))};const done=()=>{clearTimeout(timer);resolve()};const timer=setTimeout(fail,12000);video.addEventListener('loadedmetadata',done,{once:true});video.addEventListener('error',fail,{once:true});video.load()})}if(!Number.isFinite(video.duration)||video.duration<=0)throw Error('无法确定视频时长或解码格式');const canvas=document.createElement('canvas');canvas.width=canvas.height=172;const ctx=canvas.getContext('2d',{willReadFrequently:true});const result=[],times=[];const start=performance.now();const duration=Math.min(8,video.duration);for(let t=0;t<duration&&result.length<40;t+=.2){if(state.cancelled)throw Error('用户取消');await new Promise((resolve,reject)=>{const target=Math.min(t,Math.max(0,video.duration-.001));if(Math.abs(video.currentTime-target)<.005&&video.readyState>=2){resolve();return}const tm=setTimeout(()=>reject(Error('视频解码超时')),10000);video.addEventListener('seeked',()=>{clearTimeout(tm);resolve()},{once:true});video.currentTime=target});ctx.drawImage(video,0,0,172,172);const rgba=ctx.getImageData(0,0,172,172).data;const arr=new Float32Array(3*172*172);for(let i=0;i<172*172;i++){arr[i]=rgba[i*4]/255;arr[i+172*172]=rgba[i*4+1]/255;arr[i+2*172*172]=rgba[i*4+2]/255}result.push(arr);times.push(Math.min(t,Math.max(0,video.duration-.001)))}return {frames:result,times,decodeMs:performance.now()-start}}
function a0RGBFrameFromRGBA(rgba,size){
 const n=size*size,out=new Float32Array(n*3);
 for(let i=0;i<n;i++){out[i]=rgba[i*4]/255;out[i+n]=rgba[i*4+1]/255;out[i+2*n]=rgba[i*4+2]/255}
 return out;
}
function softmax(logits){const m=Math.max(...logits),v=Array.from(logits,x=>Math.exp(x-m));const s=v.reduce((a,b)=>a+b,0);return v.map(x=>x/s)}
const MODEL_ORDER=['a0','a1','a2','videomae','mobileclip_s0'];
const compareInputs=()=>Array.from(document.querySelectorAll('#compare-choices input[type="checkbox"]'));
const availableForCompare=id=>{
 const result=state.comparisonRows[id];
 return result?.status==='success'&&result.videoKey===state.videoKey&&Number.isFinite(result.score);
};
const selectedForCompare=()=>compareInputs().filter(el=>el.checked&&availableForCompare(el.value)).map(el=>el.value);
function updateComparisonSelection(){
 const available=MODEL_ORDER.filter(availableForCompare).length;
 for(const el of compareInputs()){
   if(!availableForCompare(el.value))el.checked=false;
 }
 const selected=selectedForCompare();
 const status=$('compare-selection-status');
 status.textContent=available?
   '本视频已完成 '+available+' 个模型 · 已选择 '+selected.length+' / 3 个'+
     (selected.length>=3?' · 已达上限':selected.length===0?' · 可勾选结果':''):
   '本视频尚无已完成的模型结果';
 for(const el of compareInputs()){
   const valid=availableForCompare(el.value),limit=selected.length>=3&&!el.checked;
   el.disabled=!valid||limit;
   el.parentElement.title=!valid?'请先在 02 对该视频运行此模型':limit?'最多选择 3 个已完成结果':'';
   el.parentElement.setAttribute('aria-label',el.parentElement.textContent.trim()+
     (!valid?'（尚未完成推理）':'（已完成推理）'));
 }
 updateComparisonView();
}
for(const checkbox of compareInputs())checkbox.addEventListener('change',updateComparisonSelection);

function updateComparisonView(){
 const box=$('comparison-results');
 if(!box)return;
 box.replaceChildren();
 const selected=selectedForCompare();
 if(!selected.length){
   box.textContent=MODEL_ORDER.some(availableForCompare)?
      '请选择上方已完成的模型结果进行对比（最多 3 个）。':
      '本视频尚无可比较的结果。请先在 02 选择一个模型并点击「开始识别」。';
   return;
 }
 const table=document.createElement('table');
 const head=document.createElement('tr');
 for(const label of ['模型','Top-1（英文）','分数¹','参考动作排名','推理耗时','权重约']){
   const el=document.createElement('th');el.textContent=label;head.append(el);
 }
 table.append(head);
 for(const id of selected){
   const value=state.comparisonRows[id],row=document.createElement('tr');
   const cells=[value.model,value.top1,(value.score*100).toFixed(1)+'%',
      value.targetRank?('#'+value.targetRank):'N/A',value.inferenceMs+' ms',
      value.mb.toFixed(1)+' MB · '+value.backend];
   for(const cellValue of cells){const td=document.createElement('td');td.textContent=cellValue;row.append(td)}
   table.append(row);
 }
 const notice=document.createElement('p');notice.className='note';
 notice.textContent='¹ 所有模型使用当前视频的同一主要人物裁剪区域。MoViNet 为末次人物采样，VideoMAE 为末次有效 4 秒片段 K400 分类，MobileCLIP 为末次有效片段 6 帧图文匹配。分数不可直接跨模型比较，也不是识别准确率；此处不重复运行推理。';
 box.append(table,notice);
}
function saveModelComparison(variant,top,comparison,timings,frames,videoKey){
 if(videoKey!==state.videoKey||state.cancelled)throw Error('视频已切换或推理已取消，不保存结果');
 const semantic=variant==='mobileclip_s0';
 const mb=semantic?state.mobileclipModel.weightsMB:variant==='videomae'?VIDEOMAE.bytes/1e6:variant==='a0'?15.131688:OFFICIAL_MODELS[variant].bytes/1e6;
 state.comparisonRows[variant]={
   status:'success',videoKey,
   model:semantic?mobileCLIPModelName:variant==='videomae'?'Qualcomm VideoMAE':'MoViNet-'+variant.toUpperCase(),
   top1:top[0].label,score:top[0].score,targetRank:comparison?.target_rank??null,
   inferenceMs:timings.inferenceMs,mb,frames,
   backend:semantic?state.mobileclipModel.backend:'wasm'
 };
 updateComparisonSelection();
}
async function run(){if(state.busy)return {ok:false,error:'已有推理正在进行'};const runVideoKey=state.videoKey;hideAnnotated();state.activeController=new AbortController();setBusy(true);const began=performance.now();let isContinuous=false,isWindowed=false;
try{
  const detector=await getActorDetector();
  if(state.cancelled)throw Error('用户取消');
  say('正在检测与跟踪完整视频中的主要人物…');
  const scan=await scanPrimaryActor($('video'),{
    detector,seek:seekVideo,isCancelled:()=>state.cancelled,interval:.5,
    onProgress:({scanned,total,tracked})=>
      say('正在检测主要人物 '+scanned+'/'+total+' 帧 · '+tracked+' 次成功定位')
  });
  state.actorTrack=scan.track;
  record('person_tracking',{checkpoints:scan.total,valid:scan.detected,interval:scan.interval});
  personStatus('主要人物定位：'+scan.detected+'/'+scan.total+' 个检查点，后续仅分析其裁剪区域');
  if(state.cancelled)throw Error('用户取消');
  await ensureModelReady(state.activeController.signal);
  if(state.cancelled)throw Error('用户取消');
  const variant=state.selectedModel;
  let frames,times,decodeMs,logits,frameTop1,inferenceStarted,mobileclipScores=null,
    framesProcessed=0,measuredInferenceMs=null,analyzedDuration=$('video').duration;
if(['a0','a1','a2'].includes(variant)){
 isContinuous=true;
 const video=$('video'),progress=$('analysis-progress');
 progress.hidden=false;progress.value=0;
 const entry=variant==='a0'?{model:state.model,meta:state.meta}:state.officialModels[variant];
 const output=await analyzeCompleteMoViNet({
  video,variant,api:state.api,model:entry.model,meta:entry.meta,contract:entry.contract,
  labels:state.labels,actorTrack:state.actorTrack,
  toFrame:(rgba,size,kind)=>kind==='a0'?a0RGBFrameFromRGBA(rgba,size):makeRGBFrameFromRGBA(rgba,size),
  isCancelled:()=>state.cancelled,
  onProgress:({processed,total,seconds,duration})=>{
   progress.value=100*processed/total;
   say('MoViNet-'+variant.toUpperCase()+' 连续分析：'+processed+'/'+total+
     ' 帧 · '+seconds.toFixed(1)+'/'+duration.toFixed(1)+' 秒');
  }
 });
 logits=output.logits;frameTop1=output.frameTop1;decodeMs=output.decodeMs;
 framesProcessed=output.framesProcessed;measuredInferenceMs=output.inferenceMs;
 analyzedDuration=output.duration;frames=[];
}else if(variant==='videomae'||variant==='mobileclip_s0'){
  isContinuous=true;isWindowed=true;
  const entry=variant==='videomae'?state.videomaeModel:state.mobileclipModel;
  if(!entry)throw Error('片段模型尚未成功加载');
  $('analysis-progress').hidden=false;$('analysis-progress').value=0;
  const output=await analyzeWindowedActor({
    video:$('video'),variant,api:state.api,
    model:entry.model,classifier:entry.classifier,
    labels:state.labels,actorTrack:state.actorTrack,
    isCancelled:()=>state.cancelled,windowSeconds:4,
    onProgress:({processed,total,seconds,duration,completed})=>{
      $('analysis-progress').value=100*processed/total;
      say((variant==='videomae'?'VideoMAE':'MobileCLIP')+' 框内人物分段分析：'+
        processed+'/'+total+' 段 · 视频 '+seconds.toFixed(1)+'/'+duration.toFixed(1)+
        ' 秒 · 有效 '+completed+' 段');
    }
  });
  logits=output.logits;frameTop1=output.frameTop1;
  framesProcessed=output.framesProcessed;decodeMs=output.decodeMs;
  measuredInferenceMs=output.inferenceMs;analyzedDuration=output.duration;frames=[];
  if(variant==='mobileclip_s0')mobileclipScores=output.probabilities;
}
if(!logits||logits.length!==(variant==='mobileclip_s0'?6:variant==='videomae'?400:600)||!logits.every(Number.isFinite))throw Error('输出 logits 无效');const probabilities=mobileclipScores??softmax(logits);
const ranked=probabilities.map((score,id)=>({id,label:state.labels[id],score})).sort((a,b)=>b.score-a.score);
const top=ranked.slice(0,5);
const comparison=variant==='mobileclip_s0'?(state.clip?(()=>{
 const target_rank=mobileCLIPReferenceRank(probabilities,state.clip);
 return {target_rank,summary:target_rank?'参考动作在六类候选中排名 #'+target_rank:'该视频暂无可匹配的六类参考动作',
 detail:'MobileCLIP 只根据 6 张关键帧与固定英文描述计算相对匹配分数；不含动作过程信息，不能作为视频识别准确率或概率。'};
})():null):interpretAction(ranked,state.clip,state.labels);
$('results').replaceChildren();
for(const item of top){
  const r=document.createElement('div');r.className='result';
  const label=document.createElement('div');label.className='name';label.textContent=labelDisplay(item.label);
  const track=document.createElement('div');track.className='track';
  const bar=document.createElement('div');bar.className='fill';bar.style.width=(item.score*100).toFixed(2)+'%';
  track.append(bar);
  const pct=document.createElement('span');pct.className='score';pct.textContent=(item.score*100).toFixed(2)+'%';
  r.append(label,track,pct);$('results').append(r);
}
$('evaluation').replaceChildren();
if(comparison){
  const headline=document.createElement('strong');headline.textContent=comparison.summary;
  const detail=document.createElement('div');detail.textContent=comparison.detail;
  detail.style.marginTop='5px';
  $('evaluation').append(headline,detail);
 if(isContinuous){
  const scope=document.createElement('div');
  scope.style.marginTop='7px';
  scope.textContent=isWindowed?'说明：03 的 Top-5 来自最后一个成功的 4 秒人物片段；04 时间轴为片段级结果，不是逐帧动作识别。':'说明：03 的 Top-5 对应最后一次有效人物采样；完整过程请看 04 的逐时刻时间轴。';
  $('evaluation').append(scope);
 }
}else{
  $('evaluation').textContent='本地上传的视频尚无已核验参考标签；仅展示原生 Top-5，不判定正确率。';
}
const timings={decodeMs:Math.round(decodeMs),inferenceMs:Math.round(measuredInferenceMs??(performance.now()-inferenceStarted)),totalMs:Math.round(performance.now()-began)};
$('metrics').replaceChildren();
for(const entry of ['处理 '+(isContinuous?framesProcessed:frames.length)+' 帧','模型运行 '+timings.inferenceMs+' ms','总耗时 '+timings.totalMs+' ms',variant==='mobileclip_s0'?(state.mobileclipModel.backend.toUpperCase()+'/'+state.mobileclipModel.dtype):'CPU/WASM']){
 const el=document.createElement('span');el.textContent=entry;$('metrics').append(el);
}
saveModelComparison(variant,top,comparison,timings,isContinuous?framesProcessed:frames.length,runVideoKey);
try{await showAnnotated(frameTop1,analyzedDuration,variant==='videomae',variant==='mobileclip_s0');if(isContinuous)renderActionTimeline(frameTop1,analyzedDuration,isWindowed)}
catch(error){record('preview_error',{variant,message:error.message});hideAnnotated();}
record('inference',{variant,top5:top,frameTop1,frames:isContinuous?framesProcessed:frames.length,analyzedSeconds:analyzedDuration,actionSegments:isContinuous?buildActionSegments(frameTop1,analyzedDuration):null,timings,backend:variant==='mobileclip_s0'?state.mobileclipModel.backend:'wasm',clipId:state.clip?.id??null,comparison,modelSha256:variant==='mobileclip_s0'?null:variant==='a0'?MODEL_SHA:variant==='videomae'?VIDEOMAE.sha256:OFFICIAL_MODELS[variant].sha256,classificationMode:variant==='mobileclip_s0'?'windowed-keyframe-semantic':variant==='videomae'?'windowed-clip':'actor-stream',labelSet:variant==='mobileclip_s0'?'six-prompts':variant==='videomae'?'K400':'K600',actorMode:'tracked-person-crop',trackPoints:state.actorTrack.length});
say(variant==='mobileclip_s0'?'真实推理已返回：MobileCLIP 对框内人物完成完整视频连续片段图文匹配；不具备逐帧动态分类能力。':variant==='videomae'?'真实推理已返回：VideoMAE 完成框内人物连续片段分类（K400），每个结果对应 4 秒片段。':'真实推理已返回 '+framesProcessed+' 个框内人物流式预测（视频 '+analyzedDuration.toFixed(1)+' 秒）。');
return {ok:true,variant};}catch(e){state.actorTrack=null;state.actorGrounded=false;say('真实推理未完成：'+e.message);$('results').textContent='没有可展示的有效推理结果';record('inference_error',{variant:state.selectedModel,message:e.message,stack:e.stack});return {ok:false,error:e.message}}finally{state.activeController=null;$('analysis-progress').hidden=true;setBusy(false)}}
$('run').onclick=()=>{state.cancelled=false;return run()};

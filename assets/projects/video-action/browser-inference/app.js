import {interpretAction,labelDisplay} from './semantic.js';
import {createPersonDetector,choosePrimaryPerson,mapBoxToContainedVideo,top1At} from './person-overlay.js';
import {OFFICIAL_MODELS,MODEL_REPO,validateStreamingContract,makeRGBFrameFromRGBA,runStreamingBatch} from './official-movinet.js';
import {VIDEOMAE,compileVideoMAE,sampleVideoMAEFrames,inferVideoMAE} from './video-mae.js';
// MVAI V1.0.3 experimental browser adapter. No fake outputs or sample fallback.
const $ = id => document.getElementById(id);
const OFFICIAL_MODEL_REVISION='d1ed47ef93682fbceda5c388277e34ed717dd4ab';
const MODEL_URL='https://huggingface.co/litert-community/MoViNet-A0-Stream-LiteRT/resolve/main/movinet_a0_stream.tflite';
const MODEL_SHA='0565d6e2173caf3e144e6a0a6461edfef9dc5cccacf9a093f311f8a8f05434c8';
const LABELS_URL='https://raw.githubusercontent.com/tensorflow/models/f8af2291cced43fc9f1d9b41ddbf772ae7b0d7d2/official/projects/movinet/files/kinetics_600_labels.txt';
const DATASET='multimodal-vision-ai/mvai-daily-action-demo';
const DIMS=[2,2,2,4,2,2,4,2,2,2,4];
const state={objectUrl:null,clip:null,catalog:null,model:null,api:null,labels:null,meta:null,busy:false,cancelled:false,last:null,runtimePromise:null,modelPromise:null,weightsPromise:null,labelsPromise:null,top1Timeline:[],annotatedLimit:0,selectedModel:'a0',officialModels:{},officialPromises:{},comparisonRows:{},compareAllRunning:false,videomaeModel:null,videomaePromise:null,k600Labels:null,outputMode:'stream'};
let config=null;
async function loadConfig(){const response=await fetch('./config.json',{cache:'no-store'});if(!response.ok)throw Error('本地配置 HTTP '+response.status);config=await response.json();if(config.dataset_id!==DATASET)throw Error('数据源配置错误');return config;}
const say=s=>{$('status').textContent=s;$('status').classList.toggle('error',/失败|未完成|错误|无效/.test(s));};
const record=(event,data)=>{state.last={...(state.last||{}),[event]:data, timestamp:new Date().toISOString()};$('diagnostics').textContent=JSON.stringify(state.last,null,2)};
$('info').onclick=()=>{$('intro').hidden=!$('intro').hidden};
function activeModelReady(){return state.selectedModel==='videomae'?!!state.videomaeModel:state.selectedModel==='a0'?!!state.model:!!state.officialModels[state.selectedModel]}
function setBusy(b){state.busy=b;$('probe').disabled=b;$('run').disabled=b||!$('video').getAttribute('src');$('upload').disabled=b;$('model').disabled=b;$('sample-list')?.querySelectorAll('button').forEach(btn=>btn.disabled=b);$('model-state').textContent=b?'正在处理…':activeModelReady()?'模型已就绪':'尚未加载';updateComparisonSelection();}
// Person detector runs entirely in browser, independently from the MoViNet action model.
const personState={model:null,loadPromise:null,lastSampleMs:0,lastTime:-1,box:null,count:0,generation:0,error:null};
const personStatus=msg=>{$('person-detector-status').textContent=msg};
function clearPersonOverlay(){
 const canvas=$('person-box-layer');
 if(!canvas)return;
 const ctx=canvas.getContext('2d');if(ctx)ctx.clearRect(0,0,canvas.width,canvas.height);
 $('top1-overlay').hidden=false;
}
function drawPersonOverlay(){
 const video=$('annotated-video'),canvas=$('person-box-layer'),enabled=$('person-box-toggle').checked;
 if(!canvas||!enabled||!personState.box||!state.top1Timeline.length||video.currentTime>state.annotatedLimit+.005){
   clearPersonOverlay();return;
 }
 const width=video.clientWidth,height=video.clientHeight;
 if(width<=0||height<=0)return;
 const pixelRatio=Math.min(window.devicePixelRatio||1,2);
 const W=Math.round(width*pixelRatio),H=Math.round(height*pixelRatio);
 if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}
 const ctx=canvas.getContext('2d');
 ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);ctx.clearRect(0,0,width,height);
 const coords=mapBoxToContainedVideo(personState.box,video.videoWidth,video.videoHeight,width,height);
 if(!coords){clearPersonOverlay();return}
 const action=top1At(state.top1Timeline,video.currentTime,state.annotatedLimit);
 if(!action){clearPersonOverlay();return}
 // The box locates a COCO "person"; MoViNet predicts a video-level action,
 // so the displayed tag is only associated visually, never attributed to that actor.
 ctx.lineWidth=3;ctx.strokeStyle='#39e5ad';ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=3;
 ctx.strokeRect(coords.x+1.5,coords.y+1.5,Math.max(0,coords.w-3),Math.max(0,coords.h-3));ctx.shadowBlur=0;
 const title=labelDisplay(action.label)+' · '+(action.score*100).toFixed(1)+'%';
 const disclaimer='画面 Top-1（非人物独立分类）';
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
 const ms=performance.now();
 if(!force&&(ms-personState.lastSampleMs<400||Math.abs(video.currentTime-personState.lastTime)<.1))return;
 personState.lastSampleMs=ms;personState.lastTime=video.currentTime;
 try{
   const result=personState.model.detect(video);
   const selected=choosePrimaryPerson(result.detections,video.videoWidth,video.videoHeight);
   personState.box=selected.person?.boundingBox||null;
   personState.count=selected.candidateCount;
   personStatus(selected.person?(selected.candidateCount>1?'检测到 '+selected.candidateCount+' 人，仅显示画面最大主人物；动作是视频级分类':'已定位主人物；动作是视频级分类'):'当前画面未检测到可信人物，保留视频级 Top-1');
   drawPersonOverlay();
 }catch(e){personState.box=null;personState.error=String(e);personStatus('人物检测失败：'+e.message+'；已退回无框 Top-1');drawPersonOverlay()}
}
async function ensurePersonDetector(){
 if(!$('person-box-toggle').checked||$('annotated-section').hidden)return;
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
   personStatus('人物检测模型加载失败：'+e.message+'；保留原 Top-1 显示');
   clearPersonOverlay();
   return null;
 }).finally(()=>{personState.loadPromise=null});
 return personState.loadPromise;
}
$('person-box-toggle').addEventListener('change',()=>{
 if(!$('person-box-toggle').checked){
   personState.box=null;clearPersonOverlay();personStatus('人物框已关闭；保留视频级 Top-1');
 }else{
   ensurePersonDetector();
 }
});
$('model').addEventListener('change',()=>{
  if(state.busy)return;
  state.selectedModel=$('model').value;
  hideAnnotated();
  $('results').textContent='请选择模型并运行真实推理。';
  $('evaluation').textContent='Top-5 只展示原始英文类别，具体动作语义解释将在推理后出现。';
  $('metrics').replaceChildren();
  $('model-state').textContent=activeModelReady()?'模型已就绪':'尚未加载';
  if(state.selectedModel==='a0')$('model-description').textContent='LiteRT.js WASM CPU · Kinetics-600 · 15.1 MB · 172×172';
  else if(state.selectedModel==='videomae')$('model-description').textContent='Qualcomm VideoMAE · 351 MB · Kinetics-400 · 非流式 16 帧整段分类；研究实验模型，六类任务不保证更好';
  else $('model-description').textContent='官方 Google MoViNet-'+state.selectedModel.toUpperCase()+' · Kinetics-600 · '+(OFFICIAL_MODELS[state.selectedModel].bytes/1e6).toFixed(1)+' MB · '+OFFICIAL_MODELS[state.selectedModel].size+'×'+OFFICIAL_MODELS[state.selectedModel].size;
  say('已切换到 '+$('model').selectedOptions[0].textContent+'；模型将按需加载，原视频保持不变。');
});
async function ensureVideoMAEModel(){
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
     onProgress:say
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
  personState.generation++;personState.box=null;personState.count=0;personState.lastTime=-1;clearPersonOverlay();
  const video=$('annotated-video');
  video.pause();video.removeAttribute('src');video.load();
  $('annotated-section').hidden=true;
  $('top1-overlay').textContent='等待推理';
  $('annotation-summary').textContent='';
  state.top1Timeline=[];state.annotatedLimit=0;
}
function updateTop1Overlay(){
  const video=$('annotated-video'),overlay=$('top1-overlay');
  const timeline=state.top1Timeline;
  if(!timeline.length||!Number.isFinite(video.currentTime))return;
  overlay.replaceChildren();
  const title=document.createElement('small');title.textContent='MoViNet 流式 Top-1 · 每 0.2 秒';
  const name=document.createElement('strong');const score=document.createElement('small');
  if(video.currentTime>state.annotatedLimit+0.005){
    name.textContent='超出已分析范围';
    score.textContent='仅分析视频前 '+state.annotatedLimit.toFixed(1)+' 秒';
  }else{
    // Streaming scores are cumulative as of the sampled time; no interpolation or fabricated predictions.
    const time=video.currentTime;
    let idx=0;for(let i=1;i<timeline.length;i++){if(timeline[i].t<=time+0.001)idx=i;else break}
    const point=timeline[idx];
    name.textContent=labelDisplay(point.label);
    score.textContent=(point.score*100).toFixed(1)+'% · t='+point.t.toFixed(1)+'s（未校准分数）';
  }
  overlay.append(title,name,score);
  drawPersonOverlay();
}
async function showAnnotated(timeline,limit){
  if(!timeline.length)throw Error('逐帧 Top-1 记录为空');
  const src=$('video').currentSrc||$('video').src;
  if(!src)throw Error('原视频资源为空');
  const dest=$('annotated-video');
  if(src.startsWith('blob:'))dest.removeAttribute('crossorigin');else dest.crossOrigin='anonymous';
  state.top1Timeline=timeline;state.annotatedLimit=limit;
  dest.muted=true;dest.src=src;dest.load();
  $('annotation-summary').textContent='已记录 '+timeline.length+' 个流式预测点（5 FPS，分析 '+limit.toFixed(1)+' 秒）。这不是物体检测框；播放中的标签依据原始模型在对应时刻的累积预测更新。';
  $('annotated-section').hidden=false;
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
function pick(url,clip=null){state.comparisonRows={};updateComparisonView();hideAnnotated();if(state.objectUrl){URL.revokeObjectURL(state.objectUrl);state.objectUrl=null}state.clip=clip;if(url.startsWith('blob:'))$('video').removeAttribute('crossorigin');else{$('video').crossOrigin='anonymous';$('upload').value=''}$('video').src=url;$('results').textContent='等待真实推理。';$('evaluation').textContent='点击「开始识别」后，将按参考标签及语义关联解释结果。';$('metrics').replaceChildren();$('reference').textContent=clip?'参考动作：'+clip.label_zh+' / '+clip.label_en:'参考动作：本地文件，无标注';$('provenance').replaceChildren();if(clip){const desc=document.createElement('span');desc.textContent='类型：'+(clip.synthetic?'合成测试':'真实来源视频')+' · 参考标签：'+(clip.reference_evidence||clip.evidence||'来源描述')+' · 作者：'+(clip.attribution||'见来源页')+' · 许可：'+clip.license+' · ';const link=document.createElement('a');link.href=clip.source_url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='查看原始视频及授权';$('provenance').append(desc,link)}else $('provenance').textContent='本地上传 · 仅在此浏览器读取';$('run').disabled=state.busy||!$('video').getAttribute('src');updateComparisonSelection();if(!state.busy)say('已选择'+(clip?.label_zh?'「'+clip.label_zh+'」':'本地视频')+'；点击「开始识别」后将在浏览器执行真实推理。')}
$('upload').onchange=e=>{const f=e.target.files?.[0];if(!f)return;if(!['video/mp4','video/webm'].includes(f.type)){say('仅支持 MP4/WebM');return}if(f.size>120*1024*1024){say('文件超过 120 MB 的预览安全上限');return}const url=URL.createObjectURL(f);pick(url);state.objectUrl=url;};
$('reset').onclick=()=>{state.cancelled=true;state.comparisonRows={};updateComparisonView();hideAnnotated();$('video').removeAttribute('src');$('video').load();$('results').textContent='已清除结果';$('evaluation').textContent='请选择视频并运行识别';$('metrics').replaceChildren();state.clip=null;if(state.objectUrl){URL.revokeObjectURL(state.objectUrl);state.objectUrl=null;}$('reference').textContent='参考动作：未选择样例';$('run').disabled=true;updateComparisonSelection();say('已清除当前视频')};
$('cancel').onclick=()=>{state.cancelled=true;say('已请求取消；当前 WASM 调用完成后停止继续处理。')};
$('export').onclick=()=>{const b=new Blob([JSON.stringify(state.last||{},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='mvai-v103-diagnostics.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
// Six concise real-video choices; no fake footage or unapproved substitute for falling.
const SAMPLE_SLOTS=[
  {id:'wave',name:'挥手',match:c=>c.label_en==='waving hand'||c.id==='real_waving_hand_001'},
  {id:'phone_use',name:'看手机',match:c=>c.standard_action_id==='phone_use'},
  {id:'phone_call',name:'打电话',match:c=>c.standard_action_id==='phone_call'},
  {id:'falling',name:'摔倒',match:c=>c.standard_action_id==='falling'},
  {id:'eating',name:'吃东西',match:c=>c.standard_action_id==='eating'},
  {id:'sleep_posture',name:'睡觉',match:c=>c.standard_action_id==='sleep_posture'}
];
const goodSample=c=>{
 const relative=String(c?.relative_file||'');
 const file=relative.startsWith('demo/videos/')?relative.slice(12):'';
 return !!(c&&c.synthetic!==true&&c.status==='approved_demo'&&c.redistribution_approved===true&&c.license&&c.source_url&&file&&[...file].every(ch=>'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-'.includes(ch))&&(file.endsWith('.mp4')||file.endsWith('.webm')));
};
const DEV_FIXTURE={id:'synthetic_wave_001',label_zh:'挥手',label_en:'waving hand',source_url:'https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/blob/feat/video-action-v103/scripts/video-action/generate_demo.py',license:'CC0-1.0',synthetic:true,reference_evidence:'synthetic_controlled',evaluation_tier:'development_only'};
async function addDevFixture(reason){
  $('sample-list').replaceChildren();
  for(const slot of SAMPLE_SLOTS){
    const btn=document.createElement('button');btn.textContent=slot.name;btn.className='unavailable';
    btn.dataset.action=slot.id;
    btn.onclick=()=>say('HF 真人视频目录暂不可用：'+reason+'。可上传本地视频。');
    $('sample-list').append(btn);
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
  const box=$('sample-list');
  box.replaceChildren();
  const available=c.items.filter(goodSample);
  let enabledCount=0;
  for(const slot of SAMPLE_SLOTS){
    const clip=available.find(slot.match);
    const btn=document.createElement('button');
    btn.textContent=slot.name;
    btn.dataset.action=slot.id;
    if(clip){
      enabledCount++;
      btn.dataset.clipId=clip.id;
      btn.setAttribute('aria-label','播放真人'+slot.name+'样例');
      btn.onclick=()=>{
        pick('https://huggingface.co/datasets/'+DATASET+'/resolve/'+revision+'/'+clip.relative_file,clip);
        box.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===btn));
        $('sample-status').textContent=slot.id==='phone_call'?'当前为有线电话，不能等同手机通话。':slot.id==='sleep_posture'?'当前为可见卧床姿态，不能证明真实睡眠。':'';
      };
    }else{
      btn.className='unavailable';
      btn.title='尚无已核验授权的真人'+slot.name+'视频';
      btn.setAttribute('aria-label',slot.name+'样例待入库');
      btn.onclick=()=>{
        box.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===btn));
        $('sample-status').textContent='「'+slot.name+'」暂无已审核的真人视频，请勿用其他类别代替。可使用下方本地视频测试。';
        say('「'+slot.name+'」暂无公开样例；可选择其他已入库视频或上传已授权本地视频。');
      };
    }
    box.append(btn);
  }
  if(!enabledCount)throw Error('HF catalog 尚无可用真人演示样例');
  record('catalog',{revision,count:enabledCount,availableSlots:SAMPLE_SLOTS.map(x=>({id:x.id,hasVideo:available.some(x.match)})),provisional});
  if(!state.clip)box.querySelector('button[data-clip-id]')?.click();
}
catalog().catch(e=>{addDevFixture(e.message)});
function hex(bytes){return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')}
async function fetchChecked(){const t=performance.now();const r=await fetch(MODEL_URL);if(!r.ok)throw Error('模型下载 HTTP '+r.status);const buffer=await r.arrayBuffer();if(buffer.byteLength!==15131688)throw Error('模型文件大小不符：'+buffer.byteLength);if(!crypto.subtle)throw Error('浏览器不支持 SHA256 校验');const h=hex(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer)));if(h!==MODEL_SHA)throw Error('模型 SHA256 不符，拒绝运行');record('model_download',{bytes:buffer.byteLength,sha256:h,ms:Math.round(performance.now()-t)});return buffer}
function inputMetadata(model){const data= typeof model.getInputDetails==='function'?model.getInputDetails():model.inputDetails??model.inputs;return Array.isArray(data)?data:null}
async function ensureModelReady(){
  if(state.selectedModel==='videomae')return ensureVideoMAEModel();
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
    const io=variant==='videomae'?'1 输入 / 1 输出（16 帧 K400）':variant==='a0'?'47 输入 / 28 输出':'已验证 '+OFFICIAL_MODELS[variant].expectedInputs+' 输入 / '+OFFICIAL_MODELS[variant].expectedOutputs+' 输出';
    say(variant.toUpperCase()+' WASM 模型已就绪；'+io+'。无需重复初始化。');
    return;
  }
  setBusy(true);
  try{
    await ensureModelReady();
    const io=variant==='videomae'?'16 帧 Kinetics400 单输入、400 类输出验证通过':variant==='a0'?'47 输入 / 28 输出元数据通过':OFFICIAL_MODELS[variant].expectedInputs+' 输入 / '+OFFICIAL_MODELS[variant].expectedOutputs+' 输出状态元数据通过';
    say(variant.toUpperCase()+' WASM 模型已加载，'+io+'；可以开始识别。');
  }catch(e){say('WASM 加载失败：'+e.message);record('probe_error',{variant,message:e.message,stack:e.stack})}
  finally{setBusy(false)}
}
$('probe').onclick=probe;
function shapeOf(d){const raw=d?.shape??d?.dims??d?.dimensions??d?.shapeSignature;if(Array.isArray(raw))return raw.map(Number);if(raw&&typeof raw.length==='number')return Array.from(raw,Number);if(raw&&typeof raw[Symbol.iterator]==='function')return Array.from(raw,Number);return null}
function tensorFor(data,shape){return new state.api.Tensor(data,shape)}
const sizeOf=shape=>shape.reduce((a,b)=>a*b,1);
async function readFrames(video){if(!Number.isFinite(video.duration)||video.duration<=0){await new Promise((resolve,reject)=>{const fail=()=>{clearTimeout(timer);reject(Error('视频格式不支持或无法读取时长'))};const done=()=>{clearTimeout(timer);resolve()};const timer=setTimeout(fail,12000);video.addEventListener('loadedmetadata',done,{once:true});video.addEventListener('error',fail,{once:true});video.load()})}if(!Number.isFinite(video.duration)||video.duration<=0)throw Error('无法确定视频时长或解码格式');const canvas=document.createElement('canvas');canvas.width=canvas.height=172;const ctx=canvas.getContext('2d',{willReadFrequently:true});const result=[],times=[];const start=performance.now();const duration=Math.min(8,video.duration);for(let t=0;t<duration&&result.length<40;t+=.2){if(state.cancelled)throw Error('用户取消');await new Promise((resolve,reject)=>{const target=Math.min(t,Math.max(0,video.duration-.001));if(Math.abs(video.currentTime-target)<.005&&video.readyState>=2){resolve();return}const tm=setTimeout(()=>reject(Error('视频解码超时')),10000);video.addEventListener('seeked',()=>{clearTimeout(tm);resolve()},{once:true});video.currentTime=target});ctx.drawImage(video,0,0,172,172);const rgba=ctx.getImageData(0,0,172,172).data;const arr=new Float32Array(3*172*172);for(let i=0;i<172*172;i++){arr[i]=rgba[i*4]/255;arr[i+172*172]=rgba[i*4+1]/255;arr[i+2*172*172]=rgba[i*4+2]/255}result.push(arr);times.push(Math.min(t,Math.max(0,video.duration-.001)))}return {frames:result,times,decodeMs:performance.now()-start}}
function softmax(logits){const m=Math.max(...logits),v=Array.from(logits,x=>Math.exp(x-m));const s=v.reduce((a,b)=>a+b,0);return v.map(x=>x/s)}
const MODEL_ORDER=['a0','a1','a2'];
const compareInputs=()=>Array.from(document.querySelectorAll('#compare-choices input[type="checkbox"]'));
const selectedForCompare=()=>compareInputs().filter(el=>el.checked).map(el=>el.value);
function updateComparisonSelection(){
  const selected=selectedForCompare(),status=$('compare-selection-status');
  status.textContent='已选择 '+selected.length+' / 3 个模型'+(selected.length===0?' · 请至少选择一个':selected.length===3?' · 已达上限':'');
  const lock=state.busy||state.compareAllRunning;
  for(const el of compareInputs()){
    el.disabled=lock||(!el.checked&&selected.length>=3);
    el.parentElement.title=!el.checked&&selected.length>=3?'最多同时选择三个模型':'';
  }
  $('compare-run').disabled=lock||!selected.length||!$('video').getAttribute('src');
  updateComparisonView();
}
for(const checkbox of compareInputs())checkbox.addEventListener('change',()=>{
  if(state.busy||state.compareAllRunning){checkbox.checked=!checkbox.checked;return}
  updateComparisonSelection();
});

function updateComparisonView(){
 const box=$('comparison-results');if(!box)return;
 box.replaceChildren();
 const selection=selectedForCompare();
 const entries=MODEL_ORDER.filter(id=>selection.includes(id)&&state.comparisonRows[id]);
 if(!entries.length){
   box.textContent=selection.length?'所选模型尚无实测结果。点击「运行所选模型对比」开始。':'请至少选择一个模型进行对比。';
   return;
 }
 const table=document.createElement('table');
 const head=document.createElement('tr');
 for(const text of ['模型','Top-1 (英文)','分数¹','参考动作排名','WASM 推理','权重']){
   const el=document.createElement('th');el.textContent=text;head.append(el);
 }
 table.append(head);
 for(const id of selection){
   const row=document.createElement('tr'),value=state.comparisonRows[id];
   const cells=value?[value.model,value.top1,(value.score*100).toFixed(1)+'%',
      value.targetRank?('#'+value.targetRank):'N/A',value.inferenceMs+' ms',
      value.mb.toFixed(1)+' MB']:
      ['MoViNet-'+id.toUpperCase(),'尚未运行','—','—','—','—'];
   for(const v of cells){const cell=document.createElement('td');cell.textContent=v;row.append(cell)}
   table.append(row);
 }
 const notice=document.createElement('p');notice.className='note';
 notice.textContent='¹ 原始 softmax 未经校准；不同模型的分数不能直接当作可比的真实概率。A0/A1/A2 使用相同视频区间、5 FPS，但使用各自要求的分辨率。N/A 表示类别体系无严格同名标签，并非分类错误。';
 box.append(table,notice);
}
function saveModelComparison(variant,top,comparison,timings,frames){
 const mb=variant==='a0'?15.131688:OFFICIAL_MODELS[variant].bytes/1e6;
 state.comparisonRows[variant]={model:'MoViNet-'+variant.toUpperCase(),top1:top[0].label,score:top[0].score,
   targetRank:comparison?.target_rank??null,inferenceMs:timings.inferenceMs,mb,frames,clipId:state.clip?.id??null};
 updateComparisonView();
}
$('compare-run').addEventListener('click',async()=>{
 if(state.busy||state.compareAllRunning||!$('video').getAttribute('src'))return;
 const selection=selectedForCompare();
 if(!selection.length||selection.length>3){say('请选择 1–3 个模型进行对比');return}
 state.compareAllRunning=true;
 state.cancelled=false;
 const original=state.selectedModel;
 const clipId=state.clip?.id??null;
 updateComparisonSelection();
 try{
   for(const variant of selection){
     if(state.cancelled||clipId!==(state.clip?.id??null))throw Error('已取消或切换了视频');
     // Clear prior results first so a failed model cannot appear to have succeeded.
     delete state.comparisonRows[variant];
     updateComparisonView();
     state.selectedModel=variant;
     $('model').value=variant;
     say('正在运行所选模型：'+variant.toUpperCase()+'（'+(selection.indexOf(variant)+1)+'/'+selection.length+'）');
     await run();
     if(!state.comparisonRows[variant]||state.comparisonRows[variant].clipId!==clipId)
       throw Error('模型 '+variant.toUpperCase()+' 未完成有效推理；停止对比');
   }
   say('已完成 '+selection.length+' 个所选模型的真实视频比较，请查看第 06 节。');
 }catch(e){
   say('所选模型对比未完成：'+e.message);
   record('compare_error',{selected:selection,message:e.message});
 }finally{
   state.selectedModel=original;
   $('model').value=original;
   state.compareAllRunning=false;
   $('model-state').textContent=activeModelReady()?'模型已就绪':'尚未加载';
   updateComparisonSelection();
 }
});
async function run(){if(state.busy)return;hideAnnotated();setBusy(true);state.cancelled=false;const began=performance.now();try{await ensureModelReady();if(state.cancelled)throw Error('用户取消');const variant=state.selectedModel;let frames,times,decodeMs,logits,frameTop1,inferenceStarted;
if(variant==='a0'){
const meta=state.meta;if(!meta||meta.length!==47)throw Error('47 输入形状元数据尚未验证');const shapes=meta.map(shapeOf);if(shapes.some(s=>!Array.isArray(s)||s.some(n=>!Number.isInteger(n)||n<1))){record('input_shape_issue',{first:meta.slice(0,3),normalized:shapes.slice(0,3),bad_indices:shapes.map((x,i)=>!Array.isArray(x)||x.some(n=>!Number.isInteger(n)||n<1)?i:null).filter(x=>x!==null)});throw Error('无法获取全部 47 输入的固定张量形状；诊断见推理详情')}if(JSON.stringify(shapes[0])!=='[1,3,172,172]')throw Error('NCHW 输入形状不符');say('正在解码视频并执行逐帧 WASM 推理……');({frames,times,decodeMs}=await readFrames($('video')));if(!frames.length)throw Error('未解码出有效视频帧');const history=[];let offset=1;for(const depth of DIMS){history.push(Array.from({length:depth},(_,i)=>new Float32Array(sizeOf(shapes[offset+i]))));offset+=depth}let pool=Array.from({length:16},(_,i)=>new Float32Array(sizeOf(shapes[29+i])));frameTop1=[];inferenceStarted=performance.now();for(let count=1;count<=frames.length;count++){if(state.cancelled)throw Error('用户取消');const inputs=[tensorFor(frames[count-1],shapes[0])];for(const group of history)for(const h of group)inputs.push(tensorFor(h,shapes[inputs.length]));for(let j=0;j<16;j++)inputs.push(tensorFor(pool[j],shapes[29+j]));inputs.push(tensorFor(new Float32Array([1/count]),shapes[45]),tensorFor(new Float32Array([1]),shapes[46]));const outputs=await state.model.run(inputs);if(outputs.length!==28)throw Error('预期 28 输出，实际 '+outputs.length);const outTensors=Array.from({length:outputs.length},(_,i)=>outputs[i]);const values=await Promise.all(outTensors.map(x=>x.data()));logits=Float32Array.from(values[0]);if(logits.length!==600||!logits.every(Number.isFinite))throw Error('流式第 '+count+' 帧 logits 无效');const frameScores=softmax(logits);let winner=0;for(let k=1;k<frameScores.length;k++)if(frameScores[k]>frameScores[winner])winner=k;frameTop1.push({frame:count,t:Number(times[count-1].toFixed(3)),id:winner,label:state.labels[winner],score:Number(frameScores[winner].toFixed(6))});for(let c=0;c<DIMS.length;c++)history[c]=[...history[c].slice(1),Float32Array.from(values[1+c])];for(let j=0;j<16;j++){const delta=values[12+j];for(let k=0;k<pool[j].length;k++)pool[j][k]+=delta[k]}for(const t of inputs)t.delete?.();if(typeof outputs.delete==='function')outputs.delete();else for(const t of outTensors)t.delete?.()}
}else{
  const entry=state.officialModels[variant];
  if(!entry)throw Error('官方 '+variant.toUpperCase()+' 模型尚未编译成功');
  say('正在解码 '+OFFICIAL_MODELS[variant].size+'×'+OFFICIAL_MODELS[variant].size+' 原始视频帧…');
  ({frames,times,decodeMs}=await readOfficialFrames($('video'),OFFICIAL_MODELS[variant].size));
  if(!frames.length)throw Error('没有有效的视频帧');
  inferenceStarted=performance.now();
  say('正在使用 '+variant.toUpperCase()+' 执行真实逐帧状态推理……');
  const output=await runStreamingBatch({
    api:state.api,model:entry.model,contract:entry.contract,frames,
    isCancelled:()=>state.cancelled,
    onFrame:progress=>{if(progress.step===1||progress.step===frames.length||progress.step%5===0)
      say('MoViNet-'+variant.toUpperCase()+' 真实 WASM 推理：'+progress.step+'/'+progress.steps+' 帧')}
  });
  logits=output.logits;
  frameTop1=output.frameLogits.map((values,i)=>{
    const scores=softmax(values);
    let topId=0;for(let j=1;j<scores.length;j++)if(scores[j]>scores[topId])topId=j;
    return {frame:i+1,t:Number(times[i].toFixed(3)),id:topId,label:state.labels[topId],score:Number(scores[topId].toFixed(6))}
  });
}
if(!logits||logits.length!==600||!logits.every(Number.isFinite))throw Error('输出 logits 无效');const probabilities=softmax(logits);
const ranked=probabilities.map((score,id)=>({id,label:state.labels[id],score})).sort((a,b)=>b.score-a.score);
const top=ranked.slice(0,5);
const comparison=interpretAction(ranked,state.clip,state.labels);
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
}else{
  $('evaluation').textContent='本地上传的视频尚无已核验参考标签；仅展示原生 Top-5，不判定正确率。';
}
const timings={decodeMs:Math.round(decodeMs),inferenceMs:Math.round(performance.now()-inferenceStarted),totalMs:Math.round(performance.now()-began)};
$('metrics').replaceChildren();
for(const entry of ['处理 '+frames.length+' 帧','模型运行 '+timings.inferenceMs+' ms','总耗时 '+timings.totalMs+' ms','CPU/WASM']){
 const el=document.createElement('span');el.textContent=entry;$('metrics').append(el);
}
await showAnnotated(frameTop1,Math.min(8,$('video').duration));saveModelComparison(variant,top,comparison,timings,frames.length);
record('inference',{variant,top5:top,frameTop1,frames:frames.length,analyzedSeconds:Math.min(8,$('video').duration),timings,backend:'wasm',clipId:state.clip?.id??null,comparison,modelSha256:variant==='a0'?MODEL_SHA:OFFICIAL_MODELS[variant].sha256});
say('真实推理已返回 '+frames.length+' 帧结果。Top-5 是未校准 softmax 分数。');
}catch(e){say('真实推理未完成：'+e.message);$('results').textContent='没有可展示的有效推理结果';record('inference_error',{message:e.message,stack:e.stack})}finally{setBusy(false)}}
$('run').onclick=run;

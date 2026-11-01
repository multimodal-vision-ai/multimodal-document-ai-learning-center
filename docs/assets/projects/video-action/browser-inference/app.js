import {interpretAction,labelDisplay,relationTag} from './semantic.js';
// MVAI V1.0.3 experimental browser adapter. No fake outputs or sample fallback.
const $ = id => document.getElementById(id);
const MODEL_URL='https://huggingface.co/litert-community/MoViNet-A0-Stream-LiteRT/resolve/main/movinet_a0_stream.tflite';
const MODEL_SHA='0565d6e2173caf3e144e6a0a6461edfef9dc5cccacf9a093f311f8a8f05434c8';
const LABELS_URL='https://raw.githubusercontent.com/tensorflow/models/f8af2291cced43fc9f1d9b41ddbf772ae7b0d7d2/official/projects/movinet/files/kinetics_600_labels.txt';
const DATASET='multimodal-vision-ai/mvai-daily-action-demo';
const DIMS=[2,2,2,4,2,2,4,2,2,2,4];
const state={objectUrl:null,clip:null,catalog:null,model:null,api:null,labels:null,meta:null,busy:false,cancelled:false,last:null,runtimePromise:null,modelPromise:null,weightsPromise:null,labelsPromise:null,top1Timeline:[],annotatedLimit:0};
let config=null;
async function loadConfig(){const response=await fetch('./config.json',{cache:'no-store'});if(!response.ok)throw Error('本地配置 HTTP '+response.status);config=await response.json();if(config.dataset_id!==DATASET)throw Error('数据源配置错误');return config;}
const say=s=>{$('status').textContent=s;$('status').classList.toggle('error',/失败|未完成|错误|无效/.test(s));};
const record=(event,data)=>{state.last={...(state.last||{}),[event]:data, timestamp:new Date().toISOString()};$('diagnostics').textContent=JSON.stringify(state.last,null,2)};
$('info').onclick=()=>{$('intro').hidden=!$('intro').hidden};
function setBusy(b){state.busy=b;$('probe').disabled=b;$('run').disabled=b||!$('video').getAttribute('src');$('upload').disabled=b;$('sample-list')?.querySelectorAll('button').forEach(btn=>btn.disabled=b);$('model-state').textContent=b?'正在处理…':state.model?'模型已就绪':'尚未加载';}
function hideAnnotated(){
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
}
function showAnnotated(timeline,limit){
  if(!timeline.length)throw Error('逐帧 Top-1 记录为空');
  const src=$('video').currentSrc||$('video').src;
  if(!src)throw Error('原视频资源为空');
  const dest=$('annotated-video');
  if(src.startsWith('blob:'))dest.removeAttribute('crossorigin');else dest.crossOrigin='anonymous';
  state.top1Timeline=timeline;state.annotatedLimit=limit;
  dest.src=src;dest.currentTime=0;dest.muted=true;
  $('annotation-summary').textContent='已记录 '+timeline.length+' 个流式预测点（5 FPS，分析 '+limit.toFixed(1)+' 秒）。这不是物体检测框；播放中的标签依据原始模型在对应时刻的累积预测更新。';
  $('annotated-section').hidden=false;
  updateTop1Overlay();
  dest.play().catch(()=>{}); // optional muted autoplay, never required for review
}
const replayVideo=$('annotated-video');
replayVideo.addEventListener('timeupdate',updateTop1Overlay);
replayVideo.addEventListener('seeked',updateTop1Overlay);
replayVideo.addEventListener('loadedmetadata',updateTop1Overlay);
let overlayRaf=0;
const renderPlayback=()=>{updateTop1Overlay();if(!replayVideo.paused&&!replayVideo.ended)overlayRaf=requestAnimationFrame(renderPlayback)};
replayVideo.addEventListener('play',()=>{cancelAnimationFrame(overlayRaf);overlayRaf=requestAnimationFrame(renderPlayback)});
replayVideo.addEventListener('pause',()=>{cancelAnimationFrame(overlayRaf);updateTop1Overlay()});
replayVideo.addEventListener('ended',()=>{cancelAnimationFrame(overlayRaf);updateTop1Overlay()});
function pick(url,clip=null){hideAnnotated();if(state.objectUrl){URL.revokeObjectURL(state.objectUrl);state.objectUrl=null}state.clip=clip;if(url.startsWith('blob:'))$('video').removeAttribute('crossorigin');else{$('video').crossOrigin='anonymous';$('upload').value=''}$('video').src=url;$('results').textContent='等待真实推理。';$('evaluation').textContent='点击「开始识别」后，将按参考标签及语义关联解释结果。';$('metrics').replaceChildren();$('reference').textContent=clip?'参考动作：'+clip.label_zh+' / '+clip.label_en:'参考动作：本地文件，无标注';$('provenance').replaceChildren();if(clip){const desc=document.createElement('span');desc.textContent='类型：'+(clip.synthetic?'合成测试':'真实来源视频')+' · 参考标签：'+(clip.reference_evidence||clip.evidence||'来源描述')+' · 作者：'+(clip.attribution||'见来源页')+' · 许可：'+clip.license+' · ';const link=document.createElement('a');link.href=clip.source_url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='查看原始视频及授权';$('provenance').append(desc,link)}else $('provenance').textContent='本地上传 · 仅在此浏览器读取';$('run').disabled=state.busy||!$('video').getAttribute('src');if(!state.busy)say('已选择'+(clip?.label_zh?'「'+clip.label_zh+'」':'本地视频')+'；点击「开始识别」后将在浏览器执行真实推理。')}
$('upload').onchange=e=>{const f=e.target.files?.[0];if(!f)return;if(!['video/mp4','video/webm'].includes(f.type)){say('仅支持 MP4/WebM');return}if(f.size>120*1024*1024){say('文件超过 120 MB 的预览安全上限');return}const url=URL.createObjectURL(f);pick(url);state.objectUrl=url;};
$('reset').onclick=()=>{state.cancelled=true;hideAnnotated();$('video').removeAttribute('src');$('video').load();$('results').textContent='已清除结果';$('evaluation').textContent='请选择视频并运行识别';$('metrics').replaceChildren();state.clip=null;if(state.objectUrl){URL.revokeObjectURL(state.objectUrl);state.objectUrl=null;}$('reference').textContent='参考动作：未选择样例';$('run').disabled=true;say('已清除当前视频')};
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
  if(state.model&&state.meta?.length===47&&state.labels?.length===600)return state.model;
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
    state.model=model;state.meta=inputs;state.labels=labels;
    record('browser_probe',{runtime:'@litertjs/core@2.5.3',accelerator:'wasm',modelSha256:MODEL_SHA,metadataInputs:47,metadataOutputs:28,compiled:true,userAgent:navigator.userAgent});
    record('model_io',{inputs:47,outputs:28,firstInput:inputs[0],firstOutput:outputs[0]});
    return model;
  })();
  state.modelPromise=loading;
  try{return await loading}finally{state.modelPromise=null}
}
async function probe(){
  if(state.busy)return;
  if(state.model){
    $('model-state').textContent='模型已就绪';
    say('WASM 模型已就绪；47 输入 / 28 输出元数据通过。无需重复初始化。');
    return;
  }
  setBusy(true);
  try{
    await ensureModelReady();
    say('WASM 模型已加载，47 输入 / 28 输出元数据通过；可以开始识别。');
  }catch(e){
    say('WASM 加载失败：'+e.message);record('probe_error',{message:e.message,stack:e.stack});
  }finally{setBusy(false)}
}
$('probe').onclick=probe;
function shapeOf(d){const raw=d?.shape??d?.dims??d?.dimensions??d?.shapeSignature;if(Array.isArray(raw))return raw.map(Number);if(raw&&typeof raw.length==='number')return Array.from(raw,Number);if(raw&&typeof raw[Symbol.iterator]==='function')return Array.from(raw,Number);return null}
function tensorFor(data,shape){return new state.api.Tensor(data,shape)}
const sizeOf=shape=>shape.reduce((a,b)=>a*b,1);
async function readFrames(video){if(!Number.isFinite(video.duration)||video.duration<=0){await new Promise((resolve,reject)=>{const fail=()=>{clearTimeout(timer);reject(Error('视频格式不支持或无法读取时长'))};const done=()=>{clearTimeout(timer);resolve()};const timer=setTimeout(fail,12000);video.addEventListener('loadedmetadata',done,{once:true});video.addEventListener('error',fail,{once:true});video.load()})}if(!Number.isFinite(video.duration)||video.duration<=0)throw Error('无法确定视频时长或解码格式');const canvas=document.createElement('canvas');canvas.width=canvas.height=172;const ctx=canvas.getContext('2d',{willReadFrequently:true});const result=[],times=[];const start=performance.now();const duration=Math.min(8,video.duration);for(let t=0;t<duration&&result.length<40;t+=.2){if(state.cancelled)throw Error('用户取消');await new Promise((resolve,reject)=>{const target=Math.min(t,Math.max(0,video.duration-.001));if(Math.abs(video.currentTime-target)<.005&&video.readyState>=2){resolve();return}const tm=setTimeout(()=>reject(Error('视频解码超时')),10000);video.addEventListener('seeked',()=>{clearTimeout(tm);resolve()},{once:true});video.currentTime=target});ctx.drawImage(video,0,0,172,172);const rgba=ctx.getImageData(0,0,172,172).data;const arr=new Float32Array(3*172*172);for(let i=0;i<172*172;i++){arr[i]=rgba[i*4]/255;arr[i+172*172]=rgba[i*4+1]/255;arr[i+2*172*172]=rgba[i*4+2]/255}result.push(arr);times.push(Math.min(t,Math.max(0,video.duration-.001)))}return {frames:result,times,decodeMs:performance.now()-start}}
function softmax(logits){const m=Math.max(...logits),v=Array.from(logits,x=>Math.exp(x-m));const s=v.reduce((a,b)=>a+b,0);return v.map(x=>x/s)}
async function run(){if(state.busy)return;hideAnnotated();setBusy(true);state.cancelled=false;const began=performance.now();try{await ensureModelReady();if(state.cancelled)throw Error('用户取消');const meta=state.meta;if(!meta||meta.length!==47)throw Error('47 输入形状元数据尚未验证');const shapes=meta.map(shapeOf);if(shapes.some(s=>!Array.isArray(s)||s.some(n=>!Number.isInteger(n)||n<1))){record('input_shape_issue',{first:meta.slice(0,3),normalized:shapes.slice(0,3),bad_indices:shapes.map((x,i)=>!Array.isArray(x)||x.some(n=>!Number.isInteger(n)||n<1)?i:null).filter(x=>x!==null)});throw Error('无法获取全部 47 输入的固定张量形状；诊断见推理详情')}if(JSON.stringify(shapes[0])!=='[1,3,172,172]')throw Error('NCHW 输入形状不符');say('正在解码视频并执行逐帧 WASM 推理……');const {frames,times,decodeMs}=await readFrames($('video'));if(!frames.length)throw Error('未解码出有效视频帧');const history=[];let offset=1;for(const depth of DIMS){history.push(Array.from({length:depth},(_,i)=>new Float32Array(sizeOf(shapes[offset+i]))));offset+=depth}let pool=Array.from({length:16},(_,i)=>new Float32Array(sizeOf(shapes[29+i])));let logits;const frameTop1=[];const inferenceStarted=performance.now();for(let count=1;count<=frames.length;count++){if(state.cancelled)throw Error('用户取消');const inputs=[tensorFor(frames[count-1],shapes[0])];for(const group of history)for(const h of group)inputs.push(tensorFor(h,shapes[inputs.length]));for(let j=0;j<16;j++)inputs.push(tensorFor(pool[j],shapes[29+j]));inputs.push(tensorFor(new Float32Array([1/count]),shapes[45]),tensorFor(new Float32Array([1]),shapes[46]));const outputs=await state.model.run(inputs);if(outputs.length!==28)throw Error('预期 28 输出，实际 '+outputs.length);const outTensors=Array.from({length:outputs.length},(_,i)=>outputs[i]);const values=await Promise.all(outTensors.map(x=>x.data()));logits=Float32Array.from(values[0]);if(logits.length!==600||!logits.every(Number.isFinite))throw Error('流式第 '+count+' 帧 logits 无效');const frameScores=softmax(logits);let winner=0;for(let k=1;k<frameScores.length;k++)if(frameScores[k]>frameScores[winner])winner=k;frameTop1.push({frame:count,t:Number(times[count-1].toFixed(3)),id:winner,label:state.labels[winner],score:Number(frameScores[winner].toFixed(6))});for(let c=0;c<DIMS.length;c++)history[c]=[...history[c].slice(1),Float32Array.from(values[1+c])];for(let j=0;j<16;j++){const delta=values[12+j];for(let k=0;k<pool[j].length;k++)pool[j][k]+=delta[k]}for(const t of inputs)t.delete?.();if(typeof outputs.delete==='function')outputs.delete();else for(const t of outTensors)t.delete?.()}if(!logits||logits.length!==600||!logits.every(Number.isFinite))throw Error('输出 logits 无效');const probabilities=softmax(logits);
const ranked=probabilities.map((score,id)=>({id,label:state.labels[id],score})).sort((a,b)=>b.score-a.score);
const top=ranked.slice(0,5);
const comparison=interpretAction(ranked,state.clip,state.labels);
$('results').replaceChildren();
for(const item of top){
  const r=document.createElement('div');r.className='result';
  const label=document.createElement('div');label.className='name';label.textContent=labelDisplay(item.label);
  const relation=relationTag(item.label,comparison);
  if(relation){const hint=document.createElement('small');hint.className='sub';hint.textContent=relation;label.append(hint)}
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
showAnnotated(frameTop1,Math.min(8,$('video').duration));record('inference',{top5:top,frameTop1,frames:frames.length,analyzedSeconds:Math.min(8,$('video').duration),timings,backend:'wasm',clipId:state.clip?.id??null,comparison,modelSha256:MODEL_SHA});
say('真实推理已返回 '+frames.length+' 帧结果。Top-5 是未校准 softmax 分数。');
}catch(e){say('真实推理未完成：'+e.message);$('results').textContent='没有可展示的有效推理结果';record('inference_error',{message:e.message,stack:e.stack})}finally{setBusy(false)}}
$('run').onclick=run;

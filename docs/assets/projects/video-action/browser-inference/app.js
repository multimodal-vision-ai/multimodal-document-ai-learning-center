import {interpretAction,labelDisplay,relationTag} from './semantic.js';
// MVAI V1.0.3 experimental browser adapter. No fake outputs or sample fallback.
const $ = id => document.getElementById(id);
const MODEL_URL='https://huggingface.co/litert-community/MoViNet-A0-Stream-LiteRT/resolve/main/movinet_a0_stream.tflite';
const MODEL_SHA='0565d6e2173caf3e144e6a0a6461edfef9dc5cccacf9a093f311f8a8f05434c8';
const LABELS_URL='https://raw.githubusercontent.com/tensorflow/models/f8af2291cced43fc9f1d9b41ddbf772ae7b0d7d2/official/projects/movinet/files/kinetics_600_labels.txt';
const DATASET='multimodal-vision-ai/mvai-daily-action-demo';
const DIMS=[2,2,2,4,2,2,4,2,2,2,4];
const state={objectUrl:null,clip:null,catalog:null,model:null,api:null,labels:null,meta:null,busy:false,cancelled:false,last:null,runtimePromise:null,modelPromise:null,weightsPromise:null,labelsPromise:null};
let config=null;
async function loadConfig(){const response=await fetch('./config.json',{cache:'no-store'});if(!response.ok)throw Error('本地配置 HTTP '+response.status);config=await response.json();if(config.dataset_id!==DATASET)throw Error('数据源配置错误');return config;}
const say=s=>{$('status').textContent=s;$('status').classList.toggle('error',/失败|未完成|错误|无效/.test(s));};
const record=(event,data)=>{state.last={...(state.last||{}),[event]:data, timestamp:new Date().toISOString()};$('diagnostics').textContent=JSON.stringify(state.last,null,2)};
$('info').onclick=()=>{$('intro').hidden=!$('intro').hidden};
function setBusy(b){state.busy=b;$('probe').disabled=b;$('run').disabled=b||!$('video').getAttribute('src');$('upload').disabled=b;$('model-state').textContent=b?'正在处理…':state.model?'模型已就绪':'尚未加载';}
function pick(url,clip=null){if(state.objectUrl){URL.revokeObjectURL(state.objectUrl);state.objectUrl=null}state.clip=clip;if(url.startsWith('blob:'))$('video').removeAttribute('crossorigin');else $('video').crossOrigin='anonymous';$('video').src=url;$('results').textContent='等待真实推理。';$('evaluation').textContent='点击「开始识别」后，将按参考标签及语义关联解释结果。';$('metrics').replaceChildren();$('reference').textContent=clip?'参考动作：'+clip.label_zh+' / '+clip.label_en:'参考动作：本地文件，无标注';$('provenance').replaceChildren();if(clip){const desc=document.createElement('span');desc.textContent='类型：'+(clip.synthetic?'合成测试':'真实来源视频')+' · 参考标签：'+(clip.reference_evidence||clip.evidence||'来源描述')+' · 作者：'+(clip.attribution||'见来源页')+' · 许可：'+clip.license+' · ';const link=document.createElement('a');link.href=clip.source_url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='查看原始视频及授权';$('provenance').append(desc,link)}else $('provenance').textContent='本地上传 · 仅在此浏览器读取';$('run').disabled=state.busy||!$('video').getAttribute('src')}
$('upload').onchange=e=>{const f=e.target.files?.[0];if(!f)return;if(!['video/mp4','video/webm'].includes(f.type)){say('仅支持 MP4/WebM');return}if(f.size>120*1024*1024){say('文件超过 120 MB 的预览安全上限');return}const url=URL.createObjectURL(f);pick(url);state.objectUrl=url;};
$('reset').onclick=()=>{state.cancelled=true;$('video').removeAttribute('src');$('video').load();$('results').textContent='已清除结果';$('evaluation').textContent='请选择视频并运行识别';$('metrics').replaceChildren();state.clip=null;if(state.objectUrl){URL.revokeObjectURL(state.objectUrl);state.objectUrl=null;}$('reference').textContent='参考动作：未选择样例';$('run').disabled=true;say('已清除当前视频')};
$('cancel').onclick=()=>{state.cancelled=true;say('已请求取消；当前 WASM 调用完成后停止继续处理。')};
$('export').onclick=()=>{const b=new Blob([JSON.stringify(state.last||{},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='mvai-v103-diagnostics.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
// Five user-required human-action categories. This is coverage UI only, not a synthetic dataset.
const REQUIRED_ACTIONS=[
  {id:'phone_call',label:'打电话',examples:['talking on cell phone'],boundary:'手机贴耳且有通话动作；拿着手机不算'},
  {id:'phone_use',label:'看手机',examples:['looking at phone','texting'],boundary:'必须能看到视线或明确操作；不能仅凭手持手机判断'},
  {id:'eating',label:'吃东西',examples:['eating'],boundary:'需要有进食动作，只有食物在桌上不算'},
  {id:'sleep_posture',label:'睡眠姿态',examples:['sleeping'],boundary:'只能识别可见睡眠姿态，不能从躺下推断确实睡着'},
  {id:'falling',label:'摔倒',examples:['falling down'],boundary:'需可见失去平衡及跌落；坐下或躺下不是摔倒'}
];
function renderRequiredCoverage(items=[]){
  const panel=$('target-classes');if(!panel)return;
  panel.replaceChildren();
  for(const action of REQUIRED_ACTIONS){
    const covered=items.filter(x=>x.standard_action_id===action.id&&x.synthetic!==true&&x.status==='approved_demo'&&x.redistribution_approved===true);
    const card=document.createElement('div');
    card.className='target '+(covered.length?'ready':'pending');
    const title=document.createElement('strong');title.textContent=action.label;
    const status=document.createElement('small');status.textContent=covered.length?('真实视频 '+covered.length+' 条 · 可测试'):'待合规视频入库';
    card.title=action.boundary;
    card.append(title,status);panel.append(card);
  }
}
renderRequiredCoverage();
const DEV_FIXTURE={id:'synthetic_wave_001',label_zh:'挥手',label_en:'waving hand',source_url:'https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/blob/feat/video-action-v103/scripts/video-action/generate_demo.py',license:'CC0-1.0',synthetic:true,reference_evidence:'synthetic_controlled',evaluation_tier:'development_only'};
async function addDevFixture(reason){
  const fallback='./samples/synthetic_wave_001.mp4';
  try{
    const check=await fetch(fallback,{method:'HEAD',cache:'no-store'});
    if(!check.ok)throw Error('HTTP '+check.status);
    const btn=document.createElement('button');
    btn.textContent='▶ 合成挥手 · DEV 测试片段';
    btn.title='原创合成动作，仅测试视频播放和模型推理，不代表真实数据集或真实人物动作';
    btn.onclick=()=>pick(fallback,DEV_FIXTURE);
    $('sample-list').append(btn);
    $('provenance').textContent='HF Dataset 尚无已接入的视频目录：'+reason+'。可先选择下方原创合成 DEV 测试片段；它不属于 HF Dataset。';
    record('dev_fixture',{available:true,reason});
  }catch(e){
    $('sample-list').textContent='没有可用示例，可本地上传 MP4/WebM';
    $('provenance').textContent='HF Dataset 未接入：'+reason+'；DEV 合成测试片段也未部署（'+e.message+'）';
    record('catalog_error',{reason,fixture:e.message});
  }
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
  renderRequiredCoverage(c.items);
  const box=$('sample-list');
  box.replaceChildren();
  for(const clip of c.items){
    if(clip.synthetic===true)continue; // real-person pilot first; synthetic remains an engineering fallback
    const relative=String(clip.relative_file||'');
    const filename=relative.startsWith('demo/videos/')?relative.slice(12):'';
    const safeName=filename.length>0&&[...filename].every(ch=>'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-'.includes(ch));
    if(clip.status!=='approved_demo'||clip.redistribution_approved!==true||!clip.license||!clip.source_url||!safeName||!(filename.endsWith('.mp4')||filename.endsWith('.webm')))continue;
    const btn=document.createElement('button');
    btn.textContent='▶ '+clip.label_zh+(clip.synthetic?' · 合成示例':' · 真人实拍');
    btn.dataset.clipId=clip.id;
    btn.onclick=()=>{pick('https://huggingface.co/datasets/'+DATASET+'/resolve/'+revision+'/'+clip.relative_file,clip);box.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===btn))};
    box.append(btn);
  }
  if(!box.childElementCount)throw Error('HF catalog 尚无已批准的演示样例');
  $('provenance').textContent='HF Dataset · '+(provisional?'临时读取版本 ':'固定版本 ')+revision.slice(0,12)+(provisional?'（待写入 DEV config.json 固定）':'')+' · 具体视频许可与作者见来源链接';
  record('catalog',{revision,count:box.childElementCount,provisional});
  if(!state.clip&&box.firstElementChild)box.firstElementChild.click();
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
async function readFrames(video){if(!Number.isFinite(video.duration)||video.duration<=0){await new Promise((resolve,reject)=>{const fail=()=>{clearTimeout(timer);reject(Error('视频格式不支持或无法读取时长'))};const done=()=>{clearTimeout(timer);resolve()};const timer=setTimeout(fail,12000);video.addEventListener('loadedmetadata',done,{once:true});video.addEventListener('error',fail,{once:true});video.load()})}if(!Number.isFinite(video.duration)||video.duration<=0)throw Error('无法确定视频时长或解码格式');const canvas=document.createElement('canvas');canvas.width=canvas.height=172;const ctx=canvas.getContext('2d',{willReadFrequently:true});const result=[];const start=performance.now();const duration=Math.min(8,video.duration);for(let t=0;t<duration&&result.length<40;t+=.2){if(state.cancelled)throw Error('用户取消');await new Promise((resolve,reject)=>{const target=Math.min(t,Math.max(0,video.duration-.001));if(Math.abs(video.currentTime-target)<.005&&video.readyState>=2){resolve();return}const tm=setTimeout(()=>reject(Error('视频解码超时')),10000);video.addEventListener('seeked',()=>{clearTimeout(tm);resolve()},{once:true});video.currentTime=target});ctx.drawImage(video,0,0,172,172);const rgba=ctx.getImageData(0,0,172,172).data;const arr=new Float32Array(3*172*172);for(let i=0;i<172*172;i++){arr[i]=rgba[i*4]/255;arr[i+172*172]=rgba[i*4+1]/255;arr[i+2*172*172]=rgba[i*4+2]/255}result.push(arr)}return {frames:result,decodeMs:performance.now()-start}}
function softmax(logits){const m=Math.max(...logits),v=Array.from(logits,x=>Math.exp(x-m));const s=v.reduce((a,b)=>a+b,0);return v.map(x=>x/s)}
async function run(){setBusy(true);state.cancelled=false;const began=performance.now();try{const meta=state.meta;if(!meta||meta.length!==47)throw Error('47 输入形状元数据尚未验证');const shapes=meta.map(shapeOf);if(shapes.some(s=>!Array.isArray(s)||s.some(n=>!Number.isInteger(n)||n<1))){record('input_shape_issue',{first:meta.slice(0,3),normalized:shapes.slice(0,3),bad_indices:shapes.map((x,i)=>!Array.isArray(x)||x.some(n=>!Number.isInteger(n)||n<1)?i:null).filter(x=>x!==null)});throw Error('无法获取全部 47 输入的固定张量形状；诊断见推理详情')}if(JSON.stringify(shapes[0])!=='[1,3,172,172]')throw Error('NCHW 输入形状不符');say('正在解码视频并执行逐帧 WASM 推理……');const {frames,decodeMs}=await readFrames($('video'));const history=[];let offset=1;for(const depth of DIMS){history.push(Array.from({length:depth},(_,i)=>new Float32Array(sizeOf(shapes[offset+i]))));offset+=depth}let pool=Array.from({length:16},(_,i)=>new Float32Array(sizeOf(shapes[29+i])));let logits;const inferenceStarted=performance.now();for(let count=1;count<=frames.length;count++){if(state.cancelled)throw Error('用户取消');const inputs=[tensorFor(frames[count-1],shapes[0])];for(const group of history)for(const h of group)inputs.push(tensorFor(h,shapes[inputs.length]));for(let j=0;j<16;j++)inputs.push(tensorFor(pool[j],shapes[29+j]));inputs.push(tensorFor(new Float32Array([1/count]),shapes[45]),tensorFor(new Float32Array([1]),shapes[46]));const outputs=await state.model.run(inputs);if(outputs.length!==28)throw Error('预期 28 输出，实际 '+outputs.length);const outTensors=Array.from({length:outputs.length},(_,i)=>outputs[i]);const values=await Promise.all(outTensors.map(x=>x.data()));logits=Float32Array.from(values[0]);for(let c=0;c<DIMS.length;c++)history[c]=[...history[c].slice(1),Float32Array.from(values[1+c])];for(let j=0;j<16;j++){const delta=values[12+j];for(let k=0;k<pool[j].length;k++)pool[j][k]+=delta[k]}for(const t of inputs)t.delete?.();if(typeof outputs.delete==='function')outputs.delete();else for(const t of outTensors)t.delete?.()}if(!logits||logits.length!==600||!logits.every(Number.isFinite))throw Error('输出 logits 无效');const probabilities=softmax(logits);const ranked=probabilities.map((score,id)=>({id,label:state.labels[id],score})).sort((a,b)=>b.score-a.score);const top=ranked.slice(0,5);const target=state.clip?.label_en;const targetIndex=target?state.labels.indexOf(target):-1;const targetRank=targetIndex>=0?ranked.findIndex(x=>x.id===targetIndex)+1:null;const comparison=target?{reference_label:target,evidence:state.clip?.reference_evidence||state.clip?.evidence||'unknown',evaluation_tier:state.clip?.evaluation_tier||'development_only',target_supported:targetIndex>=0,target_rank:targetRank,top1_match:targetRank===1,top5_match:targetRank!==null&&targetRank<=5,scorable_benchmark:state.clip?.verified_label===true&&state.clip?.evaluation_tier==='reviewed_benchmark'}:null;$('results').replaceChildren();for(const item of top){const r=document.createElement('div');r.className='result';const label=document.createElement('span');label.textContent=item.label;const track=document.createElement('div');track.className='track';const bar=document.createElement('div');bar.className='fill';bar.style.width=(item.score*100)+'%';track.append(bar);const pct=document.createElement('span');pct.textContent=(item.score*100).toFixed(2)+'%';r.append(label,track,pct);$('results').append(r)}if(comparison){const info=document.createElement('p');info.className='notice';info.textContent=comparison.target_supported?'参考动作「'+target+'」原生类别覆盖；排名 #'+comparison.target_rank+'；Top-1 '+(comparison.top1_match?'一致':'未命中')+'，Top-5 '+(comparison.top5_match?'包含':'未包含')+'。来源描述仅用于试验性对照，非正式准确率。':'参考动作「'+target+'」不在模型原生 600 类中；无法判定识别正确率。';$('results').prepend(info)}const timings={decodeMs:Math.round(decodeMs),inferenceMs:Math.round(performance.now()-inferenceStarted),totalMs:Math.round(performance.now()-began)};record('inference',{top5:top,frames:frames.length,timings,backend:'wasm',clipId:state.clip?.id??null,comparison,modelSha256:MODEL_SHA});say('真实推理已返回 '+frames.length+' 帧结果。Top-5 是未校准 softmax 分数。')}catch(e){say('真实推理未完成：'+e.message);$('results').textContent='没有可展示的有效推理结果';record('inference_error',{message:e.message,stack:e.stack})}finally{setBusy(false)}}
$('run').onclick=run;

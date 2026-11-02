/**
 * V1.0.7 experimental Apple MobileCLIP-S0 video keyframe adapter.
 * Zero-shot image/text matching only; NOT a temporal video action model.
 * The six scores form a closed-set, prompt-dependent relative distribution.
 * Every result must come from real decoded video frames, never clip filenames.
 */
export const MOBILECLIP=Object.freeze({
  id:'mobileclip_s0',
  modelId:'Xenova/mobileclip_s0',
  library:'@huggingface/transformers@3.8.1',
  frameCount:6,
  frameSize:256,
  labels:Object.freeze([
    {id:'waving hand', prompt:'a person waving their hand', action:'wave'},
    {id:'using mobile phone',prompt:'a person looking at a mobile phone',action:'phone_use'},
    {id:'talking on telephone',prompt:'a person talking on a telephone',action:'phone_call'},
    {id:'falling down',prompt:'a person falling to the ground',action:'falling'},
    {id:'eating food',prompt:'a person eating food',action:'eating'},
    {id:'sleeping',prompt:'a person sleeping in bed',action:'sleeping'}
  ])
});
export const MOBILECLIP_PROMPTS=MOBILECLIP.labels.map(x=>x.prompt);
export const MOBILECLIP_LABELS=MOBILECLIP.labels.map(x=>x.id);
export const mobileCLIPModelName='Apple MobileCLIP-S0';
const safeError=e=>e instanceof Error?e.message:String(e);
const assertScores=values=>{
  if(!Array.isArray(values)||values.length!==MOBILECLIP.labels.length||values.some(v=>!Number.isFinite(v)||v<0))
    throw Error('MobileCLIP 返回的六类匹配分数无效');
  const total=values.reduce((a,b)=>a+b,0);
  if(!(total>0))throw Error('MobileCLIP 六类分数全为零');
  return values.map(v=>v/total);
};
export function aggregateMobileCLIPScores(frameVectors){
  if(!Array.isArray(frameVectors)||frameVectors.length<1)throw Error('没有有效关键帧分数');
  const total=Array(MOBILECLIP.labels.length).fill(0);
  for(const vec of frameVectors)assertScores(vec).forEach((v,i)=>{total[i]+=v});
  return total.map(v=>v/frameVectors.length);
}
export function normalizeMobileCLIPResult(result){
  if(!Array.isArray(result)||result.length!==MOBILECLIP.labels.length)
    throw Error('MobileCLIP 推理没有返回六个候选描述');
  const byPrompt=new Map(result.map(x=>[x.label,x.score]));
  return assertScores(MOBILECLIP_PROMPTS.map(p=>byPrompt.get(p)));
}
export function mobileCLIPReferenceRank(scores,clip){
  const action=clip?.standard_action_id ?? ({
    'waving hand':'wave','falling':'falling',
    'eating':'eating','sleeping':'sleeping'
  }[clip?.label_en]??null);
  const id=MOBILECLIP.labels.findIndex(x=>x.action===action);
  if(id<0)return null;
  const ranked=scores.map((score,i)=>({score,i})).sort((a,b)=>b.score-a.score);
  return ranked.findIndex(x=>x.i===id)+1;
}
export async function sampleMobileCLIPFrames(video,isCancelled){
  if(!Number.isFinite(video.duration)||video.duration<=0||!video.videoWidth||!video.videoHeight)
    throw Error('视频时长或分辨率无效，无法提取 MobileCLIP 关键帧');
  const frames=[],times=[],start=performance.now();
  const duration=Math.min(8,video.duration);
  for(let i=0;i<MOBILECLIP.frameCount;i++){
    if(isCancelled?.())throw Error('用户取消');
    const second=Math.min(duration*(i+0.5)/MOBILECLIP.frameCount,Math.max(0,video.duration-.02));
    if(Math.abs(video.currentTime-second)>.009||video.readyState<2){
      await new Promise((resolve,reject)=>{
        let timer;
        const clean=()=>{clearTimeout(timer);video.removeEventListener('seeked',done);video.removeEventListener('error',fail)};
        const done=()=>{clean();resolve()};
        const fail=()=>{clean();reject(Error('视频解码失败'))};
        timer=setTimeout(()=>{clean();reject(Error('MobileCLIP 关键帧采样超时'))},14000);
        video.addEventListener('seeked',done);video.addEventListener('error',fail);
        video.currentTime=second;
      });
    }
    const canvas=document.createElement('canvas');canvas.width=canvas.height=MOBILECLIP.frameSize;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    if(!ctx)throw Error('浏览器 Canvas 不可用');
    // Center crop preserves source aspect ratio; no stretching of people/objects.
    const w=video.videoWidth,h=video.videoHeight,side=Math.min(w,h);
    ctx.drawImage(video,(w-side)/2,(h-side)/2,side,side,0,0,canvas.width,canvas.height);
    frames.push(canvas);times.push(second);
  }
  return {frames,times,decodeMs:performance.now()-start};
}
/**
 * The Xenova export has TWO ONNX graphs (text_model + vision_model), not model.onnx.
 * The generic pipeline() currently assumes the latter. Follow the published
 * model-card CLIPTextModelWithProjection/CLIPVisionModelWithProjection recipe.
 * Text embeddings are computed once; only the vision graph runs per keyframe.
 */
async function initializeMobileCLIPBackend(lib,backend,dtype,onProgress){
  const {AutoTokenizer,AutoProcessor,CLIPTextModelWithProjection,
    CLIPVisionModelWithProjection,RawImage,dot,softmax}=lib;
  const tokenizer=await AutoTokenizer.from_pretrained(MOBILECLIP.modelId);
  const processor=await AutoProcessor.from_pretrained(MOBILECLIP.modelId);
  onProgress?.('MobileCLIP: 加载文本编码器（'+backend+'/'+dtype+'）…');
  const textModel=await CLIPTextModelWithProjection.from_pretrained(
    MOBILECLIP.modelId,{device:backend,dtype});
  const descriptions=MOBILECLIP_PROMPTS.map(p=>'This is a photo of '+p+'.');
  const textInputs=tokenizer(descriptions,{padding:'max_length',truncation:true});
  const {text_embeds}=await textModel(textInputs);
  const textFeatures=text_embeds.normalize().tolist();
  await textModel.dispose?.();
  if(textFeatures.length!==6||textFeatures.some(x=>!Array.isArray(x)))
    throw Error('MobileCLIP 文本编码器输出不是六个有效向量');
  onProgress?.('MobileCLIP: 加载视觉编码器（'+backend+'/'+dtype+'）…');
  const visionModel=await CLIPVisionModelWithProjection.from_pretrained(
    MOBILECLIP.modelId,{device:backend,dtype});
  const classifier=async(canvas,prompts)=>{
    if(prompts.length!==6||prompts.some((p,i)=>p!==MOBILECLIP_PROMPTS[i]))
      throw Error('MobileCLIP 关键词集合已变化');
    const image=RawImage.fromCanvas(canvas);
    const imageInputs=await processor(image);
    const {image_embeds}=await visionModel(imageInputs);
    const features=image_embeds.normalize().tolist();
    if(features.length!==1)throw Error('MobileCLIP 视觉模型返回错误的张量批次');
    const probabilities=softmax(textFeatures.map(text=>100*dot(features[0],text)));
    return MOBILECLIP_PROMPTS.map((label,i)=>({label,score:Number(probabilities[i])}));
  };
  return {classifier,backend,dtype,weightsMB:dtype==='fp16'?108:54.6,webgpuError:null};
}
export async function loadMobileCLIP({onProgress}={}){
  onProgress?.('初始化 Transformers.js；首次需要从 HF 下载 MobileCLIP-S0 图像与文本模型…');
  const lib=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm');
  let webgpuError=null;
  if(navigator.gpu){
    try{
      return await initializeMobileCLIPBackend(lib,'webgpu','fp16',onProgress);
    }catch(e){webgpuError=safeError(e)}
  }else webgpuError='浏览器未提供 WebGPU';
  onProgress?.('WebGPU 不可用，正在按模型卡加载 MobileCLIP-S0 · WASM/q8…');
  try{
    const model=await initializeMobileCLIPBackend(lib,'wasm','q8',onProgress);
    model.webgpuError=webgpuError;
    return model;
  }catch(e){throw Error('MobileCLIP WebGPU 不可用：'+webgpuError+'；WASM 亦失败：'+safeError(e))}
}
export async function inferMobileCLIP({classifier,frames,isCancelled,onProgress}){
  if(!Array.isArray(frames)||frames.length!==MOBILECLIP.frameCount)throw Error('关键帧数量不是 6');
  const perFrame=[];
  for(let i=0;i<frames.length;i++){
    if(isCancelled?.())throw Error('用户取消');
    onProgress?.('MobileCLIP 正在匹配第 '+(i+1)+'/'+frames.length+' 张真实关键帧…');
    const output=await classifier(frames[i],MOBILECLIP_PROMPTS);
    perFrame.push(normalizeMobileCLIPResult(output));
  }
  const scores=aggregateMobileCLIPScores(perFrame);
  return {scores,perFrame,frameCount:perFrame.length};
}

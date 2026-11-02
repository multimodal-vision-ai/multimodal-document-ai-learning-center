/**
 * Complete-duration sequential MoViNet decoding and streaming inference.
 * Keeps only ONE decoded frame and current model state in memory.
 * All temporal points come from actual model logits (no synthetic labels).
 */
import {actorBoxAt,drawActorCrop} from './person-target.js';
export const MOVINET_FPS=5;
const A0_DEPTHS=[2,2,2,4,2,2,4,2,2,2,4];
const count=shape=>shape.reduce((v,n)=>v*n,1);
const asShape=d=>Array.from(d?.shape??d?.dims??d?.dimensions??d?.shapeSignature??[],Number);
export function sampleCount(duration,fps=MOVINET_FPS){
 if(!Number.isFinite(duration)||duration<=0||!(fps>0))throw Error('需要有效的视频时长');
 return Math.ceil(duration*fps-1e-8);
}
export function sampleTime(index,duration,fps=MOVINET_FPS){
 if(!Number.isInteger(index)||index<0||index>=sampleCount(duration,fps))throw Error('无效采样序号');
 return Math.min(index/fps,Math.max(0,duration-.001));
}
export async function seekVideo(video,target,isCancelled){
 if(isCancelled?.())throw Error('用户取消');
 if(Math.abs(video.currentTime-target)<.005&&video.readyState>=2)return;
 await new Promise((resolve,reject)=>{
   let timer;
   const cleanup=()=>{
     clearTimeout(timer);
     video.removeEventListener('seeked',complete);
     video.removeEventListener('error',error);
   };
   const complete=()=>{cleanup();resolve()};
   const error=()=>{cleanup();reject(Error('视频解码失败'))};
   timer=setTimeout(()=>{cleanup();reject(Error('视频定位解码超时'))},14000);
   video.addEventListener('seeked',complete);
   video.addEventListener('error',error,{once:true});
   try{video.currentTime=target}catch(err){cleanup();reject(err)}
 });
 if(isCancelled?.())throw Error('用户取消');
}
const softmax=logits=>{
 const peak=Math.max(...logits);
 const exp=Array.from(logits,x=>Math.exp(x-peak));
 const sum=exp.reduce((a,b)=>a+b,0);
 return exp.map(x=>x/sum);
};
function createA0Session({api,model,meta}){
 const shapes=meta.map(asShape);
 if(shapes.length!==47||JSON.stringify(shapes[0])!=='[1,3,172,172]'||
    shapes.some(x=>!x.length||x.some(n=>!Number.isInteger(n)||n<1)))
   throw Error('MoViNet-A0 47 个输入形状无效');
 const history=[];let offset=1;
 for(const depth of A0_DEPTHS){
   history.push(Array.from({length:depth},(_,i)=>new Float32Array(count(shapes[offset+i]))));
   offset+=depth;
 }
 const pool=Array.from({length:16},(_,i)=>new Float32Array(count(shapes[29+i])));
 let processed=0;
 return {
  async push(image){
   processed++;
   const inputs=[new api.Tensor(image,shapes[0])];
   let output;
   try{
     for(const group of history)for(const item of group)
       inputs.push(new api.Tensor(item,shapes[inputs.length]));
     for(let j=0;j<16;j++)inputs.push(new api.Tensor(pool[j],shapes[29+j]));
     inputs.push(new api.Tensor(new Float32Array([1/processed]),shapes[45]));
     inputs.push(new api.Tensor(new Float32Array([1]),shapes[46]));
     output=await model.run(inputs);
     if(output.length!==28)throw Error('MoViNet-A0 输出数量不符');
     const values=await Promise.all(Array.from(output,t=>t.data()));
     const logits=Float32Array.from(values[0]);
     if(logits.length!==600||!logits.every(Number.isFinite))throw Error('MoViNet-A0 输出无效');
     for(let i=0;i<A0_DEPTHS.length;i++)
       history[i]=[...history[i].slice(1),Float32Array.from(values[i+1])];
     for(let j=0;j<16;j++){
       const delta=values[12+j];
       for(let k=0;k<pool[j].length;k++)pool[j][k]+=delta[k];
     }
     return logits;
   }finally{
     for(const input of inputs)input.delete?.();
     if(output){
       if(typeof output.delete==='function')output.delete();
       else for(const t of output)t.delete?.();
     }
   }
  }
 };
}
export function createOfficialSession({api,model,contract}){
 const state=new Map();
 for(const input of contract.inputs){
   if(input.name==='image')continue;
   const size=count(input.shape);
   if(size>4e6)throw Error('异常的大型状态张量');
   state.set(input.name,input.type==='int32'?new Int32Array(size):new Float32Array(size));
 }
 return {
  async push(image){
   const inputs=[];let output;
   try{
     for(const spec of contract.inputs)
       inputs.push(new api.Tensor(spec.name==='image'?image:state.get(spec.name),spec.shape));
     output=await model.run(inputs);
     if(output.length!==contract.outputs.length)throw Error('MoViNet Streaming 输出元数据发生变化');
     const values=await Promise.all(Array.from(output,x=>x.data()));
     let logits;
     for(const [i,spec] of contract.outputs.entries()){
       if(spec.name==='logits'){
         logits=Float32Array.from(values[i]);
         if(logits.length!==600||!logits.every(Number.isFinite))throw Error('MoViNet 输出 logits 无效');
       }else{
         const Type=spec.type==='int32'?Int32Array:Float32Array;
         state.set(spec.name,Type.from(values[i]));
       }
     }
     if(!logits)throw Error('MoViNet 未返回分类输出');
     return logits;
   }finally{
     for(const input of inputs)input.delete?.();
     if(output){
       if(typeof output.delete==='function')output.delete();
       else for(const t of output)t.delete?.();
     }
   }
  }
 };
}
export async function analyzeCompleteMoViNet({
 video,variant,api,model,meta,contract,labels,toFrame,isCancelled,onProgress,actorTrack
}){
 if(!['a0','a1','a2'].includes(variant))throw Error('仅 MoViNet Streaming 支持完整连续分析');
 const duration=video.duration,total=sampleCount(duration);
 const size=variant==='a2'?224:172;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 if(!ctx)throw Error('浏览器无法建立 Canvas 视频帧缓冲');
 const session=variant==='a0'?createA0Session({api,model,meta}):createOfficialSession({api,model,contract});
 const frameTop1=[];
 let logits=null,decodeMs=0,inferenceMs=0,untracked=0;
 const wasPlaying=!video.paused;
 const originalTime=video.currentTime;
 video.pause();
 try{
   for(let index=0;index<total;index++){
     if(isCancelled?.())throw Error('用户取消');
     const timestamp=sampleTime(index,duration);
     const decodeStart=performance.now();
     await seekVideo(video,timestamp,isCancelled);
     const box=actorBoxAt(actorTrack,timestamp,{maxAge:1.0});
     if(!box){
       untracked++;
       frameTop1.push({frame:index+1,t:Number(timestamp.toFixed(3)),id:null,
         label:'未检测到人物',score:0,missing:true,personBox:null});
       if((index+1)%5===0)onProgress?.({processed:index+1,total,
         seconds:Math.min(duration,(index+1)/MOVINET_FPS),duration,untracked});
       continue; // Missing sample has NO classification; never feed the scene.
     }
     drawActorCrop(ctx,video,box,size);
     const pixels=ctx.getImageData(0,0,size,size).data;
     const frame=toFrame(pixels,size,variant);
     decodeMs+=performance.now()-decodeStart;
     const inferStart=performance.now();
     logits=await session.push(frame);
     inferenceMs+=performance.now()-inferStart;
     const probabilities=softmax(logits);
     let winner=0;
     for(let j=1;j<probabilities.length;j++)if(probabilities[j]>probabilities[winner])winner=j;
     frameTop1.push({frame:index+1,t:Number(timestamp.toFixed(3)),id:winner,
       label:labels[winner],score:Number(probabilities[winner].toFixed(6)),personBox:box});
     if(index===0||index===total-1||((index+1)%5===0))
       onProgress?.({processed:index+1,total,seconds:Math.min(duration,(index+1)/MOVINET_FPS),duration});
     // Yield to the browser UI and cancellation handlers even during long videos.
     if((index+1)%5===0)await new Promise(resolve=>setTimeout(resolve,0));
   }
   if(!logits)throw Error('视频未生成有效 MoViNet 结果');
   return {logits,frameTop1,framesProcessed:total-untracked,framesAttempted:total,untracked,duration,decodeMs,inferenceMs};
 }finally{
   try{
     const t=Math.min(originalTime,Math.max(0,duration-.001));
     await seekVideo(video,t,()=>false);
     if(wasPlaying)video.play().catch(()=>{});
   }catch{/* If the video became unavailable during cancellation, keep the original inference error. */}
 }
}

/**
 * A visualization-only temporal summary. Does NOT claim ground-truth boundaries.
 * 5-sample centered majority smoothing; returns contiguous display ranges.
 */
export function buildActionSegments(points,duration,{windowSize=5}={}){
 if(!points.length||!Number.isFinite(duration)||duration<=0)return [];
 const half=Math.floor(windowSize/2);
 const smoothed=points.map((point,i)=>{
   const scores=new Map();
   for(let j=Math.max(0,i-half);j<=Math.min(points.length-1,i+half);j++){
     const x=points[j];const old=scores.get(x.label)||{count:0,total:0};
     old.count++;old.total+=x.score;scores.set(x.label,old);
   }
   let label=point.label,maxCount=-1,maxScore=-1;
   for(const [candidate,x] of scores){
     if(x.count>maxCount||(x.count===maxCount&&x.total>maxScore)){
       label=candidate;maxCount=x.count;maxScore=x.total;
     }
   }
   return label;
 });
 const ranges=[];
 for(let i=0;i<points.length;i++){
   const label=smoothed[i];
   const end=i===points.length-1?duration:Math.min(duration,points[i+1].t);
   if(end<=points[i].t)continue;
   const last=ranges.at(-1);
   if(last&&last.label===label){
     last.end=end;last.samples++;
     last.rawScores.push(points[i].score);
   }else ranges.push({start:points[i].t,end,label,samples:1,rawScores:[points[i].score]});
 }
 return ranges.map(({rawScores,...range})=>({...range,
   score:Number((rawScores.reduce((a,b)=>a+b,0)/rawScores.length).toFixed(4))}));
}

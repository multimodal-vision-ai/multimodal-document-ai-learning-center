/**
 * Full video, non-streaming model inference over consecutive 4s actor windows.
 * Unlike MoViNet this produces ONE model result per window, never fake 5 FPS.
 */
import {sampleVideoMAEFrames,inferVideoMAE} from './video-mae.js';
import {sampleMobileCLIPFrames,inferMobileCLIP,MOBILECLIP_LABELS} from './mobileclip.js';
const softmax=values=>{
 const max=Math.max(...values);
 const exp=Array.from(values,x=>Math.exp(x-max));
 const sum=exp.reduce((x,y)=>x+y,0);
 return exp.map(x=>x/sum);
};
export async function analyzeWindowedActor({
 video,variant,api,model,classifier,labels,actorTrack,isCancelled,onProgress,windowSeconds=4
}){
 if(!['videomae','mobileclip_s0'].includes(variant))throw Error('Unsupported window model');
 if(!(video.duration>0))throw Error('视频没有有效长度');
 const total=Math.ceil(video.duration/windowSeconds),points=[];
 let logits=null,probabilities=null,decodeMs=0,inferenceMs=0,completed=0;
 for(let index=0;index<total;index++){
   if(isCancelled?.())throw Error('用户取消');
   const start=index*windowSeconds,end=Math.min(video.duration,start+windowSeconds);
   try{
     const t=performance.now();
     const sample=variant==='videomae'?
       await sampleVideoMAEFrames(video,isCancelled,{start,end,actorTrack}):
       await sampleMobileCLIPFrames(video,isCancelled,{start,end,actorTrack});
     decodeMs+=performance.now()-t;
     const begun=performance.now();
     if(variant==='videomae'){
       logits=await inferVideoMAE({api,model,frames:sample.frames});
       probabilities=softmax(logits);
     }else{
       const result=await inferMobileCLIP({classifier,frames:sample.frames,isCancelled});
       probabilities=result.scores;
       logits=Float32Array.from(probabilities,x=>Math.log(Math.max(x,1e-30)));
     }
     inferenceMs+=performance.now()-begun;
     let winner=0;
     for(let i=1;i<probabilities.length;i++)if(probabilities[i]>probabilities[winner])winner=i;
     points.push({frame:index+1,t:start,label:labels[winner],id:winner,
       score:Number(probabilities[winner].toFixed(6)),windowEnd:end});
     completed++;
   }catch(error){
     // Missing person is represented as NO CLASSIFICATION, never scene fallback.
     if(/人物跟踪缺失/.test(String(error.message))){
       points.push({frame:index+1,t:start,label:'未检测到人物',score:0,
         missing:true,windowEnd:end});
     }else throw error;
   }
   onProgress?.({processed:index+1,total,seconds:end,duration:video.duration,completed});
   await new Promise(resolve=>setTimeout(resolve,0));
 }
 if(!completed||!logits)throw Error('全部片段均未找到可信人物，没有执行整幅画面的模型替代推理');
 return {logits,probabilities,frameTop1:points,duration:video.duration,
   framesProcessed:completed*(variant==='videomae'?16:6),
   windowsTotal:total,windowsCompleted:completed,decodeMs,inferenceMs};
}

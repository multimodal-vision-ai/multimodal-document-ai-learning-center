/**
 * Qualcomm VideoMAE browser-only adapter (original architecture MCG-NJU).
 * Distinct 16-frame Kinetics-400 CLIP classification, not MoViNet streaming.
 * Original model is loaded from pinned Qualcomm HF repo; never mirrored locally.
 * Original model.py performs normalization IN the graph and returns logits despite
 * the exported TFLite name "class_probs". Always softmax after raw inference.
 */
import {actorBoxAt,drawActorCrop} from './person-target.js';
export const VIDEOMAE={
 id:'videomae',
 label:'Qualcomm VideoMAE',
 bytes:351055312,
 sha256:'f484347d2d11bc132f40781615731730c5c8519a1ba9684e55114e889714a343',
 url:'https://huggingface.co/qualcomm/Video-MAE/resolve/d786d813bcfbffd6d28043207fa995bd9158c487/Video-MAE.tflite',
 labels:'https://huggingface.co/MCG-NJU/videomae-base-finetuned-kinetics/resolve/ae026a85a9f314a54a95ea2aebccf877da731b21/config.json',
 license:'Qualcomm deployment model: consult source terms; original MCG-NJU checkpoint CC BY-NC 4.0'
};
const hex=a=>Array.from(new Uint8Array(a)).map(x=>x.toString(16).padStart(2,'0')).join('');
/**
 * Bounded, cancellable streaming download. A large HF model must not leave the
 * whole comparison locked forever when the connection stalls.
 * The thresholds are download guardrails, not promises of model execution time.
 */
export async function downloadVideoMAEWeights({
 url=VIDEOMAE.url,expectedBytes=VIDEOMAE.bytes,signal,onProgress,
 fetchImpl=fetch,maxMs=180000,idleMs=30000
}={}){
 const controller=new AbortController();
 let reason='';
 const abort=(message)=>{if(!controller.signal.aborted){reason=message;controller.abort()}};
 const onAbort=()=>abort('用户取消');
 if(signal?.aborted)throw Error('用户取消');
 signal?.addEventListener('abort',onAbort,{once:true});
 let idleTimer,overallTimer,reader,received=0,lastProgress=0;
 const armIdle=()=>{
   clearTimeout(idleTimer);
   idleTimer=setTimeout(()=>abort('下载连续 '+Math.round(idleMs/1000)+' 秒无数据'),idleMs);
 };
 try{
   overallTimer=setTimeout(()=>abort('下载超过 '+Math.round(maxMs/1000)+' 秒上限'),maxMs);
   armIdle();
   const response=await fetchImpl(url,{signal:controller.signal});
   if(!response.ok)throw Error('VideoMAE 权重 HTTP '+response.status);
   const bytes=new Uint8Array(expectedBytes);
   if(!response.body?.getReader){
     const all=new Uint8Array(await response.arrayBuffer());
     if(all.byteLength!==expectedBytes)throw Error('VideoMAE 模型大小不符：'+all.byteLength);
     bytes.set(all);received=all.byteLength;
   }else{
     reader=response.body.getReader();
     while(true){
       if(controller.signal.aborted)throw Error(reason||'用户取消');
       const {done,value}=await reader.read();
       if(done)break;
       if(!value?.length)continue;
       if(received+value.length>expectedBytes)throw Error('VideoMAE 文件超出预期大小');
       bytes.set(value,received);
       received+=value.length;
       armIdle();
       const now=Date.now();
       if(now-lastProgress>1200||received===expectedBytes){
         lastProgress=now;
         onProgress?.('下载 VideoMAE：'+(received/1e6).toFixed(0)+' / '+(expectedBytes/1e6).toFixed(0)+' MB ('+(100*received/expectedBytes).toFixed(0)+'%) · 可取消');
       }
     }
   }
   if(received!==expectedBytes)throw Error('VideoMAE 下载不完整：'+received+' / '+expectedBytes+' 字节');
   if(controller.signal.aborted)throw Error(reason||'用户取消');
   return bytes.buffer;
 }catch(error){
   if(controller.signal.aborted)throw Error(reason||'用户取消');
   throw error;
 }finally{
   clearTimeout(idleTimer);clearTimeout(overallTimer);
   signal?.removeEventListener('abort',onAbort);
   if(reader)try{reader.releaseLock()}catch{}
 }
}
export async function compileVideoMAE({api,loadRuntime,onProgress,signal}){
 onProgress?.('准备下载 Qualcomm VideoMAE · 351 MB（限时、支持取消）');
 const bytes=await downloadVideoMAEWeights({signal,onProgress});
 const sha=hex(await crypto.subtle.digest('SHA-256',bytes));
 if(sha!==VIDEOMAE.sha256)throw Error('VideoMAE SHA256 mismatch');
 if(signal?.aborted)throw Error('用户取消');
 await loadRuntime();
 if(signal?.aborted)throw Error('用户取消');
 onProgress?.('编译 Qualcomm VideoMAE TFLite · K400');
 const model=await api.loadAndCompile(new Uint8Array(bytes),{accelerator:'wasm'});
 if(signal?.aborted)throw Error('用户取消');
 const shapeOf=d=>Array.from(d?.shape??d?.dims??d?.dimensions??[],Number);
 const inputs=model.getInputDetails(),outputs=model.getOutputDetails();
 if(inputs.length!==1||outputs.length!==1||JSON.stringify(shapeOf(inputs[0]))!=='[1,16,224,224,3]'||
    JSON.stringify(shapeOf(outputs[0]))!=='[1,400]')
   throw Error('Qualcomm VideoMAE tensor contract changed');
 const labelsResponse=await fetch(VIDEOMAE.labels);
 if(!labelsResponse.ok)throw Error('Kinetics400 class list HTTP '+labelsResponse.status);
 const config=await labelsResponse.json();
 const labels=Array.from({length:400},(_,i)=>config.id2label?.[String(i)]??null);
 if(labels.some(x=>typeof x!=='string'||!x))throw Error('Kinetics400 label mapping incomplete');
 return {model,labels,bytes:VIDEOMAE.bytes,sha256:sha,inputShape:[1,16,224,224,3]};
}
export async function sampleVideoMAEFrames(video, isCancelled,{start=0,end=Math.min(8,video.duration),actorTrack=null}={}){
 if(!Number.isFinite(video.duration)||video.duration<=0)throw Error('视频时长无效');
 const size=224,canvas=document.createElement('canvas');canvas.width=canvas.height=size;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 const frames=new Float32Array(16*size*size*3);
 const duration=end-start,started=performance.now();
 if(!(duration>0)||start<0||end>video.duration+.01)throw Error('VideoMAE 无效分段区间');
 for(let frame=0;frame<16;frame++){
   if(isCancelled?.())throw Error('用户取消');
   const sec=Math.min(start+duration*(frame+.5)/16,Math.max(0,video.duration-.02));
   if(Math.abs(video.currentTime-sec)>.009||video.readyState<2){
     await new Promise((resolve,reject)=>{
       const timer=setTimeout(()=>reject(Error('视频采样解码超时')),14000);
       const done=()=>{clearTimeout(timer);resolve()};
       video.addEventListener('seeked',done,{once:true});video.currentTime=sec;
     });
   }
   if(actorTrack){
     const personBox=actorBoxAt(actorTrack,sec);
     if(!personBox)throw Error('VideoMAE 分段 '+start.toFixed(1)+'–'+end.toFixed(1)+' 秒人物跟踪缺失');
     drawActorCrop(ctx,video,personBox,size);
   }else{
     const w=video.videoWidth,h=video.videoHeight,side=Math.min(w,h);
     ctx.drawImage(video,(w-side)/2,(h-side)/2,side,side,0,0,size,size);
   }
   const rgba=ctx.getImageData(0,0,size,size).data;
   const base=frame*size*size*3;
   for(let p=0;p<size*size;p++){
     frames[base+p*3]=rgba[p*4]/255;
     frames[base+p*3+1]=rgba[p*4+1]/255;
     frames[base+p*3+2]=rgba[p*4+2]/255;
   }
 }
 return {frames:[frames],times:[0],decodeMs:Math.round(performance.now()-started),duration};
}
export async function inferVideoMAE({api,model,frames}){
 if(frames.length!==1||frames[0].length!==16*224*224*3)throw Error('VideoMAE expects exactly 16 RGB frames');
 const input=new api.Tensor(frames[0],[1,16,224,224,3]);
 let output;
 try{
   output=await model.run([input]);
   const vectors=Array.from(output);
   if(vectors.length!==1)throw Error('Expected 400-class VideoMAE logits');
   const scores=Float32Array.from(await vectors[0].data());
   if(scores.length!==400||!scores.every(Number.isFinite))throw Error('VideoMAE did not return valid 400-class logits');
   return scores;
 }finally{
   input.delete?.();
   if(output){if(typeof output.delete==='function')output.delete();else for(const t of output)t.delete?.()}
 }
}

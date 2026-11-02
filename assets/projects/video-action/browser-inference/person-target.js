/**
 * V1.0.12 Actor-grounded video inputs. A person detector selects an actor
 * and the SAME tracked actor crop is used as every model's actual input.
 * Never silently fall back to scene-level classification.
 */
import {choosePrimaryPerson} from './person-overlay.js';
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
export function clampPersonBox(b,w,h){
 if(!b||w<=0||h<=0)return null;
 const x=clamp(Number(b.originX),0,w),y=clamp(Number(b.originY),0,h);
 const right=clamp(Number(b.originX)+Number(b.width),0,w);
 const bottom=clamp(Number(b.originY)+Number(b.height),0,h);
 if(![x,y,right,bottom].every(Number.isFinite)||right-x<4||bottom-y<4)return null;
 return {originX:x,originY:y,width:right-x,height:bottom-y};
}
export function boxIoU(a,b){
 if(!a||!b)return 0;
 const x=Math.max(a.originX,b.originX),y=Math.max(a.originY,b.originY);
 const right=Math.min(a.originX+a.width,b.originX+b.width);
 const bottom=Math.min(a.originY+a.height,b.originY+b.height);
 const intersection=Math.max(0,right-x)*Math.max(0,bottom-y);
 return intersection/(a.width*a.height+b.width*b.height-intersection||1);
}
export function chooseTrackedPerson(detections,w,h,lastBox){
 if(!lastBox){
   const x=choosePrimaryPerson(detections,w,h);
   return clampPersonBox(x.person?.boundingBox,w,h);
 }
 const options=(detections||[]).filter(d=>d.categories?.[0]?.categoryName==='person')
   .map(d=>clampPersonBox(d.boundingBox,w,h)).filter(Boolean);
 const matched=options.map(b=>{
   const overlap=boxIoU(lastBox,b);
   const ax=lastBox.originX+lastBox.width/2,ay=lastBox.originY+lastBox.height/2;
   const bx=b.originX+b.width/2,by=b.originY+b.height/2;
   const distance=Math.hypot(ax-bx,ay-by)/Math.hypot(w,h);
   const areaRatio=Math.min(lastBox.width*lastBox.height,b.width*b.height)/
      Math.max(lastBox.width*lastBox.height,b.width*b.height);
   return {b,overlap,distance,areaRatio,score:overlap+areaRatio*.2-distance*.25};
 }).filter(x=>(x.overlap>=.12||x.distance<=.14)&&x.areaRatio>=.33)
   .sort((a,b)=>b.score-a.score);
 return matched[0]?.b||null;
}
export function actorBoxAt(track,time,{maxAge=1.05}={}){
 if(!track?.length)return null;
 let latest=null;
 for(const item of track){if(item.t>time+.001)break;latest=item}
 if(!latest||time-latest.t>maxAge)return null;
 return latest.box||null;
}
export function drawActorCrop(ctx,video,box,size,{margin=.12}={}){
 if(!box)throw Error('当前采样时刻没有已跟踪的人物框，禁止整幅画面替代');
 const w=video.videoWidth,h=video.videoHeight;
 const b=clampPersonBox(box,w,h);
 if(!b)throw Error('人物框范围无效');
 const extraX=b.width*margin,extraY=b.height*margin;
 const x=clamp(b.originX-extraX,0,w),y=clamp(b.originY-extraY,0,h);
 const right=clamp(b.originX+b.width+extraX,0,w),bottom=clamp(b.originY+b.height+extraY,0,h);
 const sw=right-x,sh=bottom-y;
 const scale=Math.min(size/sw,size/sh);
 const dw=sw*scale,dh=sh*scale;
 ctx.clearRect(0,0,size,size);
 ctx.fillStyle='#101923';ctx.fillRect(0,0,size,size);
 ctx.drawImage(video,x,y,sw,sh,(size-dw)/2,(size-dh)/2,dw,dh);
}
export async function scanPrimaryActor(video,{detector,seek,isCancelled,onProgress,interval=.5}){
 if(!detector||!Number.isFinite(video.duration)||video.duration<=0)throw Error('无法启动真实人物检测');
 const duration=video.duration,track=[];
 const initial=video.currentTime,playing=!video.paused;
 const times=Array.from({length:Math.ceil(duration/interval)},(_,i)=>Math.min(i*interval,duration-.001));
 let reference=null,visible=0;
 video.pause();
 try{
  for(let i=0;i<times.length;i++){
   if(isCancelled?.())throw Error('用户取消');
   const t=times[i];
   await seek(video,t,isCancelled);
   const result=detector.detect(video);
   const box=chooseTrackedPerson(result?.detections,video.videoWidth,video.videoHeight,reference);
   if(box){reference=box;visible++}
   track.push({t:Number(t.toFixed(3)),box});
   if(i===0||i===times.length-1||(i+1)%4===0)
     onProgress?.({scanned:i+1,total:times.length,tracked:visible});
   if((i+1)%4===0)await new Promise(resolve=>setTimeout(resolve,0));
  }
  if(!visible)throw Error('整个视频未检测到可信主要人物；未执行整幅画面动作分类');
  return {track,detected:visible,total:times.length,interval,duration};
 }finally{
  try{await seek(video,Math.min(initial,Math.max(0,duration-.001)),()=>false);
   if(playing)video.play().catch(()=>{});
  }catch{}
 }
}

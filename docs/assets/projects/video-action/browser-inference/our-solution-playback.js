import {createPersonDetector} from './person-overlay.js';
import {chooseTrackedPerson} from './person-target.js';
import {seekVideo} from './continuous-movinet.js';
import {ACTION_LABELS} from './our-solution-rules.js';

// Only label an action supported at the current playback time.
export function ourPlaybackLabel(point,time){
 if(!point||point.missing||!ACTION_LABELS[point.label])return null;
 if(Number.isFinite(time)&&(time<point.t||time>=point.windowEnd))return null;
 return {title:ACTION_LABELS[point.label]};
}

let detectorPromise=null;
export function interpolateShortTrackGaps(track){
 const result=track.map(p=>({...p}));
 for(let i=1;i<result.length-1;i++){
  if(result[i].box)continue;
  let left=i-1,right=i+1;
  while(left>=0&&!track[left].box)left--;
  while(right<track.length&&!track[right].box)right++;
  if(left<0||right>=track.length||track[right].t-track[left].t>1.05)continue;
  const a=track[left],b=track[right],f=(track[i].t-a.t)/(b.t-a.t);
  result[i]={...track[i],source:'interpolated',box:Object.fromEntries(['originX','originY','width','height'].map(k=>[k,a.box[k]+f*(b.box[k]-a.box[k])]))};
 }
 return result;
}
export async function scanOurPlaybackActor(video,{signal,onProgress=()=>{},anchorTrack=[]}={}){
 if(!detectorPromise)detectorPromise=createPersonDetector({scoreThreshold:.1}).catch(e=>{detectorPromise=null;throw e});
 const detector=await detectorPromise,track=[];
 const width=video.videoWidth,height=video.videoHeight;
 const canvas=document.createElement('canvas');let last=null,lastSeen=-Infinity;
 for(let t=0;t<video.duration-.025;t+=.5){
  if(signal?.aborted)throw Error('用户取消');
  onProgress('人物跟踪：'+t.toFixed(1)+'/'+video.duration.toFixed(1)+'秒',{current:t,total:video.duration});
  const anchor=anchorTrack.find(p=>Math.abs(p.t-t)<.01&&p.box);
  if(anchor){track.push({...anchor,source:'object_detection'});last=anchor.box;lastSeen=t;continue}
  await seekVideo(video,t,()=>signal?.aborted);
  let detections=detector.detect(video).detections||[];
  let box=chooseTrackedPerson(detections,width,height,last),source='full_frame';
  if(!box&&last&&t-lastSeen<=2){
   // Detect again on a larger view of the last observed neighbourhood. No held/fake box.
   const rw=Math.min(width,Math.max(last.width*4,width*.15));
   const rh=Math.min(height,Math.max(last.height*3,height*.25));
   const x=Math.max(0,Math.min(width-rw,last.originX+last.width/2-rw/2));
   const y=Math.max(0,Math.min(height-rh,last.originY+last.height/2-rh/2));
   const scale=640/Math.max(rw,rh);canvas.width=Math.round(rw*scale);canvas.height=Math.round(rh*scale);
   canvas.getContext('2d').drawImage(video,x,y,rw,rh,0,0,canvas.width,canvas.height);
   const sx=canvas.width/rw,sy=canvas.height/rh;
   detections=(detector.detect(canvas).detections||[]).map(d=>({...d,boundingBox:{
    originX:x+d.boundingBox.originX/sx,originY:y+d.boundingBox.originY/sy,
    width:d.boundingBox.width/sx,height:d.boundingBox.height/sy}}));
   box=chooseTrackedPerson(detections,width,height,last);source='zoom_detection';
  }
  track.push({t,box,source:box?source:'missing'});
  if(box){last=box;lastSeen=t}else if(t-lastSeen>2){last=null}
  await new Promise(r=>setTimeout(r,0));
 }
 return interpolateShortTrackGaps(track);
}

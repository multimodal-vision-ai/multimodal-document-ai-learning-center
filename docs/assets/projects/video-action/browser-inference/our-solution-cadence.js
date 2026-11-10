// Prototype defaults, in video seconds. These are scheduling heuristics, not measured action durations.
export const RECHECK_SECONDS={
 'Using Phone':3,'Sleeping Posture':3,'Yoga':3,'Eating':2,'Smoking':1.5,
 'Jogging':2,'Push Up':1.5,'Situp':1.5,'Dancing Ballet':1.5,'Hula Hooping':1.5,
 'Waving Hand':.5,'Falling Down':.5
};
export const recheckSeconds=action=>RECHECK_SECONDS[action]||.5;

// Held intervals are separate records; they are never detector observations or confidence scores.
export function heldPoint(action,start,end,observedAt){
 return {t:start,windowEnd:end,label:action,score:null,rule:false,assumed:true,observedAt};
}

export function createSceneProbe(video,seek,signal,stats){
 const canvas=document.createElement('canvas');canvas.width=32;canvas.height=18;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 const read=()=>{ctx.drawImage(video,0,0,32,18);return ctx.getImageData(0,0,32,18).data};
 return async(from,to)=>{
  if(to-from<=.5)return to;
  const reference=read();
  for(let t=from+.5;t<to-.01;t+=.5){
   await seek(video,t,()=>signal?.aborted);const frame=read();stats.sceneProbes++;
   let diff=0;for(let i=0;i<frame.length;i+=4)diff+=Math.abs(frame[i]-reference[i])+Math.abs(frame[i+1]-reference[i+1])+Math.abs(frame[i+2]-reference[i+2]);
   if(diff/(32*18*3*255)>.18){stats.sceneInterruptions++;return t}
  }
  return to;
 };
}

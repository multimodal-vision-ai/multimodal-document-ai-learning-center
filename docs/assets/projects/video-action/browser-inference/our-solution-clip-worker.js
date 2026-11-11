// The temporal model has its own worker: it must never block person/hand updates.
import {loadOurSolution,writeClipFrame} from './our-solution.js';
import {CLASS_MAP,softmax} from './our-solution-rules.js';
let entry;
self.onmessage=async({data:m})=>{
 try{
  if(m.type==='init'){
   entry=await loadOurSolution({onProgress:message=>self.postMessage({type:'progress',message})});
   self.postMessage({type:'ready'});return;
  }
  if(m.type!=='clip')return;
  const began=performance.now(),input=new Float32Array(3*13*182*182);
  m.frames.forEach((rgba,i)=>writeClipFrame(input,rgba,i));
  const result=await entry.session.run({video:new entry.ort.Tensor('float32',input,[1,3,13,182,182])});
  const logits=result.logits.data;if(logits.length!==400||!logits.every(Number.isFinite))throw Error('无效动作模型输出');
  const scores=softmax(logits);let id=0;for(let i=1;i<scores.length;i++)if(scores[i]>scores[id])id=i;
  self.postMessage({type:'clip',generation:m.generation,t:m.t,action:scores[id]>=.25?CLASS_MAP[entry.labels[id]]||null:null,
   rawLabel:entry.labels[id],score:scores[id],inferenceMs:performance.now()-began});
 }catch(e){self.postMessage({type:'error',message:e.message,generation:m.generation})}
};

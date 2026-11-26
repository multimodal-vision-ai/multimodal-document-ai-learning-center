// E04 V1.0 DEV: raw YOLO26 predictions; no embedded NMS.
export const ROAD = new Set([0,1,2,3,5,7,9,11]);
export function iou(a,b) {
 const inter=Math.max(0,Math.min(a[2],b[2])-Math.max(a[0],b[0]))*Math.max(0,Math.min(a[3],b[3])-Math.max(a[1],b[1]));
 const area=q=>Math.max(0,q[2]-q[0])*Math.max(0,q[3]-q[1]);
 const union=area(a)+area(b)-inter; return union>0?inter/union:0;
}
export function suppress(candidates,{conf=.25,threshold=.5,nms=true,limit=300}={}) {
 const sorted=candidates.filter(b=>b.score>=conf).sort((a,b)=>b.score-a.score||a.index-b.index);
 if(!nms)return {before:sorted,after:sorted};
 const kept=[],removed=[];
 for(const b of sorted) {
  const match=kept.find(k=>k.cls===b.cls&&iou(k.box,b.box)>threshold);
  if(match){removed.push({box:b,by:match.index});continue;}
  kept.push(b); if(kept.length===limit)break;
 }
 return {before:sorted,after:kept,removed};
}
export function decodeRaw(tensor) {
 const d=tensor.dims, v=tensor.data;
 if(d.length!==3||d[0]!==1||d[1]!==84)throw Error('Expected raw COCO output [1,84,N], got '+d.join('×')+'. Do not use an end-to-end or NMS-embedded model.');
 const n=d[2], boxes=[];
 for(let i=0;i<n;i++){
  let cls=0,score=-Infinity;
  for(let c=0;c<80;c++){const s=v[(c+4)*n+i];if(s>score){score=s;cls=c;}}
  if(!Number.isFinite(score)||score<.05)continue;
  const x=v[i],y=v[n+i],w=v[2*n+i],h=v[3*n+i];
  if(![x,y,w,h].every(Number.isFinite)||w<=0||h<=0)continue;
  boxes.push({index:i,cls,score,box:[x-w/2,y-h/2,x+w/2,y+h/2]});
 }
 return boxes;
}
export function preprocess(image,size,ort) {
 const w=image.videoWidth||image.naturalWidth||image.width,h=image.videoHeight||image.naturalHeight||image.height;
 if(!w||!h)throw Error('Image or video frame not ready');
 const ratio=Math.min(size/w,size/h),nw=Math.round(w*ratio),nh=Math.round(h*ratio);
 const dx=Math.floor((size-nw)/2),dy=Math.floor((size-nh)/2);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.fillStyle='rgb(114,114,114)';ctx.fillRect(0,0,size,size);ctx.drawImage(image,dx,dy,nw,nh);
 const p=ctx.getImageData(0,0,size,size).data,n=size*size,f=new Float32Array(3*n);
 for(let i=0;i<n;i++){f[i]=p[4*i]/255;f[n+i]=p[4*i+1]/255;f[2*n+i]=p[4*i+2]/255;}
 return {tensor:new ort.Tensor('float32',f,[1,3,size,size]),ratio,dx,dy,w,h};
}
export function restore(box,meta) {
 const {ratio,dx,dy,w,h}=meta;
 return [Math.max(0,Math.min(w,(box[0]-dx)/ratio)),Math.max(0,Math.min(h,(box[1]-dy)/ratio)),Math.max(0,Math.min(w,(box[2]-dx)/ratio)),Math.max(0,Math.min(h,(box[3]-dy)/ratio))];
}
export async function createDetector(ort,modelUrl,backend='wasm') {
 ort.env.wasm.numThreads=1;
 const session=await ort.InferenceSession.create(modelUrl,{executionProviders:[backend]});
 return {backend,async run(image,size){
  const t0=performance.now(), meta=preprocess(image,size,ort), t1=performance.now();
  const results=await session.run({[session.inputNames[0]]:meta.tensor});
  const t2=performance.now(), candidates=decodeRaw(results[session.outputNames[0]]);
  return {candidates,meta,preprocessMs:t1-t0,forwardMs:t2-t1,shape:results[session.outputNames[0]].dims};
 },async release(){await session.release();}};
}

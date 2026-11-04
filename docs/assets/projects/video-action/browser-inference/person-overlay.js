// MediaPipe EfficientDet-Lite0 (COCO person) + MoViNet scene-level classification.
// V1.0.4 experimental visualization: NOT an actor-specific action detector.
// Stable deps; image-mode detects when playback seeks backwards.
export const PERSON_LIB='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/vision_bundle.mjs';
export const PERSON_WASM='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/wasm';
export const PERSON_MODEL='https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/int8/1/efficientdet_lite0.tflite';

export function choosePrimaryPerson(detections,sourceWidth,sourceHeight){
  const valid=(detections||[]).filter(x=>{
    const b=x.boundingBox,c=x.categories?.[0];
    return b&&c?.categoryName==='person'&&Number.isFinite(c.score)&&
      Number.isFinite(b.originX)&&Number.isFinite(b.originY)&&
      Number.isFinite(b.width)&&Number.isFinite(b.height)&&
      b.width>0&&b.height>0;
  });
  if(!valid.length)return {person:null,candidateCount:0};
  const sw=Math.max(1,sourceWidth),sh=Math.max(1,sourceHeight);
  const ranked=valid.map(d=>{
    const b=d.boundingBox;
    const area=b.width*b.height/(sw*sh);
    const cx=(b.originX+b.width/2)/sw,cy=(b.originY+b.height/2)/sh;
    const centrality=Math.max(0,1-Math.hypot(cx-.5,cy-.5));
    return {d,score:area*(.8+.2*centrality)};
  }).sort((a,b)=>b.score-a.score);
  return {person:ranked[0].d,candidateCount:valid.length};
}
export function mapBoxToContainedVideo(b,sourceWidth,sourceHeight,viewWidth,viewHeight){
  if(!b||![sourceWidth,sourceHeight,viewWidth,viewHeight].every(n=>Number.isFinite(n)&&n>0))return null;
  const scale=Math.min(viewWidth/sourceWidth,viewHeight/sourceHeight);
  const offsetX=(viewWidth-sourceWidth*scale)/2,offsetY=(viewHeight-sourceHeight*scale)/2;
  const left=Math.max(0,offsetX+b.originX*scale),top=Math.max(0,offsetY+b.originY*scale);
  const right=Math.min(viewWidth,offsetX+(b.originX+b.width)*scale);
  const bottom=Math.min(viewHeight,offsetY+(b.originY+b.height)*scale);
  if(right<=left||bottom<=top)return null;
  return {x:left,y:top,w:right-left,h:bottom-top};
}
export function top1At(timeline,time,limit){
  if(!timeline?.length||!Number.isFinite(time)||time>limit+.005)return null;
  let item=timeline[0];
  for(const point of timeline){if(point.t<=time+.001)item=point;else break}
  return item;
}
export async function createPersonDetector(){
  const {FilesetResolver,ObjectDetector}=await import(PERSON_LIB);
  const fileset=await FilesetResolver.forVisionTasks(PERSON_WASM);
  return ObjectDetector.createFromOptions(fileset,{
    baseOptions:{modelAssetPath:PERSON_MODEL,delegate:'CPU'},
    runningMode:'IMAGE',categoryAllowlist:['person'],scoreThreshold:.22,maxResults:6
  });
}

const visible = point => point && (point.visibility ?? 1) >= .3;
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const midpoint = (a,b) => ({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
const boxDistance = (point,box) => Math.hypot(
 Math.max(box.x-point.x,0,point.x-box.x-box.width),
 Math.max(box.y-point.y,0,point.y-box.y-box.height)
);
const weakWidePhone = box => box.score<.2&&(box.roiKind==='person'||box.roiKind==='broad');
const SURVEILLANCE_ACTIONS=new Set(['Sleeping Posture','Falling Down','Using Phone']);
export const isSurveillanceAction = action => SURVEILLANCE_ACTIONS.has(action);

export function mergeSurveillanceTimeline(original,enhanced,armSupport=[]) {
 if(!enhanced.length&&!armSupport.length)return original;
 const times=[...new Set([...original,...enhanced,...armSupport].flatMap(p=>[p.t,p.windowEnd]))].sort((a,b)=>a-b);
 const result=[];
 let baseIndex=-1,enhancedIndex=-1,supportIndex=-1;
 for(let i=0;i<times.length-1;i++){
  const t=times[i],windowEnd=times[i+1];
  while(original[baseIndex+1]?.t<=t)baseIndex++;
  while(enhanced[enhancedIndex+1]?.t<=t)enhancedIndex++;
  while(armSupport[supportIndex+1]?.t<=t)supportIndex++;
  const base=original[baseIndex],addition=enhanced[enhancedIndex];
  const supported=armSupport[supportIndex]?.windowEnd>t;
  const baseActive=base?.windowEnd>t&&!(supported&&['Waving Hand','Sleeping Posture'].includes(base.label));
  const additionActive=addition?.windowEnd>t;
  const replacesWave=additionActive&&addition.label==='Sleeping Posture'&&base?.label==='Waving Hand';
  const replacesExerciseConflict=additionActive&&addition.label==='Push Up'&&base?.label!=='Push Up';
  const preserveBase=baseActive&&!replacesWave&&!replacesExerciseConflict&&base.label!=='未识别'&&
   (!isSurveillanceAction(base.label)||base.label===addition?.label);
  const point=preserveBase?base:additionActive?addition:baseActive?base:{label:'未识别',score:null,rule:false};
  result.push({...point,t,windowEnd});
 }
 return result;
}

export function surveillanceObservation(t,pose,hands,phones,personBox,edgeHeight=null) {
 const pair = (a,b) => visible(pose[a])&&visible(pose[b])?midpoint(pose[a],pose[b]):null;
 const shoulder=pair(11,12),hip=pair(23,24),ankle=pair(27,28),ear=pair(7,8);
 const head=visible(pose[0])?pose[0]:null;
 const scale=shoulder&&hip?distance(shoulder,hip):0;
 const axis=scale>=10?(hip.y-shoulder.y)/scale:null;
 const leg=ankle&&hip?distance(ankle,hip):0;
 const edgeProne=!!edgeHeight&&axis<-.8&&shoulder.y>edgeHeight*.92&&leg>.55*scale&&
  ankle.y<hip.y-.45*scale;
 const sideView=axis!==null&&axis>.30&&axis<.82&&leg>.95*scale&&distance(shoulder,ankle)>scale+.88*leg;
 const supportingArm=(sideView||edgeProne)&&[0,1].map(side=>{
   const upper=pose[11+side],elbow=pose[13+side],wrist=pose[15+side];
   if(!visible(upper)||!visible(elbow)||!wrist||wrist.visibility<.55||
    (edgeProne?Math.abs(wrist.y-upper.y)>.5*scale:wrist.y<upper.y+.18*scale)||
    distance(wrist,ankle)<(edgeProne?1.45:1.65)*scale)return null;
   const length=distance(upper,elbow)*distance(wrist,elbow);
   if(length<1)return null;
   const cosine=((upper.x-elbow.x)*(wrist.x-elbow.x)+(upper.y-elbow.y)*(wrist.y-elbow.y))/length;
   const angle=Math.acos(Math.max(-1,Math.min(1,cosine)));
   return !edgeProne||angle>1.2?{wrist,angle,side,edge:edgeProne}:null;
  }).find(Boolean);
 const wrists=[pose[15],pose[16]].filter(visible);
 // Wide crops include desk objects. Require stronger evidence there than in
 // the crops centered on a visible hand or the side of the face.
 const phone=!supportingArm&&(axis===null||axis>.55)?phones.filter(box=>
  box.score>=.15&&supportsPhoneBox(box,shoulder,scale,hands,wrists,personBox)
 )
  .sort((a,b)=>b.score-a.score)[0]??null:null;
 const phoneRaised=!!phone&&!!shoulder&&phone.y+phone.height/2<=shoulder.y+.3*scale;
 const phoneNearFace=phoneRaised&&[head,pose[7],pose[8]].filter(visible).some(point=>
  boxDistance(point,phone)<=.62*scale);
 const reclined=!!(axis!==null&&head&&ear&&axis>.45&&axis<.91&&(
  head.y<ear.y-.04*scale||
  axis<.85&&head.y<ear.y-.012*scale&&head.y<shoulder.y-.26*scale&&
  (head.x-shoulder.x)*(shoulder.x-hip.x)>0&&Math.abs(head.x-shoulder.x)>.18*scale&&
  wrists.length&&wrists.every(wrist=>distance(head,wrist)>.55*scale)
 ));
 const restsOnForearm=head&&[[13,15],[14,16]].some(([elbowIndex,wristIndex])=>{
  const elbow=pose[elbowIndex],wrist=pose[wristIndex];
  return visible(elbow)&&visible(wrist)&&Math.min(distance(head,elbow),distance(head,wrist))<.38*scale&&
   Math.abs(elbow.y-wrist.y)<.36*scale;
 });
 const deskSleep=!!(axis!==null&&axis>.45&&axis<.93&&head&&head.y>shoulder.y+.07*scale&&restsOnForearm);
 const sleepPose=reclined?'reclined':deskSleep?'desk':null;
 return {t,shoulder,hip,ankle,head,scale,axis,reclined,sleepPose,phone,phoneRaised,phoneNearFace,supportingArm,edgeProne};
}

export function supportsPhoneBox(box,shoulder,scale,hands,wrists,personBox){
 const reach=Math.max(5,.19*scale,.045*(personBox?.width??0));
 if(hands.some(hand=>hand.some(point=>boxDistance(point,box)<=reach)))return true;
 if(!shoulder||box.y+box.height/2>shoulder.y+.30*scale)return false;
 return wrists.some(wrist=>(wrist.visibility??1)>=.5&&boxDistance(wrist,box)<=Math.max(6,.26*scale));
}

export function supportedPushUp(current,previous){
 const {supportingArm:arm,ankle,t,scale}=current;
 if(!arm)return false;
 return previous.some(row=>row.supportingArm&&row.supportingArm.edge===arm.edge&&t-row.t<=3.5&&
  (!arm.edge||row.supportingArm.side===arm.side)&&distance(ankle,row.ankle)<.35*scale&&
  distance(arm.wrist,row.supportingArm.wrist)<(arm.edge ? .55 : .35)*scale&&
  Math.abs(arm.angle-row.supportingArm.angle)>(arm.edge ? .4 : .6));
}

export function surveillanceDecision(current,previous) {
 const {t,head,hip,shoulder,scale,axis,ankle,phone}=current;
 const recent=previous.filter(row=>t-row.t<=3.6);
 const nearby=previous.filter(row=>row.head&&row.hip&&row.scale>=10&&
  head&&hip&&Math.abs(row.hip.x-hip.x)<=1.35*Math.max(row.scale,scale));
 const earlierUpright=nearby.filter(row=>row.axis>=.7&&t-row.t>=.4&&t-row.t<=7);
 const settled=nearby.filter(row=>t-row.t<=3.2&&distance(head,row.head)<.32*scale&&distance(hip,row.hip)<.3*scale);
 const settledFor=settled.length?t-settled[0].t:0;
 const descended=row=>head.y-row.head.y>=1.0*row.scale&&hip.y-row.hip.y>=.6*row.scale;
 const lying=axis!==null&&axis<.48;
 const inverted=axis!==null&&axis<-.45&&nearby.some(row=>row.axis!==null&&row.axis>-.2&&
  head.y-row.head.y>1.2*row.scale&&t-row.t>=.7);
 // An overhead view can hide the transition into the floor posture.
 // Confirm pronounced head-below-hips geometry in repeated stable frames.
 const floorPose=row=>row.axis!==null&&row.axis<-.75&&!!row.ankle&&
  row.ankle.y<row.hip.y-.3*row.scale&&row.head.y>row.hip.y+row.scale;
 const floorFrames=floorPose(current)?settled.filter(floorPose):[];
 const settledInverted=floorFrames.length>=2&&t-floorFrames[0].t>=1;
 const lowAndBent=axis!==null&&axis>.55&&head&&ankle&&
  head.y>shoulder.y-.12*scale&&ankle.y-hip.y<1.35*scale&&Math.abs(ankle.x-hip.x)>.52*scale;
 if(current.supportingArm||current.edgeProne)return supportedPushUp(current,previous)?'Push Up':null;
 if(head&&hip&&(
  lying&&settled.length>=2&&settledFor>=1&&(settledInverted||inverted||earlierUpright.some(descended))||
  lowAndBent&&settled.length>=2&&settledFor>=1.3&&!recent.some(row=>row.reclined)&&
  earlierUpright.some(row=>row.axis>=.88&&descended(row)&&
   row.ankle&&row.ankle.y-row.hip.y>1.05*row.scale)
 ))return 'Falling Down';
 if(lying)return null;
 if(phone&&recent.some(row=>{
  if(!row.phone||t-row.t>2.8)return false;
  // Two weak hits in wide crops cannot confirm that the person holds the phone.
  if(weakWidePhone(phone)&&weakWidePhone(row.phone))return false;
  const center={x:phone.x+phone.width/2,y:phone.y+phone.height/2};
  const previousCenter={x:row.phone.x+row.phone.width/2,y:row.phone.y+row.phone.height/2};
  const shift=distance(center,previousCenter),limit=Math.max(22,.65*scale);
  if(shift>limit){
   // A raised phone can move with the person's torso between observations.
   if(!current.phoneNearFace||!row.phoneNearFace||!shoulder||!row.shoulder||scale<10||row.scale<10)return false;
   const ratio=scale/row.scale;
   if(ratio<.65||ratio>1.5||distance(center,{
    x:shoulder.x+(previousCenter.x-row.shoulder.x)*ratio,
    y:shoulder.y+(previousCenter.y-row.shoulder.y)*ratio,
   })>limit)return false;
  }
  if(!current.phoneNearFace&&!row.phoneNearFace&&Math.min(phone.score,row.phone.score)<.2&&
   shift>Math.max(11,.35*scale))return false;
  if(phone.roiKind!==row.phone.roiKind&&[phone,row.phone].some(box=>box.roiKind==='person'&&box.score<.2)&&
   !current.phoneNearFace&&!row.phoneNearFace)return false;
  if(phone.roiKind!=='person'&&row.phone.roiKind!=='person')return true;
  if(current.phoneRaised&&row.phoneRaised)return true;
  // A person crop also includes the desk. A lower phone needs movement
  // between observations when a hand crop couldn't identify it independently.
  return shift>Math.max(8,.25*scale);
 }))return 'Using Phone';
 const sleepPose=current.sleepPose??(current.reclined?'reclined':null);
 if(sleepPose&&!phone&&!recent.some(row=>row.phone&&(t-row.t<=.8||row.sleepPose===sleepPose))){
  const samePose=settled.filter(row=>(row.sleepPose??(row.reclined?'reclined':null))===sleepPose);
  const minimum=sleepPose==='desk'?2:1.7;
  if(samePose.length>=2&&t-samePose[0].t>=minimum)return 'Sleeping Posture';
 }
 return null;
}

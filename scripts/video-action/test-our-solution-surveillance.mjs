import assert from 'node:assert/strict';
import {
 mergeSurveillanceTimeline,surveillanceDecision,surveillanceObservation,supportedPushUp,
} from '../../docs/assets/projects/video-action/browser-inference/our-solution-surveillance.js';
import {resolveLivePoint} from '../../docs/assets/projects/video-action/browser-inference/our-solution-realtime.js';
import {createSurveillancePersonGate} from '../../docs/assets/projects/video-action/browser-inference/person-target.js';

const phone={x:84,y:92,width:12,height:8,score:.7};
const wrist={x:87,y:96,visibility:.8};
const pose=[];pose[11]={x:85,y:90};pose[12]={x:110,y:90};
pose[0]={x:90,y:80};
pose[23]={x:85,y:127};pose[24]={x:110,y:127};pose[15]=wrist;
const observed=t=>surveillanceObservation(t,pose,[],[phone],null);
assert.equal(surveillanceDecision(observed(1),[]),null);
assert.equal(surveillanceDecision(observed(1),[observed(0)]),'Using Phone');
const movingPose=pose.map(point=>({...point,x:point.x+45}));
const movingPhone=surveillanceObservation(1,movingPose,[],[{...phone,x:phone.x+45}],null);
assert.equal(surveillanceDecision(movingPhone,[observed(0)]),'Using Phone');
movingPose[15]={...wrist,x:wrist.x+85};
const differentPhone=surveillanceObservation(1,movingPose,[],[{...phone,x:phone.x+85}],null);
assert.equal(surveillanceDecision(differentPhone,[observed(0)]),null);
const deskPhone=surveillanceObservation(1,[],[],[phone],null);
assert.equal(surveillanceDecision(deskPhone,[observed(0)]),null);
const deskPose=pose.slice();deskPose[11]={x:85,y:76};deskPose[12]={x:110,y:76};
const personCrop=t=>surveillanceObservation(t,deskPose,[[wrist]],[{...phone,roiKind:'person'}],null);
assert.equal(surveillanceDecision(personCrop(1),[personCrop(0)]),null);
const weakPersonCrop=surveillanceObservation(1,pose,[],[{...phone,roiKind:'person',score:.17,y:140}],null);
assert.equal(weakPersonCrop.phone,null);
const weakWide={...personCrop(1),phone:{...phone,roiKind:'person',score:.16},phoneNearFace:false};
const distinctCrop={...personCrop(0),phone:{...phone,roiKind:'broad',score:.25},phoneNearFace:false};
assert.equal(surveillanceDecision(weakWide,[distinctCrop]),null);
const weakRaised=(t,roiKind='person')=>({...observed(t),phone:{...phone,roiKind,score:.16},phoneRaised:true,phoneNearFace:true});
assert.equal(surveillanceDecision(weakRaised(1),[weakRaised(0)]),null);
assert.equal(surveillanceDecision(weakRaised(1,'broad'),[weakRaised(0,'broad')]),null);
assert.equal(surveillanceDecision(weakRaised(1,'broad'),[{...weakRaised(0,'broad'),phone:{...phone,roiKind:'broad',score:.23}}]),'Using Phone');
assert.equal(surveillanceDecision(weakRaised(1),[{...weakRaised(0),phone:{...phone,roiKind:'ear',score:.25}}]),'Using Phone');
const lowered=pose.slice();lowered[15]={...wrist,y:128};
const falsePhoneAtSide=surveillanceObservation(1,lowered,[],[{...phone,y:124,score:.6}],null);
assert.equal(falsePhoneAtSide.phone,null);
const pickedUp=surveillanceObservation(1,deskPose,[[{...wrist,x:83}]],[{...phone,roiKind:'person',x:69}],null);
assert.equal(surveillanceDecision(pickedUp,[personCrop(0)]),'Using Phone');

const body=(t,headY,shoulderY,hipY,ankleY,axis,reclined=false)=>({
 t,head:{x:100,y:headY},shoulder:{x:100,y:shoulderY},hip:{x:100,y:hipY},
 ankle:{x:100,y:ankleY},scale:40,axis,reclined,phone:null,
});
const standing=body(0,70,86,125,195,.98);
const onFloor=t=>body(t,171,155,155,192,0);
assert.equal(surveillanceDecision(onFloor(3),[standing]),null);
assert.equal(surveillanceDecision(onFloor(3),[standing,onFloor(2)]),null);
assert.equal(surveillanceDecision(onFloor(3),[standing,onFloor(2),onFloor(2.5)]),'Falling Down');
const chair=t=>body(t,105,115,146,194,.78,true);
assert.equal(surveillanceDecision(chair(4),[chair(2),chair(3)]),'Sleeping Posture');
assert.equal(surveillanceDecision(body(4,170,150,110,80,-1),[]),null);
const overheadFloor=t=>body(t,170,150,110,80,-1);
assert.equal(surveillanceDecision(overheadFloor(4),[overheadFloor(2.5),overheadFloor(3)]),'Falling Down');
const desk=t=>({...body(t,122,115,146,194,.78),sleepPose:'desk'});
assert.equal(surveillanceDecision(desk(3),[desk(1.5),desk(2)]),null);
assert.equal(surveillanceDecision(desk(3),[desk(1),desk(2)]),'Sleeping Posture');
assert.equal(surveillanceDecision({...desk(3),phone},[desk(1),desk(2)]),null);

const point=(t,windowEnd,label,score=null)=>({t,windowEnd,label,score,rule:score===null});
const original=[point(0,1,'Waving Hand',.8),point(1,2,'Using Phone',.4),point(4,5,'未识别')];
const enhanced=[point(.5,1.5,'Sleeping Posture'),point(2,2.5,'Falling Down')];
const merged=mergeSurveillanceTimeline(original,enhanced);
const label=t=>merged.find(p=>p.t<=t&&p.windowEnd>t)?.label;
assert.equal(label(.75),'Sleeping Posture');
assert.equal(label(1.25),'Sleeping Posture');
assert.equal(label(1.75),'Using Phone');
assert.equal(label(2.25),'Falling Down');
assert.equal(label(3),'未识别');
assert.equal(merged.find(p=>p.t===1).score,null);
assert.equal(mergeSurveillanceTimeline(original,[]),original);
const supported=mergeSurveillanceTimeline(original,[point(1.25,1.75,'Using Phone')]);
assert.equal(supported.find(p=>p.t===1.25).score,.4);
const jogging=[point(0,2,'Jogging',.8)];
assert.equal(mergeSurveillanceTimeline(jogging,enhanced)[1].label,'Jogging');
assert.equal(mergeSurveillanceTimeline(original,[],[{t:0,windowEnd:1}])[0].label,'未识别');
const planted=(t,angle)=>({t,ankle:{x:145,y:130},scale:40,supportingArm:{wrist:{x:85,y:100},angle}});
assert.equal(supportedPushUp(planted(3,1),[planted(2,1.1)]),false);
assert.equal(surveillanceDecision(planted(3,1),[planted(2,1.1)]),null);
assert.equal(surveillanceDecision(planted(3,1),[planted(2,2.3)]),'Push Up');
const edgePlanted=(t,angle,side=0)=>({
 ...planted(t,angle),edgeProne:true,
 supportingArm:{...planted(t,angle).supportingArm,edge:true,side},
});
assert.equal(surveillanceDecision(edgePlanted(3,1.3),[edgePlanted(2,2)]),'Push Up');
assert.equal(surveillanceDecision(edgePlanted(3,1.3),[edgePlanted(2,2,1)]),null);

const sleep={t:2,observedAt:2,action:'Sleeping Posture',enhancedAction:'Sleeping Posture'};
assert.equal(resolveLivePoint(sleep,[],-Infinity,5).label,'Sleeping Posture');
assert.equal(resolveLivePoint({...sleep,enhancedAction:null},[],-Infinity,5).label,'未识别');
assert.equal(resolveLivePoint(sleep,[{t:2,action:'Jogging',score:.8}],-Infinity,5).label,'Jogging');

// Reproduce the stationary background and a newly visible moving person.
globalThis.OffscreenCanvas=class {
 constructor(width,height){this.width=width;this.height=height}
 getContext(){return {
  drawImage:frame=>{this.frame=frame},
  getImageData:()=>({data:new Uint8ClampedArray(this.width*this.height*4).fill(this.frame.level)}),
 }}
};
const gate=createSurveillancePersonGate();
const box={originX:20,originY:10,width:32,height:30};
const frame=level=>({width:96,height:54,level});
assert.equal(gate(frame(0),box,{t:0}),false);
assert.equal(gate(frame(0),box,{t:.5,poseBox:box}),false);
assert.equal(gate(frame(80),box,{t:1}),false);
assert.equal(gate(frame(160),box,{t:1.5}),true);
assert.equal(gate(frame(160),box,{t:2,poseBox:box}),true);
console.log('PASS surveillance evidence, fallback intervals and original action priority');

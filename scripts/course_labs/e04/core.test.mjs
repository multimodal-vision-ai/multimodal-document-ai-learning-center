import {test} from 'node:test';
import assert from 'node:assert/strict';
import {iou,suppress,decodeRaw,restore} from '../../../docs/resources/course-labs/intelligent-perception/interactive/e04-core.mjs';
const A={index:0,cls:2,score:.92,box:[0,0,100,100]},B={index:1,cls:2,score:.81,box:[10,10,110,110]},C={index:2,cls:2,score:.86,box:[75,0,175,100]},D={index:3,cls:0,score:.7,box:[0,0,100,100]};
test('IoU geometry',()=>{assert.equal(iou(A.box,A.box),1);assert.equal(iou(A.box,[101,0,200,100]),0)});
test('class-aware NMS responds to threshold and confidence',()=>{assert.equal(suppress([A,B,C,D],{threshold:.5}).after.length,3);assert.equal(suppress([A,B,C],{threshold:.05}).after.length,1);assert.equal(suppress([A,B,C],{threshold:.95}).after.length,3);assert.equal(suppress([A,B,C],{conf:.9}).after.length,1);assert.equal(suppress([A,B,C],{nms:false}).after.length,3)});
test('raw decode and refuse processed layout',()=>{const data=new Float32Array(84);data[0]=50;data[1]=50;data[2]=20;data[3]=20;data[6]=.8;const out=decodeRaw({dims:[1,84,1],data});assert.equal(out.length,1);assert.equal(out[0].cls,2);assert.equal(out[0].box[0],40);assert.throws(()=>decodeRaw({dims:[1,300,6],data:new Float32Array(1800)}))});
test('letterbox coordinates',()=>assert.deepEqual(restore([10,20,50,60],{ratio:2,dx:10,dy:20,w:100,h:100}),[0,0,20,20]));

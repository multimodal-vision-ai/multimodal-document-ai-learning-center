import assert from 'node:assert/strict';
import {sampleCount,sampleTime,buildActionSegments} from '../../docs/assets/projects/video-action/browser-inference/continuous-movinet.js';
assert.equal(sampleCount(8),40);
assert.equal(sampleCount(10),50);
assert.equal(sampleCount(24),120);
assert.equal(sampleCount(60),300);
assert.equal(sampleTime(40,10),8);
assert.equal(sampleTime(49,10),9.8);
assert.equal(sampleTime(119,24),23.8);
assert.throws(()=>sampleCount(0),/有效/);
assert.throws(()=>sampleTime(120,24),/无效/);
const input=Array.from({length:50},(_,i)=>({
  frame:i+1,t:i/5,label:i<25?'waving hand':'eating',
  score:.7
}));
const segments=buildActionSegments(input,10);
assert.equal(segments.length,2);
assert.equal(segments[0].label,'waving hand');
assert.equal(segments[1].label,'eating');
assert.equal(segments[0].start,0);
assert.equal(segments[1].end,10);
assert.ok(Math.abs(segments[0].end-5)<.4);
assert.ok(Math.abs(segments[1].start-5)<.4);
assert.equal(segments.reduce((x,s)=>x+s.samples,0),50);
assert.equal(segments.at(-1).end,10);
console.log('PASS continuous 5 FPS frame schedule, true full duration and time-axis boundaries');

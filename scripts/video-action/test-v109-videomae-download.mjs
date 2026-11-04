import assert from 'node:assert/strict';
import {downloadVideoMAEWeights} from '../../docs/assets/projects/video-action/browser-inference/video-mae.js';

const fake=(body)=>async(_url,{signal}={})=>({
 ok:true,status:200,
 body:new ReadableStream({
   start(controller){
     if(signal?.aborted){controller.error(new Error('aborted'));return}
     signal?.addEventListener('abort',()=>controller.error(new Error('aborted')),{once:true});
     body(controller);
   }
 })
});
const events=[];
const bytes=await downloadVideoMAEWeights({
 expectedBytes:5,fetchImpl:fake(c=>{c.enqueue(new Uint8Array([1,2]));c.enqueue(new Uint8Array([3,4,5]));c.close()}),
 onProgress:x=>events.push(x),idleMs:2000,maxMs:2000
});
assert.deepEqual([...new Uint8Array(bytes)],[1,2,3,4,5]);
assert.match(events.at(-1),/100%/);

await assert.rejects(()=>downloadVideoMAEWeights({
 expectedBytes:6,fetchImpl:fake(c=>{c.enqueue(new Uint8Array([1,2,3]));c.close()}),
 idleMs:2000,maxMs:2000
}),/下载不完整/);

const stallBegin=Date.now();
await assert.rejects(()=>downloadVideoMAEWeights({
 expectedBytes:6,fetchImpl:fake(c=>{c.enqueue(new Uint8Array([1]))}),
 idleMs:80,maxMs:3000
}),/下载连续/);
assert.ok(Date.now()-stallBegin<2000);

const controller=new AbortController();
const abortTask=downloadVideoMAEWeights({
 expectedBytes:6,signal:controller.signal,
 fetchImpl:fake(c=>{c.enqueue(new Uint8Array([1]))}),
 idleMs:3000,maxMs:6000
});
controller.abort();
await assert.rejects(abortTask,/用户取消/);
assert.equal(controller.signal.aborted,true);
console.log('PASS VideoMAE stream progress, exact-length check, idle timeout, user abort');

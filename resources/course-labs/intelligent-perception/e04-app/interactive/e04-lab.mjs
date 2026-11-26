import {ROAD,iou,suppress,restore,createDetector} from './e04-core.mjs';
const $=id=>document.getElementById(id);
const names='person,bicycle,car,motorcycle,airplane,bus,train,truck,boat,traffic light,fire hydrant,stop sign,parking meter,bench,bird,cat,dog,horse,sheep,cow,elephant,bear,zebra,giraffe,backpack,umbrella,handbag,tie,suitcase,frisbee,skis,snowboard,sports ball,kite,baseball bat,baseball glove,skateboard,surfboard,tennis racket,bottle,wine glass,cup,fork,knife,spoon,bowl,banana,apple,sandwich,orange,broccoli,carrot,hot dog,pizza,donut,cake,chair,couch,potted plant,bed,dining table,toilet,tv,laptop,mouse,remote,keyboard,cell phone,microwave,oven,toaster,sink,refrigerator,book,clock,vase,scissors,teddy bear,hair drier,toothbrush'.split(',');
const topics={1:['基础目标检测','先数画面中的车辆和行人，再比较机器的类别、位置与数量。','A1'],2:['置信度探索','像录取分数线：提高阈值时，哪些真实目标消失？降低时又出现了哪些干扰？','C1'],3:['IoU 与 NMS','像删除重复照片：重叠多的框可能指向同一个物体，也可能是两辆相邻汽车。','B1'],4:['分辨率与模型规模','像望远镜和识别经验：固定一个条件，比较另一条件的实际效果。','A3'],5:['连续视频检测','观察视频中运动目标的检测框与类别随画面连续变化，再利用时间轴定位漏检。','B3']};
let tab=1,source=null,cache=null,comparison=null,detector=null,detectorKey='',runtime=null,busy=false,cancel=false,imageURL=null,videoURL=null,version=0,videoVersion=0,operation=0,continuousActive=false,paused=false;
function status(s,error=false){$('status').textContent=s;$('status').classList.toggle('error',error);}
function clear(){cache=null;comparison=null;for(const id of ['leftFig','rightFig']){$(id).dataset.ready='0';delete $(id).dataset.time;}$('results').replaceChildren();$('stats').textContent='待推理。';$('timing').textContent='尚无推理耗时';}
function mark(id){$(id+'Fig').dataset.ready='1';}
function copy(im){const c=document.createElement('canvas');c.width=im.videoWidth||im.naturalWidth||im.width;c.height=im.videoHeight||im.naturalHeight||im.height;if(!c.width||!c.height)throw Error('图像未就绪');c.getContext('2d').drawImage(im,0,0);return c;}
function paint(id,im,boxes=[],meta=null){const c=$(id),x=c.getContext('2d');c.width=im.width;c.height=im.height;x.drawImage(im,0,0);x.font='bold '+Math.max(12,Math.round(c.width/76))+'px sans-serif';x.lineWidth=Math.max(2,c.width/500);
 let drawn=0;for(const b of boxes){const [l,t,r,bot]=restore(b.box,meta);if(r<=l||bot<=t)continue;drawn++;const label=(names[b.cls]||String(b.cls))+' '+b.score.toFixed(2);x.strokeStyle=ROAD.has(b.cls)?'#18e38c':'#ffc052';x.strokeRect(l,t,r-l,bot-t);const tw=x.measureText(label).width+8,ty=Math.max(0,t-22);x.fillStyle=x.strokeStyle;x.fillRect(l,ty,tw,22);x.fillStyle='#102a20';x.fillText(label,l+4,ty+16);}
 c.dataset.boxes=String(drawn);mark(id);
}
function filtered(result){const opt={conf:+$('conf').value,threshold:+$('iou').value,nms:$('nms').checked};const boxes=$('road').checked?result.candidates.filter(b=>ROAD.has(b.cls)):result.candidates;return suppress(boxes,opt);}
function render(){ $('confVal').value=(+$('conf').value).toFixed(2);$('iouVal').value=(+$('iou').value).toFixed(2);if(!cache)return;
 const a=filtered(cache),b=comparison?filtered(comparison):null;
 if(tab===3){paint('left',cache.image,a.before,cache.meta);$('leftCaption').textContent='筛选前候选框（当前置信度）';}
 else if(tab===4&&b){paint('left',cache.image,a.after,cache.meta);$('leftCaption').textContent=cache.label+' · '+a.after.length+' 框 · '+cache.forwardMs.toFixed(1)+' ms';}
 else {paint('left',cache.image);$('leftCaption').textContent='原始输入';}
 const result=tab===4&&b?comparison:cache,chosen=tab===4&&b?b:a;paint('right',result.image,chosen.after,result.meta);
 $('rightCaption').textContent=result.label+' · '+chosen.after.length+' 框 · '+result.forwardMs.toFixed(1)+' ms';
 if(tab===5&&Number.isFinite(result.time)){$('leftCaption').textContent='原始画面 · '+result.time.toFixed(2)+' s';$('rightCaption').textContent+=' · '+result.time.toFixed(2)+' s';for(const id of ['leftFig','rightFig'])$(id).dataset.time=result.time.toFixed(4);}
 $('stats').textContent='当前显示候选 '+a.before.length+' → '+a.after.length+'；'+(b?'对照 '+b.before.length+' → '+b.after.length+'；':'')+'不代表识别准确率。';
 const rows=a.after.slice(0,300).map(v=>{const tr=document.createElement('tr');for(const s of [names[v.cls]||v.cls,v.score.toFixed(3),'保留']){const td=document.createElement('td');td.textContent=s;tr.append(td)}return tr;});$('results').replaceChildren(...rows);
}
function geometry(){const o=+$('offset').value;$('boxB').setAttribute('x',25+o);$('intersection').setAttribute('x',25+o);$('intersection').setAttribute('width',140-o);$('geoIou').value='IoU = '+iou([25,15,165,99],[25+o,15,165+o,99]).toFixed(3);}
// The approved frames are embedded by the deployment build. Decode exact JPEG bytes
// as an origin-local Blob; never draw a network Image that can taint Canvas.
const embeddedFrames=JSON.parse($('e04-embedded-frames')?.textContent||'{}');
function fromBase64(s,type){const bytes=Uint8Array.from(atob(s),c=>c.charCodeAt(0));return new Blob([bytes],{type});}
async function fetchMedia(relative,type){
 const url=new URL(relative,location.href),urls=[url.href];
 if(['raw.githack.com','rawcdn.githack.com'].includes(url.hostname)){
  const raw=new URL(url.href);raw.hostname='raw.githubusercontent.com';urls.push(raw.href);
 }
 let last;
 for(const address of urls){
  try{const res=await fetch(address,{mode:'cors',credentials:'omit'});if(!res.ok)throw Error('HTTP '+res.status);
   const blob=await res.blob(),head=new Uint8Array(await blob.slice(0,16).arrayBuffer());
   if(type==='image/jpeg'&&!(head[0]===255&&head[1]===216&&head[2]===255))throw Error('响应不是 JPEG');
   if(type==='video/mp4'&&String.fromCharCode(...head.slice(4,8))!=='ftyp')throw Error('响应不是 MP4');
   return new Blob([blob],{type});
  }catch(e){last=e;}
 }
 throw Error('资源下载失败：'+String(last?.message||last));
}
function readableCanvas(c){try{c.getContext('2d').getImageData(0,0,1,1);}catch(e){throw Error('图像像素不可读取，已阻止推理。'+e.message);}}
async function loadImage(){
 const n=++version;clear();source=null;if(imageURL){URL.revokeObjectURL(imageURL);imageURL=null;}
 const file=$('imageFile').files[0],key=$('frame').value;status('正在读取教学图片…');
 try{const blob=file||(embeddedFrames[key]?fromBase64(embeddedFrames[key],'image/jpeg'):await fetchMedia('../e04-media/frames/'+key+'.jpg','image/jpeg'));
 if(n!==version)return;const url=URL.createObjectURL(blob);imageURL=url;const im=new Image();im.src=url;await im.decode();
 if(n!==version){URL.revokeObjectURL(url);return;}const canvas=copy(im);readableCanvas(canvas);source=canvas;paint('left',source);$('leftCaption').textContent='原始输入';status('图片像素读取通过；等待真实模型推理。');
 }catch(e){if(n===version)status('图片加载失败：'+String(e.message||e),true);}
}
function resetTimeline(){$('timeline').replaceChildren();$('chart').replaceChildren();$('videoSummary').textContent='尚未开始检测。';$('videoProgress').value=0;$('videoClock').textContent='视频时间：0.00 s';$('videoFrames').textContent='已检测：0 帧';$('videoSpeed').textContent='实际处理速度：—';}
async function loadVideo(){
 const v=$('video'),token=++videoVersion;cancel=true;resetTimeline();clear();$('leftFig').dataset.videoMode='source';$('leftCaption').textContent='原始视频 · 可播放或定位';v.pause();v.removeAttribute('src');v.load();if(videoURL)URL.revokeObjectURL(videoURL);videoURL=null;
 const file=$('videoFile').files[0],scene=$('videoChoice').value;
 status('正在读取完整视频，以便准确定位每一帧…');v.dataset.scene='';
 try{let blob=file;if(!blob)blob=await fetchMedia('../e04-media/videos/'+scene+'.mp4','video/mp4');
 if(token!==videoVersion)return;if(!blob.size)throw Error('视频内容为空');
 videoURL=URL.createObjectURL(blob);v.src=videoURL;v.dataset.scene=file?'local':scene;v.load();
 }catch(e){if(token===videoVersion)status(String(e.message||e),true);}
}
async function getRuntime(){if(!runtime){runtime=await import('../e04-runtime/ort.webgpu.min.mjs');runtime.env.wasm.wasmPaths=new URL('../e04-runtime/',location.href).href;}return runtime;}
async function getDetector(model,size,file){const mode=$('backend').value,k=[model,size,mode,file?file.name+':'+file.size+':'+file.lastModified:'hosted'].join('|');if(detector&&detectorKey===k)return detector;if(detector){await detector.release();detector=null;detectorKey='';}
 const ort=await getRuntime(),url=file?new Uint8Array(await file.arrayBuffer()):'../e04-models/'+model+'-'+size+'-raw.onnx';
 const providers=mode==='auto'?(navigator.gpu?['webgpu','wasm']:['wasm']):[mode];let last;
 for(const p of providers){try{status('正在加载 '+model+' '+size+' / '+p+'…');detector=await createDetector(ort,url,p);detectorKey=k;return detector;}catch(e){last=e;}}
 throw Error('模型加载失败：'+String(last?.message||last));
}
async function forward(im,model,size,file){let det=await getDetector(model,size,file);let out;const key=detectorKey;
 try{out=await det.run(im,size);}catch(e){if($('backend').value!=='auto'||det.backend!=='webgpu')throw e;await det.release();detector=null;detectorKey='';const ort=await getRuntime();detector=await createDetector(ort,file?new Uint8Array(await file.arrayBuffer()):'../e04-models/'+model+'-'+size+'-raw.onnx','wasm');det=detector;detectorKey=key;out=await det.run(im,size);}
 return {...out,image:im,label:(file?'自定义 '+file.name:model)+' / '+size+' / '+det.backend};
}
function lock(on){busy=on;for(const el of document.querySelectorAll('button,select,input'))if(!['conf','iou','nms','road','stop','offset','pauseContinuous'].includes(el.id))el.disabled=on;$('stop').disabled=!on;$('pauseContinuous').disabled=!on||!continuousActive;}
async function execute(job){if(busy)return;cancel=false;lock(true);const seq=++operation;document.body.dataset.operation=String(seq);document.body.dataset.completed='';try{await job();if(cache)status('真实模型推理完成：'+cache.label);}catch(e){status(String(e.message||e),true);}finally{lock(false);document.body.dataset.completed=String(seq);}}
function current(){return [$('model').value,+$('size').value,$('modelFile').files[0]]}
async function runImage(both=false){if(!source)throw Error('请先加载图片并确认像素读取成功');const im=source;clear();paint('left',im);cache=await forward(im,...current());if(both){render();comparison=await forward(im,$('modelB').value,+$('sizeB').value,$('modelFileB').files[0]);}render();$('timing').textContent='预处理 '+cache.preprocessMs.toFixed(1)+' ms；模型前向 '+cache.forwardMs.toFixed(1)+' ms';}
async function frame(retain=false){
 const v=$('video');v.pause();if(v.readyState<2)throw Error('视频未加载');if(v.seeking)await seek(v.currentTime);
 const actual=v.currentTime,im=copy(v);readableCanvas(im);
 if(!retain){clear();$('leftFig').dataset.videoMode='pair';paint('left',im);}
 const next=await forward(im,...current());next.time=actual;cache=next;comparison=null;$('leftFig').dataset.videoMode='pair';render();
 $('timing').textContent='模型前向 '+cache.forwardMs.toFixed(1)+' ms';return cache;
}
async function seek(t){
 const v=$('video');v.pause();if(v.readyState<2)throw Error('视频未加载');
 if(Math.abs(v.currentTime-t)<.005&&!v.seeking)return;
 await new Promise((resolve,reject)=>{let timer;const clean=()=>{clearTimeout(timer);v.removeEventListener('seeked',check);v.removeEventListener('loadeddata',check);};const check=()=>{if(!v.seeking&&v.readyState>=2&&Math.abs(v.currentTime-t)<.025){clean();resolve();}};
 v.addEventListener('seeked',check);v.addEventListener('loadeddata',check);timer=setTimeout(()=>{clean();reject(Error('视频定位失败：请求 '+t.toFixed(2)+' s，实际 '+v.currentTime.toFixed(2)+' s'));},10000);v.currentTime=t;check();});
}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function sequence(rate,continuous){
 const v=$('video');if(!Number.isFinite(v.duration)||v.readyState<2)throw Error('视频未加载');
 v.pause();const controls=v.controls;v.controls=false;const locked=['conf','iou','nms','road'];for(const id of locked)$(id).disabled=true;
 continuousActive=continuous;paused=false;$('videoPanel').dataset.sequenceState='running';$('pauseContinuous').disabled=!continuous;$('pauseContinuous').textContent='暂停';resetTimeline();clear();
 $('leftFig').dataset.videoMode='pair';$('videoProgress').max=v.duration;
 const history=[];let activeMs=0;
 try{
  for(let i=0;i/rate<v.duration-1e-6&&!cancel;i++){
   if(paused&&!cancel){$('videoPanel').dataset.sequenceState='paused';while(paused&&!cancel)await sleep(60);}
   if(!cancel)$('videoPanel').dataset.sequenceState='running';
   if(cancel)break;
   const start=performance.now(),t=i/rate;await seek(t);if(cancel)break;
   const a=await frame(true);if(Math.abs(a.time-t)>=.025)throw Error('检测画面时间与请求时间不符');
   const b=filtered(a).after,tr=document.createElement('tr'),link=document.createElement('button');
   tr.dataset.actualTime=a.time.toFixed(4);link.type='button';link.disabled=true;link.textContent=t.toFixed(2)+'s';
   link.onclick=()=>execute(async()=>{await seek(t);const f=await frame();if(Math.abs(f.time-t)>=.025)throw Error('回看画面时间不符');});
   const td=document.createElement('td');td.append(link);tr.append(td);const counts=[2,0,1].map(c=>b.filter(z=>z.cls===c).length);
   history.push({t,counts,ms:a.forwardMs});for(const val of counts.concat(a.forwardMs.toFixed(1)+' ms')){const td=document.createElement('td');td.textContent=val;tr.append(td)}
   $('timeline').append(tr);drawChart(history);
   const duration=Math.min(v.duration,t+1/rate);$('videoProgress').value=duration;$('videoClock').textContent='视频时间：'+a.time.toFixed(2)+' / '+v.duration.toFixed(2)+' s';$('videoFrames').textContent='已检测：'+history.length+' 帧';
   if(continuous&&!paused&&!cancel){const wait=Math.max(0,1000/rate-(performance.now()-start));if(wait)await sleep(wait);}
   activeMs+=performance.now()-start;$('videoSpeed').textContent='实际处理速度：'+(1000*history.length/Math.max(1,activeMs)).toFixed(1)+' 帧/秒';
   $('videoSummary').textContent='已实际检测 '+history.length+' 帧 · 平均模型前向 '+(history.reduce((sum,x)=>sum+x.ms,0)/history.length).toFixed(1)+' ms · '+rate+' 次/秒'+(continuous?' 连续检测（按实际算力播放）':' 抽样分析');
   if(!paused&&!cancel)status((continuous?'正在连续检测：':'正在抽样分析：')+a.label+' · '+history.length+' 帧');
  }
  $('videoPanel').dataset.sequenceState=cancel?'stopped':'complete';$('stats').textContent=cancel?'已停止检测；保留已完成的真实帧及时间轴。':'检测完成；所有记录使用同一组参数。';
 }catch(e){$('videoPanel').dataset.sequenceState='error';throw e;}finally{continuousActive=false;paused=false;v.controls=controls;$('pauseContinuous').disabled=true;$('pauseContinuous').textContent='暂停';for(const id of locked)$(id).disabled=false;}
}
function scan(){return sequence(2,false);}
function continuous(){return sequence(+$('videoRate').value,true);}
function drawChart(history){const svg=$('chart'),ns='http://www.w3.org/2000/svg',max=Math.max(1,...history.flatMap(x=>x.counts));svg.replaceChildren();for(let j=0;j<3;j++){const poly=document.createElementNS(ns,'polyline');poly.setAttribute('points',history.map(x=>(20+x.t/Math.max(1,$('video').duration||12)*560)+','+(110-x.counts[j]/max*95)).join(' '));poly.setAttribute('fill','none');poly.setAttribute('stroke',['#1767ac','#b77714','#008765'][j]);poly.setAttribute('stroke-width','2.5');svg.append(poly);}const line=document.createElementNS(ns,'path');line.setAttribute('d','M20 10 V110 H580');line.setAttribute('stroke','#789');line.setAttribute('fill','none');svg.prepend(line);}
function setTab(i){tab=i;document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',+b.dataset.tab===i));$('topic').textContent='实验 0'+i+' · '+topics[i][0];$('question').textContent=topics[i][1];$('geometry').hidden=i!==3;$('comparison').hidden=i!==4;$('videoPanel').hidden=i!==5;$('imageControls').hidden=i===5;$('context').querySelector('#run').hidden=i===5;$(i===5?'videoGridSlot':'imageGridSlot').append($('resultGrid'));clear();if(i===5){++version;loadVideo();}else {$('leftFig').dataset.videoMode='';++videoVersion;$('video').pause();$('imageFile').value='';$('frame').value=topics[i][2];loadImage();}}
for(const b of document.querySelectorAll('[data-tab]'))b.onclick=()=>setTab(+b.dataset.tab);
for(const id of ['conf','iou','nms','road'])$(id).oninput=()=>{render();if(tab===5)resetTimeline();};
$('offset').oninput=geometry;
$('frame').onchange=()=>{$('imageFile').value='';loadImage();};$('imageFile').onchange=loadImage;
for(const id of ['model','size','backend','modelFile','modelB','sizeB','modelFileB'])$(id).onchange=()=>{if(['model','size'].includes(id))$('modelFile').value='';if(['modelB','sizeB'].includes(id))$('modelFileB').value='';clear();if(tab===5)resetTimeline();if(source&&tab!==5)paint('left',source);status('配置已改变，请重新运行真实推理。');};
$('run').onclick=()=>execute(()=>runImage());$('compare').onclick=()=>execute(()=>runImage(true));$('frameRun').onclick=()=>execute(()=>frame());$('scan').onclick=()=>execute(scan);$('continuous').onclick=()=>execute(continuous);$('stop').onclick=()=>{cancel=true;paused=false;};$('pauseContinuous').onclick=()=>{if(!continuousActive)return;paused=!paused;$('pauseContinuous').textContent=paused?'继续检测':'暂停';status(paused?'已暂停（当前帧完成后停止更新）':'继续连续检测…');};$('previewRaw').onclick=()=>{const v=$('video');if(v.readyState<2){status('视频尚未加载',true);return;}clear();$('leftFig').dataset.videoMode='source';$('leftCaption').textContent='原始视频 · 可播放或定位';status('原始视频预览；可定位后检测当前帧，或重新连续检测。');};
$('videoChoice').onchange=()=>{$('videoFile').value='';loadVideo();};$('videoFile').onchange=loadVideo;$('video').addEventListener('error',()=>status('视频尚未部署或读取失败；可上传本地 MP4。',true));
geometry();setTab(1);
// Report only layout height to the containing course page; direct standalone view also works.
if(window.parent!==window&&typeof ResizeObserver!=='undefined'){const main=document.querySelector('main');const report=()=>window.parent.postMessage({type:'mvai-e04-height',height:Math.ceil(main.getBoundingClientRect().bottom+window.scrollY+12)},'*');new ResizeObserver(report).observe(main);report();}

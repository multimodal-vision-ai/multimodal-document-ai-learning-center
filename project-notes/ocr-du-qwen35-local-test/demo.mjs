import {createAdapter} from '../../hf-spaces/mvai-doctags-webgpu/adapters/r3-ovisocr3/adapter.mjs';

const $ = id => document.getElementById(id);
let adapter, blobUrl, busy = false, text = '';
function status(message) { $('status').textContent = message; }
function controls() {
  $('load').disabled = busy || !!adapter;
  $('run').disabled = busy || !adapter || !$('image').hasAttribute('src');
  $('file').disabled = busy; $('pixels').disabled = busy;
  $('stop').disabled = !busy || !adapter;
  $('download').disabled = !text;
}
async function load(options = {}) {
  busy = true; controls(); status('正在加载模型…');
  try {
    adapter = await createAdapter({...options, onProgress(p) {
      status(p.file ? `加载 ${p.file}${Number.isFinite(p.progress) ? ` · ${p.progress.toFixed(0)}%` : ''}` : '正在创建推理会话…');
    }});
    status('模型已加载，可以选择图片识别。');
    return {versions: adapter.versions, modelId: adapter.modelId};
  } catch (e) { status(`加载失败：${e.message}`); throw e; }
  finally { busy = false; controls(); }
}
function drawBoxes(raw) {
  const svg = $('boxes'); svg.replaceChildren(); svg.setAttribute('viewBox', '0 0 500 500'); svg.setAttribute('preserveAspectRatio', 'none');
  const regex = /<([a-z][a-z_0-9]*)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)>/g;
  for (const match of raw.matchAll(regex)) {
    const [x,y,x2,y2] = match.slice(2).map(Number);
    if (x < 0 || y < 0 || x2 > 500 || y2 > 500 || x2 <= x || y2 <= y) continue;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    for (const [k,v] of Object.entries({x,y,width:x2-x,height:y2-y,fill:'none',stroke:'#2367ee','stroke-width':1,'vector-effect':'non-scaling-stroke'})) rect.setAttribute(k,v);
    const title = document.createElementNS(svg.namespaceURI,'title'); title.textContent = match[1]; rect.append(title); svg.append(rect);
  }
}
async function recognize(image, settings = {}) {
  if (!adapter) throw new Error('请先加载模型。');
  busy = true; text = ''; $('output').value = ''; $('boxes').replaceChildren(); controls(); status('正在识别…');
  try {
    const result = await adapter.recognize(image, {
      maxPixels: Number($('pixels').value), ...settings,
      onText(chunk) { text += chunk; $('output').value = text; },
      onTokens(n) { $('metrics').textContent = `已生成 ${n} 词元`; },
    });
    text = result.text; $('output').value = text; drawBoxes(text);
    $('metrics').textContent = `${result.generatedTokens} 词元 · ${result.seconds.toFixed(2)} 秒 · ${result.tokensPerSecond.toFixed(2)} 词元/秒（含图片预填充）`;
    status(result.ended ? '识别完成。' : '生成已停止，当前输出可能未完整结束。');
    return result;
  } catch (e) { status(`识别失败：${e.message}`); throw e; }
  finally { busy = false; controls(); }
}
$('load').onclick = () => load().catch(console.error);
$('run').onclick = () => recognize($('image').src).catch(console.error);
$('stop').onclick = () => {adapter?.stop(); status('正在停止生成…');};
$('file').onchange = async () => {
  if (blobUrl) URL.revokeObjectURL(blobUrl);
  const file = $('file').files[0]; if (!file) return;
  blobUrl = URL.createObjectURL(file); $('image').src = blobUrl; $('boxes').replaceChildren();
  await $('image').decode(); controls();
};
$('download').onclick = () => {
  const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'prediction.doctags'; link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
};
window.r3Demo = {load, recognize};
controls();

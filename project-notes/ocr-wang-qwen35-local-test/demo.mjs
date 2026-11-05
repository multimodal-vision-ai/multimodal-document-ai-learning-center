import {createAdapter} from '../../hf-spaces/mvai-doctags-webgpu/adapters/wang-qwen35-2b/adapter.mjs';

const $ = id => document.getElementById(id);
let adapter, blobUrl, busy = false, text = '';
const preview = window.WANG_PREVIEW_CONFIG ?? {};
let loadSequence = 0;
if (preview.sourceLabel) $('source').textContent = `模型来源：${preview.sourceLabel}。三份权重仍需传输到浏览器，总量约 6.2 GB。${preview.adapterOptions?.runtime?.rangeDownloads ? '已启用 16 MiB 分段下载、失败重试和分段缓存。' : ''}`;
function status(message) { $('status').textContent = message; }
function bytes(value) {
  if (!Number.isFinite(value)) return '大小未知';
  return value >= 1e9 ? `${(value / 1e9).toFixed(2)} GB` : `${(value / 1e6).toFixed(1)} MB`;
}
function errorText(error) {
  const parts = [];
  for (let item = error, n = 0; item && n < 3; item = item.cause, n++) {
    parts.push(item.message ? `${item.name ?? 'Error'}: ${item.message}` : String(item));
  }
  return parts.join('\n原因：');
}
function controls() {
  $('load').disabled = busy || !!adapter;
  $('run').disabled = busy || !adapter || !$('image').hasAttribute('src');
  $('file').disabled = busy; $('pixels').disabled = busy;
  $('stop').disabled = !busy || !adapter;
  $('download').disabled = !text;
}
async function load(options = {}) {
  if (busy) throw new Error('当前操作尚未完成。');
  const sequence = ++loadSequence;
  let finished = false, phase = '开始加载', device;
  const files = new Map(), notices = [];
  const diagnostic = () => ({phase, files: Object.fromEntries(files), notices, device,
    browser: navigator.userAgent, deviceMemoryGB: navigator.deviceMemory,
    secureContext: window.isSecureContext, crossOriginIsolated: window.crossOriginIsolated});
  const renderProgress = () => {
    $('loadDetails').textContent = [`阶段：${phase}`, ...[...files].map(([name, file]) =>
      `${file.done ? '完成' : '下载'} ${name}\n  ${bytes(file.loaded)} / ${bytes(file.total)}${Number.isFinite(file.percent) ? ` · ${file.percent.toFixed(1)}%（单文件）` : ''}`), ...notices].join('\n');
  };
  $('status').removeAttribute('data-error');
  busy = true; controls(); status('正在加载模型…');
  try {
    adapter = await createAdapter({...preview.adapterOptions, ...options, onProgress(p) {
      if (finished || sequence !== loadSequence) return;
      if (p.status === 'stage') { phase = p.stage; status(phase + '…'); }
      if (p.status === 'device') device = p.device;
      if (p.status === 'notice') {
        notices.push(p.message); if (notices.length > 12) notices.shift();
        status(p.message);
      }
      if (p.file) {
        const previous = files.get(p.file) ?? {};
        const total = Number.isFinite(p.total) ? p.total : previous.total;
        const done = p.status === 'done' || previous.done;
        const loaded = done && Number.isFinite(total) ? total : Number.isFinite(p.loaded) ? p.loaded : previous.loaded;
        const percent = done ? 100 : Number.isFinite(p.progress) ? p.progress : previous.percent;
        files.set(p.file, {loaded, total, percent, done: !!done});
        status(`${done ? '已接收' : '加载'} ${p.file}${Number.isFinite(percent) ? ` · ${percent.toFixed(0)}%（单文件）` : ''}`);
      }
      renderProgress();
    }});
    phase = '模型已加载'; renderProgress();
    status('模型已加载，可以选择图片识别。');
    return {versions: adapter.versions, modelId: adapter.modelId};
  } catch (e) {
    finished = true;
    const message = errorText(e);
    status(`加载失败（${phase}）：${message}`);
    $('status').dataset.error = 'true';
    $('loadDiagnostics').open = true;
    const details = {...diagnostic(), error: message, stack: e?.stack};
    $('loadDetails').textContent = JSON.stringify(details, null, 2);
    if (preview.diagnosticsUrl) {
      const body = JSON.stringify(details).replace(/(https?:\/\/[^\s"?#]+)[?#][^\s"]*/g, '$1');
      fetch(preview.diagnosticsUrl, {method: 'POST', headers: {'Content-Type': 'application/json'}, body}).catch(() => {});
    }
    throw e;
  } finally { finished = true; busy = false; controls(); }
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
window.wangDemo = {load, recognize};
controls();

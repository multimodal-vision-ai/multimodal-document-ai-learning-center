import {mapBoxToContainedVideo} from './person-overlay.js';
import {ACTION_LABELS} from './our-solution-rules.js';

const samples = {
  phone: {
    video: 'https://videos.pexels.com/video-files/4052869/4052869-hd_1920_1080_25fps.mp4',
    source: 'https://www.pexels.com/video/a-man-texting-using-his-smartphone-4052869/',
    author: 'KATRIN BOLOVTSOVA'
  },
  fall: {
    video: 'https://videos.pexels.com/video-files/2791953/2791953-hd_1280_720_25fps.mp4',
    source: 'https://www.pexels.com/video/person-falling-down-from-skateboard-2791953/',
    author: 'cottonbro studio'
  },
  sleep: {
    video: 'https://videos.pexels.com/video-files/8865507/8865507-hd_1920_1080_30fps.mp4',
    source: 'https://www.pexels.com/video/woman-sleeping-on-the-bed-8865507/',
    author: 'RDNE Stock project'
  }
};
const byId = id => document.getElementById(id);
const video = byId('video'), personBox = byId('person-box'), action = byId('action');
const run = byId('run'), cancel = byId('cancel'), upload = byId('upload');
const sampleButtons = [...document.querySelectorAll('[data-sample]')];
const capture = document.createElement('canvas');
const captureContext = capture.getContext('2d');
let detector, detectorReady, objectUrl, latest;
let starting = false, running = false, busy = false, generation = 0, runId = 0;
let lastSample = -Infinity, sleepSince = null, frameToken = 0;

function status(message) {
  byId('status').textContent = message;
  run.disabled = starting || running || !video.getAttribute('src') || !!video.error;
  cancel.disabled = !starting && !running;
}

function paint() {
  const t = video.currentTime;
  const point = latest;
  const box = point && t >= point.t && t - point.t <= 1.05 &&
    mapBoxToContainedVideo(point.personBox, video.videoWidth, video.videoHeight, video.clientWidth, video.clientHeight);
  personBox.hidden = !box;
  if (!box) return;
  Object.assign(personBox.style, {
    left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px'
  });
  const windowEnd = Math.max(point.t + (point.action === 'Sleeping Posture' ? 1.05 : .45), point.fallDisplayUntil ?? 0);
  const label = t < windowEnd ? ACTION_LABELS[point.action] : '';
  action.hidden = !label;
  action.textContent = label || '';
}

function resetTracking() {
  generation++;
  latest = null;
  sleepSince = null;
  busy = false;
  lastSample = -Infinity;
  detector?.postMessage({type: 'reset', generation});
  paint();
}

function stop(message) {
  runId++;
  starting = running = false;
  cancelAnimationFrame(frameToken);
  frameToken = 0;
  video.pause();
  resetTracking();
  status(message);
}

function onDetectorMessage({data}) {
  if (!running || data.generation !== generation) return;
  if (data.type === 'error') {
    stop('识别中断，请重试。');
  } else if (data.type === 'done') {
    busy = false;
  } else if (data.type === 'frame' && video.currentTime - data.t <= .9) {
    // Start judging sleeping posture after the initial observation window.
    if (data.action === 'Sleeping Posture' && data.t >= 2.6) {
      if (sleepSince === null || data.t - latest.t > .65) sleepSince = data.t;
    } else {
      sleepSince = null;
    }
    const sleepUnconfirmed = data.action === 'Sleeping Posture' &&
      (sleepSince === null || data.t - sleepSince < .85);
    latest = sleepUnconfirmed ? {...data, action: null} : data;
    paint();
  }
}

function loadDetector() {
  if (detectorReady) return detectorReady;
  const worker = new Worker(new URL('./our-solution-live-worker.js', import.meta.url));
  detector = worker;
  detectorReady = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error('模型加载超时')), 90000);
    worker.onmessage = ({data}) => {
      if (data.type !== 'ready' && data.type !== 'error') return;
      clearTimeout(timer);
      if (data.type === 'ready') resolve();
      else reject(Error(data.message));
    };
    worker.onerror = () => { clearTimeout(timer); reject(Error('模型加载失败')); };
    worker.postMessage({type: 'init'});
  }).then(() => {
    worker.onmessage = onDetectorMessage;
    worker.onerror = () => {
      worker.terminate();
      detector = detectorReady = null;
      stop('识别中断，请重试。');
    };
  }).catch(error => {
    worker.terminate();
    detector = detectorReady = null;
    throw error;
  });
  return detectorReady;
}

async function sampleFrame(t, frameGeneration) {
  const width = video.videoWidth, height = video.videoHeight;
  const scale = Math.min(1, 640 / width);
  const w = Math.max(1, Math.round(width * scale)), h = Math.max(1, Math.round(height * scale));
  if (capture.width !== w || capture.height !== h) {
    capture.width = w;
    capture.height = h;
  }
  captureContext.drawImage(video, 0, 0, w, h);
  const bitmap = await createImageBitmap(capture);
  if (!running || frameGeneration !== generation) {
    bitmap.close();
    return;
  }
  detector.postMessage({type: 'frame', generation: frameGeneration, t, bitmap, width, height}, [bitmap]);
}

function tick() {
  frameToken = 0;
  if (!running || video.paused || video.ended) return;
  paint();
  const t = video.currentTime;
  if (!busy && !video.seeking && video.readyState >= 2 && t - lastSample >= .095) {
    busy = true;
    lastSample = t;
    const frameGeneration = generation;
    sampleFrame(t, frameGeneration).catch(() => {
      if (running && frameGeneration === generation) stop('视频画面无法读取，请重试。');
    });
  }
  frameToken = requestAnimationFrame(tick);
}

function selectVideo(key, file) {
  stop('点击「开始识别」。');
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = file ? URL.createObjectURL(file) : null;
  const sample = samples[key], source = byId('source');
  source.replaceChildren();
  for (const button of sampleButtons) button.setAttribute('aria-pressed', String(button.dataset.sample === key));
  if (file) {
    video.removeAttribute('crossorigin');
    source.textContent = '本地文件';
  } else {
    upload.value = '';
    video.crossOrigin = 'anonymous';
    const link = document.createElement('a');
    link.href = sample.source;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = sample.author + ' / Pexels';
    source.append('素材来源 · ', link, ' · ');
    const license = document.createElement('a');
    license.href = 'https://www.pexels.com/license/';
    license.textContent = 'Pexels 许可';
    source.append(license);
  }
  video.src = objectUrl || sample.video;
  video.load();
  status('点击「开始识别」。');
}

run.addEventListener('click', async () => {
  const id = ++runId;
  starting = true;
  status('正在加载模型，首次需要下载，请稍候…');
  try {
    await loadDetector().catch(error => {
      if (id !== runId) return;
      console.warn('Our Solution model load retry', error);
      status('正在重新加载模型…');
      return loadDetector();
    });
    if (id !== runId) return;
    if (video.currentTime > 0) video.currentTime = 0;
    resetTracking();
    starting = false;
    running = true;
    status('实时识别中');
    await video.play();
    if (running && id === runId && !frameToken) frameToken = requestAnimationFrame(tick);
  } catch (error) {
    if (id === runId) {
      console.warn('Our Solution could not start', error);
      stop(detectorReady ? '视频无法开始播放，请重试。' : '模型加载失败，请检查网络后重试。');
    }
  }
});
cancel.addEventListener('click', () => stop('已停止识别。'));
video.addEventListener('play', () => {
  if (running && !frameToken) frameToken = requestAnimationFrame(tick);
});
video.addEventListener('seeking', resetTracking);
video.addEventListener('ended', () => {
  if (running) stop('实时识别已完成。');
});
video.addEventListener('error', () => stop('视频无法加载，请重试或选择本地视频。'));
window.addEventListener('resize', paint);
for (const button of sampleButtons) button.addEventListener('click', () => selectVideo(button.dataset.sample));
upload.addEventListener('change', () => {
  if (upload.files[0]) selectVideo(null, upload.files[0]);
});
selectVideo('phone');

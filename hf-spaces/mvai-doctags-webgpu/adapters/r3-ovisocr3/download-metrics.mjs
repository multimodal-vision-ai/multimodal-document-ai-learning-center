/** Byte-accurate download progress and smoothed throughput for Transformers.js v4. */
export function createDownloadMeter(now = () => performance.now()) {
  let stage = null, lastAt = 0, lastLoaded = 0, bytesPerSecond = 0;
  return {
    reset() { stage = null; lastAt = 0; lastLoaded = 0; bytesPerSecond = 0; },
    update(info) {
      if (info?.status !== 'progress_total') return null;
      const loaded = Number(info.loaded), total = Number(info.total);
      if (!Number.isFinite(loaded) || !Number.isFinite(total) || total <= 0) return null;
      const currentStage = info.stage ?? 'model', timestamp = now();
      if (currentStage !== stage || loaded < lastLoaded) {
        stage = currentStage; lastAt = timestamp; lastLoaded = loaded; bytesPerSecond = 0;
      } else {
        const elapsed = (timestamp - lastAt) / 1000;
        if (elapsed >= 0.5) {
          const sample = Math.max(0, loaded - lastLoaded) / elapsed;
          if (sample > 0) bytesPerSecond = bytesPerSecond > 0 ? bytesPerSecond * 0.65 + sample * 0.35 : sample;
          lastAt = timestamp; lastLoaded = loaded;
        }
      }
      const reported = Number(info.progress);
      const progress = Number.isFinite(reported) ? reported : loaded / total * 100;
      return {stage, loaded, total, progress: Math.min(100, Math.max(0, progress)), bytesPerSecond, etaSeconds: bytesPerSecond > 0 ? Math.max(0, (total - loaded) / bytesPerSecond) : null};
    },
  };
}
export function formatBytes(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value < 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let amount = value, unit = 0;
  while (amount >= 1000 && unit < units.length - 1) { amount /= 1000; unit += 1; }
  return amount.toFixed(unit === 0 ? 0 : 2) + ' ' + units[unit];
}
export function formatRate(bytesPerSecond) {
  const value = Number(bytesPerSecond);
  return Number.isFinite(value) && value > 0 ? (value / 1000000).toFixed(2) + ' MB/s' : '测速中';
}
export function formatEta(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return '计算中';
  const total = Math.ceil(value);
  if (total < 60) return total + ' 秒';
  const minutes = Math.floor(total / 60), remainder = total % 60;
  if (minutes < 60) return minutes + ' 分 ' + remainder + ' 秒';
  return Math.floor(minutes / 60) + ' 小时 ' + (minutes % 60) + ' 分';
}

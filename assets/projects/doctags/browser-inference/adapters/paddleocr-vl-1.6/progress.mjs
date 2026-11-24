export const PADDLE_VLM_DOWNLOAD_BYTES = 2_038_286_862;
export const PADDLE_LAYOUT_DOWNLOAD_BYTES = 74_279_796;
export const PADDLE_TOTAL_DOWNLOAD_BYTES =
  PADDLE_VLM_DOWNLOAD_BYTES + PADDLE_LAYOUT_DOWNLOAD_BYTES;

function clampBytes(value, maximum) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes)) return null;
  return Math.min(maximum, Math.max(0, bytes));
}

export function createPaddleDownloadProgress() {
  return {
    layoutLoadedBytes: 0,
    vlmLoadedBytes: 0,
    layoutSource: null,
    vlmSource: null,
  };
}

/* Aggregate only byte counts reported by the two pinned model loaders.
   Cache reads count as prepared bytes, but the UI labels them separately. */
export function updatePaddleDownloadProgress(state, event) {
  if (!state || typeof state !== "object") {
    throw new TypeError("Paddle download progress state is required.");
  }
  if (!event || typeof event !== "object") {
    return summarizePaddleDownloadProgress(state);
  }

  if (
    event.stage === "layout-load" &&
    event.phase === "model" &&
    event.status === "progress"
  ) {
    const loaded = clampBytes(event.loadedBytes, PADDLE_LAYOUT_DOWNLOAD_BYTES);
    if (loaded !== null) {
      state.layoutLoadedBytes = Math.max(state.layoutLoadedBytes, loaded);
      state.layoutSource = "network";
    }
  } else if (
    event.stage === "layout-load" &&
    event.phase === "ready"
  ) {
    state.layoutLoadedBytes = PADDLE_LAYOUT_DOWNLOAD_BYTES;
    state.layoutSource = String(event.source || "ready");
  }

  if (event.kind === "download") {
    const loaded = clampBytes(event.modelLoadedBytes, PADDLE_VLM_DOWNLOAD_BYTES);
    if (loaded !== null) {
      state.vlmLoadedBytes = Math.max(state.vlmLoadedBytes, loaded);
      state.vlmSource = event.fromPersistentCache ? "cache" : "network";
    }
  } else if (
    event.stage === "vlm-warmup" &&
    event.kind === "ready"
  ) {
    state.vlmLoadedBytes = PADDLE_VLM_DOWNLOAD_BYTES;
    state.vlmSource = String(event.source || "ready");
  }

  return summarizePaddleDownloadProgress(state);
}

function summarizePaddleDownloadProgress(state) {
  const layoutLoadedBytes = Math.min(
    PADDLE_LAYOUT_DOWNLOAD_BYTES,
    Math.max(0, Number(state.layoutLoadedBytes) || 0),
  );
  const vlmLoadedBytes = Math.min(
    PADDLE_VLM_DOWNLOAD_BYTES,
    Math.max(0, Number(state.vlmLoadedBytes) || 0),
  );
  const loadedBytes = layoutLoadedBytes + vlmLoadedBytes;
  return {
    layoutLoadedBytes,
    vlmLoadedBytes,
    loadedBytes,
    totalBytes: PADDLE_TOTAL_DOWNLOAD_BYTES,
    progress: loadedBytes / PADDLE_TOTAL_DOWNLOAD_BYTES * 100,
    hasProgress: loadedBytes > 0,
    layoutSource: state.layoutSource,
    vlmSource: state.vlmSource,
  };
}

export function normalizePaddleInferenceProgress(event) {
  const rawTotal = Number(event?.totalRegions ?? event?.regions);
  const rawCompleted = Number(event?.completedRegions);
  const totalRegions = Number.isFinite(rawTotal)
    ? Math.max(0, Math.floor(rawTotal))
    : 0;
  const completedRegions = Number.isFinite(rawCompleted)
    ? Math.min(totalRegions, Math.max(0, Math.floor(rawCompleted)))
    : 0;
  const complete = event?.status === "complete";
  return {
    completedRegions,
    totalRegions,
    progress: complete
      ? 100
      : totalRegions > 0
        ? completedRegions / totalRegions * 100
        : 0,
    determinate: totalRegions > 0 || complete,
  };
}

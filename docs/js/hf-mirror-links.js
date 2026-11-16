/* MVAI Learning Center: add an optional China mirror link to public HF model/dataset cards.
   Does NOT change official URLs, embedded Spaces, WebGPU model fetches or runtime APIs. */
(function (root) {
  "use strict";

  const MIRROR_ORIGIN = "https://hf-mirror.com";
  const RESERVED = new Set([
    "spaces", "docs", "papers", "learn", "blog", "login", "signup",
    "join", "settings", "tasks", "models", "organizations", "collections",
    "new", "pricing", "prompts", "chat", "search", "terms", "security"
  ]);

  // Only augment repository landing pages. Spaces and file/API URLs are intentionally excluded.
  function toMirrorUrl(value) {
    let url;
    try {
      url = new URL(value);
    } catch {
      return null;
    }
    if (url.protocol !== "https:" || url.hostname !== "huggingface.co" ||
        url.username || url.password || url.port) return null;

    const parts = url.pathname.split("/").filter(Boolean);
    const isDataset = parts[0] === "datasets" && parts.length === 3;
    const isModel = parts.length === 2 && !RESERVED.has(parts[0]) &&
                    parts[0] !== "datasets";
    if (!isDataset && !isModel) return null;
    if (parts.some(part => part === "." || part === "..")) return null;
    return MIRROR_ORIGIN + url.pathname + url.search + url.hash;
  }

  function enhance(container) {
    if (!container) return 0;
    let count = 0;
    container.querySelectorAll("a[href]").forEach(anchor => {
      if (anchor.dataset.mvHfMirrorEnhanced || anchor.closest(".mv-hf-mirror-extra") ||
          anchor.closest("[data-hf-mirror-ignore]")) return;
      const mirrorUrl = toMirrorUrl(anchor.href);
      if (!mirrorUrl) return;

      const suffix = document.createElement("span");
      suffix.className = "mv-hf-mirror-extra";
      const link = document.createElement("a");
      link.className = "mv-hf-mirror-link";
      link.href = mirrorUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "国内镜像";
      const originalLabel = (anchor.textContent || "").trim();
      link.setAttribute("aria-label", "国内镜像：" + (originalLabel || "模型或数据集"));
      link.title = "HF-Mirror 第三方镜像；无法访问时请使用原链接";
      suffix.appendChild(link);
      anchor.dataset.mvHfMirrorEnhanced = "1";
      if (!anchor.title) anchor.title = "Hugging Face 官方地址";
      anchor.after(suffix);
      count++;
    });
    return count;
  }

  let observer;
  function mount() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    const content = document.querySelector(".md-content__inner");
    if (!content) return;
    enhance(content);
    if (typeof MutationObserver === "undefined") return;
    observer = new MutationObserver(records => {
      // Research Radar and other dynamic lists may insert links after page load.
      if (records.some(record => Array.from(record.addedNodes).some(node =>
        node.nodeType === 1 &&
        (node.matches?.("a[href]") || node.querySelector?.("a[href]"))
      ))) enhance(content);
    });
    observer.observe(content, { childList: true, subtree: true });
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { toMirrorUrl };
  }
  if (typeof document === "undefined") return;
  if (typeof root.document$ !== "undefined" && root.document$?.subscribe) {
    root.document$.subscribe(mount);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})(typeof window !== "undefined" ? window : globalThis);

/* Independent document/video model workspaces, compatible with MkDocs Material instant navigation. */
(() => {
  "use strict";
  const modelRegistry = {
    doc: [
      {
        name: "Granite Docling", scale: "258M",
        url: "https://huggingface.co/spaces/ibm-granite/granite-docling-258m-demo",
        embed: "https://ibm-granite-granite-docling-258m-demo.hf.space",
        intro: "原演示包含可点击的公开文档样例。直接选取示例图片并提交解析任务。",
        examples: ["文档图片", "论文页面", "表格", "公式"],
        howto: "加载后，在第三方界面的 Select a document 图库中选择一张样例。",
        rules: ["图片文件：优先 JPG / PNG；其他格式以演示上传控件为准", "当前在线示例不能保证直接上传 PDF 或 Word", "建议单页清晰扫描图，大小不超过 5 MB"],
        advisory: "5 MB 为课堂推荐值，不是服务公布的硬性文件上限。"
      },
      {
        name: "PaddleOCR-VL 1.6", scale: "0.9B",
        url: "https://huggingface.co/spaces/PaddlePaddle/PaddleOCR-VL-1.6_Online_Demo",
        embed: "https://paddlepaddle-paddleocr-vl-1-6-online-demo.hf.space",
        intro: "原演示提供文档解析和元素级识别的公开示例图库。",
        examples: ["复杂版面", "文字", "表格", "公式"],
        howto: "加载后可选择 Document Parsing 或 Element-level Recognition，并使用对应的示例。",
        rules: ["图片文件：PNG / JPG / JPEG / BMP / WebP，以实际控件为准", "该在线演示主要通过图片输入，不能保证直接上传 PDF / Word", "建议单页图片，不超过 5 MB"],
        advisory: "5 MB 为课堂推荐值，并非官方公布的硬性上限。"
      }
    ],
    video: [
      {
        name: "SmolVLM2 OpenVINO", scale: "256M",
        url: "https://huggingface.co/spaces/echarlaix/vision-langage-openvino",
        embed: "https://echarlaix-vision-langage-openvino.hf.space",
        intro: "第三方演示自带的公开示例目前主要是图片与问答；视频任务需要上传自有短视频。",
        examples: ["蜜蜂图片", "小狗图片", "食物图片", "图像问答"],
        howto: "可先点击 Examples 验证服务；测试视频则需要上传授权的视频片段。",
        rules: ["短视频：优先 MP4，其他格式（MOV / WebM）以实际上传控件和浏览器支持为准", "一次只测试一个视频，并输入一个明确问题", "当前后端约每秒抽取 3 帧、最多 30 帧", "课堂建议 10 秒内、压缩后不超过 20 MB"],
        advisory: "10 秒是依据该演示抽帧预算给出的教学建议；20 MB 不是硬性限制。"
      }
    ]
  };

  function initOne(section) {
    if (section.dataset.mpgBound === "true") return;
    section.dataset.mpgBound = "true";
    const kind = section.getAttribute("data-mpg-kind");
    const registry = modelRegistry[kind];
    if (!registry) return;
    const find = key => section.querySelector('[data-mpg="' + key + '"]');
    const modelButtons = find("models");
    const viewer = find("viewer");
    const empty = find("empty");
    const start = find("start");
    const stop = find("stop");
    const status = find("status");
    let selected = 0;
    let frame = null;

    function close() {
      if (frame) frame.remove();
      frame = null;
      empty.hidden = false;
      viewer.classList.remove("mpg-loaded");
      stop.disabled = true;
      start.disabled = false;
      start.textContent = "加载真实演示";
      status.textContent = "尚未加载 · 不消耗外部演示资源";
      status.classList.remove("mpg-active");
    }

    function update() {
      const m = registry[selected];
      find("title").textContent = m.name;
      find("scale").textContent = m.scale + " 参数";
      find("external").href = m.url;
      find("example-intro").textContent = m.intro;
      find("example-howto").textContent = m.howto;
      find("advisory").textContent = m.advisory;
      const chips = find("example-chips");
      chips.replaceChildren(...m.examples.map(x => {
        const span = document.createElement("span");
        span.textContent = x;
        return span;
      }));
      const rules = find("upload-rules");
      rules.replaceChildren(...m.rules.map(x => {
        const li = document.createElement("li");
        li.textContent = x;
        return li;
      }));
      Array.from(modelButtons.querySelectorAll("button")).forEach((b, i) => {
        b.setAttribute("aria-pressed", String(i === selected));
      });
    }

    function load() {
      if (frame) return;
      const m = registry[selected];
      frame = document.createElement("iframe");
      frame.title = m.name + " 在线交互演示";
      frame.referrerPolicy = "no-referrer";
      frame.setAttribute("allow", "clipboard-read;clipboard-write");
      frame.loading = "eager";
      frame.src = m.embed;
      empty.hidden = true;
      viewer.classList.add("mpg-loaded");
      viewer.appendChild(frame);
      stop.disabled = false;
      start.disabled = true;
      start.textContent = "演示已加载";
      status.classList.add("mpg-active");
      status.textContent = "已请求加载第三方演示；若空白、排队或运行失败，请使用“在新标签页打开”。";
    }

    registry.forEach((m, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = m.name + " · " + m.scale;
      b.setAttribute("aria-pressed", String(i === selected));
      b.addEventListener("click", () => {
        if (selected !== i) {
          close();
          selected = i;
          update();
        }
      });
      modelButtons.appendChild(b);
    });
    start.addEventListener("click", load);
    stop.addEventListener("click", close);
    update();
  }

  function initAll() {
    document.querySelectorAll(".mpg-workspace[data-mpg-kind]").forEach(initOne);
  }
  if (typeof document$ !== "undefined" && document$ && typeof document$.subscribe === "function") {
    document$.subscribe(initAll);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll, { once: true });
  } else {
    initAll();
  }
})();

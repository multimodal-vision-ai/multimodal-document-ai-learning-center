/* Vision playground: one third-party Space at a time; independent of legacy document/video demos. */
(() => {
  "use strict";

  const demos = [
    {
      id: "yolo",
      name: "Ultralytics YOLO26",
      button: "YOLO26 · 多任务视觉",
      scale: "Nano 检测版约 2.4M 参数（界面可选择其他型号）",
      url: "https://huggingface.co/spaces/Ultralytics/YOLO26",
      embed: "https://ultralytics-yolo26.hf.space",
      focus: "检测框与类别 · 实例分割 · 人体姿态 · 旋转目标框",
      intro: "原演示的 Image 标签提供官方公开照片样例，适合先确认服务是否正常；视频标签可上传个人短视频。",
      examples: ["公交车照片", "人物照片", "船只照片"],
      howto: "加载后先用 Image 标签中的 Examples；测试自己的视频时切换到 Video → Upload Video → Process Video。姿态/分割需要在 Model Name 中选择 -pose / -seg 后缀模型。",
      rules: [
        "视频：优先 MP4，建议 5–10 秒，文件大小尽量控制在 20 MB 内",
        "进入 Video 标签，上传视频并选择 yolo26n、yolo26n-pose 或 yolo26n-seg",
        "Webcam 标签支持实时摄像头输入；若嵌入页授权受限，改在新标签页打开"
      ],
      advisory: "5–10 秒和 20 MB 是教学建议，并非第三方平台承诺的硬性上限。",
      compare: "同一视频分别选择 yolo26n / yolo26n-seg / yolo26n-pose，比较检测框、轮廓掩码和人体骨骼关节点；注意不同模型任务并不相同。",
      task: "拍摄短视频（如走动或挥手），记录一个准确检测和一个漏检/误检案例；尝试调整 Confidence threshold。"
    },
    {
      id: "dfine",
      name: "D-FINE + Trackers",
      button: "D-FINE · 多目标跟踪",
      scale: "检测模型 + 可选 ByteTrack / DeepSORT / SORT",
      url: "https://huggingface.co/spaces/ustc-community/d-fine-object-detection",
      embed: "https://ustc-community-d-fine-object-detection.hf.space",
      focus: "视频目标检测 · 目标 ID · 移动轨迹",
      intro: "原演示提供动物、交通与舞蹈等公开视频样例，也可以在 Video 标签中上传个人视频。",
      examples: ["奔跑的狗", "道路交通", "舞蹈场景"],
      howto: "加载后进入 Video 标签，选 Examples 中的视频，再将 Select Tracker (Optional) 改为 ByteTrack 或 DeepSORT，点击 Detect Objects。",
      rules: [
        "视频上传以 MP4 为首选，源代码也接受 MOV / AVI",
        "建议 5–10 秒、文件不超过 20 MB；演示最多处理约 250 帧",
        "选择 Select Tracker (Optional) 后才能看到连续目标 ID 与轨迹"
      ],
      advisory: "视频长度和 20 MB 是课堂建议；250 帧为该公开演示当前实现的输出处理上限。",
      compare: "对同一段两人交叉走动的视频，比较仅目标检测与启用 ByteTrack 的输出；观察遮挡后 ID 是否保持一致。",
      task: "用一段包含两个移动目标的短视频，记录跟踪 ID 何时发生变化，并说明跟踪不等同于跨摄像头 ReID。"
    },
    {
      id: "sam2",
      name: "SAM 2 视频分割",
      button: "SAM 2 · 交互式分割",
      scale: "SAM 2.1：Tiny / Small / Base+ / Large 可选",
      url: "https://huggingface.co/spaces/yonigozlan/Segment-Anything-2-video-tracking",
      embed: "https://yonigozlan-segment-anything-2-video-tracking.hf.space",
      focus: "点击指定目标 · 像素级掩码 · 视频掩码传播",
      intro: "原演示自带公开视频示例，学生可以先用示例学习点击选择目标，再测试自己的视频。",
      examples: ["鹿群视频", "企鹅视频", "脚部运动视频"],
      howto: "加载视频后，在预览帧中对目标添加正向点击或框提示，再点 Propagate across video 查看跟踪分割；需要时点击 Render MP4 导出。",
      rules: [
        "建议先选 Tiny 模型和短 MP4，降低第三方计算等待时间",
        "上传后需点击或框选希望分割的目标，并执行跨帧传播",
        "可以使用原演示中的 Upload Video；其 Webcam 入口可受设备授权和浏览器策略限制"
      ],
      advisory: "建议用 5–10 秒、20 MB 以内的授权短视频；这是课堂建议，不是上传接口的硬性限制。",
      compare: "先单击目标，再让掩码沿视频传播；观察目标遮挡、尺寸变化或快速运动时轮廓是否保持准确。",
      task: "上传包含一个移动物体的短片，尝试用正向点击和框提示分别初始化；记录哪一种更稳定。"
    }
  ];

  function initOne(root) {
    if (root.dataset.visBound === "true") return;
    const get = key => root.querySelector('[data-vis="' + key + '"]');
    const models = get("models");
    const viewer = get("viewer");
    const empty = get("empty");
    const start = get("start");
    const stop = get("stop");
    const status = get("status");
    if (!models || !viewer || !empty || !start || !stop || !status) return;
    root.dataset.visBound = "true";

    let selected = 0;
    let frame = null;

    function resetViewer() {
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

    function renderModel() {
      const model = demos[selected];
      get("title").textContent = model.name;
      get("scale").textContent = model.scale;
      get("focus").textContent = model.focus;
      get("external").href = model.url;
      get("example-intro").textContent = model.intro;
      get("example-steps").textContent = model.howto;
      get("advisory").textContent = model.advisory;
      get("compare").textContent = model.compare;
      get("task").textContent = model.task;
      get("examples").replaceChildren(...model.examples.map(label => {
        const tag = document.createElement("span");
        tag.textContent = label;
        return tag;
      }));
      get("upload-rules").replaceChildren(...model.rules.map(label => {
        const item = document.createElement("li");
        item.textContent = label;
        return item;
      }));
      models.querySelectorAll("button").forEach((btn, i) => {
        btn.setAttribute("aria-pressed", String(i === selected));
      });
    }

    function loadModel() {
      if (frame) return;
      const model = demos[selected];
      frame = document.createElement("iframe");
      frame.title = model.name + " 真实在线视频演示";
      frame.src = model.embed;
      frame.setAttribute("allow", "camera; clipboard-read; clipboard-write");
      frame.setAttribute("referrerpolicy", "no-referrer");
      frame.loading = "eager";
      empty.hidden = true;
      viewer.classList.add("mpg-loaded");
      viewer.appendChild(frame);
      start.disabled = true;
      stop.disabled = false;
      start.textContent = "已请求加载";
      status.classList.add("mpg-active");
      status.textContent = "已请求加载第三方在线演示。如果内容空白、等待过久或摄像头无法授权，请点击“在新标签页打开”。";
    }

    demos.forEach((model, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = model.button;
      btn.setAttribute("aria-pressed", String(index === selected));
      btn.addEventListener("click", () => {
        if (index === selected) return;
        resetViewer();
        selected = index;
        renderModel();
      });
      models.appendChild(btn);
    });

    start.addEventListener("click", loadModel);
    stop.addEventListener("click", resetViewer);
    renderModel();
  }

  function initAll() {
    document.querySelectorAll(".mpg-vision[data-vis-workspace]").forEach(initOne);
  }

  if (typeof document$ !== "undefined" && document$ && typeof document$.subscribe === "function") {
    document$.subscribe(initAll);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll, { once: true });
  } else {
    initAll();
  }
})();

---
hide:
  - toc
---

<div class="mpg mpg-vision-page" id="vision-playground">

<header class="mpg-intro">
  <div>
    <h1>视觉感知 <span>Vision AI Playground</span></h1>
    <p>同一段短视频，体验目标检测、多目标跟踪与交互式视频分割。三个演示来自公开的第三方 Hugging Face Spaces，无需在学习中心安装模型。</p>
  </div>
  <div class="mpg-intro-tag">OpenCV 生态 · 视频视觉 AI</div>
</header>

<section class="mpg-workspace mpg-vision" data-vis-workspace aria-label="视觉感知工作区">
  <header class="mpg-workspace-head">
    <p class="mpg-eyebrow">WORKSPACE 03 · COMPUTER VISION</p>
    <h2>视觉感知与追踪</h2>
    <p>一次选择一个在线模型，上传授权短视频，观察视觉算法如何定位、关联或分割对象。</p>
  </header>

  <div class="mpg-workspace-body">
    <p class="mpg-label">选择体验模型</p>
    <div class="mpg-models" data-vis="models" role="group" aria-label="选择视觉模型"></div>

    <details class="mpg-help">
      <summary><span class="mpg-help-caret" aria-hidden="true">▸</span><strong>操作指南</strong><span class="mpg-help-caption">公开视频样例 · 自定义视频上传 · 注意事项</span></summary>
      <div class="mpg-help-content">
        <div class="mpg-test-row">
          <div class="mpg-test-card mpg-public">
            <h3>① 先用公开样例</h3>
            <p data-vis="example-intro"></p>
            <div class="mpg-chips" data-vis="examples"></div>
            <p data-vis="example-steps"></p>
          </div>
          <div class="mpg-test-card">
            <h3>② 再上传自己的视频</h3>
            <ul data-vis="upload-rules"></ul>
            <p class="mpg-advisory" data-vis="advisory"></p>
          </div>
        </div>
      </div>
    </details>

    <div class="mpg-model-heading">
      <strong data-vis="title">YOLO26</strong>
      <span data-vis="scale"></span>
    </div>
    <p class="vis-model-focus" data-vis="focus">目标检测 · 实例分割 · 姿态估计</p>

    <div class="mpg-actions">
      <button type="button" class="mpg-primary" data-vis="start">加载真实演示</button>
      <button type="button" class="mpg-secondary" data-vis="stop" disabled>收起内嵌演示</button>
      <a data-vis="external" href="https://huggingface.co/spaces/Ultralytics/YOLO26" target="_blank" rel="noopener noreferrer">在新标签页打开 ↗</a>
    </div>

    <div class="mpg-viewer" data-vis="viewer">
      <div class="mpg-empty" data-vis="empty">
        <div class="mpg-empty-icon" aria-hidden="true">▣</div>
        <strong>视觉模型演示尚未加载</strong>
        <p>点击“加载真实演示”，在这里打开对应的第三方 Gradio 界面；文件上传和 AI 处理均由第三方服务完成。</p>
      </div>
    </div>

    <p class="mpg-state" data-vis="status" role="status" aria-live="polite">尚未加载 · 不消耗外部演示资源</p>

    <div class="mpg-compare">
      <strong>本次观察重点：</strong><span data-vis="compare">观察每个检测框对应的目标、类别和置信度；再切换实例分割或姿态模型，比较输出差异。</span>
    </div>
    <div class="mpg-guide">
      <strong>学生观察任务</strong>
      <p data-vis="task">选取一段无遮挡的短视频，记录 1 个正确识别结果和 1 个漏检或误检案例。</p>
    </div>
  </div>
</section>

<p class="mpg-state">切换方向：可通过左侧「模型演示」进入文档理解、视频理解或视觉感知页面。</p>

<div class="mpg-footnote">
  <strong>按需加载 · 第三方在线计算 · 建议短视频</strong>
  <p>本页不是 OpenCV 自带模型或本站自行运行的 GPU 服务，而是汇集现代视觉模型的公开演示。建议先用 5–10 秒 MP4 测试，再尝试已取得授权的个人视频。不要上传含他人未经同意的影像、证件、隐私或保密内容。第三方服务可能休眠、排队、限额，摄像头功能还可能需要在新标签页单独授权。</p>
</div>

</div>

---
hide:
  - toc
---

<div class="mpg" id="model-playground">

<header class="mpg-intro">
  <div>
    <h1>模型演示 <span>Model Playground</span></h1>
    <p>文档理解和视频理解采用上下两个独立工作区，支持选择不同模型、使用官方公开示例或上传自有素材测试；两区可以同时加载。</p>
  </div>
  <div class="mpg-intro-tag">专注 2B 以下轻量模型</div>
</header>

<section class="mpg-workspace" data-mpg-kind="doc" aria-label="文档理解工作区">
  <header class="mpg-workspace-head">
    <p class="mpg-eyebrow">WORKSPACE 01 · DOCUMENT AI</p>
    <h2>▤ 文档理解</h2>
    <p>观察 OCR、版面、表格与公式的结构化解析结果。</p>
  </header>
  <div class="mpg-workspace-body">
    <p class="mpg-label">选择文档模型</p>
    <div class="mpg-models" data-mpg="models" role="group" aria-label="选择文档模型"></div>
    <div class="mpg-test-row">
      <div class="mpg-test-card mpg-public">
        <h3>① 使用官方公开测试素材</h3>
        <p data-mpg="example-intro"></p>
        <div class="mpg-chips" data-mpg="example-chips"></div>
        <p data-mpg="example-howto"></p>
      </div>
      <div class="mpg-test-card">
        <h3>② 上传自己的素材</h3>
        <ul data-mpg="upload-rules"></ul>
        <p class="mpg-advisory" data-mpg="advisory"></p>
      </div>
    </div>
    <div class="mpg-model-heading"><strong data-mpg="title"></strong><span data-mpg="scale"></span></div>
    <div class="mpg-actions">
      <button type="button" class="mpg-primary" data-mpg="start">加载真实演示</button>
      <button type="button" class="mpg-secondary" data-mpg="stop" disabled>收起内嵌演示</button>
      <a data-mpg="external" href="https://huggingface.co/spaces/ibm-granite/granite-docling-258m-demo" target="_blank" rel="noopener noreferrer">在新标签页打开 ↗</a>
    </div>
    <div class="mpg-viewer" data-mpg="viewer">
      <div class="mpg-empty" data-mpg="empty">
        <div class="mpg-empty-icon" aria-hidden="true">▤</div>
        <strong>文档演示尚未加载</strong>
        <p>点击“加载真实演示”，在此显示第三方交互界面；上传与解析在第三方服务中完成。</p>
      </div>
    </div>
    <p class="mpg-state" data-mpg="status" aria-live="polite">尚未加载 · 不消耗外部演示资源</p>
    <div class="mpg-compare"><strong>可重复对比：</strong>将同一张公开授权的文档图片分别提交给两种文档模型，比较文字、表格、公式和阅读顺序。不同演示自带的示例不一定相同。</div>
    <div class="mpg-guide"><strong>学生观察任务</strong><p>先测试公开论文或表格样例，再使用自有图片；记录至少一个正确结果和一个失败案例。</p></div>
  </div>
</section>

<section class="mpg-workspace mpg-video" data-mpg-kind="video" aria-label="视频理解工作区">
  <header class="mpg-workspace-head">
    <p class="mpg-eyebrow">WORKSPACE 02 · VIDEO AI</p>
    <h2>▣ 视频理解</h2>
    <p>观察视频内容描述、动作先后关系与自然语言问答的真实输出。</p>
  </header>
  <div class="mpg-workspace-body">
    <p class="mpg-label">选择视频模型</p>
    <div class="mpg-models" data-mpg="models" role="group" aria-label="选择视频模型"></div>
    <div class="mpg-test-row">
      <div class="mpg-test-card mpg-public">
        <h3>① 使用官方公开测试素材</h3>
        <p data-mpg="example-intro"></p>
        <div class="mpg-chips" data-mpg="example-chips"></div>
        <p data-mpg="example-howto"></p>
      </div>
      <div class="mpg-test-card">
        <h3>② 上传自己的素材</h3>
        <ul data-mpg="upload-rules"></ul>
        <p class="mpg-advisory" data-mpg="advisory"></p>
      </div>
    </div>
    <div class="mpg-model-heading"><strong data-mpg="title"></strong><span data-mpg="scale"></span></div>
    <div class="mpg-actions">
      <button type="button" class="mpg-primary" data-mpg="start">加载真实演示</button>
      <button type="button" class="mpg-secondary" data-mpg="stop" disabled>收起内嵌演示</button>
      <a data-mpg="external" href="https://huggingface.co/spaces/echarlaix/vision-langage-openvino" target="_blank" rel="noopener noreferrer">在新标签页打开 ↗</a>
    </div>
    <div class="mpg-viewer" data-mpg="viewer">
      <div class="mpg-empty" data-mpg="empty">
        <div class="mpg-empty-icon" aria-hidden="true">▣</div>
        <strong>视频演示尚未加载</strong>
        <p>可上传自己准备的授权短视频。当前第三方演示自带示例主要为图像问答，非视频样例。</p>
      </div>
    </div>
    <p class="mpg-state" data-mpg="status" aria-live="polite">尚未加载 · 不消耗外部演示资源</p>
    <div class="mpg-compare"><strong>可重复对比：</strong>使用同一段短视频、同一个问题测试事件描述和动作顺序判断，区分观察到的事实与模型猜测。</div>
    <div class="mpg-guide"><strong>学生观察任务</strong><p>让模型概括事件，再追问“哪个动作先发生”，检验答案是否有原视频证据。</p></div>
  </div>
</section>

<div class="mpg-footnote">
  <strong>真实模型 · 公共样例 · 独立上传 · 按需加载</strong>
  <p>模型在第三方 Hugging Face Spaces 上运行，可能排队、休眠或有匿名配额限制。若嵌入失败，请使用“在新标签页打开”。请勿上传隐私、保密或未经授权的素材。</p>
</div>

</div>

---
hide:
  - toc
---

<div class="mpg" id="model-playground">

<header class="mpg-intro">
  <div>
    <h1>模型演示 <span>Model Playground</span></h1>
    <p>视频理解实验：选择 SmolVLM2 视频语言模型，上传授权短视频，专注观察视频描述、事件顺序与自然语言问答。</p>
  </div>
  <div class="mpg-intro-tag">专注 2B 以下轻量模型</div>
</header>

<section class="mpg-workspace mpg-video" data-mpg-kind="video" aria-label="视频理解工作区">
  <header class="mpg-workspace-head">
    <p class="mpg-eyebrow">WORKSPACE 02 · VIDEO AI</p>
    <h2>▣ 视频理解</h2>
    <p>观察视频内容描述、动作先后关系与自然语言问答的真实输出。</p>
  </header>
  <div class="mpg-workspace-body">
    <p class="mpg-label">选择视频模型</p>
    <div class="mpg-models" data-mpg="models" role="group" aria-label="选择视频模型"></div>
    <details class="mpg-help">
      <summary><span class="mpg-help-caret" aria-hidden="true">▸</span><strong>操作指南</strong><span class="mpg-help-caption">官方公共样例 · 自定义素材上传要求</span></summary>
      <div class="mpg-help-content">
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
      </div>
    </details>
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

    <details class="mpg-help vis-quota-help">
      <summary><span class="mpg-help-caret" aria-hidden="true">▸</span><strong>遇到 ZeroGPU quota exceeded？</strong><span class="mpg-help-caption">查看额度不足或加载失败的解决方法</span></summary>
      <div class="vis-quota-content">
        <p><strong>这是第三方服务资源或配额问题，不一定是模型或你上传的素材有问题。</strong>只有出现 <code>ZeroGPU quota exceeded</code> 时，才表示该演示的免费 GPU 额度不足；其他演示也可能采用 CPU 或普通 GPU 服务。</p>
        <ol>
          <li>点击上方 <strong>“在新标签页打开”</strong>，进入当前模型的官方 Space 页面。在 <a href="https://huggingface.co/login" target="_blank" rel="noopener noreferrer">Hugging Face 官网登录</a>免费账号，再用公开示例或授权素材尝试。</li>
          <li>如果显示 <code>20s requested vs. 0s left</code>，表示本次任务需要 20 秒、当前余额为零。需要等待额度恢复；提示 <code>0:00:00</code> 不保证可立即重试。</li>
          <li>若页面休眠、排队、空白或其他错误，请稍后重试，并留意原演示的状态说明；本站无法代替第三方增加额度。</li>
        </ol>
        <p class="vis-quota-security">不要在本学习中心输入、粘贴或分享个人 Access Token。缩小图片、压缩短视频可减轻处理负担，但无法保证解除配额限制。</p>
        <p class="vis-quota-source">参考：<a href="https://huggingface.co/docs/hub/spaces-zerogpu" target="_blank" rel="noopener noreferrer">Hugging Face ZeroGPU 说明</a></p>
      </div>
    </details>

    <div class="mpg-compare"><strong>可重复对比：</strong>使用同一段短视频、同一个问题测试事件描述和动作顺序判断，区分观察到的事实与模型猜测。</div>
    <div class="mpg-guide"><strong>学生观察任务</strong><p>让模型概括事件，再追问“哪个动作先发生”，检验答案是否有原视频证据。</p></div>
  </div>
</section>

<p class="mpg-state">切换方向：请使用左侧「模型演示」下的文档理解 / 视频理解 / 视觉感知导航。</p>

<div class="mpg-footnote">
  <strong>真实模型 · 公共样例 · 独立上传 · 按需加载</strong>
  <p>模型在第三方 Hugging Face Spaces 上运行，可能排队、休眠或有匿名配额限制。若嵌入失败，请使用“在新标签页打开”。请勿上传隐私、保密或未经授权的素材。</p>
</div>

</div>

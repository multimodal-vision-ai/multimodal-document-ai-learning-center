---
hide:
  - toc
shanshui_scene: 7
---

<div class="mv-self-models" markdown>

<p class="mv-self-models__eyebrow">模型展示</p>

# 自研模型展示

展示实验室正在研发的文档结构化解析与视频行为识别方向。以下为**版式和效果示意**，并非正式模型推理结果。

<div class="mv-self-models__grid" markdown>

<article class="mv-self-models__card" markdown>

<div class="mv-self-models__card-head">
  <span class="mv-self-models__icon" aria-hidden="true">▤</span>
  <div>
    <h2>文档结构化解析模型</h2>
    <p>文字、标题、段落、表格、版面与阅读顺序</p>
  </div>
</div>

<div class="mv-self-models__tags"><span>DocTags</span><span>文档理解</span><span class="mv-self-models__tag--muted">真实样例 · 宣传封面</span></div>

<figure class="mv-self-models__promo-cover">
  <img src="../assets/projects/doctags/document-structure-demo-v13.webp" width="2048" height="990" loading="eager" decoding="async" alt="基于上传的三张原始资料制作的结构化文档解析宣传封面：左侧民事起诉状，中间版面元素定位，右侧 DocTags 输出">
  <figcaption>真实文档样例、版面识别标注与 DocTags 文本的三阶段合成展示；不代表经过独立评测的准确率。</figcaption>
</figure>

[免登录体验｜查看 DocTags 解析样例](../assets/projects/doctags/interactive-demo/index.html){ .md-button .mv-self-models__action }

[使用 Kaggle 免费 GPU｜亲自运行模型](doctags-kaggle/README.md){ .md-button .mv-self-models__action }

[查看文档理解项目与现有视频](document-ai/README.md)

**Kaggle 推理试点说明：** 当前使用 IBM Granite Docling 258M 公开基线验证运行流程，不是实验室自研权重。Notebook 发布并实测后才会提供直接打开的 Kaggle 项目地址。

<div class="mv-self-models__embedded-demo">
  <p><strong>DocTags 解析样例交互演示</strong> <span>已有结果回放 · 非实时推理</span></p>
  <iframe src="../assets/projects/doctags/interactive-demo/index.html" title="DocTags 文档结构化解析交互样例" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-modals allow-popups" width="100%" height="760"></iframe>
  <p class="mv-self-models__embedded-hint">当前为 Learning Center 站内 DEV 演示。Hugging Face Organization 的 Static Space 版本已准备好，待具备组织写权限后发布并替换为真实 Space 嵌入地址。</p>
</div>



</article>

<article class="mv-self-models__card mv-self-models__card--video" markdown>

<div class="mv-self-models__card-head">
  <span class="mv-self-models__icon" aria-hidden="true">▶</span>
  <div>
    <h2>视频行为识别模型</h2>
    <p>面向视频的人物动作识别与分析</p>
  </div>
</div>

<div class="mv-self-models__tags"><span>动作识别</span><span>视频理解</span><span class="mv-self-models__tag--muted">方案示意</span></div>

<div class="mv-self-models__video-preview" aria-label="打电话、玩手机、吃东西三个动作类别的示意"><div class="mv-self-models__action-frame frame-call"><div class="mv-self-models__person" aria-hidden="true"><span>☎</span></div><b>打电话</b><small>动作类别 01</small></div><div class="mv-self-models__action-frame frame-phone"><div class="mv-self-models__person" aria-hidden="true"><span>▯</span></div><b>玩手机</b><small>动作类别 02</small></div><div class="mv-self-models__action-frame frame-eat"><div class="mv-self-models__person" aria-hidden="true"><span>◉</span></div><b>吃东西</b><small>动作类别 03</small></div></div>

[查看视觉理解研究方向](vision-ai/README.md){ .md-button .mv-self-models__action }

</article>

</div>

<div class="mv-self-models__note" markdown>
**展示说明：** 文档卡片使用已提供的真实材料展示既有解析结果；视频卡片仍为方案示意。样例体验不产生新推理，Kaggle 入口提供公开基线的独立 GPU 试运行。尚未部署实验室自研权重，也没有虚构的性能指标。
</div>

[实验室 Hugging Face Organization](https://huggingface.co/multimodal-vision-ai) · [文档理解研究项目](document-ai/README.md) · [学生作品与 Capstone](student-work/README.md)

</div>

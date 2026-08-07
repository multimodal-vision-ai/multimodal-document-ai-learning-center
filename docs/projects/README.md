---
hide:
  - toc
---

<div class="mv-showcase" markdown>

<div class="mv-showcase-hero" markdown>

<p class="mv-showcase-kicker">成果展厅</p>

# 把好奇心做成可验证作品

> **看证据 · 找问题 · 做作品**

<div class="grid cards mv-showcase-principles" markdown>

-   **验证效果**

    追溯结果依据

-   **分析失败**

    发现改进空间

-   **形成问题**

    启动自己的 Capstone

</div>

<div class="mv-showcase-actions" markdown>

[浏览精选项目](#featured-projects){ .md-button .md-button--primary }
[设计自己的 Capstone](#design-capstone){ .md-button }

</div>

</div>

## 选择你的下一次挑战

不必等到掌握全部知识才开始。先选一个足够小、能够验证的问题：

| 挑战 | 从哪里开始 | 试着回答 | 最小作品 |
| --- | --- | --- | --- |
| 文档侦探 | 选择 3 份公开文档 | 模型最容易在哪类版面或表格上失效？ | 失败案例地图 |
| 评测设计者 | 对照两个模型或两种提示词 | 单一分数遗漏了哪些重要差异？ | 指标选择与结论说明 |
| 模型改进者 | 只改变一个可控变量 | 改进来自模型、提示词、数据还是偶然波动？ | 可复现实验报告 |
| 视频探索者 | 选择一段可公开使用的短视频 | 文档中的证据定位如何扩展到时间、事件和连续画面？ | 视频理解任务草案 |

---

## 设计自己的 Capstone { #design-capstone }

Capstone 不是 Week 12 临时开始的新项目，而是从前 11 周已经跑通的 Pipeline、Benchmark、模型实验或论文问题中，选择一个最值得继续追问的方向，整理成完整作品。

### 先用一句话定义选题

> 对于 **[目标场景]**，在固定 **[模型、数据与运行条件]** 的前提下，只改变 **[一个核心变量]**，观察它如何影响 **[目标结果]**；我将用 **[主指标]** 和失败案例判断结果。

例如：

- **文档理解**：固定模型与测试集，只改变 Prompt 的结构约束，观察表格结构完整度和无依据输出。
- **视频理解**：固定模型与短视频样例，只改变采样间隔，观察事件识别与时间证据定位是否一致。

如果一句话里同时出现多个模型、多种数据和多个改进方法，先缩小范围。

### 完成一页 Capstone 设计卡

| 必须回答 | 需要写清楚 | 最小证据 |
| --- | --- | --- |
| 为什么做？ | 真实问题、目标用户或研究价值 | 一句话问题与明确非目标 |
| 从哪里开始？ | 可运行 baseline 与已有工作 | baseline 命令和原始结果 |
| 准备改变什么？ | 唯一核心变量与对照关系 | 实验表或配置 diff |
| 怎样判断？ | 主指标、人工检查和失败类型 | 统一评测与代表性案例 |
| 做到哪里停止？ | 时间、算力、数据和成功标准 | 资源上限与停止条件 |
| 最后怎样表达？ | 结论、限制、复现入口与下一步 | README、Project Card 和演示 |

!!! tip "推荐范围"
    优先选择一个模型、一组固定样例、一个核心变量和一个主指标。先让陌生同学复现一组结果，再考虑扩大模型、数据或任务范围。

### 从已有成果继续，而不是重新开始

- 把[项目 01](../experiments/Experiment_01/README.md)中的 Prompt 对照扩展成更可靠的文档评测；
- 把 Week 8–10 的训练 runs 整理成“方法—效果—成本—失败”决策报告；
- 把 Week 11 的最小论文复现转化为一个受控改进实验；
- 把文档中的空间证据问题迁移到短视频，先形成任务定义和最小 baseline。

完成设计后，对照[Week 12](../learning/00_12_Week_Bootcamp.md#week-12)整理作品，并按[展厅发布清单](#publish-capstone)准备展示。

---

## 精选项目 { #featured-projects }

目前展示两个代表性项目：

- 📄 **Multimodal Document AI**
- 🧠 **Brain-Inspired Adaptive Intelligence**

更多项目将持续更新……

---

## 项目 1｜Multimodal Document AI

### 项目简介

本项目展示基于 **Vision Language Models (VLMs)** 的智能文档理解系统，可自动完成复杂文档的信息解析、理解与问答。

系统具备以下核心能力：

<div class="mv-capability-grid" markdown>

- 📑 OCR Text Recognition
- 📄 Document Parsing
- 📰 Layout Analysis
- 📊 Table Understanding
- 🧾 Structured Information Extraction
- 💬 Document Question Answering
- 🧠 Multimodal Reasoning

</div>

---

### 项目演示

<div class="mv-showcase-video">

<video 
    width="960"
    height="540"
    controls
    preload="metadata">

    <source 
        src="../assets/videos/MVAI-Doc-AI-Demo-V1.0-compressed.mp4"
        type="video/mp4">

    Your browser does not support the video tag.

</video>

</div>

---

### 核心技术

| Technology | Description |
| :--- | :--- |
| 📄 Document AI | 智能文档理解 |
| 👁️ Vision Language Models | 多模态视觉语言模型 |
| 🔍 OCR | 光学字符识别 |
| 📑 Layout Analysis | 文档版面分析 |
| 📊 Table Understanding | 表格理解 |
| 💬 Document QA | 文档智能问答 |

!!! question "如果由你继续"
    - 同一系统面对手写、多语言或超长文档时，失败模式会怎样变化？
    - 一次失败应该通过数据、提示词、模型还是产品交互来改进？
    - 从文档页面走向视频帧序列后，怎样定位答案对应的时间证据？

---

## 项目 2｜Brain-Inspired Adaptive Intelligence

### 项目简介

本项目展示 **Brain-Inspired Adaptive Intelligence** 在自主智能控制与智能交通中的前沿研究，探索类脑神经网络如何赋予智能系统持续学习、自适应决策与复杂环境协同控制能力。

项目融合多种先进 AI 技术，面向机器人、自主系统及智能交通等典型场景，构建面向未来的持续智能决策框架。

典型应用包括：

<div class="mv-capability-grid" markdown>

- 🚁 Autonomous UAV Control
- 🤖 Intelligent Robotics
- 🚗 Autonomous Driving
- 🚦 Cooperative Vehicle-Infrastructure Systems
- 🚙 Highway Ramp Merging
- ⚠️ Collision Warning
- 🌍 Adaptive Intelligent Systems

</div>

---

### 项目演示

<div class="mv-showcase-video">

<video 
    width="960"
    height="540"
    controls
    preload="metadata">

    <source 
        src="../assets/videos/MVAI-LNN-Demo-V1.0-compressed.mp4"
        type="video/mp4">

    Your browser does not support the video tag.

</video>

</div>

---

### 核心技术

| Technology | Description |
| :--- | :--- |
| 🧠 Liquid Neural Networks (LNN) | 液态神经网络，实现动态环境下持续自适应控制 |
| 📡 Wireless Federated Learning | 无线联邦学习，实现多智能体分布式协同学习 |
| 🎯 Deep Reinforcement Learning | 深度强化学习，实现复杂环境下自主决策与控制 |

!!! question "如果由你继续"
    - “自适应”应当用平均性能、极端场景还是长期稳定性来衡量？
    - 系统做出错误决策时，怎样让原因能够被人理解和复核？
    - 视觉与视频理解能否为动态决策提供更可靠的环境证据？

---

## 后续研究方向

未来将持续发布更多科研项目，包括：

| Direction | Description |
| :--- | :--- |
| 👁️ Vision AI | 图像理解、目标检测、多模态视觉推理 |
| 📄 Document AI | OCR、文档解析、知识抽取、文档智能 |
| 🎬 Video Understanding | 时序理解、事件定位、视频问答与多模态推理 |
| 🧠 Brain-Inspired Intelligence | LNN、SNN、持续学习 |
| ⚖️ Legal AI | 智慧司法、法律大模型 |
| 🏥 Medical AI | 医学影像分析与智能诊断 |

---

## 把好奇心变成自己的作品

1. **观察**：从演示中找到一个意外结果或尚未覆盖的场景。
2. **提问**：把“它能不能做”改写为输入、输出和成功标准都明确的问题。
3. **验证**：先完成最小实验，诚实记录有效结果与失败案例。
4. **表达**：说明你做了什么、为什么这样做、证据是什么、下一步去哪里。

!!! success "最好的参观结果"
    离开展厅时，不只是记住一个项目名称，而是带走一个自己愿意验证的问题。

---

## 让你的 Capstone 出现在本页 { #publish-capstone }

### 展示前自主检查

- [ ] 项目仓库提供唯一开始入口，陌生同学能够复现至少一组结果；
- [ ] 数据、模型、代码和媒体素材来源清楚，允许公开展示；
- [ ] 至少展示一项关键结果和一个代表性失败，而不是只放效果截图；
- [ ] 结论能够回到输入、配置、原始输出和评测；
- [ ] 已移除密钥、私人文档、绝对路径和不必要的大文件。

### 在本页增加项目卡

1. 准备项目仓库、Project Card，以及一张封面图或一段简短演示；
2. 将本地媒体放入 `docs/assets/projects/<project-slug>/`，或使用稳定、可公开访问的项目链接；
3. 在下面“学生 Capstone”区域按模板增加项目卡；多个项目作为同一个 `grid cards` 区域中的独立列表项；
4. 在 Windows 本地执行 `mkdocs build --strict`，再人工检查桌面端与窄屏显示；
5. 发起以 `dev` 为目标分支的 PR，确认链接、素材授权与展示效果后再发布。

```markdown
<div class="grid cards" markdown>

-   **项目名称｜一句话成果**

    用一句话说明研究问题，以及作品为什么值得继续了解。

    **研究问题**：……

    **方法与唯一改动**：……

    **关键证据**：……

    **代表性失败与限制**：……

    [项目仓库](REPOSITORY_URL) · [演示或报告](DEMO_OR_REPORT_URL)

</div>
```

## 学生 Capstone { #student-capstones }

!!! info "这里等待第一批可复现作品"
    展厅不按模型大小或最高分选择项目。只要问题清楚、证据可信、限制诚实，并且能够帮助后来者提出更好的问题，就值得在这里展示。

---

<div class="mv-showcase__closing">

<p><strong>下一件作品，可以从你今天带走的问题开始。</strong></p>

<p><a href="#design-capstone">开始设计 Capstone →</a></p>

</div>

</div>

---
hide:
  - toc
---

<div class="mv-home" markdown>

<div class="mv-hero" markdown>

# 多模态视觉AI学习中心

<div class="mv-hero__media">
  <img src="assets/figs/prism_brain_logo_square_animated.svg" width="360" alt="Multimodal Vision AI Learning Center">
  <p><strong>Learn · Build · Measure · Improve · Explain</strong></p>
  <p>从文档理解出发，探索图像、视频与多模态智能</p>
</div>

</div>

<div class="grid cards mv-entry-grid" markdown>

-   **从课程主线开始**

    12 周掌握文档理解、模型评测与可复现研究。

    [进入入门课程 →](learning/README.md)

-   **了解建设团队**

    了解谭国平教授的研究方向、科研工作与人才培养。

    [访问教授官方主页 ↗](https://jszy.hhu.edu.cn/tgp/)

-   **完成第一个研究项目**

    沿七关路线，把数据、推理、评测与报告做成可复现作品。

    [进入项目实战 →](experiments/README.md)

-   **先看一件完整作品**

    从真实演示、证据与失败案例中寻找 Capstone 灵感。

    [参观成果展厅 →](projects/README.md)

</div>

本学习中心由河海大学计算机与软件学院谭国平教授团队建设。当前课程聚焦 **Multimodal Document Understanding**，未来将逐步扩展到 **Video Understanding、Multimodal Reasoning** 与视觉智能应用。

---

## 从这里开始

如果你是第一次进入实验室或首次系统学习 Multimodal Document AI，依次完成三个动作：

1. 打开[入门课程](learning/README.md)，理解 12 周要形成的能力与作品；
2. 查看[每周计划](learning/00_12_Week_Bootcamp.md)，从 Week 1 的最小任务开始；
3. 复制学习记录，并用[自主评估指南](learning/10_Assessment_and_Submission.md)检查证据是否充分。

课程以中文为主，关键术语保留英文；每周建议投入约 24 小时，由学生自主安排主线、探索与复盘，并明确回答：

| 你需要知道什么 | 课程如何回答 |
| --- | --- |
| 学什么？ | 学习目标与官方材料 |
| 做什么？ | 可执行的必做任务 |
| 留下什么？ | 明确的文件与实验证据 |
| 如何自查？ | 自主阶段与证据清单 |
| 下一步是什么？ | 进阶阅读、实验与项目入口 |

## 从当前主线走向未来

| 学习方向 | 现在可以做什么 | 下一步可以追问什么 |
| --- | --- | --- |
| 文档理解 / Document Understanding | OCR、版面、表格、文档问答与结构化解析 | 模型能否理解更长、更复杂、更真实的文档？ |
| 视觉语言模型 / VLM | 图像输入、Prompt、失败分析与小规模后训练 | 模型如何连接视觉证据、语言与推理？ |
| 视频理解 / Video Understanding | 复用 VLM、评测和实验管理能力 | 如何理解时间、事件、动作和长视频上下文？ |
| 多模态智能应用 | 构建可复现 pipeline 与可信 Benchmark | 如何把感知、推理和智能体连接到真实场景？ |

!!! abstract "这里不是终点"
    文档理解是当前课程的训练场。你在这里形成的数据、模型、评测和研究表达能力，可以继续迁移到图像、视频、机器人与行业智能问题。

## 12 周能力路线

| 阶段 | 周次 | 核心成果 |
| --- | --- | --- |
| Reproducible Builder | Week 1–3 | Git/Python 环境、模型调用、AI 辅助编程与验证 |
| Document AI Explorer | Week 4–7 | VLM、文档解析、Dataset 与 Benchmark |
| Model Experimenter | Week 8–10 | LoRA/PEFT、W&B runs、统一评测与消融 |
| Research Communicator | Week 11–12 | 论文复现、Capstone、Model Card 与答辩 |

!!! tip "没有独立 GPU？"
    仍可开始。Week 1–7 可在普通电脑或小规模云端环境完成；Week 8–10 可使用 Kaggle/Colab、小模型和小数据。自主检查关注方法与证据，不比较模型规模。

## 你最终会完成什么

课程结束时，你将拥有一个可以由他人检查和复现的小型研究项目，其中包含：

- 可重建的环境与明确运行入口；
- 授权清晰的数据与固定 test set；
- baseline、改进方法和自动评测；
- AI-assisted coding 使用与人工验证记录；
- LoRA/PEFT 微调配置；
- 至少两个可比较的 W&B runs 与 Report；
- 错误分析、限制、Model Card 和成果展示。

## 按目标继续探索

| 目标 | 入口 | 适合何时进入 |
| --- | --- | --- |
| 查阅基础专题 | [专题学习](learning/README.md) | 完成对应周次任务时 |
| 跟做一个短时可运行案例 | [动手教程](tutorials/README.md) | Week 2 以后，需要代码参考时 |
| 完成端到端研究作品 | [项目实战](experiments/README.md) | Week 4 以后，准备连续投入时 |
| 阅读论文与综述 | [论文导读](reading/README.md) | Week 4 以后 |
| 查找官方来源 | [官方文档与平台](resources/official-sources.md) | 遇到版本或 API 问题时 |
| 查看往期成果 | [成果展厅](projects/README.md) | 设计 Capstone 时 |

## 学习原则

### Official First

技术细节优先链接模型、框架和数据集的官方文档。课程页面负责说明学习路线、任务和自主检查，不重复维护容易过时的长篇 API 教程。

### Evidence First

“运行成功”只是起点。结论必须能够追溯到输入、版本、配置、原始输出、指标与失败案例。

### Responsible AI

不提交密钥、隐私数据或未授权材料；披露 AI 的参与范围；对 AI 生成代码与模型输出进行人工验证。

---

<div class="mv-home__closing">
  <p><strong>准备好了吗？从 Week 1 建立你的第一份可复现实验证据。</strong></p>
  <p><a href="learning/">进入课程 →</a></p>
  <p>
    👥 Visitors <span id="visitor-count">—</span>
    &nbsp;·&nbsp; ⭐ Stars <span id="github-stars">—</span>
    &nbsp;·&nbsp; 🍴 Forks <span id="github-forks">—</span>
  </p>
</div>

最后更新：2026-08-07

</div>

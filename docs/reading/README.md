# 论文导读：从综述到可复现问题

本区用于建立研究背景、定位代表性工作并形成可验证问题。建议先读综述和任务定义，再进入模型论文与 Benchmark；不要从“最新、最大”的模型开始无目的浏览。

[从综述地图开始](00_surveys.md){ .md-button .md-button--primary }
[直接查看评测基准](05_benchmark-2026.md){ .md-button }

!!! info "与 12 周课程的关系"
    Week 4–7 用本区补充 VLM、Document AI 与 Benchmark 背景；Week 11 再选择一篇有官方代码和公开数据的论文做小规模复现。

## 按问题选择阅读入口

| 你要解决的问题 | 推荐入口 | 建议周次 | 阅读后的产出 |
| --- | --- | --- | --- |
| 这个领域有哪些主要方向和开放问题？ | [综述地图](00_surveys.md) | Week 4 或 Week 11 | 研究地图与 3 个问题 |
| Transformer、ViT、CLIP 等基础从哪里来？ | [基础模型](01_foundation.md) | Week 2–4 | 概念关系图 |
| OCR、layout、table、Document QA 有何区别？ | [文档智能](02_document-ai.md) | Week 5 | 任务—输入—输出—指标表 |
| VLM 如何连接视觉与语言，又会怎样失败？ | [视觉语言模型](03_vlm.md) | Week 4–5 | 模型对比与 failure taxonomy |
| DocTags、Docling 与结构化文档表示是什么？ | [DocTags 与结构化文档](04_doctags.md) | Week 6 | 表示方式与 pipeline 对比 |
| 应该用哪个数据集和指标验证主张？ | [评测基准](05_benchmark-2026.md) | Week 7–11 | Benchmark 选择理由 |

## 推荐阅读顺序

```text
综述：确定任务边界与关键词
        ↓
基础模型：补足必要概念
        ↓
Document AI / VLM：理解方法与主张
        ↓
DocTags / Docling：连接结构化文档实践
        ↓
Benchmark：检查证据是否支持主张
        ↓
Week 11：选择一项可缩小复现的工作
```

## 每篇论文至少回答六个问题

1. 研究问题是什么，明确的非目标是什么？
2. 方法相对 baseline 只改变了什么？
3. 数据来源、划分、许可和潜在偏差是什么？
4. 主指标是否真的对应研究问题？
5. 哪个消融或失败案例最能支持或削弱主张？
6. 在你的资源上，哪一个最小主张可以被复现？

## 阅读记录模板

```markdown
# Paper Note
- Paper / version / official URL：
- 一句话研究问题：
- 方法的关键改动：
- 数据与评测：
- 最有说服力的证据：
- 一个限制或失败案例：
- 事实、作者解释与我的推测：
- 可在本课程中复现的最小主张：
- 预计资源与成功标准：
```

!!! warning "优先原始来源"
    论文事实以正式论文或 arXiv 原文、作者官方项目和数据集主页为准。博客和视频可用于理解，但不替代原始引用。

## 下一步

需要直接运行代码时进入[动手教程](../tutorials/README.md)；准备完成跨阶段作品时进入[项目实战](../experiments/README.md)；Week 11 的提交标准见[12 周路线](../learning/00_12_Week_Bootcamp.md#week-11)。

最后更新：2026-08-07

---
hide:
  - toc
shanshui_scene: 7
---

<div class="mv-showcase" markdown>

# 视频行为识别与分析

面向视频中的人物动作识别、连续行为分析与多模型能力比较。

<a class="md-button md-button--primary" href="../../assets/projects/video-action/browser-inference/index.html" target="_blank" rel="noopener noreferrer">打开浏览器端实验平台 ↗</a>

## 当前实验平台

当前版本 V1.0.15 提供浏览器端实拍视频演示与本地推理，包含：

- **A类 · 日常行为：**挥手、用手机、摔倒、吃东西、睡觉、抽烟。
- **B类 · 共同动作：**慢跑、瑜伽、俯卧撑、仰卧起坐、芭蕾舞、呼啦圈。
- **主要人物定位：**先定位并跟踪画面中的主要人物，再将人物区域提供给动作模型。
- **多模型对比：**MoViNet-A0/A1/A2、Qualcomm VideoMAE、Apple MobileCLIP-S0/S2；支持逐个运行、保存结果并选择模型比较。
- **连续分析：**MoViNet 流式分类与时间轴；VideoMAE、MobileCLIP 按连续视频片段输出预测。

## 结果解释边界

本平台是公开模型基线的浏览器端实验与对比平台。样例用于流程验证和能力观察，标记为 development-only，不构成正式 benchmark，也不能据此宣称模型达到特定准确率。MobileCLIP 属于图文语义匹配方法，不等同于视频时序动作分类模型。

## 后续自研方向

独立的 **Our Solution** 将作为下一阶段研发任务：在保留当前模型和比较流程的前提下，设计一条不同的推理链路，重点研究“用手机”和“抽烟”等细粒度行为的可靠区分。自研模型尚未在本版本中实现或发布。

[返回自研模型展示](../README.md)

</div>

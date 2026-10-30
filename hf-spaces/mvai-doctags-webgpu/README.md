---
title: MVAI DocTags Browser Inference
emoji: 📄
colorFrom: blue
colorTo: indigo
sdk: static
app_file: index.html
pinned: false
license: apache-2.0
---

# DocTags 浏览器推理技术预览

本 Space 使用 IBM Granite Docling 258M 的 ONNX 公开权重、Transformers.js 与浏览器 WebGPU。
不是实验室自研权重，不依赖 Hugging Face 托管 GPU，不需要用户登录。
默认输入为无个人信息的合成页面。第一次加载时需主动点击，浏览器可能下载约 1GB 或更多权重。
设备兼容性、中文解析和输出准确率尚未完成完整验收；只在开发预览中使用。

---
hide:
  - toc
---

# 浏览器端实时 DocTags 推理 · 技术预览

这个试点使用 **IBM Granite Docling 258M ONNX 公开基线**，由访问者自己的 WebGPU 执行实际推理，不需要登录或使用实验室服务器。浏览器、GPU 和推理质量尚未经过完整设备验收。

[打开浏览器端推理实验](../../assets/projects/doctags/browser-inference/index.html){ .md-button .md-button--primary }

## 使用流程

1. 用支持 WebGPU 的桌面版 Chrome 或 Edge 打开实验页；先使用无个人信息的合成样例。
2. 在检测到 WebGPU 后手动点击 **加载模型**；首次访问可能下载约 1 GB 或更多权重。
3. 点击 **开始真正推理**。产生结果后查看 DocTags、图片上的位置标注，按需下载文件。
4. 上传自己的 PNG、JPG 或 WebP 单页图片时，务必提前脱敏。
5. GPU 不支持、模型加载失败或中文内容解析不佳时，使用 [Kaggle 个人 GPU 试点](../doctags-kaggle/README.md)，或者 [免登录查看已有解析样例](../../assets/projects/doctags/interactive-demo/index.html)。

!!! warning "技术预览，不是正式模型评测"
    页面使用 IBM 公开基线模型而非实验室自研权重。客户端模型加载及推理基于公开的 Transformers.js 接口，实现代码已经提交，但尚未在真实 WebGPU 设备上完成端到端验收。不能把页面出现和下载模型的能力当作推理已经成功的证明。

## 接入 HF Organization

与此页面相同的可部署源码位于仓库的 hf-spaces/mvai-doctags-webgpu 目录。Organization 创建 **Static Space** 后上传 README.md 与 index.html 即可部署。不需要 HF 付费 GPU。

[返回成果展厅](../README.md)

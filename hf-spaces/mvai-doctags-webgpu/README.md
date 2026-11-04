---
title: MVAI Document Parsing DocTags Lab
emoji: 📄
colorFrom: blue
colorTo: indigo
sdk: static
app_file: index.html
pinned: false
license: apache-2.0
---

# DocTags 浏览器推理技术预览

本 Space 定位为可扩展的文档结构化解析与多模型对比平台。当前内置 IBM Granite Docling 258M ONNX 公开基线，以及DocTags OvisOCR3 0.8B v1.0 ONNX 自研模型。R3 使用独立适配器、Transformers.js 4.4.0-next.0 与 ONNX Runtime Web 1.31.1；浏览器通过 WebGPU 本地推理。
推理在访问者本机浏览器执行，不依赖 Hugging Face 托管 GPU，不需要用户登录。
九类原始 PNG/JPEG 演示图片由 IBM Granite Docling 官方 DEMO 镜像至本站 `samples/` 目录；不再反复请求官方服务器。首次加载模型可能下载 1 GB 或更多权重。
R3 首次下载约 2.52 GB，需要支持 `shader-f16` 的 WebGPU。已在 Chrome 157 / NVIDIA A800 80GB 完成合成短页端到端验证；其他设备尚需实测。完整三榜尚未在 ONNX 浏览器版本上重跑，不能将原模型分数视为 ONNX 版本的独立评测成绩。

## V1.6 结构化结果对照

完成 WebGPU 推理后，新增原图与结构化阅读结果的并排展示。解析 DocTags 中的标题、段落与 OTSL 表格、对应位置框；原始标签置于折叠栏。内容并非像素级原稿复刻，复杂合并表格或截断输出需人工核对。

上传时必须将 `index.html` 和 `doctags-renderer.js` 放在 Space 仓库根目录，与 `README.md` 同级；仅上传 HTML 将无法渲染结果。

## V1.7 多模型与本地缓存

- 内置 Granite Docling 258M 公开基线与DocTags OvisOCR3 0.8B v1.0 · 自研模型；允许登记其他公开、兼容的 DocTags ONNX 权重，并非任意 Hugging Face 模型均可加载。
- R3 使用 `adapters/r3-ovisocr3/` 中独立的 Transformers.js 4.4.0-next.0 / ONNX Runtime Web 1.31.1 适配器；其视觉计算为 FP32、文字生成与词嵌入为 FP16，要求 WebGPU `shader-f16`。
- 浏览器 Cache API 缓存模型文件（浏览器可自动清理），单模型占用 GPU 显存，切换时尝试释放旧模型；刷新后需重新初始化。
- 同一图片内保留不同模型或不同精度的实际推理结果，A/B 并排渲染比较。私人文档及推理结果不会被本应用持久保存。
- HF Space 根目录包含 README.md、index.html、doctags-renderer.js、model-registry.js；R3 专用适配器位于 `adapters/r3-ovisocr3/`，部署时必须保留该目录及其中的 `adapter.mjs`、`contract.mjs`。

## V1.7.2 体验改进

推理完成后状态栏呈现模型参数规模（IBM 公开基线 258M 参数；河海 R3 自研模型 0.8B 参数）和本次推理时长。05 多模型结果对比支持可选的 A/B 双向按比例同步滚动，不代表语义段落精准对齐。

## V1.7.3 顶部信息结构

页面主标题统一为 **实时文档结构化解析-DocTags**。多模型平台定位和当前公开基线来源只在标题旁的 ⓘ 帮助提示中展示；支持鼠标悬停、点击和键盘聚焦，避免把当前 IBM 基线写成平台唯一支持模型。


## V1.9 本地样例图库

页面包含九类 IBM Granite Docling 官方演示文档：整页文档、表格、代码、图像、公式、图表、阿拉伯语、日语和中文文档，均为 PNG/JPEG 格式，保存在 `samples/` 中。从本站加载并送入 Canvas，切换示例时清空上一文档的推理结果和 A/B 对比历史。

图片来源：[IBM Granite Docling Demo](https://huggingface.co/spaces/ibm-granite/granite-docling-258m-demo/tree/main/data/images)，原项目 [Apache-2.0](https://huggingface.co/spaces/ibm-granite/granite-docling-258m-demo/blob/main/README.md)。图像如包含其他权利人的内容，仍以原始素材许可为准。所有样例仅用于本平台科研展示与测试，不代表实验室自研模型性能。
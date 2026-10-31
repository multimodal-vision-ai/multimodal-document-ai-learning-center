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

本 Space 定位为可扩展的文档结构化解析与多模型对比平台。当前使用 IBM Granite Docling 258M 的 ONNX 公开权重、Transformers.js 与浏览器 WebGPU；未来可接入经过适配与验证的实验室自研模型。
不是实验室自研权重，不依赖 Hugging Face 托管 GPU，不需要用户登录。
默认尝试从 IBM Granite Docling 官方 DEMO 加载九类公开样例（只引用官方源文件，不在 MVAI 仓库复制其原始图片；需联网及支持跨域读取）。额外保留离线生成的合成样例。第一次加载模型时需主动点击，浏览器可能下载约 1GB 或更多权重。
设备兼容性、中文解析和输出准确率尚未完成完整验收；只在开发预览中使用。

## V1.6 结构化结果对照

完成 WebGPU 推理后，新增原图与结构化阅读结果的并排展示。解析 DocTags 中的标题、段落与 OTSL 表格、对应位置框；原始标签置于折叠栏。内容并非像素级原稿复刻，复杂合并表格或截断输出需人工核对。

上传时必须将 `index.html` 和 `doctags-renderer.js` 放在 Space 仓库根目录，与 `README.md` 同级；仅上传 HTML 将无法渲染结果。

## V1.7 多模型与本地缓存

- 内置 Granite Docling 258M 公开基线，允许登记未来公开、兼容的 DocTags ONNX 权重；并非任意 Hugging Face 模型均可加载。
- 浏览器 Cache API 缓存模型文件（浏览器可自动清理），单模型占用 GPU 显存，切换时尝试释放旧模型；刷新后需重新初始化。
- 同一图片内保留不同模型或不同精度的实际推理结果，A/B 并排渲染比较。私人文档及推理结果不会被本应用持久保存。
- HF Space 部署的四份文件：README.md、index.html、doctags-renderer.js、model-registry.js，均放在 Space 仓库根目录。

## V1.7.2 体验改进

推理完成后状态栏呈现模型参数规模（内置 IBM 模型 258M 参数）和本次推理时长。05 多模型结果对比支持可选的 A/B 双向按比例同步滚动，不代表语义段落精准对齐。

## V1.7.3 顶部信息结构

页面主标题统一为 **实时文档结构化解析-DocTags**。多模型平台定位和当前公开基线来源只在标题旁的 ⓘ 帮助提示中展示；支持鼠标悬停、点击和键盘聚焦，避免把当前 IBM 基线写成平台唯一支持模型。


## V1.9 官方样例图库

文档输入区提供 IBM Granite Docling 官方 [DEMO](https://huggingface.co/spaces/ibm-granite/granite-docling-258m-demo) 的 9 个样例入口，涵盖整页文档、表格、代码、图片、公式、图表及阿拉伯语、日语、中文。缩略图与原始图片均引用上游链接；使用者切换文档时清除上一张文档的解析结果与 A/B 历史。统一使用本平台当前的整页 DocTags 推理提示，不声称复现官方各专项提示词的结果。浏览器如果拒绝跨域读取，页面将显示错误并可改用上传或离线合成样例。原始样例可能含第三方来源，不在本仓库再分发。
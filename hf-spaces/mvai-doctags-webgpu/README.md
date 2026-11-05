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

本 Space 定位为可扩展的文档结构化解析与多模型对比平台。当前内置 IBM Granite Docling 258M ONNX 公开基线、MVAI-DocTags-DJX-0.8B-v1.0 ONNX 自研模型（基于 OvisOCR3）和 MVAI-DocTags-WC-2B-v1.0 ONNX 自研模型（基于 Qwen3.5）。两款自研模型使用独立适配器、Transformers.js 4.4.0-next.0 与 ONNX Runtime Web 1.31.1；浏览器通过 WebGPU 本地推理。
推理在访问者本机浏览器执行，不依赖 Hugging Face 托管 GPU，不需要用户登录。
九类原始 PNG/JPEG 演示图片由 IBM Granite Docling 官方 DEMO 镜像至本站 `samples/` 目录；内置样例优先通过 CORS 请求读取为 Blob；raw.githack CDN 重定向失败时回退到 raw.githubusercontent.com，本地上传则直接保留原始 File，两款自研模型均从原始 Blob 解码，避免将跨域污染的 Canvas 导出为 PNG。Canvas 仅用于页面预览与标注显示。首次加载 DJX-0.8B 约下载 2.52 GB，WC-2B 约下载 6.2 GB。
DJX-0.8B 首次下载约 2.52 GB，WC-2B 首次下载约 6.2 GB，均需要支持 `shader-f16` 的 WebGPU。两者已在 Chrome 157 / NVIDIA A800 80GB 完成合成短页端到端验证；其他设备尚需实测。尚未完成完整 OCR benchmark、长页和复杂表格评测，不能将单张合成图片结果视为完整准确率证明。

## V1.6 结构化结果对照

完成 WebGPU 推理后，新增原图与结构化阅读结果的并排展示。解析 DocTags 中的标题、段落与 OTSL 表格、对应位置框；原始标签置于折叠栏。内容并非像素级原稿复刻，复杂合并表格或截断输出需人工核对。

上传时必须将 `index.html` 和 `doctags-renderer.js` 放在 Space 仓库根目录，与 `README.md` 同级；仅上传 HTML 将无法渲染结果。

## V1.7 多模型与本地缓存

- 内置 Granite Docling 258M 公开基线、MVAI-DocTags-DJX-0.8B-v1.0 · 自研模型和 MVAI-DocTags-WC-2B-v1.0 · 自研模型；允许登记其他公开、兼容的 DocTags ONNX 权重，并非任意 Hugging Face 模型均可加载。
- DJX-0.8B 使用 `adapters/r3-ovisocr3/`，WC-2B 使用 `adapters/wang-qwen35-2b/`，分别通过独立适配器加载；两者的视觉计算为 FP32、词嵌入与文字生成 FP16，要求 WebGPU `shader-f16`。
- 浏览器 Cache API 显式缓存模型权重和 ONNX Runtime WASM 文件（浏览器仍可能自动清理），保留默认缓存键以复用已有下载；单模型占用 GPU 显存，切换时尝试释放旧模型；刷新后需重新初始化。下载状态使用 Transformers.js v4 的 `progress_total` 显示综合进度、MB/s 和预计剩余时间。首次下载速度仍取决于访问者到 Hugging Face CDN 的实际网络路径；如需明显提高首次下载速度，应另行部署并验收区域 CDN 镜像。
- 同一图片内保留不同模型或不同精度的实际推理结果，A/B 并排渲染比较。私人文档及推理结果不会被本应用持久保存。
- **人工终止推理：** 推理过程中可以点击“终止推理”请求停止当前生成。已生成的部分输出会保留并标记为不完整，不计入 A/B 对比历史；模型仍保持加载，可重新运行。该操作为协作式中断，若浏览器 GPU 线程完全卡死，可能仍需刷新页面。
- HF Space 根目录包含 README.md、index.html、doctags-renderer.js、model-registry.js；部署时必须同时保留 `adapters/r3-ovisocr3/` 和 `adapters/wang-qwen35-2b/` 两个目录及其中的 `adapter.mjs`、`contract.mjs`。

## V1.7.2 体验改进

推理完成后状态栏呈现模型参数规模（IBM 公开基线 258M 参数；DJX 自研模型 0.8B 参数；WC 自研模型 2.2B 参数）和本次推理时长。05 多模型结果对比支持可选的 A/B 双向按比例同步滚动，不代表语义段落精准对齐。

## V1.7.3 顶部信息结构

页面主标题统一为 **实时文档结构化解析-DocTags**。多模型平台定位和当前公开基线来源只在标题旁的 ⓘ 帮助提示中展示；支持鼠标悬停、点击和键盘聚焦，避免把当前 IBM 基线写成平台唯一支持模型。


## V1.9 本地样例图库

页面包含九类 IBM Granite Docling 官方演示文档：整页文档、表格、代码、图像、公式、图表、阿拉伯语、日语和中文文档，均为 PNG/JPEG 格式，保存在 `samples/` 中。从本站同源读取为 Blob 并绘制到 Canvas 预览；DJX-0.8B 与 WC-2B 推理均直接读取 Blob，不再调用 `canvas.toBlob()`。切换示例时清空上一文档的推理结果和 A/B 对比历史。

图片来源：[IBM Granite Docling Demo](https://huggingface.co/spaces/ibm-granite/granite-docling-258m-demo/tree/main/data/images)，原项目 [Apache-2.0](https://huggingface.co/spaces/ibm-granite/granite-docling-258m-demo/blob/main/README.md)。图像如包含其他权利人的内容，仍以原始素材许可为准。所有样例仅用于本平台科研展示与测试，不代表实验室自研模型性能。

## V1.10 缓存清理与 CDN 恢复

- 九类样例缩略图改为复用 CORS-aware Blob 加载器，与主预览使用相同的 raw.githack / raw.githubusercontent.com 回退逻辑，避免浏览器清理缓存后直接图片请求显示破图。
- DJX-0.8B 与 WC-2B 的 ONNX Runtime WebGPU 和 Transformers.js 使用版本锁定的多 CDN 回退：jsDelivr、Gcore、Fastly、TestingCF。WASM 文件目录自动跟随成功加载的 ONNX Runtime 镜像。
- 浏览器缓存清理后，模型权重仍需重新下载；运行时脚本和样例图片会自动重新获取。所有镜像均不可访问时，界面会显示明确的 CDN 网络诊断。

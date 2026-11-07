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

本 Space 定位为可扩展的文档结构化解析与多模型对比平台。当前内置五款模型：IBM Granite Docling 258M ONNX 公开基线、官方 OvisOCR3 0.8B 原生 Structured 模型、PaddleOCR-VL-1.6 0.9B 原生模型，以及 MVAI-DocTags-DJX-0.8B-v1.0 和 MVAI-DocTags-WC-2B-v1.0 两款自研 DocTags 模型。OvisOCR3 与 PaddleOCR-VL-1.6 使用独立适配器，保留各自原生 JSON 输出；Granite、DJX 和 WC 继续使用 DocTags 输出。所有模型均在访问者本机浏览器执行，不依赖 HF 托管 GPU。
推理在访问者本机浏览器执行，不依赖 Hugging Face 托管 GPU，不需要用户登录。
九类原始 PNG/JPEG 演示图片由 IBM Granite Docling 官方 DEMO 镜像至本站 `samples/` 目录；内置样例优先通过 CORS 请求读取为 Blob；raw.githack CDN 重定向失败时回退到 raw.githubusercontent.com，本地上传则直接保留原始 File，两款自研模型均从原始 Blob 解码，避免将跨域污染的 Canvas 导出为 PNG。Canvas 仅用于页面预览与标注显示。首次加载 DJX-0.8B 约下载 2.52 GB，WC-2B 约下载 6.2 GB，PaddleOCR-VL-1.6 约下载 2.11 GB；OvisOCR3 需下载其固定 ONNX bundle。
DJX-0.8B 和 WC-2B 已在 Chrome 157 / NVIDIA A800 80GB 完成合成短页端到端验证；OvisOCR3 和 PaddleOCR-VL-1.6 已在 Chrome 155 / NVIDIA RTX 3080 10GB 完成实际浏览器推理及人工结果验收。上述验收不等于完整 OCR benchmark、长页或复杂表格评测，不能将单次成功结果视为跨设备准确率证明。

## V1.6 结构化结果对照

完成 WebGPU 推理后，原图与结构化阅读结果并排展示。Granite/DJX/WC 根据 DocTags 中的标题、段落与 OTSL 表格重建阅读视图；OvisOCR3 和 PaddleOCR-VL-1.6 分别使用原生 Structured JSON 与 parsing_res_list/OTSL 渲染。原始标签/JSON 置于折叠栏。内容并非像素级原稿复刻，复杂合并表格或截断输出需人工核对。

上传时必须将 `index.html` 和 `doctags-renderer.js` 放在 Space 仓库根目录，与 `README.md` 同级；仅上传 HTML 将无法渲染结果。

## V1.7 多模型与本地缓存

- 内置 Granite Docling 258M、OvisOCR3 0.8B、PaddleOCR-VL-1.6 0.9B、MVAI-DocTags-DJX-0.8B-v1.0 和 MVAI-DocTags-WC-2B-v1.0 五款模型；允许另行登记公开且兼容的 DocTags ONNX 权重，并非任意 Hugging Face 模型均可加载。
- DJX-0.8B 使用 `adapters/r3-ovisocr3/`，WC-2B 使用 `adapters/wang-qwen35-2b/`，分别通过独立适配器加载；两者的视觉计算为 FP32、词嵌入与文字生成 FP16，要求 WebGPU `shader-f16`。
- 浏览器 Cache API 显式缓存模型权重和 ONNX Runtime WASM 文件（浏览器仍可能自动清理），保留默认缓存键以复用已有下载；单模型占用 GPU 显存，切换时尝试释放旧模型；刷新后需重新初始化。下载状态使用 Transformers.js v4 的 `progress_total` 显示综合进度、MB/s 和预计剩余时间。首次下载速度仍取决于访问者到 Hugging Face CDN 的实际网络路径；如需明显提高首次下载速度，应另行部署并验收区域 CDN 镜像。
- 同一图片内保留不同模型或不同精度的实际推理结果，A/B 并排渲染比较。私人文档及推理结果不会被本应用持久保存。
- **人工终止推理：** 推理过程中可以点击“终止推理”请求停止当前生成。已生成的部分输出会保留并标记为不完整，不计入 A/B 对比历史；模型仍保持加载，可重新运行。该操作为协作式中断，若浏览器 GPU 线程完全卡死，可能仍需刷新页面。
- HF Space 根目录包含 README.md、index.html、doctags-renderer.js、model-registry.js、native-document-output.js 和 native-result-renderer.js；部署时必须保留 adapters/r3-ovisocr3/、adapters/wang-qwen35-2b/、adapters/ovisocr3-native/、adapters/paddleocr-vl-1.6/ 及 vendor/ppdoclayoutv3/ 资源目录。

## V1.7.2 体验改进

推理完成后状态栏呈现模型参数规模（IBM 公开基线 258M；OvisOCR3 0.8B；PaddleOCR-VL-1.6 0.9B；DJX 0.8B；WC 2.2B）和本次推理时长。05 多模型结果对比支持可选的 A/B 双向按比例同步滚动，不代表语义段落精准对齐。

## V1.7.3 顶部信息结构

页面主标题统一为 **实时文档结构化解析-DocTags**。多模型平台定位和当前公开基线来源只在标题旁的 ⓘ 帮助提示中展示；支持鼠标悬停、点击和键盘聚焦，避免把当前 IBM 基线写成平台唯一支持模型。


## V1.9 本地样例图库

页面包含九类 IBM Granite Docling 官方演示文档：整页文档、表格、代码、图像、公式、图表、阿拉伯语、日语和中文文档，均为 PNG/JPEG 格式，保存在 `samples/` 中。从本站同源读取为 Blob 并绘制到 Canvas 预览；DJX-0.8B 与 WC-2B 推理均直接读取 Blob，不再调用 `canvas.toBlob()`。切换示例时清空上一文档的推理结果和 A/B 对比历史。

图片来源：[IBM Granite Docling Demo](https://huggingface.co/spaces/ibm-granite/granite-docling-258m-demo/tree/main/data/images)，原项目 [Apache-2.0](https://huggingface.co/spaces/ibm-granite/granite-docling-258m-demo/blob/main/README.md)。图像如包含其他权利人的内容，仍以原始素材许可为准。所有样例仅用于本平台科研展示与测试，不代表实验室自研模型性能。

## OvisOCR3 与 PaddleOCR-VL-1.6 原生模型集成

两款模型已通过独立浏览器 WebGPU 验收，并已接入本 Space 的正式模型选择界面。它们不转换为 DocTags，原始 JSON 可在“04 · 模型原始输出与技术诊断”下载；结构化阅读视图和位置框由对应的原生解析器/渲染器生成。

### OvisOCR3 0.8B

- 官方源模型：ATH-MaaS/OvisOCR3，固定源 revision 17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90。
- 浏览器 ONNX bundle：multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX，固定 bundle commit de391cb93aa2ee1b67692bdba1b143bf8e4a9f98。
- 运行时：Transformers.js 4.4.0-next.0 + ONNX Runtime Web 1.31.1；Vision Encoder FP32，Embedding/Decoder FP16；浏览器 WebGPU shader-f16，不提供 CPU 回退。
- 默认输入像素上限为 1024²。原生 Structured 输出为 JSON 数组，每个元素包含 bbox/category/content；bbox 为相对输入图像的 0–1000 归一化坐标。表格保留 HTML，公式保留 LaTeX。
- 已在 Chrome 155 / NVIDIA RTX 3080 10GB 完成实际浏览器推理和人工结构化解析验收。一次 1024² 性能记录为 1458 tokens、34.61 秒、42.82 tokens/s；该数值是单次实测，不代表跨设备性能保证。

### PaddleOCR-VL-1.6 0.9B

- 官方源模型：PaddlePaddle/PaddleOCR-VL-1.6。
- 浏览器 VLM：glebkudr/PaddleOCR-VL-1.6-WebGPU，固定 revision 5219606297d00bbd23b2ec193271af0c0b427dfc；模型资源约 2.11 GB。
- 版面检测：PP-DocLayoutV3 1.2.0 FP16；Worker 以同源静态资源提供，位于 vendor/ppdoclayoutv3/。VLM 和版面检测均要求 WebGPU FP16，不允许静默回退到 CPU/WASM。
- 输出保留原生 parsing_res_list、原图像素坐标及 OTSL 表格标记。渲染器将 OTSL 还原为表格阅读视图，但原始 block_content 和 JSON 不被改写。
- 已在 Chrome 155 / NVIDIA RTX 3080 10GB 完成实际浏览器解析与版面还原人工验收。当前 VLM 引擎和模型资源仍使用固定版本的外部 CDN；PP-DocLayoutV3 Worker 已本地托管。

### 集成行为

- 模型选择界面中新增 OvisOCR3 和 PaddleOCR-VL-1.6；原 Granite、DJX、WC 模型的推理适配器和 DocTags 输出流程保持不变。
- OvisOCR3 使用固定 ONNX bundle commit；PaddleOCR-VL-1.6 使用固定浏览器模型 revision，避免上游 main 更新改变当前展示行为。
- 03 区按各自原生坐标绘制定位框；右侧阅读视图按原生输出重建。悬停/点击结构块可定位到原图区域。
- 05 区 A/B 历史支持 DocTags、Ovis Structured JSON 和 Paddle parsing_res_list 三种输出类型；比较历史只保存在当前页面会话内。
- 下载按钮对原生模型输出 .json，对 DocTags 模型仍下载 .dt；不将原生结果伪装成 DocTags。
- 首次加载需要下载模型资源，后续可复用浏览器缓存。切换模型时先释放当前 GPU 实例，再加载目标模型。

## V1.10 缓存清理与 CDN 恢复

- 九类样例缩略图改为复用 CORS-aware Blob 加载器，与主预览使用相同的 raw.githack / raw.githubusercontent.com 回退逻辑，避免浏览器清理缓存后直接图片请求显示破图。
- DJX-0.8B 与 WC-2B 的 ONNX Runtime WebGPU 和 Transformers.js 使用版本锁定的多 CDN 回退：jsDelivr、Gcore、Fastly、TestingCF。WASM 文件目录自动跟随成功加载的 ONNX Runtime 镜像。
- 浏览器缓存清理后，模型权重仍需重新下载；运行时脚本和样例图片会自动重新获取。所有镜像均不可访问时，界面会显示明确的 CDN 网络诊断。

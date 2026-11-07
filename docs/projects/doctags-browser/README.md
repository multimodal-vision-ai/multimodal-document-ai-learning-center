---
hide:
  - toc
---

# 实时文档结构化解析-DocTags · 多模型技术预览

这是一个可扩展的文档结构化解析与多模型对比实验平台：可针对同一输入文档切换经过适配的兼容模型，查看原生结构化输出、版面位置及阅读视图，进行 A/B 对比。当前内置 **IBM Granite Docling 258M**、**OvisOCR3 0.8B**、**PaddleOCR-VL-1.6 0.9B**、**MVAI-DocTags-DJX-0.8B-v1.0** 和 **MVAI-DocTags-WC-2B-v1.0** 五款模型。Granite/DJX/WC 使用 DocTags；OvisOCR3 和 PaddleOCR-VL-1.6 保留各自原生 JSON 格式，不强制转换为 DocTags。所有模型均在访问者本机浏览器使用 WebGPU 推理。

[打开浏览器端推理实验](../../assets/projects/doctags/browser-inference/index.html){ .md-button .md-button--primary }

## V1.7 多模型使用与缓存说明

**一张文档、多模型顺序推理：** 在“02 · WebGPU 推理”中选择模型，点击“加载所选模型”，然后运行。切换另一模型后继续使用相同输入；“05 · 多模型结果对比”会保存当前页面内同一图片的两次完整推理输出，选择 A/B 分别显示结构化重建结果。Granite 支持 fp32/q4 配置；R3 使用固定混合精度（视觉 FP32、文字 FP16），不提供 q4 切换。不同精度不等于不同模型。

**DJX-0.8B 自研模型：** 选择“MVAI-DocTags-DJX-0.8B-v1.0 · 自研”。模型约下载 2.52 GB，使用 Transformers.js 4.4.0-next.0 与 ONNX Runtime Web 1.31.1，需要支持 `shader-f16` 的 WebGPU。已在 Chrome 157 / NVIDIA A800 80GB 完成合成短页端到端测试；其他设备仍需实测。模型仓库：[DJX-0.8B ONNX](https://huggingface.co/multimodal-vision-ai/R3-OvisOCR3-DocTags-0.8B-ONNX)。

**WC-2B 自研模型：** 选择“MVAI-DocTags-WC-2B-v1.0 · 自研”。模型约下载 6.2 GB，使用独立 Qwen3.5 ONNX 适配器及相同版本的 Transformers.js / ONNX Runtime Web，固定混合精度为视觉 FP32、词嵌入与文字生成 FP16，同样需要支持 `shader-f16` 的 WebGPU。已在 Chrome 157 / NVIDIA A800 80GB 完成合成短页端到端测试；当前测试仅证明短页浏览器推理链路可用，不代表复杂文档准确率或普通显卡兼容性已通过。模型仓库：[WC-2B ONNX](https://huggingface.co/multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags-ONNX)。

## 原生模型：OvisOCR3 与 PaddleOCR-VL-1.6

两款原生模型已加入统一模型选择列表，选择后仍按原有的“加载模型 → 开始推理”流程操作。

| 模型 | 固定配置 | 原生输出 |
|---|---|---|
| OvisOCR3 0.8B | WebGPU；Vision FP32、Embedding/Decoder FP16；默认 1024² | Structured JSON：bbox、category、content |
| PaddleOCR-VL-1.6 0.9B | PP-DocLayoutV3 + VLM；WebGPU FP16 | parsing_res_list、原图像素坐标、OTSL |

- **OvisOCR3**：浏览器模型仓库 multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX，固定 bundle commit de391cb93aa2ee1b67692bdba1b143bf8e4a9f98。模型在 RTX 3080 10GB 上完成实际浏览器推理验收；1024² 单次性能记录约 42.82 tokens/s。
- **PaddleOCR-VL-1.6**：浏览器模型仓库 gle bkudr/PaddleOCR-VL-1.6-WebGPU，固定 revision 5219606297d00bbd23b2ec193271af0c0b427dfc。首次加载模型资源约 2.11 GB；PP-DocLayoutV3 Worker 使用本站同源静态资源。
- **结果展示**：03 区显示原图定位框，右侧按模型原生格式重建阅读视图；悬停或点击结构块可定位原图区域。04 区保留原始 JSON，原生模型下载 .json，DocTags 模型仍下载 .dt。
- **A/B 对比**：同一文档可将原生模型与 DocTags 模型的完整结果放入 A/B 对比。系统根据每条记录保存的输出格式选择对应渲染器，不把 Ovis/Paddle 的结果伪装成 DocTags。
- **设备要求**：使用支持 shader-f16 的桌面 Chrome/Edge 和 WebGPU 设备。首次加载受网络与浏览器缓存影响；切换模型时会释放当前 GPU 实例，再加载目标模型。

**接入未来自研模型：** 点击“添加兼容模型”，输入公开的 Hugging Face 模型仓库 ID（如 `multimodal-vision-ai/model-onnx`）和显示名称。仅登记模型并不代表可以成功加载：必须提供与当前 Granite Docling processor、DocTags 提示词及 ONNX 加载器兼容的权重；其他模型架构需要单独开发适配层。不要输入私有仓库、访问令牌或身份凭证。

**本地缓存有两种状态：**
- 模型权重由 Transformers.js 的 **Cache Storage** 保留于访问者当前浏览器；重新进入相同网站通常可复用缓存，不必每次重新下载，但配额不足、浏览器清理、无痕模式、更换域名或模型版本会导致重新下载。
- **GPU 显存实例仅在当前页面会话内存在**；页面重开仍需要点击加载并重新初始化模型，切换模型也需要重新初始化，但通常读取磁盘缓存即可。
- 点击“查看模型缓存信息”可以查看缓存目录条目和当前站点存储用量（仅估算，不表示模型文件完整）；“请求保留站点存储”需浏览器同意，也不能保证缓存永久保留。
- **结果隐私：** 登记的模型 ID/名称保存在当前浏览器；上传文档的内容及生成结果只保留在当前页面内，换图或刷新将清空多模型对比历史。

## 使用流程

1. 用支持 WebGPU 的桌面版 Chrome 或 Edge 打开实验页；选择九类从 IBM Granite Docling 官方 DEMO 镜像到本站的文档样例，或上传已脱敏的本地文档。
2. 在检测到 WebGPU 后手动点击 **加载模型**。首次加载 DJX-0.8B 约下载 2.52 GB，WC-2B 约下载 6.2 GB；两款自研模型均需要设备支持 `shader-f16`，加载前会检查该能力。
3. 从模型列表选择 **Granite Docling 258M 公共基线**，或添加已完成兼容性验证的公开 ONNX 模型，点击 **开始真正推理**。产生结果后，下方将**原始文档与重建后的结构化结果并排显示**：右侧把标题、正文和 OTSL 表格渲染为阅读版面，左侧显示原图与位置框。悬停右侧结构块可定位到左侧对应区域；可以关闭位置框，也可启用按比例同步滚动（仅辅助查看，不是逐行校准）。

**人工终止推理：** 推理过程中可以点击 **终止推理** 请求停止当前生成。已经生成的部分输出会保留并标记为不完整，不计入多模型 A/B 对比历史；模型仍保持加载，可以重新运行。此操作是协作式中断，需要等待当前 WebGPU 运算结束；若浏览器 GPU 线程完全卡死，可能仍需刷新页面。
4. 切换另一个模型（或同一模型的其他精度），在相同文档上再次运行。页面最下方 **05 · 多模型结果对比** 将展示 A/B 两组实际推理结果。原始 DocTags 被折叠至页面底部的“原始输出与技术诊断”；复杂合并单元格、缺失位置或不完整标签应结合原图人工核对。下载 `.dt` 或标注图可保存分析结果。
5. 上传自己的 PNG、JPG 或 WebP 单页图片时，务必提前脱敏。
6. GPU 不支持、模型加载失败或中文内容解析不佳时，使用 [Kaggle 个人 GPU 试点](../doctags-kaggle/README.md)，或者 [免登录查看已有解析样例](../../assets/projects/doctags/interactive-demo/index.html)。

!!! warning "技术预览，不是完整模型评测"
    页面内置 Granite、OvisOCR3、PaddleOCR-VL-1.6、DJX-0.8B 和 WC-2B 五款模型。OvisOCR3 与 PaddleOCR-VL-1.6 已在 Chrome 155 / NVIDIA RTX 3080 10GB 完成实际浏览器推理及人工结构化结果验收；DJX/WC 已在 Chrome 157 / NVIDIA A800 80GB 完成短页端到端测试。上述验收不等于完整 OCR benchmark，尚不能据此宣称跨设备准确率、长页或所有复杂表格均已验证。

## 接入 HF Organization

与此页面相同的可部署源码位于仓库的 hf-spaces/mvai-doctags-webgpu 目录。Organization 创建 **Static Space** 后，除 README.md、index.html、doctags-renderer.js、model-registry.js 外，还必须保留 `adapters/r3-ovisocr3/` 与 `adapters/wang-qwen35-2b/` 两个模型适配器目录及其文件。不需要 HF 付费 GPU。

**V1.6 对照区只在模型真实生成结果后才显示重建内容，不会加载预设的“标准答案”。** 网页结构化渲染不是逐像素复刻 PDF，不得将左右视觉差异直接视为定量准确率指标。


## V1.7.1 精简交互界面

- 桌面端 **01 文档输入** 与 **02 WebGPU 推理** 等宽、等高并顶端对齐；移动端上下排列。
- 标题旁的 **ⓘ** 支持鼠标悬停、点击及键盘聚焦查看完整提示。首次模型下载可能超过 1 GB 的提醒仍以简短文字直接显示。
- **模型管理 / 本地缓存 / 备用体验** 默认折叠；加载失败和 GPU 不支持等错误仍直接显示。
- **03 原图与结构化结果对照** 保持展开；**04 DocTags 原始输出** 和 **05 多模型结果对比** 默认折叠。
- 加载、缓存、切换、真实推理、同图对比及失败降级逻辑保留；上传文档及解析结果只在当前页面会话内存中保存。

## V1.7.2 推理指标与对比滚动

- **推理成功后**，“02 WebGPU 推理”状态区下方显示 **模型大小（参数量）** 与 **本次推理时长（秒）**。IBM 公开基线标为 **258M 参数**，DJX 自研模型标为 **0.8B 参数**，WC 自研模型标为 **2.2B 参数**；未登记参数规模的自定义模型标为“未提供”，不猜测文件大小。推理失败或选择新输入/模型时清除旧指标。
- 默认收起的 **05 多模型结果对比** 中新增“按比例同步滚动”开关；启用后 A/B 两栏以**滚动百分比**双向联动，关闭后各自滚动。不同模型输出长度可能不同，因此同步位置不等于段落逐项匹配。
- 既有 **03 原图与结构化结果对照** 同步滚动功能不变。

[返回成果展厅](../README.md)


## V1.10 浏览器缓存清理后的资源恢复

- 九类样例缩略图与主预览统一通过 CORS-aware Blob 加载器获取；在 raw.githack CDN 重定向不可用时回退到 raw.githubusercontent.com，不再让缩略图直接请求可能失效的重定向地址。
- DJX-0.8B 与 WC-2B 的 ONNX Runtime WebGPU 和 Transformers.js 运行时采用版本锁定的多 CDN 顺序回退（jsDelivr、Gcore、Fastly、TestingCF）。ONNX Runtime WASM 文件路径随成功加载的镜像自动切换。
- 清除浏览器缓存后，模型权重需要重新下载；样例图片与运行时模块会重新请求。若所有镜像均不可访问，页面会明确报告 CDN 网络错误，而不误报为 ONNX 权重损坏。

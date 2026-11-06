# MVAI DocTags · OvisOCR3 + PaddleOCR-VL-1.6 WebGPU 接入交接

**更新时间：** 2026-11-06  
**当前 PR：** [#74 — WIP: OvisOCR3 + PaddleOCR-VL-1.6 native WebGPU integration](https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/pull/74)  
**当前 head commit（更新时）：** `b2c1bb54c7de4aa39952b6277b117503ab55477f`  
**开发分支：** `feat/ovisocr3-paddleocr-vl16-webgpu-20261106`  
**基线分支：** `dev`  
**状态：** Draft；不允许合并到 dev/main，不允许部署正式 HF Space。

## 一、已经批准的目标与边界

仅增加两个浏览器端 WebGPU OCR 模型：

1. **ATH-MaaS/OvisOCR3 0.8B**
2. **PaddlePaddle/PaddleOCR-VL-1.6 0.9B**

必须遵守：

- 新模型输出保留各自原生格式，不转换成 DocTags。
- 必须输出真实版面定位信息；缺少 bbox 的结果不接受，也不允许补造坐标。
- 浏览器本地 WebGPU 推理；不采用服务端推理，不静默回退 CPU/WASM。
- 不改变正式页面现有界面、布局、按钮和交互。
- 不影响现有 Granite Docling 258M、MVAI-DocTags-DJX-0.8B、MVAI-DocTags-WC-2B。
- 真实浏览器 GPU 验收和原有模型回归测试通过前，不得注册到正式模型列表。
- 只有人工验收后才可合并和发布。

## 二、仓库与代码位置

- 仓库：`multimodal-vision-ai/multimodal-document-ai-learning-center`
- 当前开发 PR：#74
- 主要源码：`hf-spaces/mvai-doctags-webgpu/`
- Paddle 独立验收页面：`hf-spaces/mvai-doctags-webgpu/dev-paddleocr-vl16.html`
- Ovis 独立验收页面：`hf-spaces/mvai-doctags-webgpu/dev-ovisocr3.html`
- Ovis DEV 预览镜像：`docs/assets/projects/doctags/browser-inference/dev-ovisocr3.html`（待 ONNX bundle 上传后才能运行模型）
- 原生输出解析：`hf-spaces/mvai-doctags-webgpu/native-document-output.js`
- 原生结果渲染：`hf-spaces/mvai-doctags-webgpu/native-result-renderer.js`
- 技术状态：`hf-spaces/mvai-doctags-webgpu/NATIVE_OCR_STATUS.md`
- Ovis 转换说明：`hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/README.md`
- Paddle 接入说明：`hf-spaces/mvai-doctags-webgpu/adapters/paddleocr-vl-1.6/README.md`

当前 PR head commit（写本文时）：`99118b194522ee320a64d23429a39a163bf63cc3`。继续研发前先读取 PR #74 当前 head，避免在旧提交上工作。

## 三、PaddleOCR-VL-1.6 当前进展

### 固定依赖

- VLM 源模型：`PaddlePaddle/PaddleOCR-VL-1.6`
- 浏览器模型包：`glebkudr/PaddleOCR-VL-1.6-WebGPU`
- 浏览器模型 revision：`5219606297d00bbd23b2ec193271af0c0b427dfc`
- WebGPU 推理引擎：`glebkudr/paddleocr-vl-webgpu` commit `f7d2f8aa40639497e1dbd95f2f8793e664b90758`
- 版面检测 SDK：`web-sdk-PP-DocLayoutV3` v1.2.0，commit `3aedb7b35af49a1c207fd4f846211366a9d09973`
- 版面模型：PP-DocLayoutV3 FP16，74,279,796 bytes
- VLM 模型包：2,038,286,862 bytes；两者冷启动下载约 2.11 GB。

### 已完成代码

- 两阶段流程：PP-DocLayoutV3 检测版面区域 → PaddleOCR-VL-1.6 对每个区域执行 OCR、表格、公式或图表识别。
- 版面坐标以原始图片像素为准，区域裁剪从原图进行；不使用缩放后的坐标冒充原图坐标。
- 保留阅读顺序、区域标签和原始识别文本。
- 原生结果使用 Paddle 风格的 `parsing_res_list` 字段：`block_bbox`、`block_label`、`block_content`、`block_id`、`block_order`。
- 图像区域不强行 OCR，渲染时展示原图对应裁剪区域。
- 缺少或越界 bbox 会拒绝生成定位框。
- 首次模型加载会执行一个真实 token 的预热；未完成下载和预热不报告模型 ready。
- 停止按钮可以中止布局检测；如果正在执行某个 VLM 区域生成，等待当前区域结束后停止，并保留已完成区域，标记为不完整。
- 已绕开上游默认的自适应多运行时工厂：RTX 3080 原本可能创建最多 3 个运行时，本项目改为单 WebGPU runtime、顺序识别，降低显存和 GPU context 压力。
- 测试诊断会显示实际 GPU adapter 名称、设备类型和 runtime 数量；拒绝 SwiftShader 等软件渲染适配器。

### 独立验收页

PR 专属 DEV 页面构建已通过公开访问检查。入口文件：

`docs/assets/projects/doctags/browser-inference/dev-paddleocr-vl16.html`

**已通过 CI 公开可访问检查的独立验收入口：**  
https://raw.githack.com/multimodal-vision-ai/multimodal-document-ai-learning-center/e4ef4f1aca7ff0eee58826fb84849d60d0c23f05/assets/projects/doctags/browser-inference/dev-paddleocr-vl16.html

该页面不改变正式页面。Ovis 预备验收页面（尚无 ONNX bundle，暂不能运行模型）也已通过公开资源检查：  
https://raw.githack.com/multimodal-vision-ai/multimodal-document-ai-learning-center/e4ef4f1aca7ff0eee58826fb84849d60d0c23f05/assets/projects/doctags/browser-inference/dev-ovisocr3.html

打开 Paddle 页面后：
1. 点击“加载模型并预热”，等待约 2.11 GB 的模型资源下载与预热完成。
2. 上传一张包含文字、表格、公式、图表或图片区域的单页文档。
3. 点击“运行文档解析”。
4. 检查原图上的版面框、区域标签、原生 JSON、完成区域数量和推理耗时。
5. 测试停止、再次运行和释放模型。

**注意：** 本项目尚未在用户 RTX 3080 上完成真实浏览器 GPU 验收。静态 CI 通过不等于推理成功。

## 四、OvisOCR3 当前进展

### 固定来源与输出契约

- 官方模型：`ATH-MaaS/OvisOCR3`
- 固定 source commit：`17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90`
- 官方权重：BF16 Safetensors，约 1.71 GB
- 许可证：Apache-2.0
- 原生 Structured 输出为 JSON 数组，每个元素包括 `bbox`、`category`、`content`。
- bbox 坐标是相对于输入图像的 0–1000 归一化整数坐标。
- 表格保留 HTML，公式保留 LaTeX；图片区域保留官方输出内容，渲染器可根据 bbox 裁剪原图。
- 浏览器不能直接把官方 BF16 仓库当作 ONNX WebGPU 模型加载。

### 已完成代码

- 独立的 Ovis 原生适配器，不复用 DJX 自研模型权重。
- 官方 Structured prompt 固定在 bundle 中，并通过 SHA-256 校验。
- 独立 ONNX exporter、component parity validator、PyTorch source reference runner。
- 上传前 staging 工具会核对文件大小和 SHA-256，且要求验证报告成功。
- 新增 `run_conversion.sh`：固定下载官方模型、固定 Olive recipe、执行 ONNX 导出和组件一致性验证。默认不上传；只有明确设置 `UPLOAD=1` 和 `HF_TOKEN` 才上传。
- 导出器 IO 静态检查曾发现并修复 embedding dummy input 的 `input` / `input_ids` 不匹配。
- 视觉编码器导出明确提取 `pooler_output`，并与原始模型输出验证。
- 浏览器适配器只接受专用 HF ONNX 仓库 `multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX` 的完整 40 位 commit SHA。
- Ovis 独立验收页、适配器和来源契约已镜像到 DEV 静态资源；CI 会检查文件一致性和公开可访问性。当前仍没有已上传的 ONNX bundle，因此该页面暂时只能作为预备验收入口。

### 尚未完成

- 官方 BF16 权重尚未实际下载并转换。
- ONNX embedding、vision、decoder 尚未执行真实转换和组件一致性验证。
- ONNX bundle 尚未上传 HF。
- Ovis 尚未通过 Chrome WebGPU 真实推理和 bbox 对齐验收。

## 五、原生输出渲染与测试

- `native-document-output.js` 分别解析 Ovis 与 Paddle 原生输出，不做 DocTags 转换。
- Ovis bbox 从归一化 1000 坐标换算到原图像素。
- Paddle bbox 保持原图像素坐标。
- `native-result-renderer.js` 使用 DOM 节点创建安全渲染文本与 allow-listed HTML table，不将模型输出直接写入 `innerHTML`。
- 已修复 Ovis HTML table/image 标签检测中的正则转义问题。
- `docs/assets/projects/doctags/browser-inference/` 是 DEV 预览镜像；CI 使用 `cmp` 检查它与 HF Space 源码完全一致。

## 六、自动化检查状态

PR #74 已有以下自动检查通过记录：

- Native OCR JSON / bbox / layout contract tests
- Ovis exporter IO contract test（不需要安装大型 ML 依赖）
- JavaScript adapter module syntax
- Python exporter / validator / upload scripts syntax
- 两个 shell 脚本语法
- DEV 镜像文件逐字节一致性
- MkDocs strict build
- Paddle 独立验收页及本地资源公开可访问检查

这些测试只验证代码结构、契约和静态页面资源，不证明模型推理准确率或 GPU 可运行。

## 七、下一步执行顺序

### A. 先完成 Paddle 本机验收

在桌面 Chrome / Edge + NVIDIA RTX 3080 10GB 上：
- 确认 `navigator.gpu` 与 `shader-f16` 可用。
- 冷启动加载约 2.11 GB 资源，确认实际 GPU adapter 和单 runtime。
- 选择含文字、表格、公式、图表、图片的脱敏测试页。
- 检查版面框与原图位置是否对齐，标签与阅读顺序是否合理。
- 记录 layout、区域识别、总耗时和区域完成数量。
- 测试布局阶段停止、区域生成中停止、重复运行、释放模型。
- 若失败，先收集浏览器 Console 错误、页面状态文本和截图，不要修改正式页面。

### B. 完成 OvisOCR3 转换

在用户 WSL / Kaggle 等 Python 3.11 环境：
1. 安装 README 中固定版本的导出依赖。
2. 执行 `bash hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/run_conversion.sh`。
3. 检查 `validation/component_validation.json`。
4. 必要时执行 `test_reference.py`，用同一测试图片运行原始 BF16 source reference。
5. 组件验证成功后，人工确认再设置 `UPLOAD=1` 上传。
6. 记录 HF 仓库完整 commit SHA，并在 Ovis DEV 页面固定该 SHA。
7. 在 Chrome + RTX 3080 上验证原生 JSON、bbox、HTML 表格、LaTeX 公式和停止行为。

### C. 最后才做生产接入

两个模型均通过真实浏览器 GPU 验收后：
- 将原生结果接入现有 03/04/05 区域。
- 只增加两个模型选择项，不改变现有 UI 布局和交互。
- 验证 Granite Docling、DJX-0.8B、WC-2B 原功能不退化。
- 通过老师人工审核后，才批准 PR、合并 dev/main 和部署 HF Space。

## 八、下一轮聊天启动指令

请先读取本交接文档、`hf-spaces/mvai-doctags-webgpu/NATIVE_OCR_STATUS.md` 和 GitHub PR #74 最新状态。继续使用现有 feature branch 和 Draft PR，不要从头重做，不要修改 main，不要部署 HF Space。先完成 Paddle RTX 3080 实测支持，再继续 Ovis 转换与真实 WebGPU 验证。所有“完成”结论必须由实际日志或测试证据支持。

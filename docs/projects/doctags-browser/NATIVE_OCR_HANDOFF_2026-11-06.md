# MVAI DocTags · OvisOCR3 + PaddleOCR-VL-1.6 WebGPU 接入交接文档

**更新时间：** 2026-11-06 13:31（北京时间）  
**仓库：** `multimodal-vision-ai/multimodal-document-ai-learning-center`  
**PR：** [#74 — OvisOCR3 + PaddleOCR-VL-1.6 native WebGPU integration](https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/pull/74)  
**开发分支：** `feat/ovisocr3-paddleocr-vl16-webgpu-20261106`  
**基线分支：** `dev`  
**当前 head：** `50a0ba99be0cc0e35a66e4fd7e99269c74a21c29`（继续工作前必须重新读取 PR head）  
**状态：** PaddleOCR-VL-1.6 已通过用户人工验收；OvisOCR3 转换和浏览器验收是下一阶段主线。PR #74 保持 Draft，不合并、不部署正式 HF Space。

---

## 1. 下一轮工作的明确目标

下一轮只推进 **OvisOCR3 0.8B 的 ONNX 转换、组件一致性验证、HF 模型仓库上传和浏览器 WebGPU 验收**。

PaddleOCR-VL-1.6 已通过当前阶段人工验收，不要为了继续开发而改动它已经验收通过的实现。

最终仍然只接入两个新增模型：

1. `ATH-MaaS/OvisOCR3`（0.8B）
2. `PaddlePaddle/PaddleOCR-VL-1.6`（0.9B）

### 必须遵守的边界

- 两个模型都保留各自原生输出格式，**不得转换成 DocTags**。
- 必须输出模型真实提供的版面定位信息；缺少 bbox 时拒绝或明确报告，不允许补造坐标。
- 推理在浏览器本地使用 WebGPU；不采用服务端推理，不允许静默回退 CPU/WASM。
- 不改变正式页面现有布局、按钮、操作流程和视觉设计。
- 不影响现有三个模型：Granite Docling 258M、MVAI-DocTags-DJX-0.8B、MVAI-DocTags-WC-2B。
- 新模型未通过真实浏览器 GPU 验收前，不得加入正式模型注册表。
- 未经用户人工批准，不合并到 `dev/main`，不发布正式 HF Space。

---

## 2. 当前仓库与开发纪律

| 项目 | 路径/地址 |
|---|---|
| 主仓库 | `multimodal-vision-ai/multimodal-document-ai-learning-center` |
| PR | [#74](https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/pull/74) |
| 当前分支 | `feat/ovisocr3-paddleocr-vl16-webgpu-20261106` |
| 主要源代码 | `hf-spaces/mvai-doctags-webgpu/` |
| Ovis 适配器 | `hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/` |
| Paddle 适配器 | `hf-spaces/mvai-doctags-webgpu/adapters/paddleocr-vl-1.6/` |
| 原生输出解析 | `hf-spaces/mvai-doctags-webgpu/native-document-output.js` |
| 原生结果渲染 | `hf-spaces/mvai-doctags-webgpu/native-result-renderer.js` |
| 技术状态 | `hf-spaces/mvai-doctags-webgpu/NATIVE_OCR_STATUS.md` |
| 本交接文档 | `docs/projects/doctags-browser/NATIVE_OCR_HANDOFF_2026-11-06.md` |

**继续开发前先读取 PR #74 最新 head、PR 描述和 CI 状态。** 本文中的 head SHA 是交接时快照，不可作为后续提交的固定基线。所有修改继续提交到当前 feature branch 和 PR #74，不要新开分支，不要 cherry-pick 到 main。

---

## 3. PaddleOCR-VL-1.6：当前阶段已验收

### 3.1 模型与运行配置

- 官方源模型：`PaddlePaddle/PaddleOCR-VL-1.6`
- 浏览器模型包：`glebkudr/PaddleOCR-VL-1.6-WebGPU`
- 浏览器模型 revision：`5219606297d00bbd23b2ec193271af0c0b427dfc`
- 浏览器推理引擎：`glebkudr/paddleocr-vl-webgpu` commit `f7d2f8aa40639497e1dbd95f2f8793e664b90758`
- 版面检测：PP-DocLayoutV3 FP16，74,279,796 bytes
- VLM 模型包：2,038,286,862 bytes
- 用户实测：RTX 3080，WebGPU FP16，Runtime Count = 1，模型加载与预热成功。

### 3.2 已解决的两项真实浏览器故障

1. Manifest 404：适配器改为访问上游 Pages 实际发布的 `https://chenmohan123.github.io/web-sdk-PP-DocLayoutV3/models/manifest.json`，并加入回归测试。
2. Worker 跨域 SecurityError：固定 PP-DocLayoutV3 v1.2.0 Worker，大小 732,503 bytes，SHA-256 为 `128380b8f435c07b1dec25542355708dbd99e033b2fcf994d13d12bc8b3a6a6b`；由项目同源静态目录托管，保留 Worker 执行模式。

### 3.3 原生输出和版面还原

- 两阶段流程：PP-DocLayoutV3 检测版面 → PaddleOCR-VL-1.6 对区域执行 OCR、表格、公式或图表识别。
- 原生结果为 Paddle 风格 `parsing_res_list`，包括 `block_bbox`、`block_label`、`block_content`、`block_id`、`block_order`。
- bbox 采用原始图像像素坐标；裁剪从原图执行；不制造或猜测坐标。
- OTSL 解析器支持 `<fcel>`、`<ecel>`、`<lcel>`、`<ucel>`、`<xcel>`、`<nl>`，用于恢复单元格和合并关系，仅服务于展示。
- 右侧可视化表格保留原始 OTSL 折叠查看；原始 `block_content` 和 JSON 不被改写。
- 点击右侧文本/表格结果块，左侧原图高亮相应 bbox。
- 不转换成 DocTags，不改变模型原生输出。

### 3.4 用户人工验收结论

**2026-11-06，用户已确认人工验收通过：解析与版面还原都没有问题。**

这项结论覆盖当前测试文档的真实浏览器推理、原图版面定位、原生结构化解析和 OTSL 表格渲染。公式/图表专项、停止/重复运行、资源稳定性和原有三个模型回归，仍属于后续整体验收范围，但不再阻塞当前转向 OvisOCR3。

Paddle 独立验收页：
[打开 PaddleOCR-VL-1.6 DEV 验收页](https://raw.githack.com/multimodal-vision-ai/multimodal-document-ai-learning-center/dev-preview-pr-74/assets/projects/doctags/browser-inference/dev-paddleocr-vl16.html)

**不要重做或随意修改已经通过人工验收的 Paddle 基础流程。** 如 Ovis 接入确实需要共用渲染器改动，先检查是否会影响 Paddle，再增加回归测试。

---

## 4. OvisOCR3：下一阶段主线

### 4.1 固定模型来源与原生输出契约

- 官方模型：`ATH-MaaS/OvisOCR3`
- 固定源 revision：`17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90`
- 架构：Qwen3.5-0.8B
- 源权重：BF16 Safetensors，约 1.71 GB
- 许可证：Apache-2.0
- 目标 ONNX 仓库：`multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX`
- 浏览器运行时：Transformers.js 4.4.0-next.0 + ONNX Runtime Web 1.31.1
- 浏览器执行：WebGPU + shader-f16，不允许静默 CPU 回退。

OvisOCR3 的官方 Structured 任务输出 JSON 数组，元素包含：

- `bbox`：相对于输入图片的 0–1000 归一化整数坐标；
- `category`：区域类别；
- `content`：原生内容。

表格保留 HTML，公式保留 LaTeX，文本和图片区域保留官方格式。浏览器端需要把 bbox 映射回原图像素用于定位显示，但不得改写原始 JSON 或转换成 DocTags。

**官方 BF16 仓库不能直接当成 Transformers.js WebGPU 模型加载，必须先完成 ONNX 转换和打包。**

### 4.2 已经准备好的代码

目录：`hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/`

已准备：

- `README.md`：环境、转换、验证、上传及验收说明。
- `run_conversion.sh`：固定源 revision 下载、固定 Olive recipe、ONNX 导出和组件验证的一键流程。
- `export_onnx.py`：embedding、vision encoder、decoder 导出与浏览器资产打包。
- `validate_bundle.py`：导出 bundle 对照 BF16 源模型的组件验证。
- `test_reference.py`：原始 PyTorch BF16 模型参考推理。
- `upload_bundle.sh` 及配套上传/哈希检查逻辑：验证通过后才允许上传。
- `requirements-export.txt`：固定导出依赖。

已修复/加入的保护：

- 固定官方 OvisOCR3 source revision。
- 固定 Microsoft Olive recipe commit：`74c2ab2f0bdd5acabcb05b24e9edf145e1020e12`。
- 固定 Olive vision source SHA-256：`f1ae970216a0b96d56ff2ad35fb99cbff6e358fd15fbc2b87cb95e815de6ba78`。
- embedding dummy input 名称与 ONNX IO contract 已修正。
- vision encoder 明确提取 `pooler_output`。
- decoder 外部数据打包后执行 ONNX checker。
- 记录 source checkpoint、prompt、tokenizer 等 provenance/hash。
- 上传默认关闭；只有显式设置 `UPLOAD=1` 并提供 `HF_TOKEN` 才上传。
- 浏览器适配器要求目标 HF 仓库完整 40 位 commit SHA，不允许浮动引用 main。

**重要：上述是代码和导出流程准备完成，不代表 Ovis 模型已经转换成功。** 截至本交接时，官方权重尚未完成实际导出、组件一致性验证或 HF 上传。

### 4.3 下一轮具体执行顺序

#### 第一步：先审阅导出流程，不要盲目启动长任务

在当前分支读取：
- `adapters/ovisocr3-native/README.md`
- `run_conversion.sh`
- `export_onnx.py`
- `validate_bundle.py`
- `requirements-export.txt`
- `upload_bundle.sh)

检查命令、依赖版本、文件名、模型权重格式和输出目录是否彼此一致。若发现问题，先修复并增加小型静态/契约测试。

#### 第二步：准备独立 Python 3.11 环境

推荐在用户 WSL 或具备足够内存和磁盘的 Linux 环境中执行。此任务是模型格式转换和推理验证，不是训练，不进行微调。

README 中给出的基础环境命令：

```bash
python -m venv .venv-ovis
source .venv-ovis/bin/activate
python -m pip install --upgrade pip
python -m pip install torch==2.10.0
python -m pip install 'huggingface_hub>=0.34.0'
python -m pip install -r hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/requirements-export.txt
```

#### 第三步：执行固定版本转换

```bash
bash hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/run_conversion.sh
```

默认输出目录为仓库根目录下：

` .cache/ovisocr3-webgpu `

可通过第一个参数指定其他工作目录。默认不会上传模型。

注意：
- 转换前确认磁盘空间足够，模型源文件、ONNX 中间文件和最终 bundle 会同时占用空间。
- 如果上次留下不完整输出，先检查内容；只有确认可以丢弃后才设置 `CLEAN_OUTPUT=1`。
- CPU 线程可通过 `OVIS_THREADS=4` 调整。
- 不要一开始就设置 `UPLOAD=1`。

#### 第四步：检查转换与组件一致性

必须检查：

`<工作目录>/release/ovisocr3-webgpu/validation/component_validation.json`

确认 embedding、vision encoder、decoder、外部权重文件、tokenizer、prompt 和 source hash 均通过。若任一组件不通过，停止上传，先定位问题。

如需参考模型输出，按 README 使用 `test_reference.py`，在同一张脱敏文档图片上运行官方 BF16 源模型，保存原始输出和耗时。CPU 参考推理可用于正确性对照，但不能代替浏览器 WebGPU 验收。

#### 第五步：人工确认后上传 HF

只有组件验证成功、文件清单和哈希检查通过后，才由用户确认是否上传到：

`multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX`

上传后记录该仓库完整 40 位 commit SHA。禁止使用浮动 main revision。未得到用户明确确认，不执行上传。

#### 第六步：完成真实浏览器 WebGPU 验收

Ovis DEV 页面已经准备，但没有 ONNX bundle 前不能真正推理：

[打开 OvisOCR3 DEV 验收页](https://raw.githack.com/multimodal-vision-ai/multimodal-document-ai-learning-center/dev-preview-pr-74/assets/projects/doctags/browser-inference/dev-ovisocr3.html)

上传成功后：
- 将适配器配置为新上传的完整 HF commit SHA。
- 检查模型文件、tokenizer、prompt 和外部数据加载。
- 使用与 Paddle 相同的文档图片进行推理。
- 检查原生 JSON 是否可解析，bbox 是否在 0–1000 合法范围并准确映射回原图。
- 检查 category、reading order、文本、HTML 表格、LaTeX 公式及图片区域。
- 检查浏览器确实使用 WebGPU + shader-f16，不允许 CPU/WASM 静默回退。
- 测试冷启动、预热、重复推理、停止和资源释放。
- 保存页面截图、原始 JSON、Console 日志、模型 commit SHA 和推理耗时。

只有真实 Chrome + RTX 3080 浏览器推理成功，才可以标记 Ovis 验收通过。

---

## 5. 两模型都通过后才进行的工作

OvisOCR3 通过人工验收后，才进入统一集成阶段：

1. 将 OvisOCR3 与 PaddleOCR-VL-1.6 的原生结果分别接入现有 03/04/05 展示区域。
2. 只增加两个模型选项，不改变现有界面布局、按钮和交互。
3. 保持每个模型自己的原生输出格式与 bbox 语义。
4. 对 Granite Docling 258M、MVAI-DocTags-DJX-0.8B、MVAI-DocTags-WC-2B 做完整回归，确认没有功能退化。
5. 对比同一批文档上的识别效果、版面定位、推理时间、模型下载量、显存和缓存表现。
6. DEV 页面交给用户人工审核。
7. 用户明确批准后，才合并和正式部署。

不要在 Ovis 尚未通过真实浏览器验收时提前把两个模型接入正式模型列表。

---

## 6. 当前 CI 与 PR 状态

交接时 PR #74 最新 head 为：

`50a0ba99be0cc0e35a66e4fd7e99269c74a21c29`

该提交对应的自动化检查：

| 检查 | 结果 |
|---|---|
| Native OCR output contracts | 通过 |
| DEV Preview isolated static build | 通过 |
| Documentation quality | 通过 |

其中 Native OCR contract tests 为 19 项、0 失败。DEV 构建、公开资源检查和文档质量检查均通过。

PR 仍为 Draft。CI 通过只代表代码契约、构建和静态资源检查通过，不能替代 Ovis 模型转换、组件 parity 或真实 WebGPU 推理。

PR 描述中保留了当前验收状态和 DEV 预览入口。继续工作时以 GitHub 最新 PR 信息为准。

---

## 7. 相关文件与状态记录

- 技术状态：`hf-spaces/mvai-doctags-webgpu/NATIVE_OCR_STATUS.md`
- Ovis 转换指南：`hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/README.md`
- Ovis 转换脚本：`hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/run_conversion.sh`
- Paddle 接入指南：`hf-spaces/mvai-doctags-webgpu/adapters/paddleocr-vl-1.6/README.md`
- PR #74：<https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/pull/74>

---

## 8. 下一聊天窗口启动指令

请先读取本交接文档、`hf-spaces/mvai-doctags-webgpu/NATIVE_OCR_STATUS.md)、OvisOCR3 adapter README 和 GitHub PR #74 的最新状态。

从当前 feature branch 和 Draft PR #74 继续，不要重新创建分支，不要重做 PaddleOCR-VL-1.6，不要修改 main，不要部署 HF Space。

**当前唯一主线是：先审阅并执行 OvisOCR3 0.8B 的固定版本 ONNX 转换，完成组件一致性验证；经用户确认后再上传 HF，然后进行真实浏览器 WebGPU 验收。**

每个阶段都要提供可核查的文件、日志、哈希、测试结果或浏览器证据。遇到转换错误先定位原因，不要跳过 parity 验证，不要用静态 CI 通过冒充模型验收。用户的 RTX 3080 是最终浏览器验收设备。

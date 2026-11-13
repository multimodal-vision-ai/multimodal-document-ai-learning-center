# DocTags WebGPU 模型下载源选择 · DEV 研发交接与验收

日期：2026-11-13

## 目标与边界

在成果展厅 WebGPU 推理界面，对五个内置模型统一展示两个下载选项：Hugging Face 官方（默认）、国内镜像（实验性加速）。

只改资源加载路径与一小行 UI。原模型列表、模型权重、精度、WebGPU 推理、DocTags / 原生输出、图像、结果对比、正式站均保持不变。该版本仅供独立 DEV 验收；不得在未验收前合并到 dev 或 main。

## 五模型候选源和实现状况

| 模型 | 国内镜像资源 | DEV 状态 |
| --- | --- | --- |
| DJX-0.8B | https://hf-mirror.com/multimodal-vision-ai/R3-OvisOCR3-DocTags-0.8B-ONNX | 允许手动选择，CORS+JSON 预检 |
| WC-2B | https://hf-mirror.com/multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags-ONNX | 允许手动选择，另外需要 HTTP 206 Range，独立分片缓存 |
| Granite Docling 258M | https://hf-mirror.com/onnx-community/granite-docling-258M-ONNX | 允许手动选择，CORS+JSON 预检 |
| OvisOCR3 0.8B ONNX | https://hf-mirror.com/multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX | 允许手动选择，锁定原来的 immutable bundle revision |
| PaddleOCR-VL-1.6 WebGPU | 暂无经过验证的等价 WebGPU 模型包镜像 | 国内源置灰，保持原版第三方 WebGPU 引擎与下载路径 |

注意：模型介绍页可访问不代表真实权重可下载。PaddleOCR-VL-1.6 使用独立 Rust/WASM WebGPU + 布局 SDK，普通官方 BF16/PyTorch 权重不能替换现有 WebGPU 模型包。

## 工程实现

- docs/assets/projects/doctags/browser-inference/index.html：五模型通用 UI，默认官方，选择后仅对新加载生效。
- docs/assets/projects/doctags/browser-inference/model-download-source.mjs：源策略、固定镜像域名、浏览器预检。
- adapter/r3-ovisocr3、wang-qwen35-2b、ovisocr3-native：仅在镜像测试模式下设置模型下载域名/路径；原官方路径仍按既有方式加载。
- HF Space 源码目录保持和 Docs 静态预览对应文件完全一致，以满足现有仓库质量门槛；本 PR 不发布 HF Space。
- tests/doctags-model-download-source.test.mjs：跨域配置文件、HTTP Range、镜像失败防护、五模型支持范围、官方路径不变。
- scripts/kaggle/validate_browser_doctags_pilot.py：检查新增代码的 Node 语法与回归测试。

缓存原则：默认继续使用已验收的 Cache Storage；WC-2B 镜像分段缓存和官方分段缓存使用不同缓存键，禁止跨源混用。失败后可以手动切回官方源。当前已载入的 GPU 模型在镜像预检失败时不得被释放。

## 人工验收步骤

1. 查看五模型切换、下载源选择及 Paddle 镜像置灰，确保布局、按钮、现有模型精度配置全部保留。
2. 用官方源重新测试 DJX-0.8B 和 Granite 原推理，确认缓存、解析输出和已加载状态不受影响。
3. 在中国大陆网络选择国内源，先检查配置文件 CORS 预检；WC-2B 额外检查 Range 206。失败时记下错误，切回官方源，不要强行下载。
4. 只有预检成功后，先跑 Granite、DJX 权重完整下载与推理；验证缓存复用和同一测试文档的解析一致性。
5. 再依次验证 OvisOCR3 的固定 bundle revision 与原生 JSON、WC-2B 的下载分片及缓存。
6. 确认 PaddleOCR-VL-1.6 仍可通过原路径加载、完成推理。
7. 原有的终止推理、模型切换、模型结果对比、图片输入、进度条仍需回归。

## 仍待验证

本次只完成代码和自动化契约检查。尚未在中国大陆实际浏览器确认五模型镜像下载、SHA256 对照、完整 WebGPU 推理；镜像源随时可能受地域重定向和 CORS 限制。自动化预检只证明小文件能够被浏览器读取，不等于完整权重及推理验收通过。

批准前不得合并至 dev、main，亦不得自动发布 HF Space。

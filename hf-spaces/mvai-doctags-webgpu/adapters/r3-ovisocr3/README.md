# 河海R3 · OvisOCR3 DocTags 网页适配

[公开ONNX模型](https://huggingface.co/multimodal-vision-ai/R3-OvisOCR3-DocTags-0.8B-ONNX) · [实际测试记录](TESTS.md)

模型来自旧约17万条数据训练的第8100步检查点，底层架构为 **Qwen3.5-0.8B**。本目录包含独立加载适配、测试页面、可复用转换工具和实际输出。公共首页、模型列表和其他模型未修改，正式集成由教师审核。

## 网页运行

从仓库根目录运行静态服务：

```bash
python -m http.server 8000 --bind 127.0.0.1
```

打开 `http://localhost:8000/hf-spaces/mvai-doctags-webgpu/adapters/r3-ovisocr3/`，点击“加载模型”，再选择图片识别。公网部署须使用HTTPS，以便浏览器访问WebGPU。浏览器会下载约2.52GB文件；图片在访问者的浏览器中处理。

页面展示预测框、原始DocTags、词元生成速度，并支持停止生成和下载 `.doctags`。输出不做循环清理、坐标修补或表格修复。

运行依赖固定为 Transformers.js 4.4.0-next.0 和 ONNX Runtime Web 1.31.1。依赖使用限定到本模块的 import map（模块地址映射）加载。展厅原有的3.7.5版加载入口未修改。

浏览器须支持WebGPU和 `shader-f16`（半精度计算）。Linux/NVIDIA实测使用Chrome157，并通过下列参数开启该驱动上的半精度功能；这是测试环境设置：

```text
--enable-unsafe-webgpu --use-angle=vulkan --enable-features=Vulkan
--enable-dawn-features=vulkan_enable_f16_on_nvidia
```

开启功能不能代替实际识别验证。实测设备、耗时和输出见测试记录。

该开关的定义见[Dawn官方实现](https://dawn.googlesource.com/dawn/+/refs/heads/main/src/dawn/native/Toggles.cpp)。

## 加载约定

| 项目 | 设置 |
| --- | --- |
| 提示词 | `Convert this page to docling.`（将页面转换为Docling格式） |
| 模板 | 使用模型原始 `chat_template.jinja`，回答前不加入思考前缀 |
| 图像像素范围 | 448²–1440²；可选2880²上限，保持宽高比例 |
| 输出上限 | 16384词元 |
| 生成方式 | 确定性生成，重复惩罚1.0 |
| 图像编码器 | 单精度计算，最后将图片特征转换为半精度 |
| 词嵌入、文字生成器 | 半精度 |
| 词表 | 252480；完整保留4403个新增词元 |

图像编码器保留单精度计算，用于降低转换误差。图片特征与文字嵌入均为半精度，拼接后送入同一文字生成器。

独立页面通过 `createAdapter()` 加载。调用 `recognize(image)` 返回原始输出、输入与输出词元、实际图片网格、结束状态和速度；`stop()` 请求在当前生成步骤完成后停止；`dispose()` 释放模型。集成到展厅时应保留本适配独立的执行上下文和依赖版本。

## 可复用转换与验证

在独立Python环境安装 `requirements-export.txt`；PyTorch版本为2.10.0。转换输入为本地完整合并模型，无需上传原始权重。

视觉模型定义取自[Microsoft Olive配方](https://github.com/microsoft/olive-recipes/tree/74c2ab2f0bdd5acabcb05b24e9edf145e1020e12/Qwen-Qwen3.5-0.8B/builtin)，固定提交 `74c2ab2f0bdd5acabcb05b24e9edf145e1020e12`。工具严格检查文件SHA-256，并逐个加载本地训练后的视觉参数。文字生成器由ONNX Runtime GenAI导出，保留完整输出词表，仅计算最后一个位置的输出分数。

```bash
python export_onnx.py \
  --model /path/to/checkpoint \
  --output-dir /path/to/onnx-release \
  --recipe-dir /path/to/olive-recipes/Qwen-Qwen3.5-0.8B/builtin \
  --vision-source-sha256 f1ae970216a0b96d56ff2ad35fb99cbff6e358fd15fbc2b87cb95e815de6ba78

python validate_bundle.py \
  --model /path/to/checkpoint --bundle /path/to/onnx-release \
  --report /path/to/component_validation.json

node test_contract.mjs

python test_browser.py \
  --browser /path/to/chrome --model-dir /path/to/onnx-release \
  --runtime-dir /path/to/runtime-packages --output /path/to/browser-test
```

`runtime-packages` 中放置上述固定版本NPM包解压后的 `transformers/` 和 `ort/`。浏览器测试仅在127.0.0.1临时提供模型文件，生成可公开的测试图片；完成后关闭自建服务和浏览器。它不占用训练进程。需要额外浏览器参数时使用 `--browser-arg=参数`。

`test_reference.py` 使用原始本地模型在CPU上识别同一测试图，便于比较转换前后的输入和输出。

## 发布文件

```text
config.json / generation_config.json
processor_config.json / preprocessor_config.json
tokenizer.json / tokenizer_config.json / chat_template.jinja
onnx/embed_tokens_fp16.onnx + 对应 _data
onnx/vision_encoder.onnx + 对应 _data
onnx/decoder_model_merged_fp16.onnx + 对应 _data
README.md / LICENSE / NOTICE / validation/
```

每个计算图与同名外部权重文件配套，不能遗漏 `_data`。`config.json` 仅增加浏览器加载配置；词表与对话模板保持源文件内容。缓存接口名统一为Transformers.js使用的名称，线性注意力的循环状态仍使用单精度。

公开发布不包含原始PyTorch权重、训练图片、训练答案或内部测试图片。

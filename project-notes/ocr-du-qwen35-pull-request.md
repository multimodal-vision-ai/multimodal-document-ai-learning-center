# R3 OvisOCR3 DocTags 0.8B：ONNX与WebGPU适配

Head（来源分支）：`feat/ocr-du-qwen3vl`；Base（目标分支）：`dev`。

## 模型

HF地址：https://huggingface.co/multimodal-vision-ai/R3-OvisOCR3-DocTags-0.8B-ONNX

旧约17万条数据训练的8100步合并模型，底层Qwen3.5-0.8B。公开ONNX、扩充词表及必要配置；原始PyTorch权重和内部训练/测试数据不上传。

ONNX分为图像编码器、词嵌入、文字生成器，各有配套 `_data`。视觉计算单精度、图片特征半精度；文字半精度，线性注意力循环状态单精度。下载约2.52GB，固定提示词、直接回答和原始DocTags输出保持现行R3设置。

## 测试

- 新增4403词元往返检查通过；词表、模板与源文件相同；输出词表252480。
- 三种图像网格的视觉特征与原生模型相似度大于0.99999。
- Chrome157 / NVIDIA A800原生WebGPU实际识别，固定Transformers.js 4.4.0-next.0、ORT Web 1.31.1。
- 640×320合成图输入编号与PyTorch逐个相同；两行识别文字相同，标题上边界相差2个归一化坐标。
- 完整输出28词元，首次9.39秒，再次4.28秒，两次输出相同且通过严格语法检查。
- 停止测试和390像素宽显示检查通过。Linux/NVIDIA半精度开关、实际原图、输出、截图及完整校验值已记录。
- ONNX尚未重跑三榜；HF模型卡明确区分原模型分数与浏览器功能测试。

## 变更范围

- `hf-spaces/mvai-doctags-webgpu/adapters/r3-ovisocr3/`：独立适配、参数化转换及验证工具、测试记录。
- `project-notes/ocr-du-qwen35-local-test/`：本地测试页面，放在HF空间部署目录之外，不发布为新站点。
- `project-notes/ocr-du-qwen35-preparation.md`：本模型接入记录。
- 本PR说明文件。

公共 `index.html`、`model-registry.js`、其他模型和部署工作流均未修改。请审核本模型后再统一集成；本分支不自行合并或发布公共展厅页面。

详细配置与复现步骤见适配目录的 `README.md`，完整实测记录见 `TESTS.md`。

# Wang Qwen3.5 2B DocTags 适配

作者：**wangcheng**。个人分支：`feat/ocr-wang-qwen25vl`。实际架构为 `Qwen3_5ForConditionalGeneration`；分支名按教师要求保留。

- [原始 BF16 模型](https://huggingface.co/multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags)
- [ONNX 模型](https://huggingface.co/multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags-ONNX)
- [实测记录](TESTS.md)

本目录仅负责该 2B 模型。独立验证页面位于 `project-notes/ocr-wang-qwen35-local-test/`，公共展厅的集成与发布由教师审核后统一处理。

## 推理约定

| 项目 | 设置 |
| --- | --- |
| 完整词表 | 248,654；保留全部 added tokens 的编号 |
| 提示词 | `Convert this page to docling.` |
| assistant 前缀 | `<think>\n\n</think>\n\n<doctag>` |
| 生成 | 贪心，重复惩罚 1.02 |
| 终止词元 | 248044、248046、248086（`</doctag>`） |
| 图片像素范围 | 65,536–2,073,600，保留宽高比例 |
| 默认生成上限 | 4,096；可配置至 12,288 |
| 图像编码器 | FP32，输出 FP16 图片特征 |
| 词嵌入与解码器 | FP16 |
| 浏览器依赖 | Transformers.js 4.4.0-next.0 / ORT Web 1.31.1 |

前缀与提供的 ms-swift/vLLM 推理入口一致。适配器保留源对话模板，重新拼接 assistant 标记之后的已知前缀，避免重复添加或遗漏 `<doctag>`。

`createAdapter()` 加载后提供 `recognize(image, settings)`、`stop()` 和 `dispose()`。
结果中的 `generatedText` 是实际生成的后缀，`text` 是给定前缀加生成后缀；另含完整输入／输出词元、图像网格、终止状态及耗时。
不修补文字、坐标或标签。后续展厅集成应保留原始输出和这些来源信息。

## 本地页面

从仓库根目录运行：

```bash
python -m http.server 8000 --bind 127.0.0.1
```

打开 `http://localhost:8000/project-notes/ocr-wang-qwen35-local-test/`。
首次加载下载约 6.2 GB，浏览器需要 WebGPU、`shader-f16` 和足够运行内存／显存。
模型注册本身不代表兼容，须使用本目录的专属适配器和固定依赖。

页面只用于本地验证，提供选图、开始、停止、原始 DocTags 下载和区域框，不修改公共展厅或自动发布新页面。

## 转换与验证

在隔离环境安装 `requirements-export.txt`，PyTorch 使用 2.10.0。转换仅用 CPU，保留原训练环境。
视觉实现取自 [Microsoft Olive 固定提交](https://github.com/microsoft/olive-recipes/tree/74c2ab2f0bdd5acabcb05b24e9edf145e1020e12/Qwen-Qwen3.5-0.8B/builtin)，按原项目许可使用。
传入的 recipe 目录须包含 `codes/modeling_qwen3_5.py`，工具会核对其 SHA-256。

```bash
python export_onnx.py \
  --model /path/to/source-checkpoint \
  --output-dir /path/to/onnx-release \
  --recipe-dir /path/to/olive-recipe \
  --vision-source-sha256 f1ae970216a0b96d56ff2ad35fb99cbff6e358fd15fbc2b87cb95e815de6ba78

python validate_bundle.py \
  --model /path/to/source-checkpoint --bundle /path/to/onnx-release \
  --report /path/to/component_validation.json

python test_reference.py \
  --model /path/to/source-checkpoint --image validation/input.png \
  --output /path/to/pytorch_reference.json

python test_browser.py \
  --browser /path/to/chrome --model-dir /path/to/onnx-release \
  --runtime-dir /path/to/runtime-packages --output /path/to/browser-test \
  --browser-arg=--enable-dawn-features=vulkan_enable_f16_on_nvidia
```

`runtime-packages` 内应有固定版本 NPM 包的 `transformers/dist/` 和 `ort/dist/`。
测试仅向 `127.0.0.1` 提供本地模型，使用 [合成测试图片](validation/input.png)，结束后关闭自建服务和浏览器。

多 GPU 的 NVIDIA/Linux 环境可额外传 `--gpu-index` 和 `--vulkaninfo`，并用 Mesa 的 `DRI_PRIME`／`MESA_VK_DEVICE_SELECT_FORCE_DEFAULT_DEVICE` 将 Vulkan 枚举限定为指定物理卡。
测试会记录 PCI 地址与加载前后的进程显存，禁止将模型分配到其他卡。驱动初始化产生的小上下文单独记录，不作为模型分配。
具体设备和启动参数以 [测试记录](TESTS.md) 为准；普通单 GPU 设备无需这些服务器参数。

## 导出配置

- 词嵌入直接由训练权重构造 ONNX `Gather`，无示例模型的固定词元编号或词表改写。
- 视觉／解码器复用仓库现有 Qwen3.5 通用导出辅助函数；已有 R3 模型文件不修改。
- 解码器使用 ORT GenAI 导出，显式 `exclude_mtp=true`，不启用辅助多词元预测头；保留完整主解码器及输出词表。
- 图像编码器保持 FP32；循环状态和 KV 缓存类型以导出图与固定运行时协议为准。
- `config.json` 仅添加 Transformers.js 外部数据和缓存设置；分词器、模板、generation config、processor config 与源文件逐字节一致。
- 解码器中的 `ai.onnx::SimplifiedLayerNormalization` 是 [ORT WebGPU 支持的扩展](https://github.com/microsoft/onnxruntime/blob/main/js/web/docs/webgpu-operators.md)。标准 ONNX checker 尚无该算子的 schema。分片脚本只在内存中的校验副本里临时将该节点移入专用校验域，借此继续检查其余标准算子和图结构；实际保存及上传的 ONNX 文件不会改变节点域或计算图。外部权重的路径、偏移、长度、文件边界和分片大小另行严格验证。最终仍以 ORT WebGPU 实际加载和生成测试为准。

大模型的 ONNX 外部权重可以由多个同名前缀的 `_data`、`_data_1`、`_data_2` 文件组成；`config.json` 中的 `transformers.js_config.use_external_data_format` 必须声明每个 ONNX 文件对应的分片数量。为避开 Chrome 单个 ArrayBuffer 约 2 GB 的限制，每个外部数据分片控制在 1.5 GB 以内。

如果已有完整 ONNX bundle，不需要重新导出模型，可直接运行以下脚本重新分片解码器权重并更新 `config.json`：

```bash
# Kaggle：先在 Secrets 中添加 HF_TOKEN，再执行：
from kaggle_secrets import UserSecretsClient
import os
os.environ["HF_TOKEN"] = UserSecretsClient().get_secret("HF_TOKEN")

!pip install onnx==1.23.2 huggingface_hub
!python repack_decoder_shards.py --push

# 或者对已经下载到本地的 bundle 执行：
python repack_decoder_shards.py --bundle /path/to/Wang-Qwen3.5-2B-DocTags-ONNX --push
```

脚本会先在临时目录生成分片、重写 ONNX 外部数据引用并运行兼容性 ONNX 图校验（对已知 ORT 扩展算子只在内存校验副本中跳过 schema 检查）；同时验证每个权重分片的路径、偏移、长度和大小。验证通过后再替换原文件。它只向 Hugging Face 提交更新后的 `config.json`、`onnx/decoder_model_merged_fp16.onnx` 和新生成的 `onnx/decoder_model_merged_fp16.onnx_data*`，并删除不再使用的旧分片。需要在 Kaggle Secrets 中配置有该模型仓库写权限的 `HF_TOKEN`。`.build/` 为中间结果，不发布。训练数据、内部测试图片、优化器状态和 4B 模型不属于此次发布。

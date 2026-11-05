# Wang Qwen3.5 2B 实测记录

测试日期：2026-11-04。图片为本项目生成的 640 × 320 合成文档，不使用内部训练或测试图片。

## 原模型与转换校验

| 检查 | 结果 |
| --- | --- |
| 源模型 SHA-256 | `f299d2ff0d0cdd72a54232b3c4720d2f600df5a6b5ec148528579d7c7fd777e0` |
| 词表与嵌入大小 | 248,654 × 2,048 |
| added tokens 单词元、无损往返 | 610 / 610 |
| 对应 ONNX 嵌入最大绝对误差 | 0.0 |
| 输出头核对 | 包括最后词元在内的抽样与源权重 FP16 转换结果完全一致 |
| 原分词器、模板、processor、generation config | 逐字节一致 |
| 视觉三种网格相似度 | 最小 0.999998033 |

CPU 原模型使用 PyTorch 2.10.0、Transformers 5.6.2、FP32、4 个线程；本张图生成 26 个词元，耗时 19.324 秒。
转换环境独立使用 `requirements-export.txt` 中固定版本，不修改训练环境。

词嵌入和视觉图通过标准 ONNX checker。解码器使用 ORT 原生支持的 `ai.onnx::SimplifiedLayerNormalization` 扩展；标准 checker 缺少该 schema，已在 [组件报告](validation/component_validation.json) 单独记录，并通过下面的真实 WebGPU 推理补足验证。

## 原生 WebGPU

| 项目 | 结果 |
| --- | --- |
| 浏览器 | Chrome 157.0.8103.38，Linux，无头模式 |
| GPU | NVIDIA A800 80GB PCIe，物理 GPU 4，PCI A1:00.0 |
| 运行时 | Transformers.js 4.4.0-next.0 / ORT Web 1.31.1 |
| 精度 | 视觉 FP32，词嵌入与文字生成 FP16 |
| 图像网格 | 1 × 20 × 40 |
| 输入／生成词元数 | 222 / 26 |
| 本地加载 | 19.123 秒 |
| 首次识别 | 6.442 秒 |
| 再次识别 | 4.530 秒 |
| 两次实际输出 | 完全相同 |
| 与 CPU 原模型输入词元／生成词元／原始输出 | 全部逐个一致 |
| 停止生成 | 生成 1 个词元后停止，未错误标记正常结束 |
| 390px 宽显示 | 页面无横向溢出；此项只检查布局，不代表移动设备 GPU 推理 |
| 现有公共 DocTags 渲染器 | 正确解析两段文字和两个位置框 |

本次使用本地 HTTP 服务加载本地转换文件，不代表 HF 首次在线下载时间或正式展厅已集成。
使用贪心生成、重复惩罚 1.02、给定 response prefix、图片像素上限 2,073,600，本张图的输出上限设为 256。

为了遵守服务器 GPU 使用安排，Mesa 的 Vulkan 物理设备枚举强制限定为 GPU 4。
报告同时记录独立 Vulkan PCI 校验与加载前后的显存：模型分配落在 A1:00.0；另一卡上的 6 MiB 驱动初始化上下文保持不变。
无头 NVIDIA 运行使用 `vulkan_enable_f16_on_nvidia` 开关；此服务器参数不代表任意浏览器默认均已支持半精度。
测试结束后关闭自建 Chrome 和 HTTP 服务，释放测试资源。

## 图片与原始输出

![合成测试图](validation/input.png)

```text
<think>

</think>

<doctag><text><loc_30><loc_78><loc_244><loc_139>WANG OCR TEST</text>
<text><loc_30><loc_212><loc_216><loc_260>Invoice No: 1024</text></doctag>
```

已给定的 assistant 前缀与模型实际生成的后缀分别保存在报告字段 `responsePrefix` 和 `generatedText` 中，未修补识别文字或坐标。

- [浏览器完整记录](validation/browser_validation.json)
- [CPU 原模型记录](validation/pytorch_reference.json)
- [组件数值与文件校验值](validation/component_validation.json)
- [实际 DocTags 文件](validation/output.doctags)
- [桌面截图](validation/screenshot.png)
- [390px 宽截图](validation/screenshot-mobile.png)

本记录证明该合成短页的实际功能与转换一致性；尚未重跑完整 OCR benchmark、长页、复杂表格或不同品牌设备的准确率与兼容性测试。


## Browser external-data sharding correction

The first exported bundle contained a single `decoder_model_merged_fp16.onnx_data` file of 3,832,349,440 bytes. This exceeds Chrome's approximately 2 GiB per-ArrayBuffer limit on some browser/runtime combinations, even though the same bundle loaded on the controlled A800 test host. The browser release must therefore split the decoder external data into multiple files, each no larger than 1.5 GB, and declare the exact chunk count in `transformers.js_config.use_external_data_format`.

Run `python test_external_data_sharding.py` for the synthetic byte-preservation regression test, then run `python repack_decoder_shards.py --push` on Kaggle with `HF_TOKEN` stored as a Kaggle Secret. After upload, rerun `validate_bundle.py` and the browser test on the target Windows/Chrome device. The earlier A800 result is not evidence that the original monolithic package is portable to ordinary desktops.


## Kaggle browser-safe re-sharding: checker compatibility

The first Kaggle run stopped at `onnx.checker.check_model` with `No Op registered for SimplifiedLayerNormalization with domain_version of 22`. This is a known schema gap: ONNX Runtime uses `ai.onnx::SimplifiedLayerNormalization`, while the standard ONNX Python checker does not publish that schema (see [ONNX issue #6582](https://github.com/onnx/onnx/issues/6582)). ONNX Runtime Web's WebGPU operator list includes `SimplifiedLayerNormalization` in `ai.onnx(1+)`.

The first compatibility implementation passed an in-memory `ModelProto` to ONNX Checker. That overload has no model-directory context and could resolve relative external-data locations against the Kaggle process working directory, producing a false "not regular file" error even when the shard existed beside the model.

The repack tool now writes a checker-only temporary ONNX file into the same directory as the external-data shards, changes only the known operator node's domain in that temporary copy, and calls `onnx.checker.check_model(str(checker_path), check_custom_domain=False)`. The checker can therefore resolve each relative external-data location beside the file. The temporary checker file is deleted in a `finally` block. The actual runtime ONNX file, operator domain, graph, weights and shard bytes are not modified by the check.

The synthetic regression test now combines both conditions: a model with external-data tensors and the `SimplifiedLayerNormalization` operator. It verifies external-data path resolution, byte preservation, unchanged runtime operator domain and cleanup of the temporary checker file. Separately, every external tensor reference is checked for path confinement, valid offset/length, existing file and the 1.5 GB shard limit.

This checker workaround is not a substitute for runtime validation. After upload, load and run WC-2B in the target Chrome + WebGPU environment.


## Browser multi-shard loading fix

The first browser attempt after the successful Kaggle upload failed during session creation with an out-of-bounds read from `decoder_model_merged_fp16.onnx_data`. Inspection of the WC-2B adapter found an explicit `use_external_data_format: true`. In Transformers.js, an explicit option takes precedence over the model's `transformers.js_config.use_external_data_format`; boolean `true` requests one chunk, while the uploaded decoder has three. The adapter now omits this override so Transformers.js reads the per-file chunk counts from `config.json`.

The adapter also pins the model to HF revision `09f034d04e5a26620124e4b80923ffc2ec5899c7`, preventing a stale `main` URL/cache entry from mixing the pre-shard ONNX graph with the new shard files. The revision contains the 3-shard Decoder and config produced by Kaggle commit `09f034d04e5a26620124e4b80923ffc2ec5899c7`.

Acceptance remains a fresh Windows Chrome load after clearing the WC-2B site cache. The browser must request the Decoder ONNX graph plus all three external-data chunks; session creation and a real DocTags inference must both succeed.


## HTTP Range download validation

The Windows Chrome test confirmed that the Hugging Face Xet CDN supports single-range requests for the 1,018,486,784-byte embedding external-data file: HTTP 206, `Content-Range: bytes 0-1048575/1018486784`, and `Accept-Ranges: bytes`.

The WC-2B adapter now intercepts only `onnx/embed_tokens_fp16.onnx_data` through Transformers.js' documented `env.fetch` hook. It requests 32 MiB byte ranges with three concurrent workers, validates every 206 response and exact Content-Range/byte length, retries transient failures up to three times with exponential backoff, and streams ordered 1 MiB pieces into the normal Transformers.js loader. Each completed range is stored in a revision-specific same-origin Cache Storage entry; a later attempt reuses completed ranges. Once Transformers.js has successfully committed the complete model file to its normal cache, the temporary range cache is removed. The model's ONNX graph, tensor layout, model revision and inference runtime remain unchanged.

The cache manager's WC-2B cleanup action also removes partial range entries. Unit tests cover ordered byte reconstruction, 206 validation, retry after a simulated connection close, and persistent reuse of completed ranges. This is code-level validation; a fresh Windows Chrome full-model load is still required before acceptance.

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

## 2026-11-05：远程页面加载诊断与服务器文件源

- 增加独立的 localhost 服务，读取服务器现有 ONNX 与固定版本运行时。
- 浏览器探针从该服务实际加载 processor，`<doctag>` 编码保持 248085，页面资源请求全部同源。
- 3,832,349,440 字节的解码器外部权重：HEAD 大小匹配；首段及尾段 32 字节的 Range 请求返回 206，内容与磁盘文件逐字节一致；越界 Range 返回 416。
- 页面按文件显示字节与百分比，保留失败阶段及完整异常。
- 主动模拟缺少 WebGPU 的环境，验证错误显示、诊断展开与服务端接收。该探针测试故障处理，不代表用户设备缺少 WebGPU。
- 此组检查覆盖传输与诊断界面；原生 GPU 的数值对照沿用上方记录。

### 端口转发途中断流的恢复

- 8 个 Node 故障测试覆盖：响应体途中断流后在同一字节范围重试、取消后复用分段、并发文件仅使用一个分段连接、ETag 更新、有限次失败、范围异常拒绝、取消清理及缓存配额耗尽。
- 真实 Chrome 从本地源下载解码器前两段（共 33,554,432 字节），SHA-256 为 `eeb7e8b440b434737bc8ddb81a585a19f359bb68f6c9f263e857afb8237b3d5c`，与磁盘对应内容一致。
- 同一浏览器中新建下载器再次读取两段，网络 Range 次数为 0，缓存内容校验值一致。
- 在真实 Chrome 中主动令首个分段的响应体报错，确认仅重试该段一次，重试后 16 MiB 内容与磁盘校验值一致。
- 使用模型加载器的 `env.fetch` 做传输接入探针，确认权重经过专属下载器；探针在两个分段请求后主动取消。该探针使用 WASM 路径启动下载，不执行完整推理，也不占用服务器 GPU。
- 本次没有重现用户 Windows / Intel Gen-9 设备的全部加载过程，也没有复现其端口转发链路，因此不将原始 `TypeError: network error` 归因为某个确定的网络组件。
- [传输与故障探针记录](validation/transport_validation.json)；其中模拟缺少 WebGPU 和主动取消下载产生的错误均为测试步骤。

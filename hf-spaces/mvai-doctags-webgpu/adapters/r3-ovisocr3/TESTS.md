# 实际测试记录

测试时间：2026-11-04。使用完整8100步微调权重转换，源权重SHA-256为 `89f23b4a9092976976af24f822bd77a235c70af81efdfed9d6af715ab2b6ee8e`。

## 组件与词表

| 检查 | 结果 |
| --- | --- |
| 新增词元单词元、无损往返 | 4403/4403通过 |
| 词表与对话模板 | 与源文件相同 |
| 新增词元嵌入与源权重半精度值 | 最大绝对差0.0000001192 |
| 输出词表 | 252480；抽检的5组输出权重与源模型对应行相同 |
| 视觉特征对原生PyTorch | 三种网格余弦相似度均大于0.99999 |
| 模板与设置单元测试 | 8项通过 |

视觉测试网格为1×4×4、1×6×8、1×22×34，包含动态图像尺寸。单精度视觉计算的输出转换为半精度后，与原生模型相同处理结果比较。详细误差及13个模型资产校验值见 [component_validation.json](validation/component_validation.json)。

文字生成器包含ONNX Runtime扩展算子，使用目标运行时的真实加载和推理验证。标准ONNX检查器对其 `SimplifiedLayerNormalization` 实验算子无法识别，不将标准检查器作为文字生成器的通过依据。

## 浏览器端到端

| 设置 | 值 |
| --- | --- |
| 系统 | Linux / NVIDIA驱动570.133.20.0 |
| 浏览器 | Chrome for Testing 157.0.8103.38 |
| 显卡 | NVIDIA A800 80GB PCIe，原生Vulkan WebGPU |
| 依赖 | Transformers.js 4.4.0-next.0；ONNX Runtime Web 1.31.1 |
| 精度 | 视觉计算单精度，特征输出半精度；词嵌入、文字生成半精度；循环状态单精度 |
| 测试图片 | 640×320，浏览器画布新生成，无内部业务内容 |
| 输入 | 217词元；与PyTorch输入编号逐个相同 |
| 像素设置 | 最小448²，最大1440²，保持比例 |
| 测试输出上限 | 256词元；页面默认16384词元 |
| 生成设置 | 确定性，重复惩罚1.0，不做文本后处理 |

浏览器启动参数包括：`--enable-unsafe-webgpu --use-angle=vulkan --enable-features=Vulkan --enable-dawn-features=vulkan_enable_f16_on_nvidia`。此Linux驱动默认未向网页暴露半精度能力，实测显式启用。模型实际在浏览器内执行，未调用服务器OCR接口。

| 操作 | 结果 |
| --- | --- |
| 首次识别 | 28词元，9.39秒；首词元5.84秒 |
| 再次识别 | 28词元，4.28秒；首词元0.54秒 |
| 再次识别总速率 | 6.54词元/秒，包含图片编码和预填充 |
| 连续两次输出 | 逐字符相同，均正常生成结束词元 |
| 严格语法 | 通过R3统一 `audit_doctags()` 检查 |
| 停止按钮 | 请求停止后产生1词元即结束；未声称完整输出 |
| 390像素宽页面 | 无横向页面溢出；仅做排版测试，未测试手机GPU |

实际输出：

```text
<doctag><title><loc_29><loc_100><loc_198><loc_148>R3 OCR TEST</title>
<text><loc_29><loc_178><loc_198><loc_272>Invoice No: 1024</text></doctag>
```

同图PyTorch输出的标题上边界为98，ONNX输出为100，相差归一化坐标2格，约原图高度1.28像素；两行文字和其余标记相同。

[测试原图](validation/input.png) · [原始DocTags](validation/output.doctags) · [桌面截图](validation/screenshot.png) · [窄屏截图](validation/screenshot-mobile.png) · [浏览器原始记录](validation/browser_validation.json) · [PyTorch原始记录](validation/pytorch_reference.json)

上述为短页实际功能验证，ONNX版本尚未重跑完整三榜；模型卡中的三榜分数来自原始模型。

## 协作检查

- 只修改本模型独立目录和本人的准备说明，未修改公共页面、模型注册列表和其他适配。
- 仅个人分支 `feat/ocr-du-qwen3vl` 提交；合并目标为 `dev`，不自行合并。
- 公开测试图为新生成样本；原始PyTorch权重、训练数据和内部图片未公开。

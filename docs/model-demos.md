# 模型演示｜文档理解与视频理解

本页聚合已经上线的第三方真实模型演示，重点展示 **2B 以下小模型**在文档理解、视频理解方面的能力。学生不必安装环境或自行申请 GPU，可直接尝试下列公开交互界面。

!!! info "体验须知"
    - 建议先使用各演示自带的示例。**不要上传个人隐私、保密材料或未经授权的视频。**
    - 免费公共演示可能排队、休眠、限流或暂时不可用；嵌入失败时请点击“独立打开”。
    - 模型及 GPU 由第三方提供，学习中心不保证运行时间、匿名访问额度及第三方数据处理政策。

## 文档理解

### Granite Docling 258M

适合观察文档版面、表格、公式和结构化转换；参数规模约 **258M**。

[独立打开 IBM Granite Docling 演示](https://huggingface.co/spaces/ibm-granite/granite-docling-258m-demo){ target="_blank" }

<iframe src="https://ibm-granite-granite-docling-258m-demo.hf.space" title="Granite Docling 文档理解演示" width="100%" height="680" loading="lazy" style="border:1px solid #d9dee8;border-radius:10px;" allow="clipboard-read;clipboard-write"></iframe>

### PaddleOCR-VL 1.6

适合体验 OCR、复杂版面、图表、表格与公式识别；参数规模约 **0.9B**。

[独立打开 PaddleOCR-VL 在线演示](https://huggingface.co/spaces/PaddlePaddle/PaddleOCR-VL-1.6_Online_Demo){ target="_blank" }

<iframe src="https://paddlepaddle-paddleocr-vl-1-6-online-demo.hf.space" title="PaddleOCR-VL 文档理解演示" width="100%" height="680" loading="lazy" style="border:1px solid #d9dee8;border-radius:10px;" allow="clipboard-read;clipboard-write"></iframe>

## 视频理解

### SmolVLM2 256M — OpenVINO

上传短视频并输入自然语言问题，观察内容描述、事件概括与时序理解的正确性。模型规模约 **256M**，演示实现运行于 CPU；其抽帧策略与完整逐帧分析不同。

[独立打开 SmolVLM2 视频理解演示](https://huggingface.co/spaces/echarlaix/vision-langage-openvino){ target="_blank" }

<iframe src="https://echarlaix-vision-langage-openvino.hf.space" title="SmolVLM2 视频理解演示" width="100%" height="680" loading="lazy" style="border:1px solid #d9dee8;border-radius:10px;" allow="clipboard-read;clipboard-write"></iframe>

## 学生可以尝试的三个问题

1. **文档结构**：两栏论文或含表格、公式的页面，哪些区域识别准确？哪些被遗漏？
2. **视频事件**：模型能否正确回答“发生了什么”和“哪个动作先发生”？
3. **错误与证据**：记录输入、模型、时间、原始输出及错误，不将合理生成的语言直接视为事实。

> 上述入口是第三方托管的在线模型界面，并非本学习中心自行部署的 GPU 服务；同一演示中模型版本和可用功能可能变化。

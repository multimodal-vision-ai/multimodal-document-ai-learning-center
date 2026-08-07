# Document AI 入门：从任务到评测

> **对应课程**：[Week 5](00_12_Week_Bootcamp.md#week-5) · [Week 6](00_12_Week_Bootcamp.md#week-6) · [Week 7](00_12_Week_Bootcamp.md#week-7)<br>
> **目标**：认识不同文档任务，建立可计算的 baseline，而不是只展示几个“看起来不错”的输出。

Document AI 研究如何把 PDF、扫描件、表格、表单等文档转换为机器可理解、可检索和可验证的信息。它不是单一模型，也不等于 OCR。

## 任务地图

| 任务 | 输入 | 输出 | 常见指标 |
| --- | --- | --- | --- |
| OCR | 文档图像 | 字符或文本行 | CER、WER、Edit Distance |
| Layout Analysis | 页面图像 | 区域类别与坐标 | IoU、mAP、F1 |
| Table Recognition | 表格图像 | 单元格结构与内容 | TEDS、cell F1 |
| Document Parsing | PDF/图像 | Markdown、HTML、JSON | 文本、表格、公式、阅读顺序指标 |
| Document VQA | 文档与问题 | 有依据的答案 | Accuracy、ANLS、人工 groundedness |
| Information Extraction | 文档与 schema | 字段和值 | Precision、Recall、F1 |

选择指标前先明确任务单位。例如“成功生成 Markdown”只能衡量 pipeline 是否运行，不能证明文本或结构正确。

## 两类常见技术路线

### Modular pipeline

```text
PDF/Image → OCR → Layout/Table → Reading Order → Structured Output
```

优势是中间结果容易检查，单个模块可替换；缺点是上游错误会向后传播。

### End-to-end VLM

```text
Document Image + Instruction → Multimodal Model → Text/JSON/Answer
```

优势是接口统一、任务灵活；缺点是输出可能幻觉，结构稳定性和证据追踪需要额外验证。

课程要求至少比较一次两类路线，而不是预先认定某一类必然更好。

## 官方学习入口

- [PaddleOCR documentation](https://www.paddleocr.ai/main/en/index.html)（OCR、layout、table 与 document parsing）
- [Docling documentation](https://docling-project.github.io/docling/)（结构化文档转换）
- [Transformers document question answering](https://huggingface.co/docs/transformers/tasks/document_question_answering)（Document VQA）
- [DocLayNet dataset repository](https://github.com/DS4SD/DocLayNet)（layout analysis 数据与论文）
- [OmniDocBench official repository](https://github.com/opendatalab/OmniDocBench)（端到端文档解析评测）
- [Hugging Face Dataset Cards](https://huggingface.co/docs/hub/datasets-cards)（数据来源、许可和偏差记录）

## Week 5｜建立任务地图

选择三份公开或自制文档：数字 PDF、扫描件、复杂表格各一份。

对每份文档记录：

- 来源、许可和隐私状态；
- 页面类型、语言和分辨率；
- 目标任务与预期输出；
- 可能失败的区域；
- 适用指标。

运行一个公开工具后，不要只贴截图。将 prediction 与人工预期逐项对照，至少标记 3 类错误。

### 提交物

```text
week05/
├── document-inventory.csv
├── task-map.md
├── predictions/
└── error-analysis.md
```

## Week 6｜构建解析 pipeline

使用[Docling 入门](06-2_Docling.md)或另一个有官方文档的工具，将相同文档转换为 Markdown/JSON。

Pipeline 必须具备：

- 输入路径校验；
- 可复现命令；
- 日志和非零失败退出码；
- 独立输出目录；
- 原始输入与输出的对应关系；
- 至少 5 条质量检查规则。

质量检查可包括：页面数一致、标题是否存在、表格数量、字符为空比例、阅读顺序抽查和 JSON schema 验证。

### 提交物

```text
week06/
├── README.md
├── parse_documents.py
├── quality_checks.py
├── results/
└── quality-report.md
```

## Week 7｜构建可信 benchmark

### 1. 冻结数据划分

- train：只在需要训练时使用；
- validation：选择参数和 prompt；
- test：最终评测前保持冻结。

禁止依据 test 输出持续修改 prompt 或规则，否则会发生 test leakage。

### 2. 建立 baseline

Baseline 可以是一个简单工具、未微调模型或固定规则。它必须与后续方法使用同一 test set 和指标。

### 3. 自动计算指标

评测脚本至少输出：

```text
sample_id,document_type,metric_name,score,error_category
```

同时报告总体均值和按文档类型切片结果。若使用人工评价，应提前定义评分量表并进行抽样复核。

### 4. 做错误分析

至少抽取最差的 5 个案例，并按以下方向分类：

- 图像质量；
- OCR；
- layout/reading order；
- table/formula；
- instruction following；
- hallucination；
- evaluation/data problem。

### 提交物

```text
week07/
├── dataset-card.md
├── test-manifest.csv
├── benchmark.py
├── results.csv
└── benchmark-report.md
```

## 数据与研究伦理

- 不上传含身份信息、成绩、病历、合同或其他敏感内容的原始文档；
- 阅读数据集 license 和使用条款；
- 不把模型 prediction 当作 ground truth；
- 不只挑选成功样例；
- 报告模型、数据、指标和人工标注的限制；
- 删除展示材料中的 token、路径、用户名等非必要信息。

## 自主检查

- [ ] 能说明 OCR、layout、table、parsing 与 VQA 的区别；
- [ ] 三份样例包含来源、许可和预期输出；
- [ ] Pipeline 可通过一条命令运行，并能正确报告失败；
- [ ] Dataset card 包含数据划分和潜在偏差；
- [ ] Benchmark 使用真实质量指标，而非只统计文件是否生成；
- [ ] 报告总体和分组结果，并保留逐样例 prediction；
- [ ] 至少分析 5 个失败案例；
- [ ] test set 未用于训练或反复调参。

## 下一步

只有 baseline、test set 和评测脚本准备好后，才进入[模型后训练与 W&B](08_Post_Training.md)。这样 Week 8–10 的提升才有可信的比较基准。

最后更新：2026-08-07

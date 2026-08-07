# Docling：PDF 到 Markdown/JSON 的可检查流水线

> **对应课程**：[Week 6](00_12_Week_Bootcamp.md#week-6)<br>
> **目标**：把三类真实文档转换为结构化输出，并建立质量检查和失败记录。

Docling 将 PDF、Office 文档、图像等转换为统一的 `DoclingDocument`，再导出 Markdown、JSON 等格式。它适合构建可检查的 modular pipeline，与生成式 VLM 形成对照。

## 官方学习入口

- [Installation](https://docling-project.github.io/docling/getting_started/installation/)（当前安装和可选 OCR 引擎）
- [Quickstart](https://docling-project.github.io/docling/getting_started/quickstart/)（`DocumentConverter`）
- [Supported formats](https://docling-project.github.io/docling/usage/supported_formats/)（输入与输出）
- [CLI reference](https://docling-project.github.io/docling/reference/cli/)（批量转换和参数）
- [DocumentConverter API](https://docling-project.github.io/docling/reference/document_converter/)（状态、限制与错误）
- [Serialization](https://docling-project.github.io/docling/concepts/serialization/)（Markdown/JSON 的信息差异）
- [Official GitHub repository](https://github.com/docling-project/docling)（源码、examples、issues）

## 最小转换

以官方 Quickstart 为准，核心过程是：

```python
from docling.document_converter import DocumentConverter

source = "path/to/document.pdf"
result = DocumentConverter().convert(source)
document = result.document

markdown = document.export_to_markdown()
structured = document.export_to_dict()
```

不要只打印输出。保存 Markdown、JSON、转换状态、耗时和输入文件的稳定标识。

!!! note "选择输出格式"
    Markdown 便于阅读，但可能无法完整表达复杂表格和结构；需要保真中间表示时保存 Docling JSON。具体差异以官方 Serialization 文档为准。

## Pipeline 设计

```text
validate input
      ↓
convert with explicit options
      ↓
check conversion status/errors
      ↓
export Markdown + JSON
      ↓
run quality checks
      ↓
write manifest and report
```

程序必须限制输入类型、页数或文件大小，并为失败返回非零退出码。批量任务不能静默跳过失败文档。

## Week 6 必做任务

选择与 Week 5 相同的三份文档：数字 PDF、扫描件、复杂表格文档。

1. 使用默认 pipeline 转换并保存 Markdown/JSON；
2. 记录 Docling 版本、处理选项、状态、耗时与错误；
3. 对扫描件说明 OCR 是否启用、使用什么引擎和语言；
4. 定义至少 5 条质量检查；
5. 比较 Markdown 与 JSON 对标题、表格和阅读顺序的保留程度；
6. 使用一个损坏或不支持的输入验证失败路径。

## 最小质量检查

| 检查 | 示例判定 |
| --- | --- |
| 文件完整性 | 输入存在、扩展名允许、大小在限制内 |
| 转换状态 | 成功、部分成功或失败被明确记录 |
| 内容非空 | 文本长度超过预设最低值 |
| 页面对应 | 输出覆盖预期页数 |
| 结构保留 | 标题、表格数量与人工检查一致 |
| 阅读顺序 | 抽样段落顺序无明显错乱 |
| JSON 有效性 | 可解析并满足预期顶层字段 |

这些检查用于发现异常，不等同于完整 Benchmark。模型质量评测在 Week 7 完成。

## 推荐输出结构

```text
week06/
├── README.md
├── parse_documents.py
├── quality_checks.py
├── inputs-manifest.csv
├── results/
│   ├── markdown/
│   ├── json/
│   └── run-manifest.csv
└── quality-report.md
```

`run-manifest.csv` 至少包含 `sample_id,input_hash,status,duration,markdown_path,json_path,error`。

## 验收清单

- [ ] 使用当前官方 `DocumentConverter` API；
- [ ] Docling 版本和 pipeline options 被记录；
- [ ] 三类文档均有输入—输出对应关系；
- [ ] Markdown 与 JSON 都被保存并比较；
- [ ] 至少 5 条质量检查能重复运行；
- [ ] 损坏输入能得到清晰错误和非零退出码；
- [ ] 原始文档来源、许可和隐私状态明确；
- [ ] 没有把“转换成功”误写为“解析质量优秀”。

## 常见问题

### 扫描 PDF 没有文本

确认 OCR 是否启用、OCR 引擎是否正确安装、语言数据是否可用，并记录实际配置。

### 表格在 Markdown 中丢失结构

对照 Docling JSON 或 HTML；复杂合并单元格不一定适合用 Markdown 表达。

### 第一次运行很慢

区分模型下载时间和稳定处理时间。报告中单独记录 warm-up，不把首次下载计入每页性能比较。

## 下一步

进入[Document AI：从任务到评测](07_Doc_AI.md)，为 pipeline 建立固定 test set、质量指标和错误分类。

最后更新：2026-08-07

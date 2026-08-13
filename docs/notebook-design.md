# Notebook 设计文档 — Kaggle + SmolDocling + OmniDocBench 科研 Notebook 路线

- **状态**：Phase 1 交付物（已完成，2026-08-13）
- **关联任务**：[001-Codex-Kaggle-SmolDocling-OmniDocBench-Notebooks](codex-tasks/001-Codex-Kaggle-SmolDocling-OmniDocBench-Notebooks.md)
- **Owner**：Guoping Tan
- **目标平台**：Kaggle 免费 NVIDIA GPU
- **用途**：Phase 2–4 实现 Notebook 路线时的唯一版本与架构依据

> 核实约定：✅ = 本次审计已通过官方 API / 官方文件 / 本地解析核实；⚠️ = 已记录官方来源，但需在首次实际运行时复核锁定。

---

## 1. 结论摘要

| 项目 | 结论 |
| --- | --- |
| 模型 | `docling-project/SmolDocling-256M-preview`，revision `ce51f56c4ebe36e0b1c3a55f67b261ba22a50bf8`（2025-09-17）✅ |
| 模型架构 | Idefics3（基于 SmolVLM-256M-Instruct），约 256M 参数，BF16 权重约 0.5 GB ✅ |
| 模型后继 | 官方已发布后继 `ibm-granite/granite-docling-258M`，SmolDocling preview 不再持续更新 ⚠️（教学仍按要求使用 SmolDocling，adapter 层为未来换模型预留） |
| 数据集 | `opendatalab/OmniDocBench`（HF），revision `aa1ee96d106dbe53d0ae59474d75c6e6d9b53fec`（2026-06-26）✅ |
| 数据规模 | 1651 页，10 文档类型 × 5 版面 × 5 语言，28 block 类别，32798 个 block 标注 ✅（本地解析 OmniDocBench.json 核实） |
| 评测代码仓库 | `opendatalab/OmniDocBench`，无 release、无 tag；锁定 main 最新 commit `193627ae9e97d89188468ed1ee3b7a856ff76044` ✅ |
| Docling | `docling-project/docling` v2.119.0（2026-08-10 前后发布）✅ |
| 数据使用红线 | 官方 1651 页为 Benchmark 数据，无官方 SFT train split；不得训练后在同一集合宣称官方成绩 |

---

## 2. 仓库现状审计

### 2.1 现状

```text
docs/
├── codex-tasks/            # 本任务文件
├── learning/               # 12 周课程（Week 5-10 覆盖 Document AI 主线）
├── tutorials/              # Qwen2.5-OmniDocBench 评测教程、Qwen3.5-VL SFT/GRPO 路线
├── experiments/            # Experiment 01（Qwen3.5-0.8B 七关项目）
└── reading/                # 04_doctags.md、05_benchmark-2026.md 等导读
notebooks/                  # 目前只有 README.md，作为新路线落点
mkdocs.yml                  # 站点导航（新路线需在 Phase 2 决定是否入导航）
```

### 2.2 与现有内容的关系（避免重复）

| 现有内容 | 与本路线的关系 |
| --- | --- |
| `tutorials/Qwen2.5-OmniDocBench-kaggle-tutorial.md` | 已有的"读指标"入门教程。新 Notebook 07 直接调用官方评测框架，教程作为其前置阅读，不复制内容 |
| `experiments/Experiment_01` | Qwen3.5-0.8B 的小规模课程评测项目。新路线是 SmolDocling 训练+基准的科研路径，两者互补，共用 OmniDocBench 数据管理原则 |
| `learning/06-2_Docling.md`、`07_Doc_AI.md`、`08_Post_Training.md` | Notebook 中的概念解释只做简要回顾，详情链接到这些页面 |
| `reading/04_doctags.md`、`05_benchmark-2026.md` | DocTags 概念与 Benchmark 选型的深度阅读材料，Notebook 00/07 的延伸阅读 |

### 2.3 目标目录结构

```text
notebooks/
├── README.md
├── 00_Environment_and_First_Run.ipynb
├── 01_Understanding_OmniDocBench.ipynb
├── 02_Dataset_Engineering.ipynb
├── 03_Prompt_Engineering.ipynb
├── 04_Baseline_Inference.ipynb
├── 05_SFT_Fundamentals.ipynb
├── 06_LoRA_Fine_Tuning.ipynb
├── 07_Benchmark_and_Evaluation.ipynb
├── 08_Error_Analysis.ipynb
├── 09_Ablation_Study.ipynb
└── 10_From_Experiments_to_Research_Questions.ipynb

src/                       # 可复用 Python 模块
configs/                   # 实验配置（YAML/JSON）
scripts/                   # 与 Notebook 对应的命令行入口
solutions/                 # 教师版完整答案（学生版 Notebook 用 TODO 保留练习）
prompts/                   # Prompt v0-v3 文本与版本记录
results/                   # 运行时产物（baseline/ sft/ lora/）
reports/                   # 生成的报告与图
assets/                    # Notebook 共用的样例图与说明图
requirements-kaggle.txt    # Kaggle 锁定版本依赖
```

---

## 3. 官方源审计：SmolDocling

来源：Hugging Face API（`/api/models/docling-project/SmolDocling-256M-preview`）与官方模型卡，核实于 2026-08-13。

| 项目 | 值 |
| --- | --- |
| 模型 ID（任务指定） | `docling-project/SmolDocling-256M-preview` ✅ |
| 原始发布 ID | `ds4sd/SmolDocling-256M-preview`（模型卡示例代码使用此 ID，两者为同一权重） ✅ |
| Revision（锁定用） | `ce51f56c4ebe36e0b1c3a55f67b261ba22a50bf8` ✅ |
| 最后修改 | 2025-09-17 ✅ |
| 架构 | `Idefics3ForConditionalGeneration`（model_type=idefics3），微调自 `HuggingFaceTB/SmolVLM-256M-Instruct` ✅ |
| 参数规模 | 256,484,928（BF16 safetensors） ✅ |
| License | 仓库元数据为 `cdla-permissive-2.0`；模型卡摘要写 Apache 2.0 ⚠️ 以模型卡和仓库元数据为准记录两者，正式使用时核对许可证原文 |
| 训练数据 | `ds4sd/SynthCodeNet`、`ds4sd/SynthFormulaNet`、`ds4sd/SynthChartNet`、`HuggingFaceM4/DoclingMatix` ✅ |
| 论文 | arXiv:2503.11576（SmolDocling） ✅ |
| 官方后继 | `ibm-granite/granite-docling-258M`（模型卡置顶公告："It will now receive updates and support"） ✅ |

### 3.1 官方推荐推理链路（transformers）

模型卡给出的官方用法，Notebook 00/04 以此为准：

```python
processor = AutoProcessor.from_pretrained("ds4sd/SmolDocling-256M-preview")
model = AutoModelForVision2Seq.from_pretrained(
    "ds4sd/SmolDocling-256M-preview",
    torch_dtype=torch.bfloat16,
    _attn_implementation="flash_attention_2" if DEVICE == "cuda" else "eager",
).to(DEVICE)

messages = [{"role": "user", "content": [
    {"type": "image"},
    {"type": "text", "text": "Convert this page to docling."},
]}]
prompt = processor.apply_chat_template(messages, add_generation_prompt=True)
inputs = processor(text=prompt, images=[image], return_tensors="pt").to(DEVICE)
generated_ids = model.generate(**inputs, max_new_tokens=8192)
# 截掉 prompt 后 decode → doctags
```

要点：

- 官方 Prompt：`Convert this page to docling.`（vLLM 示例中为 `Convert page to Docling.`）；
- `max_new_tokens=8192`，vLLM 示例用 `temperature=0.0`；
- HF API 的 `transformersInfo` 为 `AutoModelForMultimodalLM`，模型卡代码用 `AutoModelForVision2Seq`——以模型卡可运行代码为准，Phase 2 实际验证后固定 ⚠️；
- 模型自带 ONNX 变体（fp16/int8/q4 等），可作为 CPU/低显存备用方案。

### 3.2 DocTags → DoclingDocument 转换链路

```python
from docling_core.types.doc.document import DocTagsDocument
from docling_core.types.doc import DoclingDocument

doctags_doc = DocTagsDocument.from_doctags_and_image_pairs([doctags], [image])
doc = DoclingDocument.load_from_doctags(doctags_doc, document_name="Document")
print(doc.export_to_markdown())   # 或 save_as_markdown / save_as_html
```

⚠️ **已知风险**：模型卡示例基于较旧 `docling-core` API。新版 docling-core 中 `DocTagsDocument` 与 `load_from_doctags` 已被弃用、改为 `DoclingDocument.from_doctags_and_image_pairs(...)`。Phase 2 必须按当前安装的 docling-core 版本实测两条路径之一，并把验证过的 API 固化进 `src/model.py`。

### 3.3 支持指令（Notebook 03 Prompt 设计依据）

模型卡列出：Full conversion、Chart→table、Formula→LaTeX、Code→text、Table→OTSL、指定区域 OCR（`<loc_*>`）、元素识别、页脚检测等。Notebook 03 的 Prompt v1–v3 应围绕这些官方能力设计，而不是凭空编写。

---

## 4. 官方源审计：OmniDocBench

### 4.1 数据集（Hugging Face 官方发布）

来源：HF API + 官方 README + 本地解析 `OmniDocBench.json`（42,208,096 字节），核实于 2026-08-13。

| 项目 | 值 |
| --- | --- |
| 数据集 ID | `opendatalab/OmniDocBench` ✅ |
| Revision（锁定用） | `aa1ee96d106dbe53d0ae59474d75c6e6d9b53fec` ✅ |
| 最后修改 | 2026-06-26 ✅ |
| 核心文件 | `images/`（1651 张：981 jpg + 670 png）、`OmniDocBench.json`、`README.md`、`README_ZH.md` ✅ |
| 版本脉络 | v1.0（2024-12）→ 2025-09-25 扩 374 页并升级 200 DPI → 2026-04-09 新增 296 页困难子集并修正 v1.5 标注；官方 README 将当前全量称为 **v1.6 full release** ✅ |
| 使用限制 | 仅研究用途、不可商用；PDF 来自公开渠道，未授权内容已移除 ✅ |

### 4.2 数据规模与分布（本地解析结果）✅

| 统计项 | 值 |
| --- | ---: |
| 总页数 | 1651 |
| 文档类型 | book 276 · PPT2PDF 253 · academic_literature 215 · exam_paper 193 · colorful_textbook 159 · newspaper 151 · magazine 149 · research_report 132 · note 118 · historical_document 5 |
| 语言 | english 755 · simplified_chinese 765 · en_ch_mixed 116 · traditional_chinese 13 · other 2 |
| 版面 | single_column 887 · other_layout 372 · double_column 184 · 1andmore_column 155 · three_column 53 |
| 子集标记 | `v1.5` 1355 · `equation_hard` 100 · `layout_hard` 99 · `table_hard` 97（困难子集合计 296） |
| Block 标注 | 32798 个（28 类）；text_block 16520（全部带 text）· title 4441 · figure 1385 · table 665（全部带 HTML）· equation_isolated 2066（带 LaTeX）等 |
| Relation 标注 | parent_son 1686 · truncated 1166 |
| 特殊难点属性 | watermark 73 · colorful_backgroud 266 · fuzzy_scan 30 · table_span 111 · 手写/形变等若干 |

### 4.3 标注 schema 要点

每页为 JSON 对象：`layout_dets[]`（block 级：`category_type / poly / ignore / order / anno_id / text / latex / html / attribute / line_with_spans / merge_list`）+ `page_info`（`page_no / height / width / image_path / page_attribute`）+ `extra.relation[]`。

页面属性含 `data_source / language / layout / watermark / fuzzy_scan / colorful_backgroud / subset / special_issue`；表格属性含 `table_layout / with_span / line / language / include_equation / include_backgroud / table_vertical`；文字属性含 `text_language / text_background / text_rotate`。

⚠️ 说明：README 描述的 4 类 span 级标注（text_span 等）在当前 JSON 的 `line_with_spans` 中未出现（本地解析为 0）。Notebook 01 的字段展示以解析到的实际内容为准，不凭空展示 span。

### 4.4 评测代码仓库

| 项目 | 值 |
| --- | --- |
| 仓库 | `https://github.com/opendatalab/OmniDocBench` ✅ |
| Release / Tag | **无**（GitHub API 与网页均确认） ✅ |
| 锁定 commit | `193627ae9e97d89188468ed1ee3b7a856ff76044`（main 最新，2026-08-13 网页核实） ✅ |

锁仓策略（任务文件要求）：无 release 时锁定明确 commit，Notebook 07 和 `experiment_metadata.json` 记录该 hash；升级时重新审计。

官方评测维度：end-to-end（含 **end2end** 与 **md2md** 两条路径）、layout detection、table recognition、formula recognition、text OCR；指标族包括 Edit Distance / BLEU / METEOR、TEDS、CDM、mAP、Reading Order。⚠️ 各指标的具体参数与官方 eval 脚本安装方式，Phase 2 必须从锁定 commit 的 README/`configs` 复核后固化进 `src/evaluation.py`，不允许自行发明指标实现。

---

## 5. 官方源审计：docling

| 项目 | 值 |
| --- | --- |
| 仓库 | `https://github.com/docling-project/docling` ✅ |
| 最新 release | **v2.119.0**（约 2026-08-10） ✅ |
| 在路线中的角色 | Notebook 00 需要 `docling-core` 做 DocTags → DoclingDocument 转换；完整 docling 仅作对照工具介绍，不作为主线依赖 |

⚠️ `docling-core` 版本与 3.2 节 API 弃用风险直接相关：优先锁定与模型卡示例兼容或已适配新 API 的版本，Phase 2 实测后写入 `requirements-kaggle.txt`。

---

## 6. Kaggle 环境审计与限制

来源：Kaggle 官方文档 + 本仓库 `learning/04_Kaggle.md` 原则。⚠️ 以下数值以官方文档当前说明为参考，**首次实际运行后必须用 `nvidia-smi` 等命令记录真实值**（任务文件要求 Notebook 自动输出 GPU/CUDA/VRAM/PyTorch/transformers/docling 版本）。

| 项目 | 结论 |
| --- | --- |
| GPU 供给 | 免费额度常见 NVIDIA Tesla T4 x2 / P100（各 16 GB VRAM）；型号与配额随供给变化，不假设固定型号 ⚠️ |
| 显存判断 | SmolDocling 256M BF16 权重约 0.5 GB，激活与 KV cache 在 T4 16 GB 上充裕；SFT/LoRA 与全量 1651 页推理均可行 ⚠️（首次运行核实峰值显存） |
| 会话限制 | 交互会话有单次时长上限（约 9 小时），免费 GPU 有每周配额 ⚠️ 以官方 Efficient GPU usage 页为准 |
| 目录规则 | `/kaggle/input` 只读挂载；输出写 `/kaggle/working`；Notebook 禁止硬编码绝对路径 |
| 磁盘 | `/kaggle/working` 约 20 GB（随供给变化）⚠️；OmniDocBench 图片与缓存需实测总占用 |
| 联网 | Kaggle Notebook 可开启 Internet（数据集下载、模型下载可用）；本地开发环境需自行解决 HF 可达性 |
| 断点恢复 | Notebook 版本化保存 + 输出缓存/checkpoint 机制（results/ 目录 + resume/skip 逻辑），防止会话结束后全量重跑 |

---

## 7. 技术依赖

| 用途 | 包 | 说明 |
| --- | --- | --- |
| 深度学习 | `torch` | 优先用 Kaggle 镜像自带版本 |
| 模型加载/推理 | `transformers` | 需兼容 Idefics3 与 `AutoModelForVision2Seq` ⚠️ 首跑锁定 |
| DocTags 转换 | `docling-core` | ⚠️ 版本决定 3.2 节用哪条 API 路径 |
| 图像/数值/进度 | `pillow`、`numpy`、`tqdm` | 基础依赖 |
| 训练 | `peft`（LoRA）、`accelerate`、`datasets` | Notebook 05/06 使用 |
| 评测 | OmniDocBench 官方 eval suite | 从锁定 commit 按官方安装方式引入 ⚠️ |
| 分析可视化 | `pandas`、`matplotlib` | 错误分析与消融 |

`requirements-kaggle.txt` 策略：先写入候选版本（标注来源），每个 Notebook 首跑后回填实测版本；不用 `pip install -U everything`。

---

## 8. Notebook 架构

### 8.1 五阶段学习路线

```text
Stage 1 Use       00 Environment  01 OmniDocBench
Stage 2 Experiment 02 Dataset     03 Prompt      04 Baseline
Stage 3 Train      05 SFT         06 LoRA
Stage 4 Evaluate   07 Benchmark   08 Error Analysis
Stage 5 Research   09 Ablation    10 Research Questions
```

### 8.2 实现顺序（任务文件 Phase 2–4）

1. **Phase 2**：`src/` + `configs/` + Notebook 00 / 01 / 04 / 07 —— 先打通 Environment → Dataset → Baseline → Benchmark 最小科研闭环并真实运行；
2. **Phase 3**：Notebook 02 / 03 / 05 / 06 —— 数据工程、Prompt 实验、SFT、LoRA；
3. **Phase 4**：Notebook 08 / 09 / 10 —— 错误分析、消融、科研问题形成。

### 8.3 每个 Notebook 的统一结构

`# Learning Objectives → Why This Matters → Concepts → Step-by-Step Experiment → What You Should Observe → Research Checkpoint → Exercises（含 TODO）→ Takeaways`，比例约 解释 30% / 代码 50% / 分析 20%。教师答案进 `solutions/`，学生版保留 TODO。

### 8.4 src/ 模块与模型解耦

```text
src/
├── data.py            # OmniDocBench 加载/解析/split/manifest
├── model.py           # DocumentModelAdapter 抽象 + SmolDoclingAdapter
├── inference.py       # 批推理/缓存/resume/skip
├── prompts.py         # PROMPT_V0..V3 + prompt_id 管理
├── training.py        # SFT/LoRA 训练循环
├── evaluation.py      # 官方评测封装（锁定 commit）
├── visualization.py   # 标注/输出/错误可视化
└── error_analysis.py  # 错误分类与 worst/best/regression 选择
```

`DocumentModelAdapter` 接口（load / predict(image, prompt) / save_prediction），SmolDocling 为第一实现；后续可扩展 QwenVL / PaddleOCR-VL adapter，Benchmark 框架不变。

### 8.5 三种运行模式

- `FAST_MODE`：3–20 页（smoke / 调试）；
- `FULL_TEACHING_MODE`：50–200 页（教学评测）；
- `RESEARCH_MODE`：官方 1651 页全量（仅评测，严禁训练）。

### 8.6 实验产物与元数据

```text
results/
├── baseline/          # Notebook 04 输出（预测 + 缓存 + manifest）
├── sft/               # Notebook 05 输出
├── lora/              # Notebook 06 输出（adapter 可重新加载）
├── benchmark/         # Notebook 07 官方评测结果与分片统计
├── error_cases.json   # Notebook 08 错误分类案例库
├── ablation_results.csv   # Notebook 09
├── experiment_metadata.json   # 数据集/模型/代码 revision + 环境（每次运行自动记录）
└── experiment_manifest.json  # 全部实验条目索引
```

固定 `SEED=42`；每次实验记录 experiment_id、timestamp、model/revision、dataset/revision、OmniDocBench commit、prompt_id、hyperparameters、metrics、runtime。

---

## 9. 数据使用原则（Notebook 02 的核心红线）

1. OmniDocBench 本质是 Benchmark：官方 **不提供 SFT 训练 split**，不得虚构官方训练集；
2. **Teaching Mode**：为教学 SFT 建立明确标记的 derived teaching subset（从 v1.5 部分抽取），产物标注 `NOT for official benchmark claims`；
3. **Research Mode**：train / validation / official test 严格隔离；官方 1651 页（含困难子集）只用于最终评测；
4. 禁止把 benchmark test 训练后再在同一集合报告成绩（contamination/data leakage 在 Notebook 02 显式讲解）。

---

## 10. 风险清单

| # | 风险 | 影响 | 缓解措施 | 状态 |
| --- | --- | --- | --- | --- |
| R1 | SmolDocling preview 已被 granite-docling-258M 接替，不再更新 | 接口/兼容性长期风险 | 锁定 revision `ce51f56c…`；adapter 解耦；设计文档记录后继模型 | 已记录 |
| R2 | docling-core API 变更（DocTagsDocument / load_from_doctags 弃用） | Notebook 00 转换链路可能报错 | 已实测：docling-core 2.91.0 下旧 API 可用，src/model.py 双路径兼容并记录实际路径 | 已处理 |
| R3 | transformers 版本与 Idefics3 / flash_attention_2 兼容性 | 模型加载失败或显存异常 | 已实测：transformers 5.0.0 + AutoModelForVision2Seq 加载成功；P100 无 sm_60 kernel 自动回退 CPU（eager） | 已处理 |
| R4 | GitHub API 限流（审计期间已触发 403） | 后续审计/锁定受限 | commit 已锁定并写入本文档；网页核对为兜底方式 | 已处理 |
| R5 | OmniDocBench 数据仅研究用途 | 不可商用、不可再分发 | 仓库只存 manifest 与下载脚本，不提交数据本体 | 已记录 |
| R6 | Kaggle GPU 型号/配额波动 | 训练时间预算不稳定 | 已实测：本轮分配 P100 且与镜像 torch 不兼容，自动回退 CPU；排障方案写入 notebooks/README.md | 已记录 |
| R7 | 全量 1651 页评测可能超出单次会话 | 结果丢失 | 缓存 + skip 已有输出 + 分片评测 + 版本化保存 | 设计中 |
| R8 | 国内网络访问 HF 受限 | 本地开发困难 | 主平台为 Kaggle（可直连）；本地替代方案仅在 Notebook 00 作为可选说明，标注非官方 | 已记录 |
| R9 | 评测指标细节与实现未知（官方 eval 配置未逐项核实） | 报告不可比 | Phase 2 从锁定 commit 复核官方 README/configs 后固化，禁止自造指标 | 待实测 |

---

## 11. Phase 2 待核实清单（2026-08-13 Kaggle 实测后更新）

- [x] Kaggle 实测 GPU：Tesla P100-PCIE-16GB · CUDA 12.8 · Python 3.12.13 · torch 2.10.0+cu128 · transformers 5.0.0 · docling-core 2.91.0；
- [x] docling-core 2.91.0 下 DocTags→DoclingDocument：模型卡旧 API（`DocTagsDocument.from_doctags_and_image_pairs → DoclingDocument.load_from_doctags`）实测生效，src/model.py 已记录实际路径；
- [x] transformers 5.0.0 加载 SmolDocling（AutoModelForVision2Seq）成功；P100 无 sm_60 kernel → 自动回退 CPU（eager），flash_attention_2 未实际启用；
- [x] HF 数据集在 Kaggle 下载：89.8 s，images 1.38 GB + 42 MB 标注，1651 页统计与 §4.2 完全一致；
- [x] fast 模式真实时间：12 页 ≈ 3 h（CPU，894 s/页）；
- [ ] OmniDocBench 官方 eval suite 安装方式与配置（仍需从 commit `193627ae…` 复核；本次 smoke 仅运行非官方自检）；
- [ ] T4/L4 GPU 上的真实推理路径（本次未分配到）。

---

## 12. 验收标准（对齐任务文件）

1. **Smoke Test**：3–5 页 OmniDocBench 全链路通过；
2. **Teaching Test**：10–20 页基线 + 官方评测出分；
3. **Training Test**：小 subset 完成 LoRA 训练 → 保存 adapter → 重载 → 推理 → 评测；
4. **Reproducibility Test**：全新 Kaggle Notebook 上 git clone → install → download dataset → load model → run 成功。

任何因网络/配额/GPU 限制无法验证的项目，在交付说明中明确标记，不假装运行成功。

---

## 13. Phase 2 完成记录（2026-08-13）

### 13.1 已交付

- `src/`：config / data / model / prompts / inference / evaluation / visualization（含 DocumentModelAdapter 抽象与 SmolDoclingAdapter）；
- `configs/default.yaml`：模式页数（fast 12 / teaching 100 / research 1651）、模型与数据集锁定 revision、官方评测 commit 与命令模板占位；
- `prompts/v0–v3.txt`、`requirements-kaggle.txt`（候选版本，待首跑锁定）；
- Notebook 00 / 01 / 04 / 07（由 `scripts/build_notebooks.py` 生成，统一八段结构，学生版 TODO + `solutions/` 教师答案）；
- `scripts/run_baseline.py`、`scripts/run_benchmark.py` 命令行入口；`.gitignore` 增加 results/data/third_party 排除；
- `notebooks/README.md`：五阶段路线、Kaggle 运行步骤、三条红线。

### 13.2 已完成的本地验证

- ✅ 全部 Python 模块 `py_compile` 通过；4 个 `.ipynb` JSON 结构验证通过；`configs/default.yaml` YAML 解析通过；
- ✅ 用官方 `OmniDocBench.json` 实测 `src/data`：1651 页、665 表格、2523 公式、subset 分布与设计文档 §4.2 一致；分层抽样与 teaching-only 抽样正确；prompts 与编辑距离自检正常。

### 13.3 尚未验证（必须如实标注，不得假装运行成功）

- ❌ 官方评测 CLI 模板填写与官方指标出分（`configs/default.yaml` 模板留空，Notebook 07 自动跳过官方评测；本次 smoke 仅运行非官方自检 sanity_ned=0.454/12 页）；
- ❌ T4/L4 GPU 上的真实推理路径（本次分配到的 P100 与镜像 torch 不兼容，已自动回退 CPU）；
- ❌ 支持 sm_60 的 torch 构建（如需恢复 P100 GPU 路径，另行验证）。

### 13.4 Kaggle 实测记录（2026-08-13，smoke v6，全步骤通过，errors={}）

| 项目 | 实测值 |
| --- | --- |
| GPU | Tesla P100-PCIE-16GB（15.9 GB）· CUDA 12.8 · ⚠️ 无 sm_60 kernel → 自动回退 CPU |
| Python / torch / transformers | 3.12.13 · 2.10.0+cu128（镜像）· 5.0.0（镜像） |
| docling-core / huggingface_hub | 2.91.0 · 1.11.0（pip 安装） |
| 依赖安装 | 4.5 s |
| 数据集下载 | 89.8 s（images 1.38 GB + 42 MB 标注；统计与 §4.2 一致） |
| 模型加载 | 14.3 s（revision `ce51f56c…`；AutoModelForVision2Seq） |
| 首次推理（合成页） | 55.0 s（推理 53.8 s，CPU） |
| fast 基线 12 页 | 10,736 s ≈ 2.98 h（CPU，平均 894 s/页，seed 42，prompt v0） |
| md2md 导出 + smoke 自检 | 46 s（12 个 md 文件；sanity_ned overall 0.454） |
| 总耗时 | 10,964 s ≈ 3.05 h |

教学影响：CPU 单页约 15 分钟，`teaching`（100 页 ≈ 25 h）与 `research`（1651 页）不可行；
排障顺序（已写入 notebooks/README.md）：争取 T4/L4 分配 → CPU 时降低 max_new_tokens/页数 →
验证 sm_60 兼容 torch 构建（未验证）。

### 13.5 Phase 3 完成记录（2026-08-13）

已交付：

- `src/data.py` 新增：`build_teaching_split` / `write_split_manifest`（仅 v1.5 页面、分层、确定性、marker 标记）、`page_to_doctags`（GT → DoclingDocument → DocTags 的近似转换，跳过的类别显式记录）、`build_sft_records`；
- 新增 `src/training.py`：`SFTDataset`（label mask 只监督 assistant 目标）、`collate_fn`、`parameter_report`、`setup_lora`（peft，r/alpha/dropout/target_modules）、`train_sft`（grad accumulation / max_steps / val loss / 显存与耗时记录 / checkpoint）；
- Notebook 02（Dataset Engineering）、03（Prompt Engineering）、05（SFT Fundamentals）、06（LoRA Fine-Tuning），均含 TODO 练习与 `solutions/` 教师答案；
- `run_baseline` 增加 `n_pages` 覆盖参数（CPU 环境小样本实验用）。

已完成的本地验证：全部 py_compile 通过；8 个 Notebook JSON 与代码单元编译通过；`build_teaching_split` 用官方标注实测（train/val 无重叠、全部 v1.5）。

⚠️ 未在 Kaggle 实测：Notebook 02/03/05/06 的运行时行为（SFT/LoRA 训练在 CPU 上仅设计为 2-step 冒烟；`page_to_doctags` 的具体 docling-core API 行为、peft target_modules 命中等需首跑确认）。GPU（T4/L4）分配后建议按 Notebook 顺序实测一次再回填。

### 13.6 Phase 4 完成记录（2026-08-13）

已交付：

- 新增 `src/error_analysis.py`：9 类错误分类学、基于 SequenceMatcher/重复检测/结构标记的启发式分类（显式标注「非官方结论，需人工复核」）、`build_error_cases` / `taxonomy_summary` / `select_worst_cases` / `select_improvement_cases`；
- 新增 `src/ablation.py`：`ablation_record`（固定量+变量+指标）/ `write_ablation_csv` / `plot_ablation`；
- Notebook 08（Error Analysis）、09（Ablation Study，四组消融 A–D 设计）、10（From Experiments to Research Questions：证据汇总 → 模式 → RQ Canvas → 一页 Mini Proposal）；
- `solutions/nb08–nb10` 教师答案；README 五阶段表 08/09/10 标记为已实现。

⚠️ 未实测项：Notebook 08–10 依赖的「官方评测分数」尚未产生（官方 CLI 模板仍留空），当前使用非官方 sanity 分数演示全流程；GPU 上完成一次 SFT/LoRA 后回填真实消融数据。

### 13.7 全局状态与下一步

- 11 个 Notebook（00–10）与 `src/`（9 个模块）全部就位，任务文件 §四 的结构完成；
- 剩余回填项：官方评测 CLI 模板（锁定 commit `193627ae…` 核对后填写）、T4/L4 GPU 实测（或 sm_60 兼容 torch 方案）、Phase 3/4 Notebook 的 Kaggle 首跑记录；
- 下一步：完成一次「Smoke → Teaching → Training」三级验收（任务文件 §二十五），并将实测结果回填 README 与本文档。

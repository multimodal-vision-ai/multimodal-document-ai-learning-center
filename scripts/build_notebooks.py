"""生成 notebooks/ 下的 .ipynb（Phase 2：00 / 01 / 04 / 07）。

设计原则（docs/notebook-design.md §8）：
- Notebook 是「实验台」，可复用逻辑下沉到 src/；
- 统一结构：Learning Objectives → Why This Matters → Concepts →
  Step-by-Step → What You Should Observe → Research Checkpoint →
  Exercises（TODO）→ Takeaways；
- 学生版保留 TODO，教师参考答案在 solutions/；
- 本脚本是这四个 Notebook 的生成源，可重复执行覆盖输出；
  后续在 Kaggle UI 中直接修改的 Notebook，请把最终版本保存回仓库。
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
NOTEBOOKS_DIR = ROOT / "notebooks"


def md(source: str) -> Dict:
    return {"cell_type": "markdown", "metadata": {}, "source": [source]}


def code(source: str) -> Dict:
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [source],
    }


def write_notebook(name: str, cells: List[Dict]) -> None:
    notebook = {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3",
            },
            "language_info": {"name": "python"},
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }
    out = NOTEBOOKS_DIR / name
    out.write_text(
        json.dumps(notebook, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print("wrote", out)


# ---------------------------------------------------------------------------
# 共享代码单元：定位仓库根目录（兼容 /kaggle/working 根目录与子目录两种布局）
# ---------------------------------------------------------------------------

HEADER = '''
# 仓库路径定位：兼容「Notebook 位于仓库根目录」与「仓库克隆在 /kaggle/working 子目录」
from pathlib import Path
import sys

REPO_ROOT = Path.cwd().resolve()
if not (REPO_ROOT / "src" / "model.py").exists():
    matches = [p for p in REPO_ROOT.iterdir() if p.is_dir() and (p / "src" / "model.py").exists()]
    if not matches:
        raise FileNotFoundError(
            "未找到仓库根目录。请按 notebooks/README.md 把仓库克隆到 /kaggle/working，"
            "或把本 Notebook 放在仓库根目录。"
        )
    REPO_ROOT = matches[0].resolve()
sys.path.insert(0, str(REPO_ROOT))
print("REPO_ROOT =", REPO_ROOT)
'''


# ---------------------------------------------------------------------------
# Notebook 00 — Environment and First Run
# ---------------------------------------------------------------------------

NB00 = [
    md(
        "# Notebook 00 — Environment and First Run\n"
        "\n"
        "> **阶段**：Stage 1 Use · **预计时间**：20–40 分钟（含模型下载）· **平台**：Kaggle Notebook（开启 GPU）\n"
        "\n"
        "| 资源 | 估算 | 说明 |\n"
        "| --- | --- | --- |\n"
        "| GPU VRAM | 待实测 | 256M 权重约 0.5 GB；P100 会被自动回退 CPU（见 README 排障） |\n"
        "| GPU 时间 | 实测：模型加载 14 s + 首推理 54 s（CPU） | 含权重下载 |\n"
        "| 磁盘 | 约 1.5 GB | 模型缓存 |\n"
        "| Internet | 需要 | 首次下载模型 |\n"
    ),
    md(
        "# Learning Objectives\n"
        "\n"
        "完成本 Notebook 后，你应该能够：\n"
        "\n"
        "- 在 Kaggle 上检查 GPU 与环境版本并保存快照；\n"
        "- 用官方推荐接口加载 SmolDocling-256M-preview；\n"
        "- 完成一次页面图像 → DocTags → DoclingDocument → Markdown/JSON 的完整推理；\n"
        "- 用自己的话解释 SmolDocling 与传统 OCR 流水线的区别。\n"
    ),
    md(
        "# Why This Matters\n"
        "\n"
        "之后所有 Notebook（数据、基线、训练、评测）都建立在这个最小闭环之上。"
        "这里不解决「模型好不好」，而是保证「从图像到结构化输出的链路可复现」。"
        "版本快照是本课程的实验规范：没有环境记录的实验结果不可信。\n"
    ),
    md(
        "# Concepts\n"
        "\n"
        "```text\n"
        "Document Image\n"
        "      ↓\n"
        "Vision Encoder\n"
        "      ↓\n"
        "Multimodal Model（Idefics3 架构）\n"
        "      ↓\n"
        "Structured Generation\n"
        "      ↓\n"
        "DocTags（结构化中间表示）\n"
        "      ↓\n"
        "DoclingDocument → Markdown / JSON / HTML\n"
        "```\n"
        "\n"
        "- **DocTags**：SmolDocling 的输出格式，同时携带文本、结构、坐标与阅读顺序（延伸阅读：`docs/reading/04_doctags.md`）；\n"
        "- **DoclingDocument**：Docling 生态的统一文档对象，DocTags 是其一种输入/导出表示；\n"
        "- **官方 Prompt**：`Convert this page to docling.`（模型卡原样）。\n"
    ),
    md(
        "## Step 1 — 检查 Kaggle GPU 与环境\n"
        "\n"
        "先运行下面的环境快照。它自动记录 GPU 型号、VRAM、CUDA、PyTorch、"
        "transformers、docling-core 版本——这些信息会进入之后每次实验的元数据。\n"
    ),
    code(HEADER + "\nfrom src.inference import environment_snapshot\nimport json\nprint(json.dumps(environment_snapshot(), ensure_ascii=False, indent=2))\n"),
    md(
        "## Step 2 — 安装依赖\n"
        "\n"
        "依赖清单固定在本仓库 `requirements-kaggle.txt`。Kaggle 镜像自带 torch/"
        "transformers 时不要重装；缺哪个装哪个。首次运行后，把实际生效的版本回填到"
        "清单注释里（见 `docs/notebook-design.md` §7 的策略）。\n"
    ),
    code(
        '# 首次运行时取消注释（逐条安装，避免覆盖镜像自带版本）：\n'
        '# !pip install docling-core huggingface_hub pyyaml --quiet\n'
        '# !pip show transformers docling-core | grep -E "^(Name|Version)"\n'
    ),
    md("## Step 3 — 加载 SmolDocling-256M-preview\n"),
    code(
        HEADER
        + "\n"
        "from src.model import SmolDoclingAdapter, model_summary\n"
        "\n"
        "adapter = SmolDoclingAdapter().load()  # 默认 device=auto, dtype=auto, attention=auto\n"
        "print(model_summary(adapter))\n"
    ),
    md(
        "## Step 4 — 准备一张简单文档图像\n"
        "\n"
        "为了不依赖外部文件，我们用 PIL 在本地合成一页「标题 + 段落 + 表格 + 公式」"
        "的简单文档。真实页面在 Notebook 01 用 OmniDocBench 数据替换。\n"
    ),
    code(
        HEADER
        + "\n"
        "from PIL import Image, ImageDraw, ImageFont\n"
        "\n"
        "def make_sample_document():\n"
        "    img = Image.new('RGB', (900, 1000), 'white')\n"
        "    d = ImageDraw.Draw(img)\n"
        "    try:\n"
        "        font_title = ImageFont.truetype('DejaVuSans-Bold.ttf', 42)\n"
        "        font_body = ImageFont.truetype('DejaVuSans.ttf', 24)\n"
        "    except OSError:\n"
        "        font_title = font_body = ImageFont.load_default()\n"
        "    d.text((60, 50), 'SmolDocling Test Document', fill='black', font=font_title)\n"
        "    d.text((60, 130), 'This page is a simple synthetic sample generated locally.', fill='black', font=font_body)\n"
        "    d.text((60, 180), 'It contains a title, a paragraph and a small table.', fill='black', font=font_body)\n"
        "    rows = [('Item', 'Quantity', 'Price'), ('Pen', '2', '1.50'), ('Paper', '1', '4.00'), ('Total', '', '5.50')]\n"
        "    for r, row in enumerate(rows):\n"
        "        for c, cell in enumerate(row):\n"
        "            x, y = 60 + c * 260, 260 + r * 48\n"
        "            d.rectangle([x, y, x + 250, y + 40], outline='black', width=2)\n"
        "            d.text((x + 8, y + 8), cell, fill='black', font=font_body)\n"
        "    d.text((60, 520), 'E = mc^2', fill='black', font=font_body)\n"
        "    return img\n"
        "\n"
        "sample_image = make_sample_document()\n"
        "display(sample_image)\n"
    ),
    md("## Step 5 — 第一次推理\n"),
    code(
        HEADER
        + "\n"
        "prediction = adapter.predict(sample_image)\n"
        "print('latency_sec =', prediction['latency_sec'])\n"
        "print('device =', prediction['device'], '| dtype =', prediction['dtype'])\n"
    ),
    md(
        "## Step 6 — 看四种输出：raw / DocTags / Markdown / JSON\n"
        "\n"
        "SmolDocling 直接生成的是 **DocTags**（带结构、坐标、阅读顺序的标记文本），"
        "再经 `docling-core` 转成 `DoclingDocument`，最后导出 Markdown / JSON / HTML。\n"
    ),
    code(
        HEADER
        + "\n"
        "# 6.1 raw generation（模型原始输出）\n"
        "print(prediction['doctags'][:2000])\n"
    ),
    code(
        HEADER
        + "\n"
        "# 6.2 DocTags -> DoclingDocument -> Markdown / JSON\n"
        "from src.model import doctags_to_docling\n"
        "\n"
        "doc, api_path = doctags_to_docling(prediction['doctags'], sample_image)\n"
        "print('实际生效的转换 API:', api_path)  # docling-core 新旧 API 兼容（设计文档风险 R2）\n"
        "\n"
        "markdown = doc.export_to_markdown()\n"
        "print('----- Markdown -----')\n"
        "print(markdown[:1500])\n"
        "\n"
        "doc_dict = doc.export_to_dict()\n"
        "print('----- DoclingDocument 顶层字段 -----')\n"
        "print(list(doc_dict.keys()))\n"
    ),
    code(
        HEADER
        + "\n"
        "import json\n"
        "out_dir = REPO_ROOT / 'results' / 'nb00'\n"
        "out_dir.mkdir(parents=True, exist_ok=True)\n"
        "(out_dir / 'first_run.md').write_text(markdown, encoding='utf-8')\n"
        "(out_dir / 'first_run_doctags.txt').write_text(prediction['doctags'], encoding='utf-8')\n"
        "(out_dir / 'first_run_doc.json').write_text(json.dumps(doc_dict, ensure_ascii=False, indent=2), encoding='utf-8')\n"
        "(out_dir / 'metadata.json').write_text(json.dumps(prediction, ensure_ascii=False, indent=2), encoding='utf-8')\n"
        "print('已保存:', out_dir)\n"
    ),
    md(
        "## Step 7 — SmolDocling 到底在做什么\n"
        "\n"
        "SmolDocling 是一个 **端到端 VLM**：它不把 OCR、版面分析、表格识别拆成"
        "独立模块，而是直接学习「页面图像 + 指令 → DocTags」。因此：\n"
        "\n"
        "- 传统 OCR 输出纯文本，版面、表格、公式、阅读顺序需要额外模块恢复，误差逐级累积；\n"
        "- SmolDocling 输出结构化 DocTags，文本与结构在同一生成过程中联合建模；\n"
        "- 代价是输出可能包含幻觉，结构稳定性需要下游验证（这正是后面 Benchmark / Error Analysis 要研究的问题）。\n"
        "\n"
        "| | 传统 Modular OCR | SmolDocling（端到端 VLM） |\n"
        "| --- | --- | --- |\n"
        "| 输出 | 文本行/框 | DocTags（文本+结构+坐标+顺序） |\n"
        "| 结构恢复 | 后置模块 | 联合生成 |\n"
        "| 可检查性 | 每步可查 | 需解析/验证输出 |\n"
        "| 幻觉风险 | 低 | 需要专门评估 |\n"
    ),
    md(
        "# What You Should Observe\n"
        "\n"
        "- DocTags 里能同时看到 `<loc_*>` 坐标、`<table>`/`<otsl>`、`<formula>` 等结构标记；\n"
        "- 同一份 DocTags 可以无损导出 Markdown 与 JSON，二者信息量不同（JSON 保留更多结构）；\n"
        "- `metadata.json` 记录了 model revision、prompt、latency——这就是实验证据链的起点。\n"
    ),
    md(
        "# Research Checkpoint\n"
        "\n"
        "回答下面的问题（教师参考答案见 `solutions/nb00_answers.md`，先自己想再对照）：\n"
        "\n"
        "> **SmolDocling 与传统 OCR 最大的区别是什么？** 从输出内容、"
        "误差传播方式和需要验证的风险三个方面回答。\n"
        "\n"
        "**TODO：** 把你的答案写在 `results/nb00/research_checkpoint.md`。\n"
    ),
    md(
        "# Exercises\n"
        "\n"
        "1. **TODO：** 修改合成文档：加一个列表、把表格换成三线表样式，重跑推理，"
        "观察 DocTags 对应部分有什么变化；\n"
        "2. **TODO：** 把 `model_summary(adapter)` 与 `environment_snapshot()` 的结果"
        "截图/记录到学习日志，标注实际 GPU 型号与 VRAM；\n"
        "3. **TODO：** 用 `adapter.predict(sample_image, prompt='Convert this page to docling.')` "
        "与 `max_new_tokens=1024` 各跑一次，记录 latency 与输出截断现象，说明原因。\n"
    ),
    md(
        "# Takeaways\n"
        "\n"
        "- 可复现实验从环境快照开始；\n"
        "- SmolDocling 的输出链路是 图像 → DocTags → DoclingDocument → 多格式导出；\n"
        "- 端到端 VLM 与传统 OCR 的差别决定了后面必须单独评测幻觉与结构错误。\n"
        "\n"
        "**下一步**：[Notebook 01](01_Understanding_OmniDocBench.ipynb) — 理解我们将要评测的数据。\n"
    ),
]


# ---------------------------------------------------------------------------
# Notebook 01 — Understanding OmniDocBench
# ---------------------------------------------------------------------------

NB01 = [
    md(
        "# Notebook 01 — Understanding OmniDocBench\n"
        "\n"
        "> **阶段**：Stage 1 Use · **预计时间**：40–60 分钟 · **平台**：Kaggle Notebook\n"
        "\n"
        "| 资源 | 估算 | 说明 |\n"
        "| --- | --- | --- |\n"
        "| GPU VRAM | 不需要 GPU | 纯数据理解 |\n"
        "| GPU 时间 | 0 | CPU 即可 |\n"
        "| 磁盘 | 实测 1.38 GB 图片 + 42 MB 标注 | 下载 images/ 与 OmniDocBench.json |\n"
        "| Internet | 需要（首次） | Hugging Face 下载 |\n"
    ),
    md(
        "# Learning Objectives\n"
        "\n"
        "完成本 Notebook 后，你应该能够：\n"
        "\n"
        "- 说明 OmniDocBench 的数据版本、规模与文件结构；\n"
        "- 读懂标注 schema（layout_dets / page_info / relation）；\n"
        "- 可视化不同文档类型的标注并解释差异；\n"
        "- 用统计数字说明「Benchmark 不是单一数字，而是一组难度不同的数据」。\n"
    ),
    md(
        "# Why This Matters\n"
        "\n"
        "在训练任何模型之前先理解 Benchmark：它测什么、数据长什么样、哪些页面难。"
        "否则后面得到的所有分数都无法解释。本 Notebook 不训练、不评测，只建立数据直觉。\n"
    ),
    md(
        "# Concepts\n"
        "\n"
        "- **OmniDocBench**：面向真实文档的端到端文档解析 Benchmark（CVPR 2025，arXiv:2412.07626）；\n"
        "- **官方数据**：HF `opendatalab/OmniDocBench`，锁定 revision `aa1ee96d…`；\n"
        "- **版本**：1651 页全量（README 称 v1.6），其中 296 页为 2026-04 新增的困难子集"
        "（equation_hard 100 / layout_hard 99 / table_hard 97），其余 1355 页来自 v1.5；\n"
        "- **评测维度**：end-to-end（end2end / md2md）、layout、table、formula、text OCR；\n"
        "- **使用限制**：仅研究用途、不可商用。\n"
    ),
    md(
        "## Step 1 — 定位或下载数据\n"
        "\n"
        "先尝试自动定位（Kaggle Dataset 挂载或本地 data/ 目录）；找不到再下载。\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "\n"
        "try:\n"
        "    data_root = data.find_dataset_root()\n"
        "    print('dataset root:', data_root)\n"
        "except FileNotFoundError as e:\n"
        "    print(e)\n"
        "    print('请任选一种方式获取数据：')\n"
        "    print('A. Kaggle Add Input 添加官方 OmniDocBench 数据集（若有官方镜像）；')\n"
        "    print('B. 执行下一格从 Hugging Face 下载（约 1-2 GB，仅研究用途）。')\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "# 仅在数据缺失时运行：\n"
        "# data_root = data.download_dataset()\n"
        "# print('downloaded to:', data_root)\n"
    ),
    md(
        "## Step 2 — 读懂标注 schema\n"
        "\n"
        "每页是一个 JSON 对象：`layout_dets[]`（块级标注）+ `page_info`（页面元数据）"
        "+ `extra.relation[]`（图文关系与段落截断关系）。字段含义见官方 README。\n"
    ),
    code(
        HEADER
        + "\n"
        "import json\n"
        "from src import data\n"
        "\n"
        "annotations = data.load_annotations(data_root)\n"
        "print('总页数:', len(annotations))\n"
        "\n"
        "page0 = annotations[0]\n"
        "print('顶层字段:', list(page0.keys()))\n"
        "print('--- page_info ---')\n"
        "print(json.dumps(page0['page_info'], ensure_ascii=False, indent=2))\n"
        "print('--- 第一个 layout_det ---')\n"
        "print(json.dumps(page0['layout_dets'][0], ensure_ascii=False, indent=2)[:1500])\n"
    ),
    md(
        "## Step 3 — 可视化不同文档类型\n"
        "\n"
        "每种文档类型抽 1 页展示标注：不同颜色对应不同 block 类别，数字是阅读顺序。\n"
    ),
    code(
        HEADER
        + "\n"
        "import collections\n"
        "from src import data\n"
        "from src.visualization import draw_annotations\n"
        "import matplotlib.pyplot as plt\n"
        "\n"
        "annotations = data.load_annotations(data_root)\n"
        "by_type = collections.defaultdict(list)\n"
        "for p in annotations:\n"
        "    by_type[data.page_attribute(p).get('data_source', 'unknown')].append(p)\n"
        "\n"
        "for name in sorted(by_type):\n"
        "    if name == 'unknown':\n"
        "        continue\n"
        "    page = by_type[name][0]\n"
        "    img = data.load_page_image(data_root, page)\n"
        "    fig = draw_annotations(img, page, title='document_type = %s (%d pages)' % (name, len(by_type[name])))\n"
        "    display(fig)\n"
        "    plt.close(fig)\n"
    ),
    md(
        "## Step 4 — 统计分析\n"
        "\n"
        "统计文档类型 / 语言 / 版面 / 子集分布，以及 block 类别与表格、公式数量。"
        "这些数字应与 `docs/notebook-design.md` §4.2 的官方审计数字一致。\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "\n"
        "annotations = data.load_annotations(data_root)\n"
        "stats = data.build_stats(annotations)\n"
        "print('总页数:', stats['pages'])\n"
        "for key in ('document_type', 'language', 'layout', 'subset'):\n"
        "    print(key, '=', stats[key])\n"
        "print('table:', stats['table'])\n"
        "print('formula:', stats['formula'])\n"
        "print('relation:', stats['relation'])\n"
        "top = sorted(stats['block_category'].items(), key=lambda kv: -kv[1])[:15]\n"
        "print('block 类别 Top15:', top)\n"
    ),
    md(
        "# What You Should Observe\n"
        "\n"
        "- `subset` 字段把页面分成 v1.5 与三个困难子集——评测与教学子集划分要用它；\n"
        "- 同一文档类型内部差异也可能很大（language / layout / watermark / fuzzy_scan 等属性）；\n"
        "- 表格 665 个、公式相关 2523 个：一个 Overall 分数会把这些难度混在一起。\n"
    ),
    md(
        "# Research Checkpoint\n"
        "\n"
        "> **为什么说 Benchmark 不是「一个数字」，而是一组难度不同的数据？** "
        "用你今天看到的至少两类分布（文档类型、困难子集）说明：一个平均分会隐藏什么问题。\n"
        "\n"
        "**TODO：** 把答案写在 `results/nb01/research_checkpoint.md`。\n"
    ),
    md(
        "# Exercises\n"
        "\n"
        "1. **TODO：** 选一种文档类型（例如 exam_paper），统计它的语言与版面分布，"
        "并找出 2 页最难辨认的页面（利用 page_attribute 的 special_issue）；\n"
        "2. **TODO：** 对比 `equation_hard` 与普通 v1.5 页面的平均公式数量，"
        "说明官方为什么把这 100 页单独标记；\n"
        "3. **TODO：** 用 `data.sample_id()` 确认：同一 image_path 是否唯一对应一页？"
        "写一个断言验证。\n"
    ),
    md(
        "# Takeaways\n"
        "\n"
        "- OmniDocBench = 1651 页真实文档 + 28 类块级标注 + 属性标签 + 关系标注；\n"
        "- 数据理解先于模型训练：分布、子集、属性决定后面如何切片分析；\n"
        "- 官方数据仅研究用途，仓库只保存 revision 与下载方式，不提交数据本体。\n"
        "\n"
        "**下一步**：[Notebook 04](04_Baseline_Inference.ipynb) — 建立 zero-shot 基线。\n"
    ),
]


# ---------------------------------------------------------------------------
# Notebook 04 — Baseline Inference
# ---------------------------------------------------------------------------

NB04 = [
    md(
        "# Notebook 04 — Baseline Inference\n"
        "\n"
        "> **阶段**：Stage 2 Experiment · **预计时间**：30–90 分钟（取决于模式）· **平台**：Kaggle Notebook（GPU）\n"
        "\n"
        "| 资源 | fast | teaching | research |\n"
        "| --- | --- | --- | --- |\n"
        "| 页数 | 12 | 100 | 1651 |\n"
        "| 实测时间 | ≈ 3 h（CPU，894 s/页） | CPU 不可行（≈25 h） | 仅 GPU 或分段（见 README 排障） |\n"
        "| 磁盘 | 小 | 中 | 需缓存策略 |\n"
    ),
    md(
        "# Learning Objectives\n"
        "\n"
        "完成本 Notebook 后，你应该能够：\n"
        "\n"
        "- 建立 SmolDocling 的 **zero-shot baseline**（不做任何训练/调 prompt）；\n"
        "- 使用分层抽样得到可解释的评测子集；\n"
        "- 运行带缓存、断点恢复的批量推理；\n"
        "- 解释为什么 baseline 是后续所有对比的锚点。\n"
    ),
    md(
        "# Why This Matters\n"
        "\n"
        "没有 baseline，任何 SFT/LoRA 的提升都无法归因。Baseline 回答："
        "「这个模型在固定数据、固定 prompt、固定采样下，zero-shot 是什么水平？」"
        "之后每次实验只改变一个变量。\n"
    ),
    md(
        "# Concepts\n"
        "\n"
        "- **三种模式**：`fast`（调试）/ `teaching`（教学评测）/ `research`（官方 1651 页全量，仅评测）；\n"
        "- **分层抽样**：按文档类型轮转抽样，避免某一类型主导小样本；\n"
        "- **缓存与恢复**：每个样本一个 JSON，重启后自动跳过已有输出——Notebook 关闭不丢结果；\n"
        "- **元数据**：每个预测记录 prompt_id / model revision / image_id / generation_config / latency。\n"
    ),
    md(
        "## Step 1 — 配置与模式\n"
        "\n"
        "所有默认值在 `configs/default.yaml`。Baseline 使用官方默认 prompt `v0`，"
        "`do_sample=False`（贪心解码），保证可复现。\n"
    ),
    code(
        HEADER
        + "\n"
        "from src.config import load_config\n"
        "\n"
        "cfg = load_config()\n"
        "print('modes:', cfg['modes'])\n"
        "print('generation:', cfg['generation'])\n"
    ),
    md("## Step 2 — 加载模型并选择子集\n"),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "from src.model import SmolDoclingAdapter, model_summary\n"
        "\n"
        "MODE = 'fast'  # TODO: 学生改为 teaching 观察规模差异\n"
        "\n"
        "data_root = data.find_dataset_root()\n"
        "annotations = data.load_annotations(data_root)\n"
        "\n"
        "adapter = SmolDoclingAdapter().load()\n"
        "print(model_summary(adapter))\n"
    ),
    md(
        "## Step 3 — 批量推理（缓存 + 进度条 + 断点恢复）\n"
        "\n"
        "产物结构（`results/baseline/`）：\n"
        "\n"
        "```text\n"
        "predictions/<image_id>.json   # 每次推理的完整记录\n"
        "doctags/<image_id>.dt         # 原始 DocTags\n"
        "manifest.jsonl                # 本次所有样本行\n"
        "summary.json                  # 延迟/数量汇总\n"
        "```\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "from src.config import project_root\n"
        "from src.inference import run_baseline\n"
        "\n"
        "output_dir = project_root() / cfg['paths']['baseline_dir']\n"
        "manifest = run_baseline(\n"
        "    annotations,\n"
        "    data_root,\n"
        "    adapter,\n"
        "    output_dir=output_dir,\n"
        "    mode=MODE,\n"
        "    config=cfg,\n"
        "    prompt_id='v0',\n"
        "    skip_existing=True,\n"
        ")\n"
        "print('manifest:', manifest)\n"
    ),
    md("## Step 4 — 检查结果与元数据\n"),
    code(
        HEADER
        + "\n"
        "import json\n"
        "import collections\n"
        "from src import data\n"
        "\n"
        "rows = [json.loads(line) for line in manifest.read_text(encoding='utf-8').splitlines() if line.strip()]\n"
        "summary = data.read_json(manifest.parent / 'summary.json')\n"
        "print('summary:', json.dumps(summary, ensure_ascii=False, indent=2))\n"
        "doc_types = collections.Counter(r['document_type'] for r in rows)\n"
        "print('文档类型分布:', dict(doc_types))\n"
        "print('样例 doctags（前 500 字符）:')\n"
        "print(rows[0]['doctags'][:500])\n"
        "print('样例元数据字段:', sorted(k for k in rows[0] if k != 'doctags'))\n"
    ),
    md(
        "## Step 5 — 验证缓存与断点恢复\n"
        "\n"
        "再次运行同一命令：全部样本应从缓存命中（skipped = 全部），耗时应接近 0。"
        "这就是「Notebook 重启后不丢结果」的机制。\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "from src.config import project_root\n"
        "from src.inference import run_baseline\n"
        "\n"
        "manifest2 = run_baseline(\n"
        "    annotations, data_root, adapter,\n"
        "    output_dir=project_root() / cfg['paths']['baseline_dir'],\n"
        "    mode=MODE, config=cfg, prompt_id='v0', skip_existing=True,\n"
        ")\n"
        "summary2 = data.read_json(manifest2.parent / 'summary.json')\n"
        "print('第二次运行 skipped_from_cache =', summary2['skipped_from_cache'], '/', summary2['completed'])\n"
    ),
    md(
        "# What You Should Observe\n"
        "\n"
        "- summary.json 里的 mean_latency_sec 是单页推理成本——对比研究模式的预算；\n"
        "- 抽样子集按文档类型分层，小样本下分布更均衡；\n"
        "- 每条 prediction 都携带 model_revision 与 prompt_id，证据链完整。\n"
    ),
    md(
        "# Research Checkpoint\n"
        "\n"
        "> **为什么 baseline 必须是「固定数据 + 固定 prompt + 固定采样」？** "
        "如果中途换了任何一项，后续 SFT 前后对比还能成立吗？\n"
        "\n"
        "**TODO：** 把答案写在 `results/nb04/research_checkpoint.md`。\n"
    ),
    md(
        "# Exercises\n"
        "\n"
        "1. **TODO：** 把 `MODE` 改为 `teaching` 重跑，记录耗时与磁盘增量，估算 research 模式预算；\n"
        "2. **TODO：** 换 `prompt_id='v1'` 跑一个 fast 子集（注意会新建缓存条目），"
        "粗看 doctags 与 v0 的差异；\n"
        "3. **TODO：** 修改 `configs/default.yaml` 的 `generation.do_sample=true` 后重跑 3 页，"
        "观察输出随机性与 latency 变化，然后改回 false。\n"
    ),
    md(
        "# Takeaways\n"
        "\n"
        "- Baseline 是所有实验的锚点；\n"
        "- 缓存/断点恢复让 Kaggle 会话限制不再致命；\n"
        "- 元数据 = 证据链，缺失元数据的分数没有科研价值。\n"
        "\n"
        "**下一步**：[Notebook 07](07_Benchmark_and_Evaluation.ipynb) — 用官方评测给 baseline 打分。\n"
    ),
]


# ---------------------------------------------------------------------------
# Notebook 07 — Benchmark and Evaluation
# ---------------------------------------------------------------------------

NB07 = [
    md(
        "# Notebook 07 — Benchmark and Evaluation\n"
        "\n"
        "> **阶段**：Stage 4 Evaluate · **预计时间**：30–60 分钟 + 官方评测运行时间 · **平台**：Kaggle Notebook\n"
        "\n"
        "| 资源 | 估算 | 说明 |\n"
        "| --- | --- | --- |\n"
        "| GPU VRAM | 不需要 GPU | 评测是 CPU 任务 |\n"
        "| 磁盘 | 约 0.5 GB | 官方评测仓库 + 结果 |\n"
        "| 实测时间 | 46 s（12 页 smoke 自检） | 官方评测时间待实测 |\n"
        "| Internet | 需要（首次） | git clone 官方评测仓库 |\n"
    ),
    md(
        "# Learning Objectives\n"
        "\n"
        "完成本 Notebook 后，你应该能够：\n"
        "\n"
        "- 使用锁定 commit 的 OmniDocBench 官方评测仓库；\n"
        "- 把 baseline 的 DocTags 预测导出为官方评测输入（md2md / end2end）；\n"
        "- 运行官方评测并汇总总体与分组（语言/文档类型/版面）结果；\n"
        "- 区分「官方指标」与「非官方 smoke 自检」。\n"
    ),
    md(
        "# Why This Matters\n"
        "\n"
        "论文里报告的分数必须来自官方评测定义，而不是自造指标。"
        "同时，一个 Overall 分数会隐藏分组差异——分组切片才是后续错误分析的前提。\n"
    ),
    md(
        "# Concepts\n"
        "\n"
        "- **官方评测仓库**：`opendatalab/OmniDocBench` 无 release/tag，锁定 commit `193627ae…`（评测代码 v1.7）；\n"
        "- **官方入口**：`python pdf_validation.py --config <yaml>`；该 commit 的 `configs/` 只有 `end2end.yaml`（md2md.yaml 仅在 v1_5 分支）；\n"
        "- **end2end 输入**：ground_truth = 标注 JSON（可用页面子集），prediction = 每页一个 `.md` 文件的文件夹；\n"
        "- **官方指标族**：Edit Distance / BLEU / METEOR（文本）、TEDS（表格）、CDM（公式）、"
        "mAP（版面）、Reading Order 指标——以官方脚本实现为准；\n"
        "- **红线**：本 Notebook 的 normalized edit distance 只是 pipeline 自检，"
        "**不是官方指标**，不能用于报告结论。\n"
    ),
    md(
        "## Step 1 — 准备官方评测仓库（锁定 commit + Python 3.12 依赖）\n"
        "\n"
        "首次运行会 `git clone` 官方仓库并 checkout 到锁定 commit；"
        "再次运行校验 commit 一致。官方要求 Python 3.10，Kaggle 是 3.12："
        "不要执行官方 `pip install -e .`（旧版 lxml 无 3.12 轮子），"
        "改用 `evaluation.install_official_deps()` 安装不锁版本依赖。\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import evaluation\n"
        "from src.config import project_root\n"
        "\n"
        "repo = evaluation.ensure_eval_repo(project_root() / 'third_party')\n"
        "print('官方评测仓库:', repo)\n"
        "print('锁定 commit:', evaluation.OFFICIAL_COMMIT)\n"
        "# 官方评测依赖（Python 3.12 兼容，不锁版本）\n"
        "evaluation.install_official_deps()\n"
    ),
    md(
        "## Step 2 — 从 baseline 缓存导出 Markdown 预测（官方 end2end 输入）\n"
        "\n"
        "把 `results/baseline/predictions/*.json` 里的 DocTags 转成 Markdown 文件。\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import data, evaluation\n"
        "from src.config import load_config, project_root\n"
        "\n"
        "cfg = load_config()\n"
        "data_root = data.find_dataset_root()\n"
        "base = project_root() / cfg['paths']['baseline_dir']\n"
        "md_dir = project_root() / cfg['paths']['benchmark_dir'] / 'md2md'\n"
        "files = evaluation.export_markdown_predictions(base / 'predictions', data_root, md_dir)\n"
        "print('导出 Markdown 预测:', len(files), '个 ->', md_dir)\n"
    ),
    md(
        "## Step 3 — 运行官方评测（pdf_validation.py）\n"
        "\n"
        "`src/evaluation.py` 会按官方 `end2end.yaml` 结构生成配置（CDM 默认关闭），"
        "再执行锁定 commit 的官方入口。官方结果写入仓库 result/ 目录；"
        "模板为空或评测环境缺失时自动跳过，只做非官方 smoke 自检。\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import evaluation\n"
        "from src.config import load_config, project_root\n"
        "\n"
        "cfg = load_config()\n"
        "bench = project_root() / cfg['paths']['benchmark_dir']\n"
        "gt_json = evaluation.gt_subset_for_predictions(md_dir, annotations, bench / 'gt_subset.json')\n"
        "log = evaluation.run_official_eval(\n"
        "    cfg, repo, gt_json=gt_json, pred_dir=md_dir, output_dir=bench,\n"
        ")\n"
        "if log is None:\n"
        "    print('⚠️ 官方评测未运行（模板/环境不可用），本次跳过；')\n"
        "    print('⚠️ 下面是「非官方 smoke 自检」，仅验证 pipeline 贯通，不得作为成绩。')\n"
        "else:\n"
        "    print('官方评测日志:', log)\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import data, evaluation\n"
        "\n"
        "annotations = data.load_annotations(data_root)\n"
        "rows = evaluation.sanity_check(base / 'predictions', annotations, data_root)\n"
        "print('非官方 smoke 自检样本数:', len(rows))\n"
        "print(rows[0])\n"
    ),
    md(
        "## Step 4 — 汇总与分组切片\n"
        "\n"
        "按 document_type / language / layout 分组看均值："
        "一个 Overall 分数会隐藏的差异从这里开始显现。\n"
    ),
    code(
        HEADER
        + "\n"
        "import json\n"
        "from src import data, evaluation\n"
        "from src.config import project_root\n"
        "\n"
        "summary = evaluation.build_summary_table(rows)\n"
        "print(json.dumps(summary, ensure_ascii=False, indent=2))\n"
        "bench = project_root() / cfg['paths']['benchmark_dir']\n"
        "data.write_json(summary, bench / 'summary.json')\n"
        "data.write_json(rows, bench / 'sanity_rows.json')\n"
    ),
    md(
        "## Step 5 — Baseline / SFT / LoRA 对比表骨架\n"
        "\n"
        "Phase 3 的 Notebook 05/06 会把 SFT 与 LoRA 结果填进同一张表。"
        "现在先把 Baseline 行放好，确保三个模型使用同一评测流程。\n"
    ),
    code(
        HEADER
        + "\n"
        "import pandas as pd\n"
        "\n"
        "comparison = pd.DataFrame(columns=['model', 'text', 'table', 'formula', 'reading_order', 'overall', 'notes'])\n"
        "# 官方评测出分后，从官方输出 JSON 填回；smoke 自检值只写进 notes，不写进指标列\n"
        "comparison.loc[0] = ['baseline_smoldocling', None, None, None, None, None, 'smoke: %d pages' % len(rows)]\n"
        "display(comparison)\n"
    ),
    md(
        "# What You Should Observe\n"
        "\n"
        "- 官方评测与 smoke 自检的输出结构完全不同：前者有指标族与配置，后者只有 pipeline 贯通证据；\n"
        "- 分组切片里，difficult subset（equation_hard 等）与普通页面的差距通常很明显；\n"
        "- 官方评测的配置（指标参数、对齐方式）必须与锁定 commit 一致，否则数字不可比。\n"
    ),
    md(
        "# Research Checkpoint\n"
        "\n"
        "> **「一个 Overall Score 会隐藏大量问题」——用你今天的分组结果举例说明："
        "哪类页面/语言/版面被平均分掩盖了？这如何影响你选择下一步研究问题？**\n"
        "\n"
        "**TODO：** 把答案写在 `results/nb07/research_checkpoint.md`。\n"
    ),
    md(
        "# Exercises\n"
        "\n"
        "1. **TODO：** 跑通一次真正的官方 end2end 评测（入口 `pdf_validation.py --config`），"
        "并记录官方指标 JSON 的位置与使用的 metric 集合（CDM 是否开启）；"
        "有余力再用 `src.evaluation.export_end2end_predictions` 导出 end2end 候选格式"
        "（字段与类别映射需按官方 README 核对修正）；\n"
        "2. **TODO：** 挑出 smoke 自检中得分最低的 3 页，手动对比 prediction 与 GT，"
        "初步判断错误来自 OCR、表格还是阅读顺序（详细分类在 Notebook 08）；\n"
        "3. **TODO：** 把 baseline 结果填入对比表后，检查：SFT/LoRA 未来填表时，"
        "哪些前提（prompt、采样、评测 commit）必须保持不变？\n"
    ),
    md(
        "# Takeaways\n"
        "\n"
        "- 官方评测锁定 commit，指标以官方实现为准；\n"
        "- smoke 自检 ≠ 官方成绩，两者用途不同；\n"
        "- 分组切片是错误分析与研究问题的最早信号。\n"
        "\n"
        "**下一步**：Phase 3 — [Notebook 03](03_Prompt_Engineering.ipynb)（Prompt 实验）、"
        "[Notebook 05](05_SFT_Fundamentals.ipynb) 与 [Notebook 06](06_LoRA_Fine_Tuning.ipynb)（训练）。\n"
    ),
]


# ---------------------------------------------------------------------------
# Notebook 02 — Dataset Engineering
# ---------------------------------------------------------------------------

NB02 = [
    md(
        "# Notebook 02 — Dataset Engineering\n"
        "\n"
        "> **阶段**：Stage 2 Experiment · **预计时间**：40–60 分钟（CPU 可完成） · **平台**：Kaggle Notebook\n"
        "\n"
        "数据不是「下载下来就训练」。本 Notebook 走完 检查 → 清理 → 划分 → 训练样本 的完整工程链。\n"
    ),
    md(
        "# Learning Objectives\n"
        "\n"
        "- 理解 Benchmark 数据与训练数据的关系与红线（contamination / leakage）；\n"
        "- 建立确定性的 train/validation 教学子集并写出 manifest；\n"
        "- 把官方 layout_dets 转换成 SFT 训练样本（图像 + 指令 + 目标 DocTags）；\n"
        "- 能说明哪些转换是近似、哪些字段被跳过。\n"
    ),
    md(
        "# Why This Matters\n"
        "\n"
        "OmniDocBench 首先是 Benchmark：官方 1651 页用于评测，没有 SFT train split。"
        "如果拿测试页训练又在该集合报成绩，就是 data leakage，论文结论不可信。"
        "数据工程的意义是先划清边界，再谈训练。\n"
    ),
    md(
        "# Concepts\n"
        "\n"
        "```text\n"
        "Raw OmniDocBench\n"
        "      ↓\n"
        "Inspect\n"
        "      ↓\n"
        "Clean / Validate\n"
        "      ↓\n"
        "Normalize\n"
        "      ↓\n"
        "Split（teaching: 仅 v1.5 子集）\n"
        "      ↓\n"
        "Training Samples（图像 + 指令 + 目标 DocTags）\n"
        "```\n"
        "\n"
        "- **Teaching Mode**：从 v1.5 子集抽取教学 train/val，产物标记 NOT for official claims；\n"
        "- **Research Mode**：train / validation / official benchmark test 严格隔离，官方测试只做最终评测。\n"
    ),
    md("## Step 1 — 检查原始数据\n"),
    code(
        HEADER
        + "\n"
        "import collections\n"
        "from src import data\n"
        "\n"
        "data_root = data.find_dataset_root()\n"
        "annotations = data.load_annotations(data_root)\n"
        "stats = data.build_stats(annotations)\n"
        "print('总页数:', stats['pages'])\n"
        "print('子集分布:', stats['subset'])\n"
        "\n"
        "# 特殊难点属性分布（special_issue）\n"
        "issues = collections.Counter()\n"
        "for p in annotations:\n"
        "    for s in data.page_attribute(p).get('special_issue', []) or []:\n"
        "        issues[str(s)] += 1\n"
        "print('special_issue Top10:', issues.most_common(10))\n"
    ),
    md(
        "## Step 2 — 清理与校验\n"
        "\n"
        "官方数据质量高，但教学工程仍要可复现的校验：ID 唯一、图像存在、"
        "文本非空、忽略标记（ignore=True 的块不参与训练目标）。\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "\n"
        "ids = [data.sample_id(p) for p in annotations]\n"
        "print('ID 唯一:', len(ids) == len(set(ids)))\n"
        "\n"
        "missing = []\n"
        "empty_text = 0\n"
        "ignored = 0\n"
        "for p in annotations:\n"
        "    if not data.page_image_path(data_root, p).is_file():\n"
        "        missing.append(data.sample_id(p))\n"
        "    for d in p.get('layout_dets', []) or []:\n"
        "        if d.get('ignore'):\n"
        "            ignored += 1\n"
        "        elif not d.get('text') and d.get('category_type') in ('text_block', 'title'):\n"
        "            empty_text += 1\n"
        "print('缺失图像:', missing[:5], '（共', len(missing), '）')\n"
        "print('被 ignore 的块:', ignored, '| 无文本的正文/标题块:', empty_text)\n"
    ),
    md(
        "## Step 3 — 划分教学子集\n"
        "\n"
        "`build_teaching_split` 只从 v1.5 页面分层抽样；manifest 记录 image_id、"
        "文档类型、语言、版面与子集标记。困难子集（equation/layout/table_hard）"
        "不进入教学训练集。\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "from src.config import project_root\n"
        "\n"
        "N_TRAIN = 8   # TODO: GPU 环境下改为 24–100\n"
        "N_VAL = 4\n"
        "split = data.build_teaching_split(annotations, n_train=N_TRAIN, n_val=N_VAL, seed=42)\n"
        "print('marker:', split['marker'])\n"
        "print('train:', len(split['train']), '| val:', len(split['val']))\n"
        "\n"
        "out_dir = project_root() / 'results' / 'teaching_split'\n"
        "data.write_split_manifest(split, out_dir)\n"
        "print('manifest 已写:', out_dir)\n"
    ),
    md(
        "## Step 4 — Research Mode 的隔离原则\n"
        "\n"
        "官方 1651 页（含困难子集）在 Phase 2 只用于 Baseline/评测（推理允许，"
        "训练禁止）。任何声称「OmniDocBench 成绩」的模型，其训练数据不得包含"
        "官方测试页。本 Notebook 的产物全部带 marker，防止混用。\n"
    ),
    md("## Step 5 — 生成训练样本（预览）\n"),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "from src.prompts import get_prompt\n"
        "\n"
        "records = data.build_sft_records(split['train'][:2], data_root, get_prompt('v0'))\n"
        "for r in records:\n"
        "    print('image_id:', r['image_id'])\n"
        "    print('instruction:', r['instruction'][:80])\n"
        "    print('target_doctags（前 400 字符）:')\n"
        "    print(r['target_doctags'][:400])\n"
        "    print('api_note:', r['api_note'], '| 跳过类别:', r['skipped_categories'])\n"
        "    print('---')\n"
    ),
    md(
        "# What You Should Observe\n"
        "\n"
        "- 训练目标 DocTags 是**派生转换**（layout_dets → DoclingDocument → DocTags），"
        "不是官方原生 SFT 数据；表格/公式结构被跳过时，文字仍按顺序保留；\n"
        "- manifest 与 marker 让任何后续使用者都能一眼看出数据边界。\n"
    ),
    md(
        "# Research Checkpoint\n"
        "\n"
        "> **为什么不能拿 Benchmark test set 训练后再报告成绩？** 从 data leakage、"
        "指标高估、以及论文复现性三个角度说明。\n"
        "\n"
        "**TODO：** 答案写入 `results/nb02/research_checkpoint.md`。\n"
    ),
    md(
        "# Exercises\n"
        "\n"
        "1. **TODO：** 检查 val 与 train 是否存在同一 image_id 重叠，写断言验证；\n"
        "2. **TODO：** 挑一个被 `page_to_doctags` 跳过的 table 页，说明为什么表格结构"
        "转换是难点，并提出一种保守的转换方案；\n"
        "3. **TODO：** 把 N_TRAIN 改小/改大各跑一次，观察 manifest 的文档类型分布变化"
        "（分层抽样是否保持均衡）。\n"
    ),
    md(
        "# Takeaways\n"
        "\n"
        "- 数据边界先于训练：teaching subset 与官方 benchmark 隔离是第一红线；\n"
        "- 派生训练目标必须如实标注近似性；\n"
        "- manifest 是可复现数据工程的产物，不是可有可无的记录。\n"
        "\n"
        "**下一步**：[Notebook 03](03_Prompt_Engineering.ipynb) — 把 Prompt 当作实验变量。\n"
    ),
]


# ---------------------------------------------------------------------------
# Notebook 03 — Prompt Engineering
# ---------------------------------------------------------------------------

NB03 = [
    md(
        "# Notebook 03 — Prompt Engineering\n"
        "\n"
        "> **阶段**：Stage 2 Experiment · **预计时间**：30–60 分钟（CPU 用小样本） · **平台**：Kaggle Notebook\n"
        "\n"
        "Prompt 本身就是实验变量。本 Notebook 用固定页面集合对比 v0–v3 的行为差异。\n"
    ),
    md(
        "# Learning Objectives\n"
        "\n"
        "- 理解为什么 Prompt 必须与数据、采样一样被固定和记录；\n"
        "- 在固定 subset 上运行多个 prompt，比较输出与延迟；\n"
        "- 建立 Prompt Benchmark Table（文本/表格/公式/阅读顺序的粗观察 + latency）。\n"
    ),
    md(
        "# Why This Matters\n"
        "\n"
        "模型能力上限由权重决定，但实际表现受 Prompt 影响。"
        "不记录 prompt_id 的实验无法复现，也无法归因——这是之后所有消融实验的纪律基础。\n"
    ),
    md(
        "# Concepts\n"
        "\n"
        "- v0：官方默认 full conversion；v1：强调 OCR；v2：强调阅读顺序/表格/公式/版面；v3：结构化解析指令；\n"
        "- 每次推理记录 prompt_id / model revision / image_id / generation_config / latency；\n"
        "- CPU 教学环境：本 Notebook 默认只用 3 页 × 2 个 prompt（约 1–1.5 h），GPU 上可扩到全部。\n"
    ),
    md("## Step 1 — 固定 subset（与后续实验同 seed 同页面）\n"),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "from src.config import load_config\n"
        "\n"
        "cfg = load_config()\n"
        "data_root = data.find_dataset_root()\n"
        "annotations = data.load_annotations(data_root)\n"
        "subset = data.select_pages(annotations, n=3, seed=42)\n"
        "print('固定页面:', [data.sample_id(p) for p in subset])\n"
    ),
    md("## Step 2 — 依次运行各 Prompt（缓存自动复用）\n"),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "from src.config import project_root\n"
        "from src.inference import run_baseline\n"
        "from src.model import SmolDoclingAdapter\n"
        "\n"
        "PROMPTS_TO_RUN = ['v0', 'v1']  # TODO: GPU 环境扩展到 v0-v3\n"
        "adapter = SmolDoclingAdapter().load()\n"
        "\n"
        "manifests = {}\n"
        "for pid in PROMPTS_TO_RUN:\n"
        "    out = project_root() / 'results' / ('prompt_' + pid)\n"
        "    m = run_baseline(\n"
        "        subset, data_root, adapter, output_dir=out,\n"
        "        mode='fast', config=cfg, prompt_id=pid, skip_existing=True, n_pages=len(subset),\n"
        "    )\n"
        "    manifests[pid] = m\n"
        "    print(pid, '->', m)\n"
    ),
    md("## Step 3 — Prompt Benchmark Table\n"),
    code(
        HEADER
        + "\n"
        "import json\n"
        "import pandas as pd\n"
        "from src import data, evaluation\n"
        "\n"
        "rows = []\n"
        "for pid, m in manifests.items():\n"
        "    summary = data.read_json(m.parent / 'summary.json')\n"
        "    preds = [json.loads(line) for line in m.read_text(encoding='utf-8').splitlines() if line.strip()]\n"
        "    sanity = evaluation.sanity_check(m.parent / 'predictions', annotations, data_root)\n"
        "    overall = sum(r['sanity_ned'] for r in sanity) / len(sanity) if sanity else None\n"
        "    rows.append({\n"
        "        'prompt': pid,\n"
        "        'pages': summary['completed'],\n"
        "        'mean_latency_sec': summary['mean_latency_sec'],\n"
        "        'mean_doctags_chars': round(sum(len(p['doctags']) for p in preds) / len(preds), 1) if preds else None,\n"
        "        'sanity_ned_mean': round(overall, 4) if overall is not None else None,\n"
        "        'metric_kind': 'non_official_smoke',\n"
        "    })\n"
        "bench = pd.DataFrame(rows)\n"
        "display(bench)\n"
        "data.write_json(rows, project_root() / 'results' / 'prompt_benchmark.json')\n"
    ),
    md(
        "# What You Should Observe\n"
        "\n"
        "- 不同 Prompt 下输出长度与延迟可能明显不同（长输出 = 更多 token = 更慢）；\n"
        "- sanity_ned 只是文本层面的粗信号；表格/公式/阅读顺序的差异要看 doctags 本身，"
        "正式结论必须等 Notebook 07 的官方指标；\n"
        "- 同一页面不同 prompt 的结果都带 prompt_id，可逐条对比。\n"
    ),
    md(
        "# Research Checkpoint\n"
        "\n"
        "> **Prompt 如何成为实验变量？** 用你今天的输出举例：哪个 Prompt 在哪类内容上"
        "行为不同？这如何影响你把 Prompt 写进实验设计（唯一变量原则）？\n"
        "\n"
        "**TODO：** 答案写入 `results/nb03/research_checkpoint.md`。\n"
    ),
    md(
        "# Exercises\n"
        "\n"
        "1. **TODO：** 找出两个 prompt 在**同一页面**上 doctags 差异最大的地方（例如表格/公式标记），"
        "说明差异来源；\n"
        "2. **TODO：** 给 v3 写一个你自己的变体 v4（放在 src/prompts.py），跑同一 subset 并加进对比表；\n"
        "3. **TODO：** 解释为什么「换了 prompt 之后分数变好」不能直接归因于「模型变强」。\n"
    ),
    md(
        "# Takeaways\n"
        "\n"
        "- Prompt 与数据、采样同属实验变量，必须记录 prompt_id；\n"
        "- 输出长度影响延迟：Prompt 评测表同时看内容与成本；\n"
        "- 正式指标在 Notebook 07，这里只做受控观察。\n"
        "\n"
        "**下一步**：[Notebook 05](05_SFT_Fundamentals.ipynb) — Fine-tuning 改变了什么。\n"
    ),
]


# ---------------------------------------------------------------------------
# Notebook 05 — SFT Fundamentals
# ---------------------------------------------------------------------------

NB05 = [
    md(
        "# Notebook 05 — SFT Fundamentals\n"
        "\n"
        "> **阶段**：Stage 3 Train · **预计时间**：60–120 分钟（CPU 冒烟） · **平台**：Kaggle Notebook\n"
        "\n"
        "重点不是刷分，而是理解 Supervised Fine-Tuning 到底改变了什么。\n"
    ),
    md(
        "# Learning Objectives\n"
        "\n"
        "- 构造 SFT 训练样本（图像 + 指令 + 目标 DocTags）并理解 label mask；\n"
        "- 走通 Dataset → Processor → Collator → Forward → Loss → Backward → Optimizer；\n"
        "- 完成一次小规模教学 SFT 并记录 training/validation loss 与资源消耗；\n"
        "- 回答：loss 下降是否等于 Document Parsing 变好？\n"
    ),
    md(
        "# Why This Matters\n"
        "\n"
        "SFT 是理解后续 LoRA、GRPO 等一切后训练方法的基础。"
        "先在小数据上观察 loss 行为与 before/after 差异，才能判断训练是否有意义。\n"
    ),
    md(
        "# Concepts\n"
        "\n"
        "```text\n"
        "Dataset\n"
        "   ↓\n"
        "Processor（图像 + chat template）\n"
        "   ↓\n"
        "Collator（padding / label mask）\n"
        "   ↓\n"
        "Forward → Loss（只算 assistant 部分）\n"
        "   ↓\n"
        "Backward → Optimizer\n"
        "```\n"
        "\n"
        "- **label mask**：prompt 位置置 -100，loss 只监督目标 DocTags；\n"
        "- **教学数据**：使用 Notebook 02 的 teaching subset（标记 NOT for official claims）；\n"
        "- **CPU 冒烟**：4 训练样本、max_steps=2；GPU 环境改为 20–100 样本。\n"
    ),
    md("## Step 1 — 构造训练样本\n"),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "from src.prompts import get_prompt\n"
        "\n"
        "data_root = data.find_dataset_root()\n"
        "annotations = data.load_annotations(data_root)\n"
        "split = data.build_teaching_split(annotations, n_train=4, n_val=2, seed=42)\n"
        "train_records = data.build_sft_records(split['train'], data_root, get_prompt('v0'))\n"
        "val_records = data.build_sft_records(split['val'], data_root, get_prompt('v0'))\n"
        "print('train records:', len(train_records), '| val records:', len(val_records))\n"
        "print('第一条记录目标前 200 字符:')\n"
        "print(train_records[0]['target_doctags'][:200])\n"
    ),
    md("## Step 2 — Dataset / Processor / Collator 与 label mask\n"),
    code(
        HEADER
        + "\n"
        "from src.model import SmolDoclingAdapter\n"
        "from src.training import SFTDataset, collate_fn\n"
        "\n"
        "adapter = SmolDoclingAdapter().load()\n"
        "train_ds = SFTDataset(train_records, adapter.processor)\n"
        "val_ds = SFTDataset(val_records, adapter.processor)\n"
        "\n"
        "sample = train_ds[0]\n"
        "print('input_ids shape:', tuple(sample['input_ids'].shape))\n"
        "print('pixel_values shape:', tuple(sample['pixel_values'].shape))\n"
        "masked = int((sample['labels'] == -100).sum())\n"
        "print('label mask 占比: %.1f%%（prompt 部分不计算 loss）' % (100 * masked / sample['labels'].numel()))\n"
    ),
    md("## Step 3 — 一次 Forward + Loss（不训练）\n"),
    code(
        HEADER
        + "\n"
        "import torch\n"
        "from src.training import collate_fn\n"
        "\n"
        "adapter.model.train()\n"
        "batch = {k: v.to(adapter.device) for k, v in collate_fn([train_ds[0]]).items()}\n"
        "with torch.set_grad_enabled(True):\n"
        "    outputs = adapter.model(**batch)\n"
        "loss = outputs.loss if hasattr(outputs, 'loss') else outputs[0]\n"
        "print('single-batch loss:', float(loss))\n"
    ),
    md("## Step 4 — 教学 SFT（CPU 冒烟：2 steps）\n"),
    code(
        HEADER
        + "\n"
        "from src.training import train_sft\n"
        "\n"
        "result = train_sft(\n"
        "    adapter.model,\n"
        "    train_ds,\n"
        "    val_dataset=val_ds,\n"
        "    epochs=1,\n"
        "    lr=1e-4,\n"
        "    batch_size=1,\n"
        "    max_steps=2,\n"
        "    device=adapter.device,\n"
        "    output_dir=REPO_ROOT / 'results' / 'sft' / 'teaching_smoke',\n"
        ")\n"
        "print(result)\n"
    ),
    md(
        "# What You Should Observe\n"
        "\n"
        "- training_summary.json 记录了 loss、steps、lr、wall_sec 与设备（GPU 时含显存）；\n"
        "- 2 个 step 的 loss 变化没有统计意义——它是链路验证，不是性能证据；\n"
        "- checkpoint 保存在 results/sft/，Notebook 重启后可从断点继续。\n"
    ),
    md(
        "# Research Checkpoint\n"
        "\n"
        "> **Loss 下降是否意味着 Document Parsing 一定变好？** 给出至少两个反例场景，"
        "并说明为什么最终必须回到 Benchmark 与错误分析。\n"
        "\n"
        "**TODO：** 答案写入 `results/nb05/research_checkpoint.md`。\n"
    ),
    md(
        "# Exercises\n"
        "\n"
        "1. **TODO：** 在 GPU 环境把 n_train 提到 20–100、max_steps 提高，观察 train/val loss 曲线；\n"
        "2. **TODO：** 训练前后各用 `max_new_tokens=512` 对同一页推理一次，"
        "对比 doctags 差异（注意 CPU 上控制在 1 页）；\n"
        "3. **TODO：** 解释 label mask 的作用：如果不做 mask，loss 会包含什么、可能带来什么行为。\n"
    ),
    md(
        "# Takeaways\n"
        "\n"
        "- SFT 的最小闭环 = 样本 + 掩码 + 训练循环 + 记录；\n"
        "- loss 曲线是训练健康度信号，不是任务性能证据；\n"
        "- 教学数据来自 derived subset，与官方 benchmark 隔离。\n"
        "\n"
        "**下一步**：[Notebook 06](06_LoRA_Fine_Tuning.ipynb) — 参数高效的微调。\n"
    ),
]


# ---------------------------------------------------------------------------
# Notebook 06 — LoRA Fine-Tuning
# ---------------------------------------------------------------------------

NB06 = [
    md(
        "# Notebook 06 — LoRA Fine-Tuning\n"
        "\n"
        "> **阶段**：Stage 3 Train · **预计时间**：40–90 分钟（CPU 冒烟） · **平台**：Kaggle Notebook\n"
        "\n"
        "LoRA 是资源—性能的权衡方法，不是神奇开关。本 Notebook 让你亲眼看到参数量与代价。\n"
    ),
    md(
        "# Learning Objectives\n"
        "\n"
        "- 理解 Full Fine-Tuning 与 LoRA 的差异（可训练参数、显存、速度）；\n"
        "- 掌握 r / alpha / dropout / target_modules 的含义；\n"
        "- 打印并比较 r=4/8/16 的 trainable 参数量；\n"
        "- 完成 adapter 保存 → 重载 → 推理的最小闭环并记录资源数据。\n"
    ),
    md(
        "# Why This Matters\n"
        "\n"
        "256M 模型全量微调在 T4 16GB 上可行但昂贵；LoRA 把可训练参数降到千分之几，"
        "让 Kaggle 免费 GPU 成为训练平台。理解其中的权衡才能正确设计实验。\n"
    ),
    md(
        "# Concepts\n"
        "\n"
        "| | Full Fine-Tuning | LoRA |\n"
        "| --- | --- | --- |\n"
        "| 更新对象 | 全部权重 | 低秩增量 A·B（冻结原权重） |\n"
        "| 可训练参数 | ~100% | 通常 <1% |\n"
        "| 显存/速度 | 高/慢 | 低/快 |\n"
        "| 关键超参 | lr、epochs | r、alpha、dropout、target_modules |\n"
    ),
    md("## Step 1 — 基线参数量\n"),
    code(
        HEADER
        + "\n"
        "from src.model import SmolDoclingAdapter\n"
        "from src.training import parameter_report\n"
        "\n"
        "adapter = SmolDoclingAdapter().load()\n"
        "base = parameter_report(adapter.model)\n"
        "print('base:', base)\n"
    ),
    md("## Step 2 — 加上 LoRA（r=8）\n"),
    code(
        HEADER
        + "\n"
        "from src.training import setup_lora, parameter_report\n"
        "\n"
        "BASE_MODEL = adapter.model  # 保留原始模型副本，供 Step 5 做 r 对照\n"
        "adapter.model = setup_lora(adapter.model, r=8, alpha=16, dropout=0.05)\n"
        "lora = parameter_report(adapter.model)\n"
        "print('LoRA r=8:', lora)\n"
        "print('可训练参数减少为全量的 %.4f%%' % (100 * lora['trainable_parameters'] / base['total_parameters']))\n"
    ),
    md("## Step 3 — LoRA 冒烟训练（记录显存/时间）\n"),
    code(
        HEADER
        + "\n"
        "from src import data\n"
        "from src.prompts import get_prompt\n"
        "from src.training import SFTDataset, train_sft\n"
        "\n"
        "data_root = data.find_dataset_root()\n"
        "annotations = data.load_annotations(data_root)\n"
        "split = data.build_teaching_split(annotations, n_train=4, n_val=2, seed=42)\n"
        "records = data.build_sft_records(split['train'], data_root, get_prompt('v0'))\n"
        "ds = SFTDataset(records, adapter.processor)\n"
        "\n"
        "result = train_sft(\n"
        "    adapter.model, ds, epochs=1, lr=2e-4, batch_size=1,\n"
        "    max_steps=2, device=adapter.device,\n"
        "    output_dir=REPO_ROOT / 'results' / 'lora' / 'r8_smoke',\n"
        ")\n"
        "print(result)\n"
    ),
    md("## Step 4 — 保存 adapter → 重载 → 推理\n"),
    code(
        HEADER
        + "\n"
        "import torch\n"
        "\n"
        "ckpt = REPO_ROOT / 'results' / 'lora' / 'r8_smoke' / 'adapter.pt'\n"
        "state = torch.load(ckpt, map_location='cpu')\n"
        "adapter.model.load_state_dict(state)\n"
        "print('adapter 已重载:', ckpt, '| 参数键数:', len(state))\n"
    ),
    md("## Step 5 — r=4/8/16 参数量对比（不训练）\n"),
    code(
        HEADER
        + "\n"
        "import copy\n"
        "from src.training import setup_lora, parameter_report\n"
        "\n"
        "table = []\n"
        "for r in (4, 8, 16):\n"
        "    m = setup_lora(copy.deepcopy(BASE_MODEL), r=r, alpha=2*r)\n"
        "    rep = parameter_report(m)\n"
        "    table.append({'r': r, 'trainable': rep['trainable_parameters'], 'trainable_pct': rep['trainable_pct']})\n"
        "import pandas as pd\n"
        "display(pd.DataFrame(table))\n"
    ),
    md(
        "# What You Should Observe\n"
        "\n"
        "- r 增大 → 可训练参数线性增长，但训练更慢、显存更高；\n"
        "- 参数量小 ≠ 一定更差：任务难度决定需要的秩；\n"
        "- smoke 训练的 2 个 step 无法比较 r 的性能，GPU 上的完整对比才是证据。\n"
    ),
    md(
        "# Research Checkpoint\n"
        "\n"
        "> **为什么说 LoRA 是资源—性能的权衡，而不是一个神奇开关？** 结合你今天看到的"
        "可训练参数比例、r 的代价，以及需要验证的三个前提（数据、评测、唯一变量）作答。\n"
        "\n"
        "**TODO：** 答案写入 `results/nb06/research_checkpoint.md`。\n"
    ),
    md(
        "# Exercises\n"
        "\n"
        "1. **TODO：** 在 GPU 环境完成 r=4/8/16 各一次小训练（同数据、同 step 数），"
        "记录 VRAM/时间/val loss，并用 Notebook 07 评测对比；\n"
        "2. **TODO：** 改变 target_modules（例如只留 q_proj/v_proj），观察可训练参数变化"
        "并解释对表达能力的影响；\n"
        "3. **TODO：** 把 alpha 固定为 2r 之外的取值（如 alpha=r），说明 lora_alpha 缩放"
        "机制（lora_alpha/r）对有效学习率的影响。\n"
    ),
    md(
        "# Takeaways\n"
        "\n"
        "- LoRA 让 Kaggle 免费 GPU 训练 256M 模型成为可能；\n"
        "- 打印参数报告是每个 LoRA 实验的必修动作；\n"
        "- 超参对比遵循唯一变量原则，且必须回到官方评测。\n"
        "\n"
        "**下一步**：Phase 4 — [Notebook 08](08_Error_Analysis.ipynb)（错误分析）、"
        "[Notebook 09](09_Ablation_Study.ipynb)（消融）与 [Notebook 10](10_From_Experiments_to_Research_Questions.ipynb)。\n"
    ),
]


# ---------------------------------------------------------------------------
# Notebook 08 — Error Analysis
# ---------------------------------------------------------------------------

NB08 = [
    md(
        "# Notebook 08 — Error Analysis\n"
        "\n"
        "> **阶段**：Stage 4 Evaluate · **预计时间**：30–50 分钟（CPU 可完成） · **平台**：Kaggle Notebook\n"
        "\n"
        "目标是回答「模型到底不会什么」，而不是「模型分数是多少」。\n"
    ),
    md(
        "# Learning Objectives\n"
        "\n"
        "- 建立可复查的错误分类学（Error Taxonomy）；\n"
        "- 从预测与 GT 自动生成 error_cases.json（含证据路径）；\n"
        "- 选择 Worst / Best-Improvement / Regression 三类案例；\n"
        "- 用错误分布提出下一步的研究假设。\n"
    ),
    md(
        "# Why This Matters\n"
        "\n"
        "同一 Overall 分数背后可以是完全不同的失败模式：OCR 错字、漏内容、"
        "表格丢失还是幻觉。错误分析把「分数差」变成「可研究的问题」，"
        "是论文问题形成前的最后一块拼图。\n"
    ),
    md(
        "# Concepts\n"
        "\n"
        "错误分类学（教学启发式，需人工复核）：\n"
        "\n"
        "```text\n"
        "OCR Error / Layout Error / Reading Order Error\n"
        "Table Error / Formula Error / Missing Content\n"
        "Hallucination / Repetition / Structure Error\n"
        "```\n"
        "\n"
        "自动分类依据：归一化编辑距离、SequenceMatcher 的缺失/插入占比、"
        "重复片段检测、页面是否含表格/公式而预测缺失对应标记。"
        "所有案例带 evidence 路径，便于逐条人工复查。\n"
    ),
    md("## Step 1 — 生成错误案例库\n"),
    code(
        HEADER
        + "\n"
        "from src import data, error_analysis\n"
        "from src.config import load_config, project_root\n"
        "\n"
        "cfg = load_config()\n"
        "data_root = data.find_dataset_root()\n"
        "annotations = data.load_annotations(data_root)\n"
        "pred_dir = project_root() / cfg['paths']['baseline_dir'] / 'predictions'\n"
        "\n"
        "cases = error_analysis.build_error_cases(\n"
        "    pred_dir, annotations, data_root,\n"
        "    output_path=project_root() / 'results' / 'error_cases.json',\n"
        ")\n"
        "print('案例数:', len(cases))\n"
        "print('错误类型分布:', error_analysis.taxonomy_summary(cases))\n"
    ),
    md("## Step 2 — 最差案例 Top N\n"),
    code(
        HEADER
        + "\n"
        "import json\n"
        "from src import error_analysis\n"
        "\n"
        "worst = error_analysis.select_worst_cases(cases, n=10)\n"
        "for c in worst[:5]:\n"
        "    print(json.dumps(c, ensure_ascii=False))\n"
    ),
    md(
        "## Step 3 — 改善最大与退化案例（训练前后对比）\n"
        "\n"
        "需要两份预测：baseline 与 fine-tuned。没有 SFT 预测时，"
        "先用两个 Prompt 目录演示同一对比函数（变量不同但流程相同）。\n"
    ),
    code(
        HEADER
        + "\n"
        "from src import data, error_analysis\n"
        "from src.config import project_root\n"
        "\n"
        "base_dir = project_root() / 'results' / 'prompt_v0' / 'predictions'\n"
        "other_dir = project_root() / 'results' / 'prompt_v1' / 'predictions'\n"
        "if base_dir.is_dir() and other_dir.is_dir():\n"
        "    base_cases = error_analysis.build_error_cases(base_dir, annotations, data_root)\n"
        "    other_cases = error_analysis.build_error_cases(other_dir, annotations, data_root)\n"
        "    comp = error_analysis.select_improvement_cases(base_cases, other_cases, n=5)\n"
        "    print('improved:', [c['image_id'] for c in comp['improved']])\n"
        "    print('regressed:', [c['image_id'] for c in comp['regressed']])\n"
        "else:\n"
        "    print('先运行 Notebook 03 生成 prompt_v0/v1 预测，或改用 SFT 预测目录。')\n"
    ),
    md(
        "## Step 4 — 复核一个最差案例\n"
        "\n"
        "自动分类只是入口。挑 1 个最差案例，打开 evidence 里的 prediction 与"
        "对应 GT 页面，人工判断：错误来自模型、转换还是评测对齐？把结论写回"
        "该案例的 notes 字段。\n"
    ),
    md(
        "# What You Should Observe\n"
        "\n"
        "- 错误类型分布通常不均：某 1–2 类占主导 → 这就是研究切入点；\n"
        "- worst 案例常有共同特征（多栏、手写、低分辨率、表格复杂）；\n"
        "- 改善与退化并存的页面说明训练不是单向变好。\n"
    ),
    md(
        "# Research Checkpoint\n"
        "\n"
        "> **模型到底不会什么？** 用你的 taxonomy 统计和 2 个具体案例回答，"
        "并说明这个结论与「平均分」的关系。\n"
        "\n"
        "**TODO：** 答案写入 `results/nb08/research_checkpoint.md`。\n"
    ),
    md(
        "# Exercises\n"
        "\n"
        "1. **TODO：** 对 Top5 最差案例逐条人工复核，把「模型错」与「评测/转换错」"
        "分开，更新 notes；\n"
        "2. **TODO：** 按 document_type 分组统计错误类型，找出系统性弱点子群；\n"
        "3. **TODO：** 写一个新的启发式分类器（例如「表格行列数不匹配」），"
        "加进 classify_case 并评估其对错率。\n"
    ),
    md(
        "# Takeaways\n"
        "\n"
        "- 分数说「差多少」，错误分析说「差在哪」；\n"
        "- 启发式分类需要证据路径与人工复核，不能直接当作结论；\n"
        "- 错误分布是研究假设的原材料。\n"
        "\n"
        "**下一步**：[Notebook 09](09_Ablation_Study.ipynb) — 用受控实验验证变量。\n"
    ),
]


# ---------------------------------------------------------------------------
# Notebook 09 — Ablation Study
# ---------------------------------------------------------------------------

NB09 = [
    md(
        "# Notebook 09 — Ablation Study\n"
        "\n"
        "> **阶段**：Stage 5 Research · **预计时间**：30 分钟设计 + GPU 实验时间 · **平台**：Kaggle Notebook\n"
        "\n"
        "设计你的第一个 Controlled Experiment：一次只改变一个主要变量。\n"
    ),
    md(
        "# Learning Objectives\n"
        "\n"
        "- 设计四组消融：Prompt / 训练数据量 / LoRA rank / 图像分辨率；\n"
        "- 坚持唯一变量原则并记录全部固定量；\n"
        "- 生成 ablation_results.csv 与图表；\n"
        "- 回答：哪个变量最影响 Text / Table / Formula？是否存在 diminishing returns？\n"
    ),
    md(
        "# Why This Matters\n"
        "\n"
        "消融是「变量 → 结果」因果推断的最低门槛。没有消融的提升报告，"
        "无法排除「分数涨了只是因为换了个 prompt」。\n"
    ),
    md(
        "# Concepts\n"
        "\n"
        "| Ablation | 变量 | 取值（Kaggle 可调） |\n"
        "| --- | --- | --- |\n"
        "| A Prompt | prompt_id | v0（simple）vs v2/v3（structured） |\n"
        "| B 数据量 | n_train | 25 / 50 / 100 / 200（GPU；CPU 冒烟 2/4/8） |\n"
        "| C LoRA Rank | r | 4 / 8 / 16（其余超参固定） |\n"
        "| D 分辨率 | image size | low / medium / high（按 processor 支持设置） |\n"
        "\n"
        "每组实验的固定量：模型 revision、数据划分 seed、评测 commit、"
        "generation config、评测页面集合。\n"
    ),
    md("## Step 1 — Ablation A（Prompt，复用 Notebook 03 结果）\n"),
    code(
        HEADER
        + "\n"
        "import json\n"
        "from src import data\n"
        "from src.config import project_root\n"
        "\n"
        "bench = project_root() / 'results' / 'prompt_benchmark.json'\n"
        "if bench.is_file():\n"
        "    print(json.dumps(data.read_json(bench), ensure_ascii=False, indent=2))\n"
        "else:\n"
        "    print('先运行 Notebook 03 生成 prompt_benchmark.json。')\n"
    ),
    md(
        "## Step 2 — Ablation B/C/D 的运行骨架\n"
        "\n"
        "下面的函数是骨架：B 复用 Notebook 05 的 train_sft，C 复用 Notebook 06 的 "
        "setup_lora，D 在预处理图像时改变分辨率。CPU 上只做最小冒烟；"
        "真实消融在 GPU 上跑并回填 ablation_results.csv。\n"
    ),
    code(
        HEADER
        + "\n"
        "from src.ablation import ablation_record\n"
        "\n"
        "FIXED = {'model_revision': 'ce51f56c', 'dataset_revision': 'aa1ee96d',\n"
        "        'eval_commit': '193627ae', 'seed': 42, 'eval_pages': 'fast-12'}\n"
        "\n"
        "# TODO: 每个取值跑完训练 + Notebook 07 评测后，把官方指标填入 metrics。\n"
        "# 示例（数据量消融）：\n"
        "rows_demo = [\n"
        "    ablation_record('B_data_size', 'n_train', '25', {'text': None, 'table': None, 'formula': None, 'overall': None}, FIXED),\n"
        "    ablation_record('B_data_size', 'n_train', '50', {'text': None, 'table': None, 'formula': None, 'overall': None}, FIXED),\n"
        "    ablation_record('B_data_size', 'n_train', '100', {'text': None, 'table': None, 'formula': None, 'overall': None}, FIXED),\n"
        "    ablation_record('B_data_size', 'n_train', '200', {'text': None, 'table': None, 'formula': None, 'overall': None}, FIXED),\n"
        "]\n"
        "print(rows_demo[0])\n"
    ),
    md("## Step 3 — 汇总 ablation_results.csv 并绘图\n"),
    code(
        HEADER
        + "\n"
        "from src.ablation import write_ablation_csv, plot_ablation\n"
        "from src.config import project_root\n"
        "\n"
        "csv_path = write_ablation_csv(rows_demo, project_root() / 'results' / 'ablation_results.csv')\n"
        "print('CSV:', csv_path)\n"
        "# fig = plot_ablation(rows_demo, x_key='n_train', y_keys=['text', 'table', 'formula', 'overall'], title='Ablation B: data size')\n"
        "# display(fig)\n"
    ),
    md(
        "# What You Should Observe\n"
        "\n"
        "- 如果某个变量的曲线先升后平，就是 diminishing returns；\n"
        "- Text/Table/Formula 对同一变量的响应可能不同——这正是研究问题的来源；\n"
        "- 任何一行缺失固定量记录，该行都不可信。\n"
    ),
    md(
        "# Research Checkpoint\n"
        "\n"
        "> 用（实测或预期的）曲线回答：哪个变量最影响 Text？哪个最影响 Table/Formula？"
        "哪个增加算力但几乎没有提升？是否存在 diminishing returns？\n"
        "\n"
        "**TODO：** 答案写入 `results/nb09/research_checkpoint.md`。\n"
    ),
    md(
        "# Exercises\n"
        "\n"
        "1. **TODO：** 在 GPU 上完成 Ablation B（至少 2 个数据量取值），回填 CSV；\n"
        "2. **TODO：** 完成 Ablation C（r=4/8/16），记录 VRAM/时间，与参数量对照；\n"
        "3. **TODO：** 设计 Ablation D 的分辨率档位（查 SmolDocling processor 支持的输入尺寸），"
        "并说明分辨率如何影响推理成本与表格/公式识别。\n"
    ),
    md(
        "# Takeaways\n"
        "\n"
        "- 消融的价值在于「可归因」，不在「图多」；\n"
        "- 固定量记录与唯一变量同样重要；\n"
        "- diminishing returns 是停止加预算的科学理由。\n"
        "\n"
        "**下一步**：[Notebook 10](10_From_Experiments_to_Research_Questions.ipynb) — 从实验走向科研问题。\n"
    ),
]


# ---------------------------------------------------------------------------
# Notebook 10 — From Experiments to Research Questions
# ---------------------------------------------------------------------------

NB10 = [
    md(
        "# Notebook 10 — From Experiments to Research Questions\n"
        "\n"
        "> **阶段**：Stage 5 Research · **预计时间**：60–90 分钟 · **平台**：任意环境\n"
        "\n"
        "收尾 Notebook：从 Benchmark + Error Analysis + Ablation 中生成真正的科学问题。\n"
    ),
    md(
        "# Learning Objectives\n"
        "\n"
        "- 自动汇总 Benchmark / Error / Ablation 三类证据；\n"
        "- 沿 Observation → Pattern → Cause → Hypothesis → Research Question → Experiment 形成问题；\n"
        "- 填写 Research Question Canvas 与一页 Mini Research Proposal；\n"
        "- 区分「证据支持的问题」与「凭空编的论文题目」。\n"
    ),
    md(
        "# Why This Matters\n"
        "\n"
        "科研训练的目标不是调参，而是把观察变成可检验的假设。"
        "本 Notebook 强制每个研究问题都挂到具体证据上。\n"
    ),
    md(
        "# Concepts\n"
        "\n"
        "```text\n"
        "Observation（数据里的现象）\n"
        "   ↓\n"
        "Pattern（系统性模式，不是个案）\n"
        "   ↓\n"
        "Possible Cause（可解释机制）\n"
        "   ↓\n"
        "Hypothesis（可证伪命题）\n"
        "   ↓\n"
        "Research Question（研究问题）\n"
        "   ↓\n"
        "Experiment（检验设计）\n"
        "```\n"
    ),
    md("## Step 1 — 汇总三类证据\n"),
    code(
        HEADER
        + "\n"
        "import json\n"
        "from pathlib import Path\n"
        "\n"
        "results_root = REPO_ROOT / 'results'\n"
        "evidence = {}\n"
        "for name in ('benchmark/sanity_summary.json', 'error_cases.json', 'ablation_results.csv', 'prompt_benchmark.json'):\n"
        "    p = results_root / name\n"
        "    if p.is_file():\n"
        "        if p.suffix == '.csv':\n"
        "            evidence[name] = p.read_text(encoding='utf-8')[:500]\n"
        "        else:\n"
        "            evidence[name] = json.loads(p.read_text(encoding='utf-8'))\n"
        "        print('[found]', name)\n"
        "    else:\n"
        "        print('[missing]', name, '-> 先完成对应 Notebook')\n"
    ),
    md(
        "## Step 2 — 寻找系统性弱点\n"
        "\n"
        "检查清单：subgroup performance gap（文档类型/语言/版面）、错误类型分布、"
        "消融曲线的边际收益、效率瓶颈（延迟）、结构失败模式、prompt 敏感性。"
        "从 Step 1 的证据里选出**最强的一个模式**写下来。\n"
    ),
    md(
        "## Step 3 — 一个完整示例（任务文件的范例）\n"
        "\n"
        "```text\n"
        "Observation:\n"
        "Tables degrade much more than text on complex layouts.\n"
        "\n"
        "Possible Cause:\n"
        "Spatial structure is insufficiently represented.\n"
        "\n"
        "Hypothesis:\n"
        "Structure-aware supervision may improve complex-table parsing.\n"
        "\n"
        "Research Question:\n"
        "Can structure-aware supervision improve table parsing\n"
        "without degrading text recognition in compact VLMs?\n"
        "```\n"
        "\n"
        "注意：你的 Observation 必须引用 results/ 里的实际数字或案例。\n"
    ),
    md("## Step 4 — Research Question Canvas\n"),
    code(
        HEADER
        + "\n"
        "canvas = {\n"
        "    'Observation': '',          # TODO: 引用 benchmark/error_cases 证据\n"
        "    'Research Gap': '',         # TODO: 与现有工作相比缺什么\n"
        "    'Hypothesis': '',           # TODO: 可证伪命题\n"
        "    'Independent Variable': '', # TODO: 唯一主要变量\n"
        "    'Dependent Variable': '',   # TODO: 指标（官方评测）\n"
        "    'Baseline': '',             # TODO: 对照条件\n"
        "    'Dataset': '',              # TODO: 数据与划分\n"
        "    'Metric': '',               # TODO: 主指标 + 分组切片\n"
        "    'Expected Result': '',      # TODO: 预期观察\n"
        "    'Risk': '',                 # TODO: 最大风险与预案\n"
        "}\n"
        "print(canvas)\n"
    ),
    md("## Step 5 — Mini Research Proposal（一页）\n"),
    code(
        HEADER
        + "\n"
        "proposal = '''# Mini Research Proposal\n"
        "\n"
        "- Title:\n"
        "- Research Question:\n"
        "- Motivation:\n"
        "- Hypothesis:\n"
        "- Method:\n"
        "- Dataset:\n"
        "- Benchmark:\n"
        "- Ablation:\n"
        "- Expected Contribution:\n"
        "- Risks:\n"
        "'''\n"
        "out = REPO_ROOT / 'results' / 'mini_research_proposal.md'\n"
        "out.write_text(proposal, encoding='utf-8')\n"
        "print('模板已写:', out)\n"
    ),
    md(
        "# What You Should Observe\n"
        "\n"
        "- 证据缺失时 Canvas 填不出来——这是好事：先补实验，再写问题；\n"
        "- 好的 RQ 有唯一变量、可测指标、明确 baseline 与风险；\n"
        "- 不要写「Improve SmolDocling」，要写可证伪的命题。\n"
    ),
    md(
        "# Research Checkpoint\n"
        "\n"
        "> 为什么「让 LLM 凭空生成一个论文题目」不是科研？对比你基于证据填写的 "
        "Canvas，说明两者在可检验性上的差别。\n"
        "\n"
        "**TODO：** 完成 Canvas 与一页 proposal，答案写入 `results/nb10/research_checkpoint.md`。\n"
    ),
    md(
        "# Exercises\n"
        "\n"
        "1. **TODO：** 从错误分析中再提出一个**相反方向**的假设（例如不改进表格而是"
        "检测何时不可靠），填入第二个 Canvas；\n"
        "2. **TODO：** 为你的 RQ 设计最小可行实验：数据量、GPU 预算、停止条件；\n"
        "3. **TODO：** 与同学互相审查 proposal：能否从原始结果重建每个观察？\n"
    ),
    md(
        "# Takeaways\n"
        "\n"
        "- 研究问题 = 证据 + 模式 + 假设，不是灵感题；\n"
        "- Canvas 强制补齐变量、baseline、指标与风险；\n"
        "- 至此完成「从 AI 使用者到初级研究者」的完整路径。\n"
        "\n"
        "**路线完成**：回到 [README](README.md) 检查五阶段证据清单，并把成果接入"
        "12 周课程（Week 8–12）与项目实战。\n"
    ),
]


def main() -> None:
    write_notebook("00_Environment_and_First_Run.ipynb", NB00)
    write_notebook("01_Understanding_OmniDocBench.ipynb", NB01)
    write_notebook("02_Dataset_Engineering.ipynb", NB02)
    write_notebook("03_Prompt_Engineering.ipynb", NB03)
    write_notebook("04_Baseline_Inference.ipynb", NB04)
    write_notebook("05_SFT_Fundamentals.ipynb", NB05)
    write_notebook("06_LoRA_Fine_Tuning.ipynb", NB06)
    write_notebook("07_Benchmark_and_Evaluation.ipynb", NB07)
    write_notebook("08_Error_Analysis.ipynb", NB08)
    write_notebook("09_Ablation_Study.ipynb", NB09)
    write_notebook("10_From_Experiments_to_Research_Questions.ipynb", NB10)


if __name__ == "__main__":
    main()

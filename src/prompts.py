"""Prompt 版本管理。

Prompt 本身就是实验变量（任务文件 §八）。Notebook 03（Phase 3）会系统比较
V0–V3；Phase 2 的 Baseline 使用官方默认 V0。每次推理必须记录 prompt_id。
"""

from __future__ import annotations

from typing import Dict

PROMPT_V0 = "Convert this page to docling."

PROMPT_V1 = (
    "Convert this page to docling. "
    "Extract all text content as accurately as possible."
)

PROMPT_V2 = (
    "Convert this page to docling. "
    "Preserve the reading order, table structure, formulas and layout hierarchy."
)

PROMPT_V3 = (
    "You are a document parsing engine. Convert this page to the DocTags "
    "structured format. Capture every text block, title, table (with full "
    "structure), formula (as LaTeX), figure and caption. Keep the correct "
    "reading order and include bounding boxes for every element."
)

PROMPTS: Dict[str, Dict[str, object]] = {
    "v0": {
        "id": "v0",
        "text": PROMPT_V0,
        "focus": "官方默认 full conversion",
        "official": True,
    },
    "v1": {
        "id": "v1",
        "text": PROMPT_V1,
        "focus": "强调 OCR 准确率",
        "official": False,
    },
    "v2": {
        "id": "v2",
        "text": PROMPT_V2,
        "focus": "强调阅读顺序/表格/公式/版面",
        "official": False,
    },
    "v3": {
        "id": "v3",
        "text": PROMPT_V3,
        "focus": "面向结构化 Document Parsing",
        "official": False,
    },
}


def get_prompt(prompt_id: str) -> str:
    if prompt_id not in PROMPTS:
        raise ValueError(f"未知 prompt_id: {prompt_id}，可选：{sorted(PROMPTS)}")
    return str(PROMPTS[prompt_id]["text"])

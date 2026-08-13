"""错误分类学与案例选择（Phase 4，Notebook 08 核心）。

⚠️ 教学定位：本模块的自动分类是「启发式」，用于给学生提供可复查的
错误案例种子与统计入口，**不是官方评测结论**。结论必须回到
官方指标（Notebook 07）与人工复核。
"""

from __future__ import annotations

import collections
import difflib
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

from . import data
from .evaluation import normalized_edit_distance

ERROR_TAXONOMY = [
    "ocr_error",
    "layout_error",
    "reading_order_error",
    "table_error",
    "formula_error",
    "missing_content",
    "hallucination",
    "repetition",
    "structure_error",
]


def normalize_text(text: str) -> str:
    """小写 + 压缩空白，用于文本对齐。"""
    return re.sub(r"\s+", " ", (text or "").lower()).strip()


def _diff_ratios(pred: str, gt: str) -> Dict[str, float]:
    """用 SequenceMatcher 估计缺失与幻觉内容占比（启发式）。"""
    pred_n = normalize_text(pred)
    gt_n = normalize_text(gt)
    if not gt_n:
        return {"missing_ratio": 0.0, "hallucination_ratio": 0.0, "similarity": 0.0}
    if not pred_n:
        return {"missing_ratio": 1.0, "hallucination_ratio": 0.0, "similarity": 0.0}
    matcher = difflib.SequenceMatcher(None, gt_n, pred_n)
    missing = 0
    hallucinated = 0
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag in ("delete", "replace"):
            missing += i2 - i1
        if tag in ("insert", "replace"):
            hallucinated += j2 - j1
    return {
        "missing_ratio": round(missing / max(len(gt_n), 1), 4),
        "hallucination_ratio": round(hallucinated / max(len(pred_n), 1), 4),
        "similarity": round(matcher.ratio(), 4),
    }


def _has_repetition(text: str, min_len: int = 24) -> bool:
    """检测明显的重复片段（启发式）。"""
    return bool(re.search(r"(.{%d,}?)\1" % min_len, normalize_text(text)))


def classify_case(
    prediction: Dict[str, Any],
    page: Dict[str, Any],
    pred_markdown: str,
) -> Dict[str, Any]:
    """把一条预测 + 对应 GT 页面分类为错误类型集合（启发式）。

    返回 error_cases.json 的单条记录。
    """
    attr = data.page_attribute(page)
    gt_text = "\n".join(
        d.get("text", "")
        for d in page.get("layout_dets", []) or []
        if d.get("text")
    )
    ratios = _diff_ratios(pred_markdown, gt_text)
    ned = normalized_edit_distance(normalize_text(pred_markdown), normalize_text(gt_text))

    block_cats = {
        d.get("category_type") for d in page.get("layout_dets", []) or []
    }
    doctags = prediction.get("doctags", "")
    error_types: List[str] = []
    if ned < 0.65:
        error_types.append("ocr_error")
    if ratios["missing_ratio"] > 0.35:
        error_types.append("missing_content")
    if ratios["hallucination_ratio"] > 0.25:
        error_types.append("hallucination")
    if _has_repetition(pred_markdown):
        error_types.append("repetition")
    if "table" in block_cats and "<table>" not in doctags:
        error_types.append("table_error")
    if (
        {"equation_isolated", "equation_caption", "equation_semantic"} & block_cats
        and "<formula>" not in doctags
    ):
        error_types.append("formula_error")
    if attr.get("layout") in ("double_column", "three_column", "1andmore_column"):
        if ratios["missing_ratio"] > 0.2 and "missing_content" in error_types:
            error_types.append("reading_order_error")
    if "<table>" in doctags and doctags.count("<table>") < sum(
        1
        for d in page.get("layout_dets", []) or []
        if d.get("category_type") == "table"
    ):
        error_types.append("structure_error")

    return {
        "image_id": prediction.get("image_id", data.sample_id(page)),
        "document_type": attr.get("data_source", "unknown"),
        "language": attr.get("language", "unknown"),
        "layout": attr.get("layout", "unknown"),
        "subset": data.subset_of(page),
        "error_types": sorted(set(error_types)),
        "sanity_ned": round(ned, 4),
        "gt_chars": len(gt_text),
        "pred_chars": len(pred_markdown),
        "evidence": f"results/baseline/predictions/{prediction.get('image_id')}.json",
        "notes": "",
    }


def build_error_cases(
    predictions_dir: Path,
    annotations: Sequence[Dict[str, Any]],
    data_root: Path,
    output_path: Optional[Path] = None,
) -> List[Dict[str, Any]]:
    """对 predictions_dir 中所有预测生成错误案例记录，写入 error_cases.json。"""
    from .model import doctags_to_markdown
    from PIL import Image

    cases: List[Dict[str, Any]] = []
    ann_by_id = {data.sample_id(p): p for p in annotations}
    for pred_file in sorted(Path(predictions_dir).glob("*.json")):
        prediction = data.read_json(pred_file)
        image_id = prediction.get("image_id")
        page = ann_by_id.get(image_id)
        if page is None:
            continue
        image_path = Path(data_root) / data.IMAGES_DIRNAME / f"{image_id}.jpg"
        if not image_path.is_file():
            image_path = Path(data_root) / data.IMAGES_DIRNAME / f"{image_id}.png"
        with Image.open(image_path) as img:
            image = img.convert("RGB")
        markdown, _api = doctags_to_markdown(prediction["doctags"], image)
        cases.append(classify_case(prediction, page, markdown))
    if output_path is not None:
        data.write_json(cases, output_path)
    return cases


def taxonomy_summary(cases: Sequence[Dict[str, Any]]) -> Dict[str, int]:
    counter: Dict[str, int] = collections.Counter()
    for case in cases:
        for t in case["error_types"]:
            counter[t] += 1
    return dict(counter)


def select_worst_cases(cases: Sequence[Dict[str, Any]], n: int = 20) -> List[Dict[str, Any]]:
    """Top-N 最差页面（按 sanity_ned 升序）。"""
    return sorted(cases, key=lambda c: c["sanity_ned"])[:n]


def select_improvement_cases(
    baseline_cases: Sequence[Dict[str, Any]],
    finetuned_cases: Sequence[Dict[str, Any]],
    n: int = 10,
) -> Dict[str, List[Dict[str, Any]]]:
    """训练前后对比：改善最大 / 退化（regression）的页面。"""
    ft = {c["image_id"]: c for c in finetuned_cases}
    diffs = []
    for base in baseline_cases:
        other = ft.get(base["image_id"])
        if other is None:
            continue
        diffs.append(
            (other["sanity_ned"] - base["sanity_ned"], base["image_id"], base, other)
        )
    diffs.sort(key=lambda x: x[0])
    regressions = [d[3] for d in diffs[:n]]
    diffs.sort(key=lambda x: -x[0])
    improvements = [d[3] for d in diffs[:n]]
    return {"improved": improvements, "regressed": regressions}

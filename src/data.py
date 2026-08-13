"""OmniDocBench 数据加载、统计与采样。

原则（docs/notebook-design.md §9）：
- 官方 JSON 只读，绝不修改；
- 官方 1651 页是 Benchmark 数据，没有官方 SFT train split；
- 教学训练子集（Phase 3）只从 v1.5 子集页面抽取，并标记 NOT for official claims；
- 数据本体不入 Git，只记录 revision 与 manifest。
"""

from __future__ import annotations

import collections
import hashlib
import json
import os
import random
import shutil
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence

DATASET_ID = "opendatalab/OmniDocBench"
DATASET_REVISION = "aa1ee96d106dbe53d0ae59474d75c6e6d9b53fec"
ANNOTATION_FILENAME = "OmniDocBench.json"
IMAGES_DIRNAME = "images"


def find_dataset_root(extra_dirs: Optional[Iterable[os.PathLike]] = None) -> Path:
    """按顺序查找 OmniDocBench 数据根目录（含 OmniDocBench.json 的那一层）。

    顺序：环境变量 OMNIDOCBENCH_DIR → /kaggle/input 下所有挂载 → 当前目录
    data/OmniDocBench → 调用方传入的额外目录。
    """
    candidates: List[Path] = []
    env = os.environ.get("OMNIDOCBENCH_DIR")
    if env:
        candidates.append(Path(env))
    kaggle_input = Path("/kaggle/input")
    if kaggle_input.exists():
        candidates.extend(sorted(p for p in kaggle_input.iterdir() if p.is_dir()))
    candidates.append(Path.cwd() / "data" / "OmniDocBench")
    for extra in extra_dirs or []:
        candidates.append(Path(extra))

    for cand in candidates:
        cand = Path(cand)
        if (cand / ANNOTATION_FILENAME).is_file():
            return cand.resolve()
        sub = cand / "OmniDocBench"
        if (sub / ANNOTATION_FILENAME).is_file():
            return sub.resolve()
    raise FileNotFoundError(
        "未找到 OmniDocBench 数据目录。请设置环境变量 OMNIDOCBENCH_DIR，"
        "或在 Kaggle 上添加官方数据集到 /kaggle/input，或运行 "
        "src.data.download_dataset() 下载到 <project_root>/data/OmniDocBench。"
    )


def download_dataset(
    revision: str = DATASET_REVISION,
    target_dir: Optional[os.PathLike] = None,
    allow_patterns: Optional[Sequence[str]] = None,
) -> Path:
    """从 Hugging Face 下载官方数据集（图片 + 标注 JSON，不含展示大图）。

    ⚠️ 数据集仅限研究用途、不可商用（官方 Copyright Statement）。
    """
    from huggingface_hub import snapshot_download

    target = Path(target_dir) if target_dir is not None else Path.cwd() / "data"
    patterns = list(allow_patterns) if allow_patterns else [
        "images/*",
        "OmniDocBench.json",
        "README.md",
        "README_ZH.md",
    ]
    local = snapshot_download(
        repo_id=DATASET_ID,
        repo_type="dataset",
        revision=revision,
        local_dir=target / "OmniDocBench",
        allow_patterns=patterns,
    )
    local_path = Path(local)
    # huggingface_hub 会在 local_dir 内生成 .cache 元数据；清理它，
    # 避免 Kaggle 输出包把缓存一并打包（体积膨胀 + Windows 长路径问题）。
    cache_dir = local_path / ".cache"
    if cache_dir.exists():
        shutil.rmtree(cache_dir, ignore_errors=True)
    return local_path


def load_annotations(root: os.PathLike) -> List[Dict[str, Any]]:
    """加载官方标注 JSON（只读）。"""
    path = Path(root) / ANNOTATION_FILENAME
    with open(path, "r", encoding="utf-8") as f:
        annotations = json.load(f)
    if not isinstance(annotations, list):
        raise ValueError("OmniDocBench.json 顶层结构不是列表，请检查数据版本")
    return annotations


def page_image_path(root: os.PathLike, page: Dict[str, Any]) -> Path:
    rel = page["page_info"]["image_path"]
    return Path(root) / IMAGES_DIRNAME / Path(rel).name


def load_page_image(root: os.PathLike, page: Dict[str, Any]) -> Any:
    """加载页面图像为 PIL RGB Image。"""
    from PIL import Image

    path = page_image_path(root, page)
    with Image.open(path) as img:
        return img.convert("RGB")


def sample_id(page: Dict[str, Any]) -> str:
    """稳定样本 ID：图像文件名去扩展名（官方文件名本身是 UUID）。"""
    return Path(page["page_info"]["image_path"]).stem


def page_attribute(page: Dict[str, Any]) -> Dict[str, Any]:
    return page.get("page_info", {}).get("page_attribute", {}) or {}


def subset_of(page: Dict[str, Any]) -> str:
    """官方子集标记：v1.5 / equation_hard / layout_hard / table_hard。"""
    value = page_attribute(page).get("subset")
    if isinstance(value, str):
        return value
    if isinstance(value, (list, tuple)) and value:
        return "|".join(str(v) for v in value)
    return ""


def select_pages(
    annotations: Sequence[Dict[str, Any]],
    n: int,
    seed: int = 42,
    teaching_only: bool = False,
) -> List[Dict[str, Any]]:
    """分层抽样 n 页（按 data_source 轮转），确定性可复现。

    teaching_only=True：只从 v1.5 子集页面抽取（教学训练子集，Phase 3 使用）。
    Baseline 推理默认 teaching_only=False（用官方页面做 zero-shot 评测是允许的，
    禁止的是用官方页面训练后再在官方集合报成绩）。
    """
    rng = random.Random(seed)
    pool = list(annotations)
    if teaching_only:
        pool = [p for p in pool if subset_of(p) == "v1.5"]
    strata: Dict[str, List[int]] = {}
    for i, p in enumerate(pool):
        key = page_attribute(p).get("data_source", "unknown")
        strata.setdefault(key, []).append(i)
    picked: List[int] = []
    keys = sorted(strata)
    while len(picked) < n and any(strata[k] for k in keys):
        for k in keys:
            if not strata[k]:
                continue
            idx = strata[k].pop()
            if idx not in picked:
                picked.append(idx)
            if len(picked) >= n:
                break
    if len(picked) < n:
        # 池子不足时补足（理论上只在 teaching_only 且 n 过大时出现）
        picked = sorted(picked)
    rng.shuffle(picked)
    return [pool[i] for i in picked[:n]]


def build_stats(annotations: Sequence[Dict[str, Any]]) -> Dict[str, Dict[str, int]]:
    """数据分布统计：与设计文档 §4.2 的官方数字可对照。"""
    doc_type: Dict[str, int] = collections.Counter()
    language: Dict[str, int] = collections.Counter()
    layout: Dict[str, int] = collections.Counter()
    subset: Dict[str, int] = collections.Counter()
    block_cat: Dict[str, int] = collections.Counter()
    n_tables = 0
    n_tables_with_html = 0
    n_formulas = 0
    n_formulas_with_latex = 0
    relations: Dict[str, int] = collections.Counter()

    for page in annotations:
        attr = page_attribute(page)
        doc_type[attr.get("data_source", "unknown")] += 1
        language[attr.get("language", "unknown")] += 1
        layout[attr.get("layout", "unknown")] += 1
        subset[subset_of(page) or "unknown"] += 1
        for det in page.get("layout_dets", []) or []:
            cat = det.get("category_type", "unknown")
            block_cat[cat] += 1
            if cat == "table":
                n_tables += 1
                if det.get("html"):
                    n_tables_with_html += 1
            if cat in ("equation_isolated", "equation_caption", "equation_semantic", "equation_explanation"):
                n_formulas += 1
                if det.get("latex"):
                    n_formulas_with_latex += 1
        for rel in (page.get("extra") or {}).get("relation", []) or []:
            relations[rel.get("relation", rel.get("relation_type", "unknown"))] += 1

    return {
        "pages": {"total": len(list(annotations))},
        "document_type": dict(doc_type),
        "language": dict(language),
        "layout": dict(layout),
        "subset": dict(subset),
        "block_category": dict(block_cat),
        "table": {"count": n_tables, "with_html": n_tables_with_html},
        "formula": {"count": n_formulas, "with_latex": n_formulas_with_latex},
        "relation": dict(relations),
    }


def write_json(obj: Any, path: os.PathLike) -> Path:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    return path


def read_json(path: os.PathLike) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def sha256_file(path: os.PathLike) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


# ---------------------------------------------------------------------------
# Phase 3：教学训练子集（红线见 docs/notebook-design.md §9）
# ---------------------------------------------------------------------------

TEACHING_SUBSET_MARKER = (
    "OmniDocBench-derived teaching subset — NOT for official benchmark claims"
)


def build_teaching_split(
    annotations: Sequence[Dict[str, Any]],
    n_train: int = 24,
    n_val: int = 8,
    seed: int = 42,
) -> Dict[str, List[Dict[str, Any]]]:
    """从 v1.5 子集页面构建教学 train/val 划分（分层、确定性）。

    官方没有 SFT train split，本函数创建的是「教学子集」：
    - 只取 subset == 'v1.5' 的页面，不触碰三个困难子集；
    - 全部产物标记 TEACHING_SUBSET_MARKER；
    - 不得用它在官方 1651 页上宣称成绩。
    """
    pool = [p for p in annotations if subset_of(p) == "v1.5"]
    val = select_pages(pool, n=n_val, seed=seed, teaching_only=True)
    val_ids = {sample_id(p) for p in val}
    rest = [p for p in pool if sample_id(p) not in val_ids]
    train = select_pages(rest, n=n_train, seed=seed, teaching_only=True)
    return {"train": train, "val": val, "marker": TEACHING_SUBSET_MARKER}


def write_split_manifest(split: Dict[str, Any], out_dir: os.PathLike) -> Path:
    """把 train/val 页面写为 manifest（image_id、属性、来源子集）。"""
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    for name in ("train", "val"):
        rows = []
        for page in split[name]:
            attr = page_attribute(page)
            rows.append(
                {
                    "image_id": sample_id(page),
                    "image_path": page["page_info"]["image_path"],
                    "subset": subset_of(page),
                    "document_type": attr.get("data_source", "unknown"),
                    "language": attr.get("language", "unknown"),
                    "layout": attr.get("layout", "unknown"),
                    "marker": split.get("marker", TEACHING_SUBSET_MARKER),
                }
            )
        write_json(rows, out / f"{name}.jsonl")
    write_json({"marker": split.get("marker", TEACHING_SUBSET_MARKER)}, out / "split_info.json")
    return out


# layout_dets 类别 → docling item 的近似映射（教学用途）。
# ⚠️ 28 类官方标注与 Docling item 并非一一对应；表格/公式的完整结构转换
# 是 Notebook 05 的一个开放练习，首次运行时记录实际行为。
_CATEGORY_TO_DOCLING = {
    "title": "heading",
    "text_block": "text",
    "list_group": "text",
    "reference": "text",
    "figure": "picture",
    "figure_caption": "text",
    "table_caption": "text",
    "table_footnote": "text",
    "figure_footnote": "text",
    "page_footnote": "text",
    "code_txt": "text",
}


def page_to_doctags(page: Dict[str, Any]) -> Dict[str, Any]:
    """把官方 layout_dets 转换为教学用 DocTags 目标（近似转换）。

    返回 {"doctags": str, "api_note": str, "skipped": [category...]}。
    表格与公式的完整结构暂不转换（见模块 docstring 的说明），
    其文本内容按 reading order 以 text 形式保留，保证训练样本不丢文字。
    """
    api_note = "unknown"
    try:
        from docling_core.types.doc import DoclingDocument
        from docling_core.types.doc.labels import DocItemLabel
    except ImportError as exc:
        raise ImportError(
            "缺少 docling-core，无法把 GT 转换为 DocTags。"
            "请在 Kaggle 上安装 docling-core。"
        ) from exc

    doc = DoclingDocument(name=sample_id(page))
    skipped: List[str] = []
    for det in sorted(
        (d for d in page.get("layout_dets", []) or [] if not d.get("ignore")),
        key=lambda d: d.get("order", 0),
    ):
        cat = det.get("category_type", "unknown")
        text = det.get("text") or ""
        mapping = _CATEGORY_TO_DOCLING.get(cat)
        if mapping == "heading" and text:
            try:
                doc.add_heading(text=text, level=1)
            except Exception as exc:  # noqa: BLE001
                api_note = f"add_heading 失败：{exc}"
                skipped.append(cat)
        elif mapping == "text" and text:
            try:
                doc.add_text(label=DocItemLabel.TEXT, text=text)
            except Exception as exc:  # noqa: BLE001
                api_note = f"add_text 失败：{exc}"
                skipped.append(cat)
        elif mapping == "picture":
            try:
                doc.add_picture(prov=None)
            except Exception as exc:  # noqa: BLE001
                api_note = f"add_picture 失败：{exc}"
                skipped.append(cat)
        else:
            skipped.append(cat)
    try:
        doctags = doc.export_to_doctags()
        api_note = f"{api_note} | export_to_doctags OK"
    except AttributeError:
        doctags = doc.export_to_document_tokens()
        api_note = f"{api_note} | export_to_document_tokens OK"
    return {"doctags": doctags, "api_note": api_note, "skipped": sorted(set(skipped))}


def build_sft_records(
    pages: Sequence[Dict[str, Any]],
    root: os.PathLike,
    prompt_text: str,
) -> List[Dict[str, str]]:
    """构造 SFT 记录：图像路径 + 指令 + GT 派生 DocTags 目标。"""
    records = []
    for page in pages:
        converted = page_to_doctags(page)
        records.append(
            {
                "image_id": sample_id(page),
                "image_path": str(page_image_path(root, page)),
                "instruction": prompt_text,
                "target_doctags": converted["doctags"],
                "api_note": converted["api_note"],
                "skipped_categories": ",".join(converted["skipped"]),
            }
        )
    return records

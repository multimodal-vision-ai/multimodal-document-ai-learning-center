"""OmniDocBench 官方评测封装。

红线（任务文件 §二十、docs/notebook-design.md §9）：
- 只调用官方 Evaluation，不自行发明替代指标；
- 官方评测仓库无 release/tag，锁定 commit 193627ae…；
- 本模块的 normalized_edit_distance 仅为 smoke 自检，
  明确标注「非官方指标」，不得用于论文/报告结论。

⚠️ 官方 CLI 入口与 prediction 格式细节需在首次 Kaggle 运行时按锁定 commit
的 README / configs 核对（设计文档第 11 节待核实清单）。
"""

from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

from . import data

OFFICIAL_REPO_URL = "https://github.com/opendatalab/OmniDocBench.git"
OFFICIAL_COMMIT = "193627ae9e97d89188468ed1ee3b7a856ff76044"

# 官方 pyproject 的依赖（requires-python >=3.10,<3.12，锁定旧版）。
# Kaggle 为 Python 3.12：不执行 `pip install -e .`（lxml==4.9.1 等无 3.12 轮子），
# 改为安装不锁版本的依赖后直接从仓库根目录运行 pdf_validation.py。
# 实测（2026-08-13）可出分，runtime_environment.json 会记录实际版本。
OFFICIAL_DEPS = [
    "apted",
    "beautifulsoup4",
    "evaluate",
    "func-timeout",
    "Levenshtein",
    "loguru",
    "lxml",
    "nltk",
    "pylatexenc",
    "scipy",
    "tabulate",
    "pyyaml",
]


def install_official_deps() -> None:
    """安装官方评测的 Python 依赖（不锁版本，兼容 Python 3.12）。"""
    import subprocess
    import sys

    subprocess.run(
        [sys.executable, "-m", "pip", "install"] + OFFICIAL_DEPS + ["--quiet"],
        check=True,
    )


def ensure_eval_repo(base_dir: Path, commit: str = OFFICIAL_COMMIT) -> Path:
    """克隆或复用官方评测仓库并锁定 commit。"""
    repo = Path(base_dir) / "OmniDocBench"
    if repo.is_dir():
        head = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            cwd=repo,
            capture_output=True,
            text=True,
        )
        if head.returncode == 0 and head.stdout.strip().startswith(commit):
            return repo
        raise RuntimeError(
            f"已有评测仓库 {repo}，但 commit 与锁定值 {commit} 不一致。"
            "请手动删除后重试（git clone 在 Kaggle 上约 1-2 分钟）。"
        )
    repo.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "clone", OFFICIAL_REPO_URL, str(repo)], check=True)
    subprocess.run(["git", "checkout", commit], cwd=repo, check=True)
    return repo


def export_markdown_predictions(
    predictions_dir: Path,
    data_root: Path,
    output_dir: Path,
) -> List[Path]:
    """把 baseline 缓存的 doctags 转成 Markdown 文件（md2md 评测输入）。

    输入：results/baseline/predictions/*.json（含 doctags 字段）
    输出：<output_dir>/<image_id>.md
    """
    from .model import doctags_to_markdown

    pred_dir = Path(predictions_dir)
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)
    written: List[Path] = []
    for pred_file in sorted(pred_dir.glob("*.json")):
        pred = data.read_json(pred_file)
        image_id = pred["image_id"]
        image_path = Path(data_root) / data.IMAGES_DIRNAME / f"{image_id}.jpg"
        if not image_path.is_file():
            image_path = Path(data_root) / data.IMAGES_DIRNAME / f"{image_id}.png"
        if not image_path.is_file():
            raise FileNotFoundError(f"找不到页面图像：{image_id}")
        from PIL import Image

        with Image.open(image_path) as img:
            image = img.convert("RGB")
        markdown, _api = doctags_to_markdown(pred["doctags"], image)
        out_file = out / f"{image_id}.md"
        out_file.write_text(markdown, encoding="utf-8")
        written.append(out_file)
    return written


# Docling item label → OmniDocBench category_type 的候选映射。
# ⚠️ 首次运行时按官方 README 的 category 定义核对并修正。
CATEGORY_MAP = {
    "title": "title",
    "text": "text_block",
    "table": "table",
    "picture": "figure",
    "formula": "equation_isolated",
    "section_header": "title",
    "list_item": "text_block",
    "code": "code_txt",
    "caption": "table_caption",
}


def export_end2end_predictions(
    predictions_dir: Path,
    data_root: Path,
    output_dir: Path,
) -> Path:
    """导出 end2end 评测候选格式（layout_dets 镜像官方 GT 结构）。

    ⚠️ 候选格式：字段与类别映射需按锁定 commit 的官方 README 核对。
    本函数会在导出时打印警告，并在 metadata 中记录 mapping 版本。
    """
    from .model import doctags_to_docling

    pred_dir = Path(predictions_dir)
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)
    preds: List[Dict[str, Any]] = []
    for pred_file in sorted(pred_dir.glob("*.json")):
        pred = data.read_json(pred_file)
        image_id = pred["image_id"]
        image_path = Path(data_root) / data.IMAGES_DIRNAME / f"{image_id}.jpg"
        if not image_path.is_file():
            image_path = Path(data_root) / data.IMAGES_DIRNAME / f"{image_id}.png"
        from PIL import Image

        with Image.open(image_path) as img:
            image = img.convert("RGB")
        doc, _api = doctags_to_docling(pred["doctags"], image)
        layout_dets: List[Dict[str, Any]] = []
        for order, (item, _level) in enumerate(doc.iterate_items()):
            bbox = None
            if item.prov:
                bbox = item.prov[0].bbox
            category = CATEGORY_MAP.get(str(item.label), "abandon")
            det: Dict[str, Any] = {
                "category_type": category,
                "order": order,
                "ignore": False,
            }
            if bbox is not None:
                det["poly"] = [
                    bbox.l,
                    bbox.t,
                    bbox.r,
                    bbox.t,
                    bbox.r,
                    bbox.b,
                    bbox.l,
                    bbox.b,
                ]
            text = getattr(item, "text", None)
            if text:
                det["text"] = text
            layout_dets.append(det)
        preds.append({"layout_dets": layout_dets, "page_info": {"image_path": image_id}})
    out_file = out / "pred_end2end.json"
    data.write_json(preds, out_file)
    return out_file


def run_official_eval(
    config: Dict[str, Any],
    repo: Path,
    gt_json: Path,
    pred_dir: Path,
    output_dir: Path,
    include_cdm: bool = False,
) -> Optional[Path]:
    """调用官方评测入口 pdf_validation.py（锁定 commit 核实于 2026-08-13）。

    先按官方 configs/end2end.yaml 结构生成评测配置（CDM 默认关闭），
    再执行 `python pdf_validation.py --config <yaml>`。
    模板为空时返回 None（不做假跑）。
    """
    section = config.get("omnidocbench_eval", {})
    template = section.get("end2end_cmd_template", "") or ""
    if not template:
        return None
    cfg_path = write_end2end_config(
        repo, gt_json, pred_dir, output_dir, include_cdm=include_cdm
    )
    cmd = (
        template.replace("{repo}", str(repo))
        .replace("{config}", str(cfg_path))
    )
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    log = output_dir / "official_end2end.log"
    with open(log, "w", encoding="utf-8") as f:
        proc = subprocess.run(cmd, shell=True, stdout=f, stderr=subprocess.STDOUT)
    if proc.returncode != 0:
        raise RuntimeError(f"官方评测失败（returncode={proc.returncode}），见 {log}")
    return log


def write_end2end_config(
    repo: Path,
    gt_json: Path,
    pred_dir: Path,
    output_dir: Path,
    include_cdm: bool = False,
) -> Path:
    """按官方 configs/end2end.yaml（锁定 commit）结构生成评测配置。

    - text_block: Edit_dist；display_formula: Edit_dist（+CDM 可选）；
    - table: TEDS + Edit_dist；reading_order: Edit_dist；
    - match_method: quick_match（官方推荐）。
    """
    cdm_lines = "\n      - CDM" if include_cdm else "      # CDM 需要独立环境，默认关闭"
    content = (
        "end2end_eval:\n"
        "  metrics:\n"
        "    text_block:\n"
        "      metric:\n"
        "      - Edit_dist\n"
        "    display_formula:\n"
        "      metric:\n"
        "      - Edit_dist\n"
        f"{cdm_lines}\n"
        "    table:\n"
        "      metric:\n"
        "      - TEDS\n"
        "      - Edit_dist\n"
        "    reading_order:\n"
        "      metric:\n"
        "      - Edit_dist\n"
        "  dataset:\n"
        "    dataset_name: end2end_dataset\n"
        "    ground_truth:\n"
        f"      data_path: {Path(gt_json).resolve()}\n"
        "    prediction:\n"
        f"      data_path: {Path(pred_dir).resolve()}\n"
        "    match_method: quick_match\n"
    )
    out = Path(output_dir) / "end2end_custom.yaml"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(content, encoding="utf-8")
    return out


def prepare_gt_subset(
    pages: Sequence[Dict[str, Any]], out_path: Path
) -> Path:
    """把若干官方页面写成评测 GT 子集 JSON（end2end 输入）。"""
    return data.write_json(list(pages), out_path)


def gt_subset_for_predictions(
    pred_dir: Path,
    annotations: Sequence[Dict[str, Any]],
    out_path: Path,
) -> Path:
    """按 predictions 目录中的 image_id 抽取对应 GT 页面。"""
    ids = {p.stem for p in Path(pred_dir).glob("*.md")}
    pages = [p for p in annotations if data.sample_id(p) in ids]
    if not pages:
        raise ValueError("predictions 目录中没有与 GT 匹配的 .md 文件")
    return prepare_gt_subset(pages, out_path)


def normalized_edit_distance(pred_text: str, gt_text: str) -> float:
    """⚠️ 非官方 smoke 自检指标：归一化编辑距离相似度（0-1，越大越好）。

    只用于验证 pipeline 是否贯通，不代表 OmniDocBench 官方成绩。
    """
    if not gt_text and not pred_text:
        return 1.0
    if not gt_text or not pred_text:
        return 0.0
    m, n = len(pred_text), len(gt_text)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev = dp[0]
        dp[0] = i
        for j in range(1, n + 1):
            tmp = dp[j]
            cost = 0 if pred_text[i - 1] == gt_text[j - 1] else 1
            dp[j] = min(dp[j] + 1, dp[j - 1] + 1, prev + cost)
            prev = tmp
    return 1.0 - dp[n] / max(m, n)


def sanity_check(
    predictions_dir: Path,
    annotations: Sequence[Dict[str, Any]],
    data_root: Path,
) -> List[Dict[str, Any]]:
    """⚠️ 非官方 smoke 自检：预测 Markdown vs GT 文本块的归一化编辑距离。"""
    from .model import doctags_to_markdown
    from PIL import Image

    rows: List[Dict[str, Any]] = []
    for pred_file in sorted(Path(predictions_dir).glob("*.json")):
        pred = data.read_json(pred_file)
        image_id = pred["image_id"]
        gt_page = next(
            (p for p in annotations if data.sample_id(p) == image_id), None
        )
        if gt_page is None:
            continue
        image_path = Path(data_root) / data.IMAGES_DIRNAME / f"{image_id}.jpg"
        if not image_path.is_file():
            image_path = Path(data_root) / data.IMAGES_DIRNAME / f"{image_id}.png"
        with Image.open(image_path) as img:
            image = img.convert("RGB")
        markdown, _api = doctags_to_markdown(pred["doctags"], image)
        gt_text = "\n".join(
            d.get("text", "")
            for d in gt_page.get("layout_dets", []) or []
            if d.get("text")
        )
        rows.append(
            {
                "image_id": image_id,
                "document_type": pred.get("document_type"),
                "language": pred.get("language"),
                "layout": pred.get("layout"),
                "sanity_ned": round(normalized_edit_distance(markdown, gt_text), 4),
                "metric_kind": "non_official_smoke_only",
            }
        )
    return rows


def build_summary_table(
    rows: Sequence[Dict[str, Any]],
    group_keys: Sequence[str] = ("document_type", "language", "layout"),
    score_key: str = "sanity_ned",
) -> Dict[str, Any]:
    """总体 + 分组汇总（均值与样本数）。"""
    import collections

    def agg(items: Sequence[Dict[str, Any]]) -> Dict[str, Any]:
        scores = [float(r[score_key]) for r in items if score_key in r]
        return {
            "n": len(items),
            f"mean_{score_key}": round(sum(scores) / len(scores), 4) if scores else None,
        }

    summary: Dict[str, Any] = {"overall": agg(list(rows))}
    for key in group_keys:
        groups: Dict[str, List[Dict[str, Any]]] = collections.defaultdict(list)
        for r in rows:
            groups[str(r.get(key, "unknown"))].append(r)
        summary[key] = {k: agg(v) for k, v in sorted(groups.items())}
    return summary

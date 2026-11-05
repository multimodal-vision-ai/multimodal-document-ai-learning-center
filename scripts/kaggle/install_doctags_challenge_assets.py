#!/usr/bin/env python3
"""Install the 28 DocTags challenge WebP samples into both static bundles."""
from __future__ import annotations

import json
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[2]
DESTINATIONS = [
    ROOT / "docs/assets/projects/doctags/browser-inference/samples/challenges",
    ROOT / "hf-spaces/mvai-doctags-webgpu/samples/challenges",
]
LABELS = {
    "original_095_chinese_two_column": "中文双栏文档",
    "original_096_english_article_table": "声明文档",
    "original_097_multicolumn_illustration": "多栏图文文档",
    "original_098_old_english_scan": "英文旧版扫描件",
    "original_099_dense_chinese_table": "中文复杂表格",
    "original_100_english_data_table": "英文数据表",
    "original_101_english_long_table": "英文长表格",
    "original_102_table_and_text": "表格与正文混排",
    "original_103_english_newspaper": "英文报纸版面",
    "original_104_multicolumn_paper": "多栏学术论文",
    "original_109_chinese_clauses": "中文条款文档",
    "original_110_watermark_fingerprint": "水印与指纹干扰",
    "original_111_handwritten_lines": "英文词汇笔记",
    "original_112_handwritten_lines": "英文短语笔记",
    "original_113_handwritten_notes": "中文手写笔记",
    "original_114_mixed_language_notes": "中英混合手写记录",
    "original_115_stamp_fragment": "公章残缺页面",
    "original_116_stamp_page": "印章文档页面",
    "synthetic_01_bank_transactions": "银行交易明细",
    "synthetic_02_court_notice": "法院告知书",
    "synthetic_03_engineering_price_table": "工程单价表",
    "synthetic_04_english_paper_tables": "英文论文表格",
    "synthetic_05_linear_algebra_formulas": "线性代数公式教材",
    "synthetic_06_e_payment_voucher": "电子支付凭证",
    "synthetic_07_chinese_newspaper": "中文旧报纸",
    "synthetic_08_material_receipt": "材料入库验收单",
    "synthetic_09_experiment_record": "手写实验记录",
    "synthetic_10_material_test_report": "材料检测报告",
}
README = """# DocTags challenge sample assets

The gallery contains 28 WebP challenge samples: 18 original scans and 10 de-identified simulated documents. All visible labels are descriptive and omit internal source numbers.

- Longest image edge: 1500 px; WebP quality: 78.
- The browser gallery loads local thumbnails lazily and passes the original WebP Blob into the existing inference flow.
- original_110_watermark_fingerprint.webp contains a fingerprint image. The project owner explicitly approved public display of this image on 2026-11-05; it is intentionally retained without blurring.

For repository builds, the 28-image archive is stored in 12 binary parts. GitHub Actions reassembles and validates the archive, extracts the WebP files into both the Learning Center and HF Static Space bundles, then removes the transport parts from the published output.
"""


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/kaggle/install_doctags_challenge_assets.py <assets.zip>")
    archive = Path(sys.argv[1]).expanduser().resolve()
    if not archive.is_file():
        raise SystemExit(f"Asset archive not found: {archive}")

    with tempfile.TemporaryDirectory(prefix="doctags-challenges-") as temp:
        temp_root = Path(temp)
        with zipfile.ZipFile(archive) as bundle:
            members = [m for m in bundle.infolist() if not m.is_dir()]
            for member in members:
                name = PurePosixPath(member.filename)
                if name.is_absolute() or ".." in name.parts or not name.parts or name.parts[0] != "challenges":
                    raise SystemExit(f"Unsafe or unexpected archive path: {member.filename}")
            bundle.extractall(temp_root)

        source = temp_root / "challenges"
        manifest_path = source / "manifest.json"
        if not manifest_path.is_file():
            raise SystemExit("Archive is missing challenges/manifest.json")
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        if len(manifest) != 28:
            raise SystemExit(f"Expected 28 manifest entries, found {len(manifest)}")

        expected = set()
        for item in manifest:
            rel = PurePosixPath(item["file"])
            if len(rel.parts) != 2 or rel.parts[0] != "challenges" or not rel.name.endswith(".webp"):
                raise SystemExit(f"Invalid manifest image path: {item['file']}")
            expected.add(rel.name)
            item["label"] = LABELS.get(item["id"], item["label"])
        actual = {p.name for p in source.glob("*.webp")}
        if actual != expected:
            raise SystemExit(f"Image list mismatch: missing={sorted(expected-actual)}, extra={sorted(actual-expected)}")
        for filename in sorted(expected):
            data = (source / filename).read_bytes()
            if len(data) <= 1000 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
                raise SystemExit(f"Invalid WebP asset: {filename}")

        for destination in DESTINATIONS:
            destination.mkdir(parents=True, exist_ok=True)
            for filename in sorted(expected):
                shutil.copy2(source / filename, destination / filename)
            (destination / "manifest.json").write_text(
                json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            (destination / "README.md").write_text(README, encoding="utf-8")

        for filename in sorted(expected | {"manifest.json", "README.md"}):
            left = DESTINATIONS[0] / filename
            right = DESTINATIONS[1] / filename
            if not left.is_file() or not right.is_file() or left.read_bytes() != right.read_bytes():
                raise SystemExit(f"Mirrored asset mismatch: {filename}")

    print("Installed 28 challenge samples with clean labels into both DocTags static bundles.")
    for destination in DESTINATIONS:
        print(f"- {destination}")


if __name__ == "__main__":
    main()

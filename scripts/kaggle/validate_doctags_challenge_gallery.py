#!/usr/bin/env python3
"""Validate the reviewed 28-sample DocTags gallery and both static bundles."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BUNDLES = [
    ROOT / "docs/assets/projects/doctags/browser-inference",
    ROOT / "hf-spaces/mvai-doctags-webgpu",
]

def main() -> None:
    manifests = []
    for bundle in BUNDLES:
        manifest_path = bundle / "samples/challenges/manifest.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifests.append(manifest)
        if len(manifest) != 28:
            raise SystemExit(f"{bundle}: expected 28 samples, found {len(manifest)}")
        if sum(item["source"] == "原始扫描" for item in manifest) != 18:
            raise SystemExit(f"{bundle}: expected 18 original scans")
        if sum(item["source"] == "脱敏模拟" for item in manifest) != 10:
            raise SystemExit(f"{bundle}: expected 10 simulated samples")
        html = (bundle / "index.html").read_text(encoding="utf-8")
        for marker in ('id="sourceChallenge"', 'id="sourceDocling"', 'id="sourceUpload"',
                       'id="challengeGallery"', 'id="doclingGallery"',
                       '选择示例文档', '选择 Docling 官方文档', '上传本地图片'):
            if marker not in html:
                raise SystemExit(f"{bundle}: missing gallery marker {marker!r}")
        if 'loadLocalSample(challengeSamples[0].id,"challenge")' not in html:
            raise SystemExit(f"{bundle}: first view must default to challenge samples")
        match = re.search(r"const challengeSamples=(\[[\s\S]*?\]);", html)
        if not match:
            raise SystemExit(f"{bundle}: inline challenge sample list missing")
        inline = json.loads(match.group(1))
        if [(x["id"], x["file"], x["label"]) for x in inline] != [
            (x["id"], x["file"], x["label"]) for x in manifest
        ]:
            raise SystemExit(f"{bundle}: inline sample list differs from manifest")
        images = list((bundle / "samples/challenges").glob("*.webp"))
        if len(images) != 28:
            raise SystemExit(f"{bundle}: expected 28 assembled WebP images, found {len(images)}")
        for item in manifest:
            image = bundle / "samples" / item["file"]
            if not image.is_file() or image.stat().st_size <= 1000:
                raise SystemExit(f"{bundle}: missing or invalid sample {image}")
        parts = list((bundle / "samples/challenges").glob("asset-pack.zip.part-*"))
        if parts:
            raise SystemExit(f"{bundle}: archive transport parts should not remain after assembly")
    if manifests[0] != manifests[1]:
        raise SystemExit("Learning Center and HF Space manifests differ")
    if manifests[0][1]["label"] != "中文声明文档":
        raise SystemExit("Sample 096 label must remain 中文声明文档")
    print("Verified 28 challenge samples, labels, default selection, and both static bundles.")

if __name__ == "__main__":
    main()

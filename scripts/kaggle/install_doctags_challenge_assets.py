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
        actual = {p.name for p in source.glob("*.webp")}
        if actual != expected:
            raise SystemExit(f"Image list mismatch: missing={sorted(expected-actual)}, extra={sorted(actual-expected)}")
        for filename in sorted(expected):
            data = (source / filename).read_bytes()
            if len(data) <= 1000 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
                raise SystemExit(f"Invalid WebP asset: {filename}")

        for destination in DESTINATIONS:
            destination.mkdir(parents=True, exist_ok=True)
            for item in source.iterdir():
                if item.is_file():
                    shutil.copy2(item, destination / item.name)

        for filename in sorted(expected | {"manifest.json", "README.md"}):
            left = DESTINATIONS[0] / filename
            right = DESTINATIONS[1] / filename
            if not left.is_file() or not right.is_file() or left.read_bytes() != right.read_bytes():
                raise SystemExit(f"Mirrored asset mismatch: {filename}")

    print("Installed 28 challenge samples into both DocTags static bundles.")
    for destination in DESTINATIONS:
        print(f"- {destination}")


if __name__ == "__main__":
    main()

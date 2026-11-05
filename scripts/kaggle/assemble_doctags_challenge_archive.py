#!/usr/bin/env python3
"""Reassemble the chunked DocTags asset archive and hydrate both static bundles."""
from __future__ import annotations

import argparse
import json
from io import BytesIO
from pathlib import Path, PurePosixPath
import zipfile

ROOT = Path(__file__).resolve().parents[2]
DESTINATIONS = [
    ROOT / "docs/assets/projects/doctags/browser-inference/samples/challenges",
    ROOT / "hf-spaces/mvai-doctags-webgpu/samples/challenges",
]
PART_NAMES = [f"asset-pack.zip.part-{i:02d}" for i in range(1, 13)]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--remove-parts", action="store_true")
    args = parser.parse_args()

    source = DESTINATIONS[0]
    manifests = [
        json.loads((directory / "manifest.json").read_text(encoding="utf-8"))
        for directory in DESTINATIONS
    ]
    if manifests[0] != manifests[1]:
        raise SystemExit("Learning Center and HF challenge manifests differ")
    manifest = manifests[0]
    if len(manifest) != 28:
        raise SystemExit(f"Expected 28 challenge entries, found {len(manifest)}")

    parts = [source / name for name in PART_NAMES]
    missing = [str(path) for path in parts if not path.is_file()]
    if missing:
        raise SystemExit(f"Missing archive part(s): {missing}")
    archive_bytes = b"".join(path.read_bytes() for path in parts)

    expected_files = {}
    for item in manifest:
        rel = PurePosixPath(item["file"])
        if len(rel.parts) != 2 or rel.parts[0] != "challenges" or rel.suffix.lower() != ".webp":
            raise SystemExit(f"Invalid manifest image path: {item['file']}")
        expected_files[item["file"]] = item["id"]
    if len(expected_files) != 28:
        raise SystemExit("Manifest image paths are not unique")

    with zipfile.ZipFile(BytesIO(archive_bytes)) as archive:
        members = {name for name in archive.namelist() if not name.endswith("/")}
        expected_members = set(expected_files) | {"challenges/manifest.json", "challenges/README.md"}
        if members != expected_members:
            raise SystemExit(
                f"Archive members differ: missing={sorted(expected_members-members)}, "
                f"extra={sorted(members-expected_members)}"
            )
        archived_manifest = json.loads(archive.read("challenges/manifest.json").decode("utf-8"))
        if [(x["id"], x["file"]) for x in archived_manifest] != [(x["id"], x["file"]) for x in manifest]:
            raise SystemExit("Archive manifest does not match the reviewed repository manifest")

        images = {}
        for filename in expected_files:
            data = archive.read(filename)
            if len(data) <= 1000 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
                raise SystemExit(f"Invalid WebP image: {filename}")
            images[PurePosixPath(filename).name] = data

    for destination in DESTINATIONS:
        destination.mkdir(parents=True, exist_ok=True)
        for filename, data in images.items():
            (destination / filename).write_bytes(data)

    for filename in images:
        left = DESTINATIONS[0] / filename
        right = DESTINATIONS[1] / filename
        if left.read_bytes() != right.read_bytes():
            raise SystemExit(f"Learning Center/HF image mismatch: {filename}")

    if args.remove_parts:
        for directory in DESTINATIONS:
            for name in PART_NAMES:
                (directory / name).unlink(missing_ok=True)

    print(f"Reassembled and verified {len(images)} WebP challenge samples in both static bundles.")


if __name__ == "__main__":
    main()

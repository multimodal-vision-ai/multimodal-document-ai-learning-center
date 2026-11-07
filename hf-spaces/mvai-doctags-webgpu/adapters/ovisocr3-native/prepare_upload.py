#!/usr/bin/env python3
"""Create a clean HF upload directory from a successfully validated OvisOCR3 bundle."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil

SOURCE_ID = "ATH-MaaS/OvisOCR3"
SOURCE_REVISION = "17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90"


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(8 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", type=Path, required=True)
    parser.add_argument("--staging", type=Path, required=True)
    args = parser.parse_args()
    bundle = args.bundle.resolve(strict=True)
    staging = args.staging.resolve()
    if staging == bundle or staging in bundle.parents or bundle in staging.parents:
        raise SystemExit("Staging directory must be separate from the validated bundle; refusing destructive copy.")
    if staging == Path(staging.anchor):
        raise SystemExit("Filesystem root cannot be used as the staging directory.")
    report_path = bundle / "validation" / "component_validation.json"
    metadata_path = bundle / "source-model.json"
    if not report_path.is_file() or not metadata_path.is_file():
        raise SystemExit("Missing component validation report or source-model.json; refusing upload.")
    report = json.loads(report_path.read_text(encoding="utf-8"))
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    if (
        report.get("success") is not True
        or report.get("source_model_id") != SOURCE_ID
        or report.get("source_revision") != SOURCE_REVISION
        or metadata.get("source_model_id") != SOURCE_ID
        or metadata.get("source_revision") != SOURCE_REVISION
        or report.get("source_weights_sha256") != metadata.get("source_weights_sha256")
        or report.get("structured_prompt_sha256") != metadata.get("prompt_sha256")
        or report.get("source_preprocessor_sha256") != metadata.get("source_preprocessor_sha256")
        or report.get("preprocessor_config_matches_source_except_resolution") is not True
        or metadata.get("browser_min_pixels") != 448 * 448
        or metadata.get("browser_max_pixels") != 1440 * 1440
        or metadata.get("eos_token_id") != [248044, 248046]
    ):
        raise SystemExit("Source revision/provenance/parity report mismatch; refusing upload.")
    artifacts = report.get("artifacts")
    if not isinstance(artifacts, dict) or not artifacts:
        raise SystemExit("Validation report contains no artifact SHA manifest; refusing upload.")

    if staging.exists():
        shutil.rmtree(staging)
    staging.mkdir(parents=True)
    copied = []
    for relative, expected in artifacts.items():
        source = (bundle / relative).resolve(strict=True)
        if not source.is_relative_to(bundle):
            raise SystemExit("Artifact path escapes the bundle: " + relative)
        if source.stat().st_size != expected.get("bytes") or sha256(source) != expected.get("sha256"):
            raise SystemExit("Artifact hash/size mismatch: " + relative)
        destination = staging / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
        copied.append(relative)

    validation_destination = staging / "validation" / "component_validation.json"
    validation_destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(report_path, validation_destination)
    license_source = bundle / "LICENSE"
    if not license_source.is_file():
        raise SystemExit("Original Apache-2.0 LICENSE missing; refusing upload.")
    shutil.copy2(license_source, staging / "LICENSE")

    model_card = """---
license: apache-2.0
base_model: ATH-MaaS/OvisOCR3
pipeline_tag: image-text-to-text
tags:
- ocr
- document-parsing
- qwen3.5
- onnx
- webgpu
---

# OvisOCR3 0.8B — WebGPU ONNX bundle

This repository contains a browser-executable FP16 ONNX export of [ATH-MaaS/OvisOCR3](https://huggingface.co/ATH-MaaS/OvisOCR3).

- Source revision: """ + SOURCE_REVISION + """
- Source checkpoint SHA-256: """ + metadata["source_weights_sha256"] + """
- Format: ONNX external-data bundle for Transformers.js and ONNX Runtime Web
- Execution target: WebGPU with shader-f16
- Structured output: the original OvisOCR3 JSON array with bbox/category/content
- License: Apache-2.0; see LICENSE

This is an inference-format conversion, not a new fine-tune. The tokenizer, chat template, generation config, and official Structured prompt are included unchanged. Component parity results are in validation/component_validation.json.

The bundle is intended for local browser inference. It is not an API service and does not provide server-side inference.
"""
    (staging / "README.md").write_text(model_card, encoding="utf-8")
    manifest = {
        "source_model_id": SOURCE_ID,
        "source_revision": SOURCE_REVISION,
        "source_weights_sha256": metadata["source_weights_sha256"],
        "validation_success": True,
        "uploaded_artifacts": sorted(copied),
    }
    (staging / "upload-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "success": True,
        "staging": str(staging),
        "files": len(copied) + 4,
        "bytes": sum((staging / item).stat().st_size for item in copied)
    }, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()

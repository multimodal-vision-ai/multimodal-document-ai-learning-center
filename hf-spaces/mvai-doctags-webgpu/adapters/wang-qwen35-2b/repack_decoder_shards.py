#!/usr/bin/env python3
"""Re-shard an existing WC-2B ONNX bundle and optionally upload browser-safe files."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import tempfile

import onnx

from external_data_sharding import (
    MAX_EXTERNAL_DATA_SHARD_BYTES,
    external_data_locations,
    shard_external_data,
)

DEFAULT_REPO = "multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags-ONNX"
MODEL_FILE = "decoder_model_merged_fp16.onnx"


def sha256(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for block in iter(lambda: stream.read(8 * 1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def download_bundle(repo_id, revision, token):
    from huggingface_hub import snapshot_download

    snapshot = Path(snapshot_download(
        repo_id=repo_id,
        repo_type="model",
        revision=revision,
        token=token,
        allow_patterns=[
            "config.json",
            f"onnx/{MODEL_FILE}",
            f"onnx/{MODEL_FILE}_data*",
        ],
    ))
    work = Path(tempfile.mkdtemp(prefix="mvai-wc2b-download-"))
    (work / "onnx").mkdir()
    shutil.copy2(snapshot / "config.json", work / "config.json")
    shutil.copy2(snapshot / "onnx" / MODEL_FILE, work / "onnx" / MODEL_FILE)
    for source in (snapshot / "onnx").glob(MODEL_FILE + "_data*"):
        if source.is_file():
            shutil.copy2(source, work / "onnx" / source.name)
    return work


def repack(bundle):
    bundle = Path(bundle).resolve(strict=True)
    onnx_dir = bundle / "onnx"
    model_path = onnx_dir / MODEL_FILE
    config_path = bundle / "config.json"
    if not model_path.is_file() or not config_path.is_file():
        raise FileNotFoundError(f"Bundle must contain config.json and onnx/{MODEL_FILE}")

    graph = onnx.load(str(model_path), load_external_data=False)
    old_locations = external_data_locations(graph.graph, onnx)
    if not old_locations:
        raise ValueError("Decoder graph does not reference external data")

    temp_dir = Path(tempfile.mkdtemp(prefix=".wc2b-reshard-", dir=onnx_dir))
    backup_dir = temp_dir / "backup"
    try:
        shards = shard_external_data(
            graph.graph, onnx_dir, temp_dir, model_path.name,
            MAX_EXTERNAL_DATA_SHARD_BYTES,
        )
        temp_model = temp_dir / model_path.name
        onnx.save_model(graph, str(temp_model))
        onnx.checker.check_model(str(temp_model))

        config = json.loads(config_path.read_text(encoding="utf-8"))
        js_config = config.setdefault("transformers.js_config", {})
        js_config["use_external_data_format"] = {
            "embed_tokens_fp16.onnx": 1,
            "vision_encoder.onnx": 1,
            model_path.name: len(shards),
        }
        temp_config = temp_dir / "config.json"
        temp_config.write_text(
            json.dumps(config, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

        backup_dir.mkdir()
        old_files = []
        for location in old_locations:
            old_path = (onnx_dir / location).resolve()
            if not old_path.is_relative_to(onnx_dir.resolve()):
                raise ValueError(f"External-data path escapes ONNX directory: {location}")
            if old_path.is_file() and old_path not in old_files:
                old_files.append(old_path)

        originals = [*old_files, model_path, config_path]
        backups = []
        installed = []
        try:
            for original in originals:
                relative = original.relative_to(bundle)
                backup = backup_dir / relative
                backup.parent.mkdir(parents=True, exist_ok=True)
                os.replace(original, backup)
                backups.append((backup, original))

            for shard in shards:
                destination = onnx_dir / shard.name
                os.replace(shard, destination)
                installed.append(destination)

            os.replace(temp_model, model_path)
            installed.append(model_path)
            os.replace(temp_config, config_path)
            installed.append(config_path)
        except Exception:
            for path in reversed(installed):
                path.unlink(missing_ok=True)
            for backup, original in reversed(backups):
                original.parent.mkdir(parents=True, exist_ok=True)
                os.replace(backup, original)
            raise

        return {
            "success": True,
            "bundle": str(bundle),
            "decoder_model": model_path.name,
            "shard_count": len(shards),
            "max_shard_bytes": MAX_EXTERNAL_DATA_SHARD_BYTES,
            "shards": [
                {"file": (onnx_dir / shard.name).name,
                 "bytes": (onnx_dir / shard.name).stat().st_size,
                 "sha256": sha256(onnx_dir / shard.name)}
                for shard in shards
            ],
            "config": config["transformers.js_config"]["use_external_data_format"],
            "old_external_data_files": old_locations,
        }
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


def upload_bundle(bundle, repo_id, revision, token, result):
    from huggingface_hub import CommitOperationAdd, CommitOperationDelete, HfApi

    bundle = Path(bundle)
    onnx_dir = bundle / "onnx"
    new_names = {item["file"] for item in result["shards"]}
    operations = [
        CommitOperationAdd(
            path_in_repo="config.json",
            path_or_fileobj=str(bundle / "config.json"),
        ),
        CommitOperationAdd(
            path_in_repo=f"onnx/{MODEL_FILE}",
            path_or_fileobj=str(onnx_dir / MODEL_FILE),
        ),
    ]
    for name in sorted(new_names):
        operations.append(CommitOperationAdd(
            path_in_repo=f"onnx/{name}",
            path_or_fileobj=str(onnx_dir / name),
        ))
    for old_name in result["old_external_data_files"]:
        if old_name not in new_names:
            operations.append(CommitOperationDelete(path_in_repo=f"onnx/{old_name}"))

    info = HfApi(token=token).create_commit(
        repo_id=repo_id,
        repo_type="model",
        revision=revision,
        operations=operations,
        commit_message="Fix browser loading: shard WC-2B decoder external data",
    )
    return {
        "commit_url": getattr(info, "commit_url", None),
        "commit_oid": getattr(info, "oid", None),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", type=Path,
                        help="Local model directory containing config.json and onnx/")
    parser.add_argument("--repo-id", default=DEFAULT_REPO)
    parser.add_argument("--revision", default="main")
    parser.add_argument("--push", action="store_true",
                        help="Upload only config, decoder graph and new decoder shards to Hugging Face")
    args = parser.parse_args()

    token = os.environ.get("HF_TOKEN")
    bundle = args.bundle or download_bundle(args.repo_id, args.revision, token)
    result = repack(bundle)
    if args.push:
        if not token:
            raise RuntimeError("Set HF_TOKEN in Kaggle Secrets before using --push")
        result["upload"] = upload_bundle(bundle, args.repo_id, args.revision, token, result)
    print(json.dumps(result, ensure_ascii=False, indent=2))

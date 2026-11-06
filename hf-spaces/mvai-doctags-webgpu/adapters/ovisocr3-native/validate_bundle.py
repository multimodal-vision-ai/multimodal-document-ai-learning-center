#!/usr/bin/env python3
"""Validate the official OvisOCR3 ONNX bundle against its pinned BF16 source."""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
import onnx
import onnxruntime as ort
import torch
from transformers import AutoTokenizer
from transformers.models.qwen3_5.modeling_qwen3_5 import Qwen3_5VisionModel

from export_onnx import (
    OFFICIAL_SOURCE_MODEL_ID,
    OFFICIAL_SOURCE_REVISION,
    checkpoint_tensor,
    file_sha256,
    local_config,
)

ASSET_NAMES = (
    "generation_config.json", "tokenizer.json", "tokenizer_config.json",
    "processor_config.json", "chat_template.jinja", "merges.txt", "vocab.json",
    "video_preprocessor_config.json",
)


def _unique_ids(values, vocab_size):
    output = []
    for value in values:
        if value is None:
            continue
        value = int(value)
        if 0 <= value < vocab_size and value not in output:
            output.append(value)
    return output


def validate(model, bundle, threads, expected_source_revision):
    torch.set_num_threads(threads)
    root, config = local_config(model)
    if expected_source_revision != OFFICIAL_SOURCE_REVISION:
        raise ValueError("The expected source revision is not the pinned official OvisOCR3 commit")
    if config.model_type != "qwen3_5":
        raise ValueError("The source model architecture is not qwen3_5")
    if not config.tie_word_embeddings:
        raise ValueError("The source model does not use the expected tied embeddings")

    metadata_path = bundle / "source-model.json"
    metadata = json.loads(metadata_path.read_text())
    if (
        metadata.get("format_version") != 1
        or metadata.get("source_model_id") != OFFICIAL_SOURCE_MODEL_ID
        or metadata.get("source_revision") != OFFICIAL_SOURCE_REVISION
        or metadata.get("model_type") != "qwen3_5"
        or metadata.get("vocab_size") != config.text_config.vocab_size
    ):
        raise ValueError("Bundle source metadata does not match the official OvisOCR3 checkpoint")
    source_weights = root / "model.safetensors"
    if not source_weights.is_file():
        raise FileNotFoundError("Expected the pinned official single-file model.safetensors")
    weights_sha = file_sha256(source_weights)
    if metadata.get("source_weights_sha256") != weights_sha:
        raise ValueError("Source checkpoint SHA-256 differs from the bundle manifest")

    report = {
        "source_model_id": OFFICIAL_SOURCE_MODEL_ID,
        "source_revision": OFFICIAL_SOURCE_REVISION,
        "source_weights_sha256": weights_sha,
        "vocab_size": config.text_config.vocab_size,
        "assets_unchanged": {},
    }
    for name in ASSET_NAMES:
        source, copied = root / name, bundle / name
        if source.is_file():
            if not copied.is_file() or file_sha256(source) != file_sha256(copied):
                raise ValueError("Source asset differs or is missing in ONNX bundle: " + name)
            report["assets_unchanged"][name] = True

    prompt_source = root / "prompts" / "document_structured.txt"
    prompt_bundle = bundle / "prompts" / "document_structured.txt"
    if not prompt_source.is_file() or not prompt_bundle.is_file():
        raise FileNotFoundError("Official Structured prompt is missing")
    prompt_sha = file_sha256(prompt_source)
    if file_sha256(prompt_bundle) != prompt_sha or metadata.get("prompt_sha256") != prompt_sha:
        raise ValueError("Structured prompt does not match the pinned official source")
    report["structured_prompt_sha256"] = prompt_sha

    source_tokenizer = AutoTokenizer.from_pretrained(root, local_files_only=True)
    bundle_tokenizer = AutoTokenizer.from_pretrained(bundle, local_files_only=True)
    if source_tokenizer.get_vocab() != bundle_tokenizer.get_vocab():
        raise ValueError("Tokenizer vocabulary differs from the official source")
    for name in ("bos_token_id", "eos_token_id", "pad_token_id", "unk_token_id"):
        if getattr(source_tokenizer, name) != getattr(bundle_tokenizer, name):
            raise ValueError("Tokenizer special token differs: " + name)
    report["tokenizer_vocab_and_special_tokens_match"] = True

    generation = json.loads((bundle / "generation_config.json").read_text())
    eos_ids = generation.get("eos_token_id")
    if eos_ids != [248044, 248046]:
        raise ValueError("Official OvisOCR3 EOS token IDs changed unexpectedly")
    report["eos_token_ids"] = eos_ids

    options = ort.SessionOptions()
    options.intra_op_num_threads = threads
    options.inter_op_num_threads = 1

    # Verify exported input embeddings against source BF16 weights rounded to FP16.
    vocab_size = config.text_config.vocab_size
    special_ids = [
        source_tokenizer.bos_token_id,
        source_tokenizer.eos_token_id,
        source_tokenizer.pad_token_id,
        source_tokenizer.convert_tokens_to_ids("<|im_start|>"),
        source_tokenizer.convert_tokens_to_ids("<|im_end|>"),
        source_tokenizer.convert_tokens_to_ids("<|image_pad|>"),
        source_tokenizer.convert_tokens_to_ids("<|vision_start|>"),
        source_tokenizer.convert_tokens_to_ids("<|vision_end|>"),
    ]
    sample_ids = _unique_ids([0, 1, *special_ids, vocab_size - 1], vocab_size)
    ids = np.asarray([sample_ids], dtype=np.int64)
    embedding_path = bundle / "onnx" / "embed_tokens_fp16.onnx"
    onnx.checker.check_model(str(embedding_path))
    embed = ort.InferenceSession(str(embedding_path), options, providers=["CPUExecutionProvider"])
    actual = embed.run(None, {"input_ids": ids})[0]
    source_embedding = checkpoint_tensor(root, "model.language_model.embed_tokens.weight")
    expected = source_embedding[torch.from_numpy(ids)].half().numpy()
    max_abs = float(np.abs(actual.astype(np.float32) - expected.astype(np.float32)).max())
    if max_abs > 1e-6:
        raise ValueError("Exported token embeddings differ from source FP16 rounding")
    report["embedding_sample_ids"] = sample_ids
    report["embedding_max_abs"] = max_abs

    # Verify the decoder's tied output projection references the same source rows.
    decoder_path = bundle / "onnx" / "decoder_model_merged_fp16.onnx"
    onnx.checker.check_model(str(decoder_path))
    decoder = onnx.load(decoder_path, load_external_data=False)
    report["decoder_graph_check"] = True
    head = next((tensor for tensor in decoder.graph.initializer if tensor.name == "lm_head.MatMul.weight"), None)
    if head is None:
        raise ValueError("Expected decoder lm_head.MatMul.weight initializer is missing")
    external = {item.key: item.value for item in head.external_data}
    location = external.get("location")
    if not location:
        raise ValueError("Decoder output projection external data reference is missing")
    external_path = (decoder_path.parent / location).resolve()
    if not external_path.is_relative_to(decoder_path.parent.resolve()) or not external_path.is_file():
        raise ValueError("Decoder external data path is missing or escapes the ONNX directory")
    matrix = np.memmap(
        external_path, mode="r", dtype=np.float16,
        offset=int(external.get("offset", 0)), shape=tuple(head.dims)
    )
    if not np.array_equal(matrix[:, sample_ids].T, source_embedding[sample_ids].half().numpy()):
        raise ValueError("Decoder tied output projection does not match source embedding rows")
    report["decoder_output_projection_sample_ids"] = sample_ids

    # Compare the exported visual encoder to the source Transformers implementation.
    visual = Qwen3_5VisionModel(config.vision_config)
    visual.load_state_dict(
        {key: checkpoint_tensor(root, "model.visual." + key) for key in visual.state_dict()},
        strict=True,
        assign=True,
    )
    visual = visual.float().eval()
    vision_path = bundle / "onnx" / "vision_encoder.onnx"
    onnx.checker.check_model(str(vision_path))
    vision = ort.InferenceSession(str(vision_path), options, providers=["CPUExecutionProvider"])
    comparisons = []
    for height, width in ((4, 4), (6, 8), (22, 34)):
        torch.manual_seed(0)
        pixels = torch.randn(height * width, 1536, dtype=torch.float32)
        grid = torch.tensor([[1, height, width]], dtype=torch.int64)
        with torch.inference_mode():
            expected = visual(pixels, grid_thw=grid).pooler_output.half().float().numpy()
        actual = vision.run(None, {
            "pixel_values": pixels.numpy(),
            "image_grid_thw": grid.numpy(),
        })[0].astype(np.float32)
        cosine = float((actual * expected).sum() / np.linalg.norm(actual) / np.linalg.norm(expected))
        comparison = {
            "grid": [1, height, width],
            "shape": list(actual.shape),
            "cosine": cosine,
            "max_abs": float(np.abs(actual - expected).max()),
            "mean_abs": float(np.abs(actual - expected).mean()),
        }
        if cosine <= 0.99999:
            raise ValueError("Vision encoder parity failed: " + json.dumps(comparison))
        comparisons.append(comparison)
    report["vision_against_source"] = comparisons

    required = [
        "config.json", "generation_config.json", "preprocessor_config.json",
        "processor_config.json", "tokenizer.json", "tokenizer_config.json",
        "chat_template.jinja", "source-model.json", "prompts/document_structured.txt",
        "onnx/embed_tokens_fp16.onnx", "onnx/embed_tokens_fp16.onnx_data",
        "onnx/vision_encoder.onnx", "onnx/vision_encoder.onnx_data",
        "onnx/decoder_model_merged_fp16.onnx", "onnx/decoder_model_merged_fp16.onnx_data",
    ]
    artifacts = {}
    for name in required:
        path = bundle / name
        if not path.is_file():
            raise FileNotFoundError("Required browser artifact is missing: " + name)
        artifacts[name] = {"bytes": path.stat().st_size, "sha256": file_sha256(path)}
    report["artifacts"] = artifacts
    report["success"] = True
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--bundle", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--source-revision", default=OFFICIAL_SOURCE_REVISION)
    parser.add_argument("--threads", type=int, default=4)
    args = parser.parse_args()
    if args.threads < 1:
        parser.error("--threads must be positive")
    result = validate(args.model, args.bundle, args.threads, args.source_revision)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"success": result["success"], "report": str(args.report)}), flush=True)

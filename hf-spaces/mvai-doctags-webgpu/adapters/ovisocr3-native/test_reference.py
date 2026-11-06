#!/usr/bin/env python3
"""Run the official OvisOCR3 BF16 source model as a local reference; no training."""
import argparse
import hashlib
import json
from pathlib import Path
import time

from export_onnx import OFFICIAL_SOURCE_REVISION


def run(args):
    import torch
    from PIL import Image
    from transformers import AutoProcessor, Qwen3_5ForConditionalGeneration

    model_dir = args.model.resolve(strict=True)
    prompt_path = model_dir / "prompts" / "document_structured.txt"
    prompt_text = prompt_path.read_text(encoding="utf-8")
    generation = json.loads((model_dir / "generation_config.json").read_text(encoding="utf-8"))
    eos_ids = generation["eos_token_id"]
    image = Image.open(args.image).convert("RGB")

    processor = AutoProcessor.from_pretrained(model_dir, local_files_only=True)
    processor.image_processor.size = {
        "shortest_edge": args.min_pixels,
        "longest_edge": args.max_pixels,
    }
    messages = [{"role": "user", "content": [
        {"type": "image"}, {"type": "text", "text": prompt_text}
    ]}]
    prompt = processor.tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True, enable_thinking=False
    )
    marker = "<|im_start|>assistant\n"
    before, found, _ = prompt.rpartition(marker)
    if not found:
        raise ValueError("Official chat template does not contain the assistant generation marker")
    prompt = before + found
    inputs = processor(text=[prompt], images=[image], return_tensors="pt")

    if args.device == "cuda" and not torch.cuda.is_available():
        raise RuntimeError("CUDA requested but no CUDA device is available")
    device = torch.device(args.device)
    dtype = torch.float32 if device.type == "cpu" else torch.float16
    model = Qwen3_5ForConditionalGeneration.from_pretrained(
        model_dir, torch_dtype=dtype, local_files_only=True,
        attn_implementation="eager"
    ).to(device).eval()
    inputs = inputs.to(device)
    started = time.monotonic()
    with torch.inference_mode():
        output = model.generate(
            **inputs, max_new_tokens=args.max_new_tokens,
            do_sample=False, eos_token_id=eos_ids
        )
    token_ids = output[0, inputs.input_ids.shape[1]:].tolist()
    text = processor.tokenizer.decode(token_ids, skip_special_tokens=True)
    try:
        parsed = json.loads(text)
        json_valid = isinstance(parsed, list)
        block_count = len(parsed) if json_valid else 0
    except Exception:
        json_valid, block_count = False, 0
    report = {
        "source_model_id": "ATH-MaaS/OvisOCR3",
        "source_revision": OFFICIAL_SOURCE_REVISION,
        "image": str(args.image),
        "image_sha256": hashlib.sha256(args.image.read_bytes()).hexdigest(),
        "image_size": list(image.size),
        "prompt_sha256": hashlib.sha256(prompt_text.encode("utf-8")).hexdigest(),
        "prompt_tokens": int(inputs.input_ids.shape[1]),
        "image_grid_thw": inputs.image_grid_thw.tolist(),
        "generated_tokens": len(token_ids),
        "eos_token_ids": eos_ids,
        "ended": bool(token_ids and token_ids[-1] in eos_ids),
        "json_valid": json_valid,
        "block_count": block_count,
        "seconds": time.monotonic() - started,
        "device": str(device),
        "dtype": str(dtype),
        "text": text,
        "token_ids": token_ids,
        "postprocess": False
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in (
        "source_model_id", "source_revision", "image_size", "generated_tokens",
        "ended", "json_valid", "block_count", "seconds", "device", "dtype"
    )}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--image", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--device", choices=("cpu", "cuda"), default="cpu")
    parser.add_argument("--min-pixels", type=int, default=448 * 448)
    parser.add_argument("--max-pixels", type=int, default=1440 * 1440)
    parser.add_argument("--max-new-tokens", type=int, default=1024)
    run(parser.parse_args())

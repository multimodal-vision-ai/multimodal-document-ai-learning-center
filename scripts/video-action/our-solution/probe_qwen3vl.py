#!/usr/bin/env python3
"""Inference-only Qwen3-VL probe. No training or weight updates."""
from __future__ import annotations

import argparse
import hashlib
import json
import platform
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import torch
from qwen_vl_utils import process_vision_info
from transformers import AutoModelForImageTextToText, AutoProcessor

MODEL_ID = "Qwen/Qwen3-VL-2B-Instruct"
MODEL_REVISION = "89644892e4d85e24eaac8bacfd4f463576704203"

PROMPT = """Evaluate the visible behavior of the main person. Do not infer speech or audio.
Choose exactly one primary_label:
using_mobile_phone = visibly looking at or interacting with a phone held in front of the body;
talking_on_cell_phone = visibly holding a phone against the ear in a call posture;
phone_present_action_uncertain = phone visible but action unclear;
other = neither target phone action is visible;
uncertain = person/evidence is too small, occluded, or unclear.
A hand near the ear without a visible phone is not enough for a phone-call label.
A phone in the hand is not enough for using_mobile_phone.
Return only JSON with keys:
primary_label, phone_visible, phone_position, observable_evidence, limitations.
phone_visible must be yes/no/uncertain.
phone_position must be against_ear/in_front_of_body/elsewhere/not_visible/uncertain.
Do not return a numerical confidence or hidden reasoning. Use only visible evidence.
"""


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def parse_json(raw: str) -> tuple[dict[str, Any] | None, str | None]:
    start, end = raw.find("{"), raw.rfind("}")
    if start < 0 or end <= start:
        return None, "No JSON object found."
    try:
        value = json.loads(raw[start : end + 1])
    except json.JSONDecodeError as exc:
        return None, f"JSON parse failed: {exc}"
    return (value, None) if isinstance(value, dict) else (None, "Output is not a JSON object.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--video", required=True, type=Path)
    parser.add_argument("--fps", type=float, default=1.0)
    parser.add_argument("--max-pixels", type=int, default=151200)
    parser.add_argument("--max-new-tokens", type=int, default=160)
    parser.add_argument("--dtype", choices=("auto", "fp16", "bf16", "fp32"), default="auto")
    parser.add_argument("--output", type=Path, default=None)
    args = parser.parse_args()

    video = args.video.expanduser().resolve()
    if not video.is_file():
        raise SystemExit(f"Video file not found: {video}")
    if args.fps <= 0 or args.max_pixels <= 0:
        raise SystemExit("--fps and --max-pixels must be positive.")

    dtype = (
        torch.float16 if torch.cuda.is_available() else torch.float32
    ) if args.dtype == "auto" else {
        "fp16": torch.float16, "bf16": torch.bfloat16, "fp32": torch.float32
    }[args.dtype]
    if dtype == torch.bfloat16 and torch.cuda.is_available() and not torch.cuda.is_bf16_supported():
        raise SystemExit("GPU does not support BF16; use --dtype fp16.")

    load_start = time.perf_counter()
    model = AutoModelForImageTextToText.from_pretrained(
        MODEL_ID,
        revision=MODEL_REVISION,
        torch_dtype=dtype,
        device_map="auto",
        low_cpu_mem_usage=True,
        attn_implementation="sdpa",
    )
    processor = AutoProcessor.from_pretrained(MODEL_ID, revision=MODEL_REVISION)
    model.eval()
    model_load_ms = (time.perf_counter() - load_start) * 1000

    messages = [{
        "role": "user",
        "content": [
            {"type": "video", "video": video.as_uri(), "fps": args.fps, "max_pixels": args.max_pixels},
            {"type": "text", "text": PROMPT},
        ],
    }]
    prompt_text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    images, videos, video_kwargs = process_vision_info(
        messages,
        image_patch_size=16,
        return_video_kwargs=True,
        return_video_metadata=True,
    )
    video_metadata = None
    if videos and isinstance(videos[0], tuple):
        videos, video_metadata = zip(*videos)
        videos, video_metadata = list(videos), list(video_metadata)

    inputs = processor(
        text=[prompt_text],
        images=images,
        videos=videos,
        video_metadata=video_metadata,
        return_tensors="pt",
        do_resize=False,
        **video_kwargs,
    ).to(model.device)

    if torch.cuda.is_available():
        torch.cuda.reset_peak_memory_stats()
    inference_start = time.perf_counter()
    with torch.inference_mode():
        generated = model.generate(**inputs, max_new_tokens=args.max_new_tokens, do_sample=False)
    inference_ms = (time.perf_counter() - inference_start) * 1000

    trimmed = [out[len(inp):] for inp, out in zip(inputs.input_ids, generated)]
    raw_output = processor.batch_decode(
        trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=False
    )[0]
    parsed, parse_error = parse_json(raw_output)

    gpu_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else None
    peak_mb = round(torch.cuda.max_memory_allocated() / (1024**2), 1) if torch.cuda.is_available() else None
    result = {
        "schema_version": "our-solution-probe-v1",
        "inference_only": True,
        "training_performed": False,
        "model_id": MODEL_ID,
        "model_revision": getattr(model.config, "_commit_hash", MODEL_REVISION),
        "video_sha256": sha256_file(video),
        "video_path": str(video),
        "fps": args.fps,
        "max_pixels": args.max_pixels,
        "dtype": str(dtype),
        "gpu_name": gpu_name,
        "model_load_ms": round(model_load_ms, 1),
        "inference_ms": round(inference_ms, 1),
        "peak_gpu_memory_mb": peak_mb,
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "python": platform.python_version(),
        "torch": torch.__version__,
        "transformers": __import__("transformers").__version__,
        "parsed_output": parsed,
        "parse_error": parse_error,
        "raw_output": raw_output,
        "prompt": PROMPT,
    }
    output = args.output or video.with_name(video.name + ".qwen3vl-probe.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"\nSaved: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

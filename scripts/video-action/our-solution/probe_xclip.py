#!/usr/bin/env python3
"""Inference-only X-CLIP zero-shot video/text comparison.

Loads an existing checkpoint. It does not train or update weights.
The softmax is relative to this prompt set, not a calibrated correctness probability.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import platform
import time
from datetime import datetime, timezone
from pathlib import Path

import cv2
import numpy as np
import torch
from PIL import Image
from transformers import AutoModel, AutoProcessor

MODEL_ID = "microsoft/xclip-base-patch16-zero-shot"
PROMPTS = [
    {
        "label": "using_mobile_phone",
        "text": "A person is looking down at and interacting with a smartphone held in front of their body, tapping or scrolling on its screen.",
    },
    {
        "label": "talking_on_cell_phone",
        "text": "A person is holding a smartphone against their ear in a phone-call posture.",
    },
    {
        "label": "phone_present_action_uncertain",
        "text": "A person is holding a smartphone, but it is not clear whether they are looking at the screen or making a call.",
    },
    {
        "label": "hand_near_ear_without_phone",
        "text": "A person has a hand near their ear or hair, but no phone is visible.",
    },
    {
        "label": "other_object_interaction",
        "text": "A person is looking down at or holding an object that is not a smartphone.",
    },
    {
        "label": "no_phone_action",
        "text": "A person is standing or walking without interacting with a smartphone.",
    },
]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def sample_video(path: Path, num_frames: int) -> list[Image.Image]:
    capture = cv2.VideoCapture(str(path))
    if not capture.isOpened():
        raise RuntimeError(f"Could not open video: {path}")
    try:
        frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
        if frame_count < 1:
            raise RuntimeError("Video reports no decodable frames.")
        indices = np.linspace(0, frame_count - 1, num=num_frames, dtype=np.int64)
        frames: list[Image.Image] = []
        last_frame = None
        for index in indices:
            capture.set(cv2.CAP_PROP_POS_FRAMES, int(index))
            ok, frame = capture.read()
            if not ok or frame is None:
                if last_frame is None:
                    continue
                frame = last_frame.copy()
            else:
                last_frame = frame.copy()
            frames.append(Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)))
        if not frames:
            raise RuntimeError("No frames could be decoded.")
        while len(frames) < num_frames:
            frames.append(frames[-1].copy())
        return frames[:num_frames]
    finally:
        capture.release()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--video", required=True, type=Path)
    parser.add_argument("--frames", type=int, default=32)
    parser.add_argument("--dtype", choices=("auto", "fp16", "fp32"), default="auto")
    parser.add_argument("--revision", default=None, help="Optional immutable Hugging Face revision.")
    parser.add_argument("--output", type=Path, default=None)
    args = parser.parse_args()

    video = args.video.expanduser().resolve()
    if not video.is_file():
        raise SystemExit(f"Video file not found: {video}")
    if args.frames < 8:
        raise SystemExit("--frames must be at least 8.")

    frames = sample_video(video, args.frames)
    dtype = (
        torch.float16 if torch.cuda.is_available() else torch.float32
    ) if args.dtype == "auto" else (
        torch.float16 if args.dtype == "fp16" else torch.float32
    )

    load_start = time.perf_counter()
    model = AutoModel.from_pretrained(
        MODEL_ID,
        revision=args.revision,
        torch_dtype=dtype,
        device_map="auto",
        low_cpu_mem_usage=True,
    )
    processor = AutoProcessor.from_pretrained(MODEL_ID, revision=args.revision)
    model.eval()
    model_load_ms = (time.perf_counter() - load_start) * 1000

    inputs = processor(
        text=[item["text"] for item in PROMPTS],
        videos=[frames],
        return_tensors="pt",
        padding=True,
    ).to(model.device)

    if torch.cuda.is_available():
        torch.cuda.reset_peak_memory_stats()
    inference_start = time.perf_counter()
    with torch.inference_mode():
        outputs = model(**inputs)
        logits = outputs.logits_per_video[0].float()
        relative_scores = torch.softmax(logits, dim=-1)
    inference_ms = (time.perf_counter() - inference_start) * 1000

    ranked = []
    for index, item in enumerate(PROMPTS):
        ranked.append({
            "label": item["label"],
            "prompt": item["text"],
            "similarity_logit": round(float(logits[index].item()), 6),
            "relative_prompt_softmax": round(float(relative_scores[index].item()), 6),
        })
    ranked.sort(key=lambda item: item["similarity_logit"], reverse=True)

    gpu_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else None
    peak_mb = round(torch.cuda.max_memory_allocated() / (1024**2), 1) if torch.cuda.is_available() else None
    result = {
        "schema_version": "our-solution-probe-v1",
        "inference_only": True,
        "training_performed": False,
        "model_id": MODEL_ID,
        "requested_revision": args.revision,
        "resolved_revision": getattr(model.config, "_commit_hash", None),
        "video_sha256": sha256_file(video),
        "video_path": str(video),
        "sampled_frames": len(frames),
        "dtype": str(dtype),
        "gpu_name": gpu_name,
        "model_load_ms": round(model_load_ms, 1),
        "inference_ms": round(inference_ms, 1),
        "peak_gpu_memory_mb": peak_mb,
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "python": platform.python_version(),
        "torch": torch.__version__,
        "transformers": __import__("transformers").__version__,
        "score_warning": "relative_prompt_softmax is normalized only across the supplied prompts; it is not a calibrated correctness probability.",
        "ranked_prompts": ranked,
    }
    output = args.output or video.with_name(video.name + ".xclip-probe.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"\nSaved: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Inference-only YOLO + VideoMAE V2 K710 continuous-video proof of concept.

No training, fine-tuning, distillation, optimizer, or weight updates are used.
The script compares the same frozen K710 classifier on full-frame clips and
tracked-person crops from overlapping windows of the complete input video.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import sys
import tempfile
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import torch
from huggingface_hub import HfApi, hf_hub_download
from ultralytics import YOLO

MODEL_ID = "OpenGVLab/VideoMAE2"
MODEL_FILE = "distill/vit_b_k710_dl_from_giant.pth"
MODEL_SHA256 = "8141a6955e0700d11bf15928fe6d61e5cfe482606fed8cfdddb1b922c0fd88ec"
NUM_CLASSES = 710
NUM_FRAMES = 16
INPUT_SIZE = 224
TUBELET_SIZE = 2
MEAN = np.asarray([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.asarray([0.229, 0.224, 0.225], dtype=np.float32)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def load_labels(path: Path) -> list[str]:
    labels = [line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    if len(labels) != NUM_CLASSES:
        raise RuntimeError(f"K710 label map must contain exactly {NUM_CLASSES} labels; got {len(labels)}.")
    return labels


def resolve_input_video(
    video_path: Path | None,
    sample_id: str | None,
    dataset_id: str,
    dataset_revision: str,
) -> Path:
    if video_path is not None and sample_id:
        raise ValueError("Use either --video or --sample-id, not both.")
    if video_path is not None:
        resolved = video_path.expanduser().resolve()
        if not resolved.is_file():
            raise FileNotFoundError(f"Video file not found: {resolved}")
        return resolved
    if not sample_id:
        raise ValueError("Provide either --video or --sample-id.")

    api = HfApi()
    files = api.list_repo_files(
        repo_id=dataset_id,
        repo_type="dataset",
        revision=dataset_revision,
    )
    extensions = {".mp4", ".webm", ".mov", ".avi", ".mkv"}
    matches = [
        name for name in files
        if Path(name).suffix.lower() in extensions
        and Path(name).stem == sample_id
    ]
    if len(matches) != 1:
        related = [
            name for name in files
            if sample_id in Path(name).name and Path(name).suffix.lower() in extensions
        ]
        raise RuntimeError(
            f"Could not uniquely resolve sample ID {sample_id!r} in "
            f"{dataset_id}@{dataset_revision}. Exact matches: {matches}; "
            f"related video files: {related[:10]}. "
            "If the sample is stored inside an archive, download/extract it and pass --video."
        )
    downloaded = hf_hub_download(
        repo_id=dataset_id,
        repo_type="dataset",
        filename=matches[0],
        revision=dataset_revision,
    )
    return Path(downloaded).resolve()


def resolve_checkpoint(checkpoint_path: Path | None) -> Path:
    if checkpoint_path is None:
        checkpoint_path = Path(hf_hub_download(repo_id=MODEL_ID, filename=MODEL_FILE))
    checkpoint_path = checkpoint_path.expanduser().resolve()
    if not checkpoint_path.is_file():
        raise FileNotFoundError(checkpoint_path)
    actual = sha256_file(checkpoint_path)
    if actual != MODEL_SHA256:
        raise RuntimeError(
            "VideoMAE V2 checkpoint SHA256 mismatch. "
            f"Expected {MODEL_SHA256}, got {actual}. Refusing to load an unverified file."
        )
    return checkpoint_path


def load_videomae(repo_path: Path, checkpoint_path: Path, device: torch.device) -> torch.nn.Module:
    repo_path = repo_path.expanduser().resolve()
    if not (repo_path / "models" / "modeling_finetune.py").is_file():
        raise FileNotFoundError(
            f"Official VideoMAEv2 source not found under {repo_path}. "
            "Clone https://github.com/OpenGVLab/VideoMAEv2 first."
        )
    sys.path.insert(0, str(repo_path))
    import models as videomae_models  # noqa: F401; registers official VideoMAEv2 architectures
    from timm.models import create_model

    model = create_model(
        "vit_base_patch16_224",
        img_size=INPUT_SIZE,
        pretrained=False,
        num_classes=NUM_CLASSES,
        all_frames=NUM_FRAMES,
        tubelet_size=TUBELET_SIZE,
        drop_rate=0.0,
        drop_path_rate=0.1,
        attn_drop_rate=0.0,
        head_drop_rate=0.0,
        use_mean_pooling=True,
        init_scale=0.001,
        with_cp=False,
    )
    try:
        checkpoint = torch.load(checkpoint_path, map_location="cpu", weights_only=False)
    except TypeError:
        checkpoint = torch.load(checkpoint_path, map_location="cpu")

    if isinstance(checkpoint, dict):
        for key in ("model", "module"):
            if key in checkpoint and isinstance(checkpoint[key], dict):
                checkpoint = checkpoint[key]
                break

    if not isinstance(checkpoint, dict):
        raise RuntimeError("Checkpoint does not contain a state dictionary.")
    incompatible = model.load_state_dict(checkpoint, strict=True)
    if incompatible.missing_keys or incompatible.unexpected_keys:
        raise RuntimeError(f"Checkpoint mismatch: {incompatible}")
    model.to(device)
    model.eval()
    return model


def detect_and_sample(
    video_path: Path,
    yolo_model_name: str,
    tracker_name: str,
    yolo_conf: float,
    sample_fps: float,
    max_seconds: float,
    device: torch.device,
    temp_dir: Path,
) -> tuple[list[dict[str, Any]], dict[int, dict[str, float]], float, tuple[int, int], float, float | None]:
    detector_started = time.perf_counter()
    if torch.cuda.is_available():
        torch.cuda.reset_peak_memory_stats()
    detector = YOLO(yolo_model_name)
    capture = cv2.VideoCapture(str(video_path))
    if not capture.isOpened():
        raise RuntimeError(f"Could not open input video: {video_path}")

    fps = float(capture.get(cv2.CAP_PROP_FPS))
    if not math.isfinite(fps) or fps <= 0:
        fps = 30.0
    width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    effective_sample_fps = min(sample_fps, fps)
    next_sample_time = 0.0
    frame_index = 0
    sampled: list[dict[str, Any]] = []
    stats: dict[int, dict[str, float]] = defaultdict(
        lambda: {"count": 0.0, "area_sum": 0.0, "center_sum": 0.0}
    )

    try:
        while True:
            ok, frame = capture.read()
            if not ok:
                break
            timestamp = frame_index / fps
            if max_seconds > 0 and timestamp > max_seconds:
                break

            results = detector.track(
                frame,
                persist=True,
                tracker=tracker_name,
                classes=[0],
                conf=yolo_conf,
                verbose=False,
                device=0 if device.type == "cuda" else "cpu",
            )
            boxes_for_frame: list[dict[str, Any]] = []
            if results and results[0].boxes is not None:
                result_boxes = results[0].boxes
                ids = result_boxes.id
                if ids is not None:
                    xyxy = result_boxes.xyxy.detach().cpu().numpy()
                    track_ids = ids.detach().cpu().numpy().astype(int)
                    for track_id, box in zip(track_ids, xyxy):
                        x1, y1, x2, y2 = [float(v) for v in box]
                        box_width = max(0.0, x2 - x1)
                        box_height = max(0.0, y2 - y1)
                        if box_width < 2 or box_height < 2:
                            continue
                        area_ratio = (box_width * box_height) / max(1.0, width * height)
                        cx = (x1 + x2) / (2.0 * max(1, width))
                        cy = (y1 + y2) / (2.0 * max(1, height))
                        centrality = max(0.0, 1.0 - math.hypot(cx - 0.5, cy - 0.5))
                        stats[track_id]["count"] += 1.0
                        stats[track_id]["area_sum"] += area_ratio
                        stats[track_id]["center_sum"] += centrality
                        boxes_for_frame.append({"track_id": int(track_id), "xyxy": [x1, y1, x2, y2]})

            if timestamp + 1e-6 >= next_sample_time:
                frame_file = temp_dir / f"sample_{len(sampled):06d}.jpg"
                if not cv2.imwrite(str(frame_file), frame, [cv2.IMWRITE_JPEG_QUALITY, 92]):
                    raise RuntimeError(f"Failed to write temporary frame: {frame_file}")
                sampled.append({
                    "index": len(sampled),
                    "frame_index": frame_index,
                    "time_sec": timestamp,
                    "frame_path": str(frame_file),
                    "boxes": boxes_for_frame,
                })
                next_sample_time += 1.0 / effective_sample_fps

            frame_index += 1
    finally:
        capture.release()

    yolo_peak_memory_mb = (
        round(torch.cuda.max_memory_allocated() / (1024**2), 1)
        if torch.cuda.is_available() else None
    )
    detector_elapsed_seconds = time.perf_counter() - detector_started
    del detector
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

    if not sampled:
        raise RuntimeError("No frames were sampled from the input video.")
    return sampled, dict(stats), fps, (width, height), detector_elapsed_seconds, yolo_peak_memory_mb


def choose_primary_track(
    stats: dict[int, dict[str, float]],
    total_frames: int,
    requested_id: int | None,
) -> tuple[int, dict[int, float]]:
    if not stats:
        raise RuntimeError("YOLO/ByteTrack did not produce any person track IDs.")
    scores: dict[int, float] = {}
    for track_id, item in stats.items():
        count = max(1.0, item["count"])
        mean_area = item["area_sum"] / count
        coverage = min(1.0, item["count"] / max(1, total_frames))
        centrality = item["center_sum"] / count
        scores[track_id] = mean_area * math.sqrt(max(coverage, 1e-6)) * (0.8 + 0.2 * centrality)

    if requested_id is not None:
        if requested_id not in scores:
            raise RuntimeError(f"Requested person track ID {requested_id} was not detected.")
        return requested_id, scores
    return max(scores, key=scores.get), scores


def resolve_track_boxes(
    sampled: list[dict[str, Any]],
    track_id: int,
    max_gap_sec: float,
    smoothing_alpha: float,
) -> list[list[float] | None]:
    boxes: list[list[float] | None] = []
    times = [float(item["time_sec"]) for item in sampled]
    for item in sampled:
        match = next((x["xyxy"] for x in item["boxes"] if x["track_id"] == track_id), None)
        boxes.append([float(v) for v in match] if match is not None else None)

    valid = [i for i, box in enumerate(boxes) if box is not None]
    for left, right in zip(valid, valid[1:]):
        gap = times[right] - times[left]
        if right - left > 1 and gap <= max_gap_sec:
            a = np.asarray(boxes[left], dtype=np.float32)
            b = np.asarray(boxes[right], dtype=np.float32)
            for index in range(left + 1, right):
                ratio = (times[index] - times[left]) / max(1e-6, gap)
                boxes[index] = (a * (1.0 - ratio) + b * ratio).tolist()

    smoothed: list[list[float] | None] = []
    previous = None
    previous_time = None
    for index, box in enumerate(boxes):
        if box is None:
            smoothed.append(None)
            previous = None
            previous_time = None
            continue
        current = np.asarray(box, dtype=np.float32)
        if previous is not None and previous_time is not None and times[index] - previous_time <= max_gap_sec:
            current = smoothing_alpha * current + (1.0 - smoothing_alpha) * previous
        smoothed.append(current.tolist())
        previous = current
        previous_time = times[index]
    return smoothed


def crop_person_square(frame: np.ndarray, box: list[float], padding: float) -> np.ndarray:
    height, width = frame.shape[:2]
    x1, y1, x2, y2 = box
    box_width = max(2.0, x2 - x1)
    box_height = max(2.0, y2 - y1)
    side = max(2, int(math.ceil(max(box_width, box_height) * (1.0 + 2.0 * padding))))
    center_x = (x1 + x2) / 2.0
    center_y = (y1 + y2) / 2.0
    left = int(round(center_x - side / 2.0))
    top = int(round(center_y - side / 2.0))
    right = left + side
    bottom = top + side

    canvas = np.full((side, side, 3), 114, dtype=np.uint8)
    src_left = max(0, left)
    src_top = max(0, top)
    src_right = min(width, right)
    src_bottom = min(height, bottom)
    if src_right <= src_left or src_bottom <= src_top:
        return canvas
    dst_left = src_left - left
    dst_top = src_top - top
    canvas[
        dst_top : dst_top + (src_bottom - src_top),
        dst_left : dst_left + (src_right - src_left),
    ] = frame[src_top:src_bottom, src_left:src_right]
    return canvas


def preprocess_frame(frame: np.ndarray) -> torch.Tensor:
    height, width = frame.shape[:2]
    scale = INPUT_SIZE / float(min(height, width))
    new_width = max(INPUT_SIZE, int(round(width * scale)))
    new_height = max(INPUT_SIZE, int(round(height * scale)))
    resized = cv2.resize(frame, (new_width, new_height), interpolation=cv2.INTER_LINEAR)
    left = max(0, (new_width - INPUT_SIZE) // 2)
    top = max(0, (new_height - INPUT_SIZE) // 2)
    center = resized[top : top + INPUT_SIZE, left : left + INPUT_SIZE]
    rgb = cv2.cvtColor(center, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    normalized = (rgb - MEAN) / STD
    return torch.from_numpy(normalized).permute(2, 0, 1).contiguous()


def build_clip(
    sampled: list[dict[str, Any]],
    track_boxes: list[list[float] | None],
    start_index: int,
    mode: str,
    padding: float,
    save_crop_dir: Path | None,
) -> tuple[torch.Tensor, float]:
    tensors = []
    valid_boxes = 0
    for offset in range(NUM_FRAMES):
        index = min(start_index + offset, len(sampled) - 1)
        frame = cv2.imread(sampled[index]["frame_path"])
        if frame is None:
            raise RuntimeError(f"Could not read temporary frame {sampled[index]['frame_path']}")
        if mode == "person_crop":
            box = track_boxes[index]
            if box is None:
                raise RuntimeError("Missing tracked-person box inside this clip.")
            frame = crop_person_square(frame, box, padding)
            valid_boxes += 1
            if save_crop_dir is not None:
                save_crop_dir.mkdir(parents=True, exist_ok=True)
                cv2.imwrite(str(save_crop_dir / f"frame_{index:06d}.jpg"), frame)
        tensors.append(preprocess_frame(frame))

    # [T, C, H, W] -> [B, C, T, H, W]
    clip = torch.stack(tensors, dim=1).unsqueeze(0)
    return clip, valid_boxes / float(NUM_FRAMES)


def predict_clip(
    model: torch.nn.Module,
    clip: torch.Tensor,
    labels: list[str],
    device: torch.device,
    use_fp16: bool,
    expected_label: str | None,
) -> tuple[list[dict[str, Any]], int | None]:
    clip = clip.to(device, non_blocking=True)
    if device.type == "cuda":
        torch.cuda.synchronize()
    with torch.inference_mode():
        if device.type == "cuda" and use_fp16:
            with torch.autocast(device_type="cuda", dtype=torch.float16):
                logits = model(clip)
        else:
            logits = model(clip)
    if isinstance(logits, (tuple, list)):
        logits = logits[0]
    probabilities = torch.softmax(logits[0].float(), dim=-1)
    target_rank = None
    if expected_label is not None:
        target_index = labels.index(expected_label)
        target_score = probabilities[target_index]
        target_rank = int((probabilities > target_score).sum().item()) + 1
    values, indices = torch.topk(probabilities, k=5)
    output = []
    for score, index in zip(values.detach().cpu().tolist(), indices.detach().cpu().tolist()):
        output.append({
            "class_index": int(index),
            "label": labels[int(index)],
            "softmax_score": float(score),
        })
    return output, target_rank


def make_windows(sample_count: int, sample_fps: float, stride_sec: float) -> list[int]:
    if sample_count <= NUM_FRAMES:
        return [0]
    stride = max(1, int(round(stride_sec * sample_fps)))
    last_start = sample_count - NUM_FRAMES
    starts = list(range(0, last_start + 1, stride))
    if not starts or starts[-1] != last_start:
        starts.append(last_start)
    return starts


def rank_of_label(topk: list[dict[str, Any]] | None, expected: str | None) -> int | None:
    if not expected or not topk:
        return None
    for index, item in enumerate(topk, start=1):
        if item["label"] == expected:
            return index
    return None


def write_csv(path: Path, windows: list[dict[str, Any]]) -> None:
    fields = [
        "window_start_sec", "window_end_sec", "person_track_id", "track_coverage",
        "full_frame_top1", "full_frame_score", "person_crop_top1", "person_crop_score",
        "expected_label", "full_frame_target_rank", "person_crop_target_rank",
    ]
    with path.open("w", newline="", encoding="utf-8-sig") as stream:
        writer = csv.DictWriter(stream, fieldnames=fields)
        writer.writeheader()
        for item in windows:
            full = item.get("full_frame_top5") or []
            crop = item.get("person_crop_top5") or []
            writer.writerow({
                "window_start_sec": item["window_start_sec"],
                "window_end_sec": item["window_end_sec"],
                "person_track_id": item["person_track_id"],
                "track_coverage": item["track_coverage"],
                "full_frame_top1": full[0]["label"] if full else "",
                "full_frame_score": full[0]["softmax_score"] if full else "",
                "person_crop_top1": crop[0]["label"] if crop else "",
                "person_crop_score": crop[0]["softmax_score"] if crop else "",
                "expected_label": item.get("expected_label") or "",
                "full_frame_target_rank": item.get("full_frame_target_rank") or "",
                "person_crop_target_rank": item.get("person_crop_target_rank") or "",
            })


def write_preview(
    path: Path,
    sampled: list[dict[str, Any]],
    track_boxes: list[list[float] | None],
    windows: list[dict[str, Any]],
    track_id: int,
    fps: float,
) -> None:
    first = cv2.imread(sampled[0]["frame_path"])
    if first is None:
        return
    height, width = first.shape[:2]
    writer = cv2.VideoWriter(
        str(path),
        cv2.VideoWriter_fourcc(*"mp4v"),
        max(1.0, fps),
        (width, height),
    )
    if not writer.isOpened():
        return
    try:
        for index, record in enumerate(sampled):
            frame = cv2.imread(record["frame_path"])
            if frame is None:
                continue
            box = track_boxes[index]
            if box is not None:
                x1, y1, x2, y2 = [int(round(v)) for v in box]
                cv2.rectangle(frame, (x1, y1), (x2, y2), (40, 220, 90), 2)
                label = f"PERSON ID {track_id}"
                cv2.putText(frame, label, (max(4, x1), max(22, y1 - 8)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.65, (40, 220, 90), 2, cv2.LINE_AA)

            current = None
            for item in windows:
                if item["start_index"] <= index <= item["end_index"]:
                    current = item
            if current is not None:
                full = current.get("full_frame_top5") or []
                crop = current.get("person_crop_top5") or []
                full_label = full[0]["label"] if full else "n/a"
                crop_label = crop[0]["label"] if crop else "track_lost"
                text = f"Full: {full_label} | Person crop: {crop_label}"
                cv2.rectangle(frame, (0, 0), (width, 36), (20, 28, 42), -1)
                cv2.putText(frame, text[:110], (10, 24),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (245, 245, 245), 1, cv2.LINE_AA)
            writer.write(frame)
    finally:
        writer.release()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--video", type=Path, default=None)
    parser.add_argument("--sample-id", default=None,
                        help="Download one video from the configured Hugging Face demo dataset.")
    parser.add_argument("--dataset-id", default="multimodal-vision-ai/mvai-daily-action-demo")
    parser.add_argument("--dataset-revision", default="bb8570bf0bd2c19f1ac5f161f33e8a07728797a5")
    parser.add_argument("--videomae-repo", required=True, type=Path,
                        help="Local clone of the official OpenGVLab/VideoMAEv2 repository.")
    parser.add_argument("--checkpoint", type=Path, default=None,
                        help="Optional local checkpoint; otherwise downloaded from Hugging Face.")
    parser.add_argument("--label-map", type=Path, default=None)
    parser.add_argument("--yolo-model", default="yolo11s.pt")
    parser.add_argument("--tracker", default="bytetrack.yaml")
    parser.add_argument("--yolo-conf", type=float, default=0.25)
    parser.add_argument("--person-id", type=int, default=None,
                        help="Optional explicit YOLO track ID; default selects the dominant track.")
    parser.add_argument("--sample-fps", type=float, default=7.5)
    parser.add_argument("--stride-sec", type=float, default=0.5)
    parser.add_argument("--max-seconds", type=float, default=0.0,
                        help="0 means the complete video; set a value for a short smoke test.")
    parser.add_argument("--person-padding", type=float, default=0.25)
    parser.add_argument("--max-track-gap-sec", type=float, default=0.6)
    parser.add_argument("--smoothing-alpha", type=float, default=0.55)
    parser.add_argument("--min-track-coverage", type=float, default=0.8)
    parser.add_argument("--expected-label", default=None,
                        help="Optional exact K710 label for post-inference rank reporting only.")
    parser.add_argument("--device", default="auto", choices=("auto", "cuda", "cpu"))
    parser.add_argument("--fp32", action="store_true",
                        help="Disable CUDA FP16 autocast.")
    parser.add_argument("--save-crops", action="store_true")
    parser.add_argument("--output-dir", type=Path, default=None)
    args = parser.parse_args()

    video_path = resolve_input_video(
        args.video, args.sample_id, args.dataset_id, args.dataset_revision
    )
    if args.sample_fps <= 0 or args.stride_sec <= 0:
        raise SystemExit("--sample-fps and --stride-sec must be positive.")

    script_root = Path(__file__).resolve().parents[3]
    label_path = args.label_map.expanduser().resolve() if args.label_map else (
        script_root / "research" / "video-action-our-solution" / "assets" / "label_map_k710.txt"
    )
    labels = load_labels(label_path)
    if args.expected_label is not None and args.expected_label not in labels:
        raise SystemExit(
            f"Expected label {args.expected_label!r} is not an exact K710 class. "
            "Do not substitute a semantically related class."
        )
    checkpoint_path = resolve_checkpoint(args.checkpoint)
    if args.device == "auto":
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    else:
        device = torch.device(args.device)
    if device.type == "cuda" and not torch.cuda.is_available():
        raise SystemExit("CUDA was requested but is not available.")

    output_dir = args.output_dir.expanduser().resolve() if args.output_dir else (
        video_path.parent / f"{video_path.stem}_videomae_yolo_poc"
    )
    output_dir.mkdir(parents=True, exist_ok=True)
    save_crop_dir = output_dir / "person_crops" if args.save_crops else None

    started = time.perf_counter()
    with tempfile.TemporaryDirectory(prefix="mvai_videomae_yolo_") as temp_name:
        temp_dir = Path(temp_name)
        (sampled, track_stats, source_fps, source_size,
         yolo_elapsed_seconds, yolo_peak_memory_mb) = detect_and_sample(
            video_path=video_path,
            yolo_model_name=args.yolo_model,
            tracker_name=args.tracker,
            yolo_conf=args.yolo_conf,
            sample_fps=args.sample_fps,
            max_seconds=args.max_seconds,
            device=device,
            temp_dir=temp_dir,
        )
        sampled_fps = min(args.sample_fps, source_fps)
        total_source_frames = max(1, int(round(sampled[-1]["time_sec"] * source_fps)) + 1)
        person_track_id, track_scores = choose_primary_track(
            track_stats, total_source_frames, args.person_id
        )
        track_boxes = resolve_track_boxes(
            sampled,
            person_track_id,
            max_gap_sec=args.max_track_gap_sec,
            smoothing_alpha=args.smoothing_alpha,
        )

        model_load_started = time.perf_counter()
        model = load_videomae(args.videomae_repo, checkpoint_path, device)
        model_load_ms = (time.perf_counter() - model_load_started) * 1000
        use_fp16 = device.type == "cuda" and not args.fp32
        if device.type == "cuda":
            torch.cuda.reset_peak_memory_stats()
        window_starts = make_windows(len(sampled), sampled_fps, args.stride_sec)
        windows: list[dict[str, Any]] = []

        for window_number, start_index in enumerate(window_starts, start=1):
            end_index = min(start_index + NUM_FRAMES - 1, len(sampled) - 1)
            indices = [min(start_index + offset, len(sampled) - 1) for offset in range(NUM_FRAMES)]
            timestamps = [float(sampled[index]["time_sec"]) for index in indices]
            record: dict[str, Any] = {
                "window_number": window_number,
                "start_index": start_index,
                "end_index": end_index,
                "window_start_sec": round(timestamps[0], 3),
                "window_end_sec": round(timestamps[-1], 3),
                "person_track_id": person_track_id,
                "track_coverage": round(sum(track_boxes[i] is not None for i in indices) / NUM_FRAMES, 4),
                "expected_label": args.expected_label,
            }

            full_clip, _ = build_clip(
                sampled, track_boxes, start_index, "full_frame",
                args.person_padding, None
            )
            full_start = time.perf_counter()
            full_top5, full_target_rank = predict_clip(
                model, full_clip, labels, device, use_fp16, args.expected_label
            )
            if device.type == "cuda":
                torch.cuda.synchronize()
            full_ms = (time.perf_counter() - full_start) * 1000
            record["full_frame_top5"] = full_top5
            record["full_frame_inference_ms"] = round(full_ms, 1)
            record["full_frame_target_rank"] = full_target_rank

            if record["track_coverage"] >= args.min_track_coverage:
                crop_clip, _ = build_clip(
                    sampled, track_boxes, start_index, "person_crop",
                    args.person_padding, save_crop_dir
                )
                crop_start = time.perf_counter()
                crop_top5, crop_target_rank = predict_clip(
                    model, crop_clip, labels, device, use_fp16, args.expected_label
                )
                if device.type == "cuda":
                    torch.cuda.synchronize()
                crop_ms = (time.perf_counter() - crop_start) * 1000
                record["person_crop_top5"] = crop_top5
                record["person_crop_inference_ms"] = round(crop_ms, 1)
                record["person_crop_target_rank"] = crop_target_rank
            else:
                record["person_crop_top5"] = []
                record["person_crop_inference_ms"] = None
                record["person_crop_target_rank"] = None
                record["person_crop_skip_reason"] = "insufficient_person_track_coverage"

            windows.append(record)
            print(
                f"[{window_number}/{len(window_starts)}] "
                f"{record['window_start_sec']:.2f}-{record['window_end_sec']:.2f}s | "
                f"full={full_top5[0]['label']} | "
                f"person_crop={(record['person_crop_top5'] or [{}])[0].get('label', 'track_lost')}"
            )

        videomae_peak_memory_mb = (
            round(torch.cuda.max_memory_allocated() / (1024**2), 1)
            if torch.cuda.is_available() else None
        )
        del model
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        preview_fps = max(1.0, sampled_fps)
        preview_path = output_dir / f"{video_path.stem}_preview.mp4"
        write_preview(preview_path, sampled, track_boxes, windows, person_track_id, preview_fps)

    result = {
        "schema_version": "videomae-v2-yolo-poc-v1",
        "inference_only": True,
        "training_performed": False,
        "model_id": MODEL_ID,
        "checkpoint_file": MODEL_FILE,
        "checkpoint_sha256": sha256_file(checkpoint_path),
        "label_map_sha256": sha256_file(label_path),
        "num_classes": NUM_CLASSES,
        "model_architecture": "vit_base_patch16_224",
        "num_frames_per_clip": NUM_FRAMES,
        "tubelet_size": TUBELET_SIZE,
        "input_size": INPUT_SIZE,
        "video_path": str(video_path),
        "video_sha256": sha256_file(video_path),
        "source_fps": source_fps,
        "source_resolution": list(source_size),
        "sampled_frames": len(sampled),
        "sample_fps": sampled_fps,
        "window_stride_sec": args.stride_sec,
        "person_detector": args.yolo_model,
        "ultralytics_version": __import__("ultralytics").__version__,
        "tracker": args.tracker,
        "yolo_detection_elapsed_seconds": round(yolo_elapsed_seconds, 2),
        "yolo_peak_gpu_memory_mb": yolo_peak_memory_mb,
        "videomae_model_load_ms": round(model_load_ms, 1),
        "videomae_peak_gpu_memory_mb": videomae_peak_memory_mb,
        "peak_gpu_memory_mb": max(
            [v for v in (yolo_peak_memory_mb, videomae_peak_memory_mb) if v is not None],
            default=None,
        ),
        "torch_version": torch.__version__,
        "person_track_id": person_track_id,
        "person_track_selection_scores": {str(k): round(v, 8) for k, v in track_scores.items()},
        "person_padding": args.person_padding,
        "min_track_coverage": args.min_track_coverage,
        "expected_label_post_inference_only": args.expected_label,
        "device": str(device),
        "precision": "fp16_autocast" if use_fp16 else "fp32",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "elapsed_seconds": round(time.perf_counter() - started, 2),
        "score_warning": "K710 softmax scores are model outputs, not calibrated probabilities or target-domain accuracy.",
        "windows": windows,
        "preview_video": str(preview_path) if preview_path.is_file() else None,
    }
    json_path = output_dir / "results.json"
    json_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    csv_path = output_dir / "results.csv"
    write_csv(csv_path, windows)

    print("\nCompleted inference-only VideoMAE V2 + YOLO proof of concept.")
    print(f"JSON: {json_path}")
    print(f"CSV: {csv_path}")
    if preview_path.is_file():
        print(f"Preview: {preview_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

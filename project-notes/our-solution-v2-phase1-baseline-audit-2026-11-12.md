# Our Solution V2 — Phase 1 baseline audit (2026-11-12)

## Scope and status

V2 develops from the approved PR #82 merge commit `5bc8b7dd9cf38601b5d9de0c949ec0c7246346a8`. The remote `main` was verified to point to that exact commit at the start of Phase 1. This file is a source-code audit, **not** a model inference benchmark.

No V1 algorithm has been modified. No model training, fine-tuning, or LoRA is permitted. Do not merge this branch or deploy it before manual acceptance.

The original two surveillance videos remain local/private; neither the videos nor extracted frames are committed to the public repository.

## Exact released execution paths (source-verified)

| Path | Baseline code | Actual implementation |
|---|---|---|
| Realtime perception | `our-solution-live-worker.js` | MediaPipe EfficientDet-Lite0 ObjectDetector (person and cell phone) + Pose Lite + Hands, CPU; separate X3D-S clip worker |
| Full-video clip analysis | `our-solution.js` | X3D-S Kinetics-400 ONNX via onnxruntime-web WASM |
| Full-video geometry fallback | `our-solution.js` | YOLO26s ONNX (person and phone decoding) + Pose Full + Hands; geometry is invoked only if the clip vote yields no action |
| Person selection/association | `person-target.js`, `person-overlay.js` | IoU, area ratio, center distance, latest-person/pose fallback; **do not assume ByteTrack is used by these released paths** |
| Spatial action rules | `our-solution-rules.js` | Phone-hand spatial rule; box transition for falling; stable reclined pose for Sleeping Posture |
| Live fall display logic | `our-solution-live-worker.js` | Fall pose corroboration and temporary label hold; not a standalone multi-stage fall-state machine |

## Concrete limitations identified before modification

1. Realtime phone ROI detection is gated by the availability of both shoulder landmarks: see `our-solution-live-worker.js` near the `if(p[11]&&p[12])` condition. `our-solution-phone-fast.js` makes regions only from available hands/wrists. When small/occluded poses fail, this path does not attempt a person-based ROI.
2. `our-solution-rules.js` identifies a falling transition only after a narrow standing person box (width/height < 0.8) becomes wide (width/height > 1.2) within 3 seconds. Slow sliding or sitting-down motion can remain unresolved; the live worker additionally requires corroborating torso geometry.
3. Sleeping Posture uses a torso-angle/stability rule; the published decision does not establish person-chair spatial contact and does not determine whether someone is physiologically asleep.
4. Full-video `analyzeOurSolution()` first executes X3D-S classification across the clip, but it performs `analyzeGeometry()` only if `clipDecision(windows)` returns no action. Mixed-activity recordings may therefore never reach geometry analysis for the three V2 targets.
5. The full-video YOLO decoder currently selects model outputs for class indices 0 (person) and 67 (phone); a chair detection implementation requires explicit validated class-index/box extraction, rather than assuming it is already present.
6. These findings are static source-code observations. No quantitative performance, accuracy, false-negative counts or original inference labels are claimed here.

## Mandatory engineering sequence

1. Archive a real, reproducible PR #82 browser inference run on the same local inputs, including model/manifest digests, per-timestamp outputs, boxes, worker errors, timing and machine/browser version. **Status: not yet completed**; this session cannot retrieve the 56.9 MB pinned release archive or remote MediaPipe/ONNX dependencies in the isolated execution environment.
2. Have a reviewer label Using Phone, Falling, Sleeping Posture and ambiguous/non-target spans before metric calculations. Retain ambiguous events as uncertain; do not score them as definitive falls or sleep.
3. Implement V2 as opt-in parallel/shadow components, with the released V1 result unchanged by default. Assess phone person-ROI fallback first, then temporal falling-state handling, then person-chair sleeping-posture evidence.
4. Run all 12 original action samples, six non-Our-Solution model options, realtime playback, full-video analysis, local uploads, cancellation, model switching and same-video comparison. Track regression and latency separately.
5. Provide a real DEV preview and full before/after test evidence for manual acceptance. Do not modify `main` or production deployment without explicit approval.

## Provenance

- PR: https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/pull/82
- Release manifest: `scripts/video-action/our_solution_release.json`
- Source root: `docs/assets/projects/video-action/browser-inference/`
- Approved merge SHA: `5bc8b7dd9cf38601b5d9de0c949ec0c7246346a8`

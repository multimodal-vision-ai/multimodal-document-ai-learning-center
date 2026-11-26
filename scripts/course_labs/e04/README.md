# E04 V1.0 DEV — Road object detection

Teacher-approved baseline: E04-material-review.zip (2026-11-26). A/B/C clips 12 s, 1280×720, 25 fps. Core frames A1 A3 B1 B3 C1 C3; A2 B2 C2 optional. Sources and licenses must accompany every derived asset; do not replace clips by re-encoding from upstream. Review package records 108 forwards / 1296 postprocessed settings, not live browser inference.

## Development gates

- Stage the exact approved ZIP using stage_media.py; verify hashes. No ZIP or weights committed yet.
- Export YOLO26n/s raw 84×N models locally; check metadata, output, parity with approved frame results and package version. Repository is Apache-2.0; do not distribute Ultralytics AGPL weights or derivative models before license-compatible publication decision.
- Browser core decodes raw candidates, runs class-aware NMS, letterboxes inputs and restores coordinates. Verify actual ONNX WebGPU and WASM providers, including cold load, same image across input sizes and device-specific speed. No model file means no live inference.
- Five lab panels: basics, confidence, IoU/NMS, resolution/model comparison, sequential frame/video detection. Parameter changes in confidence/NMS reuse raw candidates; image/model/size changes run a new forward; no cached images presented as live.
- Deliver executable Python notebook (CPU/CUDA), local/Kaggle smoke tests, teacher PDF following E03 V2.1, full DEV web preview with real assets and browser tests. Do not merge dev or main before teacher approval.

Technical references: https://docs.ultralytics.com/integrations/onnx and https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html

## Technical milestone — 2026-11-26

GitHub Actions run 45740994673 succeeded: all six raw ONNX outputs (1×84×2100, 8400, 18900), Node WASM real forwards and Chromium WASM actual dual-model comparison/canvas smoke. The smoke used a synthetic QA image, not reviewed road media. WebGPU hardware and real video not verified. The new gate requires the exact 21.9 MB uploaded archive at `scripts/course_labs/e04/E04-material-review.zip` (SHA256 dbb6440700eda37e8b2e908eb24991c65ffc9385e865794ab1a3fe124fe5e60e). All 76 embedded checks plus clip hashes are verified; no substitutions. The binary cannot be transferred via current text-only file connector. Upload on feature branch only. CI stages the archive in a temporary directory, performs real C1/B1, A3 and A/B/C frame tests, and does not distribute ONNX files publicly. Public licensing review remains separate: preserve root Apache-2.0; consider independently hosted AGPL-compliant E04 app after explicit approval. Never enable public export by default.

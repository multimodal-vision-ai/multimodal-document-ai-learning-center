# Native OCR browser adapters — development status (2026-11-06)

## Approved constraints
- Only add **ATH-MaaS/OvisOCR3** (official native 0.8B) and **PaddleOCR-VL-1.6** (official 0.9B).
- Keep original three model implementations, page markup/layout, styles, buttons and comparisons unchanged.
- Never convert new OCR output to DocTags. Preserve raw generated JSON/HTML/LaTeX.
- Require document element geometry and labels; never invent bounding boxes.
- Browser WebGPU only, no server inference and no silent WASM/CPU fallback.
- Do not add either model to the active dropdown until a browser GPU end-to-end test passes.
- No main merge or HF deployment without manual review.

## Technical routes

### Official OvisOCR3
- Original model: https://huggingface.co/ATH-MaaS/OvisOCR3
- Full official Structured prompt fetched from
  https://huggingface.co/ATH-MaaS/OvisOCR3/resolve/main/prompts/document_structured.txt
- Keep native JSON array with `bbox`, `category`, `content`. Bbox is integer 0..999 normalized to the supplied image.
- Existing DJX ONNX exporter is a possible **starting point**, not a validated drop-in converter.
  The port in `adapters/ovisocr3-native/export_onnx.py` removes DJX-only dummy token IDs.
- The source BF16 repo has no verified native ONNX WebGPU artifacts in this work.
  The adapter requires a separately exported validated model ID. Do not point
  `from_pretrained` directly at the official BF16 repo and call it WebGPU-ready.
- Mandatory gate: complete export; tokenizer/checkpoint parity; official prompt and JSON output;
  authentic Chrome WebGPU image test; bbox/content parity with upstream reference.

### PaddleOCR-VL-1.6
- Official model: https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6
- Browser FP16 engine: https://github.com/glebkudr/paddleocr-vl-webgpu (Apache-2.0).
- Converted pack: https://huggingface.co/glebkudr/PaddleOCR-VL-1.6-WebGPU
- Browser layout: https://github.com/chenmohan123/web-sdk-PP-DocLayoutV3 (Apache-2.0).
- Engine `createPaddleOcrVlEngine()` supports `recognizeCanvas`, task
  `ocr | table | formula | chart`; it does NOT itself provide page layout detection or
  an immediate per-token cancellation method.
- Layout detector `createDocLayout({backend:'webgpu',precision:'fp16',allowFallback:false})`
  yields detections with `box.{xMin,yMin,xMax,yMax}`, `label`, `readingOrder`.
- Staged dependency-injected pipeline accepts only actual WebGPU instances and
  produces official `parsing_res_list` fields without DocTags conversion.
- Mandatory gate: pin and vendor/bundle the published engine with all WASM dependencies,
  check licenses/NOTICE, verify original pixel geometry, memory/caching/release,
  termination between regions, and end-to-end output on target GPU.

## Completed in isolated feature branch
- Strict native Ovis/Paddle JSON parsers with unchanged raw output and bbox checking.
- Safe result renderer: text nodes and allow-listed HTML tables; no unsafe innerHTML.
- Region routing and browser Paddle two-stage adapter skeleton with strict WebGPU backend checks.
- Separate Ovis native prompt/adapter; existing DJX adapter unchanged.
- Offline unit tests and a PR-scoped Node test workflow.

## Not yet complete: not verified and not exposed
- Official OvisOCR3 source weight export/parity check and tested public HF ONNX bundle.
- Paddle engine/WASM packaging + real browser GPU test + region quality evaluation.
- Original UI's 03/04/05 rendering router and file download mapping; intentionally untouched
  until native model outputs are verified.
- Browser GPU acceptance on RTX 3080 / A800, runtime profiling, DEV deployment.
- Original-model regression tests after integration.

## Repository discipline
- Source-of-truth directories: `hf-spaces/mvai-doctags-webgpu` and mirrored
  `docs/assets/projects/doctags/browser-inference`; synchronize any runtime
  files before approving a future deployment.
- No model should enter `model-registry.js` while its runtime remains unvalidated.
- Never claim full model integration based on these static contract tests.

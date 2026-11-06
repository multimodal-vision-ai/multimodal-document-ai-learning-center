# Native OCR browser adapters — development status (2026-11-06)

## Approved constraints
- Add only the official **ATH-MaaS/OvisOCR3 0.8B** and **PaddleOCR-VL-1.6 0.9B** models.
- Keep the original three model implementations, page markup/layout, styles, buttons and comparison flow unchanged.
- Preserve each model's native result format. Never translate new outputs into DocTags.
- Require real element geometry and labels; never synthesize bounding boxes.
- Browser-local WebGPU only. No server inference and no silent CPU/WASM fallback.
- Do not add either model to the active dropdown until browser GPU end-to-end tests pass.
- No main merge or HF Space publication before manual review.

## Official source contracts

### OvisOCR3
- Source: https://huggingface.co/ATH-MaaS/OvisOCR3
- Pinned source commit: `17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90`
- Architecture: Qwen3.5-0.8B; BF16 source weights; Apache-2.0.
- Structured prompt is copied into the converted bundle from the pinned source. It returns a single JSON array with `bbox`, `category`, and `content`; bbox coordinates are integers in `[0, 1000)`.
- Tables remain HTML, formulas remain LaTeX, and image/chart regions reference crops using official `<img src="images/bbox_...jpg" />` content.
- Official generation config uses EOS IDs `248044` and `248046`.
- The browser adapter accepts only the dedicated `multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX` repository and requires its immutable 40-character commit SHA.
- The bundle contract now requires a successful source-parity report, source checkpoint hash, tokenizer parity, prompt hash, and pinned source revision before model files are downloaded.
- The exporter pins Microsoft Olive recipe commit `74c2ab2f0bdd5acabcb05b24e9edf145e1020e12` and the vision source SHA-256. It copies the official prompt, license, tokenizer, chat template, and generation config.
- A hash-verified staging/upload script is prepared. It refuses to upload without a successful component validation report and excludes temporary build artifacts.

### PaddleOCR-VL-1.6
- Official source: https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6
- Browser VLM engine: `glebkudr/paddleocr-vl-webgpu` commit `f7d2f8aa40639497e1dbd95f2f8793e664b90758`.
- Browser FP16 model pack: `glebkudr/PaddleOCR-VL-1.6-WebGPU` revision `5219606297d00bbd23b2ec193271af0c0b427dfc`; 2,038,286,862 bytes.
- Layout SDK: `web-sdk-pp-doclayoutv3` version 1.2.0; pinned upstream commit `3aedb7b35af49a1c207fd4f846211366a9d09973`.
- Layout manifest: PP-DocLayoutV3 FP16; 74,279,796 bytes; source model manifest includes SHA-256 validation.
- The adapter now loads the pinned browser SDK and VLM runtime directly, explicitly requests WebGPU FP16 and disables fallback. It bypasses the upstream adaptive factory and creates exactly one WebRuntime (the upstream factory would create up to three runtime handles on an RTX 3080).
- It performs a one-token warm-up because the VLM engine downloads its large model assets lazily on first inference. The model is not reported ready until this real download and warm-up finish.
- The pipeline detects regions in original page pixels, preserves reading order, crops from the original image, routes OCR/table/formula/chart tasks, and assembles native `parsing_res_list`.
- Stop can interrupt layout detection. The upstream VLM does not expose token-level cancellation; if a region is decoding, that region finishes, then the adapter stops and returns completed native blocks marked incomplete.
- A standalone browser test page has been added at `dev-paddleocr-vl16.html`. It does not alter the production page or model registry.

## Completed in the isolated feature branch
- Native Ovis/Paddle JSON parsers with raw-output preservation and strict bbox validation.
- Safe renderer for text and allow-listed HTML tables; no unsafe `innerHTML`.
- Ovis exporter, component validator, PyTorch reference runner, and hash-checked HF upload staging.
- Pinned Paddle browser dependencies and a concrete layout-to-VLM WebGPU adapter with model warm-up and partial-stop handling.
- Independent Paddle browser acceptance page.
- Offline parser/contract tests and CI syntax checks for Python and upload scripts.

## Not yet accepted / not exposed
- Official OvisOCR3 checkpoint has not yet been downloaded, exported, parity-validated, or uploaded to the MVAI HF model repository.
- OvisOCR3 has not yet passed a real Chrome WebGPU document test.
- PaddleOCR-VL-1.6 has not yet passed a real Chrome WebGPU document test on the target GPU.
- The Paddle runtime and layout SDK are loaded from pinned external CDN URLs; a self-hosted mirror has not yet been prepared.
- Native result routing into the production page's 03/04/05 panes and model registry is intentionally not done yet.
- Runtime performance, cold/warm cache behavior, memory stability, stop/dispose behavior, and original three-model regression tests remain outstanding.
- The new runtime files have not yet been mirrored into `docs/assets/projects/doctags/browser-inference`, and no HF Space or main branch deployment has occurred.

## Next execution sequence
1. Run the Paddle standalone page on Chrome + RTX 3080 10GB. Verify cold load, warm-up, text/table/formula/chart/image sample, bbox alignment, partial stop, repeat inference, and dispose. Record console errors and timings.
2. In parallel, download the exact Ovis source revision and run the pinned ONNX export plus component parity checks.
3. Upload only the hash-verified Ovis bundle; record its full HF commit SHA; then run the Ovis browser test on the same document images.
4. Once both models pass, connect their native renderers to the existing UI without redesign and run the original three-model regression suite.
5. Request manual review. Only then merge to dev/main and publish.

## Repository discipline
- Source of truth: `hf-spaces/mvai-doctags-webgpu`; mirror runtime files into `docs/assets/projects/doctags/browser-inference` only after runtime acceptance.
- No model enters `model-registry.js` while its real browser runtime is unvalidated.
- Static contract tests are not proof of a real WebGPU model integration.

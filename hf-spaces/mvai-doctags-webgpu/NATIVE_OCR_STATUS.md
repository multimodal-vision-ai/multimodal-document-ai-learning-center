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
- A hash-verified staging/upload script is prepared. It refuses to upload without a successful component validation report and excludes temporary build artifacts. A pinned `run_conversion.sh` now automates source download, Olive recipe checkout, export and component validation; it does not upload unless `UPLOAD=1` is explicitly set.

### PaddleOCR-VL-1.6
- Official source: https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6
- Browser VLM engine: `glebkudr/paddleocr-vl-webgpu` commit `f7d2f8aa40639497e1dbd95f2f8793e664b90758`.
- Browser FP16 model pack: `glebkudr/PaddleOCR-VL-1.6-WebGPU` revision `5219606297d00bbd23b2ec193271af0c0b427dfc`; 2,038,286,862 bytes.
- Layout SDK: `web-sdk-pp-doclayoutv3` version 1.2.0; pinned upstream commit `3aedb7b35af49a1c207fd4f846211366a9d09973`.
- Layout manifest: PP-DocLayoutV3 FP16; 74,279,796 bytes; source model manifest includes SHA-256 validation.
- Published manifest URL: `https://chenmohan123.github.io/web-sdk-PP-DocLayoutV3/models/manifest.json`. The source-tree path `models/pp-doclayoutv3/manifest.json` is staged by the upstream Pages build to `/models/manifest.json`; using the source-tree path as a public URL causes HTTP 404.
- The adapter now loads the pinned browser SDK and VLM runtime directly, explicitly requests WebGPU FP16 and disables fallback. It bypasses the upstream adaptive factory and creates exactly one WebRuntime (the upstream factory would create up to three runtime handles on an RTX 3080); software-rendering adapters are rejected.
- Fixed the second browser-load failure: the SDK had constructed its module Worker from jsDelivr, which the browser rejected as cross-origin. The adapter now overrides the SDK's worker-base global immediately before detector creation so `inference.worker.js` resolves to the same-origin `vendor/ppdoclayoutv3/` directory. A staging script downloads the exact v1.2.0 worker (732,503 bytes), verifies SHA-256 `128380b8f435c07b1dec25542355708dbd99e033b2fcf994d13d12bc8b3a6a6b`, and places it in the Space and DEV asset trees. The DEV workflow checks the published worker bytes and URL-base file.
- It performs a one-token warm-up because the VLM engine downloads its large model assets lazily on first inference. The model is not reported ready until this real download and warm-up finish.
- The pipeline detects regions in original page pixels, preserves reading order, crops from the original image, routes OCR/table/formula/chart tasks, and assembles native `parsing_res_list`.
- Stop can interrupt layout detection. The upstream VLM does not expose token-level cancellation; if a region is decoding, that region finishes, then the adapter stops and returns completed native blocks marked incomplete.
- A standalone browser test page has been added at `dev-paddleocr-vl16.html`. It does not alter the production page or model registry.

## Completed in the isolated feature branch
- Native Ovis/Paddle JSON parsers with raw-output preservation and strict bbox validation.
- Safe renderer for text and allow-listed HTML tables; no unsafe `innerHTML`.
- Added a native Paddle OTSL parser and safe table renderer for `<fcel>`, `<ecel>`, `<lcel>`, `<ucel>`, `<xcel>`, and `<nl>`. It reconstructs cell grids and merge spans for display only; original `block_content` and raw JSON remain unchanged. The original OTSL is available in a collapsed disclosure; malformed structures fall back to raw text with a warning.
- Paddle DEV result blocks are selectable: clicking a text/table block redraws the original page and highlights that block's original-pixel bbox. This adds no panel or layout changes.
- Added parser tests for normal/empty cells, horizontal/vertical/two-axis merges, malformed markers, and raw-output safety; mirrored renderer/parser files are checked byte-for-byte by CI.
- Ovis exporter, component validator, PyTorch reference runner, and hash-checked HF upload staging.
- Pinned Paddle browser dependencies and a concrete layout-to-VLM WebGPU adapter with model warm-up and partial-stop handling.
- Independent Paddle browser acceptance page.
- PaddleOCR-VL-1.6 completed its first real browser inference on a Chinese financial document: WebGPU FP16 model load/warm-up succeeded; PP-DocLayoutV3 produced page-positioned title/text/table/page-number regions; the native right pane displayed Paddle parsing output. Table structure was returned as OTSL, not HTML, so visual table rendering remained the next acceptance item.
- Following the OTSL renderer implementation, the user manually retested the DEV page and confirmed on 2026-11-06 that parsing and layout reconstruction are correct. PaddleOCR-VL-1.6's native OTSL table rendering is accepted for this stage.
- Offline parser/contract tests and CI syntax checks for Python and upload scripts.
- The Ovis exporter dummy-input names are now checked against each ONNX component's declared input names; this caught and fixed an input versus input_ids mismatch before model conversion.
- Native Ovis HTML table/image tag detection was corrected; the safe renderer continues to use DOM node creation and never injects untrusted HTML.
- Paddle standalone acceptance page, adapter and pipeline contract are mirrored into the MkDocs DEV assets. CI checks byte-for-byte mirror parity and verifies the published test page and its local assets are reachable.
- Ovis standalone acceptance page, adapter and source contract are also mirrored into the MkDocs DEV assets. CI checks their byte-for-byte parity and public reachability; the page remains gated on the future validated ONNX bundle.
- Paddle result assembly now rejects a missing region recognition result instead of silently filling an empty content field; intentionally skipped image regions remain explicitly represented.
- Fixed the Paddle layout manifest URL after the first RTX 3080 browser load returned HTTP 404. The adapter now requests the upstream Pages-staged `/models/manifest.json`, and a regression test guards this exact published path.
- Added a regression test proving that the resolved PP-DocLayoutV3 worker URL has the same origin as the demo page and a CI-pinned worker staging check.
- Ovis decoder packaging and validation now run `onnx.checker` after external-data packaging.

## Not yet accepted / not exposed
- Official OvisOCR3 checkpoint has not yet been downloaded, exported, parity-validated, or uploaded to the MVAI HF model repository.
- OvisOCR3 has not yet passed a real Chrome WebGPU document test.
- **PaddleOCR-VL-1.6 人工验收通过（2026-11-06）**：用户在目标浏览器 / RTX 3080 上复测 OTSL 渲染更新后的版本，确认文档解析与版面还原均正常。验收覆盖原图版面定位、原生结构化解析与表格可视化；该模型可视为本阶段通过。更广泛的公式/图表样例、停止/重复运行、显存稳定性与原有三模型回归仍需后续专项测试。
- The PP-DocLayoutV3 inference Worker is now staged as a same-origin static asset. The SDK browser-global bundle, Paddle VLM engine, and ONNX Runtime WASM files still use pinned external CDN URLs; self-hosting those remaining runtime components has not yet been prepared.
- Native result routing into the production page's 03/04/05 panes and model registry is intentionally not done yet.
- Runtime performance, cold/warm cache behavior, memory stability, stop/dispose behavior, and original three-model regression tests remain outstanding.
- The isolated Paddle acceptance page and its two adapter modules are mirrored into `docs/assets/projects/doctags/browser-inference` for the PR-specific DEV preview; CI now checks byte-for-byte parity with the HF Space source. Ovis runtime files are not yet mirrored. No HF Space or main branch deployment has occurred.

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

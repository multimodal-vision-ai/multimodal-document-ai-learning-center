# Native OCR browser adapters — development status (2026-11-07)

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
- PaddleOCR-VL-1.6 manual acceptance passed on 2026-11-06 after OTSL native table rendering: the user confirmed document parsing and layout reconstruction are correct on the target browser/GPU. Extended formula/chart, stop/repeat, memory stability and original-model regression checks remain follow-up coverage.
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

## Historical pre-acceptance status (superseded 2026-11-07)

> The following checklist records the state before the OvisOCR3 conversion and browser acceptance completed. The current status is summarized at the end of this document.

- Official OvisOCR3 checkpoint has not yet been downloaded, exported, parity-validated, or uploaded to the MVAI HF model repository.
- OvisOCR3 has not yet passed a real Chrome WebGPU document test.
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

## 2026-11-06 — OvisOCR3 conversion preflight audit

The Ovis conversion toolchain was reviewed against the exact pinned official source revision and the pinned Microsoft Olive recipe before any large checkpoint download or export.

### Issues found and fixed

- The official source checkpoint contains `preprocessor_config.json`, not `processor_config.json`. The exporter now reads the official top-level `size` schema, preserves the original normalization and patch settings, and changes only the approved browser resolution limits (448²–1440² pixels).
- The exporter previously treated the decoded `config.json` dictionary as an object. It now reads `model_type` and `text_config.vocab_size` through dictionary keys.
- The pinned Olive recipe's `Qwen3_5VisionModel` returns the pooled feature tensor directly, while the native Transformers implementation exposes `pooler_output`. The vision wrapper now accepts both documented output forms.
- The bundle validator no longer requires the absent `processor_config.json`; it requires and validates `preprocessor_config.json`, including source SHA-256 and the narrowly permitted browser-size change.
- The upload staging gate now requires the preprocessor provenance and the validated browser-size settings.
- `run_conversion.sh` now runs Python syntax and lightweight exporter-contract tests before downloading the 1.71 GB source checkpoint, then checks all required source assets immediately after download.

### Static validation

Latest feature-branch commit: `e2cb26094c5dea42133467347dd56cda7194d527`.

GitHub Actions on that commit:
- Native OCR output contracts: passed; exporter IO, processor-schema, vision-output and bundle-asset contract checks passed.
- DEV Preview isolated static build: passed.
- Documentation quality: passed.

### Still not executed

The official checkpoint has **not** yet been downloaded or converted. No ONNX component-parity report exists, no ONNX bundle has been uploaded, and no Ovis browser inference has been run. Static CI validates the scripts and contracts only; it is not model-conversion or GPU-inference acceptance.

Next action: run the pinned conversion on the dedicated Linux/Python 3.11 environment, inspect the component validation report, then run the original BF16 reference and real Chrome WebGPU acceptance on the target RTX 3080. HF upload remains a separate explicit approval gate.


## 2026-11-07 — Both native models accepted; production integration started

### Model acceptance

**OvisOCR3 0.8B**
- The official ATH-MaaS/OvisOCR3 checkpoint was exported and component-validated on Kaggle Tesla T4.
- The validated ONNX bundle was uploaded to multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX.
- Immutable bundle commit: de391cb93aa2ee1b67692bdba1b143bf8e4a9f98.
- Source revision remains 17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90.
- Real browser WebGPU inference and manual structured-output/layout acceptance passed on Chrome 155 / NVIDIA RTX 3080 10GB.
- The accepted 1024² run produced 13 valid structure elements and 13 valid positions; one performance report recorded 1458 generated tokens, 34.61 seconds end-to-end, 42.82 tokens/s and complete generation.
- Default production input pixel limit is 1024². The native Structured JSON array is preserved, including normalized bbox, category and content; no DocTags conversion is performed.

**PaddleOCR-VL-1.6 0.9B**
- Manual browser acceptance passed on Chrome 155 / NVIDIA RTX 3080 10GB; the user confirmed parsing and layout reconstruction were correct.
- Browser model revision: 5219606297d00bbd23b2ec193271af0c0b427dfc.
- PP-DocLayoutV3 FP16 + PaddleOCR-VL WebGPU FP16; same-origin worker assets are staged in the HF Space and DEV assets.
- Native parsing_res_list, original-pixel boxes and OTSL content are preserved; no DocTags conversion is performed.

### Production integration on the PR #74 feature branch

- The model registry now contains five built-in choices: Granite Docling, OvisOCR3, PaddleOCR-VL-1.6, MVAI DJX-0.8B and MVAI WC-2B.
- The production DocTags page loads the native JSON parser and safe renderer, routes each new model to its own adapter, draws native-coordinate boxes and renders the native reading view.
- Ovis and Paddle results retain an explicit output-format tag in A/B history; the comparison panes render the appropriate native or DocTags format.
- Native output downloads as JSON; existing DocTags downloads remain .dt.
- Original Granite/DJX/WC adapters, model files and DocTags paths remain unchanged.
- The two new native adapters and renderer assets are mirrored byte-for-byte between hf-spaces/mvai-doctags-webgpu and docs/assets/projects/doctags/browser-inference.
- The integration uses fixed model revisions. Ovis defaults to the accepted 1024² setting. No additional Decoder optimization is planned for this release.

### Release gates

1. Complete static contract tests, Python validation, JavaScript syntax checks and DEV preview asset probes.
2. Manually verify the integrated five-model selector, Ovis/Paddle load and inference, native output rendering, position overlay, A/B history, download format, model switching and regression of Granite/DJX/WC.
3. After manual DEV acceptance, merge PR #74 into dev. The publish-hf-doctags.yml workflow then publishes the approved HF Static Space bundle if the repository HF_TOKEN secret is configured.
4. After the DEV/HF Space version is accepted, promote the approved dev content to main for GitHub Pages production deployment.

Current rule: do not merge to main before the integrated DEV page and HF Space have been manually accepted.

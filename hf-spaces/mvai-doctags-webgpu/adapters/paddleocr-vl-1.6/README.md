# PaddleOCR-VL-1.6 · Browser WebGPU pipeline

## Pinned components

| Component | Pinned source | Purpose |
|---|---|---|
| PaddleOCR-VL-1.6 | PaddlePaddle/PaddleOCR-VL-1.6 | Official 0.9B document VLM |
| Browser VLM runtime | glebkudr/paddleocr-vl-webgpu @ f7d2f8aa40639497e1dbd95f2f8793e664b90758 | Rust/WASM WebGPU inference |
| Browser model pack | glebkudr/PaddleOCR-VL-1.6-WebGPU @ 5219606297d00bbd23b2ec193271af0c0b427dfc | FP16 model files; 2,038,286,862 bytes |
| Layout detector SDK | web-sdk-pp-doclayoutv3 1.2.0 @ 3aedb7b35af49a1c207fd4f846211366a9d09973 | Browser PP-DocLayoutV3 detection |
| Layout model | PP-DocLayoutV3 fp16 | 74,279,796 bytes; source manifest SHA-256 checked by SDK |

**Published manifest URL:**  
`https://chenmohan123.github.io/web-sdk-PP-DocLayoutV3/models/manifest.json`

Do not construct the public URL from the source repository path `models/pp-doclayoutv3/manifest.json`. The upstream Pages build runs `scripts/stage-pages-models.mjs`, which stages the manifest at `apps/demo/dist/models/manifest.json` and rewrites the model variant URLs to `/models/model-fp16.onnx` and `/models/model-fp32.onnx`. The source-tree path is not the deployed Pages path and returns HTTP 404.

## Same-origin inference worker

The SDK's browser-global bundle creates its module worker relative to `globalThis.__PPDOCLAYOUT_SCRIPT_URL__`. When the SDK bundle is loaded from jsDelivr, that produces a cross-origin Worker URL and the browser rejects it from the DEV/Space origin.

The adapter now overrides that SDK worker base immediately before `createDocLayout()` with a same-origin URL resolved from its own module location:

- URL base: `../../vendor/ppdoclayoutv3/worker-base.js`
- Worker: `../../vendor/ppdoclayoutv3/inference.worker.js`

The actual v1.2.0 worker is pinned to 732,503 bytes and SHA-256 `128380b8f435c07b1dec25542355708dbd99e033b2fcf994d13d12bc8b3a6a6b`. It is downloaded by `scripts/stage-ppdoclayout-worker.mjs`, hash-verified, and staged into the local `vendor/ppdoclayoutv3/` directory. The DEV build copies this directory into the public MkDocs asset tree and verifies the exact public worker bytes. This keeps Worker construction same-origin; ONNX Runtime WASM assets continue to use their explicitly configured CDN path.

Before uploading the standalone adapter to a Hugging Face Static Space, run:

```bash
node scripts/stage-ppdoclayout-worker.mjs
```

Upload the generated `vendor/ppdoclayoutv3/worker-base.js` and `inference.worker.js` alongside the adapter. Do not point the SDK worker base back at the jsDelivr browser-global URL.

The browser runtime and PP-DocLayoutV3 SDK are Apache-2.0. Keep their upstream license and attribution notices with any vendored distribution. The original Paddle model card/license must also be retained with the model pack.

## Actual execution sequence

1. Load PP-DocLayoutV3 using the pinned SDK and its fp16 ONNX variant.
2. Explicitly request backend=webgpu, precision=fp16, allowFallback=false.
3. Detect page regions and reading order in the original image-pixel coordinate system.
4. Crop each region from the original image without resizing the saved bbox coordinates.
5. Route table, formula, chart and OCR regions to the corresponding PaddleOCR-VL-1.6 task.
6. Assemble native parsing_res_list entries with block_bbox, block_label, block_content, block_id and block_order.
7. Keep the raw VLM text separately for audit; only remove a known task heading from the content field when present.

No region boxes are synthesized. A missing, invalid, or out-of-image bbox stops the pipeline. Results remain native Paddle JSON and are never converted to DocTags.

## Loading and memory

The upstream VLM engine downloads its model assets lazily on the first recognition call. The adapter therefore performs a one-token 448×448 warm-up before reporting the model ready. This loads the VLM weights into the browser runtime and allows the UI's load-progress display to cover the real download and initialization.

Approximate cold download:
- PaddleOCR-VL-1.6 WebGPU pack: 2.04 GB (decimal bytes)
- PP-DocLayoutV3 fp16 ONNX: 74.3 MB
- Total: approximately 2.11 GB

The layout detector and VLM remain loaded together because the approved two-stage pipeline needs both. Only one user-selected document model pipeline should be active at a time. The upstream convenience factory creates multiple runtime handles on high-end GPUs (up to three on an RTX 3080). This adapter deliberately bypasses that factory and constructs exactly one `WebRuntime`; page regions are processed sequentially to reduce GPU-context and memory pressure.

## Stop behavior

PP-DocLayoutV3 accepts AbortSignal, so stop can interrupt layout detection. The published Paddle VLM runtime does not expose token-level cancellation from recognizeCanvas. If stop is requested while a region is being decoded, the current region is allowed to finish; the adapter then stops before the next region and returns the completed native blocks with ended=false and incomplete=true. Partial results must not enter the complete-result comparison history.

## Browser acceptance gates

Before adding the model to the active model registry:
1. Test cold load in Chrome with WebGPU and shader-f16 enabled.
2. Confirm PP-DocLayoutV3 reports webgpu/fp16 and the VLM engine actually generates output in the browser.
3. Test a page with text, a table, a formula, a chart, and an image region.
4. Verify all returned block_bbox coordinates align with the original image, not the resized 800×800 layout input or the cropped region.
5. Compare output against the official PaddleOCR-VL-1.6 reference on the same public sample.
6. Verify warm inference, stop during layout, stop during region decoding, repeat inference, and model disposal.
7. Test on the target RTX 3080 10GB and record load time, inference time, browser GPU adapter, and memory failures.

**Current status:** concrete browser modules and the full two-stage adapter are now pinned in code. No real browser GPU acceptance has been run in this project yet; the model remains absent from the active model list.

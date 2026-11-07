# Official OvisOCR3 0.8B · Browser WebGPU conversion

## Model and output contract

- Source model: https://huggingface.co/ATH-MaaS/OvisOCR3
- Pinned source revision: 17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90
- Architecture: Qwen3.5-0.8B; BF16 source checkpoint (about 1.71 GB)
- License: Apache-2.0
- Target ONNX repository: multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX
- Browser runtime: Transformers.js 4.4.0-next.0 + ONNX Runtime Web 1.31.1
- Execution: browser-local WebGPU with shader-f16; no server inference or CPU fallback

OvisOCR3's official Structured task emits a JSON array in reading order. Each item contains bbox, category, and content; bbox coordinates are integer values in [0, 1000), relative to the image passed to the model. Tables remain HTML, formulas remain LaTeX, and text/image categories remain in the official native format. The browser renderer consumes this native output directly; it does not translate it into DocTags.

## Why a conversion step is required

The official source repository publishes BF16 Safetensors, not a ready-to-load Transformers.js WebGPU ONNX bundle. Do not pass ATH-MaaS/OvisOCR3 directly to the browser adapter. The adapter only accepts the dedicated ONNX repository above and requires its full 40-character commit SHA.

The export script reuses the already verified Qwen3.5-0.8B ONNX recipe and graph surgery. It pins both the Olive recipe commit and the SHA-256 of the exact vision source file. It also packages the original tokenizer, chat template, generation settings, and Structured prompt with a source provenance manifest.

## Conversion environment

Use an isolated Python 3.11 environment. The conversion is inference/export only; it does not train or fine-tune the model.

~~~bash
python -m venv .venv-ovis
source .venv-ovis/bin/activate
python -m pip install --upgrade pip
python -m pip install torch==2.10.0
python -m pip install 'huggingface_hub>=0.34.0'
python -m pip install -r hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/requirements-export.txt
~~~

Download the exact official model revision:

~~~bash
hf download ATH-MaaS/OvisOCR3 \
  --revision 17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90 \
  --local-dir ./source/OvisOCR3
~~~

Fetch the pinned Microsoft Olive recipe:

~~~bash
git clone https://github.com/microsoft/olive-recipes.git
cd olive-recipes
git checkout 74c2ab2f0bdd5acabcb05b24e9edf145e1020e12
cd ..
~~~

Recommended: run the complete pinned download → export → component-validation sequence with one command (the script does not upload anything by default):

~~~bash
bash hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/run_conversion.sh
~~~

The default working directory is `.cache/ovisocr3-webgpu`. Set `OVIS_THREADS=4` to tune CPU threads. If you deliberately need to replace an earlier partial export, set `CLEAN_OUTPUT=1`. To upload after a successful validation, explicitly set `UPLOAD=1` and provide `HF_TOKEN`; the upload script repeats the hash checks before publishing.

Run the individual export steps manually if you need to debug a component:

~~~bash
python hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/export_onnx.py \
  --model ./source/OvisOCR3 \
  --output-dir ./release/ovisocr3-webgpu \
  --recipe-dir ./olive-recipes/Qwen-Qwen3.5-0.8B/builtin
~~~

The script runs Python syntax and exporter-contract checks before downloading the checkpoint. It verifies the required files at the pinned source revision, including the official `preprocessor_config.json`, then checks the exact source revision argument and exact vision-source SHA-256. It exports the vision encoder, token embeddings, and merged FP16 decoder for WebGPU, then copies the model's original tokenizer/template/prompt assets. The original image-normalization settings are retained; only the browser image-size limits are reduced to 448²–1440² pixels. The resulting bundle includes source-model.json with source checkpoint, prompt, and preprocessor hashes.

## Required validation

Run component parity against the original BF16 checkpoint before uploading any model files:

~~~bash
python hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/validate_bundle.py \
  --model ./source/OvisOCR3 \
  --bundle ./release/ovisocr3-webgpu \
  --report ./release/ovisocr3-webgpu/validation/component_validation.json
~~~

This checks:
- pinned source checkpoint and prompt hashes;
- unchanged tokenizer vocabulary, special tokens, chat template, and generation config;
- sampled input embedding and tied output-projection weights against the source checkpoint;
- vision encoder parity at three image grids;
- decoder graph structure, expected GatedDeltaNet/CausalConvWithState layer counts, custom-op imports, and every external-data range;
- all required ONNX external-data files and browser assets.

The Python export environment uses the generic CPU Execution Provider, which does not implement the decoder's target GatedDeltaNet kernel. Therefore the validator deliberately does not create a CPU ONNX Runtime Session for the decoder. This is not a decoder execution failure: the decoder graph is structurally checked here, and actual operator execution is a mandatory separate acceptance step in Chrome using ONNX Runtime WebGPU 1.31.1. Do not replace GatedDeltaNet merely to make the CPU checker pass.

Run an original PyTorch reference on a permitted test image:

~~~bash
python hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/test_reference.py \
  --model ./source/OvisOCR3 \
  --image ./test-data/document-page.png \
  --output ./release/ovisocr3-webgpu/validation/pytorch_reference.json \
  --device cuda
~~~

The exported bundle is not considered ready until the same image produces valid native Structured JSON in real Chrome WebGPU, with matching text, category order, and plausible bbox positions. A CPU PyTorch result or ONNX CPU session is not browser WebGPU acceptance.

## Prepare and upload the validated bundle

Only after component validation reports success, create a clean staging folder and upload it to the MVAI Hugging Face organization:

~~~bash
export HF_TOKEN=YOUR_WRITE_TOKEN
bash hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/upload_bundle.sh \
  ./release/ovisocr3-webgpu
~~~

The staging script verifies every artifact's byte count and SHA-256 against the validation report, includes the original Apache-2.0 license and validation evidence, and excludes intermediate .build files. It refuses to upload if the component validation report is missing or unsuccessful. After upload, record the new repository's full commit SHA; the browser adapter deliberately rejects a floating main revision.

## Publication gate

After conversion and parity checks:
1. Upload the complete release/ovisocr3-webgpu bundle to the target HF repository. Include every *_data file.
2. Record the resulting full 40-character HF commit SHA.
3. Pin that exact SHA in the DEV model registry and adapter call.
4. Run the browser test on Chrome + NVIDIA RTX 3080 10GB, including cold load, warm inference, stop, repeat inference, and bbox/render alignment.
5. Only after the manual DEV review may the model be promoted.

**Current status (2026-11-07):** the pinned official checkpoint has been converted and validated on Kaggle T4, uploaded to the MVAI Hugging Face organization, and successfully loaded/inferred in Chrome WebGPU on an RTX 3080. Performance optimization is in progress on the isolated PR #74 branch; do not add the model to the active model list until the speed/quality and stability gates pass.


## Browser performance profiling (2026-11-07)

The OvisOCR3 DEV adapter now uses a token-only streamer for the normal inference path. The previous Transformers.js `TextStreamer` decoded and re-copied the growing token prefix at every generation step; this page only needs the final text, so incremental prefix decoding is skipped. The generated token sequence and final decoded text remain unchanged.

The adapter also measures each ONNX session's `run()` wall time and separates:
- image decoding and processor preprocessing;
- Vision Encoder session time;
- embedding session time;
- first Decoder call (prefill);
- subsequent Decoder calls (autoregressive decode);
- generation time outside the measured ONNX sessions.

Use 1024² as the default optimization baseline. Keep 1440² as the high-quality reference; 768² and 576² are diagnostic options only.

For ONNX Runtime verbose logs and session profiling, add `?profile=1` to the standalone DEV page URL. Profiling mode adds overhead; do not compare its wall-clock speed directly with normal mode. Each run can export a JSON performance report that excludes recognized document text and token IDs.

WASM thread selection is now adaptive: ORT uses automatic thread selection only when the page is cross-origin isolated and SharedArrayBuffer is available; otherwise it remains single-threaded. The adapter explicitly enables the generation KV cache.

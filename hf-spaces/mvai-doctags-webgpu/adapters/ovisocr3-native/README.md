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

Run the export from the repository root:

~~~bash
python hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/export_onnx.py \
  --model ./source/OvisOCR3 \
  --output-dir ./release/ovisocr3-webgpu \
  --recipe-dir ./olive-recipes/Qwen-Qwen3.5-0.8B/builtin
~~~

The script checks the exact source revision argument and exact vision-source SHA-256. It exports the vision encoder, token embeddings, and merged FP16 decoder for WebGPU, then copies the model's original tokenizer/template/prompt assets. The resulting bundle includes source-model.json with source checkpoint and prompt hashes.

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
- all required ONNX external-data files and browser assets.

Run an original PyTorch reference on a permitted test image:

~~~bash
python hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native/test_reference.py \
  --model ./source/OvisOCR3 \
  --image ./test-data/document-page.png \
  --output ./release/ovisocr3-webgpu/validation/pytorch_reference.json \
  --device cuda
~~~

The exported bundle is not considered ready until the same image produces valid native Structured JSON in real Chrome WebGPU, with matching text, category order, and plausible bbox positions. A CPU PyTorch result or ONNX CPU session is not browser WebGPU acceptance.

## Publication gate

After conversion and parity checks:
1. Upload the complete release/ovisocr3-webgpu bundle to the target HF repository. Include every *_data file.
2. Record the resulting full 40-character HF commit SHA.
3. Pin that exact SHA in the DEV model registry and adapter call.
4. Run the browser test on Chrome + NVIDIA RTX 3080 10GB, including cold load, warm inference, stop, repeat inference, and bbox/render alignment.
5. Only after the manual DEV review may the model be promoted.

**Current status:** export code and validation tooling are prepared; the official checkpoint has not yet been exported, uploaded, or browser-validated. The model must remain absent from the active model list until those gates pass.

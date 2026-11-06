#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
SCRIPT_DIR="$ROOT/hf-spaces/mvai-doctags-webgpu/adapters/ovisocr3-native"
WORK_DIR="${1:-$ROOT/.cache/ovisocr3-webgpu}"
SOURCE_DIR="$WORK_DIR/source/OvisOCR3"
RECIPE_ROOT="$WORK_DIR/olive-recipes"
RECIPE_DIR="$RECIPE_ROOT/Qwen-Qwen3.5-0.8B/builtin"
BUNDLE_DIR="$WORK_DIR/release/ovisocr3-webgpu"
SOURCE_ID="ATH-MaaS/OvisOCR3"
SOURCE_REVISION="17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90"
RECIPE_COMMIT="74c2ab2f0bdd5acabcb05b24e9edf145e1020e12"
THREADS="${OVIS_THREADS:-4}"

for command in git hf python sha256sum; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Missing required command: $command" >&2
    exit 2
  }
done
[[ "$THREADS" =~ ^[1-9][0-9]*$ ]] || {
  echo "OVIS_THREADS must be a positive integer." >&2
  exit 2
}

if [[ -e "$BUNDLE_DIR" ]]; then
  if [[ "${CLEAN_OUTPUT:-0}" == "1" ]]; then
    echo "CLEAN_OUTPUT=1: removing prior export directory: $BUNDLE_DIR"
    rm -rf -- "$BUNDLE_DIR"
  else
    echo "Export directory already exists: $BUNDLE_DIR" >&2
    echo "Move it aside or rerun with CLEAN_OUTPUT=1 to explicitly replace it." >&2
    exit 2
  fi
fi

mkdir -p "$(dirname "$SOURCE_DIR")" "$(dirname "$RECIPE_ROOT")" "$(dirname "$BUNDLE_DIR")"

echo "[1/5] Downloading the pinned official OvisOCR3 source checkpoint..."
hf download "$SOURCE_ID" \
  --revision "$SOURCE_REVISION" \
  --local-dir "$SOURCE_DIR"

test -s "$SOURCE_DIR/config.json"
test -s "$SOURCE_DIR/model.safetensors"
test -s "$SOURCE_DIR/prompts/document_structured.txt"

echo "[2/5] Preparing the pinned Microsoft Olive recipe..."
if [[ ! -d "$RECIPE_ROOT/.git" ]]; then
  git clone https://github.com/microsoft/olive-recipes.git "$RECIPE_ROOT"
fi
git -C "$RECIPE_ROOT" fetch --depth=1 origin "$RECIPE_COMMIT"
git -C "$RECIPE_ROOT" checkout --detach "$RECIPE_COMMIT"
ACTUAL_RECIPE_COMMIT="$(git -C "$RECIPE_ROOT" rev-parse HEAD)"
[[ "$ACTUAL_RECIPE_COMMIT" == "$RECIPE_COMMIT" ]] || {
  echo "Olive recipe commit mismatch: $ACTUAL_RECIPE_COMMIT" >&2
  exit 2
}
test -s "$RECIPE_DIR/codes/modeling_qwen3_5.py"

echo "[3/5] Exporting FP16 ONNX components for browser WebGPU..."
python "$SCRIPT_DIR/export_onnx.py" \
  --model "$SOURCE_DIR" \
  --output-dir "$BUNDLE_DIR" \
  --recipe-dir "$RECIPE_DIR" \
  --threads "$THREADS"

echo "[4/5] Validating every component against the pinned BF16 source..."
python "$SCRIPT_DIR/validate_bundle.py" \
  --model "$SOURCE_DIR" \
  --bundle "$BUNDLE_DIR" \
  --report "$BUNDLE_DIR/validation/component_validation.json" \
  --threads "$THREADS"

echo "[5/5] Conversion and component validation completed."
echo "Validated bundle: $BUNDLE_DIR"
echo "No upload has been performed."
echo "To upload after reviewing the validation report, run:"
echo "  HF_TOKEN=... bash $SCRIPT_DIR/upload_bundle.sh \"$BUNDLE_DIR\""

if [[ "${UPLOAD:-0}" == "1" ]]; then
  echo "UPLOAD=1: uploading only the validated bundle."
  bash "$SCRIPT_DIR/upload_bundle.sh" "$BUNDLE_DIR"
fi

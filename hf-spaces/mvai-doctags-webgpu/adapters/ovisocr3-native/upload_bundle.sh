#!/usr/bin/env bash
set -euo pipefail

BUNDLE_DIR="${1:?Usage: upload_bundle.sh <validated-bundle-dir> [staging-dir]}"
STAGING_DIR="${2:-${BUNDLE_DIR%/}-hf-upload}"
MODEL_ID="multimodal-vision-ai/OvisOCR3-0.8B-WebGPU-ONNX"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel)"

if ! command -v hf >/dev/null 2>&1; then
  echo "Missing Hugging Face CLI. Install huggingface_hub and authenticate first." >&2
  exit 2
fi
if [[ -z "${HF_TOKEN:-}" ]]; then
  echo "HF_TOKEN is not set. Refusing to create or upload the model repository." >&2
  exit 2
fi

python "$SCRIPT_DIR/prepare_upload.py" --bundle "$BUNDLE_DIR" --staging "$STAGING_DIR"

hf repo create "$MODEL_ID" --repo-type model --exist-ok
hf upload "$MODEL_ID" "$STAGING_DIR" . --repo-type model \
  --commit-message "Publish validated OvisOCR3 0.8B WebGPU ONNX bundle"

echo "Upload complete. Record the full repository commit SHA and pin it in the DEV adapter/registry."

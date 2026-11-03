# Our Solution — VideoMAE V2 K710 + YOLO quick validation

This is an offline proof of concept. It does not modify the DEV page or any of the existing six model paths.

## What it tests

- Existing YOLO11s COCO weights detect and track people (class 0); ByteTrack keeps a stable person ID.
- The same existing VideoMAE V2 ViT-Base K710 checkpoint classifies 16-frame clips.
- Full-frame and person-crop inputs are compared using the same checkpoint, label map, temporal windows, and preprocessing.
- The entire input video is processed using overlapping windows (default stride 0.5 seconds); the script is not limited to an 8-second clip.
- JSON, CSV, and a sampled annotated preview video are written to the output directory.

No training, fine-tuning, distillation, optimizer, or checkpoint updates are performed.

## Why ViT-Base K710

Official checkpoint: OpenGVLab/VideoMAE2, distill/vit_b_k710_dl_from_giant.pth (174 MB). The checkpoint SHA256 is verified by the script before loading. The official K710 label map is copied into this repository without reordering.

The official model zoo reports K710 Top-1 81.5% for ViT-Base under a 16-frame × 5-temporal-segment × 3-spatial-crop evaluation protocol. This is a benchmark result on K710, not an expected accuracy on our own clips. The quick POC uses one spatial crop per sliding window to keep runtime practical.

## Exact native K710 labels in the current 12 DEV pilot clips

The 10 A/B actions below have exact native labels in the official K710 map:

| DEV sample ID | Expected K710 label |
|---|---|
| real_a_wave_001 | waving hand |
| real_a_phone_use_001 | looking at phone |
| real_a_phone_call_001 | talking on cell phone |
| real_a_sleeping_001 | sleeping |
| real_b_jogging_002 | jogging |
| real_b_yoga_002 | yoga |
| real_b_push_up_002 | push up |
| real_b_sit_up_002 | situp |
| real_b_ballet_002 | dancing ballet |
| real_b_hula_hooping_001 | hula hooping |

Generic eating food and generic falling down are not exact K710 classes. The corresponding sample clips can still be inspected, but their nearest specific K710 labels must not be treated as exact hits.

## 1. Prepare the environment

Use a machine with an NVIDIA GPU if available. Create an isolated environment:

~~~bash
conda create -n mvai-videomae python=3.10 -y
conda activate mvai-videomae
~~~

Install a CUDA-enabled PyTorch and matching torchvision build using the official PyTorch selector for the machine's CUDA driver. Do not install a CPU-only PyTorch build for a GPU test.

Then install the remaining dependencies:

~~~bash
python -m pip install -r scripts/video-action/our-solution/requirements-videomae-yolo.txt
~~~

Clone the official VideoMAE V2 source code:

~~~bash
mkdir -p vendor
git clone --depth 1 https://github.com/OpenGVLab/VideoMAEv2.git vendor/VideoMAEv2
~~~

The official code recommends timm 0.4.12. If the installed PyTorch/torchvision version is incompatible with that legacy code, stop and report the exact import or model-loading error rather than changing model weights or architecture.

## 2. Run one phone-looking sample

~~~bash
python scripts/video-action/our-solution/videomae_v2_yolo_poc.py \
  --sample-id real_a_phone_use_001 \
  --videomae-repo vendor/VideoMAEv2 \
  --expected-label "looking at phone" \
  --save-crops
~~~

The script resolves the sample ID against the pinned HF Dataset revision already used by the DEV sample catalog. If the file is stored in an archive or cannot be resolved uniquely, download/extract it and use --video instead.

For a phone-call sample:

~~~bash
python scripts/video-action/our-solution/videomae_v2_yolo_poc.py \
  --sample-id real_a_phone_call_001 \
  --videomae-repo vendor/VideoMAEv2 \
  --expected-label "talking on cell phone" \
  --save-crops
~~~

The expected label is used only after inference to report its rank. It is never passed to YOLO or VideoMAE and never influences a prediction.

For one B-group control sample:

~~~bash
python scripts/video-action/our-solution/videomae_v2_yolo_poc.py \
  --sample-id real_b_jogging_002 \
  --videomae-repo vendor/VideoMAEv2 \
  --expected-label "jogging"
~~~

For an initial smoke test, process only the first 12 seconds:

~~~bash
python scripts/video-action/our-solution/videomae_v2_yolo_poc.py \
  --video /path/to/sample.mp4 \
  --videomae-repo vendor/VideoMAEv2 \
  --max-seconds 12
~~~

Remove --max-seconds to process the complete video.

## 3. Initial settings

- YOLO: yolo11s.pt, person class only.
- Tracker: ByteTrack.
- VideoMAE V2: ViT-Base, K710, 710 logits, 16 frames, 224 × 224, tubelet size 2.
- Sample rate: 7.5 frames/second.
- Sliding-window stride: 0.5 seconds.
- Person crop: square crop around the tracked person with 25% padding on each side.
- Crop smoothing: fixed EMA over detected boxes; short track gaps are interpolated, long gaps cause the person-crop window to be skipped.
- Precision: CUDA FP16 autocast by default; use --fp32 if the device has an issue.

The 16-frame sampling follows the official VideoMAE V2 clip length. The 0.5-second window stride is an engineering choice for continuous analysis, not an official benchmark protocol.

## 4. Outputs

The default output folder is created beside the input video and contains:

- results.json: complete per-window Top-5 predictions, model-load and per-window timings, YOLO/VideoMAE peak GPU memory, checkpoint and video hashes, track information, and settings.
- results.csv: concise full-frame versus person-crop comparison.
- preview.mp4: sampled preview with the selected person box and the two Top-1 predictions.
- person_crops/: saved person crops when --save-crops is enabled.

Softmax scores are the classifier's 710-way output scores. They are not calibrated probabilities and must not be reported as target-domain accuracy.

## 5. Interpretation limits

K710 has exact native labels including looking at phone, talking on cell phone, waving hand, and sleeping. Generic falling down and generic eating food are not exact K710 classes. Some specific food-eating and falling-related labels exist, but they must not be relabeled as generic eating or falling.

The first test is intended to answer:
1. Does the person crop improve the rank of the exact native target class compared with full-frame input?
2. Does the prediction remain stable across overlapping windows?
3. Does the tracker preserve the same person ID throughout the video?
4. Does full-video processing produce usable action intervals?

It is not a formal benchmark. The current hand-selected demo clips are development samples, not a blind test set.

## 6. License note

The VideoMAE2 Hugging Face repository identifies the checkpoint repository as Apache-2.0. Ultralytics YOLO11 code and pretrained weights are distributed under AGPL-3.0 by default. This POC is for internal academic evaluation only; review the applicable license before using Ultralytics components in any public, closed-source, or service deployment. If that license is unsuitable, replace the detector adapter before integration.

## No-training guarantee

This script only loads the published YOLO and VideoMAE V2 checkpoints. It contains no training loop, optimizer, loss, backpropagation, fine-tuning, LoRA, distillation, calibration fitting, or weight-writing operation.

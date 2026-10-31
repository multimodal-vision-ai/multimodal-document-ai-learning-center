# MVAI Video Action Recognition V1.0.2 — independent end-to-end CPU verification

**Date:** 2026-10-31  
**Branch:** `test/movinet-v102-e2e` (isolated; neither `dev` nor `main` modified)  
**Validated run:** [GitHub Actions #41211284959](https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/actions/runs/41211284959)  
**Artifact:** `movinet-v102-real-inference-results` (machine-readable `results.json` and run logs; no source media or model weights uploaded).

## Status and reproduced facts

1. The 15,131,688-byte `litert-community/MoViNet-A0-Stream-LiteRT` TFLite model was downloaded in GitHub Actions. SHA256 verified against `0565d6e2173caf3e144e6a0a6461edfef9dc5cccacf9a093f311f8a8f05434c8`.
2. `ai-edge-litert 2.3.0` on GitHub-hosted Ubuntu 24.04 CPU allocated the real model. Input contract **47 tensors**, output contract **28 tensors**. Single frame: FP32 NCHW `1×3×172×172`.
3. The scripted Streaming history-register and pool-sum recurrence executed on each sampled frame. Running each clip twice with freshly zeroed state yielded consistent final logits.
4. **All four real videos were actually classified.** CPU invocation latency was roughly 1–2 ms per sampled frame on that hosted runner; it does **not** measure browser WASM, video download/decode, cold start, or complete user-facing wall-clock latency.
5. The first run's misleading green job status was due to a missing `pipefail` in the shell script; that issue was fixed before the validated run. The original missing `ffmpeg` installation was also fixed.

## Pilot clips and observed results

| Clip / descriptive reference | Source | Frames | Top-1 observed (uncalibrated softmax) | Reference label rank and score | Tentative interpretation |
|---|---|---:|---|---|---|
| Jumping jacks | Google TensorFlow official MoViNet example, CC-BY attribution to Coach Bobby Bluford | 8 | `jumping jacks` (98.51%) | #1, 98.51% | Top-1 correct |
| Hand waving | Wikimedia Commons `HandWaveExample.webm`, CC BY-SA 4.0 | 26 | `sign language interpreting` (34.33%) | `waving hand` #4, 3.65% | Top-1 incorrect; Top-5 contains target |
| Phone call | Pexels video 6898107, man holding phone to ear | 40 | `playing harmonica` (34.13%) | `talking on cell phone` #2, 28.27% | Top-1 incorrect; reference action visible in sampled frames |
| Holding/using a phone | Pexels video 7933941, hand manipulating a phone near bedding | 11 | `massaging feet` (38.81%) | `looking at phone` #5, 2.96%; `texting` #9, 1.43% | Top-1 incorrect; gaze **not** visible, hence not a strict ground-truth `looking at phone` example |

**Important:** This is a four-clip engineering pilot, not a statistically powered validation set or an estimate of Kinetics-600 accuracy. Scores are uncalibrated softmax values. The fourth source is only safely labeled 'holding/using phone' after the contact-sheet audit, because the person's gaze is not visible. The footage is not necessarily identical in sampling duration to Kinetics training clips. Long clips were evaluated over their first 8 seconds.

## Phone-class distinction

The model's label table contains both `talking on cell phone` and `looking at phone`; this does not imply it can distinguish them reliably in deployment. The phone-to-ear sample was only ranked #2, and the handheld phone sample was ranked #5 for `looking at phone` despite an ambiguous gaze label.

**Recommendation:** Do not mark this model as a ready-to-launch accurate 'phone call vs smartphone use' classifier. A minimum follow-up set should include multiple clearly annotated phone-to-ear calls and face-visible looking/scrolling samples, ideally >=10 independent clips per class, plus negative/confounder controls (inhaler, ear scratching, eating, reading, massage). Compare against a target-domain fine-tuned action model or action-detection alternative.

## What is NOT yet verified

- No independent LiteRT.js **browser WASM** test was executed here. Independent Python LiteRT CPU success and third-party browser reports are different evidence.
- No WebGPU output-equivalence benchmark was performed.
- No formal ground-truth annotations, balanced test split, confidence calibration, CPU memory profiling, or cross-device end-to-end latency measured.
- Not deployed into the Learning Center website, HF Space, `main`, or `dev`.

## Reproducibility and linked sources

- Test code: `experiments/movinet-v102/validate.py`
- Branch workflow: `.github/workflows/movinet-v102-validation.yml`
- Verified run: https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/actions/runs/41211284959
- Model: https://huggingface.co/litert-community/MoViNet-A0-Stream-LiteRT
- Google tutorial (sample provenance): https://www.tensorflow.org/hub/tutorials/movinet
- Wikimedia wave sample: https://commons.wikimedia.org/wiki/File:HandWaveExample.webm
- Pexels call: https://www.pexels.com/video/a-man-using-a-smartphone-6898107/
- Pexels phone-use: https://www.pexels.com/video/person-using-a-smartphone-7933941/

This report is generated exclusively as a **research/test-branch deliverable**; it is not a release approval.

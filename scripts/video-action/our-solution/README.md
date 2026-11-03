# Our Solution — pretrained inference probes

This directory contains inference-only validation scripts. They load existing public checkpoints and never train, fine-tune, update, or save model weights.

## Candidates in this first probe

- Qwen3-VL-2B-Instruct: full-video semantic inspection.
- X-CLIP base patch16 zero-shot: video/text similarity across a fixed prompt set.

These are model-only probes. Person detection, track locking, person-crop generation, and the final evidence-fusion layer are separate steps and are not yet implemented here.

## Environment

Use the existing lab CUDA environment where possible. Install a CUDA-enabled PyTorch build that matches the installed driver, then install the remaining dependencies:

~~~bash
python -m pip install -r scripts/video-action/our-solution/requirements-inference.txt
~~~

Do not install a CPU-only PyTorch wheel on a machine intended for GPU inference.

## Run Qwen3-VL-2B

~~~bash
python scripts/video-action/our-solution/probe_qwen3vl.py \
  --video /path/to/phone_sample.mp4 \
  --fps 1 \
  --max-pixels 151200 \
  --dtype fp16
~~~

The default Qwen3-VL revision is pinned to 89644892e4d85e24eaac8bacfd4f463576704203. The initial probe uses a low frame rate and pixel budget to reduce memory use; this is a starting configuration, not a validated optimum.

## Run X-CLIP

~~~bash
python scripts/video-action/our-solution/probe_xclip.py \
  --video /path/to/phone_sample.mp4 \
  --frames 32 \
  --dtype fp16
~~~

X-CLIP's relative_prompt_softmax is normalized only across the fixed prompts in the script. It must not be described as a calibrated probability or model accuracy.

## Output

Each script writes a JSON record beside the input video (unless an output path is supplied), including:
- video SHA256;
- model ID and resolved checkpoint revision;
- exact prompt or sampling settings;
- raw output / ranked similarity;
- model load time, inference time, GPU name, and peak allocated GPU memory.

## No-training rule

No optimizer, trainer, training dataset, LoRA, adapter, fine-tuning, or checkpoint-writing code is included. Only inference and measurement are performed.

#!/usr/bin/env python3
"""Record real CPU OCR with the supplied checkpoint and its inference prefix."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import time

PREFIX = '<think>\n\n</think>\n\n<doctag>'
STOP_IDS = [248044, 248046, 248086]


def run(args):
    os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1')
    import torch
    from PIL import Image
    from transformers import AutoProcessor, Qwen3_5ForConditionalGeneration
    torch.set_num_threads(args.threads)
    processor = AutoProcessor.from_pretrained(args.model, local_files_only=True)
    processor.image_processor.size = {'shortest_edge': 65536, 'longest_edge': 2073600}
    messages = [{'role': 'user', 'content': [{'type': 'image'}, {'type': 'text', 'text': 'Convert this page to docling.'}]}]
    rendered = processor.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True, enable_thinking=False)
    before, marker, _ = rendered.rpartition('<|im_start|>assistant\n')
    if not marker: raise ValueError('Model template lacks assistant marker')
    prompt = before + marker + PREFIX
    image = Image.open(args.image).convert('RGB')
    inputs = processor(text=[prompt], images=[image], return_tensors='pt')
    report = {'prompt': prompt, 'responsePrefix': PREFIX, 'input_ids': inputs.input_ids[0].tolist(),
              'image_grid_thw': inputs.image_grid_thw.tolist(), 'image_sha256': hashlib.sha256(args.image.read_bytes()).hexdigest(),
              'pixel_values_sha256': hashlib.sha256(inputs.pixel_values.numpy().tobytes()).hexdigest()}
    model = Qwen3_5ForConditionalGeneration.from_pretrained(
        args.model, dtype=torch.float32, local_files_only=True, attn_implementation='eager').eval()
    print('Source model loaded; starting CPU reference', flush=True)
    started = time.monotonic()
    with torch.inference_mode():
        output = model.generate(**inputs, max_new_tokens=args.max_new_tokens, do_sample=False,
                                repetition_penalty=1.02, eos_token_id=STOP_IDS, use_cache=True)
    ids = output[0, inputs.input_ids.shape[1]:].tolist()
    generated = processor.tokenizer.decode(ids, skip_special_tokens=True)
    report.update(text=PREFIX + generated, generatedText=generated, token_ids=ids, generated_tokens=len(ids),
                  seconds=time.monotonic() - started, device='cpu', dtype='float32', postprocess=False,
                  ended=bool(ids and ids[-1] in STOP_IDS), repetition_penalty=1.02)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    args.output.with_suffix('.doctags').write_text(report['text'])
    print(json.dumps(report, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--model', required=True)
    p.add_argument('--image', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--threads', type=int, default=4)
    p.add_argument('--max-new-tokens', type=int, default=256)
    run(p.parse_args())

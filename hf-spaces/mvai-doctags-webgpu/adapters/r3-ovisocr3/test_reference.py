#!/usr/bin/env python3
"""Run a local PyTorch reference on a permitted test image for ONNX comparison."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import time


def run(args):
    os.environ['CUDA_VISIBLE_DEVICES'] = ''
    os.environ['HF_HUB_OFFLINE'] = '1'
    import torch
    from PIL import Image
    from transformers import AutoProcessor, Qwen3_5ForConditionalGeneration

    torch.set_num_threads(args.threads)
    processor = AutoProcessor.from_pretrained(args.model, local_files_only=True)
    processor.image_processor.size = {'shortest_edge':448*448,'longest_edge':1440*1440}
    messages = [{'role':'user','content':[{'type':'image'},{'type':'text','text':'Convert this page to docling.'}]}]
    prompt = processor.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True, enable_thinking=False)
    before, marker, _ = prompt.rpartition('<|im_start|>assistant\n')
    assert marker
    prompt = before + marker
    image = Image.open(args.image).convert('RGB')
    inputs = processor(text=[prompt],images=[image],return_tensors='pt')
    report = {'prompt':prompt,'input_ids':inputs.input_ids[0].tolist(),'image_grid_thw':inputs.image_grid_thw.tolist(),
              'pixel_values_sha256':hashlib.sha256(inputs.pixel_values.numpy().tobytes()).hexdigest()}
    model = Qwen3_5ForConditionalGeneration.from_pretrained(args.model, dtype=torch.float32, local_files_only=True, attn_implementation='eager').eval()
    started = time.monotonic()
    with torch.inference_mode():
        output = model.generate(**inputs,max_new_tokens=args.max_new_tokens,do_sample=False,repetition_penalty=1.0)
    ids = output[0,inputs.input_ids.shape[1]:].tolist()
    report.update(text=processor.tokenizer.decode(ids,skip_special_tokens=True),token_ids=ids,
                  generated_tokens=len(ids),seconds=time.monotonic()-started,device='cpu',dtype='float32',postprocess=False)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False),flush=True)


if __name__ == '__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--model',required=True)
    p.add_argument('--image',type=Path,required=True)
    p.add_argument('--output',type=Path,required=True)
    p.add_argument('--threads',type=int,default=4)
    p.add_argument('--max-new-tokens',type=int,default=256)
    run(p.parse_args())

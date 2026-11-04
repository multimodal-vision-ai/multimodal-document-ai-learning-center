#!/usr/bin/env python3
"""Compare exported components and tokenizer with the exact local checkpoint."""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
import onnx
import onnxruntime as ort
import torch
from transformers import AutoTokenizer
from transformers.models.qwen3_5.modeling_qwen3_5 import Qwen3_5VisionModel

from export_onnx import checkpoint_tensor, file_sha256, local_config


def validate(model, bundle, threads):
    torch.set_num_threads(threads)
    root, config = local_config(model)
    report = {'source_sha256': file_sha256(root / 'model.safetensors'), 'vocab_size':config.text_config.vocab_size}
    assets = ['tokenizer.json','tokenizer_config.json','chat_template.jinja','processor_config.json','generation_config.json']
    report['original_assets_unchanged'] = {name: file_sha256(root/name) == file_sha256(bundle/name) for name in assets}
    assert all(report['original_assets_unchanged'].values())
    tokenizer = AutoTokenizer.from_pretrained(root, local_files_only=True)
    added = [t for t in json.loads((root/'tokenizer.json').read_text())['added_tokens'] if t['id'] >= 248077]
    assert len(added) == 4403
    for token in added:
        assert tokenizer.encode(token['content'], add_special_tokens=False) == [token['id']]
        assert tokenizer.decode([token['id']], skip_special_tokens=True) == token['content']
    report['added_tokens_single_and_lossless'] = len(added)
    options = ort.SessionOptions(); options.intra_op_num_threads = threads; options.inter_op_num_threads = 1
    ids = np.array([[t['id'] for t in added]], dtype=np.int64)
    embed = ort.InferenceSession(str(bundle/'onnx/embed_tokens_fp16.onnx'), options, providers=['CPUExecutionProvider'])
    actual = embed.run(None, {'input_ids':ids})[0]
    weight = checkpoint_tensor(root, 'model.language_model.embed_tokens.weight')
    expected = weight[torch.from_numpy(ids)].half().numpy()
    report['new_token_embedding_max_abs'] = float(np.abs(actual.astype(np.float32)-expected.astype(np.float32)).max())
    assert report['new_token_embedding_max_abs'] < 1e-6
    decoder = onnx.load(bundle/'onnx/decoder_model_merged_fp16.onnx', load_external_data=False)
    head = next(t for t in decoder.graph.initializer if t.name == 'lm_head.MatMul.weight')
    data = {t.key:t.value for t in head.external_data}
    matrix = np.memmap(bundle/'onnx'/data['location'], mode='r', dtype=np.float16,
                       offset=int(data['offset']), shape=tuple(head.dims))
    sample_ids = [0,248077,248105,248605,config.text_config.vocab_size-1]
    assert np.array_equal(matrix[:,sample_ids].T,weight[sample_ids].half().numpy())
    report['lm_head_matches_source'] = sample_ids
    visual = Qwen3_5VisionModel(config.vision_config)
    visual.load_state_dict({key:checkpoint_tensor(root,'model.visual.'+key) for key in visual.state_dict()}, strict=True, assign=True)
    visual = visual.float().eval()
    onnx.checker.check_model(str(bundle/'onnx/vision_encoder.onnx'))
    session = ort.InferenceSession(str(bundle/'onnx/vision_encoder.onnx'), options, providers=['CPUExecutionProvider'])
    comparisons = []
    for h,w in [(4,4),(6,8),(22,34)]:
        torch.manual_seed(0)
        pixels = torch.randn(h*w,1536)
        grid = torch.tensor([[1,h,w]], dtype=torch.int64)
        with torch.inference_mode():
            expected = visual(pixels, grid_thw=grid).pooler_output.half().float().numpy()
        actual = session.run(None, {'pixel_values':pixels.numpy(),'image_grid_thw':grid.numpy()})[0].astype(np.float32)
        cosine = float((actual*expected).sum()/np.linalg.norm(actual)/np.linalg.norm(expected))
        comparison = {'grid':[1,h,w],'shape':list(actual.shape),'cosine':cosine,
                      'max_abs':float(np.abs(actual-expected).max()),'mean_abs':float(np.abs(actual-expected).mean())}
        print(json.dumps(comparison), flush=True)
        assert cosine > .99999
        comparisons.append(comparison)
    report['vision_against_native_checkpoint'] = comparisons
    files = assets + ['config.json','preprocessor_config.json']
    for name in ['embed_tokens_fp16.onnx','vision_encoder.onnx','decoder_model_merged_fp16.onnx']:
        files += ['onnx/'+name,'onnx/'+name+'_data']
    report['artifacts'] = {name:{'bytes':(bundle/name).stat().st_size,'sha256':file_sha256(bundle/name)} for name in files}
    report['success'] = True
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model',type=Path,required=True)
    parser.add_argument('--bundle',type=Path,required=True)
    parser.add_argument('--report',type=Path,required=True)
    parser.add_argument('--threads',type=int,default=4)
    args=parser.parse_args()
    report=validate(args.model,args.bundle,args.threads)
    args.report.parent.mkdir(parents=True,exist_ok=True)
    args.report.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'success':report['success'],'report':str(args.report)}),flush=True)

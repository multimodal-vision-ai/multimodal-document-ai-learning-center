#!/usr/bin/env python3
"""Validate source vocabulary, exported embeddings, output head and vision numerics."""
import argparse
import json
from pathlib import Path


def validate(args):
    import numpy as np
    import onnx
    import onnxruntime as ort
    import torch
    from transformers import AutoTokenizer
    from transformers.models.qwen3_5.modeling_qwen3_5 import Qwen3_5VisionModel
    from export_onnx import checkpoint_tensor, file_sha256, local_config
    from external_data_sharding import (
        MAX_EXTERNAL_DATA_SHARD_BYTES,
        external_data_locations,
    )
    torch.set_num_threads(args.threads)
    root, config = local_config(args.model)
    bundle = args.bundle
    report = {'source_sha256': file_sha256(root / 'model.safetensors'), 'vocab_size': config.text_config.vocab_size}
    assets = ['tokenizer.json', 'tokenizer_config.json', 'chat_template.jinja', 'processor_config.json', 'generation_config.json']
    report['original_assets_unchanged'] = {name: file_sha256(root / name) == file_sha256(bundle / name) for name in assets}
    assert all(report['original_assets_unchanged'].values())
    tokenizer = AutoTokenizer.from_pretrained(root, local_files_only=True)
    added = json.loads((root / 'tokenizer.json').read_text())['added_tokens']
    assert len(tokenizer) == config.text_config.vocab_size == 248654
    for token in added:
        assert tokenizer.encode(token['content'], add_special_tokens=False) == [token['id']]
        assert tokenizer.decode([token['id']], skip_special_tokens=False) == token['content']
    report['added_tokens_single_and_lossless'] = len(added)
    options = ort.SessionOptions(); options.intra_op_num_threads = args.threads; options.inter_op_num_threads = 1
    ids = np.array([[t['id'] for t in added]], dtype=np.int64)
    embed = ort.InferenceSession(str(bundle / 'onnx/embed_tokens_fp16.onnx'), options, providers=['CPUExecutionProvider'])
    actual = embed.run(None, {'input_ids': ids})[0]
    weight = checkpoint_tensor(root, 'model.language_model.embed_tokens.weight')
    expected = weight[torch.from_numpy(ids)].half().numpy()
    report['added_token_embedding_max_abs'] = float(np.abs(actual.astype(np.float32) - expected.astype(np.float32)).max())
    assert report['added_token_embedding_max_abs'] == 0
    decoder = onnx.load(bundle / 'onnx/decoder_model_merged_fp16.onnx', load_external_data=False)
    head = next(t for t in decoder.graph.initializer if t.name == 'lm_head.MatMul.weight')
    data = {t.key: t.value for t in head.external_data}
    matrix = np.memmap(bundle / 'onnx' / data['location'], mode='r', dtype=np.float16,
                       offset=int(data['offset']), shape=tuple(head.dims))
    sample_ids = [0, 248044, 248046, 248085, 248086, config.text_config.vocab_size - 1]
    assert np.array_equal(matrix[:, sample_ids].T, weight[sample_ids].half().numpy())
    report['lm_head_matches_source'] = sample_ids
    visual = Qwen3_5VisionModel(config.vision_config)
    visual.load_state_dict({key: checkpoint_tensor(root, 'model.visual.' + key) for key in visual.state_dict()}, strict=True, assign=True)
    visual = visual.float().eval()
    session = ort.InferenceSession(str(bundle / 'onnx/vision_encoder.onnx'), options, providers=['CPUExecutionProvider'])
    comparisons = []
    for h, w in [(4, 4), (6, 8), (22, 34)]:
        torch.manual_seed(0)
        pixels = torch.randn(h * w, 1536); grid = torch.tensor([[1, h, w]], dtype=torch.int64)
        with torch.inference_mode(): expected = visual(pixels, grid_thw=grid).pooler_output.half().float().numpy()
        actual = session.run(None, {'pixel_values': pixels.numpy(), 'image_grid_thw': grid.numpy()})[0].astype(np.float32)
        cosine = float((actual * expected).sum() / np.linalg.norm(actual) / np.linalg.norm(expected))
        comparison = {'grid': [1, h, w], 'shape': list(actual.shape), 'cosine': cosine,
                      'max_abs': float(np.abs(actual - expected).max()), 'mean_abs': float(np.abs(actual - expected).mean())}
        assert cosine > .99999
        comparisons.append(comparison)
        print(json.dumps(comparison), flush=True)
    report['vision_against_native_checkpoint'] = comparisons
    report['onnx_checker'] = {}
    files = assets + ['config.json', 'preprocessor_config.json']
    for name in ['embed_tokens_fp16.onnx', 'vision_encoder.onnx', 'decoder_model_merged_fp16.onnx']:
        try:
            onnx.checker.check_model(str(bundle / 'onnx' / name))
            report['onnx_checker'][name] = 'passed'
        except onnx.checker.ValidationError as error:
            # ORT intentionally registers this contrib operator in ai.onnx.
            # Standard ONNX has no schema for it (onnx/onnx issue #6582).
            # Keep the runtime graph unchanged and require real WebGPU testing.
            if name != 'decoder_model_merged_fp16.onnx' or 'No Op registered for SimplifiedLayerNormalization' not in str(error):
                raise
            report['onnx_checker'][name] = {
                'status': 'requires_onnxruntime_contrib_schema',
                'operator': 'ai.onnx::SimplifiedLayerNormalization',
                'webgpu_validation_required': True,
            }
        files += ['onnx/' + name, 'onnx/' + name + '_data']
    report['external_data_shards'] = {}
    artifact_files = set(files)
    for name in ['embed_tokens_fp16.onnx', 'vision_encoder.onnx', 'decoder_model_merged_fp16.onnx']:
        model_path = bundle / 'onnx' / name
        graph = onnx.load(str(model_path), load_external_data=False)
        locations = external_data_locations(graph.graph, onnx)
        assert locations, f'{name} has no external-data references'
        shard_records = []
        for location in locations:
            shard_path = (bundle / 'onnx' / location).resolve(strict=True)
            assert shard_path.is_relative_to((bundle / 'onnx').resolve())
            size = shard_path.stat().st_size
            assert size <= MAX_EXTERNAL_DATA_SHARD_BYTES, (
                f'{location} is {size:,} bytes; browser shard limit is '
                f'{MAX_EXTERNAL_DATA_SHARD_BYTES:,}'
            )
            artifact_files.add('onnx/' + name)
            artifact_files.add('onnx/' + location)
            shard_records.append({
                'file': location, 'bytes': size, 'sha256': file_sha256(shard_path)
            })
        report['external_data_shards'][name] = shard_records
    config_json = json.loads((bundle / 'config.json').read_text(encoding='utf-8'))
    external_config = config_json.get('transformers.js_config', {}).get('use_external_data_format')
    assert isinstance(external_config, dict), 'use_external_data_format must declare per-model shard counts'
    decoder_count = external_config.get('decoder_model_merged_fp16.onnx')
    assert decoder_count == len(report['external_data_shards']['decoder_model_merged_fp16.onnx']), (
        'Decoder shard count in config.json does not match the actual external-data files'
    )
    assert decoder_count >= 2, 'Decoder external data must be split into multiple browser-safe shards'
    report['artifacts'] = {
        name: {'bytes': (bundle / name).stat().st_size, 'sha256': file_sha256(bundle / name)}
        for name in sorted(artifact_files)
    }
    report['success'] = True
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'success': True, 'report': str(args.report)}), flush=True)


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--model', type=Path, required=True)
    p.add_argument('--bundle', type=Path, required=True)
    p.add_argument('--report', type=Path, required=True)
    p.add_argument('--threads', type=int, default=4)
    validate(p.parse_args())

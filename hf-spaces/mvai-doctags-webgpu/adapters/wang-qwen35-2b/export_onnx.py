#!/usr/bin/env python3
"""Export wangcheng's Qwen3.5 2B checkpoint; preserve its complete vocabulary.

Reuse the repository's existing Qwen3.5 vision/decoder helpers without changing
the R3 adapter. The embedding is a direct FP16 Gather over the source tensor.
"""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

from external_data_sharding import (
    external_data_locations,
    shard_external_data,
)

HELPERS = Path(__file__).resolve().parents[1] / 'r3-ovisocr3' / 'export_onnx.py'
spec = importlib.util.spec_from_file_location('mvai_qwen35_export_helpers', HELPERS)
shared = importlib.util.module_from_spec(spec)
spec.loader.exec_module(shared)
get_vision_model = shared.get_vision_model
get_vision_io_config = shared.get_vision_io_config
get_vision_dummy_inputs = shared.get_vision_dummy_inputs
checkpoint_tensor = shared.checkpoint_tensor
file_sha256 = shared.file_sha256
local_config = shared.local_config


def export_embedding(root, output, config):
    import onnx
    from onnx import TensorProto, helper, numpy_helper
    weight = checkpoint_tensor(root, 'model.language_model.embed_tokens.weight')
    assert list(weight.shape) == [config.text_config.vocab_size, config.text_config.hidden_size]
    target = output / 'onnx' / 'embed_tokens_fp16.onnx'
    if target.exists() or Path(str(target) + '_data').exists():
        raise FileExistsError(target)
    target.parent.mkdir(parents=True, exist_ok=True)
    graph = helper.make_graph(
        [helper.make_node('Gather', ['weight', 'input_ids'], ['inputs_embeds'], axis=0)],
        'trained_token_embeddings',
        [helper.make_tensor_value_info('input_ids', TensorProto.INT64, ['batch', 'sequence'])],
        [helper.make_tensor_value_info('inputs_embeds', TensorProto.FLOAT16, ['batch', 'sequence', weight.shape[1]])],
        [numpy_helper.from_array(weight.half().numpy(), name='weight')],
    )
    model = helper.make_model(graph, opset_imports=[helper.make_opsetid('', 21)], ir_version=10)
    onnx.save_model(model, target, save_as_external_data=True, all_tensors_to_one_file=True,
                    location=target.name + '_data', size_threshold=1024)
    onnx.checker.check_model(str(target))
    print(json.dumps({'component': 'embedding', 'vocab_size': weight.shape[0], 'model_path': str(target)}), flush=True)


def export_vision(root, output):
    import onnx
    from olive.hardware import AcceleratorSpec
    from olive.model import PyTorchModelHandler
    from olive.passes.onnx.conversion import OnnxConversion
    from olive.passes.onnx.graph_surgeries import GraphSurgeries
    target = output / 'onnx' / 'vision_encoder.onnx'
    if target.exists() or Path(str(target) + '_data').exists():
        raise FileExistsError(target)
    work = output / '.build' / 'vision'; work.mkdir(parents=True, exist_ok=True)
    target.parent.mkdir(exist_ok=True)
    handler = PyTorchModelHandler(
        model_path=str(root), model_script=str(Path(__file__).resolve()),
        model_loader='get_vision_model', io_config='get_vision_io_config',
        dummy_inputs_func='get_vision_dummy_inputs',
    )
    accelerator = AcceleratorSpec('cpu', 'CPUExecutionProvider')
    def make_pass(kind, config):
        return kind(accelerator, kind.generate_config(accelerator, config, disable_search=True))
    handler = make_pass(OnnxConversion, {'use_dynamo_exporter': True, 'target_opset': 21}).run(handler, str(work / 'float32.onnx'))
    handler = make_pass(GraphSurgeries, {'surgeries': [
        {'surgeon': 'PackedAttentionToLoopMHA'}, {'surgeon': 'ReciprocalMulToDiv'},
    ]}).run(handler, str(work / 'attention.onnx'))
    graph = onnx.load(handler.model_path)
    onnx.save_model(graph, target, save_as_external_data=True, all_tensors_to_one_file=True,
                    location=target.name + '_data', size_threshold=1024)
    shared.eliminate_identical_casts(target)
    print(json.dumps({'component': 'vision', 'model_path': str(target), 'compute_dtype': 'float32', 'output_dtype': 'float16'}), flush=True)




def package_decoder(root, output, exported):
    """Rename cache I/O and re-pack decoder weights into browser-safe shards."""
    import onnx

    _, config = local_config(root)
    graph = onnx.load(exported / 'decoder_model_merged.onnx', load_external_data=False)
    mapping = {}
    for layer, kind in enumerate(config.text_config.layer_types):
        if kind == 'linear_attention':
            for prefix in ('past', 'present'):
                for state in ('conv', 'recurrent'):
                    mapping[f'{prefix}.{layer}.{state}'] = f'{prefix}_{state}.{layer}'

    def rename(part):
        for value in (*part.input, *part.output, *part.value_info):
            value.name = mapping.get(value.name, value.name)
            for dim in value.type.tensor_type.shape.dim:
                if dim.dim_param == 'kv_cache_dim':
                    dim.dim_value = config.text_config.head_dim
        for node in part.node:
            for names in (node.input, node.output):
                for index, name in enumerate(names):
                    names[index] = mapping.get(name, name)
            for attribute in node.attribute:
                if attribute.type == onnx.AttributeProto.GRAPH:
                    rename(attribute.g)
                elif attribute.type == onnx.AttributeProto.GRAPHS:
                    for nested in attribute.graphs:
                        rename(nested)

    rename(graph.graph)
    target_dir = output / 'onnx'
    target_dir.mkdir(exist_ok=True)
    target = target_dir / 'decoder_model_merged_fp16.onnx'
    if target.exists():
        raise FileExistsError(target)
    shards = shard_external_data(
        graph.graph, exported, target_dir, target.name
    )
    onnx.save_model(graph, str(target))
    onnx.checker.check_model(str(target))
    print(json.dumps({
        'component': 'decoder',
        'model_path': str(target),
        'cache_io_renames': len(mapping),
        'external_data_shards': [
            {'file': path.name, 'bytes': path.stat().st_size} for path in shards
        ],
    }), flush=True)


def write_assets(root, output):
    config = json.loads((root / 'config.json').read_text())
    decoder_path = output / 'onnx' / 'decoder_model_merged_fp16.onnx'
    decoder_chunks = 1
    if decoder_path.is_file():
        import onnx
        decoder_graph = onnx.load(str(decoder_path), load_external_data=False)
        decoder_chunks = len(external_data_locations(decoder_graph.graph, onnx))
    config['transformers.js_config'] = {
        'use_external_data_format': {
            'embed_tokens_fp16.onnx': 1,
            'vision_encoder.onnx': 1,
            'decoder_model_merged_fp16.onnx': decoder_chunks,
        },
        'kv_cache_dtype': {'fp16': 'float16'},
    }
    (output / 'config.json').write_text(json.dumps(config, indent=2) + '\n')
    processor = json.loads((root / 'processor_config.json').read_text())
    image = {**processor['image_processor'], 'processor_class': processor['processor_class']}
    image.update(min_pixels=65536, max_pixels=2073600, size={'shortest_edge': 65536, 'longest_edge': 2073600})
    (output / 'preprocessor_config.json').write_text(json.dumps(image, indent=2) + '\n')
    for name in ['generation_config.json', 'tokenizer.json', 'tokenizer_config.json', 'processor_config.json', 'chat_template.jinja']:
        destination = output / name
        if destination.exists() and destination.read_bytes() != (root / name).read_bytes():
            raise ValueError(f'Refusing to replace a different model asset: {name}')
        if not destination.exists(): shutil.copy2(root / name, destination)


def export_decoder(root, output):
    exported = output / '.build' / 'decoder-pruned-fp16'
    # The checkpoint declares an auxiliary MTP head. Normal greedy browser
    # generation uses only the autoregressive decoder and has no MTP weights.
    subprocess.run([
        sys.executable, '-m', 'onnxruntime_genai.models.builder',
        '-i', str(root), '-o', str(exported), '-p', 'fp16', '-e', 'webgpu',
        '--extra_options', 'filename=decoder_model_merged.onnx', 'exclude_embeds=true',
        'prune_lm_head=true', 'exclude_mtp=true',
    ], check=True)
    package_decoder(root, output, exported)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model', required=True, type=Path)
    parser.add_argument('--output-dir', required=True, type=Path)
    parser.add_argument('--recipe-dir', required=True, type=Path)
    parser.add_argument('--vision-source-sha256', required=True)
    parser.add_argument('--components', nargs='+', choices=['embedding', 'vision', 'decoder'], default=['embedding', 'vision', 'decoder'])
    parser.add_argument('--threads', type=int, default=4)
    args = parser.parse_args()
    if args.threads < 1: parser.error('--threads must be positive')
    os.environ.update(CUDA_VISIBLE_DEVICES='', OMP_NUM_THREADS=str(args.threads), MKL_NUM_THREADS=str(args.threads),
                      HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1',
                      R3_ONNX_RECIPE_DIR=str(args.recipe_dir.resolve(strict=True)),
                      R3_ONNX_VISION_SOURCE_SHA256=args.vision_source_sha256)
    if hasattr(os, 'sched_getaffinity'):
        os.sched_setaffinity(0, sorted(os.sched_getaffinity(0))[:args.threads])
    import torch
    torch.set_num_threads(args.threads)
    root, config = local_config(args.model)
    if config.text_config.vocab_size != 248654 or config.text_config.hidden_size != 2048:
        raise ValueError('This adapter expects the checked 248654 × 2048 checkpoint')
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for component in dict.fromkeys(args.components):
        if component == 'embedding': export_embedding(root, args.output_dir, config)
        elif component == 'vision': export_vision(root, args.output_dir)
        else: export_decoder(root, args.output_dir)
    write_assets(root, args.output_dir)
    print(json.dumps({'completed_components': args.components, 'vocab_size': config.text_config.vocab_size}), flush=True)


if __name__ == '__main__': main()

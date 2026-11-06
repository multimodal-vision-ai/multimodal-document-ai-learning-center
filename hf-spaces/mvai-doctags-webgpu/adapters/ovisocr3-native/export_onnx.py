#!/usr/bin/env python3
"""Experimental ONNX export for the official ATH-MaaS OvisOCR3 checkpoint.

The decoder uses ONNX Runtime GenAI. The vision architecture and graph surgery
reuse the pinned Microsoft Olive recipe supplied with --recipe-dir.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

OFFICIAL_SOURCE_MODEL_ID = "ATH-MaaS/OvisOCR3"
OFFICIAL_SOURCE_REVISION = "17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90"
OLIVE_RECIPE_COMMIT = "74c2ab2f0bdd5acabcb05b24e9edf145e1020e12"
OLIVE_VISION_SOURCE_SHA256 = "f1ae970216a0b96d56ff2ad35fb99cbff6e358fd15fbc2b87cb95e815de6ba78"


def file_sha256(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for chunk in iter(lambda: stream.read(8 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def local_config(model_path):
    from transformers import AutoConfig

    root = Path(model_path).resolve(strict=True)
    config = AutoConfig.from_pretrained(root, local_files_only=True)
    if config.model_type != "qwen3_5":
        raise ValueError("Expected a local qwen3_5 vision-language checkpoint")
    if not config.tie_word_embeddings:
        raise ValueError("This exporter requires tied input/output embeddings")
    return root, config


def checkpoint_tensor(root, name):
    from safetensors import safe_open

    index = root / "model.safetensors.index.json"
    filename = json.loads(index.read_text())["weight_map"][name] if index.is_file() else "model.safetensors"
    path = (root / filename).resolve(strict=True)
    if not path.is_relative_to(root):
        raise ValueError("Checkpoint tensor path escapes the model directory")
    with safe_open(path, framework="pt", device="cpu") as stream:
        return stream.get_tensor(name)


def vision_reference():
    path = Path(os.environ["OVIS_ONNX_RECIPE_DIR"]) / "codes" / "modeling_qwen3_5.py"
    expected = os.environ.get("OVIS_ONNX_VISION_SOURCE_SHA256")
    if not expected or file_sha256(path) != expected:
        raise ValueError("Vision export source does not match its pinned SHA-256")
    spec = importlib.util.spec_from_file_location("ovis_qwen35_export_reference", path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def load_vision(model_path):
    import torch

    root, config = local_config(model_path)
    reference = vision_reference()
    with torch.device("meta"):
        model = reference.Qwen3_5VisionModel._from_config(config.vision_config)
    expected = model.state_dict()
    state = {}
    for key in expected:
        if key == "rotary_pos_emb.inv_freq":
            dim = config.vision_config.hidden_size // config.vision_config.num_heads // 2
            state[key] = 1.0 / (10000.0 ** (torch.arange(0, dim, 2, dtype=torch.float32) / dim))
        else:
            state[key] = checkpoint_tensor(root, "model.visual." + key)
    model.load_state_dict(state, strict=True, assign=True)
    if any(value.is_meta for value in (*model.parameters(), *model.buffers())):
        raise ValueError("A vision tensor was not materialized from the checkpoint")
    return model.float().eval()


def get_vision_model(model_path=None):
    import torch

    class Encoder(torch.nn.Module):
        def __init__(self, visual):
            super().__init__()
            self.visual = visual

        def forward(self, pixel_values, image_grid_thw):
            # Preserve vision arithmetic in fp32; match the decoder's fp16 image embeddings.
            output = self.visual(pixel_values, grid_thw=image_grid_thw)
            # The pinned Olive recipe's Qwen3_5VisionModel returns the pooled
            # feature tensor directly; Transformers' native implementation
            # returns a ModelOutput exposing pooler_output. Accept both forms.
            if isinstance(output, torch.Tensor):
                pooled = output
            else:
                pooled = getattr(output, "pooler_output", None)
            if pooled is None:
                raise ValueError("Qwen3.5 vision encoder returned neither a tensor nor pooler_output")
            return pooled.to(dtype=torch.float16)

    return Encoder(load_vision(model_path)).eval()


def get_vision_io_config(model_path=None):
    return {
        "input_names": ["pixel_values", "image_grid_thw"],
        "output_names": ["image_features"],
        "dynamic_shapes": {"pixel_values": {0: "num_patches"}, "image_grid_thw": None},
    }


def get_vision_dummy_inputs(model=None):
    import torch

    return {
        "pixel_values": torch.randn((22 * 34, 1536), dtype=torch.float32),
        "image_grid_thw": torch.tensor([[1, 22, 34]], dtype=torch.int64),
    }


def get_embedding_model(model_path=None):
    import torch

    root, config = local_config(model_path)
    weight = checkpoint_tensor(root, "model.language_model.embed_tokens.weight")
    if list(weight.shape) != [config.text_config.vocab_size, config.text_config.hidden_size]:
        raise ValueError("Embedding shape does not match the trained vocabulary")
    return torch.nn.Embedding.from_pretrained(weight.float(), freeze=True).eval()


def get_embedding_io_config(model_path=None):
    return {
        "input_names": ["input_ids"], "output_names": ["inputs_embeds"],
        "dynamic_axes": {
            "input_ids": {0: "batch_size", 1: "sequence_length"},
            "inputs_embeds": {0: "batch_size", 1: "sequence_length"},
        },
    }


def get_embedding_dummy_inputs(model=None):
    import torch

    # Olive passes a PyTorchModelHandler to dummy_inputs_func, not the
    # underlying nn.Embedding module. Resolve the model through Olive's
    # public load_model() API; the handler caches the loaded module.
    if model is None:
        vocabulary = 2
    elif isinstance(model, torch.nn.Embedding):
        # Keep direct-module invocation useful for isolated tests.
        vocabulary = model.num_embeddings
    elif callable(getattr(model, "load_model", None)):
        embedding = model.load_model()
        if not isinstance(embedding, torch.nn.Embedding):
            raise TypeError(
                "OvisOCR3 embedding dummy-input callback expected "
                "PyTorchModelHandler.load_model() to return torch.nn.Embedding; "
                f"received {type(embedding).__name__}"
            )
        vocabulary = embedding.num_embeddings
    else:
        raise TypeError(
            "OvisOCR3 embedding dummy-input callback expects an Olive "
            "PyTorchModelHandler or torch.nn.Embedding; "
            f"received {type(model).__name__}"
        )

    if vocabulary < 1:
        raise ValueError(f"Embedding vocabulary must be positive, got {vocabulary}")

    # The pinned Olive 0.13.0 path uses the legacy TorchScript ONNX
    # exporter for this component. Its args contract is positional; a dict
    # here is not a reliable kwargs mapping and can reach forward() as no
    # positional inputs. Return a one-element tuple matching input_names.
    # Use generic valid IDs; never inherit DJX-specific token IDs.
    input_ids = torch.tensor([[0, min(1, vocabulary - 1)]], dtype=torch.int64)
    return (input_ids,)


def export_component(component, model_root, output):
    from olive.hardware import AcceleratorSpec
    from olive.model import PyTorchModelHandler
    from olive.passes.onnx.conversion import OnnxConversion
    from olive.passes.onnx.float16_conversion import OnnxFloatToFloat16
    from olive.passes.onnx.graph_surgeries import GraphSurgeries

    work = output / ".build" / component
    work.mkdir(parents=True, exist_ok=True)
    onnx_dir = output / "onnx"
    onnx_dir.mkdir(exist_ok=True)
    target = onnx_dir / ("vision_encoder.onnx" if component == "vision" else "embed_tokens_fp16.onnx")
    if target.exists():
        raise FileExistsError(f"Refusing to overwrite an existing exported component: {target}")
    handler = PyTorchModelHandler(
        model_path=str(model_root), model_script=str(Path(__file__).resolve()),
        model_loader="get_vision_model" if component == "vision" else "get_embedding_model",
        io_config="get_vision_io_config" if component == "vision" else "get_embedding_io_config",
        dummy_inputs_func="get_vision_dummy_inputs" if component == "vision" else "get_embedding_dummy_inputs",
    )
    accelerator = AcceleratorSpec("cpu", "CPUExecutionProvider")
    def make_pass(kind, config):
        return kind(accelerator, kind.generate_config(accelerator, config, disable_search=True))

    # The embedding path deliberately uses Olive's legacy TorchScript
    # exporter, which supports opset <=20 in the pinned PyTorch 2.10 build.
    # Vision uses dynamo=True and keeps opset 21 for the Qwen3.5 graph.
    target_opset = 21 if component == "vision" else 20
    converter = make_pass(
        OnnxConversion,
        {"use_dynamo_exporter": component == "vision", "target_opset": target_opset},
    )
    handler = converter.run(handler, str(work / "float32.onnx"))
    if component == "vision":
        surgery = make_pass(
            GraphSurgeries,
            {"surgeries": [{"surgeon": "PackedAttentionToLoopMHA"}, {"surgeon": "ReciprocalMulToDiv"}]},
        )
        handler = surgery.run(handler, str(work / "attention.onnx"))
        import onnx

        graph = onnx.load(handler.model_path)
        onnx.save_model(graph, target, save_as_external_data=True, all_tensors_to_one_file=True,
                        location=target.name + "_data", size_threshold=1024)
        eliminate_identical_casts(target)
        print(json.dumps({"component": component, "model_path": str(target), "compute_dtype": "float32", "output_dtype": "float16"}), flush=True)
        return target
    converter = make_pass(
        OnnxFloatToFloat16,
        {
            "op_block_list": ["LayerNormalization", "Range"],
            "keep_io_types": False,
            "save_as_external_data": True,
            "external_data_name": target.name + "_data",
        },
    )
    handler = converter.run(handler, str(target))
    print(json.dumps({"component": component, "model_path": handler.model_path}), flush=True)
    return target


def eliminate_identical_casts(path):
    """Coalesce identical casts emitted for shared constants by float16 conversion."""
    import onnx
    import onnx_ir
    from onnx_ir.passes.common import TopologicalSortPass

    model = onnx.load(path, load_external_data=False)
    def visit(graph):
        definitions, kept = {}, []
        for node in graph.node:
            existing = [definitions[name] for name in node.output if name in definitions]
            if existing:
                if node.op_type != "Cast" or any(old.SerializeToString() != node.SerializeToString() for old in existing):
                    raise ValueError(f"Conflicting graph definitions: {node.name}")
                continue
            kept.append(node)
            for name in node.output:
                if name:
                    definitions[name] = node
            for attribute in node.attribute:
                if attribute.type == onnx.AttributeProto.GRAPH:
                    visit(attribute.g)
        del graph.node[:]
        graph.node.extend(kept)
    visit(model.graph)
    ir_model = onnx_ir.serde.deserialize_model(model)
    TopologicalSortPass()(ir_model)
    model = onnx_ir.serde.serialize_model(ir_model)
    if not any(item.domain == "com.microsoft" for item in model.opset_import):
        model.opset_import.append(onnx.helper.make_opsetid("com.microsoft", 1))
    onnx.save(model, path)
    onnx.checker.check_model(str(path))


def inspect_decoder_graph(model_path, expected_linear_layers):
    """Validate decoder graph structure and external data without the wrong CPU EP.

    GatedDeltaNet is a target WebGPU operator. The generic Python CPU EP used
    by the export environment does not provide its kernel, so CPU Session
    creation is not a valid acceptance test for this browser-targeted graph.
    Actual operator execution is verified later in Chrome with ONNX Runtime WebGPU.
    """
    import onnx

    model_path = Path(model_path).resolve(strict=True)
    model = onnx.load(model_path, load_external_data=False)
    graph = model.graph
    if not graph.input or not graph.output:
        raise ValueError("Decoder graph must declare at least one input and output")

    op_counts = {}
    external_files = set()
    external_tensor_count = 0
    model_root = model_path.parent.resolve()

    def visit(part):
        nonlocal external_tensor_count
        for node in part.node:
            op_counts[node.op_type] = op_counts.get(node.op_type, 0) + 1
            for attribute in node.attribute:
                if attribute.type == onnx.AttributeProto.GRAPH:
                    visit(attribute.g)
                elif attribute.type == onnx.AttributeProto.GRAPHS:
                    for child in attribute.graphs:
                        visit(child)
        for tensor in part.initializer:
            entries = {item.key: item.value for item in tensor.external_data}
            if tensor.data_location == onnx.TensorProto.EXTERNAL or entries:
                location = entries.get("location")
                if not location:
                    raise ValueError(f"External tensor has no location: {tensor.name}")
                external_path = (model_root / location).resolve()
                if not external_path.is_relative_to(model_root) or not external_path.is_file():
                    raise ValueError(f"Decoder external data is missing or escapes bundle: {location}")
                try:
                    offset = int(entries.get("offset", "0"))
                    length = int(entries["length"])
                except (KeyError, TypeError, ValueError) as error:
                    raise ValueError(f"Invalid external-data range for tensor {tensor.name}") from error
                if offset < 0 or length <= 0 or offset + length > external_path.stat().st_size:
                    raise ValueError(f"Decoder external-data range is out of bounds: {tensor.name}")
                external_files.add(external_path)
                external_tensor_count += 1

    visit(graph)

    gated_delta_count = op_counts.get("GatedDeltaNet", 0)
    causal_conv_count = op_counts.get("CausalConvWithState", 0)
    if gated_delta_count != expected_linear_layers:
        raise ValueError(
            "Decoder GatedDeltaNet count does not match source linear-attention layers: "
            f"expected={expected_linear_layers}, actual={gated_delta_count}"
        )
    if causal_conv_count != expected_linear_layers:
        raise ValueError(
            "Decoder CausalConvWithState count does not match source linear-attention layers: "
            f"expected={expected_linear_layers}, actual={causal_conv_count}"
        )
    if op_counts.get("SimplifiedLayerNormalization", 0) == 0:
        raise ValueError("Decoder is missing SimplifiedLayerNormalization")
    if op_counts.get("GroupQueryAttention", 0) == 0:
        raise ValueError("Decoder is missing GroupQueryAttention")
    if not external_tensor_count or len(external_files) != 1:
        raise ValueError(
            "Decoder must reference exactly one external-data file; "
            f"tensors={external_tensor_count}, files={len(external_files)}"
        )

    microsoft_opset = next(
        (item.version for item in model.opset_import if item.domain == "com.microsoft"),
        None,
    )
    if microsoft_opset is None:
        raise ValueError("Decoder is missing the com.microsoft custom-operator opset import")

    return {
        "graph_inputs": [value.name for value in graph.input],
        "graph_outputs": [value.name for value in graph.output],
        "operator_counts": op_counts,
        "expected_linear_attention_layers": expected_linear_layers,
        "gated_delta_net_nodes": gated_delta_count,
        "causal_conv_with_state_nodes": causal_conv_count,
        "simplified_layer_normalization_nodes": op_counts["SimplifiedLayerNormalization"],
        "external_data_file": str(next(iter(external_files))),
        "external_tensor_count": external_tensor_count,
        "com_microsoft_opset": microsoft_opset,
        "structural_validation": "passed",
        "execution_validation": "deferred_to_chrome_webgpu",
    }


def package_decoder(model_root, output, exported):
    """Use Transformers.js cache names; preserve every operation and tensor."""
    import onnx

    _, config = local_config(model_root)
    graph = onnx.load(exported / "decoder_model_merged.onnx", load_external_data=False)
    mapping = {}
    for layer, kind in enumerate(config.text_config.layer_types):
        if kind == "linear_attention":
            for prefix in ("past", "present"):
                for state in ("conv", "recurrent"):
                    mapping[f"{prefix}.{layer}.{state}"] = f"{prefix}_{state}.{layer}"

    def rename(part):
        for value in (*part.input, *part.output, *part.value_info):
            value.name = mapping.get(value.name, value.name)
            for dim in value.type.tensor_type.shape.dim:
                if dim.dim_param == "kv_cache_dim":
                    dim.dim_value = config.text_config.head_dim
        for node in part.node:
            for names in (node.input, node.output):
                for i, name in enumerate(names):
                    names[i] = mapping.get(name, name)
            for attribute in node.attribute:
                if attribute.type == onnx.AttributeProto.GRAPH:
                    rename(attribute.g)

    rename(graph.graph)
    output.joinpath("onnx").mkdir(exist_ok=True)
    target = output / "onnx" / "decoder_model_merged_fp16.onnx"
    if target.exists():
        raise FileExistsError(target)
    data_sources = set()
    for tensor in graph.graph.initializer:
        for item in tensor.external_data:
            if item.key == "location":
                source = (exported / item.value).resolve(strict=True)
                if not source.is_relative_to(exported.resolve()):
                    raise ValueError("Decoder external data escapes its export directory")
                data_sources.add(source)
                item.value = target.name + "_data"
    if len(data_sources) != 1:
        raise ValueError("Expected one decoder external data file")
    shutil.copyfile(next(iter(data_sources)), Path(str(target) + "_data"))
    onnx.save(graph, target)

    # The graph is explicitly exported for WebGPU. The Python CPU EP has no
    # GatedDeltaNet kernel, so a CPU InferenceSession is not a valid test here.
    # Preserve all operators and validate graph structure, custom-op counts,
    # and every external-data range. Actual execution is gated on Chrome WebGPU.
    expected_linear_layers = sum(
        kind == "linear_attention" for kind in config.text_config.layer_types
    )
    validation = inspect_decoder_graph(target, expected_linear_layers)
    print(json.dumps({
        "component": "decoder",
        "model_path": str(target),
        "cache_io_renames": len(mapping),
        **validation,
    }), flush=True)


def export_decoder(model_root, output):
    exported = output / ".build" / "decoder-pruned-fp16"
    subprocess.run([
        sys.executable, "-m", "onnxruntime_genai.models.builder",
        "-i", str(model_root), "-o", str(exported), "-p", "fp16", "-e", "webgpu",
        "--extra_options", "filename=decoder_model_merged.onnx", "exclude_embeds=true", "prune_lm_head=true",
    ], check=True)
    package_decoder(model_root, output, exported)


def browser_preprocessor_config(source):
    """Preserve the official Qwen image-processor schema with browser-safe limits."""
    if not isinstance(source, dict) or not isinstance(source.get("size"), dict):
        raise ValueError("Official OvisOCR3 preprocessor_config.json has no size object")
    size = source["size"]
    if not {"shortest_edge", "longest_edge"}.issubset(size):
        raise ValueError("Official OvisOCR3 preprocessor size keys are incomplete")
    result = dict(source)
    result["size"] = {
        **size,
        "shortest_edge": 448 * 448,
        "longest_edge": 1440 * 1440,
    }
    return result


def write_browser_assets(root, output, source_revision):
    # Keep the original model configuration as JSON. Do not treat the decoded
    # dictionary as a Transformers config object.
    model_config = json.loads(root.joinpath("config.json").read_text())
    model_config["transformers.js_config"] = {
        "use_external_data_format": True,
        "kv_cache_dtype": {"fp16": "float16"},
    }
    output.joinpath("config.json").write_text(json.dumps(model_config, indent=2) + "\n")

    source_preprocessor_path = root / "preprocessor_config.json"
    if not source_preprocessor_path.is_file():
        raise FileNotFoundError("Official OvisOCR3 preprocessor_config.json is missing")
    source_preprocessor = json.loads(source_preprocessor_path.read_text())
    preprocessor = browser_preprocessor_config(source_preprocessor)
    output.joinpath("preprocessor_config.json").write_text(json.dumps(preprocessor, indent=2) + "\n")
    assets = (
        "generation_config.json", "tokenizer.json", "tokenizer_config.json",
        "chat_template.jinja", "merges.txt", "vocab.json",
        "video_preprocessor_config.json",
    )
    for name in assets:
        source, destination = root / name, output / name
        if not source.is_file():
            continue
        if destination.exists() and source.read_bytes() != destination.read_bytes():
            raise ValueError(f"Refusing to replace a different model asset: {destination}")
        if not destination.exists():
            shutil.copy2(source, destination)

    source_prompts = root / "prompts"
    prompt = source_prompts / "document_structured.txt"
    if not prompt.is_file():
        raise FileNotFoundError("Official OvisOCR3 Structured prompt is missing")
    shutil.copytree(source_prompts, output / "prompts", dirs_exist_ok=True)
    license_source = root / "LICENSE"
    if license_source.is_file():
        shutil.copy2(license_source, output / "LICENSE")

    weights = root / "model.safetensors"
    if not weights.is_file():
        raise FileNotFoundError("Expected the official single-file model.safetensors checkpoint")
    generation = json.loads((root / "generation_config.json").read_text())
    metadata = {
        "format_version": 1,
        "source_model_id": OFFICIAL_SOURCE_MODEL_ID,
        "source_revision": source_revision,
        "source_weights_sha256": file_sha256(weights),
        "model_type": model_config["model_type"],
        "vocab_size": model_config["text_config"]["vocab_size"],
        "eos_token_id": generation.get("eos_token_id"),
        "prompt_sha256": file_sha256(prompt),
        "source_preprocessor_sha256": file_sha256(source_preprocessor_path),
        "browser_min_pixels": 448 * 448,
        "browser_max_pixels": 1440 * 1440,
        "license": "Apache-2.0",
        "olive_recipe_commit": OLIVE_RECIPE_COMMIT,
        "olive_vision_source_sha256": OLIVE_VISION_SOURCE_SHA256,
    }
    output.joinpath("source-model.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n"
    )


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--recipe-dir", required=True, type=Path)
    parser.add_argument("--source-revision", default=OFFICIAL_SOURCE_REVISION)
    parser.add_argument("--vision-source-sha256", default=OLIVE_VISION_SOURCE_SHA256)
    parser.add_argument("--components", nargs="+", choices=["embedding", "vision", "decoder"], default=["embedding", "vision", "decoder"])
    parser.add_argument("--threads", type=int, default=4)
    args = parser.parse_args(argv)
    if args.threads < 1:
        parser.error("--threads must be positive")
    if args.source_revision != OFFICIAL_SOURCE_REVISION:
        parser.error("source revision must match the pinned official OvisOCR3 commit")
    if args.vision_source_sha256 != OLIVE_VISION_SOURCE_SHA256:
        parser.error("vision source SHA-256 must match the pinned Olive recipe source")
    os.environ["CUDA_VISIBLE_DEVICES"] = ""
    os.environ["OMP_NUM_THREADS"] = str(args.threads)
    os.environ["MKL_NUM_THREADS"] = str(args.threads)
    os.environ["HF_HUB_OFFLINE"] = "1"
    os.environ["TRANSFORMERS_OFFLINE"] = "1"
    os.environ["OVIS_ONNX_RECIPE_DIR"] = str(args.recipe_dir.resolve(strict=True))
    os.environ["OVIS_ONNX_VISION_SOURCE_SHA256"] = args.vision_source_sha256
    if hasattr(os, "sched_getaffinity"):
        cpus = sorted(os.sched_getaffinity(0))
        os.sched_setaffinity(0, cpus[:args.threads])
    import torch

    torch.set_num_threads(args.threads)
    root, config = local_config(args.model)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for component in dict.fromkeys(args.components):
        if component == "decoder":
            export_decoder(root, args.output_dir)
        else:
            export_component(component, root, args.output_dir)
    write_browser_assets(root, args.output_dir, args.source_revision)
    print(json.dumps({"completed_components": args.components, "vocab_size": config.text_config.vocab_size, "source_model": OFFICIAL_SOURCE_MODEL_ID, "source_revision": args.source_revision, "olive_recipe_commit": OLIVE_RECIPE_COMMIT}), flush=True)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Static checks for the exporter IO names; no ML dependencies are imported."""
import ast
from pathlib import Path

SOURCE = Path(__file__).with_name("export_onnx.py")
SOURCE_TEXT = SOURCE.read_text(encoding="utf-8")
TREE = ast.parse(SOURCE_TEXT, filename=str(SOURCE))

from export_onnx import browser_preprocessor_config


def function(name):
    return next(node for node in TREE.body if isinstance(node, ast.FunctionDef) and node.name == name)


def return_dict_keys(name):
    node = function(name)
    returned = next(
        item.value for item in ast.walk(node)
        if isinstance(item, ast.Return) and isinstance(item.value, ast.Dict)
    )
    return {key.value for key in returned.keys if isinstance(key, ast.Constant)}


def input_names(name):
    node = function(name)
    returned = next(
        item.value for item in ast.walk(node)
        if isinstance(item, ast.Return) and isinstance(item.value, ast.Dict)
    )
    entry = next(
        value for key, value in zip(returned.keys, returned.values)
        if isinstance(key, ast.Constant) and key.value == "input_names"
    )
    return set(ast.literal_eval(entry))


# Vision uses named dictionary inputs with the dynamo exporter.
expected_vision = input_names("get_vision_io_config")
actual_vision = return_dict_keys("get_vision_dummy_inputs")
if expected_vision != actual_vision:
    raise SystemExit(
        "vision exporter dummy inputs mismatch: "
        f"io_config={sorted(expected_vision)} dummy_inputs={sorted(actual_vision)}"
    )

# Embedding uses the legacy TorchScript exporter: dummy inputs must be
# positional args, not a dict that can be misinterpreted as kwargs.
embedding_input_names = input_names("get_embedding_io_config")
embedding_dummy = function("get_embedding_dummy_inputs")
embedding_return = next(
    item.value for item in ast.walk(embedding_dummy)
    if isinstance(item, ast.Return)
)
if not isinstance(embedding_return, ast.Tuple):
    raise SystemExit("embedding dummy inputs must be a positional tuple")
if len(embedding_return.elts) != len(embedding_input_names):
    raise SystemExit(
        "embedding positional dummy-input count does not match ONNX input_names"
    )

# The official OvisOCR3 repository ships preprocessor_config.json with a
# top-level size object. Keep its normalization fields and only lower the
# image resolution ceiling for browser memory.
official_preprocessor = {
    "size": {"shortest_edge": 65536, "longest_edge": 16777216},
    "patch_size": 16,
    "image_mean": [0.5, 0.5, 0.5],
    "image_std": [0.5, 0.5, 0.5],
    "processor_class": "Qwen3VLProcessor",
}
browser_preprocessor = browser_preprocessor_config(official_preprocessor)
if browser_preprocessor["size"] != {
    "shortest_edge": 448 * 448,
    "longest_edge": 1440 * 1440,
}:
    raise SystemExit("Browser preprocessor resolution limits are incorrect")
if browser_preprocessor["patch_size"] != official_preprocessor["patch_size"]:
    raise SystemExit("Browser preprocessor changed the official patch size")
if browser_preprocessor["image_mean"] != official_preprocessor["image_mean"]:
    raise SystemExit("Browser preprocessor changed official image normalization")
if official_preprocessor["size"]["longest_edge"] != 16777216:
    raise SystemExit("Browser preprocessor mutated the original source config")

browser_assets_source = ast.get_source_segment(SOURCE_TEXT, function("write_browser_assets"))
if '"processor_config.json"' in browser_assets_source:
    raise SystemExit("Exporter must not require a non-existent official processor_config.json")
if '"preprocessor_config.json"' not in browser_assets_source:
    raise SystemExit("Exporter must consume the official preprocessor_config.json")
if 'model_config["model_type"]' not in browser_assets_source:
    raise SystemExit("Exporter must read model_type from the decoded config dictionary")
if 'model_config["text_config"]["vocab_size"]' not in browser_assets_source:
    raise SystemExit("Exporter must read vocab_size from the decoded config dictionary")

vision_source = ast.get_source_segment(SOURCE_TEXT, function("get_vision_model"))
if "isinstance(output, torch.Tensor)" not in vision_source:
    raise SystemExit("Exporter must accept the pinned Olive vision model's tensor output")

# Olive 0.13.0 invokes dummy_inputs_func with PyTorchModelHandler,
# not the underlying torch.nn.Embedding module.
embedding_dummy_source = ast.get_source_segment(
    SOURCE_TEXT, function("get_embedding_dummy_inputs")
)
if "model.load_model()" not in embedding_dummy_source:
    raise SystemExit(
        "Embedding dummy-input callback must resolve the nn.Embedding "
        "through Olive PyTorchModelHandler.load_model()"
    )
if "embedding.num_embeddings" not in embedding_dummy_source:
    raise SystemExit(
        "Embedding dummy-input callback must derive vocabulary size "
        "from the loaded nn.Embedding module"
    )

if "return (input_ids,)" not in embedding_dummy_source:
    raise SystemExit(
        "Embedding dummy-input callback must return one positional input tensor"
    )

export_component_source = ast.get_source_segment(SOURCE_TEXT, function("export_component"))
if 'target_opset = 21 if component == "vision" else 20' not in export_component_source:
    raise SystemExit(
        "Embedding must use opset 20 for the pinned legacy exporter; vision keeps opset 21"
    )

# ORT GenAI's decoder graph contains SimplifiedLayerNormalization. The
# standalone ONNX checker does not register this ORT runtime operator, so
# validate the packaged decoder with ONNX Runtime rather than rewriting it.
decoder_package_source = ast.get_source_segment(SOURCE_TEXT, function("package_decoder"))
if "onnx.checker.check_model" in decoder_package_source:
    raise SystemExit("Decoder packaging must not reject ORT runtime operators via onnx.checker")
if "ort.InferenceSession(" not in decoder_package_source:
    raise SystemExit("Decoder packaging must validate the graph through ONNX Runtime")
if "SimplifiedLayerNormalization" not in decoder_package_source:
    raise SystemExit("Decoder packaging must explicitly account for SimplifiedLayerNormalization")

validator_path = Path(__file__).with_name("validate_bundle.py")
validator_source = validator_path.read_text(encoding="utf-8")
validator_tree = ast.parse(validator_source, filename=str(validator_path))

decoder_validation_start = validator_source.index(
    'decoder_path = bundle / "onnx" / "decoder_model_merged_fp16.onnx"'
)
decoder_validation_end = validator_source.index(
    'head = next((tensor for tensor in decoder.graph.initializer',
    decoder_validation_start,
)
decoder_validation_source = validator_source[decoder_validation_start:decoder_validation_end]
if "onnx.checker.check_model" in decoder_validation_source:
    raise SystemExit("Bundle validation must not use standalone ONNX checker for the GenAI decoder")
if "ort.InferenceSession(" not in decoder_validation_source:
    raise SystemExit("Bundle validation must load the decoder with ONNX Runtime")
if "preprocessor_config_matches_source_except_resolution" not in validator_source:
    raise SystemExit("Bundle validator must verify the official preprocessor configuration")
validate_function = next(
    node for node in validator_tree.body
    if isinstance(node, ast.FunctionDef) and node.name == "validate"
)
required_assignment = next(
    node for node in ast.walk(validate_function)
    if isinstance(node, ast.Assign)
    and any(isinstance(target, ast.Name) and target.id == "required" for target in node.targets)
)
required_artifacts = ast.literal_eval(required_assignment.value)
if "preprocessor_config.json" not in required_artifacts:
    raise SystemExit("Bundle validator must require the official preprocessor_config.json")
if "processor_config.json" in required_artifacts:
    raise SystemExit("Bundle validator must not require non-existent processor_config.json")

print("OvisOCR3 exporter IO, processor-schema, vision-output and bundle-asset contract checks passed")

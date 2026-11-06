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


for component in ("embedding", "vision"):
    expected = input_names(f"get_{component}_io_config")
    actual = return_dict_keys(f"get_{component}_dummy_inputs")
    if expected != actual:
        raise SystemExit(
            f"{component} exporter dummy inputs mismatch: "
            f"io_config={sorted(expected)} dummy_inputs={sorted(actual)}"
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

validator_path = Path(__file__).with_name("validate_bundle.py")
validator_source = validator_path.read_text(encoding="utf-8")
if "preprocessor_config_matches_source_except_resolution" not in validator_source:
    raise SystemExit("Bundle validator must verify the official preprocessor configuration")

print("OvisOCR3 exporter IO, processor-schema and vision-output contract checks passed")

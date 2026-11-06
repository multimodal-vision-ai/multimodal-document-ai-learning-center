#!/usr/bin/env python3
"""Static checks for the exporter IO names; no ML dependencies are imported."""
import ast
from pathlib import Path

SOURCE = Path(__file__).with_name("export_onnx.py")
TREE = ast.parse(SOURCE.read_text(encoding="utf-8"), filename=str(SOURCE))


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

print("OvisOCR3 exporter IO contract checks passed")

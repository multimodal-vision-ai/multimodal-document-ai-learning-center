#!/usr/bin/env python3
"""Repack ONNX external tensor data into browser-safe files."""
from pathlib import Path
import math

MAX_EXTERNAL_DATA_SHARD_BYTES = 1_500_000_000
COPY_BLOCK_BYTES = 8 * 1024 * 1024


def iter_tensors(graph, onnx):
    """Yield tensors in initializers, sparse initializers and nested attributes."""
    yield from graph.initializer
    for sparse in graph.sparse_initializer:
        yield sparse.values
        yield sparse.indices
    for node in graph.node:
        for attribute in node.attribute:
            if attribute.type == onnx.AttributeProto.TENSOR:
                yield attribute.t
            elif attribute.type == onnx.AttributeProto.TENSORS:
                yield from attribute.tensors
            elif attribute.type == onnx.AttributeProto.GRAPH:
                yield from iter_tensors(attribute.g, onnx)
            elif attribute.type == onnx.AttributeProto.GRAPHS:
                for nested in attribute.graphs:
                    yield from iter_tensors(nested, onnx)


def external_data_locations(graph, onnx):
    locations = set()
    for tensor in iter_tensors(graph, onnx):
        metadata = {item.key: item.value for item in tensor.external_data}
        if metadata.get("location"):
            locations.add(metadata["location"])
    return sorted(locations)




def iter_nodes(graph, onnx):
    """Yield nodes in the graph and any nested subgraphs."""
    for node in graph.node:
        yield node
        for attribute in node.attribute:
            if attribute.type == onnx.AttributeProto.GRAPH:
                yield from iter_nodes(attribute.g, onnx)
            elif attribute.type == onnx.AttributeProto.GRAPHS:
                for nested in attribute.graphs:
                    yield from iter_nodes(nested, onnx)


def validate_external_data_files(graph, data_dir, onnx,
                                 max_shard_bytes=MAX_EXTERNAL_DATA_SHARD_BYTES):
    """Validate every external tensor reference, file boundary and browser shard size."""
    root = Path(data_dir).resolve(strict=True)
    used_locations = set()
    checked_tensors = 0

    for tensor in iter_tensors(graph, onnx):
        if not tensor.external_data:
            continue
        metadata = {item.key: item.value for item in tensor.external_data}
        location = metadata.get("location")
        if not location:
            raise ValueError(f"External tensor {tensor.name!r} has no location")
        path = (root / location).resolve(strict=True)
        if not path.is_relative_to(root):
            raise ValueError(f"External-data path escapes directory: {location}")
        file_size = path.stat().st_size
        if file_size > max_shard_bytes:
            raise ValueError(
                f"{location} is {file_size:,} bytes; browser shard limit is "
                f"{max_shard_bytes:,}"
            )
        offset = int(metadata.get("offset", "0"))
        if "length" in metadata:
            length = int(metadata["length"])
        else:
            dtype = onnx.helper.tensor_dtype_to_np_dtype(tensor.data_type)
            length = math.prod(tensor.dims) * dtype.itemsize
        if offset < 0 or length <= 0 or offset + length > file_size:
            raise ValueError(
                f"Invalid external range for {tensor.name!r}: "
                f"offset={offset}, length={length}, file={file_size}"
            )
        used_locations.add(location)
        checked_tensors += 1

    if checked_tensors == 0:
        raise ValueError("No ONNX external-data tensor references were found")
    return {
        "tensor_count": checked_tensors,
        "files": sorted(used_locations),
    }


def check_model_with_ort_compatibility(model_path, onnx):
    """Run ONNX structural checks while preserving ORT's default-domain contrib op.

    ONNX Runtime registers SimplifiedLayerNormalization in the ai.onnx domain,
    but the standard ONNX Python checker does not currently publish its schema.
    Only a checker-only in-memory copy is adjusted to a private custom domain;
    the model file and the graph passed to ONNX Runtime remain untouched.
    """
    model = onnx.load(str(model_path), load_external_data=False)
    validation_domain = "mvai.validation_only"
    runtime_ops = []

    default_opset = next(
        (item.version for item in model.opset_import
         if item.domain in ("", "ai.onnx")),
        None,
    )
    for node in iter_nodes(model.graph, onnx):
        if (
            node.op_type == "SimplifiedLayerNormalization"
            and node.domain in ("", "ai.onnx")
        ):
            runtime_ops.append({
                "name": node.name,
                "op_type": node.op_type,
                "original_domain": node.domain or "ai.onnx",
            })
            node.domain = validation_domain

    if runtime_ops:
        if default_opset is None:
            raise ValueError(
                "SimplifiedLayerNormalization is present but the ai.onnx opset import is missing"
            )
        if not any(item.domain == validation_domain for item in model.opset_import):
            model.opset_import.append(onnx.helper.make_opsetid(validation_domain, 1))

    # This still checks graph structure and every standard ONNX operator.
    # Only the known ORT operator is skipped in this temporary checker copy.
    onnx.checker.check_model(model, check_custom_domain=False)

    if runtime_ops:
        return {
            "status": "passed_with_ort_runtime_operator_schema_exception",
            "operator": "ai.onnx::SimplifiedLayerNormalization",
            "opset": default_opset,
            "nodes": len(runtime_ops),
            "model_file_modified": False,
            "note": "Only an in-memory checker copy used a private domain; the saved ONNX graph is unchanged.",
        }
    return {
        "status": "passed",
        "operator_exception": None,
        "model_file_modified": False,
    }


def shard_external_data(graph, source_dir, output_dir, model_filename,
                        max_shard_bytes=MAX_EXTERNAL_DATA_SHARD_BYTES):
    """Copy each external tensor byte-range to a shard and rewrite its location."""
    import onnx

    source_root = Path(source_dir).resolve(strict=True)
    output_root = Path(output_dir)
    output_root.mkdir(parents=True, exist_ok=True)
    if not isinstance(max_shard_bytes, int) or max_shard_bytes <= 0:
        raise ValueError("max_shard_bytes must be a positive integer")

    records = []
    for tensor in iter_tensors(graph, onnx):
        if not tensor.external_data:
            continue
        metadata = {item.key: item.value for item in tensor.external_data}
        location = metadata.get("location")
        if not location:
            raise ValueError(f"External tensor {tensor.name!r} has no location")
        source = (source_root / location).resolve(strict=True)
        if not source.is_relative_to(source_root):
            raise ValueError(f"External-data path escapes source directory: {location}")
        source_size = source.stat().st_size
        offset = int(metadata.get("offset", "0"))
        if "length" in metadata:
            length = int(metadata["length"])
        else:
            dtype = onnx.helper.tensor_dtype_to_np_dtype(tensor.data_type)
            length = math.prod(tensor.dims) * dtype.itemsize
        if offset < 0 or length <= 0 or offset + length > source_size:
            raise ValueError(
                f"Invalid external range for {tensor.name!r}: "
                f"offset={offset}, length={length}, file={source_size}"
            )
        if length > max_shard_bytes:
            raise ValueError(
                f"Tensor {tensor.name!r} is {length:,} bytes, larger than the "
                f"{max_shard_bytes:,}-byte shard limit; split this tensor at graph level."
            )
        records.append((str(source), offset, tensor, source, length))

    if not records:
        raise ValueError("No ONNX external-data tensors were found")

    records.sort(key=lambda item: (item[0], item[1], item[2].name))
    shard_paths = []
    shard_index = -1
    shard_size = 0
    shard_path = None
    base_name = model_filename + "_data"

    try:
        for _, source_offset, tensor, source, length in records:
            if shard_path is None or shard_size + length > max_shard_bytes:
                shard_index += 1
                shard_name = base_name if shard_index == 0 else f"{base_name}_{shard_index}"
                shard_path = output_root / shard_name
                if shard_path.exists():
                    shard_path.unlink()
                shard_paths.append(shard_path)
                shard_size = 0

            new_offset = shard_size
            remaining = length
            with source.open("rb") as reader, shard_path.open("ab") as writer:
                reader.seek(source_offset)
                while remaining:
                    block = reader.read(min(COPY_BLOCK_BYTES, remaining))
                    if not block:
                        raise IOError(
                            f"Unexpected end of external data while copying {tensor.name!r}"
                        )
                    writer.write(block)
                    remaining -= len(block)

            tensor.ClearField("external_data")
            tensor.data_location = onnx.TensorProto.EXTERNAL
            for key, value in (
                ("location", shard_path.name),
                ("offset", str(new_offset)),
                ("length", str(length)),
            ):
                entry = tensor.external_data.add()
                entry.key, entry.value = key, value
            shard_size += length

        for path in shard_paths:
            if path.stat().st_size > max_shard_bytes:
                raise AssertionError(f"Shard exceeds configured limit: {path}")
        return shard_paths
    except Exception:
        for path in shard_paths:
            try:
                path.unlink(missing_ok=True)
            except OSError:
                pass
        raise

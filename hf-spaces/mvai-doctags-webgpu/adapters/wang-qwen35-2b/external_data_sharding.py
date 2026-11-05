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

#!/usr/bin/env python3
"""Synthetic regression test for browser-safe ONNX external-data sharding."""
import tempfile
from pathlib import Path

import numpy as np
import onnx
from onnx import TensorProto, helper, numpy_helper

from external_data_sharding import (
    external_data_locations,
    iter_tensors,
    shard_external_data,
)


def main():
    with tempfile.TemporaryDirectory(prefix="mvai-onnx-shards-") as temp:
        root = Path(temp)
        source_dir = root / "source"
        output_dir = root / "output"
        source_dir.mkdir()
        tensors = [
            numpy_helper.from_array(
                np.arange(8, dtype=np.float32) + index * 8,
                name=f"weight_{index}",
            )
            for index in range(5)
        ]
        graph = helper.make_graph(
            [helper.make_node("Identity", ["weight_0"], ["output"])],
            "external_data_shard_test",
            [],
            [helper.make_tensor_value_info("output", TensorProto.FLOAT, [8])],
            tensors,
        )
        model = helper.make_model(graph, opset_imports=[helper.make_opsetid("", 13)])
        source_model = source_dir / "source.onnx"
        onnx.save_model(
            model, str(source_model), save_as_external_data=True,
            all_tensors_to_one_file=True, location="source.onnx_data",
            size_threshold=0,
        )

        original = onnx.load(str(source_model), load_external_data=False)
        original_refs = {}
        for tensor in iter_tensors(original.graph, onnx):
            meta = {item.key: item.value for item in tensor.external_data}
            original_refs[tensor.name] = (
                source_dir / meta["location"],
                int(meta.get("offset", "0")),
                int(meta["length"]),
            )

        shards = shard_external_data(
            original.graph, source_dir, output_dir, "target.onnx",
            max_shard_bytes=64,
        )
        target_model = output_dir / "target.onnx"
        onnx.save_model(original, str(target_model))
        onnx.checker.check_model(str(target_model))

        assert len(shards) == 3, f"expected 3 shards, got {len(shards)}"
        assert max(path.stat().st_size for path in shards) <= 64
        repacked = onnx.load(str(target_model), load_external_data=False)
        assert external_data_locations(repacked.graph, onnx) == [path.name for path in shards]

        for tensor in iter_tensors(repacked.graph, onnx):
            meta = {item.key: item.value for item in tensor.external_data}
            old_path, old_offset, old_length = original_refs[tensor.name]
            new_path = output_dir / meta["location"]
            new_offset = int(meta["offset"])
            new_length = int(meta["length"])
            assert old_length == new_length
            with old_path.open("rb") as old_stream, new_path.open("rb") as new_stream:
                old_stream.seek(old_offset)
                new_stream.seek(new_offset)
                assert old_stream.read(old_length) == new_stream.read(new_length)

    print("ONNX external-data sharding tests: tensor bytes, references, 3 shards and size limits PASS")


if __name__ == "__main__":
    main()

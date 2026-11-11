# Browser model export source

`export.py` is the self-contained script used to export the frozen browser models. It performs inference and conversion. The original run used a Kaggle GPU session with the environment recorded in `export_environment.json`.

| Component | Corresponding source |
|---|---|
| X3D-S architecture | [PyTorchVideo revision 2ac6ed361309cb25144636ad82dd8bd6a4970e0c](https://github.com/facebookresearch/pytorchvideo/tree/2ac6ed361309cb25144636ad82dd8bd6a4970e0c) |
| X3D-S checkpoint | [Official Kinetics-400 checkpoint](https://dl.fbaipublicfiles.com/pytorchvideo/model_zoo/kinetics/X3D_S.pyth) |
| YOLO26 export code | [Ultralytics v8.4.202](https://github.com/ultralytics/ultralytics/tree/v8.4.202) |
| YOLO26s checkpoint | [Official v8.4.0 checkpoint](https://github.com/ultralytics/assets/releases/download/v8.4.0/yolo26s.pt) |

The X3D export uses input `[1,3,13,182,182]`, ONNX opset 17 and source logits. Its recorded maximum absolute difference from PyTorch was 0.0000154972. The YOLO export uses a static 960×960 input, opset 17 and `simplify=False`.

The source and checkpoint digests are in `export_provenance.json`. Historical “not separately verified” fields in the original export script and provenance file record the earlier audit status. The current distribution conditions and third-party notices are in [THIRD_PARTY_NOTICES.txt](../THIRD_PARTY_NOTICES.txt).

The complete corresponding browser application source is the directory above this file. The runnable release archive includes that source, this export recipe and its model/video assets together.

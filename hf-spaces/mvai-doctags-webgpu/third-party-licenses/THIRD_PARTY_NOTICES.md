# Third-party notices for native OCR browser adapters

The new OCR adapters load these pinned third-party components. Their license texts are retained in this directory.

| Component | Pinned source | License | Use |
|---|---|---|---|
| PaddleOCR-VL-1.6 WebGPU runtime | https://github.com/glebkudr/paddleocr-vl-webgpu/tree/f7d2f8aa40639497e1dbd95f2f8793e664b90758 | Apache-2.0 | Rust/WASM WebGPU inference runtime |
| PaddleOCR-VL-1.6 WebGPU model pack | https://huggingface.co/glebkudr/PaddleOCR-VL-1.6-WebGPU/tree/5219606297d00bbd23b2ec193271af0c0b427dfc | Apache-2.0 | FP16 browser model artifacts derived from the official Paddle checkpoint |
| PaddleOCR-VL-1.6 source model | https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6 | Apache-2.0 | Upstream 0.9B model |
| PP-DocLayoutV3 browser SDK | https://github.com/chenmohan123/web-sdk-PP-DocLayoutV3/tree/3aedb7b35af49a1c207fd4f846211366a9d09973 | Apache-2.0 | Browser layout detection SDK |
| PP-DocLayoutV3 FP16 model | https://huggingface.co/PaddlePaddle/PP-DocLayoutV3_safetensors | Apache-2.0 | Layout detection weights |
| OvisOCR3 source model | https://huggingface.co/ATH-MaaS/OvisOCR3/tree/17f255e2c8ae6d18d5d5edb0a474bd4ed39aef90 | Apache-2.0 | Upstream 0.8B model |

The PaddleOCR-VL browser engine and PP-DocLayoutV3 SDK are loaded from immutable CDN versions/commits. They are not copied into the application bundle at this stage. Their respective license files are retained here for attribution and compliance review. The Paddle model pack and Ovis source model retain their upstream Apache-2.0 licenses; their original LICENSE files are included in their Hugging Face model repositories and must accompany any redistributed model files.

The MVAI adapter and integration code are project code. No PaddlePaddle or upstream project endorsement is implied.

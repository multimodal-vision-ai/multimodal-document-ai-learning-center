"""DocumentModelAdapter 抽象与 SmolDocling 实现。

设计目标（docs/notebook-design.md §8.4）：Benchmark 框架与模型解耦。
- Notebook / scripts 只依赖 DocumentModelAdapter 接口；
- 未来可增加 QwenVLAdapter、PaddleOCRVLAdapter，评测框架不变。

SmolDocling 官方接口（模型卡，revision ce51f56c…，2025-09-17）：
- AutoProcessor + AutoModelForVision2Seq
- bf16；CUDA 时优先 flash_attention_2，失败自动回退 eager
- max_new_tokens=8192
- DocTags → DoclingDocument 转换在 doctags_to_docling() 中做了新旧 API 双路径兼容
  （风险 R2），并记录实际生效的 API 路径。
"""

from __future__ import annotations

import json
import time
import warnings
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

OFFICIAL_MODEL_ID = "docling-project/SmolDocling-256M-preview"
OFFICIAL_MODEL_REVISION = "ce51f56c4ebe36e0b1c3a55f67b261ba22a50bf8"
DEFAULT_PROMPT = "Convert this page to docling."


class DocumentModelAdapter(ABC):
    """模型适配器统一接口。"""

    def __init__(
        self,
        model_id: str = OFFICIAL_MODEL_ID,
        revision: Optional[str] = OFFICIAL_MODEL_REVISION,
    ) -> None:
        self.model_id = model_id
        self.revision = revision

    @abstractmethod
    def load(self, device: str = "auto", **kwargs: Any) -> "DocumentModelAdapter":
        """加载模型与 processor，返回 self 以便链式调用。"""

    @abstractmethod
    def predict(
        self,
        image: Any,
        prompt: str = DEFAULT_PROMPT,
        **generation_kwargs: Any,
    ) -> Dict[str, Any]:
        """对单页图像生成结构化输出。

        返回字段：doctags / prompt / latency_sec / generation_config /
        model_id / model_revision / device。
        """

    def save_prediction(self, prediction: Dict[str, Any], out_path: Path) -> None:
        out_path = Path(out_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(prediction, f, ensure_ascii=False, indent=2)


class SmolDoclingAdapter(DocumentModelAdapter):
    """SmolDocling-256M-preview 适配器（transformers 路径）。"""

    def __init__(
        self,
        model_id: str = OFFICIAL_MODEL_ID,
        revision: Optional[str] = OFFICIAL_MODEL_REVISION,
    ) -> None:
        super().__init__(model_id=model_id, revision=revision)
        self.model: Any = None
        self.processor: Any = None
        self.device: str = "cpu"
        self.dtype_name: str = "float32"
        self.model_class: str = ""
        self.attn_implementation: str = ""
        self.device_fallback_reason: str = ""

    def load(
        self,
        device: str = "auto",
        dtype: str = "auto",
        attention: str = "auto",
        **kwargs: Any,
    ) -> "SmolDoclingAdapter":
        """加载模型。

        dtype=auto：CUDA 支持 bf16 → bf16；CUDA → fp16；CPU → fp32。
        attention=auto：CUDA 优先 flash_attention_2，失败回退 eager。
        """
        import torch
        from transformers import AutoProcessor

        if device == "auto":
            device = "cuda" if torch.cuda.is_available() else "cpu"
        self.device = device

        self.processor = AutoProcessor.from_pretrained(
            self.model_id, revision=self.revision
        )

        if dtype == "auto":
            if device == "cuda":
                dtype = "bfloat16" if torch.cuda.is_bf16_supported() else "float16"
            else:
                dtype = "float32"
        self.dtype_name = dtype
        torch_dtype = getattr(torch, dtype)

        attn = attention
        if attn == "auto":
            attn = "flash_attention_2" if device == "cuda" else "eager"

        def _load(model_cls: Any, torch_dtype: Any, attn_impl: str) -> Any:
            return model_cls.from_pretrained(
                self.model_id,
                revision=self.revision,
                torch_dtype=torch_dtype,
                _attn_implementation=attn_impl,
            )

        # 官方模型卡用 AutoModelForVision2Seq；新版 transformers 可能仅保留
        # AutoModelForImageTextToText（类名合并）。对「模型类 × 注意力实现」
        # 做全组合回退，并记录实际生效的组合（设计文档风险 R3）。
        model_classes: List[Tuple[str, Any]] = []
        try:
            from transformers import AutoModelForVision2Seq

            model_classes.append(("AutoModelForVision2Seq", AutoModelForVision2Seq))
        except ImportError:
            pass
        try:
            from transformers import AutoModelForImageTextToText

            model_classes.append(
                ("AutoModelForImageTextToText", AutoModelForImageTextToText)
            )
        except ImportError:
            pass
        if not model_classes:
            raise ImportError(
                "transformers 中找不到 AutoModelForVision2Seq / "
                "AutoModelForImageTextToText，请检查 transformers 版本。"
            )

        last_error: Optional[Exception] = None
        attn_candidates = [attn, "eager"] if attn != "eager" else ["eager"]
        for name, model_cls in model_classes:
            for attn_impl in attn_candidates:
                try:
                    self.model = _load(model_cls, torch_dtype, attn_impl)
                    self.model_class = name
                    self.attn_implementation = attn_impl
                    break
                except Exception as exc:  # noqa: BLE001
                    last_error = exc
                    warnings.warn(f"{name} + {attn_impl} 加载失败：{exc}")
            if self.model is not None:
                break
        if self.model is None:
            raise RuntimeError(
                "SmolDocling 加载失败（已尝试全部模型类/注意力组合）。"
                f"最后错误：{last_error}"
            )
        self.model.to(self.device).eval()
        # CUDA 可用性自检：部分 Kaggle GPU（如 P100/sm_60）与镜像自带的新版
        # torch 不兼容（no kernel image），任何 CUDA 算子都会报 AcceleratorError。
        # 检测到后自动回退 CPU 并记录原因（设计文档风险 R6/R3）。
        if self.device == "cuda":
            try:
                probe = torch.zeros((2, 2), device="cuda")
                (probe @ probe).sum().item()
            except Exception as exc:  # noqa: BLE001
                self.device_fallback_reason = (
                    f"CUDA kernel 不可用（{type(exc).__name__}: {exc}），"
                    "自动回退 CPU"
                )
                warnings.warn(self.device_fallback_reason)
                self.device = "cpu"
                self.dtype_name = "float32"
                # 顺序很重要：先把权重搬到 CPU（纯内存拷贝，不需要 CUDA kernel），
                # 再在 CPU 上转 float。若先在故障 GPU 上转 float 会再次触发
                # "no kernel image" 错误。
                self.model = self.model.to("cpu").float()
                probe_cpu = torch.zeros((2, 2))
                (probe_cpu @ probe_cpu).sum().item()  # CPU 自检
        return self

    def build_messages(self, prompt: str) -> List[Dict[str, Any]]:
        """官方模型卡的消息格式（image 占位 + 文本指令）。"""
        return [
            {
                "role": "user",
                "content": [
                    {"type": "image"},
                    {"type": "text", "text": prompt},
                ],
            }
        ]

    def predict(
        self,
        image: Any,
        prompt: str = DEFAULT_PROMPT,
        max_new_tokens: int = 8192,
        do_sample: bool = False,
        **generation_kwargs: Any,
    ) -> Dict[str, Any]:
        if self.model is None:
            raise RuntimeError("模型未加载：请先调用 adapter.load()")
        import torch

        messages = self.build_messages(prompt)
        prompt_text = self.processor.apply_chat_template(
            messages, add_generation_prompt=True
        )
        inputs = self.processor(
            text=prompt_text, images=[image], return_tensors="pt"
        ).to(self.device)

        t0 = time.perf_counter()
        with torch.inference_mode():
            generated_ids = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                do_sample=do_sample,
                **generation_kwargs,
            )
        latency = time.perf_counter() - t0

        prompt_length = inputs.input_ids.shape[1]
        doctags = self.processor.batch_decode(
            generated_ids[:, prompt_length:],
            skip_special_tokens=False,
        )[0].lstrip()

        return {
            "doctags": doctags,
            "prompt": prompt,
            "latency_sec": round(latency, 3),
            "generation_config": {
                "max_new_tokens": max_new_tokens,
                "do_sample": do_sample,
            },
            "model_id": self.model_id,
            "model_revision": self.revision,
            "device": self.device,
            "dtype": self.dtype_name,
        }


def doctags_to_docling(
    doctags: str, image: Any, document_name: str = "prediction"
) -> Tuple[Any, str]:
    """DocTags → DoclingDocument，兼容 docling-core 新旧 API（风险 R2）。

    依次尝试官方已知的 API 形态，返回 (docling_document, api_path)。
    api_path 会写入实验元数据，保证可追溯。
    """
    errors: List[str] = []

    def _try(label: str, fn: Any) -> Tuple[Any, str]:
        try:
            return fn(), label
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{label}: {exc}")
            return None, ""

    try:
        from docling_core.types.doc import DoclingDocument
    except ImportError as exc:
        raise ImportError(
            "缺少 docling-core。请在 Kaggle 上执行 "
            "`!pip install docling-core`（见 requirements-kaggle.txt）。"
        ) from exc

    # 路径 A：docling-core 2.x 新版（DocTagsDocument 已弃用）。
    if hasattr(DoclingDocument, "from_doctags_and_image_pairs"):
        for kwargs in (
            {"doctags_and_images": [(doctags, image)]},
            {"doctags": [doctags], "images": [image]},
            {"doctags": doctags, "images": [image]},
        ):
            doc, label = _try(
                f"A:{list(kwargs)}",
                lambda kwargs=kwargs: DoclingDocument.from_doctags_and_image_pairs(
                    **kwargs
                ),
            )
            if doc is not None:
                return doc, f"DoclingDocument.from_doctags_and_image_pairs({list(kwargs)})"

    # 路径 B：模型卡旧 API（DocTagsDocument + DoclingDocument.load_from_doctags）。
    try:
        from docling_core.types.doc.document import DocTagsDocument

        tags_doc, label = _try(
            "B:DocTagsDocument",
            lambda: DocTagsDocument.from_doctags_and_image_pairs([doctags], [image]),
        )
        if tags_doc is not None:
            doc, label2 = _try(
                "B:load_from_doctags",
                lambda: DoclingDocument.load_from_doctags(
                    tags_doc, document_name=document_name
                ),
            )
            if doc is not None:
                return doc, f"DocTagsDocument.from_doctags_and_image_pairs → DoclingDocument.load_from_doctags"
    except ImportError:
        pass

    raise RuntimeError(
        "无法将 DocTags 转换为 DoclingDocument。已尝试：\n- "
        + "\n- ".join(errors)
        + "\n请按当前 docling-core 版本的官方文档核对 API（设计文档风险 R2）。"
    )


def doctags_to_markdown(doctags: str, image: Any) -> Tuple[str, str]:
    """便捷封装：DocTags → Markdown 文本。返回 (markdown, api_path)。"""
    doc, api_path = doctags_to_docling(doctags, image)
    return doc.export_to_markdown(), api_path


def model_summary(adapter: SmolDoclingAdapter) -> Dict[str, Any]:
    """模型与设备摘要（打印到 Notebook / 写入元数据）。"""
    import torch

    info: Dict[str, Any] = {
        "model_id": adapter.model_id,
        "model_revision": adapter.revision,
        "device": adapter.device,
        "dtype": adapter.dtype_name,
        "model_class": getattr(adapter, "model_class", ""),
        "attn_implementation": getattr(adapter, "attn_implementation", ""),
        "device_fallback_reason": getattr(adapter, "device_fallback_reason", ""),
    }
    if adapter.model is not None:
        total = sum(p.numel() for p in adapter.model.parameters())
        info["total_parameters"] = total
    if adapter.device == "cuda":
        props = torch.cuda.get_device_properties(0)
        info["gpu"] = props.name
        info["vram_gb"] = round(props.total_memory / 1024**3, 1)
        info["memory_allocated_gb"] = round(torch.cuda.memory_allocated() / 1024**3, 2)
    return info

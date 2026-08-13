"""Phase 3：SFT / LoRA 训练基础设施（Kaggle 资源友好）。

设计原则（docs/notebook-design.md §8/§9）：
- 教学 SFT 只使用「OmniDocBench-derived teaching subset」（v1.5 页面），
  官方 1651 页 benchmark 只用于评测；
- 优先小 batch、gradient accumulation、max_steps 上限、可恢复 checkpoint；
- CPU 冒烟（2-4 样本、1-2 step）验证链路；真实训练建议 T4/L4 GPU。
"""

from __future__ import annotations

import json
import math
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

import torch
from torch.utils.data import DataLoader, Dataset


class SFTDataset(Dataset):
    """图像 + 指令 + 目标 DocTags 的 SFT 数据集。

    label mask：prompt 部分置 -100，只对 assistant 目标计算 loss。
    """

    def __init__(
        self,
        records: Sequence[Dict[str, str]],
        processor: Any,
    ) -> None:
        self.records = list(records)
        self.processor = processor

    def __len__(self) -> int:
        return len(self.records)

    def __getitem__(self, idx: int) -> Dict[str, torch.Tensor]:
        from PIL import Image

        rec = self.records[idx]
        with Image.open(rec["image_path"]) as img:
            image = img.convert("RGB")

        user_msg = {
            "role": "user",
            "content": [
                {"type": "image"},
                {"type": "text", "text": rec["instruction"]},
            ],
        }
        assistant_msg = {
            "role": "assistant",
            "content": [{"type": "text", "text": rec["target_doctags"]}],
        }
        full_text = self.processor.apply_chat_template(
            [user_msg, assistant_msg], add_generation_prompt=False
        )
        prompt_text = self.processor.apply_chat_template(
            [user_msg], add_generation_prompt=True
        )

        full = self.processor(
            text=full_text, images=[image], return_tensors="pt"
        )
        prompt_only = self.processor(
            text=prompt_text, images=[image], return_tensors="pt"
        )
        input_ids = full["input_ids"][0]
        labels = input_ids.clone()
        labels[: prompt_only["input_ids"].shape[1]] = -100

        return {
            "input_ids": input_ids,
            "attention_mask": full["attention_mask"][0],
            "pixel_values": full["pixel_values"][0],
            "pixel_attention_mask": full["pixel_attention_mask"][0],
            "labels": labels,
        }


def collate_fn(batch: Sequence[Dict[str, torch.Tensor]]) -> Dict[str, torch.Tensor]:
    pad_id = 0  # 由 processor/tokenizer 的 pad token 决定；SmolDocling 用 <|im_end|> 作 pad
    max_len = max(b["input_ids"].shape[0] for b in batch)
    input_ids, attention_masks, labels = [], [], []
    for b in batch:
        n = b["input_ids"].shape[0]
        input_ids.append(
            torch.cat([b["input_ids"], torch.full((max_len - n,), pad_id, dtype=torch.long)])
        )
        attention_masks.append(
            torch.cat([b["attention_mask"], torch.zeros(max_len - n, dtype=torch.long)])
        )
        labels.append(
            torch.cat([b["labels"], torch.full((max_len - n,), -100, dtype=torch.long)])
        )
    return {
        "input_ids": torch.stack(input_ids),
        "attention_mask": torch.stack(attention_masks),
        "labels": torch.stack(labels),
        "pixel_values": torch.stack([b["pixel_values"] for b in batch]),
        "pixel_attention_mask": torch.stack([b["pixel_attention_mask"] for b in batch]),
    }


def parameter_report(model: torch.nn.Module) -> Dict[str, Any]:
    total = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    return {
        "total_parameters": total,
        "trainable_parameters": trainable,
        "trainable_pct": round(100.0 * trainable / total, 4) if total else 0.0,
    }


def setup_lora(
    model: torch.nn.Module,
    r: int = 8,
    alpha: int = 16,
    dropout: float = 0.05,
    target_modules: Optional[Sequence[str]] = None,
) -> torch.nn.Module:
    """给模型加 LoRA adapter（peft），返回包装后的模型。"""
    from peft import LoraConfig, get_peft_model

    modules = list(target_modules) if target_modules else [
        "q_proj", "k_proj", "v_proj", "o_proj",
    ]
    config = LoraConfig(
        r=r,
        lora_alpha=alpha,
        lora_dropout=dropout,
        target_modules=modules,
        task_type="CAUSAL_LM",
    )
    return get_peft_model(model, config)


def train_sft(
    model: torch.nn.Module,
    train_dataset: Dataset,
    val_dataset: Optional[Dataset] = None,
    epochs: int = 1,
    lr: float = 1e-4,
    batch_size: int = 1,
    grad_accum: int = 1,
    max_steps: Optional[int] = None,
    device: str = "cpu",
    output_dir: Optional[Path] = None,
    log_every: int = 1,
) -> Dict[str, Any]:
    """最小 SFT 训练循环。返回 metrics 与 checkpoint 路径。

    显式记录：training loss / validation loss / GPU 内存（如可用）/
    lr / steps / wall time——满足任务文件 §十 的记录要求。
    """
    optimizer = torch.optim.AdamW(
        (p for p in model.parameters() if p.requires_grad), lr=lr
    )
    loader = DataLoader(
        train_dataset, batch_size=batch_size, shuffle=True, collate_fn=collate_fn
    )
    val_loader = (
        DataLoader(val_dataset, batch_size=batch_size, collate_fn=collate_fn)
        if val_dataset is not None
        else None
    )

    metrics: List[Dict[str, Any]] = []
    step = 0
    t0 = time.perf_counter()
    model.train()
    for epoch in range(epochs):
        accum = 0.0
        for i, batch in enumerate(loader):
            batch = {k: v.to(device) for k, v in batch.items()}
            outputs = model(**batch)
            loss = outputs.loss if hasattr(outputs, "loss") else outputs[0]
            (loss / grad_accum).backward()
            accum += float(loss.detach())
            if (i + 1) % grad_accum == 0:
                optimizer.step()
                optimizer.zero_grad()
                step += 1
                if step % log_every == 0:
                    metrics.append(
                        {
                            "epoch": epoch,
                            "step": step,
                            "train_loss": round(accum / grad_accum, 4),
                            "wall_sec": round(time.perf_counter() - t0, 1),
                        }
                    )
                    accum = 0.0
            if max_steps is not None and step >= max_steps:
                break
        if max_steps is not None and step >= max_steps:
            break

    if val_loader is not None:
        model.eval()
        total = 0.0
        n = 0
        with torch.inference_mode():
            for batch in val_loader:
                batch = {k: v.to(device) for k, v in batch.items()}
                outputs = model(**batch)
                loss = outputs.loss if hasattr(outputs, "loss") else outputs[0]
                total += float(loss)
                n += 1
        val_loss = round(total / n, 4) if n else None
    else:
        val_loss = None

    result: Dict[str, Any] = {
        "train_loss": metrics[-1]["train_loss"] if metrics else None,
        "val_loss": val_loss,
        "steps": step,
        "lr": lr,
        "wall_sec": round(time.perf_counter() - t0, 1),
        "device": device,
        "metrics": metrics,
    }
    if device == "cuda":
        result["gpu_memory_allocated_gb"] = round(
            torch.cuda.memory_allocated() / 1024**3, 2
        )

    if output_dir is not None:
        out = Path(output_dir)
        out.mkdir(parents=True, exist_ok=True)
        torch.save(model.state_dict(), out / "adapter.pt")
        (out / "training_summary.json").write_text(
            json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        result["checkpoint_dir"] = str(out)
    return result


# Document AI Research Track — Notebooks

基于 **Kaggle 免费 GPU + SmolDocling-256M + OmniDocBench** 的 Document AI 科研训练路径。
设计依据与全部版本锁定见 [docs/notebook-design.md](../docs/notebook-design.md)。

## 学习路线

```text
Run a Model
     ↓
Understand Data
     ↓
Design Prompt
     ↓
Build Baseline
     ↓
Fine-tune
     ↓
Benchmark
     ↓
Analyze Errors
     ↓
Ablation
     ↓
Hypothesis
     ↓
Research Question
```

| Stage | Notebook | 状态 | 核心问题 |
| --- | --- | --- | --- |
| 1 Use | [00 Environment](00_Environment_and_First_Run.ipynb) | ✅ Phase 2 | 如何跑通模型并留下环境证据？ |
| 1 Use | [01 OmniDocBench](01_Understanding_OmniDocBench.ipynb) | ✅ Phase 2 | Benchmark 数据到底长什么样？ |
| 2 Experiment | 02 Dataset Engineering | ✅ Phase 3（待 Kaggle 实测） | 数据怎么才能用来训练而不泄漏？ |
| 2 Experiment | 03 Prompt Engineering | ✅ Phase 3（待 Kaggle 实测） | Prompt 本身是不是实验变量？ |
| 2 Experiment | [04 Baseline](04_Baseline_Inference.ipynb) | ✅ Phase 2 | zero-shot 基线是什么水平？ |
| 3 Train | 05 SFT Fundamentals | ✅ Phase 3（待 Kaggle 实测） | Fine-tuning 到底改变了什么？ |
| 3 Train | 06 LoRA Fine-Tuning | ✅ Phase 3（待 Kaggle 实测） | LoRA 是资源-性能权衡，还是开关？ |
| 4 Evaluate | [07 Benchmark](07_Benchmark_and_Evaluation.ipynb) | ✅ Phase 2 | 官方指标如何运行、如何切片？ |
| 4 Evaluate | 08 Error Analysis | ✅ Phase 4（待 Kaggle 实测） | 模型到底不会什么？ |
| 5 Research | 09 Ablation Study | ✅ Phase 4（待 Kaggle 实测） | 哪个变量真正起作用？ |
| 5 Research | 10 Research Questions | ✅ Phase 4（待 Kaggle 实测） | 如何从实验走到论文问题？ |

## 在 Kaggle 上运行（推荐）

1. 新建 Kaggle Notebook，开启 **GPU** 与 **Internet**；
2. 克隆本仓库到工作目录：

   ```bash
   !git clone https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center.git
   %cd multimodal-document-ai-learning-center
   ```

3. 数据二选一（Notebook 01 也会提示）：
   - Kaggle 左侧 **Add Input** 添加官方 OmniDocBench 数据集（若有镜像）；
   - 或在 Notebook 01 里执行 `src.data.download_dataset()` 从 Hugging Face 下载（约 1–2 GB，**仅研究用途、不可商用**）。
4. 按顺序打开并运行 Notebook（每个 Notebook 内 `REPO_ROOT` 自动定位）。

## 目录与产物

```text
src/          # 可复用模块（数据/模型适配器/推理/评测/可视化）
configs/      # 全局配置（模式、版本锁定、评测模板）
prompts/      # Prompt v0-v3
scripts/      # 命令行入口 + Notebook 生成器
solutions/    # 教师参考答案（学生先独立完成 TODO）
results/      # 运行时产物（不入 Git，见 .gitignore）
```

## 三条红线

1. **不泄漏**：OmniDocBench 官方 1651 页只用于评测；教学训练子集只从 v1.5 页面抽取并标记
   `NOT for official benchmark claims`（官方没有 SFT train split）；
2. **不造假**：非官方 smoke 自检指标不得当作官方成绩；官方评测必须用锁定 commit `193627ae…`；
3. **不留痕**：数据本体、模型权重、个人文档一律不入仓库；仓库只保存 revision 与下载方式。

## 复现约定

- 模型 `docling-project/SmolDocling-256M-preview` revision `ce51f56c…`；
- 数据集 `opendatalab/OmniDocBench` revision `aa1ee96d…`；
- 每次实验记录环境快照、prompt_id、generation config、latency，写入 `results/`。

## Kaggle 实测记录（2026-08-13，Phase 2 smoke v6，全步骤通过）

| 项目 | 实测值 |
| --- | --- |
| GPU | Tesla P100-PCIE-16GB（15.9 GB）· CUDA 12.8 ⚠️ 见下方排障 |
| Python / torch | 3.12.13 · 2.10.0+cu128（镜像自带） |
| transformers / docling-core | 5.0.0 · 2.91.0 |
| 数据集下载 | 89.8 s（images 共 1.38 GB + 42 MB 标注） |
| 模型加载 | 14.3 s（revision ce51f56c…） |
| 首次推理（合成页） | 55 s（其中推理 53.8 s，CPU） |
| fast 基线 12 页 | ≈ 3 h（CPU，平均 894 s/页） |
| md2md 导出 + smoke 自检 | 46 s（12 页；sanity_ned 0.454，非官方指标） |

### 第一次官方分数（2026-08-13，3 页 smoke）

官方 end2end 评测链路已在 Kaggle 跑通（入口 `python pdf_validation.py --config <yaml>`，
锁定 commit `193627ae…`，quick_match）。3 页固定子集（seed 42，CPU 基线，
max_new_tokens=4096，CDM 关闭）结果：text_block Edit_dist 0.0234（2 页）、
table TEDS 0.0 / Edit_dist 1.0（1 页）、reading_order Edit_dist 0.3333（3 页）。
⚠️ 这是链路验证分数，不是全量 Benchmark 成绩；原始结果见
`reports/official_eval_smoke/`。

运行官方评测的两个环境要点：

1. 官方代码要求 Python `<3.12` 并锁定旧版依赖；在 Kaggle 3.12 上**不要**
   `pip install -e .`，改为 `src.evaluation.install_official_deps()`（不锁版本）后
   从仓库根目录直接运行入口脚本；
2. CDM 公式指标需要 Node/KaTeX/TeX 环境，默认关闭并在报告中注明 metric 集合。

### ⚠️ P100 + torch 2.10 GPU 不可用（已自动处理）

Kaggle 本轮分配的 P100（sm_60）与镜像自带的 torch 2.10.0+cu128 不兼容
（`CUDA error: no kernel image`）。`src/model.py` 会自动检测并在加载后回退 CPU，
记录 `device_fallback_reason`。**CPU 下单页约 15 分钟**，因此：

- `fast`（12 页 ≈ 3 h）可用于 smoke，但 `teaching`（100 页 ≈ 25 h）与
  `research`（1651 页）在 CPU 上不可行；
- 推荐顺序：① 重新启动会话争取分配到 T4/L4（sm_75+，兼容新 torch）；
  ② CPU 教学模式下把 `configs/default.yaml` 的 `generation.max_new_tokens`
  降到 2048 并减少页数；③ 验证可支持 sm_60 的 torch 构建（需同时核对
  transformers 兼容性，未验证，不要在教学主线上默认采用）。

以官方 Efficient GPU usage 文档为准，如实记录实际分配到的设备。

## Notebook 维护说明

Phase 2 的 00/01/04/07 由 `scripts/build_notebooks.py` 生成；改 Notebook 内容时优先改生成器并重跑。
在 Kaggle UI 中直接编辑后，请把最终 `.ipynb` 保存回仓库并同步更新生成器，避免两处漂移。
`scripts/kaggle/` 下的冒烟 Notebook 是自包含版本（仓库代码以快照内嵌），
因为 `kaggle kernels push` 的附带文件 staging 在实测中不可用；教学 Notebook 不受影响。

最后更新：2026-08-13

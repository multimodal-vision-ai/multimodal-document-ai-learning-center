# 12 周 AI 与多模态文档智能入门训练营

> **适合谁 / Audience**：具备基础 Python 阅读能力、首次系统接触 AI research 的高年级本科生或研究生。<br>
> **最终成果 / Capstone**：一个可复现、可评测、含 AI 使用记录与 W&B 实验报告的 Document AI 项目。

## 通关规则

- 总周期固定为 12 周，建议每周 6–8 小时。
- 每周必须提交代码、结果和简短反思；只有截图不算可复现证据。
- Week 3 必须完成 AI-assisted coding 闭环；Week 8–9 必须完成微调与 W&B 对比。
- 每周 100 分，达到 60 分才可进入下一周；总评与补交规则见[评分量表](10_Assessment_and_Submission.md)。
- 数据不可含隐私或未授权材料；模型与数据集必须阅读 license/model card/dataset card。

## 路线图

| 周次 | 主题 / Topic | 本周可验证成果 | 建议时长 |
| --- | --- | --- | --- |
| [1](#week-1) | 可复现开发环境 | 环境清单、首次 PR、可运行脚本 | 6h |
| [2](#week-2) | Hugging Face 与 Transformers | 最小推理 notebook 与 Model Card 对比 | 7h |
| [3](#week-3) | AI 辅助编程 | prompt log、测试、人工审查 | 7h |
| [4](#week-4) | Vision-Language Models | VLM demo 与失败案例 | 7h |
| [5](#week-5) | Document AI 任务地图 | 三类文档分析报告 | 6h |
| [6](#week-6) | Docling 文档解析流水线 | PDF→Markdown/JSON pipeline | 8h |
| [7](#week-7) | Dataset、Benchmark 与 Ethics | 固定测试集与 baseline | 7h |
| [8](#week-8) | LoRA/PEFT 微调 | adapter、配置和训练记录 | 8h |
| [9](#week-9) | W&B 辅助微调 | 两个可比较 runs 与 report | 8h |
| [10](#week-10) | Evaluation 与 Ablation | 指标、消融、错误分析 | 7h |
| [11](#week-11) | 论文阅读与小规模复现 | reproduction report | 7h |
| [12](#week-12) | Capstone 展示与答辩 | 完整项目、model card、演示 | 8h |

---

## Week 1｜可复现的 AI Research Workflow { #week-1 }

**本周问题 / Guiding question**：别人能否仅凭你的仓库，在新环境里复现实验？

**本周学习入口**：[Git 与 GitHub](01_Git_and_GitHub.md) · [Python 与可复现环境](02_Python_Environment.md)

### 学习目标

- 使用 branch → commit → pull request 的基本协作流程；
- 用独立 Python 环境和依赖文件固定运行条件；
- 写出最小可运行脚本与 README。

### 必做任务

- [ ] 创建个人课程仓库和 `week01` 分支，通过 PR 合入首个脚本。
- [ ] 编写一个 PDF 页数或图片尺寸统计工具，包含 `--help`。
- [ ] 记录 Python、操作系统、关键依赖版本及复现命令。

### 提交与验收

- `week01/README.md`、`environment.yml` 或 `requirements.txt`、源代码、一次 PR 链接。
- 助教在干净环境运行一条命令成功；README 不依赖口头说明。

### 官方学习链接

- [Git tutorial](https://git-scm.com/docs/gittutorial)（EN）
- [GitHub Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world)（EN）
- [Python venv](https://docs.python.org/3/tutorial/venv.html)（EN）

---

## Week 2｜Hugging Face Hub 与 Transformers { #week-2 }

**本周问题**：如何判断一个模型能否用于目标任务，并正确解释其输入输出？

**本周学习入口**：[Hugging Face Hub](03_HuggingFace.md) · [Transformers 推理](05_Transformers.md) · [Kaggle Notebook（按需）](04_Kaggle.md)

### 学习目标

- 阅读 model card、dataset card、license 与 limitation；
- 使用 `pipeline` 或 `Auto*` API 完成推理；
- 固定模型 revision、seed 和运行配置。

### 必做任务

- [ ] 选择一个可在现有资源上运行的小模型，完成一次最小推理。
- [ ] 再选择一个视觉/多模态模型，只阅读并对比 Model Card：来源、版本、license、输入输出、资源要求和限制。
- [ ] 为已运行模型保存三组正常样例及一组失败样例，并判断 CPU/GPU 可行性。

### 提交与验收

- `week02/model-demo.ipynb`、`model-comparison.md`、机器可读配置文件。
- Notebook 从头运行无隐藏状态；结论能由保存的输出支持。

### 官方学习链接

- [Hugging Face Hub documentation](https://huggingface.co/docs/hub/)（EN）
- [Transformers quick tour](https://huggingface.co/docs/transformers/quicktour)（EN）
- [Model Cards guide](https://huggingface.co/docs/hub/model-cards)（EN）

---

## Week 3｜AI 辅助编程 / AI-assisted Coding { #week-3 }

**本周问题**：怎样让 AI 提高开发效率，同时不把判断与责任交给 AI？

**本周学习入口**：[AI 辅助编程与验证](05-1_AI_Assisted_Coding.md)

### 学习目标

- 把需求拆成可验证的小任务，向 AI 提供必要上下文；
- 审查生成代码的正确性、安全性、许可与边界条件；
- 用测试、静态检查和人工阅读形成 evidence loop。

### 必做任务

- [ ] 用 ChatGPT、GitHub Copilot 或同类工具改进 Week 1 工具：加入参数校验、错误处理和测试。
- [ ] 至少保留 3 轮“需求 → AI 建议 → 人工判断 → 验证 → 修正”的记录。
- [ ] 写 3 个正常测试和 2 个异常测试；故意询问 AI 一个含糊需求并分析失败原因。
- [ ] 在 README 披露使用了什么 AI、用于什么环节、哪些内容被人工修改。

### 提交与验收

- `week03/prompt-log.md`、`code-review.md`、`tests/`、测试输出。
- 评分重点是验证证据，而非 prompt 长度；学生能解释每段最终代码。

### 官方学习链接

- [GitHub Copilot documentation](https://docs.github.com/en/copilot)（EN）
- [Responsible use of GitHub Copilot](https://docs.github.com/en/copilot/responsible-use)（EN）
- [Python unittest](https://docs.python.org/3/library/unittest.html)（EN）

---

## Week 4｜Vision-Language Models（VLM） { #week-4 }

**本周问题**：VLM 在“看图并回答”时真正看到了什么，又会在哪里失败？

**本周学习入口**：[Qwen3.5-VL 推理](06-1_Qwen3.5-VL-0.8B.md) · [Transformers 推理](05_Transformers.md)

### 学习目标

- 解释 image encoder、projector/alignment 与 language model 的角色；
- 正确组织图像、文本 prompt 与 generation 参数；
- 从幻觉、OCR、空间关系、计数等维度分析失败。

### 必做任务

- [ ] 使用一个公开 VLM 对 8 张不同类型图像执行描述与问答。
- [ ] 固定 prompt 比较至少两组 generation 设置。
- [ ] 建立 5 条以上 failure cases，给出错误类别和可能原因。

### 提交与验收

- `week04/vlm-demo.ipynb`、`cases/`、`failure-analysis.md`。
- 每项结论可追溯到输入、参数与原始输出。

### 官方学习链接

- [Qwen3.5-0.8B official Model Card](https://huggingface.co/Qwen/Qwen3.5-0.8B)（EN）
- [Transformers multimodal chat templates](https://huggingface.co/docs/transformers/chat_templating_multimodal)（EN）

---

## Week 5｜Document AI 任务地图 { #week-5 }

**本周问题**：OCR、layout、table、Document VQA 的输入、输出与评价方式有何不同？

**本周学习入口**：[Document AI 任务与评测](07_Doc_AI.md)

### 学习目标

- 区分 OCR、layout analysis、table recognition 与 document understanding；
- 识别扫描件、数字 PDF、复杂版面和多语言文档的难点；
- 尊重文档隐私、版权与数据治理要求。

### 必做任务

- [ ] 选择数字 PDF、扫描件、含表格文档各一份（公开或自制）。
- [ ] 人工标注预期结构，运行一个公开工具并逐项对照。
- [ ] 制作任务地图：输入 → 方法 → 输出 → 指标 → 常见错误。

### 提交与验收

- `week05/document-analysis.md`、去敏样例或来源链接、错误表。
- 至少指出 3 类错误，避免仅凭“看起来不错”评价模型。

### 官方学习链接

- [PaddleOCR documentation](https://www.paddleocr.ai/main/en/index.html)（EN/中文切换）
- [Hugging Face document question answering](https://huggingface.co/docs/transformers/tasks/document_question_answering)（EN）

---

## Week 6｜Docling 文档解析 Pipeline { #week-6 }

**本周问题**：如何把不可直接计算的 PDF 转换为可检查、可复用的结构化数据？

**本周学习入口**：[Docling 文档解析](06-2_Docling.md) · [项目实战 01](../experiments/Experiment_01/README.md)

### 学习目标

- 构建 PDF → parse/OCR → document model → Markdown/JSON 流水线；
- 处理失败、日志、输出目录和可重复运行；
- 对标题、段落、表格和阅读顺序做质量检查。

### 必做任务

- [ ] 用 Docling 解析 Week 5 的三份文档并导出 Markdown/JSON。
- [ ] 为命令行程序加入输入校验、日志和失败退出码。
- [ ] 定义 5 条自动或人工质量检查规则，并记录通过率。

### 提交与验收

- `week06/pipeline/`、`README.md`、`results/`、质量检查表。
- 新文档可通过一条命令处理；失败时给出清晰信息。

### 官方学习链接

- [Docling installation](https://docling-project.github.io/docling/getting_started/installation/)（EN）
- [Docling quickstart](https://docling-project.github.io/docling/getting_started/quickstart/)（EN）

---

## Week 7｜Dataset、Benchmark 与 Responsible AI { #week-7 }

**本周问题**：怎样设计一个不会“用测试集教模型”的可信评测？

**本周学习入口**：[Document AI Benchmark](07_Doc_AI.md) · [OmniDocBench 动手教程](../tutorials/Qwen2.5-OmniDocBench-kaggle-tutorial.md)

### 学习目标

- 区分 train/validation/test，理解 data leakage；
- 根据任务选择指标并报告数据分布；
- 记录数据来源、许可、隐私和潜在偏差。

### 必做任务

- [ ] 建立 20–50 个样例的小型固定测试集，不用于训练。
- [ ] 为 Week 6 pipeline 设定 baseline、至少两个指标和通过阈值。
- [ ] 输出总体结果与按文档类型切片结果，分析最差的 5 个案例。

### 提交与验收

- `week07/dataset-card.md`、`benchmark.py`、`results.csv`、`benchmark-report.md`。
- 数据集来源、划分、指标公式与限制均明确；脚本能重算结果。

### 官方学习链接

- [Hugging Face Datasets documentation](https://huggingface.co/docs/datasets/)（EN）
- [Hugging Face Evaluate](https://huggingface.co/docs/evaluate/)（EN）
- [Dataset Cards](https://huggingface.co/docs/hub/datasets-cards)（EN）

---

## Week 8｜LoRA/PEFT 小规模微调 { #week-8 }

**本周问题**：在有限算力下，如何得到一个可复现且不过度宣称效果的 adapter？

**本周学习入口**：[模型后训练与 W&B](08_Post_Training.md) · [Qwen3.5-VL 后训练路线](../tutorials/Qwen3.5-VL-SFT-GRPO-tutorial.md)

### 学习目标

- 理解 SFT、LoRA 与 QLoRA 的适用范围；
- 解释 rank、alpha、target modules、learning rate 与 batch size；
- 保存 adapter、训练配置、随机种子和 baseline。

### 必做任务

- [ ] 选择足够小的模型/数据完成一次 LoRA SFT；显存不足可用更小模型或缩小数据。
- [ ] 训练前先保存 zero-shot/baseline 结果，训练后用同一验证集比较。
- [ ] 记录 trainable parameters、资源消耗、训练时间和已知限制。

### 提交与验收

- `week08/train.py` 或 notebook、`training-config.yaml`、adapter 获取方式、`training-report.md`。
- 配置与报告一致；test set 未用于训练或调参；失败实验也需如实记录。

### 官方学习链接

- [PEFT quicktour](https://huggingface.co/docs/peft/quicktour)（EN）
- [PEFT LoRA guide](https://huggingface.co/docs/peft/package_reference/lora)（EN）
- [TRL SFT Trainer](https://huggingface.co/docs/trl/sft_trainer)（EN）
- [PyTorch reproducibility](https://docs.pytorch.org/docs/stable/notes/randomness.html)（EN）

---

## Week 9｜用 W&B 辅助模型微调 { #week-9 }

**本周问题**：如何让训练曲线、超参数、模型产物和结论形成可审计链条？

**本周学习入口**：[W&B 实验管理](08_Post_Training.md)

### 学习目标

- 用 W&B Run 记录 config、metrics、system metrics 与 notes；
- 用 Artifacts 对数据/adapter 版本化；
- 用 Tables 和 Reports 比较实验，而非只挑最好的一次。

### 必做任务

- [ ] 在 Week 8 训练代码中接入 W&B；不要将 API key 提交到仓库。
- [ ] 只改变一个因素，运行至少两个 runs（例如 learning rate A/B）。
- [ ] 记录 train/eval loss、学习率、关键任务指标、运行时间和显存；上传配置与 adapter metadata artifact。
- [ ] 创建 W&B Report，写出证据支持的结论与下一步。若项目不能公开，提交脱敏导出图和表。

### 提交与验收

- `week09/wandb-report.md`、两个 run ID/链接、配置 diff、图表与结论。
- Runs 使用一致数据划分和指标；能从 report 回到具体 config 与 artifact。

### 官方学习链接

- [W&B Quickstart](https://docs.wandb.ai/models/quickstart)（EN）
- [Track experiments](https://docs.wandb.ai/models/track)（EN）
- [Hugging Face Transformers integration](https://docs.wandb.ai/models/integrations/huggingface)（EN）
- [W&B Artifacts](https://docs.wandb.ai/models/artifacts)（EN）
- [W&B Reports](https://docs.wandb.ai/models/reports)（EN）

---

## Week 10｜Evaluation、Ablation 与 Error Analysis { #week-10 }

**本周问题**：观察到的改进来自微调设置，还是随机波动、数据泄漏或选择性汇报？

**本周学习入口**：[统一评测与消融](08_Post_Training.md#stage-4)

### 学习目标

- 公平比较 baseline 与 tuned model；
- 设计一次只改变一个因素的 ablation；
- 用定量指标与定性错误共同解释结果。

### 必做任务

- [ ] 冻结 Week 7 test set，对 baseline 和至少两个 Week 9 runs 统一评测。
- [ ] 做一个 ablation，报告总体、分组指标和资源成本。
- [ ] 建立至少 20 个错误案例的 taxonomy，抽样人工复核。

### 提交与验收

- `week10/evaluate.py`、`results.csv`、`error-analysis.md`、`evaluation-report.md`。
- 报告包含负面结果与限制；图表可由原始结果重新生成。

### 官方学习链接

- [scikit-learn model evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)（EN）
- [Hugging Face Evaluate](https://huggingface.co/docs/evaluate/)（EN）

---

## Week 11｜论文阅读与小规模复现 { #week-11 }

**本周问题**：原论文的核心主张，在你的资源约束下能否被部分验证？

**本周学习入口**：[论文导读](../reading/README.md) · [评测基准](../reading/05_benchmark-2026.md)

### 学习目标

- 区分研究问题、方法、证据、贡献与限制；
- 从论文和官方代码提取可执行复现计划；
- 解释偏差，而不是把“数值不同”简单判定为失败。

### 必做任务

- [ ] 选择一篇与 capstone 相关且有公开代码/数据的论文。
- [ ] 预注册一个可验证主张、复现范围、成功标准和资源上限。
- [ ] 运行缩小版复现，比较原文与本地设置并分析偏差来源。

### 提交与验收

- `week11/paper-review.md`、`reproduction-plan.md`、`reproduction-report.md`。
- 所有论文、代码和数据均给出原始链接；清楚区分事实、结果与推测。

### 官方学习链接

- [NeurIPS Paper Checklist](https://neurips.cc/public/guides/PaperChecklist)（复现、透明度与研究伦理，EN）
- [ACM Artifact Review and Badging](https://www.acm.org/publications/policies/artifact-review-and-badging-current)（EN）

---

## Week 12｜Capstone、展示与答辩 { #week-12 }

**本周问题**：一个陌生读者能否理解问题、复现结果，并判断结论是否可信？

**本周学习入口**：[提交规范与评分量表](10_Assessment_and_Submission.md) · [项目实战](../experiments/README.md) · [成果展厅](../projects/README.md)

### 项目要求

项目必须包含：明确问题与非目标、授权数据、固定 baseline、至少一次改进、统一评测、错误分析、AI 使用披露，以及 W&B 实验追踪。推荐方向包括 OCR、layout/table understanding、Document VQA、VLM 文档解析或检索。

### 必做任务

- [ ] 整理一键复现入口与环境说明；移除密钥、隐私数据和大文件。
- [ ] 编写 model card/project card，说明预期用途、不适用场景、限制与伦理风险。
- [ ] 准备 5 分钟演示和 5 分钟答辩；同伴按量表复核一次。

### 提交与验收

- `final-project/README.md`、源码/配置、结果、W&B Report、`MODEL_CARD.md`、演示材料。
- 助教抽样复现成功；结论与证据一致；总评达到 60 分。

### 官方学习链接

- [Hugging Face Model Cards](https://huggingface.co/docs/hub/model-cards)（EN）
- [GitHub repository security: secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)（EN）
- [W&B Reports](https://docs.wandb.ai/models/reports)（EN）

---

## 完成之后

你已经完成的不是“看完 12 章”，而是一套可审计的研究证据。下一步可进入[论文导读](../reading/README.md)、[项目实战](../experiments/README.md)，或将 capstone 整理到[成果展厅](../projects/README.md)。

最后更新：2026-08-07

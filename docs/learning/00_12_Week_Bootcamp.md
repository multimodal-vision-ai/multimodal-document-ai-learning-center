---
hide:
  - toc
---

# 12 周多模态视觉智能自主学习课程

> **适合谁**：具备基础 Python 阅读能力、首次系统接触 AI research 的高年级本科生或研究生。<br>
> **建议投入**：每周约 24 小时，共 12 周。<br>
> **最终成果**：一个可复现、可评测、包含 AI 使用记录与实验报告的多模态文档智能项目。

## 自主学习规则

- 学生自主安排进度、自主检查证据并决定补做或扩展，不设置导师评分和通关审批。
- 每周建议投入 24 小时：课程与官方材料 4 小时、主线项目 10 小时、评测与失败分析 4 小时、自主探索 4 小时、记录与例会准备 2 小时。
- 每周必须留下代码、配置、原始结果和简短复盘；只有截图不能构成可复现证据。
- 每周从给出的方向中选择一个继续探索，不要求同时完成全部扩展任务。
- AI-assisted coding 从 Week 3 起贯穿后续课程，但必须保留人工验证和使用披露。
- 数据不可包含隐私或未授权材料；使用模型和数据前必须阅读 license、model card 或 dataset card。
- 每周例会只交流进展、证据、困难和下一步，导师不评分、不验收。

[打开自主评估指南](10_Assessment_and_Submission.md){ .md-button .md-button--primary }
[复制学习记录模板](11_Learning_Log_Template.md){ .md-button }

## 12 周路线

| 周次 | 主题 | 本周核心成果 | 建议投入 |
| --- | --- | --- | ---: |
| [1](#week-1) | 可复现研究工程 | 项目仓库、环境记录、可运行脚本 | 24h |
| [2](#week-2) | Hugging Face 与模型推理 | 最小推理、Model Card 对比、失败案例 | 24h |
| [3](#week-3) | AI 辅助编程与验证 | Prompt 记录、测试与人工审查 | 24h |
| [4](#week-4) | 视觉语言模型 | VLM 受控实验与失败分类 | 24h |
| [5](#week-5) | Document AI 任务地图 | 三类文档分析与研究方向选择 | 24h |
| [6](#week-6) | Docling 文档解析 | PDF → Markdown/JSON pipeline | 24h |
| [7](#week-7) | Dataset 与 Benchmark | 固定测试集、baseline 与错误分析 | 24h |
| [8](#week-8) | LoRA/PEFT 微调 | adapter、配置、训练前后对比 | 24h |
| [9](#week-9) | W&B 实验追踪 | 可比较 runs、artifact 与报告 | 24h |
| [10](#week-10) | 统一评测与消融 | 指标、消融、成本与错误 taxonomy | 24h |
| [11](#week-11) | 论文导读与最小复现 | Paper Card 与 reproduction report | 24h |
| [12](#week-12) | Capstone 与自主答辩 | 完整项目、Project Card 与演示 | 24h |

## 三条完成路径

| 路径 | 建议投入 | 每周怎么做 | 算力策略 |
| --- | ---: | --- | --- |
| **最小路径** | 8–12 小时 | 完成“最小动作”和核心证据，到达可复现的最低闭环 | CPU、免费 Kaggle/Colab、小模型、小数据切片 |
| **标准路径** | 约 24 小时 | 完成现有主线任务、验证、一次自主探索与复盘 | 按任务选择本地或免费/可控云资源 |
| **进阶路径** | 24 小时以上 | 标准路径之外增加论文复现、消融、跨模型对比或完整评测 | 先设时间、显存和费用上限，再扩大实验 |

!!! info "本课程学习卡"
    **学什么**：把模型调用、文档解析、训练和评测组织成可复现研究。<br>
    **官方来源**：每周“官方入口”中的原始文档、论文、代码仓库和 Model/Dataset Card。<br>
    **做什么**：选择一条路径，每周完成 Learn → Run → Measure → Improve → Explain。<br>
    **提交什么**：同一研究仓库中的代码、配置、原始结果、错误分析和学习记录。<br>
    **如何自查**：逐项检查本周证据，并使用[自主评估指南](10_Assessment_and_Submission.md)。

!!! tip "如何使用本页"
    每周先读“核心问题”和“必须留下的证据”，再进入对应专题。完成主线后只选一个自主探索方向；如果证据仍不完整，把探索时间用于补齐，不必追赶更多内容。

## Week 1｜可复现研究工程 { #week-1 }

> **路径选择**：最小＝建立仓库、完成一个可运行小工具并从全新 clone 复现｜标准＝完成本周全部主线｜进阶＝增加自动化 smoke test 或一次规范 PR Review。

**核心问题**：另一位同学能否只根据仓库说明运行你的第一个项目？

**本周价值**：先建立贯穿 12 周的研究仓库。后续模型、数据、评测和论文复现都在这里持续积累，不再创建彼此割裂的周作业。

**学习入口**：[Git 与 GitHub](01_Git_and_GitHub.md) · [Python 与可复现环境](02_Python_Environment.md)

### 主线任务（16–18 小时）

- [ ] 创建个人课程仓库，使用 branch → commit → Pull Request 完成第一次合并。
- [ ] 写出 `docs/project_plan.md`：当前问题、范围、非目标和初步成功标准。
- [ ] 编写一个 PDF 页数或图片尺寸统计工具，提供 `--help` 和清晰错误信息。
- [ ] 记录 Python、操作系统、依赖版本、运行命令和数据来源。
- [ ] 为正常输入和错误输入各写至少一个测试。
- [ ] 从空环境或全新 clone 按 README 重新运行一次。

### 必须留下的证据

- `README.md`、`docs/project_plan.md`、依赖文件、源代码、测试和一次 PR 链接；
- 一条可复制的开始命令，以及成功运行和错误处理的原始输出。

### 自主探索方向（选择一个，约 4 小时）

- **工程**：增加日志、配置文件或自动化 smoke test。
- **协作**：使用 Issue、PR Review 和小步 commit 管理一次功能改进。
- **研究**：写一页说明，比较“能运行”“可复现”和“可审计”的区别。

### 自主检查

- [ ] README 不依赖口头说明或本机绝对路径。
- [ ] 代码、依赖、输入和输出之间的关系清楚。
- [ ] 失败输入会产生可理解的信息，而不是静默失败。
- [ ] 当前成果至少达到[自主评估](10_Assessment_and_Submission.md)中的“已跑通”。

### 例会前准备

展示一条运行命令、一个可复现证据、一个未解决问题，以及 Week 2 首先要验证的模型问题。

### 官方入口

- [Git tutorial](https://git-scm.com/docs/gittutorial)
- [GitHub Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world)
- [Python venv](https://docs.python.org/3/tutorial/venv.html)

## Week 2｜Hugging Face 与模型推理 { #week-2 }

> **路径选择**：最小＝阅读一个 Model Card 并完成一次固定样例推理｜标准＝完成模型对比、失败样例与版本记录｜进阶＝在相同输入上做跨模型受控比较。

**核心问题**：如何判断一个模型是否适合目标任务，并正确解释它的输入输出？

**本周价值**：模型选择必须来自 model card、资源约束和可验证结果，而不是参数规模或排行榜印象。

**学习入口**：[Hugging Face Hub](03_HuggingFace.md) · [Transformers 推理](05_Transformers.md) · [Kaggle Notebook（按需）](04_Kaggle.md)

### 主线任务（16–18 小时）

- [ ] 阅读一个可运行小模型的 model card，记录 ID、revision、license、输入输出和限制。
- [ ] 完成一次最小推理，并将配置、运行命令与输出保存到 Week 1 仓库。
- [ ] 再选择一个视觉或多模态模型，对比两份 model card 的任务适配度和资源要求。
- [ ] 保存三组正常样例和至少一组失败样例。
- [ ] 将 Notebook 从头运行，消除隐藏状态；同时判断本地或云端运行的必要性。

### 必须留下的证据

- 推理脚本或 Notebook、模型对比说明、机器可读配置、原始输出和失败案例。

### 自主探索方向

- **模型**：在相同输入上比较两个可运行的小模型。
- **平台**：研究 Hub revision、缓存和模型文件版本如何影响复现。
- **研究**：列出 model card 没有回答、但真实使用前必须验证的三个问题。

### 自主检查

- [ ] 能用一句话说明为什么选择该模型。
- [ ] 模型版本和关键配置可追溯。
- [ ] 结论能够回到原始输入与输出。
- [ ] 明确写出至少一个不适用场景。

### 例会前准备

展示一次模型选择决策、一组原始输出和一个失败案例，不需要演示所有代码。

### 官方入口

- [Hugging Face Hub documentation](https://huggingface.co/docs/hub/)
- [Transformers quick tour](https://huggingface.co/docs/transformers/quicktour)
- [Model Cards guide](https://huggingface.co/docs/hub/model-cards)

## Week 3｜AI 辅助编程与人工验证 { #week-3 }

> **路径选择**：最小＝完成一张 Task Card、一次 AI 协作记录和对应测试｜标准＝完成全部人工审查与边界测试｜进阶＝系统比较不同 Prompt 或测试策略。

**核心问题**：怎样让 AI 提高开发效率，同时不把判断与责任交给 AI？

**本周价值**：从本周开始，AI 可以贯穿所有开发任务，但每项建议必须进入“需求—判断—验证—修正”的证据闭环。

**学习入口**：[AI 辅助编程与验证](05-1_AI_Assisted_Coding.md)

### 主线任务（16–18 小时）

- [ ] 把 Week 1 工具的一项改进写成 Task Card，包含约束、边界条件和完成标准。
- [ ] 至少保留三轮“需求 → AI 建议 → 人工判断 → 测试 → 修正”的记录。
- [ ] 加入参数校验、错误处理和测试，至少覆盖三个正常场景和两个异常场景。
- [ ] 检查生成代码的正确性、安全性、许可和不必要依赖。
- [ ] 在 README 说明使用了什么 AI、用于哪里、哪些内容被人工修改。

### 必须留下的证据

- `task-card.md`、`ai-use-log.md`、`code-review.md`、测试代码和完整测试输出。

### 自主探索方向

- **Prompt**：比较模糊需求和明确需求带来的差异。
- **测试**：让 AI 建议测试，再人工寻找它遗漏的边界条件。
- **安全**：检查代码中的密钥、路径、网络访问和数据泄露风险。

### 自主检查

- [ ] 能解释每段最终保留的代码。
- [ ] AI 建议经过测试、官方文档或人工审查验证。
- [ ] 被拒绝或修改的建议有清楚理由。
- [ ] 没有向 AI 工具上传私人文档、密钥或未授权数据。

### 例会前准备

展示一条被采纳建议、一条被拒绝建议，以及决定背后的验证证据。

### 官方入口

- [GitHub Copilot documentation](https://docs.github.com/en/copilot)
- [Responsible use of GitHub Copilot](https://docs.github.com/en/copilot/responsible-use)
- [Python unittest](https://docs.python.org/3/library/unittest.html)

## Week 4｜视觉语言模型 { #week-4 }

> **路径选择**：最小＝用固定图像完成一次 VLM 推理并记录失败｜标准＝完成受控实验与失败分类｜进阶＝比较两种模型或视觉输入策略。

**核心问题**：VLM 在“看图并回答”时真正依赖了什么，又会在哪里失败？

**本周价值**：从“会调用模型”进入“会控制变量、保存证据并分析视觉失败”。

**学习入口**：[Qwen3.5 推理](06-1_Qwen3.5-VL-0.8B.md) · [Transformers 推理](05_Transformers.md)

### 主线任务（16–18 小时）

- [ ] 解释视觉编码、跨模态连接和语言生成在推理中的作用。
- [ ] 使用公开 VLM 处理 8–12 张不同类型的图像或文档页面。
- [ ] 固定模型与样例，只改变 Prompt 或一个 generation 参数进行对照。
- [ ] 保存每次运行的模型 revision、输入、配置和原始输出。
- [ ] 建立不少于五个失败案例，并按 OCR、空间、计数、推理或幻觉分类。

### 必须留下的证据

- 推理程序、样例清单、run 表、配置、原始输出和失败分析。

### 自主探索方向

- **文档**：重点分析密集文字、表格或复杂版面。
- **实验**：比较两种 Prompt 约束或图像分辨率。
- **视频准备**：用连续多帧图像观察缺失时序信息时的推理问题。

### 自主检查

- [ ] 每组实验只改变一个变量。
- [ ] 成功和失败都能定位到原始输入与配置。
- [ ] 不把语言流畅度当作事实正确性。
- [ ] 能解释一个成功案例和一个失败案例。

### 例会前准备

展示最有代表性的成功、失败和一个仍无法解释的现象。

### 官方入口

- [Qwen3.5-0.8B Model Card](https://huggingface.co/Qwen/Qwen3.5-0.8B)
- [Transformers multimodal chat templates](https://huggingface.co/docs/transformers/chat_templating_multimodal)

## Week 5｜Document AI 任务地图 { #week-5 }

> **路径选择**：最小＝分析三类文档并明确一个研究问题｜标准＝完成任务地图和方向选择｜进阶＝补充代表性论文与可验证假设。

**核心问题**：OCR、版面、表格、公式和文档问答分别解决什么问题？

**本周价值**：先确定任务边界和评价方式，再选择工具或模型，避免把所有文档问题都称为“识别”。

**学习入口**：[Document AI 任务与评测](07_Doc_AI.md) · [论文导读](../reading/02_document-ai.md)

### 主线任务（16–18 小时）

- [ ] 选择数字 PDF、扫描件和含复杂表格文档各一份，记录公开来源或自制说明。
- [ ] 人工标注标题、段落、表格、公式与预期阅读顺序。
- [ ] 区分 OCR、layout analysis、table recognition、document parsing 和 Document VQA。
- [ ] 运行一个公开工具或模型，并逐项对照预期结构。
- [ ] 制作“任务—输入—方法—输出—指标—常见错误”地图。

### 必须留下的证据

- 文档来源、人工预期、任务地图、原始工具输出和不少于三类错误。

### 自主探索方向

- **OCR**：分析文字识别错误及其对下游任务的影响。
- **版面/表格**：研究阅读顺序、区域关系或合并单元格。
- **问答**：研究答案正确但证据定位不可靠的情况。

### 自主检查

- [ ] 能说明当前项目主要评价哪一类任务。
- [ ] 文档来源和使用权限清楚。
- [ ] 人工预期与模型原始输出分开保存。
- [ ] 评价不只依赖“看起来不错”。

### 例会前准备

展示任务地图、最困难的一类文档，以及准备在 Week 6 解决的 Pipeline 问题。

### 官方入口

- [PaddleOCR documentation](https://www.paddleocr.ai/main/en/index.html)
- [Hugging Face document question answering](https://huggingface.co/docs/transformers/tasks/document_question_answering)

## Week 6｜Docling 文档解析 Pipeline { #week-6 }

> **路径选择**：最小＝把一个公开 PDF 转为 Markdown/JSON 并保存版本与耗时｜标准＝完成可重复 pipeline 和错误分析｜进阶＝比较解析选项或另一种工具。

**核心问题**：如何把 PDF 转换成可检查、可重复使用的结构化数据？

**本周价值**：把单次演示改造成有输入校验、日志、输出规范和质量检查的研究 Pipeline。

**学习入口**：[Docling 文档解析](06-2_Docling.md) · [项目实战 01](../experiments/Experiment_01/README.md)

### 主线任务（16–18 小时）

- [ ] 使用 Docling 解析 Week 5 的三份文档并导出 Markdown/JSON。
- [ ] 建立可重复运行的命令行入口、输出目录、日志和失败退出码。
- [ ] 定义至少五条质量检查规则，覆盖标题、段落、表格和阅读顺序。
- [ ] 保存原始解析结果，不用人工修改制造成功输出。
- [ ] 分析数字 PDF、扫描件和表格文档之间的差异。

### 必须留下的证据

- Pipeline、README、原始 Markdown/JSON、运行日志和质量检查结果。

### 自主探索方向

- **工程**：批量处理、缓存、失败恢复或增量运行。
- **表示**：比较纯文本、Markdown、JSON 与 DocTags 的信息保留。
- **应用**：研究结构化结果进入 RAG 或其他下游任务前需要什么。

### 自主检查

- [ ] 新文档可以通过一条命令处理。
- [ ] 失败时有清晰错误信息并保留日志。
- [ ] 自动检查和完整 Benchmark 的边界明确。
- [ ] 能指出结构化输出仍丢失的关键信息。

### 例会前准备

展示一条 Pipeline 命令、一个结构保持较好的案例和一个失败案例。

### 官方入口

- [Docling installation](https://docling-project.github.io/docling/getting_started/installation/)
- [Docling quickstart](https://docling-project.github.io/docling/getting_started/quickstart/)

## Week 7｜Dataset、Benchmark 与负责任使用 { #week-7 }

> **路径选择**：最小＝固定一个小测试集、运行 baseline 并分析一个错误｜标准＝完成数据说明、指标和错误分类｜进阶＝增加切片评测或第二个 baseline。

**核心问题**：怎样建立一个不会被调参过程污染的可信测试集？

**本周价值**：冻结数据和评价方式，让 Week 8–10 的任何改进都有公平比较基础。

**学习入口**：[Document AI Benchmark](07_Doc_AI.md) · [OmniDocBench 教程](../tutorials/Qwen2.5-OmniDocBench-kaggle-tutorial.md) · [评测基准](../reading/05_benchmark-2026.md)

### 主线任务（16–18 小时）

- [ ] 建立 20–50 个样例的小型固定测试集，不用于训练或 Prompt 调整。
- [ ] 编写 dataset card，说明来源、划分、license、偏差与限制。
- [ ] 为 Week 6 Pipeline 设定 baseline、主指标和必要辅助指标。
- [ ] 输出总体结果与按文档类型切片结果。
- [ ] 分析最差的五个案例，并检查数据泄漏风险。

### 必须留下的证据

- dataset card、test manifest、评测脚本、baseline 结果和 benchmark report。

### 自主探索方向

- **数据**：分析类别、语言、扫描质量或难度分布。
- **指标**：比较自动指标与预先定义的人工判断。
- **鲁棒性**：研究旋转、压缩、模糊或复杂版面对结果的影响。

### 自主检查

- [ ] test set 已冻结并与训练/调参数据分离。
- [ ] 指标能够回答当前研究问题。
- [ ] 数据许可、隐私和已知偏差被记录。
- [ ] 结果包含失败和分组差异，而不只有平均分。

### 例会前准备

展示测试集设计、baseline 和一个指标无法完全反映的失败案例。

### 官方入口

- [Hugging Face Datasets](https://huggingface.co/docs/datasets/)
- [Hugging Face Evaluate](https://huggingface.co/docs/evaluate/)
- [Dataset Cards](https://huggingface.co/docs/hub/datasets-cards)

## Week 8｜LoRA/PEFT 小规模微调 { #week-8 }

> **路径选择**：最小＝在小模型和小数据上完成一次短程 LoRA/SFT｜标准＝完成训练前后公平对比｜进阶＝增加一个单变量消融；不因算力充足直接跳到 GRPO。

**核心问题**：在有限数据与算力下，怎样得到一个可复现、不过度宣称效果的 adapter？

**本周价值**：学习在固定 baseline 和验证集上研究模型变化，而不是追求更大的训练规模。

**学习入口**：[模型后训练与 W&B](08_Post_Training.md) · [Qwen3.5 后训练路线](../tutorials/Qwen3.5-VL-SFT-GRPO-tutorial.md)

### 主线任务（16–18 小时）

- [ ] 训练前保存 zero-shot 或 base model baseline。
- [ ] 使用小模型、小数据完成一次 LoRA/PEFT 训练；资源不足时主动缩小范围。
- [ ] 固定训练与验证划分，测试集不用于训练或调参。
- [ ] 保存训练配置、seed、trainable parameters、时间和资源消耗。
- [ ] 用相同验证集比较训练前后结果，并保留失败运行。

### 必须留下的证据

- 训练代码、配置、adapter metadata、baseline、训练后结果和训练报告。

### 自主探索方向

- **数据**：研究样例质量或数量变化。
- **参数**：只改变 rank、alpha 或 learning rate 中的一项。
- **效率**：比较显存、时间、成本与效果。

### 自主检查

- [ ] baseline 在训练前已保存。
- [ ] 配置与报告一致，失败实验没有被删除。
- [ ] test set 未参与训练或选择超参数。
- [ ] 能说明当前结果不能支持哪些更大结论。

### 例会前准备

展示 baseline、一次训练结果、资源消耗和一个尚不能解释的变化。

### 官方入口

- [PEFT quicktour](https://huggingface.co/docs/peft/quicktour)
- [PEFT LoRA guide](https://huggingface.co/docs/peft/package_reference/lora)
- [TRL SFT Trainer](https://huggingface.co/docs/trl/sft_trainer)
- [PyTorch reproducibility](https://docs.pytorch.org/docs/stable/notes/randomness.html)

## Week 9｜W&B 实验追踪 { #week-9 }

> **路径选择**：最小＝记录两个可比较 runs 及其配置和结果｜标准＝补齐 artifact、失败案例和 Report｜进阶＝增加数据或模型版本追踪。

**核心问题**：如何让多次训练、配置、模型产物和结论形成可审计链条？

**本周价值**：从“记得自己改过什么”升级为可以查询、比较和复查的实验记录。

**学习入口**：[模型后训练与 W&B](08_Post_Training.md)

### 主线任务（16–18 小时）

- [ ] 在 Week 8 代码中接入 W&B，不把 API key 提交到仓库。
- [ ] 只改变一个变量运行至少两个可比较 runs。
- [ ] 记录 config、metrics、system metrics、运行时间和关键任务指标。
- [ ] 用 artifact 或 metadata 关联数据、adapter、代码 commit 和结果。
- [ ] 创建 W&B Report，说明证据支持的结论、负面结果与下一步。

### 必须留下的证据

- run ID 或链接、配置 diff、图表、artifact 标识和报告；私有项目可保留脱敏导出。

### 自主探索方向

- **可视化**：设计更能回答研究问题的图和表。
- **追踪**：把每个 run 与 Git commit、数据版本和 adapter 对应。
- **决策**：制定选择或放弃模型的证据规则。

### 自主检查

- [ ] 两个 runs 使用一致的数据划分和指标。
- [ ] 能从报告回到具体配置、代码和 artifact。
- [ ] 不只展示最好的一次运行。
- [ ] 私有数据和敏感输入没有进入公开报告。

### 例会前准备

展示两个 runs 的唯一差异、最重要图表和当前模型选择判断。

### 官方入口

- [W&B Quickstart](https://docs.wandb.ai/models/quickstart)
- [Track experiments](https://docs.wandb.ai/models/track)
- [W&B Artifacts](https://docs.wandb.ai/models/artifacts)
- [W&B Reports](https://docs.wandb.ai/models/reports)

## Week 10｜统一评测、消融与错误分析 { #week-10 }

> **路径选择**：最小＝冻结协议并完成一个单变量对照｜标准＝完成指标、成本、消融和错误 taxonomy｜进阶＝增加置信区间、切片或稳健性评测。

**核心问题**：观察到的改进来自方法本身，还是随机波动、数据泄漏或选择性汇报？

**本周价值**：用统一测试、单变量消融和错误案例检验 Week 8–9 的结论。

**学习入口**：[模型后训练与 W&B](08_Post_Training.md#stage-4) · [评测基准](../reading/05_benchmark-2026.md)

### 主线任务（16–18 小时）

- [ ] 使用 Week 7 冻结的 test set 统一评测 baseline 与 Week 9 runs。
- [ ] 完成一次只改变一个因素的消融。
- [ ] 同时报告总体、分组指标和资源成本。
- [ ] 建立不少于 20 个错误案例的 taxonomy，并抽样人工复核。
- [ ] 写出正面结果、负面结果、限制和是否采用改进模型的决定。

### 必须留下的证据

- 评测脚本、原始结果、消融表、错误 taxonomy 和 evaluation report。

### 自主探索方向

- **鲁棒性**：测试压缩、模糊、旋转或版面变化。
- **成本**：比较效果、推理时间、显存和维护成本。
- **未来视频**：思考静态文档指标如何扩展到时间定位、事件和长上下文。

### 自主检查

- [ ] 所有模型使用同一测试集、指标和运行条件。
- [ ] 结论由指标和失败案例共同支持。
- [ ] 报告包含退化、成本和适用边界。
- [ ] 事实、解释和推测被清楚区分。

### 例会前准备

展示最关键的对比结果、一个推翻原假设的案例和最终模型选择。

### 官方入口

- [scikit-learn model evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [Hugging Face Evaluate](https://huggingface.co/docs/evaluate/)

## Week 11｜论文导读与最小复现 { #week-11 }

> **路径选择**：最小＝完成一张 Paper Card 和一个可验证问题｜标准＝复现一个最小主张｜进阶＝加入 baseline、消融或负面结果分析。

**核心问题**：论文的核心主张，在你的资源约束下能否被部分验证？

**本周价值**：把论文从“阅读材料”变成能够影响当前项目设计的研究证据。

**学习入口**：[论文导读](../reading/README.md) · [评测基准](../reading/05_benchmark-2026.md)

### 主线任务（16–18 小时）

- [ ] 选择一篇与当前项目直接相关、具有官方论文和可核查代码或数据的工作。
- [ ] 完成一页 Paper Card，区分问题、主张、证据和限制。
- [ ] 预注册一个最小主张、复现范围、成功标准、资源上限和停止条件。
- [ ] 运行小规模复现，保留配置与原始结果。
- [ ] 比较论文设置与本地设置，解释偏差而不是简单判断成功或失败。

### 必须留下的证据

- Paper Card、复现计划、配置、原始结果和 reproduction report。

### 自主探索方向

- **方法**：复现一个关键模块或最小算法变化。
- **数据/评测**：复现数据处理、指标或一组公开结果。
- **项目扩展**：把论文中的一个想法用于当前 Pipeline，并控制变量。

### 自主检查

- [ ] 事实来自论文原文、作者项目或数据主页。
- [ ] 成功标准在运行实验前已经写出。
- [ ] 缩小范围和本地差异被清楚记录。
- [ ] 论文事实、作者解释和个人推测相互分开。

### 例会前准备

用五句话说明论文问题、核心主张、关键证据、一个限制和你的复现结果。

### 官方入口

- [NeurIPS Paper Checklist](https://neurips.cc/public/guides/PaperChecklist)
- [ACM Artifact Review and Badging](https://www.acm.org/publications/policies/artifact-review-and-badging-current)

## Week 12｜Capstone、展示与自主答辩 { #week-12 }

> **路径选择**：最小＝整理可运行仓库、核心结果和限制说明｜标准＝完成完整 Project Card、演示与答辩材料｜进阶＝补充可复现实验包或对外展示版本。

**核心问题**：陌生读者能否理解问题、复现结果并判断结论是否可信？

**本周价值**：把 12 周形成的仓库、数据、模型、评测和研究判断整理为一个完整作品，并确定下一阶段自主探索方向。

**学习入口**：[Capstone 设计与展厅发布指南](../projects/README.md#design-capstone) · [自主评估与证据指南](10_Assessment_and_Submission.md) · [项目实战](../experiments/README.md)

### 主线任务（16–18 小时）

- [ ] 完成一页 Capstone 设计卡，明确问题、baseline、唯一核心变量、判断方式与停止条件。
- [ ] 整理唯一开始入口、环境说明、配置和一键复现命令。
- [ ] 移除密钥、私人文档、未授权数据和不必要的大文件。
- [ ] 汇总 baseline、改进方法、统一评测、错误分析和资源成本。
- [ ] 编写 Project Card 或 Model Card，说明用途、不适用场景、限制和伦理风险。
- [ ] 完成 AI 使用披露与最终自主评估。
- [ ] 准备五分钟项目演示，并请同学按 README 尝试复现一组结果。
- [ ] 制定未来四周的自主探索计划。

### 最终成果

- 完整项目仓库、源码、配置、结果、实验报告、Project/Model Card、演示材料和最终复盘。

### 自主探索方向

- **Document AI 深化**：更复杂版面、表格、公式或多语言文档。
- **模型实验**：更系统的后训练、鲁棒性或高效推理。
- **未来方向**：视频理解、多模态 Agent、结构化文档与 RAG。

### 最终自主检查

- [ ] 陌生同学能够按 README 复现至少一组结果。
- [ ] 每项关键结论都能回到输入、配置和原始结果。
- [ ] 负面结果、失败案例和适用边界被如实报告。
- [ ] AI 参与范围与人工验证清楚。
- [ ] 下一阶段研究问题具体、可执行、可检查。

### 例会前准备

展示最终项目、最可信的一项结论、最重要的限制，以及未来准备继续追问的问题。例会用于交流和提问，不进行导师评分。

### 官方入口

- [Hugging Face Model Cards](https://huggingface.co/docs/hub/model-cards)
- [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)
- [W&B Reports](https://docs.wandb.ai/models/reports)

## 完成之后

你完成的不是“看完 12 章”，而是一套由代码、配置、原始结果、指标、失败案例和研究说明组成的证据链。下一步可以继续进入[论文导读](../reading/README.md)、深化[项目实战](../experiments/README.md)，或把作品整理到[成果展厅](../projects/README.md)。



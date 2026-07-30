# MV-AI Lab AI Research Bootcamp
# 12周AI基础模型科研入门训练营

> 面向对象：计算机专业高年级本科生
>
> 目标：通过12周系统训练，使学生具备进入多模态人工智能研究方向的基础能力，能够独立完成一个可复现实验项目。
>
> 核心理念：
>
> **Learn → Run → Measure → Improve → Explain**

---

# 一、课程定位

本训练营不是简单的 AI 工具使用课程，而是面向未来 AI 研究人员的基础训练。

完成12周训练后，学生应该能够：

- 使用 GitHub 进行科研协作；
- 使用 AI Coding 工具辅助科研开发；
- 利用 Hugging Face 运行基础模型；
- 理解 Vision Language Model（VLM）基本原理；
- 掌握 Document AI 基础任务；
- 设计 Benchmark 和 Evaluation；
- 使用 LoRA/QLoRA 完成模型微调；
- 使用 Weights & Biases（W&B）管理实验；
- 阅读并复现实验论文；
- 完成一个小型 AI Research Project。

---

# 二、课程原则

## 1. 高质量、低维护

- 课程内容集中管理；
- 详细教程优先使用官方资源；
- 不重复建设大量教程；
- 学生通过实践掌握能力。

## 2. 工程与科研结合

训练学生：

- 写代码；
- 跑实验；
- 分析结果；
- 总结规律。

## 3. 可验证

每周都有：

- 学习目标；
- 实践任务；
- 提交成果；
- 导师检查点。

---

# 三、12周课程总览

| 周次 | 主题 | 核心能力 | 学生成果 |
| --- | --- | --- | --- |
| Week 1 | AI Research Workflow | GitHub + AI科研工作流 | 学习仓库初始化 |
| Week 2 | Hugging Face与基础模型 | 模型调用能力 | Model Demo |
| Week 3 | AI辅助编程（AI Coding） | AI辅助开发能力 | 工具代码与Prompt记录 |
| Week 4 | Vision Language Model | 多模态模型理解 | VLM实验报告 |
| Week 5 | Document AI基础 | 文档智能理解 | 文档分析报告 |
| Week 6 | 文档解析Pipeline | 数据处理能力 | PDF解析流程 |
| Week 7 | Dataset与Benchmark | 科研评价能力 | Benchmark报告 |
| Week 8 | LoRA/PEFT微调 | 模型优化能力 | 微调实验 |
| Week 9 | W&B实验管理 | 实验追踪能力 | W&B实验报告 |
| Week10 | Evaluation与Ablation | 科研分析能力 | Evaluation报告 |
| Week11 | Paper Reading与Reproduction | 科研复现能力 | 论文复现实验 |
| Week12 | Final Project | 综合科研能力 | 项目报告 |

---

# 四、详细课程设计

# Week 1：AI Research Workflow

## 学习目标

建立 AI 科研开发环境。

学习：

- Git/GitHub；
- VS Code；
- Python环境；
- Conda/Mamba；
- AI Coding工具。

## 任务

完成：

1. 创建GitHub学习仓库；
2. 配置开发环境；
3. 使用AI辅助完成一个简单Python工具。

示例：

- PDF页数统计工具；
- 图片信息统计工具；
- 数据格式转换工具。

## 提交成果

```

README.md

learning-log.md

hello-ai-tool.py

```

## 导师检查

- 是否完成GitHub基本操作；
- 是否能够提交代码；
- 是否记录AI辅助过程。

## 官方资源

- Git Tutorial  
https://git-scm.com/docs/gittutorial

- GitHub Hello World  
https://docs.github.com/en/get-started/start-your-journey/hello-world

---

# Week 2：Hugging Face与基础模型

## 学习目标

理解现代基础模型生态。

学习：

- Hugging Face Hub；
- Model Card；
- Dataset；
- Transformers；
- Inference。

## 任务

运行：

- 一个文本模型；
- 一个视觉模型。

记录：

- 模型名称；
- 输入输出；
- 模型特点；
- 使用限制。

## 提交成果

```

model-demo.ipynb

result.md

```

## 导师检查

- 是否能够加载模型；
- 是否理解模型输入输出。

## 官方资源

- Hugging Face Documentation  
https://huggingface.co/docs

- Transformers Documentation  
https://huggingface.co/docs/transformers

---

# Week 3：AI辅助编程（AI Coding）

## 学习目标

掌握 AI 辅助科研开发方法。

学习：

- Prompt设计；
- AI代码生成；
- AI代码审查；
- Debug方法。

## 任务

利用：

- ChatGPT；
- GitHub Copilot；
- 其他AI Coding工具。

完成一个科研辅助工具。

要求记录：

- Prompt；
- AI生成代码；
- 人工修改；
- 测试结果。

## 提交成果

```

tool.py

prompt-record.md

code-review.md

```

## 导师检查

重点：

不是代码是否复杂，而是：

- 是否会使用AI；
- 是否会验证AI输出。

## 官方资源

- GitHub Copilot Documentation  
https://docs.github.com/en/copilot

---

# Week 4：Vision Language Model

## 学习目标

理解视觉语言模型。

学习：

- Image Encoder；
- Language Model；
- Multimodal Alignment；
- Prompt设计。

## 任务

使用：

- Qwen-VL；
- 或其他开源VLM。

完成：

- 图片理解；
- 图像问答；
- 错误案例分析。

## 提交成果

```

vlm-demo.ipynb

failure-analysis.md

```

## 官方资源

- Qwen Documentation  
https://qwen.readthedocs.io/

---

# Week 5：Document AI基础

## 学习目标

理解文档智能任务。

学习：

- OCR；
- Layout Analysis；
- Table Understanding；
- Document VQA。

## 任务

选择3份真实文档。

分析：

- 文本内容；
- 页面结构；
- 表格；
- 模型错误。

## 提交成果

```

document-analysis.md

```

## 官方资源

- PaddleOCR Documentation  
https://paddlepaddle.github.io/PaddleOCR/

---

# Week 6：文档解析Pipeline

## 学习目标

掌握文档处理流程。

学习：

PDF

↓

OCR/Layout

↓

Markdown/JSON

↓

AI应用


## 任务

完成：

PDF → Structured Data

流程。

## 提交成果

```

pipeline-demo/

README.md

result.json

```

## 官方资源

- Docling Documentation  
https://docling-project.github.io/docling/

---

# Week 7：Dataset与Benchmark

## 学习目标

理解AI科研评价体系。

学习：

- Dataset设计；
- Train/Test划分；
- Evaluation Metric；
- Error Analysis。

## 任务

选择一个Document AI Benchmark：

例如：

- OmniDocBench；
- DocLayNet。


完成：

- baseline测试；
- 错误分析。

## 提交成果

```

benchmark-report.md

results.csv

```

## 官方资源

- Hugging Face Evaluate  
https://huggingface.co/docs/evaluate

---

# Week 8：LoRA/PEFT模型微调

## 学习目标

理解参数高效微调。

学习：

- SFT；
- LoRA；
- QLoRA；
- PEFT。

## 任务

完成小规模模型微调实验。

包括：

- 数据准备；
- 参数设置；
- 训练过程。

## 提交成果

```

training-config.yaml

training-report.md

```

## 官方资源

- PEFT Documentation  
https://huggingface.co/docs/peft

- TRL Documentation  
https://huggingface.co/docs/trl

---

# Week 9：W&B实验管理

## 学习目标

建立科研实验记录习惯。

学习：

- Run；
- Metrics；
- Artifact；
- Visualization。

## 任务

使用 W&B 管理一次训练实验。

要求：

比较至少两个实验Run。

分析：

- Loss变化；
- 参数影响；
- 模型效果。

## 提交成果

```

wandb-report.md

W&B Project Link

```

## 官方资源

- Weights & Biases Documentation  
https://docs.wandb.ai/

---

# Week 10：Evaluation与Ablation

## 学习目标

理解科研实验设计。

学习：

- Baseline；
- Ablation；
- Metric；
- Error Analysis。

## 任务

比较：

Baseline

vs

Improved Model


分析：

- 指标变化；
- 原因；
- 局限。

## 提交成果

```

evaluation-report.md

```

---

# Week 11：论文阅读与实验复现

## 学习目标

培养科研阅读能力。

## 任务

选择一篇相关论文。

完成：

1. 方法总结；
2. 核心思想分析；
3. 实验复现；
4. 结果比较。

## 提交成果

```

paper-review.md

reproduction-report.md

```

---

# Week 12：Final Project

## 项目目标

完成一个小型多模态AI研究项目。

推荐方向：

- Document AI；
- VLM；
- OCR；
- AI Agent；
- 行业智能应用。


## 项目流程

```

Problem

↓

Dataset

↓

Baseline

↓

Improvement

↓

Evaluation

↓

Conclusion

```

## 提交成果

```

final-project/

README.md

report.md

results/

```

---

# 五、学生仓库结构

GitHub Classroom生成后：

```

student-bootcamp/

├── README.md

├── learning-log.md

├── environment.yml

├── assignments/

├── experiments/

└── final-project/

```

---

# 六、评价标准

| 能力 | 优秀 | 合格 |
| --- | --- | --- |
| 工程能力 | 能独立运行和复现实验 | 能完成基础实验 |
| AI Coding | 能利用AI提升开发效率 | 能使用AI辅助编码 |
| 模型理解 | 理解模型结构与限制 | 能调用模型 |
| 实验能力 | 能设计Benchmark和分析结果 | 能完成基础评测 |
| 科研能力 | 能阅读论文并复现 | 能总结论文 |
| 表达能力 | 能清晰展示研究过程 | 能完成实验报告 |

---

# 七、训练结束能力

完成12周后，学生应该具备：

## 工程能力

- GitHub科研协作；
- Python AI开发；
- AI辅助编程。

## 模型能力

- Transformer；
- VLM；
- Document AI；
- LoRA微调。

## 科研能力

- Dataset分析；
- Benchmark设计；
- Experiment Tracking；
- Paper Reading；
- Reproduction。

优秀学生可以进一步进入：

- 多模态大模型研究；
- Document AI项目；
- Agent系统研究；
- AI+行业应用研究。


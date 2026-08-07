# 多模态视觉智能学习中心

> **Multimodal Vision AI Learning Center**

[![Documentation](https://img.shields.io/badge/docs-learning%20center-blue)](https://multimodal-vision-ai.github.io/multimodal-document-ai-learning-center/)
[![Deploy MkDocs](https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/actions/workflows/deploy.yml/badge.svg)](https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/actions/workflows/deploy.yml)

由河海大学计算机与软件学院[谭国平教授团队](https://jszy.hhu.edu.cn/tgp/)建设，面向高年级本科生、研究生与实验室新成员。

当前以 **12 周多模态视觉智能自主学习课程**为主线，以文档理解作为训练场，未来继续扩展图像理解、视频理解、多模态推理与智能应用。

课程以中文讲解为主，保留必要的 English terminology；技术细节优先链接官方文档，仓库负责维护学习路径、任务、实验规范和自主学习证据。

## 快速入口

- [在线学习中心](https://multimodal-vision-ai.github.io/multimodal-document-ai-learning-center/)
- [入门课程](docs/learning/README.md)
- [课程总览与每周计划](docs/learning/00_12_Week_Bootcamp.md)
- [自主评估与证据指南](docs/learning/10_Assessment_and_Submission.md)
- [自主学习记录模板](docs/learning/11_Learning_Log_Template.md)

## 课程成果

完成课程后，学生应能：

- 使用 GitHub 管理可复现 AI 实验；
- 使用并验证 AI-assisted coding；
- 调用 VLM 处理真实文档；
- 构建 PDF → Markdown/JSON pipeline；
- 使用 LoRA/PEFT 完成小规模微调；
- 使用 Weights & Biases 追踪、比较和报告实验；
- 设计 baseline、Benchmark、ablation 与 error analysis；
- 完成并答辩一个可复现的 Document AI 项目。

## 内容结构

```text
docs/
├── learning/       # 12 周必修课程与基础模块
├── tutorials/      # 可运行教程与 Notebook 入口
├── experiments/    # 完整科研实验流程
├── reading/        # 论文与研究问题
├── resources/      # 官方资源索引
└── projects/       # 项目展示
```

## 本地预览

项目使用 MkDocs Material。使用仓库已有的文档环境运行：

```bash
mkdocs serve
```

严格检查：

```bash
mkdocs build --strict
```

依赖版本记录在 `requirements-docs.txt`。提交到 `dev` 或创建 PR 后，GitHub Actions 会执行严格构建和链接检查；合并到 `main` 后发布 GitHub Pages。

## 协作流程

1. 从 `dev` 创建工作分支或在约定的 `dev` 实验流程中修改；
2. 只改动任务相关文件；
3. 检查内部链接、官方链接和课程自主检查项；
4. 通过文档质量检查；
5. 发起 `dev → main` PR，review 通过后再发布。

课程内容以学生体验、可复现证据和低维护成本为优先。欢迎通过 [Issues](https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/issues) 报告失效链接或提出改进建议。

## License

代码与课程材料的使用以仓库 [LICENSE](LICENSE) 为准；外部模型、数据集、论文和工具分别遵循其原始许可。

# 官方文档：遇到问题先查这里

官方文档不是要顺序读完的教材。它最适合回答三类问题：**当前版本怎么用、输入输出有什么约束、哪些行为不能想当然。**

## 本周基础任务

### Git 与 GitHub

- [GitHub 中文文档](https://docs.github.com/zh)：查账号、仓库、分支、Pull Request、Pages 和密钥保护。
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)：需要理解 Git 原理或命令行为时查阅。

**完成动作**：能创建仓库、提交变更、查看历史，并说明本地 Git 与远程 GitHub 的区别。

### Python

- [Python 官方教程](https://docs.python.org/zh-cn/3/tutorial/)：查语言语法、数据结构、模块、异常与虚拟环境。

**完成动作**：把当前脚本中的一个报错缩小成最小示例，并在官方文档中找到相关规则。

## 模型与推理

- [Hugging Face Learn](https://huggingface.co/learn)：按任务选择课程，不必全部学习。
- [Transformers 文档](https://huggingface.co/docs/transformers/index)：查模型加载、推理 API、配置与版本行为。
- [Qwen3.5-0.8B Model Card](https://huggingface.co/Qwen/Qwen3.5-0.8B)：本课程项目使用的模型 ID、用法、能力边界与 license。

**重点查看**：示例适用的库版本、输入消息格式、模型 revision、设备和精度设置。

**完成动作**：运行官方最小示例，并把模型 ID、revision、关键配置和原始输出写入实验记录。

## 文档智能与评测

- [Docling 官方文档](https://docling-project.github.io/docling/)：查文档解析能力、支持格式、示例和 API。
- [OmniDocBench 官方仓库](https://github.com/opendatalab/OmniDocBench)：查数据格式、评测配置、指标实现和使用限制。

**完成动作**：用一个公开样例跑通解析或评测入口，并说明输出结构和一个已知限制。

## 在线实验平台

- [Kaggle Learn](https://www.kaggle.com/learn)：按当前技能缺口选择短课程。
- [Kaggle Notebooks](https://www.kaggle.com/code)：运行 GPU Notebook、共享结果并保留版本。

**完成动作**：让另一个账号或匿名访问者能看懂 Notebook 的数据来源、运行顺序和最终结果。

## 查官方文档的顺序

1. 先确认产品、模型或数据的**准确名称**。
2. 查看 quickstart 或 model card，运行未修改的最小示例。
3. 再查 reference、dataset card 或 release notes，确认当前版本差异。
4. 记录官方 URL、访问日期、版本和真正解决的问题。

!!! warning "官方也不等于永远正确"
    官方页面可能更新或存在缺口。课程记录必须保留访问日期和版本；遇到矛盾时，以当前 release、代码仓库和可复现实验共同判断。

链接核对日期：2026-08-07

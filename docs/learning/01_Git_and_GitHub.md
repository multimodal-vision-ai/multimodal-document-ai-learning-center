# Chapter 1：Git 与 GitHub

# Git and GitHub for AI Research

---

# 1. 学习目标

完成本章学习后，你应该能够：

* 理解 Git 与 GitHub 的区别
* 创建并管理 GitHub Repository
* 使用 Git 管理科研代码
* 阅读优秀的 GitHub 开源项目
* 参与实验室项目开发
* 养成规范的代码管理习惯

---

# 2. 什么是 Git？

Git 是目前全球最流行的版本控制工具（Version Control System）。

Git 可以帮助我们：

* 保存代码历史
* 回退错误修改
* 管理多个版本
* 多人协同开发
* 管理论文代码

对于科研来说：

> Git 记录的是科研过程，而不仅仅是代码。

---

# 3. 什么是 GitHub？

GitHub 是目前全球最大的开源代码托管平台。

GitHub 不仅可以管理代码，还可以管理：

* 文档
* 图片
* Notebook
* 项目
* Issue
* Release
* Wiki

目前绝大多数 AI 开源项目均托管在 GitHub。

---

# 4. 为什么科研必须使用 GitHub？

现代 AI 科研几乎离不开 GitHub。

主要原因：

* 阅读开源代码
* 学习优秀项目结构
* 管理自己的科研代码
* 与导师、同学协同开发
* 开源科研成果
* 提高科研影响力

建议每位学生都建立自己的 GitHub 主页。

---

# 5. GitHub 常见概念

学习 GitHub 前，需要理解以下概念。

| 名称           | 说明      |
| ------------ | ------- |
| Repository   | 一个项目    |
| Branch       | 分支      |
| Commit       | 一次修改记录  |
| Clone        | 下载项目    |
| Push         | 上传代码    |
| Pull         | 获取最新代码  |
| Fork         | 复制别人的项目 |
| Issue        | 问题与任务   |
| Pull Request | 合并代码请求  |
| Release      | 项目版本发布  |

这些概念将在后续实践中逐步掌握。

---

# 6. GitHub 页面结构

打开一个 GitHub Repository 后，应重点关注以下内容：

* README
* docs
* src
* examples
* requirements
* LICENSE
* Issues
* Pull Requests

建议首先阅读 README，然后查看目录结构。

---

# 7. 学会阅读 GitHub 项目

阅读一个开源项目时，建议按照以下顺序：

```text
README
    ↓
项目目录
    ↓
安装方法
    ↓
快速运行 Demo
    ↓
examples
    ↓
核心源码
```

不要一开始就阅读全部源码。

---

# 8. 推荐阅读的 GitHub 项目

建议优先阅读以下项目。

## QwenLM

https://github.com/QwenLM

学习内容：

* 大模型推理
* Vision Language Model
* README 编写方式

---

## Docling

https://github.com/docling-project/docling

学习内容：

* Document AI
* 文档解析流程
* Pipeline 设计

---

## Transformers

https://github.com/huggingface/transformers

学习内容：

* 模型加载
* 推理接口
* Processor
* Tokenizer

---

## vLLM

https://github.com/vllm-project/vllm

学习内容：

* 高性能推理
* Batch Inference
* GPU 推理优化

---

# 9. GitHub 在实验室中的使用规范

实验室所有科研项目统一使用 GitHub 管理。

包括：

* 源代码
* Markdown 文档
* Notebook
* 技术文档
* 示例代码

所有正式开发工作均提交至 GitHub。

---

# 10. Git 基本开发流程

实验室统一采用以下开发流程。

```text
Clone Repository

↓

阅读 README

↓

创建开发分支

↓

修改代码

↓

更新文档

↓

Commit

↓

Push

↓

Pull Request

↓

Review

↓

Merge
```

每一次开发都遵循相同流程。

---

# 11. Commit 规范

推荐使用以下格式：

```text
feat: add qwen inference

fix: resolve tokenizer bug

docs: update README

refactor: optimize pipeline

test: add benchmark script
```

每次 Commit 只完成一个明确任务。

---

# 12. 如何学习 GitHub

建议每天坚持：

* 阅读一个优秀 Repository
* 阅读一个 README
* 阅读一个 examples
* 阅读一个 Issue
* 阅读一个 Pull Request

长期坚持，将快速提升科研能力。

---

# 13. 推荐学习资源

## Git 官方

https://git-scm.com/

---

## GitHub 官方

https://docs.github.com/

---

## GitHub Skills

https://skills.github.com/

---

## GitHub Explore

https://github.com/explore

---

# 14. 本章实践

请完成以下任务。

## 任务一

注册 GitHub 账号。

---

## 任务二

完善个人主页。

包括：

* Avatar
* Name
* Bio
* Organization

---

## 任务三

Fork 一个开源项目。

推荐：

QwenLM 或 Docling。

---

## 任务四

Clone 到本地。

---

## 任务五

成功运行项目 README 中提供的第一个 Demo。

---

# 15. 本章总结

完成本章后，你应该已经能够：

* 理解 Git 与 GitHub 的作用
* 阅读优秀开源项目
* 管理自己的科研代码
* 熟悉实验室 GitHub 开发流程

这将成为后续所有课程的基础。

---

# 下一章

下一章学习：

> **Chapter 2：Python 开发环境**

主要内容：

* Python 安装
* Conda 环境管理
* VS Code
* CUDA
* PyTorch
* 开发环境配置

完成后，你将拥有完整的 AI 开发环境。


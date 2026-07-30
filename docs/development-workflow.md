# GitHub 开发流程

本项目采用适合个人 AI Lab 文档项目的轻量 GitHub Flow：`main` 发布、`dev` 开发、短分支改文档、自动检查 MkDocs。

## 分支职责

| 分支 | 用途 | 规则 |
|---|---|---|
| `main` | 正式发布分支，GitHub Pages 从这里发布 | 只接收从 `dev` 合并的发布 PR |
| `dev` | 日常开发分支，Codex 和手动编辑都先合并到这里 | 每次 push/PR 自动构建 MkDocs |
| `docs/*` | 单个文档任务分支 | 从 `dev` 创建，完成后 PR 回 `dev` |
| `fix/*` | 小修复分支 | 从 `dev` 创建，完成后 PR 回 `dev` |

## 推荐工作流

### 1. 开始一个文档任务

```bash
git checkout dev
git pull origin dev
git checkout -b docs/short-topic-name
```

分支命名建议：

- `docs/add-reading-note`
- `docs/update-qwen-tutorial`
- `fix/mkdocs-nav`

### 2. 使用 Codex 修改 Markdown/MkDocs

给 Codex 的任务尽量小而明确，例如：

```text
请更新 docs/reading/03_vlm.md，增加 3 篇 VLM 论文摘要，并在必要时更新 mkdocs.yml 导航。
```

建议一次只做一类修改：

- 新增一篇学习笔记；
- 更新一个教程；
- 修复 MkDocs 导航；
- 整理一个资源列表。

### 3. 本地或自动检查

提交前建议运行：

```bash
mkdocs build --strict
```

GitHub Actions 也会在以下情况自动运行同样的检查：

- 向 `dev` push；
- 创建或更新指向 `dev` / `main` 的 PR；
- 手动触发 `Validate Docs` workflow。

### 4. 合并到 dev

日常修改通过 PR 合并到 `dev`：

```text
docs/* 或 fix/*  →  dev
```

PR 保持小而清晰，便于回滚和复查。

### 5. 发布到 main

当 `dev` 内容稳定后，创建发布 PR：

```text
dev  →  main
```

合并到 `main` 后，`Deploy MkDocs` workflow 会自动构建并发布 GitHub Pages。

## 自动化配置

本项目包含两个 GitHub Actions：

| Workflow | 触发条件 | 作用 |
|---|---|---|
| `Validate Docs` | push 到 `dev`、PR 到 `dev`/`main`、手动触发 | 运行 `mkdocs build --strict` |
| `Deploy MkDocs` | push 到 `main`、手动触发 | 构建并发布 GitHub Pages |

## 个人项目的简化原则

- 不需要复杂的企业审批流；
- 不强制多人 review，但发布到 `main` 前要确认 Actions 通过；
- 文档改动优先小步提交、小 PR；
- `main` 始终代表线上正式版本；
- `dev` 可以接受未发布但已能构建通过的内容。

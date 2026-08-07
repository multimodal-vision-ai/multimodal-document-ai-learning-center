# Git 与 GitHub：可复现科研协作

> **对应课程**：[Week 1](00_12_Week_Bootcamp.md#week-1)<br>
> **目标**：使用 branch → commit → pull request 完成一次可审查的科研改动。

Git 保存项目历史，GitHub 承载协作、审查和证据。课程不要求记住所有命令，但要求每项实验都能追溯到明确的 commit。

## 学习目标

- 区分 repository、working tree、staging area、commit 与 remote；
- 创建分支并编写有意义的 commit；
- 通过 pull request（PR）说明改动、验证和限制；
- 避免提交密钥、隐私数据、模型权重和大型生成文件。

## 官方学习入口

按顺序完成：

1. [Git tutorial](https://git-scm.com/docs/gittutorial)（Git 基本操作）
2. [GitHub Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world)（repository、branch、commit、PR）
3. [About Git](https://docs.github.com/en/get-started/using-git/about-git)（GitHub flow）
4. [Ignoring files](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files)（`.gitignore`）
5. [About secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)（凭据安全）

## 最小工作流

```bash
git status
git switch -c week01-research-workflow

# 编辑 README、代码和测试后
git diff
git add README.md src/ tests/
git diff --staged
git commit -m "add document inspection tool"
git push -u origin week01-research-workflow
```

然后在 GitHub 创建 PR。PR 描述至少包含：

- **What**：改了什么；
- **Why**：为什么需要；
- **How to verify**：如何运行或检查；
- **Limitations**：已知限制或未完成项。

!!! warning "不要默认使用 `git add .`"
    先用 `git status` 和 `git diff` 确认范围，再显式添加文件。科研目录常含数据、模型、token、缓存和本地路径，误提交后很难彻底清除。

## Week 1 必做任务

1. 创建个人课程仓库；
2. 新建 `week01-research-workflow` 分支；
3. 添加 README、环境说明和一个最小 Python 工具；
4. 至少提交两次：第一次实现、第二次改进测试或文档；
5. 推送分支并创建 PR，请同学完成一次 review；
6. 根据 review 修改并记录处理结果。

## 建议仓库结构

```text
student-bootcamp/
├── README.md
├── .gitignore
├── environment.yml          # 或 requirements.txt / pyproject.toml
├── learning-log.md
├── src/
├── tests/
└── week01/
```

数据、模型和输出目录是否提交，应由 `.gitignore` 和项目文档明确说明，而不是依赖个人记忆。

## Commit 与 PR 质量

推荐 commit 信息使用动作开头，并描述结果：

```text
add PDF page counter
test invalid file handling
document reproduction steps
fix empty input crash
```

避免 `update`、`test`、`final`、`fix bug` 等无法说明范围的信息。一个 commit 应聚焦一个可以解释的变化。

## 验收清单

- [ ] `git status` 显示预期文件，无密钥或大文件；
- [ ] 在独立分支完成工作，没有直接修改 `main`；
- [ ] 至少两个内容明确的 commits；
- [ ] PR 描述包含运行/验证方式；
- [ ] 同伴 review 有一条具体反馈及处理记录；
- [ ] README 能让陌生同学找到唯一开始命令；
- [ ] 学生能根据 commit 找回任意一次实验状态。

## 常见问题

### 文件已经被 Git 跟踪，加入 `.gitignore` 为什么无效？

`.gitignore` 只影响未跟踪文件。先确认文件是否应从版本控制移除；不要在不理解影响时执行批量删除命令。

### Push 被拒绝

先阅读错误信息，检查远端分支是否更新、是否有权限以及认证方式。不要通过强制推送覆盖同学的提交。

### 不小心提交了 token

立即在对应平台撤销并轮换 token，然后通知导师。删除当前文件不足以让已泄漏凭据恢复安全。

## 下一步

继续完成[Python 环境](02_Python_Environment.md)，让 PR 中的代码可以在干净环境复现。

最后更新：2026-08-07

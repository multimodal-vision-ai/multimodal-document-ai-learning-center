# Part 2：创建 GitHub 科研项目（Create Your First Research Repository）

---

# 一、本部分学习目标（Learning Objectives）

完成本部分后，你应该能够：

* 创建自己的第一个科研 GitHub 仓库；
* 理解实验室统一的项目命名规范；
* 初始化科研项目；
* 完成 GitHub 与本地电脑的连接；
* 建立今后所有科研项目的基础模板。

完成本部分后，你将得到自己的第一个科研项目仓库。

---

# 二、为什么要先创建 GitHub 项目？（Background）

很多初学者习惯先在本地创建代码，再决定是否上传到 GitHub。

实验室**不推荐**这种方式。

实验室统一采用 **GitHub First（GitHub 优先）** 的开发模式：

```text
科研想法
    │
    ▼
创建 GitHub Repository
    │
    ▼
Clone 到本地
    │
    ▼
开始开发
```

这样做有以下优势：

* 项目从第一天开始就有版本管理；
* 所有实验记录都有历史可追溯；
* 导师可以随时查看项目进展；
* 多人协作更加方便；
* 后续论文代码整理更加容易。

**因此，实验室所有科研项目均从 GitHub 开始。**

---

# 三、项目命名规范（Project Naming Convention）

项目名称应尽量简洁、准确，并能反映研究内容。

本实验统一使用以下名称：

```text
qwen3vl-first-project
```

如果后续开展新的实验，可参考以下命名方式：

```text
qwen3vl-ocr

qwen3vl-docvqa

qwen3vl-layout

qwen3vl-benchmark

smoldocling-first-project
```

**命名建议：**

* 全部使用英文；
* 全部小写；
* 使用短横线（-）分隔单词；
* 不使用中文、空格或特殊符号。

---

# 四、创建 GitHub Repository（Operations）

## Step 1：登录 GitHub

打开浏览器，访问：

https://github.com

登录自己的 GitHub 账号。

---

## Step 2：创建新的 Repository

登录成功后：

点击页面右上角 **"+"** 按钮。

选择：

```text
New repository
```

进入创建页面。

---

## Step 3：填写 Repository 信息

请按照下表填写：

| 项目                | 建议填写内容                                |
| ----------------- | ------------------------------------- |
| Repository name   | qwen3vl-first-project                 |
| Description       | My first Document AI research project |
| Visibility        | Public（推荐）                            |
| Add a README file | √ 勾选                                  |
| Add .gitignore    | Python                                |
| License           | MIT License                           |

填写完成后，点击：

```text
Create repository
```

---

## Step 4：观察创建结果

创建成功后，你应该能够看到如下内容：

```text
qwen3vl-first-project/

README.md

.gitignore

LICENSE
```

如果能够正常打开 README 页面，说明 Repository 创建成功。

---

# 五、Clone 到本地（Operations）

## Step 1：复制仓库地址

点击绿色按钮：

```text
Code
```

复制 HTTPS 或 SSH 地址。

例如：

```text
https://github.com/yourname/qwen3vl-first-project.git
```

---

## Step 2：打开终端

Windows 推荐：

* Git Bash
* PowerShell
* Windows Terminal

进入你准备存放科研项目的位置。

例如：

```text
D:\Research\
```

---

## Step 3：执行 Clone

输入：

```bash
git clone https://github.com/yourname/qwen3vl-first-project.git
```

执行完成后，将生成项目目录。

---

## Step 4：进入项目目录

执行：

```bash
cd qwen3vl-first-project
```

此时，你已经进入自己的科研项目目录。

---

# 六、验证项目（Expected Results）

执行以下命令：

```bash
git status
```

如果看到类似输出：

```text
On branch main

nothing to commit, working tree clean
```

说明 Git 仓库配置正常，可以开始后续开发。

---

# 七、常见问题（Common Errors）

## 问题一：无法登录 GitHub

请检查：

* 网络连接；
* GitHub 账号是否正确；
* 是否启用了双因素认证。

---

## 问题二：Clone 失败

可能原因：

* 仓库地址错误；
* 没有访问权限；
* Git 未正确安装。

建议重新复制仓库地址，并确认 Git 已安装。

---

## 问题三：Permission denied

如果使用 SSH，请确认：

* SSH Key 已生成；
* 公钥已添加到 GitHub；
* SSH 配置正确。

如果尚未配置 SSH，可暂时使用 HTTPS。

---

## 问题四：Repository 名称填写错误

不要删除仓库重新创建。

可在 GitHub 的：

```text
Settings

↓

Repository name
```

中直接修改名称。

---

# 八、本部分成果（Deliverables）

完成本部分后，你应该拥有以下内容：

```text
GitHub Repository

↓

README.md

↓

.gitignore

↓

LICENSE

↓

本地项目目录
```

项目已经成功建立。

---

# 九、导师检查（Supervisor Checklist）

请导师逐项检查：

| 检查项             | 状态 |
| --------------- | -- |
| Repository 创建成功 | □  |
| README 已生成      | □  |
| .gitignore 已生成  | □  |
| LICENSE 已生成     | □  |
| 项目已 Clone 到本地   | □  |
| git status 正常   | □  |

所有项目完成后，方可进入下一部分。

---

# 十、本部分小结

恭喜你！

至此，你已经完成了实验室第一个科研项目的创建。

虽然目前项目中还没有任何代码，但已经建立了符合实验室规范的 GitHub 仓库，并成功连接到本地开发环境。

从这一刻开始，你的所有代码、实验记录和文档都将在这个项目中统一管理。

---

# 下一部分预告

**Part 3：构建标准科研项目目录（Build a Standard Research Project Structure）**

下一部分将指导你：

* 创建实验室统一的项目目录；
* 理解每个目录的用途；
* 编写第一版 README；
* 创建实验记录文件；
* 建立规范的科研项目框架。

完成 Part 3 后，你将拥有一个可以立即开展 Document AI 实验的标准科研项目。

---

# 第一阶段目标

最终希望形成：

```text
GitHub
│
├── Personal Account
│      apple75
│
└── Organization
       Multimodal Vision AI Lab
```

以后所有实验室资源都属于 **Organization**。

你的个人账号：

> 只负责拥有（Owner）身份。

---

# 第二步：创建 Organization

登录 GitHub

右上角头像

↓

Your organizations

↓

New organization

或者直接进入：

**[GitHub Organizations 创建页面](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository?utm_source=chatgpt.com)**

---

填写建议如下：

## Organization Name

建议：

```text
MultimodalVisionAI
```

或者

```text
MVAILab
```

如果能申请到：

```text
multimodal-vision-ai
```

最好。

以后网址就是：

```text
https://github.com/MultimodalVisionAI
```

---

## Display Name

建议：

```text
Multimodal Vision AI Lab
```

---

## Contact Email

填写学校邮箱：

```text
xxxxx@hhu.edu.cn
```

---

## Plan

选择：

```text
GitHub Free
```

以后如果实验室需要更多权限，再升级即可。

---

# 第三步：创建 Team（团队）

Organization 建好以后，

建议立即建立 Team。

例如：

```text
Owners
```

权限：

```text
Owner
```

目前只有你。

---

然后建立：

```text
Faculty
```

以后：

导师。

---

然后：

```text
PhD
```

博士。

---

然后：

```text
Master
```

硕士。

---

然后：

```text
Undergraduate
```

本科。

---

以后增加学生，

只需要加入 Team。

不要直接加入 Repository。

GitHub 官方推荐通过 **Team** 管理仓库权限，而不是逐个仓库配置个人权限。([GitHub Docs][2])

---

# 第四步：迁移 Learning Center

现在你的仓库：

```text
apple75

└── multimodal-document-ai-learning-center
```

以后：

```text
MultimodalVisionAI

└── multimodal-document-ai-learning-center
```

迁移方法：

Repository

↓

Settings

↓

Danger Zone

↓

Transfer ownership

↓

New owner：

选择：

```text
MultimodalVisionAI
```

确认即可。GitHub 会保留仓库内容、Issue、Release 等，并自动重定向原仓库地址，但建议之后更新本地 Git 远程地址。([GitHub Docs][1])

---

# 第五步：权限设计（建议一次设计好）

## ① Learning Center

Repository：

```text
learning-document-ai
```

建议：

```text
Visibility

Public
```

Team 权限：

| Team          | 权限       |
| ------------- | -------- |
| Owners        | Admin    |
| Faculty       | Maintain |
| PhD           | Write    |
| Master        | Write    |
| Undergraduate | Read     |

---

## ② Medical AI（未来）

```text
learning-medical-ai
```

同样：

```text
Public
```

---

## ③ Foundation Models

```text
learning-foundation-models
```

```text
Public
```

---

## ④ Awesome Resources

```text
awesome-multimodal-vision-ai
```

```text
Public
```

---

## ⑤ Benchmark

```text
benchmarks
```

```text
Public
```

---

## ⑥ Models

```text
models
```

```text
Public
```

---

## ⑦ Datasets

建议：

```text
Private
```

以后公开的数据：

再建立：

```text
public-datasets
```

---

## ⑧ Research Projects

```text
research-projects
```

建议：

```text
Private
```

---

## ⑨ Lab Docs

```text
lab-docs
```

建议：

```text
Private
```

---

# 第六步：最终权限规划

| Repository                   | Visibility | Purpose              |
| ---------------------------- | ---------- | -------------------- |
| learning-document-ai         | 🌍 Public  | Document AI 学习中心     |
| learning-medical-ai          | 🌍 Public  | Medical AI 学习中心      |
| learning-foundation-models   | 🌍 Public  | Foundation Models    |
| awesome-multimodal-vision-ai | 🌍 Public  | 学习资源导航               |
| benchmarks                   | 🌍 Public  | Benchmark 与 Baseline |
| models                       | 🌍 Public  | 模型发布                 |
| datasets                     | 🔒 Private | 内部数据集                |
| research-projects            | 🔒 Private | 科研项目                 |
| lab-docs                     | 🔒 Private | 实验室内部知识库             |

---

# 第七步：以后学生加入流程

例如：

张三（硕士）

↓

Invite Member

↓

加入：

```text
Master Team
```

自动获得：

```text
Write

learning-document-ai

learning-medical-ai
```

但：

```text
datasets

research-projects

lab-docs
```

仍然不能访问。

以后博士加入：

加入：

```text
PhD Team
```

即可。

整个实验室权限管理会非常简单。

---

## 我建议的实施顺序

不要一次创建所有仓库，而是按下面顺序进行：

1. ✅ 创建 **Multimodal Vision AI Lab Organization**
2. ✅ 将 `multimodal-document-ai-learning-center` 迁移到 Organization
3. ✅ 建立 `Owners`、`Faculty`、`PhD`、`Master`、`Undergraduate` 五个 Team
4. ✅ 配置 Learning Center 仓库权限
5. ✅ 后续再逐步创建 `learning-medical-ai`、`lab-docs`、`research-projects` 等仓库

这样既保持了当前工作的连续性，又为实验室未来几年扩展打下了稳定的基础。

[1]: https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository?utm_source=chatgpt.com "Transferring a repository - GitHub Docs"
[2]: https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization?utm_source=chatgpt.com "Repository roles for an organization - GitHub Docs"

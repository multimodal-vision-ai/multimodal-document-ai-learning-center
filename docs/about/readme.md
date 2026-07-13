---

# 推荐权限体系（适合高校实验室）

建议只建立下面 5 个 Team：

```text
Multimodal Vision AI Lab
│
├── Owners
├── Faculty
├── PhD
├── Master
└── Undergraduate
```

以后增加学生，只需要加入对应 Team。

---

# 第一步：创建 Team

进入你的 Organization：

```
Multimodal Vision AI Lab
```

左侧：

```
Teams
```

↓

点击：

```
New Team
```

依次创建：

```
Owners
Faculty
PhD
Master
Undergraduate
```

建议 Team 设置：

| Team          | Privacy |
| ------------- | ------- |
| Owners        | Secret  |
| Faculty       | Closed  |
| PhD           | Closed  |
| Master        | Closed  |
| Undergraduate | Closed  |

> `Secret` 只有组织 Owner 能看到，适合管理团队；`Closed` 是实验室成员可见、可申请加入的普通团队。([GitHub Docs][2])

---

# 第二步：邀请成员

例如：

```
Team

↓

Members

↓

Add member
```

输入 GitHub 用户名即可。

例如：

```
Owners

GuopingTan
```

以后：

```
Master

张三
李四
王五
```

---

# 第三步：Repository 权限配置

例如：

```
learning-document-ai
```

进入：

```
Repository

↓

Settings

↓

Collaborators and teams

↓

Add Teams
```

GitHub 会让你选择：

```
Owners

Faculty

PhD

Master

Undergraduate
```

选择之后，

再设置 Role。

---

# Role 有哪些？

GitHub 官方定义如下：

| Role     | 能力                          | 推荐对象               |                    |
| -------- | --------------------------- | ------------------ | ------------------ |
| Read     | 只能查看、Clone、提交 Issue         | 学习者                |                    |
| Triage   | 可管理 Issue/Discussion，但不能改代码 | 助教、课程管理员           |                    |
| Write    | 可 Push、提交 PR、修改代码           | 博士、硕士              |                    |
| Maintain | 可管理仓库（不含危险操作）               | 导师、项目负责人           |                    |
| Admin    | 完全控制（删除仓库、修改权限等）            | Organization Owner | ([GitHub Docs][1]) |

---

# 推荐配置（Learning Center）

例如：

```
learning-document-ai
```

建议：

| Team          | Repository Role |
| ------------- | --------------- |
| Owners        | Admin           |
| Faculty       | Maintain        |
| PhD           | Write           |
| Master        | Write           |
| Undergraduate | Read            |

这样：

本科：

```
只能学习
```

硕士：

```
可以提交教程

可以修改文档

可以上传 Notebook
```

博士：

```
可以维护课程

Review PR

修改代码
```

导师：

```
维护仓库

Merge PR

修改 Branch

配置 Actions
```

只有你：

```
Admin
```

可以：

```
删除仓库

修改权限

Transfer

Security
```

---

# Private 仓库如何设置？

例如：

```
lab-docs
```

建议：

| Team          | Repository Role |
| ------------- | --------------- |
| Owners        | Admin           |
| Faculty       | Maintain        |
| PhD           | Write           |
| Master        | Read            |
| Undergraduate | 无权限（不添加）        |

这样：

本科甚至看不到这个仓库。

---

# 再例如：

```
research-projects
```

建议：

| Team          | Role         |
| ------------- | ------------ |
| Owners        | Admin        |
| Faculty       | Maintain     |
| PhD           | Write        |
| Master        | Write（仅参与项目） |
| Undergraduate | Read（按需）     |

---

# Organization 的 Base Permission（非常重要）

很多实验室容易忽略这一点。

进入：

```
Organization

↓

Settings

↓

Member privileges

↓

Base permissions
```

**建议设置为：**

```
No permission
```

不要设置成：

```
Read
```

否则以后所有加入 Organization 的成员都会自动看到所有允许基础权限访问的仓库，违背最小权限原则。GitHub 官方支持将基础权限设置为 `No permission`，然后通过 Team 精确授权。([GitHub Docs][1])

---

# 推荐最终权限矩阵

| Repository                 | Owners |  Faculty |  PhD  |   Master   | Undergraduate |
| -------------------------- | :----: | :------: | :---: | :--------: | :-----------: |
| learning-document-ai       |  Admin | Maintain | Write |    Write   |      Read     |
| learning-medical-ai        |  Admin | Maintain | Write |    Write   |      Read     |
| learning-foundation-models |  Admin | Maintain | Write |    Write   |      Read     |
| awesome-resources          |  Admin | Maintain | Write |    Write   |      Read     |
| benchmarks                 |  Admin | Maintain | Write |    Write   |      Read     |
| datasets（Private）          |  Admin | Maintain | Write |    Read    |       无       |
| research-projects（Private） |  Admin | Maintain | Write | Write（按项目） |       无       |
| lab-docs（Private）          |  Admin | Maintain | Write |    Read    |       无       |

---

## 我对你实验室还有一个建议

**不要给学生 `Admin` 权限。**

即使是博士生，也建议最多授予 **Write**；如果以后有负责维护某个仓库的博士，可以单独将该仓库提升为 **Maintain**。这样既方便协作，又能避免误删仓库、误改权限或修改安全配置等高风险操作。**整个 Organization 中长期保持只有你（以及未来如有联合负责人）拥有 `Owner/Admin` 权限，是最稳妥的管理方式。**

[1]: https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization?utm_source=chatgpt.com "Repository roles for an organization - GitHub Docs"
[2]: https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/managing-team-access-to-an-organization-repository?apiVersion=2022-11-28&utm_source=chatgpt.com "Managing team access to an organization repository - GitHub Docs"

# 学习资源：优先官方，按任务查找

本区是课程的资源索引，不是一份需要从头读完的书单。遇到版本、API、数据许可或工具选择问题时，先定位对应类别，再回到官方页面确认最新信息。

[查找官方文档与平台](official-sources.md){ .md-button .md-button--primary }
[查看推荐课程](courses.md){ .md-button }

## 按需求选择

| 我现在需要什么 | 入口 | 使用建议 |
| --- | --- | --- |
| 模型、框架或平台的最新用法 | [官方文档与平台](official-sources.md) | 优先查看官方 quickstart、reference 和 release note |
| 系统课程或教材 | [推荐课程](courses.md) | 只选择与当前周任务直接相关的章节 |
| 代表性论文与技术报告 | [论文索引](papers.md) | 与[论文导读](../reading/README.md)配合使用 |
| 可公开使用的数据和 Benchmark | [数据集索引](datasets.md) | 先核对 license、数据卡、划分与评价脚本 |
| 开发、实验追踪与文档工具 | [工具清单](tools.md) | 说明选择理由，不因“流行”盲目增加工具 |

## 课程中的使用顺序

```text
先明确本周任务
        ↓
在资源索引中找到官方入口
        ↓
阅读当前版本的 quickstart / model card / dataset card
        ↓
运行最小示例并固定 revision
        ↓
保存来源、配置、结果与限制
```

## 资源选择标准

### Official First

模型和框架优先引用维护方官网、官方 GitHub、官方文档或官方 Hugging Face 组织；论文优先引用出版页或 arXiv 原文；数据优先引用数据集主页和 dataset card。

### Task Fit

资源必须回答当前任务中的具体问题。一个链接如果既没有学习目标，也没有使用时机，即使内容优秀，也不应堆到课程主线中。

### Maintainable

站内只保留必要的选择理由、学习顺序和验收要求。容易随版本变化的安装命令、API 参数和模型列表交给官方页面维护。

### Responsible Use

使用模型、数据和平台前检查 license、隐私、访问权限和地域/账户限制。不要把“可以下载”理解为“可以任意公开或商用”。

## 给学生的记录模板

```markdown
- Resource：
- Official URL：
- Access date：
- Version / revision：
- 用它解决什么问题：
- 采用了哪些设置：
- 已知限制：
```

## 链接失效怎么办

先在同一官方域名或官方组织中寻找新地址，再提交 issue/PR 更新链接。不要用来源不明的转载页替换官方材料，也不要为了让自动检查通过而忽略所有 401/403 响应。

最后更新：2026-08-07

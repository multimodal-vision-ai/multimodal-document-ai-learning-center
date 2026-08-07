# AI 辅助编程：生成只是开始，验证才算完成

> **对应课程**：[Week 3｜AI-assisted Coding](00_12_Week_Bootcamp.md#week-3) · **建议投入**：2–3 小时 · **最终产出**：可测试的代码、Prompt 记录与人工审查

AI coding assistant 可以帮助解释代码、生成草稿、补充测试和发现边界条件，但不能替你确认需求、数据授权、安全性与结论。课程采用同一个闭环：

```text
Define → Ask → Inspect → Test → Disclose
定义任务   请求建议   人工审查   运行验证   披露使用
```

## 学习目标

完成本页后，你应能：

- 把模糊需求改写成有验收标准的小任务；
- 只提供完成任务所需的最少上下文，不泄露隐私和密钥；
- 审查 AI 生成代码的正确性、安全性、依赖与边界条件；
- 用测试和真实样例验证建议，而不是凭语气判断；
- 在学习记录中准确披露 AI 做了什么、你验证了什么。

## Step 1｜先写任务卡，再打开 AI 工具

```markdown
## Task Card
- 目标：
- 当前行为：
- 期望行为：
- 输入与输出示例：
- 必须满足的约束：
- 不允许修改的范围：
- 验收标准：
- 已知失败案例：
```

任务卡中必须出现可以检查的动词，例如“对不存在的文件返回非零退出码”，而不是“让代码更健壮”。

## Step 2｜提供最小、可验证的上下文

一个有效请求通常包含：

1. **Context**：代码做什么、运行环境和相关接口；
2. **Task**：本轮只解决哪一个问题；
3. **Constraints**：允许的依赖、兼容性和禁止事项；
4. **Evidence**：已有报错、输入输出和测试；
5. **Acceptance criteria**：怎样判定完成。

示例：

```text
请审查下面的 Python CLI 函数。目标是让不存在的输入文件返回退出码 2，
并保留现有成功路径。不要增加第三方依赖，也不要修改输出文件格式。
先列出风险和测试用例，再给最小补丁。验收标准：3 个正常测试、
2 个异常测试全部通过，--help 行为不变。
```

!!! danger "不能提供给外部 AI 的内容"
    API key、密码、私人文档、未公开论文、受限数据、真实用户信息，以及你无权分享的代码。必要时使用最小复现、合成数据和脱敏片段。

## Step 3｜把 AI 输出当作待审查的 Pull Request

逐项检查：

| 维度 | 要问的问题 | 验证方法 |
| --- | --- | --- |
| 需求 | 是否解决了任务卡中的目标？ | 对照 acceptance criteria |
| 正确性 | 正常、空输入、坏输入分别怎样？ | 单元测试与真实样例 |
| 范围 | 是否偷偷重构了无关代码？ | 查看 diff |
| 安全 | 是否记录密钥、执行不可信输入或绕过校验？ | 人工审查与安全测试 |
| 依赖 | 是否引入多余或来源不明的包？ | 检查依赖文件和官方文档 |
| 可维护性 | 命名、错误信息和接口是否清晰？ | 同伴 review |
| 许可 | 生成内容是否明显复制了不兼容代码？ | 追问来源并人工核查 |

当 AI 无法说明假设或来源时，不应把“看起来合理”当作证据。

## Step 4｜建立验证矩阵

Week 3 至少完成下面五类测试：

| Case | 输入 | 预期结果 | 实际结果 | 证据 |
| --- | --- | --- | --- | --- |
| normal-01 | 正常文件 | 成功并输出摘要 | 待填写 | 测试日志 |
| normal-02 | 第二种合法格式 | 成功 | 待填写 | 测试日志 |
| normal-03 | 边界但合法的输入 | 成功或明确提示 | 待填写 | 测试日志 |
| error-01 | 文件不存在 | 非零退出码和清晰错误 | 待填写 | 测试日志 |
| error-02 | 不支持的格式 | 安全失败，不产生坏输出 | 待填写 | 测试日志 |

推荐从标准库 `unittest` 开始：

```bash
python -m unittest discover -v
```

测试失败时先记录现象和假设，再请 AI 协助缩小范围。不要反复要求“修好它”并盲目接受整段重写。

## Step 5｜记录关键决策

`prompt-log.md` 不需要保存所有聊天内容，只保留影响代码和结论的关键回合：

```markdown
## Interaction 01
- 任务：
- 提供给 AI 的必要上下文：
- AI 的核心建议：
- 我接受、修改或拒绝了什么：
- 验证方式与结果：
- 仍未解决的风险：
```

最终 README 中增加一段 AI 使用披露：工具名称、使用环节、人工修改、测试证据与剩余限制。

## Week 3 必做实践

1. 选择 Week 1 的小工具，先写 Task Card；
2. 使用任一 AI coding assistant 完成参数校验、错误处理和测试改进；
3. 保留至少 3 轮关键交互，至少拒绝或修改一项不合适建议；
4. 运行 3 个正常测试和 2 个异常测试；
5. 请同学只看 README 与测试结果，检查是否能解释最终改动。

## 提交物

- `task-card.md`：需求、约束和验收标准；
- `prompt-log.md`：关键建议、人工判断与验证；
- `code-review.md`：正确性、安全性、依赖和限制；
- `tests/` 与测试输出；
- README 中的 AI 使用披露。

!!! success "完成判定 / Definition of Done"
    学生能解释最终 diff；测试覆盖正常与异常路径；至少一项 AI 建议被有理由地修改或拒绝；任何结论都不只依赖 AI 自我评价。

## 官方学习入口

- [GitHub Copilot documentation](https://docs.github.com/en/copilot)（EN）
- [Responsible use of GitHub Copilot](https://docs.github.com/en/copilot/responsible-use)（EN）
- [GitHub pull request reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests)（EN）
- [Python unittest](https://docs.python.org/3/library/unittest.html)（EN）

## 下一步

完成验证闭环后，进入[Week 4｜Vision-Language Models](00_12_Week_Bootcamp.md#week-4)。继续使用 AI 时沿用同一记录方式，不向工具上传课程中的私人文档或密钥。

最后更新：2026-08-07

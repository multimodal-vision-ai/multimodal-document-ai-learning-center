# Notebook 07 — 教师参考答案

## Research Checkpoint：Overall 分数掩盖了什么

参考要点：

1. 用自己跑出的分组表举例：例如 note（手写）或 exam_paper 得分低于 book；
   若只报平均分，这些子群退化不可见。
2. 困难子集（table_hard 等）与普通页面的差距通常更大——官方设计困难子集正是为了暴露这一点。
3. 对研究问题的意义：选择「提升最弱子群」作为下一步假设，比「整体提分」更具体、可检验。

评分关注：结论是否回到 `results/benchmark/` 里的实际数字，并明确区分官方指标与 smoke 自检。

## Exercise 参考

1. 以锁定 commit 的官方 README 为准填写命令模板（`omnidocbench_eval.md2md_cmd_template`），
   重跑 Step 3；官方输出 JSON 路径写入实验日志与 `experiment_metadata.json`。
2. 最低分 3 页：对照 prediction MD 与 GT 文本，先粗分类（OCR 错字/表格结构/阅读顺序/缺失内容），
   详细 taxonomy 在 Notebook 08 建立。
3. 填表前提：同一评测 commit、同一 prompt、同一 generation config、同一测试页面集合；
   训练模型只能换权重，其余变量冻结。

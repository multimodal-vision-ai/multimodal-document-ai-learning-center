# Notebook 08 — 教师参考答案

## Research Checkpoint：模型到底不会什么

评分要点：

1. 必须引用 taxonomy 统计（哪 1–2 类占主导）与至少 2 个具体案例的 evidence；
2. 区分「模型错误」与「转换/评测对齐错误」，人工复核后的结论才算数；
3. 说明平均分掩盖了这类分布——同分数可以对应完全不同的失败模式。

## Exercise 参考

1. 复核时逐一核对 prediction 的 doctags/markdown 与 GT 文本/表格/公式：
   例如 GT 表格存在而预测缺失 → 模型 table_error；GT 文本出现而预测改字 → OCR。
2. 按 document_type 分组统计 error_types 频次，找显著偏高的子群（如 note 手写页
   OCR 错误更多），并回到页面属性解释。
3. 新启发式示例：统计 GT 表格数与预测 `<table>` 数的差 → 记 table_count_mismatch；
   用人工标注的 20 条案例评估其准确率。


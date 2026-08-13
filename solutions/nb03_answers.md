# Notebook 03 — 教师参考答案

## Research Checkpoint：Prompt 如何成为实验变量

参考要点：

1. 同一页面、同一模型，只改变 prompt，输出可能差异明显（例如 v2 强调表格/公式
   时结构标记更完整，v1 更关注文字）；
2. 因此 prompt 与数据、采样一样必须固定并记录 prompt_id，否则无法归因；
3. 实验设计里 prompt 是独立变量时，其余变量全部冻结（唯一变量原则）。

## Exercise 参考

1. 找同一 image_id 的两个预测，diff 看 `<table>`/`<formula>`/`<loc_*>` 等标记出现
   位置与顺序差异，结合 prompt 措辞解释。
2. v4 建议只改一个维度（如更明确的输出格式要求），加入 PROMPTS 字典并重跑
   prompt_benchmark。
3. 换 prompt 后分数变化可能来自 prompt 而非模型权重；要证明「模型变强」需要
   固定 prompt 只改权重（Notebook 05/06 的训练前后对比）。


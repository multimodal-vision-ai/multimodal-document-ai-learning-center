# Notebook 02 — 教师参考答案

## Research Checkpoint：为什么不能拿 Benchmark test 训练后报成绩

参考要点：

1. **Data leakage**：模型见过测试页面的内容与格式，学到的不是解析能力而是
   记忆；评测分数不再反映泛化。
2. **指标高估**：测试集上分数虚高，换到新文档立即回落；论文审稿人会要求
   数据划分证据。
3. **复现性**：不隔离划分，别人无法复现「同样数据」的训练与评测，结论不可检验。

官方 OmniDocBench 没有 SFT train split 这一事实必须写进报告；
教学子集只用于学习流程，标记 NOT for official claims。

## Exercise 参考

1. `val_ids & train_ids == 空集`；再验证两者都 ⊆ v1.5 页面。
2. 表格难点：GT 的 table 是 LaTeX+HTML，而 DocTags 用 `<table>`/OTSL 表达；
   保守方案：先只转换表格 caption/脚注为 text，表格本体列为 skipped 并在
   报告中标明（当前 page_to_doctags 即如此），后续再研究结构对齐。
3. 分层抽样按文档类型轮转，N 变化时分布大致均衡；记录各类型数量即可。


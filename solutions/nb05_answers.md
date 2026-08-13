# Notebook 05 — 教师参考答案

## Research Checkpoint：Loss 下降 = 解析变好？

参考要点（至少两个反例）：

1. 过拟合：训练样本被记忆，train loss 下降而新页面变差；
2. 格式投机：模型学会输出「像 DocTags 的文本」但内容错误/幻觉，loss 仍低；
3. 标签噪声：派生 GT（近似转换）本身有误差，loss 拟合的是噪声目标。

结论：loss 是训练健康度信号；任务性能必须回到固定 test set + 官方评测 +
错误分析（Notebook 07/08）。

## Exercise 参考

1. 观察 train/val loss 是否分叉（过拟合信号）；记录步数与耗时。
2. 同页对比：注意 CPU 上限制 max_new_tokens；重点看结构标记与幻觉变化，
   并记录这是「单页观察」，不是结论。
3. 不做 mask：loss 会同时监督 prompt 部分，模型可能学会复制指令或对
   prompt 内容过度拟合，稀释目标监督信号。


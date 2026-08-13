# Notebook 09 — 教师参考答案

## Research Checkpoint：变量与 diminishing returns

评分要点：

1. 每个问题都对应一条曲线或一行 CSV，不能用「感觉」回答；
2. Text 通常对数据量敏感、对 rank 不敏感；Table/Formula 对结构监督与分辨率更敏感；
3. 算力增加但提升趋平的曲线就是 diminishing returns，这是停止加预算的依据。

## Exercise 参考

1. Ablation B 至少两个取值 + 官方评测；固定 prompt/seed/评测页面；
2. Ablation C 记录 VRAM/time/val loss 并与 parameter_report 对照：r 增大参数线性
   增长，性能提升通常边际递减；
3. SmolDocling processor 支持多种输入尺寸（以官方 processor_config 为准）；分辨率
   提高有利于小字/表格/公式，但 token 与推理成本上升，需在成本—收益间取值。


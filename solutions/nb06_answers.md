# Notebook 06 — 教师参考答案

## Research Checkpoint：LoRA 为什么是权衡而不是开关

参考要点：

1. 参数侧：r 增大→可训练参数线性增长，训练更慢、显存更高（今天打印的参数报告
   就是证据）；
2. 能力侧：低秩假设不一定适配所有任务，r 太小可能欠拟合（需要实验验证）；
3. 前提：比较 r 必须固定数据、步数、lr、评测（唯一变量），否则差异无法归因；
   且最终结论要回到官方评测与错误分析。

## Exercise 参考

1. GPU 上同数据同 steps 跑 r=4/8/16，记录 VRAM/time/val loss，再用 Notebook 07
   官方评测；观察是否存在 diminishing returns。
2. 只留 q_proj/v_proj 会减少可训练参数，可能限制对注意力投影的表达能力；
   对 Idefics3 这类模型，常见选择是 q/k/v/o 四类投影。
3. lora_alpha/r 是缩放因子：alpha=r 时缩放为 1，alpha=2r 时增量放大 2 倍；
   改变它等效于改变 adapter 的有效学习率。

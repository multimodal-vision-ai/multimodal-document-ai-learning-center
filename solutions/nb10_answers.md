# Notebook 10 — 教师参考答案

## Research Checkpoint：为什么 LLM 凭空出题不是科研

评分要点：

1. 凭空题目没有 Observation 出处，无法回到 results/ 重建证据；
2. 缺少可证伪命题、变量、baseline、指标与风险，无法设计检验实验；
3. 基于证据的 Canvas 每一步都可被他人复核——可检验性是科学与话术的分界。

## Exercise 参考

1. 反向假设示例：不改进表格解析，而是训练「不确定性估计」来标记低置信表格；
   同样走完整 Canvas。
2. 最小可行实验：如 25 样本、r=8、2 个 GPU 会话、主指标为官方 Table 指标，
   停止条件=连续两档数据量无提升。
3. 互审清单：每个 Observation 能定位到 benchmark/error_cases 的具体文件与条目；
   proposal 的变量/指标/baseline 是否与执行命令一一对应。

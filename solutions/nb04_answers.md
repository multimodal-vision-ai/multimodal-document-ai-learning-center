# Notebook 04 — 教师参考答案

## Research Checkpoint：baseline 为什么必须固定

参考要点：

1. Baseline 是「归因锚点」：SFT 前后对比只有在数据、prompt、采样全部固定时，
   分数差才能归因于训练本身。
2. 若中途换 prompt 或采样，差异里混入两个变量，无法判断是训练还是 prompt 带来的。
3. 复现要求：别人重跑 baseline 应得到一致结果（贪心解码 + 固定 seed + 固定 revision）。

评分关注：是否说出「一次只改变一个变量」的对照逻辑，而不只是「为了公平」。

## Exercise 参考

1. teaching 模式 100 页：先记录 fast 模式单页 mean_latency，估算 100/1651 页总时长；
   超过会话预算时，用缓存分多次运行（skip_existing=True 保证断点续跑）。
2. v1 强调 OCR 文本，输出通常更注重文字完整；结构标记可能略少。这是 Notebook 03
   系统比较的内容，本练习只做粗观察。
3. do_sample=true 引入随机性：同一页两次输出可能不同，latency 也略高；
   报告分数前必须改回 false（或固定 seed 并说明）。

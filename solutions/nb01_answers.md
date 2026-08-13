# Notebook 01 — 教师参考答案

## Research Checkpoint：为什么 Benchmark 不是一个数字

参考要点：

1. **分布层面**：10 类文档、5 类语言、5 类版面。一个平均分会把「书页上的正文识别」
   与「试卷上的公式+手写」混为一谈；平均分不变时，各子群可能此消彼长。
2. **困难子集层面**：296 页（equation_hard/layout_hard/table_hard）与普通 v1.5 页面难度
   显著不同。只报 Overall 无法暴露「表格困难页全面退化」这类系统性弱点。
3. **属性层面**：watermark、fuzzy_scan、colorful_backgroud 等页面属性说明同一类型内
   难度也不均匀，切片分析是发现模型盲区的必要条件。

评分关注：是否用 Notebook 里实际跑出的分布数字举例，而不是抽象地说“分数会掩盖差异”。

## Exercise 参考

1. 例如 exam_paper：可统计其 language/layout 分布，并用 special_issue 找出手写、水印、
   模糊页面；找出后人工浏览确认「难在哪里」。
2. 期望发现 equation_hard 页面公式数量显著高于普通页面（平均公式数可用
   `stats` 思路按 subset 分组统计），说明官方按公式难度分层。
3. `assert len({data.sample_id(p) for p in annotations}) == len(annotations)` ——
   官方 image_path（UUID）唯一。


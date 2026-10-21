# Research Radar 科研雷达

该模块附属于现有 MkDocs 学习中心，**不创建额外的顶级网站栏目**。

- `data/candidates.json`：公开来源自动发现的候选条目，未经人工核验，不代表正式推荐。
- `data/projects.json`：已审阅的结构化项目记录；只有 `review=approved` 的条目进入网站及预警。
- `data/tasks.json`：带 `research-radar` 标签的 GitHub Issues 只读快照。
- `schema/research-item.schema.json`：正式研究项目的字段约束。
- `config/scoring.json`：科研评分权重及每日预警上限。
- `config/sources.json`：公开数据源配置。

## 本地或 Actions 使用

```bash
python scripts/radar/collect.py
python scripts/radar/sync_tasks.py
python scripts/radar/render.py
python -m unittest discover -s tests/radar -v
mkdocs build --strict
```

可用 `python scripts/radar/ingest.py --input path/to/reviewed.json` 导入经人工核验的条目（列表或单条记录）。只有 `review=approved` 且完成必需字段及证据校验才会公开展示。

- **无需付费API**即可运行发现采集流程，但它只产生候选，不能保证论文质量和开源真实性。
- OpenReview公开搜索接口可能限流或不可用；机构官网须逐个添加官方RSS/Atom。单个源失败只会记录警告，不得发布伪造信息。
- ChatGPT计划任务与GitHub Actions互不自动同步；将其内容导入需要另行提供结构化JSON或连接API。
- 自动采集会在独立的 `radar-data` 分支保存数据；站点构建从该分支读取，源码和课程内容继续走 `dev → main` PR审核。
- 不要将令牌、未公开选题、个人信息或授权受限数据写入公开仓库。

## 评分与证据

总分由6项0–10的人工可审核指标加权计算，不由缺失字段猜测。论文发表时间、模型或代码更新、采集时间分开存储；训练与显存等数据标明核验来源。

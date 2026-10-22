# Research Radar — 科研雷达

这是多模态视觉AI学习中心的首页模块和三个子页面，并非新的一级导航栏。

## 数据和审核

- data/candidates.json：从公开数据源自动发现的候选信息（全部pending，不代表高价值推荐）。
- data/projects.json：研究人员核验后批准的项目；只有approved记录进入网站。
- data/tasks.json：带research-radar标签的公开GitHub Issues快照。
- data/daily、data/weekly、data/monthly：按24小时、7天、30天窗口生成的结构化科研摘要，同时保存已审核项目与规则初筛候选，供网站和外部消费端使用。
- schema/research-item.schema.json：项目字段约束。
- config/sources.json：官方公开API来源和机构RSS/Atom清单。
- config/scoring.json：评分配置和预警上限。

**严禁把模型自动筛选结果冒充人工核实的科研结论。** Approved项目必须包含审核人员reviewed_by、审核时间reviewed_at、原始证据evidence_urls、创新点innovation、研究机会research_opportunity，以及六项独立评分score_dimensions和加权总分score。代码核实分数是否一致，不会自行给某篇论文编造分数。

论文发布时间published_at与重大更新significant_update_at必须单独记录，只有实际有证据的重要更新才能设置后者。未知权重、GPU需求和微调支持需要明确写为未知；T4可以加载不代表训练已复现。

## 使用

在仓库工作目录（Python 3.11+）：

    python scripts/radar/collect.py
    python scripts/radar/sync_tasks.py
    python scripts/radar/reports.py
    python scripts/radar/render.py
    python -m unittest discover -s tests/radar -v

人工审核并将JSON存入项目库：

    python scripts/radar/ingest.py --input reviewed.json

发布前可用：

    pip install -r requirements-docs.txt
    mkdocs build --strict

采集器不要求付费模型API。来源包括arXiv Atom、GitHub REST、Hugging Face Hub、OpenReview API2公开搜索。机构官网只支持配置中显式填写的官方RSS/Atom源，默认空列表，不代表对所有机构官网进行了覆盖。部分官方服务可能限流或不可用，失败必须如实记录。

仅对arXiv/OpenReview完全一致的规范化论文标题做有限合并，保留来源链接。模型仓库和GitHub项目名不能直接当作相同论文，无依据不进行自动合并。

## 远程部署

科研代码继续走 feature分支 → dev PR → main审核发布。数据单独储存在radar-data分支。每日采集Actions从main读取最新版脚本，从radar-data读取历史数据，更新后仅向radar-data提交数据；独立发布Actions渲染网站。原有main部署流程保留。默认分支正式包含工作流之前，定时任务不会生效。

GitHub Actions运行时由GitHub提供GITHUB_TOKEN，源码不保存密钥。公开仓库不应存放未发表研究、隐私数据和商业机密。

GitHub Issues只用于已立项科研任务，不会因为自动发现论文而主动创建Issue。ChatGPT的既有定时提醒也不会天然与GitHub Actions同步，需要经核验的结构化数据导入。

## 限制

日报、周报和月报同时保存已审核成果与规则初筛候选：已审核成果用于正式科研推荐；候选部分按来源、主题关键词和时间窗口计算透明的主题匹配度，不能冒充科研质量评分。首页直接展示近期相关候选，避免要求访客逐条翻查原始采集结果。报告仍是可追溯的结构化汇总，而非人工撰写的长篇学术综述。要形成可对外公开的科研结论，必须由研究人员检查论文、开源仓库和可复现证据。

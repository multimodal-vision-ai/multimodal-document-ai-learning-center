# MVAI 日常行为标准测试样例库 V1.0（研究预览版）

## 一、定位

面向 Learning Center 视频行为识别与分析实验平台，形成可复现的日常动作测试基准，用于 MoViNet、VideoMAE、VideoMamba 及实验室自研模型的对比。**当前版本是标准化索引和技术可读性验证，并非已完成逐视频人工核验、且可直接公开再分发的 120 段平衡视频集。**

## 二、已完成工作（2026-11-01）

- 在独立 `data/daily-action-benchmark-v1` 分支建立数据目录，不修改 main/dev/正式页面/HF Space。
- 索引 GMDCSA-24 V2.1 的 **160 段来源文件**（4 名受试者，81 ADL、79 Fall）；视频 ID 均来自真实源站目录。
- 从 8 个官方 CSV 表中解析 **356 条动作区间**。保留原始标签和文字；发现 3 处异常，单独记录，不擅自补全；其中一条逆序时间范围在 events.csv 标记为 invalid_interval。
- 选择 **38 个首批候选**，并创建逐项复核任务表。电话相关 3 条“打电话”、7 条“使用手机”来自**原始场景描述**，并非有精确起止时间的标准动作标签。
- GitHub Actions 对首批 **14 段真实 MP4** 完成临时下载、SHA256、FFprobe 和抽帧解码，全部通过。所有原始视频仅在 Runner 临时目录中处理，**没有上传仓库、Artifact 或 HF Space**。
- 建立统一中英文行为类别、数据质量与许可状态字段、原始溯源、人物分组、动作区间和多模型评测协议。

## 三、可以直接使用的文件

| 文件 | 用途 |
|---|---|
| [clips.csv](manifests/clips.csv) | 160 视频基础档案：源路径、受试者、场景描述、原标注、候选标签、视频大小、来源链接及再分发状态 |
| [events.csv](manifests/events.csv) | 356 条动作区间：起止时间、原始类别、标准类别及质量状态 |
| [pilot_candidates.csv](manifests/pilot_candidates.csv) | 38 个首批测试候选 |
| [review_queue.csv](manifests/review_queue.csv) | 38 个待逐帧复核任务；记录可见性、遮挡、动作起止、审核人、许可证 |
| [label_schema.json](label_schema.json) | 标准行为与中英文标签映射、证据级别和类别边界 |
| [reports/media_probe_latest.json](reports/media_probe_latest.json) | 14 个实际视频的技术检查、SHA256、分辨率、编码及实际时长 |
| [reports/import_warnings.json](reports/import_warnings.json) | 原始 CSV 标注错误（3 条） |
| [tools/validate.py](tools/validate.py) | 清单一致性、来源链接、ID、动作区间与许可状态校验 |
| [tools/probe.py](tools/probe.py) | 可重复的视频下载与解码检查，不再分发原视频 |
| [tools/score_predictions.py](tools/score_predictions.py) | 按事件 ID 评测不同模型；未经人工审核不得作为正式准确率 |

## 四、任务分类与当前样本真实缺口

原始 CSV 中按动作区间统计、且各类可重叠：摔倒 77、睡觉 15、吃东西 7、行走 57、喝水 12 个视频；电话通话候选 3、使用手机候选 7 个。它们并不满足“六类各 15、再增加 30 条混淆样本”的 120 段平衡目标。必须从 Mora-ADL、Indoor Action 等第二来源补充，且先核验授权与具体视频标签；不能通过重复片段、错用标签或无依据推断凑数。

## 五、正式评测前必须解决的事项

1. 为每个正式样例确认：原始视频 SHA256、真实时长、时序片段、参与者分组、许可、人像发布权限。
2. 复核手机相关的画面证据；“手机贴耳通话”“持有/操作手机”“正在看手机”不能混为一类。
3. 区分“躺着/仰卧”与“睡觉”，区分“坐下/躺下”与“摔倒”，保留模糊样例。
4. 固定数据集版本、评测片段及模型类别映射；统计覆盖率和支持类别内的 Top-K 结果，不把模型不支持类别记作普通误分类。
5. 没有合法再分发依据时，以源站引用/本地测试方式使用，不能直接镜像视频到公开网页。

## 六、参考资源

- [GMDCSA-24 V2.1](https://doi.org/10.5281/zenodo.13354453)
- [Mora-ADL](https://github.com/RivinduM/Mora-ADL)
- [Indoor Action Dataset](https://zenodo.org/records/14551902)
- [GitHub Actions 实测记录](https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/actions/runs/41254547263)

这是一套**真实可追溯、质量状态透明**的第一版数据基础设施。未经人工抽样验收之前，不以“120 段已完成”“100% 标签准确”或“公开视频库已上线”等说法对外宣传。

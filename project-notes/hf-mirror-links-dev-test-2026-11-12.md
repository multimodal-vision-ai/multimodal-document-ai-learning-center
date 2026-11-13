# 中国大陆 Hugging Face 镜像链接 · DEV 试用验收

- 基线：2026-11-12 的 dev 分支
- 分支：feat/hf-mirror-links-test-20261112
- 范围：MkDocs 正文中的公开 Hugging Face 模型仓库与数据集首页；视觉感知三款 Space 的模型资源镜像入口
- 实现：在原模型/数据集链接后，增添小型「国内镜像」链接；原官方链接不变
- 镜像： https://hf-mirror.com （第三方公益服务；可用性不受本项目保证）
- 三款视觉演示新增国内资源外链（经 2026-11-13 人工验收反馈后调整）：YOLO26 → HF-Mirror Ultralytics/YOLO26（用户确认可访问）；D-FINE → AI快站上的 ustc-community 组织模型列表（需进入后选择 dfine-nano-coco）；SAM 2 → ModelScope 魔搭的 AI-ModelScope/sam2-hiera-small-hf（**SAM 2 原版 Small，不是 SAM 2.1 Small；仅作为相关模型资源入口**）。**以上均不提供原 Gradio Space 在线推理。**
- 不涉及：Hugging Face Spaces 的运行地址与内嵌 iframe、static.hf.space、WebGPU 运行时、模型分片下载、CDN、视频分析逻辑
- 回退：移除 extra_javascript、extra_css 新增的两个条目以及对应两个静态文件

## 人工验收清单

1. 打开「学习资源 / 官方文档与平台」以及「项目 01 / Part 04 准备实验数据」：模型和数据集旁应出现「国内镜像」小标签。
2. 点击「国内镜像」，应在新标签打开 hf-mirror.com 的对应模型/数据集页面；打不开时仍能点击原官方链接。
3. 打开「入门课程 / Hugging Face Hub」：官方工具文档、官方 Learn、登录等链接不应变成镜像。
4. 打开「模型演示 / 文档理解」：原 Hugging Face Spaces 演示与 iframe 应保持原有行为。
5. 打开「成果展厅」：DocTags 与视频行为识别在线体验入口仍为原地址；原推理流程未改。
6. 打开「前沿动态」：若页面中有 HF 模型或数据集链接，应显示镜像标签；搜索、高亮、展开等功能应保持正常。
7. 打开「模型演示 / 视觉感知」，依次选择 YOLO26、D-FINE、SAM 2：确认多了「国内镜像」文字链接，原按钮、原「在新标签页打开」、内嵌演示及 URL 未改变；点镜像只打开模型资源页，非在线演示。
8. 确认导航切换后标签只出现一次，暗色/亮色主题下清晰，移动设备上不遮挡文本。

## 自动化检查

运行：node tests/hf-mirror-links.test.cjs

包含视觉感知三款模型资源 URL 的静态合约检查，但不代表中国大陆网络连通性、对应仓库内容或 Gradio 在线服务已实测通过。

## 2026-11-13 D-FINE / SAM 2 链接修订

用户报告原 HF-Mirror 两个具体模型页无法打开。HF-Mirror 会根据访问者 IP 地域跳转，单靠链接路径正确不能保证能访问。原两个链接更换为搜索引擎已收录的国内站点资源页；D-FINE 为组织列表而非直接模型详情；SAM 2 为旧版权重，不能作为 2.1 checkpoint 的等价镜像。本轮自动 CI 只保证网站构建和静态 URL 配置，必须由国内网络人工确认目标链接实际可达。原 Hugging Face Space 与 iframe 均不受影响。

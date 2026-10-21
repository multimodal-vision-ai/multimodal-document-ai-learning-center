# 固定 DEV 预览

## 独立访问地址

**DEV 测试网站（主链接）：**

https://cdn.jsdelivr.net/gh/multimodal-vision-ai/multimodal-document-ai-learning-center@dev-preview/index.html

**备用链接（第三方预览代理）：**

https://raw.githack.com/multimodal-vision-ai/multimodal-document-ai-learning-center/dev-preview/index.html

每次在 dev 分支提交改动后，GitHub Actions 自动构建 MkDocs，提交到单独的 dev-preview 分支。主分支 main、现有 GitHub Pages 的正式部署环境和正式网站地址均不受改动。

技术说明：
- 执行环境：GitHub Actions 托管的 Ubuntu；用户不需要下载仓库。
- 只读加载 radar-data 数据分支，以便查看当前科研雷达信息。
- MkDocs 的 DEV 预览采用 --no-directory-urls，保证直接访问原始静态文件的各个 HTML 页面。
- 每页加入明显的“DEV 预览版”提示，不与正式页面混淆。
- Pull Request 只会生成测试构建 artifact，不部署预览。合并至 dev 且 CI 完成后才会发布。
- 仅 dev-preview 分支包含编译后的静态文件；该分支不作为当前仓库 GitHub Pages 发布源。
- 预览主链接使用 JSDelivr 的 GitHub CDN，并在每次部署后尝试清理首页和科研雷达页面的 CDN 缓存，再通过 GitHub Actions 检查首页、科研动态页和 CSS 是否可访问。raw.githack.com 保留为备用链接。两者都是第三方服务，没有正式 SLA；如主链接短暂不可用，可使用备用链接或稍后重试。请勿把 DEV 预览当作正式生产网站。
- 所有 DEV 预览页面都公开，不能放入未发布论文、学生隐私或内部商业材料。

GitHub Actions 记录：https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/actions/workflows/dev-preview.yml

GitHub 已有正式网站仍为：

https://multimodal-vision-ai.github.io/multimodal-document-ai-learning-center/

**将来若需要完全由 GitHub Pages 承载的独立预览站点，应单独创建公开预览仓库并启用该仓库的 Pages。** 当前连接器未提供创建新仓库及修改 Pages Settings 的接口，因此不采用会覆盖正式站点的部署方案。


## 真实科研线索的 DEV 联调

- 仅在 **push 到 dev** 时调用公开的 arXiv/GitHub/Hugging Face/OpenReview 源；PR 构建依然完全离线。
- 页面“科研动态 → 自动发现线索（未审核）”展示最近检索命中，附最后采集时间与来源计数，不会自动列入研究推荐。
- DEV 预览构建完成并通过公开 URL 验证后，自动将候选记录、Issue 快照、采集状态和日/周/月报告保存到 `radar-data` 分支。
- 如所有启用来源都失败，构建退出并保留上一个成功的 DEV 预览和历史数据，不伪造更新。
- 当前工作流在 `dev` 有新的提交后运行；**不代表每天自动运行**。每天的定时正式采集需代码审核合并到默认分支 `main` 后才会启动。

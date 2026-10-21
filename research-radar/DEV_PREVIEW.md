# 固定 DEV 预览

## 独立访问地址

**DEV 测试网站：**

https://raw.githack.com/multimodal-vision-ai/multimodal-document-ai-learning-center/dev-preview/index.html

每次在 dev 分支提交改动后，GitHub Actions 自动构建 MkDocs，提交到单独的 dev-preview 分支。主分支 main、现有 GitHub Pages 的正式部署环境和正式网站地址均不受改动。

技术说明：
- 执行环境：GitHub Actions 托管的 Ubuntu；用户不需要下载仓库。
- 只读加载 radar-data 数据分支，以便查看当前科研雷达信息。
- MkDocs 的 DEV 预览采用 --no-directory-urls，保证直接访问原始静态文件的各个 HTML 页面。
- 每页加入明显的“DEV 预览版”提示，不与正式页面混淆。
- Pull Request 只会生成测试构建 artifact，不部署预览。合并至 dev 且 CI 完成后才会发布。
- 仅 dev-preview 分支包含编译后的静态文件；该分支不作为当前仓库 GitHub Pages 发布源。
- 预览依赖第三方 raw.githack.com 的开发模式。首次打开 HTML 可能显示安全确认，需根据其说明确认；公开免费服务没有正式SLA，缓存更新可能延迟数分钟。请勿把它用作正式生产网站。
- 所有 DEV 预览页面都公开，不能放入未发布论文、学生隐私或内部商业材料。

GitHub Actions 记录：https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/actions/workflows/dev-preview.yml

GitHub 已有正式网站仍为：

https://multimodal-vision-ai.github.io/multimodal-document-ai-learning-center/

**将来若需要完全由 GitHub Pages 承载的独立预览站点，应单独创建公开预览仓库并启用该仓库的 Pages。** 当前连接器未提供创建新仓库及修改 Pages Settings 的接口，因此不采用会覆盖正式站点的部署方案。

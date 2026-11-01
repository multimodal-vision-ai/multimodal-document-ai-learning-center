# MVAI 视频行为识别 V1.0.3 — 独立 DEV 实验

## 实际实现状态（2026-11-01）

- ✅ GitHub 独立开发分支；未修改 dev/main 或 DocTags。
- ✅ 五区浏览器 UI、本地 MP4/WebM、HF catalog 版本校验/失败提示、原始标签位置、模型版权说明。
- ✅ 15,131,688 bytes 文件与 SHA-256 校验；LiteRT.js 2.5.3 WASM CPU 加载及运行时检测代码。
- 🟡 47 输入 metadata API 适配、28 输出 Streaming、Chrome 实际运行与 Python 数值一致性：需等待 CI 运行证据；不将代码存在当作验证通过。
- ⛔ HF Org Dataset 尚未通过本次会话创建：catalog 会显示真实失败说明，不展示假视频或假分数。

### 开发分支测试入口

https://raw.githack.com/multimodal-vision-ai/multimodal-document-ai-learning-center/feat/video-action-v103/docs/assets/projects/video-action/browser-inference/index.html

此地址依赖 raw.githack 对开发分支源码提供访问，**尚未从真实浏览器验通**。使用固定 SHA 预览时需替换路径中的分支名。

### 核验步骤

1. 在 Chrome/Edge 打开页面，确认 UI 和本地文件选取。
2. 点击「验证 WASM 加载」：必须能读取真实 Hugging Face 公开模型并匹配 SHA，运行时需报告 47 路输入元数据。
3. 在本地视频上点击「执行真实推理」；期望 600 logits、Top-5、耗时、跨视频状态重置。无实测成功之前禁止合并。
4. GitHub Actions 工作流 `Video Action V1.0.3 Browser Probe (DEV only)` 留存 Chromium 浏览器加载报告及截图。
5. HF Dataset 组织仓库创建并添加已确权 1–2 段素材后更新已 pin 的 catalog；不得以本分支的空样例作为上线完成。

### HF Dataset 契约

`multimodal-vision-ai/mvai-daily-action-demo` 预期含 `catalog/v1.json`、`demo/metadata.jsonl` 和已获公开再分发权的视频文件。只接受 `schema_version=1.0`、40 字符 commit SHA、明确 `approved_demo` 和 `redistribution_approved=true` 的条目。前端从 HF 动态加载，不能用虚构数据填充。

### 技术限制

LiteRT.js 需要确认其模型 metadata API 与 47 路形状；实现中的状态缓存依照 Python 参考实现迁移，须通过浏览器日志、复现性和数值对照才可解锁验收。模型在手机行为上的原始 Top-1 不稳定，分数不能解释为校准概率。取消为逐帧协作取消，不能中断正在进行的同步 WASM 运算。

# 部署到 Hugging Face Organization

目标 Space 建议名称：multimodal-vision-ai/mvai-doctags-sample

## 一次性部署（管理员或拥有组织写权限的成员）
1. 登录 Hugging Face，创建新 Space：Owner 选择 multimodal-vision-ai，Name 填 mvai-doctags-sample，SDK 选择 **Static HTML**，设为 Public。
2. 将本目录的 README.md、index.html、assets/cover.webp 上传至该 Space 仓库。
3. 等待 Space 构建完成，打开 Space 页面确认阶段切换、放大及滑块对照功能。若当前组织无法创建，请由组织管理员核对写权限。
4. 从运行中的 Space 页面「Embed this Space」复制实际 iframe URL，替换 Learning Center 本地 iframe 的 src，再完成 DEV 人工审核。

切记：不要把 Hugging Face Access Token、密钥或敏感私有文档上传到公开仓库。本 Space 只回放已有样例，并不包含文档解析推理服务。

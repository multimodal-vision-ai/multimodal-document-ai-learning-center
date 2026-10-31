# MVAI Learning Center｜成果展厅续聊交接文档

> 整理日期：2026-10-31（北京时间）。此文件用于在新的 ChatGPT 会话中继续开发成果展厅。以仓库的最新 dev 代码、GitHub Actions 与 HF Space 实际状态为准；已确认的设计决策应予保留。

## 1. 项目定位与协作方式

- 仓库：[multimodal-document-ai-learning-center](https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center)
- 正式网站（main）：<https://multimodal-vision-ai.github.io/multimodal-document-ai-learning-center/projects/>
- 最新 DEV 展厅：<https://raw.githack.com/multimodal-vision-ai/multimodal-document-ai-learning-center/dev-preview/projects/index.html>
- HF Organization：<https://huggingface.co/multimodal-vision-ai>
- 用户是总体设计与最后审核老师；三名学生分别负责**数据集**、**模型训练**、**评测与分析**。
- 固定流程：提出方案 → 实际 GitHub DEV 改造 → 可访问预览 → 教师人工审核 → 经批准合并 dev；**未经明确授权不得发布 main**。让协作者执行的人工操作要少而清晰，其他代码、检查、合并尽量由助手完成。优先延续现有架构与已确认结果，不能为增加新功能破坏旧功能。

## 2. 成果展厅的长期版式决策

1. 与 Learning Center 首页保持一致的导航、字号、色彩与清爽布局，首页从“实验室成果和研究能力”展开，不要默认以学生 Capstone 为主。
2. 研究项目在桌面端一行三列：**文档理解 / 视觉理解 / 类脑智能**。文档理解描述：“解析复杂文档中的文字/印章/签名/捺印/表格/版面等结构化信息。”视觉理解描述：“图像/视频等内容的理解、分析与推理。”第三类脑智能保留。
3. “科研成果”已改为“研究进展”，“文档智能”→“文档理解”，“类脑自适应智能”→“类脑智能”；“更多成果入口”→“更多展示”；“自研模型体验”→“自研模型展示”；“成果展厅·实验室研究能力”→“模型展示”。
4. 自研模型展示首批两项**上下排列的大幅封面**：① 文档结构化解析模型（DocTags，**不是笼统 OCR**）；② 视频行为识别模型（打电话、玩手机、吃东西等）。视频方向未来可扩充数据与演示。
5. 原有三张文档案例素材（诉状图片、位置框标注图、DocTags 原始输出）用于封面与样例交互。须保留素材展示能力。
6. 鼓励创作的紫蓝色“把好奇心做成可验证作品”大封面归入学生作品及提交指南，不能占据默认自研模型展示。
7. “更多展示 / 学生作品与提交指南”继续存在；**底部山水画作及山水五境切换、全屏功能必须保持**。

## 3. DocTags 浏览器演示 V1.3 → V1.7.3 确认结果

### 3.1 首屏（最新版 V1.7.3）

- 页面标题固定为：**实时文档结构化解析-DocTags**
- 英文副标签：`MVAI LEARNING CENTER · DOCUMENT AI · MULTI-MODEL LAB`。
- 原先主标题下长段解释**默认不显示**。标题旁 `ⓘ` 支持悬停、点击、键盘聚焦，说明这是可扩展的**多模型文档结构化解析、结果可视化及对比平台**；当前内置的是 IBM 公开基线，未来经适配与验证才接入自研模型，不能把整个平台说成 IBM 模型演示。
- 顶部 `01 文档输入` / `02 WebGPU 推理` 桌面端**等宽、同高、顶端和底部对齐**；移动端自适应单列；缩短状态文案，首次大文件下载提示仍需明确显示。技术细节用可访问的 info 提示或折叠区展示。
- 模型管理、自定义公开 ONNX 模型登记、本地缓存管理、备用操作默认折叠，常规界面突出选图、选模型、加载、推理、查看结果。

### 3.2 演示工作台

- **01 文档输入**：合成无敏感信息样例、本地单页 PNG/JPG/WebP 上传（有大小限制）、原图预览、标注 PNG 导出。
- **02 WebGPU 推理**：设备检测，模型选择、`fp32` / `q4` 精度、主动下载并加载、推理、DocTags 下载。推理成功状态区显示**模型大小（参数量）**与**本次推理时长**；内置 IBM Granite Docling 是 **258M 参数**，自定义模型没有可信值则“未提供”；时长不是首次下载/初始化耗时。失败要明确显示原因，不得伪造成功输出。
- **03 推理结果对照**：左右并排“原始文档 / 根据真实 DocTags 重建的结构化结果”，渲染标题、段落、OTSL 表格与阅读顺序；左侧带位置框。右侧悬停/聚焦可高亮原图区域；可切换位置框、按比例同步滚动。重建是结构化阅读视图，不是原 PDF 的逐像素复制；复杂合并单元格须提示准确性边界。
- **04 DocTags 原始输出与技术诊断**：默认折叠，保留真实原始标签和下载能力。
- **05 多模型结果对比**：默认折叠，A/B 显示同一输入图经不同模型依次推理或同一模型不同精度的两组真实输出；**可选“按比例同步滚动”双向联动**，默认关闭，避免事件反馈循环。按相同比例不表示段落语义一一对应。上传新图/刷新后比对记录清除。

### 3.3 模型及缓存技术边界

- 浏览器方案采用 **HF Static Space** + Transformers.js 3.7.5 + ONNX/WebGPU，无需 HF 托管 GPU 费用或访客账号。页面主流程通过浏览器硬件算力运行。
- 当前真实内置的是 **IBM Granite Docling 258M 公开基线**：<https://huggingface.co/onnx-community/granite-docling-258M-ONNX>；**并非实验室自研 checkpoint**。切勿将其推理结果冒称自研效果。
- 自定义公开 HF ONNX 仓库 ID 可以登记和选择，但**只是登记，不代表加载或兼容成功**。需要 DocTags 的 processor、prompt、ONNX 权重、输入输出协议匹配；其他模型结构需要单独开发适配器。
- 采用浏览器 Cache Storage (`env.useBrowserCache=true`) 尽可能缓存下载的模型文件；浏览器随时可能清理、无痕模式通常不持久、不同站点域名缓存不共享。**刷新页面后 GPU 模型仍需重新初始化**。切换模型尝试 `dispose()` 旧实例以节省 GPU 显存；不是把多个模型永久留在 GPU。
- 模型注册 ID/名称可保存在 localStorage；**上传文档与推理结果仅当前页面内存**，换图/刷新即清空。
- 首次模型下载可能 >1GB，应告知访问者；不支持 WebGPU 时提供免登录静态解析样例和个人 Kaggle 免费 GPU 入口。Kaggle 需要访问者自己的账号，其 Notebook 上线与实测状态应单独核验。

## 4. HF Organization 部署与 GitHub 发布

- HF Organization：<https://huggingface.co/multimodal-vision-ai>
- 已创建并运行的公开 Static Space：<https://huggingface.co/spaces/multimodal-vision-ai/mvai-doctags-webgpu>
- **真实运行主页（非常重要）**：<https://multimodal-vision-ai-mvai-doctags-webgpu.static.hf.space/>；必须使用 `.static.hf.space`，普通 `.hf.space` 曾返回 404。
- HF Space 使用 `sdk: static`，首页 `index.html`；当前公开网页状态经 HF API 核验 `RUNNING` 且 HTTP 200。真实 WebGPU 推理与跨域 iframe 的浏览器兼容性仍需人工验收。
- 已由用户配置 `HF_TOKEN` 为 GitHub Actions Secret，**不要索取或泄漏 Token**。
- GitHub 源目录：`hf-spaces/mvai-doctags-webgpu/`，四文件：`README.md`、`index.html`、`doctags-renderer.js`、`model-registry.js`。
- 自动发布 workflow：`.github/workflows/publish-hf-doctags.yml`；监测 dev 下相关文件变更，校验后发布至 HF，缺少凭据时安全跳过。
- HF 发布工作流：<https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/actions/runs/41156500933>，**success**；DEV 预览工作流 <https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/actions/runs/41156500935>，**success**。
- 成果展厅 DEV 的文档模型卡片新增“打开 HF 实时推理｜免登录”外部链接及“在本页体验 HF 实时推理”可折叠嵌入。保留原有静态真实样例 iframe 和 Kaggle 备用链接。跨域 iframe 的 WebGPU 权限及缓存行为可能受浏览器策略影响，独立打开 Space 为首选入口。

## 5. GitHub 当前发布事实（2026-10-31 核实）

- PR #56：成果展厅从 V1.3 到 V1.7.3 的 DocTags 交互演示，**已合并 dev**。<https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/pull/56>
- PR #57：HF Static Space 自动发布工作流，**已合并 dev**。<https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/pull/57>
- PR #58：成果展厅接入 HF 外部链接 + 按需 iframe，修复静态域名，**已合并 dev**。<https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/pull/58>
- `dev` HEAD：`51cfdbd34ce85ac284fae13babf4f99b1c90ba58`；`main` HEAD：`451e8132c86292dd43f0ba04e6d7db64b5b8ffd3`（为本交接文档创建前所核实的状态；创建交接记录后 dev 提交号会更新）。
- **最新功能和 HF 集成只在 dev 及 HF 公开 Space，尚未合并 main 正式站点**。
- 固定 DEV 展厅入口：<https://raw.githack.com/multimodal-vision-ai/multimodal-document-ai-learning-center/dev-preview/projects/index.html>。

## 6. 已完成验收与尚存边界

**通过：** GitHub 文档质量/JavaScript 语法、DocTags/OTSL 解析 fixture、模型注册及滚动百分比测试、MkDocs strict 构建、DEV 构建发布；HF GitHub 文件同步，HF API RUNNING/公开主页 HTTP 200，DEV 展厅中 HF 入口及旧内容静态核验。

**不能误称已完成：** 在真实学生设备和 HF 静态域名下的 WebGPU 实际推理、不同 GPU 的首次下载/缓存复用性能、HF iframe 中的 WebGPU、复杂中文法律文档的准确率、表格/印章/签名的真实评测、多个真实自研模型接入及 A/B 能力评估。自动测试不等于真机模型验收。

## 7. 后续最优先任务

1. **HF 实机人工验收：** Windows 桌面 Chrome/Edge，打开 HF Space，用无隐私合成图运行加载与推理，检查 DocTags、重建渲染、耗时、浏览器缓存；再测试成果展厅 iframe。如 iframe 不能使用 WebGPU，应引导直接打开 HF。
2. **整合新自研模型：** 学生提供脱敏示例、训练/推理代码、模型权重、ONNX 转换或架构适配说明；先独立 HF Space 或隔离试验验证，再加入统一模型列表，不硬编码假模型数据。
3. **多模型规范化评测：** 同一数据集/硬件条件，记录结构块识别、文本准确率、表格重建、印章/签名、耗时与设备内存，明确模型版本、来源、局限。
4. **继续精简与扩展成果展厅：** 保留导航、学生作品与底部山水画；按教师审核意见分版本在 dev 上迭代。
5. **main 发布单独审批：** 在老师确认功能与效果后才准备最终正式发布，不能自动把 dev 推送 main。

## 8. 新聊天建议开场文本

> 请读取 GitHub 仓库 `multimodal-vision-ai/multimodal-document-ai-learning-center` 中的 `project-notes/showcase-handoff-2026-10-31.md`，将其作为“成果展厅”后续开发的项目交接基础。首先核查 dev、main、HF Static Space 和最新 PR 状态；保留全部已确认设计和正常功能，不要误将 IBM 公共基线称为自研权重。我们继续在 dev 开发，提交真实可访问 DEV 页面给我审核，未经我同意不要修改 main。

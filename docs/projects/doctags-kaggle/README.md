---
hide:
  - toc
---

# Kaggle 免费 GPU｜亲自运行 DocTags

!!! info "先看效果，再做真实推理"
    **样例体验**无需登录，可随时查看既有解析结果；**Kaggle 推理**需要个人 Kaggle 账号及账号可使用的免费 GPU。两者互不依赖，不需要实验室提供推理服务器。

[免登录查看 DocTags 交互样例](../../assets/projects/doctags/interactive-demo/index.html){ .md-button .md-button--primary }

## 1. Kaggle 运行流程

1. **下载实验 Notebook**：[MVAI DocTags Kaggle 推理试点（.ipynb）](../../assets/notebooks/mvai_doctags_kaggle_pilot.ipynb)。
2. 打开 [Kaggle Notebooks](https://www.kaggle.com/notebooks/welcome)，登录自己的账号。进入新 Notebook，使用 **File → Import Notebook** 导入刚下载的 `.ipynb`；不同界面的入口名称可能略有差异。
3. 在 Notebook 的 **Settings → Accelerator** 选择当前可用的 GPU（例如 T4 或 P100）。首次使用可能需要完成 Kaggle 账号验证。在允许的情况下开启 Internet，以下载公开权重。
4. 点击 **Run All**。Notebook 默认生成无个人信息的合成文档，然后用公开 DocTags 基线模型进行**真实 GPU 推理**。
5. 到 Notebook 的 **Output** 中下载 `input_page.png`、`result.dt`、`run_metadata.json`；如果转换成功，还会有 `result.md`。运行结束后停止 GPU 会话。

!!! warning "试点使用公开技术基线，而非实验室自研权重"
    当前 Notebook 默认模型是 [IBM Granite Docling 258M](https://huggingface.co/ibm-granite/granite-docling-258M)，用于先验证 Kaggle 路线在免费 GPU 上能否运行。它由 IBM Research 发布，**不能把其输出宣称为实验室自研模型成果**。实验室模型的 checkpoint、processor、推理脚本经确认后再替换。

## 2. 你可以做什么

- **首次运行**：不需要下载额外数据，使用 Notebook 自动生成的无个人信息模拟报告。
- **输入自己的图片或 PDF**：使用 Kaggle **Add Input** 添加已授权/已脱敏文件，把 Notebook 的 `INPUT_PATH` 改成对应路径。
- **结果核验**：比较输入页面与 `result.dt` 中的标题、文本、表格标签，记录错误。中文解析能力仍需单独验证。

## 3. 试点验收

| 检查项 | 达标要求 |
|---|---|
| GPU 启动 | 能看到 GPU 型号和显存容量 |
| 公开模型加载 | 能成功载入 Granite Docling 258M |
| 真实推理 | 产生非空的 `result.dt` |
| 结果记录 | 保存 `run_metadata.json`，含模型与耗时 |
| 实验边界 | 不混称自研模型、不上传敏感数据 |

如果 GPU 不可用、下载失败或内存不足，**不应显示虚构解析结果**。可以继续使用[无需登录的样例体验](../../assets/projects/doctags/interactive-demo/index.html)。

## 4. 实验室发布下一步

老师/学生先在个人 Kaggle 账号内完成一次测试，保存 Notebook 并通过 Kaggle 的共享选项发布**不含私密输入数据**的版本。把审核后的 Kaggle Notebook URL 提供给学习中心后，站点会把“下载导入 Notebook”的入口替换为该链接，学生即可 **Copy & Edit → 启用自己的 GPU → Run All**。

参考：[Kaggle Notebook 使用说明](https://www.kaggle.com/docs/notebooks) · [Granite Docling 官方模型卡](https://huggingface.co/ibm-granite/granite-docling-258M)

[返回自研模型展示](../README.md)

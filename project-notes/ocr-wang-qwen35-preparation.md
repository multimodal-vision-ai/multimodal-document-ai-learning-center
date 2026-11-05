# Wang Qwen3.5 2B 模型接入

作者：wangcheng；模型许可：Apache-2.0。

个人分支为 `feat/ocr-wang-qwen25vl`，从 `dev` 的 `86ccba68f297a7583b5c45f65338a6278021bffb` 创建。
按本次安排优先接入 2B，实际架构为 `Qwen3_5ForConditionalGeneration`，4B 尚未开展接入。

## 模型仓库

- [原始 BF16 checkpoint](https://huggingface.co/multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags)
- [ONNX 转换版本](https://huggingface.co/multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags-ONNX)

两个组织模型仓库已创建。模型发布状态、配置、验证结果及限制以各自模型卡为准。
HF API 操作显式使用官方 `https://huggingface.co` endpoint；下载镜像的认证结果不能替代官方写入权限校验。

## 源模型核对

| 检查 | 结果 |
| --- | --- |
| BF16 参数数量 | 2,213,925,696 |
| 分词器长度／嵌入行数 | 248,654／248,654 |
| 全部 added tokens 的单词元及无损往返 | 610／610 |
| 配置、分词器、图像处理器本地加载 | 通过，Transformers 5.6.2 |
| checkpoint 元数据中的 step | 72,000 |

原始权重 SHA-256：

`f299d2ff0d0cdd72a54232b3c4720d2f600df5a6b5ec148528579d7c7fd777e0`

提供的推理入口要求 `<think>\n\n</think>\n\n<doctag>` 前缀、贪心生成、重复惩罚 1.02；适配器单独保留该约定，不套用其他模型的直接回答模板。

## 代码与证据

- [适配器、转换与验证说明](../hf-spaces/mvai-doctags-webgpu/adapters/wang-qwen35-2b/README.md)
- [实测记录](../hf-spaces/mvai-doctags-webgpu/adapters/wang-qwen35-2b/TESTS.md)
- 独立本地验证页面：`project-notes/ocr-wang-qwen35-local-test/`。

本次只新增本模型相关文件。公共首页、模型注册表、其他模型和部署工作流保持原样。
完成后提交本分支到 `dev` 的 PR，由谭老师审核；不自行合并或发布公共展厅。

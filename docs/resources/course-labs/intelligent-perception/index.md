# 智能感知与自动驾驶技术

**课程资源：章节讲义 · 探索式 Notebook · 浏览器交互实验 · 本地 / Kaggle 实践**

面向计算机及相关专业学生，从道路图像处理、车道线检测逐步学习交通目标感知、风险分析和智能驾驶决策。实验采用真实行车视频截帧，优先让学生理解“原理—代码—观察—反例”。

[返回推荐课程](../../courses.md){ .md-button }

## 课程章节

| 章节 | 学习内容 | 课件 |
| --- | --- | --- |
| 第 1 章 | 智能感知与自动驾驶概述 | [查看 PDF](https://github.com/multimodal-vision-ai/courses/raw/main/intelligent-perception/slides/%E7%AC%AC1%E7%AB%A0%20-%20%E7%BB%AA%E8%AE%BA.pdf) |
| 第 2 章 | 视觉传感器、数字图像和图像处理 | [查看 PDF](https://github.com/multimodal-vision-ai/courses/raw/main/intelligent-perception/slides/%E7%AC%AC2%E7%AB%A0%20-%20%E8%A7%86%E8%A7%89%E4%BC%A0%E6%84%9F%E5%99%A8.pdf) |
| 第 3 章 | 车道线感知与经典视觉算法 | [查看 PDF](https://github.com/multimodal-vision-ai/courses/raw/main/intelligent-perception/slides/%E7%AC%AC3%E7%AB%A0%20-%20%E8%87%AA%E5%8A%A8%E9%A9%BE%E9%A9%B6%E8%BD%A6%E9%81%93%E7%BA%BF%E6%A3%80%E6%B5%8B.pdf) |
| 第 4 章 | 道路目标检测 | [查看 PDF](https://github.com/multimodal-vision-ai/courses/raw/main/intelligent-perception/slides/%E7%AC%AC4%E7%AB%A0%20-%20%E8%87%AA%E5%8A%A8%E9%A9%BE%E9%A9%B6%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.pdf) |
| 第 5 章 | 智能驾驶决策与控制 | [查看 PDF](https://github.com/multimodal-vision-ai/courses/raw/main/intelligent-perception/slides/%E7%AC%AC5%E7%AB%A0%20-%20%E8%87%AA%E5%8A%A8%E9%A9%BE%E9%A9%B6%E5%86%B3%E7%AD%96%E6%8E%A7%E5%88%B6.pdf) |

## 探索式实验

<div class="grid cards" markdown>

-   **E01 · 道路图像处理与视觉基础**

    从实际道路图片学习 HSV、阈值分割、图像滤波、形态学和透视变换。完成 5 项参数探索。

    ![E01 黄白标线](images/02_solidYellowLeft_yellow_white.jpg)

    [进入 E01 实验](e01.md){ .md-button .md-button--primary }

-   **E02 · 传统车道线检测**

    通过 Canny → ROI → Hough → 左右车道候选拟合，比较直道、弯道与复杂场景的检测效果。

    ![E02 道路车道线](images/01_solidWhiteRight_straight_white.jpg)

    [进入 E02 实验](e02.md){ .md-button .md-button--primary }

</div>

后续 E03—E08、A01—A02、P01 仍按课程研发路线逐步建设。本页仅开放已经完成教学审核的 E01 和 E02。

## 一份标准 Notebook，三种学习方式

| 学习方式 | 学生能够做什么 | 运行要求 |
| --- | --- | --- |
| **在线阅读 Notebook** | 查看实验说明、Python 源码与算法结果说明 | 浏览器 |
| **在线交互实验** | 修改参数，比较原图与输出；图像在学生浏览器本地处理 | 浏览器，不需要 Python |
| **下载独立运行** | 下载 `.ipynb` 与配套图片，使用本地 Jupyter / VS Code / Kaggle 重新运行 Python | 有 Python 或 Kaggle 运行环境 |

!!! info "教学范围与算法边界"
    浏览器版与 Python Notebook 采用相同的经典视觉教学路线，但浏览器实现不保证与 OpenCV 逐像素完全一致；左右车道线拟合为演示性候选结果，不是 Ground Truth，也不应将候选线条数当作准确率。

### 资源与来源

- 图片由 [Udacity CarND-LaneLines-P1](https://github.com/udacity/CarND-LaneLines-P1) 与 [Udacity CarND-Advanced-Lane-Lines](https://github.com/udacity/CarND-Advanced-Lane-Lines) 原始视频固定时间点提取，保留作者署名。
- 课程的旧版 Notebook 与课件可在 [multimodal-vision-ai/courses](https://github.com/multimodal-vision-ai/courses/tree/main/intelligent-perception) 查看。

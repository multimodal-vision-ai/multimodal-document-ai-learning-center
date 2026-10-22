"""Test site rendering with a reviewed item and an unreviewed lead."""
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "radar"))
import render
from core import score, save

DIMENSIONS = {"innovation": 10, "openness": 9, "compute": 8,
              "reproducibility": 9, "extension": 9, "commercialization": 8}

class RadarRenderTests(unittest.TestCase):
    def test_approved_project_and_pending_leads_are_separated(self):
        with tempfile.TemporaryDirectory() as temp:
            tempdir = Path(temp)
            docs = tempdir / "docs"
            data = tempdir / "data"
            for name in ("index.md", "radar/index.md", "radar/projects.md", "radar/tasks.md"):
                src = ROOT / "docs" / name
                dest = docs / name
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_text(src.read_text(encoding="utf-8-sig"), encoding="utf-8")
            record = {
                "id": "verified-sample", "title": "Safe <script> Title",
                "category": "document", "source_url": "https://example.org/research",
                "published_at": "2026-10-21T03:00:00+00:00",
                "first_seen_at": "2026-10-21T04:00:00+00:00",
                "review": "approved", "reviewed_by": "reviewer",
                "reviewed_at": "2026-10-21T05:00:00+00:00",
                "evidence_urls": ["https://example.org/research"],
                "innovation": "Layout modeling", "research_opportunity": "Token pruning",
                "score_dimensions": DIMENSIONS, "score": score(DIMENSIONS),
                "parameters": "2B", "gpu": "24GB", "gpu_tier": "24gb"
            }
            candidate = {
                "id": "unverified-sample", "title": "Unreviewed <img> Long Video Understanding with Token Reduction",
                "category": "video", "source_url": "https://example.org/lead",
                "published_at": "2026-10-21T05:00:00+00:00",
                "first_seen_at": "2026-10-21T06:00:00+00:00",
                "review": "pending", "discovered_from": "arxiv"
            }
            save(data / "projects.json", [record])
            save(data / "candidates.json", [candidate])
            save(data / "tasks.json", [])
            save(data / "chatgpt-reviewed" / "latest-daily.json", {
                "status": "completed",
                "generated_at": "2026-10-20T09:08:45Z",
                "report_title": "ChatGPT 每日科研预警",
                "items": [{
                    "id": "arxiv-2610-26401", "title": "One Fact, Many Places",
                    "category": "document", "paper_url": "https://arxiv.org/abs/2610.26401",
                    "summary": "长文档 RAG 中重复证据的评测与分析。",
                    "why_selected": "该任务将其列为值得关注的研究进展。",
                    "research_opportunity": "评测冗余证据对检索和回答可靠性的影响。",
                    "selection_status": "selected"
                }]
            })
            save(data / "chatgpt-reviewed" / "latest-weekly.json", {
                "status": "completed",
                "generated_at": "2026-10-19T09:22:26Z",
                "report_title": "文档理解、视频理解与多模态小模型科研周报",
                "items": [{
                    "id": "rpd-sara", "title": "RPD+SARA",
                    "category": "document", "paper_url": "https://arxiv.org/abs/2610.20335",
                    "github_url": "https://github.com/yufanchen96/RPD",
                    "huggingface_url": "https://huggingface.co/chen-doc-ai/Qwen3.5-2B_with_SARA",
                    "parameters": "2B", "gpu": "T4 量化推理可行；LoRA 约 24GB；全量训练至少 40GB",
                    "summary": "结构感知的统一文档解析方法。",
                    "why_selected": "报告列为 A 优先级，开放权重与数据。",
                    "research_opportunity": "评估布局和结构约束在不同文档版式中的泛化。",
                    "selection_status": "selected"
                }, {
                    "id": "malow", "title": "MaLoW",
                    "category": "video", "paper_url": "https://arxiv.org/abs/2610.22070",
                    "github_url": "https://github.com/dragonlzm/MaLoW",
                    "huggingface_url": "https://huggingface.co/collections/zhuomingliu/malow",
                    "parameters": "0.8B–9B", "gpu": "0.8B/2B 可尝试 T4 推理；4B 约需 24GB",
                    "summary": "面向视频理解的参数记忆与动态 LoRA 方法。",
                    "why_selected": "报告将其列为值得复现的低成本视频理解方向。",
                    "research_opportunity": "在固定显存和长视频条件下评估记忆机制与时间定位。",
                    "selection_status": "selected"
                }]
            })
            save(data / "chatgpt-reviewed" / "latest-monthly.json", {
                "status": "not_published", "generated_at": None, "items": []
            })
            from screening import build_queue
            now = datetime(2026, 10, 21, 12, tzinfo=timezone.utc)
            queue = build_queue([candidate], now)
            self.assertEqual(queue["total"], 1)
            save(data / "screening-queue.json", queue)
            save(data / "chatgpt-reviewed" / "latest-daily.json", {
                "screening_schema_version": 2,
                "first_stage_threshold": 8.0,
                "status": "completed",
                "generated_at": "2026-10-21T11:00:00Z",
                "items": [{
                    "candidate_id": candidate["id"], "title": candidate["title"],
                    "selection_status": "recommended",
                    "summary": "Video-token reduction offers a testable efficiency-accuracy tradeoff.",
                    "why_selected": "The paper addresses a significant reproducible efficiency research question.",
                    "research_opportunity": "Compare long-video accuracy and compute on a fixed GPU budget.",
                    "evaluation_dimensions": {
                        k: {"score": 8.0, "rationale": "Supported by the paper and testable experimental setup."}
                        for k in ("innovation", "open_source", "reproducibility", "research_potential")
                    },
                    "confidence": "medium",
                    "evidence_urls": [candidate["source_url"]],
                    "parameters": None, "gpu_requirement": None,
                    "weights_open": None, "training_code_open": None,
                    "data_open": None
                }]
            })
            with patch.object(render, "DOCS", docs), patch.object(render, "DATA", data):
                render.render(now)
                first = {str(p.relative_to(docs)): p.read_text(encoding="utf-8")
                         for p in docs.rglob("*.md")}
                render.render(now)
                second = {str(p.relative_to(docs)): p.read_text(encoding="utf-8")
                          for p in docs.rglob("*.md")}
            self.assertEqual(first, second)
            self.assertIn("radar-project-table", first["radar/projects.md"])
            self.assertIn("&lt;script&gt;", first["radar/projects.md"])
            self.assertNotIn("<script>", first["radar/projects.md"])
            self.assertIn("Unreviewed", first["radar/index.md"])
            self.assertNotIn("Unreviewed", first["radar/projects.md"])
            # The welcome page stays a learning landing page; Radar lives only in Research Updates.
            self.assertNotIn("科研雷达 · Research Radar", first["index.md"])
            self.assertNotIn("<!-- RADAR:START -->", first["index.md"])
            self.assertNotIn("周期任务运行验收", first["index.md"])
            self.assertNotIn("RPD+SARA", first["index.md"])
            self.assertNotIn("Unreviewed", first["index.md"])
            self.assertIn("# 前沿动态", first["radar/index.md"])
            self.assertIn("本周精选", first["radar/index.md"])
            self.assertIn("本月研究机会", first["radar/index.md"])
            self.assertIn("radar-brief-card", first["radar/index.md"])
            self.assertIn("MaLoW", first["radar/index.md"])
            self.assertIn("https://arxiv.org/abs/2610.22070", first["radar/index.md"])
            self.assertIn("Unreviewed", first["radar/index.md"])
            self.assertIn("四项评分", first["radar/index.md"])
            self.assertIn("radar-review-card", first["radar/index.md"])
            self.assertIn("radar-review-score-grid", first["radar/index.md"])
            self.assertIn("radar-review-detail-grid", first["radar/index.md"])
            self.assertIn("主要来源", first["radar/index.md"])
            self.assertIn("radar-frontier-page", first["radar/index.md"])
            self.assertNotIn("日度统计", first["radar/index.md"])
            self.assertNotIn("历史每日预警", first["radar/index.md"])
            self.assertIn("<details class=\"radar-candidate-details\"", first["radar/index.md"])
            self.assertNotIn("[浏览项目库]", first["radar/index.md"])
            self.assertNotIn("[查看研究任务]", first["radar/index.md"])
            config = (ROOT / "mkdocs.yml").read_text(encoding="utf-8")
            self.assertIn("radar/projects.md", config)
            self.assertIn("radar/tasks.md", config)
            self.assertNotIn("项目库: radar/projects.md", config)
            self.assertNotIn("研究任务: radar/tasks.md", config)

if __name__ == "__main__":
    unittest.main()

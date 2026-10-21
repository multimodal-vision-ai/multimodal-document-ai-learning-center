import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/"scripts"/"radar"))
from core import score,verify,upsert

class RadarTests(unittest.TestCase):
    def test_score(self):
        self.assertEqual(score({k:10 for k in ("innovation","openness","compute","reproducibility","extension","commercialization")}),10)
    def test_missing_source(self):
        with self.assertRaises(ValueError):
            verify({"id":"paper-1","title":"Test Paper","category":"document","review":"approved","published_at":"2026-10-21","first_seen_at":"2026-10-21","source_url":"javascript:bad"})
    def test_approved_requires_evidence(self):
        with self.assertRaises(ValueError):
            verify({"id":"paper-1","title":"Test Paper","category":"document","review":"approved","published_at":"2026-10-21","first_seen_at":"2026-10-21","source_url":"https://arxiv.org/abs/1234","innovation":"Novel","research_opportunity":"Improve"})
    def test_pending_cannot_downgrade(self):
        original={"id":"paper-1","title":"Verified Paper","category":"document","review":"approved","published_at":"2026-10-21","first_seen_at":"2026-10-21","source_url":"https://arxiv.org/abs/1234","innovation":"Method","research_opportunity":"Follow-up","evidence_urls":["https://arxiv.org/abs/1234"]}
        pending={**original,"review":"pending","title":"Changed"}
        self.assertEqual(upsert([original],[pending])[0]["title"],"Verified Paper")
if __name__=="__main__":unittest.main()

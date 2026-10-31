#!/usr/bin/env python3
"""MVAI Daily Action Benchmark V1.0: metadata-only integrity audit."""
import csv, json
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
def rows(p):
    with (ROOT/p).open(encoding="utf-8-sig",newline="") as f:return list(csv.DictReader(f))
clips=rows("manifests/clips.csv")
events=rows("manifests/events.csv")
pilots=rows("manifests/pilot_candidates.csv")
warnings=json.loads((ROOT/"reports/import_warnings.json").read_text())
fail=[];issues=[]
ids=[r["clip_id"] for r in clips]
c_by_id={r["clip_id"]:r for r in clips}
if len(set(ids))!=len(ids):fail.append("duplicate clip_id")
if len(set(r["event_id"] for r in events))!=len(events):fail.append("duplicate event_id")
if len(set(r["clip_id"] for r in pilots))!=len(pilots):fail.append("duplicate pilot")
for row in clips:
    if not row["media_ref_url"].startswith("https://github.com/ekramalam/"):
        fail.append("non-GitHub source: "+row["clip_id"])
    if row["redistribution_status"]!="blocked_pending_rights_review":fail.append("rights violation")
    if row["human_video_review"]!="pending":issues.append("non-pending human review: "+row["clip_id"])
    if row["split"]!="unassigned":issues.append("preset split: "+row["clip_id"])
for e in events:
    c=c_by_id.get(e["clip_id"])
    if c is None:fail.append("orphan event "+e["event_id"]);continue
    try:
        a,b=float(e["start_s"]),float(e["end_s"])
    except ValueError:fail.append("non-numeric event");continue
    if a<0 or b<=a or b>float(c["duration_claim_s"])+0.5:
        if e["quality"]=="normal":fail.append("invalid event unflagged "+e["event_id"])
        else:issues.append("flagged invalid: "+e["event_id"])
for r in pilots:
    if r["clip_id"] not in c_by_id:fail.append("orphan pilot "+r["clip_id"])
    if r["evidence"]=="description_only" and not r["requested_label"].endswith("_candidate"):
        fail.append("phone candidate mislabeled as ground truth")
stats={
  "clips":len(clips),"events":len(events),"pilot_candidates":len(pilots),
  "source_subjects":dict(Counter(x["source_subject"] for x in clips)),
  "data_sections":dict(Counter(x["source_section"] for x in clips)),
  "all_media_listed_on_github":all(x["media_presence"]=="listed_in_github" for x in clips),
  "source_csv_parse_warnings":len(warnings),
  "event_quality_invalid":sum(x["quality"]!="normal" for x in events),
  "phone_call_description_only_count":sum("phone_call_candidate" in x["description_only_candidates"] for x in clips),
  "phone_use_description_only_count":sum("phone_use_candidate" in x["description_only_candidates"] for x in clips),
  "failed_checks":fail,"nonfatal_warnings":issues
}
print(json.dumps(stats,indent=2,ensure_ascii=False))
(ROOT/"reports"/"integrity_check.json").write_text(json.dumps(stats,indent=2,ensure_ascii=False)+"\n")
raise SystemExit(1 if fail else 0)

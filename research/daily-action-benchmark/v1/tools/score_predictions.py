#!/usr/bin/env python3
"""Score event-level model outputs, never treating description-only phone cues as ground truth.
CSV columns: event_id,model_id,topk_labels_pipe,inference_ms,supported_labels_pipe
All topk labels MUST use MVAI canonical IDs (checkpoint labels mapped separately).
"""
import argparse,csv,json,statistics
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(path):
    with open(path,encoding="utf-8",newline="") as f:return list(csv.DictReader(f))
def score(predictions,reviewed_ids,exploratory):
    gt={r["event_id"]:r for r in read(ROOT/"manifests"/"events.csv")}
    results={}; seen=set();errors=[]
    for row in predictions:
        eid=row.get("event_id","");model=row.get("model_id","")
        if not eid or not model:errors.append("Missing event_id/model_id");continue
        key=(model,eid)
        if key in seen:errors.append("Duplicate model/event "+str(key));continue
        seen.add(key)
        event=gt.get(eid)
        if not event:errors.append("Unrecognized event_id "+eid);continue
        if event["quality"]!="normal":continue
        if not exploratory and eid not in reviewed_ids:continue
        cls=event["target_label"]
        if cls not in {"falling","eating","sleeping","walking","drinking","sitting","standing","reading","exercising","writing"}:continue
        scores=results.setdefault(model,{"n_evaluated":0,"n_unsupported":0,"per_class":{},"latency_ms":[],"review_mode":"exploratory_source_labels" if exploratory else "visually_approved_events_only"})
        supported=set((row.get("supported_labels_pipe") or "").split("|"))
        if supported!={""} and cls not in supported:
            scores["n_unsupported"]+=1;continue
        labels=[z.strip() for z in row.get("topk_labels_pipe","").split("|") if z.strip()]
        if not labels:errors.append("Missing topk labels "+str(key));continue
        per=scores["per_class"].setdefault(cls,{"total":0,"top1":0,"top5":0})
        per["total"]+=1
        per["top1"]+=int(labels[0]==cls)
        per["top5"]+=int(cls in labels[:5])
        scores["n_evaluated"]+=1
        try:scores["latency_ms"].append(float(row["inference_ms"]))
        except (ValueError,KeyError):pass
    for m,d in results.items():
        for c,z in d["per_class"].items():
            z["top1_recall"]=round(z["top1"]/z["total"],4)
            z["top5_recall"]=round(z["top5"]/z["total"],4)
        if d["latency_ms"]:d["median_inference_ms"]=round(statistics.median(d["latency_ms"]),3)
        del d["latency_ms"]
        vals=list(d["per_class"].values())
        d["macro_top1_recall"]=round(sum(z["top1_recall"] for z in vals)/len(vals),4) if vals else None
    return {"score_type":"exploratory_only" if exploratory else "reviewed_events","models":results,"errors":errors,
       "warning":"Missing classes and uncalibrated softmax scores require separate reporting. This is not per-person action detection."}
if __name__=="__main__":
    p=argparse.ArgumentParser()
    p.add_argument("--predictions",required=True,help="CSV as described in module docstring")
    p.add_argument("--reviewed-events",default="",help="TXT list of event IDs manually approved after visual review")
    p.add_argument("--exploratory",action="store_true",help="Score original source-CSV labels only; NOT benchmark-approved accuracy")
    p.add_argument("--out",default="")
    a=p.parse_args()
    reviewed=set(Path(a.reviewed_events).read_text().splitlines()) if a.reviewed_events else set()
    report=score(read(a.predictions),reviewed,a.exploratory)
    if a.out:Path(a.out).write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n")
    else:print(json.dumps(report,indent=2,ensure_ascii=False))
    raise SystemExit(1 if report["errors"] else 0)

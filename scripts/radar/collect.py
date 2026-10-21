"""Fetch arXiv, GitHub and Hugging Face discovery leads; never auto-approve."""
import json
import os
import sys
from datetime import datetime, timezone, timedelta
from urllib.request import Request, urlopen
from urllib.parse import urlencode
import xml.etree.ElementTree as ET
from core import DATA, ROOT, iso_now, load, save, upsert

CONFIG = load(ROOT / "research-radar/config/sources.json", {})
UA = "MultimodalVisionResearchRadar/1.0 (+https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center)"

def fetch(url, headers=None):
    req = Request(url, headers={"User-Agent": UA, "Accept": "application/json", **(headers or {})})
    with urlopen(req, timeout=20) as response:
        return response.read()

def cat(title):
    t = title.lower()
    if any(s in t for s in ("video", "temporal", "streaming", "frame")): return "video"
    if any(s in t for s in ("document", "ocr", "pdf", "layout", "table")): return "document"
    return "small-vlm"

def candidate(uid, title, url, published, provider, **other):
    return {"id":uid, "title":title.strip()[:300], "source_url":url,
        "published_at":published, "first_seen_at":iso_now(), "category":cat(title),
        "review":"pending","discovered_from":provider,**other}

def arxiv():
    cfg=CONFIG.get("arxiv",{})
    if not cfg.get("enabled"): return []
    query=urlencode({"search_query":cfg.get("query","all:multimodal"),"start":0,"max_results":min(int(cfg.get("max_results",40)),100),"sortBy":"submittedDate","sortOrder":"descending"})
    raw=fetch("https://export.arxiv.org/api/query?"+query,{"Accept":"application/atom+xml"})
    ns={"a":"http://www.w3.org/2005/Atom"}
    results=[]
    since=datetime.now(timezone.utc)-timedelta(days=8)
    for entry in ET.fromstring(raw).findall("a:entry",ns):
        url=entry.findtext("a:id","",ns).replace("http://","https://")
        published=entry.findtext("a:published","",ns)
        title=" ".join(entry.findtext("a:title","",ns).split())
        if not url or not title: continue
        try:
            if datetime.fromisoformat(published.replace("Z","+00:00")) < since: continue
        except ValueError: continue
        aid=url.split("/")[-1].split("v")[0]
        results.append(candidate("arxiv-"+aid.replace(".","-"),title,url,published,"arxiv",paper_url=url))
    return results

def github():
    cfg=CONFIG.get("github",{})
    if not cfg.get("enabled"): return []
    headers={"Accept":"application/vnd.github+json"}
    if os.environ.get("GITHUB_TOKEN"): headers["Authorization"]="Bearer "+os.environ["GITHUB_TOKEN"]
    items=[]
    for term in cfg.get("queries",[])[:5]:
        q=urlencode({"q":term+" in:name,description pushed:>="+(datetime.now(timezone.utc)-timedelta(days=8)).strftime("%Y-%m-%d"),"sort":"updated","order":"desc","per_page":min(int(cfg.get("per_page",20)),50)})
        data=json.loads(fetch("https://api.github.com/search/repositories?"+q,headers))
        for x in data.get("items",[]):
            title=x.get("full_name","")
            if not title:continue
            items.append(candidate("github-"+str(x["id"]),title,x["html_url"],x.get("created_at",""),"github",github_url=x["html_url"],updated_at=x.get("pushed_at","")))
    return items

def huggingface():
    cfg=CONFIG.get("huggingface",{})
    if not cfg.get("enabled"): return []
    items=[]
    for term in cfg.get("queries",[])[:5]:
        q=urlencode({"search":term,"limit":min(int(cfg.get("limit",20)),50),"sort":"lastModified","direction":-1})
        data=json.loads(fetch("https://huggingface.co/api/models?"+q))
        for x in data:
            name=x.get("id")
            if not name:continue
            url="https://huggingface.co/"+name
            items.append(candidate("hf-"+str(x.get("id","")).lower().replace("/","-").replace("_","-").replace(".","-"),name,url,x.get("createdAt",x.get("lastModified","")),"huggingface",huggingface_url=url,updated_at=x.get("lastModified","")))
    return items

def main():
    previous=load(DATA/"candidates.json",[])
    found=[]; errors=[]
    for name,fn in (("arxiv",arxiv),("github",github),("huggingface",huggingface)):
        try:
            fresh=fn(); found+=fresh
            print(f"{name}: {len(fresh)} candidates")
        except Exception as exc:
            errors.append(f"{name}: {type(exc).__name__}: {exc}")
    if not found and errors:
        print("All discovery sources failed; leaving data unchanged",file=sys.stderr)
        for err in errors:print(err,file=sys.stderr)
        return 1
    save(DATA/"candidates.json",upsert(previous,found))
    for err in errors:print("WARNING "+err,file=sys.stderr)
    print("Only pending candidates saved. Nothing auto-approved.")
    return 0

if __name__=="__main__": sys.exit(main())

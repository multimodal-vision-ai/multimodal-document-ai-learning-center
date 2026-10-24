"""Read research-radar-labelled GitHub Issues using public GitHub API."""
import json
import os
from urllib.request import Request, urlopen
from core import DATA,save

REPO="multimodal-vision-ai/multimodal-document-ai-learning-center"
URL=f"https://api.github.com/repos/{REPO}/issues?state=all&labels=research-radar&per_page=100"
def main():
    headers={"User-Agent":"MultimodalVisionResearchRadar/1.0","Accept":"application/vnd.github+json"}
    if os.getenv("GITHUB_TOKEN"):headers["Authorization"]="Bearer "+os.environ["GITHUB_TOKEN"]
    req=Request(URL,headers=headers)
    with urlopen(req,timeout=20) as resp:data=json.load(resp)
    items=[{"number":x["number"],"title":x["title"],"url":x["html_url"],"state":x["state"],"updated_at":x["updated_at"]} for x in data if "pull_request" not in x]
    save(DATA/"tasks.json",items)
    print(f"Synced {len(items)} tagged issues")

if __name__=="__main__":main()

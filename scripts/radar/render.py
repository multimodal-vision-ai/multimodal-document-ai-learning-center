"""Render research radar MkDocs pages from reviewed JSON; deterministic and offline."""
import html
import re
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path
from core import DATA, ROOT, load, verify

DOCS=ROOT/"docs"
TODAY=datetime.now(timezone.utc).date()

def esc(value):
    return html.escape(str(value or "未核实"),quote=True)

def link(url,label):
    return f'<a href="{esc(url)}" rel="noopener noreferrer">{esc(label)}</a>' if url and str(url).startswith("https://") else "未提供"

def replace(text,marker,body):
    pattern=r"(<!-- RADAR:"+marker+r"-START -->).*?(<!-- RADAR:"+marker+r"-END -->)"
    result,n=re.subn(pattern,lambda m:m.group(1)+"\n"+body+"\n"+m.group(2),text,flags=re.S)
    if n!=1:raise ValueError("Expected one marker pair: "+marker)
    return result

def save_page(relative,new):
    target=DOCS/relative
    old=target.read_text(encoding="utf-8-sig")
    if new!=old:target.write_text(new,encoding="utf-8")

def run():
    raw=load(DATA/"projects.json",[])
    verified=[]
    for item in raw:
        verify(item)
        if item["review"]=="approved":verified.append(item)
    verified.sort(key=lambda x:(x.get("published_at",""),x["id"]),reverse=True)
    rows=[]
    for item in verified:
        refs=" · ".join(link(item.get(key),lab) for key,lab in (("paper_url","论文"),("github_url","代码"),("huggingface_url","模型")) if item.get(key))
        rows.append(f'<tr data-category="{esc(item["category"])}"><td><strong>{esc(item["title"])}</strong><br><small>{esc(item.get("organization",""))}</small></td><td>{esc(item["category"])}</td><td>{esc(item.get("parameters"))}</td><td>{esc(item.get("gpu"))}</td><td>{esc(item.get("score","—"))}</td><td>{refs}</td></tr>')
    contents=('<p id="radar-filter-count">'+str(len(rows))+' 条记录</p><table id="radar-project-table"><thead><tr><th>项目</th><th>领域</th><th>规模</th><th>GPU</th><th>评分</th><th>链接</th></tr></thead><tbody>'+"".join(rows)+"</tbody></table>") if rows else "**暂无已审核科研项目。**"
    p=DOCS/"radar/projects.md"
    save_page("radar/projects.md",replace(p.read_text(encoding="utf-8"),"PROJECTS",contents))
    daily=[]
    for x in verified:
        try:
            dt=datetime.fromisoformat(x["published_at"].replace("Z","+00:00")).date()
        except ValueError:continue
        if dt >= TODAY-timedelta(days=1) and float(x.get("score") or 0)>=8.5:daily.append(x)
    daily=daily[:3]
    week=verified[:10]
    month=verified[:10]
    def listing(items):
        if not items:return "暂无符合条件的已审核记录。"
        return "\n\n".join(f"- **{esc(x['title'])}**（{esc(x.get('parameters','未核实'))}，评分 {esc(x.get('score','未评分'))}）— {link(x.get('paper_url') or x['source_url'],'查看来源')}  \n  {esc(x.get('innovation',''))}" for x in items)
    p=DOCS/"radar/index.md"; page=p.read_text(encoding="utf-8")
    for marker,items in (("DAILY",daily),("WEEKLY",week),("MONTHLY",month)):
        body="\n".join("    "+line if line else "" for line in listing(items).splitlines())
        page=replace(page,marker,body)
    save_page("radar/index.md",page)
    tasks=load(DATA/"tasks.json",[])
    tasklines="\n".join(f"- [{esc(t['title'])}]({t['url']}) — {esc(t.get('state','open'))}" for t in tasks if isinstance(t,dict) and str(t.get("url","")).startswith("https://"))
    p=DOCS/"radar/tasks.md";save_page("radar/tasks.md",replace(p.read_text(encoding="utf-8"),"TASKS",tasklines or "暂无研究任务快照。请查看上方 GitHub Issues 入口。"))
    # Site home: keep course content, replace only controlled radar block.
    p=DOCS/"index.md";home=p.read_text(encoding="utf-8-sig")
    top="".join(f"<li>{link(x.get('paper_url') or x['source_url'],x['title'])} · {esc(x.get('parameters',''))}</li>" for x in verified[:3])
    block=f'''## 科研雷达 · Research Radar

<div class="radar-home-card" markdown>
<div class="radar-stats"><div class="radar-stat"><strong>{len(verified)}</strong> 已审核项目</div><div class="radar-stat"><strong>{len(daily)}</strong> 近24小时重点</div><div class="radar-stat"><strong>{len(tasks)}</strong> 研究任务</div></div>

{"<p>近期重点项目：</p><ul>"+top+"</ul>" if top else "<p>目前暂无已审核的高价值研究记录。候选项目不会直接作为正式推荐发布。</p>"}

[科研动态](radar/index.md) · [科研项目库](radar/projects.md) · [研究任务](radar/tasks.md)

</div>'''
    save_page("index.md",replace(home,"",block) if False else replace_home(home,block))
    print(f"Rendered {len(verified)} approved projects, {len(tasks)} tasks.")

def replace_home(home,block):
    pattern=r"<!-- RADAR:START -->.*?<!-- RADAR:END -->"
    next_text,n=re.subn(pattern,"<!-- RADAR:START -->\n"+block+"\n<!-- RADAR:END -->",home,flags=re.S)
    if n!=1:raise ValueError("Homepage marker not found")
    return next_text

if __name__=="__main__":run()

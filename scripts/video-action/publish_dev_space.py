#!/usr/bin/env python3
"""Publish the isolated V1.0.13 browser-only DEV Space and its versioned sample branch.

Only the new DEV Space and the dedicated Hugging Face Dataset branch are updated.
The Dataset main branch, GitHub Pages, Learning Center dev/main, and existing Spaces
are not modified.
"""
import io
import json
import os
import sys
import time
import urllib.request
from pathlib import Path
from huggingface_hub import HfApi, CommitOperationAdd, hf_hub_download

REPO="multimodal-vision-ai/mvai-video-action-v103-dev"
DATASET="multimodal-vision-ai/mvai-daily-action-demo"
DATASET_BRANCH="v103-dev-samples"
ROOT=Path("docs/assets/projects/video-action/browser-inference")
PREPARED=Path("artifacts/video-action/dev-samples")
HOST="https://multimodal-vision-ai-mvai-video-action-v103-dev.static.hf.space/"
TOKEN=os.environ.get("HF_TOKEN")
if not TOKEN: sys.exit("HF_TOKEN is absent; preview not deployed")

FRONTEND_FILES=("index.html","app.js","semantic.js","person-overlay.js",
                "official-movinet.js","video-mae.js","mobileclip.js",
                "continuous-movinet.js","person-target.js","continuous-segments.js","config.json")
for file in FRONTEND_FILES:
    if not (ROOT/file).is_file():sys.exit("Missing frontend file: "+file)
import re
for source in ("app.js","mobileclip.js","official-movinet.js","video-mae.js","continuous-movinet.js","continuous-segments.js","person-target.js","semantic.js","person-overlay.js"):
    content=(ROOT/source).read_text(encoding="utf8")
    local_imports=re.findall(r"""(?:from\s*|import\s*\(|import\s*)['"]\./([^'"]+)['"]""",content)
    for imported in local_imports:
        if imported not in FRONTEND_FILES:
            sys.exit("Local module referenced but not included in Space: "+source+" -> "+imported)

config=json.loads((ROOT/"config.json").read_text(encoding="utf8"))
if config.get("dataset_id")!=DATASET:
    sys.exit("Unrecognized dataset ID")
if not (isinstance(config.get("dataset_revision"),str) and len(config["dataset_revision"])==40):
    sys.exit("Dataset revision is not pinned")
api=HfApi(token=TOKEN)

# Create/update a dedicated branch from the already pinned public Dataset revision.
# The Dataset main branch remains untouched.
try:
    api.create_branch(repo_id=DATASET,repo_type="dataset",branch=DATASET_BRANCH,
                      revision=config["dataset_revision"],exist_ok=True)
except Exception:
    # create_branch can report a conflict when the branch already exists; confirm it.
    api.repo_info(repo_id=DATASET,repo_type="dataset",revision=DATASET_BRANCH)

catalog_file=Path(hf_hub_download(repo_id=DATASET,repo_type="dataset",
    filename="catalog/v1.json",revision=DATASET_BRANCH,token=TOKEN))
catalog=json.loads(catalog_file.read_text(encoding="utf8"))
if catalog.get("schema_version")!="1.0" or catalog.get("dataset_id")!=DATASET or not isinstance(catalog.get("items"),list):
    sys.exit("Existing HF Dataset catalog schema is invalid")
print("SOURCE_SAMPLE_ITEMS="+json.dumps([
    {k:item.get(k) for k in ("id","label_zh","label_en","standard_action_id","status","license",
      "relative_file","video_url","source_url","duration_seconds","width","height","redistribution_approved")}
    for item in catalog["items"]
],ensure_ascii=False))

# Archive the first-pass A samples and the earlier B Pexels candidates.
# They remain in Dataset history, but are no longer eligible for the V1.0.13 selector.
catalog_changed=False
legacy_ids={
 "real_waving_hand_001","real_phone_use_003","real_landline_call_005",
 "real_eating_004","real_sleep_posture_006","real_falling_007","real_phone_call_008",
 "real_b_yoga_001","real_b_push_up_001","real_b_sit_up_001","real_b_ballet_001","real_b_jogging_001"
}
for item in catalog["items"]:
    if item.get("id") in legacy_ids and item.get("status")!="archived":
        item["status"]="archived"
        item["redistribution_approved"]=False
        item["archived_reason"]="Superseded by the V1.0.13 curated bilingual A/B sample set."
        catalog_changed=True

# Pexels clips are externally embedded under the Pexels Free License. They are
# not copied into the Dataset; only their source and licensing metadata are stored.
PEXELS_LICENSE="Pexels Free License"
PEXELS_LICENSE_URL="https://www.pexels.com/license/"
def pexels_item(sample_id,group,zh,en,action,video_id,file_name,source,author,duration,width,height,fps,note,extra=None):
    item={
      "id":sample_id,"sample_group":group,"label_zh":zh,"label_en":en,
      "standard_action_id":action,"video_url":f"https://videos.pexels.com/video-files/{video_id}/{file_name}",
      "source_url":source,"license":PEXELS_LICENSE,"license_url":PEXELS_LICENSE_URL,
      "attribution":author+" / Pexels","status":"approved_demo",
      "redistribution_approved":False,"external_use_approved":True,"delivery_mode":"external_embed",
      "reference_evidence":"source_title_description_and_preview","evaluation_tier":"development_only",
      "duration_seconds":duration,"width":width,"height":height,"fps":fps,
      "visual_note":note
    }
    if extra:item.update(extra)
    return item

new_items=[
 pexels_item("real_a_wave_001","A","挥手","waving hand","wave","8135571","8135571-hd_1920_1080_25fps.mp4",
  "https://www.pexels.com/video/a-woman-talking-and-waving-while-looking-at-a-camera-8135571/",
  "ANTONI SHKRABA production",12,1920,1080,25,"One woman greets the camera and waves."),
 pexels_item("real_a_phone_use_001","A","看手机","looking at phone","phone_use","7189799","7189799-uhd_2560_1080_25fps.mp4",
  "https://www.pexels.com/video/woman-using-smartphone-7189799/",
  "Pavel Danilyuk",8,2560,1080,25,"One woman concentrates on and uses a smartphone."),
 pexels_item("real_a_phone_call_001","A","打电话","talking on cell phone","phone_call","4432560","4432560-uhd_3840_2160_25fps.mp4",
  "https://www.pexels.com/video/man-talking-on-his-smartphone-4432560/",
  "Edmond Dantès",11,3840,2160,25,"One man holds a smartphone to his ear during a call.",{"phone_type":"cell"}),
 pexels_item("real_a_falling_001","A","摔倒","falling down","falling","2791953","2791953-uhd_3840_2160_25fps.mp4",
  "https://www.pexels.com/video/person-falling-down-from-skateboard-2791953/",
  "cottonbro studio",10,3840,2160,25,"A skateboarder performs a trick and falls; this is a sports-context fall."),
 pexels_item("real_a_eating_001","A","吃东西","eating","eating","4731500","4731500-uhd_3840_2160_30fps.mp4",
  "https://www.pexels.com/video/man-wearing-sunglasses-eating-burger-4731500/",
  "Artem Podrez",10,3840,2160,30,"One man visibly eats a burger."),
 pexels_item("real_a_sleeping_001","A","睡觉","sleeping","sleep_posture","8865507","8865507-hd_1920_1080_30fps.mp4",
  "https://www.pexels.com/video/woman-sleeping-on-the-bed-8865507/",
  "RDNE Stock project",8,1920,1080,29.97,"A senior woman rests on a bed; the footage shows a sleeping posture, not proof of physiological sleep."),
 pexels_item("real_b_jogging_002","B","慢跑","jogging","jogging","6573735","6573735-hd_1920_1080_24fps.mp4",
  "https://www.pexels.com/video/a-woman-jogging-6573735/",
  "ArtHouse Studio",12,1920,1080,23.98,"One woman jogs up a grassy hill outdoors."),
 pexels_item("real_b_yoga_002","B","瑜伽","yoga","yoga","4536533","4536533-hd_1920_1080_30fps.mp4",
  "https://www.pexels.com/video/woman-doing-yoga-4536533/",
  "Vlada Karpovich",10,1920,1080,30,"One woman practices yoga indoors."),
 pexels_item("real_b_push_up_002","B","俯卧撑","push up","push_up","4921832","4921832-hd_1920_1080_24fps.mp4",
  "https://www.pexels.com/video/man-doing-push-ups-4921832/",
  "Ketut Subiyanto",10,1920,1080,23.98,"One man performs push-ups beside a waterfront."),
 pexels_item("real_b_sit_up_002","B","仰卧起坐","situp","sit_up","4742756","4742756-uhd_3840_2160_25fps.mp4",
  "https://www.pexels.com/video/man-working-out-at-the-gym-4742756/",
  "Ketut Subiyanto",8,3840,2160,25,"One man performs sit-ups in a gym."),
 pexels_item("real_b_ballet_002","B","芭蕾舞","dancing ballet","ballet","5051320","5051320-hd_1920_1080_25fps.mp4",
  "https://www.pexels.com/video/video-of-ballerina-crossing-the-street-while-dancing-5051320/",
  "Taryn Elliott",11,1920,1080,25,"A ballerina crosses a city street while dancing.")
]

def upsert_item(new_item):
    global catalog_changed
    for index,old_item in enumerate(catalog["items"]):
        if old_item.get("id")==new_item["id"]:
            if old_item!=new_item:
                catalog["items"][index]=new_item
                catalog_changed=True
            return
    catalog["items"].append(new_item)
    catalog_changed=True

for item in new_items:
    upsert_item(item)

B_META={
 "hula_hooping":{"zh":"呼啦圈","en":"hula hooping","source":"https://commons.wikimedia.org/wiki/File:Berlin_girl_turning_a_hula_hoop,_Berlin_2013_(2013-08-23_by_Thomas_Quine).webm","license":"CC BY 2.0","license_url":"https://creativecommons.org/licenses/by/2.0/","author":"Thomas Quine","note":"One person continuously turns a hula hoop."}
}
existing={item.get("id") for item in catalog["items"]}
operations=[]
for key,meta in B_META.items():
    sample_id="real_b_"+key+"_001"
    local=PREPARED/(key+".mp4")
    if not local.is_file():sys.exit("Prepared sample missing: "+str(local))
    manifest=json.loads((PREPARED/"manifest.json").read_text(encoding="utf8"))[key]
    relative=f"demo/videos/v103_b_{key}.mp4"
    if sample_id not in existing:
        operations.append(CommitOperationAdd(path_in_repo=relative,path_or_fileobj=str(local)))
    upsert_item({
      "id":sample_id,"sample_group":"B","label_zh":meta["zh"],"label_en":meta["en"],
      "standard_action_id":key,"relative_file":relative,"source_url":meta["source"],
      "source_media_url":manifest["url"],"license":meta["license"],"license_url":meta["license_url"],
      "attribution":meta["author"],"status":"approved_demo","redistribution_approved":True,
      "reference_evidence":"source_caption_and_preview","evaluation_tier":"development_only",
      "duration_seconds":manifest["duration_seconds"],"width":manifest["width"],"height":manifest["height"],
      "clip_start_seconds":manifest["start"],"clip_duration_seconds":manifest["duration"],
      "modification":manifest["modification"],"sha256":manifest["sha256"],"visual_note":meta["note"]
    })

# Ensure all twelve selectors have one approved and licensed sample.
active_ids={x.get("id") for x in catalog["items"] if x.get("status")=="approved_demo"}
required={
 "real_a_wave_001","real_a_phone_use_001","real_a_phone_call_001","real_a_falling_001","real_a_eating_001","real_a_sleeping_001",
 "real_b_jogging_002","real_b_yoga_002","real_b_push_up_002","real_b_sit_up_002","real_b_ballet_002","real_b_hula_hooping_001"
}
missing=required-active_ids
if missing:sys.exit("DEV sample catalog incomplete: "+", ".join(sorted(missing)))

if catalog_changed or operations:
    operations.append(CommitOperationAdd(path_in_repo="catalog/v1.json",
        path_or_fileobj=io.BytesIO((json.dumps(catalog,ensure_ascii=False,indent=2)+"\n").encode("utf8"))))
    api.create_commit(repo_id=DATASET,repo_type="dataset",revision=DATASET_BRANCH,
        operations=operations,commit_message="dev: curate bilingual A/B action sample sets V1.0.13")

dataset_info=api.repo_info(repo_id=DATASET,repo_type="dataset",revision=DATASET_BRANCH)
config["dataset_revision"]=dataset_info.sha
config["dataset_branch"]=DATASET_BRANCH
config["sample_catalog_version"]="1.0.13"
(ROOT/"config.json").write_text(json.dumps(config,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
print("DEV_DATASET_BRANCH="+DATASET_BRANCH)
print("DEV_DATASET_SHA="+dataset_info.sha)
print("DEV_SAMPLE_GROUPS=A:6,B:6")

try:
    api.create_repo(repo_id=REPO,repo_type="space",space_sdk="static",private=False,exist_ok=True)
except Exception as error:
    sys.exit("Space creation failed: "+type(error).__name__+": "+str(error)[:250])
info=api.repo_info(repo_id=REPO,repo_type="space")
if info.private:sys.exit("Isolated DEV Space unexpectedly private")
card=f"""---
title: MVAI Video Action V1.0.13 DEV
emoji: 🎬
colorFrom: blue
colorTo: indigo
sdk: static
app_file: index.html
pinned: false
---
# MVAI Video Action V1.0.13 — ISOLATED DEV PREVIEW

**NOT OFFICIAL. DO NOT REFERENCE AS RELEASED.**

A static browser-only implementation of the MVAI video action recognition
research prototype from isolated GitHub PR #63. Section 01 contains two
independent bilingual sample sets: A (daily actions) and B (shared Kinetics
actions). The inference and comparison modules are unchanged.

Source: https://github.com/multimodal-vision-ai/multimodal-document-ai-learning-center/pull/63

The browser independently downloads public model weights and version-pinned
approved demonstration samples. This Space does not run server inference and
does not receive uploaded local videos.

GitHub revision: `{os.getenv("GITHUB_SHA","unknown")}`
HF Dataset revision: `{config["dataset_revision"]}`
"""
operations=[CommitOperationAdd(path_in_repo="README.md",path_or_fileobj=io.BytesIO(card.encode("utf8")))]
for name in FRONTEND_FILES:
    operations.append(CommitOperationAdd(path_in_repo=name,path_or_fileobj=str(ROOT/name)))
api.create_commit(repo_id=REPO,repo_type="space",operations=operations,
    commit_message="dev: publish bilingual A/B sample selector V1.0.13")
post=api.repo_info(repo_id=REPO,repo_type="space")
print("DEV_SPACE_PAGE=https://huggingface.co/spaces/"+REPO)
print("DEV_SPACE_STATIC="+HOST)
print("DEV_SPACE_SHA="+post.sha)
print("DEV_DATASET_SHA="+config["dataset_revision"])
for i in range(12):
    try:
        with urllib.request.urlopen(urllib.request.Request(HOST,headers={"User-Agent":"MVAI-DEV-Preview-Verification/1.0"}),timeout=15) as response:
            data=response.read(100000).decode("utf-8","replace")
            if response.status==200 and "视频行为识别与分析" in data:
                for module in FRONTEND_FILES:
                    with urllib.request.urlopen(
                        urllib.request.Request(HOST+module,headers={"User-Agent":"MVAI-DEV-Preview-Verification/1.0"}),
                        timeout=18) as module_response:
                        data_bytes=module_response.read(4000)
                        if module_response.status!=200 or len(data_bytes)<10:
                            raise RuntimeError("DEV module missing: "+module)
                print("DEV_SPACE_HTTP_VERIFIED=200")
                print("DEV_MODULES_HTTP_VERIFIED="+str(len(FRONTEND_FILES)))
                break
    except Exception as e:
        if i==11:raise RuntimeError("DEV preview not accessible after static Space update: "+type(e).__name__) from e
    time.sleep(5)
else:raise RuntimeError("DEV Space HTTP 200 returned unexpected content")

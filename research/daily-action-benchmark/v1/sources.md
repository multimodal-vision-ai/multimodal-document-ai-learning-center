# Upstream source inventory and rights log (2026-11-01)

| Dataset | Available evidence | Clip registry status | Media license / publication |
|---|---|---|---|
| GMDCSA-24 v2.1 | 8 source CSV tables, 160 GitHub-hosted MP4 names, time intervals (some malformed) | **Imported 160**; media probing staged | Open GitHub MIT repo; Zenodo dataset license field blank, article CC BY 4.0 applies to article. **Do not infer video/likeness rehosting rights**; no raw videos committed |
| Mora-ADL | 24 class names, RGB, CC0 LICENSE | 0 clip IDs (Google Drive / MEGA folder has not been indexed) | Repo CC0; still consider participant privacy before public demo |
| Indoor Action Dataset | 1228 clips; author-provided train/val/test; 10 classes, including eat/fall/walk | 0 clip IDs (archive not yet extracted) | Zenodo record CC BY 4.0; GitHub repo BSD-3 applies code, not automatically same asset |
| SAFER-Activities | Fall / motion annotations | 0 clip IDs | HF gated access / CC BY-NC-SA; requires rights approval for publication |
| AVA | Person-level temporal labels | 0 clip IDs | Film footage has complex redistribution rights; not suitable for direct public mirror |
| Charades | Phone/eating/lying indoor class labels | 0 clip IDs | Non-commercial / controlled redistribution, needs review |

Sources:
- GMD source https://github.com/ekramalam/GMDCSA24-A-Dataset-for-Human-Fall-Detection-in-Videos/tree/v2.1
- GMD Zenodo https://doi.org/10.5281/zenodo.13354453
- Mora https://github.com/RivinduM/Mora-ADL (GDrive and MEGA download links in README)
- Indoor https://github.com/DaniDeniz/IndoorActionDataset and https://zenodo.org/records/14551902
- SAFER https://safer-activities.github.io/
- AVA https://research.google.com/ava/
- Charades https://huggingface.co/datasets/HuggingFaceM4/charades

## Rules

The authoritative clip table MUST retain the stable upstream source identifier, pinned release version, original label, provenance, metadata validation state, and media SHA256 if downloaded. More permissive software licenses are not proof that a video can be published with identifiable participants. Links alone are not hosted clips.

Research-only private testing from publicly reachable original sources is distinct from republishing original media in a public online demo. Any planned public gallery needs a separate approval review and a documented license/likeness basis.

# MVAI Daily Action Benchmark V1.0 — research preview

**Status:** Metadata and source label registry constructed; **not** an approved public video gallery or a completed 120-clip balanced benchmark.

## Verified corpus / counts (2026-11-01)

- Original source: GMDCSA-24 v2.1, [Zenodo DOI](https://doi.org/10.5281/zenodo.13354453) and [GitHub tag](https://github.com/ekramalam/GMDCSA24-A-Dataset-for-Human-Fall-Detection-in-Videos/tree/v2.1).
- 160 real source file entries (81 ADL, 79 Fall), 4 participants (S1=32, S2=48, S3=43, S4=37).
- 356 time span records **extracted from original CSV**, not automatically validated on every physical video.
- 38 pilot candidate clip references (not a balanced 120-item final set). All 160 clip entries match GitHub repository listings. This only establishes upstream listing, not file playback or manual label confirmation.
- 3 annotation parsing anomalies in `reports/import_warnings.json`. Original text preserved; invalid or unparsed periods must not be used as clean reference events.
- Target source-timecoded clip counts: falling 77, sleeping 15, eating 7, walking 57, drinking 12. **Phone call 3** and **phone use 7** are detected in descriptions only; they are NOT source-timecoded phone labels. Counts overlap because clips can contain multiple actions.

## Files
- [clips.csv](manifests/clips.csv) — stable IDs, source/ref metadata, original text, timing-label summary, description-only candidates, actor and no redistribution status.
- [events.csv](manifests/events.csv) — source-level timestamp spans with original and normalized labels, flags for invalid intervals.
- [pilot_candidates.csv](manifests/pilot_candidates.csv) — 38 starting examples pending video audit.
- [import_summary.json](reports/import_summary.json) / [import_warnings.json](reports/import_warnings.json) — import statistics and explicit issues.
- [label_schema.json](label_schema.json) — taxonomy and evidence hierarchy.
- [sources.md](sources.md) — additional datasets, availability and rights review.
- [tools/validate.py](tools/validate.py) — cross-file integrity tests.
- [tools/probe.py](tools/probe.py) — downloads selected samples temporarily, verifies playable media, duration and SHA256 without rehosting videos.
- [evaluation_protocol.md](evaluation_protocol.md) — fair multi-model comparison protocol.

## Evidence and annotation rules

1. **source_csv_timecoded**: a publisher CSV bracketed time interval (e.g. `Sleeping[2 to 8]`). This is original authored ground truth, not a new independent adjudication.
2. **description_only**: a phone or smartphone action mentioned in a narrative description. It is a **candidate** only; neither time intervals nor true positive evaluation permitted until reviewed.
3. **visual_verified**: only after explicit visual inspection of the exact decoded sequence and a review note; initially all clips are **pending**.
4. Invalid intervals are never repaired silently. Person/scene, label translation and video hashes must be retained for any clips used in formal model comparisons.
5. **sleeping** is the dataset's description, but video alone cannot necessarily prove physiologic sleep. Keep `lying` distinct.
6. **falling** describes a simulated fall, not a medically verified involuntary fall. Never confuse a fall with sitting down/lying down.
7. A video may have several actions. Use windowed multi-label scoring or selected single-label windows; don't coerce a mixed-activity clip into a single definitive class.
8. Do not redistribute video or thumbnails in public site/HF/GitHub until **dataset rights and participant likeness/privacy** are cleared. Article CC-BY and GitHub MIT do not automatically grant blanket reuse of all participant likeness rights.

## Dataset protocol

For **zero-shot comparison**, all inspected clips can belong to a frozen evaluation pool if their usage did not influence model selection. For **training/micro-tuning**, use fixed person-disjoint groups (proposed S1/S2 train, S3 validation, S4 test; this is a policy candidate, not a finalized fair split and very small participant count). Never let frames from the same `group_id` or derived clips leak across splits.

For V1.0 target 120 clips, plan 15 each for call/use/eating/sleeping/falling/walking plus 30 confounders. Current GMD source cannot satisfy that quota. More external dataset acquisition is required. Do not generate placeholder IDs or infer labels.

**No changes to main/dev or deployed HF Space are authorized by this data branch.**

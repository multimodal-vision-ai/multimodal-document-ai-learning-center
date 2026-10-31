# Multi-model action evaluation protocol — MVAI v1.0

**Task types must not be mixed**: clip-level (single-label) classification, multi-label temporal classification, and person-level spatiotemporal detection require separate leaderboards.

1. Freeze source tag/release, source CSV row, group_id (person), video SHA256, window start/end and RGB decode parameters before comparing models.
2. Use a deterministic sampling policy for each model and report frame count, fps, crop/resize and normalization; do not claim identical numerical input when model preprocessing differs.
3. Record per-model label mappings from its actual `id2label`. Mark target classes absent from checkpoint as `unsupported` and do not count as mistakes on unsupported categories; compare shared label subsets and full target coverage separately.
4. **Ground truth**: score CSV timecodes only if quality=normal and visual review complete. Phone call/use cues from descriptions are unverified and excluded from formal accuracy unless manually annotated into exact windows.
5. For multiple actions, evaluate each window separately. Split long videos into overlapping 3–5s windows *without crossing an action boundary*, or assess multilabel temporal overlap with consistent windows.
6. Metrics: per-class sample count, top-1/top-5 recall on supported classes, macro-F1/balanced accuracy (when sample counts adequate), confusion matrix, false-positive rate on confounder cases, cold-start and steady-state CPU latency (model vs decode separately), download size and peak RSS.
7. Avoid same-subject data leakage. If training, split by subject group, not randomly by derived clip or frame; report subject and environment count.
8. Use >=10 independent, manually verified clips/class for an exploratory comparison; more and multi-person balance needed for publishable confidence. Do not report confidence intervals or claims of SOTA from the pilot alone.
9. Human review notes must include reviewer, timestamp, start/end, whether the actual action appears, ambiguous/occluded objects, and any correlated privacy restrictions.
10. No full source videos or frame images redistributed via this branch; provenance and machine-readable non-media metadata only.

Recommended prediction schema: `clip_id,window_start_s,window_end_s,model_id,checkpoint_sha,topk_labels_pipe,topk_scores_pipe,inference_ms,preprocess_ms,device,model_labelspace,run_timestamp`.

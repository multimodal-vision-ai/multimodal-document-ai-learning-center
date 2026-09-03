# Weekly Project Status Template

Last updated: 2026-09-03

## How to use

1. Duplicate the section "Blank Weekly Template" for each reporting date.
2. Keep all "Facts" fields evidence-based and branch-specific.
3. Keep "Assessment" separate from "Facts".
4. Keep "Next week actions" to 3-5 executable items.

---

## Blank Weekly Template

### 1. Basic info

- Report date:
- Reporter:
- Target branch:
- Comparison branch:

### 2. Facts

- Branch sync status:
- Working tree status:
- Number of changed files:
- Latest commits this week:
- Release/deploy trigger status:

### 3. Scope of this week

- Main focus:
- Updated modules/pages:
- What was not touched:

### 4. Progress (% complete)

- Course architecture stability:
- Documentation standardization:
- Experiment/project guidance completeness:
- Publishing pipeline readiness:
- Overall progress:

### 5. Risks and blockers

- Risk 1:
	- Impact:
	- Current mitigation:
	- Owner:
- Risk 2:
	- Impact:
	- Current mitigation:
	- Owner:

### 6. Assessment

- What is going well:
- What is uncertain:
- Decision needed:

### 7. Next week actions (3-5 items)

1. 
2. 
3. 
4. 
5. 

### 8. Evidence links

- README / entry:
- Deploy workflow:
- Site config:
- Changed file list:
- Optional build result:

---

## Snapshot Example (Aligned to current repo facts)

### 1. Basic info

- Report date: 2026-09-03
- Reporter: Copilot status snapshot
- Target branch: dev
- Comparison branch: origin/main, origin/dev

### 2. Facts

- Branch sync status:
	- dev vs origin/dev: synced (0 ahead, 0 behind)
	- dev vs origin/main: 0 ahead, 1 behind (main has one merge commit ahead)
- Working tree status: dirty
- Number of changed files: 6 documentation files
- Latest commits this week window: no new commits after 2026-08-22 on current branch head
- Release/deploy trigger status: deploy workflow triggers on push to main

### 3. Scope of this week

- Main focus: unify evidence contract and learning path handoff clarity
- Updated modules/pages:
	- docs/learning/07_Doc_AI.md
	- docs/learning/09_FAQ.md
	- docs/learning/10_Assessment_and_Submission.md
	- docs/learning/11_Learning_Log_Template.md
	- docs/experiments/README.md
	- docs/experiments/Experiment_01/README.md
- What was not touched:
	- mkdocs.yml
	- deployment workflow logic
	- Python/code runtime files

### 4. Progress (% complete)

- Course architecture stability: 90%
- Documentation standardization: 80%
- Experiment/project guidance completeness: 85%
- Publishing pipeline readiness: 95%
- Overall progress: 88%

### 5. Risks and blockers

- Risk 1: Uncommitted edits are not reviewable by PR
	- Impact: changes are not visible to collaborators and cannot be published
	- Current mitigation: commit to dev with focused message and open dev to main PR
	- Owner: current maintainer
- Risk 2: Page-level "last updated" values still show 2026-08-07
	- Impact: readers may think recent improvements are outdated or not maintained
	- Current mitigation: update timestamp lines when this doc round is finalized
	- Owner: doc maintainer

### 6. Assessment

- What is going well: structure and pedagogy are converging to a single evidence model
- What is uncertain: whether this round needs another review pass before merge
- Decision needed: merge now as doc quality baseline or add one more editorial QA pass

### 7. Next week actions (3-5 items)

1. Commit current 6-file doc update on dev with one topic-focused commit.
2. Run strict build and internal link check before PR.
3. Open dev to main PR and request one reviewer.
4. Refresh page-level "last updated" lines for modified pages.
5. Record one release note in reports after merge.

### 8. Evidence links

- README / entry: README.md
- Deploy workflow: .github/workflows/deploy.yml
- Site config: mkdocs.yml
- Changed file list: git status -sb
- Optional build result: mkdocs build --strict

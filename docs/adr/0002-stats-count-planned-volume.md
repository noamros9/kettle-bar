# 2. Stats count planned volume

**Status:** accepted (Sep 2026)

## Context
Stats (roadmap phase 2) want sets, reps and a muscle-balance heat map. That could come from logging every
set, or from what each done day is written with.

## Decision
A day is either done or not. Stats count the **planned** sets and reps of done days. There is no per-set
logging of weights or reps.

## Consequences
- Marking a day done is still one tap; the data model stays `{day: time}`.
- Stats overstate volume on days where sets were skipped. Accepted.
- Don't re-suggest per-set logging (see ROADMAP "Decided against").

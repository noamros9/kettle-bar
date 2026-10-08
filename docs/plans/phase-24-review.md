# Phase 24: architecture review V and code review, then the fixes

Issues [#187](https://github.com/noamros9/kettle-bar/issues/187) and [#188](https://github.com/noamros9/kettle-bar/issues/188).
Grilled 7 Oct 2026 (Noam); decisions 139–141 below. After Phase 23 (140): the app at
~1,140 programs. Earlier reviews: [III](architecture-review-3.md), [IV](architecture-review-4.md); read their
findings first, so nothing already decided is re-raised.

## Decisions
Grilled 7 Oct 2026 with Noam (global decision numbers).
- **139 · One phase for both reviews** (architecture V, #187, and the code review, #188).
- **140 · After Phase 23**, so it reviews the library at full size before new features land.
- **141 · Review just before fixing**: findings are triaged (fix now / issue / drop), fix tickets join this plan and
  are built right away. Only what's too big for one ticket becomes an issue.
- **186 · Tests that don't earn their keep are deleted** in the fix tickets; each PR says what still covers them.
- **275 · Both reviews also look ahead** at what Phases 25–34 need (catalogues 14–16, new progress fields, export,
  sync status), as "cheaper now" findings. *(8 Oct)*
- **187 · A stored shape or sync rule that should change goes to Noam** and becomes an issue, never a fix here (old
  backups must still import).

## What lands
- **Two findings files** (139): `docs/reviews/architecture-5.md` and `docs/reviews/code-review.md`. Each finding:
  what, where (file and line), evidence (a measurement, a failing case or a grep), size (S: one ticket, M: two, L: an
  issue), and the proposed fix.
- **The fixes, in this phase** (141): Claude triages every finding (fix now / issue / drop, with a one-line why),
  adds the fix-now ones as tickets 4 onward to this plan, and builds them straight after.

## How the later decisions land in the tickets
- **Tests that don't earn their keep are deleted in the fix tickets** (186), each PR saying what still covers them.
- **A stored shape or sync rule that should change goes to Noam and becomes an issue** (187), never a fix ticket here.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/unplanned-phases` | done (PR #281) |
| 1 | Architecture review V: measure, then read | review | – | `review/architecture-5` | todo |
| 2 | Code review | review | – | `review/code` | todo |
| 3 | Triage: fix tickets added to this plan, ADRs, issues | plan | 1, 2 | `plan/p24-triage` | todo |
| 4+ | The fixes (from ticket 3) | feature | 3 | – | todo |
| last | Close the phase: archive, CONTEXT.md | plan | 4+ | `plan/p24-close` | todo |

Tickets 1 and 2 only write their own findings file, so they can run at once (the cap of 2).

### 1. Architecture review V
- **Measure first** (numbers before opinions), with throwaway scripts under the scratch folder, not committed:
  the boot (index.html to the first Programs draw, cold and with the cache, on a 4× CPU throttle); the library fetch
  and parse; the number of cloud listeners and redraws when a signed-in account with 20 started programs syncs
  (ticket 17.2's "each first reply redraws the page"); memory after opening 30 program pages; the build and deploy
  times. Compare with Phase 23's "Measured".
- **Then read:** the module seams (Program Catalogue, Progress Store, Day, Workout Session, recipe book), what the
  page loads up front vs on demand, the shapes stored in Firestore and on the device, the service worker's cache,
  and what each later phase (25 Do now, 26 longer programs, 27 calisthenics, 19 super programs, 28 drawings) will need
  from them: a finding can be "Phase 19 will need X; it's cheaper now".
- **Files:** `docs/reviews/architecture-5.md` only.
- **Done when:** every finding has evidence and a size; the measurements are in the file; nothing re-raises a "decided
  against" item or an earlier review's settled point.

### 2. Code review
- **Read for:** correctness (the rules that never bend: pins, own programs from their config, sync and backup
  shapes), dead code (exports nothing imports, branches the coverage report never takes, CSS no page uses),
  duplication (the same rule written twice, e.g. levels, minutes, equipment fit), and tests that no longer earn their
  keep (the slowest unit and UI tests by the runner's timings, tests that only re-check what another test checks,
  snapshots nobody reads).
- **Files:** `docs/reviews/code-review.md` only.
- **Done when:** every finding has evidence and a size; the ten slowest tests are listed with what each catches that
  nothing else does.

### 3. Triage
- Each finding marked **fix now** (S or M, and safe to do in this phase), **issue** (L, or needs Noam: opened, linked),
  or **drop** (with why). A fix that changes a decided behaviour, a stored shape, or a test Noam asked for goes to
  Noam first, as short multiple-choice questions; the rest go straight in. A decision with a "why" gets an ADR.
- Tickets 4 onward are written in this plan in the usual form (what, files, **Test first**, **Done when**).
- **Done when:** both findings files say every finding's fate; the plan's ticket table has the fixes.

## Challenge round
- **Weakest assumption: that a review can be planned before its findings exist.** It can't be fully: tickets 4+ are
  unknown. The plan fixes how they are found, sized and triaged, and that they are built in this phase (141); the
  triage ticket is where the real plan is written. Noam asked for the review to run just before fixing, which this
  keeps: no gap between finding and fixing.
- **What I hadn't read:** reviews III and IV's open findings, and the coverage report's uncovered lines today. Both
  are read in tickets 1 and 2 before anything else.
- **The lazier version:** one review ticket for both. Not proposed: architecture needs measurements on a throttled
  phone profile, the code review needs a line-by-line read; split, they run at once and each stays one review's worth.
- **Risk:** the review finds that the library at ~1,140 programs should be split (Phase 23's ticket 1b). If Phase 23
  already did it, the review checks it held; if it didn't, the split is a likely fix-now ticket here.

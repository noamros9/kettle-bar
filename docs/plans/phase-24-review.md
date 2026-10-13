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
- **332 · One progress listener, fixed in this phase** (A1): sign-in listens to the progress collection once instead
  of to each of 1,060 programs; the documents and their shape stay as they are. Noam's exception to 187. *(13 Oct)*
- **333 · Triage (13 Oct):** A2, A3, A5, A6, A7, C1, C2, C3 and the slow tests are fixed here (tickets 4–12, three at a
  time); A4 is issue [#393](https://github.com/noamros9/kettle-bar/issues/393). *(13 Oct)*

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
| 1 | Architecture review V: measure, then read | review | – | `review/architecture-5` | done (PR #391) |
| 2 | Code review | review | – | `review/code` | done (PR #391) |
| 3 | Triage: fix tickets added to this plan, ADRs, issues | plan | 1, 2 | `plan/p24-triage` | done (PR #394) |
| 4 | Exercises page: figures drawn when near view (A2) | feature | 3 | `fix/exercise-figures` | done (PR #395) |
| 5 | One progress listener (A1, 332) | feature | 3 | `fix/one-progress-listener` | todo |
| 6 | Own-program pins (C1) | test | 3 | `test/own-pins` | todo |
| 7 | Programs search refreshes only its results (A3) | feature | 3 | `fix/program-search` | todo |
| 8 | The offline cache drops old program lists (A5) | feature | 3 | `fix/offline-prune` | todo |
| 9 | Slow tests: delete or cheapen (186) | test | 3 | `test/slow-tests` | todo |
| 10 | CI: the build cache before the unit tests; finder smoke when it matters (A6) | ci | 9 | `ci/unit-cache` | todo |
| 11 | The recipe cache in its own workflow (A7) | ci | 10 | `ci/recipe-workflow` | todo |
| 12 | One "needs gear" rule, and the dead code (C3, C2) | refactor | 3 | `refactor/gear-rule` | todo |
| 13 | Close the phase: archive, CONTEXT.md | plan | 4–12 | `plan/p24-close` | todo |

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

### 4. Exercises page: figures drawn when near view (A2)
- **Build:** the Exercises page's cards render an empty `figbox` (`data-fig="<id>"`) instead of the SVG; one
  IntersectionObserver (rootMargin one screen) fills a box with `fig(id)` when it comes near and stops watching it.
  The exercise page (one big figure) is unchanged. (`content-visibility: auto` on the cards was tried and dropped: an
  estimated height for cards off screen moved Back's restored place by ~36 px.)
- **Files:** `app/pages/exercises.js`, `app/ui.js` (the observer, re-armed after each render), `app/styles.css`,
  `tests-ui/exercises.spec.js`.
- **Test first:** `tests-ui/exercises.spec.js`: the page's HTML holds no `<svg class="fig">` past the first screen
  until it is scrolled to; the first cards draw at once; scrolling to the last card draws its figure; a redraw at 4×
  CPU (`render()` timed in the page) is under 1.2 s (from 3,038; ~480 ms measured).
- **Done when:** the spec passes; `renders.spec.js` and `actions.spec.js` green; 390 px screenshots light and dark.

### 5. One progress listener (A1, 332)
- **Build:** `store.attach` listens to progress with `subscribeAll('progress')` when the remote has it (Firestore and
  the memory remote do), and hands each document that changed to `onRemote(pid, …)` as today; programs with no
  document get the same first-sync treatment (`seen`, `mergeFirstSync` with `null`) once the first delivery arrives,
  so a device's own progress for a program the cloud has never seen is still written up. `follow`/per-document
  `subscribe` stays only for a remote without `subscribeAll`. Own programs added later need nothing (the collection
  listener covers them).
- **Files:** `app/store.js`, `firebase-sync.js` (subscribeAll already exists; check it passes ids), `tests/store*.test.js`,
  `tests-ui/sync.spec.js`, `tests-ui/devices.js`.
- **Test first:** `tests/store.test.js`: attach makes one `subscribeAll('progress')` and no per-program `subscribe`;
  a first delivery with 2 of 5 programs merges those two and writes up the three local-only ones that have progress;
  a later delivery changes only what changed; an echo of our own write redraws nothing; detach unsubscribes.
- **Done when:** the unit tests and `tests-ui/sync.spec.js`, `outbox.spec.js`, `build.spec.js` and `random.spec.js`'s
  two-browser tests pass; measured: a sign-in with 20 started programs makes 1 progress listener (was 1,060).

### 6. Own-program pins (C1)
- **Build:** `tests/fixtures/own-days.json`: one own-program config per recipe-book subject and four mixes (made once
  from today's book with fixed seeds, the config stored like a real record) and the SHA-256 of its days; a plain unit
  test builds each from its stored config and compares. A real change is a decision: the test's message says so.
- **Files:** `tests/own-pins.test.js`, `tests/fixtures/own-days.json`, `scripts/own-pins.js` (writes the fixture once).
- **Test first:** the test itself, on today's code; then it fails when a builder pool order is changed on purpose (checked
  once by hand, not committed).
- **Done when:** the test runs in under 20 s and passes in CI.

### 7. Programs search refreshes only its results (A3)
- **Build:** typing in `#prog-search` redraws only the results region (shelves, counter), at most once a frame; the
  field is never redrawn, so focus and caret need no restoring.
- **Files:** `app/main.js`, `app/pages/programs.js`, `tests-ui/library.spec.js`.
- **Test first:** `tests-ui/library.spec.js`: typing keeps the same input element (no redraw of it), the results and
  counter follow each keystroke, clearing restores the shelves.
- **Done when:** the spec passes; a keystroke's redraw at 4× is measured under 150 ms (from 397).

### 8. The offline cache drops old program lists (A5)
- **Build:** after the current list loads, the page deletes every other `data/library.json?v=` entry from
  `kettle-bar-v2` (the service worker and the page share it).
- **Files:** `app/pages/core.js` (or `app/lazy.js`), `tests-ui/offline.spec.js`.
- **Test first:** `tests-ui/offline.spec.js`: a cache holding an older `?v=` list keeps only the current one after a
  boot, and the app still opens offline.
- **Done when:** the spec passes.

### 9. Slow tests: delete or cheapen (186)
- **Build:** per [the code review's table](../reviews/code-review.md#tests-that-dont-earn-their-keep-186): drop
  `library-cache`'s `buildAll()` comparison; `recipes`' every-subject test with one seed; `programs`' Phase 23 count
  test reads `built(ids)`; `build`'s +100 programs test renders 50 and 150; delete `catalogue8`'s and `catalogue9`'s
  "never draw" tests (pins cover them); `skip.spec.js:95` finds its day through `data/index.json` instead of
  building the library.
- **Files:** those test files only.
- **Test first:** nothing new: each change keeps or removes a check; the PR lists what still covers each removed one.
- **Done when:** CI green; the unit step and the phone jobs measured faster than run 38359068531 (402 s; 338 / 200 s).

### 10. CI: the build cache before the unit tests; finder smoke when it matters (A6)
- **Build:** the test job restores `.build-cache` before the unit step, and `tests/helpers/library.js` builds through
  `cachedBuild()`; the finder smoke step runs on main always and on a PR only when `app/finder*.js`,
  `scripts/vendor-finder.js`, `scripts/finder-smoke.js`, `build.js` or `app/programs.js` changed.
- **Files:** `.github/workflows/deploy.yml`, `tests/helpers/library.js`, `tests/library-cache.test.js`.
- **Test first:** `tests/library-cache.test.js`: the helper's library comes from the build cache folder when one is given.
- **Done when:** a PR run shows the unit step faster again and no finder smoke on an unrelated change.

### 11. The recipe cache in its own workflow (A7)
- **Build:** the `recipe-cache` job moves to `.github/workflows/recipe-cache.yml`, started by `workflow_run` on a
  successful Test and deploy run on main, with its own concurrency group; same steps, same branch and artifact.
- **Files:** `.github/workflows/deploy.yml`, `.github/workflows/recipe-cache.yml`.
- **Test first:** none (workflow only).
- **Done when:** after the merge, main's next run finishes without waiting for the recipe job, and the recipe workflow
  runs after it and pushes the branch.

### 12. One "needs gear" rule, and the dead code (C3, C2)
- **Build:** `KBEx.needs(e, gear)` in `exercises.js`, used in the nine places; `.soon` and the two unused exports go.
- **Files:** `exercises.js`, `app/library.js`, `app/swaps.js`, `app/pages/exercises.js`, `program-builder.js`,
  `scripts/check-new.js`, `app/styles.css`, `app/backup.js`, `recipe-book.js`, `tests/catalogue.test.js`.
- **Test first:** `tests/catalogue.test.js`: `needs` for a bar, a kettlebell, dumbbells and none.
- **Done when:** pins unchanged (the build's gate) and CI green.

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

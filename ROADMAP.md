# Kettle & Bar roadmap

The index: where we are, what comes next, and the two phases being built now. Every other phase's decisions live at the
top of its plan in [docs/plans/](docs/plans/); open a plan only when its phase comes up. Decision numbers are global
(the next one is **380**). Finished phases: [docs/roadmap-archive.md](docs/roadmap-archive.md).

## Resume here (16 Oct 2026)
- **Phase 36 is done** (16 Oct; #474–#477, archived): every couple session is dealt in order, one place per set,
  checked over every couple program (`tests/session-order.test.js`). The order wins over equal odds (366).
- **Phase 35 resumed ahead of 27 and 19** (Noam, 16 Oct): tickets 2a–2c now, then a stop for his go. Foursomes
  were added to it (367–379, tickets 8a–8m after 6x); 35 is catalogue 16, foursomes 17, Phase 27 moves to 18 (367).
- **Phase 20 is done** (16 Oct, archived): 1,395 programs, Explicit 98.
- **Phases 26 and 34 are done** (#436–#445; #451, #453, #457, #459; archived).
- **A Grok content ticket** (text only, 339) runs as Phase 20's did: see its steps in the archive.
- **Grok usage:** measured for 9–12 in [docs/grok-usage.md](docs/grok-usage.md); measuring stopped (Noam, 15 Oct).
- **Working rules** are in [CLAUDE.md](CLAUDE.md). Don't put shared page logic in `app/library.js` or other files in
  the build cache's key (`build-cache.js` CODE / RECIPE_CODE): a change there makes every build cold.

## The order
Set 7 Oct 2026 (decision 134): Noam put "Do now" right after the review and left the rest to Claude; Phase 30 goes
right after Phase 22 (216). **223 ·** 8 Oct: quick fixes after 22; Export, day to day II after Do now; short days after 26.

| # | Phase | Issue | Plan | Status |
|---|---|---|---|---|
| 1 | 27 · Calisthenics: twelve skills, 25 programs | [#199](https://github.com/noamros9/kettle-bar/issues/199) | [plan](docs/plans/phase-27-calisthenics.md) | planned |
| 2 | 19 · Super programs: 120 days from several programs | [#186](https://github.com/noamros9/kettle-bar/issues/186) | [plan](docs/plans/phase-19-super-programs.md) | planned |
| 3 | 35 · Catalogue 16: threesomes (their own kind and in every act), every act at every place; 17: foursomes | – | [plan](docs/plans/phase-35-threesomes-and-places.md) | building (2a–2c) |
| 4 | 28 · Explicit drawings and loops | [#249](https://github.com/noamros9/kettle-bar/issues/249) | [plan](docs/plans/phase-28-explicit-drawings.md) | planned |
| 5 | 29 · Stories from the couple workouts, in Drive | [#225](https://github.com/noamros9/kettle-bar/issues/225) | [plan](docs/plans/phase-29-stories.md) | planned, last |

- **295 · Grok away the week of 9 Oct**: Opus builds 31 → 30 → 23 … alone, in order; Phase 20 (Grok writes its
  text) moves to just before 35, after Phase 36. *(9 Oct)*
- **294 · Phase 35 goes late** (row 14, was 15), after the super programs and before the explicit drawings: its own +8 programs per subject carry the new exercises, so
  nothing waits for it. *(9 Oct)*
- **135 · #225 was planned early**; replanned when it starts if need be.
- **136 · Plans are ready, not frozen**: before a phase's first ticket, re-read its Challenge round; counts and files
  move while earlier phases land, and a ticket whose facts changed is fixed in its plan before hand-off.

## Backlog
- **Test a restore from the nightly backup** on the phone ([#16](https://github.com/noamros9/kettle-bar/issues/16)).
- **Cut the test and CI times** ([#265](https://github.com/noamros9/kettle-bar/issues/265)). Already done: only the
  affected UI specs run locally; the sync tests run ~35% faster; CI runs in Playwright's image and cancels older runs;
  Markdown-only commits skip the tests; a first CI job builds the library once and the test and UI jobs read its cache
  (#438, 15 Oct: a builder change had three jobs building cold at once). More workers don't help on 2 cores.
  **322 ·** The build cache is done (13 Oct, archived): builds read unchanged programs from `.build-cache/`.

## Decided against (don't re-suggest)
- **The cold-build check nightly instead of on every main push**: decision 327 stays per merge (Noam, 16 Oct 2026).
- **Logging weights or reps per set**: done / not done only.
- **Adaptive plans**: no test days, no too-easy/too-hard nudging, no deloads. Plans stay as written.
- **Streaks, consistency targets, program-progress stats, push/pull ratios, neglected-muscle alerts.** (The History
  calendar is fine.)
- **Voice countdowns, "what's next" and encouragement**: holds and sides only.
- **A Hebrew version** and **share as image**: not for now.
- **Animated workout cards**: exercise pages only.
- **Heart rate / Google Fit**: only if the app goes native.
- **"New" marking on new programs** (199).
- **A 60-day strip on the program page** and **a Random workout home-screen shortcut** (#97's ideas 4 and 8, 249).

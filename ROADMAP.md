# Kettle & Bar roadmap

The index: where we are, what comes next, and the two phases being built now. Every other phase's decisions live at the
top of its plan in [docs/plans/](docs/plans/); open a plan only when its phase comes up. Decision numbers are global
(the next one is **409**). Finished phases: [docs/roadmap-archive.md](docs/roadmap-archive.md).

## Resume here (17 Oct 2026)
- **Phase 35: 2a–2g done** (16–17 Oct; #479–#481, #486–#491): the Group sex tab (2t1), a random name per exercise
  outside a workout (2t2), and 252 threesome exercises at catalogue 16; 2d–2g are 36 each, half the other pairing
  (`pair: 'other'`: you on the other woman, or the other man on Mali), their drawings' colours swapped to match.
  **Replanned 17 Oct (387–398):** group sex only in group programs; per-act counts, the Threesome kind 144, place threesomes
  36 and place foursomes 18 per place, act +8 programs dropped, group session order (5b), colours by sex (2t3).
  **CI and build times (399, 400):** 2t4–2t6 after 2t3 (LF endings, unit and UI shards).
  **Next: 2t3 (colours), 2t4, 2t5; three per go, on his go.** Foursomes are in the plan (367–379, 392, 395; 8a–8n after 6x);
  35 is catalogue 16, foursomes 17, Phase 38 18, Phase 27 19 (408).
- **How a threesome act ticket runs** (2d–2g): Grok writes `grok/p35/t2X-text.md` from the previous ticket's prompt
  (copy `t2g-prompt.md`, swap the act's rules and bases); Claude reviews it, `node grok/p35/place2X.js` (a copy of
  `place2d.js`) places the thirds, `node grok/p35/redo.js 2X <prefix>3_ "<label>"` emits the rows, `sheet.js <sub>`
  draws the sheet (all in `grok/p35/`, gitignored: on the laptop only); fix overlaps in `places-2X.json` by hand. Names go through `nameMali` in the emit script; rim cues
  say "her tongue". Claude checks the sheet; Noam no longer approves it (17 Oct).
- **The Pool day-16 review waits for a phase of its own** (Noam, 17 Oct): see Backlog.
- **CI time:** `app/families.js` holds `FAMILIES`, the only part of `app/library.js` the recipe book reads, so an
  Exercises-page change no longer builds the book cold (2t2).
- **The laptop never hits the CI build cache:** its checkout has CRLF endings, CI LF, so the code hash differs and
  `cache:pull` reads nothing; a local cold build (~10 min) warms it for that tree.
- **Phase 20 is done** (16 Oct, archived): 1,395 programs, Explicit 98.
- **Phases 26 and 34 are done** (#436–#445; #451, #453, #457, #459; archived).
- **A Grok content ticket** (text only, 339) runs as Phase 20's did: see its steps in the archive.
- **Grok usage:** measured for 9–12 in [docs/grok-usage.md](docs/grok-usage.md); measuring stopped (Noam, 15 Oct).
- **Working rules** are in [CLAUDE.md](CLAUDE.md). Don't put shared page logic in `app/families.js` or other files in
  the build cache's key (`build-cache.js` CODE / RECIPE_CODE): a change there makes every build cold.

## The order
Set 7 Oct 2026 (decision 134): Noam put "Do now" right after the review and left the rest to Claude; Phase 30 goes
right after Phase 22 (216). **223 ·** 8 Oct: quick fixes after 22; Export, day to day II after Do now; short days after 26.

| # | Phase | Issue | Plan | Status |
|---|---|---|---|---|
| 1 | 35 · Catalogue 16: threesomes (their own kind and in every act), every act at every place; 17: foursomes | – | [plan](docs/plans/phase-35-threesomes-and-places.md) | building |
| 2 | 38 · Catalogue 18: the workout side catches up (bands, jump rope, 432 exercises, 224 programs) | – | [plan](docs/plans/phase-38-workout-rebalance.md) | planned |
| 3 | 27 · Calisthenics: twelve skills, 25 programs (catalogue 19, 408) | [#199](https://github.com/noamros9/kettle-bar/issues/199) | [plan](docs/plans/phase-27-calisthenics.md) | planned |
| 4 | 19 · Super programs: 120 days from several programs | [#186](https://github.com/noamros9/kettle-bar/issues/186) | [plan](docs/plans/phase-19-super-programs.md) | planned |
| 5 | 28 · Explicit drawings and loops | [#249](https://github.com/noamros9/kettle-bar/issues/249) | [plan](docs/plans/phase-28-explicit-drawings.md) | planned |
| 6 | 29 · Stories from the couple workouts, in Drive | [#225](https://github.com/noamros9/kettle-bar/issues/225) | [plan](docs/plans/phase-29-stories.md) | planned, last |

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
- **A couple-program audit, a phase of its own** (Noam, 17 Oct): the Pool program "Set, then wall", day 16 ("Stomach
  Cold and Pussy Hot") breaks the guidelines (ice twice: `him:ice` escapes rule 6; no warm-up though the about promises
  one; a pool name on a home day), and more like it will turn up. A fix moves built days and trips pins: Noam's call.

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

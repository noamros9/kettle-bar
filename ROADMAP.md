# Kettle & Bar roadmap

The index: where we are, what comes next, and the two phases being built now. Every other phase's decisions live at the
top of its plan in [docs/plans/](docs/plans/); open a plan only when its phase comes up. Decision numbers are global
(the next one is **313**). Finished phases: [docs/roadmap-archive.md](docs/roadmap-archive.md).

## Resume here (9 Oct 2026, evening)
- **Phase 22 is done** (9 Oct, #299–#334): catalogue 13 complete, 144 new couple programs, own programs and random
  workouts open at catalogue 13. Archived in [docs/roadmap-archive.md](docs/roadmap-archive.md).
- **Next: Phase 31** (quick fixes), then 30, 23, 24 … in the order below. **Opus builds alone this week** (295): Grok is
  away, so no Grok tickets; Phase 20 waits for it.
- **New, 9 Oct:** Phase 36, logical sessions (296–306), right before Phase 20: couple sessions keep an order and a place
  per set. Guidelines for whoever writes couple programs: [docs/explicit-guidelines.md](docs/explicit-guidelines.md).
- **Rules added 9 Oct** (CLAUDE.md): plan the next Grok ticket while one builds; time targets may run 10% over (the
  cool-down to 150 s); the short-day check counts fitness programs only.
- **Working rules** are in [CLAUDE.md](CLAUDE.md): at most 2 tickets building, the next ticket at every checkpoint, one
  phase at a time, every Grok ticket plans first.
- **Worktrees:** `../kettle-bar-docs` is the spare (`npm ci` done; UI tests there use `UI_PORT=4174`).
  `../kettle-bar-cachefix` is Noam's #253 branch.

## The order
Set 7 Oct 2026 (decision 134): Noam put "Do now" right after the review and left the rest to Claude; Phase 30 goes
right after Phase 22 (216). **223 ·** 8 Oct: quick fixes after 22; Export, day to day II after Do now; short days after 26.

| # | Phase | Issue | Plan | Status |
|---|---|---|---|---|
| 1 | 31 · Quick fixes: Back keeps your place, preview = saved, the flaky sync test | [#214](https://github.com/noamros9/kettle-bar/issues/214), [#111](https://github.com/noamros9/kettle-bar/issues/111), [#105](https://github.com/noamros9/kettle-bar/issues/105) | [plan](docs/plans/phase-31-quick-fixes.md) | planned |
| 2 | 30 · Muscle groups on three levels, and doing a day again | [#287](https://github.com/noamros9/kettle-bar/issues/287) | [plan](docs/plans/phase-30-muscle-groups-and-again.md) | planned |
| 3 | 23 · New fitness programs, the Signature IIs, Yoga, Pilates and Variety doubled | [#216](https://github.com/noamros9/kettle-bar/issues/216) | [plan](docs/plans/phase-23-fitness-programs.md) | planned |
| 4 | 24 · Architecture and code review, then the fixes | [#187](https://github.com/noamros9/kettle-bar/issues/187), [#188](https://github.com/noamros9/kettle-bar/issues/188) | [plan](docs/plans/phase-24-review.md) | planned |
| 5 | 25 · "Do now": one exercise for dead time | [#200](https://github.com/noamros9/kettle-bar/issues/200) | [plan](docs/plans/phase-25-do-now.md) | planned |
| 6 | 32 · Export an exercise, a day or a program | [#224](https://github.com/noamros9/kettle-bar/issues/224) | [plan](docs/plans/phase-32-export.md) | planned |
| 7 | 33 · Day to day II: weekdays, a day note, pause, compare, programs that use this, sync status | [#291](https://github.com/noamros9/kettle-bar/issues/291)–[#296](https://github.com/noamros9/kettle-bar/issues/296) | [plan](docs/plans/phase-33-day-to-day-2.md) | planned |
| 8 | 26 · Longer programs, half at 35–38 min | [#198](https://github.com/noamros9/kettle-bar/issues/198) | [plan](docs/plans/phase-26-longer-programs.md) | planned |
| 9 | 34 · Short days: 15-min circuits, a 10-min rest-day flow | [#110](https://github.com/noamros9/kettle-bar/issues/110) | [plan](docs/plans/phase-34-short-days.md) | planned |
| 10 | 27 · Calisthenics: twelve skills, 25 programs | [#199](https://github.com/noamros9/kettle-bar/issues/199) | [plan](docs/plans/phase-27-calisthenics.md) | planned |
| 11 | 19 · Super programs: 120 days from several programs | [#186](https://github.com/noamros9/kettle-bar/issues/186) | [plan](docs/plans/phase-19-super-programs.md) | planned |
| 12 | 36 · Logical sessions: an order and a place per set for every couple session | – | [plan](docs/plans/phase-36-logical-sessions.md) | planned |
| 13 | 20 · After dark refined, the Explicit set, +50% programs (tickets 8b–23 left) | [#202](https://github.com/noamros9/kettle-bar/issues/202) | [plan](docs/plans/phase-20-after-dark-explicit.md) | paused after ticket 8; waits for Grok |
| 14 | 35 · Catalogue 14: threesomes (their own kind and in every act), every act at every place | – | [plan](docs/plans/phase-35-threesomes-and-places.md) | planned, tickets to write |
| 15 | 28 · Explicit drawings and loops | [#249](https://github.com/noamros9/kettle-bar/issues/249) | [plan](docs/plans/phase-28-explicit-drawings.md) | planned |
| 16 | 29 · Stories from the couple workouts, in Drive | [#225](https://github.com/noamros9/kettle-bar/issues/225) | [plan](docs/plans/phase-29-stories.md) | planned, last |

- **295 · Grok away the week of 9 Oct**: Opus builds 31 → 30 → 23 … alone, in order; Phase 20 (Grok writes its
  text) moves to just before 35, after Phase 36. *(9 Oct)*
- **294 · Phase 35 goes late** (row 14, was 15), after the super programs and before the explicit drawings: its own +8 programs per subject carry the new exercises, so
  nothing waits for it. *(9 Oct)*
- **135 · #225 was planned early**; replanned when it starts if need be.
- **136 · Plans are ready, not frozen**: before a phase's first ticket, re-read its Challenge round; counts and files
  move while earlier phases land, and a ticket whose facts changed is fixed in its plan before hand-off.

## Phase 20 (paused): After dark refined, and an Explicit set
Grilled 5 Oct 2026 on [#202](https://github.com/noamros9/kettle-bar/issues/202); Grok builds, Claude reviews.
Numbered 20 because 19 is super programs.
- **67 · Paused after ticket 8**; tickets 9–15 resume after Phase 22.
- **57 · Refined in place**: the 17 position cues, 7 dare cues and 105 programs' text; same ids and days, no re-pins.
  Explicit words and dirty slang, one paragraph, no orgasm script.
- **58 · A pelvic mark on the stick figures** (rendered pictures were refused).
- **59 · Catalogue 11: 88 exercises** (24 intercourse, 24 oral, 24 anal, 8 toys, 8 hands).
- **60 · +200 couple programs, 60 days each**: the Explicit subject (65: 20, then 45 mainly sex-only) and 9 in each of
  the 15 After dark subjects; three session shapes; minutes 20% longer than each band; new exercises alongside
  catalogue 10's.
- **62 · Swap unchanged**: older couple programs may offer catalogue-11 exercises.
- **63 · Grok writes the explicit text**; a text failure gets a second round.
- **64 · Descriptions from his side**: his POV or a straight couple's, never hers; as explicit or hotter. A standing
  rule in CLAUDE.md and a test over every couple program.
- **65 · Equal odds in sex blocks, basics about 1.5×**, through the merged pools; `tests/couple-odds.test.js`.
- **66 · Descriptions describe the session**, never the builder (no slots or catalogues); `tests/his-pov.test.js`.

**Caught up 7 Oct** (with the decisions made since)
- **218 · Tickets 9–15 all build at catalogue 13**, the 45 Explicit too (was 12, and 11 for 14–15). *(77, 105)*
- **219 · Sex blocks draw everything but the places**: catalogues 10–13 at equal odds, minus Shower and bath, Pool,
  Hot tub, Balcony, Doorframe (those stay in their own subjects). New ticket 8b adds the pools.
- **220 · All 180 stay 60 days**; the "fifth at 30" (185) is Phase 23's and 27's only.

**Grown 8 Oct**
- **221 · +50% programs in the 16 existing After dark subjects**, on their count after this phase, rounded up: +155
  (19 → 29, Couples 29 → 44, the 14s → 21, Explicit 65 → 98). Tickets 16–23. *(8 Oct)*
- **222 · The +155 at catalogue 13 on the home pools**, 60 days; even thirds by shape, Explicit sex-heavy like its 45. *(8 Oct)*

## Backlog
- **Test a restore from the nightly backup** on the phone ([#16](https://github.com/noamros9/kettle-bar/issues/16)).
- **Cut the test and CI times** ([#265](https://github.com/noamros9/kettle-bar/issues/265)). Already done: only the
  affected UI specs run locally; the sync tests run ~35% faster; CI runs in Playwright's image and cancels older runs;
  Markdown-only commits skip the tests. More workers don't help on 2 cores.

## Decided against (don't re-suggest)
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

# Kettle & Bar roadmap

The index: where we are, what comes next, and the two phases being built now. Every other phase's decisions live at the
top of its plan in [docs/plans/](docs/plans/); open a plan only when its phase comes up. Decision numbers are global
(the next one is **348**). Finished phases: [docs/roadmap-archive.md](docs/roadmap-archive.md).

## Resume here (16 Oct 2026)
- **Phase 20: tickets 10–16 done** (#446–#450, #452, #454). Noam's go (16 Oct) covers the rest of the phase: **next
  17**, then 18–23. Tours: `tour60` (346); Morning glory's long blocks (347). Pre-check day names against the newest
  merged ticket too: `../kettle-bar-docs`, where the pre-check reads configs, goes onto main first (`git checkout
  --detach origin/main`); an old test that checks a whole subject gets scoped to its own programs when a ticket first
  adds to that subject; `library.test.js` keeps a count per subject. `check:new` builds only `added: 23` on, so it
  doesn't check Phase 20's programs; a day out of band is fixed by a new id (its draws), never by a wider test.
- **How a Phase 20 content ticket runs now (worked for 10–12, ~3% of the weekly Grok usage for all three):**
  1. Branch `content/explicit-more-<x>` from main; `npm run cache:pull`.
  2. Claude writes the brief: a slot table (subject, shape, day types; 3 gym, 3 sex, 3 positions per subject), the
     line format, ticket 9's lessons, the subject voices, a sample, the writing rules and `docs/explicit-guidelines.md`,
     pasted in. Grok reads nothing else and writes only `grok/tN-text.md`
     (`slot | id | name | blurb | 20 day names | split | about`). Scripts (in `../kettle-bar-docs/grok/`, not committed): `p20-brief.js`
     (prompt + slots), `p20-totext.js` (pre-check → plan file), `p20-fix.js`, `p20-applyfix.js`; each takes the ticket number.
  3. Claude pre-checks the text (lengths, closers, taken names, unique splits) and reviews it for his side, heat and
     "describe the session"; one fresh, short fix round (blurbs and abouts only, plus taken names) fixed 11 and 12.
     Watch for: a stock phrase repeated in every about, blurbs naming the two day types, promising one position or a
     lift in every hold, places (mirror, wall) the home pools don't have, barbell words in bodyweight programs.
  4. The plan-format file → `node scripts/emit-couple.js <plan.md> [<text.md>]` → configs after the last ticket's
     block in `configs/after-dark.js`; ids in `programs.config.js` and `tests/configs.test.js`; the library total;
     `tests/explicit-more-<x>.test.js` copied from the last one; `npm run pin -- --phase 20`, `check:new`.
  - Minutes: 31–40 for every subject so far; Quickie 22–30 (344). A subject with a shorter solo band needs a decision.
  - A subject whose old programs have their own count test (after-dark-solo, couples) is already scoped to them.
- **Phase 26 is done** (#436–#445, archived). **Next for Opus: Phase 34** (short days,
  [plan](docs/plans/phase-34-short-days.md)), after Phase 20's Grok tickets or beside them.
- **Grok usage:** measured for 9–12 in [docs/grok-usage.md](docs/grok-usage.md); measuring stopped (Noam, 15 Oct).
- **Working rules** are in [CLAUDE.md](CLAUDE.md). Don't put shared page logic in `app/library.js` or other files in
  the build cache's key (`build-cache.js` CODE / RECIPE_CODE): a change there makes every build cold.

## The order
Set 7 Oct 2026 (decision 134): Noam put "Do now" right after the review and left the rest to Claude; Phase 30 goes
right after Phase 22 (216). **223 ·** 8 Oct: quick fixes after 22; Export, day to day II after Do now; short days after 26.

| # | Phase | Issue | Plan | Status |
|---|---|---|---|---|
| 1 | 34 · Short days: 15-min circuits, a 10-min rest-day flow | [#110](https://github.com/noamros9/kettle-bar/issues/110) | [plan](docs/plans/phase-34-short-days.md) | building (beside 20) |
| 2 | 27 · Calisthenics: twelve skills, 25 programs | [#199](https://github.com/noamros9/kettle-bar/issues/199) | [plan](docs/plans/phase-27-calisthenics.md) | planned |
| 3 | 19 · Super programs: 120 days from several programs | [#186](https://github.com/noamros9/kettle-bar/issues/186) | [plan](docs/plans/phase-19-super-programs.md) | planned |
| 4 | 36 · Logical sessions: an order and a place per set for every couple session | – | [plan](docs/plans/phase-36-logical-sessions.md) | planned |
| 5 | 20 · After dark refined, the Explicit set, +50% programs (tickets 8b–23 left) | [#202](https://github.com/noamros9/kettle-bar/issues/202) | [plan](docs/plans/phase-20-after-dark-explicit.md) | building (338): 8b–12 done; 13 next |
| 6 | 35 · Catalogue 14: threesomes (their own kind and in every act), every act at every place | – | [plan](docs/plans/phase-35-threesomes-and-places.md) | planned (tickets in the plan) |
| 7 | 28 · Explicit drawings and loops | [#249](https://github.com/noamros9/kettle-bar/issues/249) | [plan](docs/plans/phase-28-explicit-drawings.md) | planned |
| 8 | 29 · Stories from the couple workouts, in Drive | [#225](https://github.com/noamros9/kettle-bar/issues/225) | [plan](docs/plans/phase-29-stories.md) | planned, last |

- **295 · Grok away the week of 9 Oct**: Opus builds 31 → 30 → 23 … alone, in order; Phase 20 (Grok writes its
  text) moves to just before 35, after Phase 36. *(9 Oct)*
- **294 · Phase 35 goes late** (row 14, was 15), after the super programs and before the explicit drawings: its own +8 programs per subject carry the new exercises, so
  nothing waits for it. *(9 Oct)*
- **135 · #225 was planned early**; replanned when it starts if need be.
- **136 · Plans are ready, not frozen**: before a phase's first ticket, re-read its Challenge round; counts and files
  move while earlier phases land, and a ticket whose facts changed is fixed in its plan before hand-off.

## Phase 20 (building): After dark refined, and an Explicit set
Grilled 5 Oct 2026 on [#202](https://github.com/noamros9/kettle-bar/issues/202); Grok builds, Claude reviews.
Numbered 20 because 19 is super programs.
- **67 · Paused after ticket 8**; tickets 9–15 resume after Phase 22.
- **338 · Resumed 15 Oct beside Phase 33, while Grok usage lasts** (295 had it after 36): the two touch different files;
  Phase 36 ticket 3 later moves these programs to the ordered sessions for new starts, like Phase 22's. *(15 Oct)*
- **339 · Grok writes the text only** (63 kept): names, blurbs, abouts in one file, from a pasted brief; Claude builds
  the configs, tests and pins. Ticket 9 took ~10% of the weekly Grok usage, mostly plumbing. *(15 Oct)*
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
  Markdown-only commits skip the tests; a first CI job builds the library once and the test and UI jobs read its cache
  (#438, 15 Oct: a builder change had three jobs building cold at once). More workers don't help on 2 cores.
  **322 ·** The build cache is done (13 Oct, archived): builds read unchanged programs from `.build-cache/`.

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

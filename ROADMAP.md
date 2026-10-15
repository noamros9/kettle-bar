# Kettle & Bar roadmap

The index: where we are, what comes next, and the two phases being built now. Every other phase's decisions live at the
top of its plan in [docs/plans/](docs/plans/); open a plan only when its phase comes up. Decision numbers are global
(the next one is **344**). Finished phases: [docs/roadmap-archive.md](docs/roadmap-archive.md).

## Resume here (15 Oct 2026, midday)
- **Phase 20 resumed beside Phase 33** (338): 8b (home pools, #426) and ticket 9 (Grok, #427) merged. **Ticket 10 parked:**
  Grok's usage ran out mid-build (402). Its approved plan is `../kettle-bar-docs/grok/t10-plan.md` (27 programs; 3 abouts
  in full, 24 to write); the branch `content/explicit-more-b` there holds the WIP test (local, not pushed). Resume when
  Noam's Grok usage renews: `--resume 01a13eba-980f-79f0-8046-9393e9deb04d` with `grok/t10-build.md`. One ticket per go. Prompts: `grok/t9-*.md` in
  `../kettle-bar-docs` are the model (plan, review, build); `npm run pin -- --phase 20`, `check:new -- --phase 20 …`.
- **Grok writes text only (339, 15 Oct):** ticket 9 cost ~10% of Noam's weekly Grok usage and t10's plan 4%: 95-turn
  runs re-reading ~130k tokens a turn, mostly plumbing. Now Grok writes only names, blurbs and abouts into one text file,
  from a brief Claude pastes in (pools, one sample config, the guidelines); Claude does configs, tests, pins, check:new.
  The first such ticket commits `t9-emit.js` as a script (text file → configs). **Ticket 10 resumes this way:** Grok
  writes the 24 missing abouts only, Claude does the rest on `content/explicit-more-b`.
  **Measure every Grok ticket** until Noam says stop: a row in [docs/grok-usage.md](docs/grok-usage.md).
- **Phase 33 is done** (#415–#421, #434, #435; archived). Noam to check on the phone: airplane mode, tick a day,
  Settings → Sync says 1 change waiting; back online, Sync now clears it.
- **Phase 26 building** (longer programs, [plan](docs/plans/phase-26-longer-programs.md)): tickets 1–2 done (#436, #437); ticket 3 showed the per-day band too tight, so 1b (340–342: the band is the average, a lighter day type) comes first (#439); tickets 3–6 built (Strength #440, Cardio & combat #441, Mind & body #442, Mixed #443; 343: 15 flows stay short), then 6b and 7 (Noam's go, 15 Oct). Tickets 1 and 2 one per go, then three per go;
  Phase 20 waits for Grok, whose next tickets are for Noam's measured session (339).
- **Grok hand-off brought up to date (15 Oct):** the grok-handoff skill (on Noam's computer) has "kettle-bar
  additions" for the prompt (cache:pull, pin, check:new, UI own specs + smoke, the explicit guidelines); CLAUDE.md's
  plan path is `grok/` only. Phase 36 ticket 4 now only needs Phase 20's and 35's prompts to name the guidelines. The
  main checkout's commit hook was the pre-308 one (full coverage); reinstalled (`node scripts/install-hooks.js`).
- **Back scroll flake fixed** (#428, closes #404): a waiting scroll save landed in the entry Back returned to.
- **Phase 32 is done** (#411–#414, archived). Noam to check on the phone: Export → PDF from the installed app, and that
  the Calendar file opens in Google Calendar.
- **Opus builds alone** (295): Grok is away, so no Grok tickets; Phases 20 and 35 wait for it.
- **Working rules** are in [CLAUDE.md](CLAUDE.md). Don't put shared page logic in `app/library.js` or other files in
  the build cache's key (`build-cache.js` CODE / RECIPE_CODE): a change there makes every build cold.

## The order
Set 7 Oct 2026 (decision 134): Noam put "Do now" right after the review and left the rest to Claude; Phase 30 goes
right after Phase 22 (216). **223 ·** 8 Oct: quick fixes after 22; Export, day to day II after Do now; short days after 26.

| # | Phase | Issue | Plan | Status |
|---|---|---|---|---|
| 1 | 26 · Longer programs, half at 35–38 min | [#198](https://github.com/noamros9/kettle-bar/issues/198) | [plan](docs/plans/phase-26-longer-programs.md) | building: 1–2 done |
| 2 | 34 · Short days: 15-min circuits, a 10-min rest-day flow | [#110](https://github.com/noamros9/kettle-bar/issues/110) | [plan](docs/plans/phase-34-short-days.md) | planned |
| 3 | 27 · Calisthenics: twelve skills, 25 programs | [#199](https://github.com/noamros9/kettle-bar/issues/199) | [plan](docs/plans/phase-27-calisthenics.md) | planned |
| 4 | 19 · Super programs: 120 days from several programs | [#186](https://github.com/noamros9/kettle-bar/issues/186) | [plan](docs/plans/phase-19-super-programs.md) | planned |
| 5 | 36 · Logical sessions: an order and a place per set for every couple session | – | [plan](docs/plans/phase-36-logical-sessions.md) | planned |
| 6 | 20 · After dark refined, the Explicit set, +50% programs (tickets 8b–23 left) | [#202](https://github.com/noamros9/kettle-bar/issues/202) | [plan](docs/plans/phase-20-after-dark-explicit.md) | building (338): 8b, 9 done; 10 parked (Grok usage) |
| 7 | 35 · Catalogue 14: threesomes (their own kind and in every act), every act at every place | – | [plan](docs/plans/phase-35-threesomes-and-places.md) | planned (tickets in the plan) |
| 8 | 28 · Explicit drawings and loops | [#249](https://github.com/noamros9/kettle-bar/issues/249) | [plan](docs/plans/phase-28-explicit-drawings.md) | planned |
| 9 | 29 · Stories from the couple workouts, in Drive | [#225](https://github.com/noamros9/kettle-bar/issues/225) | [plan](docs/plans/phase-29-stories.md) | planned, last |

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

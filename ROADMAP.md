# Kettle & Bar roadmap

The index: where we are, what comes next, and the two phases being built now. Every other phase's decisions live at the
top of its plan in [docs/plans/](docs/plans/); open a plan only when its phase comes up. Decision numbers are global
(the next one is **283**). Finished phases: [docs/roadmap-archive.md](docs/roadmap-archive.md).

## Resume here (8 Oct 2026)
- **8 Oct:** every open issue planned (223–263, PR #297): Phases 31–34 below; #216 joined Phase 23; #220, #67 closed.
  Then a fine-grain round over every open plan (264–275, PR #298): the top rows slide (mocked), catalogues held per phase.
- **8 Oct evening:** Claude built fitness tickets 13–15 (#299–#301). The **Sonnet experiment** (276–282) ran ticket 16 only
  (#305: Sonnet headless, 25 min, ≈ $7.4 with supervision, against an Opus control at 9 min, $1.88) and ended there.
  **Next: Phase 22 tickets 17 and 18** (cardio and combat, mind-body), built by Claude on Opus as 13–15 were; the
  test helper is `fitnessTicket` in `tests/catalogue13.test.js`. `control/t16-opus` is local only, never merged.
- **Next: Phase 22 ticket 10** (Kink-lite +36, him on her) for Grok. Plan first (132); every Grok review so far caught
  bodies whose hips don't meet, and tame or "what it is not" cues. Start from the plan's "Resume here".
- **8 Oct:** After dark grown: 12 programs per new subject (119), +155 for the existing 16 (221–222, Phase 20 tickets 16–23).
- **Working rules** are in [CLAUDE.md](CLAUDE.md): at most 2 tickets building, the next ticket at every checkpoint, one
  phase at a time, every Grok ticket plans first.
- **Worktrees:** `../kettle-bar-docs` is the spare (`npm ci` done; UI tests there use `UI_PORT=4174`).
  `../kettle-bar-cachefix` is Noam's #253 branch.

## The order
Set 7 Oct 2026 (decision 134): Noam put "Do now" right after the review and left the rest to Claude; Phase 30 goes
right after Phase 22 (216). **223 ·** 8 Oct: quick fixes after 22; Export, day to day II after Do now; short days after 26.

| # | Phase | Issue | Plan | Status |
|---|---|---|---|---|
| 1 | 22 · Catalogue 13: the sex catalogue doubled, 12 new kinds, +50% fitness exercises | – | [plan](docs/plans/phase-22-catalogue-13.md) | **building** |
| 2 | 31 · Quick fixes: Back keeps your place, preview = saved, the flaky sync test | [#214](https://github.com/noamros9/kettle-bar/issues/214), [#111](https://github.com/noamros9/kettle-bar/issues/111), [#105](https://github.com/noamros9/kettle-bar/issues/105) | [plan](docs/plans/phase-31-quick-fixes.md) | planned |
| 3 | 30 · Muscle groups on three levels, and doing a day again | [#287](https://github.com/noamros9/kettle-bar/issues/287) | [plan](docs/plans/phase-30-muscle-groups-and-again.md) | planned |
| 4 | 20 · After dark refined, the Explicit set, +50% programs (tickets 8b–23 left) | [#202](https://github.com/noamros9/kettle-bar/issues/202) | [plan](docs/plans/phase-20-after-dark-explicit.md) | paused after ticket 8 |
| 5 | 23 · New fitness programs, the Signature IIs, Yoga, Pilates and Variety doubled | [#216](https://github.com/noamros9/kettle-bar/issues/216) | [plan](docs/plans/phase-23-fitness-programs.md) | planned |
| 6 | 24 · Architecture and code review, then the fixes | [#187](https://github.com/noamros9/kettle-bar/issues/187), [#188](https://github.com/noamros9/kettle-bar/issues/188) | [plan](docs/plans/phase-24-review.md) | planned |
| 7 | 25 · "Do now": one exercise for dead time | [#200](https://github.com/noamros9/kettle-bar/issues/200) | [plan](docs/plans/phase-25-do-now.md) | planned |
| 8 | 32 · Export an exercise, a day or a program | [#224](https://github.com/noamros9/kettle-bar/issues/224) | [plan](docs/plans/phase-32-export.md) | planned |
| 9 | 33 · Day to day II: weekdays, a day note, pause, compare, programs that use this, sync status | [#291](https://github.com/noamros9/kettle-bar/issues/291)–[#296](https://github.com/noamros9/kettle-bar/issues/296) | [plan](docs/plans/phase-33-day-to-day-2.md) | planned |
| 10 | 26 · Longer programs, half at 35–38 min | [#198](https://github.com/noamros9/kettle-bar/issues/198) | [plan](docs/plans/phase-26-longer-programs.md) | planned |
| 11 | 34 · Short days: 15-min circuits, a 10-min rest-day flow | [#110](https://github.com/noamros9/kettle-bar/issues/110) | [plan](docs/plans/phase-34-short-days.md) | planned |
| 12 | 27 · Calisthenics: twelve skills, 25 programs | [#199](https://github.com/noamros9/kettle-bar/issues/199) | [plan](docs/plans/phase-27-calisthenics.md) | planned |
| 13 | 19 · Super programs: 120 days from several programs | [#186](https://github.com/noamros9/kettle-bar/issues/186) | [plan](docs/plans/phase-19-super-programs.md) | planned |
| 14 | 28 · Explicit drawings and loops | [#249](https://github.com/noamros9/kettle-bar/issues/249) | [plan](docs/plans/phase-28-explicit-drawings.md) | planned |
| 15 | 29 · Stories from the couple workouts, in Drive | [#225](https://github.com/noamros9/kettle-bar/issues/225) | [plan](docs/plans/phase-29-stories.md) | planned, last |

- **135 · #225 was planned early**; replanned when it starts if need be.
- **136 · Plans are ready, not frozen**: before a phase's first ticket, re-read its Challenge round; counts and files
  move while earlier phases land, and a ticket whose facts changed is fixed in its plan before hand-off.

## Phase 22 (building): catalogue 13
Grilled 5–6 Oct 2026. Claude plans, Grok builds and writes the text. The working rules decided during it (128–133)
are in [its plan](docs/plans/phase-22-catalogue-13.md) and CLAUDE.md.

**The sex exercises** (all `couple`, with poses and the pelvic mark, Phase 20's cue register, 75)
- **120 · New per kind**: intercourse +91 (planned +96; copies after ~115 positions), toys and hands +36 each, Rough,
  Kink-lite, Body play, Rimming 36 each. *(replaces 72–73's first counts)*
- **122 · Oral and anal +30 each**, not +60; shipped oral +23 and anal +22 (124). The freed 60 went to Kink-lite and
  Body play (66 each).
- **123 · Eight more kinds, 36 each**: Edging, Massage, Strip and tease, Shower and bath, Pool, Hot tub, Balcony,
  Doorframe. Totals now: 700 sex exercises, 162 fitness, 144 programs (was 96).
- **73 · What the four new kinds are**: Rough (spanking, hair-pulling, wrists pinned, held down; **no choking**),
  Kink-lite (blindfold, ties or cuffs, gag, ice or wax), Body play (titfuck, grinding, thigh-fucking, cumming on her
  as an act), Rimming.
- **118 · Rough and Kink-lite mostly during sex** (a position with the act in it); a few stand alone.
- **74 · She may rim him; nothing goes in him** (no pegging, no fingers or toys). **126 ·** Kink-lite goes both ways:
  about a quarter is her doing it to him. Both exceptions are in CLAUDE.md and `tests/his-pov.test.js`.
- **125 · Places count by what the place changes** (what he holds or braces); places include play, not only sex.
- **124 · Hitting the wall**: Grok's build plus two fix rounds; then it ships what passed, count recorded.

**The programs**
- **119 · Each new kind is an After dark subject with 12 programs (was 8)**: 4 gym then sex, 4 sex then sex, 4
  positions only (was 3/3/2), at catalogue 13: 12 subjects, 144 programs (was 96). *(8 Oct)*
- **117 · The new kinds join the merged pools by role**: Rough and Body play → `sexFuck`, Kink-lite and Rimming →
  `sexWarm`, all → `sexPositions`; each kind has its own pool too.

**The fitness exercises**
- **79, 80, 116 · +50% in every fitness category but warm-ups and cool-downs**: 317 → 479, +162, using all his gear.
- **81 · Existing programs stay as built**; Build your own, random workouts, Variety and Swap pick up the new ones. New
  fitness programs come in Phase 23.

**Keeping what's built safe**
- **121 · Own programs and random workouts move to catalogue 13 only in the last ticket.** *(technical)*
- **105 · Phase 21's exercises took `added: 12`**, so this phase is catalogue 13. **77 ·** Phase 20's tickets 9–15
  build at catalogue 13 (mixing 10, 11 and 13).
- **127 · Room to grow**: the page gate is 1 MB gzipped (was 135 → 250 → 350 KB: 61, 76, 95); UI timeouts and
  command limits raised; cutting the times is #265.
- **276 · Sonnet experiment**: tickets 16–18 built by Sonnet subagents, Opus planning and supervising (the
  `sonnet-handoff` skill, Grok's loop). Claude judges; Noam decides if tickets go this way. *(8 Oct)*

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

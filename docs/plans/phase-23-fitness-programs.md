# Phase 23: new fitness programs at catalogue 13, a "II" of every Signature program, and Yoga, Pilates and Variety doubled

Grilled 6 Oct 2026 (Noam); decisions 83–88, 96, 137–138 below; [#216](https://github.com/noamros9/kettle-bar/issues/216)
(more Yoga, Pilates and Variety) joined it on 8 Oct (230–237). Starts once Phase 20's
tickets 9–15 are merged (96). Claude plans; Noam picks Grok tickets at hand-off (CLAUDE.md, "Grok tickets").
Counted 7 Oct: 592 programs, 452 of them fitness outside Signature (`node -e` over `buildAll()`); recount when the
phase starts (136).

## Decisions
Grilled 6–7 Oct 2026 with Noam. Numbers are the project's global decision numbers. "Catalogue 12" in the 6 Oct
decisions is today's catalogue 13 (renumbered by 105).

**What gets built**
- **83 · +50% programs in every fitness subject**, rounded (not After dark or couple), mixing old and new exercises. *(6 Oct)*
- **138 · That's 309 programs (was 233)**: 253 in today's subjects, Strength +10 down to Chest +4, and 56 in #216's
  new ones; with the IIs, 324 (was 248). Recount at the start. *(7 Oct; 8 Oct)*
- **84 · A "II" of every Signature program**: same days, blocks and length, a step harder, built at catalogue 13. The
  originals never change. *(6 Oct)*
- **85 · "A step harder" = a level up**: a II's Level I is the original's Level II. *(6 Oct)*
- **86 · All 15 get a II**, on the Signature shelf after their originals. *(6 Oct)*
- **171 · A II's Level III may run up to 3 min long.** *(7 Oct)*
- **201 · Own cards, plus "Ready for II"** on the original's page once its day 60 is done. *(7 Oct)*

**How they're made**
- **87 · Built to the longer-programs spread** from the start: half 35–38, a quarter 31–35, a quarter shorter. *(6 Oct)*
- **185 · A fifth are 30 days** (about 62, was 47); the IIs stay 60. **205 ·** The 30-day ones follow the same spread. *(7 Oct)*
- **184 · Gear like each subject's today** (same share of full gear, kettlebell-only, no-equipment). *(7 Oct)*
- **88 · Names and blurbs in today's style**, no separate review. **199 ·** No "New" marking. *(6–7 Oct)*

**When and how big**
- **96 · After Phase 20's tickets 9–15.** *(6 Oct)*
- **137 · Measure the library at ~1,140 programs (was ~1,060); split it only if the Programs page slows.** *(7 Oct)*
- **316 · Pause after every 3 tickets**: Claude stops and waits for Noam's explicit go before the next three. *(10 Oct)*
- **317 · Measure today and at the close only** (no placeholder end state; nothing builds the whole library on the
  cloud machine, 312); the 1 MB page gate may be raised if the library needs it. *(10 Oct)*

**More Yoga, Pilates and Variety** ([#216](https://github.com/noamros9/kettle-bar/issues/216), grilled 8 Oct)
- **230 · #216 is built in this phase**, in its Yoga, Pilates and Variety tickets. *(8 Oct)*
- **231 · Yoga, Pilates and Variety double** (14 → 28, 12 → 24, 15 → 30), instead of +50% (was +7, +6, +8). *(8 Oct)*
- **232 · Seven new subjects, 8 programs each**, on top: Power yoga, Yin yoga, Yoga flow (was Mobility flow) (Yoga); Mat core,
  Kettlebell Pilates (Pilates); Weekly mix, Surprise (Variety shelf). *(8 Oct)*
- **233 · Weekly mix**: a 7-day rotation, each program its own order (was one order for all), each day a different shelf group (Strength, Muscles, Cardio, Combat, Yoga &
  Pilates, Mobility & care, Mixed). *(8 Oct)*
- **234 · Surprise**: every day a different fitness subject, no pattern; never After dark. *(8 Oct)*
- **235 · Yoga and Pilates exercises double on their count after Phase 22**: yoga 88+, Pilates 66+ (about +44, +33),
  Yin poses among them. *(8 Oct)*
- **236 · The same rules as the rest of the phase**: the spread (87), a fifth 30 days (185), gear like the subject (184). *(8 Oct)*
- **237 · Catalogue numbers**: the new yoga and Pilates exercises open catalogue 14 (`added: 14`), Phase 34's breathing
  drills take 15, Phase 27's skills move to 16. *(technical, 8 Oct)*
- **264 · Build your own and random workouts get catalogue 14 at the phase's last ticket**, all at once (as 121). *(8 Oct)*
- **265 · Yin & Deep Stretch stays on the Yoga shelf**; programs never move shelves. *(8 Oct)*

## What lands
- **309 library programs** (83, 138, 231, 232): every fitness subject but Signature grows by half, rounded, except
  Yoga, Pilates and Variety, which double; and seven new subjects of 8. All `added: 23`; `catalogue: 13`, except the
  Yoga and Pilates ones (and Weekly mix and Surprise days drawn from them), at `catalogue: 14` (237).
- **15 Signature IIs** (84–86): each of the five splits and their Tempo and Harder Moves variations gets a II, on the
  Signature shelf after its original: same days, blocks and length, one level up (a II's Level I is the original's
  Level II), built at catalogue 13. The originals never change.
- **Built to the spread** (87): in each subject's new programs, half 35–38 min, a quarter 31–35, a quarter shorter.
- **Names and blurbs in today's style** (88), no separate review. Fitness text, so the After dark POV rules don't apply.
- **About 77 new yoga and Pilates exercises** (235), Yin poses among them, with figures, at catalogue 14 (237).
- **The library at ~1,140 programs is measured** (137); split only if the Programs page slows.

## How the later decisions land in the tickets
- **Gear like each subject's today** (184): the same share of full gear, kettlebell-only and no-equipment.
- **A fifth are 30 days** (185): about 62 of the 309 (`days: 30`), spread over the subjects; the IIs stay 60. Each
  content ticket's test checks its fifth (rounded) and that the spread (87) holds for 30-day ones too.
- **No "New" marking** (199).
- **"Ready for II"** (201): an original's page links to its II once its day 60 is done (ticket 2: `app/pages/program.js`,
  and a UI check in `tests-ui/library.spec.js`).

## Per subject (today → new)

| Ticket | Subjects (+new) | New |
|---|---|---|
| 3 | Strength +10, Busy week +9, Bodyweight +10 | 29 |
| 4 | Kettlebell only +9, Kettlebell complexes +5, Pull-ups +8, Climber / pull strength +4 | 26 |
| 5 | Chest, Back, Shoulders, Arms, Neck & traps +4 each, Grip & forearms +5 | 25 |
| 6 | Legs & glutes +9, Hips & adductors +4, Calves & lower legs +4, Core & abs +8 | 25 |
| 7 | Conditioning +7, HIIT +7, Plyometrics +6, Running prep +5, Court & field sports +5 | 30 |
| 8 | Boxing +7, Kickboxing +6, Fighter +7 | 20 |
| 9 | Yoga +14, Pilates +12, Back care +5 (231) | 31 |
| 9b | Power yoga, Yin yoga, Yoga flow, Mat core, Kettlebell Pilates, 8 each (232) | 40 |
| 10 | Mobility & posture +6, Flexibility +6, Balance & stability +6, Gentle / low impact +5 | 23 |
| 11 | Strength & stretch +7, Athlete +7, Balanced week +8, Calm strength +7 | 29 |
| 12 | Variety +15 (231) | 15 |
| 12b | Weekly mix, Surprise, 8 each (232–234) | 16 |

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/unplanned-phases` | done (PR #281) |
| 0b | #216 joins (230–237) | plan | – | `plan/open-issues-8oct` | done (PR #297) |
| 1 | Library size: measure at the end state, and per-family program order | feature | – | `feature/p23-size-and-order` | done (PR #352) |
| 2 | Signature IIs: a level step in the builder, and the 15 IIs | feature | 1 | `feature/signature-ii` | done (PR #353) |
| 3 | Strength, Busy week, Bodyweight +29 | content | 1 | `content/p23-strength` | todo |
| 4 | Kettlebells and pulls +26 | content | 1 | `content/p23-bells-pulls` | todo |
| 5 | Upper-body muscles and grip +25 | content | 1 | `content/p23-muscles-upper` | todo |
| 6 | Legs, hips, calves, core +25 | content | 1 | `content/p23-muscles-lower` | todo |
| 7 | Cardio +30 | content | 1 | `content/p23-cardio` | todo |
| 8 | Combat +20 | content | 1 | `content/p23-combat` | todo |
| 1c | Yoga and Pilates exercises doubled, catalogue 14 (235, 237) | content | – | `content/p23-yoga-pilates-ex` | done (PR #354) |
| 9 | Yoga, Pilates, Back care +31 | content | 1, 1c | `content/p23-yoga-pilates` | todo |
| 9b | Five new Yoga and Pilates subjects +40 | content | 1c, 9 | `content/p23-yoga-pilates-new` | todo |
| 10 | Mobility & care +23 | content | 1 | `content/p23-mobility` | todo |
| 11 | Mixed +29 | content | 1 | `content/p23-mixed` | todo |
| 12 | Variety +15 | content | 1 | `content/p23-variety` | todo |
| 12b | Weekly mix and Surprise +16 | content | 9b, 12 | `content/p23-variety-new` | todo |
| 13 | Close the phase: measure again, archive | plan | 2–12b | `plan/p23-close` | todo |

Tickets 3–6 edit `configs/strength.js`, 7–8 `configs/cardio-combat.js`, 9–10 `configs/mind-body.js`, 11–12
`configs/mixed.js`: after ticket 1, two tickets of different family files can build at once (CLAUDE.md cap of 2).
The pins file is regenerated after each rebase (`npm run pin`), never merged by hand.

### 1. Library size, and per-family program order
- **Build:** `programs.config.js`'s `ORDER` is one list, so every content ticket would edit it. Each family file
  exports `order23: [ids]`, appended to `ORDER` in the family order; the 309 new programs go there. Then a
  throwaway-free script `scripts/library-size.js` (`npm run size`) prints `data/library.json`, the finder data and
  `index.html`, gzipped, and the Programs page's first draw, measured by a UI spec on a 4× CPU throttle. Run it today
  and with 309 placeholder programs (copies of existing configs under new ids, not committed) to see the end state.
- **Files:** `programs.config.js`, `configs/*.js` (empty `order23`), `scripts/library-size.js`, `package.json`,
  `tests/configs.test.js`, `tests-ui/library.spec.js`, `scripts/ui-affected.js`.
- **Test first:** `configs.test.js`: every `order23` id exists in its own family file and in `ORDER` exactly once,
  after every pre-Phase-23 id.
- **Done when:** the numbers today and at the end state are in this plan under "Measured"; if the first draw is more
  than 25% slower or `library.json` passes 1 MB gzipped, a ticket 1b (split the index from the days, days fetched per
  program) is added before ticket 3, else none.

### 2. Signature IIs
- **Build:** the builder learns `step: 1` on a config: day *d* is built at its level + 1 (reps and holds of the next
  level, and the original's lever for it), and Level III, one past the catalogue's top, adds a set to every straight
  block (or a round to circuits) on top of Level III's reps and the original's Level III lever. A helper
  `twoOf(cfg)` in `configs/strength.js` makes a II from an original: id `<id>-ii`, name `<name> II`, `catalogue: 13`,
  `step: 1`, the same split, day types, blocks and minutes, new pools at catalogue 13 where an old pool has a
  catalogue-13 twin, else the old pool (decision 81: new pool names, old pools untouched). Three-Split 60 is frozen,
  so its II is made from its generated look-alike config, as its variations are.
- **Files:** `program-builder.js`, `configs/strength.js`, `programs.config.js` (`order23`: each II after its original
  on the shelf), `app/library.js` if the Signature shelf orders by `ORDER`, `tests/signature.test.js`,
  `tests/builder.test.js`, `tests/fixtures/program-days.json`.
- **Test first:** `signature.test.js`: 15 IIs, each after its original; a II's day 1 sets and reps equal its
  original's day 21's; Level III has more sets than the original's Level III; no original's pin changes.
- **Done when:** the 15 build inside their minutes (Level III up to 3 min over, 171), pinned; screenshots of a II's day 1 and day 41 at 390 px.

### 1c. Yoga and Pilates exercises doubled, catalogue 14 (235, 237)
- **Build:** recount yoga and Pilates exercises once Phase 22 is merged (about 44 and 33), then add as many again,
  rounded up: about 44 yoga (about 12 of them Yin poses: long passive holds of 1–3 min, `u: 'sec'`, floor and
  supported shapes) and about 33 Pilates (mat work, and enough kettlebell Pilates moves for the Kettlebell Pilates
  subject: `load` set, about 10). Each with `cat` (`yoga` or `pilates`), `added: 14`, muscles, cue, reps or holds per
  level, a pose (flows use them as poses) and its exercise family entry. New pools where a subject needs its own
  (`yin`, `kbPilates`); existing pools take the new ones only from catalogue 14. Grok plans first (132): one line
  per exercise (name, kind, hold or reps, gear, muscles).
- **Files:** `exercises.js`, `figures.js` (new poses), `app/library.js` (`EX_FAMILIES`), `program-builder.js` (pool
  definitions, if pools live there), `tests/catalogue14.test.js` (new, like
  `catalogue13.test.js`), `tests/fixtures/program-days.json` (must not change).
- **Test first:** yoga and Pilates counts are at least double the post-Phase-22 count; every new one has `added: 14`,
  a pose and a family; at catalogue 13 every pool is exactly as before; no pin changes.
- **Done when:** a contact sheet of the new figures (`node sheet.js`) in the PR, 390 px light and dark; a Yin hold
  and a kettlebell Pilates move read right on the exercise page.

### 3–12. The new programs, by subject
- **Build:** per subject, the new count in the table above, each a full config (id, `added: 23`, `catalogue: 13`,
  name, subject, minutes, equip, levers, split, blurb, about, names, cycle, day types). Each subject's new programs
  cover its splits and formats (not copies of an existing one with another name: a different split, format mix or
  equipment). Minutes: in each subject's new set, half `[35, 38]`, a quarter in `[31, 35]`, a quarter shorter (87).
  Pools: catalogue-13 pools where the kind exists, so every program uses some of Phase 22's new fitness exercises.
  Grok tickets plan first (132): one line per program (name, split, formats, minutes, gear, pools).
- **Files:** the family file, `order23` in it, `tests/fixtures/program-days.json` (`npm run pin`).
- **Test first:** `tests/programs.test.js` gets a Phase 23 block: per subject the new count, each `catalogue: 13`,
  each using at least one `added: 13` exercise somewhere in its 60 days, the spread per subject (half within
  35–38 by mid-range, a quarter 31–35, rounded), no two new programs of a subject with the same split and formats.
- **Done when:** the subject counts match; every day lands in its range (`npm run times`); no existing pin changes;
  the PR's CI is green. Ticket 12 also checks Variety's own rule (no two days share a type and format).

### 9b. Five new Yoga and Pilates subjects (232)
- **Build:** Power yoga (strong, flowing, standing-heavy), Yin yoga (long holds, few poses, slow), Yoga flow
  (joint-by-joint flows), Mat core (Pilates mat, core first), Kettlebell Pilates (Pilates with a light bell): 8
  programs each, `catalogue: 14`, by ticket 3–12's rules (spread, a fifth 30 days, gear like the shelf's; Kettlebell
  Pilates `kb`). The five join `FAMILIES` (Mind & body) and `SHELVES` (Yoga & Pilates), after Yoga and Pilates.
- **Files:** `configs/mind-body.js` (`order23`), `app/library.js`, `tests/programs.test.js`, `tests/library.test.js`,
  `tests/fixtures/program-days.json`.
- **Test first:** five new subjects with 8 programs each, each in exactly one family and one shelf group; Yin
  programs' holds average at least 60 s; Kettlebell Pilates days use a bell every day.
- **Done when:** as ticket 3–12; screenshots of the Yoga & Pilates tab with the new shelves.

### 12b. Weekly mix and Surprise (233, 234)
- **Build:** Weekly mix: 8 programs whose cycle is 7 day types, one from each of the seven fitness shelf groups
  (Strength, Muscles, Cardio, Combat, Yoga & Pilates, Mobility & care, Mixed), each program in its own order, never putting two
  hard days of the same muscles back to back (233); a mixed-day program like Balanced week, so no builder change. Surprise: 8
  Variety programs whose deck is dealt by subject: every day a different fitness subject's day type, each subject
  once before any comes back, none from After dark (`variety.js` learns `surprise: true`, dealing subjects before
  formats; a Variety program without it deals as now). Both subjects join the Variety shelf group and the Mixed
  family.
- **Files:** `configs/mixed.js` (`order23`), `variety.js` (Surprise), `app/library.js`, `tests/variety.test.js`,
  `tests/programs.test.js`, `tests/fixtures/program-days.json`.
- **Test first:** Weekly mix: days 1–7 hit all seven groups, and day 8 repeats day 1's group; Surprise: no subject
  twice before all have come, no After dark subject, no existing Variety program's days change.
- **Done when:** as ticket 3–12.

### 13. Close the phase
- `recipe-book.js`: `NEWEST = 14` (264); new own programs and random workouts draw the yoga and Pilates moves.
- `npm run size` again, recorded under "Measured" next to ticket 1's numbers; the section moves to
  `docs/roadmap-archive.md`; CONTEXT.md's Signature entry says the IIs.

## Measured
**10 Oct 2026, the start** (ticket 1, `npm run size` on the last build; 736 programs, decision 317):

| File | Raw | Gzipped |
|---|---|---|
| index.html | 947.0 KB | 224.5 KB |
| data/library.json | 192.6 KB | 35.5 KB |
| data/finder.json | 411.7 KB | 89.4 KB |
| data/muscles.json | 223.0 KB | 43.0 KB |
| data/index.json | 2119.8 KB | 60.4 KB |

The page is at 22% of its 1 MB gzip gate. No end-state guess (317): ticket 13 measures again with the real programs,
and CI's phone tests would show a slower Programs page first. So no ticket 1b.

## Challenge round
- **Weakest assumption: "a step harder" has something to step to at Level III.** The catalogue has three levels of
  reps; a II's Level III is past them. The plan adds a set (or round) there, which changes the day's time: a
  Five-Split day near the top of its range may overflow. Ticket 2 checks every II day against its range and, where
  one overflows, lets it run up to 3 min over (171); past that, the extra set goes and Level III climbs by the
  original's lever only, recorded here.
- **What I hadn't read:** how the Signature shelf orders its programs (by `ORDER`, or by a list in
  `app/library.js`), and whether Three-Split 60's look-alike config is reachable from `configs/strength.js`. Ticket 2
  reads both first. Also not read: whether the finder vectors (made in the deploy) take longer than CI allows at
  ~1,140 programs; ticket 1's end-state run times the deploy's vector step too.
- **The lazier version:** no IIs, only the 309. Not proposed: Noam asked for both (84). Another lazier version: Phase
  23's programs generated from existing configs by swapping pools to catalogue 13. Not proposed: that is 309 near
  copies; the subjects grow by half to give new programs, not new names.
- **#216's weakest assumption: that 8 programs of a narrow subject (Yin, Mat core) can each be different.** Yin has
  few poses even after 1c. Ticket 9b's test only asks for different split + formats + levers; if a subject can't
  reach 8 honest ones, its count is lowered in the PR and recorded here, rather than near copies.
- **What I hadn't read for #216:** where pools are defined (`program-builder.js` or `exercises.js`) and how a pool
  takes only exercises up to a catalogue; ticket 1c reads that first. Also whether Weekly mix's seven groups can all
  come from today's mixed-day machinery (a Combat or Yoga block inside a mixed day): Balanced week suggests yes.
- **Counts move:** Phase 20's tickets 9–15 add After dark programs only, so the fitness counts above should hold;
  recount at the start (136).

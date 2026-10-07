# Phase 23: new fitness programs at catalogue 13, and a "II" of every Signature program

Grilled 6 Oct 2026 (Noam); decisions 83–88, 96, 137–138 in [ROADMAP.md](../../ROADMAP.md). Starts once Phase 20's
tickets 9–15 are merged (96). Claude plans; Noam picks Grok tickets at hand-off (CLAUDE.md, "Grok tickets").
Counted 7 Oct: 592 programs, 452 of them fitness outside Signature (`node -e` over `buildAll()`); recount when the
phase starts (136).

## What lands
- **233 library programs** (83, 138): every fitness subject but Signature grows by half, rounded. All
  `catalogue: 13`, `added: 23`, mixing old and new exercises.
- **15 Signature IIs** (84–86): each of the five splits and their Tempo and Harder Moves variations gets a II, on the
  Signature shelf after its original: same days, blocks and length, one level up (a II's Level I is the original's
  Level II), built at catalogue 13. The originals never change.
- **Built to the spread** (87): in each subject's new programs, half 35–38 min, a quarter 31–35, a quarter shorter.
- **Names and blurbs in today's style** (88), no separate review. Fitness text, so the After dark POV rules don't apply.
- **The library at ~1,060 programs is measured** (137); split only if the Programs page slows.

## Per subject (today → new)

| Ticket | Subjects (+new) | New |
|---|---|---|
| 3 | Strength +10, Busy week +9, Bodyweight +10 | 29 |
| 4 | Kettlebell only +9, Kettlebell complexes +5, Pull-ups +8, Climber / pull strength +4 | 26 |
| 5 | Chest, Back, Shoulders, Arms, Neck & traps +4 each, Grip & forearms +5 | 25 |
| 6 | Legs & glutes +9, Hips & adductors +4, Calves & lower legs +4, Core & abs +8 | 25 |
| 7 | Conditioning +7, HIIT +7, Plyometrics +6, Running prep +5, Court & field sports +5 | 30 |
| 8 | Boxing +7, Kickboxing +6, Fighter +7 | 20 |
| 9 | Yoga +7, Pilates +6, Back care +5 | 18 |
| 10 | Mobility & posture +6, Flexibility +6, Balance & stability +6, Gentle / low impact +5 | 23 |
| 11 | Strength & stretch +7, Athlete +7, Balanced week +8, Calm strength +7 | 29 |
| 12 | Variety +8 | 8 |

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/unplanned-phases` | done (PR #281) |
| 1 | Library size: measure at the end state, and per-family program order | feature | – | `feature/p23-size-and-order` | todo |
| 2 | Signature IIs: a level step in the builder, and the 15 IIs | feature | 1 | `feature/signature-ii` | todo |
| 3 | Strength, Busy week, Bodyweight +29 | content | 1 | `content/p23-strength` | todo |
| 4 | Kettlebells and pulls +26 | content | 1 | `content/p23-bells-pulls` | todo |
| 5 | Upper-body muscles and grip +25 | content | 1 | `content/p23-muscles-upper` | todo |
| 6 | Legs, hips, calves, core +25 | content | 1 | `content/p23-muscles-lower` | todo |
| 7 | Cardio +30 | content | 1 | `content/p23-cardio` | todo |
| 8 | Combat +20 | content | 1 | `content/p23-combat` | todo |
| 9 | Yoga, Pilates, Back care +18 | content | 1 | `content/p23-yoga-pilates` | todo |
| 10 | Mobility & care +23 | content | 1 | `content/p23-mobility` | todo |
| 11 | Mixed +29 | content | 1 | `content/p23-mixed` | todo |
| 12 | Variety +8 | content | 1 | `content/p23-variety` | todo |
| 13 | Close the phase: measure again, archive | plan | 2–12 | `plan/p23-close` | todo |

Tickets 3–6 edit `configs/strength.js`, 7–8 `configs/cardio-combat.js`, 9–10 `configs/mind-body.js`, 11–12
`configs/mixed.js`: after ticket 1, two tickets of different family files can build at once (CLAUDE.md cap of 2).
The pins file is regenerated after each rebase (`npm run pin`), never merged by hand.

### 1. Library size, and per-family program order
- **Build:** `programs.config.js`'s `ORDER` is one list, so every content ticket would edit it. Each family file
  exports `order23: [ids]`, appended to `ORDER` in the family order; the 233 new programs go there. Then a
  throwaway-free script `scripts/library-size.js` (`npm run size`) prints `data/library.json`, the finder data and
  `index.html`, gzipped, and the Programs page's first draw, measured by a UI spec on a 4× CPU throttle. Run it today
  and with 233 placeholder programs (copies of existing configs under new ids, not committed) to see the end state.
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
- **Done when:** the 15 build inside their minutes, pinned; screenshots of a II's day 1 and day 41 at 390 px.

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

### 13. Close the phase
- `npm run size` again, recorded under "Measured" next to ticket 1's numbers; the section moves to
  `docs/roadmap-archive.md`; CONTEXT.md's Signature entry says the IIs.

## Measured
_(ticket 1)_

## Challenge round
- **Weakest assumption: "a step harder" has something to step to at Level III.** The catalogue has three levels of
  reps; a II's Level III is past them. The plan adds a set (or round) there, which changes the day's time: a
  Five-Split day near the top of its range may overflow. Ticket 2 checks every II day against its range and, where
  one overflows, takes the extra set off the abs block first. If that still overflows, Noam is asked (not decided
  quietly).
- **What I hadn't read:** how the Signature shelf orders its programs (by `ORDER`, or by a list in
  `app/library.js`), and whether Three-Split 60's look-alike config is reachable from `configs/strength.js`. Ticket 2
  reads both first. Also not read: whether the finder vectors (made in the deploy) take longer than CI allows at
  ~1,060 programs; ticket 1's end-state run times the deploy's vector step too.
- **The lazier version:** no IIs, only the 233. Not proposed: Noam asked for both (84). Another lazier version: Phase
  23's programs generated from existing configs by swapping pools to catalogue 13. Not proposed: that is 233 near
  copies; the subjects grow by half to give new programs, not new names.
- **Counts move:** Phase 20's tickets 9–15 add After dark programs only, so the fitness counts above should hold;
  recount at the start (136).

# Phase 22: catalogue 13, the sex catalogue doubled, four new kinds, and +50% fitness exercises

Grilled 5–6 Oct 2026 (Noam); decisions 72–81, 95, 105 and 116–121 in [ROADMAP.md](../../ROADMAP.md). Claude plans;
Noam picks Grok tickets at hand-off (CLAUDE.md, "Grok tickets"); Grok writes the explicit text either way (63).
Today: 508 exercises, 131 couple, the page at 130.6 KB gzipped.

## What lands
- **715 couple exercises, `added: 13`** (120, 122–126): intercourse +91 (4b shipped 19 of 24), oral +23 (5 shipped 23 of 30) and anal +30, toys
  +36 and hands +36, Kink-lite and Body play 66 each, eight more kinds 36 each (Edging, Massage, Strip and tease, Shower
  and bath, Pool, Hot tub, Balcony, Doorframe; 123), and four new kinds, 36 each: Rough (`sub: 'rough'`), Kink-lite (`kink`), Body play (`body`), Rimming (`rim`). Poses with the
  pelvic mark, in the Phase 20 cue register (75). Rough and Kink-lite are mostly a position with the act in it, a
  few stand alone (118). No choking (73). Rimming: him on her and her on him, the one exception to "nothing receiving
  about him"; nothing goes in him (74).
- **162 fitness exercises, `added: 13`** (80, 116): +50% in each category but warm-up and cool-down, using all his
  equipment:

  | cat | now | new | cat | now | new |
  |---|---|---|---|---|---|
  | chest | 18 | +9 | yoga | 29 | +15 |
  | back | 24 | +12 | pilates | 22 | +11 |
  | upper | 33 | +17 | flex | 14 | +7 |
  | full | 9 | +5 | mobility | 15 | +8 |
  | lower | 43 | +22 | balance | 12 | +6 |
  | abs | 41 | +21 | boxing | 14 | +7 |
  | cardio | 31 | +16 | kick | 12 | +6 |

- **Twelve After dark subjects, 8 programs each** (119, 123): Rough, Kink-lite, Body play, Rimming and the eight
  kinds above, at `catalogue: 13`: 96 programs.
- **A ticket that hits the wall moves on** (124): Grok's build and two fix rounds, then it ships what passed.
- **No existing program changes** (81): every pool a catalogue-12-or-older config reads stays as it is.

## How catalogue 13 reaches the pools
- **Couple** (no named lists to edit): computed pools in `program-builder.js`, empty below 13 —
  `sexRough`, `sexKink`, `sexBody`, `sexRim` (by `sub`), and `mergedAt(upTo)` for `upTo >= 13` adds (117):
  `sexPositions` += all 432; `sexFuck` += new `fuck`, `anal`, `toys`, `rough`, `body`; `sexWarm` += new `oral`,
  `hands`, `kink`, `rim`. None is `basic: 1`, so the 1.5× basics weighting (65) is unchanged.
- **Fitness**: the builder's fitness pools are hand-named lists (`push`, `hiit`, `fxHips`, …). Each new exercise
  joins the named pools it fits through `POOL_ADDS` at key `13` (the Phase 10/13 pattern); `abs`, `absW` pick it up
  by themselves. An exercise that fits no existing pool isn't drawn by any builder: it still shows on the Exercises
  page and in Swap. Each fitness ticket lists, per exercise, the pools it joins.
- **The newest catalogue is held at 12** (121): `recipe-book.js`'s `generate` defaults `catalogue` to the highest
  `added`, which own programs and random workouts store. Ticket 1 pins it (`NEWEST = 12`); ticket 21 moves it to 13
  once every catalogue-13 exercise is in. Couple programs aren't in the book (`skipped`), so tickets 19–20 aren't held.

## Tickets

Every ticket edits `exercises.js` (exercises and poses live together), so two never build at once: the cap of 2
goes unused this phase (CLAUDE.md: tickets that edit the same files wait).

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-22-catalogue-13` | done (PR #256) |
| 1 | Catalogue-13 plumbing: page cap 350, pools, held newest, four subjects in `EX_FAMILIES` | feature | – | `feature/catalogue-13` | done (PR #257) |
| 1b | More kinds plumbing: page gate 1 MB, longer UI timeouts, eight more pools, six subjects in `EX_FAMILIES` | feature | 1 | `feature/c13-more-kinds` | todo |
| 2 | Intercourse +24 (a) | content | 1 | `content/c13-fuck-a` | done (PR #258) |
| 3 | Intercourse +24 (b) | content | 2 | `content/c13-fuck-b` | done (PR #261) |
| 4 | Intercourse +24 (c) | content | 3 | `content/c13-fuck-c` | done (PR #263) |
| 4b | Intercourse +19 (d) | content | 4 | `content/c13-fuck-d` | done (PR #264) |
| 5 | Oral +23 | content | 1 | `content/c13-oral` | done (PR #267) |
| 5b | ~~Oral +30 (b)~~ | content | 5 | – | dropped (122) |
| 6 | Anal +30 | content | 1 | `content/c13-anal` | todo |
| 6b | ~~Anal +30 (b)~~ | content | 6 | – | dropped (122) |
| 7 | Toys +36 | content | 1 | `content/c13-toys` | todo |
| 8 | Hands +36 | content | 1 | `content/c13-hands` | todo |
| 9 | Rough +36 | content | 1 | `content/c13-rough` | todo |
| 10 | Kink-lite +36 (a), him on her | content | 1 | `content/c13-kink` | todo |
| 10b | Kink-lite +30 (b), her on him (~16), and the rule's exception | content | 10 | `content/c13-kink-b` | todo |
| 11 | Body play +36 (a) | content | 1 | `content/c13-body` | todo |
| 11b | Body play +30 (b) | content | 11 | `content/c13-body-b` | todo |
| 12 | Rimming +36, and the rule's exception | content | 1 | `content/c13-rim` | todo |
| 12b | Edging +36 | content | 1b | `content/c13-edging` | todo |
| 12c | Massage +36 | content | 1b | `content/c13-massage` | todo |
| 12d | Strip and tease +36 | content | 1b | `content/c13-tease` | todo |
| 12e | Shower and bath +36 | content | 1b | `content/c13-shower` | todo |
| 12f | Pool +36 | content | 1b | `content/c13-pool` | todo |
| 12g | Hot tub +36 | content | 1b | `content/c13-hottub` | todo |
| 12h | Balcony +36 | content | 1b | `content/c13-balcony` | todo |
| 12i | Doorframe +36 | content | 1b | `content/c13-doorframe` | todo |
| 13 | Chest +9, back +12, full +5 | content | 1 | `content/c13-chest-back` | todo |
| 14 | Upper +17 | content | 1 | `content/c13-upper` | todo |
| 15 | Lower +22 | content | 1 | `content/c13-lower` | todo |
| 16 | Abs +21 | content | 1 | `content/c13-abs` | todo |
| 17 | Cardio +16, boxing +7, kick +6 | content | 1 | `content/c13-cardio-combat` | todo |
| 18 | Yoga +15, pilates +11, flex +7, mobility +8, balance +6 | content | 1 | `content/c13-mind-body` | todo |
| 19 | Rough and Kink-lite: 16 programs | content | 9, 10b | `content/c13-rough-kink-programs` | todo |
| 20 | Body play and Rimming: 16 programs | content | 11b, 12 | `content/c13-body-rim-programs` | todo |
| 20b | Edging and Massage: 16 programs | content | 12b, 12c | `content/c13-edging-massage-programs` | todo |
| 20c | Strip and tease, Shower and bath: 16 programs | content | 12d, 12e | `content/c13-tease-shower-programs` | todo |
| 20d | Pool and Hot tub: 16 programs | content | 12f, 12g | `content/c13-pool-hottub-programs` | todo |
| 20e | Balcony and Doorframe: 16 programs | content | 12h, 12i | `content/c13-balcony-doorframe-programs` | todo |
| 21 | Open catalogue 13 to own programs and random workouts | feature | 2–18, 12b–12i | `feature/open-catalogue-13` | todo |

Order: plan order; 1b goes right after 5. 19–20e need only their kinds, so they may go before 13–18 if those wait
on Grok.

### 1. Catalogue-13 plumbing
- `tests/build.test.js`: the 135 KB caps (lines 34–36, 112–114) and the 150 gate become one 350 KB gate (95).
- `program-builder.js`: the four computed `sex*` pools and `mergedAt`'s catalogue-13 adds (above); `POOL_ADDS`
  gets nothing yet.
- `recipe-book.js`: `generate`'s default `catalogue` is a pinned `NEWEST = 12`, not the highest `added`.
- `app/library.js`: Couples in `EX_FAMILIES` gets Rough, Kink-lite, Body play, Rimming (`rough`, `kink`, `body`,
  `rim`). Phase 21's "no empty subject" test allows these four until tickets 9–12 fill them.
- The four After dark subjects go into `FAMILIES` and `SHELVES` with their programs (tickets 19–20), not here: the
  recipe tests want every listed subject to have programs.
- **Test first:** `tests/couple-odds.test.js`/a new `tests/catalogue-13.test.js`: `mergedAt(11)` and `mergedAt(12)`
  are deep-equal to today's (pinned); `poolsAt(13).sexRough` etc. exist and are empty; the book's catalogue is 12
  even with a fake `added: 13` exercise in `EX`; the page gate is 350 KB.
- **Done when:** `rm -rf data && node build.js` on main and on the branch: `diff -r` shows no program file
  changing; no pin moves.

### 1b. More kinds plumbing
- `tests/build.test.js`: the 350 KB gate becomes 1 MB (127); CLAUDE.md already says so.
- `playwright.config.js`: a per-test `timeout` twice the slowest test's time today (the every-exercise loop, ~1.2 min
  in a one-page run); `expect` timeouts stay. CI's job has no `timeout-minutes`, so nothing to raise there.
- `program-builder.js`: computed pools `sexEdging`, `sexMassage`, `sexTease`, `sexShower`, `sexPool`, `sexHottub`,
  `sexBalcony`, `sexDoorframe` (`added === 13` and the `sub`, so the 2 old massage and 4 old tease stay out);
  `mergedAt(13)` adds Edging and the five places to `sexFuck`, Massage and Strip and tease to `sexWarm`, all to
  `sexPositions` (117's split: penetration in `sexFuck`, warm-up acts in `sexWarm`).
- `app/library.js`: Couples in `EX_FAMILIES` gets Edging, Shower and bath, Pool, Hot tub, Balcony, Doorframe; Tease
  shows as "Strip and tease". The "no empty subject" test allows the six until their tickets fill them.
- **Test first:** `tests/catalogue13.test.js`: the eight pools exist and are empty, `mergedAt(12)` unchanged; the
  page gate is 1 MB.
- **Done when:** the build diff shows no program change; the Exercises page lists the six new subjects.

### 2–12i. The sex exercises (715)

**Review lessons from tickets 2–4b, for every sex ticket's prompt:** (1) different = a different body arrangement, not
the same one on other furniture or with a leg held another way; (2) it must work for real bodies (hip heights meet,
no unsafe holds); (3) Grok checks against all existing exercises of its `sub` with a script before writing (`node test-results/list-sub.js <sub>`, a scratch file); (4) a seated woman (pelvis on the bed) can't be entered from behind or the side. Status
updates only on change, in words; CI runs named by run number.
Each: the ticket's exercises in `exercises.js`, `cat: 'couple'`, its `sub`, `added: 13`, two-figure poses with the
pelvic mark (Phase 20 ticket 1), a cue in the Phase 20 register (one paragraph, explicit, dirty slang, no orgasm
script; who is where, the hold, what to brace), his muscles. Written from his side (CLAUDE.md, "Writing program
text"). Ids are new (`fuck_*`, `oral_*`, `anal_*`, `toy_*`, `hands_*`, `rough_*`, `kink_*`, `body_*`, `rim_*`), never
reusing a catalogue-11 position with a new name: each is a position or act not already in the catalogue.
- 5, 6: oral and anal, 30 each (122): oral both ways; anal on her only, never him. Oral shipped 23 (124: after a fix
  round 7 still failed, and Noam chose to ship; 6 Oct).
- 2–4b: intercourse, 24, 24, 24 and 19 (91: after two Grok fix rounds the last 5 were still copies; Noam, 6 Oct), new positions and angles (no repeat of the 38 already in `fuck`).
- 7: toys stay on her or worn by him (the strap-on is used on her, never pegging, Phase 20).
- 9: Rough: spanking, hair-pulling, pinning her wrists, holding her down; no choking, anywhere in the text.
- 10, 10b: Kink-lite: blindfold, ties or cuffs, a gag, ice or wax. 10 is him doing it to her; 10b is ~16 of her
  doing it to him and 14 more of him on her (126). **The exception** goes into CLAUDE.md's "A straight man training
  his own body" and `tests/his-pov.test.js`, worded so her blindfolding, tying, gagging or using ice or wax on him
  passes, and anything in him (pegging, fingers, toys) still fails.
- 11, 11b: Body play, 36 then 30.
- 12b Edging: stop-start, pulling out, slowing down, from his side: what he holds back and braces; no orgasm script.
- 12c Massage: oil on her, his hands and forearms, working down her body into sex; the position he holds while he
  does it.
- 12d Strip and tease: undressing her, dry teasing, the slow build; his stance and hands.
- 12e–12i, the places (125): Shower and bath, Pool, Hot tub, Balcony, Doorframe. A bed position counts again when the
  water, tiles, tub, rail or frame changes what he holds or braces; no two in a kind the same; play counts too
  (washing her, touching under the water). Real bodies still: no holds in deep water, nothing slippery held aloft,
  balconies private and railings only braced against, never leaned over.
- 11: Body play: titfuck, grinding and dry humping, thigh-fucking, cumming on her as an act (no orgasm script).
- 12: Rimming: him on her (most), and her on him. **The exception (74)** goes into CLAUDE.md's "A straight man
  training his own body" and into `tests/his-pov.test.js`, worded so only her rimming him passes: pegging, fingers
  or toys in him still fail.
- **Test first** (each, in `tests/catalogue-13.test.js`): the ticket's count of `added: 13` exercises with that
  `sub`; each has two-figure poses with the mark, muscles, a cue; `poolsAt(13)`/`mergedAt(13)` hold them in the
  right merged pool (117); `mergedAt(12)` unchanged. 9 adds: no "chok" in any cue. 12 adds: the his-pov test's new
  case (her rimming him passes, "peg"/"finger his ass" fails).
- **Done when:** every new exercise's page draws its two figures with the mark (the every-exercise UI loop), 390 px
  light and dark; Claude has read every cue for heat and POV (CLAUDE.md); the build diff shows no program change.

### 13–18. The fitness exercises (162)
Each: the ticket's exercises, `added: 13`, the counts in the table above, using all his equipment (dumbbells,
kettlebell, pull-up bar, bodyweight, mat), with poses that move, muscles, a cue, reps or seconds per level, and a
`HARDER` link where an easier/harder pair exists. Each joins the named pools it fits via `POOL_ADDS[13]`, listed in
the PR. No duplicate of an existing exercise under a new name.
- **Test first** (each): the category's `added: 13` count; every new exercise is in at least one pool at catalogue 13
  (or named in the test's short "Exercises page only" list, with why); `poolsAt(12)` is deep-equal to today's.
- **Done when:** every new exercise's figure moves (the every-exercise UI loop); the build diff shows no program
  change; the Exercises page counts match.

### 19–20e. Twelve new subjects, 96 programs
- 20b–20e as 19–20, two subjects each (123): their pools are `sexEdging`, `sexMassage`, `sexTease`, `sexShower`,
  `sexPool`, `sexHottub`, `sexBalcony`, `sexDoorframe`. Subject names: Edging, Massage, Strip and tease, Shower and
  bath, Pool, Hot tub, Balcony, Doorframe.
- `configs/after-dark.js`: 8 programs in each of Rough, Kink-lite (ticket 19), Body play, Rimming (ticket 20);
  `EXPLICIT` but `catalogue: 13`, 60 days, ticket 8's three shapes split 3 gym then sex, 3 sex then sex, 2 positions
  only (119), minutes as Explicit's. Each subject's sex blocks name its own pool (`sexRough`, …) for one block and
  the merged pools for the rest, so the subject's kind leads without being the whole session.
- The two subjects join `FAMILIES` (Mixed) and `SHELVES` (After dark) in `app/library.js`, after Explicit, and the
  couple-subject exclusions in `tests/recipes.test.js` (`SUBJECTS`) and `recipe-book.js` (couple configs are skipped).
- Names, blurbs and about text from his side (CLAUDE.md), describing the session, not the builder.
- **Test first:** in a new `tests/c13-programs.test.js`: the 16 ids pinned; the 3/3/2 shapes per subject; `couple`,
  `catalogue: 13`, 60 days, `skipped`; minutes in band; every program draws its subject's kind; the his-pov,
  couple-odds and description tests pass with no exception added.
- **Done when:** the ticket's two subjects show on the After dark shelf with 8 programs each (390 px light and dark),
  a day of each opens; existing program files unchanged in the build diff.

### 21. Open catalogue 13
- `recipe-book.js`: `NEWEST = 13`. New own programs and random workouts draw the new fitness exercises; saved ones
  keep the catalogue they stored.
- **Test first:** the book's catalogue is 13; an own program stored at 12 builds the same days as before (pinned);
  a random workout at 13 can draw an `added: 13` exercise.
- **Done when:** a new random workout on the phone shows a catalogue-13 exercise within a few tries; an own program
  saved before the ticket is unchanged.

## Challenge round
- **Weakest assumption: that the phase can grow catalogue 13 ticket by ticket.** It can't as built: `generate`
  takes the newest catalogue from the highest `added`, so the first `added: 13` exercise would move own programs and
  random workouts to 13, and an own program saved after ticket 2 would reshuffle when ticket 13 adds to its pools
  (Phase 21 had the same gap between its tickets 3 and 4). Verified in `recipe-book.js:116` and `recipes.js:83`.
  **Plan edit:** decision 121; ticket 1 holds `NEWEST = 12`, ticket 21 opens 13.
- **What I hadn't read, and what opening it changed:**
  - `program-builder.js`: the fitness pools are hand-named lists, not computed by `cat`, so new fitness exercises
    reach no builder by themselves (decision 81 assumed they would). **Plan edit:** every fitness ticket adds its
    exercises to `POOL_ADDS[13]` and lists them; the test fails on an exercise in no pool.
  - `mergedAt` only adds catalogue 11 through an exact `added === 11`; catalogue 13 needs its own adds there, kept
    off `mergedAt(11)`/`(12)`. **Plan edit:** ticket 1, pinned by test.
  - `tests/build.test.js` still gates at 135 KB with the page at 130.6: the first content ticket would fail it.
    **Plan edit:** the 350 gate is in ticket 1, not later. 88 exercises cost ~11.5 KB, so 506 land near 200 KB.
- **The lazier version:** the 432 couple exercises in 5 tickets of ~85, and the fitness in 2. Not proposed: 24–36
  cues is what one review of heat and POV can read properly (Phase 20 tickets 5–7),
  and every ticket edits `exercises.js`, so bigger tickets don't buy parallelism, only longer reviews. Also not
  proposed: splitting `exercises.js` so couple and fitness tickets could build two at a time; poses and helpers live
  in its closure, and the split is a refactor this phase doesn't need.
- **Noam's counts (6 Oct, after the first draft):** 344 sex exercises instead of 216 and 32 programs instead of 20.
  **Plan edit:** intercourse 3 tickets of 24, every other kind one ticket of 28–36; the programs in two tickets of 16.
- **Noam's counts, read again (6 Oct, after ticket 3):** his numbers are what each kind adds, not totals: 432 sex
  exercises. **Plan edit:** ticket 4b (intercourse +24), oral and anal split into two tickets of 30 (5/5b, 6/6b),
  toys and hands +36 each.
- **Noam's counts, third pass (6 Oct, during ticket 5):** oral and anal were too many. **Plan edit:** 5b and 6b
  dropped; Kink-lite and Body play +30 each (10b, 11b); eight more kinds of 36 (12b–12i) with 8 programs each
  (20b–20e); ticket 1b for their pools, the 1 MB gate and longer timeouts; the hitting-the-wall rule (124).
  - Weakest assumption: that 36 real, different exercises exist for each place. Doorframe and Balcony may hit the
    wall as intercourse did; 124 lets them ship short instead of padding. Not verifiable ahead: the review finds it.
  - What I hadn't read: `app/library.js`'s Couples list already has `massage` (2) and `tease` (4). **Plan edit:**
    Massage and Strip and tease grow those kinds, no new `sub`s, and their pools take `added === 13` only.
  - The lazier version: one "Places" kind instead of five; offered, Noam chose five of 36 with the wall rule.

# Phase 20: After dark, refined, and an Explicit set

Requested 4 Oct 2026 (Noam, [#202](https://github.com/noamros9/kettle-bar/issues/202)), grilled on the issue on 5 Oct in
five rounds and two corrections; the last comments there are what this plan builds. Numbered 20 because Phase 19 is
super programs (#186), planned but not started. Today After dark has 105 programs in 15 subjects and 43 couple
exercises (catalogue 10), 17 of them positions (`pos_*`).

Locked on the issue (5 Oct):
- **Refine what shipped, in place:** rewrite the 17 `pos_*` cues and the 7 `dare_*` cues; rewrite the blurbs and about
  text of the 105 After dark programs (30 in `configs/mixed.js`, 75 in `configs/after-dark.js`). Same exercise ids, same
  day types, no pin changes. Shared exercises (`hip_thrust`, `pelvic_floor_hold` and the rest) keep their cues.
- **Register:** one short paragraph per cue, explicit words and dirty slang, no orgasm script. The cue names the act
  and keeps today's shape: who is where, the hold, what to brace. The missionary sample is on the issue's round 1.
  Written for him and her.
- **Drawings:** a pelvic mark on the existing stick figures (the image tool refused rendered scenes, so no pictures and
  no prefetch). Drawn only when a pose asks for it: the 17 `pos_*` and every new position. Dares, massages, partner
  moves and one-figure exercises don't ask.
- **Catalogue 11:** 24 intercourse, 24 oral, 24 anal, 8 toys (wand, plug, strap-on with pegging, cock ring, each in more
  than one position). Anal is him fucking her; pegging is the strap-on. All category `couple`, `added: 11`.
- **Explicit:** a subject chip on the After dark shelf (family Mixed, not a new family or tab), 20 programs: 7
  gym-then-sex, 7 sex-then-sex, 6 positions-only. Minutes in the Couples band (about 26–33, a few shorter, a few
  toward 45).
- **9 more in each of the 15 After dark subjects (135):** 3 gym-then-sex, 3 sex-then-sex, 3 positions-only. Minutes
  follow the subject (Quickie about 16–20, Morning glory about 40–48, Beach body about 26–35). About text hand-written.
- **All 155 new programs are 60 days** (levels at days 1–20, 21–40, 41–60), `catalogue: 11`, `couple: true` (so the
  recipe book skips them from build your own and random), dealt from the pools and pinned.
- **Session shapes:** gym work then sex; sex then sex (a warm-up sex block, then intercourse); positions only. A
  positions-only day is the one exception to two families a day.

Decided while planning (5 Oct, Noam):
- **+8 hands exercises** (fingering, handjob, and the like), pool `hands`: the "oral or hands" block of sex-then-sex
  draws `oralSex` and `hands`. Catalogue 11 is 88, not 80.
- **The page cap goes from 125 to 135 KB gzipped** (the gate in CLAUDE.md stays 150). Today's page is 119 KB; the 43
  couple exercises cost ~5.6 KB, so 88 more and longer cues add ~11–12 KB.
- **Swap stays as it is:** any couple exercise swaps for any couple one, so older couple programs' Swap lists will
  offer catalogue-11 exercises too.
- **Text is Grok's.** Grok writes every explicit cue, blurb and about. Claude's review checks structure, tests and the
  locked rules above, and doesn't rewrite the wording. A ticket whose text fails review after Grok's fix round gets a
  **second** Grok round (code and test failures Claude still fixes itself, as CLAUDE.md says).

Decided by Claude while planning (correct any):
- **The new oral pool is `oralSex`, not `oral`.** `oral` is a catalogue-10 pool (`pos_oral_her`, `pos_oral_him`,
  `pos_69`); adding to it would reshuffle every program that draws it. New pools: `fuck`, `oralSex`, `anal`, `toy`,
  `hands`, plus `explicit` (all 88 positions, for positions-only days).
- **Positions tour keeps one-off days.** Its 9 new programs are 60 one-off days each (`tour()` takes positions × ways
  = 60, the session shapes among the ways), because one-off days is what that subject is (Phase 18, decision 52).

## Who builds
Noam handed Claude the hand-offs for this phase (5 Oct): **every ticket goes to Grok**, by the Grok-tickets rule in
CLAUDE.md. Claude creates the ticket's branch, runs `grok -p` with this file and the ticket number, reviews, opens the
PR and merges on green CI.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-20-explicit` | done (PR #205) |
| 1 | The pelvic mark | feature | – | `feature/pelvic-mark` | done (PR #207) |
| 2 | Rewrite the position and dare cues | content | – | `content/explicit-cues` | done (PR #209) |
| 3 | Rewrite the Phase 16 After dark text (30) | content | – | `content/after-dark-text-16` | done (PR #210) |
| 4 | Rewrite the Phase 18 After dark text (75) | content | – | `content/after-dark-text-18` | done (PR #211) |
| 5 | Catalogue 11: intercourse (24) | feature | 1 | `feature/catalogue-11` | todo |
| 6 | Catalogue 11: oral (24) and hands (8) | content | 5 | `content/catalogue-11-oral` | todo |
| 7 | Catalogue 11: anal (24) and toys (8) | content | 5 | `content/catalogue-11-anal` | todo |
| 8 | Explicit (+20), and the three session shapes | feature | 6, 7 | `content/explicit` | todo |
| 9 | Beach body, Bedroom stamina, Sex positions (+27) | content | 8 | `content/explicit-more-a` | todo |
| 10 | Couples, Endurance & control, Hip power & thrust (+27) | content | 8 | `content/explicit-more-b` | todo |
| 11 | Carry & hold, Flexible & bendy, Strip & show-off (+27) | content | 8 | `content/explicit-more-c` | todo |
| 12 | Her pleasure, Quickie, Back & knees care (+27) | content | 8 | `content/explicit-more-d` | todo |
| 13 | Date night warm-up, Positions tour, Morning glory / Sunday (+27) | content | 8 | `content/explicit-more-e` | todo |

### 1. The pelvic mark
- `figures.js`: a pose (and its `two`) may carry `mark: 1`; the figure then draws a small filled mark at its hip, in
  `var(--mark)`, defined in both themes. Animation carries the mark through every frame. Nothing else changes.
- Add `mark: 1` to both figures of every pose of the 17 `pos_*` exercises.
- **Test first:** `figureSVG` of `pos_missionary` draws one mark per figure, at each figure's hip, inside the viewBox;
  `figureSVG` of every exercise without `mark` is byte-for-byte what it was (hash the lot before and after).
- **Done when:** the Exercises page's Couples section at 390 px, light and dark: the 17 positions show the mark,
  nothing else changed.

### 2. Rewrite the position and dare cues
- The 17 `pos_*` and the 7 `dare_*` cues in `exercises.js`, in the register above. Names, numbers, poses, muscles
  unchanged.
- **Test first:** in `tests/catalogue10.test.js`: every `pos_*` and `dare_*` cue is one paragraph (no line breaks) of at
  most 400 characters; the cues of every non-couple exercise are byte-for-byte what they were (a hash of all of them).
- **Done when:** no pin changes; the 24 new cues read on a 390 px exercise page without overflow.

### 3. Rewrite the Phase 16 After dark text (30)
- `blurb` and `about` of the 30 After dark programs in `configs/mixed.js` (Beach body, Bedroom stamina, Sex positions).
  Names may change only if Noam asks; ids, days and everything else stay.
- **Test first:** the 30 ids, their `cycle` and `dayTypes` deep-equal what they were; every blurb is one sentence of
  at most 140 characters, every about one paragraph.
- **Done when:** no pin changes; `rm -rf data && node build.js` differs from main only in the 30 library entries.

### 4. Rewrite the Phase 18 After dark text (75)
- As ticket 3, for the 75 programs in `configs/after-dark.js`.
- **Test first / Done when:** as ticket 3, for those 75.

### 5. Catalogue 11: intercourse (24)
- 24 intercourse positions, category `couple`, `added: 11`, `u: 'sec'`, reps per level, muscles, a cue in the
  register, two-figure poses with `mark: 1`. New pool `fuck` in `program-builder.js` (new name only).
- The page caps in `tests/build.test.js` go from 125 to 135 KB (both tests that say 125).
- **Test first:** a new `tests/catalogue11.test.js`: every `added: 11` exercise is `couple`, has poses with the mark on
  both figures, muscles and a one-paragraph cue; `fuck` holds exactly the 24; no pool a catalogue-10 config can name
  contains an `added: 11` exercise; `rm -rf data && node build.js` on main and the branch differ only in new files.
- **Done when:** page under 135 KB; the 24 draw at 390 px, light and dark.

### 6. Catalogue 11: oral (24) and hands (8)
- As ticket 5: 24 oral (going down on her, on him, 69s, face-sitting and the like) in `oralSex`, 8 hands in `hands`.
- **Test first:** extend `catalogue11.test.js`: the two pools hold exactly their 24 and 8.
- **Done when:** as ticket 5.

### 7. Catalogue 11: anal (24) and toys (8)
- As ticket 5: 24 anal (him fucking her) in `anal`, 8 toys in `toy`: wand, plug, strap-on (pegging), cock ring, each
  in more than one position. Add `explicit`: all 88.
- **Test first:** extend `catalogue11.test.js`: `anal` 24, `toy` 8, each toy named in at least two of the 8,
  `explicit` is exactly the 88.
- **Done when:** as ticket 5.

### 8. Explicit (+20), and the three session shapes
- In `configs/after-dark.js`: `EXPLICIT = { added: 20, catalogue: 11, couple: true, equip: 'bw' }` and three day
  builders: `gymThenSex` (partner work, then a positions block from the new pools), `sexThenSex` (`oralSex`/`hands`,
  then `fuck`/`anal`/`toy`), `positionsOnly` (a single positions flow from `explicit`, one family: marked so the
  two-families test skips it, and only it).
- Subject **Explicit** in `SHELVES` (After dark) and `FAMILIES` (Mixed); 20 programs, 60 days, 7/7/6 by shape,
  hand-written blurb and about, explicit names.
- **Test first:** in a new `tests/explicit.test.js`: the 20 ids; every day of each is its shape; Mixed rules (two
  families a day except positions-only days); every program is `couple`, `catalogue: 11`, 60 days, and in the recipe
  book's `skipped`; the configs test keeps every subject in one family and one group.
- **Done when:** pins added, no existing pin changes, recipe book and page under their gates, 390 px screenshots
  of an Explicit day of each shape, light and dark.

### 9–13. Nine more in each of the 15 subjects (+135)
- Each subject gets 9 programs, 3 of each shape, 60 days, `EXPLICIT`, minutes in that subject's band, names and about
  hand-written for that subject. Each ticket covers the 3 subjects in its row.
- Positions tour (ticket 13): `tour()` grows to 60 one-off days (positions × ways = 60, the shapes among the ways).
- **Test first** (each): the 27 ids pinned in the tests, shapes, Mixed rules, `couple` and `skipped`, minutes in band.
- **Done when:** as ticket 8.

## Challenge round
- **Weakest assumption:** that 88 exercises fit in 135 KB. Verified only by scale: the 43 couple exercises gzip to
  ~5.6 KB on their own, so 88 is ~11.5 KB and the page lands near 131 KB. Ticket 5 measures the first 24 before 6 and
  7 add the rest; if 24 cost more than 3.5 KB, stop and move catalogue 11 to a lazy file (the option Noam passed on).
- **What I hadn't read, and what opening it changed:** `program-builder.js` already has an `oral` pool, so the new
  one is `oralSex` (plan edit: pool names). `tests/build.test.js` caps the page at 125 KB, not 150, which led to the
  page-size question and the raised cap (ticket 5). `ROADMAP.md` already holds a Phase 19, so this is Phase 20.
- **The lazier version:** no session-shape builders, every new program a copy of an existing `buildUp`. Not taken:
  the shapes are locked, and positions-only needs its own exception in the family rule anyway. Also not taken: one
  ticket for the 135; 27 programs per ticket is already more than Phase 18's 20, and Grok's output has to stay
  reviewable.
- **Text I won't write:** the explicit wording is Grok's. If Grok refuses or softens it, that shows in ticket 2
  first (the smallest text ticket); ticket 2 is the test of whether this phase works as planned.

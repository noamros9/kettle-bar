# Phase 21: exercise families and subjects, and more warm-ups and cool-downs ([#220](https://github.com/noamros9/kettle-bar/issues/220))

Grilled 5–6 Oct 2026 (Noam); decisions 68–71 and 98–105 in [ROADMAP.md](../../ROADMAP.md). Grok builds every
ticket; Claude reviews and merges (CLAUDE.md, "Grok tickets").

## The map

`cat` stays as it is (68): the builders read it, and every pin with it. The family → subject map sits on top, for the
Exercises page only.

| Family | Subjects | How an exercise lands there |
|---|---|---|
| Warm-up | Dynamic moves · Joint circles · Activation | `cat: 'warmup'`, its `sub`: `dynamic` / `joints` / `activation` |
| Stretch & cool-down | Static stretches · Breathing · Flexibility | `cat: 'cooldown'`, its `sub`: `static` / `breath`; `cat: 'flex'` → Flexibility (101) |
| Muscles | Chest · Back · Shoulders · Arms · Legs & glutes · Core & abs · Full body | `cat` chest, back, abs, upper, lower: its **first primary muscle** (table below); `cat: 'full'` → Full body |
| Cardio & combat | Cardio · Boxing · Kickboxing | `cat` cardio, boxing, kick |
| Mind & body | Yoga · Pilates · Balance · Mobility | `cat` yoga, pilates, balance, mobility |
| Couples | Intercourse · Oral · Hands · Anal · Toys · Partner work · Tease · Dares · Massage | `cat: 'couple'`, its `sub`: `fuck` / `oral` / `hands` / `anal` / `toys` / `partner` / `tease` / `dare` / `massage`. Phase 22 adds `rough`, `kink`, `body`, `rim` |

Primary muscle → Muscles subject: chest → Chest; lats, upper_back, lower_back, traps, neck → Back; front_delts,
side_delts, rear_delts → Shoulders; triceps, biceps, forearms → Arms; glutes, quads, hamstrings, adductors, calves,
shins, hip_flexors → Legs & glutes; abs, obliques → Core & abs.

`sub` is a new key on warm-up, cool-down and couple exercises only, where `cat` can't tell the subject. Couple
exercises in two of the builder's pools (`kiss_squat`, `winners_choice`, `wheelbarrow_walk`, …) get the one they
mostly are. The builder never reads `sub`, so no program's days change.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-21-exercise-families` | done (PR #242) |
| 1 | Families and subjects on the Exercises page | feature | – | `feature/exercise-families` | done (PR #243) |
| 2 | Equipment and Muscle as one-line menus | feature | 1 | `feature/exercise-filter-menus` | todo |
| 3 | +24 warm-ups (`added: 12`) | content | 1 | `content/more-warmups` | todo |
| 4 | +18 cool-downs (`added: 12`) | content | 1 | `content/more-cooldowns` | todo |

### 1. Families and subjects on the Exercises page
- `exercises.js`: `sub` on the 6 warm-ups, the 12 cool-downs and every couple exercise (131 today).
- `app/library.js`: `EX_FAMILIES` (the table above, in order) and `familyOf(e) -> { family, subject }`.
  `searchExercises` takes `{ family, sub }` in place of `cat`. It returns counts for the family chips and, when a
  family is picked, for its subjects (only those with exercises). A picked one with none falls back to All, as
  `cat` does today.
- `app/pages/exercises.js`: one row of family chips (All + six), then the picked family's subject chips. The list's
  sections follow the pick (103): All → one per family; a family → one per subject; a subject → one section. Clear
  all resets both. Equipment and the muscle row stay as they are (ticket 2 changes them).
- `tests-ui/exercises.spec.js`: the tests that name "Filter by category" or the Couples chip move to families.
- **Test first:**
  - `tests/library.families.test.js`: every exercise in `EX` gets exactly one family and one subject from the table,
    and no subject is empty except Breathing (until ticket 4). Every warm-up, cool-down and couple exercise has a known `sub`; no other exercise has one.
    Goblet squat → Muscles / Legs & glutes; `half_split` → Stretch & cool-down / Flexibility; `oral_69` → Couples /
    Oral. `searchExercises` with `{ family: 'muscles', sub: 'chest' }` returns chest exercises only, with counts.
  - Phone tests: picking Muscles shows its seven subjects and one section each; picking Chest leaves one section;
    All shows six family sections.
- **Done when:** the Exercises page shows six families and their subjects at 390 px in light and dark, with no
  sideways scroll at 360 px. `rm -rf data && node build.js` on main and on the branch: `diff -r` shows no program
  file changing, and no pin moves.

### 2. Equipment and Muscle as one-line menus
- `app/pages/exercises.js`: "Equipment: Any ▾" and "Muscle: Any ▾" lines, like the Programs page's `menuLine`
  (`app/pages/programs.js`). Tapping one opens its chips under it; picking one closes it, and the label shows the
  pick (98). `#exercises?muscle=x` lands with the menu closed, reading "Muscle: Glutes ▾" (100). Equipment and the
  menu that's open stay page state, not URL.
- If `menuLine` and its chips can be shared without changing the Programs page, move them to `app/ui.js`. If not,
  copy the 3 lines: no new abstraction for two uses.
- **Test first** (`tests-ui/exercises.spec.js`): the muscle chips aren't on the page until "Muscle: Any ▾" is tapped.
  Picking Glutes closes the menu, reads "Muscle: Glutes ▾" and filters. The #234 tests still pass, reaching the chips
  through the menu. `#exercises?muscle=glutes` opened cold shows "Muscle: Glutes ▾" closed and the filtered list.
- **Done when:** at 390 px the first exercise card is visible without scrolling past the filters, with a family
  picked (light and dark).

### 3. +24 warm-ups
- `exercises.js`: 24 new `cat: 'warmup'` exercises, `added: 12`, 8 per subject (`dynamic`, `joints`,
  `activation`), so the family holds 30. Bodyweight or mat only (no load), 20–40 s or 8–15 reps, each with a cue, its
  muscles and poses (`figures.js`) that move.
- They join the builder's `warmups` and `mobility` pools only at catalogue 12, so existing programs keep their days.
  Random workouts and new own programs pick catalogue 12 up as the newest (decision 81).
- **Test first:** the catalogue test grows: 30 warm-ups, 24 with `added: 12`, each with poses, muscles and a `sub`.
  A config at catalogue 11 draws the same warm-ups as before (pins unchanged); at catalogue 12 the pool holds 30.
- **Done when:** every new warm-up's page draws its figure moving (the every-exercise UI loop), and the build diff
  shows no program change.

### 4. +18 cool-downs
- `exercises.js`: 18 new `cat: 'cooldown'` exercises, `added: 12`: 12 `static` and 6 `breath` (box breathing,
  4-7-8, belly breathing lying down…), so the family holds 30 with the Flexibility stretches beside it. `u: 'sec'`,
  one-side stretches with `side`, poses in `figures.js` (breathing: a still pose is fine).
- **Test first:** the catalogue test: 30 cool-downs, 18 with `added: 12`, 6 of them `breath`. Catalogue 11 draws as
  before; catalogue 12's `cooldowns` pool holds 30.
- **Done when:** as ticket 3.

## Challenge round
- **Weakest assumption: that Phase 21's new exercises can share catalogue 12 with Phase 22.** They can't. Saved own
  programs store the newest catalogue (`app/own.js:257`, `recipe-book.js:116`) and rebuild from it. If Phase 22
  later added more `added: 12` exercises, an own program saved in between would reshuffle. **Plan edit:** decision
  105 in ROADMAP.md moves Phase 22 to catalogue 13, and with it Phase 20 tickets 9–15 and Phase 23.
- **What I hadn't read, and what reading it changed:**
  - `app/warmup.js`: the warm-up a day *shows* for dynamic and gentle days comes from fixed lists (`DYNAMIC`,
    `GENTLE`, `QUIET`). Only the builder's own warm-ups draw from the pool. So ticket 3's Done-when doesn't promise
    new warm-ups on every day page; they come with new programs, random workouts and own programs.
  - The catalogue: no breathing exercise exists today, so Breathing starts with ticket 4's six. Ticket 1's test
    allows a subject with no exercises yet only for Breathing, and ticket 4 removes that exception.
- **The lazier version:** compute subjects with no `sub` key: couple subjects from the builder's pools, warm-ups
  from `warmup.js`'s lists. Not proposed: some couple exercises are in two pools, the warm-up lists aren't
  catalogue exercises (shadow footwork is boxing), and Phase 22 would have to add pools only to label exercises.
  One explicit key is less to decode.

# Phase 8: finding things, and stats

Source of truth for ideas 4–6 of [#67](https://github.com/noamros9/kettle-bar/issues/67) and the richer stats of
[#66](https://github.com/noamros9/kettle-bar/issues/66). Decisions from 29 Sep are in
[ROADMAP.md](../../ROADMAP.md). Glossary: [CONTEXT.md](../../CONTEXT.md). Stats count planned volume
([ADR 2](../adr/0002-stats-count-planned-volume.md)); nothing here logs what was lifted.

Decided on 29 Sep:
- **Favourites and hidden subjects are synced** (in `prefs`, review III ticket 5).
- **Stats:** all four groups: where time goes, kind of work, longer spans, exercise history + CSV. As **tabs**:
  Overview · Muscles · Time · Exercises.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 1 | Favourite programs, hide subjects | feature | review III 1, 5 | `feature/favourites` | done (PR #115) |
| 2 | Programs page: equipment filter | feature | review III 1 | `feature/equipment-filter` | done (PR #116) |
| 3 | Exercises page: search and filters | feature | – | `feature/exercise-search` | done (PR #118) |
| 4 | Stats in tabs | feature | – | `feature/stats-tabs` | done (PR #119) |
| 5 | Where time goes, kind of work | feature | 4, Phase 6 1 | `feature/stats-time` | done (PR #120) |
| 6 | Longer spans and the weekly trend | feature | 4 | `feature/stats-spans` | done (PR #121) |
| 7 | Exercise history, level over time, CSV | feature | 4 | `feature/stats-exercises` | done (PR #123) |

### 1. Favourites and hidden subjects (#67.4)
- A star on each program card and program page. Starred programs show in a **Favourites** shelf at the top (under
  Your programs). In Settings, **Hidden subjects**: ticked subjects don't show as chips or shelves.
- `libraryView` (review III ticket 1) takes `prefs` and returns the favourites shelf and drops hidden subjects,
  counts included.
- **Test first:** `libraryView` with one favourite and one hidden subject: shelf first, counts without the hidden one.

### 2. Equipment filter (#67.6)
- Next to Length on the line under the chips: "Equipment: Any ▾" with All, Kettlebell only, No equipment. Counts
  follow it.
- **Test first:** `libraryView` counts with equipment set.

### 3. Exercises page: search and filters (#67.5)
- A search field (name, muscle, cue) and chips by category and equipment on the Exercises page. Pure
  `searchExercises(EX, query, filters)` in `app/library.js`.
- **Test first:** "hip" finds hip thrust, hip CARs and hip airplane; the kettlebell chip keeps only kettlebell ones.

### 4. Stats in tabs
- **Overview** (today's page: week, workouts, minutes, sets, reps), **Muscles** (heat map and ranked bars),
  **Time** (ticket 5–6), **Exercises** (ticket 7). The scope and span switches stay above the tabs.
- No new numbers in this ticket. `app/stats.js`'s `report` keeps its interface.
- **Test first:** a UI test: every tab renders in both themes, scope and span carry across tabs.

### 5. Where time goes, kind of work (#66)
- **By family and subject:** workout minutes per family (and per subject when a family is tapped). Mixed days split
  by their blocks' `family` (Phase 6 ticket 1), each block's time from `formats.time`.
- **By format:** minutes in straight sets, supersets, circuits, timed intervals, flows, bouts.
- **Kind of work:** strength volume (sets and reps), cardio minutes (Cardio & combat blocks), mobility and
  flexibility minutes (Mind & body blocks), as three totals.
- `report` gains `byFamily`, `bySubject`, `byFormat`, `kinds`.
- **Test first:** a week of one strength day, one boxing day and one mixed strength + yoga day: the minutes land in
  the right families, the mixed day split by its blocks.

### 6. Longer spans and the trend (#66)
- Spans gain **3 months**, **this year** and all time, and the Time tab shows a line of minutes per week (a bar per
  month for the year). Weeks still start on Sunday.
- **Test first:** `spanRange('year', now)` and `monthly()` totals equal the sum of their weeks.

### 7. Exercise history, level over time, CSV (#66)
- **Exercises tab:** each exercise done in the span, how many days it came up, when last. Tap → its exercise page.
- **Level over time:** per program in scope, the level of the days done, week by week.
- **CSV export** in Settings: one row per done day (date, program or "Random", day, level, workout minutes,
  stretching minutes, sets, reps).
- **Test first:** `exerciseHistory(entries, …)` counts a swapped exercise as the one done; the CSV has a header and
  one row per done day, random workouts included.

## Challenge round
- **Weakest assumption:** that splitting a mixed day's minutes by block is meaningful. Rests between blocks belong
  to neither. The rule: each block gets its own time, and the between-block rests go to the next block's family.
  Written as a test.
- **What I hadn't read:** the stats UI tests assume one page. Ticket 4 moves them into the tabs before any new
  numbers arrive.
- **The lazier version:** tickets 4–5 only for stats. 6 and 7 are independent and can follow later.

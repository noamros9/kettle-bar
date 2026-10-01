# Phase 9: the body muscle map, and workout history

Source of truth for [#81](https://github.com/noamros9/kettle-bar/issues/81) (body muscle map) and
[#113](https://github.com/noamros9/kettle-bar/issues/113) (workout history with a calendar). Decisions from 1 Oct 2026
are in [ROADMAP.md](../../ROADMAP.md). Glossary: [CONTEXT.md](../../CONTEXT.md). Stats still count planned volume
([ADR 2](../adr/0002-stats-count-planned-volume.md)).

Decided on 1 Oct (Noam):
- **Muscle map** lives on the **Exercises page** ("By muscle"); you pick **several muscles, combined**; you get the
  **exercises and the programs** that work them most.
- **History** is a **Stats → History** tab: a **month grid; tap a day** for what you did. **History yes, streaks no**:
  no streak counts, targets or "don't break the chain".
- Built on it: **workouts by weekday**, **time of day**, and **days per week** as a trend.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-9` | done (PR #124) |
| 1 | Exercises page: pick muscles on the map | feature | – | `feature/muscle-map` | done (PR #125) |
| 2 | Programs that train the picked muscles | feature | 1 | `feature/muscle-programs` | done (PR #126) |
| 3 | Stats → History: the month calendar | feature | – | `feature/history-calendar` | done (PR #127) |
| 4 | Workouts by weekday and time of day | feature | 3 | `feature/history-when` | done (PR #128) |
| 5 | Days per week, as a trend | feature | 3 | `feature/history-days` | |

### 1. Exercises page: pick muscles on the map (#81)
- A **By muscle** switch under the search opens the front/back muscle map (`muscleMapSVG`, the one the exercise pages
  and Stats draw). Tapping a muscle picks it (darker), tapping again unpicks; the picked muscles also show as chips with
  ✕ and **Clear**. Every muscle has a button for keyboards and screen readers (the chips row lists all of them).
- The list below ranks: exercises that work **all** picked muscles first, then those that work more of them, then by how
  much (main muscle 1, secondary ½), then catalogue order. It combines with the search, category and equipment chips.
- Pure `byMuscles(list, picked)` in `app/library.js`; `searchExercises` takes `filters.muscles`.
- **Test first:** glutes + hamstrings: Romanian deadlifts (both main) before hip thrusts (glutes main, hamstrings
  secondary), and both before an exercise with only one of them; one with neither is not listed; a search word too:
  both apply.
- **Done when:** a 390 px screenshot in both themes, the map readable, no sideways scroll at 360 px.

### 2. Programs that train the picked muscles (#81)
- Under the exercises, **Programs that train them most**: the top 5 (library and your own), each a card that opens it.
- A program's **muscle focus** is the share of its weighted sets (stats' muscle load) over all its 60 days that each
  muscle gets. Made at build time for the library as a lazy `data/muscles.json` ({ pid: { muscle: share } }), loaded
  the first time the map is used (and offline after that, like `data/index.json`); your own programs' focus is worked
  out on the device from their days.
- Pure `programFocus(days, EX)` in `app/stats.js` and `rankPrograms(focus, picked)` in `app/library.js`: the sum of
  the picked muscles' shares, programs with all of them first.
- **Test first:** `programFocus` shares add up to 1; with glutes picked, a legs & glutes program ranks above an upper
  body one; a program missing from the file (a new own program) is ranked from its own days.
- **Done when:** the build writes `data/muscles.json` and the size gate still holds; the offline test still passes.

### 3. Stats → History: the month calendar (#113)
- A fifth Stats tab, **History**: this month as a grid (weeks start on Sunday, as everywhere), ‹ › to move a month,
  "Today" back. A day with workouts is filled, darker for more minutes (4 steps, as the heat map); today is outlined.
- **Tap a day:** below the grid, what you did that day: each workout with its program, day, minutes and level; a
  program day opens its day page; a random workout shows what it was (no page to open: it's done).
- The **program** switch narrows it (and the round); the **span** switch doesn't apply here (the grid pages by month).
- Pure `calendarMonth(entries, { dayOf, year, month })` in `app/stats.js` -> weeks of 7 cells
  `{ date, inMonth, minutes, workouts: [entry] }`.
- **Test first:** September 2026 starts on Tuesday 1st: the first row begins Sunday 30 August (not in the month); a
  day with two workouts adds their minutes; days of other programs are left out when one is picked.
- **Done when:** both themes at 390 px, each cell at least 40 px wide at 360 px with no sideways scroll; the cells are
  buttons with labels ("Tuesday 29 September: 2 workouts, 74 minutes").

### 4. Workouts by weekday and time of day (#113)
- On the History tab, under the calendar, for the chosen **span**: **By weekday** (Sun … Sat, bars of workouts) and
  **Time of day** (morning 5–12, afternoon 12–17, evening 17–22, night 22–5).
- Time of day is **when the day was marked done** (the only time stored), and the tab says so.
- Pure `byWeekday(entries, opts)` and `byTimeOfDay(entries, opts)` in `app/stats.js`.
- **Test first:** the bucket edges (04:59 night, 05:00 morning, 12:00 afternoon, 22:00 night); counts follow the span.

### 5. Days per week, as a trend (#113)
- On the History tab: **days you trained per week**, a line (the Time tab's chart), for spans longer than a week. A
  day with two workouts counts once.
- Pure `daysPerWeek(entries, opts)` in `app/stats.js` (rows like `weekly`, newest first).
- **Test first:** two workouts on one date count as one day; a week with none is 0; the rows match `weekly`'s weeks.

## Challenge round
- **Weakest assumption:** that a program's muscle focus from planned sets says what it trains. A yoga flow's holds
  count as sets like a squat's (ADR 2). It's the same rule the Stats heat map uses, so the two agree, and the ranking
  only compares shares.
- **What I hadn't read:** whether the muscle map's paths are big enough to tap on a phone (small muscles like the
  forearms or calves). Ticket 1 checks it on the 360 px screenshot; the chips row is the fallback for every muscle.
- **The lazier version:** tickets 1 and 3 alone (exercises only, calendar only). Programs in ticket 2 need the build
  file; 4 and 5 are small once the calendar's data is there.

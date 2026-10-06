# Muscle chips link to a filtered Exercises page ([#234](https://github.com/noamros9/kettle-bar/issues/234))

Noam, 6 Oct 2026: on an exercise's page, tapping a muscle chip opens the Exercises page filtered by that muscle.
Grilled the same day; decisions 89–94 and 97 in [ROADMAP.md](../../ROADMAP.md). Claude builds it.

- **A muscle chip row on the Exercises page** (90), usable without coming from an exercise.
- **Main and secondary both count** (91): `KBLibrary.searchExercises`' `filters.muscles` already does this (Phase 9,
  via `byMuscles`: main muscle first, then secondary).
- **One muscle at a time** (92): picking one replaces the one picked; tapping it again unpicks it.
- **The link keeps the other filters** (93): search, category and equipment stay; a **Clear all** resets all of them.
- **The muscle is in the URL** (94): `#exercises?muscle=glutes`, so Back and a shared link keep it.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/muscle-chip-links` | done (PR #239) |
| 1 | Muscle chips, the URL and Clear all | feature | – | `feature/muscle-chip-links` | done (PR #240) |

### 1. Muscle chips, the URL and Clear all
- `app/pages/core.js`: `parseHash` reads `exercises?muscle=<key>` (a known key of `MUSCLE_NAMES`, else ignored) as
  `{ view: 'library', muscle }`; plain `exercises` is `{ view: 'library', muscle: null }`.
- `app/pages/exercises.js`:
  - `exSearch` gains `muscle` (one key or `null`); `exFound` passes `muscles: exSearch.muscle ? [exSearch.muscle] : []`.
  - `viewLibrary` takes the muscle from the route: the URL is the truth for the muscle. The search, category and
    equipment stay in `exSearch` as today, so they survive the trip to an exercise and back.
  - `chipsHTML` gets a third row, "Filter by muscle", the 21 muscles in `MUSCLE_NAMES` order (`data-exf="muscle:<key>"`).
    Tapping the picked one unpicks it. A pick or unpick redraws the results only (the field keeps focus) and
    `history.replaceState`s the hash, so it doesn't add a Back step.
  - A **Clear all** button, shown when any filter or the search is set: empties the search field too, and the hash
    becomes `#exercises`.
  - `viewExercise`: the Main and Also chips become buttons (`data-go="exercises?muscle=<key>"`, labelled "Exercises
    that work <muscle>"), styled as today plus a focus ring.
- `tests-ui/exercises.spec.js` gets the new tests; `scripts/ui-affected.js` already maps both pages to it.
- **Test first** (`tests-ui/exercises.spec.js`):
  - An exercise page's Glutes chip opens `#exercises?muscle=glutes` with Glutes pressed, and every card's exercise
    lists glutes as a main or secondary muscle. Back returns to the exercise.
  - With "squat" typed and Kettlebell picked, the chip link keeps both. Tapping Hamstrings replaces Glutes, and the
    URL follows. Tapping Hamstrings again unpicks it.
  - Opening `#exercises?muscle=glutes` cold shows the filter. `#exercises?muscle=nope` shows everything.
  - Clear all empties the search and resets every chip to All / Any / none; the counter shows the full total.
- **Done when:** the tests above pass. A 390 px screenshot (light and dark) shows the muscle row wrapping cleanly, with
  no sideways scroll at 360 px. Noam can tap a chip on an exercise page on his phone and land on the filtered list.

## Challenge round
- **Weakest assumption:** that 21 chips in a third row aren't too much on a phone. The category row already holds 12
  or so and wraps; checked against the 390 px screenshot in ticket 1. If it's crowded, the row scrolls sideways in its
  own strip (as Phase 17's tabs do). No plan edit unless the screenshot says so.
- **What I hadn't read, and what reading it changed:** `searchExercises`, which already takes `filters.muscles` and
  ranks main before secondary. So `app/library.js` doesn't change, and the ticket is UI only. I also read `parseHash`:
  it matches `exercises` exactly, so `?muscle=` needs its own branch there (added to the ticket).
  The Muscles page drops couple exercises; the Exercises page shows them. This filter keeps the Exercises page's
  behaviour (couple exercises that work glutes show under Couples): one page, one rule. No plan edit.
- **The lazier version:** link the exercise page's chips to the existing Muscles page (`#muscles`, with the muscle
  picked). Not proposed: Noam chose the Exercises page with its filters kept (90, 93). A shared URL there would also
  need the same parsing work.

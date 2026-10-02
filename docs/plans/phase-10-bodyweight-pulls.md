# Phase 10: floor-only stand-ins for rows and lateral raises

Source: Phase 7's travel mode finding (ROADMAP, 30 Sep): in **Bodyweight only**, pulling work keeps "Needs gear".
Counted on 2 Oct over every library day: Table rows is the only bodyweight pull, so a day with a second row keeps
one (dumbbell rows 253 times, one-arm rows 222, kettlebell rows 158), and lateral raises have no stand-in at all (208).
Curls, pull-ups and hangs miss too; Noam left those out.

Decided on 2 Oct (Noam):
- **Floor only**: nothing else, not even a table, a door or a towel.
- **Close two gaps**: a **second row** and the **side shoulders** (lateral raises).
- **Used in travel mode and the Swap list, and in new builds** (build your own, random workouts) from now on. Existing
  programs never reshuffle: the new exercises are `added: 6` and only catalogue 6 or later draws them (own programs
  keep the catalogue they were made with; random workouts store their day).

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-10` | done (PR #131) |
| 1 | Three floor-only exercises | feature | – | `feature/floor-pulls` | done (PR #132) |

### 1. Three floor-only exercises
- **Prone lat pulls** (lats, upper back | rear shoulders, lower back): face down, arms long overhead, pull the elbows
  down to the ribs, squeezing the shoulder blades; reps.
- **Superman rows** (upper back, lats | lower back, rear shoulders, glutes): face down, chest and arms lifted, row the
  elbows back and reach forward again; reps.
- **Side-lying lateral raises** (side shoulders | upper back): on your side, lift the top arm from the hip to straight up
  and lower slowly, a pause at the top; reps, each side.
- Each with drawings (the figure engine's poses), muscles, a cue, reps per level, `added: 6`, in their category (back,
  back, shoulders & arms). The catalogue goes to 6; the recipe book follows (its hash changes, its library days don't).
- **Test first:** in Bodyweight only over every library day, dumbbell, one-arm and kettlebell rows and lateral raises
  never keep "Needs gear" (curls, pull-ups and hangs still may); no existing pin in `tests/fixtures/program-days.json`
  changes; a build at catalogue 6 can draw the new exercises, one at 5 never does.
- **Done when:** the exercise pages draw them in both themes (390 px screenshots), the programs' data is unchanged on
  `rm -rf data && node build.js` against main, and the size gate holds.

## Challenge round
- **Weakest assumption:** that a floor exercise is a fair stand-in for a loaded row. It works the same main muscles, so
  the swap rules accept it and stats stay honest (planned sets, ADR 2); the load is lighter, and travel mode already
  says what it swapped.
- **What I hadn't read:** whether `added: 6` needs anything beyond the pools (the recipe book's `catalogue`, build your
  own's default). The test that a catalogue 5 build never draws them covers it.
- **The lazier version:** two exercises (one row, one raise). A day with two rows would still keep one "Needs gear".

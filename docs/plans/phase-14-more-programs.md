# Phase 14: more programs

Decided 2 Oct 2026 (Noam), after Phase 13. Today 138 programs. All of these, the +50% **on top** of the rest:

| Part | New programs |
|---|---|
| Fill every 5-program subject to 6 (Yoga, Pilates, Boxing, Kickboxing, Flexibility, Balance & stability, HIIT, Plyometrics, Mobility & posture) | 9 |
| 7 new subjects × 5: Running prep, Court & field sports (Cardio & combat); Grip & forearms, Kettlebell complexes, Climber / pull strength (Strength); Gentle / low impact, Back care (Mind & body) | 35 |
| 30-day programs (3 levels of 10 days): 2 per family | 8 |
| Bodyweight programs with the floor-only pulls (catalogue 6) | 3 |
| Each family +50% (Strength 51 → +26, Cardio & combat 26 → +13, Mind & body 32 → +16, Mixed 30 → +15), spread over its existing subjects | 70 |
| **Total** | **~125 → ~263 programs** |

Rules that hold: every new program is pinned like the others; existing programs never change (new exercises get a
new catalogue number); each program gets a hand-written summary (Phase 4); the size gate holds (~0.07 KB gzipped per
program in the page; the offline download grows ~3.7 KB gzipped each).

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan (in the 2 Oct roadmap plan) | plan | – | `plan/roadmap-oct` | done (PR #133) |
| 1 | 30-day programs in the engine | feature | review IV 4 | `feature/thirty-days` | |
| 2 | Programs page for ~260 programs | feature | – | `feature/library-scale` | |
| 3 | Catalogue 8: exercises the new subjects need | feature | – | `feature/catalogue-8` | |
| 4 | Fill to 6 (+9) and the floor-pull programs (+3) | content | 3 | `content/fill-six` | |
| 5 | New subjects: Running prep, Court & field sports (+10) | content | 3 | `content/cardio-subjects` | |
| 6 | New subjects: Grip & forearms, Kettlebell complexes, Climber (+15) | content | 3 | `content/strength-subjects` | |
| 7 | New subjects: Gentle / low impact, Back care (+10) | content | 3 | `content/mind-subjects` | |
| 8 | 30-day programs (+8) | content | 1 | `content/thirty-day` | |
| 9 | Strength +26 | content | 3 | `content/strength-plus` | |
| 10 | Cardio & combat +13 | content | 3 | `content/cardio-plus` | |
| 11 | Mind & body +16 | content | 3 | `content/mind-plus` | |
| 12 | Mixed +15 | content | 3 | `content/mixed-plus` | |

### 1. 30-day programs in the engine
- A config may say `days: 30`: levels at 1–10 / 11–20 / 21–30, rounds and page text ("Day 4 of 30"), stats and the
  level-over-time strip follow; random workouts' level from a done day uses its program's length.
- **Test first:** a 30-day build has 30 days and levels 10/10/10; a 60-day build is byte-identical (pins).

### 2. Programs page for ~260 programs
- A subject shelf shows its first 6 and "Show all N"; the counter and filters as today.
- **Test first:** a shelf with 10 programs shows 6 and the button; favourites and Your programs are never cut.

### 3. Catalogue 8: exercises the new subjects need
- **Renumbered 2 Oct:** Reverse snow angels (Phase 13) took catalogue 7, and own programs and random workouts made
  after it build at 7, so these exercises are `added: 8` (an exercise added to a catalogue already in use would
  reshuffle the programs built at it).
- Drills, carries, grip and court moves (e.g. A-skips, farmer carries with the kettlebell, towel-free dead hang
  variations on the bar, lateral bounds, cat-friendly back-care moves), `added: 8`, with drawings and muscles. The list
  is settled at the start of the ticket from the new subjects' day types.
- **Test first:** every new exercise draws, has muscles and reps; catalogue ≤ 7 builds never draw them.

### 4–12. Programs
- Each ticket: configs (and day types) in the family's config file, hand-written summaries, pins added (never
  re-pinned), the program check (`rm -rf data && node build.js` on main and the branch: only new files), the size
  gate, a 390 px screenshot of one new program in both themes.
- **Test first:** each ticket's new programs build, fit their time ranges, and their pins are added.

## Challenge round
- **Weakest assumption:** that +50% per family is varied enough to be worth it. Each new program needs a different
  split, format or progression from its subject's others; the tickets check that no two programs in a subject share
  split + formats + levers.
- **What I hadn't read:** how long the build and the test suite take at ~263 programs (review IV ticket 5 first).
- **The lazier version:** tickets 1–8 (the named additions, ~55 programs) and the +50% later.

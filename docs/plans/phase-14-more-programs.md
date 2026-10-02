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
| 1 | 30-day programs in the engine | feature | review IV 4 | `feature/thirty-days` | done (PR #149) |
| 2 | Programs page for ~260 programs | feature | – | `feature/library-scale` | done (PR #150) |
| 3 | Catalogue 8: exercises the new subjects need | feature | – | `feature/catalogue-8` | done (PR #151) |
| 4 | Fill to 6 (+9) and the floor-pull programs (+3) | content | 3 | `content/fill-six` | done (PR #152) |
| 5 | New subjects: Running prep, Court & field sports (+10) | content | 3 | `content/cardio-subjects` | done (PR #153) |
| 6 | New subjects: Grip & forearms, Kettlebell complexes, Climber (+15) | content | 3 | `content/strength-subjects` | done (PR #154) |
| 7 | New subjects: Gentle / low impact, Back care (+10) | content | 3 | `content/mind-subjects` | done (PR #155) |
| 8 | 30-day programs (+8) | content | 1 | `content/thirty-day` | |
| 9 | Strength +26 | content | 3 | `content/strength-plus` | |
| 10 | Cardio & combat +13 | content | 3 | `content/cardio-plus` | |
| 11 | Mind & body +16 | content | 3 | `content/mind-plus` | |
| 12 | Mixed +15 | content | 3 | `content/mixed-plus` | |

### 1. 30-day programs in the engine
- A config may say `days: 30`: levels at 1–10 / 11–20 / 21–30, rounds and page text ("Day 4 of 30"), stats and the
  level-over-time strip follow; random workouts' level from a done day uses its program's length.
- **Test first:** a 30-day build has 30 days and levels 10/10/10; a 60-day build is byte-identical (pins).
- **As built (2 Oct):** review IV ticket 4 had done most of it (`KBLength`). Added: `LENGTHS` [30, 60] and the
  builder refuses any other length; the program card has a "30 days" chip when a program isn't 60; the Stats level note
  gives each length's days when the library has both. Program and day pages, rounds and the progress bar already read
  the program's own days. Checked with a throwaway 30-day build of 20 Flat (not committed): levels 1–10 / 11–20 /
  21–30, "12 / 30 days", "Day 11 · Level II".

### 2. Programs page for ~260 programs
- A subject shelf shows its first 6 and "Show all N"; the counter and filters as today.
- **Test first:** a shelf with 10 programs shows 6 and the button; favourites and Your programs are never cut.
- **As built (2 Oct):** `libraryView(…, { opened, keep })`: each shelf `{ programs, total, more }`. A program you
  started (or the current one) stays on its shelf in its place, so it's never hidden behind "Show all"; a picked subject
  shows all. "Show all N <subject> programs" / "Show fewer" under the shelf (page state, not saved). Today only
  Signature (15) is longer than 6.

### 3. Catalogue 8: exercises the new subjects need
- **Renumbered 2 Oct:** Reverse snow angels (Phase 13) took catalogue 7, and own programs and random workouts made
  after it build at 7, so these exercises are `added: 8` (an exercise added to a catalogue already in use would
  reshuffle the programs built at it).
- Drills, carries, grip and court moves (e.g. A-skips, farmer carries with the kettlebell, towel-free dead hang
  variations on the bar, lateral bounds, cat-friendly back-care moves), `added: 8`, with drawings and muscles. The list
  is settled at the start of the ticket from the new subjects' day types.
- **Test first:** every new exercise draws, has muscles and reps; catalogue ≤ 7 builds never draw them.
- **As built (2 Oct): 29 exercises.** Running prep: A-skips, wall drives, running arm drives. Court & field: carioca,
  shuttle touches, split-step hops, backpedals. Grip: farmer carry, wrist curls, reverse wrist curls, reverse curls,
  bottoms-up hold. Kettlebell complexes: cleans, push press, one-arm swings, figure eights, around-the-body passes.
  Climber: wide-grip pull-ups, lock-off holds, archer pull-ups. Gentle: wall push-ups, sit-to-stands, standing march,
  step touches. Back care: pelvic tilts, prone press-ups (mobility, so they never land in an abs finisher), clamshells,
  McGill curl-ups, side plank from the knees.
- **Catalogue 8 is now frozen.** From this merge, own programs and random workouts build at 8, so no later ticket may
  add to an existing pool at 8 or add `added: 8` exercises: tickets 4–12 put the new exercises in **new pool names**
  (old configs never name them), and anything else new goes to catalogue 9.

### 4–12. Programs
- Each ticket: configs (and day types) in the family's config file, hand-written summaries, pins added (never
  re-pinned), the program check (`rm -rf data && node build.js` on main and the branch: only new files), the size
  gate, a 390 px screenshot of one new program in both themes.
- **Test first:** each ticket's new programs build, fit their time ranges, and their pins are added.
- **Ticket 4 as built (2 Oct):** Power Vinyasa (Yoga), Pilates Sculpt, Boxing Strength (bouts + straight sets), Kick &
  Core (bouts + core circuit), Daily Stretch 15 (Flexibility), Mobility Flow, Balance EMOM, Bell Intervals (HIIT with
  one kettlebell), Plyo Circuits; and Floor Pull, Back at Home, Quiet Upper (Bodyweight, the five floor pulls). All
  `catalogue: 8`, `added: 14`. A new test checks no two programs in a subject share split + formats + levers. Size
  checks raised for the rest of Phase 14: the page 110 → 125 KB gzipped (113.1 now; CLAUDE.md's gate stays 150), the
  recipe book 140 → 300 KB raw, 20 → 40 KB gzipped (it loads only for Build your own).
- **Ticket 5 as built (2 Oct):** Running prep: Run Ready, Stride Strength, Springy Legs, Track Intervals, Runner's Core
  & Hips. Court & field sports: Court Agility, Change of Direction, First Step, Field Strength (the one with weights),
  Game Day Conditioning. New pools `runDrill runLegs runPlyo runFast courtMove courtPower courtLegs` (new names, so
  nothing built before changes); both subjects join Cardio & combat in FAMILIES.
- **Ticket 6 as built (2 Oct):** Grip & forearms: Grip Strength, Carry Day, Forearm Pump, Hang Time, Grip & Lift.
  Kettlebell complexes (kettlebell only): Complex Builder, Complex EMOM, Bell Ladders, Bell AMRAP, Complex & Carry.
  Climber / pull strength: Climb Strength, Pull Ladders, Hang & Hold, Archer Project, Wall Ready. New pools `gripHold
  gripCurl gripPull kbCx kbCxLower kbCxUpper kbCxCore climbPull climbHold climbBack`. A random-workout test now picks
  a plain strength workout itself (the seed it relied on lands on a new day type).
- **Ticket 7 as built (2 Oct):** Gentle / low impact: Gentle Start, Chair & Wall, Low-Impact Cardio, Move Daily, Strong
  & Steady. Back care: Back Basics (the big three), Back Flow, Strong Back, Desk Back, Back & Hips. No abs finisher;
  the back programs say to stop if anything sharpens pain. New pools `gentleStrength gentleCardio gentleBalance
  backMove backStrength`. Warm-ups: Running prep and Court & field get the dynamic one, Gentle and Back care the gentle
  one (what the day page shows; stored days and pins don't change). The library phone spec reads each family's
  subjects from FAMILIES instead of listing them.

## Challenge round
- **Weakest assumption:** that +50% per family is varied enough to be worth it. Each new program needs a different
  split, format or progression from its subject's others; the tickets check that no two programs in a subject share
  split + formats + levers.
- **What I hadn't read:** how long the build and the test suite take at ~263 programs (review IV ticket 5 first).
- **The lazier version:** tickets 1–8 (the named additions, ~55 programs) and the +50% later.

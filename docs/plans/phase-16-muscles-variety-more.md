# Phase 16: muscle focus, Variety, the after-dark shelf, and +50% more

Decided 4 Oct 2026 (Noam), after Phase 15. Today 263 programs (Strength 97, Cardio & combat 55, Mind & body 64,
Mixed 47). Grilled the same morning:

- **Muscle focus: 7 new subjects** in the Strength family: **Chest, Back, Shoulders, Arms, Hips & adductors, Calves &
  lower legs, Neck & traps** (Legs & glutes, Core & abs and Grip & forearms already exist). Each trains the muscle
  **and its helpers** (Chest: chest + triceps + front shoulders; Back: lats, upper back + biceps + rear shoulders;
  Shoulders: all three heads + traps + rotator cuff; Arms: biceps, triceps + forearms; Hips & adductors: inner thighs,
  hip flexors + glutes; Calves & lower legs: calves, shins + feet and ankles; Neck & traps: neck, traps + upper back).
  **8 programs each (+56).** Layout: **a mix**: half are "2 focus days : 1 other" (like Lower Focus), half put the
  muscle in **every day** with a different helper as the second block each day.
- **Variety (no day repeats): a new subject, 15 programs**, in Mixed. In a Variety program **no two of the 60 (or 30)
  days share a day type and format**: there is no cycle. Themes across the 15: strength only, cardio & combat only,
  mind & body only, all families, short (15–20 min), no equipment, kettlebell only, and more.
- **After-dark (Noam's sexy programs): 3 subjects × 10 (+30)**, in Mixed: **looks** (beach body: chest, shoulders,
  arms, abs, glutes), **stamina** (hips, glutes, core and conditioning for endurance) and **positions** (hip,
  adductor, hamstring and back mobility with the strength to hold them; pelvic-floor holds). **Names are Noam's call
  and may be fully explicit** (4 Oct). **The repo stays public and the shelf is a normal shelf** (Noam, 4 Oct: the
  app is for his own use).
- **Each family +50%** on top of the above (Strength +49, Cardio & combat +28, Mind & body +32, Mixed +24 = +133),
  spread over each family's existing subjects, as in Phase 14.
- **Total: 263 → about 497 programs.**

Rules that hold: every new program is pinned; no existing pin changes; existing programs never reshuffle (new
exercises are catalogue 9, new pools get new names); each program gets a hand-written summary; 30- and 60-day
lengths only.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-16` | done (PR #168) |
| 1 | The program list out of the first download | feature | – | `feature/library-index` | done (PR #169) |
| 2 | Catalogue 9: exercises for the new muscle subjects and after-dark | feature | – | `feature/catalogue-9` | – |
| 3 | Variety programs in the engine (no repeated day) | feature | – | `feature/variety` | – |
| 4 | Muscle focus: Chest, Back, Shoulders, Arms (+32) | content | 1, 2 | `content/muscles-upper` | – |
| 5 | Muscle focus: Hips & adductors, Calves & lower legs, Neck & traps (+24) | content | 1, 2 | `content/muscles-other` | – |
| 6 | Variety (+15) | content | 1, 3 | `content/variety` | – |
| 7 | After-dark (+30) | content | 1, 2 | `content/after-dark` | – |
| 8 | Strength +49 | content | 1, 2 | `content/strength-plus-2` | – |
| 9 | Cardio & combat +28 | content | 1 | `content/cardio-plus-2` | – |
| 10 | Mind & body +32 | content | 1 | `content/mind-plus-2` | – |
| 11 | Mixed +24 | content | 1 | `content/mixed-plus-2` | – |

### 1. The program list out of the first download
The page is 123.8 KB gzipped against the 125 KB first-download gate (ticket 7b), and ~234 programs add about 15 KB.
- Program cards' facts (name, subject, minutes, blurb, chips) move from the page into `data/library.json`, fetched at
  start and cached by the service worker like the program days; the Programs page draws once it arrives (from cache
  at once when offline). Ids and order stay in the page only if needed for the first draw.
- **Test first:** the first download is under 110 KB gzipped; the Programs page, Favourites, the finder and Stats
  show every program from `library.json`, offline too; a test library of 500 programs keeps the gate.
- **Done when:** both gates pass with room for ~250 more programs; no page draws empty for longer than the cache read.
- **As built (4 Oct):** the list is `data/library.json`; the page carries `KB_LIBRARY = { url, ids }`: the address is
  versioned by the list's content (`?v=<hash>`), so the service worker serves it from the cache at once and a new
  build is a new address; the **ids stay in the page** because the progress store reads and syncs progress by
  program id from its first line (without them a cold open lost your progress, and sync could have dropped waiting
  changes). Boot waits for the list (`booted`; rerender and hashchange do nothing before), then draws. Offline with
  no list cached: "No programs yet" and Try again. **123.8 → 107.6 KB gzipped**; each new program now adds only its
  id to the page (~7 bytes gzipped).

### 2. Catalogue 9
- New exercises with drawings, muscles, cues and reps, `added: 9`, in **new pools** only. Settled at the start of the
  ticket from the subjects' day types; a first list: dumbbell fly, close-grip floor press, incline and decline
  push-ups, pseudo-planche push-ups, wide push-ups; concentration curls, Zottman curls, chin-up negatives on the bar,
  tate press; calf raises (both legs, weighted, bent-knee), tibialis raises, toe walks; shrugs (dumbbell and
  kettlebell), upright rows, neck isometrics (front, back, side, hand-resisted), prone neck lifts; side-lying
  adduction, sumo pulses, adductor rock-backs, frog bridge; pelvic-floor holds, hip thrust holds.
- **Test first:** every new exercise draws, has muscles and reps; builds at catalogue ≤ 8 never draw them.
- From this merge catalogue 9 is frozen like 8 (own programs and random workouts build at 9).

### 3. Variety programs in the engine
- A config may say `variety: true` with a set of day types and allowed formats instead of a `cycle`. The builder
  deals the days from a seeded deck so no two days share (day type, format); levels by day number as usual. The day
  page and the program page say "Every day is different" instead of the split.
- **Test first:** a variety build of 60 days has 60 different (day type, format) pairs; same id, same days (pins);
  a non-variety build is byte-identical; the config check refuses a variety config with fewer than `days` pairs.

### 4–11. Programs
- Each ticket: configs in the family's file, hand-written summaries, pins added (never re-pinned), the program check
  (`rm -rf data && node build.js` on main and the branch: only new files), the size gates, a 390 px screenshot of one
  new program in both themes, and no two programs in a subject share split + formats + levers.
- Muscle tickets: each subject 4 "2:1" and 4 "every day" programs; at least two 30-day programs per ticket; mixed
  equipment (some no-gear, some kettlebell only).
- **Test first:** each ticket's programs build, fit their time ranges, and their pins are added; muscle-focus programs
  give their subject's muscle the largest share in `data/muscles.json`.

## Challenge round
- **Weakest assumption: one look-alike muscle program per subject.** Eight programs on one muscle group risk
  feeling the same; the split + formats + levers test and the 2:1 / every-day mix are there to stop it.
- **What I hadn't read:** how much of the page the program list really is; ticket 1 measures before moving anything.
- **The lazier version:** raise the 125 KB gate to 150 instead of ticket 1. Rejected: the first open on a phone is
  what the gate protects, and the library will keep growing.
- **Neck work** is kept to isometrics and light shrugs/raises (no bridges with load): safe at home without a coach.

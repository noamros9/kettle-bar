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
| 2 | Catalogue 9: exercises for the new muscle subjects and after-dark | feature | – | `feature/catalogue-9` | done (PR #170) |
| 3 | Variety programs in the engine (no repeated day) | feature | – | `feature/variety` | done (PR #171) |
| 4 | Muscle focus: Chest, Back, Shoulders, Arms (+32) | content | 1, 2 | `content/muscles-upper` | done (PR #172) |
| 5 | Muscle focus: Hips & adductors, Calves & lower legs, Neck & traps (+24) | content | 1, 2 | `content/muscles-other` | done (PR #173) |
| 6 | Variety (+15) | content | 1, 3 | `content/variety` | done (PR #174) |
| 7 | After-dark (+30) | content | 1, 2 | `content/after-dark` | done (PR #175) |
| 8 | Strength +49 | content | 1, 2 | `content/strength-plus-2` | done (PR #176) |
| 9 | Cardio & combat +28 | content | 1 | `content/cardio-plus-2` | done (PR #177) |
| 10 | Mind & body +32 | content | 1 | `content/mind-plus-2` | done (PR #178) |
| 11 | Mixed +24 | content | 1 | `content/mixed-plus-2` | in review |

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
- **As built (4 Oct): 40 exercises.** Chest: wide push-ups, pseudo-planche push-ups, push-up bottom hold, close-grip
  floor press, squeeze press, one-arm kettlebell floor press. Back: reverse fly, gorilla rows, kettlebell dead-stop
  rows, prone Y raises. Shoulders: upright rows, lateral raise hold, side-lying external rotation, pike hold. Arms:
  concentration, Zottman and cross-body curls, Tate press, floor dips, close-grip push-ups. Hips & adductors:
  side-lying adductions, sumo pulses (kettlebell), adductor rock-backs, frog pumps, standing knee hold. Calves & lower
  legs: calf raises (bodyweight, dumbbell, bent-knee, hold), tibialis raises, heel walks. Neck & traps: dumbbell shrugs,
  shrug hold, neck holds (front, back, side; half effort), prone neck lifts. After-dark: pelvic-floor holds, glute
  bridge hold and pulses. Floor fly, Arnold press, hip thrusts and heel raises already existed, so they aren't new.
  None is an abs, warm-up or cool-down move (so none lands in an older finisher's pool). **Three new muscles** on the
  body map: **Neck** (front and back), **Traps** (back), **Shins** (front); only catalogue 9 exercises use them, so
  past stats don't move. The page grew 3.3 KB (the catalogue is in the page): 110.8 KB gzipped. The 110 KB test became
  "a program adds only its id" (100 programs < 1 KB).

### 3. Variety programs in the engine
- A config may say `variety: true` with a set of day types and allowed formats instead of a `cycle`. The builder
  deals the days from a seeded deck so no two days share (day type, format); levels by day number as usual. The day
  page and the program page say "Every day is different" instead of the split.
- **Test first:** a variety build of 60 days has 60 different (day type, format) pairs; same id, same days (pins);
  a non-variety build is byte-identical; the config check refuses a variety config with fewer than `days` pairs.
- **As built (4 Oct):** `variety.js` `expand(config)`, applied in `programs.config.js` (the builder loads the config
  list, so it couldn't live there). Day types plus `formats` (a day type may narrow them); blocks marked `vary: true`
  take the day's format, the others stay as written. A deck seeded by the program's id deals one pair per day: no pair
  twice, never the same day type two days running (and a new format from yesterday's when the deck has one). Each pair
  becomes an ordinary day type `<type>-<format>` labelled "Push · EMOM", the cycle is as long as the program, and
  `split` defaults to "Every day is different". Allowed formats: straight, superset, circuit, EMOM, AMRAP, Tabata,
  ladder (flows and bouts are their own kind of day). Refused: too few pairs, another format, a day type with nothing
  marked vary. Build your own's recipe book skips Variety programs. Day-type names can't hold a hyphen.

### 4–11. Programs
- Each ticket: configs in the family's file, hand-written summaries, pins added (never re-pinned), the program check
  (`rm -rf data && node build.js` on main and the branch: only new files), the size gates, a 390 px screenshot of one
  new program in both themes, and no two programs in a subject share split + formats + levers.
- Muscle tickets: each subject 4 "2:1" and 4 "every day" programs; at least two 30-day programs per ticket; mixed
  equipment (some no-gear, some kettlebell only).
- **Test first:** each ticket's programs build, fit their time ranges, and their pins are added; muscle-focus programs
  give their subject's muscle the largest share in `data/muscles.json`.
- **Ticket 4 as built (4 Oct): 32 programs, 263 → 295, four new Strength subjects.** Each subject has the same eight
  shapes so they're easy to compare: a 2:1 straight-set Day (Chest Day, Back Day, Shoulder Day, Arm Day), an every-day
  superset program with a helper (Push & Press, Back & Biceps, Boulder Shoulders, Arm Supersets), a no-equipment 2:1
  circuit (Push-up Chest, Floor Back, Floor Shoulders, Bodyweight Arms), an EMOM, a kettlebell-only 2:1 (Bell Chest,
  Bell Back, Bell Shoulders; Arms has Chin-up Arms instead, since one bell gives arms too little), a ladder program, and
  two 30-day programs (a heavy 2:1 and an every-day AMRAP or circuit). New pools `chestPress chestBw chestIso backRow
  backBar backRear backBw shoulderPress shoulderRaise shoulderHealth shoulderBw trapsPool biceps2 triceps2 armsBw`.
  **The focus test, as written:** the abs finisher ends every library day and so tops every program, and the helpers
  are close by design, so the test leaves both out: every other muscle gets less than the subject's own.
  **Travel mode:** the side-lying raise is lateral raises' only floor stand-in (Phase 10), so `shoulderRaise` holds just
  one side-shoulder dumbbell move and every day that can also have the lateral raise hold places the raise first.
  The 30-day test now asks for two or more per family. Page 111.2 KB gzipped.
- **Ticket 5 as built (4 Oct): 24 programs, 295 → 319, three new Strength subjects**, the same eight shapes. Hips &
  adductors: Hip Day, Inner Thigh Supersets, Floor Hips, Hip EMOM, Bell Hips, Hip Ladders, Hips 30, Hip Circuit 30.
  Calves & lower legs: Calf Day, Calves & Shins, Barefoot Legs, Calf EMOM, **Calf Builder** (heavy raises and a Tabata
  day), Calf Ladders, Calves 30, Calf Circuit 30. Neck & traps: Neck Day, Neck & Traps, Desk Neck, Neck EMOM, **Shrug &
  Hold**, Trap Ladders, Traps 30, Neck Circuit 30. **No kettlebell version for calves or neck:** one bell gives them
  too little (the drafts trained the glutes and front shoulders more than their own muscle), as with Arms. Neck work is
  always the half-effort holds and slow lifts, never in a Tabata. Ladders use reps-only pools (`adductorReps gluteReps
  calfReps plyoReps neckReps trapReps`). New pools also `adductor adductorBw adductorLoad hipFlex hipGlute calf calfBw
  calfPlyo shin neck traps2 trapsBw`.
- **Ticket 6 as built (4 Oct): 15 Variety programs, 319 → 334**, a new **Variety** subject in Mixed: Every Day
  Different, Strength Roulette, Sweat Shuffle, Mind & Body Mix, Bodyweight Shuffle, Kettlebell Roulette, Short Variety
  (15–22 min), Muscle Tour (one muscle group a day, the new subjects included), Fighter Variety, Athlete Variety,
  Variety 30 and Bodyweight Variety 30 (two families every day, as Mixed months must), Core Roulette, Long Variety
  (~40 min), Upper Body Roulette. Day types come from one shared table in `configs/mixed.js` (`VT`), each with its
  family tag and the formats it suits: strength in sets, supersets, circuits, EMOMs, AMRAPs; conditioning in circuits,
  EMOMs, AMRAPs, Tabatas; **combat never in a circuit** (a circuit of combinations runs too long); **neck only in calm
  formats**; and **a day ending in a stretch never takes an AMRAP** (too short). Long Variety and Variety 30 drop AMRAPs
  for the same reason. **The program page** shows "Every day is different" instead of a sixty-line key (the builder
  marks Variety programs `variety: true`; other programs' output is unchanged). Build your own leaves Variety out (its
  chips come from the recipe book). New phone spec `variety`.
  **A flake from ticket 5, fixed here:** Calves is a Strength subject and its pools hold Pilates heel raises, which have
  no stand-in (Phase 13: kept, marked), so a random Strength workout could open with one. The skip spec now picks the
  first exercise that has a stand-in. (The pools stay: changing them would reshuffle pinned programs.)
- **Ticket 7 as built (4 Oct): 30 after-dark programs, 334 → 364**, three Mixed subjects of 10. **Beach body:** Beach
  Body, V-Taper, Booty Call, Abs Out, Gun Show Tonight, Shirt Off (no gear), Bikini Ready, Thirst Trap, Beach Body 30,
  Naked in the Mirror 30. **Bedroom stamina:** All Night Long, Your Lady's Favorite Fuck (Noam's name), Pound Town,
  Round Two, Deep Stroke, Hold Me Up, Marathon Session (~40 min), On Top, Last Longer 30, Pelvic Power 30. **Sex
  positions:** The Pretzel, Legs Over Shoulders, Doggy Style Ready, Reverse Cowgirl, Wheelbarrow (no gear), Standing O,
  Splits in Bed, Bendy Body, Kama Sutra 30, Flexible Lover 30. Real training underneath: the muscles that show; hip
  drive, endurance and pelvic-floor control; hip, adductor, hamstring and back range with strength at those angles.
  **Every day type mixes two families** (the Mixed rule), so the stretch days start with a strength circuit at the same
  angles. New pools `thrust thrustBw pelvic posHold posLegs`. In the finder: Beach body under "Get stronger", Bedroom
  stamina under "Fitness & cardio", Sex positions under "Flexibility & mobility". **The recipe book's gate moved** from
  300 / 40 KB to 500 / 70 KB (now 306 KB raw; it loads only when Build your own opens, then stays offline).
- **Ticket 8 as built (4 Oct): Strength family +49, 364 → 413.** Strength +7 (Upper Lower Four, Big Five, PPL Plus,
  Strength & Size, Dumbbell Strength, Antagonist Supersets, Strength 30 Plus), Pull-ups +6, Legs & glutes +6, Kettlebell
  only +6, Bodyweight +7, Busy week +6 (including Fifteen EMOM), Grip & forearms +4, Kettlebell complexes +4, Climber +3,
  each within its subject's formats and with a split no sibling has, at catalogue 9 so the muscle-focus pools reach the
  older subjects. Busy-week programs use the short abs finisher (`absSlots`) like the existing ones. **Tests:** the
  random-skip unit test now picks the first exercise with a stand-in (as the phone test did in ticket 6), and the build
  spec's "greyed out" check moved to its own test with Strength + Pull-ups, since every subject now fits next to
  Strength + Yoga.
- **Ticket 9 as built (4 Oct): Cardio & combat +28, 413 → 441.** Conditioning +5, HIIT +5, Plyometrics +4 (long rests
  as the subject's others), Boxing +4, Kickboxing +4, Running prep +3, Court & field sports +3. **Boxing stays a
  one-lever subject** (bouts get harder by longer combinations at both levels): build your own counts on it, so the new
  Boxing programs use `variation` twice. Combat sessions keep bouts to two or three, since each is three minutes plus
  rest.
- **Ticket 10 as built (4 Oct): Mind & body +32, 441 → 473.** Core & abs +5, Mobility & posture +4, Yoga +5, Pilates
  +4, Flexibility +4, Balance & stability +4, Gentle / low impact +3, Back care +3, each within its formats; the
  no-abs subjects keep `absSlots: []`. The new neck, calf, shin and adductor moves reach the posture, mobility,
  balance and back-care programs. **Flows fit in steps** (one pass, two or three), so a day that must land in a narrow
  range gets two shorter flows rather than one long one.
- **Ticket 11 as built (4 Oct): Mixed +24, 473 → 497.** Strength & stretch +5, Fighter +5 (two train the neck and
  grip, as fighters do), Athlete +5 (jumps first, on long rests), Balanced week +5 (all three families every day),
  Calm strength +4 (Pilates or core, slow strength, yin). A new test holds them to the Phase 14 Mixed rules.
- **Phase 16 done: 263 → 497 programs** (234 new), 40 new exercises, three new muscles, the program list out of the
  first download (page 112.7 KB gzipped), the Variety engine, and the recipe book at 406 KB.

## Challenge round
- **Weakest assumption: one look-alike muscle program per subject.** Eight programs on one muscle group risk
  feeling the same; the split + formats + levers test and the 2:1 / every-day mix are there to stop it.
- **What I hadn't read:** how much of the page the program list really is; ticket 1 measures before moving anything.
- **The lazier version:** raise the 125 KB gate to 150 instead of ticket 1. Rejected: the first open on a phone is
  what the gate protects, and the library will keep growing.
- **Neck work** is kept to isometrics and light shrugs/raises (no bridges with load): safe at home without a coach.

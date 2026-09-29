# Phase 5: a bigger catalogue and library

Source of truth for roadmap Phase 5 (items 13–15, [#33](https://github.com/noamros9/kettle-bar/issues/33)).
Decisions from the roadmap grilling (28 Sep 2026) are in [ROADMAP.md](../../ROADMAP.md). This plan's own grilling
(29 Sep 2026) added four more:
- **Boxing and kickboxing:** one combo per bout. The voice calls it when the bout starts, and you drill it
  for the whole 3 minutes.
- **Yoga and Pilates:** one Start runs the whole guided sequence. The voice names each pose and side, and the
  screen shows the pose's drawing.
- **Subjects:** "Mobility & core" becomes **Core & abs**. Flow State moves to the new **Mobility & posture**
  subject.
- **Programs page:** three **families** (Strength · Cardio & combat · Mind & body). The subject chips under
  them show only the chosen family's subjects.

Glossary: [CONTEXT.md](../../CONTEXT.md).

## Where it ends up

The library grows from 29 programs to 98, and from 9 subjects to 17. The catalogue grows by at least 120 new
exercises, each with poses, muscles, a cue and reps per level.

| Family | Subject | Programs now → after |
|---|---|---|
| Strength | Signature | 5 → 5 |
| Strength | Strength · Pull-ups · Legs & glutes · Kettlebell only · Bodyweight · Busy week | 3 → 6 each |
| Cardio & combat | Conditioning | 3 → 6 |
| Cardio & combat | HIIT · Plyometrics · Boxing · Kickboxing | new, 5 each |
| Mind & body | Core & abs (was Mobility & core) | 2 → 6 (Flow State moves out) |
| Mind & body | Mobility & posture | 1 (Flow State) → 5 |
| Mind & body | Yoga · Pilates · Flexibility · Balance & stability | new, 5 each |

## Tickets

Tracer bullets: each ticket adds one subject end to end (its exercises with drawings → pools → configs →
programs on the page → tests), and ships working on its own. The two new formats come first, each with the
subject that needs it. One ticket = one branch = one PR, each starting from its **Test first**.

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-5` | done (PR #48) |
| 1 | Families, Core & abs rename, existing programs pinned | feature | 0 | `feature/library-families` | done (PR #49) |
| 2 | Guided flow format + Yoga | feature | 1 | `feature/yoga` | done (PR #50) |
| 3 | Pilates | feature | 2 | `feature/pilates` | done (PR #51) |
| 4 | Bouts format + Boxing | feature | 1 | `feature/boxing` | done (PR #53) |
| 5 | Kickboxing | feature | 4 | `feature/kickboxing` | in review |
| 6 | Flexibility | feature | 2 | `feature/flexibility` | todo |
| 7 | Mobility & posture | feature | 2 | `feature/mobility-posture` | todo |
| 8 | Balance & stability | feature | 1 | `feature/balance` | todo |
| 9 | HIIT | feature | 1 | `feature/hiit` | todo |
| 10 | Plyometrics | feature | 1 | `feature/plyometrics` | todo |
| 11 | More strength: Strength, Pull-ups, Legs & glutes, Kettlebell only | feature | 1 | `feature/more-strength` | todo |
| 12 | More everyday: Core & abs, Conditioning, Bodyweight, Busy week | feature | 1 | `feature/more-everyday` | todo |

### What every subject ticket (2–12) includes
- **Exercises in `exercises.js`:** poses (2–3 positions, drawn in profile like today), muscles, a one-line
  cue, `r` for Levels I–III, `tp` or `u: 'sec'`, and `side`/`alt`/`load`/`equip` as they apply. Every new
  exercise carries `added: 5`; see ticket 1 for why.
- **Pools** in `program-builder.js`: named lists for the subject. `HARDER` pairs are added for the variation
  lever.
- **Configs** in `programs.config.js`: a split, day types with time ranges, levers, 20 day names, a blurb, and
  a hand-written `about` of 3–6 sentences (Phase 4 rule).
- **Test first:** a builder test for the subject. It passes these checks:
  - each new program builds 60 days, every day inside its time range;
  - every exercise it uses exists, has poses and muscles, and fits the program's equipment;
  - the abs rule holds (an abs block last, or none for Yoga, Pilates, Flexibility and Mobility & posture);
  - the existing programs are unchanged (the pin from ticket 1).
- **Done when:**
  - the subject's programs show under their family and chip;
  - day 1 of each new program opens and its Start (or first tick) runs (UI test);
  - every new exercise page draws its figure and animation (a render test over all new ids);
  - checked on the phone in both themes.

### 1. Families, Core & abs, existing programs pinned
- **Programs page:**
  - A family row above the subject chips: All · Strength · Cardio & combat · Mind & body.
  - The subject chips show only the chosen family's subjects, and shelves follow the same order.
  - `SUBJECT_ORDER` becomes a `FAMILIES` table in `app/views.js`. A subject missing from it is a test failure,
    not a silent drop.
- **Rename:** "Mobility & core" → "Core & abs", and Flow State → "Mobility & posture". Only the subject field
  changes. Days, ids and progress stay as they are.
- **Pin the existing 29 programs:**
  - `tests/fixtures/program-days.json` holds a sha256 of each existing program's `days`, and a test compares
    against it. From here on, adding exercises can't reshuffle days people are halfway through.
  - The builder's computed pools (`mobility`, `abs`, `absW`, warm-ups, cool-downs) leave out exercises marked
    `added: 5` unless a config opts in (`catalogue: 5`).
- **Size gate:** the first download is measured the way a phone gets it, gzipped (Pages serves gzip). The
  limit becomes 150 KB gzipped (62 KB today). Raw size would pass 300 KB once 98 program summaries and the
  new exercises are inlined.
- Files: `app/views.js`, `app/styles.css`, `programs.config.js`, `program-builder.js`, `tests/builder.test.js`,
  `tests/fixtures/program-days.json`, `tests/build.test.js`, `tests-ui/library.spec.js`, `CONTEXT.md`.
- **Test first:**
  - the pin test: it passes on today's programs, and fails when a fake `added: 5` abs exercise leaks into the
    `abs` pool;
  - a UI test: tap Mind & body, and only its subjects' chips show; Flow State sits under Mobility & posture.
- **Done when:** the page shows three families on the phone in both themes, every existing UI test passes, and
  the pin test is in CI.

### 2. Guided flow format + Yoga (about 30 poses)
- **New format `flow`:** a sequence of timed poses. The block's `items` are poses with `n` seconds; `side`
  means each side in turn. A pose written in reps gets `n × tp` seconds.
  - **Builder:** the flow's time is the sum of its poses plus 5 s transitions. Poses are sized by level (`r`);
    the fit searches which optional poses to keep and `repeat` (1 or 2 passes through the flow).
  - **Workout Session:** a flow is one timed block, like a Tabata. `plan(block)` returns one phase per pose
    (and side) with `say: pose name` ("Warrior two, left side"), `halfway` on holds of 30 s or more, and
    `work: true`.
  - **Clock:** during a flow, the card shows the current pose's drawing.
  - **Stats:** each pose counts 1 set, no reps (holds add sets, not reps). **Summary:** "a 12-pose flow".
  - **Voice:** pose names become a third kind of voice cue, after holds and sides. The Settings text says so.
- **Programs without an abs finisher:** `absSlots: []` means no abs block. Yoga, Pilates, Flexibility and
  Mobility & posture use it.
- **Yoga, 5 programs, about 25–35 min:**
  - Sun & Strength: salutations and standing poses;
  - Yin & Deep Stretch: long holds;
  - Balance Flow: one-leg poses;
  - Core Yoga;
  - Morning 25: short.
  - Each day is 1–3 flows. Levels lengthen holds (reps lever) or move to harder poses (variation, e.g.
    chair → twisting chair).
- Files: `exercises.js`, `program-builder.js`, `programs.config.js`, `app/session.js`, `app/clock.js`,
  `app/views.js`, `app/stats.js`, `app/summary.js`, their tests, `tests-ui/flow.spec.js`.
- **Test first:** `session.plan` for a flow with one sided pose. The phases are in order, both sides are named,
  the halfway mark comes only on the long hold, and the block is done after the plan's `then`.

### 3. Pilates (about 18 exercises)
- The classical mat series, as reps inside a guided flow: the hundred, roll-up, single-leg circles, rolling
  like a ball, single- and double-leg stretch, scissors, criss-cross, spine stretch, saw, swan, side-kick
  series, teaser, swimming, leg pull front, seal.
- **5 programs, 25–35 min:** Mat Foundations, Classical Mat, Pilates Core & Glutes, Standing Pilates, Pilates
  Power. No abs finisher.
- **Test first:** the subject builder test, plus a flow with reps items (seconds = reps × tp).

### 4. Bouts format + Boxing (about 14 combos and drills)
- **New format `bouts`:** boxing rounds, named *bouts* in code and on screen. "Round" already means a pass
  through a circuit and a program round (Round 2 · Day 5). See the Challenge round.
  - Each item is one bout's combo, so the number of bouts = the number of items (optional items give the fit).
  - A bout is 3 min of work, with 1 min rest between bouts.
  - **Session:** one Start runs every bout. Each bout's phase has `say` set to the combo ("Bout 2: jab, cross,
    hook"), with a long beep at the end and "Rest" between bouts.
  - **Builder time:** bouts × 180 + (bouts − 1) × 60.
  - **Stats:** each bout counts 1 set of its combo. **Summary:** "4 bouts".
- **Exercises:**
  - combos drawn as 2–3 punch positions from the guard: jab, jab–cross, jab–cross–hook, double jab–cross,
    cross–hook–cross, uppercut combos, slip–counter, roll–hook, and so on;
  - plus shadowboxing footwork, a bob-and-weave drill, and a speed-bag drill.
- **5 programs, no equipment, abs to finish:** Fight Camp, Southpaw Switch, Speed & Footwork, Heavy Hands
  (bouts + a bodyweight conditioning circuit), Boxer's Engine. Levels move to longer combos (variation) and
  more bouts (the fit prefers more bouts at higher levels).
- **Test first:** `session.plan` for a 3-bout block: 3 work phases each saying its combo, 2 rests, and the block
  is done at the end.

### 5. Kickboxing (about 12 exercises)
- Front kick, roundhouse, side kick, back kick, switch kick, knee strikes, teep, and combos mixing punches
  and kicks, all as bouts.
- **5 programs:** Muay Thai Basics, Kick Combos, Clinch & Knees, Kickboxing Cardio, Full Contact (no contact).

### 6. Flexibility (about 14 stretches)
- Front split progression, pancake, pigeon, lizard, frog, standing forward fold, seated straddle, shoulder
  and chest openers, and the like.
- **5 programs, guided flows:** Front Splits 60, Pancake & Straddle, Hips Open, Upper-Body Flexibility,
  Full-Body Stretch. No abs finisher.

### 7. Mobility & posture (about 12 drills)
- CARs (hips, shoulders), wall slides, thoracic rotations, chin tucks, 90/90 switches, deep-squat hold, hip
  airplanes, band-free pull-aparts (prone Y-T-W), and so on.
- **4 new programs + Flow State:** Desk Reset, Better Posture, Joint Health, Squat & Hinge Mobility. Flows
  and circuits, no abs finisher.

### 8. Balance & stability (about 12 exercises)
- Single-leg stand progressions, tree to airplane, single-leg reach, star excursion, heel-to-toe walk, pistol
  box squat, single-leg hops and sticks, lateral bounds and holds, Copenhagen plank.
- **5 programs, abs to finish:** Steady, Single-Leg Strength, Ankle & Knee, Athletic Balance, Balance &
  Core.

### 9. HIIT (about 10 exercises)
- Skater jumps, tuck jumps, burpee variations (sprawl, burpee broad jump), plank jacks, speed step-ups, fast
  feet, lateral shuffle, sprint in place, seal jacks.
- **5 programs** built from the existing timed formats (Tabata, EMOM, AMRAP, circuit): HIIT 20, Tabata
  Torch, 30/30 Intervals, Pyramid HIIT, Afterburn.

### 10. Plyometrics (about 10 exercises)
- Broad jump, box-free depth drop, lateral bound, split-jump switch, pogo hops, single-leg hops, clap
  push-ups, power skips, star jumps, and so on.
- **5 programs:** Spring Loaded, Vertical, Plyo Legs, Upper Plyo, Explosive Full Body. Lower reps with longer
  rests (straight sets).

### 11. More strength (+12 programs, about 12 exercises)
- **Exercises:** new strength variety across dumbbell, kettlebell and bar. Examples: floor fly, Arnold press,
  hang knee raise, L-sit hang, kettlebell windmill, bottoms-up press, dumbbell step-up, Bulgarian split squat,
  hip thrust, Zercher squat, kettlebell row.
- **3 programs each** in Strength, Pull-ups, Legs & glutes and Kettlebell only.

### 12. More everyday (+13 programs, about 12 exercises)
- **Exercises:** core and bodyweight variety. Examples: dragon-flag negatives, body saw, reverse crunch,
  windshield wipers, jackknife, plank walk-outs, and bodyweight rows under a table.
- **Programs:** 4 in Core & abs, and 3 each in Conditioning, Bodyweight and Busy week.

### Last: ROADMAP and README
The PR that closes ticket 12 also marks Phase 5 done in ROADMAP.md. The README changes only if usage
changes: it does, because there are new subjects and a new page structure.

## Challenge round
- **Weakest assumption:** that adding exercises leaves existing programs alone. It doesn't, and I checked
  the builder:
  - the `mobility`, `abs` and `absW` pools and the warm-up and cool-down lists are computed from the whole
    catalogue (`ids(e => e.cat === …)`);
  - a new abs exercise would therefore reshuffle days 1–60 of every existing program, under the swaps and
    ticks already saved on Noam's phone.
  - **Plan change:** ticket 1 pins the existing programs' days with hashes. New exercises carry `added: 5`
    and stay out of the computed pools unless a config opts in.
- **What I hadn't read:**
  - the page-size gate in `tests/build.test.js` (under 300 KB raw). With 98 summaries (about 2 KB each)
    and the new exercises inlined, the page would reach about 440 KB raw. **Plan change:** ticket 1 moves
    the gate to gzipped size (150 KB), which is what the phone actually downloads (62 KB today).
  - The glossary: "Round" already means both a circuit pass and a program Round, and "Round 2 · Day 5"
    is on screen. **Plan change:** the boxing format is called **bouts** in code, in the glossary and on
    screen ("Bout 2 of 5"), not rounds. If Noam prefers "rounds" on screen, only the labels change.
- **The lazier version:**
  - Ship the 45 new-subject programs only, and leave the existing subjects at 3 each (tickets 11–12 dropped).
    Not proposed, because Noam picked "up to 6 each". They're last, so they can be cut without touching
    the rest.
  - Also not proposed: reusing existing formats for yoga (straight-set holds) and boxing (Tabata-like timed
    blocks). Noam picked a guided Start for yoga and a combo per bout, and neither fits those formats
    without extra flags that would leak into every other format.

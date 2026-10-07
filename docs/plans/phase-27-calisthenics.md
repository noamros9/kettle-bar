# Phase 27: calisthenics, a subject of skills

Issue [#199](https://github.com/noamros9/kettle-bar/issues/199). Grilled 7 Oct 2026 (Noam); decisions 158–159 in
[ROADMAP.md](../../ROADMAP.md). After Phase 26 (134).

## What lands
- **A new subject, Calisthenics** (158), in the Strength family and the Strength shelf group, next to Bodyweight.
  Calisthenics Base and Calisthenics Skills stay in Bodyweight.
- **72 skill exercises, `added: 14`** (159): twelve skills, six steps each, from the first progression to the skill
  (or its last step this home can hold), with poses and cues: muscle-up, handstand, handstand push-up, front lever,
  back lever, planche, L-sit to V-sit, pistol, one-arm push-up, dragon flag, archer / typewriter pull-up, one-arm pull-up (Noam, 7 Oct; the archer
  pull-up replaces the human flag, which needs a vertical pole, 165).
  Equipment: pull-up bar, floor, a wall; no rings or parallettes.
  A step that already exists (pike push-up, pseudo-planche push-up, pistol to a box, archer push-up) is reused, not
  copied: the skill gets a new step in its place.
- **25 programs, `catalogue: 14`**, built to the spread from the start (53, 159): about 12 at 35–38, 6–7 at 31–35, the
  rest shorter. Each program trains 2–4 skills by their steps, plus the strength that carries them (pulls, dips, core,
  hollow and arch work); levels climb by `variation` (the next step) more than by reps.
- **Catalogue 14 is held until the last exercise ticket** (the decision-121 pattern): own programs and random workouts
  stay at 13 while the skill exercises land, then move to 14 at once.

## Also settled (7 Oct, evening)
- **Open like any subject** (183): Build your own, random workouts and Swap; a step's alternative is its easier step.
- **"Front lever · step 3 of 6"** (188) on the day and exercise pages, with the next step named: ticket 1 adds the
  label (it reads `skill` and `step`), so every skill exercise has it as it lands.
- **5 of the 25 programs are 30 days** (185).

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/unplanned-phases` | done (PR #281) |
| 1 | Plumbing: the subject, skill pools, newest held at 13 | feature | – | `feature/calisthenics-plumbing` | todo |
| 2 | Muscle-up, handstand, handstand push-up, front lever (24) | content | 1 | `content/skills-a` | todo |
| 3 | Back lever, planche, L-sit to V-sit, pistol (24) | content | 2 | `content/skills-b` | todo |
| 4 | One-arm push-up, dragon flag, archer / typewriter pull-up, one-arm pull-up (24); catalogue 14 opens | content | 3 | `content/skills-c` | todo |
| 5 | Programs 1–13 | content | 4 | `content/calisthenics-programs-a` | todo |
| 6 | Programs 14–25 | content | 5 | `content/calisthenics-programs-b` | todo |
| 7 | Close the phase: CONTEXT.md, archive | plan | 6 | `plan/p27-close` | todo |

Tickets 2–4 all edit `exercises.js`, 5–6 `configs/strength.js`: one at a time.

### 1. Plumbing
- **Build:** `Calisthenics` in `FAMILIES` (Strength) and `SHELVES` (Strength), and an entry in `EX_FAMILIES` for
  the skill exercises; `recipe-book.js`'s newest catalogue held at 13 (`NEWEST`, as Phase 22 ticket 1 did); in
  `program-builder.js`, computed pools empty below 14: one per skill (`skillMuscleUp`, …) by a new `skill` field on the
  exercise, ordered by its `step` (1–6), so a level's `variation` lever takes the next step.
- **Files:** `app/library.js`, `recipe-book.js`, `program-builder.js`, `tests/catalogue14.test.js`,
  `tests/library.test.js`, `tests/builder.test.js`.
- **Test first:** the skill pools are empty below catalogue 14 and every catalogue-13 pool is unchanged; a made-up
  `skill` exercise lands in its pool in step order; `generate` still stores 13.
- **Done when:** no pin changes.

### 2–4. The skill exercises
- **Build:** six steps per skill: id, name, `cat` (the muscle group it trains most), `skill`, `step`, `added: 14`,
  reps or seconds per level, muscles, a cue, equipment (`bar` where it hangs), poses (two-figure drawings aren't needed;
  a wall is drawn as a line where a handstand uses one). Each skill's step 1 is doable by an intermediate (Level I
  starts at intermediate); step 6 is the skill or the hardest version safe at home. A Grok ticket plans first (132):
  one line per step (what changes from the step before, what he holds, where the bar or wall is). Ticket 4 sets
  `NEWEST` to 14.
- **Files:** `exercises.js`, `tests/catalogue14.test.js`, `tests/figures.test.js` (poses render).
- **Test first:** per skill, six steps 1–6, no two the same move (name and pose), each with poses; Swap offers a skill
  step only for its own skill.
- **Done when:** 390 px screenshots of each new exercise page (light and dark) reviewed for the pose; the PR's CI green.

### 5–6. The programs
- **Build:** 25 configs, subject Calisthenics, `added: 27`, `catalogue: 14`: splits such as push skills / pull skills,
  bar day / floor day, one skill per day, skill + strength, a short daily skill practice (EMOM holds), full-body
  skill circuits; formats mostly straight sets with long rests (`rests` like plyometrics: 60 s between sets, 90 s
  between exercises), EMOM for holds, ladders for muscle-up and handstand push-up practice. Minutes to the spread.
  Names, blurbs and about in today's style.
- **Files:** `configs/strength.js` (and its `order` list), `tests/fixtures/program-days.json`, `tests/programs.test.js`.
- **Test first:** 25 Calisthenics programs at catalogue 14; the spread holds; every program draws from at least two
  skill pools; Level III's days use a later step than Level I's for each skill it trains.
- **Done when:** `npm run times` shows every day in range; pins added, none changed.

## Challenge round
- **Weakest assumption: that 72 distinct, safe steps exist with only a bar, floor and wall.** Front lever, back lever
  and planche have well-known six-step ladders (tuck, advanced tuck, one leg, straddle, half lay, full), but a full
  planche or dragon flag is beyond most; step 6 may be the hardest *safe* step, not the skill. The hitting-the-wall
  rule (124) applies: a skill that can't make six real steps ships five, recorded here.
- **What I hadn't read:** how `levers: 'variation'` picks the harder exercise today (a `harder` field per exercise, or
  pool order). Ticket 1 reads it first; if it's a per-exercise field, the `step` order is written there instead of a
  new pool rule.
- **The lazier version:** Calisthenics programs from today's exercises only, no new steps. Not proposed: Noam chose
  72 new exercises (159), and without the steps there's nothing to progress through.
- **Archer pull-up and one-arm pull-up overlap:** both climb toward one arm on the bar. Ticket 4 keeps them apart:
  the archer ladder ends at the typewriter pull-up (both arms, side to side), the one-arm ladder starts from an
  assisted one-arm hang and negative; no step in both.

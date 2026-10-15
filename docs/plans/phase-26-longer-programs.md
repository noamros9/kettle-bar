# Phase 26: longer programs, half at 35–38 minutes

Issue [#198](https://github.com/noamros9/kettle-bar/issues/198). Grilled 4 and 7 Oct 2026 (Noam); decisions 53–56,
82 and 153–157 below. After Phase 33, day to day II (223; was after Phase 25, 134).

## Decisions
Grilled 4 and 7 Oct 2026 with Noam (global decision numbers). Why: on 4 Oct only ~1/6 of the programs ran 33 min or more.

**The target**
- **53 · Half at 35–38 min (his baseline), a quarter at 31–35, a quarter shorter.** **56 ·** The short quarter has no target. *(4 Oct)*
- **54 · Minutes are the workout only**; the ~3 min warm-up and cool-down come on top. *(4 Oct)*
- **155 · Counted per subject.** **156 ·** Movers spread over each shelf's splits and formats. *(7 Oct)*

**What moves and what doesn't**
- **153 · Started programs stay as they are** (any day done in any round). *(7 Oct)*
- **154 · Kept at their length:** Busy week, Quickie, Date night warm-up, every After dark subject; Three-Split 60
  (frozen). *(7 Oct)*
- **172 · Signature is re-timed like any shelf**; Phase 23's IIs keep their length. *(7 Oct)*
- **169 · No review of the list** before re-timing. **200 ·** The re-timed ones are listed only in the PR. *(7 Oct)*

**How a program gets longer**
- **55 · Add, don't rebuild**: keep the blocks and picks, add sets, rounds or slots of the same kind; a one-time
  exception to never re-pinning. *(4 Oct)*
- **82 · Added slots prefer catalogue 13** (then older). *(6 Oct)*
- **157 · A pass after the build**, its own random stream: sets or rounds first, then a slot at a block's end;
  existing picks never move; config `long: [lo, hi]`. *(technical)*
- **170 · Can't reach 35–38? It gets longer anyway**: at most one added exercise per block; it keeps what it gained
  and shows its real minutes. A shelf may end with fewer than half long. *(7 Oct, corrected the same day)*

**Minutes elsewhere in the app** (ticket 6b)
- **191 · Length filter: Up to 30 / 31–35 / 35+** (was Up to 25 / 26–32 / 33+).
- **192 · Random workouts: 15 / 25 / 38** (38 replaces 35); the rest-day flow keeps 15 (Phase 34 makes it 10 or 15, 262).
- **203 · Help me pick: About 15 / 20–30 / 31–35 / 35–38+.** **204 ·** Build your own keeps 20–40, no 38 (and 15 for one subject from Phase 34, 261).

## What lands
- **Per subject, about half at 35–38 min, a quarter at 31–35, a quarter shorter** (53, 155), counting the workout
  only (54), over every subject but Busy week, Quickie, Date night warm-up and the After dark ones (154). Phase 23's
  programs are already built to it (87), so they count toward each subject's half and don't move.
- **Which programs move** (156): spread over each subject's splits and formats, so every kind of program on a shelf
  has a long version; then, among equals, the one closest to its new band (the smaller change).
- **Not started ones only** (153): a program with any day done in any round, in Noam's progress when the phase
  starts, keeps its days. Three-Split 60 is frozen and keeps its days too. Signature is re-timed like any shelf
  (172); Phase 23's IIs keep their length (84).
- **Added, never reshuffled** (55, 157): a moved program is built exactly as before, then a lengthening pass adds
  sets or rounds first, then slots of the same pool at a block's end (catalogue 13 first, 82), until each day lands
  in its new range. Every existing pick stays where it was. Its pins change once, by this phase's exception (55).

Counted 7 Oct (by mid-range, the re-timed subjects only, before Phase 23): about 380 programs, 95 of them 35+ and 66
at 31–35. Roughly 180 move to 35–38 and 30 to 31–35; ticket 2 makes the real list.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/unplanned-phases` | done (PR #281) |
| 1 | The lengthening pass and the one-time re-pin | feature | – | `feature/lengthen-pass` | done (PR #436) |
| 2 | Who moves: the list per subject | feature | 1 | `feature/long-list` | done (PR #437) |
| 3 | Strength family, re-timed | content | 2 | `content/long-strength` | todo |
| 4 | Cardio & combat, re-timed | content | 3 | `content/long-cardio-combat` | todo |
| 5 | Mind & body, re-timed | content | 4 | `content/long-mind-body` | todo |
| 6 | Mixed and Variety, re-timed | content | 5 | `content/long-mixed` | todo |
| 6b | The length filter and random workouts at 38 | feature | 6 | `feature/length-filter-38` | todo |
| 7 | Close the phase: the spread checked, CONTEXT.md, archive | plan | 6b | `plan/p26-close` | todo |

Tickets 3–6 edit the same list (`configs/long.js`) and the pins file, so they go one at a time.

### 1. The lengthening pass and the one-time re-pin
- **Build:** `program-builder.js`: when a config has `long: [lo, hi]`, `build` builds the 60 days exactly as today,
  then `lengthen(day, recipe, [lo, hi], rnd2)` per day, with `rnd2 = makeRnd(id + ':long')`: (1) raise sets, rounds,
  passes or minutes within what the block's format allows (`formats.js`), one block at a time, main blocks before the
  abs; (2) if still short, add one slot at the end of a main block, drawn from that slot's pool (catalogue 13 first,
  then the pool as it was), not an exercise the day already has; repeat until the day's time is in `[lo, hi]` or
  nothing more fits (at most one added slot per block); a day that stops short keeps what it gained (170). The
  program's `minutes` become the range its days really build to (`long` where they all reach it). A pin's
  re-pin is allowed only for ids listed in `configs/long.js`, and only in the ticket that lists them:
  `scripts/pin-programs.js --long` re-pins exactly those, and the pins test compares every other pin as today.
- **Files:** `program-builder.js`, `formats.js` (what each format may grow), `configs/long.js` (empty map),
  `programs.config.js` (applies the map), `scripts/pin-programs.js`, `tests/builder.test.js`,
  `tests/programs.test.js`.
- **As built (PR #436):** `formats.js` didn't change: a block grows through its format's own `options.values` (abs
  by straight sets), and a slot that adds no time (EMOM, AMRAP, ladder, Tabata) is never added. The tests went into
  their own `tests/lengthen.test.js` (builder.test.js was full) and `tests/pins.test.js`; the re-pin is
  `npm run pin -- --long`.
- **Test first:** a made-up config at `[24, 29]` with `long: [35, 38]`: every original pick of every day is still
  there in the same block and order; every day lands in 35–38; a made-up config
  that can't reach it with one slot per block still ends longer than before, with `minutes` showing what it reached;
  formats grow only by their own rules; a program not in
  the map is byte-identical to its pin.
- **Done when:** 100% lines and functions on the new code; no pin changes in this ticket.

### 2. Who moves
- **Build:** `scripts/long-list.js`: per re-timed subject, the programs that are neither started nor frozen nor Phase
  23's; the target counts (half of the subject's total at 35–38, a quarter at 31–35, counting what's already there);
  the movers chosen over splits and formats first (156), then by the smallest change; each gets `[35, 38]` or
  `[31, 35]`. "Started" is read from a backup file passed on the command line (Noam's nightly backup; the file is
  never committed, only the list of started ids it produced goes into the PR description). The output is
  `configs/long.js`'s full map, split by family, applied by tickets 3–6.
- **Files:** `scripts/long-list.js`, `tests/long-list.test.js`, `package.json`.
- **Test first:** on a made-up library and backup: started and frozen ones never move; each subject ends at the
  spread; two programs of the same split and formats aren't both picked while another split has none.
- **Done when:** the list is in this plan's "The list" with counts per subject; it goes straight to ticket 3, no
  review (169).

### 3–6. Re-timed, by family
- **Build:** add the family's ids to `configs/long.js`; `npm run pin -- --long`; check every changed day with
  `npm run times`. A program the pass can't lengthen into its band still gets longer by what fits and stays on the
  list (170); the next candidate of the same split also moves, so the shelf gets as close to the spread as it can.
  Each short one is recorded in "The list" with the minutes it reached.
- **Files:** `configs/long.js`, `tests/fixtures/program-days.json`.
- **Test first:** `programs.test.js`'s Phase 26 block: the family's subjects meet the spread, or the shortfall is the
  programs recorded as short in "The list"; every listed program is longer than its pin was, and its days hold all
  their old picks (the pass's test, run over the real list).
- **Done when:** the spread holds for the family, short of it only by the recorded programs; only the listed pins changed (`git diff --stat` on the pins file);
  the PR's CI green.

### 6b. The length filter and random workouts at 38
- **Build:** `app/library.js`'s `LENGTHS` and `lengthOf` become Up to 30 / 31–35 / 35+ by mid-range (191); random
  workouts offer 15 / 25 / 38 (192) in `app/random.js`'s `MINUTES` and the sheet; the rest-day flow keeps 15; a stored
  random record with 35 still opens and counts. Help me pick's minutes become About 15 / 20–30 / 31–35 / 35–38+
  (203) in `app/finder.js`; Build your own keeps its minutes (204).
- **Files:** `app/library.js`, `app/random.js`, `app/pages/random.js`, `app/finder.js`, `tests/finder.test.js`, `tests/library.test.js`, `tests/random.test.js`,
  `tests-ui/random.spec.js`, `tests-ui/library.spec.js`.
- **Test first:** the three filter buckets by mid-range (30.5 short, 35 mid, 35.5 long); every subject that offered
  35 can make 38 at some gear (or the sheet says why not, as today); an old 35-minute record reads back.
- **Done when:** 390 px screenshots of the filter and the random sheet, light and dark.

## How the later decisions land in the tickets
- **The re-timed programs are listed only in the PR** (200): no note in the app.

## The list
Made 15 Oct 2026 by `npm run long-list` (ticket 2) from Noam's export of that day: the only started program is
`three-split-60`, which is frozen anyway. **291 move: 201 to 35–38, 90 to 31–35.** More than the 7 Oct guess (~210):
Phase 23 added programs since, and the 31–35 programs that move up to 35–38 leave room for shorter ones to move up to
31–35. Signature ends one short of half at 35–38: its other programs are Phase 23's, which keep their length (84).
Counts after the moves, by mid-range (Up to 30.5 / 31–35 / 35+):

| Subject | Programs | 35–38 | 31–35 | Shorter | Short of the spread |
|---|---|---|---|---|---|
| Signature | 30 | 14 | 16 | 0 | 1 long, 0 mid |
| Strength | 29 | 20 | 7 | 2 | – |
| Pull-ups | 24 | 12 | 10 | 2 | – |
| Conditioning | 21 | 11 | 5 | 5 | – |
| Core & abs | 23 | 12 | 6 | 5 | – |
| Mobility & posture | 18 | 9 | 5 | 4 | – |
| Kettlebell only | 26 | 13 | 7 | 6 | – |
| Bodyweight | 29 | 15 | 7 | 7 | – |
| Legs & glutes | 26 | 13 | 11 | 2 | – |
| Yoga | 28 | 14 | 7 | 7 | – |
| Pilates | 24 | 12 | 6 | 6 | – |
| Boxing | 20 | 10 | 5 | 5 | – |
| Kickboxing | 18 | 9 | 5 | 4 | – |
| Flexibility | 18 | 9 | 5 | 4 | – |
| Balance & stability | 18 | 9 | 5 | 4 | – |
| HIIT | 21 | 11 | 5 | 5 | – |
| Plyometrics | 18 | 9 | 5 | 4 | – |
| Strength & stretch | 21 | 11 | 5 | 5 | – |
| Fighter | 21 | 11 | 5 | 5 | – |
| Athlete | 21 | 15 | 5 | 1 | – |
| Balanced week | 23 | 12 | 6 | 5 | – |
| Calm strength | 21 | 11 | 5 | 5 | – |
| Running prep | 14 | 7 | 4 | 3 | – |
| Court & field sports | 14 | 7 | 4 | 3 | – |
| Grip & forearms | 14 | 7 | 4 | 3 | – |
| Kettlebell complexes | 14 | 7 | 4 | 3 | – |
| Climber / pull strength | 12 | 6 | 3 | 3 | – |
| Gentle / low impact | 15 | 8 | 4 | 3 | – |
| Back care | 14 | 7 | 4 | 3 | – |
| Chest | 12 | 6 | 3 | 3 | – |
| Back | 12 | 6 | 3 | 3 | – |
| Shoulders | 12 | 6 | 3 | 3 | – |
| Arms | 12 | 6 | 3 | 3 | – |
| Hips & adductors | 12 | 6 | 3 | 3 | – |
| Calves & lower legs | 12 | 6 | 3 | 3 | – |
| Neck & traps | 12 | 6 | 3 | 3 | – |
| Variety | 30 | 15 | 8 | 7 | – |
| Power yoga | 8 | 4 | 2 | 2 | – |
| Yin yoga | 8 | 4 | 2 | 2 | – |
| Yoga flow | 8 | 4 | 2 | 2 | – |
| Mat core | 8 | 4 | 2 | 2 | – |
| Kettlebell Pilates | 8 | 4 | 2 | 2 | – |
| Weekly mix | 8 | 4 | 2 | 2 | – |
| Surprise | 8 | 4 | 2 | 2 | – |

Tickets 3–6 copy their family's lines into `configs/long.js`; a program the pass can't take into its band is noted
here with the minutes it reached (170).

```js
  // strength
  'five-split-60': [35, 38],
  'four-split-60': [35, 38],
  'full-body-duo-60': [35, 38],
  'three-split-60-harder': [35, 38],
  'two-split-60': [35, 38],
  'five-split-60-harder': [35, 38],
  'four-split-60-harder': [35, 38],
  'full-body-duo-60-harder': [35, 38],
  'three-split-60-tempo': [35, 38],
  'two-split-60-harder': [35, 38],
  'five-split-60-tempo': [35, 38],
  'four-split-60-tempo': [35, 38],
  'full-body-duo-60-tempo': [35, 38],
  'two-split-60-tempo': [35, 38],
  'bar-and-bell': [35, 38],
  'bar-emom': [35, 38],
  'bar-flow': [35, 38],
  'bar-master': [35, 38],
  'chinup-biceps': [35, 38],
  'chinup-strength': [35, 38],
  'commando': [35, 38],
  'grip-and-hang': [35, 38],
  'bell-arms': [35, 38],
  'bell-circuit': [35, 38],
  'bell-complexes': [35, 38],
  'bell-emom-plus': [35, 38],
  'bell-full-emom': [35, 38],
  'bell-hips-core': [35, 38],
  'bell-muscle': [35, 38],
  'getup-strong': [35, 38],
  'kettlebell-flow': [31, 35],
  'kettlebell-strength': [31, 35],
  'one-bell': [31, 35],
  'slow-bell': [31, 35],
  'swing-century': [31, 35],
  'back-at-home': [35, 38],
  'bodyweight-30': [35, 38],
  'bodyweight-amrap': [35, 38],
  'bodyweight-circuit-plus': [35, 38],
  'bodyweight-muscle': [35, 38],
  'calisthenics-base': [35, 38],
  'calisthenics-skills': [35, 38],
  'floor-only': [35, 38],
  'floor-pull': [35, 38],
  'hotel-room': [35, 38],
  'kitchen-table': [31, 35],
  'no-gear-burn': [31, 35],
  'pistol-path': [31, 35],
  'pushup-and-squat': [31, 35],
  'athletic-legs': [35, 38],
  'glute-and-hamstring': [35, 38],
  'glute-builder': [35, 38],
  'glute-lab': [35, 38],
  'hamstring-strong': [35, 38],
  'kettlebell-legs': [35, 38],
  'leg-day-classic': [35, 38],
  'legs-all-over': [35, 38],
  'grip-and-lift': [35, 38],
  'carry-day': [35, 38],
  'grip-and-pull': [35, 38],
  'grip-strength': [35, 38],
  'forearm-pump': [31, 35],
  'grip-30': [31, 35],
  'forearm-circuit': [31, 35],
  'complex-and-carry': [35, 38],
  'bell-ladders': [35, 38],
  'complex-builder': [35, 38],
  'complex-hips': [35, 38],
  'complex-straight': [31, 35],
  'bell-amrap': [31, 35],
  'complex-30': [31, 35],
  'archer-project': [35, 38],
  'climb-strength': [35, 38],
  'climber-antagonist': [35, 38],
  'climber-30': [35, 38],
  'pull-ladder-climb': [31, 35],
  'wall-ready': [31, 35],
  'chest-30': [35, 38],
  'chest-day': [35, 38],
  'push-and-press': [35, 38],
  'bell-chest': [35, 38],
  'chest-ladders': [31, 35],
  'pushup-chest': [31, 35],
  'back-30': [35, 38],
  'back-day': [35, 38],
  'back-and-biceps': [35, 38],
  'back-circuit-30': [35, 38],
  'back-ladders': [31, 35],
  'bell-back': [31, 35],
  'shoulder-day': [35, 38],
  'shoulders-30': [35, 38],
  'boulder-shoulders': [35, 38],
  'bell-shoulders': [35, 38],
  'floor-shoulders': [31, 35],
  'shoulder-circuit-30': [31, 35],
  'arm-day': [35, 38],
  'arms-30': [35, 38],
  'arm-supersets': [35, 38],
  'chinup-arms': [35, 38],
  'arm-circuit-30': [31, 35],
  'arm-ladders': [31, 35],
  'hip-day': [35, 38],
  'hips-30': [35, 38],
  'bell-hips': [35, 38],
  'floor-hips': [35, 38],
  'hip-circuit-30': [31, 35],
  'hip-ladders': [31, 35],
  'calves-30': [35, 38],
  'calf-ladders': [35, 38],
  'calf-day': [35, 38],
  'calves-and-shins': [35, 38],
  'barefoot-legs': [31, 35],
  'calf-builder': [31, 35],
  'neck-day': [35, 38],
  'traps-30': [35, 38],
  'neck-and-traps': [35, 38],
  'shrug-and-hold': [35, 38],
  'traps-ladders': [31, 35],
  'desk-neck': [31, 35],
  // cardio-combat
  'bell-and-burpee': [35, 38],
  'chipper': [35, 38],
  'conditioning-30': [35, 38],
  'conditioning-ladders': [35, 38],
  'death-by': [35, 38],
  'dumbbell-complex': [35, 38],
  'dumbbell-engine': [35, 38],
  'dumbbell-tabata': [31, 35],
  'engine': [31, 35],
  'engine-builder': [31, 35],
  'boxing-strength': [35, 38],
  'heavy-hands': [35, 38],
  'boxers-engine': [35, 38],
  'boxing-emom': [35, 38],
  'boxing-power': [35, 38],
  'boxing-circuit': [35, 38],
  'boxing-30-plus': [31, 35],
  'fight-camp': [31, 35],
  'southpaw-switch': [31, 35],
  'full-contact': [35, 38],
  'kick-strength': [35, 38],
  'kick-and-core': [35, 38],
  'kick-circuit': [35, 38],
  'clinch-and-knees': [35, 38],
  'kick-combos': [35, 38],
  'kick-flex': [31, 35],
  'muay-thai-basics': [31, 35],
  'kick-30': [31, 35],
  'afterburn': [35, 38],
  'bell-hiit': [35, 38],
  'bell-intervals': [35, 38],
  'hiit-ladder-tabata': [35, 38],
  'hiit-ladders': [35, 38],
  'hiit-legs': [35, 38],
  'hiit-upper': [35, 38],
  'pyramid-hiit': [31, 35],
  'quiet-hiit': [31, 35],
  'tabata-torch': [31, 35],
  'explosive-full-body': [35, 38],
  'plyo-legs': [35, 38],
  'plyo-strength-emom': [35, 38],
  'plyo-power-straight': [35, 38],
  'spring-loaded': [35, 38],
  'vertical': [35, 38],
  'plyo-30': [31, 35],
  'plyo-calves': [31, 35],
  'plyo-circuits': [31, 35],
  'run-ready': [35, 38],
  'hill-legs': [35, 38],
  'runner-strength-30': [35, 38],
  'springy-legs': [35, 38],
  'stride-strength': [31, 35],
  'trail-legs': [31, 35],
  'run-faster': [31, 35],
  'field-strength': [35, 38],
  'court-agility': [35, 38],
  'change-of-direction': [35, 38],
  'court-30': [35, 38],
  'field-speed': [31, 35],
  'first-step': [31, 35],
  'racket-ready': [31, 35],
  // mind-body
  'core-foundations': [35, 38],
  'deep-core-60': [35, 38],
  'hollow-body': [35, 38],
  'loaded-core': [35, 38],
  'twist-and-brace': [35, 38],
  'core-circuits': [35, 38],
  'bell-core': [35, 38],
  'pilates-core-mix': [35, 38],
  'core-and-neck': [31, 35],
  'core-emom': [31, 35],
  'plank-project': [31, 35],
  'weighted-abs': [31, 35],
  'flow-state': [35, 38],
  'mobility-flow': [35, 38],
  'squat-hinge-mobility': [35, 38],
  'better-posture': [35, 38],
  'joint-health': [35, 38],
  'posture-strength-circuit': [35, 38],
  'shoulder-health': [31, 35],
  'ankle-hip-mobility': [31, 35],
  'hip-mobility': [31, 35],
  'power-vinyasa': [35, 38],
  'sun-and-strength': [35, 38],
  'yin-deep-stretch': [35, 38],
  'yoga-strength': [35, 38],
  'balance-flow': [35, 38],
  'core-yoga': [35, 38],
  'yoga-backbends': [35, 38],
  'yoga-balance-core': [31, 35],
  'yoga-hips-hamstrings': [31, 35],
  'yin-30': [31, 35],
  'pilates-flow': [35, 38],
  'pilates-power': [35, 38],
  'mat-foundations': [35, 38],
  'pilates-core-glutes': [35, 38],
  'classical-mat': [35, 38],
  'pilates-glutes-legs': [35, 38],
  'pilates-sculpt': [31, 35],
  'pilates-30': [31, 35],
  'standing-pilates': [31, 35],
  'active-flexibility': [35, 38],
  'active-range': [35, 38],
  'front-splits-60': [35, 38],
  'full-body-stretch': [35, 38],
  'hips-open': [35, 38],
  'backbend-flex': [35, 38],
  'pancake-straddle': [31, 35],
  'flexible-30': [31, 35],
  'splits-30': [31, 35],
  'loaded-balance': [35, 38],
  'single-leg-strength': [35, 38],
  'balance-strength-plus': [35, 38],
  'ankle-and-knee': [35, 38],
  'athletic-balance': [35, 38],
  'balance-and-core': [35, 38],
  'steady': [31, 35],
  'balance-30': [31, 35],
  'balance-calves-feet': [31, 35],
  'chair-and-wall': [35, 38],
  'easy-strength': [35, 38],
  'gentle-start': [35, 38],
  'low-impact-cardio': [35, 38],
  'strong-and-steady': [35, 38],
  'gentle-30': [31, 35],
  'gentle-flow': [31, 35],
  'gentle-legs-balance': [31, 35],
  'loaded-back-care': [35, 38],
  'back-and-hips': [35, 38],
  'strong-back': [35, 38],
  'back-hips-glutes': [35, 38],
  'back-basics': [31, 35],
  'back-care-30': [31, 35],
  'upper-back-care': [31, 35],
  // mixed
  'lift-and-lengthen': [35, 38],
  'strong-hips': [35, 38],
  'kettlebell-and-yoga': [35, 38],
  'posture-strength': [35, 38],
  'upper-and-open': [35, 38],
  'lift-and-move': [35, 38],
  'chest-and-open': [31, 35],
  'legs-and-lengthen-plus': [31, 35],
  'stretch-30-plus': [31, 35],
  'muay-thai-conditioning': [35, 38],
  'boxers-body': [35, 38],
  'southpaw-strength': [35, 38],
  'fight-ready': [35, 38],
  'knockout-circuit': [35, 38],
  'bouts-and-bells': [35, 38],
  'fighter-30': [31, 35],
  'fighter-emom': [31, 35],
  'whole-body-week': [35, 38],
  'balanced-fighter': [35, 38],
  'balanced-month-plus': [35, 38],
  'balanced-muscle': [35, 38],
  'balanced-bw-plus': [31, 35],
  'balanced-kb-plus': [31, 35],
  'quiet-power': [35, 38],
  'calm-muscle': [35, 38],
  'slow-supersets': [35, 38],
  'calm-bell-plus': [31, 35],
  'calm-bodyweight': [31, 35],
  'every-day-different': [35, 38],
  'variety-30': [35, 38],
  'bodyweight-variety-30': [35, 38],
  'muscle-tour': [35, 38],
  'athlete-variety': [35, 38],
  'bodyweight-shuffle': [35, 38],
  'fighter-variety': [31, 35],
  'kettlebell-roulette': [31, 35],
  'strength-roulette': [31, 35],
  'upper-roulette': [31, 35],
```

## Challenge round
- **Weakest assumption: that adding sets and slots gets a 24-minute day to 35 without it feeling padded.** A yoga or
  mobility flow has `repeat` 1–3 and scaled holds; a boxing day has bouts of fixed length. For some short shapes the
  pass may need two extra slots per block, which is a different workout. **Plan edit:** ticket 1 caps the pass at one
  added slot per block; a program that can't reach its band past that gets longer anyway by what fits (170), and a
  subject may end with fewer than half at 35–38, recorded in "The list".
- **What I hadn't read:** `formats.js`'s per-format growth rules (whether EMOM and Tabata grow by minutes or by
  rounds), and how `recipe-book.js` records time ranges: a re-timed library day type would change what Build your own
  and random workouts offer for 35 minutes. Ticket 1 reads both; if the recipe book changes, own programs are safe
  (built from their stored config) and random workouts simply gain options.
- **Started programs read from a backup:** a program started on the phone after the backup ran would move. **Plan
  edit:** ticket 2 asks Noam for a fresh export from Settings on the day it runs.
- **The lazier version:** raise `minutes` and rebuild the moved programs. Not proposed: that reshuffles every day,
  which Noam ruled out (55, "just add compatible exercises").

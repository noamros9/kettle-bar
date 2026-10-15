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
- **340 · The band is the program's average** (was every day): a day may run 10% past its top (35–41.8, 31–38.5),
  the 10% CLAUDE.md allows; the 31–35 quarter the same. *(15 Oct)*
- **341 · A lighter day type, like Signature's**: with 3+ day types the shortest stays lighter, at least 80% of the
  bottom (28, 24.8); the others carry the average, else the light days go the whole way. *(15 Oct)*
- **342 · Counted and filtered by the average day**, not the middle of the range; the card shows the days' range
  (e.g. 28–41). *(15 Oct)*
- **343 · Mind & body's flows may stay short**: 15 can't reach their band (a flow repeats at most 3 times, one pose
  more); they keep what they gained, no replacements, and five subjects end under half at 35+. *(15 Oct)*

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
| 1b | The band as the average, a lighter day type | feature | 2 | `feature/long-average` | done (PR #439) |
| 3 | Strength family, re-timed | content | 1b | `content/long-strength` | done (PR #440) |
| 4 | Cardio & combat, re-timed | content | 3 | `content/long-cardio-combat` | done (PR #441) |
| 5 | Mind & body, re-timed | content | 4 | `content/long-mind-body` | done (PR #442) |
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

### 1b. The band as the average, a lighter day type (340–342)
Added 15 Oct, when ticket 3 showed ~11% of the Strength family's days stopping at 34 (a set more would pass 38).
- **Build:** `program-builder.js`'s `lengthenAll`: the band is the program's average and a day may go to 110% of its
  top; with 3+ day types in the cycle the shortest (by its days' mean before the pass) is lengthened only to 80% of
  the bottom, the others to what carries the average (capped at the top +10%); when the average still misses, the
  light days go back to what the build made and are lengthened like the rest. `minutes` is the days' range.
- **Files:** `program-builder.js`, `tests/lengthen.test.js`; `scripts/long-list.js` and `tests/long-list.test.js` (the
  list counted by the average day, redone in "The list").
- **Test first:** two day types: every day 35–41.8, the average 35–38; three: the light days stay under 35 (at least
  28), the others carry the average; main days that can't carry it send the light ones to 35.
- **Done when:** no pin changes (the map is still empty); the PR's CI green.

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
- **Files:** `configs/long.js`, `tests/fixtures/program-days.json`, `tests/fixtures/long-was.json`.
- **As built (ticket 3, PR #440):** the test is its own `tests/long.test.js` (`// ci-only`, it reads the library);
  `npm run pin -- --long` also keeps each program's pin from before the pass in `tests/fixtures/long-was.json`, and the
  test checks the days before the pass against it, so the old picks are the ones that were pinned. Strength: 94 move,
  every average in its band, none short; 30 keep a lighter day type. Cardio & combat (ticket 4, PR #441): 61, none short; 33 lighter. Mind & body (ticket 5, PR #442): 73, 15 short (343, below); 40 lighter.
- **Test first:** `programs.test.js`'s Phase 26 block: the family's subjects meet the spread, or the shortfall is the
  programs recorded as short in "The list"; every listed program is longer than its pin was, and its days hold all
  their old picks (the pass's test, run over the real list).
- **Done when:** the spread holds for the family, short of it only by the recorded programs; only the listed pins changed (`git diff --stat` on the pins file);
  the PR's CI green.

### 6b. The length filter and random workouts at 38
- **Build:** `app/library.js`'s `LENGTHS` and `lengthOf` become Up to 30 / 31–35 / 35+ by the program's average day
  (191, 342; the program summary carries the average); random
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
`three-split-60`, which is frozen anyway. Redone the same day by each program's average day (1b, 342; it was the
middle of the range, which counted programs like bar-master, 33–37 but averaging 35+, as 31–35).
**258 move: 174 to 35–38, 84 to 31–35.** Strength ends one short of a quarter at 31–35: nothing shorter is left to move.
Counts after the moves, by the average day (Up to 30.5 / 31–35 / 35+):

| Subject | Programs | 35–38 | 31–35 | Shorter | Short of the spread |
|---|---|---|---|---|---|
| Signature | 30 | 15 | 15 | 0 | – |
| Strength | 29 | 21 | 6 | 2 | 0 long, 1 mid |
| Pull-ups | 24 | 14 | 8 | 2 | – |
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
| Fighter | 21 | 11 | 7 | 3 | – |
| Athlete | 21 | 15 | 5 | 1 | – |
| Balanced week | 23 | 12 | 7 | 4 | – |
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

Tickets 3–6 copy their family's lines into `configs/long.js`; a program the pass can't take into its band's bucket is
noted here with the minutes it reached (170).

**Short (ticket 5, decision 343; average reached):** Pilates: classical-mat 34.3 (35–38), standing-pilates 28.2
(31–35). Flexibility: front-splits-60 31.0, pancake-straddle 29.6 (31–35), flexible-30 30.5 (31–35). Mobility &
posture: joint-health 34.6, mobility-flow 34.3, shoulder-health 31.4, hip-mobility 28.6 (31–35). Gentle / low impact:
low-impact-cardio 25.3, gentle-flow 28.9 (31–35), gentle-30 30.0 (31–35). Back care: back-and-hips 32.5,
loaded-back-care 34.7, upper-back-care 29.6 (31–35). The rest are 35–38. So at 35+ / 31–35: Pilates 11 of 12 / 6 of 6,
Flexibility 8 of 9 / 5, Mobility & posture 6 of 9 / 7, Gentle / low impact 7 of 8 / 2 of 4, Back care 5 of 7 / 5.

```js
  // cardio-combat
  'engine': [35, 38],
  'conditioning-ladders': [35, 38],
  'tabata-ten': [35, 38],
  'death-by': [35, 38],
  'chipper': [35, 38],
  'work-and-rest': [35, 38],
  'engine-builder': [35, 38],
  'storm-front': [31, 35],
  'conditioning-30': [31, 35],
  'bell-and-burpee': [31, 35],
  'boxing-strength': [35, 38],
  'heavy-hands': [35, 38],
  'boxing-emom': [35, 38],
  'boxing-power': [35, 38],
  'boxers-engine': [35, 38],
  'boxing-30-plus': [35, 38],
  'boxing-circuit': [31, 35],
  'southpaw-switch': [31, 35],
  'fight-camp': [31, 35],
  'full-contact': [35, 38],
  'kick-strength': [35, 38],
  'kick-and-core': [35, 38],
  'kick-circuit': [35, 38],
  'kick-flex': [35, 38],
  'clinch-and-knees': [35, 38],
  'kick-combos': [31, 35],
  'muay-thai-basics': [31, 35],
  'kick-30': [31, 35],
  'afterburn': [35, 38],
  'pyramid-hiit': [35, 38],
  'hiit-ladder-tabata': [35, 38],
  'thirty-thirty': [35, 38],
  'bell-hiit': [35, 38],
  'hiit-upper': [35, 38],
  'quiet-hiit': [35, 38],
  'bell-intervals': [31, 35],
  'hiit-legs': [31, 35],
  'hiit-30-plus': [31, 35],
  'explosive-full-body': [35, 38],
  'plyo-legs': [35, 38],
  'vertical': [35, 38],
  'plyo-strength-emom': [35, 38],
  'plyo-power-straight': [35, 38],
  'plyo-emom': [35, 38],
  'spring-loaded': [31, 35],
  'upper-plyo': [31, 35],
  'plyo-calves': [31, 35],
  'run-ready': [35, 38],
  'springy-legs': [35, 38],
  'trail-legs': [35, 38],
  'hill-legs': [35, 38],
  'stride-strength': [31, 35],
  'runner-strength-30': [31, 35],
  'run-faster': [31, 35],
  'field-strength': [35, 38],
  'racket-ready': [35, 38],
  'court-agility': [35, 38],
  'first-step': [35, 38],
  'court-30': [31, 35],
  'change-of-direction': [31, 35],
  'reaction-ready': [31, 35],
  // mind-body
  'core-foundations': [35, 38],
  'deep-core-60': [35, 38],
  'loaded-core': [35, 38],
  'twist-and-brace': [35, 38],
  'hollow-body': [35, 38],
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
  'shoulder-health': [35, 38],
  'posture-strength-circuit': [31, 35],
  'ankle-hip-mobility': [31, 35],
  'hip-mobility': [31, 35],
  'power-vinyasa': [35, 38],
  'yin-deep-stretch': [35, 38],
  'sun-and-strength': [35, 38],
  'yoga-strength': [35, 38],
  'balance-flow': [35, 38],
  'yoga-hips-hamstrings': [35, 38],
  'yoga-balance-core': [35, 38],
  'yoga-backbends': [31, 35],
  'core-yoga': [31, 35],
  'yin-30': [31, 35],
  'pilates-flow': [35, 38],
  'pilates-power': [35, 38],
  'pilates-core-glutes': [35, 38],
  'mat-foundations': [35, 38],
  'classical-mat': [35, 38],
  'pilates-sculpt': [35, 38],
  'pilates-glutes-legs': [31, 35],
  'pilates-30': [31, 35],
  'standing-pilates': [31, 35],
  'active-flexibility': [35, 38],
  'active-range': [35, 38],
  'front-splits-60': [35, 38],
  'hips-open': [35, 38],
  'full-body-stretch': [35, 38],
  'splits-30': [35, 38],
  'pancake-straddle': [31, 35],
  'backbend-flex': [31, 35],
  'flexible-30': [31, 35],
  'single-leg-strength': [35, 38],
  'loaded-balance': [35, 38],
  'athletic-balance': [35, 38],
  'ankle-and-knee': [35, 38],
  'balance-and-core': [35, 38],
  'balance-strength-plus': [35, 38],
  'steady': [31, 35],
  'balance-emom': [31, 35],
  'steady-feet': [31, 35],
  'strong-and-steady': [35, 38],
  'easy-strength': [35, 38],
  'gentle-start': [35, 38],
  'chair-and-wall': [35, 38],
  'low-impact-cardio': [35, 38],
  'gentle-30': [31, 35],
  'gentle-legs-balance': [31, 35],
  'gentle-flow': [31, 35],
  'loaded-back-care': [35, 38],
  'back-and-hips': [35, 38],
  'strong-back': [35, 38],
  'back-hips-glutes': [35, 38],
  'upper-back-care': [31, 35],
  'back-care-30': [31, 35],
  'back-basics': [31, 35],
  // strength
  'swing-press-emom': [35, 38],
  'kettlebell-flow': [35, 38],
  'swing-century': [35, 38],
  'bell-complexes': [35, 38],
  'bell-emom-plus': [35, 38],
  'bell-circuit': [35, 38],
  'windmill-and-press': [35, 38],
  'getup-strong': [35, 38],
  'bell-arms': [31, 35],
  'bell-full-emom': [31, 35],
  'bell-hips-core': [31, 35],
  'slow-bell': [31, 35],
  'bell-muscle': [31, 35],
  'no-gear-burn': [35, 38],
  'bodyweight-amrap': [35, 38],
  'pushup-and-squat': [35, 38],
  'pushup-progress': [35, 38],
  'kitchen-table': [35, 38],
  'calisthenics-skills': [35, 38],
  'calisthenics-base': [35, 38],
  'quiet-upper': [35, 38],
  'floor-only': [35, 38],
  'bodyweight-30': [35, 38],
  'hotel-room': [31, 35],
  'travel-strength': [31, 35],
  'floor-pull': [31, 35],
  'bodyweight-muscle': [31, 35],
  'single-leg-strong': [35, 38],
  'squat-everyday': [35, 38],
  'athletic-legs': [35, 38],
  'glute-builder': [35, 38],
  'legs-all-over': [35, 38],
  'grip-and-lift': [35, 38],
  'grip-strength': [35, 38],
  'grip-and-pull': [35, 38],
  'carry-day': [35, 38],
  'grip-30': [31, 35],
  'forearm-pump': [31, 35],
  'forearm-circuit': [31, 35],
  'complex-and-carry': [35, 38],
  'bell-ladders': [35, 38],
  'complex-builder': [35, 38],
  'complex-straight': [35, 38],
  'bell-amrap': [31, 35],
  'complex-hips': [31, 35],
  'complex-ladder-emom': [31, 35],
  'climber-antagonist': [35, 38],
  'climb-strength': [35, 38],
  'archer-project': [35, 38],
  'pull-ladder-climb': [35, 38],
  'wall-ready': [31, 35],
  'climber-30': [31, 35],
  'chest-day': [35, 38],
  'chest-30': [35, 38],
  'push-and-press': [35, 38],
  'chest-ladders': [35, 38],
  'bell-chest': [31, 35],
  'pushup-chest': [31, 35],
  'back-day': [35, 38],
  'back-30': [35, 38],
  'back-and-biceps': [35, 38],
  'back-ladders': [35, 38],
  'back-circuit-30': [31, 35],
  'floor-back': [31, 35],
  'shoulder-day': [35, 38],
  'shoulders-30': [35, 38],
  'boulder-shoulders': [35, 38],
  'shoulder-ladders': [35, 38],
  'shoulder-circuit-30': [31, 35],
  'bell-shoulders': [31, 35],
  'arms-30': [35, 38],
  'arm-day': [35, 38],
  'arm-supersets': [35, 38],
  'chinup-arms': [35, 38],
  'arm-ladders': [31, 35],
  'arm-circuit-30': [31, 35],
  'hips-30': [35, 38],
  'hip-day': [35, 38],
  'bell-hips': [35, 38],
  'hip-ladders': [35, 38],
  'hip-circuit-30': [31, 35],
  'inner-thigh-supersets': [31, 35],
  'calf-ladders': [35, 38],
  'calves-30': [35, 38],
  'calves-and-shins': [35, 38],
  'calf-day': [35, 38],
  'barefoot-legs': [31, 35],
  'calf-emom': [31, 35],
  'neck-day': [35, 38],
  'traps-30': [35, 38],
  'traps-ladders': [35, 38],
  'neck-and-traps': [35, 38],
  'shrug-and-hold': [31, 35],
  'neck-emom': [31, 35],
  // mixed
  'lift-and-lengthen': [35, 38],
  'strong-hips': [35, 38],
  'kettlebell-and-yoga': [35, 38],
  'lift-and-move': [35, 38],
  'posture-strength': [35, 38],
  'upper-and-open': [35, 38],
  'supersets-and-stretch': [31, 35],
  'stretch-30-plus': [31, 35],
  'boxers-body': [35, 38],
  'bouts-and-bells': [35, 38],
  'fight-ready': [35, 38],
  'knockout-circuit': [35, 38],
  'whole-body-week': [35, 38],
  'balanced-month-plus': [35, 38],
  'balanced-fighter': [35, 38],
  'balanced-30': [35, 38],
  'quiet-power': [35, 38],
  'yin-and-yang': [35, 38],
  'calm-muscle': [35, 38],
  'calm-bell-plus': [31, 35],
  'every-day-different': [35, 38],
  'variety-30': [35, 38],
  'bodyweight-variety-30': [35, 38],
  'muscle-tour': [35, 38],
  'upper-roulette': [35, 38],
  'kettlebell-roulette': [35, 38],
  'strength-roulette': [31, 35],
  'bodyweight-shuffle': [31, 35],
  'athlete-variety': [31, 35],
  'fighter-variety': [31, 35],
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
- **Ticket 3 showed the per-day band too tight** (15 Oct): 718 of the Strength family's 6,690 days stopped at 34 when a
  set more would pass 38. **Plan edit:** ticket 1b (340–342) makes the band the average, lets a day run 10% over and
  keeps a lighter day type; 6b filters by the average.
- **The lazier version:** raise `minutes` and rebuild the moved programs. Not proposed: that reshuffles every day,
  which Noam ruled out (55, "just add compatible exercises").

# Phase 26: longer programs, half at 35–38 minutes

Issue [#198](https://github.com/noamros9/kettle-bar/issues/198). Grilled 4 and 7 Oct 2026 (Noam); decisions 53–56,
82 and 153–157 below. After Phase 25 (134).

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
- **192 · Random workouts: 15 / 25 / 38** (38 replaces 35); the rest-day flow keeps 15.
- **203 · Help me pick: About 15 / 20–30 / 31–35 / 35–38+.** **204 ·** Build your own keeps 20–40, no 38.

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
| 1 | The lengthening pass and the one-time re-pin | feature | – | `feature/lengthen-pass` | todo |
| 2 | Who moves: the list per subject | feature | 1 | `feature/long-list` | todo |
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
_(ticket 2)_

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

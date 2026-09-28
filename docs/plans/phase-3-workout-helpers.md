# Phase 3: workout helpers

Source of truth for Phase 3. Decisions come from the roadmap grilling and the 28 Sep 2026 round.
Glossary: [CONTEXT.md](../../CONTEXT.md).

## What we're building

- **Animated drawings.** Only the big drawing on an **exercise page** moves. It loops smoothly between the
  exercise's positions. Workout cards stay still, and the phone's reduce-motion setting shows the still drawing.
- **Voice cues** for holds and one-side moves, in the workout **and** the warm-up and cool-down: "switch sides",
  "halfway", and the end of a hold ("done"). The phone's built-in speech says them; the beeps stay. **On by
  default**, with a Settings switch that each device remembers.
- **Swap an exercise.** Swap offers alternatives that work the same main muscle with the program's equipment.
  Each time, it asks **today only** or **the rest of the program**. The rest of the program means from this
  day on: every later day of this program with that exercise. Days already done keep what they had. The
  new exercise gets **its own reps** for the level. A swap can be undone. Swaps sync like progress, count
  in stats, and are included in backups.

## Rules (decided)

| Question | Decision |
|---|---|
| Alternatives | Same first main muscle; same kind (reps vs seconds); allowed by the program's equipment (all / kettlebell only / bodyweight); no pull-up bar in the abs block. Not the exercise itself, nor one already in that block. |
| No alternative | 6 exercises have none; they show no Swap button. |
| Reps after a swap | The new exercise's own reps for the day's level; halved (as the builder does) inside EMOM and AMRAP. |
| Today only vs rest of program | Asked every time. "Rest of the program" applies from that day to day 60, only where the exercise appears. |
| Overlapping swaps | The latest swap wins for a given day and exercise. |
| Warm-up / cool-down | Not swappable. |
| Where swaps live | In the same Firestore document as the program's done days (`swaps` field). The rules already allow it; nothing to set up. |
| Voice | `speechSynthesis`, English. Speaks "Switch sides" when the switch phase starts, "Halfway" in the middle of each workout hold (and each side), and "Done" when a hold ends. Warm-up and cool-down included, but "Halfway" only in stretches of 20 s or more and "Done" once at the end, since stretches are short and back to back (settled in ticket 2). No countdowns or encouragement (decided against). |
| Animation | Ease in and out between positions, going back and forth; one shared frame size so the figure never jumps; ~55 ms per frame; exercise pages only; still under reduce motion. |

## Modules

- **Figure engine:** `animationFrames(ex)` returns the SVG frames of the loop. It is pure and tested. The page plays them.
- **Workout Session:** phase plans gain `say` (spoken when the phase starts) and `halfway` (say "Halfway"
  mid-phase). The Clock speaks them when voice is on.
- **Exercise Catalogue:** `allowedIn(equip, ex)` moves here from the Program Builder so the page can use it.
  The builder's output must stay byte-identical.
- **`app/swaps.js`** (new, pure, in the 100% gate): `alternatives(exId, block, program, EX)` and
  `applySwaps(day, swaps, EX)` returns the day as you'll do it.
- **Progress Store:** keeps `swaps` per program next to `done`. It writes both in one document and hands
  both to the page. The remote adapters deliver the whole document.
- **Backup:** export, import and the nightly file carry swaps.

## Tickets

Cheapest first; one ticket = one branch = one PR.

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-3` | done (PR #27) |
| 1 | Animated drawings on exercise pages | feature | 0 | `feature/animated-drawings` | done (PR #28) |
| 2 | Voice cues + Settings switch | feature | 0 | `feature/voice-cues` | todo |
| 3 | Swap for today (alternatives, sync, stats) | feature | 0 | `feature/swap-today` | todo |
| 4 | Swap for the rest of the program + undo | feature | 3 | `feature/swap-onward` | todo |
| 5 | Swaps in backups | feature | 3 | `feature/swap-backups` | todo |

### 1. Animated drawings
Files: `figures.js`, `tests/figures.test.js`, `app/views.js`, `app/main.js`, `tests-ui/exercise.spec.js`.
- **Test first:** `animationFrames` for a 3-position exercise: the frames go there and back, the first frame
  draws the first position, every frame shares one viewBox, no NaN. A 1-position exercise gives 1 frame.
- **Done when:** an exercise page's drawing changes over time (UI test on a fake clock), stays still under
  reduce motion, and stops when you leave the page. Workout cards never move.

### 2. Voice cues
Files: `app/session.js`, `tests/session.rules.test.js`, `app/clock.js`, `app/views.js` (Settings), `tests-ui/voice.spec.js`.
- **Test first:** hold and stretch plans carry `say` / `halfway` exactly where the rules table says.
- **Done when:** a UI test with a recording speech stub hears "Halfway", "Switch sides", "Halfway" and "Done"
  for a one-side hold. With the Settings switch off it hears nothing, and the switch survives a reload.

### 3. Swap for today
Files: `exercises.js`, `program-builder.js`, `app/swaps.js`, `tests/swaps.test.js`, `app/store.js`, `firebase-sync.js`, `app/views.js`, `app/main.js`, `app/stats.js` (via swapped days), `tests-ui/swap.spec.js`.
- **Test first:** `alternatives` for push-ups in a bodyweight program: same main muscle, reps-type, no weights. And
  `applySwaps` puts the new exercise in with its own reps for the level.
- **Done when:** on the phone you tap Swap, pick an alternative, choose Today only, and the day shows it. The
  swap survives a reload, syncs through the store's remote, and the day's stats count the new exercise.

### 4. Swap for the rest of the program + undo
Files: `app/swaps.js`, `tests/swaps.test.js`, `app/views.js`, `tests-ui/swap.spec.js`.
- **Test first:** an onward swap from day 10 changes days 10–60 where the exercise appears, not day 9, and a
  later today-only swap on day 20 wins over it. Undo removes the swap.
- **Done when:** choosing "Rest of the program" changes later days on the phone, and "Undo swap" restores
  the original.

### 5. Swaps in backups
Files: `app/backup.js`, `tests/backup.test.js`, `scripts/backup-progress.js`, `app/main.js`.
- **Test first:** export includes swaps; parse/diff/apply handle them. Merge keeps both sides' swaps with the
  file's winning on conflict; Replace takes the file's. The nightly file carries them.
- **Done when:** an exported file with a swap, imported on a fresh device, shows the swapped exercise.

## Out of scope
Voice countdowns and encouragement; animating workout cards (both decided against). Repeating a program
(#17) and summaries (#18) stay in the backlog.

## Challenge round
- **Weakest assumption:** that swaps can live in the progress document without a rules change and without
  losing data. I read `firestore.rules`: the user may write any field of their own progress documents, so
  no change is needed there. But `app/store.js` writes with `setDoc({ done, updatedAt })`, which replaces
  the whole document, and the adapters hand the page only `done`. Unchanged, the first tick after a swap
  would wipe it. **Plan change:** ticket 3 makes the store own both fields and the adapters deliver the whole
  document (listed under Modules).
- **What I hadn't read:** how many alternatives exist. Counted: 85 workout exercises, median 5 alternatives
  on the same main muscle and kind, 6 with none. **Plan change:** the "No alternative" rule, since those 6 get
  no Swap button. Also, the equipment filter lived only in the Program Builder, which the page doesn't
  load. **Plan change:** `allowedIn` moves to the Catalogue, with the builder's output checked byte-identical.
- **The lazier version:** swap for today only, local to the device, with no sync and no backups. Not
  proposed: the roadmap decision says swaps sync like progress, and a swap that silently vanishes on the
  other device would confuse more than help. The tickets still ship "today" first, and it works on its own.

# Phase 30: muscle groups on three levels, and doing a day again

Asked and grilled 7 Oct 2026 with Noam. After Phase 31, the quick fixes (223; was right after Phase 22, 216). Issue [#287](https://github.com/noamros9/kettle-bar/issues/287).

## Decisions
Global decision numbers.

**Muscle groups**
- **207 · Three levels: Upper / Core / Lower, then body parts, then muscles.** Upper: Chest (chest), Back (lats, upper
  back, traps, neck), Shoulders (front, side, rear), Arms (biceps, triceps, forearms). Core: Abs & obliques, Lower
  back. Lower: Glutes & hips (glutes, inner thighs, hip flexors), Thighs (quads, hamstrings), Lower legs (calves, shins).
- **208 · Stats → Muscles: group bars, tap to open**, three levels deep (like the Time tab's families).
- **209 · The body map works both ways**: opening a group lights only its muscles; tapping a muscle on the map opens
  its row.
- **210 · Pickers get group chips** that pick all their muscles, under Upper / Core / Lower; single muscles still
  tappable. Everywhere muscles are picked (today: the Muscles page).
- **211 · The Exercises page's Muscles chips follow the groups**: Upper / Core / Lower first; legs split into Glutes &
  hips, Thighs, Lower legs; Full body stays its own chip.

**Doing a day again**
- **212 · A done day can be done again, and it counts again**: each time adds a date; History and Stats count every
  one; program progress still counts the day once. (Today tapping "✓ Done" unmarks the day and loses its date.)
- **213 · It counts as having trained today**: the rest-day card hides, the next random workout takes its level.
- **214 · Current round only**; finished rounds stay as they were.
- **215 · The day page only adds; a mark is removed in History** (tap the date, Remove). No accidental unmarking.
- **217 · Stored as an optional `again: { day: [time] }`** in the program's progress, like `short`: no rules change,
  old apps ignore it, backups carry it as an optional section, merges take the union. *(technical)*

**When**
- **216 · Right after Phase 22 (now after Phase 31, 223)**, before Phase 20's tickets 9–15.

## What lands
- One definition of the groups (`MUSCLE_GROUPS` in `exercises.js`, next to `MUSCLE_NAMES`), read by Stats, the
  Muscles page and the Exercises page, so they never disagree.
- Stats → Muscles: the map on top, then Upper / Core / Lower bars with their load; a group opens its parts, a part its
  muscles; the map follows what's open, and a tapped muscle opens its row.
- The Muscles page: chips under Upper / Core / Lower, a chip per part that picks its muscles, then the muscles.
- The Exercises page's Muscles family: Upper (Chest, Back, Shoulders, Arms), Core, Lower (Glutes & hips, Thighs,
  Lower legs), Full body.
- A done day's button reads **Do it again**; finishing it again adds a date. History shows every date; tapping a date
  offers **Remove**.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-30` | done (PR #288) |
| 1 | The groups: one definition, group loads | feature | – | `feature/muscle-groups` | todo |
| 2 | Stats → Muscles on three levels, the map both ways | feature | 1 | `feature/stats-muscle-groups` | todo |
| 3 | Group chips on the Muscles page; the Exercises page by groups | feature | 1 | `feature/picker-groups` | todo |
| 4 | Done again: the `again` field, store, sync, backup, stats entries | feature | 2 | `feature/done-again` | todo |
| 5 | The day page's "Do it again"; Remove in History | feature | 4 | `feature/again-ui` | todo |
| 6 | Close the phase: CONTEXT.md, archive | plan | 3, 5 | `plan/p30-close` | todo |

Tickets 2 and 3 can build at once (Stats page vs Muscles and Exercises pages). Ticket 4 waits for 2 because both
edit `app/stats.js`.

### 1. The groups
- **Build:** `MUSCLE_GROUPS` in `exercises.js`: `[[ 'upper', 'Upper body', [[ 'chest', 'Chest', ['chest'] ], …]], …]`
  as in 207; `groupOf(muscle) -> { top, part }`. `app/stats.js`: `groupLoads(loads)` sums a span's muscle loads into
  parts and tops (the same weighted sets, no new rule). `app/library.js`'s `MUSCLE_SUB` is derived from the groups
  (no second copy); `familyOf` sorts an exercise by its first main muscle's part.
- **Files:** `exercises.js`, `app/stats.js`, `app/library.js`, `tests/library.muscles.test.js`,
  `tests/stats.test.js`, `tests/catalogue.test.js`.
- **Test first:** every muscle in `MUSCLE_NAMES` is in exactly one part; `groupLoads` of a made-up span adds up to
  the span's total; `familyOf` puts a squat in Thighs and a superman in Lower back.
- **Done when:** 100% lines and functions on the new code; no pin changes (programs are untouched).

### 2. Stats → Muscles
- **Build:** the muscles tab draws Upper / Core / Lower rows with bars and loads; tapping one opens its parts, a part
  its muscles (`aria-expanded`, as the Time tab). The map shades only the open group's muscles (others faint);
  tapping a muscle on the map opens its top and part and scrolls to its row. The weighted-sets note stays.
- **Files:** `app/pages/stats.js`, `app/styles.css`, `tests-ui/stats.spec.js`, `scripts/ui-affected.js`.
- **Test first:** `stats.spec.js`: three top rows; opening Upper shows four parts and lights only upper muscles;
  tapping the quads on the map opens Lower → Thighs with Quads visible.
- **Done when:** 390 px screenshots light and dark (closed, one open, three levels open); 360 px no sideways scroll.

### 3. The pickers
- **Build:** the Muscles page's chips are grouped under Upper / Core / Lower; each part has a chip that picks (or
  unpicks) all its muscles, pressed when all are picked; single muscle chips stay. The Exercises page's Muscles family
  lists Upper, Core and Lower parts as its sub-chips, plus Full body.
- **Files:** `app/pages/exercises.js`, `app/library.js` (`EX_FAMILIES`' muscles entry from the groups),
  `app/styles.css`, `tests-ui/muscles.spec.js`, `tests-ui/exercises.spec.js`, `tests/library.test.js`.
- **Test first:** tapping "Back" picks lats, upper back, traps and neck and the list shows their exercises; tapping it
  again clears them; the Exercises page's Thighs chip lists squats and not calf raises.
- **Done when:** screenshots of both pages, light and dark.

### 4. Done again: the data
- **Build:** `app/progress.js`: `again: { day: [time] }` for the current round (present only when there is one, as
  `short`); `doAgain(v, day, now)`; `removeMark(v, day, time)` (removing the first date promotes the earliest again
  date to `done`; removing the only date unmarks the day); `entries` lists every date (each its own entry, same day);
  `count` still counts days. A new round moves `again` into the past round with the rest. `mergeFirstSync` and
  `importMerge` union the dates. `app/store.js` and `app/backup.js` carry the field (an optional `again` section, the
  backup version unchanged since it's optional). Stats, History and the level of the last done day read the entries,
  so they count each date with no change of their own.
- **Files:** `app/progress.js`, `app/store.js`, `app/backup.js`, `app/stats.js` (only if it dedupes by day),
  `tests/progress.test.js`, `tests/progress.shape.test.js`, `tests/backup.test.js`, `tests/stats.days.test.js`.
- **Test first:** a day done on Mon and again on Thu gives two entries, two History days and twice its volume in
  Stats, but `count` 1; an old document without `again` reads as today; an old backup imports; two devices each
  adding a date merge to both; removing Monday leaves Thursday as `done`.
- **Done when:** 100% lines and functions on `app/progress.js`; the shape test pins the new optional field.

### 5. The buttons
- **Build:** on a done day of the current round, the day page's button reads **Do it again**; it starts a fresh
  session (the old ticks are gone) and its finish card's button **Mark done again** adds today's date. The old
  toggle that unmarked a day is gone. History: tapping a date lists that day's workouts, each with **Remove** (asks
  first). A day of a past round shows read-only.
- **Files:** `app/pages/day.js`, `app/pages/stats.js` (History), `app/main.js` (if the toggle handler lives there),
  `tests-ui/finish.spec.js`, `tests-ui/stats.spec.js`, `tests-ui/rounds.spec.js`.
- **Test first:** finish day 3, then do it again: History shows both dates, Stats count both, the program still shows
  1 done; Remove on the first date leaves the second; a Round 1 day after Start Round 2 has no "Do it again".
- **Done when:** screenshots light and dark of a done day, the finish card, and History's Remove.

## Challenge round
- **Weakest assumption: that every reader of progress goes through `entries`.** If anything counts done days by
  reading `done` directly (the program card's "12 of 60", Today's workout's next day, the finder's started
  programs, Phase 26's "started" list), it must keep counting days once, which is right; but anything that should see
  every workout (History, Stats, `random.levelOf`) must use `entries`. Ticket 4 greps for `.done` and `isDone` and
  lists each reader in the PR as "once" or "every date".
- **What I hadn't read:** History's calendar (`calendarMonth`) says "two on one date: one" for `daysPerWeek`; a day
  done twice on the same date should still count as one day there and two workouts. Ticket 4's test pins that.
  Also not read: how the backup diff shows changes; ticket 4 adds "dates added" to it if it only counts days.
- **The lazier version:** keep one date per day and just stop the button from unmarking (no counting again). Not
  proposed: Noam chose that it counts again (212).
- **Moving `lower_back` from Back to Core** (207) moves exercises like supermans from the Back chip to Core on the
  Exercises page. That's the decision; noted so it isn't mistaken for a bug.

# Phase 7: day to day

Source of truth for the random workout ([#64](https://github.com/noamros9/kettle-bar/issues/64)) and ideas 1–3 and
7–10 of [#67](https://github.com/noamros9/kettle-bar/issues/67), picked by Noam on 29 Sep. Decisions are in
[ROADMAP.md](../../ROADMAP.md). Built on [architecture review III](architecture-review-3.md) (one day from a recipe,
account data) and Phase 6's recipes. Glossary: [CONTEXT.md](../../CONTEXT.md).

Decided on 29 Sep:
- **Random workout:** counts in stats, not in program progress; its level follows the last workout marked done
  (Noam, #64). It's chosen on a **sheet** (family or subject, 15 / 25 / 35 min, equipment) with **reshuffle**
  before Start, **built fresh** by the Program Builder, and the button is on the **Programs page**.
- **Travel mode** lasts **until turned off**.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 1 | Resume a workout after closing the app | feature | – | `feature/resume` | done (PR #89) |
| 2 | Random workout | feature | review III 4, 5; Phase 6 4 | `feature/random-workout` | done (PR #100) |
| 3 | Rest-day flow | feature | 2 | `feature/rest-day-flow` | done (PR #PRNUM) |
| 4 | Shorter today | feature | review III 4 | `feature/shorter-today` | |
| 5 | Travel mode | feature | review III 5 | `feature/travel-mode` | |
| 6 | Warm-up that matches the format | feature | review III 3 | `feature/warmup-by-format` | |
| 7 | Big timer | feature | – | `feature/big-timer` | done (PR #90) |
| 8 | What next, when a program ends | feature | – | `feature/what-next` | done (PR #92) |

### 1. Resume a workout
- The open day's Workout Session is saved on the device on every tick (`kb-session-<pid>-<round>-<day>`: ticks, counters,
  stretches, the time started). Opening that day again restores it; **Mark as done** or 12 hours pass clears it.
  Device only: a session is short-lived.
- **Why (Noam, 29 Sep):** today an unfinished workout lives only in memory. Closing the app loses its ticks, and
  opening another day replaces it, so going back starts from zero. Saving per day fixes both: several days can
  each keep their unfinished session.
- `app/session.js` already has `snapshot()` (ticks carried over a swap read it through `from`). It gains
  `createSession(program, day, { EX, saved })`, taking a stored snapshot instead of a live session.
- Files: `app/session.js`, `tests/session.test.js`, `app/day.js`, `app/main.js`, `tests-ui/resume.spec.js`.
- **Test first:** tick sets in two blocks and an AMRAP counter, snapshot, restore into a new session: same state, and
  the next instruction is the same.
- **Done when:** tick 3 sets on the phone, close the tab, reopen the day: the 3 sets are ticked.

### 2. Random workout (#64)
- **Sheet** from a "Random workout" button on the Programs page: family (or one subject), 15 / 25 / 35 min,
  equipment (all / kettlebell / none). **Preview** the day, **Reshuffle** (new seed), **Start**.
- **Built fresh:** `recipes.pick` + `buildDay` with a fresh memory, at the **level of the last day marked done**
  (in any program, or Level I if none) with that level's lever.
- **Stored** as a record `{ id, time, day, choices }` with the day inside (`users/{uid}/random/{id}`, device copy),
  and in export/import and the nightly backup (review III ticket 5). Not in any program's progress.
- **Stats:** random workouts count in "All programs" and have their own scope, "Random workouts". `dayOf` reads
  the day from the record.
- **Swaps:** today-only swaps work (stored in the record). No "rest of the program".
- Files: `app/random.js` (pure: choices + level + seed → day), `tests/random.test.js`, `app/stats.js`,
  `app/store.js`, `app/views.js`, `app/main.js`, `tests-ui/random.spec.js`, `CONTEXT.md`.
- **Test first:** the level rule (last done day's level; none → I); a 25-min kettlebell Strength day lands in range
  and uses kettlebell exercises only; a done random workout adds to the week's minutes but no program's count.
- **Done when:** on the phone, start a random Cardio & combat 15-min workout, mark it done: Stats' week goes up,
  no program changes; it syncs. (Built 30 Sep: Cardio & combat has no 15-minute days in the recipe book, so the check
  uses 25 minutes, and 15 is greyed out there with the reason; 15 works for Mind & body.)

### 3. Rest-day flow (#67.9)
- When nothing has been marked done today, the Programs page shows a small card: "Rest day? A 10-minute mobility
  flow". It opens the random workout's preview with Mind & body, mobility & posture or flexibility, 10 minutes,
  no equipment. Dismissible for the day.
- **Test first:** the card's rule (nothing done today → shown; one day done today → hidden).
- **Built 30 Sep:** 15 minutes, not 10: the recipe book makes nothing shorter (ROADMAP).

### 4. Shorter today (#67.3)
- A "Short on time" switch on the day page trims the day to about 20 minutes: `trim(day, target)` in the builder
  drops optional exercises and a set with the same fit search (review III ticket 4). For today only; the day is
  still marked done as the program's day, with stats counting what was trimmed to.
- Stored in the program's progress as `short: { day: true }` (Program Progress gains the field; `fromDoc` reads a
  document without it as none), so it syncs and is in backups.
- **Test first:** `trim` of a 35-min straight-set day gives 18–22 min and keeps every block's first exercise.

### 5. Travel mode (#67.2)
- Settings: **Travel mode** with "No bar", "Kettlebell only", "Bodyweight only". On **until turned off** (Noam).
  Synced in `prefs` (review III ticket 5).
- While on, every day page applies automatic today-only swaps for exercises that need missing gear, using the
  existing `alternatives` rules; the card says "Swapped for travel". A banner on the day page says travel mode is on.
- **Test first:** with "Bodyweight only", a Three-Split 60 day has no exercise needing dumbbells, kettlebell or bar,
  and each swapped exercise works the same first main muscle.

### 6. Warm-up that matches the format (#67.8)
- Boxing, kickboxing, HIIT and plyometrics days get a **dynamic** warm-up (jumping jacks, high knees, shadow
  footwork, arm circles); yoga, Pilates, flexibility and mobility days a **gentle** one (cat-cow, breathing,
  easy twists).
- **Pins:** the stored days keep their warm-ups (they're hashed). The Day module picks the warm-up to show at open
  time: `warmupFor(day)` from `formats` (review III ticket 3) + muscles. Stats already don't count warm-ups as
  workout minutes, and stretching minutes stay the day's stored value.
- **Test first:** `warmupFor` on a boxing day contains only dynamic warm-ups; a straight-set day's warm-up is
  unchanged.

### 7. Big timer (#67.10)
- In a timed block (flow, bouts, EMOM, Tabata, AMRAP, ladder) a **Big timer** button fills the screen with the
  clock, the current pose or combo name, and what's next. Tap to leave. Keeps the wake lock.
- **Test first:** a UI test: start a flow, open the big timer, the time counts down and the pose name changes.

### 8. What next (#67.7)
- When the last day of a program is marked done, the finish card offers **Start Round 2** and two or three
  programs from the same family that train differently (different subject or formats, not started yet).
- **Test first:** `suggestNext(pid, summaries, progress)` never suggests the same program or one with progress, and
  prefers a different subject.

## Challenge round
- **Weakest assumption:** that a random workout's "level of the last day done" is clear. With Round 2, the last
  day done might be day 3 (Level I) after a finished Round 1. The rule is the **level of the day**, as Noam said,
  so it's Level I then. Written as a test.
- **What I hadn't read:** stats' `dayOf(pid, day, round)` assumes a program. Random workouts need `dayOf('random',
  id)` to read the record's day. Ticket 2 adds it and a stats test.
- **The lazier version:** tickets 1, 2 and 5. The rest are small and independent, so they can wait.

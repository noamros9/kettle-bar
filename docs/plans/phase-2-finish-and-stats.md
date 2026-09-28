# Phase 2: finish screen and stats

Source of truth for Phase 2. Decisions come from two grilling rounds with Noam (the roadmap session and
28 Sep 2026). Glossary: [CONTEXT.md](../../CONTEXT.md). Why stats count planned work:
[ADR 2](../adr/0002-stats-count-planned-volume.md).

## What we're building

**Finish screen.** When every set of a day is ticked (after the cool-down if you run it), a finish card
replaces today's "All sets finished" box:
- what you did: sets / rounds done, workout minutes and stretching minutes (shown separately);
- a heat map of the muscles worked today;
- this week so far: workouts and minutes;
- a preview of the next workout;
- one tap: **Mark as done**.

**Stats page.** A **Stats** tab in the header, next to Programs and Exercises.
- **Scope:** all programs together, or one program.
- **Time span:** this week, last 4 weeks, this program since you started it, all time.
- **Numbers:** workouts; workout minutes and stretching minutes, shown separately; sets and reps.
- **Per week:** the same numbers week by week for the longer spans. Weeks start on **Sunday**.
- **Muscle balance:** front/back heat map, darker = more work, plus a ranked bar list of muscles.

## Rules (decided)

| Question | Decision |
|---|---|
| What counts | The **planned** work of each day marked done ([ADR 2](../adr/0002-stats-count-planned-volume.md)). No per-set logging. |
| When a workout happened | The time the day was first marked done (already stored; merge and import keep the earliest). |
| Minutes | Workout minutes = the day's estimate. Stretching minutes = warm-up + cool-down. Both count, **shown separately**. |
| Muscle load | Each set counts **1 for every main muscle, ½ for every secondary muscle**. |
| Timed blocks | Converted to sets: **EMOM** 1 set per minute (with its reps); **Tabata** 1 set per 20 s round, no reps; **AMRAP / ladder** 1 set per exercise per 2 minutes, no reps. |
| Holds | 1 set each; they add seconds, not reps. |
| Stretches | Count in stretching minutes, not in sets, reps or the muscle map. |
| Where Stats lives | Header tab; the header must still fit a 390 px phone with no sideways scroll. |
| Repeating a program (#17) | Not in this phase. Stats read done days through one function, so repeats can plug in later. |

## Modules

- **`app/stats.js`** (new, pure, in the 100% coverage gate). It turns programs and done days into numbers.
  - `dayVolume(day, EX)` returns `{ workoutMin, stretchMin, sets, reps, muscles: { muscle: load } }`.
  - `weekStart(date)` returns the Sunday 00:00 local time that starts the date's week.
  - `summarize(entries, span)`: entries are `{ pid, day, time }` from the Progress Store. Returns totals,
    per-week rows and muscle loads for the span.
- **Figure engine**: `muscleMapSVG` also accepts **loads** (`{ muscle: number }`) and shades each muscle in
  4 steps. The current primary/secondary call keeps working for exercise pages.
- **Views**: the finish card on the day page; a `#stats` route with scope and span switches.
- **Progress Store**: no change. It already returns `days(pid)` with times.

## Tickets

One ticket = one branch = one PR, taken in order. Each starts with its **Test first** through `/tdd`.

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-2-stats` | done (PR #19) |
| 1 | Day volume + finish card (numbers, Mark as done) | feature | 0 | `feature/finish-card` | done (PR #20) |
| 2 | Shaded muscle map + today's heat map on the finish card | feature | 1 | `feature/muscle-heat-map` | done (PR #21) |
| 3 | Finish card: this week so far + next workout | feature | 1 | `feature/finish-week-next` | done (PR #22) |
| 4 | Stats tab: this week, all programs | feature | 1 | `feature/stats-page` | todo |
| 5 | Stats: time spans + scope switch + per-week rows | feature | 4 | `feature/stats-spans` | todo |
| 6 | Stats: muscle balance (heat map + ranked bars) | feature | 2, 5 | `feature/stats-muscles` | todo |

### 1. Day volume + finish card
Files: `app/stats.js`, `tests/stats.test.js`, `app/views.js`, `app/styles.css`, `build.js`, `package.json` (coverage include), `tests-ui/workout.spec.js`.
- **Test first:** `dayVolume` on a hand-made day with straight sets, a superset, a circuit and a hold: sets, reps, workout minutes and stretching minutes as the rules table says.
- **Done when:** ticking the last set of a Three-Split 60 day shows the finish card with sets, workout and stretching minutes, and **Mark as done**. It works in a phone UI test, light and dark, and the screenshots have been looked at.

### 2. Shaded muscle map + today's heat map
Files: `figures.js`, `tests/figures.test.js`, `app/stats.js` (muscle loads), `app/views.js`.
- **Test first:** `muscleMapSVG` with loads `{ chest: 4, triceps: 1 }` draws chest at the darkest step, triceps at a light step and the rest plain. Also `dayVolume().muscles` counts main 1, secondary ½ per set, with timed blocks converted.
- **Done when:** the finish card shows today's heat map, and exercise pages look exactly as before (their SVG is unchanged byte for byte).

### 3. Finish card: this week + next workout
Files: `app/stats.js`, `tests/stats.test.js`, `app/views.js`.
- **Test first:** `weekStart` for a Saturday night and a Sunday morning (weeks start Sunday, local time), and `summarize` for "this week".
- **Done when:** the finish card shows this week's workouts and minutes (today included once marked done) and the next workout's name, focus and time, linking to it.

### 4. Stats tab: this week, all programs
Files: `app/shell.html`, `app/views.js`, `app/styles.css`, `tests-ui/stats.spec.js`, `tests-ui/renders.spec.js`.
- **Test first:** a UI test that ticks two days, opens **Stats**, and sees 2 workouts with their summed minutes, sets and reps.
- **Done when:** the Stats tab fits the phone header in light and dark with no sideways scroll, and an empty state reads well.

### 5. Time spans + scope + per-week rows
Files: `app/stats.js`, `tests/stats.test.js`, `app/views.js`, `tests-ui/stats.spec.js`.
- **Test first:** `summarize` over entries spread across 6 weeks and 2 programs, for each span and scope, including per-week rows with empty weeks.
- **Done when:** switching span and program changes the numbers and the per-week rows; checked on the phone in both themes.

### 6. Muscle balance
Files: `app/stats.js`, `app/views.js`, `app/styles.css`, `tests-ui/stats.spec.js`.
- **Test first:** `summarize().muscles` sorted by load, and the ranked-bar markup listing muscles by name (from `MUSCLE_NAMES`).
- **Done when:** the heat map and ranked bars follow the span and scope, and are readable in both themes.

## Out of scope
Repeating a program (#17), summaries (#18), per-set logging, streaks and targets (decided against).

## Challenge round
- **Weakest assumption:** that the time a day was first marked done is when the workout happened. I checked it in `app/store.js`: `toggle` stamps `now()`; first sync and import keep the earliest time. A day ticked late lands in the wrong week. Accepted: the alternative is logging dates, which Noam turned down.
- **What I hadn't read:** whether every generated day has the numbers the stats need. I built all 29 programs and checked: every day has `est`, `warmup.seconds` and `cooldown.seconds`, including frozen Three-Split 60. The block mix is 2,920 straight, 360 circuit, 270 EMOM, 260 superset, 180 AMRAP, 150 ladder and 90 Tabata. Timed blocks are about a fifth of all blocks, which is why the timed-block rule mattered. Plan change: none; the rule table was already written.
- **The lazier version:** only the finish card, without a Stats page. Not proposed, because Noam asked for the stats explicitly and chose all four time spans. The tickets are ordered so that version (tickets 1–3) ships first and works on its own.

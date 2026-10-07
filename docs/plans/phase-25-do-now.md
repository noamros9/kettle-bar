# Phase 25: "Do now", one exercise for dead time

Issue [#200](https://github.com/noamros9/kettle-bar/issues/200). Grilled 7 Oct 2026 (Noam); decisions 142–145 in
[ROADMAP.md](../../ROADMAP.md). After Phase 24 (134).

## Decisions
Grilled 7 Oct 2026 with Noam (global decision numbers).
- **142 · A card on the Programs page and a home-screen shortcut** (`#now`).
- **174 · The shortcut opens the card**; nothing is picked until a tap.
- **143 · Two buttons each time: Random and What I missed** (least-loaded muscle). No equipment, quiet (no jumping,
  nothing on the floor), 20–30 s. **174 ·** What I missed looks back 7 days.
- **144 · Timed and counted** in Stats and History.
- **180 · A beep at the end, no voice.**
- **181 · Not a trained day**: the rest-day card, Today's workout and the next random workout's level stay as they
  were; History gives it its own small mark.
- **145 · Stored as a random workout** (`choice: { now }`): no new collection, no rules change, backups already carry
  it. *(technical)*

## What lands
- **A "Do now" card on the Programs page** (142), under the rest-day card, with two buttons (143): **Random** and
  **What I missed**. Either hands you one exercise at `#now`: its drawing, cue and a 20–30 s timer (144).
- **A home-screen shortcut** "Do now" (142): long-press the icon, it opens `#now` with both buttons; nothing is picked
  until a tap (174).
- **The pool** (143): no equipment, quiet (no jumping, nothing on the floor), doable in work clothes: a hand-picked
  list in `app/now.js`, checked by a test. **What I missed** picks from the exercises whose first main muscle had the
  least load in the last 7 days (Stats' muscle load over done days, random workouts and Do nows).
- **Counted** (144, 145): **Done** writes a record in `users/{uid}/random/{id}`: `{ name, choice: { now: mode }, seed,
  level, day, time }`, a one-block day of one exercise. Stats and History count it under Random workouts, named "Do
  now". No rules change, and backups already carry the `random` collection.

## How the later decisions land in the tickets
- **A beep at the end, no voice** (180): get-ready silent, one beep when the time is up.
- **Not a trained day** (181): a Do now leaves the rest-day card, Today's workout and the next random workout's level
  as they were; History shows it with its own small mark. Ticket 2's spec checks all three.
- **What I missed looks back 7 days; the shortcut opens the card** with both buttons (174).

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/unplanned-phases` | done (PR #281) |
| 1 | The pool and the pick (`app/now.js`) | feature | – | `feature/do-now-pick` | todo |
| 2 | The page, the card, the shortcut, Done | feature | 1 | `feature/do-now-page` | todo |
| 3 | Close the phase: CONTEXT.md, archive | plan | 2 | `plan/p25-close` | todo |

### 1. The pool and the pick
- **Build:** `app/now.js` (pure, Node and page, `KBNow`): `POOL` (about 40 exercise ids: standing or seated, no
  equipment, no jumps: wall sits, calf raises, squats and split-squat holds, standing hip circles, glute squeezes,
  chair dips, desk push-ups, shoulder and neck work, standing core bracing, isometric presses); `pick(cat, { mode,
  loads, seed, recent })` returns `{ ex, seconds, level }`: seconds 20–30 (a hold's own, else reps at about 2 s each,
  rounded into the window), Random by the seed, What I missed by the lowest-load first main muscle with ties broken
  by the seed, never the last 3 Do nows (`recent`). `loads(entries, dayOf, EX, now)` sums the muscle load of the last
  7 days, reusing `app/stats.js`'s load rule (no second copy of it).
- **Files:** `app/now.js`, `tests/now.test.js`, `app/stats.js` (export the load helper if it isn't), `build.js` (the
  script in the page), `scripts/ui-affected.js` (MAP line).
- **Test first:** every `POOL` id exists, is `bw`, has no pose with `mat`, isn't `cardio` or plyometric (no
  `explosive`/`jump` in id or cue), isn't `couple`; `pick` is deterministic by seed, stays in 20–30 s, never returns
  one of `recent`, and What I missed returns an exercise of the least-loaded muscle in a made-up week.
- **Done when:** 100% lines and functions on `app/now.js`.

### 2. The page, the card, the shortcut, Done
- **Build:** `app/pages/now.js` renders `#now` (`#now/missed` for the other mode): the exercise card as the exercise
  page draws it, a big Start that runs one hold through the Clock (3 s get-ready, the timer, one beep), **Another**
  (a new seed), **Done** (writes the record through `app/random.js`'s record path with `choice.now`, then back to
  Programs). The Programs page gets the card with the two buttons. `manifest.webmanifest` gets the shortcut
  (`./#now`). Stats name a record with `choice.now` "Do now" and give it no program day.
- **Files:** `app/pages/now.js`, `app/pages/programs.js`, `app/main.js` (route), `app/random.js` (record a Do now),
  `app/stats.js` (name), `manifest.webmanifest`, `app/styles.css`, `sw.js` (the new script in the cache list),
  `tests-ui/now.spec.js`, `tests/random.test.js`, `tests/stats.test.js`, `scripts/ui-affected.js`.
- **Test first:** `now.spec.js`: the card shows both buttons; Random opens `#now` with one exercise; Start runs the
  timer to the end; Done adds a day to History and a "Do now" line to Stats; the shortcut URL opens `#now` with both buttons and no exercise yet.
  `random.test.js`: a Do now record round-trips through backup export and import.
- **Done when:** 390 px screenshots light and dark of the card and `#now`; no sideways scroll at 360 px; the PR's CI
  green.

## Challenge round
- **Weakest assumption: that a random-workout record can hold a Do now without breaking old readers.** Stats, the
  History calendar, backup diff and the level of the last done day (`random.levelOf`) all read `random` records.
  A Do now must not set the level of the next random workout (it isn't a workout). **Plan edit:** ticket 2's test
  checks `levelOf` skips `choice.now` records, and History shows them with their own small mark, not as a workout.
- **What I hadn't read:** whether the exercise catalogue marks standing vs floor beyond `mat` on poses, and how the
  Clock runs a lone hold outside a Workout Session. Ticket 1 reads `exercises.js`'s pose fields first; ticket 2 reads
  `app/clock.js` and may need a one-phase plan helper from `app/session.js`.
- **The lazier version:** no record at all (a nudge, not counted). Not proposed: Noam chose counted (144).
  Another: Random only, no What I missed. Not proposed: he wanted both each time (143).

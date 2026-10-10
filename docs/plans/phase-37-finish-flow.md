# Phase 37: the finish flow, a breather and then the cool-down

Issue [#356](https://github.com/noamros9/kettle-bar/issues/356). Grilled 10 Oct 2026 (Noam); decisions 319–320 below.
Right after Phase 23 (319). Claude plans; Noam picks Grok tickets at hand-off.

## Decisions
Grilled 10 Oct 2026 with Noam (global decision numbers).
- **319 · Its own small phase, right after Phase 23** (#356). *(10 Oct)*
- **320 · Breather, then the cool-down, nothing after it**: the last set starts a 30 s breather by itself, then the
  cool-down flow starts; when it ends nothing waits (no 30 s on the timer); a day without a cool-down ends at
  "Workout finished". *(10 Oct)*

## What lands
Today the last set leaves the rest timer reset to 30 s, waiting for a tap, and the cool-down waits for its
"▶ Start cool-down" button; after the cool-down the timer shows 30 s again. After this phase the end of a workout runs
by itself: last set, breather, cool-down, done.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/p37-and-p35-subjects` | done (PR #366) |
| 1 | Breather, then the cool-down, nothing after it (320) | feature | – | `feature/finish-flow` | todo |
| 2 | Close the phase | plan | 1 | `plan/p37-close` | todo |

### 1. Breather, then the cool-down (320)
- **Build:** `app/session.js`: on a day with a cool-down not yet run, the last block's `afterBlock` returns a rest
  of 30 s ("Breather · cool-down next", the first pose as its line) that carries `then: 'cool'`; without one it stays
  `{ clear: 'Workout finished' }`. `app/clock.js`: when a rest with `then` runs out, the clock starts that stretch the
  way the "▶ Start cool-down" button does (`app/main.js`'s `runPlanned`), the voice naming it. Finishing the
  cool-down shows "Workout complete" with nothing armed: no 30 s on the timer. A cool-down already run, run again from
  its button, works as today.
- **Files:** `app/session.js`, `app/clock.js`, `app/main.js`, `tests/session.test.js`, `tests-ui/finish.spec.js`.
- **Test first:** `tests/session.test.js`: the last set of a day with a cool-down gives a 30 s rest with
  `then: 'cool'`; without a cool-down it gives "Workout finished"; the cool stretch's completion is a clear with
  nothing armed. `tests-ui/finish.spec.js`: tick the last set, the clock (installed) runs 30 s, the cool-down's first
  pose shows by itself, and at its end the timer reads "Workout complete", not 30 s.
- **Done when:** the tests pass; a 390 px screenshot of the breather and of the finished timer, light and dark;
  the PR's CI green.

### 2. Close the phase
- **Build:** the row leaves ROADMAP.md, decisions 319–320 move to `docs/roadmap-archive.md` with a link here,
  #356 closed by ticket 1's PR.

## Challenge round
- **Weakest assumption:** that you always want the cool-down. On a rushed day the breather screen may need a way out;
  ticking the last set and closing the app still ends the day, but a "Done for today" on the breather is the
  question to ask if it bites.
- **What I haven't read:** how the clock's queue runs a flow's phases (`flowPhases`); starting a flow from a rest's
  end may need the queue filled the way the button fills it.
- **The lazier version:** no breather, the cool-down starts the moment the last set is ticked (Noam picked the
  breather).
- **Local UI runs:** the phone test server builds the whole library first, which no longer fits this machine (312);
  the spec's local run may have to be skipped and read from the PR's CI.

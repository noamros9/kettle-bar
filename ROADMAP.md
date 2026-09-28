# Kettle & Bar roadmap

Built from a grilling session with Noam on 28 Sep 2026. Decisions are recorded under each item so
future work doesn't re-ask them. Order within a phase is the build order.

## Done
- 29 programs (5 signature + 24 across 8 subjects), formats, stretches, exercise pages with muscle maps.
- Architecture review findings 1–5: Workout Session, Progress Store, Program Builder, Exercise Catalogue /
  Figure engine, app split into modules. 23 tests (`npm test`).

## Backlog
- **Test a restore from the nightly backup** on the phone ([#16](https://github.com/noamros9/kettle-bar/issues/16)).
- **Do a program again, keeping its history** ([#17](https://github.com/noamros9/kettle-bar/issues/17)): back to day 1 of 60 as a
  second (third…) time through; earlier times stay in the stats. Details to decide together; plan with or after Phase 2.
- **Short summaries** ([#18](https://github.com/noamros9/kettle-bar/issues/18)): a paragraph describing each program and two lines
  describing each workout. Where they show and how they're written to decide together.

## Phase 1: a safety net (done, Sep 2026)
Planned in the PRD [#7](https://github.com/noamros9/kettle-bar/issues/7); glossary in [CONTEXT.md](CONTEXT.md), decisions in
[docs/adr/](docs/adr/). Slices, in build order:
1. Retire the claude.ai build (#8).
2. Deploy from GitHub Actions only when unit tests pass, 100% coverage on core modules (#9); pre-commit hook (#10).
3. Phone UI tests in light and dark: every program and day renders (#11); workout flows with a fast clock (#12).
4. Settings page with Export (#13); Import showing the diff, then merge or replace, asked each time (#14).
5. Nightly backup to a private `kettle-bar-backup` repo, history kept forever; restore = import (#15).

Dropped: smaller download (Noam: "leave it"); desktop UI tests (phone only).

## Phase 2: finish screen + stats (done, Sep 2026)
Plan and tickets: [docs/plans/phase-2-finish-and-stats.md](docs/plans/phase-2-finish-and-stats.md).
Built together because they share the muscle heat map and the week numbers.

4. **Finish screen**, shown after the cool-down (or after the last set if you skip it), with one-tap "Mark as done":
   - total time and sets/rounds done,
   - heat map of the muscles worked today,
   - this week so far (workouts, minutes),
   - preview of the next workout.
5. **Stats page**
   - **Scope switch:** all programs together, or one program.
   - **Time spans:** this week, last 4 weeks, per program (since you started it), all time.
   - **Weekly numbers:** workouts and minutes; sets and reps.
   - **Muscle balance:** body heat map (front/back, darker = more work) and a ranked bar chart, for any time span.
   - Weeks start on **Sunday**.
   - **Decision:** volume is the *planned* volume of days marked done (a done day counts its planned sets and reps).
     No per-set logging. Minutes include stretching, shown separately; muscles weighted by sets (main 1,
     secondary ½); timed blocks converted to sets; Stats is a header tab.

## Phase 3: workout helpers
Plan and tickets: [docs/plans/phase-3-workout-helpers.md](docs/plans/phase-3-workout-helpers.md). Swaps apply from that
day on ("rest of the program"), with the new exercise's own reps; voice speaks in the workout and the
stretches, on by default with a Settings switch.
6. **Swap an exercise**: offer alternatives that work the same main muscles with the program's equipment. Each
   time, ask whether the swap is **for today only or for the rest of the program**. Swaps sync like progress.
7. **Voice cues** for holds and sides only: "switch sides", "halfway", and the end of a hold. Uses the phone's
   built-in speech; the beeps stay.
8. **Animated drawings** on **exercise pages only** (option A): the big drawing on each exercise's page loops
   smoothly between its positions; workout cards stay still. Respects the phone's reduce-motion setting.
   ([demo](https://claude.ai/artifact/NFGzGANtut6b1j5WkULFrj))

## Phase 4: convenience
9. **Home-screen shortcut to today's workout** (a manifest shortcut that opens the next undone day of the
   current program).
10. **Build your own program in the app**: pick subject, length, equipment and split; the Program Builder
    generates a 60-day program, saved to your account.

## Decided against (don't re-suggest)
- **Logging weights/reps per set**: Noam wants done / not done only.
- **Adaptive plans**: no test days, no too-easy/too-hard nudging, no deload suggestions. Plans stay as written.
- **Calendar/streaks, consistency targets, program-progress stats, push/pull ratios, neglected-muscle alerts**:
  not picked.
- **Voice countdowns, "what's next" and encouragement**: holds and sides only.
- **Hebrew version** and **share as image**: not wanted for now.
- **Animating workout cards** (every card, current exercise only, tap to play): exercise pages only.
- **Heart-rate / Google Fit**: limited from a web app; revisit only if the app goes native.

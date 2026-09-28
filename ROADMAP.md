# Kettle & Bar roadmap

Built from a grilling session with Noam on 28 Sep 2026. Decisions are recorded under each item so
future work doesn't re-ask them. Order within a phase is the build order.

## Done
- 29 programs (5 signature + 24 across 8 subjects), formats, stretches, exercise pages with muscle maps.
- Architecture review findings 1–5: Workout Session, Progress Store, Program Builder, Exercise Catalogue /
  Figure engine, app split into modules. 23 tests (`npm test`).

## Backlog
- **Test a restore from the nightly backup** on the phone ([#16](https://github.com/noamros9/kettle-bar/issues/16)).

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

## Phase 3: workout helpers (done, Sep 2026)
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

## Phase 4: foundations and convenience (done, Sep 2026)
Grilled with Noam on 28 Sep 2026 (second round). Build order as listed.
Plan and tickets: [docs/plans/phase-4-foundations.md](docs/plans/phase-4-foundations.md).

9. **Summaries** ([#18](https://github.com/noamros9/kettle-bar/issues/18)):
   - **Program:** a paragraph per program, **written by hand**: what it trains, how it's built, how it gets
     harder, who it suits. It replaces the one-line blurb on the **program page**; **program cards** show
     its first sentence.
   - **Day:** two lines per day, **generated** from its focus, formats, level and changes, shown on the
     **day page** under the workout's name. Not on the day tiles.
10. **Home-screen shortcut to today's workout:** a manifest shortcut that opens the next undone day of the
    **program you opened last**. Nothing to set.
11. **Load programs when opened, fully offline:** the app starts with the program list, and each program's
    days load the first time you open it. **All programs then download quietly in the background, on any
    network**, so every program works offline. Needed before the library grows to ~98 programs (~5 MB in
    one file).
12. **Do a program again: rounds** ([#17](https://github.com/noamros9/kettle-bar/issues/17)):
    - **Starting over:** you can start again **any time**, back to day 1 of 60. The unfinished round is kept
      as it was. Rounds are called **"Round 2", "Round 3"…**, e.g. "Iron PPL · Round 2 · Day 1 of 60".
    - **The plan:** the **same** 60 days every round (plans stay as written; not harder).
    - **Swaps:** starting a round **shows each rest-of-program swap, and you keep it or go back to the
      original**, one by one.
    - **Stats:** count all rounds by default. The program switch can **narrow to one round**.

## Phase 5: a bigger catalogue and library ([#33](https://github.com/noamros9/kettle-bar/issues/33))
13. **New subjects, 5 programs each** (45 programs): **boxing** and **kickboxing** (no equipment),
    **Pilates** (mat), **yoga**, **HIIT**, **plyometrics**, **flexibility**, **mobility & posture**,
    **balance & stability**.
    - **Yoga and Pilates** keep the usual shape: 60 numbered days, ~25–35 min, held poses and flows on the
      clock with holds, sides and voice cues. No abs finisher, since the session is core work already.
    - **Boxing and kickboxing** get a new **rounds** format: 3-minute rounds, 1-minute rests, and the voice
      calls the combos ("jab, cross, hook").
14. **More variety in every existing subject:** strength, core & abs, pull-ups / upper body, legs,
    conditioning. **Up to 6 programs each** (+24 programs), so the library goes from 29 to about 98 programs.
15. **Exercise catalogue: a big push, 100+ new exercises.** Each gets drawings, muscles, cues and reps per
    level: punch and kick combos, footwork, Pilates series, yoga poses, plyo jumps, mobility drills,
    balance work, and more strength and core variety (which also means more swap choices).

## Phase 6: build your own program
16. **Build your own:** you pick the subject(s), split (days per cycle), minutes, equipment, formats and how
    it gets harder. The Program Builder makes 60 days, and you can regenerate until you like it. Comes after
    Phase 5, so it can use the bigger catalogue.
    - **Afterwards:** rename and delete (deleting asks first; its progress goes too). Edit the choices: days
      not done yet are rebuilt, done days keep what you did. Synced to your account and included in
      export/import and the nightly backup.
    - **Share a copy by link:** the link carries the choices, and whoever opens it gets "Add this
      program". No server needed.

## Decided against (don't re-suggest)
- **Logging weights/reps per set**: Noam wants done / not done only.
- **Adaptive plans**: no test days, no too-easy/too-hard nudging, no deload suggestions. Plans stay as written.
- **Calendar/streaks, consistency targets, program-progress stats, push/pull ratios, neglected-muscle alerts**:
  not picked.
- **Voice countdowns, "what's next" and encouragement**: holds and sides only.
- **Hebrew version** and **share as image**: not wanted for now.
- **Animating workout cards** (every card, current exercise only, tap to play): exercise pages only.
- **Heart-rate / Google Fit**: limited from a web app; revisit only if the app goes native.

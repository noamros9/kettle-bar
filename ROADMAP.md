# Kettle & Bar roadmap

Built from a grilling session with Noam on 28 Sep 2026. Decisions are recorded under each item so
future work doesn't re-ask them. Order within a phase is the build order.

## Done
- 29 programs (5 signature + 24 across 8 subjects), formats, stretches, exercise pages with muscle maps.
- Architecture review findings 1–5: Workout Session, Progress Store, Program Builder, Exercise Catalogue /
  Figure engine, app split into modules. 23 tests (`npm test`).

## Backlog
- **Test a restore from the nightly backup** on the phone ([#16](https://github.com/noamros9/kettle-bar/issues/16)).
- **Faster phone UI tests (1 Oct 2026):** locally only the affected specs run (`npm run test:ui:affected`), the full
  suite in CI on the PR. The two-browser helper (`tests-ui/devices.js`) batches its calls (1 Oct): the sync tests run
  ~35% faster (sync 22 → 13 s, build 23 → 14 s, random 24 → 18 s); the build one had flaked on a busy runner. More workers don't help on 2 cores (4 workers: 4.4 min and timeouts). CI (1 Oct): the test job runs in
  Playwright's image (installing the browser took 6–20+ min of apt-get), a newer push to a PR cancels the older run,
  and a commit of Markdown only skips the pre-commit tests.
- **Workout history with a calendar** ([#113](https://github.com/noamros9/kettle-bar/issues/113)): planned as Phase 9.

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

## Phase 5: a bigger catalogue and library (done, Sep 2026, [#33](https://github.com/noamros9/kettle-bar/issues/33))
Plan and tickets: [docs/plans/phase-5-catalogue-and-library.md](docs/plans/phase-5-catalogue-and-library.md).
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

## Architecture review III (done, Sep 2026)
Plan and tickets: [docs/plans/architecture-review-3.md](docs/plans/architecture-review-3.md) ([#63](https://github.com/noamros9/kettle-bar/issues/63)).
Grilled with Noam on 29 Sep 2026: the review comes first, then Phases 6, 7 and 8 in that order.
- Deepenings: library filters as one module, configs per family, formats in one place, one day from a recipe
  (levers and abs per day type), account data beyond progress, catalogue sources, a leaner phone UI suite.
- **Programs page ([#68](https://github.com/noamros9/kettle-bar/issues/68)), option A:** families as underline tabs,
  subjects as chips with counts, length on one quiet line; the counter follows the selection. Built alongside
  the rest of the review.

## Phase 6: build your own program, and mixed programs (done, Sep 2026)
Plan and tickets: [docs/plans/phase-6-build-your-own.md](docs/plans/phase-6-build-your-own.md).
16. **Build your own:** you pick the subject(s), split (days per cycle), minutes, equipment, formats and how
    it gets harder. The Program Builder makes 60 days, and you can regenerate until you like it. Comes after
    Phase 5, so it can use the bigger catalogue.
    - **Afterwards:** rename and delete (deleting asks first; its progress goes too). Edit the choices: days
      not done yet are rebuilt, done days keep what you did. Synced to your account and included in
      export/import and the nightly backup.
    - **Share a copy by link:** the link carries the choices, and whoever opens it gets "Add this
      program". No server needed.
      - **Built (30 Sep):** the link carries the program's **config and id** too, not only the choices: the days are
        built from the config alone (as a stored program's are, whatever recipe book the other browser has), and the
        builder draws the exercises from the program's id, so the copy is added under the same id. Days you did
        (frozen days) stay yours; the link carries the program as it is made now. **Share** opens the phone's share
        sheet where there is one, else copies the link. A link made by a newer app, or damaged, or carrying anything the
        recipes don't make (markup, other fields) is refused with a message.
    - **Where (29 Sep):** your programs get their own shelf at the top of the Programs page.
17. **Mixed programs ([#65](https://github.com/noamros9/kettle-bar/issues/65), 29 Sep):** both a "mix" choice in
    build your own (2–3 subjects) and **about 30 hand-made mixed programs** in a new **Mixed** family (5 subjects × 6).
    **Mixed days**: one day holds blocks from more than one family (a strength block, then a short flow), each
    getting harder in its own way.

    - **Signature variations (29 Sep):** two per signature program, Tempo and Harder moves, same split; on the Signature shelf after the original.

## Phase 7: day to day (done, Sep 2026)
Plan and tickets: [docs/plans/phase-7-day-to-day.md](docs/plans/phase-7-day-to-day.md). Decided 29 Sep 2026.
18. **Random workout ([#64](https://github.com/noamros9/kettle-bar/issues/64)):** counts in stats, not in program
    progress; its level follows the last day marked done. Chosen on a sheet (family or subject, 15/25/35 min,
    equipment) with reshuffle, built fresh, from a button on the Programs page.
    - **Built (30 Sep):** the recipe book has 15-minute days only in **Mind & body**; for Strength, Cardio & combat
      and Mixed, 15 is greyed out with the reason (they start at 20), as build your own greys out what can't be made.
      An unfinished random workout stays on the device (resumes like a program day, **Discard** to drop it) and is
      written to the account only when marked done. A program day's level comes from its day number (1–20, 21–40,
      41–60).
    - **Rest-day flow, built (30 Sep):** **15 minutes**, not 10: the recipe book makes nothing shorter. On a day with
      nothing marked done (the phone's own date), a card on the Programs page opens the random workout's sheet with
      Mobility & posture or Flexibility, 15 min, no equipment. **Not today** hides it until tomorrow, on that device.
    - **Shorter today, built (30 Sep):** "Short on time?" on a day page trims it to about 20 min (fewer sets, rounds or
      minutes, the last exercises of a block dropped, never its first); tapping again brings the full day back.
      Stored as `short: { day: true }` in the program's progress, **only when a day has been shortened**, so every
      document, device copy and backup from before keeps its exact shape (backup format stays version 2; `short` is
      an optional section). A round keeps its own short days when the next one starts.
    - **Travel mode, built (30 Sep):** Settings → Travel mode (Off / No bar / Kettlebell only / Bodyweight only), in
      the synced `prefs`. The day page swaps what needs missing gear (same first main muscle and kind of work when it
      can, else either kind, else another of its main muscles) and says so; Stats keep counting the planned day.
      **Found:** the catalogue has **no bodyweight pulling** (rows, curls, raises, pull-ups), so in "Bodyweight only"
      those stay, marked "Needs gear" on the card. Adding a few (towel or doorframe rows, bodyweight curls) would
      close the gap; not planned yet.
    - **Warm-up that matches the format, built (30 Sep):** picked when a day opens (stored days keep theirs, same
      length): Boxing, Kickboxing, HIIT and Plyometrics programs get a dynamic warm-up (a combat day starts with
      shadowboxing footwork), Yoga, Pilates, Flexibility and Mobility & posture a gentle one; your own programs and
      random workouts go by their moves. Strength and mixed days keep theirs.
19. **From the ideas list ([#67](https://github.com/noamros9/kettle-bar/issues/67)):** **resume a workout** (ticks kept on the device per day, so closing the app or opening another day
    loses nothing; Noam, 29 Sep) after closing
    the app; travel mode (lasts until turned off); shorter today; a warm-up that matches the format; a rest-day
    mobility flow; a big timer; "what next" when a program ends.

## Phase 8: finding things, and stats (done, Oct 2026; 20b moved to Phase 9)
Plan and tickets: [docs/plans/phase-8-finding-and-stats.md](docs/plans/phase-8-finding-and-stats.md). Decided 29 Sep 2026.
20. **Finding things (#67):** favourite programs and hidden subjects (synced), an equipment filter on the Programs
    page, search and filters on the Exercises page.
    - **Favourites and hidden subjects, built (1 Oct):** the Favourites shelf lists starred programs in library order and
      ignores the filters; a starred program also stays on its subject's shelf. A starred program whose subject is
      hidden **stays in Favourites** (the star is the more specific choice). Hiding the subject or family that's picked
      falls back to All. Your own programs have no star (they have their own shelf). In `prefs` only while not empty.
    - **Equipment filter, built (1 Oct):** "Equipment: Any ▾" next to Length (Any equipment / Kettlebell only / No
      equipment). It means the gear you have, as in the recipes: **Kettlebell only shows kettlebell and no-equipment
      programs**, No equipment only no-equipment ones. Chip counts and the total follow it (length still doesn't move
      them); a family or subject it leaves empty falls back to All. Not remembered: it resets with the page, as Length.
    - **Exercises page search, built (1 Oct):** one field matches name, muscles and cue (every word, any case); chips
      by category (with counts) and by **what the exercise uses**: Kettlebell, Dumbbells, Pull-up bar, No equipment
      (here "Kettlebell" means exercises with the kettlebell, not what you can do with one). Results stay grouped by
      category; within one, name matches come first. The search stays while you open an exercise and come back.
20b. **Body muscle map ([#81](https://github.com/noamros9/kettle-bar/issues/81), Noam, 29 Sep; planned as Phase 9):** tap
    muscles on a front/back body map and get the exercises and programs that work them most. To be grilled and
    designed before it gets tickets; it builds on the muscle map the exercise pages and stats already draw.
21. **Stats ([#66](https://github.com/noamros9/kettle-bar/issues/66)), in tabs** (Overview · Muscles · Time ·
    Exercises): where time goes (by family, subject and format), kind of work (strength volume, cardio minutes,
    mobility minutes), longer spans with a weekly trend, exercise history, level over time, CSV export.
    Still planned volume (ADR 2).
    - **Tabs, built (1 Oct):** Overview (the tiles), Muscles (heat map and ranked bars), Time (week by week, for Last 4
      weeks and All time). **The Exercises tab comes with ticket 7**, so no tab stands empty. The span and program
      switches stay above the tabs and carry across them; the tab is kept while the app is open.
    - **Where time goes, built (1 Oct):** on the Time tab, workout minutes by family (tap one for its subjects) and by
      format, and the kind of work as three totals: strength sets (and reps), cardio minutes, mind & body minutes. A
      mixed day's blocks count under their own family and the mixed program's subject (a Fighter day's flow is Mind &
      body · Fighter). Random workouts count under their family as "Random workouts". Stretching stays out (it has
      its own tile on Overview). Core & abs is in Mind & body, so it counts as mind & body minutes. A mixed day's abs finisher
      (no family of its own) goes with the block before it (fixed 1 Oct with ticket 6).
    - **Longer spans and the trend, built (1 Oct):** spans This week · Last 4 weeks · **Last 3 months** (13 whole
      weeks) · **This year** (1 Jan to the end of this week) · All time. The Time tab opens with **minutes per week** as
      a line, or **per month as bars** for This year (with a month-by-month table instead of the weekly one).
    - **Exercises tab and CSV, built (1 Oct):** each exercise of the workout blocks done in the span (a swap counts as
      the one done; warm-ups and cool-downs left out), on how many days and when last, 20 shown then "Show all"; tap →
      its page. **Level over time**: per program, the highest level done each week (I / II / III, · for none). Settings
      → Workout history → **Download CSV**: one row per done day (date, program or "Random", day, level, workout and
      stretching minutes, sets, reps); it loads the programs first, and says so if it can't (offline).

## Phase 9: the body muscle map, and workout history
Plan and tickets: [docs/plans/phase-9-map-and-history.md](docs/plans/phase-9-map-and-history.md). Grilled with Noam on
1 Oct 2026; both open items in one phase.
22. **Body muscle map ([#81](https://github.com/noamros9/kettle-bar/issues/81)):** on the **Exercises page** (a "By
    muscle" view, not a new tab). Pick **several muscles, combined**: exercises and programs that work all of them
    rank first. You get **exercises and programs** that work them most.
    - **Map picker, built (1 Oct):** "By muscle: Any ▾" under the search opens the map; tap muscles (or their chips: some
      muscles are small on a phone, so the chips are the sure way); the list becomes one "Best for …" grid in rank order
      (no category sections), still narrowed by the search, category and equipment chips.
    - **Programs for the picked muscles, built (1 Oct):** the top 5 (library and your own) by muscle focus, each card
      with each picked muscle's share; shown **above** the exercises (five cards before a long list, not under it as
      planned). `data/muscles.json` is made at build time and downloads with the rest for offline.
23. **Workout history ([#113](https://github.com/noamros9/kettle-bar/issues/113)):** a **Stats → History** tab, a
    **month grid; tap a day** for what you did. **History yes, streaks no** (calendar/streaks stays under Decided
    against for the streak part: no streak counts, targets or "don't break the chain"). Built on it: **workouts by
    weekday**, **time of day** (from when a day was marked done) and **days per week** as a trend.
    - **Calendar, built (1 Oct):** Stats → History, the month from Sunday to Saturday, ‹ › and Today; a day's fill
      steps at 1–24, 25–39, 40–59 and 60+ minutes (the heat map's four shades); today outlined. Tap a day: its
      workouts, each program day opening its day page (a random workout just shows what it was). The span switch is
      hidden on this tab; the program switch narrows it.

## Decided against (don't re-suggest)
- **Logging weights/reps per set**: Noam wants done / not done only.
- **Adaptive plans**: no test days, no too-easy/too-hard nudging, no deload suggestions. Plans stay as written.
- **Streaks** (a history calendar is fine, Phase 9; 1 Oct), **consistency targets, program-progress stats, push/pull ratios, neglected-muscle alerts**:
  not picked.
- **Voice countdowns, "what's next" and encouragement**: holds and sides only.
- **Hebrew version** and **share as image**: not wanted for now.
- **Animating workout cards** (every card, current exercise only, tap to play): exercise pages only.
- **Heart-rate / Google Fit**: limited from a web app; revisit only if the app goes native.

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
      those stay, marked "Needs gear" on the card. Rows and lateral raises: planned as Phase 10 (2 Oct).
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

## Phase 9: the body muscle map, and workout history (done, Oct 2026)
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
    - **Its own page, 2 Oct (Noam: "I expected to see the body front and back, tap a muscle, and see every exercise
      that works it, divided into primary and secondary"):** the map moved from the Exercises page's "By muscle"
      toggle to a **Muscles header tab**, the body **always shown**. Tapping muscles lists **every** exercise that works
      them in two sections, **Main muscle** and **Also works** (secondary), after the five programs that train them
      most; equipment chips narrow it. The Exercises page links to it.
23. **Workout history ([#113](https://github.com/noamros9/kettle-bar/issues/113)):** a **Stats → History** tab, a
    **month grid; tap a day** for what you did. **History yes, streaks no** (calendar/streaks stays under Decided
    against for the streak part: no streak counts, targets or "don't break the chain"). Built on it: **workouts by
    weekday**, **time of day** (from when a day was marked done) and **days per week** as a trend.
    - **Calendar, built (1 Oct):** Stats → History, the month from Sunday to Saturday, ‹ › and Today; a day's fill
      steps at 1–24, 25–39, 40–59 and 60+ minutes (the heat map's four shades); today outlined. Tap a day: its
      workouts, each program day opening its day page (a random workout just shows what it was). The program switch
      narrows it; the calendar pages by month on its own.
    - **When you train, built (1 Oct):** under the calendar, for the chosen span, workouts by weekday (Sunday first)
      and by time of day (morning 5–12, afternoon 12–17, evening 17–22, night 22–5, from when the day was marked
      done). So the span switch shows on History too (hidden in ticket 3, back in ticket 4).
    - **Days per week, built (1 Oct):** on History, between the calendar and "When you train", a line of the days
      trained each week (0–7; two workouts on one date count once), for spans longer than a week.

## Phase 10: floor-only stand-ins for rows and lateral raises
Plan and tickets: [docs/plans/phase-10-bodyweight-pulls.md](docs/plans/phase-10-bodyweight-pulls.md). Grilled with Noam
on 2 Oct 2026, from Phase 7's travel mode finding.
24. **Floor only** (no table, door or towel). Close **a second row** and **the side shoulders**: Prone lat pulls,
    Superman rows, Side-lying lateral raises. Used in **travel mode, the Swap list and new builds** (build your own,
    random workouts) from now on; existing programs never reshuffle (`added: 6`). **Curls, pull-ups and hangs are left
    as they are** in Bodyweight only (still "Needs gear").
    - **Built (2 Oct):** the three are `added: 6`; build your own and random workouts (catalogue 6) can draw the two
      pulls (they join the bodyweight pull pool after Table rows and Supermans). Lateral raises never need gear now.
      A row can still keep "Needs gear" on a day with three or more pulls needing gear (pull-ups count): each floor
      pull is used once a day (65 of 8,280 library days, at most one row each).

## The 2 Oct 2026 roadmap
Noam's order, grilled 2 Oct 2026: CI upkeep, then offline (added the same morning), then architecture review IV, then
exercises I skip + a fourth floor pull, then more programs, then a round of new feature suggestions.

### Phase 11: CI upkeep
Plan: [docs/plans/phase-11-ci-upkeep.md](docs/plans/phase-11-ci-upkeep.md). Current action majors (Node 20 is
deprecated on runners) and a pinned runner (`ubuntu-latest` moves to Ubuntu 26 on 19 Oct).

### Phase 12: offline you can rely on (done, Oct 2026)
Plan: [docs/plans/phase-12-offline.md](docs/plans/phase-12-offline.md). Noam, 2 Oct, all four parts, right after CI
upkeep: **open from cache at once** (update in the background, "new version · Reload"); **an outbox** so changes made
offline (un-done days and deletes too) always reach the account, even after closing the app; **fonts and the sync
library offline**; **"Offline · N changes waiting"** in the header.
- **Open from cache, built (2 Oct):** `sw.js` serves from the cache at once and updates it behind; the page asks
  `version.json` (a hash of the build, never cached) when it opens and when it comes back to the front, and shows "A
  new version is ready · Reload / Later" (Reload drops the cached page first).
- **Outbox, built (2 Oct):** every cloud write while signed in (progress, own programs, random workouts, prefs, deletes)
  is kept on the phone (`kb-outbox`, no key when empty) until the cloud confirms it; sent again on reconnect and at
  the next start, where a waiting change **wins over the cloud's copy** (so an un-done day or a delete never comes
  back). With nothing waiting, the first sync joins as before (newest wins, done days joined). A change the rules
  refuse for good isn't kept.
- **Fonts and the sync library offline, built (2 Oct):** the Barlow fonts (OFL) are served from `fonts/` (no Google
  Fonts); the deploy copies the pinned Firebase library into `vendor/firebasejs/<V>/` (`scripts/vendor-firebase.js`,
  imports pointed at the copies) and `firebase-sync.js` loads it from there first (gstatic as a fallback), so the
  service worker caches both like the rest of the app.
- **Changes waiting, built (2 Oct):** the outbox counts **your changes** (two days ticked = 2; the first sync's own
  writes are kept but not counted). The header says "Offline · 2 changes waiting" (in full to screen readers and on
  wide screens; on a phone a small count replaces the status dot), and the account popover explains it; it clears
  once the account has them.

### Architecture review IV (done, Oct 2026)
Plan: [docs/plans/architecture-review-4.md](docs/plans/architecture-review-4.md). **Full review, like III** (2 Oct):
pages as modules, actions instead of the click chain, minify the page, program length and levels in one place (for
30-day programs), build the library once per test run. Behaviour stays the same.

### Phase 13: exercises I skip, and a fourth floor pull (done, Oct 2026)
Plan: [docs/plans/phase-13-skip-and-floor.md](docs/plans/phase-13-skip-and-floor.md).
25. **Exercises I skip** (2 Oct): marked on the **exercise page**, listed in **Settings**, synced. Applies
    **everywhere** (day pages, random workouts, build previews). No stand-in: **kept, marked** "You skip this".
26. **Reverse snow angels** (2 Oct): the fourth floor-only pull. Built as catalogue 7, not 6: own programs and random
    workouts made since Phase 10 build at 6, so adding there would have reshuffled them.

### Phase 14: more programs (done, Oct 2026)
Plan: [docs/plans/phase-14-more-programs.md](docs/plans/phase-14-more-programs.md). Decided 2 Oct, **all of these,
the +50% on top**:
27. Fill every 5-program subject to 6 (+9).
28. **New subjects, 5 each:** Running prep, Grip & forearms, Gentle / low impact, Kettlebell complexes, Back care,
    Climber / pull strength, Court & field sports (+35).
29. **30-day programs, 3 levels of 10 days:** 2 per family (+8).
30. Bodyweight programs with the floor-only pulls (+3).
31. **Each family +50%** (Strength +26, Cardio & combat +13, Mind & body +16, Mixed +15).
- **Built (2 Oct):** 138 → **263 programs** in 30 subjects, all pinned, no existing pin changed (PRs #149–#160).
  Catalogue 8 (29 exercises for the new subjects) is frozen: later additions use new pool names or catalogue 9.
  Shelves show 6 with "Show all N"; 30-day programs say so on their card.

### Phase 15: the Program finder (done, Oct 2026)
Plan: [docs/plans/phase-15-program-finder.md](docs/plans/phase-15-program-finder.md). Suggested 2 Oct after Phase 14
(program finder, your training days, a note on a done day, calendar export); **Noam picked the Program finder, with
free-language search using AI** (2 Oct). Grilled:
32. **AI engine: an on-phone model** (a small embedding model in the browser; free, private, offline after a ~25 MB
    download), not a server or the Claude API.
33. **Signed-in only** for the AI search.
34. **Top 3–5 programs, each with a line on why** (made from the program's facts; the model ranks, it doesn't write).
35. **Also:** an instant **name search box** and a **3-question "help me pick"** (goal, minutes, gear).
Not picked yet (2 Oct): your training days; a note on a done day; calendar export; a reminder at a set time (needs a
push server).

### Phase 16: muscle focus, Variety, after-dark, and +50% more (done, Oct 2026)
Plan: [docs/plans/phase-16-muscles-variety-more.md](docs/plans/phase-16-muscles-variety-more.md). Grilled 4 Oct 2026:
36. **Muscle focus, 7 new subjects × 8 (+56):** Chest, Back, Shoulders, Arms, Hips & adductors, Calves & lower legs,
    Neck & traps; each trains the muscle and its helpers. **Layout: a mix** (half "2 focus days : 1 other", half the
    muscle every day with a different helper).
37. **Variety: no day repeats** (no two days share day type + format), a new subject; **more than 10** (15).
38. **After-dark programs** for looks, stamina and positions; **"a lot more" than 12** (3 subjects × 10); **names may
    be fully explicit** (Noam). Decided 4 Oct: the repo stays public and the shelf is a normal
    shelf (the app is for Noam's own use); no Settings switch.
39. **More of everything: +50% per family** (+133), on top.
- **Built (4 Oct): 263 → 497 programs** in 41 subjects (PRs #168–#179), all pinned, no existing pin changed. The program
  list left the first download (123.8 → 112.7 KB gzipped); catalogue 9 (40 exercises, neck, traps and shins on the map)
  is frozen; the recipe book's gate is 500 / 70 KB.

### Phase 17: shelf groups on the Programs page (done, Oct 2026)
Plan: [docs/plans/phase-17-shelf-groups.md](docs/plans/phase-17-shelf-groups.md). Noam, 4 Oct 2026, after Phase 16 ("it
became visually messy"):
40. **Nine groups, ten chips with All** (the finest option): Strength · Muscles · Cardio · Combat · Yoga & Pilates ·
    Mobility & care · Mixed · Variety · After dark.
41. **Programs page only**: Stats, build your own and random workouts keep the four training families.
42. **Ticket 2, a bug (4 Oct):** signed in, the tab strip snapped back mid-swipe (every program's first cloud reply
    redrew the page). Fixed in PR #183.

## The 4 Oct 2026 roadmap
Four issues Noam opened on 4 Oct 2026, grilled the same day. Order first set as architecture review V, then super
programs, then After dark; **that evening Noam moved After dark first** ("let's do it now, then the rest on Tuesday or
Wednesday"). Added the same evening: longer programs (#198), calisthenics (#199) and "do now" (#200); their place in
the order isn't set yet. The code review's place in the order isn't set yet. Each gets its own plan, by our method, when it starts.

### Phase 18: After dark, more explicit, with couple sessions ([#185](https://github.com/noamros9/kettle-bar/issues/185)) (done, Oct 2026)
Plan: [docs/plans/phase-18-after-dark-couples.md](docs/plans/phase-18-after-dark-couples.md).
44. **Triple it** (4 Oct), then sized exactly: **+75 programs: 20 couple programs and 5 in each of 11 other new
    subjects** (After dark: 30 → 105).
45. **12 new subjects** (4 Oct; every one offered, "and more"): Couples / partner · Endurance & control · Hip power &
    thrust · Carry & hold · Flexible & bendy · Strip & show-off · Her pleasure · Quickie · Back & knees care · Date
    night warm-up · Positions tour · Morning glory / Sunday.
46. **Couple sessions:** mostly together (the same moves for both, the odd role-specific step); written for him and
    her; they count in Stats like any workout.
47. **Text:** Noam asked for fully descriptive. The sex steps name the position, the time and the form cues, written
    frankly but not pornographic (Claude's limit, said at the time).
48. **Pictures:** rudimentary two-figure drawings for partner moves and sex positions (new figure-engine work; stick
    figures, non-anatomical).
49. **20 sexy couple programs** (Noam, 4 Oct): couples are a big part of this phase, not one subject among twelve.
50. **Flow: a mix across programs** (4 Oct): most build up (partner workout → tease → positions), some alternate
    (a partner set, then a position).
51. **Teasing, all of it "and more"** (4 Oct): strip forfeits, kiss-and-touch reps, slow dance and massage, dares by
    the timer, winner's choice, eyes-closed rounds.
52. **Positions tour: one-off days** (4 Oct).

### Phase 20: After dark, refined, and an Explicit set ([#202](https://github.com/noamros9/kettle-bar/issues/202))
Plan: [docs/plans/phase-20-after-dark-explicit.md](docs/plans/phase-20-after-dark-explicit.md). Grilled on the issue
5 Oct 2026; Noam put it next (5 Oct), built by Grok and reviewed by Claude. Numbered 20 because 19 is super programs.
57. **Refine in place** (5 Oct): the 17 position cues, the 7 dare cues, and the 105 programs' blurbs and about text;
    same ids and days, no re-pins. Explicit words and dirty slang, one paragraph, no orgasm script.
58. **A pelvic mark on the stick figures** (5 Oct), on every position: rendered pictures were refused by the image tool.
59. **Catalogue 11: 88 exercises** (5 Oct): 24 intercourse, 24 oral, 24 anal, 8 toys, 8 hands.
60. **+155 programs, all 60 days, all couple** (5 Oct): Explicit (a subject chip on the After dark shelf, 20) and 9 in
    each of the 15 After dark subjects; three session shapes (gym then sex, sex then sex, positions only).
61. **Page cap 125 → 135 KB gzipped** (5 Oct); the 150 gate stays.
62. **Swap unchanged** (5 Oct): older couple programs may offer catalogue-11 exercises in Swap.
63. **Grok writes the explicit text** (5 Oct); a text failure gets a second Grok round.
64. **Program descriptions from his side** (5 Oct, ticket 5.5): blurbs and about text are written from his POV or a
    straight couple's POV, depending on the program, never hers. The app is Noam's. Just as explicit, or hotter.
    Applies to the 105 rewritten in tickets 3–4 and to every new program in tickets 8–13.

### Architecture review V ([#187](https://github.com/noamros9/kettle-bar/issues/187))
A fresh review after Phases 13–18: shelf groups, Variety, ~580 programs, the library boot, sync at that scale (one
cloud listener per program; ticket 17.2 found each first reply redrawing the page).

### Phase 19: super programs ([#186](https://github.com/noamros9/kettle-bar/issues/186))
One plan that runs days from several programs in a set order (some days from here, some from there).
43. **Both** (4 Oct): a few ready-made super programs, and I can chain my own from any programs.
- Still open, for the plan: how progress and pins work across the parts; how it shows on the Programs and day pages.

### Code review ([#188](https://github.com/noamros9/kettle-bar/issues/188))
Correctness, dead code, duplication, tests that no longer earn their keep. Place in the order not set yet.

### Longer programs ([#198](https://github.com/noamros9/kettle-bar/issues/198))
Noam, 4 Oct 2026: only about 1/6 of the programs run 33 min or more (of 557: 13% at 35+, 13% at 31–35, 74% under 31).
53. **The spread he wants:** half of all programs at **35–38 min (his baseline)**, a quarter at **31–35**, a quarter
    shorter.
54. **Minutes are the workout only**, as the cards show; the ~3 min warm-up and cool-down come on top.
55. **Re-time programs: rebuild them longer**, a one-time exception to the never-re-pin rule for those that change,
    **but they shouldn't change much: just add compatible exercises** (keep the blocks and picks, add sets, rounds or
    slots of the same kind).
56. **The shorter quarter has no target:** whatever stays under 31.
- Still open, for the plan: programs already started (leave them, or add only to the days ahead); which programs move
  up (by subject, so every shelf has long ones, or by family); how the builder adds without reshuffling.

### Calisthenics ([#199](https://github.com/noamros9/kettle-bar/issues/199))
Noam, 4 Oct 2026: calisthenics programs. Still open: a subject of its own (skills such as the muscle-up, handstand,
front lever and pistol), more programs alongside Calisthenics Base and Skills, or both.

### "Do now" ([#200](https://github.com/noamros9/kettle-bar/issues/200))
Noam, 4 Oct 2026: a button for dead time that hands you one exercise to do right now: anywhere, anytime, no
equipment, 20–30 seconds. Still open: where the button lives, how it picks, whether it times itself and counts in
Stats, and whether it stays quiet and office-friendly.

## Decided against (don't re-suggest)
- **Logging weights/reps per set**: Noam wants done / not done only.
- **Adaptive plans**: no test days, no too-easy/too-hard nudging, no deload suggestions. Plans stay as written.
- **Streaks** (a history calendar is fine, Phase 9; 1 Oct), **consistency targets, program-progress stats, push/pull ratios, neglected-muscle alerts**:
  not picked.
- **Voice countdowns, "what's next" and encouragement**: holds and sides only.
- **Hebrew version** and **share as image**: not wanted for now.
- **Animating workout cards** (every card, current exercise only, tap to play): exercise pages only.
- **Heart-rate / Google Fit**: limited from a web app; revisit only if the app goes native.

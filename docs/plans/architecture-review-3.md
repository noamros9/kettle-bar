# Architecture review III: before Phase 6

Source of truth for the third architecture review ([#63](https://github.com/noamros9/kettle-bar/issues/63)), done
29 Sep 2026 after Phase 5, and for the programs-page fix ([#68](https://github.com/noamros9/kettle-bar/issues/68)),
which is built on the first deepening. Glossary: [CONTEXT.md](../../CONTEXT.md). Decisions from the 29 Sep grilling
are in [ROADMAP.md](../../ROADMAP.md).

Noam's order: this review first, then Phase 6 (build your own + mixed programs), Phase 7 (day to day) and
Phase 8 (finding things + stats). Ticket 1 (#68) can be built in parallel with the rest of this review.

These are refactors except ticket 1, so **behaviour stays the same**, as in review II. Three things must not
change: the phone UI suite, the generated programs (the pin test in `tests/fixtures/program-days.json`) and the
stored data (device keys and the Firestore document shape).

## What I found

Measured on `main` at `c9bf96e`:

| | Now | Gate / note |
|---|---|---|
| `index.html` (first download) | 450 KB raw, 97 KB gzipped | 150 KB gzipped gate. About 30 more programs (Phase 6) add ~1 KB gzipped each: ~127 KB. Fine, but tight for Phase 8. |
| All 98 programs (`data/*.json`, the background download for offline) | 5.2 MB raw, 367 KB gzipped | ~480 KB gzipped at ~128 programs. Acceptable on mobile data; Noam checks on the phone (ticket 8). |
| `programs.config.js` | 1,166 lines | +30 mixed programs would take it past 1,500. |
| `program-builder.js` | 379 lines, one `build()` of 120 lines | Builds all 60 days in one loop; no way to build one day. |
| `app/views.js` | 514 lines, no unit tests | The #68 counter bug (`${all.length} programs`, always 98) is exactly the kind of slip a unit test would catch. |
| Format rules | `bouts` / `flow` / `.format` branches in 7 modules | Builder timing + options, session plan, stats `setsOf`, summary words, views card, backup, swaps. |
| Synced data | `users/{uid}/progress/{pid}` only (`firestore.rules`, `firebase-sync.js`, nightly `collectionGroup('progress')`) | Phase 6–8 add own programs, random workouts and preferences, all synced and backed up. |

**Answers to #63's questions**
- **Shallow modules:** the programs page's filter logic (lives in `viewPrograms`, untested), and the format rules
  (one concept spread over seven modules). Both get deepened (tickets 1 and 3).
- **Must change before Phase 6 and mixed programs:**
  - the builder must build **one day** from a **day-type recipe**, with a **lever and abs finisher per day type**
    (mixed days, random workout, "shorter today" all need this; ticket 4);
  - the store must sync **more than progress** (ticket 5);
  - the Program Catalogue must take **more than one source** (library + your own; ticket 6).
- **Versioned pools** ("pools as of catalogue 5") instead of `2`-suffixed names: **not worth it.** Renaming pools
  risks every pin for no behaviour; the rule "new pools get new names" is written into CONTEXT.md instead.
- **`catalogue: N` vs the program's `added`:** keep `catalogue: N`. It's explicit, tested, and a program can opt in
  to a newer catalogue without being new itself (Phase 6 own programs always use the newest).
- **Phone UI suite (~260 tests, ~7 min):** it grows with every program. Ticket 7 moves "every program renders" to a
  unit check and keeps a sample of phone renders.

## Tickets

In dependency order; one ticket = one branch = one PR, each starting from its **Test first** with `/tdd`.

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan (and Phases 6–8) | plan | – | `plan/phases-6-8` | done (PR #69) |
| 1 | Library filters as one module + programs page option A (#68) | feature | 0 | `feature/library-filters` | done (PR #70) |
| 2 | Program configs: one file per family | refactor | 0 | `refactor/config-files` | done (PR #71) |
| 3 | Formats in one place | refactor | 0 | `refactor/formats` | done (PR #72) |
| 4 | Builder: one day from a recipe, levers and abs per day type | refactor | 2, 3 | `refactor/build-day` | |
| 5 | Account data: sync and back up more than progress | refactor | 0 | `refactor/account-data` | done (PR #73) |
| 6 | Program Catalogue: several sources | refactor | 0 | `refactor/catalogue-sources` | done (PR #74) |
| 7 | UI suite: renderability as a unit check, a sample on the phone | refactor | 3 | `refactor/ui-suite` | |
| 8 | Noam: program cache size and first download on the phone | manual | 0 | – | |

### 1. Library filters + programs page option A (#68)
- **New pure module `app/library.js`**: `libraryView(summaries, filters, { families, lengthOf })` returns
  `{ families: [{ name, count, pressed }], subjects: [{ name, count, pressed }], lengths: [...], shelves: [{ subject, programs }], count, total }`.
  `FAMILIES` and `LENGTHS` move there from `views.js`. `setFilter` moves too (a family change resets the subject).
  `viewPrograms` only renders what it returns.
- **Option A (picked by Noam, 29 Sep):**
  - **Families as underline tabs**: All · Strength · Cardio & combat · Mind & body, full width, the chosen one
    bold with a 2 px ink underline; no pill or fill. Replaces `.filters.fam`.
  - **Subjects as chips with counts** under the tabs: "All 31", "Core & abs 6", "Yoga 5"… The chosen chip uses
    the accent tint (not ink), so the two levels never look alike.
  - **Length** becomes one quiet line under the chips: "Length: Any ▾", which opens the four choices as chips.
  - **The counter follows the selection:** the eyebrow reads "Mind & body · 31 programs" (or "Yoga · 5 programs",
    "98 programs" for All). With a length set, it counts what's shown ("Yoga · 2 of 5 programs").
- Files: `app/library.js`, `tests/library.view.test.js` (the existing `tests/library.test.js` tests the library
  programs), `app/views.js`, `app/styles.css`, `app/shell.html` (script tag), `build.js` (inline the module),
  `package.json` (coverage include), `tests-ui/library.spec.js`.
- **Test first:** `libraryView` on hand-made summaries: counts per family and subject; family "Mind & body" shows
  only its subjects; a family change resets the subject; the count follows family, subject and length; a
  subject missing from `FAMILIES` is returned in `unknown` (the page logs it, the UI test fails on it).
- **Done when:** on the phone in both themes the tabs and chips read as two levels, the eyebrow count changes with
  every tap (UI test: Mind & body → 31, Yoga → 5), and #68 is closed by the PR.

### 2. Program configs: one file per family
- `programs.config.js` becomes a list that requires `configs/strength.js`, `configs/cardio-combat.js`,
  `configs/mind-body.js` (and, in Phase 6, `configs/mixed.js`), in today's order. Order matters: it sets the
  program list order.
- Files: `configs/*.js`, `programs.config.js`, `build.js` if it reads the file directly, `scripts/*.js`.
- **Test first:** a test that the config ids, in order, equal today's list (write it on `main`, then move).
- **Done when:** the pin test passes untouched and `programs.config.js` is under 30 lines.

### 3. Formats in one place (`formats.js`)
Each new format (flow, bouts) touched seven modules. One table, one entry per format:
- `time(block, R, EX)` (from `blockTime`), `options` (from `OPTS`), `sets(block, EX)` (from stats `setsOf`),
  `summary(block)` (the words in `app/summary.js`), `name` (`FORMAT_NAMES` in `app/session.js`), and whether it
  is `timed` (runs from one Start) and `guided` (swaps only within its kind).
- Session plans stay in `app/session.js` (they are the state machine's business), but look up `timed` there.
- Pure and in the coverage gate, loaded in Node and inlined in the page like `exercises.js`.
- Files: `formats.js`, `tests/formats.test.js`, `program-builder.js`, `app/session.js`, `app/stats.js`,
  `app/summary.js`, `app/views.js`, `build.js`, `package.json`.
- **Test first:** for every format, `time` and `sets` agree with today's `blockTime` and `setsOf` on one sample
  block per format (written against the old functions first).
- **Done when:** a grep test finds no `'bouts'` / `'flow'` string outside `formats.js`, `app/session.js` and
  configs, the pin test passes, and every suite is green.

### 4. Builder: one day from a recipe
- Split `build(cfg)` into:
  - `buildDay(recipe, { day, level, lever, rnd, memory })` → one day. `memory` holds `used`, `count` and
    `stretchUsed`, so the 60-day loop passes the same memory from day to day and days stay byte-identical;
  - `build(cfg)` = the loop over days 1–60 calling `buildDay`, as today.
- A **recipe** is what one day needs: the day type's blocks (`f`, `slots`, `title`, `values`, `pref`), time range,
  equipment, rests, `catalogue`, and now **per day type**: `levers` (falls back to the program's) and `absSlots`
  (falls back to the program's). That is what mixed days need: a strength block with the weight lever, then a
  yoga flow with longer holds, in one day type.
- **Per-block lever** inside a mixed day type: a block may say `lever: ['base', 'holds', 'holds']`, overriding the
  day type's. `makeItem` reads the block's, then the day type's, then the program's.
- `recipesOf(cfg)` → `{ typeKey: recipe }`. The page (random workout, build your own) calls `buildDay` with a
  fresh memory and a seed of its own.
- Files: `program-builder.js`, `tests/builder.test.js`.
- **Test first:**
  - `build` over every config still matches the pins;
  - `buildDay` for a day-type recipe lands in its time range at each level;
  - a day type with its own `levers` and `absSlots: []` uses them while the program's other day types don't;
  - a block `lever` wins over the day type's.
- **Done when:** the pin test passes untouched and coverage stays at 100%.

### 5. Account data: more than progress
Phase 6–8 sync three new kinds of data: **your programs** (their choices), **random workouts** (a done record with
the day inside) and **preferences** (favourites, hidden subjects, travel mode).
- **Firestore:** `users/{uid}/programs/{id}`, `users/{uid}/random/{id}`, `users/{uid}/prefs/main`. The rule
  becomes one match on `users/{uid}/{collection}/{doc}` for the four collections (listed by name).
  **Noam publishes the new `firestore.rules` in the Firebase console** (README step 5); the PR says so at the top.
- **Store:** the remote adapter gets `subscribe(collection, id, …)` / `write(collection, id, body)`; the progress
  calls keep their shape by passing `'progress'`. The in-memory remote does the same.
- **Backups:** the nightly script reads the three new collection groups; the export and nightly files gain
  `programs`, `random`, `prefs` (version 2). Version 1 files still import. Import's diff lists own programs and
  random workouts too.
- Files: `app/store.js`, `firebase-sync.js`, `firestore.rules`, `app/backup.js`, `scripts/backup-progress.js`,
  `tests/store*.test.js`, `tests/backup.test.js`, `README.md` (backups section), `CONTEXT.md`.
- **Test first:** the in-memory remote round-trips a document in each collection; a version-1 export imports
  unchanged; a version-2 export with one own program and one random workout shows both in the import diff.
- **Done when:** progress sync is unchanged on the phone, and a test document in `prefs` syncs between two
  browsers (UI test with the in-memory remote).

### 6. Program Catalogue: several sources
- `createProgramCatalogue(...sources)`: the library source (today's `fetched`) plus later ones: **your programs**
  (built in the page from their choices with `KBBuilder`) in Phase 6. Ids never clash: own programs are `own-<id>`.
- `list()` keeps library order and puts own programs first. `summary(pid).source` is `'library'` or `'own'`.
- Files: `app/programs.js`, `tests/programs.test.js`, `app/main.js`.
- **Test first:** two inlined sources: ids from both, `load` from the right one, an own program listed first.
- **Done when:** every suite is green with one source (no behaviour change yet).

### 7. UI suite: renderability as a unit check
- A unit test walks every program's days 1, 31 and 60 through `daySummary`, `formats`, the session's `plan` for
  timed blocks and the swap `alternatives` for every item: no throw, known exercises, known formats.
- The phone render test keeps **one program per subject** (18) in both themes, plus every exercise page.
- Files: `tests/renderable.test.js`, `tests-ui/renders.spec.js`.
- **Test first:** the unit walk, which must fail on a day with an unknown format.
- **Done when:** the UI suite runs in under 4 minutes in CI and the unit walk covers all 98 programs.

### 8. Noam: phone check (not for Sonnet)
- #67 item 12: on the phone, after a fresh install on mobile data, note the time until "every program is offline",
  and in Chrome → Site settings → Storage, the size used. If it's over ~25 MB or the download takes minutes, tell
  Claude before Phase 6's mixed programs add ~30 more.

## Challenge round
- **Weakest assumption:** that `buildDay` can reproduce today's days exactly. The 60-day loop threads `used`,
  `count`, `stretchUsed` and one `rnd` through every day. Ticket 4 keeps all four in `memory` and passes the same
  `rnd`; the pin test proves it. If a pin changes, the ticket stops and asks, it doesn't re-pin.
- **What I hadn't read:** `firestore.rules` only allow `progress`. New collections would fail silently on the
  phone (writes rejected, the sync status shows `err`). Ticket 5 changes the rules, and publishing them is a manual
  console step, so it's flagged at the top of the PR.
- **The lazier version:** skip tickets 2, 3 and 7, and do 4–6 only. Phase 6 would still work. Not proposed: the
  mixed programs add ~30 configs (ticket 2) and mixed days combine formats (ticket 3), so both pay back right away.

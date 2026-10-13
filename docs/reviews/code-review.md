# Code review (Phase 24 ticket 2)

Read on `main` at `c4d5be5` (13 Oct 2026). Test timings and coverage come from one CI run of `main`'s tree on a
throwaway branch (`review/timings-throwaway`, never merged; it printed the runner's timings as notices), because the
cloud session can't read CI logs. Findings only: the triage is ticket 3. Architecture findings are in
[architecture-5.md](architecture-5.md) (A1–A7); this file is C1 onward.

## Correctness: the rules that never bend

### C1 · Own programs aren't pinned: a builder change can reshuffle one you're halfway through
- **What:** an own program is stored as its config and rebuilt with *today's* builder code on every load
  (`app/own.js:1-4`, `programOf`). The library is protected by pins (`tests/fixtures/program-days.json`, checked
  before every build), but no test fixes an own program's days, so a builder change that alters how a day is drawn
  passes every check and silently reshuffles every saved own program, including ones with days done. `frozenDays`
  only covers edits (done days are frozen when you edit the choices), not builder changes.
- **Where:** `app/own.js` (programOf, toConfig), `scripts/pins.js` (library ids only).
- **Evidence:** grep: `pinOf`/`program-days.json` appear only in library tests; `tests/own.test.js:22` checks that
  the same config builds the same days *with the same code*, and `:285` that a changed *book* would reshuffle (which is
  why the config is stored), nothing about the builder.
- **Look ahead:** Phase 26 (longer programs) and 34 (short days) touch how days are timed and trimmed; Phase 36 changes
  how couple days are built (own programs can't be couple, so it is safe).
- **Proposed fix:** an own-program pin fixture: one stored config per recipe-book subject plus a few mixes (fixed
  seeds, made once from today's book), their days hashed like library pins and checked by a plain unit test. A real
  change to them is then a decision, not an accident.
- **Size:** S.

Checked and holding: library pins gate the build (`build.js`, `scripts/pins.js`); progress documents, device copies
and backups keep their shapes (`app/progress.js` header; old-backup import tests in `tests/backup.test.js`); the build
cache can't serve stale days (main's cold diff, decision 327).

## Dead code

### C2 · Almost none
- **What:** one CSS rule no page uses (`.soon`, `app/styles.css:121`), and two exports no other file reads
  (`VERSION` in `app/backup.js:257`, used inside the module only; `FILE` in `recipe-book.js:209`). Every other export
  is used by a page, a script or its own unit tests; the coverage report shows 100% of lines and functions in every
  covered module, branches 97.3–100% (gate 95%).
- **Evidence:** a throwaway scan of every module's exports against every other source and test file; a scan of the
  281 class names in `styles.css` against the page sources (`mm-l1–4`, `lv1–3` are built in templates).
- **Proposed fix:** delete the three.
- **Size:** S.

## Duplication

### C3 · "Needs a pull-up bar" is written nine times
- **What:** `(e.equip || []).includes('bar')` is spelled out in the gear rules, the library's gear filter, travel
  mode, the swap filter, the exercise page, two builder abs pools and the content checks.
- **Where:** `exercises.js:3164-3165`, `app/library.js:154`, `app/swaps.js:29` and `:40`, `app/pages/exercises.js:32`,
  `program-builder.js:373-374`, `scripts/check-new.js:13`.
- **Evidence:** grep.
- **Look ahead:** Phase 27 (calisthenics) brings rings and parallettes; each new kind of gear would have to be added
  in all nine places.
- **Proposed fix:** `KBEx.needs(e, 'bar')` (and the gear-of helper the library already has, `gearOf`) in
  `exercises.js`, used everywhere. Pins prove the builder's pools are unchanged.
- **Size:** S.

Levels and day counts are in one place (`app/length.js`, review IV); minutes and formats too (`formats.js`). No other
rule was found written twice.

## Tests that don't earn their keep (186)

Unit tests: 2,053 tests, 7.6 min of test time, the step 402 s on CI. Phone tests: 231 in light (8.7 min of test time,
the step 4.6 min) and 170 in dark (5.6 min).

### The ten slowest unit tests, and what each catches that nothing else does

| # | Time | Test | Catches alone | Proposed |
|---|---|---|---|---|
| 1 | 101.4 s | `library-cache` · the cached library is what `buildAll()` makes | nothing: the cache stores `buildAll()`'s own output, and the next test proves a stale copy is never read | drop the `buildAll()` comparison, keep the fresh-copy and ids checks (−100 s) |
| 2 | 95.1 s | `recipes` · make: every subject, every gear, 20/30/40 min, 60 days in range | that the book's fit claims hold for real builds | keep; one seed instead of three (−60 s), since the book's trials already use the slowest and fastest draws |
| 3 | 56.4 s | `floor` · bodyweight only, over every library day | the bodyweight stand-ins over the whole library | keep |
| 4 | 34.2 s | `programs` · Phase 23: each subject's new count | the 309 programs' counts and catalogues | keep; read the shared build (`built(ids)`) instead of building 309 programs again under coverage (−30 s) |
| 5 | 29.7 s | `mix` · no blocks to mix, too few mixes, a mix that never fits | the book's three edge cases | keep |
| 6 | 23.4 s | `build` · a program adds only its id to the first download | the page carries ids, not programs | keep; render 50 and 150 programs instead of the library twice (−20 s) |
| 7 | 8.5 s | `mix` · make agrees with options | offers and refusals match | keep |
| 8 | 7.9 s | `programs` · Phase 23 ticket 9b: the five new subjects | their shelves, Yin holds, the Pilates bell | keep |
| 9 | 7.7 s | `catalogue9` · builds at catalogue 8 or older never draw catalogue-9 moves | nothing: every library program's days are pinned, and `pins.test.js` proves a leaked exercise trips the pin | delete |
| 10 | 5.4 s | `catalogue8` · the same for catalogue 8 | nothing, as 9 | delete |

### The slowest phone tests

| Time (light / dark) | Test | Catches alone | Proposed |
|---|---|---|---|
| 72.0 s / 60.0 s | `skip.spec.js:95` · an exercise I skip with no stand-in stays on its day | the "no stand-in" mark | keep the test; it spends ~70 s building the whole library inside the Playwright worker (`library()`) just to find a day with heel raises: read the program from the built `data/index.json` usage index instead (−60–70 s per theme) |
| 84.4 s / 80.1 s (file) | `renders.spec.js` | every program page and day 1/31/60 render | keep: it is the smoke check (309) |
| 25.0 s / – | `bouts.spec.js:14` · Start runs every bout | the bouts flow | keep |
| 16.5 s / – | `workout.spec.js:81` · an EMOM minute by minute | the EMOM flow | keep |
| 11.4 s / 10.7 s | `renders.spec.js:47` · every exercise page | each exercise page draws | keep |

Together the proposals save about 3.5 min of unit test time (~1.5–2 min of the step on 2 workers) and 1–1.2 min per
phone test job, with nothing caught less. A6 (architecture) adds the build-cache restore before the unit step.

## Triage (Phase 24 ticket 3, 13 Oct)
- **C1:** fix now, ticket 6. **C2** and **C3:** fix now, ticket 12. **The slow tests:** fix now, ticket 9 (186).

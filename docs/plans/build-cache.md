# The build cache: rebuild only what changed

Backlog item 322 ([#265](https://github.com/noamros9/kettle-bar/issues/265), cut the test and CI times). Grilled 13 Oct
2026 (Noam); decisions 324–329 below. Right after Phase 23, before Phase 37. Opus builds (295).

## Decisions
Grilled 13 Oct 2026 with Noam (global decision numbers).

**What it covers**
- **324 · Program days and the recipe book**: both are cached; the library, index, finder and muscle files stay rebuilt
  every time (they're cheap). *(13 Oct)*
- **325 · A change to the builder's code drops the whole cache**: every key carries a hash of the code that makes it,
  so a code change is one cold build, never stale days. *(13 Oct)*
- **328 · A catalogue change rebuilds only the programs whose pools changed**: a program's key hashes the exercises it
  can draw at its own catalogue, not the whole of `exercises.js`; catalogue 14 leaves the ≤13 programs cached. *(13 Oct)*

**Where it lives and how it's proved**
- **326 · A gitignored folder, saved and restored by CI**: `.build-cache/` locally; CI restores and saves it with
  `actions/cache`. *(13 Oct)*
- **327 · main's run proves it**: on every push to `main`, CI also builds cold and diffs that against the cached
  build; any difference fails the run. *(13 Oct)*

**How it's built**
- **329 · Three tickets**: program days, then the recipe book, then CI. *(13 Oct)*

## What lands
Today `node build.js` builds all 1,060 programs (over 4 min on the cloud machine, past Playwright's 600 s wait with the
recipe book, 321) and any change to a config or the catalogue regenerates the whole recipe book (~17 min). After this,
a build makes only new or changed programs and day types and reads the rest from `.build-cache/`, with the same bytes
out. The pin gate (`scripts/pins.js`) still checks every program, cached or not.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/build-cache` | done (PR #381) |
| 1 | Program days from the cache (324, 325, 328) | build | – | `build/cache-days` | done (PR #382) |
| 2 | The recipe book per day type (324, 325, 328) | build | 1 | `build/cache-recipes` | todo |
| 3 | CI saves the cache and proves it on main (326, 327) | ci | 2 | `ci/build-cache` | todo |
| 4 | Close it | plan | 3 | `plan/build-cache-close` | todo |

### 1. Program days from the cache
- **Build:** a new `build-cache.js` (Node only): `codeHash(files)`, `keyOf(cfg)` = SHA-256 of the code hash
  (`program-builder.js`, `formats.js`, `app/length.js`, `build-cache.js`), the config's JSON, and its catalogue slice:
  every `EX` entry whose id is in `poolsAt(cfg.catalogue)` or `mergedAt(cfg.catalogue)`, sorted by id. A frozen program
  keys on its saved days file. `cached(configs, build, dir)` returns the programs, reading `<dir>/days/<id>.json`
  (`{ key, program }`) on a matching key and building and writing it otherwise; it reports hits and misses.
  `build.js` uses it (`.build-cache/`, added to `.gitignore`); `node build.js --cold` (and `KB_COLD=1`) skips reading
  but still writes. The pin gate runs on the result unchanged.
- **Files:** `build-cache.js`, `build.js`, `.gitignore`, `tests/build-cache.test.js`, `package.json` (coverage include).
- **Test first:** `tests/build-cache.test.js`, on a handful of real configs and a folder under `test-results/`: a cold
  run builds all and writes them; a warm run builds none and returns the same JSON; editing one config rebuilds only
  that one; changing an exercise that only catalogue 14 can draw leaves a catalogue-13 program's key the same, and
  changing one in its pools changes it; a changed code hash rebuilds all; `--cold` builds all; a corrupt cache file is
  rebuilt, not thrown.
- **Done when:** the test passes with 100% lines and functions on `build-cache.js`; the PR's CI green (its build is
  cold, so the bytes match main's).

### 2. The recipe book per day type
- **Build:** `recipe-book.js` keeps `recipes/book.json` committed with its whole-input hash (a fresh book stays a
  no-op), but when stale it no longer re-runs every trial: each day type's trial and each mix part's trial is read from
  `.build-cache/recipes/<key>.json`, keyed by a code hash (`recipes.js`, `recipe-book.js`, `program-builder.js`,
  `formats.js`, `app/length.js`, `app/library.js`), the day type's recipe, its subject's levers and the catalogue
  slice (as ticket 1). Only new or changed ones run. The book that comes out is byte-identical to a cold one.
- **Files:** `recipe-book.js`, `build-cache.js`, `tests/recipe-book-cache.test.js`.
- **Test first:** `tests/recipe-book-cache.test.js` with `generate()` on a few configs: a warm generate runs no trials
  and gives the same book; one new config runs only its day types; a changed lever set in a subject reruns that
  subject's types only; the cold and warm books are equal.
- **Done when:** the test passes; the recipe-book staleness test still passes; the PR's CI green.

### 3. CI saves the cache and proves it on main
- **Build:** `deploy.yml`'s build step restores `.build-cache/` (`actions/cache/restore`, key on the code hash and the
  run, restore-keys on the code hash) and saves it after a green build. On a push to `main`, it also runs
  `node build.js --cold` into a second folder and `diff -r` against the cached output; a difference fails the run and
  prints the first files that differ. `main`'s run uploads `.build-cache/` as an artifact (7 days), and
  `npm run cache:pull` (`scripts/cache-pull.js`) downloads the newest one into the local folder, so a fresh cloud
  session starts warm. CI prints the hits and misses as notices.
- **Files:** `.github/workflows/deploy.yml`, `scripts/cache-pull.js`, `package.json`, `CLAUDE.md` (Mechanics: run
  `npm run cache:pull` at the start of a session), `tests/cache-pull.test.js`.
- **Test first:** `tests/cache-pull.test.js`: picks the newest non-expired `build-cache` artifact from a canned
  artifacts listing and unpacks it to the given folder; with none it says so and exits 0.
- **Done when:** a PR run shows misses on its first run and hits on a rerun; `main`'s cold diff runs and passes; a
  fresh clone with `npm run cache:pull` builds the library with all hits.

### 4. Close it
- Move the decisions to `docs/roadmap-archive.md`, drop the row and the Backlog line, note the build times before and
  after in the archive line, and see whether Playwright's 600 s wait (321) and decision 312 can relax (asked, not
  changed).

## Challenge round
- **Weakest assumption:** that a program's days depend only on its config, its catalogue's pools and the builder code.
  If the builder reads `EX` outside the pools (stand-ins, stretches, warm-ups) or another config, the key misses it and
  a cached program goes stale silently. Ticket 1 widens the slice to whatever the builder touches, and decision 327's
  cold diff on `main` catches anything still missed.
- **What I hadn't read:** `recipes.js`'s trial internals, and whether the warm-up and cool-down picks read pools at
  the program's catalogue or the newest one; ticket 1 checks before its key is written.
- **The lazier version:** cache only the recipe book (the 17 min) and leave the days; but the days are what push the
  UI build past 600 s, so both stay. A cloud session starts with an empty folder, so without ticket 3's
  `cache:pull` the local win is only within one session.

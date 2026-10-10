# Phase 31: quick fixes (Back keeps your place, preview = saved, the flaky sync test)

Issues [#214](https://github.com/noamros9/kettle-bar/issues/214), [#111](https://github.com/noamros9/kettle-bar/issues/111)
and [#105](https://github.com/noamros9/kettle-bar/issues/105). Grilled 8 Oct 2026 (Noam); decisions 224–229 below.
Right after Phase 22 (223). #110 started here and grew into its own phase:
[Phase 34](phase-34-short-days.md). Claude plans; Noam picks Grok tickets at hand-off.

## Decisions
Grilled 8 Oct 2026 with Noam (global decision numbers).
- **224 · One small phase for #214, #111 and #105**, right after Phase 22; #110 split off as Phase 34 (it grew). *(8 Oct)*
- **225 · Back lands where you were**: the phone's or browser's Back only; the top tabs (Programs, Exercises…) still
  open at the top. *(8 Oct)*
- **226 · On five pages (was four)**: Programs ← a program, Exercises ← an exercise, a program ← its day, Stats/History ←
  a day, a day ← an exercise opened from it. *(8 Oct)*
- **227 · Preview = saved** (#111): Build your own picks the new program's id before drawing the preview, so Save keeps
  exactly what the preview showed; Regenerate keeps the id with a new seed. *(8 Oct)*
- **228 · Own programs already saved stay as built**: no rebuild, no offer to rebuild. *(8 Oct)*
- **229 · #105 gets a root cause**: fix the app if it's a real race (two synced phones could see a blank page), else
- **307 · CI builds the site in its own step** before the phone tests; the test server only serves. Its 240 s start
  limit, build included, failed #336's jobs before any test ran. *(10 Oct)*
- **308 · No local coverage run; the commit hook runs only the changed tests.** CI runs the full suite on the PR and
  the merge waits for it; locally it took 12–15 min per ticket. *(10 Oct)*
- **309 · Locally, a UI ticket runs its own specs and the smoke check**, light only; the mapped specs and the full suite
  run in CI. *(10 Oct)*
- **310 · #105 waits for a CI trace**: 168 local runs passed (40 alone, 128 among the sync specs under load) and no race
  was found; CI keeps a trace on failure, and the next one names the cause. Ticket 3 closes the phase without it. *(10 Oct)*
- **311 · Ticket 5: faster unit tests**, same tests and gate: the whole library is built once, without coverage, before
  the run; the slow files read it. The unit job took ~17 min, ~12 of it building programs under coverage. *(10 Oct)*
- **312 · Whole-library tests run only in CI**: files marked `// ci-only` are skipped by the commit hook, and this
  machine runs light tests only; a heavy change is measured by the PR's CI. *(10 Oct)*
  the test; no retries. *(8 Oct)*

## What lands
- **Back keeps your place** (225, 226): on the five pages, Back returns to the same scroll position, the same shelf
  or card in view; the shelves you opened ("Show all") and the filters stay as they were. Tapping a top tab still
  starts at the top.
- **What you preview is what you save** (227): same exercises, same minutes on every tile.
- **The rename-sync test passes every time** (229), with the cause written down.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/open-issues-8oct` | done (PR #297) |
| 1 | Back keeps your place on five pages (#214) | feature | – | `fix/back-keeps-place` | done (PR #336) |
| 2 | Build your own: preview = saved (#111) | feature | – | `fix/preview-is-saved` | done (PR #339) |
| 3 | The rename-sync flake: root cause and fix (#105) | feature | – | `fix/rename-sync-flake` | waits for a CI trace (310) |
| 5 | Faster unit tests: the library built once, without coverage | feature | – | `test/faster-unit` | done (PR #341) |
| 4 | Close the phase: archive | plan | 1–3, 5 | `plan/p31-close` | done (PR #342) |

Tickets 1 and 2 touch different files and can run at once; ticket 3 may touch `app/pages/core.js` (the loading
view), so it waits for ticket 1's PR to open and stacks on it if it does.

### 1. Back keeps your place (#214)
- **Build:** every route change today renders with `scrollTop` (`app/pages/core.js`, the `hashchange` listener). Keep
  the scroll position in the current history entry (`history.replaceState({ ...history.state, y }, '')`, written on
  scroll, throttled, and just before leaving); on `hashchange`, an entry that carries a `y` (one you came back to)
  renders, then scrolls to it; one without (a new navigation, a top tab) scrolls to the top as now. A program page
  still loading its program restores once it has drawn (the `stillLoading` redraw). The family tabs strip keeps its
  own sideways position as today.
- **Files:** `app/pages/core.js`, `tests-ui/back.spec.js` (new), `scripts/ui-affected.js` (MAP line).
- **Test first:** `back.spec.js`, at 390 px: scroll the Programs page to the fourth shelf, open a program, Back: the
  same card is in view (within 4 px) and an opened "Show all" shelf is still open; the same for Exercises ← an
  exercise (with a search typed), a program ← day 37, Stats/History ← a day, and a long day ← an exercise opened
  from its block; tapping the Programs tab from a
  program lands at the top.
- **Done when:** the five cases pass light and dark; a 390 px screen recording or before/after screenshots in the PR.

### 2. Build your own: preview = saved (#111)
- **Build:** `app/pages/build.js` draws the preview under `'own-preview'` and Save makes a new id, while the Program
  Builder seeds its picks with the program's id (`makeRnd(cfg.id)`), so the saved days can differ. The builder state
  gets its id when it opens (`KBOwn.newId()`); the preview is built under `KBOwn.pidOf(id)` and Save stores under the
  same id. Regenerate changes the seed, never the id. Edit already builds under the program's own id; unchanged.
  Saved programs are untouched (228): nothing reads `own-preview` from storage.
- **Files:** `app/pages/build.js`, `tests/own.test.js`, `tests-ui/build.spec.js`.
- **Test first:** `own.test.js`: a config built under a picked id equals what `programOf` gives for the record saved
  with that id, all days; `build.spec.js`: save from the builder, and the program's first six days show the same
  exercises and minutes as the preview did; Regenerate then Save keeps the id the builder opened with.
- **Done when:** both tests pass; no own-program pin or stored shape changes.

### 3. The rename-sync flake (#105)
- **Build:** reproduce first: `build.spec.js` › "rename, edit and delete reach a second browser through the account"
  with `--repeat-each 40` under the full suite's load, traces on failure, failure rate recorded. Read the two leads in
  #105 (a sync echo re-rendering between the rename submit and the catalogue refresh, leaving `stillLoading` true for
  an own program; or a sync `change` re-rendering the rename form so the submit is lost). Fix where the cause is: in
  the app if a real device could hit it, else in the test (waiting on the right signal, never a longer timeout).
- **Files:** `tests-ui/build.spec.js`; then whichever of `app/own.js`, `app/store.js`, `app/pages/core.js`,
  `app/pages/program.js` the cause is in, and a unit test next to it.
- **Test first:** the repro run above, failing at its recorded rate; if the cause is in the app, a unit test that
  fails on the race (e.g. a sync `change` arriving between rename and refresh still leaves a heading).
- **Done when:** the cause is written in the PR and in this plan (under "Found"); 100 repeats under load pass;
  `retries` stays 0.

### 5. Faster unit tests (311)
- **Build:** `scripts/warm-test-cache.js` builds `tests/helpers/library.js`'s `library()` and `rendered()` once, without
  coverage (~50 s for 736 programs, against ~6 min under coverage, where each file that found no cache built it again);
  `test:coverage` and `npm test` run it first. Test files that build whole sets themselves (`c13-programs`) read the
  shared library instead. If the cache moves coverage of `program-builder.js` below the gate, small direct tests cover
  what the whole-library build covered by accident.
- **Files:** `scripts/warm-test-cache.js` (new), `package.json`, the slow test files, `tests/` for any coverage gap.
- **Test first:** the timing: the unit job's time on CI before (≈15–17 min) and after, recorded in the PR.
- **Done when:** the same tests pass with the same gate; CI's unit job under ~6 min.

### 4. Close the phase
- Decisions to `docs/roadmap-archive.md` (a summary line and a link here); the row leaves ROADMAP.md; #214, #111 and
  #105 closed by their PRs.

## Found
- **Ticket 3 (#105), 10 Oct 2026:** no repro. The test passed 40 of 40 alone (2 workers) and 128 of 128 among
  `build`, `sync` and `share` specs at 3 workers on 2 cores. Read and ruled out: own programs are always preloaded
  (`KBOwn.source` is `inlined`), so a sync echo can't leave the page on "Loading…"; a background redraw keeps the
  rename field's focus and text, and the submit is synchronous with Enter. Open: the page had no heading at all, so it
  stayed in the rename form or a loading view. CI keeps a trace on failure (`retain-on-failure`); #105 stays open for it.

## Challenge round
- **Weakest assumption: that the history entry is the right place to keep the scroll.** A hash change made by
  `history.replaceState` elsewhere (the router rewrites `#today` and old `#d<n>` links into `#p-…`) replaces the
  state too. Ticket 1 merges into `history.state` rather than replacing it, and its spec includes coming back to a
  program opened through `#today`.
- **What I hadn't read:** how the History tab redraws (it pages by month on its own) and whether the Exercises page
  draws its list in one go or as you scroll. If either draws late, the restore runs after its redraw, like the
  program page's; ticket 1 reads `app/pages/stats.js` and `app/pages/exercises.js` first.
- **The lazier version:** `history.scrollRestoration = 'auto'` and drop the `scrollTop` on Back. Not enough on its
  own: the page is redrawn after the browser restores, so the browser's position lands on a page that is still
  empty. Kept in mind for ticket 1 as a first try.
- **#105 may not reproduce** on the cloud machine's 2 cores. Then the trace from CI's next failure is the evidence,
  and the ticket waits on it rather than guessing.

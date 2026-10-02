# Architecture review IV: before more programs

Decided 2 Oct 2026 (Noam): a full review like III, after CI upkeep and offline (Phases 11–12) and before Phases 13–14 (which add ~125 programs
and a skip list). Refactors only: **behaviour stays the same**. Three things must not change: the phone UI suite,
the generated programs (pins in `tests/fixtures/program-days.json`) and stored data (device keys, Firestore shapes,
backups).

## What I found (measured on `main` at `3cf2f92`)

| | Now | Note |
|---|---|---|
| `app/views.js` | 1,164 lines, ~133 functions, no unit tests | Every page's rendering and state in one file; logic like the trend chart, count bars and stats scoping is only tested through the phone suite. |
| `app/main.js` click handler | 69 `if (d.…)` branches in one listener | Adding a button means editing one long chain; nothing checks that every `data-…` button has a handler. |
| `index.html` | 124.3 KB gzipped of the 150 KB gate | Comments are stripped (`lean()`), nothing else. Minifying the scripts (no name mangling) measures 113.2 KB; with local names mangled 105.0 KB. |
| Day count and levels | 60 days and levels at days 1–20 / 21–40 / 41–60 assumed in the builder, `random.levelOfDay`, rounds ("Day n of 60") and page text | Phase 14 adds 30-day programs (levels at 1–10 / 11–20 / 21–30). |
| Unit tests | ~2.5 min (also the pre-commit); `buildAll()` runs in 12 test files, `mix` and `recipes` ~27 s each | ~125 more programs would roughly double it. |
| Programs page at ~260 programs | Subject shelves list every program | A UX change, so it belongs to Phase 14 (ticket 2), not here. |

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan (in the 2 Oct roadmap plan) | plan | – | `plan/roadmap-oct` | done (PR #133) |
| 1 | Pages as modules | refactor | – | `refactor/pages` | done (PR #140) |
| 2 | Actions instead of a click chain | refactor | 1 | `refactor/actions` | |
| 3 | Minify the page | build | – | `build/minify` | |
| 4 | Program length and levels in one place | refactor | – | `refactor/program-length` | |
| 5 | Build the library once per test run | test | – | `test/library-cache` | |

### 1. Pages as modules
- `app/views.js` splits into `app/pages/` (programs, program & day, exercises, stats, settings, build & add, random)
  plus a small shared `app/ui.js` (escaping, chips, charts); `build.js` concatenates them in order as today.
- Pure helpers move out of page code into tested modules (the trend chart's scale, count bars, stats scoping).
- **Test first:** unit tests for the moved helpers; the phone suite unchanged and green.

### 2. Actions instead of a click chain
- Buttons carry `data-act="name"` (+ `data-arg`); each page module registers its actions; main.js dispatches.
- **Test first:** a phone test that walks every page and checks each `[data-act]` has a registered action.

### 3. Minify the page
- `build.js` minifies each script with terser (dev dependency): whitespace and comments, and local names mangled;
  top-level names (what the phone tests reach) kept. CSS whitespace trimmed.
- **Test first:** the build test asserts the page is under 110 KB gzipped and still runs (the phone smoke).

### 4. Program length and levels in one place
- A program's `dayCount` and its level boundaries (`levelOf(program, day)`) come from one function used by the
  builder, random workouts, rounds and page text. 60-day programs come out byte-identical.
- **Test first:** `levelOf` for a 60-day program (20 / 21 / 41 boundaries) and a 30-day one (10 / 11 / 21); pins
  unchanged.

### 5. Build the library once per test run
- A test helper builds every program once per source hash and caches it under `test-results/.cache/` (inside the
  repo, ignored); test files read it. The recipe-book tests reuse one generated book.
- **Test first:** the cache is rebuilt when a source changes (hash); a stale cache is never read.
- **Done when:** `npm run test:coverage` runs in under 90 s here.

## Challenge round
- **Weakest assumption:** that mangling is safe. Only names inside functions are mangled; the phone suite is the
  check, and the build test runs the minified page.
- **What I hadn't read:** how much of the 2.5 min is coverage instrumentation rather than building. Ticket 5
  measures before and after.
- **The lazier version:** tickets 3 and 4 only (headroom and the 30-day prerequisite); 1, 2 and 5 make the next 125
  programs and the skip list cheaper to build and review.

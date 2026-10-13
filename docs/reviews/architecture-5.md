# Architecture review V (Phase 24 ticket 1)

Measured and read on `main` at `c4d5be5` (13 Oct 2026): 1,060 programs in 73 subjects, 1,447 exercises (831 of them
couple ones), the build cache in. Earlier reviews ([III](../plans/architecture-review-3.md),
[IV](../plans/architecture-review-4.md)) left no open findings; nothing here re-raises them or a "Decided against" item.
Findings only: the triage (fix now / issue / drop) is ticket 3.

## Measured

Throwaway scripts (not committed): the built site served gzipped with GitHub Pages' `max-age=600`, a 390 × 844 phone,
**4× CPU throttle** and a Fast 4G profile (9 Mbps, 150 ms), Firebase stubbed as in the phone tests. Medians of six runs.

| What | Now | Note |
|---|---|---|
| Boot, cold (index.html to the first Programs draw) | **1.76 s** | index.html 233 KB gzipped; DOMContentLoaded 0.64 s; long tasks 1.1 s |
| Boot, warm (reload, HTTP and SW cache) | **1.33 s** | DOMContentLoaded 1.2 s: almost all of it script and the first draw |
| Warm boot, CPU by function | `render` 559 ms self, everything else ≤ 41 ms | the Programs page's first draw is the boot's biggest single cost |
| Library fetch / parse | 50 KB gzipped, 205 ms on the wire cold; **≤ 5 ms** to parse 275 KB | not a cost |
| Evaluating the page's scripts | `exercises.js` 116 ms; builder, figures, formats 1–2 ms each | `exercises.js` is 671 of the page's 959 KB of script (139 of 233 KB gzipped) |
| Redraw, Programs page | **0.40 s**; 390 KB of HTML, 8,506 nodes | every redraw, including each keystroke in its search |
| Redraw, Exercises page | **3.0 s**; 3.7 MB of HTML, 33,888 nodes | an inline SVG figure for each of the 1,447 exercises |
| Redraw, other pages | 2–15 ms (program, day, stats, muscles, build, settings) | |
| Sign-in with 20 started programs | **1,060 progress listeners** + 3 collection listeners; 1,063 first deliveries; 1 redraw | one listener per *library* program, started or not |
| Memory | 3.9 MB → 9.6 MB after 30 program pages → 11.6 MB after 30 day pages | no leak worth a finding; 697 nodes on a day page |
| Build | main 45 s cold → 5 s cached (CI); 11.6 s warm on the cloud machine | the build cache, #381–#388 |
| CI, a PR | unit 402 s, UI 200–338 s per theme, finder smoke 98 s, containers ~25–40 s each | run 38359068531 (#389) |
| CI, main | test job 3.6 min (cold diff 72 s, finder smoke 97 s), recipe cache 0.8 min warm (7.7 min cold, once) | run 38360079345 |

Against Phase 23's close (12 Oct): the page and data files are unchanged in size (index.html 233.5 KB gzipped, 23% of
its 1 MB gate), so there is still no case for splitting the library (137).

## Findings

### A1 · Sign-in follows every library program: 1,060 Firestore listeners
- **What:** `attach()` subscribes to `progress/<pid>` for every id the store knows (`programIds.forEach(follow)`), and
  `main.js` hands it every library id (`programIds: [...programs.ids(), ...KB_LIBRARY.ids]`). A person with 20 started
  programs opens 1,060 document listeners and gets 1,063 first deliveries at every sign-in and app open.
- **Where:** `app/store.js:97` (attach), `:113` (follow); `app/main.js:10`; `firebase-sync.js:56` (one `onSnapshot`
  per document).
- **Evidence:** measured (above): `subscribe` 1,060, `subscribeAll` 3, deliveries 1,063, while only 20 programs have
  any progress. The phone keeps 1,060 listeners open for the session. On billing, Firestore's billing page says a
  query with no results costs one read but doesn't say how a listener on a missing single document is billed: each
  open costs between the 20 documents that exist and ~1,060 reads (the free tier is 50,000 a day). One collection
  listener would cost exactly the documents that exist.
- **Look ahead (275):** Phases 26, 27 and 35 add programs, so this grows with the library; Phase 33's sync status
  and per-program fields (pause, weekdays) ride on the same listeners.
- **Proposed fix:** one collection listener for progress, `subscribeAll('progress')` (the remote adapter already
  has it), delivering only the documents that exist; `onRemote` runs per changed document as today. The stored
  documents and their shape don't change, but it is a sync rule, so it goes to Noam first (187).
- **Size:** M (store, adapter, the memory remote and the sync tests).

### A2 · The Exercises page takes 3 s to draw, and every redraw draws it whole
- **What:** the page renders all 1,447 cards, each with its inline SVG figure: 3.7 MB of HTML, 33,888 nodes. Any
  redraw on that page (a favourite or skip tapped, a `prefs` doc arriving from another device: `main.js:36`) pays
  the whole 3 s again on a mid phone. Its search already refreshes only the list (`exRefresh`), so typing is spared.
- **Where:** `app/pages/exercises.js:71` and `:125` (the card), `app/ui.js:31` (rerender = whole page).
- **Evidence:** measured `render()` on `#exercises`: 3,038 ms at 4× (other pages 2–400 ms).
- **Look ahead:** Phase 35 (threesomes, every act at every place) and Phase 28 (explicit drawings and loops) add
  exercises and richer figures to the same list.
- **Proposed fix:** draw each card's figure only when it scrolls near view (an empty `figbox` filled by one
  IntersectionObserver) and give the cards `content-visibility: auto`; the text stays searchable and countable.
  Expect the HTML to drop to roughly a tenth.
- **Size:** S.

### A3 · The Programs page redraws whole on every keystroke in its search
- **What:** typing in `#prog-search` calls `render()` (shelves, chips, counter) per keystroke: 0.4 s each at 4×, so
  typing lags on a phone. The same page's first draw is also the boot's biggest cost (559 ms of the warm boot).
- **Where:** `app/main.js:231-233`.
- **Evidence:** measured `render()` on `#programs`: 397 ms, 8,506 nodes.
- **Proposed fix:** refresh only the results part (as `exRefresh` does for exercises) and debounce it to the next
  frame; leave the first draw as it is unless A2's approach (figures/cards when near view) is cheap to reuse here.
- **Size:** S.

### A4 · The exercise catalogue is 70% of the first download
- **What:** `exercises.js` is 671 KB of the page's 959 KB of script (139 of 233 KB gzipped) and 116 ms to evaluate
  at 4×; 831 of its 1,447 exercises are couple ones, needed only on couple pages.
- **Where:** `build.js` SCRIPTS (the catalogue is inlined), `exercises.js`.
- **Evidence:** per-module sizes and evaluation time, measured (above).
- **Look ahead:** Phases 27 (calisthenics), 35 (catalogue 14 couple acts) and 28 (drawings) all grow this file; the
  1 MB gate is far, so this is about boot time, not the gate.
- **Proposed fix:** not now. The boot is 1.3–1.8 s and this is ~10% of it; moving couple exercises out of the page
  means every page that names an exercise waits on a fetch. Worth an issue to revisit when Phase 35 lands, with the
  number to beat (116 ms).
- **Size:** L (issue).

### A5 · The offline cache keeps every old program list
- **What:** the list's address is versioned (`data/library.json?v=<hash>`) and both the service worker and the page's
  `offlineCache` store it under that full URL; nothing ever deletes an older one. Each deploy that changes the
  library leaves another ~275 KB in `kettle-bar-v2` on the phone (Phase 23 alone was ~25 such deploys, ~7 MB).
- **Where:** `app/pages/core.js:9` and `:19`, `sw.js` (`refresh`), `app/main.js:305` (deletes only `index.html`).
- **Evidence:** grep: no `caches.keys()` or `delete` of `library.json` anywhere; the cache key includes the query.
- **Proposed fix:** once the current list has loaded, delete the cache's other `data/library.json?v=` entries.
- **Size:** S.

### A6 · CI spends ~3 minutes a PR on work the build cache already did, or that the change didn't touch
- **What:** three items on every PR run:
  1. The test job's unit step runs `warm-test-cache.js`, which builds the whole library cold
     (`tests/helpers/library.js` calls `buildAll()`), while the build cache is restored only later, for the Build
     step.
  2. The finder smoke step (98 s: 60 s of it making 1,060 program vectors) runs on every PR, whatever changed.
  3. The phone tests' `skip.spec.js` builds the whole library inside a Playwright worker (60–72 s; code review,
     slowest phone tests).
- **Where:** `.github/workflows/deploy.yml` (step order; the finder smoke step's `if`), `tests/helpers/library.js`.
- **Evidence:** run 38359068531's step times; the restore step sits after the unit step.
- **Proposed fix:** restore the build cache before the unit step and let `tests/helpers/library.js` build through
  `cachedBuild()`; run the finder smoke only when the finder, its vendored files, `build.js` or the program list's
  shape changed (and always on main).
- **Size:** S.

### A7 · main's recipe-cache job holds main's queue
- **What:** the workflow's concurrency group (`test-refs/heads/main`, no cancelling) covers the whole run, so the
  next main run waits for `recipe-cache` to finish. Warm it is 0.8 min; its one cold run was 7.7 min, and any change
  to the builder or recipe code makes the next one cold again.
- **Where:** `.github/workflows/deploy.yml` (`concurrency`, the `recipe-cache` job, decision 331).
- **Evidence:** run 38359061430 deployed at 06:55 but its recipe job ran to 07:03:26 (cold); the next main run, queued
  at 07:01:12, started its test job at 07:03:29, three seconds after.
- **Proposed fix:** move `recipe-cache` to its own workflow started by `workflow_run` on a green main run, with its
  own concurrency group.
- **Size:** S.

## Not findings (checked)
- **Splitting the library (137):** sizes unchanged since Phase 23's close; no case.
- **Memory:** 11.6 MB after 60 page opens; the day page holds 697 nodes.
- **Sync redraws:** a sign-in with 20 started programs redraws once (the "each first reply redraws the page" of
  ticket 17.2 is fixed).
- **Library parse:** ≤ 5 ms at 4×.

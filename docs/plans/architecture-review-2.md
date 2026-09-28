# Architecture review II: deepening plan

Source of truth for the six deepenings from the second architecture review (28 Sep 2026; report:
claude.ai artifact "Kettle & Bar Architecture II"). Noam: "Fix all". These are refactors, so **behaviour
stays the same**. Three things must not change: the phone UI suite, the generated programs (byte-identical)
and the stored data (device storage keys and the Firestore document shape), so phones and backups need no
migration. Vocabulary: module, interface, depth, seam, adapter, leverage, locality
([CONTEXT.md](../../CONTEXT.md) for the domain names).

## Tickets

In dependency order; one ticket = one branch = one PR, each starting from its **Test first** with `/tdd`.

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/architecture-review-2` | done (PR #35) |
| 1 | Program Catalogue: programs on demand | refactor | 0 | `refactor/program-catalogue` | done (PR #36) |
| 2 | Program Progress: one value, one document codec | refactor | 0 | `refactor/program-progress` | done (PR #37) |
| 3 | The Day: a day as you'll do it | refactor | 1, 2 | `refactor/day-module` | done (PR #38) |
| 4 | Import plan: one step | refactor | 2 | `refactor/import-plan` | todo |
| 5 | Stats report: scope and span behind one interface | refactor | 3 | `refactor/stats-report` | todo |
| 6 | Program Builder usable in the browser | refactor | 0 | `refactor/pure-builder` | todo |

### 1. Program Catalogue (`app/programs.js`)
Every page module reads the whole `PROGRAMS` array (41 reads). Loading programs when opened (roadmap item
11) needs one module to answer instead.
- **Interface:**
  - `ids()`, `list()`, `summary(pid)`, `has(pid)`: summaries carry the day count and the exercises used.
  - `get(pid)` / `day(pid, n)`: synchronous once loaded; `load(pid)` returns a Promise.
  - `programsUsing(exId)`.
- **Adapter now:** inlined (all programs in the page, all loaded). Item 11 adds a fetched, offline-cached
  adapter; Phase 6 adds your own programs. Summaries and the exercise index are made at build time.
- Files: `app/programs.js`, `tests/programs.test.js`, `build.js`, `app/views.js`, `app/main.js`, `package.json`.
- **Test first:** the catalogue over the inlined adapter: ids, list with day counts, `has`, `get`/`day`,
  `load` resolves, `programsUsing` agrees with scanning every day, unknown ids return nothing.
- **Done when:** `views.js` and `main.js` read programs only through the catalogue (a test greps for
  `PROGRAMS`/`PBYID`), and every suite is green.

### 2. Program Progress (`app/progress.js`)
A program's progress is two parallel maps (`done`, `swapsOf`); its stored shape and merge rules are spread
over store, firebase-sync, the nightly script, backup and views.
- **Interface:** a value `{ done, swaps }` with:
  - `fromDoc` / `toDoc`: the Firestore codec.
  - `fromDevice` / `toDevice`: the same two storage keys as today.
  - `isDone`, `count`, `toggle`, `withSwaps`, `nextDay(p, dayNumbers, after?)`, `entries(pid, p)`.
  - `mergeFirstSync(local, remote)`, `importMerge(current, incoming, mode)`.
- The store keeps one value per program. The remote adapters deliver the raw document, `{ done, swaps }` or nothing.
- Files: `app/progress.js`, `tests/progress.test.js`, `app/store.js`, `firebase-sync.js`, `app/backup.js`, `scripts/backup-progress.js`, store tests.
- **Test first:**
  - the codec round-trips; a document without swaps reads as none;
  - first sync (days earliest-wins, swaps: the cloud's then the device's new ones);
  - import merge and replace;
  - `nextDay` after a day, then from the start.
- **Done when:** only `app/progress.js` names the document's fields (grep test), and the device and cloud
  shapes are unchanged (a test reads today's stored strings).

### 3. The Day (`app/day.js`)
The swap and session glue sits in module globals across `views.js`/`main.js`. The "when does a swap apply"
rule is written twice (`swaps.js` and `undoButton`).
- **Interface:** `createDays({ catalogue, store, cat })` → `open(pid, n)` → a Day with:
  - `day` (swaps applied) and `session()` (ticks carried over when a swap changes the exercises);
  - `alternatives(bi, i)`, `swap(bi, i, to, { onward })`, `undo(bi, i)`, `swapBehind(bi, i)`.
  - Plus `resolved(pid, n)` for stats.
- `swaps.js` gains `swapBehind`, which `undoSwap` uses: the rule then lives once.
- Files: `app/day.js`, `tests/day.test.js`, `app/swaps.js`, `app/views.js`, `app/main.js`.
- **Test first:** in Node with the in-memory store and inlined catalogue:
  - swap today: the new exercise shows and ticks stay;
  - onward reaches later days only;
  - undo restores;
  - `swapBehind` names an onward swap;
  - alternatives come back.
- **Done when:** no `live`, `cardDay`, `sessionFor` or copied swap rule remains in the page modules;
  `swapState` holds only which sheet is open.

### 4. Import plan (`app/backup.js`)
The import review is split between `main.js` and `views.js` through `importState`, and the day counts are
computed twice.
- **Interface:** `planImport(current, text, { known, uid, name })` returns the review (diff, swap notes,
  unknown, added, removed) plus `result(mode)` and `message(mode)`. It throws a message for people.
- Files: `app/backup.js`, `tests/backup.test.js`, `app/main.js`, `app/views.js`.
- **Test first:** `planImport` on a file with new days, fewer days, swaps and an unknown program:
  - the review numbers;
  - the progress after Merge and after Replace;
  - the messages ("Merged: 2 days added.").
- **Done when:** `main.js` and `views.js` do no counting or merging for imports.

### 5. Stats report (`app/stats.js`)
Callers assemble entries, `dayOf`, program filters and ranges themselves (`weekLine`, `viewStats`).
- **Interface:** `report({ entries, dayOf, EX }, { scope: 'all' | pid, span, now })` returns
  `{ from, to, totals, weeks, muscles }`, with `weeks` only for the longer spans and `muscles` ranked.
- Files: `app/stats.js`, `tests/stats.test.js`, `app/views.js`.
- **Test first:** `report` for each span and for all programs vs one program, matching what the Stats page
  and the finish card show today.
- **Done when:** `weekLine` and `viewStats` make one call each.

### 6. Program Builder in the browser (`program-builder.js`)
`build(cfg)` pulls in `fs`, the config list and the catalogue, so it only runs in Node. Build-your-own
(Phase 6) needs it in the page.
- **Interface:** `build(cfg, cat)` is pure over an injected Exercise Catalogue. Frozen programs and the
  config list stay in the Node build (`buildAll`). The file becomes a UMD module like the others.
- Files: `program-builder.js`, `tests/builder.test.js`, `build.js`, `scripts/program-times.js`.
- **Test first:** `build(cfg, cat)` runs inside a sandbox with no `require` or `fs`, and gives the same
  program as today.
- **Done when:** all 29 programs are byte-identical, and the builder works without Node.

## Challenge round
- **Weakest assumption:** that six refactors can keep behaviour identical. That's checked three ways: the
  phone UI suite (100+ flows, light and dark), the byte-identical program check, and a stored-data test.
  The stored-data risk is the one that would hurt, since phones hold real progress. I read `app/store.js`:
  device keys are `kb-progress-<pid>` and `kb-swaps-<pid>`, and the cloud document is
  `{ done, swaps, updatedAt }`. **Plan change:** ticket 2 keeps both exactly and adds a test that reads
  today's stored strings.
- **What I hadn't read:** the remote-adapter contract in the tests. The in-memory adapter currently splits
  the document into `docs` (days) and `swaps`, which is not how Firestore holds it. **Plan change:** ticket 2
  moves the adapters to delivering the whole document, and the in-memory adapter stores whole documents
  like Firestore. The store tests change their assertions accordingly.
- **The lazier version:** only ticket 1, the one roadmap item 11 needs right away. Not proposed, because
  Noam asked for all six. The order still puts ticket 1 first, and each ticket ships working on its own.

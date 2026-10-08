# Phase 33: day to day II (weekdays, a day note, pause, compare, programs that use this, sync status)

From [#97](https://github.com/noamros9/kettle-bar/issues/97) (Claude's ideas, round 2): Noam picked six on 8 Oct 2026,
one issue each: [#291](https://github.com/noamros9/kettle-bar/issues/291) training weekdays,
[#292](https://github.com/noamros9/kettle-bar/issues/292) a day note,
[#293](https://github.com/noamros9/kettle-bar/issues/293) pause, In progress and Paused rows, Start over,
[#294](https://github.com/noamros9/kettle-bar/issues/294) compare,
[#295](https://github.com/noamros9/kettle-bar/issues/295) programs that use this,
[#296](https://github.com/noamros9/kettle-bar/issues/296) sync status. Grilled 8 Oct 2026; decisions 248–257 below.
After Phase 32 (export). Claude plans; Noam picks Grok tickets at hand-off.

## Decisions
Grilled 8 Oct 2026 with Noam (global decision numbers).

**What's in**
- **248 · Six of #97's eight, one issue each, one phase** after Export; #97 closes linking them. *(8 Oct)*
- **249 · Not picked, so decided against:** the 60-day strip on the program page and a Random workout home-screen
  shortcut (in ROADMAP.md's list). *(8 Oct)*

**Training weekdays** (#291)
- **250 · Per program, set on its page, synced.** The day the Today's workout shortcut opens says "Next workout
  Thursday"; hidden while the program is paused; they pre-fill the calendar export's weekdays (Phase 32). *(8 Oct)*
- **271 · A tick on another weekday just counts**, no mark. *(8 Oct)*

**A day note** (#292)
- **251 · One line, 140 characters**: typed on the finish screen, editable from History, shown on the day page;
  synced. Words only (no weights or reps, which stay decided against). *(8 Oct)*
- **269 · One note per time done**: a day done again (Phase 30) has a note per date. *(8 Oct)*

**Pause, In progress, Start over** (#293)
- **252 · Pause**: a Paused badge and Resume; a paused program is never picked for Today's workout; synced. *(8 Oct)*
- **253 · Rows at the top**: after the rest-day and Do now cards, Favourites, In progress (a day done this round, not
  finished), then Paused (was In progress, Paused); each program also stays on its own shelf. *(8 Oct)*
- **268 · The three rows slide sideways**: 3 cards, then a Show all tile opening the row as its own stacked page (own
  link, no filters). The shelves keep 6 + Show all. *(8 Oct, from a mock)*
- **270 · Paused still counts as started**: "Ready for II" shows, and Phase 26 never re-times it. *(8 Oct)*
- **254 · Start over = a new round, history kept**: today's Start Round button reading "Start over", with "Round 2" small
  under it; nothing erases done days. *(8 Oct)*

**Finding** (#294, #295)
- **255 · Compare**: a Compare button on a program page, then pick the second; side by side: days per week, length,
  minutes, formats and gear, the muscle maps with Phase 30's group bars beside them, exercises in common. *(8 Oct)*
- **256 · Programs that use this** grows "Also in": library and your own programs, most uses first, with how many
  days each, the first 10 then Show all. *(8 Oct)*

**Sync status** (#296)
- **257 · In Settings: account, last synced, changes not yet uploaded, Sync now.** No device list (it would need a
  new collection and a rules change). *(8 Oct)*

## What lands
- **On a program's page**: Pause / Resume, the training weekdays (seven day chips), Start over where Start Round is
  today ("Start over", "Round 2" small under it), and Compare.
- **On the Programs page**, under the rest-day and Do now cards: **Favourites**, **In progress** and **Paused** as
  sideways rows of 3 cards and a **Show all** tile, which opens the row stacked on its own page (`#row/<name>`); the
  programs stay on their shelves too.
- **Today's workout** skips paused programs; the day it opens says "Next workout Thursday" when the program has
  weekdays and today isn't one (or today's is done).
- **A day note**: a one-line box on the finish screen; the note shows on that day's page and in History, where it can
  be edited.
- **Compare** (`#compare/<a>/<b>`): two columns.
- **The exercise page's "Programs that use this"**: counted, sorted, yours included.
- **Settings → Sync**: who's signed in, when it last synced, what's waiting to upload, Sync now.

## Stored shapes
Everything new lives in collections that exist (`progress`, `prefs`): **no rules change**. In a program's progress
document: `paused` (time, or absent), `weekdays` (0–6, Sunday first, or absent) and `notes` (`{ day: text }` for the
current round, a list per day when Phase 30's `again` gives a day more than one date, 269; a new round carries the old round's notes into its `past` entry, as `done` and `swaps` are). Old
documents and old backups have none of them and read as "not paused, no weekdays, no notes"; an old app reading a new
document ignores the fields, and a merge keeps the newer of each by the document's existing timestamps.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/open-issues-8oct` | done (PR #297) |
| 1 | Progress shapes: paused, weekdays, notes | feature | – | `feature/p33-shapes` | todo |
| 2 | Pause, the In progress and Paused rows, Start over (#293) | feature | 1 | `feature/pause-rows` | todo |
| 3 | Training weekdays and "Next workout" (#291) | feature | 1 | `feature/weekdays` | todo |
| 4 | A day note (#292) | feature | 1 | `feature/day-note` | todo |
| 5 | Compare two programs (#294) | feature | – | `feature/compare` | todo |
| 6 | Programs that use this (#295) | feature | – | `feature/used-in` | todo |
| 7 | Sync status in Settings (#296) | feature | – | `feature/sync-status` | todo |
| 8 | Close the phase: CONTEXT.md, archive | plan | 2–7 | `plan/p33-close` | todo |

Tickets 5, 6 and 7 share no files with 1–4 and can run beside them (the cap of 2). Tickets 2 and 3 both edit
`app/pages/program.js`: the second stacks on the first once its PR is open.

### 1. Progress shapes
- **Build:** `app/progress.js` learns `paused`, `weekdays` and `notes`: `setPaused(v, time|null)`,
  `setWeekdays(v, list)`, `setNote(v, day, text)` (trimmed, 140 characters, empty removes it), `noteOf(v, round,
  day)`; `startRound` moves `notes` into the past round; `fromDoc`/`toDoc`, `mergeFirstSync` and `importMerge` carry
  them. `app/store.js` exposes the setters. Backup export carries them with no change of shape version.
- **Files:** `app/progress.js`, `app/store.js`, `app/backup.js` (only if it lists fields), `tests/progress.test.js`,
  `tests/store.test.js`, `tests/backup.test.js`, `tests/fixtures/` (an old backup without the fields, if none exists).
- **Test first:** an old document reads as not paused, no weekdays, no notes; the three round-trip through
  `toDoc`/`fromDoc`, a backup and `importMerge`; a new round keeps the old notes in `past`; a note over 140
  characters is cut; an old backup still imports.
- **Done when:** gated coverage holds (100% lines and functions, branches ≥95%).

### 2. Pause, In progress and Paused rows, Start over (#293)
- **Build:** the program page gets Pause / Resume and a Paused badge; Start Round becomes "Start over · Round N"
  in the same place, with the same sheet. The Programs page draws Favourites, In progress (≥1 day done this round,
  not all days done, not paused; most recently trained first) and Paused (most recently paused first) as sideways rows
  (scroll-snap, the next card peeking in): 3 cards, then a Show all tile when there are more, opening `#row/<name>`
  (the row stacked, no filters; Back returns, Phase 31). Each row hidden when empty. Phase 26 and "Ready for II" read
  paused programs as started (270). Today's workout (`app/pages/core.js`) skips paused programs (falls back to
  the next most recent, then to the first program, as now).
- **Files:** `app/pages/program.js`, `app/pages/programs.js`, `app/library.js` (the two rows' lists), `app/pages/core.js`
  (the `#row/` route), `app/styles.css`, `tests/library.test.js`, `tests-ui/library.spec.js`, `tests-ui/pause.spec.js` (new),
  `scripts/ui-affected.js`.
- **Test first:** `library.test.js`: who is In progress and who is Paused, and their order; `pause.spec.js`: four
  started programs give 3 cards and Show all, which opens all four stacked; pause a
  started program, it moves to Paused and the Today's workout shortcut opens another program; Resume brings it back;
  Start over keeps the old round in History.
- **Done when:** 390 px screenshots light and dark of the two rows and the program page; no sideways scroll at 360 px.

### 3. Training weekdays and "Next workout" (#291)
- **Build:** seven day chips on the program page (Sun first, as History's calendar is); the day page opened by
  `#today` shows "Next workout Thursday" (or "Today") when the program has weekdays, isn't paused, and today isn't one
  of them or today's day is done; the calendar export's sheet (Phase 32) pre-fills its weekdays from them.
- **Files:** `app/pages/program.js`, `app/pages/day.js`, `app/pages/core.js` (knowing the day came from `#today`),
  the export sheet's file from Phase 32, `app/styles.css`, `tests/weekdays.test.js` (a pure `nextWorkout(weekdays,
  now, doneToday)` in `app/progress.js` or a small module), `tests-ui/weekdays.spec.js`, `scripts/ui-affected.js`.
- **Test first:** `nextWorkout` for every weekday, with and without today done, across the week's end; the spec sets
  Sun/Tue/Thu, opens `#today` on a Monday (a fixed clock) and reads "Next workout Tuesday".
- **Done when:** screenshots of the chips and the line, light and dark.

### 4. A day note (#292)
- **Build:** the finish card (`finishCard` in `app/pages/day.js`) gets a one-line input (140, a counter near the
  limit); the day page shows the note under the title; History shows it on the day and edits it in place; a day done again
  (Phase 30) has a note per date (269).
- **Files:** `app/pages/day.js`, `app/pages/stats.js`, `app/styles.css`, `tests-ui/note.spec.js` (new),
  `scripts/ui-affected.js`.
- **Test first:** type a note on the finish screen, it shows on the day page and in History; edit it in History and
  the day page shows the edit; a second browser on the same account sees it.
- **Done when:** screenshots light and dark.

### 5. Compare two programs (#294)
- **Build:** a pure `app/compare.js` (`KBCompare.of(a, b, EX)` → days per week from the cycle, length in days,
  minutes range, formats, equipment, muscle load per muscle over all days, exercises in common with counts); a
  `#compare/<a>/<b>` page: two columns, two muscle maps (the map the program page already draws); the program page's
  Compare opens a picker (the Programs page search, results as buttons).
- **Files:** `app/compare.js`, `app/pages/compare.js`, `app/pages/program.js`, `app/pages/core.js` (route),
  `build.js` (the scripts), `sw.js` (cache list), `app/styles.css`, `tests/compare.test.js`,
  `tests-ui/compare.spec.js`, `scripts/ui-affected.js`.
- **Test first:** `compare.test.js` on two made-up programs: the group loads (Phase 30's `groupLoads`), the counts, the shared exercises, equipment; the spec:
  Compare from a program, pick a second, both names and both maps show; an own program can be compared.
- **Done when:** 100% coverage of `app/compare.js`; 390 px screenshots light and dark; no sideways scroll at 360 px.

### 6. Programs that use this (#295)
- **Build:** `data/index.json` (`usageIndex` in `build.js`) gets the number of days per program; own programs are
  counted on the device from their built days. The exercise page's "Also in" becomes "Programs that use this": one
  list, most days first, each with "on N days", the first 10 and Show all.
- **Files:** `build.js`, `app/pages/exercises.js`, `tests/build.test.js` (or wherever `usageIndex` is tested),
  `tests-ui/exercise.spec.js`.
- **Test first:** the index for a made-up library counts days; the page lists an own program that uses the exercise;
  more than 10 shows Show all.
- **Done when:** the index's gzip size growth noted in the PR; screenshots light and dark.

### 7. Sync status (#296)
- **Build:** `firebase-sync.js` reports to the page: the signed-in email, the last time a snapshot came from the
  server (not the cache), and whether writes are pending (`hasPendingWrites` per listener, counted); Sync now
  re-enables the network and waits for pending writes. Settings shows them under the sign-in.
- **Files:** `firebase-sync.js`, `app/store.js` (the status it keeps), `app/pages/settings.js`, `tests/store.test.js`,
  `tests-ui/sync.spec.js` (the in-memory remote).
- **Test first:** the status a fake remote reports reaches Settings: "Last synced 14:02", "2 changes waiting", and
  Sync now clears them.
- **Done when:** screenshots light and dark; the phone check (Noam): airplane mode, tick a day, Settings says one
  change waiting; back online, Sync now clears it.

### 8. Close the phase
- CONTEXT.md: **Paused**, **In progress**, **Start over**, **Training weekdays**, **Day note**, **Compare**; decisions
  to `docs/roadmap-archive.md`; the issues closed by their PRs.

## Challenge round
- **Weakest assumption: that notes fit in the progress document.** A 60-day round with a note every day is ~8 KB, far
  under Firestore's 1 MB, and rounds are few; fine. But a note edited on two phones offline merges by the document's
  timestamp, so one edit can be lost. Ticket 1 merges `notes` per day (newer day wins) rather than per document, and
  tests it.
- **What I hadn't read:** how `firebase-sync.js` hands snapshots to the store (one listener per program, or one per
  collection), which decides how "changes waiting" is counted; and whether History draws done days from progress
  `entries` (where a note would ride along) or from Stats. Tickets 7 and 4 read them first.
- **Phase 32 lands first**, so ticket 3 wires the weekdays into an export sheet that exists; if Phase 32 slips, ticket
  3 leaves the pre-fill to it.
- **The lazier version:** pause as a device-only flag, and the rows without a Paused row (paused ones simply leave In
  progress). Not proposed: Noam chose synced (8 Oct) and a Paused row.

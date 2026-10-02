# Phase 13: exercises I skip, and a fourth floor pull

Decided 2 Oct 2026 (Noam), after the architecture review.

- **Exercises I skip:** marked on the **exercise page** ("Skip this exercise"), listed in **Settings** to unskip,
  **synced** (prefs). It applies **everywhere**: every day page, random workouts and build-your-own previews, and a
  stand-in is never itself skipped. A skipped exercise with **no stand-in stays, marked** "You skip this, no
  stand-in" (like "Needs gear"). Stats count the planned day (as travel mode does).
- **Fourth floor-only pull: Reverse snow angels** (upper back, rear shoulders; upper-back led, so it frees a row
  stand-in on heavy pull days).

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan (in the 2 Oct roadmap plan) | plan | – | `plan/roadmap-oct` | done (PR #133) |
| 1 | Skip an exercise: the list | feature | review IV | `feature/skip-list` | done (PR #146) |
| 2 | Skipped exercises swap out everywhere | feature | 1 | `feature/skip-swaps` | |
| 3 | Reverse snow angels | feature | – | `feature/snow-angels` | |

### 1. Skip an exercise: the list
- "Skip this exercise" / "Don't skip" on the exercise page; Settings → **Exercises I skip** lists them with Unskip.
  Stored as `skip: [exercise id]` in the synced prefs, only while not empty.
- **Test first:** `toggleIn` on the prefs; an old prefs doc and backup still import; Settings lists and unskips.

### 2. Skipped exercises swap out everywhere
- The Day module swaps a skipped exercise like travel mode does (same first main muscle and kind of work, else
  looser), combined with travel mode; the Swap list leaves skipped exercises out; random workouts and build-your-own
  previews too. With no stand-in: kept, with a "You skip this" note.
- **Test first:** a day with a skipped exercise gets a stand-in that is neither skipped nor already in the day;
  travel mode + skip together; no stand-in → kept and marked; stats still count the planned day.

### 3. Reverse snow angels
- Floor only, `added: 6` (the catalogue Phase 10 opened), drawings, muscles, cue, reps; joins the `pullBw` pool for
  catalogue 6 builds.
- **Test first:** in Bodyweight only over every library day, rows never keep "Needs gear" on a day with three pulls
  (four or more may); pins unchanged.

## Challenge round
- **Weakest assumption:** that swapping silently is what Noam wants. The card says it (like travel), and Settings
  shows the list.
- **The lazier version:** tickets 1–2 without random workouts and builds. Noam chose "everywhere".

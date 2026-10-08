# Phase 32: export an exercise, a day or a whole program

Issue [#224](https://github.com/noamros9/kettle-bar/issues/224). Grilled 8 Oct 2026 (Noam); decisions 238–247 below.
After Phase 25 (223). Claude plans; Noam picks Grok tickets at hand-off.

## Decisions
Grilled 8 Oct 2026 with Noam (global decision numbers).

**What and for whom**
- **238 · Three levels**: an exercise, a day, a whole program; also your own programs and a random workout in
  progress. *(8 Oct)*
- **239 · For a copy for himself (offline) and for sending to her or a friend.** Export only: no import (your own
  programs already share by link). *(8 Oct)*
- **240 · Couple and After dark content export like everything else**, no warning or trimming. *(8 Oct)*
- **272 · Explicit exercises in the PDF use your view** (Phase 28's approved drawing when signed in, else the figure):
  Noam's choice, an exception to 110's "never leaves Storage". *(8 Oct)*

**Formats**
- **241 · Print / Save as PDF and text to share; a calendar file (.ics) from the program page only.** No image
  (share as image stays decided against). *(8 Oct)*
- **242 · Drawings in the PDF, none in the text.** A program's PDF lists each day's exercises by name, with each
  exercise's drawing and cue once, in a glossary at the back. *(8 Oct)*
- **243 · The text is the workout**: blocks, exercises, sets × reps or holds, rests; no cues or muscles. *(8 Oct)*
- **244 · The level you're on** (not started: Level I); the sheet can switch level. *(8 Oct)*
- **245 · A whole program is one file.** *(8 Oct)*

**Where and how**
- **246 · One Export button per page** (exercise, day, program, random workout) opening a sheet with the formats that
  fit. *(8 Oct)*
- **247 · The calendar file: all-day events from a start date on the weekdays you pick**, pre-filled from the
  program's training weekdays once Phase 33 lands them. *(8 Oct)*
- **273 · A super's calendar file holds all 120 days** (Phase 19), like any program (245). *(8 Oct)*

## What lands
- **An Export button** on the exercise page, the day page, the program page (library and own) and the random workout
  page. It opens a sheet: **PDF** (the print view, then the phone's Print → Save as PDF), **Text** (the phone's
  Share, or Copy where there's none), and on the program page **Calendar**. A level switch (I / II / III) sits on top,
  set to the level you're on.
- **The print view** (`#print/...`): a clean, light page made for paper: the exercise card; a day's blocks with each
  exercise's drawing beside it; a program's about text, then its days (exercises by name, sets × reps, minutes), then
  the glossary (drawing and cue per exercise, once). Works offline: everything is already in the page.
- **The text**: the day or program as a message ("Day 12 · Push · ~34 min" then each block and its lines).
- **The calendar file**: one all-day event per program day from the next day not done, on the weekdays picked, from a
  start date (today by default); each event is "Kettle & Bar · <program> · Day n · <day type>", the day's text as its
  description.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/open-issues-8oct` | done (PR #297) |
| 1 | The words: text and calendar export (`app/export.js`) | feature | – | `feature/export-text` | todo |
| 2 | The print view | feature | – | `feature/print-view` | todo |
| 3 | The Export button and sheet on four pages | feature | 1, 2 | `feature/export-sheet` | todo |
| 4 | Close the phase: CONTEXT.md, archive | plan | 3 | `plan/p32-close` | todo |

Tickets 1 and 2 share no files and can run at once.

### 1. Text and calendar (`app/export.js`)
- **Build:** a pure module (Node and page, `KBExport`): `exerciseText(e, level)`, `dayText(day, level, EX)`,
  `programText(program, level, EX)`, `randomText(made, EX)`; `ics(program, { start, weekdays, fromDay, level }, EX)`
  → an iCalendar file: CRLF lines folded at 75 octets, text escaped, one all-day `VEVENT` per day
  (`DTSTART;VALUE=DATE`, `DTEND` the next day), `UID` `<pid>-d<n>-<start>@kettle-bar`, a `DTSTAMP`. Reps, holds,
  sides and rests come from the same helpers the day page uses (no second copy of how a dose is said).
- **Files:** `app/export.js`, `tests/export.test.js`, `build.js` (the script), `sw.js`, `scripts/ui-affected.js`.
- **Test first:** a made-up day reads as expected at each level; a program's text has every day; the calendar for
  Sun/Tue/Thu from a Monday start puts day 1 on Tuesday and skips days already done; folding, escaping and CRLF
  match RFC 5545 (a 200-character description folds); an After dark day's text is as explicit as its page.
- **Done when:** 100% coverage of `app/export.js`; the .ics opens in Google Calendar on the phone (Noam).

### 2. The print view
- **Build:** a `#print/ex-<id>`, `#print/p-<pid>-d<n>`, `#print/p-<pid>` and `#print/random` route that draws the
  print layout (always the light theme, no top bar, no timer; an explicit exercise drawn in your view, Phase 28's approved
  drawing when signed in, 272) and opens the phone's print dialog once drawn
  (`window.print()`), with a "Back" link for when it's dismissed. A program's days, then the glossary of every
  exercise it uses, each figure drawn once. `@media print` rules: page breaks between days kept together, figures
  sized for A4.
- **Files:** `app/pages/print.js` (new), `app/pages/core.js` (route), `app/styles.css` (print rules), `build.js`,
  `sw.js`, `tests-ui/print.spec.js` (new), `scripts/ui-affected.js`.
- **Test first:** each of the four print routes draws its title, every exercise of the day or program, and (for a
  program) one glossary entry per distinct exercise; `page.pdf()` of a 60-day program finishes and is under 40 pages.
- **Done when:** the PDF of a 60-day program and of one day attached to the PR; offline (the service worker only) the
  print view still draws.

### 3. The Export button and sheet
- **Build:** one Export button on the exercise, day, program and random-workout pages; the sheet (as the round sheet
  is drawn): the level switch, PDF (goes to the print route), Text (`navigator.share({ text })`, else copy with a
  "Copied" note), and on the program page Calendar: a start date (today), seven weekday chips (pre-filled from the
  program's weekdays when Phase 33 has them, else none picked and the button waits for one), Save (`navigator.share`
  with the file where files can be shared, else a download).
- **Files:** `app/pages/exercises.js`, `app/pages/day.js`, `app/pages/program.js`, `app/pages/random.js`,
  `app/pages/export-sheet.js` (new), `app/styles.css`, `tests-ui/export.spec.js` (new), `scripts/ui-affected.js`.
- **Test first:** each page's Export opens the sheet with the right formats (Calendar on the program page only); Text
  copies the day's text (clipboard read in the spec); Calendar downloads a file that `KBExport` parses back to N
  events; the level switch changes the reps in the text.
- **Done when:** 390 px screenshots light and dark of the sheet; no sideways scroll at 360 px.

### 4. Close the phase
- CONTEXT.md: **Export**, **Print view**; decisions to `docs/roadmap-archive.md`; #224 closed by ticket 3's PR.

## Challenge round
- **Weakest assumption: that `window.print()` saves a PDF on his phone.** Chrome on Android prints to "Save as PDF";
  an installed home-screen app (standalone display) may not show the print dialog. Ticket 2 checks it on the phone
  first (Noam), and if it fails, the print view opens in the browser (`target=_blank`) instead.
- **What I hadn't read:** how the day page says a dose (reps, holds, sides, per-side) and rests, and whether one helper
  does it or the page builds strings inline. Ticket 1 reads `app/pages/day.js` and `app/day.js` first, and moves the
  wording into a shared helper if it's inline, so the text and the page never disagree.
- **Size:** the print view and the sheet add page code; the 1 MB gzip gate (127) has room, and the module could be
  lazy-loaded like the recipe book if it doesn't.
- **The lazier version:** text only (no PDF, no calendar). Not proposed: Noam wants the drawings for printing and
  the calendar (8 Oct).

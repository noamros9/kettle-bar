# Phase 19: super programs

Issue [#186](https://github.com/noamros9/kettle-bar/issues/186). Grilled 4 and 7 Oct 2026 (Noam); decisions 43 and
146–152, 164 in [ROADMAP.md](../../ROADMAP.md). After Phase 27 (134), once the library it chains is final.

## What lands
- **A super program** is a program of its own (146): **120 days, levels every 40** (147), made of **3–6 library
  programs** that **take turns day by day**, **weighted per super** (149, 152): Iron PPL 2 days for every 1 of Yoga
  Flow. Days 41–80 are Level II, so each part gives its Level II days there (150); a part gives its days of a level
  **evenly spaced across its 20** (152). Ticking a super's day never touches the programs it is made of.
- **36 ready-made supers on a Super shelf** (148), in today's style with no review first (189), and **your own** in Build your own (43, 148), stored like an own
  program.
- **Each day says where it comes from** ("from Iron PPL"), and the program page shows the parts and their weights as
  a strip (151).

## Also settled (7 Oct, evening)
- **Parts:** solo After dark programs may be parts, couple ones never (179); parts of any lengths, the card shows the
  range (182). A 30-day part (185) has 10 days a level, so it gives at most 10 days per super level.
- **Swaps, Round 2 and Short on time** work as in any program, in the super's own progress (190).
- **Your own:** weights 1–3 and a share link (175).
- **Its own day names** (195): each super config has a `names` list like any program's; the "from" line sits below.
- **Stats under the super only** (196). **A tab of its own after Variety** (197).

## How a super is built (164)
- In each level (days 1–40, 41–80, 81–120), part *i* with weight *w* of total *W* gets *n* = round(40·*w*/*W*) days
  (rounding fixed so the level holds 40), at most the part's days in that level (20, or 10 for a 30-day part); the creator refuses weights that would
  ask for more.
- Its *n* days are the part's days of that level (`levelOf(60, d)`), every (20/*n*)-th, starting from the first.
- The order inside a level is a smooth weighted round-robin (each turn goes to the part furthest behind its share),
  so a weight-2 part comes up twice as often, spread out, never in a run.
- A super day is a copy of the part's built day (swaps aside) with the super's day number, its `level` set to the
  super's, and `from: partId`. A library super is pinned like any program. An own super is built in the page from
  the library's days (the library is pinned, so the same choices always give the same 120 days).

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/unplanned-phases` | done (PR #281) |
| 1 | The composer and 120-day programs | feature | – | `feature/super-compose` | todo |
| 2 | Ready-made supers 1–12 and the Super shelf | content | 1 | `content/super-library-a` | todo |
| 2b | Ready-made supers 13–24 | content | 2 | `content/super-library-b` | todo |
| 2c | Ready-made supers 25–36 | content | 2b | `content/super-library-c` | todo |
| 3 | The pages: "from" line, parts strip, 120-day levels | feature | 1 | `feature/super-pages` | todo |
| 4 | Your own super in Build your own | feature | 2c, 3 | `feature/super-own` | todo |
| 5 | Close the phase: CONTEXT.md, archive | plan | 4 | `plan/p19-close` | todo |

Ticket 3 can build alongside tickets 2–2c (stacked on 1; those edit configs and pins, 3 the pages).

### 1. The composer and 120-day programs
- **Build:** `app/super.js` (pure, Node and page, `KBSuper`): `compose(parts: [[id, weight]], daysOf: id -> days)`
  returns the 120 days per the rules above, or throws a message (fewer than 3 or more than 6 parts, a part over 20
  days a level, a couple program, an unknown or own program). `app/length.js`: `LENGTHS` gains 120 (levels by thirds
  already give 40 each). `program-builder.js`'s Node path builds a config with `super` by composing from the built
  library (`buildAll` builds supers last).
- **Files:** `app/super.js`, `app/length.js`, `program-builder.js`, `build.js` (the script in the page),
  `tests/super.test.js`, `tests/length.test.js`.
- **Test first:** three parts weighted 2:1:1 give 20, 10, 10 days a level; each part's days are its own of that level
  in their order, evenly spaced; no part has two days in a row when another part is due; every day carries `from`
  and the super's level; 2 parts or a part at 25 days a level is refused.
- **Done when:** 100% lines and functions on `app/super.js`; no pin changes.

### 2–2c. The 36 ready-made supers, 12 a ticket
- **Build:** `configs/super.js`: 12 configs a ticket (`super: [[id, weight], …]`, id, name, subject `Super`, blurb, about,
  `added: 19`), across goals: strength + mobility, strength + conditioning, a fighter's year, kettlebell + yoga, a
  muscle-focus rotation, calisthenics + strength, a balanced 120, a solo After dark + strength (179), and so on, no two
  with the same parts, each of 3–6 programs with weights that
  say the goal (a strength-led super 2:1:1). Minutes on the card: the parts' range. `Super` in `FAMILIES` (Mixed)
  and `SHELVES` (its own tab, after Variety). Ticket 2 also adds the shelf. Names and blurbs in today's style. No couple programs (couple programs
  stay out of builders and mixes).
- **Files:** `configs/super.js`, `programs.config.js`, `app/library.js`, `tests/fixtures/program-days.json`,
  `tests/programs.test.js`.
- **Test first:** 12 more supers a ticket (36 at the end), each 120 days, each 3–6 library programs, none couple, no two
  with the same parts; the Super shelf lists them.
- **Done when:** pinned; the PR description lists each super's name, parts and weights (no review first, 189).

### 3. The pages
- **Build:** the day page shows "from Iron PPL · day 12" under the title (tap opens that program); the program page
  shows the parts strip (each part's name and weight, coloured by its family); level labels read the 40-day thirds
  (Level I days 1–40); the program list and Stats treat a 120-day program like any (done counts out of 120). Stats
  count a super day's family from its blocks (a mixed day's `family` tags carry over in the copy).
- **Files:** `app/pages/day.js`, `app/pages/program.js`, `app/programs.js`, `app/stats.js` (if counts assume 60),
  `app/styles.css`, `tests-ui/super.spec.js`, `scripts/ui-affected.js`.
- **Test first:** `super.spec.js`: a super's day shows its "from" line and opens the part; the program page shows the
  strip; day 41 says Level II; marking day 1 done doesn't add a done day to the part.
- **Done when:** 390 px screenshots light and dark; 360 px no sideways scroll; the PR's CI green.

### 4. Your own super
- **Build:** Build your own gets a "Super" choice: pick 3–6 library programs (the finder's name search), a weight each
  (1–3), a name; Save stores `{ name, choices, seed: 0, catalogue, config: { super: [[id, w]] } }` in
  `users/{uid}/programs/{id}` (no rules change); the Program Catalogue's own source composes its days from the
  library's (fetched; offline from the cache). Edit freezes done days as own programs do (frozen days). A share link
  carries the parts and weights (`g`), like an own program's config.
- **Files:** `app/pages/build.js`, `app/own.js`, `app/programs.js`, `tests/own.test.js`, `tests-ui/build.spec.js`.
- **Test first:** an own super round-trips save, reload, share link and backup import; refused weights show the
  composer's message; editing after 5 done days keeps those 5 days.
- **Done when:** the flow works offline after one online visit; screenshots of the builder's Super step.

## Challenge round
- **Weakest assumption: that copying a part's day keeps it valid at the super's level.** A part's Level II days are
  built with its Level II lever and reps; placed at the super's Level II, they match. But a weight-2 part with 20
  days a level uses every one of its days and a weight-1 part only some: progression within a level is coarser for
  the light parts. Acceptable by 152 (evenly spaced); noted.
- **What I hadn't read:** whether Stats, History and the progress shape assume 60 days anywhere besides
  `app/length.js` (a fixed 60-cell grid, a `day <= 60` check in the store or Firestore rules). Ticket 1 greps for 60
  and `DAYS` first; a rule that caps the day number would need Noam to publish rules (said at the top of the PR).
- **Own programs as parts** were ruled out (152): an own program's edit would change the super's days. If Noam later
  wants them, freezing the part's days into the super at creation is the way, a ticket of its own.
- **The lazier version:** ready-made supers only. Not proposed: Noam asked for both (43, 148). Another: supers as a
  playlist that ticks the source programs. Not proposed: he chose its own progress (146).
- **Longer programs (Phase 26) come first** on purpose: a re-time after supers exist would change pinned super days.

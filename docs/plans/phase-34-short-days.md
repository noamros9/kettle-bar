# Phase 34: short days (15-minute circuits, a 10-minute rest-day flow)

Issue [#110](https://github.com/noamros9/kettle-bar/issues/110). Grilled 8 Oct 2026 (Noam); decisions 258–263 below.
Right after Phase 26 (223, 258). Claude plans; Noam picks Grok tickets at hand-off.

## Decisions
Grilled 8 Oct 2026 with Noam (global decision numbers).
- **258 · Its own phase, right after Phase 26**: it started in the quick fixes (Phase 31) and grew; Phase 26 rewrites
  the random workout's minutes and the length bands first, so this builds on them. *(8 Oct)*
- **259 · Real 15-minute days for every fitness subject**: a short circuit (3–4 moves × rounds), so the random
  workout's 15 builds for every family. Not Signature, not After dark. *(8 Oct)*
- **260 · Hidden day types, not programs**: only random workouts, Build your own and the rest-day flow see them; no
  new shelf programs. *(8 Oct)*
- **261 · Build your own offers 15 for one subject** (a mix of 2–3 still starts at 20). *(8 Oct)* *(changes 204)*
- **262 · The rest-day card offers 10 or 15 min**, from Mobility & posture, Flexibility and Yoga, with breathing.
  *(8 Oct)* *(changes 192's "the rest-day flow keeps 15")*
- **263 · About 5 new breathing drills**, beside the five that are cool-downs today; `added: 15` (237). *(8 Oct)*
- **266 · The drills reach random workouts and the rest-day flow at ticket 3** (`NEWEST` 14 → 15), not ticket 1. *(8 Oct)*
- **267 · Named "<Subject> · 15-min circuit"** on a random workout built from one. *(8 Oct)*

## What lands
- **15 minutes, everywhere it's offered**: the random workout's 15 is never greyed out for a family; Build your own
  shows 15 for a single subject.
- **The rest-day card**: two buttons, 10 min and 15 min, each a flow of mobility, flexibility or yoga poses and a
  breathing drill.
- **No library program changes**: the short circuits and flows are day types the recipe book learns, not programs; no
  pin moves.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/open-issues-8oct` | done (PR #297) |
| 1 | Breathing drills, catalogue 15 | content | – | `content/breathing` | todo |
| 2 | Hidden day types: 15-min circuits, 10 and 15-min rest flows | feature | 1 | `feature/short-day-types` | todo |
| 3 | The minutes: random 15 for all, Build your own 15, rest-day 10 / 15 | feature | 2 | `feature/short-minutes` | todo |
| 4 | Close the phase: CONTEXT.md, archive | plan | 3 | `plan/p34-close` | todo |

### 1. Breathing drills, catalogue 15
- **Build:** about 5 breathing drills (e.g. box breathing lying, physiological sigh, alternate-nostril, humming
  breath, breath-hold walk-down; no duplicates of the five that exist), `cat: 'cooldown'`, `added: 15`, holds in
  seconds, poses drawn like the existing breathing ones, in the exercise families map (Stretch & cool-down). Catalogue
  15 opens: every catalogue-14 pool stays as it was.
- **Files:** `exercises.js`, `figures.js` (poses if a new one is needed), `app/library.js` (`EX_FAMILIES`),
  `tests/catalogue15.test.js` (new, like `catalogue13.test.js`).
- **Test first:** the new drills exist with `added: 15`; no pool at catalogue ≤14 contains them; every existing pin
  is unchanged.
- **Done when:** a contact sheet of the new figures (`node sheet.js`) at 390 px light and dark in the PR.

### 2. Hidden day types
- **Build:** a new `configs/short.js` with one config per fitness subject (not Signature, not After dark), marked
  `hidden: true`, `catalogue: 15`: one day type, a short circuit of 3–4 slots from the subject's own pools (its
  equipment variants as the subject has them), built to 15 min; and three rest flows (Mobility & posture,
  Flexibility, Yoga), each at 10 and 15 min, no equipment, ending on a breathing drill. `programs.config.js` keeps
  `hidden` configs out of the library, the pins and the finder; `recipe-book.js` reads them like any config; `GRID`
  gains 10 (`recipes.js`), tried only for the rest flows (the stretch rule keeps a 40-min day from being tried at 10).
  `npm run recipes` rebuilds `recipes/book.json`.
- **Files:** `configs/short.js`, `programs.config.js`, `recipe-book.js`, `recipes.js`, `recipes/book.json`,
  `tests/recipes.test.js`, `tests/configs.test.js`, `tests/programs.test.js`.
- **Test first:** no `hidden` config appears in the library, `ORDER` or the pins; every fitness subject (but
  Signature) has a day type that fits 15 at some gear; the three rest flows fit 10 and 15 with `bw`; existing recipes
  keep their fit masks except for the new bit.
- **Done when:** `npm run times` shows every hidden day inside its target; the recipe book's size growth noted.

### 3. The minutes
- **Build:** the random workout's 15 builds for every family (no greying for Strength, Cardio & combat, Mixed);
  `KBOwn.MINUTES` and `recipes.js`'s `MINUTES` gain 15 for a single subject, a mix still offering 20 up; `recipe-book.js`'s
  `NEWEST` becomes 15 (266); a random workout from a circuit is named "<Subject> · 15-min circuit" (267); the rest-day
  card shows 10 and 15 (`REST_DAY` becomes `{ subjects: ['Mobility & posture', 'Flexibility', 'Yoga'], minutes: [10,
  15], equipment: 'bw' }`), each button starting its flow; a stored rest-day or random record from before still reads.
- **Files:** `app/random.js`, `app/pages/random.js`, `app/own.js`, `app/pages/build.js`, `recipes.js`,
  `app/pages/programs.js` (the rest-day card), `tests/random.test.js`, `tests/own.test.js`, `tests/recipes.test.js`,
  `tests-ui/random.spec.js`, `tests-ui/build.spec.js`, `scripts/ui-affected.js`.
- **Test first:** every family builds a 15-min random workout at every gear it allows; Build your own offers 15 with
  one subject and not with two; the rest-day card's 10 and 15 both build a flow ending on a breathing drill.
- **Done when:** 390 px screenshots light and dark of the random sheet, the builder's minutes and the rest-day card.

### 4. Close the phase
- CONTEXT.md: **Short circuit** (a hidden day type), the rest-day flow's 10 and 15; decisions to
  `docs/roadmap-archive.md`; #110 closed by ticket 3's PR.

## Challenge round
- **Weakest assumption: that 3–4 moves fill 15 minutes for every subject.** A grip or neck subject's pools are small
  and its moves short; a 15-min circuit may need more rounds than feels right. Ticket 2 builds them, prints each one's
  minutes, and a subject that can't reach 15 with at most 5 rounds is listed in the PR and left greyed (the "why not"
  message stays), rather than padded.
- **What I hadn't read:** whether the random workout and Build your own pick day types by subject from the whole book
  (so hidden ones join on their own) or through the library's program list. Ticket 2 reads `app/random.js`'s
  `candidates` and `recipes.js`'s `pick` first.
- **Catalogue 15 (237):** Phase 23's yoga and Pilates exercises open catalogue 14 and Phase 27's skills move to 16;
  if Phase 23 hasn't landed when this starts, the numbers are checked again (136).
- **The lazier version:** offer 20 where 15 can't build (no new day types). Not proposed: Noam chose real 15-min days
  (8 Oct).

# Phase 38 · Catalogue 18: the workout side catches up (bands, jump rope, 432 exercises, 224 programs)

Grilled 17 Oct 2026 (Noam), during Phase 35's replan. Claude plans; Grok writes the exercises' names and cues and the
program text (368, 339); Claude builds the entries, the gear and the tests. Runs right after Phase 35, before 27.

## Decisions

**The balance (17 Oct 2026, Noam)**
- **401 · Workout ≈ couple ≈ group, by adding only.** After Phase 35 the exercises would be 24% workout (693 of 2,898,
  with 27's 72); this phase brings workout to about a third (1,125 vs couple 1,161 and group 1,044). Nothing is cut. *(17 Oct)*
- **402 · 432 workout exercises, strength-heavy.** Strength 216 (chest, back, shoulders, arms, full body, legs and
  glutes, 36 each); combat and cardio 72; mobility, flexibility and balance 72; core 72. Twelve tickets of 36. *(17 Oct)*

**Gear (17 Oct 2026, Noam)**
- **403 · Two new pieces of gear: resistance bands and a jump rope.** Bands 72, rope 36, inside 402's totals; the
  equipment settings learn both. *(17 Oct)*
- **404 · A subject per gear:** Bands and Jump rope, 12 programs each. *(17 Oct)*

**Programs (17 Oct 2026, Noam)**
- **405 · +8 in the 20 subjects the new exercises land in:** Chest, Back, Shoulders, Arms, Legs & glutes, Strength,
  Kettlebell only, Bodyweight, Boxing, Kickboxing, Fighter, HIIT, Conditioning, Mobility & posture, Flexibility, Balance
  & stability, Core & abs, Mat core, Plyometrics, Gentle / low impact (160). *(17 Oct)*
- **406 · +4 in 10 couple workout subjects** (their gym sets use the new exercises): Beach body, Bedroom stamina,
  Endurance & control, Hip power & thrust, Carry & hold, Flexible & bendy, Strip & show-off, Her pleasure, Quickie,
  Back & knees care (40). His-side text rules hold. *(17 Oct)*

**Build (17 Oct 2026, Noam)**
- **407 · Grok writes text, Claude builds** (368): names and cues from a pasted brief; poses, muscles, reps, gear and
  tests by Claude with a committed emit script. Program blurbs and abouts as 339. *(17 Oct)*
- **408 · Catalogue 18 (Phase 27 moves to 19).** It ships after 35 (16, 17) and before 27, so it takes the next
  number. *(technical, 17 Oct)*

## Tickets

Caps: no exercise ticket over 36, no program ticket over 15 (Noam, 10 Oct 2026).

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/p38-rebalance` | done (PR #493) |
| 1 | Bands and jump rope: props, equipment settings, stand-ins (403) | feature | – | `feature/p38-gear` | todo |
| 2a | Chest, 36 (6 bands) (402) | content | 1 | `content/p38-chest` | todo |
| 2b | Back, 36 (6 bands) (402) | content | 1 | `content/p38-back` | todo |
| 2c | Shoulders, 36 (6 bands) (402) | content | 1 | `content/p38-shoulders` | todo |
| 2d | Arms, 36 (6 bands) (402) | content | 1 | `content/p38-arms` | todo |
| 2e | Full body, 36 (6 bands) (402) | content | 1 | `content/p38-full` | todo |
| 2f | Legs and glutes, 36 (6 bands) (402) | content | 1 | `content/p38-legs` | todo |
| 3a | Combat and cardio, first 36 (18 rope) (402) | content | 1 | `content/p38-combat-a` | todo |
| 3b | Combat and cardio, second 36 (18 rope) (402) | content | 1 | `content/p38-combat-b` | todo |
| 4a | Mobility, flexibility, balance, first 36 (12 bands) (402) | content | 1 | `content/p38-mobility-a` | todo |
| 4b | Mobility, flexibility, balance, second 36 (12 bands) (402) | content | 1 | `content/p38-mobility-b` | todo |
| 5a | Core, first 36 (6 bands) (402) | content | 1 | `content/p38-core-a` | todo |
| 5b | Core, second 36 (6 bands) (402) | content | 1 | `content/p38-core-b` | todo |
| 6 | Pools and pins for catalogue 18; Bands and Jump rope subjects (404, 408) | feature | 2a–5b | `feature/p38-pools` | todo |
| 7a–7t | +8 programs, one ticket per subject, in 405's order (405) | content | 6 | `content/p38-<subject>` | todo |
| 7u | Bands, 12 programs (404) | content | 6 | `content/p38-bands` | todo |
| 7v | Jump rope, 12 programs (404) | content | 6 | `content/p38-jump-rope` | todo |
| 7w | +4: Beach body, Bedroom stamina, Endurance & control (406) | content | 6 | `content/p38-couple-a` | todo |
| 7x | +4: Hip power & thrust, Carry & hold, Flexible & bendy (406) | content | 6 | `content/p38-couple-b` | todo |
| 7y | +4: Strip & show-off, Her pleasure (406) | content | 6 | `content/p38-couple-c` | todo |
| 7z | +4: Quickie, Back & knees care (406) | content | 6 | `content/p38-couple-d` | todo |
| 8 | Close the phase: measure the balance, archive | plan | 7a–7z | `plan/p38-close` | todo |

Bands: 6 × 6 strength + 24 mobility + 12 core = 72; rope: 36 in combat and cardio (403).

### 1. Bands and jump rope (Opus; 403)
- **Build:** a band and a rope prop in `figures.js` (as the bar and kettlebell are drawn, in `--kit`); `equip: ['band']`
  and `['rope']` on an exercise, as `bar` is (`needs`, `exercises.js`); the equipment settings and `EQUIP` modes let a
  program allow or skip each, and bodyweight and kettlebell-only programs never deal them; a stand-in for each when the
  gear is off. A stub exercise tests it.
- **Files:** `figures.js`, `exercises.js`, the equipment setting's view, `tests/gear.test.js`, a UI spec.
- **Test first:** a stub band exercise draws its band; `EQUIP.bw` and `EQUIP.kb` reject it; with bands off, its stand-in
  is dealt; no existing pool changes.
- **Done when:** the tests pass; 390 px screenshots of a band and a rope stub, light and dark.

### 2a–5b. The exercises (Grok text, Claude builds; 402, 403, 407)
- **Build:** the ticket's 36 at `added: 18`, in the existing shape (pose, muscles, reps or seconds, load, gear). Grok
  writes names and cues only; Claude builds the rows with a committed emit script and checks each drawing. New
  movements, not renamed old ones: an id or a name that matches an existing exercise fails the test.
- **Files:** `exercises.js` (new entries at the end), the emit script, `tests/catalogue18.test.js`.
- **Test first:** the ticket's count per category and gear; every id and name new; muscles and loads valid.
- **Done when:** the counts match; Claude checked the contact sheet; CI green.

### 6. Pools and pins, catalogue 18 (Opus; 404, 408)
- **Build:** as Phase 35's ticket 5: the catalogue-18 pools by `POOL_ADDS` (no existing pool moves), the Bands and Jump
  rope subjects in `FAMILIES`, pins for the new catalogue only. Own and random workouts move to 18 here.
- **Test first:** the catalogue-17 pool hash is unchanged; every catalogue-18 exercise is in its pool and no older one.
- **Done when:** `npm run pin` adds pins only; CI green.

### 7a–7z. The programs (Grok text, Claude configs; 404–406)
- **Build:** the ticket's programs at `catalogue: 18`, `added: 38`, each using at least one catalogue-18 exercise; the
  couple ones keep the his-side text rules and `docs/explicit-guidelines.md`. `npm run check:new` before pushing.
- **Test first:** the subject's new count; each new program uses catalogue 18; `tests/his-pov.test.js` for 7w–7z.
- **Done when:** Claude read each blurb and about; CI green.

### 8. Close the phase (Opus)
- **Build:** the counts (432 exercises; 224 programs: 160 + 24 + 40) and the balance by category, against 401;
  `docs/roadmap-archive.md`, the ROADMAP row removed.
- **Done when:** the row is archived; decisions 401–408 moved to the archive with a link.

## Challenge round
- **Weakest assumption:** that 432 new workout movements exist that aren't renamed old ones; 621 are built and the
  library already covers the common lifts. Not verified yet: each exercise ticket's test rejects a repeated id or
  name, and the brief pastes the category's existing names so Grok sees what's taken. If a category runs dry, its
  ticket shrinks and the plan says so (never padded).
- **What I hadn't read:** how the equipment setting is shown and stored (ticket 1 reads it before planning the UI);
  a stored setting gains two keys, so progress sync and old backups must still load (CLAUDE.md's never-bend rule).
  Opening `EQUIP` (exercises.js) showed bodyweight and kettlebell-only filter on `load` and `bar`, so the new gear
  joins as `bar` did.
- **The lazier version not taken:** exercises only, no programs (they'd reach the Exercises page, random and own
  workouts). Not taken: old programs are pinned, so without new ones the balance wouldn't show in programs, and Noam
  picked +8 per subject.

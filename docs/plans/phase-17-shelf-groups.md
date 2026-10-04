# Phase 17: shelf groups on the Programs page

Decided 4 Oct 2026 (Noam), after Phase 16 left 497 programs in 41 subjects under four family tabs ("it became
visually messy"). Grilled the same day:

- **Nine groups (ten chips with All):** Strength · Muscles · Cardio · Combat · Yoga & Pilates · Mobility & care · Mixed ·
  Variety · After dark.
- **Programs page only.** The four training families (Strength, Cardio & combat, Mind & body, Mixed) stay underneath:
  Stats, build your own, random workouts and "what next" keep using them, so history stays comparable.

| Group | Subjects |
|---|---|
| Strength | Signature, Strength, Busy week, Bodyweight, Kettlebell only, Kettlebell complexes, Pull-ups, Climber / pull strength |
| Muscles | Chest, Back, Shoulders, Arms, Legs & glutes, Hips & adductors, Calves & lower legs, Neck & traps, Core & abs, Grip & forearms |
| Cardio | Conditioning, HIIT, Plyometrics, Running prep, Court & field sports |
| Combat | Boxing, Kickboxing, Fighter |
| Yoga & Pilates | Yoga, Pilates |
| Mobility & care | Mobility & posture, Flexibility, Balance & stability, Gentle / low impact, Back care |
| Mixed | Strength & stretch, Athlete, Balanced week, Calm strength |
| Variety | Variety |
| After dark | Beach body, Bedroom stamina, Sex positions |

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-17` | done (PR #180) |
| 1 | Shelf groups on the Programs page | feature | – | `feature/shelf-groups` | done (PR #181) |

### 1. Shelf groups on the Programs page
- `SHELVES` in `app/library.js` (the table above); the Programs page's tabs, chips, shelves and counter use it instead
  of `FAMILIES`. A saved family filter that no longer exists falls back to All (as today).
- **Test first:** every subject in `FAMILIES` is in exactly one shelf group and no group names an unknown subject; the
  Programs page shows the ten chips in order and each group's shelves; Stats still list the three training families.
- **Done when:** a 390 px screenshot in both themes shows the tabs fitting (they scroll sideways in their own row, the
  page does not).

## Challenge round
- **Weakest assumption:** that ten chips fit a phone. The family row already scrolls on its own; checked at 360 px.
- **What I hadn't read:** whether anything stores a family name: the filter is page state, so nothing to migrate.
- **The lazier version:** rename the four families. Rejected: Stats and build your own read them.

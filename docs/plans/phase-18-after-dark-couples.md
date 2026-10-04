# Phase 18: After dark, more explicit, with couple sessions

Decided 4 Oct 2026 (Noam, [#185](https://github.com/noamros9/kettle-bar/issues/185)). Noam moved it ahead of the rest
of the 4 Oct roadmap the same evening ("eager, wink wink"); architecture review V, super programs and the code review
follow on Tuesday or Wednesday. Today After dark has 30 programs in 3 subjects (Beach body, Bedroom stamina, Sex
positions).

Grilled 4 Oct:
- **+75 programs:** **20 couple programs** (the Couples / partner subject) and **55 more in 11 new subjects, 5 each**.
  After dark goes from 30 programs in 3 subjects to 105 in 15.
- **The 11 other new subjects:** Endurance & control · Hip power & thrust · Carry & hold · Flexible & bendy · Strip &
  show-off · Her pleasure · Quickie · Back & knees care · Date night warm-up · Positions tour · Morning glory / Sunday.
- **Couple sessions:** **mostly together** (the same moves for both, with the odd step for him or for her); **written
  for him and her**; they **count in Stats** like any workout.
- **How a couple session flows: a mix across programs.** Most build up: a partner workout, then a teasing block,
  then a finisher of timed positions. Some alternate: a partner set, then a position, round after round.
- **Teasing:** strip forfeits, kiss-and-touch reps, a slow dance to warm up and a massage to cool down, dares by the
  timer, "and more": **winner's choice** (whoever wins the round picks the next position) and **eyes-closed rounds**.
- **Positions tour: one-off days** (no day repeats).
- **Text:** Noam asked for fully descriptive. Sex steps name the position, the time and the form cues (what to brace,
  what it trains, how to switch), **frank but not pornographic** (Claude's limit, said on #185).
- **Pictures:** **rudimentary two-figure drawings** for partner moves and sex positions: two stick figures,
  non-anatomical, the partner in a second colour.
- **Names** may be fully explicit (Noam, Phase 16).

Rules that hold: every new program is pinned; no existing pin changes; existing programs, own programs and random
workouts never reshuffle (new exercises are **catalogue 10**, new pools get new names); each program gets a
hand-written summary; 30- and 60-day lengths only.

## Which programs need a partner
The 20 Couples programs, and Date night warm-up, Morning glory / Sunday and Positions tour (each Positions tour day
trains for a position, then ends with it together). The other 8 new subjects are solo training, like today's three.
**Couple programs stay out of build your own and random workouts** (a random workout is for one; it's the same rule
as Variety), so they are in `skipped` in the recipe book.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/phase-18` | done (PR #192) |
| 1 | Two-figure drawings | feature | – | `feature/two-figures` | done (PR #193) |
| 2 | Catalogue 10: partner moves, teasing and positions | feature | 1 | `feature/catalogue-10` | done (PR #194) |
| 3 | Couples (+20) | content | 2 | `content/couples` | done (PR #195) |
| 4 | Endurance & control, Hip power & thrust, Carry & hold, Flexible & bendy (+20) | content | 2 | `content/after-dark-a` | done (PR #196) |
| 5 | Strip & show-off, Her pleasure, Quickie, Back & knees care (+20) | content | 2 | `content/after-dark-b` | done (PR #197) |
| 6 | Date night warm-up, Positions tour, Morning glory / Sunday (+15) | content | 2 | `content/after-dark-c` | done (PR #201) |

### 1. Two-figure drawings
- `figures.js`: a pose may carry `two: { ...pose, at: [x, y], flip }`, a second figure placed relative to the first
  one's hip (`flip` faces it the other way). Both figures are solved the same way. The bounds and the ground take
  both, and the picture gets wider (viewBox 160 instead of 120) only when there are two. The partner draws in
  `var(--fig2)`, defined in both themes.
- **Test first:** `figureSVG` of a two-figure exercise draws two heads, the second in `--fig2`, inside the viewBox,
  standing on the ground line; a one-figure exercise is byte-for-byte what it was (all existing figures unchanged).
- **Done when:** a scratch page with a few two-figure poses (standing, kneeling, lying) looks right at 390 px, light
  and dark.

### 2. Catalogue 10: partner moves, teasing and positions
- A new category `couple` (CAT label "Couples"), every exercise in it `added: 10`. About 40 to start:
  - **partner moves**, e.g. partner squats holding hands, high-five push-ups, wheelbarrow walk, plank-to-plank taps,
    sit-up ball passes (no ball: a hand clap), back-to-back wall sit, partner carry, lift-and-hold, partner bridge;
  - **teasing**, e.g. slow dance, strip round, kiss reps, massage (back, legs), dare card, eyes-closed round, winner's
    choice;
  - **positions** as timed holds, e.g. missionary, legs over shoulders, cowgirl, reverse cowgirl, doggy style,
    spooning, lotus, standing carry, edge of the bed, wheelbarrow, the pretzel, 69 (the ones the solo Sex positions
    programs train for).
  Each has muscles, reps or seconds per level, a cue (frank, not pornographic) and two-figure poses.
- Couple exercises stay where they belong: no solo pool draws them (computed pools never take `couple`); the Swap
  list only offers couple exercises for couple ones (as for guided kinds); warm-ups skip them; the Exercises page
  shows them under their own "Couples" heading.
- New pools (new names only): `partner`, `partnerLower`, `partnerUpper`, `tease`, `dare`, `massage`, `positions`,
  `positionsStanding`, `positionsFloor`.
- **Test first:** every couple exercise has two-figure poses, muscles and a cue; no computed pool and no existing pool
  contains a couple exercise; the Swap list for a solo exercise never offers one, and for a couple one offers only
  couple ones; `rm -rf data && node build.js` on main and the branch differ only in new files.
- **Done when:** the Exercises page's Couples section draws every figure, light and dark, at 390 px.

### 3. Couples (+20)
- A new subject **Couples** (family Mixed, shelf group After dark), 20 programs in `configs/after-dark.js`. As built:
  the new After dark programs go in this file and Phase 16's 30 stay in `mixed.js` (moving them gained nothing).
  Help me pick gets a goal, "For two, after dark". Mixed rules hold: every main block tagged with its family,
  two or more families a day (partner work LIFT or COND; teasing and massage FLOW; positions CARDIO).
- 14 build up (partner workout, then tease, then positions) and 6 alternate (a partner set, then a position, in rounds).
  Four are 30-day programs. Lengths 20 to 45 minutes.
- Proposed names (Noam may swap any): Sweat Together · Foreplay Fitness · Strip Circuit · Kiss Me Reps · Lift Me Up ·
  Ride Along · Date Night Burn · Partners in Grime · Couple's Quickie · Take It Off · Slow Burn Couples · Fuck Fit ·
  Sweaty Sheets · Pin Me Down · Wheelbarrow Race · Dare Night · Massage & Mount · Couple's Kama Sutra 30 · 30 Days of
  Foreplay · Fit to Fuck 30.
- `skipped` in the recipe book (no build your own, no random workouts).
- **Test first:** the subject, its 20 ids in `tests/configs.test.js`, the Mixed rules, every day uses at least one
  couple exercise, the couples are in the recipe book's `skipped`; the phone test opens a couple day and runs the
  positions block with two figures.
- **Done when:** pins added, no existing pin changes, recipe book and page under their gates, 390 px screenshots.

### 4–6. The other 11 subjects (+55)
Each subject gets 5 programs (one or two of them 30-day), names explicit where they fit, hand-written summaries:
- **Endurance & control:** pelvic-floor holds and reverse kegels, breath pacing, tempo and long holds, interval
  conditioning.
- **Hip power & thrust:** hip thrusts, bridges, swings, banded and single-leg work, thrust intervals.
- **Carry & hold:** grip, carries, wall sits, Zercher and front holds, legs and core to hold her up.
- **Flexible & bendy:** splits, hip openers, hamstrings, back bends, held long.
- **Strip & show-off:** a pump for chest, shoulders, arms and abs before a date, short and sweaty.
- **Her pleasure:** neck, jaw, tongue, forearm and wrist endurance, kneeling comfort, hip flexors.
- **Quickie:** 15 to 20 minute intense sessions (as built: 16 to 20, the core work inside the session, no abs finisher).
- **Back & knees care:** the lower back, knees and wrists that positions load, with the strength to protect them.
- **Date night warm-up** (couple): a short partner stretch and tease, 15 to 20 minutes.
- **Positions tour** (couple, one-off days): a 30-day program whose 30 day types are each named after a position,
  generated from one list in the config; each trains for its position, then ends with it. Five tours: floor,
  standing, flexible, strength and a mixed one. As built: `tour()` pairs each position with each way to prepare for it
  (positions × ways = 30), dealt way by way so no position comes two days running.
- **Morning glory / Sunday** (couple): slow and long (40 to 60 minutes), stretch, partner work, positions.
- **Test first** (each ticket): subjects and ids pinned in the tests, Mixed rules, couple subjects skipped from the
  recipe book. **Done when:** as ticket 3.

The shelf group After dark lists the new subjects as they land (`SHELVES` and `FAMILIES` Mixed), and the configs
test keeps every subject in one family and one group.

## Challenge round
- **Weakest assumption:** that 15 subjects in one tab stay tidy. After dark's subject chips will wrap to four or five
  rows. If that's messy, the next step is splitting the tab (After dark · Couples) — a one-line change in `SHELVES`.
- **What I hadn't read:** whether the warm-up picker, the stats muscle map and the finder text cope with a new
  category. The warm-up skips `couple`; stats count its muscles like any exercise; the finder reads names and blurbs
  (it will find "doggy" fine).
- **The lazier version:** no two-figure engine, text only for couple steps. Noam asked for drawings (4 Oct), so ticket 1
  stays, but it is small: one optional field and a wider viewBox.
- **Size:** each program is its own file in `data/` (about 50 KB, loaded when opened), so 75 more add files, not page
  weight; the program list in the library index grows by 75 lines; the 150 KB page gate isn't at risk; the recipe book
  grows only by the solo subjects (the couple ones are skipped).

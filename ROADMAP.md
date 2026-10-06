# Kettle & Bar roadmap

Built from a grilling session with Noam on 28 Sep 2026. Decisions are recorded under each item so
future work doesn't re-ask them. Order within a phase is the build order.

## Done
Phases 1–18, architecture reviews III–IV and their decisions (1–52): [docs/roadmap-archive.md](docs/roadmap-archive.md).

## Backlog
- **Test a restore from the nightly backup** on the phone ([#16](https://github.com/noamros9/kettle-bar/issues/16)).
- **Faster phone UI tests (1 Oct 2026):** locally only the affected specs run (`npm run test:ui:affected`), the full
  suite in CI on the PR. The two-browser helper (`tests-ui/devices.js`) batches its calls (1 Oct): the sync tests run
  ~35% faster (sync 22 → 13 s, build 23 → 14 s, random 24 → 18 s); the build one had flaked on a busy runner. More workers don't help on 2 cores (4 workers: 4.4 min and timeouts). CI (1 Oct): the test job runs in
  Playwright's image (installing the browser took 6–20+ min of apt-get), a newer push to a PR cancels the older run,
  and a commit of Markdown only skips the pre-commit tests.
- **Workout history with a calendar** ([#113](https://github.com/noamros9/kettle-bar/issues/113)): planned as Phase 9.

## The 4 Oct 2026 roadmap
Four issues Noam opened on 4 Oct 2026, grilled the same day. Order first set as architecture review V, then super
programs, then After dark; **that evening Noam moved After dark first** ("let's do it now, then the rest on Tuesday or
Wednesday"). Added the same evening: longer programs (#198), calisthenics (#199) and "do now" (#200); their place in
the order isn't set yet. The code review's place in the order isn't set yet. Each gets its own plan, by our method, when it starts.

### Phase 20: After dark, refined, and an Explicit set ([#202](https://github.com/noamros9/kettle-bar/issues/202))
Plan: [docs/plans/phase-20-after-dark-explicit.md](docs/plans/phase-20-after-dark-explicit.md). Grilled on the issue
5 Oct 2026; Noam put it next (5 Oct), built by Grok and reviewed by Claude. Numbered 20 because 19 is super programs.
57. **Refine in place** (5 Oct): the 17 position cues, the 7 dare cues, and the 105 programs' blurbs and about text;
    same ids and days, no re-pins. Explicit words and dirty slang, one paragraph, no orgasm script.
58. **A pelvic mark on the stick figures** (5 Oct), on every position: rendered pictures were refused by the image tool.
59. **Catalogue 11: 88 exercises** (5 Oct): 24 intercourse, 24 oral, 24 anal, 8 toys, 8 hands.
60. **+200 programs, all 60 days, all couple** (5 Oct): Explicit (a subject chip on the After dark shelf, 65: 20, then
    45 more that are mainly sex only) and 9 in each of the 15 After dark subjects; three
    session shapes (gym then sex, sex then sex, positions only). Minutes 20% longer than each band (Noam, 5 Oct).
    They use the 88 new exercises alongside catalogue 10's couple exercises, not instead of them (Noam, 5 Oct).
61. **Page cap 125 → 135 KB gzipped** (5 Oct); the 150 gate stays.
62. **Swap unchanged** (5 Oct): older couple programs may offer catalogue-11 exercises in Swap.
63. **Grok writes the explicit text** (5 Oct); a text failure gets a second Grok round.
64. **Program descriptions from his side** (5 Oct, ticket 5.5): blurbs and about text are written from his POV or a
    straight couple's POV, depending on the program, never hers. The app is Noam's. Just as explicit, or hotter.
    Applies to the 105 rewritten in tickets 3–4, to every new program in tickets 8–13, and to every couple program
    in any later phase: a standing rule in CLAUDE.md, and a test over every `couple: true` program (5 Oct).

65. **Equal odds, basics about 1.5×** (5 Oct, ticket 8): in a sex block every couple exercise, old or new, has about the
    same chance of being drawn; basics (`basic: 1`: the 17 classics and 10 plain new ones) come up about 1.5× as often.
    Code, not a habit: the builder's merged pools (`sexPositions`, `sexWarm`, `sexFuck`, from `mergedAt`) and a
    standing test over every couple program on catalogue 11 or later (`tests/couple-odds.test.js`).
66. **Descriptions describe the session** (5 Oct, ticket 8): a blurb or about says what he does to her, never how the
    builder made it (no slots, catalogues, old or new positions); a standing test over every couple and After dark
    program (`tests/his-pov.test.js`).
67. **Phase 20 pauses after ticket 8** (5 Oct): Phases 21 and 22 come first; tickets 9–15 resume after them.

### Phase 21: exercise families and subjects, and more warm-ups and cool-downs ([#220](https://github.com/noamros9/kettle-bar/issues/220))
Grilled 5 Oct 2026 (Noam); next after Phase 20 ticket 8, before ticket 9. Claude plans, Grok builds. A plan file
(`docs/plans/phase-21-exercise-families.md`) lands first, as Phase 20's did.
68. **A grouping, not a new `cat`** (5 Oct): exercises get a family → subject map, like `FAMILIES` for programs. `cat`
    stays as it is (nine places in the builders depend on it), so no program's days change and no pin moves.
69. **Six families** (5 Oct): Warm-up · Stretch & cool-down · Muscles · Cardio & combat (cardio, boxing, kickboxing) ·
    Mind & body (yoga, pilates, balance, mobility) · Couples (subjects by act: intercourse, oral, hands, anal, toys,
    partner work, tease, dares, massage, and Phase 22's new ones).
70. **Muscles by primary muscle** (5 Oct): Chest, Back, Shoulders, Arms, Legs & glutes, Core & abs, Full body, as on
    the Programs page's Muscles shelf. Each exercise sits under its primary muscle.
71. **30 warm-ups and 30 cool-downs** (5 Oct): +24 warm-ups (dynamic moves, joint circles, activation), +18 cool-downs
    (static stretches, breathing). New ones carry `added: N`, so only programs built from then on draw them.

### Phase 22: catalogue 12, the sex catalogue doubled and four new kinds
Grilled 5 Oct 2026 (Noam); after Phase 21, before Phase 20 ticket 9. Claude plans, Grok builds and writes the text.
72. **Doubled, intercourse tripled** (5 Oct): intercourse 24 → 72, oral 24 → 48, anal 24 → 48, toys 8 → 16,
    hands 8 → 24.
73. **Four new kinds, 24 each** (5 Oct): **Rough** (spanking, hair-pulling, pinning her wrists, holding her down; no
    choking), **Kink-lite** (blindfold, ties or cuffs, a gag, ice or wax, him on her), **Body play** (titfuck,
    grinding and dry humping, thigh-fucking, cumming on her as an act, no orgasm script), **Rimming** (him on her,
    and her on him).
74. **One exception to "nothing receiving about him"** (5 Oct): she may rim him. Nothing goes in him: no pegging, no
    fingers or toys in his ass. CLAUDE.md's rule and the tests get this exception and nothing more.
75. **216 new exercises, `added: 12`, all `couple`** (5 Oct), with poses and the pelvic mark, in the Phase 20 cue
    register.
76. **Page cap 135 → 250 KB gzipped** (5 Oct, Noam: "250 KB easy"), and the gate in CLAUDE.md with
    it. Phases 21–22 land the page near 144 KB.
77. **Phase 20 tickets 9–15 build at `catalogue: 12`** (5 Oct): their 180 programs mix catalogue 10, 11 and 12
    exercises. Ticket 8's 20 Explicit programs stay at catalogue 11.
79. **The fitness library grows too, in this phase** (5 Oct):
    catalogue 12 also adds fitness exercises, not only sex ones.
80. **+50% in every fitness category** (5 Oct): every non-couple `cat` grows by half, counted after Phase 21 lands
    (today ~335 → ~500, about 168 new), using all his equipment: dumbbells, kettlebell, pull-up bar, bodyweight and
    mat.
81. **Existing programs stay as built** (6 Oct): no program moves up a catalogue (that would re-deal every day).
    Build your own, random workouts, Variety and the Swap list pick up the new exercises as they are. The new fitness
    programs come in Phase 23.

### Phase 23: new fitness programs at catalogue 12
Grilled 6 Oct 2026 (Noam); right after Phase 22.
83. **+50% programs in every fitness subject** (6 Oct): each fitness shelf (not After dark or couple) grows by half,
    rounded, the same as the exercises did (Strength 19 → ~29, Chest 8 → 12): about 240 new programs, all built at
    `catalogue: 12`, mixing old and new exercises.
84. **A "II" of every Signature program, on top** (6 Oct): 15 more. Same shape as the original (days, blocks, length),
    a step harder (more sets or rounds, or harder variants), and built at catalogue 12 so it brings new exercises.
    The originals never change.
85. **"A step harder" = a level up** (6 Oct): a II's Level I is the original's Level II, and each level climbs on from
    there, so its Level III goes past the original's.
86. **All 15 get a II** (6 Oct): each of the five splits and each Tempo and Harder Moves variation (Three-Split 60 II,
    Three-Split 60 Tempo II, ...), on the Signature shelf after their originals.
87. **Built to the Longer programs spread** (6 Oct): the new programs are made at decision 53's spread from the start
    (half 35–38 min, a quarter 31–35, a quarter shorter), so they never need re-timing.
88. **Names and blurbs in today's style** (6 Oct), no separate review.
- Left to the plan (technical): the library's size at ~1,000 programs (with Phase 20's 180): measure the index and
  finder data, and split them if the Programs page slows.

### Architecture review V ([#187](https://github.com/noamros9/kettle-bar/issues/187))
A fresh review after Phases 13–18: shelf groups, Variety, ~580 programs, the library boot, sync at that scale (one
cloud listener per program; ticket 17.2 found each first reply redrawing the page).

### Phase 19: super programs ([#186](https://github.com/noamros9/kettle-bar/issues/186))
One plan that runs days from several programs in a set order (some days from here, some from there).
43. **Both** (4 Oct): a few ready-made super programs, and I can chain my own from any programs.
- Still open, for the plan: how progress and pins work across the parts; how it shows on the Programs and day pages.

### Code review ([#188](https://github.com/noamros9/kettle-bar/issues/188))
Correctness, dead code, duplication, tests that no longer earn their keep. Place in the order not set yet.

### Longer programs ([#198](https://github.com/noamros9/kettle-bar/issues/198))
Noam, 4 Oct 2026: only about 1/6 of the programs run 33 min or more (of 557: 13% at 35+, 13% at 31–35, 74% under 31).
53. **The spread he wants:** half of all programs at **35–38 min (his baseline)**, a quarter at **31–35**, a quarter
    shorter.
54. **Minutes are the workout only**, as the cards show; the ~3 min warm-up and cool-down come on top.
55. **Re-time programs: rebuild them longer**, a one-time exception to the never-re-pin rule for those that change,
    **but they shouldn't change much: just add compatible exercises** (keep the blocks and picks, add sets, rounds or
    slots of the same kind).
56. **The shorter quarter has no target:** whatever stays under 31.
82. **The added slots prefer catalogue 12** (6 Oct): when a program is re-timed longer, each slot it gains takes a
    new catalogue-12 exercise where one of the same kind exists, else an older one. Within the same one-time
    exception, nothing more.
- Still open, for the plan: programs already started (leave them, or add only to the days ahead); which programs move
  up (by subject, so every shelf has long ones, or by family); how the builder adds without reshuffling.

### Calisthenics ([#199](https://github.com/noamros9/kettle-bar/issues/199))
Noam, 4 Oct 2026: calisthenics programs. Still open: a subject of its own (skills such as the muscle-up, handstand,
front lever and pistol), more programs alongside Calisthenics Base and Skills, or both.

### "Do now" ([#200](https://github.com/noamros9/kettle-bar/issues/200))
Noam, 4 Oct 2026: a button for dead time that hands you one exercise to do right now: anywhere, anytime, no
equipment, 20–30 seconds. Still open: where the button lives, how it picks, whether it times itself and counts in
Stats, and whether it stays quiet and office-friendly.

### After dark: a story per workout, by Grok ([#225](https://github.com/noamros9/kettle-bar/issues/225))
Noam, 5 Oct 2026: automate creating an erotic story with Grok for every After dark workout.
78. **Last in the order** (5 Oct): after all other open issues are done. To be grilled when it starts.
- Still open, for the grill: one story per program or per day; generated at build time or on demand; where it shows;
  couple vs solo programs; stored in the repo or fetched; how Grok runs (`grok -p` headless vs the API).

## Decided against (don't re-suggest)
- **Logging weights/reps per set**: Noam wants done / not done only.
- **Adaptive plans**: no test days, no too-easy/too-hard nudging, no deload suggestions. Plans stay as written.
- **Streaks** (a history calendar is fine, Phase 9; 1 Oct), **consistency targets, program-progress stats, push/pull ratios, neglected-muscle alerts**:
  not picked.
- **Voice countdowns, "what's next" and encouragement**: holds and sides only.
- **Hebrew version** and **share as image**: not wanted for now.
- **Animating workout cards** (every card, current exercise only, tap to play): exercise pages only.
- **Heart-rate / Google Fit**: limited from a web app; revisit only if the app goes native.

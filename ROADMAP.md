# Kettle & Bar roadmap

Built from a grilling session with Noam on 28 Sep 2026. Decisions are recorded under each item so
future work doesn't re-ask them. Order within a phase is the build order.

## Resume here (7 Oct 2026, end of session)
- **Done today:** Phase 22 tickets 1b (#269) and 6 (anal, shipped 22 of 30, #272); shorter test runs, decisions
  128–132, tickets 1c–1f (#273–#276): the hook skips a tree `test:coverage` passed, main's CI skips tests a PR ran,
  light and dark UI in parallel, the every-exercise loops in one go. Main is green, no PR open.
- **Next: Phase 22 ticket 9** (rough +36) for Grok; tickets 7 (toys, #278) and 8 (hands, #279) done, plan first (132), from
  [docs/plans/phase-22-catalogue-13.md](docs/plans/phase-22-catalogue-13.md) "Resume here". Then the rest of Phase 22,
  Phase 20 tickets 9–15 (at catalogue 13), then Phase 23.
- **Working rules (CLAUDE.md):** never more than 2 tickets building at once; look for the next ticket at every
  checkpoint; parallel only within one phase. Every Grok ticket plans first.
- **Parked:** #249 explicit drawings and loops (decisions 106–115; Grok finds them online, signed-in only, Firebase
  Storage). Place in the order not set; open points are listed in its section.
- **Worktrees:** `../kettle-bar-docs` is the spare (detached, `npm ci` done; UI tests there use `UI_PORT=4174`).
  `../kettle-bar-cachefix` is Noam's #253 branch.

## Done
Phases 1–18 and 21, #234, architecture reviews III–IV and their decisions: [docs/roadmap-archive.md](docs/roadmap-archive.md).

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

### Phase 22: catalogue 13 (was 12, decision 105), the sex catalogue doubled and four new kinds
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
    it. Phases 21–22 land the page near 144 KB. **Raised to 350 KB by decision 95.**
95. **Page cap 350 KB gzipped** (6 Oct), replacing 76's 250; CLAUDE.md's gate says 350 now, the build's check moves
    to it in a Phase 22 ticket.
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
116. **Warm-ups and cool-downs don't grow again** (6 Oct): they went to 30 each in Phase 21. Decision 80's +50% is
     the other 14 fitness categories: 317 → 479, **+162**.
117. **The new kinds in the merged pools, by role** (6 Oct): at catalogue 13, Rough and Body play join `sexFuck`,
     Kink-lite and Rimming join `sexWarm`, and all 432 join `sexPositions`. Each kind also has a pool of its own.
118. **Rough and Kink-lite mostly during sex** (6 Oct): most are a position with the act in it (doggy pulling her
     hair, missionary with her wrists pinned, cowgirl blindfolded); a few stand alone (a spanking round, ice on her).
119. **Four new After dark subjects, 8 programs each** (6 Oct): Rough, Kink-lite, Body play, Rimming: 32 programs at
     catalogue 13, in this phase, each subject 3 gym then sex, 3 sex then sex, 2 positions only (Noam).
120. **The sex exercises, new per kind** (6 Oct, Noam; replaces 72–73's numbers; his numbers are what's added, not
     totals): intercourse **+96** (24 → 120), oral and anal **+60** each (24 → 84), toys and hands **+36** each
     (8 → 44), and Rough, Kink-lite, Body play, Rimming **36** each (+144): **432** new. Intercourse ended at **+91**
     (6 Oct, Noam): after ~115 positions the last 5 of ticket 4b were still copies, so it shipped 19 (427 new).
121. **Own programs and random workouts move to catalogue 13 only in the phase's last ticket** (6 Oct, technical):
     the newest catalogue they store is held at 12 while Phase 22's tickets land, so an own program saved mid-phase
     never reshuffles when the next ticket adds to its pools.
122. **Oral and anal +30 each, not +60** (6 Oct, Noam): too many; tickets 5b and 6b are dropped. The 60 freed go to
     Kink-lite and Body play, +30 each (→ 66 each).
123. **Eight more kinds, 36 each** (6 Oct, Noam): Edging, Massage, Strip and tease, Shower and bath, Pool, Hot tub,
     Balcony, Doorframe (+288). Massage and Strip and tease grow the existing `massage` and `tease` kinds (2 and 4
     today); the other six are new `sub`s (`edging`, `shower`, `pool`, `hottub`, `balcony`, `doorframe`). Each is
     an After dark subject with **8 programs** (3/3/2 as 119): +64 programs. Phase 22 totals: **715 sex exercises**
     (91 intercourse, 30 oral, 30 anal, 36 toys, 36 hands, 36 Rough, 66 Kink-lite, 66 Body play, 36 Rimming, 8 × 36),
     162 fitness, **96 programs** (12 subjects × 8). Oral shipped **+23** (6 Oct, Noam: after a fix round 7 of 30
     still failed; 708 sex exercises). Anal shipped **+22** (7 Oct, 124: after two fix rounds; 700 sex exercises).
124. **Hitting the wall** (6 Oct, Noam): a sex ticket gets Grok's build and two fix rounds. If it still writes copies
     or positions that don't work, it ships what passed and we move on; the count is recorded here and in the plan.
125. **Places count by what the place changes** (6 Oct, Noam): in Shower and bath, Pool, Hot tub, Balcony and
     Doorframe, a version of a bed position counts as new when the water, tiles, tub, rail or frame changes what he
     holds or braces; no two in one kind the same. Places include play (washing her, touching under the water), not
     only sex.
126. **Kink-lite goes both ways** (6 Oct, Noam): about a quarter of the 66 is her doing it to him, anything Kink-lite
     (blindfold, ties or cuffs, a gag, ice or wax on him). Nothing goes in him, no pegging. The exception goes into
     CLAUDE.md's "A straight man training his own body" and `tests/his-pov.test.js`, like Rimming's (74).
127. **Room to grow** (6 Oct, Noam): the page gate is **1 MB** gzipped (was 350 KB, 95); the UI test timeouts and
     Claude's command limits are raised, CI's job has no limit set (GitHub's 6 h). Cutting the times is
     [#265](https://github.com/noamros9/kettle-bar/issues/265).
128. **Main's CI builds and deploys without retesting** (7 Oct, Noam): when the tree pushed to main is the tree a green
     PR run tested (a squash merge of an up-to-date PR is byte-identical; verified on #269), main skips the unit and UI
     tests. Any other tree gets the full run. Claude updates a PR that is behind main before merging it.
129. **The unit suite runs once per tree locally, and Claude's review still runs it** (7 Oct, Noam): a passing
     `test:coverage` records the tree; the pre-commit hook skips that tree. Grok runs only the ticket's test files while
     writing (the hook runs the full suite once, at its commit). Claude's review runs `test:coverage` itself, and no
     longer also `npm test`.
130. **Local phone UI tests for UI tickets only** (7 Oct, Noam): content tickets (exercises, programs) rely on the PR's
     CI, which runs the full suite.
131. **CI itself gets faster in this phase** (7 Oct, Noam): light and dark run as parallel jobs, and the every-exercise
     loops check every figure in one page load ([#265](https://github.com/noamros9/kettle-bar/issues/265)).
132. **Every Grok ticket: Grok plans, Claude reviews the plan, then Grok builds** (7 Oct, Noam; first for sex tickets,
     widened the same day): Grok's first run writes only its plan to `test-results/tN-plan.md` and stops: for a
     content ticket one line per item (an exercise: who lies, kneels, sits or stands where, where her legs are, what he
     braces; a program: name, shape, minutes, pools), for code the files, the test first and the approach. Claude
     reviews it (copies, bodies that don't fit, wrong approach) and sends back changes until it passes; then Grok
     builds from the approved plan (`--continue`) and commits, and Claude reviews the build as before. A fix round on
     a plan costs minutes, not a full run.
133. **Claude's review trusts Grok's commit hook on the same tree** (7 Oct, Noam; replaces 129's "review still runs
     it"): when `.git/kb-tested-tree` equals the tree of Grok's last commit, the suite passed on exactly that code and
     Claude doesn't run it again. Any mismatch (hook skipped, an edit after the run) and Claude runs `test:coverage`.
     The PR's CI still runs everything before a merge.
- Plan: [docs/plans/phase-22-catalogue-13.md](docs/plans/phase-22-catalogue-13.md).

### Phase 23: new fitness programs at catalogue 12
Grilled 6 Oct 2026 (Noam).
96. **After Phase 20 is complete** (6 Oct): the order is #234 → Phase 21 → Phase 22 → Phase 20 tickets 9–15 →
    Phase 23. Phase 20's programs draw on catalogues 10, 11 and 12 together (decision 77), not 12 alone.
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

### Explicit drawings and loops for the explicit exercises ([#249](https://github.com/noamros9/kettle-bar/issues/249))
Noam, 6 Oct 2026; grilled the same day. Place in the order not set yet.
106. **Drawn, never photos of real people** (6 Oct): explicit drawings and short animated loops (source: 112).
107. **Every explicit exercise, any catalogue** (6 Oct): catalogue 10's positions and oral, catalogue 11, Phase 22's,
     and later ones; a ticket that adds an explicit exercise also adds its drawing and loop.
108. **Three ways to show it** (6 Oct): Figure · Drawing · Animation. The drawing replaces the stick figure by default.
109. **The switch is in Settings and on each exercise page** (6 Oct): Settings sets the default; the page switch
     overrides it there.
110. **Signed-in only, stored in Firebase Storage, never in the public repo** (6 Oct): Storage rules let only Noam's
     account read them (Noam publishes the rules in the console). **No caching:** not in the service worker, not
     offline; fetched each time the page shows one.
111. **Noam reviews each before it ships** (6 Oct): Claude can't review explicit images.
112. **Found online by Grok, not generated** (6 Oct, Noam's test): Grok's image tool refuses these scenes, so Grok
     searches the web and checks each file is a drawing of two adults (no photos, medical cross-sections or old
     fine-art prints). Stills: the flat two-colour vector diagrams (thin outline, blank background) from the site
     Noam's first pick came from. Loops: the shaded cartoon GIFs from a second site; a mislabeled file is skipped.
113. **Private use, no licence check** (6 Oct, Noam): taken as found, since they're signed-in only and for Noam.
     Claude raised that it's still copying and re-hosting others' artwork (a copyright risk); Noam chose this anyway.
     Each file still records its source URL.
114. **Two styles are fine** (6 Oct): Drawing and Animation are separate views, each consistent in itself.
115. **Loops stored as MP4/WebM** (6 Oct): each GIF converted with ffmpeg, played muted, looped, inline.
- Still open, for the plan: how Grok runs (headless with web tools allowed, or Noam interactive); where files wait
  for Noam's review before upload; what an exercise with no match shows (the stick figure).

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

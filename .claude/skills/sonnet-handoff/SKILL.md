---
name: sonnet-handoff
description: Hand a Kettle & Bar ticket to a Sonnet subagent the way Grok tickets are handed off (plan first, Claude reviews, Sonnet builds and commits, Claude runs the review checks, pushes, opens the PR and merges). Use when Noam says "Sonnet takes ticket N" or asks to run a ticket through a subagent.
---

# Sonnet hand-off

Opus plans and supervises; a Sonnet subagent builds. The shape is CLAUDE.md's Grok hand-off: same branch rules, same
plan-first step, same review bar, same commit hook. Only the builder differs: an `Agent` call with `model: "sonnet"`
instead of `grok -p`. Read CLAUDE.md's **Building** section first; this skill adds only what a subagent needs.

## The loop

1. **Before:** count what is building (CLAUDE.md's cap of 2; a Sonnet run is building). Create the ticket's branch from
   where CLAUDE.md says (main, or stacked on the ticket whose PR is open). One builder per working folder.
2. **Brief** (below): everything the subagent needs, in one prompt. It starts cold: it has not seen the plan, this
   conversation, or the gotchas. Name every file to read; give the conventions with an example; give the commands.
3. **Plan run:** `Agent({ model: "sonnet", subagent_type: "general-purpose", description: "Ticket N plan",
   prompt: <brief + "PLAN ONLY"> })`. It writes `test-results/tN-plan.md` and stops. Keep the agent's id.
4. **Review the plan** (checklist below). Changes go back with `SendMessage` to the same agent (its context stays),
   asking for the plan file to be rewritten. Repeat until it passes. Two rounds is normal; a third means the brief was
   missing something: add it to this skill.
5. **Build run:** `SendMessage`: "Plan approved, build it." It writes the Test first, builds from the approved plan,
   runs only the ticket's test files while working, looks at its own drawings, and commits on the branch (the
   pre-commit hook runs the full suite). It never pushes, opens PRs or merges.
6. **Review the build** exactly as a Grok ticket (CLAUDE.md, Review checks), plus reading the diff yourself. Findings
   go back by `SendMessage` for **one** fix round. Still failing: finish it yourself and say so in the PR.
7. Push, PR (say in the PR that Sonnet built it and how many plan and fix rounds it took), CI, merge as usual.
8. **Log it** in the plan's "Sonnet experiment" table (when the experiment is on): plan rounds, review findings, fix
   rounds, who finished, wall time.

Only the subagent's final message enters Claude's context. Ask for a short summary (10 lines at most), never its
whole transcript or file contents.

## The brief

Write it fresh per ticket from this skeleton; fill every `<…>`.

```
You are building one ticket of Kettle & Bar, a phone workout app (plain JS, no framework), in /home/claude/kettle-bar
on branch <branch> (already checked out; do not switch branches).

Read first, in this order:
- CLAUDE.md: "Rules that never bend", "Mechanics"; <"Writing program text" for couple or After dark tickets>
- <plan path>: the ticket "<N. title>" (its Build, Files, Test first, Done when), and the plan's "How catalogue 13
  reaches the pools" section
- <files and line ranges the ticket touches, with what to look for in each>

The ticket: <one paragraph, the counts, what "done" means>.

Conventions, with an example to copy: <one real entry from the code, and the rules learned so far>.

Gotchas already found on this kind of ticket: <the list for this kind, below>.

Commands:
- run only this ticket's tests while working: <e.g. node --test tests/catalogue13.test.js>
- look at your drawings: node .claude/skills/sonnet-handoff/poses.js tN --cat <cat> (then Read test-results/poses-tN.png)
- the full suite runs in the pre-commit hook when you commit (about 5 minutes; give it a 10-minute timeout).

Never: push, open a PR, merge, switch branches, edit another ticket's files, change an existing program's days or
re-pin tests/fixtures/program-days.json, commit package-lock.json, or add a retry or longer timeout to make a test
pass.

<PLAN ONLY | BUILD>
PLAN ONLY: write test-results/tN-plan.md and stop. For content: one line per item (id, name, what makes it different
from the nearest existing one, gear, muscles, the pools it joins). For code: the files you will change and how, and
the test you will write first. Do not edit any other file. Reply with the plan's path and three lines on anything
you were unsure of.
BUILD (sent later, after the plan is approved): build from the approved plan; Test first; commit with a message
"<type>: <title> (Phase P ticket N)" and the Co-Authored-By line; reply in at most 10 lines: what you built, the
commit hash, the test results, anything you could not do.
```

## Reviewing a plan

- Every item is really different (a different body arrangement or movement, not the same one renamed or on other
  furniture). Check names against the **whole** catalogue, not only the ticket's category: warm-ups, balance and yoga
  hold similar moves (Phase 22 ticket 15 nearly duplicated fire hydrants and a reverse lunge to knee drive).
- Counts match the ticket; ids follow the file's naming.
- Pools: each item joins at least one pool it really fits; nothing joins a pool its gear can't satisfy in that pool's
  programs; the comments in the pool list are respected (e.g. `shoulderRaise` must stay as it is).
- Nothing changes what an older catalogue draws: new names only in `POOL_ADDS` at the ticket's catalogue, `HARDER`
  keys only for new exercises.
- Future phases' ground is left free (Phase 27's calisthenics skill steps: muscle-up, handstand and its push-up,
  levers, planche, L-sit to V-sit, pistol, one-arm push-up, dragon flag, archer and typewriter pull-ups).

## Gotchas by kind of ticket

**Fitness exercises (Phase 22 tickets 13–18):**
- An exercise is `{ name, cat, added: 13, r: [I, II, III] (never going down), tp (seconds per rep) or u: 'sec',
  side / alt when it is per side or alternating, load ('light' | 'medium' | 'heavy' | 'single' | 'kb') or equip:
  ['bar'], view: 'front' for front-view drawings, mus: 'main main | secondary', cue (40–300 characters, plain,
  second person), poses: [at least 2 unless it is a hold] }`. Bodyweight means no `load`. Muscle ids are
  `MUSCLE_NAMES` in exercises.js.
- Pose templates live at the top of exercises.js (STAND, FSTAND, PLANK, PUSHB, FOREARM, HINGE, STAG, SQUAT, LUNGE_N,
  LUNGE_F, SUP, LIE, PRONE, TABLE, KNEEL, GB_DOWN, GB_UP, DOWNDOG, HANG, PULLTOP…); copy an existing exercise's poses
  and adjust with `P(TEMPLATE, { … })`. Coordinates: profile facing right, hip at 0,0, y down; t = shoulders,
  hn/hf = near/far hand, fn/ff = feet, kh/eh = knee/elbow bend hints; db/kb = 'n' | 'f' | 'nf' | 'both'.
- `SUP` (on your back, knees up) has **no hands**: add hn/hf or the drawing throws.
- New exercises go in exercises.js just before the line `// Phase 22 ticket 2: catalogue 13 intercourse, first 24.`,
  under a comment naming the ticket. Pools: add to `POOL_ADDS` in program-builder.js under a `// ticket N` comment;
  a pool already in `POOL_ADDS` gets its list extended, never a second key (a duplicate key silently wins).
- The ticket's test is one line using `fitnessTicket({ cat: count })` in tests/catalogue13.test.js.
- Look at every drawing (the poses script) and fix what reads wrong: limbs through the floor, elbows or knees bending
  the wrong way, a hold that floats.
- New exercises can break tests that picked "the first exercise with a stand-in" or a muscle example on the
  Exercises page: fix the test's example honestly (say why in the commit), never the app's behaviour to suit it.
- After building, run `node -e "const RB=require('./recipe-book.js');console.log(RB.stored().hash===RB.hash())"`;
  if false, run `npm run recipes` and commit recipes/book.json.

**Couple and After dark content:** CLAUDE.md's "Writing program text" applies in full; give the subagent that section
and the his-POV and couple-odds tests by name.

**Code tickets:** give the exact functions and their callers; say which module is gated at 100% coverage.

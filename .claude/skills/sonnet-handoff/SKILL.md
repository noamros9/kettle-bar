---
name: sonnet-handoff
description: Hand a Kettle & Bar ticket to Sonnet run headless (`claude -p --model sonnet`), the way Grok tickets are handed off (plan first, Claude reviews, Sonnet builds and commits, Claude runs the review checks, pushes, opens the PR and merges). Use when Noam says "Sonnet takes ticket N", when logging or judging the Sonnet experiment (time, tokens, quality), or when a headless Sonnet run stops. Tickets with explicit content go to Grok whole.
---

# Sonnet hand-off

**Not in use: the experiment ended after Phase 22 ticket 16 (decision 282, 8 Oct 2026).** Sonnet with Opus
supervising took 25 min and ≈ $7.4 against Opus alone at 9 min and $1.88. Kept for reference, and for the pitfalls.

Opus plans and supervises; Sonnet builds, headless. The shape is CLAUDE.md's Grok hand-off and the grok-handoff
skill (`~/.claude/skills/grok-handoff/`): same branch rules, same plan-first step, same review bar, same commit hook,
same progress monitor. Only the builder differs: `claude -p --model sonnet` instead of `grok -p`. Read CLAUDE.md's
**Building** section first; this skill adds only what Sonnet needs.

Why headless and not an `Agent` call (Noam, 8 Oct 2026): the run's transcript goes to a file (Claude's context gets
only the summary), its time and tokens are on the last line for the experiment, a monitor can report its progress,
and the session survives Claude's: `--resume <id>` continues it from a new session (a subagent can't be resumed).

## Explicit content: the whole ticket goes to Grok
Grok is the only builder who writes explicit content (Noam, 8 Oct 2026): sex-exercise cues, After dark and couple
blurbs and abouts, anything under CLAUDE.md's "Writing program text". A ticket with any of it goes to Grok whole,
code included; never split between builders. Sonnet's brief says it doesn't write or edit that text; the review
checks the diff doesn't touch it, and reverts any hunk that does.

## The experiment (decision 276)
Phase 22 tickets 16–18 (abs, cardio and combat, mind-body). Judged together by Noam and Opus on **quality** (what
the review sent back, who finished), **time** and **tokens**, against 13–15 (Claude alone). Log every ticket's row in
the Phase 22 plan's "Sonnet experiment" table (the plan is the record, not memory or chat):
- Sonnet's numbers: `node .claude/skills/sonnet-handoff/run-stats.js grok/tN-out*.json` sums every run of the
  ticket (plan, build, fixes) from each run's `result` line: minutes, input / cache-read / cache-write / output
  tokens, USD. The same script reads a Grok transcript's `end` event (tokens only: Grok gives no duration).
- **Supervise from a fresh session** (ticket 16): Opus's cost is mostly cache reads, the whole context re-read every
  turn, including each monitor event. In a long session that alone can cost more than the control build.
- Opus's side: wall time from the branch to the PR, the review rounds, and its supervising tokens:
  `node .claude/skills/sonnet-handoff/opus-stats.js ~/.claude/projects/<repo>/<session id>.jsonl <branch created, ISO>
  [<merged, ISO>]` (sums this session's Opus calls in that window; note both times in the table's Notes).
- The control (279): ticket 16 also built once by `claude -p --model opus` from the same brief on a throwaway
  branch (`control/t16-opus`, never pushed); `run-stats.js` on its transcript gives Opus-alone time and tokens.
- The bar (280): about the same time, and Sonnet's tokens plus Opus's supervising tokens clearly below the control.
- One ticket at a time (281).
- Each Sonnet PR also gets a **Review findings** section: what was sent back, the fix round, what Opus finished.

## The loop

1. **Before:** count what is building (CLAUDE.md's cap of 2; a Sonnet run is building). Create the ticket's branch from
   where CLAUDE.md says (main, or stacked on the ticket whose PR is open). One builder per working folder.
2. **Session id**, saved so every run of the ticket resumes one session:
   `node -e "console.log(crypto.randomUUID())" > grok/tN-session.txt`. Scratch (prompts, plans, transcripts) lives in
   `grok/`, never `test-results/` (Playwright wipes it on every UI run; it deleted a finished plan on 7 Oct).
3. **Brief** (below) into `grok/tN-plan-prompt.md`: everything Sonnet needs, in one prompt. It starts cold: it has not
   seen this conversation or the gotchas. Name every file to read; give the conventions with an example; give the
   commands.
4. **Plan run** with Bash `run_in_background: true`, `timeout: 3600000` (the command must start exactly like this to
   match the allow rule in `.claude/settings.local.json`, below):
   ```
   claude -p --model sonnet --session-id "<uuid>" --output-format stream-json --verbose \
     --permission-mode acceptEdits --strict-mcp-config \
     --disallowedTools "WebFetch,WebSearch,Agent,AskUserQuestion,EnterPlanMode,ExitPlanMode" \
     --allowedTools "Bash(node:*)" "Bash(npm run:*)" "Bash(git add:*)" "Bash(git commit:*)" "Bash(git status:*)" \
       "Bash(git diff:*)" "Bash(git log:*)" "Bash(git checkout -- :*)" \
     < grok/tN-plan-prompt.md > grok/tN-out.json 2>&1
   ```
   It writes `grok/tN-plan.md` and stops. Every later run: `--resume "<uuid>"` in place of `--session-id`, its own
   prompt file and a **new** out file (`tN-out2.json`, …): the monitor stops at the first `result` line, so never
   append to an old one.
5. **Progress for Noam, only on change, in words** (the grok rule): run exactly
   `sh .claude/skills/sonnet-handoff/sonnet-monitor.sh "grok/tN-out.json"` as the Monitor command (timeout 30 min,
   re-arm on expiry). It posts when Sonnet's phase (reading, writing, testing, committing), failed calls, commits or
   end state change. Fix a wrong phase in `sonnet-phase.js`, not with an ad-hoc loop.
6. **Review the plan** (checklist below). Changes go back with `--resume`, asking for the plan file to be rewritten.
   Repeat until it passes. Two rounds is normal; a third means the brief was missing something: add it to this skill.
7. **Build run:** `--resume` with "Plan approved, build it" plus the BUILD part of the brief. It writes the Test first,
   builds from the approved plan, runs only the ticket's test files while working, looks at its own drawings, and
   commits on the branch (the pre-commit hook runs the full suite). It never pushes, opens PRs or merges.
8. **After the run:** never read the transcript. Read the last line (`result`: subtype, the summary in `result`,
   `permission_denials`), `git log main..HEAD`, `git diff --stat`, `git status` (stray scratch files), then the files
   that matter.
9. **Review the build** exactly as a Grok ticket (CLAUDE.md, Review checks), plus reading the diff yourself. Findings
   go back by `--resume` for **one** fix round. Still failing: finish it yourself and say so in the PR.
10. Push, PR ("Built by Sonnet, reviewed by Claude", the plan and fix rounds, **Review findings**), CI, merge as usual.
11. **Log it** in the experiment table (above).

## Telling Noam (Noam, 8 Oct 2026)
Only when something changes for him, in words, a few lines:
- **build done:** what Sonnet built and the review result (passed, or the findings sent back);
- **PR opened** (its number), then **merged**, or **CI red** (which run and why);
- **he's needed:** a fix round failed and Claude is finishing the ticket, or the experiment table has a verdict.
The plan review stays silent. Nothing on a timer; the monitor's lines are the progress.

## The brief

Write it fresh per ticket from this skeleton; fill every `<…>`.

```
You are building one ticket of Kettle & Bar, a phone workout app (plain JS, no framework), in <repo path> on branch
<branch> (already checked out; do not switch branches). You run headless: nobody can answer a question, so don't
ask any. Every decision is in the plan; if one is missing, pick the plainest option and list it in your reply. Noam
approved Sonnet building this ticket (decision 276, the exception to CLAUDE.md's "No Sonnet"); skip grill-me and the
branching steps, the plan is already grilled.

Read first, in this order:
- CLAUDE.md: "Rules that never bend", "Mechanics"
- <plan path>: the ticket "<N. title>" (its Build, Files, Test first, Done when), and the plan's "How catalogue 13
  reaches the pools" section
- <files and line ranges the ticket touches, with what to look for in each>

The ticket: <one paragraph, the counts, what "done" means>.

Conventions, with an example to copy: <one real entry from the code, and the rules learned so far>.

Gotchas already found on this kind of ticket: <the list for this kind, below>.

Commands (only these; anything else is refused):
- run only this ticket's tests while working: <e.g. node --test tests/catalogue13.test.js>; never `npm test`, never
  the full suite
- look at your drawings: node .claude/skills/sonnet-handoff/poses.js tN --cat <cat> (then Read test-results/poses-tN.png)
- git add <files> then git commit (never git commit -a); the full suite runs in the pre-commit hook (about 5 minutes)
- scratch files and scripts go in grok/, never a system temp folder

Never: push, open a PR, merge, switch branches, edit another ticket's files, write or edit explicit text (exercise
cues of couple exercises, After dark or couple blurbs and abouts), use sub-agents, change an existing program's days
or re-pin tests/fixtures/program-days.json, commit package-lock.json, or add a retry or longer timeout to make a
test pass.

<PLAN ONLY | BUILD>
PLAN ONLY: write grok/tN-plan.md and stop. For content: one line per item (id, name, what makes it different from
the nearest existing one, gear, muscles, the pools it joins). For code: the files you will change and how, and the
test you will write first. Do not edit any other file. Reply with the plan's path and three lines on anything you
were unsure of.
BUILD (sent later, after the plan is approved): build from the approved plan in grok/tN-plan.md; Test first; commit
with a message "<type>: <title> (Phase P ticket N)" ending "Built by Sonnet"; reply in at most 10 lines: what you
built, the commit hash, the test results, anything you could not do or decided yourself.
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

**Couple and After dark content:** not Sonnet's; the whole ticket goes to Grok (above).

**Code tickets:** give the exact functions and their callers; say which module is gated at 100% coverage.

## One-time setup per machine
`.claude/settings.local.json` (ignored via `.git/info/exclude`):
```json
{ "permissions": {
    "allow": ["Bash(claude -p --model sonnet *)"],
    "deny": ["Bash(*--dangerously-skip-permissions*)", "Bash(*--permission-mode bypassPermissions*)"] } }
```
`grok/` in `.git/info/exclude` too (the Grok scratch folder, shared: one builder per ticket, so names never clash).

## Pitfalls
Probed 8 Oct 2026 (Claude Code 2.1.293, the command above). Unlike Grok, **a refused call doesn't cancel the run**:
Sonnet gets an error and carries on, so a run can end `success` with something silently skipped. After every run
check the `result` line's `permission_denials` and the summary's "could not do".
1. **Writing outside the repo** (system Temp) → refused, run continues. The brief names `grok/` for scratch.
2. **Read-only shell outside the allow list runs anyway** (`ls`, a pipe into `cat`): Claude Code auto-allows
   read-only commands. Harmless, but the allow list isn't a full fence.
3. **Redirects into the repo run** (`node … > grok/x.txt`): acceptEdits allows writes inside the cwd. The review's
   `git status` catches stray files.
4. **Noam's user hooks fire in the run:** SessionStart, UserPromptSubmit nudges (grill-me; the brief says skip it),
   and the token-optimizer's PreToolUse bash wrapper, which broke `npm test` with `bash_compress: wrapper error:
   FileNotFoundError`, an error and not a refusal. The brief says never `npm test`. A wrapper error on an allowed
   command: name the plain command in the fix prompt, and add it here.
5. **No `--max-turns`** in this CLI version: a run ends on its own (`result` subtype `success` or `error_*`).
6. **MCP servers** would load from Noam's config (tokensave): `--strict-mcp-config` keeps them out.
7. **`git commit -a`** fails the hook's `tree-mark` test (as for Grok): `git add <files>`, then commit. A multi-line
   `-m` is fine (unlike Grok).
8. **Uncommitted work left by a stopped run:** commit it as WIP on the ticket's branch (CLAUDE.md), then `--resume`.
9. **Shell heredocs and `rm` are refused** (8 Oct, ticket 16): the brief says write files with Write and Edit, and
   leave scratch files in `grok/` for Claude to clear.
10. **The pre-commit hook's log is in `/tmp`**, outside the repo, so Sonnet can't read why a commit was blocked; it
   retried the same tree and passed (ticket 16, cause unknown: the log was overwritten). Say in the brief: a blocked
   commit → retry once, then stop and report; Claude reads `/tmp/kettle-bar-precommit.log`.
11. **Memory:** under memory pressure Claude Code reaps background shells. On 8 Oct it killed the wrapper but the
   `claude -p` child kept running. Check free memory first (4 GB+), and before relaunching check for a live
   `claude -p` process (its session log `~/.claude/projects/<repo>/<session id>.jsonl` keeps the events and tokens
   even when the out file is gone).
12. **Test first gets skipped** (ticket 16: the test was written after the build). Put it in the BUILD part as a
   checked step: "run the test before writing any exercise and quote its failure in your reply".

**Recovering a stopped or short run:** don't start over. `--resume "<uuid>"` with a short prompt naming what was
refused or skipped and the plain command to use instead; Sonnet keeps its edits and context. A run from before
this skill (an `Agent` subagent, like ticket 16's first build) can't be resumed: start a fresh session with the
brief plus "continue from the WIP commit; the plan in <path> is approved".

A new failure: probe it with a few-line prompt on a throwaway file (~$0.10), then add it here.

**Cost:** Sonnet runs on Noam's Claude usage, not a separate subscription: keep the brief tight and the file list
short.

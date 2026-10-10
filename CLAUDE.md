# Working on Kettle & Bar

How Noam wants work done in this repo. Words: [CONTEXT.md](CONTEXT.md). [ROADMAP.md](ROADMAP.md) is the index (where we
are, the order, the phases being built). Each phase's decisions, tickets and challenge round: its plan in
[docs/plans/](docs/plans/), read only when that phase comes up. Finished phases: [docs/roadmap-archive.md](docs/roadmap-archive.md),
read only when needed. Decisions with a long "why": [docs/adr/](docs/adr/).

## Planning ("plan it by our method")
- Grill Noam first (short multiple-choice questions) on anything open, including details Claude would otherwise
  decide alone; record every decision so it's never re-asked. "Decided against" items are never re-suggested.
- **Where decisions go (Noam, 7 Oct 2026; keeps ROADMAP.md short):**
  - A phase's decisions go in a **Decisions** section at the top of its plan, never in ROADMAP.md. Only the phases
    being built (status **building** or **paused** in the order table) keep their decisions in ROADMAP.md; when a
    phase starts building, its decisions stay in its plan and ROADMAP.md gets only its row and a link.
  - Decision numbers are global; the next free one is in ROADMAP.md's header (bump it with every new decision).
  - One bullet per decision, at most two lines: `**N · Bold lead.** What, the why in a few words. *(date)*`, grouped
    under short bold headings. A changed decision is edited in place with the old value in brackets ("36, was 12"),
    not added as a new paragraph. Implementation detail goes in the tickets, not in the decision.
  - ROADMAP.md holds: Resume here (rewritten each session, not appended), the order table (one row per phase), the
    building phases, Backlog, Decided against. Nothing else; if it grows past about 120 lines, something belongs in
    a plan.
  - When a phase is done, its row goes and its plan's Decisions move to `docs/roadmap-archive.md` (a summary line and
    a link to the plan).
  - Working rules (how tickets are built, tested, merged) go in CLAUDE.md itself; a decision about them is noted once
    in the plan of the phase that made it.
- One plan per phase in `docs/plans/<name>.md`: a ticket table `| # | Ticket | Tier | Blocked by | Branch | Status |`
  (ticket 0 is the plan itself), then per ticket: what to build, files, **Test first**, **Done when**; and a
  **Challenge round** at the end (weakest assumption, what I hadn't read, the lazier version).
- New glossary words go in CONTEXT.md. A new issue Noam asks to plan gets a row in ROADMAP.md's order table and a
  plan; the issue gets a comment linking the plan.
- The plan ships as its own `plan/...` PR.

## Building (standing permission from Noam, 29 Sep 2026; Opus only since 30 Sep 2026)
- **Who builds:** Claude on Opus by default. No Sonnet, no sub-agents for building (Noam, 30 Sep: Sonnet's work
  wasn't to his liking on this project).
  - **Sonnet experiment (decisions 276–282): ended after Phase 22 ticket 16** (Noam, 8 Oct 2026). Sonnet with Opus
    supervising was slower and costlier than Opus alone; the `sonnet-handoff` skill stays for reference only.
- **Grok tickets (Noam, 5 Oct 2026):** Noam picks them at hand-off ("Grok takes ticket N"); nothing in the plan
  marks them. Grok Build builds, Claude reviews and merges:
  - Claude creates the ticket's branch, then runs `grok -p` headless with the plan file and ticket number, asking
    for a short summary back; Grok's full output goes to a scratch file, not Claude's context.
  - **Grok plans first (Noam, 7 Oct 2026):** its first run writes only `test-results/tN-plan.md` (per item for
    content, files and approach for code) and stops; Claude reviews the plan and sends changes until it passes.
  - Grok then builds from the approved plan (`--continue`), from the ticket's **Test first**, and commits on that
    branch. It runs only the ticket's test files; the commit hook runs the changed ones, CI the full suite (308). It never pushes,
    opens PRs or merges.
  - Claude runs the review checks below, pushes, opens the PR, marks the ticket `done (PR #n)`, and merges on green
    CI — the same bar as Claude's own tickets.
  - Review fails → Grok gets the findings for one fix round. Still failing → Claude finishes the ticket and says so
    in the PR.
- **NEVER MORE THAN 2 TICKETS BUILDING AT ONCE (Noam, 6 Oct 2026). A hard cap, not a target.** Building = a Grok
  run or Claude's own build; a PR only waiting on CI doesn't count. Before starting any ticket, count what is
  building; at 2, the next one waits. Why: the machine has 2 cores (a third checkout slows every test run), and
  every Grok ticket ends in Claude's review, so a third builder only queues finished work.
- **Look for the next ticket at every checkpoint (Noam, 6 Oct 2026):** after each hand-off, each PR opened and each
  merge, read the plan's ticket table and start the next `todo` ticket that can run now, up to the cap of 2.
  Running one at a time when a second could start is the exception; say why. A ticket can run alongside another
  only when all of these hold:
  - both tickets are in the same phase: never two phases at once (a new phase starts only when the last one's
    tickets are merged);
  - its blockers are done, or its one blocker is the ticket in flight and the new branch starts from that ticket's
    branch (stacked), rebased onto `main` once the blocker squash-merges;
  - it doesn't edit the same files as a ticket still *building* (those wait; a Grok one then continues that
    session). Once a ticket's PR is open and in CI, it isn't building: the next ticket starts right away, even on
    the same files, built locally on that branch (Noam, 6 Oct 2026), and pushed only after that PR merges, rebased
    onto the new `main` (10 Oct 2026, see Mechanics). If the PR then needs a change, make it there and carry it into
    the local branch (merge or rebase, never revert the local work);
  - each ticket has its own working folder: the main checkout or a `git worktree` (`npm ci` once in a new one),
    never two builders in one tree; UI tests in a worktree run with `UI_PORT=4174`, so two checkouts never share
    a test server;
  - merges still go in plan order, each on its own green CI, and main's run is checked green before the next merge;
  - a fix the earlier ticket needs is made on its branch (in its worktree), then carried into the stacked one.
- **Plan the next one meanwhile (Noam, 9 Oct 2026):** when the next ticket can't *build* yet only because it edits the
  same files as the one building, start its Grok *plan* run in the free checkout anyway (it writes only
  `grok/tN-plan.md`, no shared files). The prompt names the ticket still building, so ids and names don't clash, and
  counts what it adds. The build then continues from the approved plan once the blocker's PR is open, stacked on it.
  A plan run counts toward the cap of 2.
- **Time targets may run 10% over (Noam, 9 Oct 2026):** a warm-up, cool-down, trimmed day or minutes band up to 10%
  past its target is fine (the cool-down up to 150 s): widen the check rather than reworking shared builder code.
  Never change how existing programs build to hit a band.
- **Merge without asking:** when a ticket passes the review checks below and the PR's CI run is green, Claude merges
  its PR itself (squash). A PR behind `main` is first updated (`gh pr update-branch`) and merged on that run's
  green: main's run then only builds and deploys (decision 128, 7 Oct 2026).
  Tell Noam what was merged, briefly.
- **Review checks:**
  - **No local `test:coverage` (decision 308, Noam, 10 Oct 2026):** the PR's CI runs the full unit suite with the
    coverage gate (100% lines and functions, branches at least 95%), and the merge waits for that green job. Locally,
    run only the test files the ticket writes or changes (`node --test tests/x.test.js`); the pre-commit hook runs
    those too. On 2 cores the full suite took 12–15 minutes per ticket;
  - for UI tickets only (the branch touches `app/`, `index.html`, styles or a spec; content tickets rely on the PR's
    CI, decision 130): **locally, only the ticket's own specs and the smoke check** (decision 309, Noam, 10 Oct 2026):
    `npx playwright test tests-ui/<the ticket's spec>.spec.js tests-ui/renders.spec.js --project=phone-light`. The
    specs mapped to the changed modules and the **full suite, light and dark, run in CI on the PR, and the ticket
    merges only when that run is green**. A new spec or module still gets its line in `scripts/ui-affected.js`'s MAP
    (`npm run test:ui:affected` stays for a wider local run when a change is risky);
  - when programs could be affected: `rm -rf data && node build.js` on main and on the branch, `diff -r` shows only
    new program files, and no existing pin in `tests/fixtures/program-days.json` changes (never re-pin);
  - `index.html` stays under the 1 MB gzip gate (Noam, 6 Oct 2026: Phase 22 ticket 1b moves the build's check to it);
  - for UI work, look at a 390 px screenshot (light and dark) and check 360 px has no sideways scroll.
- **Rules that never bend:** a program you're halfway through never reshuffles (pins; own programs build only from
  their stored config); progress sync and stored shapes stay compatible; old backups still import.
- One ticket = one branch = one PR, starting from its Test first. Mark the ticket `done (PR #n)` in its plan **in
  the ticket's last commit, before the first push** (Noam, 6 Oct 2026: a later status push cancels the PR's CI run).
  `n` is the repo's newest issue or PR number + 1 (`gh api "repos/{owner}/{repo}/issues?state=all&per_page=1" --jq
  '.[0].number'`); if the PR gets another number, fix it in the next ticket's branch, never with a push to this one.
- A stopped hand-off can leave partial work in the tree: commit it as WIP on the ticket's branch, keep `main` clean.

## Writing program text (Noam, 5 Oct 2026)
- **His side, always:** the app is Noam's. The blurb and about of every After dark or couple program, in any phase,
  are written from his POV ("you" is him, she is "her") or a straight couple's ("you two"), picked per program, never
  hers. Just as explicit as what's there, or hotter, never toned down. Whoever writes it (Claude or Grok) follows this.
- **A straight man training his own body:** the workout trains *his* body, and the text says what that does for him:
  what he does to her, how long he lasts, how she sees and enjoys him. His ass is for drive, and for her to grab or
  admire; never fucked, never "ass up" or bent over. His flexibility lets *him* get deeper, kneel, fold over her; it
  never bends her. Nothing receiving is said about him (riding, taking it, being held up). She may blindfold him, tie or cuff his wrists or ankles, gag him, or use ice or wax on him; nothing goes in him, no pegging and no fingers or toy in his ass. She may rim him: her tongue on his asshole is allowed, and nothing goes in him, no pegging and no fingers or toy in his ass.
- `tests/his-pov.test.js` (from Phase 20 ticket 5.5) checks every `couple: true` program for her-side phrasings; a
  new program never gets an exception just to pass. The test catches the obvious ones; Claude's review reads each new
  blurb and about for POV and heat before merging, and sends softer or her-side text back.
- **Describe the session, not the builder** (Noam, 5 Oct 2026): no slots, catalogues, old or new positions, exercises
  being dealt. `tests/his-pov.test.js` checks every couple and After dark program.
- **Equal odds in sex blocks** (Noam, 5 Oct 2026): a couple program on catalogue 11 or later names the merged pools
  (`sexPositions`, `sexWarm`, `sexFuck`), never a hand-weighted mix of pools; basics (`basic: 1`) come up about 1.5×.
  `tests/couple-odds.test.js` checks every such program.
- **A session that makes sense** (Noam, 9 Oct 2026): every couple program follows
  [docs/explicit-guidelines.md](docs/explicit-guidelines.md): clothed teasing first and never back, oral anywhere, a
  shower set between anal and her pussy or mouth, the finish closing its set, props off once, a place per set. Grok
  reads it for every couple ticket; Claude reviews against it. Phase 36 makes the builder keep it.

## Mechanics
- Use `gh` (installed and signed in on Noam's machine; from Git Bash it's `"/c/Program Files/GitHub CLI/gh.exe"`
  if not on PATH): `gh pr create`, `gh pr checks`, `gh pr merge`, `gh api` for the rest. Plain curl to the REST API
  has no auth locally (the proxy auth is cloud sessions only); there, send `-H "Content-Type: application/json"` on
  every POST/PUT.
- `npm install` rewrites `package-lock.json`; don't commit that.
- Give commands generous time limits, about twice what they take on a busy machine (Noam, 6 Oct 2026: a tight
  `timeout` cut a UI run short and cost a rerun): `npm run test:coverage` and the affected UI tests 10 min each, a
  chain of them in the background with a 30 min wait (Noam, 6 Oct 2026: the catalogue grows in Phase 22); CI 30 min
  (the PR test job took 15 min on 6 Oct). Cutting the times: #265.
  Never wrap a test command in a shell `timeout` shorter than that.
- **Long runs go in the background (Noam, 10 Oct 2026):** on the 2-core cloud machine `test:coverage` and the affected UI
  tests each take 10 min or more, longer than a tool call waits. Start them with `nohup … > log &` and poll the log;
  never in the foreground, where a cut-off wait throws the run away. One heavy run at a time per machine: a second
  one starves the UI build (`webServer` times out at 240 s).
- **Push one ticket at a time; CI runs once per tree (Noam, 10 Oct 2026):** build the next ticket locally while the
  previous PR is in CI, but push it only after that PR merges, branched from the new `main`: no stacked PRs, no rebase
  reruns, no fix cascading up a stack. A PR run whose tree already passed on that PR skips its tests (`mark` job and
  "Did this exact tree already pass?" in `deploy.yml`).
- **Before pushing a content ticket, `npm run check:new [subject…]` (Noam, 10 Oct 2026):** builds only this phase's
  programs and runs the whole-library CI rules on them (time ranges, gear, abs, about, names, muscle focus,
  bodyweight-only stand-ins). Push only when it says all ok; a rule CI then catches gets added to it.
- **Waiting on CI polls, never a blind sleep (Noam, 10 Oct 2026):** check the PRs' check-runs every 30 s in one command
  and stop the moment any job's state changes (finishes or fails), giving up after ~9 min with no change and starting
  again. A `sleep 400` learned of a finished run up to 7 minutes late.
- **Pins (Noam, 10 Oct 2026):** `tests/fixtures/program-days.json` holds a SHA-256 of each program's days. The build
  (`build.js`) stops before writing anything if a pinned program is missing or its days changed (`scripts/pins.js`).
  `npm run pin` builds only this phase's programs (`added: 23` and later): it adds pins for new ones and checks the ones
  they have. Existing pins are never changed by hand; the full check runs in CI.
- `npm run build` rewrites `recipes/book.json`: restore it (`git checkout recipes/book.json`) before committing.
- **Nothing that builds the whole library runs on this machine (decision 312, Noam, 10 Oct 2026):** test files marked
  `// ci-only` on their first line build or read all the programs; the commit hook skips them and only CI runs them.
  Locally, only light, single-purpose tests; for a heavy change, push and read the PR's CI result instead of timing it
  here (a slow-test fix measured with slow local runs only made more slow runs).
- Committed tests never write outside the repo (screenshots go to `test-results/`); review screenshots for Noam go to
  `/home/claude/kettle-bar-shots/` from a throwaway script or spec that isn't committed. CI (the deploy) must stay green:
  after merging, don't wait on main's Test and deploy run; start the next ticket, and check that run is green before
  merging the next PR (fix a red one first).
- Markdown-only PRs (plans, docs, ROADMAP, CLAUDE.md) get no CI run (`paths-ignore` in `deploy.yml`, 5 Oct 2026):
  merge them without waiting for CI.
- Firestore rules changes need Noam to publish them in the Firebase console: say so at the top of the PR and
  message him after merging.

# Working on Kettle & Bar

How Noam wants work done in this repo. Words: [CONTEXT.md](CONTEXT.md). Decisions: [ROADMAP.md](ROADMAP.md) (open
work; finished phases in [docs/roadmap-archive.md](docs/roadmap-archive.md), read only when needed), [docs/adr/](docs/adr/). Plans and tickets: [docs/plans/](docs/plans/).

## Planning ("plan it by our method")
- Grill Noam first (short multiple-choice questions) on anything open; record every decision, dated, in ROADMAP.md
  under its phase so it's never re-asked. When a phase is done, move its section to `docs/roadmap-archive.md`. "Decided against" items are never re-suggested.
- One plan per phase in `docs/plans/<name>.md`: a ticket table `| # | Ticket | Tier | Blocked by | Branch | Status |`
  (ticket 0 is the plan itself), then per ticket: what to build, files, **Test first**, **Done when**; and a
  **Challenge round** at the end (weakest assumption, what I hadn't read, the lazier version).
- New glossary words go in CONTEXT.md. A new issue Noam asks to plan goes into ROADMAP.md, with a comment on the issue
  linking where it's planned.
- The plan ships as its own `plan/...` PR.

## Building (standing permission from Noam, 29 Sep 2026; Opus only since 30 Sep 2026)
- **Who builds:** Claude on Opus by default. No Sonnet, no sub-agents for building (Noam, 30 Sep: Sonnet's work
  wasn't to his liking on this project).
- **Grok tickets (Noam, 5 Oct 2026):** Noam picks them at hand-off ("Grok takes ticket N"); nothing in the plan
  marks them. Grok Build builds, Claude reviews and merges:
  - Claude creates the ticket's branch, then runs `grok -p` headless with the plan file and ticket number, asking
    for a short summary back; Grok's full output goes to a scratch file, not Claude's context.
  - Grok builds from the ticket's **Test first** and commits on that branch. It never pushes, opens PRs or merges.
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
    the same files, stacked on that branch (Noam, 6 Oct 2026). If the PR then needs a change, make it there and
    resolve the conflicts in the stacked branch (merge or rebase, never revert the stacked work);
  - each ticket has its own working folder: the main checkout or a `git worktree` (`npm ci` once in a new one),
    never two builders in one tree; UI tests in a worktree run with `UI_PORT=4174`, so two checkouts never share
    a test server;
  - merges still go in plan order, each on its own green CI, and main's run is checked green before the next merge;
  - a fix the earlier ticket needs is made on its branch (in its worktree), then carried into the stacked one.
- **Merge without asking:** when a ticket passes the review checks below and the PR's CI run is green, Claude merges
  its PR itself (squash).
  Tell Noam what was merged, briefly.
- **Review checks:**
  - `npm test` and `npm run test:coverage` (gated modules: 100% lines and functions, branches at least 95%, kept as
    high as it goes; Noam, 6 Oct 2026);
  - locally, only the phone UI tests the branch touches: `npm run test:ui:affected -- <pages the ticket's UI work
    touched>` (a fresh build, then the changed specs, the specs mapped to the changed modules, the pages named, and a
    smoke check that every page draws; light theme, `--dark` adds dark). The **full suite, light and dark, runs in CI
    on the PR, and the ticket merges only when that run is green** (Noam, 1 Oct 2026: the full local run took ~6 min
    on 2 cores and repeated CI). A new spec or module gets its line in `scripts/ui-affected.js`'s MAP;
  - when programs could be affected: `rm -rf data && node build.js` on main and on the branch, `diff -r` shows only
    new program files, and no existing pin in `tests/fixtures/program-days.json` changes (never re-pin);
  - `index.html` stays under the 350 KB gzip gate (Noam, 6 Oct 2026; the build's check moves to it in Phase 22);
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
  never bends her. Nothing receiving is said about him (riding, taking it, being held up).
- `tests/his-pov.test.js` (from Phase 20 ticket 5.5) checks every `couple: true` program for her-side phrasings; a
  new program never gets an exception just to pass. The test catches the obvious ones; Claude's review reads each new
  blurb and about for POV and heat before merging, and sends softer or her-side text back.
- **Describe the session, not the builder** (Noam, 5 Oct 2026): no slots, catalogues, old or new positions, exercises
  being dealt. `tests/his-pov.test.js` checks every couple and After dark program.
- **Equal odds in sex blocks** (Noam, 5 Oct 2026): a couple program on catalogue 11 or later names the merged pools
  (`sexPositions`, `sexWarm`, `sexFuck`), never a hand-weighted mix of pools; basics (`basic: 1`) come up about 1.5×.
  `tests/couple-odds.test.js` checks every such program.

## Mechanics
- Use `gh` (installed and signed in on Noam's machine; from Git Bash it's `"/c/Program Files/GitHub CLI/gh.exe"`
  if not on PATH): `gh pr create`, `gh pr checks`, `gh pr merge`, `gh api` for the rest. Plain curl to the REST API
  has no auth locally (the proxy auth is cloud sessions only); there, send `-H "Content-Type: application/json"` on
  every POST/PUT.
- `npm install` rewrites `package-lock.json`; don't commit that.
- Give commands a time limit close to how long they really take (the affected UI tests: a minute or two; CI: ~4 min).
- Committed tests never write outside the repo (screenshots go to `test-results/`); review screenshots for Noam go to
  `/home/claude/kettle-bar-shots/` from a throwaway script or spec that isn't committed. CI (the deploy) must stay green:
  after merging, don't wait on main's Test and deploy run; start the next ticket, and check that run is green before
  merging the next PR (fix a red one first).
- Markdown-only PRs (plans, docs, ROADMAP, CLAUDE.md) get no CI run (`paths-ignore` in `deploy.yml`, 5 Oct 2026):
  merge them without waiting for CI.
- Firestore rules changes need Noam to publish them in the Firebase console: say so at the top of the PR and
  message him after merging.

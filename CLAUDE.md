# Working on Kettle & Bar

How Noam wants work done in this repo. Words: [CONTEXT.md](CONTEXT.md). Decisions: [ROADMAP.md](ROADMAP.md),
[docs/adr/](docs/adr/). Plans and tickets: [docs/plans/](docs/plans/).

## Planning ("plan it by our method")
- Grill Noam first (short multiple-choice questions) on anything open; record every decision, dated, in ROADMAP.md
  under its phase so it's never re-asked. "Decided against" items are never re-suggested.
- One plan per phase in `docs/plans/<name>.md`: a ticket table `| # | Ticket | Tier | Blocked by | Branch | Status |`
  (ticket 0 is the plan itself), then per ticket: what to build, files, **Test first**, **Done when**; and a
  **Challenge round** at the end (weakest assumption, what I hadn't read, the lazier version).
- New glossary words go in CONTEXT.md. A new issue Noam asks to plan goes into ROADMAP.md, with a comment on the issue
  linking where it's planned.
- The plan ships as its own `plan/...` PR.

## Building (standing permission from Noam, 29 Sep 2026)
- **Who builds:** Sonnet sub-agents build contained tickets (program content, small features, refactors with a
  byte-identical check). Claude on Opus builds the tricky design tickets itself (where a fix round costs more
  than doing it right: mixing subjects, random workout, anything touching sync or stored data shapes).
- **Parallel:** run up to two tickets at once when they don't touch the same files, each in its own checkout
  (`git worktree add ../kb-<ticket> -b <branch> main`) and its own UI port (`UI_PORT=4174 npm run test:ui`).
  The git proxy allows about two concurrent git operations.
- **Review and merge without asking:** Claude reviews every sub-agent PR and merges it itself (squash) when it
  passes; otherwise sends it back to the same sub-agent with the fixes. Tell Noam what was merged, briefly.
- **Review checks:**
  - `npm test` and `npm run test:coverage` (100% on the gated modules);
  - the phone UI suite (`npm run test:ui`) once, after a fresh build (Playwright reuses a running server);
  - when programs could be affected: `rm -rf data && node build.js` on main and on the branch, `diff -r` shows only
    new program files, and no existing pin in `tests/fixtures/program-days.json` changes (never re-pin);
  - `index.html` stays under the 150 KB gzip gate;
  - for UI work, look at a 390 px screenshot (light and dark) and check 360 px has no sideways scroll.
- **Rules that never bend:** a program you're halfway through never reshuffles (pins; own programs build only from
  their stored config); progress sync and stored shapes stay compatible; old backups still import.
- One ticket = one branch = one PR, starting from its Test first. Mark the ticket `done (PR #n)` in its plan.
- A stopped hand-off can leave partial work in the tree: commit it as WIP on the ticket's branch, keep `main` clean.

## Mechanics
- `gh` isn't installed; use the GitHub REST API with curl (auth comes from the proxy). Send
  `-H "Content-Type: application/json"` on every POST/PUT.
- `npm install` rewrites `package-lock.json`; don't commit that.
- Firestore rules changes need Noam to publish them in the Firebase console: say so at the top of the PR and
  message him after merging.

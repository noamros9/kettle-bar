# Phase 11: CI upkeep

Decided 2 Oct 2026 (Noam): first, before anything else. GitHub warns on every run that `actions/checkout`,
`actions/setup-node` and `actions/upload-artifact` v4 target Node 20 (deprecated, forced onto Node 24), and the
`ubuntu-latest` runner moves to Ubuntu 26 on 19 Oct 2026. The deploy (`deploy.yml`) and the nightly backup
(`backup.yml`) must keep working without anyone watching.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan (in the 2 Oct roadmap plan) | plan | – | `plan/roadmap-oct` | |
| 1 | Current actions, a pinned runner | chore | – | `chore/ci-upkeep` | |

### 1. Current actions, a pinned runner
- Bump every action to its current major (checkout, setup-node, upload-artifact, upload-pages-artifact, deploy-pages)
  in both workflows; Node 22 stays the app's Node.
- Pin `runs-on: ubuntu-24.04` in both workflows, so the 19 Oct move to Ubuntu 26 can't change them silently; moving
  to 26 is its own later ticket, tested on a PR.
- **Test first:** `tests/ci.test.js` checks no workflow uses an action major listed as deprecated (v4 of
  checkout / setup-node / upload-artifact) and every job pins its runner.
- **Done when:** the PR's run has no Node 20 deprecation annotation; the nightly backup is run once by hand
  (`workflow_dispatch`) and passes.

## Challenge round
- **Weakest assumption:** that the new majors behave the same. Their changelogs are the check; the PR's own run (and
  a hand-run backup) prove it.
- **Lazier version:** only pin the runner. The Node 20 warnings would turn into failures later anyway.

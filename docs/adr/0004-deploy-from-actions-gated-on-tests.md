# 4. Deploy from GitHub Actions, gated on tests

**Status:** accepted (Sep 2026)

## Context
Pages currently serves `index.html` committed to `main`, so a broken build goes live the moment it's
pushed, and every change commits a ~1.6 MB generated file.

## Decision
A GitHub Actions workflow builds the app, runs the unit tests with a 100% coverage gate on the core
modules and the phone UI tests, and only then deploys to Pages. Built files (`index.html`, `sheet.html`)
are no longer committed. A pre-commit hook runs the same unit tests
and coverage gate locally.

Core modules: Workout Session, Progress Store, Program Builder, Exercise Catalogue, Figure engine and the
backup code. Page modules (views, clock, main) are covered by the UI tests instead of a line count.

## Consequences
- A red test means the live app stays on the last good version.
- Pages must be switched to "GitHub Actions" as its source (a one-time manual step).
- Diffs show source changes only.

**Amended 6 Oct 2026 (Noam):** the branch gate is 95%, not 100% (lines and functions stay at 100%); keep
branches as high as they go.

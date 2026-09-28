# 3. Retire the claude.ai build

**Status:** accepted (Sep 2026)

## Context
The app was first published as a claude.ai artifact, syncing through that artifact's database. It now
lives on GitHub Pages with Firebase sync. Keeping both means a second build output, a second sync adapter
and a second place progress could hide. The claude.ai progress document for Three-Split 60 was empty, so
nothing needs migrating.

## Decision
GitHub Pages (`noamros9.github.io/kettle-bar`) is the only home. The artifact is replaced by a short note
pointing there. `kettle-and-bar.html` and the claude.ai database adapter are removed.

## Consequences
- One build output, one remote adapter (Firebase), one place to back up.
- The old artifact link keeps working but only redirects people by text.

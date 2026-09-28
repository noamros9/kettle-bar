# 5. Backups hold no write credentials

**Status:** accepted (Sep 2026)

## Context
The nightly backup reads every progress document from Firestore with a service account stored as a GitHub
secret. A restore needs to write to Firestore. A write-capable key in a repo secret could wipe progress if
it leaked or a workflow misbehaved.

## Decision
The service account only has read roles (Cloud Datastore Viewer, and Firebase Authentication Viewer so
the file can show each account's email). Restoring goes through the app's
**Import** on the Settings page, signed in as yourself: download the nightly file from the backup repo,
import it, review the diff, choose merge or replace. Firestore rules already let you write your own
progress, so no extra credentials exist anywhere.

## Consequences
- A leaked backup key can read progress but never change it.
- Import must accept the nightly file (which holds every account) as well as a single export, and pick the
  signed-in account's entry.
- No separate restore script to maintain; a restore is tested by importing a nightly file on a phone.

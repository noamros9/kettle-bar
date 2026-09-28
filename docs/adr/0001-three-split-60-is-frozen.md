# 1. Three-Split 60 is frozen

**Status:** accepted (Sep 2026)

## Context
Progress is stored as day numbers per program. The Program Builder generates days from a config, and any
change to pools, the time model or the random seed changes what "day 17" contains.

## Decision
Three-Split 60, the program Noam is training on, is read from `programs/three-split-60.json` instead of
being generated. Every other program is generated on each build.

## Consequences
- Builder changes can never rewrite a day that was already marked done in Three-Split 60.
- Improvements to the builder don't reach Three-Split 60. Changing it means editing the JSON on purpose.
- Other programs can still shift when the builder changes; freeze them the same way once someone trains on
  them.

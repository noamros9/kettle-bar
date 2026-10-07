# Phase 29: stories from the couple workouts, by Grok, in Google Drive

Issue [#225](https://github.com/noamros9/kettle-bar/issues/225). Grilled 7 Oct 2026 (Noam); decisions 78, 135 and
162–163 in [ROADMAP.md](../../ROADMAP.md). Last in the order (78, 134); replanned when it starts if need be (135).

## What lands
- **Nothing in the app** (162): the stories live in Noam's Google Drive; the app never stores or shows them.
- **A workout as the seed** (162): a couple program's day (its name, the program's about, the day's blocks and their
  exercises' names and cues) is what Grok writes from. **Couple programs only.**
- **On request** (163): Noam asks Claude ("a story for day 12 of Slow Deep Fuck") or runs the script himself:
  `npm run story -- <program id> <day>`.
- **Grok writes from Noam's own prompt file** (163), kept on his machine (never committed); no Claude review. A small
  script uploads the result to Drive with a Drive key, so **the story never passes through Claude**: Claude runs the
  command and reports only "uploaded" and the Doc's link.
- **A Google Doc per story** (163); the exact Drive layout (folders, names) is settled with Noam before the first run.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/unplanned-phases` | done (PR #281) |
| 0b | Settle the Drive layout and the prompt file's place with Noam | plan | – | `plan/p29-layout` | todo |
| 1 | The seed: a couple day as text | feature | – | `feature/story-seed` | todo |
| 2 | The run: Grok, then upload to Drive | feature | 0b, 1 | `feature/story-run` | todo |
| 3 | Close: how to ask for a story in CLAUDE.md, CONTEXT.md, archive | plan | 2 | `plan/p29-close` | todo |

### 1. The seed
- **Build:** `scripts/story-seed.js <program id> <day>`: builds the library, refuses a program that isn't
  `couple: true` or a day out of range, and prints the seed: the program's name and about, the day's name and level,
  and per block its format and each exercise's name and cue, in order. Plain text, no instructions to Grok (those are
  Noam's prompt file).
- **Files:** `scripts/story-seed.js`, `package.json`, `tests/story-seed.test.js`.
- **Test first:** a couple day gives its blocks and exercises in order; a fitness program or day 61 is refused with a
  message.
- **Done when:** 100% lines and functions on the script.

### 2. The run
- **Build:** `scripts/story.js <program id> <day>` (`npm run story`): the seed (ticket 1) plus Noam's prompt file
  (path from `STORY_PROMPT`, outside the repo) go to `grok -p`; Grok's output is written to a gitignored temp file,
  never printed; the script uploads it as a Google Doc to the folder settled in 0b, using an OAuth token on Noam's
  machine (`STORY_DRIVE_TOKEN`, made once with a small sign-in step the ticket adds; a service account can't own
  files in a personal Drive); then deletes the temp file and prints only the Doc's name and link. A story for a day
  already in Drive asks before writing another (or `--again`).
- **Files:** `scripts/story.js`, `scripts/story-auth.js`, `.gitignore`, `package.json`, `tests/story.test.js` (fake
  grok, fake Drive).
- **Test first:** with fakes: the prompt file and seed reach grok; the output is uploaded and never printed; the temp
  file is gone after, also on a failed upload; a missing `STORY_PROMPT` or token stops with a message before running
  Grok.
- **Done when:** one real run by Noam on his machine lands a Doc where 0b said.

## Challenge round
- **Weakest assumption: that the run happens on Noam's machine.** Grok and the Drive token are there; a cloud session
  (like this one) has neither. "On request" from a cloud session needs either the desktop app linked (Claude runs it
  through the device shell) or Noam running the command. Ticket 3 writes both ways down.
- **What I hadn't read:** Noam's prompt file (he has it ready, 7 Oct). It isn't read by Claude by design; ticket 2
  only needs its path. If the prompt expects other seed fields (the partner's name, a setting), 0b asks.
- **The lazier version:** Noam pastes the seed into Grok himself and saves the Doc. Not proposed: he asked to automate
  it (#225); the seed script alone (ticket 1) is that lazier version, and it ships first.
- **Couple programs only** (162): a solo After dark program has no "her" in its seed; if Noam later wants them, the
  seed script's refusal is the one line to change.

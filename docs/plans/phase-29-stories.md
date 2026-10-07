# Phase 29: stories from the couple workouts, by Grok, in Google Drive

Issue [#225](https://github.com/noamros9/kettle-bar/issues/225). Grilled 7 Oct 2026 (Noam); decisions 78, 135,
162–163 and 167–168 in [ROADMAP.md](../../ROADMAP.md). Last in the order (78, 134); replanned when it starts if need
be (135).

## What lands
- **Nothing in the app** (162): the stories live in Noam's Google Drive; the app never stores or shows them.
  **Couple programs only.**
- **A screenshot of the day as the seed** (168): Noam's prompt asks for a story based on a screenshot of the workout.
  The script renders the day's page full length at phone width (every block, exercise and drawing) and hands Grok
  that image with his prompt.
- **On request** (163): Noam asks Claude ("a story for day 12 of Slow Deep Fuck") or runs it himself:
  `npm run story -- <program id> <day>`.
- **Grok writes from Noam's own prompt file** (163), kept on his machine (never committed); no Claude review. The
  script uploads the result to Drive with a Drive key, so **the story never passes through Claude**: Claude runs the
  command and reports only the Doc's name and link.
- **A folder per program** (167): "Kettle & Bar stories / <program> / Day 12 — <title>", a Google Doc each.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/unplanned-phases` | done (PR #281) |
| 1 | The seed: a couple day's page as a full-length screenshot | feature | – | `feature/story-seed` | todo |
| 2 | The run: Grok with the image and the prompt, then upload to Drive | feature | 1 | `feature/story-run` | todo |
| 3 | Close: how to ask for a story in CLAUDE.md, CONTEXT.md, archive | plan | 2 | `plan/p29-close` | todo |

### 1. The seed
- **Build:** `scripts/story-seed.js <program id> <day> [out.png]`: refuses a program that isn't `couple: true` or a
  day out of range; serves the built app (as the UI tests do), opens `#program/<id>/<day>` in Playwright at 390 px
  wide, light theme, signed out, and saves a full-page PNG (default into a gitignored `story-tmp/`). It prints only the
  file's path.
- **Files:** `scripts/story-seed.js`, `.gitignore`, `package.json`, `tests/story-seed.test.js` (the refusals, pure),
  `tests-ui/story-seed.spec.js` (one couple day renders to a PNG taller than one screen).
- **Test first:** a fitness program and day 61 are refused with a message before any browser starts; a couple day
  gives one PNG of the whole page.
- **Done when:** 100% lines and functions on the script's pure part; the spec's line in `scripts/ui-affected.js`.

### 2. The run
- **Build:** `scripts/story.js <program id> <day>` (`npm run story`): ticket 1's screenshot plus Noam's prompt file
  (path from `STORY_PROMPT`, outside the repo) go to `grok -p` with the image attached; Grok's output is written to a
  gitignored temp file, never printed; the script finds or makes the program's folder under "Kettle & Bar stories"
  and uploads the story as a Google Doc named "Day <n> — <day name>", using an OAuth token on Noam's machine
  (`STORY_DRIVE_TOKEN`, made once by `scripts/story-auth.js`; a service account can't own files in a personal Drive);
  then deletes the temp files and prints only the Doc's name and link. A story for a day already there asks before
  writing another (or `--again`, which names it "… (2)").
- **Files:** `scripts/story.js`, `scripts/story-auth.js`, `.gitignore`, `package.json`, `tests/story.test.js` (fake
  grok, fake Drive).
- **Test first:** with fakes: the prompt file and the image reach grok; the output is uploaded into the program's
  folder and never printed; the temp files are gone after, also on a failed upload; a missing `STORY_PROMPT` or token
  stops with a message before running Grok.
- **Done when:** one real run by Noam on his machine lands a Doc in the right folder.

## Challenge round
- **Weakest assumption: that `grok -p` takes an image on the command line.** Not verified. Ticket 2 checks first; if
  headless Grok can't take one, the fallbacks in order: Grok's API with the image (needs an API key in Noam's
  environment), or Noam pastes the PNG into Grok himself and the script only uploads what he saves.
- **The run happens on Noam's machine:** Grok, the prompt file and the Drive token are there; a cloud session has none
  of them. "On request" from a cloud session needs the desktop app linked (Claude runs it through the device shell)
  or Noam running the command. Ticket 3 writes both ways down.
- **What I hadn't read:** Noam's prompt file (by design: only its path is needed), and whether the day page shows
  everything a story needs at one glance (the program's about sits on the program page, not the day's). If his
  prompt wants the about, the script adds the program page's top as a second image (the option he didn't pick, 168).
- **The lazier version:** Noam screenshots the day himself and pastes it into Grok. Ticket 1 alone (the full-length
  screenshot a phone can't take in one go) is that lazier version, and it ships first.

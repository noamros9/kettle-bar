# Phase 28: explicit drawings and loops for the explicit exercises

Issue [#249](https://github.com/noamros9/kettle-bar/issues/249). Grilled 6–7 Oct 2026 (Noam); decisions 106–115 and
160–161 in [ROADMAP.md](../../ROADMAP.md). After Phase 19 (134).

## What lands
- **Three views of an explicit exercise** (108, 109): Figure (the stick figure) · Drawing (a still) · Animation (a
  short loop). Settings sets the default (Drawing, 108); a switch on each exercise page overrides it there.
- **Signed-in only, in Firebase Storage, never in the public repo, never cached** (110): Storage rules let only
  Noam's account read and write; the page fetches a file each time it shows one (no service worker, no offline).
- **Found online by Grok** (112, 160): Claude runs `grok -p` with web search and fetch allowed for these tickets only.
  Stills: the flat two-colour vector diagrams from the site of Noam's first pick; loops: the shaded cartoon GIFs
  from the second site, converted to muted MP4/WebM loops (115). Drawings of two adults only (no photos, medical
  cross-sections or old fine-art prints); a mislabeled file is skipped. Each file records its source URL (113).
- **Noam approves each, side by side** (111, 160): finds wait as *pending* in Storage; a signed-in review page shows
  the exercise's stick figure and cue next to the found drawing or loop, with Approve and Reject. Claude never opens
  the files (it can't review explicit images, 111): it only checks counts, types, sizes and the review state.
- **The stick figure until approved** (161): no match, or nothing approved yet, shows the figure in every view.
- **From now on** (107): a ticket that adds an explicit exercise also runs the search for it (CLAUDE.md gets the rule).

Licence: decision 113 stands (private use, taken as found, source URL recorded); Claude raised the copyright risk of
re-hosting others' artwork on 6 Oct and Noam chose this.

## Also settled (7 Oct, evening)
- **A drawing replaces the figure everywhere it shows** (176): exercise page, day page, big timer, swap list; the
  view switch decides for all of them. Ticket 1's spec checks each place.
- **Loops play on their own, muted, tap to pause** (177).
- **Up to 3 finds of each, Noam keeps one** (173).
- **"Find another"** (198) on the exercise page (signed in as Noam): adds the exercise to `media/queue.json`;
  `find-media.js --queue` searches those next. The approved file stays until a new one is kept. In ticket 2.

## Storage layout
`media/pending/<exercise id>/<drawing|loop>-<1..3>.<ext>` (up to 3 finds of each, 173) and `media/approved/<exercise id>/<drawing|loop>.<ext>`, each
with custom metadata `{ source, site, foundAt }`. Keeping one copies it to approved and deletes the other
pending finds of that kind; Reject (or rejecting all) deletes them and records the URL in `media/rejected.json` so the next search skips it.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/unplanned-phases` | done (PR #281) |
| 1 | Storage plumbing: rules, SDK, the three views and the switches | feature | – | `feature/media-views` | todo |
| 2 | The review page: side by side, Approve and Reject | feature | 1 | `feature/media-review` | todo |
| 3 | The search run: Grok with web tools, ffmpeg, upload as pending | feature | 1 | `feature/media-search` | todo |
| 4 | Batch 1: catalogue 10 and 11 explicit exercises | content | 2, 3 | `content/media-c10-c11` | todo |
| 5 | Batch 2: Phase 22 intercourse, oral, anal, toys, hands | content | 4 | `content/media-c13-a` | todo |
| 6 | Batch 3: Phase 22 Rough, Kink-lite, Body play, Rimming | content | 5 | `content/media-c13-b` | todo |
| 7 | Batch 4: Phase 22's eight places and play kinds | content | 6 | `content/media-c13-c` | todo |
| 8 | Close: the standing rule in CLAUDE.md, CONTEXT.md, archive | plan | 7 | `plan/p28-close` | todo |

Ticket 3 can build alongside ticket 2 (stacked on 1; 2 is the page, 3 is a script).

### 1. Storage plumbing and the views
- **Build:** `storage.rules` (read and write only for Noam's uid; nothing else in the bucket) and `firebase.json`'s
  storage entry; the Storage SDK vendored like Firestore's (`scripts/vendor-firebase.js`), loaded only when an
  explicit exercise page opens while signed in; `app/media.js` (`KBMedia`): `views(exId)` lists what's approved,
  `url(exId, kind)` gets a fresh download URL; the exercise page draws the chosen view (Animation as a muted, looped,
  inline `<video>`), falling back to the figure; Settings gets "Explicit exercises: Figure / Drawing / Animation"
  (synced in prefs as `media`); `sw.js` never caches the Storage host.
- **Files:** `storage.rules`, `firebase.json`, `scripts/vendor-firebase.js`, `app/media.js`, `app/pages/exercises.js`,
  `app/pages/settings.js`, `app/docs.js` (the prefs field), `sw.js`, `tests/media.test.js`, `tests/sw.test.js` (or the
  cache test), `tests-ui/media.spec.js`, `scripts/ui-affected.js`.
- **Test first:** `media.test.js` with a fake Storage: no approved file → the figure; the page switch overrides
  Settings; signed out → the figure and no Storage call. The cache test: no Storage URL is ever put in the cache.
- **Done when:** the PR says at the top that Noam publishes `storage.rules` in the Firebase console; Claude messages
  him after merging; UI tests use the fake, never real files.

### 2. The review page
- **Build:** `#review` (signed in as Noam only; a link in Settings): the pending exercises one by one: the exercise's name,
  cue and stick figure on one side, its up to 3 found drawings (then its up to 3 loops) on the other, each with its
  source site; **Keep** on one of them, **Reject all**, **Skip**; a count left. As in "Storage layout" (173).
- **Files:** `app/pages/review.js`, `app/media.js` (approve, reject), `app/main.js` (route), `app/styles.css`,
  `tests/media.test.js`, `tests-ui/review.spec.js`.
- **Test first:** with the fake Storage: Keep moves the chosen file and its metadata and deletes the other finds of
  that kind; Reject all deletes them and adds the URL to
  `rejected.json`; a non-Noam account sees nothing.
- **Done when:** screenshots at 390 px with placeholder images (never real files) light and dark.

### 3. The search run
- **Build:** `scripts/find-media.js <exercise ids | --kind k | --catalogue n>`: per exercise, a `grok -p` run with web
  search and fetch allowed (`--allow` for those two tools only; never in other tickets), given the exercise's name,
  cue and pose description, the two sites, the rules of 112 and the rejected URLs; Grok downloads up to 3 stills and
  3 loops (173) into a gitignored folder (`media-inbox/`) and writes `found.json` (`{ id, kind, file, source }`). The script
  checks type and size (a still ≤ 300 KB, a loop ≤ 2 MB after `ffmpeg -an` to MP4 and WebM), uploads each as pending
  with Noam's signed-in session (a small local upload page or the Firebase CLI's auth, decided in the ticket; no
  service-account key in the repo), and deletes the inbox copy. Grok's output goes to a scratch file, not Claude's
  context.
- **Files:** `scripts/find-media.js`, `.gitignore`, `tests/find-media.test.js` (with a fake grok and fake upload).
- **Test first:** a fake grok that returns a still, a GIF and a mislabeled file: the GIF is converted, the oversized
  file and anything not an image or video is dropped, rejected URLs are never passed on, nothing is left in the inbox.
- **Done when:** a dry run on three exercises leaves three or fewer pending items for Noam and nothing in the repo.

### 4–7. The batches
- **Build:** `find-media.js` over the batch; then Noam reviews on `#review`; a second search for the rejected and the
  unmatched (once); what's still unmatched stays a figure (161). Claude records per batch: searched, found, approved,
  rejected, unmatched.
- **Done when:** the batch's counts are in "The batches" below and nothing of the batch is left pending.

## The batches
_(tickets 4–7)_

## Challenge round
- **Weakest assumption: that Noam can review ~1,000 exercises × 2 files.** At 5 seconds each that's under three hours,
  but in one sitting it's a lot. **Plan edit:** batches of one kind at a time are reviewable in a sitting; Skip leaves
  an item for later; a batch's ticket is done when its items are decided, however many sittings.
- **What I hadn't read:** whether `grok -p` can allow web search and fetch for one run without approval prompts (the
  issue notes they need approval and cancel a headless run today). Ticket 3 finds the flag or config first; if there
  is none, the fallback is Noam running Grok interactively for each batch (his other option on 7 Oct) and the script
  taking over from `found.json`.
- **Copyright:** re-hosting found artwork is copying it, private or not (113 records Noam's choice). Claude doesn't
  re-raise it; the source URL per file keeps removal easy if a site ever asks.
- **The lazier version:** stills only, no loops. Not proposed: Noam chose both views (108). Another: link to the files
  where they are instead of copying. Not proposed: links break and expose what Noam opens to those sites; 110 chose
  Storage.

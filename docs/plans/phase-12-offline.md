# Phase 12: offline you can rely on

Decided 2 Oct 2026 (Noam): right after CI upkeep, all four parts. What works offline today: the page opens from the
service worker's cache, every program downloads in the background (Phase 4), the recipe book, exercise index and
muscle focus are cached, and progress is always kept on the phone. What doesn't (found 2 Oct):

- **Slow start on weak signal:** `sw.js` is network-first, so the page waits for the network before falling back.
- **Offline changes can miss the account:** a cloud write that fails is logged and not retried in the session
  (`store.js` `writeDoc`), and the queue is in memory, so closing the app loses it. On the next start the first sync
  merges (newest wins, done days are joined), so additions survive, but an **un-done day, a removed swap or a deleted
  own program made offline can come back** from the cloud.
- **Looks different offline:** the fonts (Google Fonts) and the sync library (gstatic) are other origins, which the
  service worker doesn't cache: offline the fonts fall back and sign-in/sync can't start.
- **Status:** the header dot says offline / saving, but not what is waiting.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan (in the 2 Oct roadmap plan) | plan | – | `plan/roadmap-oct` | done (PR #133) |
| 1 | Open from cache at once, update in the background | feature | Phase 11 | `feature/cache-first` | done (PR #136) |
| 2 | An outbox that survives closing the app | feature | – | `feature/outbox` | |
| 3 | Fonts and the sync library offline | feature | 1 | `feature/offline-assets` | |
| 4 | "Offline · 3 changes waiting" | feature | 2 | `feature/offline-status` | |

### 1. Open from cache at once, update in the background
- The page and its files are served from the cache straight away (stale-while-revalidate); the newest version is
  fetched behind it, and when it differs the app shows "A new version is ready · Reload". Program files stay as they
  are (cached on first load).
- **Test first:** a phone test with the network slowed to 5 s: the page draws from the cache well before that; a
  changed `index.html` on the server shows the Reload note, and Reload brings it in.

### 2. An outbox that survives closing the app
- Every account write (progress, own programs, random workouts, prefs, deletes included) goes into a device-stored
  outbox first and leaves it only when the cloud confirms; sent in order when online, retried on reconnect and on the
  next start, before the first sync merges. Later writes to the same doc replace earlier ones in the box.
- **Test first:** with the memory remote failing, un-mark a day and delete an own program; "close" (a new store on the
  same storage) and reconnect: the cloud matches the phone and nothing comes back. Old device data (no outbox key)
  starts with an empty box.

### 3. Fonts and the sync library offline
- The two Barlow fonts (OFL) are served from the app itself (woff2 in `fonts/`, `@font-face` in the page), and the
  service worker caches the pinned Firebase library files the first time they load, so sign-in state and sync start
  offline (the library's own auth persistence keeps you signed in).
- **Test first:** offline after one online visit, the page's computed font is Barlow and `kbSync` attaches (the
  Firebase stub's files come from the cache); `index.html` stays under the gate.

### 4. "Offline · 3 changes waiting"
- The header's status says how many changes are waiting while offline or sending, and clears when the outbox is empty;
  tapping it explains in one line.
- **Test first:** offline, mark two days done: "2 changes waiting"; back online: it clears once the remote has them.

## Challenge round
- **Weakest assumption:** that the Firebase library can run from the service worker's cache. Its files are plain
  versioned ES modules on gstatic; if a file is fetched differently (CORS, opaque), ticket 3 falls back to
  self-hosting the pinned version in the repo.
- **What I hadn't read:** how the Firestore SDK's own offline queue interacts with the outbox (double writes are
  harmless: same doc, same body; the outbox clears on the first confirmation).
- **The lazier version:** tickets 1 and 2 (speed and no lost changes); fonts and the counter are polish.

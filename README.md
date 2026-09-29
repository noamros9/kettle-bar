# Kettle & Bar

A home workout app in the style of a printable program: a 60-day plan with
illustrated exercises, checkmarks for finished days and a rest timer.

**98 programs, 60 days each**, in 18 subjects and three families (pick one at the top of the Programs page):
- **Strength:** five signature splits (Three-Split 60 and friends), and six programs each for strength, pull-ups,
  legs & glutes, kettlebell only, bodyweight/travel and busy weeks.
- **Cardio & combat:** conditioning (6), HIIT, plyometrics, boxing and kickboxing (5 each).
- **Mind & body:** core & abs (6), mobility & posture, yoga, Pilates, flexibility, and balance & stability (5 each).

Formats include straight sets, supersets, circuits, EMOMs, AMRAPs, Tabatas and ladders, **guided flows** (yoga,
Pilates, stretching: one Start runs every pose, and the voice names each one) and **bouts** (boxing and
kickboxing: 3-minute bouts, the voice calls each combo). Each program gets harder in its own way (reps, longer
holds, heavier weights, harder variations or slow tempo). 262 exercises, each with a drawing that moves on
its page.

**Three-Split 60** — a repeating three-day cycle:

| Days | Workout |
|---|---|
| 1, 4, 7 … | Chest, back & abs |
| 2, 5, 8 … | Full body + abs, alternating upper focus (2, 8, 14 …) and lower focus (5, 11, 17 …) |
| 3, 6, 9 … | Abs & cardio |

Chest & back and full-body days run about 35–38 minutes (5 main exercises), abs & cardio days about 26–31 minutes, all as straight sets: every set of one
exercise before the next, 30 s rest between sets, 1 min between exercises and
2 min before the abs that close every workout. Level I (days 1–20) starts at
an intermediate level; Levels II (21–40) and III (41–60) add reps.

Equipment: dumbbells (6–16 kg pairs), one kettlebell (14–16 kg), a pull-up bar
and a mat.

## Use it

Live at **https://noamros9.github.io/kettle-bar/**. Every push to `main` is built and tested by GitHub
Actions and deployed only if all tests pass (Settings → Pages → Source: **GitHub Actions**).

Progress is always kept on the device. Press **Sign in** (Google) at the top to
sync it through Firebase to every device where you sign in. On first sign-in,
days ticked on the device and in the cloud are merged.

- **Settings** (gear, top right) → **Export progress** downloads every program's done days as one file;
  **Import a backup** shows which days it would add or remove, then asks **Merge** or **Replace**.
- **Tap the logo** (top left) from any page to open today's workout: the next day you haven't done in the program
  where you last marked a workout done (before your first one, the program you opened last).
- Installed on the home screen, long-press the app icon → **Today's workout** opens the same place.
- **Start Round 2** on a program page does the program again from day 1; earlier rounds stay in your stats (Stats can
  narrow to one round).
- Tap a day to open the workout; tick the circle on a tile or press
  **Mark as done** to record it.
- Every workout starts with a 1-minute warm-up and ends with 2 minutes of
  stretches chosen for the muscles that day works. Press **Start warm-up** /
  **Start cool-down** and the timer runs through them hands-free (not counted
  in the workout time).
- Tap any exercise for its page: how to do it, reps per level, equipment, a
  front/back map of the muscles it works, and the days it appears on.
- Tap a set number on an exercise when you finish that set: the timer starts
  the right rest (30 s, 1 min or 2 min) and beeps once when it's over. Adjust
  it with ±15s or the presets.

## Files

| File | What it is |
|---|---|
| `exercises.js` | **Exercise Catalogue**: every exercise and stretch with poses, reps per level (as used), muscles, cues, loads |
| `figures.js` | **Figure engine**: draws the stick figures and the front/back muscle map from poses |
| `programs.config.js` | Every program: split, day types, blocks, time range, progression, name theme (Three-Split 60 is `frozen`) |
| `program-builder.js` | **Program Builder**: `build(config, catalogue)` → 60-day program, fitted to its time range; owns the time model. Pure, so it also runs in the page |
| `programs/three-split-60.json` | Three-Split 60's days, frozen so saved progress stays valid |
| `app/session.js` | **Workout Session**: progress through a day and every rest/timer rule (pure, no page) |
| `app/store.js` | **Progress Store**: done days per program, device copy + sync adapters (Firebase, in-memory) |
| `app/backup.js` | **Backup**: the progress file: export, read, diff, merge or replace |
| `app/views.js` | Routing and page rendering |
| `app/clock.js` | Timer, beeps, wake lock and workout clock (runs the session's instructions) |
| `app/main.js` | Wires store, session and clock to the page |
| `app/shell.html`, `app/styles.css` | Page markup and styles |
| `build.js` | Builds all programs and stitches everything into `index.html` (GitHub Pages) |
| `tests/` | `npm test`: session rules, store sync, program invariants, catalogue, figures, build |
| `.github/workflows/deploy.yml` | Tests (100% coverage on the core modules), builds and deploys to Pages |
| `scripts/install-hooks.js` | Installed by `npm install`: a pre-commit hook that runs the coverage gate |
| `tests-ui/`, `playwright.config.js` | `npm run test:ui`: phone UI tests (390 px, light and dark): every program, days 1/31/60, every exercise |
| `scripts/serve.js` | Static server the UI tests run against |
| `scripts/backup-progress.js`, `.github/workflows/backup.yml` | Nightly backup of progress (see Backups) |
| `scripts/program-times.js` | `npm run times`: each program's shortest and longest day against its target |
| `firebase-sync.js`, `firebase-config.js`, `firestore.rules` | Google sign-in and Firestore sync |
| `manifest.webmanifest`, `icons/`, `sw.js` | Installable app, icon, offline support |
| `sheet.js` | Writes `sheet.html`, a contact sheet of every illustration |

Build: `npm run build` (writes `index.html` with the program list and `data/<id>.json` per program, loaded when
opened and cached for offline; not committed) · Test: `npm test` · Coverage gate:
`npm run test:coverage` (100% lines, branches and functions on Session, Store, Builder, Catalogue,
Figure engine and Backup). Run `npm install` once after cloning to install the pre-commit hook that
enforces the same gate locally. What's planned next is in [ROADMAP.md](ROADMAP.md); the words
the project uses are in [CONTEXT.md](CONTEXT.md) and the decisions behind it in [docs/adr/](docs/adr/).

## Firebase setup (sync)

1. [Firebase console](https://console.firebase.google.com) → **Add project**
   (Google Analytics not needed).
2. **Build → Authentication → Get started → Sign-in method → Google →
   Enable**, pick a support email, Save.
3. **Authentication → Settings → Authorized domains → Add domain**:
   `noamros9.github.io`.
4. **Build → Firestore Database → Create database**, pick a location
   (e.g. `eur3`), start in **production mode**.
5. **Firestore → Rules**: paste the contents of `firestore.rules`, **Publish**.
6. **Project settings → General → Your apps → Web (`</>`)**, register an app
   (no Hosting needed) and copy the `firebaseConfig` object into
   `firebase-config.js`.

The config values are identifiers, not secrets; `firestore.rules` is what
limits each account to its own progress.

## Backups

- **Nightly:** `.github/workflows/backup.yml` copies every account's progress to the private
  `noamros9/kettle-bar-backup` repo as `progress.json`, committing only when something changed; its git
  history keeps every version. The Firebase key it uses can only read ([ADR 5](docs/adr/0005-backups-hold-no-write-credentials.md)).
  Secrets: `FIREBASE_SERVICE_ACCOUNT` (key JSON, roles Cloud Datastore Viewer + Firebase Authentication
  Viewer) and `BACKUP_REPO_TOKEN` (fine-grained token, Contents read/write on `kettle-bar-backup` only).
- **Restore:** open `progress.json` in the backup repo (or an older version from its history), download it,
  then in the app: sign in → **Settings** → **Import a backup** → check the days it lists → **Replace**
  (or **Merge**). It syncs to every device.

Adding a program: add a config to `programs.config.js`, run `node build.js` and `npm test`;
each program keeps its own progress.

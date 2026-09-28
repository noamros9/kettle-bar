# Kettle & Bar

A home workout app in the style of a printable program: a 60-day plan with
illustrated exercises, checkmarks for finished days and a rest timer.

**Program: Three-Split 60** — a repeating three-day cycle:

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

Live at **https://noamros9.github.io/kettle-bar/** once GitHub Pages is on
(Settings → Pages → Deploy from a branch → `main` / root).

Progress is always kept on the device. Press **Sign in to sync** (Google) to
sync it through Firebase to every device where you sign in. On first sign-in,
days ticked on the device and in the cloud are merged.

- Tap a day to open the workout; tick the circle on a tile or press
  **Mark as done** to record it.
- Tap a set number on an exercise when you finish that set: the timer starts
  the right rest (30 s, 1 min or 2 min) and beeps once when it's over. Adjust
  it with ±15s or the presets.

## Files

| File | What it is |
|---|---|
| `lib.js` | Stick-figure engine and the exercise library (poses, reps per level, cues) |
| `gen.js` | Builds the 60-day program and fits each workout to 30–35 minutes with the set rests |
| `app.template.html` | The app UI |
| `build.js` | Runs the generator and writes `index.html` |
| `firebase-sync.js` | Google sign-in and Firestore sync (GitHub Pages build) |
| `firebase-config.js` | Your Firebase project config (`null` = device only) |
| `manifest.webmanifest`, `icons/` | App name and icon for Add to Home screen / Install |
| `sw.js` | Service worker: newest version when online, still opens offline |
| `firestore.rules` | Security rules: each user reads and writes only their own progress |
| `program.json` | The generated program |
| `sheet.js` | Writes `sheet.html`, a contact sheet of every illustration |

Rebuild after editing: `node build.js`

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

Adding a program: generate another entry into the `PROGRAMS` array (see
`gen.js`); each program keeps its own progress.

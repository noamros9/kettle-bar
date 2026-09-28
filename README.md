# Kettle & Bar

A home workout app in the style of a printable program: a 60-day plan with
illustrated exercises, checkmarks for finished days and a rest timer.

**Program: Three-Split 60** — a repeating three-day cycle:

| Days | Workout |
|---|---|
| 1, 4, 7 … | Chest, back & abs |
| 2, 5, 8 … | Full body + abs, alternating upper focus (2, 8, 14 …) and lower focus (5, 11, 17 …) |
| 3, 6, 9 … | Abs & cardio |

Each workout runs about 30–35 minutes in two blocks (circuits). Days 1–20 are
Level I, 21–40 Level II and 41–60 Level III, with more reps each level.

Equipment: dumbbells (6–16 kg pairs), one kettlebell (14–16 kg), a pull-up bar,
a mat and a sturdy chair.

## Use it

Open `index.html` in a browser. Progress is kept in the browser's local
storage. (The claude.ai artifact version syncs progress across devices.)

- Tap a day to open the workout; tick the circle on a tile or press
  **Mark as done** to record it.
- Tap a set number when you finish a set: the rest timer starts with the
  block's rest time and beeps once when it's over. Adjust it with ±15s or the
  presets.

## Files

| File | What it is |
|---|---|
| `lib.js` | Stick-figure engine and the exercise library (poses, reps per level, cues) |
| `gen.js` | Builds the 60-day program and fits each workout to 30–35 minutes |
| `app.template.html` | The app UI |
| `build.js` | Runs the generator and writes `index.html` |
| `program.json` | The generated program |
| `sheet.js` | Writes `sheet.html`, a contact sheet of every illustration |

Rebuild after editing: `node build.js`

Adding a program: generate another entry into the `PROGRAMS` array (see
`gen.js`); each program keeps its own progress.

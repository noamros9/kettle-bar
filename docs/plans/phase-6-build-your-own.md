# Phase 6: build your own, and mixed programs

Source of truth for roadmap Phase 6 (item 16) and varied programs
([#65](https://github.com/noamros9/kettle-bar/issues/65)). Decisions from the roadmap grilling (28 Sep) and this
plan's grilling (29 Sep) are in [ROADMAP.md](../../ROADMAP.md). Built on
[architecture review III](architecture-review-3.md): tickets 4 (one day from a recipe), 5 (account data) and 6
(catalogue sources). Glossary: [CONTEXT.md](../../CONTEXT.md).

Decided on 29 Sep:
- **Mixing:** both. A "mix" choice in build your own (2–3 subjects), and **about 30 hand-made mixed programs**.
- **Mixed days:** a day holds blocks from more than one family (a strength block, then a short flow), not only
  a cycle of single-family days.
- **Your programs** get their own shelf at the top of the Programs page.

## Where it ends up
- A **Mixed** family on the Programs page (a fourth tab), 5 subjects × 6 programs.
- **Build your own** from the Programs page: pick, preview, regenerate, save. Your programs sit on a "Your
  programs" shelf above the families, sync to your account, and are in export/import and the nightly backup.
- Share a copy by link.

## Tickets

Tracer bullets, one branch = one PR, each from its **Test first**.

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 1 | Mixed days in the builder + Strength & stretch (6 programs) | feature | review III 2–4 | `feature/mixed-strength-stretch` | |
| 2 | Mixed: Fighter, Athlete (12 programs) | feature | 1 | `feature/mixed-fighter-athlete` | |
| 3 | Mixed: Balanced week, Calm strength (12 programs) | feature | 1 | `feature/mixed-balanced-calm` | |
| 4 | Recipes by subject | feature | review III 4 | `feature/recipes` | |
| 5 | Build your own: pick, preview, regenerate, save | feature | 4, review III 5, 6 | `feature/build-your-own` | |
| 6 | Your programs: rename, delete, edit | feature | 5 | `feature/own-edit` | |
| 7 | Mix in build your own (2–3 subjects) | feature | 1, 5 | `feature/own-mix` | |
| 8 | Share a copy by link | feature | 5 | `feature/own-share` | |

### What every mixed-program ticket (1–3) includes
- Configs in `configs/mixed.js` (review III ticket 2), each with `family: 'Mixed'` via its subject, `added: 6`,
  `catalogue: 5` (the whole current catalogue), a hand-written `about` of 3–6 sentences, 20 day names, time ranges.
- **Mixed day types:** blocks from different families in one day, each with its own lever where they differ
  (strength: weight or reps; yoga/flexibility: holds; boxing: variation). `absSlots` per day type: strength-led
  days end with abs; days that end in a flow don't.
- **Test first:** the subject builder test, as in Phase 5: 60 days in range, known exercises that fit the
  equipment, the abs rule per day type, and the pins unchanged. New programs pinned with `npm run pin`.
- **Done when:** the programs show under Mixed → their subject, day 1 opens and its Start or first tick runs (UI),
  checked on the phone in both themes.

### 1. Mixed days + Strength & stretch
- **Library:** `FAMILIES` (now in `app/library.js`) gains `['Mixed', [...]]` after Mind & body.
- **Stats "by family"** (Phase 8) needs to know a block's family: the builder writes `family` on each main block
  of a mixed day (from the pool's subject); single-family programs don't need it (their subject says it).
- **Strength & stretch, 6 programs** (names are proposals, Noam may rename): Lift & Lengthen (strength + flexibility
  flow), Iron Yoga (strength + yoga flow), Strong Hips (legs + hip mobility), Upper & Open (upper body + shoulder
  flexibility), Kettlebell Flow (kettlebell + yoga), Posture Strength (pulls + mobility & posture).
- **Test first:** a builder test of one mixed day type: the strength block levels by weight and the flow by holds
  at Level III; the flow day has no abs block.

### 2. Fighter and Athlete (6 each)
- **Fighter:** boxing or kickboxing bouts + a strength or conditioning block + a short mobility flow.
- **Athlete:** plyometrics + strength + balance, e.g. jump, lift, stick.

### 3. Balanced week and Calm strength (6 each)
- **Balanced week:** every day has one block from each family (e.g. a superset, a Tabata, a 5-minute flow).
- **Calm strength:** Pilates or core + slow-tempo strength (tempo lever) + a yin finish.
- **Last in this group:** the PR that closes ticket 3 updates the README program counts (about 128 programs).

### 4. Recipes by subject (`recipes.js`)
Build your own and the random workout (Phase 7) need "a day of subject X" without a hand-made config.
- `recipes.js` collects every **day type** of every library config, tagged with its subject and family, its
  formats and its equipment (`all`, `kb`, `bw`). Nothing new is written by hand: the library is the recipe book.
- `pick({ subjects, equipment, formats, minutes })` → the day types that fit, and `make(choice, seed)` → a config
  (split + day types + levers) that `KBBuilder.build` turns into 60 days.
- Files: `recipes.js`, `tests/recipes.test.js`, `build.js` (inline), `package.json` (coverage).
- **Test first:** for each subject, every equipment it allows and 20/30/40 minutes, `make` gives a config that
  builds 60 days inside the time range (a sample of seeds).
- **Done when:** the test above passes for all 18 subjects, and for the 5 Mixed ones once tickets 1–3 are in.

### 5. Build your own
- **Where:** a "Build your own" button on the Programs page, above the tabs, opening a page (`#build`):
  - **subject** (one, for now; ticket 7 adds mixing), **split** (days per cycle: 1–5), **minutes** (20 / 25 / 30 /
    35 / 40), **equipment** (all / kettlebell only / none), **formats** (the subject's formats, pre-ticked),
    **how it gets harder** (a lever for Level II and one for Level III, from the subject's levers).
  - **Preview:** the first 6 days as tiles (name, day type, time) and the program's summary line. **Regenerate**
    changes the seed; **Save** names it (default "My <subject> 60").
- **Your programs** shelf at the top of the Programs page (Noam, 29 Sep), above the family tabs, shown only when
  you have one. Their progress works like any program's.
- **The store learns new ids:** `app/main.js` builds the Progress Store with `programIds: programs.ids()` once at
  startup. Saving (or deleting) a program must add (or drop) its id in the store too, through the catalogue's
  `onChange` (review III ticket 6).
- **Stored:** the choices and the seed, not the days (`users/{uid}/programs/{id}`: `{ name, choices, seed,
  catalogue, createdAt, updatedAt }`, and a device copy). The days are rebuilt from them with the catalogue
  version they were made with, so a later catalogue never reshuffles them.
- Files: `app/own.js` (pure: choices → config, validation), `tests/own.test.js`, `app/programs.js` (own source),
  `app/store.js`, `app/views.js`, `app/main.js`, `app/styles.css`, `tests-ui/build.spec.js`, `CONTEXT.md`.
- **Test first:** `own.toConfig(choices, seed)` builds the same 60 days twice; another seed gives other days; a
  saved record read back builds identical days.
- **Done when:** on the phone, build a 3-day kettlebell program, regenerate, save, tick day 1, reload: it's on
  the Your programs shelf with day 1 done, and it syncs to a second browser (UI test, in-memory remote).

### 6. Your programs: rename, delete, edit
- **Rename** on its program page. **Delete** asks first; its progress goes too (ROADMAP).
- **Edit the choices:** days not done yet are rebuilt; done days keep what you did. Implementation: the record
  keeps `frozenDays: { n: day }` for every done day at the moment of an edit, and the rebuilt program takes those
  days as they were.
- **Test first:** edit minutes after ticking days 1–3: days 1–3 are unchanged, day 4 is in the new range.
- **Done when:** rename, delete and edit work on the phone and sync.

### 7. Mix in build your own
- The subject picker allows **2–3 subjects**. Each day is a **mixed day**: `recipes.make` joins one block per
  subject in the order picked, splitting the minutes, each block with its subject's lever (as ticket 1).
- **Test first:** strength + yoga, 30 min: every day has a strength block then a flow, inside 30 min ± the range.

### 8. Share a copy by link
- A **Share** button copies `…/#add=<base64url of { name, choices, seed, catalogue }>`. Opening the link shows the
  program's preview and **Add this program**. No server.
- **Test first:** encode → decode round-trips; a link from an unknown catalogue version is refused with a message.
- **Done when:** a link opened in another browser adds the same 60 days.

### Last: ROADMAP and README
The PR that closes the last ticket marks Phase 6 done in ROADMAP.md and adds build your own to the README's
"Use it".

## Challenge round
- **Weakest assumption:** that own programs stay stable when the catalogue grows. They would not, if they were
  rebuilt from the newest catalogue each time. The record stores `catalogue` and the seed, and edits freeze done
  days (ticket 6), so a program you are halfway through never reshuffles.
- **What I hadn't read:** the offline cache holds library programs only. Own programs are built in the page from
  their stored choices, so they work offline without a download; the builder and catalogue are already inlined.
- **The lazier version:** hand-made mixed programs only (tickets 1–3) and build your own without mixing or links
  (4–6). Tickets 7–8 are last so they can be cut without touching the rest.

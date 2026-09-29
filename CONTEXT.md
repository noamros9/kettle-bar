# Kettle & Bar: context

The words this project uses, so code, issues and conversations mean the same thing by them.
Decisions with a "why" live in [docs/adr/](docs/adr/). What's planned lives in [ROADMAP.md](ROADMAP.md).

## Training

**Program**: a named plan of 60 numbered **Days** (e.g. *Three-Split 60*, *Iron PPL*). Each program keeps
its own progress. Identified by an id (`three-split-60`, `iron-ppl`).

**Signature program**: one of the five hand-shaped straight-set splits (Three-, Four-, Two-, Five-Split 60,
Full-Body Duo 60). The other 99 are **library programs**, five or six per **Subject**.

**Subject**: a library shelf: signature, strength, pull-ups, legs & glutes, kettlebell only, bodyweight, busy week
(Strength family); conditioning, HIIT, plyometrics, boxing, kickboxing (Cardio & combat); core & abs, mobility &
posture, yoga, Pilates, flexibility, balance & stability (Mind & body); and, in the Mixed family, strength & stretch
(six programs), with Fighter, Athlete, Balanced week and Calm strength to come. Each belongs to one **Family**.

**Family**: a group of subjects on the programs page: *Strength*, *Cardio & combat*, *Mind & body*, *Mixed*. Picking one shows
only its subjects' chips and shelves. Listed in `FAMILIES` in `app/library.js`; a subject missing there is an error.

**Mixed program**: a program whose days hold blocks from more than one family (a **mixed day**: a strength block,
then a short flow). They sit in the **Mixed** family (Phase 6). Each block can get harder in its own way, and each
main block of a mixed day carries a `family` tag (`'Strength'`, `'Cardio & combat'` or `'Mind & body'`, from its config)
for Phase 8's stats; single-family programs' blocks have none.

**Your program** (own program): one you built in the page from choices (subjects, split, minutes, equipment,
formats, levers) and a seed. Stored as its choices, not its days; id `own-<id>`; shown on the Your programs shelf.

**Recipe**: what one day needs to be built: a day type's blocks, time range, equipment, rests, catalogue, levers and
abs finisher. `recipesOf(config)` gives one per day type of a program; `buildDay(recipe, { day, level, lever, rnd,
memory })` builds one day from it. `build` is the loop over days 1–60 with one shared memory (what was used, how
often, which stretches) and one random stream. Build your own and the random workout call `buildDay` directly.

**Random workout**: a one-off day built fresh, outside any program: counts in stats, not in program progress. Its
level is the level of the last day marked done.

**Travel mode**: a setting (no bar / kettlebell only / bodyweight only) that swaps exercises needing missing gear
for today, on every day, until turned off.

**Day**: one workout, numbered 1–60. Days are numbers, not dates: rest days are up to the user.

**Day type**: the kind of workout a day is within its program's **Split** (e.g. "Chest, back & abs").
Each day type has its own time range.

**Split**: the repeating cycle of day types (Three-Split 60 repeats three day types).

**Level**: I (days 1–20), II (21–40), III (41–60). Level I starts at intermediate.

**Lever**: how a program gets harder from one level to the next: *reps*, *holds* (the same, said "longer holds"
for poses), *weight* (go one weight up), *variation* (a harder exercise), or *tempo* (3 s lowering). Each program
picks a lever per level. A day type can set its own `levers` (and `absSlots`), and a block its own `lever: ['base',
'holds', 'holds']`, for mixed days: the block's wins over the day type's, which wins over the program's.

**Block**: one part of a day's workout in one **Format**, holding one or more exercises. Days end with an **abs
block** (no bar, 3 sets, weights allowed), except in programs whose session is core work already (`absSlots: []`:
yoga, Pilates, flexibility, mobility & posture), and per day type in mixed programs: a day that ends in a flow has no
abs, a day that ends with a strength block keeps them.

**Format**: how a block is performed: *straight sets*, *superset*, *circuit*, *EMOM*, *AMRAP*, *Tabata*,
*ladder*, *guided flow*, *bouts*. Every rule that depends on the format (its time, the choices the builder has,
its sets for stats, its words in a summary, its name, whether it runs from one Start) is one entry in `formats.js`;
the timer's phases for a format stay in the Workout Session.

**Guided flow** (`flow`): a sequence of **Poses** on the clock, run by one Start. Each pose (and each side) gets 5 s
to move into it while the voice names it, then its hold; a pose written in reps lasts reps × seconds per rep. A flow
can go through 1–3 times (`repeat`). Stats count each pose as one set per pass. A block's `scale` lengthens its holds
(yin, up to `cap` seconds).

**Bout** (`bouts`): boxing's rounds, called bouts so they aren't confused with circuit rounds or program Rounds.
Each item is one bout's combo: 3 minutes of work, 1 minute of rest between bouts, one Start for all of them. The
voice calls the combo as the bout starts ("Bout 2: jab, cross, hook"; with `switchStance`, also orthodox or
southpaw in turn). Stats count each bout as one set of its combo.

**Set / Pair / Round**: the unit you tick while training. A *set* belongs to one exercise (straight sets);
a *pair* is one set of each exercise in a superset; a *round* is one pass through a circuit or ladder.

**Hold**: an exercise measured in seconds (plank, dead hang). Runs a timer with a 3 s get-ready.

**Rest**: the pause the timer runs after a tick: 30 s between sets, 60 s between exercises, 120 s before
abs (plus superset / round / block rests). Ends with one beep. A program can set longer rests (`rests` in its
config): plyometrics rest 60 s between sets and 90 s between exercises.

**Warm-up / Cool-down**: about 1 min of mobility before and 2 min of **Stretches** after, chosen for the
muscles that day works. Not counted in the workout time.

**Workout time**: the day's estimated duration from the time model (work + rests), excluding warm-up and
cool-down.

**Workout minutes / stretching minutes**: a day's estimated workout time, and its warm-up + cool-down time.
Stats count both and always show them separately.

**Day volume**: what one done day counts for in stats: workout and stretching minutes, sets and reps. Timed
blocks are converted to sets (EMOM 1 per minute, Tabata 1 per 20 s round, AMRAP/ladder 1 per exercise per 2
minutes); one-side reps count both sides; holds add sets, not reps.

**Muscle load**: how much work a muscle got: each set counts 1 for every main muscle and ½ for every secondary
one. The **heat map** shades each muscle in 4 steps by its share of the day's (or span's) biggest load.

**Finish card**: the card at the end of a day's page once every set is ticked: what the day added up to, and
Mark as done.

**Planned volume**: the sets and reps a day is written with. Stats count a done day's planned volume; the
app does not log what was actually lifted.

## Exercises

**Exercise**: an entry in the **Exercise Catalogue** with reps per level, muscles, cue, equipment and
**Poses** (the stick-figure positions).

**Primary / secondary muscles**: drawn dark and light on the **Muscle map** (front and back body).

**Alternative**: an easier or different exercise shown under the main one.

**Swap**: trading an exercise in a workout for an **alternative** that works the same first main muscle, is the same
kind (reps or seconds) and fits the program's equipment. It gets its own reps for the level. A swap is for one
day or for the rest of the program (from that day on), and is stored with the program's progress.

**Round**: one time through a program's 60 days. "Start Round 2" (any time) keeps Round 1 as it was, starts again from
day 1 with the same plan, and asks which rest-of-program swaps to keep. Stats count every round unless narrowed to one.

## Progress

**Done**: a day marked finished, stored as `{day: time first marked}` per program.

**Program Progress**: one program's done days and swaps, as a value. The only module that knows how progress is
stored (the cloud document `{ done, swaps, updatedAt }` and the device copy) and how two copies combine (first
sync, import merge / replace).

**Progress Store**: the module that keeps each program's Program Progress and syncs it. Always keeps a **device
copy**; can attach one **remote** (Firebase) to sync.

**Account data**: what an account syncs besides progress: **own programs** (`users/{uid}/programs/{id}`, Phase 6),
**random workouts** (`users/{uid}/random/{id}`, a done record with its day inside, Phase 7) and **preferences**
(`users/{uid}/prefs/main`: favourites, hidden subjects, travel mode; Phases 7–8). Each doc is a JSON object with an
`updatedAt`; `app/docs.js` says how two copies combine (union by id, the newer `updatedAt` wins) and the Progress
Store holds them (`doc`, `docs`, `setDoc`, `deleteDoc`, `replaceDocs`). The **device copy** of a doc is
`kb-doc-<collection>-<id>` (one key per doc, e.g. `kb-doc-programs-my-push`, `kb-doc-prefs-main`) with the ids of a
collection in `kb-docs-<collection>`; progress keeps `kb-progress-`, `kb-swaps-` and `kb-past-`. A refused write to
these collections (rules not published yet) never changes the Sync status: progress keeps working.
`firestore.rules` names the four collections (progress, programs, random, prefs) and allows only the signed-in owner.

**Sync status**: `local` (not signed in), `signin`, `ok`, `saving`, `offline`, `ro` (read-only), `err`.

**First sync**: the first contact with the cloud after signing in; ticks on either side are kept, earliest
time wins.

**Backup**: a copy of progress and account data outside the app's normal storage. Two kinds: the **nightly backup** (a file
in the private `kettle-bar-backup` repo) and an **export** (a file you download from Settings).

**Import**: loading a backup file back in. Always shows the **diff** (days added and removed per program, plus own
programs and random workouts added, removed or changed) and asks **merge** (keep both) or **replace** (the file
wins). For account data, merge is a union by id where the newer `updatedAt` wins, and keeps your preferences; replace
takes the file's set and preferences. A file without account data (**version 1**, from before) leaves yours alone.
Files: version 1 = progress only; version 2 adds `ownPrograms`, `random`, `prefs` (only when not empty).

## Code

**Day (module)**: a program day as you'll do it: swaps applied, its live Workout Session (ticks carry over when a
swap changes the exercises), its alternatives, and swap / undo. The page renders it; stats read days through it.

**Workout Session**: the pure state machine for a day in progress: what is ticked, what the next rest is.
Returns **instructions** (`rest`, `clear`, `none`) and **phase plans** (warm-up / cool-down sequences).

**Clock**: runs the session's instructions in the page: timer, beeps, wake lock, workout clock.

**Program Catalogue**: the module the page asks for programs: the list (summaries with day counts and the exercises
used), one program's days, and which programs use an exercise. Where programs come from is its sources' business:
the library (fetched with an offline cache) and, later, your own (built in the page); own programs are listed first, and ids never clash.

**Program Builder**: turns a program's config into 60 days fitted to each day type's time range. Pure over the
Exercise Catalogue it's given, so it runs in the Node build and (for your own programs) in the page.
Three-Split 60 is **frozen** (read from JSON by the Node build, not generated).

**Pinned programs**: the days of every program are hashed in `tests/fixtures/program-days.json`, and a test fails if
any of them change, so a program you are halfway through never reshuffles. A new program is pinned with
`npm run pin`, which never touches an existing pin.

**Pools**: named lists of exercises in the builder. A pool never changes once a pinned program uses it; new
variety gets a new pool name (`squat2`), so pinned days stay as they are.

**Catalogue generation**: an exercise marked `added: 5` came in Phase 5. The pools the builder computes from the
catalogue (mobility, abs, weighted abs, warm-ups, cool-downs) leave it out unless the config says `catalogue: 5`,
which is what keeps older programs pinned while the catalogue grows. Programs from Phase 5 are marked `added: 5`
too; a program never uses an exercise newer than itself. Guided kinds (yoga, Pilates, flexibility, mobility, boxing,
kickboxing) are swapped only for their own kind and are never offered as swaps for anything else.

**Adapter**: an implementation behind one of the store's seams: storage (localStorage / in-memory) or
remote (Firebase / in-memory).

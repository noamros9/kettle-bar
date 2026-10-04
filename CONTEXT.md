# Kettle & Bar: context

The words this project uses, so code, issues and conversations mean the same thing by them.
Decisions with a "why" live in [docs/adr/](docs/adr/). What's planned lives in [ROADMAP.md](ROADMAP.md).

## Training

**Program**: a named plan of 60 numbered **Days** (e.g. *Three-Split 60*, *Iron PPL*). Each program keeps
its own progress. Identified by an id (`three-split-60`, `iron-ppl`).

**Signature program**: one of the five hand-shaped straight-set splits (Three-, Four-, Two-, Five-Split 60,
Full-Body Duo 60), each followed on its shelf by two **variations**: *Tempo* (levers `[null, 'tempo', 'tempo']`) and
*Harder Moves* (`[null, 'variation', 'variation']`), the same split with a different way of getting harder (`four-split-60-tempo`,
`four-split-60-harder`). Three-Split 60's variations are generated look-alikes, since it is frozen. The other 123 are
**library programs**, five or six per **Subject**.

**Subject**: a library shelf: signature, strength, pull-ups, legs & glutes, kettlebell only, bodyweight, busy week
(Strength family); conditioning, HIIT, plyometrics, boxing, kickboxing (Cardio & combat); core & abs, mobility &
posture, yoga, Pilates, flexibility, balance & stability (Mind & body); and, in the Mixed family, strength & stretch,
Fighter, Athlete, Balanced week and Calm strength (six programs each). Each belongs to one **Family**.

**Family**: a group of subjects on the programs page: *Strength*, *Cardio & combat*, *Mind & body*, *Mixed*. Picking one shows
only its subjects' chips and shelves. Listed in `FAMILIES` in `app/library.js`; a subject missing there is an error.

**Shelf group** (Phase 17): a tab on the Programs page, finer than a family (Strength, Muscles, Cardio, Combat, Yoga &
Pilates, Mobility & care, Mixed, Variety, After dark). Listed in `SHELVES` in `app/library.js`; only the Programs page
uses them, everything else keeps the families.

**Mixed program**: a program whose days hold blocks from more than one family (a **mixed day**: a strength block,
then a short flow). They sit in the **Mixed** family (Phase 6). Each block can get harder in its own way, and each
main block of a mixed day carries a `family` tag (`'Strength'`, `'Cardio & combat'` or `'Mind & body'`, from its config)
for Phase 8's stats; single-family programs' blocks have none.

**Muscle-focus program** (Phase 16): a Strength-family program built around one muscle group and its helpers
(Chest: chest + triceps + front shoulders). Either **2:1** (two focus days, then a day for the rest of the body) or
**every day** (the muscle every day, a different helper as the second block).

**Variety program** (Phase 16): a program with `variety: true` and no cycle: no two of its days share a day type and
format ("Every day is different"). Subject *Variety*, in Mixed.

**After-dark program** (Phase 16): a Mixed-family program for looks, stamina or positions (hip, adductor and back
mobility with the strength to hold them).

**Share link** (`#add=<code>`): a Your program in a link, so someone else can add a copy. The code (`app/own.js`
`shareCode` / `readShare`) is `{ v, i: id, n: name, c: choices, s: seed, k: catalogue, g: config }` as JSON, deflated, in
base64url (about 1–1.6 KB). It carries the config and the id because the days are built from the config alone and the
builder draws the exercises from the program's id: the copy is added under the same id, with the same 60 days. Never
its progress or frozen days. Refused when made by a newer app (`v` or `k` newer than this one's), damaged, or carrying
anything the recipes don't make.

**Mix** (in build your own): a Your program of 2–3 subjects, picked in order. Every day is a mixed day joined from one
**part** of each subject, in that order: a part is a main block (three slots or more) of a library day type of a subject
that is one family and rests like the others (not a Mixed subject, not Plyometrics). Each block gets harder by its own
subject's levers (`choices.levers` is flat: a Level II and a Level III lever per subject) and carries its `family`; the
abs finisher comes last only when the last subject is a Strength one. The day's minutes, after the rests between blocks
and the abs, are shared evenly between the blocks (a block held at what it can do when it cannot take its share); each
block's share is its `target`. The recipe book keeps each part's **range** (per level, how short and how long every
trial could build it); a mix is offered for a time when some parts' ranges add up to it at every level, and `make()`
builds the whole program to check every day lands in the window before handing it out. The config says `mix: [subjects]`.

**Your program** (own program): one you built in the page from choices (subjects, split, minutes, equipment,
formats, levers) and a seed. Stored as its choices, its seed and the config those made (never its days: the days are built from the stored config alone, so a program you are halfway through never changes when the recipe book does; the choices stay for showing and for editing, which makes a new config); id `own-<id>`; shown on the Your programs shelf. The record (`users/{uid}/programs/{id}`, device copy `kb-doc-programs-<id>`) is `{ name, choices, seed, catalogue, config, frozenDays?, createdAt, updatedAt }` (`config`: what `make()` produced, compact: about 1.7 KB for a 5-day program); the page builds its days from `config` with `app/own.js`, never reading the recipe book, so it works offline with no wait at boot (only the #build page loads the book). Saving or deleting one adds or drops its id in the Progress Store at runtime (`addProgram` / `dropProgram`, through the catalogue's `onChange`).
**Rename** (inline on its page), **Delete** (asks first; `store.deleteProgress` removes its device keys and its cloud progress document, then the doc goes; other devices drop it when the doc disappears) and **Edit** (the builder opens with its choices, seed and name; Save updates the same record) work on its page. **Frozen days on edit:** an edit makes a new `config`, but every day done in any round (current or past) is frozen into the record first, as it was built from the old config: `frozenDays: { n: day }` (the day without its number, about 0.8 KB each: a record with 10 frozen days is about 9.6 KB). Building from a record takes frozen days as they are stored, never from the recipe book; a frozen day keeps its type colour only while the rebuilt cycle still calls that type the same, else it shows by its own title. Swaps stay as stored (they refer to day numbers), and progress is untouched. Deleting a program on one device does not stop a device that was offline from pushing its copy up again when it next syncs (no tombstones yet).

**Recipe**: what one day needs to be built: a day type's blocks, time range, equipment, rests, catalogue, levers and
abs finisher. `recipesOf(config)` gives one per day type of a program; `buildDay(recipe, { day, level, lever, rnd,
memory })` builds one day from it. `build` is the loop over days 1–60 with one shared memory (what was used, how
often, which stretches) and one random stream. Build your own and the random workout call `buildDay` directly.

**Recipe book**: every day type of every library config as a recipe, tagged with subject, family (a Mixed day also lists its blocks' families), formats, equipment (`bw` fits every choice, `kb` fits `kb` and `all`, `all` fits only `all`) and the time targets it really builds to. Made from the configs by `recipe-book.js` (slow, so kept in the committed `recipes/book.json` with a hash of its inputs; `npm run recipes`), served as `data/recipes.json` and fetched by the page when first needed (and for offline), read by `recipes.js`: `pick` filters it, `make(choice, seed)` turns a choice into a config, `options(subject)` says which equipment and minutes a subject (or a mix of 2–3) allows. A combination nothing can build is refused with a message, never faked. Three-Split 60 (frozen) is left out.

**Random workout**: a one-off day built fresh, outside any program: counts in stats, not in program progress. Its
level is the level of the last day marked done (a program day's level by its day number: 1–20 I, 21–40 II, 41–60
III; a random workout's own). Chosen on a sheet on the Programs page (a family or one subject, 15 / 25 / 35 minutes,
equipment), made by `app/random.js` from the recipe book: a day type that fits, picked with the seed, built by
`buildDay` with a fresh memory and that day type's own levers. **Reshuffle** is a new seed. Started, it is the **open
random workout**: on the device only (`kb-random-open`, with its swaps, today only), its session saved as a day's is,
forgotten after 12 hours or on **Discard**, shown at `#random`. **Mark as done** writes the record
`users/{uid}/random/{id}` = `{ name, choices, seed, level, day, swaps, time }`; Stats read it through `dayOf('random',
id)`, and it has its own scope, "Random workouts".

**Short on time** (shorter today): a day of a program done trimmed to about 20 minutes (`app/short.js` `trim`: fewer
sets, rounds, minutes or passes, and a block's last exercises dropped, never its first; warm-up and cool-down stay).
Kept in the program's progress as `short: { day: true }` for the current round (a past round keeps its own), a
field that exists only when a day was shortened; device copy `kb-short-<pid>`; in backups as the optional `short`
section. The Day module trims after the swaps, and Stats count the trimmed day.

**Matched warm-up**: the warm-up a day shows, picked when it opens (`app/warmup.js`): dynamic (jumping jacks, high
knees, arm circles, lateral shuffle; shadowboxing footwork first on a combat day) or gentle (cat-cow, twists, child's
pose), by the program's subject, else by the day's moves; strength and mixed days keep their own. Always the length
of the stored warm-up, so stretching minutes don't change; stats and pins keep the stored one.

**Rest-day flow**: on a day with nothing marked done (program days and random workouts, by the phone's date), a card
on the Programs page offers a random workout of Mobility & posture or Flexibility, 15 minutes, no equipment
(`KBRandom.REST_DAY`; a choice may name several `subjects`, each bringing its own best-fitting day types). **Not
today** hides it until the next day, on that device (`kb-rest-dismissed`).

**Travel mode**: a setting (no bar / kettlebell only / bodyweight only) that swaps exercises needing missing gear
for today, on every day, until turned off. Kept in `prefs` (doc `main`, `travel: 'nobar' | 'kb' | 'bw'`), synced.
`KBSwaps.travel(day, mode, program, cat)`: each exercise the gear doesn't allow becomes its first alternative the gear
allows and the day doesn't have (same first main muscle and kind of work; else either kind; else another of its main
muscles), marked `travel`; one with none stays, `travelMissing` ("Needs gear"). Only the open day (the Day module)
is swapped; Stats count the planned day. Swapping a travel stand-in yourself swaps the planned exercise.

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

**Favourite**: a library program you starred (on its card or page). Favourites have their own shelf at the top of the
Programs page, under Your programs, whatever the filters. Stored in the synced prefs as `favourites: [program id]`.

**Hidden subject**: a subject ticked in Settings → Hidden subjects. It shows nowhere on the Programs page (no chip, no
shelf, not counted); a starred program of that subject stays in Favourites. Stored as `hidden: [subject]` in the prefs.

**Muscle focus**: what share of a program's weighted sets (over its 60 days) each muscle gets. The muscle map ranks
programs by it.

**History**: every day marked done, by date: the Stats → History tab's month calendar. Not streaks: nothing counts runs
of days or sets targets.

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
Returns **instructions** (`rest`, `clear`, `none`) and **phase plans** (warm-up / cool-down sequences). It is **saved
on the device** (never synced, not in backups) on every change, one per round and day, so closing the app or opening
another day doesn't lose it; Mark as done or 12 hours clear it. A running timer isn't saved, only the ticks, counters,
stretches and when the workout started.

**Big timer**: a full-screen overlay over the Clock's running Phase (time left, label, drawing, the next label); it
reads `KBSession.glance(phase, next)` and times nothing itself.

**Clock**: runs the session's instructions in the page: timer, beeps, wake lock, workout clock.

**Program Catalogue**: the module the page asks for programs: the list (summaries with day counts and the exercises
used), one program's days, and which programs use an exercise. Where programs come from is its sources' business:
the library (fetched with an offline cache) and your own (source `own`, built in the page from stored choices); own programs are listed first, and ids never clash.

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

**Program finder** (Phase 15): finds programs for you three ways: the **name search** (words in the name, subject,
split or blurb), **Help me pick** (goal, minutes, gear as taps) and **Ask** (free language, signed in). Ask ranks by
meaning with an on-phone model; minutes, gear and length are read with plain rules first.

**Finder text**: what the finder knows of a program, one paragraph made at build time from its name, subject, split,
blurb, about, formats and main muscles. Its **vector** (what the model makes of it) is made in the deploy (`data/finder-vectors.json`), so a phone embeds
only the question.

**Why line**: the one line under a finder result saying why it fits, made from the program's facts that match what
was asked ("Back care · 15–20 min · no equipment"), never generated text.


# Phase 35 · Catalogue 14: threesomes, and every act at every place

Grilled 9 Oct 2026 (Noam), at the end of Phase 22's sex exercises. Claude plans; Grok writes the exercises and the
program text, plan first (132). Tickets written 10 Oct 2026 from the decisions below; nothing here is re-asked. The
open points are listed at the end, not decided.

## Decisions

**The new exercises (about 666, catalogue 14)**
- **283 · A new phase, catalogue 14.** Threesomes and place × act land after Phase 22 ships, as their own catalogue
  with their own pins. *(9 Oct)*
- **284 · Threesomes in every act kind.** 18 each in oral, hands, anal, toys, rough, kink, body play, rimming,
  edging, massage, strip and tease; 36 in intercourse; 234 in all. *(9 Oct)*
- **285 · A Threesome kind of its own, 72.** Two tickets of 36; every act (intercourse, oral, anal, body play…). *(9 Oct)*
- **286 · Every act at every place, 6 each.** 12 acts (oral, anal, toys, hands, threesome, edging, massage, tease,
  rough, kink, body play, rimming) × 5 places (shower and bath, pool, hot tub, balcony, doorframe) = 360. *(9 Oct)*
- **287 · Mostly FMF.** About two thirds FMF (you and two women), one third MMF, in every kind. *(9 Oct)*
- **288 · MMF: incidental only.** Hands may brush or bodies touch while both men are on her; nothing between the men
  as an act, nothing receiving said about you (CLAUDE.md's his-side rules hold). *(9 Oct)*

**Filing**
- **289 · A threesome keeps its act kind and carries a tag.** An FMF blowjob stays Oral, tagged FMF or MMF; Oral
  programs deal it, and so do the Threesome kind's. *(9 Oct)*
- **290 · Place × act files under the place only.** Oral in the pool is Pool; Oral programs don't deal it. *(9 Oct)*

**Drawings and programs**
- **291 · A third figure.** An Opus ticket first adds three-figure poses, with the pelvic mark, to `figures.js`; every
  threesome draws all three. *(9 Oct)*
- **292 · +8 programs per fitting subject, Threesome 18.** Every After dark and couple subject the new exercises fit
  gets 8 more programs using them; the Threesome subject gets 18 (a new subject's 12, decision 119, plus 6). *(9 Oct)*
- **293 · Who builds.** Grok the exercises and program text, plan first (132); Opus the third figure, the tags and
  the pool wiring. *(9 Oct)*

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/p35-tickets` | todo |
| 1 | Third figure, the FMF/MMF tag, and the filing rules (289, 290, 291) | feature | – | `feature/p35-figure-tags` | todo |
| 2a | Threesome acts: oral, hands, anal, toys, rough, kink, 18 each (284) | content | 1 | `content/p35-acts-a` | todo |
| 2b | Threesome acts: body play, rimming, edging, massage, strip and tease 18 each; intercourse 36 (284) | content | 1 | `content/p35-acts-b` | todo |
| 3a | Threesome kind, first 36 (285) | content | 1 | `content/p35-kind-a` | todo |
| 3b | Threesome kind, second 36 (285) | content | 1 | `content/p35-kind-b` | todo |
| 4a | Place × act: oral, anal, toys, hands, threesome, edging, 6 each at each of 5 places (286) | content | 1 | `content/p35-places-a` | todo |
| 4b | Place × act: massage, tease, rough, kink, body play, rimming, 6 each at each of 5 places (286) | content | 1 | `content/p35-places-b` | todo |
| 5 | Pools and pins for catalogue 14, the FMF/MMF split in every kind (287) | feature | 2a–4b | `feature/p35-pools` | todo |
| 6a | Threesome subject: 18 programs (292) | content | 5 | `content/p35-threesome-programs` | todo |
| 6b | +8 programs per fitting After dark and couple subject (292) | content | 5 | `content/p35-couple-programs` | todo (subject list open) |
| 7 | Close the phase: measure, pins, archive | plan | 6a, 6b | `plan/p35-close` | todo |

### 1. Third figure, tags and filing (Opus)
- **Build:** the three-figure pose with the pelvic mark in `figures.js` (291); every threesome draws all three. Each
  threesome exercise carries a tag, FMF or MMF (289); an FMF blowjob stays Oral and is dealt by Oral programs and by
  the Threesome kind. Place × act exercises file under the place only (290): oral in the pool is Pool, and Oral
  programs don't deal it.
- **Files:** `figures.js`, `exercises.js` (tag field), `program-builder.js` (filing), `app/library.js` if the tag shows.
- **Test first:** `tests/threesome-figure.test.js`: a threesome draws three figures with the pelvic mark; a tagged
  exercise keeps its act kind; a place × act exercise is in its place's pool and in no act pool.
- **Done when:** the tests pass on the branch; a 390 px screenshot of one threesome's figure reads in light and dark.

### 2a, 2b, 3a, 3b, 4a, 4b. The exercises (Grok, plan first; Opus reviews)
- **Build:** the counts in the table, catalogue 14, each exercise with its figure, cue, tags and muscles, in the
  existing exercise shape. Mostly FMF, about two thirds (287), one third MMF in every kind. MMF is incidental only
  (288): hands may brush and bodies touch while both men are on her; nothing between the men as an act, nothing
  receiving said about you. Text follows CLAUDE.md's his-side rules.
- **Files:** `exercises.js` (new entries at the end, `added: 14`), nothing else.
- **Test first:** each ticket's counts per act kind or place; every exercise has a tag; no MMF exercise has men acting on each other; each `added: 14` id is new.
- **Done when:** the counts match; `tests/catalogue14.test.js` passes; the PR's CI is green.

### 5. Pools and pins (Opus)
- **Build:** the catalogue-14 pools for each act and place, `POOL_ADDS` entries for the new exercises (so no
  existing pool moves), the Threesome kind's pool, and pins for the new catalogue only.
- **Files:** `program-builder.js`, `tests/catalogue14.test.js`, `tests/fixtures/program-days.json` (new pins only, via `npm run pin`).
- **Test first:** the catalogue-13 pool hash is unchanged; every catalogue-14 exercise is in its pool and in no older one.
- **Done when:** `npm run pin` adds pins only; the build gate (#357) passes in CI.

### 6a. The Threesome subject (Grok, plan first)
- **Build:** 18 programs, the Threesome subject (a new subject's 12, decision 119, plus 6, 292), using the Threesome
  kind and the threesome acts. Program text from the his-side rules and `docs/explicit-guidelines.md`.
- **Test first:** `tests/his-pov.test.js`, `tests/couple-odds.test.js` and the guidelines checks pass; 18 programs in one subject.
- **Done when:** the Opus review reads each blurb and about; the PR's CI is green.

### 6b. +8 per fitting subject (Grok, plan first)
- **Build:** 8 more programs in each After dark and couple subject the new exercises fit (292), using them.
- **Test first:** as 6a, plus each new program uses at least one catalogue-14 exercise.
- **Done when:** as 6a. Blocked on the subject list (see open points).

### 7. Close the phase (Opus)
- **Build:** the counts (666 exercises, programs per subject), `docs/roadmap-archive.md`, the ROADMAP row removed.
- **Done when:** the row is archived; decisions 283–293 moved to the archive with a link.

## Challenge round
- **Weakest assumption:** the subject list. 292 says "every fitting subject" but names none, so the program total
  (18 + 8 × subjects) is not fixed. Settle the list before 6b.
- **What I haven't read:** the exercise shape's tag field (ticket 1 may need a new field), and the Threesome subject's
  pools in `program-builder.js`.
- **The lazier version:** the Threesome kind (285) only, with the place × act as a later phase: 72 + 18 programs.

## Open points (to grill, not decided here)
- **Who builds:** decision 293 gives the exercises to Grok, but ROADMAP says Grok is away this week (295). Until
  Grok is back, Opus writes the exercises, and each ticket names who builds it.
- **Subject list for 6b** (292): which After dark and couple subjects get 8 more.
- **Ticket 2 and 4 splits:** the split follows the act kinds and places above; say if you want them cut differently.

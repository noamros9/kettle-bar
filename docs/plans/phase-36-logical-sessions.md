# Phase 36: logical sessions

Grilled 9 Oct 2026 with Noam, after Phase 22's 144 couple programs showed sessions that don't make sense (teasing in
clothes after sex, the bed then the pool in three seconds). Couple sessions get an order the builder keeps, a test
over every couple program, and written guidelines: [docs/explicit-guidelines.md](../explicit-guidelines.md). It sits
right before Phase 20, so Phase 20's and Phase 35's new programs are born logical. Opus builds it (no explicit text
to write, and Grok is away the week of 9 Oct, 295).

## Decisions

**The order of a session**
- **296 · Clothed teasing opens; undressed once, never dressed again.** Strip and tease, grinding through clothes,
  come before anything naked in a session. *(9 Oct)*
- **297 · Oral can come anywhere**, in the middle of sex too. *(9 Oct)*
- **298 · After anal, her pussy or mouth only after a Shower and bath set**; a session without one keeps anal to the
  end. Anal counts his cock, a toy or his tongue in her ass. *(9 Oct)*
- **299 · The finish closes its set**; a session may finish twice, in different sets, with naked teasing between. *(9 Oct)*
- **300 · Props come off once**: blindfold, cuffs, ties, gag, ice, wax may come off, and don't come back that
  session. Toys come and go. *(9 Oct)*
- **301 · Warm-up first**: massage and slow teasing open; rough and the hardest holds come after. *(9 Oct)*
- **302 · Not rules**: posture changes between holds and a gym set between sex sets are welcome. *(9 Oct)*

**Places**
- **303 · A place changes only between sets**; one place per set. *(9 Oct)*
- **304 · Two groups, the shower bridging**: home (bed, floor, chair, doorframe, balcony) and water (pool, hot tub);
  Shower and bath belongs to both. A session moves within a group, at set breaks. *(9 Oct)*

**What changes**
- **305 · New starts get the logical order**: a program already started keeps its days (the never-reshuffle rule);
  anyone starting a couple program after this phase gets the rules. *(9 Oct)*
- **306 · Enforced three ways**: builder rules from tags on each couple exercise, a standing test over every couple
  program, and the guidelines doc for whoever writes programs (Grok) and reviews them (Claude). *(9 Oct)*

**Ticket 3 (grilled 16 Oct 2026)**
- **363 · Strip and tease: one tease, then naked.** Each tease set opens with one tease; its other slots draw naked
  teasing (massage, hands, oral, body play), so she's undressed once. *(16 Oct)*
- **364 · Pool and Hot tub warm up in the water**: the warm-up set draws the place's own touching and oral, so the
  session never jumps from home to the water. *(16 Oct)*
- **365 · Every couple program moves to version 1 and is re-pinned**: no couple program had been started (Noam), so
  305's split between started and new isn't needed. *(16 Oct)*
- **366 · The order wins over equal odds** (Phase 20's 1.5x basics): teases, props, finishes and anal keep their place in
  the session; `couple-odds` checks only that no exercise the order leaves free is drawn far more than the rest. *(16 Oct)*

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan, the guidelines, the order | docs | – | `plan/logical-sessions` | done (this PR) |
| 1 | Session tags on every couple exercise | feature | 0 | `feature/session-tags` | done (PR #474) |
| 2 | The order step in the builder, behind a rules version | feature | 1 | `feature/session-order` | done (PR #475) |
| 3 | Every couple program redone at once (365: none had been started); recipes and abouts fixed | feature | 2 | `feature/logical-couple-programs` | done (PR #476) |
| 4 | The guidelines wired in: the grok-handoff skill, Phase 20's and 35's prompts | docs | 3 | `docs/explicit-guidelines` | todo |

### 1. Session tags
Facts per couple exercise, in one module (e.g. `session-tags.js`), derived from `sub` and the id, name and cue, with a
short override list for what the words don't say: `clothed` (teasing in clothes), `warm` (massage, slow tease),
`oral`, `anal` (his cock, a toy or his tongue in her ass), `finish` (cumming on her, an edging end), `prop` (blindfold,
cuffs, ties, gag, ice, wax), `place` (home, shower, water). No exercise file changes.
- **As built (16 Oct 2026):** `session-tags.js` also gives `dress` in place of `clothed`: `clothed` (stays dressed),
  `undress` (starts dressed, ends naked: almost every catalogue-13 tease item ends inside her), `naked`, or none (gym
  sets, kisses); after `undress` or `naked`, only `naked` or none. Rule 298 needs `pussy` and `herMouth` (her mouth on
  his cock, balls or ass); a finger in her ass counts as anal, her tongue on his asshole doesn't (298's wording).
  `finish` is the nine `body_cum_*`; an edging run's end is ticket 2's (the edging sub). `props` are named, `him:` when
  on him.
- **Test first:** `tests/session-tags.test.js`: every couple exercise has a place and its flags; a hand-checked table
  of ~40 (every kind, both directions of rimming and kink) matches.
- **Done when:** the tags of a random sample read right to Claude; every couple exercise is tagged.

### 2. The order step
After a couple day is dealt, a pass keeps one place per block (the block's first item sets it; the rest redraw from
that place's share of the same pool), puts clothed items first and never after a naked one, a finish last in its
block, anal before a Shower set before any pussy or oral item, and never a removed prop again. Only behind a rules
version (`sessionRules: 1`); version 0 builds exactly as today.
- **Test first:** `tests/session-order.test.js`: every couple program built at version 1 has no violation of 296–304
  on any day; at version 0 every existing pin holds.
- **Done when:** five sampled days per subject read right; `couple-odds` still passes (equal odds over the program).
- **As built (16 Oct 2026):** `sessionOrder` in `plan()` filters each slot's draw; when nothing fits, the slot draws as
  before. Places are picked with lookahead (a block takes only a place every later block's pools can follow). Anal
  only in the last couple block, or with a later block that can be the shower, which then is. At version 1, 506 of
  534 couple programs keep every rule; the other 28 need their recipes changed, which is ticket 3's: Strip and tease
  (12, every set a tease that starts dressed) and Pool and Hot tub (8 each, a warm-up set only home holds, then the
  water). `lengthen()` doesn't know the rules (no couple program is lengthened). `couple-odds` passes at version 0;
  odds at version 1 are ticket 3's, when programs move.

### 3. Every couple program, in one ticket (Noam, 9 Oct 2026)
**Not started without Noam's explicit go (16 Oct 2026):** planned with him first, as cheap as it can be, Grok possibly.
All couple programs (Explicit, Phase 22's 144, the older After dark) move to version 1 for new starts in one PR.
- First, how a started library program is held (progress, pins, the days the app shows): the version a program
  started with stays with it, compatibly with stored progress and old backups; a new start takes version 1.
- Recipes whose blocks break the order (a clothed-tease block after a sex block) get their blocks swapped; the order
  step can't move whole blocks.
- Every about is read against the new order; the ones that describe the old order are listed in the PR for Grok's
  text pass (Phase 20), not rewritten here.
- Version-1 pins added, version-0 pins unchanged.
- **Test first:** a couple program started before builds the same days after; a fresh start builds version 1; the
  standing order test covers every `couple: true` program.
- **Done when:** on the phone, a started couple program's next day is unchanged and a new one starts ordered; the build
  diff changes couple program files only.
- **As built (16 Oct 2026):** no couple program had been started (365), so every couple config takes `sessionRules: 1`
  (`programs.config.js`) and is re-pinned: 505 programs change, 29 already kept the order. Strip and tease sets open
  with one `sexTease`, then `sexTeaseNaked` (363); the water warm-ups draw `sexPoolWarm` / `sexHottubWarm` (364).
  The order step learned three things on the full library: a place holds a block only if each of its pools has an
  exercise there for every slot; anal starts only where the rest of the block can stay off her pussy and mouth; in an
  all-props pool (kink) the props that are on stay on rather than come off for good. A partner gym exercise has no
  place. Twelve abouts rewritten by Claude (few enough, so no Grok run): the eight water warm-ups and four Strip and
  tease programs. `take-it-off` keeps its two `strip_round` slots (forfeit rounds, as before). With no shower to come,
  anal starts only in the session's last four slots and then stays anal (about the pool's share, 17–19%); after anal
  the set keeps to naked sex. Minutes bands and sexWarm windows in the couple tests take 10% slack (`tests/helpers/band.js`).

### 4. The guidelines wired in
CLAUDE.md links the guidelines already (ticket 0); the grok-handoff skill tells Grok to read them for couple
programs; Phase 20's and 35's plans name them in their prompts.
- **Done when:** a Grok plan prompt for a couple ticket includes them.

## Challenge round
- **Weakest assumption:** that started programs can be told apart from unstarted ones without touching stored shapes
  (305). Not verified yet; ticket 3 checks it before anything else. If it can't be done compatibly, the fallback is
  "only programs made after" (Noam's second option), and the plan changes in ticket 3's PR.
- **Merged on review (Noam, 9 Oct 2026):** the old tickets 3 (versions) and 4 (apply to all) are one ticket, since the
  builder redoes every couple program at once; tags and the order step stay separate, each with its own tests.
- **What I hadn't read:** the couple-odds test and the pool draw. One place per set redraws inside a pool, so equal
  odds over a whole program may drift; ticket 2's Done-when keeps `couple-odds` green, which may need the place to be
  picked in proportion to its share.
- **The lazier version:** guidelines only, no builder change. Rejected by Noam (306): Grok's programs are dealt by the
  builder, so the order can only be kept there.

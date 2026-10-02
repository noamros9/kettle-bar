# Phase 15: the Program finder

Decided 2 Oct 2026 (Noam), after Phase 14 left 263 programs on the Programs page. Picked from the suggestions:
**the Program finder**, with **free-language search using AI**. Grilled the same day:

- **AI engine: an on-phone model.** A small sentence-embedding model (all-MiniLM-L6-v2, quantized, about 25 MB with
  its runtime) runs in the browser: free, private, and offline once downloaded. Not a server, not the Claude API.
- **Who: signed-in only.** Signed-out people get the name search and the 3-question picker.
- **The answer: the top 3–5 programs, each with a line on why it fits.** The model ranks by meaning but cannot write
  sentences, so the "why" line is made from the program's own facts that match what was asked (subject, minutes,
  gear, length, focus), not generated text.
- **Also built:** an **instant name search box**, and a **3-question "help me pick"** (goal, minutes, gear as taps).

## How the AI search works
1. **Ask**: "something easy for my back, 20 minutes, no gear".
2. **Read the hard limits** with plain rules (no model): minutes ("20 minutes", "half an hour", "short"), gear ("no
   gear", "kettlebell", "dumbbells", "pull-up bar"), length ("a month", "30 days"). Programs that break a limit are
   left out (or ranked last when nothing else is left).
3. **Rank by meaning**: the question and each program's **finder text** (name, subject, split, blurb, about, formats,
   main muscles) are turned into vectors by the model; the closest programs win. Program vectors are made on the
   phone the first time and kept in IndexedDB with the build hash, so they're made again only after an update.
4. **Explain**: each result gets one line from its facts that match the question ("Back care · 15–20 min · no
   equipment").

The model files come from **our own site**, not a third party at run time: the deploy downloads a **pinned revision**
of the model from Hugging Face and checks each file's **sha256**, and copies the runtime (transformers.js and its wasm)
from npm, into `_site/vendor/` (as Firebase in Phase 12). The phone downloads them only when the person first uses
the AI search, after saying yes to "About 25 MB, once". Tests never load the real model: a stub embedder stands in.

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/program-finder` | |
| 1 | Name search on Programs | feature | – | `feature/program-search` | |
| 2 | Help me pick (three taps) | feature | – | `feature/help-me-pick` | |
| 3 | Finder text, limits and the "why" line | feature | – | `feature/finder-facts` | |
| 4 | The model on our own site (deploy) | build | – | `build/vendor-model` | |
| 5 | Ask the finder (AI search) | feature | 3, 4 | `feature/ask-finder` | |

### 1. Name search on Programs
- A search field above the family tabs: typing narrows the shelves to programs whose name, subject, split or blurb
  holds every word (ignoring case), on top of the filters; the counter follows. Clear (×) brings everything back. A
  search shows whole shelves (no "Show all").
- `KBLibrary.searchPrograms(summaries, query)`; the summaries gain the blurb (`SLIM`), sizes checked.
- **Test first:** unit: every word must match, case and accents ignored, empty query = all; phone: type "kettle",
  the shelves and counter narrow, × clears, 360 px no sideways scroll.
- **Done when:** the page stays under the size check.

### 2. Help me pick (three taps)
- A "Help me pick" button by Build your own opens a sheet: **Goal** (strength, fitness & cardio, fighting skills,
  flexibility & mobility, balance & control, gentle / back care, a bit of everything), **Minutes** (15 · 20–25 ·
  30 · 35+), **Gear** (none · a kettlebell · all). It shows the top 5 with the why line (ticket 3's `why`) and opens one.
- `KBFinder.pick(summaries, { goal, minutes, gear })`: goal → subjects (a table), then minutes and gear as hard limits,
  then programs you have not started first, library order.
- **Test first:** unit: each goal maps to existing subjects, limits hold, never empty (loosens minutes, then gear,
  and says so); phone: three taps → five cards → open one.

### 3. Finder text, limits and the "why" line
- `app/finder.js` (pure, Node and page): `textOf(program)` (the finder text), `limits(query)` (minutes, gear, length
  from plain rules), `fits(program, limits)`, `why(program, limits, goal?)`, `rank(vectors, query vector, programs,
  limits, n)` (cosine, limits first). `data/finder.json` at build: id → finder text.
- **Test first:** `limits` on a table of phrases ("20 min", "half an hour", "no gear", "with a kettlebell", "a
  month"); `rank` with hand-made vectors; `why` lines; 100% coverage.

### 4. The model on our own site (deploy)
- `scripts/vendor-model.js _site`: downloads the pinned model revision's files (config, tokenizer, quantized ONNX) and
  checks each against its sha256 in the script; copies `@huggingface/transformers` (dev dependency, pinned) dist and
  wasm from node_modules; writes `vendor/model/<revision>/`. `deploy.yml` runs it after the Firebase step.
- The service worker never precaches it; it caches the files when the finder first loads them.
- **Test first:** the script's pure parts (the file list, the hash check with a fake download, the paths it writes);
  a wrong hash fails the deploy.
- **Note:** this container cannot reach Hugging Face, so the real download is checked in CI only (the first PR run).

### 5. Ask the finder (AI search)
- On the Programs page, signed in: an "Ask" field ("Describe what you want…"). First use: "Download the finder
  (about 25 MB, once)?" with progress; then the program vectors are made (a progress line) and kept in IndexedDB
  (keyed by the build version). Answer: 3–5 cards with the why line. Offline after the download.
- Signed out: the field says "Sign in to ask in your own words" and offers the name search and Help me pick.
- `window.KB_EMBED` can replace the embedder (the phone tests' stub: a bag-of-words vector), so tests never download.
- **Test first:** phone, with the stub: signed out → the sign-in note; signed in → consent, progress, results with
  why lines, a gear limit respected, a second ask is instant (vectors cached), offline after the first time.
- **Done when:** on a real phone (Noam), the first ask completes and the second answers in under a second.

## Challenge round
- **Weakest assumption:** that MiniLM understands workout requests well enough. Mitigated by doing minutes, gear and
  length with rules, so the model only judges meaning ("easy for my back" → Back care, Gentle). If results are poor,
  the finder text is where to improve, not the model.
- **What I hadn't read:** how slow making 263 vectors is on a mid-range phone (estimated 5–15 s once). If it is too
  slow, the deploy can make them at build time with the same model in Node and ship `finder-vectors.json` (~100 KB).
- **English only:** MiniLM is an English model. A Hebrew question would rank poorly; a multilingual model is about
  five times larger.
- **The lazier version:** tickets 1–3 without the model (name search, Help me pick, and `limits` + keyword ranking
  for the free text). Noam chose the on-phone model.

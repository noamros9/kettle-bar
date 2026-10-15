# Grok usage per ticket

Measuring decision 339 (Grok writes text only) until Noam says stop (asked 15 Oct 2026). After every Grok ticket, add a
row: `node ~/.claude/skills/grok-handoff/grok-usage.js <the ticket's tN-out*.json>` (plan, fix and build runs
together), plus Noam's weekly % (ask him for it), and Claude's side over the same window (hand-off to merge):
`node ~/.claude/skills/grok-handoff/claude-usage.js <from ISO> <to ISO>`; other work in that window counts too, so note it. Claude's tokens are almost all cache reads, so they track how long the session is. Total = input + cache read + output tokens; $ comes from Grok's `end`
events only, so a cut-off run adds tokens but no $. So far 1% of the weekly usage ≈ $0.30–0.40.

| Ticket | Way | Runs | Turns | Total tokens | $ | Weekly % | Claude turns | Claude tokens | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 20 · 9 | before 339 (Grok builds all) | 4 (1 cut off) | 129 | 17.24M | 4.06 | ~10 | 90 | 17.95M | 27 programs; Claude's window includes 8b's merge; the build run alone 95 turns, $2.93 |
| 20 · 10 plan | before 339 | 1 | 36 | 4.38M | 1.26 | ~4 | 24 | 6.62M | plan only (27 programs) |
| 20 · 10 build | before 339 | 2 (both cut off) | 20 | 3.79M | – | – | (in the plan's window) | | stopped by 402 (usage ran out) |

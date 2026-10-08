// Sums Opus's own tokens in a Claude Code session log between two times: the supervising side of a Sonnet ticket.
//   node .claude/skills/sonnet-handoff/opus-stats.js <session.jsonl> <from ISO> [<to ISO>]
// The log is ~/.claude/projects/<repo>/<session id>.jsonl; one API call can span several entries, counted once.
const fs = require('fs');
const [file, from, to = '9999'] = process.argv.slice(2);
if (!file || !from) { console.error('usage: opus-stats.js <session.jsonl> <from ISO> [<to ISO>]'); process.exit(1); }
const seen = new Set();
const t = { calls: 0, input: 0, cacheRead: 0, cacheWrite: 0, output: 0 };
for (const l of fs.readFileSync(file, 'utf8').split('\n')) {
  if (!l.startsWith('{')) continue;
  let e; try { e = JSON.parse(l); } catch { continue; }
  if (e.type !== 'assistant' || !e.message || !e.message.usage) continue;
  if (e.timestamp < from || e.timestamp > to || seen.has(e.requestId)) continue;
  seen.add(e.requestId);
  const u = e.message.usage;
  t.calls++; t.input += u.input_tokens || 0; t.cacheRead += u.cache_read_input_tokens || 0;
  t.cacheWrite += u.cache_creation_input_tokens || 0; t.output += u.output_tokens || 0;
}
console.log(`${t.calls} call(s), input ${t.input}, cache read ${t.cacheRead}, cache write ${t.cacheWrite}, output ${t.output}`);

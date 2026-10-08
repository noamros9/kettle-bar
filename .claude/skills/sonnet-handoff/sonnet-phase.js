// Reads a `claude -p --output-format stream-json --verbose` transcript, prints the builder's current phase as JSON.
const fs = require('fs');
const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n');
let phase = 'starting', last = '', fails = 0, commits = 0, end = '';
for (const l of lines) {
  if (!l.startsWith('{')) continue;
  let e; try { e = JSON.parse(l); } catch { continue; }
  if (e.type === 'result') end = e.subtype || 'ended';
  const content = (e.message && Array.isArray(e.message.content)) ? e.message.content : [];
  for (const c of content) {
    if (c.type === 'tool_result' && c.is_error) fails++;
    if (c.type !== 'tool_use') continue;
    const i = c.input || {};
    const what = i.command || i.file_path || i.path || i.pattern || '';
    last = `${c.name} ${String(what).replace(/.*kettle-bar[\/]/, '')}`.slice(0, 90);
    if (/git commit/.test(what)) { commits++; phase = 'committing'; }
    else if (/list-sub/.test(what)) phase = 'comparing against existing exercises';
    else if (c.name === 'Bash' && /npm run|node --test|vitest|coverage/.test(what)) phase = 'running the tests';
    else if (/^(Write|Edit|MultiEdit)$/.test(c.name)) phase = /plan\.md/.test(what) ? 'writing the plan' : /grok[\/]/.test(what) ? 'writing a scratch script' : 'writing the code';
    else if (phase === 'starting') phase = 'reading the repo';
  }
}
console.log(JSON.stringify({ phase, fails, commits, end, last }));

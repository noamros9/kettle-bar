/* Export (Phase 32, #224): an exercise, a day, a whole program or a random workout as words, and a program as a calendar
   file. Pure: runs in Node and in the page (KBExport). The print view (app/pages/print.js) and the Export sheet use it.

     exerciseDose(e)                   "8 / 10 / 12 reps (Level I / II / III)", as the exercise page says it
     doseParts(it, b, EX) -> { n, unit } how a card says an item's count (the day page draws the same parts)
     dose(it, b, EX)                   the same in words, with the sets of a straight set: "3 × 12 reps"
     exerciseText(e)                   name, the dose at each level and the equipment
     dayText(day, program, EX, { title? })   a day as you'll do it (at its own level, decision 337): the header, then the
                                       warm-up, each block with its lines and rests, the cool-down
     programText(program, EX)          the program's name and about, then every day
     randomText(made, EX)              a random workout (app/random.js's made)
     ics(program, { start, weekdays, done?, now? }, EX) -> an iCalendar file (RFC 5545): one all-day event per day not
                                       done, in order, from start ('YYYY-MM-DD') on the weekdays picked (0 = Sunday)
     parseIcs(text) -> [{ uid, start, end, summary, description }]   reads one back (tests, and the sheet's check)

   The words are the workout (decision 243): blocks, exercises, sets × reps or holds, rests; no cues and no muscles. */
(function (root, Formats, Session, Ex) {
  const { NAMES } = Formats;
  const { unitText, DEFAULT_RESTS } = Session;
  const LEVELS = 'Level I / II / III';
  const isStretch = (e) => e.cat === 'warmup' || e.cat === 'cooldown';

  function exerciseDose(e) {
    const r = e.r, each = e.side ? ' each side' : '';
    if (isStretch(e)) return `${r[0]} s${each}`;
    if (e.u === 'sec') return `${r.join(' / ')} s${each} (${LEVELS})`;
    return `${r.join(' / ')} ${unitText(e)} (${LEVELS})`;
  }
  function equipment(e) {
    if (e.load) return Ex.LOAD[e.load];
    return Ex.needs(e, 'bar') ? 'Pull-up bar' : 'Bodyweight, mat';
  }

  // how each format counts an item: the day page's cards draw these, the text says them
  const PARTS = {
    emom: (it, e) => ({ n: it.n, unit: `${e.u === 'sec' ? 'sec' : 'reps'} per minute${e.side && e.u !== 'sec' ? ', each side' : ''}` }),
    amrap: (it, e) => ({ n: it.n, unit: `${e.u === 'sec' ? 'sec' : 'reps'} per round` }),
    tabata: () => ({ n: '20', unit: 'sec hard, 10 sec rest' }),
    bouts: (it) => ({ n: Math.round(it.n / 60), unit: 'min bout' }),
    ladder: (it, e) => ({ n: '1→', unit: `${e.side ? 'reps each side, ' : 'reps, '}+1 each rung` }),
  };
  function doseParts(it, b, EX) {
    const e = EX[it.ex], f = (b && b.format) || 'straight';
    return PARTS[f] ? PARTS[f](it, e) : { n: it.n, unit: unitText(e) };
  }
  function dose(it, b, EX) {
    const { n, unit } = doseParts(it, b, EX), f = b.format || 'straight';
    return `${f === 'straight' ? `${it.sets || b.sets} × ` : ''}${n} ${unit}`;
  }

  // the block's shape in a line: rounds, minutes, rests
  const min = (s) => `${s / 60} min`;
  const BLOCK = {
    straight: (b, R) => `${[...new Set(b.items.map((it) => it.sets || b.sets))].join('/')} sets · ${R.set} s between sets · ${min(R.exercise)} between exercises`,
    superset: (b, R) => `Pairs back to back · ${b.sets} rounds per pair · ${R.superset} s rest · ${min(R.exercise)} between pairs`,
    circuit: (b, R) => `One after another · ${b.rounds} rounds · ${min(R.round)} rest between rounds`,
    emom: (b) => `Every minute on the minute for ${b.minutes} min, the exercise changes each minute`,
    amrap: (b) => `As many rounds as possible in ${b.minutes} min`,
    tabata: (b) => `${b.tabatas} × 4 min: 20 s hard, 10 s rest, 8 rounds · 1 min between Tabatas`,
    flow: (b) => `${b.items.length} poses${b.repeat > 1 ? `, ${b.repeat === 2 ? 'twice' : 'three times'} through` : ''}`,
    bouts: (b) => `${b.items.length} bouts, ${min(b.rest || 60)} rest between`,
    ladder: (b) => `${b.minutes} min: 1 rep of each, then 2, then 3… until time runs out`,
  };
  const clock = (secs) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  function stretchLines(s, label, EX) {
    return [`${label} · ${clock(s.seconds)}`, ...s.items.map((it) => `- ${EX[it.ex].name} · ${it.n} ${EX[it.ex].side ? 'sec each side' : 'seconds'}`)];
  }
  const typeLabel = (program, day) => ((program.dayTypes || {})[day.type] || {}).label || day.title;
  const levelName = (program, day) => (program.levels ? program.levels[day.level - 1] : '');

  function dayText(day, program, EX, { title } = {}) {
    const R = { ...DEFAULT_RESTS, ...(program.rests || {}) };
    const out = [title || `Day ${day.day} · ${day.name}`, [typeLabel(program, day), levelName(program, day), `~${day.est} min${day.stretchMin ? ` + ${day.stretchMin} min stretching` : ''}`].filter(Boolean).join(' · ')];
    if (day.warmup) out.push('', ...stretchLines(day.warmup, 'Warm-up', EX));
    day.blocks.forEach((b, bi) => {
      const f = b.format || 'straight';
      out.push('', `${b.kind === 'abs' ? 'Abs' : bi + 1} · ${b.title}${f === 'straight' ? '' : ` · ${NAMES[f]}`}`, BLOCK[f](b, R));
      b.items.forEach((it) => out.push(`- ${EX[it.ex].name} · ${dose(it, b, EX)}${it.note ? ` · ${it.note}` : ''}`));
      const next = day.blocks[bi + 1];
      if (next) out.push(next.kind === 'abs' ? `Rest ${min(R.beforeAbs)}, then abs` : `Rest ${min(R.block)}`);
    });
    if (day.cooldown) out.push('', ...stretchLines(day.cooldown, 'Cool-down', EX));
    return out.join('\n');
  }
  function exerciseText(e) {
    return [e.name, `${isStretch(e) || e.u === 'sec' ? 'Hold' : 'Reps'}: ${exerciseDose(e)}`, `Equipment: ${equipment(e)}`].join('\n');
  }
  function programText(program, EX) {
    const head = [program.name, [program.subject, `${program.days.length} days`].filter(Boolean).join(' · ')];
    if (program.about || program.blurb) head.push('', program.about || program.blurb);
    return [head.join('\n'), ...program.days.map((d) => dayText(d, program, EX))].join('\n\n\n');
  }
  function randomText(made, EX) {
    return dayText(made.day, made.program, EX, { title: `Random workout · ${made.subject}` });
  }

  /* ---- the calendar file ---- */
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
  const stamp = (d) => `${ymd(d)}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  const escapeText = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  // a content line folded at 75 octets (UTF-8), never inside a character; each continuation starts with a space
  function fold(line) {
    const out = [];
    let cur = '', size = 0;
    for (const ch of line) {
      const n = octets(ch);
      if (size + n > (out.length ? 74 : 75)) { out.push(cur); cur = ''; size = 0; }
      cur += ch; size += n;
    }
    out.push(cur);
    return out.join('\r\n ');
  }
  function octets(ch) { const c = ch.codePointAt(0); return c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4; }
  // the dates for the days, in order: from start, on the weekdays picked
  function dates(start, weekdays, count) {
    const [y, m, d] = start.split('-').map(Number), at = new Date(Date.UTC(y, m - 1, d)), out = [];
    if (!count) return out;
    if (!weekdays.length) throw new Error('Pick at least one weekday');
    while (out.length < count) {
      if (weekdays.includes(at.getUTCDay())) out.push(new Date(at));
      at.setUTCDate(at.getUTCDate() + 1);
    }
    return out;
  }
  function ics(program, { start, weekdays, done = [], now = new Date() }, EX) {
    const left = program.days.filter((d) => !done.includes(d.day)), when = dates(start, weekdays, left.length);
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kettle & Bar//Export//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    left.forEach((d, i) => {
      const day = when[i], next = new Date(day); next.setUTCDate(next.getUTCDate() + 1);
      lines.push('BEGIN:VEVENT', `UID:${program.id}-d${d.day}-${start}@kettle-bar`, `DTSTAMP:${stamp(now)}`,
        `DTSTART;VALUE=DATE:${ymd(day)}`, `DTEND;VALUE=DATE:${ymd(next)}`,
        `SUMMARY:${escapeText(`Kettle & Bar · ${program.name} · Day ${d.day} · ${typeLabel(program, d)}`)}`,
        `DESCRIPTION:${escapeText(dayText(d, program, EX))}`, 'TRANSP:TRANSPARENT', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.map(fold).join('\r\n') + '\r\n';
  }
  const unescapeText = (s) => s.replace(/\\(.)/g, (m, c) => (c === 'n' || c === 'N' ? '\n' : c));
  function parseIcs(text) {
    const lines = text.replace(/\r\n[ \t]/g, '').split('\r\n'), events = [];
    let ev = null;
    for (const line of lines) {
      if (line === 'BEGIN:VEVENT') ev = {};
      else if (line === 'END:VEVENT') { events.push(ev); ev = null; } else if (ev) {
        const i = line.indexOf(':'), name = line.slice(0, i).split(';')[0], value = line.slice(i + 1);
        const key = { UID: 'uid', DTSTART: 'start', DTEND: 'end', SUMMARY: 'summary', DESCRIPTION: 'description' }[name];
        if (key) ev[key] = unescapeText(value);
      }
    }
    return events;
  }

  const api = { exerciseDose, equipment, doseParts, dose, exerciseText, dayText, programText, randomText, ics, parseIcs, fold, escapeText };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBExport = api;
})(typeof window !== 'undefined' ? window : globalThis,
  typeof module !== 'undefined' && module.exports ? require('../formats.js') : window.KBFormats,
  typeof module !== 'undefined' && module.exports ? require('./session.js') : window.KBSession,
  typeof module !== 'undefined' && module.exports ? require('../exercises.js') : window.KBEx);

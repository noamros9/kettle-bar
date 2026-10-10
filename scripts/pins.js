// Program pins: a SHA-256 of each program's days, kept in tests/fixtures/program-days.json. A pinned program's days never
// change (someone may be halfway through it), so the build checks every pin before it writes anything.
const crypto = require('crypto');

const pinOf = (days) => crypto.createHash('sha256').update(JSON.stringify(days)).digest('hex');

// Every pin must match a program in the build, unchanged. Returns the problems; none means the build may go on.
function pinProblems(programs, pins) {
  const byId = new Map(programs.map((p) => [p.id, p]));
  return Object.entries(pins).flatMap(([id, sha]) => {
    const p = byId.get(id);
    if (!p) return [`${id}: pinned but not in the build (delete its pin line on purpose to remove it)`];
    const now = pinOf(p.days);
    return now === sha ? [] : [`${id}: its days changed (pinned ${sha.slice(0, 8)}, built ${now.slice(0, 8)})`];
  });
}

module.exports = { pinOf, pinProblems };

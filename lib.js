/* Kettle & Bar: figure engine + exercise library (shared by generator and app) */
(function (root) {
  const W = 120, H = 124, G = 116, BAR = 8;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const nrm = (a) => { const d = Math.hypot(a[0], a[1]) || 1; return [a[0] / d, a[1] / d]; };
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

  function ik(r, target, a, b, hint) {
    const v = sub(target, r), d = Math.hypot(v[0], v[1]), dir = nrm(v);
    if (d >= a + b - 0.001) { const j = add(r, mul(dir, a)); return [j, add(j, mul(dir, b))]; }
    const dd = Math.max(d, Math.abs(a - b) + 0.5);
    const x = (a * a - b * b + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, a * a - x * x));
    let p = [-dir[1], dir[0]];
    if (p[0] * hint[0] + p[1] * hint[1] < 0) p = mul(p, -1);
    const j = add(add(r, mul(dir, x)), mul(p, h));
    const end = dd === d ? target : add(j, mul(nrm(sub(target, j)), b));
    return [j, end];
  }

  function solve(ps, front) {
    const hip = [0, 0], neck = ps.t, td = nrm(ps.t), perp = [-td[1], td[0]];
    const sN = front ? add(add(neck, mul(perp, -9)), mul(td, -2)) : neck;
    const sF = front ? add(add(neck, mul(perp, 9)), mul(td, -2)) : neck;
    const hN = front ? add(hip, mul(perp, -6)) : hip;
    const hF = front ? add(hip, mul(perp, 6)) : hip;
    const eN = ps.ehn || ps.eh || (front ? [-1, 0.3] : [-1, 0.4]);
    const eF = ps.ehf || ps.eh || (front ? [1, 0.3] : [-1, 0.4]);
    const kN = ps.khn || ps.kh || (front ? [-1, 0] : [1, -0.2]);
    const kF = ps.khf || ps.kh || (front ? [1, 0] : [1, -0.2]);
    const [elN, haN] = ik(sN, ps.hn, 17, 16, eN);
    const [elF, haF] = ik(sF, ps.hf, 17, 16, eF);
    const [knN, ftN] = ik(hN, ps.fn, 21, 20, kN);
    const [knF, ftF] = ik(hF, ps.ff, 21, 20, kF);
    const head = add(neck, mul(ps.hd ? nrm(ps.hd) : td, 9));
    return { hip, neck, sN, sF, hN, hF, elN, haN, elF, haF, knN, ftN, knF, ftF, head };
  }

  // Returns {shapes:[{k,..}], pts:[[x,y,r]]}
  function propDB(h, el) {
    const f = nrm(sub(h, el)), p = [-f[1], f[0]];
    const c1 = add(h, mul(p, -6)), c2 = add(h, mul(p, 6));
    return {
      shapes: [
        { k: 'line', a: c1, b: c2, w: 2.6, c: 'w' },
        { k: 'line', a: add(c1, mul(f, -4)), b: add(c1, mul(f, 4)), w: 5.6, c: 'w' },
        { k: 'line', a: add(c2, mul(f, -4)), b: add(c2, mul(f, 4)), w: 5.6, c: 'w' },
      ],
      pts: [[...add(c1, mul(f, 4)), 2.8], [...add(c1, mul(f, -4)), 2.8], [...add(c2, mul(f, 4)), 2.8], [...add(c2, mul(f, -4)), 2.8]],
    };
  }
  function propKB(h, dir) {
    const d = nrm(dir), ring = add(h, mul(d, 3)), bell = add(h, mul(d, 9.5));
    return {
      shapes: [
        { k: 'ring', c0: ring, r: 3.4, w: 2.2, c: 'w' },
        { k: 'dot', c0: bell, r: 6.6, c: 'w' },
      ],
      pts: [[...bell, 6.6], [...ring, 4.5]],
    };
  }

  function frame(ps, front) {
    const s = solve(ps, front);
    const fore = (el, ha) => nrm(sub(ha, el));
    const props = { far: [], near: [], both: [] };
    const pts = [];
    const P = (p, r) => pts.push([p[0], p[1], r]);
    [s.elN, s.haN, s.elF, s.haF, s.knN, s.ftN, s.knF, s.ftF].forEach((p) => P(p, 3.3));
    P(s.hip, 5); P(s.neck, 5); P(s.head, 7);
    const addProp = (slot, pr) => { props[slot].push(...pr.shapes); pr.pts.forEach((q) => pts.push(q)); };
    const db = ps.db || '';
    if (db === 'both') addProp('both', propDB(mid(s.haN, s.haF), add(mid(s.haN, s.haF), mul(nrm(add(fore(s.elN, s.haN), fore(s.elF, s.haF))), -10))));
    else {
      if (db.includes('f')) addProp('far', propDB(s.haF, s.elF));
      if (db.includes('n')) addProp('near', propDB(s.haN, s.elN));
    }
    const kb = ps.kb || '';
    if (kb === 'both') addProp('both', propKB(mid(s.haN, s.haF), ps.kbd || add(fore(s.elN, s.haN), fore(s.elF, s.haF))));
    else if (kb === 'n') addProp('near', propKB(s.haN, ps.kbd || fore(s.elN, s.haN)));
    else if (kb === 'f') addProp('far', propKB(s.haF, ps.kbd || fore(s.elF, s.haF)));

    // bounds
    let maxY = -1e9, minX = 1e9, maxX = -1e9, minY = 1e9;
    pts.forEach(([x, y, r]) => { maxY = Math.max(maxY, y + r); minY = Math.min(minY, y - r); minX = Math.min(minX, x - r); maxX = Math.max(maxX, x + r); });
    const ch = ps.chair;
    if (ch) { maxY = Math.max(maxY, ch.y + ch.h); minX = Math.min(minX, ch.x - 11); maxX = Math.max(maxX, ch.x + 11); }
    if (ps.wall !== undefined) { minX = Math.min(minX, ps.wall - 6); maxX = Math.max(maxX, ps.wall); }
    let dy = ps.bar ? BAR - (s.haN[1] + s.haF[1]) / 2 : G - maxY;
    dy -= ps.lift || 0;
    const dx = W / 2 - (minX + maxX) / 2;
    if (ch && ch.back) minY = Math.min(minY, ch.y - 22);
    return { s, props, dx, dy, minX, maxX, minY: minY + dy, ps, front };
  }

  const f1 = (n) => Math.round(n * 10) / 10;
  const pt = (p, fr) => [f1(p[0] + fr.dx), f1(p[1] + fr.dy)];

  function shapeSVG(sh, fr) {
    const col = sh.c === 'w' ? 'var(--kit)' : 'var(--fig)';
    if (sh.k === 'line') { const a = pt(sh.a, fr), b = pt(sh.b, fr); return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${col}" stroke-width="${sh.w}" stroke-linecap="round"/>`; }
    if (sh.k === 'ring') { const c = pt(sh.c0, fr); return `<circle cx="${c[0]}" cy="${c[1]}" r="${sh.r}" fill="none" stroke="${col}" stroke-width="${sh.w}"/>`; }
    if (sh.k === 'dot') { const c = pt(sh.c0, fr); return `<circle cx="${c[0]}" cy="${c[1]}" r="${sh.r}" fill="${col}"/>`; }
    return '';
  }

  function frameSVG(fr) {
    const { s, ps, front } = fr;
    const out = [];
    const line = (pts, w, col) => `<polyline points="${pts.map((p) => pt(p, fr).join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    // environment
    if (ps.bar) {
      out.push(`<line x1="4" y1="${BAR}" x2="${W - 4}" y2="${BAR}" stroke="var(--prop)" stroke-width="3" stroke-linecap="round"/>`);
    } else {
      if (ps.mat) {
        const x0 = f1(fr.minX + fr.dx - 2), x1 = f1(fr.maxX + fr.dx + 2);
        out.push(`<rect x="${x0}" y="${G - 0.5}" width="${f1(x1 - x0)}" height="3.2" rx="1.6" fill="var(--mat)"/>`);
      }
      out.push(`<line x1="2" y1="${G + 3}" x2="${W - 2}" y2="${G + 3}" stroke="var(--ground)" stroke-width="1.2"/>`);
    }
    if (ps.wall !== undefined) {
      const x = f1(ps.wall + fr.dx);
      out.push(`<rect x="${f1(x - 6)}" y="6" width="6" height="${G + 2 - 6}" fill="var(--prop)" opacity=".55"/>`);
    }
    if (ps.chair) {
      const c = ps.chair, x = c.x + fr.dx, y = c.y + fr.dy, yb = y + c.h;
      const L = (x1, y1, x2, y2, w) => out.push(`<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="var(--prop)" stroke-width="${w}" stroke-linecap="round"/>`);
      L(x - 8, y, x - 8, yb + 2.5, 2.6); L(x + 8, y, x + 8, yb + 2.5, 2.6); L(x - 10.5, y + 1.2, x + 10.5, y + 1.2, 3.4);
      if (c.back) L(x + c.back * 9.5, y, x + c.back * 9.5, y - 22, 3);
    }
    const farCol = front ? 'var(--fig)' : 'var(--fig-far)';
    out.push(line([s.hF, s.knF, s.ftF], 6.2, farCol));
    out.push(line([s.sF, s.elF, s.haF], 6.2, farCol));
    fr.props.far.forEach((sh) => out.push(shapeSVG(sh, fr)));
    if (front) out.push(line([s.sN, s.sF], 7, 'var(--fig)'), line([s.hN, s.hF], 7, 'var(--fig)'));
    out.push(line([s.hip, s.neck], 10, 'var(--fig)'));
    const hd = pt(s.head, fr);
    out.push(`<circle cx="${hd[0]}" cy="${hd[1]}" r="7" fill="var(--fig)"/>`);
    out.push(line([s.hN, s.knN, s.ftN], 6.2, 'var(--fig)'));
    out.push(line([s.sN, s.elN, s.haN], 6.2, 'var(--fig)'));
    fr.props.near.forEach((sh) => out.push(shapeSVG(sh, fr)));
    fr.props.both.forEach((sh) => out.push(shapeSVG(sh, fr)));
    return out.join('');
  }

  function figureSVG(ex, label) {
    const frames = ex.poses.map((ps) => frame(ps, ex.view === 'front'));
    const n = frames.length, gap = 6, w = n * W + (n - 1) * gap;
    const top = Math.floor(Math.min(...frames.map((f) => (f.ps.bar ? Math.min(f.minY, 4) : f.minY) - 4)));
    const body = frames.map((fr, i) => `<g transform="translate(${i * (W + gap)},0)">${frameSVG(fr)}</g>`).join('');
    return `<svg class="fig" viewBox="0 ${top} ${w} ${H + 4 - top}" role="img" aria-label="${label || ex.name}">${body}</svg>`;
  }

  /* ---------- Pose building blocks (profile view faces right, hip at 0,0, y down) ---------- */
  const P = (base, over) => Object.assign({}, base, over);
  const STAND = { t: [0, -34], hn: [3, -1], hf: [1, -1], fn: [2, 41], ff: [-2, 41] };
  const PLANK = { t: [30, -15], hn: [30, 18], hf: [33, 18], fn: [-37, 18], ff: [-39, 18], mat: 1 };
  const PUSHB = { t: [34, -4], hn: [29, 5], hf: [32, 5], fn: [-40, 5], ff: [-42, 5], eh: [-0.4, -1], mat: 1 };
  const FOREARM = { t: [33, -8], hn: [50, 9], hf: [52, 9], fn: [-40, 9], ff: [-41, 9], eh: [-0.3, 1], mat: 1 };
  const HANG = { t: [0, -34], hn: [3, -67], hf: [1, -67], fn: [-14, 33], ff: [-16, 32], kh: [1, 0.2], bar: 1 };
  const PULLTOP = { t: [-4, -34], hn: [8, -41], hf: [6, -41], eh: [0.2, 1], fn: [-12, 32], ff: [-14, 31], kh: [1, 0.2], bar: 1 };
  const PULLMID = { t: [-2, -34], hn: [6, -58], hf: [4, -58], eh: [0, 1], fn: [-13, 32], ff: [-15, 31], kh: [1, 0.2], bar: 1 };
  const SUPLEGS = { fn: [-24, 0], ff: [-26, 0], kh: [0.2, -1] };
  const SUP = P(SUPLEGS, { t: [34, 0], mat: 1 });
  const HINGE = { t: [26, -22], fn: [5, 40], ff: [3, 40] };
  const STAG = { t: [29, -17], fn: [-15, 38], ff: [14, 38], hf: [10, 16] };
  const VSEAT = { t: [-17, -29], fn: [28, -10], ff: [27, -9], kh: [0.2, -1], mat: 1 };
  const BSQ = { t: [30, -16], fn: [10, 14], ff: [8, 14], kh: [1, -0.5], hn: [33, 14], hf: [35, 14] };
  const JUMP = { t: [1, -34], hn: [6, -66], hf: [4, -66], fn: [1, 41], ff: [-1, 41], lift: 9 };
  const SQUAT = { t: [15, -30], fn: [10, 30], ff: [8, 30], kh: [1, -0.3] };
  const LUNGE_N = { t: [0, -34], fn: [21, 20], khn: [1, -1], ff: [-27, 17], khf: [0.3, 1], hn: [8, -8], hf: [-6, -4] };
  const LUNGE_F = { t: [0, -34], ff: [21, 20], khf: [1, -1], fn: [-27, 17], khn: [0.3, 1], hf: [8, -8], hn: [-6, -4] };
  const SWING_LOW = { t: [26, -21], fn: [6, 39], ff: [4, 39], hn: [6, 8], hf: [6, 8], kb: 'both', kh: [1, -0.3] };
  const RACK = P(STAND, { hn: [7, -38], ehn: [0.2, 1], kb: 'n', kbd: [-0.6, 0.5] });
  const PRESS_UP = P(STAND, { hn: [2, -67], kb: 'n', kbd: [-0.5, 0.35] });
  const GB_DOWN = P(SUP, { hn: [6, 2], hf: [6, 2], eh: [0, -1] });
  const GB_UP = { t: [32, 12], hd: [1, 0], hn: [8, 15.5], hf: [8, 15.5], eh: [0, -1], fn: [-22, 15.5], ff: [-24, 15.5], kh: [0, -1], mat: 1 };
  const HANDS_HIPS = { hn: [3, -4], hf: [2, -4], eh: [-1, -0.2] };
  const FSTAND = { t: [0, -34], hn: [-12, 0], hf: [12, 0], fn: [-8, 41], ff: [8, 41] };

  /*
   * Exercise library.
   * r: reps (or seconds) for Level I / II / III.  u: 'reps' | 'sec'.  side: done on each side.
   * alt: alternating, number is the total.  tp: seconds per rep (for time estimates).
   * lv: first level it appears at.  load: suggested weight.  cue: one-line how-to.
   */
  const EX = {
    // ---------------- CHEST ----------------
    pushup: { name: 'Push-ups', cat: 'chest', r: [12, 15, 18], tp: 2.5, cue: 'Hands under shoulders, body in one straight line, chest to a fist above the floor.', poses: [PLANK, PUSHB] },
    diamond_pushup: { name: 'Diamond push-ups', cat: 'chest', r: [8, 10, 12], tp: 2.6, cue: 'Hands together under your chest, elbows brush your ribs on the way down.', poses: [P(PLANK, { hn: [24, 18], hf: [25, 18] }), P(PUSHB, { hn: [24, 5], hf: [25, 5], eh: [-1, -0.4] })] },
    dive_bomber: { name: 'Dive-bomber push-ups', cat: 'chest', r: [8, 10, 12], tp: 3.5, cue: 'From a pike, swoop your chest forward just above the floor and up into a cobra. Push back to the pike.', poses: [
      { t: [28.7, 18.3], hn: [56.5, 36], hf: [58, 36], fn: [-19.6, 36], ff: [-21, 36], mat: 1 },
      { t: [34, 6], hn: [44, 14], hf: [46, 14], eh: [-1, -0.2], fn: [-38, 14], ff: [-39, 14], mat: 1 },
      { t: [21.3, -26.5], hd: [1, -0.6], hn: [22, 6.5], hf: [24, 6.5], fn: [-40.5, 6.5], ff: [-41, 6.5], mat: 1 }] },
    db_floor_press: { name: 'Dumbbell floor press', cat: 'chest', r: [12, 12, 15], tp: 3, load: 'heavy', cue: 'Lie on your back, knees bent. Press both dumbbells up, lower until elbows touch the floor.', poses: [
      P(SUP, { hn: [26, -14], hf: [27, -14], eh: [0, 1], db: 'nf' }), P(SUP, { hn: [34, -33], hf: [35, -33], db: 'nf' })] },
    db_pullover: { name: 'Dumbbell pullover', cat: 'chest', r: [12, 12, 15], tp: 3.5, load: 'single', cue: 'Lie on your back holding one dumbbell over your chest. Lower it behind your head with long arms, pull back.', poses: [
      P(SUP, { hn: [34, -33], hf: [34, -33], db: 'both' }), P(SUP, { hn: [64, -13], hf: [64, -13], db: 'both' })] },
    spiderman_pushup: { name: 'Spiderman push-ups', cat: 'chest', r: [8, 10, 12], alt: 1, tp: 3, cue: 'As you lower, bring one knee to the outside of the same elbow. Alternate sides.', poses: [PLANK, P(PUSHB, { fn: [2, 4], khn: [1, 0] })] },
    explosive_pushup: { name: 'Explosive push-ups', cat: 'chest', r: [6, 8, 10], tp: 3, lv: 2, cue: 'Lower under control, then push hard enough that your hands leave the floor. Land soft.', poses: [PUSHB, P(PLANK, { hn: [33, 11], hf: [36, 11] })] },
    plank_to_pushup: { name: 'Plank up-downs', cat: 'chest', r: [8, 10, 12], tp: 4, cue: 'From a forearm plank, press up to straight arms one hand at a time, then come back down.', poses: [FOREARM, PLANK] },
    // ---------------- BACK ----------------
    pullup: { name: 'Pull-ups', cat: 'back', r: [3, 4, 5], tp: 4, equip: ['bar'], cue: 'Overhand grip, shoulder-width. Pull until your chin clears the bar, lower all the way.', poses: [HANG, PULLTOP] },
    chinup: { name: 'Chin-ups', cat: 'back', r: [3, 4, 5], tp: 4, equip: ['bar'], cue: 'Underhand grip, hands shoulder-width. Pull your chest toward the bar, lower slowly.', poses: [HANG, P(PULLTOP, { t: [-1, -34], hn: [7, -40], hf: [6, -40] })] },
    negative_pullup: { name: 'Slow negative pull-ups', cat: 'back', r: [3, 4, 5], tp: 7, equip: ['bar'], cue: 'Jump or step to the top position, then take 5 seconds to lower to a dead hang.', poses: [PULLTOP, PULLMID, HANG] },
    chin_hold: { name: 'Chin-over-bar hold', cat: 'back', u: 'sec', r: [15, 20, 25], equip: ['bar'], cue: 'Hold the top of a chin-up, chin above the bar, shoulders down away from your ears.', poses: [PULLTOP] },
    db_row: { name: 'Bent-over dumbbell rows', cat: 'back', r: [12, 12, 15], tp: 3, load: 'heavy', cue: 'Hinge forward with a flat back. Pull both dumbbells to your lower ribs, squeeze, lower.', poses: [P(HINGE, { hn: [27, 11], hf: [25, 11], db: 'nf' }), P(HINGE, { hn: [13, -5], hf: [12, -5], eh: [-1, -1], db: 'nf' })] },
    one_arm_row: { name: 'One-arm dumbbell row', cat: 'back', r: [10, 12, 12], side: 1, tp: 3, load: 'heavy', cue: 'Split stance, free hand on your front knee. Row the dumbbell to your hip, elbow close.', poses: [P(STAG, { hn: [30, 15], db: 'n' }), P(STAG, { hn: [14, -3], ehn: [-1, -1], db: 'n' })] },
    renegade_row: { name: 'Renegade rows', cat: 'back', r: [8, 10, 12], alt: 1, tp: 4, lv: 2, load: 'medium', cue: 'Plank on two dumbbells, feet wide. Row one to your hip without twisting, alternate.', poses: [P(PLANK, { hn: [30, 13], hf: [33, 13], db: 'nf' }), P(PLANK, { hn: [16, -2], ehn: [-1, -1], hf: [33, 13], db: 'nf' })] },
    kb_high_pull: { name: 'Kettlebell high pull', cat: 'back', r: [12, 15, 15], tp: 2.5, load: 'kb', cue: 'Hinge with the bell between your feet, drive your hips through and pull it to chest height, elbows high.', poses: [
      { t: [24, -24], fn: [7, 37], ff: [5, 37], kh: [1, -0.3], hn: [20, 8], hf: [20, 8], kb: 'both', kbd: [0, 1] },
      { t: [-2, -34], fn: [1, 41], ff: [-1, 41], hn: [9, -27], hf: [9, -27], eh: [-1, -1], kb: 'both', kbd: [0, 1] }] },
    superman: { name: 'Supermans', cat: 'back', r: [12, 15, 18], tp: 2.5, cue: 'Face down, arms forward. Lift arms, chest and legs off the floor, pause, lower.', poses: [
      { t: [34, 0], hn: [67, 1], hf: [67, 2], fn: [-41, 1], ff: [-41, 2], mat: 1 },
      { t: [33, -7], hn: [64, -12], hf: [64, -11], fn: [-40, -8], ff: [-40, -7], mat: 1 }] },
    // ---------------- ABS ----------------
    crunch: { name: 'Crunches', cat: 'abs', r: [20, 25, 30], tp: 1.8, cue: 'Knees bent, fingertips at your temples. Curl your shoulders off the floor, lower slowly.', poses: [
      P(SUP, { hn: [41, -6], hf: [41, -6], eh: [0.3, -1] }), P(SUP, { t: [30, -16], hn: [36, -24], hf: [36, -24], eh: [1, -0.2] })] },
    situp: { name: 'Sit-ups', cat: 'abs', r: [12, 15, 20], tp: 2.8, cue: 'Knees bent, arms crossed on your chest. Sit all the way up, lower with control.', poses: [
      P(SUP, { hn: [26, -6], hf: [26, -6], eh: [0, 1] }), P(SUP, { t: [-5, -34], hn: [0, -24], hf: [0, -24], eh: [0.5, 1] })] },
    db_situp: { name: 'Weighted sit-ups', cat: 'abs', r: [10, 12, 15], tp: 3, lv: 2, load: 'single', cue: 'Hold one dumbbell against your chest and sit all the way up.', poses: [
      P(SUP, { hn: [26, -6], hf: [26, -6], eh: [0, 1], db: 'both' }), P(SUP, { t: [-5, -34], hn: [0, -24], hf: [0, -24], eh: [0.5, 1], db: 'both' })] },
    leg_raise: { name: 'Leg raises', cat: 'abs', r: [10, 12, 15], tp: 3, cue: 'On your back, legs straight. Raise them to vertical, lower until heels hover.', poses: [
      { t: [34, 0], hn: [4, 2], hf: [4, 2], eh: [0, -1], fn: [-41, -4], ff: [-41, -3], mat: 1 },
      { t: [34, 0], hn: [4, 2], hf: [4, 2], eh: [0, -1], fn: [1, -41], ff: [2, -41], mat: 1 }] },
    weighted_crunch: { name: 'Weighted crunches', cat: 'abs', r: [20, 25, 30], tp: 2, load: 'single', cue: 'Hold one dumbbell on your chest, knees bent. Curl your shoulders up, lower slowly.', poses: [
      P(SUP, { hn: [24, -5], hf: [24, -5], eh: [0, 1], db: 'both' }), P(SUP, { t: [30, -16], hn: [22, -20], hf: [22, -20], eh: [0.3, 1], db: 'both' })] },
    weighted_dead_bug: { name: 'Weighted dead bugs', cat: 'abs', r: [16, 20, 24], alt: 1, tp: 2.2, load: 'single', cue: 'Hold one dumbbell or the kettlebell over your chest with straight arms. Lower one leg at a time to hover, back flat.', poses: [
      { t: [34, 0], hn: [35, -33], hf: [35, -33], db: 'both', fn: [-20, -21], khn: [0.3, -1], ff: [-40, -7], mat: 1 },
      { t: [34, 0], hn: [35, -33], hf: [35, -33], db: 'both', fn: [-40, -7], ff: [-20, -21], khf: [0.3, -1], mat: 1 }] },
    db_side_bend: { name: 'Dumbbell side bends', cat: 'abs', view: 'front', r: [12, 15, 15], side: 1, tp: 2.5, load: 'single', cue: 'Stand tall with one heavy dumbbell at your side. Bend sideways toward it, then pull yourself upright with your obliques. Switch sides.', poses: [
      { t: [0, -34], hn: [-12, 0], hf: [10, -4], ehf: [1, 0.3], fn: [-10, 41], ff: [10, 41], db: 'n' },
      { t: [-9, -33], hn: [-19, 4], hf: [9, -4], ehf: [1, 0.3], fn: [-10, 41], ff: [10, 41], db: 'n' }] },
    weighted_toe_touch: { name: 'Weighted toe touches', cat: 'abs', r: [12, 15, 20], tp: 2.2, load: 'single', cue: 'Legs straight up, one dumbbell in both hands. Reach it up toward your toes, lifting your shoulders.', poses: [
      { t: [34, 0], hn: [34, -33], hf: [34, -33], db: 'both', fn: [1, -41], ff: [2, -41], mat: 1 },
      { t: [29, -18], hn: [8, -41], hf: [8, -41], db: 'both', fn: [1, -41], ff: [2, -41], mat: 1 }] },
    plank: { name: 'Forearm plank', cat: 'abs', u: 'sec', r: [40, 50, 60], cue: 'Elbows under shoulders, squeeze glutes, body straight from head to heels.', poses: [FOREARM] },
    side_plank: { name: 'Side plank', cat: 'abs', u: 'sec', r: [20, 30, 40], side: 1, cue: 'On one forearm, feet stacked, hips high. Top arm reaches up. Switch sides.', poses: [P(FOREARM, { hf: [34, -41], ehf: [0, -1] })] },
    bicycle_crunch: { name: 'Bicycle crunches', cat: 'abs', r: [20, 24, 30], alt: 1, tp: 1.3, cue: 'Shoulders up, bring one knee in while the other leg extends. Rotate elbow toward knee.', poses: [
      { t: [30, -16], hn: [36, -24], hf: [36, -24], eh: [1, -0.2], fn: [-14, -19], khn: [1, -1], ff: [-40, -9], mat: 1 },
      { t: [30, -16], hn: [36, -24], hf: [36, -24], eh: [1, -0.2], ff: [-14, -19], khf: [1, -1], fn: [-40, -9], mat: 1 }] },
    russian_twist: { name: 'Russian twists', cat: 'abs', r: [20, 24, 30], alt: 1, tp: 1.3, load: 'single', cue: 'Sit back with feet up, hold a dumbbell and touch it to the floor beside each hip.', poses: [
      P(VSEAT, { hn: [4, 2], hf: [4, 2], db: 'both' }), P(VSEAT, { hn: [11, -15], hf: [11, -15], eh: [0, 1], db: 'both' })] },
    flutter_kicks: { name: 'Flutter kicks', cat: 'abs', r: [20, 30, 40], alt: 1, tp: 0.8, cue: 'Lower back pressed down, legs straight, small fast kicks just above the floor.', poses: [
      { t: [34, 0], hn: [4, 2], hf: [4, 2], eh: [0, -1], fn: [-40, -12], ff: [-41, -2], mat: 1 },
      { t: [34, 0], hn: [4, 2], hf: [4, 2], eh: [0, -1], ff: [-40, -12], fn: [-41, -2], mat: 1 }] },
    hollow_hold: { name: 'Hollow hold', cat: 'abs', u: 'sec', r: [20, 30, 40], cue: 'Lower back glued to the floor, arms and legs long and lifted. Hold.', poses: [{ t: [33, -8], hn: [64, -17], hf: [64, -16], fn: [-40, -9], ff: [-40, -8], mat: 1 }] },
    v_up: { name: 'V-ups', cat: 'abs', r: [8, 10, 12], tp: 3, lv: 2, cue: 'From flat, lift straight arms and legs at the same time and reach for your toes.', poses: [
      { t: [34, 0], hn: [67, -2], hf: [67, -1], fn: [-41, -2], ff: [-41, -1], mat: 1 },
      { t: [18, -29], hn: [-13, -38], hf: [-13, -37], fn: [-24, -33], ff: [-24, -32], mat: 1 }] },
    dead_bug: { name: 'Dead bugs', cat: 'abs', r: [12, 16, 20], alt: 1, tp: 2, cue: 'Arms up, knees bent at 90°. Lower opposite arm and leg to the floor, switch.', poses: [
      { t: [34, 0], hn: [64, -8], hf: [35, -33], fn: [-20, -21], khn: [0.3, -1], ff: [-40, -7], mat: 1 },
      { t: [34, 0], hn: [35, -33], hf: [64, -8], fn: [-40, -7], ff: [-20, -21], khf: [0.3, -1], mat: 1 }] },
    mountain_climber: { name: 'Mountain climbers', cat: 'abs', r: [20, 30, 40], alt: 1, tp: 0.8, cue: 'High plank, drive knees to your chest one after the other, hips level.', poses: [P(PLANK, { fn: [8, 16], khn: [1, 0] }), P(PLANK, { ff: [8, 16], khf: [1, 0] })] },
    shoulder_taps: { name: 'Plank shoulder taps', cat: 'abs', r: [16, 20, 24], alt: 1, tp: 1.3, cue: 'High plank, feet wide. Tap each hand to the opposite shoulder without rocking.', poses: [PLANK, P(PLANK, { hn: [26, -8], ehn: [-0.2, 1] })] },
    reverse_crunch: { name: 'Reverse crunches', cat: 'abs', r: [12, 15, 18], tp: 2.5, cue: 'Knees bent at 90°, curl your hips off the floor toward your chest, lower slowly.', poses: [
      { t: [34, 0], hn: [4, 2], hf: [4, 2], eh: [0, -1], fn: [-20, -21], ff: [-21, -21], kh: [0.3, -1], mat: 1 },
      { t: [33, 8], hd: [1, 0], hn: [8, 10], hf: [8, 10], eh: [0, -1], fn: [4, -26], ff: [3, -26], kh: [1, -0.4], mat: 1 }] },
    toe_touch: { name: 'Toe-touch crunches', cat: 'abs', r: [12, 15, 20], tp: 2, cue: 'Legs straight up, reach your hands to your toes, lifting shoulders off the floor.', poses: [
      { t: [34, 0], hn: [34, -33], hf: [35, -33], fn: [1, -41], ff: [2, -41], mat: 1 },
      { t: [29, -18], hn: [6, -41], hf: [7, -41], fn: [1, -41], ff: [2, -41], mat: 1 }] },
    bird_dog: { name: 'Bird dogs', cat: 'abs', r: [12, 16, 20], alt: 1, tp: 2.5, cue: 'On all fours, reach one arm forward and the opposite leg back, pause, switch.', poses: [
      { t: [32, -12], hn: [32, 21], hf: [34, 21], fn: [-20, 21], ff: [-21, 21], kh: [0.5, 1], mat: 1 },
      { t: [32, -12], hn: [65, -15], hf: [34, 21], fn: [-20, 21], ff: [-41, -3], kh: [0.5, 1], mat: 1 }] },
    knee_tuck: { name: 'Seated knee tucks', cat: 'abs', r: [12, 15, 20], tp: 2.5, cue: 'Sit back on your hands, feet off the floor. Pull knees to chest, extend legs long.', poses: [
      { t: [-17, -29], hn: [-25, 3], hf: [-26, 3], eh: [1, 0], fn: [39, -8], ff: [39, -7], mat: 1 },
      { t: [-15, -30], hn: [-25, 3], hf: [-26, 3], eh: [1, 0], fn: [12, -12], ff: [12, -11], kh: [0.2, -1], mat: 1 }] },
    // ---------------- CARDIO ----------------
    jumping_jacks: { name: 'Jumping jacks', cat: 'cardio', view: 'front', r: [30, 40, 50], tp: 0.8, cue: 'Jump feet wide while arms go overhead, jump back together.', poses: [
      FSTAND, { t: [0, -34], hn: [-22, -62], hf: [22, -62], fn: [-20, 38], ff: [20, 38], lift: 4 }] },
    high_knees: { name: 'High knees', cat: 'cardio', r: [30, 40, 50], alt: 1, tp: 0.6, cue: 'Run on the spot, knees to hip height, pump your arms.', poses: [
      { t: [2, -34], fn: [21, 20], khn: [1, -1], ff: [0, 41], hn: [12, -20], ehn: [0, 1], hf: [-10, -10], ehf: [-1, 0.3] },
      { t: [2, -34], ff: [21, 20], khf: [1, -1], fn: [0, 41], hf: [12, -20], ehf: [0, 1], hn: [-10, -10], ehn: [-1, 0.3] }] },
    burpee: { name: 'Burpees', cat: 'cardio', r: [8, 10, 12], tp: 4, cue: 'Squat, hands down, jump feet back to a plank, jump them in, jump up with arms overhead.', poses: [BSQ, P(PLANK, { mat: 0 }), JUMP] },
    squat_jump: { name: 'Squat jumps', cat: 'cardio', r: [10, 12, 15], tp: 2.5, cue: 'Squat until thighs are near parallel, explode up, land soft into the next rep.', poses: [P(SQUAT, { hn: [-4, 6], hf: [-6, 6] }), JUMP] },
    jump_lunge: { name: 'Jump lunges', cat: 'cardio', r: [12, 16, 20], alt: 1, tp: 2, lv: 2, cue: 'From a lunge, jump and switch legs in the air, land in a lunge on the other side.', poses: [LUNGE_N, LUNGE_F] },
    butt_kicks: { name: 'Butt kicks', cat: 'cardio', r: [30, 40, 50], alt: 1, tp: 0.6, cue: 'Jog on the spot, kicking your heels up toward your glutes.', poses: [
      { t: [2, -34], fn: [-7, 7], khn: [0.2, 1], ff: [0, 41], hn: [10, -14], ehn: [0, 1], hf: [-8, -8] },
      { t: [2, -34], ff: [-7, 7], khf: [0.2, 1], fn: [0, 41], hf: [10, -14], ehf: [0, 1], hn: [-8, -8] }] },
    punches: { name: 'Fast punches', cat: 'cardio', r: [30, 40, 50], alt: 1, tp: 0.6, cue: 'Boxing stance, hands up. Throw fast straight punches, left and right, back to guard.', poses: [
      { t: [0, -34], hn: [9, -36], hf: [7, -38], eh: [0, 1], fn: [10, 40], ff: [-12, 39] },
      { t: [1, -34], hn: [34, -36], hf: [7, -38], ehf: [0, 1], fn: [10, 40], ff: [-12, 39] }] },
    squat_thrust: { name: 'Squat thrusts', cat: 'cardio', r: [10, 12, 15], tp: 2.8, cue: 'Hands down, jump feet back to a plank, jump them back in. Keep the pace up.', poses: [BSQ, P(PLANK, { mat: 0 })] },
    kb_swing: { name: 'Kettlebell swings', cat: 'cardio', r: [15, 20, 25], tp: 2, load: 'kb', cue: 'Hike the bell back between your legs, snap your hips forward to float it to chest height.', poses: [SWING_LOW, { t: [-3, -34], fn: [1, 41], ff: [-1, 41], hn: [30, -36], hf: [30, -36], kb: 'both' }] },
    // ---------------- UPPER ----------------
    db_shoulder_press: { name: 'Dumbbell shoulder press', cat: 'upper', view: 'front', r: [10, 12, 12], tp: 3, load: 'medium', cue: 'Dumbbells at shoulder height, brace your core and press straight overhead.', poses: [
      P(FSTAND, { hn: [-17, -38], hf: [17, -38], ehn: [-1, 1], ehf: [1, 1], db: 'nf' }), P(FSTAND, { hn: [-12, -65], hf: [12, -65], db: 'nf' })] },
    lateral_raise: { name: 'Lateral raises', cat: 'upper', view: 'front', r: [12, 12, 15], tp: 3, load: 'light', cue: 'Soft elbows, raise the dumbbells out to the sides to shoulder height, lower slowly.', poses: [
      P(FSTAND, { db: 'nf' }), P(FSTAND, { hn: [-41, -29], hf: [41, -29], db: 'nf' })] },
    db_curl: { name: 'Dumbbell curls', cat: 'upper', r: [10, 12, 12], tp: 3, load: 'medium', cue: 'Palms forward, elbows pinned to your sides. Curl up, lower slowly.', poses: [
      P(STAND, { db: 'nf' }), P(STAND, { hn: [8, -30], hf: [6, -30], eh: [-0.2, 1], db: 'nf' })] },
    hammer_curl: { name: 'Hammer curls', cat: 'upper', r: [10, 12, 12], tp: 3, load: 'medium', cue: 'Palms facing each other, elbows still. Curl to your shoulders and lower.', poses: [
      P(STAND, { db: 'nf' }), P(STAND, { hn: [8, -30], hf: [6, -30], eh: [-0.2, 1], db: 'nf' })] },
    db_skullcrusher: { name: 'Lying triceps extensions', cat: 'upper', r: [10, 12, 12], tp: 3, load: 'light', cue: 'Lying down, arms up. Bend only at the elbows to lower the dumbbells beside your head.', poses: [
      P(SUP, { hn: [34, -33], hf: [35, -33], db: 'nf' }), P(SUP, { hn: [45, -8], hf: [46, -8], eh: [0, -1], db: 'nf' })] },
    overhead_triceps_ext: { name: 'Overhead triceps extension', cat: 'upper', r: [10, 12, 15], tp: 3, load: 'single', cue: 'Hold one dumbbell overhead with both hands, lower it behind your head, extend.', poses: [
      P(STAND, { hn: [2, -67], hf: [2, -67], db: 'both' }), P(STAND, { hn: [-9, -42], hf: [-9, -42], eh: [0.4, -1], db: 'both' })] },
    db_kickback: { name: 'Dumbbell kickbacks', cat: 'upper', r: [12, 12, 15], tp: 2.8, load: 'light', cue: 'Hinge forward, upper arms pinned to your sides. Straighten your elbows to push the dumbbells back.', poses: [
      P(HINGE, { hn: [13, 6], hf: [12, 6], eh: [-1, -1], db: 'nf' }), P(HINGE, { hn: [-2, -8], hf: [-3, -8], eh: [-1, -1], db: 'nf' })] },
    pike_pushup: { name: 'Pike push-ups', cat: 'upper', r: [8, 10, 12], tp: 3, cue: 'Hips high in an upside-down V. Bend your elbows to bring your head toward the floor.', poses: [
      { t: [28.7, 18.3], hn: [56.5, 36], hf: [58, 36], fn: [-19.6, 36], ff: [-21, 36], mat: 1 },
      { t: [25, 23], hn: [44, 36], hf: [45, 36], eh: [-1, -1], fn: [-19.6, 36], ff: [-21, 36], mat: 1 }] },
    kb_press: { name: 'Kettlebell press', cat: 'upper', r: [6, 8, 8], side: 1, tp: 3, load: 'kb', cue: 'Bell racked at your shoulder, press it overhead until your arm is straight. Switch sides.', poses: [RACK, PRESS_UP] },
    db_front_raise: { name: 'Front raises', cat: 'upper', r: [10, 12, 12], tp: 3, load: 'light', cue: 'Straight arms, lift the dumbbells in front of you to shoulder height, lower slowly.', poses: [
      P(STAND, { db: 'nf' }), P(STAND, { hn: [33, -36], hf: [33, -36], db: 'nf' })] },
    kb_clean_press: { name: 'Kettlebell clean & press', cat: 'full', r: [5, 6, 8], side: 1, tp: 5, lv: 2, load: 'kb', cue: 'Swing the bell up into the rack at your shoulder, press overhead, lower back down. Switch sides.', poses: [
      { t: [24, -24], fn: [7, 37], ff: [5, 37], kh: [1, -0.3], hn: [14, 8], hf: [26, 2], kb: 'n' }, RACK, PRESS_UP] },
    db_thruster: { name: 'Dumbbell thrusters', cat: 'full', r: [10, 12, 12], tp: 3.5, load: 'medium', cue: 'Squat with dumbbells at your shoulders, drive up and press them overhead in one move.', poses: [
      P(SQUAT, { hn: [21, -34], hf: [20, -34], eh: [0.6, 1], db: 'nf' }), P(STAND, { hn: [2, -67], hf: [1, -67], db: 'nf' })] },
    // ---------------- LOWER ----------------
    goblet_squat: { name: 'Goblet squats', cat: 'lower', r: [12, 15, 15], tp: 3, load: 'kb', cue: 'Hold the bell by the horns at your chest. Sit down between your heels, chest up, stand.', poses: [
      P(STAND, { hn: [8, -24], hf: [8, -24], eh: [0.3, 1], kb: 'both', kbd: [0, 1] }),
      { t: [12, -32], fn: [18, 20], ff: [16, 20], kh: [1, -1], hn: [20, -22], hf: [20, -22], eh: [0.3, 1], kb: 'both', kbd: [0, 1] }] },
    db_lunge: { name: 'Dumbbell lunges', cat: 'lower', r: [16, 20, 20], alt: 1, tp: 2.8, load: 'medium', cue: 'Step forward and lower until both knees are at 90°, push back. Alternate legs.', poses: [P(STAND, { db: 'nf' }), P(LUNGE_N, { hn: [1, -1], hf: [-1, -1], db: 'nf' })] },
    reverse_lunge: { name: 'Reverse lunges', cat: 'lower', r: [16, 20, 24], alt: 1, tp: 2.5, cue: 'Step back and lower the back knee toward the floor, drive through the front heel.', poses: [P(STAND, HANDS_HIPS), P(LUNGE_F, HANDS_HIPS)] },
    split_squat: { name: 'Dumbbell split squats', cat: 'lower', r: [10, 12, 12], side: 1, tp: 3, load: 'medium', cue: 'Long split stance, dumbbells at your sides. Lower the back knee toward the floor, stand up. Switch legs.', poses: [
      { t: [0, -34], fn: [14, 39], ff: [-24, 34], khf: [0.3, 1], hn: [1, -1], hf: [-1, -1], db: 'nf' }, P(LUNGE_N, { hn: [1, -1], hf: [-1, -1], db: 'nf' })] },
    db_squat: { name: 'Dumbbell squats', cat: 'lower', r: [15, 15, 18], tp: 3, load: 'heavy', cue: 'Dumbbells hanging at your sides, feet shoulder-width. Sit down until thighs are parallel, drive up.', poses: [
      P(STAND, { db: 'nf' }), { t: [15, -30], fn: [14, 26], ff: [12, 26], kh: [1, -0.8], hn: [17, 2], hf: [16, 2], db: 'nf' }] },
    db_rdl: { name: 'Romanian deadlifts', cat: 'lower', r: [12, 12, 15], tp: 3, load: 'heavy', cue: 'Soft knees, push your hips back and slide the dumbbells down your thighs, stand tall.', poses: [
      P(STAND, { hn: [5, -1], hf: [4, -1], db: 'nf' }), { t: [30, -16], fn: [4, 40], ff: [2, 40], hn: [31, 17], hf: [30, 17], db: 'nf' }] },
    single_leg_rdl: { name: 'Single-leg deadlifts', cat: 'lower', r: [8, 10, 10], side: 1, tp: 3.5, lv: 2, load: 'medium', cue: 'Balance on one leg, hinge forward as the other leg lifts behind you, stand up. Switch.', poses: [
      P(STAND, { hn: [4, -1], hf: [2, -1], db: 'n' }), { t: [33, -8], ff: [2, 41], hn: [33, 25], hf: [31, 24], fn: [-40, -7], db: 'n' }] },
    kb_sumo_deadlift: { name: 'Kettlebell sumo deadlift', cat: 'lower', view: 'front', r: [12, 15, 15], tp: 2.5, load: 'kb', cue: 'Wide stance, toes out. Grip the bell between your feet, flat back, stand up tall.', poses: [
      { t: [0, -24], hn: [-3, 10], hf: [3, 10], fn: [-20, 24], ff: [20, 24], kb: 'both', kbd: [0, 1] },
      { t: [0, -34], hn: [-3, 0], hf: [3, 0], fn: [-20, 37], ff: [20, 37], kb: 'both', kbd: [0, 1] }] },
    glute_bridge: { name: 'Glute bridges', cat: 'lower', r: [15, 20, 20], tp: 2, cue: 'Feet flat, knees bent. Drive your hips up until knees, hips and shoulders line up.', poses: [GB_DOWN, GB_UP] },
    single_leg_bridge: { name: 'Single-leg glute bridges', cat: 'lower', r: [10, 12, 12], side: 1, tp: 2.5, cue: 'One foot planted, other leg straight. Lift your hips high, lower. Switch sides.', poses: [P(GB_DOWN, { fn: [-29, -29] }), P(GB_UP, { fn: [-38, -14] })] },
    wall_sit: { name: 'Wall sit', cat: 'lower', u: 'sec', r: [40, 50, 60], cue: 'Back flat against a wall, thighs parallel to the floor. Hold.', poses: [{ t: [0, -34], fn: [21, 20], ff: [19, 20], kh: [1, -1], hn: [14, -3], hf: [12, -3], wall: -6 }] },
    lateral_lunge: { name: 'Lateral lunges', cat: 'lower', view: 'front', r: [12, 16, 16], alt: 1, tp: 3, load: 'kb', cue: 'Hold the bell at your chest, step wide to one side and sit back on that leg. Alternate.', poses: [
      { t: [0, -34], hn: [-3, -22], hf: [3, -22], ehn: [-0.3, 1], ehf: [0.3, 1], kb: 'both', kbd: [0, 1], fn: [-8, 41], ff: [8, 41] },
      { t: [-3, -30], hn: [-6, -18], hf: [0, -18], ehn: [-0.3, 1], ehf: [0.3, 1], kb: 'both', kbd: [0, 1], fn: [-9, 26], ff: [36, 26], khn: [-1, -0.2] }] },
  };

  const LOAD = {
    light: 'Dumbbells 6–8 kg',
    medium: 'Dumbbells 8–12 kg',
    heavy: 'Dumbbells 12–16 kg',
    single: 'One dumbbell 10–14 kg',
    kb: 'Kettlebell',
  };

  // Level I starts at intermediate: shift each rep scheme up one level and extend the top.
  const LEVEL_OVERRIDE = { pullup: [4, 5, 6], chinup: [4, 5, 6], negative_pullup: [4, 5, 6], chin_hold: [20, 25, 30], kb_press: [8, 8, 10], kb_clean_press: [6, 8, 8], one_arm_row: [12, 12, 14], db_floor_press: [12, 15, 15], db_pullover: [12, 15, 15], db_row: [12, 15, 15], db_rdl: [12, 15, 15] };
  Object.keys(EX).forEach((k) => {
    const e = EX[k];
    e.id = k; e.u = e.u || 'reps'; e.lv = 1;
    if (LEVEL_OVERRIDE[k]) e.r = LEVEL_OVERRIDE[k];
    else if (['dive_bomber', 'db_kickback', 'split_squat', 'db_squat', 'weighted_crunch', 'weighted_dead_bug', 'db_side_bend', 'weighted_toe_touch'].includes(k)) { /* already set at the new levels */ }
    else {
      const top = e.r[2] * 1.1, step = e.alt ? 4 : top >= 20 ? 5 : top >= 12 ? 2 : 1;
      e.r = [e.r[1], e.r[2], e.u === 'sec' ? e.r[2] + 10 : Math.ceil(top / step - 1e-9) * step];
    }
  });

  const api = { EX, LOAD, figureSVG };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KB = api;
})(typeof window !== 'undefined' ? window : globalThis);

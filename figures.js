/* Kettle & Bar figure engine: draws exercise stick figures from poses, and the front/back muscle map.
   Pure drawing: knows nothing about which exercises exist. */
(function (root) {
  const W = 120, W2 = 160, H = 124, G = 116, BAR = 8; // W2: a picture with two figures (Phase 18)
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
        { k: 'line', a: c1, b: c2, w: 2.6 },
        { k: 'line', a: add(c1, mul(f, -4)), b: add(c1, mul(f, 4)), w: 5.6 },
        { k: 'line', a: add(c2, mul(f, -4)), b: add(c2, mul(f, 4)), w: 5.6 },
      ],
      pts: [[...add(c1, mul(f, 4)), 2.8], [...add(c1, mul(f, -4)), 2.8], [...add(c2, mul(f, 4)), 2.8], [...add(c2, mul(f, -4)), 2.8]],
    };
  }
  function propKB(h, dir) {
    const d = nrm(dir), ring = add(h, mul(d, 3)), bell = add(h, mul(d, 9.5));
    return {
      shapes: [
        { k: 'ring', c0: ring, r: 3.4, w: 2.2 },
        { k: 'dot', c0: bell, r: 6.6 },
      ],
      pts: [[...bell, 6.6], [...ring, 4.5]],
    };
  }

  // a partner (Phase 18): solved like any figure, mirrored when `flip`, then moved by `at` from the first one's hip
  function partnerOf(ps, front) {
    if (!ps.two) return null;
    const s = solve(ps.two, front), f = ps.two.flip ? -1 : 1, at = ps.two.at || [0, 0];
    return Object.fromEntries(Object.entries(s).map(([k, p]) => [k, [p[0] * f + at[0], p[1] + at[1]]]));
  }

  function frame(ps, front) {
    const s = solve(ps, front), s2 = partnerOf(ps, front);
    let wide = W;
    const fore = (el, ha) => nrm(sub(ha, el));
    const props = { far: [], near: [], both: [] };
    const pts = [];
    const P = (p, r) => pts.push([p[0], p[1], r]);
    [s.elN, s.haN, s.elF, s.haF, s.knN, s.ftN, s.knF, s.ftF].forEach((p) => P(p, 3.3));
    P(s.hip, 5); P(s.neck, 5); P(s.head, 7);
    if (s2) { [s2.elN, s2.haN, s2.elF, s2.haF, s2.knN, s2.ftN, s2.knF, s2.ftF].forEach((p) => P(p, 3.3)); P(s2.hip, 5); P(s2.neck, 5); P(s2.head, 7); }
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
    if (ps.wall !== undefined) { minX = Math.min(minX, ps.wall - 6); maxX = Math.max(maxX, ps.wall); }
    let dy = ps.bar ? BAR - (s.haN[1] + s.haF[1]) / 2 : G - maxY;
    dy -= ps.lift || 0;
    if (s2) wide = Math.max(W2, Math.ceil(maxX - minX + 8)); // a pair spread out widens its picture
    const dx = wide / 2 - (minX + maxX) / 2;
    return { s, s2, w: wide, props, dx, dy, minX, maxX, minY: minY + dy, ps, front };
  }

  const f1 = (n) => Math.round(n * 10) / 10;
  const pt = (p, fr) => [f1(p[0] + fr.dx), f1(p[1] + fr.dy)];

  // props (dumbbells, kettlebells) are drawn in the kit colour
  function shapeSVG(sh, fr) {
    const col = 'var(--kit)';
    if (sh.k === 'line') { const a = pt(sh.a, fr), b = pt(sh.b, fr); return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${col}" stroke-width="${sh.w}" stroke-linecap="round"/>`; }
    const c = pt(sh.c0, fr);
    if (sh.k === 'ring') return `<circle cx="${c[0]}" cy="${c[1]}" r="${sh.r}" fill="none" stroke="${col}" stroke-width="${sh.w}"/>`;
    return `<circle cx="${c[0]}" cy="${c[1]}" r="${sh.r}" fill="${col}"/>`; // dot
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
      out.push(`<line x1="2" y1="${G + 3}" x2="${fr.w - 2}" y2="${G + 3}" stroke="var(--ground)" stroke-width="1.2"/>`);
    }
    if (ps.wall !== undefined) {
      const x = f1(ps.wall + fr.dx);
      out.push(`<rect x="${f1(x - 6)}" y="6" width="6" height="${G + 2 - 6}" fill="var(--prop)" opacity=".55"/>`);
    }
    // the partner first, behind (Phase 18)
    const body = (b, col, far) => {
      out.push(line([b.hF, b.knF, b.ftF], 6.2, far), line([b.sF, b.elF, b.haF], 6.2, far));
      if (front) out.push(line([b.sN, b.sF], 7, col), line([b.hN, b.hF], 7, col));
      out.push(line([b.hip, b.neck], 10, col));
      const h = pt(b.head, fr);
      out.push(`<circle cx="${h[0]}" cy="${h[1]}" r="7" fill="${col}"/>`, line([b.hN, b.knN, b.ftN], 6.2, col), line([b.sN, b.elN, b.haN], 6.2, col));
    };
    if (fr.s2) body(fr.s2, 'var(--fig2)', front ? 'var(--fig2)' : 'var(--fig2-far)');
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
    const gap = 6, xs = frames.map((f, i) => frames.slice(0, i).reduce((x, g) => x + g.w + gap, 0));
    const w = xs[xs.length - 1] + frames[frames.length - 1].w;
    const top = Math.floor(Math.min(...frames.map((f) => (f.ps.bar ? Math.min(f.minY, 4) : f.minY) - 4)));
    const body = frames.map((fr, i) => `<g transform="translate(${xs[i]},0)">${frameSVG(fr)}</g>`).join('');
    return `<svg class="fig" viewBox="0 ${top} ${w} ${H + 4 - top}" role="img" aria-label="${label || ex.name}">${body}</svg>`;
  }


  /* ---------- Animation (exercise pages): the positions in a loop, there and back ---------- */
  const isPoint = (v) => Array.isArray(v) && typeof v[0] === 'number';
  // every point of a moves toward b by t; everything else (props, mat, bar) stays as in a
  function lerpPose(a, b, t) {
    const o = { ...a };
    Object.keys(b).forEach((k) => { if (isPoint(b[k]) && isPoint(a[k])) o[k] = [a[k][0] + (b[k][0] - a[k][0]) * t, a[k][1] + (b[k][1] - a[k][1]) * t]; });
    if (a.two && b.two) o.two = lerpPose(a.two, b.two, t); // the partner moves too (Phase 18)
    return o;
  }
  function animationFrames(ex, { steps = 14, label } = {}) {
    const P = ex.poses;
    if (P.length < 2) return [figureSVG(ex, label)];
    const seq = [...P, ...P.slice(1, -1).reverse()], out = [];
    seq.forEach((a, s) => {
      const b = seq[(s + 1) % seq.length];
      for (let i = 0; i < steps; i++) out.push(figureSVG({ ...ex, poses: [lerpPose(a, b, (1 - Math.cos((Math.PI * i) / steps)) / 2)] }, label));
    });
    // one viewBox for every frame, so the figure never jumps
    const boxes = out.map((f) => f.match(/viewBox="0 (-?[\d.]+) ([\d.]+) ([\d.]+)"/).slice(1).map(Number));
    const top = Math.min(...boxes.map((b) => b[0])), bottom = Math.max(...boxes.map((b) => b[0] + b[2]));
    return out.map((f, i) => f.replace(/viewBox="[^"]+"/, `viewBox="0 ${top} ${boxes[i][1]} ${bottom - top}"`));
  }

  /* ---------- Muscle map: front + back body, one shape per muscle group (left half, mirrored) ---------- */
  const SIL = [ // silhouette pieces, left half of a 200-wide figure
    'M100 68 L80 71 L58 78 L50 90 L53 130 L62 170 L65 204 L60 232 L100 238 Z', // torso
    'M52 82 L40 90 L33 128 L35 160 L48 161 L54 128 L59 96 Z', // upper arm
    'M35 158 L29 198 L27 232 L38 234 L45 200 L49 160 Z', // forearm
    'M60 230 L57 270 L61 320 L68 342 L89 342 L96 300 L100 238 Z', // thigh
    'M68 340 L63 380 L69 410 L85 410 L89 380 L89 340 Z', // lower leg
  ];
  const FRONT = {
    chest: 'M100 84 L80 80 Q62 84 58 98 Q62 118 80 122 Q94 122 100 116 Z',
    front_delts: 'M61 80 Q49 83 47 97 Q49 110 58 113 Q65 99 65 84 Z',
    side_delts: 'M50 84 Q40 90 38 104 L44 108 Q46 94 53 87 Z',
    biceps: 'M50 108 Q40 112 38 128 Q39 146 45 152 Q52 142 54 124 Q54 112 50 108 Z',
    forearms: 'M38 164 L32 196 L32 222 L40 222 L45 196 L47 164 Z',
    abs: 'M88 127 h11 v20 h-11 Z M88 150 h11 v20 h-11 Z M88 173 h11 v24 h-11 Z',
    obliques: 'M84 126 L68 132 L65 166 L70 196 L84 200 Z',
    hip_flexors: 'M86 206 L71 212 L75 232 L93 234 Z',
    quads: 'M64 244 Q59 282 69 330 L84 334 Q93 292 91 246 Z',
    adductors: 'M95 242 L88 250 L88 300 L97 290 L99 244 Z',
    calves: 'M68 348 Q64 366 69 392 L74 392 Q76 368 74 348 Z',
    shins: 'M78 350 Q81 372 78 398 L85 398 Q88 372 85 350 Z', // Phase 16
    neck: 'M100 55 L91 56 L92 70 L100 73 Z',
  };
  const BACK = {
    upper_back: 'M100 66 L84 73 L63 81 L76 97 L91 130 L100 134 Z',
    rear_delts: 'M60 81 Q50 84 48 96 Q50 106 58 106 Q62 94 64 85 Z',
    side_delts: 'M52 83 Q42 88 41 102 L47 106 Q49 94 55 86 Z',
    triceps: 'M50 108 Q40 112 38 128 Q39 146 45 152 Q52 142 54 124 Q54 112 50 108 Z',
    lats: 'M60 104 L61 140 L72 178 L90 170 L95 136 L79 110 Z',
    forearms: 'M38 164 L32 196 L32 222 L40 222 L45 196 L47 164 Z',
    lower_back: 'M99 140 L91 141 L86 196 L99 202 Z',
    glutes: 'M100 208 L78 204 Q62 212 62 236 Q70 258 92 256 Q100 252 100 244 Z',
    hamstrings: 'M64 262 L66 320 L80 334 L94 330 L96 262 Z',
    calves: 'M68 346 Q62 366 70 392 L84 392 Q90 366 86 346 Z',
    neck: 'M100 56 L92 57 L92 66 L100 66 Z', // Phase 16
    traps: 'M100 64 L92 64 L66 79 L84 75 L100 74 Z',
  };
  // muscleMapSVG(primary[], secondary[], label): an exercise's main and secondary muscles.
  // muscleMapSVG({ muscle: load }, label): a heat map in 4 shades by share of the biggest load.
  function muscleMapSVG(a, b, c) {
    let cls, tag = () => '', label = c;
    if (Array.isArray(a)) cls = (m) => (a.includes(m) ? 'mm-p' : b.includes(m) ? 'mm-s' : 'mm-o');
    else {
      const max = Math.max(0, ...Object.values(a));
      cls = (m) => (a[m] > 0 ? 'mm-l' + Math.ceil((a[m] / max) * 4) : 'mm-o');
      tag = (m) => ` data-m="${m}"`; label = b;
    }
    const half = (parts) => parts.map(([m, d]) => `<path d="${d}"${tag(m)} class="${cls(m)}"/>`).join('');
    const view = (map, x, title) => {
      const parts = Object.entries(map);
      const left = SIL.map((d) => `<path d="${d}" class="mm-body"/>`).join('') + half(parts);
      return `<g transform="translate(${x},0)"><circle cx="100" cy="36" r="22" class="mm-body"/><rect x="90" y="54" width="20" height="18" rx="6" class="mm-body"/>
        <g>${left}</g><g transform="translate(200,0) scale(-1,1)">${left}</g>
        <text x="100" y="440" text-anchor="middle" class="mm-t">${title}</text></g>`;
    };
    return `<svg class="mm" viewBox="0 0 420 452" role="img" aria-label="${label || 'Muscles worked'}">${view(FRONT, 0, 'Front')}${view(BACK, 220, 'Back')}</svg>`;
  }

  const api = { figureSVG, muscleMapSVG, animationFrames };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBFig = api;
})(typeof window !== 'undefined' ? window : globalThis);

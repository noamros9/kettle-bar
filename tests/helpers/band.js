// A day's minutes against its band, up to 10% past either end (Noam, 9 Oct 2026: widen the check, never rework the
// builder; Phase 36 ticket 3: dealing couple days in order moved a few days a minute or two)
const inBand = (est, [lo, hi]) => est >= Math.floor(lo * 0.9) && est <= Math.ceil(hi * 1.1);
module.exports = { inBand };

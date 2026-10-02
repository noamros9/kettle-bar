/* Chart helpers for the Stats page (architecture review IV ticket 1: moved out of page code so they can be tested).
   Pure: numbers in, numbers out.
     axis(values, { max?, step? }) -> { max, step, ticks }   a y axis from 0 that fits the values: steps of 15, 30, 60 or
       120 by the top value (at least 10), unless given; max is the top rounded up to a step; ticks every step
     shares(values) -> [0..1] each value as a share of the largest (all 0 when none is above 0): bar lengths */
(function (root) {
  function axis(values, { max: fixed, step: given } = {}) {
    const top = fixed || Math.max(10, ...values);
    const step = given || (top <= 60 ? 15 : top <= 150 ? 30 : top <= 300 ? 60 : 120);
    const max = Math.ceil(top / step) * step;
    return { max, step, ticks: Array.from({ length: max / step + 1 }, (_, i) => i * step) };
  }
  function shares(values) {
    const top = Math.max(0, ...values);
    return values.map((v) => (top > 0 ? v / top : 0));
  }
  const api = { axis, shares };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBCharts = api;
})(typeof window !== 'undefined' ? window : globalThis);

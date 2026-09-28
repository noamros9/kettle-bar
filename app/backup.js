/* Backup: the progress file you download from Settings and can import again.
   Pure: no page, no storage. Settings (main.js) reads the Progress Store and does the download.

     exportProgress({ programId: { day: time } }, { now }) -> file
     fileName(date) -> 'kettle-bar-progress-YYYY-MM-DD.json'

   File: { format: 'kettle-bar-progress', version: 1, exportedAt, programs: { programId: { day: time } } } */
(function (root) {
  const FORMAT = 'kettle-bar-progress';
  const VERSION = 1;

  function exportProgress(done, { now = () => new Date().toISOString() } = {}) {
    const programs = {};
    Object.entries(done).forEach(([pid, days]) => { programs[pid] = { ...days }; });
    return { format: FORMAT, version: VERSION, exportedAt: now(), programs };
  }

  const pad = (n) => String(n).padStart(2, '0');
  const fileName = (d) => `${FORMAT}-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;

  const api = { exportProgress, fileName, FORMAT, VERSION };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBBackup = api;
})(typeof window !== 'undefined' ? window : globalThis);

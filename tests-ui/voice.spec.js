// Voice cues through the phone's speech, recorded by a stand-in; on by default, with a Settings switch.
const { test, expect } = require('./fixtures.js');

test.beforeEach(async ({ app }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  await app.page.addInitScript(() => {
    window.__said = [];
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    Object.defineProperty(window, 'speechSynthesis', { value: { speak: (u) => window.__said.push(u.text), cancel() {} } });
  });
  await app.page.clock.install();
});

async function runSideHold(app) {
  const h = await app.data(() => {
    const p = PROGRAMS[0], EX = KBEx.EX;
    for (const d of p.days) for (const [bi, b] of d.blocks.entries()) {
      const i = b.items.findIndex((it) => EX[it.ex].u === 'sec' && EX[it.ex].side);
      if ((b.format || 'straight') === 'straight' && i >= 0) return { day: d.day, n: b.items[i].n };
    }
  });
  await app.go(`#p-three-split-60-d${h.day}`);
  await app.page.getByRole('button', { name: new RegExp(`Start set 1 · ${h.n} s each side`) }).first().click();
  await app.page.clock.runFor((3 + h.n + 5 + h.n + 1) * 1000);
  return app.data(() => window.__said);
}

test('a one-side hold says halfway, switch sides, halfway, done', async ({ app }) => {
  await app.open('#programs');
  expect(await runSideHold(app)).toEqual(['Halfway', 'Switch sides', 'Halfway', 'Done']);
});

test('the Settings switch turns voice off, and stays off after a reload', async ({ app }) => {
  await app.open('#settings');
  const sw = app.page.getByRole('switch', { name: 'Voice cues' });
  await expect(sw).toBeChecked();
  await sw.click();
  await expect(sw).not.toBeChecked();
  await app.page.reload(); await app.page.locator('#app h1').waitFor();
  await expect(app.page.getByRole('switch', { name: 'Voice cues' })).not.toBeChecked();
  expect(await runSideHold(app)).toEqual([]);
});

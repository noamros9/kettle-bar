// Boxing bouts: one Start runs every 3-minute bout with its rest; the voice calls each combo; the combo's drawing shows.
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

test('Start runs every bout: combos called, a minute of rest between, then the rest before abs', async ({ app }) => {
  await app.open('#p-fight-camp-d1');
  const b = await app.data(() => {
    const d = programs.day('fight-camp', 1), b = d.blocks[0];
    return { n: b.items.length, first: KBEx.EX[b.items[0].ex], total: b.items.length * 180 + (b.items.length - 1) * 60 + 5 };
  });
  await expect(app.page.locator('.block').filter({ hasText: 'Bout 1' }).first()).toContainText(`${b.n} bouts of 3 min`);
  await app.page.locator('[data-run="0"]').click();
  await expect(app.page.locator('#tlabel')).toHaveText(`Get ready · ${b.first.name}`);
  await expect(app.page.locator('#tsub')).toHaveText(`Bout 1 of ${b.n}`);
  await expect(app.page.locator('#tfig svg.fig')).toBeVisible();
  await app.page.clock.runFor(6000);
  await expect(app.page.locator('#tlabel')).toHaveText(b.first.name);
  await app.page.clock.runFor((b.total - 6 + 1) * 1000);
  await expect(app.page.locator('[data-run="0"]')).toHaveText('✓ Done · run again');
  await expect(app.page.locator('#tlabel')).toHaveText('Rest · abs next');
  const said = await app.data(() => window.__said);
  expect(said[0]).toBe(`Bout 1: ${b.first.call}`);
  expect(said.filter((x) => /^Bout \d+:/.test(x))).toHaveLength(b.n);
  expect(said.filter((x) => x === 'Rest')).toHaveLength(b.n - 1);
  expect(said.at(-1)).toBe('Done');
});

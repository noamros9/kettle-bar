// Big timer (Phase 7): a full-screen clock for timed blocks: time, pose or combo name, drawing, what's next.
// The timer keeps running underneath; tap, the close button or Escape leave.
const { test, expect } = require('./fixtures.js');

test.beforeEach(async ({ app }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  await app.page.addInitScript(() => {
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    Object.defineProperty(window, 'speechSynthesis', { value: { speak() {}, cancel() {} } });
  });
  await app.page.clock.install();
});

const big = (page) => ({ root: page.locator('#bgt'), time: page.locator('#bttime'), label: page.locator('#btlabel'), next: page.locator('#btnextl'), fig: page.locator('#btfig svg.fig') });

test('a flow: the big timer counts down, the pose changes, close leaves the timer running', async ({ app }) => {
  const { page } = app;
  await app.open('#p-sun-and-strength-d1');
  const ph = await app.data(() => {
    const d = programs.day('sun-and-strength', 1), s = KBSession.createSession(programs.get('sun-and-strength'), d, { EX: KBEx.EX });
    return s.plan({ type: 'block', bi: 0 }).phases;
  });
  const b = big(page);
  await expect(page.locator('[data-run="0"]')).toBeVisible();
  await expect(page.locator('[data-run="0"] + [data-bt]')).toHaveText(/Big timer/);
  await page.locator('[data-run="0"]').click();
  await page.locator('[data-run="0"] + [data-bt]').click();
  await expect(b.root).toBeVisible();
  await expect(b.label).toHaveText(ph[0].label);
  await expect(b.next).toHaveText(ph[1].label);
  await expect(b.fig).toBeVisible();
  await expect(b.time).toHaveText('0:05');
  await page.clock.runFor(2000);
  await expect(b.time).toHaveText('0:03');
  await page.clock.runFor(4000);
  await expect(b.label).toHaveText(ph[1].label);
  expect(ph[1].label).not.toBe(ph[0].label);
  expect(await app.sidewaysScroll()).toBe(0);
  // close by tapping anywhere; the timer underneath kept running
  await b.label.click();
  await expect(b.root).toBeHidden();
  await expect(page.locator('#tlabel')).toHaveText(ph[1].label);
  await expect(page.locator('#tgo')).toHaveText('Pause');
  // Escape and the close button also leave
  await page.locator('[data-run="0"] + [data-bt]').click();
  await expect(b.root).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(b.root).toBeHidden();
  await page.locator('#tbt').click();
  await expect(b.root).toBeVisible();
  await page.locator('#btx').click();
  await expect(b.root).toBeHidden();
});

test('bouts: the combo name and the next bout show, and the phase moves on while open', async ({ app }) => {
  const { page } = app;
  await app.open('#p-fight-camp-d1');
  const ph = await app.data(() => {
    const d = programs.day('fight-camp', 1), s = KBSession.createSession(programs.get('fight-camp'), d, { EX: KBEx.EX });
    return s.plan({ type: 'block', bi: 0 }).phases;
  });
  const b = big(page);
  await page.locator('[data-run="0"]').click();
  await page.locator('[data-run="0"] + [data-bt]').click();
  await expect(b.label).toHaveText(ph[0].label);
  await expect(b.next).toHaveText(ph[1].label);
  await page.clock.runFor(6000);
  await expect(b.label).toHaveText(ph[1].label);
  await expect(b.time).toHaveText(/^(3:00|2:59)$/);
  await expect(b.fig).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(b.root).toBeHidden();
  await expect(page.locator('#tgo')).toHaveText('Pause');
});

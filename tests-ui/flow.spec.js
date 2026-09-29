// Guided flows (yoga): one Start runs every pose, the timer shows the pose's drawing and the voice names it.
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

test('Start runs the whole flow: pose drawings on the timer, pose names spoken, then the rest before the next flow', async ({ app }) => {
  await app.open('#p-sun-and-strength-d1');
  const f = await app.data(() => {
    const d = programs.day('sun-and-strength', 1), s = KBSession.createSession(programs.get('sun-and-strength'), d, { EX: KBEx.EX });
    const { phases } = s.plan({ type: 'block', bi: 0 });
    return { total: phases.reduce((a, p) => a + p.sec, 0), first: phases[0], said: phases.flatMap((p) => [p.say, p.halfway && 'Halfway', p.sayEnd].filter(Boolean)), blocks: d.blocks.length, next: d.blocks[1].title };
  });
  const tfig = app.page.locator('#tfig');
  await expect(tfig).toBeHidden();
  await app.page.locator('[data-run="0"]').click();
  await expect(app.page.locator('#tlabel')).toHaveText(f.first.label);
  await expect(tfig.locator('svg.fig')).toBeVisible();
  await app.page.clock.runFor((f.total + 1) * 1000);
  await expect(app.page.locator('[data-run="0"]')).toHaveText('✓ Done · run again');
  await expect(app.page.locator('#tlabel')).toHaveText(`Rest · ${f.next.toLowerCase()} next`);
  await expect(tfig).toBeHidden();
  expect(await app.data(() => window.__said)).toEqual(f.said);
  expect(f.said.at(-1)).toBe('Done');
  expect(f.blocks).toBeGreaterThan(1);
});

test('a yoga day has no abs block and stretches "after the workout"', async ({ app }) => {
  await app.open('#p-yin-deep-stretch-d1');
  await expect(app.page.locator('.bletter.abs')).toHaveCount(0);
  await expect(app.page.locator('.block .fmt').first()).toHaveText('Guided flow');
  await expect(app.page.locator('#s-cool + div, .stretch').last()).toContainText('After the workout');
});

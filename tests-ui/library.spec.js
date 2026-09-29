// The programs page: family tabs (Strength · Cardio & combat · Mind & body · Mixed) above the subject chips, with counts.
const { test, expect } = require('./fixtures.js');
const { CONFIGS } = require('../program-builder.js');

const family = (app) => app.page.getByRole('group', { name: 'Filter by family' });
const subjects = (app) => app.page.getByRole('group', { name: 'Filter by subject' });
const chipTexts = async (group) => (await group.locator('.ftab, .fchip').allTextContents()).map((t) => t.trim().replace(/\s+\d+$/, '')); // subject chips carry a count: "Yoga 5"

test('every program shows under All, and the families are in their order', async ({ app }) => {
  await app.open('#programs');
  await expect(app.page.locator('.pcard')).toHaveCount(CONFIGS.length);
  expect(await chipTexts(family(app))).toEqual(['All', 'Strength', 'Cardio & combat', 'Mind & body', 'Mixed']);
  await expect(family(app).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
});

test('tap Mind & body: only its subjects\' chips and shelves show; Flow State sits under Mobility & posture', async ({ app }) => {
  await app.open('#programs');
  await family(app).getByRole('button', { name: 'Mind & body' }).click();
  await expect(family(app).getByRole('button', { name: 'Mind & body' })).toHaveAttribute('aria-pressed', 'true');
  const mind = ['Core & abs', 'Mobility & posture', 'Yoga', 'Pilates', 'Flexibility', 'Balance & stability'].filter((x) => CONFIGS.some((c) => c.subject === x));
  expect(await chipTexts(subjects(app))).toEqual(['All', ...mind]);
  expect((await app.page.locator('.pgroup h2').allTextContents())).toEqual(mind);
  await expect(app.page.locator('.pgroup', { hasText: 'Mobility & posture' }).locator('[data-open-prog="flow-state"]')).toHaveCount(1);
  await expect(app.page.locator('.pgroup', { hasText: 'Core & abs' }).locator('.pcard')).toHaveCount(CONFIGS.filter((c) => c.subject === 'Core & abs').length);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('a subject picked in one family resets when another family is picked', async ({ app }) => {
  await app.open('#programs');
  await family(app).getByRole('button', { name: 'Strength' }).click();
  await subjects(app).getByRole('button', { name: 'Pull-ups' }).click();
  await expect(app.page.locator('.pgroup h2')).toHaveText(['Pull-ups']);
  await family(app).getByRole('button', { name: 'Cardio & combat' }).click();
  await expect(subjects(app).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  const cardio = ['Conditioning', 'HIIT', 'Plyometrics', 'Boxing', 'Kickboxing'].filter((x) => CONFIGS.some((c) => c.subject === x));
  await expect(app.page.locator('.pgroup h2')).toHaveText(cardio);
});

test('the eyebrow counts what the taps select: Mind & body, then Yoga, then a length', async ({ app }) => {
  await app.open('#programs');
  const eyebrow = app.page.locator('.eyebrow').first();
  const inFamily = CONFIGS.filter((c) => ['Core & abs', 'Mobility & posture', 'Yoga', 'Pilates', 'Flexibility', 'Balance & stability'].includes(c.subject)).length;
  const yoga = CONFIGS.filter((c) => c.subject === 'Yoga').length;
  await expect(eyebrow).toHaveText(`${CONFIGS.length} programs`);
  await family(app).getByRole('button', { name: 'Mind & body' }).click();
  await expect(eyebrow).toHaveText(`Mind & body · ${inFamily} programs`);
  await subjects(app).getByRole('button', { name: 'Yoga' }).click();
  await expect(eyebrow).toHaveText(`Yoga · ${yoga} programs`);
  await expect(subjects(app).getByRole('button', { name: 'Yoga' })).toContainText(String(yoga));
  await app.page.getByRole('button', { name: /Length:/ }).click();
  await app.page.getByRole('group', { name: 'Filter by length' }).getByRole('button', { name: 'Up to 25 min' }).click();
  await expect(eyebrow).toHaveText(new RegExp(`^Yoga · \\d+ of ${yoga} programs$`));
  await expect(app.page.getByRole('button', { name: /Length:/ })).toContainText('Up to 25 min');
  expect(await app.sidewaysScroll()).toBe(0);
});

test('tap Mixed: chips Strength & stretch, Fighter and Athlete, and "Mixed · 18 programs"', async ({ app }) => {
  await app.open('#programs');
  await family(app).getByRole('button', { name: 'Mixed' }).click();
  await expect(family(app).getByRole('button', { name: 'Mixed' })).toHaveAttribute('aria-pressed', 'true');
  expect(await chipTexts(subjects(app))).toEqual(['All', 'Strength & stretch', 'Fighter', 'Athlete']);
  await expect(app.page.locator('.pgroup h2')).toHaveText(['Strength & stretch', 'Fighter', 'Athlete']);
  await expect(app.page.locator('.pcard')).toHaveCount(18);
  await expect(app.page.locator('.eyebrow').first()).toHaveText('Mixed · 18 programs');
  await expect(app.page.locator('.pgroup', { hasText: 'Strength & stretch' }).locator('[data-open-prog="iron-yoga"]')).toHaveCount(1);
  await expect(app.page.locator('.pgroup', { hasText: 'Fighter' }).locator('.pcard')).toHaveCount(6);
  await expect(app.page.locator('.pgroup', { hasText: 'Athlete' }).locator('[data-open-prog="jump-lift-stick"]')).toHaveCount(1);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('a Fighter day opens: Start runs the bouts, and the flow after them is its own Start', async ({ app }) => {
  await app.page.clock.install();
  await app.open('#programs');
  await family(app).getByRole('button', { name: 'Mixed' }).click();
  await app.page.locator('[data-open-prog="fight-ready"]').click();
  await app.go('#p-fight-ready-d1');
  const d = await app.data(() => { const d = programs.day('fight-ready', 1), b = d.blocks[0]; return { formats: d.blocks.map((x) => x.format), n: b.items.length, first: KBEx.EX[b.items[0].ex].name, abs: d.blocks.some((x) => x.kind === 'abs') }; });
  expect(d.formats).toEqual(['bouts', 'flow']);
  expect(d.abs).toBe(false);
  await expect(app.page.locator('.block .fmt')).toHaveText(['Bouts', 'Guided flow']);
  await app.page.locator('[data-run="0"]').click();
  await expect(app.page.locator('#tlabel')).toHaveText(`Get ready · ${d.first}`);
  await expect(app.page.locator('#tsub')).toHaveText(`Bout 1 of ${d.n}`);
  await expect(app.page.locator('#tfig svg.fig')).toBeVisible();
  await app.page.clock.runFor(6000);
  await expect(app.page.locator('#tlabel')).toHaveText(d.first);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('a Strength & stretch day opens: a lift to tick, then a flow to start', async ({ app }) => {
  await app.page.clock.install();
  await app.open('#programs');
  await family(app).getByRole('button', { name: 'Mixed' }).click();
  await app.page.locator('[data-open-prog="iron-yoga"]').click();
  await app.go('#p-iron-yoga-d1');
  const first = await app.data(() => { const d = programs.day('iron-yoga', 1); return { name: KBEx.EX[d.blocks[0].items[0].ex].name, formats: d.blocks.map((b) => b.format), abs: d.blocks.some((b) => b.kind === 'abs') }; });
  expect(first.formats).toEqual(['straight', 'flow']);
  expect(first.abs).toBe(false);
  await expect(app.page.locator('.block .fmt')).toHaveText(['Guided flow']); // only timed blocks carry a format tag
  const pip = app.page.getByRole('button', { name: `Set 1 of ${first.name} done` });
  await pip.click();
  await expect(pip).toHaveAttribute('aria-pressed', 'true');
  await app.page.locator('[data-run="1"]').click();
  await expect(app.page.locator('#tlabel')).not.toHaveText('');
  await app.page.clock.runFor(5000);
  await expect(app.page.locator('#tfig svg.fig')).toBeVisible();
  expect(await app.sidewaysScroll()).toBe(0);
});

test('at 360px only the family tab row scrolls: the page does not, and the selected Mixed tab is fully visible', async ({ app }) => {
  await app.page.setViewportSize({ width: 360, height: 800 });
  await app.open('#programs');
  expect(await app.sidewaysScroll()).toBe(0);
  await family(app).getByRole('button', { name: 'Mixed' }).click();
  expect(await app.sidewaysScroll()).toBe(0);
  const box = await app.page.evaluate(() => {
    const t = document.querySelector('.ftab[aria-pressed="true"]').getBoundingClientRect(), r = document.querySelector('.ftabs').getBoundingClientRect();
    return { tabLeft: t.left, tabRight: t.right, rowLeft: r.left, rowRight: r.right };
  });
  expect(box.tabLeft).toBeGreaterThanOrEqual(box.rowLeft);
  expect(box.tabRight).toBeLessThanOrEqual(box.rowRight + 0.5);
});

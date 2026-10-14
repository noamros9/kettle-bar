// Phase 33 ticket 2 (#293): Pause / Resume on a program's page, the In progress and Paused rows on Programs (3 cards,
// then Show all opening the row stacked), Today's workout skipping paused programs, and Start over.
const { test, expect } = require('./fixtures.js');

const FOUR = ['iron-ppl', 'hotel-room', 'three-split-60', 'flow-state'];
const row = (app, name) => app.page.locator('section.prow', { has: app.page.getByRole('heading', { name, exact: true }) });
// day 1 of each program done, a minute apart (the last one trained most recently)
async function startFour(app) {
  await app.open('#programs');
  await app.data(async (ids) => {
    for (const pid of ids) { store.toggle(pid, 1); await new Promise((r) => setTimeout(r, 5)); }
  }, FOUR);
}

test('four started programs: In progress shows 3 cards and Show all, which opens all four stacked', async ({ app }, testInfo) => {
  await startFour(app);
  await app.go('#programs');
  const inProgress = row(app, 'In progress');
  await expect(inProgress.locator('.pcard')).toHaveCount(3);
  await expect(inProgress.locator('.pcard').first()).toHaveAttribute('data-open-prog', 'flow-state'); // trained last
  await expect(row(app, 'Paused')).toHaveCount(0);
  if (testInfo.project.name === 'phone-light') expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: testInfo.outputPath('rows.png') });
  await inProgress.getByRole('button', { name: /Show all/ }).click();
  await expect(app.page).toHaveURL(/#row\/progress$/);
  await expect(app.heading()).toHaveText('In progress');
  await expect(app.page.locator('.plist .pcard')).toHaveCount(4);
  await app.page.getByRole('button', { name: '← All programs' }).click();
  await expect(app.heading()).toHaveText('Programs');
});

test('pause a started program: it moves to Paused, Today\'s workout opens another; Resume brings it back', async ({ app }, testInfo) => {
  await startFour(app);
  await app.go('#p-flow-state');
  await app.page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(app.page.locator('.pausedline')).toContainText('Paused');
  if (testInfo.project.name === 'phone-light') expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: testInfo.outputPath('paused-program.png') });
  expect(await app.data(() => store.isPaused('flow-state'))).toBe(true);
  await app.go('#programs');
  await expect(row(app, 'Paused').locator('.pcard')).toHaveCount(1);
  await expect(row(app, 'Paused').locator('[data-open-prog="flow-state"]')).toContainText('Paused');
  await expect(row(app, 'In progress').locator('[data-open-prog="flow-state"]')).toHaveCount(0);
  await expect(row(app, 'In progress').getByRole('button', { name: /Show all/ })).toHaveCount(0); // three left
  // it stays on its own shelf too
  await expect(app.page.locator('[data-open-prog="flow-state"]')).toHaveCount(2);
  await app.go('#today');
  await expect(app.page).toHaveURL(/#p-three-split-60-d2$/); // the most recent program that isn't paused
  await app.go('#p-flow-state');
  await app.page.getByRole('button', { name: 'Resume' }).click();
  await expect(app.page.locator('.pausedline')).toHaveCount(0);
  await app.go('#today');
  await expect(app.page).toHaveURL(/#p-flow-state-d2$/);
});

test('Start over is a new round: "Round 2" under it, the old round kept in History', async ({ app }) => {
  await startFour(app);
  await app.go('#p-iron-ppl');
  const btn = app.page.getByRole('button', { name: /^Start over/ });
  await expect(btn).toContainText('Round 2');
  await btn.click();
  await app.page.getByRole('dialog', { name: 'Start Round 2' }).getByRole('button', { name: 'Start Round 2' }).click();
  await expect(app.page.locator('.phead')).toContainText('Round 2');
  await expect(app.page.getByRole('button', { name: /^Start over/ })).toContainText('Round 3');
  expect(await app.data(() => store.entries('iron-ppl').map((e) => [e.day, e.round]))).toEqual([[1, 1]]);
});

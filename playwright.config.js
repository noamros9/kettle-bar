// Phone UI tests (ADR 4): a 390 × 844 phone in light and dark mode. No desktop runs: the app is used on a phone.
const { defineConfig } = require('@playwright/test');

const PORT = process.env.UI_PORT || 4173; // another port lets two checkouts run their UI tests at once
const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

module.exports = defineConfig({
  testDir: 'tests-ui',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 150000, // twice the slowest test (the every-exercise loop, ~1.2 min); decision 127
  reporter: process.env.CI ? [['list'], ['github'], ['html', { open: 'never' }]] : 'list', // github: failures show as run annotations
  // service workers blocked: requests through one would skip the Firebase/font stubs in tests-ui/fixtures.js
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure', serviceWorkers: 'block' },
  projects: [
    { name: 'phone-light', use: { ...phone, colorScheme: 'light' } },
    { name: 'phone-dark', use: { ...phone, colorScheme: 'dark' } },
  ],
  webServer: { command: `npm run -s build && node scripts/serve.js ${PORT}`, url: `http://localhost:${PORT}/index.html`, reuseExistingServer: !process.env.CI, timeout: 60000 },
});

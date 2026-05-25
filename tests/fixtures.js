// @ts-check
const { test: base, expect } = require('@playwright/test');

const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      try { localStorage.clear(); sessionStorage.clear(); } catch (_) {}
    });
    await use(page);
  },
});

module.exports = { test, expect };

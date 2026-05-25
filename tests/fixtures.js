// @ts-check
// Each Playwright test gets a fresh BrowserContext by default, so
// localStorage / sessionStorage start empty automatically. No init-script
// clearing here — it would wipe state between goto() and reload(), breaking
// persistence tests.
const { test, expect } = require('@playwright/test');

module.exports = { test, expect };

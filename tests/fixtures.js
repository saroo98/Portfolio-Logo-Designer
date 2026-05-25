// @ts-check
/**
 * tests/fixtures.js — shared `test` + `expect` for all spec files.
 *
 * Each Playwright test gets a fresh BrowserContext by default, so
 * localStorage / sessionStorage start empty automatically. We do NOT
 * clear storage in an init script because that would wipe state between
 * goto() and reload(), breaking the theme-persistence test (#18).
 */
const { test, expect } = require('@playwright/test');

module.exports = { test, expect };

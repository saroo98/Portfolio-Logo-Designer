// @ts-check
/**
 * nav.spec.js — Tests 09–14: top navigation behavior.
 *   09 brand-href-top              — .brand text + href="#top"
 *   10 nav-links-count-and-targets — 3 links: #works / #about / #contact
 *   11 nav-is-scrolled-class       — added past 8px scrollY, removed at top
 *   12 nav-active-on-works         — active class on Works while in section
 *   13 anchor-scroll-lands-on-heads — Works/About clicks keep section heads visible
 *   14 anchor-ids-exist            — every nav href resolves to a real element
 *   (tests 10/12/13/14 auto-skip in mobile-chrome project — nav-links hidden)
 */
const { test, expect } = require('./fixtures');

test.describe('Navigation', () => {
  test('09 brand-href-top', async ({ page }) => {
    await page.goto('/');
    const brand = page.locator('a.brand');
    await expect(brand).toHaveCount(1);
    await expect(brand).toHaveAttribute('href', '#top');
    await expect(brand).toHaveText('Maryam Ansari');
  });

  test('10 nav-links-count-and-targets', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile-chrome', 'nav-links hidden < 720px');
    await page.goto('/');
    const links = page.locator('.nav-links a');
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveAttribute('href', '#works');
    await expect(links.nth(1)).toHaveAttribute('href', '#about');
    await expect(links.nth(2)).toHaveAttribute('href', '#contact');
  });

  test('11 nav-is-scrolled-class', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('header.nav');
    await expect(nav).not.toHaveClass(/is-scrolled/);
    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(nav).toHaveClass(/is-scrolled/);
  });

  test('12 nav-active-on-works', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile-chrome', 'nav-links hidden < 720px');
    await page.goto('/');
    await page.evaluate(() => {
      const works = document.getElementById('works');
      if (works) window.scrollTo(0, works.offsetTop + 20);
    });
    await expect(page.locator('.nav-links a[href="#works"]')).toHaveClass(/active/);
  });

  test('13 anchor-scroll-lands-on-heads', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile-chrome', 'nav-links hidden < 720px');
    await page.goto('/');

    await page.click('.nav-links a[href="#works"]');
    await page.waitForURL(/#works$/);
    await expect.poll(async () => page.evaluate(() => {
      const nav = document.querySelector('#nav');
      const works = document.querySelector('#works');
      if (!nav || !works) return false;
      const navBottom = nav.getBoundingClientRect().bottom;
      const top = works.getBoundingClientRect().top;
      return top >= navBottom + 20 && top <= navBottom + 90;
    })).toBe(true);

    await page.click('.nav-links a[href="#about"]');
    await page.waitForURL(/#about$/);
    await expect.poll(async () => page.evaluate(() => {
      const nav = document.querySelector('#nav');
      const about = document.querySelector('#about');
      if (!nav || !about) return false;
      const navBottom = nav.getBoundingClientRect().bottom;
      const top = about.getBoundingClientRect().top;
      return top >= navBottom + 20 && top <= navBottom + 90;
    })).toBe(true);
  });

  test('14 anchor-ids-exist', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile-chrome', 'nav-links hidden < 720px');
    await page.goto('/');
    const hrefs = await page.locator('.nav-links a').evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute('href'))
    );
    for (const href of hrefs) {
      expect(href).toMatch(/^#\w+/);
      const id = href.slice(1);
      const exists = await page.evaluate((i) => !!document.getElementById(i), id);
      expect(exists, `anchor target #${id}`).toBe(true);
    }
  });
});

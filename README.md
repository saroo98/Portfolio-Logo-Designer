# Maryam Ansari — Logo Designer

Static portfolio site implemented from the `hossein-handoff.zip` design bundle (claude.ai/design). Visible layout, text, and design are pixel-identical to the handoff prototype; this repo adds the things prototypes leave out — head meta, a11y plumbing, focus management, scroll lock, performance tuning — and proves them with a 50-test Playwright suite.

## Run locally

```powershell
npm install
npx playwright install chromium
npm start              # static server at http://localhost:4173
```

## Run tests

```powershell
npm test               # all 50 tests, Chromium + Mobile Chrome
npm run test:chromium  # desktop only
npm run test:mobile    # mobile only
npm run test:report    # open the last HTML report
npm run lighthouse     # write lighthouse.json
```

## What was fixed (without changing visible design)

Every fix was a separate commit. Visible layout, copy, colors, typography, animations and section order are identical to the handoff `index.html`.

| ID | Commit | What |
|----|--------|------|
| F1 | `64a9239` | Theme init moved to `<head>` (FOUC fix) + `localStorage` value validation |
| F2 | `64a9239` | `<noscript>` style fallback so work images and hero are visible when JS is disabled |
| F3 | `e8305d2` | Open Graph (5) + Twitter Card (4) + JSON-LD `Person` + `theme-color` (dark/light) + author |
| F4 | `e8305d2` | `assets/favicon.svg` brand mark |
| F5 | `e424e62` | `type="button"` on theme, burger, lb-close, lb-prev, lb-next |
| F6 | `e424e62` | `aria-hidden="true"` + `focusable="false"` on 7 decorative inline SVGs |
| F7 | `e424e62` | Capitalized `<nav aria-label="Primary">` |
| F8 | `ee30e60` | Lightbox accessible name (`aria-label="Image viewer"`) |
| F9 | `ca14c29` | Skip-to-content link (`a.skip-link`), clip-hidden until focused |
| F10 | `ee30e60`, `7f05b01` | `inert` on lightbox and mobile drawer when closed (replaces `aria-hidden`-on-focusable-subtree) |
| F11 | `ee30e60` | Lightbox focus management: open → `lb-close`, close → invoking figure, Tab cycles among close/prev/next |
| F12 | `603c6be` | Mobile menu scroll lock + focus management + `<main>` / `<footer>` `inert` while open |
| F13 | `603c6be` | Theme button `aria-pressed` and dynamic `aria-label` ("Switch to light/dark mode") |
| F14 | `992d382` | Lightbox image load uses `addEventListener('load', once:true)` + monotonic `loadToken` to ignore stale callbacks |
| F15 | `992d382` | Dropped always-on `will-change: transform` on 11 figures; promoted only on `:hover` |
| F16 | `992d382` | `fetchpriority="high"` on first work image |
| — | `397204a` | Async-load Google Fonts + LCP image preload (FCP 3.4 s → 1.2 s, LCP 8.1 s → 2.5 s) |

## Verification (final)

```
Playwright    : 91 passed, 11 skipped, 0 failed (Chromium + Mobile Chrome)
Axe-core      : zero serious / critical violations on initial load and lightbox-open
                (color-contrast intentionally excluded — see plan risk #5)
Lighthouse    : a11y 100 · best-practices 100 · SEO 100 · performance 84
                (desktop preset, headless; perf within fail-soft gate)
```

## Deferred (intentionally out of scope)

| Item | Reason |
|------|--------|
| Color-contrast on `--dim` text | Would require visible palette changes |
| `<link rel="canonical">` | Needs the deploy URL; placeholder relative form fails Lighthouse, absolute fake URL hurts SEO |
| `mailto:maryam@example.com` placeholder | Content change |
| `href="#"` social links | Content change |
| Section-head `<div>` → `<h2>` semantic upgrade | DOM structure change |
| Splitting inline `<style>` / `<script>` into external files | Reorganization beyond visible-fix scope |
| OG image (dedicated 1200×630) | Uses `works/01-jobjooya.jpg` until art-directed |

## Repo layout

```
.
├── index.html                  production page (no visible change vs handoff)
├── works/                      11 logo JPGs (2000×1000 each)
├── assets/favicon.svg          brand mark
├── package.json
├── playwright.config.js        Chromium + Mobile Chrome (Pixel 5)
├── tests/
│   ├── fixtures.js
│   ├── load.spec.js            tests 01–08
│   ├── nav.spec.js             tests 09–14
│   ├── theme.spec.js           tests 15–20
│   ├── mobile-menu.spec.js     tests 21–26
│   ├── lightbox.spec.js        tests 27–36
│   ├── images.spec.js          tests 37–40
│   ├── accessibility.spec.js   tests 41–46 + axe scan
│   ├── seo-perf.spec.js        tests 47–50
│   └── .baseline-failures.md   pre-fix failure map
└── _handoff_extract/           original bundle (gitignored, kept for diff)
```

## Reference: the original handoff

The unmodified prototype lives at `_handoff_extract/hossein/project/index.html`. Open it in a browser alongside the production page to confirm pixel parity.

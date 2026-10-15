# Build, search assets and Core Web Vitals: test results (brief section 9, items 5 and 6, and section 4)

Run on 15 October 2026 on branch `ihg-site` (head `571cf76`), from the prerendered build in `dist/`. Every check ran
offline against local static servers on ports 8793 and 8794; nothing was sent to a live service. The raw Lighthouse
JSON files (24 runs) are in the coordinator's scratchpad under `lighthouse/` and are not committed.

Result in one line: the build and the search assets pass every check (acceptance test 5 passes); Lighthouse mobile
gives Accessibility 100, Best Practices 100 and SEO 100 on all four pages, but Performance is below the 90 the brief
asks for on every page (medians 79, 88, 79 and 87 with compression; 72, 81, 82 and 84 without), so acceptance test
6 fails on Performance. The causes are specific and listed in section 8.

## 1. Build

| Command | Result |
|---|---|
| `npm run check` | ok (syntax, no em dashes in 302 files) |
| `npm run build` | ok: 23 pages plus `404.html` and `error.html`, 1 inline script hash, sitemap 23 urls, feed 8 items, hero preloads 28 KB and 26 KB |
| `LAUNCH=1 npm run build` | ok: the `robots` meta tag is dropped from every page, `X-Robots-Tag` is dropped from `_headers`, `robots.txt` loses the pre-launch comment; nothing else differs |
| `BUILD_PREVIEW=1 npm run build` | ok: `data-preview` is set on `<html>` in all 48 html files; nothing else differs (see issue 3: the attribute has no effect on the prerendered markup) |
| `node tests/seo.js dist 8793` (default build) | SEO OK: 23 routes and the search assets |
| `LAUNCH=1 node tests/seo.js dist 8794` (launch build) | SEO OK: 23 routes and the search assets |
| `node tests/smoke.js http://127.0.0.1:8793` (dist) | SMOKE OK: 34 page loads clean (17 routes, desktop and mobile; no console error, no failed request, no broken image, no overflow, alt text everywhere) |
| `node tests/a11y.js http://127.0.0.1:8793` (dist) | A11Y OK: 14 checks, no serious or critical axe violation, every focused control shows focus |

`dist/` is ignored by git and is rebuilt by Netlify on every deploy.

## 2. Every route in the sitemap (acceptance test 5)

An independent script (not `tests/seo.js`) read `dist/sitemap.xml`, derived the route list a second time from
`assets/js/data.js`, and fetched every url from the dist server. All 23 routes pass every assertion:

* HTTP 200; `data-prerendered` on `<html>`.
* Exactly one `<title>`, one `<meta name="description">` and one `<link rel="canonical">`; titles and descriptions
  unique across the site.
* The canonical equals the sitemap url exactly: `https://www.imperialholdingsgroup.com/about` and so on, no trailing
  slash (the home page is `https://www.imperialholdingsgroup.com/`); `og:url` equals the canonical.
* `og:image` absolute (the page's own photograph, otherwise `/assets/img/og.jpg`), `og:title`, `og:description`,
  `og:type`; `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
* JSON-LD parses on every page. Types found: `Organization` on all 23 pages; `BreadcrumbList` on the 22 inner pages
  and not on the home page; `FAQPage` plus two `LocalBusiness` (one per office) on `/contact` only; `Article` on the
  four `/insights/<slug>` pages; `Event` on the six `/journal/events/<slug>` pages; no `Article` or `Event` anywhere
  else.
* Both font preloads present on every page, root-relative, with `crossorigin`.
* Every root-relative asset the pages reference exists in `dist/`; no relative `assets/` url remains.

Search assets:

| Check | Result |
|---|---|
| `GET /robots.txt` | 200; `User-agent: *`, `Disallow: /.netlify/`, `Allow: /`, `Sitemap: https://www.imperialholdingsgroup.com/sitemap.xml` |
| `GET /sitemap.xml` | 200, `application/xml`, well formed; 23 `<loc>` entries, all absolute, none with a trailing slash except the home page; matches the route list from data.js exactly (nothing missing, nothing extra) |
| `GET /journal/feed.xml` | 200, well formed XML (strict parser), `<rss version="2.0">`, channel title, link and description present, `atom:link rel="self"` is the absolute feed url, 8 items each with title, absolute link, guid, description and category; one item carries a `pubDate` (the only entry with a full date in data.js) and it parses; every item link is a sitemap url |
| `dist/404.html` | exists; `noindex, follow`; no canonical; both office telephone numbers and the email present; `dist/error.html` exists |
| `dist/_redirects` | one rule only, `/netlify/*   /index.html   200!`; no `/*` catch-all, so Netlify serves `404.html` with a real 404 for an unknown path |
| Unknown path on the local server | `tests/serve.js` has a single-page fallback and answers 200 with the home page; this is the test server, not the host. The e2e harness server and a Netlify-like server both answer 404 with `404.html` |

## 3. Nested routes: no speculative 404 requests

`/divisions/citizenship` and `/journal/events/grenada-51-dubai` (plus `/`, `/contact`, an insights article and the
event url with a trailing slash) were loaded from `dist/` in Chromium at mobile and desktop widths, recording every
response with a status of 400 or above, every failed request and every console error: none on any of the 12 loads
(21 to 25 requests each). The prerendered pages use root-relative asset urls, so the speculative fetch of
`divisions/assets/...` that the source tree produced is gone.

## 4. Content Security Policy

`dist/index.html` has one inline script (the head script that adds `<base>` and rewrites old `#/` links). Its
sha256, computed from the file, is `sha256-0qa15l+/XCbbmHzMZ6ncUI4vLwQMxlgYBCtL6sjsXZ4=`, and `dist/_headers` carries
exactly that hash in `script-src` and no stale one. All 49 html files of `dist/` (the 22 inner pages
written twice, `index.html`, `404.html`, `error.html` and the two `shared/chrome/` fragments) were hashed the same
way and every inline script in them is covered. No inline event
handler attributes, no third-party script. The policy: `default-src 'self'; script-src 'self' '<hash>';
style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none';
media-src 'self'; form-action 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none';
upgrade-insecure-requests`. GA4, Turnstile and the video players are added only when their keys or ids are set.

## 5. Hero images and fonts

Hero files in `assets/img/` (all under 200 KB): `hero-alt.webp` 27 KB (1400 by 580), `hero-alt-m.webp` 26 KB
(900 by 1125), `hero.webp` 156 KB (1600 by 1000), `hero-m.webp` 82 KB, `hero-night.webp` 58 KB (1600 by 1000),
`hero-night-m.webp` 45 KB. The home page uses `hero-alt` (`<picture>` with the `-m` file under 641 px,
`fetchpriority="high"`, preloaded in the head with matching media queries). `hero` and `hero-night` are shipped but
unused in production builds until consent is recorded for their events, as `data.js` documents.

The first image of each inner page hero (`section.ph`), which is that page's LCP element:

| Page hero file | KB | Used on |
|---|---|---|
| `partners.webp` | 265 | `/divisions`, `/divisions/partners-club`, `/insights/your-client-stays-your-client` |
| `real-estate.webp` | 204 | `/divisions/real-estate` |
| `events/easter-polo-cup-2026/02.webp` | 186 | `/journal`, `/journal/events/easter-polo-cup-2026` |
| `academy.webp` | 135 | `/divisions/academy`, `/insights`, `/insights/everything-in-writing` |
| `private-office.webp` | 122 | `/divisions/private-office`, `/insights/explain-your-family-once` |
| `events/easter-polo-cup-2026/04.webp` | 108 | `/journal/events/lagos-office-event` |
| `lagos.webp` | 106 | `/journal/events/lagos-diplomatic-soiree-2025` |
| `citizenship.webp` | 101 | `/divisions/citizenship`, `/insights/before-a-first-conversation` |
| `about.webp` | 99 | `/about`, `/contact`, `/journal/events/delborough-dinner` |
| `closing.webp` | 78 | `/journal/events/grenada-51-dubai` |
| `hero-alt.webp` | 28 | `/journal/events/gala-dinner-lagos` |

Two files, on four pages, are over the 200 KB the brief sets (issue 2). Inner page heroes have no mobile variant
(the 1728 by 1080 file serves every viewport); at the mobile device pixel ratio Lighthouse counts that as 6 KB of
waste on `citizenship.webp`, so it is not a priority. The hero `<img>` has no `width` and `height` attributes but is
absolutely positioned inside a sized box, and CLS is 0 on every page.

Fonts: `cormorant-garamond-latin-500-normal.woff2` and `inter-latin-400-normal.woff2` are preloaded on every page
with `crossorigin`, root-relative; both are declared in `@font-face` and are the `--head` and `--sans` faces. All six
faces (23 to 24 KB each) have `font-display: swap`; Lighthouse's font display insight passes. The other four faces
(Inter 500 and 600, Cormorant 600 and 500 italic) load at very high priority once the stylesheet is parsed, about
120 to 185 ms in, and are used above the fold.

## 6. Lighthouse mobile (acceptance test 6)

Lighthouse 13.5.0, Chrome 141, default mobile configuration (412 by 823 at 1.75, simulated throttling: 150 ms RTT,
1.6 Mbps, 4x CPU slowdown), `--only-categories=performance,accessibility,best-practices,seo`, against the
`LAUNCH=1` build (on the pre-launch build the home page scores SEO 69 because of the deliberate `noindex`, audit
`is-crawlable`; every other audit is the same). Two servers were used:

* `tests/serve.js` (plain, no compression) on 8793: one run per page.
* A scratch server with gzip for text (approximating the Brotli or gzip Netlify applies; images are WebP and do not
  compress) on 8794: three runs per page, medians reported. With compression the home page's text weight drops from
  424 KB to 116 KB (html 79 to 19 KB, the three scripts 250 to 76 KB, the two stylesheets 95 to 21 KB).

| Page | Server | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | gzip, median of 79, 86, 79 | **79** | 100 | 100 | 100 | 1.5 s | 5.3 s (4.0 to 5.3) | 18 ms | 0 | 3.5 s |
| `/` | plain | 72 | 100 | 100 | 100 | 2.1 s | 7.0 s | 77 ms | 0 | 3.9 s |
| `/divisions/citizenship` | gzip, median of 88, 89, 78 | **88** | 100 | 100 | 100 | 1.7 s | 3.8 s (3.7 to 5.8) | 8 ms | 0 | 1.7 s |
| `/divisions/citizenship` | plain | 81 | 100 | 100 | 100 | 2.3 s | 4.7 s | 9 ms | 0 | 2.3 s |
| `/insights/before-a-first-conversation` | gzip, median of 79, 79, 79 | **79** | 100 | 100 | 100 | 1.4 s | 5.7 s (5.6 to 5.7) | 11 ms | 0 | 1.6 s |
| `/insights/before-a-first-conversation` | plain | 82 | 100 | 100 | 100 | 1.8 s | 4.7 s | 2 ms | 0 | 2.3 s |
| `/contact` | gzip, median of 88, 87, 78 | **87** | 100 | 100 | 100 | 1.7 s | 4.0 s (3.8 to 5.7) | 21 ms | 0 | 1.8 s |
| `/contact` | plain | 84 | 100 | 100 | 100 | 1.7 s | 4.4 s | 7 ms | 0 | 2.0 s |

Accessibility 95 or above and SEO 95 or above: met everywhere. Performance 90 or above: not met on any page, and
LCP is above the 2.5 s the brief sets on every page. Every run has CLS 0 and TBT under 80 ms, so the score is
entirely an LCP and Speed Index problem, which is network and render order, not JavaScript cost.

Top three opportunities per page (gzip run; the plain run shows the same items with larger byte figures because
nothing is compressed there):

* `/`: render-blocking requests (`site.css`, `tokens.css`), 500 ms; reduce unused CSS, 13 KB, 140 ms; minify
  JavaScript, 9 KB, 140 ms. Also: image delivery, 644 KB of the lazy "houses" thumbnails (900 px files in 363 px
  slots), below the fold so not on the LCP path.
* `/divisions/citizenship`: render-blocking requests, 880 ms; reduce unused JavaScript, 30 KB, 150 ms; reduce unused
  CSS, 15 KB, 150 ms.
* `/insights/before-a-first-conversation`: improve image delivery, 317 KB, 1,350 ms (the five division thumbnails
  loaded at boot, see issue 1a); render-blocking requests, 590 ms; reduce unused JavaScript, 35 KB, 160 ms.
* `/contact`: render-blocking requests, 890 ms; reduce unused CSS, 15 KB, 150 ms; reduce unused JavaScript, 32 KB,
  90 ms.

What the request timeline shows on every inner page (from the Lighthouse network log, `/divisions/citizenship`,
gzip): the document, then at 25 ms the home hero preload `hero-alt-m.webp` (26 KB, high priority, not used on this
page), the two preloaded fonts, the two stylesheets and the page's hero `citizenship.webp` (101 KB, high); at 48 ms
the three scripts (76 KB); then, as soon as the app has built the menus at about 120 to 200 ms, the five division
thumbnails `citizenship-c`, `partners-c`, `private-office-c`, `real-estate-c` and `academy-c` (404 KB, high
priority). Under the simulated 1.6 Mbps those 430 KB of images that the first screen does not show share the
connection with the 101 KB LCP image and the 20 KB stylesheet that blocks rendering. The LCP element is the hero
`<img>` on the inner pages and the lead paragraph under the headline on the home page.

A second, real-browser measurement (Chromium through Playwright with 4x CPU throttling and emulated slow 4G, a
`PerformanceObserver` for LCP, no simulation): home 1.3 s with the intro veil, 1.4 s with the veil already seen,
1.3 s with reduced motion; `/divisions/citizenship` 1.3 s; `/contact` 2.9 s (the hero image). So the intro veil and
the reveal transitions do not hold the real LCP back; the Lighthouse figure for the home page (4.0 to 7.0 s across
runs) comes from its simulation of the render chain and is volatile. The brief measures by Lighthouse, so the
simulated figures above are the ones that count, and the inner pages are slow by both measures.

## 7. What is fine

* CLS 0 on every page and run; the header, the hero and the fonts cause no shift.
* TBT 2 to 77 ms; the ES5 app costs little main-thread time.
* Fonts preloaded and swapped; no invisible text.
* Image, font and logo caching headers are set in `_headers`; HTML is revalidated.
* No third-party request of any kind until GA4 or Turnstile keys are set.
* Accessibility, Best Practices and SEO at 100 on all four pages; axe finds no serious or critical violation on
  seven routes at two widths.

## 8. Issues

1. **High. Lighthouse Performance is below 90 on all four pages (acceptance test 6 fails); LCP above 2.5 s.**
   Four causes, in order of weight:
   * a. `assets/css/site.css` line 146, `.mmenu[hidden]{display:block;visibility:hidden}`: the mobile menu stays laid
     out while hidden, translated one viewport height upwards, so its five division thumbnails built by
     `buildChrome()` (`assets/js/app.js` line 600, the `mm-sub` list, `img(d.img,'','','-c')`) sit 110 to 390 px
     above the viewport, inside Chrome's lazy-load margin, and download at boot on every page and at every width:
     `partners-c` 137 KB, `real-estate-c` 85 KB, `academy-c` 70 KB, `private-office-c` 57 KB, `citizenship-c` 55 KB,
     404 KB in all, at high priority, in competition with the LCP image. Lighthouse puts 1,350 ms of LCP on this on
     the insights article. (The desktop mega menu keeps `display:none`, so its copies of the same images do not
     load.) A fix that keeps the look: leave the menu `display:none` until it opens (the app already toggles
     `hidden` and forces a reflow before adding `mm-open`), or give the thumbnails `src` only when the menu opens.
   * b. `index.html` lines 28 and 29: the two home hero preloads are in the shared head, so every inner page
     preloads `hero-alt.webp` or `hero-alt-m.webp` (26 to 28 KB, high priority) and never uses it; Chrome logs the
     console warning "was preloaded using link preload but not used within a few seconds from the window's load
     event" on every inner page. The build (`build/build.js`, `finish()`) could drop them on every route but `/`, or
     swap them for the page's own hero file, which would also give the inner pages the early, high-priority hero
     fetch the home page has.
   * c. Render-blocking CSS: `site.css` (92 KB raw, 20 KB compressed, 8 KB of it minification waste, 60 to 75 KB
     raw unused per page) and `tokens.css`, 500 to 1,200 ms of estimated savings per page. Minifying at build and
     inlining the critical part (tokens, header, hero) would take most of it.
   * d. Unminified JavaScript: `app.js` and `data.js`, 31 KB raw (9 KB compressed) of minification waste, plus
     about 100 KB raw of code the first screen does not run. Minify at build; the source stays ES5 and readable.
   The home page carries one more factor the inner pages do not: Lighthouse's LCP element there is the lead
   paragraph, and its simulated render time varies from 4.0 to 7.0 s between runs while the real browser paints it
   at 1.3 s. Fixing a to d will raise the home score; the veil itself is not the cause.
2. **Medium. Two hero files over 200 KB** (brief section 4, build contract 4.6 says every hero file stays under
   200 KB): `assets/img/partners.webp` 265 KB (1728 by 1080) is the LCP image on `/divisions`,
   `/divisions/partners-club` and `/insights/your-client-stays-your-client`; `assets/img/real-estate.webp` 204 KB
   (2200 by 1375) on `/divisions/real-estate`. The build and `tests/seo.js` guard only the two home preloads, so
   neither file is caught. Re-encode at a lower quality (the 900 px `-c` variants of the same photographs are 136 KB
   and 84 KB) or add the page heroes to the build's 200 KB guard.
3. **Medium. `BUILD_PREVIEW=1` has no effect on what a preview page shows on first paint.** `build/build.js` sets
   `data-preview` on `<html>` in `finish()`, after the app has rendered, but `assets/js/app.js` line 60 reads
   `PREVIEW = root.hasAttribute('data-preview')` when the script runs, so every prerendered preview page carries the
   consent-safe fallback markup: the home hero is `hero-alt.webp`, there is no night figure, and the event gallery
   shows the "Photographs will appear once guests have confirmed" note. Checked in Chromium: on first paint the
   preview home shows `hero-alt.webp`; after one client-side navigation away and back it shows `hero.webp` and the
   night figure, because that render runs in a page that has the attribute. Fix in `build/prerender.js`: set the
   attribute on `documentElement` before the scripts are evaluated (pass `preview` into `createRenderer` or
   `render`). `tests/seo.js` does not cover preview builds, so nothing caught it.
4. **Low. The local test server masks 404s.** `tests/serve.js` answers 200 with `index.html` for any unknown
   path without a file extension, so `curl` of an unknown path against it does not prove the 404 behaviour; the
   proof here is the file plus the absence of a catch-all in `_redirects`, and the e2e harness server, which answers
   404. A `--no-fallback` switch for the dist case would make the smoke test closer to the host.
5. **Info.** `tests/serve.js` and the scratch gzip server send `Cache-Control: no-store`, so when the app rebuilds
   the menus the five thumbnails are fetched twice in the Lighthouse logs (visible on `/contact`). On Netlify the
   image cache header applies and the second fetch is served from cache. The first fetch is the real cost in issue 1a.
6. **Info.** `_headers` has `/*.html  Cache-Control: public, max-age=0, must-revalidate`; the clean urls
   (`/about`) do not end in `.html`, so the rule matches only direct requests for the `.html` files. Netlify's
   default for HTML is the same value, so the behaviour is right; the rule is just narrower than it looks.
7. **Info.** `build/README.md` suggests `--chrome-flags="--headless --no-sandbox"`; this run used `--headless=new`,
   which Lighthouse 13 expects. Lighthouse must be run on a `LAUNCH=1` build or SEO drops to 69 on `is-crawlable`.

## 9. Re-running

```
npm run check && npm run build && node tests/seo.js dist 8793
LAUNCH=1 npm run build && LAUNCH=1 node tests/seo.js dist 8794
node tests/serve.js dist 8793 &
NODE_PATH=$(npm root -g) node tests/smoke.js http://127.0.0.1:8793
NODE_PATH=$(npm root -g) node tests/a11y.js http://127.0.0.1:8793
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npx lighthouse@13 http://127.0.0.1:8793/ \
  --chrome-flags="--headless=new --no-sandbox" --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=home.json
```

Run Lighthouse on a `LAUNCH=1` build, three times per page, and read the median: the LCP figure for the home page
moved between 4.0 and 7.0 s across otherwise identical runs. Serve with compression on (Netlify does) to see the
figures the site will get; the plain test server costs 5 to 10 points on the Performance score.

# Build, search assets and Core Web Vitals: test results (brief section 9, items 5 and 6, and section 4)

Run on 15 October 2026 on branch `fix/perf` (from `ihg-site` head `ed85eb1`, commits `82a5f6d` to `d76ba08`), from the
prerendered build in `dist/`. Every check ran offline against local static servers on ports 8886 to 8889; nothing was
sent to a live service. The raw Lighthouse JSON files (36 runs over three rounds) are in the fixer's scratchpad under
`perf/lh1`, `perf/lh2` and `perf/lh3` and are not committed.

Result in one line: acceptance test 6 passes. Lighthouse mobile on the four pages gives Performance medians of
95 (`/`), 95 (`/divisions/citizenship`), 96 (`/insights/before-a-first-conversation`) and 93 (`/contact`), with Accessibility 100, Best Practices 100 and SEO 100 (the previous round had 79, 88, 79 and 87).
Largest Contentful Paint is 2.6 to 3.0 s, still above the 2.5 s the brief names, by 0.1 to 0.5 s; the photographs
are not what holds it there (the measured pages' heroes are 26 to 81 KB), the six font faces, the header logo and the
two render-blocking stylesheets are, and section 8 says what would take it under.

## 1. What changed in this round

Causes a to d of the previous round's issue 1, plus its issues 2 to 4, 6 and 7, in five commits:

| Commit | Change |
|---|---|
| `82a5f6d` | The mobile menu's five division thumbnails (404 KB at high priority) no longer download at boot: they start as a transparent pixel with the file in `data-src`, and `setMM()` swaps the real source in the first time the menu opens, on every page. Checked in Chromium on the four pages at both widths: no mobile-menu thumbnail request at boot (the home and Insights pages still fetch the division crops their own cards use), five on open, none broken. |
| `1c6ec77` | `build/build.js` minifies `site.css`, `tokens.css`, `data.js`, `analytics.js` and `app.js` in place in `dist/` (esbuild transform API, `es5` target for the scripts). The source tree stays readable and ES5; paths and the `?v=5` query are unchanged, and the inline head script and its CSP hash are untouched (`sha256-0qa15l+/XCbbmHzMZ6ncUI4vLwQMxlgYBCtL6sjsXZ4=` before and after). Raw sizes on the merged branch: 94 to 86 KB (site.css), 3 to 1 KB (tokens.css), 85 to 73 KB (data.js), 3 to 1 KB (analytics.js) and 183 to 142 KB (app.js); compressed, the three scripts are 65 KB (were 76 KB before minification) and the two stylesheets 18 KB (were 20 KB). |
| `8621cb5` | `partners.webp` and `real-estate.webp` re-exported from the original files at quality 75: 1600 by 1000 at 187 KB and 1920 by 1200 at 151 KB (they were 265 KB and 204 KB two rounds ago, 194 KB and 191 KB at the start of this one); their mobile crops `partners-m.webp` and `real-estate-m.webp` (810 by 1080) at 102 KB and 68 KB, down from 164 KB and 152 KB. `tests/seo.js` now fails on any hero file a page references that is missing or over 200 KB: the home figures (dusk, and night on a preview build), the page hero or the not-found backdrop, each with its mobile source. |
| `482a89d` | `tests/serve.js --no-fallback` answers an unknown path with status 404 and `dist/404.html`, as the host does (checked with curl: `/no-such-page` 404 with the not-found title, `/about` 200; without the switch the fallback still answers 200 for the source tree). `build/headers.template` says that the `/*.html` rule matches direct `.html` requests only and that the clean urls get the host's default for HTML, the same value. |
| `d76ba08` | The three script tags at the end of the body carry `defer`, so the prerendered page paints before the scripts are fetched and evaluated; they still run in the same order once the document is parsed. The footer's stacked logo (17 KB) loads lazily. The crown image (320 by 175) in the division wordmark, the intro veil and the closing and not-found sections has its box reserved with `aspect-ratio`, so the text beside it does not shift when the file arrives after the first paint (the earlier paint had exposed a 0.03 shift on the division pages in one run). |

The per-page hero preload (the previous round's cause b) was already merged from the backend round: `build/build.js`
replaces the two home lines with each page's own hero, with its mobile source, and skips any file over 200 KB. It is
kept as it is. `BUILD_PREVIEW=1` (the previous round's issue 3) is also already fixed on `ihg-site`: `build/prerender.js`
sets `data-preview` before the scripts are evaluated; checked here, the preview home page carries `hero.webp` and
`hero-night.webp` in its markup and no event page carries the consent note. `build/README.md` now gives the
`--headless=new` flag and says the audit must run on a `LAUNCH=1` build (the previous round's issue 7).

Not done, on purpose: inlining the critical CSS for the header and hero. Loading the rest of `site.css` without
blocking needs either an inline event handler (`onload` on the link, which the CSP forbids: `script-src` is `'self'`
plus hashes, no `'unsafe-inline'`) or a script that switches the media attribute, and the full stylesheet would then
arrive after the first paint of a complete prerendered page, so everything below the hero would paint unstyled for a
moment. The remaining render-blocking cost is one round trip plus 18 KB (see section 8); it is not worth that risk.

## 2. Build

| Command | Result |
|---|---|
| `npm run check` | ok (syntax, no em dashes in 61 files) |
| `npm run build` | ok: 23 pages plus `404.html` and `error.html`, 1 inline script hash, sitemap 18 urls (the four draft articles and their listing prerendered with noindex, not listed), feed 4 items, five files minified, 19 hero preloads all under 200 KB, no warning |
| `LAUNCH=1 npm run build` | ok: the `robots` meta tag is dropped from every page, `X-Robots-Tag` is dropped from `_headers`; nothing else differs |
| `BUILD_PREVIEW=1 npm run build` | ok: `data-preview` set before the app runs; the home page's markup carries `hero.webp` and `hero-night.webp`, the event galleries are in the markup with the preview note |
| `node tests/seo.js dist 8886` (default build) | SEO OK: 23 routes and the search assets, including the new hero file check |
| `LAUNCH=1 node tests/seo.js dist 8886` (launch build) | SEO OK: 23 routes and the search assets |
| `node tests/smoke.js http://127.0.0.1:8887` (dist) | SMOKE OK: 38 page loads clean (desktop and mobile; no console error, no failed request, no broken image, no overflow, alt text everywhere) |
| `node tests/a11y.js http://127.0.0.1:8888` (source tree) | A11Y OK: 14 checks, no serious or critical axe violation, every focused control shows focus; axe runs with the mobile menu open as one of the states |

`dist/` is ignored by git and is rebuilt by Netlify on every deploy.

## 3. Every route in the sitemap (acceptance test 5)

`tests/seo.js` asserts for all 23 routes: HTTP 200, `data-prerendered` naming the route, exactly one title, description
and canonical (the canonical equals the sitemap url, no trailing slash except the home page), `og:url`, `og:image`
(the JPEG card first, with its size), the Open Graph and Twitter tags, an `h1`, no hash links or relative asset urls,
valid JSON-LD of the expected types (`Organization` everywhere, `BreadcrumbList` on the inner pages, `FAQPage` plus one
`LocalBusiness` per office on `/contact`, `Article` on the insights pages, `Event` only where the event has a full
date), titles within 60 and descriptions within 160 characters and unique across pages, the page's own hero as its
only image preloads, and every hero file present and under 200 KB. It also checks `robots.txt`, that `sitemap.xml`
lists every route and nothing else, the RSS feed, `404.html` and `error.html` (noindex, no canonical, both office
numbers, the email, the reload button), the ecosystem logo files, the inline script hash in `_headers`, the absence
of a catch-all rewrite and that `dist/shared` holds no lead JSON file. All pass on both builds.

The 404 behaviour: `dist/404.html` exists, `_redirects` has no catch-all, and `tests/serve.js dist 8887 --no-fallback`
now answers an unknown path with 404 and that file, so the behaviour can be seen locally and not only inferred.

## 4. Content Security Policy

Unchanged: one inline script (the head script that adds `<base>` and rewrites old `#/` links), hash
`sha256-0qa15l+/XCbbmHzMZ6ncUI4vLwQMxlgYBCtL6sjsXZ4=` in `dist/_headers`, the same as before the minification step,
because the minified files are the external ones and the inline script is left as it is. The transparent pixel the
mobile menu starts its thumbnails from is a `data:` image, which `img-src 'self' data:` already allows.

## 5. Hero images and fonts

Home: `hero-lights.webp` 21 KB (1600 by 977) and `hero-lights-m.webp` 10 KB (720 by 960), preloaded with matching media
queries; `hero.webp` 157 KB and `hero-night.webp` 59 KB with their mobile files are used on preview builds only.

The first image of each inner page hero (`section.ph`), which is that page's LCP element, all under 200 KB and all
with a mobile crop (`-m.webp`, 810 by 1080) that the phone viewport gets:

| Page hero file | Desktop | Mobile | Used on |
|---|---|---|---|
| `partners.webp` | 187 KB (1600 by 1000) | 102 KB | `/divisions`, `/divisions/partners-club`, `/insights/your-client-stays-your-client` |
| `real-estate.webp` | 151 KB (1920 by 1200) | 68 KB | `/divisions/real-estate` |
| `events/easter-polo-cup-2026/02.webp` | 186 KB | none (event photographs have no mobile crop) | `/journal`, `/journal/events/easter-polo-cup-2026` |
| `academy.webp` | 135 KB | 92 KB | `/divisions/academy`, `/insights`, `/insights/everything-in-writing` |
| `private-office.webp` | 122 KB | 76 KB | `/divisions/private-office`, `/insights/explain-your-family-once` |
| `events/easter-polo-cup-2026/04.webp` | 108 KB | none | `/journal/events/lagos-office-event` |
| `lagos.webp` | 106 KB | 84 KB | `/journal/events/lagos-diplomatic-soiree-2025` |
| `citizenship.webp` | 101 KB | 71 KB | `/divisions/citizenship`, `/insights/before-a-first-conversation` |
| `about.webp` | 99 KB | 81 KB | `/about`, `/contact`, `/journal/events/delborough-dinner` |
| `closing.webp` | 78 KB | 67 KB | `/journal/events/grenada-51-dubai`, `404.html`, `error.html` |
| `hero-lights.webp` | 21 KB | 10 KB | `/journal/events/gala-dinner-lagos` |

The event cover `02.webp` at 186 KB is the largest file still served to a phone (on `/journal` and its event page,
neither in the measured set); a mobile crop for the event covers would be the next saving there.

Fonts are unchanged: `cormorant-garamond-latin-500-normal.woff2` and `inter-latin-400-normal.woff2` preloaded on every
page with `crossorigin`; all six faces (23 to 24 KB each) have `font-display: swap`. The other four faces load at very
high priority as soon as the stylesheet is parsed and are used above the fold, so they sit on the LCP path (section 8).

## 6. Lighthouse mobile (acceptance test 6)

Lighthouse 13.5.0, Chrome 141, default mobile configuration (412 by 823 at 1.75, simulated throttling: 150 ms RTT,
1.6 Mbps, 4x CPU slowdown), `--chrome-flags="--headless=new --no-sandbox"`,
`--only-categories=performance,accessibility,best-practices,seo`, against the `LAUNCH=1` build served with gzip for
text (a scratch server, listed in section 9; images are WebP and do not compress), three runs per page, the median by
Performance score reported with its metrics. Compressed, the home page's text weight on the merged branch is 101 KB (html 19 KB, the
three scripts 65 KB, the two stylesheets 18 KB), down from 116 KB.

| Page | Runs (Performance) | Performance | Accessibility | Best Practices | SEO | FCP | LCP (range) | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | median of 95, 95, 95 | **95** | 100 | 100 | 100 | 1.5 s | 2.6 s (2.6 to 2.7) | 14 ms | 0 | 3.1 s |
| `/divisions/citizenship` | median of 95, 95, 92 | **95** | 100 | 100 | 100 | 1.7 s | 2.8 s (2.8 to 3.1) | 36 ms | 0 | 1.7 s |
| `/insights/before-a-first-conversation` | median of 96, 96, 96 | **96** | 100 | 100 | 100 | 1.4 s | 2.7 s (2.7 to 2.7) | 4 ms | 0 | 1.4 s |
| `/contact` | median of 92, 93, 95 | **93** | 100 | 100 | 100 | 1.7 s | 3.0 s (2.9 to 3.2) | 102 ms | 0 | 1.7 s |

Accessibility 95 or above and SEO 95 or above: met everywhere. Performance 90 or above: met on every page and in every
run (the lowest single run is 92). LCP is 2.6 s on the home page, 2.8 s on the division page, 2.7 s on the article
and 3.0 s on Contact, above the brief's 2.5 s. TBT is 4 to 144 ms across the runs (highest where the forms and the fit
check are bound) and CLS 0 in every run.

Where the simulated LCP comes from now (the Lighthouse network log, `/divisions/citizenship`, gzip): the document
(11 KB), then at 30 ms the page's own hero `citizenship-m.webp` (71 KB, high, preloaded), the two preloaded fonts
(46 KB), the two stylesheets (18 KB) and the header logo `IHG-Horizontal-Gold.svg` (18 KB), then the three deferred
scripts (62 KB) and, once the stylesheet is parsed, the other four font faces (94 KB). Nothing else loads before the
hero paints: the menu thumbnails and the footer logo are gone from the boot, and no unused preload remains. Under
the simulated 1.6 Mbps those 320 KB or so share the connection, and Lighthouse's estimate lands at 2.7 to 2.9 s. The real
browser paints the hero far sooner (the observed LCP in the unthrottled trace is 120 to 230 ms after navigation).

The home page's LCP element is the lead paragraph under the headline; its estimate is now steady at 2.6 to 2.7 s.
One run in each of the three rounds (the home page twice, Contact once) showed Chromium's first paint at 1.3 s with
the document loaded at 0.2 s, which Lighthouse turns into an LCP 0.3 to 0.6 s higher and a score of 88 to 92 for that
run; every other run paints at 0.12 to 0.25 s. Nothing in the page accounts for the gap (no request, no script and no
timer runs then), it moves between pages, and the medians are not affected, so it is reported and not chased. The intro veil costs the home page its Speed Index (3.2 s
against 1.4 to 1.7 s elsewhere: the screenshots change only when the veil lifts) and about one point; that is the
approved design.

## 7. What is fine

* CLS 0 on every page and run (the crown's box is reserved; the header, hero and fonts cause no shift).
* TBT 4 to 144 ms across the runs; the ES5 app costs little main-thread time, less now that it is minified and deferred.
* Fonts preloaded and swapped; no invisible text.
* No unused preload: every page preloads its own hero and nothing else, and the browser's console warning is gone.
* Image, font and logo caching headers are set in `_headers`; HTML is revalidated.
* No third-party request of any kind until GA4 or Turnstile keys are set.
* Accessibility, Best Practices and SEO at 100 on all four pages; axe finds no serious or critical violation on seven
  routes at two widths, with the mobile menu open as one of the states.

## 8. What remains

1. **LCP 2.6 to 3.0 s against the brief's 2.5 s.** The estimate is the shared download of everything the page needs
   before the hero paints. In order of weight, what would take it under: (a) the four font faces loaded after the
   stylesheet (94 KB: Inter 500 and 600, Cormorant 600 and 500 italic, all used above the fold), which could be cut to
   two by setting the headline and button weights from the two preloaded faces, a design decision for the Founder;
   (b) the header logo `IHG-Horizontal-Gold.svg` at 44 KB raw, 18 KB compressed, which a vector clean-up would bring
   under 5 KB (it is in `assets/logos`, shared with the sister sites, so it is left alone here); (c) the render-blocking
   stylesheet (one round trip plus 17 KB, 600 to 900 ms of the estimate), which only critical CSS inlining would remove,
   not done for the reason in section 1.
2. **Speed Index on the home page** (3.2 s) is the intro veil; a shorter veil would raise the score by about a point.
   Design, not touched.
3. **Event covers have no mobile crop**: `02.webp` (186 KB) serves `/journal` and the Easter Polo Cup page at every
   width. A crop as for the division photographs would halve it on phones.
4. **Test server and Lighthouse console**: `tests/serve.js` sends `Cache-Control: no-store`, so a page that fetches the
   same file twice shows two requests in a local log where the host would serve the second from cache.

## 9. Re-running

```
npm run check && npm run build && node tests/seo.js dist 8886
LAUNCH=1 npm run build && LAUNCH=1 node tests/seo.js dist 8886
node tests/serve.js dist 8887 &
NODE_PATH=$(npm root -g) node tests/smoke.js http://127.0.0.1:8887
node tests/serve.js . 8888 &
NODE_PATH=$(npm root -g) node tests/a11y.js http://127.0.0.1:8888
```

Lighthouse, on the `LAUNCH=1` build (the pre-launch `noindex` otherwise scores SEO 69 on the home page), three runs
per page, median by Performance score:

```
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npx lighthouse@13 http://127.0.0.1:8889/ \
  --chrome-flags="--headless=new --no-sandbox" --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=home.json
```

Serve with compression on, as Netlify does: the plain `tests/serve.js` costs 5 to 10 points. The scratch server used
here (not committed; put it anywhere and run `node gzip-serve.js dist 8889`):

```js
var http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
var ROOT = path.resolve(process.argv[2] || 'dist'), PORT = parseInt(process.argv[3] || '8889', 10);
var TYPES = {'.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.webp':'image/webp',
  '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.json':'application/json',
  '.webmanifest':'application/manifest+json', '.xml':'application/xml', '.txt':'text/plain', '.vtt':'text/vtt'};
var GZ = /\.(html|js|css|svg|json|webmanifest|xml|txt|vtt)$/;
http.createServer(function(req, res){
  var url = req.url.split('?')[0], fp = path.join(ROOT, decodeURIComponent(url)), status = 200, found = null;
  [fp, fp + '.html', path.join(fp, 'index.html')].some(function(f){ try{ if(fs.statSync(f).isFile()){ found = f; return true; } }catch(e){} });
  if(!found){ found = path.join(ROOT, '404.html'); status = 404; }
  var ext = path.extname(found).toLowerCase();
  fs.readFile(found, function(err, data){
    if(err){ res.writeHead(404); res.end('not found'); return; }
    var h = {'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': /\.(webp|jpg|png|svg|woff2)$/.test(ext) ? 'public, max-age=2592000' : 'public, max-age=0, must-revalidate'};
    if(GZ.test(ext) && /gzip/.test(req.headers['accept-encoding'] || '')){ h['Content-Encoding'] = 'gzip'; data = zlib.gzipSync(data); }
    res.writeHead(status, h); res.end(data);
  });
}).listen(PORT, '127.0.0.1');
```

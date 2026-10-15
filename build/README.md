# Build, prerender and search assets

`npm run build` turns the single-page source into one HTML file per route and writes the search assets. Netlify runs
it on every deploy (`netlify.toml`: command `npm run build`, publish `dist`, functions `netlify/functions`). The
source tree is unchanged: `index.html`, `assets/js/app.js` and `assets/js/data.js` stay the single source of truth.

## What the build produces

`dist/` holds:

* The site copied as it is: `assets/`, `shared/`, `site.webmanifest`, `_redirects`.
* One prerendered page per route, written twice so every static host serves the clean URL: `about.html` and
  `about/index.html`, `divisions/citizenship.html` and `divisions/citizenship/index.html`, and so on. The home page is
  `index.html`. Routes come from `window.IHG_APP.routes()` in app.js: the static pages, every division, every event,
  every insights article, privacy and terms (docs/BUILD-CONTRACT.md section 5). Query-string routes such as
  `/contact?about=citizenship` are served by the `/contact` page; the app reads the query on load.
* `404.html` from the app's not-found view, with the footer and its office contacts, marked `noindex` and without
  a canonical. With no catch-all rewrite in `_redirects`, Netlify serves it with a real 404 status.
* `robots.txt` (disallows only `/.netlify/`, points at the sitemap), `sitemap.xml` (every route, absolute URLs) and
  `journal/feed.xml` (RSS 2.0 of the journal entries and the insights, absolute links, a `pubDate` only where
  data.js records a full date).
* `_headers`, generated from `build/headers.template`: the security headers, the Content Security Policy with the
  sha256 of every inline script in `index.html`, the extra origins GA4 and Cloudflare Turnstile need (only when those
  keys are set in `data.js` config), and the pre-launch `X-Robots-Tag` (see below).

Each page carries its own title, description, canonical, Open Graph and Twitter card (absolute image URL: the page's
hero photograph, or `assets/img/og.jpg`) and JSON-LD: Organization with both offices on every page, BreadcrumbList on
inner pages, LocalBusiness per office and FAQPage on Contact, Article on insights articles, Event on event pages. All
of it is written by `setMeta()` in app.js from data.js, so client-side navigation updates the same tags.

## How the prerender works

`build/prerender.js` loads `index.html` into jsdom with the page's final URL (`config.siteUrl` plus the route), then
evaluates `data.js`, `shared/analytics.js` and `app.js` from disk. The app boots exactly as in a browser, draws the
route, writes the head tags, and the build serialises the result. jsdom lacks `matchMedia` and the scroll methods, so
the harness stubs them; `IntersectionObserver` is left absent on purpose, which makes the app mark every reveal element
visible at once. Nothing is fetched over the network and no browser is needed, so the Netlify build image only needs
`npm ci` (jsdom is a devDependency: leave `NODE_ENV` unset in Netlify, or devDependencies are skipped).

Before serialising, the build removes what belongs to a browser session: the `base` element the inline head script
adds, the GA4 script element, the clock values, the first-touch tracking values in hidden form fields (the browser
fills them from the real visit). It puts the intro veil markup back where the app removed it, rewrites relative asset
URLs to root-relative ones, sets `data-prerendered` on `html` and, with `BUILD_PREVIEW=1`, `data-preview`.

In the browser the app runs again on the prerendered page. Because the page carries `data-prerendered`, the first
render keeps the markup the browser has already painted (it was built by the same code), refreshes the first-touch
tracking values in the hidden form fields from the real visit, binds behaviour and marks every reveal element visible
straight away. Nothing fades out and back in, and the largest contentful paint is the prerendered one. A query string
that changes the view (`about`, `audience`, `goals`, `faq`, `cat`) still gets a full render; campaign parameters
(`utm_*`, `gclid`, `fbclid`) do not. Later navigations animate as before. On deep links the app removes the intro veil
as it always did; on the home page the veil shows from first paint on a first visit.

## Switches

| Variable | Effect |
|---|---|
| `LAUNCH=1` | Drops the pre-launch `noindex`: the `robots` meta tag in every page and the `X-Robots-Tag` header. Until then every build stays out of search engines, and `robots.txt` says so in a comment. Set it in Netlify under Site configuration, Environment variables, when the TO CONFIRM placeholders are resolved and the site may be indexed. |
| `BUILD_PREVIEW=1` | Sets `data-preview` on `html`. The app then shows photographs that still lack recorded consent (docs/BUILD-CONTRACT.md 4.8). Never set it on the production site. |

Both are read by `build/build.js` and by `tests/seo.js` (which checks the matching state).

## Configuration that feeds the build (assets/js/data.js, `config`)

* `siteUrl`: every canonical, social image, sitemap entry and feed link is built from it. TO CONFIRM: final production
  domain.
* `ga4`: the GA4 measurement id. When set, `shared/analytics.js` loads gtag.js cookie-free (consent defaults denied,
  `client_storage: 'none'`, no Google signals, no automatic page view) and the app sends one `page_view` per route
  change through `window.ihgPageView`. Conversion events go through `window.ihgTrack(name, params)`:
  `enquiry_submitted`, `phone_verified`, `booking_click`, `whatsapp_click`, `guide_download`, `quiz_completed`. Mark
  them as conversions in the GA4 property. TO CONFIRM: measurement id from Gilbert.
* `searchConsole`: the Search Console verification token. When set, the build writes the `google-site-verification`
  meta tag into every page. TO CONFIRM: token from Gilbert.
* `turnstileSiteKey`: when set, the CSP in `_headers` allows `https://challenges.cloudflare.com` for scripts and frames.
* Video ids in `data.js` (`video.hero`, `video.about`, the event and journal slots): when a slot has an id, the CSP allows
  that provider's player (`https://player.vimeo.com` or `https://player.mux.com`) in `frame-src`; a hosted loop file
  (`video.hero.src` on another origin) is allowed in `media-src`. With no ids, `frame-src` stays `'none'`.

Because the analytics configuration is cookie-free, no cookie notice is needed for it (brief section 8).

## Checks

```
npm run check                     # syntax and the no-em-dash rule
npm run build                     # writes dist/
npm run test:seo                  # starts a server on dist (port 8776 by default), checks every route and asset
node tests/seo.js dist 8777       # same, on another port
node tests/serve.js dist 8776 &   # then: node tests/smoke.js http://127.0.0.1:8776
```

`tests/seo.js` asserts, for every route: HTTP 200, `data-prerendered`, exactly one title, one description and one
canonical, an absolute `og:image`, the Open Graph and Twitter tags, an `h1`, no hash links or relative asset URLs left,
the robots state matching `LAUNCH`, valid JSON-LD of the expected types, and unique titles and descriptions across
pages. It also checks `robots.txt`, that `sitemap.xml` lists every route and nothing else, the RSS feed, `404.html`,
the inline script hashes in `_headers`, the absence of a catch-all rewrite, and that each hero preload is under 200 KB.

Lighthouse, mobile, against the dist server (Chromium from the Playwright install):

```
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npx lighthouse@13 http://127.0.0.1:8776/ \
  --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo
```

Run it on a `LAUNCH=1` build: the pre-launch `noindex` otherwise fails the "page is blocked from indexing" audit.

## Known limits

* Social cards use the page's own WebP photograph. WhatsApp and some older crawlers only render JPEG or PNG previews;
  `assets/img/og.jpg` (1200 by 630) is used where a page has no hero. TO CONFIRM: whether per-page JPEG cards are wanted.
* When the source tree (not `dist/`) is served through the single-page fallback, nested routes such as
  `/divisions/citizenship` trigger a speculative fetch of the relative asset URLs before the inline script adds the
  `base` element; the browser then fetches the right URL and the page is fine, but the test server logs 404s. The
  prerendered output uses root-relative URLs and does not have this. Keep running `tests/smoke.js` against `dist/`.
* The sitemap carries no `lastmod`: the content has no recorded change dates and none are invented.

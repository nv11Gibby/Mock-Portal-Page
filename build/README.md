# Build, prerender and search assets

`npm run build` turns the single-page source into one HTML file per route and writes the search assets. Netlify runs
it on every deploy (`netlify.toml`: command `npm run build`, publish `dist`, functions `netlify/functions`). The
source tree is unchanged: `index.html`, `assets/js/app.js` and `assets/js/data.js` stay the single source of truth.

## What the build produces

`dist/` holds:

* `assets/`, `site.webmanifest` and `_redirects` as they are, and `shared/` without the three lead files
  (`lead-routing.json`, `lead-schema.json`, `disposable-domains.json`): the functions bundle those through
  `netlify/functions/lib/config.js` and no page fetches them, so they are never published (the routing file lists
  every Pipedrive field key and option id, and all three carry TO CONFIRM notes). `shared/tokens.css`,
  `shared/analytics.js`, `shared/ecosystem.json` and `shared/chrome/` stay public for the sister sites.
* One prerendered page per route, written twice so every static host serves the clean URL: `about.html` and
  `about/index.html`, `divisions/citizenship.html` and `divisions/citizenship/index.html`, and so on. The home page is
  `index.html`. Routes come from `window.IHG_APP.routes()` in app.js: the static pages, every division, every event,
  every insights article, privacy and terms (docs/BUILD-CONTRACT.md section 5). Query-string routes such as
  `/contact?about=citizenship` are served by the `/contact` page; the app reads the query on load.
* `404.html` from the app's not-found view, with the footer and its office contacts, marked `noindex` and without
  a canonical. With no catch-all rewrite in `_redirects`, Netlify serves it with a real 404 status.
* `error.html` from the app's error view (`V.error`: "Something went wrong on our side", a Try again button that
  reloads, the office contacts), marked `noindex` and without a canonical. Nothing serves it automatically: neither
  `netlify.toml` nor `_redirects` names it. It is there for a host or an edge rule to return on a server error.
* `robots.txt` (disallows only `/.netlify/`, points at the sitemap), `sitemap.xml` (every route, absolute URLs) and
  `journal/feed.xml` (RSS 2.0 of the journal entries and the insights, absolute links, a `pubDate` only where
  data.js records a full date).
* `_headers`, generated from `build/headers.template`: the security headers, the Content Security Policy with the
  sha256 of every inline script in `index.html`, the extra origins GA4 and Cloudflare Turnstile need (only when those
  keys are set in `data.js` config), and the pre-launch `X-Robots-Tag` (see below).

Each page carries its own title, description, canonical, Open Graph and Twitter card (absolute image URL: the page's
hero photograph, or `assets/img/og.jpg`) and JSON-LD: Organization with both offices on every page, BreadcrumbList on
inner pages, LocalBusiness per office and FAQPage on Contact, Article on insights articles, Event on event pages that
have a full date (Google requires `startDate`, and no date is invented, so the other events carry no Event block). All
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
URLs to root-relative ones, sets `data-prerendered` on `html` (its value is the route the file was built for, `/404`
and `/error` for the two error pages) and, with `BUILD_PREVIEW=1`, `data-preview`.

The two hero `<link rel="preload" as="image">` lines in `index.html` belong to the home page. The build replaces them
on every page with that page's own hero as the app rendered it: the home picture with its desktop and mobile files
(each with its media query), the `pageHero` image on inner pages (plus a mobile source when the markup gives one),
the backdrop on `404.html` and `error.html`, and no preload on pages without a hero image (privacy, terms). A hero
over 200 KB is not preloaded: the build prints a `WARNING` naming the file and the pages, so it can be re-exported
under the limit (docs/PHOTO-SHOT-LIST.md), and `tests/seo.js` prints the same warning.

In the browser the app runs again on the prerendered page. Because the page carries `data-prerendered` naming the
route in the address, the first render keeps the markup the browser has already painted (it was built by the same
code), refreshes the first-touch tracking values in the hidden form fields from the real visit, binds behaviour and
marks every reveal element visible straight away. Nothing fades out and back in, and the largest contentful paint is
the prerendered one. An old `#/about` link is different: the server sends the home page (a hash never reaches it), the
head script rewrites the address to `/about`, and because the attribute says `/`, the app renders the About page in
full. A query string that changes the view (`about`, `audience`, `goals`, `faq`, `cat`) also gets a full render;
campaign parameters (`utm_*`, `gclid`, `fbclid`) do not. Later navigations animate as before. On deep links the app
removes the intro veil as it always did; on the home page the veil shows from first paint on a first visit.

## Switches

| Variable | Effect |
|---|---|
| `LAUNCH=1` | Drops the pre-launch `noindex`: the `robots` meta tag in every page and the `X-Robots-Tag` header. Until then every build stays out of search engines, and `robots.txt` says so in a comment. Set it in Netlify under Site configuration, Environment variables, when the TO CONFIRM placeholders are resolved and the site may be indexed. |
| `BUILD_PREVIEW=1` | Sets `data-preview` on `html` before the app renders, so the prerendered markup carries the photographs that still lack recorded consent (event galleries, the consent-gated home hero) and the hero preloads follow them (docs/BUILD-CONTRACT.md 4.8). Never set it on the production site. |

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
pages, and that the page's image preloads are exactly its own hero (desktop and mobile on the home page, none on
the legal pages, every file under 200 KB). It also checks `robots.txt`, that `sitemap.xml` lists every route and
nothing else, the RSS feed, `404.html` and `error.html` (noindex, no canonical, both office numbers, the email, the
reload button, their own backdrop preload), that every logo file named in `shared/ecosystem.json` is in the build,
the inline script hashes in `_headers`, the absence of a catch-all rewrite, that `dist/shared` holds no lead JSON
file, and that each event gallery is in the markup on a preview build and absent on a production one.

Lighthouse, mobile, against the dist server (Chromium from the Playwright install):

```
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npx lighthouse@13 http://127.0.0.1:8776/ \
  --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo
```

Run it on a `LAUNCH=1` build: the pre-launch `noindex` otherwise fails the "page is blocked from indexing" audit.

## Known limits

* Social cards: every page lists `assets/img/og.jpg` (1200 by 630, JPEG) as its first `og:image`, with its width and
  height, because WhatsApp, LinkedIn and some older crawlers only render JPEG or PNG previews; the page's own WebP
  photograph follows as a second `og:image` (and as `twitter:image`) for the services that render it. So a shared
  division or journal page previews with the Group card, not its own photograph. TO CONFIRM: whether per-page JPEG
  cards are wanted (they would be generated at build from each hero).
* When the source tree (not `dist/`) is served through the single-page fallback, nested routes such as
  `/divisions/citizenship` trigger a speculative fetch of the relative asset URLs before the inline script adds the
  `base` element; the browser then fetches the right URL and the page is fine, but the test server logs 404s. The
  prerendered output uses root-relative URLs and does not have this. Keep running `tests/smoke.js` against `dist/`.
* The sitemap carries no `lastmod`: the content has no recorded change dates and none are invented.

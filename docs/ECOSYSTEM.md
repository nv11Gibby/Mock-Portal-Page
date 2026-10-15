# The Imperial ecosystem: the shared base for every Imperial site

Brief section 7 asks for one foundation that every Imperial site reuses: the design tokens, the header and footer with
the "Our ecosystem" menu, one lead schema and one submission function, one analytics setup, and cross-links between
the sites. This document says how the pieces fit, what a new site starts from, and what is still TO CONFIRM. The
step-by-step adoption guide is `shared/chrome/README.md`; the lead backend is `docs/LEADS.md`; the build switches are
`build/README.md`.

## 1. The six sites

`shared/ecosystem.json` is the one list of the sites, in the order the ecosystem menu and the footer show them:

| Key | Site | Role | Website |
|---|---|---|---|
| `ihg` | Imperial Holdings Group | The parent of five specialist divisions, led from Dubai and Lagos | `https://www.imperialholdingsgroup.com` (TO CONFIRM: final domain) |
| `citizenship` | Imperial Citizenship | The flagship: second residency and citizenship by investment | `https://imperialcitizenship.com` (live) |
| `partners-club` | Imperial Partners Club | For professionals: the introducer network | TO CONFIRM |
| `private-office` | Imperial Private Office | For existing Clients: one lasting relationship | TO CONFIRM |
| `real-estate` | Imperial Real Estate | Coming soon: licensed property advisory, starting with Dubai | TO CONFIRM (at launch) |
| `academy` | Imperial Academy | Learning and standards: training and certification | TO CONFIRM |

Each entry carries `key` (the site key in `shared/lead-schema.json`), `name`, `short`, `role`, `tagline`, `url`,
`real` (true only where the URL is live), `tbc`, the logo file names under `assets/logos/`, and for IHG the
`journalFeed` path. The values are copied by hand into three places, because the pages are plain scripts and static
files that cannot fetch at run time: `assets/js/data.js` (`SITES`, exposed as `IHG.sites`), `shared/chrome/header.html`
and `shared/chrome/footer.html`. When a URL is confirmed, change the JSON first, then the three copies, and set
`real:true` in `data.js` so the link opens instead of showing the placeholder.

## 2. The package, piece by piece

| Piece | File | Who reads it |
|---|---|---|
| Design tokens | `shared/tokens.css` | Every page, linked before the site stylesheet. Colours, type families, page rhythm (`--pad`, `--max`, `--sec`, `--hdrH`), motion (`--e-*`, `--t1` to `--t5`). The values are the IHG design and do not change per site. One value differs from the v4 `site.css`: `--faint` was raised from .4 to .52 so the search result kind label reaches 4.5:1 (`tests/contrast.js`); the next site starts from .52. |
| Chrome | `shared/chrome/chrome.css`, `header.html`, `footer.html` | A new site pastes the two HTML files, fills the placeholders (including the five division photographs for the menu's third column, `shared/chrome/README.md` section 2 step 4) and links the CSS. IHG renders the same chrome from `index.html` and `buildChrome()` in `assets/js/app.js` (two IHG-only items aside, the search button and Our Network, which need `app.js`), and links `site.css` only. The CSS is a verbatim copy of the chrome rules in `site.css`, kept in sync by hand (the command in its header shows any drift). |
| Site list | `shared/ecosystem.json` | Section 1. |
| Lead schema | `shared/lead-schema.json` | Every form and `netlify/functions/lib/core.js`. The field names, allowed values, the four form names, the thirteen tracking fields, the score weights and the `sites` map with each site's default division. |
| Lead routing | `shared/lead-routing.json` | The functions: per division the owner (TO CONFIRM: user ids), lead or deal, pipeline and stage, Pipedrive field keys and option ids. Change this file, not the code. |
| Lead functions | `netlify/functions/submission-created.js`, `lead.js`, `verify.js`, `lib/` | Netlify Forms calls the first; the page falls back to the second; the third verifies a phone. One core for every site: a site sets `site` and its default division and nothing else (`docs/LEADS.md` section 9). |
| Analytics | `shared/analytics.js` | Every page, after the data file. Reads `IHG.config.ga4`; cookie-free GA4 with consent defaults denied, so no cookie notice; `window.ihgTrack` for the six conversion events; `window.ihgPageView` per route. Search Console is a meta tag the build writes from `config.searchConsole`. |
| Consent and preview | `data.js` photo registry, `build/build.js` | Every photograph carries `consent:true|false`; production builds hide photographs of guests without recorded consent and fall back to an own photo. `BUILD_PREVIEW=1` sets `data-preview` on `html` so a review build shows them. Never set it on the production site. |
| Build and launch switches | `build/build.js`, `build/README.md` | `npm run build` prerenders every route into `dist/` with its own meta, structured data, `robots.txt`, `sitemap.xml`, `journal/feed.xml`, `404.html` and `_headers` (CSP hashes). `LAUNCH=1` drops the pre-launch `noindex`; until then every build stays out of search engines. |

### What a page includes, in order

```html
<link rel="stylesheet" href="shared/tokens.css?v=5">
<link rel="stylesheet" href="assets/css/site.css?v=5">      <!-- a new site: its own CSS, then shared/chrome/chrome.css -->
...
<script src="assets/js/data.js?v=5"></script>                <!-- IHG.config: site, defaultDivision, ga4, siteUrl ... -->
<script src="shared/analytics.js?v=5"></script>
<script src="assets/js/app.js?v=5"></script>
```

## 3. Configuration a site sets (`IHG.config` in its data file)

| Key | IHG value | What it does |
|---|---|---|
| `site` | `ihg` | The hidden `site` field on every form; the core uses it with `lead-schema.json` `sites` |
| `defaultDivision` | `group` | The division a lead takes when the form does not name one |
| `siteUrl` | `https://www.imperialholdingsgroup.com` (TO CONFIRM) | Canonicals, social images, sitemap, feed |
| `leadEndpoint`, `verifyEndpoint` | `/.netlify/functions/lead`, `/.netlify/functions/verify` | The fallback and the verification step |
| `ga4`, `searchConsole` | empty (TO CONFIRM) | Analytics on, Search Console verification tag |
| `turnstileSiteKey` | empty (TO CONFIRM) | Spam check on every form; the CSP opens for Cloudflare only when set |
| `booking`, `whatsapp`, `guide` | see `data.js` | The next step after an enquiry; empty strings switch a feature off and show its `tbc` text |

An empty string switches a feature off and the page shows the `tbc` text where the feature would appear
(`docs/BUILD-CONTRACT.md` 4.1).

## 4. Cross-link rules

1. Every division page on IHG links to that division's own site through the division's `cta`, which is built from
   the site entry (`siteCta()` in `data.js`): the hero "At a glance" panel and the closing band both carry it. Where
   the site is not online the link shows the "Link to confirm" placeholder instead of navigating.
2. The "Our ecosystem" mega menu and the footer "Websites" column list all six sites on every page of every site,
   in the order of `ecosystem.json`. On IHG the IHG entry links to its own home; on a division site it links to the
   Group site.
3. Every division site links back to IHG (the footer "The Group" column, the "All divisions" link in the menu) and
   to the Journal feed, `/journal/feed.xml` on IHG, so the division sites and the Control Centre's Website and SEO
   agent can pull the Journal.
4. External links open in a new tab with `rel="noopener"`; links to the site's own pages do not.
5. A site never invents a URL: a missing one stays `#` with `data-tbc` and the placeholder text until it is
   confirmed in `ecosystem.json`.

## 5. What the next site, Imperial Citizenship, starts from

It starts from `shared/` as it is, with the base rules of `assets/css/site.css`, the fonts in `assets/fonts/`, the
logos in `assets/logos/` and the Netlify functions. What it must set:

| Setting | Value | Where |
|---|---|---|
| Site key | `citizenship` | `IHG.config.site`; the hidden `site` field on every form |
| Default division | `citizenship` | `IHG.config.defaultDivision`; matches `lead-schema.json` `sites.citizenship.defaultDivision` |
| GA4 id | TO CONFIRM (Gilbert) | `IHG.config.ga4` in its own data file; its own Search Console token in `searchConsole` |
| Routing owner | TO CONFIRM (Pipedrive user id) | `shared/lead-routing.json` `divisions.citizenship.owner`; the site then routes to the Leads inbox with the Division field set |
| Site URL | `https://imperialcitizenship.com` | `IHG.config.siteUrl`, for its own canonicals and sitemap |
| Chrome placeholders | its name, logo files (TO CONFIRM: a wordmark file), its contact and legal pages | `header.html`, `footer.html` |
| Lead delivery | its own Netlify site with the functions and the same environment variables, or IHG's functions with its origin in `LEAD_ALLOWED_ORIGINS` | `docs/LEADS.md` sections 6 and 9 |

The programme fit check, the guide form and the citizenship copy on IHG (`fit`, `guideCopy` and the citizenship
division entry in `data.js`) are written to be lifted as they are.

## 6. Keeping the copies in sync

* `shared/chrome/chrome.css` against `assets/css/site.css`: run the command in the CSS file header; it prints
  nothing while every rule line is verbatim.
* `shared/ecosystem.json` against `data.js` `SITES`, `header.html` and `footer.html`: change the JSON first, then
  the three copies. `npm run check` and the smoke test catch a broken script; the lists are visible in the footer of
  every page.
* `shared/lead-schema.json` against the hidden Netlify forms in `index.html`: every field in the schema must be in
  the hidden static form, or Netlify drops it.

## 7. TO CONFIRM

* The IHG production domain (`imperialholdingsgroup.com` is assumed in `config.siteUrl` and `ecosystem.json`).
* The Partners Club, Private Office, Real Estate and Academy website addresses, and when each goes live on the
  shared core.
* A wordmark file for Imperial Citizenship (the site sets its name in type next to the crown today), and a stacked
  wordmark for Imperial Partners Club (the horizontal file stands in for the footer; `logoTbc` in `ecosystem.json`).
* GA4 measurement ids and Search Console tokens, per site (Gilbert).
* Pipedrive owner user ids per division in `shared/lead-routing.json`, and whether Academy enquiries belong in the
  Introducer Pipeline.
* Turnstile keys, Twilio Verify service and channel, and the confirmation mailbox (`docs/LEADS.md` section 10).
* That the two office numbers are WhatsApp enabled.
* Whether a radius token should be added to `tokens.css` (radii are literal 2px and 4px values in the rules today).

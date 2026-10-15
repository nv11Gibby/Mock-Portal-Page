# The shared chrome: how a new Imperial site adopts it

The `shared/` folder is the base every Imperial site starts from (brief section 7). This file says how a new site
takes the design tokens, the header and footer, and the lead function. The wider picture (what the package contains,
the cross-link rules, the switches, what is still TO CONFIRM) is in `docs/ECOSYSTEM.md`; the lead backend in full is in
`docs/LEADS.md`.

| File | What it is |
|---|---|
| `shared/tokens.css` | The design tokens: colours, type families, page rhythm, header height, motion |
| `shared/chrome/chrome.css` | The header, mega menu, mobile menu and footer rules, copied from `assets/css/site.css` |
| `shared/chrome/header.html` | The header and the mobile menu, with the "Our ecosystem" menu linking the six sites |
| `shared/chrome/footer.html` | The footer: divisions, the Group, offices, websites, legal line |
| `shared/ecosystem.json` | The six sites: key, name, role, tagline, url, what is TO CONFIRM, logo files, the Journal feed |
| `shared/analytics.js` | GA4 cookie-free setup and `window.ihgTrack` for the six conversion events |
| `shared/lead-schema.json`, `shared/lead-routing.json`, `shared/disposable-domains.json` | The one lead schema and the routing the functions read |

## 1. Tokens

1. Copy `shared/tokens.css` as it is. Do not change a value: the tokens are the look.
2. Link it before the site's own stylesheet, with the same version query the site uses for its CSS:

   ```html
   <link rel="stylesheet" href="shared/tokens.css?v=5">
   <link rel="stylesheet" href="assets/css/site.css?v=5">
   ```

3. Copy the font files from `assets/fonts/` and the `@font-face` declarations from the top of `assets/css/site.css`
   (Cormorant Garamond for `--head`, Inter for `--sans`). They stay in the site stylesheet because their paths are
   relative to it.
4. Use the tokens in every rule: `var(--gold)`, `var(--head)`, `var(--pad)`, `var(--t3) var(--e-out)` and so on. The
   type scale (`.d1` to `.h4`, `.lead`, `.eyebrow`), the buttons (`.btn`, `.btn.line`, `.btn.gold`, `.btn.sm`), the
   text link (`.tlink`), `.wrap`, `.tbc` and `.vh` are base rules in `assets/css/site.css`; copy that block too, so the
   chrome and the pages share one vocabulary.

## 2. Header and footer

1. Link `shared/chrome/chrome.css` after the tokens and the base rules. IHG itself does not link it: `site.css`
   already holds every rule in it, and the file is a copy kept in sync by hand. The command in its header lists any
   drift between the two.
2. Paste `header.html` straight after the opening `<body>` (after the skip link) and `footer.html` after `<main>`.
3. Fill the placeholders. They are the only parts that differ per site:

   | Placeholder | Value |
   |---|---|
   | `{{SITE_NAME}}` | The site's name, for example `Imperial Citizenship` |
   | `{{HOME_URL}}` | The site's home, usually `/` |
   | `{{CONTACT_URL}}` | The site's contact page, for the Enquire now buttons |
   | `{{IHG_URL}}` | `https://www.imperialholdingsgroup.com` (TO CONFIRM: final domain), no trailing slash |
   | `{{LOGO_HORIZONTAL}}`, `{{LOGO_STACKED}}`, `{{LOGO_CROWN}}` | Files under `assets/logos/`, named per site in `shared/ecosystem.json` |
   | `{{PRIVACY_URL}}`, `{{TERMS_URL}}`, `{{YEAR}}` | The site's own legal pages and the current year |
   | `{{ACTIVE:item}}` | Replace with `aria-current="page"` on the current nav item or site; delete the rest |

4. Put the site's own pages in the `nav`. The items in the file are IHG's, as the example. Keep the "Our ecosystem"
   button and its menu: that is the piece the brief asks every site to share.
5. Add the small script the chrome needs. On IHG it is part of `assets/js/app.js`; the hooks are plain classes, so a
   short script does the same elsewhere:
   * `body.scrolled` once the page has scrolled 40px (solid header); `body.hdr-hide` when scrolling down past the
     first screen, removed on the way up; `body.solid-hdr` on pages without a dark hero.
   * The ecosystem button toggles `hidden` on `#mega`, `body.mega-open` and its own `aria-expanded`; Esc and a click
     outside close it.
   * The burger toggles `hidden` on `#mmenu`, `body.mm-open`, `aria-expanded` and `body.style.overflow`; inside the
     menu, the accordion button toggles `.open` on its `li.mm-acc` and `aria-expanded`.
   * The WhatsApp button toggles `hidden` on `#waPop` and `aria-expanded`.
   * A link with `data-tbc` is a site that is not online yet: show its text (IHG shows a toast "Link to confirm") and
     do not navigate. Replace the link with the real URL once it is confirmed in `shared/ecosystem.json`.
6. The six site links in both files, and the `sites` list in IHG's `assets/js/data.js`, are copies of
   `shared/ecosystem.json`. When a URL is confirmed, change the JSON first, then the three copies.

## 3. The lead function

The forms on every site post the same field names from `shared/lead-schema.json`, and one function writes the lead
to Pipedrive (`docs/LEADS.md`). A new site:

1. Sets its site key in the hidden `site` field (`citizenship`, `partners-club`, `private-office`, `real-estate`,
   `academy`) and leaves `division` out, so the lead takes the site's default division from the schema, or sets it
   to route elsewhere.
2. Keeps every tracking field (`source`, `medium`, `campaign`, `utm_*`, `gclid`, `fbclid`, `landing`, `referrer`,
   `page`, `consent`), the `company_url` honeypot and the privacy link next to the consent box.
3. Posts first to its own Netlify Forms (the hidden static copy of each form must list every field) and falls back
   to the JSON endpoint `/.netlify/functions/lead`. Deployed as its own Netlify site, it copies `netlify/functions/`
   and `shared/` and sets the same environment variables. To call IHG's functions instead, its origin goes into
   `LEAD_ALLOWED_ORIGINS` on the IHG site. Either way, nothing is sent without the environment variables.
4. Sets the owner for its division in `shared/lead-routing.json` (TO CONFIRM: the Pipedrive user ids).

## 4. Analytics

Include `shared/analytics.js` after the data file and before the app script. It reads `window.IHG.config.ga4`; each
site sets its own GA4 measurement id there (TO CONFIRM: ids from Gilbert) and the setup stays cookie-free, so no cookie
notice is needed. Send the six conversion events through `window.ihgTrack(name, params)`: `enquiry_submitted`,
`phone_verified`, `booking_click`, `whatsapp_click`, `guide_download`, `quiz_completed`.

## 5. Checklist for the next site

* `shared/` copied as it is; tokens linked before the site CSS; fonts and base rules copied.
* Header and footer pasted, placeholders filled, the chrome script in place.
* Links back to the Group site and to `/journal/feed.xml` present (the footer carries both).
* `config.site`, `config.defaultDivision`, `config.ga4`, `config.siteUrl` set; owner set in `lead-routing.json`.
* `npm run check` passes (no em dashes, ES5 syntax) and the forms post every field in the schema.

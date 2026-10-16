# Launch-readiness audit (v6 deliverable 8)

Written 16 October 2026 on branch `v6/launch`, cut from `ihg-site` at 29b461f. Every figure below was measured on a
fresh `npm run build` (production) and a `BUILD_PREVIEW=1` build (the build the Render preview serves) of that commit.
Mandate: docs/BRAND-BRIEF.md section 9, deliverable 8 ("all unresolved placeholders, legal claims, broken links and
technical issues"), read with section 6 (credibility).

## Verdict

The site is ready for Founder review as a prototype. Every automated check passes on both builds, there are 0 broken
internal links, anchors or assets, no production page claims a guaranteed outcome, influence, a price, a processing
time or a delivery that did not happen, and 101 of the 103 audited claims now read as docs/CLAIMS-AUDIT.md decided. One
caution for the review itself: on the preview build the Real Estate interest and guide forms still post and confirm
(D2), so reviewers should use the Start a Relationship journey, which is guarded. The site is not ready for the domain
to go live. Before that, counsel must approve the privacy notice and the terms and supply the legal entity, registered
address and licence line that every page shows as To confirm; the Group mailbox and the WhatsApp numbers shown on every
page must be confirmed as working; enquiries must reach named owners in Pipedrive, proved by the real end-to-end test;
the production domain must be confirmed; the four division website links must be filled or hidden; and three copy
defects must be corrected (Hekma Iskandarani's title, the "two of them in preparation" line, the Private Office line on
the home page). Then, once Zaid Alhindi, Founder and CEO, has approved the site, Gilbert Ferrer, Technology and AI Lead,
and Kaylan Tarin, Head of Systems, Intelligence and Digital Product, link the domain, and only after that is `LAUNCH=1`
set.

| Count | Value |
|---|---|
| Launch blockers | 11 |
| Visible placeholders that can launch as they are | 28 |
| "To confirm" chips in the built pages | 174 across 25 pages (45 distinct items), the same in both builds |
| Placeholder links (`href="#"`, the four division sites) | 209 across 25 pages (394 counting both clean-URL copies of each page; 402 with the 8 in the sister-site templates, the figure in docs/UX-AUDIT.md) |
| TO CONFIRM markers in source and config | 48 (data.js 16, app.js 6, lead-routing.json 8, ecosystem.json 7, lead-schema.json 5, shared/chrome 4, pipedrive.js 1, build.js 1) |
| Broken internal links, anchors or assets | 0 (3,220 references and 47 anchors in the production build, 3,394 in the preview build) |
| Defects found | 7 (section 8) |

## 1. Launch blockers

Each of these must be closed before the domain points at the site. "Where" names the file to change; nothing is to be
invented to fill a value.

| # | Item | Why it blocks | Owner | Where |
|---|---|---|---|---|
| B1 | Privacy notice and terms of use approved by counsel: data controller, retention period, applicable law and supervisory authority per office, where each provider stores data, the full terms and their jurisdiction, the date of the approved version | The site collects personal data through four forms. `/privacy` shows 18 chips and `/terms` 9, both under the amber "Awaiting legal review" notice. Without an approved notice the consent boxes point at a draft. | Counsel, with Gilbert Ferrer, Technology and AI Lead; Zaid Alhindi, Founder and CEO, approves | `assets/js/data.js` key `legal` (`legal.updated` at line 681); docs/PRIVACY-NOTES.md sections 3 and 4 |
| B2 | Legal entity, licence number and registered address | The footer of all 25 pages carries the chip "Legal entity, licence number and registered address"; the privacy notice says "published by [legal entity To confirm], trading as Imperial Holdings Group" (claim C25). The holding company is not yet incorporated. | Counsel and Zaid Alhindi | `assets/js/data.js` footer legal line and `legal`; shared/chrome/footer.html |
| B3 | Consent wording and consent record | The wording ("I agree to Imperial Holdings Group using these details to reply to me, as described in the privacy notice") and the record (`consent: yes`, page, time; `notice_version` empty until B1) wait for counsel's decision that they are enough. | Counsel | docs/PRIVACY-NOTES.md section 4 items 2 and 9; `consentBox()` in app.js |
| B4 | Group mailbox `info@imperialholdingsgroup.com` exists and is monitored | Shown as a working `mailto:` on all 25 pages, in the privacy notice as the rights mailbox, and in the failure message every form shows when a send fails. Claim C24: no record shows the mailbox exists. If it does not, the one fallback route for a failed enquiry goes nowhere. | Gilbert Ferrer; Zaid Alhindi decides whether to publish info@imperialcitizenship.com meanwhile | `assets/js/data.js` `contact.email` and `emailTbc` |
| B5 | WhatsApp on +971 4 546 1110 and +234 902 222 2024 | "WhatsApp us" in the header of every page opens `wa.me/97145461110` and `wa.me/2349022222024` with the chip "WhatsApp enabled on this number" (25 pages). A landline that is not on WhatsApp turns a primary contact route into a dead end. | Zaid Alhindi | `config.whatsapp` in data.js (lines 40 to 42) |
| B6 | Enquiries reach a named person: `PIPEDRIVE_API_TOKEN` in Netlify, the Pipedrive owner user id for each of the six routes, the Academy route decision, the Hot, Warm and Cold labels in the Leads inbox, and the real end-to-end test of docs/LEADS.md section 8 run once with approval | Without the token every submission is held only in the Netlify Forms inbox, which nobody is named to watch. The offline test (40 cases, mocked services) passes; the live path has not been proved. | Kaylan Tarin, Head of Systems, Intelligence and Digital Product (owners, labels, test); Gilbert Ferrer (token); Zaid Alhindi (owners) | shared/lead-routing.json lines 123 to 169 (`ownerTbc`, `divisionNote`); Netlify environment |
| B7 | Production domain | `config.siteUrl` (`https://www.imperialholdingsgroup.com`, TO CONFIRM) writes every canonical, `og:url`, social image URL, sitemap entry, feed link and the JSON-LD ids. A different domain means a rebuild with the right value before indexing. | Gilbert Ferrer | `assets/js/data.js` line 29; shared/ecosystem.json line 12; `sites[ihg]` in data.js |
| B8 | The four division website links | 209 links on 25 pages point at `#`, carry `aria-disabled` and a "To confirm" mark (mega menu, footer, division pages, comparison table). docs/LAUNCH-NOTES.md lists this as a blocker. Fill Partners Club, Private Office and Academy, or hide them; Real Estate may stay a placeholder until it launches. | Gilbert Ferrer | `sites[]` and each division's `cta` in data.js; shared/ecosystem.json; then `node tests/links.js` |
| B9 | Hekma Iskandarani's title | The About leadership card shows the amber chip "Group Chief Operating Officer". Claim C28 records that title as wrong (the mandate of 28 September 2026 says Board Member, Strategic Relationships). The chip makes the wrong title the visible text. Defect D1. | Zaid Alhindi confirms the title; then a one-line fix | `assets/js/data.js` line 269 (and line 102, the photo note) |
| B10 | Home and About say "two of them in preparation" | Only Real Estate and Academy are labelled in preparation; Partners Club is "Opening in stages" (pilot not started) and Private Office "By invitation, being established" (go-live not started). Read together, the line implies two divisions are operating that are not. Brief section 4: "Do not imply that services are operational if they are still being developed." Defect D3. | Zaid Alhindi approves the wording | `assets/js/data.js` line 130; `assets/js/app.js` line 362 |
| B11 | Private Office line on the home page | "Ongoing support for existing Imperial Clients after the first service is complete: relocation, schools, structuring and introductions" is present tense, drops "being established", and lists structuring without "through specialists" (claims C59 and C61 softened this on the division page, not here). Defect D4. | Zaid Alhindi approves the wording | `assets/js/data.js` lines 135 and 330 |

## 2. Can launch as a visible placeholder

Each of these shows as an amber "To confirm" chip or a quiet absence, says nothing untrue, and can stay at launch if
the Founder accepts it. Counts are pages in the production build.

| # | Item | Where it shows | What is needed | Owner |
|---|---|---|---|---|
| P1 | Booking pages for Dubai and Lagos (`config.booking`, both empty) | `/contact` (2 chips) and the "Book a first conversation" block in every success state, which shows two chips to every person who has just enquired | The Microsoft Bookings or Calendly URL per office; or hide the block until then (recommended) | Zaid Alhindi |
| P2 | Citizenship guide PDF (`config.guide.file` empty) | `/divisions/citizenship`: the guide form says "The guide is being finalised, and we will let you know when it is ready" with the chip "Guide PDF to be written and approved". Truthful as it stands. | The approved PDF; and who tells requesters when it is ready (division owner by reply today) | Zaid Alhindi; Kaylan Tarin for the follow-up |
| P3 | Final home hero photograph | `/` chip "Final hero photo"; the hero is the credited Unsplash Dubai skyline (no person in frame) | The city shoot (docs/PHOTO-SHOT-LIST.md) | Marketing team |
| P4 | Guest consent for the six events (`events[].consent`, all false) | Production shows typographic plates and no gallery; see section 6 | Signed consent per event, recorded as `consentRef` and `consentDate` | Marketing team |
| P5 | Founder film and three event highlight clips; Vimeo or Mux account; captions for the five `.vtt` files | `/about` "Footage to be supplied" (2 chips); three event pages "Highlights clip to be supplied" | Footage, an account, caption transcripts | Marketing team |
| P6 | Event facts: dates (3 events), exact dates (2), venues (2), occasion (2), descriptions (3), guests of honour (2 events), and titles for three guests at Grenada 51st (claim C76) | The six event pages | Dates, venues and guest lists from the Marketing SharePoint; the Grenada press release attached to the claims register (C75) | Marketing team |
| P7 | Imperial Real Estate journal row has no date | `/journal` | A date, or publish it dated at launch | Marketing team |
| P8 | Group history and key dates; both leadership biographies ("to be approved") | `/about` | Founding date and milestones; approved biographies | Zaid Alhindi |
| P9 | Spelling of the Founder's surname on the site (Al Hindi or Alhindi) | `/about`, search palette; no chip | The spelling to publish | Zaid Alhindi |
| P10 | Citizenship programme list and approved European programmes | `/divisions/citizenship` (2 chips) | The programmes to publish | Zaid Alhindi |
| P11 | Academy programme details and launch timing; scope and timing of wider courses | `/divisions/academy` (2 chips) | Timing, when known | Zaid Alhindi |
| P12 | Real Estate licence number and regulator | `/divisions/real-estate` chip; the record exists (RERA 1434417, Imperial Ventures Property L.L.C) | The Founder confirms the licensed entity trades as Imperial Real Estate (claim C67) | Zaid Alhindi |
| P13 | Real Estate website link | Mega menu and footer only | Its address at launch, or hide it | Gilbert Ferrer |
| P14 | The "Website address" cell in the divisions comparison table | `/divisions` | Follows B8 | Gilbert Ferrer |
| P15 | Imperial Citizenship wordmark file | shared/ecosystem.json `logoTbc` (the site uses the crown and the name set in type) | The file | Marketing team |
| P16 | Budget bands and currency on the Private Clients path | `/contact` journey (optional field) | Confirmation of the bands (taken from the build contract) | Zaid Alhindi |
| P17 | GA4 measurement id (`config.ga4` empty) | Nothing shows; analytics are off and the CSP stays closed | The id, then mark the six conversion events in GA4 | Gilbert Ferrer |
| P18 | Search Console token (`config.searchConsole` empty) | Nothing shows | The token, after the domain is live | Gilbert Ferrer |
| P19 | Cloudflare Turnstile keys (`config.turnstileSiteKey` empty, `TURNSTILE_SECRET_KEY`) | Nothing shows; the honeypot, rate limit and disposable list still run | Both keys; the privacy notice must then say it is on (B1) | Gilbert Ferrer |
| P20 | Twilio Verify credentials, channel and code length; Fraud Guard on | The verification step is skipped without a word | Credentials and settings | Gilbert Ferrer |
| P21 | Resend mailbox and verified domain (`EMAIL_API_KEY`, `EMAIL_FROM`) | No confirmation email is sent; the page never claims one was | The mailbox and domain | Gilbert Ferrer |
| P22 | Imperial OS webhook (`IMPERIAL_OS_WEBHOOK_URL`, secret) | Off: nothing leaves the function | Endpoint, secret, the master for each field, storage and retention; see the timing risk in section 7.6 | Gilbert Ferrer with the owner of imperial-ai-control-centre; counsel |
| P23 | Insights article author and date | The four articles (one chip each) | Follows P28 | Zaid Alhindi |
| P24 | Seven-day draft limit in the privacy notice | `/privacy`, "Analytics and cookies" | Whether to state it (docs/LAUNCH-NOTES.md) | Counsel |
| P25 | Per-page JPEG social cards | Every page shares the Group card `og.jpg` first | Whether they are wanted (build/README.md) | Marketing team |
| P26 | What Netlify function logs and the Forms inbox keep, and for how long | docs/PRIVACY-NOTES.md section 1 | The figure, for B1 | Gilbert Ferrer |
| P27 | Division taglines in the published `shared/ecosystem.json` | Not on any IHG page; read by the sister sites. "Personalised solutions for exceptional clients" (Private Office) uses words docs/voice-rules.json avoids ("solutions") | Founder approval of the taglines, or new ones in the v6 voice | Zaid Alhindi; marketing team |
| P28 | The four Insights articles and the Insights index | Reachable only by direct URL: no page links to them, the search palette and related reading leave drafts out, each is marked "Draft, awaiting approval" with an "Author and date" chip, and each keeps its own noindex even on a `LAUNCH=1` build | Approve, edit or drop, then remove `draft:true` in data.js | Zaid Alhindi |

## 3. Claims and legal

### 3.1 The 103 audited claims against the built pages

Each action in docs/CLAIMS-AUDIT.md was checked on the visible text, the attributes and the JSON-LD of all 25 pages in
both builds, and on the client-side strings in `dist/assets/js/data.js` and `app.js` (search palette, finder, journey).

| Action | Count | Holds in dist | Notes |
|---|---|---|---|
| Remove | 2 | 2 | C11 (brochure attribution) and the figures band are gone; C73 is now "How the houses work together. An illustration, not a case", in the conditional |
| Hold | 13 | 12 | C06 to C10 (no figure or counter remains: no "10+", "600+", "2,000+", "20+", "100+"); C14 (no United States or Asia); C24 (email carries the chip and is left out of every JSON-LD block); C25 (entity placeholder); C76 (the three untitled guests carry a title chip); C77, C78, C81 (softened descriptions, facts To confirm). **C28 does not hold**: the wrong title is the visible chip text (B9, D1) |
| Soften | 28 | 27 in full, 1 in part | Every proposed wording is present (for example "an office in Lagos", "Beyond the two cities", "Caribbean, Europe and the Gulf", "Opening in stages", "being established", "Structuring, through specialists", "will be certified as ready", "Partner Academy, to follow", "Diplomatic occasions"), and none of the old phrases remain. C50 is softened in part: the Partners Club "How it works" outcome and the draft article still say "Terms are honoured exactly as set out in your written agreement" (data.js line 321); the named Partner Agreement is gone, as the audit asked. Acceptable while introducer agreements exist; for the Founder to confirm |
| Keep | 60 | 60 | Unchanged and present |

### 3.2 New claims in the v6 copy

The new home page, About, the division lines and the Start a Relationship journey were read against the record.

| Where | Text | Finding |
|---|---|---|
| `/` Group intro (data.js line 130) and `/about` (app.js line 362) | "Four further divisions, two of them in preparation" / "five specialist divisions at one table, two of them in preparation" | Not supported: four of the five are not yet fully operating. B10 |
| `/` division band (data.js line 135, also line 330) | Private Office: "Ongoing support for existing Imperial Clients ... relocation, schools, structuring and introductions" | Present tense ahead of the record, and "structuring" without the specialist qualifier. B11 |
| `/about` (app.js line 362) | "one record of each family" | A commitment, consistent with Pipedrive as the system of record; no change needed, noted for the Founder |
| `/` hero | "One named person looks after each relationship for the long term" | A commitment (C39, C88); supported |
| `/` paths | Institutions: "Governments, missions, institutions and organisations exploring a relationship with the Group" | Describes who may write, not relationships held (C74); supported |
| Journey (`journeys` in data.js) | "One person will read this and reply personally"; received states | Commitments; no reply time, no "has read", no eligibility. Supported |
| `/` events and Journal | Grenada 51st sponsorship; Easter Polo Cup "hosts the after party" | As C75 and C79 |

### 3.3 Voice rules (docs/voice-rules.json)

All 63 `avoid` words and all 12 `never_claim` pattern sets were scanned, whole word and case-insensitive, over every
page of both builds (visible text, attributes, head tags, JSON-LD).

* `never_claim`: every match is an allowed denial: "We never guarantee", "does not guarantee" (the footer on
  25 pages and `/terms`), "Can you guarantee ... No one honestly can", "We claim no influence with, or shortcuts
  through, any government", "Do you give tax, legal or investment advice?" with its answer. No price, processing time,
  reply time, eligibility, delivery or partnership claim anywhere.
* `avoid`: 0 matches on any page. In the source, the Professional Partners profession list offers "Wealth adviser"
  (data.js line 512, a job title, shown only on the journey's second screen), and the unused `tag` values in data.js and
  the published `shared/ecosystem.json` taglines carry "solutions" and "Curated" (P27).
* `npm run check` (no em dash in any form): passes, 78 files.

### 3.4 Privacy, terms, indexing and consent

* Privacy and terms: complete in substance, under the amber "Awaiting legal review" notice; 18 and 9 chips (B1, B2).
  `legal.updated` is empty, so no "Last updated" date is shown.
* Consent wording: awaiting counsel (B3). Every form has an unticked consent box linking the notice; no marketing
  consent is asked or implied.
* Indexing: every page carries `<meta name="robots" content="noindex, nofollow">` and `_headers` sends
  `X-Robots-Tag: noindex, nofollow`. A `LAUNCH=1` build drops both (checked: 0 robots tags, no header line) and
  `tests/seo.js` passes on it. `robots.txt` allows crawling (so the noindex can be read) and names the sitemap.
* Drafts: the five Insights pages are prerendered, noindex and out of the sitemap and the feed in every build.
* Cookies and analytics: the site sets no cookie. GA4 is off (`config.ga4` empty); when set, it runs cookie-free with
  consent denied by default and `client_storage: 'none'`, so no banner is shown. Counsel to confirm per office
  (docs/PRIVACY-NOTES.md section 4 item 5). With no keys set the Content Security Policy allows no third-party origin.

## 4. Links

Measured with `node tests/links.js` (added in this round; reads `dist/` with jsdom, no server or network) on both
builds, and with `tests/smoke.js` in a browser.

| Measure | Production | Preview |
|---|---|---|
| HTML pages checked (2 sister-site templates in `shared/chrome` skipped: their `{{TOKENS}}` are filled on the sister sites) | 47 | 47 |
| Internal references checked (href, src, srcset, preloads, icons, social images, CSS `url()`, manifest, sitemap, feed, ecosystem logos) | 3,220 | 3,394 |
| Fragment anchors checked | 47 | 47 |
| Broken | **0** | **0** |
| Placeholder links `href="#"` | 394 (209 per unique page) | 394 |
| Old hash routes (`href="#/..."`) in the markup | 0 | 0 |
| Sitemap URLs / feed links | 18 / 6 (all resolve) | 18 / 6 |

* Placeholder links: the four division sites only (B8, P13). Each carries `data-tbc`, `aria-disabled="true"` and a
  visible "To confirm" mark, and opens the "Link to confirm" toast.
* Old hash routes: `/#/contact` and `/#/about` land on Contact and About (smoke test, desktop and mobile).
* 404 and error pages: `404.html` and `error.html` are noindex, carry no canonical, show both offices, the email and
  (error) the reload button; `_redirects` has no catch-all, so an unknown path gets `404.html`. `error.html` is served
  by nothing automatically (build/README.md). The local server answers `/does-not-exist` with 404.
* Sitemap and robots: `sitemap.xml` lists the 18 published routes and nothing else; `robots.txt` disallows only
  `/.netlify/`.
* External URLs (25 distinct; this sandbox cannot reach them, so each is to confirm from a normal connection):

| URL | Files | Check |
|---|---|---|
| https://imperialcitizenship.com | 50 | Live site answers |
| https://wa.me/97145461110 and https://wa.me/2349022222024 | 48 each | Opens a WhatsApp chat (B5) |
| https://unsplash.com/photos/7Zt3XXXp3II and https://unsplash.com/photos/dYLzGcPqrtE | 47 each | Photo credits resolve |
| `https://wa.me/?text=...` share links | 10 (2 files each) | One per event and article |
| `https://www.linkedin.com/sharing/share-offsite/?url=...` | 10 (2 files each) | One per event and article; the shared URL uses `config.siteUrl` (B7) |
| `mailto:info@imperialholdingsgroup.com` | all pages | B4 |
| `mailto:?subject=...` share by email; `tel:+97145461110`, `tel:+2349022222024` | | No check needed |

## 5. Technical

### 5.1 Check results (16 October 2026, this worktree)

| Check | Production build | Preview build |
|---|---|---|
| `npm run check` | Pass (78 files, no em dash) | |
| `npm run test:functions` | Pass, 73 of 73 | |
| `npm run build` | 23 pages plus `404.html` and `error.html`, pre-launch noindex; sitemap 18; feed 4 items | Same, with `data-preview` |
| `tests/seo.js` | Pass, 23 routes and the search assets (port 8940); also pass on a `LAUNCH=1` build (port 8944) | Pass (port 8942) |
| `npm run test:contrast` | Pass, 21 colour pairs | |
| `tests/smoke.js` | Pass, 38 page loads, no console error, failed request or broken image (port 8941) | Pass, 38 (port 8942) |
| `tests/a11y.js` | Pass, 14 checks, no serious or critical axe violation, every focused control shows focus. Undecided by axe: text over photographs, `aria-prohibited-attr` on `#rail`, `label-content-name-mismatch` on the share-by-email link | |
| `tests/e2e-leads.js --port 8943` | Pass, 40 cases in 86 s, 276 mocked calls; nothing left the machine | Case 8.4 covers the journey on a preview build |
| `node tests/links.js` | Pass, 0 broken | Pass, 0 broken |
| Lighthouse mobile | Not run: no `lighthouse` package in `npm root -g`, and `npx lighthouse@13` would download from the network. The last figures (docs/PERFORMANCE.md section 6: Performance 93 to 96, Accessibility, Best Practices and SEO 100, LCP 2.6 to 3.0 s) predate v6. Re-run on a `LAUNCH=1` build from a normal connection. | |

### 5.2 Page weight (Playwright, uncompressed transfer, gzip computed for text; no scrolling, then after a full scroll)

| Page | Mobile, first load | Mobile, after scrolling | Images | Fonts |
|---|---|---|---|---|
| `/` | 16 requests, 748 KB (285 KB gzip) | 17, 792 KB (302 KB gzip) | 234 KB | 92 KB |
| `/divisions/citizenship` | 13, 650 KB (247 KB) | 14, 693 KB (264 KB) | 76 KB | 116 KB |
| `/contact` | 14, 629 KB (249 KB) | 15, 672 KB (266 KB) | 93 KB | 116 KB |
| `/journal` | 11, 610 KB (214 KB) | 12, 654 KB (231 KB) | 76 KB | 92 KB |

Desktop adds 27 to 69 KB of images. The preview build adds the event photographs: the home page grows to 1,584 KB
(1,049 KB of images) and `/journal` to 1,540 KB after scrolling. HTML documents are 107 to 199 KB raw (the Insights
index is the largest) and 20 to 26 KB gzip. Scripts: `app.js` 148 KB and `data.js` 89 KB minified; stylesheet 89 KB.

### 5.3 Console errors and JavaScript off

* Console: no error or warning on the four pages above at either width, in either build; the smoke test saw none on 38
  loads. The only console error in the whole run is the 500 the e2e test provokes on purpose (case 8.3).
* JavaScript off: every page tested (`/`, `/about`, `/divisions/citizenship`, `/divisions/real-estate`, `/journal`,
  `/contact`) answers 200 and paints its heading and full text from the prerendered markup (3.5 to 7.6 thousand
  characters), with the page's own form visible. The `noscript` banner nevertheless says "This website needs
  JavaScript to display", which is no longer true (D5).

### 5.4 Host behaviour (to confirm after the first deploy; cannot be seen from a local server)

| Check | Command | Expected |
|---|---|---|
| 404 status | `curl -sI https://<host>/no-such-page` | `HTTP/2 404` with the body of `404.html` |
| HTML caching | `curl -sI https://<host>/about` | `cache-control: public, max-age=0, must-revalidate`, not `no-store` |
| Compression | `curl -sI -H 'Accept-Encoding: br, gzip' https://<host>/assets/css/site.css?v=5` | `content-encoding: br` or `gzip` on HTML, CSS, JavaScript, JSON and SVG |
| Headers | `curl -sI https://<host>/` | The CSP and security headers from `dist/_headers`; `X-Robots-Tag` until `LAUNCH=1` |
| Forms detected | Netlify UI, Forms | Four forms: `enquiry`, `contact`, `interest`, `guide` (hidden copies with `data-netlify` are in every page) |

### 5.5 Form submission paths

* Order: a urlencoded POST to `/` (Netlify Forms, which then runs `submission-created`); if that fails or stalls for 15
  seconds, a JSON POST to `/.netlify/functions/lead`; if both fail, "We could not send this just now" with both
  office numbers and the email, and the draft stays on the device (`submitLead()`, app.js lines 1297 to 1310).
* Wording follows what happened: after Netlify Forms, "Received by Imperial ... being passed to {division}"; after the
  direct endpoint, which answers only once Pipedrive took the record, "Received, and with {division}" and the reference
  (e2e case 8.3). A refused address says "Nothing has been sent yet". No confirmation email, verification or booking
  is claimed when it is switched off.
* Preview build, journey: nothing is posted; the closing screen shows "Preview build: nothing is sent from this
  preview" and the confirmation is labelled "Preview of the confirmation. Nothing was sent." (e2e case 8.4).
* Preview build, Real Estate interest and citizenship guide forms: they do post, and show "Your interest in Imperial
  Real Estate is registered" or the guide message with no preview label (D2). Whether the Render preview answers a
  POST to `/` with a success decides whether a reviewer is told something was registered when it was not.

### 5.6 The Imperial OS webhook timing risk (docs/LEADS.md section 11)

The handoff is off (no URL), so there is no risk today. When it is switched on: the copy is sent at the end of
`processLead()`, after the Pipedrive writes, with a 5 second timeout and one retry after 2 seconds
(`netlify/functions/lib/imperial-os.js` lines 18 and 19), so up to about 12 seconds. On the direct endpoint the page
gives up after 15 seconds, and Netlify's default limit for a synchronous function is 10 seconds (to confirm for this
account). A slow receiver can therefore end the function after Pipedrive has stored the enquiry, and the person is told
"We could not send this just now"; if they send again, a second lead is created for the same person. The Netlify Forms
path is not affected, as the page has its answer before the function runs, but the background function has the same
time limit, so a slow receiver loses the Imperial OS copy without a trace in the page. Before switching it on: confirm
the function limit, have the receiver answer within 2 seconds (or accept and queue), or send the copy from a background
function. Owner: Gilbert Ferrer with the owner of imperial-ai-control-centre.

## 6. Events: consent and what each build shows

| Event | `consent` | Production | Preview |
|---|---|---|---|
| Grenada 51st Independence Day After Party, Dubai | false | Typographic plate on the ink field, no gallery | Gallery shown (7 image files) |
| The Lagos Diplomatic Soirée 2025 | false | Plate, no gallery | Gallery shown (10 image files) |
| Gala Dinner, Lagos | false | Plate, no gallery | Gallery shown (10 image files) |
| Easter Polo Cup After Party | false | Plate, no gallery | Gallery shown (7 image files) |
| An Evening at the Lagos Office | false | Plate, no gallery | Gallery shown (10 image files) |
| A Private Dinner at DANI, The Delborough | false | Plate, no gallery | Gallery shown (9 image files) |

* Home page: production shows no event photograph (the "Selected events" cards and the Journal rows are typographic);
  the preview shows four gathering photographs, plus the covers on the two event cards and the three Journal rows (the
  brief's target is three to four event images on the home page, which the four gathering photographs meet).
* No guest appears in any production page. The two leadership portraits are recorded as consented staff photographs;
  the hero and the Real Estate photograph are credited Unsplash images with nobody in frame.
* No photograph of the woman in the white suit at Grenada 51st is referenced anywhere in either build.
* `tests/seo.js` asserts the galleries are present on the preview build and absent on the production build.

## 7. Go-live checklist, in order

1. Zaid Alhindi, Founder and CEO, reviews the prototype on the Render preview and decides B9 to B11, P28 and the wording
   in section 3.2.
2. A developer fixes D1 to D7 (section 8), runs `npm run check`, the build, `tests/seo.js`, `tests/links.js`, smoke,
   a11y and e2e, and records the results.
3. Counsel, with Gilbert Ferrer, Technology and AI Lead, closes B1 to B3: the entity, address, licence line, data
   controller, retention, law, terms and consent wording, and the date of the approved version in `legal.updated`.
4. Gilbert Ferrer confirms the production domain (B7) and the Group mailbox (B4); Zaid Alhindi confirms WhatsApp on
   both numbers (B5).
5. Gilbert Ferrer fills or hides the division site links (B8) and runs `node tests/links.js`.
6. Kaylan Tarin, Head of Systems, Intelligence and Digital Product, sets the Pipedrive owners and labels (B6); Gilbert
   Ferrer sets `PIPEDRIVE_API_TOKEN` and, if wanted at launch, the Turnstile, Twilio and Resend keys; the privacy
   notice is updated to say which are on.
7. Kaylan Tarin runs the real end-to-end test of docs/LEADS.md section 8 with approval, on a Netlify deploy preview,
   and records the Pipedrive ids.
8. Marketing team and Zaid Alhindi decide which placeholders in section 2 stay visible at launch (at least P1, the
   booking block in the success state).
9. Gilbert Ferrer runs Lighthouse mobile on `/`, `/divisions/citizenship`, `/contact` and `/journal` on a `LAUNCH=1`
   build from a normal connection, and opens every external URL in section 4.
10. Zaid Alhindi approves the site for go-live.
11. Only then, Gilbert Ferrer and Kaylan Tarin link the domain to the Netlify site, with `BUILD_PREVIEW` unset.
12. On the live host, Gilbert Ferrer runs the five checks in section 5.4.
13. Only then, Gilbert Ferrer sets `LAUNCH=1` in Netlify, redeploys, confirms the robots tag and header are gone, and
    sets `config.searchConsole` and `config.ga4` if they are to be used.

## 8. Defects found

Nothing was fixed in this round. Each defect is in the source, with its line on commit 29b461f.

| # | Defect | File and line | Effect |
|---|---|---|---|
| D1 | Hekma Iskandarani's role is the wrong title wrapped in a chip: `role:'Group Chief Operating Officer', roleTbc:true` renders the chip text "Group Chief Operating Officer" | `assets/js/data.js` line 269 (also the photo note at line 102, and the search keyword "coo" at `assets/js/app.js` line 2044) | A title recorded as wrong (claim C28) is the visible text on `/about`. The chip should read "Title" until the Founder confirms one |
| D2 | The Real Estate interest form and the citizenship guide form post on a preview build; only the journey checks `PREVIEW` | `assets/js/app.js` lines 1655 and 1679 (the journey's guard is at line 1883) | On the preview, a reviewer can be told "Your interest in Imperial Real Estate is registered" when nothing was stored (confirmed against a local server that answers POST with 200) |
| D3 | "two of them in preparation" | `assets/js/data.js` line 130; `assets/js/app.js` line 362 | Implies two more divisions operate than do (B10) |
| D4 | Private Office line on the home page keeps the pre-audit present tense and lists structuring without specialists | `assets/js/data.js` lines 135 and 330 | Ahead of the record (B11; claims C59, C61) |
| D5 | The `noscript` banner says "This website needs JavaScript to display" | `index.html` line 94 | Untrue since prerendering: every page reads without JavaScript. Something like "Some features need JavaScript" would be accurate |
| D6 | The guide success state reads "Thank you, Test. Thank you. The guide is being finalised ..." | `assets/js/app.js` line 1373 with `assets/js/data.js` line 672 | "Thank you" twice |
| D7 | Partners Club outcome line keeps "Terms are honoured exactly as set out in your written agreement" | `assets/js/data.js` line 321 (and the draft article) | Claim C50 softened in part only; for the Founder to confirm or align with "governed by a written agreement" |

## 9. How this was measured

* Builds: `npm run build` and `BUILD_PREVIEW=1 npm run build`, each copied aside and served with `tests/serve.js` on
  ports 8941 (production) and 8942 (preview); `tests/seo.js` on 8940, 8942 and 8944 (`LAUNCH=1`); e2e on 8943.
* Placeholders: every `.tbc` element and `data-tbc` attribute in the 25 unique pages, read with jsdom.
* Claims: the old and proposed wording of each remove, hold and soften item searched in the visible text, attributes,
  head tags and JSON-LD of every page and in the built `data.js` and `app.js`.
* Links: `node tests/links.js dist` (exit 1 on any broken reference; `--json out.json` writes the full list).
* Weights, console and JavaScript off: Playwright (Chromium 1194) at 390 by 844 and 1440 by 900.

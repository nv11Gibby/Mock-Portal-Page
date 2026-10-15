# Imperial Holdings Group website: refinement round report

Date: 15 October 2026 (Dubai). Source: branch `ihg-site` of github.com/nv11Gibby/Mock-Portal-Page. Review link: https://ihg-website-preview.onrender.com (preview build: photographs that still await guest consent are shown; the production build hides them).

## 1. What changed, with commits

Everything below is on `ihg-site`, one commit per section of the brief, each built and checked before it was committed. The baseline was cacb258 (the v4 site). The round adds about 10,500 lines across 132 files in 81 commits; the design is unchanged.

**Setup.** 8c046c9 the brief (docs/REFINEMENT-BRIEF.md), the build contract (docs/BUILD-CONTRACT.md: field names, endpoints, config, ownership), site config in data.js, local test tools. f6b2575, 9f606d2 tooling.

**Section 3, leads.**
- 4401959 shared lead schema and routing config (shared/lead-schema.json, shared/lead-routing.json), disposable domain list (765 providers).
- 779c1cd lead score (timeline, budget, division fit, source) written to Pipedrive as the deal label Hot Lead, Warm Lead or COLD LEAD, a title prefix and a line in the note.
- 1ba1929 phone verification module (Twilio Verify) and spam module (honeypot, rate limit, Cloudflare Turnstile, email validation and disposable block).
- 81aa86d one delivery core shared by the Netlify Forms function, the direct fallback endpoint and the verify endpoint; dedupe by email then phone; returning people get a follow-up activity instead of a duplicate; owner mapping lives in shared/lead-routing.json.
- b020358 docs/LEADS.md (configuration, every environment variable, the human end-to-end test steps).
- b6d5565 forms send through Netlify Forms and fall back to our own function; a draft of every form is kept on the device; when both fail the visitor sees both office numbers and the email.
- b843229 qualification fields on the enquiry card and in the Contact flow (nationality, for whom, timeline, budget; firm and profession for Partners Club; buy or rent and area for Real Estate), all shown in the Pipedrive note.
- 34220c4 phone verification step after sending (WhatsApp or SMS code, skip allowed); Turnstile loads only when a key is set.
- 4db9737 booking buttons per office with name, email and division prefilled; WhatsApp buttons in the header and under each office; citizenship programme fit check that prefills the enquiry; guide form.
- 3251752 privacy notice linked next to every consent box.

**Section 4, search.**
- d9ea0c7 every route is a real page (23 pages, each written as x.html and x/index.html), with its own title, description, canonical, Open Graph and Twitter card, JSON-LD (Organization, BreadcrumbList, LocalBusiness, FAQPage, Article, Event), robots.txt, sitemap.xml, a generated _headers with the CSP hashes, cookie-free GA4 loader that stays off until an id is set, LAUNCH and BUILD_PREVIEW switches (build/README.md).
- e80eeaa RSS feed (journal/feed.xml). ba0c15e 404 page rendered at build in the house style.

**Section 5, media.** d701264 stock photographs removed (dunes, dunes2, cistern, arches, monaco, paris, sils, grenada, contact, the generated skylines); two credited stock images kept for now (the Real Estate aerial, the Dubai skyline behind the social card); photo registry with consent flags; hero from own photographs marked TO CONFIRM; consent gating with fallbacks; video block type (Vimeo or Mux, poster, captions, click to play; hero loop only when motion and data allow); docs/PHOTO-SHOT-LIST.md.

**Section 6, journal.** 02e6c32 video slot per entry and event, related row, share row on events, the two SAMPLE rows removed, no "Date to confirm" text (no date line where the date is unknown), guest galleries hidden until consent is recorded.

**Section 7, ecosystem.** 6f3df95 design tokens moved to shared/tokens.css without a value change; 78a837c shared header and footer package (shared/chrome); 1d771e1 all six sites listed from one source (shared/ecosystem.json); 4fd08a4 docs/ECOSYSTEM.md.

**Section 8, trust.** 353f37e complete privacy notice for counsel, contrast check (one token raised for contrast); 3a58ac5 accessibility: visible focus everywhere, spoken form errors, alt audit, axe test (npm run test:a11y); 4028cca 404 and error pages with the office contacts, error view when a page fails; 1ff0847 unused fonts and logo variants removed, docs/PRIVACY-NOTES.md.

**Verification round.** Four independent reviews (lead flow, security, search, copy) and two audits (build and Lighthouse, content and accessibility) raised 51 findings and 20 issues; 17 of the 20 non-trivial findings were confirmed by an adversarial check and fixed, the rest were small polish. Fixes, one commit each: 1f213c7 search-engine visitors scored as organic; a42a772 a verified phone is recorded only on the person who holds it; 13ae36c a returning person is never overwritten when Pipedrive cannot be read; e48516c the Leads inbox labels (not deal label ids) on leads; d568925 brakes against SMS pumping on verification; 2629fcf fixed-text confirmation email; 031b023 lead config kept out of the public build, preview photographs prerendered, each page preloads its own hero; c062b6e token in the header, full-digit phone search, trunk zero, prototype keys; 47239ec docs and config; 019a116 route marker, hero sources, Event JSON-LD only with a date, meta lengths, JPEG social card first; dd8e2c8 copy; bc82083 send button state, disposable addresses refused on the page, honeypot, verification wording, drafts and timeouts; eada9f4 acceptance report; 5183081 to c4092a6 shared package and docs corrections; ed85eb1 disposable list public.

**Second round (performance, content and design).** Two further fixers worked from the Lighthouse audit, the design review and the content audit, then two independent verifiers tried to break the result. Performance: 82a5f6d the mobile menu's five division thumbnails load only when the menu opens; 1c6ec77 stylesheets and scripts minified into the build (source stays readable ES5, CSP hash unchanged); 8621cb5 the Partners Club and Real Estate heroes re-exported under 200 KB and every hero file guarded by the test; 482a89d the test server can answer unknown paths with the 404 page as the host does; d76ba08 scripts deferred so the prerendered page paints first, lazy footer logo, reserved crown box (CLS 0); d68f77c docs/PERFORMANCE.md rewritten with the measurements. Content and design: ace442c the four Insights articles become drafts awaiting approval (reachable by address, noindex, out of the sitemap, feed, search palette and related rows, "Draft, awaiting approval" where "Sample" stood); 4535a87 the em dash glyph drawn as a short gold rule, and the copy check now catches every escape and entity; cadce8c the dark approved hero restored with a consent-free crop of the gala stage lights (nobody in frame, no sister-brand crest) behind its own scrim; 97aaf62 one neutral own photograph per event, no event illustrated with another's banner, no scene more than twice a page; 5a441e2 three layout defects (budget placeholder, Contact booking labels, video pill); ec69420 division pages print their own site name and domain; 44a83be descriptive gallery alt text, captions track on the hero loop, guide copy that promises no file; c76949b docs/CONTENT-AUDIT.md section 11. After the merge: cdd0947 copy check skips the worktree folder; 717b142 the guide confirmation email promises no file either, and the hero notes name the new fallback. Two independent verifiers then tried to break the merged result (CSP applied as a header in Chromium, minified scripts parsed as ES5, every photograph on the site viewed, the hero measured against the v4 screenshots, every test rerun): nothing was broken; they raised one visible defect and five polish points, fixed in 4c55fef (the Delborough dinner printed Lagos twice; Lagos placeholders for that dinner; the search palette shows each event its own photograph; an event page whose clip is still to be supplied says so in its heading; the guide consent line matches the form; the Insights listing stays unindexed and out of the sitemap while every article is a draft; the performance notes describe the merged build).

## 2. Test results

| Check | Result |
|---|---|
| npm run check (syntax, British English, no em dash in any form, 64 files) | pass |
| npm run test:functions (lead core, endpoints, score, verify, validate; Pipedrive, Twilio, Turnstile and Resend mocked) | 62 pass, 0 fail |
| npm run build (default, LAUNCH=1, BUILD_PREVIEW=1) | 23 pages + 404.html and error.html, no problems |
| npm run test:seo (every route: 200, one title, description and canonical, social tags, JSON-LD types, sitemap, robots, feed, 404, CSP hashes, hero sizes) | pass |
| npm run test:contrast | 21 colour pairs pass |
| npm run test:a11y (axe, desktop and mobile, six routes plus the open menu and palette; focus walk) | 14 checks pass, no serious or critical issue |
| Smoke (38 page loads, desktop and mobile, console clean, no broken image, no overflow) | pass |
| npm run test:e2e (acceptance tests 1 to 4, offline) | 33 cases pass |
| Lighthouse 13 mobile, LAUNCH=1 build, gzip, median of three runs (acceptance test 6) | Performance 95 (home), 95 (citizenship), 96 (article), 93 (contact), up from 79, 88, 79, 87; Accessibility, Best Practices and SEO 100 on all four; CLS 0; lowest single run 92. LCP 2.6 to 3.0 s simulated, 0.1 to 0.5 s above the 2.5 s target (fonts, header logo and the stylesheet, not the photographs; docs/PERFORMANCE.md section 8 lists what would take it under) |
| Placeholder search over the built site (acceptance test 8) | No "Sample", "BOOKING LINK" or "Permissions to confirm" anywhere. 258 "To confirm" placeholders, all rendered in the amber placeholder style, plus three TO CONFIRM notes (final domain, WhatsApp numbers, legal entity); every one is on the list in section 3 |

**Acceptance tests 1 to 4 (lead flow).** Run offline with the real Netlify functions and a mocked Pipedrive, because the live token is only set in Netlify. Each of the six contact choices, on desktop and mobile, produced the right record: citizenship, private office and real estate as leads in the Leads inbox; partners club and academy as deals in Introducer Pipeline [2026], stage Introducer IN; group as a deal in Opportunity Requests, stage New Request; each with the score label or title prefix, the Division and Contact Type fields, the person marked Not Verified, a note with all thirteen tracking fields and a confirmation email. Disposable addresses and the honeypot are rejected on both paths. Verification with the code marks the person Verified and adds a note; skipping leaves Not Verified. Booking buttons carry name, email and division. The fallback endpoint takes the lead when Netlify Forms fails; when both fail the visitor sees both telephone numbers and the email and the draft survives a reload. The guide form and the programme fit check reach the backend with their source and answers. Mock record ids are in docs/ACCEPTANCE.md. **Live Pipedrive deal ids are not available yet:** they need the Netlify deploy with PIPEDRIVE_API_TOKEN; the steps are in docs/LEADS.md section 8 and take about fifteen minutes.

**Acceptance test 5 (meta).** Every sitemap URL answers 200 with one title, one description, one canonical without trailing slash, absolute og:image, Twitter card and valid JSON-LD; robots.txt, sitemap.xml and the RSS feed are valid; unknown paths get 404.html; the CSP hash matches the one inline script; nested routes issue no failed requests.

**Acceptance test 7 (media).** Every image has alt text; every video block has a poster and a captions link (the caption files are placeholders until footage exists); nothing moves with reduced motion.

## 3. TO CONFIRM list, with owners

| Item | Where | Owner |
|---|---|---|
| Pipedrive owner user id per division (today the token's user) and whether Academy enquiries belong in the Introducer Pipeline | shared/lead-routing.json | Zaid Alhindi or Kaylan Tarin |
| The three Leads inbox labels exist (Hot, Warm, Cold) | Pipedrive Leads inbox | Kaylan Tarin |
| Final production domain (imperialholdingsgroup.com assumed) | data.js config.siteUrl, shared/ecosystem.json | Gilbert Ferrer |
| GA4 measurement id, Search Console token | data.js config | Gilbert Ferrer |
| Cloudflare Turnstile site key and secret | data.js config, Netlify env | Gilbert Ferrer |
| Twilio Verify credentials and channel (WhatsApp, SMS or both); Verify Fraud Guard on | Netlify env | Gilbert Ferrer |
| Confirmation email mailbox and verified domain (Resend) | Netlify env | Gilbert Ferrer |
| PIPEDRIVE_API_TOKEN, then LAUNCH=1 when indexing may start | Netlify env | Gilbert Ferrer, Kaylan Tarin |
| Booking page URLs for Dubai and Lagos (Microsoft Bookings or Calendly) | data.js config.booking | Zaid Alhindi |
| The two office numbers are WhatsApp enabled | data.js config.whatsapp | Zaid Alhindi |
| The citizenship guide PDF | data.js config.guide | Zaid Alhindi |
| Final hero photograph and the shoot (docs/PHOTO-SHOT-LIST.md); seven own photographs flagged as placeholders | data.js photos, hero | Marketing |
| Guest consent per event (all six events consent:false; galleries hidden in production) | data.js events[].consent | Marketing |
| Video footage: hero loop, founder film, three event highlight clips; Vimeo or Mux account; caption transcripts | data.js video | Marketing |
| Event dates and venues beyond the Grenada 51st press release; the Real Estate journal row date | data.js events, journal | Marketing |
| The four Insights articles: approve, edit or drop (drafts, not indexed, marked "Draft, awaiting approval") | data.js insights (remove draft:true) | Zaid Alhindi |
| Budget bands and currency on the enquiry form (taken from the build contract, not the brief) | data.js BUDGETS | Zaid Alhindi |
| Who tells guide requesters when the guide is ready (today the division owner, by reply) | docs/LEADS.md | Kaylan Tarin |
| Twilio Verify code length once the service exists (the page no longer assumes six digits) | Netlify env | Gilbert Ferrer |
| Legal entity, registered address, data controller, licence number, retention period, privacy mailbox, applicable law, terms of use | privacy page, docs/PRIVACY-NOTES.md | Counsel with Gilbert Ferrer |
| Sister-site URLs: Partners Club, Private Office, Real Estate (at launch), Academy; a wordmark file for Imperial Citizenship | shared/ecosystem.json | Gilbert Ferrer |
| Spelling of the Founder's surname on the site (Al Hindi or Alhindi) | data.js people | Zaid Alhindi |

## 4. Decisions needed

1. **Host and go-live.** Netlify as built: connect the repository (branch ihg-site) or upload the zip, set the environment variables above, run the fifteen-minute live test in docs/LEADS.md, then LAUNCH=1. Recommended: move the source to a private IHG repository first (the current one is public).
2. **Home hero.** Keep the stage-lights backdrop (dark, nobody in frame), or record consent for the Lagos office evening photograph so the intended hero shows now, or wait for the shoot.
3. **Verification channel.** WhatsApp, SMS or both.
4. **Stock photographs.** Keep the Real Estate aerial and the Dubai skyline (credited) until the shoot, or remove them now.
5. **Insights articles.** Approve the four drafts, or keep them hidden.
6. **Social cards.** The JPEG card is used first; per-page JPEG cards can be added once photographs are final.

## 5. What to carry to the Imperial Citizenship site

shared/tokens.css (design tokens), shared/chrome (header and footer markup and styles), shared/ecosystem.json (the six sites), shared/lead-schema.json and the lead functions (site key `citizenship`, default division, its own routing owner), shared/analytics.js (set its own GA4 id), the consent and preview switches, the build pipeline (build/), the test tools (tests/), and docs/ECOSYSTEM.md which lists what each new site must set.

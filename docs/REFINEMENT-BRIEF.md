# Refinement brief for the Imperial Holdings Group website

Received 15 October 2026 from the Founder. This is the brief every change in this round answers to.
The preview the brief refers to is https://ihg-website-preview.onrender.com (a hash-routing preview build).
The deployable source is this repository (Netlify: real paths, Netlify Forms, Pipedrive function).

Note on accuracy: the brief was written from the preview. Two details differ in this source: routing here
is already path based on http(s) (hash routing only on file:// and in the preview build), and most photographs
are already our own event photography (36 event photos, two portraits). The stock photographs still in use
are listed in docs/BUILD-CONTRACT.md.

---

You are refining the Imperial Holdings Group website (preview: https://ihg-website-preview.onrender.com). The design, tone and structure are approved and stay as they are. Your job is to make the site launch-ready and, above all, make it bring in verified, qualified leads. Work through the sections in order. Do not skip the acceptance tests at the end.

## 1. What you are working with

* Static site: `index.html`, `assets/js/app.js` (hash router, forms, motion), `assets/js/data.js` (all content and the photo list), `assets/img/`, `assets/logos/`.
* Routing is hash-based (`#/about`, `#/journal`, `#/divisions/citizenship`, `#/contact`).
* Forms post to Netlify Forms (`submitNetlify` in app.js) and a Netlify function `netlify/functions/submission-created.js` assigns the lead in Pipedrive. The preview runs on Render, so forms do not deliver there today.
* Photos: a few are our own (`dusk`, `night`, `citizenship`), the rest are Unsplash stock with generic subjects (Maspalomas and Merzouga dunes, the Basilica Cistern in Istanbul, arches in Krakow).
* No video anywhere. No `robots.txt`, no `sitemap.xml`.
* Content still carries "Sample" journal entries, eight "Date to confirm" labels, "Permissions to confirm before launch" on the event galleries, and a placeholder "BOOKING LINK" on Contact.

## 2. Rules for every change

1. Keep the current look: the serif headlines, the gold and dark palette, the spacing, the motion. Do not restyle.
2. British English, plain and short. No em dashes anywhere in copy, code comments or docs; rewrite the sentence instead.
3. Never invent facts, dates, names, figures, programme details or client stories. Where a fact is missing, keep a clearly marked `TO CONFIRM` placeholder and list it in your final report.
4. No claims of guaranteed approval, government influence, fees, prices or timelines. Keep the existing FAQ answer on guarantees.
5. Work in small, reviewable commits, one section per commit, with a clear message. Run the build and the checks before each commit.
6. Anything that would send email, publish to a live domain, change DNS, change a live Pipedrive pipeline or spend money: stop and ask first.
7. Keep every form field that exists today (audience, division, routed_to, source, medium, campaign, utm_*, gclid, fbclid, landing, referrer, page, consent). They are the lead tracking and must survive.

## 3. Leads: make every enquiry arrive, verified and scored

This is the most important section.

### 3.1 Form delivery must work on the host we launch on

* Decide the host with Gilbert before coding: (a) deploy to Netlify so Netlify Forms and the function work as built, or (b) keep another host and replace `submitNetlify` with a POST to our own endpoint (a serverless function or the Control Centre API) that writes to Pipedrive.
* Either way, the lead must reach Pipedrive with every tracking field, and the person must see the success state. Build a fallback: if the submit fails, show a message with the office phone numbers and the email, and store the draft locally so nothing typed is lost.
* Send one real test lead end to end and record the Pipedrive deal ID in your report.

### 3.2 Qualify before the team sees it

Add to the Contact flow (keep it to three short steps):

* Step 2 "About you": add country of residence (exists), nationality or nationalities, and who the enquiry is for (myself, my family, a client I am introducing).
* Step 3 "Your message": add timeline (within 3 months, 3 to 12 months, exploring), and budget range as broad bands, optional, worded gently. For Partners Club: firm name and profession. For Real Estate: buy or rent, area of interest.
* Compute a simple lead score in the function (timeline, budget band, division fit, source) and write it to a Pipedrive custom field so the team sees "hot, warm, exploring" at a glance.

### 3.3 Verify the person

* Phone verification: after submit, send a one-time code by WhatsApp or SMS (Twilio Verify or equivalent) and mark the lead "phone verified" in Pipedrive when the code is entered. If the person skips it, the lead still arrives, marked "unverified".
* Email: validate the format, block disposable domains, and send an automatic confirmation email from a named mailbox with one clear next step.
* Spam: add Cloudflare Turnstile (invisible) to every form and keep the existing honeypot. Rate-limit submissions per IP in the function.

### 3.4 One clear next step

* Replace the "BOOKING LINK" placeholder with a real booking page (Microsoft Bookings or Calendly), one per office, so the person can book a first conversation straight after submitting. Pass name, email and division into the booking link.
* Add a WhatsApp button (Dubai and Lagos numbers) in the header on mobile and on the Contact page. Track clicks as a conversion.
* Add a second way in on the Citizenship division page: a short "programme fit" check (5 questions) that ends in the enquiry form with the answers prefilled, and a downloadable guide in exchange for name and email. Both go to Pipedrive as leads with their own source.

### 3.5 Routing and ownership

* Keep the "one person as your point of contact" promise true: the function must assign each lead to one named owner in Pipedrive by division (Citizenship, Private Office, Partners Club, Academy, Real Estate, Group) and set the pipeline and stage. Put the owner mapping in one config file, not in the code.
* Deduplicate on email and phone: if the person already exists in Pipedrive, add a note and an activity instead of a new person.

## 4. Search: let Google see every page

* Replace hash routes with real paths (`/about`, `/journal`, `/journal/grenada-51-dubai`, `/divisions/citizenship`, `/contact`). Serve each page with its own HTML (prerender at build or server render). Keep the current client-side transitions on top. Add 301 redirects from the old `#/` links.
* Each page gets its own `<title>`, meta description, canonical URL, Open Graph and Twitter card with a real image.
* Add `robots.txt` and an XML `sitemap.xml` that updates at build.
* Add structured data: Organization (with both offices), LocalBusiness per office, Article for journal entries, Event for events, FAQPage for the Contact FAQ, BreadcrumbList.
* Add GA4 and Google Search Console (measurement ID and verification come from Gilbert). Track as conversions: enquiry submitted, phone verified, booking made, WhatsApp click, guide download, quiz completed.
* Core Web Vitals: hero image under 200 KB (AVIF or WebP with responsive sizes), fonts preloaded, no layout shift, LCP under 2.5 s on mobile.

## 5. Media: real pictures and video

### 5.1 Photos

* Remove the generic Unsplash subjects that are not about us (dunes in Maspalomas and Merzouga, the Istanbul cistern, the Krakow arches). Replace with our own photography: the Dubai office in Business Bay, the Lagos office on Aromire Road, the team, the events we have hosted.
* The home hero should be a real photograph of ours, not an AI-looking skyline. Until the shoot is done, use the best real event or office photo we have and mark the hero `TO CONFIRM: final hero photo`.
* Produce a shot list for one professional shoot per city (reception and meeting rooms, the team at work, the leadership portraits, the city at dusk from our side of it) and put it in `docs/PHOTO-SHOT-LIST.md`.
* Keep a credit line for any licensed photo that stays, and keep the `own:true` flag accurate in `data.js`.

### 5.2 Video

* Add a `video` block type to `data.js` and support it in the Journal, in each event gallery, on the home page and on the About page.
* Host on Vimeo (private links, no related videos) or Mux. Lazy-load, poster image first, captions file for every clip, no autoplay with sound.
* Home hero: optional silent 10 to 15 second loop (city or office), muted, paused when `prefers-reduced-motion` is set, falling back to the still photo on slow connections.
* Events: one highlights clip per event alongside the photographs (Grenada 51st after party, Lagos Diplomatic Soiree, Easter Polo Cup).
* About: one 60 to 90 second founder film slot (`TO CONFIRM: footage`).

## 6. Journal and events

* Keep the Journal as it is in layout and tone.
* Add the video slot per entry (5.2), a "Related" row at the end of each article, and a share row (LinkedIn, WhatsApp, copy link).
* Add a Journal RSS feed and make each article a real URL (section 4), so the Imperial Citizenship site and the Control Centre's Website and SEO agent can pull from it.
* Remove or rewrite the two entries marked `SAMPLE` before launch. If real copy is not available, remove them.
* Resolve the eight "Date to confirm" labels or remove the dates. Resolve "Permissions to confirm before launch" on the event galleries: hide any photograph of a guest until permission is recorded in `data.js` (`consent:true`).

## 7. The ecosystem foundation

Build these so every Imperial site can reuse them:

* `shared/` design tokens (colours, type, spacing, motion) and the header and footer as a package, with the "Our ecosystem" menu linking all six sites (IHG, Imperial Citizenship, Partners Club, Private Office, Real Estate, Academy).
* One lead schema (`shared/lead-schema.json`) with the field list in rule 7 plus the qualification fields in 3.2, and one submission function all sites call. Each site sets only its `site` and default `division`.
* One analytics setup file (GA4, Search Console, conversion events) that every site includes.
* Cross-links: every division page on IHG links to that division's own site, and each division site links back to IHG and to the Journal.
* Document all of it in `docs/ECOSYSTEM.md` so the next site starts from this base.

## 8. Trust, privacy and housekeeping

* Privacy page: say what we collect in the forms, that it goes to our CRM, how long we keep it, and how to ask for deletion. Link it from every form next to the consent box.
* Cookie notice only if a non-essential cookie is set; prefer a cookie-free analytics configuration where possible.
* Accessibility: keyboard focus visible, form errors read by screen readers, colour contrast at least 4.5:1 on text, alt text on every image, captions on every video.
* Error and 404 pages in the house style, with the office contacts.
* Remove any console errors and unused assets.

## 9. Acceptance tests (run all, report results)

1. Submit an enquiry on Contact for each of the six choices: each arrives in Pipedrive with owner, pipeline, stage, score and all tracking fields. Give the deal IDs.
2. Submit with a disposable email and with the honeypot filled: both rejected.
3. Complete phone verification once and skip it once: both leads arrive, flagged correctly.
4. Book a conversation from the success screen: the booking page opens with name, email and division prefilled.
5. `curl` each main page: unique title, description, canonical, OG image; `robots.txt` and `sitemap.xml` return 200 and list every page.
6. Lighthouse mobile on home, a division page, a journal article and Contact: Performance 90 or above, Accessibility 95 or above, SEO 95 or above.
7. Every image has alt text; every video has a poster and captions; `prefers-reduced-motion` stops all loops.
8. Search the built site for "Sample", "To confirm", "TO CONFIRM", "BOOKING LINK" and "Permissions to confirm": list every hit that remains.

## 10. Report back

Finish with one plain report, in this order:

1. What changed, section by section, with the commit for each.
2. Acceptance test results, with the Pipedrive deal IDs.
3. Everything marked `TO CONFIRM`, with who needs to supply it (photos, video footage, dates, permissions, booking links, GA4 and Search Console IDs, Twilio or Turnstile keys, owner mapping).
4. Decisions needed before launch (host, verification channel, which stock photos may stay).
5. What to carry into the next site (Imperial Citizenship) from the shared package.

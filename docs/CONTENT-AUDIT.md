# Content and accessibility audit (brief section 9, items 7 and 8, and the section 2 rules)

Run on 15 October 2026 at 15:40 UTC on branch `ihg-site` at commit `571cf76`, against a fresh `npm run build`
(23 pages plus `404.html` and `error.html`, pre-launch noindex, no preview switch). The built pages were served from
`dist/` on `http://127.0.0.1:8795` with `tests/serve.js`; the accessibility test used port 8765 as its script expects.
No email was sent and no live service was called. Nothing in the application code was changed by this audit; every
problem is listed in section 9 for the owner of that file.

Result in one line: every image in every built page has an `alt` attribute; every video block has a poster and a
captions file; `prefers-reduced-motion: reduce` stops every loop and animation; the a11y test passes with no serious
or critical violation; the built site still carries the "Sample" labels on the Insights section (five pages), the
"To confirm before launch" lines on five event pages, and one em dash written as a JavaScript escape, plus the
placeholders listed in section 5.2 that need facts from the team.

## 1. Summary

| Check | Result |
|---|---|
| 9.7 Every image has alt text | Pass. 981 `<img>` tags across 49 built HTML files, none without `alt`; 730 carry `alt=""` (decorative: logos next to text, division cards whose text is in the card, the photo strip behind headings). One alt text describes the wrong scene (section 9, finding 4). |
| 9.7 Every video has a poster and captions | Pass for the four video blocks that render (about page founder film, three event highlight clips); each has a poster image and a captions link, and all five files in `assets/captions/` exist. All five are placeholder files with one `TO CONFIRM` cue. The hero loop is not rendered (no source yet); when it is, its `<video>` carries no `<track>` (finding 5). |
| 9.7 `prefers-reduced-motion` stops all loops | Pass. Under `reduce`: zero running animations, zero infinite CSS animations, no `<video>` or loop iframe, no intro veil, counters already at their final value, on all five pages checked. Under `no-preference` the same pages run six infinite animations on the home page (the clock pulse, the scroll cue, the "coming soon" badge pulse, two map pings, the hidden button spinner) and two on About. A hero loop injected for the test renders and plays only under `no-preference` and is removed at once when the preference changes at runtime. |
| 9.8 Search for the placeholder strings | "Sample": 5 unique pages (10 files). "To confirm": 5 unique pages (10 files). "TO CONFIRM": 0 pages; 4 lines inside HTML comments of the two chrome templates copied to `dist/shared/chrome/`. "BOOKING LINK": 0. "Permissions to confirm": 0. "tbc(": 0 (it is a function call in source; its rendered output is the amber placeholder, listed per page in 5.2). "Date to confirm": 0 (the eight labels are gone). |
| Section 2: em dashes | One. `assets/js/app.js` line 330 writes the JavaScript escape for U+2014 (backslash, u, 2014) as a decorative list marker; it renders as a real em dash on `/divisions/citizenship` and `/divisions/academy`. `npm run check` passes because `tests/copy-rules.js` only looks for the literal character (finding 2). |
| Section 2: American spellings | None in `data.js`, `app.js`, `index.html`, the chrome templates or the rendered page text. `color` and `center` occur only in CSS and DOM API calls; `licensed` is the verb and `licence` the noun throughout; `counsel` is the legal term. |
| Section 2: promised outcomes | Every occurrence of guarantee, influence or shortcuts is a denial (the "We never will" list, the Partners Club standards, the FAQ answer, the footer line, the terms page, one Insights article). No fast-track, no "ensure approval". |
| Section 2: prices, fees, timelines | No price, fee or processing-time claim. The only money figures are the optional budget band options in the forms; the only durations are the two video lengths from the brief, the form's timeline options, and "24 months" inside a privacy placeholder. |
| Rule 3: facts in new copy | Every date, name, venue and figure in the copy added since `f6b2575` traces to the baseline data, the brief or a `tbc()` placeholder, with two items to confirm with the Founder: the USD budget bands (from the build contract, not the brief) and the "six-digit code" wording (finding 8 and 11). |
| `npm run test:a11y` | A11Y OK: 14 checks (6 pages, desktop and mobile, plus the search palette and the mobile menu), no serious or critical axe violation, every focused control shows a focus indicator. Undecided items listed in section 8. |

## 2. Images: alt text (9.7)

Method: a Node script walked every `*.html` file under `dist/` (49 files: each route written as `name.html` and
`name/index.html`, plus `index.html`, `404.html` and `error.html`), matched every `<img ...>` tag and reported any tag
without an `alt` attribute, with page and `src`.

* 981 image tags, 0 without `alt`.
* 730 with `alt=""`: the crown and wordmark logos that sit next to the name in text, the division cards and rail cards
  (the card text names the division), the photo strip in Our Network, the search palette thumbnails, the intro veil
  crown, the one-pixel placeholder in the contact preview.
* 251 with descriptive alt text from `D.photos[].what`, the leadership names, the event titles ("<event>, photograph
  i of n") and the video poster titles ("Founder film (poster)").

Exceptions: none.

Accuracy spot check (seven photographs opened and compared with their alt text): `hero-alt` (the Imperial Citizenship
backdrop under festoon lights), `events/easter-polo-cup-2026/02` (polo in play), `04` (the printed after party banner,
Lagos Polo Club, Ikoyi), `hero` (a group in front of an Imperial Citizenship backdrop), `hero-night` (a speaker with a
microphone) and `events/lagos-diplomatic-soiree-2025/cover` (a guest in a black dress) match. One does not:
`events/lagos-office-event/07` is described as "Two guests in conversation at the Lagos office" but shows a group of
six or more guests seated round a table outdoors at night (finding 4). The event gallery alt texts are generic
("Easter Polo Cup After Party, photograph 3 of 5"), which satisfies the rule but describes nothing (finding 9).

## 3. Video: posters and captions (9.7)

`videoBlock(v)` in `assets/js/app.js` (lines 93 to 100) renders, for every video entry:

* `<figure class="vid pending">` when `id` is empty: the poster (`<img class="vid-poster" alt="<title> (poster)">`),
  a `TO CONFIRM` label in place of the play button, and a caption with the title, the duration and a `Captions` link
  to the `.vtt` file.
* `<figure class="vid" data-video ...>` when `id` is set: the same poster with a Play button; the player iframe
  (Vimeo with `dnt=1`, or Mux) loads only on click. Captions on the embedded player come from the host; the `.vtt`
  file is linked for download.

Built pages (unique pages; each also exists as `name/index.html`):

| Page | Video block | Poster rendered | Captions file | Exists | Content |
|---|---|---|---|---|---|
| `/about` | Founder film (60 to 90 seconds), pending | `assets/img/people/zaid.webp` | `assets/captions/about-founder.vtt` | yes | placeholder, one `TO CONFIRM` cue |
| `/journal/events/grenada-51-dubai` | Highlights: Grenada 51st after party, Dubai, pending | `assets/img/hero-alt.webp` (fallback: the event cover lacks consent) | `assets/captions/grenada-51-dubai.vtt` | yes | placeholder |
| `/journal/events/lagos-diplomatic-soiree-2025` | Highlights: The Lagos Diplomatic Soirée 2025, pending | `assets/img/hero-alt.webp` (fallback) | `assets/captions/lagos-diplomatic-soiree-2025.vtt` | yes | placeholder |
| `/journal/events/easter-polo-cup-2026` | Highlights: Easter Polo Cup after party, Lagos, pending | `assets/img/hero-alt.webp` (fallback) | `assets/captions/easter-polo-cup-2026.vtt` | yes | placeholder |
| `/` (hero loop) | not rendered: `D.video.hero` has neither `src` nor `id` | (would be `hero`, falling back to `hero-alt`) | `assets/captions/hero-loop.vtt` | yes | placeholder; `heroLoop()` renders no `<track>` |

Four blocks, 8 files, 0 without a poster, 0 without a captions link, 0 missing files. No `<video>` or `<iframe>`
appears in any built page today (every clip is pending), so nothing can autoplay with sound. The home page video slot
(`homeVideo()`) shows the first event or journal clip that has an id; none has one yet.

## 4. Reduced motion (9.7)

### 4.1 How it was checked

Playwright with the globally installed Chromium, two browser contexts, one with `reducedMotion: 'reduce'` and one with
`'no-preference'`, 1366 by 860, against `dist/` served on port 8795. Pages: `/`, `/about`, `/divisions/real-estate`
(the "coming soon" badge), `/journal/events/grenada-51-dubai`, `/contact`. Each page was loaded to `networkidle`,
left for 2.5 seconds, probed, scrolled to the bottom in 500 pixel steps (to trigger every reveal), left 1.2 seconds
and probed again. The probe, run inside the page, recorded:

1. `document.getAnimations()` entries whose `playState` is `running`, with the animation name, target and iteration
   count (CSS animations and transitions, including those the Web Animations API sees on pseudo-elements);
2. every element, and its `::before` and `::after`, whose computed `animation-name` is not `none`, whose
   `animation-iteration-count` is `infinite`, whose `animation-play-state` is not `paused` and whose duration is not
   `0s` (the loops a stylesheet declares, whatever the animation timeline says);
3. every `<video>` (class, `paused`, `autoplay`, `loop`, `muted`, source, number of `<track>` children) and every
   `<iframe>` (class, `src`);
4. every `[data-count]` counter with its target and its displayed text;
5. whether the intro veil `#veil` is still in the document, and `document.body.className`;
6. `matchMedia('(prefers-reduced-motion: reduce)').matches`, to prove the emulation took.

### 4.2 Results

| Mode | Page | Running animations | Infinite CSS animations | Videos | Loop iframes | Veil | Counters |
|---|---|---|---|---|---|---|---|
| reduce | `/` | 0 | 0 | 0 | 0 | removed | 10, 600, 2,000, 20, 100 shown at once |
| reduce | `/about` | 0 | 0 | 0 | 0 | removed | none on page |
| reduce | `/divisions/real-estate` | 0 | 0 | 0 | 0 | removed | none |
| reduce | `/journal/events/grenada-51-dubai` | 0 | 0 | 0 | 0 | removed | none |
| reduce | `/contact` | 0 | 0 | 0 | 0 | removed | none |
| no-preference | `/` | 6 (pulse on the clock dot, cue on the scroll hint, pulse on the coming soon badge, ping on two map pins, spin on the hidden button spinner) | 6 | 0 | 0 | removed after its run | final values |
| no-preference | `/about` | 2 (map pings) | 2 | 0 | 0 | removed | none |
| no-preference | `/divisions/real-estate` | 2 (badge pulse, hidden spinner) | 2 | 0 | 0 | removed | none |
| no-preference | `/journal/events/grenada-51-dubai` | 0 | 0 | 0 | 0 | removed | none |
| no-preference | `/contact` | 0 | 1 (hidden spinner, opacity 0) | 0 | 0 | removed | none |

The same numbers held after scrolling. The `reduce` column is the acceptance test: nothing loops, nothing animates,
no video or iframe exists, the counters do not count, the veil is never shown (`app.js` line 1708 removes it when
`mqReduce.matches`). The `no-preference` column shows the motion the stylesheet declares, so the test could tell a
stylesheet that honours the preference from a page that simply has no motion: `site.css` lines 722 and 1000 switch all
of it off under `@media (prefers-reduced-motion: reduce)`.

### 4.3 The hero loop

`D.video.hero` has no `src` and no `id`, so `heroLoop()` renders nothing today and the prerendered home page has no
loop. To check the gate itself, the audit served the source directory (client rendered, not prerendered) on the same
port and replaced `assets/js/data.js` through a Playwright route with the same file plus one line,
`window.IHG.video.hero.src = "assets/vid/test-loop.mp4"` (the file itself answered as an empty `video/mp4`):

| Context | Loop element | Attributes seen |
|---|---|---|
| `reduce` | none: `heroLoop()` returns an empty string because `loopOK()` is false | |
| `no-preference` | one `<video class="loop" data-loop>` | `muted`, `loop`, `playsinline`, `preload` switched to `auto` by `bindMedia()`, `aria-hidden="true"`, no `autoplay` attribute, playing (`paused: false`), 0 `<track>` children |
| switched to `reduce` at runtime (`page.emulateMedia`) | none: the `change` listener on the media query (`app.js` line 1718) re-renders the page without the loop | |
| switched back to `no-preference` | the loop returns and plays | |

For a prerendered page that one day carries the loop in its markup, `bindMedia()` runs inside `enhance()` on the
first render too (`app.js` line 852) and its `go()` calls `v.pause()` when `loopOK()` is false, and the `<video>` has no
`autoplay` attribute, so the browser never starts it by itself. A control appended by hand without the app's binding
kept playing under `reduce` in the same browser, which confirms the app, not the browser, is what stops it. The same
`loopOK()` also refuses the loop when `navigator.connection.saveData` is set or the effective connection type contains
`2g` (not emulated here).

## 5. Placeholder strings (9.8)

Searched: every `*.html` under `dist/`, `assets/js/data.js` and `assets/js/app.js`, for `Sample`, `To confirm`,
`TO CONFIRM`, `BOOKING LINK`, `Permissions to confirm` and `tbc(`. Counts are unique pages; each page exists twice in
`dist/` (`name.html` and `name/index.html`).

### 5.1 Hits

**"Sample": 5 pages, all deliberate placeholders, all visible to visitors.** The two journal rows marked `sample:true`
in the baseline are gone (brief section 6), but the four Insights articles those rows pointed at are still published
and still labelled as samples. The data.js comment (line 140) says they are "draft copy awaiting approval".

| Page | Surrounding text | Deliberate |
|---|---|---|
| `/insights` | Notice above the filters: "**Sample** These are sample articles. They show the layout and tone of the Insights section. Titles and copy draw on the Imperial Holdings brochure; final articles are to be written and approved before launch." Then a "Sample" badge on each of the four article cards and the link text "Read the sample" on each (`insightCard()`, `app.js` line 183; `V.insights`, line 364). | yes (awaiting approval) |
| `/insights/before-a-first-conversation` | "Sample article" badge in the hero; notice "**Sample** Sample article for layout. Final copy to be written and approved. Author and publication date: [to confirm]"; three related cards with "Sample" badges and "Read the sample" (`V.article`, lines 372 and 373; `relatedRow`). | yes |
| `/insights/explain-your-family-once` | same as above | yes |
| `/insights/your-client-stays-your-client` | same as above | yes |
| `/insights/everything-in-writing` | same as above | yes |
| client only: search palette | `add({k:'Page', t:'Insights', s:'Sample articles', ...})` (`app.js` line 1622): the Insights entry in the Ctrl K palette reads "Sample articles". Not in the prerendered HTML. | yes |

The four articles are also listed in `dist/sitemap.xml` (4 of 23 URLs) and in `dist/journal/feed.xml` (4 of 8 items),
and the Contact FAQ links to the first one ("Six things worth thinking about"). Finding 1.

**"To confirm": 5 pages, all deliberate `tbc()` placeholders, all visible.** `V.event` (`app.js` line 414) renders
"To confirm before launch:" followed by each entry of `events[i].tbc` as an amber placeholder.

| Page | Surrounding text | Deliberate |
|---|---|---|
| `/journal/events/lagos-diplomatic-soiree-2025` | "...for an evening in Lagos. To confirm before launch: [Exact date] [Venue] [Guests of honour]"; the facts panel also shows "Where: [Venue to confirm] Lagos" | yes; needs Marketing (SharePoint) |
| `/journal/events/gala-dinner-lagos` | "...Caribbean citizenship community. To confirm before launch: [Date] [Venue] [Speakers and guests of honour]"; facts panel "Where: [Venue to confirm] Lagos" | yes |
| `/journal/events/easter-polo-cup-2026` | "...at Lagos Polo Club, Ikoyi. To confirm before launch: [Exact date]" | yes |
| `/journal/events/lagos-office-event` | "...on Aromire Road, Ikoyi. To confirm before launch: [Date] [Occasion]" | yes |
| `/journal/events/delborough-dinner` | "...The Delborough Hotel, Lagos. To confirm before launch: [Date] [Occasion]" | yes |

`/journal/events/grenada-51-dubai` has no such line: its date, venue and guests come from the press release.

**"TO CONFIRM": 0 pages.** Four hits, all inside HTML comments of the two chrome templates that the build copies to
`dist/shared/chrome/` (publicly reachable but not linked): `header.html` lines 10 and 17 ("the Group site,
https://www.imperialholdingsgroup.com (TO CONFIRM: final domain)", "The WhatsApp numbers are the office numbers from
data.js (TO CONFIRM: that they are WhatsApp enabled)") and `footer.html` lines 9 and 15 (the same domain note, "The
legal line keeps the TO CONFIRM placeholder until the entity details are supplied"). Deliberate (documentation for
the other sites), see finding 6. In `data.js` the string occurs 13 times and in `app.js` twice, all in code comments,
as the build contract asks. In `assets/captions/*.vtt` each of the five files has the cue "TO CONFIRM: captions for
this clip" (not HTML, not searched by the brief, listed for completeness).

**"BOOKING LINK": 0.** Replaced by `config.booking` with two placeholders on `/contact` (5.2).

**"Permissions to confirm": 0.** Replaced by the consent flags; the event pages now say "Photographs will appear once
guests have confirmed they are happy to be featured."

**"tbc(": 0 in HTML** (a source function, `app.js` line 45, called 23 times in `app.js`, never in `data.js`, which uses
`[[...]]` tokens in the legal copy and `tbc:` strings in data). Its rendered form is below.

**"Date to confirm": 0.** The eight labels the brief counted are resolved: the Real Estate journal row now has
`date:null` and shows no date line; the events show their date, or nothing, with the missing fact in the "To confirm
before launch" line.

### 5.2 Rendered placeholders (the amber `tbc` span) per page

Every `<span class="tbc">` in the unique built pages, with who supplies the fact. Two appear on every page: the
WhatsApp note (header popover, hidden until the WhatsApp button is pressed; twice because there are two offices) and
the legal line in the footer.

| Page | Placeholder (count) | Who supplies it |
|---|---|---|
| every page | Confirm this number is WhatsApp enabled (2; 4 on Contact) | Gilbert: are +971 4 546 1110 and +234 902 222 2024 WhatsApp numbers |
| every page | Legal entity, licence number and registered address (1, footer) | Counsel, the Founder |
| `/` | "As at" date for these figures; Final hero photo; to be approved (Group biographies) | Marketing (brochure date), the photo shoot, the Founder |
| `/about` | Footage to be supplied (2: the lead and the video block); Group history and key dates; to be approved (2 biographies) | Video production, the Founder |
| `/divisions` | Link to confirm (3: Partners Club, Private Office, Academy websites) | Gilbert |
| `/divisions/citizenship` | Full programme list to confirm; Approved European programmes to confirm; Guide PDF to be written and approved | Imperial Citizenship, Marketing |
| `/divisions/partners-club` | Imperial Partners Club website link | Gilbert |
| `/divisions/private-office` | Imperial Private Office website link | Gilbert |
| `/divisions/real-estate` | Licence number and regulator | Imperial Real Estate |
| `/divisions/academy` | Imperial Academy website link; Programme details and launch timing to confirm; Scope and timing to confirm | Gilbert, Imperial Academy |
| `/journal/events/grenada-51-dubai` | Highlights clip to be supplied | Video production |
| `/journal/events/lagos-diplomatic-soiree-2025` | Exact date; Venue; Guests of honour; Venue to confirm; Highlights clip to be supplied | Marketing, video production |
| `/journal/events/gala-dinner-lagos` | Date; Venue; Speakers and guests of honour; Venue to confirm | Marketing |
| `/journal/events/easter-polo-cup-2026` | Exact date; Highlights clip to be supplied | Marketing, video production |
| `/journal/events/lagos-office-event` | Date; Occasion | Marketing |
| `/journal/events/delborough-dinner` | Date; Occasion | Marketing |
| `/insights/*` (4 pages) | to confirm (author and publication date) | Marketing, the Founder |
| `/contact` | Dubai booking page (Microsoft Bookings or Calendly); Lagos booking page (Microsoft Bookings or Calendly) | Gilbert |
| `/privacy` | Legal entity, registered address and data controller; Whether Turnstile is switched on at launch; Email provider (Resend in the current build) and telephone verification provider (Twilio Verify in the current build), and whether each is switched on at launch; Where each provider stores data, and the safeguards that apply, to be confirmed by counsel; Retention period, for example 24 months; Dedicated privacy mailbox (2); Applicable data protection law and supervisory authority for each office, to be confirmed by counsel; Analytics provider (Google Analytics 4, cookie-free, in the current build) and whether it is switched on at launch; Date of the version approved by counsel (2); to confirm (legal entity line) | Counsel, Gilbert (see docs/PRIVACY-NOTES.md) |
| `/terms` | Full terms of use, to be drafted by counsel; Jurisdiction to confirm; Date of the version approved by counsel; to confirm | Counsel |
| `/journal`, `/insights`, `404.html`, `error.html` | only the two that are on every page | |

Links that are not live yet carry `data-tbc` instead of a span and show the note on click: the Partners Club, Private
Office, Academy and Real Estate site links in the ecosystem menu and the footer, on every page.

## 6. Copy rules (brief section 2)

### 6.1 Em dashes

`grep` for U+2014 across `dist/**/*.html`, `data.js`, `app.js`, `site.css`, `index.html`, `shared/` and `docs/`:
four files, all the same source. `app.js` line 330, inside `V.division`:

```
'<div data-r style="--d:.2s"><span class="ix">[the U+2014 escape: backslash, u, 2014]</span><h3 class="h3">Not sure which applies?</h3>...'
```

The card that fills the third column of the "What we can help with" grid when a division has 3n+2 entries (Imperial
Citizenship with five, Imperial Academy with five) uses an em dash as its index glyph. It renders as a real em dash
character on `/divisions/citizenship` and `/divisions/academy`. `tests/copy-rules.js` searches for the literal character, so the
escape (backslash, u, 2014) passes `npm run check`. Finding 2.

### 6.2 American spellings

Searched `data.js`, `app.js`, `index.html`, `shared/chrome/*.html` and the text of every built page (tags and scripts
stripped) for `organiz`, `color`, `center`, `program` (not followed by `me`), `license` as a verb, `favor`, `honor`,
`analyz`, `catalog`. Hits and why they stand:

* `color` and `center`: only in CSS (`style="color:var(--l-text)"`, `scrollIntoView({block:'center'})`) and the
  `autocomplete="organization"` attribute value, which HTML requires in that spelling.
* `licensed` (Real Estate copy: "licensed property advisory"; terms: "those who licensed them to us"): the verb and
  participle, correct in British English; the noun is `licence` throughout ("Licence number and regulator",
  "licence number and registered address", "Licence details will be published at launch").
* `counsel` on the privacy and terms pages: the legal term for the company's lawyers, not `council`.
* No `program`, `programs`, `organize`, `favor`, `honor`, `analyze` or `catalog` anywhere in copy.

### 6.3 Words that promise outcomes

Every hit for `guarantee`, `guaranteed`, `ensure approval`, `fast-track`, `fast track`, `influence` in `data.js`,
`app.js` and the built pages:

| Where | Text | Reading |
|---|---|---|
| `data.js` line 188 (`never`), home and About | "Guarantee an outcome that a government decides." and "Claim influence with, or shortcuts through, any government." | items of the "We never will" list |
| `data.js` line 247 (Partners Club standards), `/divisions/partners-club` | "We never guarantee citizenship, visa, residency, investment or tax outcomes." and "We claim no influence with, or shortcuts through, any government." | denials |
| `data.js` line 334 (Insights article "Your Client stays your Client") | "We never guarantee citizenship, visa, residency, investment or tax outcomes, and we claim no influence with any government." | denial |
| `data.js` line 496 (terms) | "No guarantees. Imperial does not guarantee government decisions or outcomes. Final approval of any citizenship or residency application rests with the relevant government." | denial |
| `data.js` line 507 (FAQ), `/contact` and its FAQPage JSON-LD | Q: "Can you guarantee that an application will be approved?" A: "No one honestly can. Final approval of any citizenship or residency application always rests with the relevant government..." | the FAQ answer the brief asks to keep; unchanged since the baseline |
| `app.js` line 614 (footer), every page | "Imperial does not guarantee government decisions or outcomes." | denial |
| `/terms` meta description | "...no guarantee of any government decision or outcome." | denial |

No `fast-track`, `fast track` or `ensure approval` anywhere.

### 6.4 Prices, fees and timelines

Every figure that could read as a price, fee or processing time:

| Where | Text | Reading |
|---|---|---|
| `app.js` line 436 (`BUDGETS`), contact step 3, enquiry card, programme fit check | "Under US$250,000", "US$250,000 to 500,000", "US$500,000 to 1 million", "Over US$1 million", "I would rather not say yet" | optional question to the person, worded as the brief asks; the band values come from docs/BUILD-CONTRACT.md 4.2, not from the brief (finding 8) |
| same forms | "Within 3 months", "3 to 12 months", "Just exploring for now" | the timeline question, wording from brief 3.2 |
| `data.js` line 462 (privacy) | "[[Retention period, for example 24 months]]" | inside the amber placeholder; counsel decides |
| `data.js` lines 86 and 87, About page | "10 to 15 seconds, silent", "60 to 90 seconds" | the clip lengths from brief 5.2 |
| `app.js` success state | "Verify your phone: a six-digit code has been sent by ..." | the Twilio Verify default (finding 11) |
| `data.js` figures (baseline, unchanged) | 10+ years, 600+ engagements, 2,000+ individuals, 20+ countries, 100+ relationships, with "Figures from the Imperial Holdings brochure" and the "As at" placeholder | brochure; the date is a placeholder |
| `data.js` FAQ (baseline, unchanged) | "relationships with Partners, advisers and specialists in more than 20 countries" | brochure figure |
| `data.js` division copy (baseline, unchanged) | "what each requires, costs and usually takes, in writing", "a full, itemised cost schedule", "an honest timeline" | promises to put figures in writing, no figures |
| Insights cards | "1 min read" | computed from the word count |

No fee, no price, no processing time is stated anywhere.

## 7. Facts in the copy added this round (rule 3)

Scope: `git diff f6b2575..HEAD` on `assets/js/data.js` (266 lines changed) and `assets/js/app.js` (824 lines
changed), every added string that carries a date, figure, name, venue or programme detail, checked against the baseline
`data.js` at `f6b2575`, the brief, or a placeholder.

| New copy | Where | Source | Status |
|---|---|---|---|
| `SITES`: six site names and short names; roles ("The parent of five specialist divisions, led from Dubai and Lagos", "The flagship: second residency and citizenship by investment...", "For professionals: the network of lawyers, bankers, wealth advisers and family offices...", "For existing Clients: one lasting relationship for families with multi-country lives", "Coming soon: licensed property advisory, starting with Dubai", "Learning and standards: training and certification for the people who do this work"); taglines | `data.js` lines 13 to 20, ecosystem menu and footer on every page | names, `line` and `tag` of each baseline division; the IHG tagline is the baseline page title; `shared/ecosystem.json` | sourced |
| `https://imperialcitizenship.com` live; `https://www.imperialholdingsgroup.com` | `SITES`, `config.siteUrl` | baseline `sites[]` and `config.siteUrl` (already "TO CONFIRM: final production domain") | sourced; domain placeholder kept |
| Photo registry captions: "Guests at the Lagos office on Aromire Road, Ikoyi"; "A speaker at the Imperial Citizenship gala dinner, Lagos"; "The Imperial Citizenship backdrop at the Easter Polo Cup after party, Lagos Polo Club"; "Polo at Lagos Polo Club, Ikoyi"; "The Easter Polo Cup after party banner, Lagos Polo Club"; "Two guests in conversation at the Lagos office"; "A guest at the Lagos Diplomatic Soirée 2025" | `data.js` lines 53 to 60; alt text | venues and hosts from the baseline events (8 Aromire Road, Ikoyi; Lagos Polo Club, Ikoyi; the gala dinner hosted by Imperial Citizenship; the Soirée); photographs opened and compared | sourced; one caption wrong (finding 4) |
| "the seven entries marked placeholder:true ... look like generated scenes rather than photographs of our offices or cities" | `data.js` comment, line 50 | the media builder's judgement, marked TO CONFIRM; not shown on any page | placeholder |
| Hero: `photo:'hero'`, `night:'hero-night'`, `fallback:'hero-alt'`, "Final hero photo" | `data.js` line 77; home page | brief 5.1 ("mark the hero TO CONFIRM: final hero photo") | placeholder |
| Video titles: "Hero loop", "Founder film", "Highlights: Grenada 51st after party, Dubai", "Highlights: The Lagos Diplomatic Soirée 2025", "Highlights: Easter Polo Cup after party, Lagos"; durations "10 to 15 seconds, silent", "60 to 90 seconds" | `data.js` lines 86, 87, 114, 120, 127 | event titles from the baseline; lengths and the three events from brief 5.2 | sourced |
| `consent:false` on every event, and the note "Photographs will appear once guests have confirmed they are happy to be featured." | `data.js` events; `app.js` `V.event` | brief 6 (hide until `consent:true`) | sourced |
| Real Estate journal row: `date:'Date to confirm'` became `date:null` (no date shown) | `data.js` line 144 | brief 6 ("resolve ... or remove the dates") | resolved by removal |
| Dubai map card photograph changed from `night` (own, Dubai at blue hour, file removed) to `dubai` (Unsplash, Anoof C) | `data.js` line 151 | credit line kept in the footer ("Photography: Imperial events and leadership (own), plus Unsplash licence" with the two photo links) | sourced; stock photo kept, with credit, per contract 4.9 |
| Programme fit check: "In the United Arab Emirates", "In Nigeria", "Elsewhere in Africa", "Elsewhere in the world"; "A client I am introducing"; the ambitions Live, Build, Invest, Protect | `data.js` lines 386 to 407 | the two office countries (baseline `contact`), brief 3.2 (who the enquiry is for), baseline `ambitions` | sourced |
| Guide: "The Imperial guide to second residency and citizenship", "Guide PDF to be written and approved" | `data.js` line 43 (baseline `config.guide`), `guideCopy` | baseline config; the file is empty, the page shows the placeholder | placeholder |
| Privacy notice: the four forms named; the fields collected; the tracking tags "utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid and ttclid"; Netlify (host, forms inbox); Pipedrive (CRM); an email provider and a telephone verification provider (Resend and Twilio Verify named inside placeholders); Cloudflare Turnstile (inside a placeholder); Google Analytics 4 cookie-free (inside a placeholder); "Our offices are in the United Arab Emirates and Nigeria"; "offices in Dubai and Lagos" | `data.js` lines 423 to 490, `/privacy` | the form fields in `index.html` and `shared/lead-schema.json`; the `TRK` keys in `app.js` line 31; docs/LEADS.md and docs/BUILD-CONTRACT.md for the providers; baseline `contact` for the offices | sourced; every provider decision is a placeholder for counsel and Gilbert |
| Privacy commitments: no sale of data, no sharing for others' marketing, notice of a breach that affects the person, no knowing collection from anyone under 18, a prompt reply to a request for a copy or deletion, withdrawal of agreement at any time | `/privacy` | not facts but undertakings; each is listed for counsel in docs/PRIVACY-NOTES.md (lines 115 and 116) | for counsel |
| Terms: "information only and is not an offer or advice"; "Imperial does not guarantee government decisions or outcomes"; "The text, photographs, logos and marks belong to Imperial Holdings Group or to those who licensed them to us"; governing law | `data.js` lines 491 to 500, `/terms` | restates the baseline footer line and the FAQ; the Unsplash photographs are the licensed items; jurisdiction is a placeholder | sourced, counsel to draft |
| FAQ "What happens to the information I share?" now adds "kept in our customer relationship system" and "You can ask for a copy, or for deletion, at any time." | `data.js` line 509 | docs/LEADS.md (Pipedrive); the privacy notice | sourced |
| Budget bands "Under US$250,000", "US$250,000 to 500,000", "US$500,000 to 1 million", "Over US$1 million" | `app.js` line 436 | docs/BUILD-CONTRACT.md 4.2; the brief asks only for "broad bands, optional, worded gently" and names no amounts | to confirm with the Founder (finding 8) |
| "A short film with the founder, 60 to 90 seconds, is planned for this page." | `app.js` line 296, `/about` | brief 5.2 | sourced |
| "Verify your phone: a six-digit code has been sent by WhatsApp / SMS" | `app.js` success state | Twilio Verify's default code length; the service is not yet configured | to confirm (finding 11) |
| WhatsApp buttons: +971 4 546 1110 (Dubai), +234 902 222 2024 (Lagos) | `config.whatsapp`, header popover, Contact | baseline `contact.offices[].tel`; "Confirm this number is WhatsApp enabled" placeholder shown next to each | sourced; WhatsApp status a placeholder |
| Booking: "Book a first conversation" with two office buttons | `app.js` success state and Contact | `config.booking` URLs empty; two placeholders shown instead | placeholder |
| "Each house is a specialist. Together they sit at one table, with one Relationship Manager across all five."; "One house with five specialist divisions: Imperial Citizenship, Imperial Private Office, Imperial Partners Club, Imperial Academy and Imperial Real Estate."; "Imperial Holdings Group: five specialist divisions, one standard, and one person who knows your family. Led from Dubai and Lagos." | `app.js` meta descriptions and the divisions page | baseline divisions, baseline home copy and meta description | sourced |
| Journal lead: "Genuine company developments, insights, partnerships and selected gatherings. Fewer entries, chosen with care." | `app.js` `V.journal` | no fact | none to check |
| "Your interest in Imperial Real Estate is noted. We will be in touch when it launches."; "One person will be your point of contact, and will reply to arrange a first conversation." | `app.js` success copy | baseline promises (one named person; Real Estate not launched) | sourced |
| 404 and error pages: "Page not found", "Something went wrong on our side. Please try again in a moment, or call or email Imperial Holdings Group." with both office addresses and numbers | `app.js` `V.notFound`, `V.error` | baseline `contact` | sourced |
| Guide form "soon" copy: "The guide is being finalised. The team will send it to you by email as soon as it is ready." | `data.js` line 415 | a promise of a future email while `config.guide.file` is empty | process to confirm (finding 12) |

Nothing new and unsourced was found beyond the two items marked "to confirm" above. The baseline facts the brief
already knew about (the figures without an "as at" date, the five events without a confirmed date or venue, the
leadership biographies, the Group history) are still placeholders and are listed in 5.2.

## 8. `npm run test:a11y`

Run with `node tests/serve.js . 8765` in the background, `NODE_PATH=$(npm root -g)`, then the server killed. Output:

```
ok   desktop / | axe: 0 violation(s), 0 serious or critical, 1 undecided | focus walk: 79 controls, 0 without an indicator
ok   desktop / + search palette | axe: 0 violation(s), 0 serious or critical, 1 undecided | focus walk: 3 controls, 0 without an indicator
ok   desktop /divisions/citizenship | axe: 0 violation(s), 0 serious or critical, 2 undecided | focus walk: 74 controls, 0 without an indicator
ok   desktop /journal/events/grenada-51-dubai | axe: 0 violation(s), 0 serious or critical, 2 undecided | focus walk: 50 controls, 0 without an indicator
ok   desktop /contact | axe: 0 violation(s), 0 serious or critical, 1 undecided | focus walk: 50 controls, 0 without an indicator
ok   desktop /privacy | axe: 0 violation(s), 0 serious or critical, 1 undecided | focus walk: 39 controls, 0 without an indicator
ok   desktop /does-not-exist | axe: 0 violation(s), 0 serious or critical, 1 undecided | focus walk: 39 controls, 0 without an indicator
ok   mobile / | axe: 0 violation(s), 0 serious or critical, 1 undecided
ok   mobile / + mobile menu | axe: 0 violation(s), 0 serious or critical, 1 undecided | focus walk: 9 controls, 0 without an indicator
ok   mobile /divisions/citizenship | axe: 0 violation(s), 0 serious or critical, 2 undecided
ok   mobile /journal/events/grenada-51-dubai | axe: 0 violation(s), 0 serious or critical, 2 undecided
ok   mobile /contact | axe: 0 violation(s), 0 serious or critical, 1 undecided
ok   mobile /privacy | axe: 0 violation(s), 0 serious or critical, 0 undecided
ok   mobile /does-not-exist | axe: 0 violation(s), 0 serious or critical, 1 undecided
A11Y OK: 14 checks, no serious or critical axe violation, every focused control shows focus
```

No violation of any impact. The undecided items (axe could not decide, not failures):

* `color-contrast` on every page: text over the hero photographs and the gradient sections (the navigation, the
  eyebrow, the breadcrumb). axe cannot measure contrast over an image. `tests/contrast.js` from the trust wave covers
  the token pairs.
* `aria-prohibited-attr` on `#rail` (the "Explore the other houses" rail on the division pages): an `aria-label` on an
  element without a role. Harmless; a `role="region"` or removing the label would settle it.
* `label-content-name-mismatch` on the share-by-email link on the event page: the visible text and the accessible
  name differ. Harmless; the visible text should start the `aria-label`.

## 9. Findings

Severity: high blocks launch; medium should be fixed before launch; low is worth doing; info is for the record. No
application code was changed by this audit.

1. **High. The Insights section is still published as "Sample" on five pages** (`assets/js/data.js` `insights`,
   `assets/js/app.js` `V.insights` line 364, `V.article` lines 372 and 373, `insightCard` line 183, palette line 1622).
   Brief section 6 says remove or rewrite the entries marked sample before launch, and remove them if real copy is
   not available. The two journal rows went, but the four articles they pointed at remain, labelled "Sample",
   "Sample article" and "Read the sample", in the sitemap (4 of 23 URLs) and in the RSS feed (4 of 8 items) that the
   Imperial Citizenship site and the Control Centre are meant to pull from, and linked from the Contact FAQ. Decision
   for the Founder: approve the four articles (then remove the badges, the notices, the "Read the sample" text, the
   palette description and the author and date placeholder) or remove the section before launch (routes, sitemap,
   feed, the FAQ link, the Insights hero).
2. **Medium. One em dash in rendered copy.** `assets/js/app.js` line 330 writes the U+2014 escape (backslash, u, 2014) as the index glyph of the
   "Not sure which applies?" card; it renders on `/divisions/citizenship` and `/divisions/academy`. Replace the glyph
   (for example the card's position number, or no index at all), and extend `tests/copy-rules.js` to catch the
   backslash-u-2014 escape and the HTML entities for the em dash (the named mdash entity and the numeric 8212 one) so an
   escape cannot pass the check again.
3. **Medium. Five event pages show "To confirm before launch:" with the missing facts to visitors**
   (`assets/js/data.js` `events[].tbc`; rendered by `V.event`, `app.js` line 414). Deliberate, but it is a launch
   blocker until Marketing supplies the dates, venues, occasions and guests of honour (from the SharePoint Events
   folder) or the lines are removed. The Soirée and the gala also show "Venue to confirm" in the facts panel.
4. **Medium. Wrong alt text.** `assets/js/data.js` line 59: `events/lagos-office-event/07` is described as "Two
   guests in conversation at the Lagos office"; the photograph shows a group of six or more guests seated round a
   table outdoors at night. Held back in production by the consent gate, visible in preview builds and once consent
   is recorded. Rewrite the caption from the photograph.
5. **Low. Hero loop without a captions track; placeholder captions.** `heroLoop()` (`app.js` lines 86 to 92) renders
   `<video muted playsinline loop>` with no `<track kind="captions">`, although `D.video.hero.captions` names a file.
   A silent decorative loop needs no captions, but brief 5.2 asks for a captions file for every clip; add the track
   (or a `<track kind="descriptions">`) when the loop is built. All five files in `assets/captions/` are placeholders
   with one "TO CONFIRM" cue; real transcripts are needed with the footage. For the Vimeo and Mux embeds the captions
   must also be uploaded at the host, since a `<track>` cannot be attached to an iframe.
6. **Low. Templates published with the site.** `build/build.js` copies `shared/` into `dist/`, so
   `/shared/chrome/header.html`, `footer.html`, `chrome.css` and `README.md` are reachable on the live site, with
   their `{{PLACEHOLDER}}` tokens and the four "TO CONFIRM" comments (the only "TO CONFIRM" hits in `dist/`). Exclude
   `shared/chrome/`, `shared/ecosystem.json`, `shared/lead-routing.json` and `shared/lead-schema.json` from the copy,
   or accept them as public documentation. (`shared/tokens.css` and `shared/analytics.js` are needed by the pages.)
7. **Low. Preview builds share the production output folder.** When this audit began, `dist/` carried
   `data-preview` on `<html>` on every page (another builder had run `BUILD_PREVIEW=1 npm run build` at 15:32 UTC),
   which switches the consent gate off in the browser. A fresh `npm run build` removed it and the results above are
   from that build. Since the same `dist/` is what Netlify deploys, `build/build.js` should refuse `BUILD_PREVIEW=1`
   when Netlify's `CONTEXT` is `production`, and the deploy log should print the switches.
8. **Low. The USD budget bands are not in the brief.** `app.js` line 436 (`BUDGETS`) and the same labels in
   `shared/lead-schema.json` (line 37) come from docs/BUILD-CONTRACT.md 4.2. They are a question to the person, not a price, but
   they imply the range Imperial works in. Confirm the four amounts and the currency with the Founder.
9. **Low. Generic gallery alt text.** `V.event` (`app.js` line 409) gives every gallery photograph the alt text
   "<event title>, photograph i of n". It passes the rule but describes nothing. When consent and the captions are
   gathered, add a `what` per gallery photograph to `D.photos` and use it.
10. **Info. One poster for three clips.** The three event highlight blocks use the event cover as poster; every
    cover lacks consent, so `safePhoto()` falls back to `hero-alt.webp` on all three in production. Expected until
    consent is recorded; worth knowing when the clips arrive.
11. **Low. "six-digit code".** The verification copy (`app.js`, `verifyHTML`) states the code length; Twilio Verify's
    default is six digits but the service can be set to four to ten. Confirm when the service is created, or word it
    as "the code".
12. **Low. A promise in the guide form.** With `config.guide.file` empty the guide form still accepts name and email
    and shows "The guide is being finalised. The team will send it to you by email as soon as it is ready."
    (`data.js` line 415). Someone must own that email, or the form should wait for the file.
13. **Info. Consent flags on photographs of players.** `events/easter-polo-cup-2026/02` is marked `consent:true` as a
    photograph without guests, but the polo players in it are identifiable. Confirm the club is content for it to
    stand on the home page strip and the gallery.
14. **Info. The WhatsApp placeholder is on every page.** "Confirm this number is WhatsApp enabled" sits inside the
    header popover on every page (hidden until the button is pressed) and four times on Contact. It disappears when
    `config.whatsapp.*.tbc` is cleared.

## 10. How to repeat the checks

```
npm run build
node tests/serve.js dist 8795 &                       # or any free port
# images and video blocks: walk dist/**/*.html, match <img ...> and <figure class="vid ...">...</figure>
# placeholder strings
grep -rl -F "Sample" dist --include='*.html'; grep -rl -F "To confirm" dist --include='*.html'
grep -rl -F "TO CONFIRM" dist --include='*.html'; grep -rl -F "BOOKING LINK" dist --include='*.html'
grep -rl -F "Permissions to confirm" dist --include='*.html'; grep -rl -F "tbc(" dist --include='*.html'
grep -rho '<span class="tbc" title="Placeholder: to be confirmed">[^<]*</span>' dist --include='*.html' | sort | uniq -c
# em dashes, including the escape the check misses
grep -rln $'\xe2\x80\x94' dist --include='*.html'; grep -n 'u2014\|mdash;\|#8212;' assets/js/app.js assets/js/data.js
# accessibility
node tests/serve.js . 8765 & NODE_PATH=$(npm root -g) npm run test:a11y; kill %1
```

The reduced motion probe (section 4) was a Playwright script with the checks listed in 4.1: two contexts
(`reducedMotion: 'reduce'` and `'no-preference'`), five routes, `document.getAnimations()`, computed-style infinite
animations including `::before` and `::after`, `<video>` and `<iframe>` inventories, `[data-count]` values, the veil;
then, against the source directory, a route on `assets/js/data.js` that appends
`window.IHG.video.hero.src = "assets/vid/test-loop.mp4"` and a route that answers that file with an empty
`video/mp4`, followed by `page.emulateMedia({reducedMotion: ...})` to flip the preference at runtime. The source
directory is used for the loop test because a prerendered page keeps its markup on first render
(`renderView()`, `app.js` line 753) and so cannot show a loop injected after the build.

## 11. Fixed (second review round, October 2026)

What changed on branch `fix/content`, item by item. The item numbers are the ones in the second-round findings
list (findings) and the third-round list (t3). Every change was checked with `npm run check`, a production build,
`tests/seo.js`, the smoke, a11y and e2e suites, and screenshots at 1440x900 and 390x844.

### Fixed

1. **t3 0, Insights are drafts.** Every article carries `draft:true` in `data.js`. A draft page is reachable by
   its address but carries `<meta name="robots" data-draft content="noindex, follow">` (kept through `LAUNCH=1`),
   is left out of `sitemap.xml`, `journal/feed.xml`, the search palette and the related rows, and shows "Draft,
   awaiting approval" where "Sample" stood. The Insights listing keeps the four cards with one short notice.
   `window.IHG_APP.routes({published:true})` gives the build the indexable list; `tests/seo.js` checks both lists.
2. **t3 1, the em dash glyph.** The "Not sure which applies?" card and the search palette drew a dash with the
   em dash character written as an escape. Both now draw a short gold rule in CSS (`.ix-rule`, `.pal-rule`).
   `tests/copy-rules.js` now also catches the JavaScript and CSS escapes and the three HTML entities.
3. **t3 2, event TO CONFIRM lines** render with the amber `tbc` placeholder style (`.ev-tbc`).
4. **t3 3, alt text for `events/lagos-office-event/07`** now describes the guests seated round a table outdoors at
   night.
5. **Finding 0, the dark hero.** The production fallback is `hero-lights`, a crop of the gala dinner stage lights
   with nobody in frame, with its own scrim (`.hh.fallback`). Measured against the v4 reference with the text
   hidden: desktop headline 12.4:1 (v4 8.9:1), lead 14.2:1 (14.3:1), buttons 14.9:1 (13.0:1); phone headline
   10.8:1 (v4 2.8:1), lead 12.8:1 (8.8:1), buttons 13.7:1 (13.0:1). The old `hero-alt` files are gone and the two
   preload lines in `index.html` point at the new files.
6. **Findings 1 and 3, one event illustrated with another's banner.** Event cards, related rows and journal rows
   pick from a per-event pair of neutral own photographs (`EVENT_SAFE`), with the city view as the last resort,
   and the home page counts its uses so no photograph appears more than twice inside `<main>`.
7. **Finding 2, the held-back gallery.** The photograph count, the gallery link and the facts line are hidden
   while a gallery waits for consent; the card says "Read the story" and the heading says what is on the page.
8. **Findings 4, 5 and 6, layout.** The budget placeholder reads "If you wish to say" and fits beside the chevron
   at 1440px; the Contact side column labels each booking placeholder "Dubai booking page" or "Lagos booking
   page" in sentence case (the report and the success state keep the full sentence); the video placeholder pill
   keeps its dashed box whole and stays on one line at 390px.
9. **Finding 11, the hard-coded domain.** `siteCta` carries the site's `label` and `name`, and the At a glance
   panel, the closing band and the routing card print those. Marking a site real needs no change in `app.js`
   (`docs/ECOSYSTEM.md` section 6).
10. **t3 4, captions.** The self-hosted hero loop carries its captions file as a `<track>`; the Vimeo and Mux
    embeds need the same file uploaded at the host (comment above `heroLoop`).
11. **t3 7, budget bands.** A TO CONFIRM note above `BUDGETS` records that the amounts and the currency come from
    the build contract, not the brief. The bands are unchanged.
12. **t3 8, gallery alt text.** The photo registry holds one line for every gallery photograph, written from the
    photographs and naming nobody; the galleries use those lines, with "photograph i of n" only as the fallback.
13. **t3 9, the six-digit code.** Already fixed upstream before this round (`app.js` no longer says "six").
14. **t3 10, the guide form.** The form says the guide is being finalised and that we will let the person know,
    with a "Tell me when it is ready" button while `config.guide.file` is empty; the request still reaches
    Pipedrive as a lead (lead_source guide).
15. **t3 11, three clips sharing one poster, as a side effect of item 6:** each event's highlights clip now takes
    that event's second neutral photograph as its poster while the cover waits for consent, so the three posters
    differ and none shows another event's banner.

### Not changed, and why

* The confirmation email for a guide request (`netlify/functions/lib/email.js`, with its unit test and
  `docs/LEADS.md` section on it) said "It will follow by email from the team". Changed after the merge to "It is
  being finalised; one person at <division> will let you know when it is ready", with the unit test and the LEADS
  note updated, so the email promises no file either.
* The "It concerns" select in the two-column enquiry card shows "Citizenship or residen" when the division is
  preselected on a division page: a long option label, not a placeholder, and not in the findings. Noted.
* `build/build.js` line 72 and the PERFORMANCE and ACCEPTANCE documents still mention `hero-alt` as history.

### TO CONFIRM arising from this round

* Founder approval of the four Insights articles (then remove `draft:true`).
* Consent for `events/lagos-office-event/cover`, which replaces the fallback hero at once, and the final hero
  photograph from the shoot.
* The budget bands and currency (t3 7).
* The Twilio Verify code length, when the service is created.
* Who tells guide requesters when the guide is ready (the division owner, by reply, until `config.guide.file` is set).
* Real captions for the five `.vtt` files once the footage exists.

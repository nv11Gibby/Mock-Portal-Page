# Imperial Group brand voice and digital experience guide

Version 1, 15 October 2026. Deliverable 7 of the v6 brand brief (docs/BRAND-BRIEF.md, section 7), for all six Imperial sites. Examples come from the IHG site on branch ihg-site; where the guide raises the standard above the current copy, it says so. To confirm marks a decision for the Founder, not a fact. The word lists in machine-readable form are in voice-rules.json.

## 1. Positioning

**What the Group is.** Imperial Holdings Group is the parent institution of five specialist divisions, led from Dubai and Lagos: an international, relationship-led advisory group with the restraint of a private bank or a family office. Established, discreet, exact.

**What it is not.** A holding-company brochure, a citizenship sales site, a lifestyle magazine or an events business. Events are evidence of relationships, never the product. No Imperial page sells status.

**The statement**, for About, press and every division's "The Group" block. The first and last sentences are the Founder's supporting copy; the middle one is the existing site fact.

> Imperial Holdings Group is an international group bringing together mobility, private client services, real estate and professional partnerships. Five specialist divisions, led from Dubai and Lagos, share one team, one standard and one record of each family. One connected ecosystem, built to support ambitions that extend beyond borders.

**The six sites.** By the owner's decision, IHG is the institutional front door, Imperial Citizenship the principal client site and Partners Club the partner site. Each division keeps its own audience, positioning and journey.

| Site | Role | Audience | Conversion journey |
|---|---|---|---|
| Imperial Holdings Group | The institutional front door: who Imperial is, the divisions, leadership, the Journal | First-time visitors, institutions, press | Start a Relationship, three paths (section 9); Clients and Partners routed to their division, institutional enquiries kept by the Group team |
| Imperial Citizenship | The principal client site; the flagship | Families and founders | Programme fit check, enquiry, first conversation, options in writing |
| Imperial Partners Club | The partner site | Lawyers, bankers, wealth advisers, family offices, introducers | Introduce a Client or become a Partner, on the Partner Agreement |
| Imperial Private Office | One lasting relationship after the first service | Existing Clients, by invitation | A request through the Relationship Manager; not a public lead funnel |
| Imperial Real Estate | Licensed property advisory, Dubai first; not yet launched | Clients choosing a home in Dubai | Register interest only; no listings or claims until the licence is published at launch |
| Imperial Academy | Learning and standards for our people and Partner teams | Our team, Partner teams, later selected learners | An enquiry about training or careers; wider courses are "later", never "open" |

No page implies that a service is operational while in development, and none invents a partnership, licence, financial service, investment capability or client result. A missing fact is a To confirm chip and a line in the launch audit.

## 2. Tone of voice

The five qualities as rules, each with a wrong and a right example.

| Rule | Wrong | Right (from the site) |
|---|---|---|
| **Confident without arrogance.** State what we do; no superlatives. | "The region's leading citizenship advisory, trusted by thousands." | "Imperial Citizenship is where the Group began, and it remains our main business." |
| **Sophisticated without pretension.** Plain words for complex things. | "Bespoke, white-glove solutions for discerning UHNW families." | "One point of contact for the wider needs of a multi-country family." |
| **Aspirational without exaggeration.** Describe the life, not the status. | "Unlock a world of elite privilege." | "Where the family can live, travel, study and settle." |
| **Clear without sounding transactional.** Name the next step, not the sale. | "Get a free quote today. Limited places." | "Tell us where you are, and where you would like to be. The first conversation is for listening." |
| **Warm without becoming casual.** One person, by name. | "Hey there! Let's chat about your dream move." | "Thank you, Amina. Your enquiry is with Imperial Citizenship. One person will be your point of contact." |

**Sentence length and rhythm.** One idea per sentence, most under twenty words, paragraphs of two or three. A longer sentence then a short one: "The residency question touches the home. The home touches the school." No exclamation marks. No em dashes in any form; a comma, a colon or a full stop instead (npm run check enforces it).

**Person.** Imperial is "we"; the reader is "you". On IHG a division is named, never "they"; on its own site a division is "we" and IHG is "the Group". Never "I".

**Outcomes.** Nothing a government decides is promised, implied or hinted at. The sentence that travels everywhere: "Final approval always rests with the relevant government." Banned: guarantee, assured, fast-track, expedite, influence, connections, shortcuts.

**Governments** are named as the institutions that decide, with respect and without familiarity: "the relevant government". Never "our government partners" without a documented relationship.

**Money.** No fees, prices or ranges on any page; the one exception is the optional budget question on a form, in broad bands ("A budget in mind (optional)", "I would rather not say yet"). Costs are "set out in writing, option by option, before you decide".

**Time.** No processing times. "An honest timeline, updated as things move." Forms ask "When would you like to begin?"

**Warmth** comes from attention, not adjectives: the person's name, what happens next, what is not needed ("You do not need any documents for a first conversation").

## 3. Vocabulary

**Words we use.** Relationship, conversation, family, plainly, in writing, one point of contact, specialist, division, Partner, Client, standard, discretion, private, considered, selected, international, across borders, a wider life.

**Sparingly.** House (the warm synonym for division, body copy only); ecosystem (once per page); institutional and strategic (the third path only); curated (taglines only); senior (only where true); concierge (prefer "one point of contact").

**Not used, with the replacement.** The full list is in voice-rules.json.

| Do not use | Use instead |
|---|---|
| luxury, premium, prestige, world-class | nothing, or "considered", or "international" |
| exclusive | private; by invitation; selected |
| elite, VIP | nothing; guest; Client; guest of honour |
| wealth, wealthy, high-net-worth, HNW, UHNW, affluent | what you have built; assets; families and founders; families with multi-country lives |
| bespoke, tailored, solutions, discerning, lifestyle | written for your family; personal; services; nothing; a wider life |
| unlock, leverage, seamless, hassle-free, dream | open; coordinated; or nothing |
| second passport, golden visa | second citizenship; the programme's official name |
| lead, prospect, funnel (public copy) | enquiry; conversation; journey |

To confirm: two division taglines ("Personalised solutions for exceptional clients.", "Curated properties. Enduring value.") and the Easter Polo Cup copy ("an exclusive after party") use listed words. The Founder retains the taglines as registered lines or approves a revision; the event copy drops "exclusive". (v6 fix 02b284a: the site no longer shows division taglines; each division is introduced by its headline. If the Founder retains them as registered lines, they return through data.js.)

**Capitalisation.** Client and Partner take a capital when they mean Imperial's; lower case in the general sense. Relationship Manager, Partner Agreement, the Founder, the Group (meaning IHG), the Journal. Division names in full on first mention, then Citizenship, Partners Club, Private Office, Real Estate, the Academy. "Citizenship by investment" lower case; programme names as the government writes them; eyebrows in sentence case in the source.

**British spelling.** Programme, licence (noun) and licensed (verb), enquiry, adviser, organise, personalised, centre, colour, while (not whilst). Never inquiry, advisor, program, or license as a noun; docs/CONTENT-AUDIT.md 6.2 is the check.

**Numbers and dates.** One to nine in words, 10 and above in figures; 2,000; US$250,000; 19 February 2025; 18:00 with the city; +971 4 546 1110; "more than 20 countries" in prose; no percentages unless sourced and dated.

**The two signatures.**

| Signature | Used | Not used |
|---|---|---|
| **A world of opportunity. Built around relationships.** The lead line. | The IHG home hero; the opening of Group-level documents; a division site's "The Group" block or footer line | As a division's own headline; shortened |
| **Two Cities. One Horizon.** The secondary signature. | The IHG title suffix; the footer brand block; the closing band; the ecosystem menu intro | On the same screen as the lead line; on a division hero |

Both keep two phrases and two full stops; the lead line is sentence case, the secondary keeps its registered title case.

## 4. Headlines and structure

**The two-line headline.** Two short lines, each a complete phrase with a full stop, the second completing or turning the first: "Five divisions. / One table." "A house for a life / across borders." Line one under 24 characters at d2; sentence case; no questions except on Contact ("Shall we begin?"); never "Welcome to", never the company name, never a line another company could use.

**Eyebrow.** Two to four words naming the section: "The Group", "Selected events", "How it works". A label, not a sentence; the middle dot is the only punctuation.

**Lead.** One or two sentences under 34em, in "we" or "you": "Each division is a specialist. Together they sit at one table."

**Body.** Two or three sentences a paragraph on a 46em measure. Lists of three to six items, all sentences or all noun phrases.

**Calls to action.** A label names the next step: Speak to us; Start a relationship; Register interest; Visit imperialcitizenship.com; Send enquiry; Continue; Verify; Skip for now; Tell me when it is ready. Never Submit, Get started, Learn more, Click here, Sign up or Apply now. One gold button per screen; the second action is the line button or a text link. IHG's header "Enquire now" becomes "Start a relationship" (To confirm).

**Form microcopy.** Label above the field, optional stated in it: "Phone, with country code (optional)". One line of help: "We use your details only to reply to this enquiry." Errors begin with "Please" and say what to do ("Please tick the box so that we can reply."), announced with the field name and the count. Waiting: the label gives way to a spinner and the button is disabled; nothing else moves. Success: "Thank you, Name. Your enquiry is with Imperial Citizenship. One person will be your point of contact, and will reply to arrange a first conversation." Failure: "We could not send this just now. Please call or email us and we will take it from there. What you typed is kept on this device." with both office numbers and the email.

**Placeholders.** Any unverified fact is the amber dashed chip (class .tbc, with the hidden prefix "To confirm:" for screen readers), naming what is missing: "Final hero photo". Never lorem ipsum, never an invented value. The launch audit lists every chip; production ships none the Founder has not accepted.

**Search palette.** Placeholder "Search divisions, events, articles, questions". Empty state: Nothing matches "x". Try a division, a country or a question, or ask us directly. Result kinds are single words (Page, Division, Event, Question).

**404 and error.** The site's own design: the crown, a two-line headline, one lead, three ways on, both office numbers and the email. 404: "This page has moved, / or never existed." Error: "Something went wrong / on our side." Neither blames the visitor; neither says "Oops".

## 5. Typography and layout discipline

The tokens in shared/tokens.css are the look and do not change per site; the type scale classes live in assets/css/site.css.

| Tokens | Rule |
|---|---|
| Type: Cormorant Garamond 400 and 500 (--head) for d1 to h4; Inter 400, 500, 600 (--sans) for body 16.5px on 1.7, the lead and the eyebrow | Six font faces are the maximum; the scale is d1, d2, d3, h3, h4, lead and eyebrow |
| Dark: --ink to --ink-4. Paper: --paper, --paper-2, --stone | Dark for heroes, deep sections, the header, the menu and the palette; paper for light sections, cards and the default button |
| Gold: --gold, --gold-l, --gold-ink, --gold-d | Emphasis only: eyebrows, hairlines, the crown, the primary button, the focus ring, the To confirm chip. Never body text, a panel background or a gradient |
| Text: --text, --soft, --dim, --faint (.52); --l-text, --l-body, --l-muted | --faint is the floor; every pair passes 4.5:1 (tests/contrast.js) |
| Rhythm: --pad, --max 1360px, --sec, --hdrH 84px (72px under 1024px) | One gutter, one measure, one section spacing |
| Motion: --e-out, --e-io, --e-soft; --t1 .18s to --t5 1.4s | Transform, opacity and clip-path only |

Radii are 2px and 4px; a radius token is To confirm.

**Every division keeps** the tokens unchanged, both typefaces, the type scale, the three button styles and .tlink, the eyebrow with its gold rule, the To confirm chip, the focus ring, the dark and light sections and the two radii.

**A division may vary** its photographs and hero subject, the order and number of sections, the balance of dark and light, its navigation items, its logo and its footer tagline. It may not add a colour, a typeface, a button style, a shadow on type, a gradient beyond a photograph scrim, or an icon set.

## 6. Navigation and page standard

**Header.** Logo left; four or five text items; the "Our ecosystem" button and menu (five divisions with one line each, a photograph column, the six sites); one primary action. Transparent over a dark hero, solid after 40px of scroll. Mobile: the burger, the full-screen menu with the ecosystem accordion, the quick actions bar.

**Footer.** The stacked wordmark with the secondary signature; Divisions ("Soon" where unlaunched); The Group (About, Our ecosystem, Journal, Contact, Search); Offices (city, role, address, telephone, the Group email); Websites (six, "Website to confirm" until live); the legal line (information only, regulated advice only by qualified specialists, no guarantee of government decisions); Privacy, Terms.

**Breadcrumbs** on every inner page, in the hero: Home / Divisions / Citizenship. The current page is text, not a link.

**Division page, in order.** Hero (logo, status badge, two-line headline, one-line lead); overview with the At a glance panel (Division, Status, For, Website); What we do (numbered); Who it is for; How it works (numbered steps); the "Please note" callout with the division's limiting sentence; the enquiry card; the closing band; the other divisions.

**Journal.** Events first (cover, kind, city, date where confirmed, title, dek), then entries. An event page: the story in two or three paragraphs, "Among the guests" only from a press release, a Source line, the gallery with its consent note.

**Contact.** Three steps with progress; office cards with local time, telephone, WhatsApp and booking; "Before we speak"; the Questions list.

**Every Imperial site must have** the shared tokens and chrome; the ecosystem menu and Websites column linking all six sites; links back to the Group and the Journal feed; a Start a Relationship or Speak to us journey on the shared lead schema; both offices with telephone and email; a privacy notice beside every consent box; terms; 404 and error pages with the office contacts; per-page meta and structured data; robots.txt and a sitemap; the skip link; lang en-GB.

## 7. Photography and film

**Own photographs only.** Every image carries own:true and a consent flag in the registry. The two licensed photographs still on IHG are interim, credited, and replaced by the shoot in docs/PHOTO-SHOT-LIST.md. No stock on any new page and no generated scenes: the seven placeholder:true frames fail this standard and are on the shoot list.

**Consent before a person appears.** A guest, a Client or a member of staff is published only when consent:true is recorded for the photograph or the event; until then the production build holds it back and says so. Nobody is named in a caption unless a press release names them.

**Editorial restraint.** One photograph says one thing. No collages, filters, heavy grading or text over photographs. The same scene appears at most twice on a page.

**No wealth symbolism.** Not pictured: private jets, supercars, yachts, champagne, watches, gold bars, cash, stacks of passports, handshakes, red carpets. Pictured: the offices, the team at work, the cities at dusk from our side of them, our gatherings as they were.

**Hero rules.** The IHG home hero is architectural, cinematic or abstract: permanence and international perspective, not people. Dark enough for the cream headline or carrying its own scrim; nobody in frame; no sister-brand crest; under 200 KB, with a 3:4 mobile crop of the same frame; marked "Final hero photo" until the shoot delivers it. Event photographs sit lower on the page: three or four on the IHG home, each from a different gathering.

**Captions and alt text.** A caption is one line, what and where: "Stage lights at the Imperial Citizenship gala dinner, Lagos". Alt text describes the picture, not the mood; decorative duplicates carry alt="". Gallery photographs are described one by one, never numbered.

**Film.** Poster first, player on click only, a captions file for every clip, never autoplay with sound. A home loop is silent, 10 to 15 seconds, paused under reduced motion and on slow connections. A slot without footage shows the poster and a To confirm chip, never an empty player.

## 8. Interaction standard

**What moves.** Section entrances (one fade and rise, once); the headline mask reveal; the button fill; the hero crossfade on scroll; the menu and palette opening. Each improves understanding, increases confidence or helps the next step. Nothing moves for decoration.

**What does not.** Body text; images on hover beyond a 1.04 scale; anything on a timer; parallax on text; cursor followers (IHG's cursor preview is To confirm); scroll-jacking. One overlay at a time (menu, search palette, WhatsApp sheet): Esc closes it and focus returns; no other modal; no cookie banner, because the analytics are cookie-free.

**Reduced motion** removes every animation and transition, unpins everything and stops the loop. The page reads complete with motion off.

**Speed budgets.** Lighthouse mobile Performance 90 or above, Accessibility 95, SEO 95. Hero files under 200 KB, every other image under 150 KB, fonts preloaded, CLS 0, LCP target 2.5 s. Scripts deferred so the prerendered page paints first; no third-party script loads until its key is configured.

**Accessibility.** WCAG 2.2 AA. Contrast 4.5:1 on all text; the focus ring visible on every control (1.5px gold-light, 4px offset); everything operable by keyboard; a skip link; a label on every field; errors and step changes announced; aria-current on the active item; menu and palette as dialogs that keep focus; alt text on every image; captions on every video; 44px hit targets.

## 9. Forms and relationship journeys

**The Start a Relationship pattern.** One door, three paths: Private Clients, Professional Partners, Institutions and Strategic Relationships. Each leads to three short steps: what it is about, about you, your message. Each step fits one screen, shows its number and can go back. The routing card says where the enquiry goes: "Your enquiry will be routed to Imperial Citizenship."

**Progressive questions.** Step 1: the path and the subject. Step 2: name, email, country of residence, nationality, who the enquiry is for, phone (optional). Step 3: when you would like to begin, a budget band (optional), a few lines, consent. Conditional fields only when relevant: firm and profession for Partners, buy or rent for Real Estate. A fit check may prefill a form; it decides nothing.

**Never asked up front.** Passport or ID numbers, date of birth, home address, source of funds, net worth, income, bank details, past refusals, criminal record, religion, health, documents of any kind. These belong to a conversation with a named person.

**Consent wording.** A checkbox, never pre-ticked, with the privacy notice linked beside it: "I agree to Imperial Holdings Group using these details to respond to my enquiry, as described in the privacy notice." Consent to reply is never bundled with marketing; anything beyond replying is a separate optional box.

**A success state may claim** that the enquiry has reached the named division (only once the backend confirmed it), that one person will be the point of contact, and the real next steps (verify the phone, book a first conversation). **It may not claim** that anyone has read it, a reply time, eligibility, that an application has begun, that a file was sent when none exists (the guide form says "The guide is being finalised"), or delivery when the send failed. A failed send says so, shows both offices and the email, and keeps the draft. No simulated submission is ever shown as delivered.

**The handoff.** Every form posts the shared lead schema (site, division, audience, lead_source, the thirteen tracking fields, consent). One function writes to Pipedrive with one named owner per division, deduplicates on email then phone, and scores hot, warm or exploring.

## 10. The one-page checklist for any new Imperial page

Copy

- Two-line headline, sentence case, full stops; eyebrow of two to four words; lead under 34em.
- British English; no em dash in any form; no exclamation mark.
- No word from the do-not-use list; Client, Partner and Relationship Manager capitalised.
- No guarantee, influence, fee, price or processing time.
- Every fact sourced; every missing fact a To confirm chip; a service in development described as such.
- Every call to action names the next step; one gold button per screen.

Design

- shared/tokens.css linked first, unchanged; no new colour, typeface or button style.
- Gold for emphasis only; dark and light sections from the shared vocabulary.
- Own photograph, consent recorded, descriptive alt text, under 200 KB (hero) or 150 KB; no stock, no wealth symbolism.

Chrome and structure

- Shared header and footer; ecosystem menu with six sites; links back to the Group and the Journal feed; breadcrumb on inner pages; per-page meta and structured data.
- Privacy notice beside every consent box; 404 and error pages carry the offices.

Interaction and access

- Nothing moves for decoration; reduced motion leaves the page complete.
- Keyboard through every control; focus visible; Esc closes any overlay and returns focus.
- Contrast 4.5:1; labels on every field; errors announced; Lighthouse mobile 90 or above; CLS 0.

Forms

- Shared lead schema; site and division set; consent never pre-ticked.
- Nothing sensitive asked up front; the success state claims only what happened; a failure shows the offices and keeps the draft.
- npm run check passes.

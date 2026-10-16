# Start a Relationship: the journey, the data and the handoff

Deliverable 6 of the v6 brief (docs/BRAND-BRIEF.md section 5). Designed on 15 October 2026 from the site at dee0685 on `ihg-site`, the lead flow as built (docs/LEADS.md, shared/lead-schema.json, shared/lead-routing.json, netlify/functions/lib/core.js) and the acceptance harness (docs/ACCEPTANCE.md). Nothing in the repository was changed. The journey as data is in `journey.json` next to this file, in a shape the implementer pastes into `assets/js/data.js` as the key `journeys`.

What this replaces: the six-way "What can we help with?" step, the one-screen enquiry card on the home and division pages, and every "Enquire now", "Speak to us", "Send enquiry" and "Private enquiry" label. What it keeps: the `contact` form and its field names, the Netlify Forms path with the function fallback, the dedupe, the score, the verification step, the booking and WhatsApp next steps, the drafts, the Real Estate register-interest form and the citizenship guide form.

Counts: 12 screens (the chooser, four on the Private Clients path, four on the Professional Partners path, three on the Institutions path, each path ending in the same closing screen); 21 qualification questions plus the six closing fields; 39 fields posted, 38 of them existing and one new (`org_type`); 30 of the 33 acceptance cases change in how the harness drives the page, 3 stay as they are, 7 new cases.

---

## 1. Principles

1. **One door, three paths.** Every entry on the site leads to `/contact`, which is now titled "Start a relationship". The visitor says who they are (a private client, a professional partner, an institution) and the path asks only what that kind of relationship needs. Nothing is labelled a lead, an enquiry form or a quote.
2. **Every question earns its place.** A question is asked only if it routes the message (to a division and its owner), shapes the first conversation, or sets the reply channel. The reason is written next to each question in `journey.json` (`why`), so the next person who wants to add a question has to write one too.
3. **Nothing sensitive up front.** No asset values, no exact figures, no passport or identity numbers, no dates of birth, no addresses, no family members, nothing about a Partner's client, no source of funds, no documents. Budget is a broad band, optional, asked only on the two routes where it helps (citizenship programmes and property), never for the Private Office, the Group, Partners or institutions. Nationality is asked on two routes and never required.
4. **Progressive and short.** One idea per screen, two to four screens per path, three when a division page has already answered the first. Back is always available; the draft is kept on the device after every answer, as built.
5. **The contract is the contract.** The field names in `shared/lead-schema.json` are kept, every one of them. The journey posts the `contact` form, so the Netlify Forms copy, the function core, the dedupe, the scoring, the routing and the e-mail work unchanged. One field is added (`org_type`) because no existing field holds the kind of organisation without ambiguity.
6. **Honest states.** "Received" is said only when the function or Netlify has confirmed it, and in the words that match which of the two confirmed it. A failure shows the office telephones and the e-mail and keeps the draft. The preview build sends nothing and says so on the screen; there is no simulated success anywhere.
7. **The division sites keep the deeper journeys.** The owner's decision (docs/ECOSYSTEM.md section 1: IHG is the parent and institutional front door; Imperial Citizenship is the flagship client site; Partners Club the professionals' site) stands: the IHG journey takes a short introduction and routes it, then offers the division's own site, the guide and a booking. It never redirects a visitor away in the middle of a path, because a redirect would lose the message and break the "received" promise.

---

## 2. The three journeys

The chooser and the closing screen are shared. Each path is written out below in its final copy. Labels in quotation marks are what the visitor reads; the field in brackets is what is posted.

### 2.0 Entry points

| Where | Label | Link |
|---|---|---|
| Home hero, primary button | Start a relationship | `/contact?via=hero` |
| Home hero, secondary button | Our divisions | `/divisions` |
| Header button, desktop and the mobile quick action (today "Enquire now") | Start a relationship | `/contact?via=header` |
| Mobile menu footer button (today "Enquire now") | Start a relationship | `/contact?via=menu` |
| Navigation item and footer link | Contact | `/contact` (the page keeps its conventional name in menus; the button carries the journey name) |
| Home, the section that replaces the enquiry card | Three path cards: Private Clients, Professional Partners, Institutions and Strategic Relationships | `/contact?journey=<key>&via=home-paths` |
| Division page hero and closing band (today "Speak to us") | Start a relationship | `/contact?about=<key>&via=division-hero`, `&via=division-close` |
| Division page, the section that replaces the enquiry card | Start a relationship with Imperial Citizenship (and so on), the button carrying the path label; the Academy page has its own card: "Learning and standards, in development.", button "Ask about training your team", because it opens the Professional Partners path with Train or certify my team chosen | `/contact?about=<key>&via=division` |
| Real Estate page | Register interest (the existing form, unchanged) and Start a relationship | `/contact?about=real-estate&via=division` |
| Citizenship page, fit check done state | Continue to your message | `/contact?about=citizenship&via=fit` (section 6.3 explains the handover) |
| Event page glance panel | Open a strategic conversation (the Institutions path label, v6 fix) | `/contact?journey=institutions&via=event` |
| House finder result | Start a relationship | `/contact?about=<top>&goals=<goals>&via=finder` |
| Journal article end, closing band on inner pages, 404 and error pages (today "Speak to us") | Start a relationship | `/contact?via=article`, `close`, `notfound` |
| Footer brand column | Start a relationship | `/contact?via=footer` |
| Search palette (today six "Enquire" rows) | Start a relationship: Private Clients, Professional Partners, Institutions | `/contact?journey=<key>&via=palette` |

`via` is not a form field. It stays in the page URL, which the existing `page` field carries into the Pipedrive note; the core reads it from there (section 5.2). `journey`, `audience` (kept as an alias, the event pages link with it today), `about` and `goals` prefill the path.

### 2.1 The chooser (screen P)

Shown at `/contact` when no `journey`, `audience` or `about` parameter chose the path. Hero: eyebrow "Start a relationship", title "Start a relationship.", lead:

> Tell us a little about yourself and what you have in mind. One person at Imperial will read it and reply personally. Three paths; choose the one that describes you.

Three cards, one question, "I am" [audience]:

- **Private Clients.** Individuals and families: a second residency or citizenship, a home in Dubai, or the continuing support of the Private Office. Button: Arrange a first conversation.
- **Professional Partners.** Lawyers, bankers, advisers and family offices who introduce Clients, and Partner teams who will train with Imperial Academy. Button: Discuss becoming a Partner.
- **Institutions and Strategic Relationships.** Governments, missions, institutions and organisations exploring a relationship with the Group. Button: Open a strategic conversation.

Footnote: "Not sure which? Begin as a private client and we will take it from there."

Why it earns its place: the path is the audience. It sets the Contact Type in Pipedrive (Client, Partner, none for institutions), decides which screens follow and which questions are never asked. When the path was chosen by a link, the chooser collapses to a quiet line above the first screen: "Private client · Change".

Below the journey the page keeps what Contact has today: the two offices with their clocks, telephones, WhatsApp buttons and booking links, the e-mail, "Before we speak" and the questions people ask most.

### 2.2 Private Clients (four screens, three from a division page)

Opening line, under the quiet path line: *Tell us what you have in mind. We will bring in the right house, and one person will be your point of contact throughout.*

**Screen 1 of 4: What brings you to Imperial?** "Choose the closest. It decides which house reads your message." One choice [about], required:

- A second residency or citizenship. *For me, or for my family.* (citizenship)
- Continuing support as an existing Imperial Client. *Imperial Private Office.* (private-office)
- A home or property in Dubai. *Imperial Real Estate, not yet launched.* (real-estate)
- Something broader, or I am not yet sure. *The Group brings in the right house.* (group)

Under the chosen card a quiet line: "This goes to Imperial Citizenship." (the routing card of v5, reduced to one sentence). Skipped when `?about=` named the division; the division is then shown in the path line ("Private client · Imperial Citizenship · Change").

Why: the one answer that routes. It chooses the division, its owner, the record type (lead or deal) and the pipeline. Nothing else on the path routes.

**Screen 2 of 4: Who is this for, and where do you live?** "So the right office replies, and the conversation starts in the right place."

- "This is for" [for_whom], required: Myself / My family / A client I am introducing. Choosing the third shows, under the option: "If you introduce clients professionally, the Professional Partners path is the one for you." with a link "Switch to Professional Partners" that moves to that path and keeps anything typed. The value is kept either way.
- "Country of residence" [country], required, free text.
- "Nationality, or nationalities (optional)" [nationality], hint "It helps us prepare, and you may leave it for the conversation." Shown only on the citizenship and private-office routes.

Why: residence decides the office and which routes are open; who it is for shapes the first conversation and, for an introduced client, the path. Nationality is the one personal detail that changes what can be prepared for a residency or citizenship conversation, so it is asked on those two routes, and only there, and never required (it was required in v5).

**Screen 3 of 4: Timing.** "A rough sense is enough. Nothing here commits you to anything."

- "When would you like to begin?" [timeline], required: Within 3 months / 3 to 12 months / Just exploring for now.
- "Is there a budget in mind? (optional)" [budget], citizenship and real-estate routes only, hint "A broad band is enough. It only helps us prepare the right options, and you may leave it for the conversation." Under US$250,000 / US$250,000 to 500,000 / US$500,000 to 1 million / Over US$1 million / I would rather not say yet. (Bands and currency: To confirm, Founder; they come from the build contract, not the brief.)
- Real Estate only: "I am looking to" [re_intent] Buy / Rent, optional; "Area, if you have one in mind (optional)" [re_area].

Why: the timeline is the strongest signal in the score and sets Urgency and the expected close date. The band is the only question about money on the site: a band, optional, on two routes, feeding the score and nothing else. The labels are the schema labels, so the page and the note say the same thing.

**Screen 4 of 4: How shall we reply?** The shared closing screen (2.5).

Confirmation after sending: section 4. Next steps offered on this path: verification (when a phone was given), booking, WhatsApp, "Request the guide" (citizenship route, a link to the guide section on the division page, not a second form), "Explore Imperial Citizenship online" (where the division site is live), "Read while you wait".

### 2.3 Professional Partners (four screens, three from the Academy page)

Opening line: *Your client stays your client. Tell us how you would like to work with Imperial, and one person who knows Partner practices will reply.*

**Screen 1 of 4: How would you like to work with Imperial?** "Choose the closest." One choice [about, and for_whom]:

- Introduce a client. *With their permission, and on written terms.* (partners-club, for_whom client)
- Become an Imperial Partner. *Join the network of introducers and advisers.* (partners-club)
- Train or certify my team. *Imperial Academy.* (academy)

Quiet line: "This goes to Imperial Partners Club." or "This goes to Imperial Academy." The Partners Club page prefills the path but lands on this screen with nothing chosen, because its two options route the same way and are recorded differently; the Academy page skips it.

Why: routes to Partners Club or Academy. An introduction sets `for_whom=client`, which the core already records as Request Type Referral (1126) and scores as a referral; a request to join does not.

**Screen 2 of 4: About your practice.** "So the right person replies, and so written terms can follow if it comes to that."

- "Your profession" [profession], required: Lawyer / Private banker / Wealth adviser / Family office / Accountant or tax adviser / Immigration or relocation adviser / Property professional / Other (Other opens "Your profession, in a word or two"; the text is posted when given, otherwise "Other").
- "Firm or organisation" [firm], required.
- "Where you practise" [country], required, hint "Country".

Why: the firm becomes the organisation record in Pipedrive, linked to the person and the deal, as the core does today; the profession tells the Partners team who they are speaking to; the country decides the office. Posted as text, so the existing fields carry it unchanged.

**Screen 3 of 4** varies with the first answer.

*Introduce a client: About the introduction.* "Nothing about your client yet. We ask for their details only once you have their permission and written terms are in place."
- "What your client is considering" [interests], choose any: A second residency or citizenship / A home or property in Dubai / Continuing support from the Private Office / They are not sure yet.
- "When would your client like to begin?" [timeline], required: the three options.

*Become an Imperial Partner: What you have in mind.* "So the first conversation is a useful one."
- "I am interested in" [interests], choose any: Introducing clients / Approved materials for my team / Training with Imperial Academy / Co-hosting an event.
- "How soon? (optional)" [timeline].

*Train or certify my team: What you would like to learn.* "Imperial Academy, in development, will train Partner teams to explain the options accurately."
- "I am interested in" [interests], choose any: Explaining residency and citizenship options accurately / Approved materials / Certification for my team / Something else.
- "How soon? (optional)" [timeline].

Why: interests tell the team what to prepare; the timeline is the strongest signal in the score. Neither asks anything about a third party: no client name, no client details, no head count, no budget.

**Screen 4 of 4: How shall we reply?** The closing screen (2.5). Next steps on this path: verification, booking, WhatsApp, "Explore Imperial Partners Club online" once that site is live (To confirm, shared/ecosystem.json), "Read while you wait".

### 2.4 Institutions and Strategic Relationships (three screens)

Opening line: *For organisations exploring a relationship with the Group. One person at Group level will read your message and reply personally.*

The division is fixed: group, which the routing file sends to Opportunity Requests, stage New Request, with the Division field Multiple and no Contact Type.

**Screen 1 of 3: What would you like to explore?** "Choose any that apply." [interests], at least one: A strategic partnership / An event or diplomatic collaboration / Media, speaking or editorial / A service or supplier proposal / Something else.

Why: the Group owner triages Opportunity Requests by the nature of the relationship; it is the one question that frames the conversation.

**Screen 2 of 3: About your organisation.** "So the message reaches the right person at Group level."

- "Organisation" [firm], required.
- "Which best describes it?" [org_type, new], required: Government or public body / Embassy, consulate or mission / Bank or financial institution / Law, advisory or professional services firm / Developer or property group / Media, events or hospitality / Other.
- "Your role (optional)" [profession].
- "Country" [country], required.
- "Is there a date that matters? (optional)" [timeline]: the three options.

Why: the organisation becomes the organisation record in Pipedrive, deduplicated by name, and the deal is linked to it; the type lets the Group owner triage a mission differently from a supplier (and lets Imperial OS count them); the role says who is writing; the date sets priority only. Institutions are never asked about budget.

**Screen 3 of 3: How shall we reply?** The closing screen (2.5). Next steps: verification, booking, WhatsApp, "Read while you wait".

### 2.5 The closing screen, shared by the three paths

Title "How shall we reply?", lead "One person will read this and reply personally." Above the fields, one quiet line summarising the answers so far ("Private client · Imperial Citizenship · My family · Within 3 months") with a single "Change" link back to the first screen; it replaces the review table of the v5 step 3.

- "Full name" [name], required.
- "Email" [email], required; format checked on the page, disposable domains refused on the page and by the function, as built.
- "Phone, with country code (optional)" [phone], hint "If you give a number, we can confirm it by WhatsApp or SMS after you send."
- "Reply by" [pref]: Email / Phone call / Either (values unchanged from v5).
- "Anything you would like us to know (optional)" [msg], three rows. Optional in v6: the structured answers already give the team what a first conversation needs, and a required essay is the opposite of discreet.
- Consent [consent], required: "I agree to Imperial Holdings Group using these details to reply to me, as described in the privacy notice." The notice opens in a new tab, as built. (Wording: To confirm, counsel; docs/PRIVACY-NOTES.md section 4 lists the v5 wording it replaces.)
- One button: **Send to Imperial.** While sending: "Sending". Under it: "Nothing is shared beyond the people who need it to reply."

### 2.6 What is never asked up front

Asset values, net worth or income; exact budget figures; passport or identity numbers; dates of birth; home addresses; names or details of family members; anything about a client a Partner is introducing; source of funds; documents or uploads; health, religion, political exposure or any other special category; nationality as a requirement. Anything on this list that a service later needs is asked by the named person, after the first conversation, under the division's own process.

---

## 3. The field mapping

Every field the journey posts, where it comes from and what the core does with it. "Core change" marks the four small changes in section 6.5; everything else is as built.

| Field | Asked where | Values | In Pipedrive (as built unless marked) |
|---|---|---|---|
| `audience` | Chooser, or `?journey` / `?audience` | clients, partners, institutions | Contact Type Client (230), Partner/Introducer (231), none for institutions; note line Audience; new note line Journey (core change) |
| `audience_resolved` | Hidden, set at send | same | Read by the core when `audience` is absent |
| `about` | Path screen 1, or `?about` | citizenship, private-office, partners-club, academy, real-estate, group | Owner, lead or deal, pipeline and stage, Division field, from shared/lead-routing.json |
| `routed_to` | Hidden, set at send | division name | Note line Routed to |
| `for_whom` | Clients screen 2; Partners screen 1 (Introduce a client) | myself, family, client | Service Requested (For ...); Request Type Referral (1126) when partners-club and client; score source referral |
| `country` | Every path | free text | Person Country of Residence when it matches an option, otherwise the note |
| `nationality` | Clients, citizenship and private-office routes, optional | free text | Person Nationality when it matches, otherwise the note |
| `timeline` | Every path; required for clients and for an introduction | 3m, 3-12m, exploring | Score, Urgency, expected close date, note |
| `budget` | Clients, citizenship and real-estate routes, optional | under-250k, 250k-500k, 500k-1m, over-1m, undisclosed | Score, note |
| `re_intent`, `re_area` | Clients, real-estate route, optional | buy, rent; free text | Service Requested, note |
| `profession` | Partners screen 2 (required); Institutions screen 2 (role, optional) | text | Service Requested (Partner: profession, firm); note, labelled Role for institutions (core change) |
| `firm` | Partners and Institutions, required | text | Organisation found by name or created, linked to the person and the deal |
| `interests` | Partners screen 3, Institutions screen 1, finder goals | labels, comma separated | Note line Interests; for institutions also Service Requested (core change) |
| `org_type` (new) | Institutions screen 2, required | government, mission, financial, professional, property, media, other | Note line Organisation type (core change); no custom field is created |
| `name`, `email`, `phone` | Closing | text, email, tel (optional) | Person; e-mail then phone are the dedupe keys; phone in E.164; Verification Status |
| `pref` | Closing | Email, Phone call, Either | Note line Reply by |
| `msg` | Closing, optional | text | Note Message; Urgency when it says urgent |
| `consent` | Closing | yes | Note line Consent |
| `lead_source` | Hidden | website, programme-fit, guide | Title suffix, note line Lead source |
| `quiz_answers` | Hidden, fit check handover only | JSON | Note line Programme fit answers (new in the hidden contact form) |
| `site` | Hidden | ihg | Note line Site; the sister sites set their own |
| `page` | Hidden, set at send | the URL with about, journey and via | Tracking line page; the core reads journey and via from it (core change) |
| `source`, `medium`, `campaign`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`, `landing`, `referrer` | Hidden, first touch of the visit | as captured | Source Method, Source Platform Website, Campaign Name, the thirteen Tracking lines, the score source |
| `cf-turnstile-response`, `company_url` | Hidden | token; empty | Turnstile check when on; honeypot |

Not posted by the journey, kept in the schema and the hidden forms: `division` (the `enquiry` and `guide` forms), `interest` (the Real Estate register-interest form). The `enquiry` form itself is retired from the pages (6.2) but stays in `index.html` and the schema so nothing breaks and a sister site may still use it.

Score, unchanged: an introduction by a Partner within three months is hot without a budget; a private client exploring with no band is exploring; an institution with a date within three months is warm (group has no division-fit point). Owner, pipeline and stage per division are unchanged and the owner ids remain To confirm.

---

## 4. The states

| State | What the visitor sees | When |
|---|---|---|
| Draft | "We kept what you started earlier." with "Start afresh", the answers restored, the path reopened on the first screen that still needs an answer | A reload or a return to `/contact` with `ihg-draft-contact` on the device (as built). Switching path clears the other path's answers and keeps name, e-mail, phone, reply-by and the note |
| Sending | The button reads "Sending", is disabled and `aria-busy`; the screen stays; the draft stays | Between Send and the answer, 15 seconds per route before the next route is tried (as built) |
| Received, direct path | **Received, and with Imperial Citizenship.** "Reference W.... One person at Imperial Citizenship will be your point of contact and will reply personally." | `submitLead` resolved through `/.netlify/functions/lead`, which answers `ok:true` only after Pipedrive took the record |
| Received, Netlify Forms path | **Received by Imperial.** "Your message has been received and is being passed to Imperial Citizenship. One person will reply personally." | `POST /` answered 2xx. Netlify holds the submission and runs the function afterwards, so the page may not say the record is with a person. This is the production path almost every time |
| Received, variants | Group and Institutions: "the Group" in place of a division, "One person will read it, bring in the right house if one is needed, and reply personally." Real Estate: "Imperial Real Estate has not yet launched. We will tell you plainly what is possible today." | By division |
| Reply time | Not printed | To confirm: a standard such as one working day in Dubai or Lagos hours. Until the team commits to one in writing the page promises only that one person will reply personally |
| Next steps | Verify your phone (when a phone was given and the endpoint is enabled; skip allowed; a code accepted but not yet recorded is worded softly), Book a first conversation (one button per office, name, e-mail and division prefilled, the To confirm chip while `config.booking` is empty), WhatsApp (both offices, each with its To confirm chip until confirmed WhatsApp enabled), Request the guide (citizenship route, a link to the guide section), Explore the division online (where the site is live), Read while you wait, Send another | After either received state, in that order, as built |
| Refused address | The closing screen again, the e-mail field marked "Please use an email address you check regularly." and "Nothing has been sent yet." | A disposable or malformed address, from the page's own check or from the function's `reason` (as built) |
| Could not send | **We could not send this just now.** "Please call or email us and we will take it from there. What you typed is kept on this device, so you can also try again later." with both telephones and the e-mail; focus moves to the message; the draft stays | Both routes failed, or the function refused for a reason that is not the address: rate, turnstile, sync, unconfigured (as built) |
| Local file | "Forms only send from the live website, not from a file opened on this computer." | `file://` (as built) |
| Preview build | An amber chip on the closing screen: "Preview build: nothing is sent from this preview". On Send: the received state in the Forms wording under the label "Preview of the confirmation. Nothing was sent.", without the tick animation and without the "Received" announcement; the next steps show their To confirm chips; no request leaves the page | `html[data-preview]`, which the `BUILD_PREVIEW=1` build sets and the Render preview serves. This is the one place a mocked path appears, and it is labelled |

What never happens: a success state before a confirmation; "with" a division or a person after a Netlify Forms acceptance; a reply time that nobody has agreed; a confirmation on the preview that is not labelled as one.

---

## 5. The handoff

### 5.1 Ownership

The path chooses the audience, the first screen chooses the division, and the division chooses the owner and the record, from `shared/lead-routing.json` as built. The one named point of contact is the division owner.

| Path | Division | Record | Where | Contact Type | Owner (Pipedrive user id) |
|---|---|---|---|---|---|
| Private Clients | citizenship | lead | Leads inbox, Division Imperial Citizenship | Client | To confirm |
| Private Clients | private-office | lead | Leads inbox, Division Private Office | Client | To confirm |
| Private Clients | real-estate | lead | Leads inbox, Division Imperial Real Estate | Client | To confirm |
| Private Clients | group | deal | Opportunity Requests, New Request, Division Multiple | Client | To confirm |
| Professional Partners | partners-club | deal | Introducer Pipeline [2026], Introducer IN (Request Type Referral for an introduction) | Partner/Introducer | To confirm |
| Professional Partners | academy | deal | Introducer Pipeline [2026], Introducer IN | Partner/Introducer | To confirm (and whether Academy belongs in this pipeline) |
| Institutions | group | deal | Opportunity Requests, New Request, Division Multiple | none | To confirm |

Every `owner` is `0` today (the token's user). The ids are read from `GET /users` once the token exists (docs/LEADS.md section 2) and written to the routing file, not the code. A second owner per division for cover (holidays, time zones between Dubai and Lagos) is a Pipedrive assignment rule, not a website matter: To confirm with the team.

### 5.2 Source attribution

- **Channel:** the twelve first-touch tracking fields and `page`, captured by `TRK` in app.js at the first page of the visit and posted with every form, as built. The core turns them into Source Method, Source Platform Website and Campaign Name, and prints all thirteen in the note.
- **Journey and entry point:** no new field. The journey is `audience_resolved`; the entry point is `via` in the query string of `page`. The core adds one note line, `Journey: Private Clients · Entry: division-hero` (6.5), and Imperial OS receives both as `journey` and `entry`. The analytics events `journey_started {journey, via}`, `journey_step {journey, step}` and `journey_switched {from, to}` are sent through `ihgTrack`, and `enquiry_submitted` gains `journey` and `via`.
- **In-site source:** `lead_source` keeps its three values. `programme-fit` now arrives through the journey (6.3) with `quiz_answers`; `guide` is unchanged.
- **Referrer caveat:** docs/LEADS.md section 8 step 3 (Netlify's own `referrer` may win over the page's first-touch field) still applies and is verified in the live run.

### 5.3 Deduplication

As built: the person is found by e-mail, then by phone (digits compared, trunk zero dropped); a known person is reused and never overwritten; an open lead or deal of the same division is reused; a returning person gets a "Website enquiry follow up" activity due today, assigned to the owner. The organisation is found by name or created.

What the journey changes:

1. **A person on two paths is two records, one person.** A client of Imperial Citizenship who later introduces a colleague through the Partners path gets a new deal in the Introducer Pipeline, because the division differs; the person record is the same, the Contact Type lives on each record, so nothing is overwritten.
2. **The same path twice reuses the open record** and adds the note and the activity, so a visitor who sends twice in a week is one lead with two notes, not two leads.
3. **Institutions are deduplicated by organisation as well as person:** To confirm. The core looks for open records of the person only; two people from one embassy would be two deals linked to one organisation. That is defensible (two conversations) and is left as built, with the question put to the Group owner.
4. **On the device,** switching path clears the other path's answers and keeps the contact fields, so a wrong first choice does not produce two drafts or two submissions.

### 5.4 Consent

- **What is asked:** one box, required, "I agree to Imperial Holdings Group using these details to reply to me, as described in the privacy notice." No marketing consent is asked; none is implied; a newsletter box, if ever wanted, is a separate optional field and a separate decision for counsel.
- **What is recorded:** `consent: yes` in the note on the person and on the record; the time, from the Netlify submission `created_at` or the direct submission time printed in the note; the page it was given on (`page`); the privacy notice version in force (`legal.updated`, empty until counsel approves a version: To confirm). Proposed one addition to the note line: `Consent: yes (wording v6, notice <date or To confirm>)`, so a later wording change is traceable.
- **Where it lives:** the Pipedrive note (the record the team works from), the Netlify Forms inbox copy (the safety net), and, when switched on, the Imperial OS record (`consent` object, 5.6). The IP address is read for the rate limit and Turnstile and is not written anywhere, as built.
- **Retention:** To confirm, counsel with the Founder (docs/PRIVACY-NOTES.md section 3: one period after last contact for enquiries that do not become clients; the client rule). The journey adds no new retention question.
- **Withdrawal and deletion:** as the notice says, by writing to the group mailbox (a dedicated privacy mailbox is To confirm). The internal process that fulfils a deletion across Pipedrive, the Netlify inbox, the function logs, Resend, Twilio and Imperial OS is To confirm (PRIVACY-NOTES section 4 item 7; Imperial OS is added to that list).

### 5.5 Follow-up requirements

| Requirement | Proposal | Status |
|---|---|---|
| Who responds | The division owner named in the routing file, personally, as the one point of contact; the Group owner for Institutions and for "something broader" | To confirm: the owner ids |
| In what time | Acknowledge within one working day in the office's hours (Dubai or Lagos, by the country given); offer a first conversation within five working days | To confirm: the standard, before the page prints any time |
| In which channel | The visitor's "Reply by": e-mail, phone call, or either. A phone reply only when a number was given; WhatsApp only on a verified number or when the visitor wrote on WhatsApp first | Proposal |
| What the activity in Pipedrive is | Today an activity exists only for a returning person. Proposal: one activity per new record too, "Reply to <first name>: first conversation", type `call___scheduled` (the account's scheduled call type), due the next working day, assigned to the owner, so every record carries its own deadline and the inbox is worked from the activity list. Switched on by `activity.onNew: true` in the routing file | To confirm with the team: it changes what they see every morning |
| What the person receives | The confirmation e-mail as built, when `EMAIL_API_KEY` and `EMAIL_FROM` are set; the Forms-path wording of the page is matched in the e-mail ("received" rather than "with") | Small wording change in email.js (6.6) |
| What is reported | `enquiry_submitted` with journey and via; the function log line per submission (as built) | As built |

### 5.6 The Imperial OS handoff (design only, To confirm, nothing live)

Imperial OS is the Group's internal operating platform (the `imperial-ai-control-centre` repository, not reachable from here). Pipedrive stays the system of record for the team; Imperial OS receives a copy of every stored relationship record and its verification events. Which of the two is the master for a given field is To confirm with the owner of that repository.

**Record contract** (`imperial.relationship.v1`), one JSON object per stored submission:

```json
{
  "schema": "imperial.relationship.v1",
  "key": "ihg:contact:N1A2B3C4",
  "event": "relationship.received",
  "site": "ihg",
  "form": "contact",
  "journey": "clients",
  "entry": "division-hero",
  "division": "citizenship",
  "lead_source": "website",
  "status": "synced",
  "score": {"band": "hot", "points": 9, "reasons": ["timeline 3m +4", "budget over-1m +3", "division single +1", "source organic +1"]},
  "person": {"name": "A. Example", "email": "a@example.com", "phone": "+971500000000", "country": "United Arab Emirates", "nationality": "Nigerian", "reply_by": "Email"},
  "organisation": {"name": "", "type": "", "role": ""},
  "answers": {"for_whom": "family", "timeline": "3m", "budget": "over-1m", "re_intent": "", "re_area": "", "interests": [], "message": ""},
  "consent": {"given": true, "wording": "v6", "notice_version": "", "at": "2026-10-15T16:13:00Z", "page": "https://www.imperialholdingsgroup.com/contact?about=citizenship&via=division-hero"},
  "attribution": {"source": "google.com", "medium": "organic", "campaign": "", "utm_source": "", "utm_medium": "", "utm_campaign": "", "utm_content": "", "utm_term": "", "gclid": "", "fbclid": "", "landing": "", "referrer": ""},
  "pipedrive": {"person_id": 1, "org_id": null, "kind": "lead", "id": "lead-2", "reused": false, "owner_id": 0},
  "verification": {"status": "not_verified", "channel": "", "at": ""},
  "timestamps": {"received_at": "2026-10-15T16:13:00Z", "processed_at": "2026-10-15T16:13:02Z", "sent_at": "2026-10-15T16:13:02Z"},
  "ref": "N1A2B3C4",
  "submission_id": "e2e-0001"
}
```

- **Idempotency key:** `site:form:ref`, where `ref` is the Netlify submission id (`N` plus its last eight characters) or the direct reference (`W...`). Both are unique per submission; a retry of the same post carries the same key, so the receiver upserts. The verification event uses `key` plus `:verified`.
- **Timestamps:** `received_at` (Netlify `created_at`, or the function time on the direct path), `processed_at` (when the core finished), `sent_at` (when the post was made). All UTC, ISO 8601.
- **Status flow, website side:** `received` (gates passed, score computed, Pipedrive not configured or failed, the submission held in the Netlify inbox) → `synced` (Pipedrive person and record written; `pipedrive` filled) → `verified` (a later `relationship.verified` event with `verification` filled). Rejected submissions (honeypot, disposable, rate, Turnstile) are never sent: there is no consent and usually no person. **Status flow, Imperial OS side** (acknowledged, in conversation, booked, declined, client): To confirm with that repository; the website never writes those.
- **Transport:** a new module `netlify/functions/lib/imperial-os.js` with `notify(record)`, called at the end of `processLead` when the result is stored, and from `markVerified` after a good code. `POST` to `IMPERIAL_OS_WEBHOOK_URL` with headers `Content-Type: application/json`, `Idempotency-Key: <key>`, `X-Imperial-Event: relationship.received`, `X-Imperial-Signature: sha256=<HMAC-SHA256 of the raw body with IMPERIAL_OS_WEBHOOK_SECRET>`. Timeout five seconds, one retry after two seconds on a network error or a 5xx, never on a 4xx. The receiver answers 200 or 202 with `{"ok": true, "id": "..."}`; anything else is logged as `imperial-os notify failed reason=... key=...` and never changes the result the page sees. **Off until the URL is set**: with `IMPERIAL_OS_WEBHOOK_URL` empty the module returns `{sent:false, skipped:'no env'}` and nothing leaves the function. Both variables go in the Netlify UI, never in the repository.
- **Privacy:** the record carries personal data; the receiving end, its storage and its retention join the providers list in docs/PRIVACY-NOTES.md section 2 and the deletion process in section 4 item 7 (To confirm, counsel). The signature lets the receiver refuse anything not sent by the function.
- **Tests:** `tests/functions/imperial-os.test.js` with the mock fetch: nothing sent without the env; the body, the key and the signature with the env; a 5xx retried once; a 4xx not retried; a failure never changes `processLead`'s result.

---

## 6. What changes in the code, file by file

For the implementer. Nothing below has been done; the main checkout is at dee0685. The design keeps ES5 in `app.js` and `data.js`, British English, no em dash, every field in the hidden Netlify forms, and the build contract's ownership of files.

### 6.1 `assets/js/data.js`

- Add `journeys: { ... }` from `journey.json` (plain JSON is valid ES5). Keep `enquiry` (the palette, the routing line and the labels in the summary read it). Keep `fit`, `guideCopy`, `finder`, `faq`, `contact`, `config`.
- `enquiry` labels are no longer shown as the six-way step; the three paths' option labels come from `journeys`.

### 6.2 `assets/js/app.js`

- **`V.contact(q)`**: render the hero with the new title and lead, the chooser (`D.journeys.chooser`) or the quiet path line, then the chosen path's screens from `D.journeys.journeys[i].screens`, the closing screen from `D.journeys.closing`, the one `form-err` box, then the existing side column (offices, WhatsApp, booking, "Before we speak") and the FAQ. Read `q.journey`, `q.audience` (alias), `q.about`, `q.goals`; ignore `q.via`. Progress list from the path's screen titles ("Step 2 of 4").
- **New** `journeyScreen(screen, path)`, `journeyField(f)` (choice as the existing `.routes` cards, multi as `.fd-pers` pills with `aria-pressed`, choice-or-text for the profession, text, textarea, checkbox through `consentBox()`), `journeySummary(form)` (the one-line summary with Change), `routingLine(about)` (one sentence, from `routingHTML`'s data).
- **`bindForms`**, the `contact` branch becomes `bindJourney(form)`: the chooser sets `audience` and shows the path; `when` conditions show and disable fields the way `bindCond` does today (a hidden field is disabled, so neither validated nor posted); per-screen validation through `mark()` and `announceInvalid()`; the Partners "Introduce a client" option sets `for_whom`; the clients "A client I am introducing" option offers the switch; `journey_started`, `journey_step` and `journey_switched` through `track()`; `finish()` unchanged in shape, with `extra.audience_resolved` from the path.
- **`enquiryBlock(pre)`** becomes `startBlock(pre)`: on the home page three path cards, on a division page one card "Start a relationship with <division>" with `?about=<key>&via=division`; no form. Remove the call to `enquiryForm()`; the function can go, the hidden form in `index.html` stays.
- **`bindFit` `finish()`**: instead of writing into the enquiry card, build the draft object (`about`, `audience`, `for_whom`, `country`, `timeline`, `budget`, `lead_source: 'programme-fit'`, `quiz_answers`), `store.set('ihg-draft-contact', draft)`, then `go('/contact?about=citizenship&via=fit')`. The fit done state's button reads "Continue to your message". `DRAFT_HIDDEN` already keeps `lead_source` and `quiz_answers`.
- **`submitLead`** already resolves with `via: 'forms'` or `'lead'` and `ref`; **`showSuccess`/`nextSteps`** read them: the direct wording with the reference, the Forms wording otherwise; the group, institutions and real-estate variants; the guide link on the citizenship route; the division site link where `D.sites` says `real`; the announcement "Received." instead of "Sent."
- **Preview**: in `finish()`, when `document.documentElement.hasAttribute('data-preview')`, skip `submitLead`, render the labelled preview of the received state and send no request; show the chip on the closing screen at render.
- **Labels**: hero buttons (`V.home`), the division hero and closing band (`V.division`), `closing()`, the article end, `V.notFound`, `V.error`, the mobile menu footer in `buildChrome`, the event glance panel in `V.event`, the finder result, the palette rows (`Enquire` kind becomes three "Start a relationship" rows), `routingHTML` → `routingLine`.
- **`pageMeta`/`resolve`** for `/contact`: title "Start a relationship", description from `journeys.description`.

### 6.3 `index.html`

- Hidden `contact` form: add `<input name="quiz_answers">` and `<input name="org_type">` (Netlify drops a field that is not in the static form).
- Mobile quick action (`#mcta`): "Enquire now" becomes "Start a relationship", `href` `/contact?via=header`.
- Nothing else; the four forms stay.

### 6.4 `shared/lead-schema.json`

- Add `"org_type": {"type": "enum", "values": ["government", "mission", "financial", "professional", "property", "media", "other"], "where": "contact, institutions path"}`.
- Update `where` on `interests` (contact: partners scope, institutions explore, finder), `quiz_answers` (contact, fit check handover), `nationality` (optional), `msg` (optional on contact), `profession` (partners and institutions), `firm` (partners and institutions); `forms.contact.label` to "Start a relationship: the chooser and the three paths". Add a short `journeys` note mapping the three paths to `audience` values. No field is removed or renamed.

### 6.5 `netlify/functions/lib/core.js` (four small changes, each covered by a test)

1. `noteLines`: after the Audience line, `Journey: <Private Clients | Professional Partners | Institutions and Strategic Relationships> · Entry: <via>` where the journey comes from `audience` and `via` is parsed from the query string of `data.page` (`''` when absent). A new `journeyName(audience)` helper.
2. `noteLines`: for `audience === 'institutions'` print `Organisation: <firm> · Type: <org_type label> · Role: <profession>` instead of `Firm: ... · Profession: ...`; the `org_type` label table lives in the routing file under `labels.orgType` so the words can change without a deploy of the code.
3. `serviceRequested`: for institutions add the `interests` text and the organisation type; for partners it stays `Partner: profession, firm`.
4. Optional activity on a new record when `routing.pipedrive.activity.onNew` is true (default false): subject `Reply to <first name>: first conversation`, due the next working day, assigned to the owner. The returning-person activity is unchanged.
5. At the end of `processLead` and `markVerified`: `await imperialOs.notify(record)` built from the result, guarded so that a failure never changes the result (5.6).

### 6.6 `netlify/functions/lib/email.js`

- The enquiry variant's opening line becomes "Thank you for your message. It has been received by Imperial Holdings Group and is with <division>; one person will be your point of contact." (the e-mail is sent after the record is stored, so "with" is true there). Guide and interest variants unchanged.

### 6.7 `netlify/functions/lib/imperial-os.js` (new, off by default)

- `notify(record)` as in 5.6; `buildRecord(result, data, ctx)` assembling the contract from the core's result; HMAC through `crypto.createHmac`. Reads `IMPERIAL_OS_WEBHOOK_URL` and `IMPERIAL_OS_WEBHOOK_SECRET` through `config.env` at call time.

### 6.8 `shared/lead-routing.json`

- `pipedrive.activity.onNew: false` with a note (5.5); `labels.orgType` (6.5); nothing else. Owner ids stay To confirm.

### 6.9 `assets/css/site.css`

- One block starting `/* === v6 journey === */`: the three path cards (built from `.routes` and `.houses` rules), the quiet path line, the summary line, the multi pills (from `.fd-pers`), the preview chip (from `.tbc`), the profession Other text reveal. No restyling of what exists.

### 6.10 Documentation and configuration

- `docs/LEADS.md` section 3 (Journey and Entry lines, Organisation line, `org_type`, the optional activity), section 6 (the two Imperial OS variables), a new section 11 for the Imperial OS handoff; `docs/ACCEPTANCE.md` rerun; `docs/PRIVACY-NOTES.md` (the consent wording, `org_type`, Imperial OS among the providers and in the deletion process); `docs/ECOSYSTEM.md` (the journey as part of the shared base: a sister site sets its default path and division and reuses `journeys`); `docs/BUILD-CONTRACT.md` 4.2 (`org_type`, the optional `msg` and `nationality`); `netlify.toml` comment (the two new variables).
- `shared/chrome/header.html` and `footer.html`: the button label and the footer link, kept in sync with `buildChrome` as the README asks.

### 6.11 `tests/e2e-leads.js` and the acceptance cases

`contactFlow()` and `enquiryFlow()` are replaced by one `journeyFlow(page, spec)` that opens `/contact` with the spec's `journey`, `about` and `via`, answers each screen and sends from the closing screen. The CRM assertions (`checkStored`) stay as they are, with two spec changes: `nationality` is optional (sent only when given) and `msg` is optional.

| Cases | Change |
|---|---|
| 1.1 to 1.12 (six choices, desktop and mobile) | Driven through the paths: citizenship, private-office, real-estate and group through Private Clients; partners-club (Introduce a client, which sets `for_whom` client as the spec expects) and academy through Professional Partners. Same records, same fields, same score; the note gains the Journey line |
| 1.13 returning person | Same path three times; unchanged assertions |
| 2.1, 2.2 disposable address | The e-mail field is on the closing screen; the "shown again" assertion targets that screen |
| 2.3 honeypot in the page | The honeypot input is inside the journey form; unchanged assertions |
| 2.4 honeypot posted straight to the endpoints | Unchanged |
| 3.1, 3.2 verification | Were the enquiry card on a division page; now `/contact?about=private-office` and `?about=academy` (the Academy page skips screen 1); `afterSuccess` scope becomes `#cf ` |
| 4.1, 4.2 booking | Same: the journey from a division link |
| 5.1 primary POST fails | The success wording is the direct one, "Received, and with", with the reference; assert it |
| 5.2 both fail | Unchanged wording; the restored draft now includes the path |
| 6.1 guide form | Unchanged |
| 6.2 programme fit | The fit check hands over to `/contact?about=citizenship&via=fit`; the draft prefills the journey; the record keeps `(programme fit)`, `[HOT]` and the answers in the note |
| 7.1 loading state | The Send button is the closing screen's `[data-send]`; the "hidden Continue untouched" check targets the first screen's Continue |
| 7.2 old links | Unchanged |
| 7.3 search engine organic | Driven through the journey; unchanged assertions |
| 7.4, 7.5, 7.6 verification edge cases | Were the enquiry card; now the journey from a division link |
| 7.7 fit draft survives a wander | The draft key is `ihg-draft-contact`; `lead_source` and `quiz_answers` survive the wander to About and back |
| 7.8 stalled primary post | Driven through the journey; the fallback wording is the direct one |

Three cases unchanged (2.4, 6.1, 7.2), thirty changed. Seven new cases:

- 8.1 the chooser: each of the three paths produces the right audience and record (clients → lead with Contact Type Client; partners, Introduce a client → deal in Introducer IN with Request Type Referral; institutions → deal in Opportunity Requests with the organisation created and linked, `org_type` and the interests in the note, no Contact Type).
- 8.2 switching path from the clients screen 2 ("A client I am introducing") keeps the typed name and e-mail and clears the clients answers; the record is a partners deal.
- 8.3 the received wording differs by path: "Received by Imperial" after a Forms acceptance, "Received, and with" plus the reference after the direct endpoint; neither names a person.
- 8.4 the preview build (`data-preview`) shows the chip, sends no request on Send and labels the confirmation.
- 8.5 the entry point: a journey opened with `via=division-hero` carries it in the note's page line and the Journey line.
- 8.6 prefill from each division page: citizenship, private-office, real-estate and academy skip screen 1; partners-club lands on it.
- 8.7 optional fields: a clients journey without nationality, budget or message arrives with "not given" in the note and the right score.

`tests/functions`: `core.test.js` gains the Journey line, the institutions note, `org_type` through `pick()`, the optional activity flag; `imperial-os.test.js` as in 5.6; `tests/seo.js` already checks that the routing and schema files are not published.

---

## 7. Open points, all marked To confirm

| Item | Who | Where it lands |
|---|---|---|
| Pipedrive owner user id per division, and whether Academy enquiries belong in the Introducer Pipeline | Zaid Alhindi or Kaylan Tarin | shared/lead-routing.json |
| The reply time standard before the page or the e-mail prints one | The Founder with the division owners | journeys.states.received.replyTime |
| One activity per new record (`activity.onNew`), and its subject and due rule | Kaylan Tarin | shared/lead-routing.json |
| Consent wording of the closing screen, and the retention period | Counsel | data.js journeys.closing, the privacy notice |
| Budget bands and currency (from the build contract, not the brief) | The Founder | data.js BUDGETS, journeys |
| Imperial OS: the receiving endpoint, the secret, which system is the master per field, the OS-side status flow, where the record is stored and for how long | The owner of imperial-ai-control-centre, with counsel | Netlify env, docs/LEADS.md section 11 |
| Dedupe of institutions by organisation as well as person | The Group owner | core.js, if wanted |
| Careers enquiries: today they reach Imperial Academy through the Partners path's "Train or certify my team"; whether they need a route of their own | Zaid Alhindi | journeys.partners screen 1 |
| Booking pages, WhatsApp-enabled numbers, Twilio channel, Turnstile keys, the sending mailbox | Zaid Alhindi, Gilbert Ferrer | data.js config, Netlify env (unchanged from the v5 list) |
| The Partners Club, Private Office and Academy site addresses, so the received state can offer them | Gilbert Ferrer | shared/ecosystem.json |
| The three Leads inbox labels (Hot, Warm, Cold) exist | Kaylan Tarin | Pipedrive |

Assumptions made because nobody could be asked: the owner's decision on the front door is taken from the roles in docs/ECOSYSTEM.md section 1 and the task's summary of it (IHG routes and hands over; the division sites keep the deeper journeys); the journey lives at `/contact` rather than a new route, so every existing link, the sitemap and the prerendered page stay valid; the `enquiry` card is retired from the pages but its form and fields are kept; `org_type` is the one new field; the preview state keys off `data-preview` because a preview build is never the production site; the three timeline labels are shown unchanged on every path so the page and the note agree.

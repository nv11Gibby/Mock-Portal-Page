# Acceptance tests: the lead flow (brief section 9, items 1 to 4) and the Start a relationship journey

Run on 16 October 2026 at 08:22 UTC with `NODE_PATH=$(npm root -g) node tests/e2e-leads.js --port 8918` (what
`npm run test:e2e` runs) on branch `v6/journey`, from the prerendered build in `dist/`, on desktop (1440 by 900) and
mobile (390 by 844, touch) Chromium through Playwright.

**These are offline simulations.** The live Pipedrive token is not available in this environment, so every call to
Pipedrive, Twilio Verify and Resend went to the in-memory stand-ins in `tests/functions/_mock.js`, and the ids in the
tables below are mock ids (persons and deals count up from 1, leads are `lead-N`, emails `em_N`, verifications `VE N`).
Nothing was sent to a live service, and the Imperial OS handoff stayed off (no `IMPERIAL_OS_WEBHOOK_URL`). **The real
Pipedrive lead and deal ids come from the live run a person performs with approval, described in `docs/LEADS.md`
section 8.** What this run does prove is that the pages, the two submission paths, the real function code
(`submission-created.js`, `lead.js`, `verify.js` and `lib/`), the routing config and the schema behave together as
the brief and docs/RELATIONSHIP-JOURNEY.md ask, with the responses a real API would give.

Result: **40 of 40 cases pass.** v6 rewrote the suite for the journey (docs/RELATIONSHIP-JOURNEY.md 6.11): the
v5 contact and enquiry card flows are replaced by one `journeyFlow` that opens `/contact` (or follows a link from a
division page or the fit check), answers each screen of the path and sends from the closing screen. Three cases are
unchanged (2.4, 6.1, 7.2 apart from the page title), thirty are driven through the journey with the same CRM
assertions (`checkStored`; `nationality` and `msg` optional; the Contact Type follows the path), and seven are new
(8.1 to 8.7). The previous run (15 October, branch `fix/frontend`, 33 of 33) is superseded.

## 1. How the harness works

1. `npm run build` writes `dist/`; the harness serves it on `http://127.0.0.1:8791` with clean URLs (`/contact` serves
   `contact/index.html`, unknown paths get `404.html` with a 404), exactly as a static host would.
2. `POST /` (the Netlify Forms post the page makes) is parsed as a form body and handed to the real
   `netlify/functions/submission-created.js` as a Netlify shaped event (`{payload:{form_name, data, id, created_at}}`,
   with `data.ip` set as Netlify does). The server answers 200 to the page after the function has run, so the log is
   complete when the page shows its success state. On Netlify the function runs after the page is answered; the
   difference is timing only.
3. `POST /.netlify/functions/lead` and `/verify` are handed to the real handlers with `httpMethod`, `headers` (origin,
   host, forwarded proto and ip) and the raw body, and the handler's status, headers and body go back to the page.
4. The environment is set to dummy values: `PIPEDRIVE_API_TOKEN`, the three `TWILIO_*` variables (so the verification
   step is enabled), `EMAIL_API_KEY` and `EMAIL_FROM` (so the confirmation email path runs against the Resend mock),
   `TURNSTILE_SECRET_KEY` unset. Global `fetch` is replaced by the mock: person search returns nothing until the
   harness has created that email or phone; POST persons, organisations, leads, deals, notes and activities return ids
   and keep the bodies; PUT persons is recorded; the Leads API accepts only the UUIDs of its own lead labels, which the
   mock serves from `GET /leadLabels` (Hot Lead, Warm lead, Cold Lead), as the real one does; Twilio start always succeeds and check approves `123456` only; Resend
   returns an id. Two cases answer the verify call in the browser instead (7.4 stubs `{verified:true, recorded:false}`,
   7.5 refuses the WhatsApp start with `reason:'provider'`), one blocks the page's fetch of the disposable domain list
   (2.2), and one holds `POST /` open for 19 seconds without running the function (7.8). Every call is written to `tests/e2e-output/mock-log.json` with the test that caused it, the method,
   path, query (token removed), body, status and response. `results.json` and `summary.md` sit next to it. The
   directory is ignored by git.
5. The rate limit buckets are reset before each case, so the per IP limit (5 per 10 minutes) does not interfere with
   the submissions one address makes in a minute and a half.
6. The journey (v6): `journeyFlow(page, spec)` clicks the chooser card when the chooser shows, then on each screen
   answers what is on show (the first answer first, since it decides the conditional fields, the Partners variant and
   the routing line; radio cards, multi choice pills, the profession choice or its Other text, text fields, consent)
   and continues, recording the screens it passed. The preview case (8.4) adds `data-preview` to each document as it
   loads and reaches `/contact` by the footer link, because the prerendered `/contact` of a normal build has no chip;
   the Render preview serves pages prerendered with the attribute.

Options: `--no-build` reuses `dist/`, `--port 8792` or `E2E_PORT` moves the server, `--only 3.1` runs one case,
`--headed` shows the browser. Playwright is found through `require('playwright')` or the global npm root.

## 2. Results

| Test | Result | Mock ids | What was checked |
|---|---|---|---|
| 1.1 journey clients, citizenship (desktop) | pass | ref NE2E-0001, kind lead, id lead-2, person 1, pipeline Leads inbox, note 3, email em_4 | chooser then need > who > timing > you; form contact, lead lead-2 in Leads inbox, score hot (9 points), note 3 with the Journey line and all 13 tracking fields, person 1 Not Verified, verification skipped, email em_4 |
| 1.2 journey clients, private-office (desktop) | pass | ref NE2E-0002, kind lead, id lead-7, person 6, pipeline Leads inbox, note 8, email em_9 | chooser then need > who > timing > you; form contact, lead lead-7 in Leads inbox, score warm (4 points), note 8 with the Journey line and all 13 tracking fields, person 6 Not Verified, verification skipped, email em_9 |
| 1.3 journey partners, partners-club (desktop) | pass | ref NE2E-0003, kind deal, id 13, person 12, pipeline 2/7, org 11, note 14, email em_15 | chooser then how > practice > scope > you; form contact, deal 13 in 2/7, score hot (7 points), note 14 with the Journey line and all 13 tracking fields, person 12 Not Verified, verification skipped, email em_15 |
| 1.4 journey partners, academy (desktop) | pass | ref NE2E-0004, kind deal, id 19, person 18, pipeline 2/7, org 17, note 20, email em_21 | chooser then how > practice > scope > you; form contact, deal 19 in 2/7, score exploring (2 points), note 20 with the Journey line and all 13 tracking fields, person 18 Not Verified, verification skipped, email em_21 |
| 1.5 journey clients, real-estate (desktop) | pass | ref NE2E-0005, kind lead, id lead-24, person 23, pipeline Leads inbox, note 25, email em_26 | chooser then need > who > timing > you; form contact, lead lead-24 in Leads inbox, score hot (6 points), note 25 with the Journey line and all 13 tracking fields, person 23 Not Verified, verification skipped, email em_26 |
| 1.6 journey clients, group (desktop) | pass | ref NE2E-0006, kind deal, id 29, person 28, pipeline 26/163, note 30, email em_31 | chooser then need > who > timing > you; form contact, deal 29 in 26/163, score exploring (1 points), note 30 with the Journey line and all 13 tracking fields, person 28 Not Verified, verification skipped, email em_31 |
| 1.7 journey clients, citizenship (mobile) | pass | ref NE2E-0007, kind lead, id lead-34, person 33, pipeline Leads inbox, note 35, email em_36 | chooser then need > who > timing > you; form contact, lead lead-34 in Leads inbox, score hot (9 points), note 35 with the Journey line and all 13 tracking fields, person 33 Not Verified, verification skipped, email em_36 |
| 1.8 journey clients, private-office (mobile) | pass | ref NE2E-0008, kind lead, id lead-39, person 38, pipeline Leads inbox, note 40, email em_41 | chooser then need > who > timing > you; form contact, lead lead-39 in Leads inbox, score warm (4 points), note 40 with the Journey line and all 13 tracking fields, person 38 Not Verified, verification skipped, email em_41 |
| 1.9 journey partners, partners-club (mobile) | pass | ref NE2E-0009, kind deal, id 44, person 43, pipeline 2/7, org 11, note 45, email em_46 | chooser then how > practice > scope > you; form contact, deal 44 in 2/7, score hot (7 points), note 45 with the Journey line and all 13 tracking fields, person 43 Not Verified, verification skipped, email em_46 |
| 1.10 journey partners, academy (mobile) | pass | ref NE2E-0010, kind deal, id 49, person 48, pipeline 2/7, org 17, note 50, email em_51 | chooser then how > practice > scope > you; form contact, deal 49 in 2/7, score exploring (2 points), note 50 with the Journey line and all 13 tracking fields, person 48 Not Verified, verification skipped, email em_51 |
| 1.11 journey clients, real-estate (mobile) | pass | ref NE2E-0011, kind lead, id lead-54, person 53, pipeline Leads inbox, note 55, email em_56 | chooser then need > who > timing > you; form contact, lead lead-54 in Leads inbox, score hot (6 points), note 55 with the Journey line and all 13 tracking fields, person 53 Not Verified, verification skipped, email em_56 |
| 1.12 journey clients, group (mobile) | pass | ref NE2E-0012, kind deal, id 59, person 58, pipeline 26/163, note 60, email em_61 | chooser then need > who > timing > you; form contact, deal 59 in 26/163, score exploring (1 points), note 60 with the Journey line and all 13 tracking fields, person 58 Not Verified, verification skipped, email em_61 |
| 1.13 returning person: same path three times, same email, then same phone (dedupe, note and activity on the open lead) | pass | ref NE2E-0013, kind lead, id lead-64, person 63, pipeline Leads inbox, email em_66, notes 65, 68, 72, activities 69, 73 | three journeys on the Private Clients path, one person 63 and one lead lead-64: the second (same email) and third (new email, same phone) each added a note and a "Website enquiry follow up" activity due today; the person now holds both emails. |
| 2.1 disposable email through Netlify Forms: the closing screen refuses it before sending, the function refuses it too | pass | ref NE2E-0016, submission e2e-0016 | page: the closing screen refuses mailinator.com with "Please use an email address you check regularly." and nothing is posted; a permanent address clears the mark. Function (same data posted directly): rejected reason=disposable, no Pipedrive call, no email. |
| 2.2 disposable email through the fallback endpoint: refused, and the person is told which field | pass | ref WMVAP8ANA0E | lead.js: {ok:false, reason:disposable}, nothing in Pipedrive. The page shows "Please use an email address you check regularly. Nothing has been sent yet.", stays on the closing screen and marks the email field. |
| 2.3 honeypot filled in the page: nothing is sent, the button is released and the office contacts are shown | pass | none | no POST at all (the page stops before sending); the Send button is released and the person sees the office contacts ("We could not send this just now. Please call or email us and..."), so a browser that autofilled the hidden field does not leave them with a spinner. |
| 2.4 honeypot filled, posted straight to the endpoints: rejected | pass | ref NE2E-0017, WMVAP8C26S7 | submission-created: rejected reason=honeypot; lead.js: {ok:false, reason:honeypot}; no API call. |
| 3.1 phone verification completed with 123456: person Verified, note on the lead | pass | ref NE2E-0018, kind lead, id lead-77, person 76, pipeline Leads inbox, note 78, email em_79, verification VE80, verifyNote 81 | /contact?about=private-office opened on "who"; wrong code refused, 123456 approved; person 76 Verification Status 982 (Verified); note 81 "Phone verified" on lead lead-77. |
| 3.2 phone verification skipped: the Academy enquiry arrives Not Verified | pass | ref NE2E-0019, kind deal, id 84, person 83, pipeline 2/7, org 82, note 85, email em_86 | code sent then skipped; person 83 Verification Status 983 (Not Verified); deal 84 arrived with one note; booking shows the tbc text for both offices (mobile). |
| 4.1 booking buttons carry name, email and division (config override), journey from the division page | pass | ref NE2E-0020, kind lead, id lead-89, person 88, pipeline Leads inbox, note 90, email em_91 | division page card, then who > timing > you; Dubai: https://booking.example.test/dubai?name=E2E%20Booker&email=e2e.booker%40example.com&a1=Imperial%20Citizenship ; Lagos: https://booking.example.test/lagos?office=lagos&name=E2E%20Booker&email=e2e.booker%40example.com&a1=Imperial%20Citizenship (no phone given, so no verification step; lead lead-89, ref NE2E-0020); the guide link is offered. |
| 4.2 booking shows the tbc text while config.booking is empty | pass | ref NE2E-0021, kind deal, id 93, person 92, pipeline 26/163, note 94, email em_95 | success screen: "Dubai: To confirm: Dubai booking page (Microsoft Bookings or Calendly)" and "Lagos: To confirm: Lagos booking page (Microsoft Bookings or Calendly)"; the Contact page side column also carries 2 booking placeholders; the Group wording "Thank you, E2E. Your message has been received by the Group. One perso...". |
| 5.1 primary POST fails: the fallback endpoint receives the lead, the direct received wording with the reference | pass | ref WMVAP8GYKDW, kind lead, id lead-97, person 96, pipeline Leads inbox, note 98, email em_99 | POST / 500, then POST /.netlify/functions/lead {ok:true, ref:WMVAP8GYKDW}; lead lead-97 created with the note marked "Direct submission (fallback endpoint)"; the page says "Received, and with Imperial Citizenship." with the reference (mobile). |
| 5.2 both fail: fallback message with both telephones and the email, draft with the path survives a reload | pass | none | message: "We could not send this just now. Please call or email us and we will take it from there. What you typed is kept on this device, so you can a..."; focus moved to the form-err; after reload the draft note shows, the Partners path reopens on the closing screen with the introduce option, name, email, phone, firm, profession, timeline and message back; consent is asked again. |
| 6.1 guide form: lead_source guide reaches the backend | pass | ref NE2E-0022, kind lead, id lead-101, person 100, pipeline Leads inbox, note 102, email em_103 | form guide, lead_source guide, lead lead-101 "(guide)" for Imperial Citizenship, score exploring, email "Your guide request"; the page says the guide is being finalised and shows the tbc placeholder (config.guide.file is empty). |
| 6.2 programme fit check hands over to the journey: lead_source programme-fit and quiz_answers reach the backend | pass | ref NE2E-0023, kind lead, id lead-105, person 104, pipeline Leads inbox, note 106, email em_107 | five answers became the journey draft; /contact?about=citizenship&via=fit opened on the closing screen with about, audience, for_whom, country, timeline, budget, lead_source and quiz_answers set; lead lead-105 "(programme fit)", score hot (8 points), note carries "Programme fit answers: {"who":"family","where":"nigeria","matters":"live","timeline":"3m","budget":"500k-1m"}" and the Journey line with Entry fit (mobile). |
| 7.1 journey: the Send button shows the loading state while the enquiry is sent | pass | ref NE2E-0024, kind lead, id lead-109, person 108, pipeline Leads inbox, note 110, email em_111 | while the POST was in flight: Send {"loading":true,"disabled":true,"busy":"true"}, hidden first screen Continue {"loading":false,"disabled":false,"busy":null}, the closing screen stays (you); the enquiry itself arrived (lead lead-109). |
| 7.2 old #/ links and the .html copies land on their page, not on the home markup the server sent | pass | none | /#/contact -> /contact "Start a relationship · Imperial Holdings Group"; /#/about -> /about "About · Imperial Holdings Group"; /#/divisions/citizenship -> /divisions/citizenship "Imperial Citizenship · Imperial Holdings Group"; /#/contact?about=academy -> /contact?about=academy "Start a relationship · Imperial Holdings Group"; /about.html -> /about.html "About · Imperial Holdings Group"; /divisions/citizenship.html -> /divisions/citizenship.html "Imperial Citizenship · Imperial Holdings Group" |
| 7.3 a visitor from a search engine is recorded as organic, not as a referral | pass | ref NE2E-0025, kind lead, id lead-113, person 112, pipeline Leads inbox, note 114, email em_115 | referrer https://www.google.com/ -> source google.com, medium organic (a partner.example.net referrer stays referral); the note on lead lead-113 carries source: google.com and medium: organic, score hot (9 points, organic +1). |
| 7.4 code accepted but not yet recorded in Pipedrive: softer wording, the step still finishes, no second check | pass | ref NE2E-0026, kind lead, id lead-117, person 116, pipeline Leads inbox, note 118, email em_119 | journey from the division page; check answered {verified:true, recorded:false}: the page says "Code accepted. Thank you. We will note it on your enquiry shortly.", moves on to booking, sends phone_verified with recorded:false and never re-checks; person 116 stays Not Verified until the team marks it. |
| 7.5 WhatsApp cannot deliver the code: the page tries SMS itself | pass | ref NE2E-0027, kind lead, id lead-122, person 121, pipeline Leads inbox, note 123, email em_124 | journey from the division page; whatsapp start refused (reason provider), sms start sent (Twilio Channel sms), 123456 approved; person 121 Verified (982). |
| 7.6 a number without its country code: the person is told and the enquiry continues unverified | pass | ref NE2E-0028, kind deal, id 129, person 128, pipeline 2/7, org 127, note 130, email em_131 | journey from the division page; verify.js answered {ok:false, enabled:true, reason:phone} (no Twilio call); the page says "We could not send a verification code: the number needs its country code (for example +971 or +234). We will continue without it." and shows booking; deal 129 arrived Not Verified (mobile). |
| 7.7 programme fit answers survive a wander round the site: the journey draft keeps lead_source and quiz_answers | pass | ref NE2E-0029, kind lead, id lead-133, person 132, pipeline Leads inbox, note 134, email em_135 | after About and back: lead_source programme-fit, quiz_answers, the division and the typed name and email restored under ihg-draft-contact with the draft note; the lead lead-133 arrived as "(programme fit)" with the answers in the note. The consent box privacy link opens in a new tab. |
| 7.8 a stalled primary post is abandoned after 15 s and the fallback endpoint takes the lead | pass | ref WMVAP97SEG2, kind lead, id lead-137, person 136, pipeline Leads inbox, note 138, email em_139 | POST / held for 19 s (never run): the page abandoned it after 15 s (15477 ms to the success state), posted to lead.js and got lead lead-137 (ref WMVAP97SEG2); the page says "Received, and with Imperial Private Office.". |
| 8.1 the chooser: each path produces the right audience and record | pass | none | clients: lead lead-141 in Leads inbox, Contact Type 230 (need > who > timing > you); partners: deal 146 in 2/7, Contact Type 231, organisation 144 (how > practice > scope > you); institutions: deal 151 in 26/163, no Contact Type, organisation 149 (explore > organisation > you) |
| 8.2 switching path from Private Clients ("A client I am introducing") keeps name and email and clears the clients answers | pass | ref NE2E-0033, kind deal, id 156, person 155, pipeline 2/7, org 154, note 157, email em_158 | clients path to the closing screen, back to "Who is this for", "A client I am introducing", Switch: the Partners path opens with name and email kept and the country and timeline cleared; journey_switched sent; one deal 156 in the Introducer Pipeline with Request Type Referral, no clients lead. |
| 8.3 the received wording differs by route: "Received by Imperial" after Netlify Forms, "Received, and with" and the reference after the direct endpoint | pass | ref WMVAP9HJJGW | Forms: "Received by Imperial. Thank you, E2E. Your message has been received and is being passed to Imperial Citizenship. One person will reply personally."; direct: "Received, and with Imperial Citizenship. Thank you, E2E. Reference WMVAP9HJJGW. One person at Imperial Citizenship will be your point of contact and will reply personally."; no person named in either. |
| 8.4 the preview build (data-preview): the chip shows, Send posts nothing, the confirmation is labelled | pass | none | chip "Preview build: nothing is sent from this preview"; on Send the received state under "Preview of the confirmation. Nothing was sent.", title "Received by Imperial.", no announcement, no verification, no request of any kind. |
| 8.5 the entry point: a journey opened from the division hero carries via=division-hero into the note | pass | ref NE2E-0035, kind lead, id lead-168, person 167, pipeline Leads inbox, note 169, email em_170 | division hero link to http://127.0.0.1:8918/contact?about=citizenship&via=division-hero; note line "Journey: Private Clients · Entry: division-hero"; journey_started, journey_step and enquiry_submitted carry the journey and the entry. |
| 8.6 prefill from each division page: four skip the first screen, Partners Club lands on it | pass | none | citizenship -> who; private-office -> who; real-estate -> who; academy -> practice; partners-club -> how |
| 8.7 optional fields: a clients journey without nationality, budget or message arrives with "not given" and the right score | pass | ref NE2E-0036, kind lead, id lead-172, person 171, pipeline Leads inbox, note 173, email em_174 | nationality, budget and message left empty: lead lead-172, score hot (6 points), note "Timeline: Within 3 months · Budget: not given", no nationality line. |

## 3. The six divisions through the paths

Inputs: the landing URL `/contact?utm_source=google&utm_medium=organic&utm_campaign=e2e-<division>-<viewport>&utm_content=harness&utm_term=acceptance`,
the chooser card of the path, then what that path asks (docs/RELATIONSHIP-JOURNEY.md 2.2 to 2.4): for Private Clients
the division, who it is for, country, nationality (citizenship and Private Office only), timeline, budget (citizenship
and Real Estate only), buy or rent and area (Real Estate only); for Professional Partners the option (introduce a client
or train a team), profession, firm, country, interests and timeline; then name, email, a phone with country code, reply
by Either, a message and consent. Expected score from `shared/lead-schema.json`: timeline 3m 4, 3 to 12 months 2,
exploring 0; budget over US$1m 3, US$500k to 1m 2, US$250k to 500k 1; a single division 1, group 0; organic 1, a
partner introducing a client counts as referral 2. Hot from 6, warm from 3; "exploring" is capped at warm and needs 5.
Private Office and the Group score lower than in the v5 run because the journey no longer asks them for a budget.

| Division (path) | Record | Pipeline and stage | Owner | Timeline, budget | Score | Division field | Contact Type | Desktop ids (person, record, note, email) | Mobile ids |
|---|---|---|---|---|---|---|---|---|---|
| citizenship (Private Clients) | lead | Leads inbox | account default (0, TO CONFIRM) | 3m, over-1m | hot, 9 | 1128 | 230 client | 1, lead-2, 3, em_4 | 33, lead-34, 35, em_36 |
| private-office (Private Clients) | lead | Leads inbox | account default (0, TO CONFIRM) | 3-12m, not asked | warm, 4 | 1130 | 230 client | 6, lead-7, 8, em_9 | 38, lead-39, 40, em_41 |
| partners-club (Professional Partners, introduce a client) | deal | 2 / 7 Introducer IN | account default (0, TO CONFIRM) | 3m, not asked, for a client | hot, 7 | none (title and note) | 231 partner, Request Type Referral 1126 | 12, deal 13, 14, em_15 (org 11) | 43, deal 44, 45, em_46 (org 11) |
| academy (Professional Partners, train my team) | deal | 2 / 7 Introducer IN | account default (0, TO CONFIRM) | exploring, not asked | exploring, 2 | none (title and note) | 231 partner | 18, deal 19, 20, em_21 (org 17) | 48, deal 49, 50, em_51 (org 17) |
| real-estate (Private Clients) | lead | Leads inbox | account default (0, TO CONFIRM) | 3-12m, 500k-1m, buy, Dubai Marina | hot, 6 | 1129 | 230 client | 23, lead-24, 25, em_26 | 53, lead-54, 55, em_56 |
| group (Private Clients, something broader) | deal | 26 / 163 New Request | account default (0, TO CONFIRM) | exploring, not asked | exploring, 1 | 1131 Multiple | 230 client | 28, deal 29, 30, em_31 | 58, deal 59, 60, em_61 |

The Institutions path (Group, no Contact Type, the organisation created and linked, the Organisation line and the
interests in the note) is case 8.1. Every note carried the new line `Journey: <path> · Entry: <via or not given>`, the
thirteen tracking lines with the values the page captured, the Netlify submission id, "Verification: Not Verified
(code not entered yet)" and the score reasons. Owner: every division has `owner: 0` in `shared/lead-routing.json` (TO
CONFIRM), so no `owner_id` or `user_id` is sent; the harness asserts the absence. Lead labels: the Leads inbox label
the account serves (`GET /leadLabels`, UUID ids) is sent in a single POST; deals take the deal label ids.

## 4. What the person sees

* The chooser (8.1, 1.x): three path cards; a link that names a path or a division opens the path with the chooser
  folded into a quiet "Path: ... Change" line, and a division link skips the first screen where it names exactly one
  option (8.6: Citizenship, Private Office, Real Estate and Academy; Partners Club lands on the first screen because
  two options route there).
* Switching path (8.2): "A client I am introducing" on Private Clients offers the Professional Partners path; taking
  it keeps the name, email, phone, reply channel and message and clears the other path's answers.
* Received (8.3): after a Netlify Forms acceptance "Received by Imperial." and "Your message has been received and is
  being passed to <division>. One person will reply personally."; after the direct endpoint confirmed the record
  "Received, and with <division>." with "Reference W...". The Group and Institutions say "the Group" (4.2, 8.1). No
  person is named and no reply time is printed. The announcement is "Received.".
* Preview build (8.4): an amber chip "Preview build: nothing is sent from this preview" on the form; Send shows the
  Forms wording under "Preview of the confirmation. Nothing was sent.", with no announcement, no verification step and
  no request of any kind.
* Disposable email (2.1): the closing screen does not send. The email field is marked with "Please use an email
  address you check regularly." (the page reads the same `shared/disposable-domains.json` the function uses), so the
  address never reaches Netlify Forms, where the function would drop it silently (it still does, as 2.1 proves by
  posting directly).
* Disposable email when the page could not load the list (2.2): the fallback endpoint refuses it and the page shows
  "Please use an email address you check regularly. Nothing has been sent yet.", keeps the closing screen with the
  field marked and focused, and releases the Send button. Any other `ok:false` reason shows the office contacts.
* Honeypot filled (2.3): no request leaves the page. The Send button is released and the office contacts message is
  shown, so a person whose browser autofilled the hidden field can still reach us; a bot gets no other signal.
* Both failing (5.2): "We could not send this just now." with both telephone numbers and the email, focus on it for
  screen readers, and the draft restored on the next visit, path included, with "We kept what you started earlier"
  and "Start afresh"; the journey reopens on the first screen that still needs an answer.
* Programme fit (6.2, 7.7): the five answers become the journey's draft and "Continue to your message" opens
  `/contact?about=citizenship&via=fit` on the closing screen, with "From the programme fit check" and the answers shown.

## 5. Issues found

v6 (this run): none open in the journey. The suite found two harness matters while it was rewritten, both in the
harness, not the site: the Partners scope screen renders its three variants and hides two, so the harness acts only on
what is on show; and the prerendered `/contact` of a normal build carries no preview chip, so 8.4 reaches the page by a
link (section 1 item 6). The earlier rounds' findings follow for the record.

Fixed in this round, in `assets/js/app.js` (each with a case above that fails without the fix):

1. **Contact form: the loading state went to the wrong button** (`finish()` in `bindForms` picked the first submit
   button, the hidden step 1 Continue). The control that sends is now `[data-send]`, or the form's last submit button
   on the one step forms. Case 7.1.
2. **Disposable email: the person was not told.** The page now checks the address against
   `shared/disposable-domains.json` (fetched once, when the field is validated) and shows "Please use an email address
   you check regularly." on the field before anything is sent; when the fallback endpoint answers `reason:'disposable'`
   or `'email'`, the same message is shown with "Nothing has been sent yet." and the step with the field is shown
   again. Cases 2.1 and 2.2.
3. **Honeypot path left the form in limbo.** The branch now releases the button and shows the office contacts.
   Case 2.3.

Still open, for the owners of the files named:

4. **Low. Stale comment in `netlify.toml`** (lines 16 to 18): it lists `PIPEDRIVE_OWNER_CLIENTS`,
   `PIPEDRIVE_OWNER_PARTNERS`, `PIPEDRIVE_OWNER_INSTITUTIONS`, `PIPEDRIVE_PIPELINE_*` and `PIPEDRIVE_STAGE_*` as
   optional environment variables; nothing reads them. Owners, pipelines and stages live in `shared/lead-routing.json`
   and the real variables are in `docs/LEADS.md` section 6. Fixed in the fix round: the comment now lists the
   variables from section 6 and points at the routing file for owners, pipelines and stages.
5. **Low. No `test:a11y` script.** The build contract and the task brief mention it among the local tools; `package.json`
   has `check`, `smoke`, `test:functions`, `test:seo`, `build` and now `test:e2e`. Nothing to run for accessibility. Since resolved: `npm run test:a11y` (`tests/a11y.js`) exists and passes in the v6 checks.
6. **Info.** `lead.js` answers `{ok, ref, kind}` without the record id, by design (the page shows the reference only).
   The harness takes the id from the mock's response in 5.1.

## 6. Decisions needed before launch (page and media)

1. **Home page hero.** Production shows the fallback `assets/img/hero-lights.webp` (1600 by 977, 21 KB, with a
   720 by 960 mobile crop), a crop of the gala dinner stage lights in Lagos with nobody in frame and no sister-brand
   crest, behind its own scrim so the headline and lead read as in v4 (the earlier `hero-alt` crop, which showed the
   Imperial Citizenship crest through the headline, is gone). The photographs meant for the hero still have no
   recorded consent, so the choice is the Founder's: (a) keep this backdrop as the interim hero (marked "Final hero
   photo" with the amber chip), or (b) record `consent: true` on `events/lagos-office-event/cover` (the photos entry
   `hero`) in `assets/js/data.js` so the intended hero shows in production, or (c) wait for the shoot. The comment
   above `hero` in `assets/js/data.js` records the same choice; `docs/PHOTO-SHOT-LIST.md` describes the photograph
   the hero is waiting for.
2. **Hero export sizes.** The 1600 pixel fallback fills a 1920 by 1080 viewport at 1.2 times. When the final hero is
   chosen, export it at 1920 and 2560 pixels wide for desktop and 1080 for mobile, with `srcset` and `sizes`, each
   under 200 KB, and keep the preload lines on the 1920 and 1080 files. Nothing larger can be made from the 1400
   pixel source without upscaling, so this waits for decision 1.

## 7. What this run cannot prove

* Real Pipedrive ids, field keys and option ids being accepted by the live account; the live run in `docs/LEADS.md`
  section 8 covers that and records the real lead and deal ids.
* The owner mapping: all six owners are `0` (TO CONFIRM) until the Pipedrive user list is read.
* Lead labels on the live Leads API (the mock rejects deal label ids, as documented; the retry path works).
* Netlify Forms accepting every field: that depends on the hidden static forms in `index.html` listing them, which the
  build contract requires; the harness accepts whatever the page posts.
* Twilio and Resend delivery, Turnstile (off in this run), and the rate limit across function instances.

## 8. Re-running

```
npm run test:e2e              # build, serve on 8791, run everything
npm run test:e2e -- --no-build --only 3.1
E2E_PORT=8792 npm run test:e2e
node tests/e2e-leads.js --port 8918   # the port this run used
```

Outputs: `tests/e2e-output/results.json` (every case with its assertions, mocked calls, function log lines and page
errors), `tests/e2e-output/mock-log.json` (all 276 mocked API calls of this run) and `tests/e2e-output/summary.md`.
Exit code 1 while any case fails.

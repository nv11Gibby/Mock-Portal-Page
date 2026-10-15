# Acceptance tests: the lead flow (brief section 9, items 1 to 4)

Run on 15 October 2026 at 15:21 UTC with `npm run test:e2e` (`tests/e2e-leads.js`) on branch `verify/e2e`, from the
prerendered build in `dist/`, on desktop (1440 by 900) and mobile (390 by 844, touch) Chromium through Playwright.

**These are offline simulations.** The live Pipedrive token is not available in this environment, so every call to
Pipedrive, Twilio Verify and Resend went to the in-memory stand-ins in `tests/functions/_mock.js`, and the ids in the
tables below are mock ids (persons and deals count up from 1, leads are `lead-N`, emails `em_N`, verifications `VE N`).
Nothing was sent to a live service. **The real Pipedrive lead and deal ids come from the live run a person performs
with approval, described in `docs/LEADS.md` section 8.** What this run does prove is that the pages, the two
submission paths, the real function code (`submission-created.js`, `lead.js`, `verify.js` and `lib/`), the routing
config and the schema behave together as the brief asks, with the responses a real API would give.

Result: **25 of 26 cases pass.** The one failure (7.1) is a defect in the contact form's loading state; it does not
stop any enquiry from arriving. Issues are listed in section 5.

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
   mock serves from `GET /leadLabels` (Hot Lead, Warm lead, Cold Lead), as the real one does; Twilio start always
   succeeds and check approves `123456` only; Resend
   returns an id. Every call is written to `tests/e2e-output/mock-log.json` with the test that caused it, the method,
   path, query (token removed), body, status and response. `results.json` and `summary.md` sit next to it. The
   directory is ignored by git.
5. The rate limit buckets are reset before each case, so the per IP limit (5 per 10 minutes) does not interfere with
   the 30 submissions one address makes in 40 seconds.

Options: `--no-build` reuses `dist/`, `--port 8792` or `E2E_PORT` moves the server, `--only 3.1` runs one case,
`--headed` shows the browser. Playwright is found through `require('playwright')` or the global npm root.

## 2. Results

| Test | Result | Mock ids | What was checked |
|---|---|---|---|
| 1.1 contact citizenship (desktop) | pass | ref NE2E-0001, person 1, lead lead-2, note 3, email em_4 | kind lead (Leads inbox), no owner (config 0), [HOT] title, label 787 on the first POST (rejected by the Leads API, retried without), Division 1128, Contact Type 230, Source Platform 799, expected close +90 days, person Not Verified (983), phone in E.164, note with the score line and all 13 tracking fields, confirmation email |
| 1.2 contact private-office (desktop) | pass | ref NE2E-0002, person 6, lead lead-7, note 8, email em_9 | as 1.1 with [WARM] 788, Division 1130, expected close +365 days |
| 1.3 contact partners-club (desktop) | pass | ref NE2E-0003, person 12, org 11, deal 13, note 14, email em_15 | kind deal, pipeline 2 stage 7 (Introducer Pipeline, Introducer IN), label [787], no Division option, Contact Type 231, Request Type Referral 1126 (a partner introducing a client), organisation created and linked |
| 1.4 contact academy (desktop) | pass | ref NE2E-0004, person 17, deal 18, note 19, email em_20 | kind deal, pipeline 2 stage 7, label [827], no prefix, Contact Type 231 |
| 1.5 contact real-estate (desktop) | pass | ref NE2E-0005, person 22, lead lead-23, note 24, email em_25 | kind lead, [HOT], Division 1129, Contact Type 230, property intent and area in the note |
| 1.6 contact group (desktop) | pass | ref NE2E-0006, person 27, deal 28, note 29, email em_30 | kind deal, pipeline 26 stage 163 (Opportunity Requests, New Request), label [827], Division 1131 (Multiple), no Contact Type (institutions) |
| 1.7 contact citizenship (mobile) | pass | ref NE2E-0007, person 32, lead lead-33, note 34, email em_35 | as 1.1 on mobile |
| 1.8 contact private-office (mobile) | pass | ref NE2E-0008, person 37, lead lead-38, note 39, email em_40 | as 1.2 on mobile |
| 1.9 contact partners-club (mobile) | pass | ref NE2E-0009, person 42, org 11 (found, reused), deal 43, note 44, email em_45 | as 1.3 on mobile |
| 1.10 contact academy (mobile) | pass | ref NE2E-0010, person 47, deal 48, note 49, email em_50 | as 1.4 on mobile |
| 1.11 contact real-estate (mobile) | pass | ref NE2E-0011, person 52, lead lead-53, note 54, email em_55 | as 1.5 on mobile |
| 1.12 contact group (mobile) | pass | ref NE2E-0012, person 57, deal 58, note 59, email em_60 | as 1.6 on mobile |
| 1.13 returning person (dedupe) | pass | refs NE2E-0013 to 0015, person 62, lead lead-63, notes 64, 67, 71, activities 68, 72 | three enquiries: the second with the same email and the third with a new email and the same phone found the person, reused the open citizenship lead, added a note and a "Website enquiry follow up" activity (type call___scheduled, due today) each time; one person, one lead, the person holds both emails |
| 2.1 disposable email, Netlify Forms path | pass | ref NE2E-0016, submission e2e-0016 | `someone@mailinator.com`: the function rejects with `reason=disposable`; no Pipedrive call, no email. The person sees the success state (see section 4) |
| 2.2 disposable email, fallback path | pass | ref WMV9OTB06WL | with the primary post failing, `lead.js` answers `{ok:false, reason:'disposable'}`; nothing in Pipedrive; the page shows the fallback message |
| 2.3 honeypot filled in the page | pass | none | `company_url` set before Send: no request leaves the page at all; the person sees no change (see 7.1) |
| 2.4 honeypot filled, posted to both endpoints | pass | refs NE2E-0017, WMV9OTD3JNB | `submission-created` rejects with `reason=honeypot`; `lead.js` answers `{ok:false, reason:'honeypot'}`; no API call |
| 3.1 phone verification completed (123456) | pass | ref NE2E-0018, person 75, lead lead-76, note 77, email em_78, verification VE79, note 80 | enquiry card on the Private Office page, phone given: a code goes by WhatsApp (Twilio start), a wrong code is refused with "That code did not match", 123456 is approved; PUT person Verification Status 982 (Verified); note 80 "Phone verified ... by WhatsApp code" on the lead; the booking block follows |
| 3.2 phone verification skipped | pass | ref NE2E-0019, person 81, deal 82, note 83, email em_84 | enquiry card on the Academy page (mobile): code sent, "Skip for now" clicked; no check call; the person stays 983 (Not Verified); the deal arrived with its one note; booking shows the tbc text |
| 4.1 booking links carry name, email and division | pass | ref NE2E-0020, person 86, lead lead-87, note 88, email em_89 | `IHG.config.booking` overridden before Send: Dubai `https://booking.example.test/dubai?name=E2E%20Booker&email=e2e.booker%40example.com&a1=citizenship`, Lagos `https://booking.example.test/lagos?office=lagos&name=...&email=...&a1=citizenship` (its own query kept); `data-division` set on both |
| 4.2 booking tbc text while config is empty | pass | ref NE2E-0021, person 90, deal 91, note 92, email em_93 | with the shipped config: no links, two placeholders "Dubai booking page (Microsoft Bookings or Calendly)" and "Lagos booking page (Microsoft Bookings or Calendly)" on the success screen, and the same two in the Contact side column |
| 5.1 primary POST fails | pass | ref WMV9OTHR7ZM, person 94, lead lead-95, note 96, email em_97 | `POST /` answers 500; the page posts JSON to `/.netlify/functions/lead`, which answers `{ok:true, ref:'W...'}`; the lead is created with the note marked "Direct submission (fallback endpoint)" and "Ref W..."; the person sees the success state (mobile) |
| 5.2 both fail | pass | none | both answer 500: the form shows "We could not send this just now..." with +971 4 546 1110, +234 902 222 2024 and info@imperialholdingsgroup.com and moves focus to it; nothing reached any API; `ihg-draft-contact` is stored; after a reload the note "We kept what you started earlier" shows and the choice, name, email, phone, firm, timeline and message are back (consent is asked again) |
| 6.1 guide form | pass | ref NE2E-0022, person 98, lead lead-99, note 100, email em_101 | form `guide`, `lead_source=guide`, division citizenship: lead "Website: E2E Guide · Imperial Citizenship (guide)", score exploring, note "Lead source: guide", email "Your guide request"; the page says the guide is being finalised and shows the "Guide PDF to be written and approved" placeholder; no verification step (no phone) |
| 6.2 programme fit check | pass | ref NE2E-0023, person 102, lead lead-103, note 104, email em_105 | five answers (family, nigeria, live, 3m, 500k-1m) prefill the enquiry card: division, audience clients, for_whom family, country Nigeria, timeline, budget, `lead_source=programme-fit`, `quiz_answers` JSON; after Send the lead is "... (programme fit)", [HOT] (8 points), the note carries "Programme fit answers: {...}" and "Nationality: Nigerian (no matching Pipedrive option, kept as text)", Service Requested mentions the fit check (mobile) |
| 7.1 Send button loading state (contact form) | **FAIL** | ref NE2E-0024, person 106, lead lead-107, note 108, email em_109 | while the post is in flight the Send button is not marked loading or disabled; the hidden step 1 Continue button is. The enquiry itself arrives. See issue 1 |

## 3. The six choices in detail

Inputs: a phone with country code, country, nationality, who the enquiry is for, a timeline, a budget band, firm and
profession for Partners Club, buy or rent and an area for Real Estate, a message, consent, and the landing URL
`/contact?utm_source=google&utm_medium=organic&utm_campaign=e2e-<choice>-<viewport>&utm_content=harness&utm_term=acceptance`.
Expected score from `shared/lead-schema.json`: timeline 3m 4, 3 to 12 months 2, exploring 0; budget over US$1m 3,
US$500k to 1m 2, US$250k to 500k 1, under or undisclosed 0; a single division 1, group 0; organic source 1, a partner
introducing a client counts as referral 2. Hot from 6, warm from 3; "exploring" is capped at warm and needs 5.

| Choice | Record | Pipeline and stage | Owner | Timeline, budget | Score | Label, prefix | Division field | Contact Type | Desktop ids (person, record, note, email) | Mobile ids |
|---|---|---|---|---|---|---|---|---|---|---|
| citizenship | lead | Leads inbox | account default (0, TO CONFIRM) | 3m, over-1m | hot, 9 | 787, [HOT] | 1128 | 230 client | 1, lead-2, 3, em_4 | 32, lead-33, 34, em_35 |
| private-office | lead | Leads inbox | account default (0, TO CONFIRM) | 3-12m, 250k-500k | warm, 5 | 788, [WARM] | 1130 | 230 client | 6, lead-7, 8, em_9 | 37, lead-38, 39, em_40 |
| partners-club | deal | 2 / 7 Introducer IN | account default (0, TO CONFIRM) | 3m, undisclosed, for a client | hot, 7 | 787, [HOT] | none (title and note) | 231 partner | 12, deal 13, 14, em_15 (org 11) | 42, deal 43, 44, em_45 (org 11) |
| academy | deal | 2 / 7 Introducer IN | account default (0, TO CONFIRM) | exploring, undisclosed | exploring, 2 | 827, no prefix | none (title and note) | 231 partner | 17, deal 18, 19, em_20 | 47, deal 48, 49, em_50 |
| real-estate | lead | Leads inbox | account default (0, TO CONFIRM) | 3-12m, 500k-1m, buy, Dubai Marina | hot, 6 | 787, [HOT] | 1129 | 230 client | 22, lead-23, 24, em_25 | 52, lead-53, 54, em_55 |
| group | deal | 26 / 163 New Request | account default (0, TO CONFIRM) | exploring, over-1m | exploring, 4 (capped) | 827, no prefix | 1131 Multiple | none (institutions) | 27, deal 28, 29, em_30 | 57, deal 58, 59, em_60 |

Every note carried the thirteen tracking lines with the values the page captured (`source: google`, `medium: organic`,
`campaign: e2e-...`, the five `utm_*`, empty `gclid` and `fbclid`, `landing` and `page` as the full contact URL,
`referrer` empty), the Netlify submission id, "Verification: Not Verified (code not entered yet)" and the score reasons.
Owner: every division has `owner: 0` in `shared/lead-routing.json` (TO CONFIRM), so no `owner_id` or `user_id` is sent
and Pipedrive will assign the token's user; the harness asserts the absence. Lead labels: since the fix round the core
reads the account's Leads inbox labels (`GET /leadLabels`, UUID ids) and sends the one whose name starts with Hot, Warm
or Cold in a single POST to `/leads`; the numeric deal label ids are never sent to the Leads API, and the score stays
in the title prefix and the note. Deals take the deal label ids. The result rows above were recorded before that
change (two POSTs per lead); a rerun of the harness refreshes them.

## 4. What the person sees

* Disposable email through Netlify Forms (2.1): the thank you screen ("Thank you, E2E. Your enquiry is with Imperial
  Citizenship. One person will be your point of contact...") because Netlify accepts the post before the function
  runs and the function always answers 200. The lead is rejected server side and nothing reaches Pipedrive; the
  submission stays in the Netlify Forms inbox only. The person is not told the address is the problem (issue 2).
* Disposable email through the fallback (2.2): the generic fallback message "We could not send this just now. Please
  call or email us..." with the office numbers, because `lead.js` answers `ok:false` and the page treats every
  `ok:false` the same way (issue 2).
* Honeypot filled (2.3): nothing. No request leaves the page, no message appears, the Send button does not change
  (issue 1 and 3). A bot gets no signal, which is the point; a person whose browser autofilled the hidden field would
  be left wondering.
* Primary post failing (5.1): the normal thank you screen; the fallback endpoint is invisible to the person.
* Both failing (5.2): the red bordered message with both telephone numbers and the email, focus on it for screen
  readers, and the draft restored on the next visit with "We kept what you started earlier" and "Start afresh".

## 5. Issues found (not fixed here; reported for the owners of the files)

1. **Medium. Contact form: the loading state goes to the wrong button.** `assets/js/app.js` line 1343, `finish()` in
   `bindForms`: `form.querySelector('[data-send], button[type=submit]')` returns the first match in document order,
   which on the three step contact form is the step 1 "Continue" button (hidden at that moment), not the Send button.
   So Send never shows the spinner, is never disabled while the post is in flight (a double click can send the enquiry
   twice, which the dedupe then turns into a second note and activity), `aria-busy` lands on the wrong element, and on
   failure the `loading` class is removed from the wrong button. The enquiry card and the guide form are not affected
   (one submit button). Test 7.1 fails on this. A fix would be `form.querySelector('[data-send]') ||
   form.querySelector('button[type=submit]')`.
2. **Medium. Disposable email: the person is not told.** There is no front end check against
   `shared/disposable-domains.json`, so through Netlify Forms a disposable address gets the thank you screen while the
   backend drops the lead (2.1), and through the fallback the person gets the generic "we could not send this" message
   (2.2), which invites a retry that will fail again. The brief (3.3) asks to block disposable domains; the block
   works, the message does not. Suggested: check the domain in `valid()` (`assets/js/app.js`) with the same list and
   show "Please use a permanent email address" on the field, and in the `submitLead` error branch (line 1362) show a
   specific message when the reason is `disposable` or `email`.
3. **Low. Honeypot path leaves the form in limbo.** `assets/js/app.js` line 1345: `finish()` returns after marking a
   button busy, with no reset. With issue 1 fixed, the Send button would then stay disabled and spinning for a person
   whose browser filled `company_url`. Either reset the button state on that branch or let the post go and let the
   function reject it (`reason=honeypot`, which 2.4 proves).
4. **Low. Stale comment in `netlify.toml`** (lines 16 to 18): it lists `PIPEDRIVE_OWNER_CLIENTS`,
   `PIPEDRIVE_OWNER_PARTNERS`, `PIPEDRIVE_OWNER_INSTITUTIONS`, `PIPEDRIVE_PIPELINE_*` and `PIPEDRIVE_STAGE_*` as
   optional environment variables; nothing reads them. Owners, pipelines and stages live in `shared/lead-routing.json`
   and the real variables are in `docs/LEADS.md` section 6.
5. **Low. No `test:a11y` script.** The build contract and the task brief mention it among the local tools; `package.json`
   has `check`, `smoke`, `test:functions`, `test:seo`, `build` and now `test:e2e`. Nothing to run for accessibility.
6. **Info.** `lead.js` answers `{ok, ref, kind}` without the record id, by design (the page shows the reference only).
   The harness takes the id from the mock's response in 5.1.

## 6. What this run cannot prove

* Real Pipedrive ids, field keys and option ids being accepted by the live account; the live run in `docs/LEADS.md`
  section 8 covers that and records the real lead and deal ids.
* The owner mapping: all six owners are `0` (TO CONFIRM) until the Pipedrive user list is read.
* Lead labels on the live Leads API (the mock rejects deal label ids, as documented; the retry path works).
* Netlify Forms accepting every field: that depends on the hidden static forms in `index.html` listing them, which the
  build contract requires; the harness accepts whatever the page posts.
* Twilio and Resend delivery, Turnstile (off in this run), and the rate limit across function instances.

## 7. Re-running

```
npm run test:e2e              # build, serve on 8791, run everything
npm run test:e2e -- --no-build --only 3.1
E2E_PORT=8792 npm run test:e2e
```

Outputs: `tests/e2e-output/results.json` (every case with its assertions, mocked calls, function log lines and page
errors), `tests/e2e-output/mock-log.json` (all 176 mocked API calls of this run) and `tests/e2e-output/summary.md`.
Exit code 1 while any case fails.

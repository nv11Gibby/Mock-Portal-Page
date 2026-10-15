# Leads: from the website to Pipedrive

Every enquiry on the site (the enquiry card, the three step contact form, the Real Estate register interest form and
the citizenship guide form) ends up in Pipedrive as a lead or a deal, with an owner, a pipeline and stage, a score,
a note that carries every field and every tracking value, and a confirmation email to the person. This document
replaces the earlier PIPEDRIVE-SETUP.md and covers the whole backend: what the core does, the config files, every
environment variable, the offline tests, and the exact steps of the real end-to-end test.

## 1. How a lead travels

1. The page posts the form to Netlify Forms (urlencoded POST to `/` with `form-name`). Netlify stores the
   submission and runs `netlify/functions/submission-created.js`.
2. If that post fails, the page posts JSON `{form, data}` to `/.netlify/functions/lead` (`netlify/functions/lead.js`),
   which runs the same core and answers `{ok:true, ref}` or `{ok:false, reason}`.
3. Both entry points call `processLead()` in `netlify/functions/lib/core.js`:
   1. Spam gates: honeypot (`company_url`), rate limit per IP, email format, disposable domains, Cloudflare Turnstile.
   2. Site, division, audience and the lead score.
   3. Pipedrive: find the person by email, then by phone; create or update the person; for a returning person look
      for an open lead or deal of the same division; otherwise create a lead or a deal per
      `shared/lead-routing.json`; write the note; add an activity for a returning person.
   4. Confirmation email when the lead is stored and the email env is set.
4. After the success state the page may call `/.netlify/functions/verify` (`netlify/functions/verify.js`) to send a
   one-time code by WhatsApp or SMS and check it. A good code marks the person Verified in Pipedrive.

A failure anywhere in step 3 never loses a Netlify Forms submission: `submission-created` always answers 200 and the
submission stays in the Netlify Forms inbox. The direct endpoint has no such safety net, so it answers `ok:false`
and the page shows the office contacts and keeps the draft.

Files:

| Path | Role |
|---|---|
| `netlify/functions/submission-created.js` | Netlify Forms event entry point |
| `netlify/functions/lead.js` | Direct JSON fallback, same origin only |
| `netlify/functions/verify.js` | Phone verification (start, check) |
| `netlify/functions/lib/core.js` | The submission core: gates, scoring, Pipedrive sync, email, `markVerified()` |
| `netlify/functions/lib/config.js` | Loads the shared JSON files, reads the environment |
| `netlify/functions/lib/validate.js` | Field whitelist, email and disposable checks, phone normalisation |
| `netlify/functions/lib/score.js` | Lead score and source method |
| `netlify/functions/lib/pipedrive.js` | Pipedrive REST client (fetch, no SDK) and option matching |
| `netlify/functions/lib/ratelimit.js` | In-memory token bucket per IP |
| `netlify/functions/lib/turnstile.js` | Cloudflare Turnstile siteverify |
| `netlify/functions/lib/twilio.js` | Twilio Verify REST calls |
| `netlify/functions/lib/email.js` | Confirmation email through the Resend HTTPS API |
| `netlify/functions/lib/http.js` | JSON answers, body parsing, client IP, same-origin check |
| `shared/lead-schema.json` | The one lead schema every Imperial site posts |
| `shared/lead-routing.json` | Owner, kind, pipeline, stage, field keys and option ids per division |
| `shared/disposable-domains.json` | Disposable email providers |
| `tests/functions/*.test.js` | Offline tests with a mocked Pipedrive, Twilio, Turnstile and Resend |

## 2. The config files (change these, not the code)

### `shared/lead-routing.json`

`divisions` holds one entry per division key (`citizenship`, `private-office`, `partners-club`, `academy`,
`real-estate`, `group`):

| key | what it does |
|---|---|
| `name` | Division name used in titles, notes and the email |
| `owner` | Pipedrive user id of the one named point of contact. `0` means the account default owner (the user who owns the API token). TO CONFIRM for every division: the user list was not readable in the snapshot. |
| `kind` | `lead` (Leads inbox) or `deal` |
| `pipeline`, `stage` | For deals: pipeline id and first stage id |
| `audience` | Default audience when the form does not say: `clients`, `partners` or `institutions` |
| `divisionOption` | Key into `pipedrive.options.division` for the Division field, or `null` when the field has no option for that division |

Current routing (15 October 2026 snapshot):

| Division | Record | Where | Division field |
|---|---|---|---|
| Imperial Citizenship | lead | Leads inbox | Imperial Citizenship (1128) |
| Imperial Private Office | lead | Leads inbox | Private Office (1130) |
| Imperial Real Estate | lead | Leads inbox | Imperial Real Estate (1129) |
| Imperial Partners Club | deal | Introducer Pipeline [2026] (2), stage Introducer IN (7) | none (title and note) |
| Imperial Academy | deal | Introducer Pipeline [2026] (2), stage Introducer IN (7). TO CONFIRM: the Academy has no pipeline of its own; this follows the previous function. | none (title and note) |
| Imperial Holdings Group | deal | Opportunity Requests (26), stage New Request (163) | Multiple (1131) |

To find the user ids once the token exists (read-only call, safe to run):

```
curl -s "https://api.pipedrive.com/v1/users?api_token=$PIPEDRIVE_API_TOKEN" | python3 -c "import json,sys; [print(u['id'], u['name'], u['email']) for u in json.load(sys.stdin)['data']]"
```

Put each id in `owner`, commit, deploy. The audience from the form still sets the Contact Type (Client 230,
Partner/Introducer 231); the division decides owner, record kind, pipeline and stage.

`pipedrive` holds the field keys and option ids (deal fields: Source Method, Source Platform, Contact Type, Request
Type, Division, Urgency, Campaign Name, Service Requested, `label_ids`, `expected_close_date`; person fields:
Nationality, Country of Residence, Verification Status, WhatsApp Chat Link), the activity type and subject, and the
pipelines for reference. `personOptions` lists the labels of the Nationality and Country of Residence enums so free
text can be matched. `office` holds the contact details written into the confirmation email.

### `shared/lead-schema.json`

The authority for field names and allowed values. Every form field the page posts is listed under `fields`; the
core ignores anything else. `sites` lists the six Imperial sites with their default division: a site that reuses
this core sets only its `site` key (hidden field) and its default division. `forms` lists the four form names and
their defaults (`interest` defaults to Real Estate, `guide` to Citizenship with lead source `guide`). `tracking`
lists the thirteen tracking fields that go into every note. `score` holds the scoring weights (section 3).

### `shared/disposable-domains.json`

Well known throwaway email providers. Checked case-insensitively, including subdomains. Add a line to block another.

## 3. What is recorded

| Site field | Pipedrive |
|---|---|
| Audience | Contact Type: Client (230) or Partner/Introducer (231); institutions carry none |
| Division (the choice in the form) | Owner, lead or deal, pipeline and stage, Division field where an option exists |
| Timeline, budget, division fit, source | Lead score: Label Hot Lead (787), Warm Lead (788) or COLD LEAD (827); `[HOT]` or `[WARM]` title prefix; a Score line in the note |
| Timeline | Expected close date (3 months or 12 months ahead); Urgency Urgent for "within 3 months" or a message that says urgent |
| Source | Source Platform Website (799); Source Method Google Ads, Meta Ads, Tiktok Ads, Paid Ads, Referral or Organic from the UTM parameters, gclid and fbclid; Campaign Name from `utm_campaign` or `campaign` |
| Division, interest, property intent and area, firm and profession, who the enquiry is for | Service Requested (text) |
| A partner introducing a client (Partners Club, `for_whom = client`) | Request Type Referral (1126) |
| Firm | Organisation, found by name or created, linked to the person and the deal |
| Nationality, country of residence | Person fields when the text matches an option label (case-insensitive); otherwise the text stays in the note |
| Phone | Person phone, in E.164 when a country code was given; Verification Status Not Verified (983) at creation, Verified (982) after a successful code |
| Everything else, every tracking field, the message, the score reasons, the Netlify submission id or the direct reference | The note on the person and the lead or deal |

Lead labels: the Leads API has its own label set, so the deal label ids may be rejected on a lead. The core tries
`label_ids` first and, if the API rejects it, creates the lead without it. The title prefix and the note carry the
score either way, so nothing is lost. Deals accept the label ids.

### Score

Points from `shared/lead-schema.json`: timeline (within 3 months 4, 3 to 12 months 2, exploring 0), budget (over
US$1m 3, US$500k to 1m 2, US$250k to 500k 1, under or undisclosed 0), division fit (a single division 1, group 0),
source (referral or a partner introducing a client 2, organic 1, paid 0). Hot from 6 points, warm from 3. When the
timeline is "just exploring" or not given, the band is at most warm, and warm then needs 5 points. A guide request
with nothing else is therefore "exploring"; "within 3 months" for one division is hot even without a budget.

### Dedupe

The person is searched by email (exact) and then by phone (digits compared, trunk prefix dropped). A known person is
reused: a new email or phone is added, missing fields are filled, nothing is overwritten. The core then looks for an
open lead or deal of the same division (Division field or division name in the title). If one exists the note goes
on it; otherwise a new lead or deal is created. Either way a returning person gets an activity "Website enquiry
follow up" (type `call___scheduled`, the account's scheduled call type; it has no plain `call` type), due today,
assigned to the division owner.

## 4. Spam and verification

* Honeypot: a filled `company_url` is rejected before anything else (`reason: honeypot`).
* Email: format check, then `shared/disposable-domains.json` (`reason: email` or `disposable`). Nothing is sent to a
  rejected address.
* Turnstile: when `TURNSTILE_SECRET_KEY` is set, the `cf-turnstile-response` token is checked with Cloudflare; a
  missing or rejected token fails the submission (`reason: turnstile`). If Cloudflare cannot be reached the
  submission is allowed through and the outage is logged, so an outage never costs a real enquiry.
* Rate limit: 5 submissions per 10 minutes per IP (`reason: rate`), as a token bucket in the memory of the function
  instance. This is best effort on serverless: each instance keeps its own buckets, a cold start empties them, and
  parallel instances do not share them. It stops a casual flood; Turnstile and Netlify's own filter do the rest.
  `verify` start is limited the same way, and code checks to 10 per 10 minutes.
* Phone verification (`verify.js`): `{action:'start', phone, email, channel}` sends a code through Twilio Verify and
  answers `{ok:true, enabled:true, ref}`; without the Twilio env it answers `{ok:true, enabled:false}` and the page
  skips the step. `{action:'check', ref, phone, code, email}` answers `{ok:true, verified:true}` after a good code,
  sets Verification Status to Verified and adds a note on the person's newest open lead or deal; a wrong code answers
  `{ok:true, verified:false, reason:'code'}`, an expired one `reason:'expired'`. A skipped step leaves the lead Not
  Verified, which the core set at creation. The number must carry a country code (`+` or `00`).

## 5. Confirmation email

`sendConfirmation()` in `lib/email.js` sends one short plain text email through the Resend HTTPS API when
`EMAIL_API_KEY` and `EMAIL_FROM` are set: thank you, which division will be in touch, one next step (reply with a
good time, or call the office; both office numbers), signed by the named mailbox. Nothing is sent without the env.
It is sent only when the lead is stored (in Pipedrive, or as a Netlify Forms submission).
TO CONFIRM: the sending mailbox and its verified domain in Resend (Gilbert).

## 6. Environment variables (Netlify: Site configuration > Environment variables)

| Variable | Needed for | Notes |
|---|---|---|
| `PIPEDRIVE_API_TOKEN` | Everything in Pipedrive | Pipedrive > Personal preferences > API. Without it leads stay in the Netlify Forms inbox only and the direct endpoint answers `reason: unconfigured`. |
| `TURNSTILE_SECRET_KEY` | Turnstile check | Pair of the site key in `D.config.turnstileSiteKey`. Off when empty. |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID` | Phone verification | All three or nothing; the step is skipped without them. |
| `EMAIL_API_KEY`, `EMAIL_FROM` | Confirmation email | Resend API key and the named mailbox, for example `Imperial Holdings Group <enquiries@...>`. Off when either is empty. |
| `EMAIL_REPLY_TO` | Confirmation email | Optional reply address. |
| `LEAD_RATE_LIMIT`, `LEAD_RATE_WINDOW_MINUTES` | Rate limit | Defaults 5 and 10. |
| `LEAD_ALLOWED_ORIGINS` | Other Imperial sites | Comma separated origins allowed to call `lead` and `verify` besides the site's own origin. |
| `LEAD_SITE` | Site key | Default `ihg`; the hidden `site` field overrides it per submission. |

Never put any of these in the repository or in `netlify.toml`.

## 7. Tests

```
npm run test:functions
```

Runs `node --test tests/functions/*.test.js` (Node 22, built-in test runner, no dependencies). `tests/functions/_mock.js`
replaces `fetch` with an in-memory Pipedrive, Turnstile, Twilio and Resend, records every request and lets the tests
assert on what was written. Covered: each of the six division choices (kind, owner, pipeline, stage, score, note with
every tracking field), the owner from the config file, disposable email, honeypot, Turnstile pass and fail, dedupe by
email and by phone with note and activity, reuse of an open record, rate limit, lead label fallback, nationality and
country matching, guide and interest defaults, programme fit and partner details, no token, Pipedrive failure, the
confirmation email, `markVerified`, the direct endpoint (origin, methods, bodies, references), the Netlify event, the
score table, and the verify function (start without env, start with env, rate limit, right code, wrong code).

Nothing in the tests or the code calls a live service without its env; the tests clear the env they do not want.

## 8. The real end-to-end test (a human runs this, with approval)

Prerequisites: the site is deployed on Netlify, `PIPEDRIVE_API_TOKEN` is set, the owner ids are filled in
`shared/lead-routing.json` (or left at 0 for the token's user) and deployed. Each step writes a real record in
Pipedrive; agree with the team first who deletes the test records afterwards.

1. Open the deployed site, go to Contact, choose "Citizenship or residency for my family", fill the form with a
   real mailbox you can read, a phone with country code, timeline "Within 3 months", any budget band, and a message
   that starts with `TEST`. Submit.
2. In Netlify: Forms > contact shows the submission. Logs > Functions > submission-created shows one line like
   `submission-created ok form=contact division=citizenship kind=lead id=... score=hot ref=N...`.
3. In Pipedrive: Leads inbox has `[HOT] Website: <name> · Imperial Citizenship` with the owner, the Division field, a
   note with the message, the score line and every tracking field, and the person with Verification Status
   Not Verified. Record the lead id.
4. Repeat step 1 for the other five choices (Private Office, Partners Club with a firm and profession, Academy, Real
   Estate with buy or rent and an area, Group). Expect leads for Private Office and Real Estate, deals in Introducer
   Pipeline [2026] > Introducer IN for Partners Club and Academy, and a deal in Opportunity Requests > New Request for
   Group. Record each id.
5. Submit once more with the same email as step 1 and a different message: no new person, the note lands on the
   existing lead, and an activity "Website enquiry follow up" due today is on the person. Then submit with a new email
   but the same phone: same result.
6. Submit with `someone@mailinator.com`: the function log shows `rejected ... reason=disposable` and nothing reaches
   Pipedrive. Submit with the honeypot filled (from the browser console: set `company_url` on the hidden field before
   sending): `reason=honeypot`.
7. Direct endpoint: from the site's own origin (browser console on the deployed site) run
   `fetch('/.netlify/functions/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({form:'enquiry',data:{name:'TEST Direct',email:'<your mailbox>',division:'citizenship',country:'Nigeria',msg:'TEST direct',consent:'yes',site:'ihg'}})}).then(r=>r.json()).then(console.log)`
   and expect `{ok:true, ref:'W...'}` with the reference in the Pipedrive note. The same call from another origin
   answers 403.
8. Phone verification (only once Twilio is configured): submit with a phone you hold, choose WhatsApp or SMS, enter
   the code. The person's Verification Status turns Verified and a "Phone verified" note sits on the lead. Submit
   again and skip the step: the lead arrives Not Verified.
9. Confirmation email (only once `EMAIL_API_KEY` and `EMAIL_FROM` are set): the mailbox from step 1 receives the
   short confirmation from the named mailbox with both office numbers.
10. Rate limit: send six enquiries from one connection within ten minutes; the sixth logs `reason=rate` (it still
    sits in the Netlify Forms inbox).

Report the lead and deal ids from steps 3 and 4, and which of 8 and 9 could run.

## 9. Reusing the core on another Imperial site

The core is site-neutral. A sister site posts the same field names from `shared/lead-schema.json`, sets the hidden
`site` field to its key (`citizenship`, `partners-club`, `private-office`, `real-estate`, `academy`) and leaves the
division out to get that site's default division, or sets it to route elsewhere. Deployed on its own Netlify site it
copies `netlify/functions/` and `shared/` and sets the same environment variables; calling this site's `lead` and
`verify` functions instead needs its origin in `LEAD_ALLOWED_ORIGINS`.

## 10. TO CONFIRM

* Owner user ids per division in `shared/lead-routing.json` (needs the Pipedrive user list).
* Whether Academy enquiries belong in the Introducer Pipeline or elsewhere.
* The sending mailbox for the confirmation email and its domain in Resend.
* Twilio Verify service and the preferred channel (WhatsApp, SMS or both).
* Cloudflare Turnstile keys.

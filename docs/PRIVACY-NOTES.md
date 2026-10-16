# Privacy notes for counsel

Written 15 October 2026 for the review of the privacy notice at `/privacy` (brief section 8). The notice describes
what the website does today, as built in this repository. It is complete in substance and waits for counsel to review
it, fill the values marked TO CONFIRM and approve it. Nothing here names a law: that is counsel's call.

Where the copy lives: `assets/js/data.js`, key `legal` (privacy and terms). `legal()` in `assets/js/app.js` renders it.
In the copy, `[[text]]` renders as the amber TO CONFIRM placeholder, `{email}` as the group mailbox, and
`{offices:true}` as both office addresses. `legal.updated` (empty today) is the date shown as "Last updated" once a
version is approved. The amber "awaiting legal review" notice at the top of both pages stays until counsel approves.

## 1. What the site collects

A visitor can read every page without giving us anything. Personal information arrives only through the four forms.

| Form | Where | Fields the person types or chooses |
|---|---|---|
| `enquiry` | Retired from the pages in v6 (the home and division pages now link to the journey); the hidden form and its fields stay for the sister sites | who they are (private client, professional partner, institution), what it concerns (division), full name, email, phone (optional), country of residence, nationality, who the enquiry is for (myself, family, a client), when they would like to begin, budget band (optional), firm and profession (Partners Club only), buy or rent and area of interest (Real Estate only), message, consent |
| `contact` | `/contact`, the Start a relationship journey: a chooser, three paths and one closing screen (docs/RELATIONSHIP-JOURNEY.md) | the path (private client, professional partner, institution); Private Clients: what it concerns, who it is for, country of residence, nationality (optional, citizenship and Private Office only), when they would like to begin, budget band (optional, citizenship and Real Estate only), buy or rent and area (Real Estate only); Professional Partners: how they would like to work with Imperial, profession, firm, where they practise, what they or their client are considering (no client details are asked), timing; Institutions: what they would like to explore, organisation, which kind of organisation it is (`org_type`), their role (optional), country, a date that matters (optional); then on every path: full name, email, phone (optional), reply by (email, phone call or either), a message (optional), consent; and, from the house finder, the ambitions chosen there, or from the programme fit check, its five answers (`interests`, `quiz_answers`) |
| `interest` | Real Estate division page | full name, email, country of residence, what they are interested in, anything else (optional), consent |
| `guide` | Citizenship division page | full name, email, consent |

Every form also carries hidden fields the person does not see (`shared/lead-schema.json` is the authority):

* Tracking: `source`, `medium`, `campaign`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`,
  `gclid`, `fbclid`, `landing` (the first page of the visit), `referrer` (the site that linked here), `page` (the page
  the form was sent from). They describe the channel, not the person. `ttclid` is also read from the address and kept
  for the visit, and shapes the `medium` value, but is not posted.
* Routing: `audience`, `audience_resolved`, `division` or `about`, `routed_to` (which Imperial team), `site` (`ihg`),
  `lead_source` (`website`, `programme-fit` or `guide`), `quiz_answers` (the five programme fit answers, as JSON).
* `company_url`: the honeypot. Only automated software fills it; a filled value rejects the submission.
* `cf-turnstile-response`: the Cloudflare Turnstile token, present only when Turnstile is switched on (it is off today:
  `config.turnstileSiteKey` is empty).

Phone verification (`/.netlify/functions/verify`, optional, after a submission that gave a phone number): the
telephone number and the chosen channel (WhatsApp or SMS) go to Twilio Verify, and whether the code matched is written
to the Pipedrive person as Verified or Not Verified. Nothing is sent without the Twilio environment variables; without
them the page skips the step.

Network address: the functions read the client IP from the request to rate limit submissions (5 per 10 minutes per IP,
in memory, best effort) and pass it to Cloudflare when Turnstile is on. The IP is not written to Pipedrive.
TO CONFIRM: what the Netlify function logs and the Netlify Forms inbox keep (Netlify records the submission; the
function logs one line per submission with the form, division and reference), and for how long.

Browser storage, on the person's device only:

* `localStorage` `ihg-draft-<form>`: what was typed in a form, so a reload loses nothing. Cleared on send or "Start
  afresh". Never read by us unless the form is sent.
* `sessionStorage` `ihg-src`: the tracking values above for the current visit; `ihg-intro`: that the opening animation
  was seen. Both end with the browser session.
* No cookie is set by the site. Analytics, when switched on, run with `client_storage: 'none'` and consent defaults
  denied (`shared/analytics.js`), so no analytics cookie either. The notice therefore says there is no cookie banner.

Third party content: video players (Vimeo with `dnt=1`, or Mux) load only when a visitor presses play, and the host
then sees the visitor's IP as any website does. No clip has an id yet. Links to WhatsApp (`wa.me`) and to the booking
pages (not yet configured) leave the site.

## 2. Where it flows

1. Browser posts the form to Netlify Forms (the site's host). Netlify keeps the submission in its forms inbox and
   calls `netlify/functions/submission-created.js`.
2. The function (`netlify/functions/lib/core.js`) checks honeypot, rate limit, email format and disposable domains,
   and Turnstile when configured, then writes to Pipedrive: a person (found by email or phone, or created), an
   organisation when a firm was given, a lead or deal in the division's pipeline assigned to the division's owner,
   a note holding every field including the tracking fields and the message, and a follow-up activity for returning
   people. Owners, pipelines and field keys are in `shared/lead-routing.json`. See `docs/LEADS.md` section 3 for the
   exact field mapping.
3. When `EMAIL_API_KEY` and `EMAIL_FROM` are set, a short plain text confirmation goes to the person through the
   Resend API: name, email address, the division that will reply, the office numbers. Off today.
4. When the person chooses to verify the phone, the number goes to Twilio Verify (WhatsApp or SMS). Off today.
5. Imperial OS (off today): when `IMPERIAL_OS_WEBHOOK_URL` and its secret are set, the function sends a signed copy
   of each stored record (the fields above, the score, the Pipedrive ids, the consent record and the tracking fields)
   and of each phone verification to the Group's internal platform, Imperial OS (docs/LEADS.md section 11). Which
   system is the master, where Imperial OS stores the record and for how long are TO CONFIRM.
6. Fallback: if the Netlify Forms post fails, the page posts the same data as JSON to
   `/.netlify/functions/lead` (`netlify/functions/lead.js`), which runs the same core. Then there is no Netlify Forms inbox copy. If both fail,
   the page shows the office numbers and the email and keeps the draft on the device.
7. People: the lead is seen by the named owner in the relevant Imperial team (Citizenship, Private Office, Partners
   Club, Academy, Real Estate, or the Group team) and whoever else has access to that Pipedrive pipeline.

Providers that may hold personal data, with where they store it to be confirmed: Netlify (hosting, forms, function
logs), Pipedrive (CRM), Resend (email, when on), Twilio (verification, when on), Cloudflare (Turnstile, when on),
Google (analytics, when on, cookie-free), Vimeo or Mux (video, when a clip exists), Imperial OS (the Group's own
platform, when the handoff is switched on; its hosting to be confirmed).

## 3. Open TO CONFIRM items in the notice

Each one renders as an amber placeholder on `/privacy` until it is filled in `data.js`.

| Item | Where in the notice | Who supplies it |
|---|---|---|
| Legal entity, registered address and data controller | Who we are; the top notice; the footer | Counsel, Gilbert |
| Licence number | The top notice; the footer | Gilbert |
| Retention period after last contact (one value, for example 24 months) | How long we keep it | Counsel with the Founder |
| Dedicated privacy mailbox (the notice uses info@imperialholdingsgroup.com) | Your choices and your rights; How to contact us | Gilbert |
| Applicable data protection law and supervisory authority for each office | Your choices and your rights | Counsel |
| Where each provider stores data and the safeguards for transfers | Where it goes | Counsel, with the providers' terms |
| Email provider (Resend) and phone verification provider (Twilio Verify): on or off at launch | Where it goes | Gilbert |
| Cloudflare Turnstile: on or off at launch | What we collect | Gilbert |
| Analytics provider (Google Analytics 4, cookie-free): on or off at launch | Analytics and cookies | Gilbert |
| Date of the approved version (`legal.updated`) | Last updated line; Changes to this notice | Counsel |
| Jurisdiction for the terms of use, and the full terms | Terms of use | Counsel |

## 4. What counsel must decide

1. Whether the notice as written is sufficient under the laws that apply to each office, and which of those laws, if
   any, the notice should name. The notice names none today.
2. The lawful basis for each form and whether the consent box wording is enough. The boxes read: "I agree to Imperial
   Holdings Group using these details to reply to me, as described in the privacy notice." (the journey's closing
   screen, wording v6; no marketing consent is asked or implied), "I agree to Imperial Holdings Group using these
   details to respond to my enquiry, as described in the privacy notice" (the retired enquiry form), "...contacting me about Imperial Real Estate, as described in the privacy notice" (interest) and
   "...sending me the guide and contacting me about it, as described in the privacy notice" (guide). Every box links
   the notice beside it.
3. Retention: one period for enquiries that do not become clients, and the rule for clients ("as long as the
   relationship lasts and any period the law requires afterwards" is the draft wording).
4. International transfers: the providers above store data outside the UAE and Nigeria. Whether processing agreements
   are in place with Netlify, Pipedrive, Resend, Twilio, Cloudflare and Google, and what the notice must say.
5. Whether a cookie banner is needed anywhere. Our position: no non-essential cookie is set and analytics are
   cookie-free, so none is shown. Counsel to confirm for each office's law.
6. The statements of policy in the draft that counsel may wish to change: sharing with "trusted Partners only with
   your agreement", "we will tell you" after a breach that affects the person, no knowing collection from anyone
   under 18, and the promise of a prompt reply to a request for a copy or deletion.
7. How a request for a copy, correction or deletion is fulfilled in practice: the Pipedrive person, lead or deal and
   notes; the Netlify Forms inbox; the Netlify function logs; the Resend and Twilio logs; Imperial OS, once the
   handoff is on; any backup. TO CONFIRM: the internal process and who owns it.
9. The consent record. The note on the person and the record carries `consent: yes`, the page it was given on and the
   submission time; Imperial OS, when on, receives `consent {given, wording: "v6", notice_version, at, page}`.
   `notice_version` stays empty until counsel approves a version of the notice (`legal.updated`). Whether that is
   enough to evidence consent is for counsel.
8. The terms of use, which are a placeholder with the two existing statements (information only, no guarantee of a
   government decision) and a jurisdiction to confirm.

## 5. Checks that keep the pages honest

* `npm run check`: syntax, and no em dashes anywhere.
* `npm run test:a11y` (with the test server running): axe-core on the main pages, including `/privacy`, and a keyboard
  walk; `node tests/contrast.js`: every text colour against its backgrounds.
* The build (`npm run build`) prerenders `/privacy` and `/terms` like every other page; the pre-launch `noindex` stays
  until `LAUNCH=1` (see `build/README.md`).

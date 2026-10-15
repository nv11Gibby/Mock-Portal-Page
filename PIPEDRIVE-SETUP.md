# Enquiry funnel: website to Pipedrive

Every enquiry on the site (home enquiry form, the three-step contact form and the Real Estate register-interest form) is a Netlify Form submission. Netlify then runs `netlify/functions/submission-created.js`, which creates the record in Pipedrive.

## One-time setup in Netlify

1. Site configuration > Environment variables > add `PIPEDRIVE_API_TOKEN` (Pipedrive > Personal preferences > API). Do not put the token in the repository.
2. Optional owner assignment: add `PIPEDRIVE_OWNER_CLIENTS`, `PIPEDRIVE_OWNER_PARTNERS` and `PIPEDRIVE_OWNER_INSTITUTIONS` with the Pipedrive user ids of the people who should own each kind of enquiry. Without them, records are owned by the token's user.
3. Deploy. Netlify detects the three forms (`enquiry`, `contact`, `interest`) from the hidden copies in `index.html`.
4. Test with one real submission and check the Pipedrive Leads inbox (clients) or the pipelines (partners, institutions). Function logs are under Logs > Functions > submission-created.

## What is recorded

| Site field | Pipedrive |
|---|---|
| Audience (private client, professional partner, institution) | Contact Type: Client (230) or Partner/Introducer (231); institutions carry no Contact Type |
| Division (what the enquiry concerns) | Division field: Imperial Citizenship, Imperial Real Estate, Private Office, or Multiple for group enquiries |
| Source (first-touch, kept for the visit) | Source Platform: Website (799). Source Method: Google Ads, Meta Ads, Tiktok Ads, Paid Ads, Referral or Organic, from the UTM parameters, gclid and fbclid |
| Message, country, routing, UTM, landing page, referrer | A Note on the record |
| Urgency | Standard, or Urgent if the message says so |

## Where each enquiry lands

- Private clients: a Lead in the Leads inbox, titled "Website: name · division", for qualification and conversion to a deal in Imperial Pipeline [2026].
- Professional partners: a Deal in Introducer Pipeline [2026], stage Introducer IN.
- Institutions and strategic relationships: a Deal in Opportunity Requests, stage New Request.

Pipeline and stage ids can be overridden with `PIPEDRIVE_PIPELINE_*` and `PIPEDRIVE_STAGE_*` environment variables if the account changes.

## Source tracking on the site

`assets/js/app.js` keeps the first-touch `utm_*`, `gclid`, `fbclid`, referrer and landing page for the visit (session storage) and sends them as hidden fields with every form, together with the page the form was sent from. Nothing is sent to any third party from the browser; the only request is the Netlify form post.

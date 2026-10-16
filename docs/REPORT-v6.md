# IHG website v6: brand and digital experience refinement, report

Imperial Holdings Group website, branch `ihg-site` on github.com/nv11Gibby/Mock-Portal-Page. Prepared 16 October 2026 for Zaid Alhindi, Founder and CEO. The mandate is docs/BRAND-BRIEF.md (posted 15 October 2026). This is a refinement of the existing site, not a rebuild: search, navigation, division exploration and the Journal are kept.

Preview (photographs shown before guest consent, forms send nothing): https://ihg-website-preview.onrender.com

## 1. Decisions waiting for the Founder

1. **Hero line.** Option A, "A world of opportunity. Built around relationships.", is built. Options B and C are in docs/HERO-OPTIONS.md.
2. **Hero visual.** The graded Dubai skyline at dusk is built (licensed, credited, no people). The ink map with Dubai and Lagos is a one-line switch (`D.hero.style = 'map'` in assets/js/data.js).
3. **Hekma Iskandarani's title.** The About page shows a To confirm chip. The record of 28 September 2026 says Board Member, Strategic Relationships.
4. **Group email.** info@imperialholdingsgroup.com is shown with a To confirm chip. Publish it once it is monitored, or use info@imperialcitizenship.com meanwhile.
5. **Division statuses.** Partners Club "Opening in stages", Private Office "Being established", Real Estate "Coming soon", Academy "In development". Citizenship carries no status. Please confirm these as the published wording.
6. **Insights.** The four articles are drafts. They show on the preview only; approve, edit or drop each one.
7. **Event facts.** Dates, venues and guests for the Lagos Diplomatic Soiree, the gala dinner and the Delborough dinner, and the roles of three Grenada guests, are held until a guest list or press release is on file.

## 2. The nine deliverables

| # | Deliverable | Where |
|---|---|---|
| 1 | Copy audit, current versus proposed, every public string (1,406: 319 rewritten, 32 held, 7 removed) | docs/COPY-AUDIT.md; inventory docs/COPY-INVENTORY.md |
| 2 | Three hero messaging options with the recommendation | docs/HERO-OPTIONS.md |
| 3 | Refined home page: architectural hero, one institution with five divisions, four event photographs in one strip, the three paths once, closing band with "Two Cities. One Horizon." | the site, home page |
| 4 | Updated copy on every page and all five divisions, applied and tested | the site; docs/COPY-AUDIT.md |
| 5 | Restrained event photography plan; generated scenes retired; consent gating per frame | docs/PHOTOGRAPHY-PLAN.md |
| 6 | Start a Relationship: Private Clients, Professional Partners, Institutions and Strategic Relationships; progressive questions; Pipedrive and Imperial OS handoff (off by default) | /contact; docs/RELATIONSHIP-JOURNEY.md; docs/LEADS.md |
| 7 | Brand voice and digital experience guide for all six sites, with machine-readable rules | docs/BRAND-GUIDE.md; docs/voice-rules.json |
| 8 | Launch-readiness audit: 11 launch blockers with owners, 28 placeholders that can launch, 0 broken links | docs/LAUNCH-READINESS.md |
| 9 | Updated interactive prototype | the preview link, the zip and the text copy |

Supporting audits: docs/CLAIMS-AUDIT.md (103 claims checked against the records: figures band removed, 13 held, 28 softened) and docs/UX-AUDIT.md (56 interactions reviewed, 34 changes, all applied).

## 3. What a visitor now sees

- The hero is a quiet Dubai skyline, no people, with the new line and two actions: Start a relationship, and Our divisions.
- No intro veil, no sliding reveals, no film grain, no magnetic buttons, nothing that loops. Pages arrive whole. The mega menu opens on click.
- Every division shows the same status on every page and speaks in the future tense until it is open.
- The figures band is gone. No "20+ countries", no "regional hub", no "exclusive", no fee or visa price anywhere.
- "Start a relationship" replaces "Enquire now" everywhere. The journey asks only what each path needs; nationality, budget and phone are optional.
- No form shows a confirmation unless Imperial actually received the message. On the preview build every form says "Preview: nothing was sent".
- Production shows no guest photographs until consent is recorded per event. No photograph of the woman in the white suit appears anywhere.
- Every page fits a 320 px phone; header controls are at least 44 px on phones.

## 4. Verification

Two independent reviews ran against the brief: a launch-readiness audit and a page-by-page review at desktop, phone and 320 px. Their findings (one high: the preview confirmation; eleven medium: statuses, tense, repeated path cards, a gala photograph showing visa prices on the backdrop, held names and titles, taglines, labels) were all fixed and the reviews' defects are marked in docs/LAUNCH-READINESS.md.

| Check | Result |
|---|---|
| npm run check (syntax, copy rules, no dashes) | OK |
| Functions unit tests | 73 of 73 |
| Build (production 18 pages without drafts; preview 23) | OK |
| SEO checks, both builds | OK |
| Contrast pairs | 21 OK |
| Smoke, page loads without console errors | 38 OK |
| Accessibility (axe) | no serious or critical issues |
| End-to-end lead tests (all three paths, failures, preview) | 40 of 40 |
| Link check | 0 broken |

Not measured from here: Lighthouse (not installed in this environment), the 25 external links and the host's 404, caching and compression behaviour. These are in the launch-readiness audit.

## 5. Before the domain goes live

From docs/LAUNCH-READINESS.md, in short: counsel approves the privacy notice, terms and consent wording, and supplies the legal entity, licence and address; the Group mailbox and the two WhatsApp numbers are confirmed; PIPEDRIVE_API_TOKEN and the owner for each route are set in Netlify and a real enquiry is traced end to end; the production domain is confirmed; the four division website links are filled or hidden. Once the Founder approves, Gilbert Ferrer, Technology and AI Lead, and Kaylan Tarin, Head of Systems, Intelligence and Digital Product, link the domain, and only then is LAUNCH=1 set.

## 6. Files

- ihg-site-netlify-v6.zip: the source Netlify builds from.
- ihg-site-v6-dist/: the built site.
- ihg-site-preview/IHG-Website-v6-Lite.txt: a single-file copy for review in ChatGPT.
- ihg-site-v6/: the guide, plans and audits.

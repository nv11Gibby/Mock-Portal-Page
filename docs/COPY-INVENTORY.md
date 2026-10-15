# Copy inventory: the current wording of the Imperial Holdings Group website

Branch `ihg-site` at dee0685, built with `npm run build` on 15 October 2026 and read from `dist/`. This is the "current" column of the v6 copy audit (docs/COPY-AUDIT.md, deliverable 1 of docs/BRAND-BRIEF.md): every public-facing string, where it sits on the page and where it lives in the source, so that the proposed wording can be set against it line by line and an implementer can apply the change. The proposed column is not part of this document. Nothing in the repository was changed.

## How to read it

* **IDs** run C0001 to C1406 in page order: home, about, divisions and each division, journal and each event, insights and each article, contact, privacy, terms, 404, error; then the header, the menus, the footer, the search palette, the forms, the blocks several pages share, the strings behind the page, and the strings in `data.js` that never render.
* **Part A** is one table per page, in the order the page reads, holding the strings that page alone carries (its title and meta description first). Strings the page shares with other pages are listed once in Part B; the line above each table names the shared blocks on that page.
* **Part B** holds the shared strings with the list of routes: header (with the skip link, the intro veil, the quick actions and the WhatsApp sheet), the mega menu and the mobile menu, the footer, the search palette, the forms (the enquiry card, the contact flow, register interest, the guide, and their validation, success, failure, verification and booking states), then the page blocks several pages share (the closing band, the division page furniture, the event and article furniture), the strings behind the page (structured data, the feed, the web app name, the captions placeholder, the confirmation email), and the `data.js` strings that never reach a page today.
* **Section** names the page block: hero, the Group, ecosystem, network, leadership, events, journal, presence, enquiry, header, menu, footer, palette, forms (and which form), legal, meta, and the finer blocks of the division pages (overview, what we do, who it is for, how it works, cta band, other houses) and of the About page (our story, how we work, our values, our word, founder film). "a / b" means the same string sits in two blocks.
* **Element** names the tag or role: eyebrow, lead paragraph, h1 to h3, button link, text link, chip (badge), form label, option, error message, consent text, placeholder, note, figure caption, img alt text, aria-label, screen reader announcement, toast. "a > small" is the sub-label inside a link.
* **Current wording** is captured verbatim from the built page (entities decoded, whitespace collapsed). Numbering spans ("01", "STEP 01") are dropped from list items and counted separately where they are copy in their own right. Curly braces mark a value filled in at run time ({first name}, {hh:mm}). Amber placeholders render as "To confirm: …", and that is what is captured.
* **Source** is `data.js:line`, `app.js:line` or `index.html:line`, several lines where the string is used in several places. "assembled" or "composed" in the notes means the string is put together at run time from pieces on that line; "written as separate lines" means a heading is split into two mask lines in the source.
* **Notes** record visibility (hidden until opened, screen reader only, aria-hidden, honeypot, amber placeholder), the state that shows a run-time string, and "JavaScript only: not in the prerendered HTML" for the strings that exist only through behaviour.

## Counts

* Pages built and read: 25 (the 23 routes plus 404.html and error.html).
* Strings captured from the built pages, after de-duplication across pages: 1159 (829 on a single page, 330 shared across pages). A check that every text node on every built page is covered by a captured string found no gap (5446 text nodes).
* Strings that exist only through JavaScript: 190, kept from 467 candidate fragments found in app.js and data.js and not in the built pages (409 fragments belong to a kept string, 15 were already captured from the pages, 43 are markup, selectors, attribute values, key names, JSON-LD type names, keyboard key names or logo colour variants).
* Strings in `data.js` that never render today: 57 (division taglines and card copy, site roles, two hero alt texts and 34 gallery alt texts held back by the consent gate, two unused view strings).
* Entries in copy-inventory.json: 1406.

## Part A: page by page

### / (Home, 86 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, forms, hero, ecosystem, network, leadership, events, journal, presence.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0001 | meta | page title | Imperial Holdings Group · Two Cities. One Horizon. | app.js:785; index.html:7 | default title when a page has none |
| C0002 | meta | meta description | Imperial Holdings Group: five specialist divisions, led from Dubai and Lagos. Citizenship, Private Office, Partners Club, Academy and Real Estate. | app.js:689; index.html:8 |  |
| C0003 | hero | eyebrow | Imperial Holdings Group · Dubai · Lagos | app.js:275 |  |
| C0004 | hero | h1.d1 | Two Cities. One Horizon. | app.js:785; index.html:7 |  |
| C0005 | hero | lead paragraph | Five specialist divisions, one standard, and one person who knows your family. | app.js:276 |  |
| C0006 | hero | button link (gold) > span | Explore our ecosystem | app.js:278 |  |
| C0007 | hero | small | For private clients | app.js:278 |  |
| C0008 | hero | button link (outline) > span | Partner with us | app.js:279 |  |
| C0009 | hero | small | For professional partners | app.js:279 |  |
| C0010 | hero | p.hh-time | In Dubai it is --:--. | app.js:280 |  |
| C0011 | hero | p.hh-cred | To confirm: Final hero photo | app.js:49 | composed at run time; the fixed part is on this line |
| C0012 | hero | span.cue | Scroll | app.js:281 | aria-hidden (decorative) |
| C0013 | the Group | eyebrow | The Group | app.js:283,663 |  |
| C0014 | the Group | h2.d2 | A house for a life across borders. | app.js:283 | written as separate lines in the source |
| C0015 | the Group | lead paragraph | Imperial Holdings Group is the parent of five specialist divisions, led from Dubai and Lagos. We help families and their advisers decide where they live, what they own and what they leave behind. | app.js:284 |  |
| C0016 | the Group / leadership | text link | About the Group | app.js:202,284,297,1769 |  |
| C0017 | the Group | span | years of combined experience | data.js:206 |  |
| C0018 | the Group | span | Client engagements | data.js:207 |  |
| C0019 | the Group | span | individuals served | data.js:208 |  |
| C0020 | the Group | span | countries with relationships | data.js:209 |  |
| C0021 | the Group | span | strategic relationships | data.js:210 |  |
| C0022 | the Group | p.figs-note | Figures from the Imperial Holdings brochure. To confirm: "As at" date for these figures | app.js:216 | written as separate lines in the source |
| C0023 | ecosystem | h2.d2 | Five divisions. One table. | app.js:645 |  |
| C0024 | ecosystem | lead paragraph | Each division is a specialist. Together they sit at one table, so the person advising on your residency already knows about the home, the company and the school. | app.js:286 |  |
| C0025 | ecosystem | span.vl | Citizenship | data.js:15,135,252 |  |
| C0026 | ecosystem | h3 | Imperial Citizenship | data.js:15,252; app.js:1592 |  |
| C0027 | ecosystem | p | Second residency and citizenship by investment, from first conversation to completed application. | data.js:253 |  |
| C0028 | ecosystem | span.tlink | Discover Citizenship | app.js:220 | composed at run time; the fixed part is on this line |
| C0029 | ecosystem | span.vl | Partners Club | data.js:16,272 |  |
| C0030 | ecosystem | h3 | Imperial Partners Club | data.js:16,272,559 |  |
| C0031 | ecosystem | p | The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | data.js:273 |  |
| C0032 | ecosystem | span.tlink | Discover Partners Club | app.js:220 | composed at run time; the fixed part is on this line |
| C0033 | ecosystem | span.vl | Private Office | data.js:17,138,293,366 |  |
| C0034 | ecosystem | h3 | Imperial Private Office | data.js:17,293 |  |
| C0035 | ecosystem | p | One lasting relationship for families with multi-country lives. | data.js:294 |  |
| C0036 | ecosystem | span.tlink | Discover Private Office | app.js:220 | composed at run time; the fixed part is on this line |
| C0037 | ecosystem | span.vl | Real Estate | data.js:18,313; app.js:381 |  |
| C0038 | ecosystem | h3 | Imperial Real Estate | data.js:18,313; app.js:381 |  |
| C0039 | ecosystem | p | Licensed property advisory, starting with Dubai. | data.js:314 |  |
| C0040 | ecosystem | span.tlink | Register interest | data.js:560; app.js:220,381,389,396,1667 |  |
| C0041 | ecosystem | span.vl | Academy | data.js:19,329 |  |
| C0042 | ecosystem | h3 | Imperial Academy | data.js:19,329 |  |
| C0043 | ecosystem | p | Learning, training and certification for the people who do this work. | data.js:330 |  |
| C0044 | ecosystem | span.tlink | Discover Academy | app.js:220 | composed at run time; the fixed part is on this line |
| C0045 | ecosystem | span | Hover, focus or tap a division to open it. | app.js:287 |  |
| C0046 | network | eyebrow | Our Network | app.js:290,655,663,1771; index.html:48 |  |
| C0047 | network | h2.d2 | One relationship. Many doors. | app.js:290 | written as separate lines in the source |
| C0048 | network | lead paragraph | Most relationships begin with a single question and grow from there. The ecosystem exists so that each step is taken with the others in view. | app.js:290 |  |
| C0049 | network | ol aria-label | How a relationship with Imperial grows | app.js:291 |  |
| C0050 | network | h3.h3 | Citizenship | data.js:15,135,252 |  |
| C0051 | network | p | A business owner first approaches Imperial for Grenada citizenship. | data.js:135 |  |
| C0052 | network | text link | Imperial Citizenship | data.js:15,252; app.js:1592 |  |
| C0053 | network | h3.h3 | Property | data.js:136 |  |
| C0054 | network | p | Later, the family acquires an investment property through Imperial Real Estate. | data.js:136 |  |
| C0055 | network | text link | Imperial Real Estate | data.js:18,313; app.js:381 |  |
| C0056 | network | h3.h3 | Introduction | data.js:137 |  |
| C0057 | network | p | They introduce another entrepreneur through Imperial Partners Club. | data.js:137 |  |
| C0058 | network | h3.h3 | Private Office | data.js:17,138,293,366 |  |
| C0059 | network | p | In time, the relationship broadens into a Private Office relationship. | data.js:138 |  |
| C0060 | network | text link | Imperial Private Office | data.js:17,293 |  |
| C0061 | network | note (p.xs) | Imperial gatherings in Dubai and Lagos. Photographs of guests appear once they have confirmed they are happy to be featured. See selected events | app.js:292 | written as separate lines in the source |
| C0062 | network | h3 | Private Clients | data.js:141 |  |
| C0063 | network | p | Mobility, property and selected private services. | data.js:141 |  |
| C0064 | network | button link (gold) > span | Explore Client Services | data.js:141 |  |
| C0065 | network | h3 | Professional Partners | data.js:142 |  |
| C0066 | network | p | Advisers, family offices, institutions and business introducers. | data.js:142 |  |
| C0067 | network | button link (outline) > span | Explore Imperial Partners Club | data.js:142 |  |
| C0068 | network | h3 | Institutions & Strategic Relationships | data.js:143 |  |
| C0069 | network | p | Developers, governments, service providers and strategic collaborators. | data.js:143 |  |
| C0070 | network | button link (outline) > span | Start a Strategic Conversation | data.js:143 |  |
| C0071 | leadership | lead paragraph | Imperial is led by its founder, with one Group team working across every division. | app.js:295 |  |
| C0072 | leadership | p | Each division has its own leadership, introduced on its website. Group biographies: To confirm: to be approved | app.js:297 | written as separate lines in the source |
| C0073 | events | h2.d2 | Gatherings worth the evening. | app.js:299 | composed at run time; this line holds part of it |
| C0074 | events | lead paragraph | Diplomatic collaborations, private gatherings and the relationships behind them. | app.js:299 |  |
| C0075 | events | text link | All events and the Journal | app.js:299 |  |
| C0076 | journal | lead paragraph | Fewer entries, chosen with care: genuine company developments, insights, partnerships and selected events. | app.js:304 |  |
| C0077 | journal | button link (outline) > span | Read the Journal | app.js:305 |  |
| C0078 | presence | eyebrow | Global presence | app.js:307,1777 |  |
| C0079 | presence | h2.d2 | Led from Dubai and Lagos. | app.js:879 |  |
| C0080 | presence | lead paragraph | Headquarters in Dubai, a regional hub in Lagos and relationships with Partners, advisers and specialists in more than 20 countries. | app.js:307 |  |
| C0081 | hero | greeting (span#greet) | Good morning. | app.js:1001 | after "In Dubai it is {hh:mm}." from 05:00 to 11:59 Dubai time; JavaScript only: not in the prerendered HTML |
| C0082 | hero | greeting (span#greet) | Good afternoon. | app.js:1001 | 12:00 to 17:59 Dubai time; JavaScript only: not in the prerendered HTML |
| C0083 | hero | greeting (span#greet) | Good evening. | app.js:1001 | 18:00 to 04:59 Dubai time; JavaScript only: not in the prerendered HTML |
| C0084 | film | eyebrow | On film | app.js:302 | home film section, only once an event or journal clip has an id; JavaScript only: not in the prerendered HTML |
| C0085 | film | h2 | The evening, in motion. | app.js:302 | JavaScript only: not in the prerendered HTML |
| C0086 | meta | og:description (static) | Five specialist divisions, one standard, and one person who knows your family. Led from Dubai and Lagos. | index.html:15 | the static default; setMeta() overwrites it with the page description on every page; JavaScript only: not in the prerendered HTML |

### /about (About, 59 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, closing, leadership, presence, how we work.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0087 | meta | page title | About · Imperial Holdings Group | app.js:785; app.js:314,651,663,690,746,1609; index.html:46 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0088 | meta | meta description | Imperial began as a citizenship and residency specialist and has grown into a group of five specialist divisions, run by one team to one standard. | app.js:690 |  |
| C0089 | hero | span | About | app.js:314,651,663,690,746,1609; index.html:46 |  |
| C0090 | hero | eyebrow | About Imperial Holdings Group | app.js:314 |  |
| C0091 | hero | h1.d1 | One house. Many services. | app.js:314 | written as separate lines in the source |
| C0092 | hero | lead paragraph | Imperial began as a citizenship and residency specialist. Over more than a decade of work with families and founders, it has grown into a group of five specialist divisions, run by one team to one standard. | app.js:314 |  |
| C0093 | our story | eyebrow | Our story | app.js:315 |  |
| C0094 | our story | h2.d2 | From one question to a whole house. | app.js:315 | written as separate lines in the source |
| C0095 | our story | lead paragraph | Imperial Citizenship is where we began, and it remains our main business. Working with families on residency and citizenship taught us that one transaction rarely solves the whole problem. | app.js:316 |  |
| C0096 | our story | p.muted | The residency question touches the home. The home touches the school. The company touches the tax position. And the trusted professionals our Clients already rely on needed a reliable house to hand those conversations to. | app.js:317 |  |
| C0097 | our story | p.muted | Imperial Holdings Group is the result: five specialist houses at one table, sharing one team, one standard and one record of each family, so that you never have to explain your family twice. | app.js:318 |  |
| C0098 | our story | note (p.small) | Founding date and milestones: To confirm: Group history and key dates | app.js:319 | written as separate lines in the source |
| C0099 | how we work | div aria-label | One table: your family at the centre, one Relationship Manager, and the five houses | app.js:321 |  |
| C0100 | how we work | b | Your family | data.js:358; app.js:321 |  |
| C0101 | how we work | span.ring-rm | One Relationship Manager | app.js:321 |  |
| C0102 | how we work | a > b | Citizenship | data.js:15,135,252 |  |
| C0103 | how we work | h2.d2 | One team. One point of contact. | app.js:322 | written as separate lines in the source |
| C0104 | how we work | lead paragraph | Our people work across the Group rather than inside a single division, so knowledge and standards travel with your family. | app.js:323 |  |
| C0105 | how we work | p | One Relationship Manager brings each house in when it is needed, together with qualified specialists for regulated matters such as tax, legal and investment. Where a service is best delivered by a trusted Partner, we coordinate it for you, so you still have one person to call. | app.js:324 |  |
| C0106 | our values | eyebrow | Our values | app.js:327 |  |
| C0107 | our values | h2.d2 | Wealthy in restraint. Rich in detail. | app.js:327 | written as separate lines in the source |
| C0108 | our values | lead paragraph | The same standard in every house. We explain the process before we talk about outcomes, so you always know where you stand. | app.js:327 |  |
| C0109 | our values | h3.h4 | Plain speaking | data.js:232 |  |
| C0110 | our values | p | We explain the process before we talk about outcomes, so you always know where you stand. | data.js:232 |  |
| C0111 | our values | h3.h4 | Everything in writing | data.js:233 |  |
| C0112 | our values | p | Options, costs and timelines are set out in writing, option by option, before you decide. | data.js:233 |  |
| C0113 | our values | h3.h4 | One named person | data.js:234 |  |
| C0114 | our values | p | One Relationship Manager across every house. You never have to explain your family twice. | data.js:234 |  |
| C0115 | our values | h3.h4 | Discretion | data.js:235 |  |
| C0116 | our values | p | Private matters stay private. Information is shared only where a service requires it. | data.js:235 |  |
| C0117 | our values | h3.h4 | For the long term | data.js:236 |  |
| C0118 | our values | p | The relationship carries on after the application: renewals, property and the next chapter. | data.js:236 |  |
| C0119 | our word | eyebrow | Our word | app.js:330 |  |
| C0120 | our word | h2.d2 | What we promise, and what we never will. | app.js:330 | written as separate lines in the source |
| C0121 | our word | div.plist-h | We will | app.js:205 |  |
| C0122 | our word | list item > span | Tell you plainly what is possible, and what is not. | data.js:228 |  |
| C0123 | our word | list item > span | Give honest timelines, and update them as things move. | data.js:228 |  |
| C0124 | our word | list item > span | Give you one named Relationship Manager. | data.js:228 |  |
| C0125 | our word | list item > span | Keep private matters private. | data.js:228 |  |
| C0126 | our word | list item > span | Stay after the paperwork is done. | data.js:228 |  |
| C0127 | our word | div.plist-h | We never will | app.js:206 |  |
| C0128 | our word | list item > span | Guarantee an outcome that a government decides. | data.js:229 |  |
| C0129 | our word | list item > span | Claim influence with, or shortcuts through, any government. | data.js:229 |  |
| C0130 | our word | list item > span | Give regulated advice without a qualified specialist. | data.js:229 |  |
| C0131 | our word | list item > span | Share your information beyond what a service needs. | data.js:229 |  |
| C0132 | our word | list item > span | Rush you into a decision. | data.js:229 |  |
| C0133 | leadership | lead paragraph | Imperial is led by its founder, with one Group team working across every division. Each division’s own leadership is introduced on its website. | app.js:332 |  |
| C0134 | leadership | p | Imperial Holdings Group Biography: To confirm: to be approved | app.js:275,284,318,785; index.html:7,14,24 | composed at run time; the fixed part is on this line |
| C0135 | leadership | div.role | Divisional leadership | data.js:242 |  |
| C0136 | leadership | h3 | Citizenship, Private Office, Partners Club, Academy and Real Estate | data.js:242 |  |
| C0137 | leadership | p | Introduced on each division’s website. | app.js:333 |  |
| C0138 | founder film | eyebrow | Founder film | data.js:128; app.js:335 |  |
| C0139 | founder film | h2.d2 | The founder, on film. | app.js:335 | written as separate lines in the source |
| C0140 | founder film | lead paragraph | A short film with the founder, 60 to 90 seconds, is planned for this page. To confirm: Footage to be supplied | app.js:335 | written as separate lines in the source |
| C0141 | founder film | img alt text | Founder film (poster) | data.js:128,240; app.js:335 | composed at run time; the fixed part is on this line |
| C0142 | founder film | span.vid-tbc | To confirm: Footage to be supplied | app.js:49 | composed at run time; the fixed part is on this line |
| C0143 | founder film | figure caption | Founder film · 60 to 90 seconds · Captions | data.js:128,240; app.js:335 | composed at run time; the fixed part is on this line |
| C0144 | presence | eyebrow | Where we work | app.js:237,337 |  |
| C0145 | presence | h2.d2 | Led from Dubai. At home worldwide. | app.js:337 | written as separate lines in the source |

### /divisions (Divisions, 144 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, closing, how we work.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0146 | meta | page title | Divisions · Imperial Holdings Group | app.js:785; app.js:341,363,381,662,691,747 (+1) | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0147 | meta | meta description | Citizenship, Private Office, Partners Club, Academy and Real Estate: five specialist houses at one table, with one Relationship Manager across all five. | app.js:691 |  |
| C0148 | hero | span | Divisions | app.js:341,363,381,662,691,747 (+1) |  |
| C0149 | hero | eyebrow | Our divisions | app.js:341,628 |  |
| C0150 | hero | h1.d1 | Five houses. One table. | app.js:341 | written as separate lines in the source |
| C0151 | hero | lead paragraph | Each house is a specialist. Together they sit at one table, with one Relationship Manager across all five. | app.js:341 |  |
| C0152 | division index | a.drow > span | Citizenship | data.js:15,135,252 |  |
| C0153 | division index | a.drow > span | Second residency and citizenship by investment, from first conversation to completed application. | data.js:253 |  |
| C0154 | division index | a.drow > span | The flagship | data.js:252 |  |
| C0155 | division index | a.drow > span | Partners Club | data.js:16,272 |  |
| C0156 | division index | a.drow > span | The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | data.js:273 |  |
| C0157 | division index | a.drow > span | For professionals | data.js:272 |  |
| C0158 | division index | a.drow > span | Private Office | data.js:17,138,293,366 |  |
| C0159 | division index | a.drow > span | One lasting relationship for families with multi-country lives. | data.js:294 |  |
| C0160 | division index | a.drow > span | For existing Clients | data.js:293 |  |
| C0161 | division index | a.drow > span | Real Estate | data.js:18,313; app.js:381 |  |
| C0162 | division index | a.drow > span | Licensed property advisory, starting with Dubai. | data.js:314 |  |
| C0163 | division index | a.drow > span | Coming soon | data.js:313; app.js:313,356,381,646,654 |  |
| C0164 | division index | a.drow > span | Academy | data.js:19,329 |  |
| C0165 | division index | a.drow > span | Learning, training and certification for the people who do this work. | data.js:330 |  |
| C0166 | division index | a.drow > span | Learning and standards | data.js:329 |  |
| C0167 | finder | eyebrow | Not sure where to start? | app.js:543 |  |
| C0168 | finder | h2.d2 | Find your house. | app.js:1776,1790 | composed at run time; the fixed part is on this line |
| C0169 | finder | lead paragraph | Two questions, and we will show which divisions would sit at your table. A starting point, not advice. | app.js:543 |  |
| C0170 | finder | h3.h3 | Who is this for? | app.js:1650 |  |
| C0171 | finder | button > b | A family | data.js:405 |  |
| C0172 | finder | button > small | Planning where to live, study and settle | data.js:405 |  |
| C0173 | finder | button > b | A founder | data.js:406 |  |
| C0174 | finder | button > small | Building a business or a regional base | data.js:406 |  |
| C0175 | finder | button > b | An existing Imperial Client | data.js:407 |  |
| C0176 | finder | button > small | Looking for what comes next | data.js:407 |  |
| C0177 | finder | button > b | A lawyer, banker or adviser | data.js:408 |  |
| C0178 | finder | button > small | With Clients who ask about life abroad | data.js:408 |  |
| C0179 | finder | button > b | Interested in learning or a career | data.js:409 |  |
| C0180 | finder | button > small | Training, certification or joining us | data.js:409 |  |
| C0181 | finder | h3.h3 | What matters most? | app.js:1652 |  |
| C0182 | finder | span.fd-hint | Choose as many as you like | app.js:1652 |  |
| C0183 | finder | span.an | Live | data.js:214,447 |  |
| C0184 | finder | p | Where the family can live, travel, study and settle. | data.js:214 |  |
| C0185 | finder | span.an | Build | data.js:215,447 |  |
| C0186 | finder | p | A business, a career or a presence in a new market. | data.js:215 |  |
| C0187 | finder | span.an | Structure | data.js:216 |  |
| C0188 | finder | p | How assets, companies and the family are organised. | data.js:216 |  |
| C0189 | finder | span.an | Invest | data.js:217,447 |  |
| C0190 | finder | p | Property and opportunities that fit the plan. | data.js:217 |  |
| C0191 | finder | span.an | Protect | data.js:218,447 |  |
| C0192 | finder | p | Security for what you have built, and who you love. | data.js:218 |  |
| C0193 | finder | span.an | Experience | data.js:219 |  |
| C0194 | finder | p | The access and ease that come with a wider life. | data.js:219 |  |
| C0195 | finder | div aria-label | Your table | app.js:1655,1665,1668 |  |
| C0196 | finder | h3 | Your table | app.js:1655,1665,1668 |  |
| C0197 | finder | p | Choose who this is for, or what matters most, and we will show which houses would sit at your table. | app.js:1665 |  |
| C0198 | finder | note (p.xs) | A starting point, not advice. Your Relationship Manager confirms the right house in the first conversation. | app.js:1665 |  |
| C0199 | compare | eyebrow | At a glance | app.js:365,1724 |  |
| C0200 | compare | h2.d2 | Five houses, side by side. | app.js:1724 | written as separate lines in the source |
| C0201 | compare | lead paragraph | Who each house is for and what it covers. Whichever you start with, the same Relationship Manager brings in the others. | app.js:1724 |  |
| C0202 | compare | div aria-label | Divisions compared, scrolls sideways | app.js:1725 |  |
| C0203 | compare | caption.vh | The five Imperial houses compared | app.js:1725 | screen reader only |
| C0204 | compare | th > a | Citizenship | data.js:15,135,252 |  |
| C0205 | compare | th > span | The flagship | data.js:252 |  |
| C0206 | compare | th > a | Partners Club | data.js:16,272 |  |
| C0207 | compare | th > span | For professionals | data.js:272 |  |
| C0208 | compare | th > a | Private Office | data.js:17,138,293,366 |  |
| C0209 | compare | th > span | For existing Clients | data.js:293 |  |
| C0210 | compare | th > a | Real Estate | data.js:18,313; app.js:381 |  |
| C0211 | compare | th > span | Coming soon | data.js:313; app.js:313,356,381,646,654 |  |
| C0212 | compare | th > a | Academy | data.js:19,329 |  |
| C0213 | compare | th > span | Learning and standards | data.js:329 |  |
| C0214 | compare | th | For | app.js:365,1612,1726 |  |
| C0215 | compare | td | Families who want more choices for their children. | data.js:264 |  |
| C0216 | compare | td | Introducers who are often asked about life and investment abroad. | data.js:285 |  |
| C0217 | compare | td | Existing Imperial Clients and their families. | data.js:306 |  |
| C0218 | compare | td | Imperial Clients choosing a home in Dubai. | data.js:324 |  |
| C0219 | compare | td | Our own team, across every house. | data.js:341 |  |
| C0220 | compare | th | Covers | app.js:1727 |  |
| C0221 | compare | list item | Citizenship by investment | data.js:256 |  |
| C0222 | compare | list item | UAE and European residency | data.js:256 |  |
| C0223 | compare | list item | Global mobility strategy | data.js:256 |  |
| C0224 | compare | list item | Introducers | data.js:276 |  |
| C0225 | compare | list item | Advisers | data.js:276 |  |
| C0226 | compare | list item | Service-line Partners | data.js:276 |  |
| C0227 | compare | list item | Relocation and schools | data.js:297 |  |
| C0228 | compare | list item | Holding companies and structuring | data.js:297 |  |
| C0229 | compare | list item | Private banks and private equity | data.js:297,303 |  |
| C0230 | compare | list item | Dubai residential | data.js:317 |  |
| C0231 | compare | list item | Search and selection | data.js:317 |  |
| C0232 | compare | list item | Purchase support | data.js:317,321 |  |
| C0233 | compare | list item | Team training | data.js:333 |  |
| C0234 | compare | list item | Partner Academy | data.js:333,337 |  |
| C0235 | compare | list item | Certification | data.js:333 |  |
| C0236 | compare | th | How it starts | app.js:1728 |  |
| C0237 | compare | td | Listen: A first conversation about your family and your plans. No forms, no pressure. | data.js:266 | assembled at run time from values on this line |
| C0238 | compare | td | Introduce: Share your Client’s details, with their permission, through one simple form. | data.js:287 | assembled at run time from values on this line |
| C0239 | compare | td | Your contact: One named person who knows your family and your history with Imperial. | data.js:308 | assembled at run time from values on this line |
| C0240 | compare | td | Register interest ahead of launch. | app.js:1728 |  |
| C0241 | compare | td | Learn: The common Imperial core: standards, discretion and how the houses work together. | data.js:343 | assembled at run time from values on this line |
| C0242 | compare | th | Online | app.js:586,1729 |  |
| C0243 | compare | td > a | imperialcitizenship.com | data.js:15 |  |
| C0244 | compare | td > span | To confirm: Link to confirm | app.js:49 | amber placeholder; composed at run time; the fixed part is on this line |
| C0245 | compare | td > span | At launch | app.js:1729 |  |
| C0246 | compare | note (p.xs) | Swipe sideways to compare | app.js:1730 | aria-hidden (decorative) |
| C0247 | how we work | h2.d2 | Come for one thing. Find a whole house. | app.js:345 | written as separate lines in the source |
| C0248 | how we work | lead paragraph | One shared team works across every division. You never have to explain your family twice. | app.js:345 |  |
| C0249 | how we work | h3.h3 | One conversation | data.js:223; app.js:242 |  |
| C0250 | how we work | p | Tell us about your family and your plans once. No forms, no pressure, and no decision on the first call. | data.js:223 |  |
| C0251 | how we work | h3.h3 | The right house | data.js:224; app.js:243 |  |
| C0252 | how we work | p | Your Relationship Manager brings in each house, and qualified specialists, when they are needed. Never before. | data.js:224 |  |
| C0253 | how we work | h3.h3 | One person, for the long term | data.js:225; app.js:244 |  |
| C0254 | how we work | p | One named person stays with you after the paperwork is done: renewals, property, the next family member. | data.js:225 |  |
| C0255 | the houses online | eyebrow | The houses online | app.js:346 |  |
| C0256 | the houses online | h2.d2 | Visit a house directly. | app.js:346 | composed at run time; the fixed part is on this line |
| C0257 | the houses online | lead paragraph | Imperial Citizenship has its own website today. The others are in preparation; their links will be added before launch. | app.js:346 |  |
| C0258 | the houses online | a.site > b | Imperial Citizenship | data.js:15,252; app.js:1592 |  |
| C0259 | the houses online | a.site > span | imperialcitizenship.com | data.js:15 |  |
| C0260 | the houses online | a.site > b | Imperial Partners Club | data.js:16,272,559 |  |
| C0261 | the houses online | a.site > span | Website to confirm | data.js:16,17,18,19 |  |
| C0262 | the houses online | a.site > b | Imperial Private Office | data.js:17,293 |  |
| C0263 | the houses online | a.site > b | Imperial Academy | data.js:19,329 |  |
| C0264 | finder | eyebrow | Your table | app.js:1668 | result state (the empty state heading uses the same words); JavaScript only: not in the prerendered HTML |
| C0265 | finder | count (span.fd-count) | {n} of 5 houses | app.js:1668 | JavaScript only: not in the prerendered HTML |
| C0266 | finder | result label (span.fd-k) | Start here | app.js:1672 | first house; JavaScript only: not in the prerendered HTML |
| C0267 | finder | result label (span.fd-k) | Also at the table | app.js:1672 | second and third house; JavaScript only: not in the prerendered HTML |
| C0268 | finder | result label suffix | · Coming soon | app.js:1672 | appended for Real Estate; JavaScript only: not in the prerendered HTML |
| C0269 | finder | result reason (li) | Second residency and citizenship by investment, compared side by side. | data.js:420 | Citizenship, no ambition chosen; JavaScript only: not in the prerendered HTML |
| C0270 | finder | result reason (li) | Residency and citizenship routes for the whole family. | data.js:420 | Citizenship, Live; JavaScript only: not in the prerendered HTML |
| C0271 | finder | result reason (li) | UAE business set-up advisory and a regional base. | data.js:420 | Citizenship, Build; JavaScript only: not in the prerendered HTML |
| C0272 | finder | result reason (li) | A Global Mobility Strategy across several countries. | data.js:420 | Citizenship, Structure; JavaScript only: not in the prerendered HTML |
| C0273 | finder | result reason (li) | A second citizenship or residency as a lasting option. | data.js:420 | Citizenship, Protect; JavaScript only: not in the prerendered HTML |
| C0274 | finder | result reason (li) | Fewer visas to plan a life around. | data.js:420 | Citizenship, Experience; JavaScript only: not in the prerendered HTML |
| C0275 | finder | result reason (li) | One point of contact for a multi-country family. | data.js:421 | Private Office, no ambition chosen; JavaScript only: not in the prerendered HTML |
| C0276 | finder | result reason (li) | Relocation, and the right schools near the right home. | data.js:421 | Private Office, Live; JavaScript only: not in the prerendered HTML |
| C0277 | finder | result reason (li) | Holding companies and company formation. | data.js:421 | Private Office, Build; JavaScript only: not in the prerendered HTML |
| C0278 | finder | result reason (li) | Tax residency and structuring, with qualified specialists. | data.js:421 | Private Office, Structure; JavaScript only: not in the prerendered HTML |
| C0279 | finder | result reason (li) | Introductions to private banks and private equity. | data.js:421 | Private Office, Invest; JavaScript only: not in the prerendered HTML |
| C0280 | finder | result reason (li) | Structuring coordinated with tax and legal specialists. | data.js:421 | Private Office, Protect; JavaScript only: not in the prerendered HTML |
| C0281 | finder | result reason (li) | Events and introductions that come with a wider life. | data.js:421 | Private Office, Experience; JavaScript only: not in the prerendered HTML |
| C0282 | finder | result reason (li) | Introduce a Client with clear written terms. Your Client stays your Client. | data.js:422 | Partners Club; JavaScript only: not in the prerendered HTML |
| C0283 | finder | result reason (li) | Training and certification in one shared standard. | data.js:423 | Academy; JavaScript only: not in the prerendered HTML |
| C0284 | finder | result reason (li) | Licensed property advisory in Dubai, launching soon. | data.js:424 | Real Estate, no ambition chosen; JavaScript only: not in the prerendered HTML |
| C0285 | finder | result reason (li) | A family home in Dubai, near the right schools. | data.js:424 | Real Estate, Live; JavaScript only: not in the prerendered HTML |
| C0286 | finder | result reason (li) | Search, selection and purchase support in Dubai. | data.js:424 | Real Estate, Invest; JavaScript only: not in the prerendered HTML |
| C0287 | finder | button link (gold) | Start the conversation | app.js:1667 | links to /contact with the house and ambitions; "Register interest" when the first house is Real Estate; JavaScript only: not in the prerendered HTML |
| C0288 | finder | text button | Start over | app.js:1674 | JavaScript only: not in the prerendered HTML |
| C0289 | finder | note (p.xs) | A starting point, not advice. One Relationship Manager brings in each house when it is needed. | app.js:1675 | result state; JavaScript only: not in the prerendered HTML |

### /divisions/citizenship (Imperial Citizenship, 108 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, forms, hero, overview, what we do, who it is for, how it works, other houses, ecosystem, how we work.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0290 | meta | page title | Imperial Citizenship · Imperial Holdings Group | app.js:785; data.js:15,252; app.js:1592 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0291 | meta | meta description | Second residency and citizenship by investment, from first conversation to completed application. | data.js:253 |  |
| C0292 | hero | span | Citizenship | data.js:15,135,252 |  |
| C0293 | hero / cta band | span aria-label | Imperial Citizenship | data.js:15,252; app.js:1592 |  |
| C0294 | hero / cta band | span.wordmark | Imperial Citizenship | data.js:15,252; app.js:1592 |  |
| C0295 | hero | h1.d1 | Second residency and citizenship. | app.js:350 | written as separate lines in the source |
| C0296 | hero | lead paragraph | Second residency and citizenship by investment, from first conversation to completed application. | data.js:253 |  |
| C0297 | overview | statement paragraph | Imperial Citizenship is where the Group began, and it remains our main business. It advises families and founders on second residency and citizenship by investment, and carries each application from the first conversation to completion. | data.js:254 |  |
| C0298 | overview | dd | Imperial Citizenship | data.js:15,252; app.js:1592 |  |
| C0299 | overview | dd | The flagship | data.js:252 |  |
| C0300 | overview | dd | Families who want more choices for their children. | data.js:264 |  |
| C0301 | overview | dd > a | imperialcitizenship.com | data.js:15 |  |
| C0302 | overview / cta band | button link > span | Visit imperialcitizenship.com | data.js:269 |  |
| C0303 | what we do | h2.d2 | Residency and citizenship, compared side by side. | data.js:420; app.js:351 | written as separate lines in the source |
| C0304 | what we do | h3.h3 | Caribbean citizenship | data.js:258 |  |
| C0305 | what we do | p | Citizenship by investment, for example Saint Kitts and Nevis and Grenada. | data.js:258 |  |
| C0306 | what we do | placeholder chip | To confirm: Full programme list to confirm | app.js:49 | amber placeholder; composed at run time; the fixed part is on this line |
| C0307 | what we do | h3.h3 | UAE residency | data.js:259 |  |
| C0308 | what we do | p | Long-term residency routes, including property-linked options in Dubai, together with Imperial Real Estate. | data.js:259 |  |
| C0309 | what we do | h3.h3 | European residency | data.js:260 |  |
| C0310 | what we do | p | Residency routes in Europe. | data.js:260 |  |
| C0311 | what we do | placeholder chip | To confirm: Approved European programmes to confirm | app.js:49 | amber placeholder; composed at run time; the fixed part is on this line |
| C0312 | what we do | h3.h3 | Global Mobility Strategy | data.js:261 |  |
| C0313 | what we do | p | Advisory for families planning across several countries at once. | data.js:261 |  |
| C0314 | what we do | h3.h3 | UAE business set-up | data.js:262 |  |
| C0315 | what we do | p | Advisory for founders establishing a presence in the UAE. | data.js:262 |  |
| C0316 | who it is for | list item | Families who want more choices for their children. | data.js:264 |  |
| C0317 | who it is for | list item | Founders who need a regional base and a clear structure behind it. | data.js:264 |  |
| C0318 | who it is for | list item | Families who travel often and are tired of planning their lives around visas. | data.js:264 |  |
| C0319 | how it works | h2.d2 | Five steps, said plainly. | data.js:265 |  |
| C0320 | how it works | h3.h3 | Listen | data.js:266 |  |
| C0321 | how it works | p | A first conversation about your family and your plans. No forms, no pressure. | data.js:266 |  |
| C0322 | how it works | h3.h3 | Compare | data.js:266 |  |
| C0323 | how it works | p | Your options side by side: what each requires, costs and usually takes, in writing. | data.js:266 |  |
| C0324 | how it works | h3.h3 | Plan | data.js:266 |  |
| C0325 | how it works | p | One route, one timeline, one named person responsible for it. | data.js:266 |  |
| C0326 | how it works | h3.h3 | Apply | data.js:266 |  |
| C0327 | how it works | p | A complete, accurate application, with every specialist coordinated for you. | data.js:266 |  |
| C0328 | how it works | span.ix | STEP 05 | app.js:209 | STEP plus the number, from steps() |
| C0329 | how it works | h3.h3 | Stay | data.js:266 |  |
| C0330 | how it works | p | Renewals, property, the next family member. The relationship carries on. | data.js:266 |  |
| C0331 | how it works | eyebrow | Every plan includes | app.js:372 |  |
| C0332 | how it works | div | Eligibility review | data.js:267 |  |
| C0333 | how it works | div | Options in writing | data.js:267 |  |
| C0334 | how it works | div | Full cost schedule | data.js:267 |  |
| C0335 | how it works | div | Honest timeline | data.js:267 |  |
| C0336 | how it works | div | Document checklist | data.js:267 |  |
| C0337 | how it works | div | Application quality check | data.js:267 |  |
| C0338 | how it works | div | Specialists coordinated | data.js:267 |  |
| C0339 | how it works | div | Aftercare | data.js:267 |  |
| C0340 | how it works | div | Please note Final approval always rests with the relevant government. We tell you that at the start, and keep you informed at every stage. | app.js:374,384,390,391,392,393 (+21) | composed at run time; the fixed part is on this line |
| C0341 | fit check | eyebrow | Programme fit check | data.js:432 |  |
| C0342 | fit check | h2.d2 | Five questions. A clearer first conversation. | data.js:432 | written as separate lines in the source |
| C0343 | fit check | lead paragraph | Nothing here decides anything. Your answers simply prefill your enquiry, so the first conversation starts in the right place. | data.js:433 |  |
| C0344 | fit check | span.fit-n | Question 1 of 5 | app.js:1428,1442 | question counter in the fit check |
| C0345 | fit check | h3.h3 | Who would be included? | data.js:435 |  |
| C0346 | fit check | button > b | Just me | data.js:436 |  |
| C0347 | fit check | button > b | My partner and me | data.js:437 |  |
| C0348 | fit check | button > b | My family, including children | data.js:438 |  |
| C0349 | fit check | button > b | A client I am introducing | data.js:439; app.js:475 |  |
| C0350 | fit check | h3.h3 | Where do you live today? | data.js:441 |  |
| C0351 | fit check | button > b | In the United Arab Emirates | data.js:442 |  |
| C0352 | fit check | button > b | In Nigeria | data.js:443 |  |
| C0353 | fit check | button > b | Elsewhere in Africa | data.js:444 |  |
| C0354 | fit check | button > b | Elsewhere in the world | data.js:445 |  |
| C0355 | fit check | text button > span | Back | app.js:572,579,1432 |  |
| C0356 | fit check | h3.h3 | What matters most right now? | data.js:447 |  |
| C0357 | fit check | button > b | Live | data.js:214,447 |  |
| C0358 | fit check | button > small | Where the family can live, travel, study and settle. | data.js:214 |  |
| C0359 | fit check | button > b | Build | data.js:215,447 |  |
| C0360 | fit check | button > small | A business, a career or a presence in a new market. | data.js:215 |  |
| C0361 | fit check | button > b | Invest | data.js:217,447 |  |
| C0362 | fit check | button > small | Property and opportunities that fit the plan. | data.js:217 |  |
| C0363 | fit check | button > b | Protect | data.js:218,447 |  |
| C0364 | fit check | button > small | Security for what you have built, and who you love. | data.js:218 |  |
| C0365 | fit check | h3.h3 | When would you like to begin? | data.js:448; app.js:491 |  |
| C0366 | fit check | button > b | Within 3 months | app.js:476 |  |
| C0367 | fit check | button > b | 3 to 12 months | app.js:476 |  |
| C0368 | fit check | button > b | Just exploring for now | app.js:476 |  |
| C0369 | fit check | h3.h3 | Is there a budget in mind? | data.js:449 |  |
| C0370 | fit check | button > b | Under US$250,000 | app.js:479 |  |
| C0371 | fit check | button > b | US$250,000 to 500,000 | app.js:479 |  |
| C0372 | fit check | button > b | US$500,000 to 1 million | app.js:479 |  |
| C0373 | fit check | button > b | Over US$1 million | app.js:479 |  |
| C0374 | fit check | text button | I would rather not say yet | data.js:449; app.js:479 |  |
| C0375 | fit check | h3 | Thank you. | data.js:451 |  |
| C0376 | fit check | p | Your enquiry below has been prefilled from these answers. Add your name, your email and a few lines, and the right person will reply. | data.js:451 |  |
| C0377 | fit check | button link (gold) > span | Go to your enquiry | data.js:451 |  |
| C0378 | fit check | text button | Start over | app.js:1434,1674 |  |
| C0379 | guide | eyebrow | The guide | data.js:456 |  |
| C0380 | guide | h2.d2 | A short guide, before you decide. | data.js:456 | written as separate lines in the source |
| C0381 | guide | lead paragraph | The guide is being finalised. Leave your name and email and we will let you know when it is ready. | data.js:461 |  |
| C0382 | guide | note (p.small) | The Imperial guide to second residency and citizenship To confirm: Guide PDF to be written and approved | data.js:44 | written as separate lines in the source |
| C0383 | forms (guide) | eyebrow | Request the guide | app.js:1477 |  |
| C0384 | forms (guide) | consent text > span | I agree to Imperial Holdings Group contacting me about the guide, as described in the privacy notice. | app.js:1480 | composed at run time; the fixed part is on this line |
| C0385 | forms (guide) | button (gold) > span | Tell me when it is ready | data.js:462 |  |
| C0386 | forms (guide) | note (span.xs) | We use these details only for the guide, and to reply if you ask us to. | data.js:462 |  |
| C0387 | cta band | h2.d2 | Begin with Imperial Citizenship. | app.js:352 | written as separate lines in the source |
| C0388 | cta band | lead paragraph | Programmes, eligibility and the team behind them, on the Imperial Citizenship website. | app.js:376 | composed at run time; the fixed part is on this line |
| C0389 | forms (guide) | success message (p) | Thank you. The guide is being finalised, and we will let you know when it is ready. | data.js:464 | while config.guide.file is empty; followed by the "Guide PDF to be written and approved" placeholder; JavaScript only: not in the prerendered HTML |
| C0390 | forms (guide) | success message (p) | Your copy of the guide is ready below. One person will be in touch only if you would like a conversation. | data.js:463 | once a guide file is set; JavaScript only: not in the prerendered HTML |
| C0391 | forms (guide) | button link (gold) | Download the guide | app.js:1573 | once a guide file is set; JavaScript only: not in the prerendered HTML |
| C0392 | forms (guide) | button (gold) | Send me the guide | data.js:462 | once a guide file is set (today: "Tell me when it is ready"); JavaScript only: not in the prerendered HTML |
| C0393 | forms (guide) | consent text | I agree to Imperial Holdings Group sending me the guide and contacting me about it, as described in the privacy notice. | app.js:1480 | once a guide file is set; JavaScript only: not in the prerendered HTML |
| C0394 | fit check | progress label (span.fit-n) | Done | app.js:1446 | replaces "Question n of 5" at the end; JavaScript only: not in the prerendered HTML |
| C0395 | fit check | screen reader announcement | Thank you. Your enquiry has been prefilled from these answers. | app.js:1455 | JavaScript only: not in the prerendered HTML |
| C0396 | email | subject | Your guide request | netlify/functions/lib/email.js:35 | guide form; JavaScript only: not in the prerendered HTML |
| C0397 | email | opening | Thank you for requesting the guide. It is being finalised; one person at {Division name} will let you know when it is ready and will be your point of contact if you have questions. | netlify/functions/lib/email.js:37 | JavaScript only: not in the prerendered HTML |

### /divisions/partners-club (Imperial Partners Club, 48 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, forms, hero, overview, what we do, who it is for, how it works, other houses, ecosystem, how we work.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0398 | meta | page title | Imperial Partners Club · Imperial Holdings Group | app.js:785; data.js:16,272,559 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0399 | meta | meta description | The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | data.js:273 |  |
| C0400 | hero | span | Partners Club | data.js:16,272 |  |
| C0401 | hero | img alt text | Imperial Partners Club | data.js:16,272,559 |  |
| C0402 | hero | h1.d1 | Introduce with confidence. | data.js:422; app.js:350,352 | composed at run time; the fixed part is on this line |
| C0403 | hero | lead paragraph | The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | data.js:273 |  |
| C0404 | overview | statement paragraph | Imperial Partners Club is our Partner network across industries, from introducers to advisers to service-line Partners. Lawyers, bankers, wealth advisers and family offices are often the first people a Client asks about living or investing abroad. Partners Club is the house they can hand that conversation to. | data.js:274 |  |
| C0405 | overview | dd | Imperial Partners Club | data.js:16,272,559 |  |
| C0406 | overview | dd | For professionals | data.js:272 |  |
| C0407 | overview | dd | Introducers who are often asked about life and investment abroad. | data.js:285 |  |
| C0408 | overview | dd > span | To confirm: Imperial Partners Club website link | app.js:49 | amber placeholder; composed at run time; the fixed part is on this line |
| C0409 | overview / cta band | button link > span | Visit the Partners Club website | data.js:290 |  |
| C0410 | what we do | h2.d2 | Built for the people who introduce. | app.js:351 | written as separate lines in the source |
| C0411 | what we do | h3.h3 | Clear written terms | data.js:278 |  |
| C0412 | what we do | p | Your Partner Agreement sets out exactly how introductions work. | data.js:278 |  |
| C0413 | what we do | h3.h3 | Transparent reporting | data.js:279 |  |
| C0414 | what we do | p | See where each introduction stands, without having to chase. | data.js:279 |  |
| C0415 | what we do | h3.h3 | Training and certification | data.js:280 |  |
| C0416 | what we do | p | Imperial Academy helps your team explain the options accurately. | data.js:280 |  |
| C0417 | what we do | h3.h3 | Approved materials | data.js:281 |  |
| C0418 | what we do | p | Client-ready guides and wording, checked against an approved claims list. | data.js:281 |  |
| C0419 | what we do | h3.h3 | One named contact | data.js:282 |  |
| C0420 | what we do | p | A dedicated person for Partners, who knows your practice. | data.js:282 |  |
| C0421 | what we do | h3.h3 | The whole Group | data.js:283 |  |
| C0422 | what we do | p | Citizenship, residency, Dubai property and family planning, through one door. | data.js:283 |  |
| C0423 | who it is for | list item | Introducers who are often asked about life and investment abroad. | data.js:285 |  |
| C0424 | who it is for | list item | Advisers: lawyers, private bankers, wealth advisers and family offices. | data.js:285 |  |
| C0425 | who it is for | list item | Service-line Partners who deliver specialist work for Imperial Clients. | data.js:285 |  |
| C0426 | how it works | h2.d2 | Four steps. No surprises. | data.js:286 |  |
| C0427 | how it works | h3.h3 | Introduce | data.js:287 |  |
| C0428 | how it works | p | Share your Client’s details, with their permission, through one simple form. | data.js:287 |  |
| C0429 | how it works | h3.h3 | We advise | data.js:287 |  |
| C0430 | how it works | p | A Relationship Manager meets your Client and explains their options plainly. | data.js:287 |  |
| C0431 | how it works | h3.h3 | You stay informed | data.js:287 |  |
| C0432 | how it works | p | Clear updates on each introduction, at every stage. | data.js:287 |  |
| C0433 | how it works | h3.h3 | Outcome | data.js:287 |  |
| C0434 | how it works | p | Terms are honoured exactly as set out in your written agreement. | data.js:287 |  |
| C0435 | how it works | eyebrow | Shared standards | data.js:379; app.js:373 |  |
| C0436 | how it works | h3.d3 | Your reputation travels with ours. | data.js:380; app.js:373 |  |
| C0437 | how it works | list item > span | Partners do not act or sign on the Group’s behalf. | data.js:288 |  |
| C0438 | how it works | list item > span | We never guarantee citizenship, visa, residency, investment or tax outcomes. | data.js:288 |  |
| C0439 | how it works | list item > span | We claim no influence with, or shortcuts through, any government. | data.js:288 |  |
| C0440 | how it works | list item > span | Client information is shared only with consent, and only where a service needs it. | data.js:288 |  |
| C0441 | how it works | list item > span | Every Client-facing document is checked against an approved claims list. | data.js:288 |  |
| C0442 | how it works | list item > span | Regulated advice is given only by qualified specialists. | data.js:288 |  |
| C0443 | how it works | div | Please note Your reputation travels with ours. Every Partner agrees to these standards, and so do we. | app.js:374,384,390,391,392,393 (+21) | composed at run time; the fixed part is on this line |
| C0444 | cta band | h2.d2 | Introduce with confidence. | data.js:422; app.js:350,352 | composed at run time; the fixed part is on this line |
| C0445 | cta band | lead paragraph | The Imperial Partners Club website is in preparation. In the meantime, speak to us and we will connect you. | data.js:44,60 | composed at run time; the fixed part is on this line |

### /divisions/private-office (Imperial Private Office, 39 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, forms, hero, overview, what we do, who it is for, how it works, other houses, ecosystem, how we work.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0446 | meta | page title | Imperial Private Office · Imperial Holdings Group | app.js:785; data.js:17,293 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0447 | meta | meta description | One lasting relationship for families with multi-country lives. | data.js:294 |  |
| C0448 | hero | img alt text | Imperial Private Office | data.js:17,293 |  |
| C0449 | hero | h1.d1 | One lasting relationship. | data.js:294 | composed at run time; the fixed part is on this line |
| C0450 | hero | lead paragraph | One lasting relationship for families with multi-country lives. | data.js:294 |  |
| C0451 | overview | statement paragraph | Imperial Private Office looks after Imperial Clients once their first service is complete. It is a single point of contact for the wider needs of a multi-country family, delivered through trusted Partners and qualified specialists. | data.js:295 |  |
| C0452 | overview | dd | Imperial Private Office | data.js:17,293 |  |
| C0453 | overview | dd | For existing Clients | data.js:293 |  |
| C0454 | overview | dd | Existing Imperial Clients and their families. | data.js:306 |  |
| C0455 | overview | dd > span | To confirm: Imperial Private Office website link | app.js:49 | amber placeholder; composed at run time; the fixed part is on this line |
| C0456 | overview / cta band | button link > span | Visit the Private Office website | data.js:310 |  |
| C0457 | what we do | h2.d2 | Everything a wider life needs. | app.js:351 | written as separate lines in the source |
| C0458 | what we do | h3.h3 | Relocation | data.js:299 |  |
| C0459 | what we do | p | Moving the household, and settling in well, wherever the family chooses to live. | data.js:299 |  |
| C0460 | what we do | h3.h3 | Schools | data.js:300 |  |
| C0461 | what we do | p | Finding the right schools for the children, near the right home. | data.js:300 |  |
| C0462 | what we do | h3.h3 | Holding companies | data.js:301 |  |
| C0463 | what we do | p | Company formation and the structure behind a family’s interests. | data.js:301 |  |
| C0464 | what we do | h3.h3 | Tax residency and structuring | data.js:302 |  |
| C0465 | what we do | p | Coordinated with qualified tax and legal specialists. | data.js:302 |  |
| C0466 | what we do | h3.h3 | Private banks and private equity | data.js:297,303 |  |
| C0467 | what we do | p | Introductions to the institutions that fit the plan. | data.js:303 |  |
| C0468 | what we do | h3.h3 | Events and introductions | data.js:304 |  |
| C0469 | what we do | p | Access to the people and occasions that come with a wider life. | data.js:304 |  |
| C0470 | who it is for | list item | Existing Imperial Clients and their families. | data.js:306 |  |
| C0471 | who it is for | list item | Completed Imperial Citizenship Clients, who may be invited to join. | data.js:306 |  |
| C0472 | who it is for | list item | Families whose lives, assets and businesses span several countries. | data.js:306 |  |
| C0473 | how it works | h2.d2 | One point of contact. Many specialists. | data.js:307 |  |
| C0474 | how it works | h3.h3 | Your contact | data.js:308 |  |
| C0475 | how it works | p | One named person who knows your family and your history with Imperial. | data.js:308 |  |
| C0476 | how it works | h3.h3 | Your request | data.js:308 |  |
| C0477 | how it works | p | Tell us what you need. We record it properly and find the right specialist. | data.js:308 |  |
| C0478 | how it works | h3.h3 | Delivered through Partners | data.js:308 |  |
| C0479 | how it works | p | Trusted Partners and qualified specialists carry out the work. | data.js:308 |  |
| C0480 | how it works | h3.h3 | Followed through | data.js:308 |  |
| C0481 | how it works | p | We stay with it until it is done, and note what comes next. | data.js:308 |  |
| C0482 | how it works | div | Please note Advice on regulated matters such as tax, legal or investment is provided only by appropriately qualified specialists. | app.js:374,384,390,391,392,393 (+21) | composed at run time; the fixed part is on this line |
| C0483 | cta band | h2.d2 | Continue with Private Office. | app.js:352 | written as separate lines in the source |
| C0484 | cta band | lead paragraph | The Imperial Private Office website is in preparation. In the meantime, speak to us and we will connect you. | data.js:44,60 | composed at run time; the fixed part is on this line |

### /divisions/real-estate (Imperial Real Estate, 35 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, forms, hero, overview, other houses, ecosystem.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0485 | meta | page title | Imperial Real Estate · Imperial Holdings Group | app.js:785; data.js:18,313; app.js:381 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0486 | meta | meta description | Licensed property advisory, starting with Dubai. | data.js:314 |  |
| C0487 | hero | span | Real Estate | data.js:18,313; app.js:381 |  |
| C0488 | hero | img alt text | Imperial Real Estate | data.js:18,313; app.js:381 |  |
| C0489 | hero | h1.d1 | Licensed property advisory, starting with Dubai. | data.js:314 |  |
| C0490 | hero | lead paragraph | Imperial Real Estate is licensed and has not yet launched. Register your interest and we will be in touch when it opens. | app.js:381 |  |
| C0491 | hero | button link > span | Register interest | data.js:560; app.js:220,381,389,396,1667 |  |
| C0492 | overview | statement paragraph | Imperial Real Estate will offer licensed property advisory, starting with Dubai: search, selection and purchase support, through to handover. It will work alongside Imperial Citizenship where property and residency meet. | data.js:315 |  |
| C0493 | overview | h2.vh | What Imperial Real Estate will do | app.js:383 | screen reader only |
| C0494 | overview | h3.h3 | Search | data.js:319 |  |
| C0495 | overview | p | A considered search for the right home, near the right schools. | data.js:319 |  |
| C0496 | overview | h3.h3 | Selection | data.js:320 |  |
| C0497 | overview | p | A clear comparison of the options that fit the plan. | data.js:320 |  |
| C0498 | overview | h3.h3 | Purchase support | data.js:317,321 |  |
| C0499 | overview | p | Support through the purchase, through to handover. | data.js:321 |  |
| C0500 | overview | h3.h3 | Property and residency | data.js:322 |  |
| C0501 | overview | p | Coordinated with Imperial Citizenship where a property links to UAE residency. | data.js:322 |  |
| C0502 | overview | div | Please note Imperial Real Estate is licensed and has not yet launched. Licence details will be published at launch. To confirm: Licence number and regulator | app.js:384 | written as separate lines in the source |
| C0503 | forms (interest) | eyebrow | Register interest | data.js:560; app.js:220,381,389,396,1667 |  |
| C0504 | forms (interest) | h2.d3 | Be first to hear. | app.js:389 |  |
| C0505 | forms (interest) | note (p.small) | Tell us a little about what you are looking for. We will contact you when Imperial Real Estate launches. | app.js:389 |  |
| C0506 | forms (interest) | form label | I am interested in | app.js:393 |  |
| C0507 | forms (interest) | option (select interest) | A family home in Dubai | app.js:393 |  |
| C0508 | forms (interest) | option (select interest) | Property linked to UAE residency | app.js:393 |  |
| C0509 | forms (interest) | option (select interest) | An investment property | app.js:393 |  |
| C0510 | forms (interest) | option (select interest) | Not sure yet | app.js:393 |  |
| C0511 | forms (interest) | error message | Please choose an option. | app.js:393 |  |
| C0512 | forms (interest) | form label | Anything else (optional) | app.js:394 |  |
| C0513 | forms (interest) | consent text > span | I agree to Imperial Holdings Group contacting me about Imperial Real Estate, as described in the privacy notice. | app.js:395 | composed at run time; the fixed part is on this line |
| C0514 | forms (interest) | button > span | Register interest | data.js:560; app.js:220,381,389,396,1667 |  |
| C0515 | forms (interest) | note (span.xs) | We use these details only to contact you about Imperial Real Estate. | app.js:396 |  |
| C0516 | forms (interest) | success message (p) | Your interest in Imperial Real Estate is noted. We will be in touch when it launches. | app.js:1575 | JavaScript only: not in the prerendered HTML |
| C0517 | email | subject | Your interest in {Division name} | netlify/functions/lib/email.js:35 | register interest; JavaScript only: not in the prerendered HTML |
| C0518 | email | opening | Thank you for registering your interest in {Division name}. It has not launched yet; we will write to you when it opens. | netlify/functions/lib/email.js:39 | JavaScript only: not in the prerendered HTML |
| C0519 | email | next step | If you would like to talk sooner, reply to this email or call the office. | netlify/functions/lib/email.js:42 | register interest; JavaScript only: not in the prerendered HTML |

### /divisions/academy (Imperial Academy, 40 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, forms, hero, overview, what we do, who it is for, how it works, other houses, ecosystem, how we work.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0520 | meta | page title | Imperial Academy · Imperial Holdings Group | app.js:785; data.js:19,329 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0521 | meta | meta description | Learning, training and certification for the people who do this work. | data.js:330 |  |
| C0522 | hero | span | Academy | data.js:19,329 |  |
| C0523 | hero | img alt text | Imperial Academy | data.js:19,329 |  |
| C0524 | hero | h1.d1 | One standard, learned by everyone. | app.js:350 | written as separate lines in the source |
| C0525 | hero | lead paragraph | Learning, training and certification for the people who do this work. | data.js:330 |  |
| C0526 | overview | statement paragraph | Imperial Academy is the Group’s learning and education arm. It trains and certifies our own people in one shared standard, and helps Partner teams explain the options accurately. Courses for a wider audience will follow later. | data.js:331 |  |
| C0527 | overview | dd | Imperial Academy | data.js:19,329 |  |
| C0528 | overview | dd | Learning and standards | data.js:329 |  |
| C0529 | overview | dd | Our own team, across every house. | data.js:341 |  |
| C0530 | overview | dd > span | To confirm: Imperial Academy website link | app.js:49 | amber placeholder; composed at run time; the fixed part is on this line |
| C0531 | overview / cta band | button link > span | Visit the Academy website | data.js:345 |  |
| C0532 | what we do | h2.d2 | What the Academy does. | app.js:351 | written as separate lines in the source |
| C0533 | what we do | h3.h3 | One shared standard | data.js:335 |  |
| C0534 | what we do | p | Every role learns the same institution before specialising: how we work, how we protect Client and Partner trust, and how we keep information private. | data.js:335 |  |
| C0535 | what we do | h3.h3 | Role certification | data.js:336 |  |
| C0536 | what we do | p | People are certified as ready before they take on greater responsibility. | data.js:336 |  |
| C0537 | what we do | h3.h3 | Partner Academy | data.js:333,337 |  |
| C0538 | what we do | p | Training that helps Partner teams explain the options accurately and use approved materials. | data.js:337 |  |
| C0539 | what we do | h3.h3 | Future talent | data.js:338 |  |
| C0540 | what we do | p | A route into the Group for high-potential people, selected on ability and character. | data.js:338 |  |
| C0541 | what we do | placeholder chip | To confirm: Programme details and launch timing to confirm | app.js:49 | amber placeholder; composed at run time; the fixed part is on this line |
| C0542 | what we do | h3.h3 | Wider courses | data.js:339 |  |
| C0543 | what we do | p | Learning for selected external audiences, later. | data.js:339 |  |
| C0544 | what we do | placeholder chip | To confirm: Scope and timing to confirm | app.js:49 | amber placeholder; composed at run time; the fixed part is on this line |
| C0545 | who it is for | list item | Our own team, across every house. | data.js:341 |  |
| C0546 | who it is for | list item | Imperial Partners and their teams. | data.js:341 |  |
| C0547 | who it is for | list item | In time, candidates and selected external learners. | data.js:341 |  |
| C0548 | how it works | h2.d2 | Learn the house. Then specialise. | data.js:342 |  |
| C0549 | how it works | h3.h3 | Learn | data.js:343 |  |
| C0550 | how it works | p | The common Imperial core: standards, discretion and how the houses work together. | data.js:343 |  |
| C0551 | how it works | h3.h3 | Practise | data.js:343 |  |
| C0552 | how it works | p | Realistic cases, not only multiple-choice tests. | data.js:343 |  |
| C0553 | how it works | h3.h3 | Certify | data.js:343 |  |
| C0554 | how it works | p | Readiness is demonstrated before responsibility is given. | data.js:343 |  |
| C0555 | how it works | h3.h3 | Grow | data.js:343 |  |
| C0556 | how it works | p | Development continues as people take on more. | data.js:343 |  |
| C0557 | how it works | div | Please note Academy certification is internal to Imperial. It is not a replacement for professional licensing. | app.js:374,384,390,391,392,393 (+21) | composed at run time; the fixed part is on this line |
| C0558 | cta band | h2.d2 | Learn the Imperial standard. | app.js:352 | written as separate lines in the source |
| C0559 | cta band | lead paragraph | The Imperial Academy website is in preparation. In the meantime, speak to us and we will connect you. | data.js:44,60 | composed at run time; the fixed part is on this line |

### /journal (Events and Journal, 14 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, closing, events, journal, how we work.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0560 | meta | page title | Events and Journal · Imperial Holdings Group | app.js:785; app.js:663,693,695,1772 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0561 | meta | meta description | Genuine company developments, insights, partnerships and selected Imperial events in Dubai and Lagos. | app.js:693 |  |
| C0562 | hero | span | Journal | app.js:304,436,440,451,656,749 (+1); index.html:49 |  |
| C0563 | hero | eyebrow | Events & Journal | app.js:436 |  |
| C0564 | hero | h1.d1 | Selected events. Selected words. | app.js:436 | written as separate lines in the source |
| C0565 | hero | lead paragraph | Genuine company developments, insights, partnerships and selected gatherings. Fewer entries, chosen with care. | app.js:436 |  |
| C0566 | events | h2.d2 | Where the network meets. | app.js:437 | written as separate lines in the source |
| C0567 | events | lead paragraph | Diplomatic collaborations, private gatherings and partnerships, in Dubai and Lagos. Galleries open as guests confirm they are happy to be featured. | app.js:437 | composed at run time; the fixed part is on this line |
| C0568 | events | note (p.xs) | Photographs of guests appear once they have confirmed they are happy to be featured. | app.js:439 |  |
| C0569 | journal | lead paragraph | Company developments, selected insights and partnerships. | app.js:440 |  |
| C0570 | journal | div.meta | Company developments | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C0571 | journal | h3 | Imperial Real Estate is licensed and preparing to launch | data.js:185 |  |
| C0572 | journal | p | The Group’s fifth division will offer licensed property advisory, starting with Dubai. Interest can be registered now. | data.js:185 |  |
| C0573 | events | lead paragraph (variant) | Diplomatic collaborations, private gatherings and partnerships, in Dubai and Lagos. One cover photograph for each, and a gallery inside. | app.js:437 | once every event has consent; JavaScript only: not in the prerendered HTML |

### /journal/events/grenada-51-dubai (Event: Grenada 51st, Dubai, 26 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, closing, events, how we work, event, gallery, related, pagination.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0574 | meta | page title | Grenada’s 51st Independence Day After Party · Imperial | app.js:785; data.js:154 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0575 | meta | meta description | Imperial Citizenship sponsored the after party for Grenada’s 51st Independence Day. | data.js:156,157 | composed at run time; the fixed part is on this line |
| C0576 | hero | span | Grenada 51st, Dubai | data.js:154 |  |
| C0577 | hero | eyebrow | Diplomatic · Dubai · 19 February 2025 | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C0578 | hero | h1.d1 | Grenada’s 51st Independence Day After Party | data.js:154 |  |
| C0579 | hero | lead paragraph | Imperial Citizenship sponsored the after party for Grenada’s 51st Independence Day, following the official celebrations hosted by IMA Grenada and the Consulate General of Grenada in Dubai. | data.js:156 |  |
| C0580 | event | lead paragraph | Imperial Citizenship sponsored the after party for Grenada’s 51st Independence Day in Dubai on 19 February 2025, held at Agora Cocktail Bar and Social Club at The Dubai EDITION, Downtown Dubai. | data.js:157 |  |
| C0581 | event | lead paragraph | The evening followed the official celebrations at the Marriott Resort Palm Jumeirah, hosted by IMA Grenada and the Consulate General of Grenada in Dubai. | data.js:157 |  |
| C0582 | event | eyebrow | Among the guests | app.js:453 |  |
| C0583 | event | list item | H.E. Ziya Rahaman, Consul General of Grenada to the UAE | data.js:158 |  |
| C0584 | event | list item | Hon. Dennis Cornwall, Minister of Finance, Grenada | data.js:158 |  |
| C0585 | event | list item | H.E. Justin Kareem Hawley, Ambassador of St Kitts and Nevis to the UAE | data.js:158 |  |
| C0586 | event | list item | Mr Thomas Anthony, CEO, IMA Grenada | data.js:158 |  |
| C0587 | event | list item | H.E. Murillo Fallas | data.js:158 |  |
| C0588 | event | list item | H.E. James Harris | data.js:158 |  |
| C0589 | event | list item | H.E. Andrew Tsepo Lebona | data.js:158 |  |
| C0590 | event | list item | Mr Zaid Al Hindi, Founder and Group CEO, Imperial Holdings Group | data.js:158 |  |
| C0591 | event | note (p.xs) | Source: Press release, 19 February 2025 (Marketing Team SharePoint) | app.js:455 | composed at run time; the fixed part is on this line |
| C0592 | event | dd | 19 February 2025 | data.js:154,184 |  |
| C0593 | event | dd | Agora Cocktail Bar & Social Club, The Dubai EDITION, Downtown Dubai, Dubai | data.js:154 | assembled at run time from values on this line |
| C0594 | gallery | img alt text | Highlights: Grenada 51st after party, Dubai (poster) | data.js:155 | composed at run time; the fixed part is on this line |
| C0595 | gallery | figure caption | Highlights: Grenada 51st after party, Dubai · Captions | data.js:155 | composed at run time; the fixed part is on this line |
| C0596 | gallery | img alt text (gallery, consent pending) | Two guests with a glass raised at the Grenada 51st after party, Dubai | data.js:78 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0597 | gallery | img alt text (gallery, consent pending) | A guest in a dark suit at the Grenada flag photo wall | data.js:79 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0598 | gallery | img alt text (gallery, consent pending) | A guest arriving through the bar entrance at the Dubai EDITION | data.js:80 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0599 | gallery | img alt text (gallery, consent pending) | A guest at the Grenada flag photo wall, Dubai | data.js:81 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |

### /journal/events/lagos-diplomatic-soiree-2025 (Event: Lagos Diplomatic Soirée 2025, 18 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, closing, events, how we work, event, gallery, related, pagination.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0600 | meta | page title | The Lagos Diplomatic Soirée 2025 · Imperial Holdings Group | app.js:785; data.js:160,187 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0601 | meta | meta description | An evening in Lagos bringing together members of the diplomatic community, clients and friends of Imperial. | data.js:162 |  |
| C0602 | hero | img alt text | Lagos skyline and bridge at sunset | data.js:100 |  |
| C0603 | hero | span | Diplomatic Soirée, Lagos | data.js:160 |  |
| C0604 | hero | eyebrow | Diplomatic · Lagos · 2025 | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C0605 | hero | h1.d1 | The Lagos Diplomatic Soirée 2025 | data.js:160,187 |  |
| C0606 | hero | lead paragraph | An evening in Lagos bringing together members of the diplomatic community, clients and friends of Imperial. | data.js:162 |  |
| C0607 | event | lead paragraph | The Lagos Diplomatic Soirée brought together members of the diplomatic community, clients, partners and friends of Imperial for an evening in Lagos. | data.js:163 |  |
| C0608 | event | note (p.xs) | To confirm: Exact date To confirm: Venue To confirm: Guests of honour | app.js:49 | composed at run time; the fixed part is on this line |
| C0609 | gallery | img alt text | Highlights: The Lagos Diplomatic Soirée 2025 (poster) | data.js:161 | composed at run time; the fixed part is on this line |
| C0610 | gallery | figure caption | Highlights: The Lagos Diplomatic Soirée 2025 · Captions | data.js:161 | composed at run time; the fixed part is on this line |
| C0611 | gallery | img alt text (gallery, consent pending) | A guest in a long black dress at the Lagos Diplomatic Soirée 2025 | data.js:82 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0612 | gallery | img alt text (gallery, consent pending) | Guests standing together for a group photograph at the Soirée | data.js:83 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0613 | gallery | img alt text (gallery, consent pending) | A guest in a long black dress by the mirrored wall at the Soirée | data.js:84 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0614 | gallery | img alt text (gallery, consent pending) | Five guests together at the Lagos Diplomatic Soirée 2025 | data.js:85 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0615 | gallery | img alt text (gallery, consent pending) | A guest in a grey jacket at the Soirée | data.js:86 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0616 | gallery | img alt text (gallery, consent pending) | A guest in a grey jacket beside the mirrored wall at the Soirée | data.js:87 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0617 | gallery | img alt text (gallery, consent pending) | A guest at the Lagos Diplomatic Soirée 2025 | data.js:94 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |

### /journal/events/gala-dinner-lagos (Event: gala dinner, Lagos, 13 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, closing, events, how we work, event, gallery, related, pagination.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0618 | meta | page title | Gala Dinner, Lagos · Imperial Holdings Group | app.js:785; data.js:164 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0619 | meta | meta description | A gala dinner hosted by Imperial Citizenship in Lagos, with guests from across the Caribbean citizenship community. | data.js:165 |  |
| C0620 | hero | span | Gala Dinner, Lagos | data.js:164 |  |
| C0621 | hero | h1.d1 | Gala Dinner, Lagos | data.js:164 |  |
| C0622 | hero | lead paragraph | A gala dinner hosted by Imperial Citizenship in Lagos, with guests from across the Caribbean citizenship community. | data.js:165 |  |
| C0623 | event | lead paragraph | Imperial Citizenship hosted a gala dinner in Lagos for clients, partners and guests from the Caribbean citizenship community. | data.js:166 |  |
| C0624 | event | note (p.xs) | To confirm: Date To confirm: Venue To confirm: Speakers and guests of honour | app.js:49 | composed at run time; the fixed part is on this line |
| C0625 | gallery | img alt text (gallery, consent pending) | A speaker at the lectern at the gala dinner, Lagos | data.js:70 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0626 | gallery | img alt text (gallery, consent pending) | Two guests at the photo wall at the gala dinner | data.js:71 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0627 | gallery | img alt text (gallery, consent pending) | Two guests holding an award at the photo wall | data.js:72 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0628 | gallery | img alt text (gallery, consent pending) | Two guests in front of the sponsors backdrop at the gala dinner | data.js:73 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0629 | gallery | img alt text (gallery, consent pending) | Guests in conversation in the ballroom at the gala dinner | data.js:74 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0630 | gallery | img alt text (gallery, consent pending) | A guest in a green dinner jacket at his table | data.js:75 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |

### /journal/events/easter-polo-cup-2026 (Event: Easter Polo Cup 2026, 17 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, closing, events, how we work, event, gallery, related, pagination.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0631 | meta | page title | Easter Polo Cup After Party · Imperial Holdings Group | app.js:785; data.js:167 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0632 | meta | meta description | Imperial Citizenship and Lagos Polo Club: an exclusive Easter Polo Cup after party at Lagos Polo Club, Ikoyi. | data.js:169 |  |
| C0633 | hero | span | Easter Polo Cup, Lagos | data.js:167 |  |
| C0634 | hero | eyebrow | Partnership · Lagos · Easter 2026 | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C0635 | hero | h1.d1 | Easter Polo Cup After Party | data.js:167 |  |
| C0636 | hero | lead paragraph | Imperial Citizenship and Lagos Polo Club: an exclusive Easter Polo Cup after party at Lagos Polo Club, Ikoyi. | data.js:169 |  |
| C0637 | event | lead paragraph | Imperial Citizenship partnered with Lagos Polo Club for an exclusive after party following the Easter Polo Cup at Lagos Polo Club, Ikoyi. | data.js:170 |  |
| C0638 | event | note (p.xs) | To confirm: Exact date | app.js:49 | composed at run time; the fixed part is on this line |
| C0639 | event | dd | Easter 2026 | data.js:167,186 |  |
| C0640 | event | dd | Lagos Polo Club, Ikoyi, Lagos | data.js:58,167,169,170,186 | assembled at run time from values on this line |
| C0641 | event | dd | Partnership | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C0642 | gallery | img alt text | Highlights: Easter Polo Cup after party, Lagos (poster) | data.js:168 | composed at run time; the fixed part is on this line |
| C0643 | gallery | figure caption | Highlights: Easter Polo Cup after party, Lagos · Captions | data.js:168 | composed at run time; the fixed part is on this line |
| C0644 | gallery | img alt text (gallery, consent pending) | Two polo players on horseback at Lagos Polo Club | data.js:76 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0645 | gallery | img alt text (gallery, consent pending) | Guests in conversation on the terrace at the after party | data.js:77 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0646 | gallery | img alt text (gallery, consent pending) | The Easter Polo Cup after party banner, Lagos Polo Club | data.js:59 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0647 | gallery | img alt text (gallery, consent pending) | The Imperial Citizenship backdrop at the Easter Polo Cup after party | data.js:60 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |

### /journal/events/lagos-office-event (Event: Lagos office evening, 14 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, closing, events, how we work, event, gallery, related, pagination.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0648 | meta | page title | An Evening at the Lagos Office · Imperial Holdings Group | app.js:785; data.js:171 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0649 | meta | meta description | Clients, partners and friends of Imperial at the Lagos office on Aromire Road, Ikoyi. | data.js:172 |  |
| C0650 | hero | span | Lagos office evening | data.js:171 |  |
| C0651 | hero | h1.d1 | An Evening at the Lagos Office | data.js:171 |  |
| C0652 | hero | lead paragraph | Clients, partners and friends of Imperial at the Lagos office on Aromire Road, Ikoyi. | data.js:172 |  |
| C0653 | event | lead paragraph | Imperial welcomed clients, partners and friends to an evening at the Lagos office on Aromire Road, Ikoyi. | data.js:173 |  |
| C0654 | event | dd | 8 Aromire Road, Ikoyi, Lagos | data.js:193 |  |
| C0655 | gallery | img alt text (gallery, consent pending) | Five guests at the Imperial Citizenship photo wall at the Lagos office | data.js:64 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0656 | gallery | img alt text (gallery, consent pending) | Guests at the photo wall at the Lagos office | data.js:65 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0657 | gallery | img alt text (gallery, consent pending) | Three guests laughing together at the photo wall | data.js:66 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0658 | gallery | img alt text (gallery, consent pending) | Five guests side by side at the photo wall at the Lagos office | data.js:67 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0659 | gallery | img alt text (gallery, consent pending) | Two guests seated in the lounge at the Lagos office | data.js:68 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0660 | gallery | img alt text (gallery, consent pending) | A guest seated on the sofa in the lounge at the Lagos office | data.js:69 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0661 | gallery | img alt text (gallery, consent pending) | Guests seated round a table outdoors at night at the Lagos office event | data.js:61 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |

### /journal/events/delborough-dinner (Event: Delborough dinner, 13 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, closing, other houses, events, how we work, event, gallery, related, pagination.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0662 | meta | page title | A Private Dinner at DANI, The Delborough · Imperial | app.js:785; data.js:174 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0663 | meta | meta description | A private dinner for clients and friends of Imperial at DANI, The Delborough Hotel, Lagos. | data.js:175 |  |
| C0664 | hero | span | Private dinner, Lagos | data.js:174 |  |
| C0665 | hero | h1.d1 | A Private Dinner at DANI, The Delborough | data.js:174 |  |
| C0666 | hero | lead paragraph | A private dinner for clients and friends of Imperial at DANI, The Delborough Hotel, Lagos. | data.js:175 |  |
| C0667 | event | lead paragraph | Imperial hosted a private dinner for clients and friends at DANI, The Delborough Hotel, Lagos. | data.js:176 |  |
| C0668 | event | dd | DANI, The Delborough Hotel, Lagos | data.js:175,176 |  |
| C0669 | gallery | img alt text (gallery, consent pending) | A guest seated at the dinner table at DANI, The Delborough Hotel | data.js:88 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0670 | gallery | img alt text (gallery, consent pending) | The band playing as guests arrive at DANI, The Delborough Hotel | data.js:89 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0671 | gallery | img alt text (gallery, consent pending) | Six guests standing together for a photograph at the dinner | data.js:90 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0672 | gallery | img alt text (gallery, consent pending) | Guests greeting one another at the dinner | data.js:91 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0673 | gallery | img alt text (gallery, consent pending) | A guest in a blue suit talking with guests at their table | data.js:92 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |
| C0674 | gallery | img alt text (gallery, consent pending) | A guest seated at the dinner table, flowers behind him | data.js:93 | gallery photograph held back until guest consent is recorded; the alt text shows once it is |

### /insights (Insights, 29 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, closing, other houses, how we work, insights list.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0675 | meta | page title | Insights · Imperial Holdings Group | app.js:785; app.js:402,411,696,763,766,1773 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0676 | meta | meta description | Plain-spoken guidance on mobility, family planning and working with Imperial. | app.js:402,696 |  |
| C0677 | hero | span | Insights | app.js:402,411,696,763,766,1773 |  |
| C0678 | hero | eyebrow | Insights | app.js:402,411,696,763,766,1773 |  |
| C0679 | hero | h1.d1 | Notes from the house. | app.js:402 | written as separate lines in the source |
| C0680 | hero | lead paragraph | Plain-spoken guidance on mobility, family planning and working with Imperial. | app.js:402,696 |  |
| C0681 | insights list | div | Draft, awaiting approval. These articles are drafts and will be published once the copy has been approved. | app.js:403 |  |
| C0682 | insights list | div aria-label | Filter insights | app.js:404 |  |
| C0683 | insights list | button | All | app.js:400,401,404,405,1086,1091 |  |
| C0684 | insights list | button | Mobility | data.js:354 |  |
| C0685 | insights list | button | Private Office | data.js:17,138,293,366 |  |
| C0686 | insights list | button | Partners | data.js:374 |  |
| C0687 | insights list | button | Our standard | data.js:382 |  |
| C0688 | insights list | h2.vh | Articles | app.js:405 | screen reader only |
| C0689 | insights list | div.meta | Mobility · 1 min read | app.js:212 | category plus the reading time from readMins() |
| C0690 | insights list | h3 | Six things worth thinking about before a first conversation | data.js:354 |  |
| C0691 | insights list | p | You do not need any documents to begin. A little thought about six questions helps us give you useful options straight away. | data.js:355 |  |
| C0692 | insights list | span.tlink | Read the draft | app.js:212 |  |
| C0693 | insights list | div.meta | Private Office · 1 min read | app.js:212 | category plus the reading time from readMins() |
| C0694 | insights list | h3 | Why a multi-country family needs one point of contact | data.js:366 |  |
| C0695 | insights list | p | When the residency, the home, the company and the school are handled by different people, the family becomes the coordinator. It should be the other way round. | data.js:367 |  |
| C0696 | insights list | div.meta | Partners · 1 min read | app.js:212 | category plus the reading time from readMins() |
| C0697 | insights list | h3 | Your Client stays your Client: how introductions work | data.js:374 |  |
| C0698 | insights list | p | For lawyers, bankers, wealth advisers and family offices, an introduction should protect the relationship, not put it at risk. | data.js:375 |  |
| C0699 | insights list | div.meta | Our standard · 1 min read | app.js:212 | category plus the reading time from readMins() |
| C0700 | insights list | h3 | What “everything in writing” means in practice | data.js:382 |  |
| C0701 | insights list | p | Before you decide anything, you should be able to see every option, its costs and its timeline side by side. | data.js:383 |  |
| C0702 | insights list | card link | Read the article | app.js:212 | replaces "Read the draft" once an article is approved; JavaScript only: not in the prerendered HTML |
| C0703 | insights list | screen reader announcement | {n} articles shown | app.js:1090 | "1 article shown" in the singular; JavaScript only: not in the prerendered HTML |

### /insights/before-a-first-conversation (Insights article: before a first conversation, 20 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, what we do, event, article, insights list, pagination.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0704 | meta | page title | Six things worth thinking about before a first conversation | app.js:785; data.js:354 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0705 | meta | meta description | You do not need any documents to begin. A little thought about six questions helps us give you useful options straight away. | data.js:355 |  |
| C0706 | hero | span | Mobility | data.js:354 |  |
| C0707 | hero | eyebrow | Mobility | data.js:354 |  |
| C0708 | hero | h1.d1 | Six things worth thinking about before a first conversation | data.js:354 |  |
| C0709 | article | p.article-dek | You do not need any documents to begin. A little thought about six questions helps us give you useful options straight away. | data.js:355 |  |
| C0710 | article | p | Nobody arrives wanting a visa for its own sake. They arrive wanting a different next chapter. A little thought about the questions below helps a first conversation move quickly to options that fit. | data.js:357 |  |
| C0711 | article | h2 | Your family | data.js:358; app.js:321 |  |
| C0712 | article | p | Who would be included, and their ages. | data.js:358 |  |
| C0713 | article | h2 | Where you are now | data.js:359 |  |
| C0714 | article | p | Where you live, work and hold citizenship today. | data.js:359 |  |
| C0715 | article | h2 | What you want | data.js:360 |  |
| C0716 | article | p | Which of the six ambitions matter most, and why: live, build, structure, invest, protect or experience. | data.js:360 |  |
| C0717 | article | h2 | A budget range | data.js:361 |  |
| C0718 | article | p | A rough range is enough. We will show what fits. | data.js:361 |  |
| C0719 | article | h2 | Your timing | data.js:362 |  |
| C0720 | article | p | Any dates that matter: school terms, a move, a company launch. | data.js:362 |  |
| C0721 | article | h2 | Your history | data.js:363 |  |
| C0722 | article | p | Any past applications or refusals. Being open helps us help you. | data.js:363 |  |
| C0723 | article | pull quote | Not sure about some of them? That is what the first conversation is for. | data.js:364 |  |

### /insights/explain-your-family-once (Insights article: explain your family once, 11 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, what we do, other houses, event, article, insights list, pagination.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0724 | meta | page title | Why a multi-country family needs one point of contact | app.js:785; data.js:366 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0725 | meta | meta description | When the residency, the home, the company and the school are handled by different people, the family becomes the coordinator. It should be the other way round. | data.js:367 |  |
| C0726 | hero | eyebrow | Private Office | data.js:17,138,293,366 |  |
| C0727 | hero | h1.d1 | Why a multi-country family needs one point of contact | data.js:366 |  |
| C0728 | article | p.article-dek | When the residency, the home, the company and the school are handled by different people, the family becomes the coordinator. It should be the other way round. | data.js:367 |  |
| C0729 | article | p | A family that lives across borders rarely has one question. The residency touches the home; the home touches the school; the company touches the tax position. Handled separately, each adviser sees a slice and the family carries the whole. | data.js:369 |  |
| C0730 | article | h2 | One table | data.js:370 |  |
| C0731 | article | p | Imperial’s houses sit at one table, so the person advising on your residency already knows about the home, the company and the school. | data.js:370 |  |
| C0732 | article | h2 | One person | data.js:371 |  |
| C0733 | article | p | One Relationship Manager brings each house in when it is needed, and qualified specialists for regulated matters such as tax, legal and investment. | data.js:371 |  |
| C0734 | article | pull quote | You never have to explain your family twice. | data.js:372 |  |

### /insights/your-client-stays-your-client (Insights article: your Client stays your Client, 12 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, what we do, event, article, insights list, pagination.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0735 | meta | page title | Your Client stays your Client: how introductions work | app.js:785; data.js:374 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0736 | meta | meta description | For lawyers, bankers, wealth advisers and family offices, an introduction should protect the relationship, not put it at risk. | data.js:375 |  |
| C0737 | hero | span | Partners | data.js:374 |  |
| C0738 | hero | eyebrow | Partners | data.js:374 |  |
| C0739 | hero | h1.d1 | Your Client stays your Client: how introductions work | data.js:374 |  |
| C0740 | article | p.article-dek | For lawyers, bankers, wealth advisers and family offices, an introduction should protect the relationship, not put it at risk. | data.js:375 |  |
| C0741 | article | p | Professional advisers are often the first people a Client asks about living or investing abroad. The question is who to hand that conversation to without worrying about it. | data.js:377 |  |
| C0742 | article | h2 | Four steps | data.js:378 |  |
| C0743 | article | p | Introduce, with your Client’s permission, through one simple form. A Relationship Manager meets your Client and explains their options plainly. You receive clear updates at every stage. Terms are honoured exactly as set out in your written agreement. | data.js:378 |  |
| C0744 | article | h2 | Shared standards | data.js:379; app.js:373 |  |
| C0745 | article | p | We never guarantee citizenship, visa, residency, investment or tax outcomes, and we claim no influence with any government. Every Client-facing document is checked against an approved claims list. | data.js:379 |  |
| C0746 | article | pull quote | Your reputation travels with ours. | data.js:380; app.js:373 |  |

### /insights/everything-in-writing (Insights article: everything in writing, 11 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, what we do, other houses, event, article, insights list, pagination.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0747 | meta | page title | What “everything in writing” means in practice · Imperial | app.js:785; data.js:382 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0748 | meta | meta description | Before you decide anything, you should be able to see every option, its costs and its timeline side by side. | data.js:383 |  |
| C0749 | hero | span | Our standard | data.js:382 |  |
| C0750 | hero | eyebrow | Our standard | data.js:382 |  |
| C0751 | hero | h1.d1 | What “everything in writing” means in practice | data.js:382 |  |
| C0752 | article | p.article-dek | Before you decide anything, you should be able to see every option, its costs and its timeline side by side. | data.js:383 |  |
| C0753 | article | p | Programmes, costs and timelines are set by governments and change over time. That is why every plan we prepare is confirmed in writing for your family before you decide. | data.js:385 |  |
| C0754 | article | h2 | What every plan includes | data.js:386 |  |
| C0755 | article | p | An eligibility review; options compared side by side in plain language; a full, itemised cost schedule; an honest timeline, updated as things move; a document checklist; a quality check before anything is submitted; specialists coordinated for you; and aftercare. | data.js:386 |  |
| C0756 | article | h2 | The small print, said plainly | data.js:387 |  |
| C0757 | article | p | Final approval always rests with the relevant government. We tell you that at the start, and keep you informed at every stage. | data.js:268,387 |  |

### /contact (Contact, 95 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, forms, hero, network.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0758 | meta | page title | Contact · Imperial Holdings Group | app.js:785; app.js:550,657,663,698,773; index.html:50 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0759 | meta | meta description | Speak to Imperial Holdings Group. Three short steps, routed to the right house, with one person as your point of contact. | app.js:698 |  |
| C0760 | hero | span | Contact | app.js:550,657,663,698,773; index.html:50 |  |
| C0761 | hero | eyebrow | Speak to us | app.js:202,325,366,369,377,413 (+5) |  |
| C0762 | hero | h1.d1 | Shall we begin? | app.js:550 |  |
| C0763 | hero | lead paragraph | Three short steps. Tell us where you are, and where you would like to be. We will make sure the right house picks it up, with one person as your point of contact. | app.js:550 |  |
| C0764 | forms (contact) | ol aria-label | Progress | app.js:555 |  |
| C0765 | forms (contact) | list item | 1. What it is about | app.js:549,555 | step number plus the step name |
| C0766 | forms (contact) | list item | 2. About you | app.js:549,555 | step number plus the step name |
| C0767 | forms (contact) | list item | 3. Your message | app.js:549,555 | step number plus the step name |
| C0768 | forms (contact) | h2 | What can we help with? | app.js:557,559 |  |
| C0769 | forms (contact) | p | Choose the closest. We route it to the right house, and you keep one point of contact. | app.js:557 |  |
| C0770 | forms (contact) | div aria-label | What can we help with? | app.js:557,559 |  |
| C0771 | forms (contact) | label > span | Citizenship Citizenship or residency for my family | data.js:256,258,394 | composed at run time; the fixed part is on this line |
| C0772 | forms (contact) | label > span | Private Office Ongoing support as an existing Imperial Client | data.js:295 | written as separate lines in the source |
| C0773 | forms (contact) | label > span | Partners Club Becoming a Partner, or introducing a Client | data.js:559 | written as separate lines in the source |
| C0774 | forms (contact) | label > span | Academy Training, learning or careers | data.js:344; app.js:351 | composed at run time; the fixed part is on this line |
| C0775 | forms (contact) | label > span | Real Estate Property in Dubai | data.js:259,479 | written as separate lines in the source |
| C0776 | forms (contact) | label > span | Group A strategic or institutional enquiry | data.js:399 | composed at run time; this line holds part of it |
| C0777 | forms (contact) | p.route-err | Please choose what we can help with. | app.js:561 |  |
| C0778 | forms (contact) | note (span.xs) | Step 1 of 3 | app.js:563 |  |
| C0779 | forms (contact) | button > span | Continue | app.js:563,572 |  |
| C0780 | forms (contact) | h2 | About you | app.js:549,565,1600 |  |
| C0781 | forms (contact) | p | So the right person can reply. We only use these details to respond. | app.js:565 |  |
| C0782 | forms (contact) | form label | Preferred way to reach you | app.js:571 |  |
| C0783 | forms (contact) | option (select pref) | Email | app.js:391,469,534,567,571,586 (+4) |  |
| C0784 | forms (contact) | option (select pref) | Phone call | app.js:571 |  |
| C0785 | forms (contact) | option (select pref) | Either | app.js:571 |  |
| C0786 | forms (contact) | button (outline) > span | Back | app.js:572,579,1432 |  |
| C0787 | forms (contact) | h2 | Your message | app.js:549,574,1600 |  |
| C0788 | forms (contact) | p | A few lines are enough. No documents are needed for a first conversation. | app.js:574 |  |
| C0789 | forms (contact) | placeholder (textarea msg) | A few lines about your family, your plans or your practice. | app.js:577 |  |
| C0790 | forms (contact) | error message | Please tell us a little about your enquiry. | app.js:577 |  |
| C0791 | forms (contact) | note (p.xs) | We use these details only to respond. Nothing is shared beyond what a service needs. | app.js:580 |  |
| C0792 | offices | eyebrow | Offices | app.js:585,664 |  |
| C0793 | offices | h3.h3 | Dubai Headquarters | app.js:585 | office city and role, from data.js:246,247 |
| C0794 | offices | div | Address 804 Single Business Tower Business Bay, Dubai United Arab Emirates | app.js:585 | the Address label and the office lines, from data.js:246,247 |
| C0795 | offices | span | Phone | app.js:585,1611 |  |
| C0796 | offices | button link (outline) > span | WhatsApp Dubai | app.js:1397,1403; index.html:54 | composed at run time; the fixed part is on this line |
| C0797 | offices | note (p.xs) | To confirm: Confirm this number is WhatsApp enabled | app.js:49 | composed at run time; the fixed part is on this line |
| C0798 | offices | h3.h3 | Lagos Regional hub | app.js:585 | office city and role, from data.js:246,247 |
| C0799 | offices | div | Address 8 Aromire Road, Ikoyi Lagos 106104 Nigeria | app.js:585 | the Address label and the office lines, from data.js:246,247 |
| C0800 | offices | button link (outline) > span | WhatsApp Lagos | app.js:1397,1403; index.html:54 | composed at run time; the fixed part is on this line |
| C0801 | offices | h3.h3 | Online | app.js:586,1729 |  |
| C0802 | offices | span | Book a first conversation | app.js:586,1384 |  |
| C0803 | offices | placeholder chip | To confirm: Dubai booking page | app.js:49 | amber placeholder; composed at run time; the fixed part is on this line |
| C0804 | offices | placeholder chip | To confirm: Lagos booking page | app.js:49 | amber placeholder; composed at run time; the fixed part is on this line |
| C0805 | offices | h3.h4 | Before we speak | app.js:587 |  |
| C0806 | offices | p | You do not need any documents for the first conversation. It helps to think about who would be included, where you live and hold citizenship today, and any dates that matter. | app.js:587 |  |
| C0807 | offices | note (p.small) | The first conversation is for listening. You do not have to decide anything on the first call. | app.js:587 |  |
| C0808 | questions | eyebrow | Questions | app.js:589,663 |  |
| C0809 | questions | h2.d2 | Before you get in touch. | app.js:589 | written as separate lines in the source |
| C0810 | questions | lead paragraph | Short answers to what people ask most. Anything else, ask us directly. | app.js:589 |  |
| C0811 | questions | h3 | Do I need any documents for a first conversation? | data.js:554 |  |
| C0812 | questions | p | No. The first conversation is for listening. It helps to think about who would be included, where you live and hold citizenship today, a rough budget and any dates that matter, but nothing needs to be prepared. | data.js:554 |  |
| C0813 | questions | h3 | Will I have to deal with several people across the houses? | data.js:555 |  |
| C0814 | questions | p | No. One Relationship Manager is your point of contact across every house, and brings each one in when it is needed. You never have to explain your family twice. | data.js:555 |  |
| C0815 | questions | h3 | Can you guarantee that an application will be approved? | data.js:556 |  |
| C0816 | questions | p | No one honestly can. Final approval of any citizenship or residency application always rests with the relevant government. We tell you that at the start, and keep you informed at every stage. | data.js:556 |  |
| C0817 | questions | h3 | Do you give tax, legal or investment advice? | data.js:557 |  |
| C0818 | questions | p | Advice on regulated matters such as tax, legal or investment is given only by appropriately qualified specialists. Your Relationship Manager coordinates them for you. | data.js:557 |  |
| C0819 | questions | h3 | What happens to the information I share? | data.js:558 |  |
| C0820 | questions | p | It is used to respond to you, kept in our customer relationship system, and shared only where a service requires it. Private matters stay private. You can ask for a copy, or for deletion, at any time. | data.js:558 |  |
| C0821 | questions | text link | Privacy notice | data.js:475,558; app.js:1780 |  |
| C0822 | questions | h3 | I am a lawyer, banker or wealth adviser. Can I introduce a Client? | data.js:559 |  |
| C0823 | questions | p | Yes, through Imperial Partners Club. Your Partner Agreement sets out exactly how introductions work, you receive clear updates at every stage, and your Client stays your Client. | data.js:559 |  |
| C0824 | questions | h3 | Is Imperial Real Estate open yet? | data.js:560 |  |
| C0825 | questions | p | Not yet. Imperial Real Estate is licensed and has not launched. You can register your interest and we will contact you when it opens. | data.js:560 |  |
| C0826 | questions | text link | Register interest | data.js:560; app.js:220,381,389,396,1667 |  |
| C0827 | questions | h3 | Where are you based? | data.js:561 |  |
| C0828 | questions | p | Our headquarters is in Dubai, with a regional hub in Lagos and relationships with Partners, advisers and specialists in more than 20 countries. | data.js:561 |  |
| C0829 | offices | clock (p.clock) | Local time {hh:mm}, {weekday} | app.js:995 | office side cards; JavaScript only: not in the prerendered HTML |
| C0830 | forms (contact) | routing card (p) | Your enquiry will be routed to {Division name}. | app.js:1184 | step 1, after a choice; the division name is in bold; JavaScript only: not in the prerendered HTML |
| C0831 | forms (contact) | routing card (p) | Your enquiry will be routed to Imperial Real Estate, which has not yet launched. We will register your interest. | app.js:1184 | step 1, Real Estate chosen; JavaScript only: not in the prerendered HTML |
| C0832 | forms (contact) | routing card link | Register interest instead | app.js:1183 | Real Estate chosen; JavaScript only: not in the prerendered HTML |
| C0833 | forms (contact) | routing card link | Or go direct: imperialcitizenship.com | app.js:1183 | Citizenship chosen (the only live site); JavaScript only: not in the prerendered HTML |
| C0834 | forms (contact) | routing card link | Visit the website | app.js:1183 | Partners Club, Private Office or Academy chosen; opens the "Link to confirm" toast; JavaScript only: not in the prerendered HTML |
| C0835 | forms (contact) | routing card (strong) | We will pass this to the Group team. | app.js:1182 | strategic or institutional enquiry chosen; JavaScript only: not in the prerendered HTML |
| C0836 | forms (contact) | routing card (p) | One person will reply and bring in the right house. | app.js:1182 | JavaScript only: not in the prerendered HTML |
| C0837 | forms (contact) | label (p.from-finder) | From the house finder | app.js:558 | when the page is opened from the finder with chosen ambitions; the ambition names follow; JavaScript only: not in the prerendered HTML |
| C0838 | forms (contact) | review row label (dt) | About | app.js:1609 | step 3 review; the value is "{enquiry label} → {destination}"; JavaScript only: not in the prerendered HTML |
| C0839 | forms (contact) | review row label (dt) | Interests | app.js:1610 | only when the finder passed ambitions; JavaScript only: not in the prerendered HTML |
| C0840 | forms (contact) | review row label (dt) | Name | app.js:1609 | JavaScript only: not in the prerendered HTML |
| C0841 | forms (contact) | review row label (dt) | Email | app.js:1609 | JavaScript only: not in the prerendered HTML |
| C0842 | forms (contact) | review row label (dt) | Phone | app.js:1611 | JavaScript only: not in the prerendered HTML |
| C0843 | forms (contact) | review row label (dt) | Country | app.js:1612 | JavaScript only: not in the prerendered HTML |
| C0844 | forms (contact) | review row label (dt) | Nationality | app.js:1612 | JavaScript only: not in the prerendered HTML |
| C0845 | forms (contact) | review row label (dt) | For | app.js:1612 | JavaScript only: not in the prerendered HTML |
| C0846 | forms (contact) | review row label (dt) | Reply by | app.js:1612 | JavaScript only: not in the prerendered HTML |
| C0847 | forms (contact) | review row label (dt.vh) | Change | app.js:1613 | screen reader only; JavaScript only: not in the prerendered HTML |
| C0848 | forms (contact) | text button | Edit these details | app.js:1613 | returns to step 2; JavaScript only: not in the prerendered HTML |
| C0849 | forms (contact) | screen reader announcement | Step {n} of 3: {step name} | app.js:1622 | step names: What it is about, About you, Your message; JavaScript only: not in the prerendered HTML |
| C0850 | forms | field name fallback | What we can help with | app.js:1224 | name of the step 1 choice in the announcement; JavaScript only: not in the prerendered HTML |
| C0851 | offices | link (a.ul) | Book a conversation, {Dubai or Lagos} | app.js:1388 | contact side card once a booking URL is set; JavaScript only: not in the prerendered HTML |
| C0852 | meta | LocalBusiness name (JSON-LD) | Imperial Holdings Group, {Dubai or Lagos} | app.js:727 | description: Headquarters or Regional hub; JavaScript only: not in the prerendered HTML |

### /privacy (Privacy notice, 56 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, legal.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0853 | meta | page title | Privacy · Imperial Holdings Group | app.js:785; app.js:613,668,699,777 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0854 | meta | meta description | Privacy notice for the Imperial Holdings Group website: who we are, what we collect through our enquiry forms, how we use it and your rights. | app.js:699 |  |
| C0855 | hero | span | Privacy | app.js:613,668,699,777 |  |
| C0856 | hero | h1.d1 | Privacy notice | data.js:475,558; app.js:1780 |  |
| C0857 | hero | lead paragraph | What we collect when you write to us, where it goes, how long we keep it, and how to ask for a copy or for deletion. Written plainly, so it can be read in a few minutes. | data.js:476 |  |
| C0858 | legal | div | Awaiting legal review. This notice describes what the site does today and is complete in substance. Counsel reviews and approves it before launch. Legal entity, licence number and registered address: To confirm: to confirm | app.js:614 | composed at run time; the fixed part is on this line |
| C0859 | legal | h2 | Who we are | data.js:478 |  |
| C0860 | legal | p | This website is published by Imperial Holdings Group, the parent of Imperial Citizenship, Imperial Private Office, Imperial Partners Club, Imperial Academy and Imperial Real Estate, with offices in Dubai and Lagos. | data.js:479 |  |
| C0861 | legal | p | The entity responsible for your information, the data controller, is To confirm: Legal entity, registered address and data controller. In this notice, we and us mean that entity. | data.js:480 | written as separate lines in the source |
| C0862 | legal | h2 | What we collect | data.js:482 |  |
| C0863 | legal | p | You can read this site without giving us any information about yourself. We collect personal information only when you send it to us through one of our forms: the enquiry card, the three step contact form, the Imperial Real Estate register interest form and the request for the citizenship guide. | data.js:483 |  |
| C0864 | legal | p | Depending on the form, we ask for: | data.js:484 |  |
| C0865 | legal | list item | your name and email address; | data.js:485 |  |
| C0866 | legal | list item | your telephone number, if you choose to give it; | data.js:486 |  |
| C0867 | legal | list item | your country of residence, and your nationality or nationalities; | data.js:487 |  |
| C0868 | legal | list item | whether you are writing as a private client, a professional partner or an institution, and who the enquiry is for: yourself, your family or a client you are introducing; | data.js:488 |  |
| C0869 | legal | list item | what it concerns, which tells us which of our divisions should reply; | data.js:489 |  |
| C0870 | legal | list item | when you would like to begin, and a budget range if you choose to give one; | data.js:490 |  |
| C0871 | legal | list item | for Partners Club enquiries, your firm and your profession; | data.js:491 |  |
| C0872 | legal | list item | for property enquiries, what you are looking for, whether you wish to buy or rent, and the area that interests you; | data.js:492 |  |
| C0873 | legal | list item | how you would prefer to be contacted; | data.js:493 |  |
| C0874 | legal | list item | if you came to the form from the house finder, the ambitions you chose there; | data.js:494 |  |
| C0875 | legal | list item | your message, and your agreement to this notice. | data.js:495 |  |
| C0876 | legal | p | Each form also records, without asking you, where the enquiry came from: the page you sent it from, the page you first arrived on, the site that referred you, and any campaign tags in the address you arrived by (utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid and fbclid), together with which of our forms and sites the enquiry came through. We use these to see which of our channels brought you to us. They describe a channel, not you, and we do not join them to any advertising profile. | data.js:497 |  |
| C0877 | legal | p | The programme fit check on the Imperial Citizenship page keeps your five answers with your enquiry, so that the first conversation starts in the right place. Nothing is kept unless you then send the form. | data.js:498 |  |
| C0878 | legal | p | If you ask us to verify your telephone number after sending a form, we send a one time code by WhatsApp or SMS and record whether it was entered. This step is optional. Your enquiry reaches us either way. | data.js:499 |  |
| C0879 | legal | p | Our forms include a hidden field that only automated software fills in. We use it to reject spam, and for nothing else. | data.js:500 |  |
| C0880 | legal | p | Our systems note the network address (the IP address) a form was sent from, so that one connection cannot flood us with submissions. When the Cloudflare Turnstile spam check is switched on, Cloudflare also receives that address, to tell a person from automated software. To confirm: Whether Turnstile is switched on at launch | data.js:501 | written as separate lines in the source |
| C0881 | legal | p | What you type into a form is kept in your own browser until the form is sent or you choose Start afresh, so that nothing is lost if the page reloads. It stays on your device and reaches us only when you press send. For the current visit only, your browser also keeps the campaign tags described above and a note that you have seen the opening animation. | data.js:502 |  |
| C0882 | legal | h2 | Where it goes | data.js:504 |  |
| C0883 | legal | p | Your enquiry goes first to Netlify, the company that hosts this website, which keeps a copy in its form inbox, and from there to Pipedrive, the customer relationship system we use, where it is stored. It is assigned to one named person in the relevant Imperial team: Imperial Citizenship, Imperial Private Office, Imperial Partners Club, Imperial Academy, Imperial Real Estate or the Group team. If you have written to us before, the new enquiry is added to your existing record rather than creating a second one. | data.js:505 |  |
| C0884 | legal | p | Two further providers are used only when those features are switched on: an email provider, to send you a short confirmation of your enquiry, and a telephone verification provider, to send the one time code. Each receives only what its task needs: your name and email address for the confirmation, your telephone number for the code. To confirm: Email provider (Resend in the current build) and telephone verification provider (Twilio Verify in the current build), and whether each is switched on at launch | data.js:506 | written as separate lines in the source |
| C0885 | legal | p | We do not sell your information, and we do not share it with anyone for their own marketing. Within the Group it is visible to our team in the customer relationship system and used only by the person answering you. Where a service is delivered by one of our trusted Partners, we share what that service needs, and only with your agreement. | data.js:507 |  |
| C0886 | legal | p | Our offices are in the United Arab Emirates and Nigeria. The providers named above may store information outside the country you live in. To confirm: Where each provider stores data, and the safeguards that apply, to be confirmed by counsel | data.js:508 | written as separate lines in the source |
| C0887 | legal | h2 | How long we keep it | data.js:510 |  |
| C0888 | legal | p | We keep your enquiry for To confirm: Retention period, for example 24 months after our last contact with you, and then delete it, unless you have become a client, in which case your record is kept for as long as the relationship lasts and for any period the law requires afterwards. | data.js:511 | written as separate lines in the source |
| C0889 | legal | h2 | Your choices and your rights | data.js:513 |  |
| C0890 | legal | p | You can ask us at any time to send you a copy of the information we hold about you, to correct it, to delete it, or to stop contacting you. Write to info@imperialholdingsgroup.com To confirm: Dedicated privacy mailbox and we will reply promptly. | data.js:514 | written as separate lines in the source |
| C0891 | legal | p | You can withdraw your agreement to this notice at any time by writing to the same address. This does not affect anything done before you withdrew it. | data.js:515 |  |
| C0892 | legal | p | If you ask us to delete your information, we remove it from our systems and ask our providers to do the same, unless the law requires us to keep it, in which case we will tell you. | data.js:516 |  |
| C0893 | legal | p | Depending on where you live, the law may give you further rights, including the right to complain to a supervisory authority. To confirm: Applicable data protection law and supervisory authority for each office, to be confirmed by counsel | data.js:517 | written as separate lines in the source |
| C0894 | legal | h2 | Analytics and cookies | data.js:519 |  |
| C0895 | legal | p | This site sets no advertising cookies and no cookie that follows you to other sites, so there is no cookie banner. | data.js:520 |  |
| C0896 | legal | p | When our analytics are switched on, they run in a cookie-free configuration: nothing is stored on your device, the service is asked not to keep your network address, and we see counts of visits and of which pages and buttons were used, not who you are. To confirm: Analytics provider (Google Analytics 4, cookie-free, in the current build) and whether it is switched on at launch | data.js:521 | written as separate lines in the source |
| C0897 | legal | p | The only things this site stores on your device are the form drafts and the two visit values described above. They exist for your convenience and reach us only as part of a form you choose to send. | data.js:522 |  |
| C0898 | legal | p | Where a video appears on this site, the player loads only when you press play, in its do-not-track mode, except the short silent loop on the home page, which plays without sound and sends nothing you typed. The video host then receives your network address, as any website you visit does. Links to WhatsApp and to our booking pages take you to those services, which have their own privacy terms. | data.js:523 |  |
| C0899 | legal | h2 | Security | data.js:525 |  |
| C0900 | legal | p | We keep your information on systems that only authorised people can reach, and we limit it to the people who need it. No system is perfectly secure. If we learn of a breach that affects your information, we will tell you. | data.js:526 |  |
| C0901 | legal | h2 | Children | data.js:528 |  |
| C0902 | legal | p | This site is not aimed at children, and we do not knowingly collect information from anyone under 18. | data.js:529 |  |
| C0903 | legal | h2 | Changes to this notice | data.js:531 |  |
| C0904 | legal | p | If this notice changes, the new version will be published on this page with the date it took effect. To confirm: Date of the version approved by counsel | data.js:532 | written as separate lines in the source |
| C0905 | legal | h2 | How to contact us | data.js:534 |  |
| C0906 | legal | p | Write to info@imperialholdingsgroup.com To confirm: Dedicated privacy mailbox, or to either office. | data.js:535 | written as separate lines in the source |
| C0907 | legal | div | Dubai 804 Single Business Tower Business Bay, Dubai United Arab Emirates +971 4 546 1110 | data.js:192,246 | composed at run time; this line holds part of it |
| C0908 | legal | div | Lagos 8 Aromire Road, Ikoyi Lagos 106104 Nigeria +234 902 222 2024 | data.js:171,193,247 | composed at run time; this line holds part of it |

### /terms (Terms of use, 13 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, hero, legal.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0909 | meta | page title | Terms · Imperial Holdings Group | app.js:785; app.js:613,668,700,777 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0910 | meta | meta description | Terms of use for the Imperial Holdings Group website: information only, not advice, and no guarantee of any government decision or outcome. | app.js:700 |  |
| C0911 | hero | span | Terms | app.js:613,668,700,777 |  |
| C0912 | hero | h1.d1 | Terms of use | data.js:541; app.js:1781 |  |
| C0913 | legal | div | Awaiting legal review. This page is a placeholder. The final terms of use will be drafted and approved by counsel before launch. Legal entity, licence number and registered address: To confirm: to confirm | app.js:614 | composed at run time; the fixed part is on this line |
| C0914 | legal | h2 | About this website | data.js:544; app.js:1781 |  |
| C0915 | legal | p | This website is for information only and is not an offer or advice. Advice on regulated matters such as tax, legal or investment is provided only by appropriately qualified specialists. | data.js:544 |  |
| C0916 | legal | h2 | No guarantees | data.js:545 |  |
| C0917 | legal | p | Imperial does not guarantee government decisions or outcomes. Final approval of any citizenship or residency application rests with the relevant government. | data.js:545 |  |
| C0918 | legal | h2 | Use of this site | data.js:546 |  |
| C0919 | legal | p | You may read and share what is published here for your own information. The text, photographs, logos and marks belong to Imperial Holdings Group or to those who licensed them to us. To confirm: Full terms of use, to be drafted by counsel | data.js:546 | written as separate lines in the source |
| C0920 | legal | h2 | Governing law | data.js:547 |  |
| C0921 | legal | p | These terms are governed by the law of To confirm: Jurisdiction to confirm. | data.js:547 | composed at run time; the fixed part is on this line |

### /404 (Page not found (404.html), 8 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, forms, what we do.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0922 | meta | page title | Page not found · Imperial Holdings Group | app.js:785; app.js:628,687,701 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0923 | meta | meta description | Imperial Holdings Group: five specialist divisions, one standard, and one person who knows your family. Led from Dubai and Lagos. | app.js:879 |  |
| C0924 | 404 | eyebrow | Page not found | app.js:628,687,701 |  |
| C0925 | 404 | h1.d2 | This page has moved, or never existed. | app.js:628 | written as separate lines in the source |
| C0926 | 404 | lead paragraph | Let us take you somewhere useful. | app.js:628 |  |
| C0927 | 404 | button link (gold) > span | Home | app.js:194,628,632,650,730,1045 (+1) |  |
| C0928 | 404 | text link | Our divisions | app.js:341,628 |  |
| C0929 | meta | default meta description | Imperial Holdings Group: five specialist divisions, one standard, and one person who knows your family. Led from Dubai and Lagos. | app.js:879 | used when a page carries no description of its own (the 404 page today); JavaScript only: not in the prerendered HTML |

### /error (Error page (error.html), 7 strings of its own)

Shared on this page (Part B): header, menu, footer, palette, forms, what we do.

| ID | Section | Element | Current wording | Source | Notes |
|---|---|---|---|---|---|
| C0930 | meta | page title | Something went wrong · Imperial Holdings Group | app.js:785; app.js:632 | the brand suffix is added by pageTitle(); the page name comes from the listed line |
| C0931 | meta | meta description | Something went wrong on our side. Please try again in a moment, or call or email Imperial Holdings Group. | app.js:809 |  |
| C0932 | error | eyebrow | Error | app.js:632 |  |
| C0933 | error | h1.d2 | Something went wrong on our side. | app.js:809 |  |
| C0934 | error | lead paragraph | Please try again in a moment. If it happens again, call or email us and we will take it from there. | app.js:632 |  |
| C0935 | error | button (gold) > span | Try again | app.js:632 |  |
| C0936 | error | text link | Home | app.js:194,628,632,650,730,1045 (+1) |  |

## Part B: shared strings

### Header (27)

The skip link, the intro veil, the main navigation, the search button, the WhatsApp sheet, the quick actions, the placeholder toasts and the noscript line.

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C0937 | header | a.skip | Skip to content | all pages | index.html:36 |  |
| C0938 | veil | span.iv-word | Imperial Holdings Group | all pages | data.js:14,240,241; app.js:661,709,1560,1562; index.html:13,40,44 | aria-hidden (decorative) |
| C0939 | header | a aria-label | Imperial Holdings Group, home | all pages | index.html:44 |  |
| C0940 | header / footer | img alt text | Imperial Holdings Group | all pages | data.js:14,240,241; app.js:661,709,1560,1562; index.html:13,40,44 |  |
| C0941 | header | nav aria-label | Main | all pages | index.html:45 |  |
| C0942 | header / menu / footer | a | About | all pages | app.js:314,651,663,690,746,1609; index.html:46 | hidden until opened or triggered |
| C0943 | header | button.mega-btn | Our ecosystem | all pages | app.js:286,645,652,663,1770 |  |
| C0944 | header / menu / footer | a | Our Network | all pages | app.js:290,655,663,1771; index.html:48 | hidden until opened or triggered |
| C0945 | header / menu / hero | a | Journal | all pages | app.js:304,436,440,451,656,749 (+1); index.html:49 | hidden until opened or triggered |
| C0946 | header / menu / footer | a | Contact | all pages | app.js:550,657,663,698,773; index.html:50 | hidden until opened or triggered |
| C0947 | header | button aria-label | Search the site, Ctrl K | all pages | app.js:1851 | composed at run time; the fixed part is on this line |
| C0948 | header | button.srch-btn > kbd | Ctrl K | all pages | app.js:15 |  |
| C0949 | header / menu | button link (outline) > span | Enquire now | all pages | app.js:658,1775; index.html:53,78 | hidden until opened or triggered |
| C0950 | header | button aria-label | WhatsApp us | all pages | app.js:1403; index.html:54 |  |
| C0951 | header | button aria-label | Open menu | all pages | app.js:1127; index.html:55 |  |
| C0952 | header | div.wa-pop-h | WhatsApp us | all pages | app.js:1403; index.html:54 | hidden until opened or triggered |
| C0953 | header | a.wa-row > b | Dubai | all pages | data.js:154,192,246; app.js:91,233 | hidden until opened or triggered |
| C0954 | header / hero / the Group / leadership / footer / our story / founder film / compare / what we do / guide / overview / gallery / event / article / offices / legal | span title attribute | Placeholder: to be confirmed | all pages | app.js:49 | hidden until opened or triggered; amber placeholder |
| C0955 | header | placeholder chip | To confirm: Confirm this number is WhatsApp enabled | all pages | app.js:49 | hidden until opened or triggered; amber placeholder; composed at run time; the fixed part is on this line |
| C0956 | header | a.wa-row > b | Lagos | all pages | data.js:160,164,167,171,174,193 (+1); app.js:233 | hidden until opened or triggered |
| C0957 | header | button aria-label | Back to top | all pages | index.html:77 |  |
| C0958 | header | nav aria-label | Quick actions | all pages | index.html:78 |  |
| C0959 | header | button aria-label | Search the site | all pages | app.js:649; index.html:52,68,78 |  |
| C0960 | noscript | div.nojs | This site needs JavaScript to display. Please enable it, or contact Imperial Holdings Group directly. | all pages | index.html:100 | noscript only |
| C0961 | header | toast | Link to confirm. {placeholder text} will be added before launch. | all pages | app.js:1152 | shown when a placeholder link (data-tbc) is clicked; the placeholder texts are the site tbc values below and the division website placeholders; JavaScript only: not in the prerendered HTML |
| C0962 | header | toast placeholder text | Final production domain (imperialholdingsgroup.com) to confirm | all pages | data.js:14 | fills the toast for the Imperial Holdings Group link in the mega menu and the footer (the link is marked home, so it navigates instead today); JavaScript only: not in the prerendered HTML |
| C0963 | header | toast placeholder text | Imperial Real Estate website link (at launch) | all pages | data.js:18 | fills the toast for the Real Estate "TBC" link in the mega menu and the footer; JavaScript only: not in the prerendered HTML |

### Menu (47)

The mega menu (Our ecosystem) and the mobile menu, hidden until opened.

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C0964 | menu / ecosystem | eyebrow | Our ecosystem | all pages | app.js:286,645,652,663,1770 | hidden until opened or triggered |
| C0965 | menu | div.d3 | Five divisions. One table. | all pages | app.js:645 | hidden until opened or triggered |
| C0966 | menu | p | One Relationship Manager across all five. | all pages | app.js:645 | hidden until opened or triggered |
| C0967 | menu / ecosystem / other houses | text link | All divisions | all pages | app.js:287,355,645,653 | hidden until opened or triggered |
| C0968 | menu | a.mega-item > b | Imperial Citizenship | all pages | data.js:15,252; app.js:1592 | hidden until opened or triggered |
| C0969 | menu | a.mega-item > small | The flagship | all pages | data.js:252 | hidden until opened or triggered |
| C0970 | menu | a.mega-item > b | Imperial Partners Club | all pages | data.js:16,272,559 | hidden until opened or triggered |
| C0971 | menu | a.mega-item > small | For professionals | all pages | data.js:272 | hidden until opened or triggered |
| C0972 | menu | a.mega-item > b | Imperial Private Office | all pages | data.js:17,293 | hidden until opened or triggered |
| C0973 | menu | a.mega-item > small | For existing Clients | all pages | data.js:293 | hidden until opened or triggered |
| C0974 | menu | a.mega-item > b | Imperial Real Estate | all pages | data.js:18,313; app.js:381 | hidden until opened or triggered |
| C0975 | menu | a.mega-item > small | Coming soon | all pages | data.js:313; app.js:313,356,381,646,654 | hidden until opened or triggered |
| C0976 | menu | a.mega-item > b | Imperial Academy | all pages | data.js:19,329 | hidden until opened or triggered |
| C0977 | menu | a.mega-item > small | Learning and standards | all pages | data.js:329 | hidden until opened or triggered |
| C0978 | menu | figure caption | Citizenship Second residency and citizenship by investment, from first conversation to completed application. | all pages | data.js:256,258,394 | hidden until opened or triggered; aria-hidden (decorative); composed at run time; the fixed part is on this line |
| C0979 | menu | figure caption | Partners Club The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | all pages | data.js:16,272,288 | hidden until opened or triggered; aria-hidden (decorative); composed at run time; the fixed part is on this line |
| C0980 | menu | figure caption | Private Office One lasting relationship for families with multi-country lives. | all pages | data.js:17,95,98,138,141,164 (+7); app.js:352,530,1771 | hidden until opened or triggered; aria-hidden (decorative); composed at run time; the fixed part is on this line |
| C0981 | menu | figure caption | Real Estate Licensed property advisory, starting with Dubai. | all pages | app.js:381 | hidden until opened or triggered; aria-hidden (decorative); written as separate lines in the source |
| C0982 | menu | figure caption | Academy Learning, training and certification for the people who do this work. | all pages | data.js:344; app.js:351 | hidden until opened or triggered; aria-hidden (decorative); composed at run time; the fixed part is on this line |
| C0983 | menu | span | The houses online: | all pages | app.js:648 | hidden until opened or triggered |
| C0984 | menu / footer | a | Imperial Holdings Group | all pages | data.js:14,240,241; app.js:661,709,1560,1562; index.html:13,40,44 | hidden until opened or triggered |
| C0985 | menu / footer | a | imperialcitizenship.com | all pages | data.js:15 | hidden until opened or triggered |
| C0986 | menu / footer | a > small (chip) | TBC | all pages | app.js:175 | hidden until opened or triggered |
| C0987 | menu / footer / how we work | a | Partners Club | all pages | data.js:16,272 | hidden until opened or triggered |
| C0988 | menu / footer / how we work | a | Private Office | all pages | data.js:17,138,293,366 | hidden until opened or triggered |
| C0989 | menu / footer / how we work | a | Real Estate | all pages | data.js:18,313; app.js:381 | hidden until opened or triggered |
| C0990 | menu / footer / how we work | a | Academy | all pages | data.js:19,329 | hidden until opened or triggered |
| C0991 | menu | div aria-label | Menu | all pages | index.html:61 | hidden until opened or triggered |
| C0992 | menu | button.mm-search > span | Search the site | all pages | app.js:649; index.html:52,68,78 | hidden until opened or triggered |
| C0993 | menu / hero | a > span | Home | all pages | app.js:194,628,632,650,730,1045 (+1) | hidden until opened or triggered |
| C0994 | menu | button > span | Our ecosystem | all pages | app.js:286,645,652,663,1770 | hidden until opened or triggered |
| C0995 | menu | a > b | All divisions | all pages | app.js:287,355,645,653 | hidden until opened or triggered |
| C0996 | menu | a > small | Five divisions, one table | all pages | app.js:653 | hidden until opened or triggered |
| C0997 | menu / footer | a > b | Imperial Citizenship | all pages | data.js:15,252; app.js:1592 | hidden until opened or triggered |
| C0998 | menu / how we work | a > small | The flagship | all pages | data.js:252 | hidden until opened or triggered |
| C0999 | menu / footer | a > b | Imperial Partners Club | all pages | data.js:16,272,559 | hidden until opened or triggered |
| C1000 | menu / how we work | a > small | For professionals | all pages | data.js:272 | hidden until opened or triggered |
| C1001 | menu / footer | a > b | Imperial Private Office | all pages | data.js:17,293 | hidden until opened or triggered |
| C1002 | menu / how we work | a > small | For existing Clients | all pages | data.js:293 | hidden until opened or triggered |
| C1003 | menu / footer | a > b | Imperial Real Estate | all pages | data.js:18,313; app.js:381 | hidden until opened or triggered |
| C1004 | menu / how we work | a > small | Coming soon | all pages | data.js:313; app.js:313,356,381,646,654 | hidden until opened or triggered |
| C1005 | menu / footer | a > b | Imperial Academy | all pages | data.js:19,329 | hidden until opened or triggered |
| C1006 | menu / how we work | a > small | Learning and standards | all pages | data.js:329 | hidden until opened or triggered |
| C1007 | menu | span | DUBAI · LAGOS · WORLDWIDE | all pages | app.js:658 | hidden until opened or triggered |
| C1008 | menu | p.mm-hint | Swipe up or press Esc to close | all pages | app.js:658 | hidden until opened or triggered |
| C1009 | menu | clock (span.clock) | {hh:mm} GST | all pages | app.js:997 | mobile menu footer, Dubai time; JavaScript only: not in the prerendered HTML |
| C1010 | menu | button aria-label | Close menu | all pages | app.js:1127 | replaces "Open menu" while the mobile menu is open; JavaScript only: not in the prerendered HTML |

### Footer (19)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1011 | footer | p | Two cities. One horizon. Five specialist divisions, one standard, and one person who knows your family. | all pages | app.js:661 |  |
| C1012 | footer | h2.fh | Divisions | all pages | app.js:341,363,381,662,691,747 (+1) |  |
| C1013 | footer | a > small (chip) | Soon | all pages | app.js:662 |  |
| C1014 | footer | h2.fh | The Group | all pages | app.js:283,663 |  |
| C1015 | footer | a | Our ecosystem | all pages | app.js:286,645,652,663,1770 |  |
| C1016 | footer | a | Events and Journal | all pages | app.js:663,693,695,1772 |  |
| C1017 | footer | a | Questions | all pages | app.js:589,663 |  |
| C1018 | footer | button.flink | Search Ctrl K | all pages | data.js:317; app.js:649,663,1851; index.html:52,68,70,72,78 | composed at run time; the fixed part is on this line |
| C1019 | footer | h2.fh | Offices | all pages | app.js:585,664 |  |
| C1020 | footer | div.off | Dubai Headquarters 804 Single Business Tower Business Bay, Dubai United Arab Emirates +971 4 546 1110 | all pages | data.js:192,246 | composed at run time; this line holds part of it |
| C1021 | footer | div.off | Lagos Regional hub 8 Aromire Road, Ikoyi Lagos 106104 Nigeria +234 902 222 2024 | all pages | data.js:171,193,247 | composed at run time; this line holds part of it |
| C1022 | footer | a | info@imperialholdingsgroup.com | all pages | data.js:245 |  |
| C1023 | footer | h2.fh | Websites | all pages | app.js:665 |  |
| C1024 | footer | p | This website is for information only and is not an offer or advice. Advice on regulated matters such as tax, legal or investment is provided only by appropriately qualified specialists. Imperial does not guarantee government decisions or outcomes. To confirm: Legal entity, licence number and registered address | all pages | app.js:666 | written as separate lines in the source |
| C1025 | footer | details summary | Photography: Imperial events and leadership (own), plus Unsplash licence | all pages | app.js:667 |  |
| C1026 | footer | list item | Palm Jumeirah and the Dubai coast from above by Nejc Soklič | all pages | data.js:102 | written as separate lines in the source |
| C1027 | footer | list item | Dubai skyline at sunset by Anoof C | all pages | data.js:103 | written as separate lines in the source |
| C1028 | footer | span | © 2026 Imperial Holdings Group. | all pages | app.js:668,698,809 | composed at run time; this line holds part of it |
| C1029 | footer | span | Privacy · Terms | all pages | app.js:668 |  |

### Search palette (51)

The default results, the kind labels, the one empty state and the keyword hints that never show (listed under Not inventoried).

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1030 | palette | div aria-label | Search the site | all pages | app.js:649; index.html:52,68,78 | hidden until opened or triggered |
| C1031 | palette | placeholder (input ) | Search divisions, events, articles, questions… | all pages | index.html:70 | hidden until opened or triggered |
| C1032 | palette | button aria-label | Esc, close search | all pages | index.html:71 | hidden until opened or triggered |
| C1033 | palette | button.pal-esc | Esc | all pages | index.html:71,73 | hidden until opened or triggered |
| C1034 | palette | div aria-label | Search results | all pages | index.html:72 | hidden until opened or triggered |
| C1035 | palette | ul aria-label | Results | all pages | index.html:72 | hidden until opened or triggered |
| C1036 | palette | span | ↑ ↓ to move | all pages | index.html:73 | hidden until opened or triggered; aria-hidden (decorative) |
| C1037 | palette | span | ↵ to open | all pages | index.html:73 | hidden until opened or triggered; aria-hidden (decorative) |
| C1038 | palette | span | Esc to close | all pages | app.js:658; index.html:73 | hidden until opened or triggered; aria-hidden (decorative) |
| C1039 | palette | placeholder (input) | Search divisions, events, articles, questions… | all pages | index.html:70 | input placeholder; in the DOM but listed here with the rest of the palette; JavaScript only: not in the prerendered HTML |
| C1040 | palette | group label (li.pal-grp) | Suggested | all pages | app.js:1809 | shown above the default results while the box is empty; JavaScript only: not in the prerendered HTML |
| C1041 | palette | result kind (span.pal-k) | Page | all pages | app.js:1768 | kind label on the right of a result; JavaScript only: not in the prerendered HTML |
| C1042 | palette | result kind (span.pal-k) | Enquire | all pages | app.js:1775,1785 | JavaScript only: not in the prerendered HTML |
| C1043 | palette | result kind (span.pal-k) | Tool | all pages | app.js:1776 | JavaScript only: not in the prerendered HTML |
| C1044 | palette | result kind (span.pal-k) | Event | all pages | app.js:1779 | JavaScript only: not in the prerendered HTML |
| C1045 | palette | result kind (span.pal-k) | Division | all pages | app.js:1782 | JavaScript only: not in the prerendered HTML |
| C1046 | palette | result kind (span.pal-k) | Insight | all pages | app.js:1783 | drafts are left out, so no Insight result shows today; JavaScript only: not in the prerendered HTML |
| C1047 | palette | result kind (span.pal-k) | Question | all pages | app.js:1784 | JavaScript only: not in the prerendered HTML |
| C1048 | palette | result title | Home | all pages | app.js:1768 | JavaScript only: not in the prerendered HTML |
| C1049 | palette | result subtitle | One house for a life across borders | all pages | app.js:1768 | JavaScript only: not in the prerendered HTML |
| C1050 | palette | result title | About the Group | all pages | app.js:1769 | JavaScript only: not in the prerendered HTML |
| C1051 | palette | result subtitle | Our story, values and leadership | all pages | app.js:1769 | JavaScript only: not in the prerendered HTML |
| C1052 | palette | result title | Our ecosystem | all pages | app.js:1770 | JavaScript only: not in the prerendered HTML |
| C1053 | palette | result subtitle | Five divisions, side by side | all pages | app.js:1770 | JavaScript only: not in the prerendered HTML |
| C1054 | palette | result title | Our Network | all pages | app.js:1771 | JavaScript only: not in the prerendered HTML |
| C1055 | palette | result subtitle | Private clients, professional partners, institutions and strategic relationships | all pages | app.js:1771 | JavaScript only: not in the prerendered HTML |
| C1056 | palette | result title | Events and Journal | all pages | app.js:1772 | JavaScript only: not in the prerendered HTML |
| C1057 | palette | result subtitle | Developments, insights, partnerships and selected events | all pages | app.js:1772 | JavaScript only: not in the prerendered HTML |
| C1058 | palette | result title | Insights | all pages | app.js:1773 | JavaScript only: not in the prerendered HTML |
| C1059 | palette | result subtitle | Notes from the house | all pages | app.js:1773 | JavaScript only: not in the prerendered HTML |
| C1060 | palette | result title | Speak to us | all pages | app.js:1774 | one of the two default results; JavaScript only: not in the prerendered HTML |
| C1061 | palette | result subtitle | Start a conversation in three short steps | all pages | app.js:1774 | JavaScript only: not in the prerendered HTML |
| C1062 | palette | result title | Enquire now | all pages | app.js:1775 | JavaScript only: not in the prerendered HTML |
| C1063 | palette | result subtitle | Begin with one conversation | all pages | app.js:1775 | JavaScript only: not in the prerendered HTML |
| C1064 | palette | result title | Find your house | all pages | app.js:1776 | one of the two default results; JavaScript only: not in the prerendered HTML |
| C1065 | palette | result subtitle | Answer two questions to see which divisions fit | all pages | app.js:1776 | JavaScript only: not in the prerendered HTML |
| C1066 | palette | result title | Global presence | all pages | app.js:1777 | JavaScript only: not in the prerendered HTML |
| C1067 | palette | result subtitle | Dubai headquarters, Lagos hub, 20+ countries | all pages | app.js:1777 | JavaScript only: not in the prerendered HTML |
| C1068 | palette | result title | Leadership | all pages | app.js:1778 | JavaScript only: not in the prerendered HTML |
| C1069 | palette | result subtitle | Zaid Al Hindi, Hekma Iskandarani | all pages | app.js:1778 | JavaScript only: not in the prerendered HTML |
| C1070 | palette | result title and subtitle | {event title} / {event dek} | all pages | app.js:1779 | one result per event, from data.js events[] (title and dek already listed on the event pages); JavaScript only: not in the prerendered HTML |
| C1071 | palette | result title | Privacy notice | all pages | app.js:1780 | JavaScript only: not in the prerendered HTML |
| C1072 | palette | result subtitle | How information is handled | all pages | app.js:1780 | JavaScript only: not in the prerendered HTML |
| C1073 | palette | result title | Terms of use | all pages | app.js:1781 | JavaScript only: not in the prerendered HTML |
| C1074 | palette | result subtitle | About this website | all pages | app.js:1781 | JavaScript only: not in the prerendered HTML |
| C1075 | palette | result title and subtitle | {division name} / {division line} | all pages | app.js:1782 | one result per division, from data.js divisions[] name and line; shown by default while the box is empty; JavaScript only: not in the prerendered HTML |
| C1076 | palette | result title and subtitle | {insight title} / {insight dek} | all pages | app.js:1783 | one result per approved insight; none today because all four are drafts; JavaScript only: not in the prerendered HTML |
| C1077 | palette | result title and subtitle | {question} / {answer} | all pages | app.js:1784 | one result per FAQ entry, from data.js faq[] (listed on /contact); JavaScript only: not in the prerendered HTML |
| C1078 | palette | result title | {enquiry label} | all pages | app.js:1785 | one result per enquiry type, from data.js enquiry[] (the six "It concerns" options); JavaScript only: not in the prerendered HTML |
| C1079 | palette | result subtitle | Start an enquiry, routed to the right house | all pages | app.js:1785 | subtitle of each enquiry result; JavaScript only: not in the prerendered HTML |
| C1080 | palette | empty state (p.pal-empty) | Nothing matches “{query}”. Try a division, a country or a question, or ask us directly. | all pages | app.js:1814 | "ask us directly" is a link to /contact; JavaScript only: not in the prerendered HTML |

### Forms (111)

The enquiry card (home and four division pages), the contact flow, register interest (Real Estate), the guide (Citizenship), and the states every form can reach: the kept draft, validation, the success, failure, verification and booking states.

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1081 | enquiry | eyebrow | Confidential · No obligation | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:467 |  |
| C1082 | enquiry | h2.d2 | Begin with one conversation. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:467 | written as separate lines in the source |
| C1083 | enquiry | lead paragraph | Tell us what you are planning. A senior adviser will read your enquiry and reply personally. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:468 |  |
| C1084 | enquiry / offices / 404 / error | span | Email | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact, /404, /error | app.js:391,469,534,567,571,586 (+4) |  |
| C1085 | enquiry / offices / 404 / error | a.ul | info@imperialholdingsgroup.com | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact, /404, /error | data.js:245 |  |
| C1086 | enquiry / 404 / error | span | Dubai | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /404, /error | data.js:154,192,246; app.js:91,233 |  |
| C1087 | enquiry / 404 / error | span | Lagos | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /404, /error | data.js:160,164,167,171,174,193 (+1); app.js:233 |  |
| C1088 | enquiry | note (p.xs) | Prefer three short steps? Use the guided form. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:470 |  |
| C1089 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | label.hp | Leave this empty | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:389,529,553,1476 | aria-hidden (decorative); honeypot, never shown |
| C1090 | forms (enquiry) | eyebrow | Private enquiry | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:530 |  |
| C1091 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | span | We kept what you started earlier. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:554,1291 | hidden until opened or triggered |
| C1092 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | text button | Start afresh | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:554,1291 | hidden until opened or triggered |
| C1093 | forms (enquiry) | form label | I am | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:531 |  |
| C1094 | forms (enquiry) / forms (interest) / forms (contact) | option (select audience) | Choose one | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:393,487,491,497,531 | hidden until opened or triggered |
| C1095 | forms (enquiry) | option (select audience) | A private client | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:473 |  |
| C1096 | forms (enquiry) | option (select audience) | A professional partner or introducer | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:473 |  |
| C1097 | forms (enquiry) | option (select audience) | An institution or strategic partner | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:473 |  |
| C1098 | forms (enquiry) | error message | Please tell us who you are. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:531 |  |
| C1099 | forms (enquiry) | form label | It concerns | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:532 |  |
| C1100 | forms (enquiry) | option (select division) | Choose the closest | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:532 |  |
| C1101 | forms (enquiry) | option (select division) | Citizenship or residency for my family | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | data.js:394 |  |
| C1102 | forms (enquiry) | option (select division) | Ongoing support as an existing Imperial Client | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | data.js:395 |  |
| C1103 | forms (enquiry) | option (select division) | Becoming a Partner, or introducing a Client | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | data.js:396 |  |
| C1104 | forms (enquiry) | option (select division) | Training, learning or careers | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | data.js:397 |  |
| C1105 | forms (enquiry) | option (select division) | Property in Dubai | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | data.js:398 |  |
| C1106 | forms (enquiry) | option (select division) | A strategic or institutional enquiry | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | data.js:399 |  |
| C1107 | forms (enquiry) | error message | Please choose the closest. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:532 |  |
| C1108 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | form label | Full name | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:390,533,566,1478 |  |
| C1109 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | error message | Please enter your name. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:390,533,566,1478 |  |
| C1110 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | form label | Email | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:391,469,534,567,571,586 (+4) |  |
| C1111 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | error message | Please enter a valid email address. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:391,534,567,1479 |  |
| C1112 | forms (enquiry) / forms (contact) | form label | Phone, with country code (optional) | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:535,568 |  |
| C1113 | forms (enquiry) / forms (interest) / forms (contact) | form label | Country of residence | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:392,536,569 |  |
| C1114 | forms (enquiry) / forms (interest) / forms (contact) | error message | Please tell us where you live. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:392,536,569 |  |
| C1115 | forms (enquiry) / forms (contact) | form label | Nationality, or nationalities | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:487 |  |
| C1116 | forms (enquiry) / forms (contact) | error message | Please tell us your nationality. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:487 |  |
| C1117 | forms (enquiry) / forms (contact) | form label | This enquiry is for | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:487 |  |
| C1118 | forms (enquiry) / forms (contact) | option (select for_whom) | Myself | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:475 |  |
| C1119 | forms (enquiry) / forms (contact) | option (select for_whom) | My family | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:475 |  |
| C1120 | forms (enquiry) / forms (contact) | option (select for_whom) | A client I am introducing | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | data.js:439; app.js:475 |  |
| C1121 | forms (enquiry) / forms (contact) | error message | Please choose one. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:483 |  |
| C1122 | forms (enquiry) / forms (contact) | form label | When would you like to begin? | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | data.js:448; app.js:491 |  |
| C1123 | forms (enquiry) / forms (contact) | option (select timeline) | Within 3 months | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:476 |  |
| C1124 | forms (enquiry) / forms (contact) | option (select timeline) | 3 to 12 months | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:476 |  |
| C1125 | forms (enquiry) / forms (contact) | option (select timeline) | Just exploring for now | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:476 |  |
| C1126 | forms (enquiry) / forms (contact) | form label | A budget in mind (optional) | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:491 |  |
| C1127 | forms (enquiry) / forms (contact) | option (select budget) | If you wish to say | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:491 |  |
| C1128 | forms (enquiry) / forms (contact) | option (select budget) | Under US$250,000 | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:479 |  |
| C1129 | forms (enquiry) / forms (contact) | option (select budget) | US$250,000 to 500,000 | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:479 |  |
| C1130 | forms (enquiry) / forms (contact) | option (select budget) | US$500,000 to 1 million | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:479 |  |
| C1131 | forms (enquiry) / forms (contact) | option (select budget) | Over US$1 million | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:479 |  |
| C1132 | forms (enquiry) / forms (contact) | option (select budget) | I would rather not say yet | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | data.js:449; app.js:479 |  |
| C1133 | forms (enquiry) / forms (contact) | form label | Firm | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:496 | hidden until opened or triggered |
| C1134 | forms (enquiry) / forms (contact) | error message | Please tell us your firm. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:496 | hidden until opened or triggered |
| C1135 | forms (enquiry) / forms (contact) | form label | Profession | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:496 | hidden until opened or triggered |
| C1136 | forms (enquiry) / forms (contact) | error message | Please tell us your profession. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:496 | hidden until opened or triggered |
| C1137 | forms (enquiry) / forms (contact) | form label | I am looking to | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:497 | hidden until opened or triggered |
| C1138 | forms (enquiry) / forms (contact) | option (select re_intent) | Buy | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:480 | hidden until opened or triggered |
| C1139 | forms (enquiry) / forms (contact) | option (select re_intent) | Rent | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:480 | hidden until opened or triggered |
| C1140 | forms (enquiry) / forms (contact) | form label | Area of interest (optional) | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:497 | hidden until opened or triggered |
| C1141 | forms (enquiry) / forms (contact) | form label | How can we help? | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:538,577 |  |
| C1142 | forms (enquiry) | error message | A few lines are enough. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:538 |  |
| C1143 | forms (enquiry) / forms (contact) | consent text > span | I agree to Imperial Holdings Group using these details to respond to my enquiry, as described in the privacy notice. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:539,578 | composed at run time; the fixed part is on this line |
| C1144 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | consent text > em | Please tick the box so that we can reply. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:523 |  |
| C1145 | forms (enquiry) / forms (contact) | button (gold) > span | Send enquiry | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:540,579 |  |
| C1146 | forms (enquiry) | note (span.xs) | We use your details only to reply to this enquiry. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:540 |  |
| C1147 | forms | toast | Cleared. The form is empty again. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1534 | after "Start afresh" on a kept draft; JavaScript only: not in the prerendered HTML |
| C1148 | forms (contact) | destination name | the Group team | /, /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:1593,1606 | used in the review row and the success message when the enquiry is strategic or institutional; JavaScript only: not in the prerendered HTML |
| C1149 | forms | error message (email) | Please use an email address you check regularly. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1189 | replaces the email error when the address is on the disposable domain list; also used in the error box with "Nothing has been sent yet."; JavaScript only: not in the prerendered HTML |
| C1150 | forms | error box | Please check the email address. Nothing has been sent yet. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1582 | when the backend refuses the address; JavaScript only: not in the prerendered HTML |
| C1151 | forms | error box | We could not send this just now. Forms only send from the live website, not from a file opened on this computer. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1580 | file:// only; JavaScript only: not in the prerendered HTML |
| C1152 | forms | error box (fallback) | We could not send this just now. Please call or email us and we will take it from there. What you typed is kept on this device, so you can also try again later. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1274 | followed by the Dubai and Lagos numbers and the email; also shown when the honeypot was filled; JavaScript only: not in the prerendered HTML |
| C1153 | forms | screen reader announcement | {n} fields need attention. {Field label}: {error message} | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1236 | read when a step or a form is sent with something missing; with one field only the label and the message; JavaScript only: not in the prerendered HTML |
| C1154 | forms | field name fallback | Consent | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1223 | name of the consent box in the announcement; JavaScript only: not in the prerendered HTML |
| C1155 | forms | field name fallback | This field | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1226 | only for a field without a visible label; JavaScript only: not in the prerendered HTML |
| C1156 | forms | error message fallback | Please check this field. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1232 | only for a field without its own error text; JavaScript only: not in the prerendered HTML |
| C1157 | forms | success heading (h3) | Thank you, {first name}. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1300 | "Thank you." when no name; JavaScript only: not in the prerendered HTML |
| C1158 | forms | success message (p) | Your enquiry is with {Division name or the Group team}. One person will be your point of contact, and will reply to arrange a first conversation. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact | app.js:1575 | enquiry card and contact form; JavaScript only: not in the prerendered HTML |
| C1159 | forms | button link (success) | Read while you wait | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1296 | links to the Journal; JavaScript only: not in the prerendered HTML |
| C1160 | forms | button (success) | Send another | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1296 | redraws the form; JavaScript only: not in the prerendered HTML |
| C1161 | forms | screen reader announcement | Sent. Thank you, {first name}. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1305 | JavaScript only: not in the prerendered HTML |
| C1162 | forms (verify) | eyebrow | Verify your phone | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1325 | after sending, when a phone was given and the verify endpoint is enabled; JavaScript only: not in the prerendered HTML |
| C1163 | forms (verify) | paragraph | We have sent a code by {WhatsApp or SMS} to {phone}. Enter it to confirm the number is yours. It takes a moment and helps us reply faster. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1326 | channel names from byName(): WhatsApp, SMS (app.js:1322); JavaScript only: not in the prerendered HTML |
| C1164 | forms (verify) | form label (span.vh) | Verification code | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1327 | screen reader only; also the input aria-label; JavaScript only: not in the prerendered HTML |
| C1165 | forms (verify) | placeholder (input code) | Code | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1327 | JavaScript only: not in the prerendered HTML |
| C1166 | forms (verify) | button (gold) | Verify | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1327 | JavaScript only: not in the prerendered HTML |
| C1167 | forms (verify) | text button | Send it again | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1329 | JavaScript only: not in the prerendered HTML |
| C1168 | forms (verify) | text button | Send it by {SMS or WhatsApp} instead | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1329 | names the other channel; JavaScript only: not in the prerendered HTML |
| C1169 | forms (verify) | text button | Skip for now | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1329 | JavaScript only: not in the prerendered HTML |
| C1170 | forms (verify) | screen reader announcement | Verify your phone: a code has been sent by {channel}. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1363 | JavaScript only: not in the prerendered HTML |
| C1171 | forms (verify) | screen reader announcement | A new code has been sent by {channel}. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1343 | JavaScript only: not in the prerendered HTML |
| C1172 | forms (verify) | error box | We could not send the code by {channel} just now. Please try the other way, or skip for now. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1343 | JavaScript only: not in the prerendered HTML |
| C1173 | forms (verify) | error box | Please enter the code we sent. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1346 | fewer than 4 or more than 10 digits; JavaScript only: not in the prerendered HTML |
| C1174 | forms (verify) | confirmation (p.verified) | Phone verified. Thank you. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1352 | JavaScript only: not in the prerendered HTML |
| C1175 | forms (verify) | confirmation (p.verified) | Code accepted. Thank you. We will note it on your enquiry shortly. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1352 | when the backend could not record the result yet; JavaScript only: not in the prerendered HTML |
| C1176 | forms (verify) | screen reader announcement | Phone verified. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1353 | JavaScript only: not in the prerendered HTML |
| C1177 | forms (verify) | screen reader announcement | Code accepted. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1353 | JavaScript only: not in the prerendered HTML |
| C1178 | forms (verify) | error box | That code has expired. Send it again by WhatsApp or SMS below. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1355 | JavaScript only: not in the prerendered HTML |
| C1179 | forms (verify) | error box | That code did not match. Please check it and try again, or send it again below. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1356 | JavaScript only: not in the prerendered HTML |
| C1180 | forms (verify) | error box | We could not check the code just now. Please try again, or skip for now. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1357 | JavaScript only: not in the prerendered HTML |
| C1181 | forms (verify) | screen reader announcement | Verification skipped. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1359 | JavaScript only: not in the prerendered HTML |
| C1182 | forms (verify) | note (p.verify-note) | We could not send a verification code to this number, so we will continue without it. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1368 | WhatsApp and SMS both failed; JavaScript only: not in the prerendered HTML |
| C1183 | forms (verify) | note (p.verify-note) | We could not send a verification code: the number needs its country code (for example +971 or +234). We will continue without it. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1369 | JavaScript only: not in the prerendered HTML |
| C1184 | forms (verify) | note (p.verify-note) | We could not send a verification code just now, so we will continue without it. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1369 | rate limit or another refusal; JavaScript only: not in the prerendered HTML |
| C1185 | forms (booking) | eyebrow | Book a first conversation | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1384 | success state, after verification; the same words head the contact side card; JavaScript only: not in the prerendered HTML |
| C1186 | forms (booking) | paragraph | Choose the office closest to you. Where the booking page allows it, your name and email are filled in for you. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1384 | JavaScript only: not in the prerendered HTML |
| C1187 | forms (booking) | button link | Dubai | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1382 | once config.booking.dubai.url is set; until then the placeholder below; JavaScript only: not in the prerendered HTML |
| C1188 | forms (booking) | button link | Lagos | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:1382 | once config.booking.lagos.url is set; JavaScript only: not in the prerendered HTML |
| C1189 | forms (booking) | placeholder chip | Dubai booking page (Microsoft Bookings or Calendly) | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | data.js:37 | success state while the URL is empty (the contact side card shows the shorter "Dubai booking page"); JavaScript only: not in the prerendered HTML |
| C1190 | forms (booking) | placeholder chip | Lagos booking page (Microsoft Bookings or Calendly) | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | data.js:38 | JavaScript only: not in the prerendered HTML |
| C1191 | forms | consent text (appended) | See our privacy notice. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | app.js:525 | appended at run time to any consent text that has no link to the privacy notice; never shows today, every consent text already carries the link; JavaScript only: not in the prerendered HTML |

### Blocks several pages share (181)

The closing band, the division page furniture (overview, what we do, who it is for, how it works, cta band, other houses), the event and article furniture (glance list, share bar, gallery, related, pagination) and the clocks.

#### hero (12)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1192 | hero | img alt text | Stage lights at the Imperial Citizenship gala dinner, Lagos | /, /journal/events/gala-dinner-lagos | data.js:56,57 |  |
| C1193 | hero | img alt text | Colonnade in evening light | /about, /journal/events/lagos-office-event, /contact | data.js:99 |  |
| C1194 | hero | nav aria-label | Breadcrumb | /about, /divisions, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing, /contact, /privacy, /terms | app.js:194 |  |
| C1195 | hero / other houses / insights list | img alt text | Glass towers seen from below | /divisions, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /insights, /insights/your-client-stays-your-client | data.js:97 |  |
| C1196 | hero / other houses / insights list | img alt text | Private jet on the apron at sunset | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /insights, /insights/before-a-first-conversation | data.js:95 |  |
| C1197 | hero | a | Divisions | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy | app.js:341,363,381,662,691,747 (+1) |  |
| C1198 | hero | span | Private Office | /divisions/private-office, /insights/explain-your-family-once | data.js:17,138,293,366 |  |
| C1199 | hero | img alt text | Polo at Lagos Polo Club, Ikoyi | /journal, /journal/events/easter-polo-cup-2026 | data.js:58 |  |
| C1200 | hero | eyebrow | Private gathering · Lagos | /journal/events/gala-dinner-lagos, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C1201 | hero | a | Insights | /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:402,411,696,763,766,1773 |  |
| C1202 | hero | lead paragraph | About 1 minute read | /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:411 | reading time from readMins() |
| C1203 | hero | eyebrow | Legal | /privacy, /terms | app.js:613 |  |

#### closing (4)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1204 | closing / hero | img alt text | Dubai rising above the clouds | /about, /divisions, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights | data.js:101 |  |
| C1205 | closing | h2.d2 | With you, from the first question. | /about, /divisions, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights | app.js:200 | written as separate lines in the source |
| C1206 | closing | lead paragraph | Tell us where you are, and where you would like to be. The first conversation is for listening. Decisions come when you are ready. | /about, /divisions, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights | app.js:201 |  |
| C1207 | closing | button link (outline) > span | About the Group | /about, /divisions, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights | app.js:202,284,297,1769 |  |

#### overview (6)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1208 | overview | eyebrow | Overview | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy | app.js:364,382 |  |
| C1209 | overview | div aria-label | At a glance | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:365,1724 |  |
| C1210 | overview | dt | Division | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:365,1782,1790 |  |
| C1211 | overview | dt | Status | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:365 |  |
| C1212 | overview | dt | For | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:365,1612,1726 |  |
| C1213 | overview | dt | Website | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:365 |  |

#### what we do (4)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1214 | what we do | eyebrow | What we do | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:367 |  |
| C1215 | what we do | h3.h3 | Not sure which applies? | /divisions/citizenship, /divisions/academy | app.js:369 |  |
| C1216 | what we do | p | That is what the first conversation is for. | /divisions/citizenship, /divisions/academy | app.js:369 |  |
| C1217 | what we do / article / 404 / error | text link | Speak to us | /divisions/citizenship, /divisions/academy, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing, /404, /error | app.js:202,325,366,369,377,413 (+5) |  |

#### who it is for (2)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1218 | who it is for | eyebrow | Who it is for | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:370 |  |
| C1219 | who it is for | h2.d2 | Who we work with. | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:370 | written as separate lines in the source |

#### how it works (2)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1220 | how it works | eyebrow | How it works | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:371 |  |
| C1221 | how it works | span.ix | STEP 04 | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:209 | STEP plus the number, from steps() |

#### cta band (1)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1222 | cta band | lead paragraph (variant) | Services, the team and how to begin, on the {Site name} website. | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:376 | once a division website other than Citizenship is live; JavaScript only: not in the prerendered HTML |

#### other houses (16)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1223 | other houses | eyebrow | Explore the other houses | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy | app.js:355 |  |
| C1224 | other houses | h2.d2 | One table. | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy | app.js:286,341,355 |  |
| C1225 | other houses | div aria-label | Other divisions | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy | app.js:355 |  |
| C1226 | other houses | b | Partners Club | /divisions/citizenship, /divisions/private-office, /divisions/real-estate, /divisions/academy | data.js:16,272 |  |
| C1227 | other houses | span | The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | /divisions/citizenship, /divisions/private-office, /divisions/real-estate, /divisions/academy | data.js:273 |  |
| C1228 | other houses / hero / insights list | img alt text | Penthouse lounge overlooking the Dubai coast | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /insights, /insights/explain-your-family-once | data.js:96 |  |
| C1229 | other houses | b | Private Office | /divisions/citizenship, /divisions/partners-club, /divisions/real-estate, /divisions/academy | data.js:17,138,293,366 |  |
| C1230 | other houses | span | One lasting relationship for families with multi-country lives. | /divisions/citizenship, /divisions/partners-club, /divisions/real-estate, /divisions/academy | data.js:294 |  |
| C1231 | other houses / hero | img alt text | Palm Jumeirah and the Dubai coast from above | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy | data.js:102 |  |
| C1232 | other houses | b | Real Estate | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | data.js:18,313; app.js:381 |  |
| C1233 | other houses | span | Licensed property advisory, starting with Dubai. | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | data.js:314 |  |
| C1234 | other houses / hero / insights list | img alt text | Private library at sunset | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /journal/events/delborough-dinner, /insights, /insights/everything-in-writing | data.js:98 |  |
| C1235 | other houses | b | Academy | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate | data.js:19,329 |  |
| C1236 | other houses | span | Learning, training and certification for the people who do this work. | /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate | data.js:330 |  |
| C1237 | other houses | b | Citizenship | /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy | data.js:15,135,252 |  |
| C1238 | other houses | span | Second residency and citizenship by investment, from first conversation to completed application. | /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy | data.js:253 |  |

#### ecosystem (5)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1239 | ecosystem / hero | chip (badge) | The flagship | /, /divisions/citizenship | data.js:252 |  |
| C1240 | ecosystem / hero | chip (badge) | For professionals | /, /divisions/partners-club | data.js:272 |  |
| C1241 | ecosystem / hero | chip (badge) | For existing Clients | /, /divisions/private-office | data.js:293 |  |
| C1242 | ecosystem / other houses / hero | chip (badge) | Coming soon | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy | data.js:313; app.js:313,356,381,646,654 |  |
| C1243 | ecosystem / hero | chip (badge) | Learning and standards | /, /divisions/academy | data.js:329 |  |

#### network (1)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1244 | network / questions | text link | Imperial Partners Club | /, /contact | data.js:16,272,559 |  |

#### leadership (8)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1245 | leadership | eyebrow | Leadership | /, /about | app.js:295,332,1778 |  |
| C1246 | leadership | h2.d2 | The people accountable. | /, /about | app.js:295,332 | written as separate lines in the source |
| C1247 | leadership | img alt text | Zaid Al Hindi | /, /about | data.js:240 |  |
| C1248 | leadership | div.role | Founder and Group Chief Executive Officer | /, /about | data.js:240 |  |
| C1249 | leadership | h3 | Zaid Al Hindi | /, /about | data.js:240 |  |
| C1250 | leadership | img alt text | Hekma Iskandarani | /, /about | data.js:241 |  |
| C1251 | leadership | div.role | Group Chief Operating Officer | /, /about | data.js:241 |  |
| C1252 | leadership | h3 | Hekma Iskandarani | /, /about | data.js:241 |  |

#### events (20)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1253 | events | eyebrow | Selected events | /, /journal | app.js:299,437 |  |
| C1254 | events / related | div.meta | Diplomatic · Dubai · 19 February 2025 | /, /journal, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026 | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C1255 | events / related | h3 | Grenada’s 51st Independence Day After Party | /, /journal, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026 | data.js:154 |  |
| C1256 | events / related | p | Imperial Citizenship sponsored the after party for Grenada’s 51st Independence Day, following the official celebrations hosted by IMA Grenada and the Consulate General of Grenada in Dubai. | /, /journal, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026 | data.js:156 |  |
| C1257 | events / related | span.tlink | Read the story | /, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:427 |  |
| C1258 | events / related | div.meta | Diplomatic · Lagos · 2025 | /, /journal, /journal/events/grenada-51-dubai, /journal/events/easter-polo-cup-2026 | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C1259 | events / journal / related | h3 | The Lagos Diplomatic Soirée 2025 | /, /journal, /journal/events/grenada-51-dubai, /journal/events/easter-polo-cup-2026 | data.js:160,187 |  |
| C1260 | events / related | p | An evening in Lagos bringing together members of the diplomatic community, clients and friends of Imperial. | /, /journal, /journal/events/grenada-51-dubai, /journal/events/easter-polo-cup-2026 | data.js:162 |  |
| C1261 | events / related | div.meta | Partnership · Lagos · Easter 2026 | /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C1262 | events / related | h3 | Easter Polo Cup After Party | /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/lagos-office-event, /journal/events/delborough-dinner | data.js:167 |  |
| C1263 | events / related | p | Imperial Citizenship and Lagos Polo Club: an exclusive Easter Polo Cup after party at Lagos Polo Club, Ikoyi. | /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/lagos-office-event, /journal/events/delborough-dinner | data.js:169 |  |
| C1264 | events / related | div.meta | Private gathering · Lagos | /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C1265 | events / related | h3 | Gala Dinner, Lagos | /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | data.js:164 |  |
| C1266 | events / related | p | A gala dinner hosted by Imperial Citizenship in Lagos, with guests from across the Caribbean citizenship community. | /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | data.js:165 |  |
| C1267 | events / related | h3 | An Evening at the Lagos Office | /journal, /journal/events/gala-dinner-lagos, /journal/events/delborough-dinner | data.js:171 |  |
| C1268 | events / related | p | Clients, partners and friends of Imperial at the Lagos office on Aromire Road, Ikoyi. | /journal, /journal/events/gala-dinner-lagos, /journal/events/delborough-dinner | data.js:172 |  |
| C1269 | events / related | h3 | A Private Dinner at DANI, The Delborough | /journal, /journal/events/gala-dinner-lagos, /journal/events/lagos-office-event | data.js:174 |  |
| C1270 | events / related | p | A private dinner for clients and friends of Imperial at DANI, The Delborough Hotel, Lagos. | /journal, /journal/events/gala-dinner-lagos, /journal/events/lagos-office-event | data.js:175 |  |
| C1271 | events | card link | {n} photographs | /, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:427 | replaces "Read the story" once the cover photograph may be shown; JavaScript only: not in the prerendered HTML |
| C1272 | events | card chip (span.vmark) | Video | /, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:427,431 | event cards and journal rows once a clip has an id; JavaScript only: not in the prerendered HTML |

#### journal (11)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1273 | journal | eyebrow | Journal | /, /journal | app.js:304,436,440,451,656,749 (+1); index.html:49 |  |
| C1274 | journal | h2.d2 | Developments, insights and partnerships. | /, /journal | app.js:304,440 | written as separate lines in the source |
| C1275 | journal | div.meta | Partnerships · Easter 2026 | /, /journal | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C1276 | journal | h3 | Imperial Citizenship and Lagos Polo Club host the Easter Polo Cup after party | /, /journal | data.js:186 |  |
| C1277 | journal | p | An exclusive after party at Lagos Polo Club, Ikoyi, following the Easter Polo Cup. | /, /journal | data.js:186 |  |
| C1278 | journal | span.tlink | Read on | /, /journal | app.js:432 |  |
| C1279 | journal | div.meta | Partnerships · 19 February 2025 | /, /journal | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C1280 | journal | h3 | Imperial Citizenship sponsors Grenada’s 51st Independence Day after party in Dubai | /, /journal | data.js:184 |  |
| C1281 | journal | p | Following the official celebrations hosted by IMA Grenada and the Consulate General of Grenada in Dubai, Imperial Citizenship sponsored the evening at The Dubai EDITION. | /, /journal | data.js:184 |  |
| C1282 | journal | div.meta | Events · 2025 | /, /journal | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C1283 | journal | p | Members of the diplomatic community, clients and friends of Imperial, together for an evening in Lagos. | /, /journal | data.js:187 |  |

#### presence (27)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1284 | presence | svg aria-label | Map: headquarters in Dubai, a regional hub in Lagos, and relationships across Europe, the United States, Asia and the Caribbean | /, /about | app.js:236 |  |
| C1285 | presence | span.wmap-lbl | Dubai | /, /about | data.js:154,192,246; app.js:91,233 | aria-hidden (decorative) |
| C1286 | presence | span.wmap-lbl | Lagos | /, /about | data.js:160,164,167,171,174,193 (+1); app.js:233 | aria-hidden (decorative) |
| C1287 | presence | div aria-label | Where we work | /, /about | app.js:237,337 |  |
| C1288 | presence | button > span | Dubai | /, /about | data.js:154,192,246; app.js:91,233 |  |
| C1289 | presence | button > small | Headquarters | /, /about | data.js:192,246; app.js:233 |  |
| C1290 | presence | button > span | Lagos | /, /about | data.js:160,164,167,171,174,193 (+1); app.js:233 |  |
| C1291 | presence | button > small | Regional hub | /, /about | data.js:193,247; app.js:233 |  |
| C1292 | presence | button > span | 20+ countries | /, /about | app.js:233,235 |  |
| C1293 | presence | button > small | Worldwide | /, /about | app.js:233,235 |  |
| C1294 | presence | span.role | Headquarters | /, /about | data.js:192,246; app.js:233 |  |
| C1295 | presence | h3 | Dubai | /, /about | data.js:154,192,246; app.js:91,233 |  |
| C1296 | presence | p | Where the Group is led. | /, /about | data.js:192 |  |
| C1297 | presence | p.wm-addr | 804 Single Business Tower, Business Bay, Dubai, United Arab Emirates | /, /about | data.js:192 |  |
| C1298 | presence | span.role | Regional hub | /, /about | data.js:193,247; app.js:233 |  |
| C1299 | presence | h3 | Lagos | /, /about | data.js:160,164,167,171,174,193 (+1); app.js:233 |  |
| C1300 | presence | p | Close to our Clients and Partners across Nigeria and West Africa. | /, /about | data.js:193 |  |
| C1301 | presence | p.wm-addr | 8 Aromire Road, Ikoyi, Lagos 106104, Nigeria | /, /about | data.js:193 |  |
| C1302 | presence | span.role | Worldwide | /, /about | app.js:233,235 |  |
| C1303 | presence | h3 | 20+ countries | /, /about | app.js:233,235 |  |
| C1304 | presence | p | Partners, advisers and specialists, in relationships across: | /, /about | app.js:235 |  |
| C1305 | presence | text button | Europe | /, /about | data.js:196 |  |
| C1306 | presence | text button | The United States | /, /about | data.js:197 |  |
| C1307 | presence | text button | Asia | /, /about | data.js:198 |  |
| C1308 | presence | text button | The Caribbean and beyond | /, /about | data.js:199 |  |
| C1309 | presence | p.wmap-note | Regions are shown broadly to indicate relationships, not office locations. | /, /about | app.js:238 |  |
| C1310 | presence | clock (span.clock) | Local time {hh:mm} | /, /about | app.js:996 | map card, replaces the --:-- placeholder; JavaScript only: not in the prerendered HTML |

#### how we work (5)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1311 | how we work | eyebrow | How we work | /about, /divisions | app.js:246,248,322,345 |  |
| C1312 | how we work / closing / overview / cta band | button link > span | Speak to us | /about, /divisions, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights | app.js:202,325,366,369,377,413 (+5) |  |
| C1313 | how we work / how it works | span.ix | STEP 01 | /divisions, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:209 | STEP plus the number, from steps() |
| C1314 | how we work / how it works | span.ix | STEP 02 | /divisions, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:209 | STEP plus the number, from steps() |
| C1315 | how we work / how it works | span.ix | STEP 03 | /divisions, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy | app.js:209 | STEP plus the number, from steps() |

#### event (20)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1316 | event / article | span.share-l | Share | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:1738,1740 |  |
| C1317 | event | button aria-label | Copy link to this event | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:1739 | composed at run time; the fixed part is on this line |
| C1318 | event / article | button > span | Copy link | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:1739 |  |
| C1319 | event | button aria-label | Share this event | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:1740 | hidden until opened or triggered; composed at run time; the fixed part is on this line |
| C1320 | event / article | button > span | Share | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:1738,1740 | hidden until opened or triggered |
| C1321 | event / article | a aria-label | in, share on LinkedIn | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:1741 |  |
| C1322 | event / article | a | in | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:913,917,1741 |  |
| C1323 | event / article | a aria-label | WA, share on WhatsApp | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:1742 |  |
| C1324 | event / article | a | WA | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:1742 |  |
| C1325 | event / article | a aria-label | @, share by email | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:1743 |  |
| C1326 | event | dt | When | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026 | app.js:446 |  |
| C1327 | event | dt | Where | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:447 |  |
| C1328 | event | dt | Kind | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:447 |  |
| C1329 | event | dd | Diplomatic | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025 | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C1330 | event | button link > span | Start a strategic conversation | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:457 |  |
| C1331 | event | button link (outline) > span | All events | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:457 |  |
| C1332 | event | dd | To confirm: Venue to confirm Lagos | /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos | app.js:49 | composed at run time; the fixed part is on this line |
| C1333 | event | dd | Private gathering | /journal/events/gala-dinner-lagos, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:427,431,451 | category, city and date assembled from the event or journal row in data.js:154 to 187 |
| C1334 | event | note (p.xs) | To confirm: Date To confirm: Occasion | /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:49 | composed at run time; the fixed part is on this line |
| C1335 | event | glance row | Photographs / {n}, Imperial | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:448 | facts list, only while the gallery is shown; JavaScript only: not in the prerendered HTML |

#### gallery (11)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1336 | gallery | eyebrow | Gallery | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:459 |  |
| C1337 | gallery | h2.d2 | Film and photographs to follow. | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026 | app.js:459 | written as separate lines in the source |
| C1338 | gallery | note (p.xs) | Photographs will appear once guests have confirmed they are happy to be featured. | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:450 |  |
| C1339 | gallery | span.vid-tbc | To confirm: Highlights clip to be supplied | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026 | app.js:49 | composed at run time; the fixed part is on this line |
| C1340 | gallery | h2.d2 | Photographs to follow. | /journal/events/gala-dinner-lagos, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:292,439,450 | composed at run time; the fixed part is on this line |
| C1341 | gallery | button (vid-play) | Play | /, /about, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:121 | once a clip has an id; aria-label "Play {clip title}"; JavaScript only: not in the prerendered HTML |
| C1342 | gallery | h2 | The evening, in pictures. | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:459 | once guest consent is recorded for the event (or in a preview build); JavaScript only: not in the prerendered HTML |
| C1343 | gallery | h2 | The evening, on film. | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:459 | once a clip has an id and the gallery is still held back; JavaScript only: not in the prerendered HTML |
| C1344 | gallery | note (p.xs) | Photographs of guests are published with their permission. | /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:439,450 | once consent is recorded; JavaScript only: not in the prerendered HTML |
| C1345 | gallery | note (p.xs) | Preview build: photographs of guests are shown before their consent is recorded. | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:450 | preview builds only; JavaScript only: not in the prerendered HTML |
| C1346 | gallery | img alt text (fallback) | {event title}, photograph {i} of {n} | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:449 | only for a gallery photograph without a registry description; JavaScript only: not in the prerendered HTML |

#### related (3)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1347 | related | eyebrow | Related | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:152 |  |
| C1348 | related | h2.d2 | More evenings from the house. | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:152 | written as separate lines in the source |
| C1349 | related | h2 | More from the house. | /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:152 | related row under an article, once at least one insight is approved; JavaScript only: not in the prerendered HTML |

#### article (10)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1350 | article | div | Draft, awaiting approval. Final copy to be approved before publication. Author and publication date: To confirm: to confirm | /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:412 | written as separate lines in the source |
| C1351 | article | button aria-label | Copy link to this article | /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:1739 | composed at run time; the fixed part is on this line |
| C1352 | article | button aria-label | Share this article | /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:1740 | hidden until opened or triggered; composed at run time; the fixed part is on this line |
| C1353 | article | nav aria-label | More articles | /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:414 |  |
| C1354 | article | a > b | What “everything in writing” means in practice | /insights/before-a-first-conversation, /insights/your-client-stays-your-client | data.js:382 |  |
| C1355 | article | a > b | Why a multi-country family needs one point of contact | /insights/before-a-first-conversation, /insights/your-client-stays-your-client | data.js:366 |  |
| C1356 | article | a > b | Six things worth thinking about before a first conversation | /insights/explain-your-family-once, /insights/everything-in-writing | data.js:354 |  |
| C1357 | article | a > b | Your Client stays your Client: how introductions work | /insights/explain-your-family-once, /insights/everything-in-writing | data.js:374 |  |
| C1358 | article | toast | Link copied. Ready to paste. | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:1755 | after "Copy link" in the share bar; JavaScript only: not in the prerendered HTML |
| C1359 | article | browser prompt | Copy this link | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:1756 | only when the clipboard is not available; JavaScript only: not in the prerendered HTML |

#### insights list (2)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1360 | insights list / article | chip (draft) | Draft | /insights, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:403,412 |  |
| C1361 | insights list / hero | chip (draft) | Draft, awaiting approval | /insights, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | data.js:351; app.js:212,411 |  |

#### pagination (9)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1362 | pagination | nav aria-label | More events | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | app.js:462 |  |
| C1363 | pagination / article | a > small | Previous | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:414,462 |  |
| C1364 | pagination | a > b | Easter Polo Cup After Party | /journal/events/grenada-51-dubai, /journal/events/delborough-dinner | data.js:167 |  |
| C1365 | pagination / article | a > small | Next | /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing | app.js:414,462 |  |
| C1366 | pagination | a > b | The Lagos Diplomatic Soirée 2025 | /journal/events/grenada-51-dubai, /journal/events/gala-dinner-lagos | data.js:160,187 |  |
| C1367 | pagination | a > b | Grenada’s 51st Independence Day After Party | /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026 | data.js:154 |  |
| C1368 | pagination | a > b | Gala Dinner, Lagos | /journal/events/lagos-diplomatic-soiree-2025, /journal/events/lagos-office-event | data.js:164 |  |
| C1369 | pagination | a > b | An Evening at the Lagos Office | /journal/events/gala-dinner-lagos, /journal/events/delborough-dinner | data.js:171 |  |
| C1370 | pagination | a > b | A Private Dinner at DANI, The Delborough | /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event | data.js:174 |  |

#### legal (2)

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1371 | legal | placeholder chip | Placeholder | /privacy, /terms | app.js:614 | amber placeholder |
| C1372 | legal | note (p.small) | Last updated: To confirm: Date of the version approved by counsel | /privacy, /terms | app.js:617 | written as separate lines in the source |

### Behind the page (11)

Structured data that may surface in search results, the Journal feed, the web app name, the captions placeholder and the confirmation email sent by the function.

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1373 | meta | meta description | Selected Imperial events in Dubai and Lagos. | /journal/events | app.js:695 | the /journal/events alias of the Journal page; JavaScript only: not in the prerendered HTML |
| C1374 | meta | Organization description (JSON-LD) | One house with five specialist divisions: Imperial Citizenship, Imperial Private Office, Imperial Partners Club, Imperial Academy and Imperial Real Estate. | all pages | app.js:709 | structured data on every page; may surface in search results; JavaScript only: not in the prerendered HTML |
| C1375 | meta | web app name | Imperial Holdings Group / Imperial | all pages | site.webmanifest | name and short_name on a home screen; JavaScript only: not in the prerendered HTML |
| C1376 | feed | RSS feed title | Imperial Holdings Group Journal | /journal/feed.xml | build/build.js:219,223; index.html:24 | JavaScript only: not in the prerendered HTML |
| C1377 | feed | RSS feed description | Company developments, insights, partnerships and selected Imperial events in Dubai and Lagos. | /journal/feed.xml | build/build.js:220 | JavaScript only: not in the prerendered HTML |
| C1378 | media | captions cue | TO CONFIRM: captions for this clip | /, /about, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner | assets/captions/*.vtt | the one placeholder cue in each of the five captions files; JavaScript only: not in the prerendered HTML |
| C1379 | email | subject | Your enquiry with Imperial Holdings Group | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | netlify/functions/lib/email.js:35 | confirmation email, enquiry and contact forms; JavaScript only: not in the prerendered HTML |
| C1380 | email | greeting | Dear {first name}, | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | netlify/functions/lib/email.js:32 | "Hello," when the first name is not a plain word; JavaScript only: not in the prerendered HTML |
| C1381 | email | opening | Thank you for your enquiry. It has reached {Division name}, and one person will be your point of contact. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | netlify/functions/lib/email.js:40 | JavaScript only: not in the prerendered HTML |
| C1382 | email | next step | One next step: reply to this email with a good time for a first conversation, or call the office. | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | netlify/functions/lib/email.js:43 | followed by the two office lines; JavaScript only: not in the prerendered HTML |
| C1383 | email | sign-off | Kind regards, / Imperial Holdings Group / {sender address} | /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact | netlify/functions/lib/email.js:51 | JavaScript only: not in the prerendered HTML |

### In data.js, not rendered today (23)

Carried in the content file but read by no view, or held back by the consent gate.

| ID | Section | Element | Current wording | Routes | Source | Notes |
|---|---|---|---|---|---|---|
| C1384 | divisions | division tagline (tag) | Global mobility. Greater possibilities. | none | data.js:252; shared/ecosystem.json via data.js:15 | Imperial Citizenship; not rendered on the IHG site (no view reads divisions[].tag); the sister site tagline |
| C1385 | divisions | division tagline (tag) | A global network for growth. Together further. | none | data.js:272; data.js:16 | Imperial Partners Club; not rendered |
| C1386 | divisions | division tagline (tag) | Personalised solutions for exceptional clients. | none | data.js:293; data.js:17 | Imperial Private Office; not rendered |
| C1387 | divisions | division tagline (tag) | Curated properties. Enduring value. | none | data.js:313; data.js:18 | Imperial Real Estate; not rendered |
| C1388 | divisions | division tagline (tag) | Education. Talent. Leadership. A stronger tomorrow. | none | data.js:329; data.js:19 | Imperial Academy; not rendered |
| C1389 | divisions | division card copy (card) | Our flagship house. Residency and citizenship by investment, compared side by side and carried from first conversation to completed application. | none | data.js:255 | not rendered (no view reads divisions[].card) |
| C1390 | divisions | division card copy (card) | Our Partner network across industries: introducers, advisers and service-line Partners. Your Client stays your Client. | none | data.js:275 | not rendered |
| C1391 | divisions | division card copy (card) | A concierge for our existing Clients: relocation, schools, structuring, banking and introductions, through one point of contact. | none | data.js:296 | not rendered |
| C1392 | divisions | division card copy (card) | Licensed property advisory, starting with Dubai: search, selection and purchase support. Not yet launched. | none | data.js:316 | not rendered |
| C1393 | divisions | division card copy (card) | Our learning arm. Training and certification for our people and our Partners, so every conversation meets one standard. | none | data.js:332 | not rendered |
| C1394 | divisions | who it is for (who[1]) | Families whose residency plans include property. | none | data.js:324 | Real Estate; the Real Estate page renders no "Who it is for" block and the comparison shows who[0] only |
| C1395 | divisions | who it is for (who[2]) | Selected direct buyers. | none | data.js:324 | Real Estate; not rendered |
| C1396 | ecosystem | site role | The parent of five specialist divisions, led from Dubai and Lagos | none | data.js:14; shared/ecosystem.json | SITES[].role; not rendered on this site, carried for the sister sites |
| C1397 | ecosystem | site role | The flagship: second residency and citizenship by investment, from first conversation to completed application | none | data.js:15; shared/ecosystem.json | not rendered |
| C1398 | ecosystem | site role | For professionals: the network of lawyers, bankers, wealth advisers and family offices who introduce families to us | none | data.js:16; shared/ecosystem.json | not rendered |
| C1399 | ecosystem | site role | For existing Clients: one lasting relationship for families with multi-country lives | none | data.js:17; shared/ecosystem.json | not rendered |
| C1400 | ecosystem | site role | Coming soon: licensed property advisory, starting with Dubai | none | data.js:18; shared/ecosystem.json | not rendered |
| C1401 | ecosystem | site role | Learning and standards: training and certification for the people who do this work | none | data.js:19; shared/ecosystem.json | not rendered |
| C1402 | media | video title (hero loop) | Hero loop | none | data.js:127 | the hero loop renders as a silent video element without a caption, so the title and the duration ("10 to 15 seconds, silent") never show |
| C1403 | media | img alt text (hero, consent pending) | Guests at the Lagos office on Aromire Road, Ikoyi | none | data.js:54 | the intended home hero; shows once consent is recorded for the Lagos office evening |
| C1404 | media | img alt text (hero night, consent pending) | A speaker at the Imperial Citizenship gala dinner, Lagos | none | data.js:55 | the night layer of the home hero; consent pending |
| C1405 | how we work | unused view (story()) | Chapter {n} of {total} | none | app.js:249 | story() is defined but never called; its chapter labels and the "How we work" aria-label (app.js:246,248) never render |
| C1406 | what we do | h2 fallback | What we do. | none | app.js:351 | fallback heading for a division page without its own "What we do" title; every division that renders the block has one, so it never shows |

## Not inventoried

* The search palette keyword lists (app.js:1768 to 1785, `kw`), which steer matching and never show.
* Hidden form field names and values, class names, selectors, URLs, image and logo file names, logo colour variants (Gold, White, Black), JSON-LD type and field names, keyboard key names (Escape, Tab, Enter, End) and the console message "Page render failed" (app.js:805).
* The leaders' initials in data.js:240,241 (ZA, HI), which no view reads.
* `shared/chrome/header.html` and `footer.html`: templates for the sister sites, not rendered on this site (their copy mirrors the IHG header and footer above).
* The Pipedrive note and the lead labels written by the functions (team-facing, not public).

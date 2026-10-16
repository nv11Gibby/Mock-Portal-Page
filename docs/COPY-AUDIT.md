# Copy audit: current wording versus proposed (v6 deliverable 1)

Every public string of the Imperial Holdings Group site (branch ihg-site, built with `npm run build`), with the proposed v6 wording beside it. "Current" is captured verbatim from the built pages; "Proposed" follows docs/BRAND-GUIDE.md and docs/voice-rules.json, the claims audit (docs/CLAIMS-AUDIT.md), the hero decision (docs/HERO-OPTIONS.md) and the Start a Relationship journey (docs/RELATIONSHIP-JOURNEY.md). Actions: keep (unchanged), edit (new wording), hold (kept out until a record or decision exists; shown as a To confirm placeholder where the page needs a line), remove (the element goes). Where the hero line or hero visual the Founder chooses differs from the recommendation, the hero rows change accordingly.

## Summary

| Action | Strings |
|---|---|
| edit | 319 |
| keep | 1048 |
| hold | 32 |
| remove | 7 |
| total | 1406 |

Ordering follows the copy inventory: shared strings first (all pages), then each route in the order it reads, then strings that exist only through JavaScript or data.


## / (86 strings, 46 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0001 | meta | page title | Imperial Holdings Group · Two Cities. One Horizon. | keep |  |  |
| C0002 | meta | meta description | Imperial Holdings Group: five specialist divisions, led from Dubai and Lagos. Citizenship, Private Office, Partners Club, Academy and Real Estate. | edit | A world of opportunity. Built around relationships. Imperial Holdings Group is the parent of five specialist divisions, led from Dubai and Lagos. | a bare list; now carries the decided hero line and the verified Group fact, 143 characters |
| C0003 | hero | eyebrow | Imperial Holdings Group · Dubai · Lagos | keep |  |  |
| C0004 | hero | h1.d1 | Two Cities. One Horizon. | edit | A world of opportunity. Built around relationships. | hero-final headline, verbatim; Two Cities. One Horizon. moves to the closing band and the footer |
| C0005 | hero | lead paragraph | Five specialist divisions, one standard, and one person who knows your family. | edit | An international group bringing together mobility, private client services, real estate and professional partnerships. One connected ecosystem, serving ambitions that extend beyond borders. One named person looks after each relationship for the long term, with the judgement to say plainly what is possible, and what is not. | hero-final supporting copy, verbatim |
| C0006 | hero | button link (gold) > span | Explore our ecosystem | edit | Start a relationship | primary call to action per hero-final and the journey entry list; opens the three-path journey |
| C0007 | hero | small | For private clients | edit | For private clients, partners and institutions | editor: the writer named all three paths but at 61 characters the small line under a button ran long; the same three audiences, shorter; writer: the primary action now serves all three paths, so the small line names them |
| C0008 | hero | button link (outline) > span | Partner with us | edit | Our divisions | secondary call to action per the journey entry list; names the destination |
| C0009 | hero | small | For professional partners | edit | Five specialist divisions, one standard | the secondary action now opens the divisions index, so the small line says what is there |
| C0010 | hero | p.hh-time | In Dubai it is --:--. | keep |  |  |
| C0011 | hero | p.hh-cred | To confirm: Final hero photo | keep |  |  |
| C0012 | hero | span.cue | Scroll | delete |  | UX audit item 23: the decorative scroll cue is removed (v6/ux) |
| C0013 | the Group | eyebrow | The Group | keep |  |  |
| C0014 | the Group | h2.d2 | A house for a life across borders. | edit | One institution. Five specialist divisions. | hero-final Group intro headline, verbatim |
| C0015 | the Group | lead paragraph | Imperial Holdings Group is the parent of five specialist divisions, led from Dubai and Lagos. We help families and their advisers decide where they live, what they own and what they leave behind. | edit | Imperial Holdings Group is the parent of five specialist divisions, led from Dubai and Lagos. Imperial Citizenship, the flagship, advises families and founders on second residency and citizenship by investment. Four further divisions, two of them in preparation, extend that relationship. Families, and the professionals who advise them, are served by one group, through one named person. | hero-final Group intro, verbatim |
| C0016 | the Group / leadership | text link | About the Group | keep |  |  |
| C0017 | the Group | span | years of combined experience | remove |  | figures band removed per claims C06 to C10: no dated source for the figure; reinstate only as a sentence with an as-at date |
| C0018 | the Group | span | Client engagements | remove |  | figures band removed per claims C06 to C10: no dated source for the figure; reinstate only as a sentence with an as-at date |
| C0019 | the Group | span | individuals served | remove |  | figures band removed per claims C06 to C10: no dated source for the figure; reinstate only as a sentence with an as-at date |
| C0020 | the Group | span | countries with relationships | remove |  | figures band removed per claims C06 to C10: no dated source for the figure; reinstate only as a sentence with an as-at date |
| C0021 | the Group | span | strategic relationships | remove |  | figures band removed per claims C06 to C10: no dated source for the figure; reinstate only as a sentence with an as-at date |
| C0022 | the Group | p.figs-note | Figures from the Imperial Holdings brochure. To confirm: "As at" date for these figures | remove |  | claims C11: no Imperial Holdings brochure carries these figures; the line goes with the band |
| C0023 | ecosystem | h2.d2 | Five divisions. One table. | keep |  |  |
| C0024 | ecosystem | lead paragraph | Each division is a specialist. Together they sit at one table, so the person advising on your residency already knows about the home, the company and the school. | keep |  |  |
| C0025 | ecosystem | span.vl | Citizenship | keep |  |  |
| C0026 | ecosystem | h3 | Imperial Citizenship | edit | Where the Group began. | hero-final division headline; the label above and the Discover link keep the name |
| C0027 | ecosystem | p | Second residency and citizenship by investment, from first conversation to completed application. | edit | The flagship, and often the first step: second residency and citizenship by investment, carried from first conversation to completed application. | hero-final division line, verbatim |
| C0028 | ecosystem | span.tlink | Discover Citizenship | keep |  |  |
| C0029 | ecosystem | span.vl | Partners Club | keep |  |  |
| C0030 | ecosystem | h3 | Imperial Partners Club | edit | For the professionals families trust. | hero-final division headline; the label above and the Discover link keep the name |
| C0031 | ecosystem | p | The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | edit | Lawyers, bankers, advisers and family offices who introduce Clients to the Group, on written terms, with clear updates. Your Client stays yours. | hero-final division line, verbatim; drops wealth advisers |
| C0032 | ecosystem | span.tlink | Discover Partners Club | keep |  |  |
| C0033 | ecosystem | span.vl | Private Office | keep |  |  |
| C0034 | ecosystem | h3 | Imperial Private Office | edit | The relationship, continued. | hero-final division headline; the label above and the Discover link keep the name |
| C0035 | ecosystem | p | One lasting relationship for families with multi-country lives. | edit | Ongoing support for existing Imperial Clients after the first service is complete: relocation, schools, structuring and introductions, through one point of contact. | hero-final division line, verbatim; says it serves existing Clients after the first service |
| C0036 | ecosystem | span.tlink | Discover Private Office | keep |  |  |
| C0037 | ecosystem | span.vl | Real Estate | keep |  |  |
| C0038 | ecosystem | h3 | Imperial Real Estate | edit | Property in Dubai, in preparation. | hero-final division headline; says in preparation |
| C0039 | ecosystem | p | Licensed property advisory, starting with Dubai. | edit | Property advisory, not yet launched: search, selection and purchase support, coordinated with Imperial Citizenship where a home and residency meet. Interest can be registered now. | hero-final division line, verbatim; not yet launched, interest can be registered |
| C0040 | ecosystem | span.tlink | Register interest | keep |  |  |
| C0041 | ecosystem | span.vl | Academy | keep |  |  |
| C0042 | ecosystem | h3 | Imperial Academy | edit | Learning and standards, in preparation. | hero-final division headline; says in preparation |
| C0043 | ecosystem | p | Learning, training and certification for the people who do this work. | edit | The Group's learning arm, in preparation: training and certification to one shared standard, for our own people and for Partner teams. | hero-final division line, verbatim; in preparation, not operating |
| C0044 | ecosystem | span.tlink | Discover Academy | keep |  |  |
| C0045 | ecosystem | span | Hover, focus or tap a division to open it. | keep |  |  |
| C0046 | network | eyebrow | Our Network | edit | Our network | eyebrows are sentence case in the source |
| C0047 | network | h2.d2 | One relationship. Many doors. | keep |  |  |
| C0048 | network | lead paragraph | Most relationships begin with a single question and grow from there. The ecosystem exists so that each step is taken with the others in view. | edit | Most relationships begin with a single question and grow from there. The steps below are an illustration of how one might unfold, each step taken with the others in view. | editor: "not a case" is audit language a visitor will not read as intended; "an illustration of how one might unfold" labels the steps as an illustration (claims C73) in plain words and keeps the lead to two sentences; writer: labels the four steps as an illustration (claims C73) and drops a third ecosystem on the page |
| C0049 | network | ol aria-label | How a relationship with Imperial grows | edit | An illustration of how a relationship with Imperial might grow | editor: the aria-label says the same thing as the lead, plainly, without "not a case"; writer: the list is an illustration in the conditional, and the screen reader hears so |
| C0050 | network | h3.h3 | Citizenship | keep |  |  |
| C0051 | network | p | A business owner first approaches Imperial for Grenada citizenship. | edit | A family might first come to Imperial Citizenship for a second residency or citizenship. | claims C73: the worked example becomes an illustration in the conditional; the named programme and the business owner go |
| C0052 | network | text link | Imperial Citizenship | keep |  |  |
| C0053 | network | h3.h3 | Property | keep |  |  |
| C0054 | network | p | Later, the family acquires an investment property through Imperial Real Estate. | edit | In time, the same family could look for a home in Dubai with Imperial Real Estate, once it launches. | conditional, and says Real Estate has not launched; investment property implied an investment service |
| C0055 | network | text link | Imperial Real Estate | keep |  |  |
| C0056 | network | h3.h3 | Introduction | keep |  |  |
| C0057 | network | p | They introduce another entrepreneur through Imperial Partners Club. | edit | Their lawyer or banker might introduce another family through Imperial Partners Club, which is opening in stages. | conditional; introductions come from the professionals who advise them, and Partners Club is opening in stages |
| C0058 | network | h3.h3 | Private Office | keep |  |  |
| C0059 | network | p | In time, the relationship broadens into a Private Office relationship. | edit | After the first service is complete, the relationship could continue through Imperial Private Office, once it is established. | editor: "as it is established" read as if the relationship and the division grow in step; "once it is established" says plainly that Private Office is not yet operating, and matches "once it launches" in the Property step; the sentence no longer opens with "And"; writer: conditional; says Private Office is being established; relationship no longer twice in one line |
| C0060 | network | text link | Imperial Private Office | keep |  |  |
| C0061 | network | note (p.xs) | Imperial gatherings in Dubai and Lagos. Photographs of guests appear once they have confirmed they are happy to be featured. See selected events | keep |  |  |
| C0062 | network | h3 | Private Clients | keep |  |  |
| C0063 | network | p | Mobility, property and selected private services. | edit | Individuals and families: a second residency or citizenship, a home in Dubai, or the continuing support of the Private Office. | editor: this card is now the home entry to the Private Clients path, so it takes the chooser text from relationship-journey.json; "Mobility, property and selected private services" was vague and read as a brochure line |
| C0064 | network | button link (gold) > span | Explore Client Services | edit | Arrange a first conversation | hero-final call to action for the Private Clients path; the card becomes the home path card |
| C0065 | network | h3 | Professional Partners | keep |  |  |
| C0066 | network | p | Advisers, family offices, institutions and business introducers. | edit | Lawyers, bankers, advisers and family offices who introduce Clients, and Partner teams who will train with Imperial Academy. | editor: the Academy is in development, so the training is future tense; otherwise the chooser text from relationship-journey.json, less wealth, Clients capitalised |
| C0067 | network | button link (outline) > span | Explore Imperial Partners Club | edit | Discuss becoming a Partner | hero-final call to action for the Professional Partners path |
| C0068 | network | h3 | Institutions & Strategic Relationships | edit | Institutions and Strategic Relationships | the path name takes and, never an ampersand |
| C0069 | network | p | Developers, governments, service providers and strategic collaborators. | edit | Governments, missions, institutions and organisations exploring a relationship with the Group. | editor: the card is the home entry to the Institutions and Strategic Relationships path and takes the chooser text from relationship-journey.json, so the three cards and the chooser say the same thing; claims C74 verifies the audience either way; writer: claims C74 optional precision: the agencies that run programmes, not governments |
| C0070 | network | button link (outline) > span | Start a Strategic Conversation | edit | Open a strategic conversation | hero-final call to action for the Institutions path, sentence case |
| C0071 | leadership | lead paragraph | Imperial is led by its founder, with one Group team working across every division. | edit | Imperial is led by its Founder, with one Group team working across every division. | the Founder takes a capital when it means Imperial's |
| C0072 | leadership | p | Each division has its own leadership, introduced on its website. Group biographies: To confirm: to be approved | edit | Divisional leadership is introduced on each division's website as it is published. Group biographies: To confirm: to be approved | claims C30: only one division website is live; the placeholder stays |
| C0073 | events | h2.d2 | Gatherings worth the evening. | edit | Relationships, in person. | worth the evening sells the occasion; events are evidence of relationships, not the product |
| C0074 | events | lead paragraph | Diplomatic collaborations, private gatherings and the relationships behind them. | edit | Diplomatic occasions, private gatherings and the relationships behind them, in Dubai and Lagos. | claims C82 wording: collaborations rests on one sponsorship |
| C0075 | events | text link | All events and the Journal | keep |  |  |
| C0076 | journal | lead paragraph | Fewer entries, chosen with care: genuine company developments, insights, partnerships and selected events. | edit | Fewer entries, chosen with care: company developments, insights and selected events. | claims C83 drops partnerships; genuine protests too much |
| C0077 | journal | button link (outline) > span | Read the Journal | keep |  |  |
| C0078 | presence | eyebrow | Global presence | edit | Where we work | global is not a house word (international is); names the section plainly and matches the map tablist |
| C0079 | presence | h2.d2 | Led from Dubai and Lagos. | keep |  |  |
| C0080 | presence | lead paragraph | Headquarters in Dubai, a regional hub in Lagos and relationships with Partners, advisers and specialists in more than 20 countries. | edit | Headquarters in Dubai, an office in Lagos, and relationships with Partners, advisers and specialists in the Caribbean, Europe and the Gulf. | claims C12 wording: no record for 20 countries or for regional hub |
| C0081 | hero | greeting (span#greet) | Good morning. | keep |  |  |
| C0082 | hero | greeting (span#greet) | Good afternoon. | keep |  |  |
| C0083 | hero | greeting (span#greet) | Good evening. | keep |  |  |
| C0084 | film | eyebrow | On film | keep |  |  |
| C0085 | film | h2 | The evening, in motion. | keep |  |  |
| C0086 | meta | og:description (static) | Five specialist divisions, one standard, and one person who knows your family. Led from Dubai and Lagos. | keep |  |  |

## /about (59 strings, 14 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0087 | meta | page title | About · Imperial Holdings Group | keep |  |  |
| C0088 | meta | meta description | Imperial began as a citizenship and residency specialist and has grown into a group of five specialist divisions, run by one team to one standard. | edit | Imperial began as a citizenship and residency specialist and is now the parent of five divisions, run by one team to one standard. The people behind the Group. | editor: the writer's second sentence had no subject, so 'and the people behind it' hung off 'the parent of five divisions'; one plain sentence carries the C34 softening and a short second names what the page adds; 159 characters |
| C0089 | hero | span | About | keep |  |  |
| C0090 | hero | eyebrow | About Imperial Holdings Group | keep |  |  |
| C0091 | hero | h1.d1 | One house. Many services. | edit | One Group. One standard. | editor: the writer's line ran to six words against four in the mask layout and turned the hero to leadership alone; this keeps the shape and says what the lead goes on to say (one team, one standard) without repeating the home intro headline; writer: 'Many services' is a holding-company line any firm could use; this echoes the decided home intro and turns the page towards the leadership it now carries |
| C0092 | hero | lead paragraph | Imperial began as a citizenship and residency specialist. Over more than a decade of work with families and founders, it has grown into a group of five specialist divisions, run by one team to one standard. | edit | Imperial began as a citizenship and residency specialist and, through its work with families and founders, is now the parent of five specialist divisions, run by one team to one standard. This is where you meet the people behind the Group. | claims C33 and C34: the decade has no record and 'grown into' overstates; the softened wording is used and the lead names the page as the place to meet the people |
| C0093 | our story | eyebrow | Our story | keep |  |  |
| C0094 | our story | h2.d2 | From one question to a whole house. | edit | From one question to five divisions. | 'house' is body copy only; the headline keeps its shape and names the five divisions plainly |
| C0095 | our story | lead paragraph | Imperial Citizenship is where we began, and it remains our main business. Working with families on residency and citizenship taught us that one transaction rarely solves the whole problem. | edit | Imperial Citizenship is where we began, and it remains our main business. Working with families on residency and citizenship taught us that one application rarely answers the whole question. | 'transaction' and 'solves the whole problem' read transactionally; 'one application rarely answers the whole question' says the same thing warmly and sets up the next paragraph |
| C0096 | our story | p.muted | The residency question touches the home. The home touches the school. The company touches the tax position. And the trusted professionals our Clients already rely on needed a reliable house to hand those conversations to. | keep |  |  |
| C0097 | our story | p.muted | Imperial Holdings Group is the result: five specialist houses at one table, sharing one team, one standard and one record of each family, so that you never have to explain your family twice. | edit | Imperial Holdings Group is the result: five specialist divisions at one table, two of them in preparation, sharing one team, one standard and one record of each family, so that you never have to explain your family twice. | claims C34: the sentence implied all five operate; 'two of them in preparation' follows the decided group intro, and the formal word replaces 'houses' in the Group statement |
| C0098 | our story | note (p.small) | Founding date and milestones: To confirm: Group history and key dates | keep |  |  |
| C0099 | how we work | div aria-label | One table: your family at the centre, one Relationship Manager, and the five houses | edit | One table: your family at the centre, one Relationship Manager, and the five divisions | aria-label for screen readers: the formal word 'divisions' is plainer than the warm synonym |
| C0100 | how we work | b | Your family | keep |  |  |
| C0101 | how we work | span.ring-rm | One Relationship Manager | keep |  |  |
| C0102 | how we work | a > b | Citizenship | keep |  |  |
| C0103 | how we work | h2.d2 | One team. One point of contact. | keep |  |  |
| C0104 | how we work | lead paragraph | Our people work across the Group rather than inside a single division, so knowledge and standards travel with your family. | keep |  |  |
| C0105 | how we work | p | One Relationship Manager brings each house in when it is needed, together with qualified specialists for regulated matters such as tax, legal and investment. Where a service is best delivered by a trusted Partner, we coordinate it for you, so you still have one person to call. | keep |  |  |
| C0106 | our values | eyebrow | Our values | keep |  |  |
| C0107 | our values | h2.d2 | Wealthy in restraint. Rich in detail. | edit | Restrained in manner. Exact in detail. | 'wealthy' is an avoided word even as wordplay; the new pair keeps the shape and says restraint and exactness without a wealth reference |
| C0108 | our values | lead paragraph | The same standard in every house. We explain the process before we talk about outcomes, so you always know where you stand. | edit | The same standard in every division, whichever you come to first. Five values hold it in place. | the second sentence repeated the first value word for word on the same screen; the lead now introduces the five values instead |
| C0109 | our values | h3.h4 | Plain speaking | keep |  |  |
| C0110 | our values | p | We explain the process before we talk about outcomes, so you always know where you stand. | keep |  |  |
| C0111 | our values | h3.h4 | Everything in writing | keep |  |  |
| C0112 | our values | p | Options, costs and timelines are set out in writing, option by option, before you decide. | keep |  |  |
| C0113 | our values | h3.h4 | One named person | keep |  |  |
| C0114 | our values | p | One Relationship Manager across every house. You never have to explain your family twice. | keep |  |  |
| C0115 | our values | h3.h4 | Discretion | keep |  |  |
| C0116 | our values | p | Private matters stay private. Information is shared only where a service requires it. | keep |  |  |
| C0117 | our values | h3.h4 | For the long term | keep |  |  |
| C0118 | our values | p | The relationship carries on after the application: renewals, property and the next chapter. | keep |  |  |
| C0119 | our word | eyebrow | Our word | keep |  |  |
| C0120 | our word | h2.d2 | What we promise, and what we never will. | keep |  |  |
| C0121 | our word | div.plist-h | We will | keep |  |  |
| C0122 | our word | list item > span | Tell you plainly what is possible, and what is not. | keep |  |  |
| C0123 | our word | list item > span | Give honest timelines, and update them as things move. | keep |  |  |
| C0124 | our word | list item > span | Give you one named Relationship Manager. | keep |  |  |
| C0125 | our word | list item > span | Keep private matters private. | keep |  |  |
| C0126 | our word | list item > span | Stay after the paperwork is done. | keep |  |  |
| C0127 | our word | div.plist-h | We never will | keep |  |  |
| C0128 | our word | list item > span | Guarantee an outcome that a government decides. | keep |  |  |
| C0129 | our word | list item > span | Claim influence with, or shortcuts through, any government. | keep |  |  |
| C0130 | our word | list item > span | Give regulated advice without a qualified specialist. | keep |  |  |
| C0131 | our word | list item > span | Share your information beyond what a service needs. | keep |  |  |
| C0132 | our word | list item > span | Rush you into a decision. | keep |  |  |
| C0133 | leadership | lead paragraph | Imperial is led by its founder, with one Group team working across every division. Each division’s own leadership is introduced on its website. | edit | Imperial is led by its Founder, with one Group team working across every division. Divisional leadership is introduced on each division’s website as it is published. | claims C30: only one division site is live, so 'as it is published' is added; 'the Founder' takes its capital |
| C0134 | leadership | p | Imperial Holdings Group Biography: To confirm: to be approved | keep |  |  |
| C0135 | leadership | div.role | Divisional leadership | keep |  |  |
| C0136 | leadership | h3 | Citizenship, Private Office, Partners Club, Academy and Real Estate | keep |  |  |
| C0137 | leadership | p | Introduced on each division’s website. | edit | Introduced on each division’s website as it is published. | claims C30: the division websites are in preparation, so the line says when the introduction will appear |
| C0138 | founder film | eyebrow | Founder film | keep |  |  |
| C0139 | founder film | h2.d2 | The founder, on film. | edit | The Founder, on film. | 'the Founder' takes a capital when it means Imperial's Founder |
| C0140 | founder film | lead paragraph | A short film with the founder, 60 to 90 seconds, is planned for this page. To confirm: Footage to be supplied | edit | A short film with the Founder, 60 to 90 seconds, is planned for this page. To confirm: Footage to be supplied | 'the Founder' takes a capital; the placeholder stays as it is |
| C0141 | founder film | img alt text | Founder film (poster) | keep |  |  |
| C0142 | founder film | span.vid-tbc | To confirm: Footage to be supplied | keep |  |  |
| C0143 | founder film | figure caption | Founder film · 60 to 90 seconds · Captions | keep |  |  |
| C0144 | presence | eyebrow | Where we work | keep |  |  |
| C0145 | presence | h2.d2 | Led from Dubai. At home worldwide. | edit | Led from two cities. Relationships across borders. | 'At home worldwide' exaggerates beyond the record (two offices; relationships in the Caribbean, Europe and the Gulf per claims C12 and C13); 'across borders' is the house phrase |

## /divisions (144 strings, 42 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0146 | meta | page title | Divisions · Imperial Holdings Group | keep |  |  |
| C0147 | meta | meta description | Citizenship, Private Office, Partners Club, Academy and Real Estate: five specialist houses at one table, with one Relationship Manager across all five. | edit | The five Imperial divisions: Citizenship, Partners Club, Private Office, Real Estate and the Academy, with one Relationship Manager across all five. | uses the formal word and the division short names; the one-Relationship-Manager promise is verified (claims C39); under 160 characters |
| C0148 | hero | span | Divisions | keep |  |  |
| C0149 | hero | eyebrow | Our divisions | keep |  |  |
| C0150 | hero | h1.d1 | Five houses. One table. | edit | Five divisions. One table. | the guide's own example of the two-line headline; 'house' is body copy only |
| C0151 | hero | lead paragraph | Each house is a specialist. Together they sit at one table, with one Relationship Manager across all five. | edit | Each division is a specialist. Together they sit at one table, with one Relationship Manager across all five. | the guide's example lead, keeping the verified Relationship Manager promise; 'house' is body copy only |
| C0152 | division index | a.drow > span | Citizenship | keep |  |  |
| C0153 | division index | a.drow > span | Second residency and citizenship by investment, from first conversation to completed application. | edit | The flagship, and often the first step: second residency and citizenship by investment, carried from first conversation to completed application. | the decided Citizenship line from hero-final.json, used verbatim (the same data string as the home ecosystem) |
| C0154 | division index | a.drow > span | The flagship | keep |  |  |
| C0155 | division index | a.drow > span | Partners Club | keep |  |  |
| C0156 | division index | a.drow > span | The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | edit | Lawyers, bankers, advisers and family offices who introduce Clients to the Group, on written terms, with clear updates. Your Client stays yours. | the decided Partners Club line from hero-final.json, verbatim; drops 'wealth advisers' (avoided word) and carries the Partner promise |
| C0157 | division index | a.drow > span | For professionals | edit | Opening in stages | claims C49: the Partners Club network is at pilot stage, so the status says so (as the division page and menu now do) |
| C0158 | division index | a.drow > span | Private Office | keep |  |  |
| C0159 | division index | a.drow > span | One lasting relationship for families with multi-country lives. | edit | Ongoing support for existing Imperial Clients after the first service is complete: relocation, schools, structuring and introductions, through one point of contact. | the decided Private Office line from hero-final.json, verbatim |
| C0160 | division index | a.drow > span | For existing Clients | edit | By invitation, being established | claims C59: go-live has not started; the status says so (as the division page and menu now do) |
| C0161 | division index | a.drow > span | Real Estate | keep |  |  |
| C0162 | division index | a.drow > span | Licensed property advisory, starting with Dubai. | edit | Property advisory, not yet launched: search, selection and purchase support, coordinated with Imperial Citizenship where a home and residency meet. Interest can be registered now. | the decided Real Estate line from hero-final.json, verbatim: says plainly that it has not launched and that interest can be registered |
| C0163 | division index | a.drow > span | Coming soon | keep |  | editor: kept as Coming soon: the Real Estate status chip in the already-edited divisions group (C1242) says Coming soon, and the index, compare row and finder use the same status words as the division page and the menu; writer proposed: 'Coming soon' is a retail phrase; 'in preparation' is the decided wording for Real Estate (hero-final headline) and matches the ecosystem menu |
| C0164 | division index | a.drow > span | Academy | keep |  |  |
| C0165 | division index | a.drow > span | Learning, training and certification for the people who do this work. | edit | The Group’s learning arm, in preparation: training and certification to one shared standard, for our own people and for Partner teams. | the decided Academy line from hero-final.json, verbatim: says it is in preparation |
| C0166 | division index | a.drow > span | Learning and standards | edit | Learning and standards, in development | claims C68: the Academy is internal and in development; the status says so (as the division page now does) |
| C0167 | finder | eyebrow | Not sure where to start? | edit | Where to begin | an eyebrow is a two-to-four-word label, not a question; this names the section |
| C0168 | finder | h2.d2 | Find your house. | edit | Find the right division. | 'house' is body copy only; matches the search palette entry for the finder |
| C0169 | finder | lead paragraph | Two questions, and we will show which divisions would sit at your table. A starting point, not advice. | keep |  |  |
| C0170 | finder | h3.h3 | Who is this for? | keep |  |  |
| C0171 | finder | button > b | A family | keep |  |  |
| C0172 | finder | button > small | Planning where to live, study and settle | keep |  |  |
| C0173 | finder | button > b | A founder | keep |  |  |
| C0174 | finder | button > small | Building a business or a regional base | keep |  |  |
| C0175 | finder | button > b | An existing Imperial Client | keep |  |  |
| C0176 | finder | button > small | Looking for what comes next | keep |  |  |
| C0177 | finder | button > b | A lawyer, banker or adviser | keep |  |  |
| C0178 | finder | button > small | With Clients who ask about life abroad | edit | With clients who ask about life abroad | editor: these are the adviser's own clients in the general sense, not people Imperial serves, so 'client' is lower case (voice-rules capitalise: Client); the meaning of the option is unchanged |
| C0179 | finder | button > b | Interested in learning or a career | keep |  |  |
| C0180 | finder | button > small | Training, certification or joining us | keep |  |  |
| C0181 | finder | h3.h3 | What matters most? | keep |  |  |
| C0182 | finder | span.fd-hint | Choose as many as you like | keep |  |  |
| C0183 | finder | span.an | Live | keep |  |  |
| C0184 | finder | p | Where the family can live, travel, study and settle. | keep |  |  |
| C0185 | finder | span.an | Build | keep |  |  |
| C0186 | finder | p | A business, a career or a presence in a new market. | keep |  |  |
| C0187 | finder | span.an | Structure | keep |  |  |
| C0188 | finder | p | How assets, companies and the family are organised. | keep |  |  |
| C0189 | finder | span.an | Invest | keep |  |  |
| C0190 | finder | p | Property and opportunities that fit the plan. | edit | Property in Dubai, and banking introductions that fit the plan. | 'opportunities' hinted at an investment capability the Group does not claim; the line now names what the two divisions behind this ambition would offer |
| C0191 | finder | span.an | Protect | keep |  |  |
| C0192 | finder | p | Security for what you have built, and who you love. | keep |  |  |
| C0193 | finder | span.an | Experience | keep |  |  |
| C0194 | finder | p | The access and ease that come with a wider life. | edit | The occasions and introductions that come with a wider life. | 'access' offered status as the benefit; the line names the occasions and the people, as the Private Office page now does |
| C0195 | finder | div aria-label | Your table | keep |  |  |
| C0196 | finder | h3 | Your table | keep |  |  |
| C0197 | finder | p | Choose who this is for, or what matters most, and we will show which houses would sit at your table. | edit | Choose who this is for, or what matters most, and we will show which divisions would sit at your table. | 'houses' becomes 'divisions' throughout the finder, so the result reads as the formal choice it is |
| C0198 | finder | note (p.xs) | A starting point, not advice. Your Relationship Manager confirms the right house in the first conversation. | edit | A starting point, not advice. Your Relationship Manager confirms the right division in the first conversation. | 'house' becomes 'division' to match the rest of the finder |
| C0199 | compare | eyebrow | At a glance | keep |  |  |
| C0200 | compare | h2.d2 | Five houses, side by side. | edit | Five divisions, side by side. | 'houses' is body copy only; the headline keeps its shape |
| C0201 | compare | lead paragraph | Who each house is for and what it covers. Whichever you start with, the same Relationship Manager brings in the others. | edit | Who each division is for, what it covers and where it stands today. Whichever you start with, the same Relationship Manager brings in the others. | adds 'where it stands today', since the status row now says which divisions operate and which are in preparation |
| C0202 | compare | div aria-label | Divisions compared, scrolls sideways | keep |  |  |
| C0203 | compare | caption.vh | The five Imperial houses compared | edit | The five Imperial divisions compared | screen reader caption: the formal word is the plain one |
| C0204 | compare | th > a | Citizenship | keep |  |  |
| C0205 | compare | th > span | The flagship | keep |  |  |
| C0206 | compare | th > a | Partners Club | keep |  |  |
| C0207 | compare | th > span | For professionals | edit | Opening in stages | claims C49: the same status string as the division index |
| C0208 | compare | th > a | Private Office | keep |  |  |
| C0209 | compare | th > span | For existing Clients | edit | By invitation, being established | claims C59: the same status string as the division index |
| C0210 | compare | th > a | Real Estate | keep |  |  |
| C0211 | compare | th > span | Coming soon | keep |  | editor: kept as Coming soon, the Real Estate status on the division page (divisions C1242) and in the menu; writer proposed: the same status string as the division index; the decided Real Estate wording |
| C0212 | compare | th > a | Academy | keep |  |  |
| C0213 | compare | th > span | Learning and standards | edit | Learning and standards, in development | claims C68: the same status string as the division index |
| C0214 | compare | th | For | keep |  |  |
| C0215 | compare | td | Families who want more choices for their children. | keep |  |  |
| C0216 | compare | td | Introducers who are often asked about life and investment abroad. | keep |  |  |
| C0217 | compare | td | Existing Imperial Clients and their families. | keep |  |  |
| C0218 | compare | td | Imperial Clients choosing a home in Dubai. | keep |  |  |
| C0219 | compare | td | Our own team, across every house. | keep |  |  |
| C0220 | compare | th | Covers | keep |  |  |
| C0221 | compare | list item | Citizenship by investment | keep |  |  |
| C0222 | compare | list item | UAE and European residency | keep |  |  |
| C0223 | compare | list item | Global mobility strategy | keep |  |  |
| C0224 | compare | list item | Introducers | keep |  |  |
| C0225 | compare | list item | Advisers | keep |  |  |
| C0226 | compare | list item | Service-line Partners | keep |  |  |
| C0227 | compare | list item | Relocation and schools | keep |  |  |
| C0228 | compare | list item | Holding companies and structuring | edit | Structuring, through specialists | claims C61: the Private Office coordinates structuring through qualified specialists rather than offering holding companies as a service of its own |
| C0229 | compare | list item | Private banks and private equity | edit | Banking introductions | claims C61: no record of any private equity relationship; introductions to private banks are what the record supports |
| C0230 | compare | list item | Dubai residential | keep |  |  |
| C0231 | compare | list item | Search and selection | keep |  |  |
| C0232 | compare | list item | Purchase support | keep |  |  |
| C0233 | compare | list item | Team training | keep |  |  |
| C0234 | compare | list item | Partner Academy | edit | Partner Academy, to follow | claims C70: no Partner training has run yet; the bullet says it is to follow, as the Academy page now does |
| C0235 | compare | list item | Certification | keep |  |  |
| C0236 | compare | th | How it starts | keep |  |  |
| C0237 | compare | td | Listen: A first conversation about your family and your plans. No forms, no pressure. | keep |  |  |
| C0238 | compare | td | Introduce: Share your Client’s details, with their permission, through one simple form. | edit | Introduce: Tell us what your Client is considering. We ask for their details only once you have their permission and written terms are in place. | editor: the writer's line tied the Client's permission to telling us about the introduction; the journey (relationship-journey.json, partners scope) asks nothing about the Client up front and takes their details only with permission and written terms, so the cell now says exactly that, in the journey's words |
| C0239 | compare | td | Your contact: One named person who knows your family and your history with Imperial. | keep |  |  |
| C0240 | compare | td | Register interest ahead of launch. | keep |  |  |
| C0241 | compare | td | Learn: The common Imperial core: standards, discretion and how the houses work together. | keep |  |  |
| C0242 | compare | th | Online | keep |  |  |
| C0243 | compare | td > a | imperialcitizenship.com | keep |  |  |
| C0244 | compare | td > span | To confirm: Link to confirm | edit | To confirm: Website address | editor: the chip said to confirm twice; it names what is missing, as the division pages do for the other websites |
| C0245 | compare | td > span | At launch | keep |  |  |
| C0246 | compare | note (p.xs) | Swipe sideways to compare | keep |  |  |
| C0247 | how we work | h2.d2 | Come for one thing. Find a whole house. | edit | Come for one thing. Stay with one team. | 'house' is body copy only; the second line now carries the one-team promise the lead goes on to make |
| C0248 | how we work | lead paragraph | One shared team works across every division. You never have to explain your family twice. | keep |  |  |
| C0249 | how we work | h3.h3 | One conversation | keep |  |  |
| C0250 | how we work | p | Tell us about your family and your plans once. No forms, no pressure, and no decision on the first call. | edit | Tell us about your family and your plans once. No forms, no pressure, and no decision in the first conversation. | editor: call is the word the guide sets aside for the first contact; the first conversation is the house phrase |
| C0251 | how we work | h3.h3 | The right house | edit | The right division | a step heading; 'house' is body copy only |
| C0252 | how we work | p | Your Relationship Manager brings in each house, and qualified specialists, when they are needed. Never before. | keep |  |  |
| C0253 | how we work | h3.h3 | One person, for the long term | keep |  |  |
| C0254 | how we work | p | One named person stays with you after the paperwork is done: renewals, property, the next family member. | keep |  |  |
| C0255 | the houses online | eyebrow | The houses online | edit | The divisions online | eyebrow label; 'houses' is body copy only |
| C0256 | the houses online | h2.d2 | Visit a house directly. | edit | Visit a division directly. | 'house' is body copy only; the headline keeps its shape |
| C0257 | the houses online | lead paragraph | Imperial Citizenship has its own website today. The others are in preparation; their links will be added before launch. | keep |  |  |
| C0258 | the houses online | a.site > b | Imperial Citizenship | keep |  |  |
| C0259 | the houses online | a.site > span | imperialcitizenship.com | keep |  |  |
| C0260 | the houses online | a.site > b | Imperial Partners Club | keep |  |  |
| C0261 | the houses online | a.site > span | Website to confirm | keep |  |  |
| C0262 | the houses online | a.site > b | Imperial Private Office | keep |  |  |
| C0263 | the houses online | a.site > b | Imperial Academy | keep |  |  |
| C0264 | finder | eyebrow | Your table | keep |  |  |
| C0265 | finder | count (span.fd-count) | {n} of 5 houses | edit | {n} of 5 divisions | the count matches the finder's formal word; the run-time token is kept |
| C0266 | finder | result label (span.fd-k) | Start here | keep |  |  |
| C0267 | finder | result label (span.fd-k) | Also at the table | keep |  |  |
| C0268 | finder | result label suffix | · Coming soon | keep |  | editor: kept as · Coming soon, the Real Estate status on the division page (divisions C1242); writer proposed: the suffix matches the Real Estate status string; the separator is kept |
| C0269 | finder | result reason (li) | Second residency and citizenship by investment, compared side by side. | keep |  |  |
| C0270 | finder | result reason (li) | Residency and citizenship routes for the whole family. | keep |  |  |
| C0271 | finder | result reason (li) | UAE business set-up advisory and a regional base. | keep |  |  |
| C0272 | finder | result reason (li) | A Global Mobility Strategy across several countries. | keep |  |  |
| C0273 | finder | result reason (li) | A second citizenship or residency as a lasting option. | keep |  |  |
| C0274 | finder | result reason (li) | Fewer visas to plan a life around. | keep |  |  |
| C0275 | finder | result reason (li) | One point of contact for a multi-country family. | keep |  |  |
| C0276 | finder | result reason (li) | Relocation, and the right schools near the right home. | keep |  |  |
| C0277 | finder | result reason (li) | Holding companies and company formation. | edit | Coordination of company formation through qualified specialists. | claims C101: the Private Office coordinates specialists; it does not form companies itself |
| C0278 | finder | result reason (li) | Tax residency and structuring, with qualified specialists. | edit | Tax residency and structuring, coordinated with qualified specialists. | claims C101 wording: coordination, not advice |
| C0279 | finder | result reason (li) | Introductions to private banks and private equity. | edit | Introductions to private banks where a relationship fits the plan. | claims C101: no record of any private equity relationship |
| C0280 | finder | result reason (li) | Structuring coordinated with tax and legal specialists. | keep |  |  |
| C0281 | finder | result reason (li) | Events and introductions that come with a wider life. | keep |  |  |
| C0282 | finder | result reason (li) | Introduce a Client with clear written terms. Your Client stays your Client. | keep |  |  |
| C0283 | finder | result reason (li) | Training and certification in one shared standard. | edit | Training and certification to one shared standard, in development. | claims C68: the Academy is building the standard; the present tense overstated |
| C0284 | finder | result reason (li) | Licensed property advisory in Dubai, launching soon. | keep |  |  |
| C0285 | finder | result reason (li) | A family home in Dubai, near the right schools. | keep |  |  |
| C0286 | finder | result reason (li) | Search, selection and purchase support in Dubai. | keep |  |  |
| C0287 | finder | button link (gold) | Start the conversation | edit | Start a relationship | the journey spec names the finder result button 'Start a relationship'; it opens the three-path journey with the division and goals prefilled |
| C0288 | finder | text button | Start over | edit | Start afresh | the guide's label for clearing a kept draft; matches the fit check on the Citizenship page |
| C0289 | finder | note (p.xs) | A starting point, not advice. One Relationship Manager brings in each house when it is needed. | edit | A starting point, not advice. One Relationship Manager brings in each division when it is needed. | 'house' becomes 'division' to match the rest of the finder |

## /divisions/citizenship (108 strings, 8 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0290 | meta | page title | Imperial Citizenship · Imperial Holdings Group | keep |  |  |
| C0291 | meta | meta description | Second residency and citizenship by investment, from first conversation to completed application. | edit | Imperial Citizenship, flagship of Imperial Holdings Group: second residency and citizenship by investment, from first conversation to completed application. | the description repeated the card line without naming the division; this names it and the Group, under 160 characters |
| C0292 | hero | span | Citizenship | keep |  |  |
| C0293 | hero / cta band | span aria-label | Imperial Citizenship | keep |  |  |
| C0294 | hero / cta band | span.wordmark | Imperial Citizenship | keep |  |  |
| C0295 | hero | h1.d1 | Second residency and citizenship. | keep |  |  |
| C0296 | hero | lead paragraph | Second residency and citizenship by investment, from first conversation to completed application. | edit | The flagship, and often the first step: second residency and citizenship by investment, carried from first conversation to completed application. | the division line decided in hero-final.json, used verbatim |
| C0297 | overview | statement paragraph | Imperial Citizenship is where the Group began, and it remains our main business. It advises families and founders on second residency and citizenship by investment, and carries each application from the first conversation to completion. | keep |  |  |
| C0298 | overview | dd | Imperial Citizenship | keep |  |  |
| C0299 | overview | dd | The flagship | keep |  |  |
| C0300 | overview | dd | Families who want more choices for their children. | keep |  |  |
| C0301 | overview | dd > a | imperialcitizenship.com | keep |  |  |
| C0302 | overview / cta band | button link > span | Visit imperialcitizenship.com | keep |  |  |
| C0303 | what we do | h2.d2 | Residency and citizenship, compared side by side. | keep |  |  |
| C0304 | what we do | h3.h3 | Caribbean citizenship | keep |  |  |
| C0305 | what we do | p | Citizenship by investment, for example Saint Kitts and Nevis and Grenada. | keep |  |  |
| C0306 | what we do | placeholder chip | To confirm: Full programme list to confirm | keep |  |  |
| C0307 | what we do | h3.h3 | UAE residency | keep |  |  |
| C0308 | what we do | p | Long-term residency routes, including property-linked options in Dubai, together with Imperial Real Estate. | edit | Long-term residency routes, including property-linked options in Dubai. | claims C43: Imperial Real Estate has not launched, so the joint delivery is dropped |
| C0309 | what we do | h3.h3 | European residency | keep |  |  |
| C0310 | what we do | p | Residency routes in Europe. | keep |  |  |
| C0311 | what we do | placeholder chip | To confirm: Approved European programmes to confirm | keep |  |  |
| C0312 | what we do | h3.h3 | Global Mobility Strategy | keep |  |  |
| C0313 | what we do | p | Advisory for families planning across several countries at once. | keep |  |  |
| C0314 | what we do | h3.h3 | UAE business set-up | keep |  |  |
| C0315 | what we do | p | Advisory for founders establishing a presence in the UAE. | keep |  |  |
| C0316 | who it is for | list item | Families who want more choices for their children. | keep |  |  |
| C0317 | who it is for | list item | Founders who need a regional base and a clear structure behind it. | keep |  |  |
| C0318 | who it is for | list item | Families who travel often and are tired of planning their lives around visas. | keep |  |  |
| C0319 | how it works | h2.d2 | Five steps, said plainly. | keep |  |  |
| C0320 | how it works | h3.h3 | Listen | keep |  |  |
| C0321 | how it works | p | A first conversation about your family and your plans. No forms, no pressure. | keep |  |  |
| C0322 | how it works | h3.h3 | Compare | keep |  |  |
| C0323 | how it works | p | Your options side by side: what each requires, costs and usually takes, in writing. | edit | Your options side by side: requirements, costs and an honest timeline for each, in writing. | 'usually takes' hinted at a processing time; the house phrase is an honest timeline, in writing |
| C0324 | how it works | h3.h3 | Plan | keep |  |  |
| C0325 | how it works | p | One route, one timeline, one named person responsible for it. | keep |  |  |
| C0326 | how it works | h3.h3 | Apply | keep |  |  |
| C0327 | how it works | p | A complete, accurate application, with every specialist coordinated for you. | keep |  |  |
| C0328 | how it works | span.ix | STEP 05 | keep |  |  |
| C0329 | how it works | h3.h3 | Stay | keep |  |  |
| C0330 | how it works | p | Renewals, property, the next family member. The relationship carries on. | keep |  |  |
| C0331 | how it works | eyebrow | Every plan includes | keep |  |  |
| C0332 | how it works | div | Eligibility review | keep |  |  |
| C0333 | how it works | div | Options in writing | keep |  |  |
| C0334 | how it works | div | Full cost schedule | keep |  |  |
| C0335 | how it works | div | Honest timeline | keep |  |  |
| C0336 | how it works | div | Document checklist | keep |  |  |
| C0337 | how it works | div | Application quality check | keep |  |  |
| C0338 | how it works | div | Specialists coordinated | keep |  |  |
| C0339 | how it works | div | Aftercare | keep |  |  |
| C0340 | how it works | div | Please note Final approval always rests with the relevant government. We tell you that at the start, and keep you informed at every stage. | keep |  |  |
| C0341 | fit check | eyebrow | Programme fit check | keep |  |  |
| C0342 | fit check | h2.d2 | Five questions. A clearer first conversation. | keep |  |  |
| C0343 | fit check | lead paragraph | Nothing here decides anything. Your answers simply prefill your enquiry, so the first conversation starts in the right place. | keep |  |  |
| C0344 | fit check | span.fit-n | Question 1 of 5 | keep |  |  |
| C0345 | fit check | h3.h3 | Who would be included? | keep |  |  |
| C0346 | fit check | button > b | Just me | keep |  |  |
| C0347 | fit check | button > b | My partner and me | keep |  |  |
| C0348 | fit check | button > b | My family, including children | keep |  |  |
| C0349 | fit check | button > b | A client I am introducing | keep |  |  |
| C0350 | fit check | h3.h3 | Where do you live today? | keep |  |  |
| C0351 | fit check | button > b | In the United Arab Emirates | keep |  |  |
| C0352 | fit check | button > b | In Nigeria | keep |  |  |
| C0353 | fit check | button > b | Elsewhere in Africa | keep |  |  |
| C0354 | fit check | button > b | Elsewhere in the world | keep |  |  |
| C0355 | fit check | text button > span | Back | keep |  |  |
| C0356 | fit check | h3.h3 | What matters most right now? | keep |  |  |
| C0357 | fit check | button > b | Live | keep |  |  |
| C0358 | fit check | button > small | Where the family can live, travel, study and settle. | keep |  |  |
| C0359 | fit check | button > b | Build | keep |  |  |
| C0360 | fit check | button > small | A business, a career or a presence in a new market. | keep |  |  |
| C0361 | fit check | button > b | Invest | keep |  |  |
| C0362 | fit check | button > small | Property and opportunities that fit the plan. | keep |  |  |
| C0363 | fit check | button > b | Protect | keep |  |  |
| C0364 | fit check | button > small | Security for what you have built, and who you love. | keep |  |  |
| C0365 | fit check | h3.h3 | When would you like to begin? | keep |  |  |
| C0366 | fit check | button > b | Within 3 months | keep |  |  |
| C0367 | fit check | button > b | 3 to 12 months | keep |  |  |
| C0368 | fit check | button > b | Just exploring for now | keep |  |  |
| C0369 | fit check | h3.h3 | Is there a budget in mind? | keep |  |  |
| C0370 | fit check | button > b | Under US$250,000 | keep |  |  |
| C0371 | fit check | button > b | US$250,000 to 500,000 | keep |  |  |
| C0372 | fit check | button > b | US$500,000 to 1 million | keep |  |  |
| C0373 | fit check | button > b | Over US$1 million | keep |  |  |
| C0374 | fit check | text button | I would rather not say yet | keep |  |  |
| C0375 | fit check | h3 | Thank you. | keep |  |  |
| C0376 | fit check | p | Your enquiry below has been prefilled from these answers. Add your name, your email and a few lines, and the right person will reply. | edit | Your answers will prefill your message, so the first conversation starts in the right place. Add your name and email, and one person will reply personally. | the fit check now hands over to the Start a Relationship journey, not a card below; the line says what happens next and who replies |
| C0377 | fit check | button link (gold) > span | Go to your enquiry | edit | Continue to your message | the fit check done state now continues to the journey (relationship-journey.json entries) |
| C0378 | fit check | text button | Start over | edit | Start afresh | the house label for clearing a draft (cta_patterns) |
| C0379 | guide | eyebrow | The guide | keep |  |  |
| C0380 | guide | h2.d2 | A short guide, before you decide. | keep |  |  |
| C0381 | guide | lead paragraph | The guide is being finalised. Leave your name and email and we will let you know when it is ready. | keep |  |  |
| C0382 | guide | note (p.small) | The Imperial guide to second residency and citizenship To confirm: Guide PDF to be written and approved | keep |  |  |
| C0383 | forms (guide) | eyebrow | Request the guide | keep |  |  |
| C0384 | forms (guide) | consent text > span | I agree to Imperial Holdings Group contacting me about the guide, as described in the privacy notice. | keep |  |  |
| C0385 | forms (guide) | button (gold) > span | Tell me when it is ready | keep |  |  |
| C0386 | forms (guide) | note (span.xs) | We use these details only for the guide, and to reply if you ask us to. | keep |  |  |
| C0387 | cta band | h2.d2 | Begin with Imperial Citizenship. | keep |  |  |
| C0388 | cta band | lead paragraph | Programmes, eligibility and the team behind them, on the Imperial Citizenship website. | keep |  |  |
| C0389 | forms (guide) | success message (p) | Thank you. The guide is being finalised, and we will let you know when it is ready. | keep |  |  |
| C0390 | forms (guide) | success message (p) | Your copy of the guide is ready below. One person will be in touch only if you would like a conversation. | keep |  |  |
| C0391 | forms (guide) | button link (gold) | Download the guide | keep |  |  |
| C0392 | forms (guide) | button (gold) | Send me the guide | keep |  |  |
| C0393 | forms (guide) | consent text | I agree to Imperial Holdings Group sending me the guide and contacting me about it, as described in the privacy notice. | keep |  |  |
| C0394 | fit check | progress label (span.fit-n) | Done | keep |  |  |
| C0395 | fit check | screen reader announcement | Thank you. Your enquiry has been prefilled from these answers. | edit | Thank you. Your answers will prefill your message. | the announcement must match the new done state: nothing is prefilled below any more |
| C0396 | email | subject | Your guide request | keep |  |  |
| C0397 | email | opening | Thank you for requesting the guide. It is being finalised; one person at {Division name} will let you know when it is ready and will be your point of contact if you have questions. | keep |  |  |

## /divisions/partners-club (48 strings, 18 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0398 | meta | page title | Imperial Partners Club · Imperial Holdings Group | keep |  |  |
| C0399 | meta | meta description | The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | edit | Imperial Partners Club: for the lawyers, bankers, advisers and family offices who introduce Clients to the Group, on written terms. Your Client stays yours. | 'wealth' is an avoided word and the line did not name the division; this names it and carries the Partner promise, under 160 characters |
| C0400 | hero | span | Partners Club | keep |  |  |
| C0401 | hero | img alt text | Imperial Partners Club | keep |  |  |
| C0402 | hero | h1.d1 | Introduce with confidence. | keep |  |  |
| C0403 | hero | lead paragraph | The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | edit | Lawyers, bankers, advisers and family offices who introduce Clients to the Group, on written terms, with clear updates. Your Client stays yours. | the division line decided in hero-final.json, used verbatim; drops 'wealth' |
| C0404 | overview | statement paragraph | Imperial Partners Club is our Partner network across industries, from introducers to advisers to service-line Partners. Lawyers, bankers, wealth advisers and family offices are often the first people a Client asks about living or investing abroad. Partners Club is the house they can hand that conversation to. | edit | Imperial Partners Club is being built as our Partner network across industries, beginning with a first cohort of Partners. Lawyers, bankers, advisers and family offices are often the first people a Client asks about living or investing abroad. Partners Club is the house they can hand that conversation to. | claims C49: the network is at pilot stage, so 'is our network' becomes 'is being built, beginning with a first cohort'; 'wealth' dropped |
| C0405 | overview | dd | Imperial Partners Club | keep |  |  |
| C0406 | overview | dd | For professionals | edit | Opening in stages | claims C49: the status says plainly that the network is opening in stages |
| C0407 | overview | dd | Introducers who are often asked about life and investment abroad. | keep |  |  |
| C0408 | overview | dd > span | To confirm: Imperial Partners Club website link | keep |  |  |
| C0409 | overview / cta band | button link > span | Visit the Partners Club website | hold | To confirm: Partners Club website address | the site is in preparation; a chip stands until the address is live, then the domain is the label |
| C0410 | what we do | h2.d2 | Built for the people who introduce. | keep |  |  |
| C0411 | what we do | h3.h3 | Clear written terms | keep |  |  |
| C0412 | what we do | p | Your Partner Agreement sets out exactly how introductions work. | edit | Every introduction is governed by a written agreement that sets out exactly how it works. | claims C50: the Partner Agreement is not yet approved by counsel, so the written agreement is named generically |
| C0413 | what we do | h3.h3 | Transparent reporting | edit | Clear updates | claims C51: no live reporting exists; the promise is updates from us, not a portal to check |
| C0414 | what we do | p | See where each introduction stands, without having to chase. | edit | We tell you where each introduction stands, at every stage. | claims C51: no live reporting exists; the promise is updates from us, not a portal to check |
| C0415 | what we do | h3.h3 | Training and certification | edit | Training | claims C52: the Academy's Partner programme has not run, so certification is not promised yet |
| C0416 | what we do | p | Imperial Academy helps your team explain the options accurately. | edit | Briefings and approved materials so your team can explain the options accurately. Imperial Academy’s Partner programme will follow. | claims C52: the Academy is in development, so training is briefings and materials today, with the Partner programme to follow |
| C0417 | what we do | h3.h3 | Approved materials | keep |  |  |
| C0418 | what we do | p | Client-ready guides and wording, checked against an approved claims list. | edit | Client-ready guides and wording, approved by Imperial before use. | claims C53: no approved claims list exists yet; approval by Imperial is what happens |
| C0419 | what we do | h3.h3 | One named contact | keep |  |  |
| C0420 | what we do | p | A dedicated person for Partners, who knows your practice. | keep |  |  |
| C0421 | what we do | h3.h3 | The whole Group | keep |  |  |
| C0422 | what we do | p | Citizenship, residency, Dubai property and family planning, through one door. | edit | Citizenship and residency today, with property and Private Office services as each house opens. | claims C55: property and Private Office services are not yet open, so the line says what is available today and what follows |
| C0423 | who it is for | list item | Introducers who are often asked about life and investment abroad. | keep |  |  |
| C0424 | who it is for | list item | Advisers: lawyers, private bankers, wealth advisers and family offices. | edit | Advisers: lawyers, private bankers, family offices and the other professionals a family already relies on. | editor: keeps the 'Advisers:' label so the three list items stay parallel (Introducers, Advisers, Service-line Partners); 'wealth' dropped as the writer proposed. Writer: 'wealth' is an avoided word; the professions are named without it |
| C0425 | who it is for | list item | Service-line Partners who deliver specialist work for Imperial Clients. | keep |  |  |
| C0426 | how it works | h2.d2 | Four steps. No surprises. | keep |  |  |
| C0427 | how it works | h3.h3 | Introduce | keep |  |  |
| C0428 | how it works | p | Share your Client’s details, with their permission, through one simple form. | edit | Tell us about the introduction, with your Client’s permission. Their details follow once written terms are in place. | the journey asks nothing about the Client up front; the step now agrees with it and with the consent standard |
| C0429 | how it works | h3.h3 | We advise | keep |  |  |
| C0430 | how it works | p | A Relationship Manager meets your Client and explains their options plainly. | keep |  |  |
| C0431 | how it works | h3.h3 | You stay informed | keep |  |  |
| C0432 | how it works | p | Clear updates on each introduction, at every stage. | keep |  |  |
| C0433 | how it works | h3.h3 | Outcome | edit | Terms honoured | editor: 'As agreed' is a fragment, not a step name; 'Terms honoured' names the step in two words and keeps 'Outcome' out of a list that refuses to promise outcomes. Writer: 'Outcome' sat awkwardly beside a list that says we never guarantee outcomes |
| C0434 | how it works | p | Terms are honoured exactly as set out in your written agreement. | edit | Terms are honoured exactly as set out in your written agreement, and your Client stays your Client. | editor: claims C50 drops the Partner Agreement name, which this line never carried, and C50's own wording keeps 'exactly', so the current promise stands; the Partner promise from hero-final.json is added as the writer proposed |
| C0435 | how it works | eyebrow | Shared standards | keep |  |  |
| C0436 | how it works | h3.d3 | Your reputation travels with ours. | keep |  |  |
| C0437 | how it works | list item > span | Partners do not act or sign on the Group’s behalf. | keep |  |  |
| C0438 | how it works | list item > span | We never guarantee citizenship, visa, residency, investment or tax outcomes. | keep |  |  |
| C0439 | how it works | list item > span | We claim no influence with, or shortcuts through, any government. | keep |  |  |
| C0440 | how it works | list item > span | Client information is shared only with consent, and only where a service needs it. | keep |  |  |
| C0441 | how it works | list item > span | Every Client-facing document is checked against an approved claims list. | edit | Every Client-facing document is approved by Imperial before use. | claims C53: no approved claims list exists yet |
| C0442 | how it works | list item > span | Regulated advice is given only by qualified specialists. | keep |  |  |
| C0443 | how it works | div | Please note Your reputation travels with ours. Every Partner agrees to these standards, and so do we. | edit | Please note Your reputation travels with ours. Every Partner is asked to agree to these standards in writing, and we hold ourselves to the same. | claims C57: agreement depends on the Partner Agreement, which counsel has not yet reviewed, so Partners are 'asked to agree in writing' |
| C0444 | cta band | h2.d2 | Introduce with confidence. | keep |  |  |
| C0445 | cta band | lead paragraph | The Imperial Partners Club website is in preparation. In the meantime, speak to us and we will connect you. | keep |  |  |

## /divisions/private-office (39 strings, 11 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0446 | meta | page title | Imperial Private Office · Imperial Holdings Group | keep |  |  |
| C0447 | meta | meta description | One lasting relationship for families with multi-country lives. | edit | Imperial Private Office, being established for existing Imperial Clients: one point of contact for the wider needs of a family with a multi-country life. | claims C59: the division is being established; the description now names it, its status and its audience, under 160 characters |
| C0448 | hero | img alt text | Imperial Private Office | keep |  |  |
| C0449 | hero | h1.d1 | One lasting relationship. | keep |  |  |
| C0450 | hero | lead paragraph | One lasting relationship for families with multi-country lives. | edit | Ongoing support for existing Imperial Clients after the first service is complete: relocation, schools, structuring and introductions, through one point of contact. | the division line decided in hero-final.json, used verbatim |
| C0451 | overview | statement paragraph | Imperial Private Office looks after Imperial Clients once their first service is complete. It is a single point of contact for the wider needs of a multi-country family, delivered through trusted Partners and qualified specialists. | edit | Imperial Private Office is being established to look after Imperial Clients once their first service is complete: a single point of contact for the wider needs of a multi-country family, delivered through trusted Partners and qualified specialists. | claims C59: go-live has not started, so the present tense becomes 'is being established' |
| C0452 | overview | dd | Imperial Private Office | keep |  |  |
| C0453 | overview | dd | For existing Clients | edit | By invitation, being established | claims C59: the status says the division is by invitation and being established |
| C0454 | overview | dd | Existing Imperial Clients and their families. | keep |  |  |
| C0455 | overview | dd > span | To confirm: Imperial Private Office website link | keep |  |  |
| C0456 | overview / cta band | button link > span | Visit the Private Office website | hold | To confirm: Private Office website address | the site is in preparation; a chip stands until the address is live, then the domain is the label |
| C0457 | what we do | h2.d2 | Everything a wider life needs. | edit | What a wider life needs. | editor: 'Everything' promises completeness for a division being established, whose services the audit trimmed (claims C60, C61); the house phrase and the line length stay, without the absolute |
| C0458 | what we do | h3.h3 | Relocation | keep |  |  |
| C0459 | what we do | p | Moving the household, and settling in well, wherever the family chooses to live. | keep |  |  |
| C0460 | what we do | h3.h3 | Schools | keep |  |  |
| C0461 | what we do | p | Finding the right schools for the children, near the right home. | keep |  |  |
| C0462 | what we do | h3.h3 | Holding companies | edit | Company formation | claims C61: Private Office coordinates specialists; it does not run holding companies as a service of its own |
| C0463 | what we do | p | Company formation and the structure behind a family’s interests. | edit | The structure behind a family’s interests, coordinated through qualified specialists. | claims C61: coordination of specialists, not a structuring service of its own |
| C0464 | what we do | h3.h3 | Tax residency and structuring | keep |  |  |
| C0465 | what we do | p | Coordinated with qualified tax and legal specialists. | keep |  |  |
| C0466 | what we do | h3.h3 | Private banks and private equity | edit | Banking introductions | claims C61: no private equity relationship is on record; introductions to private banks remain |
| C0467 | what we do | p | Introductions to the institutions that fit the plan. | edit | Introductions to private banks where a relationship fits the plan. | claims C61: private equity removed; the introduction is to a bank where it fits the plan |
| C0468 | what we do | h3.h3 | Events and introductions | keep |  |  |
| C0469 | what we do | p | Access to the people and occasions that come with a wider life. | edit | Invitations to the occasions, and introductions to the people, that come with a wider life. | 'access' offered status as the benefit; the line now describes the occasions and the people |
| C0470 | who it is for | list item | Existing Imperial Clients and their families. | keep |  |  |
| C0471 | who it is for | list item | Completed Imperial Citizenship Clients, who may be invited to join. | keep |  |  |
| C0472 | who it is for | list item | Families whose lives, assets and businesses span several countries. | keep |  |  |
| C0473 | how it works | h2.d2 | One point of contact. Many specialists. | keep |  |  |
| C0474 | how it works | h3.h3 | Your contact | keep |  |  |
| C0475 | how it works | p | One named person who knows your family and your history with Imperial. | keep |  |  |
| C0476 | how it works | h3.h3 | Your request | keep |  |  |
| C0477 | how it works | p | Tell us what you need. We record it properly and find the right specialist. | keep |  |  |
| C0478 | how it works | h3.h3 | Delivered through Partners | keep |  |  |
| C0479 | how it works | p | Trusted Partners and qualified specialists carry out the work. | keep |  |  |
| C0480 | how it works | h3.h3 | Followed through | keep |  |  |
| C0481 | how it works | p | We stay with it until it is done, and note what comes next. | keep |  |  |
| C0482 | how it works | div | Please note Advice on regulated matters such as tax, legal or investment is provided only by appropriately qualified specialists. | keep |  |  |
| C0483 | cta band | h2.d2 | Continue with Private Office. | keep |  |  |
| C0484 | cta band | lead paragraph | The Imperial Private Office website is in preparation. In the meantime, speak to us and we will connect you. | keep |  |  |

## /divisions/real-estate (35 strings, 8 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0485 | meta | page title | Imperial Real Estate · Imperial Holdings Group | keep |  |  |
| C0486 | meta | meta description | Licensed property advisory, starting with Dubai. | edit | Imperial Real Estate, not yet launched: property advisory for Dubai, working with Imperial Citizenship where a home and residency meet. Register your interest. | the description now names the division, says it has not launched and gives the next step, under 160 characters |
| C0487 | hero | span | Real Estate | keep |  |  |
| C0488 | hero | img alt text | Imperial Real Estate | keep |  |  |
| C0489 | hero | h1.d1 | Licensed property advisory, starting with Dubai. | edit | Property in Dubai, in preparation. | the current headline led with the licence claim before its details are published and ran to three lines; the card headline from hero-final.json says plainly where the division stands |
| C0490 | hero | lead paragraph | Imperial Real Estate is licensed and has not yet launched. Register your interest and we will be in touch when it opens. | keep |  |  |
| C0491 | hero | button link > span | Register interest | keep |  |  |
| C0492 | overview | statement paragraph | Imperial Real Estate will offer licensed property advisory, starting with Dubai: search, selection and purchase support, through to handover. It will work alongside Imperial Citizenship where property and residency meet. | keep |  |  |
| C0493 | overview | h2.vh | What Imperial Real Estate will do | keep |  |  |
| C0494 | overview | h3.h3 | Search | keep |  |  |
| C0495 | overview | p | A considered search for the right home, near the right schools. | keep |  |  |
| C0496 | overview | h3.h3 | Selection | keep |  |  |
| C0497 | overview | p | A clear comparison of the options that fit the plan. | keep |  |  |
| C0498 | overview | h3.h3 | Purchase support | keep |  |  |
| C0499 | overview | p | Support through the purchase, through to handover. | edit | Support at every stage of the purchase, through to handover. | 'through the purchase, through to handover' repeated itself |
| C0500 | overview | h3.h3 | Property and residency | keep |  |  |
| C0501 | overview | p | Coordinated with Imperial Citizenship where a property links to UAE residency. | keep |  |  |
| C0502 | overview | div | Please note Imperial Real Estate is licensed and has not yet launched. Licence details will be published at launch. To confirm: Licence number and regulator | keep |  |  |
| C0503 | forms (interest) | eyebrow | Register interest | keep |  |  |
| C0504 | forms (interest) | h2.d3 | Be first to hear. | edit | Hear when it launches. | "first to hear" reads as a claim; the new line names what happens |
| C0505 | forms (interest) | note (p.small) | Tell us a little about what you are looking for. We will contact you when Imperial Real Estate launches. | keep |  |  |
| C0506 | forms (interest) | form label | I am interested in | keep |  |  |
| C0507 | forms (interest) | option (select interest) | A family home in Dubai | keep |  |  |
| C0508 | forms (interest) | option (select interest) | Property linked to UAE residency | keep |  |  |
| C0509 | forms (interest) | option (select interest) | An investment property | keep |  |  |
| C0510 | forms (interest) | option (select interest) | Not sure yet | keep |  |  |
| C0511 | forms (interest) | error message | Please choose an option. | edit | Please choose the closest. | matches the other choice errors; plain and kind |
| C0512 | forms (interest) | form label | Anything else (optional) | edit | Anything you would like us to know (optional) | the journey's wording for the free text field, same meaning |
| C0513 | forms (interest) | consent text > span | I agree to Imperial Holdings Group contacting me about Imperial Real Estate, as described in the privacy notice. | keep |  |  |
| C0514 | forms (interest) | button > span | Register interest | keep |  |  |
| C0515 | forms (interest) | note (span.xs) | We use these details only to contact you about Imperial Real Estate. | keep |  |  |
| C0516 | forms (interest) | success message (p) | Your interest in Imperial Real Estate is noted. We will be in touch when it launches. | edit | Your interest in Imperial Real Estate is registered. One person will write to you when it launches. | promises a person, and uses the form's own verb |
| C0517 | email | subject | Your interest in {Division name} | keep |  |  |
| C0518 | email | opening | Thank you for registering your interest in {Division name}. It has not launched yet; we will write to you when it opens. | edit | Thank you for registering your interest in {Division name}. It has not yet launched. One person will write to you when it opens. | the email promises a person, not an outcome |
| C0519 | email | next step | If you would like to talk sooner, reply to this email or call the office. | keep |  |  |

## /divisions/academy (40 strings, 13 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0520 | meta | page title | Imperial Academy · Imperial Holdings Group | keep |  |  |
| C0521 | meta | meta description | Learning, training and certification for the people who do this work. | edit | Imperial Academy, the learning arm of Imperial Holdings Group, in development: training and certification to one standard for our people and Partner teams. | claims C68: the Academy is in development; the description names it, its status and its audiences, under 160 characters |
| C0522 | hero | span | Academy | keep |  |  |
| C0523 | hero | img alt text | Imperial Academy | keep |  |  |
| C0524 | hero | h1.d1 | One standard, learned by everyone. | keep |  |  |
| C0525 | hero | lead paragraph | Learning, training and certification for the people who do this work. | edit | The Group’s learning arm, in preparation: training and certification to one shared standard, for our own people and for Partner teams. | the division line decided in hero-final.json, used verbatim |
| C0526 | overview | statement paragraph | Imperial Academy is the Group’s learning and education arm. It trains and certifies our own people in one shared standard, and helps Partner teams explain the options accurately. Courses for a wider audience will follow later. | edit | Imperial Academy is the Group’s learning arm. It is building one shared standard of training and certification for our own people, which will extend to Partner teams. Courses for a wider audience will follow later. | claims C68: the Academy is internal and in development, so 'trains and certifies' becomes 'is building' |
| C0527 | overview | dd | Imperial Academy | keep |  |  |
| C0528 | overview | dd | Learning and standards | edit | Learning and standards, in development | claims C68: the status carries 'in development' |
| C0529 | overview | dd | Our own team, across every house. | keep |  |  |
| C0530 | overview | dd > span | To confirm: Imperial Academy website link | keep |  |  |
| C0531 | overview / cta band | button link > span | Visit the Academy website | hold | To confirm: Academy website address | the site is in preparation; a chip stands until the address is live, then the domain is the label |
| C0532 | what we do | h2.d2 | What the Academy does. | edit | What the Academy will do. | the Academy is in development; the heading matches the Real Estate page's 'will do' and the softened items below |
| C0533 | what we do | h3.h3 | One shared standard | keep |  |  |
| C0534 | what we do | p | Every role learns the same institution before specialising: how we work, how we protect Client and Partner trust, and how we keep information private. | edit | Every role will learn the same institution before specialising: how we work, how we protect Client and Partner trust, and how we keep information private. | the Academy is in development, so the standard is described in the future tense |
| C0535 | what we do | h3.h3 | Role certification | keep |  |  |
| C0536 | what we do | p | People are certified as ready before they take on greater responsibility. | edit | People will be certified as ready before they take on greater responsibility. | claims C69: no certification has yet been issued |
| C0537 | what we do | h3.h3 | Partner Academy | edit | Partner Academy, to follow | claims C70: no Partner training has run |
| C0538 | what we do | p | Training that helps Partner teams explain the options accurately and use approved materials. | edit | Training for Partner teams, so they can explain the options accurately and use approved materials. | claims C70: described as what will follow, not what runs today |
| C0539 | what we do | h3.h3 | Future talent | keep |  |  |
| C0540 | what we do | p | A route into the Group for high-potential people, selected on ability and character. | edit | A route into the Group for people selected on ability and character. | 'high-potential' is recruitment jargon; the selection criteria say it plainly |
| C0541 | what we do | placeholder chip | To confirm: Programme details and launch timing to confirm | keep |  |  |
| C0542 | what we do | h3.h3 | Wider courses | keep |  |  |
| C0543 | what we do | p | Learning for selected external audiences, later. | keep |  |  |
| C0544 | what we do | placeholder chip | To confirm: Scope and timing to confirm | keep |  |  |
| C0545 | who it is for | list item | Our own team, across every house. | keep |  |  |
| C0546 | who it is for | list item | Imperial Partners and their teams. | keep |  |  |
| C0547 | who it is for | list item | In time, candidates and selected external learners. | keep |  |  |
| C0548 | how it works | h2.d2 | Learn the house. Then specialise. | keep |  |  |
| C0549 | how it works | h3.h3 | Learn | keep |  |  |
| C0550 | how it works | p | The common Imperial core: standards, discretion and how the houses work together. | keep |  |  |
| C0551 | how it works | h3.h3 | Practise | keep |  |  |
| C0552 | how it works | p | Realistic cases, not only multiple-choice tests. | keep |  |  |
| C0553 | how it works | h3.h3 | Certify | keep |  |  |
| C0554 | how it works | p | Readiness is demonstrated before responsibility is given. | edit | Readiness will be shown before responsibility is given. | claims C69: certification has not yet been issued, so the step is in the future tense |
| C0555 | how it works | h3.h3 | Grow | keep |  |  |
| C0556 | how it works | p | Development continues as people take on more. | keep |  |  |
| C0557 | how it works | div | Please note Academy certification is internal to Imperial. It is not a replacement for professional licensing. | keep |  |  |
| C0558 | cta band | h2.d2 | Learn the Imperial standard. | edit | Training to one standard. | "Learn" invites the reader to a division in development; the new line describes it |
| C0559 | cta band | lead paragraph | The Imperial Academy website is in preparation. In the meantime, speak to us and we will connect you. | keep |  |  |

## /journal (14 strings, 7 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0560 | meta | page title | Events and Journal · Imperial Holdings Group | keep |  |  |
| C0561 | meta | meta description | Genuine company developments, insights, partnerships and selected Imperial events in Dubai and Lagos. | edit | Company developments, insights and selected Imperial events in Dubai and Lagos. | claims C83: partnerships has no record; the softened wording, 80 characters |
| C0562 | hero | span | Journal | keep |  |  |
| C0563 | hero | eyebrow | Events & Journal | edit | Events and Journal | an eyebrow carries no ampersand; the middle dot is its only punctuation |
| C0564 | hero | h1.d1 | Selected events. Selected words. | keep |  |  |
| C0565 | hero | lead paragraph | Genuine company developments, insights, partnerships and selected gatherings. Fewer entries, chosen with care. | edit | Company developments, insights and selected gatherings. Fewer entries, chosen with care. | 'Genuine' protests and claims C82 drops partnerships; the plain list stands |
| C0566 | events | h2.d2 | Where the network meets. | edit | Relationships, in person. | 'the network meets' reads as a networking event; events are evidence of relationships, so the heading says so |
| C0567 | events | lead paragraph | Diplomatic collaborations, private gatherings and partnerships, in Dubai and Lagos. Galleries open as guests confirm they are happy to be featured. | edit | Diplomatic occasions, private gatherings and the relationships behind them, in Dubai and Lagos. Galleries open as guests confirm they are happy to be featured. | claims C82: collaborations and partnerships rest on one press release and no partnership record; the softened fixed part, consent sentence unchanged |
| C0568 | events | note (p.xs) | Photographs of guests appear once they have confirmed they are happy to be featured. | keep |  |  |
| C0569 | journal | lead paragraph | Company developments, selected insights and partnerships. | edit | Company developments and selected insights. | claims C82 and C83: partnerships has no record |
| C0570 | journal | div.meta | Company developments | keep |  |  |
| C0571 | journal | h3 | Imperial Real Estate is licensed and preparing to launch | keep |  |  |
| C0572 | journal | p | The Group’s fifth division will offer licensed property advisory, starting with Dubai. Interest can be registered now. | keep |  |  |
| C0573 | events | lead paragraph (variant) | Diplomatic collaborations, private gatherings and partnerships, in Dubai and Lagos. One cover photograph for each, and a gallery inside. | edit | Diplomatic occasions, private gatherings and the relationships behind them, in Dubai and Lagos. One cover photograph for each, and a gallery inside. | claims C82: the same softening on the variant shown once every event has consent |

## /journal/events/grenada-51-dubai (26 strings, 5 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0574 | meta | page title | Grenada’s 51st Independence Day After Party · Imperial | keep |  |  |
| C0575 | meta | meta description | Imperial Citizenship sponsored the after party for Grenada’s 51st Independence Day. | keep |  |  |
| C0576 | hero | span | Grenada 51st, Dubai | keep |  |  |
| C0577 | hero | eyebrow | Diplomatic · Dubai · 19 February 2025 | keep |  |  |
| C0578 | hero | h1.d1 | Grenada’s 51st Independence Day After Party | keep |  |  |
| C0579 | hero | lead paragraph | Imperial Citizenship sponsored the after party for Grenada’s 51st Independence Day, following the official celebrations hosted by IMA Grenada and the Consulate General of Grenada in Dubai. | keep |  |  |
| C0580 | event | lead paragraph | Imperial Citizenship sponsored the after party for Grenada’s 51st Independence Day in Dubai on 19 February 2025, held at Agora Cocktail Bar and Social Club at The Dubai EDITION, Downtown Dubai. | keep |  |  |
| C0581 | event | lead paragraph | The evening followed the official celebrations at the Marriott Resort Palm Jumeirah, hosted by IMA Grenada and the Consulate General of Grenada in Dubai. | keep |  |  |
| C0582 | event | eyebrow | Among the guests | keep |  |  |
| C0583 | event | list item | H.E. Ziya Rahaman, Consul General of Grenada to the UAE | keep |  |  |
| C0584 | event | list item | Hon. Dennis Cornwall, Minister of Finance, Grenada | keep |  |  |
| C0585 | event | list item | H.E. Justin Kareem Hawley, Ambassador of St Kitts and Nevis to the UAE | keep |  |  |
| C0586 | event | list item | Mr Thomas Anthony, CEO, IMA Grenada | keep |  |  |
| C0587 | event | list item | H.E. Murillo Fallas | hold | To confirm: Title for H.E. Murillo Fallas | editor: claims C76 holds the name until the press release confirms the role; the chip now names what is missing, plainly; writer: claims C76: no title on record; held until the press release confirms the role |
| C0588 | event | list item | H.E. James Harris | hold | To confirm: Title for H.E. James Harris | editor: claims C76 holds the name until the press release confirms the role; the chip now names what is missing, plainly; writer: claims C76: no title on record; held until the press release confirms the role |
| C0589 | event | list item | H.E. Andrew Tsepo Lebona | hold | To confirm: Title for H.E. Andrew Tsepo Lebona | editor: claims C76 holds the name until the press release confirms the role; the chip now names what is missing, plainly; writer: claims C76: no title on record; held until the press release confirms the role |
| C0590 | event | list item | Mr Zaid Al Hindi, Founder and Group CEO, Imperial Holdings Group | keep |  |  |
| C0591 | event | note (p.xs) | Source: Press release, 19 February 2025 (Marketing Team SharePoint) | edit | Source: Press release, 19 February 2025 | the public Source line names the record, not the internal SharePoint location; claims C75 keeps the citation |
| C0592 | event | dd | 19 February 2025 | keep |  |  |
| C0593 | event | dd | Agora Cocktail Bar & Social Club, The Dubai EDITION, Downtown Dubai, Dubai | edit | Agora Cocktail Bar and Social Club, The Dubai EDITION, Downtown Dubai, Dubai | the body paragraph writes the venue with and; the glance panel now matches it |
| C0594 | gallery | img alt text | Highlights: Grenada 51st after party, Dubai (poster) | keep |  |  |
| C0595 | gallery | figure caption | Highlights: Grenada 51st after party, Dubai · Captions | keep |  |  |
| C0596 | gallery | img alt text (gallery, consent pending) | Two guests with a glass raised at the Grenada 51st after party, Dubai | keep |  |  |
| C0597 | gallery | img alt text (gallery, consent pending) | A guest in a dark suit at the Grenada flag photo wall | keep |  |  |
| C0598 | gallery | img alt text (gallery, consent pending) | A guest arriving through the bar entrance at the Dubai EDITION | keep |  |  |
| C0599 | gallery | img alt text (gallery, consent pending) | A guest at the Grenada flag photo wall, Dubai | keep |  |  |

## /journal/events/lagos-diplomatic-soiree-2025 (18 strings, 4 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0600 | meta | page title | The Lagos Diplomatic Soirée 2025 · Imperial Holdings Group | keep |  | the event name, kept per claims C77; 58 characters with the suffix |
| C0601 | meta | meta description | An evening in Lagos bringing together members of the diplomatic community, clients and friends of Imperial. | hold | To confirm: An evening in Lagos for Clients, partners and friends of Imperial. | editor: Client takes a capital when it means a person Imperial serves; otherwise the claims C77 stand-in line; writer: claims C77: no record for the Soirée beyond the photographs; this plain line stands until a guest list reinstates the diplomatic community wording |
| C0602 | hero | img alt text | Lagos skyline and bridge at sunset | keep |  |  |
| C0603 | hero | span | Diplomatic Soirée, Lagos | keep |  | the event name, kept per claims C77 |
| C0604 | hero | eyebrow | Diplomatic · Lagos · 2025 | hold | Events · Lagos · 2025 | claims C77: the Diplomatic category waits for a guest list; the generic kind stands meanwhile, matching the home row, the year as in the event name |
| C0605 | hero | h1.d1 | The Lagos Diplomatic Soirée 2025 | keep |  | the event name, kept per claims C77 |
| C0606 | hero | lead paragraph | An evening in Lagos bringing together members of the diplomatic community, clients and friends of Imperial. | hold | To confirm: An evening in Lagos for Clients, partners and friends of Imperial. | editor: Client takes a capital when it means a person Imperial serves; otherwise the claims C77 stand-in line; writer: claims C77: no record for the Soirée beyond the photographs; this plain line stands until a guest list reinstates the diplomatic community wording |
| C0607 | event | lead paragraph | The Lagos Diplomatic Soirée brought together members of the diplomatic community, clients, partners and friends of Imperial for an evening in Lagos. | hold | To confirm: An evening in Lagos for Clients, partners and friends of Imperial. | editor: Client takes a capital when it means a person Imperial serves; otherwise the claims C77 stand-in line; writer: claims C77: no record for the Soirée beyond the photographs; this plain line stands until a guest list reinstates the diplomatic community wording |
| C0608 | event | note (p.xs) | To confirm: Exact date To confirm: Venue To confirm: Guests of honour | keep |  |  |
| C0609 | gallery | img alt text | Highlights: The Lagos Diplomatic Soirée 2025 (poster) | keep |  |  |
| C0610 | gallery | figure caption | Highlights: The Lagos Diplomatic Soirée 2025 · Captions | keep |  |  |
| C0611 | gallery | img alt text (gallery, consent pending) | A guest in a long black dress at the Lagos Diplomatic Soirée 2025 | keep |  |  |
| C0612 | gallery | img alt text (gallery, consent pending) | Guests standing together for a group photograph at the Soirée | keep |  |  |
| C0613 | gallery | img alt text (gallery, consent pending) | A guest in a long black dress by the mirrored wall at the Soirée | keep |  |  |
| C0614 | gallery | img alt text (gallery, consent pending) | Five guests together at the Lagos Diplomatic Soirée 2025 | keep |  |  |
| C0615 | gallery | img alt text (gallery, consent pending) | A guest in a grey jacket at the Soirée | keep |  |  |
| C0616 | gallery | img alt text (gallery, consent pending) | A guest in a grey jacket beside the mirrored wall at the Soirée | keep |  |  |
| C0617 | gallery | img alt text (gallery, consent pending) | A guest at the Lagos Diplomatic Soirée 2025 | keep |  |  |

## /journal/events/gala-dinner-lagos (13 strings, 5 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0618 | meta | page title | Gala Dinner, Lagos · Imperial Holdings Group | keep |  |  |
| C0619 | meta | meta description | A gala dinner hosted by Imperial Citizenship in Lagos, with guests from across the Caribbean citizenship community. | hold | To confirm: A gala dinner in Lagos for Clients, partners and guests of Imperial Citizenship. | editor: Client takes a capital when it means a person Imperial serves; otherwise the claims C78 stand-in line; writer: claims C78: no record of the occasion; the plain line stands until date, venue and guests are confirmed |
| C0620 | hero | span | Gala Dinner, Lagos | keep |  |  |
| C0621 | hero | h1.d1 | Gala Dinner, Lagos | keep |  |  |
| C0622 | hero | lead paragraph | A gala dinner hosted by Imperial Citizenship in Lagos, with guests from across the Caribbean citizenship community. | hold | To confirm: A gala dinner in Lagos for Clients, partners and guests of Imperial Citizenship. | editor: Client takes a capital when it means a person Imperial serves; otherwise the claims C78 stand-in line; writer: claims C78: no record of the occasion; the plain line stands until date, venue and guests are confirmed |
| C0623 | event | lead paragraph | Imperial Citizenship hosted a gala dinner in Lagos for clients, partners and guests from the Caribbean citizenship community. | hold | To confirm: A gala dinner in Lagos for Clients, partners and guests of Imperial Citizenship. | editor: Client takes a capital when it means a person Imperial serves; otherwise the claims C78 stand-in line; writer: claims C78: no record of the occasion; the plain line stands until date, venue and guests are confirmed |
| C0624 | event | note (p.xs) | To confirm: Date To confirm: Venue To confirm: Speakers and guests of honour | keep |  |  |
| C0625 | gallery | img alt text (gallery, consent pending) | A speaker at the lectern at the gala dinner, Lagos | keep |  |  |
| C0626 | gallery | img alt text (gallery, consent pending) | Two guests at the photo wall at the gala dinner | keep |  |  |
| C0627 | gallery | img alt text (gallery, consent pending) | Two guests holding an award at the photo wall | edit | Two guests in conversation at the photo wall at the gala dinner | editor: the frame (gala-dinner-lagos/03) shows two guests talking, one holding a glass, and no award (docs/PHOTOGRAPHY-PLAN.md section 3); the alt text now describes the picture |
| C0628 | gallery | img alt text (gallery, consent pending) | Two guests in front of the sponsors backdrop at the gala dinner | edit | Two guests in front of the sponsor backdrop at the gala dinner | grammar only; the frame is unchanged |
| C0629 | gallery | img alt text (gallery, consent pending) | Guests in conversation in the ballroom at the gala dinner | keep |  |  |
| C0630 | gallery | img alt text (gallery, consent pending) | A guest in a green dinner jacket at his table | keep |  |  |

## /journal/events/easter-polo-cup-2026 (17 strings, 5 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0631 | meta | page title | Easter Polo Cup After Party · Imperial Holdings Group | keep |  |  |
| C0632 | meta | meta description | Imperial Citizenship and Lagos Polo Club: an exclusive Easter Polo Cup after party at Lagos Polo Club, Ikoyi. | edit | An after party hosted by Imperial Citizenship at Lagos Polo Club, Ikoyi, following the Easter Polo Cup. | claims C79 and the audit: no partnership record and exclusive is an avoided word; hosted an after party, what and where |
| C0633 | hero | span | Easter Polo Cup, Lagos | keep |  |  |
| C0634 | hero | eyebrow | Partnership · Lagos · Easter 2026 | edit | Events · Lagos · Easter 2026 | claims C79: no partnership record, so the kind is Events; the date stays Easter 2026 with its To confirm note |
| C0635 | hero | h1.d1 | Easter Polo Cup After Party | keep |  |  |
| C0636 | hero | lead paragraph | Imperial Citizenship and Lagos Polo Club: an exclusive Easter Polo Cup after party at Lagos Polo Club, Ikoyi. | edit | An after party hosted by Imperial Citizenship at Lagos Polo Club, Ikoyi, following the Easter Polo Cup. | claims C79 and the audit: no partnership record and exclusive is an avoided word; hosted an after party, what and where |
| C0637 | event | lead paragraph | Imperial Citizenship partnered with Lagos Polo Club for an exclusive after party following the Easter Polo Cup at Lagos Polo Club, Ikoyi. | edit | Imperial Citizenship hosted an after party following the Easter Polo Cup at Lagos Polo Club, Ikoyi. | claims C79 wording: hosted, not partnered; exclusive dropped |
| C0638 | event | note (p.xs) | To confirm: Exact date | keep |  |  |
| C0639 | event | dd | Easter 2026 | keep |  |  |
| C0640 | event | dd | Lagos Polo Club, Ikoyi, Lagos | keep |  |  |
| C0641 | event | dd | Partnership | edit | Events | claims C79: no partnership record, so the kind is Events |
| C0642 | gallery | img alt text | Highlights: Easter Polo Cup after party, Lagos (poster) | keep |  |  |
| C0643 | gallery | figure caption | Highlights: Easter Polo Cup after party, Lagos · Captions | keep |  |  |
| C0644 | gallery | img alt text (gallery, consent pending) | Two polo players on horseback at Lagos Polo Club | keep |  |  |
| C0645 | gallery | img alt text (gallery, consent pending) | Guests in conversation on the terrace at the after party | keep |  |  |
| C0646 | gallery | img alt text (gallery, consent pending) | The Easter Polo Cup after party banner, Lagos Polo Club | keep |  |  |
| C0647 | gallery | img alt text (gallery, consent pending) | The Imperial Citizenship backdrop at the Easter Polo Cup after party | keep |  |  |

## /journal/events/lagos-office-event (14 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0648 | meta | page title | An Evening at the Lagos Office · Imperial Holdings Group | keep |  |  |
| C0649 | meta | meta description | Clients, partners and friends of Imperial at the Lagos office on Aromire Road, Ikoyi. | keep |  |  |
| C0650 | hero | span | Lagos office evening | keep |  |  |
| C0651 | hero | h1.d1 | An Evening at the Lagos Office | keep |  |  |
| C0652 | hero | lead paragraph | Clients, partners and friends of Imperial at the Lagos office on Aromire Road, Ikoyi. | keep |  |  |
| C0653 | event | lead paragraph | Imperial welcomed clients, partners and friends to an evening at the Lagos office on Aromire Road, Ikoyi. | edit | Imperial welcomed Clients, partners and friends to an evening at the Lagos office on Aromire Road, Ikoyi. | editor: capitalisation only: Clients of Imperial take a capital; claims C80 keeps the line |
| C0654 | event | dd | 8 Aromire Road, Ikoyi, Lagos | keep |  |  |
| C0655 | gallery | img alt text (gallery, consent pending) | Five guests at the Imperial Citizenship photo wall at the Lagos office | keep |  |  |
| C0656 | gallery | img alt text (gallery, consent pending) | Guests at the photo wall at the Lagos office | keep |  |  |
| C0657 | gallery | img alt text (gallery, consent pending) | Three guests laughing together at the photo wall | keep |  |  |
| C0658 | gallery | img alt text (gallery, consent pending) | Five guests side by side at the photo wall at the Lagos office | keep |  |  |
| C0659 | gallery | img alt text (gallery, consent pending) | Two guests seated in the lounge at the Lagos office | keep |  |  |
| C0660 | gallery | img alt text (gallery, consent pending) | A guest seated on the sofa in the lounge at the Lagos office | keep |  |  |
| C0661 | gallery | img alt text (gallery, consent pending) | Guests seated round a table outdoors at night at the Lagos office event | keep |  |  |

## /journal/events/delborough-dinner (13 strings, 3 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0662 | meta | page title | A Private Dinner at DANI, The Delborough · Imperial | keep |  |  |
| C0663 | meta | meta description | A private dinner for clients and friends of Imperial at DANI, The Delborough Hotel, Lagos. | hold | To confirm: A private dinner at DANI, The Delborough Hotel, Lagos. | claims C81: no record of who hosted it or when; the venue is what the photographs support |
| C0664 | hero | span | Private dinner, Lagos | keep |  |  |
| C0665 | hero | h1.d1 | A Private Dinner at DANI, The Delborough | keep |  |  |
| C0666 | hero | lead paragraph | A private dinner for clients and friends of Imperial at DANI, The Delborough Hotel, Lagos. | hold | To confirm: A private dinner at DANI, The Delborough Hotel, Lagos. | claims C81: no record of who hosted it or when; the venue is what the photographs support |
| C0667 | event | lead paragraph | Imperial hosted a private dinner for clients and friends at DANI, The Delborough Hotel, Lagos. | hold | To confirm: A private dinner at DANI, The Delborough Hotel, Lagos. | claims C81: no record of who hosted it or when; the venue is what the photographs support |
| C0668 | event | dd | DANI, The Delborough Hotel, Lagos | keep |  |  |
| C0669 | gallery | img alt text (gallery, consent pending) | A guest seated at the dinner table at DANI, The Delborough Hotel | keep |  |  |
| C0670 | gallery | img alt text (gallery, consent pending) | The band playing as guests arrive at DANI, The Delborough Hotel | keep |  |  |
| C0671 | gallery | img alt text (gallery, consent pending) | Six guests standing together for a photograph at the dinner | keep |  |  |
| C0672 | gallery | img alt text (gallery, consent pending) | Guests greeting one another at the dinner | keep |  |  |
| C0673 | gallery | img alt text (gallery, consent pending) | A guest in a blue suit talking with guests at their table | keep |  |  |
| C0674 | gallery | img alt text (gallery, consent pending) | A guest seated at the dinner table, flowers behind him | keep |  |  |

## /insights (29 strings, 6 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0675 | meta | page title | Insights · Imperial Holdings Group | keep |  |  |
| C0676 | meta | meta description | Plain-spoken guidance on mobility, family planning and working with Imperial. | edit | Plain-spoken notes on mobility, families across borders and working with Imperial. | 'family planning' reads as something else, and 'guidance' edges towards advice; notes on families across borders is what the articles are |
| C0677 | hero | span | Insights | keep |  |  |
| C0678 | hero | eyebrow | Insights | keep |  |  |
| C0679 | hero | h1.d1 | Notes from the house. | edit | Notes from the Group. | 'house' is for body copy only; the Group names who is writing |
| C0680 | hero | lead paragraph | Plain-spoken guidance on mobility, family planning and working with Imperial. | edit | Plain-spoken notes on mobility, families across borders and working with Imperial. | 'family planning' reads as something else, and 'guidance' edges towards advice; notes on families across borders is what the articles are |
| C0681 | insights list | div | Draft, awaiting approval. These articles are drafts and will be published once the copy has been approved. | edit | Draft, awaiting approval. These articles will be published once their copy has been approved. | the marker stays; the sentence said draft twice |
| C0682 | insights list | div aria-label | Filter insights | keep |  |  |
| C0683 | insights list | button | All | keep |  |  |
| C0684 | insights list | button | Mobility | keep |  |  |
| C0685 | insights list | button | Private Office | keep |  |  |
| C0686 | insights list | button | Partners | keep |  |  |
| C0687 | insights list | button | Our standard | keep |  |  |
| C0688 | insights list | h2.vh | Articles | keep |  |  |
| C0689 | insights list | div.meta | Mobility · 1 min read | keep |  |  |
| C0690 | insights list | h3 | Six things worth thinking about before a first conversation | keep |  |  |
| C0691 | insights list | p | You do not need any documents to begin. A little thought about six questions helps us give you useful options straight away. | edit | You do not need any documents to begin. A little thought about six questions helps the first conversation start in the right place. | 'useful options straight away' hints at speed; the house phrase names what the thought is for |
| C0692 | insights list | span.tlink | Read the draft | keep |  | cta_patterns: Read the draft while the article is unapproved |
| C0693 | insights list | div.meta | Private Office · 1 min read | keep |  |  |
| C0694 | insights list | h3 | Why a multi-country family needs one point of contact | keep |  |  |
| C0695 | insights list | p | When the residency, the home, the company and the school are handled by different people, the family becomes the coordinator. It should be the other way round. | keep |  |  |
| C0696 | insights list | div.meta | Partners · 1 min read | keep |  |  |
| C0697 | insights list | h3 | Your Client stays your Client: how introductions work | keep |  |  |
| C0698 | insights list | p | For lawyers, bankers, wealth advisers and family offices, an introduction should protect the relationship, not put it at risk. | edit | For lawyers, bankers, advisers and family offices, an introduction should protect the relationship, not put it at risk. | 'wealth' is an avoided word; the professions are named without it, as the Partners Club line now does |
| C0699 | insights list | div.meta | Our standard · 1 min read | keep |  |  |
| C0700 | insights list | h3 | What “everything in writing” means in practice | keep |  |  |
| C0701 | insights list | p | Before you decide anything, you should be able to see every option, its costs and its timeline side by side. | keep |  |  |
| C0702 | insights list | card link | Read the article | keep |  |  |
| C0703 | insights list | screen reader announcement | {n} articles shown | keep |  |  |

## /insights/before-a-first-conversation (20 strings, 4 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0704 | meta | page title | Six things worth thinking about before a first conversation | keep |  |  |
| C0705 | meta | meta description | You do not need any documents to begin. A little thought about six questions helps us give you useful options straight away. | edit | You do not need any documents to begin. A little thought about six questions helps the first conversation start in the right place. | 'useful options straight away' hints at speed; the house phrase names what the thought is for |
| C0706 | hero | span | Mobility | keep |  |  |
| C0707 | hero | eyebrow | Mobility | keep |  |  |
| C0708 | hero | h1.d1 | Six things worth thinking about before a first conversation | keep |  |  |
| C0709 | article | p.article-dek | You do not need any documents to begin. A little thought about six questions helps us give you useful options straight away. | edit | You do not need any documents to begin. A little thought about six questions helps the first conversation start in the right place. | 'useful options straight away' hints at speed; the house phrase names what the thought is for |
| C0710 | article | p | Nobody arrives wanting a visa for its own sake. They arrive wanting a different next chapter. A little thought about the questions below helps a first conversation move quickly to options that fit. | edit | Nobody arrives wanting a visa for its own sake. They arrive wanting a different next chapter. A little thought about the questions below helps a first conversation reach the options that fit. | 'move quickly' is a speed hint; the thought helps the conversation reach the options that fit |
| C0711 | article | h2 | Your family | keep |  |  |
| C0712 | article | p | Who would be included, and their ages. | keep |  |  |
| C0713 | article | h2 | Where you are now | keep |  |  |
| C0714 | article | p | Where you live, work and hold citizenship today. | keep |  |  |
| C0715 | article | h2 | What you want | keep |  |  |
| C0716 | article | p | Which of the six ambitions matter most, and why: live, build, structure, invest, protect or experience. | keep |  |  |
| C0717 | article | h2 | A budget range | keep |  |  |
| C0718 | article | p | A rough range is enough. We will show what fits. | keep |  |  |
| C0719 | article | h2 | Your timing | keep |  |  |
| C0720 | article | p | Any dates that matter: school terms, a move, a company launch. | keep |  |  |
| C0721 | article | h2 | Your history | keep |  |  |
| C0722 | article | p | Any past applications or refusals. Being open helps us help you. | edit | Any past applications or refusals. It is better that we know at the start. | 'helps us help you' is casual; plain and warm, and it says why |
| C0723 | article | pull quote | Not sure about some of them? That is what the first conversation is for. | keep |  |  |

## /insights/explain-your-family-once (11 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0724 | meta | page title | Why a multi-country family needs one point of contact | keep |  |  |
| C0725 | meta | meta description | When the residency, the home, the company and the school are handled by different people, the family becomes the coordinator. It should be the other way round. | keep |  |  |
| C0726 | hero | eyebrow | Private Office | keep |  |  |
| C0727 | hero | h1.d1 | Why a multi-country family needs one point of contact | keep |  |  |
| C0728 | article | p.article-dek | When the residency, the home, the company and the school are handled by different people, the family becomes the coordinator. It should be the other way round. | keep |  |  |
| C0729 | article | p | A family that lives across borders rarely has one question. The residency touches the home; the home touches the school; the company touches the tax position. Handled separately, each adviser sees a slice and the family carries the whole. | keep |  |  |
| C0730 | article | h2 | One table | keep |  |  |
| C0731 | article | p | Imperial’s houses sit at one table, so the person advising on your residency already knows about the home, the company and the school. | keep |  |  |
| C0732 | article | h2 | One person | keep |  |  |
| C0733 | article | p | One Relationship Manager brings each house in when it is needed, and qualified specialists for regulated matters such as tax, legal and investment. | keep |  |  |
| C0734 | article | pull quote | You never have to explain your family twice. | keep |  |  |

## /insights/your-client-stays-your-client (12 strings, 4 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0735 | meta | page title | Your Client stays your Client: how introductions work | keep |  |  |
| C0736 | meta | meta description | For lawyers, bankers, wealth advisers and family offices, an introduction should protect the relationship, not put it at risk. | edit | For lawyers, bankers, advisers and family offices, an introduction should protect the relationship, not put it at risk. | 'wealth' is an avoided word; the professions are named without it, as the Partners Club line now does |
| C0737 | hero | span | Partners | keep |  |  |
| C0738 | hero | eyebrow | Partners | keep |  |  |
| C0739 | hero | h1.d1 | Your Client stays your Client: how introductions work | keep |  |  |
| C0740 | article | p.article-dek | For lawyers, bankers, wealth advisers and family offices, an introduction should protect the relationship, not put it at risk. | edit | For lawyers, bankers, advisers and family offices, an introduction should protect the relationship, not put it at risk. | 'wealth' is an avoided word; the professions are named without it, as the Partners Club line now does |
| C0741 | article | p | Professional advisers are often the first people a Client asks about living or investing abroad. The question is who to hand that conversation to without worrying about it. | keep |  |  |
| C0742 | article | h2 | Four steps | keep |  |  |
| C0743 | article | p | Introduce, with your Client’s permission, through one simple form. A Relationship Manager meets your Client and explains their options plainly. You receive clear updates at every stage. Terms are honoured exactly as set out in your written agreement. | edit | Tell us about the introduction, with your Client’s permission. A Relationship Manager meets your Client and explains their options plainly. We tell you where the introduction stands, at every stage. The terms of your written agreement are honoured exactly as set out. | editor: the first step now matches the edited Partners Club page (divisions C0428), where details follow once written terms are in place; claims C50 and C51 as the writer had them; writer: claims C50 and C51: updates are told, not seen in a portal, and the written agreement is not named as the Partner Agreement before counsel approves it |
| C0744 | article | h2 | Shared standards | keep |  |  |
| C0745 | article | p | We never guarantee citizenship, visa, residency, investment or tax outcomes, and we claim no influence with any government. Every Client-facing document is checked against an approved claims list. | edit | We never guarantee citizenship, visa, residency, investment or tax outcomes, and we claim no influence with any government. Every Client-facing document is approved by Imperial before use. | claims C102: no approved claims list exists yet; the denials stay as they are |
| C0746 | article | pull quote | Your reputation travels with ours. | keep |  |  |

## /insights/everything-in-writing (11 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0747 | meta | page title | What “everything in writing” means in practice · Imperial | keep |  |  |
| C0748 | meta | meta description | Before you decide anything, you should be able to see every option, its costs and its timeline side by side. | keep |  |  |
| C0749 | hero | span | Our standard | keep |  |  |
| C0750 | hero | eyebrow | Our standard | keep |  |  |
| C0751 | hero | h1.d1 | What “everything in writing” means in practice | keep |  |  |
| C0752 | article | p.article-dek | Before you decide anything, you should be able to see every option, its costs and its timeline side by side. | keep |  |  |
| C0753 | article | p | Programmes, costs and timelines are set by governments and change over time. That is why every plan we prepare is confirmed in writing for your family before you decide. | keep |  |  |
| C0754 | article | h2 | What every plan includes | keep |  |  |
| C0755 | article | p | An eligibility review; options compared side by side in plain language; a full, itemised cost schedule; an honest timeline, updated as things move; a document checklist; a quality check before anything is submitted; specialists coordinated for you; and aftercare. | keep |  |  |
| C0756 | article | h2 | The small print, said plainly | keep |  |  |
| C0757 | article | p | Final approval always rests with the relevant government. We tell you that at the start, and keep you informed at every stage. | keep |  |  |

## /contact (95 strings, 29 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0758 | meta | page title | Contact · Imperial Holdings Group | keep |  |  |
| C0759 | meta | meta description | Speak to Imperial Holdings Group. Three short steps, routed to the right house, with one person as your point of contact. | edit | Start a relationship with Imperial Holdings Group. Three paths: private clients, professional partners, institutions. One person reads it and replies. | the journey's description, trimmed to under 160 characters |
| C0760 | hero | span | Contact | keep |  |  |
| C0761 | hero | eyebrow | Speak to us | edit | Start a relationship | the journey's eyebrow; replaces Speak to us |
| C0762 | hero | h1.d1 | Shall we begin? | keep |  |  |
| C0763 | hero | lead paragraph | Three short steps. Tell us where you are, and where you would like to be. We will make sure the right house picks it up, with one person as your point of contact. | edit | Tell us a little about yourself and what you have in mind. One person at Imperial will read it and reply personally. Three paths; choose the one that describes you. | the journey's chooser lead, verbatim |
| C0764 | forms (contact) | ol aria-label | Progress | keep |  |  |
| C0765 | forms (contact) | list item | 1. What it is about | keep |  |  |
| C0766 | forms (contact) | list item | 2. About you | keep |  |  |
| C0767 | forms (contact) | list item | 3. Your message | keep |  |  |
| C0768 | forms (contact) | h2 | What can we help with? | edit | What brings you to Imperial? | the journey's first screen title |
| C0769 | forms (contact) | p | Choose the closest. We route it to the right house, and you keep one point of contact. | edit | Choose the closest. It decides which house reads your message. | the journey's first screen lead; "route" was transactional |
| C0770 | forms (contact) | div aria-label | What can we help with? | edit | What brings you to Imperial? | matches the heading it labels |
| C0771 | forms (contact) | label > span | Citizenship Citizenship or residency for my family | edit | Citizenship A second residency or citizenship | the journey's option label after the division name; "for my family" presumed a family |
| C0772 | forms (contact) | label > span | Private Office Ongoing support as an existing Imperial Client | edit | Private Office Continuing support as an existing Imperial Client | the journey's option label after the division name |
| C0773 | forms (contact) | label > span | Partners Club Becoming a Partner, or introducing a Client | edit | Partners Club Introducing a client, or becoming an Imperial Partner | the journey's two Partners Club options in one label; client lower case as the rule says |
| C0774 | forms (contact) | label > span | Academy Training, learning or careers | keep |  |  |
| C0775 | forms (contact) | label > span | Real Estate Property in Dubai | edit | Real Estate A home or property in Dubai | the journey's option label after the division name |
| C0776 | forms (contact) | label > span | Group A strategic or institutional enquiry | keep |  |  |
| C0777 | forms (contact) | p.route-err | Please choose what we can help with. | edit | Please choose the closest, so that the right house can reply. | says what to do and why, as the guide asks |
| C0778 | forms (contact) | note (span.xs) | Step 1 of 3 | keep |  |  |
| C0779 | forms (contact) | button > span | Continue | keep |  |  |
| C0780 | forms (contact) | h2 | About you | keep |  |  |
| C0781 | forms (contact) | p | So the right person can reply. We only use these details to respond. | edit | So the right office replies, and the conversation starts in the right place. We use these details only to respond. | editor: the journey's step two lead, keeping the current line of help where the personal details are typed, as the guide's form microcopy asks |
| C0782 | forms (contact) | form label | Preferred way to reach you | edit | Reply by | the journey's label; shorter, same meaning |
| C0783 | forms (contact) | option (select pref) | Email | keep |  |  |
| C0784 | forms (contact) | option (select pref) | Phone call | keep |  |  |
| C0785 | forms (contact) | option (select pref) | Either | keep |  |  |
| C0786 | forms (contact) | button (outline) > span | Back | keep |  |  |
| C0787 | forms (contact) | h2 | Your message | edit | How shall we reply? | the journey's closing screen title |
| C0788 | forms (contact) | p | A few lines are enough. No documents are needed for a first conversation. | edit | One person will read this and reply personally. | the journey's closing lead; the documents line moves to the field placeholder |
| C0789 | forms (contact) | placeholder (textarea msg) | A few lines about your family, your plans or your practice. | keep |  | editor: the current placeholder says what to write and reads in the voice; the documents line stays in Before we speak and the Questions |
| C0790 | forms (contact) | error message | Please tell us a little about your enquiry. | keep |  |  |
| C0791 | forms (contact) | note (p.xs) | We use these details only to respond. Nothing is shared beyond what a service needs. | edit | Nothing is shared beyond the people who need it to reply. | the journey's closing footnote; "a service" was abstract |
| C0792 | offices | eyebrow | Offices | keep |  |  |
| C0793 | offices | h3.h3 | Dubai Headquarters | keep |  |  |
| C0794 | offices | div | Address 804 Single Business Tower Business Bay, Dubai United Arab Emirates | keep |  |  |
| C0795 | offices | span | Phone | keep |  |  |
| C0796 | offices | button link (outline) > span | WhatsApp Dubai | keep |  |  |
| C0797 | offices | note (p.xs) | To confirm: Confirm this number is WhatsApp enabled | edit | To confirm: WhatsApp enabled on this number | the placeholder stays; "Confirm ... confirm" repeated itself |
| C0798 | offices | h3.h3 | Lagos Regional hub | edit | Lagos Office | claims C22: no record calls Lagos a regional hub; the role label becomes Office |
| C0799 | offices | div | Address 8 Aromire Road, Ikoyi Lagos 106104 Nigeria | keep |  |  |
| C0800 | offices | button link (outline) > span | WhatsApp Lagos | keep |  |  |
| C0801 | offices | h3.h3 | Online | keep |  |  |
| C0802 | offices | span | Book a first conversation | keep |  |  |
| C0803 | offices | placeholder chip | To confirm: Dubai booking page | keep |  |  |
| C0804 | offices | placeholder chip | To confirm: Lagos booking page | keep |  |  |
| C0805 | offices | h3.h4 | Before we speak | keep |  |  |
| C0806 | offices | p | You do not need any documents for the first conversation. It helps to think about who would be included, where you live and hold citizenship today, and any dates that matter. | keep |  |  |
| C0807 | offices | note (p.small) | The first conversation is for listening. You do not have to decide anything on the first call. | keep |  |  |
| C0808 | questions | eyebrow | Questions | keep |  |  |
| C0809 | questions | h2.d2 | Before you get in touch. | keep |  |  |
| C0810 | questions | lead paragraph | Short answers to what people ask most. Anything else, ask us directly. | keep |  |  |
| C0811 | questions | h3 | Do I need any documents for a first conversation? | keep |  |  |
| C0812 | questions | p | No. The first conversation is for listening. It helps to think about who would be included, where you live and hold citizenship today, a rough budget and any dates that matter, but nothing needs to be prepared. | keep |  |  |
| C0813 | questions | h3 | Will I have to deal with several people across the houses? | keep |  |  |
| C0814 | questions | p | No. One Relationship Manager is your point of contact across every house, and brings each one in when it is needed. You never have to explain your family twice. | keep |  |  |
| C0815 | questions | h3 | Can you guarantee that an application will be approved? | keep |  |  |
| C0816 | questions | p | No one honestly can. Final approval of any citizenship or residency application always rests with the relevant government. We tell you that at the start, and keep you informed at every stage. | keep |  |  |
| C0817 | questions | h3 | Do you give tax, legal or investment advice? | keep |  |  |
| C0818 | questions | p | Advice on regulated matters such as tax, legal or investment is given only by appropriately qualified specialists. Your Relationship Manager coordinates them for you. | keep |  |  |
| C0819 | questions | h3 | What happens to the information I share? | keep |  |  |
| C0820 | questions | p | It is used to respond to you, kept in our customer relationship system, and shared only where a service requires it. Private matters stay private. You can ask for a copy, or for deletion, at any time. | keep |  |  |
| C0821 | questions | text link | Privacy notice | keep |  |  |
| C0822 | questions | h3 | I am a lawyer, banker or wealth adviser. Can I introduce a Client? | edit | I am a lawyer, banker or adviser. Can I introduce a client? | client lower case in the general sense, as the rule says; "adviser" covers the professions named |
| C0823 | questions | p | Yes, through Imperial Partners Club. Your Partner Agreement sets out exactly how introductions work, you receive clear updates at every stage, and your Client stays your Client. | edit | Yes. Introductions are governed by a written agreement that sets out exactly how they work, you receive clear updates at every stage, and your Client stays your Client. | claims C97: the Partner Agreement is not yet approved by counsel; the softened wording |
| C0824 | questions | h3 | Is Imperial Real Estate open yet? | keep |  |  |
| C0825 | questions | p | Not yet. Imperial Real Estate is licensed and has not launched. You can register your interest and we will contact you when it opens. | keep |  |  |
| C0826 | questions | text link | Register interest | keep |  |  |
| C0827 | questions | h3 | Where are you based? | keep |  |  |
| C0828 | questions | p | Our headquarters is in Dubai, with a regional hub in Lagos and relationships with Partners, advisers and specialists in more than 20 countries. | edit | Our headquarters is in Dubai and we have an office in Lagos. We work with Partners, advisers and specialists in the Caribbean, Europe and the Gulf. | claims C17: the country count has no record; the softened wording |
| C0829 | offices | clock (p.clock) | Local time {hh:mm}, {weekday} | keep |  |  |
| C0830 | forms (contact) | routing card (p) | Your enquiry will be routed to {Division name}. | edit | This goes to {Division name}. | the journey's routing line; "routed" was transactional. editor: the inventory's run-time token kept as written |
| C0831 | forms (contact) | routing card (p) | Your enquiry will be routed to Imperial Real Estate, which has not yet launched. We will register your interest. | edit | This goes to Imperial Real Estate, which has not yet launched. We will register your interest and tell you plainly what is possible today. | the journey's routing line and its Real Estate variant; says plainly what is not yet open |
| C0832 | forms (contact) | routing card link | Register interest instead | keep |  |  |
| C0833 | forms (contact) | routing card link | Or go direct: imperialcitizenship.com | edit | Visit imperialcitizenship.com | the guide's pattern: the domain is the label |
| C0834 | forms (contact) | routing card link | Visit the website | remove |  | editor: the journey shows a division site link only when the site is live, so the link is not shown until then; once a site is live the domain is the label, as C0833 |
| C0835 | forms (contact) | routing card (strong) | We will pass this to the Group team. | edit | This goes to the Group. | the journey's routing line for the Group |
| C0836 | forms (contact) | routing card (p) | One person will reply and bring in the right house. | edit | One person will read it, bring in the right house if one is needed, and reply personally. | the journey's Group variant, verbatim |
| C0837 | forms (contact) | label (p.from-finder) | From the house finder | keep |  |  |
| C0838 | forms (contact) | review row label (dt) | About | keep |  |  |
| C0839 | forms (contact) | review row label (dt) | Interests | keep |  |  |
| C0840 | forms (contact) | review row label (dt) | Name | keep |  |  |
| C0841 | forms (contact) | review row label (dt) | Email | keep |  |  |
| C0842 | forms (contact) | review row label (dt) | Phone | keep |  |  |
| C0843 | forms (contact) | review row label (dt) | Country | keep |  |  |
| C0844 | forms (contact) | review row label (dt) | Nationality | keep |  |  |
| C0845 | forms (contact) | review row label (dt) | For | keep |  |  |
| C0846 | forms (contact) | review row label (dt) | Reply by | keep |  |  |
| C0847 | forms (contact) | review row label (dt.vh) | Change | keep |  |  |
| C0848 | forms (contact) | text button | Edit these details | edit | Change | the journey's one Change link on the summary line |
| C0849 | forms (contact) | screen reader announcement | Step {n} of 3: {step name} | keep |  |  |
| C0850 | forms | field name fallback | What we can help with | edit | What brings you to Imperial | names the step one choice as the new heading does, for the announcement |
| C0851 | offices | link (a.ul) | Book a conversation, {Dubai or Lagos} | keep |  |  |
| C0852 | meta | LocalBusiness name (JSON-LD) | Imperial Holdings Group, {Dubai or Lagos} | keep |  |  |

## /privacy (56 strings, 9 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0853 | meta | page title | Privacy · Imperial Holdings Group | keep |  |  |
| C0854 | meta | meta description | Privacy notice for the Imperial Holdings Group website: who we are, what we collect through our enquiry forms, how we use it and your rights. | keep |  |  |
| C0855 | hero | span | Privacy | keep |  |  |
| C0856 | hero | h1.d1 | Privacy notice | keep |  |  |
| C0857 | hero | lead paragraph | What we collect when you write to us, where it goes, how long we keep it, and how to ask for a copy or for deletion. Written plainly, so it can be read in a few minutes. | keep |  |  |
| C0858 | legal | div | Awaiting legal review. This notice describes what the site does today and is complete in substance. Counsel reviews and approves it before launch. Legal entity, licence number and registered address: To confirm: to confirm | edit | Awaiting legal review. This notice describes what the site does today and is complete in substance. Counsel reviews and approves it before launch. Legal entity, licence number and registered address: To confirm: Entity, licence and address | editor: the chip read to confirm twice; it now names what is missing, and every statement before it is unchanged |
| C0859 | legal | h2 | Who we are | keep |  |  |
| C0860 | legal | p | This website is published by Imperial Holdings Group, the parent of Imperial Citizenship, Imperial Private Office, Imperial Partners Club, Imperial Academy and Imperial Real Estate, with offices in Dubai and Lagos. | hold | This website is published by To confirm: Legal entity, trading as Imperial Holdings Group, the parent brand of Imperial Citizenship, Imperial Private Office, Imperial Partners Club, Imperial Academy and Imperial Real Estate, with offices in Dubai and Lagos. | claims C25: the holding company is not incorporated, so the publishing entity is a placeholder (the chip is the two words Legal entity); the claims wording, with the five divisions named as today |
| C0861 | legal | p | The entity responsible for your information, the data controller, is To confirm: Legal entity, registered address and data controller. In this notice, we and us mean that entity. | keep |  |  |
| C0862 | legal | h2 | What we collect | keep |  |  |
| C0863 | legal | p | You can read this site without giving us any information about yourself. We collect personal information only when you send it to us through one of our forms: the enquiry card, the three step contact form, the Imperial Real Estate register interest form and the request for the citizenship guide. | edit | You can read this site without giving us any information about yourself. We collect personal information only when you send it to us through one of our forms: the enquiry card, the three-step contact form, the Imperial Real Estate register interest form and the request for the citizenship guide. | editor: British English: three-step takes a hyphen as a compound before the noun, as one-time does below; the list of forms is unchanged |
| C0864 | legal | p | Depending on the form, we ask for: | keep |  |  |
| C0865 | legal | list item | your name and email address; | keep |  |  |
| C0866 | legal | list item | your telephone number, if you choose to give it; | keep |  |  |
| C0867 | legal | list item | your country of residence, and your nationality or nationalities; | keep |  |  |
| C0868 | legal | list item | whether you are writing as a private client, a professional partner or an institution, and who the enquiry is for: yourself, your family or a client you are introducing; | keep |  |  |
| C0869 | legal | list item | what it concerns, which tells us which of our divisions should reply; | keep |  |  |
| C0870 | legal | list item | when you would like to begin, and a budget range if you choose to give one; | keep |  |  |
| C0871 | legal | list item | for Partners Club enquiries, your firm and your profession; | keep |  |  |
| C0872 | legal | list item | for property enquiries, what you are looking for, whether you wish to buy or rent, and the area that interests you; | keep |  |  |
| C0873 | legal | list item | how you would prefer to be contacted; | keep |  |  |
| C0874 | legal | list item | if you came to the form from the house finder, the ambitions you chose there; | keep |  |  |
| C0875 | legal | list item | your message, and your agreement to this notice. | keep |  |  |
| C0876 | legal | p | Each form also records, without asking you, where the enquiry came from: the page you sent it from, the page you first arrived on, the site that referred you, and any campaign tags in the address you arrived by (utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid and fbclid), together with which of our forms and sites the enquiry came through. We use these to see which of our channels brought you to us. They describe a channel, not you, and we do not join them to any advertising profile. | edit | Each form also records, without asking you, where the enquiry came from: the page you sent it from, the page you first arrived on, the site that referred you, and any campaign tags in the address you arrived by (utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid and fbclid). It also records which of our forms and sites the enquiry came through. We use these to see which of our channels brought you to us. They describe a channel, not you, and we do not join them to any advertising profile. | one 70-word sentence; split in two for plain structure, every item and statement unchanged |
| C0877 | legal | p | The programme fit check on the Imperial Citizenship page keeps your five answers with your enquiry, so that the first conversation starts in the right place. Nothing is kept unless you then send the form. | keep |  |  |
| C0878 | legal | p | If you ask us to verify your telephone number after sending a form, we send a one time code by WhatsApp or SMS and record whether it was entered. This step is optional. Your enquiry reaches us either way. | edit | If you ask us to verify your telephone number after sending a form, we send a one-time code by WhatsApp or SMS and record whether it was entered. This step is optional. Your enquiry reaches us either way. | British English: one-time takes a hyphen; nothing else changes |
| C0879 | legal | p | Our forms include a hidden field that only automated software fills in. We use it to reject spam, and for nothing else. | keep |  |  |
| C0880 | legal | p | Our systems note the network address (the IP address) a form was sent from, so that one connection cannot flood us with submissions. When the Cloudflare Turnstile spam check is switched on, Cloudflare also receives that address, to tell a person from automated software. To confirm: Whether Turnstile is switched on at launch | keep |  |  |
| C0881 | legal | p | What you type into a form is kept in your own browser until the form is sent or you choose Start afresh, so that nothing is lost if the page reloads. It stays on your device and reaches us only when you press send. For the current visit only, your browser also keeps the campaign tags described above and a note that you have seen the opening animation. | keep |  |  |
| C0882 | legal | h2 | Where it goes | keep |  |  |
| C0883 | legal | p | Your enquiry goes first to Netlify, the company that hosts this website, which keeps a copy in its form inbox, and from there to Pipedrive, the customer relationship system we use, where it is stored. It is assigned to one named person in the relevant Imperial team: Imperial Citizenship, Imperial Private Office, Imperial Partners Club, Imperial Academy, Imperial Real Estate or the Group team. If you have written to us before, the new enquiry is added to your existing record rather than creating a second one. | keep |  |  |
| C0884 | legal | p | Two further providers are used only when those features are switched on: an email provider, to send you a short confirmation of your enquiry, and a telephone verification provider, to send the one time code. Each receives only what its task needs: your name and email address for the confirmation, your telephone number for the code. To confirm: Email provider (Resend in the current build) and telephone verification provider (Twilio Verify in the current build), and whether each is switched on at launch | edit | Two further providers are used only when those features are switched on: an email provider, to send you a short confirmation of your enquiry, and a telephone verification provider, to send the one-time code. Each receives only what its task needs: your name and email address for the confirmation, your telephone number for the code. To confirm: Email provider (Resend in the current build) and telephone verification provider (Twilio Verify in the current build), and whether each is switched on at launch | British English: one-time takes a hyphen; the provider placeholder stays as it is |
| C0885 | legal | p | We do not sell your information, and we do not share it with anyone for their own marketing. Within the Group it is visible to our team in the customer relationship system and used only by the person answering you. Where a service is delivered by one of our trusted Partners, we share what that service needs, and only with your agreement. | keep |  |  |
| C0886 | legal | p | Our offices are in the United Arab Emirates and Nigeria. The providers named above may store information outside the country you live in. To confirm: Where each provider stores data, and the safeguards that apply, to be confirmed by counsel | keep |  |  |
| C0887 | legal | h2 | How long we keep it | keep |  |  |
| C0888 | legal | p | We keep your enquiry for To confirm: Retention period, for example 24 months after our last contact with you, and then delete it, unless you have become a client, in which case your record is kept for as long as the relationship lasts and for any period the law requires afterwards. | edit | We keep your enquiry for To confirm: Retention period, for example 24 months after our last contact with you, and then delete it, unless you have become a Client, in which case your record is kept for as long as the relationship lasts and for any period the law requires afterwards. | capitalisation: Client means a person Imperial serves; the retention placeholder and the rule stay as they are |
| C0889 | legal | h2 | Your choices and your rights | keep |  |  |
| C0890 | legal | p | You can ask us at any time to send you a copy of the information we hold about you, to correct it, to delete it, or to stop contacting you. Write to info@imperialholdingsgroup.com To confirm: Dedicated privacy mailbox and we will reply promptly. | hold | You can ask us at any time to send you a copy of the information we hold about you, to correct it, to delete it, or to stop contacting you. Write to To confirm: Dedicated privacy mailbox (info@imperialholdingsgroup.com until confirmed) and we will reply promptly. | claims C24: no record shows the Group mailbox exists or is monitored, so the address moves inside the placeholder until the Founder confirms it or publishes info@imperialcitizenship.com meanwhile; the rights and the promise to reply are unchanged |
| C0891 | legal | p | You can withdraw your agreement to this notice at any time by writing to the same address. This does not affect anything done before you withdrew it. | keep |  |  |
| C0892 | legal | p | If you ask us to delete your information, we remove it from our systems and ask our providers to do the same, unless the law requires us to keep it, in which case we will tell you. | keep |  |  |
| C0893 | legal | p | Depending on where you live, the law may give you further rights, including the right to complain to a supervisory authority. To confirm: Applicable data protection law and supervisory authority for each office, to be confirmed by counsel | keep |  |  |
| C0894 | legal | h2 | Analytics and cookies | keep |  |  |
| C0895 | legal | p | This site sets no advertising cookies and no cookie that follows you to other sites, so there is no cookie banner. | keep |  |  |
| C0896 | legal | p | When our analytics are switched on, they run in a cookie-free configuration: nothing is stored on your device, the service is asked not to keep your network address, and we see counts of visits and of which pages and buttons were used, not who you are. To confirm: Analytics provider (Google Analytics 4, cookie-free, in the current build) and whether it is switched on at launch | keep |  |  |
| C0897 | legal | p | The only things this site stores on your device are the form drafts and the two visit values described above. They exist for your convenience and reach us only as part of a form you choose to send. | keep |  |  |
| C0898 | legal | p | Where a video appears on this site, the player loads only when you press play, in its do-not-track mode, except the short silent loop on the home page, which plays without sound and sends nothing you typed. The video host then receives your network address, as any website you visit does. Links to WhatsApp and to our booking pages take you to those services, which have their own privacy terms. | keep |  |  |
| C0899 | legal | h2 | Security | keep |  |  |
| C0900 | legal | p | We keep your information on systems that only authorised people can reach, and we limit it to the people who need it. No system is perfectly secure. If we learn of a breach that affects your information, we will tell you. | keep |  |  |
| C0901 | legal | h2 | Children | keep |  |  |
| C0902 | legal | p | This site is not aimed at children, and we do not knowingly collect information from anyone under 18. | keep |  |  |
| C0903 | legal | h2 | Changes to this notice | keep |  |  |
| C0904 | legal | p | If this notice changes, the new version will be published on this page with the date it took effect. To confirm: Date of the version approved by counsel | keep |  |  |
| C0905 | legal | h2 | How to contact us | keep |  |  |
| C0906 | legal | p | Write to info@imperialholdingsgroup.com To confirm: Dedicated privacy mailbox, or to either office. | hold | Write to To confirm: Dedicated privacy mailbox (info@imperialholdingsgroup.com until confirmed), or to either office. | claims C24: as the rights paragraph; the address sits inside the placeholder until confirmed, and either office remains a way to write |
| C0907 | legal | div | Dubai 804 Single Business Tower Business Bay, Dubai United Arab Emirates +971 4 546 1110 | keep |  |  |
| C0908 | legal | div | Lagos 8 Aromire Road, Ikoyi Lagos 106104 Nigeria +234 902 222 2024 | keep |  |  |

## /terms (13 strings, 2 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0909 | meta | page title | Terms · Imperial Holdings Group | keep |  |  |
| C0910 | meta | meta description | Terms of use for the Imperial Holdings Group website: information only, not advice, and no guarantee of any government decision or outcome. | keep |  |  |
| C0911 | hero | span | Terms | keep |  |  |
| C0912 | hero | h1.d1 | Terms of use | keep |  |  |
| C0913 | legal | div | Awaiting legal review. This page is a placeholder. The final terms of use will be drafted and approved by counsel before launch. Legal entity, licence number and registered address: To confirm: to confirm | edit | Awaiting legal review. This page is a placeholder. The final terms of use will be drafted and approved by counsel before launch. Legal entity, licence number and registered address: To confirm: Entity, licence and address | editor: as the privacy notice: the chip names what is missing instead of saying to confirm twice; nothing else changes |
| C0914 | legal | h2 | About this website | keep |  |  |
| C0915 | legal | p | This website is for information only and is not an offer or advice. Advice on regulated matters such as tax, legal or investment is provided only by appropriately qualified specialists. | keep |  |  |
| C0916 | legal | h2 | No guarantees | keep |  |  |
| C0917 | legal | p | Imperial does not guarantee government decisions or outcomes. Final approval of any citizenship or residency application rests with the relevant government. | keep |  |  |
| C0918 | legal | h2 | Use of this site | keep |  |  |
| C0919 | legal | p | You may read and share what is published here for your own information. The text, photographs, logos and marks belong to Imperial Holdings Group or to those who licensed them to us. To confirm: Full terms of use, to be drafted by counsel | keep |  |  |
| C0920 | legal | h2 | Governing law | keep |  |  |
| C0921 | legal | p | These terms are governed by the law of To confirm: Jurisdiction to confirm. | edit | These terms are governed by the law of To confirm: Jurisdiction. | editor: the chip said to confirm twice; the governing law stays unstated and the placeholder names it |

## /404 (8 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0922 | meta | page title | Page not found · Imperial Holdings Group | keep |  |  |
| C0923 | meta | meta description | Imperial Holdings Group: five specialist divisions, one standard, and one person who knows your family. Led from Dubai and Lagos. | keep |  |  |
| C0924 | 404 | eyebrow | Page not found | keep |  |  |
| C0925 | 404 | h1.d2 | This page has moved, or never existed. | keep |  |  |
| C0926 | 404 | lead paragraph | Let us take you somewhere useful. | keep |  |  |
| C0927 | 404 | button link (gold) > span | Home | keep |  |  |
| C0928 | 404 | text link | Our divisions | keep |  |  |
| C0929 | meta | default meta description | Imperial Holdings Group: five specialist divisions, one standard, and one person who knows your family. Led from Dubai and Lagos. | keep |  |  |

## /error (7 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0930 | meta | page title | Something went wrong · Imperial Holdings Group | keep |  |  |
| C0931 | meta | meta description | Something went wrong on our side. Please try again in a moment, or call or email Imperial Holdings Group. | keep |  |  |
| C0932 | error | eyebrow | Error | keep |  |  |
| C0933 | error | h1.d2 | Something went wrong on our side. | keep |  |  |
| C0934 | error | lead paragraph | Please try again in a moment. If it happens again, call or email us and we will take it from there. | keep |  |  |
| C0935 | error | button (gold) > span | Try again | keep |  |  |
| C0936 | error | text link | Home | keep |  |  |

## all pages (146 strings, 37 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C0937 | header | a.skip | Skip to content | keep |  |  |
| C0938 | veil | span.iv-word | Imperial Holdings Group | keep |  |  |
| C0939 | header | a aria-label | Imperial Holdings Group, home | keep |  |  |
| C0940 | header / footer | img alt text | Imperial Holdings Group | keep |  |  |
| C0941 | header | nav aria-label | Main | keep |  |  |
| C0942 | header / menu / footer | a | About | keep |  |  |
| C0943 | header | button.mega-btn | Our ecosystem | keep |  |  |
| C0944 | header / menu / footer | a | Our Network | edit | Our network | Title case breaks with Our ecosystem beside it; sentence case, still two words |
| C0945 | header / menu / hero | a | Journal | keep |  |  |
| C0946 | header / menu / footer | a | Contact | keep |  |  |
| C0947 | header | button aria-label | Search the site, Ctrl K | keep |  |  |
| C0948 | header | button.srch-btn > kbd | Ctrl K | keep |  |  |
| C0949 | header / menu | button link (outline) > span | Enquire now | edit | Start a relationship | Enquire now is the generic sales label; the journey's own name is its entry point in the header and the mobile quick actions |
| C0950 | header | button aria-label | WhatsApp us | keep |  |  |
| C0951 | header | button aria-label | Open menu | keep |  |  |
| C0952 | header | div.wa-pop-h | WhatsApp us | keep |  |  |
| C0953 | header | a.wa-row > b | Dubai | keep |  |  |
| C0954 | header / hero / the Group / leadership / footer / our story / founder film / compare / what we do / guide / overview / gallery / event / article / offices / legal | span title attribute | Placeholder: to be confirmed | keep |  |  |
| C0955 | header | placeholder chip | To confirm: Confirm this number is WhatsApp enabled | edit | To confirm: WhatsApp enabled on this number | Confirm twice in one chip; the placeholder stays, the words after the colon name what is missing |
| C0956 | header | a.wa-row > b | Lagos | keep |  |  |
| C0957 | header | button aria-label | Back to top | keep |  |  |
| C0958 | header | nav aria-label | Quick actions | keep |  |  |
| C0959 | header | button aria-label | Search the site | keep |  |  |
| C0960 | noscript | div.nojs | This site needs JavaScript to display. Please enable it, or contact Imperial Holdings Group directly. | edit | This website needs JavaScript to display. Please enable it, or call us directly: Dubai +971 4 546 1110, Lagos +234 902 222 2024. | A visitor without JavaScript had no way on; both verified office numbers give one (the Group email is on hold) |
| C0961 | header | toast | Link to confirm. {placeholder text} will be added before launch. | keep |  |  |
| C0962 | header | toast placeholder text | Final production domain (imperialholdingsgroup.com) to confirm | keep |  |  |
| C0963 | header | toast placeholder text | Imperial Real Estate website link (at launch) | keep |  |  |
| C0964 | menu / ecosystem | eyebrow | Our ecosystem | keep |  |  |
| C0965 | menu | div.d3 | Five divisions. One table. | keep |  |  |
| C0966 | menu | p | One Relationship Manager across all five. | keep |  |  |
| C0967 | menu / ecosystem / other houses | text link | All divisions | keep |  |  |
| C0968 | menu | a.mega-item > b | Imperial Citizenship | keep |  |  |
| C0969 | menu | a.mega-item > small | The flagship | keep |  |  |
| C0970 | menu | a.mega-item > b | Imperial Partners Club | keep |  |  |
| C0971 | menu | a.mega-item > small | For professionals | edit | Opening in stages | Partners Club status softened per claims C49: the network is at pilot stage, so the label says where it stands rather than who it is for |
| C0972 | menu | a.mega-item > b | Imperial Private Office | keep |  |  |
| C0973 | menu | a.mega-item > small | For existing Clients | edit | By invitation, being established | Private Office status softened per claims C59: present tense was ahead of the record |
| C0974 | menu | a.mega-item > b | Imperial Real Estate | keep |  |  |
| C0975 | menu | a.mega-item > small | Coming soon | keep |  | editor: kept as Coming soon: the Real Estate status chip in the already-edited divisions group (C1242) says Coming soon, and the menu uses the same status words as the division pages; writer proposed: Coming soon is generic web; in preparation matches the decided home headline (Property in Dubai, in preparation) and says the same: not yet launched |
| C0976 | menu | a.mega-item > b | Imperial Academy | keep |  |  |
| C0977 | menu | a.mega-item > small | Learning and standards | edit | In development | Academy status softened per claims C68 (the Academy is internal and in development); two words, parallel with In preparation beside it; the caption below keeps Learning and standards |
| C0978 | menu | figure caption | Citizenship Second residency and citizenship by investment, from first conversation to completed application. | keep |  |  |
| C0979 | menu | figure caption | Partners Club The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | edit | Partners Club Lawyers, bankers, advisers and family offices who introduce Clients to the Group, on written terms. | editor: the caption now opens with the hero-final Partners Club line, as the division cards in the divisions group do (C1227), cut to one sentence for a menu caption; the status sits in the label above it; writer: Division line softened per claims C49 (the network is not yet built); wealth is an avoided word, dropped as the decided home line drops it |
| C0980 | menu | figure caption | Private Office One lasting relationship for families with multi-country lives. | edit | Private Office Ongoing support for existing Imperial Clients after the first service is complete. | editor: claims C59: the present-tense line was ahead of the record; the caption takes the opening of the hero-final Private Office line, as the divisions group does (C1230), and the status sits in the label above it |
| C0981 | menu | figure caption | Real Estate Licensed property advisory, starting with Dubai. | keep |  |  |
| C0982 | menu | figure caption | Academy Learning, training and certification for the people who do this work. | edit | Academy Learning and standards, in development: training and certification for the people who do this work. | editor: the writer's line ended 'who do this work, in development', which reads as if the people were in development; the status now opens the line, in the claims C68 wording (Learning and standards, in development), and matches the sister-site role C1401. Writer: present tense overstated per claims C68; the same promise, dated honestly |
| C0983 | menu | span | The houses online: | edit | Our websites: | House is the warm synonym for body copy only; a menu label names the thing plainly |
| C0984 | menu / footer | a | Imperial Holdings Group | keep |  |  |
| C0985 | menu / footer | a | imperialcitizenship.com | keep |  |  |
| C0986 | menu / footer | a > small (chip) | TBC | edit | To confirm | TBC is not a house word; To confirm is the placeholder chip text, and under Websites (and after Our websites:) it says the site is to come without lengthening a one-line row |
| C0987 | menu / footer / how we work | a | Partners Club | keep |  |  |
| C0988 | menu / footer / how we work | a | Private Office | keep |  |  |
| C0989 | menu / footer / how we work | a | Real Estate | keep |  |  |
| C0990 | menu / footer / how we work | a | Academy | keep |  |  |
| C0991 | menu | div aria-label | Menu | keep |  |  |
| C0992 | menu | button.mm-search > span | Search the site | keep |  |  |
| C0993 | menu / hero | a > span | Home | keep |  |  |
| C0994 | menu | button > span | Our ecosystem | keep |  |  |
| C0995 | menu | a > b | All divisions | keep |  |  |
| C0996 | menu | a > small | Five divisions, one table | keep |  |  |
| C0997 | menu / footer | a > b | Imperial Citizenship | keep |  |  |
| C0998 | menu / how we work | a > small | The flagship | keep |  |  |
| C0999 | menu / footer | a > b | Imperial Partners Club | keep |  |  |
| C1000 | menu / how we work | a > small | For professionals | edit | Opening in stages | As the mega menu label (claims C49) |
| C1001 | menu / footer | a > b | Imperial Private Office | keep |  |  |
| C1002 | menu / how we work | a > small | For existing Clients | edit | By invitation, being established | As the mega menu label (claims C59) |
| C1003 | menu / footer | a > b | Imperial Real Estate | keep |  |  |
| C1004 | menu / how we work | a > small | Coming soon | keep |  | editor: kept as Coming soon, as the mega menu label and the divisions status chip (C1242); writer proposed: As the mega menu label: not yet launched, in the decided home wording |
| C1005 | menu / footer | a > b | Imperial Academy | keep |  |  |
| C1006 | menu / how we work | a > small | Learning and standards | edit | In development | As the mega menu label (claims C68) |
| C1007 | menu | span | DUBAI · LAGOS · WORLDWIDE | edit | DUBAI · LAGOS | Worldwide carries the unsupported 20+ countries claim (claims C13); the two verified cities stand on their own |
| C1008 | menu | p.mm-hint | Swipe up or press Esc to close | keep |  |  |
| C1009 | menu | clock (span.clock) | {hh:mm} GST | edit | {hh:mm} Dubai | A time carries its city, not a zone abbreviation few visitors read; the token stays |
| C1010 | menu | button aria-label | Close menu | keep |  |  |
| C1011 | footer | p | Two cities. One horizon. Five specialist divisions, one standard, and one person who knows your family. | edit | Two Cities. One Horizon. Five specialist divisions, one standard, and one person who knows your family. | The secondary signature keeps its registered title case; the rest of the line is verified (claims C01) and stays |
| C1012 | footer | h2.fh | Divisions | keep |  |  |
| C1013 | footer | a > small (chip) | Soon | keep |  |  |
| C1014 | footer | h2.fh | The Group | keep |  |  |
| C1015 | footer | a | Our ecosystem | keep |  |  |
| C1016 | footer | a | Events and Journal | edit | Journal | The guide's footer names the section; events live inside the Journal, so the longer label added nothing |
| C1017 | footer | a | Questions | keep |  |  |
| C1018 | footer | button.flink | Search Ctrl K | keep |  |  |
| C1019 | footer | h2.fh | Offices | keep |  |  |
| C1020 | footer | div.off | Dubai Headquarters 804 Single Business Tower Business Bay, Dubai United Arab Emirates +971 4 546 1110 | keep |  |  |
| C1021 | footer | div.off | Lagos Regional hub 8 Aromire Road, Ikoyi Lagos 106104 Nigeria +234 902 222 2024 | edit | Lagos Office 8 Aromire Road, Ikoyi Lagos 106104 Nigeria +234 902 222 2024 | Regional hub has no record (claims C22, softened to Lagos office); the role renders under the city name, so Office says it without repeating Lagos |
| C1022 | footer | a | info@imperialholdingsgroup.com | hold | To confirm: Group email address | Claims C24 holds the address: no record shows the mailbox exists or is monitored; the Founder may publish info@imperialcitizenship.com meanwhile |
| C1023 | footer | h2.fh | Websites | keep |  |  |
| C1024 | footer | p | This website is for information only and is not an offer or advice. Advice on regulated matters such as tax, legal or investment is provided only by appropriately qualified specialists. Imperial does not guarantee government decisions or outcomes. To confirm: Legal entity, licence number and registered address | keep |  |  |
| C1025 | footer | details summary | Photography: Imperial events and leadership (own), plus Unsplash licence | edit | Photography: our own photographs of Imperial events and leadership, with interim photographs under the Unsplash licence | (own), plus reads as a note to ourselves; this says it to the visitor and calls the two licensed frames what they are, interim |
| C1026 | footer | list item | Palm Jumeirah and the Dubai coast from above by Nejc Soklič | keep |  |  |
| C1027 | footer | list item | Dubai skyline at sunset by Anoof C | keep |  |  |
| C1028 | footer | span | © 2026 Imperial Holdings Group. | keep |  |  |
| C1029 | footer | span | Privacy · Terms | keep |  |  |
| C1030 | palette | div aria-label | Search the site | keep |  |  |
| C1031 | palette | placeholder (input ) | Search divisions, events, articles, questions… | keep |  |  |
| C1032 | palette | button aria-label | Esc, close search | keep |  |  |
| C1033 | palette | button.pal-esc | Esc | keep |  |  |
| C1034 | palette | div aria-label | Search results | keep |  |  |
| C1035 | palette | ul aria-label | Results | keep |  |  |
| C1036 | palette | span | ↑ ↓ to move | keep |  |  |
| C1037 | palette | span | ↵ to open | keep |  |  |
| C1038 | palette | span | Esc to close | keep |  |  |
| C1039 | palette | placeholder (input) | Search divisions, events, articles, questions… | keep |  |  |
| C1040 | palette | group label (li.pal-grp) | Suggested | keep |  |  |
| C1041 | palette | result kind (span.pal-k) | Page | keep |  |  |
| C1042 | palette | result kind (span.pal-k) | Enquire | edit | Enquiry | Every other kind is a noun; enquiry is the house word for what the reader sends |
| C1043 | palette | result kind (span.pal-k) | Tool | keep |  |  |
| C1044 | palette | result kind (span.pal-k) | Event | keep |  |  |
| C1045 | palette | result kind (span.pal-k) | Division | keep |  |  |
| C1046 | palette | result kind (span.pal-k) | Insight | keep |  |  |
| C1047 | palette | result kind (span.pal-k) | Question | keep |  |  |
| C1048 | palette | result title | Home | keep |  |  |
| C1049 | palette | result subtitle | One house for a life across borders | edit | The parent of five specialist divisions, led from Dubai and Lagos | House is body copy only; a result subtitle says what the page is, in the verified words (claims C02) |
| C1050 | palette | result title | About the Group | keep |  |  |
| C1051 | palette | result subtitle | Our story, values and leadership | keep |  |  |
| C1052 | palette | result title | Our ecosystem | keep |  |  |
| C1053 | palette | result subtitle | Five divisions, side by side | keep |  |  |
| C1054 | palette | result title | Our Network | edit | Our network | As the navigation label: sentence case |
| C1055 | palette | result subtitle | Private clients, professional partners, institutions and strategic relationships | keep |  |  |
| C1056 | palette | result title | Events and Journal | edit | Journal | As the footer link: the section's name |
| C1057 | palette | result subtitle | Developments, insights, partnerships and selected events | edit | Company developments, insights and selected Imperial events in Dubai and Lagos | editor: the claims C83 wording verbatim; the writer's version dropped Imperial from selected Imperial events. Partnerships rests on no record and goes |
| C1058 | palette | result title | Insights | keep |  |  |
| C1059 | palette | result subtitle | Notes from the house | edit | Notes from the Group | editor: house is body copy only; the subtitle repeats the Insights heading (journal C0679) rather than narrowing what the notes cover; writer: House is body copy only; the subtitle says what the notes are about |
| C1060 | palette | result title | Speak to us | edit | Start a relationship | The default result is the journey's door and takes its name; Speak to us moves to the offices result below |
| C1061 | palette | result subtitle | Start a conversation in three short steps | edit | Three paths: private clients, professional partners, institutions. Three short steps. | Describes the journey as it now is, so the visitor knows what opens |
| C1062 | palette | result title | Enquire now | edit | Offices | editor: Speak to us is the secondary call to action that opens the contact journey everywhere else, so the same label cannot point at the office cards; the footer already calls this information Offices and the result takes that name. The writer's intent stands: the home enquiry card this result opened is replaced by the path cards, so the result now serves the Contact page's offices |
| C1063 | palette | result subtitle | Begin with one conversation | edit | Telephone, addresses and local time, Dubai and Lagos | editor: says what the Contact page office cards hold (guide section 6) in the two verified cities; WhatsApp and booking are left out while both carry To confirm chips, and 'offices' is not repeated under a result titled Offices |
| C1064 | palette | result title | Find your house | edit | Find the right division | House is body copy only; the tool's purpose, plainly |
| C1065 | palette | result subtitle | Answer two questions to see which divisions fit | keep |  |  |
| C1066 | palette | result title | Global presence | edit | Where we work | Global is replaced by international or nothing; the map's own label (Where we work) names the section without a presence claim |
| C1067 | palette | result subtitle | Dubai headquarters, Lagos hub, 20+ countries | edit | Dubai headquarters, Lagos office, Caribbean, Europe and the Gulf | Softened per claims C16: the country count has no record; the regions the programme brochures support stand |
| C1068 | palette | result title | Leadership | keep |  |  |
| C1069 | palette | result subtitle | Zaid Al Hindi, Hekma Iskandarani | keep |  |  |
| C1070 | palette | result title and subtitle | {event title} / {event dek} | keep |  |  |
| C1071 | palette | result title | Privacy notice | keep |  |  |
| C1072 | palette | result subtitle | How information is handled | keep |  |  |
| C1073 | palette | result title | Terms of use | keep |  |  |
| C1074 | palette | result subtitle | About this website | keep |  |  |
| C1075 | palette | result title and subtitle | {division name} / {division line} | keep |  |  |
| C1076 | palette | result title and subtitle | {insight title} / {insight dek} | keep |  |  |
| C1077 | palette | result title and subtitle | {question} / {answer} | keep |  |  |
| C1078 | palette | result title | {enquiry label} | keep |  | editor: kept: the token {enquiry label} is filled at run time from data.js enquiry[], whose labels the forms group has already revised; changing the token to a path name is a build change, not wording, so the fixed part stays; writer proposed: The journey replaces the six enquiry-type results with its three paths (Private Clients, Professional Partners, Institutions); the fixed part is the journey's name, the path name fills the token |
| C1079 | palette | result subtitle | Start an enquiry, routed to the right house | edit | Three short steps. One person reads your message and replies personally. | Routed to the right house is back-office language; this says what happens after the click |
| C1080 | palette | empty state (p.pal-empty) | Nothing matches “{query}”. Try a division, a country or a question, or ask us directly. | keep |  |  |
| C1374 | meta | Organization description (JSON-LD) | One house with five specialist divisions: Imperial Citizenship, Imperial Private Office, Imperial Partners Club, Imperial Academy and Imperial Real Estate. | edit | The parent of five specialist divisions, led from Dubai and Lagos: Imperial Citizenship, Imperial Partners Club, Imperial Private Office, Imperial Real Estate and Imperial Academy. | One house is body-copy warmth in structured data that search engines may print; the statement of record (claims C02, C03), divisions in the brief's order |
| C1375 | meta | web app name | Imperial Holdings Group / Imperial | keep |  |  |

## /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy (21 strings, 8 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1081 | enquiry | eyebrow | Confidential · No obligation | edit | Start a relationship | an eyebrow names the section; "No obligation" was a sales reassurance |
| C1082 | enquiry | h2.d2 | Begin with one conversation. | keep |  |  |
| C1083 | enquiry | lead paragraph | Tell us what you are planning. A senior adviser will read your enquiry and reply personally. | keep |  |  |
| C1088 | enquiry | note (p.xs) | Prefer three short steps? Use the guided form. | edit | Prefer three short steps? Start a relationship. | editor: keeps the current question, which read well; "guided" could be mistaken for the guide on the Citizenship page; the link carries the journey's name |
| C1090 | forms (enquiry) | eyebrow | Private enquiry | keep |  |  |
| C1093 | forms (enquiry) | form label | I am | keep |  |  |
| C1095 | forms (enquiry) | option (select audience) | A private client | keep |  |  |
| C1096 | forms (enquiry) | option (select audience) | A professional partner or introducer | keep |  |  |
| C1097 | forms (enquiry) | option (select audience) | An institution or strategic partner | keep |  |  |
| C1098 | forms (enquiry) | error message | Please tell us who you are. | edit | Please choose the one that describes you. | kinder than "tell us who you are"; echoes the chooser lead |
| C1099 | forms (enquiry) | form label | It concerns | keep |  |  |
| C1100 | forms (enquiry) | option (select division) | Choose the closest | keep |  |  |
| C1101 | forms (enquiry) | option (select division) | Citizenship or residency for my family | edit | A second residency or citizenship | the journey's option label; "for my family" presumed a family |
| C1102 | forms (enquiry) | option (select division) | Ongoing support as an existing Imperial Client | edit | Continuing support as an existing Imperial Client | the journey's option label |
| C1103 | forms (enquiry) | option (select division) | Becoming a Partner, or introducing a Client | edit | Introducing a client, or becoming an Imperial Partner | the journey's two Partners Club options in one label; client lower case as the rule says |
| C1104 | forms (enquiry) | option (select division) | Training, learning or careers | keep |  |  |
| C1105 | forms (enquiry) | option (select division) | Property in Dubai | edit | A home or property in Dubai | the journey's option label |
| C1106 | forms (enquiry) | option (select division) | A strategic or institutional enquiry | keep |  |  |
| C1107 | forms (enquiry) | error message | Please choose the closest. | keep |  |  |
| C1142 | forms (enquiry) | error message | A few lines are enough. | edit | Please tell us a little about your enquiry. A few lines are enough. | an error begins with Please and says what to do |
| C1146 | forms (enquiry) | note (span.xs) | We use your details only to reply to this enquiry. | keep |  |  |

## /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact, /404, /error (2 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1084 | enquiry / offices / 404 / error | span | Email | keep |  |  |
| C1085 | enquiry / offices / 404 / error | a.ul | info@imperialholdingsgroup.com | hold | To confirm: Group email address (info@imperialholdingsgroup.com, or info@imperialcitizenship.com meanwhile) | claims C24: no record that the mailbox exists or is monitored; placeholder until confirmed |

## /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /404, /error (2 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1086 | enquiry / 404 / error | span | Dubai | keep |  |  |
| C1087 | enquiry / 404 / error | span | Lagos | keep |  |  |

## /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /contact (59 strings, 4 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1089 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | label.hp | Leave this empty | keep |  |  |
| C1091 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | span | We kept what you started earlier. | keep |  |  |
| C1092 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | text button | Start afresh | keep |  |  |
| C1094 | forms (enquiry) / forms (interest) / forms (contact) | option (select audience) | Choose one | keep |  |  |
| C1108 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | form label | Full name | keep |  |  |
| C1109 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | error message | Please enter your name. | keep |  |  |
| C1110 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | form label | Email | keep |  |  |
| C1111 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | error message | Please enter a valid email address. | edit | Please enter an email address we can reply to. | "valid" was technical; says what the address is for |
| C1113 | forms (enquiry) / forms (interest) / forms (contact) | form label | Country of residence | keep |  |  |
| C1114 | forms (enquiry) / forms (interest) / forms (contact) | error message | Please tell us where you live. | keep |  |  |
| C1144 | forms (enquiry) / forms (guide) / forms (interest) / forms (contact) | consent text > em | Please tick the box so that we can reply. | keep |  |  |
| C1147 | forms | toast | Cleared. The form is empty again. | keep |  |  |
| C1149 | forms | error message (email) | Please use an email address you check regularly. | keep |  |  |
| C1150 | forms | error box | Please check the email address. Nothing has been sent yet. | keep |  |  |
| C1151 | forms | error box | We could not send this just now. Forms only send from the live website, not from a file opened on this computer. | keep |  |  |
| C1152 | forms | error box (fallback) | We could not send this just now. Please call or email us and we will take it from there. What you typed is kept on this device, so you can also try again later. | keep |  |  |
| C1153 | forms | screen reader announcement | {n} fields need attention. {Field label}: {error message} | keep |  |  |
| C1154 | forms | field name fallback | Consent | keep |  |  |
| C1155 | forms | field name fallback | This field | keep |  |  |
| C1156 | forms | error message fallback | Please check this field. | keep |  |  |
| C1157 | forms | success heading (h3) | Thank you, {first name}. | keep |  |  |
| C1159 | forms | button link (success) | Read while you wait | keep |  |  |
| C1160 | forms | button (success) | Send another | keep |  |  |
| C1161 | forms | screen reader announcement | Sent. Thank you, {first name}. | edit | Received. Thank you, {first name}. | the journey's announcement is Received; "Sent" claimed less than the heading beside it |
| C1162 | forms (verify) | eyebrow | Verify your phone | keep |  |  |
| C1163 | forms (verify) | paragraph | We have sent a code by {WhatsApp or SMS} to {phone}. Enter it to confirm the number is yours. It takes a moment and helps us reply faster. | edit | We have sent a code by {WhatsApp or SMS} to {phone}. Please enter it to confirm the number is yours. It takes a moment, and it means we can reach you on that number. | "helps us reply faster" was a speed claim; the new line says what the code is for |
| C1164 | forms (verify) | form label (span.vh) | Verification code | keep |  |  |
| C1165 | forms (verify) | placeholder (input code) | Code | keep |  |  |
| C1166 | forms (verify) | button (gold) | Verify | keep |  |  |
| C1167 | forms (verify) | text button | Send it again | keep |  |  |
| C1168 | forms (verify) | text button | Send it by {SMS or WhatsApp} instead | keep |  |  |
| C1169 | forms (verify) | text button | Skip for now | keep |  |  |
| C1170 | forms (verify) | screen reader announcement | Verify your phone: a code has been sent by {channel}. | keep |  |  |
| C1171 | forms (verify) | screen reader announcement | A new code has been sent by {channel}. | keep |  |  |
| C1172 | forms (verify) | error box | We could not send the code by {channel} just now. Please try the other way, or skip for now. | keep |  |  |
| C1173 | forms (verify) | error box | Please enter the code we sent. | keep |  |  |
| C1174 | forms (verify) | confirmation (p.verified) | Phone verified. Thank you. | keep |  |  |
| C1175 | forms (verify) | confirmation (p.verified) | Code accepted. Thank you. We will note it on your enquiry shortly. | keep |  |  |
| C1176 | forms (verify) | screen reader announcement | Phone verified. | keep |  |  |
| C1177 | forms (verify) | screen reader announcement | Code accepted. | keep |  |  |
| C1178 | forms (verify) | error box | That code has expired. Send it again by WhatsApp or SMS below. | edit | That code has expired. Please send it again by WhatsApp or SMS below. | an error says what to do, beginning with Please |
| C1179 | forms (verify) | error box | That code did not match. Please check it and try again, or send it again below. | keep |  |  |
| C1180 | forms (verify) | error box | We could not check the code just now. Please try again, or skip for now. | keep |  |  |
| C1181 | forms (verify) | screen reader announcement | Verification skipped. | keep |  |  |
| C1182 | forms (verify) | note (p.verify-note) | We could not send a verification code to this number, so we will continue without it. | keep |  |  |
| C1183 | forms (verify) | note (p.verify-note) | We could not send a verification code: the number needs its country code (for example +971 or +234). We will continue without it. | keep |  |  |
| C1184 | forms (verify) | note (p.verify-note) | We could not send a verification code just now, so we will continue without it. | keep |  |  |
| C1185 | forms (booking) | eyebrow | Book a first conversation | keep |  |  |
| C1186 | forms (booking) | paragraph | Choose the office closest to you. Where the booking page allows it, your name and email are filled in for you. | keep |  |  |
| C1187 | forms (booking) | button link | Dubai | keep |  |  |
| C1188 | forms (booking) | button link | Lagos | keep |  |  |
| C1189 | forms (booking) | placeholder chip | Dubai booking page (Microsoft Bookings or Calendly) | keep |  |  |
| C1190 | forms (booking) | placeholder chip | Lagos booking page (Microsoft Bookings or Calendly) | keep |  |  |
| C1191 | forms | consent text (appended) | See our privacy notice. | keep |  |  |
| C1379 | email | subject | Your enquiry with Imperial Holdings Group | keep |  |  |
| C1380 | email | greeting | Dear {first name}, | keep |  |  |
| C1381 | email | opening | Thank you for your enquiry. It has reached {Division name}, and one person will be your point of contact. | keep |  |  |
| C1382 | email | next step | One next step: reply to this email with a good time for a first conversation, or call the office. | keep |  |  |
| C1383 | email | sign-off | Kind regards, / Imperial Holdings Group / {sender address} | keep |  |  |

## /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact (31 strings, 9 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1112 | forms (enquiry) / forms (contact) | form label | Phone, with country code (optional) | keep |  |  |
| C1115 | forms (enquiry) / forms (contact) | form label | Nationality, or nationalities | edit | Nationality, or nationalities (optional) | the journey asks it only on two routes and never requires it |
| C1116 | forms (enquiry) / forms (contact) | error message | Please tell us your nationality. | keep |  |  |
| C1117 | forms (enquiry) / forms (contact) | form label | This enquiry is for | edit | This is for | the journey's label; shorter, same meaning |
| C1118 | forms (enquiry) / forms (contact) | option (select for_whom) | Myself | keep |  |  |
| C1119 | forms (enquiry) / forms (contact) | option (select for_whom) | My family | keep |  |  |
| C1120 | forms (enquiry) / forms (contact) | option (select for_whom) | A client I am introducing | keep |  |  |
| C1121 | forms (enquiry) / forms (contact) | error message | Please choose one. | keep |  |  |
| C1122 | forms (enquiry) / forms (contact) | form label | When would you like to begin? | keep |  |  |
| C1123 | forms (enquiry) / forms (contact) | option (select timeline) | Within 3 months | keep |  |  |
| C1124 | forms (enquiry) / forms (contact) | option (select timeline) | 3 to 12 months | keep |  |  |
| C1125 | forms (enquiry) / forms (contact) | option (select timeline) | Just exploring for now | keep |  |  |
| C1126 | forms (enquiry) / forms (contact) | form label | A budget in mind (optional) | edit | Is there a budget in mind? (optional) | the journey's label; bands unchanged |
| C1127 | forms (enquiry) / forms (contact) | option (select budget) | If you wish to say | keep |  |  |
| C1128 | forms (enquiry) / forms (contact) | option (select budget) | Under US$250,000 | keep |  |  |
| C1129 | forms (enquiry) / forms (contact) | option (select budget) | US$250,000 to 500,000 | keep |  |  |
| C1130 | forms (enquiry) / forms (contact) | option (select budget) | US$500,000 to 1 million | keep |  |  |
| C1131 | forms (enquiry) / forms (contact) | option (select budget) | Over US$1 million | keep |  |  |
| C1132 | forms (enquiry) / forms (contact) | option (select budget) | I would rather not say yet | keep |  |  |
| C1133 | forms (enquiry) / forms (contact) | form label | Firm | edit | Firm or organisation | the journey's label; a family office is not always a firm |
| C1134 | forms (enquiry) / forms (contact) | error message | Please tell us your firm. | edit | Please tell us your firm or organisation. | follows the new label |
| C1135 | forms (enquiry) / forms (contact) | form label | Profession | edit | Your profession | the journey's label |
| C1136 | forms (enquiry) / forms (contact) | error message | Please tell us your profession. | keep |  |  |
| C1137 | forms (enquiry) / forms (contact) | form label | I am looking to | keep |  |  |
| C1138 | forms (enquiry) / forms (contact) | option (select re_intent) | Buy | keep |  |  |
| C1139 | forms (enquiry) / forms (contact) | option (select re_intent) | Rent | keep |  |  |
| C1140 | forms (enquiry) / forms (contact) | form label | Area of interest (optional) | edit | Area, if you have one in mind (optional) | the journey's label; "area of interest" was jargon |
| C1141 | forms (enquiry) / forms (contact) | form label | How can we help? | edit | Anything you would like us to know (optional) | the journey makes the message optional; the structured answers already say what is needed |
| C1143 | forms (enquiry) / forms (contact) | consent text > span | I agree to Imperial Holdings Group using these details to respond to my enquiry, as described in the privacy notice. | keep |  |  |
| C1145 | forms (enquiry) / forms (contact) | button (gold) > span | Send enquiry | edit | Send to Imperial | the journey's closing call to action |
| C1158 | forms | success message (p) | Your enquiry is with {Division name or the Group team}. One person will be your point of contact, and will reply to arrange a first conversation. | keep |  |  |

## /, /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /contact (1 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1148 | forms (contact) | destination name | the Group team | edit | the Group | the journey's routing name for the Group |

## /, /journal/events/gala-dinner-lagos (1 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1192 | hero | img alt text | Stage lights at the Imperial Citizenship gala dinner, Lagos | hold | The Dubai skyline at dusk, seen across the water | the hero photograph awaits the Founder (the plan's Dubai at dusk, or the ink map); this describes the interim frame, with nobody in it |

## /about, /journal/events/lagos-office-event, /contact (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1193 | hero | img alt text | Colonnade in evening light | keep |  |  |

## /about, /divisions, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing, /contact, /privacy, /terms (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1194 | hero | nav aria-label | Breadcrumb | keep |  |  |

## /divisions, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /insights, /insights/your-client-stays-your-client (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1195 | hero / other houses / insights list | img alt text | Glass towers seen from below | keep |  |  |

## /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /insights, /insights/before-a-first-conversation (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1196 | hero / other houses / insights list | img alt text | Private jet on the apron at sunset | keep |  | accurate to the interim photograph; the shot list replaces the picture, and the alt text goes with it |

## /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy (6 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1197 | hero | a | Divisions | keep |  |  |
| C1208 | overview | eyebrow | Overview | keep |  |  |
| C1223 | other houses | eyebrow | Explore the other houses | edit | Other divisions | editor: matches the section's aria-label 'Other divisions' (C1225), the same name for the same thing; a two-word eyebrow. Writer: an eyebrow is a label, not an instruction, and 'house' is for body copy only |
| C1224 | other houses | h2.d2 | One table. | keep |  |  |
| C1225 | other houses | div aria-label | Other divisions | keep |  |  |
| C1231 | other houses / hero | img alt text | Palm Jumeirah and the Dubai coast from above | keep |  |  |

## /divisions/private-office, /insights/explain-your-family-once (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1198 | hero | span | Private Office | keep |  |  |

## /journal, /journal/events/easter-polo-cup-2026 (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1199 | hero | img alt text | Polo at Lagos Polo Club, Ikoyi | keep |  |  |

## /journal/events/gala-dinner-lagos, /journal/events/lagos-office-event, /journal/events/delborough-dinner (3 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1200 | hero | eyebrow | Private gathering · Lagos | keep |  |  |
| C1333 | event | dd | Private gathering | keep |  |  |
| C1340 | gallery | h2.d2 | Photographs to follow. | keep |  | already honest about what is to follow |

## /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing (7 strings, 2 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1201 | hero | a | Insights | keep |  |  |
| C1202 | hero | lead paragraph | About 1 minute read | keep |  |  |
| C1349 | related | h2 | More from the house. | edit | More from the Group. | 'house' is for body copy only; the Group, in a heading |
| C1350 | article | div | Draft, awaiting approval. Final copy to be approved before publication. Author and publication date: To confirm: to confirm | edit | Draft, awaiting approval. Final copy to be approved before publication. Author and publication date: To confirm: Author and date | the marker stays; the chip said to confirm twice and now names what is missing |
| C1351 | article | button aria-label | Copy link to this article | keep |  |  |
| C1352 | article | button aria-label | Share this article | keep |  |  |
| C1353 | article | nav aria-label | More articles | keep |  |  |

## /privacy, /terms (3 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1203 | hero | eyebrow | Legal | keep |  |  |
| C1371 | legal | placeholder chip | Placeholder | keep |  |  |
| C1372 | legal | note (p.small) | Last updated: To confirm: Date of the version approved by counsel | keep |  |  |

## /about, /divisions, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights (4 strings, 2 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1204 | closing / hero | img alt text | Dubai rising above the clouds | keep |  |  |
| C1205 | closing | h2.d2 | With you, from the first question. | edit | The first conversation is for listening. | the decided closing headline, used on every closing band |
| C1206 | closing | lead paragraph | Tell us where you are, and where you would like to be. The first conversation is for listening. Decisions come when you are ready. | edit | Tell us where you are, and where you would like to be. A senior adviser will read what you write, set out what is possible in writing, and reply personally. Nothing is decided until you are ready. | the decided closing copy, used on every closing band |
| C1207 | closing | button link (outline) > span | About the Group | keep |  |  |

## /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy (13 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1209 | overview | div aria-label | At a glance | keep |  |  |
| C1210 | overview | dt | Division | keep |  |  |
| C1211 | overview | dt | Status | keep |  |  |
| C1212 | overview | dt | For | keep |  |  |
| C1213 | overview | dt | Website | keep |  |  |
| C1214 | what we do | eyebrow | What we do | keep |  |  |
| C1218 | who it is for | eyebrow | Who it is for | keep |  |  |
| C1219 | who it is for | h2.d2 | Who we work with. | keep |  |  |
| C1220 | how it works | eyebrow | How it works | keep |  |  |
| C1221 | how it works | span.ix | STEP 04 | keep |  |  |
| C1222 | cta band | lead paragraph (variant) | Services, the team and how to begin, on the {Site name} website. | keep |  |  |
| C1232 | other houses | b | Real Estate | keep |  |  |
| C1233 | other houses | span | Licensed property advisory, starting with Dubai. | edit | Property advisory, not yet launched: search, selection and purchase support, coordinated with Imperial Citizenship where a home and residency meet. Interest can be registered now. | the division line decided in hero-final.json, used verbatim |

## /divisions/citizenship, /divisions/academy (2 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1215 | what we do | h3.h3 | Not sure which applies? | keep |  |  |
| C1216 | what we do | p | That is what the first conversation is for. | keep |  |  |

## /divisions/citizenship, /divisions/academy, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing, /404, /error (1 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1217 | what we do / article / 404 / error | text link | Speak to us | edit | Start a relationship | The journey entries replace Speak to us on article ends and on the 404 and error pages; the division what-we-do link takes the same door |

## /divisions/citizenship, /divisions/private-office, /divisions/real-estate, /divisions/academy (2 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1226 | other houses | b | Partners Club | keep |  |  |
| C1227 | other houses | span | The network of lawyers, bankers, wealth advisers and family offices who introduce families to us. | edit | Lawyers, bankers, advisers and family offices who introduce Clients to the Group, on written terms, with clear updates. Your Client stays yours. | the division line decided in hero-final.json, used verbatim; drops 'wealth' |

## /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /insights, /insights/explain-your-family-once (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1228 | other houses / hero / insights list | img alt text | Penthouse lounge overlooking the Dubai coast | keep |  | accurate to the interim photograph; the shot list replaces the picture, and the alt text goes with it |

## /divisions/citizenship, /divisions/partners-club, /divisions/real-estate, /divisions/academy (2 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1229 | other houses | b | Private Office | keep |  |  |
| C1230 | other houses | span | One lasting relationship for families with multi-country lives. | edit | Ongoing support for existing Imperial Clients after the first service is complete: relocation, schools, structuring and introductions, through one point of contact. | the division line decided in hero-final.json, used verbatim |

## /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy, /journal/events/delborough-dinner, /insights, /insights/everything-in-writing (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1234 | other houses / hero / insights list | img alt text | Private library at sunset | keep |  |  |

## /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate (2 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1235 | other houses | b | Academy | keep |  |  |
| C1236 | other houses | span | Learning, training and certification for the people who do this work. | edit | The Group’s learning arm, in preparation: training and certification to one shared standard, for our own people and for Partner teams. | the division line decided in hero-final.json, used verbatim |

## /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy (2 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1237 | other houses | b | Citizenship | keep |  |  |
| C1238 | other houses | span | Second residency and citizenship by investment, from first conversation to completed application. | edit | The flagship, and often the first step: second residency and citizenship by investment, carried from first conversation to completed application. | the division line decided in hero-final.json, used verbatim |

## /, /divisions/citizenship (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1239 | ecosystem / hero | chip (badge) | The flagship | keep |  |  |

## /, /divisions/partners-club (1 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1240 | ecosystem / hero | chip (badge) | For professionals | edit | Opening in stages | claims C49: the Partners Club status says it is opening in stages |

## /, /divisions/private-office (1 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1241 | ecosystem / hero | chip (badge) | For existing Clients | edit | By invitation, being established | claims C59: the Private Office status says it is being established |

## /, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/real-estate, /divisions/academy (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1242 | ecosystem / other houses / hero | chip (badge) | Coming soon | keep |  |  |

## /, /divisions/academy (1 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1243 | ecosystem / hero | chip (badge) | Learning and standards | edit | Learning and standards, in development | claims C68: the Academy status carries 'in development' |

## /, /contact (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1244 | network / questions | text link | Imperial Partners Club | keep |  |  |

## /, /about (35 strings, 12 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1245 | leadership | eyebrow | Leadership | keep |  |  |
| C1246 | leadership | h2.d2 | The people accountable. | keep |  |  |
| C1247 | leadership | img alt text | Zaid Al Hindi | keep |  |  |
| C1248 | leadership | div.role | Founder and Group Chief Executive Officer | keep |  |  |
| C1249 | leadership | h3 | Zaid Al Hindi | keep |  |  |
| C1250 | leadership | img alt text | Hekma Iskandarani | keep |  |  |
| C1251 | leadership | div.role | Group Chief Operating Officer | hold | To confirm: Title | editor: claims C28 holds the title; the chip names what is missing and leaves the mandate wording (Board Member, Strategic Relationships) for the Founder to confirm rather than printing an internal record on the page; writer: claims C28: no record names a Group Chief Operating Officer |
| C1252 | leadership | h3 | Hekma Iskandarani | keep |  |  |
| C1284 | presence | svg aria-label | Map: headquarters in Dubai, a regional hub in Lagos, and relationships across Europe, the United States, Asia and the Caribbean | edit | Map: headquarters in Dubai, an office in Lagos, and relationships across the Caribbean, Europe and the Gulf | claims C13, C14 and C22: describes what the map shows while the United States and Asia are held |
| C1285 | presence | span.wmap-lbl | Dubai | keep |  |  |
| C1286 | presence | span.wmap-lbl | Lagos | keep |  |  |
| C1287 | presence | div aria-label | Where we work | keep |  |  |
| C1288 | presence | button > span | Dubai | keep |  |  |
| C1289 | presence | button > small | Headquarters | keep |  |  |
| C1290 | presence | button > span | Lagos | keep |  |  |
| C1291 | presence | button > small | Regional hub | edit | Office | claims C22: records say Lagos office, not regional hub; the tab above says Lagos |
| C1292 | presence | button > span | 20+ countries | edit | Beyond the two cities | claims C13 tab label: no record for the count |
| C1293 | presence | button > small | Worldwide | edit | Relationships | worldwide has no record; the tab names what the panel lists |
| C1294 | presence | span.role | Headquarters | keep |  |  |
| C1295 | presence | h3 | Dubai | keep |  |  |
| C1296 | presence | p | Where the Group is led. | keep |  |  |
| C1297 | presence | p.wm-addr | 804 Single Business Tower, Business Bay, Dubai, United Arab Emirates | keep |  |  |
| C1298 | presence | span.role | Regional hub | edit | Office | claims C22: records say Lagos office, not regional hub; the heading beneath says Lagos |
| C1299 | presence | h3 | Lagos | keep |  |  |
| C1300 | presence | p | Close to our Clients and Partners across Nigeria and West Africa. | edit | Close to our Clients and Partners in Nigeria. | claims C22 wording: nothing supports West Africa beyond Nigeria |
| C1301 | presence | p.wm-addr | 8 Aromire Road, Ikoyi, Lagos 106104, Nigeria | keep |  |  |
| C1302 | presence | span.role | Worldwide | edit | Relationships | worldwide has no record; the role label names what the panel lists |
| C1303 | presence | h3 | 20+ countries | edit | Beyond the two cities | claims C13: no record for the count; mirrors the tab |
| C1304 | presence | p | Partners, advisers and specialists, in relationships across: | keep |  |  |
| C1305 | presence | text button | Europe | keep |  |  |
| C1306 | presence | text button | The United States | hold |  | claims C14: no record supports the United States; the region does not render until the Founder lists the countries |
| C1307 | presence | text button | Asia | hold |  | claims C14: no record supports Asia; the region does not render until the Founder lists the countries |
| C1308 | presence | text button | The Caribbean and beyond | edit | The Caribbean | claims C14 keeps the Caribbean; and beyond is a reach claim with no record |
| C1309 | presence | p.wmap-note | Regions are shown broadly to indicate relationships, not office locations. | keep |  |  |
| C1310 | presence | clock (span.clock) | Local time {hh:mm} | keep |  |  |

## /, /journal (12 strings, 6 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1253 | events | eyebrow | Selected events | keep |  |  |
| C1273 | journal | eyebrow | Journal | keep |  |  |
| C1274 | journal | h2.d2 | Developments, insights and partnerships. | edit | Developments, insights and selected events. | claims C83: partnerships has no record; names the kinds the Journal carries |
| C1275 | journal | div.meta | Partnerships · Easter 2026 | edit | Events · Easter 2026 | claims C79: the kind is Events, not Partnership |
| C1276 | journal | h3 | Imperial Citizenship and Lagos Polo Club host the Easter Polo Cup after party | edit | Imperial Citizenship hosts the Easter Polo Cup after party at Lagos Polo Club | claims C79: no partnership record with the club; Imperial hosted, at the venue |
| C1277 | journal | p | An exclusive after party at Lagos Polo Club, Ikoyi, following the Easter Polo Cup. | edit | An after party at Lagos Polo Club, Ikoyi, following the Easter Polo Cup. | drops exclusive; what and where |
| C1278 | journal | span.tlink | Read on | keep |  |  |
| C1279 | journal | div.meta | Partnerships · 19 February 2025 | edit | Events · 19 February 2025 | the sponsorship is verified (C75) but Partnerships as a kind claims more; the Journal drops the kind (C83) |
| C1280 | journal | h3 | Imperial Citizenship sponsors Grenada’s 51st Independence Day after party in Dubai | keep |  |  |
| C1281 | journal | p | Following the official celebrations hosted by IMA Grenada and the Consulate General of Grenada in Dubai, Imperial Citizenship sponsored the evening at The Dubai EDITION. | keep |  |  |
| C1282 | journal | div.meta | Events · 2025 | keep |  |  |
| C1283 | journal | p | Members of the diplomatic community, clients and friends of Imperial, together for an evening in Lagos. | hold | To confirm: An evening in Lagos for Clients, partners and friends of Imperial. | editor: the claims C77 stand-in line, as on the journal group; Client takes a capital when it means a person Imperial serves; writer: claims C77: no record for the Soirée; this description stands until a guest list reinstates the diplomatic community wording |

## /, /journal, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026 (3 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1254 | events / related | div.meta | Diplomatic · Dubai · 19 February 2025 | keep |  |  |
| C1255 | events / related | h3 | Grenada’s 51st Independence Day After Party | keep |  |  |
| C1256 | events / related | p | Imperial Citizenship sponsored the after party for Grenada’s 51st Independence Day, following the official celebrations hosted by IMA Grenada and the Consulate General of Grenada in Dubai. | keep |  |  |

## /, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner (3 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1257 | events / related | span.tlink | Read the story | keep |  |  |
| C1271 | events | card link | {n} photographs | keep |  |  |
| C1272 | events | card chip (span.vmark) | Video | keep |  |  |

## /, /journal, /journal/events/grenada-51-dubai, /journal/events/easter-polo-cup-2026 (3 strings, 2 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1258 | events / related | div.meta | Diplomatic · Lagos · 2025 | hold | Events · Lagos · 2025 | claims C77: the Diplomatic category waits for a guest list; the generic kind stands meanwhile, the year as in the event's own name |
| C1259 | events / journal / related | h3 | The Lagos Diplomatic Soirée 2025 | keep |  |  |
| C1260 | events / related | p | An evening in Lagos bringing together members of the diplomatic community, clients and friends of Imperial. | hold | To confirm: An evening in Lagos for Clients, partners and friends of Imperial. | editor: the claims C77 stand-in line, as on the journal group; Client takes a capital when it means a person Imperial serves; writer: claims C77: no record for the Soirée; this description stands until a guest list reinstates the diplomatic community wording |

## /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/lagos-office-event, /journal/events/delborough-dinner (3 strings, 2 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1261 | events / related | div.meta | Partnership · Lagos · Easter 2026 | edit | Events · Lagos · Easter 2026 | claims C79: no partnership record, so the kind is Events |
| C1262 | events / related | h3 | Easter Polo Cup After Party | keep |  |  |
| C1263 | events / related | p | Imperial Citizenship and Lagos Polo Club: an exclusive Easter Polo Cup after party at Lagos Polo Club, Ikoyi. | edit | An after party hosted by Imperial Citizenship at Lagos Polo Club, Ikoyi, following the Easter Polo Cup. | claims C79 and the audit: no partnership record and exclusive is an avoided word; hosted an after party, what and where |

## /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner (2 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1264 | events / related | div.meta | Private gathering · Lagos | keep |  |  |
| C1344 | gallery | note (p.xs) | Photographs of guests are published with their permission. | keep |  |  |

## /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner (2 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1265 | events / related | h3 | Gala Dinner, Lagos | keep |  |  |
| C1266 | events / related | p | A gala dinner hosted by Imperial Citizenship in Lagos, with guests from across the Caribbean citizenship community. | hold | To confirm: A gala dinner in Lagos for Clients, partners and guests of Imperial Citizenship. | editor: Client takes a capital when it means a person Imperial serves; otherwise the claims C78 stand-in line; writer: claims C78: no record of the occasion; the plain line stands until date, venue and guests are confirmed |

## /journal, /journal/events/gala-dinner-lagos, /journal/events/delborough-dinner (2 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1267 | events / related | h3 | An Evening at the Lagos Office | keep |  |  |
| C1268 | events / related | p | Clients, partners and friends of Imperial at the Lagos office on Aromire Road, Ikoyi. | keep |  |  |

## /journal, /journal/events/gala-dinner-lagos, /journal/events/lagos-office-event (2 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1269 | events / related | h3 | A Private Dinner at DANI, The Delborough | keep |  |  |
| C1270 | events / related | p | A private dinner for clients and friends of Imperial at DANI, The Delborough Hotel, Lagos. | hold | To confirm: A private dinner at DANI, The Delborough Hotel, Lagos. | claims C81: no record of who hosted it or when; the venue is what the photographs support |

## /about, /divisions (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1311 | how we work | eyebrow | How we work | keep |  |  |

## /about, /divisions, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy, /journal, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights (1 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1312 | how we work / closing / overview / cta band | button link > span | Speak to us | edit | Start a relationship | the journey replaces Speak to us on the closing band, division bands and article ends |

## /divisions, /divisions/citizenship, /divisions/partners-club, /divisions/private-office, /divisions/academy (3 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1313 | how we work / how it works | span.ix | STEP 01 | keep |  |  |
| C1314 | how we work / how it works | span.ix | STEP 02 | keep |  |  |
| C1315 | how we work / how it works | span.ix | STEP 03 | keep |  |  |

## /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing (12 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1316 | event / article | span.share-l | Share | keep |  |  |
| C1318 | event / article | button > span | Copy link | keep |  |  |
| C1320 | event / article | button > span | Share | keep |  |  |
| C1321 | event / article | a aria-label | in, share on LinkedIn | keep |  |  |
| C1322 | event / article | a | in | keep |  |  |
| C1323 | event / article | a aria-label | WA, share on WhatsApp | keep |  |  |
| C1324 | event / article | a | WA | keep |  |  |
| C1325 | event / article | a aria-label | @, share by email | keep |  |  |
| C1358 | article | toast | Link copied. Ready to paste. | keep |  |  |
| C1359 | article | browser prompt | Copy this link | keep |  |  |
| C1363 | pagination / article | a > small | Previous | keep |  |  |
| C1365 | pagination / article | a > small | Next | keep |  |  |

## /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner (16 strings, 3 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1317 | event | button aria-label | Copy link to this event | keep |  |  |
| C1319 | event | button aria-label | Share this event | keep |  |  |
| C1327 | event | dt | Where | keep |  |  |
| C1328 | event | dt | Kind | keep |  |  |
| C1330 | event | button link > span | Start a strategic conversation | edit | Open a strategic conversation | editor: the button opens the Institutions path; it takes the hero-final label used on the home path card, not a six-word variant; writer: the journey entry list: the event glance panel opens the Institutions path under the journey name |
| C1331 | event | button link (outline) > span | All events | keep |  |  |
| C1335 | event | glance row | Photographs / {n}, Imperial | keep |  |  |
| C1336 | gallery | eyebrow | Gallery | keep |  |  |
| C1338 | gallery | note (p.xs) | Photographs will appear once guests have confirmed they are happy to be featured. | keep |  |  |
| C1342 | gallery | h2 | The evening, in pictures. | keep |  |  |
| C1343 | gallery | h2 | The evening, on film. | keep |  |  |
| C1345 | gallery | note (p.xs) | Preview build: photographs of guests are shown before their consent is recorded. | keep |  |  |
| C1346 | gallery | img alt text (fallback) | {event title}, photograph {i} of {n} | edit | A photograph from {event title} | the guide describes gallery photographs one by one, never numbered; the fallback names the event only, until the registry carries a description |
| C1347 | related | eyebrow | Related | keep |  |  |
| C1348 | related | h2.d2 | More evenings from the house. | edit | More evenings with the Group. | 'house' is for body copy only; the Group, in a heading |
| C1362 | pagination | nav aria-label | More events | keep |  |  |

## /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026 (3 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1326 | event | dt | When | keep |  |  |
| C1337 | gallery | h2.d2 | Film and photographs to follow. | keep |  | already honest about what is to follow |
| C1339 | gallery | span.vid-tbc | To confirm: Highlights clip to be supplied | keep |  |  |

## /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025 (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1329 | event | dd | Diplomatic | keep |  | Diplomatic is verified for the Grenada evening (claims C75); the Soirée row changes its category under C0604 |

## /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos (1 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1332 | event | dd | To confirm: Venue to confirm Lagos | edit | To confirm: Venue, Lagos | the chip said to confirm twice; the placeholder stays and names what is missing, then the city |

## /journal/events/lagos-office-event, /journal/events/delborough-dinner (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1334 | event | note (p.xs) | To confirm: Date To confirm: Occasion | keep |  |  |

## /, /about, /journal/events/grenada-51-dubai, /journal/events/lagos-diplomatic-soiree-2025, /journal/events/gala-dinner-lagos, /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event, /journal/events/delborough-dinner (2 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1341 | gallery | button (vid-play) | Play | keep |  |  |
| C1378 | media | captions cue | TO CONFIRM: captions for this clip | edit | To confirm: captions for this clip | The placeholder prefix in its house form; the cue stays a placeholder |

## /insights/before-a-first-conversation, /insights/your-client-stays-your-client (2 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1354 | article | a > b | What “everything in writing” means in practice | keep |  |  |
| C1355 | article | a > b | Why a multi-country family needs one point of contact | keep |  |  |

## /insights/explain-your-family-once, /insights/everything-in-writing (2 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1356 | article | a > b | Six things worth thinking about before a first conversation | keep |  |  |
| C1357 | article | a > b | Your Client stays your Client: how introductions work | keep |  |  |

## /insights, /insights/before-a-first-conversation, /insights/explain-your-family-once, /insights/your-client-stays-your-client, /insights/everything-in-writing (2 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1360 | insights list / article | chip (draft) | Draft | keep |  | the draft marker stays until the Founder approves the articles |
| C1361 | insights list / hero | chip (draft) | Draft, awaiting approval | keep |  | the draft marker stays until the Founder approves the articles |

## /journal/events/grenada-51-dubai, /journal/events/delborough-dinner (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1364 | pagination | a > b | Easter Polo Cup After Party | keep |  |  |

## /journal/events/grenada-51-dubai, /journal/events/gala-dinner-lagos (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1366 | pagination | a > b | The Lagos Diplomatic Soirée 2025 | keep |  |  |

## /journal/events/lagos-diplomatic-soiree-2025, /journal/events/easter-polo-cup-2026 (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1367 | pagination | a > b | Grenada’s 51st Independence Day After Party | keep |  |  |

## /journal/events/lagos-diplomatic-soiree-2025, /journal/events/lagos-office-event (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1368 | pagination | a > b | Gala Dinner, Lagos | keep |  |  |

## /journal/events/gala-dinner-lagos, /journal/events/delborough-dinner (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1369 | pagination | a > b | An Evening at the Lagos Office | keep |  |  |

## /journal/events/easter-polo-cup-2026, /journal/events/lagos-office-event (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1370 | pagination | a > b | A Private Dinner at DANI, The Delborough | keep |  |  |

## /journal/events (1 strings, 0 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1373 | meta | meta description | Selected Imperial events in Dubai and Lagos. | keep |  |  |

## /journal/feed.xml (2 strings, 1 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1376 | feed | RSS feed title | Imperial Holdings Group Journal | keep |  |  |
| C1377 | feed | RSS feed description | Company developments, insights, partnerships and selected Imperial events in Dubai and Lagos. | edit | Company developments, insights and selected Imperial events in Dubai and Lagos. | claims C83: partnerships has no record; the feed description matches the Journal meta description |

## none (23 strings, 8 changed)

| ID | Section | Element | Current | Action | Proposed | Why |
|---|---|---|---|---|---|---|
| C1384 | divisions | division tagline (tag) | Global mobility. Greater possibilities. | keep |  |  |
| C1385 | divisions | division tagline (tag) | A global network for growth. Together further. | keep |  |  |
| C1386 | divisions | division tagline (tag) | Personalised solutions for exceptional clients. | hold | To confirm: Imperial Private Office tagline, retained as registered or revised by the Founder | The guide's open decision: the registered line uses solutions, an avoided word; not rendered on this site |
| C1387 | divisions | division tagline (tag) | Curated properties. Enduring value. | hold | To confirm: Imperial Real Estate tagline, retained as registered or revised by the Founder | The same open decision in the guide; curated is allowed in a tagline, so the Founder may well retain it; not rendered on this site |
| C1388 | divisions | division tagline (tag) | Education. Talent. Leadership. A stronger tomorrow. | keep |  |  |
| C1389 | divisions | division card copy (card) | Our flagship house. Residency and citizenship by investment, compared side by side and carried from first conversation to completed application. | keep |  |  |
| C1390 | divisions | division card copy (card) | Our Partner network across industries: introducers, advisers and service-line Partners. Your Client stays your Client. | edit | Our Partner network, opening in stages: introducers, advisers and service-line Partners. Your Client stays your Client. | Claims C49: the network is at pilot stage; the card says so in three words and keeps the promise that matters |
| C1391 | divisions | division card copy (card) | A concierge for our existing Clients: relocation, schools, structuring, banking and introductions, through one point of contact. | edit | One point of contact for our existing Clients: relocation, schools, introductions, and the coordination of qualified specialists. | Claims C60 wording: concierge is an avoided word, and structuring and banking read as services of its own |
| C1392 | divisions | division card copy (card) | Licensed property advisory, starting with Dubai: search, selection and purchase support. Not yet launched. | keep |  |  |
| C1393 | divisions | division card copy (card) | Our learning arm. Training and certification for our people and our Partners, so every conversation meets one standard. | edit | Our learning arm, in development. It is building one shared standard of training and certification for our own people, which will extend to Partner teams. | Claims C68: present tense overstated; the intro wording, shortened for a card |
| C1394 | divisions | who it is for (who[1]) | Families whose residency plans include property. | keep |  |  |
| C1395 | divisions | who it is for (who[2]) | Selected direct buyers. | keep |  |  |
| C1396 | ecosystem | site role | The parent of five specialist divisions, led from Dubai and Lagos | keep |  |  |
| C1397 | ecosystem | site role | The flagship: second residency and citizenship by investment, from first conversation to completed application | keep |  |  |
| C1398 | ecosystem | site role | For professionals: the network of lawyers, bankers, wealth advisers and family offices who introduce families to us | edit | Opening in stages: for the lawyers, bankers, advisers and family offices who introduce families to us | Claims C49 status and line for the sister-site role; wealth dropped as an avoided word |
| C1399 | ecosystem | site role | For existing Clients: one lasting relationship for families with multi-country lives | edit | By invitation, being established: one lasting relationship for families with multi-country lives | Claims C59 status for the sister-site role |
| C1400 | ecosystem | site role | Coming soon: licensed property advisory, starting with Dubai | keep |  | editor: kept: Coming soon is the Real Estate status word on the division pages (C1242), and licensed property advisory is a kept claim (C64, C65); writer proposed: The status label matches the menu; licence details are published at launch (claims C64), so the role does not lead with the licence |
| C1401 | ecosystem | site role | Learning and standards: training and certification for the people who do this work | edit | Learning and standards, in development: training and certification for the people who do this work | Claims C68 status for the sister-site role |
| C1402 | media | video title (hero loop) | Hero loop | keep |  |  |
| C1403 | media | img alt text (hero, consent pending) | Guests at the Lagos office on Aromire Road, Ikoyi | keep |  |  |
| C1404 | media | img alt text (hero night, consent pending) | A speaker at the Imperial Citizenship gala dinner, Lagos | keep |  |  |
| C1405 | how we work | unused view (story()) | Chapter {n} of {total} | keep |  |  |
| C1406 | what we do | h2 fallback | What we do. | keep |  |  |

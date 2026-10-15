/* Imperial Holdings Group: site content (v4).
   Facts come from the Imperial Holdings brochure, the Imperial Partners Club introducer guide, the Group brand
   documents, the IHG contact sheet (addresses, telephones, leadership) and, for events, the Marketing Team
   SharePoint (Events folder and the Grenada 51st press release). Event photographs are Imperial's own.
   Anything not sourced is wrapped in a TBC placeholder: tbc('...').
   v5 (media): photo registry with consent flags, the home hero selection, and the video slots. */
(function(){
/* The six Imperial sites (brief section 7). shared/ecosystem.json is the source; these values are copied from it by
   hand, because data.js is a plain script and cannot fetch. key is the site key in shared/lead-schema.json. real:true
   only where the URL is live. home:true is this site: it links to its own home page, since the production domain is
   TO CONFIRM. soon:true is a division that has not launched. Division pages reuse these entries for their website
   call to action (siteCta). The ecosystem menu and the footer list all six. */
var SITES = [
  {key:'ihg', name:'Imperial Holdings Group', short:'Holdings Group', home:true, href:'#/', url:'https://www.imperialholdingsgroup.com', real:false, tbc:'Final production domain (imperialholdingsgroup.com) to confirm', label:'imperialholdingsgroup.com', role:'The parent of five specialist divisions, led from Dubai and Lagos', tagline:'Two cities. One horizon.', journalFeed:'/journal/feed.xml'},
  {key:'citizenship', name:'Imperial Citizenship', short:'Citizenship', href:'https://imperialcitizenship.com', url:'https://imperialcitizenship.com', real:true, label:'imperialcitizenship.com', role:'The flagship: second residency and citizenship by investment, from first conversation to completed application', tagline:'Global mobility. Greater possibilities.'},
  {key:'partners-club', name:'Imperial Partners Club', short:'Partners Club', href:'#', url:'', real:false, tbc:'Imperial Partners Club website link', label:'Website to confirm', role:'For professionals: the network of lawyers, bankers, wealth advisers and family offices who introduce families to us', tagline:'A global network for growth. Together further.'},
  {key:'private-office', name:'Imperial Private Office', short:'Private Office', href:'#', url:'', real:false, tbc:'Imperial Private Office website link', label:'Website to confirm', role:'For existing Clients: one lasting relationship for families with multi-country lives', tagline:'Personalised solutions for exceptional clients.'},
  {key:'real-estate', name:'Imperial Real Estate', short:'Real Estate', href:'#', url:'', real:false, soon:true, tbc:'Imperial Real Estate website link (at launch)', label:'Website to confirm', role:'Coming soon: licensed property advisory, starting with Dubai', tagline:'Curated properties. Enduring value.'},
  {key:'academy', name:'Imperial Academy', short:'Academy', href:'#', url:'', real:false, tbc:'Imperial Academy website link', label:'Website to confirm', role:'Learning and standards: training and certification for the people who do this work', tagline:'Education. Talent. Leadership. A stronger tomorrow.'}
];
function siteOf(key){ for(var i = 0; i < SITES.length; i++){ if(SITES[i].key === key) return SITES[i]; } return null; }
/* A division page's "visit the website" call to action, taken from the site entry so the link lives in one place. */
function siteCta(key, label){ var s = siteOf(key); return {label:label, href:s.href, real:!!s.real, tbc:s.tbc}; }
window.IHG = {
  /* Site configuration (v5). Empty strings switch a feature off. Every TO CONFIRM here is listed in the launch report. */
  config: {
    site: 'ihg',
    siteUrl: 'https://www.imperialholdingsgroup.com',   /* TO CONFIRM: final production domain */
    defaultDivision: 'group',
    leadEndpoint: '/.netlify/functions/lead',
    verifyEndpoint: '/.netlify/functions/verify',
    turnstileSiteKey: '',                                 /* TO CONFIRM: Cloudflare Turnstile site key (Gilbert) */
    ga4: '',                                              /* TO CONFIRM: GA4 measurement id (Gilbert) */
    searchConsole: '',                                    /* TO CONFIRM: Search Console verification token (Gilbert) */
    booking: {
      dubai: {url:'', tbc:'Dubai booking page (Microsoft Bookings or Calendly)'},
      lagos: {url:'', tbc:'Lagos booking page (Microsoft Bookings or Calendly)'}
    },
    whatsapp: {
      dubai: {number:'+971 4 546 1110', tbc:'Confirm this number is WhatsApp enabled'},
      lagos: {number:'+234 902 222 2024', tbc:'Confirm this number is WhatsApp enabled'}
    },
    guide: {file:'', title:'The Imperial guide to second residency and citizenship', tbc:'Guide PDF to be written and approved'}
  },
  /* Photo registry (v5). own:true is Imperial's own photograph. Stock photographs keep their Unsplash id and credit
     line (shown in the footer). consent:true means the photograph shows no guests, or the people in it have confirmed
     they are happy to be featured (the two leadership portraits count as confirmed staff photographs). Photographs from
     an event (key events/<slug>/..., or event:'<slug>') also become visible when events[i].consent is true. See
     photoAllowed() in app.js. src says where a derived file came from.
     TO CONFIRM: the seven entries marked placeholder:true were supplied as own photographs but look like generated
     scenes rather than photographs of our offices or cities; the professional shoot (docs/PHOTO-SHOT-LIST.md) replaces them. */
  photos: [
    {key:'hero', own:true, consent:false, event:'lagos-office-event', src:'events/lagos-office-event/cover', what:'Guests at the Lagos office on Aromire Road, Ikoyi'},
    {key:'hero-night', own:true, consent:false, event:'gala-dinner-lagos', src:'events/gala-dinner-lagos/cover', what:'A speaker at the Imperial Citizenship gala dinner, Lagos'},
    {key:'hero-alt', own:true, consent:true, src:'events/easter-polo-cup-2026/05', what:'The Imperial Citizenship backdrop at the Easter Polo Cup after party, Lagos Polo Club'},
    {key:'events/easter-polo-cup-2026/02', own:true, consent:true, what:'Polo at Lagos Polo Club, Ikoyi'},
    {key:'events/easter-polo-cup-2026/04', own:true, consent:true, what:'The Easter Polo Cup after party banner, Lagos Polo Club'},
    {key:'events/easter-polo-cup-2026/05', own:true, consent:true, what:'The Imperial Citizenship backdrop at the Easter Polo Cup after party'},
    {key:'events/lagos-office-event/07', own:true, consent:false, event:'lagos-office-event', what:'Two guests in conversation at the Lagos office'},
    {key:'events/lagos-diplomatic-soiree-2025/cover', own:true, consent:false, event:'lagos-diplomatic-soiree-2025', what:'A guest at the Lagos Diplomatic Soir\u00e9e 2025'},
    {key:'citizenship', own:true, consent:true, placeholder:true, what:'Private jet on the apron at sunset'},
    {key:'private-office', own:true, consent:true, placeholder:true, what:'Penthouse lounge overlooking the Dubai coast'},
    {key:'partners', own:true, consent:true, placeholder:true, what:'Glass towers seen from below'},
    {key:'academy', own:true, consent:true, placeholder:true, what:'Private library at sunset'},
    {key:'about', own:true, consent:true, placeholder:true, what:'Colonnade in evening light'},
    {key:'lagos', own:true, consent:true, placeholder:true, what:'Lagos skyline and bridge at sunset'},
    {key:'closing', own:true, consent:true, placeholder:true, what:'Dubai rising above the clouds'},
    {key:'real-estate', own:false, consent:true, id:'dYLzGcPqrtE', by:'Nejc Sokli\u010d', src:'Unsplash', what:'Palm Jumeirah and the Dubai coast from above'},
    {key:'dubai', own:false, consent:true, id:'7Zt3XXXp3II', by:'Anoof C', src:'Unsplash', what:'Dubai skyline at sunset'},
    {key:'people/zaid', own:true, consent:true, what:'Zaid Al Hindi, Founder and Group Chief Executive Officer'},
    {key:'people/hekma', own:true, consent:true, what:'Hekma Iskandarani, Group Chief Operating Officer'}
  ],

  /* Home hero (v5). photo and night show when consent is recorded for their event, or in preview builds; until then the
     page shows fallback, an own photograph without guests. The two preload lines in index.html point at the fallback
     files; move them to hero.webp and hero-m.webp once consent is recorded. TO CONFIRM: final hero photo (the shoot). */
  hero: {photo:'hero', night:'hero-night', fallback:'hero-alt', tbc:'Final hero photo'},

  /* Video (v5). One shape everywhere: {type:'video', provider:'vimeo'|'mux', id:'', poster:'<photo key>',
     captions:'assets/captions/<slug>.vtt', title:'', duration:'', tbc:'...'}. An empty id renders the poster and the
     tbc label and never a player. Players load only on click (Vimeo with dnt=1, no title, byline or portrait; related
     videos are switched off per video in the Vimeo settings). src (optional) is a direct muted mp4 or webm used only
     for the silent hero loop. hash (optional) is the Vimeo unlisted-link hash.
     TO CONFIRM: Vimeo or Mux account, private link settings, and every clip below (footage, captions, posters). */
  video: {
    hero: {type:'video', provider:'vimeo', id:'', src:'', poster:'hero', captions:'assets/captions/hero-loop.vtt', title:'Hero loop', duration:'10 to 15 seconds, silent', tbc:'Hero loop to be filmed (city or office, silent)'},
    about: {type:'video', provider:'vimeo', id:'', poster:'people/zaid', captions:'assets/captions/about-founder.vtt', title:'Founder film', duration:'60 to 90 seconds', tbc:'Footage to be supplied'}
  },

  /* Our Network: the three audiences the site is organised around, and one client journey that shows how the
     ecosystem creates value. Photographs are from Imperial events (see events[]). */
  network: {
    journey: [
      ['Citizenship','A business owner first approaches Imperial for Grenada citizenship.','citizenship'],
      ['Property','Later, the family acquires an investment property through Imperial Real Estate.','real-estate'],
      ['Introduction','They introduce another entrepreneur through Imperial Partners Club.','partners-club'],
      ['Private Office','In time, the relationship broadens into a Private Office relationship.','private-office']
    ],
    audiences: [
      {k:'clients', t:'Private Clients', s:'Mobility, property and selected private services.', cta:'Explore Client Services', href:'#/divisions', img:'events/lagos-diplomatic-soiree-2025/03', divs:['citizenship','real-estate','private-office']},
      {k:'partners', t:'Professional Partners', s:'Advisers, family offices, institutions and business introducers.', cta:'Explore Imperial Partners Club', href:'#/divisions/partners-club', img:'events/easter-polo-cup-2026/03', divs:['partners-club','academy']},
      {k:'institutions', t:'Institutions & Strategic Relationships', s:'Developers, governments, service providers and strategic collaborators.', cta:'Start a Strategic Conversation', href:'#/contact?about=group&audience=institutions', img:'events/gala-dinner-lagos/01', divs:[]}
    ],
    photos: ['events/lagos-diplomatic-soiree-2025/02','events/grenada-51-dubai/cover','events/easter-polo-cup-2026/02','events/delborough-dinner/04']
  },

  /* Events: genuine Imperial gatherings. Photographs are from the Marketing Team SharePoint (Events folder).
     Dates and venues marked tbc have not been confirmed in writing. n = number of gallery photographs.
     consent: true once the guests in that event's photographs have confirmed they are happy to be featured; until then
     production builds hold the photographs back (see photoAllowed in app.js). video: one highlights clip per event.
     TO CONFIRM: guest consent for every event below. */
  events: [
    {slug:'grenada-51-dubai', title:'Grenada’s 51st Independence Day After Party', short:'Grenada 51st, Dubai', city:'Dubai', venue:'Agora Cocktail Bar & Social Club, The Dubai EDITION, Downtown Dubai', date:'19 February 2025', iso:'2025-02-19', cat:'Diplomatic', n:4, featured:true, consent:false,
     video:{type:'video', provider:'vimeo', id:'', poster:'events/grenada-51-dubai/cover', captions:'assets/captions/grenada-51-dubai.vtt', title:'Highlights: Grenada 51st after party, Dubai', duration:'', tbc:'Highlights clip to be supplied'},
     dek:'Imperial Citizenship sponsored the after party for Grenada’s 51st Independence Day, following the official celebrations hosted by IMA Grenada and the Consulate General of Grenada in Dubai.',
     body:['Imperial Citizenship sponsored the after party for Grenada’s 51st Independence Day in Dubai on 19 February 2025, held at Agora Cocktail Bar and Social Club at The Dubai EDITION, Downtown Dubai.','The evening followed the official celebrations at the Marriott Resort Palm Jumeirah, hosted by IMA Grenada and the Consulate General of Grenada in Dubai.'],
     guests:['H.E. Ziya Rahaman, Consul General of Grenada to the UAE','Hon. Dennis Cornwall, Minister of Finance, Grenada','H.E. Justin Kareem Hawley, Ambassador of St Kitts and Nevis to the UAE','Mr Thomas Anthony, CEO, IMA Grenada','H.E. Murillo Fallas','H.E. James Harris','H.E. Andrew Tsepo Lebona','Mr Zaid Al Hindi, Founder and Group CEO, Imperial Holdings Group'],
     src:'Press release, 19 February 2025 (Marketing Team SharePoint)'},
    {slug:'lagos-diplomatic-soiree-2025', title:'The Lagos Diplomatic Soirée 2025', short:'Diplomatic Soirée, Lagos', city:'Lagos', venue:null, date:'2025', iso:'2025', cat:'Diplomatic', n:6, featured:true, consent:false,
     video:{type:'video', provider:'vimeo', id:'', poster:'events/lagos-diplomatic-soiree-2025/cover', captions:'assets/captions/lagos-diplomatic-soiree-2025.vtt', title:'Highlights: The Lagos Diplomatic Soir\u00e9e 2025', duration:'', tbc:'Highlights clip to be supplied'},
     dek:'An evening in Lagos bringing together members of the diplomatic community, clients and friends of Imperial.',
     body:['The Lagos Diplomatic Soirée brought together members of the diplomatic community, clients, partners and friends of Imperial for an evening in Lagos.'], tbc:['Exact date','Venue','Guests of honour']},
    {slug:'gala-dinner-lagos', title:'Gala Dinner, Lagos', short:'Gala Dinner, Lagos', city:'Lagos', venue:null, date:null, iso:null, cat:'Private gathering', n:6, consent:false,
     dek:'A gala dinner hosted by Imperial Citizenship in Lagos, with guests from across the Caribbean citizenship community.',
     body:['Imperial Citizenship hosted a gala dinner in Lagos for clients, partners and guests from the Caribbean citizenship community.'], tbc:['Date','Venue','Speakers and guests of honour']},
    {slug:'easter-polo-cup-2026', title:'Easter Polo Cup After Party', short:'Easter Polo Cup, Lagos', city:'Lagos', venue:'Lagos Polo Club, Ikoyi', date:'Easter 2026', iso:'2026', cat:'Partnership', n:5, consent:false,
     video:{type:'video', provider:'vimeo', id:'', poster:'events/easter-polo-cup-2026/cover', captions:'assets/captions/easter-polo-cup-2026.vtt', title:'Highlights: Easter Polo Cup after party, Lagos', duration:'', tbc:'Highlights clip to be supplied'},
     dek:'Imperial Citizenship and Lagos Polo Club: an exclusive Easter Polo Cup after party at Lagos Polo Club, Ikoyi.',
     body:['Imperial Citizenship partnered with Lagos Polo Club for an exclusive after party following the Easter Polo Cup at Lagos Polo Club, Ikoyi.'], tbc:['Exact date']},
    {slug:'lagos-office-event', title:'An Evening at the Lagos Office', short:'Lagos office evening', city:'Lagos', venue:'8 Aromire Road, Ikoyi', date:null, iso:null, cat:'Private gathering', n:7, consent:false,
     dek:'Clients, partners and friends of Imperial at the Lagos office on Aromire Road, Ikoyi.',
     body:['Imperial welcomed clients, partners and friends to an evening at the Lagos office on Aromire Road, Ikoyi.'], tbc:['Date','Occasion']},
    {slug:'delborough-dinner', title:'A Private Dinner at DANI, The Delborough', short:'Private dinner, Lagos', city:'Lagos', venue:'DANI, The Delborough Hotel, Lagos', date:null, iso:null, cat:'Private gathering', n:6, consent:false,
     dek:'A private dinner for clients and friends of Imperial at DANI, The Delborough Hotel, Lagos.',
     body:['Imperial hosted a private dinner for clients and friends at DANI, The Delborough Hotel, Lagos.'], tbc:['Date','Occasion']}
  ],

  /* Journal: selective and institutional. Company developments, insights, partnerships and selected events.
     Rows are sorted by iso (newest first, unknown dates last); a row with no date shows no date line.
     video: one slot per entry, empty until a clip exists (same shape as D.video). The two layout samples that pointed
     at the Insights articles were removed; the four Insights articles themselves are draft copy awaiting approval. */
  journal: [
    {kind:'Partnerships', date:'19 February 2025', iso:'2025-02-19', title:'Imperial Citizenship sponsors Grenada’s 51st Independence Day after party in Dubai', dek:'Following the official celebrations hosted by IMA Grenada and the Consulate General of Grenada in Dubai, Imperial Citizenship sponsored the evening at The Dubai EDITION.', to:'/journal/events/grenada-51-dubai', img:'events/grenada-51-dubai/cover-p', own:true, video:null},
    {kind:'Company developments', date:null, iso:null, title:'Imperial Real Estate is licensed and preparing to launch', dek:'The Group’s fifth division will offer licensed property advisory, starting with Dubai. Interest can be registered now.', to:'/divisions/real-estate', img:'real-estate', video:null},
    {kind:'Partnerships', date:'Easter 2026', iso:'2026', title:'Imperial Citizenship and Lagos Polo Club host the Easter Polo Cup after party', dek:'An exclusive after party at Lagos Polo Club, Ikoyi, following the Easter Polo Cup.', to:'/journal/events/easter-polo-cup-2026', img:'events/easter-polo-cup-2026/cover-p', own:true, video:null},
    {kind:'Events', date:'2025', iso:'2025', title:'The Lagos Diplomatic Soirée 2025', dek:'Members of the diplomatic community, clients and friends of Imperial, together for an evening in Lagos.', to:'/journal/events/lagos-diplomatic-soiree-2025', img:'events/lagos-diplomatic-soiree-2025/cover-p', own:true, video:null}
  ],

  map: {w:1440, h:544, path:'M275 5h0M305 5h0M315 5h0M345 5h0M355 5h0M365 5h0M375 5h0M385 5h0M395 5h0M405 5h0M415 5h0M445 5h0M455 5h0M465 5h0M475 5h0M485 5h0M495 5h0M505 5h0M515 5h0M525 5h0M535 5h0M545 5h0M555 5h0M565 5h0M575 5h0M585 5h0M595 5h0M605 5h0M615 5h0M625 5h0M635 5h0M775 5h0M785 5h0M795 5h0M1125 5h0M1135 5h0M235 15h0M265 15h0M285 15h0M315 15h0M325 15h0M355 15h0M445 15h0M455 15h0M465 15h0M475 15h0M485 15h0M495 15h0M505 15h0M515 15h0M525 15h0M535 15h0M545 15h0M555 15h0M565 15h0M575 15h0M585 15h0M595 15h0M605 15h0M615 15h0M625 15h0M635 15h0M965 15h0M975 15h0M985 15h0M1115 15h0M1125 15h0M1135 15h0M1145 15h0M1155 15h0M1165 15h0M225 25h0M235 25h0M245 25h0M255 25h0M345 25h0M355 25h0M375 25h0M505 25h0M515 25h0M525 25h0M535 25h0M545 25h0M555 25h0M565 25h0M575 25h0M585 25h0M595 25h0M605 25h0M615 25h0M625 25h0M635 25h0M935 25h0M945 25h0M1055 25h0M1065 25h0M1075 25h0M1085 25h0M1095 25h0M1105 25h0M1115 25h0M1125 25h0M1135 25h0M1145 25h0M1155 25h0M1165 25h0M1285 25h0M5 35h0M95 35h0M255 35h0M265 35h0M275 35h0M285 35h0M295 35h0M335 35h0M345 35h0M365 35h0M375 35h0M385 35h0M395 35h0M405 35h0M415 35h0M425 35h0M515 35h0M525 35h0M535 35h0M545 35h0M555 35h0M565 35h0M575 35h0M585 35h0M595 35h0M605 35h0M615 35h0M625 35h0M935 35h0M945 35h0M995 35h0M1005 35h0M1015 35h0M1035 35h0M1045 35h0M1055 35h0M1065 35h0M1075 35h0M1085 35h0M1095 35h0M1105 35h0M1115 35h0M1125 35h0M1135 35h0M1145 35h0M1155 35h0M1165 35h0M1175 35h0M1185 35h0M1195 35h0M1205 35h0M1215 35h0M1225 35h0M1235 35h0M1255 35h0M1265 35h0M1275 35h0M1285 35h0M1295 35h0M1305 35h0M1315 35h0M1325 35h0M55 45h0M65 45h0M75 45h0M85 45h0M95 45h0M105 45h0M115 45h0M125 45h0M135 45h0M145 45h0M155 45h0M165 45h0M175 45h0M185 45h0M195 45h0M205 45h0M215 45h0M225 45h0M235 45h0M245 45h0M255 45h0M275 45h0M295 45h0M345 45h0M355 45h0M365 45h0M385 45h0M395 45h0M425 45h0M435 45h0M445 45h0M515 45h0M525 45h0M535 45h0M545 45h0M555 45h0M565 45h0M575 45h0M585 45h0M595 45h0M605 45h0M795 45h0M805 45h0M815 45h0M825 45h0M835 45h0M845 45h0M855 45h0M865 45h0M935 45h0M955 45h0M965 45h0M975 45h0M985 45h0M1005 45h0M1025 45h0M1035 45h0M1045 45h0M1055 45h0M1065 45h0M1075 45h0M1085 45h0M1095 45h0M1105 45h0M1115 45h0M1125 45h0M1135 45h0M1145 45h0M1155 45h0M1165 45h0M1175 45h0M1185 45h0M1195 45h0M1205 45h0M1215 45h0M1225 45h0M1235 45h0M1245 45h0M1255 45h0M1265 45h0M1275 45h0M1285 45h0M1295 45h0M1305 45h0M1315 45h0M1325 45h0M1335 45h0M1345 45h0M1355 45h0M1365 45h0M1375 45h0M1385 45h0M1395 45h0M1405 45h0M1415 45h0M1425 45h0M1435 45h0M5 55h0M15 55h0M25 55h0M35 55h0M65 55h0M75 55h0M85 55h0M95 55h0M105 55h0M115 55h0M125 55h0M135 55h0M145 55h0M155 55h0M165 55h0M175 55h0M185 55h0M195 55h0M205 55h0M215 55h0M225 55h0M235 55h0M245 55h0M255 55h0M265 55h0M275 55h0M285 55h0M295 55h0M305 55h0M315 55h0M325 55h0M335 55h0M345 55h0M355 55h0M365 55h0M375 55h0M425 55h0M435 55h0M445 55h0M455 55h0M465 55h0M515 55h0M525 55h0M535 55h0M545 55h0M555 55h0M565 55h0M575 55h0M655 55h0M775 55h0M785 55h0M795 55h0M805 55h0M815 55h0M825 55h0M835 55h0M845 55h0M855 55h0M875 55h0M905 55h0M915 55h0M925 55h0M935 55h0M945 55h0M955 55h0M965 55h0M975 55h0M985 55h0M995 55h0M1005 55h0M1015 55h0M1025 55h0M1035 55h0M1045 55h0M1055 55h0M1065 55h0M1075 55h0M1085 55h0M1095 55h0M1105 55h0M1115 55h0M1125 55h0M1135 55h0M1145 55h0M1155 55h0M1165 55h0M1175 55h0M1185 55h0M1195 55h0M1205 55h0M1215 55h0M1225 55h0M1235 55h0M1245 55h0M1255 55h0M1265 55h0M1275 55h0M1285 55h0M1295 55h0M1305 55h0M1315 55h0M1325 55h0M1335 55h0M1345 55h0M1355 55h0M1365 55h0M1375 55h0M1385 55h0M1395 55h0M1405 55h0M1415 55h0M1425 55h0M1435 55h0M85 65h0M95 65h0M105 65h0M115 65h0M125 65h0M135 65h0M145 65h0M155 65h0M165 65h0M175 65h0M185 65h0M195 65h0M205 65h0M215 65h0M225 65h0M235 65h0M245 65h0M255 65h0M265 65h0M275 65h0M285 65h0M295 65h0M305 65h0M315 65h0M325 65h0M335 65h0M345 65h0M355 65h0M375 65h0M395 65h0M435 65h0M445 65h0M455 65h0M515 65h0M525 65h0M535 65h0M545 65h0M555 65h0M645 65h0M765 65h0M775 65h0M785 65h0M795 65h0M815 65h0M825 65h0M835 65h0M845 65h0M855 65h0M865 65h0M875 65h0M885 65h0M895 65h0M905 65h0M915 65h0M925 65h0M935 65h0M945 65h0M955 65h0M965 65h0M975 65h0M985 65h0M995 65h0M1005 65h0M1015 65h0M1025 65h0M1035 65h0M1045 65h0M1055 65h0M1065 65h0M1075 65h0M1085 65h0M1095 65h0M1105 65h0M1115 65h0M1125 65h0M1135 65h0M1145 65h0M1155 65h0M1165 65h0M1175 65h0M1185 65h0M1195 65h0M1205 65h0M1215 65h0M1225 65h0M1235 65h0M1245 65h0M1255 65h0M1265 65h0M1275 65h0M1285 65h0M1295 65h0M1305 65h0M1315 65h0M1325 65h0M1335 65h0M1345 65h0M1355 65h0M1365 65h0M1375 65h0M1385 65h0M1395 65h0M1405 65h0M1415 65h0M1425 65h0M65 75h0M75 75h0M85 75h0M95 75h0M105 75h0M115 75h0M125 75h0M135 75h0M145 75h0M155 75h0M165 75h0M175 75h0M185 75h0M195 75h0M205 75h0M215 75h0M225 75h0M235 75h0M245 75h0M255 75h0M265 75h0M275 75h0M285 75h0M295 75h0M305 75h0M315 75h0M325 75h0M335 75h0M415 75h0M425 75h0M525 75h0M535 75h0M545 75h0M745 75h0M755 75h0M765 75h0M775 75h0M785 75h0M815 75h0M825 75h0M835 75h0M845 75h0M855 75h0M865 75h0M875 75h0M885 75h0M895 75h0M905 75h0M915 75h0M925 75h0M935 75h0M945 75h0M955 75h0M965 75h0M975 75h0M985 75h0M995 75h0M1005 75h0M1015 75h0M1025 75h0M1035 75h0M1045 75h0M1055 75h0M1065 75h0M1075 75h0M1085 75h0M1095 75h0M1105 75h0M1115 75h0M1125 75h0M1135 75h0M1145 75h0M1155 75h0M1165 75h0M1175 75h0M1185 75h0M1195 75h0M1205 75h0M1215 75h0M1225 75h0M1235 75h0M1245 75h0M1255 75h0M1265 75h0M1275 75h0M1285 75h0M1295 75h0M1305 75h0M1315 75h0M1325 75h0M1335 75h0M1345 75h0M1365 75h0M1375 75h0M1385 75h0M1395 75h0M1405 75h0M75 85h0M85 85h0M95 85h0M105 85h0M175 85h0M185 85h0M195 85h0M205 85h0M215 85h0M225 85h0M235 85h0M245 85h0M255 85h0M265 85h0M275 85h0M285 85h0M295 85h0M305 85h0M315 85h0M325 85h0M335 85h0M345 85h0M415 85h0M425 85h0M435 85h0M445 85h0M465 85h0M745 85h0M755 85h0M765 85h0M775 85h0M785 85h0M815 85h0M825 85h0M835 85h0M845 85h0M855 85h0M865 85h0M875 85h0M885 85h0M895 85h0M905 85h0M915 85h0M925 85h0M935 85h0M945 85h0M955 85h0M965 85h0M975 85h0M985 85h0M995 85h0M1005 85h0M1015 85h0M1025 85h0M1035 85h0M1045 85h0M1055 85h0M1065 85h0M1075 85h0M1085 85h0M1095 85h0M1105 85h0M1115 85h0M1125 85h0M1135 85h0M1145 85h0M1155 85h0M1165 85h0M1175 85h0M1185 85h0M1195 85h0M1205 85h0M1215 85h0M1225 85h0M1235 85h0M1245 85h0M1255 85h0M1265 85h0M1275 85h0M1285 85h0M1365 85h0M85 95h0M195 95h0M205 95h0M215 95h0M225 95h0M235 95h0M245 95h0M255 95h0M265 95h0M275 95h0M285 95h0M295 95h0M305 95h0M315 95h0M325 95h0M335 95h0M345 95h0M355 95h0M365 95h0M415 95h0M425 95h0M435 95h0M445 95h0M455 95h0M465 95h0M705 95h0M755 95h0M775 95h0M805 95h0M815 95h0M825 95h0M835 95h0M845 95h0M855 95h0M865 95h0M875 95h0M885 95h0M895 95h0M905 95h0M915 95h0M925 95h0M935 95h0M945 95h0M955 95h0M965 95h0M975 95h0M985 95h0M995 95h0M1005 95h0M1015 95h0M1025 95h0M1035 95h0M1045 95h0M1055 95h0M1065 95h0M1075 95h0M1085 95h0M1095 95h0M1105 95h0M1115 95h0M1125 95h0M1135 95h0M1145 95h0M1155 95h0M1165 95h0M1175 95h0M1185 95h0M1195 95h0M1205 95h0M1215 95h0M1225 95h0M1235 95h0M1245 95h0M1255 95h0M1265 95h0M1345 95h0M1355 95h0M1365 95h0M205 105h0M215 105h0M225 105h0M235 105h0M245 105h0M255 105h0M265 105h0M275 105h0M285 105h0M295 105h0M305 105h0M315 105h0M325 105h0M335 105h0M345 105h0M355 105h0M365 105h0M375 105h0M385 105h0M405 105h0M415 105h0M425 105h0M435 105h0M445 105h0M455 105h0M465 105h0M475 105h0M485 105h0M685 105h0M695 105h0M715 105h0M755 105h0M765 105h0M775 105h0M785 105h0M795 105h0M805 105h0M815 105h0M825 105h0M835 105h0M845 105h0M855 105h0M865 105h0M875 105h0M885 105h0M895 105h0M905 105h0M915 105h0M925 105h0M935 105h0M945 105h0M955 105h0M965 105h0M975 105h0M985 105h0M995 105h0M1005 105h0M1015 105h0M1025 105h0M1035 105h0M1045 105h0M1055 105h0M1065 105h0M1075 105h0M1085 105h0M1095 105h0M1105 105h0M1115 105h0M1125 105h0M1135 105h0M1145 105h0M1155 105h0M1165 105h0M1175 105h0M1185 105h0M1195 105h0M1205 105h0M1215 105h0M1225 105h0M1235 105h0M1245 105h0M1255 105h0M1265 105h0M1275 105h0M1345 105h0M1355 105h0M215 115h0M225 115h0M235 115h0M245 115h0M255 115h0M265 115h0M275 115h0M285 115h0M295 115h0M305 115h0M315 115h0M325 115h0M335 115h0M345 115h0M355 115h0M365 115h0M375 115h0M385 115h0M395 115h0M405 115h0M415 115h0M425 115h0M435 115h0M445 115h0M455 115h0M465 115h0M475 115h0M485 115h0M495 115h0M705 115h0M715 115h0M725 115h0M735 115h0M745 115h0M755 115h0M765 115h0M775 115h0M785 115h0M795 115h0M805 115h0M815 115h0M825 115h0M835 115h0M845 115h0M855 115h0M865 115h0M875 115h0M885 115h0M895 115h0M905 115h0M915 115h0M925 115h0M935 115h0M945 115h0M955 115h0M965 115h0M975 115h0M985 115h0M995 115h0M1005 115h0M1015 115h0M1025 115h0M1035 115h0M1045 115h0M1055 115h0M1065 115h0M1075 115h0M1085 115h0M1095 115h0M1105 115h0M1115 115h0M1125 115h0M1135 115h0M1145 115h0M1155 115h0M1165 115h0M1175 115h0M1185 115h0M1195 115h0M1205 115h0M1215 115h0M1225 115h0M1235 115h0M1245 115h0M1255 115h0M1265 115h0M1275 115h0M225 125h0M235 125h0M245 125h0M255 125h0M265 125h0M275 125h0M285 125h0M295 125h0M305 125h0M315 125h0M325 125h0M335 125h0M345 125h0M355 125h0M365 125h0M375 125h0M385 125h0M395 125h0M405 125h0M415 125h0M425 125h0M435 125h0M455 125h0M485 125h0M495 125h0M505 125h0M705 125h0M715 125h0M725 125h0M735 125h0M745 125h0M755 125h0M765 125h0M775 125h0M785 125h0M795 125h0M805 125h0M815 125h0M825 125h0M835 125h0M845 125h0M855 125h0M865 125h0M875 125h0M885 125h0M895 125h0M905 125h0M915 125h0M925 125h0M935 125h0M945 125h0M955 125h0M965 125h0M975 125h0M985 125h0M995 125h0M1005 125h0M1015 125h0M1025 125h0M1035 125h0M1045 125h0M1055 125h0M1065 125h0M1075 125h0M1085 125h0M1095 125h0M1105 125h0M1115 125h0M1125 125h0M1135 125h0M1145 125h0M1155 125h0M1165 125h0M1175 125h0M1185 125h0M1195 125h0M1205 125h0M1215 125h0M1225 125h0M1235 125h0M1245 125h0M1255 125h0M1265 125h0M1275 125h0M225 135h0M235 135h0M245 135h0M255 135h0M265 135h0M275 135h0M285 135h0M295 135h0M305 135h0M315 135h0M325 135h0M335 135h0M345 135h0M355 135h0M365 135h0M375 135h0M385 135h0M395 135h0M405 135h0M415 135h0M425 135h0M435 135h0M445 135h0M455 135h0M715 135h0M725 135h0M735 135h0M745 135h0M755 135h0M765 135h0M775 135h0M785 135h0M795 135h0M805 135h0M815 135h0M825 135h0M835 135h0M855 135h0M875 135h0M885 135h0M895 135h0M905 135h0M915 135h0M925 135h0M935 135h0M945 135h0M955 135h0M965 135h0M975 135h0M985 135h0M995 135h0M1005 135h0M1015 135h0M1025 135h0M1035 135h0M1045 135h0M1055 135h0M1065 135h0M1075 135h0M1085 135h0M1095 135h0M1105 135h0M1115 135h0M1125 135h0M1135 135h0M1145 135h0M1155 135h0M1165 135h0M1175 135h0M1185 135h0M1195 135h0M1205 135h0M1215 135h0M1225 135h0M1235 135h0M1245 135h0M1255 135h0M1265 135h0M225 145h0M235 145h0M245 145h0M255 145h0M265 145h0M275 145h0M285 145h0M295 145h0M305 145h0M315 145h0M325 145h0M335 145h0M345 145h0M355 145h0M365 145h0M375 145h0M385 145h0M395 145h0M405 145h0M415 145h0M425 145h0M435 145h0M715 145h0M725 145h0M735 145h0M745 145h0M765 145h0M785 145h0M795 145h0M805 145h0M815 145h0M825 145h0M885 145h0M895 145h0M905 145h0M915 145h0M925 145h0M935 145h0M945 145h0M955 145h0M965 145h0M975 145h0M985 145h0M995 145h0M1005 145h0M1015 145h0M1025 145h0M1035 145h0M1045 145h0M1055 145h0M1065 145h0M1075 145h0M1085 145h0M1095 145h0M1105 145h0M1115 145h0M1125 145h0M1135 145h0M1145 145h0M1155 145h0M1165 145h0M1175 145h0M1185 145h0M1195 145h0M1205 145h0M1215 145h0M1225 145h0M1235 145h0M1245 145h0M1255 145h0M1295 145h0M225 155h0M235 155h0M245 155h0M255 155h0M265 155h0M275 155h0M285 155h0M295 155h0M305 155h0M315 155h0M325 155h0M335 155h0M345 155h0M355 155h0M365 155h0M375 155h0M385 155h0M395 155h0M405 155h0M415 155h0M425 155h0M685 155h0M695 155h0M705 155h0M715 155h0M725 155h0M775 155h0M785 155h0M805 155h0M815 155h0M825 155h0M835 155h0M855 155h0M865 155h0M885 155h0M895 155h0M905 155h0M915 155h0M925 155h0M935 155h0M945 155h0M955 155h0M965 155h0M975 155h0M985 155h0M995 155h0M1005 155h0M1015 155h0M1025 155h0M1035 155h0M1045 155h0M1055 155h0M1065 155h0M1075 155h0M1085 155h0M1095 155h0M1105 155h0M1115 155h0M1125 155h0M1135 155h0M1145 155h0M1155 155h0M1165 155h0M1175 155h0M1185 155h0M1195 155h0M1205 155h0M1215 155h0M1225 155h0M1235 155h0M1285 155h0M235 165h0M245 165h0M255 165h0M265 165h0M275 165h0M285 165h0M295 165h0M305 165h0M315 165h0M325 165h0M335 165h0M345 165h0M355 165h0M365 165h0M375 165h0M385 165h0M395 165h0M405 165h0M415 165h0M685 165h0M695 165h0M705 165h0M715 165h0M785 165h0M805 165h0M835 165h0M845 165h0M855 165h0M865 165h0M875 165h0M885 165h0M895 165h0M905 165h0M915 165h0M925 165h0M935 165h0M945 165h0M955 165h0M965 165h0M975 165h0M985 165h0M995 165h0M1005 165h0M1015 165h0M1025 165h0M1035 165h0M1045 165h0M1055 165h0M1065 165h0M1075 165h0M1085 165h0M1095 165h0M1105 165h0M1115 165h0M1125 165h0M1135 165h0M1145 165h0M1155 165h0M1165 165h0M1175 165h0M1185 165h0M1225 165h0M1285 165h0M235 175h0M245 175h0M255 175h0M265 175h0M275 175h0M285 175h0M295 175h0M305 175h0M315 175h0M325 175h0M335 175h0M345 175h0M355 175h0M365 175h0M375 175h0M385 175h0M395 175h0M405 175h0M415 175h0M725 175h0M735 175h0M745 175h0M755 175h0M855 175h0M865 175h0M875 175h0M885 175h0M895 175h0M905 175h0M915 175h0M925 175h0M935 175h0M945 175h0M955 175h0M965 175h0M975 175h0M985 175h0M995 175h0M1005 175h0M1015 175h0M1025 175h0M1035 175h0M1045 175h0M1055 175h0M1065 175h0M1075 175h0M1085 175h0M1095 175h0M1105 175h0M1115 175h0M1125 175h0M1135 175h0M1145 175h0M1155 175h0M1165 175h0M1175 175h0M1185 175h0M1195 175h0M1235 175h0M1265 175h0M1275 175h0M255 185h0M265 185h0M275 185h0M285 185h0M295 185h0M305 185h0M315 185h0M325 185h0M335 185h0M345 185h0M355 185h0M365 185h0M375 185h0M385 185h0M395 185h0M405 185h0M695 185h0M705 185h0M715 185h0M725 185h0M735 185h0M745 185h0M755 185h0M865 185h0M875 185h0M885 185h0M895 185h0M905 185h0M915 185h0M925 185h0M935 185h0M945 185h0M955 185h0M965 185h0M975 185h0M985 185h0M995 185h0M1005 185h0M1015 185h0M1025 185h0M1035 185h0M1045 185h0M1055 185h0M1065 185h0M1075 185h0M1085 185h0M1095 185h0M1105 185h0M1115 185h0M1125 185h0M1135 185h0M1145 185h0M1155 185h0M1165 185h0M1175 185h0M1185 185h0M1195 185h0M1255 185h0M255 195h0M275 195h0M285 195h0M295 195h0M305 195h0M315 195h0M325 195h0M335 195h0M345 195h0M355 195h0M365 195h0M375 195h0M385 195h0M685 195h0M695 195h0M705 195h0M715 195h0M725 195h0M735 195h0M745 195h0M755 195h0M765 195h0M775 195h0M785 195h0M805 195h0M815 195h0M825 195h0M845 195h0M865 195h0M875 195h0M885 195h0M895 195h0M905 195h0M915 195h0M925 195h0M935 195h0M945 195h0M955 195h0M965 195h0M975 195h0M985 195h0M995 195h0M1005 195h0M1015 195h0M1025 195h0M1035 195h0M1045 195h0M1055 195h0M1065 195h0M1075 195h0M1085 195h0M1095 195h0M1105 195h0M1115 195h0M1125 195h0M1135 195h0M1145 195h0M1155 195h0M1165 195h0M1175 195h0M1185 195h0M1195 195h0M1205 195h0M265 205h0M275 205h0M285 205h0M295 205h0M305 205h0M315 205h0M325 205h0M335 205h0M395 205h0M685 205h0M695 205h0M705 205h0M715 205h0M725 205h0M735 205h0M745 205h0M755 205h0M765 205h0M775 205h0M785 205h0M795 205h0M805 205h0M815 205h0M825 205h0M835 205h0M845 205h0M855 205h0M865 205h0M875 205h0M885 205h0M895 205h0M905 205h0M925 205h0M935 205h0M945 205h0M955 205h0M965 205h0M975 205h0M985 205h0M995 205h0M1005 205h0M1015 205h0M1025 205h0M1035 205h0M1045 205h0M1055 205h0M1065 205h0M1075 205h0M1085 205h0M1095 205h0M1105 205h0M1115 205h0M1125 205h0M1135 205h0M1145 205h0M1155 205h0M1165 205h0M1175 205h0M1185 205h0M1195 205h0M1205 205h0M285 215h0M295 215h0M305 215h0M315 215h0M325 215h0M395 215h0M665 215h0M675 215h0M685 215h0M695 215h0M705 215h0M715 215h0M725 215h0M735 215h0M745 215h0M755 215h0M765 215h0M775 215h0M785 215h0M795 215h0M805 215h0M815 215h0M825 215h0M835 215h0M845 215h0M855 215h0M875 215h0M885 215h0M895 215h0M905 215h0M915 215h0M945 215h0M955 215h0M965 215h0M975 215h0M985 215h0M995 215h0M1005 215h0M1015 215h0M1025 215h0M1035 215h0M1045 215h0M1055 215h0M1065 215h0M1075 215h0M1085 215h0M1095 215h0M1105 215h0M1115 215h0M1125 215h0M1135 215h0M1145 215h0M1155 215h0M1165 215h0M1175 215h0M1185 215h0M1195 215h0M295 225h0M305 225h0M315 225h0M325 225h0M665 225h0M675 225h0M685 225h0M695 225h0M705 225h0M715 225h0M725 225h0M735 225h0M745 225h0M755 225h0M765 225h0M775 225h0M785 225h0M795 225h0M805 225h0M815 225h0M825 225h0M835 225h0M845 225h0M855 225h0M875 225h0M885 225h0M895 225h0M905 225h0M915 225h0M925 225h0M935 225h0M945 225h0M995 225h0M1005 225h0M1015 225h0M1025 225h0M1035 225h0M1045 225h0M1055 225h0M1065 225h0M1075 225h0M1085 225h0M1095 225h0M1105 225h0M1115 225h0M1125 225h0M1135 225h0M1145 225h0M1155 225h0M1165 225h0M1175 225h0M1185 225h0M1205 225h0M305 235h0M315 235h0M325 235h0M365 235h0M655 235h0M665 235h0M675 235h0M685 235h0M695 235h0M705 235h0M715 235h0M725 235h0M735 235h0M745 235h0M755 235h0M765 235h0M775 235h0M785 235h0M795 235h0M805 235h0M815 235h0M825 235h0M835 235h0M845 235h0M855 235h0M865 235h0M885 235h0M895 235h0M905 235h0M915 235h0M925 235h0M935 235h0M945 235h0M955 235h0M1005 235h0M1015 235h0M1025 235h0M1035 235h0M1045 235h0M1055 235h0M1065 235h0M1095 235h0M1105 235h0M1115 235h0M1125 235h0M1135 235h0M1145 235h0M305 245h0M315 245h0M325 245h0M335 245h0M355 245h0M365 245h0M435 245h0M445 245h0M665 245h0M675 245h0M685 245h0M695 245h0M705 245h0M715 245h0M725 245h0M735 245h0M745 245h0M755 245h0M765 245h0M775 245h0M785 245h0M795 245h0M805 245h0M815 245h0M825 245h0M835 245h0M845 245h0M855 245h0M865 245h0M885 245h0M895 245h0M905 245h0M915 245h0M925 245h0M935 245h0M945 245h0M1015 245h0M1025 245h0M1035 245h0M1045 245h0M1055 245h0M1105 245h0M1115 245h0M1125 245h0M1135 245h0M1155 245h0M335 255h0M345 255h0M355 255h0M365 255h0M655 255h0M665 255h0M675 255h0M685 255h0M695 255h0M705 255h0M715 255h0M725 255h0M735 255h0M745 255h0M755 255h0M765 255h0M775 255h0M785 255h0M795 255h0M805 255h0M815 255h0M825 255h0M835 255h0M845 255h0M855 255h0M865 255h0M875 255h0M895 255h0M905 255h0M915 255h0M925 255h0M1015 255h0M1025 255h0M1035 255h0M1045 255h0M1115 255h0M1125 255h0M1135 255h0M1145 255h0M1205 255h0M365 265h0M375 265h0M385 265h0M655 265h0M665 265h0M675 265h0M685 265h0M695 265h0M705 265h0M715 265h0M725 265h0M735 265h0M745 265h0M755 265h0M765 265h0M775 265h0M785 265h0M795 265h0M805 265h0M815 265h0M825 265h0M835 265h0M845 265h0M855 265h0M865 265h0M875 265h0M885 265h0M895 265h0M905 265h0M1025 265h0M1035 265h0M1115 265h0M1125 265h0M1135 265h0M1145 265h0M1155 265h0M1205 265h0M1215 265h0M425 275h0M445 275h0M665 275h0M675 275h0M685 275h0M695 275h0M705 275h0M715 275h0M725 275h0M735 275h0M745 275h0M755 275h0M765 275h0M775 275h0M785 275h0M795 275h0M805 275h0M815 275h0M825 275h0M835 275h0M845 275h0M855 275h0M865 275h0M875 275h0M885 275h0M915 275h0M1025 275h0M1035 275h0M1115 275h0M1135 275h0M1145 275h0M395 285h0M415 285h0M425 285h0M435 285h0M445 285h0M455 285h0M465 285h0M475 285h0M675 285h0M685 285h0M695 285h0M705 285h0M715 285h0M725 285h0M735 285h0M745 285h0M755 285h0M765 285h0M775 285h0M785 285h0M795 285h0M805 285h0M815 285h0M825 285h0M835 285h0M845 285h0M855 285h0M865 285h0M875 285h0M885 285h0M895 285h0M905 285h0M915 285h0M1115 285h0M1225 285h0M415 295h0M425 295h0M435 295h0M445 295h0M455 295h0M465 295h0M475 295h0M485 295h0M685 295h0M695 295h0M705 295h0M715 295h0M725 295h0M745 295h0M755 295h0M765 295h0M775 295h0M785 295h0M795 295h0M805 295h0M815 295h0M825 295h0M835 295h0M845 295h0M855 295h0M865 295h0M875 295h0M885 295h0M895 295h0M905 295h0M915 295h0M1045 295h0M1125 295h0M415 305h0M425 305h0M435 305h0M445 305h0M455 305h0M465 305h0M475 305h0M485 305h0M495 305h0M505 305h0M515 305h0M765 305h0M775 305h0M785 305h0M795 305h0M805 305h0M815 305h0M825 305h0M835 305h0M845 305h0M855 305h0M865 305h0M875 305h0M885 305h0M895 305h0M905 305h0M1115 305h0M1125 305h0M1175 305h0M1185 305h0M405 315h0M415 315h0M425 315h0M435 315h0M445 315h0M455 315h0M465 315h0M475 315h0M485 315h0M495 315h0M505 315h0M515 315h0M765 315h0M775 315h0M785 315h0M795 315h0M805 315h0M815 315h0M825 315h0M835 315h0M845 315h0M855 315h0M865 315h0M875 315h0M885 315h0M895 315h0M1125 315h0M1135 315h0M1165 315h0M1175 315h0M1185 315h0M405 325h0M415 325h0M425 325h0M435 325h0M445 325h0M455 325h0M465 325h0M475 325h0M485 325h0M495 325h0M505 325h0M515 325h0M525 325h0M535 325h0M765 325h0M775 325h0M785 325h0M795 325h0M805 325h0M815 325h0M825 325h0M835 325h0M845 325h0M855 325h0M865 325h0M875 325h0M885 325h0M1125 325h0M1135 325h0M1165 325h0M1175 325h0M1185 325h0M1205 325h0M1245 325h0M1255 325h0M405 335h0M415 335h0M425 335h0M435 335h0M445 335h0M455 335h0M465 335h0M475 335h0M485 335h0M495 335h0M505 335h0M515 335h0M525 335h0M535 335h0M545 335h0M555 335h0M565 335h0M765 335h0M775 335h0M785 335h0M795 335h0M805 335h0M815 335h0M825 335h0M835 335h0M845 335h0M855 335h0M865 335h0M875 335h0M1135 335h0M1205 335h0M1265 335h0M1275 335h0M1285 335h0M1295 335h0M405 345h0M415 345h0M425 345h0M435 345h0M445 345h0M455 345h0M465 345h0M475 345h0M485 345h0M495 345h0M505 345h0M515 345h0M525 345h0M535 345h0M545 345h0M555 345h0M565 345h0M575 345h0M775 345h0M785 345h0M795 345h0M805 345h0M815 345h0M825 345h0M835 345h0M845 345h0M855 345h0M865 345h0M875 345h0M1145 345h0M1275 345h0M1285 345h0M1295 345h0M1305 345h0M405 355h0M415 355h0M425 355h0M435 355h0M445 355h0M455 355h0M465 355h0M475 355h0M485 355h0M495 355h0M505 355h0M515 355h0M525 355h0M535 355h0M545 355h0M555 355h0M565 355h0M575 355h0M775 355h0M785 355h0M795 355h0M805 355h0M815 355h0M825 355h0M835 355h0M845 355h0M855 355h0M865 355h0M875 355h0M1195 355h0M1205 355h0M1225 355h0M1285 355h0M415 365h0M425 365h0M435 365h0M445 365h0M455 365h0M465 365h0M475 365h0M485 365h0M495 365h0M505 365h0M515 365h0M525 365h0M535 365h0M545 365h0M555 365h0M565 365h0M775 365h0M785 365h0M795 365h0M805 365h0M815 365h0M825 365h0M835 365h0M845 365h0M855 365h0M865 365h0M875 365h0M415 375h0M425 375h0M435 375h0M445 375h0M455 375h0M465 375h0M475 375h0M485 375h0M495 375h0M505 375h0M515 375h0M525 375h0M535 375h0M545 375h0M555 375h0M775 375h0M785 375h0M795 375h0M805 375h0M815 375h0M825 375h0M835 375h0M845 375h0M855 375h0M865 375h0M875 375h0M915 375h0M1245 375h0M1255 375h0M435 385h0M445 385h0M455 385h0M465 385h0M475 385h0M485 385h0M495 385h0M505 385h0M515 385h0M525 385h0M535 385h0M545 385h0M555 385h0M775 385h0M785 385h0M795 385h0M805 385h0M815 385h0M825 385h0M835 385h0M845 385h0M855 385h0M865 385h0M875 385h0M905 385h0M915 385h0M1215 385h0M1225 385h0M1235 385h0M1245 385h0M1255 385h0M1265 385h0M1295 385h0M445 395h0M455 395h0M465 395h0M475 395h0M485 395h0M495 395h0M505 395h0M515 395h0M525 395h0M535 395h0M545 395h0M555 395h0M775 395h0M785 395h0M795 395h0M805 395h0M815 395h0M825 395h0M835 395h0M845 395h0M855 395h0M905 395h0M915 395h0M1215 395h0M1225 395h0M1235 395h0M1245 395h0M1255 395h0M1265 395h0M1275 395h0M1285 395h0M1295 395h0M1305 395h0M445 405h0M455 405h0M465 405h0M475 405h0M485 405h0M495 405h0M505 405h0M515 405h0M525 405h0M535 405h0M545 405h0M555 405h0M775 405h0M785 405h0M795 405h0M805 405h0M815 405h0M825 405h0M835 405h0M845 405h0M855 405h0M895 405h0M905 405h0M1185 405h0M1195 405h0M1205 405h0M1215 405h0M1225 405h0M1235 405h0M1245 405h0M1255 405h0M1265 405h0M1275 405h0M1285 405h0M1295 405h0M1305 405h0M1315 405h0M445 415h0M455 415h0M465 415h0M475 415h0M485 415h0M495 415h0M505 415h0M515 415h0M525 415h0M535 415h0M785 415h0M795 415h0M805 415h0M815 415h0M825 415h0M835 415h0M845 415h0M855 415h0M895 415h0M905 415h0M1175 415h0M1185 415h0M1195 415h0M1205 415h0M1215 415h0M1225 415h0M1235 415h0M1245 415h0M1255 415h0M1265 415h0M1275 415h0M1285 415h0M1295 415h0M1305 415h0M1315 415h0M445 425h0M455 425h0M465 425h0M475 425h0M485 425h0M495 425h0M505 425h0M515 425h0M525 425h0M785 425h0M795 425h0M805 425h0M815 425h0M825 425h0M835 425h0M845 425h0M1175 425h0M1185 425h0M1195 425h0M1205 425h0M1215 425h0M1225 425h0M1235 425h0M1245 425h0M1255 425h0M1265 425h0M1275 425h0M1285 425h0M1295 425h0M1305 425h0M1315 425h0M1325 425h0M435 435h0M445 435h0M455 435h0M465 435h0M475 435h0M485 435h0M495 435h0M505 435h0M515 435h0M795 435h0M805 435h0M815 435h0M825 435h0M835 435h0M845 435h0M1185 435h0M1195 435h0M1205 435h0M1215 435h0M1225 435h0M1235 435h0M1245 435h0M1255 435h0M1265 435h0M1275 435h0M1285 435h0M1295 435h0M1305 435h0M1315 435h0M1325 435h0M435 445h0M445 445h0M455 445h0M465 445h0M475 445h0M485 445h0M495 445h0M505 445h0M515 445h0M795 445h0M805 445h0M815 445h0M825 445h0M835 445h0M1185 445h0M1195 445h0M1205 445h0M1215 445h0M1225 445h0M1235 445h0M1245 445h0M1255 445h0M1265 445h0M1275 445h0M1285 445h0M1295 445h0M1305 445h0M1315 445h0M1325 445h0M435 455h0M445 455h0M455 455h0M465 455h0M475 455h0M485 455h0M495 455h0M505 455h0M795 455h0M805 455h0M815 455h0M1185 455h0M1195 455h0M1205 455h0M1215 455h0M1265 455h0M1275 455h0M1285 455h0M1295 455h0M1305 455h0M1315 455h0M1325 455h0M435 465h0M445 465h0M455 465h0M465 465h0M475 465h0M485 465h0M1285 465h0M1295 465h0M1305 465h0M1315 465h0M435 475h0M445 475h0M455 475h0M465 475h0M475 475h0M1305 475h0M1425 475h0M425 485h0M435 485h0M445 485h0M455 485h0M1305 485h0M1415 485h0M435 495h0M445 495h0M455 495h0M1405 495h0M425 505h0M435 505h0M445 505h0M1395 505h0M425 515h0M435 515h0M445 515h0M425 525h0M435 525h0M485 525h0M435 535h0M445 535h0',
    places:[
      {k:'dubai', x:941, y:219, name:'Dubai', role:'Headquarters', tz:'Asia/Dubai', text:'Where the Group is led.', addr:'804 Single Business Tower, Business Bay, Dubai, United Arab Emirates', tel:'+971 4 546 1110', img:'dubai'},
      {k:'lagos', x:733, y:294, name:'Lagos', role:'Regional hub', tz:'Africa/Lagos', text:'Close to our Clients and Partners across Nigeria and West Africa.', addr:'8 Aromire Road, Ikoyi, Lagos 106104, Nigeria', tel:'+234 902 222 2024', img:'lagos'}
    ],
    regions:[
      {k:'eu', x:760, y:124, name:'Europe'},
      {k:'us', x:340, y:170, name:'The United States'},
      {k:'as', x:1150, y:204, name:'Asia'},
      {k:'cb', x:470, y:256, name:'The Caribbean and beyond'}
    ]},

  /* The six sites, from SITES above (copied from shared/ecosystem.json). */
  sites: SITES,

  figures: [
    {n:10, s:'+', l:'years of combined experience'},
    {n:600, s:'+', l:'Client engagements'},
    {n:2000, s:'+', l:'individuals served'},
    {n:20, s:'+', l:'countries with relationships'},
    {n:100, s:'+', l:'strategic relationships'}
  ],

  ambitions: [
    ['Live','Where the family can live, travel, study and settle.'],
    ['Build','A business, a career or a presence in a new market.'],
    ['Structure','How assets, companies and the family are organised.'],
    ['Invest','Property and opportunities that fit the plan.'],
    ['Protect','Security for what you have built, and who you love.'],
    ['Experience','The access and ease that come with a wider life.']
  ],

  steps: [
    ['One conversation','Tell us about your family and your plans once. No forms, no pressure, and no decision on the first call.'],
    ['The right house','Your Relationship Manager brings in each house, and qualified specialists, when they are needed. Never before.'],
    ['One person, for the long term','One named person stays with you after the paperwork is done: renewals, property, the next family member.']
  ],

  will: ['Tell you plainly what is possible, and what is not.','Give honest timelines, and update them as things move.','Give you one named Relationship Manager.','Keep private matters private.','Stay after the paperwork is done.'],
  never: ['Guarantee an outcome that a government decides.','Claim influence with, or shortcuts through, any government.','Give regulated advice without a qualified specialist.','Share your information beyond what a service needs.','Rush you into a decision.'],

  values: [
    ['Plain speaking','We explain the process before we talk about outcomes, so you always know where you stand.'],
    ['Everything in writing','Options, costs and timelines are set out in writing, option by option, before you decide.'],
    ['One named person','One Relationship Manager across every house. You never have to explain your family twice.'],
    ['Discretion','Private matters stay private. Information is shared only where a service requires it.'],
    ['For the long term','The relationship carries on after the application: renewals, property and the next chapter.']
  ],

  leadership: [
    {name:'Zaid Al Hindi', initials:'ZA', role:'Founder and Group Chief Executive Officer', area:'Imperial Holdings Group', img:'zaid'},
    {name:'Hekma Iskandarani', initials:'HI', role:'Group Chief Operating Officer', area:'Imperial Holdings Group', img:'hekma'},
    {role:'Divisional leadership', area:'Citizenship, Private Office, Partners Club, Academy and Real Estate'}
  ],

  contact: {email:'info@imperialholdingsgroup.com', offices:[
    {city:'Dubai', role:'Headquarters', lines:['804 Single Business Tower','Business Bay, Dubai','United Arab Emirates'], tel:'+971 4 546 1110', tz:'Asia/Dubai'},
    {city:'Lagos', role:'Regional hub', lines:['8 Aromire Road, Ikoyi','Lagos 106104','Nigeria'], tel:'+234 902 222 2024', tz:'Africa/Lagos'}
  ]},

  divisions: [
    {
      key:'citizenship', name:'Imperial Citizenship', tag:'Global mobility. Greater possibilities.', short:'Citizenship', logo:null, img:'citizenship', status:'The flagship', statusTone:'gold',
      line:'Second residency and citizenship by investment, from first conversation to completed application.',
      intro:'Imperial Citizenship is where the Group began, and it remains our main business. It advises families and founders on second residency and citizenship by investment, and carries each application from the first conversation to completion.',
      card:'Our flagship house. Residency and citizenship by investment, compared side by side and carried from first conversation to completed application.',
      bullets:['Citizenship by investment','UAE and European residency','Global mobility strategy'],
      does:[
        ['Caribbean citizenship','Citizenship by investment, for example Saint Kitts and Nevis and Grenada.', 'Full programme list to confirm'],
        ['UAE residency','Long-term residency routes, including property-linked options in Dubai, together with Imperial Real Estate.'],
        ['European residency','Residency routes in Europe.', 'Approved European programmes to confirm'],
        ['Global Mobility Strategy','Advisory for families planning across several countries at once.'],
        ['UAE business set-up','Advisory for founders establishing a presence in the UAE.']
      ],
      who:['Families who want more choices for their children.','Founders who need a regional base and a clear structure behind it.','Families who travel often and are tired of planning their lives around visas.'],
      howTitle:'Five steps, said plainly.',
      how:[['Listen','A first conversation about your family and your plans. No forms, no pressure.'],['Compare','Your options side by side: what each requires, costs and usually takes, in writing.'],['Plan','One route, one timeline, one named person responsible for it.'],['Apply','A complete, accurate application, with every specialist coordinated for you.'],['Stay','Renewals, property, the next family member. The relationship carries on.']],
      includes:['Eligibility review','Options in writing','Full cost schedule','Honest timeline','Document checklist','Application quality check','Specialists coordinated','Aftercare'],
      note:'Final approval always rests with the relevant government. We tell you that at the start, and keep you informed at every stage.',
      cta:siteCta('citizenship', 'Visit imperialcitizenship.com')
    },
    {
      key:'partners-club', name:'Imperial Partners Club', tag:'A global network for growth. Together further.', short:'Partners Club', logo:'IPC', img:'partners', status:'For professionals', statusTone:'ink',
      line:'The network of lawyers, bankers, wealth advisers and family offices who introduce families to us.',
      intro:'Imperial Partners Club is our Partner network across industries, from introducers to advisers to service-line Partners. Lawyers, bankers, wealth advisers and family offices are often the first people a Client asks about living or investing abroad. Partners Club is the house they can hand that conversation to.',
      card:'Our Partner network across industries: introducers, advisers and service-line Partners. Your Client stays your Client.',
      bullets:['Introducers','Advisers','Service-line Partners'],
      does:[
        ['Clear written terms','Your Partner Agreement sets out exactly how introductions work.'],
        ['Transparent reporting','See where each introduction stands, without having to chase.'],
        ['Training and certification','Imperial Academy helps your team explain the options accurately.'],
        ['Approved materials','Client-ready guides and wording, checked against an approved claims list.'],
        ['One named contact','A dedicated person for Partners, who knows your practice.'],
        ['The whole Group','Citizenship, residency, Dubai property and family planning, through one door.']
      ],
      who:['Introducers who are often asked about life and investment abroad.','Advisers: lawyers, private bankers, wealth advisers and family offices.','Service-line Partners who deliver specialist work for Imperial Clients.'],
      howTitle:'Four steps. No surprises.',
      how:[['Introduce','Share your Client\u2019s details, with their permission, through one simple form.'],['We advise','A Relationship Manager meets your Client and explains their options plainly.'],['You stay informed','Clear updates on each introduction, at every stage.'],['Outcome','Terms are honoured exactly as set out in your written agreement.']],
      standards:['Partners do not act or sign on the Group\u2019s behalf.','We never guarantee citizenship, visa, residency, investment or tax outcomes.','We claim no influence with, or shortcuts through, any government.','Client information is shared only with consent, and only where a service needs it.','Every Client-facing document is checked against an approved claims list.','Regulated advice is given only by qualified specialists.'],
      note:'Your reputation travels with ours. Every Partner agrees to these standards, and so do we.',
      cta:siteCta('partners-club', 'Visit the Partners Club website')
    },
    {
      key:'private-office', name:'Imperial Private Office', tag:'Personalised solutions for exceptional clients.', short:'Private Office', logo:'IPO', img:'private-office', status:'For existing Clients', statusTone:'ink',
      line:'One lasting relationship for families with multi-country lives.',
      intro:'Imperial Private Office looks after Imperial Clients once their first service is complete. It is a single point of contact for the wider needs of a multi-country family, delivered through trusted Partners and qualified specialists.',
      card:'A concierge for our existing Clients: relocation, schools, structuring, banking and introductions, through one point of contact.',
      bullets:['Relocation and schools','Holding companies and structuring','Private banks and private equity'],
      does:[
        ['Relocation','Moving the household, and settling in well, wherever the family chooses to live.'],
        ['Schools','Finding the right schools for the children, near the right home.'],
        ['Holding companies','Company formation and the structure behind a family\u2019s interests.'],
        ['Tax residency and structuring','Coordinated with qualified tax and legal specialists.'],
        ['Private banks and private equity','Introductions to the institutions that fit the plan.'],
        ['Events and introductions','Access to the people and occasions that come with a wider life.']
      ],
      who:['Existing Imperial Clients and their families.','Completed Imperial Citizenship Clients, who may be invited to join.','Families whose lives, assets and businesses span several countries.'],
      howTitle:'One point of contact. Many specialists.',
      how:[['Your contact','One named person who knows your family and your history with Imperial.'],['Your request','Tell us what you need. We record it properly and find the right specialist.'],['Delivered through Partners','Trusted Partners and qualified specialists carry out the work.'],['Followed through','We stay with it until it is done, and note what comes next.']],
      note:'Advice on regulated matters such as tax, legal or investment is provided only by appropriately qualified specialists.',
      cta:siteCta('private-office', 'Visit the Private Office website')
    },
    {
      key:'real-estate', name:'Imperial Real Estate', tag:'Curated properties. Enduring value.', short:'Real Estate', logo:'IR', img:'real-estate', status:'Coming soon', statusTone:'soon', soon:true,
      line:'Licensed property advisory, starting with Dubai.',
      intro:'Imperial Real Estate will offer licensed property advisory, starting with Dubai: search, selection and purchase support, through to handover. It will work alongside Imperial Citizenship where property and residency meet.',
      card:'Licensed property advisory, starting with Dubai: search, selection and purchase support. Not yet launched.',
      bullets:['Dubai residential','Search and selection','Purchase support'],
      does:[
        ['Search','A considered search for the right home, near the right schools.'],
        ['Selection','A clear comparison of the options that fit the plan.'],
        ['Purchase support','Support through the purchase, through to handover.'],
        ['Property and residency','Coordinated with Imperial Citizenship where a property links to UAE residency.']
      ],
      who:['Imperial Clients choosing a home in Dubai.','Families whose residency plans include property.','Selected direct buyers.'],
      note:'Imperial Real Estate is licensed and has not yet launched. Licence details will be published at launch.',
      cta:null
    },
    {
      key:'academy', name:'Imperial Academy', tag:'Education. Talent. Leadership. A stronger tomorrow.', short:'Academy', logo:'IA', img:'academy', status:'Learning and standards', statusTone:'ink',
      line:'Learning, training and certification for the people who do this work.',
      intro:'Imperial Academy is the Group\u2019s learning and education arm. It trains and certifies our own people in one shared standard, and helps Partner teams explain the options accurately. Courses for a wider audience will follow later.',
      card:'Our learning arm. Training and certification for our people and our Partners, so every conversation meets one standard.',
      bullets:['Team training','Partner Academy','Certification'],
      does:[
        ['One shared standard','Every role learns the same institution before specialising: how we work, how we protect Client and Partner trust, and how we keep information private.'],
        ['Role certification','People are certified as ready before they take on greater responsibility.'],
        ['Partner Academy','Training that helps Partner teams explain the options accurately and use approved materials.'],
        ['Future talent','A route into the Group for high-potential people, selected on ability and character.', 'Programme details and launch timing to confirm'],
        ['Wider courses','Learning for selected external audiences, later.', 'Scope and timing to confirm']
      ],
      who:['Our own team, across every house.','Imperial Partners and their teams.','In time, candidates and selected external learners.'],
      howTitle:'Learn the house. Then specialise.',
      how:[['Learn','The common Imperial core: standards, discretion and how the houses work together.'],['Practise','Realistic cases, not only multiple-choice tests.'],['Certify','Readiness is demonstrated before responsibility is given.'],['Grow','Development continues as people take on more.']],
      note:'Academy certification is internal to Imperial. It is not a replacement for professional licensing.',
      cta:siteCta('academy', 'Visit the Academy website')
    }
  ],

  insights: [
    {slug:'before-a-first-conversation', cat:'Mobility', img:'citizenship', title:'Six things worth thinking about before a first conversation',
     dek:'You do not need any documents to begin. A little thought about six questions helps us give you useful options straight away.',
     body:[
      ['p','Nobody arrives wanting a visa for its own sake. They arrive wanting a different next chapter. A little thought about the questions below helps a first conversation move quickly to options that fit.'],
      ['h','Your family'],['p','Who would be included, and their ages.'],
      ['h','Where you are now'],['p','Where you live, work and hold citizenship today.'],
      ['h','What you want'],['p','Which of the six ambitions matter most, and why: live, build, structure, invest, protect or experience.'],
      ['h','A budget range'],['p','A rough range is enough. We will show what fits.'],
      ['h','Your timing'],['p','Any dates that matter: school terms, a move, a company launch.'],
      ['h','Your history'],['p','Any past applications or refusals. Being open helps us help you.'],
      ['q','Not sure about some of them? That is what the first conversation is for.']
     ]},
    {slug:'explain-your-family-once', cat:'Private Office', img:'private-office', title:'Why a multi-country family needs one point of contact',
     dek:'When the residency, the home, the company and the school are handled by different people, the family becomes the coordinator. It should be the other way round.',
     body:[
      ['p','A family that lives across borders rarely has one question. The residency touches the home; the home touches the school; the company touches the tax position. Handled separately, each adviser sees a slice and the family carries the whole.'],
      ['h','One table'],['p','Imperial\u2019s houses sit at one table, so the person advising on your residency already knows about the home, the company and the school.'],
      ['h','One person'],['p','One Relationship Manager brings each house in when it is needed, and qualified specialists for regulated matters such as tax, legal and investment.'],
      ['q','You never have to explain your family twice.']
     ]},
    {slug:'your-client-stays-your-client', cat:'Partners', img:'partners', title:'Your Client stays your Client: how introductions work',
     dek:'For lawyers, bankers, wealth advisers and family offices, an introduction should protect the relationship, not put it at risk.',
     body:[
      ['p','Professional advisers are often the first people a Client asks about living or investing abroad. The question is who to hand that conversation to without worrying about it.'],
      ['h','Four steps'],['p','Introduce, with your Client\u2019s permission, through one simple form. A Relationship Manager meets your Client and explains their options plainly. You receive clear updates at every stage. Terms are honoured exactly as set out in your written agreement.'],
      ['h','Shared standards'],['p','We never guarantee citizenship, visa, residency, investment or tax outcomes, and we claim no influence with any government. Every Client-facing document is checked against an approved claims list.'],
      ['q','Your reputation travels with ours.']
     ]},
    {slug:'everything-in-writing', cat:'Our standard', img:'academy', title:'What \u201ceverything in writing\u201d means in practice',
     dek:'Before you decide anything, you should be able to see every option, its costs and its timeline side by side.',
     body:[
      ['p','Programmes, costs and timelines are set by governments and change over time. That is why every plan we prepare is confirmed in writing for your family before you decide.'],
      ['h','What every plan includes'],['p','An eligibility review; options compared side by side in plain language; a full, itemised cost schedule; an honest timeline, updated as things move; a document checklist; a quality check before anything is submitted; specialists coordinated for you; and aftercare.'],
      ['h','The small print, said plainly'],['p','Final approval always rests with the relevant government. We tell you that at the start, and keep you informed at every stage.']
     ]}
  ],

  /* aud = the audience each enquiry type belongs to (clients, partners, institutions): used for qualification on
     the site and for the Pipedrive assignment in netlify/functions/submission-created.js */
  enquiry: [
    {v:'citizenship', l:'Citizenship or residency for my family', to:'citizenship', aud:'clients'},
    {v:'private-office', l:'Ongoing support as an existing Imperial Client', to:'private-office', aud:'clients'},
    {v:'partners-club', l:'Becoming a Partner, or introducing a Client', to:'partners-club', aud:'partners'},
    {v:'academy', l:'Training, learning or careers', to:'academy', aud:'partners'},
    {v:'real-estate', l:'Property in Dubai', to:'real-estate', aud:'clients'},
    {v:'group', l:'A strategic or institutional enquiry', to:'group', aud:'institutions'}
  ]
  ,
  /* House finder. Weights are a guide drawn from what each house does (see divisions[].does), not advice. */
  finder: {
    personas: [
      {k:'family', l:'A family', s:'Planning where to live, study and settle', w:{citizenship:3}},
      {k:'founder', l:'A founder', s:'Building a business or a regional base', w:{citizenship:2,'private-office':1}},
      {k:'client', l:'An existing Imperial Client', s:'Looking for what comes next', w:{'private-office':5}},
      {k:'adviser', l:'A lawyer, banker or adviser', s:'With Clients who ask about life abroad', w:{'partners-club':8}},
      {k:'learner', l:'Interested in learning or a career', s:'Training, certification or joining us', w:{academy:8}}
    ],
    goals: {
      live:{citizenship:3,'private-office':2,'real-estate':1},
      build:{citizenship:2,'private-office':2},
      structure:{'private-office':3,citizenship:1},
      invest:{'real-estate':3,'private-office':2},
      protect:{citizenship:3,'private-office':1},
      experience:{'private-office':3}
    },
    why: {
      citizenship:{_:'Second residency and citizenship by investment, compared side by side.', live:'Residency and citizenship routes for the whole family.', build:'UAE business set-up advisory and a regional base.', structure:'A Global Mobility Strategy across several countries.', protect:'A second citizenship or residency as a lasting option.', experience:'Fewer visas to plan a life around.'},
      'private-office':{_:'One point of contact for a multi-country family.', live:'Relocation, and the right schools near the right home.', build:'Holding companies and company formation.', structure:'Tax residency and structuring, with qualified specialists.', invest:'Introductions to private banks and private equity.', protect:'Structuring coordinated with tax and legal specialists.', experience:'Events and introductions that come with a wider life.'},
      'partners-club':{_:'Introduce a Client with clear written terms. Your Client stays your Client.'},
      academy:{_:'Training and certification in one shared standard.'},
      'real-estate':{_:'Licensed property advisory in Dubai, launching soon.', live:'A family home in Dubai, near the right schools.', invest:'Search, selection and purchase support in Dubai.'}
    }
  },

  /* Programme fit check (citizenship page). Five short questions about the person's own situation. It decides nothing and
     promises nothing: the answers prefill the enquiry card (for_whom, timeline, budget, country) and travel to Pipedrive as
     quiz_answers with lead_source programme-fit. Options with "from" use the fixed timeline and budget lists in app.js. */
  fit: {
    eyebrow:'Programme fit check', title:['Five questions.','A clearer first conversation.'],
    lead:'Nothing here decides anything. Your answers simply prefill your enquiry, so the first conversation starts in the right place.',
    questions:[
      {k:'who', q:'Who would be included?', opts:[
        {v:'myself', l:'Just me', set:{for_whom:'myself'}},
        {v:'partner', l:'My partner and me', set:{for_whom:'family'}},
        {v:'family', l:'My family, including children', set:{for_whom:'family'}},
        {v:'client', l:'A client I am introducing', set:{for_whom:'client'}}
      ]},
      {k:'where', q:'Where do you live today?', opts:[
        {v:'uae', l:'In the United Arab Emirates', set:{country:'United Arab Emirates'}},
        {v:'nigeria', l:'In Nigeria', set:{country:'Nigeria'}},
        {v:'africa', l:'Elsewhere in Africa'},
        {v:'world', l:'Elsewhere in the world'}
      ]},
      {k:'matters', q:'What matters most right now?', ambitions:['Live','Build','Invest','Protect']},
      {k:'timeline', q:'When would you like to begin?', from:'timeline'},
      {k:'budget', q:'Is there a budget in mind?', from:'budget', skip:'I would rather not say yet'}
    ],
    done:{title:'Thank you.', text:'Your enquiry below has been prefilled from these answers. Add your name, your email and a few lines, and the right person will reply.', cta:'Go to your enquiry'}
  },

  /* Downloadable guide (citizenship page). The file itself is config.guide.file; while it is empty the page shows config.guide.tbc. */
  guideCopy: {
    eyebrow:'The guide', title:['A short guide,','before you decide.'],
    lead:'Leave your name and email and we will send you the guide, written in the same plain language as this site.',
    cta:'Send me the guide', note:'We use these details only to send the guide, and to reply if you ask us to.',
    ready:'Your copy of the guide is ready below. One person will be in touch only if you would like a conversation.',
    soon:'The guide is being finalised. The team will send it to you by email as soon as it is ready.'
  },

  /* Legal pages (v5 trust, brief section 8). The privacy notice says what the forms collect, where it goes, how long it is
     kept and how to ask for a copy or for deletion, so that counsel reviews it rather than writes it. Tokens in the copy:
     [[text]] renders the amber TO CONFIRM placeholder, {email} the group mailbox from contact.email, and {offices:true}
     both office addresses. Every TO CONFIRM below is listed for counsel in docs/PRIVACY-NOTES.md. The terms page stays a
     placeholder until counsel drafts it. Never name a law here that has not been confirmed to apply. */
  legal: {
    updated: '',   /* TO CONFIRM: date of the version approved by counsel; shown under the notice when set */
    privacy: {
      title: 'Privacy notice',
      lead: 'What we collect when you write to us, where it goes, how long we keep it, and how to ask for a copy or for deletion. Written plainly, so it can be read in a few minutes.',
      sections: [
        {h:'Who we are', body:[
          'This website is published by Imperial Holdings Group, the parent of Imperial Citizenship, Imperial Private Office, Imperial Partners Club, Imperial Academy and Imperial Real Estate, with offices in Dubai and Lagos.',
          'The entity responsible for your information, the data controller, is [[Legal entity, registered address and data controller]]. In this notice, we and us mean that entity.'
        ]},
        {h:'What we collect', body:[
          'You can read this site without giving us any information about yourself. We collect personal information only when you send it to us through one of our forms: the enquiry card, the three step contact form, the Imperial Real Estate register interest form and the request for the citizenship guide.',
          {lead:'Depending on the form, we ask for:', ul:[
            'your name and email address;',
            'your telephone number, if you choose to give it;',
            'your country of residence, and your nationality or nationalities;',
            'whether you are writing as a private client, a professional partner or an institution, and who the enquiry is for: yourself, your family or a client you are introducing;',
            'what it concerns, which tells us which of our divisions should reply;',
            'when you would like to begin, and a budget range if you choose to give one;',
            'for Partners Club enquiries, your firm and your profession;',
            'for property enquiries, what you are looking for, whether you wish to buy or rent, and the area that interests you;',
            'how you would prefer to be contacted;',
            'if you came to the form from the house finder, the ambitions you chose there;',
            'your message, and your agreement to this notice.'
          ]},
          'Each form also records, without asking you, where the enquiry came from: the page you sent it from, the page you first arrived on, the site that referred you, and any campaign tags in the address you arrived by (utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid and ttclid), together with which of our forms and sites the enquiry came through. We use these to see which of our channels brought you to us. They describe a channel, not you, and we do not join them to any advertising profile.',
          'The programme fit check on the Imperial Citizenship page keeps your five answers with your enquiry, so that the first conversation starts in the right place. Nothing is kept unless you then send the form.',
          'If you ask us to verify your telephone number after sending a form, we send a one time code by WhatsApp or SMS and record whether it was entered. This step is optional. Your enquiry reaches us either way.',
          'Our forms include a hidden field that only automated software fills in. We use it to reject spam, and for nothing else.',
          'Our systems note the network address (the IP address) a form was sent from, so that one connection cannot flood us with submissions. When the Cloudflare Turnstile spam check is switched on, Cloudflare also receives that address, to tell a person from automated software. [[Whether Turnstile is switched on at launch]]',
          'What you type into a form is kept in your own browser until the form is sent or you choose Start afresh, so that nothing is lost if the page reloads. It stays on your device and reaches us only when you press send. For the current visit only, your browser also keeps the campaign tags described above and a note that you have seen the opening animation.'
        ]},
        {h:'Where it goes', body:[
          'Your enquiry goes first to Netlify, the company that hosts this website, which keeps a copy in its form inbox, and from there to Pipedrive, the customer relationship system we use, where it is stored. It is assigned to one named person in the relevant Imperial team: Imperial Citizenship, Imperial Private Office, Imperial Partners Club, Imperial Academy, Imperial Real Estate or the Group team. If you have written to us before, the new enquiry is added to your existing record rather than creating a second one.',
          'Two further providers are used only when those features are switched on: an email provider, to send you a short confirmation of your enquiry, and a telephone verification provider, to send the one time code. Each receives only what its task needs: your name and email address for the confirmation, your telephone number for the code. [[Email provider (Resend in the current build) and telephone verification provider (Twilio Verify in the current build), and whether each is switched on at launch]]',
          'We do not sell your information, and we do not share it with anyone for their own marketing. Within the Group it is seen only by the people who need it to answer you. Where a service is delivered by one of our trusted Partners, we share what that service needs, and only with your agreement.',
          'Our offices are in the United Arab Emirates and Nigeria. The providers named above may store information outside the country you live in. [[Where each provider stores data, and the safeguards that apply, to be confirmed by counsel]]'
        ]},
        {h:'How long we keep it', body:[
          'We keep your enquiry for [[Retention period, for example 24 months]] after our last contact with you, and then delete it, unless you have become a client, in which case your record is kept for as long as the relationship lasts and for any period the law requires afterwards.'
        ]},
        {h:'Your choices and your rights', body:[
          'You can ask us at any time to send you a copy of the information we hold about you, to correct it, to delete it, or to stop contacting you. Write to {email} [[Dedicated privacy mailbox]] and we will reply promptly.',
          'You can withdraw your agreement to this notice at any time by writing to the same address. This does not affect anything done before you withdrew it.',
          'If you ask us to delete your information, we remove it from our systems and ask our providers to do the same, unless the law requires us to keep it, in which case we will tell you.',
          'Depending on where you live, the law may give you further rights, including the right to complain to a supervisory authority. [[Applicable data protection law and supervisory authority for each office, to be confirmed by counsel]]'
        ]},
        {h:'Analytics and cookies', body:[
          'This site sets no advertising cookies and no cookie that follows you to other sites, so there is no cookie banner.',
          'When our analytics are switched on, they run in a cookie-free configuration: nothing is stored on your device, the service is asked not to keep your network address, and we see counts of visits and of which pages and buttons were used, not who you are. [[Analytics provider (Google Analytics 4, cookie-free, in the current build) and whether it is switched on at launch]]',
          'The only things this site stores on your device are the form drafts and the two visit values described above. They exist for your convenience and reach us only as part of a form you choose to send.',
          'Where a video appears on this site, the player loads only when you press play, in its do-not-track mode. The video host then receives your network address, as any website you visit does. Links to WhatsApp and to our booking pages take you to those services, which have their own privacy terms.'
        ]},
        {h:'Security', body:[
          'We keep your information on systems that only authorised people can reach, and we limit it to the people who need it. No system is perfectly secure. If we learn of a breach that affects your information, we will tell you.'
        ]},
        {h:'Children', body:[
          'This site is not aimed at children, and we do not knowingly collect information from anyone under 18.'
        ]},
        {h:'Changes to this notice', body:[
          'If this notice changes, the new version will be published on this page with the date it took effect. [[Date of the version approved by counsel]]'
        ]},
        {h:'How to contact us', body:[
          'Write to {email} [[Dedicated privacy mailbox]], or to either office.',
          {offices:true}
        ]}
      ]
    },
    terms: {
      title: 'Terms of use',
      lead: null,
      sections: [
        {h:'About this website', body:['This website is for information only and is not an offer or advice. Advice on regulated matters such as tax, legal or investment is provided only by appropriately qualified specialists.']},
        {h:'No guarantees', body:['Imperial does not guarantee government decisions or outcomes. Final approval of any citizenship or residency application rests with the relevant government.']},
        {h:'Use of this site', body:['You may read and share what is published here for your own information. The text, photographs, logos and marks belong to Imperial Holdings Group or to those who licensed them to us. [[Full terms of use, to be drafted by counsel]]']},
        {h:'Governing law', body:['These terms are governed by the law of [[Jurisdiction to confirm]].']}
      ]
    }
  },

  /* Questions every house hears. Every answer restates something already said on this site. */
  faq: [
    {q:'Do I need any documents for a first conversation?', a:'No. The first conversation is for listening. It helps to think about who would be included, where you live and hold citizenship today, a rough budget and any dates that matter, but nothing needs to be prepared.', to:'/insights/before-a-first-conversation', tl:'Six things worth thinking about'},
    {q:'Will I have to deal with several people across the houses?', a:'No. One Relationship Manager is your point of contact across every house, and brings each one in when it is needed. You never have to explain your family twice.'},
    {q:'Can you guarantee that an application will be approved?', a:'No one honestly can. Final approval of any citizenship or residency application always rests with the relevant government. We tell you that at the start, and keep you informed at every stage.'},
    {q:'Do you give tax, legal or investment advice?', a:'Advice on regulated matters such as tax, legal or investment is given only by appropriately qualified specialists. Your Relationship Manager coordinates them for you.'},
    {q:'What happens to the information I share?', a:'It is used to respond to you, kept in our customer relationship system, and shared only where a service requires it. Private matters stay private. You can ask for a copy, or for deletion, at any time.', to:'/privacy', tl:'Privacy notice'},
    {q:'I am a lawyer, banker or wealth adviser. Can I introduce a Client?', a:'Yes, through Imperial Partners Club. Your Partner Agreement sets out exactly how introductions work, you receive clear updates at every stage, and your Client stays your Client.', to:'/divisions/partners-club', tl:'Imperial Partners Club'},
    {q:'Is Imperial Real Estate open yet?', a:'Not yet. Imperial Real Estate is licensed and has not launched. You can register your interest and we will contact you when it opens.', to:'/divisions/real-estate', tl:'Register interest'},
    {q:'Where are you based?', a:'Our headquarters is in Dubai, with a regional hub in Lagos and relationships with Partners, advisers and specialists in more than 20 countries.'}
  ]
};
})();

# Restrained event photography plan (v6, deliverable 5)

The Founder's mandate (docs/BRAND-BRIEF.md, sections 3 and 6): remove the people-focused photograph from the home page hero and replace it with an elegant architectural, cinematic or abstract visual that communicates international perspective and permanence; no excessive gold, no handshake imagery, no artificial wealth symbolism, no cliched luxury visuals; three to four genuine Imperial event photographs further down the home page; a separate curated events and Journal experience; leadership photographs on About, not the home page; event photography published with editorial restraint and appropriate permissions; credibility through substance, not spectacle.

This plan changes nothing in the repository. It names the files and keys to change, the order to change them in, and what each decision rests on. Where a fact is not known it says To confirm. The hero renders that go with it are in the `hero/` folder beside this file; the comparison sheet is `hero/compare-all-candidates.webp`.

Basis: every base image under `assets/img` (56 of the 86 files; the other 30 are the `-m`, `-c` and `cover-p` crops of the same frames), the photo registry in `assets/js/data.js`, `V.home` in `assets/js/app.js`, docs/PHOTO-SHOT-LIST.md, docs/CONTENT-AUDIT.md, docs/REPORT.md, the four earlier hero files recovered from git history (in `history/`, read only), and a read-only listing of the MarketingTeam SharePoint folder Shared Documents/Events (folder names and file counts only).

## 1. Principles

1. **Editorial restraint.** A photograph appears only where it says something a sentence cannot: that the event happened, that the office exists, that the people leading the Group are real. One photograph that does this is worth more than a grid of six. Nothing is decorative; no bokeh, banners or city views used as wallpaper.
2. **Permissions first.** No identifiable guest appears on the public site until that person has agreed, and the agreement is recorded (section 8). The consent gate in `app.js` (`photoAllowed`) already enforces the flag; the plan makes the flag true only on evidence. The preview switch (`BUILD_PREVIEW=1`) is for the Founder's review only and is never set on the production build.
3. **No symbolism.** Nothing on any page that stands for wealth, status or luxury rather than for the Group: no aircraft, yachts, cars, penthouses, towers shot from below, libraries, colonnades, clouds, gold skies or gold light. No handshakes, no raised glasses on the home page, no awards or trophies, no printed banners or sponsor walls as the subject of a frame, no posed line-ups of more than four people, no gestures to the camera. The two cities appear as cities, in restrained light.
4. **Own photographs only, with two interim exceptions.** Every photograph on the site is Imperial's own (`own:true`) and of a real Imperial event, office or person. There is no genuine own architectural photograph in the repository or its history today (section 3), so the two credited Unsplash photographs already licensed (`dubai`, `real-estate`) may stand in with their credit lines until the city shoot delivers; the seven generated scenes marked `placeholder:true` may not, because they are the cliches the brief forbids. Nothing is generated for the site again.
5. **One frame per idea, one idea per page.** The limits per page in section 7 are maximums. Fewer is always acceptable; a typographic block is the fallback everywhere, never a substitute photograph.
6. **Captions tell the truth and name nobody.** Every published frame carries what it shows, where and when (as far as the facts are confirmed in `data.js`). Guests are not named unless they have agreed in writing to be named. Captions describe the occasion, not a guest's clothes.
7. **Accuracy of the registry.** The `what` field is the caption and the alt text source; it must describe the frame. Two corrections are listed in section 6.

## 2. Home page

### 2.1 The hero: ranked candidates

The brief wants architectural, cinematic or abstract. Every own hero file today is an event frame with guests (`hero`, `hero-night`), a crop of stage lights (`hero-lights`) or a generated scene. The candidates below are the only honest options from files that exist. Each was rendered at 1600 x 900 and 720 x 960 and as a 1440 x 700 mock under the site's own scrim with the proposed headline (`hero/`). The grading recipe for each is in `render.py` beside this file so the build can reproduce it; production exports should be 1920 x 1080 and 900 x 1125 from the same crops, WebP, under 200 KB (the sizes docs/PHOTO-SHOT-LIST.md sets).

| Rank | Candidate | Source file | Crop | Treatment | Why | Against |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **Dubai skyline as a silhouette** | `assets/img/dubai.webp` (2200 x 1375; Unsplash, Anoof C, id 7Zt3XXXp3II; `own:false`, credit shown in the footer) | Landscape: full width, rows 137 to 1375 (the sky kept, the foreground water cropped). Portrait: columns 650 to 1681, full height, so the tallest tower sits right of centre under the headline. | Colour reduced to 42 per cent, brightness to 78 per cent, 16 per cent blend to ink, red channel x 0.90 and blue x 1.08. The sunset becomes a cool dusk and the skyline reads as a silhouette on water; the gold goes out of it. | A real photograph of the city the Group is led from, with no people in it. It reads as permanence and perspective; the silhouette sits under the headline and the water carries the supporting copy. Loads at 13 KB at 1600 x 900. | Not our own frame: the credit line stays until the shoot replaces it. The hero is then a licensed photograph of a famous skyline, which is honest but generic until replaced. |
| 2 | **The coast from above** | `assets/img/real-estate.webp` (1920 x 1200; Unsplash, Nejc Soklič, id dYLzGcPqrtE; `own:false`) | Landscape: full width, rows 60 to 1140. Portrait: columns 550 to 1450, full height. | Colour 62 per cent, brightness 80 per cent, 12 per cent ink, red x 0.96, blue x 1.03: a restrained teal, no gold. | An aerial says international perspective literally, and the sea and the city together say the two-city idea without a map. | Palm Jumeirah is a property and tourism icon, which brushes the cliche rule; the same photograph opens the Real Estate page, so the home page would repeat it; busy under the headline (see the mock). |
| 3 | **Own abstract: the gala lights** | `assets/img/events/gala-dinner-lagos/01.webp`, top band only (no guest in the crop) | Landscape: columns 0 to 933, rows 0 to 525, then a 7 px Gaussian blur. Portrait: columns 300 to 690, rows 0 to 520, 4 px blur. | Colour 40 per cent, brightness 70 per cent, 22 per cent ink, red x 0.92, blue x 1.06: cool grey-blue points of light on ink. | Our own frame, no credit, no consent needed because no person is in the crop; abstract and quiet; it never dates. | It is a defocused LED wall. It says nothing about place or the Group, and it is in effect the current `hero-lights` fallback the brief is moving away from. Use only if the Founder wants no city at all. |
| Alt. | **No photograph: the map on ink** | None. Built from `D.map.path` (the dotted world already in `data.js`) on the ink field with the Dubai and Lagos points joined by one thin arc. | Rendered here as an image for comparison; on the site it should be inline SVG in `app.js`, not an image file. | 1440 x 700 ink field with a soft lift top right, dots at 18 per cent, two gold points, one arc. | No cliche is possible; it carries "Two Cities. One Horizon." visually; weighs a few kilobytes; needs no consent, credit or shoot. | It is a diagram, not a photograph; on its own it can feel like a cover for having no imagery. Best as the mobile and reduced-motion fallback and as the 404 and closing band treatment. |

Recommendation: candidate 1 as the interim hero, with the ink map as the mobile fallback and the closing band, and the shoot's "Business Bay at dusk from our side of it" (docs/PHOTO-SHOT-LIST.md, Map Dubai and Home hero rows) as the permanent replacement. The night crossfade layer (`hero-night`) is dropped: there is no honest second frame of the same scene, and a crossfade adds motion the brief asks to avoid. If the Founder prefers no licensed photograph on the home page at all, the alternative stands on its own until the shoot.

Registry changes when the build phase implements this: `hero` becomes `{key:'hero', own:false, consent:true, id:'7Zt3XXXp3II', by:'Anoof C', src:'Unsplash', what:'Dubai at dusk'}` with new `hero.webp` and `hero-m.webp` exported from the crops above; `D.hero.night` and `D.hero.fallback` go, and `tbc` stays as 'Final hero photo' until the shoot. `og.jpg` is derived from the hero and is regenerated with it.

### 2.2 The three to four event photographs

One strip, after the Our Network block and before the Selected events cards, titled along the lines of "From our events" (final wording with deliverable 4), four frames in a row at 4:5, each with a one-line caption and the event's date and city, the strip linking to the Journal. The strip is the only place event photographs appear on the home page. Chosen for what each says, from four different events and both cities, no frame showing more than two identifiable people:

| Slot | Frame | What it shows | What it says | Alternate |
| --- | --- | --- | --- | --- |
| 1, the room | `events/gala-dinner-lagos/01` | A speaker at the lectern at the gala dinner, Lagos | The Group addresses a room: substance, not spectacle. | `events/gala-dinner-lagos/04` (guests in conversation in the ballroom; the old 04, at the sponsor backdrop, is removed: it shows visa prices) |
| 2, Dubai | `events/grenada-51-dubai/03` | A guest arriving through the bar entrance at the Dubai EDITION, Grenada's 51st Independence Day after party, 19 February 2025 | The Dubai event, and the one event with a documented source (the press release). | `events/grenada-51-dubai/02` (a guest at the flag wall) |
| 3, relationships | `events/delborough-dinner/04` | Guests greeting one another at DANI, The Delborough Hotel, Lagos | Relationship-led, without a handshake framing. | `events/delborough-dinner/05` (a guest talking with guests at their table) |
| 4, the office | `events/lagos-office-event/05` | Two guests seated in the lounge at the Lagos office, 8 Aromire Road, Ikoyi | The office itself as evidence that it exists and is used. | `events/lagos-office-event/06` (one guest on the sofa) |

All four, and all four alternates, are `consent:false` today. Until consent is recorded for a slot, that slot is not filled with a substitute photograph: the strip shows the frames that are cleared and the uncleared slots are typographic cards (event title, date, city, a line of text) with no image. Three cleared frames and one card is acceptable; two or fewer and the strip is held back and the Selected events cards carry the section alone. Never the generated scenes, never the stage lights, never a city view in an event slot.

What leaves the home page: the four-photograph grid in Our Network (`D.network.photos`), the three audience card images (`D.network.audiences[].img`), the two Selected events card covers (cards become typographic until the cover is cleared), the three Journal row thumbnails (rows show category, date and title), the five division thumbnails that use the generated scenes, the leadership section (`.lead-sec`, two portraits) which moves to About (section 5), and the hero scroll night layer. Count on the home page after the change: one hero and at most four event photographs, against one hero plus twelve event frames, five generated scenes and two portraits today.

## 3. What exists, judged against the brief

Viewed: 56 base files (15 at site level including `og.jpg` and the two portraits, 41 event frames in six folders). Findings that drive the lists in section 6:

* No own, people-free architectural photograph exists. The seven `placeholder:true` scenes (`citizenship` private jet, `private-office` penthouse, `partners` glass towers from below, `academy` library at sunset, `about` colonnade, `lagos` skyline at sunset, `closing` city above the clouds) are generated and are, one for one, the cliches section 3 of the brief names. All leave now.
* The four earlier hero files in git history are no better: `night.webp` is a skyline that is not Dubai (it reads as Doha, West Bay), `dusk.webp` is a generated golden skyline, `marina.webp` is an Unsplash Dubai Marina night view (credited to Ben Koorengevel in its day; a reasonable second interim if the Founder rejects candidate 1, but busier and warmer), `hero-alt.webp` is the white Imperial Citizenship press backdrop. None is reinstated.
* `hero.webp` (Lagos office evening, guests) and `hero-night.webp` (gala speaker) are the people-focused heroes the brief removes. `hero-lights.webp` and `events/gala-dinner-lagos/stage.webp` are the same stage-lights crop under two keys; both go, with candidate 3 kept only as a render here.
* The two credited Unsplash photographs are the only real, people-free images: `dubai.webp` (skyline at sunset, 2200 x 1375) and `real-estate.webp` (Palm Jumeirah from above, 1920 x 1200). Both are usable with a cool grade; both are interim.
* Event frames: the six folders hold good editorial material (the lectern, the arrivals, the lounge, the band, conversations) and a quantity of photo-wall and sponsor-backdrop frames that are social-media material rather than institutional evidence. Five frames fail the rules outright: `events/easter-polo-cup-2026/04` (a printed banner as the subject) and `/05` (the Imperial Citizenship press backdrop, a sister brand's sales display), `events/grenada-51-dubai/04` (a guest making peace signs to the camera), `events/lagos-office-event/07` (an informal outdoor table at night, out of register with the rest), `events/delborough-dinner/06` (pixel-identical to `/01`).
* Resolution: the Soirée frames `02` and `04` are 1024 px wide, below the 900 x 1125 card size at 2x; the SharePoint folder for that event holds the originals (section 9). `people/hekma.webp` is 512 x 640, soft at card size.
* Two captions in the registry do not match their frames: `events/gala-dinner-lagos/03` shows a champagne flute, not an award; `events/easter-polo-cup-2026/02` is marked `consent:true` but the players are identifiable (docs/CONTENT-AUDIT.md finding 13), so it is not consent-free.
* `people/zaid.webp` has a classic car in frame, which is lifestyle symbolism by the brief's rule; it stays on About for now (it is the only portrait of the Founder) and is first in line for the shoot's black and white portrait set.

## 4. Journal and events experience

The Journal is where the stories and the galleries live; the home page only points to it. Rules, in order of precedence:

1. **Galleries sit behind consent.** An event page shows its gallery only when `events[i].consent` is true, or shows only the frames whose own `consent` is true. Uncleared frames are not shown blurred, cropped or as silhouettes: they are simply absent, and the page says that photographs are held pending permissions (the existing consent note in `V.event`).
2. **Four to six frames per event, never more than six.** Order: the room or venue first, then the speaker or the occasion, then arrivals and conversations, then one detail. One frame per guest: the Soirée pairs (`01`/`03`, `05`/`06`) and the office photo-wall set (`01`, `02`, `04`) are reduced to one of each.
3. **The cover must be cleared.** `events/<slug>/cover` appears on cards and as the social image only when it passes `photoAllowed`; otherwise the card is typographic (title, date, venue, city). The `EVENT_SAFE` fallback pairs in `app.js` (generated scenes and the stage lights) are retired with the scenes.
4. **Excluded by rule from every gallery:** banners, sponsor walls and press backdrops as the subject; raised glasses and toasts; awards; gestures to the camera; line-ups of more than four; duplicates; any frame in which a guest is the point of the joke.
5. **Captions**: what, where, when, in that order, using only facts confirmed in `data.js` (venue and date where recorded, otherwise the city). No names unless agreed in writing. No clothes (the current "a guest in a long black dress" captions become "a guest at the Soirée"). Alt text is the caption unless the frame needs more for a screen reader (docs/CONTENT-AUDIT.md finding 9).
6. **Journal posts**: one photograph per post at most, in the hero position, and only a cleared frame from the event the post is about. A post that is not about an event (the four `draft:true` standards posts today use the generated scenes as `img`) takes no photograph: the row shows category, date and title.
7. **Galleries per event as proposed** (cleared frames only; the rest of each folder stays in the archive):
   * `grenada-51-dubai`: `03` (cover), `02`, `01` (the raised glass stays in the gallery as a frame of the occasion, never on the home page).
   * `lagos-diplomatic-soiree-2025`: `02`, `04`, one of `01`/`03`, one of `05`/`06`; re-export the four from the SharePoint originals.
   * `gala-dinner-lagos`: `01` (cover), `05`, `06`, `02`; `03` and `04` (flute, sponsors backdrop) held out of the gallery.
   * `easter-polo-cup-2026`: `01`, `02`, `03`; `02` set to `consent:false` until the club or the players confirm.
   * `lagos-office-event`: `05` (cover), `06`, `01`, `03`.
   * `delborough-dinner`: `02` (the band as guests arrive; cover), `04`, `05`, `01`.
8. **New events** come from the SharePoint archive (section 9) only once their facts (date, venue, what the Group's role was) are confirmed; each needs a short Journal post and a gallery curated by the same rules.

## 5. Division and About pages

**Division pages.** Each division opens with its name, its role in the ecosystem and the "At a glance" panel; the photograph is not the opening statement. Until the shoot, division heroes are typographic on the ink field (the same treatment as the hero alternative, without the map) and the ecosystem menu's third column shows the five names without thumbnails. After the shoot, one frame per division from the shot list, with these changes to docs/PHOTO-SHOT-LIST.md: Partners Club loses "the Business Bay towers from street level" (towers from below is a cliche by the brief) and keeps the conversation frame; Citizenship and Private Office frames show the work (a table, documents, a meeting room) and not faces; Real Estate keeps the credited Palm Jumeirah photograph in the interim with the cool grade from candidate 2, replaced by the Business Bay frame. No event photograph appears on a division page, with one exception: the Partners Club page may carry one cleared frame of professionals in conversation from an event, because the division is about those relationships.

**About page.** The two leadership portraits (`people/zaid`, `people/hekma`) move here from the home page and appear only here and on the founder film poster (`D.video.about.poster`). The About hero is typographic until the shoot delivers the reception or meeting room in natural light (shot list, About hero row); the generated colonnade goes. The office appears once more on About once cleared: `events/lagos-office-event/06` or `/05` as "An evening at the Lagos office", since those frames are also the only photographs of an Imperial office. Maximum on About: one hero, two portraits, one office frame.

**Contact, map, closing band, 404.** The map cards for Dubai and Lagos become typographic (address, hours, the dotted map above them) until the shoot delivers the two city frames; `dubai.webp` may stay on the Dubai card in the interim with its credit, `lagos.webp` goes. The closing band and the 404 page take the ink field with no photograph.

## 6. What to remove or replace now

Removal is of the files and their registry entries together; the code references are rewired in the build phase (deliverable 3) at the same time, so nothing is deleted before its reference is gone. 33 files:

Heroes and the stage crop (7 files, 4 keys): `assets/img/hero.webp`, `hero-m.webp`, `hero-night.webp`, `hero-night-m.webp`, `hero-lights.webp`, `hero-lights-m.webp`, `events/gala-dinner-lagos/stage.webp`. The `hero` key is re-created from candidate 1 (section 2.1).

Generated placeholder scenes (21 files, 7 keys): `citizenship`, `private-office`, `partners`, `academy`, `about`, `lagos`, `closing`, each as `<key>.webp`, `<key>-c.webp` and `<key>-m.webp`. Replaced by the ink field treatment (no image file) until the shoot; the shot list keys stay reserved for the real frames.

Event frames (5 files, 5 keys): `events/easter-polo-cup-2026/04.webp`, `events/easter-polo-cup-2026/05.webp`, `events/grenada-51-dubai/04.webp`, `events/lagos-office-event/07.webp`, `events/delborough-dinner/06.webp`. The events' `n` counts drop accordingly (polo 5 to 3, Grenada 4 to 3, office 7 to 6, Delborough 6 to 5).

Replace: `events/grenada-51-dubai/cover.webp` and `cover-p.webp` with crops of `03` (the arrival), since the current cover is a flag-wall frame.

Keep, with conditions: `dubai.webp` (credited; interim hero and Dubai map card); `real-estate.webp` (credited; Real Estate page only, cool grade); `people/zaid.webp` and `people/hekma.webp` (About only; both reshot per the shot list); `og.jpg` (regenerated from the new hero); the three icon PNGs (unaffected).

Registry corrections: `events/gala-dinner-lagos/03` `what` becomes "Two guests with a glass of champagne at the photo wall"; `events/easter-polo-cup-2026/02` `consent` becomes false; the Soirée captions lose the clothing descriptions.

## 7. How many photographs per page

| Page | Maximum | Of what |
| --- | --- | --- |
| Home | 1 + 4 | The hero; four event frames in one strip, each from a different event |
| About | 1 + 2 + 1 | The office hero (after the shoot); two portraits; one office evening frame |
| Each division | 1 (+1 on Partners Club) | Its shot-list frame (after the shoot); Partners Club may add one cleared conversation frame |
| Journal index | 1 per post | Only for event posts, only cleared covers |
| Event page | 1 + 5 | The cover and up to five more, six in all |
| Contact | 0 or 1 | The office front door or sign (after the shoot) |
| 404, closing band, search | 0 | The ink field |

## 8. Permissions

**Who confirms.** For each event, the Marketing Team member who hosted it confirms the guest list and identifies every person in each candidate frame (To confirm: the named owner per event; the Guest List.xlsx in the Grenada 51st folder on SharePoint shows the practice exists for at least one event). Consent itself comes from the guest: a reply to a short email or message that names the event and says the photographs may be published on the Group's website, or a signed form at the event. The Founder signs off the set for each event before `consent` is set. Nobody at Imperial consents on a guest's behalf, and a guest's public role (diplomat, official, performer) does not remove the need to ask; the Grenada press release supports the facts of that event, not the use of anyone's likeness.

**Per event.** One consent log per event, kept as `Consent.xlsx` in that event's folder under MarketingTeam / Shared Documents / Events (To confirm: the Marketing Team agrees the location), with one row per person per frame: frame key, person (or "unidentified guest, not shown" where the person cannot be reached), how consent was given, date, who recorded it. A frame is cleared when every identifiable person in it has a row with consent. An event is cleared when every frame in its proposed gallery (section 4, item 7) is cleared.

**Where it is recorded in data.js.** `photos[].consent:true` per cleared frame; `events[].consent:true` only when the whole proposed gallery is cleared (the flag unlocks every frame of that event, so it is the stronger statement and is set last). The plan proposes two fields on each cleared entry, `consentRef:'Events/<folder>/Consent.xlsx'` and `consentDate:'YYYY-MM-DD'`, so the registry says where the evidence is; the build phase adds them (they are inert to `app.js`). Frames for which consent is refused or cannot be obtained are deleted from `assets/img`, not left `consent:false` indefinitely: a reasonable deadline is the launch-readiness audit (deliverable 8).

**Going forward.** Every Imperial event has a consent point at the door (a line on the invitation and a sign at reception that photographs are taken for the Group's website, with a way to opt out) and the photographer is briefed to the rules in section 4. Staff appear under the written consent form in docs/PHOTO-SHOT-LIST.md.

## 9. The archive on SharePoint

Read-only listing of MarketingTeam / Shared Documents / Events (folder names and counts only; counts are approximate from the listings; nothing was downloaded; video folders are far over the size that can be read):

| Folder | Photographs | On the site today | Note |
| --- | --- | --- | --- |
| Event at thedelborough Hotel Lagos | about 12 social-export JPGs | Yes (`delborough-dinner`, 6 frames) | Video folder about 7 MB |
| Gala Dinner - Lagos | about 121 DSC JPGs | Yes (`gala-dinner-lagos`, 6 frames) | Video about 207 MB |
| Grenada 50th Indp Day 2024 | about 150 "Imperial-Citizenship-Agora-" JPGs, plus about 15 phone clips and HEIC files dated 13 to 14 February 2024 | **No** | Candidate new event; facts To confirm |
| Grenada 51st Independence Day Celebration 2025 | Event about 168 (with "(1)" duplicates), Event (1) about 84, Photobooth 24, Photobooth (1) 43, Photos about 102; Guest List.xlsx; Videos about 255 MB | Yes (`grenada-51-dubai`, 4 frames) | The press release .docx sits at the top of the Events folder |
| Grenada 52nd Ind.day after party | about 192 files as ARW and JPG pairs (DSC06169 to DSC06303) | **No** | 2026; candidate new event; facts To confirm; video about 19.7 GB |
| Grenada Sponsored Evening Event 26 | about 200 files (DSC06553 to DSC06581 ARW and JPG pairs; DSC09615 to DSC09755 JPGs with duplicates) | **No** | Candidate new event; facts To confirm; video about 22.3 GB |
| IMA Grenada 51st Independence Day - 2025 | 6 JPGs of about 20 MB each | **No** | The official celebration; the site's event is the after party |
| Imperial Private Evening | about 128 "_FOR" JPGs | **No** | Candidate new event; facts To confirm; video about 74 MB |
| Lagos Office Event | about 80 "_FOR" JPGs | Yes (`lagos-office-event`, 7 frames) | Video about 154 MB |
| Lagos Polo Club 2026 | about 86 "_FOR" JPGs | Yes (`easter-polo-cup-2026`, 5 frames) | Video about 179 MB |
| THE LAGOS DIPLOMATIC SOIREE 2025 | about 96 small "_FOR" JPGs (around 200 KB each) | Yes (`lagos-diplomatic-soiree-2025`, 6 frames) | Video about 66 MB; the originals for the re-export in section 4 |

Five events have photographs and no presence on the site: Grenada 50th Independence Day (2024), the IMA Grenada 51st official celebration (2025), the Grenada 52nd after party (2026), the Grenada Sponsored Evening Event 26, and the Imperial Private Evening. Each is a candidate for a Journal post and gallery once its date, venue and the Group's role are confirmed from the Marketing Team's records (the file names alone are not evidence). The Grenada set would also give the events page a third year of the same relationship, which is the kind of documented, repeated institutional relationship section 6 of the brief asks for.

## 10. Shot list: what this plan adds to docs/PHOTO-SHOT-LIST.md

The v5 shot list stands (one shoot per city, the rooms, the portraits, the dusk frames, the sizes, the consent forms). This plan amends it rather than restating it:

1. **Home hero row.** The subject is no longer "the team in the office or the city at dusk": it is the city at dusk from our side of it, architectural, with no people in frame. Second option on the day: the building's entrance or facade at eye level. The night layer row is deleted (no crossfade). The hero loop video stays optional and, if shot, is the same static dusk view.
2. **Division rows.** Partners Club: delete "the Business Bay towers from street level"; keep two or three people in conversation. Citizenship and Private Office: the table, the documents, the room; no faces as the subject. Academy: no "shelf of reference material" (it reads as the library cliche); a training moment only.
3. **Map rows.** Dubai and Lagos frames at eye level or from the office window, in the last hour of light, not from above and not against a sunset.
4. **New rows.** The office exterior and sign (Contact); an empty meeting room with the Group's documents on the table (a neutral frame for any page that needs one); one clean frame of the crown and wordmark on site if they exist.
5. **Portraits.** The Founder's portrait is reshot without the car; both portraits delivered at 900 x 1125 black and white and in colour.
6. **A standing brief for event photographers**, to attach to every booking: three to five editorial frames per event (the room before guests, the speaker, an arrival, one conversation, one detail), consent point at the door, no banner or backdrop as the subject, no posed line-ups, no gestures to the camera, originals delivered with a guest list for the consent log.
7. **Archive re-exports.** The Soirée frames re-exported from the SharePoint originals at 900 x 1125; any new gallery exported at the shot list sizes.

## 11. Order of work for the build phase

1. Remove the 33 files and 16 registry keys in section 6 together with their references; re-create `hero` from candidate 1; retire `hero.night`, `hero.fallback` and `EVENT_SAFE`; add the ink field treatment.
2. Rebuild the home page to section 2: one hero, one event strip with typographic fallbacks, no portraits, no thumbnails.
3. Move leadership to About; make the division, map, closing and 404 treatments typographic.
4. Apply the registry corrections and the caption rules; add `consentRef` and `consentDate` as fields.
5. Start the consent log for the four home page frames and their alternates first (gala `01`/`05`, Grenada `03`/`02`, Delborough `04`/`05`, office `05`/`06`), then per event.
6. Book the two city shoots to the amended shot list.

**Done (v6 build, branch v6/home).** Items 1 to 4, on the site:

* Hero: candidate 1 exported from `dubai.webp` with the section 2.1 crop and grade (`hero.webp` 1920 x 1080, 17 KB; `hero-m.webp` 900 x 1125, 9 KB), `og.jpg` regenerated from it, the `hero` registry entry credited to Anoof C on Unsplash (the footer credit list carries it). `D.hero.style` switches to `map`, the ink field with the dotted world, the two offices and one arc drawn inline. The night layer, the crossfade and `hero-lights` are gone; the "Final hero photo" marker stays until the shoot.
* Home: the figures band and the leadership section are gone; the five division cards are typographic on the ink field; Our Network has no photographs; the event strip (section 2.2) sits after Our Network, gated per frame and held below three cleared frames, so it shows on a preview build only today; Selected events cards and Journal rows are typographic until their cover is cleared; the closing band carries the signature on the ink map.
* Removed: the 33 files in section 6 (and `real-estate-c.webp`, no longer referenced) with their registry keys; `EVENT_SAFE` retired. Division heroes, the divisions index, About, Insights, the Journal and event heroes, the closing band, 404 and error take the ink field when no cleared photograph exists; each division has its numeral and its own crop of the map. The ecosystem menu shows the five divisions without thumbnails.
* Kept: `dubai.webp` (source of the hero), `real-estate.webp` and its `-m` crop on the Real Estate page only with the candidate 2 grade, the two portraits on About only.
* Registry: the gala `03` caption, polo `02` set to `consent:false`, no clothing descriptions in captions (the Soirée frames, and the same rule applied to gala `06`, Grenada `02` and Delborough `05`); Grenada 51st covers re-cut from `03`; event counts updated (Grenada 3, polo 3, office 6, Delborough 5).
* Not done here: the per-event gallery curation in section 4, item 7 (galleries still show frames `01` to `n` once cleared), the Soirée re-exports (section 9), `consentRef` and `consentDate` (no frame is cleared yet), the Dubai map card photograph (the map cards were already typographic), and the shared chrome kit for the sister sites (`shared/chrome/header.html` still names the removed division crops; its README describes the no-photograph variant).

## 12. To confirm

* Founder: the hero choice (candidate 1, or the alternative with no photograph), and whether a credited licensed photograph is acceptable on the home page in the interim.
* Founder: the four home page frames once cleared, and the About office frame.
* Marketing Team: the owner per event for the consent log, the log's location, and the dates, venues and the Group's role for the five archived events not on the site.
* Marketing Team: whether the Soirée originals can be re-exported at the card size.
* Founder: the Easter Polo Cup `02` frame (the players) and whether the club holds any image rights for the match.

## Assumptions made in this plan

* The two Unsplash licences in the registry remain valid for the site's use with the credit line, as v5 recorded them.
* The six on-site events map to the SharePoint folders as named in the table in section 9 (by name and file pattern; no file was opened).
* The Easter Polo Cup backdrop frame is a sister-brand sales display because the registry caption says it is the Imperial Citizenship backdrop; no claim is made about what was sold.
* "Interim" means until the city shoot delivers, and not beyond the launch-readiness audit without a Founder decision.

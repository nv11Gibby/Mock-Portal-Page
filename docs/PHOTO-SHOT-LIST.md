# Photo shot list: one professional shoot per city

Brief section 5.1. One shoot in Dubai and one in Lagos, each half a day with the same photographer if possible, so the
two cities match in light and grading. The photographs replace the generated scenes that still stand in for our offices
and cities (`placeholder:true` in `assets/js/data.js`) and the stock photographs that remain on the Real Estate page and
the map. Every photograph delivered under this list is our own (`own:true`) and needs no credit line.

Nothing in this list names a room, a person or a view that we have not confirmed. Where we do not know what the office
has, the item says TO CONFIRM and the shoot adapts on the day.

## The two locations

| City | Address | What we know |
| --- | --- | --- |
| Dubai | 804 Single Business Tower, Business Bay, Dubai, United Arab Emirates | Headquarters. TO CONFIRM: which rooms exist (reception, meeting rooms, open office), window aspect and the best time of day for the view. |
| Lagos | 8 Aromire Road, Ikoyi, Lagos 106104, Nigeria | Regional hub. Photographs from the office evening already exist (`assets/img/events/lagos-office-event/`). TO CONFIRM: rooms, window aspect, time of day. |

## People

Only the two Group leaders already on the site, photographed in each city or in one sitting:

* Zaid Al Hindi, Founder and Group Chief Executive Officer (TO CONFIRM: the spelling of the surname, Al Hindi or Alhindi, with the Founder).
* Hekma Iskandarani, Group Chief Operating Officer.

Other team members appear only in the "team at work" frames and only with their written consent (a short release signed on
the day). No one else is named. Divisional leadership is introduced on each division's own site and is not photographed here.

## Before the shoot

* Written consent form for every member of staff who appears (name, date, signature). File the forms with the Marketing Team.
* Tidy desks, screens off or showing a neutral screen, no client papers in frame.
* Group crown and wordmark present somewhere in the office frames (reception sign, a document, a lapel pin) if they exist on site; nothing added for the shoot.
* Confirm the dusk time for the date of each shoot and book the last hour of light for the city frames.

## Shots that every page needs

Sizes are for the web exports; deliver full-resolution originals as well. All exports in WebP, under 200 KB for heroes
and under 150 KB for everything else. Landscape 1728 x 1080 and 1920 x 1080 for heroes; portrait 900 x 1125 (4:5) for cards
and for the mobile hero; portraits of people 900 x 1125 in black and white to match the two portraits already on the site.

| Page or place | Key in data.js (file name in assets/img/) | Subject | Orientation and size | City |
| --- | --- | --- | --- | --- |
| Home hero | `hero` (hero.webp 1920 x 1080, hero-m.webp 900 x 1125) | The strongest single frame of the shoot: the team in the office or the city at dusk from our window. Replaces the stand-in: the Easter Polo Cup backdrop in production, or the Lagos office evening photograph once its guests have given consent. | Landscape and portrait pair, same subject | Either (TO CONFIRM: which city opens the site) |
| Home hero, night layer | `hero-night` (hero-night.webp 1920 x 1080, hero-night-m.webp 900 x 1125) | The same frame at dusk or after dark, for the scroll crossfade. | Landscape and portrait pair | Same city as the hero |
| Home hero loop (video, 5.2) | `assets/video/hero-loop.mp4` (TO CONFIRM: hosting) | 10 to 15 seconds, silent, static camera or a very slow move: the city at dusk from our side, or the office as the lights come on. | Landscape 1920 x 1080 | Either |
| About hero | `about` (about.webp 1728 x 1080, about-c.webp 900 x 1125) | Reception or the main meeting space, empty, in natural light. | Landscape plus card crop | Dubai |
| About, founder film (video, 5.2) | `D.video.about` | 60 to 90 seconds, the founder on camera in the office, interview framing, with room tone and a separate audio recording for captions. | Landscape 1920 x 1080 | Dubai |
| Leadership portraits | `people/zaid`, `people/hekma` (900 x 1125, black and white) | Head and shoulders, seated or standing, office background softened. One frame each in colour as well for press use. | Portrait | Dubai or Lagos, one sitting each |
| Citizenship division | `citizenship` (1728 x 1080, -c 900 x 1125) | A meeting in progress across the table, documents in hand, faces or hands only with consent. | Landscape plus card crop | Dubai |
| Private Office division | `private-office` (1728 x 1080, -c 900 x 1125) | A quiet one-to-one conversation in a meeting room, or the view from the office window. | Landscape plus card crop | Dubai |
| Partners Club division | `partners` (1728 x 1080, -c 900 x 1125) | Two or three people in conversation standing, or the Business Bay towers from street level outside our building. | Landscape plus card crop | Dubai |
| Academy division | `academy` (1728 x 1080, -c 900 x 1125) | A training moment: a screen or whiteboard with the team listening, or a shelf of reference material if one exists. | Landscape plus card crop | Lagos or Dubai |
| Real Estate division | `real-estate` (1728 x 1080, -c 900 x 1125) | Dubai from our side: the Business Bay canal or the skyline from the office at dusk. Replaces the licensed Unsplash photograph of Palm Jumeirah. | Landscape plus card crop | Dubai |
| Contact hero | reuse `about` or a second reception frame | The front door, the sign or the reception desk, so the visitor recognises the office. | Landscape | Both |
| 404 and closing band | `closing` (1728 x 1080, -c 900 x 1125) | The city at dusk from our window, wide. | Landscape plus card crop | Dubai |
| Map, Dubai | `dubai` (1728 x 1080, -c 900 x 1125) | The Business Bay skyline at dusk from our side of it. Replaces the licensed Unsplash photograph. | Landscape plus card crop | Dubai |
| Map, Lagos | `lagos` (1728 x 1080, -c 900 x 1125) | Ikoyi or the Lagos waterfront at dusk from our side of it. | Landscape plus card crop | Lagos |
| Our Network, audiences | `events/...` today; new keys `team/01` to `team/06` | Team at work: desks, a corridor conversation, a handover of documents, a phone call, the reception greeting a visitor (staff only, with consent). | Landscape 1728 x 1080 and portrait 900 x 1125 | Both |
| Journal hero | reuse an event cover once consent is recorded | No new frame needed. | | |

## Order of the day, each city

1. Reception and meeting rooms, empty, in natural light (first hour, before the team arrives or during a quiet hour). TO CONFIRM: which rooms exist.
2. The team at work, candid, in the rooms above (two hours). Consent forms signed before the camera comes out.
3. Leadership portraits (one hour): black and white set and a colour set, three backgrounds.
4. The city at dusk from our side of it: from the office window, the roof or the street outside, in the last hour of light and the first half hour after. This also yields the hero night layer and the hero loop.

## Delivery

* Full-resolution originals, edited, with a contact sheet.
* Web exports at the sizes above, named by the key, placed in `assets/img/` (and `assets/img/team/` for the team frames).
* A list of every person who appears with their consent form, so `consent:true` can be set in `data.js` per photograph.
* For video: the master file, a 1080p export, and a transcript for the captions file in `assets/captions/`.

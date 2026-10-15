/* Lead score: hot, warm or exploring, from timeline, budget band, division fit and source. The weights live in
   shared/lead-schema.json under "score". The band is written as the Pipedrive label, a [HOT] or [WARM] title prefix,
   and in the note. No new Pipedrive field is created. */
'use strict';

const { schema } = require('./config');
const S = schema.score;

/* How the visit started, from the tracking fields. Used for the Pipedrive Source Method and for the score. */
function sourceMethodKey(data) {
  const src = String(data.utm_source || data.source || '').toLowerCase();
  const med = String(data.utm_medium || data.medium || '').toLowerCase();
  const paid = /cpc|ppc|paid|ads|display/.test(med) || !!data.gclid || !!data.fbclid;
  if ((/google/.test(src) && paid) || data.gclid) return 'google';
  if ((/facebook|instagram|meta|fb\b/.test(src) && paid) || data.fbclid) return 'meta';
  if (/tiktok/.test(src)) return 'tiktok';
  if (paid) return 'paid';
  if (/referral|partner|introduc/.test(med) || (src && src !== 'direct' && !/google|bing|yahoo|duckduckgo/.test(src))) return 'referral';
  return 'organic';
}

/* referral: a referral or a partner introducing a client. paid: ads. organic: everything else. */
function sourceClass(data) {
  if (data.for_whom === 'client') return 'referral';
  const m = sourceMethodKey(data);
  if (m === 'referral') return 'referral';
  if (m === 'google' || m === 'meta' || m === 'tiktok' || m === 'paid') return 'paid';
  return 'organic';
}

function scoreLead(data, division) {
  const reasons = [];
  let points = 0;
  const t = data.timeline;
  if (S.timeline[t] !== undefined) { points += S.timeline[t]; reasons.push('timeline ' + t + ' +' + S.timeline[t]); }
  else reasons.push('timeline not given');
  const b = data.budget;
  if (S.budget[b] !== undefined) { points += S.budget[b]; reasons.push('budget ' + b + ' +' + S.budget[b]); }
  else reasons.push('budget not given');
  const fit = division && division !== 'group' ? 'single' : 'group';
  points += S.divisionFit[fit]; reasons.push('division ' + fit + ' +' + S.divisionFit[fit]);
  const src = sourceClass(data);
  points += S.source[src]; reasons.push('source ' + src + ' +' + S.source[src]);

  let band = 'exploring';
  if (!t || t === 'exploring') band = points >= S.bands.exploringWarm ? 'warm' : 'exploring';
  else if (points >= S.bands.hot) band = 'hot';
  else if (points >= S.bands.warm) band = 'warm';
  return { band, points, reasons, source: src, method: sourceMethodKey(data) };
}

function titlePrefix(band) { return band === 'hot' ? '[HOT] ' : band === 'warm' ? '[WARM] ' : ''; }

module.exports = { scoreLead, sourceMethodKey, sourceClass, titlePrefix };

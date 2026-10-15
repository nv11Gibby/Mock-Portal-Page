/* The submission core every Imperial site can call. One entry, processLead({form, data, ctx}), used by
   submission-created.js (Netlify Forms event), lead.js (direct JSON POST) and, for the verified flag, verify.js.

   Per submission:
     1. Spam gates: honeypot, rate limit per IP, email format and disposable domains, Cloudflare Turnstile.
     2. Site and division from the data (a site sets only its site key and default division), audience, lead score.
     3. Pipedrive: find the person by email then by phone (dedupe); create or update the person; find an open lead or
        deal of the same division for a returning person; otherwise create a lead or a deal per shared/lead-routing.json
        (owner, pipeline, stage, label, custom fields); add a note with every field and every tracking value; add an
        activity for a returning person.
     4. Confirmation email when the lead is stored and the email env is set.
   Never throws: every outcome is a result object {ok, reason, ref, kind, id, ...}. */
'use strict';

const config = require('./config');
const { pick, checkEmail, phoneE164, honeypotTripped, samePhone } = require('./validate');
const { scoreLead, titlePrefix } = require('./score');
const { take } = require('./ratelimit');
const { verifyTurnstile } = require('./turnstile');
const pipedrive = require('./pipedrive');
const { sendConfirmation } = require('./email');
const { newRef } = require('./http');

const { schema, routing } = config;
const PD = routing.pipedrive, F = PD.fields, O = PD.options;
const FOR_WHOM = { myself: 'myself', family: 'my family', client: 'a client I am introducing' };

function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function label(field, value) { const f = schema.fields[field]; return (f && f.labels && f.labels[value]) || value || ''; }
function dateOnly(ms) { return new Date(ms).toISOString().slice(0, 10); }
function addDays(ms, days) { return dateOnly(ms + days * 86400000); }

function resolveSite(data, ctx) {
  if (data.site && schema.sites[data.site]) return data.site;
  if (ctx.site && schema.sites[ctx.site]) return ctx.site;
  return 'ihg';
}

function resolveDivision(form, data, site) {
  const formCfg = schema.forms[form] || {};
  const candidates = [data.division, data.about, formCfg.defaultDivision, schema.sites[site].defaultDivision, 'group'];
  for (let i = 0; i < candidates.length; i++) if (candidates[i] && routing.divisions[candidates[i]]) return candidates[i];
  return 'group';
}

function resolveAudience(data, divCfg) {
  const a = data.audience || data.audience_resolved;
  return (a === 'clients' || a === 'partners' || a === 'institutions') ? a : (divCfg.audience || 'clients');
}

function buildTitle(band, data, form, divName) {
  let suffix = '';
  if (data.lead_source === 'programme-fit') suffix = ' (programme fit)';
  else if (form === 'guide' || data.lead_source === 'guide') suffix = ' (guide)';
  else if (form === 'interest') suffix = ' (register interest)';
  return titlePrefix(band) + 'Website: ' + (data.name || data.email) + ' · ' + divName + suffix;
}

function serviceRequested(data, form, divName) {
  const parts = [divName];
  if (data.lead_source === 'programme-fit') parts.push('Programme fit check');
  if (form === 'guide' || data.lead_source === 'guide') parts.push('Guide request');
  if (form === 'interest') parts.push('Register interest' + (data.interest ? ': ' + data.interest : ''));
  if (data.re_intent) parts.push('Property to ' + data.re_intent + (data.re_area ? ' in ' + data.re_area : ''));
  else if (data.re_area) parts.push('Area: ' + data.re_area);
  if (data.firm || data.profession) parts.push('Partner: ' + [data.profession, data.firm].filter(Boolean).join(', '));
  if (data.for_whom) parts.push('For ' + FOR_WHOM[data.for_whom]);
  return parts.join(' · ').slice(0, 255);
}

/* Custom fields shared by leads and deals (leads inherit the deal fields). */
function recordFields(div, divCfg, data, form, audience, score, now) {
  const f = {};
  f[F.deal.sourcePlatform] = O.sourcePlatform.website;
  f[F.deal.sourceMethod] = O.sourceMethod[score.method] || O.sourceMethod.organic;
  if (audience === 'clients') f[F.deal.contactType] = O.contactType.client;
  if (audience === 'partners') f[F.deal.contactType] = O.contactType.partner;
  if (divCfg.divisionOption && O.division[divCfg.divisionOption]) f[F.deal.division] = O.division[divCfg.divisionOption];
  f[F.deal.urgency] = (data.timeline === '3m' || /urgent/i.test(data.msg || '')) ? O.urgency.urgent : O.urgency.standard;
  const camp = data.utm_campaign || data.campaign;
  if (camp) f[F.deal.campaignName] = camp.slice(0, 255);
  f[F.deal.serviceRequested] = serviceRequested(data, form, divCfg.name);
  if (div === 'partners-club' && data.for_whom === 'client') f[F.deal.requestType] = O.requestType.referral;
  if (data.timeline === '3m') f[F.deal.expectedCloseDate] = addDays(now, 90);
  else if (data.timeline === '3-12m') f[F.deal.expectedCloseDate] = addDays(now, 365);
  return f;
}

function noteLines(o) {
  const d = o.data, L = [];
  L.push(o.score.band.toUpperCase() + ' · Website enquiry (' + o.form + ' form) · Ref ' + o.ref);
  L.push('Site: ' + o.site + ' · Lead source: ' + o.leadSource);
  L.push('Audience: ' + o.audience + ' · Division: ' + o.divCfg.name + (d.routed_to ? ' · Routed to: ' + d.routed_to : ''));
  if (d.for_whom) L.push('Enquiry for: ' + FOR_WHOM[d.for_whom]);
  if (d.nationality) L.push('Nationality: ' + d.nationality + (o.matched.nationality ? ' (set on the person)' : ' (no matching Pipedrive option, kept as text)'));
  if (d.country) L.push('Country of residence: ' + d.country + (o.matched.country ? ' (set on the person)' : ' (no matching Pipedrive option, kept as text)'));
  if (d.timeline || d.budget) L.push('Timeline: ' + (label('timeline', d.timeline) || 'not given') + ' · Budget: ' + (label('budget', d.budget) || 'not given'));
  if (d.firm || d.profession) L.push('Firm: ' + (d.firm || '') + ' · Profession: ' + (d.profession || ''));
  if (d.re_intent || d.re_area) L.push('Property: ' + (d.re_intent || '') + ' · Area: ' + (d.re_area || ''));
  if (d.interest) L.push('Interest: ' + d.interest);
  if (d.interests) L.push('Interests: ' + d.interests);
  if (d.pref) L.push('Reply by: ' + d.pref);
  L.push('Phone: ' + (d.phone || 'not given') + (o.phone && o.phone !== d.phone ? ' (' + o.phone + ')' : '') + ' · Verification: ' + (d.phone ? 'Not Verified (code not entered yet)' : 'no phone given'));
  L.push('Consent: ' + (d.consent || 'not recorded'));
  L.push('');
  L.push('Message:');
  L.push(d.msg || '(none)');
  L.push('');
  L.push('Score: ' + o.score.band.toUpperCase() + ' (' + o.score.points + ' points): ' + o.score.reasons.join(', '));
  if (d.quiz_answers) L.push('Programme fit answers: ' + d.quiz_answers);
  L.push('');
  L.push('Tracking:');
  schema.tracking.forEach((k) => L.push(k + ': ' + (d[k] || '')));
  L.push(o.ctx.submissionId ? 'Netlify submission: ' + o.ctx.submissionId + ' at ' + (o.ctx.createdAt || '') : 'Direct submission (fallback endpoint) at ' + new Date(o.now).toISOString());
  return L;
}

function toHtml(lines) { return lines.map(esc).join('<br>'); }

/* Open lead or deal of the person. division filter is optional; newest first. */
async function openRecords(pd, personId, divCfg) {
  const divOpt = divCfg && divCfg.divisionOption ? O.division[divCfg.divisionOption] : null;
  const match = (r) => !divCfg || (divOpt && String(r[F.deal.division]) === String(divOpt)) || (r.title && r.title.indexOf(divCfg.name) > -1);
  const leads = await pd.openLeads(personId).catch(() => []);
  const deals = await pd.openDeals(personId).catch(() => []);
  const hits = leads.filter(match).map((l) => ({ kind: 'lead', id: l.id, title: l.title, time: l.add_time || '' }))
    .concat(deals.filter(match).map((d) => ({ kind: 'deal', id: d.id, title: d.title, time: d.add_time || '' })));
  hits.sort((a, b) => String(b.time).localeCompare(String(a.time)));
  return hits;
}

async function syncPipedrive(o) {
  const pd = pipedrive.client(o.token, o.ctx.fetch);
  const d = o.data, owner = Number(o.divCfg.owner) || 0;
  const phoneValue = o.phone || d.phone || '';

  /* 1. person (dedupe on email, then phone) */
  let person = await pd.findPersonByEmail(o.email);
  if (!person && phoneValue) person = await pd.findPersonByPhone(phoneValue);
  const existed = !!person;
  let personUnchanged = false;

  /* organisation, when a firm or company is named */
  let org = null;
  const orgName = (d.firm || '').trim();
  if (orgName) {
    org = await pd.findOrg(orgName).catch(() => null);
    if (!org) {
      const ob = { name: orgName, visible_to: PD.visibleTo };
      if (owner) ob.owner_id = owner;
      org = await pd.createOrg(ob).catch(() => null);
    }
  }

  if (!person) {
    const body = { name: d.name || o.email, email: [{ value: o.email, primary: true, label: 'work' }], visible_to: PD.visibleTo };
    if (phoneValue) body.phone = [{ value: phoneValue, primary: true, label: 'work' }];
    if (org) body.org_id = org.id;
    if (owner) body.owner_id = owner;
    body[F.person.verificationStatus] = O.verificationStatus.notVerified;
    if (o.matched.nationality) body[F.person.nationality] = o.matched.nationality;
    if (o.matched.country) body[F.person.countryOfResidence] = o.matched.country;
    person = await pd.createPerson(body);
  } else {
    /* The merge needs the full person: Pipedrive replaces the whole email and phone lists on PUT, and the search item
       carries them under other names (emails, phones) without the custom fields. When the fetch fails (a 429 on a
       burst, a transient 5xx) nothing is written to the person: a new email or phone is at worst not added, and the
       note below carries it, rather than a list being overwritten on exactly the returning clients the dedupe protects. */
    const full = await pd.getPerson(person.id).catch((err) => { console.warn('person fetch failed, person left unchanged', err && err.message); return null; });
    if (full) {
      const upd = {};
      const emails = (full.email || []).filter((e) => e && e.value);
      if (!emails.some((e) => String(e.value).toLowerCase() === o.email)) upd.email = emails.concat([{ value: o.email, primary: emails.length === 0, label: 'work' }]);
      const phones = (full.phone || []).filter((p) => p && p.value);
      if (phoneValue && !phones.some((p) => samePhone(p.value, phoneValue))) upd.phone = phones.concat([{ value: phoneValue, primary: phones.length === 0, label: 'work' }]);
      if (!full[F.person.verificationStatus]) upd[F.person.verificationStatus] = O.verificationStatus.notVerified;
      if (o.matched.nationality && !full[F.person.nationality]) upd[F.person.nationality] = o.matched.nationality;
      if (o.matched.country && !full[F.person.countryOfResidence]) upd[F.person.countryOfResidence] = o.matched.country;
      if (org && !full.org_id) upd.org_id = org.id;
      if (Object.keys(upd).length) await pd.updatePerson(person.id, upd).catch((err) => console.warn('person update failed', err && err.message));
    } else personUnchanged = true;
  }

  /* 2. lead or deal: reuse an open one of the same division for a returning person */
  let kind, id, reused = false, labelRejected = false;
  const existing = existed ? (await openRecords(pd, person.id, o.divCfg))[0] : null;
  if (existing) { kind = existing.kind; id = existing.id; reused = true; }
  else {
    const title = buildTitle(o.score.band, d, o.form, o.divCfg.name);
    const fields = recordFields(o.division, o.divCfg, d, o.form, o.audience, o.score, o.now);
    const labelId = O.label[o.score.band];
    if (o.divCfg.kind === 'deal') {
      const body = Object.assign({ title, person_id: person.id, pipeline_id: o.divCfg.pipeline, stage_id: o.divCfg.stage, visible_to: PD.visibleTo, label_ids: [labelId] }, fields);
      if (org) body.org_id = org.id;
      if (owner) body.user_id = owner;
      const deal = await pd.createDeal(body);
      kind = 'deal'; id = deal.id;
    } else {
      /* Leads: visible_to is a string enum in the Leads API (a number on deals), and the label is the account's own
         Leads inbox label for the band (a UUID from GET /leadLabels), never the numeric deal label id. */
      const body = Object.assign({ title, person_id: person.id, visible_to: String(PD.visibleTo) }, fields);
      const leadLabel = await pd.leadLabelId(o.score.band);
      if (leadLabel) body.label_ids = [leadLabel];
      if (org) body.organization_id = org.id;
      if (owner) body.owner_id = owner;
      const lead = await pd.createLead(body);
      kind = 'lead'; id = lead.id; labelRejected = !!lead._labelRejected;
    }
  }

  /* 3. note with everything, on the person and the record */
  const note = { content: toHtml(noteLines(o)), person_id: person.id };
  note[kind === 'lead' ? 'lead_id' : 'deal_id'] = id;
  await pd.addNote(note);

  /* 4. activity for a returning person: one call to make, due today, with the owner */
  let activity = false;
  if (existed) {
    const act = { subject: PD.activity.subject, type: PD.activity.type, due_date: dateOnly(o.now), person_id: person.id,
      note: 'Returning contact: new ' + o.form + ' form enquiry for ' + o.divCfg.name + ' (score ' + o.score.band + ', ref ' + o.ref + ')' + (reused ? ', added to the open ' + kind : '') };
    act[kind === 'lead' ? 'lead_id' : 'deal_id'] = id;
    if (owner) act.user_id = owner;
    activity = !!(await pd.addActivity(act).then(() => true).catch((err) => { console.warn('activity failed', err && err.message); return false; }));
  }

  return { kind, id, personId: person.id, personExisted: existed, personUnchanged, reused, labelRejected, activity, orgId: org ? org.id : undefined };
}

/* input: {form, data, ctx:{ip, site, ref, submissionId, createdAt, fetch}, now} */
async function processLead(input) {
  const form = String((input && input.form) || '').trim();
  const raw = (input && input.data && typeof input.data === 'object') ? input.data : {};
  const ctx = (input && input.ctx) || {};
  const now = (input && input.now) || Date.now();
  const result = { ok: false, form, ref: ctx.ref || newRef(now) };

  if (honeypotTripped(raw)) return Object.assign(result, { reason: 'honeypot' });
  if (!schema.forms[form]) return Object.assign(result, { reason: 'form' });
  const data = pick(raw);

  if (ctx.ip) {
    const r = take('lead:' + ctx.ip, config.rate(), now);
    if (!r.ok) return Object.assign(result, { reason: 'rate', retryMs: r.retryMs });
  }
  const em = checkEmail(data.email);
  if (!em.ok) return Object.assign(result, { reason: em.reason });
  const email = em.email;

  const ts = await verifyTurnstile(data['cf-turnstile-response'], ctx.ip, config.turnstileSecret(), ctx.fetch);
  if (!ts.ok) return Object.assign(result, { reason: 'turnstile', detail: ts.detail });

  const site = resolveSite(data, ctx);
  const division = resolveDivision(form, data, site);
  const divCfg = routing.divisions[division];
  const audience = resolveAudience(data, divCfg);
  const score = scoreLead(data, division);
  const phone = phoneE164(data.phone);
  const leadSource = data.lead_source || (schema.forms[form].leadSource) || 'website';
  const matched = {
    nationality: pipedrive.firstOptionId(routing.personOptions.nationality, data.nationality),
    country: pipedrive.optionId(routing.personOptions.countryOfResidence, data.country)
  };
  Object.assign(result, { site, division, audience, score: score.band, points: score.points, email, phone: phone || undefined });

  const token = config.pipedriveToken();
  let stored = !!ctx.submissionId;
  if (!token) {
    result.reason = 'unconfigured';
    console.warn('PIPEDRIVE_API_TOKEN is not set; lead not sent to Pipedrive', { form, division, ref: result.ref });
  } else {
    try {
      const sync = await syncPipedrive({ token, ctx, now, form, data, email, phone, site, division, divCfg, audience, score, leadSource, matched, ref: result.ref });
      Object.assign(result, sync, { ok: true });
      stored = true;
    } catch (err) {
      result.reason = 'sync';
      result.error = err && err.message;
      console.error('Pipedrive sync failed', err && err.message, { form, division, ref: result.ref });
    }
  }

  if (stored) {
    result.confirmation = await sendConfirmation({ email, name: data.name, form, divisionName: divCfg.name, leadSource }, ctx.fetch);
  } else {
    result.confirmation = { sent: false, skipped: 'lead not stored' };
  }
  return result;
}

/* After a successful code check: Verification Status = Verified on the person, a note on the newest open lead or deal.
   Only the person who holds the verified number is marked: the lookup is by phone first; a person found by email is
   accepted only when one of their numbers is the number Twilio approved (an email in the request body is never enough
   on its own). The person, or the phone on a returning person, may be written by submission-created a moment after the
   code is checked, so the lookup is repeated up to o.attempts times (default 4), o.retryDelayMs apart (default 1500 ms,
   about 6 s in all, inside Netlify's default function timeout). Result: {ok:true, personId, kind, id} or
   {ok:false, reason:'unconfigured'|'person'|'mismatch'|'sync'}; mismatch means a person with that email exists but
   does not hold the number, and nothing was written. */
async function markVerified(o) {
  const token = config.pipedriveToken();
  if (!token) return { ok: false, reason: 'unconfigured' };
  const pd = pipedrive.client(token, o.fetch);
  const now = o.now || Date.now();
  const email = checkEmail(o.email).email || '';
  const phone = o.phone || '';
  const attempts = Math.max(1, Number(o.attempts) || 4);
  const delay = o.retryDelayMs === undefined ? 1500 : o.retryDelayMs;
  const holds = (p) => (p.phone || []).some((ph) => ph && samePhone(ph.value, phone));
  try {
    let person = null, mismatch = false;
    for (let i = 0; i < attempts && !person; i++) {
      if (i > 0) await new Promise((r) => setTimeout(r, delay));
      if (phone) person = await pd.findPersonByPhone(phone);
      if (!person && email) {
        const byEmail = await pd.findPersonByEmail(email);
        if (byEmail) {
          const full = await pd.getPerson(byEmail.id).catch(() => null);
          if (full && holds(full)) person = byEmail;
          else mismatch = true;
        }
      }
    }
    if (!person) {
      if (mismatch) console.warn('verification not recorded: the person found by email does not hold the verified number');
      return { ok: false, reason: mismatch ? 'mismatch' : 'person' };
    }
    const upd = {};
    upd[F.person.verificationStatus] = O.verificationStatus.verified;
    await pd.updatePerson(person.id, upd);
    const rec = (await openRecords(pd, person.id, null))[0] || null;
    const note = { content: toHtml(['Phone verified: ' + o.phone + ' by ' + (o.channel === 'whatsapp' ? 'WhatsApp' : 'SMS') + ' code on ' + new Date(now).toISOString().replace('T', ' ').slice(0, 16) + ' UTC (website verification step).']), person_id: person.id };
    if (rec) note[rec.kind === 'lead' ? 'lead_id' : 'deal_id'] = rec.id;
    await pd.addNote(note);
    return { ok: true, personId: person.id, kind: rec ? rec.kind : undefined, id: rec ? rec.id : undefined };
  } catch (err) {
    console.error('Pipedrive verification update failed', err && err.message);
    return { ok: false, reason: 'sync', error: err && err.message };
  }
}

function summary(fn, r) {
  return [fn, r.ok ? 'ok' : 'rejected', 'form=' + (r.form || ''), 'division=' + (r.division || ''), 'kind=' + (r.kind || ''), 'id=' + (r.id || ''),
    'score=' + (r.score || ''), 'ref=' + (r.ref || ''), r.reason ? 'reason=' + r.reason : '', r.detail ? 'detail=' + r.detail : '', r.reused ? 'reused=1' : '', r.personExisted ? 'returning=1' : '', r.personUnchanged ? 'person=unchanged' : '',
    r.confirmation ? 'email=' + (r.confirmation.sent ? 'sent' : (r.confirmation.skipped || r.confirmation.error || 'no')) : ''].filter(Boolean).join(' ');
}

module.exports = { processLead, markVerified, summary, resolveDivision, resolveSite, buildTitle, noteLines, openRecords };

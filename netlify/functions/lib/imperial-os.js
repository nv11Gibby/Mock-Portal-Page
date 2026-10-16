/* Imperial OS handoff (docs/RELATIONSHIP-JOURNEY.md 5.6, docs/LEADS.md section 11). Off by default.

   Pipedrive stays the system of record. When IMPERIAL_OS_WEBHOOK_URL and IMPERIAL_OS_WEBHOOK_SECRET are set, the
   core posts a copy of every stored relationship record (relationship.received) and of every good verification
   (relationship.verified) to that URL, signed with HMAC-SHA256 over the raw body, with an idempotency key the
   receiver can upsert on. With the URL empty nothing leaves the function and notify answers {sent:false,
   skipped:'no env'}. A failure is logged and never changes the result the page sees. Never throws.

   Record contract imperial.relationship.v1: see buildRecord below and docs/LEADS.md section 11. Which system is the
   master for a given field, the receiving endpoint and the OS-side status flow are To confirm with the owner of the
   imperial-ai-control-centre repository. */
'use strict';

const crypto = require('crypto');
const config = require('./config');

const SCHEMA = 'imperial.relationship.v1';
const TIMEOUT_MS = 5000;
const RETRY_MS = 2000;
const TRACKING = ['source', 'medium', 'campaign', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'landing', 'referrer'];

function settings() {
  return { url: config.env('IMPERIAL_OS_WEBHOOK_URL', ''), secret: config.env('IMPERIAL_OS_WEBHOOK_SECRET', '') };
}
function str(v) { return (v === undefined || v === null) ? '' : String(v); }
function iso(ms) { return new Date(ms).toISOString(); }
/* the entry point: via from the query string of the page field ('' when absent or unreadable) */
function viaOf(page) {
  try { return new URL(str(page)).searchParams.get('via') || ''; } catch (err) { return ''; }
}
function list(s) { return str(s).split(',').map((x) => x.trim()).filter(Boolean); }
function num(v) { const n = Number(v); return isNaN(n) ? null : n; }

/* The record for a stored submission. result: processLead's result object; data: the picked form data; ctx: the
   function context (submissionId, createdAt); extra: {now, score (the full score with reasons), owner}. The key
   is site:form:ref, unique per submission, so a retry of the same post carries the same key. */
function buildRecord(result, data, ctx, extra) {
  const r = result || {}, d = data || {}, c = ctx || {}, x = extra || {};
  const now = x.now || Date.now();
  const received = c.createdAt ? str(c.createdAt) : iso(now);
  const score = x.score || {};
  const attribution = {};
  TRACKING.forEach((k) => { attribution[k] = str(d[k]); });
  return {
    schema: SCHEMA,
    key: [str(r.site) || 'ihg', str(r.form), str(r.ref)].join(':'),
    event: 'relationship.received',
    site: str(r.site) || 'ihg',
    form: str(r.form),
    journey: str(r.audience),
    entry: viaOf(d.page),
    division: str(r.division),
    lead_source: str(d.lead_source) || 'website',
    status: r.ok && r.kind ? 'synced' : 'received',
    score: { band: str(r.score), points: num(r.points) || 0, reasons: Array.isArray(score.reasons) ? score.reasons.slice() : [] },
    person: { name: str(d.name), email: str(r.email || d.email), phone: str(r.phone || d.phone), country: str(d.country), nationality: str(d.nationality), reply_by: str(d.pref) },
    organisation: { name: str(d.firm), type: str(d.org_type), role: str(d.profession) },
    answers: { for_whom: str(d.for_whom), timeline: str(d.timeline), budget: str(d.budget), re_intent: str(d.re_intent), re_area: str(d.re_area), interests: list(d.interests), message: str(d.msg) },
    consent: { given: d.consent === 'yes', wording: 'v6', notice_version: '', at: received, page: str(d.page) },
    attribution,
    pipedrive: { person_id: r.personId === undefined ? null : r.personId, org_id: r.orgId === undefined ? null : r.orgId, kind: str(r.kind), id: r.id === undefined ? null : r.id, reused: !!r.reused, owner_id: num(x.owner) || 0 },
    verification: { status: 'not_verified', channel: '', at: '' },
    timestamps: { received_at: received, processed_at: iso(now), sent_at: '' },
    ref: str(r.ref),
    submission_id: str(c.submissionId)
  };
}

/* The event for a good verification code (core.markVerified). markVerified has no submission reference, only the
   person and the newest open record, so the key is site:<kind>:<id>:verified (unique per record) and the receiver
   matches it on pipedrive.id. */
function buildVerified(o) {
  const v = o || {}, now = v.now || Date.now();
  return {
    schema: SCHEMA,
    key: [str(v.site) || 'ihg', str(v.kind) || 'person', str(v.id || v.personId), 'verified'].join(':'),
    event: 'relationship.verified',
    site: str(v.site) || 'ihg',
    status: 'verified',
    person: { email: str(v.email), phone: str(v.phone) },
    pipedrive: { person_id: v.personId === undefined ? null : v.personId, kind: str(v.kind), id: v.id === undefined ? null : v.id },
    verification: { status: 'verified', channel: v.channel === 'sms' ? 'sms' : 'whatsapp', at: iso(now) },
    timestamps: { processed_at: iso(now), sent_at: '' }
  };
}

function sign(body, secret) { return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex'); }
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* POST one record. opts: {fetch, retryDelayMs, timeoutMs} (the tests pass a short delay). One retry after two seconds
   on a network error, a timeout or a 5xx; never on a 4xx. */
async function notify(record, opts) {
  const o = opts || {};
  const { url, secret } = settings();
  if (!url) return { sent: false, skipped: 'no env' };
  if (!record || !record.key) return { sent: false, skipped: 'no record' };
  if (!secret) { console.warn('imperial-os notify skipped reason=no secret key=' + record.key); return { sent: false, skipped: 'no secret', key: record.key }; }
  const body = JSON.stringify(Object.assign({}, record, { timestamps: Object.assign({}, record.timestamps || {}, { sent_at: iso(o.now || Date.now()) }) }));
  const headers = { 'Content-Type': 'application/json', 'Idempotency-Key': record.key, 'X-Imperial-Event': record.event || 'relationship.received', 'X-Imperial-Signature': sign(body, secret) };
  const f = o.fetch || fetch;
  const retryMs = o.retryDelayMs === undefined ? RETRY_MS : o.retryDelayMs;
  const timeoutMs = o.timeoutMs === undefined ? TIMEOUT_MS : o.timeoutMs;
  let reason = '';
  for (let attempt = 1; attempt <= 2; attempt++) {
    if (attempt > 1) await sleep(retryMs);
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctl ? setTimeout(() => ctl.abort(), timeoutMs) : null;
    try {
      const init = { method: 'POST', headers, body };
      if (ctl) init.signal = ctl.signal;
      const res = await f(url, init);
      const json = await res.json().catch(() => ({}));
      if (res.status === 200 || res.status === 202) return { sent: true, id: json && json.id, attempts: attempt, key: record.key };
      reason = 'status ' + res.status;
      if (res.status < 500) break;
    } catch (err) {
      reason = (err && err.name === 'AbortError') ? 'timeout' : ((err && err.message) || 'network');
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
  console.warn('imperial-os notify failed reason=' + reason + ' key=' + record.key);
  return { sent: false, error: reason, key: record.key };
}

module.exports = { notify, buildRecord, buildVerified, sign, SCHEMA };

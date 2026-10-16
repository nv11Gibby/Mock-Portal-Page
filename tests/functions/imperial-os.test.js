/* Offline tests of the Imperial OS handoff (docs/RELATIONSHIP-JOURNEY.md 5.6). Nothing leaves the process: every
   request goes to the mock fetch. Run: npm run test:functions */
'use strict';

const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { createMock } = require('./_mock');
const ratelimit = require('../../netlify/functions/lib/ratelimit');
const pipedrive = require('../../netlify/functions/lib/pipedrive');
const core = require('../../netlify/functions/lib/core');
const os = require('../../netlify/functions/lib/imperial-os');

const URL_ = 'https://os.example.test/hooks/relationship';
const SECRET = 'test-secret';

function data(over) {
  return Object.assign({ name: 'Amina Test', email: 'amina@example.com', phone: '+234 802 000 0000', country: 'Nigeria', consent: 'yes', site: 'ihg',
    about: 'citizenship', audience: 'clients', timeline: '3m', budget: 'over-1m', for_whom: 'family', utm_source: 'google', utm_medium: 'organic',
    page: 'https://www.imperialholdingsgroup.com/contact?about=citizenship&via=division-hero' }, over);
}
function ctx(over) { return Object.assign({ ip: '198.51.100.' + Math.floor(Math.random() * 250), site: 'ihg' }, over); }

/* the mock Pipedrive plus a scripted Imperial OS receiver: statuses[i] answers the i-th post (default 202) */
let m, osCalls, statuses;
function osFetch(url, init) {
  if (String(url).indexOf(URL_) === 0) {
    osCalls.push({ url, init });
    const s = statuses.length ? statuses.shift() : 202;
    if (s === 'network') return Promise.reject(new Error('socket hang up'));
    return Promise.resolve(new Response(JSON.stringify(s < 300 ? { ok: true, id: 'os-1' } : { ok: false }), { status: s, headers: { 'content-type': 'application/json' } }));
  }
  return m.handle(url, init);
}

beforeEach(() => {
  m = createMock().install();
  global.fetch = osFetch;
  osCalls = []; statuses = [];
  ratelimit.reset();
  pipedrive.resetLeadLabelCache();
  process.env.PIPEDRIVE_API_TOKEN = 'test-token';
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.EMAIL_API_KEY;
  delete process.env.EMAIL_FROM;
  delete process.env.IMPERIAL_OS_WEBHOOK_URL;
  delete process.env.IMPERIAL_OS_WEBHOOK_SECRET;
});
afterEach(() => {
  delete process.env.IMPERIAL_OS_WEBHOOK_URL;
  delete process.env.IMPERIAL_OS_WEBHOOK_SECRET;
});

test('without the env nothing is sent and the result says so', async () => {
  const r = await core.processLead({ form: 'contact', data: data(), ctx: ctx() });
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.deepEqual(r.imperialOs, { sent: false, skipped: 'no env' });
  assert.equal(osCalls.length, 0);
  assert.equal(m.calls.filter((c) => c.host === 'os.example.test').length, 0);
  /* the URL without the secret is refused too: nothing unsigned leaves the function */
  process.env.IMPERIAL_OS_WEBHOOK_URL = URL_;
  const s = await os.notify({ key: 'ihg:contact:W1', event: 'relationship.received' }, { fetch: osFetch });
  assert.equal(s.sent, false);
  assert.equal(s.skipped, 'no secret');
  assert.equal(osCalls.length, 0);
});

test('a lead that was not stored is never sent', async () => {
  process.env.IMPERIAL_OS_WEBHOOK_URL = URL_;
  process.env.IMPERIAL_OS_WEBHOOK_SECRET = SECRET;
  delete process.env.PIPEDRIVE_API_TOKEN;
  const r = await core.processLead({ form: 'contact', data: data(), ctx: ctx() });
  assert.equal(r.ok, false);
  assert.equal(r.imperialOs.skipped, 'lead not stored');
  assert.equal(osCalls.length, 0);
});

test('with the env: the record contract, the idempotency key and the signature', async () => {
  process.env.IMPERIAL_OS_WEBHOOK_URL = URL_;
  process.env.IMPERIAL_OS_WEBHOOK_SECRET = SECRET;
  const r = await core.processLead({ form: 'contact', data: data(), ctx: ctx({ ref: 'W1234ABCD', submissionId: 'e2e-0001', createdAt: '2026-10-15T16:13:00.000Z' }) });
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.imperialOs.sent, true);
  assert.equal(r.imperialOs.id, 'os-1');
  assert.equal(osCalls.length, 1);
  const { init } = osCalls[0];
  assert.equal(init.method, 'POST');
  assert.equal(init.headers['Content-Type'], 'application/json');
  assert.equal(init.headers['Idempotency-Key'], 'ihg:contact:W1234ABCD');
  assert.equal(init.headers['X-Imperial-Event'], 'relationship.received');
  const expected = 'sha256=' + crypto.createHmac('sha256', SECRET).update(init.body).digest('hex');
  assert.equal(init.headers['X-Imperial-Signature'], expected);
  const b = JSON.parse(init.body);
  assert.equal(b.schema, 'imperial.relationship.v1');
  assert.equal(b.key, 'ihg:contact:W1234ABCD');
  assert.equal(b.event, 'relationship.received');
  assert.equal(b.journey, 'clients');
  assert.equal(b.entry, 'division-hero');
  assert.equal(b.division, 'citizenship');
  assert.equal(b.status, 'synced');
  assert.equal(b.score.band, 'hot');
  assert.ok(b.score.points > 0);
  assert.ok(Array.isArray(b.score.reasons));
  assert.equal(b.person.email, 'amina@example.com');
  assert.equal(b.person.phone, '+2348020000000');
  assert.equal(b.answers.timeline, '3m');
  assert.deepEqual(b.answers.interests, []);
  assert.equal(b.consent.given, true);
  assert.equal(b.consent.wording, 'v6');
  assert.equal(b.consent.at, '2026-10-15T16:13:00.000Z');
  assert.equal(b.attribution.utm_source, 'google');
  assert.equal(b.pipedrive.kind, 'lead');
  assert.equal(b.pipedrive.id, r.id);
  assert.equal(b.pipedrive.person_id, r.personId);
  assert.equal(b.timestamps.received_at, '2026-10-15T16:13:00.000Z');
  assert.ok(b.timestamps.sent_at, 'sent_at is set at the post');
  assert.equal(b.submission_id, 'e2e-0001');
  assert.equal(b.ref, 'W1234ABCD');
});

test('institutions: the organisation block and the interests list', async () => {
  process.env.IMPERIAL_OS_WEBHOOK_URL = URL_;
  process.env.IMPERIAL_OS_WEBHOOK_SECRET = SECRET;
  await core.processLead({ form: 'contact', data: data({ about: 'group', audience: 'institutions', firm: 'Example Embassy', org_type: 'mission', profession: 'Counsellor', interests: 'Investment, Education', budget: '' }), ctx: ctx() });
  const b = JSON.parse(osCalls[0].init.body);
  assert.equal(b.journey, 'institutions');
  assert.deepEqual(b.organisation, { name: 'Example Embassy', type: 'mission', role: 'Counsellor' });
  assert.deepEqual(b.answers.interests, ['Investment', 'Education']);
  assert.equal(b.pipedrive.kind, 'deal');
  assert.ok(b.pipedrive.org_id);
});

test('a 5xx is retried once; a 4xx is not retried', async () => {
  process.env.IMPERIAL_OS_WEBHOOK_URL = URL_;
  process.env.IMPERIAL_OS_WEBHOOK_SECRET = SECRET;
  const rec = { key: 'ihg:contact:W1', event: 'relationship.received', timestamps: {} };
  statuses = [503, 200];
  const a = await os.notify(rec, { fetch: osFetch, retryDelayMs: 0 });
  assert.equal(a.sent, true);
  assert.equal(a.attempts, 2);
  assert.equal(osCalls.length, 2);
  assert.equal(osCalls[0].init.headers['Idempotency-Key'], osCalls[1].init.headers['Idempotency-Key'], 'the retry carries the same key');
  osCalls = []; statuses = [500, 500];
  const b = await os.notify(rec, { fetch: osFetch, retryDelayMs: 0 });
  assert.equal(b.sent, false);
  assert.equal(b.error, 'status 500');
  assert.equal(osCalls.length, 2, 'one retry only');
  osCalls = []; statuses = ['network', 202];
  const c = await os.notify(rec, { fetch: osFetch, retryDelayMs: 0 });
  assert.equal(c.sent, true);
  assert.equal(osCalls.length, 2, 'a network error is retried');
  osCalls = []; statuses = [400, 200];
  const d = await os.notify(rec, { fetch: osFetch, retryDelayMs: 0 });
  assert.equal(d.sent, false);
  assert.equal(d.error, 'status 400');
  assert.equal(osCalls.length, 1, 'no retry on a 4xx');
});

test('a failure never changes the result processLead returns', async () => {
  const base = await core.processLead({ form: 'contact', data: data({ email: 'one@example.com', phone: '' }), ctx: ctx() });
  process.env.IMPERIAL_OS_WEBHOOK_URL = URL_;
  process.env.IMPERIAL_OS_WEBHOOK_SECRET = SECRET;
  statuses = [500, 500];
  const r = await core.processLead({ form: 'contact', data: data({ email: 'two@example.com', phone: '' }), ctx: ctx({ imperialOsRetryMs: 0 }) });
  assert.equal(r.ok, true);
  assert.equal(r.kind, base.kind);
  assert.equal(r.score, base.score);
  assert.equal(r.imperialOs.sent, false);
  assert.equal(osCalls.length, 2);
  assert.ok(core.summary('lead', r).indexOf('os=status 500') > -1, 'the log line says the copy failed: ' + core.summary('lead', r));
  assert.equal(core.summary('lead', base).indexOf('os='), -1, 'nothing in the log line while the handoff is off');
  /* a throwing transport is caught as well */
  const t = await core.processLead({ form: 'contact', data: data({ email: 'three@example.com', phone: '' }), ctx: ctx({ fetch: (u, i) => String(u).indexOf(URL_) === 0 ? Promise.reject(new Error('boom')) : m.handle(u, i), imperialOsRetryMs: 0 }) });
  assert.equal(t.ok, true);
  assert.equal(t.imperialOs.sent, false);
});

test('markVerified sends the verification event when the env is set', async () => {
  process.env.IMPERIAL_OS_WEBHOOK_URL = URL_;
  process.env.IMPERIAL_OS_WEBHOOK_SECRET = SECRET;
  const p = m.seedPerson({ name: 'Amina Test', email: 'amina@example.com', phone: '+2348020000000' });
  const lead = m.seedLead({ person_id: p.id, title: 'Website: Amina Test · Imperial Citizenship' });
  const r = await core.markVerified({ email: 'amina@example.com', phone: '+2348020000000', channel: 'sms', retryDelayMs: 0, fetch: osFetch });
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.imperialOs.sent, true);
  const b = JSON.parse(osCalls[0].init.body);
  assert.equal(b.event, 'relationship.verified');
  assert.equal(osCalls[0].init.headers['X-Imperial-Event'], 'relationship.verified');
  assert.equal(b.key, 'ihg:lead:' + lead.id + ':verified');
  assert.equal(b.verification.status, 'verified');
  assert.equal(b.verification.channel, 'sms');
  assert.equal(b.pipedrive.person_id, p.id);
});

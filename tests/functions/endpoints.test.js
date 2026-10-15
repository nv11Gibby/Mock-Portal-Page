/* The two HTTP entry points: lead.js (direct JSON fallback) and submission-created.js (Netlify Forms event). */
'use strict';

const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createMock } = require('./_mock');
const ratelimit = require('../../netlify/functions/lib/ratelimit');
const pipedrive = require('../../netlify/functions/lib/pipedrive');
const lead = require('../../netlify/functions/lead');
const created = require('../../netlify/functions/submission-created');

const HOST = 'www.imperialholdingsgroup.com';
function data(over) {
  return Object.assign({ name: 'Amina Test', email: 'amina@example.com', phone: '+2348020000000', country: 'Nigeria', msg: 'Hello', consent: 'yes', division: 'citizenship',
    source: 'direct', medium: '', campaign: '', utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '', utm_term: '', gclid: '', fbclid: '',
    landing: 'https://www.imperialholdingsgroup.com/', referrer: '', page: 'https://www.imperialholdingsgroup.com/' }, over);
}
function post(body, over) {
  return Object.assign({ httpMethod: 'POST', headers: { host: HOST, origin: 'https://' + HOST, 'x-nf-client-connection-ip': '203.0.113.' + Math.floor(Math.random() * 250) }, body: typeof body === 'string' ? body : JSON.stringify(body) }, over);
}
function out(res) { return JSON.parse(res.body); }

let m;
beforeEach(() => {
  m = createMock().install();
  ratelimit.reset();
  pipedrive.resetLeadLabelCache();
  process.env.PIPEDRIVE_API_TOKEN = 'test-token';
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.LEAD_ALLOWED_ORIGINS;
});

test('lead.js: same-origin JSON post creates the record and answers ok with a reference', async () => {
  const res = await lead.handler(post({ form: 'enquiry', data: data() }));
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['Content-Type'], 'application/json; charset=utf-8');
  assert.equal(res.headers['Access-Control-Allow-Origin'], 'https://' + HOST);
  const o = out(res);
  assert.equal(o.ok, true);
  assert.ok(/^W[0-9A-Z]+$/.test(o.ref), o.ref);
  assert.equal(o.kind, 'lead');
  assert.ok(m.notes[0].content.indexOf('Ref ' + o.ref) > -1, 'the reference is in the note');
  assert.ok(m.notes[0].content.indexOf('Direct submission (fallback endpoint)') > -1);
});

test('lead.js: honeypot, disposable email and unknown form answer ok:false with a reason', async () => {
  assert.deepEqual(out(await lead.handler(post({ form: 'enquiry', data: data({ company_url: 'x' }) }))).reason, 'honeypot');
  assert.equal(out(await lead.handler(post({ form: 'enquiry', data: data({ email: 'a@guerrillamail.com' }) }))).reason, 'disposable');
  assert.equal(out(await lead.handler(post({ form: 'newsletter', data: data() }))).reason, 'form');
  assert.equal(m.find('POST', /\/persons$/).length, 0);
});

test('lead.js: other origins get 403, other methods 405, bad bodies 400, preflight 204', async () => {
  const cross = await lead.handler(post({ form: 'enquiry', data: data() }, { headers: { host: HOST, origin: 'https://evil.example' } }));
  assert.equal(cross.statusCode, 403);
  assert.equal(out(cross).reason, 'origin');
  assert.equal(cross.headers['Access-Control-Allow-Origin'], undefined);
  process.env.LEAD_ALLOWED_ORIGINS = 'https://imperialcitizenship.com, https://partners.example';
  const sister = await lead.handler(post({ form: 'enquiry', data: data({ email: 'sister@example.com', site: 'citizenship' }) }, { headers: { host: HOST, origin: 'https://imperialcitizenship.com' } }));
  assert.equal(sister.statusCode, 200, 'an allowed sister site origin passes');
  assert.equal(out(sister).ok, true);
  const noOrigin = await lead.handler(post({ form: 'enquiry', data: data({ email: 'curl@example.com' }) }, { headers: { host: HOST } }));
  assert.equal(noOrigin.statusCode, 200, 'a request without an Origin header is not a cross-site browser call');
  assert.equal((await lead.handler(post({}, { httpMethod: 'GET' }))).statusCode, 405);
  assert.equal((await lead.handler(post('{not json'))).statusCode, 400);
  assert.equal((await lead.handler(post({ form: 'enquiry' }))).statusCode, 400);
  const pre = await lead.handler(post('', { httpMethod: 'OPTIONS' }));
  assert.equal(pre.statusCode, 204);
  assert.equal(pre.headers['Access-Control-Allow-Methods'], 'POST, OPTIONS');
});

test('lead.js: a Pipedrive failure answers ok:false so the page shows the office contacts', async () => {
  m.failPipedrive = true;
  const o = out(await lead.handler(post({ form: 'enquiry', data: data() })));
  assert.equal(o.ok, false);
  assert.equal(o.reason, 'sync');
  delete process.env.PIPEDRIVE_API_TOKEN;
  assert.equal(out(await lead.handler(post({ form: 'contact', data: data({ about: 'group' }) }))).reason, 'unconfigured');
});

test('submission-created: a Netlify Forms event creates the record and always answers 200', async () => {
  const payload = { id: 'abc123def456', form_name: 'contact', created_at: '2026-10-15T09:00:00Z', data: data({ division: undefined, about: 'partners-club', firm: 'Test LLP', profession: 'Banker', ip: '203.0.113.50' }) };
  const res = await created.handler({ httpMethod: 'POST', body: JSON.stringify({ payload }) });
  assert.equal(res.statusCode, 200);
  const o = out(res);
  assert.equal(o.ok, true);
  assert.equal(o.kind, 'deal');
  assert.equal(o.ref, 'N23DEF456');
  assert.ok(m.notes[0].content.indexOf('Netlify submission: abc123def456 at 2026-10-15T09:00:00Z') > -1);
  m.failPipedrive = true;
  const fail = await created.handler({ httpMethod: 'POST', body: JSON.stringify({ payload: Object.assign({}, payload, { id: 'x2' }) }) });
  assert.equal(fail.statusCode, 200, 'a failure never loses the Netlify submission');
  assert.equal(out(fail).ok, false);
  assert.equal((await created.handler({ httpMethod: 'POST', body: 'nope' })).statusCode, 400);
  const hp = await created.handler({ httpMethod: 'POST', body: JSON.stringify({ payload: { id: 'x3', form_name: 'enquiry', data: data({ company_url: 'spam' }) } }) });
  assert.equal(out(hp).reason, 'honeypot');
});

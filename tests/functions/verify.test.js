/* Phone verification function against the mocked Twilio Verify and Pipedrive APIs. */
'use strict';

const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createMock } = require('./_mock');
const ratelimit = require('../../netlify/functions/lib/ratelimit');
const verify = require('../../netlify/functions/verify');
const routing = require('../../shared/lead-routing.json');

const F = routing.pipedrive.fields, O = routing.pipedrive.options;
const HOST = 'www.imperialholdingsgroup.com';
function event(body, over) {
  return Object.assign({ httpMethod: 'POST', headers: { host: HOST, origin: 'https://' + HOST, 'x-nf-client-connection-ip': '203.0.113.9' }, body: JSON.stringify(body) }, over);
}
function out(res) { return JSON.parse(res.body); }
function twilioOn() { process.env.TWILIO_ACCOUNT_SID = 'AC1'; process.env.TWILIO_AUTH_TOKEN = 'tok'; process.env.TWILIO_VERIFY_SERVICE_SID = 'VA1'; }

let m;
beforeEach(() => {
  m = createMock().install();
  ratelimit.reset();
  process.env.PIPEDRIVE_API_TOKEN = 'test-token';
  process.env.VERIFY_RETRY_DELAY_MS = '0';
  delete process.env.TWILIO_ACCOUNT_SID; delete process.env.TWILIO_AUTH_TOKEN; delete process.env.TWILIO_VERIFY_SERVICE_SID;
});

test('start without the Twilio env answers enabled:false and sends nothing', async () => {
  const res = await verify.handler(event({ action: 'start', phone: '+234 802 000 0000', email: 'amina@example.com', channel: 'whatsapp' }));
  assert.equal(res.statusCode, 200);
  assert.deepEqual(out(res), { ok: true, enabled: false });
  assert.equal(m.calls.length, 0);
});

test('start with the env sends a WhatsApp code through Twilio Verify and returns the reference', async () => {
  twilioOn();
  const res = await verify.handler(event({ action: 'start', phone: '+234 802 000 0000', email: 'amina@example.com', channel: 'whatsapp' }));
  const o = out(res);
  assert.equal(o.ok, true);
  assert.equal(o.enabled, true);
  assert.ok(/^VE/.test(o.ref));
  const call = m.find('POST', /\/Services\/VA1\/Verifications$/)[0];
  assert.ok(call, 'Twilio called');
  assert.equal(call.body.To, '+2348020000000');
  assert.equal(call.body.Channel, 'whatsapp');
  assert.equal(call.headers.Authorization, 'Basic ' + Buffer.from('AC1:tok').toString('base64'));
  const bad = out(await verify.handler(event({ action: 'start', phone: '0802 000 0000', channel: 'sms' })));
  assert.equal(bad.ok, false);
  assert.equal(bad.reason, 'phone', 'a number without a country code cannot be verified');
});

test('start is rate limited per address', async () => {
  twilioOn();
  for (let i = 0; i < 5; i++) assert.equal(out(await verify.handler(event({ action: 'start', phone: '+971501234567', channel: 'sms' }))).ok, true);
  assert.equal(out(await verify.handler(event({ action: 'start', phone: '+971501234567', channel: 'sms' }))).reason, 'rate');
});

test('check with the right code marks the person Verified and notes the newest open lead', async () => {
  twilioOn();
  const p = m.seedPerson({ name: 'Amina Test', email: 'amina@example.com', phone: '+2348020000000', custom: { [F.person.verificationStatus]: O.verificationStatus.notVerified } });
  const lead = m.seedLead({ person_id: p.id, title: '[HOT] Website: Amina Test · Imperial Citizenship' });
  await verify.handler(event({ action: 'start', phone: '+2348020000000', email: 'amina@example.com', channel: 'sms' }));
  const res = await verify.handler(event({ action: 'check', ref: 'VE1', phone: '+2348020000000', code: '123456', email: 'amina@example.com' }));
  const o = out(res);
  assert.equal(o.ok, true);
  assert.equal(o.verified, true);
  assert.equal(o.recorded, true);
  assert.equal(o.kind, 'lead');
  assert.equal(o.id, lead.id);
  const check = m.find('POST', /\/VerificationCheck$/)[0];
  assert.equal(check.body.Code, '123456');
  const put = m.find('PUT', /\/persons\/\d+$/)[0];
  assert.equal(put.body[F.person.verificationStatus], O.verificationStatus.verified);
  assert.equal(m.notes.length, 1);
  assert.equal(m.notes[0].lead_id, lead.id);
  assert.ok(m.notes[0].content.indexOf('by SMS code') > -1);
});

test('check: a right code for a number nobody holds answers verified:true, recorded:false with the reason, and writes nothing', async () => {
  twilioOn();
  /* the person named by email holds another number: the code proves the attacker's phone, not the victim's */
  const victim = m.seedPerson({ name: 'Victim', email: 'victim@example.com', phone: '+971500000001', custom: { [F.person.verificationStatus]: O.verificationStatus.notVerified } });
  m.seedLead({ person_id: victim.id, title: 'Website: Victim · Imperial Citizenship' });
  await verify.handler(event({ action: 'start', phone: '+2348020009999', email: 'victim@example.com', channel: 'sms' }));
  const o = out(await verify.handler(event({ action: 'check', phone: '+2348020009999', code: '123456', email: 'victim@example.com' })));
  assert.equal(o.ok, true);
  assert.equal(o.verified, true);
  assert.equal(o.recorded, false);
  assert.equal(o.reason, 'mismatch');
  assert.equal(o.kind, undefined);
  assert.equal(m.find('PUT', /\/persons/).length, 0);
  assert.equal(m.notes.length, 0);
  assert.equal(victim[F.person.verificationStatus], O.verificationStatus.notVerified);
  /* nobody in Pipedrive yet (submission-created still running): the code is accepted, the team marks by hand */
  await verify.handler(event({ action: 'start', phone: '+2348020007777', email: 'new@example.com', channel: 'sms' }));
  const none = out(await verify.handler(event({ action: 'check', phone: '+2348020007777', code: '123456', email: 'new@example.com' })));
  assert.deepEqual(none, { ok: true, verified: true, recorded: false, reason: 'person' });
});

test('check with a wrong code answers verified:false and touches nothing in Pipedrive', async () => {
  twilioOn();
  m.seedPerson({ name: 'Amina Test', email: 'amina@example.com', phone: '+2348020000000' });
  await verify.handler(event({ action: 'start', phone: '+2348020000000', channel: 'sms' }));
  const o = out(await verify.handler(event({ action: 'check', phone: '+2348020000000', code: '000000', email: 'amina@example.com' })));
  assert.equal(o.ok, true);
  assert.equal(o.verified, false);
  assert.equal(o.reason, 'code');
  assert.equal(m.find('PUT', /\/persons/).length, 0);
  const malformed = out(await verify.handler(event({ action: 'check', phone: '+2348020000000', code: 'abc', email: 'amina@example.com' })));
  assert.equal(malformed.reason, 'code');
  delete process.env.TWILIO_ACCOUNT_SID;
  const off = out(await verify.handler(event({ action: 'check', phone: '+2348020000000', code: '123456' })));
  assert.deepEqual(off, { ok: false, verified: false, reason: 'disabled' });
});

test('other origins and other methods are refused', async () => {
  const cross = await verify.handler(event({ action: 'start' }, { headers: { host: HOST, origin: 'https://evil.example' } }));
  assert.equal(cross.statusCode, 403);
  const get = await verify.handler(event({}, { httpMethod: 'GET' }));
  assert.equal(get.statusCode, 405);
  const unknown = out(await verify.handler(event({ action: 'dance' })));
  assert.equal(unknown.reason, 'action');
});

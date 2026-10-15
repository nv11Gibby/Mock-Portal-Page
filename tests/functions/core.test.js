/* Offline tests of the submission core against the mocked Pipedrive API. Run: npm run test:functions */
'use strict';

const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createMock } = require('./_mock');
const ratelimit = require('../../netlify/functions/lib/ratelimit');
const core = require('../../netlify/functions/lib/core');
const routing = require('../../shared/lead-routing.json');
const schema = require('../../shared/lead-schema.json');

const F = routing.pipedrive.fields, O = routing.pipedrive.options;
const TRACKING = {
  source: 'google', medium: 'organic', campaign: 'spring-2026', utm_source: 'google', utm_medium: 'organic', utm_campaign: 'spring-2026',
  utm_content: 'hero', utm_term: 'second-citizenship', gclid: '', fbclid: '', landing: 'https://www.imperialholdingsgroup.com/',
  referrer: 'https://www.google.com/', page: 'https://www.imperialholdingsgroup.com/contact'
};
function data(over) {
  return Object.assign({ name: 'Amina Test', email: 'amina@example.com', phone: '+234 802 000 0000', country: 'Nigeria', msg: 'Hello from the test.',
    consent: 'yes', site: 'ihg' }, TRACKING, over);
}
function ctx(over) { return Object.assign({ ip: '203.0.113.' + Math.floor(Math.random() * 250), site: 'ihg' }, over); }

let m;
beforeEach(() => {
  m = createMock().install();
  ratelimit.reset();
  process.env.PIPEDRIVE_API_TOKEN = 'test-token';
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.EMAIL_API_KEY;
  delete process.env.EMAIL_FROM;
});

const EXPECT = {
  citizenship: { kind: 'lead', division: 1128, contact: 230 },
  'private-office': { kind: 'lead', division: 1130, contact: 230 },
  'partners-club': { kind: 'deal', pipeline: 2, stage: 7, contact: 231 },
  academy: { kind: 'deal', pipeline: 2, stage: 7, contact: 231 },
  'real-estate': { kind: 'lead', division: 1129, contact: 230 },
  group: { kind: 'deal', pipeline: 26, stage: 163, division: 1131, contact: undefined }
};

Object.keys(EXPECT).forEach((div) => {
  test('division ' + div + ': right kind, owner, pipeline, stage, score and a note with every tracking field', async () => {
    const e = EXPECT[div], cfg = routing.divisions[div];
    const r = await core.processLead({ form: 'contact', data: data({ about: div, timeline: '3m', budget: '500k-1m', for_whom: 'family', nationality: 'Nigeria' }), ctx: ctx() });
    assert.equal(r.ok, true, JSON.stringify(r));
    assert.equal(r.kind, e.kind);
    assert.equal(r.division, div);
    assert.equal(r.score, 'hot');
    const posts = m.find('POST', e.kind === 'deal' ? /\/deals$/ : /\/leads$/);
    assert.ok(posts.length >= 1, 'record created');
    const body = posts[posts.length - 1].body;
    assert.ok(body.title.indexOf('[HOT] Website: Amina Test · ' + cfg.name) === 0, body.title);
    if (e.kind === 'deal') {
      assert.equal(body.pipeline_id, e.pipeline);
      assert.equal(body.stage_id, e.stage);
      assert.deepEqual(body.label_ids, [O.label.hot]);
      assert.equal(body.user_id, cfg.owner || undefined);
    } else {
      assert.equal(body.owner_id, cfg.owner || undefined);
    }
    assert.equal(body[F.deal.division], e.division);
    assert.equal(body[F.deal.contactType], e.contact);
    assert.equal(body[F.deal.sourcePlatform], O.sourcePlatform.website);
    assert.equal(body[F.deal.sourceMethod], O.sourceMethod.organic);
    assert.equal(body[F.deal.urgency], O.urgency.urgent, 'within 3 months is urgent');
    assert.equal(body[F.deal.campaignName], 'spring-2026');
    assert.ok(body[F.deal.expectedCloseDate], 'expected close date for a 3 month timeline');
    assert.equal(body.person_id, r.personId);
    const person = m.find('POST', /\/persons$/)[0].body;
    assert.equal(person[F.person.verificationStatus], O.verificationStatus.notVerified);
    assert.equal(person[F.person.nationality], routing.personOptions.nationality.Nigeria);
    assert.equal(person[F.person.countryOfResidence], routing.personOptions.countryOfResidence.Nigeria);
    assert.equal(person.owner_id, cfg.owner || undefined);
    assert.equal(m.notes.length, 1);
    const note = m.notes[0];
    assert.equal(note[e.kind === 'deal' ? 'deal_id' : 'lead_id'], r.id);
    assert.equal(note.person_id, r.personId);
    schema.tracking.forEach((k) => assert.ok(note.content.indexOf(k + ': ' + TRACKING[k]) > -1, 'note has ' + k));
    assert.ok(note.content.indexOf('Score: HOT') > -1);
    assert.ok(note.content.indexOf('Enquiry for: my family') > -1);
    assert.ok(note.content.indexOf('Timeline: Within 3 months · Budget: US$500,000 to 1 million') > -1);
    assert.equal(m.activities.length, 0, 'no activity for a new person');
  });
});

test('owner from the config file flows to the person, the record and the activity', async () => {
  const saved = routing.divisions.citizenship.owner;
  routing.divisions.citizenship.owner = 4242;
  try {
    m.seedPerson({ name: 'Old Contact', email: 'old@example.com' });
    const r = await core.processLead({ form: 'enquiry', data: data({ email: 'old@example.com', division: 'citizenship', audience: 'clients' }), ctx: ctx() });
    assert.equal(r.ok, true);
    assert.equal(m.find('POST', /\/leads$/).pop().body.owner_id, 4242);
    assert.equal(m.activities[0].user_id, 4242);
  } finally { routing.divisions.citizenship.owner = saved; }
});

test('disposable email is rejected before any API call', async () => {
  const r = await core.processLead({ form: 'contact', data: data({ email: 'someone@Mailinator.com', about: 'citizenship' }), ctx: ctx() });
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'disposable');
  assert.equal(m.calls.length, 0);
  const sub = await core.processLead({ form: 'contact', data: data({ email: 'x@box.10minutemail.com', about: 'citizenship' }), ctx: ctx() });
  assert.equal(sub.reason, 'disposable', 'subdomains are blocked too');
  const bad = await core.processLead({ form: 'contact', data: data({ email: 'not-an-email', about: 'citizenship' }), ctx: ctx() });
  assert.equal(bad.reason, 'email');
});

test('honeypot is rejected before any API call', async () => {
  const r = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', company_url: 'https://spam.example' }), ctx: ctx() });
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'honeypot');
  assert.equal(m.calls.length, 0);
});

test('Turnstile: a rejected token fails, a good one passes, a missing one fails when the secret is set', async () => {
  process.env.TURNSTILE_SECRET_KEY = 'secret';
  m.turnstileOk = false;
  const bad = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', 'cf-turnstile-response': 'tok' }), ctx: ctx() });
  assert.equal(bad.ok, false);
  assert.equal(bad.reason, 'turnstile');
  assert.equal(m.find('POST', /siteverify/).length, 1);
  assert.equal(m.find('POST', /\/persons$/).length, 0);
  m.turnstileOk = true;
  const good = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', 'cf-turnstile-response': 'tok' }), ctx: ctx() });
  assert.equal(good.ok, true);
  assert.equal(m.find('POST', /siteverify/)[1].body.response, 'tok');
  const missing = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship' }), ctx: ctx() });
  assert.equal(missing.reason, 'turnstile');
});

test('dedupe by email: person reused, note and activity added, open lead of the same division reused', async () => {
  m.seedPerson({ name: 'Amina Test', email: 'amina@example.com', phone: '+2348020000000' });
  const first = await core.processLead({ form: 'contact', data: data({ about: 'citizenship', timeline: '3-12m' }), ctx: ctx() });
  assert.equal(first.ok, true);
  assert.equal(first.personExisted, true);
  assert.equal(m.find('POST', /\/persons$/).length, 0, 'no new person');
  assert.equal(m.leads.length, 1, 'a lead is still created when none is open');
  assert.equal(m.activities.length, 1);
  assert.equal(m.activities[0].subject, routing.pipedrive.activity.subject);
  assert.equal(m.activities[0].type, routing.pipedrive.activity.type);
  assert.equal(m.activities[0].due_date, new Date().toISOString().slice(0, 10));
  assert.equal(m.activities[0].lead_id, first.id);
  const second = await core.processLead({ form: 'contact', data: data({ about: 'citizenship', msg: 'Following up.' }), ctx: ctx() });
  assert.equal(second.ok, true);
  assert.equal(second.reused, true);
  assert.equal(second.id, first.id, 'the open lead is reused');
  assert.equal(m.leads.length, 1);
  assert.equal(m.notes.length, 2);
  assert.ok(m.notes[1].content.indexOf('Following up.') > -1);
  assert.equal(m.activities.length, 2);
  const other = await core.processLead({ form: 'contact', data: data({ about: 'partners-club', firm: 'Test LLP', profession: 'Lawyer' }), ctx: ctx() });
  assert.equal(other.kind, 'deal');
  assert.equal(other.reused, false, 'a different division gets its own record');
});

test('dedupe by phone: a different email on a known number reuses the person and adds the email', async () => {
  const p = m.seedPerson({ name: 'Amina Test', email: 'amina.work@example.com', phone: '0802 000 0000' });
  const r = await core.processLead({ form: 'enquiry', data: data({ division: 'private-office', email: 'amina.home@example.com', phone: '+234 802 000 0000' }), ctx: ctx() });
  assert.equal(r.ok, true);
  assert.equal(r.personId, p.id);
  assert.equal(m.find('POST', /\/persons$/).length, 0);
  const put = m.find('PUT', /\/persons\/\d+$/)[0];
  assert.ok(put, 'person updated');
  assert.deepEqual(put.body.email.map((e) => e.value), ['amina.work@example.com', 'amina.home@example.com']);
  assert.equal(put.body[F.person.verificationStatus], O.verificationStatus.notVerified);
  assert.equal(m.activities.length, 1);
});

test('returning person: when the full person cannot be fetched, nothing is written to the person, so no list is overwritten', async () => {
  const p = m.seedPerson({ name: 'Known Client', email: 'known@example.com', phone: '+971 50 111 2222' });
  p.email.push({ value: 'second@example.com', primary: false, label: 'home' });
  m.failGetPerson = 429;
  const r = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', email: 'known@example.com', phone: '+234 902 222 2024' }), ctx: ctx() });
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.personExisted, true);
  assert.equal(r.personUnchanged, true);
  assert.equal(m.find('PUT', /\/persons\/\d+$/).length, 0, 'no PUT on the person');
  assert.equal(m.find('POST', /\/persons$/).length, 0, 'no new person either');
  assert.deepEqual(p.email.map((e) => e.value), ['known@example.com', 'second@example.com'], 'both emails kept');
  assert.deepEqual(p.phone.map((e) => e.value), ['+971 50 111 2222'], 'the old phone kept');
  assert.equal(m.leads.length, 1, 'the lead is still created');
  assert.ok(m.notes[0].content.indexOf('Phone: +234 902 222 2024') > -1, 'the new phone is in the note');
  assert.ok(core.summary('test', r).indexOf('person=unchanged') > -1);
  m.failGetPerson = 0;
  const ok = await core.processLead({ form: 'enquiry', data: data({ division: 'private-office', email: 'known@example.com', phone: '+234 902 222 2024' }), ctx: ctx() });
  assert.equal(ok.personUnchanged, false);
  const put = m.find('PUT', /\/persons\/\d+$/)[0];
  assert.deepEqual(put.body.phone.map((e) => e.value), ['+971 50 111 2222', '+2349022222024'], 'with the full person the phone is added in E.164, nothing dropped');
  assert.equal(put.body.email, undefined, 'the known email needs no change');
});

test('rate limit: the sixth submission from one address in ten minutes is refused', async () => {
  const ip = '198.51.100.7';
  for (let i = 0; i < 5; i++) {
    const r = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', email: 'p' + i + '@example.com' }), ctx: ctx({ ip }) });
    assert.equal(r.ok, true, 'submission ' + (i + 1));
  }
  const r6 = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', email: 'p6@example.com' }), ctx: ctx({ ip }) });
  assert.equal(r6.ok, false);
  assert.equal(r6.reason, 'rate');
  const other = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', email: 'p7@example.com' }), ctx: ctx({ ip: '198.51.100.8' }) });
  assert.equal(other.ok, true, 'another address is not affected');
});

test('lead label: tried as label_ids, then the title prefix carries the score when the API rejects it', async () => {
  const r = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', timeline: '3-12m', budget: '250k-500k' }), ctx: ctx() });
  assert.equal(r.ok, true);
  assert.equal(r.score, 'warm');
  const posts = m.find('POST', /\/leads$/);
  assert.equal(posts.length, 2, 'first with label_ids, then without');
  assert.deepEqual(posts[0].body.label_ids, [O.label.warm]);
  assert.equal(posts[1].body.label_ids, undefined);
  assert.ok(posts[1].body.title.indexOf('[WARM] ') === 0);
  assert.equal(r.labelRejected, true);
  m.leadsAcceptLabels = true;
  const r2 = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', email: 'two@example.com', phone: '+971 50 123 4567', timeline: '3-12m', budget: '250k-500k' }), ctx: ctx() });
  assert.equal(r2.labelRejected, false);
  assert.equal(m.find('POST', /\/leads$/).length, 3);
  assert.deepEqual(m.find('POST', /\/leads$/)[2].body.label_ids, [O.label.warm]);
});

test('nationality and country go on the person only when they match an option label', async () => {
  const r = await core.processLead({ form: 'contact', data: data({ about: 'citizenship', nationality: 'Nigerian and British', country: 'united arab emirates' }), ctx: ctx() });
  assert.equal(r.ok, true);
  const person = m.find('POST', /\/persons$/)[0].body;
  assert.equal(person[F.person.nationality], undefined, 'demonyms are not guessed');
  assert.equal(person[F.person.countryOfResidence], routing.personOptions.countryOfResidence['United Arab Emirates']);
  assert.ok(m.notes[0].content.indexOf('Nationality: Nigerian and British (no matching Pipedrive option, kept as text)') > -1);
  const r2 = await core.processLead({ form: 'contact', data: data({ about: 'citizenship', email: 'two@example.com', phone: '+971 50 123 4567', nationality: 'Lebanon, Canada' }), ctx: ctx() });
  assert.equal(r2.ok, true);
  assert.equal(m.find('POST', /\/persons$/)[1].body[F.person.nationality], routing.personOptions.nationality.Lebanon, 'first matching nationality');
});

test('guide and interest forms pick their default division and lead source', async () => {
  const g = await core.processLead({ form: 'guide', data: { name: 'Guide Reader', email: 'reader@example.com', consent: 'yes' }, ctx: ctx() });
  assert.equal(g.ok, true);
  assert.equal(g.division, 'citizenship');
  assert.equal(g.score, 'exploring');
  const lead = m.find('POST', /\/leads$/).pop().body;
  assert.ok(lead.title.indexOf('Website: Guide Reader · Imperial Citizenship (guide)') === 0, lead.title);
  assert.ok(m.notes[0].content.indexOf('Lead source: guide') > -1);
  const i = await core.processLead({ form: 'interest', data: { name: 'Buyer', email: 'buyer@example.com', country: 'Ghana', interest: 'A family home in Dubai', consent: 'yes' }, ctx: ctx() });
  assert.equal(i.division, 'real-estate');
  assert.ok(m.find('POST', /\/leads$/).pop().body.title.indexOf('(register interest)') > -1);
  assert.equal(m.find('POST', /\/leads$/).pop().body[F.deal.serviceRequested], 'Imperial Real Estate · Register interest: A family home in Dubai');
});

test('programme fit answers and partner details are recorded', async () => {
  const r = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', lead_source: 'programme-fit', quiz_answers: '{"q1":"a"}', for_whom: 'client', timeline: '3m' }), ctx: ctx() });
  assert.equal(r.ok, true);
  assert.equal(r.score, 'hot');
  assert.ok(m.find('POST', /\/leads$/).pop().body.title.indexOf('(programme fit)') > -1);
  assert.ok(m.notes[0].content.indexOf('Programme fit answers: {&quot;q1&quot;:&quot;a&quot;}') > -1 || m.notes[0].content.indexOf('Programme fit answers: {"q1":"a"}') > -1);
  const p = await core.processLead({ form: 'contact', data: data({ about: 'partners-club', email: 'law@example.com', firm: 'Test LLP', profession: 'Lawyer', for_whom: 'client' }), ctx: ctx() });
  assert.equal(p.kind, 'deal');
  const deal = m.find('POST', /\/deals$/).pop().body;
  assert.equal(deal[F.deal.requestType], O.requestType.referral);
  assert.ok(deal.org_id, 'firm becomes the organisation');
  assert.equal(m.orgs[0].name, 'Test LLP');
  assert.ok(m.notes[1].content.indexOf('Firm: Test LLP · Profession: Lawyer') > -1);
});

test('without PIPEDRIVE_API_TOKEN nothing is called and the result says unconfigured', async () => {
  delete process.env.PIPEDRIVE_API_TOKEN;
  const r = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship' }), ctx: ctx() });
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'unconfigured');
  assert.equal(m.calls.length, 0);
});

test('a Pipedrive failure is reported, never thrown', async () => {
  m.failPipedrive = true;
  const r = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship' }), ctx: ctx() });
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'sync');
  assert.ok(/Pipedrive GET \/persons\/search: 500/.test(r.error));
});

test('confirmation email: sent through Resend only with the env, from the named mailbox, never to a rejected address', async () => {
  const none = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship' }), ctx: ctx() });
  assert.equal(none.confirmation.sent, false);
  assert.equal(m.emails.length, 0);
  process.env.EMAIL_API_KEY = 're_test';
  process.env.EMAIL_FROM = 'Imperial Holdings Group <enquiries@example.com>';
  const sent = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', email: 'two@example.com' }), ctx: ctx() });
  assert.equal(sent.confirmation.sent, true);
  assert.equal(m.emails.length, 1);
  const mail = m.emails[0];
  assert.deepEqual(mail.to, ['two@example.com']);
  assert.equal(mail.from, 'Imperial Holdings Group <enquiries@example.com>');
  assert.ok(mail.text.indexOf('Dear Amina,') === 0);
  assert.ok(mail.text.indexOf('Imperial Citizenship') > -1);
  assert.ok(mail.text.indexOf(routing.office.dubai.tel) > -1 && mail.text.indexOf(routing.office.lagos.tel) > -1);
  assert.ok(mail.text.indexOf('reply to this email') > -1);
  const call = m.find('POST', /\/emails$/)[0];
  assert.equal(call.headers.Authorization, 'Bearer re_test');
  const bad = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', email: 'x@yopmail.com' }), ctx: ctx() });
  assert.equal(bad.reason, 'disposable');
  assert.equal(m.emails.length, 1, 'nothing sent to a rejected address');
  delete process.env.PIPEDRIVE_API_TOKEN;
  const kept = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', email: 'three@example.com' }), ctx: ctx({ submissionId: 'sub-1' }) });
  assert.equal(kept.confirmation.sent, true, 'a Netlify submission is stored even without Pipedrive, so the email still goes');
  const direct = await core.processLead({ form: 'enquiry', data: data({ division: 'citizenship', email: 'four@example.com' }), ctx: ctx() });
  assert.equal(direct.confirmation.sent, false, 'a direct submission that was not stored gets no email');
});

test('markVerified sets Verified on the person and notes the newest open lead or deal', async () => {
  const p = m.seedPerson({ name: 'Amina Test', email: 'amina@example.com', phone: '+2348020000000', custom: { [F.person.verificationStatus]: O.verificationStatus.notVerified } });
  m.seedLead({ person_id: p.id, title: 'Website: Amina Test · Imperial Citizenship' });
  const newest = m.seedDeal({ person_id: p.id, title: 'Website: Amina Test · Imperial Holdings Group' });
  const r = await core.markVerified({ email: 'amina@example.com', phone: '+2348020000000', channel: 'whatsapp', retryDelayMs: 0 });
  assert.equal(r.ok, true);
  assert.equal(m.find('PUT', /\/persons\/\d+$/)[0].body[F.person.verificationStatus], O.verificationStatus.verified);
  assert.equal(r.kind, 'deal');
  assert.equal(r.id, newest.id);
  assert.equal(m.notes[0].deal_id, newest.id);
  assert.ok(m.notes[0].content.indexOf('Phone verified: +2348020000000 by WhatsApp code') > -1);
  const missing = await core.markVerified({ email: 'nobody@example.com', phone: '+10000000000', channel: 'sms', retryDelayMs: 0 });
  assert.equal(missing.ok, false);
  assert.equal(missing.reason, 'person');
});

test('markVerified looks the person up four times, 1.5 s apart by default, so a person written after the code check is still marked', async () => {
  let searches = 0;
  const orig = global.fetch;
  global.fetch = async (url, init) => {
    if (/\/persons\/search/.test(String(url))) { searches++; if (searches === 5) m.seedPerson({ name: 'Late Person', email: 'late@example.com', phone: '+2348020000777' }); }
    return orig(url, init);
  };
  const r = await core.markVerified({ email: 'late@example.com', phone: '+2348020000777', channel: 'sms', retryDelayMs: 0 });
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(m.find('PUT', /\/persons\/\d+$/)[0].body[F.person.verificationStatus], O.verificationStatus.verified);
  assert.ok(searches >= 5 && searches <= 6, 'the person appeared on the third attempt: ' + searches + ' searches');
  m.calls.length = 0; searches = 0;
  const gone = await core.markVerified({ email: 'never@example.com', phone: '+2348020000778', channel: 'sms', retryDelayMs: 0 });
  assert.equal(gone.reason, 'person');
  assert.equal(searches, 8, 'four attempts, each by phone then by email');
  const one = await core.markVerified({ email: 'never@example.com', phone: '+2348020000778', channel: 'sms', retryDelayMs: 0, attempts: 1 });
  assert.equal(one.reason, 'person');
});

test('markVerified only marks the person who holds the verified number', async () => {
  /* a person named by email alone, whose numbers do not include the verified one: nothing is written */
  const victim = m.seedPerson({ name: 'Victim', email: 'victim@example.com', phone: '+971500000001', custom: { [F.person.verificationStatus]: O.verificationStatus.notVerified } });
  m.seedLead({ person_id: victim.id, title: 'Website: Victim · Imperial Citizenship' });
  const r = await core.markVerified({ email: 'victim@example.com', phone: '+2348020009999', channel: 'sms', retryDelayMs: 0 });
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'mismatch');
  assert.equal(m.find('PUT', /\/persons/).length, 0, 'no update');
  assert.equal(m.notes.length, 0, 'no note');
  assert.equal(victim[F.person.verificationStatus], O.verificationStatus.notVerified);
  /* the person who holds the number is marked although the email in the request is someone else's */
  const holder = m.seedPerson({ name: 'Holder', email: 'holder@example.com', phone: '+234 802 000 9999' });
  const h = await core.markVerified({ email: 'victim@example.com', phone: '+2348020009999', channel: 'whatsapp', retryDelayMs: 0 });
  assert.equal(h.ok, true, JSON.stringify(h));
  assert.equal(h.personId, holder.id);
  assert.equal(m.find('PUT', /\/persons\/\d+$/)[0].path, '/v1/persons/' + holder.id);
  assert.equal(victim[F.person.verificationStatus], O.verificationStatus.notVerified, 'the victim is untouched');
  /* a returning person found by email gets the number from the current submission a moment later: the retry sees it */
  const late = m.seedPerson({ name: 'Returning', email: 'returning@example.com', phone: '+971500000002' });
  let gets = 0;
  const orig = global.fetch;
  global.fetch = async (url, init) => {
    if (new RegExp('/persons/' + late.id + '$').test(String(url).split('?')[0])) { gets++; if (gets === 2) late.phone.push({ value: '+2348020001234', primary: false, label: 'work' }); }
    return orig(url, init);
  };
  const l = await core.markVerified({ email: 'returning@example.com', phone: '+2348020001234', channel: 'sms', retryDelayMs: 0 });
  assert.equal(l.ok, true, JSON.stringify(l));
  assert.equal(l.personId, late.id);
});

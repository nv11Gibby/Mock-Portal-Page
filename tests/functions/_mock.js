/* Offline stand-in for the Pipedrive, Cloudflare Turnstile, Twilio Verify and Resend APIs. Installs itself as
   global.fetch, records every request and keeps a small in-memory CRM so the tests can assert on what was written.
   Not a test file (the name does not match *.test.js). */
'use strict';

function jsonRes(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}
function ok(data) { return jsonRes(200, { success: true, data }); }
function digits(s) { return String(s || '').replace(/\D/g, ''); }

function createMock() {
  const m = {
    calls: [], persons: [], orgs: [], leads: [], deals: [], notes: [], activities: [], emails: [], verifications: [],
    leadsAcceptLabels: false, turnstileOk: true, goodCode: '123456', failPipedrive: false, token: 'test-token',
    nextId: 1, clock: Date.UTC(2026, 9, 15, 9, 0, 0)
  };
  m.id = function () { return m.nextId++; };
  m.time = function () { return new Date(m.clock += 1000).toISOString().replace('T', ' ').slice(0, 19); };

  m.seedPerson = function (o) {
    const p = { id: m.id(), name: o.name || 'Seeded Person', email: [], phone: [], org_id: o.org_id || null };
    if (o.email) p.email.push({ value: o.email, primary: true, label: 'work' });
    if (o.phone) p.phone.push({ value: o.phone, primary: true, label: 'work' });
    Object.keys(o.custom || {}).forEach((k) => { p[k] = o.custom[k]; });
    m.persons.push(p);
    return p;
  };
  m.seedLead = function (o) {
    const l = Object.assign({ id: 'lead-' + m.id(), is_archived: false, add_time: m.time() }, o);
    m.leads.push(l);
    return l;
  };
  m.seedDeal = function (o) {
    const d = Object.assign({ id: m.id(), status: 'open', add_time: m.time() }, o);
    m.deals.push(d);
    return d;
  };

  m.handle = async function (url, init) {
    const u = new URL(url), method = ((init && init.method) || 'GET').toUpperCase();
    let body = null;
    if (init && init.body) {
      try { body = JSON.parse(init.body); } catch (e) { body = Object.fromEntries(new URLSearchParams(init.body)); }
    }
    const call = { method, host: u.host, path: u.pathname, query: Object.fromEntries(u.searchParams), body, headers: (init && init.headers) || {} };
    m.calls.push(call);
    if (u.host === 'api.pipedrive.com') return pipedrive(m, call);
    if (u.host === 'challenges.cloudflare.com') return jsonRes(200, { success: m.turnstileOk, 'error-codes': m.turnstileOk ? [] : ['invalid-input-response'] });
    if (u.host === 'verify.twilio.com') return twilio(m, call);
    if (u.host === 'api.resend.com') { m.emails.push(call.body); return jsonRes(200, { id: 'em_' + m.id() }); }
    return jsonRes(404, { error: 'no mock for ' + u.host });
  };
  m.install = function () { global.fetch = m.handle; return m; };
  m.find = function (method, re) { return m.calls.filter((c) => c.method === method && re.test(c.path)); };
  return m;
}

function pipedrive(m, c) {
  if (m.failPipedrive) return jsonRes(500, { success: false, error: 'mock failure' });
  if (c.query.api_token !== m.token) return jsonRes(401, { success: false, error: 'unauthorized' });
  const p = c.path.replace(/^\/v1/, '');
  let mt;
  if (c.method === 'GET' && p === '/persons/search') {
    const term = String(c.query.term || '').toLowerCase();
    const items = m.persons.filter((x) => c.query.fields === 'email'
      ? x.email.some((e) => e.value.toLowerCase() === term)
      : x.phone.some((ph) => digits(ph.value).indexOf(digits(term)) > -1));
    return ok({ items: items.map((x) => ({ item: { id: x.id, name: x.name, emails: x.email.map((e) => e.value), phones: x.phone.map((e) => e.value) } })) });
  }
  if (c.method === 'GET' && (mt = p.match(/^\/persons\/(\d+)\/deals$/))) return ok(m.deals.filter((d) => String(d.person_id) === mt[1] && d.status === 'open'));
  if (c.method === 'GET' && (mt = p.match(/^\/persons\/(\d+)$/))) {
    if (m.failGetPerson) return jsonRes(m.failGetPerson, { success: false, error: 'mock: person fetch refused' });
    const x = m.persons.find((y) => String(y.id) === mt[1]);
    return x ? ok(x) : jsonRes(404, { success: false, error: 'not found' });
  }
  if (c.method === 'POST' && p === '/persons') {
    const x = Object.assign({ id: m.id(), email: [], phone: [] }, c.body);
    m.persons.push(x);
    return ok(x);
  }
  if (c.method === 'PUT' && (mt = p.match(/^\/persons\/(\d+)$/))) {
    const x = m.persons.find((y) => String(y.id) === mt[1]);
    if (!x) return jsonRes(404, { success: false, error: 'not found' });
    Object.assign(x, c.body);
    return ok(x);
  }
  if (c.method === 'GET' && p === '/organizations/search') {
    const term = String(c.query.term || '').toLowerCase();
    return ok({ items: m.orgs.filter((o) => o.name.toLowerCase() === term).map((o) => ({ item: o })) });
  }
  if (c.method === 'POST' && p === '/organizations') { const o = Object.assign({ id: m.id() }, c.body); m.orgs.push(o); return ok(o); }
  if (c.method === 'GET' && p === '/leads') return ok(m.leads.filter((l) => String(l.person_id) === String(c.query.person_id) && !l.is_archived));
  if (c.method === 'POST' && p === '/leads') {
    if (c.body.label_ids && !m.leadsAcceptLabels) return jsonRes(400, { success: false, error: 'Invalid label_ids', error_info: 'lead labels must be UUIDs' });
    const l = Object.assign({ id: 'lead-' + m.id(), is_archived: false, add_time: m.time() }, c.body);
    m.leads.push(l);
    return ok(l);
  }
  if (c.method === 'POST' && p === '/deals') { const d = Object.assign({ id: m.id(), status: 'open', add_time: m.time() }, c.body); m.deals.push(d); return ok(d); }
  if (c.method === 'POST' && p === '/notes') { const n = Object.assign({ id: m.id() }, c.body); m.notes.push(n); return ok(n); }
  if (c.method === 'POST' && p === '/activities') { const a = Object.assign({ id: m.id() }, c.body); m.activities.push(a); return ok(a); }
  return jsonRes(404, { success: false, error: 'no mock route ' + c.method + ' ' + p });
}

function twilio(m, c) {
  if (!/^Basic /.test(c.headers.Authorization || '')) return jsonRes(401, { message: 'no auth' });
  if (/\/Verifications$/.test(c.path)) {
    const v = { sid: 'VE' + m.id(), to: c.body.To, channel: c.body.Channel, status: 'pending' };
    m.verifications.push(v);
    return jsonRes(201, v);
  }
  if (/\/VerificationCheck$/.test(c.path)) {
    const v = m.verifications.find((x) => x.to === c.body.To);
    if (!v) return jsonRes(404, { message: 'not found', code: 20404 });
    return jsonRes(200, { sid: v.sid, to: v.to, status: c.body.Code === m.goodCode ? 'approved' : 'pending' });
  }
  return jsonRes(404, { message: 'no mock route' });
}

module.exports = { createMock };

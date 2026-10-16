#!/usr/bin/env node
/* Acceptance harness for the lead flow (docs/REFINEMENT-BRIEF.md section 9, items 1 to 4), run offline. Since v6 every
   contact submission is driven through the Start a relationship journey (journeyFlow; docs/RELATIONSHIP-JOURNEY.md
   6.11), and section 8 covers the journey itself: the chooser, switching path, the received wording, the preview
   build, the entry point, the prefill from the division pages and the optional fields.

   What it does:
   1. Runs the build (skip with --no-build) and serves dist/ with clean URLs on one port (default 8791).
   2. Answers POST / the way Netlify Forms does and then calls the real netlify/functions/submission-created.js with
      a Netlify shaped event. POST /.netlify/functions/lead and /verify call the real handlers the same way.
   3. Replaces global fetch with the offline Pipedrive, Twilio Verify, Turnstile and Resend from
      tests/functions/_mock.js and records every mocked call in tests/e2e-output/mock-log.json. Nothing leaves this
      machine: the service env is set to dummy values here and the real token is never used.
   4. Drives the prerendered pages with Playwright, desktop and mobile, through every case the brief asks for and
      asserts against the function results, the mock CRM and what the page shows.
   5. Writes tests/e2e-output/results.json and summary.md and exits 1 when a case fails.

   Usage: npm run test:e2e
          node tests/e2e-leads.js [--no-build] [--port 8791] [--only <substring>] [--headed]
   Env:   E2E_PORT overrides the port.

   The ids in the output are mock ids. The real Pipedrive ids come from the live run in docs/LEADS.md section 8. */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const assert = require('node:assert/strict');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'tests', 'e2e-output');
const args = process.argv.slice(2);
function arg(name, dflt) { const i = args.indexOf(name); return i > -1 && args[i + 1] !== undefined ? args[i + 1] : dflt; }
const PORT = parseInt(arg('--port', process.env.E2E_PORT || '8791'), 10);
const ONLY = arg('--only', '');
const HEADED = args.indexOf('--headed') > -1;
const NO_BUILD = args.indexOf('--no-build') > -1;
const BASE = 'http://127.0.0.1:' + PORT;
const realFetch = global.fetch;
const origLog = console.log, origWarn = console.warn, origError = console.error;
function say() { origLog.apply(console, arguments); }

/* Dummy service env: Pipedrive on (mock), Twilio on (mock) so the verification step shows, email on (mock Resend),
   Turnstile off. Set before the functions are loaded; config.js reads the env at call time anyway. */
process.env.PIPEDRIVE_API_TOKEN = 'test';
process.env.TWILIO_ACCOUNT_SID = 'ACe2e';
process.env.TWILIO_AUTH_TOKEN = 'e2e-token';
process.env.TWILIO_VERIFY_SERVICE_SID = 'VAe2e';
process.env.EMAIL_API_KEY = 'e2e';
process.env.EMAIL_FROM = 'Imperial Holdings Group <enquiries@example.invalid>';
['TURNSTILE_SECRET_KEY', 'EMAIL_REPLY_TO', 'LEAD_ALLOWED_ORIGINS', 'LEAD_RATE_LIMIT', 'LEAD_RATE_WINDOW_MINUTES', 'LEAD_SITE'].forEach(function (k) { delete process.env[k]; });

const { createMock } = require('./functions/_mock');
const ratelimit = require(path.join(ROOT, 'netlify/functions/lib/ratelimit'));
const submissionCreated = require(path.join(ROOT, 'netlify/functions/submission-created'));
const leadFn = require(path.join(ROOT, 'netlify/functions/lead'));
const verifyFn = require(path.join(ROOT, 'netlify/functions/verify'));
const routing = require(path.join(ROOT, 'shared/lead-routing.json'));
const schema = require(path.join(ROOT, 'shared/lead-schema.json'));
const F = routing.pipedrive.fields, O = routing.pipedrive.options;

/* ---------- mock services and the call log ---------- */
const m = createMock();
m.token = process.env.PIPEDRIVE_API_TOKEN;
const log = [];
/* primaryHangMs: the Netlify Forms stand-in holds the connection for that long and then answers 504 without running the
   function, the way a stalled connection behaves; the page must give up on it and use the fallback endpoint. */
const state = { primaryFail: false, fallbackFail: false, primaryDelayMs: 0, primaryHangMs: 0, test: null, inHandler: false };
function without(o, k) { const c = Object.assign({}, o); delete c[k]; return c; }
global.fetch = async function (u, init) {
  const res = await m.handle(u, init);
  const call = m.calls[m.calls.length - 1];
  const entry = {
    n: log.length + 1, at: new Date().toISOString(), test: state.test ? state.test.name : '', method: call.method, host: call.host,
    path: call.path, query: without(call.query, 'api_token'), body: call.body, status: res.status, response: await res.clone().json().catch(function () { return null; })
  };
  log.push(entry);
  if (state.test) state.test.calls.push(entry);
  return res;
};
/* The functions log one line per call; keep those lines with the test that caused them. */
function capture(kind, orig) {
  return function () {
    const s = Array.prototype.map.call(arguments, function (a) { return typeof a === 'string' ? a : JSON.stringify(a); }).join(' ');
    if (state.inHandler) { if (state.test) state.test.fnlog.push(kind + ': ' + s); orig.call(console, '      fn ' + kind + ': ' + s); }
    else orig.apply(console, arguments);
  };
}
console.log = capture('log', origLog); console.warn = capture('warn', origWarn); console.error = capture('error', origError);

/* ---------- the server: dist with clean URLs, Netlify Forms and the two functions ---------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain', '.vtt': 'text/vtt', '.mp4': 'video/mp4', '.ico': 'image/x-icon' };
function readBody(req) { return new Promise(function (ok) { let b = ''; req.on('data', function (c) { b += c; }); req.on('end', function () { ok(b); }); }); }
function safeJson(s) { try { return JSON.parse(s); } catch (e) { return s; } }
let subN = 0;

function serveStatic(p, res) {
  const rel = path.normalize(p).replace(/^([.][.][\\/])+/, '');
  const fp = path.join(DIST, rel);
  const tries = [fp, fp + '.html', path.join(fp, 'index.html')];
  let found = null;
  for (let i = 0; i < tries.length; i++) {
    try { if (tries[i].indexOf(DIST) === 0 && fs.statSync(tries[i]).isFile()) { found = tries[i]; break; } } catch (e) { /* next */ }
  }
  if (!found) {
    const nf = path.join(DIST, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(found).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  res.end(fs.readFileSync(found));
}

async function callHandler(handler, event) {
  state.inHandler = true;
  try { return await handler(event); } finally { state.inHandler = false; }
}

async function handle(req, res) {
  const u = new URL(req.url, BASE), p = decodeURIComponent(u.pathname);
  if (req.method !== 'POST') { serveStatic(p, res); return; }
  const body = await readBody(req);
  const entry = { method: 'POST', path: p, status: 0 };
  if (state.test) state.test.http.push(entry);
  try {
    if (p === '/') {
      if (state.primaryHangMs) { await new Promise(function (ok) { setTimeout(ok, state.primaryHangMs); }); entry.status = 504; res.writeHead(504, { 'Content-Type': 'text/plain' }); res.end('Gateway Timeout'); return; }
      if (state.primaryFail) { entry.status = 500; res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end('Internal Server Error'); return; }
      if (state.primaryDelayMs) await new Promise(function (ok) { setTimeout(ok, state.primaryDelayMs); });
      const data = Object.fromEntries(new URLSearchParams(body));
      const formName = data['form-name'];
      delete data['form-name'];
      data.ip = '127.0.0.1';
      const id = 'e2e-' + String(++subN).padStart(4, '0');
      const event = { body: JSON.stringify({ payload: { form_name: formName, data: data, id: id, created_at: new Date().toISOString(), site_url: BASE } }) };
      const r = await callHandler(submissionCreated.handler, event);
      entry.submission = { id: id, form: formName, result: safeJson(r.body) };
      entry.status = 200;
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
      return;
    }
    if (p === '/.netlify/functions/lead' || p === '/.netlify/functions/verify') {
      const isLead = p === '/.netlify/functions/lead';
      if (isLead && state.fallbackFail) { entry.status = 500; res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end('Internal Server Error'); return; }
      const event = { httpMethod: 'POST', headers: { origin: req.headers.origin || '', host: req.headers.host || '', 'x-forwarded-proto': 'http', 'x-forwarded-for': '127.0.0.1', 'content-type': req.headers['content-type'] || '' }, body: body };
      const r = await callHandler((isLead ? leadFn : verifyFn).handler, event);
      entry.status = r.statusCode;
      entry.response = safeJson(r.body);
      res.writeHead(r.statusCode, r.headers);
      res.end(r.body);
      return;
    }
    entry.status = 404;
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
  } catch (err) {
    entry.status = 500; entry.error = err && err.message;
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('harness error: ' + (err && err.message));
  }
}

function listen() {
  return new Promise(function (ok, fail) {
    const srv = http.createServer(function (req, res) { handle(req, res).catch(function (err) { try { res.writeHead(500); res.end(String(err)); } catch (e) { /* closed */ } }); });
    srv.on('error', function (err) {
      if (err.code === 'EADDRINUSE') { say('PORT ' + PORT + ' IS ALREADY IN USE. Pass --port or set E2E_PORT.'); process.exit(3); }
      fail(err);
    });
    srv.listen(PORT, '127.0.0.1', function () { ok(srv); });
  });
}

/* ---------- harness helpers ---------- */
/* audience: the path the journey posted (it sets the Contact Type); the division's own audience when none was posted */
function expectFor(division, audience) {
  const cfg = routing.divisions[division], aud = audience || cfg.audience;
  return {
    name: cfg.name, kind: cfg.kind, owner: Number(cfg.owner) || 0, pipeline: cfg.pipeline, stage: cfg.stage,
    division: cfg.divisionOption ? O.division[cfg.divisionOption] : undefined,
    contact: aud === 'clients' ? O.contactType.client : aud === 'partners' ? O.contactType.partner : undefined
  };
}
function noteLines(html) { return String(html || '').split('<br>').map(function (l) { return l.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'); }); }
function prefixFor(band) { return band === 'hot' ? '[HOT] ' : band === 'warm' ? '[WARM] ' : ''; }
function dateOnly(ms) { return new Date(ms).toISOString().slice(0, 10); }
function e164(s) { return String(s).replace(/[\s().-]/g, ''); }
function lastSubmission(t) { const hits = t.http.filter(function (h) { return h.submission; }); return hits.length ? hits[hits.length - 1].submission : null; }
function pdCalls(t, method, re) { return t.calls.filter(function (c) { return c.host === 'api.pipedrive.com' && c.method === method && re.test(c.path); }); }
function emailFor(t, address) { const hits = t.calls.filter(function (c) { return c.host === 'api.resend.com' && c.body && c.body.to && c.body.to[0] === address.toLowerCase(); }); return hits.length ? hits[hits.length - 1] : null; }
function ownerLabel(owner) { return owner ? String(owner) : 'account default (0, TO CONFIRM)'; }
function lastCreatedId(t, kind) {
  const posts = pdCalls(t, 'POST', kind === 'deal' ? /^\/v1\/deals$/ : /^\/v1\/leads$/).filter(function (c) { return c.status === 200; });
  return posts.length ? posts[posts.length - 1].response.data.id : undefined;
}

/* The record, person, note and email a stored submission produced, checked against shared/lead-routing.json. */
function checkStored(t, spec, opts) {
  opts = opts || {};
  const sub = lastSubmission(t);
  const r = opts.result || (sub && sub.result);
  assert.ok(r, 'a function result was recorded');
  assert.equal(r.ok, true, 'function result ok: ' + JSON.stringify(r));
  const exp = expectFor(spec.division, spec.journey || spec.audience);
  assert.equal(r.kind, exp.kind, 'kind per lead-routing.json');
  /* lead.js answers {ok, ref, kind} without the record id (the page does not need it); take it from the mock then */
  const id = r.id !== undefined ? r.id : lastCreatedId(t, exp.kind);
  assert.ok(id !== undefined, 'the created record id is known');
  const rec = exp.kind === 'deal' ? m.deals.find(function (d) { return d.id === id; }) : m.leads.find(function (l) { return l.id === id; });
  assert.ok(rec, 'the ' + exp.kind + ' exists in the mock CRM');
  assert.ok(rec.title.indexOf(prefixFor(spec.band) + 'Website: ') === 0, 'title prefix for ' + spec.band + ': ' + rec.title);
  assert.ok(rec.title.indexOf(exp.name) > -1, 'division name in the title: ' + rec.title);
  if (opts.titleSuffix) assert.ok(rec.title.indexOf(opts.titleSuffix) > -1, 'title suffix ' + opts.titleSuffix + ': ' + rec.title);
  const ids = { ref: r.ref, kind: exp.kind, id: id, person: rec.person_id, owner: ownerLabel(exp.owner) };
  if (exp.kind === 'deal') {
    assert.equal(rec.pipeline_id, exp.pipeline, 'pipeline');
    assert.equal(rec.stage_id, exp.stage, 'stage');
    assert.deepEqual(rec.label_ids, [O.label[spec.band]], 'deal label for ' + spec.band);
    if (exp.owner) assert.equal(rec.user_id, exp.owner, 'deal owner'); else assert.equal(rec.user_id, undefined, 'owner 0 means no user_id (account default)');
    ids.pipeline = exp.pipeline + '/' + exp.stage; ids.label = O.label[spec.band];
  } else {
    const posts = pdCalls(t, 'POST', /^\/v1\/leads$/);
    assert.ok(posts.length >= 1, 'a lead was posted');
    const last = posts[posts.length - 1], first = posts[posts.length === 1 ? 0 : posts.length - 2];
    const want = m.leadLabelFor(spec.band);
    assert.deepEqual(first.body.label_ids, want ? [want] : undefined, 'the lead POST carries the Leads inbox label for ' + spec.band + ' (from GET /leadLabels), never the deal label id');
    assert.equal(posts.length, 1, 'one POST to /leads: no retry without the label');
    ids.label = want ? want + ' (Leads inbox label from the account)' : 'none (no matching Leads inbox label; band in the title and the note)';
    assert.equal(last.status, 200, 'the lead was created');
    if (exp.owner) assert.equal(rec.owner_id, exp.owner, 'lead owner'); else assert.equal(rec.owner_id, undefined, 'owner 0 means no owner_id (account default)');
    ids.pipeline = 'Leads inbox';
  }
  if (exp.division !== undefined) assert.equal(rec[F.deal.division], exp.division, 'Division field'); else assert.equal(rec[F.deal.division], undefined, 'no Division option for this division');
  if (exp.contact !== undefined) assert.equal(rec[F.deal.contactType], exp.contact, 'Contact Type'); else assert.equal(rec[F.deal.contactType], undefined, 'no Contact Type for institutions');
  assert.equal(rec[F.deal.sourcePlatform], O.sourcePlatform.website, 'Source Platform Website');
  if (spec.timeline === '3m') assert.equal(rec[F.deal.expectedCloseDate], dateOnly(Date.now() + 90 * 86400000), 'expected close date 90 days');
  if (spec.timeline === '3-12m') assert.equal(rec[F.deal.expectedCloseDate], dateOnly(Date.now() + 365 * 86400000), 'expected close date 365 days');
  if (spec.firm) { const org = m.orgs.find(function (o) { return o.name === spec.firm; }); assert.ok(org, 'organisation created for the firm'); assert.equal(rec.org_id, org.id, 'deal linked to the organisation'); ids.org = org.id; }
  if (spec.division === 'partners-club' && spec.for_whom === 'client') assert.equal(rec[F.deal.requestType], O.requestType.referral, 'Request Type Referral');

  const person = m.persons.find(function (p) { return p.id === rec.person_id; });
  assert.ok(person, 'person exists');
  const created = pdCalls(t, 'POST', /^\/v1\/persons$/).find(function (c) { return c.response && c.response.data && c.response.data.id === person.id; });
  if (created) assert.equal(created.body[F.person.verificationStatus], O.verificationStatus.notVerified, 'person created Not Verified (983)');
  assert.equal(person[F.person.verificationStatus], opts.verification || O.verificationStatus.notVerified, 'person Verification Status now');
  assert.equal(person.email[0].value, spec.email.toLowerCase(), 'person email');
  if (spec.phone) assert.equal(person.phone[0].value, e164(spec.phone), 'person phone in E.164');

  /* the enquiry note (a "Phone verified" note may sit on the record as well after 3.1) */
  const notes = m.notes.filter(function (n) { return (exp.kind === 'deal' ? n.deal_id : n.lead_id) === id && /Website enquiry \(/.test(n.content); });
  assert.equal(notes.length, 1, 'one enquiry note on the record');
  const lines = noteLines(notes[0].content);
  ids.note = notes[0].id;
  const scoreLine = 'Score: ' + spec.band.toUpperCase() + ' (' + spec.points + ' points)';
  assert.ok(lines.some(function (l) { return l.indexOf(scoreLine) === 0; }), 'score line "' + scoreLine + '" in the note (have: ' + lines.filter(function (l) { return l.indexOf('Score:') === 0; }).join(' | ') + ')');
  assert.ok(lines.indexOf('Tracking:') > -1, 'tracking block in the note');
  schema.tracking.forEach(function (k) {
    const want = k + ': ' + (opts.tracking && opts.tracking[k] !== undefined ? opts.tracking[k] : '');
    if (opts.tracking) assert.ok(lines.indexOf(want) > -1, 'tracking line "' + want + '" in the note (have: ' + lines.filter(function (l) { return l.indexOf(k + ':') === 0; }).join(' | ') + ')');
    else assert.ok(lines.some(function (l) { return l.indexOf(k + ': ') === 0; }), 'tracking key ' + k + ' in the note');
  });
  assert.ok(lines.some(function (l) { return l.indexOf('Lead source: ' + (spec.leadSource || 'website')) > -1; }), 'lead source line');
  if (spec.phone) assert.ok(lines.some(function (l) { return l.indexOf('Verification: Not Verified (code not entered yet)') > -1; }), 'verification line in the note');
  if (opts.noteHas) opts.noteHas.forEach(function (s) { assert.ok(lines.some(function (l) { return l.indexOf(s) > -1; }), 'note line containing "' + s + '"'); });
  if (sub && sub.id && !opts.result) assert.ok(lines.some(function (l) { return l.indexOf('Netlify submission: ' + sub.id) === 0; }), 'Netlify submission id ' + sub.id + ' in the note');

  const email = emailFor(t, spec.email);
  assert.ok(email, 'confirmation email sent to ' + spec.email);
  ids.email = email.response && email.response.id;
  return ids;
}

/* ---------- Playwright ---------- */
let chromium;
try { chromium = require('playwright').chromium; }
catch (e) { try { chromium = require(path.join(cp.execSync('npm root -g').toString().trim(), 'playwright')).chromium; } catch (e2) { say('playwright not found'); process.exit(2); } }

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
};
/* prep (optional) runs on the new page before it navigates: routes to stub, state to set. */
async function open(browser, t, vp, url, prep, gotoOpts) {
  const ctx = await browser.newContext(Object.assign({ reducedMotion: 'reduce', locale: 'en-GB' }, VIEWPORTS[vp || 'desktop']));
  const page = await ctx.newPage();
  page.on('pageerror', function (e) { t.errors.push('pageerror: ' + e.message); });
  page.on('console', function (msg) { if (msg.type() === 'error') t.console.push(msg.text()); });
  if (prep) await prep(page);
  await page.goto(BASE + url, Object.assign({ waitUntil: 'networkidle' }, gotoOpts || {}));
  t.close = function () { return ctx.close(); };
  return page;
}
/* Stub the verify function from the page's side (the page under test, not the backend, is what these cases check):
   answer(body) returns a JSON answer to send, or null to let the real function answer. */
function stubVerify(answer) {
  return async function (page) {
    await page.route('**/.netlify/functions/verify', function (route) {
      let body = {}; try { body = JSON.parse(route.request().postData() || '{}'); } catch (e) { /* empty */ }
      const out = answer(body);
      if (out) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(out) });
      return route.continue();
    });
  };
}
/* Capture the analytics events the page sends (shared/analytics.js queues them when GA4 is off). */
async function captureEvents(page) { await page.evaluate(function () { window.__e2eEvents = []; window.ihgTrack = function (n, p) { window.__e2eEvents.push({ name: n, params: p }); }; }); }
function events(page) { return page.evaluate(function () { return window.__e2eEvents || []; }); }
function twilioStarts(t) { return t.calls.filter(function (c) { return c.host === 'verify.twilio.com' && /Verifications$/.test(c.path); }); }
function twilioChecks(t) { return t.calls.filter(function (c) { return c.host === 'verify.twilio.com' && /VerificationCheck$/.test(c.path); }); }
/* A fixed element (the mobile action bar) can sit over a button; fall back to a DOM click then. */
async function click(loc) { try { await loc.click({ timeout: 5000 }); } catch (e) { await loc.evaluate(function (el) { el.click(); }); } }
function trackingUrl(route, tag) { return route + '?utm_source=google&utm_medium=organic&utm_campaign=e2e-' + tag + '&utm_content=harness&utm_term=acceptance'; }
async function trackingSeen(page) {
  const trk = await page.evaluate(function () { try { return JSON.parse(sessionStorage.getItem('ihg-src')); } catch (e) { return null; } });
  assert.ok(trk && trk.landing, 'first touch tracking stored in the session');
  const want = {};
  schema.tracking.forEach(function (k) { want[k] = trk[k] || ''; });
  want.page = page.url();
  return want;
}

/* ---------- the Start a relationship journey (docs/RELATIONSHIP-JOURNEY.md) ----------
   One journeyFlow drives every contact submission: the chooser (when the page shows it), each screen of the path in
   turn and the closing screen, which sends. spec: journey (clients, partners, institutions), about, key (the Partners
   option: introduce, join, learn), the answers by field name (for_whom, country, nationality, timeline, budget,
   re_intent, re_area, profession, firm, interests as an array, org_type), the closing fields (name, email, phone,
   pref, msg) and before (async hook before Send). It records the screens it passed in spec.screens. */
const CUR = '#cf form .cf-step.on';
const JOURNEY_NAME = { clients: 'Private Clients', partners: 'Professional Partners', institutions: 'Institutions and Strategic Relationships' };
const JOURNEY_OF = { citizenship: 'clients', 'private-office': 'clients', 'real-estate': 'clients', group: 'clients', 'partners-club': 'partners', academy: 'partners' };
async function curStep(page) {
  return page.evaluate(function (sel) { const s = document.querySelector(sel); return s ? { n: +s.getAttribute('data-step'), screen: s.getAttribute('data-screen') } : null; }, CUR);
}
async function waitStepChange(page, n) {
  await page.waitForFunction(function (a) { const s = document.querySelector(a[0]); return !!s && +s.getAttribute('data-step') !== a[1]; }, [CUR, n], { timeout: 5000 });
}
/* the visible, enabled controls of the screen on show, one entry per field */
function fieldsOn(page) {
  return page.evaluate(function (sel) {
    const s = document.querySelector(sel), out = [], seen = {};
    Array.prototype.forEach.call(s.querySelectorAll('input, textarea'), function (el) {
      if (el.disabled || el.closest('[hidden]') || el.type === 'hidden' || el.hasAttribute('data-other') || el.name === 'company_url') return;
      let k, name;
      if (el.type === 'radio' && el.name) { k = 'radio'; name = el.name; }
      else if (el.type === 'radio') { k = 'choice'; name = el.getAttribute('data-choice'); }
      else if (el.type === 'checkbox' && el.hasAttribute('data-multi')) { k = 'multi'; name = el.getAttribute('data-multi'); }
      else if (el.type === 'checkbox') { k = 'check'; name = el.name; }
      else { k = 'text'; name = el.name; }
      if (!name || seen[k + name]) return;
      seen[k + name] = 1; out.push({ k: k, name: name });
    });
    return out;
  }, CUR);
}
/* only what is on show: the Partners scope screen renders its three variants and hides two */
function shown(page, sel) { return page.locator(sel + ' >> visible=true'); }
async function fillScreen(page, spec) {
  const S = CUR + ' ';
  let fields = await fieldsOn(page);
  /* the first answer first: it decides the fields, the variant of the next screen and the routing line */
  if (spec.about && fields.some(function (f) { return f.k === 'radio' && f.name === 'about'; })) {
    await click(page.locator(S + 'label:has(input[name="about"][value="' + spec.about + '"]' + (spec.key ? '[data-key="' + spec.key + '"]' : '') + ')'));
    await page.waitForSelector(S + '[data-routing].show', { timeout: 5000 });
    fields = await fieldsOn(page);
  }
  for (const f of fields) {
    if (f.name === 'about') continue;
    const v = spec[f.name];
    if (f.k === 'radio') { if (v) await click(shown(page, S + 'label:has(input[name="' + f.name + '"][value="' + v + '"])')); }
    else if (f.k === 'choice') {
      if (!v) continue;
      if (await page.locator(S + 'input[data-choice="' + f.name + '"][value="' + v + '"]').count()) await click(page.locator(S + 'label:has(input[data-choice="' + f.name + '"][value="' + v + '"])'));
      else { await click(page.locator(S + 'label:has(input[data-choice="' + f.name + '"][data-text])')); await page.locator(S + 'input[data-other="' + f.name + '"]').fill(v); }
    }
    else if (f.k === 'multi') {
      const list = Array.isArray(v) ? v : (v ? String(v).split(', ') : []);
      for (const x of list) await click(shown(page, S + 'label:has(input[data-multi="' + f.name + '"][value="' + x + '"])'));
    }
    else if (f.k === 'check') { if (f.name === 'consent' && spec.consent !== false) await page.locator(S + 'input[name="consent"]').check(); }
    else if (v !== undefined && v !== null && v !== '') await shown(page, S + '[name="' + f.name + '"]').fill(String(v));
  }
}
async function journeyFlow(page, spec) {
  spec.screens = [];
  let st = await curStep(page);
  if (st.n === 0) {
    await click(page.locator('#cf .jp-card[data-path="' + spec.journey + '"]'));
    await waitStepChange(page, 0);
    st = await curStep(page);
  }
  for (let i = 0; i < 8; i++) {
    spec.screens.push(st.screen);
    await fillScreen(page, spec);
    if (st.screen === 'you') {
      if (spec.before) await spec.before(page);
      await click(page.locator(CUR + ' [data-send]'));
      return;
    }
    await click(page.locator(CUR + ' [data-next]'));
    await waitStepChange(page, st.n);
    st = await curStep(page);
  }
  throw new Error('the journey did not reach the closing screen: ' + spec.screens.join(' > '));
}
/* follow a link on a division page into the journey: wait until /contact shows a screen */
async function follow(page, loc) {
  await click(loc);
  await page.waitForFunction(function (sel) { return location.pathname === '/contact' && !!document.querySelector(sel); }, CUR, { timeout: 10000 });
}
function divisionLink(page, key) { return page.locator('a[href$="contact?about=' + key + '&via=division"]').first(); }
function journeyLine(spec, entry) { return 'Journey: ' + JOURNEY_NAME[spec.journey] + ' · Entry: ' + (entry || 'not given'); }
async function received(page) {
  return page.evaluate(function () {
    const s = document.querySelector('#cf .success');
    return { title: s.querySelector('h3').textContent.trim(), text: s.querySelector('p').textContent.replace(/\s+/g, ' ').trim(), preview: s.classList.contains('preview'), chip: ((s.querySelector('.jp-chip') || {}).textContent || '').trim(), announce: (document.getElementById('announce') || {}).textContent || '' };
  });
}
const NAMES = /\b(Zaid|Kaylan|Gilbert|Alhindi|Tarin|Ferrer)\b/;

/* After Send: the success state, then the verification step (skip, or a wrong code then the right one), then booking. */
async function afterSuccess(page, mode, scope) {
  const s = scope || '#cf ';
  await page.waitForSelector(s + '.success', { timeout: 20000 });
  if (mode === 'none') { await page.waitForSelector(s + '.book', { timeout: 10000 }); return; }
  await page.waitForSelector(s + '[data-verify]', { timeout: 10000 });
  if (mode === 'skip') await click(page.locator(s + '[data-verify-skip]'));
  else {
    await page.locator(s + 'input[name="code"]').fill('000000');
    await click(page.locator(s + '[data-verify-send]'));
    await page.waitForSelector(s + '.verify .form-err:not([hidden])', { timeout: 10000 });
    const errText = await page.locator(s + '.verify .form-err').innerText();
    assert.ok(/did not match/.test(errText), 'wrong code message: ' + errText);
    await page.locator(s + 'input[name="code"]').fill('123456');
    await click(page.locator(s + '[data-verify-send]'));
    await page.waitForSelector(s + '.verified', { timeout: 10000 });
  }
  await page.waitForSelector(s + '.book', { timeout: 10000 });
}
async function bookingState(page, scope) {
  const s = scope || '#cf ';
  return page.evaluate(function (sel) {
    const box = document.querySelector(sel + '.book');
    return {
      links: Array.prototype.map.call(box.querySelectorAll('a[data-book]'), function (a) { return { office: a.getAttribute('data-book'), href: a.getAttribute('href'), division: a.getAttribute('data-division') }; }),
      tbc: Array.prototype.map.call(box.querySelectorAll('.book-tbc'), function (el) { return Array.prototype.map.call(el.childNodes, function (n) { return n.textContent.trim(); }).filter(Boolean).join(': '); })
    };
  }, s);
}
async function fitCheck(page) {
  const answers = [['who', 'family'], ['where', 'nigeria'], ['matters', 'live'], ['timeline', '3m'], ['budget', '500k-1m']];
  for (let i = 0; i < answers.length; i++) {
    await page.waitForSelector('.fit-q[data-k="' + answers[i][0] + '"].on', { timeout: 5000 });
    await click(page.locator('.fit-q[data-k="' + answers[i][0] + '"] [data-opt="' + answers[i][1] + '"]'));
  }
  await page.waitForSelector('.fit-done.on', { timeout: 5000 });
  await follow(page, page.locator('[data-fit-go]'));
}

/* ---------- the cases ---------- */
/* Six divisions through the paths, with the answers each path asks. Expected band and points from
   shared/lead-schema.json "score" with the organic source (+1): timeline 3m 4, 3-12m 2, exploring 0; budget over-1m 3,
   500k-1m 2, 250k-500k 1; a single division +1, group +0; a partner introducing a client counts as referral (+2) in
   place of organic. Hot from 6, warm from 3; "exploring" is capped at warm and needs 5 for warm. The budget is asked
   on the citizenship and real-estate routes only and the nationality on the citizenship and private-office routes only
   (docs/RELATIONSHIP-JOURNEY.md 2.2), so private-office and group score without a budget. */
const CHOICES = [
  { about: 'citizenship', journey: 'clients', timeline: '3m', budget: 'over-1m', for_whom: 'family', band: 'hot', points: 9, nationality: 'Nigeria', country: 'Nigeria', phone: '+234 802 000 0101' },
  { about: 'private-office', journey: 'clients', timeline: '3-12m', for_whom: 'myself', band: 'warm', points: 4, nationality: 'United Kingdom', country: 'United Arab Emirates', phone: '+971 50 000 0102' },
  { about: 'partners-club', journey: 'partners', key: 'introduce', timeline: '3m', for_whom: 'client', firm: 'E2E Advisory LLP', profession: 'Lawyer', interests: ['A second residency or citizenship'], band: 'hot', points: 7, country: 'Ghana', phone: '+233 24 000 0103' },
  { about: 'academy', journey: 'partners', key: 'learn', timeline: 'exploring', firm: 'E2E Academy Partners', profession: 'Wealth adviser', interests: ['Certification for my team'], band: 'exploring', points: 2, country: 'Kenya', phone: '+254 700 000 104' },
  { about: 'real-estate', journey: 'clients', timeline: '3-12m', budget: '500k-1m', for_whom: 'family', re_intent: 'buy', re_area: 'Dubai Marina', band: 'hot', points: 6, country: 'United Arab Emirates', phone: '+971 50 000 0105' },
  { about: 'group', journey: 'clients', timeline: 'exploring', for_whom: 'myself', band: 'exploring', points: 1, country: 'South Africa', phone: '+27 82 000 0106' }
];
const tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }

['desktop', 'mobile'].forEach(function (vp, vi) {
  CHOICES.forEach(function (c, i) {
    test('1.' + (vi * 6 + i + 1) + ' journey ' + c.journey + ', ' + c.about + ' (' + vp + ')', async function (t, browser) {
      /* a distinct phone per viewport (one digit appended): the same number would be found by the phone dedupe and reuse the open record (see 1.13) */
      const spec = Object.assign({}, c, { division: c.about, name: 'E2E ' + c.about + ' ' + vp, email: 'e2e.' + c.about + '.' + vp + '@example.com', phone: c.phone + String(vi + 1), pref: 'Either', msg: 'TEST ' + c.about + ' on ' + vp + ' from the acceptance harness.' });
      const page = await open(browser, t, vp, trackingUrl('/contact', c.about + '-' + vp));
      let tracking;
      spec.before = async function (p) { tracking = await trackingSeen(p); };
      await journeyFlow(page, spec);
      await afterSuccess(page, 'skip');
      assert.equal(tracking.utm_source, 'google', 'utm_source captured from the landing URL');
      assert.equal(tracking.utm_campaign, 'e2e-' + c.about + '-' + vp, 'utm_campaign captured');
      const noteHas = [journeyLine(spec), 'Timeline: ', 'Country of residence: ' + c.country];
      if (c.nationality) noteHas.push('Nationality: ' + c.nationality);
      if (c.for_whom) noteHas.push('Enquiry for:');
      if (c.firm) noteHas.push('Firm: ' + c.firm + ' · Profession: ' + c.profession);
      if (c.interests) noteHas.push('Interests: ' + c.interests.join(', '));
      t.ids = checkStored(t, spec, { tracking: tracking, noteHas: noteHas });
      const sub = lastSubmission(t);
      assert.equal(sub.form, 'contact');
      t.detail = 'chooser then ' + spec.screens.join(' > ') + '; form contact, ' + t.ids.kind + ' ' + t.ids.id + ' in ' + t.ids.pipeline + ', score ' + spec.band + ' (' + spec.points + ' points), note ' + t.ids.note + ' with the Journey line and all ' + schema.tracking.length + ' tracking fields, person ' + t.ids.person + ' Not Verified, verification skipped, email ' + t.ids.email;
    });
  });
});

test('1.13 returning person: same path three times, same email, then same phone (dedupe, note and activity on the open lead)', async function (t, browser) {
  const base = { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Returning', email: 'e2e.returning@example.com', phone: '+234 802 000 0901', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'family', timeline: '3m', budget: 'over-1m', band: 'hot', points: 9, msg: 'TEST first enquiry.' };
  let page = await open(browser, t, 'desktop', '/contact');
  await journeyFlow(page, base);
  await afterSuccess(page, 'skip');
  const first = checkStored(t, base, {});
  await t.close();
  /* same email again */
  page = await open(browser, t, 'desktop', '/contact');
  await journeyFlow(page, Object.assign({}, base, { msg: 'TEST second enquiry, same email.' }));
  await afterSuccess(page, 'skip');
  let sub = lastSubmission(t);
  assert.equal(sub.result.ok, true);
  assert.equal(sub.result.id, first.id, 'the open lead of the same division is reused');
  assert.equal(pdCalls(t, 'POST', /^\/v1\/persons$/).length, 1, 'no second person');
  assert.equal(pdCalls(t, 'POST', /^\/v1\/leads$/).filter(function (c) { return c.status === 200; }).length, 1, 'no second lead');
  let acts = m.activities.filter(function (a) { return a.lead_id === first.id; });
  assert.equal(acts.length, 1, 'one follow up activity');
  assert.equal(acts[0].subject, routing.pipedrive.activity.subject); assert.equal(acts[0].type, routing.pipedrive.activity.type);
  assert.equal(acts[0].due_date, dateOnly(Date.now()), 'due today'); assert.equal(acts[0].person_id, first.person);
  assert.equal(m.notes.filter(function (n) { return n.lead_id === first.id; }).length, 2, 'the second note sits on the same lead');
  await t.close();
  /* a new email with the same phone */
  page = await open(browser, t, 'desktop', '/contact');
  await journeyFlow(page, Object.assign({}, base, { email: 'e2e.returning.other@example.com', msg: 'TEST third enquiry, new email, same phone.' }));
  await afterSuccess(page, 'skip');
  sub = lastSubmission(t);
  assert.equal(sub.result.id, first.id, 'found by phone, the open lead is reused again');
  assert.equal(pdCalls(t, 'POST', /^\/v1\/persons$/).length, 1, 'still one person');
  const person = m.persons.find(function (p) { return p.id === first.person; });
  assert.equal(person.email.length, 2, 'the new email is added to the person');
  acts = m.activities.filter(function (a) { return a.lead_id === first.id; });
  assert.equal(acts.length, 2, 'a second follow up activity');
  t.ids = Object.assign({}, first, { notes: m.notes.filter(function (n) { return n.lead_id === first.id; }).map(function (n) { return n.id; }).join(', '), activities: acts.map(function (a) { return a.id; }).join(', ') });
  delete t.ids.note;
  t.detail = 'three journeys on the Private Clients path, one person ' + first.person + ' and one ' + first.kind + ' ' + first.id + ': the second (same email) and third (new email, same phone) each added a note and a "' + routing.pipedrive.activity.subject + '" activity due today; the person now holds both emails.';
});

/* The email field's state as the person sees it. */
function emailState(page) {
  return page.evaluate(function () {
    const f = document.querySelector('#cf form'), em = f.querySelector('input[name="email"]'), box = em.closest('.field');
    return { err: box.classList.contains('err'), msg: box.querySelector('.em').textContent.trim(), invalid: em.getAttribute('aria-invalid'), step: (document.querySelector('#cf form .cf-step.on') || {}).getAttribute('data-screen'), focused: document.activeElement === em };
  });
}
test('2.1 disposable email through Netlify Forms: the closing screen refuses it before sending, the function refuses it too', async function (t, browser) {
  const spec = { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Disposable', email: 'e2e.disposable@mailinator.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'myself', timeline: '3m', budget: 'over-1m', msg: 'TEST disposable address.' };
  const page = await open(browser, t, 'desktop', '/contact');
  await journeyFlow(page, spec);
  await page.waitForTimeout(500);
  /* the page checks the domain against shared/disposable-domains.json: the closing screen stays, the field says why */
  const st = await emailState(page);
  assert.equal(st.step, 'you', 'the closing screen does not send with a disposable address');
  assert.ok(st.err && /email address you check regularly/.test(st.msg), 'field error on the email: ' + st.msg);
  assert.equal(st.invalid, 'true', 'aria-invalid on the email field');
  assert.equal(t.http.length, 0, 'nothing was posted');
  assert.equal(await page.locator('#cf .success').count(), 0, 'no received state');
  /* a permanent address clears the mark */
  await page.locator('#cf form input[name="email"]').fill('e2e.disposable.fixed@example.com');
  await page.locator('#cf form input[name="email"]').blur();
  const fixed = await emailState(page);
  assert.ok(!fixed.err && fixed.invalid !== 'true', 'the field is no longer marked: ' + JSON.stringify(fixed));
  /* the function keeps its own check (brief 3.3): the same data posted straight to Netlify Forms is refused there */
  const fields = { 'form-name': 'contact', about: 'citizenship', audience: 'clients', name: spec.name, email: spec.email, country: spec.country, nationality: spec.nationality, for_whom: spec.for_whom, timeline: spec.timeline, msg: spec.msg, consent: 'yes', site: 'ihg' };
  const r1 = await realFetch(BASE + '/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fields).toString() });
  assert.equal(r1.status, 200, 'Netlify Forms stand-in answers 200');
  const sub = lastSubmission(t);
  assert.ok(sub, 'the Netlify Forms post reached the function');
  assert.equal(sub.result.ok, false); assert.equal(sub.result.reason, 'disposable');
  assert.equal(t.calls.filter(function (c) { return c.host === 'api.pipedrive.com'; }).length, 0, 'nothing reached Pipedrive');
  assert.equal(t.calls.filter(function (c) { return c.host === 'api.resend.com'; }).length, 0, 'no email was sent');
  t.ids = { ref: sub.result.ref, submission: sub.id };
  t.detail = 'page: the closing screen refuses mailinator.com with "' + st.msg + '" and nothing is posted; a permanent address clears the mark. Function (same data posted directly): rejected reason=disposable, no Pipedrive call, no email.';
});

test('2.2 disposable email through the fallback endpoint: refused, and the person is told which field', async function (t, browser) {
  state.primaryFail = true;
  const spec = { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Disposable Two', email: 'e2e.disposable2@mailinator.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'myself', timeline: '3m', budget: 'over-1m', msg: 'TEST disposable address via the direct endpoint.' };
  /* the page cannot load the domain list here (as on an old cached copy, or a blocked fetch), so the function's answer is what tells it */
  const page = await open(browser, t, 'desktop', '/contact', async function (p) { await p.route('**/shared/disposable-domains.json', function (route) { route.abort(); }); });
  await journeyFlow(page, spec);
  await page.waitForSelector('#cf form .form-err:not([hidden])', { timeout: 20000 });
  const lead = t.http.find(function (h) { return h.path === '/.netlify/functions/lead'; });
  assert.ok(lead, 'the fallback endpoint was called');
  assert.equal(lead.response.ok, false); assert.equal(lead.response.reason, 'disposable');
  assert.equal(t.calls.filter(function (c) { return c.host === 'api.pipedrive.com'; }).length, 0, 'nothing reached Pipedrive');
  const seen = (await page.locator('#cf form .form-err').innerText()).replace(/\s+/g, ' ').trim();
  assert.ok(/email address you check regularly/.test(seen), 'the message names the address, not an outage: ' + seen);
  assert.ok(/Nothing has been sent yet/.test(seen), 'and says nothing was sent: ' + seen);
  assert.ok(!/could not send/i.test(seen), 'no generic fallback message');
  const st = await emailState(page);
  assert.equal(st.step, 'you', 'the closing screen, which holds the email field, is on show');
  assert.ok(st.err && /email address you check regularly/.test(st.msg), 'field error on the email: ' + st.msg);
  const btn = await page.evaluate(function () { const b = document.querySelector('#cf form [data-send]'); return { loading: b.classList.contains('loading'), disabled: b.disabled }; });
  assert.ok(!btn.loading && !btn.disabled, 'the Send button is released');
  t.ids = { ref: lead.response.ref };
  t.detail = 'lead.js: {ok:false, reason:disposable}, nothing in Pipedrive. The page shows "' + seen.slice(0, 80) + '", stays on the closing screen and marks the email field.';
});

test('2.3 honeypot filled in the page: nothing is sent, the button is released and the office contacts are shown', async function (t, browser) {
  const spec = { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Honeypot', email: 'e2e.honeypot@example.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'myself', timeline: '3m', budget: 'over-1m', msg: 'TEST honeypot.' };
  spec.before = async function (p) { await p.evaluate(function () { document.querySelector('#cf form input[name="company_url"]').value = 'http://spam.example'; }); };
  const page = await open(browser, t, 'desktop', '/contact');
  assert.equal(await page.locator('#cf form input[name="company_url"]').count(), 1, 'the honeypot is inside the journey form');
  await journeyFlow(page, spec);
  await page.waitForSelector('#cf form .form-err:not([hidden])', { timeout: 10000 });
  await page.waitForTimeout(500);
  assert.equal(t.http.length, 0, 'no request left the page');
  assert.equal(await page.locator('.success').count(), 0, 'no success state');
  const st = await page.evaluate(function () {
    const f = document.querySelector('#cf form'), b = f.querySelector('[data-send]');
    return { loading: b.classList.contains('loading'), disabled: b.disabled, busy: b.getAttribute('aria-busy'), err: f.querySelector('.form-err').innerText.replace(/\s+/g, ' ').trim() };
  });
  assert.ok(!st.loading && !st.disabled && !st.busy, 'the Send button is not left busy: ' + JSON.stringify(st));
  ['+971 4 546 1110', '+234 902 222 2024', 'info@imperialholdingsgroup.com'].forEach(function (s) { assert.ok(st.err.indexOf(s) > -1, 'the message carries ' + s + ': ' + st.err); });
  t.ids = {};
  t.detail = 'no POST at all (the page stops before sending); the Send button is released and the person sees the office contacts ("' + st.err.slice(0, 60) + '..."), so a browser that autofilled the hidden field does not leave them with a spinner.';
});

test('2.4 honeypot filled, posted straight to the endpoints: rejected', async function (t) {
  const fields = { 'form-name': 'contact', about: 'citizenship', name: 'E2E Honeypot Direct', email: 'e2e.honeypot.direct@example.com', country: 'Nigeria', msg: 'TEST', consent: 'yes', company_url: 'http://spam.example', site: 'ihg' };
  const r1 = await realFetch(BASE + '/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fields).toString() });
  assert.equal(r1.status, 200, 'Netlify Forms stand-in answers 200');
  const sub = lastSubmission(t);
  assert.equal(sub.result.ok, false); assert.equal(sub.result.reason, 'honeypot');
  const r2 = await realFetch(BASE + '/.netlify/functions/lead', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: BASE }, body: JSON.stringify({ form: 'contact', data: fields }) });
  const j2 = await r2.json();
  assert.equal(j2.ok, false); assert.equal(j2.reason, 'honeypot');
  assert.equal(t.calls.length, 0, 'no mocked API was called');
  t.ids = { ref: sub.result.ref + ', ' + j2.ref };
  t.detail = 'submission-created: rejected reason=honeypot; lead.js: {ok:false, reason:honeypot}; no API call.';
});

test('3.1 phone verification completed with 123456: person Verified, note on the lead', async function (t, browser) {
  const spec = { journey: 'clients', about: 'private-office', division: 'private-office', name: 'E2E Verified', email: 'e2e.verified@example.com', phone: '+971 50 000 0301', country: 'United Arab Emirates', nationality: 'United Kingdom', for_whom: 'myself', timeline: '3m', band: 'hot', points: 6, msg: 'TEST verification completed.' };
  const page = await open(browser, t, 'desktop', '/contact?about=private-office');
  assert.equal((await curStep(page)).screen, 'who', 'the division is chosen by the link: the journey opens on the second screen');
  await journeyFlow(page, spec);
  await afterSuccess(page, 'code');
  t.ids = checkStored(t, spec, { verification: O.verificationStatus.verified });
  const person = m.persons.find(function (p) { return p.id === t.ids.person; });
  assert.equal(person[F.person.verificationStatus], O.verificationStatus.verified, 'person marked Verified (982)');
  const put = pdCalls(t, 'PUT', /^\/v1\/persons\/\d+$/).find(function (c) { return c.body[F.person.verificationStatus] === O.verificationStatus.verified; });
  assert.ok(put, 'PUT person with Verification Status 982');
  const starts = twilioStarts(t), checks = twilioChecks(t);
  assert.equal(starts.length, 1, 'one code sent'); assert.equal(starts[0].body.Channel, 'whatsapp'); assert.equal(starts[0].body.To, e164(spec.phone));
  assert.equal(checks.length, 2, 'two checks: a wrong code, then the right one');
  assert.equal(checks[0].response.status, 'pending'); assert.equal(checks[1].body.Code, '123456'); assert.equal(checks[1].response.status, 'approved');
  const vnote = m.notes.find(function (n) { return n.lead_id === t.ids.id && /Phone verified/.test(n.content); });
  assert.ok(vnote, 'a "Phone verified" note on the lead');
  const verifyHttp = t.http.filter(function (h) { return h.path === '/.netlify/functions/verify'; });
  assert.equal(verifyHttp[verifyHttp.length - 1].response.verified, true);
  assert.equal(verifyHttp[verifyHttp.length - 1].response.recorded, true);
  t.ids.verification = starts[0].response.sid; t.ids.verifyNote = vnote.id;
  t.detail = '/contact?about=private-office opened on "' + spec.screens[0] + '"; wrong code refused, 123456 approved; person ' + t.ids.person + ' Verification Status 982 (Verified); note ' + vnote.id + ' "Phone verified" on ' + t.ids.kind + ' ' + t.ids.id + '.';
});

test('3.2 phone verification skipped: the Academy enquiry arrives Not Verified', async function (t, browser) {
  const spec = { journey: 'partners', about: 'academy', division: 'academy', name: 'E2E Skipped', email: 'e2e.skipped@example.com', phone: '+234 802 000 0302', country: 'Nigeria', profession: 'Private banker', firm: 'E2E Skipped Bank', timeline: '3-12m', band: 'warm', points: 4, msg: 'TEST verification skipped.' };
  const page = await open(browser, t, 'mobile', '/contact?about=academy');
  assert.equal((await curStep(page)).screen, 'practice', 'the Academy link skips the first Partners screen');
  await journeyFlow(page, spec);
  await afterSuccess(page, 'skip');
  t.ids = checkStored(t, spec, {});
  const person = m.persons.find(function (p) { return p.id === t.ids.person; });
  assert.equal(person[F.person.verificationStatus], O.verificationStatus.notVerified, 'person stays Not Verified (983)');
  assert.equal(twilioChecks(t).length, 0, 'no code check');
  assert.equal(m.notes.filter(function (n) { return n.deal_id === t.ids.id; }).length, 1, 'only the enquiry note on the deal');
  const b = await bookingState(page);
  assert.equal(b.links.length, 0, 'no booking links while config.booking urls are empty');
  assert.equal(b.tbc.length, 2, 'both offices show the tbc text');
  t.detail = 'code sent then skipped; person ' + t.ids.person + ' Verification Status 983 (Not Verified); ' + t.ids.kind + ' ' + t.ids.id + ' arrived with one note; booking shows the tbc text for both offices (mobile).';
});

test('4.1 booking buttons carry name, email and division (config override), journey from the division page', async function (t, browser) {
  const spec = { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Booker', email: 'e2e.booker@example.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'family', timeline: '3m', budget: 'over-1m', band: 'hot', points: 9, msg: 'TEST booking links.' };
  spec.before = async function (p) { await p.evaluate(function () { window.IHG.config.booking.dubai.url = 'https://booking.example.test/dubai'; window.IHG.config.booking.lagos.url = 'https://booking.example.test/lagos?office=lagos'; }); };
  const page = await open(browser, t, 'desktop', '/divisions/citizenship');
  await follow(page, divisionLink(page, 'citizenship'));
  await journeyFlow(page, spec);
  await afterSuccess(page, 'none');
  const b = await bookingState(page);
  assert.equal(b.links.length, 2, 'one button per office');
  /* a1 carries the division's name, which reads as an answer on the booking page (the key stays in data-division for analytics) */
  const q = 'name=' + encodeURIComponent(spec.name) + '&email=' + encodeURIComponent(spec.email) + '&a1=' + encodeURIComponent('Imperial Citizenship');
  assert.equal(b.links[0].href, 'https://booking.example.test/dubai?' + q, 'Dubai link');
  assert.equal(b.links[1].href, 'https://booking.example.test/lagos?office=lagos&' + q, 'Lagos link keeps its own query');
  assert.deepEqual(b.links.map(function (l) { return l.office; }), ['Dubai', 'Lagos']);
  assert.ok(b.links.every(function (l) { return l.division === 'citizenship'; }));
  assert.equal(b.tbc.length, 0);
  const guide = await page.locator('#cf .jp-next a[data-go="guide"]').count();
  assert.equal(guide, 1, 'the citizenship route offers the guide among the next steps');
  const sub = lastSubmission(t);
  t.ids = checkStored(t, spec, { noteHas: [journeyLine(spec, 'division')] });
  t.detail = 'division page card, then ' + spec.screens.join(' > ') + '; Dubai: ' + b.links[0].href + ' ; Lagos: ' + b.links[1].href + ' (no phone given, so no verification step; ' + t.ids.kind + ' ' + t.ids.id + ', ref ' + sub.result.ref + '); the guide link is offered.';
});

test('4.2 booking shows the tbc text while config.booking is empty', async function (t, browser) {
  const spec = { journey: 'clients', about: 'group', division: 'group', name: 'E2E Tbc', email: 'e2e.tbc@example.com', phone: '', country: 'South Africa', for_whom: 'myself', timeline: '3-12m', band: 'warm', points: 3, msg: 'TEST booking placeholder.' };
  const page = await open(browser, t, 'desktop', '/contact');
  const side = await page.evaluate(function () { return Array.prototype.map.call(document.querySelectorAll('.tbc'), function (el) { return el.textContent.trim(); }); });
  await journeyFlow(page, spec);
  await afterSuccess(page, 'none');
  const b = await bookingState(page);
  assert.equal(b.links.length, 0);
  assert.equal(b.tbc.length, 2);
  assert.ok(/Dubai/.test(b.tbc[0]) && /booking page/.test(b.tbc[0]), 'Dubai tbc: ' + b.tbc[0]);
  assert.ok(/Lagos/.test(b.tbc[1]) && /booking page/.test(b.tbc[1]), 'Lagos tbc: ' + b.tbc[1]);
  const rc = await received(page);
  assert.ok(/received by the Group/.test(rc.text) && /bring in the right house/.test(rc.text), 'the Group variant of the received text: ' + rc.text);
  t.ids = checkStored(t, spec, {});
  t.detail = 'success screen: "' + b.tbc.join('" and "') + '"; the Contact page side column also carries ' + side.filter(function (s) { return /booking/.test(s); }).length + ' booking placeholders; the Group wording "' + rc.text.slice(0, 70) + '...".';
});

test('5.1 primary POST fails: the fallback endpoint receives the lead, the direct received wording with the reference', async function (t, browser) {
  state.primaryFail = true;
  const spec = { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Fallback', email: 'e2e.fallback@example.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'family', timeline: '3m', budget: '500k-1m', band: 'hot', points: 8, msg: 'TEST primary failure.' };
  const page = await open(browser, t, 'mobile', trackingUrl('/contact', 'fallback'));
  let tracking;
  spec.before = async function (p) { tracking = await trackingSeen(p); };
  await journeyFlow(page, spec);
  await afterSuccess(page, 'none');
  const primary = t.http.find(function (h) { return h.path === '/'; }), lead = t.http.find(function (h) { return h.path === '/.netlify/functions/lead'; });
  assert.ok(primary && primary.status === 500, 'the primary POST / answered 500');
  assert.ok(lead && lead.status === 200 && lead.response.ok === true, 'lead.js answered ok');
  assert.ok(/^W[0-9A-Z]+$/.test(lead.response.ref), 'direct reference W...: ' + lead.response.ref);
  const rc = await received(page);
  assert.equal(rc.title, 'Received, and with Imperial Citizenship.', 'the direct wording');
  assert.ok(rc.text.indexOf('Reference ' + lead.response.ref + '.') > -1, 'the reference is shown: ' + rc.text);
  t.ids = checkStored(t, spec, { result: lead.response, tracking: tracking, noteHas: ['Direct submission (fallback endpoint)', 'Ref ' + lead.response.ref] });
  t.detail = 'POST / 500, then POST /.netlify/functions/lead {ok:true, ref:' + lead.response.ref + '}; ' + t.ids.kind + ' ' + t.ids.id + ' created with the note marked "Direct submission (fallback endpoint)"; the page says "' + rc.title + '" with the reference (mobile).';
});

test('5.2 both fail: fallback message with both telephones and the email, draft with the path survives a reload', async function (t, browser) {
  state.primaryFail = true; state.fallbackFail = true;
  const spec = { journey: 'partners', about: 'partners-club', key: 'introduce', division: 'partners-club', name: 'E2E Draft', email: 'e2e.draft@example.com', phone: '+234 802 000 0502', country: 'Nigeria', for_whom: 'client', timeline: '3m', firm: 'Draft Partners', profession: 'Private banker', msg: 'TEST both endpoints down.' };
  const page = await open(browser, t, 'desktop', '/contact');
  await journeyFlow(page, spec);
  await page.waitForSelector('#cf form .form-err:not([hidden])', { timeout: 20000 });
  const seen = (await page.locator('#cf form .form-err').innerText()).replace(/\s+/g, ' ').trim();
  ['+971 4 546 1110', '+234 902 222 2024', 'info@imperialholdingsgroup.com'].forEach(function (s) { assert.ok(seen.indexOf(s) > -1, 'fallback message carries ' + s + ': ' + seen); });
  assert.ok(/could not send/i.test(seen) && /kept on this device/i.test(seen), 'fallback wording: ' + seen);
  assert.equal(t.http.filter(function (h) { return h.status === 500; }).length, 2, 'both endpoints answered 500');
  assert.equal(t.calls.length, 0, 'nothing reached any API');
  assert.equal(await page.locator('#cf .success').count(), 0, 'no received state');
  const focused = await page.evaluate(function () { return document.activeElement && document.activeElement.className; });
  const draftKey = await page.evaluate(function () { return localStorage.getItem('ihg-draft-contact'); });
  assert.ok(draftKey, 'draft stored under ihg-draft-contact');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#draft:not([hidden])', { timeout: 10000 });
  const restored = await page.evaluate(function () {
    const f = document.querySelector('#cf form'), ab = f.querySelector('input[name="about"]:checked'), el = function (n) { return f.elements.namedItem(n); };
    return { note: document.getElementById('draft').textContent.trim(), path: el('audience').value, pathLine: (document.querySelector('[data-path-name]') || {}).textContent, about: ab ? ab.value : '', key: ab ? ab.getAttribute('data-key') : '', for_whom: el('for_whom').value, name: el('name').value, email: el('email').value, phone: el('phone').value, firm: el('firm').value, profession: el('profession').value, msg: el('msg').value, timeline: el('timeline').value, consent: el('consent').checked, screen: document.querySelector('#cf form .cf-step.on').getAttribute('data-screen') };
  });
  assert.equal(restored.path, 'partners', 'the path is restored'); assert.equal(restored.pathLine, 'Professional Partners');
  assert.equal(restored.about, 'partners-club'); assert.equal(restored.key, 'introduce', 'the "Introduce a client" option, not "Become a Partner"'); assert.equal(restored.for_whom, 'client');
  assert.equal(restored.name, spec.name); assert.equal(restored.email, spec.email); assert.equal(restored.phone, spec.phone);
  assert.equal(restored.firm, spec.firm); assert.equal(restored.profession, spec.profession); assert.equal(restored.msg, spec.msg); assert.equal(restored.timeline, '3m');
  assert.equal(restored.screen, 'you', 'the journey reopens on the first screen that still needs an answer (consent)');
  assert.ok(/kept what you started/i.test(restored.note), 'draft note: ' + restored.note);
  assert.equal(restored.consent, false, 'consent is not restored (the person ticks it again)');
  t.ids = {};
  t.detail = 'message: "' + seen.slice(0, 140) + '..."; focus moved to the ' + (focused || 'page') + '; after reload the draft note shows, the Partners path reopens on the closing screen with the introduce option, name, email, phone, firm, profession, timeline and message back; consent is asked again.';
});

test('6.1 guide form: lead_source guide reaches the backend', async function (t, browser) {
  const spec = { division: 'citizenship', name: 'E2E Guide', email: 'e2e.guide@example.com', band: 'exploring', points: 2, leadSource: 'guide' };
  const page = await open(browser, t, 'desktop', '/divisions/citizenship');
  const f = page.locator('#guide-card form');
  await f.locator('input[name="name"]').fill(spec.name);
  await f.locator('input[name="email"]').fill(spec.email);
  await f.locator('input[name="consent"]').check();
  await click(f.locator('button[type="submit"]'));
  await afterSuccess(page, 'none', '[data-form="guide"] ');
  const sub = lastSubmission(t);
  assert.equal(sub.form, 'guide');
  const posted = t.fnlog.join(' ');
  assert.ok(/form=guide/.test(posted) && /division=citizenship/.test(posted), 'function log: ' + posted);
  t.ids = checkStored(t, spec, { titleSuffix: '(guide)', noteHas: ['Lead source: guide', 'Website enquiry (guide form)'] });
  const email = emailFor(t, spec.email);
  assert.equal(email.body.subject, 'Your guide request');
  const seen = await page.evaluate(function () { const s = document.querySelector('[data-form="guide"] .success'); return { msg: s.querySelector('p').textContent.trim(), tbc: Array.prototype.map.call(s.querySelectorAll('.tbc'), function (el) { return el.textContent.trim(); }) }; });
  assert.ok(/being finalised/.test(seen.msg), 'guide not ready message: ' + seen.msg);
  assert.ok(seen.tbc.some(function (s) { return /Guide PDF/.test(s); }), 'guide tbc shown: ' + seen.tbc.join(','));
  assert.equal(seen.tbc.length, 3, 'the guide placeholder plus the two booking placeholders: ' + seen.tbc.join(','));
  t.detail = 'form guide, lead_source guide, ' + t.ids.kind + ' ' + t.ids.id + ' "(guide)" for Imperial Citizenship, score exploring, email "Your guide request"; the page says the guide is being finalised and shows the tbc placeholder (config.guide.file is empty).';
});

test('6.2 programme fit check hands over to the journey: lead_source programme-fit and quiz_answers reach the backend', async function (t, browser) {
  const page = await open(browser, t, 'mobile', '/divisions/citizenship');
  await fitCheck(page);
  assert.ok(/[?&]about=citizenship/.test(page.url()) && /[?&]via=fit/.test(page.url()), 'the fit check opens /contact?about=citizenship&via=fit: ' + page.url());
  const pre = await page.evaluate(function () {
    const f = document.querySelector('#cf form'), el = function (n) { return f.elements.namedItem(n); }, ab = f.querySelector('input[name="about"]:checked');
    return { about: ab ? ab.value : '', audience: el('audience').value, lead_source: el('lead_source').value, quiz_answers: el('quiz_answers').value, for_whom: el('for_whom').value, country: el('country').value, timeline: el('timeline').value, budget: el('budget').value, screen: document.querySelector('#cf form .cf-step.on').getAttribute('data-screen'), from: ((document.querySelector('#cf .from-finder') || {}).textContent || '').replace(/\s+/g, ' ') };
  });
  assert.equal(pre.about, 'citizenship'); assert.equal(pre.audience, 'clients'); assert.equal(pre.lead_source, 'programme-fit');
  assert.deepEqual(JSON.parse(pre.quiz_answers), { who: 'family', where: 'nigeria', matters: 'live', timeline: '3m', budget: '500k-1m' });
  assert.equal(pre.for_whom, 'family'); assert.equal(pre.country, 'Nigeria'); assert.equal(pre.timeline, '3m'); assert.equal(pre.budget, '500k-1m');
  assert.equal(pre.screen, 'you', 'every answered screen is passed: the journey opens on the closing screen');
  assert.ok(/programme fit check/i.test(pre.from), 'the page says where the answers came from: ' + pre.from);
  const spec = { journey: 'clients', division: 'citizenship', name: 'E2E Fit', email: 'e2e.fit@example.com', band: 'hot', points: 8, leadSource: 'programme-fit', timeline: '3m', msg: 'TEST programme fit check.' };
  await journeyFlow(page, spec);
  await afterSuccess(page, 'none');
  const sub = lastSubmission(t);
  assert.equal(sub.form, 'contact');
  t.ids = checkStored(t, spec, { titleSuffix: '(programme fit)', noteHas: ['Lead source: programme-fit', 'Programme fit answers: ' + pre.quiz_answers, 'Country of residence: Nigeria (set on the person)', journeyLine(spec, 'fit')] });
  const rec = m.leads.find(function (l) { return l.id === t.ids.id; });
  assert.ok(/Programme fit check/.test(rec[F.deal.serviceRequested]), 'Service Requested mentions the fit check');
  t.detail = 'five answers became the journey draft; /contact?about=citizenship&via=fit opened on the closing screen with about, audience, for_whom, country, timeline, budget, lead_source and quiz_answers set; ' + t.ids.kind + ' ' + t.ids.id + ' "(programme fit)", score hot (8 points), note carries "Programme fit answers: ' + pre.quiz_answers + '" and the Journey line with Entry fit (mobile).';
});

test('7.1 journey: the Send button shows the loading state while the enquiry is sent', async function (t, browser) {
  state.primaryDelayMs = 1500;
  const spec = { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Loading', email: 'e2e.loading@example.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'family', timeline: '3m', budget: 'over-1m', band: 'hot', points: 9, msg: 'TEST loading state.' };
  const page = await open(browser, t, 'desktop', '/contact');
  await journeyFlow(page, spec);
  await page.waitForTimeout(400);
  const st = await page.evaluate(function () {
    const f = document.querySelector('#cf form'), pick = function (el) { return { loading: el.classList.contains('loading'), disabled: el.disabled, busy: el.getAttribute('aria-busy') }; };
    return { send: pick(f.querySelector('[data-send]')), step1Continue: pick(f.querySelector('.cf-step[data-step="1"] [data-next]')), screen: f.querySelector('.cf-step.on').getAttribute('data-screen') };
  });
  await afterSuccess(page, 'none');
  t.ids = checkStored(t, spec, {});
  t.detail = 'while the POST was in flight: Send ' + JSON.stringify(st.send) + ', hidden first screen Continue ' + JSON.stringify(st.step1Continue) + ', the closing screen stays (' + st.screen + '); the enquiry itself arrived (' + t.ids.kind + ' ' + t.ids.id + ').';
  assert.ok(st.send.loading && st.send.disabled && st.send.busy === 'true', 'Send is marked loading, disabled and aria-busy while the request is in flight; got Send ' + JSON.stringify(st.send) + ' and hidden step 1 Continue ' + JSON.stringify(st.step1Continue));
  assert.ok(!st.step1Continue.loading && !st.step1Continue.disabled, 'the hidden first screen Continue button is left alone');
  assert.equal(st.screen, 'you', 'the screen stays while sending');
});

test('7.2 old #/ links and the .html copies land on their page, not on the home markup the server sent', async function (t, browser) {
  const ctx = await browser.newContext(Object.assign({ reducedMotion: 'reduce' }, VIEWPORTS.desktop));
  t.close = function () { return ctx.close(); };
  const page = await ctx.newPage();
  page.on('pageerror', function (e) { t.errors.push('pageerror: ' + e.message); });
  const urls = ['/#/contact', '/#/about', '/#/divisions/citizenship', '/#/contact?about=academy', '/about.html', '/divisions/citizenship.html'];
  const seen = {};
  for (const u of urls) {
    await page.goto(BASE + u, { waitUntil: 'networkidle' });
    seen[u] = await page.evaluate(function () {
      return { path: location.pathname + location.search, title: document.title, h1: ((document.querySelector('#app h1') || {}).textContent || '').replace(/\s+/g, ' '), contact: !!document.querySelector('#app form[name="contact"]'), home: !!document.querySelector('#app .hh'), nf: document.body.classList.contains('is-nf'), about: (document.querySelector('#cf input[name="about"]:checked') || {}).value || '' };
    });
  }
  assert.equal(seen['/#/contact'].path, '/contact', 'the hash is rewritten to the path');
  assert.ok(seen['/#/contact'].contact && !seen['/#/contact'].home, '/#/contact shows the journey, not the home hero: ' + JSON.stringify(seen['/#/contact']));
  assert.ok(/^Start a relationship/.test(seen['/#/contact'].title), 'contact title: ' + seen['/#/contact'].title);
  assert.ok(/One house/.test(seen['/#/about'].h1) && !seen['/#/about'].home, '/#/about shows the About page: ' + JSON.stringify(seen['/#/about']));
  assert.ok(/Second residency/.test(seen['/#/divisions/citizenship'].h1), '/#/divisions/citizenship shows the division page: ' + JSON.stringify(seen['/#/divisions/citizenship']));
  assert.equal(seen['/#/contact?about=academy'].about, 'academy', 'a hash link with a query keeps its choice');
  assert.ok(!seen['/about.html'].nf && /One house/.test(seen['/about.html'].h1), '/about.html is the About page, not the not-found view: ' + JSON.stringify(seen['/about.html']));
  assert.ok(!seen['/divisions/citizenship.html'].nf && /Second residency/.test(seen['/divisions/citizenship.html'].h1), '/divisions/citizenship.html is the division page: ' + JSON.stringify(seen['/divisions/citizenship.html']));
  t.ids = {};
  t.detail = urls.map(function (u) { return u + ' -> ' + seen[u].path + ' "' + seen[u].title + '"'; }).join('; ');
});

test('7.3 a visitor from a search engine is recorded as organic, not as a referral', async function (t, browser) {
  const spec = { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Organic', email: 'e2e.organic@example.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'family', timeline: '3m', budget: 'over-1m', band: 'hot', points: 9, msg: 'TEST organic search visit.' };
  /* a plain referral first, in its own session, so the two cannot be confused */
  const other = await open(browser, t, 'desktop', '/contact', null, { referer: 'https://partner.example.net/introductions' });
  const ref = await other.evaluate(function () { return JSON.parse(sessionStorage.getItem('ihg-src')); });
  assert.equal(ref.source, 'partner.example.net'); assert.equal(ref.medium, 'referral');
  await t.close();
  const page = await open(browser, t, 'desktop', '/contact', null, { referer: 'https://www.google.com/' });
  const trk = await page.evaluate(function () { return JSON.parse(sessionStorage.getItem('ihg-src')); });
  assert.equal(trk.source, 'google.com', 'source is the search engine host');
  assert.equal(trk.medium, 'organic', 'medium organic for a search engine referrer');
  assert.equal(trk.referrer, 'https://www.google.com/');
  let tracking;
  spec.before = async function (p) { tracking = await trackingSeen(p); };
  await journeyFlow(page, spec);
  await afterSuccess(page, 'none');
  assert.equal(tracking.source, 'google.com'); assert.equal(tracking.medium, 'organic');
  t.ids = checkStored(t, spec, { tracking: tracking });
  t.detail = 'referrer https://www.google.com/ -> source google.com, medium organic (a partner.example.net referrer stays referral); the note on ' + t.ids.kind + ' ' + t.ids.id + ' carries source: google.com and medium: organic, score hot (9 points, organic +1).';
});

test('7.4 code accepted but not yet recorded in Pipedrive: softer wording, the step still finishes, no second check', async function (t, browser) {
  const spec = { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Unrecorded', email: 'e2e.unrecorded@example.com', phone: '+234 802 000 0704', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'myself', timeline: '3m', budget: 'undisclosed', band: 'hot', points: 6, msg: 'TEST code accepted, not recorded.' };
  const stub = { checks: 0 };
  const page = await open(browser, t, 'desktop', '/divisions/citizenship', stubVerify(function (body) { if (body.action !== 'check') return null; stub.checks++; return { ok: true, verified: true, recorded: false, reason: 'person' }; }));
  await captureEvents(page);
  await follow(page, divisionLink(page, 'citizenship'));
  await journeyFlow(page, spec);
  const s = '#cf ';
  await page.waitForSelector(s + '[data-verify]', { timeout: 10000 });
  await page.locator(s + 'input[name="code"]').fill('123456');
  await click(page.locator(s + '[data-verify-send]'));
  await page.waitForSelector(s + '.verified', { timeout: 10000 });
  await page.waitForSelector(s + '.book', { timeout: 10000 });
  const text = (await page.locator(s + '.verified').innerText()).replace(/\s+/g, ' ').trim();
  assert.ok(/Code accepted/.test(text) && /note it on your enquiry/.test(text) && !/Phone verified/.test(text), 'softer wording: ' + text);
  assert.equal(stub.checks, 1, 'exactly one check call');
  await page.waitForTimeout(800);
  assert.equal(stub.checks, 1, 'the code is never checked a second time');
  assert.equal(await page.locator(s + '[data-verify]').count(), 0, 'no re-check offered');
  const pv = (await events(page)).find(function (e) { return e.name === 'phone_verified'; });
  assert.ok(pv, 'phone_verified event sent');
  assert.equal(pv.params.recorded, false, 'the event says recorded:false');
  assert.equal(twilioStarts(t).length, 1, 'one code sent (the real start)');
  t.ids = checkStored(t, spec, {});
  t.detail = 'journey from the division page; check answered {verified:true, recorded:false}: the page says "' + text + '", moves on to booking, sends phone_verified with recorded:false and never re-checks; person ' + t.ids.person + ' stays Not Verified until the team marks it.';
});

test('7.5 WhatsApp cannot deliver the code: the page tries SMS itself', async function (t, browser) {
  const spec = { journey: 'clients', about: 'private-office', division: 'private-office', name: 'E2E No WhatsApp', email: 'e2e.nowhatsapp@example.com', phone: '+971 50 000 0705', country: 'United Arab Emirates', nationality: 'United Kingdom', for_whom: 'myself', timeline: '3m', band: 'hot', points: 6, msg: 'TEST WhatsApp refused, SMS instead.' };
  const page = await open(browser, t, 'desktop', '/divisions/private-office', stubVerify(function (body) { return body.action === 'start' && body.channel === 'whatsapp' ? { ok: false, enabled: true, reason: 'provider', detail: 'not on WhatsApp' } : null; }));
  await follow(page, divisionLink(page, 'private-office'));
  await journeyFlow(page, spec);
  const s = '#cf ';
  await page.waitForSelector(s + '[data-verify]', { timeout: 10000 });
  const intro = (await page.locator(s + '.verify > p').first().innerText()).replace(/\s+/g, ' ');
  assert.ok(/by SMS/.test(intro), 'the step says the code went by SMS: ' + intro);
  const starts = twilioStarts(t);
  assert.equal(starts.length, 1, 'one Twilio send'); assert.equal(starts[0].body.Channel, 'sms', 'by SMS');
  await page.locator(s + 'input[name="code"]').fill('123456');
  await click(page.locator(s + '[data-verify-send]'));
  await page.waitForSelector(s + '.verified', { timeout: 10000 });
  await page.waitForSelector(s + '.book', { timeout: 10000 });
  t.ids = checkStored(t, spec, { verification: O.verificationStatus.verified });
  t.detail = 'journey from the division page; whatsapp start refused (reason provider), sms start sent (Twilio Channel sms), 123456 approved; person ' + t.ids.person + ' Verified (982).';
});

test('7.6 a number without its country code: the person is told and the enquiry continues unverified', async function (t, browser) {
  const spec = { journey: 'partners', about: 'academy', division: 'academy', name: 'E2E No Code', email: 'e2e.nocode@example.com', phone: '0802 000 0706', country: 'Nigeria', profession: 'Family office', firm: 'E2E No Code Office', timeline: '3-12m', band: 'warm', points: 4, msg: 'TEST number without country code.' };
  const page = await open(browser, t, 'mobile', '/divisions/academy');
  await follow(page, divisionLink(page, 'academy'));
  await journeyFlow(page, spec);
  const s = '#cf ';
  await page.waitForSelector(s + '.verify-note', { timeout: 10000 });
  await page.waitForSelector(s + '.book', { timeout: 10000 });
  const note = (await page.locator(s + '.verify-note').innerText()).replace(/\s+/g, ' ').trim();
  assert.ok(/could not send a verification code/.test(note) && /country code/.test(note), 'the note explains: ' + note);
  assert.equal(await page.locator(s + '[data-verify]').count(), 0, 'no code step');
  const verifyHttp = t.http.filter(function (h) { return h.path === '/.netlify/functions/verify'; });
  assert.equal(verifyHttp.length, 1, 'one start call'); assert.equal(verifyHttp[0].response.reason, 'phone', 'verify.js answered reason phone');
  assert.equal(twilioStarts(t).length, 0, 'nothing sent to Twilio');
  t.ids = checkStored(t, Object.assign({}, spec, { phone: '' }), {});
  t.detail = 'journey from the division page; verify.js answered {ok:false, enabled:true, reason:phone} (no Twilio call); the page says "' + note + '" and shows booking; ' + t.ids.kind + ' ' + t.ids.id + ' arrived Not Verified (mobile).';
});

test('7.7 programme fit answers survive a wander round the site: the journey draft keeps lead_source and quiz_answers', async function (t, browser) {
  const page = await open(browser, t, 'desktop', '/divisions/citizenship');
  await fitCheck(page);
  const f = page.locator('#cf form');
  await f.locator('input[name="name"]').fill('E2E Wanderer');
  await f.locator('input[name="email"]').fill('e2e.wanderer@example.com');
  const link = await page.evaluate(function () { const a = document.querySelector('#cf .consent a[href$="/privacy"]'); return { target: a.getAttribute('target'), rel: a.getAttribute('rel') }; });
  assert.equal(link.target, '_blank', 'the privacy link in the consent box opens in a new tab'); assert.ok(/noopener/.test(link.rel));
  /* away to About through the header, then back */
  await click(page.locator('.nav a[data-nav="about"]'));
  await page.waitForFunction(function () { return location.pathname === '/about' && /One house/.test(((document.querySelector('#app h1') || {}).textContent || '')); }, null, { timeout: 10000 });
  await page.goBack();
  await page.waitForFunction(function () { return location.pathname === '/contact' && !!document.querySelector('#cf form .cf-step.on'); }, null, { timeout: 10000 });
  const back = await page.evaluate(function () {
    const f = document.querySelector('#cf form'), el = function (n) { return f.elements.namedItem(n); }, ab = f.querySelector('input[name="about"]:checked');
    return { lead_source: el('lead_source').value, quiz_answers: el('quiz_answers').value, name: el('name').value, email: el('email').value, about: ab ? ab.value : '', timeline: el('timeline').value, budget: el('budget').value, country: el('country').value, note: !document.getElementById('draft').hidden };
  });
  assert.equal(back.lead_source, 'programme-fit', 'lead_source restored');
  assert.deepEqual(JSON.parse(back.quiz_answers), { who: 'family', where: 'nigeria', matters: 'live', timeline: '3m', budget: '500k-1m' }, 'quiz_answers restored');
  assert.equal(back.name, 'E2E Wanderer'); assert.equal(back.email, 'e2e.wanderer@example.com'); assert.equal(back.about, 'citizenship'); assert.equal(back.timeline, '3m'); assert.equal(back.budget, '500k-1m'); assert.equal(back.country, 'Nigeria');
  assert.ok(back.note, 'the draft note is shown');
  const spec = { journey: 'clients', division: 'citizenship', name: 'E2E Wanderer', email: 'e2e.wanderer@example.com', band: 'hot', points: 8, leadSource: 'programme-fit', timeline: '3m', msg: 'TEST fit answers after a wander.' };
  await journeyFlow(page, spec);
  await afterSuccess(page, 'none');
  t.ids = checkStored(t, spec, { titleSuffix: '(programme fit)', noteHas: ['Lead source: programme-fit', 'Programme fit answers: ' + back.quiz_answers] });
  t.detail = 'after About and back: lead_source programme-fit, quiz_answers, the division and the typed name and email restored under ihg-draft-contact with the draft note; the lead ' + t.ids.id + ' arrived as "(programme fit)" with the answers in the note. The consent box privacy link opens in a new tab.';
});

test('7.8 a stalled primary post is abandoned after 15 s and the fallback endpoint takes the lead', async function (t, browser) {
  state.primaryHangMs = 19000;
  const spec = { journey: 'clients', about: 'private-office', division: 'private-office', name: 'E2E Stalled', email: 'e2e.stalled@example.com', phone: '', country: 'United Arab Emirates', nationality: 'United Kingdom', for_whom: 'myself', timeline: '3-12m', band: 'warm', points: 4, msg: 'TEST stalled connection.' };
  const page = await open(browser, t, 'desktop', '/contact');
  await journeyFlow(page, spec);
  const t0 = Date.now();
  await afterSuccess(page, 'none');
  const took = Date.now() - t0;
  assert.ok(took >= 14000 && took < 19000, 'success after the 15 s abandon, before the server gave up: ' + took + ' ms');
  const lead = t.http.find(function (h) { return h.path === '/.netlify/functions/lead'; });
  assert.ok(lead && lead.status === 200 && lead.response.ok === true, 'the fallback endpoint stored the lead');
  const rc = await received(page);
  assert.equal(rc.title, 'Received, and with Imperial Private Office.', 'the fallback answer is the direct one: ' + rc.title);
  t.ids = checkStored(t, spec, { result: lead.response, noteHas: ['Direct submission (fallback endpoint)'] });
  /* let the held connection finish before the next case, so its 504 is logged against this one */
  await new Promise(function (ok) { setTimeout(ok, Math.max(0, 19500 - (Date.now() - t0))); });
  const primary = t.http.find(function (h) { return h.path === '/'; });
  assert.ok(primary && primary.status === 504 && !primary.submission, 'the stalled primary post never ran the function');
  t.detail = 'POST / held for 19 s (never run): the page abandoned it after 15 s (' + took + ' ms to the success state), posted to lead.js and got ' + t.ids.kind + ' ' + t.ids.id + ' (ref ' + lead.response.ref + '); the page says "' + rc.title + '".';
});

/* ---------- 8. the journey itself (docs/RELATIONSHIP-JOURNEY.md 6.11) ---------- */
test('8.1 the chooser: each path produces the right audience and record', async function (t, browser) {
  const runs = [
    { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Chooser Client', email: 'e2e.chooser.client@example.com', phone: '', country: 'Nigeria', for_whom: 'myself', timeline: '3m', budget: 'over-1m', band: 'hot', points: 9 },
    { journey: 'partners', about: 'partners-club', key: 'introduce', division: 'partners-club', name: 'E2E Chooser Partner', email: 'e2e.chooser.partner@example.com', phone: '', profession: 'Immigration consultant', firm: 'E2E Chooser Advisers', country: 'United Kingdom', for_whom: 'client', interests: ['A home or property in Dubai'], timeline: '3m', band: 'hot', points: 7 },
    { journey: 'institutions', division: 'group', name: 'E2E Chooser Institution', email: 'e2e.chooser.institution@example.com', phone: '', interests: ['A strategic partnership', 'An event or diplomatic collaboration'], firm: 'E2E Example Mission', org_type: 'mission', profession: 'Counsellor', country: 'United Arab Emirates', timeline: '3m', band: 'warm', points: 5 }
  ];
  const out = [];
  for (const spec of runs) {
    const page = await open(browser, t, 'desktop', '/contact');
    assert.equal((await curStep(page)).screen, 'path', 'the chooser shows when no link names a path');
    await journeyFlow(page, spec);
    await afterSuccess(page, 'none');
    const noteHas = [journeyLine(spec), 'Audience: ' + spec.journey + ' · '];
    if (spec.journey === 'institutions') noteHas.push('Organisation: E2E Example Mission · Type: ' + routing.labels.orgType.mission + ' · Role: Counsellor', 'Interests: A strategic partnership, An event or diplomatic collaboration');
    if (spec.journey === 'partners') noteHas.push('Enquiry for: a client I am introducing', 'Profession: Immigration consultant');
    const ids = checkStored(t, spec, { noteHas: noteHas });
    const rec = ids.kind === 'deal' ? m.deals.find(function (d) { return d.id === ids.id; }) : m.leads.find(function (l) { return l.id === ids.id; });
    if (spec.journey === 'institutions') {
      assert.ok(/Organisation: E2E Example Mission, Embassy/.test(rec[F.deal.serviceRequested]) && /Exploring: A strategic partnership/.test(rec[F.deal.serviceRequested]), 'Service Requested names the organisation and what it explores: ' + rec[F.deal.serviceRequested]);
      const rc = await received(page);
      assert.equal(rc.title, 'Received by Imperial.'); assert.ok(/passed to the Group/.test(rc.text), 'the Group wording: ' + rc.text);
    }
    out.push(spec.journey + ': ' + ids.kind + ' ' + ids.id + ' in ' + ids.pipeline + (rec[F.deal.contactType] ? ', Contact Type ' + rec[F.deal.contactType] : ', no Contact Type') + (ids.org ? ', organisation ' + ids.org : '') + ' (' + spec.screens.join(' > ') + ')');
    await t.close();
  }
  t.ids = {};
  t.detail = out.join('; ');
});

test('8.2 switching path from Private Clients ("A client I am introducing") keeps name and email and clears the clients answers', async function (t, browser) {
  const page = await open(browser, t, 'desktop', '/contact');
  await captureEvents(page);
  const S = CUR + ' ';
  await click(page.locator('#cf .jp-card[data-path="clients"]'));
  await waitStepChange(page, 0);
  /* through the clients path to the closing screen, typing name and email there */
  await fillScreen(page, { about: 'citizenship' }); await click(page.locator(S + '[data-next]')); await waitStepChange(page, 1);
  await fillScreen(page, { for_whom: 'family', country: 'Nigeria' }); await click(page.locator(S + '[data-next]')); await waitStepChange(page, 2);
  await fillScreen(page, { timeline: '3-12m' }); await click(page.locator(S + '[data-next]')); await waitStepChange(page, 3);
  await page.locator(S + 'input[name="name"]').fill('E2E Switcher');
  await page.locator(S + 'input[name="email"]').fill('e2e.switcher@example.com');
  /* back to "Who is this for": the introducing option offers the Partners path */
  await click(page.locator(S + '[data-back]')); await waitStepChange(page, 4);
  await click(page.locator(S + '[data-back]')); await waitStepChange(page, 3);
  assert.equal((await curStep(page)).screen, 'who');
  await click(page.locator(S + 'label:has(input[name="for_whom"][value="client"])'));
  await page.waitForSelector(S + '[data-offer-for="client"]:not([hidden])', { timeout: 5000 });
  await click(page.locator(S + '[data-offer-for="client"] [data-path="partners"]'));
  await page.waitForFunction(function (sel) { const s = document.querySelector(sel); return s && s.getAttribute('data-screen') === 'how'; }, CUR, { timeout: 5000 });
  const after = await page.evaluate(function () {
    const f = document.querySelector('#cf form'), el = function (n) { return f.elements.namedItem(n); };
    return { audience: el('audience').value, name: el('name').value, email: el('email').value, country: el('country').value, timeline: f.querySelector('input[name="timeline"]:checked') ? 'checked' : '', budget: !!el('budget'), clientsAbout: !!f.querySelector('input[name="about"][value="citizenship"]'), path: document.querySelector('[data-path-name]').textContent };
  });
  assert.equal(after.audience, 'partners'); assert.equal(after.path, 'Professional Partners');
  assert.equal(after.name, 'E2E Switcher', 'the typed name is kept'); assert.equal(after.email, 'e2e.switcher@example.com', 'the typed email is kept');
  assert.equal(after.country, '', 'the clients country is cleared'); assert.equal(after.timeline, '', 'the clients timeline is cleared');
  assert.ok(!after.budget && !after.clientsAbout, 'the clients screens are gone');
  const ev = (await events(page)).find(function (e) { return e.name === 'journey_switched'; });
  assert.ok(ev && ev.params.from === 'clients' && ev.params.to === 'partners', 'journey_switched {from: clients, to: partners}: ' + JSON.stringify(ev));
  const spec = { journey: 'partners', about: 'partners-club', key: 'introduce', division: 'partners-club', name: 'E2E Switcher', email: 'e2e.switcher@example.com', phone: '', profession: 'Lawyer', firm: 'E2E Switch LLP', country: 'Nigeria', for_whom: 'client', timeline: '3m', band: 'hot', points: 7 };
  await journeyFlow(page, spec);
  await afterSuccess(page, 'none');
  t.ids = checkStored(t, spec, { noteHas: [journeyLine(spec), 'Enquiry for: a client I am introducing'] });
  assert.ok(noteLines(m.notes.find(function (n) { return n.id === t.ids.note; }).content).some(function (l) { return l.indexOf('Audience: partners · ') === 0; }), 'audience partners in the note');
  assert.equal(m.leads.filter(function (l) { return /E2E Switcher/.test(l.title); }).length, 0, 'no clients lead was made');
  t.detail = 'clients path to the closing screen, back to "Who is this for", "A client I am introducing", Switch: the Partners path opens with name and email kept and the country and timeline cleared; journey_switched sent; one ' + t.ids.kind + ' ' + t.ids.id + ' in the Introducer Pipeline with Request Type Referral, no clients lead.';
});

test('8.3 the received wording differs by route: "Received by Imperial" after Netlify Forms, "Received, and with" and the reference after the direct endpoint', async function (t, browser) {
  const base = { journey: 'clients', about: 'citizenship', division: 'citizenship', phone: '', country: 'Nigeria', for_whom: 'myself', timeline: '3m', budget: 'over-1m', band: 'hot', points: 9 };
  let page = await open(browser, t, 'desktop', '/contact');
  await journeyFlow(page, Object.assign({}, base, { name: 'E2E Forms Route', email: 'e2e.route.forms@example.com' }));
  await afterSuccess(page, 'none');
  await page.waitForTimeout(200);
  const forms = await received(page);
  assert.equal(forms.title, 'Received by Imperial.');
  assert.ok(/received and is being passed to Imperial Citizenship/.test(forms.text) && /One person will reply personally/.test(forms.text), forms.text);
  assert.ok(!/Reference/.test(forms.text) && !/ with Imperial Citizenship/.test(forms.title), 'no reference and no "with" after a Forms acceptance');
  assert.equal(forms.announce, 'Received.', 'the announcement says Received.');
  await t.close();
  state.primaryFail = true;
  page = await open(browser, t, 'desktop', '/contact');
  await journeyFlow(page, Object.assign({}, base, { name: 'E2E Direct Route', email: 'e2e.route.direct@example.com' }));
  await afterSuccess(page, 'none');
  const direct = await received(page);
  const lead = t.http.find(function (h) { return h.path === '/.netlify/functions/lead'; });
  assert.equal(direct.title, 'Received, and with Imperial Citizenship.');
  assert.ok(direct.text.indexOf('Reference ' + lead.response.ref + '.') > -1 && /One person at Imperial Citizenship will be your point of contact/.test(direct.text), direct.text);
  [forms, direct].forEach(function (r) { assert.ok(!NAMES.test(r.title + ' ' + r.text), 'no person is named: ' + r.text); });
  t.ids = { ref: lead.response.ref };
  t.detail = 'Forms: "' + forms.title + ' ' + forms.text + '"; direct: "' + direct.title + ' ' + direct.text + '"; no person named in either.';
});

test('8.4 the preview build (data-preview): the chip shows, Send posts nothing, the confirmation is labelled', async function (t, browser) {
  const posts = [];
  /* the Render preview serves pages prerendered with data-preview; here the attribute is added to the document as it
     loads and /contact is reached by the footer link, so the journey renders under it */
  const page = await open(browser, t, 'desktop', '/about', async function (p) {
    await p.route('**/*', async function (route) {
      if (route.request().resourceType() !== 'document') return route.continue();
      const res = await route.fetch();
      const body = (await res.text()).replace('<html lang="en-GB"', '<html lang="en-GB" data-preview=""');
      return route.fulfill({ response: res, body: body });
    });
    p.on('request', function (r) { if (r.method() !== 'GET') posts.push(r.method() + ' ' + r.url()); });
  });
  assert.ok(await page.evaluate(function () { return document.documentElement.hasAttribute('data-preview'); }), 'the page runs as a preview build');
  await follow(page, page.locator('a[href*="via=footer"]').first());
  const chip = (await page.locator('#cf [data-preview-chip]').innerText()).trim();
  assert.equal(chip, 'Preview build: nothing is sent from this preview');
  const spec = { journey: 'clients', about: 'citizenship', name: 'E2E Preview', email: 'e2e.preview@example.com', phone: '+971 50 000 0804', country: 'Nigeria', for_whom: 'myself', timeline: '3m' };
  await journeyFlow(page, spec);
  await page.waitForSelector('#cf .success.preview', { timeout: 10000 });
  await page.waitForTimeout(800);
  const rc = await received(page);
  assert.equal(rc.chip, 'Preview of the confirmation. Nothing was sent.', 'the confirmation is labelled');
  assert.equal(rc.title, 'Received by Imperial.', 'the Forms wording, never the direct one');
  assert.notEqual(rc.announce.trim(), 'Received.', 'no "Received" announcement on the preview');
  assert.equal(await page.locator('#cf [data-verify]').count(), 0, 'no verification step on the preview');
  assert.equal(await page.locator('#cf .book').count(), 1, 'the next steps show, with their To confirm chips');
  assert.equal(posts.length, 0, 'no request left the page: ' + posts.join(', '));
  assert.equal(t.http.length, 0, 'nothing reached the server');
  assert.equal(t.calls.length, 0, 'nothing reached any API');
  t.ids = {};
  t.detail = 'chip "' + chip + '"; on Send the received state under "' + rc.chip + '", title "' + rc.title + '", no announcement, no verification, no request of any kind.';
});

test('8.5 the entry point: a journey opened from the division hero carries via=division-hero into the note', async function (t, browser) {
  const page = await open(browser, t, 'desktop', '/divisions/citizenship');
  await captureEvents(page);
  await follow(page, page.locator('a[href*="via=division-hero"]').first());
  assert.ok(/via=division-hero/.test(page.url()), page.url());
  const spec = { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Entry', email: 'e2e.entry@example.com', phone: '', country: 'Nigeria', for_whom: 'family', timeline: '3m', budget: 'over-1m', band: 'hot', points: 9 };
  await journeyFlow(page, spec);
  await afterSuccess(page, 'none');
  t.ids = checkStored(t, spec, { noteHas: [journeyLine(spec, 'division-hero')] });
  const note = m.notes.find(function (n) { return n.id === t.ids.note; });
  const pageLine = noteLines(note.content).find(function (l) { return l.indexOf('page: ') === 0; });
  assert.ok(pageLine && /via=division-hero/.test(pageLine) && /about=citizenship/.test(pageLine), 'the tracking page line carries the entry: ' + pageLine);
  const ev = await events(page);
  const started = ev.find(function (e) { return e.name === 'journey_started'; }), sent = ev.find(function (e) { return e.name === 'enquiry_submitted'; });
  assert.ok(started && started.params.journey === 'clients' && started.params.via === 'division-hero', 'journey_started: ' + JSON.stringify(started));
  assert.ok(sent && sent.params.journey === 'clients' && sent.params.via === 'division-hero', 'enquiry_submitted carries journey and via: ' + JSON.stringify(sent));
  assert.ok(ev.some(function (e) { return e.name === 'journey_step'; }), 'journey_step events');
  t.detail = 'division hero link to ' + pageLine.replace('page: ', '') + '; note line "' + journeyLine(spec, 'division-hero') + '"; journey_started, journey_step and enquiry_submitted carry the journey and the entry.';
});

test('8.6 prefill from each division page: four skip the first screen, Partners Club lands on it', async function (t, browser) {
  const want = { citizenship: 'who', 'private-office': 'who', 'real-estate': 'who', academy: 'practice', 'partners-club': 'how' };
  const out = [];
  for (const key of Object.keys(want)) {
    const page = await open(browser, t, 'desktop', '/divisions/' + key);
    await follow(page, divisionLink(page, key));
    const st = await page.evaluate(function () {
      const f = document.querySelector('#cf form'), ab = f.querySelector('input[name="about"]:checked');
      return { screen: f.querySelector('.cf-step.on').getAttribute('data-screen'), about: ab ? ab.value : '', path: f.elements.namedItem('audience').value, chooser: f.querySelector('.jp-chooser').classList.contains('on') };
    });
    assert.equal(st.screen, want[key], key + ' opens on ' + want[key] + ': ' + JSON.stringify(st));
    assert.equal(st.path, JOURNEY_OF[key], key + ' opens the ' + JOURNEY_OF[key] + ' path');
    assert.ok(!st.chooser, 'the chooser is not shown');
    if (key === 'partners-club') assert.equal(st.about, '', 'two options route to Partners Club, so the person chooses');
    else assert.equal(st.about, key, 'the division is chosen');
    out.push(key + ' -> ' + st.screen);
    await t.close();
  }
  t.ids = {};
  t.detail = out.join('; ');
});

test('8.7 optional fields: a clients journey without nationality, budget or message arrives with "not given" and the right score', async function (t, browser) {
  const spec = { journey: 'clients', about: 'citizenship', division: 'citizenship', name: 'E2E Optional', email: 'e2e.optional@example.com', phone: '', country: 'Nigeria', for_whom: 'myself', timeline: '3m', band: 'hot', points: 6 };
  const page = await open(browser, t, 'desktop', '/contact');
  await journeyFlow(page, spec);
  await afterSuccess(page, 'none');
  t.ids = checkStored(t, spec, { noteHas: ['Timeline: Within 3 months · Budget: not given'] });
  const note = noteLines(m.notes.find(function (n) { return n.id === t.ids.note; }).content);
  assert.ok(!note.some(function (l) { return l.indexOf('Nationality:') === 0; }), 'no nationality line');
  /* checkStored has read "Score: HOT (6 points)": timeline 3m 4, a single division 1, the direct visit 1 */
  t.detail = 'nationality, budget and message left empty: ' + t.ids.kind + ' ' + t.ids.id + ', score hot (6 points), note "Timeline: Within 3 months · Budget: not given", no nationality line.';
});

/* ---------- run ---------- */
async function main() {
  if (!NO_BUILD) {
    say('build: npm run build');
    const b = cp.spawnSync(process.execPath, [path.join(ROOT, 'build/build.js')], { stdio: 'inherit', cwd: ROOT });
    if (b.status !== 0) { say('build failed'); process.exit(b.status || 1); }
  }
  if (!fs.existsSync(path.join(DIST, 'index.html'))) { say('dist/index.html missing: run npm run build'); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  const server = await listen();
  say('serving ' + DIST + ' on ' + BASE + ' (Netlify Forms and functions answered by the real handlers, services mocked)');
  const browser = await chromium.launch({ headless: !HEADED });
  const results = [];
  const started = Date.now();
  const list = tests.filter(function (x) { return !ONLY || x.name.indexOf(ONLY) > -1; });
  for (let i = 0; i < list.length; i++) {
    const x = list[i];
    const t = { name: x.name, status: 'pass', detail: '', ids: {}, calls: [], http: [], fnlog: [], errors: [], console: [], ms: 0 };
    state.test = t; state.primaryFail = false; state.fallbackFail = false; state.primaryDelayMs = 0; state.primaryHangMs = 0;
    ratelimit.reset();
    const t0 = Date.now();
    say('\n' + x.name);
    try { await x.fn(t, browser); }
    catch (err) { t.status = 'fail'; t.detail = (err && err.message) || String(err); if (err && err.stack) t.stack = err.stack.split('\n').slice(0, 6).join('\n'); }
    if (t.errors.length) { t.status = 'fail'; t.detail += (t.detail ? ' | ' : '') + 'page errors: ' + t.errors.join('; '); }
    if (t.close) { try { await t.close(); } catch (e) { /* closed */ } }
    delete t.close;
    t.ms = Date.now() - t0;
    say('  ' + (t.status === 'pass' ? 'ok   ' : 'FAIL ') + t.detail);
    if (t.console.length) say('  console errors: ' + t.console.join(' | '));
    results.push(t);
  }
  state.test = null;
  await browser.close();
  server.close();

  const failed = results.filter(function (r) { return r.status !== 'pass'; }).length;
  fs.writeFileSync(path.join(OUT, 'mock-log.json'), JSON.stringify({ ran: new Date(started).toISOString(), base: BASE, note: 'Offline simulation: every call below went to the in-memory mock from tests/functions/_mock.js, never to a live service. Ids are mock ids.', env: { PIPEDRIVE_API_TOKEN: 'dummy', TWILIO: 'dummy (verification enabled)', EMAIL: 'dummy (Resend mock)', TURNSTILE_SECRET_KEY: 'unset' }, calls: log }, null, 2));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ ran: new Date(started).toISOString(), base: BASE, passed: results.length - failed, failed: failed, results: results }, null, 2));
  const rows = results.map(function (r) {
    const ids = Object.keys(r.ids).map(function (k) { return k + ' ' + r.ids[k]; }).join(', ');
    return '| ' + r.name + ' | ' + (r.status === 'pass' ? 'pass' : 'FAIL') + ' | ' + (ids || 'none') + ' | ' + r.detail.replace(/\|/g, '/').replace(/\n/g, ' ') + ' |';
  });
  fs.writeFileSync(path.join(OUT, 'summary.md'), ['| Test | Result | Mock ids | Detail |', '|---|---|---|---|'].concat(rows).join('\n') + '\n');
  say('\n' + (failed ? 'E2E FAILED: ' + failed + ' of ' + results.length : 'E2E OK: ' + results.length + ' cases') + ' in ' + Math.round((Date.now() - started) / 1000) + ' s; ' + log.length + ' mocked API calls logged to ' + path.relative(ROOT, path.join(OUT, 'mock-log.json')));
  process.exit(failed ? 1 : 0);
}

main().catch(function (err) { say('harness error: ' + (err && err.stack || err)); process.exit(1); });

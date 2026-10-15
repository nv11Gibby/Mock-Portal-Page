#!/usr/bin/env node
/* Acceptance harness for the lead flow (docs/REFINEMENT-BRIEF.md section 9, items 1 to 4), run offline.

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
const state = { primaryFail: false, fallbackFail: false, primaryDelayMs: 0, test: null, inHandler: false };
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
function expectFor(division) {
  const cfg = routing.divisions[division];
  return {
    name: cfg.name, kind: cfg.kind, owner: Number(cfg.owner) || 0, pipeline: cfg.pipeline, stage: cfg.stage,
    division: cfg.divisionOption ? O.division[cfg.divisionOption] : undefined,
    contact: cfg.audience === 'clients' ? O.contactType.client : cfg.audience === 'partners' ? O.contactType.partner : undefined
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
  const exp = expectFor(spec.division);
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
    assert.deepEqual(first.body.label_ids, [O.label[spec.band]], 'the first lead POST carries the ' + spec.band + ' label');
    if (posts.length >= 2) { assert.equal(first.status, 400, 'the Leads API rejected the deal label id'); assert.equal(last.body.label_ids, undefined, 'the retry has no label'); ids.label = O.label[spec.band] + ' (rejected by the Leads API, retried without; score kept in the title and the note)'; }
    else ids.label = O.label[spec.band];
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
async function open(browser, t, vp, url) {
  const ctx = await browser.newContext(Object.assign({ reducedMotion: 'reduce', locale: 'en-GB' }, VIEWPORTS[vp || 'desktop']));
  const page = await ctx.newPage();
  page.on('pageerror', function (e) { t.errors.push('pageerror: ' + e.message); });
  page.on('console', function (msg) { if (msg.type() === 'error') t.console.push(msg.text()); });
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  t.close = function () { return ctx.close(); };
  return page;
}
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

/* The three step contact form. spec: about, name, email, phone, country, nationality, for_whom, pref, timeline, budget, firm,
   profession, re_intent, re_area, msg, before (async hook before Send). */
async function contactFlow(page, spec) {
  const f = page.locator('#cf form');
  await click(page.locator('label:has(input[name="about"][value="' + spec.about + '"])'));
  await page.waitForSelector('#routing.show', { timeout: 5000 });
  await click(page.locator('.cf-step[data-step="1"] [data-next]'));
  await page.waitForSelector('.cf-step[data-step="2"].on', { timeout: 5000 });
  await f.locator('input[name="name"]').fill(spec.name);
  await f.locator('input[name="email"]').fill(spec.email);
  if (spec.phone) await f.locator('input[name="phone"]').fill(spec.phone);
  await f.locator('input[name="country"]').fill(spec.country);
  await f.locator('input[name="nationality"]').fill(spec.nationality);
  await f.locator('select[name="for_whom"]').selectOption(spec.for_whom);
  if (spec.pref) await f.locator('select[name="pref"]').selectOption(spec.pref);
  await click(page.locator('.cf-step[data-step="2"] [data-next]'));
  await page.waitForSelector('.cf-step[data-step="3"].on', { timeout: 5000 });
  await f.locator('select[name="timeline"]').selectOption(spec.timeline);
  if (spec.budget) await f.locator('select[name="budget"]').selectOption(spec.budget);
  if (spec.firm !== undefined) { await f.locator('input[name="firm"]').fill(spec.firm); await f.locator('input[name="profession"]').fill(spec.profession || ''); }
  if (spec.re_intent) { await f.locator('select[name="re_intent"]').selectOption(spec.re_intent); await f.locator('input[name="re_area"]').fill(spec.re_area || ''); }
  await f.locator('textarea[name="msg"]').fill(spec.msg);
  await f.locator('input[name="consent"]').check();
  if (spec.before) await spec.before(page);
  await click(page.locator('#cf form [data-send]'));
}

/* The enquiry card (home and division pages). */
async function enquiryFlow(page, spec) {
  const f = page.locator('[data-form="enquiry"] form');
  if (spec.audience) await f.locator('select[name="audience"]').selectOption(spec.audience);
  if (spec.division) await f.locator('select[name="division"]').selectOption(spec.division);
  await f.locator('input[name="name"]').fill(spec.name);
  await f.locator('input[name="email"]').fill(spec.email);
  if (spec.phone) await f.locator('input[name="phone"]').fill(spec.phone);
  if (spec.country) await f.locator('input[name="country"]').fill(spec.country);
  await f.locator('input[name="nationality"]').fill(spec.nationality);
  if (spec.for_whom) await f.locator('select[name="for_whom"]').selectOption(spec.for_whom);
  if (spec.timeline) await f.locator('select[name="timeline"]').selectOption(spec.timeline);
  if (spec.budget) await f.locator('select[name="budget"]').selectOption(spec.budget);
  await f.locator('textarea[name="msg"]').fill(spec.msg);
  await f.locator('input[name="consent"]').check();
  if (spec.before) await spec.before(page);
  await click(f.locator('button[type="submit"]'));
}

/* After Send: the success state, then the verification step (skip, or a wrong code then the right one), then booking. */
async function afterSuccess(page, mode, scope) {
  const s = scope || '';
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
  const s = scope || '';
  return page.evaluate(function (sel) {
    const box = document.querySelector(sel + '.book');
    return {
      links: Array.prototype.map.call(box.querySelectorAll('a[data-book]'), function (a) { return { office: a.getAttribute('data-book'), href: a.getAttribute('href'), division: a.getAttribute('data-division') }; }),
      tbc: Array.prototype.map.call(box.querySelectorAll('.book-tbc'), function (el) { return Array.prototype.map.call(el.childNodes, function (n) { return n.textContent.trim(); }).filter(Boolean).join(': '); })
    };
  }, s);
}

/* ---------- the cases ---------- */
/* Six choices with full qualification. Expected band and points from shared/lead-schema.json "score" with the organic
   source (+1): timeline 3m 4, 3-12m 2, exploring 0; budget over-1m 3, 500k-1m 2, 250k-500k 1; a single division +1,
   group +0; a partner introducing a client counts as referral (+2) in place of organic. Hot from 6, warm from 3;
   "exploring" is capped at warm and needs 5 for warm. */
const CHOICES = [
  { about: 'citizenship', timeline: '3m', budget: 'over-1m', for_whom: 'family', band: 'hot', points: 9, nationality: 'Nigeria', country: 'Nigeria', phone: '+234 802 000 0101' },
  { about: 'private-office', timeline: '3-12m', budget: '250k-500k', for_whom: 'myself', band: 'warm', points: 5, nationality: 'United Kingdom', country: 'United Arab Emirates', phone: '+971 50 000 0102' },
  { about: 'partners-club', timeline: '3m', budget: 'undisclosed', for_whom: 'client', firm: 'E2E Advisory LLP', profession: 'Lawyer', band: 'hot', points: 7, nationality: 'Ghana', country: 'Ghana', phone: '+233 24 000 0103' },
  { about: 'academy', timeline: 'exploring', budget: 'undisclosed', for_whom: 'myself', band: 'exploring', points: 2, nationality: 'Kenya', country: 'Kenya', phone: '+254 700 000 104' },
  { about: 'real-estate', timeline: '3-12m', budget: '500k-1m', for_whom: 'family', re_intent: 'buy', re_area: 'Dubai Marina', band: 'hot', points: 6, nationality: 'India', country: 'United Arab Emirates', phone: '+971 50 000 0105' },
  { about: 'group', timeline: 'exploring', budget: 'over-1m', for_whom: 'myself', band: 'exploring', points: 4, nationality: 'South Africa', country: 'South Africa', phone: '+27 82 000 0106' }
];
const tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }

['desktop', 'mobile'].forEach(function (vp, vi) {
  CHOICES.forEach(function (c, i) {
    test('1.' + (vi * 6 + i + 1) + ' contact ' + c.about + ' (' + vp + ')', async function (t, browser) {
      /* a distinct phone per viewport (one digit appended): the same number would be found by the phone dedupe and reuse the open record (see 1.13) */
      const spec = Object.assign({}, c, { division: c.about, name: 'E2E ' + c.about + ' ' + vp, email: 'e2e.' + c.about + '.' + vp + '@example.com', phone: c.phone + String(vi + 1), pref: 'Either', msg: 'TEST ' + c.about + ' on ' + vp + ' from the acceptance harness.' });
      const page = await open(browser, t, vp, trackingUrl('/contact', c.about + '-' + vp));
      let tracking;
      spec.before = async function (p) { tracking = await trackingSeen(p); };
      await contactFlow(page, spec);
      await afterSuccess(page, 'skip');
      assert.equal(tracking.utm_source, 'google', 'utm_source captured from the landing URL');
      assert.equal(tracking.utm_campaign, 'e2e-' + c.about + '-' + vp, 'utm_campaign captured');
      t.ids = checkStored(t, spec, { tracking: tracking, noteHas: ['Enquiry for:', 'Timeline: ', 'Nationality: ' + c.nationality, 'Country of residence: ' + c.country] });
      const sub = lastSubmission(t);
      assert.equal(sub.form, 'contact');
      t.detail = 'form contact, ' + t.ids.kind + ' ' + t.ids.id + ' in ' + t.ids.pipeline + ', score ' + spec.band + ' (' + spec.points + ' points), note ' + t.ids.note + ' with all ' + schema.tracking.length + ' tracking fields, person ' + t.ids.person + ' Not Verified, verification skipped, email ' + t.ids.email;
    });
  });
});

test('1.13 returning person: same email, then same phone (dedupe, note and activity on the open lead)', async function (t, browser) {
  const base = { about: 'citizenship', division: 'citizenship', name: 'E2E Returning', email: 'e2e.returning@example.com', phone: '+234 802 000 0901', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'family', timeline: '3m', budget: 'over-1m', band: 'hot', points: 9, msg: 'TEST first enquiry.' };
  let page = await open(browser, t, 'desktop', '/contact');
  await contactFlow(page, base);
  await afterSuccess(page, 'skip');
  const first = checkStored(t, base, {});
  await t.close();
  /* same email again */
  page = await open(browser, t, 'desktop', '/contact');
  await contactFlow(page, Object.assign({}, base, { msg: 'TEST second enquiry, same email.' }));
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
  await contactFlow(page, Object.assign({}, base, { email: 'e2e.returning.other@example.com', msg: 'TEST third enquiry, new email, same phone.' }));
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
  t.detail = 'three enquiries, one person ' + first.person + ' and one ' + first.kind + ' ' + first.id + ': the second (same email) and third (new email, same phone) each added a note and a "' + routing.pipedrive.activity.subject + '" activity due today; the person now holds both emails.';
});

test('2.1 disposable email through Netlify Forms: rejected by the function', async function (t, browser) {
  const spec = { about: 'citizenship', division: 'citizenship', name: 'E2E Disposable', email: 'e2e.disposable@mailinator.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'myself', timeline: '3m', budget: 'over-1m', msg: 'TEST disposable address.' };
  const page = await open(browser, t, 'desktop', '/contact');
  await contactFlow(page, spec);
  await page.waitForSelector('.success', { timeout: 20000 });
  const sub = lastSubmission(t);
  assert.ok(sub, 'the Netlify Forms post reached the function');
  assert.equal(sub.result.ok, false); assert.equal(sub.result.reason, 'disposable');
  assert.equal(t.calls.filter(function (c) { return c.host === 'api.pipedrive.com'; }).length, 0, 'nothing reached Pipedrive');
  assert.equal(t.calls.filter(function (c) { return c.host === 'api.resend.com'; }).length, 0, 'no email was sent');
  const seen = await page.locator('.success h3').innerText() + ' / ' + await page.locator('.success > p').first().innerText();
  t.ids = { ref: sub.result.ref, submission: sub.id };
  t.detail = 'function: rejected reason=disposable, no Pipedrive call, no email. The person sees the success state ("' + seen.replace(/\s+/g, ' ').trim() + '") because Netlify Forms accepts the post before the function runs; the submission stays in the Netlify Forms inbox only.';
});

test('2.2 disposable email through the fallback endpoint: rejected, fallback message shown', async function (t, browser) {
  state.primaryFail = true;
  const spec = { about: 'citizenship', division: 'citizenship', name: 'E2E Disposable Two', email: 'e2e.disposable2@mailinator.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'myself', timeline: '3m', budget: 'over-1m', msg: 'TEST disposable address via the direct endpoint.' };
  const page = await open(browser, t, 'desktop', '/contact');
  await contactFlow(page, spec);
  await page.waitForSelector('#cf form .form-err:not([hidden])', { timeout: 20000 });
  const lead = t.http.find(function (h) { return h.path === '/.netlify/functions/lead'; });
  assert.ok(lead, 'the fallback endpoint was called');
  assert.equal(lead.response.ok, false); assert.equal(lead.response.reason, 'disposable');
  assert.equal(t.calls.filter(function (c) { return c.host === 'api.pipedrive.com'; }).length, 0, 'nothing reached Pipedrive');
  const seen = (await page.locator('#cf form .form-err').innerText()).replace(/\s+/g, ' ').trim();
  assert.ok(/could not send/i.test(seen), 'fallback message: ' + seen);
  t.ids = { ref: lead.response.ref };
  t.detail = 'lead.js: {ok:false, reason:disposable}, nothing in Pipedrive. The person sees the generic fallback message ("' + seen.slice(0, 90) + '...") rather than a note about the address.';
});

test('2.3 honeypot filled in the page: nothing is sent', async function (t, browser) {
  const spec = { about: 'citizenship', division: 'citizenship', name: 'E2E Honeypot', email: 'e2e.honeypot@example.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'myself', timeline: '3m', budget: 'over-1m', msg: 'TEST honeypot.' };
  spec.before = async function (p) { await p.evaluate(function () { document.querySelector('#cf form input[name="company_url"]').value = 'http://spam.example'; }); };
  const page = await open(browser, t, 'desktop', '/contact');
  await contactFlow(page, spec);
  await page.waitForTimeout(1500);
  assert.equal(t.http.length, 0, 'no request left the page');
  assert.equal(await page.locator('.success').count(), 0, 'no success state');
  const btn = await page.evaluate(function () {
    const f = document.querySelector('#cf form'), pick = function (el) { return el.classList.contains('loading') + '/' + el.disabled; };
    return { send: pick(f.querySelector('[data-send]')), step1: pick(f.querySelector('.cf-step[data-step="1"] [data-next]')), err: !f.querySelector('.form-err').hidden };
  });
  t.ids = {};
  t.detail = 'no POST at all (the page stops before sending). The person sees no message and no change on Send (loading/disabled: Send ' + btn.send + ', hidden step 1 Continue ' + btn.step1 + ', error shown ' + btn.err + '); see 7.1.';
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
  const spec = { division: 'private-office', audience: 'clients', name: 'E2E Verified', email: 'e2e.verified@example.com', phone: '+971 50 000 0301', country: 'United Arab Emirates', nationality: 'United Kingdom', for_whom: 'myself', timeline: '3m', budget: 'undisclosed', band: 'hot', points: 6, msg: 'TEST verification completed.' };
  const page = await open(browser, t, 'desktop', '/divisions/private-office');
  assert.equal(await page.locator('[data-form="enquiry"] select[name="division"]').inputValue(), 'private-office', 'division preselected on its page');
  await enquiryFlow(page, spec);
  await afterSuccess(page, 'code', '[data-form="enquiry"] ');
  t.ids = checkStored(t, spec, { verification: O.verificationStatus.verified });
  const person = m.persons.find(function (p) { return p.id === t.ids.person; });
  assert.equal(person[F.person.verificationStatus], O.verificationStatus.verified, 'person marked Verified (982)');
  const put = pdCalls(t, 'PUT', /^\/v1\/persons\/\d+$/).find(function (c) { return c.body[F.person.verificationStatus] === O.verificationStatus.verified; });
  assert.ok(put, 'PUT person with Verification Status 982');
  const starts = t.calls.filter(function (c) { return c.host === 'verify.twilio.com' && /Verifications$/.test(c.path); });
  const checks = t.calls.filter(function (c) { return c.host === 'verify.twilio.com' && /VerificationCheck$/.test(c.path); });
  assert.equal(starts.length, 1, 'one code sent'); assert.equal(starts[0].body.Channel, 'whatsapp'); assert.equal(starts[0].body.To, e164(spec.phone));
  assert.equal(checks.length, 2, 'two checks: a wrong code, then the right one');
  assert.equal(checks[0].response.status, 'pending'); assert.equal(checks[1].body.Code, '123456'); assert.equal(checks[1].response.status, 'approved');
  const vnote = m.notes.find(function (n) { return n.lead_id === t.ids.id && /Phone verified/.test(n.content); });
  assert.ok(vnote, 'a "Phone verified" note on the lead');
  const verifyHttp = t.http.filter(function (h) { return h.path === '/.netlify/functions/verify'; });
  assert.equal(verifyHttp[verifyHttp.length - 1].response.verified, true);
  assert.equal(verifyHttp[verifyHttp.length - 1].response.recorded, true);
  t.ids.verification = starts[0].response.sid; t.ids.verifyNote = vnote.id;
  t.detail = 'wrong code refused, 123456 approved; person ' + t.ids.person + ' Verification Status 982 (Verified); note ' + vnote.id + ' "Phone verified" on ' + t.ids.kind + ' ' + t.ids.id + '.';
});

test('3.2 phone verification skipped: lead arrives Not Verified', async function (t, browser) {
  const spec = { division: 'academy', audience: 'partners', name: 'E2E Skipped', email: 'e2e.skipped@example.com', phone: '+234 802 000 0302', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'myself', timeline: '3-12m', budget: 'undisclosed', band: 'warm', points: 4, msg: 'TEST verification skipped.' };
  const page = await open(browser, t, 'mobile', '/divisions/academy');
  await enquiryFlow(page, spec);
  await afterSuccess(page, 'skip', '[data-form="enquiry"] ');
  t.ids = checkStored(t, spec, {});
  const person = m.persons.find(function (p) { return p.id === t.ids.person; });
  assert.equal(person[F.person.verificationStatus], O.verificationStatus.notVerified, 'person stays Not Verified (983)');
  assert.equal(t.calls.filter(function (c) { return c.host === 'verify.twilio.com' && /VerificationCheck$/.test(c.path); }).length, 0, 'no code check');
  assert.equal(m.notes.filter(function (n) { return n.deal_id === t.ids.id; }).length, 1, 'only the enquiry note on the deal');
  const b = await bookingState(page, '[data-form="enquiry"] ');
  assert.equal(b.links.length, 0, 'no booking links while config.booking urls are empty');
  assert.equal(b.tbc.length, 2, 'both offices show the tbc text');
  t.detail = 'code sent then skipped; person ' + t.ids.person + ' Verification Status 983 (Not Verified); ' + t.ids.kind + ' ' + t.ids.id + ' arrived with one note; booking shows the tbc text for both offices (mobile).';
});

test('4.1 booking buttons carry name, email and division (config override)', async function (t, browser) {
  const spec = { about: 'citizenship', division: 'citizenship', name: 'E2E Booker', email: 'e2e.booker@example.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'family', timeline: '3m', budget: 'over-1m', band: 'hot', points: 9, msg: 'TEST booking links.' };
  spec.before = async function (p) { await p.evaluate(function () { window.IHG.config.booking.dubai.url = 'https://booking.example.test/dubai'; window.IHG.config.booking.lagos.url = 'https://booking.example.test/lagos?office=lagos'; }); };
  const page = await open(browser, t, 'desktop', '/contact');
  await contactFlow(page, spec);
  await afterSuccess(page, 'none');
  const b = await bookingState(page);
  assert.equal(b.links.length, 2, 'one button per office');
  const q = 'name=' + encodeURIComponent(spec.name) + '&email=' + encodeURIComponent(spec.email) + '&a1=citizenship';
  assert.equal(b.links[0].href, 'https://booking.example.test/dubai?' + q, 'Dubai link');
  assert.equal(b.links[1].href, 'https://booking.example.test/lagos?office=lagos&' + q, 'Lagos link keeps its own query');
  assert.deepEqual(b.links.map(function (l) { return l.office; }), ['Dubai', 'Lagos']);
  assert.ok(b.links.every(function (l) { return l.division === 'citizenship'; }));
  assert.equal(b.tbc.length, 0);
  const sub = lastSubmission(t);
  t.ids = checkStored(t, spec, {});
  t.detail = 'Dubai: ' + b.links[0].href + ' ; Lagos: ' + b.links[1].href + ' (no phone given, so no verification step; ' + t.ids.kind + ' ' + t.ids.id + ', ref ' + sub.result.ref + ').';
});

test('4.2 booking shows the tbc text while config.booking is empty', async function (t, browser) {
  const spec = { about: 'group', division: 'group', name: 'E2E Tbc', email: 'e2e.tbc@example.com', phone: '', country: 'South Africa', nationality: 'South Africa', for_whom: 'myself', timeline: '3-12m', budget: 'undisclosed', band: 'warm', points: 3, msg: 'TEST booking placeholder.' };
  const page = await open(browser, t, 'desktop', '/contact');
  const side = await page.evaluate(function () { return Array.prototype.map.call(document.querySelectorAll('.tbc'), function (el) { return el.textContent.trim(); }); });
  await contactFlow(page, spec);
  await afterSuccess(page, 'none');
  const b = await bookingState(page);
  assert.equal(b.links.length, 0);
  assert.equal(b.tbc.length, 2);
  assert.ok(/Dubai/.test(b.tbc[0]) && /booking page/.test(b.tbc[0]), 'Dubai tbc: ' + b.tbc[0]);
  assert.ok(/Lagos/.test(b.tbc[1]) && /booking page/.test(b.tbc[1]), 'Lagos tbc: ' + b.tbc[1]);
  t.ids = checkStored(t, spec, {});
  t.detail = 'success screen: "' + b.tbc.join('" and "') + '"; the Contact page side column also carries ' + side.filter(function (s) { return /booking/.test(s); }).length + ' booking placeholders.';
});

test('5.1 primary POST fails: the fallback endpoint receives the lead, success shown', async function (t, browser) {
  state.primaryFail = true;
  const spec = { about: 'citizenship', division: 'citizenship', name: 'E2E Fallback', email: 'e2e.fallback@example.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'family', timeline: '3m', budget: '500k-1m', band: 'hot', points: 8, msg: 'TEST primary failure.' };
  const page = await open(browser, t, 'mobile', trackingUrl('/contact', 'fallback'));
  let tracking;
  spec.before = async function (p) { tracking = await trackingSeen(p); };
  await contactFlow(page, spec);
  await afterSuccess(page, 'none');
  const primary = t.http.find(function (h) { return h.path === '/'; }), lead = t.http.find(function (h) { return h.path === '/.netlify/functions/lead'; });
  assert.ok(primary && primary.status === 500, 'the primary POST / answered 500');
  assert.ok(lead && lead.status === 200 && lead.response.ok === true, 'lead.js answered ok');
  assert.ok(/^W[0-9A-Z]+$/.test(lead.response.ref), 'direct reference W...: ' + lead.response.ref);
  t.ids = checkStored(t, spec, { result: lead.response, tracking: tracking, noteHas: ['Direct submission (fallback endpoint)', 'Ref ' + lead.response.ref] });
  t.detail = 'POST / 500, then POST /.netlify/functions/lead {ok:true, ref:' + lead.response.ref + '}; ' + t.ids.kind + ' ' + t.ids.id + ' created with the note marked "Direct submission (fallback endpoint)"; the page shows the success state (mobile).';
});

test('5.2 both fail: fallback message with both telephones and the email, draft survives a reload', async function (t, browser) {
  state.primaryFail = true; state.fallbackFail = true;
  const spec = { about: 'partners-club', division: 'partners-club', name: 'E2E Draft', email: 'e2e.draft@example.com', phone: '+234 802 000 0502', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'client', timeline: '3m', budget: 'undisclosed', firm: 'Draft Partners', profession: 'Banker', msg: 'TEST both endpoints down.' };
  const page = await open(browser, t, 'desktop', '/contact');
  await contactFlow(page, spec);
  await page.waitForSelector('#cf form .form-err:not([hidden])', { timeout: 20000 });
  const seen = (await page.locator('#cf form .form-err').innerText()).replace(/\s+/g, ' ').trim();
  ['+971 4 546 1110', '+234 902 222 2024', 'info@imperialholdingsgroup.com'].forEach(function (s) { assert.ok(seen.indexOf(s) > -1, 'fallback message carries ' + s + ': ' + seen); });
  assert.ok(/could not send/i.test(seen) && /kept on this device/i.test(seen), 'fallback wording: ' + seen);
  assert.equal(t.http.filter(function (h) { return h.status === 500; }).length, 2, 'both endpoints answered 500');
  assert.equal(t.calls.length, 0, 'nothing reached any API');
  const focused = await page.evaluate(function () { return document.activeElement && document.activeElement.className; });
  const draftKey = await page.evaluate(function () { return localStorage.getItem('ihg-draft-contact'); });
  assert.ok(draftKey, 'draft stored under ihg-draft-contact');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#draft:not([hidden])', { timeout: 10000 });
  const restored = await page.evaluate(function () {
    const f = document.querySelector('#cf form'), ab = f.querySelector('input[name="about"]:checked');
    return { note: document.getElementById('draft').textContent.trim(), about: ab ? ab.value : '', name: f.name.value, email: f.email.value, phone: f.phone.value, firm: f.firm.value, msg: f.msg.value, timeline: f.timeline.value, consent: f.consent.checked };
  });
  assert.equal(restored.about, 'partners-club'); assert.equal(restored.name, spec.name); assert.equal(restored.email, spec.email); assert.equal(restored.phone, spec.phone);
  assert.equal(restored.firm, spec.firm); assert.equal(restored.msg, spec.msg); assert.equal(restored.timeline, '3m');
  assert.ok(/kept what you started/i.test(restored.note), 'draft note: ' + restored.note);
  assert.equal(restored.consent, false, 'consent is not restored (the person ticks it again)');
  t.ids = {};
  t.detail = 'message: "' + seen.slice(0, 140) + '..."; focus moved to the ' + (focused || 'page') + '; after reload the draft note shows and about, name, email, phone, firm, timeline and message are back; consent is asked again.';
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

test('6.2 programme fit check: lead_source programme-fit and quiz_answers reach the backend', async function (t, browser) {
  const page = await open(browser, t, 'mobile', '/divisions/citizenship');
  const answers = [['who', 'family'], ['where', 'nigeria'], ['matters', 'live'], ['timeline', '3m'], ['budget', '500k-1m']];
  for (let i = 0; i < answers.length; i++) {
    await page.waitForSelector('.fit-q[data-k="' + answers[i][0] + '"].on', { timeout: 5000 });
    await click(page.locator('.fit-q[data-k="' + answers[i][0] + '"] [data-opt="' + answers[i][1] + '"]'));
  }
  await page.waitForSelector('.fit-done.on', { timeout: 5000 });
  const pre = await page.evaluate(function () {
    const f = document.querySelector('[data-form="enquiry"] form');
    return { division: f.division.value, audience: f.audience.value, lead_source: f.lead_source.value, quiz_answers: f.quiz_answers.value, for_whom: f.for_whom.value, country: f.country.value, timeline: f.timeline.value, budget: f.budget.value };
  });
  assert.equal(pre.division, 'citizenship'); assert.equal(pre.audience, 'clients'); assert.equal(pre.lead_source, 'programme-fit');
  assert.deepEqual(JSON.parse(pre.quiz_answers), { who: 'family', where: 'nigeria', matters: 'live', timeline: '3m', budget: '500k-1m' });
  assert.equal(pre.for_whom, 'family'); assert.equal(pre.country, 'Nigeria'); assert.equal(pre.timeline, '3m'); assert.equal(pre.budget, '500k-1m');
  const spec = { division: 'citizenship', name: 'E2E Fit', email: 'e2e.fit@example.com', nationality: 'Nigerian', band: 'hot', points: 8, leadSource: 'programme-fit', timeline: '3m', msg: 'TEST programme fit check.' };
  await enquiryFlow(page, spec);
  await afterSuccess(page, 'none', '[data-form="enquiry"] ');
  const sub = lastSubmission(t);
  assert.equal(sub.form, 'enquiry');
  t.ids = checkStored(t, spec, { titleSuffix: '(programme fit)', noteHas: ['Lead source: programme-fit', 'Programme fit answers: ' + pre.quiz_answers, 'Nationality: Nigerian (no matching Pipedrive option, kept as text)', 'Country of residence: Nigeria (set on the person)'] });
  const rec = m.leads.find(function (l) { return l.id === t.ids.id; });
  assert.ok(/Programme fit check/.test(rec[F.deal.serviceRequested]), 'Service Requested mentions the fit check');
  t.detail = 'five answers prefilled the enquiry card (division, audience, for_whom, country, timeline, budget, quiz_answers); ' + t.ids.kind + ' ' + t.ids.id + ' "(programme fit)", score hot (8 points), note carries "Programme fit answers: ' + pre.quiz_answers + '" (mobile).';
});

test('7.1 contact form: the Send button shows the loading state while the enquiry is sent', async function (t, browser) {
  state.primaryDelayMs = 1500;
  const spec = { about: 'citizenship', division: 'citizenship', name: 'E2E Loading', email: 'e2e.loading@example.com', phone: '', country: 'Nigeria', nationality: 'Nigeria', for_whom: 'family', timeline: '3m', budget: 'over-1m', band: 'hot', points: 9, msg: 'TEST loading state.' };
  const page = await open(browser, t, 'desktop', '/contact');
  await contactFlow(page, spec);
  await page.waitForTimeout(400);
  const st = await page.evaluate(function () {
    const f = document.querySelector('#cf form'), pick = function (el) { return { loading: el.classList.contains('loading'), disabled: el.disabled, busy: el.getAttribute('aria-busy') }; };
    return { send: pick(f.querySelector('[data-send]')), step1Continue: pick(f.querySelector('.cf-step[data-step="1"] [data-next]')) };
  });
  await afterSuccess(page, 'none');
  t.ids = checkStored(t, spec, {});
  t.detail = 'while the POST was in flight: Send ' + JSON.stringify(st.send) + ', hidden step 1 Continue ' + JSON.stringify(st.step1Continue) + '; the enquiry itself arrived (' + t.ids.kind + ' ' + t.ids.id + ').';
  assert.ok(st.send.loading && st.send.disabled, 'Send is marked loading and disabled while the request is in flight; got Send ' + JSON.stringify(st.send) + ' and hidden step 1 Continue ' + JSON.stringify(st.step1Continue) + ' (finish() in bindForms picks form.querySelector("[data-send], button[type=submit]"), which is the step 1 Continue button on the three step form)');
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
    state.test = t; state.primaryFail = false; state.fallbackFail = false; state.primaryDelayMs = 0;
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

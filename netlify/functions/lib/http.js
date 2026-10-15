/* Helpers for the HTTP entry points: JSON answers, body parsing, the client IP and the same-origin check. */
'use strict';

const config = require('./config');

function header(event, name) {
  const h = (event && event.headers) || {};
  const lower = name.toLowerCase();
  const key = Object.keys(h).find((k) => k.toLowerCase() === lower);
  return key ? String(h[key]) : '';
}

function json(status, body, headers) {
  return { statusCode: status, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, headers || {}), body: JSON.stringify(body) };
}

function parseJson(event) {
  if (!event || !event.body) return null;
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
    const obj = JSON.parse(raw);
    return obj && typeof obj === 'object' ? obj : null;
  } catch (e) { return null; }
}

function clientIp(event) {
  const nf = header(event, 'x-nf-client-connection-ip');
  if (nf) return nf.trim();
  const fwd = header(event, 'x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return header(event, 'client-ip').trim();
}

/* Same origin only: the Origin header must match this site's own host (or one of LEAD_ALLOWED_ORIGINS for the other
   Imperial sites). A request without an Origin header (not from a browser) passes; the rate limit and Turnstile still
   apply to it. */
function originCheck(event) {
  const origin = header(event, 'origin').trim().replace(/\/$/, '');
  if (!origin) return { ok: true, origin: '', headers: {} };
  const host = header(event, 'x-forwarded-host') || header(event, 'host');
  const proto = header(event, 'x-forwarded-proto') || 'https';
  const self = (proto + '://' + host).toLowerCase();
  const allowed = config.allowedOrigins().map((o) => o.toLowerCase());
  const ok = origin.toLowerCase() === self || allowed.indexOf(origin.toLowerCase()) > -1 || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const headers = ok ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600', Vary: 'Origin' } : { Vary: 'Origin' };
  return { ok, origin, headers };
}

/* Short reference shown to the person and written in the note, so the team can find a direct submission. */
function newRef(now) {
  const t = (now || Date.now()).toString(36).toUpperCase();
  const r = Math.floor(Math.random() * 1296).toString(36).toUpperCase();
  return 'W' + t + (r.length < 2 ? '0' + r : r);
}

module.exports = { header, json, parseJson, clientIp, originCheck, newRef };

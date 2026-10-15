/* Shared configuration for the lead functions. The three JSON files are required with static paths so the Netlify
   bundler (esbuild) packs them into each function. Environment variables are read at call time, never cached, so a
   change in the Netlify UI takes effect on the next invocation. No secret lives in this repository. */
'use strict';

const schema = require('../../../shared/lead-schema.json');
const routing = require('../../../shared/lead-routing.json');
const disposable = require('../../../shared/disposable-domains.json');

function env(name, fallback) {
  const v = process.env[name];
  return (v === undefined || v === null || String(v).trim() === '') ? fallback : String(v).trim();
}

function pipedriveToken() { return env('PIPEDRIVE_API_TOKEN', ''); }
function turnstileSecret() { return env('TURNSTILE_SECRET_KEY', ''); }

function twilio() {
  const sid = env('TWILIO_ACCOUNT_SID', ''), token = env('TWILIO_AUTH_TOKEN', ''), service = env('TWILIO_VERIFY_SERVICE_SID', '');
  return (sid && token && service) ? { sid, token, service } : null;
}

function email() {
  const key = env('EMAIL_API_KEY', ''), from = env('EMAIL_FROM', '');
  return (key && from) ? { key, from, replyTo: env('EMAIL_REPLY_TO', '') } : null;
}

/* Rate limit: 5 submissions per 10 minutes per IP unless overridden. */
function rate() {
  const limit = parseInt(env('LEAD_RATE_LIMIT', '5'), 10), minutes = parseInt(env('LEAD_RATE_WINDOW_MINUTES', '10'), 10);
  return { limit: isNaN(limit) || limit < 1 ? 5 : limit, windowMs: (isNaN(minutes) || minutes < 1 ? 10 : minutes) * 60000 };
}

/* Other Imperial sites that may call lead.js and verify.js directly (comma separated origins). Same origin always works. */
function allowedOrigins() {
  return env('LEAD_ALLOWED_ORIGINS', '').split(',').map((s) => s.trim().replace(/\/$/, '')).filter(Boolean);
}

function site() { return env('LEAD_SITE', 'ihg'); }

/* Pause between the person lookups after a good code (core.markVerified), 1.5 s unless overridden; the tests set 0. */
function verifyRetryDelayMs() {
  const ms = parseInt(env('VERIFY_RETRY_DELAY_MS', '1500'), 10);
  return isNaN(ms) || ms < 0 ? 1500 : ms;
}

module.exports = { schema, routing, disposable, env, pipedriveToken, turnstileSecret, twilio, email, rate, allowedOrigins, site, verifyRetryDelayMs };

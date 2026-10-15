/* Phone verification by one-time code (Twilio Verify, WhatsApp or SMS). POST JSON from the same origin.
     {action:'start', phone, email, channel:'whatsapp'|'sms', 'cf-turnstile-response'}  ->  {ok, enabled, ref}
     {action:'check', ref, phone, code, email}                                           ->  {ok, verified, recorded}
   Without TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID the start action answers
   {ok:true, enabled:false} and the page skips the step; nothing is sent. A start needs an email or a reference next
   to the phone, is limited per address and per number, and needs a Turnstile token when TURNSTILE_SECRET_KEY is set.
   On a successful check the person in Pipedrive is marked Verified and a note goes on their newest open lead or deal
   (recorded:true); when nobody holds the number yet the answer carries recorded:false and a reason. If the person
   skips the step, the lead keeps Not Verified, which the core set at creation. Provider error text stays in the
   function log; the client only sees a reason. Always JSON, never an exception to the client. */
'use strict';

const config = require('./lib/config');
const { json, parseJson, clientIp, originCheck } = require('./lib/http');
const { phoneE164, clean, checkEmail } = require('./lib/validate');
const { take } = require('./lib/ratelimit');
const { verifyTurnstile } = require('./lib/turnstile');
const twilio = require('./lib/twilio');
const { markVerified } = require('./lib/core');

/* Best effort buckets (lib/ratelimit.js: per function instance, empty on a cold start). Starts cost money. */
const START_PER_IP = { limit: 5, windowMs: 3600000 };
const START_PER_PHONE = { limit: 3, windowMs: 3600000 };
const CHECK_PER_IP = { limit: 10, windowMs: 600000 };

/* Last four digits only in the function log. */
function masked(phone) { const s = String(phone || ''); return s ? '...' + s.slice(-4) : ''; }

exports.handler = async function (event) {
  const cors = originCheck(event);
  const method = String(event.httpMethod || '').toUpperCase();
  if (method === 'OPTIONS') return { statusCode: cors.ok ? 204 : 403, headers: cors.headers, body: '' };
  if (method !== 'POST') return json(405, { ok: false, reason: 'method' }, cors.headers);
  if (!cors.ok) return json(403, { ok: false, reason: 'origin' }, cors.headers);
  const body = parseJson(event);
  if (!body) return json(400, { ok: false, reason: 'body' }, cors.headers);

  const action = clean(body.action, 20);
  const cfg = config.twilio();
  const phone = phoneE164(body.phone);
  const channel = clean(body.channel, 20) === 'whatsapp' ? 'whatsapp' : 'sms';
  const ip = clientIp(event);
  const email = checkEmail(body.email).email || '';
  const ref = clean(body.ref, 64);
  let out;

  try {
    if (action === 'start') {
      /* Every start costs a Twilio send, so an open start is a toll fraud target (SMS pumping). The brakes, in order:
         the request must look like it follows an enquiry (an email or a reference next to the phone; the page always
         sends the email), the per address and per number buckets (best effort, in memory, with one shared bucket when
         no address is known so the limit never silently switches off), and the Turnstile token when the secret is set.
         Nothing here can prove the enquiry was stored: the Netlify Forms path returns no reference, and a Pipedrive
         lookup at this point would race submission-created. The backstop is Twilio's own Fraud Guard and service
         rate limits (docs/LEADS.md section 4). */
      if (!cfg) out = { ok: true, enabled: false };
      else if (!phone) out = { ok: false, enabled: true, reason: 'phone' };
      else if (!email && !ref) out = { ok: false, enabled: true, reason: 'enquiry' };
      else if (!take('verify:' + (ip || 'unknown'), START_PER_IP).ok || !take('verify-phone:' + phone, START_PER_PHONE).ok) out = { ok: false, enabled: true, reason: 'rate' };
      else {
        const ts = await verifyTurnstile(clean(body['cf-turnstile-response'], 4000), ip, config.turnstileSecret());
        if (!ts.ok) out = { ok: false, enabled: true, reason: 'turnstile' };
        else {
          const r = await twilio.startVerification(phone, channel, cfg);
          if (r.ok) out = { ok: true, enabled: true, ref: r.ref, channel };
          else { out = { ok: false, enabled: true, reason: r.reason }; console.warn('verify provider', 'start', r.code || '', r.detail || ''); }
        }
      }
    } else if (action === 'check') {
      const code = clean(body.code, 12).replace(/\s/g, '');
      if (!cfg) out = { ok: false, verified: false, reason: 'disabled' };
      else if (!phone) out = { ok: false, verified: false, reason: 'phone' };
      else if (!/^\d{4,10}$/.test(code)) out = { ok: false, verified: false, reason: 'code' };
      else if (!take('verify-check:' + (ip || 'unknown'), CHECK_PER_IP).ok) out = { ok: false, verified: false, reason: 'rate' };
      else {
        const r = await twilio.checkVerification(phone, code, cfg);
        if (!r.ok) { out = { ok: false, verified: false, reason: r.reason }; console.warn('verify provider', 'check', r.code || '', r.detail || ''); }
        else if (!r.approved) out = { ok: true, verified: false, reason: r.status === 'expired' ? 'expired' : 'code' };
        else {
          const pd = await markVerified({ email: clean(body.email, 254), phone, channel, retryDelayMs: config.verifyRetryDelayMs() });
          out = { ok: true, verified: true, recorded: pd.ok, kind: pd.kind, id: pd.id };
          if (!pd.ok) {
            /* The code was right but nothing was written: the person is not in Pipedrive yet (submission-created still
               running, or it failed), or the email names a person who does not hold this number. The team marks the
               person by hand from this line; the page tells the visitor the code was accepted. */
            out.reason = pd.reason;
            console.warn('verify check: code accepted but not recorded', 'reason=' + pd.reason, 'phone=' + masked(phone), pd.error || '');
          }
        }
      }
    } else out = { ok: false, reason: 'action' };
  } catch (err) {
    out = { ok: false, reason: 'error', verified: false };
    console.error('verify failed', err && err.message);
  }
  console.log(['verify', action, out.ok ? 'ok' : 'rejected', 'enabled=' + (out.enabled === undefined ? '' : out.enabled), 'verified=' + (out.verified === undefined ? '' : out.verified), out.recorded === undefined ? '' : 'recorded=' + out.recorded, out.reason ? 'reason=' + out.reason : '', out.id ? 'record=' + out.kind + ':' + out.id : ''].filter(Boolean).join(' '));
  return json(200, out, cors.headers);
};

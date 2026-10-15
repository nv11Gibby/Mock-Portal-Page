/* Phone verification by one-time code (Twilio Verify, WhatsApp or SMS). POST JSON from the same origin.
     {action:'start', phone, email, channel:'whatsapp'|'sms'}  ->  {ok, enabled, ref}
     {action:'check', ref, phone, code, email}                 ->  {ok, verified}
   Without TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID the start action answers
   {ok:true, enabled:false} and the page skips the step; nothing is sent. On a successful check the person in Pipedrive
   is marked Verified and a note goes on their newest open lead or deal. If the person skips the step, the lead keeps
   Not Verified, which the core set at creation. Always JSON, never an exception to the client. */
'use strict';

const config = require('./lib/config');
const { json, parseJson, clientIp, originCheck } = require('./lib/http');
const { phoneE164, clean } = require('./lib/validate');
const { take } = require('./lib/ratelimit');
const twilio = require('./lib/twilio');
const { markVerified } = require('./lib/core');

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
  let out;

  try {
    if (action === 'start') {
      if (!cfg) out = { ok: true, enabled: false };
      else if (!phone) out = { ok: false, enabled: true, reason: 'phone' };
      else if (ip && !take('verify:' + ip, config.rate()).ok) out = { ok: false, enabled: true, reason: 'rate' };
      else {
        const r = await twilio.startVerification(phone, channel, cfg);
        out = r.ok ? { ok: true, enabled: true, ref: r.ref, channel } : { ok: false, enabled: true, reason: r.reason, detail: r.detail };
      }
    } else if (action === 'check') {
      const code = clean(body.code, 12).replace(/\s/g, '');
      if (!cfg) out = { ok: false, verified: false, reason: 'disabled' };
      else if (!phone) out = { ok: false, verified: false, reason: 'phone' };
      else if (!/^\d{4,10}$/.test(code)) out = { ok: false, verified: false, reason: 'code' };
      else if (ip && !take('verify-check:' + ip, { limit: 10, windowMs: 600000 }).ok) out = { ok: false, verified: false, reason: 'rate' };
      else {
        const r = await twilio.checkVerification(phone, code, cfg);
        if (!r.ok) out = { ok: false, verified: false, reason: r.reason, detail: r.detail };
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

/* Twilio Verify over its REST API with fetch (no SDK). Channel whatsapp or sms. Nothing is sent without
   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID. */
'use strict';

const BASE = 'https://verify.twilio.com/v2/Services/';

function form(obj) {
  return Object.keys(obj).filter((k) => obj[k] !== undefined && obj[k] !== '').map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
}

async function post(cfg, path, fields, fetchImpl) {
  const res = await (fetchImpl || fetch)(BASE + cfg.service + path, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(cfg.sid + ':' + cfg.token).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: form(fields)
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, json };
}

/* {ok, ref, status} */
async function startVerification(phone, channel, cfg, fetchImpl) {
  const r = await post(cfg, '/Verifications', { To: phone, Channel: channel === 'whatsapp' ? 'whatsapp' : 'sms' }, fetchImpl);
  if (!r.ok) return { ok: false, reason: 'provider', detail: r.json.message || ('status ' + r.status), code: r.json.code };
  return { ok: true, ref: r.json.sid, status: r.json.status };
}

/* {ok, approved, status}. A wrong code answers status pending; an expired or unknown verification answers 404. */
async function checkVerification(phone, code, cfg, fetchImpl) {
  const r = await post(cfg, '/VerificationCheck', { To: phone, Code: code }, fetchImpl);
  if (r.status === 404) return { ok: true, approved: false, status: 'expired' };
  if (!r.ok) return { ok: false, approved: false, reason: 'provider', detail: r.json.message || ('status ' + r.status), code: r.json.code };
  return { ok: true, approved: r.json.status === 'approved', status: r.json.status };
}

module.exports = { startVerification, checkVerification };

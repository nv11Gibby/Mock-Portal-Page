/* Cloudflare Turnstile server-side check. Only runs when TURNSTILE_SECRET_KEY is set. A token that Cloudflare
   rejects fails the submission. If Cloudflare itself cannot be reached, the submission is allowed through and the
   outage is logged: losing a real enquiry costs more than letting one spam message through. */
'use strict';

const ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyTurnstile(token, ip, secret, fetchImpl) {
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: 'turnstile', detail: 'missing token' };
  const doFetch = fetchImpl || fetch;
  try {
    const res = await doFetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip || undefined })
    });
    const json = await res.json().catch(() => ({}));
    if (json.success === true) return { ok: true };
    return { ok: false, reason: 'turnstile', detail: (json['error-codes'] || []).join(',') || ('status ' + res.status) };
  } catch (err) {
    console.warn('turnstile unreachable, allowing submission', err && err.message);
    return { ok: true, skipped: true, error: err && err.message };
  }
}

module.exports = { verifyTurnstile };

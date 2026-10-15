/* Per IP token bucket, in memory. Best effort on serverless: every function instance has its own buckets, a cold
   start empties them, and instances running in parallel do not share them. It stops a casual flood from one address;
   Turnstile, the honeypot and Netlify's own spam filter do the rest. Default: 5 submissions per 10 minutes. */
'use strict';

const buckets = new Map();
const MAX_KEYS = 5000;

function take(key, opts, now) {
  const limit = opts.limit, windowMs = opts.windowMs;
  now = now || Date.now();
  let b = buckets.get(key);
  if (!b) { b = { tokens: limit, at: now }; buckets.set(key, b); }
  else {
    b.tokens = Math.min(limit, b.tokens + (now - b.at) * limit / windowMs);
    b.at = now;
  }
  if (b.tokens >= 1) {
    b.tokens -= 1;
    prune(now, windowMs);
    return { ok: true, remaining: Math.floor(b.tokens) };
  }
  return { ok: false, remaining: 0, retryMs: Math.ceil((1 - b.tokens) * windowMs / limit) };
}

function prune(now, windowMs) {
  if (buckets.size <= MAX_KEYS) return;
  for (const [k, b] of buckets) {
    if (now - b.at > windowMs) buckets.delete(k);
    if (buckets.size <= MAX_KEYS / 2) break;
  }
}

function reset() { buckets.clear(); }

module.exports = { take, reset };

/* Confirmation email, provider neutral in shape, sent through the Resend HTTPS API when EMAIL_API_KEY and
   EMAIL_FROM are set. Plain short text, from a named mailbox, one next step. Nothing is sent without the env, and
   the core never calls this for an address that failed validation. Never throws. */
'use strict';

const config = require('./config');

const ENDPOINT = 'https://api.resend.com/emails';

/* The greeting uses the first name only when it is a plain word: letters, with apostrophes or hyphens inside
   (Amina, O'Brien, Jean-Luc, Müller). Anything else (a URL, digits, punctuation, a 200 character token) falls back
   to "Hello," so the mail from the named mailbox never relays text the sender chose. */
const NAME_RE = /^[\p{L}][\p{L}'’-]{0,39}$/u;
function firstName(name) {
  const n = String(name || '').trim().split(/\s+/)[0];
  if (!NAME_RE.test(n)) return '';
  return n.charAt(0).toUpperCase() + n.slice(1);
}

/* The address part of EMAIL_FROM ("Imperial Holdings Group <enquiries@...>" or a bare address). */
function senderAddress(from) {
  const m = /<([^>]+)>/.exec(String(from || ''));
  return (m ? m[1] : String(from || '')).trim();
}

/* lead: {email, name, form, divisionName, leadSource}; from: the sending mailbox (EMAIL_FROM), for the sign-off.
   Every line is fixed text apart from the division name from the routing file and the first name when it is a
   plain word. Three variants: guide request, register interest (a division that has not launched), everything else. */
function compose(lead, from) {
  const office = config.routing.office || {};
  const who = firstName(lead.name);
  const greeting = who ? 'Dear ' + who + ',' : 'Hello,';
  const guide = lead.form === 'guide' || lead.leadSource === 'guide';
  const interest = lead.form === 'interest';
  const subject = guide ? 'Your guide request' : interest ? 'Your interest in ' + lead.divisionName : 'Your enquiry with Imperial Holdings Group';
  const opening = guide
    ? 'Thank you for requesting the guide. It is being finalised; one person at ' + lead.divisionName + ' will let you know when it is ready and will be your point of contact if you have questions.'
    : interest
      ? 'Thank you for registering your interest in ' + lead.divisionName + '. It has not launched yet; we will write to you when it opens.'
      : 'Thank you for your enquiry. It has reached ' + lead.divisionName + ', and one person will be your point of contact.';
  const next = interest
    ? 'If you would like to talk sooner, reply to this email or call the office.'
    : 'One next step: reply to this email with a good time for a first conversation, or call the office.';
  const lines = [
    greeting, '',
    opening, '',
    next,
    (office.dubai ? office.dubai.name + ' ' + office.dubai.tel : ''),
    (office.lagos ? office.lagos.name + ' ' + office.lagos.tel : ''),
    '',
    'Kind regards,',
    'Imperial Holdings Group',
    senderAddress(from) || office.email || ''
  ].filter((l) => l !== null && l !== undefined);
  return { subject, text: lines.join('\n').replace(/\n{3,}/g, '\n\n') };
}

async function sendConfirmation(lead, fetchImpl) {
  const cfg = config.email();
  if (!cfg) return { sent: false, skipped: 'no env' };
  if (!lead || !lead.email) return { sent: false, skipped: 'no address' };
  const msg = compose(lead, cfg.from);
  const body = { from: cfg.from, to: [lead.email], subject: msg.subject, text: msg.text };
  if (cfg.replyTo) body.reply_to = cfg.replyTo;
  try {
    const res = await (fetchImpl || fetch)(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + cfg.key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { sent: false, error: 'status ' + res.status + ' ' + (json.message || json.error || '') };
    return { sent: true, id: json.id };
  } catch (err) {
    return { sent: false, error: err && err.message };
  }
}

module.exports = { sendConfirmation, compose };

/* Confirmation email, provider neutral in shape, sent through the Resend HTTPS API when EMAIL_API_KEY and
   EMAIL_FROM are set. Plain short text, from a named mailbox, one next step. Nothing is sent without the env, and
   the core never calls this for an address that failed validation. Never throws. */
'use strict';

const config = require('./config');

const ENDPOINT = 'https://api.resend.com/emails';

function firstName(name) {
  const n = String(name || '').trim().split(/\s+/)[0];
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
}

/* lead: {email, name, form, divisionName, leadSource} */
function compose(lead) {
  const office = config.routing.office || {};
  const who = firstName(lead.name);
  const greeting = who ? 'Dear ' + who + ',' : 'Hello,';
  const guide = lead.form === 'guide' || lead.leadSource === 'guide';
  const subject = guide ? 'Your guide request' : 'Your enquiry with Imperial Holdings Group';
  const opening = guide
    ? 'Thank you for requesting the guide. One person at ' + lead.divisionName + ' will be your point of contact if you have questions.'
    : 'Thank you for your enquiry. It has reached ' + lead.divisionName + ', and one person will be your point of contact.';
  const lines = [
    greeting, '',
    opening, '',
    'One next step: reply to this email with a good time for a first conversation, or call the office.',
    (office.dubai ? office.dubai.name + ' ' + office.dubai.tel : ''),
    (office.lagos ? office.lagos.name + ' ' + office.lagos.tel : ''),
    '',
    'Kind regards,',
    'Imperial Holdings Group',
    office.email || ''
  ].filter((l) => l !== null && l !== undefined);
  return { subject, text: lines.join('\n').replace(/\n{3,}/g, '\n\n') };
}

async function sendConfirmation(lead, fetchImpl) {
  const cfg = config.email();
  if (!cfg) return { sent: false, skipped: 'no env' };
  if (!lead || !lead.email) return { sent: false, skipped: 'no address' };
  const msg = compose(lead);
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

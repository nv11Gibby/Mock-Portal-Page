/* Imperial Holdings Group: every Netlify Forms submission flows into Pipedrive.
   Netlify runs this event function on each successful form submission (the name "submission-created" is reserved for
   that). It hands the submission to the shared core in lib/core.js, which qualifies, scores, deduplicates and writes
   the lead or deal, the note and the confirmation email. The token comes from the PIPEDRIVE_API_TOKEN environment
   variable set in the Netlify UI, never from this repository.
   Whatever happens, the function answers 200, so the Netlify submission itself is always kept. */
'use strict';

const { processLead, summary } = require('./lib/core');
const config = require('./lib/config');

exports.handler = async function (event) {
  let payload;
  try { payload = JSON.parse(event.body).payload; } catch (e) { return { statusCode: 400, body: 'Bad payload' }; }
  if (!payload || typeof payload !== 'object') return { statusCode: 400, body: 'Bad payload' };
  const data = payload.data || {};
  const ctx = {
    ip: data.ip || '',
    site: config.site(),
    submissionId: payload.id || '',
    createdAt: payload.created_at || '',
    ref: payload.id ? 'N' + String(payload.id).slice(-8).toUpperCase() : undefined
  };
  let result;
  try { result = await processLead({ form: payload.form_name, data, ctx }); }
  catch (err) { result = { ok: false, reason: 'error', error: err && err.message, form: payload.form_name }; }
  console.log(summary('submission-created', result));
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: !!result.ok, reason: result.reason, ref: result.ref, kind: result.kind, id: result.id }) };
};

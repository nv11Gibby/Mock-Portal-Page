/* Direct lead endpoint: the fallback the page uses when the Netlify Forms post fails, and the entry point another
   Imperial site can call. POST JSON {form, data} from the same origin (or an origin listed in LEAD_ALLOWED_ORIGINS).
   Runs the same core as submission-created.js and answers {ok:true, ref} or {ok:false, reason}. Always JSON, never
   an exception to the client. Note: unlike a Netlify Forms post, nothing else stores this submission, so a Pipedrive
   failure answers ok:false and the page shows the office contacts and keeps the draft. */
'use strict';

const { processLead, summary } = require('./lib/core');
const config = require('./lib/config');
const { json, parseJson, clientIp, originCheck, newRef } = require('./lib/http');

exports.handler = async function (event) {
  const cors = originCheck(event);
  const method = String(event.httpMethod || '').toUpperCase();
  if (method === 'OPTIONS') return { statusCode: cors.ok ? 204 : 403, headers: cors.headers, body: '' };
  if (method !== 'POST') return json(405, { ok: false, reason: 'method' }, cors.headers);
  if (!cors.ok) return json(403, { ok: false, reason: 'origin' }, cors.headers);
  const body = parseJson(event);
  if (!body || !body.data || typeof body.data !== 'object') return json(400, { ok: false, reason: 'body' }, cors.headers);

  const ctx = { ip: clientIp(event), site: config.site(), ref: newRef(), origin: cors.origin };
  let result;
  try { result = await processLead({ form: body.form, data: body.data, ctx }); }
  catch (err) { result = { ok: false, reason: 'error', error: err && err.message, form: body.form, ref: ctx.ref }; }
  console.log(summary('lead', result));
  return json(200, result.ok ? { ok: true, ref: result.ref, kind: result.kind } : { ok: false, reason: result.reason || 'error', ref: result.ref }, cors.headers);
};

/* Thin Pipedrive REST client (API v1, token in the query string, global fetch, no SDK). Every helper returns the
   "data" part of the response or throws an Error with .status. The token comes from the caller, never from here. */
'use strict';

const { routing } = require('./config');
const { samePhone, digits } = require('./validate');

/* Leads inbox labels are a separate set from the deal labels, with UUID ids, so the numeric deal ids (787, 788, 827)
   are rejected on every POST /leads. They are read from the account (GET /leadLabels) once per function instance and
   matched on the leading word of the label name: Hot, Warm and Cold (the exploring band). Nothing is created in the
   account; when no label matches, the lead goes without one and the title prefix and the note carry the band. */
const LABEL_WORD = { hot: 'hot', warm: 'warm', exploring: 'cold' };
const LABEL_TTL_OK = 600000, LABEL_TTL_FAIL = 60000;
let labelCache = { token: '', map: null, at: 0, ttl: 0 };
function resetLeadLabelCache() { labelCache = { token: '', map: null, at: 0, ttl: 0 }; }

function client(token, fetchImpl) {
  const base = routing.pipedrive.base;
  const doFetch = fetchImpl || fetch;

  async function call(method, path, body) {
    const url = base + path + (path.indexOf('?') > -1 ? '&' : '?') + 'api_token=' + encodeURIComponent(token);
    const res = await doFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
      const err = new Error('Pipedrive ' + method + ' ' + path.split('?')[0] + ': ' + res.status + ' ' + (json.error || '') + (json.error_info ? ' (' + json.error_info + ')' : ''));
      err.status = res.status;
      throw err;
    }
    return json.data;
  }

  function searchItems(r) { return ((r && r.items) || []).map((x) => x.item).filter(Boolean); }

  async function findPersonByEmail(email) {
    if (!email) return null;
    const items = searchItems(await call('GET', '/persons/search?fields=email&exact_match=true&limit=5&term=' + encodeURIComponent(email)));
    const lower = email.toLowerCase();
    return items.find((p) => (p.emails || []).some((e) => String(e).toLowerCase() === lower)) || items[0] || null;
  }

  async function findPersonByPhone(phone) {
    const d = digits(phone);
    if (d.length < 8) return null;
    const items = searchItems(await call('GET', '/persons/search?fields=phone&limit=10&term=' + encodeURIComponent(d.slice(-9))));
    return items.find((p) => (p.phones || []).some((ph) => samePhone(ph, phone))) || null;
  }

  function getPerson(id) { return call('GET', '/persons/' + id); }
  function createPerson(body) { return call('POST', '/persons', body); }
  function updatePerson(id, body) { return call('PUT', '/persons/' + id, body); }

  async function findOrg(name) {
    if (!name) return null;
    const items = searchItems(await call('GET', '/organizations/search?fields=name&exact_match=true&limit=5&term=' + encodeURIComponent(name)));
    return items[0] || null;
  }
  function createOrg(body) { return call('POST', '/organizations', body); }

  async function openLeads(personId) {
    const list = await call('GET', '/leads?archived_status=not_archived&limit=100&person_id=' + personId);
    return (list || []).filter((l) => !l.is_archived && String(l.person_id) === String(personId));
  }
  async function openDeals(personId) {
    const list = await call('GET', '/persons/' + personId + '/deals?status=open&limit=100');
    return (list || []).filter((d) => d.status === 'open' || !d.status);
  }

  /* {hot, warm, exploring} -> label UUID, from the account's Leads inbox labels. Cached per token for ten minutes, one
     minute after a failed read, so a lead never costs more than one extra call and an outage costs only the label. */
  async function leadLabelMap() {
    const now = Date.now();
    if (labelCache.map && labelCache.token === token && now - labelCache.at < labelCache.ttl) return labelCache.map;
    const map = {};
    let ttl = LABEL_TTL_FAIL;
    try {
      const list = await call('GET', '/leadLabels');
      (Array.isArray(list) ? list : []).forEach((l) => {
        const word = String((l && l.name) || '').trim().toLowerCase().split(/\s+/)[0];
        Object.keys(LABEL_WORD).forEach((band) => { if (!map[band] && l && l.id && word === LABEL_WORD[band]) map[band] = String(l.id); });
      });
      ttl = LABEL_TTL_OK;
    } catch (err) { console.warn('lead labels not read, leads go without a label', err && err.message); }
    labelCache = { token, map, at: now, ttl };
    return map;
  }
  async function leadLabelId(band) { return (await leadLabelMap())[band] || null; }

  /* Retry without the label only when the API objects to the label itself; any other error is the caller's. */
  async function createLead(body) {
    try { return await call('POST', '/leads', body); }
    catch (err) {
      if (!body.label_ids || !/label/i.test(err && err.message)) throw err;
      console.warn('lead label rejected, retrying without it', err.message);
      const copy = Object.assign({}, body);
      delete copy.label_ids;
      const lead = await call('POST', '/leads', copy);
      lead._labelRejected = true;
      return lead;
    }
  }
  function createDeal(body) { return call('POST', '/deals', body); }
  function addNote(body) { return call('POST', '/notes', body); }
  function addActivity(body) { return call('POST', '/activities', body); }

  return { call, findPersonByEmail, findPersonByPhone, getPerson, createPerson, updatePerson, findOrg, createOrg, openLeads, openDeals, leadLabelId, createLead, createDeal, addNote, addActivity };
}

/* Case-insensitive match of free text against the option labels of an enum person field. */
function optionId(map, text) {
  const t = String(text || '').trim().replace(/\s+/g, ' ').toLowerCase();
  if (!t) return null;
  const keys = Object.keys(map);
  for (let i = 0; i < keys.length; i++) if (keys[i].toLowerCase() === t) return map[keys[i]];
  return null;
}

/* Nationality may hold several, comma or slash separated: the first that matches an option wins. */
function firstOptionId(map, text) {
  const parts = String(text || '').split(/[,;\/]|\band\b/i).map((s) => s.trim()).filter(Boolean);
  for (let i = 0; i < parts.length; i++) { const id = optionId(map, parts[i]); if (id) return id; }
  return null;
}

module.exports = { client, optionId, firstOptionId, resetLeadLabelCache };

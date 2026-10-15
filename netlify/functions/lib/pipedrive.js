/* Thin Pipedrive REST client (API v1, token in the query string, global fetch, no SDK). Every helper returns the
   "data" part of the response or throws an Error with .status. The token comes from the caller, never from here. */
'use strict';

const { routing } = require('./config');
const { samePhone, digits } = require('./validate');

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

  /* Leads carry their own label set; deal label ids may be rejected. Try with them, then without. */
  async function createLead(body) {
    try { return await call('POST', '/leads', body); }
    catch (err) {
      if (!body.label_ids) throw err;
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

  return { call, findPersonByEmail, findPersonByPhone, getPerson, createPerson, updatePerson, findOrg, createOrg, openLeads, openDeals, createLead, createDeal, addNote, addActivity };
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

module.exports = { client, optionId, firstOptionId };

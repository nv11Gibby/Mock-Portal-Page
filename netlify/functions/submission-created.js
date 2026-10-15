/* Imperial Holdings Group: every Netlify Forms submission flows into Pipedrive.
   Netlify runs this event function on each successful form submission (the function name "submission-created"
   is reserved for that purpose). It reads the token from the PIPEDRIVE_API_TOKEN environment variable set in the
   Netlify UI (Site configuration > Environment variables). The token is never in this repository.

   What it does, per submission:
     1. Qualifies the enquiry: audience (clients, partners, institutions) and division.
     2. Finds or creates the Person (by email) and, where a company is named, the Organisation.
     3. Creates a Lead (clients) or a Deal in the right pipeline (partners, institutions), with source tracking:
        Source Platform = Website, Source Method from the UTM/click ids, Contact Type, Division and Urgency.
     4. Attaches a Note with the message, the routing and the full source record.
     5. Assigns the owner per audience when PIPEDRIVE_OWNER_* is set.
   Any failure is logged and the function still returns 200, so the Netlify submission is always kept. */

var PD = {
  base: 'https://api.pipedrive.com/v1',
  // Custom deal fields and option ids (from the Pipedrive account, October 2026). Leads accept the same deal custom fields.
  f: {
    sourceMethod: 'dff08e069bafd15c563ed5f4e2a3607dad7c587e',
    sourcePlatform: '7988cc795abe12896a1d0ef6bc8c7ca3cb3d386b',
    contactType: '048642f92168ef1eeb1723c30c7f35070fd285f5',
    requestType: 'c11f7e12fca06159ff6abb9c6ed72f549b587285',
    division: '97819d9dfd310fda14bc4fd0c03bf10882f5984d',
    urgency: '6a27235d5ea4ebd3041d6d6137ef406e5965351a'
  },
  opt: {
    method: {referral: 791, organic: 778, google: 777, meta: 775, paid: 1072, networking: 822, tiktok: 1091},
    platform: {website: 799, events: 823, introducer: 1022, linkedin: 795},
    contact: {client: 230, partner: 231},
    request: {referral: 1126, askTheDesk: 1127},
    division: {citizenship: 1128, 'real-estate': 1129, 'private-office': 1130, multiple: 1131},
    urgency: {standard: 1132, urgent: 1133}
  },
  // Pipelines and first stages. Override with env vars if the account changes.
  pipe: {
    partners: {pipeline: num(process.env.PIPEDRIVE_PIPELINE_PARTNERS, 2), stage: num(process.env.PIPEDRIVE_STAGE_PARTNERS, 7)},        // Introducer Pipeline [2026] > Introducer IN
    institutions: {pipeline: num(process.env.PIPEDRIVE_PIPELINE_INSTITUTIONS, 26), stage: num(process.env.PIPEDRIVE_STAGE_INSTITUTIONS, 163)} // Opportunity Requests > New Request
  },
  owner: {
    clients: num(process.env.PIPEDRIVE_OWNER_CLIENTS, 0),
    partners: num(process.env.PIPEDRIVE_OWNER_PARTNERS, 0),
    institutions: num(process.env.PIPEDRIVE_OWNER_INSTITUTIONS, 0)
  }
};
function num(v, d){ var n = parseInt(v, 10); return isNaN(n) ? d : n; }

var DIVISION_NAMES = {
  citizenship: 'Imperial Citizenship', 'private-office': 'Imperial Private Office', 'partners-club': 'Imperial Partners Club',
  academy: 'Imperial Academy', 'real-estate': 'Imperial Real Estate', group: 'Imperial Holdings Group'
};
var AUD_OF = {citizenship: 'clients', 'private-office': 'clients', 'real-estate': 'clients', 'partners-club': 'partners', academy: 'partners', group: 'institutions'};

function qualify(formName, d){
  var division = d.division || d.about || (formName === 'interest' ? 'real-estate' : 'group');
  var audience = d.audience || d.audience_resolved || AUD_OF[division] || 'clients';
  if(['clients','partners','institutions'].indexOf(audience) < 0) audience = AUD_OF[division] || 'clients';
  return {division: division, audience: audience, divisionName: DIVISION_NAMES[division] || 'Imperial Holdings Group'};
}
function sourceMethod(d){
  var src = (d.utm_source || d.source || '').toLowerCase(), med = (d.utm_medium || d.medium || '').toLowerCase();
  var paid = /cpc|ppc|paid|ads|display/.test(med) || !!d.gclid || !!d.fbclid;
  if(/google/.test(src) && paid || d.gclid) return PD.opt.method.google;
  if(/facebook|instagram|meta|fb\b/.test(src) && paid || d.fbclid) return PD.opt.method.meta;
  if(/tiktok/.test(src)) return PD.opt.method.tiktok;
  if(paid) return PD.opt.method.paid;
  if(/referral/.test(med) || (src && src !== 'direct' && !/google|bing|yahoo|duckduckgo/.test(src))) return PD.opt.method.referral;
  return PD.opt.method.organic;
}
function customFields(q, d){
  var f = {};
  f[PD.f.sourcePlatform] = PD.opt.platform.website;
  f[PD.f.sourceMethod] = sourceMethod(d);
  f[PD.f.urgency] = /urgent/i.test(d.msg || '') ? PD.opt.urgency.urgent : PD.opt.urgency.standard;
  if(q.audience === 'clients') f[PD.f.contactType] = PD.opt.contact.client;
  if(q.audience === 'partners') f[PD.f.contactType] = PD.opt.contact.partner;
  var dv = PD.opt.division[q.division]; if(q.division === 'group') dv = PD.opt.division.multiple;
  if(dv) f[PD.f.division] = dv;
  return f;
}

async function pd(method, path, body){
  var token = process.env.PIPEDRIVE_API_TOKEN;
  var url = PD.base + path + (path.indexOf('?') > -1 ? '&' : '?') + 'api_token=' + encodeURIComponent(token);
  var res = await fetch(url, {method: method, headers: {'Content-Type': 'application/json'}, body: body ? JSON.stringify(body) : undefined});
  var json = await res.json().catch(function(){ return {}; });
  if(!res.ok || json.success === false) throw new Error('Pipedrive ' + method + ' ' + path.split('?')[0] + ': ' + res.status + ' ' + (json.error || ''));
  return json.data;
}
async function findPerson(email){
  if(!email) return null;
  var r = await pd('GET', '/persons/search?fields=email&exact_match=true&term=' + encodeURIComponent(email));
  var items = (r && r.items) || [];
  return items.length ? items[0].item : null;
}
async function findOrg(name){
  if(!name) return null;
  var r = await pd('GET', '/organizations/search?fields=name&exact_match=true&term=' + encodeURIComponent(name));
  var items = (r && r.items) || [];
  return items.length ? items[0].item : null;
}

exports.handler = async function(event){
  var payload;
  try{ payload = JSON.parse(event.body).payload; }catch(e){ return {statusCode: 400, body: 'Bad payload'}; }
  if(!process.env.PIPEDRIVE_API_TOKEN){ console.warn('PIPEDRIVE_API_TOKEN is not set; submission kept in Netlify only'); return {statusCode: 200, body: 'No token'}; }
  var formName = payload.form_name, d = payload.data || {};
  if(d.company_url){ return {statusCode: 200, body: 'Honeypot'}; }
  var q = qualify(formName, d), ownerId = PD.owner[q.audience] || 0;
  try{
    // 1. person and organisation
    var org = null, orgName = (d.organisation || d.company || '').trim();
    if(orgName){ org = await findOrg(orgName) || await pd('POST', '/organizations', {name: orgName, owner_id: ownerId || undefined}); }
    var person = await findPerson(d.email);
    if(!person){
      person = await pd('POST', '/persons', {name: d.name || d.email, email: d.email ? [{value: d.email, primary: true, label: 'work'}] : undefined,
        phone: d.phone ? [{value: d.phone, primary: true, label: 'work'}] : undefined, org_id: org ? org.id : undefined, owner_id: ownerId || undefined, visible_to: 3});
    } else if(d.phone && !(person.phones && person.phones.length)){
      await pd('PUT', '/persons/' + person.id, {phone: [{value: d.phone, primary: true, label: 'work'}]}).catch(function(){});
    }
    // 2. lead (clients) or deal (partners, institutions)
    var title = 'Website: ' + (d.name || d.email) + ' · ' + q.divisionName + (formName === 'interest' ? ' (register interest)' : '');
    var fields = customFields(q, d), created, kind;
    if(q.audience === 'clients'){
      var lead = Object.assign({title: title, person_id: person.id, organization_id: org ? org.id : undefined, owner_id: ownerId || undefined, visible_to: 3}, fields);
      created = await pd('POST', '/leads', lead); kind = 'lead';
    } else {
      var pipe = PD.pipe[q.audience];
      var deal = Object.assign({title: title, person_id: person.id, org_id: org ? org.id : undefined, pipeline_id: pipe.pipeline, stage_id: pipe.stage, user_id: ownerId || undefined, visible_to: 3}, fields);
      created = await pd('POST', '/deals', deal); kind = 'deal';
    }
    // 3. note with the message and the full source record
    var lines = [
      'Website enquiry (' + formName + ' form)',
      'Audience: ' + q.audience + ' · Division: ' + q.divisionName + (d.routed_to ? ' · Routed to: ' + d.routed_to : ''),
      d.interest ? 'Interest: ' + d.interest : '', d.interests ? 'Interests: ' + d.interests : '',
      'Country: ' + (d.country || '') + (d.pref ? ' · Reply by: ' + d.pref : ''),
      '', 'Message:', d.msg || '(none)', '',
      'Source: ' + (d.source || '') + ' · Medium: ' + (d.medium || '') + ' · Campaign: ' + (d.campaign || ''),
      'UTM: ' + ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(function(k){ return k + '=' + (d[k] || ''); }).join(' '),
      'Landing: ' + (d.landing || '') + '\nReferrer: ' + (d.referrer || '') + '\nPage: ' + (d.page || ''),
      'Netlify submission: ' + (payload.id || '') + ' at ' + (payload.created_at || '')
    ].filter(function(l){ return l !== null && l !== undefined; });
    var note = {content: lines.join('\n').replace(/\n/g, '<br>'), person_id: person.id};
    if(kind === 'lead') note.lead_id = created.id; else note.deal_id = created.id;
    await pd('POST', '/notes', note);
    console.log('Pipedrive ' + kind + ' created', created.id, q.audience, q.division);
  }catch(err){
    console.error('Pipedrive sync failed', err && err.message, {form: formName, email: d.email, audience: q.audience, division: q.division});
  }
  return {statusCode: 200, body: 'ok'};
};

/* SEO build check (brief acceptance test 5, docs/BUILD-CONTRACT.md 4.6). Starts the test server on dist/, fetches
   every route and asserts: 200, prerendered, exactly one title, description and canonical, an absolute og:image,
   unique titles and descriptions across pages, valid JSON-LD of the expected types; robots.txt and sitemap.xml
   answer 200 and the sitemap lists every route; the RSS feed exists; 404.html and error.html are noindex, without a
   canonical, and carry the office contacts (error.html also the reload button); every logo file named in shared/ecosystem.json is in the build; _headers holds the inline script hashes;
   the hero preloads are under 200 KB.
   Usage: node tests/seo.js [dist dir] [port]   (defaults: dist, 8776). Run `npm run build` first.
   The route list is built here from data.js on purpose, independently of app.js, so a page missing from the build is
   caught rather than copied. */
'use strict';
const http = require('http');
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const cp = require('child_process');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const PORT = parseInt(process.argv[3] || '8776', 10);
const BASE = 'http://127.0.0.1:' + PORT;
const LAUNCH = process.env.LAUNCH === '1';

const sandbox = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8'), sandbox, {filename: 'data.js'});
const D = sandbox.window.IHG, SITE = String(D.config.siteUrl).replace(/\/+$/, '');
const routes = ['/', '/about', '/divisions'].concat(D.divisions.map(function(d){ return '/divisions/' + d.key; }), ['/journal'],
  D.events.map(function(e){ return '/journal/events/' + e.slug; }), ['/insights'], D.insights.map(function(a){ return '/insights/' + a.slug; }), ['/contact', '/privacy', '/terms']);

let fails = 0;
function ok(cond, label, detail){ if(cond) console.log('ok   ' + label); else { fails++; console.log('FAIL ' + label + (detail ? ' | ' + detail : '')); } }
function get(url){
  return new Promise(function(resolve, reject){
    http.get(url, function(res){ let b = ''; res.setEncoding('utf8'); res.on('data', function(c){ b += c; }); res.on('end', function(){ resolve({status: res.statusCode, body: b, headers: res.headers}); }); }).on('error', reject);
  });
}
function count(html, re){ return (html.match(re) || []).length; }
function attr(html, re){ const m = re.exec(html); return m ? m[1] : null; }
function ldBlocks(html){
  const out = []; html.replace(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g, function(m, body){ try{ out.push(JSON.parse(body)); }catch(e){ out.push({'@type': 'INVALID', error: String(e)}); } return m; });
  return out;
}
function types(blocks){ return blocks.map(function(b){ return b['@type']; }); }

function startServer(){
  return new Promise(function(resolve, reject){
    const child = cp.spawn(process.execPath, [path.join(ROOT, 'tests/serve.js'), DIR, String(PORT)], {stdio: ['ignore', 'pipe', 'pipe']});
    let started = false;
    child.stdout.on('data', function(c){ if(!started && /serving/.test(String(c))){ started = true; resolve(child); } });
    child.stderr.on('data', function(c){ process.stderr.write(String(c)); });
    child.on('exit', function(code){ if(!started) reject(new Error('test server exited with code ' + code + ' (port ' + PORT + ' busy?)')); });
  });
}

(async function(){
  if(!fs.existsSync(path.join(DIR, 'index.html'))){ console.error('no build at ' + DIR + ': run `npm run build` first'); process.exit(2); }
  const server = await startServer();
  try{
    const titles = {}, descs = {};
    for(const route of routes){
      const r = await get(BASE + route);
      const h = r.body, label = route.padEnd(44);
      const title = attr(h, /<title>([\s\S]*?)<\/title>/), desc = attr(h, /<meta name="description" content="([^"]*)"/), can = attr(h, /<link rel="canonical" href="([^"]*)"/);
      const ogImg = attr(h, /<meta property="og:image" content="([^"]*)"/), blocks = ldBlocks(h), ty = types(blocks);
      const expectCanonical = route === '/' ? SITE + '/' : SITE + route;
      const problems = [];
      if(r.status !== 200) problems.push('status ' + r.status);
      if(!/<html[^>]*\sdata-prerendered/.test(h)) problems.push('not prerendered');
      if(count(h, /<title>/g) !== 1) problems.push('titles: ' + count(h, /<title>/g));
      if(count(h, /<meta name="description"/g) !== 1 || !desc) problems.push('descriptions: ' + count(h, /<meta name="description"/g));
      if(count(h, /<link rel="canonical"/g) !== 1 || can !== expectCanonical) problems.push('canonical: ' + can);
      if(!ogImg || !/^https?:\/\//.test(ogImg)) problems.push('og:image: ' + ogImg);
      ['og:title', 'og:description', 'og:url', 'og:type'].forEach(function(p){ if(!new RegExp('<meta property="' + p + '" content="[^"]+"').test(h)) problems.push('missing ' + p); });
      ['twitter:card', 'twitter:title', 'twitter:image'].forEach(function(n){ if(!new RegExp('<meta name="' + n + '" content="[^"]+"').test(h)) problems.push('missing ' + n); });
      if(!/<h1[\s>]/.test(h)) problems.push('no h1');
      if(/href="#\//.test(h)) problems.push('hash links remain');
      if(/\s(?:src|href)="assets\//.test(h)) problems.push('relative asset urls remain');
      if(LAUNCH ? /<meta name="robots"/.test(h) : !/<meta name="robots" content="noindex/.test(h)) problems.push(LAUNCH ? 'noindex present after launch' : 'pre-launch noindex missing');
      if(ty.indexOf('INVALID') > -1) problems.push('invalid JSON-LD');
      if(ty.indexOf('Organization') < 0) problems.push('no Organization');
      if(route !== '/' && ty.indexOf('BreadcrumbList') < 0) problems.push('no BreadcrumbList');
      if(route === '/contact' && (ty.indexOf('FAQPage') < 0 || ty.filter(function(t){ return t === 'LocalBusiness'; }).length !== D.contact.offices.length)) problems.push('contact: FAQPage + one LocalBusiness per office expected, got ' + ty.join(','));
      if(/^\/insights\/./.test(route) && ty.indexOf('Article') < 0) problems.push('no Article');
      if(/^\/journal\/events\/./.test(route) && ty.indexOf('Event') < 0) problems.push('no Event');
      if(titles[title]) problems.push('title also on ' + titles[title]); titles[title] = route;
      if(descs[desc]) problems.push('description also on ' + descs[desc]); descs[desc] = route;
      ok(!problems.length, label + (title || '').slice(0, 60), problems.join('; '));
    }
    /* search assets */
    const robots = await get(BASE + '/robots.txt');
    ok(robots.status === 200 && robots.body.indexOf('Sitemap: ' + SITE + '/sitemap.xml') > -1 && /Disallow: \/\.netlify\//.test(robots.body), 'robots.txt', 'status ' + robots.status);
    const sm = await get(BASE + '/sitemap.xml');
    const locs = []; sm.body.replace(/<loc>([^<]+)<\/loc>/g, function(m, l){ locs.push(l); return m; });
    const want = routes.map(function(r){ return r === '/' ? SITE + '/' : SITE + r; });
    const missing = want.filter(function(u){ return locs.indexOf(u) < 0; }), extra = locs.filter(function(u){ return want.indexOf(u) < 0; });
    ok(sm.status === 200 && !missing.length && !extra.length, 'sitemap.xml lists every route (' + locs.length + ')', (missing.length ? 'missing ' + missing.join(',') : '') + (extra.length ? ' extra ' + extra.join(',') : ''));
    const feed = await get(BASE + '/journal/feed.xml');
    const links = []; feed.body.replace(/<item>[\s\S]*?<link>([^<]+)<\/link>/g, function(m, l){ links.push(l); return m; });
    ok(feed.status === 200 && /<rss version="2.0"/.test(feed.body) && links.length > 0 && links.every(function(l){ return l.indexOf(SITE + '/') === 0; }), 'journal/feed.xml (' + links.length + ' items, absolute links)', 'status ' + feed.status);
    const nf = await get(BASE + '/404.html');
    const tels = D.contact.offices.map(function(o){ return o.tel; });
    ok(nf.status === 200 && /<meta name="robots" content="noindex/.test(nf.body) && !/rel="canonical"/.test(nf.body) && /data-prerendered/.test(nf.body) && tels.every(function(t){ return nf.body.indexOf(t) > -1; }) && nf.body.indexOf(D.contact.email) > -1, '404.html: noindex, no canonical, office contacts present', 'status ' + nf.status);
    /* error.html: the error view for a host or an edge rule to return on a server error (build/README.md); same rules as 404.html plus the Try again button */
    const er = await get(BASE + '/error.html');
    ok(er.status === 200 && /<meta name="robots" content="noindex/.test(er.body) && !/rel="canonical"/.test(er.body) && /data-prerendered/.test(er.body) && /<h1[\s>]/.test(er.body) && tels.every(function(t){ return er.body.indexOf(t) > -1; }) && er.body.indexOf(D.contact.email) > -1 && /<button[^>]*\sdata-reload/.test(er.body), 'error.html: noindex, no canonical, office contacts and the reload button present', 'status ' + er.status);
    /* the ecosystem package: every logo file it names must exist (a null entry means the site has no such file) */
    const eco = JSON.parse(fs.readFileSync(path.join(ROOT, 'shared/ecosystem.json'), 'utf8'));
    const logos = [], lost = [];
    eco.sites.forEach(function(s){ Object.keys(s.logo || {}).forEach(function(k){ const f = s.logo[k]; if(!f) return; logos.push(f); if(!fs.existsSync(path.join(DIR, 'assets/logos', f))) lost.push(s.key + '.' + k + ' ' + f); }); });
    ok(logos.length > 0 && !lost.length, 'ecosystem.json names only logo files that exist (' + logos.length + ')', lost.join(', '));
    /* headers, redirects, hero weight */
    const headers = fs.readFileSync(path.join(DIR, '_headers'), 'utf8'), index = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
    const hashes = []; index.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, function(m, a, b){ if(!/\ssrc=/.test(a) && !/ld\+json/.test(a) && b.trim()) hashes.push('sha256-' + crypto.createHash('sha256').update(b, 'utf8').digest('base64')); return m; });
    ok(hashes.length > 0 && hashes.every(function(x){ return headers.indexOf(x) > -1; }), '_headers carries every inline script hash (' + hashes.length + ')');
    ok(LAUNCH ? !/^\s*X-Robots-Tag:/m.test(headers) : /^\s*X-Robots-Tag: noindex/m.test(headers), '_headers robots header matches LAUNCH=' + (LAUNCH ? '1' : '0'));
    const redirects = fs.readFileSync(path.join(DIR, '_redirects'), 'utf8');
    ok(!/^\/\*\s/m.test(redirects), '_redirects has no catch-all rewrite');
    const heroes = []; index.replace(/<link rel="preload" as="image" href="([^"]+)"/g, function(m, href){ let s = -1; try{ s = fs.statSync(path.join(DIR, href.replace(/^\//, '').split('?')[0])).size; }catch(e){} heroes.push({href: href, size: s}); return m; });
    ok(heroes.length > 0 && heroes.every(function(x){ return x.size > 0 && x.size <= 200 * 1024; }), 'hero preloads under 200 KB: ' + heroes.map(function(x){ return x.href + ' ' + Math.round(x.size / 1024) + ' KB'; }).join(', '));
  } finally {
    server.kill();
  }
  console.log(fails ? 'SEO FAILED: ' + fails + ' check(s)' : 'SEO OK: ' + routes.length + ' routes and the search assets');
  process.exit(fails ? 1 : 0);
})().catch(function(e){ console.error(e); process.exit(1); });

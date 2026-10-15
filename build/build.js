#!/usr/bin/env node
/* Imperial Holdings Group: build (brief section 4, docs/BUILD-CONTRACT.md 4.6).
   `npm run build` writes dist/, which Netlify publishes:
   - the site copied as it is (assets, shared, site.webmanifest, _redirects);
   - one HTML file per route, prerendered through the real app inside jsdom (build/prerender.js), written twice
     (about.html and about/index.html) so every static host serves /about;
   - robots.txt, sitemap.xml and journal/feed.xml (RSS 2.0 of journal entries and insights);
   - _headers from build/headers.template, with the sha256 of every inline script and the CSP origins GA4 and
     Turnstile need only when those keys are configured in data.js.
   Switches: LAUNCH=1 drops the pre-launch noindex (meta tag and X-Robots-Tag); BUILD_PREVIEW=1 sets data-preview on
   <html> so the app shows photographs that still lack recorded consent. See build/README.md. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const {createRenderer} = require('./prerender');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LAUNCH = process.env.LAUNCH === '1';
const PREVIEW = process.env.BUILD_PREVIEW === '1';
const HERO_LIMIT = 200 * 1024;
const TRACK = ['source', 'medium', 'campaign', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'ttclid', 'landing', 'referrer', 'page'];
const t0 = Date.now();

function readData(){
  const src = fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8');
  const sandbox = {window: {}};
  vm.runInNewContext(src, sandbox, {filename: 'data.js'});
  return sandbox.window.IHG;
}
function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'}[c]; }); }
function write(rel, text){
  const fp = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(fp), {recursive: true});
  fs.writeFileSync(fp, text);
}
function rfc822(d){ return new Date(d).toUTCString(); }
function fullDate(iso){ return /^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? iso : null; }

const D = readData();
const CFG = D.config || {};
const SITE = String(CFG.siteUrl || '').replace(/\/+$/, '');
if(!/^https?:\/\//.test(SITE)) throw new Error('config.siteUrl must be an absolute URL (assets/js/data.js)');
const abs = function(p){ return SITE + '/' + String(p).replace(/^\//, ''); };

/* 1. A clean dist with the static files. The Netlify functions are not copied: netlify.toml points at the repository. */
fs.rmSync(DIST, {recursive: true, force: true});
fs.mkdirSync(DIST, {recursive: true});
['assets', 'shared'].forEach(function(d){ if(fs.existsSync(path.join(ROOT, d))) fs.cpSync(path.join(ROOT, d), path.join(DIST, d), {recursive: true}); });
['site.webmanifest', '_redirects'].forEach(function(f){ if(fs.existsSync(path.join(ROOT, f))) fs.copyFileSync(path.join(ROOT, f), path.join(DIST, f)); });

/* 2. Prerender. */
const render = createRenderer({
  root: ROOT,
  indexPath: path.join(ROOT, 'index.html'),
  siteUrl: SITE,
  scripts: ['assets/js/data.js', 'shared/analytics.js', 'assets/js/app.js'].map(function(p){ return path.join(ROOT, p); })
});

/* The app leaves a few things in the DOM that belong to the browser session, not to a file on disk. */
function finish(page, opts){
  const doc = page.document, root = doc.documentElement, body = doc.body;
  root.setAttribute('data-prerendered', '');
  if(PREVIEW) root.setAttribute('data-preview', '');
  root.removeAttribute('class');                                  /* the inline head script adds hist and js again */
  Array.prototype.forEach.call(doc.querySelectorAll('base, script[data-ihg-analytics]'), function(el){ el.parentNode.removeChild(el); });
  body.classList.remove('unveil');                                /* veiled stays on the home page: the veil shows from first paint */
  if(!doc.getElementById('veil') && page.snapshot.veil){           /* the app removed the veil on a deep link: put the markup back */
    const hdr = doc.getElementById('hdr'); hdr.insertAdjacentHTML('beforebegin', page.snapshot.veil + '\n\n');
  }
  Array.prototype.forEach.call(doc.querySelectorAll('.clock'), function(el){ el.textContent = '--:--'; });
  const greet = doc.getElementById('greet'); if(greet) greet.textContent = '';
  Array.prototype.forEach.call(doc.querySelectorAll('input[type="hidden"]'), function(el){ if(TRACK.indexOf(el.name) > -1) el.value = ''; });
  if(CFG.searchConsole && !doc.querySelector('meta[name="google-site-verification"]')){
    const m = doc.createElement('meta'); m.setAttribute('name', 'google-site-verification'); m.setAttribute('content', CFG.searchConsole);
    const desc = doc.querySelector('meta[name="description"]'); desc.parentNode.insertBefore(m, desc.nextSibling);
  }
  if(LAUNCH) Array.prototype.forEach.call(doc.querySelectorAll('meta[name="robots"]'), function(el){ el.parentNode.removeChild(el); });
  const feed = doc.querySelector('link[rel="alternate"][type="application/rss+xml"]');
  if(feed) feed.setAttribute('href', abs('journal/feed.xml'));
  let html = page.serialize();
  /* Root-relative asset URLs, so a page served from /about/ or 404.html served anywhere resolves them without the
     base element the inline script adds. */
  html = html.replace(/(\s(?:src|href|srcset))="(assets|shared)\//g, '$1="/$2/').replace(/href="site\.webmanifest"/g, 'href="/site.webmanifest"');
  return html;
}

const home = render('/');
if(home.errors.length) throw new Error('home render failed:\n' + home.errors.join('\n'));
const routes = home.window.IHG_APP.routes();
home.close();

const pages = [], problems = [];
routes.forEach(function(route){
  const page = render(route);
  const out = page.window.IHG_APP.resolve(page.window.IHG_APP.parse());
  if(page.errors.length) problems.push(route + ': ' + page.errors.join(' | '));
  if(out.nf) problems.push(route + ': resolved to the not-found view');
  const html = finish(page, {});
  page.close();
  const title = (/<title>([\s\S]*?)<\/title>/.exec(html) || [])[1] || '';
  pages.push({route: route, title: title, bytes: Buffer.byteLength(html)});
  if(route === '/') write('index.html', html);
  else { write(route.slice(1) + '.html', html); write(route.slice(1) + '/index.html', html); }
});


/* 3. robots.txt and sitemap.xml. */
write('robots.txt', [
  LAUNCH ? '# Imperial Holdings Group' : '# Imperial Holdings Group. Pre-launch: the X-Robots-Tag header and the robots meta tag keep every page out of the index until the build runs with LAUNCH=1.',
  'User-agent: *',
  'Disallow: /.netlify/',
  'Allow: /',
  'Sitemap: ' + abs('sitemap.xml'),
  ''
].join('\n'));
write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schema/sitemap/0.9">\n' +
  routes.map(function(r){ return '  <url><loc>' + esc(r === '/' ? SITE + '/' : SITE + r) + '</loc></url>'; }).join('\n') + '\n</urlset>\n');

/* 4. RSS 2.0: journal entries first, then insights not already linked from the journal. Dates appear only where
   data.js records a full date; nothing is invented. */
const seen = {}, items = [];
(D.journal || []).forEach(function(j){
  const link = abs(j.to); if(seen[link]) return; seen[link] = true;
  items.push({title: j.title, link: link, desc: j.dek, cat: j.kind, date: fullDate(j.iso)});
});
(D.insights || []).forEach(function(a){
  const link = abs('insights/' + a.slug); if(seen[link]) return; seen[link] = true;
  items.push({title: a.title, link: link, desc: a.dek, cat: a.cat, date: fullDate(a.iso)});
});
write('journal/feed.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n' +
  '  <title>Imperial Holdings Group Journal</title>\n  <link>' + esc(abs('journal')) + '</link>\n' +
  '  <description>Company developments, insights, partnerships and selected Imperial events in Dubai and Lagos.</description>\n' +
  '  <language>en-GB</language>\n  <lastBuildDate>' + rfc822(t0) + '</lastBuildDate>\n' +
  '  <atom:link href="' + esc(abs('journal/feed.xml')) + '" rel="self" type="application/rss+xml"/>\n' +
  '  <image><url>' + esc(abs('assets/img/og.jpg')) + '</url><title>Imperial Holdings Group Journal</title><link>' + esc(abs('journal')) + '</link></image>\n' +
  items.map(function(i){
    return '  <item>\n    <title>' + esc(i.title) + '</title>\n    <link>' + esc(i.link) + '</link>\n    <guid isPermaLink="true">' + esc(i.link) + '</guid>\n' +
      '    <description>' + esc(i.desc) + '</description>\n    <category>' + esc(i.cat) + '</category>\n' + (i.date ? '    <pubDate>' + rfc822(i.date + 'T00:00:00Z') + '</pubDate>\n' : '') + '  </item>';
  }).join('\n') + '\n</channel>\n</rss>\n');

/* 5. _headers from the template: inline script hashes and the extra CSP origins. */
const distIndex = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const hashes = [];
distIndex.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, function(m, attrs, body){
  if(/\ssrc=/.test(attrs) || /type="application\/ld\+json"/.test(attrs) || !body.trim()) return m;
  hashes.push("'sha256-" + crypto.createHash('sha256').update(body, 'utf8').digest('base64') + "'");
  return m;
});
const ga4 = !!CFG.ga4, turnstile = !!CFG.turnstileSiteKey;
const fill = {
  robots: LAUNCH ? '' : '  X-Robots-Tag: noindex, nofollow\n',
  hashes: hashes.join(' '),
  script: (ga4 ? ' https://www.googletagmanager.com' : '') + (turnstile ? ' https://challenges.cloudflare.com' : ''),
  img: ga4 ? ' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com' : '',
  connect: ga4 ? ' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com' : '',
  frame: turnstile ? 'https://challenges.cloudflare.com' : "'none'"
};
const headers = fs.readFileSync(path.join(__dirname, 'headers.template'), 'utf8').replace(/\{\{(\w+)\}\}/g, function(m, k){ return k in fill ? fill[k] : m; });
if(/\{\{\w+\}\}/.test(headers)) problems.push('headers.template has an unknown token');
write('_headers', headers);

/* 6. Core Web Vitals guard: the hero preloads must stay under 200 KB each. */
const heroes = [];
distIndex.replace(/<link rel="preload" as="image" href="([^"]+)"/g, function(m, href){
  const fp = path.join(DIST, href.replace(/^\//, '').split('?')[0]);
  let size = -1; try{ size = fs.statSync(fp).size; }catch(e){}
  heroes.push({href: href, size: size});
  if(size < 0) problems.push('hero preload missing: ' + href);
  else if(size > HERO_LIMIT) problems.push('hero over 200 KB: ' + href + ' is ' + Math.round(size / 1024) + ' KB');
  return m;
});

/* 7. Report. */
const titles = {};
pages.forEach(function(p){ if(titles[p.title]) problems.push('duplicate title: ' + p.title + ' (' + titles[p.title] + ', ' + p.route + ')'); titles[p.title] = p.route; });
console.log('build: ' + pages.length + ' pages in ' + (Date.now() - t0) + ' ms, ' + (LAUNCH ? 'LAUNCH (indexable)' : 'pre-launch (noindex)') + (PREVIEW ? ', preview' : ''));
console.log('site: ' + SITE + ' | ga4: ' + (ga4 ? 'on' : 'off') + ' | turnstile: ' + (turnstile ? 'on' : 'off') + ' | search console: ' + (CFG.searchConsole ? 'on' : 'off') + ' | inline script hashes: ' + hashes.length);
console.log('hero: ' + heroes.map(function(h){ return h.href + ' ' + (h.size < 0 ? 'missing' : Math.round(h.size / 1024) + ' KB'); }).join(', '));
console.log('feed: ' + items.length + ' items | sitemap: ' + routes.length + ' urls');
pages.forEach(function(p){ console.log('  ' + p.route + '  ' + p.title + '  (' + Math.round(p.bytes / 1024) + ' KB)'); });
if(problems.length){ console.error('BUILD PROBLEMS:\n  ' + problems.join('\n  ')); process.exit(1); }

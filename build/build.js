#!/usr/bin/env node
/* Imperial Holdings Group: build (brief section 4, docs/BUILD-CONTRACT.md 4.6).
   `npm run build` writes dist/, which Netlify publishes:
   - the site copied as it is (assets, shared, site.webmanifest, _redirects);
   - one HTML file per route, prerendered through the real app inside jsdom (build/prerender.js), written twice
     (about.html and about/index.html) so every static host serves /about;
   - 404.html from the app's not-found view, never indexed;
   - error.html from the app's error view (V.error, "Something went wrong on our side", with the office contacts),
     for the host to serve on a server error, never indexed;
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

/* 1. A clean dist with the static files. The Netlify functions are not copied: netlify.toml points at the repository.
   shared/ is published without the three lead files: the functions get them through lib/config.js (static require,
   bundled by esbuild) and no page fetches them, so they never need a public URL. lead-routing.json lists every
   Pipedrive field key, option id, pipeline and owner id, and all three carry TO CONFIRM notes that would otherwise
   turn up in the built site. tokens.css, analytics.js, ecosystem.json and chrome/ stay public for the sister sites. */
const PRIVATE_SHARED = ['lead-routing.json', 'lead-schema.json'];   /* disposable-domains.json stays public: the page checks addresses against it */
fs.rmSync(DIST, {recursive: true, force: true});
fs.mkdirSync(DIST, {recursive: true});
fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), {recursive: true});
fs.cpSync(path.join(ROOT, 'shared'), path.join(DIST, 'shared'), {recursive: true, filter: function(src){ return PRIVATE_SHARED.indexOf(path.basename(src)) < 0; }});
['site.webmanifest', '_redirects'].forEach(function(f){ if(fs.existsSync(path.join(ROOT, f))) fs.copyFileSync(path.join(ROOT, f), path.join(DIST, f)); });

/* 1b. Minify the stylesheets and scripts in dist (brief acceptance test 6). The source tree stays readable and ES5;
   the dist copies are what the pages load, at the same paths and with the same ?v=5 query, so index.html, its inline
   script and the CSP hash do not change. esbuild's transform API, with target es5 for the scripts so the output uses
   no syntax newer than the source. The prerender below runs the source files, not these. */
const esbuild = require('esbuild');
const MINIFY = [['assets/css/site.css', 'css'], ['shared/tokens.css', 'css'], ['assets/js/data.js', 'js'], ['shared/analytics.js', 'js'], ['assets/js/app.js', 'js']];
const minified = [], minifyNotes = [];
MINIFY.forEach(function(m){
  const fp = path.join(DIST, m[0]), src = fs.readFileSync(fp, 'utf8');
  const out = esbuild.transformSync(src, m[1] === 'js' ? {loader: 'js', minify: true, target: 'es5', legalComments: 'none'} : {loader: 'css', minify: true, legalComments: 'none'});
  (out.warnings || []).forEach(function(w){ minifyNotes.push(m[0] + ': ' + w.text); });
  fs.writeFileSync(fp, out.code);
  minified.push(m[0] + ' ' + Math.round(src.length / 1024) + ' to ' + Math.round(out.code.length / 1024) + ' KB');
});

/* 2. Prerender. preview sets data-preview before the app runs, so the consent-gated photographs are in the markup. */
const render = createRenderer({
  root: ROOT,
  indexPath: path.join(ROOT, 'index.html'),
  siteUrl: SITE,
  scripts: ['assets/js/data.js', 'shared/analytics.js', 'assets/js/app.js'].map(function(p){ return path.join(ROOT, p); }),
  preview: PREVIEW
});

/* Hero preloads. index.html carries the home page's two lines (the desktop and mobile hero-alt); every other page
   renders its own hero, so the lines are replaced per page with the first hero image as the app drew it: the home
   picture element with its mobile source, the pageHero image (with a mobile source when the page gives one), or the
   not-found backdrop; pages without a hero image (privacy, terms) get none. A hero over HERO_LIMIT is not preloaded
   and is reported, so the build never commits a high priority fetch above the budget. */
function heroSources(doc){
  /* .ph is the pageHero section: the closing section further down also has a .ph-bg, and it must not be preloaded */
  const img = doc.querySelector('.hh .dusk img') || doc.querySelector('#app .ph > .ph-bg img') || doc.querySelector('.nf > .ph-bg img');
  if(!img || !img.getAttribute('src')) return [];
  const out = [{href: img.getAttribute('src'), media: ''}];
  const pic = img.closest('picture');
  if(pic){
    Array.prototype.forEach.call(pic.querySelectorAll('source[srcset]'), function(s){
      const media = s.getAttribute('media') || '', href = String(s.getAttribute('srcset')).split(',')[0].trim().split(/\s+/)[0];
      if(href && media) out.push({href: href, media: media});
    });
    const mob = out.find(function(x){ return /max-width:\s*(\d+)px/.test(x.media); });
    if(mob) out[0].media = '(min-width:' + (parseInt(/max-width:\s*(\d+)px/.exec(mob.media)[1], 10) + 1) + 'px)';
  }
  return out;
}
const preloadLog = [], oversize = [];
function setPreloads(doc, name){
  const old = Array.prototype.slice.call(doc.querySelectorAll('link[rel="preload"][as="image"]'));
  const anchor = old[0] || doc.querySelector('link[rel="preload"][as="font"]') || doc.querySelector('link[rel="stylesheet"]');
  const written = [];
  heroSources(doc).forEach(function(h){
    let size = -1; try{ size = fs.statSync(path.join(DIST, h.href.replace(/^\//, '').split('?')[0])).size; }catch(e){}
    const rec = {page: name, href: h.href, media: h.media, size: size};
    if(size > HERO_LIMIT){ oversize.push(rec); return; }
    const l = doc.createElement('link');
    l.setAttribute('rel', 'preload'); l.setAttribute('as', 'image'); l.setAttribute('href', h.href);
    if(h.media) l.setAttribute('media', h.media);
    l.setAttribute('fetchpriority', 'high');
    if(anchor) anchor.parentNode.insertBefore(l, anchor); else doc.head.appendChild(l);
    written.push(rec);
  });
  old.forEach(function(el){ el.parentNode.removeChild(el); });
  preloadLog.push({page: name, preloads: written});
}

/* The app leaves a few things in the DOM that belong to the browser session, not to a file on disk. */
function finish(page, opts){
  const doc = page.document, root = doc.documentElement, body = doc.body;
  root.setAttribute('data-prerendered', opts.route || '');   /* the route this file was built for: the app re-renders when the address names another */
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
  if(LAUNCH) Array.prototype.forEach.call(doc.querySelectorAll('meta[name="robots"]:not([data-draft])'), function(el){ el.parentNode.removeChild(el); });   /* a draft page keeps its own noindex */
  if(opts.notFound){
    Array.prototype.forEach.call(doc.querySelectorAll('meta[name="robots"], link[rel="canonical"]'), function(el){ el.parentNode.removeChild(el); });
    const m = doc.createElement('meta'); m.setAttribute('name', 'robots'); m.setAttribute('content', 'noindex, follow'); doc.head.appendChild(m);
  }
  const feed = doc.querySelector('link[rel="alternate"][type="application/rss+xml"]');
  if(feed) feed.setAttribute('href', abs('journal/feed.xml'));
  setPreloads(doc, opts.name || '');
  let html = page.serialize();
  /* Root-relative asset URLs, so a page served from /about/ or 404.html served anywhere resolves them without the
     base element the inline script adds. */
  html = html.replace(/(\s(?:src|href|srcset|data-src))="(assets|shared)\//g, '$1="/$2/').replace(/href="site\.webmanifest"/g, 'href="/site.webmanifest"');
  return html;
}

const home = render('/');
if(home.errors.length) throw new Error('home render failed:\n' + home.errors.join('\n'));
const routes = home.window.IHG_APP.routes();
const indexable = home.window.IHG_APP.routes({published: true});   /* without the drafts: the sitemap lists these */
home.close();

const pages = [], problems = [];
routes.forEach(function(route){
  const page = render(route);
  const out = page.window.IHG_APP.resolve(page.window.IHG_APP.parse());
  if(page.errors.length) problems.push(route + ': ' + page.errors.join(' | '));
  if(out.nf) problems.push(route + ': resolved to the not-found view');
  const html = finish(page, {name: route, route: route});
  page.close();
  const title = (/<title>([\s\S]*?)<\/title>/.exec(html) || [])[1] || '';
  pages.push({route: route, title: title, bytes: Buffer.byteLength(html)});
  if(route === '/') write('index.html', html);
  else { write(route.slice(1) + '.html', html); write(route.slice(1) + '/index.html', html); }
});

const nf = render('/this-page-does-not-exist');
if(nf.errors.length) problems.push('404: ' + nf.errors.join(' | '));
write('404.html', finish(nf, {notFound: true, name: '404.html', route: '/404'}));
nf.close();

/* error.html (brief section 8): rendered on a path the app does not know (so the intro veil stays off), then switched
   to the error view through the app's own showError(). Same treatment as 404.html: noindex, no canonical. */
const er = render('/error');
er.window.IHG_APP.showError();
if(er.errors.length) problems.push('error.html: ' + er.errors.join(' | '));
write('error.html', finish(er, {notFound: true, name: 'error.html', route: '/error'}));
er.close();

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
  indexable.map(function(r){ return '  <url><loc>' + esc(r === '/' ? SITE + '/' : SITE + r) + '</loc></url>'; }).join('\n') + '\n</urlset>\n');

/* 4. RSS 2.0: journal entries first, then insights not already linked from the journal. Dates appear only where
   data.js records a full date; nothing is invented. */
const seen = {}, items = [];
(D.journal || []).forEach(function(j){
  const link = abs(j.to); if(seen[link]) return; seen[link] = true;
  items.push({title: j.title, link: link, desc: j.dek, cat: j.kind, date: fullDate(j.iso)});
});
(D.insights || []).forEach(function(a){
  if(a.draft) return;   /* drafts awaiting approval are not syndicated */
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
/* Video players: only the providers with a real id get a frame-src origin, and a hosted loop file gets media-src. */
const videos = [];
function collectVideos(v){ if(v && typeof v === 'object'){ if(v.type === 'video') videos.push(v); else Object.keys(v).forEach(function(k){ collectVideos(v[k]); }); } }
collectVideos(D.video); collectVideos(D.events); collectVideos(D.journal);
const playerHosts = {vimeo: 'https://player.vimeo.com', mux: 'https://player.mux.com'};
const frameSrc = [], mediaSrc = [];
videos.forEach(function(v){
  const host = v.id ? playerHosts[v.provider || 'vimeo'] : '';
  if(host && frameSrc.indexOf(host) < 0) frameSrc.push(host);
  const m = /^(https:\/\/[^/]+)\//.exec(String(v.src || ''));
  if(m && mediaSrc.indexOf(m[1]) < 0) mediaSrc.push(m[1]);
});
if(turnstile) frameSrc.unshift('https://challenges.cloudflare.com');
const fill = {
  robots: LAUNCH ? '' : '  X-Robots-Tag: noindex, nofollow\n',
  hashes: hashes.join(' '),
  script: (ga4 ? ' https://www.googletagmanager.com' : '') + (turnstile ? ' https://challenges.cloudflare.com' : ''),
  img: ga4 ? ' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com' : '',
  connect: ga4 ? ' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com' : '',
  frame: frameSrc.length ? frameSrc.join(' ') : "'none'",
  media: mediaSrc.length ? ' ' + mediaSrc.join(' ') : ''
};
const headers = fs.readFileSync(path.join(__dirname, 'headers.template'), 'utf8').replace(/\{\{(\w+)\}\}/g, function(m, k){ return k in fill ? fill[k] : m; });
if(/\{\{\w+\}\}/.test(headers)) problems.push('headers.template has an unknown token');
write('_headers', headers);

/* 6. Core Web Vitals guard, over every written page: each hero preload must point at a file that exists and stays
   under 200 KB, and the home page must carry its two lines (desktop and mobile). A hero the build left out because
   it is over the limit is listed in the report so the photograph can be re-exported (shot list rule, under 200 KB). */
const heroes = {};
preloadLog.forEach(function(p){
  p.preloads.forEach(function(h){
    if(h.size < 0) problems.push('hero preload missing: ' + h.href + ' on ' + h.page);
    else if(h.size > HERO_LIMIT) problems.push('hero over 200 KB: ' + h.href + ' is ' + Math.round(h.size / 1024) + ' KB on ' + h.page);
    heroes[h.href] = h.size;
  });
  if(p.page === '/' && p.preloads.length !== 2) problems.push('home page: expected a desktop and a mobile hero preload, got ' + p.preloads.length);
});
const big = {};
oversize.forEach(function(h){ (big[h.href] = big[h.href] || {size: h.size, pages: []}).pages.push(h.page); });

/* 7. Report. */
const titles = {};
pages.forEach(function(p){ if(titles[p.title]) problems.push('duplicate title: ' + p.title + ' (' + titles[p.title] + ', ' + p.route + ')'); titles[p.title] = p.route; });
console.log('build: ' + pages.length + ' pages + 404.html and error.html in ' + (Date.now() - t0) + ' ms, ' + (LAUNCH ? 'LAUNCH (indexable)' : 'pre-launch (noindex)') + (PREVIEW ? ', preview' : ''));
console.log('site: ' + SITE + ' | ga4: ' + (ga4 ? 'on' : 'off') + ' | turnstile: ' + (turnstile ? 'on' : 'off') + ' | search console: ' + (CFG.searchConsole ? 'on' : 'off') + ' | inline script hashes: ' + hashes.length + ' | frame-src: ' + fill.frame + (fill.media ? ' | media-src:' + fill.media : ''));
console.log('minified: ' + minified.join(', ') + (minifyNotes.length ? ' | esbuild warnings: ' + minifyNotes.join('; ') : ''));
console.log('hero preloads: ' + Object.keys(heroes).map(function(h){ return h + ' ' + (heroes[h] < 0 ? 'missing' : Math.round(heroes[h] / 1024) + ' KB'); }).join(', '));
if(Object.keys(big).length) console.log('WARNING hero over 200 KB, not preloaded (re-export under 200 KB, see docs/PHOTO-SHOT-LIST.md): ' + Object.keys(big).map(function(h){ return h + ' ' + Math.round(big[h].size / 1024) + ' KB on ' + big[h].pages.join(', '); }).join('; '));
console.log('feed: ' + items.length + ' items | sitemap: ' + indexable.length + ' urls' + (routes.length > indexable.length ? ' (' + (routes.length - indexable.length) + ' draft pages prerendered, noindex, not listed)' : ''));
pages.forEach(function(p){ console.log('  ' + p.route + '  ' + p.title + '  (' + Math.round(p.bytes / 1024) + ' KB)'); });
if(problems.length){ console.error('BUILD PROBLEMS:\n  ' + problems.join('\n  ')); process.exit(1); }

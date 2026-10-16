/* SEO build check (brief acceptance test 5, docs/BUILD-CONTRACT.md 4.6). Starts the test server on dist/, fetches
   every route and asserts: 200, prerendered (data-prerendered naming the route), exactly one title, description and
   canonical, titles within 60 and descriptions within 160 characters, the JPEG card as the first og:image with its
   size, unique titles and descriptions across pages, valid JSON-LD of the expected types (an Event block only where
   the event has a full date, and then with startDate and location.address), every hero file the page references (the
   home figures, the page hero or the not-found backdrop, with their mobile sources) present and under 200 KB, with a
   mobile source on the division pages; robots.txt and sitemap.xml answer 200 and the sitemap lists every route; the
   RSS feed exists; 404.html and error.html are noindex, without a canonical, and carry the office contacts (error.html
   also the reload button); every logo file named in shared/ecosystem.json is in the build; _headers holds the inline
   script hashes; the page's image preloads are its own hero and under 200 KB; dist/shared holds no lead JSON file;
   event galleries are in the markup on a preview build only.
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
const PREVIEW = process.env.BUILD_PREVIEW === '1';

const sandbox = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8'), sandbox, {filename: 'data.js'});
const D = sandbox.window.IHG, SITE = String(D.config.siteUrl).replace(/\/+$/, '');
/* Insights (v6 fix, decision 9): while every article is a draft, /insights and the articles are built only on the
   preview build; production leaves them out of the build, the sitemap, the feed and every link (checked below). */
const insightsLive = PREVIEW || D.insights.some(function(a){ return !a.draft; });
const insightRoutes = ['/insights'].concat(D.insights.map(function(a){ return '/insights/' + a.slug; }));
const routes = ['/', '/about', '/divisions'].concat(D.divisions.map(function(d){ return '/divisions/' + d.key; }), ['/journal'],
  D.events.map(function(e){ return '/journal/events/' + e.slug; }), insightsLive ? insightRoutes : [], ['/contact', '/privacy', '/terms']);
/* Drafts (insights with draft:true): prerendered and reachable, but noindex on every build (LAUNCH included) and
   absent from the sitemap and the feed until the copy is approved. */
const drafts = D.insights.filter(function(a){ return a.draft; }).map(function(a){ return '/insights/' + a.slug; });
/* while every article is a draft the listing follows them (noindex, out of the sitemap) */
if(D.insights.length && D.insights.every(function(a){ return a.draft; })) drafts.push('/insights');
const listed = routes.filter(function(r){ return drafts.indexOf(r) < 0; });

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

/* Hero preloads. The first hero image as the page renders it (the home picture in figure.dusk, the pageHero image in
   the .ph section, or the not-found backdrop), with its mobile source when the markup gives one, is what the build
   must preload: nothing else, and nothing over 200 KB (an oversize hero is left out and reported, not preloaded).
   Derived here from the markup, independently of build/build.js. */
const HERO_LIMIT = 200 * 1024;
function fileSize(href){ try{ return fs.statSync(path.join(DIR, href.replace(/^\//, '').split('?')[0])).size; }catch(e){ return -1; } }
function heroImages(html){
  const body = html.slice(html.indexOf('<body'));
  const m = /<figure class="dusk">|<section class="(?:ph|nf)(?:\s[^"]*)?"><div class="ph-bg"/.exec(body);
  if(!m) return [];
  const rest = body.slice(m.index);
  const img = /<img[^>]*>/.exec(rest); if(!img) return [];
  const src = attr(img[0], /\ssrc="([^"]+)"/); if(!src) return [];
  const out = [{href: src, media: ''}];
  rest.slice(0, img.index).replace(/<source media="([^"]+)" srcset="([^"]+)"/g, function(mm, media, srcset){ out.push({href: srcset.split(',')[0].trim().split(/\s+/)[0], media: media}); return mm; });
  const mob = out.filter(function(x){ return /max-width:\s*(\d+)px/.test(x.media); })[0];
  if(mob) out[0].media = '(min-width:' + (parseInt(/max-width:\s*(\d+)px/.exec(mob.media)[1], 10) + 1) + 'px)';
  return out.map(function(x){ x.size = fileSize(x.href); return x; });
}
/* Every hero file a page references, for the 200 KB rule (brief section 4, build contract 4.6): the home figures
   (dusk, and night on a preview build), the pageHero or not-found backdrop (the first .ph-bg of the page; the closing
   section further down is not a hero), each with its mobile source. */
function heroFiles(html){
  const body = html.slice(html.indexOf('<body')), segs = [], out = [];
  body.replace(/<figure class="(?:dusk|night)">([\s\S]*?)<\/figure>/g, function(m, s){ segs.push(s); return m; });
  const ph = /<section class="(?:ph|nf)(?:\s[^"]*)?"><div class="ph-bg">([\s\S]*?)<\/div><\/div>/.exec(body);
  if(ph) segs.push(ph[1]);
  segs.forEach(function(s){ s.replace(/\s(?:src|srcset)="([^"\s]+)[^"]*"/g, function(m, f){ if(out.indexOf(f) < 0) out.push(f); return m; }); });
  return out.map(function(f){ return {href: f, size: fileSize(f)}; });
}
function heroFileProblems(html, label){
  const problems = [];
  heroFiles(html).forEach(function(x){
    if(x.size < 0) problems.push('hero file missing: ' + x.href);
    else if(x.size > HERO_LIMIT){ problems.push('hero file over 200 KB: ' + x.href + ' ' + Math.round(x.size / 1024) + ' KB'); (oversize[x.href] = oversize[x.href] || []).push(label); }
  });
  return problems;
}
function key(x){ return x.href + (x.media ? ' ' + x.media : ''); }
function expectedPreloads(html){ return heroImages(html).filter(function(x){ return x.size >= 0 && x.size <= HERO_LIMIT; }).map(key); }
function actualPreloads(html){
  const out = [];
  html.slice(0, html.indexOf('<body')).replace(/<link rel="preload" as="image" href="([^"]+)"(?: media="([^"]+)")?/g, function(m, href, media){ out.push(key({href: href, media: media || ''})); return m; });
  return out;
}
const oversize = {};
function preloadProblems(html, label){
  const want = expectedPreloads(html), got = actualPreloads(html), problems = [];
  if(got.join(' | ') !== want.join(' | ')) problems.push('preloads [' + got.join(', ') + '] expected [' + want.join(', ') + ']');
  got.forEach(function(k){ const s = fileSize(k.split(' ')[0]); if(s < 0 || s > HERO_LIMIT) problems.push('preload ' + k + ' is ' + (s < 0 ? 'missing' : Math.round(s / 1024) + ' KB')); });
  heroImages(html).forEach(function(x){ if(x.size > HERO_LIMIT) (oversize[x.href] = oversize[x.href] || []).push(label); });
  return problems;
}

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
    const titles = {}, descs = {}, insightLinks = [];
    for(const route of routes){
      const r = await get(BASE + route);
      const h = r.body, label = route.padEnd(44);
      const title = attr(h, /<title>([\s\S]*?)<\/title>/), desc = attr(h, /<meta name="description" content="([^"]*)"/), can = attr(h, /<link rel="canonical" href="([^"]*)"/);
      const ogImg = attr(h, /<meta property="og:image" content="([^"]*)"/), blocks = ldBlocks(h), ty = types(blocks);
      const expectCanonical = route === '/' ? SITE + '/' : SITE + route;
      const problems = [];
      if(r.status !== 200) problems.push('status ' + r.status);
      if(!insightsLive && /href="\/insights(?:[\/?"#])/.test(h)) insightLinks.push(route);
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
      if(drafts.indexOf(route) > -1){ const dm = /<meta name="robots"[^>]*\sdata-draft[^>]*>/.exec(h); if(!dm || !/content="noindex/.test(dm[0])) problems.push('draft page without its noindex tag'); }
      else if(LAUNCH ? /<meta name="robots"/.test(h) : !/<meta name="robots" content="noindex/.test(h)) problems.push(LAUNCH ? 'noindex present after launch' : 'pre-launch noindex missing');
      if(drafts.indexOf(route) > -1 && !/Draft, awaiting approval/.test(h)) problems.push('draft page not labelled');
      if(/\bSample\b/.test(h.replace(/<script[\s\S]*?<\/script>/g, ''))) problems.push('"Sample" wording remains');
      if(ty.indexOf('INVALID') > -1) problems.push('invalid JSON-LD');
      if(ty.indexOf('Organization') < 0) problems.push('no Organization');
      if(route !== '/' && ty.indexOf('BreadcrumbList') < 0) problems.push('no BreadcrumbList');
      if(route === '/contact' && (ty.indexOf('FAQPage') < 0 || ty.filter(function(t){ return t === 'LocalBusiness'; }).length !== D.contact.offices.length)) problems.push('contact: FAQPage + one LocalBusiness per office expected, got ' + ty.join(','));
      if(/^\/insights\/./.test(route) && ty.indexOf('Article') < 0) problems.push('no Article');
      /* Event markup only where it can be valid: Google requires name, startDate and location, and no date is invented */
      if(/^\/journal\/events\/./.test(route)){
        const ev = D.events.find(function(e){ return '/journal/events/' + e.slug === route; }), dated = /^\d{4}-\d{2}-\d{2}$/.test((ev && ev.iso) || '');
        if(dated && ty.indexOf('Event') < 0) problems.push('no Event (the event has a full date)');
        if(!dated && ty.indexOf('Event') > -1) problems.push('Event block on an event without a known date');
      }
      blocks.filter(function(b){ return b['@type'] === 'Event'; }).forEach(function(b){ if(!b.name || !/^\d{4}-\d{2}-\d{2}/.test(b.startDate || '') || !b.location || !b.location.address) problems.push('Event block lacks name, startDate or location.address'); });
      /* sized for a search result */
      if((title || '').length > 60) problems.push('title over 60 characters (' + title.length + ')');
      if((desc || '').length > 160) problems.push('description over 160 characters (' + desc.length + ')');
      /* social image: the JPEG card first (WhatsApp and LinkedIn), with its size */
      if(!/\/assets\/img\/og\.jpg$/.test(ogImg || '')) problems.push('first og:image is not the JPEG card: ' + ogImg);
      if(!/<meta property="og:image:width" content="1200">/.test(h) || !/<meta property="og:image:height" content="630">/.test(h)) problems.push('og:image:width or og:image:height missing');
      /* the served file names its route, so the app can tell when an old #/ link lands it on the wrong page */
      if(!new RegExp('<html[^>]*\\sdata-prerendered="' + route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"').test(h)) problems.push('data-prerendered does not name the route');
      /* page hero: every file it references under 200 KB, and a mobile source on the division pages */
      const heroSeg = (/<div class="ph-bg">([\s\S]*?)<\/div><\/div>/.exec(h) || [])[1] || '';
      if(route !== '/' && !heroFiles(h).length && !/<div class="ph-ink/.test(h) && !/^\/(privacy|terms)$/.test(route)) problems.push('no hero image or ink field');
      heroFileProblems(h, route).forEach(function(p){ problems.push(p); });
      if(/^\/divisions/.test(route) && heroSeg && !/<source media="\(max-width:640px\)" srcset="[^"]+-m\.webp"/.test(heroSeg)) problems.push('no mobile hero source');
      if(titles[title]) problems.push('title also on ' + titles[title]); titles[title] = route;
      if(descs[desc]) problems.push('description also on ' + descs[desc]); descs[desc] = route;
      preloadProblems(h, route).forEach(function(p){ problems.push(p); });
      /* consent gating in the markup: an event's photographs are prerendered on a preview build (or once the event
         records consent) and absent otherwise, with the matching gallery note */
      if(/^\/journal\/events\//.test(route)){
        const ev = D.events.filter(function(e){ return '/journal/events/' + e.slug === route; })[0] || {};
        const show = PREVIEW || !!ev.consent, has = h.indexOf('/assets/img/events/' + ev.slug + '/01.webp') > -1;
        if(ev.n > 0 && has !== show) problems.push('gallery photographs ' + (has ? 'present' : 'absent') + ' on a ' + (PREVIEW ? 'preview' : 'production') + ' build');
        if(show && !ev.consent && h.indexOf('Preview build: photographs of guests are shown before their consent is recorded.') < 0) problems.push('preview gallery note missing');
        if(!show && h.indexOf('Photographs will appear once guests have confirmed') < 0) problems.push('consent gallery note missing');
      }
      ok(!problems.length, label + (title || '').slice(0, 60), problems.join('; '));
    }
    /* Insights while every article is a draft: no file in a production build, and no page links to one */
    if(!insightsLive){
      const files = insightRoutes.filter(function(r){ return fs.existsSync(path.join(DIR, r.slice(1) + '.html')) || fs.existsSync(path.join(DIR, r.slice(1), 'index.html')); });
      ok(!files.length && !insightLinks.length, 'production build: /insights and the ' + D.insights.length + ' draft articles are left out (no file, no link)', (files.length ? 'built: ' + files.join(',') : '') + (insightLinks.length ? ' linked from: ' + insightLinks.join(',') : ''));
    }
    /* search assets */
    const robots = await get(BASE + '/robots.txt');
    ok(robots.status === 200 && robots.body.indexOf('Sitemap: ' + SITE + '/sitemap.xml') > -1 && /Disallow: \/\.netlify\//.test(robots.body), 'robots.txt', 'status ' + robots.status);
    const sm = await get(BASE + '/sitemap.xml');
    const locs = []; sm.body.replace(/<loc>([^<]+)<\/loc>/g, function(m, l){ locs.push(l); return m; });
    const want = listed.map(function(r){ return r === '/' ? SITE + '/' : SITE + r; });
    const missing = want.filter(function(u){ return locs.indexOf(u) < 0; }), extra = locs.filter(function(u){ return want.indexOf(u) < 0; });
    ok(sm.status === 200 && !missing.length && !extra.length, 'sitemap.xml lists every published route (' + locs.length + ', ' + drafts.length + ' drafts left out)', (missing.length ? 'missing ' + missing.join(',') : '') + (extra.length ? ' extra ' + extra.join(',') : ''));
    const feed = await get(BASE + '/journal/feed.xml');
    const links = []; feed.body.replace(/<item>[\s\S]*?<link>([^<]+)<\/link>/g, function(m, l){ links.push(l); return m; });
    const draftItems = links.filter(function(l){ return drafts.indexOf(l.replace(SITE, '')) > -1; });
    ok(feed.status === 200 && /<rss version="2.0"/.test(feed.body) && links.length > 0 && links.every(function(l){ return l.indexOf(SITE + '/') === 0; }) && !draftItems.length, 'journal/feed.xml (' + links.length + ' items, absolute links, no drafts)', 'status ' + feed.status + (draftItems.length ? ' drafts in feed: ' + draftItems.join(',') : ''));
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
    /* hero preloads: the home page carries its desktop and mobile hero; 404.html and error.html their backdrop */
    const homePre = actualPreloads(index);
    ok(homePre.length === 2 && homePre.some(function(k){ return /max-width/.test(k); }) && homePre.some(function(k){ return /min-width/.test(k); }) && !preloadProblems(index, '/').length, 'home page preloads its own desktop and mobile hero: ' + homePre.join(', '));
    ['404.html', 'error.html'].forEach(function(f){
      const h = fs.readFileSync(path.join(DIR, f), 'utf8'), p = preloadProblems(h, f).concat(heroFileProblems(h, f));
      ok(!p.length && actualPreloads(h).length === expectedPreloads(h).length, f + ' preloads its own backdrop only (none on the ink field)', p.join('; ') || actualPreloads(h).join(', '));
    });
    /* the 200 KB rule over every hero file any page references (home figures, page heroes, backdrops, mobile sources) */
    const big = Object.keys(oversize);
    ok(!big.length, 'every hero file referenced by a page is under 200 KB', big.map(function(h){ return h + ' ' + Math.round(fileSize(h) / 1024) + ' KB on ' + oversize[h].join(', '); }).join('; '));
    /* the lead config never reaches the public site: dist/shared holds the public files only */
    const shared = fs.existsSync(path.join(DIR, 'shared')) ? fs.readdirSync(path.join(DIR, 'shared')) : [];
    const privateLeft = shared.filter(function(f){ return /^(lead-routing|lead-schema)\.json$/.test(f); });
    const publicMissing = ['tokens.css', 'analytics.js', 'ecosystem.json', 'chrome'].filter(function(f){ return shared.indexOf(f) < 0; });
    const routingHttp = await get(BASE + '/shared/lead-routing.json');
    ok(!privateLeft.length && !publicMissing.length && routingHttp.status === 404, 'dist/shared: no lead JSON published (' + shared.join(', ') + ')', (privateLeft.length ? 'published ' + privateLeft.join(',') : '') + (publicMissing.length ? ' missing ' + publicMissing.join(',') : '') + ' /shared/lead-routing.json status ' + routingHttp.status);
  } finally {
    server.kill();
  }
  console.log(fails ? 'SEO FAILED: ' + fails + ' check(s)' : 'SEO OK: ' + routes.length + ' routes and the search assets');
  process.exit(fails ? 1 : 0);
})().catch(function(e){ console.error(e); process.exit(1); });

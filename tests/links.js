#!/usr/bin/env node
/* Link and asset check on a built site (v6 deliverable 8, docs/LAUNCH-READINESS.md). Reads every HTML file in dist/
   with jsdom (no server, no network) and checks, the way a static host with clean URLs resolves them:
   * every internal href, src, srcset, poster, preload and icon link points at a file that exists (path, path.html or
     path/index.html), with the query string ignored;
   * every fragment (#id) on an internal link, and every same-page fragment, names an element id on the target page;
   * every url() in the built stylesheets, every icon in site.webmanifest and every <loc> in sitemap.xml and <link> in
     journal/feed.xml resolves (absolute URLs on config.siteUrl are read as root-relative);
   * every logo file named in shared/ecosystem.json exists.
   It also counts, without failing on them: placeholder links (href="#", the To confirm links for sites with no
   address yet), old hash routes (href starting "#/"), mailto: and tel: links, and lists every external URL with the
   pages that carry it, so they can be opened from a normal connection.
   Usage: node tests/links.js [distDir] [--json out.json]. Exit 1 on any broken internal link, anchor or asset. */
'use strict';
var fs = require('fs'), path = require('path');
var JSDOM = require('jsdom').JSDOM;

var args = process.argv.slice(2);
var jsonOut = args.indexOf('--json') > -1 ? args[args.indexOf('--json') + 1] : '';
var DIST = path.resolve(args.filter(function(a, i){ return a !== '--json' && args[i - 1] !== '--json'; })[0] || path.join(__dirname, '..', 'dist'));

var SITE = '';
try{ var sm = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8').match(/<loc>(https?:\/\/[^/<]+)/); if(sm) SITE = sm[1]; }catch(e){}

function walk(d, out){ fs.readdirSync(d).forEach(function(n){ var p = path.join(d, n); if(fs.statSync(p).isDirectory()) walk(p, out); else out.push(p); }); return out; }
var files = walk(DIST, []);
/* shared/chrome holds the header and footer templates for the sister sites: their {{TOKENS}} are filled there, not here */
var htmlFiles = files.filter(function(f){ return /\.html$/.test(f) && path.relative(DIST, f).split(path.sep).join('/').indexOf('shared/chrome/') !== 0; });
var templates = files.filter(function(f){ return /\.html$/.test(f) && htmlFiles.indexOf(f) < 0; }).length;

/* page path for a file: dist/about.html and dist/about/index.html are both /about */
function pageOf(f){ var r = '/' + path.relative(DIST, f).split(path.sep).join('/'); r = r.replace(/\/index\.html$/, '/').replace(/\.html$/, ''); return r === '' ? '/' : r; }
/* resolve a root-relative path to a file the host would serve */
function resolveFile(p){
  p = decodeURIComponent(p.split('#')[0].split('?')[0]);
  var fp = path.join(DIST, p), cands = [fp, fp + '.html', path.join(fp, 'index.html')];
  for(var i = 0; i < cands.length; i++){ try{ if(fs.statSync(cands[i]).isFile()) return cands[i]; }catch(e){} }
  return null;
}
var idCache = {};
function idsOf(file){
  if(idCache[file]) return idCache[file];
  var html = fs.readFileSync(file, 'utf8'), ids = {};
  html.replace(/\sid="([^"]+)"/g, function(m, id){ ids[id] = true; return m; });
  html.replace(/\sname="([^"]+)"/g, function(m, id){ ids[id] = true; return m; });
  return (idCache[file] = ids);
}

var broken = [], placeholders = [], hashRoutes = [], external = {}, mail = {}, tel = {}, checked = 0, anchorsChecked = 0;
function note(map, url, page){ (map[url] = map[url] || {}); map[url][page] = true; }
function checkRef(raw, page, file, kind){
  if(!raw) return;
  var u = raw.trim();
  if(u === '#'){ placeholders.push({page: page, kind: kind}); return; }
  if(/^#\//.test(u)){ hashRoutes.push({page: page, href: u}); return; }
  if(/^mailto:/i.test(u)){ note(mail, u.split('?')[0] === 'mailto:' ? 'mailto: (share by email, no address)' : u.split('?')[0], page); return; }
  if(/^tel:/i.test(u)){ note(tel, u, page); return; }
  if(/^(data:|javascript:|blob:)/i.test(u)) return;
  if(SITE && u.indexOf(SITE) === 0) u = u.slice(SITE.length) || '/';
  if(/^(https?:)?\/\//i.test(u)){ note(external, u, page); return; }
  checked++;
  var target, frag = u.indexOf('#') > -1 ? u.slice(u.indexOf('#') + 1) : '';
  if(u.charAt(0) === '#'){ target = file; }
  else {
    var abs = u.charAt(0) === '/' ? u : path.posix.join(path.posix.dirname(page.replace(/\/$/, '/x')), u);
    target = resolveFile(abs);
    if(!target){ broken.push({page: page, kind: kind, url: raw, why: 'no file'}); return; }
  }
  if(frag && /\.html$/.test(target)){
    anchorsChecked++;
    if(!idsOf(target)[decodeURIComponent(frag)]) broken.push({page: page, kind: kind, url: raw, why: 'no element with id "' + frag + '"'});
  }
}

htmlFiles.forEach(function(f){
  var page = path.relative(DIST, f).split(path.sep).join('/');
  var doc = new JSDOM(fs.readFileSync(f, 'utf8')).window.document;
  doc.querySelectorAll('a[href], area[href]').forEach(function(a){ checkRef(a.getAttribute('href'), page, f, 'a'); });
  doc.querySelectorAll('link[href]').forEach(function(l){
    var rel = (l.getAttribute('rel') || '').toLowerCase();
    if(/canonical|alternate/.test(rel)){ var h = l.getAttribute('href'); if(SITE && h.indexOf(SITE) === 0) checkRef(h, page, f, 'link ' + rel); return; }
    if(/preconnect|dns-prefetch/.test(rel)) return;
    checkRef(l.getAttribute('href'), page, f, 'link ' + rel);
  });
  doc.querySelectorAll('[src]').forEach(function(e){ checkRef(e.getAttribute('src'), page, f, e.tagName.toLowerCase() + ' src'); });
  doc.querySelectorAll('[poster]').forEach(function(e){ checkRef(e.getAttribute('poster'), page, f, 'poster'); });
  doc.querySelectorAll('[srcset], [imagesrcset]').forEach(function(e){
    (e.getAttribute('srcset') || e.getAttribute('imagesrcset')).split(',').forEach(function(s){ checkRef(s.trim().split(/\s+/)[0], page, f, 'srcset'); });
  });
  doc.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(function(m){ checkRef(m.getAttribute('content'), page, f, 'meta ' + (m.getAttribute('property') || m.getAttribute('name'))); });
  doc.querySelectorAll('[style*="url("]').forEach(function(e){ e.getAttribute('style').replace(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g, function(m, u){ checkRef(u, page, f, 'inline style url()'); return m; }); });
});

/* stylesheets */
files.filter(function(f){ return /\.css$/.test(f); }).forEach(function(f){
  var css = fs.readFileSync(f, 'utf8'), rel = '/' + path.relative(DIST, f).split(path.sep).join('/');
  css.replace(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g, function(m, u){
    if(/^(data:|#)/.test(u)) return m;
    checkRef(u.charAt(0) === '/' || /^https?:/.test(u) ? u : path.posix.join(path.posix.dirname(rel), u), rel, f, 'css url()'); return m;
  });
});
/* manifest */
try{ var man = JSON.parse(fs.readFileSync(path.join(DIST, 'site.webmanifest'), 'utf8')); (man.icons || []).forEach(function(i){ checkRef(i.src.charAt(0) === '/' ? i.src : '/' + i.src, 'site.webmanifest', null, 'manifest icon'); }); if(man.start_url) checkRef(man.start_url, 'site.webmanifest', null, 'manifest start_url'); }catch(e){ broken.push({page: 'site.webmanifest', kind: 'parse', url: '', why: e.message}); }
/* sitemap and feed */
var sitemapCount = 0, feedCount = 0;
try{ fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8').replace(/<loc>([^<]+)<\/loc>/g, function(m, u){ sitemapCount++; checkRef(u, 'sitemap.xml', null, 'sitemap loc'); return m; }); }catch(e){ broken.push({page: 'sitemap.xml', kind: 'missing', url: '', why: e.message}); }
try{ fs.readFileSync(path.join(DIST, 'journal', 'feed.xml'), 'utf8').replace(/<link>([^<]+)<\/link>/g, function(m, u){ feedCount++; checkRef(u, 'journal/feed.xml', null, 'feed link'); return m; }); }catch(e){}
/* ecosystem logos */
try{ var eco = fs.readFileSync(path.join(DIST, 'shared', 'ecosystem.json'), 'utf8'); eco.replace(/"([^"]+\.(?:svg|png|webp|jpg))"/g, function(m, u){ if(/^https?:/.test(u)) note(external, u, 'shared/ecosystem.json'); else checkRef(u.charAt(0) === '/' ? u : '/assets/logos/' + u, 'shared/ecosystem.json', null, 'ecosystem logo'); return m; }); eco.replace(/"(https?:\/\/[^"]+)"/g, function(m, u){ if(!SITE || u.indexOf(SITE) !== 0) note(external, u, 'shared/ecosystem.json'); return m; }); }catch(e){}

var perPage = {}; placeholders.forEach(function(p){ perPage[p.page] = (perPage[p.page] || 0) + 1; });
var report = {
  dist: DIST, site: SITE, html_files: htmlFiles.length, templates_skipped: templates, internal_refs_checked: checked, anchors_checked: anchorsChecked,
  sitemap_urls: sitemapCount, feed_links: feedCount, broken: broken,
  placeholder_links: placeholders.length, placeholder_links_per_file: perPage, hash_routes: hashRoutes,
  external: Object.keys(external).sort().map(function(u){ return {url: u, pages: Object.keys(external[u]).length}; }),
  mailto: Object.keys(mail).sort(), tel: Object.keys(tel).sort()
};
if(jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2));
console.log('links: ' + htmlFiles.length + ' html files (' + templates + ' sister-site templates in shared/chrome skipped), ' + checked + ' internal references and ' + anchorsChecked + ' anchors checked, sitemap ' + sitemapCount + ', feed ' + feedCount);
console.log('placeholder links (href="#"): ' + placeholders.length + ' | old hash routes: ' + hashRoutes.length + ' | external URLs: ' + report.external.length + ' | mailto: ' + report.mailto.length + ' | tel: ' + report.tel.length);
report.external.forEach(function(e){ console.log('  external  ' + e.url + '  (' + e.pages + ' files)'); });
report.mailto.concat(report.tel).forEach(function(u){ console.log('  contact   ' + u); });
hashRoutes.forEach(function(h){ console.log('  hash route  ' + h.page + '  ' + h.href); });
broken.forEach(function(b){ console.log('BROKEN  ' + b.page + '  ' + b.kind + '  ' + b.url + '  (' + b.why + ')'); });
console.log(broken.length ? 'LINKS FAILED: ' + broken.length + ' broken' : 'LINKS OK: 0 broken');
process.exit(broken.length ? 1 : 0);

/* Colour contrast check (brief section 8 and acceptance test 9.7: text at least 4.5:1).
   Reads the colour tokens from shared/tokens.css and assets/css/site.css (every :root block in that order, including
   the override block inside a media query, later values win; comments are stripped first) and computes the WCAG
   contrast of each text colour against the backgrounds it is used on: the dark sections (ink, ink-2, ink-3, the
   mega menu and the search palette), the light sections (paper, paper-2) and the white cards. Translucent tokens
   are blended over each background first. Body and small text must reach 4.5:1; headline text (24px and up, or
   19px bold) and icons must reach 3:1. A failing pair prints the smallest change that would pass, so the fix is
   a one value edit. The pairs below describe where site.css uses each colour; add a pair when a new colour lands.
   Usage: node tests/contrast.js (or npm run test:contrast); exit 1 on any failure. No dependencies. */
'use strict';
var fs = require('fs'), path = require('path');
var FILES = ['shared/tokens.css', 'assets/css/site.css'];
var css = FILES.map(function(f){ return fs.readFileSync(path.join(__dirname, '..', f), 'utf8'); }).join('\n');
css = css.replace(/\/\*[\s\S]*?\*\//g, ''); /* a comment inside a :root block would otherwise swallow the token after it */

/* tokens: every :root{...} block in order (tokens.css first, then any override in site.css), later values win */
var tokens = {};
css.replace(/:root\s*\{([^}]*)\}/g, function(m, body){
  body.split(';').forEach(function(d){ var i = d.indexOf(':'); if(i < 0) return; var k = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); if(/^--/.test(k)) tokens[k] = v; });
  return m;
});
function tok(name){ if(!(name in tokens)) throw new Error('token not found in ' + FILES.join(' or ') + ': ' + name); return tokens[name]; }

/* colours */
function parse(c){
  c = String(c).trim();
  var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
  if(m){ var h = m[1]; if(h.length === 3) h = h.replace(/./g, '$&$&'); return {r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1}; }
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(c);
  if(m) return {r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4]};
  throw new Error('cannot parse colour: ' + c);
}
function over(fg, bg){ var a = fg.a; return {r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1}; }
function lin(v){ v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
function lum(c){ return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b); }
function ratio(fg, bg){ var f = over(fg, bg), l1 = lum(f), l2 = lum(bg); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }
function hex(c){ return '#' + [c.r, c.g, c.b].map(function(v){ v = Math.round(v); return (v < 16 ? '0' : '') + v.toString(16); }).join('').toUpperCase(); }
function show(c, src){ return src + (c.a < 1 ? ' (alpha ' + c.a + ')' : ''); }

/* backgrounds, as the stylesheet paints them */
var BG = {
  'ink': tok('--ink'), 'ink-2': tok('--ink-2'), 'ink-3': tok('--ink-3'), 'ink-4': tok('--ink-4'),
  'mega #0E0D0B': '#0E0D0B', 'palette #151412': '#151412',
  'paper': tok('--paper'), 'paper-2': tok('--paper-2'), 'white': '#fff', 'route checked #FFFDF8': '#FFFDF8'
};
var DARK = ['ink', 'ink-2', 'ink-3', 'ink-4', 'mega #0E0D0B', 'palette #151412'];
var LIGHT = ['paper', 'paper-2', 'white', 'route checked #FFFDF8'];
function layered(top, under){ return hex(over(parse(top), parse(BG[under]))); }
BG['form-err tint on paper-2'] = layered('rgba(154,59,42,.07)', 'paper-2');
BG['form-err tint on white'] = layered('rgba(154,59,42,.07)', 'white');
BG['callout tint on paper'] = layered('rgba(122,95,54,.07)', 'paper');
BG['kbd tint on ink'] = layered('rgba(241,236,227,.04)', 'ink');
BG['selected option on palette'] = layered('rgba(196,165,116,.12)', 'palette #151412');

/* size: 'body' (16px and up), 'small' (under 16px), 'large' (24px and up, or 19px bold), 'icon' (graphics, 3:1) */
var PAIRS = [
  /* dark sections */
  {name: '--text', on: DARK, size: 'body', where: 'body copy, headings, .glance dd, .mega-prev figcaption b'},
  {name: '--soft', on: DARK, size: 'body', where: '.lead, .nav a, .eyebrow, .wmap-card p, .faq-a p, .ftr'},
  {name: '--dim', on: DARK, size: 'small', where: '.xs, .muted, .crumb, .fig label, .values p, .mega-item small, .ftr small, .fit-prog'},
  {name: '--dim', on: ['kbd tint on ink'], size: 'small', where: 'kbd, .kb'},
  {name: '--faint', on: ['ink', 'palette #151412', 'selected option on palette'], size: 'small', where: '.pal-k (result kind label, 11px)'},
  {name: '--gold', on: DARK, size: 'small', where: '.fd-n, .fd-k, .chapter .ix, .wa-pop-h, .wmap-card .role, .pal-grp, .ftr .fh'},
  {name: '--gold-l', on: DARK, size: 'body', where: '.tbc, .tlink:hover, .house .n, .drow .ar, .pal-t mark'},
  {name: '#B5915A', on: ['ink', 'ink-2'], size: 'small', where: '.wordmark (division page hero and cta band, 15px uppercase)'},
  {name: '#D49A86', on: ['ink', 'ink-2'], size: 'icon', where: '.sec:not(.light) .plist.no svg (cross icon)'},
  /* light sections */
  {name: '--l-text', on: LIGHT, size: 'body', where: 'headings, .field input, .ev, .jrow, .cf-review dd'},
  {name: '--l-body', on: LIGHT, size: 'body', where: '.light p, .lead, .consent, .notice, .plist li, .callout'},
  {name: '--l-muted', on: LIGHT, size: 'small', where: '.light .xs, .light .eyebrow, .cf-prog li, .field i, .icard .meta, .share-l, .vid figcaption'},
  {name: '--gold-ink', on: LIGHT, size: 'small', where: '.light .tbc, .does .ix, .step .ix, .routes .rt small, .cmp tbody th, .vmark, .verified'},
  {name: '--gold-ink', on: ['paper-2', 'white'], size: 'small', where: '.light .wordmark, .routing-card .wordmark (v5 trust override, 12px)'},
  {name: '#9A3B2A', on: ['paper-2', 'white'], size: 'small', where: '.field .em, .consent.err span, .route-err (13px)'},
  {name: '#6E2A1E', on: ['form-err tint on paper-2', 'form-err tint on white'], size: 'small', where: '.form-err (14.5px)'},
  {name: '#8A4B3A', on: ['paper', 'paper-2'], size: 'icon', where: '.plist.no svg (cross icon)'},
  {name: '--l-body', on: ['callout tint on paper'], size: 'small', where: '.callout (15.5px)'},
  /* buttons and badges: text over a filled token */
  {name: '--ink', on: ['gold'], size: 'small', where: '.btn.gold, .sample (11px)', bg: tok('--gold')},
  {name: '--paper', on: ['l-text'], size: 'small', where: '.light .btn, .filters button.on, .from-finder b, .ring-rm (12px)', bg: tok('--l-text')},
  {name: '--ink', on: ['paper'], size: 'body', where: '.btn, .toast, .skip'}
];

var fails = 0, rows = [];
function need(size){ return size === 'large' || size === 'icon' ? 3 : 4.5; }
function value(name){ return /^--/.test(name) ? tok(name) : name; }
PAIRS.forEach(function(p){
  var fg = parse(value(p.name)), worst = null;
  p.on.forEach(function(b){
    var bgv = p.bg || BG[b]; if(!bgv) throw new Error('unknown background ' + b);
    var r = ratio(fg, parse(bgv));
    if(!worst || r < worst.r) worst = {r: r, bg: b, bgv: bgv};
  });
  var ok = worst.r >= need(p.size);
  if(!ok) fails++;
  rows.push({ok: ok, p: p, worst: worst, fg: fg});
});
rows.forEach(function(x){
  var p = x.p, w = x.worst;
  console.log((x.ok ? 'ok   ' : 'FAIL ') + (p.name + ' = ' + show(x.fg, value(p.name))).padEnd(40) + ' on ' + w.bg.padEnd(28) + ' ' + w.r.toFixed(2) + ':1' + (x.ok ? '' : ' (needs ' + need(p.size) + ':1)') + '  ' + p.size + '  ' + p.where);
  if(!x.ok) console.log('     smallest change: ' + suggest(x.fg, parse(w.bgv), need(p.size), value(p.name)));
});

/* For a translucent token raise the alpha by .01 until it passes; for a solid colour move it toward white or black
   in 1 percent steps. Both keep the hue, so the fix stays in the house palette. */
function suggest(fg, bg, target, src){
  var i;
  if(fg.a < 1){ for(i = Math.round(fg.a * 100) + 1; i <= 100; i++){ var c = {r: fg.r, g: fg.g, b: fg.b, a: i / 100}; if(ratio(c, bg) >= target) return src.replace(/[\d.]+\s*\)$/, (i / 100).toString().replace(/^0/, '') + ')') + ' (alpha ' + fg.a + ' to ' + i / 100 + ', ' + ratio(c, bg).toFixed(2) + ':1)'; } }
  var toward = lum(bg) > 0.18 ? {r: 0, g: 0, b: 0} : {r: 255, g: 255, b: 255};
  for(i = 1; i <= 100; i++){ var k = i / 100, d = {r: fg.r + (toward.r - fg.r) * k, g: fg.g + (toward.g - fg.g) * k, b: fg.b + (toward.b - fg.b) * k, a: 1}; if(ratio(d, bg) >= target) return hex(d) + ' (' + i + ' percent toward ' + (toward.r ? 'white' : 'black') + ', ' + ratio(d, bg).toFixed(2) + ':1)'; }
  return 'no value found';
}
console.log(fails ? 'CONTRAST FAILED: ' + fails + ' pair(s) below the line' : 'CONTRAST OK: ' + rows.length + ' colour pairs at 4.5:1 for text and 3:1 for headlines and icons');
process.exit(fails ? 1 : 0);

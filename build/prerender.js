/* Prerender harness: runs the real site (index.html, data.js, shared/analytics.js, app.js) inside jsdom for one
   route and hands back the live window, so build/build.js can serialise what the app drew.

   jsdom lacks a few browser APIs the app touches. Each one is stubbed here rather than guarded in app.js:
   - matchMedia: answered as "no match", so motion stays on and the layout is the desktop one.
   - scrollTo, scroll, scrollBy, scrollIntoView: no-ops (jsdom logs "not implemented" otherwise).
   - HTMLMediaElement play, pause, load: no-ops, so a hero loop with a direct src renders without throwing.
   - IntersectionObserver is deliberately left absent: app.js then marks every reveal element .in at once, which is
     what a prerendered page needs (visible content without JavaScript).
   - requestAnimationFrame comes from jsdom's pretendToBeVisual option.
   - sessionStorage and localStorage work because the window has an https origin (config.siteUrl).
   Scripts are evaluated from disk through window.eval in document order, so nothing is fetched over the network.
   The script elements in the page are left in place for the browser. */
'use strict';
const fs = require('fs');
const path = require('path');
const {JSDOM, VirtualConsole} = require('jsdom');

function stub(window){
  const noop = function(){};
  if(typeof window.matchMedia !== 'function'){
    window.matchMedia = function(query){ return {matches: false, media: String(query || ''), onchange: null, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop, dispatchEvent: function(){ return false; }}; };
  }
  window.scrollTo = noop; window.scroll = noop; window.scrollBy = noop;
  if(typeof window.HTMLElement.prototype.scrollIntoView !== 'function') window.HTMLElement.prototype.scrollIntoView = noop;
  /* Media playback: jsdom throws "not implemented" on play(), pause() and load(); the hero loop calls play() when a
     video src is set. The build never plays anything, so these answer quietly. */
  const media = window.HTMLMediaElement && window.HTMLMediaElement.prototype;
  if(media){
    media.play = function(){ return Promise.resolve(); };
    media.pause = noop;
    media.load = noop;
  }
}

/* opts: {root, indexPath, siteUrl, scripts: [absolute paths in load order], preview}
   preview: set data-preview on the html element before the app runs, so a preview build renders the photographs
   that still lack recorded consent (app.js reads the attribute once, at load: setting it after the render would
   change nothing in the markup). */
function createRenderer(opts){
  const html = fs.readFileSync(opts.indexPath, 'utf8');
  const scripts = opts.scripts.map(function(p){ return {name: path.relative(opts.root, p), src: fs.readFileSync(p, 'utf8')}; });
  return function render(routePath){
    const errors = [];
    const vc = new VirtualConsole();
    vc.on('jsdomError', function(e){ errors.push('jsdomError: ' + ((e && e.message) || e)); });
    vc.on('error', function(m){ errors.push('console.error: ' + m); });
    const dom = new JSDOM(html, {url: opts.siteUrl + routePath, runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc});
    const w = dom.window;
    stub(w);
    if(opts.preview) w.document.documentElement.setAttribute('data-preview', '');
    /* What the app removes from the page (the intro veil on deep links) is put back before serialising, so every
       prerendered page carries the same markup as index.html and the browser's copy of the app finds what it expects. */
    const veil = w.document.getElementById('veil');
    const snapshot = {veil: veil ? veil.outerHTML : null};
    scripts.forEach(function(s){
      try{ w.eval(s.src); }
      catch(e){ errors.push(s.name + ': ' + ((e && e.stack) || e)); }
    });
    return {
      dom: dom, window: w, document: w.document, errors: errors, snapshot: snapshot,
      serialize: function(){ return dom.serialize(); },
      close: function(){ try{ w.close(); }catch(e){} }
    };
  };
}

module.exports = {createRenderer: createRenderer, stub: stub};

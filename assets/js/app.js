/* Imperial Holdings Group v5: clean-URL router (hash fallback on file://), views, one motion system, menus,
   site search, house finder, forms with first-touch source tracking (see TRK) for the Pipedrive funnel
   (Netlify Forms first, then our own function as a fallback: see submitLead), Our Network, Journal and event galleries.
   Motion uses transform / opacity / clip-path only and switches off under prefers-reduced-motion. */
(function(){
'use strict';
var D = window.IHG, app = document.getElementById('app'), body = document.body, root = document.documentElement;
var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
var reduced = mqReduce.matches;
var finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
var IMG = 'assets/img/', LOGO = 'assets/logos/';
/* Over http(s) the site uses real paths (/about). Templates keep writing "#/about"; in history mode a
   MutationObserver rewrites those hrefs as they land in the DOM, so one template serves both modes. */
var HIST = /^https?:$/.test(location.protocol);
var KBD = /Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent) ? '\u2318K' : 'Ctrl K';
function L(p){ return HIST ? p : '#'+p; }
function fixLinks(scope){ if(!HIST) return; [].forEach.call((scope||document).querySelectorAll('a[href^="#/"]'), function(a){ a.setAttribute('href', a.getAttribute('href').slice(1)); }); }
if(HIST && 'MutationObserver' in window){
  new MutationObserver(function(ms){ ms.forEach(function(m){ [].forEach.call(m.addedNodes, function(n){ if(n.nodeType!==1) return; if(n.matches && n.matches('a[href^="#/"]')) n.setAttribute('href', n.getAttribute('href').slice(1)); fixLinks(n); }); }); }).observe(document.documentElement, {childList:true, subtree:true});
}
var store = {get:function(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}}, set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}, del:function(k){try{localStorage.removeItem(k);}catch(e){}}};
function readMins(a){ var w = a.body.map(function(b){return b[1];}).join(' ').split(/\s+/).length + a.dek.split(/\s+/).length; return Math.max(1,Math.round(w/220)); }
/* Source tracking: first-touch UTM parameters, referrer and landing page, kept for the session and sent as hidden
   fields with every form, so each enquiry reaches Pipedrive with its source, medium and campaign. */
var TRK = (function(){
  var K = 'ihg-src', o = null; try{ o = JSON.parse(sessionStorage.getItem(K)); }catch(e){}
  if(o && o.landing) return o;
  o = {}; var q = {};
  location.search.replace(/^\?/,'').split('&').forEach(function(kv){ if(!kv) return; var p = kv.split('='); try{ q[decodeURIComponent(p[0])] = decodeURIComponent((p[1]||'').replace(/\+/g,' ')); }catch(e){} });
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','ttclid'].forEach(function(k){ if(q[k]) o[k] = String(q[k]).slice(0,200); });
  o.referrer = (document.referrer||'').slice(0,300); o.landing = location.href.split('#')[0].slice(0,300); o.first_seen = new Date().toISOString();
  var host = ''; try{ host = o.referrer ? new URL(o.referrer).hostname.replace(/^www\./,'') : ''; }catch(e){}
  var own = host && location.hostname && host === location.hostname.replace(/^www\./,'');
  o.source = o.utm_source || (host && !own ? host : 'direct');
  /* a search engine referrer is organic search, not a referral, so the note, GA4 and the Pipedrive Source Method agree */
  var engine = /(^|\.)(google|bing|yahoo|duckduckgo|ecosia)\./.test(host);
  o.medium = o.utm_medium || (o.gclid ? 'cpc' : o.fbclid ? 'paid-social' : o.ttclid ? 'paid-social' : (host && !own) ? (engine ? 'organic' : 'referral') : 'direct');
  o.campaign = o.utm_campaign || '';
  try{ sessionStorage.setItem(K, JSON.stringify(o)); }catch(e){}
  return o;
})();
var TRK_KEYS = ['source','medium','campaign','utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','landing','referrer'];
function trackFields(){ return TRK_KEYS.map(function(k){ return '<input type="hidden" name="'+k+'" value="'+esc(TRK[k]||'')+'">'; }).join('')+'<input type="hidden" name="page" value=""><input type="hidden" name="audience_resolved" value="">'; }

/* ---------- helpers ---------- */
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
/* Every placeholder carries the words "To confirm" (read by screen readers and found by the brief's search of the built
   site, acceptance test 8) without changing how the amber chip looks. */
function tbc(t){return '<span class="tbc" title="Placeholder: to be confirmed"><span class="vh">To confirm: </span>'+esc(t)+'</span>';}
var AR = '<svg class="ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
var NE = '<svg class="ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
var BACK = '<svg class="ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M14 8H3M7 4 3 8l4 4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
var TICK = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5 8.2 14.5 16 6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
var CROSS = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
function div(k){for(var i=0;i<D.divisions.length;i++) if(D.divisions[i].key===k) return D.divisions[i]; return null;}
function pad2(n){return (n<10?'0':'')+n;}
function photoAlt(k){for(var i=0;i<D.photos.length;i++) if(D.photos[i].key===k) return D.photos[i].what; return '';}
/* v6 image delivery (UX audit item 18). Every photograph carries its intrinsic width and height, so the browser
   reserves its box before the file arrives: the files come in a few fixed shapes (dimsOf). Below the fold it loads
   lazily and decodes off the main thread. A full-frame site photograph (no variant) also offers its existing -m file
   (the 3:4 crop every site photograph has) to screens up to 640 px through a picture source, as the page heroes do;
   event photographs, portraits and the hero files have no -m file and are left as they are. No file is added. */
var DIMS = {c: ' width="900" height="1125"', m: ' width="810" height="1080"', wide: ' width="1600" height="1000"'};
function dimsOf(k, v){
  if(v==='-c' || /\/cover-p$/.test(k) || k.indexOf('people/')===0) return DIMS.c;
  if(v==='-m') return DIMS.m;
  if(!v && (k.indexOf('events/')!==0 || /\/cover$/.test(k))) return k==='hero-lights' ? ' width="1600" height="977"' : DIMS.wide;
  return '';   /* event gallery frames vary in shape; their figures set the box */
}
function hasMobile(k){ return k.indexOf('events/')!==0 && k.indexOf('people/')!==0 && k.indexOf('hero')!==0; }
function img(k, alt, cls, v, eager){
  var tag = '<img src="'+IMG+k+(v||'')+'.webp" alt="'+esc(alt==null?photoAlt(k):alt)+'"'+(cls?' class="'+cls+'"':'')+dimsOf(k, v||'')+(eager?' fetchpriority="high"':' loading="lazy"')+' decoding="async">';
  return !v && !eager && hasMobile(k) ? '<picture><source media="(max-width:640px)" srcset="'+IMG+k+'-m.webp" width="810" height="1080">'+tag+'</picture>' : tag;
}
/* v5 media: consent-aware photographs and video. A photograph shows when the registry records consent for it, when
   its event has consent recorded (events[i].consent), or on a preview build (data-preview on <html>). Otherwise
   safePhoto() returns a fallback that shows no guests. Video blocks share one shape (see D.video in data.js):
   an empty id renders the poster and a TO CONFIRM label; a real id renders the poster with a play button and loads
   the player only on click (Vimeo with dnt=1, or Mux). The hero loop is rendered only when motion and data allow. */
var PREVIEW = root.hasAttribute('data-preview'), VID = D.video || {};
var PLAY = '<svg class="play" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4.5v11l9-5.5z" fill="currentColor"/></svg>';
/* Fallback photographs per event while its guests' consent is outstanding: [card, alternate]. Event cards and page
   heroes use the first, journal rows and video posters the second, so a page shows each photograph at most twice.
   No event borrows another event's banner or backdrop (design review, findings 2 and 4): each gets a neutral own
   photograph, a city view, an interior, or a detail crop from its own folder with nobody in frame. */
var EVENT_SAFE = {
  'grenada-51-dubai': ['closing', 'partners'],
  'lagos-diplomatic-soiree-2025': ['lagos', 'lagos'],
  'gala-dinner-lagos': ['hero-lights', 'events/gala-dinner-lagos/stage'],
  'easter-polo-cup-2026': ['events/easter-polo-cup-2026/02', 'events/easter-polo-cup-2026/04'],
  'lagos-office-event': ['about', 'private-office'],
  'delborough-dinner': ['academy', 'about']
};
function photoMeta(k){for(var i=0;i<D.photos.length;i++) if(D.photos[i].key===k) return D.photos[i]; return null;}
function eventBySlug(slug){for(var i=0;i<D.events.length;i++) if(D.events[i].slug===slug) return D.events[i]; return null;}
function photoAllowed(k){
  if(PREVIEW) return true;
  var m = photoMeta(k), slug = m && m.event ? m.event : (k.indexOf('events/')===0 ? k.split('/')[1] : null), ev;
  if(m && m.consent) return true;
  if(slug){ ev = eventBySlug(slug); return !!(ev && ev.consent); }
  return true; /* not from an event and not gated in the registry: nothing to hold back */
}
function safePhoto(k, fb){ return photoAllowed(k) ? k : (fb || 'about'); }
function variantOf(k){ return k.indexOf('events/')===0 ? '' : k.indexOf('hero')===0 ? '-m' : '-c'; }
/* The fallback for an event (alt: the alternate), checked for consent, with the city view as the last resort */
function eventSafe(e, alt){
  var pair = EVENT_SAFE[e.slug] || [], city = e.city==='Dubai' ? 'closing' : 'lagos';
  var pick = [alt ? pair[1] : pair[0], alt ? pair[0] : pair[1], city].filter(function(k){ return k && photoAllowed(k); });
  return pick[0] || city;
}
function cardPhoto(e){ var k = 'events/'+e.slug+'/cover'; return photoAllowed(k) ? k : eventSafe(e); }
function rowPhoto(j){ var ev = j.to.indexOf('/journal/events/')===0 ? eventBySlug(j.to.split('/')[3]) : null; return photoAllowed(j.img) ? j.img : (ev ? eventSafe(ev, true) : 'about'); }
function sortByIso(list){
  return list.map(function(x,i){return {x:x,i:i};}).sort(function(a,b){
    var p = a.x.iso || '', q = b.x.iso || '';
    if(p && q && p!==q) return p<q ? 1 : -1;
    if(!!p !== !!q) return p ? -1 : 1;
    return a.i-b.i;
  }).map(function(o){return o.x;});
}
function loopOK(){ var c = navigator.connection || {}; return !mqReduce.matches && !c.saveData && !/2g/.test(c.effectiveType||''); }
/* The self-hosted loop carries its captions file as a track (brief 5.2: a captions file for every clip). A Vimeo or Mux
   embed cannot take a track, so for those the same file is uploaded at the host. TO CONFIRM: real transcripts for the
   five files under assets/captions once the footage exists; each holds one placeholder cue today. */
function heroLoop(v){
  if(!v || !loopOK()) return '';
  if(v.src) return '<video class="loop" data-loop muted playsinline loop preload="none" aria-hidden="true" tabindex="-1"><source src="'+esc(v.src)+'">'+(v.captions?'<track kind="captions" src="'+esc(v.captions)+'" srclang="en" label="English">':'')+'</video>';
  if(v.id && v.provider==='mux') return '<iframe class="loop" src="https://player.mux.com/'+encodeURIComponent(v.id)+'?autoplay=muted&muted=true&loop=true&controls=false" title="" aria-hidden="true" tabindex="-1" allow="autoplay" loading="lazy"></iframe>';
  if(v.id) return '<iframe class="loop" src="https://player.vimeo.com/video/'+encodeURIComponent(v.id)+'?background=1&muted=1&loop=1&autoplay=1&dnt=1'+(v.hash?'&h='+encodeURIComponent(v.hash):'')+'" title="" aria-hidden="true" tabindex="-1" allow="autoplay" loading="lazy"></iframe>';
  return '';
}
function videoBlock(v, cls, fb){
  if(!v) return '';
  var pk = safePhoto(v.poster, fb || 'hero-lights'), ready = !!v.id, title = v.title || 'Video';
  return '<figure class="vid'+(cls?' '+cls:'')+(ready?'':' pending')+'" data-r'+(ready?' data-video data-provider="'+esc(v.provider||'vimeo')+'" data-id="'+esc(v.id)+'"'+(v.hash?' data-hash="'+esc(v.hash)+'"':'')+' data-vtitle="'+esc(title)+'"':'')+'>'+
    '<div class="vid-stage">'+img(pk, title+' (poster)', 'vid-poster')+
    (ready ? '<button type="button" class="vid-play" aria-label="Play '+esc(title)+'">'+PLAY+'<span>Play</span></button>' : '<span class="vid-tbc">'+PLAY+tbc(v.tbc||'Footage to be supplied')+'</span>')+'</div>'+
    '<figcaption><b>'+esc(title)+'</b>'+(v.duration?'<i aria-hidden="true">·</i>'+esc(v.duration):'')+(v.captions?'<i aria-hidden="true">·</i><a class="vid-cc" href="'+esc(v.captions)+'">Captions</a>':'')+'</figcaption></figure>';
}
function homeVideo(){ var f = null; D.events.concat(D.journal).forEach(function(x){ if(!f && x.video && x.video.id) f = x.video; }); return f; }
function playerSrc(f){
  var p = f.getAttribute('data-provider'), id = encodeURIComponent(f.getAttribute('data-id')), h = f.getAttribute('data-hash');
  if(p==='mux') return 'https://player.mux.com/'+id+'?autoplay=true';
  return 'https://player.vimeo.com/video/'+id+'?dnt=1&autoplay=1&title=0&byline=0&portrait=0'+(h?'&h='+encodeURIComponent(h):'');
}
function bindMedia(){
  [].forEach.call(app.querySelectorAll('[data-video]'), function(f){
    var b = f.querySelector('.vid-play'); if(!b) return;
    b.addEventListener('click', function(){
      var st = f.querySelector('.vid-stage');
      st.innerHTML = '<iframe src="'+esc(playerSrc(f))+'" title="'+esc(f.getAttribute('data-vtitle')||'Video')+'" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
      f.classList.add('playing');
    });
  });
  [].forEach.call(app.querySelectorAll('video[data-loop]'), function(v){
    v.muted = true; v.setAttribute('preload','auto');
    var go = function(){ if(loopOK()){ var p = v.play(); if(p && p.catch) p.catch(function(){}); } else v.pause(); };
    go();
    if(mqReduce.addEventListener) mqReduce.addEventListener('change', go);
  });
}
function relatedRow(kind, cur){
  /* drafts (insights awaiting approval) are never offered as related reading */
  var list = kind==='event' ? sortByIso(D.events) : D.insights.filter(function(a){return !a.draft;}), same = [], other = [];
  list.forEach(function(x){ if(x===cur) return; (x.cat===cur.cat ? same : other).push(x); });
  var pick = same.concat(other).slice(0,3);
  if(!pick.length) return '';
  return '<section class="sec light alt" id="related"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Related')+mask(kind==='event'?['More evenings','from the house.']:['More from the house.'],'h2','d2')+'</div></div>'+
    (kind==='event' ? '<div class="evgrid">'+pick.map(eventCard).join('')+'</div>' : '<div class="icards">'+pick.map(insightCard).join('')+'</div>')+'</div></section>';
}
function logoImg(d, colour, cls){
  if(d.logo) return '<img class="'+(cls||'')+'" src="'+LOGO+d.logo+'-Horizontal-Gold.svg" alt="'+esc(d.name)+'">';
  return '<span class="wordmark '+(cls||'')+'" role="img" aria-label="'+esc(d.name)+'"><img src="'+LOGO+'Imperial-Crown-Gold.svg" alt="" width="320" height="175">'+esc(d.name)+'</span>';
}
/* Placeholder links (the four division websites not yet built, UX audit item 34): they keep href="#" and the "Link to
   confirm" toast, and also say so before the click: aria-disabled="true" and a visible "To confirm" mark. They are a
   launch blocker in docs/LAUNCH-NOTES.md. */
var TBC_MARK = '<span class="tbc-mark">To confirm</span>';
function extLink(d, cls, label){
  if(!d.cta) return '';
  var l = label || d.cta.label;
  if(d.cta.real) return '<a class="'+cls+'" href="'+d.cta.href+'" target="_blank" rel="noopener"><span>'+esc(l)+'</span>'+NE+'</a>';
  return '<a class="'+cls+'" href="#" data-tbc="'+esc(d.cta.tbc)+'" aria-disabled="true"><span>'+esc(l)+'</span>'+TBC_MARK+'</a>';
}
function siteLink(s, cls, inner){
  if(s.home) return '<a class="'+(cls||'')+'" href="'+s.href+'">'+inner+'</a>';
  if(s.real) return '<a class="'+(cls||'')+'" href="'+s.href+'" target="_blank" rel="noopener">'+inner+'</a>';
  return '<a class="'+(cls||'')+'" href="#" data-tbc="'+esc(s.tbc)+'" aria-disabled="true">'+inner+(/to confirm/i.test(inner) ? '' : TBC_MARK)+'</a>';
}
/* The short text for a site in the ecosystem lists (mega menu, footer): this site by name, a live site by its domain
   (with the external arrow where asked), the rest by name with a TBC mark. */
function siteText(s, arrow){
  if(s.home) return esc(s.name);
  if(s.real) return esc(s.label)+(arrow?NE:'');
  return esc(s.name.replace('Imperial ',''));   /* siteLink adds the To confirm mark */
}
function eyebrow(t){return '<div class="eyebrow" data-r>'+t+'</div>';}
function mask(lines, tag, cls, base){
  var h='<'+tag+' class="'+cls+'" data-r="fade">';
  lines.forEach(function(l,i){h+='<span class="mask"><span style="--d:'+((base||0)+i*0.1).toFixed(2)+'s">'+l+'</span></span>';});
  return h+'</'+tag+'>';
}
function announce(t){var a=document.getElementById('announce'); a.textContent=''; setTimeout(function(){a.textContent=t;},40);}
function fmtTime(tz){try{return new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:tz}).format(new Date());}catch(e){return '--:--';}}

/* ---------- shared blocks ---------- */
/* The hero photograph: the desktop file as one <img> and, where a mobile crop exists, a <picture> source for narrow
   screens, as on the home hero. Every site photograph has a -m file (a 3:4 centre crop of the same frame, so nothing
   changes visually); event photographs and portraits have none. Brief section 4: responsive sizes, LCP on mobile. */
function heroVariant(k){ return k.indexOf('events/')===0 || k.indexOf('people/')===0 ? '' : '-m'; }
function pageHero(o){
  var k = o.img ? safePhoto(o.img, o.fb) : '', v = k ? heroVariant(k) : '';
  var bg = k ? '<div class="ph-bg"><div class="px">'+(v ? '<picture><source media="(max-width:640px)" srcset="'+IMG+k+v+'.webp" sizes="100vw">' : '')+img(k, null, '', '', true)+(v ? '</picture>' : '')+'</div></div>' : '';
  var crumb = o.crumb ? '<nav class="crumb" aria-label="Breadcrumb" data-r><a href="#/">Home</a>'+o.crumb.map(function(c){return '<i aria-hidden="true">/</i>'+(c[1]?'<a href="'+c[1]+'">'+esc(c[0])+'</a>':'<span aria-current="page">'+esc(c[0])+'</span>');}).join('')+'</nav>' : '';
  return '<section class="ph'+(o.cls?' '+o.cls:'')+'">'+bg+'<div class="ph-c wrap">'+crumb+(o.pre||'')+(o.eyebrow?eyebrow(o.eyebrow):'')+mask(o.title,'h1','d1',.12)+(o.lead?'<p class="lead" data-r style="--d:.4s">'+o.lead+'</p>':'')+(o.after||'')+'</div></section>';
}
function closing(){
  return '<section class="closing"><div class="ph-bg"><div class="px">'+img('closing')+'</div></div><div class="closing-c wrap">'+
    '<img class="crown" src="'+LOGO+'Imperial-Crown-Gold.svg" alt="" width="320" height="175" data-r>'+
    mask(['With you, from the','first question.'],'h2','d2')+
    '<p class="lead" data-r style="--d:.2s">Tell us where you are, and where you would like to be. The first conversation is for listening. Decisions come when you are ready.</p>'+
    '<div class="btns" data-r style="--d:.3s"><a class="btn gold mag" href="#/contact"><span>Speak to us</span>'+AR+'</a><a class="btn line" href="#/about"><span>About the Group</span></a></div></div></section>';
}
function promise(){
  return '<div class="promise"><div data-r><div class="plist-h">We will</div><ul class="plist yes">'+D.will.map(function(t){return '<li>'+TICK+'<span>'+esc(t)+'</span></li>';}).join('')+'</ul></div>'+
    '<div data-r style="--d:.12s"><div class="plist-h">We never will</div><ul class="plist no">'+D.never.map(function(t){return '<li>'+CROSS+'<span>'+esc(t)+'</span></li>';}).join('')+'</ul></div></div>';
}
function steps(list){
  return '<div class="steps" style="--n:'+list.length+'">'+list.map(function(s,i){return '<div class="step" style="--i:'+i+'" data-r><span class="ix">STEP '+pad2(i+1)+'</span><h3 class="h3">'+esc(s[0])+'</h3><p>'+esc(s[1])+'</p></div>';}).join('')+'</div>';
}
function insightCard(a,i){
  return '<a class="icard" href="#/insights/'+a.slug+'" data-cat="'+esc(a.cat)+'" data-r style="--d:'+(i%3*0.1).toFixed(2)+'s"><div class="ic-img">'+img(a.img,null,'','-c')+(a.draft?'<span class="sample">Draft, awaiting approval</span>':'')+'</div><div class="meta">'+esc(a.cat)+' <i aria-hidden="true">\u00b7</i> '+readMins(a)+' min read</div><h3>'+esc(a.title)+'</h3><p>'+esc(a.dek)+'</p><span class="tlink">'+(a.draft?'Read the draft':'Read the article')+AR+'</span></a>';
}
function figures(){
  return '<div class="figs">'+D.figures.map(function(f,i){return '<div class="fig" data-r style="--d:'+(i*0.08).toFixed(2)+'s"><span class="num"><span data-count="'+f.n+'">'+(reduced?f.n.toLocaleString('en-GB'):'0')+'</span><sup>'+f.s+'</sup></span><span>'+esc(f.l)+'</span></div>';}).join('')+'</div>'+
    '<p class="figs-note" data-r>Figures from the Imperial Holdings brochure. '+tbc('"As at" date for these figures')+'</p>';
}
function houses(){
  return '<div class="houses" id="houses">'+D.divisions.map(function(d,i){
    var cta = d.soon ? 'Register interest' : 'Discover '+esc(d.short);
    return '<article class="house'+(i===0?' on':'')+'" data-r style="--d:'+(i*0.07).toFixed(2)+'s"><a href="#/divisions/'+d.key+'" data-dv="'+d.key+'">'+
      '<figure>'+img(d.img,'', '', '-c')+'</figure><span class="n" aria-hidden="true">'+pad2(i+1)+'</span><span class="vl">'+esc(d.short)+'</span>'+
      '<div class="hc"><span class="badge'+(d.statusTone==='gold'?' gold':d.soon?' soon':'')+'">'+esc(d.status)+'</span><h3>'+esc(d.name)+'</h3><p>'+esc(d.line)+'</p><span class="tlink">'+cta+AR+'</span></div></a></article>';
  }).join('')+'</div>';
}
function mapBlock(){
  var M = D.map, hq = M.places[0];
  function arc(a,b){var mx=(a.x+b.x)/2, my=Math.min(a.y,b.y)-Math.abs(b.x-a.x)*0.22; return 'M'+a.x+' '+a.y+'Q'+mx.toFixed(0)+' '+my.toFixed(0)+' '+b.x+' '+b.y;}
  var arcs = M.regions.map(function(r,i){return '<path class="arc" data-k="'+r.k+'" style="--d:'+(i*0.22).toFixed(2)+'s" d="'+arc(hq,r)+'"/>';}).join('')+'<path class="arc" data-k="lagos" style="--d:.9s" d="'+arc(hq,M.places[1])+'"/>';
  var regs = M.regions.map(function(r){return '<g class="reg" data-k="'+r.k+'"><circle cx="'+r.x+'" cy="'+r.y+'" r="64"/></g>';}).join('');
  var pins = M.places.map(function(p){return '<g class="pin" data-k="'+p.k+'"><circle class="r" cx="'+p.x+'" cy="'+p.y+'" r="7"/><circle class="c" cx="'+p.x+'" cy="'+p.y+'" r="6"/></g>';}).join('');
  var lbls = M.places.map(function(p){return '<span class="wmap-lbl" aria-hidden="true" style="left:'+(p.x/M.w*100).toFixed(2)+'%;top:'+(p.y/M.h*100).toFixed(2)+'%">'+p.name+'</span>';}).join('');
  var tabs = [['dubai','Dubai','Headquarters'],['lagos','Lagos','Regional hub'],['world','20+ countries','Worldwide']];
  var cards = M.places.map(function(p){return '<div id="wm-'+p.k+'" role="tabpanel" aria-labelledby="wmt-'+p.k+'" class="'+(p.k==='dubai'?'on':'')+'"><span class="role">'+p.role+'</span><h3>'+p.name+'</h3><span class="clock" data-tz="'+p.tz+'" data-fmt="local">--:--</span><p>'+p.text+'</p><p class="wm-addr">'+esc(p.addr)+'</p><a class="tlink" href="tel:'+p.tel.replace(/\s/g,'')+'">'+esc(p.tel)+'</a></div>';}).join('')+
    '<div id="wm-world" role="tabpanel" aria-labelledby="wmt-world"><span class="role">Worldwide</span><h3>20+ countries</h3><p>Partners, advisers and specialists, in relationships across:</p><ul>'+M.regions.map(function(r){return '<li><button class="tlink" type="button" data-reg="'+r.k+'">'+r.name+'</button></li>';}).join('')+'</ul></div>';
  return '<div class="wmap" id="wmap" data-sel="dubai"><div class="wmap-stage"><svg viewBox="0 0 '+M.w+' '+M.h+'" role="img" aria-label="Map: headquarters in Dubai, a regional hub in Lagos, and relationships across Europe, the United States, Asia and the Caribbean"><path class="land" d="'+M.path+'"/>'+regs+arcs+pins+'</svg>'+lbls+'</div>'+
    '<div class="wmap-side"><div class="wmap-tabs" role="tablist" aria-label="Where we work">'+tabs.map(function(t,i){return '<button role="tab" id="wmt-'+t[0]+'" aria-controls="wm-'+t[0]+'" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'" data-wm="'+t[0]+'"><span>'+t[1]+'</span><small>'+t[2]+'</small></button>';}).join('')+'</div><div class="wmap-card">'+cards+'</div></div></div>'+
    '<p class="wmap-note" data-r>Regions are shown broadly to indicate relationships, not office locations.</p>';
}
/* ---------- views ---------- */
var V = {};
V.home = function(){
  var N = D.network, HH = D.hero, hk = safePhoto(HH.photo, HH.fallback), nk = photoAllowed(HH.night) ? HH.night : null, hv = homeVideo();
  var ev = sortByIso(D.events).filter(function(e){return e.featured;}).slice(0,2), lead = D.leadership.filter(function(l){return l.img;});
  var rows = sortByIso(D.journal).slice(0,3), AUD_SAFE = ['about','academy','closing'];
  /* Our Network grid: own photographs of Imperial gatherings with nobody awaiting consent, chosen so that nothing on
     this page (hero, event cards, journal rows) shows the same photograph more than twice */
  var used = {}, GATHERINGS = ['events/easter-polo-cup-2026/04','events/gala-dinner-lagos/stage','events/easter-polo-cup-2026/05','hero-lights','closing','lagos'];
  function use(k){ used[k] = (used[k]||0)+1; return k; }
  use(hk); ev.forEach(function(e){ use(cardPhoto(e)); }); rows.forEach(function(j){ use(rowPhoto(j)); });
  var grid = N.photos.map(function(p){ return photoAllowed(p) ? use(p) : null; }).map(function(k){
    if(k) return k;
    var best = null; GATHERINGS.forEach(function(g){ if(photoAllowed(g) && (!best || (used[g]||0) < (used[best]||0))) best = g; });
    return use(best || 'lagos');
  });
  var held = N.photos.some(function(p){return !photoAllowed(p);});
  return ''+
  /* hero: the strongest element of the existing site, kept. Two journeys: clients explore the ecosystem, partners go to IPC. */
  '<section class="hh'+(hk===HH.fallback?' fallback':'')+'" id="top"><div class="hh-pin">'+
    '<figure class="dusk"><picture><source media="(max-width:640px)" srcset="'+IMG+hk+'-m.webp"><img src="'+IMG+hk+'.webp" alt="'+esc(photoAlt(hk))+'" fetchpriority="high"></picture>'+heroLoop(VID.hero)+'</figure>'+
    (nk ? '<figure class="night" aria-hidden="true"><picture><source media="(max-width:640px)" srcset="'+IMG+nk+'-m.webp"><img src="'+IMG+nk+'.webp" alt="" decoding="async" fetchpriority="low"></picture></figure>' : '')+
    '<div class="hh-c wrap">'+eyebrow('Imperial Holdings Group <i>·</i> Dubai <i>·</i> Lagos')+mask(['Two Cities.','One Horizon.'],'h1','d1',.15)+
    '<p class="lead" data-r style="--d:.55s">Five specialist divisions, one standard, and one person who knows your family.</p>'+
    '<div class="hh-row" data-r style="--d:.7s"><div class="journeys">'+
      '<div class="jny"><a class="btn gold mag" href="#/" data-scroll="ecosystem"><span>Explore our ecosystem</span>'+AR+'</a><small>For private clients</small></div>'+
      '<div class="jny"><a class="btn line" href="#/divisions/partners-club" data-dv="partners-club"><span>Partner with us</span>'+AR+'</a><small>For professional partners</small></div></div>'+
    '<p class="hh-time" aria-live="off"><i aria-hidden="true"></i><span>In Dubai it is <b class="clock" data-tz="Asia/Dubai" data-fmt="bare">--:--</b>. <span id="greet"></span></span></p><p class="hh-cred" data-r style="--d:.8s">'+tbc(HH.tbc)+'</p></div></div>'+
    '<span class="cue" aria-hidden="true">Scroll</span></div></section>'+

  '<section class="sec"><div class="wrap"><div class="intro"><div>'+eyebrow('The Group')+mask(['A house for a life','across borders.'],'h2','d2')+'</div>'+
   '<div data-r style="--d:.15s"><p class="lead">Imperial Holdings Group is the parent of five specialist divisions, led from Dubai and Lagos. We help families and their advisers decide where they live, what they own and what they leave behind.</p><a class="tlink" href="#/about">About the Group'+AR+'</a></div></div>'+figures()+'</div></section>'+

  '<section class="sec deep" id="ecosystem"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Our ecosystem')+mask(['Five divisions.','One table.'],'h2','d2')+'</div><p class="lead" data-r style="--d:.15s">Each division is a specialist. Together they sit at one table, so the person advising on your residency already knows about the home, the company and the school.</p></div>'+
   houses()+'<div class="houses-foot" data-r><span>Hover, focus or tap a division to open it.</span><a class="tlink" href="#/divisions">All divisions'+AR+'</a></div></div></section>'+

  /* Our Network: one client journey, four photographs of genuine Imperial gatherings, three audiences */
  '<section class="sec light net" id="network"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Our Network')+mask(['One relationship.','Many doors.'],'h2','d2')+'</div><p class="lead" data-r style="--d:.15s">Most relationships begin with a single question and grow from there. The ecosystem exists so that each step is taken with the others in view.</p></div>'+
   '<ol class="journey" aria-label="How a relationship with Imperial grows">'+N.journey.map(function(j,i){var d=div(j[2]);return '<li data-r style="--d:'+(i*0.1).toFixed(2)+'s"><span class="ix">'+pad2(i+1)+'</span><h3 class="h3">'+esc(j[0])+'</h3><p>'+esc(j[1])+'</p><a class="tlink" href="#/divisions/'+j[2]+'">'+esc(d?d.name:'')+AR+'</a></li>';}).join('')+'</ol>'+
   '<div class="net-photos" data-r>'+grid.map(function(k,i){return '<figure class="np'+(i+1)+'">'+img(k,'')+'</figure>';}).join('')+'</div><p class="xs net-cap" data-r>Imperial gatherings in Dubai and Lagos. '+(held?'Photographs of guests appear once they have confirmed they are happy to be featured. ':'')+'<a class="ul" href="#/journal">See selected events</a></p>'+
   '<div class="aud" id="audiences">'+N.audiences.map(function(a,i){return '<article class="aud-c" data-r style="--d:'+(i*0.1).toFixed(2)+'s"><figure>'+img(safePhoto(a.img, AUD_SAFE[i]),'')+'</figure><div class="aud-b"><span class="ix">'+pad2(i+1)+'</span><h3>'+esc(a.t)+'</h3><p>'+esc(a.s)+'</p><a class="btn'+(i===0?' gold':' line')+'" href="'+a.href+'"><span>'+esc(a.cta)+'</span>'+AR+'</a></div></article>';}).join('')+'</div></div></section>'+

  '<section class="sec lead-sec" id="leadership"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Leadership')+mask(['The people','accountable.'],'h2','d2')+'</div><p class="lead" data-r style="--d:.15s">Imperial is led by its founder, with one Group team working across every division.</p></div>'+
   '<div class="leaders real home">'+lead.map(function(l,i){return '<div class="leader" data-r style="--d:'+(i*0.1).toFixed(2)+'s"><div class="portrait has-photo">'+img('people/'+l.img, l.name)+'</div><div class="role">'+esc(l.role)+'</div><h3>'+esc(l.name)+'</h3></div>';}).join('')+
   '<div class="leader more" data-r style="--d:.2s"><p>Each division has its own leadership, introduced on its website. Group biographies: '+tbc('to be approved')+'</p><a class="tlink" href="#/about">About the Group'+AR+'</a></div></div></div></section>'+

  '<section class="sec light alt" id="events"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Selected events')+mask(['Gatherings','worth the evening.'],'h2','d2')+'</div><div data-r style="--d:.15s"><p class="lead">Diplomatic collaborations, private gatherings and the relationships behind them.</p><a class="tlink" href="#/journal">All events and the Journal'+AR+'</a></div></div>'+
   '<div class="evgrid two">'+ev.map(eventCard).join('')+'</div></div></section>'+
  /* one video block on the home page, only once a clip exists (first event or journal video with an id) */
  (hv ? '<section class="sec light home-vid" id="film"><div class="wrap"><div class="sec-head"><div>'+eyebrow('On film')+mask(['The evening,','in motion.'],'h2','d2')+'</div></div>'+videoBlock(hv,'')+'</div></section>' : '')+

  '<section class="sec light" id="journal"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Journal')+mask(['Developments, insights','and partnerships.'],'h2','d2')+'</div><p class="lead" data-r style="--d:.15s">Fewer entries, chosen with care: genuine company developments, insights, partnerships and selected events.</p></div>'+
   '<div class="jlist">'+rows.map(journalRow).join('')+'</div><div class="btns" data-r style="margin-top:44px"><a class="btn line" href="#/journal"><span>Read the Journal</span>'+AR+'</a></div></div></section>'+

  '<section class="sec deep" id="where"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Global presence')+mask(['Led from Dubai','and Lagos.'],'h2','d2')+'</div><p class="lead" data-r style="--d:.15s">Headquarters in Dubai, a regional hub in Lagos and relationships with Partners, advisers and specialists in more than 20 countries.</p></div>'+mapBlock()+'</div></section>'+

  enquiryBlock();
};

V.about = function(){
  var seats = D.divisions.map(function(d,i){var a=(-90+i*72)*Math.PI/180, r=40; return '<li style="--i:'+i+';--x:'+(Math.cos(a)*r).toFixed(2)+';--y:'+(Math.sin(a)*r+4).toFixed(2)+'"><a href="#/divisions/'+d.key+'" data-dv="'+d.key+'"><b>'+esc(d.short)+'</b><small>'+(d.soon?'Coming soon':esc(d.status))+'</small></a></li>';}).join('');
  return pageHero({img:'about', crumb:[['About',null]], eyebrow:'About Imperial Holdings Group', title:['One house.','Many services.'], lead:'Imperial began as a citizenship and residency specialist. Over more than a decade of work with families and founders, it has grown into a group of five specialist divisions, run by one team to one standard.'})+
  '<section class="sec"><div class="wrap split"><div>'+eyebrow('Our story')+mask(['From one question','to a whole house.'],'h2','d2')+'</div>'+
   '<div data-r style="--d:.15s"><p class="lead">Imperial Citizenship is where we began, and it remains our main business. Working with families on residency and citizenship taught us that one transaction rarely solves the whole problem.</p>'+
   '<p class="muted">The residency question touches the home. The home touches the school. The company touches the tax position. And the trusted professionals our Clients already rely on needed a reliable house to hand those conversations to.</p>'+
   '<p class="muted">Imperial Holdings Group is the result: five specialist houses at one table, sharing one team, one standard and one record of each family, so that you never have to explain your family twice.</p>'+
   '<p class="small muted">Founding date and milestones: '+tbc('Group history and key dates')+'</p></div></div></section>'+

  '<section class="sec light"><div class="wrap split"><div class="ring anim" data-r="fade" aria-label="One table: your family at the centre, one Relationship Manager, and the five houses"><div class="ring-c"><img src="'+LOGO+'Imperial-Crown-Gold.svg" alt="" width="320" height="175"><b>Your family</b><span class="ring-rm">One Relationship Manager</span></div><ul>'+seats+'</ul></div>'+
   '<div>'+eyebrow('How we work')+mask(['One team.','One point of contact.'],'h2','d2')+
   '<p class="lead" data-r style="--d:.15s">Our people work across the Group rather than inside a single division, so knowledge and standards travel with your family.</p>'+
   '<p data-r style="--d:.2s">One Relationship Manager brings each house in when it is needed, together with qualified specialists for regulated matters such as tax, legal and investment. Where a service is best delivered by a trusted Partner, we coordinate it for you, so you still have one person to call.</p>'+
   '<div class="btns" data-r style="--d:.25s"><a class="btn" href="#/contact"><span>Speak to us</span>'+AR+'</a></div></div></div></section>'+

  '<section class="sec"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Our values')+mask(['Wealthy in restraint.','Rich in detail.'],'h2','d2')+'</div><p class="lead" data-r style="--d:.15s">The same standard in every house. We explain the process before we talk about outcomes, so you always know where you stand.</p></div>'+
   '<div class="values">'+D.values.map(function(v,i){return '<div data-r style="--d:'+(i*0.08).toFixed(2)+'s"><span class="ix">'+pad2(i+1)+'</span><h3 class="h4">'+esc(v[0])+'</h3><p>'+esc(v[1])+'</p></div>';}).join('')+'</div></div></section>'+

  '<section class="sec light"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Our word')+mask(['What we promise,','and what we never will.'],'h2','d2')+'</div></div>'+promise()+'</div></section>'+

  '<section class="sec light alt" id="leadership"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Leadership')+mask(['The people','accountable.'],'h2','d2')+'</div><p class="lead" data-r style="--d:.15s">Imperial is led by its founder, with one Group team working across every division. Each division\u2019s own leadership is introduced on its website.</p></div>'+
   '<div class="leaders real">'+D.leadership.map(function(l,i){return '<div class="leader'+(l.img?'':' more')+'" data-r style="--d:'+(i*0.08).toFixed(2)+'s">'+(l.img?'<div class="portrait has-photo">'+img('people/'+l.img, l.name)+'</div>':'')+'<div class="role">'+esc(l.role)+'</div><h3>'+esc(l.name||l.area)+'</h3><p>'+(l.name?esc(l.area)+'<br>Biography: '+tbc('to be approved'):'Introduced on each division\u2019s website.')+'</p></div>';}).join('')+'</div></div></section>'+

  '<section class="sec light founder-film" id="founder-film"><div class="wrap split"><div>'+eyebrow('Founder film')+mask(['The founder,','on film.'],'h2','d2')+'<p class="lead" data-r style="--d:.15s">A short film with the founder, 60 to 90 seconds, is planned for this page. '+tbc('Footage to be supplied')+'</p></div>'+videoBlock(VID.about,'')+'</div></section>'+

  '<section class="sec deep"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Where we work')+mask(['Led from Dubai.','At home worldwide.'],'h2','d2')+'</div></div>'+mapBlock()+'</div></section>'+closing();
};

V.divisions = function(){
  return pageHero({img:'partners', crumb:[['Divisions',null]], eyebrow:'Our divisions', title:['Five houses.','One table.'], lead:'Each house is a specialist. Together they sit at one table, with one Relationship Manager across all five.'})+
  '<section class="sec"><div class="wrap"><div class="dindex" id="dindex">'+D.divisions.map(function(d,i){
    return '<a class="drow" href="#/divisions/'+d.key+'" data-dv="'+d.key+'" data-r style="--d:'+(i*0.07).toFixed(2)+'s"><span class="no">'+pad2(i+1)+'</span><span class="nm">'+esc(d.short)+'</span><span class="ln">'+esc(d.line)+'</span><span class="st">'+esc(d.status)+'</span>'+AR+'</a>';
  }).join('')+'</div></div></section>'+finderSec()+compare()+
  '<section class="sec light alt"><div class="wrap"><div class="sec-head"><div>'+eyebrow('How we work')+mask(['Come for one thing.','Find a whole house.'],'h2','d2')+'</div><p class="lead" data-r>One shared team works across every division. You never have to explain your family twice.</p></div>'+steps(D.steps)+'</div></section>'+
  '<section class="sec light"><div class="wrap"><div class="sec-head"><div>'+eyebrow('The houses online')+mask(['Visit a house','directly.'],'h2','d2')+'</div><p class="lead" data-r>Imperial Citizenship has its own website today. The others are in preparation; their links will be added before launch.</p></div>'+
   '<div class="sites">'+D.sites.filter(function(s){return !s.home && !s.soon;}).map(function(s,i){return siteLink(s,'site', '<b>'+esc(s.name)+'</b><span>'+esc(s.label)+'</span>'+NE).replace('class="site"','class="site" data-r style="--d:'+(i*0.07).toFixed(2)+'s"');}).join('')+'</div></div></section>'+closing();
};

function heroTitle(d){return {citizenship:['Second residency','and citizenship.'],'private-office':['One lasting','relationship.'],'partners-club':['Introduce with','confidence.'],academy:['One standard,','learned by everyone.']}[d.key];}
function whatTitle(d){return {citizenship:['Residency and citizenship,','compared side by side.'],'private-office':['Everything a wider','life needs.'],'partners-club':['Built for the people','who introduce.'],academy:['What the','Academy does.']}[d.key]||['What we do.'];}
function ctaTitle(d){return {citizenship:['Begin with','Imperial Citizenship.'],'private-office':['Continue with','Private Office.'],'partners-club':['Introduce with','confidence.'],academy:['Learn the','Imperial standard.']}[d.key]||[esc(d.name)];}
function others(d){
  var list = D.divisions.filter(function(x){return x.key!==d.key;});
  return '<section class="sec line-t"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Explore the other houses')+mask(['One table.'],'h2','d2')+'</div><div data-r style="--d:.1s"><a class="tlink" href="#/divisions">All divisions'+AR+'</a></div></div><div class="rail" id="rail" aria-label="Other divisions">'+
   list.map(function(x,i){return '<a href="#/divisions/'+x.key+'" data-dv="'+x.key+'" data-r style="--d:'+(i*0.08).toFixed(2)+'s"><div class="rail-img">'+img(x.img,null,'','-c')+(x.soon?'<span class="badge soon">Coming soon</span>':'')+'</div><b>'+esc(x.short)+'</b><span>'+esc(x.line)+'</span></a>';}).join('')+'</div></div></section>';
}
V.division = function(key){
  var d = div(key); if(!d) return null;
  if(d.soon) return V.realEstate(d);
  var logo = d.logo ? '<img class="ph-logo" src="'+LOGO+d.logo+'-Horizontal-Gold.svg" alt="'+esc(d.name)+'" data-r>' : '<div data-r style="margin-bottom:26px">'+logoImg(d,'White','')+'</div>';
  var badge = '<div data-r style="margin-bottom:22px"><span class="badge'+(d.statusTone==='gold'?' gold':'')+'">'+esc(d.status)+'</span></div>';
  var h = pageHero({img:d.img, crumb:[['Divisions','#/divisions'],[d.short,null]], pre:logo+badge, title:heroTitle(d), lead:esc(d.line)});
  h += '<section class="sec"><div class="wrap split"><div>'+eyebrow('Overview')+'<p class="statement" data-r>'+esc(d.intro)+'</p></div>'+
    '<div class="glance" role="region" data-r style="--d:.15s" aria-label="At a glance"><dl><dt>Division</dt><dd>'+esc(d.name)+'</dd><dt>Status</dt><dd>'+esc(d.status)+'</dd><dt>For</dt><dd>'+esc(d.who[0])+'</dd><dt>Website</dt><dd>'+(d.cta.real?'<a class="tlink" href="'+d.cta.href+'" target="_blank" rel="noopener">'+esc(d.cta.domain)+NE+'</a>':tbc(d.cta.tbc))+'</dd></dl>'+
    '<div class="btns">'+extLink(d,'btn')+'<a class="btn line" href="#/contact?about='+d.key+'"><span>Speak to us</span></a></div></div></div></section>';
  h += '<section class="sec light"><div class="wrap"><div class="sec-head"><div>'+eyebrow('What we do')+mask(whatTitle(d),'h2','d2')+'</div></div><div class="does">'+
    d.does.map(function(x,i){return '<div data-r style="--d:'+(i%3*0.1).toFixed(2)+'s"><span class="ix">'+pad2(i+1)+'</span><h3 class="h3">'+esc(x[0])+'</h3><p>'+esc(x[1])+'</p>'+(x[2]?tbc(x[2]):'')+'</div>';}).join('')+
    (d.does.length%3===2?'<div data-r style="--d:.2s"><span class="ix ix-rule" aria-hidden="true"></span><h3 class="h3">Not sure which applies?</h3><p>That is what the first conversation is for.</p><a class="tlink" href="#/contact?about='+d.key+'">Speak to us'+AR+'</a></div>':'')+'</div></div></section>';
  h += '<section class="sec"><div class="wrap split"><div>'+eyebrow('Who it is for')+mask(['Who we','work with.'],'h2','d2')+'</div><ul class="who">'+d.who.map(function(w,i){return '<li data-r style="--d:'+(i*0.1).toFixed(2)+'s"><span>'+pad2(i+1)+'</span>'+esc(w)+'</li>';}).join('')+'</ul></div></section>';
  if(d.how) h += '<section class="sec light alt"><div class="wrap"><div class="sec-head"><div>'+eyebrow('How it works')+mask([d.howTitle],'h2','d2')+'</div></div>'+steps(d.how)+
    (d.includes?'<div style="margin-top:clamp(64px,7vw,100px)"><div class="eyebrow" data-r>Every plan includes</div><div class="includes">'+d.includes.map(function(x,i){return '<div data-r style="--d:'+(i%4*0.07).toFixed(2)+'s"><span>'+pad2(i+1)+'</span>'+esc(x)+'</div>';}).join('')+'</div></div>':'')+
    (d.standards?'<div style="margin-top:clamp(64px,7vw,100px)" class="split"><div>'+eyebrow('Shared standards')+'<h3 class="d3" data-r>Your reputation travels with ours.</h3></div><ul class="plist yes" data-r>'+d.standards.map(function(t){return '<li>'+TICK+'<span>'+esc(t)+'</span></li>';}).join('')+'</ul></div>':'')+
    '<div class="callout" data-r><div><b>Please note</b>'+esc(d.note)+'</div></div></div></section>';
  h += (d.key==='citizenship' ? fitCheck()+guideForm() : '')+enquiryBlock(d.key);
  h += '<section class="sec deep"><div class="wrap cta-band"><div>'+(d.logo?'<img class="div-logo" src="'+LOGO+d.logo+'-Horizontal-Gold.svg" alt="" data-r>':'<div data-r style="margin-bottom:30px">'+logoImg(d,'Gold','')+'</div>')+mask(ctaTitle(d),'h2','d2')+'<p class="lead" data-r style="margin-top:22px">'+(d.cta.real?(d.key==='citizenship'?'Programmes, eligibility and the team behind them':'Services, the team and how to begin')+', on the '+esc(d.cta.siteName)+' website.':'The '+esc(d.name)+' website is in preparation. In the meantime, speak to us and we will connect you.')+'</p></div>'+
    '<div class="btns" data-r>'+extLink(d,'btn gold')+'<a class="btn line" href="#/contact?about='+d.key+'"><span>Speak to us</span></a></div></div></section>';
  return h + others(d);
};
V.realEstate = function(d){
  var h = pageHero({img:d.img, crumb:[['Divisions','#/divisions'],['Real Estate',null]], pre:'<img class="ph-logo" src="'+LOGO+'IR-Horizontal-Gold.svg" alt="Imperial Real Estate" data-r><div data-r style="margin-bottom:22px"><span class="badge soon">Coming soon</span></div>', title:['Licensed property','advisory, starting','with Dubai.'], lead:'Imperial Real Estate is licensed and has not yet launched. Register your interest and we will be in touch when it opens.', after:'<div class="btns" data-r style="--d:.5s;margin-top:30px"><a class="btn" href="#/divisions/real-estate" data-scroll="register"><span>Register interest</span>'+AR+'</a></div>'});
  h += '<section class="sec light"><div class="wrap split"><div>'+eyebrow('Overview')+'<p class="statement" data-r style="color:var(--l-text)">'+esc(d.intro)+'</p>'+
    '<h2 class="vh">What Imperial Real Estate will do</h2><div class="does two" style="margin-top:56px">'+d.does.map(function(x,i){return '<div data-r style="--d:'+(i%2*0.1).toFixed(2)+'s"><span class="ix">'+pad2(i+1)+'</span><h3 class="h3">'+esc(x[0])+'</h3><p>'+esc(x[1])+'</p></div>';}).join('')+'</div>'+
    '<div class="callout" data-r><div><b>Please note</b>'+esc(d.note)+' '+tbc('Licence number and regulator')+'</div></div></div>'+
    '<div id="register" data-r style="--d:.15s">'+registerForm()+'</div></div></section>';
  return h + others(d);
};
function registerForm(){
  return '<div class="form-card" data-form="interest"><form novalidate name="interest" method="post"><input type="hidden" name="form-name" value="interest"><label class="hp" aria-hidden="true">Leave this empty <input name="company_url" tabindex="-1" autocomplete="off"></label><div class="eyebrow">Register interest</div><h2 class="d3" style="margin-bottom:12px">Be first to hear.</h2><p class="muted small" style="margin-bottom:28px">Tell us a little about what you are looking for. We will contact you when Imperial Real Estate launches.</p>'+
   '<div class="fgrid"><label class="field"><span>Full name</span><input name="name" autocomplete="name" required><em class="em">Please enter your name.</em></label>'+
   '<label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" required><em class="em">Please enter a valid email address.</em></label>'+
   '<label class="field"><span>Country of residence</span><input name="country" autocomplete="country-name" required><em class="em">Please tell us where you live.</em></label>'+
   '<label class="field"><span>I am interested in</span><select name="interest" required><option value="">Choose one</option><option>A family home in Dubai</option><option>Property linked to UAE residency</option><option>An investment property</option><option>Not sure yet</option></select><em class="em">Please choose an option.</em></label>'+
   '<label class="field full"><span>Anything else <i>(optional)</i></span><textarea name="msg" rows="3"></textarea></label></div>'+
   consentBox('I agree to Imperial Holdings Group contacting me about Imperial Real Estate, as described in the {privacy}.')+
   '<div class="form-foot"><button class="btn" type="submit"><span class="lbl">Register interest</span><span class="spin"></span></button><span class="xs">We use these details only to contact you about Imperial Real Estate.</span></div><div class="form-err" role="alert" hidden></div></form></div>';
}

V.insights = function(q){
  var pre = (q && q.cat) || 'All';
  var cats = ['All'].concat(D.insights.map(function(a){return a.cat;}).filter(function(v,i,s){return s.indexOf(v)===i;}));
  return pageHero({img:'academy', cls:'short', crumb:[['Insights',null]], eyebrow:'Insights', title:['Notes from','the house.'], lead:'Plain-spoken guidance on mobility, family planning and working with Imperial.'})+
  '<section class="sec light"><div class="wrap">'+(D.insights.some(function(a){return a.draft;})?'<div class="notice" data-r><span class="sample">Draft</span><div><b>Draft, awaiting approval.</b> These articles are drafts and will be published once the copy has been approved.</div></div>':'')+
   '<div class="filters" role="group" aria-label="Filter insights" data-r>'+cats.map(function(c){var n=c==='All'?D.insights.length:D.insights.filter(function(a){return a.cat===c;}).length, on=c===pre;return '<button class="'+(on?'on':'')+'" data-filter="'+esc(c)+'" aria-pressed="'+on+'">'+esc(c)+' <small>'+n+'</small></button>';}).join('')+'</div>'+
   '<h2 class="vh">Articles</h2><div class="icards four" id="icards">'+D.insights.map(function(a,i){var h=insightCard(a,i);return pre!=='All'&&a.cat!==pre?h.replace('class="icard"','class="icard hide"'):h;}).join('')+'</div><p class="vh" id="filterMsg" aria-live="polite"></p></div></section>'+closing();
};
V.article = function(slug){
  var a=null; D.insights.forEach(function(x){if(x.slug===slug) a=x;}); if(!a) return null;
  var bodyH = a.body.map(function(b){return b[0]==='h'?'<h2 data-r>'+esc(b[1])+'</h2>':b[0]==='q'?'<blockquote data-r>'+esc(b[1])+'</blockquote>':'<p data-r>'+esc(b[1])+'</p>';}).join('');
  var ix = D.insights.indexOf(a), prev = D.insights[(ix-1+D.insights.length)%D.insights.length], next = D.insights[(ix+1)%D.insights.length];
  return pageHero({img:a.img, crumb:[['Insights','#/insights'],[a.cat,null]], pre:(a.draft?'<div data-r style="margin-bottom:18px"><span class="sample">Draft, awaiting approval</span></div>':''), eyebrow:a.cat, title:splitTitle(a.title), lead:'About '+readMins(a)+' minute read'})+
  '<section class="sec light"><div class="wrap"><article class="article" id="article">'+(a.draft?'<div class="notice" data-r><span class="sample">Draft</span><div><b>Draft, awaiting approval.</b> Final copy to be approved before publication. Author and publication date: '+tbc('to confirm')+'</div></div>':'')+'<p class="article-dek" data-r>'+esc(a.dek)+'</p>'+shareBar(a)+bodyH+
  '<div class="art-end" data-r>'+shareBar(a)+'<a class="tlink" href="#/contact">Speak to us'+AR+'</a></div>'+
  '<nav class="pn" aria-label="More articles" data-r><a href="#/insights/'+prev.slug+'"><small>'+BACK+' Previous</small><b>'+esc(prev.title)+'</b></a><a href="#/insights/'+next.slug+'"><small>Next '+AR+'</small><b>'+esc(next.title)+'</b></a></nav></article></div></section>'+
  relatedRow('article', a);
};
function splitTitle(t){
  var w = t.replace(/\.$/,'').split(' '), lines=[], cur='';
  w.forEach(function(x){ if((cur+' '+x).trim().length>22 && cur){lines.push(cur);cur=x;} else cur=(cur+' '+x).trim(); });
  if(cur) lines.push(cur); return lines.map(esc);
}

/* ---------- v4: events, journal, enquiry, finder section ---------- */
function evWhen(e){ return e.date ? esc(e.date) : ''; }
function eventCard(e,i){
  var k = 'events/'+e.slug+'/cover', ok = photoAllowed(k);
  return '<a class="ev" href="#/journal/events/'+e.slug+'" data-r style="--d:'+(i%3*0.1).toFixed(2)+'s"><figure>'+img(cardPhoto(e), '')+'</figure><div class="ev-b"><div class="meta">'+esc(e.cat)+' <i aria-hidden="true">·</i> '+esc(e.city)+(e.date?' <i aria-hidden="true">·</i> '+evWhen(e):'')+(e.video && e.video.id?' <i aria-hidden="true">·</i> <span class="vmark">'+PLAY+'Video</span>':'')+'</div><h3>'+esc(e.title)+'</h3><p>'+esc(e.dek)+'</p><span class="tlink">'+(ok ? e.n+' photographs' : 'Read the story')+AR+'</span></div></a>';
}
function journalRow(j,i){
  var ok = photoAllowed(j.img), k = rowPhoto(j), v = ok ? (j.own?'':'-c') : variantOf(k);
  var meta = esc(j.kind)+(j.date?' <i aria-hidden="true">·</i> '+esc(j.date):'')+(j.video && j.video.id?' <i aria-hidden="true">·</i> <span class="vmark">'+PLAY+'Video</span>':'');
  return '<a class="jrow" href="#'+j.to+'" data-r style="--d:'+(i%3*0.08).toFixed(2)+'s"><figure>'+img(k, '', '', v)+'</figure><div class="jb"><div class="meta">'+meta+'</div><h3>'+esc(j.title)+'</h3><p>'+esc(j.dek)+'</p><span class="tlink">Read on'+AR+'</span></div></a>';
}
V.journal = function(){
  var evs = sortByIso(D.events), rows = sortByIso(D.journal), allOk = evs.every(function(e){return e.consent;});
  return pageHero({img:'events/lagos-diplomatic-soiree-2025/cover', fb:'events/easter-polo-cup-2026/02', cls:'short', crumb:[['Journal',null]], eyebrow:'Events &amp; Journal', title:['Selected events.','Selected words.'], lead:'Genuine company developments, insights, partnerships and selected gatherings. Fewer entries, chosen with care.'})+
  '<section class="sec light" id="events"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Selected events')+mask(['Where the','network meets.'],'h2','d2')+'</div><p class="lead" data-r style="--d:.15s">Diplomatic collaborations, private gatherings and partnerships, in Dubai and Lagos. '+(allOk ? 'One cover photograph for each, and a gallery inside.' : 'Galleries open as guests confirm they are happy to be featured.')+'</p></div>'+
   '<div class="evgrid">'+evs.map(eventCard).join('')+'</div>'+
   '<p class="xs" data-r style="margin-top:32px">'+(allOk ? 'Photographs of guests are published with their permission.' : 'Photographs of guests appear once they have confirmed they are happy to be featured.')+'</p></div></section>'+
  '<section class="sec light alt" id="entries"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Journal')+mask(['Developments, insights','and partnerships.'],'h2','d2')+'</div><div data-r style="--d:.15s"><p class="lead">Company developments, selected insights and partnerships.</p></div></div>'+
   '<div class="jlist">'+rows.map(journalRow).join('')+'</div></div></section>'+closing();
};
V.event = function(slug){
  var list = sortByIso(D.events), e = null, ix = -1; list.forEach(function(x,i){ if(x.slug===slug){ e = x; ix = i; } }); if(!e) return null;
  var n = list.length, prev = list[(ix-1+n)%n], next = list[(ix+1)%n], ok = photoAllowed('events/'+e.slug+'/01'), fb = eventSafe(e), fb2 = eventSafe(e, true);
  var facts = []; if(e.date) facts.push(['When', evWhen(e)]);
  facts.push(['Where', (e.venue ? esc(e.venue)+', ' : tbc('Venue to confirm')+' ')+esc(e.city)], ['Kind', esc(e.cat)]);
  if(ok) facts.push(['Photographs', e.n+', Imperial']);   /* counted only while the gallery is shown */
  var gal = ''; if(ok) for(var i=1;i<=e.n;i++) gal += '<figure data-r style="--d:'+((i%2)*0.08).toFixed(2)+'s">'+img('events/'+e.slug+'/'+pad2(i), photoAlt('events/'+e.slug+'/'+pad2(i)) || (e.title+', photograph '+i+' of '+e.n))+'</figure>';
  var note = e.consent ? 'Photographs of guests are published with their permission.' : ok ? 'Preview build: photographs of guests are shown before their consent is recorded.' : 'Photographs will appear once guests have confirmed they are happy to be featured.';
  return pageHero({img:'events/'+e.slug+'/cover', fb:fb, crumb:[['Journal','#/journal'],[e.short,null]], eyebrow:esc(e.cat)+' <i>·</i> '+esc(e.city)+(e.date?' <i>·</i> '+esc(e.date):''), title:splitTitle(e.title), lead:esc(e.dek)})+
  '<section class="sec light"><div class="wrap split"><div>'+e.body.map(function(p){return '<p class="lead" data-r>'+esc(p)+'</p>';}).join('')+
    (e.guests?'<div data-r><div class="eyebrow" style="margin-top:34px">Among the guests</div><ul class="guests">'+e.guests.map(function(g){return '<li>'+esc(g)+'</li>';}).join('')+'</ul></div>':'')+
    (e.tbc?'<p class="xs ev-tbc" data-r style="margin-top:24px">'+e.tbc.map(tbc).join('')+'</p>':'')+
    (e.src?'<p class="xs" data-r>Source: '+esc(e.src)+'</p>':'')+
    '<div class="ev-share" data-r>'+shareBar(e, 'event')+'</div></div>'+
   '<div class="glance" data-r style="--d:.15s"><dl>'+facts.map(function(f){return '<dt>'+f[0]+'</dt><dd>'+f[1]+'</dd>';}).join('')+'</dl><div class="btns"><a class="btn" href="#/contact?about=group&audience=institutions"><span>Start a strategic conversation</span>'+AR+'</a><a class="btn line" href="#/journal"><span>All events</span></a></div></div></div></section>'+
  /* the heading says what is on the page: pictures while the gallery shows, the clip while only the video slot does */
  '<section class="sec light alt" id="gallery"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Gallery')+mask(ok ? ['The evening,','in pictures.'] : (e.video && e.video.id) ? ['The evening,','on film.'] : e.video ? ['Film and photographs','to follow.'] : ['Photographs','to follow.'],'h2','d2')+'</div><p class="xs gal-note" data-r>'+note+'</p></div>'+
    (e.video ? videoBlock(e.video, 'gal-vid', fb2) : '')+(ok ? '<div class="gallery">'+gal+'</div>' : '')+'</div></section>'+
  relatedRow('event', e)+
  '<section class="sec light"><div class="wrap"><nav class="pn" aria-label="More events" data-r><a href="#/journal/events/'+prev.slug+'"><small>'+BACK+' Previous</small><b>'+esc(prev.title)+'</b></a><a href="#/journal/events/'+next.slug+'"><small>Next '+AR+'</small><b>'+esc(next.title)+'</b></a></nav></div></section>'+closing();
};
/* home enquiry: one short form, qualified by audience and division, with source fields for Pipedrive */
function enquiryBlock(pre){
  var C = D.contact;
  return '<section class="sec light enq" id="enquire"><div class="wrap split"><div>'+eyebrow('Confidential <i>·</i> No obligation')+mask(['Begin with','one conversation.'],'h2','d2')+
    '<p class="lead" data-r style="--d:.15s;margin-top:26px">Tell us what you are planning. A senior adviser will read your enquiry and reply personally.</p>'+
    '<div class="kv enq-kv" data-r style="--d:.2s"><div><span>Email</span><a class="ul" href="mailto:'+C.email+'">'+esc(C.email)+'</a></div>'+C.offices.map(function(o){return '<div><span>'+esc(o.city)+'</span><a class="ul" href="tel:'+o.tel.replace(/\s/g,'')+'">'+esc(o.tel)+'</a></div>';}).join('')+'</div>'+
    '<p class="xs" data-r style="--d:.25s">Prefer three short steps? <a class="ul" href="#/contact'+(pre?'?about='+pre:'')+'">Use the guided form</a>.</p></div>'+
    '<div data-r style="--d:.15s">'+enquiryForm(pre)+'</div></div></section>';
}
var AUDS = [['clients','A private client'],['partners','A professional partner or introducer'],['institutions','An institution or strategic partner']];
/* v5 qualification (BUILD-CONTRACT 4.2): names, values and labels are fixed there and in shared/lead-schema.json */
var FOR_WHOM = [['myself','Myself'],['family','My family'],['client','A client I am introducing']];
var TIMELINES = [['3m','Within 3 months'],['3-12m','3 to 12 months'],['exploring','Just exploring for now']];
/* TO CONFIRM (Founder): the bands and the currency come from docs/BUILD-CONTRACT.md 4.2, not from the brief, which asks only
   for broad bands, optional and worded gently. shared/lead-schema.json lists the same values. */
var BUDGETS = [['under-250k','Under US$250,000'],['250k-500k','US$250,000 to 500,000'],['500k-1m','US$500,000 to 1 million'],['over-1m','Over US$1 million'],['undisclosed','I would rather not say yet']];
var RE_INTENTS = [['buy','Buy'],['rent','Rent']];
function labelOf(list, v){ for(var i=0;i<list.length;i++) if(list[i][0]===v) return list[i][1]; return v || ''; }
function selField(name, label, list, first, req, attrs){
  return '<label class="field"><span>'+label+'</span><select name="'+name+'"'+(req?' required':'')+(attrs||'')+'><option value="">'+esc(first)+'</option>'+list.map(function(o){ return '<option value="'+o[0]+'">'+esc(o[1])+'</option>'; }).join('')+'</select>'+(req?'<em class="em">Please choose one.</em>':'')+'</label>';
}
/* about you: nationality and who the enquiry is for */
function qualWho(){
  return '<label class="field"><span>Nationality, or nationalities</span><input name="nationality" autocomplete="off" required><em class="em">Please tell us your nationality.</em></label>'+selField('for_whom', 'This enquiry is for', FOR_WHOM, 'Choose one', true);
}
/* your message: timing, and a budget band only if the person would like to say */
function qualPlan(){
  return selField('timeline', 'When would you like to begin?', TIMELINES, 'Choose one', true)+selField('budget', 'A budget in mind <i>(optional)</i>', BUDGETS, 'If you wish to say', false);
}
/* shown by the choice: Partners Club (or a partner audience) asks for firm and profession; Real Estate asks buy or rent and the area.
   Hidden fields are disabled, so they are neither validated nor sent. data-req="choice" is required only when the choice itself is Partners Club. */
function condFields(){
  return '<div class="fgrid cond full" data-cond="partners" hidden><label class="field"><span>Firm</span><input name="firm" autocomplete="organization" data-req="choice" disabled><em class="em">Please tell us your firm.</em></label><label class="field"><span>Profession</span><input name="profession" autocomplete="organization-title" data-req="choice" disabled><em class="em">Please tell us your profession.</em></label></div>'+
    '<div class="fgrid cond full" data-cond="real-estate" hidden>'+selField('re_intent', 'I am looking to', RE_INTENTS, 'Choose one', false, ' data-req="1" disabled')+'<label class="field"><span>Area of interest <i>(optional)</i></span><input name="re_area" autocomplete="off" disabled></label></div>';
}
function bindCond(form){
  var conds = form.querySelectorAll('[data-cond]');
  function apply(){
    var ab = form.querySelector('input[name="about"]:checked'), dv = form.elements.namedItem('division'), v = ab ? ab.value : (dv ? dv.value : '');
    var aud = form.elements.namedItem('audience'), a = aud ? aud.value : '';
    var partners = v==='partners-club' ? 'choice' : (a==='partners' ? 'audience' : '');
    [].forEach.call(conds, function(box){
      var on = box.getAttribute('data-cond')==='partners' ? !!partners : v==='real-estate';
      box.hidden = !on;
      [].forEach.call(box.querySelectorAll('input,select'), function(f){
        var r = f.getAttribute('data-req');
        f.disabled = !on; f.required = on && (r==='1' || (r==='choice' && partners==='choice'));
        if(!on){ var b = f.closest('.field'); if(b) b.classList.remove('err','ok'); f.setAttribute('aria-invalid','false'); }
      });
    });
  }
  if(conds.length) [].forEach.call(form.querySelectorAll('input[name="about"], select[name="division"], select[name="audience"]'), function(f){ f.addEventListener('change', apply); });
  apply(); return apply;
}
function ensureHidden(form, name, value){ var f = form.elements.namedItem(name); if(f) return f; f = document.createElement('input'); f.type = 'hidden'; f.name = name; f.value = value; form.appendChild(f); return f; }
/* consent (brief 8): every consent box links the privacy notice next to it. Templates use consentBox(); bindForms adds the link
   to any consent box that still lacks one. */
/* It opens in a new tab, so the consent box never navigates a half-typed form away. */
var PRIVACY_LINK = '<a class="ul" href="#/privacy" target="_blank" rel="noopener">privacy notice</a>';
function consentBox(text){ return '<label class="consent"><input type="checkbox" name="consent" required><span>'+text.replace('{privacy}', PRIVACY_LINK)+'</span><em class="em">Please tick the box so that we can reply.</em></label>'; }
function ensurePrivacyLink(form){
  [].forEach.call(form.querySelectorAll('.consent'), function(c){ if(c.querySelector('a[href$="/privacy"]')) return; var s = c.querySelector('span') || c; s.insertAdjacentHTML('beforeend', ' See our '+PRIVACY_LINK+'.'); });
  fixLinks(form);
}
function enquiryForm(pre){
  return '<div class="form-card" data-form="enquiry" id="enq"><form novalidate name="enquiry" method="post"><input type="hidden" name="form-name" value="enquiry"><input type="hidden" name="routed_to" value=""><input type="hidden" name="site" value="'+esc(D.config.site)+'"><input type="hidden" name="lead_source" value="website"><input type="hidden" name="quiz_answers" value="">'+trackFields()+'<label class="hp" aria-hidden="true">Leave this empty <input name="company_url" tabindex="-1" autocomplete="off"></label>'+
   '<div class="eyebrow">Private enquiry</div>'+
   '<div class="fgrid"><label class="field"><span>I am</span><select name="audience" required><option value="">Choose one</option>'+AUDS.map(function(a){return '<option value="'+a[0]+'">'+a[1]+'</option>';}).join('')+'</select><em class="em">Please tell us who you are.</em></label>'+
   '<label class="field"><span>It concerns</span><select name="division" required><option value="">Choose the closest</option>'+D.enquiry.map(function(e){return '<option value="'+e.v+'"'+(pre===e.v?' selected':'')+'>'+esc(e.l)+'</option>';}).join('')+'</select><em class="em">Please choose the closest.</em></label>'+
   '<label class="field"><span>Full name</span><input name="name" autocomplete="name" required><em class="em">Please enter your name.</em></label>'+
   '<label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" inputmode="email" required><em class="em">Please enter a valid email address.</em></label>'+
   '<label class="field"><span>Phone, with country code <i>(optional)</i></span><input name="phone" type="tel" autocomplete="tel" inputmode="tel"></label>'+
   '<label class="field"><span>Country of residence</span><input name="country" autocomplete="country-name" required><em class="em">Please tell us where you live.</em></label>'+
   qualWho()+qualPlan()+condFields()+
   '<label class="field full"><span>How can we help?</span><textarea name="msg" rows="4" required></textarea><em class="em">A few lines are enough.</em></label></div>'+
   consentBox('I agree to Imperial Holdings Group using these details to respond to my enquiry, as described in the {privacy}.')+
   '<div class="form-foot"><button class="btn gold" type="submit"><span class="lbl">Send enquiry</span><span class="spin"></span></button><span class="xs">We use your details only to reply to this enquiry.</span></div><div class="form-err" role="alert" hidden></div></form></div>';
}
function finderSec(){
  return '<section class="sec line-t" id="finder-sec"><div class="wrap"><div class="sec-head"><div>'+eyebrow('Not sure where to start?')+mask(['Find your','house.'],'h2','d2')+'</div><p class="lead" data-r style="--d:.15s">Two questions, and we will show which divisions would sit at your table. A starting point, not advice.</p></div>'+finder()+'</div></section>';
}

V.contact = function(q){
  var pre = q.about || '', goals = (q.goals||'').split(',').filter(function(g){return D.finder.goals[g];});
  var gl = goals.map(function(g){for(var i=0;i<D.ambitions.length;i++) if(D.ambitions[i][0].toLowerCase()===g) return D.ambitions[i][0]; return g;});
  var steps = ['What it is about','About you','Your message'];
  return pageHero({img:'about', cls:'short', crumb:[['Contact',null]], eyebrow:'Speak to us', title:['Shall we begin?'], lead:'Three short steps. Tell us where you are, and where you would like to be. We will make sure the right house picks it up, with one person as your point of contact.'})+
  '<section class="sec light"><div class="wrap split cf-split"><div data-r><div class="form-card" data-form="contact" id="cf"><form novalidate name="contact" method="post">'+
   '<input type="hidden" name="form-name" value="contact"><input type="hidden" name="routed_to" value=""><input type="hidden" name="interests" value="'+esc(gl.join(', '))+'"><input type="hidden" name="audience" value="'+esc(q.audience||'')+'">'+trackFields()+
   '<label class="hp" aria-hidden="true">Leave this empty <input name="company_url" tabindex="-1" autocomplete="off"></label>'+
   '<div class="draft" id="draft" hidden><span>We kept what you started earlier.</span><button class="tlink" type="button" data-clear-draft>Start afresh</button></div>'+
   '<ol class="cf-prog" id="cfProg" aria-label="Progress">'+steps.map(function(s,i){return '<li class="'+(i===0?'cur':'')+'"'+(i===0?' aria-current="step"':'')+'>'+(i+1)+'. '+s+'</li>';}).join('')+'</ol>'+
   /* step 1 */
   '<div class="cf-step on" data-step="1"><h2 tabindex="-1">What can we help with?</h2><p>Choose the closest. We route it to the right house, and you keep one point of contact.</p>'+
   (gl.length?'<p class="from-finder"><span>From the house finder</span>'+gl.map(function(g){return '<b>'+esc(g)+'</b>';}).join('')+'</p>':'')+
   '<div class="routes-wrap"><div class="routes" role="radiogroup" aria-label="What can we help with?" aria-describedby="routeErr">'+
   D.enquiry.map(function(e){var d=div(e.to);return '<label><input type="radio" name="about" value="'+e.v+'"'+(pre===e.v?' checked':'')+'><span class="rt"><small>'+(d?esc(d.short):'Group')+'</small>'+esc(e.l)+'</span></label>';}).join('')+
   '</div><p class="route-err" id="routeErr">Please choose what we can help with.</p></div>'+
   '<div class="routing" id="routing"><div><div class="routing-card" id="routingCard"></div></div></div>'+
   '<div class="cf-nav"><span class="xs">Step 1 of 3</span><button class="btn" type="submit" data-next><span class="lbl">Continue</span>'+AR+'</button></div></div>'+
   /* step 2 */
   '<div class="cf-step" data-step="2"><h2 tabindex="-1">About you</h2><p>So the right person can reply. We only use these details to respond.</p>'+
   '<div class="fgrid"><label class="field"><span>Full name</span><input name="name" autocomplete="name" required><em class="em">Please enter your name.</em></label>'+
   '<label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" inputmode="email" required><em class="em">Please enter a valid email address.</em></label>'+
   '<label class="field"><span>Phone, with country code <i>(optional)</i></span><input name="phone" type="tel" autocomplete="tel" inputmode="tel"></label>'+
   '<label class="field"><span>Country of residence</span><input name="country" autocomplete="country-name" required><em class="em">Please tell us where you live.</em></label>'+
   qualWho()+
   '<label class="field full"><span>Preferred way to reach you</span><select name="pref"><option>Email</option><option>Phone call</option><option>Either</option></select></label></div>'+
   '<div class="cf-nav"><button class="btn line" type="button" data-back>'+BACK+'<span>Back</span></button><button class="btn" type="submit" data-next><span class="lbl">Continue</span>'+AR+'</button></div></div>'+
   /* step 3 */
   '<div class="cf-step" data-step="3"><h2 tabindex="-1">Your message</h2><p>A few lines are enough. No documents are needed for a first conversation.</p>'+
   '<dl class="cf-review" id="cfReview"></dl>'+
   '<div class="fgrid qual">'+qualPlan()+'</div>'+condFields()+
   '<label class="field"><span>How can we help?</span><textarea name="msg" required placeholder="A few lines about your family, your plans or your practice."></textarea><em class="em">Please tell us a little about your enquiry.</em></label>'+
   consentBox('I agree to Imperial Holdings Group using these details to respond to my enquiry, as described in the {privacy}.')+
   '<div class="cf-nav"><button class="btn line" type="button" data-back>'+BACK+'<span>Back</span></button><button class="btn" type="submit" data-send><span class="lbl">Send enquiry</span><span class="spin"></span></button></div>'+
   '<p class="xs" style="margin-top:16px">We use these details only to respond. Nothing is shared beyond what a service needs.</p></div>'+
   /* one error box for the three steps, outside them so it stays in view when a step is shown again (a refused address sends the person back to step 2) */
   '<div class="form-err" role="alert" hidden></div>'+
   '</form></div></div>'+
   '<div data-r style="--d:.15s" class="cf-side">'+
    D.contact.offices.map(function(o,i){return '<div class="side-card">'+(i===0?'<div class="eyebrow">Offices</div>':'')+'<h3 class="h3">'+esc(o.city)+' <span class="muted small" style="font-weight:400">'+esc(o.role)+'</span></h3><p class="clock" data-tz="'+o.tz+'" data-fmt="long">--:--</p><div class="kv"><div><span>Address</span>'+o.lines.map(esc).join('<br>')+'</div><div><span>Phone</span><a class="ul" href="tel:'+o.tel.replace(/\s/g,'')+'">'+esc(o.tel)+'</a></div></div>'+waSide(o)+'</div>';}).join('')+
    '<div class="side-card"><h3 class="h3">Online</h3><div class="kv"><div><span>Email</span><a class="ul" href="mailto:'+D.contact.email+'">'+esc(D.contact.email)+'</a></div><div><span>Book a first conversation</span>'+bookingSide()+'</div></div></div>'+
    '<div class="side-card"><h3 class="h4">Before we speak</h3><p>You do not need any documents for the first conversation. It helps to think about who would be included, where you live and hold citizenship today, and any dates that matter.</p><p class="small muted">The first conversation is for listening. You do not have to decide anything on the first call.</p></div>'+
   '</div></div></section>'+
  '<section class="sec light alt" id="faq"><div class="wrap split"><div>'+eyebrow('Questions')+mask(['Before you','get in touch.'],'h2','d2')+'<p class="lead" data-r style="--d:.15s;margin-top:26px">Short answers to what people ask most. Anything else, ask us directly.</p></div>'+faqList(D.faq,'c')+'</div></section>';
};

/* Legal pages (brief section 8). The copy lives in D.legal; this only renders it. In the copy, [[text]] becomes the amber
   TO CONFIRM placeholder, {email} the group mailbox and {offices:true} both office addresses. The amber notice at the top
   stays until counsel has approved the page. */
function legalText(s){
  return String(s).split(/(\[\[[^\]]+\]\]|\{email\})/).map(function(part){
    if(part==='{email}') return '<a class="ul" href="mailto:'+D.contact.email+'">'+esc(D.contact.email)+'</a>';
    var m = /^\[\[([^\]]+)\]\]$/.exec(part); return m ? tbc(m[1]) : esc(part);
  }).join('');
}
function legalOffices(){
  return '<div class="legal-offices">'+D.contact.offices.map(function(o){ return '<div><b>'+esc(o.city)+'</b>'+o.lines.map(esc).join('<br>')+'<br><a class="ul" href="tel:'+o.tel.replace(/\s/g,'')+'">'+esc(o.tel)+'</a></div>'; }).join('')+'</div>';
}
function legal(kind){
  var L = D.legal[kind], isP = kind==='privacy';
  var body = L.sections.map(function(s){
    return '<h2>'+esc(s.h)+'</h2>'+s.body.map(function(b){
      if(typeof b==='string') return '<p>'+legalText(b)+'</p>';
      if(b.offices) return legalOffices();
      return (b.lead ? '<p>'+legalText(b.lead)+'</p>' : '')+'<ul>'+b.ul.map(function(li){ return '<li>'+legalText(li)+'</li>'; }).join('')+'</ul>';
    }).join('');
  }).join('');
  return pageHero({cls:'plain', crumb:[[isP?'Privacy':'Terms',null]], eyebrow:'Legal', title:[esc(L.title)], lead:L.lead ? esc(L.lead) : null})+
  '<section class="sec light"><div class="wrap legal"><div class="notice" data-r><span class="tbc">Placeholder</span><div><b>Awaiting legal review.</b> '+
   (isP ? 'This notice describes what the site does today and is complete in substance. Counsel reviews and approves it before launch.' : 'This page is a placeholder. The final terms of use will be drafted and approved by counsel before launch.')+
   ' Legal entity, licence number and registered address: '+tbc('to confirm')+'</div></div>'+
  '<p class="small muted legal-updated">Last updated: '+(D.legal.updated ? esc(D.legal.updated) : tbc('Date of the version approved by counsel'))+'</p>'+
  body+'</div></section>';
}
V.privacy = function(){return legal('privacy');};
V.terms = function(){return legal('terms');};
/* 404 and error pages (brief 8): the same design, with both offices (telephone links) and the group email from D.contact. */
function nfContacts(){
  var C = D.contact;
  return '<div class="kv nf-kv" data-r style="--d:.4s">'+C.offices.map(function(o){ return '<div><span>'+esc(o.city)+'</span><a class="ul" href="tel:'+o.tel.replace(/\s/g,'')+'">'+esc(o.tel)+'</a></div>'; }).join('')+'<div><span>Email</span><a class="ul" href="mailto:'+C.email+'">'+esc(C.email)+'</a></div></div>';
}
V.notFound = function(){
  return '<section class="nf"><div class="ph-bg" style="opacity:.35"><div class="px">'+img('closing','')+'</div></div><div class="wrap" style="position:relative;z-index:2"><img class="crown" src="'+LOGO+'Imperial-Crown-Gold.svg" alt="" data-r>'+eyebrow('Page not found')+mask(['This page has moved,','or never existed.'],'h1','d2')+'<p class="lead" data-r style="--d:.2s;margin-top:20px">Let us take you somewhere useful.</p><div class="nf-links" data-r style="--d:.3s"><a class="btn gold" href="#/"><span>Home</span>'+AR+'</a><a class="tlink" href="#/divisions">Our divisions'+AR+'</a><a class="tlink" href="#/contact">Speak to us'+AR+'</a></div>'+nfContacts()+'</div></section>';
};
/* Shown by render() when a view throws (the error is logged), and written to error.html by the build. */
V.error = function(){
  return '<section class="nf err"><div class="ph-bg" style="opacity:.35"><div class="px">'+img('closing','')+'</div></div><div class="wrap" style="position:relative;z-index:2"><img class="crown" src="'+LOGO+'Imperial-Crown-Gold.svg" alt="" data-r>'+eyebrow('Error')+mask(['Something went wrong','on our side.'],'h1','d2')+'<p class="lead" data-r style="--d:.2s;margin-top:20px">Please try again in a moment. If it happens again, call or email us and we will take it from there.</p><div class="nf-links" data-r style="--d:.3s"><button class="btn gold" type="button" data-reload><span>Try again</span>'+AR+'</button><a class="tlink" href="#/">Home'+AR+'</a><a class="tlink" href="#/contact">Speak to us'+AR+'</a></div>'+nfContacts()+'</div></section>';
};

/* ---------- chrome: mega menu, mobile menu, footer ---------- */
/* Mobile menu thumbnails. The menu is laid out while hidden (translated above the viewport), which puts the five
   division photographs inside the browser's lazy-load margin, so a plain lazy img downloaded them at boot on every
   page, ahead of the hero. They start as a transparent pixel with the real file in data-src; setMM() swaps the src
   the first time the menu opens. The desktop mega menu keeps display:none until it opens, so its copies stay lazy. */
var PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
function menuImg(k, v){return '<img src="'+PIXEL+'" data-src="'+IMG+k+(v||'')+'.webp" alt=""'+dimsOf(k, v||'')+' loading="lazy" decoding="async">';}
function loadMenuImgs(scope){ [].forEach.call(scope.querySelectorAll('img[data-src]'), function(i){ i.src=i.getAttribute('data-src'); i.removeAttribute('data-src'); }); }
function buildChrome(){
  document.getElementById('megaIn').innerHTML =
    '<div class="mega-intro"><div class="eyebrow">Our ecosystem</div><div class="d3">Five divisions. One table.</div><p>One Relationship Manager across all five.</p><a class="tlink" href="#/divisions">All divisions'+AR+'</a></div>'+
    '<ul class="mega-list" id="megaList">'+D.divisions.map(function(d,i){return '<li><a class="mega-item'+(i===0?' on':'')+'" href="#/divisions/'+d.key+'" data-dv="'+d.key+'" data-i="'+i+'"><span class="n">'+pad2(i+1)+'</span><b>'+esc(d.name)+'</b><small>'+(d.soon?'Coming soon':esc(d.status))+'</small></a></li>';}).join('')+'</ul>'+
    '<div class="mega-prev" aria-hidden="true">'+D.divisions.map(function(d,i){return '<figure class="'+(i===0?'on':'')+'" data-i="'+i+'">'+img(d.img,'','','-c')+'<figcaption><b>'+esc(d.short)+'</b>'+esc(d.line)+'</figcaption></figure>';}).join('')+'</div>'+
    '<div class="mega-sites"><span>The houses online:</span>'+D.sites.map(function(s){return siteLink(s,'', siteText(s, true));}).join('')+'</div>';
  document.getElementById('mmIn').innerHTML = '<button class="mm-search" type="button" data-palette><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m13 13 4.5 4.5" stroke="currentColor" stroke-width="1.4"/></svg><span>Search the site</span></button><ul class="mm-links">'+
    '<li style="--i:0"><a href="#/"><span>Home</span><span class="ix">01</span></a></li>'+
    '<li style="--i:1"><a href="#/about"><span>About</span><span class="ix">02</span></a></li>'+
    '<li style="--i:2" class="mm-acc" id="mmAcc"><button aria-expanded="false" aria-controls="mmSub" id="mmDivBtn"><span>Our ecosystem</span><span class="plus" aria-hidden="true"></span></button><div class="mm-sub" id="mmSub"><div>'+
      '<a href="#/divisions"><span class="all"><img src="'+LOGO+'Imperial-Crown-Gold.svg" alt="" width="320" height="175"></span><span><b>All divisions</b><small>Five divisions, one table</small></span></a>'+
      D.divisions.map(function(d){return '<a href="#/divisions/'+d.key+'">'+menuImg(d.img,'-c')+'<span><b>'+esc(d.name)+'</b><small>'+(d.soon?'Coming soon':esc(d.status))+'</small></span></a>';}).join('')+'</div></div></li>'+
    '<li style="--i:3"><a href="#/" data-goto="network"><span>Our Network</span><span class="ix">04</span></a></li>'+
    '<li style="--i:4"><a href="#/journal"><span>Journal</span><span class="ix">05</span></a></li>'+
    '<li style="--i:5"><a href="#/contact"><span>Contact</span><span class="ix">06</span></a></li></ul>'+
    '<div class="mm-foot"><a class="btn gold" href="#/contact"><span>Enquire now</span>'+AR+'</a><div class="mm-meta"><span>DUBAI \u00b7 LAGOS \u00b7 WORLDWIDE</span><span class="clock" data-tz="Asia/Dubai">--:--</span></div><p class="mm-hint">Swipe up or press Esc to close</p></div>';
  var credits = D.photos.filter(function(p){return !p.own;}).map(function(p){return '<li><a href="https://unsplash.com/photos/'+p.id+'" target="_blank" rel="noopener">'+esc(p.what)+'</a> by '+esc(p.by)+'</li>';}).join('');
  document.getElementById('ftr').innerHTML = '<div class="wrap"><div class="ftr-top">'+
    '<div class="ftr-brand"><img src="'+LOGO+'IHG-Stacked-Gold.svg" alt="Imperial Holdings Group" loading="lazy" decoding="async"><p>Two cities. One horizon. Five specialist divisions, one standard, and one person who knows your family.</p></div>'+
    '<div><h2 class="fh">Divisions</h2><ul>'+D.divisions.map(function(d){return '<li><a href="#/divisions/'+d.key+'">'+esc(d.name)+(d.soon?' <small>Soon</small>':'')+'</a></li>';}).join('')+'</ul></div>'+
    '<div><h2 class="fh">The Group</h2><ul><li><a href="#/about">About</a></li><li><a href="#/divisions">Our ecosystem</a></li><li><a href="#/" data-goto="network">Our Network</a></li><li><a href="#/journal">Events and Journal</a></li><li><a href="#/contact">Contact</a></li><li><a href="#/contact?faq=0">Questions</a></li><li><button class="flink" type="button" data-palette>Search <kbd class="kb">'+KBD+'</kbd></button></li></ul></div>'+
    '<div><h2 class="fh">Offices</h2>'+D.contact.offices.map(function(o){return '<div class="off"><b>'+esc(o.city)+'</b>'+esc(o.role)+'<br>'+o.lines.map(esc).join('<br>')+'<br><a href="tel:'+o.tel.replace(/\s/g,'')+'">'+esc(o.tel)+'</a></div>';}).join('')+'<div class="off"><a href="mailto:'+D.contact.email+'">'+esc(D.contact.email)+'</a></div></div>'+
    '<div><h2 class="fh">Websites</h2><ul>'+D.sites.map(function(s){return '<li>'+siteLink(s,'', siteText(s, false))+'</li>';}).join('')+'</ul></div>'+
    '</div><div class="ftr-mid"><p>This website is for information only and is not an offer or advice. Advice on regulated matters such as tax, legal or investment is provided only by appropriately qualified specialists. Imperial does not guarantee government decisions or outcomes. '+tbc('Legal entity, licence number and registered address')+'</p>'+
    '<details class="credits"><summary>Photography: Imperial events and leadership (own), plus Unsplash licence</summary><ul>'+credits+'</ul></details></div>'+
    '<div class="ftr-bot"><span>\u00a9 '+new Date().getFullYear()+' Imperial Holdings Group.</span><span><a href="#/privacy">Privacy</a> &nbsp;\u00b7&nbsp; <a href="#/terms">Terms</a></span></div></div>';
}

/* ---------- router (one short cross-fade between views) ---------- */
/* data-prerendered carries the route the served file was built for (build/build.js), so the app can tell whether the
   markup on screen is the page the address now names. */
var first = true, lastPath = null, curView = null, pendingScroll = null, curQ = {}, prerendered = root.hasAttribute('data-prerendered'), PRE = root.getAttribute('data-prerendered') || '';
if(HIST && 'scrollRestoration' in history) history.scrollRestoration = 'manual';
function parse(){
  /* /about/, /about/index.html and the about.html copy the build writes all resolve to /about */
  var h = HIST ? (location.pathname.replace(/\/index\.html?$/,'/').replace(/(.)\.html?$/,'$1').replace(/(.)\/$/,'$1') + location.search) : location.hash.replace(/^#/,'');
  if(h==='' || h==='/') return {path:'/', parts:[], q:{}};
  if(h.charAt(0)!=='/') return null;
  var qs = h.split('?'), q = {};
  (qs[1]||'').split('&').forEach(function(kv){ if(!kv) return; var p=kv.split('='); q[decodeURIComponent(p[0])]=decodeURIComponent(p[1]||''); });
  var parts = qs[0].split('/').filter(Boolean);
  return {path:'/'+parts.join('/'), parts:parts, q:q};
}
function resolve0(r){
  if(!r) return {html:V.notFound(), title:'Page not found', nav:null, nf:true};
  var p = r.parts;
  if(p.length===0) return {html:V.home(), title:null, nav:'home', view:'home', desc:'Imperial Holdings Group: five specialist divisions, led from Dubai and Lagos. Citizenship, Private Office, Partners Club, Academy and Real Estate.'};
  if(p[0]==='about' && p.length===1) return {html:V.about(), title:'About', nav:'about', view:'about', desc:'Imperial began as a citizenship and residency specialist and has grown into a group of five specialist divisions, run by one team to one standard.'};
  if(p[0]==='divisions' && p.length===1) return {html:V.divisions(), title:'Divisions', nav:'divisions', view:'divisions', desc:'Citizenship, Private Office, Partners Club, Academy and Real Estate: five specialist houses at one table, with one Relationship Manager across all five.'};
  if(p[0]==='divisions' && p.length===2){ var d=div(p[1]); if(d) return {html:V.division(p[1]), title:d.name, nav:'divisions', view:'division', desc:d.line}; }
  if(p[0]==='journal' && p.length===1) return {html:V.journal(), title:'Events and Journal', nav:'journal', view:'journal', desc:'Genuine company developments, insights, partnerships and selected Imperial events in Dubai and Lagos.'};
  if(p[0]==='journal' && p[1]==='events' && p.length===3){ var ev=V.event(p[2]); if(ev){ var e0=null; D.events.forEach(function(x){ if(x.slug===p[2]) e0=x; }); return {html:ev, title:e0.title, nav:'journal', view:'event', desc:e0.dek}; } }
  if(p[0]==='journal' && p[1]==='events' && p.length===2) return {html:V.journal(), title:'Events and Journal', nav:'journal', view:'journal', desc:'Selected Imperial events in Dubai and Lagos.'};
  if(p[0]==='insights' && p.length===1) return {html:V.insights(r.q), title:'Insights', nav:'journal', view:'insights', desc:'Plain-spoken guidance on mobility, family planning and working with Imperial.'};
  if(p[0]==='insights' && p.length===2){ var a=V.article(p[1]); if(a){ var ai=null; D.insights.forEach(function(x){ if(x.slug===p[1]) ai=x; }); return {html:a, title:ai.title, nav:'journal', view:'article', desc:ai.dek}; } }
  if(p[0]==='contact' && p.length===1) return {html:V.contact(r.q), title:'Contact', nav:'contact', view:'contact', desc:'Speak to Imperial Holdings Group. Three short steps, routed to the right house, with one person as your point of contact.'};
  if(p[0]==='privacy' && p.length===1) return {html:V.privacy(), title:'Privacy', nav:null, view:'legal', solid:true, desc:'Privacy notice for the Imperial Holdings Group website: who we are, what we collect through our enquiry forms, how we use it and your rights.'};
  if(p[0]==='terms' && p.length===1) return {html:V.terms(), title:'Terms', nav:null, view:'legal', solid:true, desc:'Terms of use for the Imperial Holdings Group website: information only, not advice, and no guarantee of any government decision or outcome.'};
  return {html:V.notFound(), title:'Page not found', nav:null, nf:true, view:'nf'};
}
/* ---------- v5 search: per-route canonical, social image, Open Graph type and structured data ----------
   pageMeta() decorates what resolve0() returns. Every fact comes from data.js (config, contact, divisions, events,
   insights, faq); nothing is invented here. The social image is the page's own hero photograph, or assets/img/og.jpg
   where a page has none. setMeta() writes it all into the head, so the prerender (build/build.js) and client-side
   navigation produce the same tags. */
var CFG = D.config || {}, SITE = String(CFG.siteUrl || '').replace(/\/+$/, '');
var ORG_NAME = 'Imperial Holdings Group', ORG_DESC = 'One house with five specialist divisions: Imperial Citizenship, Imperial Private Office, Imperial Partners Club, Imperial Academy and Imperial Real Estate.';
var CC = {'United Arab Emirates':'AE', 'Nigeria':'NG'};
function abs(p){ return SITE + '/' + String(p).replace(/^\//, ''); }
function postalLD(o){
  var ln = o.lines || [], loc = ln[1] || '', i = loc.indexOf(','), a = {'@type':'PostalAddress', streetAddress: ln[0] || '', addressLocality: o.city};
  if(i > -1) a.streetAddress += ', ' + loc.slice(0, i).trim();
  else { var pc = /(\d{4,})/.exec(loc); if(pc) a.postalCode = pc[1]; }
  if(ln[2]) a.addressCountry = CC[ln[2]] || ln[2];
  return a;
}
function placeLD(o){ return {'@type':'Place', name: o.city + ', ' + o.role, telephone: o.tel, address: postalLD(o)}; }
function orgRef(){ return {'@type':'Organization', '@id': SITE + '/#organization', name: ORG_NAME, url: SITE + '/', logo: {'@type':'ImageObject', url: abs('assets/logos/Imperial-Crown-Gold.svg')}}; }
function orgLD(){
  var C = D.contact, hq = C.offices[0], ref = orgRef();
  return {'@context':'https://schema.org', '@type':'Organization', '@id': ref['@id'], name: ORG_NAME, url: ref.url, logo: ref.logo, description: ORG_DESC, email: C.email, telephone: hq.tel, address: postalLD(hq), location: C.offices.map(placeLD),
    subOrganization: D.divisions.map(function(d){ var s = {'@type':'Organization', name: d.name}; if(d.cta && d.cta.real) s.url = d.cta.href; return s; })};
}
function officeLD(o){
  return {'@context':'https://schema.org', '@type':'LocalBusiness', '@id': SITE + '/contact#' + o.city.toLowerCase(), name: ORG_NAME + ', ' + o.city, description: o.role, url: SITE + '/contact', image: abs('assets/img/og.jpg'), telephone: o.tel, email: D.contact.email, address: postalLD(o), parentOrganization: orgRef()};
}
function crumbLD(list){
  var items = [['Home', '/']].concat(list);
  return {'@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement: items.map(function(c, i){ return {'@type':'ListItem', position: i + 1, name: c[0], item: c[1] === '/' ? SITE + '/' : SITE + c[1]}; })};
}
function fullDate(iso){ return /^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? iso : null; }
function countryOf(city){ var cc = null; D.contact.offices.forEach(function(o){ if(o.city === city && o.lines && o.lines[2]) cc = CC[o.lines[2]] || o.lines[2]; }); return cc; }
function heroImage(html){
  var m = /<section class="(?:ph|hh|nf)[^"]*">(?:(?!class="(?:ph-c|hh-c|wrap))[\s\S])*?<img src="(assets\/img\/[^"]+)"/.exec(html || '');
  return m ? abs(m[1]) : abs('assets/img/og.jpg');
}
function pageMeta(out, r){
  var p = r ? r.parts : [], path = r ? r.path : null, ld = [orgLD()], crumbs = null, x = null;
  out.path = path;
  if(out.desc) out.desc = metaDesc(out.desc);
  out.canonical = (!out.nf && path) ? (path === '/' ? SITE + '/' : SITE + path) : null;
  out.image = heroImage(out.html);
  out.type = (out.view === 'article' || out.view === 'event') ? 'article' : 'website';
  if(out.view === 'about') crumbs = [['About', '/about']];
  else if(out.view === 'divisions') crumbs = [['Divisions', '/divisions']];
  else if(out.view === 'division'){ x = div(p[1]); crumbs = [['Divisions', '/divisions'], [x.short, path]]; }
  else if(out.view === 'journal') crumbs = [['Journal', '/journal']];
  else if(out.view === 'event'){
    D.events.forEach(function(e){ if(e.slug === p[2]) x = e; });
    crumbs = [['Journal', '/journal'], [x.short, path]];
    /* Only what data.js records, and only where the block can be valid: Google requires name, startDate and location on
       an Event, so it is written for events with a full date and left out otherwise (a date is never invented). The
       venue is named only when known (recommended, not required). */
    if(fullDate(x.iso)){
      var ev = {'@context':'https://schema.org', '@type':'Event', name: x.title, description: x.dek, url: out.canonical, image: out.image, startDate: x.iso, location: {'@type':'Place', address: {'@type':'PostalAddress', addressLocality: x.city}}};
      if(x.venue) ev.location.name = x.venue;
      var cc = countryOf(x.city); if(cc) ev.location.address.addressCountry = cc;
      ld.push(ev);
    }
  }
  else if(out.view === 'insights'){ crumbs = [['Insights', '/insights']]; if(allDrafts()) out.noindex = true; }   /* a listing with only drafts behind it follows them: noindex until one is approved */
  else if(out.view === 'article'){
    D.insights.forEach(function(a){ if(a.slug === p[1]) x = a; });
    crumbs = [['Insights', '/insights'], [x.title, path]];
    if(x.draft) out.noindex = true;   /* a draft awaiting approval: reachable, never indexed (setMeta writes the tag) */
    var art = {'@context':'https://schema.org', '@type':'Article', headline: x.title, description: x.dek, articleSection: x.cat, url: out.canonical, mainEntityOfPage: out.canonical, image: out.image, author: orgRef(), publisher: orgRef()};
    if(fullDate(x.iso)) art.datePublished = x.iso;
    ld.push(art);
  }
  else if(out.view === 'contact'){
    crumbs = [['Contact', '/contact']];
    D.contact.offices.forEach(function(o){ ld.push(officeLD(o)); });
    ld.push({'@context':'https://schema.org', '@type':'FAQPage', mainEntity: D.faq.map(function(f){ return {'@type':'Question', name: f.q, acceptedAnswer: {'@type':'Answer', text: f.a}}; })});
  }
  else if(out.view === 'legal') crumbs = [[p[0] === 'privacy' ? 'Privacy' : 'Terms', path]];
  if(crumbs && out.canonical) ld.push(crumbLD(crumbs));
  out.ld = ld;
  return out;
}
function resolve(r){ return pageMeta(resolve0(r), r); }
/* Titles and descriptions sized for a search result: the brand suffix is shortened, then dropped, so the whole title
   stays within about 60 characters; a description over 160 characters is cut at a clause boundary, never reworded. */
function pageTitle(t){ if(!t) return 'Imperial Holdings Group · Two Cities. One Horizon.'; return t + (t.length <= 34 ? ' · Imperial Holdings Group' : t.length <= 49 ? ' · Imperial' : ''); }
function metaDesc(s){
  s = String(s || '').replace(/\s+/g, ' ').trim(); if(s.length <= 160) return s;
  var cut = s.slice(0, 160), i = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(', '), cut.lastIndexOf('; '));
  if(i > 60) return cut.slice(0, i) + '.';
  i = cut.lastIndexOf(' '); return cut.slice(0, i > 60 ? i : 157) + '…';
}
/* The first-touch values in a prerendered page's hidden form fields belong to the build, not the visitor: refresh them
   from TRK when the server markup is kept. The names mirror trackFields(). */
var TRK_KEYS = ['source','medium','campaign','utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','landing','referrer'];
var TRK_QUERY = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','ttclid'];
function refreshTracking(scope){ [].forEach.call(scope.querySelectorAll('input[type="hidden"]'), function(i){ if(TRK_KEYS.indexOf(i.name) > -1) i.value = TRK[i.name] || ''; }); }
function onlyTracking(q){ for(var k in q){ if(Object.prototype.hasOwnProperty.call(q, k) && TRK_QUERY.indexOf(k) < 0) return false; } return true; }
/* v5 trust (brief 8): a view that throws shows the error page instead of a blank screen. The error is logged, the
   chrome stays, so every other page and both offices remain one click away. The build calls showError() for error.html. */
function render(){
  try{ renderView(); }
  catch(err){ showError(err); }
}
function showError(err){
  if(err){ try{ console.error('Page render failed', err); }catch(e){} }
  app.innerHTML = V.error(); fixLinks(app);
  curView = 'error'; curQ = {};
  document.title = 'Something went wrong \u00b7 Imperial Holdings Group';
  setMeta({nf:true, desc:'Something went wrong on our side. Please try again in a moment, or call or email Imperial Holdings Group.', ld:[]});
  [].forEach.call(document.querySelectorAll('[data-nav]'), function(a){ if(a.tagName==='A') a.removeAttribute('aria-current'); else a.classList.remove('cur'); });
  body.classList.add('is-nf'); body.classList.remove('solid-hdr');
  var b = app.querySelector('[data-reload]'); if(b) b.addEventListener('click', function(){ location.reload(); });
  try{ enhance(); }catch(e){}
  prerendered = false;
}
function renderView(){
  var r = parse(), out = resolve(r);
  /* First render of a prerendered page: the browser has already painted this same markup (built by the same code), so
     it is kept, together with its largest contentful paint, and only behaviour is bound. That holds only when the file
     was built for the route now in the address (data-prerendered): an old /#/contact link lands on the prerendered home
     page and is rewritten to /contact before the app runs, so the home markup must be replaced. A query that changes
     the view (about, audience, goals, faq, cat; campaign parameters do not), or a page that resolves differently from
     what was served (404.html on a path the app knows), gets a full render too. */
  if(prerendered && r && (r.path === PRE || out.nf) && onlyTracking(r.q) && app.firstElementChild && !!out.nf === body.classList.contains('is-nf')) refreshTracking(app);
  else app.innerHTML = out.html;
  fixLinks(app);
  curView = out.view; curQ = r ? r.q : {};
  document.title = pageTitle(out.title);
  setMeta(out);
  /* analytics (shared/analytics.js): one page view per route change, none for a same-path re-render */
  if(window.ihgPageView && (r ? r.path : null) !== lastPath){ try{ window.ihgPageView(out.path || location.pathname, document.title); }catch(e){} }
  [].forEach.call(document.querySelectorAll('[data-nav]'), function(a){
    var on = a.getAttribute('data-nav')===out.nav;
    if(a.tagName==='A'){ if(on) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); }
    else a.classList.toggle('cur', on);
  });
  body.classList.toggle('is-nf', !!out.nf);
  body.classList.toggle('solid-hdr', !!out.solid);
  lastPath = r ? r.path : null;
  enhance();
  prerendered = false;
}
function landY(y){ return typeof y==='number' ? y : 0; }
function afterLand(){ if(pendingScroll){ var el=document.getElementById(pendingScroll); pendingScroll=null; if(el) window.scrollTo({top: el.getBoundingClientRect().top + window.pageYOffset - 90, behavior: reduced?'auto':'smooth'}); } }
function route(y){
  var r = parse(), path = r ? r.path : '#bad';
  closeMenus(true); closePal(true);
  if(first){ first=false; render(); if(typeof y==='number') window.scrollTo(0,y); setTimeout(afterLand, 60); return; }
  if(path===lastPath){ render(); window.scrollTo(0, landY(y)); afterLand(); return; }
  /* v6 (UX audit item 15): one 0.25 s cross-fade of the whole view (the browser's default view transition), no shared
     division image; without view transitions the new view fades in over 0.25 s; with reduced motion, neither */
  if(reduced){ render(); window.scrollTo(0,landY(y)); focusMain(); afterLand(); return; }
  if(document.startViewTransition){
    try{
      var vt = document.startViewTransition(function(){ render(); window.scrollTo(0,landY(y)); focusMain(); });
      var done = function(){ afterLand(); };
      vt.finished.then(done, done);
      if(vt.ready) vt.ready.catch(function(){});
      if(vt.updateCallbackDone) vt.updateCallbackDone.catch(function(){});
    }catch(e){ render(); window.scrollTo(0,landY(y)); focusMain(); afterLand(); }
    return;
  }
  render(); window.scrollTo(0,landY(y));
  app.classList.remove('enter'); void app.offsetWidth; app.classList.add('enter');
  focusMain(); afterLand();
}
/* history-mode navigation with per-entry scroll memory */
function go(url, scrollTo){
  if(scrollTo) pendingScroll = scrollTo;
  if(!HIST){ var h = '#'+url; if(location.hash===h){ route(); } else location.hash = h; return; }
  try{ history.replaceState({y: window.pageYOffset}, ''); }catch(e){}
  history.pushState({y:0}, '', url); route(0);
}
function setMeta(out){
  var H = document.head, d = out.desc || 'Imperial Holdings Group: five specialist divisions, one standard, and one person who knows your family. Led from Dubai and Lagos.';
  var t = document.title, url = out.canonical || location.href.split('#')[0], og = abs('assets/img/og.jpg'), im = out.image || og;
  [['name','description',d],['property','og:description',d],['property','og:title',t],['property','og:url',url],['property','og:type',out.type||'website'],['name','twitter:card','summary_large_image'],['name','twitter:title',t],['name','twitter:description',d],['name','twitter:image',im]].forEach(function(m){
    var el = H.querySelector('meta['+m[0]+'="'+m[1]+'"]');
    if(!el){ el=document.createElement('meta'); el.setAttribute(m[0],m[1]); H.appendChild(el); } el.setAttribute('content', m[2]);
  });
  /* Social images: the JPEG card first, with its size, because WhatsApp and LinkedIn do not reliably show a WebP
     preview; the page's own photograph second, for the services that do. TO CONFIRM: per-page JPEG cards (build/README.md). */
  [].forEach.call(H.querySelectorAll('meta[property="og:image"], meta[property="og:image:width"], meta[property="og:image:height"]'), function(el){ el.parentNode.removeChild(el); });
  var ogm = [['og:image', og], ['og:image:width', '1200'], ['og:image:height', '630']]; if(im !== og) ogm.push(['og:image', im]);
  ogm.forEach(function(m){ var el = document.createElement('meta'); el.setAttribute('property', m[0]); el.setAttribute('content', m[1]); H.appendChild(el); });
  var can = H.querySelector('link[rel="canonical"]');
  if(out.canonical){ if(!can){ can=document.createElement('link'); can.setAttribute('rel','canonical'); H.appendChild(can); } can.setAttribute('href', out.canonical); }
  else if(can) can.parentNode.removeChild(can);
  /* a page that does not exist is never indexed; the pre-launch noindex tag in index.html is left alone */
  var rb = H.querySelector('meta[name="robots"][data-nf]');
  if(out.nf && !H.querySelector('meta[name="robots"]')){ rb=document.createElement('meta'); rb.setAttribute('name','robots'); rb.setAttribute('data-nf',''); rb.setAttribute('content','noindex, follow'); H.appendChild(rb); }
  else if(!out.nf && rb) rb.parentNode.removeChild(rb);
  /* a draft page carries its own noindex tag, kept by the build even when LAUNCH=1 drops the pre-launch one */
  var rd = H.querySelector('meta[name="robots"][data-draft]');
  if(out.noindex && !rd){ rd=document.createElement('meta'); rd.setAttribute('name','robots'); rd.setAttribute('data-draft',''); rd.setAttribute('content','noindex, follow'); H.appendChild(rd); }
  else if(!out.noindex && rd) rd.parentNode.removeChild(rd);
  [].forEach.call(H.querySelectorAll('script[data-ld]'), function(s){ s.parentNode.removeChild(s); });
  (out.ld||[]).forEach(function(o){ var s=document.createElement('script'); s.type='application/ld+json'; s.setAttribute('data-ld',''); s.textContent=JSON.stringify(o).replace(/</g,'\\u003c'); H.appendChild(s); });
}
/* v6 (UX audit item 16): after a client-side route change, focus always moves to the new view's heading (made focusable
   with tabindex -1), or to main when a view has none, without scrolling; the skip link still focuses main */
function focusMain(){
  var h = app.querySelector('h1'), t = h || document.getElementById('main');
  if(h && !h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
  try{ t.focus({preventScroll:true}); }catch(e){ t.focus(); }
}

/* ---------- motion system ---------- */
var io = null, fx = {};
function enhance(){
  if(io) io.disconnect();
  /* v6 (UX audit item 3): every block is visible on landing, so nothing waits for the observer. The observer is kept
     only for lazy one-off work in view: the map arcs, the steps line, the ring and the figures. */
  [].forEach.call(app.querySelectorAll('[data-r]:not(.anim)'), function(e){ e.classList.add('in'); });
  var els = app.querySelectorAll('.steps, .wmap, .ring.anim, [data-count]');
  /* prerendered: the markup already on screen carries .in, so the first client render keeps everything as it is */
  if(reduced || prerendered || !('IntersectionObserver' in window)){
    [].forEach.call(els, function(e){ e.classList.add('in'); });
    [].forEach.call(app.querySelectorAll('[data-count]'), function(el){ el._done=true; el.textContent=(+el.getAttribute('data-count')).toLocaleString('en-GB'); });
  } else {
    io = new IntersectionObserver(function(ents){
      ents.forEach(function(en){ if(!en.isIntersecting) return; var t=en.target; t.classList.add('in'); if(t.hasAttribute('data-count')) count(t); io.unobserve(t); });
    }, {rootMargin:'0px 0px -6% 0px', threshold:0.06});
    [].forEach.call(els, function(e){ io.observe(e); });
  }
  // cache scroll-linked elements for this view
  fx = {
    hh: app.querySelector('.hh'), dusk: app.querySelector('.hh .dusk img'), night: app.querySelector('.hh .night'), nightImg: app.querySelector('.hh .night img'), hc: app.querySelector('.hh-c'),
    pxs: app.querySelectorAll('.ph .px, .closing .px, .nf .px'),
  };
  if(fx.night){ fx.night.setAttribute('aria-hidden','true'); if(fx.nightImg && fx.nightImg.decode) fx.nightImg.decode().catch(function(){}); }
  tick(); greet(); onScroll(); bindHouses(); bindMap(); bindRail(); bindFilters(); bindForms(); bindFinder(); bindFaq(); bindShare(); bindMedia();
  body.classList.toggle('on-contact', curView==='contact');
}
function count(el){
  if(el._done) return; el._done = true;
  var n = +el.getAttribute('data-count'), t0 = null, dur = 1800;
  function f(t){ if(!t0) t0=t; var k=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-k,4); el.textContent=Math.round(n*e).toLocaleString('en-GB'); if(k<1) requestAnimationFrame(f); }
  requestAnimationFrame(f);
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}

/* scroll: header, back to top, action bar, hero dusk-to-night, parallax */
var lastY = 0, ticking = false, ftr = document.getElementById('ftr');
function onScroll(){
  ticking = false;
  var y = window.pageYOffset || 0, H = window.innerHeight;
  body.classList.toggle('scrolled', y > 40);
  /* v6 (UX audit item 7): the header always stays on screens up to 1024 px (the menu button lives there); wider, it
     steps aside only after 1,200 px of reading and comes back on any upward movement */
  if(window.innerWidth > 1024 && y > 1200 && y > lastY + 4 && !body.classList.contains('mega-open')) body.classList.add('hdr-hide');
  else if(y < lastY || y < 1200 || window.innerWidth <= 1024) body.classList.remove('hdr-hide');
  lastY = y;
  body.classList.toggle('show-top', y > H*1.4);
  var ft = ftr.getBoundingClientRect().top;
  body.classList.toggle('show-mcta', y > H*0.8 && ft > H - 40);
  if(reduced) return;
  if(fx.hh){
    var r = fx.hh.getBoundingClientRect(), p = clamp(-r.top/Math.max(1,r.height-H),0,1), e = p*p*(3-2*p);
    if(r.bottom > 0){
      fx.dusk.style.transform = 'scale('+(1.08-0.06*p).toFixed(4)+') translate3d(0,'+(p*3).toFixed(2)+'%,0)';
      if(fx.night){ fx.night.style.opacity = e.toFixed(3); fx.nightImg.style.transform = 'scale('+(1.14-0.1*p).toFixed(4)+')'; }
      fx.hc.style.transform = 'translate3d(0,'+(-p*48).toFixed(1)+'px,0)';
    }
  }
  [].forEach.call(fx.pxs, function(px){ var s=px.parentNode.parentNode, rr=s.getBoundingClientRect(); if(rr.bottom<0||rr.top>H) return; px.style.transform='translate3d(0,'+((rr.top)*-0.16).toFixed(1)+'px,0)'; });
}
window.addEventListener('scroll', function(){ if(!ticking){ ticking=true; requestAnimationFrame(onScroll); } }, {passive:true});
window.addEventListener('resize', function(){ if(!ticking){ ticking=true; requestAnimationFrame(onScroll); } });

/* clocks + greeting */
function tick(){
  [].forEach.call(document.querySelectorAll('.clock[data-tz]'), function(el){
    var tz = el.getAttribute('data-tz'), f = el.getAttribute('data-fmt'), t = fmtTime(tz);
    if(f==='long'){ var dd = new Intl.DateTimeFormat('en-GB',{weekday:'long',timeZone:tz}).format(new Date()); t = 'Local time '+t+', '+dd; }
    else if(f==='local') t = 'Local time '+t;
    else if(f!=='bare') t = t + (tz==='Asia/Dubai'?' GST':' WAT');
    el.textContent = t;
  });
}
function greet(){ var g=document.getElementById('greet'); if(!g) return; var h=+fmtTime('Asia/Dubai').slice(0,2); g.textContent = h<5?'Good evening.':h<12?'Good morning.':h<18?'Good afternoon.':'Good evening.'; }
setInterval(function(){ tick(); greet(); }, 20000);

/* division panels */
function bindHouses(){
  var wrap = document.getElementById('houses'); if(!wrap) return;
  var hs = [].slice.call(wrap.querySelectorAll('.house'));
  function set(h){ hs.forEach(function(x){ x.classList.toggle('on', x===h); }); }
  hs.forEach(function(h,i){
    var a = h.querySelector('a');
    h.addEventListener('mouseenter', function(){ if(window.innerWidth>1024) set(h); });
    a.addEventListener('focus', function(){ if(window.innerWidth>1024) set(h); });
    a.addEventListener('keydown', function(e){
      if(e.key!=='ArrowRight' && e.key!=='ArrowLeft') return; e.preventDefault();
      var n = hs[(i + (e.key==='ArrowRight'?1:-1) + hs.length) % hs.length]; n.querySelector('a').focus();
    });
  });
}

/* where-we-work map */
function bindMap(){
  [].forEach.call(app.querySelectorAll('.wmap'), function(w){
    [].forEach.call(w.querySelectorAll('.arc'), function(a){ try{ a.style.setProperty('--l', Math.ceil(a.getTotalLength())); }catch(e){} });
    var tabs = [].slice.call(w.querySelectorAll('[role=tab]'));
    function select(k, region, focus){
      tabs.forEach(function(t){ var on=t.getAttribute('data-wm')===k; t.setAttribute('aria-selected', on); t.tabIndex = on?0:-1; if(on && focus) t.focus(); });
      [].forEach.call(w.querySelectorAll('[role=tabpanel]'), function(p){ p.classList.toggle('on', p.id==='wm-'+k); });
      [].forEach.call(w.querySelectorAll('.pin'), function(p){ p.classList.toggle('on', p.getAttribute('data-k')===k); });
      [].forEach.call(w.querySelectorAll('.reg'), function(g){ g.classList.toggle('on', k==='world' && (!region || g.getAttribute('data-k')===region)); });
      [].forEach.call(w.querySelectorAll('.arc'), function(a){ var ak=a.getAttribute('data-k'); var dim = k==='lagos' ? ak!=='lagos' : (k==='world' && region ? ak!==region : false); a.classList.toggle('dim', dim); });
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click', function(){ select(t.getAttribute('data-wm')); });
      t.addEventListener('keydown', function(e){
        var m = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1}[e.key]; if(e.key==='Home') m=-i; if(e.key==='End') m=tabs.length-1-i; if(m===undefined) return;
        e.preventDefault(); var n = tabs[(i+m+tabs.length)%tabs.length]; select(n.getAttribute('data-wm'), null, true);
      });
    });
    [].forEach.call(w.querySelectorAll('[data-reg]'), function(b){ b.addEventListener('click', function(){ select('world', b.getAttribute('data-reg')); }); });
    [].forEach.call(w.querySelectorAll('.pin'), function(p){ p.style.cursor='pointer'; p.addEventListener('click', function(){ select(p.getAttribute('data-k')); }); });
    [].forEach.call(w.querySelectorAll('.reg'), function(g){ g.style.cursor='pointer'; g.addEventListener('click', function(){ select('world', g.getAttribute('data-k')); }); });
    select('dubai');
  });
}

/* horizontal rail: drag to scroll with a mouse; touch uses native swipe */
var rail = {el:null, down:false, sx:0, sl:0, moved:0};
function bindRail(){
  var r = document.getElementById('rail'); rail.el = r; if(!r) return;
  r.addEventListener('pointerdown', function(e){ if(e.pointerType!=='mouse') return; rail.down=true; rail.moved=0; rail.sx=e.clientX; rail.sl=r.scrollLeft; });
  r.addEventListener('click', function(e){ if(rail.moved>6){ e.preventDefault(); e.stopPropagation(); rail.moved=0; } }, true);
  r.addEventListener('dragstart', function(e){ e.preventDefault(); });
}
window.addEventListener('pointermove', function(e){ if(!rail.down || !rail.el) return; var dx=e.clientX-rail.sx; rail.moved=Math.max(rail.moved,Math.abs(dx)); if(rail.moved>4){ rail.el.classList.add('drag'); rail.el.scrollLeft = rail.sl-dx; } });
window.addEventListener('pointerup', function(){ if(!rail.down) return; rail.down=false; var el=rail.el; setTimeout(function(){ if(el) el.classList.remove('drag'); }, 0); });

/* insights filter */
function bindFilters(){
  var bs = app.querySelectorAll('[data-filter]'); if(!bs.length) return;
  [].forEach.call(bs, function(b){ b.addEventListener('click', function(){
    var f = b.getAttribute('data-filter'), n = 0;
    [].forEach.call(bs, function(x){ x.classList.toggle('on', x===b); x.setAttribute('aria-pressed', x===b); });
    [].forEach.call(app.querySelectorAll('#icards .icard'), function(c){
      var show = f==='All' || c.getAttribute('data-cat')===f; if(show) n++;
      c.classList.toggle('hide', !show); c.classList.remove('pop');
      if(show && !reduced){ void c.offsetWidth; c.classList.add('pop'); }
    });
    document.getElementById('filterMsg').textContent = n+' article'+(n===1?'':'s')+' shown';
    if(HIST){ try{ history.replaceState(history.state, '', '/insights'+(f==='All'?'':'?cat='+encodeURIComponent(f))); }catch(e){} }
  }); });
}

/* ---------- menus ---------- */
/* v6 (UX audit item 6): the menu opens on click, Enter or ArrowDown only, never on hover, and fades in 0.2 s */
var megaBtn = document.getElementById('megaBtn'), mega = document.getElementById('mega'), megaT = null;
function megaSel(i){
  [].forEach.call(mega.querySelectorAll('.mega-item'), function(a){ a.classList.toggle('on', +a.getAttribute('data-i')===i); });
  [].forEach.call(mega.querySelectorAll('.mega-prev figure'), function(f){ f.classList.toggle('on', +f.getAttribute('data-i')===i); });
}
function openMega(){ clearTimeout(megaT); mega.hidden=false; void mega.offsetWidth; body.classList.add('mega-open'); megaBtn.setAttribute('aria-expanded','true'); }
function closeMega(instant){ clearTimeout(megaT); if(!body.classList.contains('mega-open')) return; body.classList.remove('mega-open'); megaBtn.setAttribute('aria-expanded','false'); if(instant) mega.hidden=true; else megaT=setTimeout(function(){ if(!body.classList.contains('mega-open')) mega.hidden=true; }, 200); }
megaBtn.addEventListener('click', function(){ if(body.classList.contains('mega-open')) closeMega(); else openMega(); });
megaBtn.addEventListener('keydown', function(e){ if(e.key==='ArrowDown'){ e.preventDefault(); openMega(); setTimeout(function(){ var f=mega.querySelector('.mega-item'); if(f) f.focus(); }, 60); } });
mega.addEventListener('mouseover', function(e){ var a=e.target.closest('.mega-item'); if(a) megaSel(+a.getAttribute('data-i')); });
mega.addEventListener('focusin', function(e){ var a=e.target.closest('.mega-item'); if(a) megaSel(+a.getAttribute('data-i')); });
mega.addEventListener('keydown', function(e){
  var items = [].slice.call(mega.querySelectorAll('.mega-item')), i = items.indexOf(document.activeElement);
  if(e.key==='Escape'){ closeMega(); megaBtn.focus(); return; }
  if(i<0) return;
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); items[(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length].focus(); }
});
document.querySelector('.hdr').addEventListener('focusout', function(e){ if(body.classList.contains('mega-open') && e.relatedTarget && !e.relatedTarget.closest('.hdr')) closeMega(); });

var burger = document.getElementById('burger'), mm = document.getElementById('mmenu'), mmT = null;
function setMM(open, instant){
  if(open === body.classList.contains('mm-open')) return;
  clearTimeout(mmT);
  if(open){ loadMenuImgs(mm); mm.hidden=false; void mm.offsetWidth; body.classList.add('mm-open'); body.style.overflow='hidden'; tick(); setTimeout(function(){ var f=mm.querySelector('a,button'); if(f) f.focus({preventScroll:true}); }, 380); }
  else { body.classList.remove('mm-open'); body.style.overflow=''; if(instant || reduced) mm.hidden=true; else mmT=setTimeout(function(){ mm.hidden=true; }, 900); }
  burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open?'Close menu':'Open menu');
}
burger.addEventListener('click', function(){ setMM(!body.classList.contains('mm-open')); });
function closeMenus(instant){ closeMega(instant); setMM(false, instant); }
document.addEventListener('keydown', function(e){
  if(e.key==='Escape'){ if(body.classList.contains('mm-open')){ setMM(false); burger.focus(); } else if(body.classList.contains('mega-open')){ closeMega(); megaBtn.focus(); } }
  if(e.key==='Tab' && body.classList.contains('mm-open')){
    var f = [burger].concat([].slice.call(mm.querySelectorAll('a,button'))).filter(function(x){ return x.offsetParent!==null || x===burger; });
    var a = f.indexOf(document.activeElement);
    if(e.shiftKey && a<=0){ e.preventDefault(); f[f.length-1].focus(); } else if(!e.shiftKey && a===f.length-1){ e.preventDefault(); f[0].focus(); }
  }
});
/* swipe up (or right) to close the mobile menu */
(function(){ var sx=0, sy=0, on=false;
  mm.addEventListener('touchstart', function(e){ var t=e.touches[0]; sx=t.clientX; sy=t.clientY; on = mm.scrollTop<=0 || true; }, {passive:true});
  mm.addEventListener('touchend', function(e){ if(!on) return; on=false; var t=e.changedTouches[0], dx=t.clientX-sx, dy=t.clientY-sy;
    if((dy < -90 && Math.abs(dx) < 60 && mm.scrollTop + mm.clientHeight >= mm.scrollHeight - 4) || (dx > 110 && Math.abs(dy) < 50)) setMM(false); }, {passive:true});
})();

/* ---------- global clicks ---------- */
var toastEl = document.getElementById('toast'), toastT = null;
function toast(html){ toastEl.innerHTML = html; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function(){ toastEl.classList.remove('show'); }, 3400); }
document.addEventListener('click', function(e){
  var t = e.target.closest ? e.target : e.target.parentNode;
  var ph = t.closest('a[data-tbc]');
  if(ph){ e.preventDefault(); toast('<b>Link to confirm.</b> '+esc(ph.getAttribute('data-tbc'))+' will be added before launch.'); return; }
  var sk = t.closest('[data-skip]');
  if(sk){ e.preventDefault(); var m=document.getElementById('main'); m.focus({preventScroll:true}); var hero=app.querySelector('.hh, .ph, .nf'); window.scrollTo(0, hero ? hero.offsetTop + Math.min(hero.offsetHeight, window.innerHeight) - 40 : 0); return; }
  var acc = t.closest('#mmDivBtn');
  if(acc){ var li=acc.parentNode, o=!li.classList.contains('open'); li.classList.toggle('open', o); acc.setAttribute('aria-expanded', o); return; }
  var gt = t.closest('a[data-goto]');
  if(gt){ e.preventDefault(); closeMenus(); go('/', gt.getAttribute('data-goto')); return; }
  var sc = t.closest('[data-scroll]');
  if(sc){ var el=document.getElementById(sc.getAttribute('data-scroll')); if(el){ e.preventDefault(); window.scrollTo({top: el.getBoundingClientRect().top + window.pageYOffset - (/^(divisions|ecosystem)$/.test(sc.getAttribute('data-scroll'))?0:90), behavior: reduced?'auto':'smooth'}); } return; }
  var pb = t.closest('[data-palette]');
  if(pb){ e.preventDefault(); if(body.classList.contains('mm-open')) setMM(false, true); openPal(); return; }
  if(body.classList.contains('mega-open') && !t.closest('#megaBtn') && !t.closest('#mega')) closeMega();
  var a = t.closest('a[href]');
  if(a && !e.defaultPrevented && e.button===0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !a.target && !a.hasAttribute('download')){
    var href = a.getAttribute('href'), internal = HIST ? (href.charAt(0)==='/' && href.charAt(1)!=='/' && !/\.[a-z0-9]{2,5}$/i.test(href.split('?')[0])) : href.indexOf('#/')===0;
    if(internal){
      var url = HIST ? href : href.slice(1), here = HIST ? location.pathname+location.search : location.hash.slice(1);
      e.preventDefault();
      if(url===here || (url==='/' && here==='')){ closeMenus(); window.scrollTo({top:0, behavior: reduced?'auto':'smooth'}); return; }
      go(url);
    }
  }
});

/* ---------- forms (nothing is sent) ---------- */
function routingHTML(v){
  var e=null; D.enquiry.forEach(function(x){if(x.v===v) e=x;}); if(!e) return '';
  var d = div(e.to);
  if(!d) return '<div><strong>We will pass this to the Group team.</strong><p>One person will reply and bring in the right house.</p></div>';
  var go = d.soon ? '<a class="tlink" href="#/divisions/real-estate">Register interest instead'+AR+'</a>' : extLink(d,'tlink', d.cta.real?'Or go direct: '+esc(d.cta.domain):'Visit the website');
  return '<div>'+logoImg(d,'Black','rlogo')+'<p>Your enquiry will be routed to <strong>'+esc(d.name)+'</strong>'+(d.soon?', which has not yet launched. We will register your interest.':'.')+'</p></div>'+go;
}
/* Disposable addresses (brief 3.3): the list the function uses (shared/disposable-domains.json), fetched once, so the
   person is told before the enquiry is sent instead of thanked for a lead the backend then drops. Without the list
   (file://, or the fetch failing) the check passes here and the function's own check still applies. */
var DISPOSABLE = {list:null, p:null}, DISPOSABLE_MSG = 'Please use an email address you check regularly.';
function disposableList(){
  if(DISPOSABLE.p) return DISPOSABLE.p;
  if(!HIST || typeof window.fetch!=='function'){ DISPOSABLE.list = []; DISPOSABLE.p = Promise.resolve(DISPOSABLE.list); return DISPOSABLE.p; }
  DISPOSABLE.p = fetch('/shared/disposable-domains.json').then(function(res){ return res.ok ? res.json() : {}; }).then(function(j){ DISPOSABLE.list = (j && j.domains) || []; return DISPOSABLE.list; }, function(){ DISPOSABLE.list = []; return DISPOSABLE.list; });
  return DISPOSABLE.p;
}
function disposableEmail(v){
  var list = DISPOSABLE.list, d = String(v||'').trim().toLowerCase().split('@')[1] || '';
  if(!list || !d) return false;
  for(var i=0;i<list.length;i++){ var x = list[i]; if(d===x || d.slice(-(x.length+1))==='.'+x) return true; }
  return false;
}
/* the email field's error text: the disposable message while that is the problem, its own text otherwise */
function emailMessage(box, f, disposable){ var em = box.querySelector('.em'); if(!em) return; if(em._dflt==null) em._dflt = em.textContent; em.textContent = disposable ? DISPOSABLE_MSG : em._dflt; }
function valid(f){
  if(f.type==='checkbox') return f.checked;
  var v = (f.value||'').trim(); if(!v) return !f.required;
  if(f.type==='email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && !disposableEmail(v);
  return true;
}
function mark(f, show){
  var good = valid(f), box = f.type==='checkbox' ? f.closest('.consent') : f.closest('.field');
  if(!box) return good;
  if(f.type==='email') emailMessage(box, f, disposableEmail(f.value));
  box.classList.toggle('err', !good && show);
  if(f.type!=='checkbox') box.classList.toggle('ok', good && !!f.value.trim());
  f.setAttribute('aria-invalid', (!good && show) ? 'true' : 'false');
  return good;
}
/* v5 trust (brief 8): screen readers hear what needs attention. Every field's error text is linked through
   aria-describedby in bindForms and the error box has role="alert"; this names the first invalid field, and how many
   there are, in the live region whenever a step or a form is sent with something missing. */
function fieldLabel(f){
  if(f.type==='checkbox') return 'Consent';
  if(f.type==='radio') return 'What we can help with';
  var box = f.closest('.field'), s = box && box.querySelector('span');
  return s ? s.textContent.replace(/\s+/g,' ').trim() : (f.name || 'This field');
}
function errorText(f){
  var box = f.closest('.field,.consent'), em = box && box.querySelector('.em');
  if(em) return em.textContent;
  var re = f.type==='radio' ? document.getElementById('routeErr') : null;
  return re ? re.textContent : 'Please check this field.';
}
function announceInvalid(form, bad){
  var n = form.querySelectorAll('[aria-invalid="true"]').length;
  announce((n>1 ? n+' fields need attention. ' : '')+fieldLabel(bad)+': '+errorText(bad));
}
/* v5: every form's key value pairs, as one object (the same data goes urlencoded to Netlify Forms and as JSON to our own function) */
function leadData(form, extra){
  var o = {};
  [].forEach.call(form.elements, function(f){ if(!f.name || f.disabled) return; if((f.type==='radio'||f.type==='checkbox') && !f.checked) return; o[f.name] = f.type==='checkbox' ? 'yes' : f.value; });
  Object.keys(extra||{}).forEach(function(k){ o[k] = extra[k]; });
  return o;
}
function toQuery(o){ var p = new URLSearchParams(); Object.keys(o).forEach(function(k){ p.append(k, o[k]); }); return p.toString(); }
/* analytics: shared/analytics.js defines window.ihgTrack when GA4 is configured; without it nothing is sent */
function track(name, params){ if(typeof window.ihgTrack==='function'){ try{ window.ihgTrack(name, params||{}); }catch(e){} } }
/* Submission (BUILD-CONTRACT 4.3). Primary: urlencoded POST to "/" for Netlify Forms, which then runs
   submission-created. Fallback: the same data as JSON {form, data} to config.leadEndpoint (netlify/functions/lead.js).
   Both failing rejects, and the caller shows the office telephones and the email; the draft stays in localStorage.
   A stalled connection must not hold the button for minutes: each post is abandoned after SEND_TIMEOUT and the next
   route is tried (every browser with fetch has AbortController). */
var SEND_TIMEOUT = 15000;
function fetchT(url, init){
  var ctl = window.AbortController ? new AbortController() : null, t = null;
  if(ctl){ init.signal = ctl.signal; t = setTimeout(function(){ ctl.abort(); }, SEND_TIMEOUT); }
  return fetch(url, init).then(function(res){ clearTimeout(t); return res; }, function(err){ clearTimeout(t); throw err; });
}
function submitLead(form, extra){
  if(!HIST) return Promise.reject(new Error('local'));
  var t0 = Date.now(), data = leadData(form, extra), name = form.getAttribute('name') || data['form-name'] || '';
  function settle(r){ return new Promise(function(ok){ setTimeout(function(){ ok(r); }, Math.max(0, (reduced?0:700) - (Date.now()-t0))); }); }
  return fetchT('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: toQuery(data)})
    .then(function(res){ if(!res.ok) throw new Error('HTTP '+res.status); return {ok:true, via:'forms'}; })
    .then(null, function(err){
      var ep = D.config.leadEndpoint; if(!ep) throw err;
      return fetchT(ep, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({form:name, data:data})})
        .then(function(res){ return res.json().then(function(j){ return j || {}; }, function(){ return {}; }).then(function(j){ if(!res.ok || !j.ok) throw new Error(j.reason || ('HTTP '+res.status)); j.via = 'lead'; return j; }); });
    })
    .then(settle);
}
function fallbackHTML(){
  var C = D.contact;
  return '<b>We could not send this just now.</b> Please call or email us and we will take it from there. What you typed is kept on this device, so you can also try again later.'+
    '<div class="kv fb-kv">'+C.offices.map(function(o){ return '<div><span>'+esc(o.city)+'</span><a class="ul" href="tel:'+o.tel.replace(/\s/g,'')+'">'+esc(o.tel)+'</a></div>'; }).join('')+'<div><span>Email</span><a class="ul" href="mailto:'+C.email+'">'+esc(C.email)+'</a></div></div>';
}
/* drafts: what someone typed survives a reload or a wander round the site, for every form (key ihg-draft-<form>) */
var DRAFT_SKIP = {'form-name':1, company_url:1, consent:1, 'cf-turnstile-response':1};
/* the hidden fields worth keeping: what the programme fit check wrote (brief 3.4), so a wander round the site does not
   turn a programme-fit lead back into a plain website lead */
var DRAFT_HIDDEN = {lead_source:1, quiz_answers:1};
function draftKey(kind){ return 'ihg-draft-'+kind; }
/* v6 (UX audit item 31): a draft lasts 7 days on the device. saveDraft stamps it (_t, no form field has that name);
   readDraft deletes and ignores an older one. A draft saved before v6 has no stamp: the clock starts when it is read. */
var DRAFT_MAX_AGE = 7 * 24 * 3600 * 1000;
function readDraft(kind){
  var k = draftKey(kind), d = store.get(k); if(!d && kind==='contact'){ k = 'ihg-contact-draft'; d = store.get(k); }
  if(!d || typeof d !== 'object') return d;
  if(!d._t){ d._t = Date.now(); store.set(k, d); }
  else if(Date.now() - d._t > DRAFT_MAX_AGE){ store.del(k); return null; }
  return d;
}
function draftFields(form){ return [].filter.call(form.elements, function(f){ return f.name && !DRAFT_SKIP[f.name] && (f.type!=='hidden' || DRAFT_HIDDEN[f.name]) && f.type!=='submit' && f.type!=='button' && f.type!=='checkbox'; }); }
function saveDraft(form, kind){ var o = {_t: Date.now()}; draftFields(form).forEach(function(f){ if(f.type==='radio'){ if(f.checked) o[f.name] = f.value; return; } o[f.name] = f.value; }); store.set(draftKey(kind), o); }
function restoreDraft(form, dr){ draftFields(form).forEach(function(f){ if(dr[f.name]==null) return; if(f.type==='radio'){ if(f.value===dr[f.name] && !form.querySelector('input[name="'+f.name+'"]:checked')) f.checked = true; return; } f.value = dr[f.name]; }); }
function draftNote(form){
  if(form.querySelector('.draft')) return;
  var grid = form.querySelector('.fgrid'); if(!grid) return;
  var dn = document.createElement('div'); dn.className = 'draft'; dn.hidden = true;
  dn.innerHTML = '<span>We kept what you started earlier.</span><button class="tlink" type="button" data-clear-draft>Start afresh</button>';
  grid.parentNode.insertBefore(dn, grid);
}
function successHTML(title, msg, inner){
  var burst = ''; for(var i=0;i<8;i++){ var a=i*45*Math.PI/180; burst += '<line x1="'+(50+Math.cos(a)*58).toFixed(1)+'" y1="'+(50+Math.sin(a)*58).toFixed(1)+'" x2="'+(50+Math.cos(a)*66).toFixed(1)+'" y2="'+(50+Math.sin(a)*66).toFixed(1)+'"/>'; }
  return '<div class="success" role="status" tabindex="-1"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="ring1" cx="50" cy="50" r="48" transform="rotate(-90 50 50)"/><path class="tick" d="M32 51l12 12 24-26"/><g class="burst">'+burst+'</g></svg><h3>'+title+'</h3><p>'+msg+'</p>'+(inner||'')+'<div class="btns" style="margin-top:28px;justify-content:center"><a class="btn sm" href="#/journal"><span>Read while you wait</span>'+AR+'</a><button class="btn line sm" type="button" data-reset><span>Send another</span></button></div></div>';
}
/* success state: thank you, then the next steps (verification when a phone was given and the endpoint is enabled, then booking) */
function showSuccess(wrap, info, anchor){
  var t = 'Thank you'+(info.name?', '+esc(info.name):'')+'.';
  wrap.innerHTML = successHTML(t, info.msg, (info.inner||'')+'<div class="next" data-next-steps></div>');
  var s = wrap.querySelector('.success'); s.focus({preventScroll:true});
  wrap.querySelector('[data-reset]').addEventListener('click', function(){ render(); var c = document.getElementById(anchor); if(c) c.scrollIntoView({block:'center'}); });
  var top = wrap.getBoundingClientRect().top + window.pageYOffset - 120; if(wrap.getBoundingClientRect().top < 80) window.scrollTo({top:top, behavior: reduced?'auto':'smooth'});
  announce('Sent. '+t);
  nextSteps(wrap, info);
}
function nextSteps(wrap, info){
  var el = wrap.querySelector('[data-next-steps]'); if(!el) return;
  function booking(){ el.insertAdjacentHTML('beforeend', bookingHTML(info)); }
  if(!info.phone || !D.config.verifyEndpoint || info.kind==='guide'){ booking(); return; }
  verifyStep(el, info, booking);
}
/* Phone verification (BUILD-CONTRACT 4.4). A code goes by WhatsApp first; when WhatsApp cannot deliver (the number is
   not on WhatsApp, or the WhatsApp sender is not yet approved) the page tries SMS itself, and the person can switch
   channel or ask for the code again. When Twilio is not configured the endpoint answers enabled:false and the step is
   skipped without a word. A number without a country code, or a rate limit, is said plainly and the enquiry continues
   unverified. The code length is a Twilio Verify service setting (TO CONFIRM), so the page accepts 4 to 10 digits.
   An approved code is never checked twice: Twilio discards it, so a second check would read as a wrong code; when the
   backend could not record the result yet (verified:true, recorded:false) the step still finishes, with softer wording,
   and the team marks the person by hand from the function log. */
function byName(ch){ return ch==='sms' ? 'SMS' : 'WhatsApp'; }
function verifyHTML(phone, channel){
  var other = channel==='sms' ? 'whatsapp' : 'sms';
  return '<div class="verify" data-verify><div class="eyebrow">Verify your phone</div>'+
    '<p>We have sent a code by '+byName(channel)+' to <b>'+esc(phone)+'</b>. Enter it to confirm the number is yours. It takes a moment and helps us reply faster.</p>'+
    '<form class="verify-f" novalidate><label class="field"><span class="vh">Verification code</span><input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="Code" aria-label="Verification code"></label><button class="btn gold sm" type="submit" data-verify-send><span class="lbl">Verify</span><span class="spin"></span></button></form>'+
    '<div class="form-err" role="alert" hidden></div>'+
    '<p class="xs verify-alt"><button class="tlink" type="button" data-resend>Send it again</button><button class="tlink" type="button" data-channel="'+other+'">Send it by '+byName(other)+' instead</button><button class="tlink" type="button" data-verify-skip>Skip for now</button></p></div>';
}
function verifyNote(t){ return '<p class="xs verify-note">'+esc(t)+'</p>'; }
function verifyStep(el, info, done){
  var ref = '', channel = 'whatsapp';
  function post(body){ return fetch(D.config.verifyEndpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}).then(function(res){ if(!res.ok) throw new Error('HTTP '+res.status); return res.json(); }); }
  /* a refusal rejects with the answer attached (err.r), so the caller can tell "not enabled" from "could not send" */
  function start(ch){ return post({action:'start', phone:info.phone, email:info.email, channel:ch}).then(function(r){ if(!r || r.ok===false || !r.enabled){ var e = new Error('off'); e.r = r || null; throw e; } ref = r.ref || ''; channel = ch; return r; }); }
  function giveUp(text){ el.innerHTML = verifyNote(text); announce(text); done(false); }
  function draw(focus){
    el.innerHTML = verifyHTML(info.phone, channel);
    var f = el.querySelector('form'), inp = f.querySelector('input[name=code]'), btn = f.querySelector('[data-verify-send]'), err = el.querySelector('.form-err');
    f._b = true;
    function fail(msg){ err.innerHTML = msg; err.hidden = false; btn.classList.remove('loading'); btn.disabled = false; }
    function resend(ch){ err.hidden = true; start(ch).then(function(){ draw(true); announce('A new code has been sent by '+byName(ch)+'.'); }, function(){ fail('<b>We could not send the code by '+byName(ch)+' just now.</b> Please try the other way, or skip for now.'); }); }
    f.addEventListener('submit', function(e){
      e.preventDefault(); var code = (inp.value||'').replace(/\D/g,'');
      if(code.length<4 || code.length>10){ fail('<b>Please enter the code we sent.</b>'); inp.focus(); return; }
      err.hidden = true; btn.classList.add('loading'); btn.disabled = true;
      post({action:'check', ref:ref, phone:info.phone, code:code, email:info.email}).then(function(r){
        if(r && r.verified){
          var noted = r.recorded !== false;
          track('phone_verified', {form:info.kind, division:info.division, recorded:noted});
          el.innerHTML = '<p class="verified">'+TICK+'<span>'+(noted ? 'Phone verified. Thank you.' : 'Code accepted. Thank you. We will note it on your enquiry shortly.')+'</span></p>';
          announce(noted ? 'Phone verified.' : 'Code accepted.'); done(true);
        }
        else if(r && r.reason==='expired') fail('<b>That code has expired.</b> Send it again by WhatsApp or SMS below.');
        else fail('<b>That code did not match.</b> Please check it and try again, or send it again below.');
      }, function(){ fail('<b>We could not check the code just now.</b> Please try again, or skip for now.'); });
    });
    el.querySelector('[data-verify-skip]').addEventListener('click', function(){ el.innerHTML = ''; announce('Verification skipped.'); done(false); });
    el.querySelector('[data-resend]').addEventListener('click', function(){ resend(channel); });
    el.querySelector('[data-channel]').addEventListener('click', function(){ resend(this.getAttribute('data-channel')); });
    if(focus) inp.focus({preventScroll:true});
    else announce('Verify your phone: a code has been sent by '+byName(channel)+'.');
  }
  start('whatsapp').then(function(){ draw(false); }, function(err){
    var r = err && err.r;
    if(!r || !r.enabled){ done(false); return; }   /* not configured, or no answer at all: nothing to say */
    if(r.reason==='provider'){ start('sms').then(function(){ draw(false); }, function(){ giveUp('We could not send a verification code to this number, so we will continue without it.'); }); return; }
    giveUp(r.reason==='phone' ? 'We could not send a verification code: the number needs its country code (for example +971 or +234). We will continue without it.' : 'We could not send a verification code just now, so we will continue without it.');
  });
}
/* Booking (brief 3.4): one button per office from config.booking, with name, email and a1 (division) appended (Calendly style;
   the same parameters are added to any other URL). An empty url shows the tbc text in the same spot. */
function bookingURL(url, info){
  var q = 'name='+encodeURIComponent(info.fullName||'')+'&email='+encodeURIComponent(info.email||'')+'&a1='+encodeURIComponent(info.divisionName||info.division||'');
  return url+(url.indexOf('?')>-1 ? '&' : '?')+q;
}
function bookingHTML(info){
  var B = D.config.booking || {};
  var rows = D.contact.offices.map(function(o){
    var b = B[o.city.toLowerCase()]; if(!b) return '';
    return b.url ? '<a class="btn sm" href="'+esc(bookingURL(b.url, info))+'" target="_blank" rel="noopener" data-book="'+esc(o.city)+'" data-division="'+esc(info.division||'')+'"><span>'+esc(o.city)+'</span>'+NE+'</a>' : '<span class="book-tbc"><b>'+esc(o.city)+'</b>'+tbc(b.tbc)+'</span>';
  }).join('');
  return '<div class="book"><div class="eyebrow">Book a first conversation</div><p>Choose the office closest to you. Where the booking page allows it, your name and email are filled in for you.</p><div class="btns">'+rows+'</div></div>';
}
function bookingSide(){
  var B = D.config.booking || {};
  return D.contact.offices.map(function(o){ var b = B[o.city.toLowerCase()]; if(!b) return ''; return '<div>'+(b.url ? '<a class="ul" href="'+esc(b.url)+'" target="_blank" rel="noopener" data-book="'+esc(o.city)+'" data-division="">Book a conversation, '+esc(o.city)+'</a>' : tbc(o.city+' booking page'))+'</div>'; }).join('');
}
/* WhatsApp (brief 3.4): https://wa.me/<digits> from config.whatsapp; a small button in the header on mobile that opens a sheet with
   both offices, and a button under each office on the Contact page. Clicks are tracked as whatsapp_click with the office name. */
var WA = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.6a7.4 7.4 0 0 0-6.4 11.1L2.6 17.4l3.8-1A7.4 7.4 0 1 0 10 2.6z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7.4 7.1c.2-.4.4-.5.7-.5h.5l.6 1.5-.5.7c.4.9 1.1 1.6 2 2l.7-.5 1.5.7v.4c0 .4-.2.8-.7 1-1 .3-2.4-.2-3.7-1.5S7 8.2 7.4 7.1z" fill="currentColor"/></svg>';
function waLink(n){ return 'https://wa.me/'+String(n||'').replace(/\D/g,''); }
function waOffice(o){ var w = (D.config.whatsapp||{})[o.city.toLowerCase()]; return w && w.number ? w : null; }
function waSide(o){
  var w = waOffice(o); if(!w) return '';
  return '<div class="wa-side"><a class="btn line sm" href="'+waLink(w.number)+'" target="_blank" rel="noopener" data-wa="'+esc(o.city)+'">'+WA+'<span>WhatsApp '+esc(o.city)+'</span></a>'+(w.tbc?'<p class="xs wa-tbc">'+tbc(w.tbc)+'</p>':'')+'</div>';
}
function buildWhatsApp(){
  var btn = document.getElementById('waBtn'), pop = document.getElementById('waPop'); if(!btn || !pop) return;
  var rows = D.contact.offices.map(function(o){ var w = waOffice(o); if(!w) return ''; return '<a class="wa-row" href="'+waLink(w.number)+'" target="_blank" rel="noopener" data-wa="'+esc(o.city)+'">'+WA+'<span><b>'+esc(o.city)+'</b><span>'+esc(w.number)+'</span></span></a>'+(w.tbc?'<div class="wa-pop-tbc">'+tbc(w.tbc)+'</div>':''); }).join('');
  if(!rows){ btn.hidden = true; return; }
  pop.innerHTML = '<div class="wa-pop-h">WhatsApp us</div>'+rows;
  function set(open){ pop.hidden = !open; btn.setAttribute('aria-expanded', open ? 'true' : 'false'); if(open){ var f = pop.querySelector('a'); if(f) f.focus({preventScroll:true}); } }
  btn.addEventListener('click', function(){ set(pop.hidden); });
  document.addEventListener('click', function(e){ if(pop.hidden) return; var t = e.target.closest ? e.target : e.target.parentNode; if(!t.closest('#waBtn') && !t.closest('#waPop')) set(false); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && !pop.hidden){ set(false); btn.focus(); } });
  pop.addEventListener('click', function(e){ if(e.target.closest('a')) set(false); });
}
buildWhatsApp();
/* conversions on plain links: WhatsApp, booking and the guide download */
document.addEventListener('click', function(e){
  var t = e.target.closest ? e.target : e.target.parentNode, a = t.closest('a[data-wa], a[data-book], a[data-guide]'); if(!a) return;
  if(a.hasAttribute('data-wa')) track('whatsapp_click', {office: a.getAttribute('data-wa')});
  else if(a.hasAttribute('data-book')) track('booking_click', {office: a.getAttribute('data-book'), division: a.getAttribute('data-division')||''});
  else track('guide_download', {division:'citizenship'});
});
/* Programme fit check (brief 3.4, citizenship page only). Questions live in D.fit; the answers prefill the enquiry card. */
function fitOptions(q){
  if(q.ambitions) return q.ambitions.map(function(n){ var a = null; D.ambitions.forEach(function(x){ if(x[0]===n) a = x; }); return {v:n.toLowerCase(), l:n, s:a ? a[1] : ''}; });
  if(q.from==='timeline') return TIMELINES.map(function(o){ return {v:o[0], l:o[1], set:{timeline:o[0]}}; });
  if(q.from==='budget') return BUDGETS.filter(function(o){ return o[0]!=='undisclosed'; }).map(function(o){ return {v:o[0], l:o[1], set:{budget:o[0]}}; });
  return q.opts || [];
}
function fitCheck(){
  var F = D.fit, n = F.questions.length;
  return '<section class="sec deep" id="fit-sec"><div class="wrap"><div class="sec-head"><div>'+eyebrow(F.eyebrow)+mask(F.title,'h2','d2')+'</div><p class="lead" data-r style="--d:.15s">'+esc(F.lead)+'</p></div>'+
    '<div class="fit" id="fit" data-r><div class="fit-prog"><span class="fit-n" aria-live="polite">Question 1 of '+n+'</span><i class="fit-bar" aria-hidden="true"></i></div>'+
    F.questions.map(function(q,i){
      var opts = fitOptions(q);
      return '<div class="fit-q'+(i===0?' on':'')+'" data-q="'+i+'" data-k="'+esc(q.k)+'"><h3 class="h3" tabindex="-1">'+esc(q.q)+'</h3><div class="fd-pers fit-opts">'+opts.map(function(o){ return '<button type="button" data-opt="'+esc(o.v)+'"'+(o.set?' data-set="'+esc(JSON.stringify(o.set))+'"':'')+'><b>'+esc(o.l)+'</b>'+(o.s?'<small>'+esc(o.s)+'</small>':'')+'</button>'; }).join('')+'</div>'+
        '<div class="fit-nav">'+(i>0?'<button class="tlink" type="button" data-fit-back>'+BACK+'<span>Back</span></button>':'')+(q.skip?'<button class="tlink" type="button" data-opt="undisclosed" data-set="'+esc(JSON.stringify({budget:'undisclosed'}))+'">'+esc(q.skip)+'</button>':'')+'</div></div>';
    }).join('')+
    '<div class="fit-done" tabindex="-1"><img src="'+LOGO+'Imperial-Crown-Gold.svg" alt=""><h3>'+esc(F.done.title)+'</h3><p>'+esc(F.done.text)+'</p><div class="btns"><a class="btn gold mag" href="#/divisions/citizenship" data-scroll="enquire"><span>'+esc(F.done.cta)+'</span>'+AR+'</a><button class="tlink" type="button" data-fit-reset>Start over</button></div></div>'+
    '</div></div></section>';
}
function bindFit(){
  var f = document.getElementById('fit'); if(!f) return;
  var qs = [].slice.call(f.querySelectorAll('.fit-q')), done = f.querySelector('.fit-done'), bar = f.querySelector('.fit-bar'), num = f.querySelector('.fit-n'), n = qs.length, ans = {}, sets = {}, cur = 0;
  function show(i, back){
    cur = i; qs.forEach(function(q,j){ q.classList.toggle('on', j===i); q.classList.toggle('back', !!back && j===i); });
    done.classList.remove('on'); bar.style.backgroundSize = (i/n*100).toFixed(0)+'% 100%'; num.textContent = 'Question '+(i+1)+' of '+n;
    qs[i].querySelector('h3').focus({preventScroll:true});
  }
  function finish(){
    qs.forEach(function(q){ q.classList.remove('on'); }); bar.style.backgroundSize = '100% 100%'; num.textContent = 'Done'; done.classList.add('on'); done.focus({preventScroll:true});
    var form = document.querySelector('[data-form="enquiry"] form');
    if(form){
      var set = {division:'citizenship', audience: ans.who==='client' ? 'partners' : 'clients', lead_source:'programme-fit', quiz_answers: JSON.stringify(ans)};
      Object.keys(sets).forEach(function(k){ Object.keys(sets[k]).forEach(function(x){ set[x] = sets[k][x]; }); });
      Object.keys(set).forEach(function(k){ var el = form.elements.namedItem(k); if(!el) return; el.value = set[k]; if(el.tagName==='SELECT'){ var ev = document.createEvent('Event'); ev.initEvent('change', true, true); el.dispatchEvent(ev); } });
      saveDraft(form, 'enquiry');
    }
    track('quiz_completed', ans);
    announce('Thank you. Your enquiry has been prefilled from these answers.');
    setTimeout(function(){ var enq = document.getElementById('enquire'); if(enq) window.scrollTo({top: enq.getBoundingClientRect().top + window.pageYOffset - 90, behavior: reduced?'auto':'smooth'}); }, reduced ? 300 : 1200);
  }
  f.addEventListener('click', function(e){
    var b = e.target.closest('[data-opt]');
    if(b){
      var q = b.closest('.fit-q'), k = q.getAttribute('data-k'), i = +q.getAttribute('data-q'), s = b.getAttribute('data-set');
      ans[k] = b.getAttribute('data-opt'); delete sets[k]; if(s){ try{ sets[k] = JSON.parse(s); }catch(err){} }
      [].forEach.call(q.querySelectorAll('[data-opt]'), function(x){ x.setAttribute('aria-pressed', x===b ? 'true' : 'false'); });
      if(i+1<n) show(i+1); else finish();
      return;
    }
    if(e.target.closest('[data-fit-back]')){ show(Math.max(0, cur-1), true); return; }
    if(e.target.closest('[data-fit-reset]')){ ans = {}; sets = {}; [].forEach.call(f.querySelectorAll('[data-opt]'), function(x){ x.removeAttribute('aria-pressed'); }); show(0, true); }
  });
}
/* Guide form (brief 3.4, citizenship page): name, email and consent; form guide, lead_source guide. */
function guideForm(){
  var G = D.guideCopy, C = D.config.guide;
  return '<section class="sec light" id="guide"><div class="wrap split"><div>'+eyebrow(G.eyebrow)+mask(G.title,'h2','d2')+
    '<p class="lead" data-r style="--d:.15s;margin-top:26px">'+esc(G.lead)+'</p><p class="small" data-r style="--d:.2s"><b>'+esc(C.title)+'</b>'+(C.file?'':'<br>'+tbc(C.tbc))+'</p></div>'+
    '<div data-r style="--d:.15s"><div class="form-card" data-form="guide" id="guide-card"><form novalidate name="guide" method="post"><input type="hidden" name="form-name" value="guide"><input type="hidden" name="lead_source" value="guide"><input type="hidden" name="site" value="'+esc(D.config.site)+'"><input type="hidden" name="division" value="citizenship"><input type="hidden" name="routed_to" value=""><input type="hidden" name="audience" value="clients">'+trackFields()+'<label class="hp" aria-hidden="true">Leave this empty <input name="company_url" tabindex="-1" autocomplete="off"></label>'+
    '<div class="eyebrow">Request the guide</div>'+
    '<div class="fgrid"><label class="field"><span>Full name</span><input name="name" autocomplete="name" required><em class="em">Please enter your name.</em></label>'+
    '<label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" inputmode="email" required><em class="em">Please enter a valid email address.</em></label></div>'+
    consentBox(C.file ? 'I agree to Imperial Holdings Group sending me the guide and contacting me about it, as described in the {privacy}.' : 'I agree to Imperial Holdings Group contacting me about the guide, as described in the {privacy}.')+
    '<div class="form-foot"><button class="btn gold" type="submit"><span class="lbl">'+esc(C.file ? G.cta : (G.ctaSoon || G.cta))+'</span><span class="spin"></span></button><span class="xs">'+esc(G.note)+'</span></div><div class="form-err" role="alert" hidden></div></form></div></div></div></section>';
}
/* Cloudflare Turnstile (invisible): loaded once, only when config.turnstileSiteKey is set. Each form gets a widget; Turnstile
   writes the token to a hidden cf-turnstile-response input inside the form. The company_url honeypot stays alongside it. */
var TS = {loading:false, q:[]};
function turnstileLoad(cb){
  if(window.turnstile && window.turnstile.render){ cb(); return; }
  TS.q.push(cb); if(TS.loading) return; TS.loading = true;
  window.ihgTurnstileReady = function(){ var q = TS.q; TS.q = []; q.forEach(function(f){ f(); }); };
  var s = document.createElement('script'); s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=ihgTurnstileReady&render=explicit'; s.async = true; s.defer = true; document.head.appendChild(s);
}
function turnstileBind(form){
  var key = D.config.turnstileSiteKey; if(!key) return;
  var box = document.createElement('div'); box.className = 'ts';
  var at = form.querySelector('.form-foot') || (form.querySelector('[data-send]') && form.querySelector('[data-send]').closest('.cf-nav'));
  if(at) at.parentNode.insertBefore(box, at); else form.appendChild(box);
  turnstileLoad(function(){
    if(!document.contains(box) || form._ts != null) return;
    try{ form._ts = window.turnstile.render(box, {sitekey:key, appearance:'interaction-only', theme:'light', action:form.getAttribute('name')||'form', callback:function(tok){ form._tsToken = tok; if(form._tsWait) form._tsWait(tok); }, 'expired-callback':function(){ form._tsToken = ''; try{ window.turnstile.reset(form._ts); }catch(e){} }, 'error-callback':function(){ form._tsToken = ''; if(form._tsWait) form._tsWait(''); }}); }catch(e){}
  });
}
function turnstileToken(form){
  if(!D.config.turnstileSiteKey || !window.turnstile || form._ts == null) return Promise.resolve('');
  var t = ''; try{ t = window.turnstile.getResponse(form._ts) || ''; }catch(e){}
  if(!t) t = form._tsToken || '';
  if(t) return Promise.resolve(t);
  return new Promise(function(ok){ var done = false; form._tsWait = function(tok){ if(done) return; done = true; form._tsWait = null; ok(tok||''); }; try{ window.turnstile.execute(form._ts); }catch(e){} setTimeout(function(){ if(form._tsWait) form._tsWait(''); }, 8000); });
}
function bindForms(){
  [].forEach.call(app.querySelectorAll('[data-form]'), function(wrap){
    var form = wrap.querySelector('form'); if(!form || form._b) return; form._b = true;
    var kind = wrap.getAttribute('data-form');
    [].forEach.call(form.querySelectorAll('input,select,textarea'), function(f){
      var em = f.parentNode.querySelector('.em'); if(em){ em.id = kind+'-'+f.name+'-e'; f.setAttribute('aria-describedby', em.id); }
      f.addEventListener('blur', function(){ if(f.type!=='radio' && (f.value||'').trim()) mark(f, true); });
      f.addEventListener('input', function(){ var b=f.closest('.field,.consent'); if(b && b.classList.contains('err')) mark(f, true); else if(f.type!=='checkbox' && f.type!=='radio') mark(f, false); });
      f.addEventListener('change', function(){ if(f.type==='checkbox') mark(f, f._tried); });
    });
    var errBox = form.querySelector('.form-err'), anchor = wrap.id || (wrap.parentNode && wrap.parentNode.id) || '';
    /* every form carries the tracking fields (rule 7), site and lead_source, even where the template left one out */
    TRK_KEYS.forEach(function(k){ ensureHidden(form, k, TRK[k]||''); }); ensureHidden(form, 'page', ''); ensureHidden(form, 'audience_resolved', '');
    if(kind==='interest') ensureHidden(form, 'audience', 'clients');
    ensureHidden(form, 'site', D.config.site); ensureHidden(form, 'lead_source', 'website');
    ensurePrivacyLink(form);
    disposableList();
    turnstileBind(form);
    var applyCond = bindCond(form);
    /* draft (every form): restore what was typed, keep saving, and offer a clean start */
    draftNote(form);
    var dr = readDraft(kind);
    if(dr && (dr.name || dr.email || dr.msg || dr.quiz_answers)){ restoreDraft(form, dr); applyCond(); var dn = form.querySelector('.draft'); if(dn) dn.hidden = false; }
    form.addEventListener('input', function(){ saveDraft(form, kind); }); form.addEventListener('change', function(){ saveDraft(form, kind); });
    var clr = form.querySelector('[data-clear-draft]');
    if(clr) clr.addEventListener('click', function(){ store.del(draftKey(kind)); if(kind==='contact') store.del('ihg-contact-draft'); render(); var c = document.getElementById(anchor); if(c) c.scrollIntoView({block:'start'}); toast('<b>Cleared.</b> The form is empty again.'); });
    /* qualification: which audience this enquiry belongs to (clients, partners, institutions) */
    function audOf(){
      var a = form.elements.namedItem('audience'); if(a && a.value) return a.value;
      if(kind==='interest') return 'clients';
      var ab = form.querySelector('input[name="about"]:checked'), dv = form.elements.namedItem('division'), v = ab ? ab.value : (dv ? dv.value : '');
      var r = 'clients'; D.enquiry.forEach(function(x){ if(x.v===v && x.aud) r = x.aud; }); return r;
    }
    function val(n){ var f = form.elements.namedItem(n); return f && !f.disabled ? (f.value||'').trim() : ''; }
    /* the control that sends: [data-send] on the three step form (its first submit button is the hidden step 1 Continue), otherwise the form's last submit button */
    function sendButton(){ return form.querySelector('[data-send]') || [].slice.call(form.querySelectorAll('button[type=submit]')).pop(); }
    function busy(btn, on){ btn.classList.toggle('loading', !!on); btn.disabled = !!on; if(on) btn.setAttribute('aria-busy','true'); else btn.removeAttribute('aria-busy'); }
    function showErr(html){ if(!errBox) return; errBox.innerHTML = html; errBox.hidden = false; errBox.setAttribute('tabindex','-1'); errBox.focus({preventScroll:true}); }
    /* an email the backend would refuse: the field is marked with the reason, the step that holds it is shown again */
    function emailProblem(em, disposable){
      var box = em.closest('.field'); if(box){ emailMessage(box, em, disposable); box.classList.add('err'); box.classList.remove('ok'); }
      em.setAttribute('aria-invalid','true');
      var st = em.closest('.cf-step'); if(st && form._showStep && !st.classList.contains('on')) form._showStep(+st.getAttribute('data-step'), true);
      announceInvalid(form, em); em.focus({preventScroll:true});
    }
    function finish(dest, name){
      var btn = sendButton(); busy(btn, true);
      if(errBox) errBox.hidden = true;
      /* honeypot (brief 3.3): nothing is posted. A person whose browser filled the hidden field sees the office contacts, not a spinner. */
      if(form.company_url && form.company_url.value){ busy(btn, false); showErr(fallbackHTML()); return; }
      var extra = {page: location.href, audience_resolved: audOf()};
      if(kind!=='interest') extra.routed_to = dest || 'Imperial Holdings Group';
      var ab = form.querySelector('input[name="about"]:checked'), division = ab ? ab.value : (val('division') || (kind==='interest' ? 'real-estate' : ''));
      var dn = division==='group' ? 'Imperial Holdings Group' : ((div(division)||{}).name || '');
      var info = {kind:kind, name:name, fullName:val('name'), email:val('email'), phone:val('phone'), division:division, divisionName:dn, lead_source:val('lead_source') || 'website'};
      var em = form.elements.namedItem('email');
      disposableList().then(function(){
        if(em && !mark(em, true)){ busy(btn, false); emailProblem(em, disposableEmail(em.value)); return; }
        return turnstileToken(form).then(function(){ return submitLead(form, extra); }).then(function(){
          store.del(draftKey(kind)); if(kind==='contact') store.del('ihg-contact-draft');
          track('enquiry_submitted', {form:kind, division:division, lead_source:info.lead_source});
          if(kind==='guide'){
            var G = D.guideCopy, GC = D.config.guide;
            info.msg = esc(GC.file ? G.ready : G.soon);
            info.inner = GC.file ? '<div class="btns" style="justify-content:center;margin-top:22px"><a class="btn gold" href="'+esc(GC.file)+'" download data-guide><span>Download the guide</span>'+AR+'</a></div>' : '<p>'+tbc(GC.tbc)+'</p>';
          }
          else info.msg = kind==='interest' ? 'Your interest in Imperial Real Estate is noted. We will be in touch when it launches.' : 'Your enquiry is with '+esc(dest)+'. One person will be your point of contact, and will reply to arrange a first conversation.';
          showSuccess(wrap, info, anchor);
        }, function(err){
          busy(btn, false);
          var why = err && err.message;
          if(why==='local'){ showErr('<b>We could not send this just now.</b> Forms only send from the live website, not from a file opened on this computer.'); return; }
          /* the fallback endpoint names the reason; a refused address is a correction, not an outage */
          if((why==='disposable' || why==='email') && em){ showErr('<b>'+(why==='disposable' ? DISPOSABLE_MSG : 'Please check the email address.')+'</b> Nothing has been sent yet.'); emailProblem(em, why==='disposable'); return; }
          showErr(fallbackHTML());
        });
      });
    }
    if(kind==='interest' || kind==='enquiry' || kind==='guide'){
      form.addEventListener('submit', function(e){
        e.preventDefault(); var bad=null;
        [].forEach.call(form.querySelectorAll('[required]'), function(f){ if(f.disabled) return; f._tried=true; if(!mark(f,true) && !bad) bad=f; });
        if(bad){ announceInvalid(form, bad); bad.focus({preventScroll:true}); window.scrollTo({top: bad.getBoundingClientRect().top + window.pageYOffset - 140, behavior: reduced?'auto':'smooth'}); return; }
        var dest = kind==='guide' ? 'Imperial Citizenship' : null;
        if(kind==='enquiry'){ var dv = form.elements.namedItem('division').value; dest = 'the Group team'; D.enquiry.forEach(function(x){ if(x.v===dv){ var d = div(x.to); dest = d ? d.name : 'the Group team'; } }); }
        finish(dest, (form.elements.namedItem('name').value||'').trim().split(' ')[0]);
      });
      return;
    }
    /* contact: three steps with routing */
    var stepEls = [].slice.call(form.querySelectorAll('.cf-step')), prog = [].slice.call(form.querySelectorAll('#cfProg li')), step = 1;
    var titles = ['What it is about','About you','Your message'];
    var radios = form.querySelectorAll('input[name="about"]');
    function chosen(){ return form.querySelector('input[name="about"]:checked'); }
    function upd(){ var c=chosen(), r=document.getElementById('routing'); if(c){ document.getElementById('routingCard').innerHTML = routingHTML(c.value); r.classList.add('show'); form.querySelector('.routes-wrap').classList.remove('err'); } else r.classList.remove('show'); }
    [].forEach.call(radios, function(r){ r.addEventListener('change', upd); });
    upd();
    function destName(){ var c=chosen(), dn='the Group team'; if(c) D.enquiry.forEach(function(x){ if(x.v===c.value){ var d=div(x.to); dn = d ? d.name : 'the Group team'; } }); return dn; }
    function review(){
      var c = chosen(), lbl = ''; D.enquiry.forEach(function(x){ if(c && x.v===c.value) lbl = x.l; });
      var rows = [['About', lbl+' \u2192 '+destName()], ['Name', form.elements.namedItem('name').value], ['Email', form.email.value]];
      if(form.interests.value) rows.splice(1,0,['Interests', form.interests.value]);
      if(form.phone.value.trim()) rows.push(['Phone', form.phone.value]);
      rows.push(['Country', form.country.value], ['Nationality', form.nationality.value], ['For', labelOf(FOR_WHOM, form.for_whom.value)], ['Reply by', form.pref.value]);
      document.getElementById('cfReview').innerHTML = rows.map(function(r){ return '<dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd>'; }).join('')+'<dt class="vh">Change</dt><dd><button class="tlink" type="button" data-edit>Edit these details</button></dd>';
      form.querySelector('[data-edit]').addEventListener('click', function(){ show(2, true); });
    }
    function show(n, back){
      step = n;
      stepEls.forEach(function(s){ var on=+s.getAttribute('data-step')===n; s.classList.toggle('on', on); s.classList.toggle('back', !!back && on); });
      prog.forEach(function(li,i){ li.classList.toggle('done', i<n-1); li.classList.toggle('cur', i===n-1); if(i===n-1) li.setAttribute('aria-current','step'); else li.removeAttribute('aria-current'); });
      if(n===3) review();
      var h = stepEls[n-1].querySelector('h2'); h.focus({preventScroll:true});
      announce('Step '+n+' of 3: '+titles[n-1]);
      var top = wrap.getBoundingClientRect().top; if(top < 70 || top > window.innerHeight*0.6) window.scrollTo({top: top + window.pageYOffset - 110, behavior: reduced?'auto':'smooth'});
    }
    form._showStep = show;
    function check(n){
      if(n===1){ if(!chosen()){ form.querySelector('.routes-wrap').classList.add('err'); return radios[0]; } return null; }
      var bad = null;
      [].forEach.call(stepEls[n-1].querySelectorAll('[required]'), function(f){ if(f.disabled) return; f._tried=true; if(!mark(f,true) && !bad) bad=f; });
      return bad;
    }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var bad = check(step);
      if(bad){ announceInvalid(form, bad); bad.focus({preventScroll:true}); var r=bad.getBoundingClientRect(); if(r.top<90||r.bottom>window.innerHeight) window.scrollTo({top: r.top + window.pageYOffset - 140, behavior: reduced?'auto':'smooth'}); return; }
      if(step<3){ show(step+1); return; }
      finish(destName(), (form.elements.namedItem('name').value||'').trim().split(' ')[0]);
    });
    [].forEach.call(form.querySelectorAll('[data-back]'), function(b){ b.addEventListener('click', function(){ show(Math.max(1,step-1), true); }); });
  });
  bindFit();
}


/* ---------- house finder (home) ---------- */
function finder(){
  var F = D.finder;
  return '<div class="finder" id="finder">'+
    '<div class="fd-qs">'+
      '<div class="fd-q" data-r><div class="fd-h"><span class="fd-n">01</span><h3 class="h3" id="fdQ1">Who is this for?</h3></div>'+
      '<div class="fd-pers" role="radiogroup" aria-labelledby="fdQ1">'+F.personas.map(function(p,i){return '<button type="button" role="radio" aria-checked="false" tabindex="'+(i===0?0:-1)+'" data-per="'+p.k+'"><b>'+esc(p.l)+'</b><small>'+esc(p.s)+'</small></button>';}).join('')+'</div></div>'+
      '<div class="fd-q" data-r><div class="fd-h"><span class="fd-n">02</span><h3 class="h3" id="fdQ2">What matters most?</h3><span class="fd-hint">Choose as many as you like</span></div>'+
      '<div class="amb amb-pick" role="group" aria-labelledby="fdQ2">'+D.ambitions.map(function(a,i){return '<button type="button" aria-pressed="false" data-goal="'+a[0].toLowerCase()+'"><span class="ix">'+pad2(i+1)+'</span><span class="chk" aria-hidden="true">'+TICK+'</span><span class="an">'+a[0]+'</span><p>'+esc(a[1])+'</p></button>';}).join('')+'</div></div>'+
    '</div>'+
    '<div class="fd-res" id="fdRes" role="region" aria-label="Your table" data-r style="--d:.15s"><div class="fd-res-in" id="fdOut" aria-live="polite"></div></div>'+
  '</div>';
}
function finderResult(per, goals){
  var F = D.finder, sc = {};
  D.divisions.forEach(function(d){ sc[d.key]=0; });
  var P = null; F.personas.forEach(function(p){ if(p.k===per) P=p; });
  if(P) Object.keys(P.w).forEach(function(k){ sc[k]+=P.w[k]; });
  goals.forEach(function(g){ var w=F.goals[g]; Object.keys(w).forEach(function(k){ sc[k]+=w[k]; }); });
  var ranked = D.divisions.filter(function(d){ return sc[d.key]>0; }).sort(function(a,b){ return sc[b.key]-sc[a.key] || D.divisions.indexOf(a)-D.divisions.indexOf(b); }).slice(0,3);
  if(!ranked.length) return '<div class="fd-empty"><img src="'+LOGO+'Imperial-Crown-Gold.svg" alt="" width="320" height="175"><h3>Your table</h3><p>Choose who this is for, or what matters most, and we will show which houses would sit at your table.</p><p class="xs">A starting point, not advice. Your Relationship Manager confirms the right house in the first conversation.</p></div>';
  var top = ranked[0], q = 'about='+top.key+(goals.length?'&goals='+goals.join(','):'');
  var cta = top.soon ? '<a class="btn gold" href="#/divisions/real-estate"><span>Register interest</span>'+AR+'</a>' : '<a class="btn gold" href="#/contact?'+q+'"><span>Start the conversation</span>'+AR+'</a>';
  return '<div class="fd-top"><span class="eyebrow">Your table</span><span class="fd-count">'+ranked.length+' of 5 houses</span></div>'+
    '<ol class="fd-list">'+ranked.map(function(d,i){
      var why = F.why[d.key]||{}, lines = goals.map(function(g){ return why[g]; }).filter(Boolean).filter(function(v,j,a){ return a.indexOf(v)===j; });
      if(!lines.length) lines=[why._ || d.line];
      return '<li class="'+(i===0?'lead-house':'')+'" style="--i:'+i+'"><a href="#/divisions/'+d.key+'"><span class="fd-k">'+(i===0?'Start here':'Also at the table')+(d.soon?' \u00b7 Coming soon':'')+'</span><b>'+esc(d.name)+'</b><ul>'+lines.slice(0,2).map(function(l){return '<li>'+esc(l)+'</li>';}).join('')+'</ul><span class="fd-go" aria-hidden="true">'+AR+'</span></a></li>';
    }).join('')+'</ol>'+
    '<div class="fd-cta">'+cta+'<button class="tlink" type="button" data-fd-reset>Start over</button></div>'+
    '<p class="xs fd-note">A starting point, not advice. One Relationship Manager brings in each house when it is needed.</p>';
}
function bindFinder(){
  var f = document.getElementById('finder'); if(!f) return;
  var out = document.getElementById('fdOut'), per = null, goals = [];
  var pers = [].slice.call(f.querySelectorAll('[data-per]')), gs = [].slice.call(f.querySelectorAll('[data-goal]'));
  function draw(){
    pers.forEach(function(b){ var on=b.getAttribute('data-per')===per; b.setAttribute('aria-checked', on); });
    var any = pers.some(function(b){ return b.getAttribute('aria-checked')==='true'; });
    pers.forEach(function(b,i){ b.tabIndex = any ? (b.getAttribute('aria-checked')==='true'?0:-1) : (i===0?0:-1); });
    gs.forEach(function(b){ b.setAttribute('aria-pressed', goals.indexOf(b.getAttribute('data-goal'))>-1); });
    out.innerHTML = finderResult(per, goals);
    out.classList.remove('pop'); if(!reduced){ void out.offsetWidth; out.classList.add('pop'); }
    var rs = out.querySelector('[data-fd-reset]'); if(rs) rs.addEventListener('click', function(){ per=null; goals=[]; draw(); pers[0].focus(); });
  }
  pers.forEach(function(b,i){
    b.addEventListener('click', function(){ var k=b.getAttribute('data-per'); per = per===k ? null : k; draw(); });
    b.addEventListener('keydown', function(e){ var m={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key]; if(!m) return; e.preventDefault(); var n=pers[(i+m+pers.length)%pers.length]; per=n.getAttribute('data-per'); draw(); n.focus(); });
  });
  gs.forEach(function(b){ b.addEventListener('click', function(){ var k=b.getAttribute('data-goal'), j=goals.indexOf(k); if(j>-1) goals.splice(j,1); else goals.push(k); draw(); }); });
  draw();
}

/* ---------- FAQ (disclosure list) ---------- */
function faqList(list, id){
  return '<div class="faq" data-r style="--d:.1s">'+list.map(function(f,i){
    var k = 'faq-'+id+'-'+i;
    return '<div class="faq-i"><h3><button type="button" aria-expanded="false" aria-controls="'+k+'" id="'+k+'-b"><span>'+esc(f.q)+'</span><i class="plus" aria-hidden="true"></i></button></h3>'+
      '<div class="faq-a" id="'+k+'" role="region" aria-labelledby="'+k+'-b"><div><p>'+esc(f.a)+'</p>'+(f.to?'<a class="tlink" href="#'+f.to+'">'+esc(f.tl)+AR+'</a>':'')+'</div></div></div>';
  }).join('')+'</div>';
}
function bindFaq(){
  [].forEach.call(app.querySelectorAll('.faq'), function(fq){
    [].forEach.call(fq.querySelectorAll('.faq-i button'), function(b){
      b.addEventListener('click', function(){ var o = b.getAttribute('aria-expanded')!=='true'; b.setAttribute('aria-expanded', o); b.closest('.faq-i').classList.toggle('open', o); });
    });
  });
  if(curView==='contact' && curQ.faq!=null){
    var b = document.getElementById('faq-c-'+(+curQ.faq)+'-b');
    if(b){ b.click(); pendingScroll = null; setTimeout(function(){ window.scrollTo({top: b.getBoundingClientRect().top + window.pageYOffset - 140, behavior: reduced?'auto':'smooth'}); b.focus({preventScroll:true}); }, first?120:420); }
  }
}

/* ---------- divisions: comparison table ---------- */
function compare(){
  var ds = D.divisions, site = {};
  D.sites.forEach(function(s){ site[s.name]=s; });
  function row(h, f){ return '<tr><th scope="row">'+h+'</th>'+ds.map(function(d){ return '<td>'+f(d)+'</td>'; }).join('')+'</tr>'; }
  return '<section class="sec light"><div class="wrap"><div class="sec-head"><div>'+eyebrow('At a glance')+mask(['Five houses,','side by side.'],'h2','d2')+'</div><p class="lead" data-r style="--d:.15s">Who each house is for and what it covers. Whichever you start with, the same Relationship Manager brings in the others.</p></div>'+
    '<div class="cmp-wrap" data-r tabindex="0" role="region" aria-label="Divisions compared, scrolls sideways"><table class="cmp"><caption class="vh">The five Imperial houses compared</caption><thead><tr><td></td>'+ds.map(function(d){ return '<th scope="col"><a href="#/divisions/'+d.key+'">'+esc(d.short)+AR+'</a><span class="badge'+(d.statusTone==='gold'?' gold':d.soon?' soon':'')+'">'+esc(d.status)+'</span></th>'; }).join('')+'</tr></thead><tbody>'+
    row('For', function(d){ return esc(d.who[0]); })+
    row('Covers', function(d){ return '<ul>'+d.bullets.map(function(b){ return '<li>'+esc(b)+'</li>'; }).join('')+'</ul>'; })+
    row('How it starts', function(d){ return d.how ? esc(d.how[0][0])+': '+esc(d.how[0][1]) : 'Register interest ahead of launch.'; })+
    row('Online', function(d){ var s=site[d.name]; return s && !s.soon ? (s.real ? '<a class="ul" href="'+s.href+'" target="_blank" rel="noopener">'+esc(s.label)+'</a>' : tbc('Link to confirm')) : '<span class="muted">At launch</span>'; })+
    '</tbody></table></div><p class="xs cmp-hint" aria-hidden="true">Swipe sideways to compare</p></div></section>';
}

/* ---------- article sharing ---------- */
var SHARE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v10M6 7l4-4 4 4M4 11v5h12v-5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
var LINK = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8.5 11.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5l-1 1M11.5 8.5a3.5 3.5 0 0 0-5 0L4 11a3.5 3.5 0 0 0 5 5l1-1" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
function shareBar(a, what){
  what = what || 'article';
  return '<div class="share" data-share data-title="'+esc(a.title)+'"><span class="share-l">Share</span>'+
    '<button type="button" data-sh="copy" aria-label="Copy link to this '+what+'">'+LINK+'<span>Copy link</span></button>'+
    '<button type="button" data-sh="native" aria-label="Share this '+what+'" hidden>'+SHARE+'<span>Share</span></button>'+
    '<a data-sh="li" target="_blank" rel="noopener" aria-label="in, share on LinkedIn" href="#">in</a>'+
    '<a data-sh="wa" target="_blank" rel="noopener" aria-label="WA, share on WhatsApp" href="#">WA</a>'+
    '<a data-sh="mail" aria-label="@, share by email" href="#">@</a></div>';
}
function bindShare(){
  [].forEach.call(app.querySelectorAll('[data-share]'), function(s){
    var url = location.href.split('#')[0], t = s.getAttribute('data-title');
    var li = s.querySelector('[data-sh=li]'), wa = s.querySelector('[data-sh=wa]'), ml = s.querySelector('[data-sh=mail]'), nb = s.querySelector('[data-sh=native]');
    li.href = 'https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(url);
    wa.href = 'https://wa.me/?text='+encodeURIComponent(t+' '+url);
    ml.href = 'mailto:?subject='+encodeURIComponent(t)+'&body='+encodeURIComponent(url);
    if(navigator.share && !finePointer){ nb.hidden = false; }
    nb.addEventListener('click', function(){ navigator.share({title:t, url:url}).catch(function(){}); });
    s.querySelector('[data-sh=copy]').addEventListener('click', function(){
      var done = function(){ toast('<b>Link copied.</b> Ready to paste.'); };
      if(navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(done, function(){ prompt('Copy this link', url); });
      else prompt('Copy this link', url);
    });
  });
}

/* ---------- site search (command palette) ---------- */
var pal = document.getElementById('pal'), palIn = document.getElementById('palIn'), palList = document.getElementById('palList'), palEmpty = document.getElementById('palEmpty'), palItems = [], palSel = 0, palRet = null, PIDX = null;
function palIndex(){
  if(PIDX) return PIDX;
  var I = [];
  function add(o){ o.hay = (o.t+' '+(o.kw||'')+' '+(o.s||'')).toLowerCase(); I.push(o); }
  add({k:'Page', t:'Home', s:'One house for a life across borders', u:'/', kw:'start main'});
  add({k:'Page', t:'About the Group', s:'Our story, values and leadership', u:'/about', kw:'about history values leadership team story'});
  add({k:'Page', t:'Our ecosystem', s:'Five divisions, side by side', u:'/divisions', kw:'houses compare divisions ecosystem all'});
  add({k:'Page', t:'Our Network', s:'Private clients, professional partners, institutions and strategic relationships', u:'/', go:'network', kw:'network audiences clients partners institutions strategic journey'});
  add({k:'Page', t:'Events and Journal', s:'Developments, insights, partnerships and selected events', u:'/journal', kw:'journal events gallery photos news articles insights'});
  add({k:'Page', t:'Insights', s:'Notes from the house', u:'/insights', kw:'articles blog guidance insights'});
  add({k:'Page', t:'Speak to us', s:'Start a conversation in three short steps', u:'/contact', kw:'contact enquiry call email phone get in touch book'});
  add({k:'Enquire', t:'Enquire now', s:'Begin with one conversation', u:'/', go:'enquire', kw:'enquiry form contact send message'});
  add({k:'Tool', t:'Find your house', s:'Answer two questions to see which divisions fit', u:'/divisions', go:'finder-sec', kw:'finder quiz match recommend which help'});
  add({k:'Page', t:'Global presence', s:'Dubai headquarters, Lagos hub, 20+ countries', u:'/', go:'where', kw:'offices dubai lagos map locations countries address where we work'});
  add({k:'Page', t:'Leadership', s:'Zaid Al Hindi, Hekma Iskandarani', u:'/about', go:'leadership', kw:'leadership ceo coo founder zaid hekma people'});
  D.events.forEach(function(e){ add({k:'Event', t:e.title, s:e.dek, u:'/journal/events/'+e.slug, img:safePhoto('events/'+e.slug+'/cover-p', eventSafe(e)), v:'', kw:e.city+' '+e.cat+' event gallery'}); });
  add({k:'Page', t:'Privacy notice', s:'How information is handled', u:'/privacy', kw:'privacy data gdpr'});
  add({k:'Page', t:'Terms of use', s:'About this website', u:'/terms', kw:'terms legal'});
  D.divisions.forEach(function(d){ add({k:'Division', t:d.name, s:d.line, u:'/divisions/'+d.key, img:d.img, kw:[d.short, d.status].concat(d.bullets, d.does.map(function(x){return x[0];})).join(' ')}); });
  D.insights.forEach(function(a){ if(a.draft) return; add({k:'Insight', t:a.title, s:a.dek, u:'/insights/'+a.slug, img:a.img, kw:a.cat}); });
  D.faq.forEach(function(f,i){ add({k:'Question', t:f.q, s:f.a, u:'/contact?faq='+i}); });
  D.enquiry.forEach(function(e){ add({k:'Enquire', t:e.l, s:'Start an enquiry, routed to the right house', u:'/contact?about='+e.v, kw:'enquire enquiry contact'}); });
  return (PIDX = I);
}
function palSearch(q){
  var I = palIndex(), toks = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if(!toks.length) return ['Speak to us','Find your house'].map(function(t){ return I.filter(function(x){return x.t===t;})[0]; }).concat(I.filter(function(x){ return x.k==='Division'; }), I.filter(function(x){ return x.k==='Insight'; }).slice(0,1));
  return I.map(function(x){
    var t = x.t.toLowerCase(), sc = 0;
    for(var i=0;i<toks.length;i++){
      var k = toks[i], s = 0;
      if(t.indexOf(k)===0) s = 8; else if(new RegExp('\\b'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(t)) s = 6; else if(t.indexOf(k)>-1) s = 4; else if(x.hay.indexOf(k)>-1) s = 1.5;
      if(!s) return null; sc += s;
    }
    sc += {Division:1.2, Page:1, Tool:1, Event:.8, Insight:.6, Question:.4, Enquire:0}[x.k]||0;
    return {x:x, s:sc};
  }).filter(Boolean).sort(function(a,b){ return b.s-a.s; }).slice(0,9).map(function(r){ return r.x; });
}
function hl(t, q){
  var h = esc(t), toks = q.trim().split(/\s+/).filter(function(k){ return k.length>1; });
  toks.forEach(function(k){ h = h.replace(new RegExp('('+esc(k).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'), '<mark>$1</mark>'); });
  return h;
}
function palDraw(){
  var q = palIn.value; palItems = palSearch(q); palSel = 0;
  palList.innerHTML = (q.trim()?'':'<li class="pal-grp" role="presentation">Suggested</li>')+palItems.map(function(x,i){
    return '<li role="option" id="po-'+i+'" aria-selected="'+(i===0)+'" data-i="'+i+'">'+(x.img?'<img src="'+IMG+x.img+(x.v==null?'-c':x.v)+'.webp" alt="" width="900" height="1125" loading="lazy" decoding="async">':(function(g){ return '<span class="pal-ic'+(g?'':' pal-rule')+'" aria-hidden="true">'+(g||'')+'</span>'; })({Question:'?',Enquire:'\u2192',Tool:'\u2726'}[x.k]))+
      '<span class="pal-t"><b>'+hl(x.t,q)+'</b><small>'+esc(x.s.length>96?x.s.slice(0,94)+'\u2026':x.s)+'</small></span><span class="pal-k">'+x.k+'</span></li>';
  }).join('');
  palEmpty.hidden = palItems.length>0;
  if(!palItems.length) palEmpty.innerHTML = 'Nothing matches \u201c'+esc(q)+'\u201d. Try a division, a country or a question, or <a class="ul" href="#/contact">ask us directly</a>.';
  palIn.setAttribute('aria-activedescendant', palItems.length?'po-0':'');
}
function palMove(n){
  if(!palItems.length) return;
  palSel = (palSel+n+palItems.length)%palItems.length;
  [].forEach.call(palList.querySelectorAll('[role=option]'), function(o,i){ o.setAttribute('aria-selected', i===palSel); if(i===palSel) o.scrollIntoView({block:'nearest'}); });
  palIn.setAttribute('aria-activedescendant','po-'+palSel);
}
function palOpenItem(i){ var x = palItems[i]; if(!x) return; closePal(true); go(x.u, x.go); }
function openPal(){
  if(!pal.hidden) return;
  palRet = document.activeElement; pal.hidden = false; void pal.offsetWidth; body.classList.add('pal-open'); body.style.overflow='hidden';
  palIn.value = ''; palDraw(); setTimeout(function(){ palIn.focus(); }, 20);
}
function closePal(instant){
  if(pal.hidden) return;
  body.classList.remove('pal-open'); body.style.overflow='';
  if(instant || reduced) pal.hidden = true; else setTimeout(function(){ if(!body.classList.contains('pal-open')) pal.hidden = true; }, 260);
  if(!instant && palRet && palRet.focus) palRet.focus({preventScroll:true});
}
palIn.addEventListener('input', palDraw);
palIn.addEventListener('keydown', function(e){
  if(e.key==='ArrowDown'){ e.preventDefault(); palMove(1); }
  else if(e.key==='ArrowUp'){ e.preventDefault(); palMove(-1); }
  else if(e.key==='Enter'){ e.preventDefault(); palOpenItem(palSel); }
  else if(e.key==='Escape'){ e.preventDefault(); closePal(); }
});
palList.addEventListener('click', function(e){ var o = e.target.closest('[role=option]'); if(o) palOpenItem(+o.getAttribute('data-i')); });
palList.addEventListener('mousemove', function(e){ var o = e.target.closest('[role=option]'); if(!o) return; var i=+o.getAttribute('data-i'); if(i!==palSel){ palSel=i-0; palMove(0); } });
pal.addEventListener('click', function(e){ if(e.target.closest('[data-pal-close]')){ closePal(); } if(e.target.closest('#palEmpty a')){ closePal(true); } });
pal.addEventListener('keydown', function(e){ if(e.key==='Tab'){ var f=[palIn, pal.querySelector('.pal-body'), pal.querySelector('.pal-esc')]; var i=f.indexOf(document.activeElement); e.preventDefault(); f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus(); } });
document.addEventListener('keydown', function(e){
  var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement||{}).tagName||'') || (document.activeElement && document.activeElement.isContentEditable);
  if((e.metaKey||e.ctrlKey) && (e.key==='k'||e.key==='K')){ e.preventDefault(); if(pal.hidden) openPal(); else closePal(); }
  else if(e.key==='/' && !typing && pal.hidden){ e.preventDefault(); openPal(); }
});
(function(){ var k=document.getElementById('kbdHint'); if(!k) return; k.textContent=KBD; var b=k.closest('button'); if(b) b.setAttribute('aria-label', 'Search the site, '+KBD); })();

/* ---------- back to top ---------- */
document.getElementById('totop').addEventListener('click', function(){ window.scrollTo({top:0, behavior: reduced?'auto':'smooth'}); var m=document.getElementById('main'); m.focus({preventScroll:true}); });

/* ---------- boot ---------- */
buildChrome();
mqReduce.addEventListener && mqReduce.addEventListener('change', function(e){ reduced = e.matches; render(); });
if(HIST) window.addEventListener('popstate', function(e){ route(e.state && typeof e.state.y==='number' ? e.state.y : 0); });
else window.addEventListener('hashchange', function(){ route(); });
fixLinks(document);
route(history.state && typeof history.state.y==='number' ? history.state.y : undefined);
window.addEventListener('pageshow', tick);

/* ---------- v5: export for the build and the tests ----------
   routes() lists every path that gets its own HTML file (docs/BUILD-CONTRACT.md section 5). Query-string routes are
   not listed. build/build.js renders each one through resolve() inside jsdom and tests/seo.js checks the output.
   routes({published:true}) leaves out the drafts (insights with draft:true): they are prerendered and reachable by
   their address, carry a noindex tag, and stay out of sitemap.xml and journal/feed.xml until approved. */
function allDrafts(){ return D.insights.length > 0 && D.insights.every(function(a){ return !!a.draft; }); }
function routes(opts){
  var published = !!(opts && opts.published), out = ['/', '/about', '/divisions'];
  D.divisions.forEach(function(d){ out.push('/divisions/'+d.key); });
  out.push('/journal');
  D.events.forEach(function(e){ out.push('/journal/events/'+e.slug); });
  if(!(published && allDrafts())) out.push('/insights');   /* the listing stays out of the sitemap while every article is a draft */
  D.insights.forEach(function(a){ if(published && a.draft) return; out.push('/insights/'+a.slug); });
  out.push('/contact', '/privacy', '/terms');
  return out;
}
window.IHG_APP = {routes: routes, resolve: resolve, parse: parse, showError: function(){ showError(null); }};
})();

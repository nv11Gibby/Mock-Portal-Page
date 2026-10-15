/* Imperial ecosystem: one analytics file for every site (docs/BUILD-CONTRACT.md 4.6, brief sections 4 and 7).
   Loads after data.js and before app.js. Reads window.IHG.config.ga4 (the GA4 measurement id, TO CONFIRM: supplied
   by Gilbert). When it is set, gtag.js loads with a cookie-free configuration: consent defaults to denied, no client
   storage, no Google signals, no automatic page view. Page views are sent by the app through window.ihgPageView on
   every route change. When the id is empty nothing loads, and window.ihgTrack only queues what it is given.

   The six conversion events the app sends through ihgTrack(name, params): enquiry_submitted, phone_verified,
   booking_click, whatsapp_click, guide_download, quiz_completed. Mark each one as a conversion in the GA4 property.

   Search Console verification is not done here: build/build.js writes the google-site-verification meta tag into
   every prerendered page when config.searchConsole is set. ES5 on purpose, like the rest of the site. */
(function(){
  'use strict';
  var cfg = (window.IHG && window.IHG.config) || {}, id = String(cfg.ga4 || '').trim(), queue = [], MAX = 50;
  function clean(params){ var o = {}, p = params || {}; for(var k in p){ if(Object.prototype.hasOwnProperty.call(p, k) && p[k] != null) o[k] = p[k]; } return o; }
  if(!id){
    /* Off: a no-op queue, kept so that code calling ihgTrack never has to check first. */
    window.ihgTrack = function(name, params){ if(!name) return; if(queue.length >= MAX) queue.shift(); queue.push({name: String(name), params: clean(params), at: new Date().toISOString()}); };
    window.ihgPageView = function(){};
    window.ihgQueue = queue;
    return;
  }
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  /* Consent Mode defaults: nothing is stored on the device. GA4 then sends cookieless pings only. */
  gtag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', functionality_storage: 'denied', personalization_storage: 'denied', security_storage: 'denied'});
  gtag('js', new Date());
  gtag('config', id, {client_storage: 'none', anonymize_ip: true, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false});
  window.ihgTrack = function(name, params){ if(!name) return; gtag('event', String(name), clean(params)); };
  window.ihgPageView = function(path, title){
    gtag('event', 'page_view', {page_path: path || location.pathname, page_title: title || document.title, page_location: location.href.split('#')[0]});
  };
  /* The library itself. The build removes this element again from prerendered pages (data-ihg-analytics), so the
     browser adds it exactly once. */
  if(!document.querySelector('script[data-ihg-analytics]')){
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id); s.setAttribute('data-ihg-analytics', '');
    document.head.appendChild(s);
  }
})();

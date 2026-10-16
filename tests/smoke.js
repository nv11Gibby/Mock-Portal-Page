/* Smoke test: every route on desktop and mobile, no console or page errors, no broken images, no horizontal overflow.
   The two old #/ links (the preview site is hash routed) must land on their page, not on the home markup the server
   sent: /#/contact must show the contact form and /#/about the About heading.
   Usage: node tests/serve.js <dir> 8765 & then node tests/smoke.js [baseUrl] */
var cp = require('child_process'), path = require('path');
var chromium;
try{ chromium = require('playwright').chromium; }catch(e){ try{ chromium = require(path.join(cp.execSync('npm root -g').toString().trim(), 'playwright')).chromium; }catch(e2){ console.error('playwright not found'); process.exit(2); } }
var BASE = process.argv[2] || 'http://127.0.0.1:8765';
var routes = ['/', '/about', '/divisions', '/divisions/citizenship', '/divisions/partners-club', '/divisions/private-office', '/divisions/real-estate', '/divisions/academy', '/journal', '/journal/events/grenada-51-dubai', '/journal/events/lagos-office-event', '/insights', '/contact', '/contact?about=group&audience=institutions', '/privacy', '/terms', '/does-not-exist', '/#/contact', '/#/about'];
/* what a route must show, beyond loading cleanly */
var expect = {
  '/#/contact': function(i){ return i.contactForm ? '' : 'no contact form (home markup kept after the #/ rewrite)'; },
  '/#/about': function(i){ return /One Group/.test(i.h1 || '') ? '' : 'About heading missing (home markup kept after the #/ rewrite)'; }
};
(async function(){
  var browser = await chromium.launch(), results = [], fails = 0;
  var vps = [{name:'desktop', width:1440, height:900}, {name:'mobile', width:390, height:844, isMobile:true, hasTouch:true}];
  for(var v = 0; v < vps.length; v++){
    var vp = vps[v];
    var ctx = await browser.newContext({viewport:{width:vp.width, height:vp.height}, isMobile:!!vp.isMobile, hasTouch:!!vp.hasTouch, reducedMotion:'reduce'});
    for(var i = 0; i < routes.length; i++){
      var r = routes[i], page = await ctx.newPage(), errs = [];
      page.on('console', function(m){ if(m.type() === 'error') errs.push('console: ' + m.text()); });
      page.on('pageerror', function(e){ errs.push('pageerror: ' + e.message); });
      page.on('requestfailed', function(q){ errs.push('reqfail: ' + q.url()); });
      page.on('response', function(res){ if(res.status() >= 400 && !/does-not-exist/.test(res.url())) errs.push('http ' + res.status() + ': ' + res.url()); });
      await page.goto(BASE + r, {waitUntil:'networkidle'});
      await page.waitForTimeout(300);
      await page.evaluate(async function(){ var h = document.body.scrollHeight; for(var y = 0; y < h; y += 600){ window.scrollTo(0, y); await new Promise(function(ok){ setTimeout(ok, 30); }); } window.scrollTo(0, 0); });
      await page.waitForLoadState('networkidle'); await page.waitForTimeout(200);
      var info = await page.evaluate(function(){
        var imgs = [].slice.call(document.querySelectorAll('img'));
        var broken = imgs.filter(function(i){ return i.complete && i.naturalWidth === 0 && i.getAttribute('src'); }).map(function(i){ return i.getAttribute('src'); });
        var noAlt = imgs.filter(function(i){ return !i.hasAttribute('alt'); }).length;
        return {title: document.title, h1: (document.querySelector('h1') || {}).textContent, imgs: imgs.length, broken: broken, noAlt: noAlt, overflow: document.documentElement.scrollWidth > window.innerWidth + 1, tbc: document.querySelectorAll('.tbc').length, contactForm: !!document.querySelector('#app form[name="contact"]')};
      });
      var miss = expect[r] ? expect[r](info) : ''; if(miss) errs.push('expected: ' + miss);
      var bad = errs.length || info.broken.length || info.overflow || info.noAlt;
      if(bad) fails++;
      results.push({vp: vp.name, r: r, title: info.title, imgs: info.imgs, tbc: info.tbc, broken: info.broken, noAlt: info.noAlt, overflow: info.overflow, errs: errs});
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  results.forEach(function(x){ var bad = x.errs.length || x.broken.length || x.overflow || x.noAlt; console.log((bad ? 'FAIL ' : 'ok   ') + x.vp + ' ' + x.r + ' | ' + x.title + ' | imgs ' + x.imgs + ' tbc ' + x.tbc + (x.noAlt ? ' noAlt ' + x.noAlt : '') + (x.overflow ? ' OVERFLOW' : '') + (x.broken.length ? ' broken: ' + x.broken.join(',') : '') + (x.errs.length ? '\n     ' + x.errs.join('\n     ') : '')); });
  console.log(fails ? 'SMOKE FAILED: ' + fails + ' page(s)' : 'SMOKE OK: ' + results.length + ' page loads clean');
  process.exit(fails ? 1 : 0);
})();

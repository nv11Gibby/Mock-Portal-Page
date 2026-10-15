/* Accessibility check (brief section 8, acceptance test 9.7). Runs axe-core through Playwright on the main page types,
   at desktop and mobile width, and walks every page with the Tab key to confirm that each focused control shows a
   focus indicator (an outline, a box shadow, or the gold rule the search box and the route cards use). The search
   palette and the mobile menu are opened and checked as well.
   Fails on any serious or critical axe violation and on any focused control without an indicator. Moderate and minor
   violations, and the checks axe could not decide (for example text over a photograph), are listed for the report.
   Usage: node tests/serve.js . 8765 & then NODE_PATH=$(npm root -g) node tests/a11y.js [baseUrl]
   axe-core is a devDependency (npm ci); Playwright and Chromium are installed globally. */
var cp = require('child_process'), path = require('path'), fs = require('fs');
var chromium;
try{ chromium = require('playwright').chromium; }catch(e){ try{ chromium = require(path.join(cp.execSync('npm root -g').toString().trim(), 'playwright')).chromium; }catch(e2){ console.error('playwright not found'); process.exit(2); } }
var AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
var BASE = process.argv[2] || 'http://127.0.0.1:8765';
var routes = ['/', '/divisions/citizenship', '/journal/events/grenada-51-dubai', '/contact', '/privacy', '/does-not-exist'];
var vps = [{name:'desktop', width:1440, height:900}, {name:'mobile', width:390, height:844, isMobile:true, hasTouch:true}];
var MAX_TABS = 400;

/* In the page: does the focused element show focus? */
function focusInfo(){
  var el = document.activeElement; if(!el || el === document.body || el === document.documentElement) return null;
  function shows(e){ var c = getComputedStyle(e); return (c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0) || c.boxShadow !== 'none'; }
  var ok = shows(el);
  if(!ok && el.matches('.routes input')){ var rt = el.nextElementSibling; ok = !!rt && shows(rt); }
  if(!ok && el.id === 'palIn'){ var top = el.closest('.pal-top'); ok = !!top && shows(top); }
  var r = el.getBoundingClientRect(), again = !!el._a11yVisited; el._a11yVisited = true;
  return {again: again, ok: ok,
    what: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className ? '.' + String(el.className).trim().split(/\s+/).slice(0, 2).join('.') : '') + ' "' + (el.getAttribute('aria-label') || el.textContent || el.getAttribute('name') || '').trim().replace(/\s+/g, ' ').slice(0, 40) + '"',
    visible: r.width > 0 && r.height > 0, fv: el.matches(':focus-visible')};
}
async function focusWalk(page){
  await page.evaluate(function(){ if(document.activeElement && document.activeElement.blur) document.activeElement.blur(); });
  var count = 0, bad = [];
  await page.evaluate(function(){ [].forEach.call(document.querySelectorAll('*'), function(e){ e._a11yVisited = false; }); });
  for(var i = 0; i < MAX_TABS; i++){
    await page.keyboard.press('Tab');
    var info = await page.evaluate(focusInfo);
    if(!info) break;                                             /* focus left the document: the walk is complete */
    if(info.again) break;                                        /* wrapped (a focus trap, or the page's first control again) */
    count++;
    if(!info.ok) bad.push(info.what + (info.fv ? '' : ' (not :focus-visible)'));
  }
  return {count: count, bad: bad};
}
async function axeRun(page){
  await page.addScriptTag({content: AXE});
  return page.evaluate(function(){
    return window.axe.run(document, {resultTypes: ['violations', 'incomplete']}).then(function(res){
      function pick(list){ return list.map(function(v){ return {id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map(function(n){ return n.target.join(' '); })}; }); }
      return {violations: pick(res.violations), incomplete: pick(res.incomplete)};
    });
  });
}
async function settle(page){
  await page.waitForLoadState('networkidle');
  await page.evaluate(async function(){ var h = document.body.scrollHeight; for(var y = 0; y < h; y += 700){ window.scrollTo(0, y); await new Promise(function(ok){ setTimeout(ok, 20); }); } window.scrollTo(0, 0); });
  await page.waitForTimeout(150);
}

(async function(){
  var browser = await chromium.launch(), rows = [], serious = 0, focusBad = 0;
  for(var v = 0; v < vps.length; v++){
    var vp = vps[v];
    var ctx = await browser.newContext({viewport:{width:vp.width, height:vp.height}, isMobile:!!vp.isMobile, hasTouch:!!vp.hasTouch, reducedMotion:'reduce'});
    for(var i = 0; i < routes.length; i++){
      var r = routes[i], page = await ctx.newPage(), errs = [];
      page.on('pageerror', function(e){ errs.push('pageerror: ' + e.message); });
      await page.goto(BASE + r, {waitUntil:'networkidle'});
      await settle(page);
      var states = [{name: '', open: null}];
      if(r === '/') states.push(vp.isMobile ? {name: ' + mobile menu', open: async function(){ await page.click('#burger'); await page.waitForTimeout(450); }} : {name: ' + search palette', open: async function(){ await page.keyboard.press('Control+K'); await page.waitForTimeout(100); }});
      for(var s = 0; s < states.length; s++){
        var st = states[s];
        if(st.open) await st.open();
        var axe = await axeRun(page);
        var walk = vp.isMobile && !st.open ? null : await focusWalk(page);
        var sc = axe.violations.filter(function(x){ return x.impact === 'serious' || x.impact === 'critical'; });
        serious += sc.length; if(walk) focusBad += walk.bad.length;
        rows.push({vp: vp.name, r: r + st.name, axe: axe, walk: walk, errs: errs.slice()});
        if(st.open){ await page.keyboard.press('Escape'); await page.waitForTimeout(200); }
      }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  var seenV = {}, remaining = [];
  rows.forEach(function(x){
    var sc = x.axe.violations.filter(function(y){ return y.impact === 'serious' || y.impact === 'critical'; });
    var bad = sc.length || (x.walk && x.walk.bad.length) || x.errs.length;
    console.log((bad ? 'FAIL ' : 'ok   ') + x.vp + ' ' + x.r + ' | axe: ' + x.axe.violations.length + ' violation(s), ' + sc.length + ' serious or critical, ' + x.axe.incomplete.length + ' undecided' + (x.walk ? ' | focus walk: ' + x.walk.count + ' controls, ' + x.walk.bad.length + ' without an indicator' : ''));
    x.axe.violations.forEach(function(y){ console.log('     ' + y.impact + ': ' + y.id + ' (' + y.nodes + ') ' + y.help + ' e.g. ' + y.targets.join(' ; ')); var k = y.id + '|' + y.impact; if(!seenV[k]){ seenV[k] = true; remaining.push(y.impact + ' ' + y.id + ': ' + y.help); } });
    x.axe.incomplete.forEach(function(y){ console.log('     undecided: ' + y.id + ' (' + y.nodes + ') e.g. ' + y.targets.slice(0, 2).join(' ; ')); });
    if(x.walk) x.walk.bad.forEach(function(b){ console.log('     no focus indicator: ' + b); });
    x.errs.forEach(function(e){ console.log('     ' + e); });
  });
  if(remaining.length) console.log('Distinct axe findings: ' + remaining.length + '\n  ' + remaining.join('\n  '));
  var fails = serious + focusBad + rows.filter(function(x){ return x.errs.length; }).length;
  console.log(fails ? 'A11Y FAILED: ' + serious + ' serious or critical axe violation(s), ' + focusBad + ' control(s) without a focus indicator' : 'A11Y OK: ' + rows.length + ' checks, no serious or critical axe violation, every focused control shows focus');
  process.exit(fails ? 1 : 0);
})().catch(function(e){ console.error(e); process.exit(1); });

/* Local static server for tests. Serves a directory with single-page fallback, answers POSTs with 200
   (Netlify Forms stand-in) and answers /.netlify/functions/* with a small JSON body.
   --no-fallback (for dist/, which holds a file per route) answers an unknown path with 404 and 404.html, as the host
   does; without it an unknown path without an extension gets index.html with 200, which the source tree needs. */
var http = require('http'), fs = require('fs'), path = require('path');
var ARGS = process.argv.slice(2).filter(function(a){ return a.indexOf('--') !== 0; }), NOFALLBACK = process.argv.indexOf('--no-fallback') > -1;
var ROOT = path.resolve(ARGS[0] || '.'), PORT = parseInt(ARGS[1] || '8765', 10);
var TYPES = {'.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.webp':'image/webp', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.json':'application/json', '.webmanifest':'application/manifest+json', '.xml':'application/xml', '.txt':'text/plain', '.vtt':'text/vtt', '.mp4':'video/mp4', '.ico':'image/x-icon'};
http.createServer(function(req, res){
  var url = req.url.split('?')[0];
  if(req.method === 'POST'){
    var body = ''; req.on('data', function(c){ body += c; });
    req.on('end', function(){
      if(url.indexOf('/.netlify/functions/') === 0){ res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:true, enabled:false, local:true})); return; }
      res.writeHead(200, {'Content-Type':'text/plain'}); res.end('ok');
    });
    return;
  }
  var fp = path.join(ROOT, decodeURIComponent(url));
  var tryFiles = [fp, fp + '.html', path.join(fp, 'index.html'), path.join(ROOT, 'index.html')];
  for(var i = 0; i < tryFiles.length; i++){
    try{ if(fs.statSync(tryFiles[i]).isFile()){ fp = tryFiles[i]; break; } }catch(e){}
  }
  var isFallback = fp === path.join(ROOT, 'index.html') && url !== '/' && url !== '/index.html';
  var ext = path.extname(fp).toLowerCase();
  if(isFallback && /\.[a-z0-9]+$/i.test(url)){ res.writeHead(404); res.end('not found'); return; }
  var status = 200;
  if(isFallback && NOFALLBACK){ status = 404; fp = path.join(ROOT, '404.html'); ext = '.html'; }
  fs.readFile(fp, function(err, data){
    if(err){ res.writeHead(404); res.end('not found'); return; }
    res.writeHead(status, {'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-store'});
    res.end(data);
  });
}).on('error', function(err){
  if(err.code === 'EADDRINUSE'){ console.error('PORT ' + PORT + ' IS ALREADY IN USE. Another test server is running (possibly from another worktree). Stop it, or start this one on a different port and pass that base URL to tests/smoke.js.'); process.exit(3); }
  throw err;
}).listen(PORT, '127.0.0.1', function(){ console.log('serving ' + ROOT + ' on http://127.0.0.1:' + PORT); });

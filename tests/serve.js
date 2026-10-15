/* Local static server for tests. Serves a directory with single-page fallback, answers POSTs with 200
   (Netlify Forms stand-in) and answers /.netlify/functions/* with a small JSON body. */
var http = require('http'), fs = require('fs'), path = require('path');
var ROOT = path.resolve(process.argv[2] || '.'), PORT = parseInt(process.argv[3] || '8765', 10);
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
  fs.readFile(fp, function(err, data){
    if(err){ res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, {'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-store'});
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', function(){ console.log('serving ' + ROOT + ' on http://127.0.0.1:' + PORT); });

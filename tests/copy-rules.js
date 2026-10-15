/* Copy rules from the brief: no em dashes anywhere in copy, code comments or docs. */
var fs = require('fs'), path = require('path');
var ROOT = path.resolve(__dirname, '..');
var files = [];
function walk(d){ fs.readdirSync(d).forEach(function(n){ if(/^(node_modules|dist|\.git|\.netlify)$/.test(n)) return; var p = path.join(d, n); var s = fs.statSync(p); if(s.isDirectory()) walk(p); else if(/\.(html|js|css|md|json|toml|txt|xml|vtt)$/.test(n)) files.push(p); }); }
walk(ROOT);
var bad = [];
files.forEach(function(f){ var t = fs.readFileSync(f, 'utf8'); t.split('\n').forEach(function(line, i){ if(line.indexOf(String.fromCharCode(8212)) > -1) bad.push(path.relative(ROOT, f) + ':' + (i + 1)); }); });
if(bad.length){ console.error('Em dash found in: ' + bad.join(', ')); process.exit(1); }
console.log('copy rules ok (' + files.length + ' files, no em dashes)');

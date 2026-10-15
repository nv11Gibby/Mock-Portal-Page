/* Copy rules from the brief: no em dashes anywhere in copy, code comments or docs. The check looks for the character
   itself and for every way of writing it that would still render one: the JavaScript and JSON escape (backslash, u,
   2014), the CSS escape (backslash, 2014), and the HTML entities (the named one and the decimal and hex numeric ones).
   The patterns are assembled from pieces so this file does not trip its own check. */
var fs = require('fs'), path = require('path');
var ROOT = path.resolve(__dirname, '..');
var files = [];
function walk(d){ fs.readdirSync(d).forEach(function(n){ if(/^(node_modules|dist|\.git|\.netlify)$/.test(n)) return; var p = path.join(d, n); var s = fs.statSync(p); if(s.isDirectory()) walk(p); else if(/\.(html|js|css|md|json|toml|txt|xml|vtt)$/.test(n)) files.push(p); }); }
walk(ROOT);
var FORMS = [
  [String.fromCharCode(8212), 'em dash'],
  ['\\' + 'u2014', 'u2014 escape'],
  ['\\' + '2014', 'CSS 2014 escape'],
  ['&' + 'mdash;', 'mdash entity'],
  ['&#' + '8212;', '8212 entity'],
  ['&#' + 'x2014;', 'x2014 entity']
];
var bad = [];
files.forEach(function(f){
  var t = fs.readFileSync(f, 'utf8');
  t.split('\n').forEach(function(line, i){
    var low = line.toLowerCase();
    FORMS.forEach(function(x){ if(low.indexOf(x[0].toLowerCase()) > -1) bad.push(path.relative(ROOT, f) + ':' + (i + 1) + ' (' + x[1] + ')'); });
  });
});
if(bad.length){ console.error('Em dash found in: ' + bad.join(', ')); process.exit(1); }
console.log('copy rules ok (' + files.length + ' files, no em dashes in any form)');

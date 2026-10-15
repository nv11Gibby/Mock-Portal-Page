/* Input cleaning and validation: field whitelist from the schema, email format, disposable domains, phone normalisation. */
'use strict';

const { schema, disposable } = require('./config');

const DISPOSABLE = new Set(disposable.domains.map((d) => String(d).toLowerCase()));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL_RE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g;

/* Trim, drop control characters, cap the length. Arrays (a field sent twice) are joined. */
function clean(value, max) {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) value = value.filter((v) => v !== undefined && v !== null && v !== '').join(', ');
  let s = String(value).replace(CONTROL_RE, '').trim();
  if (max && s.length > max) s = s.slice(0, max);
  return s;
}

/* Keep only the fields the schema knows, cleaned. An enum value outside the allowed list is treated as not given. */
function pick(raw) {
  const out = {}, fields = schema.fields;
  Object.keys(fields).forEach((k) => {
    if (raw[k] === undefined || raw[k] === null) return;
    const f = fields[k];
    let v = clean(raw[k], f.max || 4000);
    if (f.type === 'enum' && v && f.values.indexOf(v) < 0) v = '';
    if (v !== '') out[k] = v;
  });
  return out;
}

function isDisposable(domain) {
  const parts = String(domain || '').toLowerCase().split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    if (DISPOSABLE.has(parts.slice(i).join('.'))) return true;
  }
  return false;
}

/* {ok:true, email, domain} or {ok:false, reason:'email'|'disposable'} */
function checkEmail(value) {
  const e = clean(value, 254).toLowerCase();
  if (!e || !EMAIL_RE.test(e)) return { ok: false, reason: 'email' };
  const domain = e.split('@').pop();
  if (isDisposable(domain)) return { ok: false, reason: 'disposable' };
  return { ok: true, email: e, domain };
}

/* E.164 when the number carries a country code (+ or 00), otherwise '' (the raw text is still kept on the person).
   A trunk zero written after the country code, as in +234 (0) 902 222 2024 or +44 07700 900123, is dropped: a "(0)"
   group anywhere, and a single 0 straight after the code for the countries the site serves (Nigeria +234, the UAE
   +971, the United Kingdom +44), whose national numbers never start with 0 in E.164. */
const TRUNK_ZERO_RE = /^\+(234|971|44)0(?=\d)/;
function phoneE164(raw) {
  let s = clean(raw, 40);
  if (!s) return '';
  s = s.replace(/\(\s*0\s*\)/g, '').replace(/[\s().-]/g, '');
  if (s.indexOf('00') === 0) s = '+' + s.slice(2);
  if (s.charAt(0) !== '+') return '';
  s = s.replace(TRUNK_ZERO_RE, '+$1');
  return /^\+[1-9]\d{6,14}$/.test(s) ? s : '';
}

function digits(raw) { return String(raw || '').replace(/\D/g, ''); }

/* Two phone numbers are the same when their digits match, or one ends with the other and the shorter has at least
   eight digits once its trunk prefix (a leading 0) is dropped: a local number against the same number with a
   country code. */
function samePhone(a, b) {
  const x = digits(a), y = digits(b);
  if (!x || !y) return false;
  if (x === y) return true;
  const short = (x.length < y.length ? x : y).replace(/^0+/, ''), long = x.length < y.length ? y : x;
  return short.length >= 8 && long.slice(-short.length) === short;
}

function honeypotTripped(raw) { return !!clean(raw && raw.company_url, 500); }

module.exports = { clean, pick, isDisposable, checkEmail, phoneE164, digits, samePhone, honeypotTripped };

/* Input cleaning: phone normalisation to E.164 and the phone comparison the dedupe relies on. */
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { phoneE164, samePhone, checkEmail, clean } = require('../../netlify/functions/lib/validate');

test('phoneE164 keeps a number with a country code and drops the trunk zero written after it', () => {
  assert.equal(phoneE164('+234 902 222 2024'), '+2349022222024');
  assert.equal(phoneE164('00971 4 546 1110'), '+97145461110');
  assert.equal(phoneE164('+234 (0) 902 222 2024'), '+2349022222024', 'a (0) group is dropped');
  assert.equal(phoneE164('+234 0902 222 2024'), '+2349022222024', 'a bare trunk 0 after +234 is dropped');
  assert.equal(phoneE164('+971 (0)50 123 4567'), '+971501234567');
  assert.equal(phoneE164('+44 07700 900123'), '+447700900123');
  assert.equal(phoneE164('+44 (0) 20 7946 0958'), '+442079460958');
  assert.equal(phoneE164('+1 (0) 202 555 0143'), '+12025550143', 'the (0) group goes for any country');
  assert.equal(phoneE164('+1 202 555 0143'), '+12025550143');
  assert.equal(phoneE164('0802 000 0000'), '', 'no country code, no E.164');
  assert.equal(phoneE164('+234 1'), '', 'too short');
  assert.equal(phoneE164(''), '');
});

test('samePhone compares digits and tolerates a trunk prefix against the same number with a country code', () => {
  assert.equal(samePhone('+2348020000000', '0802 000 0000'), true);
  assert.equal(samePhone('+234 802 000 0000', '+2348020000000'), true);
  assert.equal(samePhone('+2348020000000', '+2348020000001'), false);
  assert.equal(samePhone('+2348020000000', '0000'), false, 'a short tail is not a match');
  assert.equal(samePhone('', '+2348020000000'), false);
});

test('checkEmail and clean', () => {
  assert.deepEqual(checkEmail('  Amina@Example.com '), { ok: true, email: 'amina@example.com', domain: 'example.com' });
  assert.equal(checkEmail('nobody').ok, false);
  assert.equal(checkEmail('x@mailinator.com').reason, 'disposable');
  assert.equal(clean(['a', '', 'b']), 'a, b', 'a field sent twice is joined');
  assert.equal(clean('a\u0000b\u0007c', 2), 'ab', 'control characters go, the cap applies');
});

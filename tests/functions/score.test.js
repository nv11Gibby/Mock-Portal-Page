/* The lead score table: hot, warm or exploring from timeline, budget, division fit and source. */
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { scoreLead, sourceMethodKey, titlePrefix } = require('../../netlify/functions/lib/score');

const CASES = [
  ['within 3 months, no budget, single division, organic', { timeline: '3m' }, 'citizenship', 'hot'],
  ['within 3 months, group, paid ads, no budget', { timeline: '3m', gclid: 'x' }, 'group', 'warm'],
  ['within 3 months, under 250k, group, paid', { timeline: '3m', budget: 'under-250k', fbclid: 'y' }, 'group', 'warm'],
  ['3 to 12 months, over 1m, single, referral', { timeline: '3-12m', budget: 'over-1m', utm_medium: 'referral' }, 'real-estate', 'hot'],
  ['3 to 12 months, undisclosed, single, organic', { timeline: '3-12m', budget: 'undisclosed' }, 'private-office', 'warm'],
  ['3 to 12 months, under 250k, group, paid', { timeline: '3-12m', budget: 'under-250k', utm_source: 'google', utm_medium: 'cpc' }, 'group', 'exploring'],
  ['exploring, over 1m, single, referral: capped at warm', { timeline: 'exploring', budget: 'over-1m', utm_medium: 'referral' }, 'citizenship', 'warm'],
  ['exploring, over 1m, single, organic', { timeline: 'exploring', budget: 'over-1m' }, 'citizenship', 'warm'],
  ['exploring, 250k to 500k, single, organic', { timeline: 'exploring', budget: '250k-500k' }, 'citizenship', 'exploring'],
  ['exploring, no budget, single, organic', { timeline: 'exploring' }, 'citizenship', 'exploring'],
  ['no timeline (guide form), single, organic', {}, 'citizenship', 'exploring'],
  ['no timeline, partner introducing a client, over 1m', { for_whom: 'client', budget: 'over-1m' }, 'partners-club', 'warm'],
  ['within 3 months, partner introducing a client', { timeline: '3m', for_whom: 'client' }, 'partners-club', 'hot']
];

CASES.forEach((c) => {
  test('score: ' + c[0] + ' is ' + c[3], () => {
    const s = scoreLead(c[1], c[2]);
    assert.equal(s.band, c[3], JSON.stringify(s));
    assert.ok(s.reasons.length === 4);
  });
});

test('source method keys follow the tracking fields', () => {
  assert.equal(sourceMethodKey({ gclid: 'abc' }), 'google');
  assert.equal(sourceMethodKey({ utm_source: 'google', utm_medium: 'cpc' }), 'google');
  assert.equal(sourceMethodKey({ fbclid: 'abc' }), 'meta');
  assert.equal(sourceMethodKey({ utm_source: 'instagram', utm_medium: 'paid' }), 'meta');
  assert.equal(sourceMethodKey({ utm_source: 'tiktok' }), 'tiktok');
  assert.equal(sourceMethodKey({ utm_medium: 'display' }), 'paid');
  assert.equal(sourceMethodKey({ utm_source: 'linkedin', utm_medium: 'social' }), 'referral');
  assert.equal(sourceMethodKey({ source: 'partner-newsletter' }), 'referral');
  assert.equal(sourceMethodKey({ utm_source: 'google', utm_medium: 'organic' }), 'organic');
  assert.equal(sourceMethodKey({ source: 'direct' }), 'organic');
  assert.equal(sourceMethodKey({}), 'organic');
});

test('title prefix only for hot and warm', () => {
  assert.equal(titlePrefix('hot'), '[HOT] ');
  assert.equal(titlePrefix('warm'), '[WARM] ');
  assert.equal(titlePrefix('exploring'), '');
});

// Unit tests of src/core/severity.ts: the severity class of an item.
// The severity table of the app is a first version, and the SME reviews it. These tests pin
// the table of today. They do not say that a class is right.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SEV_RANK, severityOf } from '../../src/core/severity.ts';
import type { Severity } from '../../src/core/severity.ts';
import type { ContentItem, Domain } from '../../src/core/types.ts';

const item = (id: string, domain: string): ContentItem => ({
  id, domain: domain as Domain, type: 'rule', title: 'made-up item', plain: 'made-up text',
  citation: { source: 'derived', ref: null, relatedRef: null, verbatim: null, trust: 'verified' },
  payload: null,
});

test('severityOf: an item with no override gets the default of its domain', () => {
  const defaults: Record<string, Severity> = {
    securement: 'S3', switching: 'S3', signals: 'S3', authority: 'S3',
    radio: 'S2', operating: 'S2', definitions: 'S1',
  };
  for (const [domain, want] of Object.entries(defaults)) {
    assert.equal(severityOf(item(`test.made-up.${domain}`, domain)), want, domain);
  }
});

test('severityOf: an override by item id wins over the default of the domain', () => {
  assert.equal(severityOf(item('rule.104.1', 'switching')), 'S2');
  assert.equal(severityOf(item('rule.123', 'radio')), 'S3');
});

test('severityOf: an override applies in each domain', () => {
  assert.equal(severityOf(item('rule.12', 'definitions')), 'S3');
});

test('severityOf: an item of a domain that the table does not hold gets S2', () => {
  assert.equal(severityOf(item('test.made-up.other', 'protection')), 'S2');
  assert.equal(severityOf(item('test.made-up.none', 'no-such-domain')), 'S2');
});

test('SEV_RANK: S3 sorts first, then S2, then S1', () => {
  assert.deepEqual(SEV_RANK, { S3: 0, S2: 1, S1: 2 });
  const sorted = (['S1', 'S3', 'S2'] as Severity[]).sort((a, b) => SEV_RANK[a] - SEV_RANK[b]);
  assert.deepEqual(sorted, ['S3', 'S2', 'S1']);
});

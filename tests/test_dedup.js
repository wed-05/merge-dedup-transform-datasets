'use strict';

const assert = require('assert');
const path = require('path');
const { deduplicate, buildKey, getNestedValue } = require('../src/utils/deduplication');

function runDedupTests() {
  // Basic deduplication on simple fields
  const items = [
    { id: '1', name: 'alpha' },
    { id: '2', name: 'beta' },
    { id: '1', name: 'alpha' },
    { id: '3', name: 'gamma' },
    { id: '2', name: 'beta' },
  ];

  const { items: unique, duplicates, stats } = deduplicate(items, ['id', 'name']);

  assert.strictEqual(unique.length, 3, 'Expected 3 unique items');
  assert.strictEqual(duplicates.length, 2, 'Expected 2 duplicate items');
  assert.strictEqual(stats.inputCount, 5, 'Stats inputCount mismatch');
  assert.strictEqual(stats.outputCount, 3, 'Stats outputCount mismatch');
  assert.strictEqual(stats.duplicateCount, 2, 'Stats duplicateCount mismatch');

  // Nested field resolution
  const nestedItem = {
    id: 1,
    meta: {
      owner: {
        name: 'Zeeshan',
      },
    },
  };
  assert.strictEqual(
    getNestedValue(nestedItem, 'meta.owner.name'),
    'Zeeshan',
    'Nested value resolution failed'
  );
  assert.strictEqual(
    getNestedValue(nestedItem, 'meta.owner.missing'),
    undefined,
    'Missing nested value should be undefined'
  );

  // Key stability
  const key1 = buildKey({ id: 1, name: 'x' }, ['id', 'name']);
  const key2 = buildKey({ name: 'x', id: 1 }, ['id', 'name']);
  assert.strictEqual(
    key1,
    key2,
    'Keys for structurally equivalent objects should match'
  );
}

try {
  runDedupTests();
  console.log('test_dedup.js: All tests passed');
} catch (err) {
  console.error('test_dedup.js: Test failed:', err.message);
  process.exitCode = 1;
}
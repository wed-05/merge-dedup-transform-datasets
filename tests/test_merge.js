'use strict';

const assert = require('assert');
const { mergeBatches } = require('../src/utils/merging');

function runMergeTests() {
  const batches = [
    {
      datasetId: 'dataset-A',
      datasetOffset: 0,
      items: [
        { id: '1', name: 'alpha' },
        { id: '2', name: 'beta' },
      ],
    },
    {
      datasetId: 'dataset-B',
      datasetOffset: 10,
      items: [{ id: '3', name: 'gamma' }],
    },
  ];

  const { mergedItems, context } = mergeBatches(batches);

  assert.strictEqual(mergedItems.length, 3, 'Expected 3 merged items');
  assert.strictEqual(context.batchCount, 2, 'Expected 2 batches');
  assert.strictEqual(context.totalInputItems, 3, 'Expected 3 input items');

  const first = mergedItems[0];
  assert.strictEqual(first.__datasetId, 'dataset-A', 'Metadata __datasetId mismatch');
  assert.strictEqual(first.__datasetOffset, 0, 'Metadata __datasetOffset mismatch');

  const third = mergedItems[2];
  assert.strictEqual(third.__datasetId, 'dataset-B', 'Metadata __datasetId mismatch');
  assert.strictEqual(third.__datasetOffset, 10, 'Metadata __datasetOffset mismatch');
}

try {
  runMergeTests();
  console.log('test_merge.js: All tests passed');
} catch (err) {
  console.error('test_merge.js: Test failed:', err.message);
  process.exitCode = 1;
}
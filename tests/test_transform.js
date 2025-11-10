'use strict';

const assert = require('assert');
const {
  normalizeStrings,
  sortById,
  getTransformFunctions,
} = require('../src/utils/transformations');

function runTransformTests() {
  // normalizeStrings
  const item = {
    id: '  10 ',
    name: '  Adidas Shoes  ',
    description: '  some  text   here ',
  };

  const result = normalizeStrings(item, {});

  assert.strictEqual(result.id.trim(), '10', 'ID should be trimmed');
  assert.strictEqual(
    result.name,
    'adidas shoes',
    'Name should be trimmed and lowercased'
  );
  assert.strictEqual(
    result.description,
    'some text here',
    'Description whitespace should be normalised'
  );

  // sortById
  const sorted = sortById(
    [
      { id: 'b', name: 'two' },
      { id: 'a', name: 'one' },
      { id: 'c', name: 'three' },
    ],
    {}
  );

  assert.strictEqual(sorted[0].id, 'a', 'First id should be "a"');
  assert.strictEqual(sorted[1].id, 'b', 'Second id should be "b"');
  assert.strictEqual(sorted[2].id, 'c', 'Third id should be "c"');

  // getTransformFunctions wiring
  const { preTransform, postTransform } = getTransformFunctions(
    'normalizeStrings',
    'sortById'
  );

  const transformedItem = preTransform(
    { id: '1', name: '  Test Name  ' },
    {}
  );
  assert.strictEqual(
    transformedItem.name,
    'test name',
    'preTransform should normalise name'
  );

  const afterPost = postTransform(
    [
      { id: '2', name: 'two' },
      { id: '1', name: 'one' },
    ],
    {}
  );
  assert.strictEqual(
    afterPost[0].id,
    '1',
    'postTransform should sort items by id'
  );
}

try {
  runTransformTests();
  console.log('test_transform.js: All tests passed');
} catch (err) {
  console.error('test_transform.js: Test failed:', err.message);
  process.exitCode = 1;
}
onst { expect } = require('chai');
const { deduplicate } = require('../src/modules/deduplicator');

describe('deduplicate', () => {
  it('removes duplicates based on single field', () => {
    const items = [
      { id: '1', name: 'A' },
      { id: '1', name: 'B' },
      { id: '2', name: 'A' }
    ];

    const { items: deduped, duplicateCount } = deduplicate(items, ['id']);

    expect(deduped).to.have.lengthOf(2);
    expect(duplicateCount).to.equal(1);
    const ids = deduped.map((x) => x.id);
    expect(ids).to.deep.equal(['1', '2']);
  });

  it('removes duplicates based on multiple fields', () => {
    const items = [
      { id: '1', name: 'A' },
      { id: '1', name: 'A' },
      { id: '1', name: 'B' }
    ];

    const { items: deduped, duplicateCount } = deduplicate(items, ['id', 'name']);

    expect(deduped).to.have.lengthOf(2);
    expect(duplicateCount).to.equal(1);
  });

  it('throws on invalid items parameter', () => {
    expect(() => deduplicate(null, ['id'])).to.throw(TypeError);
  });

  it('throws on empty fields array', () => {
    expect(() => deduplicate([], [])).to.throw(TypeError);
  });
});
onst { expect } = require('chai');
const { mergeDatasets } = require('../src/modules/merger');

describe('mergeDatasets', () => {
  it('merges multiple datasets preserving order', () => {
    const ds1 = [
      { id: 1 },
      { id: 2 }
    ];
    const ds2 = [
      { id: 3 },
      { id: 4 }
    ];
    const result = mergeDatasets([ds1, ds2]);

    expect(result).to.have.lengthOf(4);
    expect(result.map((x) => x.id)).to.deep.equal([1, 2, 3, 4]);
  });

  it('handles empty list of datasets', () => {
    const result = mergeDatasets([]);
    expect(result).to.deep.equal([]);
  });

  it('throws on non-array datasets parameter', () => {
    expect(() => mergeDatasets({})).to.throw(TypeError);
  });

  it('throws when a dataset is not an array', () => {
    expect(() => mergeDatasets([[{ id: 1 }], 'not-array'])).to.throw(TypeError);
  });
});
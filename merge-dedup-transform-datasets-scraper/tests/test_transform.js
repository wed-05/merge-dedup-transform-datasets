onst { expect } = require('chai');
const { runTransforms } = require('../src/modules/transformer');

describe('runTransforms', () => {
  it('applies preTransform and postTransform in sequence', () => {
    const items = [
      { id: 1, value: ' a ' },
      { id: 2, value: ' b ' }
    ];

    const preTransform = (item) => ({
      ...item,
      value: item.value.trim()
    });

    const postTransform = (item) => ({
      ...item,
      value: item.value.toUpperCase()
    });

    const result = runTransforms(items, { preTransform, postTransform });

    expect(result).to.have.lengthOf(2);
    expect(result[0].value).to.equal('A');
    expect(result[1].value).to.equal('B');
  });

  it('handles missing transforms gracefully', () => {
    const items = [{ id: 1 }];
    const result = runTransforms(items, {});

    expect(result).to.deep.equal(items);
  });

  it('throws on non-array items parameter', () => {
    expect(() => runTransforms(null, {})).to.throw(TypeError);
  });
});
onst { logInfo } = require('./utils');

/**
 * Merge multiple datasets (arrays of objects) preserving order.
 * @param {Array<Array<object>>} datasets
 * @returns {Array<object>}
 */
function mergeDatasets(datasets) {
  if (!Array.isArray(datasets)) {
    throw new TypeError('mergeDatasets expects an array of datasets.');
  }

  const result = [];
  let total = 0;

  for (let i = 0; i < datasets.length; i += 1) {
    const ds = datasets[i];
    if (!Array.isArray(ds)) {
      throw new TypeError(`Dataset at index ${i} is not an array.`);
    }
    for (const item of ds) {
      result.push(item);
      total += 1;
    }
  }

  logInfo(`mergeDatasets: merged ${datasets.length} dataset(s), total items = ${total}`);
  return result;
}

module.exports = {
  mergeDatasets
};
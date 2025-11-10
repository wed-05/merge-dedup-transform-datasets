onst { logInfo } = require('./utils');

/**
 * Apply pre- and post-transformation functions to items.
 * @param {Array<object>} items
 * @param {{ preTransform?: (item: any) => any, postTransform?: (item: any) => any }} options
 * @returns {Array<object>}
 */
function runTransforms(items, options = {}) {
  const { preTransform, postTransform } = options;

  if (!Array.isArray(items)) {
    throw new TypeError('runTransforms expects an array of items.');
  }

  let working = items;

  if (typeof preTransform === 'function') {
    working = working.map((item, index) => {
      try {
        return preTransform(item, index);
      } catch (err) {
        // If transform throws, keep original item
        return item;
      }
    });
    logInfo(`runTransforms: applied preTransform to ${items.length} items.`);
  }

  if (typeof postTransform === 'function') {
    working = working.map((item, index) => {
      try {
        return postTransform(item, index);
      } catch (err) {
        return item;
      }
    });
    logInfo(`runTransforms: applied postTransform to ${items.length} items.`);
  }

  return working;
}

module.exports = {
  runTransforms
};
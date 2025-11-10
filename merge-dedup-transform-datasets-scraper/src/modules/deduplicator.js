onst { buildDedupKey, logInfo } = require('./utils');

/**
 * Deduplicate items based on one or more fields.
 * @param {Array<object>} items
 * @param {Array<string>} fields
 * @returns {{ items: Array<object>, duplicateCount: number }}
 */
function deduplicate(items, fields) {
  if (!Array.isArray(items)) {
    throw new TypeError('deduplicate expects an array of items.');
  }
  if (!Array.isArray(fields) || fields.length === 0) {
    throw new TypeError('deduplicate expects a non-empty array of fields.');
  }

  const seen = new Set();
  const output = [];
  let duplicateCount = 0;

  for (const item of items) {
    const key = buildDedupKey(item, fields);
    if (seen.has(key)) {
      duplicateCount += 1;
      continue;
    }
    seen.add(key);
    output.push(item);
  }

  logInfo(`deduplicate: input=${items.length}, output=${output.length}, duplicates=${duplicateCount}`);

  return {
    items: output,
    duplicateCount
  };
}

module.exports = {
  deduplicate
};
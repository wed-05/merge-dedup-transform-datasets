onst path = require('path');
const { writeJsonFile, logInfo, logError } = require('../modules/utils');

/**
* Export items into a KV-store-like structure.
* @param {Array<object>} items
* @param {{ filePath: string, keyField: string }} options
* @returns {Promise<void>}
*/
async function exportToKvStore(items, options) {
const { filePath, keyField } = options || {};
if (!filePath) {
throw new Error('exportToKvStore requires filePath in options.');
}
if (!keyField) {
throw new Error('exportToKvStore requires keyField in options.');
}

const kv = {};
for (const item of items) {
const key = item[keyField];
if (key == null) {
// Skip records without the key field
// eslint-disable-next-line no-continue
continue;
}
kv[String(key)] = item;
}

const absPath = path.resolve(filePath);

try {
await writeJsonFile(absPath, kv);
logInfo(
`exportToKvStore: exported ${Object.keys(kv).length} entries using keyField "${keyField}".`
);
} catch (err) {
logError(`exportToKvStore failed: ${err.message}`);
throw err;
}
}

module.exports = {
exportToKvStore
};
onst fs = require('fs');
const fsp = fs.promises;
const path = require('path');

/**
* Simple informational logger.
* @param {string} message
*/
function logInfo(message) {
const ts = new Date().toISOString();
// eslint-disable-next-line no-console
console.log(`[INFO] [${ts}] ${message}`);
}

/**
* Simple error logger.
* @param {string} message
*/
function logError(message) {
const ts = new Date().toISOString();
// eslint-disable-next-line no-console
console.error(`[ERROR] [${ts}] ${message}`);
}

/**
* Safely access nested properties using dot-notation paths.
* @param {object} obj
* @param {string} fieldPath
* @returns {any}
*/
function deepGet(obj, fieldPath) {
if (!obj || typeof obj !== 'object') return undefined;
if (!fieldPath) return undefined;

const segments = fieldPath.split('.');
let current = obj;

for (const segment of segments) {
if (current == null || typeof current !== 'object') {
return undefined;
}
if (!(segment in current)) {
return undefined;
}
current = current[segment];
}

return current;
}

/**
* Build a unique key for deduplication based on specified fields.
* @param {object} item
* @param {Array<string>} fields
* @returns {string}
*/
function buildDedupKey(item, fields) {
const parts = fields.map((field) => {
const value = deepGet(item, field);
if (value === undefined) return '__MISSING__';
try {
return JSON.stringify(value);
} catch (err) {
return String(value);
}
});

return parts.join('|');
}

/**
* Read JSON file from disk.
* @param {string} filePath
* @returns {Promise<any>}
*/
async function readJsonFile(filePath) {
const abs = path.resolve(filePath);
try {
const data = await fsp.readFile(abs, 'utf8');
return JSON.parse(data);
} catch (err) {
logError(`Failed to read JSON from ${abs}: ${err.message}`);
throw err;
}
}

/**
* Write JSON file to disk with pretty formatting.
* @param {string} filePath
* @param {any} value
* @returns {Promise<void>}
*/
async function writeJsonFile(filePath, value) {
const abs = path.resolve(filePath);
const dir = path.dirname(abs);
await fsp.mkdir(dir, { recursive: true });

const json = JSON.stringify(value, null, 2);
try {
await fsp.writeFile(abs, json, 'utf8');
} catch (err) {
logError(`Failed to write JSON to ${abs}: ${err.message}`);
throw err;
}
}

module.exports = {
logInfo,
logError,
deepGet,
buildDedupKey,
readJsonFile,
writeJsonFile
};
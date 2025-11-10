onst path = require('path');
const { readJsonFile, writeJsonFile, logInfo, logError } = require('./modules/utils');
const { mergeDatasets } = require('./modules/merger');
const { deduplicate } = require('./modules/deduplicator');
const { runTransforms } = require('./modules/transformer');
const { exportToKvStore } = require('./output/kvstore_exporter');

async function loadConfig() {
const configPath =
process.env.DATASET_CONFIG_PATH ||
path.join(__dirname, 'config', 'settings.example.json');

return readJsonFile(configPath);
}

async function main() {
try {
const rootDir = path.resolve(__dirname, '..');
const config = await loadConfig();

const {
inputFiles,
mergedOutputFile,
dedupOutputFile,
kvStoreOutputFile,
dedupFields
} = config;

if (!Array.isArray(inputFiles) || inputFiles.length === 0) {
throw new Error('No inputFiles defined in configuration.');
}

const datasets = [];
for (const relPath of inputFiles) {
const absPath = path.resolve(rootDir, relPath);
logInfo(`Reading dataset from ${absPath}`);
const datasetJson = await readJsonFile(absPath);

// Support structure: { datasetId, datasets: [ [...], [...], ... ] }
if (Array.isArray(datasetJson.datasets)) {
for (const ds of datasetJson.datasets) {
if (Array.isArray(ds)) {
datasets.push(ds);
}
}
} else if (Array.isArray(datasetJson)) {
datasets.push(datasetJson);
} else {
throw new Error(
`Unsupported dataset format in ${relPath}. Expected array or { datasets: [] }`
);
}
}

const datasetId = config.datasetId || 'dataset_001';
const datasetOffset = config.datasetOffset || 0;

const mergedData = mergeDatasets(datasets);
const recordCount = mergedData.length;

logInfo(`Merged ${datasets.length} dataset(s) into ${recordCount} records.`);

// Example pre/post transforms — these can be customized or replaced
const preTransform = (item) => {
const result = { ...item };
if (typeof result.name === 'string') {
result.name = result.name.trim();
}
return result;
};

const postTransform = (item) => {
const result = { ...item };
if (!result.category) {
result.category = config.defaultCategory || 'General';
}
return result;
};

const preTransformed = runTransforms(mergedData, { preTransform });
const { items: dedupedItems, duplicateCount } = deduplicate(preTransformed, dedupFields);
const transformedData = runTransforms(dedupedItems, { postTransform });

const mergedOutputPath = path.resolve(rootDir, mergedOutputFile);
const dedupOutputPath = path.resolve(rootDir, dedupOutputFile);
const kvStorePath = path.resolve(rootDir, kvStoreOutputFile);

await writeJsonFile(mergedOutputPath, mergedData);
await writeJsonFile(dedupOutputPath, [
{
datasetId,
datasetOffset,
dedupFields,
mergedData,
transformedData,
duplicateCount,
recordCount
}
]);

logInfo(`Merged output written to ${mergedOutputPath}`);
logInfo(`Deduplication result written to ${dedupOutputPath}`);

await exportToKvStore(transformedData, {
filePath: kvStorePath,
keyField: dedupFields[0] || 'id'
});

logInfo(`KV store export written to ${kvStorePath}`);
} catch (err) {
logError(err.message || String(err));
process.exitCode = 1;
}
}

if (require.main === module) {
main();
}

module.exports = { main };
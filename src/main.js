'use strict';

const fs = require('fs');
const path = require('path');
const { deduplicate } = require('./utils/deduplication');
const { mergeBatches } = require('./utils/merging');
const { getTransformFunctions } = require('./utils/transformations');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

function loadConfig(defaultConfigPath, overridePath, cliArgs) {
  const resolvedPath = overridePath
    ? path.resolve(overridePath)
    : defaultConfigPath;

  let config = {};
  if (fs.existsSync(resolvedPath)) {
    try {
      const raw = fs.readFileSync(resolvedPath, 'utf8');
      config = JSON.parse(raw);
    } catch (err) {
      console.error(`[ERROR] Failed to read config at ${resolvedPath}:`, err.message);
    }
  }

  if (cliArgs.dedupFields) {
    config.dedupFields = String(cliArgs.dedupFields)
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
  }

  if (cliArgs.outputMode) {
    config.outputMode = String(cliArgs.outputMode).trim();
  }

  if (!config.dedupFields || !Array.isArray(config.dedupFields)) {
    config.dedupFields = [];
  }

  if (!config.outputMode) {
    config.outputMode = 'dataset';
  }

  if (!config.preTransform) {
    config.preTransform = 'normalizeStrings';
  }

  if (!config.postTransform) {
    config.postTransform = 'sortById';
  }

  if (!config.logLevel) {
    config.logLevel = 'info';
  }

  return config;
}

function loadInput(inputPath) {
  const resolved = path.resolve(inputPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Input file does not exist: ${resolved}`);
  }
  const raw = fs.readFileSync(resolved, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse JSON from input file: ${err.message}`);
  }
}

function normaliseToBatches(input, fallbackDatasetId) {
  if (!Array.isArray(input)) {
    throw new Error('Input JSON must be an array.');
  }

  const looksLikeBatches =
    input.length > 0 && input[0] && typeof input[0] === 'object' && Array.isArray(input[0].items);

  if (looksLikeBatches) {
    return input.map((batch, idx) => ({
      datasetId: batch.datasetId || `${fallbackDatasetId || 'dataset'}-${idx}`,
      datasetOffset: typeof batch.datasetOffset === 'number' ? batch.datasetOffset : 0,
      items: Array.isArray(batch.items) ? batch.items : [],
    }));
  }

  return [
    {
      datasetId: fallbackDatasetId || 'dataset-0',
      datasetOffset: 0,
      items: input,
    },
  ];
}

function writeOutput(outputPath, payload) {
  const resolved = path.resolve(outputPath);
  const dir = path.dirname(resolved);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = JSON.stringify(payload, null, 2);
  fs.writeFileSync(resolved, content, 'utf8');
}

function shouldLog(level, config) {
  const order = ['error', 'warn', 'info', 'debug'];
  const cfgLevel = config.logLevel || 'info';
  return order.indexOf(level) <= order.indexOf(cfgLevel);
}

function log(level, message, meta, config) {
  if (!shouldLog(level, config)) return;
  const time = new Date().toISOString();
  const base = `[${time}] [${level.toUpperCase()}] ${message}`;
  if (meta) {
    console.log(base, meta);
  } else {
    console.log(base);
  }
}

function main() {
  try {
    const args = parseArgs(process.argv);
    const projectRoot = path.resolve(__dirname, '..');

    const inputPath =
      args.input || path.join(projectRoot, 'data', 'input.sample.json');
    const outputPath =
      args.output || path.join(projectRoot, 'data', 'output.sample.json');
    const defaultConfigPath = path.join(
      projectRoot,
      'src',
      'config',
      'settings.example.json'
    );

    const config = loadConfig(defaultConfigPath, args.config, args);

    log('info', 'Starting merge-dedup-transform pipeline', { inputPath, outputPath }, config);

    const input = loadInput(inputPath);
    const batches = normaliseToBatches(input, path.basename(inputPath));

    const { preTransform, postTransform } = getTransformFunctions(
      config.preTransform,
      config.postTransform
    );

    const transformedBatches = batches.map((batch) => {
      const ctx = {
        datasetId: batch.datasetId,
        datasetOffset: batch.datasetOffset,
      };
      const items = batch.items.map((item) => preTransform(item, ctx));
      return {
        datasetId: batch.datasetId,
        datasetOffset: batch.datasetOffset,
        items,
      };
    });

    const { mergedItems, context } = mergeBatches(transformedBatches);

    log(
      'info',
      'Merged batches',
      { batchCount: context.batchCount, totalInputItems: context.totalInputItems },
      config
    );

    const dedupResult = deduplicate(mergedItems, config.dedupFields);

    log('info', 'Deduplication complete', dedupResult.stats, config);

    const finalItems = postTransform(dedupResult.items, {
      ...context,
      stats: dedupResult.stats,
    });

    const outputPayload = [
      {
        datasetId: 'merged',
        datasetOffset: 0,
        items: finalItems,
        dedupFields: config.dedupFields,
        outputMode: config.outputMode,
        transformationFunctions: [config.preTransform, config.postTransform],
        stats: dedupResult.stats,
      },
    ];

    writeOutput(outputPath, outputPayload);

    log(
      'info',
      'Processing complete',
      {
        outputPath: path.resolve(outputPath),
        outputItems: finalItems.length,
        duplicatesRemoved: dedupResult.stats.duplicateCount,
      },
      config
    );
  } catch (err) {
    console.error('[FATAL] Unhandled error in main pipeline:', err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
  parseArgs,
  loadConfig,
  loadInput,
  normaliseToBatches,
  writeOutput,
};
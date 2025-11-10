'use strict';

/**
 * Merge an array of dataset batches into a single flat list of items.
 * Each batch:
 * {
 *   datasetId: string,
 *   datasetOffset: number,
 *   items: Array<object>
 * }
 *
 * Each resulting item carries metadata:
 *   __datasetId
 *   __datasetOffset
 */
function mergeBatches(batches) {
  if (!Array.isArray(batches)) {
    return { mergedItems: [], context: { batchCount: 0, totalInputItems: 0 } };
  }

  const mergedItems = [];
  const context = {
    batchCount: batches.length,
    totalInputItems: 0,
  };

  for (const batch of batches) {
    const datasetId = batch.datasetId || 'dataset';
    const datasetOffset =
      typeof batch.datasetOffset === 'number' ? batch.datasetOffset : 0;
    const items = Array.isArray(batch.items) ? batch.items : [];

    context.totalInputItems += items.length;

    for (const item of items) {
      const enriched = Object.assign({}, item, {
        __datasetId: datasetId,
        __datasetOffset: datasetOffset,
      });
      mergedItems.push(enriched);
    }
  }

  return { mergedItems, context };
}

module.exports = {
  mergeBatches,
};